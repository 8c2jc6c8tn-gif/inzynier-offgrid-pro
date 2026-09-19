import type { Warning } from "@/lib/core/calc-result"
import type { KategorieSpecjalneInput } from "./input"
import { pozycjaNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: KategorieSpecjalneInput): ValidationResult {
  const errors: Warning[] = []
  for (const pozycja of input.pozycje) {
    if (pozycja.mocW <= 0 || pozycja.czasMin <= 0) {
      errors.push(pozycjaNiedodatnia(pozycja.nazwa || "(bez nazwy)", pozycja.mocW <= 0 ? pozycja.mocW : pozycja.czasMin))
    }
  }
  return { errors }
}
