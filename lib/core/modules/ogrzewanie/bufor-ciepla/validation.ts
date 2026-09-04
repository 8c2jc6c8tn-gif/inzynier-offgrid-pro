import type { Warning } from "@/lib/core/calc-result"
import type { BuforCieplaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: BuforCieplaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocPompyKw < 0) errors.push(wartoscUjemna("mocPompyKw", input.mocPompyKw))
  if (input.pojemnoscBuforaL < 0) errors.push(wartoscUjemna("pojemnoscBuforaL", input.pojemnoscBuforaL))
  return { errors }
}
