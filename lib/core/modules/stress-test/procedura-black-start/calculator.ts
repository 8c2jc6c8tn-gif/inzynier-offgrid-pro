import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { ProceduraBlackStartInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type ProceduraBlackStartResult = {
  potwierdzoneWKolejnosci: number
  razem: number
}

/**
 * Ekran 5, Moduł 7 — "Procedura Black Start" (dawne 6.5,
 * docs/domena/Tresc_Modul_7_StressTest_Ekrany.md). Kolejność kroków ma znaczenie (analogicznie do
 * kolejności łączenia ogniw w Module 11) — zaznaczenie kroku poza kolejnością jest oznaczane jako
 * ostrzeżenie, nie liczy się do postępu.
 */
export function calculateProceduraBlackStart(
  input: ProceduraBlackStartInput,
): CalcResult<ProceduraBlackStartResult> {
  const checked = new Set(input.potwierdzoneIds)
  const razem = CHECKLIST_ITEMS.length

  let potwierdzoneWKolejnosci = 0
  for (const item of CHECKLIST_ITEMS) {
    if (!checked.has(item.id)) break
    potwierdzoneWKolejnosci++
  }

  const zaznaczonePozaKolejnoscia = CHECKLIST_ITEMS.slice(potwierdzoneWKolejnosci).some((item) =>
    checked.has(item.id),
  )

  const warnings: Warning[] = zaznaczonePozaKolejnoscia
    ? [
        {
          code: "KROK-POZA-KOLEJNOSCIA",
          level: "warning",
          message: "Zaznaczono krok poza kolejnością — potwierdź wcześniejsze kroki najpierw, kolejność ma znaczenie.",
          technicalMessage: `pierwszy niepotwierdzony krok w sekwencji: index ${potwierdzoneWKolejnosci}`,
        },
      ]
    : []

  return {
    value: { potwierdzoneWKolejnosci, razem },
    unit: "kroków potwierdzonych",
    status: potwierdzoneWKolejnosci === razem ? "VALID" : warnings.length > 0 ? "VALID_WITH_WARNINGS" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzoneWKolejnosci, razem },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
