import type { Warning } from "@/lib/core/calc-result"

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return {
    code: "WARTOSC-NIEDODATNIA",
    level: "critical",
    i18nKey: "WARTOSC-MUSI-BYC-WIEKSZA-OD-ZERA",
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function przekrojPonizejWyliczonego(
  sprawdzanyMm2: number,
  wymaganyMm2: number,
): Warning {
  return {
    code: "PRZEKROJ-PONIZEJ-WYLICZONEGO",
    level: "critical",
    i18nKey: "PRZEKROJ-PONIZEJ-WYLICZONEGO-MINIMUM",
    params: { sprawdzany: sprawdzanyMm2, wymagany: wymaganyMm2 },
    technicalMessage: `sprawdzanyMm2=${sprawdzanyMm2} < wymaganyMm2=${wymaganyMm2}`,
  }
}

export function zalecanyZMarginesem(marginesObciazalnosciPct: number, marginesSpadkuPct: number): Warning {
  return {
    code: "PRZEKROJ-ZALECANY",
    level: "info",
    i18nKey: "PRZEKROJ-MA-BEZPIECZNY-MARGINES",
    technicalMessage: `marginesObciazalnosciPct=${marginesObciazalnosciPct.toFixed(1)}, marginesSpadkuPct=${marginesSpadkuPct.toFixed(1)}`,
  }
}

export function dopuszczalnyNaGranicy(marginesObciazalnosciPct: number, marginesSpadkuPct: number): Warning {
  return {
    code: "PRZEKROJ-NA-GRANICY",
    level: "warning",
    i18nKey: "PRZEKROJ-MARGINES-MALY",
    technicalMessage: `marginesObciazalnosciPct=${marginesObciazalnosciPct.toFixed(1)}, marginesSpadkuPct=${marginesSpadkuPct.toFixed(1)}`,
  }
}

export function brakPasujacegoPrzekroju(maksymalnyMm2: number): Warning {
  return {
    code: "BRAK-PASUJACEGO-PRZEKROJU",
    level: "critical",
    i18nKey: "BRAK-PRZEKROJU-SPELNIAJACEGO-KRYTERIA",
    params: { maksymalny: maksymalnyMm2 },
    technicalMessage: `brak przekroju w zakresie do ${maksymalnyMm2} mm2 spełniającego obciążalność i spadek napięcia`,
  }
}

export function temperaturaPozaZakresem(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "TEMPERATURA-OTOCZENIA-POZA-TABELAMI",
    params: { temp: temperaturaC },
    technicalMessage: `temperaturaOtoczeniaC=${temperaturaC}, oczekiwano 10-60`,
    field: "temperaturaOtoczeniaC",
  }
}

export function liczbaKabliPozaZakresem(liczbaKabli: number): Warning {
  return {
    code: "LICZBA-KABLI-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "WSPOLCZYNNIK-WIAZKI-POZA-ZAKRESEM",
    params: { liczba: liczbaKabli },
    technicalMessage: `liczbaKabliWWiazce=${liczbaKabli} poza zakresem tabeli`,
    field: "liczbaKabliWWiazce",
  }
}
