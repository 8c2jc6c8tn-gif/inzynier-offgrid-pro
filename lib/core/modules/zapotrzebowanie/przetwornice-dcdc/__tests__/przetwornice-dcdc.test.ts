import { describe, expect, it } from "vitest"
import { calculatePrzetworniceDcdc } from "../calculator"

describe("calculatePrzetworniceDcdc", () => {
  it("VALID — sprawność 92% zgodna z przykładem źródła: strata dokładnie 8% mocy realnie pobranej", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: false,
      sprawnoscPrzetwornicyPct: 92,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zapotrzebowanieRealneW).toBeCloseTo(108.69565217391303, 6)
    expect(result.value.strataW).toBeCloseTo(8.695652173913032, 6)
    expect((result.value.strataW / result.value.zapotrzebowanieRealneW) * 100).toBeCloseTo(8, 6)
  })

  it("VALID — zasilanie bezpośrednie: brak strat", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: true,
      sprawnoscPrzetwornicyPct: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zapotrzebowanieRealneW).toBe(100)
    expect(result.value.strataW).toBe(0)
    expect(result.warnings[0].code).toBe("ZASILANIE-BEZPOSREDNIE")
  })

  it("INCOMPLETE — przez przetwornicę, ale sprawność jeszcze nie wpisana", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: false,
      sprawnoscPrzetwornicyPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — sprawność poza zakresem [0,100]", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: false,
      sprawnoscPrzetwornicyPct: 150,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji (sprawność poza zakresem) zwraca i18nKey/params, nie message", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: false,
      sprawnoscPrzetwornicyPct: 150,
    })
    expect(result.warnings[0].i18nKey).toBe("SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): strata na konwersji zwraca i18nKey/params, nie message", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: false,
      sprawnoscPrzetwornicyPct: 92,
    })
    expect(result.warnings[0].i18nKey).toBe("STRATA-NA-KONWERSJI")
    expect(result.warnings[0].params).toEqual({ strata: "8", strataW: "8.7" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): zasilanie bezpośrednie zwraca i18nKey bez params, nie message", () => {
    const result = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: 100,
      zasilanieBezposrednie: true,
      sprawnoscPrzetwornicyPct: 0,
    })
    expect(result.warnings[0].i18nKey).toBe("ZASILANIE-BEZPOSREDNIE")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })
})
