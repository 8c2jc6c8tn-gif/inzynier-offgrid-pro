import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AkumulatorKamperaInput } from "./input"

export function validateInput(input: AkumulatorKamperaInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci(input),
      ...procentPozaZakresem("agmDodPct", input.agmDodPct),
      ...procentPozaZakresem("lfpDodPct", input.lfpDodPct),
    ],
  }
}
