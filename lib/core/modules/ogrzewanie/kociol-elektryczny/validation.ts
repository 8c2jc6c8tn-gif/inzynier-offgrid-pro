import type { Warning } from "@/lib/core/calc-result"
import type { KociolElektrycznyInput } from "./input"
import { wartoscUjemna, copPozaZakresem } from "./warnings"
import { COP_POMPY_MIN, COP_POMPY_MAX } from "./constants"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: KociolElektrycznyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.zapotrzebowanieCieplneKwh < 0)
    errors.push(wartoscUjemna("zapotrzebowanieCieplneKwh", input.zapotrzebowanieCieplneKwh))
  if (input.cenaZaKwhZl < 0) errors.push(wartoscUjemna("cenaZaKwhZl", input.cenaZaKwhZl))
  if (input.copPompy !== 0 && (input.copPompy <= COP_POMPY_MIN || input.copPompy > COP_POMPY_MAX)) {
    errors.push(copPozaZakresem(input.copPompy))
  }
  return { errors }
}
