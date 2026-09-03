import type { CalcResult } from "@/lib/core/calc-result"
import type { BalanseryZewnetrzneOlowInput } from "./input"
import { validateInput } from "./validation"
import { brakBalanseraZewnetrznego } from "./warnings"
import { MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type BalanseryZewnetrzneOlowResult = {
  iloscAkumulatorowWSzeregu: number
  wymaganyBalanser: boolean
}

/**
 * Ekran B4, Moduł 11, Ścieżka B — "Balansery zewnętrzne" (scala dawne 10.4, 10.12,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculateBalanseryZewnetrzneOlow(
  input: BalanseryZewnetrzneOlowInput,
): CalcResult<BalanseryZewnetrzneOlowResult> {
  const { errors } = validateInput(input)
  const pustyWynik: BalanseryZewnetrzneOlowResult = { iloscAkumulatorowWSzeregu: 0, wymaganyBalanser: false }
  const inputs = { iloscAkumulatorowWSzeregu: input.iloscAkumulatorowWSzeregu }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "szt.",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.iloscAkumulatorowWSzeregu === 0) {
    return {
      value: pustyWynik,
      unit: "szt.",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wymaganyBalanser = input.iloscAkumulatorowWSzeregu >= MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA
  const value: BalanseryZewnetrzneOlowResult = { iloscAkumulatorowWSzeregu: input.iloscAkumulatorowWSzeregu, wymaganyBalanser }

  if (wymaganyBalanser && !input.posiadaBalanserZewnetrzny) {
    return {
      value,
      unit: "szt.",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [brakBalanseraZewnetrznego(input.iloscAkumulatorowWSzeregu)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value,
    unit: "szt.",
    status: "VALID",
    formula: "",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
