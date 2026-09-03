import type { Warning } from "@/lib/core/calc-result"
import type { DemontazPakietuInput } from "./input"
import { napieciePakietuNiedodatnie } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: DemontazPakietuInput): ValidationResult {
  const errors: Warning[] = []

  if (input.napieciePakietuV <= 0) {
    errors.push(napieciePakietuNiedodatnie(input.napieciePakietuV))
  }

  return { errors, warnings: [] }
}
