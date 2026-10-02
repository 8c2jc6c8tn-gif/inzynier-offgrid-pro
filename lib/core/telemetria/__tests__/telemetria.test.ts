import { describe, expect, it } from "vitest"
import { parsujKoperte, skladajLinie } from "../koperta-esp32"
import { parsujCsv, naglowkiCsv, wykryjSeparator, type ProfilCsv } from "../csv"
import { ocenJakosc, usunDuplikaty } from "../jakosc"
import { generujDemo } from "../symulator"
import { przeliczJednostke, zbudujProbke } from "../probka"

describe("probka", () => {
  it("flags out-of-range and missing values explicitly", () => {
    expect(zbudujProbke({ zrodloId: "a", kanal: "k", czas: 0, wielkosc: "soc", wartosc: 120 }).jakosc).toBe("poza-zakresem")
    const brak = zbudujProbke({ zrodloId: "a", kanal: "k", czas: 0, wielkosc: "soc", wartosc: null })
    expect(brak.jakosc).toBe("brak")
    expect(brak.wartosc).toBeNull()
  })
  it("converts units, rejects unknown ones", () => {
    expect(przeliczJednostke("moc", 2, "kW")).toBe(2000)
    expect(przeliczJednostke("temperatura", 273.15, "K")).toBeCloseTo(0)
    expect(przeliczJednostke("moc", 1, "xyz")).toBeNull()
  })
})

describe("koperta ESP32", () => {
  const ok = JSON.stringify({ s: 1, d: "esp1", t: 1000, c: [{ k: "bms", w: "napiecie", v: 51200, u: "mV" }, { k: "bms", w: "soc", v: null, u: "%" }] })
  it("normalises units and keeps null as no data", () => {
    const r = parsujKoperte(ok, "z1")
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.wynik.probki[0]).toMatchObject({ kanal: "esp1/bms", czas: 1_000_000, wartosc: 51.2, jakosc: "ok" })
      expect(r.wynik.probki[1].jakosc).toBe("brak")
    }
  })
  it("reports unknown quantity/unit instead of dropping silently", () => {
    const r = parsujKoperte(JSON.stringify({ s: 1, d: "d", t: 1, c: [{ k: "a", w: "xx", v: 1, u: "V" }, { k: "b", w: "moc", v: 1, u: "zz" }] }), "z")
    expect(r.ok && r.wynik.odrzucone.map((o) => o.powod)).toEqual(["nieznana-wielkosc", "nieznana-jednostka"])
  })
  it("rejects bad json and wrong schema version", () => {
    expect(parsujKoperte("{", "z")).toEqual({ ok: false, blad: "nieprawidlowy-json" })
    expect(parsujKoperte(JSON.stringify({ s: 2, d: "d", t: 1, c: [] }), "z")).toEqual({ ok: false, blad: "nieprawidlowa-koperta" })
  })
  it("assembles lines from fragments", () => {
    const a = skladajLinie("", '{"a":1}\n{"b"')
    expect(a.linie).toEqual(['{"a":1}'])
    const b = skladajLinie(a.reszta, ":2}\n")
    expect(b.linie).toEqual(['{"b":2}'])
    expect(b.reszta).toBe("")
  })
})

describe("csv", () => {
  const profil: ProfilCsv = {
    kolumnaCzasu: "czas",
    formatCzasu: "iso",
    kolumny: [{ kolumna: "U", kanal: "bms", wielkosc: "napiecie", jednostka: "V" }],
  }
  it("detects separator and reads decimal comma", () => {
    const t = "czas;U\n2026-01-01T00:00:00Z;51,5\n2026-01-01T00:01:00Z;\n"
    expect(wykryjSeparator(t)).toBe(";")
    expect(naglowkiCsv(t)).toEqual(["czas", "U"])
    const r = parsujCsv(t, profil, "z")
    expect(r.probki[0].wartosc).toBe(51.5)
    expect(r.probki[1].jakosc).toBe("brak")
  })
  it("reports bad rows with line numbers", () => {
    const r = parsujCsv("czas,U\nxx,1\n2026-01-01T00:00:00Z,abc\n2026-01-01T00:00:00Z\n", profil, "z")
    expect(r.bledy.map((b) => [b.wiersz, b.powod])).toEqual([[2, "zly-czas"], [3, "zla-liczba"], [4, "zla-liczba-kolumn"]])
  })
  it("fails clearly when mapped column is missing", () => {
    expect(parsujCsv("a,b\n1,2\n", profil, "z").bledy).toHaveLength(1)
  })
})

describe("jakosc", () => {
  const p = (czas: number, wartosc: number) => zbudujProbke({ zrodloId: "z", kanal: "k", czas, wielkosc: "napiecie", wartosc })
  it("finds gaps, duplicates, frozen series", () => {
    const dane = [p(0, 50), p(1000, 50), p(1000, 50), p(10_000, 50), ...Array.from({ length: 12 }, (_, i) => p(20_000 + i * 1000, 50))]
    const r = ocenJakosc(dane, 1000)
    expect(r.duplikaty).toBe(1)
    expect(r.luki.length).toBe(2)
    expect(r.zamrozone).toEqual(["z|k|napiecie"])
    expect(usunDuplikaty(dane)).toHaveLength(dane.length - 1)
  })
})

describe("symulator", () => {
  const o = { zrodloId: "demo", scenariusz: "normalna-praca" as const, start: 0, krokMs: 60_000, liczbaKrokow: 100 }
  it("is deterministic and stays in range", () => {
    expect(generujDemo(o)).toEqual(generujDemo(o))
    expect(generujDemo(o).every((x) => x.jakosc === "ok")).toBe(true)
  })
  it("scenarios differ", () => {
    const zwarcie = generujDemo({ ...o, scenariusz: "zwarcie" }).filter((x) => x.wielkosc === "prad")
    expect(Math.max(...zwarcie.map((x) => x.wartosc ?? 0))).toBe(900)
  })
})
