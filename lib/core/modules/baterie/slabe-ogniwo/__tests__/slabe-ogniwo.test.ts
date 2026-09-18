import { describe, expect, it } from "vitest"
import { calculateSlabeOgniwo } from "../calculator"

describe("calculateSlabeOgniwo", () => {
  it("VALID_WITH_WARNINGS — domyślna tolerancja 3%, 280Ah -> 271,6Ah", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 3 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.pojemnoscNajslabszegoAh).toBeCloseTo(271.6, 6)
    expect(result.value.utrataPct).toBe(3)
  })

  it("większa tolerancja daje proporcjonalnie mniejszą pojemność najsłabszego ogniwa", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 100, tolerancjaPct: 10 })
    expect(result.value.pojemnoscNajslabszegoAh).toBeCloseTo(90, 6)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 0, tolerancjaPct: 3 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna pojemność", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: -50, tolerancjaPct: 3 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — tolerancja poza zakresem [0,100]", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 150 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/params, nie gotowy tekst", () => {
    const result = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 3 })
    expect(result.warnings[0].i18nKey).toBe("POJEMNOSC-OGRANICZONA-NAJSLABSZYM")
    expect(result.warnings[0].params).toEqual({ utrata: "3.0" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "NAJGORSZY-PRZYPADEK-TOLERANCJA" }])

    const zlaTolerancja = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: 280, tolerancjaPct: 150 })
    expect(zlaTolerancja.warnings[0].i18nKey).toBe("TOLERANCJA-POZA-ZAKRESEM")

    const zlaPojemnosc = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: -50, tolerancjaPct: 3 })
    expect(zlaPojemnosc.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
  })
})
