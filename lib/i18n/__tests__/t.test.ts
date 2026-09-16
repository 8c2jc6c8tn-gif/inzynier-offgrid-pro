import { describe, expect, it } from "vitest"
import { t } from "../t"
import { SUPPORTED_LANGUAGES } from "../language"
import { dictionaries } from "../dictionaries"

describe("t", () => {
  it("zwraca tekst dla znanego klucza w każdym obsługiwanym języku", () => {
    for (const jezyk of SUPPORTED_LANGUAGES) {
      expect(t(jezyk, "SPRAWNOSC-POZA-ZAKRESEM")).toBe(dictionaries[jezyk]["SPRAWNOSC-POZA-ZAKRESEM"])
    }
  })

  it("podstawia parametry placeholderów {nazwa}", () => {
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0.9")
    expect(t("en", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0.9")
    expect(t("ru", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0.9")
  })

  it("różne języki dają różny tekst dla tego samego klucza", () => {
    const pl = t("pl", "WARTOSC-NIEDODATNIA", { label: "Moc" })
    const en = t("en", "WARTOSC-NIEDODATNIA", { label: "Moc" })
    const ru = t("ru", "WARTOSC-NIEDODATNIA", { label: "Moc" })
    expect(pl).not.toBe(en)
    expect(pl).not.toBe(ru)
    expect(en).not.toBe(ru)
  })

  it("brakujący klucz -> widoczny placeholder, nie cichy fallback", () => {
    expect(t("pl", "NIEISTNIEJACY-KLUCZ")).toBe("⚠ [NIEISTNIEJACY-KLUCZ]")
  })

  it("brak params zwraca szablon bez podstawiania", () => {
    expect(t("pl", "SPRAWNOSC-POZA-ZAKRESEM")).toBe("Sprawność musi być liczbą z przedziału (0, 1].")
  })
})

describe("dictionaries — parytet kluczy", () => {
  it("każdy język ma dokładnie ten sam zestaw kluczy co polski", () => {
    const kluczePl = Object.keys(dictionaries.pl).sort()
    for (const jezyk of SUPPORTED_LANGUAGES) {
      expect(Object.keys(dictionaries[jezyk]).sort()).toEqual(kluczePl)
    }
  })
})
