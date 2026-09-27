import type { Warning } from "@/lib/core/calc-result"
import type { Urzadzenie12vBezposrednioInput } from "./input"
import { tolerancjaPozaZakresem, wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: Urzadzenie12vBezposrednioInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieUrzadzeniaV < 0) {
    errors.push(wartoscUjemna("napiecieUrzadzeniaV", "Napięcie urządzenia", input.napiecieUrzadzeniaV))
  }
  if (input.tolerancjaPct !== null && (input.tolerancjaPct < 0 || input.tolerancjaPct >= 100)) {
    errors.push(tolerancjaPozaZakresem(input.tolerancjaPct))
  }
  return { errors }
}
