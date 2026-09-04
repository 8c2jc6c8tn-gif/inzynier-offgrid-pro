import { describe, expect, it } from "vitest"
import { calculateSlabeOgniwo } from "../calculator"

describe("calculateSlabeOgniwo", () => {
  it("VALID_WITH_WARNINGS — domyślna tolerancja 3%, 280Ah -> 271,6Ah", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 3 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.pojemnoscNajslabszegoAh).toBeCloseTo(271.6, 6)
    expect(result.value.utrataPct).toBe(3)
  })

  it("większa tolerancja daje proporcjonalnie mniejszą pojemność najsłabszego ogniwa", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 100, tolerancjaPct: 10 })
    expect(result.value.pojemnoscNajslabszegoAh).toBeCloseTo(90, 6)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 0, tolerancjaPct: 3 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna pojemność", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: -50, tolerancjaPct: 3 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — tolerancja poza zakresem [0,100]", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 150 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
