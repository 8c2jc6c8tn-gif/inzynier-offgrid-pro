import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { CzasBalansowaniaInput } from "./input"
import { walidujWejscie } from "./validation"
import { brakOkna, wieleDni } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type CzasBalansowaniaResult = {
  /** Charge to move out of the fullest cell: Q · mismatch / 100, Ah. */
  ahDoPrzeniesienia: number
  /** Balancer run time: Ah / A, h. */
  czasPracyH: number
  /** Days of the window above the start voltage needed: run time / window; null when the window is not entered. */
  dniOkna: number | null
}

const PUSTY: CzasBalansowaniaResult = { ahDoPrzeniesienia: 0, czasPracyH: 0, dniOkna: null }

const FORMULA = "t = \\frac{Q \\cdot r / 100}{I_{bal}};\\quad n_{dni} = \\frac{t}{t_{okno}}"

const zaokr2 = (x: number) => Math.round(x * 100) / 100

/**
 * Module 4 — "Czas balansowania". Charge to move out of the fullest cell (capacity × mismatch) divided by the
 * balancer current gives the balancer run time; divided by the daily window above the balance start voltage it
 * gives the number of days. Ideal model: constant current, constant mismatch, the single most mismatched cell.
 */
export function calculateCzasBalansowania(input: CzasBalansowaniaInput): CalcResult<CzasBalansowaniaResult> {
  const baza = {
    unit: "h",
    formula: FORMULA,
    inputs: {
      pojemnoscAh: input.pojemnoscAh,
      rozjazdProc: input.rozjazdProc,
      pradBalanseraA: input.pradBalanseraA,
      oknoGodzinDobe: input.oknoGodzinDobe,
    },
    calculatorVersion: CALCULATOR_VERSION,
  }

  const bledy = walidujWejscie(input)
  if (bledy.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: bledy }
  if (input.pojemnoscAh === 0 || input.rozjazdProc === 0 || input.pradBalanseraA === 0)
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const ah = (input.pojemnoscAh * input.rozjazdProc) / 100
  const czas = ah / input.pradBalanseraA
  const dni = input.oknoGodzinDobe > 0 ? czas / input.oknoGodzinDobe : null
  const warnings = []
  if (dni === null) warnings.push(brakOkna())
  else if (dni > 1) warnings.push(wieleDni(zaokr2(dni), input.oknoGodzinDobe))

  return {
    ...baza,
    value: { ahDoPrzeniesienia: zaokr2(ah), czasPracyH: zaokr2(czas), dniOkna: dni === null ? null : zaokr2(dni) },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [
      { kod: "CB-Z-STALY-PRAD" },
      { kod: "CB-Z-STALY-ROZJAZD" },
      { kod: "CB-Z-NAJWIEKSZE-OGNIWO" },
    ] satisfies Assumption[],
    warnings,
  }
}
