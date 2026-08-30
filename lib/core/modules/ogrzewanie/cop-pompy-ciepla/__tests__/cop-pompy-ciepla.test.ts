import { describe, expect, it } from "vitest"
import { calculateCopPompyCiepla } from "../calculator"

describe("calculateCopPompyCiepla", () => {
  it("referencja ręczna: 40 kW cieplnych, COP 2,8 -> 14,285714... kW elektrycznych", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 40, cop: 2.8 })
    expect(result.status).toBe("VALID")
    expect(result.value).toBeCloseTo(40 / 2.8, 6)
  })

  it("COP wysoki (mroźny dzień, niski COP) daje wyższe zużycie elektryczne", () => {
    const zimny = calculateCopPompyCiepla({ mocCieplnaKw: 10, cop: 2 })
    const cieply = calculateCopPompyCiepla({ mocCieplnaKw: 10, cop: 4 })
    expect(zimny.value).toBeGreaterThan(cieply.value)
  })

  it("przypadek graniczny: COP = 1 (grzałka elektryczna, brak wzmocnienia)", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 5, cop: 1 })
    expect(result.value).toBe(5)
  })

  it("błędne dane: moc cieplna ujemna -> INVALID_INPUT", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: -5, cop: 3 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("błędne dane: COP poza sensownym zakresem (np. 15) -> INVALID_INPUT", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 5, cop: 15 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("ostrzeżenie: nietypowo wysoka moc cieplna -> VALID_WITH_WARNINGS", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 150, cop: 3 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
  })
})
