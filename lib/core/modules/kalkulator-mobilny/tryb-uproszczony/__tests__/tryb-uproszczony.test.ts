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

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: -10, napiecieV: 12, mocOdbiornikaW: 50 })
    expect(result.warnings[0].i18nKey).toBe("POJEMNOSCAH-NIEDODATNI")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): założenie o czasie teoretycznym zwraca {kod}, nie string", () => {
    const result = calculateTrybUproszczony({ pojemnoscAh: 100, napiecieV: 12, mocOdbiornikaW: 50 })
    expect(result.assumptions).toEqual([{ kod: "TRYB-UPROSZCZONY-CZAS-TEORETYCZNY" }])
  })
})
