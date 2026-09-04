import type { Warning } from "@/lib/core/calc-result"
import type { SecondLifeInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SecondLifeInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscDeklarowanaKwh < 0) {
    errors.push(notPositive("pojemnoscDeklarowanaKwh", "deklarowana pojemność", input.pojemnoscDeklarowanaKwh))
  }
  if (input.cenaZakupuZl < 0) {
    errors.push(notPositive("cenaZakupuZl", "cena zakupu", input.cenaZakupuZl))
  }
  if (input.wiekLata < 0) {
    errors.push(notPositive("wiekLata", "wiek baterii", input.wiekLata))
  }
  if (input.przebiegKm < 0) {
    errors.push(notPositive("przebiegKm", "przebieg", input.przebiegKm))
  }
  return { errors }
}
