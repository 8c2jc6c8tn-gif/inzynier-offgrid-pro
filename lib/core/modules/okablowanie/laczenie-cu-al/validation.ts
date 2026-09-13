import type { Warning } from "@/lib/core/calc-result"
import type { LaczenieCuAlInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: LaczenieCuAlInput): ValidationResult {
  const errors: Warning[] = []
  if (input.przekrojCuMm2 < 0) errors.push(wartoscUjemna("przekrojCuMm2", input.przekrojCuMm2))
  return { errors }
}
