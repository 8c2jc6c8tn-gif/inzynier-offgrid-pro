import type { Warning } from "@/lib/core/calc-result"
import type { WylacznikiNadpradoweDcInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: WylacznikiNadpradoweDcInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pradA < 0) errors.push(wartoscUjemna("pradA", input.pradA))
  if (input.napiecieV < 0) errors.push(wartoscUjemna("napiecieV", input.napiecieV))
  if (input.liczbaBiegunow < 0) errors.push(wartoscUjemna("liczbaBiegunow", input.liczbaBiegunow))
  if (input.aicA < 0) errors.push(wartoscUjemna("aicA", input.aicA))
  if (input.pradZwarciowyA < 0) errors.push(wartoscUjemna("pradZwarciowyA", input.pradZwarciowyA))
  return { errors }
}
