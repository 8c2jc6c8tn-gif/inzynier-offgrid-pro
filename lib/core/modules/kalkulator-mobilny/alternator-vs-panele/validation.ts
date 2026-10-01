import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AlternatorVsPaneleInput } from "./input"

export function validateInput(input: AlternatorVsPaneleInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  return {
    errors: [
      ...ujemneWartosci(liczby),
      ...procentPozaZakresem("sprawnoscToruPct", input.sprawnoscToruPct),
      ...procentPozaZakresem("socStartPct", input.socStartPct),
      ...godzinyPonadDobe("godzinJazdy", input.godzinJazdy),
      ...godzinyPonadDobe("godzinSlonca", input.godzinSlonca),
    ],
  }
}
