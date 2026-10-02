import { describe, expect, it } from "vitest"
import { calculateMocPozornaCosfi } from "../calculator"

describe("calculateMocPozornaCosfi", () => {
  it("VALID — domyślny cos φ 0,7: 2000W → 2857,1 VA", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 2000, cosFi: 0.7 })
    expect(result.status).toBe("VALID")
    expect(result.value.mocPozornaVA).toBeCloseTo(2857.1428571428573, 6)
  })

  it("cos φ = 1 (obciążenie rezystancyjne): moc pozorna = moc czynna", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 1000, cosFi: 1 })
    expect(result.value.mocPozornaVA).toBeCloseTo(1000, 6)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 0, cosFi: 0.7 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — cos φ poza zakresem (0,1]", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 2000, cosFi: 1.5 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna moc czynna", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: -2000, cosFi: 0.7 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd ujemnej mocy reużywa wspólnego klucza WARTOSC-NIEDODATNIA", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: -2000, cosFi: 0.7 })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
    expect(result.warnings[0].params).toEqual({ labelKey: "POLE-MOC-CZYNNA-L" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): warning informacyjny zwraca i18nKey/params, nie message", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 2000, cosFi: 0.7 })
    expect(result.warnings[0].i18nKey).toBe("MOC-POZORNA-INFO")
    expect(result.warnings[0].params).toEqual({ va: "2857", w: "2000" })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
