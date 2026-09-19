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

  it("i18n (17.2): błąd walidacji zwraca i18nKey/params, nie message", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: -10 })
    expect(result.warnings[0].i18nKey).toBe("POBOR-JALOWY-UJEMNY")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): ostrzeżenie info o koszcie bilansu zwraca i18nKey/params, nie message", () => {
    const result = calculatePoborWlasnyFalownika({ poborJalowyW: 45 })
    expect(result.warnings[0].i18nKey).toBe("STALY-KOSZT-BILANSU")
    expect(result.warnings[0].params).toEqual({ strata: "1.08" })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
