import type { Warning } from "@/lib/core/calc-result"
import type { StringBoxInput } from "./input"

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
    errors.push({
      code: "LICZBA-STRINGOW-UJEMNA",
      level: "critical",
      message: "Liczba stringów nie może być ujemna.",
      technicalMessage: `liczbaStringow = ${input.liczbaStringow}, oczekiwano >= 0`,
      field: "liczbaStringow",
    })
  }
  if (input.liczbaWejscSkrzynki < 0) {
    errors.push({
      code: "LICZBA-WEJSC-UJEMNA",
      level: "critical",
      message: "Liczba wejść skrzynki nie może być ujemna.",
      technicalMessage: `liczbaWejscSkrzynki = ${input.liczbaWejscSkrzynki}, oczekiwano >= 0`,
      field: "liczbaWejscSkrzynki",
    })
  }
  if (input.bezpiecznikStringowyA < 0) {
    errors.push({
      code: "BEZPIECZNIK-STRINGOWY-UJEMNY",
      level: "critical",
      message: "Prąd bezpiecznika stringowego nie może być ujemny.",
      technicalMessage: `bezpiecznikStringowyA = ${input.bezpiecznikStringowyA}, oczekiwano >= 0`,
      field: "bezpiecznikStringowyA",
    })
  }

  return { errors, warnings: [] }
}
