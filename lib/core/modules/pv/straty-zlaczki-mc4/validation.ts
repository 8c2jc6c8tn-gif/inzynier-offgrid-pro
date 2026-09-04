import type { Warning } from "@/lib/core/calc-result"
import type { StratyZlaczkiMc4Input } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: StratyZlaczkiMc4Input): ValidationResult {
  const errors: Warning[] = []
  if (input.rezystancjaZlaczkiMOhm < 0)
    errors.push(wartoscUjemna("rezystancjaZlaczkiMOhm", input.rezystancjaZlaczkiMOhm))
  if (input.liczbaZlaczek < 0) errors.push(wartoscUjemna("liczbaZlaczek", input.liczbaZlaczek))
  if (input.pradA < 0) errors.push(wartoscUjemna("pradA", input.pradA))
  return { errors }
}
