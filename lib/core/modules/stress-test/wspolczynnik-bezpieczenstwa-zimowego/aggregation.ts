import { SKLADOWE, type SkladowaId, type WagiPct } from "./constants"

export type AgregacjaWyniku = {
  /** Total score [%] — the number shown as „Współczynnik Bezpieczeństwa Zimowego”. */
  wskaznikPct: number
  /** Weakest component (lowest score; the first in the source order on a tie). */
  najslabsza: { id: SkladowaId; wynikPct: number }
}

/**
 * THE one aggregation point. Today: weighted mean Σ(wᵢ · sᵢ) / Σwᵢ of the component scores. The owner may later
 * switch to a weakest-link rule (`wskaznikPct = najslabsza.wynikPct`) — change only this function, every caller
 * (calculator, screen, AI tool, tests) goes through it.
 */
export function agregujWskaznik(wyniki: Record<SkladowaId, number>, wagi: WagiPct): AgregacjaWyniku {
  const sumaWag = SKLADOWE.reduce((s, id) => s + wagi[id], 0)
  const wskaznikPct = SKLADOWE.reduce((s, id) => s + wagi[id] * wyniki[id], 0) / sumaWag
  let najslabsza = { id: SKLADOWE[0] as SkladowaId, wynikPct: wyniki[SKLADOWE[0]] }
  for (const id of SKLADOWE) if (wyniki[id] < najslabsza.wynikPct) najslabsza = { id, wynikPct: wyniki[id] }
  return { wskaznikPct, najslabsza }
}
