import type { Warning } from "@/lib/core/calc-result"
import type { PrzepustPowietrzaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: PrzepustPowietrzaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.szczelinaCm !== null && input.szczelinaCm < 0) {
    errors.push(wartoscUjemna("szczelinaCm", input.szczelinaCm))
  }
  return { errors }
}
