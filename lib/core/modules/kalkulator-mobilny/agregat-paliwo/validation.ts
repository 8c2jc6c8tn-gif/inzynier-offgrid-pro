import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AgregatPaliwoInput } from "./input"
import { ponadDobe } from "./warnings"

export function validateInput(input: AgregatPaliwoInput): { errors: Warning[] } {
  return {
    errors: [
      ...ujemneWartosci({
        mocAgregatuKw: input.mocAgregatuKw,
        zuzycieLH: input.zuzycieLH,
        godzinNaDobe: input.godzinNaDobe,
        cenaZlL: input.cenaZlL,
        kosztPorownawczyZlKwh: input.kosztPorownawczyZlKwh,
      }),
      ...procentPozaZakresem("obciazeniePct", input.obciazeniePct),
      ...(input.godzinNaDobe > 24 ? [ponadDobe(input.godzinNaDobe)] : []),
    ],
  }
}
