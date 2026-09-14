import type { Warning } from "@/lib/core/calc-result"
import type { WylacznikiRcdInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: WylacznikiRcdInput): ValidationResult {
  const errors: Warning[] = []
  if (input.progMa < 0) errors.push(wartoscUjemna("progMa", input.progMa))
  return { errors }
}
