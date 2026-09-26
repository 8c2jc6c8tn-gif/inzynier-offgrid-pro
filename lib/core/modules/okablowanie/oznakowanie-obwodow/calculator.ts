import type { CalcResult } from "@/lib/core/calc-result"
import type { OznakowanieObwodowInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OznakowanieObwodowResult = {
  oznaczone: number
  razem: number
}

/**
 * Ekran 20, Moduł 5 "Okablowanie i zabezpieczenia" — "Oznakowanie obwodów" (dawne 4.23,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Checklist kodów znakowania wg PN-EN 60445
 * Tabela 1 — kolorystyka świadomie pominięta (patrz `constants.ts`), bo normuje ją inna,
 * nieposiadana norma (IEC 60446), nie PN-EN 60445.
 */
export function calculateOznakowanieObwodow(
  input: OznakowanieObwodowInput,
): CalcResult<OznakowanieObwodowResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const oznaczoneUnikalne = new Set(input.oznaczoneIds.filter((id) => validIds.has(id)))
  const oznaczone = oznaczoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  return {
    value: { oznaczone, razem },
    unit: "obwodów oznaczonych",
    status: oznaczone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { oznaczone, razem },
    assumptions: [
      { kod: "OZNAKOWANIE-ZALOZENIE-KOLORY-ZYL" },
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
