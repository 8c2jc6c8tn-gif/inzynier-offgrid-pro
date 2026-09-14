import type { CalcResult } from "@/lib/core/calc-result"
import type { OchronaOdwrotnaPolaryzacjaInput } from "./input"
import { brakOchrony, ochronaZastosowana } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type OchronaOdwrotnaPolaryzacjaResult = Record<string, never>

/**
 * Ekran 15, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed odwrotną polaryzacją"
 * (dawne 4.14, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C (porównanie dwóch
 * podejść, patrz `constants.ts`) + twardy stop 1:1 ze źródła: brak ochrony. Źródło NIE podaje
 * reguły "które podejście dla którego miejsca" — `miejsceObwodu` jest tu tylko informacyjny,
 * nie wpływa na werdykt (nie zgadywana rekomendacja per miejsce).
 */
export function calculateOchronaOdwrotnaPolaryzacja(
  input: OchronaOdwrotnaPolaryzacjaInput,
): CalcResult<OchronaOdwrotnaPolaryzacjaResult> {
  const inputs = {}

  if (input.typOchrony === null) {
    return {
      value: {},
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings = [input.typOchrony === "brak" ? brakOchrony() : ochronaZastosowana()]
  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: {},
    unit: "",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [
      "Rekomendacja typu ochrony per miejsce (bateria/panele/falownik) NIE podana w źródle — `miejsceObwodu` jest tu informacyjny, decyzję o typie podejmuje użytkownik.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
