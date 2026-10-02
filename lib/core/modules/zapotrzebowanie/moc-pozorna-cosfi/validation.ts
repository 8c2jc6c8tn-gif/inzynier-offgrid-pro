import type { Warning } from "@/lib/core/calc-result"
import type { MocPozornaCosfiInput } from "./input"
import { cosFiPozaZakresem, notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: MocPozornaCosfiInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocCzynnaW < 0) {
    errors.push(notPositive("mocCzynnaW", "POLE-MOC-CZYNNA-L", input.mocCzynnaW))
  }
  if (input.cosFi < 0 || input.cosFi > 1) {
    errors.push(cosFiPozaZakresem(input.cosFi))
  }
  return { errors }
}
