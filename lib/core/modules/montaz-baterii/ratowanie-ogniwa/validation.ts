import type { Warning } from "@/lib/core/calc-result"
import type { RatowanieOgniwaInput } from "./input"
import { napiecieUjemne } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: RatowanieOgniwaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.napiecieOgniwaV !== null && input.napiecieOgniwaV < 0) {
    errors.push(napiecieUjemne(input.napiecieOgniwaV))
  }

  return { errors, warnings: [] }
}
