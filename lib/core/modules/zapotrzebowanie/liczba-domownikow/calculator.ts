import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { LiczbaDomownikowInput } from "./input"
import { validateInput } from "./validation"
import { CWU_MAX_L_NA_OSOBE, CWU_MIN_L_NA_OSOBE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type LiczbaDomownikowResult = {
  liczbaDomownikow: number
  cwuMinLDoba: number
  cwuMaxLDoba: number
}

const FORMULA = "V_{CWU} = n \\times (50\\text{–}70)\\ l"

/**
 * Ekran 4, Moduł 2 — "Liczba domowników" (dawne 1.6,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Liczy tylko dobowe zapotrzebowanie na
 * C.W.U. (jedyny fragment z gotowym wzorem, niezależny od Ekranów 2/3, które jeszcze nie
 * istnieją) — sama liczba domowników jako taka jest zapisywana i re-używana przez te ekrany,
 * gdy powstaną.
 */
export function calculateLiczbaDomownikow(
  input: LiczbaDomownikowInput,
): CalcResult<LiczbaDomownikowResult> {
  const { errors } = validateInput(input)
  const pustyWynik: LiczbaDomownikowResult = { liczbaDomownikow: 0, cwuMinLDoba: 0, cwuMaxLDoba: 0 }
  const inputs = { liczbaDomownikow: input.liczbaDomownikow }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "l/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaDomownikow === 0) {
    return {
      value: pustyWynik,
      unit: "l/dobę",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const cwuMinLDoba = input.liczbaDomownikow * CWU_MIN_L_NA_OSOBE
  const cwuMaxLDoba = input.liczbaDomownikow * CWU_MAX_L_NA_OSOBE

  return {
    value: { liczbaDomownikow: input.liczbaDomownikow, cwuMinLDoba, cwuMaxLDoba },
    unit: "l/dobę",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "CWU-ZAKRES-ORIENTACYJNY", params: { min: CWU_MIN_L_NA_OSOBE, max: CWU_MAX_L_NA_OSOBE } },
    ] satisfies Assumption[],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
