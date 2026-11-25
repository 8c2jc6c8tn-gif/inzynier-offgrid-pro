import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { BilansZapotrzebowaniaInput, ZrodloBilansu } from "./input"
import { validateInput } from "./validation"
import { brakZrodla } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type BilansZapotrzebowaniaResult = {
  /** Typical day: sources that run every day [kWh/day], without the buffer. */
  typowaKwh: number
  typowaZBuforemKwh: number
  /** Daily demand in each month [kWh/day], without the buffer. */
  miesiaceKwh: number[]
  /** 0 = January; `null` when nothing was summed. */
  najgorszyMiesiac: number | null
  najgorszyKwh: number
  najgorszyZBuforemKwh: number
  /** Sources summed / not filled in. */
  zliczone: ZrodloBilansu[]
  bezDanych: ZrodloBilansu[]
}

const FORMULA =
  "E_{doba} = \\sum_i E_i \\quad E_{miesiąc\\,m} = \\sum_i E_{i,m} \\quad E_{z\\,buforem} = E \\times (1 + bufor\\%)"
const FORMULA_KEY = "UI-FORMULA-ZAPOTRZEBOWANIE-BILANS"

const pusty: BilansZapotrzebowaniaResult = {
  typowaKwh: 0,
  typowaZBuforemKwh: 0,
  miesiaceKwh: Array(12).fill(0),
  najgorszyMiesiac: null,
  najgorszyKwh: 0,
  najgorszyZBuforemKwh: 0,
  zliczone: [],
  bezDanych: [],
}

/**
 * Moduł 2 — „Bilans zapotrzebowania” (D-3). Sums the daily energy of the ticked sources: the typical day (sources that run every
 * day) and every month (seasonal devices, devices with their own months); the worst month is the one with the highest daily
 * demand. The expansion buffer is applied on top (shown separately — the project keeps the demand without it, so the buffer
 * screen is never applied twice). A source without data is listed, not guessed.
 */
export function calculateBilansZapotrzebowania(input: BilansZapotrzebowaniaInput): CalcResult<BilansZapotrzebowaniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    liczbaPozycji: input.pozycje.length,
    liczbaWlaczonych: input.pozycje.filter((p) => p.wlaczona).length,
    buforPct: input.buforPct ?? 0,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, formulaKey: FORMULA_KEY, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wlaczone = input.pozycje.filter((p) => p.wlaczona)
  const zDanymi = wlaczone.filter((p) => p.kwhDobaTypowa !== null && p.kwhDobaMiesiace !== null)
  const bezDanych = wlaczone.filter((p) => p.kwhDobaTypowa === null || p.kwhDobaMiesiace === null).map((p) => p.zrodlo)
  const ostrzezenia = bezDanych.map(brakZrodla)
  if (zDanymi.length === 0) {
    return { ...baza, value: { ...pusty, bezDanych }, status: "INCOMPLETE", assumptions: [], warnings: ostrzezenia }
  }

  const typowaKwh = zDanymi.reduce((s, p) => s + p.kwhDobaTypowa!, 0)
  const miesiaceKwh = Array.from({ length: 12 }, (_, m) => zDanymi.reduce((s, p) => s + p.kwhDobaMiesiace![m]!, 0))
  const najgorszyKwh = Math.max(...miesiaceKwh)
  const najgorszyMiesiac = miesiaceKwh.indexOf(najgorszyKwh)
  const mnoznik = 1 + (input.buforPct ?? 0) / 100

  const zalozenia: Assumption[] = [{ kod: "BILANS-ZAL-PODWOJNE-LICZENIE" }]
  if (zDanymi.some((p) => p.zrodlo === "sezonowe")) zalozenia.push({ kod: "BILANS-ZAL-SEZONOWE" })
  if (input.buforPct === null) zalozenia.push({ kod: "BILANS-ZAL-BEZ-BUFORA" })

  return {
    ...baza,
    value: {
      typowaKwh,
      typowaZBuforemKwh: typowaKwh * mnoznik,
      miesiaceKwh,
      najgorszyMiesiac,
      najgorszyKwh,
      najgorszyZBuforemKwh: najgorszyKwh * mnoznik,
      zliczone: zDanymi.map((p) => p.zrodlo),
      bezDanych,
    },
    status: "VALID",
    assumptions: zalozenia,
    warnings: ostrzezenia,
  }
}
