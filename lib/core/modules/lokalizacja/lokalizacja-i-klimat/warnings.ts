import type { Warning } from "@/lib/core/calc-result"

export function outOfRange(field: string, label: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    message: `Wartość pola "${label}" musi być z przedziału ${min}–${max}.`,
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}
