import type { Warning } from "@/lib/core/calc-result"
import type { Urzadzenie12vBezposrednioInput } from "./input"
import { maksLadowaniaPonizejZnamionowego, tolerancjaPozaZakresem, wartoscUjemna } from "./warnings"

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
  if (input.maksNapiecieLadowaniaV !== null) {
    if (input.maksNapiecieLadowaniaV < 0) {
      errors.push(wartoscUjemna("maksNapiecieLadowaniaV", "Maks. napięcie ładowania", input.maksNapiecieLadowaniaV))
    } else if (input.napiecieSystemuV !== 0 && input.maksNapiecieLadowaniaV < input.napiecieSystemuV) {
      // Charging voltage is always above the nominal one — e.g. 14,6 V typed for a 24 V system is a data error.
      errors.push(maksLadowaniaPonizejZnamionowego(input.maksNapiecieLadowaniaV, input.napiecieSystemuV))
    }
  }
  return { errors }
}
