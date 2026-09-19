import { describe, expect, it } from "vitest"
import { calculateBalanseryZewnetrzneOlow } from "../calculator"

describe("calculateBalanseryZewnetrzneOlow", () => {
  it("4 akumulatory w szeregu bez balansera -> critical, VALID_WITH_WARNINGS", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: 4,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wymaganyBalanser).toBe(true)
    expect(result.warnings[0].code).toBe("BRAK-BALANSERA-ZEWNETRZNEGO")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("4 akumulatory w szeregu z balanserem -> VALID, bez ostrzeżeń", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: 4,
      posiadaBalanserZewnetrzny: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings).toHaveLength(0)
  })

  it("1 akumulator (bez szeregu) -> balanser niewymagany nawet bez niego", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: 1,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.value.wymaganyBalanser).toBe(false)
    expect(result.status).toBe("VALID")
  })

  it("liczba akumulatorów ujemna -> status INVALID_INPUT", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: -1,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanej liczby (0) -> status INCOMPLETE", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: 0,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): brak balansera zwraca i18nKey/params, nie message", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: 4,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.warnings[0].i18nKey).toBe("BRAK-BALANSERA-ZEWNETRZNEGO")
    expect(result.warnings[0].params).toEqual({ ilosc: 4 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: -1,
      posiadaBalanserZewnetrzny: false,
    })
    expect(result.warnings[0].i18nKey).toBe("ILOSC-AKUMULATOROW-NIEDODATNIA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })
})
