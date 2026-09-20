import type { Warning } from "@/lib/core/calc-result"
import type { ProjektUziemieniaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: ProjektUziemieniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.rezystywnoscGruntuOmM < 0) errors.push(wartoscUjemna("rezystywnoscGruntuOmM", input.rezystywnoscGruntuOmM))
  if (input.dlugoscPretaM < 0) errors.push(wartoscUjemna("dlugoscPretaM", input.dlugoscPretaM))
  if (input.srednicaPretaMm < 0) errors.push(wartoscUjemna("srednicaPretaMm", input.srednicaPretaMm))
  return { errors }
}
