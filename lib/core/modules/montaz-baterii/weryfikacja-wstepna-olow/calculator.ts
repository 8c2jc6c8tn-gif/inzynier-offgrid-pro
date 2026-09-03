import type { CalcResult } from "@/lib/core/calc-result"
import type { WeryfikacjaWstepnaOlowInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WeryfikacjaWstepnaOlowResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran B1, Moduł 11, Ścieżka B — "Weryfikacja + kontrola wstępna" (scala dawne 10.1, 10.8,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculateWeryfikacjaWstepnaOlow(
  input: WeryfikacjaWstepnaOlowInput,
): CalcResult<WeryfikacjaWstepnaOlowResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzone = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id))).size
  const razem = CHECKLIST_ITEMS.length

  return {
    value: { potwierdzone, razem },
    unit: "kroków potwierdzonych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
