import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { OslonyPrzeciwsloneczneInput } from "./input"

export function validateInput(input: OslonyPrzeciwsloneczneInput): { errors: Warning[] } {
  return { errors: ujemneWartosci({ wysiegM: input.wysiegM, odstepM: input.odstepM, wysokoscOknaM: input.wysokoscOknaM }) }
}
