import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { PanelDlaUrzadzeniaInput } from "./input"

export function validateInput(input: PanelDlaUrzadzeniaInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci({ ...input }),
      ...godzinyPonadDobe("godzinPracy", input.godzinPracy),
      ...godzinyPonadDobe("godzinSlonca", input.godzinSlonca),
      ...procentPozaZakresem("uzyskPct", input.uzyskPct),
    ],
  }
}
