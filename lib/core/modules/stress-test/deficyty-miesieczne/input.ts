/**
 * Ekran 2, Moduł 7 "Stress-test zimowy" — "Deficyty miesięczne i agregat" (dawne 6.2,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md; Biblia §7.2). Wzorzec D.
 *
 * The monthly shortfalls come from the day-by-day simulation (Screen 1, not built yet) — until then
 * the user enters them per month (e.g. from Module 3 production minus Module 2 demand), or the engine
 * derives them from a multi-year daily history (`historia`, owner decision 02.10.2026).
 */

/** What the daily values of a history mean. */
export type RodzajDanychHistorii =
  /** Daily PV energy of the user's array [kWh/day]. */
  | "produkcja-pv-kwh"
  /** Daily irradiation on the array plane [kWh/m²/day]; converted with `przeliczenie`. */
  | "naswietlenie-kwh-m2"

/** Where the history comes from — always shown next to the result (more own data → narrower range). */
export type ZrodloHistorii = "pvgis-seriescalc" | "pomiar-budynku" | "pomiar-miejscowosci" | "wpisane-reczne"

export type RokHistorii = {
  /** Calendar year (decides 365/366 days). */
  rok: number
  /** Daily values from 1 January; `null` = missing day (breaks streaks and windows, never filled). Length ≤ days of the year. */
  dni: (number | null)[]
}

export type HistoriaDobowa = {
  zrodlo: ZrodloHistorii
  rodzaj: RodzajDanychHistorii
  lata: RokHistorii[]
  /** Required for `naswietlenie-kwh-m2`: daily kWh = H × mocPvKwp × wspolczynnikPr (both entered by the user). */
  przeliczenie?: { mocPvKwp: number; wspolczynnikPr: number }
}

/** Choice of the fixed horizon the stock is compared against. */
export type HoryzontZapasu = { rodzaj: "dni"; dni: number } | { rodzaj: "miesiac" }

/**
 * Optional energy store in the daily balance of the history (list entry M7/E2 (a)): PV surplus of a day is
 * carried to the following days instead of being lost. All three values come from the user (datasheet / own
 * decision) — the engine assumes none of them.
 */
export type MagazynHistorii = {
  /** Usable capacity [kWh] (already within the allowed depth of discharge). 0 = no store. */
  pojemnoscUzytecznaKwh: number
  /** Round-trip efficiency [%] applied when charging (as in M14 `bilans-miesieczny`). Required when capacity > 0. */
  sprawnoscPct: number
  /** State of charge on 1 January of every year [% of usable capacity]; 0 = empty (safe side). */
  stanPoczatkowyPct: number
}

/** User parameters of the history analysis. */
export type AnalizaHistorii = {
  /** Resupply gap [days]: the window whose fuel need is sized (1..366). 0 = not entered. */
  oknoDni: number
  /** Percentile [%] of the yearly worst windows used to size the stock (1..100). 0 = not entered (min/median/max only). */
  percentylPct: number
  /** A day is "low" when PV < this share [%] of that day's demand (0..100). 0 = streak statistics off. */
  progSlabegoDniaPct: number
  /** Optional energy store carried between days; absent or capacity 0 = balance without a store (upper bound). */
  magazyn?: MagazynHistorii
}

export type DeficytyMiesieczneInput = {
  /** Energy shortfall per month, January..December [kWh]; 0 = no shortfall in that month. Exactly 12 values. */
  deficytyKwh: number[]
  /** Generator rated power [kW] (Module 2). 0 = not entered yet. */
  mocAgregatuKw: number
  /** Fuel use at the optimal load [l/h] — datasheet. 0 = not entered yet. */
  zuzyciePaliwaLH: number
  /** Fuel price [PLN/l]. 0 = not entered yet. */
  cenaPaliwaZlL: number
  /** Service and oil cost per running hour [PLN/h] — optional, 0 = not counted. */
  kosztSerwisuZlH: number
  /** Fuel stock on site [l] — optional, 0 = not entered (then only an info about the busiest month). */
  zapasPaliwaL: number
  /** Optional: fixed horizon to compare the stock with (worst month prorated to N days). Absent = old per-month check. */
  horyzont?: HoryzontZapasu
  /** Optional: average daily demand per month [kWh/day], 12 values — needed by the history analysis. */
  zapotrzebowanieDobaKwh?: number[]
  /** Optional: multi-year daily PV history (typed so the building's own measurements fit the same slot). */
  historia?: HistoriaDobowa
  /** Optional: parameters of the history analysis. */
  analizaHistorii?: AnalizaHistorii
}
