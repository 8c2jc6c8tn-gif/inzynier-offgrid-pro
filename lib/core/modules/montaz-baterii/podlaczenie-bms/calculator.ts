import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PodlaczenieBmsInput } from "./input"
import { validateInput } from "./validation"
import { krokPozaKolejnoscia } from "./warnings"
import { CHECKLIST_ITEMS } from "./constants"
import { obliczCzasPreChargeS } from "@/lib/core/modules/baterie/obwod-precharge/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type PodlaczenieBmsResult = {
  czasPreChargeS: number
  potwierdzoneWKolejnosci: number
  razem: number
}

const FORMULA = "T = 5 \\cdot R_{pre} \\cdot C"

/**
 * Ekran A4, Moduł 11 — "Podłączenie BMS" (dawne 9.4, 9.5, 9.12,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Czas pre-charge liczony niezależnie od
 * checklisty (user potrzebuje tej liczby, ZANIM zacznie odhaczać krok 3), kolejność checklisty
 * (jak w Ekranie A3 / Procedurze Black Start) rządzi tylko werdyktem gotowości.
 *
 * (2026-09-04) Sam wzór `T = 5×R×C` re-używany z `lib/core/modules/baterie/obwod-precharge/
 * calculator.ts` (Ekran 7, Moduł 4 — kanoniczne źródło tego faktu fizycznego, wzorzec "echo",
 * docs/standards/01-architektura.md 1.3) zamiast duplikowany inline — walidacja/statusy tego
 * ekranu (checklist, `<=0` → INVALID_INPUT) zostają własne, bo różnią się od Ekranu 7.
 */
export function calculatePodlaczenieBms(input: PodlaczenieBmsInput): CalcResult<PodlaczenieBmsResult> {
  const { errors } = validateInput(input)
  const razem = CHECKLIST_ITEMS.length
  const inputs = {
    pojemnoscFalownikaUf: input.pojemnoscFalownikaUf,
    rezystancjaPreChargeOhm: input.rezystancjaPreChargeOhm,
  }

  if (errors.length > 0) {
    return {
      value: { czasPreChargeS: 0, potwierdzoneWKolejnosci: 0, razem },
      unit: "s",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const czasPreChargeS = obliczCzasPreChargeS(input.rezystancjaPreChargeOhm, input.pojemnoscFalownikaUf)

  const checked = new Set(input.potwierdzoneIds)
  let potwierdzoneWKolejnosci = 0
  for (const item of CHECKLIST_ITEMS) {
    if (!checked.has(item.id)) break
    potwierdzoneWKolejnosci++
  }
  const zaznaczonePozaKolejnoscia = CHECKLIST_ITEMS.slice(potwierdzoneWKolejnosci).some((item) =>
    checked.has(item.id),
  )

  const warnings: Warning[] = zaznaczonePozaKolejnoscia ? [krokPozaKolejnoscia()] : []
  const value = { czasPreChargeS, potwierdzoneWKolejnosci, razem }

  return {
    value,
    unit: "s",
    status:
      potwierdzoneWKolejnosci === razem
        ? "VALID"
        : warnings.length > 0
          ? "VALID_WITH_WARNINGS"
          : "INCOMPLETE",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
