import type { CalcResult } from "@/lib/core/calc-result"
import type { SohPerOgniwoInput } from "./input"
import { validateInput } from "./validation"
import { ogniwoDoWymiany, ogniwoOk } from "./warnings"
import { PROG_KRYTYCZNY_WZROSTU_PCT } from "./constants"

// 🔎 TD4 (dlug-techniczny.md): tylko warstwa 2 (diagnostyka per ogniwo, rezystancja). Warstwa 1
// (SoH ogólny metodą coulombowską) wymaga logowania historii w czasie, niemożliwa z danych jednorazowych.
export const CALCULATOR_VERSION = "1.0.0"

export type SohPerOgniwoResult = {
  wzrostPct: number
  doWymiany: boolean
}

const FORMULA = "wzrost\\% = (R_{aktualna} - R_{fabryczna}) / R_{fabryczna} \\times 100"

/**
 * Ekran 14, Moduł 4 "Magazyn energii / baterie" — "SoH (State of Health) — prognoza żywotności"
 * (scala dawne 3.16, 3.33, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B, punkt 2).
 * "Wzrost rezystancji o 50% względem wartości fabrycznej = utrata pojemności tego ogniwa" 1:1
 * ze źródła. Tylko ten jeden, jawnie podany próg — pośrednia strefa "UWAGA" z przykładu Sekcji C
 * nie ma podanego progu liczbowego, więc nie liczona (dwustanowa ocena: OK / do wymiany).
 */
export function calculateSohPerOgniwo(input: SohPerOgniwoInput): CalcResult<SohPerOgniwoResult> {
  const { errors } = validateInput(input)
  const pustyWynik: SohPerOgniwoResult = { wzrostPct: 0, doWymiany: false }
  const inputs = {
    rezystancjaFabrycznaMOhm: input.rezystancjaFabrycznaMOhm,
    rezystancjaAktualnaMOhm: input.rezystancjaAktualnaMOhm,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SOH-PER-OGNIWO",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.rezystancjaFabrycznaMOhm === 0 || input.rezystancjaAktualnaMOhm === 0) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SOH-PER-OGNIWO",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wzrostPct =
    ((input.rezystancjaAktualnaMOhm - input.rezystancjaFabrycznaMOhm) / input.rezystancjaFabrycznaMOhm) * 100
  const doWymiany = wzrostPct >= PROG_KRYTYCZNY_WZROSTU_PCT

  return {
    value: { wzrostPct, doWymiany },
    unit: "%",
    status: doWymiany ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SOH-PER-OGNIWO",
    inputs,
    assumptions: [],
    warnings: [doWymiany ? ogniwoDoWymiany(wzrostPct) : ogniwoOk(wzrostPct)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
