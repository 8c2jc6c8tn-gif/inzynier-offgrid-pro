import type { Warning } from "@/lib/core/calc-result"
import type { NaporWiatruInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: NaporWiatruInput): ValidationResult {
  const errors: Warning[] = []
  if (input.predkoscWiatruMS < 0) errors.push(wartoscUjemna("predkoscWiatruMS", input.predkoscWiatruMS))
  if (input.powierzchniaM2 < 0) errors.push(wartoscUjemna("powierzchniaM2", input.powierzchniaM2))
  if (input.cd < 0) errors.push(wartoscUjemna("cd", input.cd))
  if (input.balastPlanowanyKg !== null && input.balastPlanowanyKg < 0) {
    errors.push(wartoscUjemna("balastPlanowanyKg", input.balastPlanowanyKg))
  }
  return { errors }
}
