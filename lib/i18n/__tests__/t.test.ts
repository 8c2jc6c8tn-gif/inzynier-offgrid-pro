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

describe("t — klucze zmigrowane 16.09.2026 (systemy-podtrzymania-zycia, cop-pompy-ciepla, lokalizacja-i-klimat)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "WARTOSC-POZA-ZAKRESEM": { label: "szerokość geograficzna", min: -90, max: 90 },
    "POZYCJA-NIEDODATNIA": { label: "Router" },
    "POZYCJA-WARTOSC-DOMYSLNA": { label: "Router", value: 15 },
    "COP-POZA-ZAKRESEM": { min: 1, max: 8 },
  }
  const kluczeBezParametrow = ["BRAK-ZAZNACZONYCH", "MOC-CIEPLNA-NIETYPOWO-WYSOKA", "COP-ZALEZY-OD-TEMPERATURY", "DANE-KLIMATYCZNE-TRYB-OFFLINE"]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(String(wartosc))
        expect(en).toContain(String(wartosc))
        expect(ru).toContain(String(wartosc))
      }
      expect(pl).not.toBe(en)
      expect(pl).not.toBe(ru)
      expect(en).not.toBe(ru)
    }
  })

  it("klucze bez parametrów: tekst istnieje i różni się między językami", () => {
    for (const kod of kluczeBezParametrow) {
      const pl = t("pl", kod)
      const en = t("en", kod)
      const ru = t("ru", kod)
      expect(pl.length).toBeGreaterThan(0)
      expect(pl).not.toBe(en)
      expect(pl).not.toBe(ru)
      expect(en).not.toBe(ru)
    }
  })
})

describe("t — klucze zmigrowane 18.09.2026 (liczba-domownikow, dni-autonomii, moc-pozorna-cosfi)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": { min: 1, max: 6 },
    "CWU-ZAKRES-ORIENTACYJNY": { min: 50, max: 70 },
    "WPLYW-NA-MAGAZYN": { dni: 3, pojemnosc: "12.5" },
    "MOC-POZORNA-INFO": { va: "1200", w: "960" },
  }
  const kluczeBezParametrow = [
    "ZAPOTRZEBOWANIE-UJEMNE",
    "SPRAWNOSC-PROCENT-POZA-ZAKRESEM",
    "DOD-POZA-ZAKRESEM",
    "COS-FI-POZA-ZAKRESEM",
    "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(String(wartosc))
        expect(en).toContain(String(wartosc))
        expect(ru).toContain(String(wartosc))
      }
      expect(pl).not.toBe(en)
      expect(pl).not.toBe(ru)
      expect(en).not.toBe(ru)
    }
  })

  it("klucze bez parametrów: tekst istnieje i różni się między językami", () => {
    for (const kod of kluczeBezParametrow) {
      const pl = t("pl", kod)
      const en = t("en", kod)
      const ru = t("ru", kod)
      expect(pl.length).toBeGreaterThan(0)
      expect(pl).not.toBe(en)
      expect(pl).not.toBe(ru)
      expect(en).not.toBe(ru)
    }
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
