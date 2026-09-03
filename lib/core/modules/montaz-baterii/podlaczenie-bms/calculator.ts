import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PodlaczenieBmsInput } from "./input"
import { validateInput } from "./validation"
import { krokPozaKolejnoscia } from "./warnings"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PodlaczenieBmsResult = {
  czasPreChargeS: number
  potwierdzoneWKolejnosci: number
  razem: number
}

const FORMULA = "T = 5 \\cdot R_{pre} \\cdot C"

/**
 * Ekran A4, Moduł 11 — "Podłączenie BMS" (dawne 9.4, 9.5, 9.12,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Czas pre-charge liczony niezależnie od
 * checklisty (user potrzebuje tej liczby, ZANIM zacznie odhaczać krok 3), kolejność checklisty
 * (jak w Ekranie A3 / Procedurze Black Start) rządzi tylko werdyktem gotowości.
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

  const pojemnoscF = input.pojemnoscFalownikaUf * 1e-6
  const czasPreChargeS = Math.round(5 * input.rezystancjaPreChargeOhm * pojemnoscF * 1000) / 1000

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
