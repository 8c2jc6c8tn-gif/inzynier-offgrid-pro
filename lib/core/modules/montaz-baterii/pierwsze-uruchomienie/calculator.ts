import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PierwszeUruchomienieInput } from "./input"
import { validateInput } from "./validation"
import { topBalancingNieosiagniety } from "./warnings"
import { CHECKLIST_ITEMS, PROG_TOP_BALANCING_V, TEST_LADOWANIA_C_RATE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PierwszeUruchomienieResult = {
  pradTestowyA: number
  osiagnietoTopBalancing: boolean
  potwierdzone: number
  razem: number
}

const FORMULA = "I_{test} = 0,1C \\times C_{Ah}"

/**
 * Ekran A5, Moduł 11 — "Pierwsze uruchomienie + test balansowania" (dawne 9.6, 9.13). Prąd
 * testowy liczony wprost z pojemności (0,1C, 1:1 ze źródła) — user potrzebuje tej liczby przed
 * rozpoczęciem testu, nie tylko checklistu. Napięcie Top Balancing (3,55V) to informacyjny
 * kamień milowy (poziom "info", Dyrektywa #6 — nigdy nie podnosi statusu), nie twardy stop.
 */
export function calculatePierwszeUruchomienie(
  input: PierwszeUruchomienieInput,
): CalcResult<PierwszeUruchomienieResult> {
  const { errors } = validateInput(input)
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzone = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id))).size
  const razem = CHECKLIST_ITEMS.length
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieNajwyzszegoOgniwaV: input.napiecieNajwyzszegoOgniwaV,
    potwierdzone,
    razem,
  }
  const pustyWynik: PierwszeUruchomienieResult = {
    pradTestowyA: 0,
    osiagnietoTopBalancing: false,
    potwierdzone,
    razem,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pojemnoscAh === 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradTestowyA = Math.round(input.pojemnoscAh * TEST_LADOWANIA_C_RATE * 1000) / 1000
  const osiagnietoTopBalancing = input.napiecieNajwyzszegoOgniwaV >= PROG_TOP_BALANCING_V

  const warnings: Warning[] = []
  if (input.napiecieNajwyzszegoOgniwaV > 0 && !osiagnietoTopBalancing) {
    warnings.push(topBalancingNieosiagniety(input.napiecieNajwyzszegoOgniwaV))
  }

  const value: PierwszeUruchomienieResult = { pradTestowyA, osiagnietoTopBalancing, potwierdzone, razem }
  const checklistPelny = potwierdzone === razem
  const kompletne = osiagnietoTopBalancing && checklistPelny

  return {
    value,
    unit: "A",
    status: kompletne ? "VALID" : "INCOMPLETE",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
