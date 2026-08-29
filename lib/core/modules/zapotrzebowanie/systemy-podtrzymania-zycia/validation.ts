import type { Warning } from "@/lib/core/calc-result"
import type { SurvivalCoreInput } from "./input"
import { nothingSelected, selectedItemNotPositive } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: SurvivalCoreInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  const selected = input.items.filter((item) => item.selected)

  for (const item of selected) {
    if (item.powerW <= 0) {
      errors.push(selectedItemNotPositive(item.label, item.powerW))
    }
  }

  if (selected.length === 0) {
    warnings.push(nothingSelected())
  }

  return { errors, warnings }
}
