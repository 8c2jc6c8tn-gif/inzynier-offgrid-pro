import { describe, expect, it } from "vitest"
import { calculateScenariuszePrzejscia } from "../calculator"
import type { ScenariuszePrzejsciaInput } from "../input"

// Hand arithmetic: 300 kWh/month; yield 120 kWh/kWp (III–X) and 20 (I, II, XI, XII); 5 kWp, a = 0.3, η = 0.9.
// Summer month: E_PV 600, direct 180, shortfall 120, surplus 420. Winter: E_PV 100, direct 30, shortfall 270, surplus 70.
// With 10 kWh storage: summer shortfall 0 (surplus 420 − 120/0.9); winter ΔE = 63 → shortfall 207, surplus 0.
const uzysk = [20, 20, 120, 120, 120, 120, 120, 120, 120, 120, 20, 20]

function wejscie(zmiany: Partial<ScenariuszePrzejsciaInput> = {}): ScenariuszePrzejsciaInput {
  return {
    segment: "dom",
    rokBazowy: 2026,
    horyzontLat: 10,
    tryb: { rodzaj: "suwak", gProcent: 0 },
    stopaDyskontowaProcent: 0,
    zuzycieMiesieczneKwh: Array(12).fill(300),
    uzyskMiesiecznyKwhNaKwp: uzysk,
    autokonsumpcjaBezposrednia: 0.3,
    sprawnoscMagazynu: 0.9,
    zywotnoscMagazynuLat: 6,
    siec: { kosztStalyRokBruttoZl: 1000, cenaZmiennaKwhBruttoZl: 1, wartoscNadwyzkiKwhZl: 0.3 },
    agregat: { mocKw: 5, zuzycieLH: 2, cenaPaliwaZlL: 7 },
    scenariusze: {
      A: { inwestycjaZl: 20000, dotacjaZl: 0, mocPvKwp: 5, pojemnoscMagazynuKwh: 0, kosztMagazynuZl: 0, serwisRokZl: 0 },
      B: { inwestycjaZl: 45000, dotacjaZl: 0, mocPvKwp: 5, pojemnoscMagazynuKwh: 10, kosztMagazynuZl: 0, serwisRokZl: 0 },
      C: { inwestycjaZl: 55000, dotacjaZl: 0, mocPvKwp: 5, pojemnoscMagazynuKwh: 10, kosztMagazynuZl: 0, serwisRokZl: 0 },
      D: { inwestycjaZl: 60000, dotacjaZl: 0, mocPvKwp: 5, pojemnoscMagazynuKwh: 10, kosztMagazynuZl: 30000, serwisRokZl: 500 },
    },
    kontrola: { osobyZalezneOdZasilania: false, zapasRedundantny: false, progGodzinAgregatuMies: 40, dopuszczalnyCzasBezZasilaniaH: null },
    ...zmiany,
  }
}

const kody = (r: ReturnType<typeof calculateScenariuszePrzejscia>) => r.warnings.map((w) => w.code)
const scen = (r: ReturnType<typeof calculateScenariuszePrzejscia>, id: string) => r.value!.scenariusze.find((s) => s.id === id)!

describe("scenariusze-przejscia — TCO A–D (hand arithmetic)", () => {
  const r = calculateScenariuszePrzejscia(wejscie())

  it("A: grid 1000 + (2040 − 0.3·3640) = 1948 zł/year → TCO 39 480 zł", () => {
    expect(scen(r, "A").kosztRok1Zl).toBeCloseTo(1948, 6)
    expect(scen(r, "A").tcoDzisiejszeZl).toBeCloseTo(39480, 6)
  })

  it("B: grid 1000 + (828 − 0.3·2293.33) = 1140 zł/year → TCO 56 400 zł, no payback within 10 years", () => {
    expect(scen(r, "B").tcoDzisiejszeZl).toBeCloseTo(56400, 6)
    expect(scen(r, "B").okresZwrotuLat).toBeNull()
  })

  it("C: fixed + shortfall only, no export → 1828 zł/year, TCO 73 280 zł", () => {
    expect(scen(r, "C").tcoDzisiejszeZl).toBeCloseTo(73280, 6)
  })

  it("D: generator 207 kWh/month ÷ 4 kW = 51.75 h, fuel 414 l/year; storage replaced in year 6, residual 1/3", () => {
    const d = scen(r, "D")
    expect(d.godzinyAgregatuMaxMies).toBeCloseTo(51.75, 6)
    expect(d.godzinyAgregatuRok).toBeCloseTo(207, 6)
    expect(d.paliwoRokL).toBeCloseTo(414, 6)
    expect(d.wymianyMagazynu).toEqual([6])
    // 60 000 + 10·(2898 + 500) + 30 000 − 10 000
    expect(d.tcoDzisiejszeZl).toBeCloseTo(113980, 6)
    expect(d.odwracalny).toBe(false)
  })

  it("separate verdicts: cheapest A, most independent D (never one „best”)", () => {
    expect(r.value!.najtanszy).toBe("A")
    expect(r.value!.najbardziejNiezalezny).toBe("D")
  })

  it("warnings: D risky above the threshold, irreversible, C switch, parallel operation", () => {
    expect(kody(r)).toEqual(
      expect.arrayContaining(["SIEC-TCO-D-RYZYKOWNE", "SIEC-TCO-D-NIEODWRACALNE", "SIEC-TCO-C-PRZELACZNIK", "SIEC-TCO-PRACA-ROWNOLEGLA"]),
    )
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.some((w) => w.level === "critical")).toBe(false)
  })

  it("payback vs A appears when the saving covers the extra investment", () => {
    const x = wejscie()
    x.scenariusze.B = { ...x.scenariusze.B, inwestycjaZl: 24000 } // extra 4000, saving 808/year → year 5
    expect(scen(calculateScenariuszePrzejscia(x), "B").okresZwrotuLat).toBe(5)
  })
})

