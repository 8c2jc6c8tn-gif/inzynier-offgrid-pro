import type { Warning } from "@/lib/core/calc-result"
import type { InfiltracjaPowietrzaInput } from "./input"
import { wartoscUjemna, wymianyPozaSanityCheck } from "./warnings"
import { WYMIANY_SANITY_MAX } from "./constants"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: InfiltracjaPowietrzaInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []
  if (input.wymianyPowietrzaNaH < 0) errors.push(wartoscUjemna("wymianyPowietrzaNaH", input.wymianyPowietrzaNaH))
  if (input.kubaturaBudynkuM3 < 0) errors.push(wartoscUjemna("kubaturaBudynkuM3", input.kubaturaBudynkuM3))
  if (input.deltaTK !== null && input.deltaTK < 0) errors.push(wartoscUjemna("deltaTK", input.deltaTK))
  if (input.wymianyPowietrzaNaH > WYMIANY_SANITY_MAX) {
    warnings.push(wymianyPozaSanityCheck(input.wymianyPowietrzaNaH))
  }
  return { errors, warnings }
}
