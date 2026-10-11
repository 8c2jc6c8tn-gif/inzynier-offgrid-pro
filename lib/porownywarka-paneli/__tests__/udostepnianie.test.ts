import { deflateRawSync } from "node:zlib"
import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV } from "@/lib/core/dane/katalog-paneli-pv"
import { MAKS_PANELI_W_ZESTAWIE } from "@/lib/core/modules/pv/porownywarka-paneli/constants"
import { PANEL_PUSTY, STAN_POCZATKOWY, type FormularzStan } from "../stan"
import {
  kodZFragmentu,
  kodZTekstu,
  linkDoPorownania,
  odczytajPaczkeZJson,
  odkodujZLinku,
  oczyscStan,
  paczkaDoJson,
  paczkaZObiektu,
  stanWWalucie,
  WERSJA_PACZKI,
  zakodujDoLinku,
  zbudujPaczke,
} from "../udostepnianie"

const PLN = { kod: "PLN", kurs: 1 }
const stanTestowy = (): FormularzStan => ({
  ...STAN_POCZATKOWY,
  tmin: "-20",
  panele: [
    { ...PANEL_PUSTY("p1"), nazwa: "Panel A", moc: "500", cena: "400", voc: "50" },
    { ...PANEL_PUSTY("p2"), nazwa: "Panel B", moc: "430", cena: "300", obcRodzaj: "obliczeniowe" },
  ],
  stawka: "1,00",
  cenaUrzadzenia: "2000",
  bosCeny: { "oc-1": "100" } as unknown as FormularzStan["bosCeny"],
  ofertaDla: "Jan Kowalski",
  ofertaWykonawca: "Firma X",
  ofertaUwagi: "tajne",
  ofertaNumer: "2026/10/001",
  ofertaWarunki: "zaliczka 30 proc.",
  ofertaMontazNetto: "4321",
  ofertaMontazVat: "8",
})

describe("zbudujPaczke", () => {
  it("drops the fields about the client and the printed offer", () => {
    const p = zbudujPaczke(stanTestowy(), PLN)
    expect(p.stan.ofertaDla).toBeUndefined()
    expect(p.stan.ofertaWykonawca).toBeUndefined()
    expect(p.stan.ofertaUwagi).toBeUndefined()
    expect(p.stan.ofertaNumer).toBeUndefined()
    expect(p.stan.ofertaWarunki).toBeUndefined()
    expect(p.stan.ofertaMontazNetto).toBeUndefined()
    expect(p.stan.ofertaMontazVat).toBeUndefined()
    expect(JSON.stringify(p)).not.toContain("Kowalski")
    expect(p.wersja).toBe(WERSJA_PACZKI)
  })
})

