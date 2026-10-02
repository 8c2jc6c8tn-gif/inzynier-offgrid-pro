/**
 * Moduł 10 "AI i prognozy", Ekran 5 — "Dynamiczne przesuwanie zadań domowych" (dawne 12.10, Wzorzec D,
 * docs/zrodla/Tresc_Modul_10_AI_Ekrany.md). Sekcja A of the source: PV forecast (Screen 1), the list of
 * pending tasks (laundry, dishwasher, EV charging) and the user's preferences („pranie musi być gotowe do 18:00”).
 */
import type { GodzinaPrognozy } from "../prognozy/input"

export type ZadanieElastyczne = {
  id: string
  /** User label (e.g. „Pranie”) — shown back, not interpreted. */
  nazwa: string
  /** Average power of the appliance while running [kW]. 0 = not entered yet. */
  mocKw: number
  /** Run time [h], in steps of 0,5 h. 0 = not entered yet. */
  czasTrwaniaH: number
  /** Earliest allowed start [h of the day, 0–24], in steps of 0,5 h. */
  najwczesniejOdH: number
  /** Must be finished by [h of the day, 0–24], in steps of 0,5 h (the user's deadline). */
  gotoweDoH: number
}

export type PrzesuwanieZadanInput = {
  /**
   * 24 h forecast in the format of Screen 1 (`prognozy`): one point every 3 h, each the average power [kW]
   * over its 3 h window. Production and base consumption; surplus = production − consumption.
   */
  prognoza: GodzinaPrognozy[]
  /** Tasks in priority order — an earlier task takes the surplus first. */
  zadania: ZadanieElastyczne[]
}
