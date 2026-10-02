import type { Warning } from "@/lib/core/calc-result"
import type { WindChillInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: WindChillInput): ValidationResult {
  const errors: Warning[] = []
  if (input.predkoscWiatruKmh < 0) {
    errors.push(wartoscUjemna("predkoscWiatruKmh", "POLE-PREDKOSC-WIATRU", input.predkoscWiatruKmh))
  }
  return { errors }
}
