import { describe, expect, it } from "vitest"
import { calculateScenariuszAutomatyzacji } from "../calculator"

describe("Wampiry energetyczne — Automatyzacja: scenariusz standby (dawne 1.34+1.40+1.48)", () => {
  it("przykład źródła 1.34: nocny tryb czuwania 15 W zamiast 45 W → 0,72 kWh na dobę", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: 45,
      standbyWScenariuszuW: 15,
    })

    expect(result.status).toBe("VALID")
    expect(result.value.redukcjaW).toBeCloseTo(30, 5)
    expect(result.value.redukcjaDobowaKwh).toBeCloseTo(0.72, 5)
  })

  it("graniczny: standby w scenariuszu = 0 (całkowite odłączenie)", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: 20,
      standbyWScenariuszuW: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.redukcjaW).toBeCloseTo(20, 5)
    expect(result.value.redukcjaDobowaKwh).toBeCloseTo(0.48, 5)
  })

  it("scenariusz nie daje redukcji (standby w scenariuszu >= referencyjny) → info", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: 15,
      standbyWScenariuszuW: 15,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.redukcjaW).toBe(0)
    expect(result.warnings[0].code).toBe("WAMPIR-REDUKCJA-NIEPOZYTYWNA")
    expect(result.warnings[0].level).toBe("info")
  })

  it("błędne dane: standby referencyjny ujemny → INVALID_INPUT", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: -5,
      standbyWScenariuszuW: 10,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("błędne dane: standby w scenariuszu ujemny → INVALID_INPUT", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: 45,
      standbyWScenariuszuW: -1,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n: warnings mają i18nKey, nie gotowy tekst PL", () => {
    const result = calculateScenariuszAutomatyzacji({
      standbyReferencyjnyW: -5,
      standbyWScenariuszuW: 10,
    })
    expect(result.warnings[0].i18nKey).toBe("WAMPIR-STANDBY-REFERENCYJNY-NIEDODATNI")
    expect(result.warnings[0].message).toBeUndefined()
  })
})
