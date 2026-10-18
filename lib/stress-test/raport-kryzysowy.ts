/**
 * M7/E3 „Raport kryzysowy” (dawne 6.3, Wzorzec G): a summary of the winter screens — no inputs of its own, nothing recomputed
 * with a second model. Each part is the result of its screen's engine from that screen's saved draft; a part whose screen is
 * not filled in is reported as missing (never as zero). Pure functions — the page reads the drafts and renders the texts.
 */
import type { CalcResult } from "@/lib/core/calc-result"
import type { DeficytyMiesieczneResult } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import type { SymulacjaMrozuResult, WynikScenariusza } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import type { SkladowaId } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/constants"
import type { WspolczynnikResult } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/calculator"
import type { WspolczynnikInput } from "@/lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/input"

const uzyteczny = (status: CalcResult<unknown>["status"]) => status === "VALID" || status === "VALID_WITH_WARNINGS"

export type CzescRaportu = "symulacja" | "deficyty" | "blackout" | "wspolczynnik"

/**
 * Optional numbers typed on the report page to turn the missing winter energy into a number of panels. Either one is enough:
 * the yield of one panel in the worst month [kWh] (e.g. from the panel comparison), or the number of panels installed today (then the yield of one panel
 * is the worst-month production ÷ that number, i.e. identical panels in the same setting).
 */
export type PaneleDoRaportu = { liczbaDzis: number | null; uzyskPaneluKwh: number | null }

export type DodatkowePanele = {
  /** Panels to add so that the worst month's production reaches the demand. */
  sztuk: number
  /** Yield of one panel in the worst month [kWh] the count rests on (typed, or worst-month production ÷ panels today). */
  uzyskPaneluKwh: number
  /** What the count rests on: the typed yield of one panel, or the typed number of panels installed today. */
  zrodlo: "uzysk-panelu" | "liczba-paneli"
}

export type DaneRaportu = {
  /** Optional, typed on the report page; `null`/missing = no panel count is given. */
  panele?: PaneleDoRaportu | null
  symulacja: CalcResult<SymulacjaMrozuResult> | null
  deficyty: CalcResult<DeficytyMiesieczneResult> | null
  /** From `zBlackoutu`: days the store lasts without sun vs. the scenario length. */
  blackout: { autonomiaDni: number; wymaganaAutonomiaDni: number; dodatkowaPojemnoscKwh?: number | null } | null
  wspolczynnik: { wynik: CalcResult<WspolczynnikResult>; wejscie: WspolczynnikInput } | null
}

export type Raport = {
  /** Parts with data, in the source order; the rest is in `brakujace`. */
  dostepne: CzescRaportu[]
  brakujace: CzescRaportu[]
  symulacja: {
    scenariusze: WynikScenariusza[]
    /** The scenario with the most energy missing; `null` when no scenario has a shortfall. */
    najgorszy: WynikScenariusza | null
    ogrzewanieWPopycie: boolean
  } | null
  deficyty: { sumaDeficytKwh: number; sumaGodzin: number; sumaPaliwaL: number; sumaKosztZl: number; miesiacNajdluzszy: number | null; miesiecyZDeficytem: number } | null
  blackout: {
    autonomiaDni: number
    wymaganaAutonomiaDni: number
    wystarcza: boolean
    /** Missing nominal battery capacity to last the whole scenario [kWh], from the Blackout screen's own model; `null` when the screen gives none, 0 when enough. */
    dodatkowaPojemnoscKwh: number | null
  } | null
  wspolczynnik: {
    wskaznikPct: number | null
    najslabsza: { id: SkladowaId; wynikPct: number } | null
    slabePunkty: SkladowaId[]
    brakujaceSkladowe: SkladowaId[]
    /** Worst-month coverage and what is missing, from the two numbers typed on Screen 12; `null` when either is missing. */
    pokrycieNajgorszegoMiesiaca: { pokrycieProc: number; brakKwh: number; brakProc: number; wzrostPvPct: number | null; dodatkowePanele: DodatkowePanele | null } | null
  } | null
  /** Something in the report needs a generator or another source, or reveals a weak point. */
  wymagaUwagi: boolean
}

