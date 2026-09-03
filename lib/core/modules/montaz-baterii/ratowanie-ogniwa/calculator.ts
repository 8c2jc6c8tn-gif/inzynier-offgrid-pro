import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { RatowanieOgniwaInput } from "./input"
import { validateInput } from "./validation"
import { ogniwoZeroWoltowe, proceduraStandardowegoRatunku, ratunekOpcjonalnyNiezalecany } from "./warnings"
import { PROG_BEZPIECZNEGO_RATUNKU_V } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type Strefa = "krytyczna" | "ryzykowna" | "bezpieczna"

export type RatowanieOgniwaResult = {
  napiecieOgniwaV: number
  strefa: Strefa
}

const FORMULA = ""

/**
 * Ekran A9, Moduł 11 — "Ratowanie głęboko rozładowanego ogniwa" (dawne 9.17,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Trzy strefy decyzyjne z pomiaru napięcia,
 * dokładnie tak jak w źródle — nic pomiędzy nie jest wymyślone: 0V, (0, 1,5V], (1,5V, ∞).
 */
export function calculateRatowanieOgniwa(input: RatowanieOgniwaInput): CalcResult<RatowanieOgniwaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: RatowanieOgniwaResult = { napiecieOgniwaV: 0, strefa: "bezpieczna" }
  const inputs = { napiecieOgniwaV: input.napiecieOgniwaV ?? -1 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.napiecieOgniwaV === null) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const napiecieOgniwaV = input.napiecieOgniwaV
  const warnings: Warning[] = []
  let strefa: Strefa

  if (napiecieOgniwaV === 0) {
    strefa = "krytyczna"
    warnings.push(ogniwoZeroWoltowe())
  } else if (napiecieOgniwaV <= PROG_BEZPIECZNEGO_RATUNKU_V) {
    strefa = "ryzykowna"
    warnings.push(ratunekOpcjonalnyNiezalecany(napiecieOgniwaV))
  } else {
    strefa = "bezpieczna"
    warnings.push(proceduraStandardowegoRatunku(napiecieOgniwaV))
  }

  return {
    value: { napiecieOgniwaV, strefa },
    unit: "V",
    status: "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs: { napiecieOgniwaV },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
