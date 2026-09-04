import { describe, expect, it } from "vitest"
import { calculatePoborWlasnyFalownika } from "../calculator"

describe("calculatePoborWlasnyFalownika", () => {
  it("VALID — przykład ze źródła: 45W → 1,08 kWh/dobę", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: 45 })
    expect(result.status).toBe("VALID")
    expect(result.value.strataDobowaKwh).toBeCloseTo(1.08, 6)
  })

  it("domyślny pobór 50W daje 1,2 kWh/dobę", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: 50 })
    expect(result.value.strataDobowaKwh).toBeCloseTo(1.2, 6)
  })

  it("INCOMPLETE — pobór jeszcze nie wpisany (0)", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny pobór", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: -10 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
