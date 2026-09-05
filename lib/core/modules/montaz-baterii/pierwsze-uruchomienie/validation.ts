import type { Warning } from "@/lib/core/calc-result"
import type { PierwszeUruchomienieInput } from "./input"
import { napiecieOgniwaUjemne, pojemnoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: PierwszeUruchomienieInput): ValidationResult {
  const errors: Warning[] = []

  // 0 = pole jeszcze nie wypełnione (traktowane jako niekompletne, nie błąd) — patrz calculator.ts.
  if (input.pojemnoscAh < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscAh))
  if (input.napiecieNajwyzszegoOgniwaV < 0) errors.push(napiecieOgniwaUjemne(input.napiecieNajwyzszegoOgniwaV))

  return { errors, warnings: [] }
}
