import type { Warning } from "@/lib/core/calc-result"
import type { OchronaPrzepieciowaSpdInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: OchronaPrzepieciowaSpdInput): ValidationResult {
  const errors: Warning[] = []
  if (input.vocMaxStringuV < 0) errors.push(wartoscUjemna("vocMaxStringuV", input.vocMaxStringuV))
  if (input.odlegloscOdZwoduM !== null && input.odlegloscOdZwoduM < 0) {
    errors.push(wartoscUjemna("odlegloscOdZwoduM", input.odlegloscOdZwoduM))
  }
  if (input.ucSpdV < 0) errors.push(wartoscUjemna("ucSpdV", input.ucSpdV))
  return { errors }
}
