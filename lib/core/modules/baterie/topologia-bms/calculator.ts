import type { CalcResult } from "@/lib/core/calc-result"
import type { TopologiaBmsInput } from "./input"
import { validateInput } from "./validation"
import { commonPortNiewystarczajacy, commonPortWystarczajacy } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type TopologiaBmsResult = {
  bmsCommonPortA: number
  falownikPradRozruchuA: number
  commonPortWystarcza: boolean
}

/**
 * Ekran 26, Moduł 4 "Magazyn energii / baterie" — "Topologia BMS (Common Port vs Separate
 * Port)" (dawne 3.29, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja C). Proste
 * sprawdzenie progu 1:1 z przykładu źródła: Common Port musi wytrzymać szczytowy prąd rozruchu
 * falownika, inaczej potrzebna jest topologia Separate Port.
 */
export function calculateTopologiaBms(input: TopologiaBmsInput): CalcResult<TopologiaBmsResult> {
  const { errors } = validateInput(input)
  const pustyWynik: TopologiaBmsResult = { bmsCommonPortA: 0, falownikPradRozruchuA: 0, commonPortWystarcza: false }
  const inputs = {
    bmsCommonPortA: input.bmsCommonPortA,
    falownikPradRozruchuA: input.falownikPradRozruchuA,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.bmsCommonPortA === 0 || input.falownikPradRozruchuA === 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const commonPortWystarcza = input.bmsCommonPortA >= input.falownikPradRozruchuA

  return {
    value: {
      bmsCommonPortA: input.bmsCommonPortA,
      falownikPradRozruchuA: input.falownikPradRozruchuA,
      commonPortWystarcza,
    },
    unit: "A",
    status: commonPortWystarcza ? "VALID" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs,
    assumptions: [],
    warnings: [
      commonPortWystarcza
        ? commonPortWystarczajacy(input.bmsCommonPortA, input.falownikPradRozruchuA)
        : commonPortNiewystarczajacy(input.bmsCommonPortA, input.falownikPradRozruchuA),
    ],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
