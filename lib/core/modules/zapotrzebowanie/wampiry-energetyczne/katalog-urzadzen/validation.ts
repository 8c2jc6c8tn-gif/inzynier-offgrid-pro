import type { Warning } from "@/lib/core/calc-result"
import type { KatalogUrzadzenInput } from "./input"
import { nothingSelected, selectedDeviceNotPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: KatalogUrzadzenInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  const selected = input.items.filter((item) => item.selected)

  for (const item of selected) {
    if (item.powerW <= 0) {
      errors.push(selectedDeviceNotPositive(item.label, item.powerW))
    }
  }

  if (selected.length === 0) {
    warnings.push(nothingSelected())
  }

  return { errors, warnings }
}
