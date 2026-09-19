import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { UziemienieFunkcjonalneOchronneInput } from "./input"
import {
  biegunUziemionyWbrewIt,
  obudowaNiepolaczonaZGsw,
  uziemienieOk,
  wymaganyMonitorIzolacji,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type UziemienieFunkcjonalneOchronneResult = Record<string, never>

const FORMULA = ""

/**
 * Ekran 11, Moduł 5 "Okablowanie i zabezpieczenia" — "Uziemienie funkcjonalne vs ochronne"
 * (dawne 4.10, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Twardy stop 1:1 ze źródła:
 * uziemienie bieguna DC wbrew wymaganiom producenta (falownik IT) — ryzyko uszkodzenia MPPT.
 * "Auto z bazy komponentów" (typ falownika) zastąpione ręcznym wyborem — baza komponentów nie
 * istnieje w projekcie.
 */
export function calculateUziemienieFunkcjonalneOchronne(
  input: UziemienieFunkcjonalneOchronneInput,
): CalcResult<UziemienieFunkcjonalneOchronneResult> {
  const inputs = {}

  const warnings: Warning[] = []

  if (input.falownikWymagaUkladuIt && input.biegunDcUziemiony) {
    warnings.push(biegunUziemionyWbrewIt())
  } else if (input.falownikWymagaUkladuIt) {
    warnings.push(wymaganyMonitorIzolacji())
  }

  if (!input.obudowaPolaczonaZGsw) {
    warnings.push(obudowaNiepolaczonaZGsw())
  }

  if (warnings.length === 0) {
    warnings.push(uziemienieOk())
  }

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: {},
    unit: "",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "UKLAD-SIECI-INFORMACYJNY" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
