import type { CalcResult } from "@/lib/core/calc-result"
import type { OchronaPrzedDotykiemInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OchronaPrzedDotykiemResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran 17, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed dotykiem" (dawne 4.16,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Checklist dwóch mechanizmów ochrony —
 * źródło nie podaje twardego stopu (brak 🔴 w tej sekcji), więc brak krytycznych ostrzeżeń,
 * tylko postęp potwierdzenia.
 */
export function calculateOchronaPrzedDotykiem(
  input: OchronaPrzedDotykiemInput,
): CalcResult<OchronaPrzedDotykiemResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzoneUnikalne = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id)))
  const potwierdzone = potwierdzoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  return {
    value: { potwierdzone, razem },
    unit: "mechanizmów potwierdzonych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [
      { kod: "OPD-ZALOZENIE-BRAK-TABELI-IP" },
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
