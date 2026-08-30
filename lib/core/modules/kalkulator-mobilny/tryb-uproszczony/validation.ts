import type { Warning } from "@/lib/core/calc-result"
import type { TrybUproszczonyInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: TrybUproszczonyInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscAh <= 0) {
    errors.push(notPositive("pojemnoscAh", "pojemność akumulatora", input.pojemnoscAh))
  }
  if (input.napiecieV <= 0) {
    errors.push(notPositive("napiecieV", "napięcie", input.napiecieV))
  }
  if (input.mocOdbiornikaW <= 0) {
    errors.push(notPositive("mocOdbiornikaW", "moc odbiornika", input.mocOdbiornikaW))
  }

  return { errors, warnings: [] }
}
