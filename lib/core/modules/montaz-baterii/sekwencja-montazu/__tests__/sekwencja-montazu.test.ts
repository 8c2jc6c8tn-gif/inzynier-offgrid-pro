import { describe, expect, it } from "vitest"
import { calculateSekwencjaMontazu, generujOkablowanieBms, generujPolaczeniaBusbarow } from "../calculator"

describe("generujPolaczeniaBusbarow", () => {
  it("4S: 3 połączenia, przejście między rzędami przy #2 (2→3)", () => {
    const wynik = generujPolaczeniaBusbarow(4)
    expect(wynik).toHaveLength(3)
    expect(wynik).toEqual([
      { numer: 1, zOgniwa: 1, doOgniwa: 2, miedzyRzedami: false },
      { numer: 2, zOgniwa: 2, doOgniwa: 3, miedzyRzedami: true },
      { numer: 3, zOgniwa: 3, doOgniwa: 4, miedzyRzedami: false },
    ])
  })

  it("8S: 7 połączeń, przejście między rzędami przy #4 (4→5)", () => {
    const wynik = generujPolaczeniaBusbarow(8)
    expect(wynik).toHaveLength(7)
    expect(wynik[3]).toEqual({ numer: 4, zOgniwa: 4, doOgniwa: 5, miedzyRzedami: true })
    expect(wynik.filter((p) => p.miedzyRzedami)).toHaveLength(1)
  })

  it("16S: 15 połączeń, przejście między rzędami przy #8 (8→9) — dokładnie jak w źródle", () => {
    const wynik = generujPolaczeniaBusbarow(16)
    expect(wynik).toHaveLength(15)
    expect(wynik[0]).toEqual({ numer: 1, zOgniwa: 1, doOgniwa: 2, miedzyRzedami: false })
    expect(wynik[7]).toEqual({ numer: 8, zOgniwa: 8, doOgniwa: 9, miedzyRzedami: true })
    expect(wynik[14]).toEqual({ numer: 15, zOgniwa: 15, doOgniwa: 16, miedzyRzedami: false })
  })
})

describe("generujOkablowanieBms", () => {
  it("4S: B0..B4, napięcia 0/3,2/6,4/9,6/12,8V", () => {
    const wynik = generujOkablowanieBms(4)
    expect(wynik).toHaveLength(5)
    expect(wynik.map((w) => w.napiecieNominalneV)).toEqual([0, 3.2, 6.4, 9.6, 12.8])
    expect(wynik[4].punktKey).toBe("UI-SEKMON-BMS-BN-PUNKT-BPLUS")
    expect(wynik[3].punktKey).toBe("UI-SEKMON-BMS-BN-PUNKT")
  })

  it("16S: B0..B16, ostatni = 51,2V (B+ pakietu)", () => {
    const wynik = generujOkablowanieBms(16)
    expect(wynik).toHaveLength(17)
    expect(wynik[16].napiecieNominalneV).toBeCloseTo(51.2, 9)
    expect(wynik[16].punktKey).toBe("UI-SEKMON-BMS-BN-PUNKT-BPLUS")
  })
})

describe("calculateSekwencjaMontazu", () => {
  it("4S -> VALID, napięcie całkowite 12,8V, preset (bez ostrzeżeń)", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 4 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieCalkowiteNominalneV).toBeCloseTo(12.8, 9)
    expect(result.value.ogniwWRzedzie).toBe(2)
    expect(result.assumptions[0]).toEqual({ kod: "SEKWENCJA-UKLAD-PRESET", params: { n: 2 } })
  })

  it("8S -> VALID, napięcie całkowite 25,6V", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 8 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieCalkowiteNominalneV).toBeCloseTo(25.6, 9)
  })

  it("16S -> VALID, napięcie całkowite 51,2V", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 16 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieCalkowiteNominalneV).toBeCloseTo(51.2, 9)
    expect(result.value.polaczeniaBusbarow).toHaveLength(15)
    expect(result.value.okablowanieBms).toHaveLength(17)
  })

  it("6S (nie-preset, ale parzysta) -> VALID, założenie oznaczone jako niedosłowne ze źródła", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 6 })
    expect(result.status).toBe("VALID")
    expect(result.assumptions[0]).toEqual({
      kod: "SEKWENCJA-UKLAD-NIESTANDARDOWY",
      params: { n: 3, liczba: 6 },
    })
  })

  it("OUT_OF_SCOPE — nieparzysta liczba ogniw", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 7 })
    expect(result.status).toBe("OUT_OF_SCOPE")
    expect(result.warnings[0].code).toBe("NIEPARZYSTA-LICZBA-OGNIW")
  })

  it("OUT_OF_SCOPE — za mało ogniw (2 < MIN_OGNIW=4)", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 2 })
    expect(result.status).toBe("OUT_OF_SCOPE")
    expect(result.warnings[0].code).toBe("ZA-MALO-OGNIW")
  })

  it("OUT_OF_SCOPE — za dużo ogniw (>32)", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 34 })
    expect(result.status).toBe("OUT_OF_SCOPE")
    expect(result.warnings[0].code).toBe("ZA-DUZO-OGNIW")
  })

  it("INCOMPLETE — liczba ogniw jeszcze nie wybrana", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna liczba ogniw", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: -4 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: -4 })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): nieparzysta liczba ogniw zwraca i18nKey/params, nie message", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 7 })
    expect(result.warnings[0].i18nKey).toBe("NIEPARZYSTA-LICZBA-OGNIW")
    expect(result.warnings[0].params).toEqual({ liczba: 7 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): za mało ogniw zwraca i18nKey/params, nie message", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 2 })
    expect(result.warnings[0].i18nKey).toBe("ZA-MALO-OGNIW")
    expect(result.warnings[0].params).toEqual({ min: 4 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): za dużo ogniw zwraca i18nKey/params, nie message", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 34 })
    expect(result.warnings[0].i18nKey).toBe("ZA-DUZO-OGNIW")
    expect(result.warnings[0].params).toEqual({ max: 32 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): założenie preset zwraca {kod,params}, nie string", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 4 })
    expect(result.assumptions).toEqual([{ kod: "SEKWENCJA-UKLAD-PRESET", params: { n: 2 } }])
  })

  it("i18n (17.2): założenie niestandardowe zwraca {kod,params}, nie string", () => {
    const result = calculateSekwencjaMontazu({ liczbaOgniw: 6 })
    expect(result.assumptions).toEqual([
      { kod: "SEKWENCJA-UKLAD-NIESTANDARDOWY", params: { n: 3, liczba: 6 } },
    ])
  })
})
