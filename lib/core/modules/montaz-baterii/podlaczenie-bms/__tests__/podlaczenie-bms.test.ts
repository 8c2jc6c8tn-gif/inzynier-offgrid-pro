import { describe, expect, it } from "vitest"
import { calculatePodlaczenieBms } from "../calculator"

describe("calculatePodlaczenieBms", () => {
  it("przykład ze źródła: R=50Ω, C=2200µF -> T = 5×50×0,0022 = 0,55 s", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.czasPreChargeS).toBe(0.55)
  })

  it("większa pojemność (10000µF) przy tej samej rezystancji -> dłuższy czas pre-charge", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 10000,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: [],
    })
    expect(result.value.czasPreChargeS).toBe(2.5)
  })

  it("pojemność niedodatnia -> status INVALID_INPUT", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 0,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("rezystancja niedodatnia -> status INVALID_INPUT", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: -5,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("wszystkie 4 kroki potwierdzone po kolei -> VALID", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: ["wtyczka-balansujaca", "przewody-glowne", "pre-charge", "komunikacja-bms"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value.potwierdzoneWKolejnosci).toBe(4)
  })

  it("krok potwierdzony poza kolejnością -> ostrzeżenie, nie liczy się do postępu", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: ["wtyczka-balansujaca", "komunikacja-bms"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzoneWKolejnosci).toBe(1)
    expect(result.warnings[0].code).toBe("KROK-POZA-KOLEJNOSCIA")
  })

  it("i18n (17.2): błąd walidacji (pojemność) zwraca i18nKey bez params, nie message", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 0,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("POJEMNOSCFALOWNIKAUF-NIEDODATNI")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): błąd walidacji (rezystancja) zwraca i18nKey bez params, nie message", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: -5,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("REZYSTANCJAPRECHARGEOHM-NIEDODATNI")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): krok poza kolejnością zwraca i18nKey bez params, nie message", () => {
    const result = calculatePodlaczenieBms({
      pojemnoscFalownikaUf: 2200,
      rezystancjaPreChargeOhm: 50,
      potwierdzoneIds: ["wtyczka-balansujaca", "komunikacja-bms"],
    })
    expect(result.warnings[0].i18nKey).toBe("KROK-POZA-KOLEJNOSCIA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })
})
