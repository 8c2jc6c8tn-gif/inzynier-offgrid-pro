import type { Warning } from "@/lib/core/calc-result"
import type { PoborWlasnyFalownikaInput } from "./input"
import { poborUjemny } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PoborWlasnyFalownikaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.poborJalowyW < 0) {
    errors.push(poborUjemny(input.poborJalowyW))
  }
  return { errors }
}
