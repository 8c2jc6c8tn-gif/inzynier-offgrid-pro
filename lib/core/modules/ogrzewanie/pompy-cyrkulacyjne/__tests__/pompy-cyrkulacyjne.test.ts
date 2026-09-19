import { describe, expect, it } from "vitest"
import { calculatePompyCyrkulacyjne } from "../calculator"

describe("calculatePompyCyrkulacyjne", () => {
  it("przykład źródła: 45W/24h -> 1,08 kWh/dobę; 8W/24h -> 0,19 kWh/dobę", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 24,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.energiaObecnaKwh).toBeCloseTo(1.08, 6)
    expect(result.value.energiaNowaKwh).toBeCloseTo(0.192, 6)
    expect(result.value.oszczednoscKwh).toBeCloseTo(0.888, 6)
    expect(result.value.oszczednoscPct).toBeCloseTo(82.222222, 4)
    expect(result.warnings[0].code).toBe("OSZCZEDNOSC")
    expect(result.warnings[0].level).toBe("info")
  })

  it("nowa pompa nie jest tańsza (moc równa) -> warning", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 45,
      godzinyPracyDobowoH: 24,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.oszczednoscKwh).toBe(0)
    expect(result.warnings[0].code).toBe("NOWA-POMPA-NIE-OSZCZEDZA")
  })

  it("praca sterowana (12h/dobę) -> energia o połowę mniejsza niż przy 24h", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 12,
    })
    expect(result.value.energiaObecnaKwh).toBeCloseTo(0.54, 6)
  })

  it("INCOMPLETE — godziny pracy jeszcze nie wpisane", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — godziny pracy powyżej 24h", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 30,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna moc", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: -45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 24,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji (godziny poza zakresem) zwraca i18nKey/params, nie message", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 30,
    })
    expect(result.warnings[0].i18nKey).toBe("GODZINY-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): oszczędność zwraca i18nKey/params, nie message", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 24,
    })
    expect(result.warnings[0].i18nKey).toBe("OSZCZEDNOSC-POMPA-CYRKULACYJNA")
    expect(result.warnings[0].params).toEqual({ oszczednoscKwh: "0.89", oszczednoscPct: "82" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): nowa pompa nie oszczędza zwraca i18nKey bez params, nie message", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 45,
      godzinyPracyDobowoH: 24,
    })
    expect(result.warnings[0].i18nKey).toBe("NOWA-POMPA-NIE-OSZCZEDZA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): założenie o godzinach pracy zwraca {kod}, nie string", () => {
    const result = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: 45,
      mocNowejPompyW: 8,
      godzinyPracyDobowoH: 24,
    })
    expect(result.assumptions).toEqual([{ kod: "GODZINY-PRACY-WPISANE-RECZNIE" }])
  })
})
