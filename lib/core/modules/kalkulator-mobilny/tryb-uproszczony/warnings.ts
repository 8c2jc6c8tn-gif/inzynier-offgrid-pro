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
