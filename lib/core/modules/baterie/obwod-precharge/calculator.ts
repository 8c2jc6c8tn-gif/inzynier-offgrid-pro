import type { CalcResult } from "@/lib/core/calc-result"
import type { ObwodPrechargeInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type ObwodPrechargeResult = {
  czasPreChargeS: number
}

export const FORMULA_PRECHARGE = "T = 5 \\cdot R_{pre} \\cdot C"

/**
 * Wzór kanoniczny 1:1 ze źródła (Ekran 7, Moduł 4, Sekcja B) — czas pre-charge kondensatorów
 * wejściowych falownika przez rezystor wstępny. Funkcja czysta, bez wrappera CalcResult, żeby
 * inne ekrany (np. M11/A4 `podlaczenie-bms`) mogły ją re-używać bez przejmowania statusu/
 * walidacji tego konkretnego ekranu (wzorzec "echo", docs/standards/01-architektura.md, 1.3).
 * Zweryfikowane dwukrotnie niezależnie przed refaktorem: R=50Ω, C=2200µF -> 5×50×0,0022=0,55s
 * (test istniejący w podlaczenie-bms); R=50Ω, C=10000µF -> 5×50×0,01=2,5s.
 */
export function obliczCzasPreChargeS(rezystancjaOhm: number, pojemnoscUf: number): number {
  const pojemnoscF = pojemnoscUf * 1e-6
  return Math.round(5 * rezystancjaOhm * pojemnoscF * 1000) / 1000
}

/**
 * Ekran 7, Moduł 4 — "Obwód Pre-Charge" (dawne 3.7,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Ta sama treść fizyczna, którą Ekran A4 Modułu 11
 * opisuje w kontekście procedury montażu — tu jako samodzielny ekran D, bez checklisty.
 */
export function calculateObwodPrecharge(input: ObwodPrechargeInput): CalcResult<ObwodPrechargeResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ObwodPrechargeResult = { czasPreChargeS: 0 }
  const inputs = {
    pojemnoscFalownikaUf: input.pojemnoscFalownikaUf,
    rezystancjaPreChargeOhm: input.rezystancjaPreChargeOhm,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "s",
      status: "INVALID_INPUT",
      formula: FORMULA_PRECHARGE,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pojemnoscFalownikaUf === 0 || input.rezystancjaPreChargeOhm === 0) {
    return {
      value: pustyWynik,
      unit: "s",
      status: "INCOMPLETE",
      formula: FORMULA_PRECHARGE,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const czasPreChargeS = obliczCzasPreChargeS(input.rezystancjaPreChargeOhm, input.pojemnoscFalownikaUf)

  return {
    value: { czasPreChargeS },
    unit: "s",
    status: "VALID",
    formula: FORMULA_PRECHARGE,
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
