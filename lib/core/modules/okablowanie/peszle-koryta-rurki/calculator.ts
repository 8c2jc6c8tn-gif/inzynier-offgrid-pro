import type { CalcResult } from "@/lib/core/calc-result"
import type { PeszleKorytaRurkiInput } from "./input"
import { OSLONY, type Oslona } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PeszleKorytaRurkiResult = {
  zalecanaOslona: Oslona | null
}

/**
 * Ekran 24, Moduł 5 "Okablowanie i zabezpieczenia" — "Peszle, koryta, rurki" (dawne 4.31,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec B — proste dopasowanie miejsca
 * montażu do jednej z 4 osłon 1:1 ze źródła, bez wymyślonych progów.
 */
export function calculatePeszleKorytaRurki(
  input: PeszleKorytaRurkiInput,
): CalcResult<PeszleKorytaRurkiResult> {
  if (input.miejsceMontazu === null) {
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

  const zalecanaOslona = OSLONY.find((o) => o.zalecaneMiejsce === input.miejsceMontazu) ?? null

  return {
    value: { zalecanaOslona },
    unit: "",
    status: "VALID",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
