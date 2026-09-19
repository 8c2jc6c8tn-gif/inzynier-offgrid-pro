import { describe, expect, it } from "vitest"
import { calculateRyzykoNiskiegoNapiecia } from "../calculator"

describe("calculateRyzykoNiskiegoNapiecia", () => {
  it("napięcie systemu poniżej minimum pompy -> pompa się wyłączy, critical", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 44,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.marginesV).toBe(-2)
    expect(result.warnings[0].code).toBe("POMPA-SIE-WYLACZY")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("napięcie systemu powyżej minimum pompy -> margines bezpieczny, info", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 51,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.marginesV).toBe(5)
    expect(result.warnings[0].code).toBe("MARGINES-BEZPIECZNY")
    expect(result.warnings[0].level).toBe("info")
  })

  it("napięcie systemu dokładnie na progu -> bezpieczny (margines=0)", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 46,
    })
    expect(result.value.marginesV).toBe(0)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — napięcie systemu jeszcze nie wpisane", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemne napięcie", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: -46,
      aktualneNapiecieSystemuV: 44,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey/params, nie message", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: -46,
      aktualneNapiecieSystemuV: 44,
    })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): pompa się wyłączy zwraca i18nKey/params, nie message", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 44,
    })
    expect(result.warnings[0].i18nKey).toBe("POMPA-SIE-WYLACZY")
    expect(result.warnings[0].params).toEqual({ aktualne: "44.0", min: "46.0" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): margines bezpieczny zwraca i18nKey/params, nie message", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 51,
    })
    expect(result.warnings[0].i18nKey).toBe("MARGINES-BEZPIECZNY")
    expect(result.warnings[0].params).toEqual({ margines: "5.0" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): sanity check napięcia zwraca i18nKey/params, nie message", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 65,
    })
    const w = result.warnings.find((x) => x.code === "NAPIECIE-POZA-SANITY-CHECK")
    expect(w?.i18nKey).toBe("NAPIECIE-POZA-SANITY-CHECK")
    expect(w?.params).toEqual({ max: 60 })
    expect(w?.message).toBeUndefined()
  })

  it("i18n (17.2): założenie o napięciu wpisanym ręcznie zwraca {kod}, nie string", () => {
    const result = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: 46,
      aktualneNapiecieSystemuV: 51,
    })
    expect(result.assumptions).toEqual([{ kod: "NAPIECIE-SYSTEMU-RECZNIE" }])
  })
})
