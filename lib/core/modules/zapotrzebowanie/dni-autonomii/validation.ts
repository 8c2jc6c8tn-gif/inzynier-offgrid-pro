import type { Warning } from "@/lib/core/calc-result"
import type { DniAutonomiiInput } from "./input"
import { dodPozaZakresem, sprawnoscPozaZakresem, zapotrzebowanieUjemne } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DniAutonomiiInput): ValidationResult {
  const errors: Warning[] = []

  if (input.zapotrzebowanieDoboweKwh < 0) errors.push(zapotrzebowanieUjemne(input.zapotrzebowanieDoboweKwh))
  if (input.sprawnoscFalownikaPct < 0 || input.sprawnoscFalownikaPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscFalownikaPct))
  }
  if (input.dodPct < 0 || input.dodPct > 100) errors.push(dodPozaZakresem(input.dodPct))

  return { errors }
}
