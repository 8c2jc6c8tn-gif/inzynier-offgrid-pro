import type { CalcResult } from "@/lib/core/calc-result"
import type { BezpieczenstwoKwasInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type BezpieczenstwoKwasResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran B8, Moduł 11, Ścieżka B — "Bezpieczeństwo pracy z kwasem" (dawne 10.9,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculateBezpieczenstwoKwas(
  input: BezpieczenstwoKwasInput,
): CalcResult<BezpieczenstwoKwasResult> {
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
