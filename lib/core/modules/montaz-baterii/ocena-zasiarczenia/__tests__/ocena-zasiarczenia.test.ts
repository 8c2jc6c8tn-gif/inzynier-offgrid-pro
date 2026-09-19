import { describe, expect, it } from "vitest"
import { calculateOcenaZasiarczenia } from "../calculator"

describe("calculateOcenaZasiarczenia", () => {
  it("brak zaznaczonych objawów -> VALID, bez ostrzeżeń", () => {
    const result = calculateOcenaZasiarczenia({ obserwowaneObjawyIds: [] })
    expect(result.status).toBe("VALID")
    expect(result.warnings).toHaveLength(0)
  })

  it("jeden zaznaczony objaw -> VALID_WITH_WARNINGS, odsyła do B11", () => {
    const result = calculateOcenaZasiarczenia({ obserwowaneObjawyIds: ["bialy-nalot"] })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.liczbaObjawow).toBe(1)
    expect(result.warnings[0].code).toBe("OBJAWY-ZASIARCZENIA-OBECNE")
  })

  it("wszystkie 4 objawy zaznaczone -> liczbaObjawow = 4", () => {
    const result = calculateOcenaZasiarczenia({
      obserwowaneObjawyIds: [
        "dlugi-czas-ladowania",
        "szybkie-rozladowanie",
        "bialy-nalot",
        "szybki-spadek-napiecia",
      ],
    })
    expect(result.value.liczbaObjawow).toBe(4)
  })

  it("nieznane id ignorowane", () => {
    const result = calculateOcenaZasiarczenia({ obserwowaneObjawyIds: ["nieistniejacy-id"] })
    expect(result.value.liczbaObjawow).toBe(0)
    expect(result.status).toBe("VALID")
  })

  it("i18n (17.2): jeden objaw zwraca i18nKey bez params, nie message", () => {
    const result = calculateOcenaZasiarczenia({ obserwowaneObjawyIds: ["bialy-nalot"] })
    expect(result.warnings[0].i18nKey).toBe("OBJAWY-ZASIARCZENIA-JEDEN")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): wiele objawów zwraca i18nKey/params, nie message", () => {
    const result = calculateOcenaZasiarczenia({
      obserwowaneObjawyIds: ["dlugi-czas-ladowania", "szybkie-rozladowanie"],
    })
    expect(result.warnings[0].i18nKey).toBe("OBJAWY-ZASIARCZENIA-WIELE")
    expect(result.warnings[0].params).toEqual({ liczba: 2 })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
