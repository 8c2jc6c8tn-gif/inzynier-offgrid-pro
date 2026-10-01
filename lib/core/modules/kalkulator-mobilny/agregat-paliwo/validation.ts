import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AgregatPaliwoInput } from "./input"

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
      ...godzinyPonadDobe("godzinNaDobe", input.godzinNaDobe),
    ],
  }
}
