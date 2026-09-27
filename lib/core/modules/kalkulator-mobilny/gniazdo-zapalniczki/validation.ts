import type { Warning } from "@/lib/core/calc-result"
import type { GniazdoZapalniczkiInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: GniazdoZapalniczkiInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pradBezpiecznikaA < 0) errors.push(wartoscUjemna("pradBezpiecznikaA", "Prąd bezpiecznika", input.pradBezpiecznikaA))
  input.urzadzenia.forEach((u, i) => {
    if (u.mocW < 0) errors.push(wartoscUjemna(`urzadzenia.${i}.mocW`, "Moc urządzenia", u.mocW))
  })
  return { errors }
}
