import type { Warning } from "@/lib/core/calc-result"
import type { OchronaStringowInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: OchronaStringowInput): ValidationResult {
  const errors: Warning[] = []
  if (input.iscA < 0) errors.push(wartoscUjemna("iscA", input.iscA))
  if (input.liczbaStringowRownoleglych < 0) {
    errors.push(wartoscUjemna("liczbaStringowRownoleglych", input.liczbaStringowRownoleglych))
  }
  return { errors }
}
