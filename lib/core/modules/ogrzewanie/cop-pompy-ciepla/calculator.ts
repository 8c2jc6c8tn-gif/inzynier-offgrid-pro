import type { CalcResult } from "@/lib/core/calc-result"
import type { CopPompyCieplaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "P_{elektryczna} = P_{cieplna} / COP"

/**
 * Ekran 5, Moduł 6 — "Pompa ciepła — COP/SCOP w funkcji temperatury" (dawne 5.5,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md). COP to "mnożnik" — pompa nie produkuje ciepła
 * z niczego, tylko przenosi je z zewnątrz, zużywając mniej prądu niż grzałka elektryczna.
 */
export function calculateCopPompyCiepla(input: CopPompyCieplaInput): CalcResult<number> {
  const { errors, warnings } = validateInput(input)
  const inputs = { mocCieplnaKw: input.mocCieplnaKw, cop: input.cop }

  if (errors.length > 0) {
    return {
      value: 0,
      unit: "kW",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = input.mocCieplnaKw / input.cop

  return {
    value,
    unit: "kW",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "COP zależy od temperatury zewnętrznej — podana wartość dotyczy tylko aktualnych warunków, " +
        "nie jest stała przez cały sezon (patrz krzywa COP producenta).",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
