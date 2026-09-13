import type { CalcResult } from "@/lib/core/calc-result"
import type { OchronaPrzedGryzoniamiInput } from "./input"
import { REKOMENDACJA } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OchronaPrzedGryzoniamiResult = {
  zalecanaOslona: string | null
}

/**
 * Ekran 25, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed gryzoniami" (dawne 4.32,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C — rekomendacja 1:1 ze źródła
 * (wysokie ryzyko → peszel metalowy spiralny zamiast plastikowego).
 */
export function calculateOchronaPrzedGryzoniami(
  input: OchronaPrzedGryzoniamiInput,
): CalcResult<OchronaPrzedGryzoniamiResult> {
  if (input.poziomRyzyka === null) {
    return {
      value: { zalecanaOslona: null },
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value: { zalecanaOslona: REKOMENDACJA[input.poziomRyzyka] },
    unit: "",
    status: "VALID",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
