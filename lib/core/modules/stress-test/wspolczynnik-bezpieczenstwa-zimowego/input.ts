import type { WagiPct } from "./constants"

/**
 * Ekran 12, Moduł 7. Every component value is a raw number the user enters (or inserts from an existing winter
 * screen — see `zrodla.ts`); the mapping of the raw values to a 0–100% score is in `scoring.ts`.
 * `null` = not entered. A component with a missing value makes the result INCOMPLETE (no total from a part).
 */
export type WspolczynnikInput = {
  /** Component 1: PV production in the worst month [kWh/month]. */
  produkcjaNajgorszyMiesiacKwh: number | null
  /** Component 1: demand in the same month [kWh/month]. */
  zapotrzebowanieNajgorszyMiesiacKwh: number | null
  /** Component 2: days the system keeps running without sun [days] (Ekran 4 „Blackout”). */
  autonomiaDni: number | null
  /** Component 2: days the system must survive [days] (source Ekran 4: 10–14). */
  wymaganaAutonomiaDni: number | null
  /** Component 3: number of components checked for a single point of failure (Ekran 10). */
  liczbaKomponentow: number | null
  /** Component 3: how many of them have no redundancy (SPOF). */
  liczbaSpof: number | null
  /** Component 4: there is no generator at all → the component scores 0%. */
  brakAgregatu: boolean
  /** Component 4: generator rated power [kW]. */
  mocAgregatuKw: number | null
  /** Component 4: power the generator must carry [kW] (peak load it has to supply). */
  mocWymaganaAgregatuKw: number | null
  /** Component 5: time the system itself keeps freeze protection running [h] (Ekran 6, critical loads). */
  oknoReakcjiH: number | null
  /** Component 5: time you need to react — arrive, start the generator, drain the pipes [h]. */
  wymaganyCzasReakcjiH: number | null
  /** The user's own weights [%]; null = the provisional default set. */
  wagiWlasne: WagiPct | null
  /**
   * Weak-point threshold [%] entered by the user (D75): a component below it is a weak point (🟡). null = not
   * entered → no weak points are flagged, the components are only ranked from the weakest.
   */
  progSlabegoPunktuPct: number | null
}
