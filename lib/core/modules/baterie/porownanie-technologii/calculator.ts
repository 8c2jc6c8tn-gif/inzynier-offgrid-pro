import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { PorownanieTechnologiiInput } from "./input"
import { BATTERY_TECHNOLOGIES, type BatteryTechnology, POJEMNOSC_BASELINE_KWH } from "./constants"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type TechnologyComparisonRow = BatteryTechnology & {
  /** Energia oddana w całym cyklu życia magazynu tej technologii [kWh]. */
  energiaCalkowitaKwh: number
}

const FORMULA = "E_{całkowita} = pojemność \\times cykle \\times DoD"

/**
 * Ekran 30, Moduł 4 — "Porównanie technologii magazynów" (dawne 3.34,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec B: cena zakupu to nie to
 * samo co koszt w całym cyklu życia — dlatego liczymy energię całkowitą, nie tylko
 * pojemność nominalną.
 */
export function calculatePorownanieTechnologii(
  input: PorownanieTechnologiiInput,
): CalcResult<TechnologyComparisonRow[]> {
  const { errors, warnings } = validateInput(input)
  const inputs = { pojemnoscKwh: input.pojemnoscKwh ?? 0 }

  if (errors.length > 0) {
    return {
      value: [],
      unit: "kWh (energia oddana w całym cyklu życia)",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-POROWNANIE-TECHNOLOGII",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pojemnoscKwh = input.pojemnoscKwh ?? POJEMNOSC_BASELINE_KWH
  const assumptions: Assumption[] = []
  if (input.pojemnoscKwh === undefined) {
    assumptions.push({ kod: "PORTECH-ZALOZENIE-BASELINE", params: { pojemnosc: POJEMNOSC_BASELINE_KWH } })
  }
  assumptions.push({ kod: "PORTECH-ZALOZENIE-SRODEK-CYKLI" })

  const value: TechnologyComparisonRow[] = BATTERY_TECHNOLOGIES.map((tech) => ({
    ...tech,
    energiaCalkowitaKwh: pojemnoscKwh * tech.cyklePrzyDodReprezentatywne * tech.dod,
  }))

  const status: CalcResult<TechnologyComparisonRow[]>["status"] =
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID"

  return {
    value,
    unit: "kWh (energia oddana w całym cyklu życia)",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-POROWNANIE-TECHNOLOGII",
    inputs: { pojemnoscKwh },
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
