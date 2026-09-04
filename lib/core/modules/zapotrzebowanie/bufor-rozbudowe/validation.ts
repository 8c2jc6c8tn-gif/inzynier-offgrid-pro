import type { Warning } from "@/lib/core/calc-result"
import type { BuforRozbudowyInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: BuforRozbudowyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.zapotrzebowanieCalkowiteKwh < 0) {
    errors.push(notPositive(input.zapotrzebowanieCalkowiteKwh))
  }
  return { errors }
}
