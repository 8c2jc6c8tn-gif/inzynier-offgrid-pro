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
