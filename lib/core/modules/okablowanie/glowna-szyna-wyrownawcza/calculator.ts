import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { GlownaSzynaWyrownawczaInput } from "./input"
import { gswUzywanaJakoPrzylacze } from "./warnings"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type GlownaSzynaWyrownawczaResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran 10, Moduł 5 "Okablowanie i zabezpieczenia" — "Główna Szyna Wyrównawcza (GSW)"
 * (dawne 4.9, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Checklist elementów do
 * podłączenia z minimalnym przekrojem przewodu wyrównawczego, plus twardy stop 1:1 ze źródła
 * (GSW nie jest szyną prądową).
 */
export function calculateGlownaSzynaWyrownawcza(
  input: GlownaSzynaWyrownawczaInput,
): CalcResult<GlownaSzynaWyrownawczaResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzoneUnikalne = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id)))
  const potwierdzone = potwierdzoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  const warnings: Warning[] = input.uzywanaJakoPrzylaczeOdbiornikow ? [gswUzywanaJakoPrzylacze()] : []

  return {
    value: { potwierdzone, razem },
    unit: "kroków potwierdzonych",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
