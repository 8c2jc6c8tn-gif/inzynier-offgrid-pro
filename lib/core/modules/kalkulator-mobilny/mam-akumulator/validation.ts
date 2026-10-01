import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { MamAkumulatorInput } from "./input"

export function validateInput(input: MamAkumulatorInput): { errors: Warning[] } {
  const moce = Object.fromEntries(input.urzadzenia.map((u, i) => [`urzadzenia.${i}.mocW`, u.mocW]))
  return {
    errors: [
      ...ujemneWartosci({ pojemnoscAh: input.pojemnoscAh, napiecieV: input.napiecieV, maksPradA: input.maksPradA, ...moce }),
      ...procentPozaZakresem("dodPct", input.dodPct),
      ...procentPozaZakresem("sprawnoscPct", input.sprawnoscPct),
    ],
  }
}
