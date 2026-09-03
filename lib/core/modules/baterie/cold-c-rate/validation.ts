import type { Warning } from "@/lib/core/calc-result"
import type { ColdCRateInput } from "./input"
import { pojemnoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ColdCRateInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscAh < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscAh))
  return { errors }
}
