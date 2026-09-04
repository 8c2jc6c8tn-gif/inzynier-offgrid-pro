import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function ujemnaWartosc(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-UJEMNA`,
    level: "critical",
    message: `Wartość pola "${label}" nie może być ujemna.`,
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function fazaCc(napiecieAbsorpcjiV: number): Warning {
  return {
    code: "FAZA-CC",
    level: "info",
    message: `Napięcie jeszcze nie osiągnęło progu absorpcji (${napiecieAbsorpcjiV} V) — trwa faza CC (stały prąd).`,
    technicalMessage: `aktualneNapiecieV < napiecieAbsorpcjiV`,
  }
}

export function fazaCvKoncowka(pradKoncowyA: number, aktualnyPradA: number): Warning {
  return {
    code: "FAZA-CV-KONCOWKA",
    level: "warning",
    message: `Napięcie absorpcji osiągnięte, ale prąd (${aktualnyPradA.toFixed(1)} A) wciąż jest powyżej progu końcowego (${pradKoncowyA.toFixed(1)} A) — nie odłączaj ładowania, trwa faza CV (stałe napięcie).`,
    technicalMessage: `aktualnyPradA = ${aktualnyPradA} > pradKoncowyA = ${pradKoncowyA}`,
  }
}

export function ladowanieZakonczone(pradKoncowyA: number): Warning {
  return {
    code: "LADOWANIE-ZAKONCZONE",
    level: "info",
    message: `Prąd spadł poniżej progu końcowego (${pradKoncowyA.toFixed(1)} A) — bateria w pełni naładowana.`,
    technicalMessage: `aktualnyPradA <= pradKoncowyA = ${pradKoncowyA}`,
  }
}
