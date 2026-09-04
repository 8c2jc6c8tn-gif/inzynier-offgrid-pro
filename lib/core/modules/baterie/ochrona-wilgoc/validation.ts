import type { Warning } from "@/lib/core/calc-result"
import type { OchronaWilgocInput } from "./input"
import { wilgotnoscPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: OchronaWilgocInput): ValidationResult {
  const errors: Warning[] = []
  if (input.wilgotnoscPct < 0 || input.wilgotnoscPct > 100) {
    errors.push(wilgotnoscPozaZakresem(input.wilgotnoscPct))
  }
  return { errors }
}
