import type { Warning } from "@/lib/core/calc-result"
import type { BojlerCwuInput } from "./input"
import { deltaTUjemna, mocGrzalkiUjemna, pojemnoscUjemna, wolumenUjemny } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: BojlerCwuInput): ValidationResult {
  const errors: Warning[] = []
  if (input.wolumenCwuLDoba < 0) errors.push(wolumenUjemny(input.wolumenCwuLDoba))
  if (input.deltaTK < 0) errors.push(deltaTUjemna(input.deltaTK))
  if (input.mocGrzalkiKw < 0) errors.push(mocGrzalkiUjemna(input.mocGrzalkiKw))
  if (input.pojemnoscBojleraL < 0) errors.push(pojemnoscUjemna(input.pojemnoscBojleraL))
  return { errors }
}
