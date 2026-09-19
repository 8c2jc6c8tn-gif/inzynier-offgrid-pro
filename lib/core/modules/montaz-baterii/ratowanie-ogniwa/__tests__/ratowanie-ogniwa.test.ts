import { describe, expect, it } from "vitest"
import { calculateRatowanieOgniwa } from "../calculator"

describe("calculateRatowanieOgniwa", () => {
  it("0V -> strefa krytyczna, ostrzeżenie critical, zalecana utylizacja", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 0 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.strefa).toBe("krytyczna")
    expect(result.warnings[0].code).toBe("OGNIWO-ZERO-WOLTOWE")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("0,8V (niskie, niezerowe) -> strefa ryzykowna, ostrzeżenie warning", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 0.8 })
    expect(result.value.strefa).toBe("ryzykowna")
    expect(result.warnings[0].code).toBe("RATUNEK-OPCJONALNY-NIEZALECANY")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("przypadek graniczny: dokładnie 1,5V -> wciąż strefa ryzykowna (próg włącznie)", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 1.5 })
    expect(result.value.strefa).toBe("ryzykowna")
  })

  it("1,51V (tuż nad progiem) -> strefa bezpieczna, procedura standardowa (info)", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 1.51 })
    expect(result.value.strefa).toBe("bezpieczna")
    expect(result.warnings[0].code).toBe("PROCEDURA-STANDARDOWEGO-RATUNKU")
    expect(result.warnings[0].level).toBe("info")
  })

  it("napięcie ujemne -> status INVALID_INPUT", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: -0.5 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak pomiaru (null) -> status INCOMPLETE", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: null })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: -0.5 })
    expect(result.warnings[0].i18nKey).toBe("NAPIECIE-OGNIWA-POLE-UJEMNE")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): ogniwo zerowoltowe zwraca i18nKey bez params, nie message", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 0 })
    expect(result.warnings[0].i18nKey).toBe("OGNIWO-ZERO-WOLTOWE")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): ratunek opcjonalny zwraca i18nKey/params, nie message", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 0.8 })
    expect(result.warnings[0].i18nKey).toBe("RATUNEK-OPCJONALNY-NIEZALECANY")
    expect(result.warnings[0].params).toEqual({ napiecie: "0.80", zasilacz: 3.0, prad: 0.5 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): procedura standardowa zwraca i18nKey/params, nie message", () => {
    const result = calculateRatowanieOgniwa({ napiecieOgniwaV: 1.51 })
    expect(result.warnings[0].i18nKey).toBe("PROCEDURA-STANDARDOWEGO-RATUNKU")
    expect(result.warnings[0].params).toEqual({ napiecie: "1.51" })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
