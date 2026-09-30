import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { PaneleDachKamperaInput } from "./input"

export function validateInput(input: PaneleDachKamperaInput): { errors: Warning[] } {
  const { odcinki, ...liczby } = input
  const wiersze = Object.fromEntries(odcinki.map((o, i) => [`odcinki.${i}.dlugoscM`, o.dlugoscM]))
  return { errors: ujemneWartosci({ ...liczby, ...wiersze }) }
}
