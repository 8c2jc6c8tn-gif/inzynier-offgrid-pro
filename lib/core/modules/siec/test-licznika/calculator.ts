import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { TestLicznikaInput } from "./input"
import { validateInput } from "./validation"
import { roznicaBezWerdyktu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const SEKUND_W_GODZINIE = 3600

export type TestLicznikaResult = {
  /** Power recorded by the meter [kW]. */
  mocZLicznikaKw: number
  /** (meter − load) / load [%]; null without a known load. */
  roznicaProcent: number | null
}

const FORMULA = "P = \\frac{3600 \\cdot n}{t \\cdot C}\\ [kW]"

/** Echo-ready: power recorded by the meter from n pulses in t seconds. */
export function obliczMocZDiodyKw(n: number, tS: number, stalaImpKwh: number): number {
  return (SEKUND_W_GODZINIE * n) / (tS * stalaImpKwh)
}

export function calculateTestLicznika(input: TestLicznikaInput): CalcResult<TestLicznikaResult> {
  const pusty = { mocZLicznikaKw: 0, roznicaProcent: null }
  const inputs = { liczbaImpulsow: input.liczbaImpulsow, czasS: input.czasS, stalaImpKwh: input.stalaImpKwh }
  const base = { unit: "kW", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.liczbaImpulsow === 0 || input.czasS === 0 || input.stalaImpKwh === 0) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const mocZLicznikaKw = obliczMocZDiodyKw(input.liczbaImpulsow, input.czasS, input.stalaImpKwh)
  const warnings: Warning[] = []
  let roznicaProcent: number | null = null
  if (input.mocOdbiornikaW !== null && input.mocOdbiornikaW > 0) {
    const odbiornikKw = input.mocOdbiornikaW / 1000
    roznicaProcent = ((mocZLicznikaKw - odbiornikKw) / odbiornikKw) * 100
    warnings.push(roznicaBezWerdyktu())
  }
  return {
    ...base,
    value: { mocZLicznikaKw, roznicaProcent },
    status: "VALID",
    assumptions: [{ kod: "SIEC-LICZNIK-ZALOZENIE-JEDEN-ODBIORNIK" }],
    warnings,
  }
}
