import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { StacjaVsDiyInput } from "./input"

export function validateInput(input: StacjaVsDiyInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci({ ...input }),
      ...procentPozaZakresem("uzytecznaStacjiPct", input.uzytecznaStacjiPct),
      ...procentPozaZakresem("dodDiyPct", input.dodDiyPct),
    ],
  }
}
