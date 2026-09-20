import type { Warning } from "@/lib/core/calc-result"
import type { ZlaczaMc4Input } from "./input"

export type ValidationResult = { errors: Warning[] }

/** Pola tekstowe wybierane z listy zamkniętej (PoleSelect) — brak stanu "nieprawidłowej" wartości
 * poza pustym wyborem, obsługiwanym jako INCOMPLETE w `calculator.ts`, nie tutaj. Parametr
 * zachowany dla spójności sygnatury ze wszystkimi innymi modułami (`validateInput(input)`).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateInput(input: ZlaczaMc4Input): ValidationResult {
  return { errors: [] }
}
