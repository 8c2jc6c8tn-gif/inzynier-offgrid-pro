import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { SlabeOgniwoInput } from "./input"
import { validateInput } from "./validation"
import { pojemnoscOgraniczonaNajslabszym } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type SlabeOgniwoResult = {
  pojemnoscNajslabszegoAh: number
  utrataPct: number
}

const FORMULA = "C_{najslabszy} = C_{znamionowa} \\times (1 - tolerancja)"

/**
 * Ekran 8, Moduł 4 "Magazyn energii / baterie" — "Symulacja Słabego Ogniwa (Cell Drift &
 * Balancing)" (dawne 3.8, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). "Użyteczna
 * pojemność pakietu = pojemność najsłabszego ogniwa" 1:1 ze źródła — w połączeniu szeregowym
 * cały pakiet jest ograniczony najsłabszym ogniwem, niezależnie od liczby ogniw w szeregu.
 */
export function calculateSlabeOgniwo(input: SlabeOgniwoInput): CalcResult<SlabeOgniwoResult> {
  const { errors } = validateInput(input)
  const pustyWynik: SlabeOgniwoResult = { pojemnoscNajslabszegoAh: 0, utrataPct: 0 }
  const inputs = {
    pojemnoscZnamionowaAh: input.pojemnoscZnamionowaAh,
    tolerancjaPct: input.tolerancjaPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "Ah",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pojemnoscZnamionowaAh === 0 || input.tolerancjaPct === 0) {
    return {
      value: pustyWynik,
      unit: "Ah",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const utrataPct = input.tolerancjaPct
  const pojemnoscNajslabszegoAh = input.pojemnoscZnamionowaAh * (1 - utrataPct / 100)

  return {
    value: { pojemnoscNajslabszegoAh, utrataPct },
    unit: "Ah",
    status: "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "NAJGORSZY-PRZYPADEK-TOLERANCJA" }] satisfies Assumption[],
    warnings: [pojemnoscOgraniczonaNajslabszym(utrataPct)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
