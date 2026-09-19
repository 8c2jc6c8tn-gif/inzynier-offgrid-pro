import { describe, expect, it } from "vitest"
import { calculateKociolElektryczny } from "../calculator"

describe("calculateKociolElektryczny", () => {
  it("przykład źródła: COP=3 -> kocioł zużywa dokładnie 3x więcej prądu", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 3,
      cenaZaKwhZl: 1,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.energiaPompyKwh).toBeCloseTo(13.3333333, 5)
    expect(result.value.energiaKotlaKwh).toBe(40)
    expect(result.value.mnoznikZuzycia).toBeCloseTo(3, 6)
    expect(result.value.kosztPompyZl).toBeCloseTo(13.3333333, 5)
    expect(result.value.kosztKotlaZl).toBe(40)
    expect(result.value.oszczednoscZl).toBeCloseTo(26.6666667, 5)
  })

  it("przykład źródła: COP=4 -> kocioł zużywa dokładnie 4x więcej prądu", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 4,
      cenaZaKwhZl: 1,
    })
    expect(result.value.mnoznikZuzycia).toBeCloseTo(4, 6)
  })

  it("wyższa cena energii -> proporcjonalnie większa oszczędność w zł", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 3,
      cenaZaKwhZl: 2,
    })
    expect(result.value.oszczednoscZl).toBeCloseTo(53.3333333, 5)
  })

  it("INCOMPLETE — cena energii jeszcze nie wpisana", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 3,
      cenaZaKwhZl: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — COP poza sensownym zakresem", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 20,
      cenaZaKwhZl: 1,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemne zapotrzebowanie", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: -40,
      copPompy: 3,
      cenaZaKwhZl: 1,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji (COP poza zakresem) zwraca i18nKey/params, nie message", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 20,
      cenaZaKwhZl: 1,
    })
    expect(result.warnings[0].i18nKey).toBe("COP-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toEqual({ min: 0.5, max: 8 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): oszczędność zwraca i18nKey/params, nie message", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 3,
      cenaZaKwhZl: 1,
    })
    expect(result.warnings[0].i18nKey).toBe("OSZCZEDNOSC-KOCIOL-VS-POMPA")
    expect(result.warnings[0].params).toEqual({ oszczednosc: "26.67", mnoznik: "3.0" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): założenia zwracają {kod}, nie stringi", () => {
    const result = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: 40,
      copPompy: 3,
      cenaZaKwhZl: 1,
    })
    expect(result.assumptions).toEqual([{ kod: "KOCIOL-SPRAWNOSC-COP1" }, { kod: "TA-SAMA-CENA-ENERGII-OBA-ZRODLA" }])
  })
})
