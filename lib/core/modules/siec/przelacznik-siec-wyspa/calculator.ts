import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { ocenBezpieczenstwoAgregatu } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"
import { brakDanych } from "../rachunek-za-prad/warnings"
import type { PrzelacznikInput } from "./input"
import { backfeed, normaBrak, pracaRownolegla, przelacznikN, przelacznikOk, rownolegleBezZgloszenia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type PrzelacznikResult = {
  /** Hard stop 1 active. */
  backfeed: boolean
  /** Number of critical warnings (hard stops 1–3). */
  twardeStopy: number
}

/**
 * Decision checklist, no physics. Grid ↔ island needs a switch grid–0–island with mechanical
 * interlock or an ATS with electrical and mechanical interlock; generator questions are the M2/E17
 * block (D48) echoed as is.
 */
export function calculatePrzelacznik(input: PrzelacznikInput): CalcResult<PrzelacznikResult> {
  const base = { unit: "", formula: "", inputs: { maAgregat: input.maAgregat ? 1 : 0 }, calculatorVersion: CALCULATOR_VERSION }
  const pusty: PrzelacznikResult = { backfeed: false, twardeStopy: 0 }

  if (input.trybPracy === null) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [brakDanych("trybPracy")] }
  }
  const warnings: Warning[] = []
  if (input.trybPracy === "przelaczany") {
    if (input.przelacznik === null) {
      return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [brakDanych("przelacznik")] }
    }
    if (input.przelacznik === "brak-lub-bez-blokady") warnings.push(backfeed())
    else {
      warnings.push(przelacznikOk())
      if (input.przelaczaN !== true) warnings.push(przelacznikN())
    }
  } else if (input.trybPracy === "rownolegle") {
    warnings.push(pracaRownolegla())
    if (input.zgloszenieOsd === false) warnings.push(rownolegleBezZgloszenia())
  }
  if (input.maAgregat) warnings.push(...ocenBezpieczenstwoAgregatu(input))
  warnings.push(normaBrak())

  const twardeStopy = warnings.filter((w) => w.level === "critical").length
  const status = warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID"
  return {
    ...base,
    value: { backfeed: warnings.some((w) => w.code === "SIEC-BACKFEED"), twardeStopy },
    status,
    assumptions: [],
    warnings,
  }
}
