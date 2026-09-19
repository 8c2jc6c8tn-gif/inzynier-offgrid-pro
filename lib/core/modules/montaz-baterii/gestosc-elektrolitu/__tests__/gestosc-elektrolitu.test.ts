import { describe, expect, it } from "vitest"
import { calculateGestoscElektrolitu } from "../calculator"

describe("calculateGestoscElektrolitu", () => {
  it("1,28 g/cm³ -> stan pełny, info", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.28 })
    expect(result.value.stan).toBe("pelny")
    expect(result.warnings[0].level).toBe("info")
  })

  it("1,20 g/cm³ (dokładnie próg połowy) -> stan częściowo naładowany, warning", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.2 })
    expect(result.value.stan).toBe("czesciowo-naladowany")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("1,15 g/cm³ -> stan rozładowany, wymagane doładowanie (dokładnie przykład C ze źródła)", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.15 })
    expect(result.value.stan).toBe("rozladowany")
    expect(result.warnings[0].code).toBe("STAN-ROZLADOWANY")
  })

  it("1,12 g/cm³ -> stan rozładowany", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.12 })
    expect(result.value.stan).toBe("rozladowany")
  })

  it("gęstość zero lub ujemna -> status INVALID_INPUT", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 0 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak pomiaru (null) -> status INCOMPLETE", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: null })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 0 })
    expect(result.warnings[0].i18nKey).toBe("GESTOSC-NIEDODATNIA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): stan pełny zwraca i18nKey/params, nie message", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.28 })
    expect(result.warnings[0].i18nKey).toBe("STAN-PELNY")
    expect(result.warnings[0].params).toEqual({ gestosc: "1.28", pelny: 1.28 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): stan częściowo naładowany zwraca i18nKey/params, nie message", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.2 })
    expect(result.warnings[0].i18nKey).toBe("STAN-CZESCIOWO-NALADOWANY")
    expect(result.warnings[0].params).toEqual({ gestosc: "1.20", polowa: 1.2 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): stan rozładowany zwraca i18nKey/params, nie message", () => {
    const result = calculateGestoscElektrolitu({ gestoscGCm3: 1.15 })
    expect(result.warnings[0].i18nKey).toBe("STAN-ROZLADOWANY")
    expect(result.warnings[0].params).toEqual({ gestosc: "1.15" })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
