import type { CalcResult } from "@/lib/core/calc-result"
import type { PoborWlasnyFalownikaInput } from "./input"
import { validateInput } from "./validation"
import { stalyKosztBilansu } from "./warnings"
import { GODZIN_W_DOBIE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PoborWlasnyFalownikaResult = {
  strataDobowaKwh: number
}

const FORMULA = "E_{doba} = P_{jałowy} \\times 24 / 1000"

/**
 * Ekran 9, Moduł 2 "Zapotrzebowanie energetyczne" — "Pobór własny falownika" (dawne 1.12,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła — przykład
 * źródła (45W → 1,08 kWh/dobę) zweryfikowany niezależnie przed implementacją.
 */
export function calculatePoborWlasnyFalownika(
  input: PoborWlasnyFalownikaInput,
): CalcResult<PoborWlasnyFalownikaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PoborWlasnyFalownikaResult = { strataDobowaKwh: 0 }
  const inputs = { poborJalowyW: input.poborJalowyW }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.poborJalowyW === 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const strataDobowaKwh = (input.poborJalowyW * GODZIN_W_DOBIE) / 1000

  return {
    value: { strataDobowaKwh },
    unit: "kWh/dobę",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [stalyKosztBilansu(strataDobowaKwh)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
