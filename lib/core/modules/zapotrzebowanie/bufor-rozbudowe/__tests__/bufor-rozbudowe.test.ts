import { describe, expect, it } from "vitest"
import { calculateBuforRozbudowy } from "../calculator"

describe("calculateBuforRozbudowy", () => {
  it("VALID — bufor 0%: bez zmian", () => {
    const result = calculateBuforRozbudowy({ zapotrzebowanieCalkowiteKwh: 12.4, buforPct: 0 })
    expect(result.status).toBe("VALID")
    expect(result.value.zapotrzebowanieZBuforemKwh).toBeCloseTo(12.4, 6)
    expect(result.value.dodatekKwh).toBe(0)
  })

  it("bufor 20%: 12,4 kWh → 14,88 kWh", () => {
    const result = calculateBuforRozbudowy({ zapotrzebowanieCalkowiteKwh: 12.4, buforPct: 20 })
    expect(result.value.zapotrzebowanieZBuforemKwh).toBeCloseTo(14.88, 6)
    expect(result.value.dodatekKwh).toBeCloseTo(2.48, 6)
  })

  it("bufor 30%: 12,4 kWh → 16,12 kWh", () => {
    const result = calculateBuforRozbudowy({ zapotrzebowanieCalkowiteKwh: 12.4, buforPct: 30 })
    expect(result.value.zapotrzebowanieZBuforemKwh).toBeCloseTo(16.12, 6)
  })

  it("INCOMPLETE — zapotrzebowanie jeszcze nie wpisane (0)", () => {
    const result = calculateBuforRozbudowy({ zapotrzebowanieCalkowiteKwh: 0, buforPct: 20 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemne zapotrzebowanie", () => {
    const result = calculateBuforRozbudowy({ zapotrzebowanieCalkowiteKwh: -5, buforPct: 20 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
