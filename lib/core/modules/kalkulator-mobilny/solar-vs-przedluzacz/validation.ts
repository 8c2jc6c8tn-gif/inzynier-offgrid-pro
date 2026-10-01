import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { SolarVsPrzedluzaczInput } from "./input"

export function validateInput(input: SolarVsPrzedluzaczInput): { errors: Warning[] } {
  return { errors: ujemneWartosci({ ...input }) }
}
