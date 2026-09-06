import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function ochronaObowiazkowaBrak(ns: number, iScMaxA: number, iModMaxOcprA: number): Warning {
  return {
    code: "OCHRONA-OBOWIAZKOWA-BRAK",
    level: "critical",
    message: `Norma HD 60364-7-712 wymaga zabezpieczenia nadprądowego każdego z ${ns} równoległych stringów — brak grozi pożarem od prądu wstecznego z pozostałych stringów przy zwarciu jednego.`,
    technicalMessage: `Ns=${ns}, 1,35×I_MOD_MAX_OCPR=${(1.35 * iModMaxOcprA).toFixed(2)}A < (Ns-1)×I_SC_MAX=${((ns - 1) * iScMaxA).toFixed(2)}A, maZabezpieczeniaPerString=false`,
  }
}

export function zakresBezpiecznikaNiepoprawny(inMinA: number, inMaxA: number): Warning {
  return {
    code: "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY",
    level: "critical",
    message: `Nie istnieje bezpiecznik spełniający wymagania normy dla tej konfiguracji (dolna granica ${inMinA.toFixed(2)} A przekracza górną granicę ${inMaxA.toFixed(2)} A z karty katalogowej panelu) — zmniejsz liczbę stringów równoległych na jedno zabezpieczenie lub wybierz panel o wyższym I_MOD_MAX_OCPR.`,
    technicalMessage: `inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}

export function wybranyBezpiecznikPozaZakresem(wybranyA: number, inMinA: number, inMaxA: number): Warning {
  return {
    code: "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM",
    level: "critical",
    message: `Wybrany bezpiecznik ${wybranyA.toFixed(1)} A jest poza wymaganym zakresem [${inMinA.toFixed(2)}, ${inMaxA.toFixed(2)}] A.`,
    technicalMessage: `wybranyBezpiecznikA=${wybranyA}, inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}

export function alternatywaKablowaNiesprawdzona(ns: number, iScMaxA: number): Warning {
  return {
    code: "ALTERNATYWA-KABLOWA-NIESPRAWDZONA",
    level: "warning",
    message: `Zabezpieczenie nadprądowe nie jest tu wymagane wzorem normy, ale przy ${ns} stringach równoległych kabel string musi wytrzymać prąd wsteczny ${((ns - 1) * iScMaxA).toFixed(2)} A — sprawdź to osobno w doborze przekroju kabla.`,
    technicalMessage: `Ns=${ns}, wymaganeIzA=${(ns - 1) * iScMaxA}`,
  }
}

export function bezpiecznikDobrany(inMinA: number, inMaxA: number): Warning {
  return {
    code: "BEZPIECZNIK-DOBRANY",
    level: "info",
    message: `Dobierz bezpiecznik gPV w zakresie ${inMinA.toFixed(2)}–${inMaxA.toFixed(2)} A per string.`,
    technicalMessage: `inMinA=${inMinA}, inMaxA=${inMaxA}`,
  }
}
