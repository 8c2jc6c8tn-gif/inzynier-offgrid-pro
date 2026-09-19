import type { CalcResult } from "@/lib/core/calc-result"
import type { KategorieSpecjalneInput } from "./input"
import { validateInput } from "./validation"
import { brakPozycji } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type KategorieSpecjalneResult = {
  energiaWh: number
}

const FORMULA = "E = \\sum_{i} P_i \\times t_i"

/**
 * Moduł 2 — Ekran 15 "Kategorie specjalne" (dawne 1.27). Suma energii dobowej z ręcznie
 * wpisanych urządzeń przypisanych do wybranej kategorii — źródło nie podaje mocy domyślnych dla
 * żadnej kategorii (tylko nazwy przykładowych urządzeń dla "Warsztat"), więc lista jest w
 * całości ręcznym wpisem, kategoria pełni rolę tylko organizacyjną/kontekstową.
 */
export function calculateKategorieSpecjalne(input: KategorieSpecjalneInput): CalcResult<KategorieSpecjalneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: KategorieSpecjalneResult = { energiaWh: 0 }
  const inputs = Object.fromEntries(input.pozycje.map((p, i) => [`pozycja_${i}_${p.nazwa || "?"}`, p.mocW]))

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "Wh",
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
      unit: "Wh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [brakPozycji()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaWh = input.pozycje.reduce((suma, p) => suma + (p.mocW * p.czasMin) / 60, 0)

  return {
    value: { energiaWh },
    unit: "Wh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
