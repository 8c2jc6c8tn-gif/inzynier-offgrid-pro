import type { CalcResult } from "@/lib/core/calc-result"
import type { BuforRozbudowyInput } from "./input"
import { validateInput } from "./validation"
import { buforInfo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type BuforRozbudowyResult = {
  zapotrzebowanieZBuforemKwh: number
  dodatekKwh: number
}

const FORMULA = "E_{z\\ buforem} = E_{całkowite} \\times (1 + bufor\\%)"

/**
 * Ekran 13, Moduł 2 "Zapotrzebowanie energetyczne" — "Bufor na rozbudowę" (dawne 1.25,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzór 1:1 ze źródła — bufor jako prosty
 * mnożnik procentowy na sumie zapotrzebowania, wartości suwaka (0/10/20/30%) 1:1 ze źródła.
 */
export function calculateBuforRozbudowy(input: BuforRozbudowyInput): CalcResult<BuforRozbudowyResult> {
  const { errors } = validateInput(input)
  const pustyWynik: BuforRozbudowyResult = { zapotrzebowanieZBuforemKwh: 0, dodatekKwh: 0 }
  const inputs = {
    zapotrzebowanieCalkowiteKwh: input.zapotrzebowanieCalkowiteKwh,
    buforPct: input.buforPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.zapotrzebowanieCalkowiteKwh === 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zapotrzebowanieZBuforemKwh = input.zapotrzebowanieCalkowiteKwh * (1 + input.buforPct / 100)
  const dodatekKwh = zapotrzebowanieZBuforemKwh - input.zapotrzebowanieCalkowiteKwh

  return {
    value: { zapotrzebowanieZBuforemKwh, dodatekKwh },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [buforInfo(input.buforPct, dodatekKwh)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
