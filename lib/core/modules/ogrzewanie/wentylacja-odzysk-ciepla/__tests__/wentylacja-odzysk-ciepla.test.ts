import { describe, expect, it } from "vitest"
import { calculateWentylacjaOdzyskCiepla } from "../calculator"

describe("calculateWentylacjaOdzyskCiepla", () => {
  it("przykład źródła: 250 m³/h, sprawność 85%, ΔT=30K -> odzysk ok. 2,14 kW (źródło: 2,1 kW)", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 85,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.odzyskaneCieploKw).toBeCloseTo(2.135625, 5)
  })

  it("podwojenie wydajności centrali -> podwojenie odzysku (liniowość wzoru)", () => {
    const result1 = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 100,
      sprawnoscRekuperatoraPct: 80,
      deltaTK: 20,
      poborWentylatorowW: 60,
    })
    const result2 = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 200,
      sprawnoscRekuperatoraPct: 80,
      deltaTK: 20,
      poborWentylatorowW: 60,
    })
    expect(result2.value.odzyskaneCieploKw).toBeCloseTo(result1.value.odzyskaneCieploKw * 2, 6)
  })

  it("sprawność 100% -> odzysk równy pełnej stracie ciepła powietrza wywiewanego", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 100,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.value.odzyskaneCieploKw).toBeCloseTo(2.5125, 4)
  })

  it("INCOMPLETE — ΔT jeszcze nie wpisane", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 85,
      deltaTK: null,
      poborWentylatorowW: 70,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — sprawność powyżej 100%", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 120,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna wydajność centrali", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: -250,
      sprawnoscRekuperatoraPct: 85,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji (sprawność poza zakresem) zwraca i18nKey/params, nie message", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 120,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.warnings[0].i18nKey).toBe("SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): odzysk info zwraca i18nKey/params, nie message", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 85,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.warnings[0].i18nKey).toBe("ODZYSK-INFO")
    expect(result.warnings[0].params).toEqual({ odzysk: "2.14", pobor: "70" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): założenia zwracają {kod}, nie stringi", () => {
    const result = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: 250,
      sprawnoscRekuperatoraPct: 85,
      deltaTK: 30,
      poborWentylatorowW: 70,
    })
    expect(result.assumptions).toEqual([
      { kod: "STALE-FIZYCZNE-POWIETRZA-WENTYLACJA" },
      { kod: "POBOR-WENTYLATOROW-OSOBNO-BILANS" },
      { kod: "PROJEKT-STRUMIENI-BYPASS-NIE-LICZONE" },
    ])
  })
})
