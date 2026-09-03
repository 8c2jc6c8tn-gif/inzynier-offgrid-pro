import type { Warning } from "@/lib/core/calc-result"
import type { KalibracjaSocInput } from "./input"
import { dniUjemne } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: KalibracjaSocInput): ValidationResult {
  const errors: Warning[] = []
  if (input.dniOdOstatniegoPelnegoNaladowania !== null && input.dniOdOstatniegoPelnegoNaladowania < 0) {
    errors.push(dniUjemne(input.dniOdOstatniegoPelnegoNaladowania))
  }
  return { errors }
}
