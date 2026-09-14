import type { Warning } from "@/lib/core/calc-result"
import type { OchronaStringowInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: OchronaStringowInput): ValidationResult {
  const errors: Warning[] = []
  if (input.iscStcA < 0) errors.push(wartoscUjemna("iscStcA", input.iscStcA))
  if (input.iModMaxOcprA < 0) errors.push(wartoscUjemna("iModMaxOcprA", input.iModMaxOcprA))
  if (input.liczbaStringowRownoleglych < 0) {
    errors.push(wartoscUjemna("liczbaStringowRownoleglych", input.liczbaStringowRownoleglych))
  }
  if (input.wybranyBezpiecznikA !== null && input.wybranyBezpiecznikA < 0) {
    errors.push(wartoscUjemna("wybranyBezpiecznikA", input.wybranyBezpiecznikA))
  }
  return { errors }
}
