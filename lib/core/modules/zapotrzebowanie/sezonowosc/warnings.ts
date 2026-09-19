import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieUjemne(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-UJEMNE",
    level: "critical",
    i18nKey: "ZAPOTRZEBOWANIE-URZADZENIA-UJEMNE",
    technicalMessage: `zapotrzebowanieKwhDoba = ${value}, oczekiwano >= 0`,
    field: "zapotrzebowanieKwhDoba",
  }
}

export function miesiacPozaZakresem(field: string, value: number): Warning {
  return {
    code: "MIESIAC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "MIESIAC-POZA-ZAKRESEM",
    technicalMessage: `${field} = ${value}, oczekiwano [1, 12]`,
    field,
  }
}

export function urzadzenieAktywne(zapotrzebowanieKwhDoba: number): Warning {
  return {
    code: "URZADZENIE-AKTYWNE",
    level: "info",
    i18nKey: "URZADZENIE-AKTYWNE",
    params: { zapotrzebowanie: zapotrzebowanieKwhDoba.toFixed(2) },
    technicalMessage: `zapotrzebowanieKwhDoba=${zapotrzebowanieKwhDoba}, aktywne=true`,
  }
}

export function urzadzenieNieaktywne(): Warning {
  return {
    code: "URZADZENIE-NIEAKTYWNE",
    level: "info",
    i18nKey: "URZADZENIE-NIEAKTYWNE",
    technicalMessage: "aktywne=false",
  }
}
