import { describe, expect, it } from "vitest"
import { calculatePlanPoprawy } from "../calculator"

describe("plan poprawy efektywności (dawne 5.68)", () => {
  it("przykład źródła (spójny zestaw): dach 2000 kWh za 6000 zł → 3 lata, okna 800 kWh za 6400 zł → 8 lat; okna wpisane pierwsze", () => {
    const r = calculatePlanPoprawy({
      dzialania: [
        { nazwa: "Wymiana okien", oszczednoscCieplaKwh: 800, kosztZl: 6400 },
        { nazwa: "Izolacja dachu", oszczednoscCieplaKwh: 2000, kosztZl: 6000 },
      ],
      cop: 1,
      cenaZlKwh: 1,
    })
    expect(r.value.plan.map((p) => p.nazwa)).toEqual(["Izolacja dachu", "Wymiana okien"])
    expect(r.value.plan[0].zwrotLat).toBeCloseTo(3, 9)
    expect(r.value.plan[1].zwrotLat).toBeCloseTo(8, 9)
    expect(r.value.plan[0].indeks).toBe(1)
    expect(r.warnings.map((w) => w.code)).toEqual(["PLAN-NIE-SUMUJ"])
  })

  it("COP 3 dzieli oszczędność; bez kosztu → na końcu, bez zwrotu", () => {
    const r = calculatePlanPoprawy({
      dzialania: [
        { nazwa: "Uszczelnienie", oszczednoscCieplaKwh: 3000, kosztZl: 0 },
        { nazwa: "Dach", oszczednoscCieplaKwh: 1500, kosztZl: 1000 },
      ],
      cop: 3,
      cenaZlKwh: 1.2,
    })
    expect(r.value.plan[0].nazwa).toBe("Dach")
    expect(r.value.plan[0].oszczednoscPraduKwh).toBeCloseTo(500, 9)
    expect(r.value.plan[0].zwrotLat).toBeCloseTo(1000 / 600, 9)
    expect(r.value.plan[1].zwrotLat).toBeNull()
    expect(r.value.sumaPraduKwh).toBeCloseTo(1500, 9)
  })

  it("brak COP → INCOMPLETE; ujemny koszt → INVALID_INPUT", () => {
    const d = [{ nazwa: "Dach", oszczednoscCieplaKwh: 1500, kosztZl: 1000 }]
    expect(calculatePlanPoprawy({ dzialania: d, cop: 0, cenaZlKwh: 1 }).status).toBe("INCOMPLETE")
    expect(calculatePlanPoprawy({ dzialania: [{ ...d[0], kosztZl: -1 }], cop: 1, cenaZlKwh: 1 }).status).toBe("INVALID_INPUT")
  })
})
