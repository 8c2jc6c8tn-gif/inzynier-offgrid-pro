import type { CalcResult } from "@/lib/core/calc-result"
import type { LokalizacjaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type LokalizacjaResult = {
  zapisano: boolean
}

/**
 * Ekran 1, Moduł 1 — "GPS i dane klimatyczne" (dawne 0.1,
 * docs/domena/Tresc_Modul_1_Lokalizacja_Ekrany.md). Tryb offline: zapis współrzędnych/temperatury
 * minimalnej wpisanych ręcznie. Bez silnika obliczeniowego — to ekran infrastrukturalny, zasila
 * pozostałe moduły (klimat/strefy dla PV, ogrzewania, stress-testu).
 */
export function calculateLokalizacja(input: LokalizacjaInput): CalcResult<LokalizacjaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    szerokoscGeograficzna: input.szerokoscGeograficzna ?? 0,
    dlugoscGeograficzna: input.dlugoscGeograficzna ?? 0,
    temperaturaMinimalnaC: input.temperaturaMinimalnaC ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: { zapisano: false },
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const kompletne =
    input.szerokoscGeograficzna !== undefined &&
    input.dlugoscGeograficzna !== undefined &&
    input.temperaturaMinimalnaC !== undefined

  if (!kompletne) {
    return {
      value: { zapisano: false },
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value: { zapisano: true },
    unit: "",
    status: "VALID",
    formula: "",
    inputs,
    assumptions: [
      "Dane nasłonecznienia/strefy klimatycznej wymagają docelowo integracji z PVGIS/PVWatts " +
        "(online) — w tym kroku dostępny jest tylko tryb offline z ręcznym wpisaniem temperatury minimalnej.",
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
