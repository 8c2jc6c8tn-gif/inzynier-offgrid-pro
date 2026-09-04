import type { Warning } from "@/lib/core/calc-result"
import type { PaneleBifacjalneInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PaneleBifacjalneInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocRocznaBazowaKwh < 0) errors.push(wartoscUjemna("mocRocznaBazowaKwh", input.mocRocznaBazowaKwh))
  if (input.dodatkowyUzyskPct < 0) errors.push(wartoscUjemna("dodatkowyUzyskPct", input.dodatkowyUzyskPct))
  return { errors }
}
