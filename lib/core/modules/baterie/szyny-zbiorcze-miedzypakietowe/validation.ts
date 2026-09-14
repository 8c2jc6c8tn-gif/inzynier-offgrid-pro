import type { Warning } from "@/lib/core/calc-result"
import type { SzynyZbiorczeMiedzypakietoweInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: SzynyZbiorczeMiedzypakietoweInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pradCalkowityA < 0) errors.push(wartoscUjemna("pradCalkowityA", input.pradCalkowityA))
  for (const galaz of input.galezie) {
    if (galaz.dlugoscM < 0) errors.push(wartoscUjemna(`${galaz.id}.dlugoscM`, galaz.dlugoscM))
    if (galaz.przekrojMm2 < 0) errors.push(wartoscUjemna(`${galaz.id}.przekrojMm2`, galaz.przekrojMm2))
  }
  return { errors }
}
