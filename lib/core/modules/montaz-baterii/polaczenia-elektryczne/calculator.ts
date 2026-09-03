import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PolaczeniaElektryczneInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PolaczeniaElektryczneResult = {
  potwierdzoneWKolejnosci: number
  razem: number
}

/**
 * Ekran A3, Moduł 11 — "Połączenia elektryczne + kolejność łączenia" (dawne 9.3, 9.11,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Logika 1:1 z Procedury Black Start
 * (Moduł 7, Ekran 5) — kolejność kroków ma znaczenie.
 */
export function calculatePolaczeniaElektryczne(
  input: PolaczeniaElektryczneInput,
): CalcResult<PolaczeniaElektryczneResult> {
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
