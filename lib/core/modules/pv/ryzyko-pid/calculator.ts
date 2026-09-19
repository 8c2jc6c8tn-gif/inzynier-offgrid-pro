import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { RyzykoPidInput } from "./input"
import { validateInput } from "./validation"
import { brakRyzykaPid, ryzykoPid } from "./warnings"
import { PROG_NAPIECIA_PID_V } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type RyzykoPidResult = {
  ryzykoPid: boolean
}

/**
 * Moduł 3 "Instalacja PV" — "Zjawisko PID (degradacja indukowana napięciem)" (dawne 2.15/3.15,
 * docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md, linie 1536-1548). Sprawdzenie
 * progu 1:1 ze źródła ("ostrzeżenie, jeśli napięcie systemu DC przekracza 400 V przy dużej
 * wilgotności") — bez symulacji tempa degradacji mocy, źródło nie podaje wzoru wiążącego
 * napięcie/wilgotność/czas z wielkością utraty mocy, tylko próg ostrzegawczy i rekomendację
 * (uziemienie konstrukcji, panele anty-PID).
 */
export function calculateRyzykoPid(input: RyzykoPidInput): CalcResult<RyzykoPidResult> {
  const { errors } = validateInput(input)
  const pustyWynik: RyzykoPidResult = { ryzykoPid: false }
  const inputs = { napiecieDcV: input.napiecieDcV }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.napiecieDcV === 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const ryzyko = input.napiecieDcV > PROG_NAPIECIA_PID_V && input.wilgotnoscWysoka

  return {
    value: { ryzykoPid: ryzyko },
    unit: "",
    status: ryzyko ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [{ kod: "PID-PROG-NAPIECIA-ZE-ZRODLA" }] satisfies Assumption[],
    warnings: [ryzyko ? ryzykoPid(input.napiecieDcV) : brakRyzykaPid(input.napiecieDcV)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
