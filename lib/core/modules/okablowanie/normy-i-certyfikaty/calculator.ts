import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { NormyICertyfikatyInput } from "./input"
import { brakCertyfikatu } from "./warnings"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type NormyICertyfikatyResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran 21, Moduł 5 "Okablowanie i zabezpieczenia" — "Normy i certyfikaty" (dawne 4.26,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Checklist certyfikatów wymaganych normą per
 * typ komponentu — bez bazy komponentów (§15.2) to potwierdzenie ręczne, nie automatyczne
 * dopasowanie do konkretnego, wybranego produktu.
 */
export function calculateNormyICertyfikaty(input: NormyICertyfikatyInput): CalcResult<NormyICertyfikatyResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzoneUnikalne = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id)))
  const potwierdzone = potwierdzoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  const warnings: Warning[] = CHECKLIST_ITEMS.filter((item) => !potwierdzoneUnikalne.has(item.id)).map((item) =>
    brakCertyfikatu(item.komponentKey),
  )

  return {
    value: { potwierdzone, razem },
    unit: "komponentów potwierdzonych",
    status: potwierdzone === razem ? "VALID" : potwierdzone === 0 ? "INCOMPLETE" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [],
    warnings: potwierdzone === 0 ? [] : warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
