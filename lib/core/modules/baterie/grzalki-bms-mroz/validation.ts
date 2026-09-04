import type { Warning } from "@/lib/core/calc-result"
import type { GrzalkiBmsMrozInput } from "./input"
import { socUjemny } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: GrzalkiBmsMrozInput): ValidationResult {
  const errors: Warning[] = []
  if (input.socPct < 0 || input.socPct > 100) {
    errors.push(socUjemny(input.socPct))
  }
  return { errors }
}
