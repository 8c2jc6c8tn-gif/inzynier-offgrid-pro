import type { Warning } from "@/lib/core/calc-result"
import type { RyzykoNiskiegoNapieciaInput } from "./input"
import { wartoscUjemna, napieciePozaSanityCheck } from "./warnings"
import { NAPIECIE_SANITY_MAX_V } from "./constants"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: RyzykoNiskiegoNapieciaInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []
  if (input.minNapiecieRoboczeV < 0) errors.push(wartoscUjemna("minNapiecieRoboczeV", input.minNapiecieRoboczeV))
  if (input.aktualneNapiecieSystemuV < 0)
    errors.push(wartoscUjemna("aktualneNapiecieSystemuV", input.aktualneNapiecieSystemuV))
  if (input.aktualneNapiecieSystemuV > NAPIECIE_SANITY_MAX_V) {
    warnings.push(napieciePozaSanityCheck(input.aktualneNapiecieSystemuV))
  }
  return { errors, warnings }
}
