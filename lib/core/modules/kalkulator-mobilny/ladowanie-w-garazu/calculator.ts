import type { CalcResult } from "@/lib/core/calc-result"
import {
  ocenChecklisteChemii,
  type ChecklistaChemiiResult,
} from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/calculator"
import type { ChecklistaChemiiInput } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

/** Ekran 36, Moduł 12 — "Bezpieczne ładowanie w garażu" (dawne 8.63). Wzorzec E, logika wspólna z Ekranem 22. */
export function calculateLadowanieWGarazu(input: ChecklistaChemiiInput): CalcResult<ChecklistaChemiiResult> {
  return ocenChecklisteChemii(CHECKLIST_ITEMS, input, {
    brakWentylacji: "LG-OLOW-BEZ-WENTYLACJI",
    lifepo4: "LG-LIFEPO4-BEZ-GAZOW",
  })
}
