import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { WeekendInput } from "./input"

export function validateInput(input: WeekendInput): { errors: Warning[] } {
  const { urzadzenia, ...liczby } = input
  const wiersze = Object.fromEntries(
    urzadzenia.flatMap((u, i) => [
      [`urzadzenia.${i}.mocW`, u.mocW],
      [`urzadzenia.${i}.godzinNaDobe`, u.godzinNaDobe],
    ]),
  )
  return {
    errors: [
      ...ujemneWartosci({ ...liczby, ...wiersze }),
      ...procentPozaZakresem("dodPct", input.dodPct),
      ...procentPozaZakresem("sprawnoscToruPct", input.sprawnoscToruPct),
      ...godzinyPonadDobe("godzinSlonca", input.godzinSlonca),
      ...urzadzenia.flatMap((u, i) => godzinyPonadDobe(`urzadzenia.${i}.godzinNaDobe`, u.godzinNaDobe)),
    ],
  }
}
