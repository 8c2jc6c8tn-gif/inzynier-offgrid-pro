import type { Warning } from "@/lib/core/calc-result"
import type { LongTermStorageInput } from "./input"
import { socUjemny } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: LongTermStorageInput): ValidationResult {
  const errors: Warning[] = []
  if (input.socDocelowyPct < 0 || input.socDocelowyPct > 100) {
    errors.push(socUjemny(input.socDocelowyPct))
  }
  return { errors }
}
