import type { CalcResult } from "@/lib/core/calc-result"
import type { MocPozornaCosfiInput } from "./input"
import { validateInput } from "./validation"
import { mocPozornaInfo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type MocPozornaCosfiResult = {
  mocPozornaVA: number
}

const FORMULA = "VA = P / \\cos\\varphi"

/**
 * Ekran 8, Moduł 2 "Zapotrzebowanie energetyczne" — "Zaawansowane parametry obciążenia",
 * podpunkt 1 "Moc pozorna/cos φ" (dawne 1.10, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md,
 * Sekcja B). Wzór `VA = P / cos φ` 1:1 ze źródła.
 */
export function calculateMocPozornaCosfi(input: MocPozornaCosfiInput): CalcResult<MocPozornaCosfiResult> {
  const { errors } = validateInput(input)
  const pustyWynik: MocPozornaCosfiResult = { mocPozornaVA: 0 }
  const inputs = { mocCzynnaW: input.mocCzynnaW, cosFi: input.cosFi }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "VA",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.mocCzynnaW === 0 || input.cosFi === 0) {
    return {
      value: pustyWynik,
      unit: "VA",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const mocPozornaVA = input.mocCzynnaW / input.cosFi

  return {
    value: { mocPozornaVA },
    unit: "VA",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [mocPozornaInfo(mocPozornaVA, input.mocCzynnaW)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
