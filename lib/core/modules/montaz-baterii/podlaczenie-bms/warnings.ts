import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, value: number): Warning {
  const code = `${field.toUpperCase()}-NIEDODATNI`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function krokPozaKolejnoscia(): Warning {
  return {
    code: "KROK-POZA-KOLEJNOSCIA",
    level: "warning",
    i18nKey: "KROK-POZA-KOLEJNOSCIA",
    technicalMessage: "krok potwierdzony przed wcześniejszym niepotwierdzonym krokiem",
  }
}
