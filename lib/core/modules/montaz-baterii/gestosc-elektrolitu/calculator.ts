import type { CalcResult } from "@/lib/core/calc-result"
import type { GestoscElektrolituInput } from "./input"
import { validateInput } from "./validation"
import { stanCzesciowoNaladowany, stanPelny, stanRozladowany } from "./warnings"
import { GESTOSC_PELNY_G_CM3, GESTOSC_POLOWA_G_CM3 } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type StanNaladowania = "pelny" | "czesciowo-naladowany" | "rozladowany"

export type GestoscElektrolituResult = {
  gestoscGCm3: number
  stan: StanNaladowania
}

/**
 * Ekran B9, Moduł 11, Ścieżka B — "Test pojemności i gęstości elektrolitu" (dawne 10.13,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Trzy strefy z tabeli referencyjnej
 * źródła (1,28=pełny / 1,20=połowa / 1,12=rozładowany) — granice stref to same podane wartości
 * referencyjne (ten sam wzorzec co Ekran A9 z jednym progiem 1,5V), nic pomiędzy nie jest
 * wymyślone. Źródło nie oznacza żadnego z tych stanów jako 🔴 — stąd oba niepełne stany mają
 * poziom "warning", nie "critical".
 */
export function calculateGestoscElektrolitu(
  input: GestoscElektrolituInput,
): CalcResult<GestoscElektrolituResult> {
  const { errors } = validateInput(input)
  const pustyWynik: GestoscElektrolituResult = { gestoscGCm3: 0, stan: "rozladowany" }
  const inputs = { gestoscGCm3: input.gestoscGCm3 ?? -1 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "g/cm³",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.gestoscGCm3 === null) {
    return {
      value: pustyWynik,
      unit: "g/cm³",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const gestoscGCm3 = input.gestoscGCm3
  let stan: StanNaladowania
  let warning

  if (gestoscGCm3 >= GESTOSC_PELNY_G_CM3) {
    stan = "pelny"
    warning = stanPelny(gestoscGCm3)
  } else if (gestoscGCm3 >= GESTOSC_POLOWA_G_CM3) {
    stan = "czesciowo-naladowany"
    warning = stanCzesciowoNaladowany(gestoscGCm3)
  } else {
    stan = "rozladowany"
    warning = stanRozladowany(gestoscGCm3)
  }

  return {
    value: { gestoscGCm3, stan },
    unit: "g/cm³",
    status: "VALID_WITH_WARNINGS",
    formula: "",
    inputs: { gestoscGCm3 },
    assumptions: [],
    warnings: [warning],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