export function zbudujRaport(d: DaneRaportu): Raport {
  const sym = d.symulacja && uzyteczny(d.symulacja.status) && d.symulacja.value.scenariusze.length > 0 ? d.symulacja.value : null
  const def = d.deficyty && uzyteczny(d.deficyty.status) ? d.deficyty.value : null
  const wsp = d.wspolczynnik && uzyteczny(d.wspolczynnik.wynik.status) ? d.wspolczynnik : null

  const symulacja: Raport["symulacja"] = sym
    ? {
        scenariusze: sym.scenariusze,
        najgorszy: sym.scenariusze.reduce<WynikScenariusza | null>((a, s) => (s.deficytMiesiacaKwh > (a?.deficytMiesiacaKwh ?? 0) ? s : a), null),
        ogrzewanieWPopycie: sym.ogrzewanieWPopycie,
      }
    : null
  const deficyty: Raport["deficyty"] = def
    ? {
        sumaDeficytKwh: def.sumaDeficytKwh,
        sumaGodzin: def.sumaGodzin,
        sumaPaliwaL: def.sumaPaliwaL,
        sumaKosztZl: def.sumaKosztZl,
        miesiacNajdluzszy: def.miesiacNajdluzszy,
        miesiecyZDeficytem: def.miesiace.length,
      }
    : null
  const blackout: Raport["blackout"] = d.blackout
    ? { ...d.blackout, dodatkowaPojemnoscKwh: d.blackout.dodatkowaPojemnoscKwh ?? null, wystarcza: d.blackout.autonomiaDni >= d.blackout.wymaganaAutonomiaDni }
    : null
  const wspolczynnik: Raport["wspolczynnik"] = wsp
    ? {
        wskaznikPct: wsp.wynik.value.wskaznikPct,
        najslabsza: wsp.wynik.value.najslabsza,
        slabePunkty: wsp.wynik.value.slabePunkty,
        brakujaceSkladowe: wsp.wynik.value.brakujace,
        pokrycieNajgorszegoMiesiaca: pokrycie(wsp.wejscie, d.panele ?? null),
      }
    : null

  const wszystkie: [CzescRaportu, unknown][] = [
    ["symulacja", symulacja],
    ["deficyty", deficyty],
    ["blackout", blackout],
    ["wspolczynnik", wspolczynnik],
  ]
  const wymagaUwagi =
    (symulacja?.najgorszy ?? null) !== null ||
    (deficyty?.sumaDeficytKwh ?? 0) > 0 ||
    blackout?.wystarcza === false ||
    (wspolczynnik?.slabePunkty.length ?? 0) > 0

  return {
    dostepne: wszystkie.filter(([, v]) => v !== null).map(([k]) => k),
    brakujace: wszystkie.filter(([, v]) => v === null).map(([k]) => k),
    symulacja,
    deficyty,
    blackout,
    wspolczynnik,
    wymagaUwagi,
  }
}

/**
 * Worst-month coverage from the two numbers typed on Screen 12. `wzrostPvPct` is plain proportion, no sizing model: how much more PV energy the worst month
 * needs to equal the demand, (demand / production − 1) · 100, for the same weather (production scales with installed power). `null` when the production is 0
 * (a percentage of zero is undefined) or there is no shortfall. The number of panels follows from the yield of one panel, which this report does not know.
 */
/**
 * Number of extra panels from the shortfall: `ceil(shortfall / yield of one panel)`. The typed yield of one panel wins; otherwise the yield is the worst-month
 * production divided by the typed number of panels installed today (identical panels, same setting). `null` without a shortfall, without a usable number
 * (yield ≤ 0, a non-integer or non-positive count, production 0) — never a guess. The result ignores space, strings and the voltage window of the inverter.
 */
export function dodatkowePaneleZBraku(brakKwh: number, produkcjaKwh: number, p: PaneleDoRaportu | null): DodatkowePanele | null {
  if (!p || !(brakKwh > 0)) return null
  if (p.uzyskPaneluKwh !== null) {
    return p.uzyskPaneluKwh > 0 && Number.isFinite(p.uzyskPaneluKwh)
      ? { sztuk: Math.ceil(brakKwh / p.uzyskPaneluKwh - 1e-9), uzyskPaneluKwh: p.uzyskPaneluKwh, zrodlo: "uzysk-panelu" }
      : null
  }
  if (p.liczbaDzis !== null && Number.isInteger(p.liczbaDzis) && p.liczbaDzis >= 1 && produkcjaKwh > 0) {
    const uzysk = produkcjaKwh / p.liczbaDzis
    return { sztuk: Math.ceil(brakKwh / uzysk - 1e-9), uzyskPaneluKwh: uzysk, zrodlo: "liczba-paneli" }
  }
  return null
}

function pokrycie(w: WspolczynnikInput, panele: PaneleDoRaportu | null): { pokrycieProc: number; brakKwh: number; brakProc: number; wzrostPvPct: number | null; dodatkowePanele: DodatkowePanele | null } | null {
  const p = w.produkcjaNajgorszyMiesiacKwh
  const z = w.zapotrzebowanieNajgorszyMiesiacKwh
  if (p === null || z === null || !(z > 0) || p < 0) return null
  const pokrycieProc = Math.min(100, (100 * p) / z)
  const brakKwh = Math.max(0, z - p)
  return { pokrycieProc, brakKwh, brakProc: 100 - pokrycieProc, wzrostPvPct: p > 0 && z > p ? (100 * (z - p)) / p : null, dodatkowePanele: dodatkowePaneleZBraku(brakKwh, p, panele) }
}
