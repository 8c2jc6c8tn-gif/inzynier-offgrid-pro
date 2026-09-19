import { describe, expect, it } from "vitest"
import { calculateAgregatPradotworczy } from "../calculator"

describe("calculateAgregatPradotworczy", () => {
  it("VALID — przykład ze źródła odtworzony dokładnie: deficyt 80kWh, agregat 5kW → 20h, 25l, 200zł", () => {
    const result = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: 5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.godzinyPracy).toBeCloseTo(20, 6)
    expect(result.value.zuzyciePaliwaLitry).toBeCloseTo(25, 6)
    expect(result.value.kosztZl).toBeCloseTo(200, 6)
  })

  it("VALID_WITH_WARNINGS — brak wyjścia sterującego BMS", () => {
    const result = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: 5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("BRAK-WYJSCIA-STERUJACEGO")
  })

  it("większy agregat skraca czas pracy proporcjonalnie", () => {
    const result = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: 10,
      sredniZuzycieLH: 2,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
    })
    expect(result.value.godzinyPracy).toBeCloseTo(10, 6)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateAgregatPradotworczy({
      deficytKwh: 0,
      mocAgregatuKw: 5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc agregatu", () => {
    const result = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: -5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): BRAK-WYJSCIA-STERUJACEGO/MOCAGREGATUKW-NIEDODATNI mają i18nKey, assumption to {kod}", () => {
    const brak = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: 5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: false,
    })
    expect(brak.warnings[0].i18nKey).toBe("BRAK-WYJSCIA-STERUJACEGO")
    expect(brak.warnings[0].message).toBeUndefined()
    expect(brak.assumptions).toEqual([{ kod: "OPTYMALNE-OBCIAZENIE-AGREGATU", params: { procent: 80 } }])

    const invalid = calculateAgregatPradotworczy({
      deficytKwh: 80,
      mocAgregatuKw: -5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
    })
    expect(invalid.warnings[0].i18nKey).toBe("MOCAGREGATUKW-NIEDODATNI")
    expect(invalid.warnings[0].message).toBeUndefined()
  })
})
