import type { CalcResult } from "@/lib/core/calc-result"
import type { PuszkiPolaczenioweInput } from "./input"
import { WYMAGANY_TYP } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PuszkiPolaczenioweResult = {
  wymaganyTyp: string | null
}

/**
 * Ekran 27, Moduł 5 "Okablowanie i zabezpieczenia" — "Puszki połączeniowe" (dawne 4.34,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec B — dobór typu puszki wg
 * lokalizacji, 1:1 ze źródła.
 */
export function calculatePuszkiPolaczeniowe(
  input: PuszkiPolaczenioweInput,
): CalcResult<PuszkiPolaczenioweResult> {
  if (input.miejsceMontazu === null) {
    return {
      value: { wymaganyTyp: null },
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
    value: { wymaganyTyp: WYMAGANY_TYP[input.miejsceMontazu] },
    unit: "",
    status: "VALID",
    formula: "",
    inputs: {},
    assumptions: [
      "Automatyczna lista punktów połączeniowych z tras (Ekran 19) NIE zbudowana — Ekran 19 nie ma modelu danych tras, nie ma skąd wygenerować listy bez wymyślania struktury.",
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
