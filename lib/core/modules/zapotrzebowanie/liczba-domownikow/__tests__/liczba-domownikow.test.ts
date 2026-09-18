import { describe, expect, it } from "vitest"
import { calculateLiczbaDomownikow } from "../calculator"

describe("calculateLiczbaDomownikow", () => {
  it("4 domowników -> C.W.U. 200-280 l/dobę (4x50 do 4x70)", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 4 })
    expect(result.status).toBe("VALID")
    expect(result.value.cwuMinLDoba).toBe(200)
    expect(result.value.cwuMaxLDoba).toBe(280)
  })

  it("1 domownik (dolna granica suwaka) -> 50-70 l/dobę", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 1 })
    expect(result.value.cwuMinLDoba).toBe(50)
    expect(result.value.cwuMaxLDoba).toBe(70)
  })

  it("6 domowników (górna granica suwaka) -> 300-420 l/dobę", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 6 })
    expect(result.value.cwuMinLDoba).toBe(300)
    expect(result.value.cwuMaxLDoba).toBe(420)
  })

  it("7 domowników (poza zakresem suwaka 1-6) -> status INVALID_INPUT", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 7 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("0 (jeszcze nie wybrano) -> status INCOMPLETE", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey/params, nie message", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 7 })
    expect(result.warnings[0].i18nKey).toBe("LICZBA-DOMOWNIKOW-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toEqual({ min: 1, max: 6 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): assumptions to {kod, params}, nie gotowy tekst", () => {
    const result = calculateLiczbaDomownikow({ liczbaDomownikow: 4 })
    expect(result.assumptions).toEqual([{ kod: "CWU-ZAKRES-ORIENTACYJNY", params: { min: 50, max: 70 } }])
  })
})
