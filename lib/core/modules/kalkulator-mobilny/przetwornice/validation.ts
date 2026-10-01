import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { PrzetwornicaInput } from "./input"

export function validateInput(input: PrzetwornicaInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  input.urzadzenia.forEach((u, i) => {
    liczby[`urzadzenia[${i}].mocW`] = u.mocW
    liczby[`urzadzenia[${i}].krotnoscRozruchu`] = u.krotnoscRozruchu
  })
  return { errors: [...ujemneWartosci(liczby), ...procentPozaZakresem("sprawnoscPct", input.sprawnoscPct)] }
}
