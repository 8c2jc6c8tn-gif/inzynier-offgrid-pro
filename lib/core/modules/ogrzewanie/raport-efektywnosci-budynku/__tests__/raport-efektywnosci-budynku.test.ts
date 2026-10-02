import { describe, expect, it } from "vitest"
import { calculateRaportEfektywnosci } from "../calculator"

const pozycje = [
  { nazwa: "Ściany", strataW: 3000 },
  { nazwa: "Wentylacja", strataW: 4000 },
  { nazwa: "Okna", strataW: 2000 },
  { nazwa: "Dach", strataW: 1000 },
]
const baza = { pozycje, cieploRokKwh: 0, powierzchniaM2: 0, cop: 0, cenaZlKwh: 0 }

describe("raport efektywności cieplnej budynku (dawne 5.40 + 5.67)", () => {
  it("ranking strat: wentylacja 40% największa, potem ściany 30%", () => {
    const r = calculateRaportEfektywnosci(baza)
    expect(r.value.sumaW).toBe(10000)
    expect(r.value.ranking.map((p) => p.nazwa)).toEqual(["Wentylacja", "Ściany", "Okna", "Dach"])
    expect(r.value.ranking[0].udzialPct).toBeCloseTo(40, 9)
    expect(r.value.wskaznikKwhM2Rok).toBeNull()
    expect(r.status).toBe("VALID")
  })

  it("12 000 kWh/rok, 120 m², COP 3, 1,20 zł/kWh → 100 kWh/(m²·rok), 4000 kWh, 4800 zł", () => {
    const r = calculateRaportEfektywnosci({ ...baza, cieploRokKwh: 12000, powierzchniaM2: 120, cop: 3, cenaZlKwh: 1.2 })
    expect(r.value.wskaznikKwhM2Rok).toBeCloseTo(100, 9)
    expect(r.value.energiaElRokKwh).toBeCloseTo(4000, 9)
    expect(r.value.kosztRokZl).toBeCloseTo(4800, 9)
  })

  it("brak strat → INCOMPLETE; COP 0,5 → INVALID_INPUT", () => {
    expect(calculateRaportEfektywnosci({ ...baza, pozycje: [] }).status).toBe("INCOMPLETE")
    expect(calculateRaportEfektywnosci({ ...baza, cop: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
