import type { Warning } from "@/lib/core/calc-result"

export function wartoscNiedodatnia(field: string, value: number): Warning {
  return {
    code: "WARTOSC-NIEDODATNIA",
    level: "critical",
    message: "Wartość musi być większa od zera.",
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
    message: `Wybrany przekrój ${sprawdzanyMm2} mm² jest mniejszy niż wyliczone minimum (${wymaganyMm2} mm²) — realne ryzyko przegrzania izolacji i pożaru. Użyj co najmniej ${wymaganyMm2} mm².`,
    technicalMessage: `sprawdzanyMm2=${sprawdzanyMm2} < wymaganyMm2=${wymaganyMm2}`,
  }
}

export function zalecanyZMarginesem(marginesObciazalnosciPct: number, marginesSpadkuPct: number): Warning {
  return {
    code: "PRZEKROJ-ZALECANY",
    level: "info",
    message: "Wybrany przekrój ma bezpieczny margines (≥15%) zarówno na obciążalność, jak i spadek napięcia.",
    technicalMessage: `marginesObciazalnosciPct=${marginesObciazalnosciPct.toFixed(1)}, marginesSpadkuPct=${marginesSpadkuPct.toFixed(1)}`,
  }
}

export function dopuszczalnyNaGranicy(marginesObciazalnosciPct: number, marginesSpadkuPct: number): Warning {
  return {
    code: "PRZEKROJ-NA-GRANICY",
    level: "warning",
    message: "Wybrany przekrój spełnia oba kryteria, ale margines jest mały (poniżej 15%) — rozważ większy przekrój.",
    technicalMessage: `marginesObciazalnosciPct=${marginesObciazalnosciPct.toFixed(1)}, marginesSpadkuPct=${marginesSpadkuPct.toFixed(1)}`,
  }
}

export function brakPasujacegoPrzekroju(maksymalnyMm2: number): Warning {
  return {
    code: "BRAK-PASUJACEGO-PRZEKROJU",
    level: "critical",
    message: `Żaden standardowy przekrój do ${maksymalnyMm2} mm² nie spełnia obu kryteriów przy tych danych — potrzebny większy przekrój, inne napięcie systemowe albo krótsza trasa. Skonsultuj projektanta.`,
    technicalMessage: `brak przekroju w zakresie do ${maksymalnyMm2} mm2 spełniającego obciążalność i spadek napięcia`,
  }
}

export function temperaturaPozaZakresem(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-POZA-ZAKRESEM",
    level: "critical",
    message: `Temperatura otoczenia ${temperaturaC}°C jest poza zakresem tabel normy dla izolacji PVC (10-60°C) — nie da się bezpiecznie policzyć.`,
    technicalMessage: `temperaturaOtoczeniaC=${temperaturaC}, oczekiwano 10-60`,
    field: "temperaturaOtoczeniaC",
  }
}

export function liczbaKabliPozaZakresem(liczbaKabli: number): Warning {
  return {
    code: "LICZBA-KABLI-POZA-ZAKRESEM",
    level: "critical",
    message: `Norma nie podaje współczynnika zmniejszającego dla wiązki tej wielkości (${liczbaKabli} kabli) przy wybranym sposobie ułożenia.`,
    technicalMessage: `liczbaKabliWWiazce=${liczbaKabli} poza zakresem tabeli`,
    field: "liczbaKabliWWiazce",
  }
}
