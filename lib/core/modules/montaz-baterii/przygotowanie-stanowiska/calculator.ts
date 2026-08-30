import type { CalcResult } from "@/lib/core/calc-result"
import type { PrzygotowanieStanowiskaInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PrzygotowanieStanowiskaResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran A7, Moduł 11 — "Przygotowanie stanowiska i narzędzi" (dawne 9.9,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculatePrzygotowanieStanowiska(
  input: PrzygotowanieStanowiskaInput,
): CalcResult<PrzygotowanieStanowiskaResult> {
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
