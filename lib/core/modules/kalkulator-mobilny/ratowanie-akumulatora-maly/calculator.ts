import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { PROCEDURY, PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V } from "./constants"
import type { RatowanieAkumulatoraMalyInput } from "./input"
import { krytycznieRozladowany, lifepo4ZmierzOgniwa, napiecieUjemne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "U_{spocz} < 10{,}5\\,V \\Rightarrow \\text{krytycznie rozładowany (AGM/kwasowy 12 V)}"

export type RatowanieAkumulatoraMalyResult = {
  /** Procedury Modułu 11 do wykonania, w kolejności. */
  procedury: { ekran: string; href: string }[]
  /** null = nie dotyczy (LiFePO4) albo nie zmierzono. */
  krytycznieRozladowany: boolean | null
}

/**
 * Ekran 42, Moduł 12 — "Ratowanie rozładowanego akumulatora — mała instalacja" (dawne 8.70). Czysty
 * odsyłacz (źródło: „powinien odsyłać do pełnych procedur w Module 11 wg wybranej chemii, zamiast
 * duplikować logikę ratunkową po raz trzeci”). Jedyna własna reguła: próg 10,5 V z Biblii §12.58 dla
 * ołowiowego 12 V — jako info, bo decyzja ratunkowa należy do B10/B11.
 */
export function calculateRatowanieAkumulatoraMaly(
  input: RatowanieAkumulatoraMalyInput,
): CalcResult<RatowanieAkumulatoraMalyResult> {
  const inputs = { napiecieSpoczynkoweV: input.napiecieSpoczynkoweV ?? 0 }
  const pusty: RatowanieAkumulatoraMalyResult = { procedury: [], krytycznieRozladowany: null }

  if (input.napiecieSpoczynkoweV !== null && input.napiecieSpoczynkoweV < 0) {
    return {
      value: pusty,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [napiecieUjemne(input.napiecieSpoczynkoweV)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.chemia === null) {
    return {
      value: pusty,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = []
  let krytycznie: boolean | null = null
  if (input.chemia === "LiFePO4") {
    warnings.push(lifepo4ZmierzOgniwa())
  } else if (input.napiecieSpoczynkoweV !== null) {
    krytycznie = input.napiecieSpoczynkoweV < PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V
    if (krytycznie) warnings.push(krytycznieRozladowany(input.napiecieSpoczynkoweV, PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V))
  }

  const procedury = input.chemia === "LiFePO4" ? [...PROCEDURY.LiFePO4] : [...PROCEDURY.olow]

  return {
    value: { procedury, krytycznieRozladowany: krytycznie },
    unit: "V",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "RAM-ZALOZENIE-ODSYLACZ" }],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
