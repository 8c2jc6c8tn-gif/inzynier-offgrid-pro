import type { Warning } from "@/lib/core/calc-result"
import type { PorownanieTechnologiiInput } from "./input"
import { pojemnoscNotPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: PorownanieTechnologiiInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  if (input.pojemnoscKwh !== undefined && input.pojemnoscKwh <= 0) {
    errors.push(pojemnoscNotPositive(input.pojemnoscKwh))
  }

  return { errors, warnings }
}
