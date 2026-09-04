import type { Warning } from "@/lib/core/calc-result"
import type { ModulEvInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ModulEvInput): ValidationResult {
  const errors: Warning[] = []
  if (input.energiaDobowaEvKwh < 0) errors.push(wartoscUjemna("energiaDobowaEvKwh", input.energiaDobowaEvKwh))
  if (input.nadwyzkaPvLatemKwh !== null && input.nadwyzkaPvLatemKwh < 0) {
    errors.push(wartoscUjemna("nadwyzkaPvLatemKwh", input.nadwyzkaPvLatemKwh))
  }
  if (input.nadwyzkaPvZimaKwh !== null && input.nadwyzkaPvZimaKwh < 0) {
    errors.push(wartoscUjemna("nadwyzkaPvZimaKwh", input.nadwyzkaPvZimaKwh))
  }
  return { errors }
}
