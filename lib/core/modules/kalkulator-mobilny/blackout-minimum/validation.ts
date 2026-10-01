import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { BlackoutMinimumInput } from "./input"

export function validateInput(input: BlackoutMinimumInput): { errors: Warning[] } {
  const { odbiorniki, ...liczby } = input
  const wiersze = Object.fromEntries(
    odbiorniki.flatMap((o, i) => [
      [`odbiorniki.${i}.mocW`, o.mocW],
      [`odbiorniki.${i}.godzinNaDobe`, o.godzinNaDobe],
    ]),
  )
  return {
    errors: [
      ...ujemneWartosci({ ...liczby, ...wiersze }),
      ...procentPozaZakresem("uzytecznaPct", input.uzytecznaPct),
      ...procentPozaZakresem("sprawnoscPrzetwornicyPct", input.sprawnoscPrzetwornicyPct),
      ...odbiorniki.flatMap((o, i) => godzinyPonadDobe(`odbiorniki.${i}.godzinNaDobe`, o.godzinNaDobe)),
    ],
  }
}
