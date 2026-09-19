import type { Warning } from "@/lib/core/calc-result"
import type { StringBoxInput } from "./input"
import { bezpiecznikStringowyUjemny, liczbaStringowUjemna, liczbaWejscUjemna } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: StringBoxInput): ValidationResult {
  const errors: Warning[] = []

  // 0 = pole jeszcze nie wypełnione (traktowane jako niekompletne, nie błąd) — patrz calculator.ts.
  if (input.liczbaStringow < 0) {
    errors.push(liczbaStringowUjemna(input.liczbaStringow))
  }
  if (input.liczbaWejscSkrzynki < 0) {
    errors.push(liczbaWejscUjemna(input.liczbaWejscSkrzynki))
  }
  if (input.bezpiecznikStringowyA < 0) {
    errors.push(bezpiecznikStringowyUjemny(input.bezpiecznikStringowyA))
  }

  return { errors, warnings: [] }
}
