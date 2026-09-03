import type { Warning } from "@/lib/core/calc-result"
import type { GestoscElektrolituInput } from "./input"
import { gestoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: GestoscElektrolituInput): ValidationResult {
  const errors: Warning[] = []
  if (input.gestoscGCm3 !== null && input.gestoscGCm3 <= 0) {
    errors.push(gestoscNiedodatnia(input.gestoscGCm3))
  }
  return { errors }
}
