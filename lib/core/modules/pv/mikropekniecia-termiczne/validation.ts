import type { Warning } from "@/lib/core/calc-result"
import type { MikropeknieciaTermiczneInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: MikropeknieciaTermiczneInput): ValidationResult {
  const errors: Warning[] = []
  if (input.odstepDylatacyjnyMm !== null && input.odstepDylatacyjnyMm < 0) {
    errors.push(wartoscUjemna("odstepDylatacyjnyMm", "Odstęp dylatacyjny między panelami", input.odstepDylatacyjnyMm))
  }
  return { errors }
}
