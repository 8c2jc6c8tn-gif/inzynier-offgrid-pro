import type { Warning } from "@/lib/core/calc-result"
import type { DopasowanieTablicyFalownikaInput } from "./input"
import { wartoscUjemna, oknoMpptOdwrocone } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DopasowanieTablicyFalownikaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.vocStcV < 0) errors.push(wartoscUjemna("vocStcV", input.vocStcV))
  if (input.vmpStcV < 0) errors.push(wartoscUjemna("vmpStcV", input.vmpStcV))
  if (input.impA < 0) errors.push(wartoscUjemna("impA", input.impA))
  if (input.liczbaPaneliWStringu < 0)
    errors.push(wartoscUjemna("liczbaPaneliWStringu", input.liczbaPaneliWStringu))
  if (input.vMaxFalownikaV < 0) errors.push(wartoscUjemna("vMaxFalownikaV", input.vMaxFalownikaV))
  if (input.mpptMinV < 0) errors.push(wartoscUjemna("mpptMinV", input.mpptMinV))
  if (input.mpptMaxV < 0) errors.push(wartoscUjemna("mpptMaxV", input.mpptMaxV))
  if (input.iMaxMpptA < 0) errors.push(wartoscUjemna("iMaxMpptA", input.iMaxMpptA))
  if (input.mocFalownikaAcW < 0) errors.push(wartoscUjemna("mocFalownikaAcW", input.mocFalownikaAcW))
  if (input.mpptMinV > 0 && input.mpptMaxV > 0 && input.mpptMinV > input.mpptMaxV) {
    errors.push(oknoMpptOdwrocone(input.mpptMinV, input.mpptMaxV))
  }
  return { errors }
}
