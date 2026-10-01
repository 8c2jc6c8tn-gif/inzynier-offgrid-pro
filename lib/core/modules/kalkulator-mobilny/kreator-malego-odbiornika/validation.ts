import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { KreatorMalegoOdbiornikaInput } from "./input"

export function validateInput(input: KreatorMalegoOdbiornikaInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const wiersze: Warning[] = []
  input.skladniki.forEach((s, i) => {
    liczby[`skladniki[${i}].mocW`] = s.mocW
    liczby[`skladniki[${i}].godzinNaDobe`] = s.godzinNaDobe
    liczby[`skladniki[${i}].krotnoscRozruchu`] = s.krotnoscRozruchu
    wiersze.push(...godzinyPonadDobe(`skladniki[${i}].godzinNaDobe`, s.godzinNaDobe))
  })
  return {
    errors: [
      ...ujemneWartosci(liczby),
      ...wiersze,
      ...procentPozaZakresem("uzytecznaPct", input.uzytecznaPct),
      ...procentPozaZakresem("sprawnoscFalownikaPct", input.sprawnoscFalownikaPct),
      ...procentPozaZakresem("sprawnoscToruPct", input.sprawnoscToruPct),
      ...godzinyPonadDobe("godzinSlonca", input.godzinSlonca),
    ],
  }
}
