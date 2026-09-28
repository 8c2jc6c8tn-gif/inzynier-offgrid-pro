import type { Warning } from "@/lib/core/calc-result"
import type { ModulGasniczyInput } from "./input"
import { liczbaCzujnikowNiepoprawna } from "./warnings"

export function validateInput(input: ModulGasniczyInput): { errors: Warning[] } {
  const n = input.liczbaCzujnikowPotwierdzenia
  const errors = n !== null && (!Number.isInteger(n) || n < 1) ? [liczbaCzujnikowNiepoprawna(n)] : []
  return { errors }
}
