import type { Warning } from "@/lib/core/calc-result"
import type { WeryfikacjaOgniwInput } from "./input"
import { napiecieOgniwaNiedodatnie } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: WeryfikacjaOgniwInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  // 0 = pole jeszcze nie wypełnione (traktowane jako niekompletne, nie błąd) — patrz calculator.ts.
  input.napieciaOgniwV.forEach((value, index) => {
    if (value < 0) errors.push(napiecieOgniwaNiedodatnie(index, value))
  })

  return { errors, warnings }
}
