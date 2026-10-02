import type { Warning } from "@/lib/core/calc-result"
import type { AudytZimowyInput } from "./input"
import { wartoscUjemna } from "./warnings"

export function validateInput(input: AudytZimowyInput): Warning[] {
  const errors: Warning[] = []
  if (input.zapasPaliwaL !== null && input.zapasPaliwaL < 0) errors.push(wartoscUjemna("zapasPaliwaL", input.zapasPaliwaL))
  if (input.wymaganyZapasL !== null && input.wymaganyZapasL < 0) errors.push(wartoscUjemna("wymaganyZapasL", input.wymaganyZapasL))
  return errors
}
