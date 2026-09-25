import type { Warning } from "@/lib/core/calc-result"
import type { PowlokiAntyrefleksyjneInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PowlokiAntyrefleksyjneInput): ValidationResult {
  const errors: Warning[] = []
  if (input.rocznyUzyskKwh < 0) {
    errors.push(wartoscUjemna("rocznyUzyskKwh", "Roczny uzysk instalacji", input.rocznyUzyskKwh))
  }
  return { errors }
}
