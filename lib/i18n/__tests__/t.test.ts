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

describe("t — klucze zmigrowane 18.09.2026, partia 3 (baterie: chlodzenie-latem, cold-c-rate, cold-cranking-amps, detekcja-doziemienia, detekcja-zwarcia-efuse)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "TEMPERATURA-POWYZEJ-ZAKRESU": { temp: "48.0", max: 35 },
    "TEMPERATURA-PONIZEJ-ZAKRESU": { temp: "5.0", min: 15 },
    "TEMPERATURA-W-ZAKRESIE": { temp: "25.0", min: 15, max: 35 },
    "BLOKADA-LADOWANIA-MROZ": { temp: "-15.0" },
    "LIMIT-PRADU-ZIMNO": { temp: "-5.0", maxPrad: "28.0" },
    "LIMIT-PRADU-CHLODNO": { temp: "2.0", maxPrad: "20.0" },
    "LUKA-TABELI-ZRODLA": { temp: "7.0" },
    "FALOWNIK-SIE-WYLACZY": { vSag: "40.8", minNap: "44.0" },
    "FALOWNIK-UTRZYMA-NAPIECIE": { vSag: "50.55", minNap: "44.0" },
    "WARTOSC-UJEMNA": { label: "Prąd rozruchowy" },
    "WYMAGANY-E-FUSE": { pradA: "5000", zdolnoscA: "500" },
    "E-FUSE-NIEPOTRZEBNY": { pradA: "5000", zdolnoscA: "6000" },
  }
  const kluczeBezParametrow = [
    "POJEMNOSC-NIEDODATNIA",
    "REZYSTANCJA-ZMIERZONA-W-TEMPERATURZE",
    "BRAK-ZABEZPIECZENIA-DOZIEMIENIA",
    "ZABEZPIECZENIE-OBECNE",
    "MODEL-ZWARCIA-PROSTEGO",
    "BRAK-LIMITU-PRADU-POWYZEJ-10C",
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

describe("t — klucze zmigrowane 18.09.2026, partia 4 (baterie: dobor-bezpiecznika-dc, dobor-pojemnosci, grzalki-bms-mroz, kalibracja-soc, koniec-ladowania + poprawki validation.ts w chlodzenie-latem)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "AIC-PONIZEJ-ZALECANEGO-MINIMUM": { min: 10000 },
    "BRAK-POTRZEBY-GRZANIA": { temp: "10.0", prog: 5 },
    "GRZANIE-Z-BATERII": { soc: 31, prog: 30 },
    "GRZANIE-WSTRZYMANE": { soc: 29, prog: 30 },
    "REKOMENDOWANA-KALIBRACJA-SOC": { dni: 14, prog: 14 },
    "KALIBRACJA-NIEPOTRZEBNA": { dni: 13, prog: 14 },
    "WARTOSC-POLA-UJEMNA": { label: "aktualny prąd" },
    "FAZA-CC": { prog: 3.55 },
    "FAZA-CV-KONCOWKA": { aktualny: "20.0", prog: "14.0" },
    "LADOWANIE-ZAKONCZONE": { prog: "14.0" },
  }
  const kluczeBezParametrow = [
    "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    "MODEL-ZWARCIA-PROSTEGO-NIZSZY",
    "ZAPOTRZEBOWANIE-NIEDODATNIE",
    "DNI-AUTONOMII-NIEDODATNIE",
    "SPRAWNOSC-PROCENT-DODATNIA-POZA-ZAKRESEM",
    "DOD-DODATNI-POZA-ZAKRESEM",
    "BUFOR-STARZENIOWY-NIE-DOLICZONY",
    "SOC-POZA-ZAKRESEM",
    "GRZANIE-Z-PV",
    "DNI-UJEMNE",
    "TEMPERATURA-FIZYCZNIE-NIEMOZLIWA",
    "PROG-KONCOWY-POZA-ZAKRESEM",
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

describe("t — klucze zmigrowane 18.09.2026, partia 5 (baterie: long-term-storage, mixing-rownolegle, modul-ev, obwod-precharge, pobor-wlasny-bms)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "SOC-POZA-ZALECANYM-ZAKRESEM": { soc: 100, min: 50, max: 60 },
    "TEMPERATURA-PONIZEJ-MINIMUM-BEZPIECZNEGO": { temp: "-20.1", min: -20 },
    "ROZNICA-NAPIEC-ZA-DUZA": { roznica: "0.50", prog: 0.2 },
    "BRAKUJE-ENERGII-LATO": { brak: "3.5" },
    "BRAKUJE-ENERGII-ZIMA": { brak: "7.0" },
    "POBOR-UJEMNY": { label: "Pobór w trybie pracy ciągłej" },
  }
  const kluczeBezParametrow = [
    "SOC-DOCELOWY-POZA-ZAKRESEM",
    "INNA-CHEMIA-BEZ-IZOLACJI",
    "PRAD-WYROWNAWCZY-CHWILA-POLACZENIA",
    "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    "POKRYTE-W-CALOSCI-LATO",
    "POKRYTE-W-CALOSCI-ZIMA",
    "POJEMNOSC-FALOWNIKA-NIEDODATNIA",
    "REZYSTANCJA-PRECHARGE-NIEDODATNIA",
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

  it("POKRYTE/BRAKUJE-ENERGII mają osobne klucze per sezon (lato/zima), nie surowy tekst PL jako param", () => {
    for (const jezyk of ["pl", "en", "ru"] as const) {
      expect(t(jezyk, "POKRYTE-W-CALOSCI-LATO")).not.toBe(t(jezyk, "POKRYTE-W-CALOSCI-ZIMA"))
      expect(t(jezyk, "BRAKUJE-ENERGII-LATO", { brak: "1" })).not.toBe(t(jezyk, "BRAKUJE-ENERGII-ZIMA", { brak: "1" }))
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
