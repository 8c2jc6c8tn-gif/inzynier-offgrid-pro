import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function ujemnaWartosc(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-UJEMNA`,
    level: "critical",
    i18nKey: "WARTOSC-POLA-UJEMNA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function fazaCc(napiecieAbsorpcjiV: number): Warning {
  return {
    code: "FAZA-CC",
    level: "info",
    i18nKey: "FAZA-CC",
    params: { prog: napiecieAbsorpcjiV },
    technicalMessage: `aktualneNapiecieV < napiecieAbsorpcjiV`,
  }
}

export function fazaCvKoncowka(pradKoncowyA: number, aktualnyPradA: number): Warning {
  return {
    code: "FAZA-CV-KONCOWKA",
    level: "warning",
    i18nKey: "FAZA-CV-KONCOWKA",
    params: { aktualny: aktualnyPradA.toFixed(1), prog: pradKoncowyA.toFixed(1) },
    technicalMessage: `aktualnyPradA = ${aktualnyPradA} > pradKoncowyA = ${pradKoncowyA}`,
  }
}

export function ladowanieZakonczone(pradKoncowyA: number): Warning {
  return {
    code: "LADOWANIE-ZAKONCZONE",
    level: "info",
    i18nKey: "LADOWANIE-ZAKONCZONE",
    params: { prog: pradKoncowyA.toFixed(1) },
    technicalMessage: `aktualnyPradA <= pradKoncowyA = ${pradKoncowyA}`,
  }
}
