import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AkumulatorSamochodowyInput } from "./input"

export function validateInput(input: AkumulatorSamochodowyInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci({
        pojemnoscAh: input.pojemnoscAh,
        napiecieV: input.napiecieV,
        mocW: input.mocW,
        planowanyCzasH: input.planowanyCzasH,
      }),
      ...procentPozaZakresem("uzytecznaPct", input.uzytecznaPct),
    ],
  }
}
