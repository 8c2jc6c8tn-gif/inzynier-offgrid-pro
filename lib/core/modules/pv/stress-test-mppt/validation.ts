import type { Warning } from "@/lib/core/calc-result"
import type { StressTestMpptInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: StressTestMpptInput): ValidationResult {
  const errors: Warning[] = []
  if (input.vocStcV < 0) errors.push(wartoscUjemna("vocStcV", input.vocStcV))
  if (input.liczbaPaneliWStringu < 0) errors.push(wartoscUjemna("liczbaPaneliWStringu", input.liczbaPaneliWStringu))
  if (input.limitMpptV < 0) errors.push(wartoscUjemna("limitMpptV", input.limitMpptV))
  return { errors }
}
