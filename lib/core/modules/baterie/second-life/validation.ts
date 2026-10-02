import type { Warning } from "@/lib/core/calc-result"
import type { SecondLifeInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SecondLifeInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscDeklarowanaKwh < 0) {
    errors.push(notPositive("pojemnoscDeklarowanaKwh", "POLE-DEKLAROWANA-POJEMNOSC-L", input.pojemnoscDeklarowanaKwh))
  }
  if (input.cenaZakupuZl < 0) {
    errors.push(notPositive("cenaZakupuZl", "POLE-CENA-ZAKUPU-L", input.cenaZakupuZl))
  }
  if (input.wiekLata < 0) {
    errors.push(notPositive("wiekLata", "POLE-WIEK-BATERII-L", input.wiekLata))
  }
  if (input.przebiegKm < 0) {
    errors.push(notPositive("przebiegKm", "POLE-PRZEBIEG-L", input.przebiegKm))
  }
  return { errors }
}
