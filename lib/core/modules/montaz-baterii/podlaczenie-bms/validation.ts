import type { Warning } from "@/lib/core/calc-result"
import type { PodlaczenieBmsInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: PodlaczenieBmsInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscFalownikaUf <= 0) {
    errors.push(notPositive("pojemnoscFalownikaUf", input.pojemnoscFalownikaUf))
  }
  if (input.rezystancjaPreChargeOhm <= 0) {
    errors.push(notPositive("rezystancjaPreChargeOhm", input.rezystancjaPreChargeOhm))
  }

  return { errors, warnings: [] }
}
