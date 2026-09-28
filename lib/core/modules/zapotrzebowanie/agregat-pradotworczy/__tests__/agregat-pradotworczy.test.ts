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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
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
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
    })
    expect(invalid.warnings[0].i18nKey).toBe("MOCAGREGATUKW-NIEDODATNI")
    expect(invalid.warnings[0].message).toBeUndefined()
  })

  it("D48: blok bezpieczeństwa — 🔴 w budynku i bez przełącznika, widoczny także przy niepełnych liczbach", () => {
    const baza = {
      deficytKwh: 80,
      mocAgregatuKw: 5,
      sredniZuzycieLH: 1.25,
      cenaZaLitrZl: 8,
      maWyjscieSterujaceBms: true,
      miejsceAgregatu: null,
      podlaczenieAgregatu: null,
    } as const
    const zawsze = calculateAgregatPradotworczy(baza).warnings.map((w) => w.code)
    expect(zawsze).toEqual([
      "MA-WYJSCIE-STERUJACE",
      "AGREGAT-GORACE-CZESCI-OPARY",
      "AGREGAT-PALIWO-OSOBNO",
      "AGREGAT-SRODKI-GASNICZE",
    ])
    const zle = calculateAgregatPradotworczy({
      ...baza,
      miejsceAgregatu: "wewnatrz-budynku",
      podlaczenieAgregatu: "bez-przelacznika",
    })
    expect(zle.status).toBe("VALID_WITH_WARNINGS")
    expect(zle.warnings.filter((w) => w.level === "critical").map((w) => w.code)).toEqual([
      "AGREGAT-W-BUDYNKU-CZAD",
      "AGREGAT-BEZ-PRZELACZNIKA",
    ])
    const niepelne = calculateAgregatPradotworczy({ ...baza, deficytKwh: 0, miejsceAgregatu: "wewnatrz-budynku" })
    expect(niepelne.status).toBe("INCOMPLETE")
    expect(niepelne.warnings[0].code).toBe("AGREGAT-W-BUDYNKU-CZAD")
    expect(calculateAgregatPradotworczy({ ...baza, deficytKwh: 0 }).warnings).toEqual([])
    const wejscie = calculateAgregatPradotworczy({ ...baza, podlaczenieAgregatu: "wejscie-ac-falownika" })
    expect(wejscie.status).toBe("VALID")
  })
})
