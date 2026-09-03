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
    errors.push(notPositive("pojemnoscFalownikaUf", "pojemność DC falownika", input.pojemnoscFalownikaUf))
  }
  if (input.rezystancjaPreChargeOhm <= 0) {
    errors.push(notPositive("rezystancjaPreChargeOhm", "rezystancja wstępna", input.rezystancjaPreChargeOhm))
  }

  return { errors, warnings: [] }
}
