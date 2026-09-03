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
})