describe("oczyscStan", () => {
  it("keeps a valid state field by field", () => {
    const wynik = oczyscStan(JSON.parse(JSON.stringify(zbudujPaczke(stanTestowy(), PLN).stan)))!
    expect(wynik.tmin).toBe("-20")
    expect(wynik.panele.map((x) => x.nazwa)).toEqual(["Panel A", "Panel B"])
    expect(wynik.panele[1]!.obcRodzaj).toBe("obliczeniowe")
    expect(wynik.stawka).toBe("1,00")
  })

  it("rejects non-objects", () => {
    expect(oczyscStan(null)).toBeNull()
    expect(oczyscStan("x")).toBeNull()
    expect(oczyscStan([1])).toBeNull()
  })

  it("drops unknown keys and falls back to empty fields for wrong types", () => {
    const wynik = oczyscStan({ panele: [{ nazwa: 5, moc: { a: 1 }, bifacjalny: "tak", zlosliwy: "x" }], tmin: 12, __proto__: { x: 1 }, haker: "x" })!
    expect(wynik.panele[0]!.nazwa).toBe("")
    expect(wynik.panele[0]!.moc).toBe("")
    expect(wynik.panele[0]!.bifacjalny).toBe(false)
    expect(wynik.tmin).toBe("")
    expect("haker" in wynik).toBe(false)
    expect("zlosliwy" in wynik.panele[0]!).toBe(false)
  })

  it("limits the number of panels and places and keeps ids unique", () => {
    const wynik = oczyscStan({
      panele: Array.from({ length: 30 }, () => ({ id: "p1", nazwa: "x" })),
      miejsca: Array.from({ length: 50 }, () => ({ id: "m1" })),
    })!
    expect(wynik.panele).toHaveLength(MAKS_PANELI_W_ZESTAWIE)
    expect(new Set(wynik.panele.map((p) => p.id)).size).toBe(wynik.panele.length)
    expect(wynik.miejsca.length).toBeLessThanOrEqual(10)
    expect(new Set(wynik.miejsca.map((m) => m.id)).size).toBe(wynik.miejsca.length)
  })

  it("checks ids against the catalogues and the enumerations", () => {
    const wynik = oczyscStan({
      panele: [{ katalogId: "nie-ma-takiego", obcRodzaj: "inne" }],
      miejsca: [{ montaz: "zly" }],
      urzadzenieId: "nie-ma",
      wycena: "zly",
      obc: { ekspozycjaSniegu: "zly" },
    })!
    expect(wynik.panele[0]!.katalogId).toBe("")
    expect(wynik.panele[0]!.obcRodzaj).toBe("testowe")
    expect(wynik.miejsca[0]!.montaz).toBe("rownolegly")
    expect(wynik.urzadzenieId).toBe("")
    expect(wynik.wycena).toBe("")
    expect(wynik.obc?.ekspozycjaSniegu).not.toBe("zly")
    const znany = KATALOG_PANELI_PV[0]!.id
    expect(oczyscStan({ panele: [{ katalogId: znany }] })!.panele[0]!.katalogId).toBe(znany)
  })

  it("rejects an unsafe id and a very long text", () => {
    const wynik = oczyscStan({ panele: [{ id: "<script>", nazwa: "a".repeat(5000) }] })!
    expect(wynik.panele[0]!.id).toBe("p1")
    expect(wynik.panele[0]!.nazwa.length).toBeLessThanOrEqual(300)
  })

  it("accepts only known bos ids and layouts", () => {
    const wynik = oczyscStan({ bosCeny: { "oc-1": "100", zly: "1" }, bosUklad: { p1: "2x3", zly: "2x3", p2: "abc" }, bosWylaczone: ["zly", 5] })!
    expect(Object.keys(wynik.bosUklad ?? {})).not.toContain("zly")
    expect(wynik.bosUklad?.p2).toBeUndefined()
    expect(wynik.bosWylaczone).toEqual([])
    expect(Object.keys(wynik.bosCeny ?? {})).not.toContain("zly")
  })
})

describe("paczka z JSON", () => {
  it("round-trips through JSON", () => {
    const w = odczytajPaczkeZJson(paczkaDoJson(zbudujPaczke(stanTestowy(), PLN)))
    expect(w.ok).toBe(true)
    if (w.ok) expect(w.paczka.stan.panele[0]!.nazwa).toBe("Panel A")
  })

  it("reports an empty, damaged, foreign, oversized and wrong-version input", () => {
    expect(odczytajPaczkeZJson("  ")).toEqual({ ok: false, blad: "pusty" })
    expect(odczytajPaczkeZJson("{nie json")).toEqual({ ok: false, blad: "uszkodzony" })
    expect(odczytajPaczkeZJson("[1,2]")).toEqual({ ok: false, blad: "format" })
    expect(odczytajPaczkeZJson("x".repeat(300_000))).toEqual({ ok: false, blad: "za-duzy" })
    expect(paczkaZObiektu({ wersja: 99, waluta: PLN, stan: {} })).toEqual({ ok: false, blad: "wersja" })
  })

  it("requires a sensible currency", () => {
    for (const waluta of [null, { kod: "pln", kurs: 1 }, { kod: "PLN", kurs: 0 }, { kod: "PLN", kurs: -2 }, { kod: "PLN", kurs: "1" }, { kod: "PLN", kurs: Infinity }]) {
      expect(paczkaZObiektu({ wersja: WERSJA_PACZKI, waluta, stan: {} })).toEqual({ ok: false, blad: "format" })
    }
  })
})

