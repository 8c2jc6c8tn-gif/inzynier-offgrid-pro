import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { obliczPojemnoscUzytecznaKwh } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import type { DniAutonomiiInput } from "./input"
import { validateInput } from "./validation"
import { wplywNaMagazyn } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type DniAutonomiiResult = {
  dniAutonomii: number
  /** Szacunkowa pojemność użyteczna magazynu [kWh] — tylko gdy podano wszystkie trzy opcjonalne pola. null = nie policzono. */
  pojemnoscUzytecznaSzacowanaKwh: number | null
}

const FORMULA = "d_{autonomii} \\; (opcjonalnie: C_{uzyteczna} = E_{dobowe} \\times d_{autonomii} / (\\eta \\times DoD))"

/**
 * Ekran 7, Moduł 2 "Zapotrzebowanie energetyczne" — "Dni autonomii" (dawne 1.9,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D-lite. Wartość główna to sam
 * wybór dni autonomii (docelowo auto-zasila Moduł 4/Ekran 1). Szacunek wpływu na wielkość
 * magazynu **wzorzec "echo"** — reużywa `obliczPojemnoscUzytecznaKwh` z Moduł 4/Ekran 1
 * zamiast duplikować wzór.
 */
export function calculateDniAutonomii(input: DniAutonomiiInput): CalcResult<DniAutonomiiResult> {
  const { errors } = validateInput(input)
  const pustyWynik: DniAutonomiiResult = { dniAutonomii: 0, pojemnoscUzytecznaSzacowanaKwh: null }
  const inputs = {
    dniAutonomii: input.dniAutonomii,
    zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct,
    dodPct: input.dodPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "dni",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-DNI-AUTONOMII",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.dniAutonomii === 0) {
    return {
      value: pustyWynik,
      unit: "dni",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-DNI-AUTONOMII",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const maDanePodMagazyn =
    input.zapotrzebowanieDoboweKwh > 0 && input.sprawnoscFalownikaPct > 0 && input.dodPct > 0

  const pojemnoscUzytecznaSzacowanaKwh = maDanePodMagazyn
    ? obliczPojemnoscUzytecznaKwh(
        input.zapotrzebowanieDoboweKwh,
        input.dniAutonomii,
        input.sprawnoscFalownikaPct,
        input.dodPct,
      )
    : null

  return {
    value: { dniAutonomii: input.dniAutonomii, pojemnoscUzytecznaSzacowanaKwh },
    unit: "dni",
    status: "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-DNI-AUTONOMII",
    inputs,
    assumptions: (maDanePodMagazyn
      ? []
      : [{ kod: "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH" }]) satisfies Assumption[],
    warnings:
      pojemnoscUzytecznaSzacowanaKwh !== null
        ? [wplywNaMagazyn(input.dniAutonomii, pojemnoscUzytecznaSzacowanaKwh)]
        : [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
