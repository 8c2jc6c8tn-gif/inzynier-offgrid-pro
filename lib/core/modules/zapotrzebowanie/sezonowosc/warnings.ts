import type { Warning } from "@/lib/core/calc-result"

export function zapotrzebowanieUjemne(value: number): Warning {
  return {
    code: "ZAPOTRZEBOWANIE-UJEMNE",
    level: "critical",
    message: "Zapotrzebowanie urządzenia nie może być ujemne.",
    technicalMessage: `zapotrzebowanieKwhDoba = ${value}, oczekiwano >= 0`,
    field: "zapotrzebowanieKwhDoba",
  }
}

export function miesiacPozaZakresem(field: string, value: number): Warning {
  return {
    code: "MIESIAC-POZA-ZAKRESEM",
    level: "critical",
    message: "Miesiąc musi być z przedziału 1–12.",
    technicalMessage: `${field} = ${value}, oczekiwano [1, 12]`,
    field,
  }
}

export function urzadzenieAktywne(zapotrzebowanieKwhDoba: number): Warning {
  return {
    code: "URZADZENIE-AKTYWNE",
    level: "info",
    message: `Urządzenie aktywne w tym okresie — ${zapotrzebowanieKwhDoba.toFixed(2)} kWh/dobę liczy się do bilansu.`,
    technicalMessage: `zapotrzebowanieKwhDoba=${zapotrzebowanieKwhDoba}, aktywne=true`,
  }
}

export function urzadzenieNieaktywne(): Warning {
  return {
    code: "URZADZENIE-NIEAKTYWNE",
    level: "info",
    message: "Urządzenie poza swoim okresem aktywności — nie liczy się do bilansu dobowego.",
    technicalMessage: "aktywne=false",
  }
}
