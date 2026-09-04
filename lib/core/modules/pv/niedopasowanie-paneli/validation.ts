import type { Warning } from "@/lib/core/calc-result"
import type { NiedopasowaniePaneliInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: NiedopasowaniePaneliInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocPanel1W < 0) errors.push(wartoscUjemna("mocPanel1W", input.mocPanel1W))
  if (input.impPanel1A < 0) errors.push(wartoscUjemna("impPanel1A", input.impPanel1A))
  if (input.mocPanel2W < 0) errors.push(wartoscUjemna("mocPanel2W", input.mocPanel2W))
  if (input.impPanel2A < 0) errors.push(wartoscUjemna("impPanel2A", input.impPanel2A))
  if (input.napiecieWspolneV < 0) errors.push(wartoscUjemna("napiecieWspolneV", input.napiecieWspolneV))
  return { errors }
}
