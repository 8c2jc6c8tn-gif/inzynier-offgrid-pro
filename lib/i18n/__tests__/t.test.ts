import { describe, expect, it } from "vitest"
import { t } from "../t"
import { SUPPORTED_LANGUAGES } from "../language"
import { dictionaries } from "../dictionaries"

/** Oczekiwana postać parametru w tekście — PL/RU z przecinkiem dziesiętnym (t.ts, formatujParametr). */
function jakWJezyku(jezyk: "pl" | "en" | "ru", wartosc: string | number): string {
  const tekst = String(wartosc)
  if (jezyk === "en") return tekst
  return typeof wartosc === "number" || /^-?\d+\.\d+$/.test(tekst) ? tekst.replace(".", ",") : tekst
}

describe("t", () => {
  it("zwraca tekst dla znanego klucza w każdym obsługiwanym języku", () => {
    for (const jezyk of SUPPORTED_LANGUAGES) {
      expect(t(jezyk, "SPRAWNOSC-POZA-ZAKRESEM")).toBe(dictionaries[jezyk]["SPRAWNOSC-POZA-ZAKRESEM"])
    }
  })

  it("podstawia parametry placeholderów {nazwa}", () => {
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0,9")
    expect(t("en", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0.9")
    expect(t("ru", "SPRAWNOSC-DOMYSLNA", { efficiency: "0.9" })).toContain("0,9")
  })

  it("liczby w parametrach dostają separator dziesiętny języka (number i tekst z toFixed)", () => {
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: 0.92 })).toContain("0,92")
    expect(t("ru", "SPRAWNOSC-DOMYSLNA", { efficiency: -1.5 })).toContain("-1,5")
    expect(t("en", "SPRAWNOSC-DOMYSLNA", { efficiency: 0.92 })).toContain("0.92")
    // Bez grupowania tysięcy i bez zaokrąglania — precyzję wybiera domena.
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: 2800 })).toContain("2800")
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: 0.123456 })).toContain("0,123456")
  })

  it("tekst, który nie jest w całości liczbą dziesiętną, zostaje bez zmian", () => {
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: "1, 2, 12" })).toContain("1, 2, 12")
    expect(t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: "v2.39" })).toContain("v2.39")
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
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 18.09.2026, partia 6 (baterie: ochrona-wilgoc, oplacalnosc-magazynu, pozycjonowanie-ogniw, second-life, slabe-ogniwo)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "RYZYKO-KONDENSACJI": { temp: "-15.0", rosa: "-11.5" },
    "BEZPIECZNY-MARGINES": { temp: "15.0", rosa: "6.0" },
    "IP-PONIZEJ-WYMAGANEGO": { ip: 54, min: 55 },
    "TANSZE-NIZ-ALTERNATYWA": { koszt: "0.34", alt: "3.40" },
    "DROZSZE-NIZ-ALTERNATYWA": { koszt: "0.34", alt: "0.10" },
    "DOCISK-ZA-MALY": { docisk: 200, min: 300, max: 400 },
    "DOCISK-ZA-DUZY": { docisk: 500, min: 300, max: 400 },
    "DOCISK-OK": { docisk: 350, min: 300, max: 400 },
    "TANSZA-NIZ-NOWA": { koszt: "833", nowa: "1200" },
    "DROZSZA-NIZ-NOWA": { koszt: "2778", nowa: "1200" },
    "SOH-SZACUNEK-Z-WIEKU": { rate: 2 },
    "SOH-SZACUNEK-Z-PRZEBIEGU": { rate: 1 },
    "POJEMNOSC-OGRANICZONA-NAJSLABSZYM": { utrata: "3.0" },
  }
  const kluczeBezParametrow = [
    "WILGOTNOSC-POZA-ZAKRESEM",
    "PUNKT-ROSY-WZOR-MAGNUSA",
    "SPRAWNOSC-OGOLNA-POZA-ZAKRESEM",
    "LICZBA-CYKLI-SPRAWNOSC-OD-UZYTKOWNIKA",
    "BRAK-LUZU-NA-PECZNIENIE",
    "DOCISK-UJEMNY",
    "SOH-ZEROWY",
    "TOLERANCJA-POZA-ZAKRESEM",
    "NAJGORSZY-PRZYPADEK-TOLERANCJA",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 18.09.2026, partia 7 (baterie: soh-per-ogniwo, starzenie-degradacja, szyny-zbiorcze-miedzypakietowe, topologia-bms, vehicle-to-home)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "OGNIWO-DO-WYMIANY": { wzrost: "50", prog: 50 },
    "OGNIWO-OK": { wzrost: "20", prog: 50 },
    "CALKOWITA-DEGRADACJA-W-HORYZONCIE": { rate: 7, lata: 15 },
    "ROZKLAD-PRADU": { odchylenie: "25.0" },
    "COMMON-PORT-NIEWYSTARCZAJACY": { bms: 100, falownik: 150 },
    "COMMON-PORT-WYSTARCZAJACY": { bms: 200, falownik: 150 },
  }
  const kluczeBezParametrow = [
    "POJEMNOSC-DZIS-NIEDODATNIA",
    "DEGRADACJA-POZA-ZAKRESEM",
    "MODEL-LINIOWY-DEGRADACJI",
    "WYNIK-DOKLADNY-BEZ-ZAOKRAGLENIA",
    "MODEL-TOPOLOGIA-GWIAZDA",
    "REZYSTANCJA-WZOR-M5E1",
    "SPRAWNOSC-EFEKTYWNA-POZA-ZAKRESEM",
    "REZERWA-WIEKSZA-NIZ-POJEMNOSC",
    "TYLKO-V2L",
    "REZERWA-DEGRADACJA-MODEL-UPROSZCZONY",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 18.09.2026, partia 8 (okablowanie: analiza-zwarciowa, dobor-bezpiecznika-rozlacznika, dobor-izolacji-kabla, dobor-mocy-falownika, dobor-przekroju-kabla)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "AIC-PONIZEJ-MAX-PRADU-ZWARCIOWEGO": { aic: 2000, pradZwarciowy: "4800" },
    "AIC-WYSTARCZAJACE-NA-PRAD-ZWARCIOWY": { aic: 20000 },
    "AIC-BEZPIECZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO": { aic: 10000, pradZwarciowy: 12000 },
    "IZOLACJA-PONIZEJ-TEMPERATURY": { izolacja: "PVC", temp: 75, max: 70 },
    "IZOLACJA-WYSTARCZA-NA-TEMPERATURE": { izolacja: "PVC", max: 70 },
    "FALOWNIK-MOCY-ZA-SLABY": { wybrana: 4000, zalecana: 6000 },
    "FALOWNIK-MOCY-WYSTARCZAJACY": { wybrana: 6000, zalecana: 6000 },
    "REKOMENDACJA-MOCY-FALOWNIKA": { zalecana: 6000 },
    "PRZEKROJ-PONIZEJ-WYLICZONEGO-MINIMUM": { sprawdzany: 2.5, wymagany: 4 },
    "BRAK-PRZEKROJU-SPELNIAJACEGO-KRYTERIA": { maksymalny: 35 },
    "TEMPERATURA-OTOCZENIA-POZA-TABELAMI": { temp: 65 },
    "WSPOLCZYNNIK-WIAZKI-POZA-ZAKRESEM": { liczba: 25 },
  }
  const kluczeBezParametrow = [
    "AIC-NIE-SPRAWDZONA-PORUWNAJ",
    "PRAD-ZNAMIONOWY-NIEDODATNI",
    "PRAD-ZWARCIOWY-UJEMNY",
    "AIC-UJEMNE",
    "SELEKTYWNOSC-NIE-SPRAWDZONA",
    "AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA",
    "WSPOLCZYNNIK-JEDNOCZESNOSCI-MARGINES",
    "PRADY-ROZRUCHOWE-NIE-LICZONE-LICZBOWO",
    "WARTOSC-MUSI-BYC-WIEKSZA-OD-ZERA",
    "PRZEKROJ-MA-BEZPIECZNY-MARGINES",
    "PRZEKROJ-MARGINES-MALY",
    "IZOLACJA-ZALOZONA-PVC-DOMYSLNIE",
    "LICZBA-ZYL-DWIE-TABLICA-B52",
    "REZYSTANCJA-PETLI-WZOR-2L-S",
    "KOREKTA-ULOZENIA-KOLUMNA-TABELI",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 18.09.2026, partia 9 (okablowanie: glowna-szyna-wyrownawcza, laczenie-cu-al, ochrona-odwrotna-polaryzacja, ochrona-przepieciowa-spd, optymalizacja-trasy-kabla)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "PARA-METALI-OK": { etykieta: "Miedź (Cu) + Aluminium (Al)" },
    "PARA-POZA-ZAKRESEM": { etykieta: "Mosiądz + Aluminium (Al)" },
    "ZA-BLISKO-ZWODU": { odleglosc: 0.3, min: 0.5 },
    "UC-PONIZEJ-MINIMUM": { uc: 350, ucMin: "400" },
    "SPD-DOBRANY-POPRAWNIE": { typ: "Typ 2" },
    "TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU": { oznaczenie: "B" },
    "POROWNANIE-KOSZTOW-TRAS": { tansza: "A", roznica: "1816", lata: 10 },
  }
  const kluczeBezParametrow = [
    "GSW-UZYWANA-JAKO-PRZYLACZE",
    "KOROZJA-GALWANICZNA-CU-AL",
    "WYMAGA-PODKLADKI-I-SMARU",
    "KONTROLUJ-OKRESOWO",
    "BRAK-OCHRONY",
    "OCHRONA-ZASTOSOWANA",
    "REKOMENDACJA-TYPU-OCHRONY-NIE-PODANA",
    "BRAK-TYPU-1-PRZY-ODGROMOWEJ",
    "SPD-UZIEMIONY-OSOBNO",
    "VOC-STRINGU-WARTOSC-ZIMOWA",
    "WYNIK-ZALEZY-OD-ECHA-TRASY",
    "STRATY-ROCZNE-LICZONE-PRZEZ-ECHO",
    "KOSZT-ZAKUPU-JEDNA-SUMA-NA-TRASE",
    "TCO-NIE-POKAZANE-NIESPELNIONE-WYMAGANIA",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 10 (okablowanie: pomiary-powykonawcze, string-box, uziemienie-funkcjonalne-ochronne, wylaczniki-nadpradowe-dc, wylaczniki-rcd — zamyka katalog)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "REZYSTANCJA-IZOLACJI-ZA-NISKA": { wartosc: 0.5, min: 1 },
    "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA": { wartosc: 35, prog: 30 },
    "CZAS-RCD-ZA-DLUGI": { czas: 0.5, max: 0.4 },
    "ZA-MALO-WEJSC-SKRZYNKI": { wejscia: 4, stringi: 6 },
    "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM": { bezpiecznik: 25, min: 15, max: 20 },
    "AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO": { aic: 2000, pradZwarciowy: 4800 },
    "WYMAGANY-TYP-B": { typ: "A" },
    "PROG-POWYZEJ-OCHRONY-OSOB": { prog: 100 },
    "PROG-POWYZEJ-OCHRONY-POZAROWEJ": { prog: 500 },
  }
  const kluczeBezParametrow = [
    "CIAGLOSC-NIEPOTWIERDZONA",
    "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA",
    "CZAS-RCD-NIEZMIERZONY",
    "TEST-ZWARCIOWY-NIEPOTWIERDZONY",
    "TERMOWIZJA-NIEPOTWIERDZONA",
    "WSZYSTKO-OK",
    "BRAK-SKRZYNKI-IP66",
    "LICZBA-STRINGOW-UJEMNA",
    "LICZBA-WEJSC-UJEMNA",
    "BEZPIECZNIK-STRINGOWY-UJEMNY",
    "SPD-ROZLACZNIK-NIE-SPRAWDZONE",
    "LICZBA-WEJSC-NIEPODANA-POMINIETO",
    "BEZPIECZNIK-STRINGOWY-NIEWYBRANY-POMINIETO",
    "BIEGUN-UZIEMIONY-WBREW-IT",
    "WYMAGANY-MONITOR-IZOLACJI",
    "OBUDOWA-NIEPOLACZONA-Z-GSW",
    "UZIEMIENIE-OK",
    "UKLAD-SIECI-INFORMACYJNY",
    "WYLACZNIK-NIECERTYFIKOWANY-DO-DC",
    "WYLACZNIK-DC-DOBRANY-POPRAWNIE",
    "AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA",
    "WYMAGANY-TYP-A-MINIMUM",
    "RCD-DOBRANY-POPRAWNIE",
    "TYP-RCD-MINIMALNY-NIE-PODANY",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 11 (pv: dopasowanie-tablicy-falownika, konfigurator-stringow, napor-wiatru, niedopasowanie-paneli, ochrona-stringow)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "NAPIECIE-ZIMOWE-ZA-WYSOKIE": { vStringCold: "621.0", vMax: "500.0" },
    "NAPIECIE-ZIMOWE-OK": { vStringCold: "403.2", vMax: "500.0" },
    "PONIZEJ-OKNA-MPPT": { vStringStc: "296.0", mpptMin: "300.0" },
    "POWYZEJ-OKNA-MPPT": { vStringStc: "444.0", mpptMax: "400.0" },
    "W-OKNIE-MPPT": { vStringStc: "296.0", mpptMin: "150.0", mpptMax: "450.0" },
    "PRAD-PRZEKROCZONY": { iString: "9.0", iMax: "8.0" },
    "PRAD-OK": { iString: "9.0", iMax: "15.0" },
    "DC-AC-ZA-MALE": { ratio: "1.02", min: "1.1" },
    "DC-AC-ZA-DUZE": { ratio: "2.00", max: "1.3" },
    "DC-AC-OK": { ratio: "1.21" },
    "RAZEM-PANELI-MIESZANY": { razem: 8, wGrupie: 4, grup: 2 },
    "SILA-NAPORU": { sila: "1769" },
    "DUZA-ROZNICA-MOCY": { roznica: "17.5" },
    "UMIARKOWANA-ROZNICA-MOCY": { roznica: "12.5" },
    "MALA-ROZNICA-MOCY": { roznica: "2.5" },
    "OCHRONA-OBOWIAZKOWA-BRAK": { ns: 4 },
    "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY": { inMin: "27.50", inMax: "20.00" },
    "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM": { wybrany: "10.0", inMin: "13.75", inMax: "20.00" },
    "ALTERNATYWA-KABLOWA-NIESPRAWDZONA": { ns: 4, wymaganeIz: "37.50" },
    "BEZPIECZNIK-DOBRANY": { inMin: "13.75", inMax: "20.00" },
  }
  const kluczeBezParametrow = [
    "OKNO-MPPT-ODWROCONE",
    "ZAKLADA-JEDEN-STRING",
    "MOC-PV-WZOR-VMP-IMP",
    "KRYTERIUM-4-NIE-SPRAWDZANE",
    "VMPV-NIEDODATNI",
    "IMPA-NIEDODATNI",
    "PANELWGRUPIE-NIEDODATNI",
    "LICZBAGRUP-NIEDODATNI",
    "LICZBAPANELI-NIEDODATNI",
    "PANELWGRUPIE-NIE-CALKOWITA",
    "LICZBAGRUP-NIE-CALKOWITA",
    "LICZBAPANELI-NIE-CALKOWITA",
    "LICZBA-PANELI-NIETYPOWO-WYSOKA",
    "WYNIK-DLA-WARUNKOW-STC",
    "TYLKO-SILA-NAPORU-NIE-SSANIE",
    "NAPIECIE-WSPOLNE-RECZNIE",
    "K1-MINIMUM-NORMOWE",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 12 (pv: panele-bifacjalne, straty-okablowanie-dc, straty-zlaczki-mc4, stress-test-mppt, wplyw-temperatury)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "DOBRA-POWIERZCHNIA": { dodatkowyUzysk: "600" },
    "STRATA-PONIZEJ-CELU": { strata: "2.4", cel: 3 },
    "STRATA-POWYZEJ-CELU": { strata: "6.0", cel: 3 },
    "DOBRY-STYK": { rezystancja: "1.00", strata: "2.0" },
    "PODWYZSZONA-REZYSTANCJA": { rezystancja: "5.00", strata: "10.0" },
    "ZLY-STYK": { rezystancja: "25.00", strata: "50.0" },
    "PRZEKROCZONY-LIMIT-MPPT": { vString: "520", limit: "450" },
    "BLISKO-LIMITU-MPPT": { vString: "430", limit: "450", prog: "428" },
    "BEZPIECZNY-MARGINES-MPPT": { vString: "260", limit: "450" },
    "UTRATA-MOCY": { temperatura: "60", strata: "15.0" },
  }
  const kluczeBezParametrow = [
    "TRAWA-NISKI-ZYSK",
    "PROCENT-UZYSKU-RECZNIE",
    "REZYSTANCJA-PETLI-DWA-PRZEWODY",
    "REZYSTANCJA-ZLACZKI-RECZNIE",
    "PRAD-SZEREGOWY-PRZEZ-WSZYSTKIE-ZLACZKI",
    "PRZYROST-TEMP-I-GAMMA-RECZNIE",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 13 (pv: zacienienie-diody-bocznikujace [zamyka pv/]; zapotrzebowanie: agregat-pradotworczy, bojler-cwu, bufor-rozbudowe, load-shedding)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "ZACIENIENIE-1-SEKCJA": { strata: "33" },
    "ZACIENIENIE-2-SEKCJE": { strata: "67" },
    "ZACIENIENIE-PELNY-PANEL": { strata: "100" },
    "STRATA-STRINGU-NIE-LICZONA": { liczbaPaneli: 6 },
    "OPTYMALNE-OBCIAZENIE-AGREGATU": { procent: 80 },
    "BOJLER-ZA-MALY": { pojemnosc: 150, wolumen: 280 },
    "BUFOR-DOLICZONY": { procent: 20, dodatek: "2.5" },
    "ODBIORNIK-ODLACZONY": { priorytet: 3 },
    "ODBIORNIK-AKTYWNY": { priorytet: 2 },
  }
  const kluczeBezParametrow = [
    "LICZBA-SEKCJI-POZA-ZAKRESEM",
    "BRAK-ZACIENIENIA",
    "STRATA-PANELU-3-SEKCJE-FAKT",
    "DEFICYTKWH-NIEDODATNI",
    "MOCAGREGATUKW-NIEDODATNI",
    "SREDNIZUZYCIELH-NIEDODATNI",
    "CENAZALITRZL-NIEDODATNI",
    "BRAK-WYJSCIA-STERUJACEGO",
    "MA-WYJSCIE-STERUJACE",
    "WOLUMEN-UJEMNY",
    "DELTA-T-UJEMNA",
    "MOC-GRZALKI-UJEMNA",
    "POJEMNOSC-BOJLERA-UJEMNA",
    "DELTA-T-RECZNIE",
    "ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE",
    "BUFOR-BRAK",
    "SOC-POZA-ZAKRESEM",
    "ODBIORNIK-AKTYWNY-PRIORYTET-1",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 14 (zapotrzebowanie: pobor-wlasny-falownika, profil-astronomiczny, przetwornice-dcdc, sezonowosc [zamyka zapotrzebowanie/]; + drift-fix baterie/pobor-wlasny-bms)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "STALY-KOSZT-BILANSU": { strata: "1.08" },
    "ENERGIA-NOCNA": { moc: 50, dlugoscNocy: "16.5", energia: "0.83" },
    "STRATA-NA-KONWERSJI": { strata: "8", strataW: "8.7" },
    "URZADZENIE-AKTYWNE": { zapotrzebowanie: "2.00" },
  }
  const kluczeBezParametrow = [
    "POBOR-JALOWY-UJEMNY",
    "SZEROKOSC-POZA-ZAKRESEM",
    "DZIEN-ROKU-POZA-ZAKRESEM",
    "MOC-ODBIORNIKA-UJEMNA",
    "NOC-POLARNA",
    "DZIEN-POLARNY",
    "DEKLINACJA-METODA-COOPERA",
    "ZAPOTRZEBOWANIEURZADZENIAW-NIEDODATNI",
    "SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM",
    "ZASILANIE-BEZPOSREDNIE",
    "ZAPOTRZEBOWANIE-URZADZENIA-UJEMNE",
    "MIESIAC-POZA-ZAKRESEM",
    "URZADZENIE-NIEAKTYWNE",
    "POBORCIAGLEW-UJEMNY",
    "POBORUSPIENIEW-UJEMNY",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 15 (start katalogu ogrzewanie/: bufor-ciepla, infiltracja-powietrza, kociol-elektryczny, pompy-cyrkulacyjne, ryzyko-niskiego-napiecia, wentylacja-odzysk-ciepla)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "BUFOR-ZA-MALY": { pojemnosc: "200", zalecana: "400" },
    "BUFOR-WYSTARCZAJACY": { pojemnosc: "400", zalecana: "400" },
    "WYMIANY-POZA-SANITY-CHECK": { max: 10 },
    "STRATA-INFILTRACJI": { strata: "2.41" },
    "OSZCZEDNOSC-KOCIOL-VS-POMPA": { oszczednosc: "26.67", mnoznik: "3.0" },
    "OSZCZEDNOSC-POMPA-CYRKULACYJNA": { oszczednoscKwh: "0.89", oszczednoscPct: "82" },
    "NAPIECIE-POZA-SANITY-CHECK": { max: 60 },
    "POMPA-SIE-WYLACZY": { aktualne: "44.0", min: "46.0" },
    "MARGINES-BEZPIECZNY": { margines: "5.0" },
    "ODZYSK-INFO": { odzysk: "2.14", pobor: "70" },
  }
  const kluczeBezParametrow = [
    "NOWA-POMPA-NIE-OSZCZEDZA",
    "GODZINY-POZA-ZAKRESEM",
    "SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM",
    "STALE-FIZYCZNE-POWIETRZA-INFILTRACJA",
    "KOCIOL-SPRAWNOSC-COP1",
    "TA-SAMA-CENA-ENERGII-OBA-ZRODLA",
    "GODZINY-PRACY-WPISANE-RECZNIE",
    "NAPIECIE-SYSTEMU-RECZNIE",
    "STALE-FIZYCZNE-POWIETRZA-WENTYLACJA",
    "POBOR-WENTYLATOROW-OSOBNO-BILANS",
    "PROJEKT-STRUMIENI-BYPASS-NIE-LICZONE",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 16 (montaz-baterii: balansery-zewnetrzne-olow, demontaz-pakietu, gestosc-elektrolitu, montaz-mechaniczny, ocena-zasiarczenia)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "BRAK-BALANSERA-ZEWNETRZNEGO": { ilosc: 4 },
    "PAKIET-WCIAZ-NALADOWANY": { napiecie: "3.50", max: 3.2 },
    "STAN-PELNY": { gestosc: "1.28", pelny: 1.28 },
    "STAN-CZESCIOWO-NALADOWANY": { gestosc: "1.20", polowa: 1.2 },
    "STAN-ROZLADOWANY": { gestosc: "1.15" },
    "OBJAWY-ZASIARCZENIA-WIELE": { liczba: 2 },
  }
  const kluczeBezParametrow = [
    "ILOSC-AKUMULATOROW-NIEDODATNIA",
    "NAPIECIE-PAKIETU-NIEDODATNIE",
    "KROK-POZA-KOLEJNOSCIA",
    "GESTOSC-NIEDODATNIA",
    "DOCISK-NIEDODATNI",
    "OBJAWY-ZASIARCZENIA-JEDEN",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 17 (montaz-baterii: pierwsze-uruchomienie, podlaczenie-bms, ratowanie-ogniwa, sekwencja-montazu, weryfikacja-ogniw, ocena-zuzycia [zamyka montaz-baterii/])", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "TOP-BALANCING-NIEOSIAGNIETY": { napiecie: "3.40", prog: 3.55 },
    "RATUNEK-OPCJONALNY-NIEZALECANY": { napiecie: "0.80", zasilacz: 3.0, prad: 0.5 },
    "PROCEDURA-STANDARDOWEGO-RATUNKU": { napiecie: "1.51" },
    "NIEPARZYSTA-LICZBA-OGNIW": { liczba: 7 },
    "ZA-MALO-OGNIW": { min: 4 },
    "ZA-DUZO-OGNIW": { max: 32 },
    "SEKWENCJA-UKLAD-PRESET": { n: 2 },
    "SEKWENCJA-UKLAD-NIESTANDARDOWY": { n: 3, liczba: 6 },
    "NAPIECIE-OGNIWA-NIEDODATNIE": { numer: 2 },
    "ROZNICA-NAPIEC-OGNIW-ZA-DUZA": { roznica: "0.051", prog: 0.05 },
    "LICZBA-OGNIW-NIEZGODNA": { system: 12, oczekiwana: 4, podana: 3 },
  }
  const kluczeBezParametrow = [
    "NAPIECIE-OGNIWA-UJEMNE",
    "POJEMNOSCFALOWNIKAUF-NIEDODATNI",
    "REZYSTANCJAPRECHARGEOHM-NIEDODATNI",
    "OGNIWO-ZERO-WOLTOWE",
    "NAPIECIE-OGNIWA-POLE-UJEMNE",
    "BRAK-BMS-Z-BALANSEREM",
    "WIDOCZNE-WYBRZUSZENIE",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 18 (bezpieczenstwo: dogrzewanie-paliwem-stalym, ups-krytyczny; kalkulator-mobilny: tryb-uproszczony)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "ZA-MALA-ODLEGLOSC": { odleglosc: "30", min: 40 },
    "ODLEGLOSC-OK": { odleglosc: "50", min: 40 },
    "CZAS-PODTRZYMANIA": { czas: "4.42" },
  }
  const kluczeBezParametrow = [
    "BRAK-NAWIEWU",
    "NAWIEW-OBECNY",
    "BRAK-CZUJNIKA-CO",
    "CZUJNIK-CO-OBECNY",
    "BRAK-ZAZNACZONYCH-URZADZEN",
    "POJEMNOSCAH-NIEDODATNI",
    "NAPIECIEV-NIEDODATNI",
    "MOCODBIORNIKAW-NIEDODATNI",
    "TRYB-UPROSZCZONY-CZAS-TEORETYCZNY",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze zmigrowane 19.09.2026, partia 19 (baterie: napiecie-systemowe)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "REKOMENDACJA-NAPIECIA": { napiecie: 12 },
    "KONFLIKT-JEDNOCZESNOSCI": { suma: "4615", limit: "3000" },
    "KONFLIKT-JEDNOCZESNOSCI-Z-PROPOZYCJA": { suma: "5000", limit: "4000", urzadzenia: "Piekarnik elektryczny" },
    "OGRZEWANIE-WYMAGA-48V": { napiecie: 24, moc: "2000" },
    "PRAD-WYSOKI-PRZY-12V": { prad: "400" },
  }
  const kluczeBezParametrow = [
    "MOC-UJEMNA",
    "PULAPKA-KONWERSJI-24-DO-48",
    "NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE",
    "NAPIECIE-SYSTEMOWE-MOC-SZCZYTOWA-DEFINICJA",
    "NAPIECIE-SYSTEMOWE-KONFLIKT-JEDNOCZESNOSCI-WARUNEK",
    "NAPIECIE-SYSTEMOWE-KABEL-ECHO",
    "NAPIECIE-SYSTEMOWE-KOSZTORYS-METODA",
  ]

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
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

