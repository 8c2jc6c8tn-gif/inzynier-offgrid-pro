import type { CalcResult } from "@/lib/core/calc-result"
import type { ChlodzenieLatemInput } from "./input"
import { validateInput } from "./validation"
import { ponizejZakresu, powyzejZakresu, wZakresie } from "./warnings"
import { ZAKRES_PRACY_MAX_C, ZAKRES_PRACY_MIN_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type ChlodzenieLatemResult = {
  temperaturaOgniwC: number
  wZakresie: boolean
}

/**
 * Ekran 27, Moduł 4 "Magazyn energii / baterie" — "Chłodzenie baterii latem" (dawne 3.30,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Sprawdzenie temperatury ogniw
 * względem dopuszczalnego zakresu pracy 1:1 ze źródła — bez liczenia wielkości przyspieszenia
 * degradacji (źródło nie podaje wzoru, tylko ilustracyjny przykład "+30%").
 */
export function calculateChlodzenieLatem(input: ChlodzenieLatemInput): CalcResult<ChlodzenieLatemResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ChlodzenieLatemResult = { temperaturaOgniwC: 0, wZakresie: false }
  const inputs = { temperaturaOgniwC: input.temperaturaOgniwC ?? 0 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.temperaturaOgniwC === null) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaOgniwC = input.temperaturaOgniwC
  const wZakresieValue = temperaturaOgniwC >= ZAKRES_PRACY_MIN_C && temperaturaOgniwC <= ZAKRES_PRACY_MAX_C

  const warning =
    temperaturaOgniwC > ZAKRES_PRACY_MAX_C
      ? powyzejZakresu(temperaturaOgniwC)
      : temperaturaOgniwC < ZAKRES_PRACY_MIN_C
        ? ponizejZakresu(temperaturaOgniwC)
        : wZakresie(temperaturaOgniwC)

  return {
    value: { temperaturaOgniwC, wZakresie: wZakresieValue },
    unit: "°C",
    status: wZakresieValue ? "VALID" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs,
    assumptions: [],
    warnings: [warning],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
