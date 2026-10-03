/**
 * Module 7 "Stress-test zimowy" — Screen 24 "Falownik przy odkształconych obciążeniach (THD)"
 * (dawne 6.38→7.36, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Pattern D.
 *
 * The source gives only an illustration (THD 25% → a 5 kW inverter delivers 4.1 kW) and no formula, so the
 * derating table (THD → share of the rated power) is typed in by the user from the inverter's datasheet.
 * The app assumes no coefficient (Directive #1).
 */

/** One point of the manufacturer's derating curve. */
export type PunktKrzywejThd = {
  /** Current THD of the load [%]. */
  thdPct: number
  /** Share of the rated power the inverter can deliver at this THD, 0..1. */
  wspolczynnik: number
}

export type FalownikThdInput = {
  /** Rated active power of the inverter [kW]. 0 = not entered. */
  mocZnamionowaKw: number
  /** Active power of the load [kW]. 0 = not entered. */
  mocObciazeniaKw: number
  /** THD of the load current [%]; null = not entered. */
  thdPct: number | null
  /** Derating table from the datasheet; at least 2 points, THD strictly increasing. */
  tabela: PunktKrzywejThd[]
}
