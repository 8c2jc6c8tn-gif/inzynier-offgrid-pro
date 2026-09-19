import type { Warning } from "@/lib/core/calc-result"
import type { PrzetworniceDcdcInput } from "./input"
import { notPositive, sprawnoscPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PrzetworniceDcdcInput): ValidationResult {
  const errors: Warning[] = []
  if (input.zapotrzebowanieUrzadzeniaW < 0) {
    errors.push(notPositive("zapotrzebowanieUrzadzeniaW", input.zapotrzebowanieUrzadzeniaW))
  }
  if (input.sprawnoscPrzetwornicyPct < 0 || input.sprawnoscPrzetwornicyPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscPrzetwornicyPct))
  }
  return { errors }
}
