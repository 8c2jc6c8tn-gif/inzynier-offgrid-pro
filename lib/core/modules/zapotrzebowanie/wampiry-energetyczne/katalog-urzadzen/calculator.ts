import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { KatalogUrzadzenInput } from "./input"
import { DNI_W_ROKU, GODZIN_W_DOBIE, KATALOG_URZADZEN_STANDBY } from "./constants"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{doba} = \\dfrac{P_{suma} \\times 24}{1000}; \\quad E_{rok} = E_{doba} \\times 365"

export type KatalogUrzadzenResult = {
  sumaW: number
  energiaDobowaKwh: number
  energiaRocznaKwh: number
}

/**
 * Moduł zbiorczy "Wampiry energetyczne" (dawne 1.24, 1.28–1.50), podzakładka 1: Katalog urządzeń.
 * Domyka dawne 1.24 — suma poboru standby zaznaczonych urządzeń + przeliczenie na kWh/dobę i
 * kWh/rok. Wzór i przykład źródła (45 W → 1,08 kWh/dobę → 394 kWh rocznie) odtworzony dokładnie.
 */
export function calculateKatalogUrzadzen(input: KatalogUrzadzenInput): CalcResult<KatalogUrzadzenResult> {
  const { errors, warnings } = validateInput(input)
  const selected = input.items.filter((item) => item.selected)
  const inputs = Object.fromEntries(selected.map((item) => [item.id, item.powerW]))
  const pustyWynik: KatalogUrzadzenResult = { sumaW: 0, energiaDobowaKwh: 0, energiaRocznaKwh: 0 }

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

  if (selected.length === 0) {
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

  const sumaW = selected.reduce((sum, item) => sum + item.powerW, 0)
  const energiaDobowaKwh = (sumaW * GODZIN_W_DOBIE) / 1000
  const energiaRocznaKwh = energiaDobowaKwh * DNI_W_ROKU

  const assumptions: Assumption[] = selected
    .filter((item) => {
      const def = KATALOG_URZADZEN_STANDBY.find((d) => d.id === item.id)
      return def !== undefined && def.defaultPowerW === item.powerW
    })
    .map((item) => ({ kod: "WAMPIR-POZYCJA-WARTOSC-DOMYSLNA", params: { label: item.label, value: item.powerW } }))

  return {
    value: { sumaW, energiaDobowaKwh, energiaRocznaKwh },
    unit: "W",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
