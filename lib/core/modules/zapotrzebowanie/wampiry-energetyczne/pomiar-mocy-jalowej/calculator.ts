import type { CalcResult } from "@/lib/core/calc-result"
import type { PomiarMocyJalowejInput } from "./input"
import { DNI_W_ROKU, GODZIN_W_DOBIE } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{doba} = \\dfrac{P_{suma} \\times 24}{1000}; \\quad E_{rok} = E_{doba} \\times 365"

export type PomiarMocyJalowejResult = {
  sumaW: number
  energiaDobowaKwh: number
  energiaRocznaKwh: number
}

/**
 * Moduł zbiorczy "Wampiry energetyczne", podzakładka 2: Pomiar. Domyka dawne 1.30 + 1.38 —
 * suma ręcznie zmierzonych mocy jałowych. Przykład źródła (1.38: 8 W ciągle → 70 kWh rocznie)
 * odtworzony dokładnie (8×24×365/1000 = 70,08 ≈ 70). Ten sam wzór co podzakładka Katalog —
 * echo z `katalog-urzadzen/constants.ts`, nie duplikat stałych.
 */
export function calculatePomiarMocyJalowej(input: PomiarMocyJalowejInput): CalcResult<PomiarMocyJalowejResult> {
  const { errors, warnings } = validateInput(input)
  const inputs = Object.fromEntries(input.pozycje.map((p, i) => [p.nazwa || `pozycja-${i}`, p.mocJalowaW]))
  const pustyWynik: PomiarMocyJalowejResult = { sumaW: 0, energiaDobowaKwh: 0, energiaRocznaKwh: 0 }

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

  if (input.pozycje.length === 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const sumaW = input.pozycje.reduce((sum, p) => sum + p.mocJalowaW, 0)
  const energiaDobowaKwh = (sumaW * GODZIN_W_DOBIE) / 1000
  const energiaRocznaKwh = energiaDobowaKwh * DNI_W_ROKU

  return {
    value: { sumaW, energiaDobowaKwh, energiaRocznaKwh },
    unit: "W",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
