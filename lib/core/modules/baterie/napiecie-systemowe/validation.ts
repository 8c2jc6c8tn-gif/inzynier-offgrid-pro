import type { Warning } from "@/lib/core/calc-result"
import type { NapiecieSystemoweInput } from "./input"
import { mocUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: NapiecieSystemoweInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocSzczytowaW < 0) errors.push(mocUjemna(input.mocSzczytowaW))
  return { errors }
}
