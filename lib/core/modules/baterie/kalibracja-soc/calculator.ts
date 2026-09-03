import type { CalcResult } from "@/lib/core/calc-result"
import type { KalibracjaSocInput } from "./input"
import { validateInput } from "./validation"
import { kalibracjaNiepotrzebna, rekomendowanaKalibracja } from "./warnings"
import { PROG_KALIBRACJI_DNI } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type KalibracjaSocResult = {
  dni: number
  kalibracjaRekomendowana: boolean
}

/**
 * Ekran 28, Moduł 4 — "Kalibracja i dokładność SoC" (dawne 3.31,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Jeden próg czasowy 1:1 ze źródła
 * ("po ok. 2 tygodniach") — bez wzoru na wielkość błędu SoC, którego źródło nie podaje.
 */
export function calculateKalibracjaSoc(input: KalibracjaSocInput): CalcResult<KalibracjaSocResult> {
  const { errors } = validateInput(input)
  const pustyWynik: KalibracjaSocResult = { dni: 0, kalibracjaRekomendowana: false }
  const inputs = { dniOdOstatniegoPelnegoNaladowania: input.dniOdOstatniegoPelnegoNaladowania ?? -1 }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "dni",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.dniOdOstatniegoPelnegoNaladowania === null) {
    return {
      value: pustyWynik,
      unit: "dni",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const dni = input.dniOdOstatniegoPelnegoNaladowania
  const kalibracjaRekomendowana = dni >= PROG_KALIBRACJI_DNI

  return {
    value: { dni, kalibracjaRekomendowana },
    unit: "dni",
    status: "VALID_WITH_WARNINGS",
    formula: "",
    inputs: { dniOdOstatniegoPelnegoNaladowania: dni },
    assumptions: [],
    warnings: [kalibracjaRekomendowana ? rekomendowanaKalibracja(dni) : kalibracjaNiepotrzebna(dni)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
