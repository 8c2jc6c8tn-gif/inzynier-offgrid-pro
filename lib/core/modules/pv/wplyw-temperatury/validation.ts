import type { Warning } from "@/lib/core/calc-result"
import type { WplywTemperaturyInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: WplywTemperaturyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.przyrostTemperaturyC < 0) errors.push(wartoscUjemna("przyrostTemperaturyC", input.przyrostTemperaturyC))
  if (input.mocNominalnaW < 0) errors.push(wartoscUjemna("mocNominalnaW", input.mocNominalnaW))
  return { errors }
}
