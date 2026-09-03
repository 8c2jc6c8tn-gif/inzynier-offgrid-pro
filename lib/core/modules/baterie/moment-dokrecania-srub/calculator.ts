import type { CalcResult } from "@/lib/core/calc-result"
import type { MomentDokrecaniaInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MomentDokrecaniaResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran 11, Moduł 4 — "Moment dokręcania śrub" (dawne 3.12,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Checklist bez formuły — status
 * odzwierciedla postęp potwierdzeń, nie wynik liczbowy.
 */
export function calculateMomentDokrecania(
  input: MomentDokrecaniaInput,
): CalcResult<MomentDokrecaniaResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzoneUnikalne = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id)))
  const potwierdzone = potwierdzoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  return {
    value: { potwierdzone, razem },
    unit: "kroków potwierdzonych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "postęp = liczba\\_potwierdzonych / liczba\\_kroków",
    inputs: { potwierdzone, razem },
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
