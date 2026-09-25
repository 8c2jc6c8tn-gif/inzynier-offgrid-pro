import type { CalcResult } from "@/lib/core/calc-result"
import type { MikroinwerteryVsCentralnyInput } from "./input"
import { mikroinwerterWymagaSprzezeniaAc, rekomendacjaCentralny, rekomendacjaMikroinwertery } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type Rekomendacja = "mikroinwertery" | "centralny"

export type MikroinwerteryVsCentralnyResult = {
  rekomendacja: Rekomendacja | null
}

/**
 * Ekran 21, Moduł 3 — "Mikroinwertery vs inwerter centralny" (dawne 2.36). Reguła 1:1 ze
 * źródła: "przy częściowym/regularnym zacienieniu wybierz mikroinwertery". Bez zacienienia
 * główna przewaga mikroinwerterów nie ma zastosowania, a tabela źródła wskazuje niższy koszt
 * inwertera centralnego — stąd rekomendacja odwrotna. Brak odpowiedzi → INCOMPLETE (3.3), nigdy
 * domyślne "brak zacienienia".
 */
export function calculateMikroinwerteryVsCentralny(
  input: MikroinwerteryVsCentralnyInput,
): CalcResult<MikroinwerteryVsCentralnyResult> {
  if (input.regularneZacienienie === null) {
    return {
      value: { rekomendacja: null },
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.regularneZacienienie) {
    return {
      value: { rekomendacja: "mikroinwertery" },
      unit: "",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [rekomendacjaMikroinwertery(), mikroinwerterWymagaSprzezeniaAc()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value: { rekomendacja: "centralny" },
    unit: "",
    status: "VALID",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings: [rekomendacjaCentralny()],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
