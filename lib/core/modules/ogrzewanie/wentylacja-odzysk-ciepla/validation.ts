import type { Warning } from "@/lib/core/calc-result"
import type { WentylacjaOdzyskCieplaInput } from "./input"
import { wartoscUjemna, sprawnoscPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: WentylacjaOdzyskCieplaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.wydajnoscCentraliM3H < 0) errors.push(wartoscUjemna("wydajnoscCentraliM3H", input.wydajnoscCentraliM3H))
  if (input.poborWentylatorowW < 0) errors.push(wartoscUjemna("poborWentylatorowW", input.poborWentylatorowW))
  if (input.deltaTK !== null && input.deltaTK < 0) errors.push(wartoscUjemna("deltaTK", input.deltaTK))
  if (input.sprawnoscRekuperatoraPct < 0 || input.sprawnoscRekuperatoraPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscRekuperatoraPct))
  }
  return { errors }
}
