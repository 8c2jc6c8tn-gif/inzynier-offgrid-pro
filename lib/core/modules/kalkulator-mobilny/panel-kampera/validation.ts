import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { PanelKamperaInput } from "./input"

export function validateInput(input: PanelKamperaInput): { errors: Warning[] } {
  const liczby = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  return { errors: ujemneWartosci(liczby) }
}
