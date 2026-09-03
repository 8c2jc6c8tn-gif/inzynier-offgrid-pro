import type { CalcResult } from "@/lib/core/calc-result"
import type { PolaczeniaCzyszczenieOlowInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PolaczeniaCzyszczenieOlowResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran B3, Moduł 11, Ścieżka B — "Połączenia + czyszczenie biegunów" (scala dawne 10.3, 10.10,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculatePolaczeniaCzyszczenieOlow(
  input: PolaczeniaCzyszczenieOlowInput,
): CalcResult<PolaczeniaCzyszczenieOlowResult> {
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
