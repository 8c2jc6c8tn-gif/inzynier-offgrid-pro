import type { CalcResult } from "@/lib/core/calc-result"
import type { SezonowoscInput } from "./input"
import { validateInput } from "./validation"
import { urzadzenieAktywne, urzadzenieNieaktywne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type SezonowoscResult = {
  aktywne: boolean
  zapotrzebowanieWliczoneKwhDoba: number
}

const FORMULA = "aktywne \\;?\\; E_{wliczone} = E_{urządzenia} : E_{wliczone} = 0"

function czyAktywneSezonowo(miesiacOd: number, miesiacDo: number, aktualnyMiesiac: number): boolean {
  if (miesiacOd <= miesiacDo) {
    return aktualnyMiesiac >= miesiacOd && aktualnyMiesiac <= miesiacDo
  }
  // sezon przechodzi przez przełom roku (np. zima: 12 -> 2)
  return aktualnyMiesiac >= miesiacOd || aktualnyMiesiac <= miesiacDo
}

/**
 * Ekran 6, Moduł 2 "Zapotrzebowanie energetyczne" — "Sezonowość i tryb wakacyjny" (dawne 1.8,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Urządzenie sezonowe wyłączane
 * z bilansu poza swoim okresem — okres wpisywany ręcznie per urządzenie (źródło podaje tylko
 * jeden przykładowy zakres dla konkretnego urządzenia — klimatyzacji, nie uniwersalną definicję
 * "lata"/"zimy" dla wszystkich urządzeń, więc nie jest zakładany z góry).
 */
export function calculateSezonowosc(input: SezonowoscInput): CalcResult<SezonowoscResult> {
  const { errors } = validateInput(input)
  const pustyWynik: SezonowoscResult = { aktywne: false, zapotrzebowanieWliczoneKwhDoba: 0 }
  const inputs = {
    zapotrzebowanieKwhDoba: input.zapotrzebowanieKwhDoba,
    miesiacOd: input.miesiacOd,
    miesiacDo: input.miesiacDo,
    aktualnyMiesiac: input.aktualnyMiesiac,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-SEZONOWOSC",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const brakujeSezonowych =
    input.typ === "sezonowy" && (input.miesiacOd === 0 || input.miesiacDo === 0 || input.aktualnyMiesiac === 0)

  if (input.zapotrzebowanieKwhDoba === 0 || brakujeSezonowych) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-SEZONOWOSC",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const aktywne =
    input.typ === "caloroczny"
      ? true
      : input.typ === "weekendowy"
        ? input.czyWeekend
        : czyAktywneSezonowo(input.miesiacOd, input.miesiacDo, input.aktualnyMiesiac)

  const zapotrzebowanieWliczoneKwhDoba = aktywne ? input.zapotrzebowanieKwhDoba : 0

  return {
    value: { aktywne, zapotrzebowanieWliczoneKwhDoba },
    unit: "kWh/dobę",
    status: "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-SEZONOWOSC",
    inputs,
    assumptions: [],
    warnings: [aktywne ? urzadzenieAktywne(zapotrzebowanieWliczoneKwhDoba) : urzadzenieNieaktywne()],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
