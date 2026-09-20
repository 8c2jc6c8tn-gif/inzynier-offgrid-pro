import type { CalcResult } from "@/lib/core/calc-result"
import type { ScenariuszAutomatyzacjiInput } from "./input"
import { GODZIN_W_DOBIE } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/katalog-urzadzen/constants"
import { validateScenariuszAutomatyzacji } from "./validation"
import { redukcjaNiepozytywna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{doba} = \\dfrac{(P_{ref} - P_{scenariusz}) \\times 24}{1000}"

export type ScenariuszAutomatyzacjiResult = {
  redukcjaW: number
  redukcjaDobowaKwh: number
}

/**
 * Dawne 1.34 ("Automatyzacja: tryb czuwania domowego") + 1.40 ("Tryb nieobecności — automatyczne
 * odłączenie zbędnych obwodów") + 1.48-scenariusze ("praca z domu"/"weekend"/"urlop") — generyczny
 * silnik "standby referencyjny vs standby w wybranym scenariuszu", nie 4 kopie tego samego
 * liczenia (echo z `katalog-urzadzen/constants.ts` dla GODZIN_W_DOBIE). Przykład źródła 1.34
 * ("nocny tryb czuwania: 15 W zamiast 45 W → 0,72 kWh na dobę") odtworzony dokładnie:
 * (45-15)×24/1000 = 0,72.
 */
export function calculateScenariuszAutomatyzacji(
  input: ScenariuszAutomatyzacjiInput,
): CalcResult<ScenariuszAutomatyzacjiResult> {
  const { errors } = validateScenariuszAutomatyzacji(input)
  const inputs = {
    standbyReferencyjnyW: input.standbyReferencyjnyW,
    standbyWScenariuszuW: input.standbyWScenariuszuW,
  }
  const pustyWynik: ScenariuszAutomatyzacjiResult = { redukcjaW: 0, redukcjaDobowaKwh: 0 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const redukcjaW = input.standbyReferencyjnyW - input.standbyWScenariuszuW
  const redukcjaDobowaKwh = (redukcjaW * GODZIN_W_DOBIE) / 1000

  const warnings = redukcjaW <= 0 ? [redukcjaNiepozytywna()] : []

  return {
    value: { redukcjaW, redukcjaDobowaKwh },
    unit: "kWh/dobę",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
