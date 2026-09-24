import { describe, expect, it, vi } from "vitest"
import { parsujOdpowiedzTmy, PVGIS_TMY_URL } from "@/lib/adapters/pvgis/tmy"
import { calculateAnalizaZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import { calculateOrientacjaPowierzchni, CALCULATOR_VERSION as WERSJA_E4 } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { validateAiToolDefinition } from "../../types"
import { analizaZacienieniaTool, przeszkodaLokalna, utworzAnalizaZacienieniaTool } from "../analiza-zacienienia-tool"
import { orientacjaPowierzchniTool, utworzOrientacjaPowierzchniTool } from "../orientacja-powierzchni-tool"
import { skanerDzialkiTool } from "../skaner-dzialki-tool"

const tekstBezBrakujacegoKlucza = (t: string) => expect(t.startsWith("⚠")).toBe(false)

describe("narzędzia AI Modułu 1 — kontrakt 9.3", () => {
  it("wszystkie trzy: 'read', bez potwierdzenia, przechodzą validateAiToolDefinition", () => {
    for (const n of [skanerDzialkiTool, analizaZacienieniaTool, orientacjaPowierzchniTool]) {
      expect(n.operationType).toBe("read")
      expect(n.requiresConfirmation).toBe(false)
      expect(() => validateAiToolDefinition(n)).not.toThrow()
    }
  })
})

describe("skanerDzialkiTool", () => {
  // Prostokąt ok. 30×20 m w Warszawie (0,00044° długości ≈ 30 m, 0,00018° szerokości ≈ 20 m).
  const dzialka = [
    { szerokosc: 52.2297, dlugosc: 21.0122 },
    { szerokosc: 52.2297, dlugosc: 21.01264 },
    { szerokosc: 52.22988, dlugosc: 21.01264 },
    { szerokosc: 52.22988, dlugosc: 21.0122 },
  ]

  it("deleguje do calculateSkanerDzialki — te same liczby, założenia jako tekst PL", async () => {
    const w = await skanerDzialkiTool.handler({ punktyDzialki: dzialka, punktyBudynku: dzialka })
    const r = calculateSkanerDzialki({ punktyDzialki: dzialka, punktyBudynku: dzialka })
    expect(w.status).toBe(r.status)
    expect(w.dzialka).toEqual({ powierzchniaM2: r.value.dzialka!.powierzchniaM2, obwodM: r.value.dzialka!.obwodM })
    expect(w.budynek!.sciany.map((s) => s.azymutDeg)).toEqual(r.value.budynek!.sciany.map((s) => s.azymutDeg))
    expect(w.zalozenia.length).toBeGreaterThan(0)
    w.zalozenia.forEach(tekstBezBrakujacegoKlucza)
  })

  it("za mało punktów → ostrzeżenie jako tekst PL, nie wyjątek", async () => {
    const w = await skanerDzialkiTool.handler({ punktyDzialki: dzialka.slice(0, 2) })
    expect(w.status).not.toBe("VALID")
    expect(w.ostrzezenia.length).toBeGreaterThan(0)
    w.ostrzezenia.forEach(tekstBezBrakujacegoKlucza)
  })
})

describe("analizaZacienieniaTool", () => {
  it("przeszkodaLokalna: drzewo 12 m na południe → środek (0, −12)", () => {
    const p = przeszkodaLokalna({ typ: "drzewo", nazwa: "dąb", odlegloscM: 12, kierunekDeg: 180, wysokoscM: 9, promienKoronyM: 3 })
    if (p.typ !== "drzewo") throw new Error("oczekiwano drzewa")
    expect(p.srodek.x).toBeCloseTo(0, 9)
    expect(p.srodek.y).toBeCloseTo(-12, 9)
  })

  it("przeszkodaLokalna: drzewo liściaste przekazuje flagę do kalkulatora (TD19)", () => {
    const p = przeszkodaLokalna({ typ: "drzewo", nazwa: "lipa", odlegloscM: 8, kierunekDeg: 180, wysokoscM: 9, promienKoronyM: 3, lisciaste: true })
    expect(p).toMatchObject({ typ: "drzewo", lisciaste: true })
  })

  it("przeszkodaLokalna: budynek na wschodzie, ściana 6 m w odległości 10 m, głębokość 4 m → x ∈ [10, 14], y ∈ [−3, 3]", () => {
    const p = przeszkodaLokalna({ typ: "budynek", nazwa: "sąsiad", odlegloscM: 10, kierunekDeg: 90, szerokoscM: 6, glebokoscM: 4, wysokoscM: 7 })
    if (p.typ !== "bryla") throw new Error("oczekiwano bryły")
    const xs = p.obrys.map((q) => q.x)
    const ys = p.obrys.map((q) => q.y)
    expect(Math.min(...xs)).toBeCloseTo(10, 9)
    expect(Math.max(...xs)).toBeCloseTo(14, 9)
    expect(Math.min(...ys)).toBeCloseTo(-3, 9)
    expect(Math.max(...ys)).toBeCloseTo(3, 9)
  })

  it("PVGIS niedostępny → wariant zapasowy kalkulatora (ta sama strata co wejście w układzie lokalnym) + komunikat", async () => {
    const fetchImpl = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzAnalizaZacienieniaTool(fetchImpl).handler({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      nachyleniePowierzchniDeg: 35,
      azymutPowierzchniDeg: 180,
      wysokoscPaneliM: 5,
      przeszkody: [
        { typ: "drzewo", nazwa: "dąb", odlegloscM: 12, kierunekDeg: 180, wysokoscM: 9, promienKoronyM: 3, wysokoscPrognozowanaM: 15 },
      ],
      latPrognozy: 10,
    })
    const r = calculateAnalizaZacienienia({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      nachyleniePowierzchniDeg: 35,
      azymutPowierzchniDeg: 180,
      punkt: { x: 0, y: 0, z: 5 },
      przeszkody: [{ typ: "drzewo", nazwa: "dąb", srodek: { x: 0, y: -12 }, promienKoronyM: 3, wysokoscM: 9, wysokoscPrognozowanaM: 15 }],
      latPrognozy: 10,
    })
    expect(w.obecnie.strataRocznaProcent).toBeCloseTo(r.value.obecnie.strataRocznaProcent, 9)
    expect(w.prognoza!.strataRocznaProcent).toBeCloseTo(r.value.prognoza!.strataRocznaProcent, 9)
    expect(w.obecnie.strataMiesiecznaProcent).toHaveLength(12)
    expect(w.zrodloPromieniowania).toBe("czyste-niebo")
    expect(w.ostrzezenia[0]).toBe(KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"])
    w.zalozenia.forEach(tekstBezBrakujacegoKlucza)
  })

  it("z danymi PVGIS → strata całkowita (ta sama co kalkulator na tych danych)", async () => {
    const json = odpowiedzPvgis()
    const fetchImpl = (async () => new Response(JSON.stringify(json))) as unknown as typeof fetch
    const przeszkoda = { typ: "drzewo" as const, nazwa: "dąb", odlegloscM: 12, kierunekDeg: 180, wysokoscM: 9, promienKoronyM: 3 }
    const w = await utworzAnalizaZacienieniaTool(fetchImpl).handler({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      nachyleniePowierzchniDeg: 35,
      azymutPowierzchniDeg: 180,
      wysokoscPaneliM: 5,
      przeszkody: [przeszkoda],
    })
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const r = calculateAnalizaZacienienia({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      nachyleniePowierzchniDeg: 35,
      azymutPowierzchniDeg: 180,
      punkt: { x: 0, y: 0, z: 5 },
      przeszkody: [przeszkodaLokalna(przeszkoda)],
      daneGodzinowe: dane.dane.rekordy,
    })
    expect(w.zrodloPromieniowania).toBe("pvgis-tmy")
    expect(w.obecnie.strataRocznaProcent).toBeCloseTo(r.value.obecnie.strataRocznaProcent, 9)
    expect(w.ostrzezenia).toEqual([])
    w.zalozenia.forEach(tekstBezBrakujacegoKlucza)
  })
})

/** Syntetyczna odpowiedź PVGIS (struktura jak w lib/adapters/pvgis/__tests__/tmy.test.ts) — NIE dane klimatyczne. */
function odpowiedzPvgis() {
  const start = Date.UTC(2018, 0, 1)
  const p = (n: number) => String(n).padStart(2, "0")
  const tmy_hourly = Array.from({ length: 8760 }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const poludnie = h % 24 === 11
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      "G(h)": poludnie ? 400 : 0,
      "Gb(n)": poludnie ? 500 : 0,
      "Gd(h)": poludnie ? 100 : 0,
    }
  })
  return {
    inputs: {
      location: { latitude: 52.23, longitude: 21.01, elevation: 119, irradiance_time_offset: 0.18 },
      meteo_data: { radiation_db: "PVGIS-SARAH3", meteo_db: "ERA5", year_min: 2005, year_max: 2023, use_horizon: true, horizon_db: "DEM-calculated" },
    },
    outputs: { months_selected: [], tmy_hourly },
    meta: {},
  }
}

