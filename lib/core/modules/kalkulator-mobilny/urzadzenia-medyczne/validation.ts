import type { Warning } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { UrzadzeniaMedyczneInput } from "./input"

export function validateInput(input: UrzadzeniaMedyczneInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  return {
    errors: [
      ...ujemneWartosci(liczby),
      ...godzinyPonadDobe("godzinNaDobe", input.godzinNaDobe),
      ...procentPozaZakresem("uzytecznaPct", input.uzytecznaPct),
      ...procentPozaZakresem("sprawnoscFalownikaPct", input.sprawnoscFalownikaPct),
    ],
  }
}