describe("t — klucze nowych modułów 19.09.2026 (ryzyko-pid, dobor-regulatora-pwm-mppt, wind-chill, Moduł 2 c.d.)", () => {
  const kluczeZParametrami: Record<string, Record<string, string | number>> = {
    "RYZYKO-PID": { napiecie: "600", prog: "400" },
    "BRAK-RYZYKA-PID": { napiecie: "350" },
    "NIEZGODNOSC-NAPIEC-PWM": { panel: "24", akumulator: "12" },
    "MPPT-OPLACALNY-PRZY-MOCY": { moc: "400", prog: "250" },
    "PWM-WYSTARCZY": { moc: "100" },
    "POZA-ZAKRESEM-WZORU-WIND-CHILL": { maxTemp: "10", minWiatr: "4.8" },
    "SUGEROWANA-WYMIANA-STARYCH-URZADZEN": { urzadzenia: "Lodówka 230V AC" },
    "NISKIE-OBCIAZENIE-FALOWNIKA": { obciazenie: "6.0" },
    "OBCIAZENIE-FALOWNIKA-OPTYMALNE": { obciazenie: "60.0" },
  }

  it("klucze z parametrami: podstawiają wartości i różnią się między językami w każdym", () => {
    for (const [kod, params] of Object.entries(kluczeZParametrami)) {
      const pl = t("pl", kod, params)
      const en = t("en", kod, params)
      const ru = t("ru", kod, params)
      for (const wartosc of Object.values(params)) {
        expect(pl).toContain(jakWJezyku("pl", wartosc))
        expect(en).toContain(jakWJezyku("en", wartosc))
        expect(ru).toContain(jakWJezyku("ru", wartosc))
      }
      expect(pl).not.toBe(en)
      expect(pl).not.toBe(ru)
      expect(en).not.toBe(ru)
    }
  })

  it("klucze assumptions bez parametrów: tekst istnieje i różni się między językami", () => {
    for (const kod of ["PID-PROG-NAPIECIA-ZE-ZRODLA", "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY", "WIND-CHILL-WZOR-NWS"]) {
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
