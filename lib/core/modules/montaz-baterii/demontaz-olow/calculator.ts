import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DemontazOlowInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type DemontazOlowResult = {
  potwierdzoneWKolejnosci: number
  razem: number
}

/**
 * Ekran B7, Moduł 11, Ścieżka B — "Demontaż — procedura, kolejność, zabezpieczenie" (scala dawne
 * 10.7, 10.14, 10.15, docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Logika 1:1 z Ekranu A3
 * (Połączenia elektryczne) — kolejność kroków ma znaczenie.
 */
export function calculateDemontazOlow(input: DemontazOlowInput): CalcResult<DemontazOlowResult> {
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
