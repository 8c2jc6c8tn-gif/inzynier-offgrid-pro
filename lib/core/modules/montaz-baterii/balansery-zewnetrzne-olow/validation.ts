import type { Warning } from "@/lib/core/calc-result"
import type { BalanseryZewnetrzneOlowInput } from "./input"
import { iloscAkumulatorowNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: BalanseryZewnetrzneOlowInput): ValidationResult {
  const errors: Warning[] = []
  if (input.iloscAkumulatorowWSzeregu < 0) {
    errors.push(iloscAkumulatorowNiedodatnia(input.iloscAkumulatorowWSzeregu))
  }
  return { errors }
}
