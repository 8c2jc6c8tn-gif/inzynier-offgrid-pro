import type { Warning } from "@/lib/core/calc-result"
import type { RyzykoPidInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: RyzykoPidInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieDcV < 0) {
    errors.push(wartoscUjemna("napiecieDcV", "Napięcie systemu DC", input.napiecieDcV))
  }
  return { errors }
}
