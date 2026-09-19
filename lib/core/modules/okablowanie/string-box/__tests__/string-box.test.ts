import { describe, expect, it } from "vitest"
import { calculateStringBox } from "../calculator"

describe("calculateStringBox (Ekran 22, Moduł 5)", () => {
  it("nominalny: wejść wystarczająco, bezpiecznik w zakresie, skrzynka IP66 → VALID", () => {
    const result = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 6,
      bezpiecznikStringowyA: 16,
      maSkrzynkeIp66: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.wejscWystarczajaco).toBe(true)
    expect(result.value.bezpiecznikWZakresie).toBe(true)
  })

  it("graniczny: bezpiecznik dokładnie na dolnej granicy zakresu (15A) i liczba wejść = liczba stringów → VALID", () => {
    const result = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 4,
      bezpiecznikStringowyA: 15,
      maSkrzynkeIp66: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.wejscWystarczajaco).toBe(true)
    expect(result.value.bezpiecznikWZakresie).toBe(true)
  })

  it("brak skrzynki IP66 → VALID_WITH_WARNINGS, twardy stop krytyczny (1:1 ze źródła)", () => {
    const result = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 6,
      bezpiecznikStringowyA: 16,
      maSkrzynkeIp66: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("BRAK-SKRZYNKI-IP66")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("za mało wejść skrzynki względem liczby stringów → warning", () => {
    const result = calculateStringBox({
      liczbaStringow: 6,
      liczbaWejscSkrzynki: 4,
      bezpiecznikStringowyA: 16,
      maSkrzynkeIp66: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wejscWystarczajaco).toBe(false)
    expect(result.warnings[0].code).toBe("ZA-MALO-WEJSC-SKRZYNKI")
  })

  it("bezpiecznik stringowy poza zalecanym zakresem 15-20A → warning", () => {
    const result = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 6,
      bezpiecznikStringowyA: 25,
      maSkrzynkeIp66: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.bezpiecznikWZakresie).toBe(false)
    expect(result.warnings[0].code).toBe("BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM")
  })

  it("błędne dane: liczba stringów ujemna → INVALID_INPUT", () => {
    const result = calculateStringBox({
      liczbaStringow: -1,
      liczbaWejscSkrzynki: 0,
      bezpiecznikStringowyA: 0,
      maSkrzynkeIp66: false,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: liczba stringów = 0 → INCOMPLETE", () => {
    const result = calculateStringBox({
      liczbaStringow: 0,
      liczbaWejscSkrzynki: 0,
      bezpiecznikStringowyA: 0,
      maSkrzynkeIp66: false,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("liczba wejść i bezpiecznik niepodane → sprawdzenia pominięte (null), nie fałszywe VALID/false", () => {
    const result = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 0,
      bezpiecznikStringowyA: 0,
      maSkrzynkeIp66: true,
    })
    expect(result.value.wejscWystarczajaco).toBeNull()
    expect(result.value.bezpiecznikWZakresie).toBeNull()
    expect(result.status).toBe("VALID")
    expect(result.assumptions.length).toBeGreaterThanOrEqual(3)
  })

  it("i18n (17.2): ZA-MALO-WEJSC-SKRZYNKI ma i18nKey+params, assumptions to {kod}, walidacja ma i18nKey", () => {
    const zaMalo = calculateStringBox({
      liczbaStringow: 6,
      liczbaWejscSkrzynki: 4,
      bezpiecznikStringowyA: 16,
      maSkrzynkeIp66: true,
    })
    expect(zaMalo.warnings[0].i18nKey).toBe("ZA-MALO-WEJSC-SKRZYNKI")
    expect(zaMalo.warnings[0].params).toEqual({ wejscia: 4, stringi: 6 })
    expect(zaMalo.warnings[0].message).toBeUndefined()

    const niepodane = calculateStringBox({
      liczbaStringow: 4,
      liczbaWejscSkrzynki: 0,
      bezpiecznikStringowyA: 0,
      maSkrzynkeIp66: true,
    })
    expect(niepodane.assumptions).toEqual([
      { kod: "SPD-ROZLACZNIK-NIE-SPRAWDZONE" },
      { kod: "LICZBA-WEJSC-NIEPODANA-POMINIETO" },
      { kod: "BEZPIECZNIK-STRINGOWY-NIEWYBRANY-POMINIETO" },
    ])

    const invalid = calculateStringBox({
      liczbaStringow: -1,
      liczbaWejscSkrzynki: 0,
      bezpiecznikStringowyA: 0,
      maSkrzynkeIp66: false,
    })
    expect(invalid.warnings[0].i18nKey).toBe("LICZBA-STRINGOW-UJEMNA")
    expect(invalid.warnings[0].message).toBeUndefined()
  })
})
