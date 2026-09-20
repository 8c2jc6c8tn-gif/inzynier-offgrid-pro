import type { Warning } from "@/lib/core/calc-result"
import type { PomiarMocyJalowejInput } from "./input"
import { measuredItemNotPositive, noMeasurements } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: PomiarMocyJalowejInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  for (const pozycja of input.pozycje) {
    if (pozycja.mocJalowaW <= 0) {
      errors.push(measuredItemNotPositive(pozycja.nazwa, pozycja.mocJalowaW))
    }
  }

  if (input.pozycje.length === 0) {
    warnings.push(noMeasurements())
  }

  return { errors, warnings }
}
