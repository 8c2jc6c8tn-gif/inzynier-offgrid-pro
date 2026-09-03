import type { CalcResult } from "@/lib/core/calc-result"
import type { ColdCRateInput } from "./input"
import { validateInput } from "./validation"
import { blokadaCalkowita, limitChlodno, limitZimno, lukaZrodla } from "./warnings"
import {
  LIMIT_C_RATE_CHLODNO,
  LIMIT_C_RATE_ZIMNO,
  PROG_BLOKADY_C,
  PROG_LIMITU_02C,
  PROG_LUKI_GORNY_C,
  PROG_PELNEGO_PRADU_C,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type StrefaCRate = "blokada" | "limit-01c" | "limit-02c" | "luka-zrodla" | "pelny-prad"

export type ColdCRateResult = {
  temperaturaC: number
  strefa: StrefaCRate
  /** null gdy limit nie jest liczbą (blokada=0 osobno; luka i pełny prąd = brak zdefiniowanej liczby w źródle). */
  maxPradA: number | null
}

/**
 * Ekran 12, Moduł 4 — "Ograniczenie prądu ładowania w mrozie (Cold C-Rate)" (dawne 3.13,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Cztery strefy 1:1 z tabeli źródła +
 * jawnie oznaczona piąta strefa (5–10°C) — źródło NIE definiuje limitu dla tego zakresu (luka
 * w tabeli oryginalnej), zamiast interpolować wymyśloną wartość, kalkulator zwraca informację
 * o luce. Podobnie "pełny prąd" (>10°C) nie ma podanej liczby C-rate w źródle — tylko status
 * "brak ograniczenia od strony temperatury", bez wymyślonego maksimum.
 */
export function calculateColdCRate(input: ColdCRateInput): CalcResult<ColdCRateResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ColdCRateResult = { temperaturaC: 0, strefa: "blokada", maxPradA: null }
  const inputs = { temperaturaOgniwaC: input.temperaturaOgniwaC ?? Number.NaN, pojemnoscAh: input.pojemnoscAh }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.temperaturaOgniwaC === null || input.pojemnoscAh === 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaC = input.temperaturaOgniwaC
  const pojemnoscAh = input.pojemnoscAh

  if (temperaturaC < PROG_BLOKADY_C) {
    return {
      value: { temperaturaC, strefa: "blokada", maxPradA: 0 },
      unit: "A",
      status: "VALID_WITH_WARNINGS",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: [blokadaCalkowita(temperaturaC)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (temperaturaC < PROG_LIMITU_02C) {
    const maxPradA = pojemnoscAh * LIMIT_C_RATE_ZIMNO
    return {
      value: { temperaturaC, strefa: "limit-01c", maxPradA },
      unit: "A",
      status: "VALID_WITH_WARNINGS",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: [limitZimno(temperaturaC, maxPradA)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (temperaturaC < PROG_LUKI_GORNY_C) {
    const maxPradA = pojemnoscAh * LIMIT_C_RATE_CHLODNO
    return {
      value: { temperaturaC, strefa: "limit-02c", maxPradA },
      unit: "A",
      status: "VALID_WITH_WARNINGS",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: [limitChlodno(temperaturaC, maxPradA)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (temperaturaC <= PROG_PELNEGO_PRADU_C) {
    return {
      value: { temperaturaC, strefa: "luka-zrodla", maxPradA: null },
      unit: "A",
      status: "OUT_OF_SCOPE",
      formula: "I_{max} = Pojemność \\times C_{rate}(T)",
      inputs,
      assumptions: [],
      warnings: [lukaZrodla(temperaturaC)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value: { temperaturaC, strefa: "pelny-prad", maxPradA: null },
    unit: "A",
    status: "VALID",
    formula: "I_{max} = Pojemność \\times C_{rate}(T)",
    inputs,
    assumptions: ["Powyżej 10°C źródło nie ogranicza prądu od strony temperatury ogniw."],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
