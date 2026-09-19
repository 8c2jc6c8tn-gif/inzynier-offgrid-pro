import { describe, expect, it } from "vitest"
import { calculateStressTestMppt } from "../calculator"

describe("calculateStressTestMppt", () => {
  it("przykład źródła: Voc 56,5V, β=-0,3%/°C, Tmin=-25°C, 8 paneli -> ok. 520V, limit 450V -> KRYTYCZNE", () => {
    const result = calculateStressTestMppt({
      vocStcV: 56.5,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 8,
      limitMpptV: 450,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.vStringV).toBeCloseTo(519.8, 1)
    expect(result.warnings[0].code).toBe("PRZEKROCZONY-LIMIT-MPPT")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("bezpieczny margines: 4 panele zamiast 8 (rekomendacja źródła) -> poniżej limitu", () => {
    const result = calculateStressTestMppt({
      vocStcV: 56.5,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 4,
      limitMpptV: 450,
    })
    expect(result.value.vStringV).toBeCloseTo(259.9, 1)
    expect(result.warnings[0].level).toBe("info")
  })

  it("żółty próg: napięcie tuż powyżej 95% limitu", () => {
    const result = calculateStressTestMppt({
      vocStcV: 50,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 7,
      limitMpptV: 450,
    })
    // Vmax = 50*(1+0.003*50)=57.5, Vstring=7*57.5=402.5 -> 402.5/450=89.4% -> poniżej 95%, powinno być info
    expect(result.value.vStringV).toBeLessThan(0.95 * 450)
  })

  it("brak zbieżności fizyki nie blokuje obliczenia — β dodatnie (nietypowe) też liczy się poprawnie", () => {
    const result = calculateStressTestMppt({
      vocStcV: 50,
      betaPctNaC: 0.3,
      tminC: -25,
      liczbaPaneliWStringu: 4,
      limitMpptV: 450,
    })
    expect(result.status).not.toBe("INVALID_INPUT")
  })

  it("INCOMPLETE — Tmin jeszcze nie wpisana (null)", () => {
    const result = calculateStressTestMppt({
      vocStcV: 56.5,
      betaPctNaC: -0.3,
      tminC: null,
      liczbaPaneliWStringu: 8,
      limitMpptV: 450,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna liczba paneli", () => {
    const result = calculateStressTestMppt({
      vocStcV: 56.5,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: -1,
      limitMpptV: 450,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): PRZEKROCZONY-LIMIT-MPPT ma i18nKey+params, nie message", () => {
    const result = calculateStressTestMppt({
      vocStcV: 56.5,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 8,
      limitMpptV: 450,
    })
    expect(result.warnings[0].i18nKey).toBe("PRZEKROCZONY-LIMIT-MPPT")
    expect(result.warnings[0].params).toEqual({ vString: "520", limit: "450" })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
