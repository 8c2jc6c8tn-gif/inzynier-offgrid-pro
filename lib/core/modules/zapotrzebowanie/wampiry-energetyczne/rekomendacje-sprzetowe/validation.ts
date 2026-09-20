import type { Warning } from "@/lib/core/calc-result"
import type { PorownanieMetodInput } from "./input"
import { kosztUjemny } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validatePorownanieMetod(input: PorownanieMetodInput): ValidationResult {
  const errors: Warning[] = []
  for (const metoda of input.metody) {
    if (metoda.kosztZakupuZl < 0) errors.push(kosztUjemny(metoda.id))
  }
  return { errors }
}
