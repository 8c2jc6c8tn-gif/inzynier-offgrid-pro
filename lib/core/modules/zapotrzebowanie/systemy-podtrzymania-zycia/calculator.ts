import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { SurvivalCoreInput } from "./input"
import { DEFAULT_CRITICAL_LOADS } from "./constants"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "P_{bazowe} = \\sum_{i \\in zaznaczone} P_i"

/**
 * Ekran 1, Moduł 2 — "Systemy podtrzymania życia (Survival Core)" (dawne 1.1).
 * Suma mocy zaznaczonych odbiorników krytycznych — łączne zapotrzebowanie bazowe,
 * które musi być zasilane zawsze (priorytet 1, nigdy nie odłączane).
 */
export function calculateSurvivalCore(input: SurvivalCoreInput): CalcResult<number> {
  const { errors, warnings } = validateInput(input)
  const selected = input.items.filter((item) => item.selected)
  const inputs = Object.fromEntries(selected.map((item) => [item.id, item.powerW]))

  if (errors.length > 0) {
    return {
      value: 0,
      unit: "",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (selected.length === 0) {
    return {
      value: 0,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = selected.reduce((sum, item) => sum + item.powerW, 0)

  const assumptions: Assumption[] = selected
    .filter((item) => {
      const def = DEFAULT_CRITICAL_LOADS.find((d) => d.id === item.id)
      return def?.defaultPowerW !== null && def?.defaultPowerW === item.powerW
    })
    .map((item) => ({ kod: "POZYCJA-WARTOSC-DOMYSLNA", params: { label: item.label, value: item.powerW } }))

  return {
    value,
    unit: "W",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
