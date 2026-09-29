import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { brakDanych } from "../rachunek-za-prad/warnings"
import type { KosztPowrotuInput } from "./input"
import { validateInput } from "./validation"
import { nieodwracalne, wycenaIndywidualna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type KosztPowrotuResult = {
  /** Estimated connection fee [zł netto]; null when the DSO prices individually or data is missing. */
  kosztNettoZl: number | null
  wycenaIndywidualna: boolean
}

const FORMULA = "K_{powrót} \\approx s_{OSD}\\,[zł/kW] \\cdot P_{przył}\\,[kW]"

export function calculateKosztPowrotu(input: KosztPowrotuInput): CalcResult<KosztPowrotuResult> {
  const inputs = { stawkaZlKw: input.stawkaZlKw ?? 0, mocPrzylaczeniowaKw: input.mocPrzylaczeniowaKw }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const pusty: KosztPowrotuResult = { kosztNettoZl: null, wycenaIndywidualna: false }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const warnings: Warning[] = [nieodwracalne()]
  const assumptions = [{ kod: "SIEC-POWROT-ZALOZENIE-GRUPY" }, { kod: "SIEC-POWROT-ZALOZENIE-CZAS" }]
  if (input.odlegloscStandardowa === false) {
    return {
      ...base,
      value: { kosztNettoZl: null, wycenaIndywidualna: true },
      status: "VALID_WITH_WARNINGS",
      assumptions,
      warnings: [...warnings, wycenaIndywidualna()],
    }
  }
  const brak: Warning[] = []
  if (input.mocPrzylaczeniowaKw === 0) brak.push(brakDanych("mocPrzylaczeniowa"))
  if (input.stawkaZlKw === null) brak.push(brakDanych("stawkaPrzylaczeniowa"))
  if (input.odlegloscStandardowa === null) brak.push(brakDanych("odleglosc"))
  if (brak.length > 0) return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: brak }

  return {
    ...base,
    value: { kosztNettoZl: (input.stawkaZlKw as number) * input.mocPrzylaczeniowaKw, wycenaIndywidualna: false },
    status: "VALID_WITH_WARNINGS",
    assumptions,
    warnings,
  }
}