describe("scenariusze-przejscia — inflation, discount, scope", () => {
  it("UE + own inflation: running costs grow with π, in today's money D stays 113 980 zł (D41)", () => {
    const x = wejscie({ tryb: { rodzaj: "ue-inflacja", zrodloInflacji: "wlasna", wlasnaInflacjaProcent: 10 } })
    x.scenariusze = { ...x.scenariusze, A: { ...x.scenariusze.A, inwestycjaZl: null } }
    const r = calculateScenariuszePrzejscia(x)
    const d = scen(r, "D")
    expect(d.tcoDzisiejszeZl).toBeCloseTo(113980, 6)
    expect(d.tcoNominalneZl).toBeGreaterThan(d.tcoDzisiejszeZl)
    expect(r.value!.inflacjaProcent).toBeCloseTo(10, 9)
  })

  it("discount r = 10%: A = 20 000 + 1948·Σ1/1.1^t", () => {
    const r = calculateScenariuszePrzejscia(wejscie({ stopaDyskontowaProcent: 10 }))
    let s = 0
    for (let t = 1; t <= 10; t++) s += 1948 / Math.pow(1.1, t)
    expect(scen(r, "A").tcoDzisiejszeZl).toBeCloseTo(20000 + s, 6)
  })

  it("EU path beyond the projection → OUT_OF_SCOPE (no extrapolation)", () => {
    const r = calculateScenariuszePrzejscia(wejscie({ horyzontLat: 25, tryb: { rodzaj: "ue" } }))
    expect(r.status).toBe("OUT_OF_SCOPE")
    expect(kody(r)).toContain("SIEC-POZA-PROJEKCJA-UE")
  })

  it("horizon outside 10–25 → INVALID_INPUT", () => {
    expect(calculateScenariuszePrzejscia(wejscie({ horyzontLat: 5 })).status).toBe("INVALID_INPUT")
  })
})

describe("scenariusze-przejscia — hard stops and missing data", () => {
  it("🔴 D with a shortfall and no generator", () => {
    const r = calculateScenariuszePrzejscia(wejscie({ agregat: { mocKw: 0, zuzycieLH: null, cenaPaliwaZlL: null } }))
    expect(kody(r)).toContain("SIEC-TCO-D-BEZ-AGREGATU")
    expect(r.warnings.find((w) => w.code === "SIEC-TCO-D-BEZ-AGREGATU")!.level).toBe("critical")
  })

  it("🔴 D with medically dependent people and no redundant reserve", () => {
    const x = wejscie()
    x.kontrola = { ...x.kontrola, osobyZalezneOdZasilania: true }
    expect(kody(calculateScenariuszePrzejscia(x))).toContain("SIEC-TCO-D-ZALEZNI-MEDYCZNIE")
    x.kontrola = { ...x.kontrola, zapasRedundantny: true }
    expect(kody(calculateScenariuszePrzejscia(x))).not.toContain("SIEC-TCO-D-ZALEZNI-MEDYCZNIE")
  })

  it("D without the R4 answer → INCOMPLETE (a hard stop is never skipped silently)", () => {
    const x = wejscie()
    x.kontrola = { ...x.kontrola, osobyZalezneOdZasilania: null }
    const r = calculateScenariuszePrzejscia(x)
    expect(r.status).toBe("INCOMPLETE")
    expect(kody(r)).toContain("SIEC-BRAK-OSOBYZALEZNE")
  })

  it("firma: RF1 lower bound = annual use / 8760 × acceptable hours", () => {
    const x = wejscie({ segment: "firma" })
    x.kontrola = { ...x.kontrola, dopuszczalnyCzasBezZasilaniaH: 8760 / 3600 * 10 }
    const w = calculateScenariuszePrzejscia(x).warnings.find((w) => w.code === "SIEC-TCO-RF1")!
    expect(w.params!.kwh).toBe(10)
  })

  it("no scenario with an investment → INCOMPLETE", () => {
    const x = wejscie()
    for (const id of ["A", "B", "C", "D"] as const) x.scenariusze[id] = { ...x.scenariusze[id], inwestycjaZl: null }
    expect(calculateScenariuszePrzejscia(x).status).toBe("INCOMPLETE")
  })
})