describe("stanWWalucie", () => {
  it("converts typed amounts at the ratio of the rates", () => {
    const p = zbudujPaczke(stanTestowy(), { kod: "EUR", kurs: 0.25 })
    const w = stanWWalucie(p, { kurs: 0.5 })
    expect(Number(w.panele[0]!.cena)).toBeCloseTo(800)
    expect(Number(w.cenaUrzadzenia)).toBeCloseTo(4000)
  })

  it("leaves the amounts when the currency rate is the same", () => {
    const p = zbudujPaczke(stanTestowy(), PLN)
    expect(stanWWalucie(p, { kurs: 1 })).toBe(p.stan)
  })
})

describe("link", () => {
  it("round-trips through the link code", async () => {
    const kod = await zakodujDoLinku(zbudujPaczke(stanTestowy(), PLN))
    expect(kod).toMatch(/^[zj]\.[A-Za-z0-9_-]+$/)
    const w = await odkodujZLinku(kod)
    expect(w.ok).toBe(true)
    if (w.ok) {
      expect(w.paczka.stan.panele.map((p) => p.nazwa)).toEqual(["Panel A", "Panel B"])
      expect(w.paczka.stan.ofertaDla).toBeUndefined()
    }
  })

  it("rejects garbage, truncated and oversized codes without throwing", async () => {
    expect(await odkodujZLinku("")).toEqual({ ok: false, blad: "pusty" })
    expect(await odkodujZLinku("to nie kod")).toEqual({ ok: false, blad: "format" })
    expect((await odkodujZLinku("z.AAAA")).ok).toBe(false)
    const kod = await zakodujDoLinku(zbudujPaczke(stanTestowy(), PLN))
    expect((await odkodujZLinku(kod.slice(0, Math.floor(kod.length / 2)))).ok).toBe(false)
    expect(await odkodujZLinku(`j.${"A".repeat(40_000)}`)).toEqual({ ok: false, blad: "za-duzy" })
  })

  it("stops a decompression bomb at the size limit", async () => {
    if (typeof CompressionStream === "undefined") return
    const bomba = JSON.stringify({ wersja: WERSJA_PACZKI, waluta: PLN, stan: { tmin: "0".repeat(5_000_000) } })
    const kod = `z.${deflateRawSync(Buffer.from(bomba)).toString("base64url")}`
    expect(kod.length).toBeLessThan(16_000)
    expect(await odkodujZLinku(kod)).toEqual({ ok: false, blad: "za-duzy" })
  })

  it("finds the code in a full link, a fragment or a bare code", () => {
    const link = linkDoPorownania("https://x.pl/kalkulatory/porownywarka-paneli?a=1#stare", "z.ABC_-")
    expect(link).toBe("https://x.pl/kalkulatory/porownywarka-paneli?a=1#udostepnij=z.ABC_-")
    expect(kodZTekstu(link)).toBe("z.ABC_-")
    expect(kodZTekstu("#udostepnij=j.QQ")).toBe("j.QQ")
    expect(kodZTekstu("  z.ABC  ")).toBe("z.ABC")
  })

  it("reads the code from location.hash only when it is a shared comparison", () => {
    expect(kodZFragmentu("#udostepnij=z.ABC")).toBe("z.ABC")
    expect(kodZFragmentu("#inne=1&udostepnij=j.X")).toBe("j.X")
    expect(kodZFragmentu("#naglowek")).toBeNull()
    expect(kodZFragmentu("")).toBeNull()
  })
})
