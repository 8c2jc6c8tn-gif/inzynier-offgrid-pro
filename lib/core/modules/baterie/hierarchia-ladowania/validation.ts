import type { Warning } from "@/lib/core/calc-result"
import type { HierarchiaLadowaniaInput } from "./input"
import { socPozaZakresem } from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: HierarchiaLadowaniaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.socAktualnyPct < 0 || input.socAktualnyPct > 100) {
    errors.push(socPozaZakresem("socAktualnyPct", input.socAktualnyPct))
  }
  if (input.socProguKrytycznegoPct < 0 || input.socProguKrytycznegoPct > 100) {
    errors.push(socPozaZakresem("socProguKrytycznegoPct", input.socProguKrytycznegoPct))
  }

  return { errors }
}
