import { describe, expect, it } from "vitest"
import { DEFAULT_LANGUAGE, isLanguage, negocjujJezyk, SUPPORTED_LANGUAGES } from "../language"

describe("SUPPORTED_LANGUAGES / DEFAULT_LANGUAGE", () => {
  it("PL jest domyślny i jest na liście obsługiwanych", () => {
    expect(DEFAULT_LANGUAGE).toBe("pl")
    expect(SUPPORTED_LANGUAGES).toContain(DEFAULT_LANGUAGE)
  })
})

describe("isLanguage", () => {
  it("rozpoznaje obsługiwane kody", () => {
    expect(isLanguage("pl")).toBe(true)
    expect(isLanguage("en")).toBe(true)
    expect(isLanguage("ru")).toBe(true)
  })

  it("odrzuca nieobsługiwane/puste wartości", () => {
    expect(isLanguage("de")).toBe(false)
    expect(isLanguage("")).toBe(false)
    expect(isLanguage(null)).toBe(false)
    expect(isLanguage(undefined)).toBe(false)
  })
})

describe("negocjujJezyk", () => {
  it("brak nagłówka -> język domyślny", () => {
    expect(negocjujJezyk(null)).toBe(DEFAULT_LANGUAGE)
    expect(negocjujJezyk(undefined)).toBe(DEFAULT_LANGUAGE)
  })

  it("wybiera pierwszy obsługiwany język z listy w kolejności nagłówka", () => {
    expect(negocjujJezyk("en-US,en;q=0.9,pl;q=0.8")).toBe("en")
    expect(negocjujJezyk("ru-RU,ru;q=0.9")).toBe("ru")
  })

  it("pomija nieobsługiwane języki i bierze pierwszy dopasowany", () => {
    expect(negocjujJezyk("de-DE,de;q=0.9,fr;q=0.8,pl;q=0.7")).toBe("pl")
  })

  it("żaden obsługiwany język w nagłówku -> domyślny", () => {
    expect(negocjujJezyk("de-DE,fr-FR")).toBe(DEFAULT_LANGUAGE)
  })

  it("dopasowuje po prefiksie regionu (pl-PL -> pl)", () => {
    expect(negocjujJezyk("pl-PL")).toBe("pl")
  })
})
