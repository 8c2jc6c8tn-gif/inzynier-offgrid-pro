import type { CalcResult } from "@/lib/core/calc-result"
import type { MontazMechanicznyOlowInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MontazMechanicznyOlowResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran B2, Moduł 11, Ścieżka B — "Montaż mechaniczny + mocowanie/wentylacja" (scala dawne
 * 10.2, 10.11, docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculateMontazMechanicznyOlow(
  input: MontazMechanicznyOlowInput,
): CalcResult<MontazMechanicznyOlowResult> {
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
