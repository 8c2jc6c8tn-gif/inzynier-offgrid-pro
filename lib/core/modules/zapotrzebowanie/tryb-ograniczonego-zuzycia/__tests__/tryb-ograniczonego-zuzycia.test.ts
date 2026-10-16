import { describe, expect, it } from "vitest"
import { calculateTrybOgraniczonegoZuzycia } from "../calculator"
import type { TrybOgraniczonegoZuzyciaInput } from "../input"

// Lodówka 600 Wh/dobę (zostaje), router 240 Wh (zostaje), telewizor 400 Wh, ekspres 160 Wh → razem 1400 Wh, zostaje 840 Wh.
const odb = (zostaje: Record<string, boolean> = {}) => [
  { id: "l", nazwa: "Lodówka", zuzycieDobaWh: 600, zostaje: zostaje.l ?? true },
  { id: "r", nazwa: "Router", zuzycieDobaWh: 240, zostaje: zostaje.r ?? true },
  { id: "t", nazwa: "Telewizor", zuzycieDobaWh: 400, zostaje: zostaje.t ?? false },
  { id: "e", nazwa: "Ekspres", zuzycieDobaWh: 160, zostaje: zostaje.e ?? false },
]
const wyjazd = (z: Partial<TrybOgraniczonegoZuzyciaInput> = {}): TrybOgraniczonegoZuzyciaInput => ({
  tryb: "wyjazd",
  odbiorniki: odb(),
  dniNieobecnosci: 10,
  godzinNocy: null,
  pojemnoscUzytecznaKwh: null,
  ...z,
})

describe("tryb wyjazdu (7.27)", () => {
  it("doba: 1,4 kWh normalnie, 0,84 kWh w trybie wyjazdu; oszczędność 0,56 kWh = 40%", () => {
    const v = calculateTrybOgraniczonegoZuzycia(wyjazd()).value!
    expect(v.normalnieDobaKwh).toBeCloseTo(1.4, 12)
    expect(v.ograniczoneDobaKwh).toBeCloseTo(0.84, 12)
    expect(v.oszczednoscDobaKwh).toBeCloseTo(0.56, 12)
    expect(v.oszczednoscPct).toBeCloseTo(40, 10)
    expect(v.zostaja).toEqual(["Lodówka", "Router"])
    expect(v.wylaczone).toEqual(["Telewizor", "Ekspres"])
  })

  it("10 dób: 14 kWh normalnie, 8,4 kWh w trybie wyjazdu; bateria 4,2 kWh wystarczy na 5 dób (ograniczone) wobec 3 (normalnie)", () => {
    const v = calculateTrybOgraniczonegoZuzycia(wyjazd({ pojemnoscUzytecznaKwh: 4.2 })).value!
    expect(v.okresNormalnieKwh).toBeCloseTo(14, 10)
    expect(v.okresOgraniczoneKwh).toBeCloseTo(8.4, 10)
    expect(v.bateriaWystarczaOgraniczone).toBeCloseTo(5, 10)
    expect(v.bateriaWystarczaNormalnie).toBeCloseTo(3, 10)
    expect(v.nocNormalnieKwh).toBeNull()
  })

  it("bez liczby dób zostają wartości dobowe, a okres jest null", () => {
    const v = calculateTrybOgraniczonegoZuzycia(wyjazd({ dniNieobecnosci: null })).value!
    expect(v.okresNormalnieKwh).toBeNull()
    expect(v.ograniczoneDobaKwh).toBeCloseTo(0.84, 12)
  })
})

describe("tryb nocny (7.49)", () => {
  const noc = (z: Partial<TrybOgraniczonegoZuzyciaInput> = {}) => wyjazd({ tryb: "noc", dniNieobecnosci: null, godzinNocy: 8, ...z })

  it("okno 8 h = 1/3 doby: noc 0,4667 kWh normalnie i 0,28 kWh po ograniczeniu; bateria 0,84 kWh = 3 noce ograniczone", () => {
    const v = calculateTrybOgraniczonegoZuzycia(noc({ pojemnoscUzytecznaKwh: 0.84 })).value!
    expect(v.nocNormalnieKwh).toBeCloseTo(1.4 / 3, 10)
    expect(v.nocOgraniczoneKwh).toBeCloseTo(0.28, 10)
    expect(v.bateriaWystarczaOgraniczone).toBeCloseTo(3, 10)
    expect(v.okresNormalnieKwh).toBeNull()
  })

  it("założenie o równomiernym zużyciu w ciągu doby jest jawne tylko w trybie nocnym", () => {
    expect(calculateTrybOgraniczonegoZuzycia(noc()).assumptions).toContainEqual({ kod: "TOGR-ZAL-ROWNOMIERNIE" })
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd()).assumptions).not.toContainEqual({ kod: "TOGR-ZAL-ROWNOMIERNIE" })
  })
})

describe("walidacja i ostrzeżenia", () => {
  it("dni ≤ 0, godziny poza (0, 24], pojemność ≤ 0, zużycie ujemne → INVALID_INPUT", () => {
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd({ dniNieobecnosci: 0 })).warnings[0]!.code).toBe("TOGR-WARTOSC-NIEDODATNIA")
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd({ tryb: "noc", godzinNocy: 25 })).warnings[0]!.code).toBe("TOGR-GODZINY-POZA-ZAKRESEM")
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd({ tryb: "noc", godzinNocy: 24 })).status).toBe("VALID")
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd({ pojemnoscUzytecznaKwh: 0 })).status).toBe("INVALID_INPUT")
    expect(calculateTrybOgraniczonegoZuzycia(wyjazd({ odbiorniki: [{ id: "x", nazwa: "X", zuzycieDobaWh: -1, zostaje: true }] })).warnings[0]!.code).toBe("TOGR-ZUZYCIE-UJEMNE")
  })

  it("nic nie zostaje → ostrzeżenie informacyjne, wynik 0 kWh i 100% oszczędności; pusta lista → informacja o liście", () => {
    const wszystkoOff = calculateTrybOgraniczonegoZuzycia(wyjazd({ odbiorniki: odb({ l: false, r: false }) }))
    expect(wszystkoOff.warnings.map((w) => w.code)).toEqual(["TOGR-NIC-NIE-ZOSTAJE"])
    expect(wszystkoOff.value!.ograniczoneDobaKwh).toBe(0)
    expect(wszystkoOff.value!.oszczednoscPct).toBeCloseTo(100, 10)
    expect(wszystkoOff.value!.bateriaWystarczaOgraniczone).toBeNull()
    const pusta = calculateTrybOgraniczonegoZuzycia(wyjazd({ odbiorniki: [] }))
    expect(pusta.warnings.map((w) => w.code)).toEqual(["TOGR-PUSTA-LISTA"])
    expect(pusta.value!.oszczednoscPct).toBe(0)
  })
})
