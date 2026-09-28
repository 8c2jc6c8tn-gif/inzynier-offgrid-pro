import type { CalcResult } from "@/lib/core/calc-result"
import type { MikroinwerteryVsCentralnyInput } from "./input"
import {
  mikroinwerterBezFalownikaWyspowego,
  mikroinwerterWymagaSprzezeniaAc,
  rekomendacjaCentralny,
  rekomendacjaMikroinwertery,
} from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

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
 *
 * Przy rekomendacji mikroinwerterów (od 1.1.0): brak falownika wyspowego z AC-coupling (albo „nie
 * wiem”) → 🔴; jest taki falownik → 🟡 (zgodność modelu); brak odpowiedzi → INCOMPLETE z rekomendacją.
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
    const falownik = input.falownikWyspowyAcCoupling
    return {
      value: { rekomendacja: "mikroinwertery" },
      unit: "",
      status: falownik === null ? "INCOMPLETE" : "VALID_WITH_WARNINGS",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [
        rekomendacjaMikroinwertery(),
        falownik === "nie" || falownik === "nie-wiem"
          ? mikroinwerterBezFalownikaWyspowego()
          : mikroinwerterWymagaSprzezeniaAc(),
      ],
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
