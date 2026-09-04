import type { Warning } from "@/lib/core/calc-result"
import type { StratyOkablowanieDcInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: StratyOkablowanieDcInput): ValidationResult {
  const errors: Warning[] = []
  if (input.dlugoscKablaM < 0) errors.push(wartoscUjemna("dlugoscKablaM", input.dlugoscKablaM))
  if (input.pradA < 0) errors.push(wartoscUjemna("pradA", input.pradA))
  if (input.napiecieV < 0) errors.push(wartoscUjemna("napiecieV", input.napiecieV))
  if (input.przekrojMm2 < 0) errors.push(wartoscUjemna("przekrojMm2", input.przekrojMm2))
  return { errors }
}
