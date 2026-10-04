import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { agregujWskaznik } from "./aggregation"
import { DOMYSLNE_WAGI_PCT, SKLADOWE, type SkladowaId, type WagiPct } from "./constants"
import type { WspolczynnikInput } from "./input"
import { punktacjaSkladowych } from "./scoring"
import { validateInput } from "./validation"
import { slabyPunkt, zestawWagWlasny, zestawWagWstepny } from "./warnings"

/** 1.1.0 (04.10.2026, D75): weak-point threshold entered by the user (was a fixed 70%); components ranked. */
export const CALCULATOR_VERSION = "1.1.0"

const FORMULA = "W = \\dfrac{\\sum_i w_i \\cdot s_i}{\\sum_i w_i}"

export type SkladowaWyniku = {
  id: SkladowaId
  /** Component score [%]; null = inputs missing. */
  wynikPct: number | null
  wagaPct: number
  /** Contribution to the total [percentage points] = w · s / Σw; null = inputs missing. */
  wkladPkt: number | null
}

export type WspolczynnikResult = {
  /** Total score [%]; null = a component is missing (no total from a part). */
  wskaznikPct: number | null
  /** Which weight set is in use. */
  zestawWag: "domyslne" | "wlasne"
  wagiPct: WagiPct
  skladowe: SkladowaWyniku[]
  /** Weakest component; null while the result is incomplete. */
  najslabsza: { id: SkladowaId; wynikPct: number } | null
  /** Components below the user's threshold, weakest first; [] without a threshold. */
  slabePunkty: SkladowaId[]
  /** All components from the weakest to the strongest (D75: shown next to the total); [] while incomplete. */
  ranking: SkladowaId[]
  /** Components whose inputs are missing. */
  brakujace: SkladowaId[]
}

const wagiBezpieczne = (input: WspolczynnikInput): WagiPct => input.wagiWlasne ?? DOMYSLNE_WAGI_PCT

/**
 * Ekran 12, Moduł 7 — "Współczynnik Bezpieczeństwa Zimowego" (dawne 6.14, Wzorzec G). Five components from the
 * source (energy coverage in the worst month, autonomy, resistance to failures — Ekran 10, freeze reaction time,
 * generator power margin) are scored 0–100% (`scoring.ts`, ✅🤖 ratios capped at 100%) and aggregated by ONE
 * function (`aggregation.ts`) with weights that are the assistant's provisional proposal accepted „for now” by
 * the owner — the user may enter their own. The weakest component is returned next to the total. 🟡 for every
 * component below the weak-point threshold (✅🤖 70%); no 🔴 — the score is an assessment, not an engineering stop.
 */
export function calculateWspolczynnik(input: WspolczynnikInput): CalcResult<WspolczynnikResult> {
  const wagi = wagiBezpieczne(input)
  const zestawWag = input.wagiWlasne === null ? "domyslne" : "wlasne"
  const punkty = punktacjaSkladowych(input)
  const brakujace = SKLADOWE.filter((id) => punkty[id] === null)
  const baza = {
    unit: "%",
    formula: FORMULA,
    inputs: Object.fromEntries(SKLADOWE.map((id) => [`waga_${id}`, wagi[id]])) as Record<string, number>,
    calculatorVersion: CALCULATOR_VERSION,
  }
  const skladoweBez = (): SkladowaWyniku[] =>
    SKLADOWE.map((id) => ({ id, wynikPct: punkty[id], wagaPct: wagi[id], wkladPkt: null }))
  const pusty = (): WspolczynnikResult => ({
    wskaznikPct: null,
    zestawWag,
    wagiPct: wagi,
    skladowe: skladoweBez(),
    najslabsza: null,
    slabePunkty: [],
    ranking: [],
    brakujace,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return { ...baza, value: pusty(), status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (brakujace.length > 0) return { ...baza, value: pusty(), status: "INCOMPLETE", assumptions: [], warnings: [] }

  const wyniki = punkty as Record<SkladowaId, number>
  const { wskaznikPct, najslabsza } = agregujWskaznik(wyniki, wagi)
  const sumaWag = SKLADOWE.reduce((s, id) => s + wagi[id], 0)
  const skladowe: SkladowaWyniku[] = SKLADOWE.map((id) => ({
    id,
    wynikPct: wyniki[id],
    wagaPct: wagi[id],
    wkladPkt: (wagi[id] * wyniki[id]) / sumaWag,
  }))
  const ranking = [...SKLADOWE].sort((a, b) => wyniki[a] - wyniki[b])
  const prog = input.progSlabegoPunktuPct
  const slabePunkty = prog === null ? [] : ranking.filter((id) => wyniki[id] < prog)

  const warnings: Warning[] = [zestawWag === "domyslne" ? zestawWagWstepny() : zestawWagWlasny()]
  for (const id of slabePunkty) warnings.push(slabyPunkt(id, wyniki[id], prog!))
  const assumptions: Assumption[] = [
    { kod: "WSP-ZALOZENIE-MAPOWANIE" },
    prog === null ? { kod: "WSP-ZALOZENIE-BEZ-PROGU" } : { kod: "WSP-ZALOZENIE-PROG", params: { prog } },
  ]
  if (zestawWag === "domyslne") assumptions.push({ kod: "WSP-ZALOZENIE-WAGI" })

  return {
    ...baza,
    value: { wskaznikPct, zestawWag, wagiPct: wagi, skladowe, najslabsza, slabePunkty, ranking, brakujace },
    status: slabePunkty.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
