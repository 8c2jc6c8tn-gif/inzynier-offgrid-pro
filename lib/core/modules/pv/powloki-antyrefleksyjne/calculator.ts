import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { PowlokiAntyrefleksyjneInput } from "./input"
import { validateInput } from "./validation"
import { czyszczeniePowloki } from "./warnings"
import { WZROST_UZYSKU_MAX_PCT, WZROST_UZYSKU_MIN_PCT } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PowlokiAntyrefleksyjneResult = {
  /** Dodatkowy uzysk roczny — dolna granica zakresu źródła [kWh/rok]. */
  zyskMinKwh: number
  /** Dodatkowy uzysk roczny — górna granica zakresu źródła [kWh/rok]. */
  zyskMaxKwh: number
}

const FORMULA = `\\Delta E \\in \\left[ E \\times ${WZROST_UZYSKU_MIN_PCT}\\%,\\; E \\times ${WZROST_UZYSKU_MAX_PCT}\\% \\right]`

/**
 * Ekran 23, Moduł 3 — "Powłoki antyrefleksyjne" (dawne 2.39). Przelicza zakres procentowy ze
 * źródła na przedział kWh dla uzysku użytkownika — prosta proporcja, bez modelu optycznego
 * (źródło nie podaje zależności od kąta padania ani rodzaju szkła).
 */
export function calculatePowlokiAntyrefleksyjne(
  input: PowlokiAntyrefleksyjneInput,
): CalcResult<PowlokiAntyrefleksyjneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PowlokiAntyrefleksyjneResult = { zyskMinKwh: 0, zyskMaxKwh: 0 }
  const inputs = { rocznyUzyskKwh: input.rocznyUzyskKwh }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/rok",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.rocznyUzyskKwh === 0) {
    return {
      value: pustyWynik,
      unit: "kWh/rok",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value: {
      zyskMinKwh: (input.rocznyUzyskKwh * WZROST_UZYSKU_MIN_PCT) / 100,
      zyskMaxKwh: (input.rocznyUzyskKwh * WZROST_UZYSKU_MAX_PCT) / 100,
    },
    unit: "kWh/rok",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "POWLOKA-AR-ZAKRES-ZE-ZRODLA", params: { min: WZROST_UZYSKU_MIN_PCT, max: WZROST_UZYSKU_MAX_PCT } },
    ] satisfies Assumption[],
    warnings: [czyszczeniePowloki()],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
