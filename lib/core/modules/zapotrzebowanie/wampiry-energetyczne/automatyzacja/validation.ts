import type { Warning } from "@/lib/core/calc-result"
import type { ScenariuszAutomatyzacjiInput } from "./input"
import { standbyReferencyjnyNiedodatni, standbyWScenariuszuNiedodatni } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateScenariuszAutomatyzacji(input: ScenariuszAutomatyzacjiInput): ValidationResult {
  const errors: Warning[] = []
  if (input.standbyReferencyjnyW < 0) errors.push(standbyReferencyjnyNiedodatni())
  if (input.standbyWScenariuszuW < 0) errors.push(standbyWScenariuszuNiedodatni())
  return { errors }
}
