import type { Warning } from "@/lib/core/calc-result"
import type { DoborMocyFalownikaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: DoborMocyFalownikaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocSzczytowaW < 0) errors.push(wartoscUjemna("mocSzczytowaW", input.mocSzczytowaW))
  if (input.mocPozornaVa < 0) errors.push(wartoscUjemna("mocPozornaVa", input.mocPozornaVa))
  if (input.wspolczynnikJednoczesnosci < 0) {
    errors.push(wartoscUjemna("wspolczynnikJednoczesnosci", input.wspolczynnikJednoczesnosci))
  }
  if (input.mocFalownikaWybranaW < 0) {
    errors.push(wartoscUjemna("mocFalownikaWybranaW", input.mocFalownikaWybranaW))
  }
  return { errors }
}
