import { describe, expect, it } from "vitest"
import { calculateTrybUproszczony } from "../calculator"

describe("calculateTrybUproszczony", () => {
  it("referencja ręczna: 100Ah/12V, odbiornik 50W -> 24h", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: 100, napiecieV: 12, mocOdbiornikaW: 50 })
    expect(result.status).toBe("VALID")
    expect(result.value).toBeCloseTo(24, 6)
  })

  it("przypadek graniczny: bardzo mała moc odbiornika daje długi czas pracy", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: 100, napiecieV: 12, mocOdbiornikaW: 1 })
    expect(result.value).toBeCloseTo(1200, 6)
  })

  it("błędne dane: pojemność ujemna -> INVALID_INPUT", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: -10, napiecieV: 12, mocOdbiornikaW: 50 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: moc odbiornika 0 -> INVALID_INPUT", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: 100, napiecieV: 12, mocOdbiornikaW: 0 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
