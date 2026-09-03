import type { Warning } from "@/lib/core/calc-result"
import type { DoborPojemnosciInput } from "./input"
import {
  dniAutonomiiNiedodatnie,
  dodPozaZakresem,
  sprawnoscPozaZakresem,
  zapotrzebowanieNiedodatnie,
} from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DoborPojemnosciInput): ValidationResult {
  const errors: Warning[] = []

  if (input.zapotrzebowanieDoboweKwh < 0) errors.push(zapotrzebowanieNiedodatnie(input.zapotrzebowanieDoboweKwh))
  if (input.dniAutonomii < 0) errors.push(dniAutonomiiNiedodatnie(input.dniAutonomii))
  if (input.sprawnoscFalownikaPct < 0 || input.sprawnoscFalownikaPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscFalownikaPct))
  }
  if (input.dodPct < 0 || input.dodPct > 100) errors.push(dodPozaZakresem(input.dodPct))

  return { errors }
}
