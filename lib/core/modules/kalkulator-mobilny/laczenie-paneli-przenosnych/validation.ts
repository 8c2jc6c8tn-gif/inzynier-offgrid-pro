import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { LaczeniePaneliPrzenosnychInput } from "./input"

export function validateInput(input: LaczeniePaneliPrzenosnychInput): { errors: Warning[] } {
  return { errors: ujemneWartosci({ liczbaPaneli: input.liczbaPaneli }) }
}
