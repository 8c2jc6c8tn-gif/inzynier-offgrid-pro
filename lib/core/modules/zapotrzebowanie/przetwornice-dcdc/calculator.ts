import type { CalcResult } from "@/lib/core/calc-result"
import type { PrzetworniceDcdcInput } from "./input"
import { validateInput } from "./validation"
import { strataNaKonwersji, zasilanieBezposrednieInfo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type PrzetworniceDcdcResult = {
  zapotrzebowanieRealneW: number
  strataW: number
  strataPct: number
}

const FORMULA = "P_{realne} = P_{urządzenia} / \\eta_{przetwornicy}"

/**
 * Ekran 11, Moduł 2 "Zapotrzebowanie energetyczne" — "Przetwornice DC/DC" (dawne 1.17,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Przykład źródła ("sprawność
 * ~92% → traci 8% energii") zweryfikowany niezależnie: strata jako % mocy realnie pobranej
 * (nie znamionowej urządzenia) wynosi dokładnie `1 - sprawność`, więc "8%" ze źródła to po
 * prostu dopełnienie sprawności do 100%, nie osobno liczona wartość.
 */
export function calculatePrzetworniceDcdc(input: PrzetworniceDcdcInput): CalcResult<PrzetworniceDcdcResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PrzetworniceDcdcResult = { zapotrzebowanieRealneW: 0, strataW: 0, strataPct: 0 }
  const inputs = {
    zapotrzebowanieUrzadzeniaW: input.zapotrzebowanieUrzadzeniaW,
    sprawnoscPrzetwornicyPct: input.sprawnoscPrzetwornicyPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.zapotrzebowanieUrzadzeniaW === 0 ||
    (!input.zasilanieBezposrednie && input.sprawnoscPrzetwornicyPct === 0)

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.zasilanieBezposrednie) {
    return {
      value: { zapotrzebowanieRealneW: input.zapotrzebowanieUrzadzeniaW, strataW: 0, strataPct: 0 },
      unit: "W",
      status: "VALID",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [zasilanieBezposrednieInfo()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zapotrzebowanieRealneW = input.zapotrzebowanieUrzadzeniaW / (input.sprawnoscPrzetwornicyPct / 100)
  const strataW = zapotrzebowanieRealneW - input.zapotrzebowanieUrzadzeniaW
  const strataPct = 100 - input.sprawnoscPrzetwornicyPct

  return {
    value: { zapotrzebowanieRealneW, strataW, strataPct },
    unit: "W",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [strataNaKonwersji(strataPct, strataW)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
