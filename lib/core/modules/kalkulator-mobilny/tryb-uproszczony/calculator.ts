import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { TrybUproszczonyInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "t = C_{Ah} \\times V / P"

/**
 * Ekran 1, Moduł 12 — "Tryb uproszczony — dobór akumulatora i odbiorników" (dawne 8.1,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md).
 */
export function calculateTrybUproszczony(input: TrybUproszczonyInput): CalcResult<number> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    mocOdbiornikaW: input.mocOdbiornikaW,
  }

  if (errors.length > 0) {
    return {
      value: 0,
      unit: "h",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = (input.pojemnoscAh * input.napiecieV) / input.mocOdbiornikaW

  return {
    value,
    unit: "h",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "TRYB-UPROSZCZONY-CZAS-TEORETYCZNY" }] satisfies Assumption[],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
