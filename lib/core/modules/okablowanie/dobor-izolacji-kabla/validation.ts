import type { Warning } from "@/lib/core/calc-result"
import type { DoborIzolacjiKablaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: DoborIzolacjiKablaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.temperaturaMaksymalnaC < 0) {
    errors.push(wartoscUjemna("temperaturaMaksymalnaC", input.temperaturaMaksymalnaC))
  }
  return { errors }
}
