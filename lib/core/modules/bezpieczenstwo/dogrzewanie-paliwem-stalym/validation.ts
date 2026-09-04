import type { Warning } from "@/lib/core/calc-result"
import type { DogrzewaniePaliwemStalymInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DogrzewaniePaliwemStalymInput): ValidationResult {
  const errors: Warning[] = []
  if (input.odlegloscOdMaterialowPalnychCm < 0) {
    errors.push(wartoscUjemna("odlegloscOdMaterialowPalnychCm", input.odlegloscOdMaterialowPalnychCm))
  }
  return { errors }
}
