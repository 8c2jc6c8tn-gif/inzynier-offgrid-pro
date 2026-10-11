/**
 * Form state of M7/E12 "Współczynnik Bezpieczeństwa Zimowego" (strings) → calculator input. UI layer, shared by the screen and by
 * the crisis report (M7/E3), which shows the same coefficient from the saved draft.
 */
import { calculateWspolczynnik } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/calculator"
import { SKLADOWE, type SkladowaId, type WagiPct } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/constants"
import type { WspolczynnikInput } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/input"

export type PolaWspolczynnika = {
  produkcja: string
  zapotrzebowanie: string
  autonomia: string
  wymaganaAutonomia: string
  komponenty: string
  spof: string
  mocAgregatu: string
  mocWymagana: string
  okno: string
  wymaganyCzas: string
  prog: string
  brakAgregatu: boolean
  wlasneWagi: boolean
  wagi: Record<SkladowaId, string>
}

const liczba = (s: string | undefined) => (s === undefined || s.trim() === "" ? null : Number(s))

/** The user's own weights from the form; null while „own weights” is off (the default set is used). */
export const wagiZeStanu = (stan: Pick<PolaWspolczynnika, "wlasneWagi" | "wagi">): WagiPct | null =>
  stan.wlasneWagi ? (Object.fromEntries(SKLADOWE.map((id) => [id, stan.wagi[id].trim() === "" ? 0 : Number(stan.wagi[id])])) as WagiPct) : null

export const wejscieWspolczynnika = (stan: PolaWspolczynnika): WspolczynnikInput => ({
  produkcjaNajgorszyMiesiacKwh: liczba(stan.produkcja),
  zapotrzebowanieNajgorszyMiesiacKwh: liczba(stan.zapotrzebowanie),
  autonomiaDni: liczba(stan.autonomia),
  wymaganaAutonomiaDni: liczba(stan.wymaganaAutonomia),
  liczbaKomponentow: liczba(stan.komponenty),
  liczbaSpof: liczba(stan.spof),
  brakAgregatu: stan.brakAgregatu,
  mocAgregatuKw: liczba(stan.mocAgregatu),
  mocWymaganaAgregatuKw: liczba(stan.mocWymagana),
  oknoReakcjiH: liczba(stan.okno),
  wymaganyCzasReakcjiH: liczba(stan.wymaganyCzas),
  wagiWlasne: wagiZeStanu(stan),
  progSlabegoPunktuPct: liczba(stan.prog),
})

/** Result of Screen 12 recomputed from its saved draft; `null` = Screen 12 was never filled in. */
export function wynikWspolczynnikaZeSzkicu(seed: PolaWspolczynnika | null) {
  return seed ? calculateWspolczynnik(wejscieWspolczynnika(seed)) : null
}
