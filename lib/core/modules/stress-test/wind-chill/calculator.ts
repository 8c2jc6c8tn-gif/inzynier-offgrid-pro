import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { WindChillInput } from "./input"
import { validateInput } from "./validation"
import { pozaZakresemWzoru } from "./warnings"
import { WIND_CHILL_MAX_TEMP_C, WIND_CHILL_MIN_PREDKOSC_KMH } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WindChillResult = {
  temperaturaOdczuwalnaC: number
}

const FORMULA =
  "WC = 13{,}12 + 0{,}6215T - 11{,}37V^{0{,}16} + 0{,}3965TV^{0{,}16}"

/**
 * Moduł 7 "Stress-test zimowy" — "Wind Chill" (dawne 6.26→7.24,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md, Ekran 17). Wzór NWS/Environment Canada
 * (2001), metryczny — źródło projektu nie podaje wzoru, tylko opis zjawiska i jeden
 * ilustracyjny przykład, który wzór odtwarza z dokładnością do 0,8°C (-10°C/40km/h → -20,8°C
 * wg wzoru vs "-20°C" ze źródła), zweryfikowane niezależnie przed implementacją.
 *
 * Świadomie NIE liczony: wpływ na zapotrzebowanie na ciepło ("+35% strat, +2 kWh/dobę" z
 * przykładu źródła) — źródło nie podaje wzoru wiążącego deltę wind chill z procentowym
 * wzrostem strat ciepła budynku (wymagałoby modelu termicznego z Modułu 6), tylko jeden
 * ilustracyjny przykład. Ten ekran liczy WYŁĄCZNIE temperaturę odczuwalną.
 */
export function calculateWindChill(input: WindChillInput): CalcResult<WindChillResult> {
  const { errors } = validateInput(input)
  const pustyWynik: WindChillResult = { temperaturaOdczuwalnaC: 0 }
  const inputs = {
    temperaturaC: input.temperaturaC ?? 0,
    predkoscWiatruKmh: input.predkoscWiatruKmh,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.temperaturaC === null || input.predkoscWiatruKmh === 0) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const { temperaturaC, predkoscWiatruKmh } = input

  if (temperaturaC > WIND_CHILL_MAX_TEMP_C || predkoscWiatruKmh <= WIND_CHILL_MIN_PREDKOSC_KMH) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [pozaZakresemWzoru(temperaturaC, predkoscWiatruKmh)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const vPow = Math.pow(predkoscWiatruKmh, 0.16)
  const temperaturaOdczuwalnaC =
    13.12 + 0.6215 * temperaturaC - 11.37 * vPow + 0.3965 * temperaturaC * vPow

  return {
    value: { temperaturaOdczuwalnaC },
    unit: "°C",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "WIND-CHILL-WZOR-NWS" }] satisfies Assumption[],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
