import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { BlackoutBalkonInput } from "./input"

export function validateInput(input: BlackoutBalkonInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const wiersze: Warning[] = []
  input.odbiorniki.forEach((o, i) => {
    liczby[`odbiorniki[${i}].mocW`] = o.mocW
    liczby[`odbiorniki[${i}].godzinNaDobe`] = o.godzinNaDobe
    wiersze.push(...godzinyPonadDobe(`odbiorniki[${i}].godzinNaDobe`, o.godzinNaDobe))
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
