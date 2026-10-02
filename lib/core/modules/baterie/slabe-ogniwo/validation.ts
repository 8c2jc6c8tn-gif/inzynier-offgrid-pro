import type { Warning } from "@/lib/core/calc-result"
import type { SlabeOgniwoInput } from "./input"
import { notPositive, tolerancjaPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SlabeOgniwoInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscZnamionowaAh < 0) {
    errors.push(notPositive("pojemnoscZnamionowaAh", "POLE-POJEMNOSC-ZNAMIONOWA-L", input.pojemnoscZnamionowaAh))
  }
  if (input.tolerancjaPct < 0 || input.tolerancjaPct > 100) {
    errors.push(tolerancjaPozaZakresem(input.tolerancjaPct))
  }
  return { errors }
}
