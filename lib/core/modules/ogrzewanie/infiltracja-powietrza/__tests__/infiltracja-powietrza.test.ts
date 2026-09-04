import { describe, expect, it } from "vitest"
import { calculateInfiltracjaPowietrza } from "../calculator"

describe("calculateInfiltracjaPowietrza", () => {
  it("0,8 wym/h, 300m³, ΔT=30K -> strata 2,412 kW (Q=n×V×ρ×cp×ΔT/3600)", () => {
    const result = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 0.8,
      kubaturaBudynkuM3: 300,
      deltaTK: 30,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.strataCieplnaKw).toBeCloseTo(2.412, 6)
  })

  it("podwojenie wymian powietrza -> podwojenie straty (liniowość wzoru)", () => {
    const result1 = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 0.5,
      kubaturaBudynkuM3: 200,
      deltaTK: 20,
    })
    const result2 = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 1,
      kubaturaBudynkuM3: 200,
      deltaTK: 20,
    })
    expect(result2.value.strataCieplnaKw).toBeCloseTo(result1.value.strataCieplnaKw * 2, 6)
  })

  it("ΔT=0 -> brak strat, VALID", () => {
    const result = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 0.8,
      kubaturaBudynkuM3: 300,
      deltaTK: 0,
    })
    expect(result.value.strataCieplnaKw).toBe(0)
    expect(result.status).toBe("VALID")
  })

  it("nietypowo wysoka liczba wymian -> info sanity check", () => {
    const result = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 15,
      kubaturaBudynkuM3: 300,
      deltaTK: 20,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings.some((w) => w.code === "WYMIANY-POZA-SANITY-CHECK")).toBe(true)
  })

  it("INCOMPLETE — ΔT jeszcze nie wpisane", () => {
    const result = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 0.8,
      kubaturaBudynkuM3: 300,
      deltaTK: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna kubatura", () => {
    const result = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: 0.8,
      kubaturaBudynkuM3: -300,
      deltaTK: 20,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