describe("orientacjaPowierzchniTool", () => {
  const powierzchnie = [
    { nazwa: "dach S", nachylenieDeg: 35, azymutDeg: 180 },
    { nazwa: "ściana N", nachylenieDeg: 90, azymutDeg: 0 },
  ]

  it("pobiera PVGIS po stronie serwera i deleguje do calculateOrientacjaPowierzchni", async () => {
    const json = odpowiedzPvgis()
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(json))) as unknown as typeof fetch
    const w = await utworzOrientacjaPowierzchniTool(fetchImpl).handler({ szerokoscGeograficzna: 52.23, dlugoscGeograficzna: 21.01, powierzchnie })

    expect(String(vi.mocked(fetchImpl).mock.calls[0]![0])).toContain(PVGIS_TMY_URL)
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const r = calculateOrientacjaPowierzchni({ szerokoscGeograficzna: 52.23, dlugoscGeograficzna: 21.01, daneGodzinowe: dane.dane.rekordy, powierzchnie })
    expect(w.status).toBe(r.status)
    expect(w.optimum).toEqual(r.value.optimum)
    expect(w.powierzchnie).toEqual(r.value.powierzchnie)
    expect(w.zrodloDanych).toBe("PVGIS TMY (PVGIS-SARAH3, lata 2005–2023)")
    expect(w.wersjaKalkulatora).toBe(WERSJA_E4)
    w.zalozenia.forEach(tekstBezBrakujacegoKlucza)
  })

  it("PVGIS odrzuca zapytanie (np. morze) → INCOMPLETE z komunikatem, bez wyniku", async () => {
    const fetchImpl = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzOrientacjaPowierzchniTool(fetchImpl).handler({ szerokoscGeograficzna: 55, dlugoscGeograficzna: 18, powierzchnie })
    expect(w).toMatchObject({ status: "INCOMPLETE", optimum: null, powierzchnie: [] })
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})
