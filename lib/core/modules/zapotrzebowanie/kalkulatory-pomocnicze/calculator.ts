import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { KalkulatoryPomocniczeInput } from "./input"
import { EFFICIENCY_DEFAULT } from "./constants"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

function buildInvalid(
  inputs: Record<string, number>,
  formula: string,
  errors: Warning[],
): CalcResult<number> {
  return {
    value: 0,
    unit: "",
    status: "INVALID_INPUT",
    formula,
    inputs,
    assumptions: [],
    warnings: errors,
    calculatorVersion: CALCULATOR_VERSION,
  }
}

/**
 * Ekran 16, Moduł 2 — "Kalkulatory pomocnicze" (dawne 1.22, 1.23).
 * Trzy tryby: W→A, Ah↔Wh, szacowany czas pracy z baterii. Wzór referencyjny
 * (docs/standards/03-jadro-obliczeniowe.md): I = P / (V × η).
 */
export function calculateKalkulatoryPomocnicze(
  input: KalkulatoryPomocniczeInput,
): CalcResult<number> {
  const { errors, warnings } = validateInput(input)

  switch (input.mode) {
    case "watt-to-amp": {
      const formula = "I = P / (V \\cdot \\eta)"
      const inputs = { powerW: input.powerW, voltageV: input.voltageV }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      const efficiency = input.efficiency ?? EFFICIENCY_DEFAULT
      const assumptions =
        input.efficiency === undefined
          ? [`Sprawność układu przyjęta jako ${efficiency} (wartość domyślna, nie zmierzona).`]
          : []
      const value = input.powerW / (input.voltageV * efficiency)

      return {
        value,
        unit: "A",
        status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
        formula,
        inputs: { ...inputs, efficiency },
        assumptions,
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    case "ah-to-wh": {
      const formula = "E_{Wh} = C_{Ah} \\cdot V"
      const inputs = { capacityAh: input.capacityAh, voltageV: input.voltageV }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      const value = input.capacityAh * input.voltageV
      return {
        value,
        unit: "Wh",
        status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
        formula,
        inputs,
        assumptions: [],
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    case "wh-to-ah": {
      const formula = "C_{Ah} = E_{Wh} / V"
      const inputs = { energyWh: input.energyWh, voltageV: input.voltageV }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      const value = input.energyWh / input.voltageV
      return {
        value,
        unit: "Ah",
        status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
        formula,
        inputs,
        assumptions: [],
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    case "runtime": {
      const formula = "t = (C_{Ah} \\cdot V \\cdot \\eta) / P"
      const inputs = {
        capacityAh: input.capacityAh,
        voltageV: input.voltageV,
        powerW: input.powerW,
      }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      const efficiency = input.efficiency ?? EFFICIENCY_DEFAULT
      const assumptions =
        input.efficiency === undefined
          ? [`Sprawność układu przyjęta jako ${efficiency} (wartość domyślna, nie zmierzona).`]
          : []
      const value = (input.capacityAh * input.voltageV * efficiency) / input.powerW

      return {
        value,
        unit: "h",
        status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
        formula,
        inputs: { ...inputs, efficiency },
        assumptions,
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }
  }
}
