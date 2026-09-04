import type { CalcResult } from "@/lib/core/calc-result"
import type { LoadSheddingInput } from "./input"
import { validateInput } from "./validation"
import { odbiornikAktywny, odbiornikOdlaczony } from "./warnings"
import { PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT, PROG_ODLACZENIA_PRIORYTET_3_SOC_PCT } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type LoadSheddingResult = {
  odlaczone: boolean
}

const FORMULA =
  "P1: nigdy \\;\\; P2: SoC < 20\\% \\;\\; P3: SoC < 90\\% \\; \\lor \\; brak\\ nadwyżki\\ PV"

/**
 * Ekran 12, Moduł 2 "Zapotrzebowanie energetyczne" — "Macierz priorytetów odłączania (Smart Load
 * Shedding)" (dawne 1.20, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja A/B). Progi
 * SoC (20% dla priorytetu 2, 90% dla priorytetu 3) podane wprost w źródle — nie wymyślone.
 */
export function calculateLoadShedding(input: LoadSheddingInput): CalcResult<LoadSheddingResult> {
  const { errors } = validateInput(input)
  const pustyWynik: LoadSheddingResult = { odlaczone: false }
  const inputs = {
    priorytet: input.priorytet,
    socPct: input.socPct ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.priorytet === 0 || input.socPct === null) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const odlaczone =
    input.priorytet === 1
      ? false
      : input.priorytet === 2
        ? input.socPct < PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT
        : input.socPct < PROG_ODLACZENIA_PRIORYTET_3_SOC_PCT || !input.maNadwyzkePv

  return {
    value: { odlaczone },
    unit: "",
    status: odlaczone ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [odlaczone ? odbiornikOdlaczony(input.priorytet) : odbiornikAktywny(input.priorytet)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
