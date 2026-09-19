import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function silaNaporu(silaN: number): Warning {
  return {
    code: "SILA-NAPORU",
    level: "info",
    i18nKey: "SILA-NAPORU",
    params: { sila: silaN.toFixed(0) },
    technicalMessage: `silaN=${silaN}`,
  }
}
