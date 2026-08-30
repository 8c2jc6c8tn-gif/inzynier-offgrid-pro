import type { Warning } from "@/lib/core/calc-result"
import type { CopPompyCieplaInput } from "./input"
import { COP_MAX, COP_MIN, MOC_CIEPLNA_KW_MAX } from "./constants"
import { copOutOfRange, mocCieplnaUnusuallyHigh, notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: CopPompyCieplaInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  if (input.mocCieplnaKw <= 0) {
    errors.push(notPositive("mocCieplnaKw", "moc cieplna", input.mocCieplnaKw))
  } else if (input.mocCieplnaKw > MOC_CIEPLNA_KW_MAX) {
    warnings.push(mocCieplnaUnusuallyHigh(input.mocCieplnaKw))
  }

  if (input.cop <= COP_MIN || input.cop > COP_MAX) {
    errors.push(copOutOfRange(input.cop))
  }

  return { errors, warnings }
}
