/**
 * Module 7 "Stress-test zimowy" — Screen 16 "Turbina wiatrowa jako wsparcie zimowe"
 * (dawne 6.24→7.23, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Pattern D.
 *
 * The source gives only an illustration (1 kW at 6 m/s → 3 kWh/day) and no power curve, so the curve, the cut-out
 * speed and the availability/loss factor are typed in by the user from the turbine's datasheet (Directive #1).
 */

/** One point of the turbine's power curve. */
export type PunktKrzywejMocy = {
  /** Wind speed at hub height [m/s]. */
  predkoscMs: number
  /** Electrical power at this speed [kW]. */
  mocKw: number
}

export type TurbinaWiatrowaInput = {
  /** Mean wind speed at hub height [m/s]. 0 = not entered. */
  sredniaPredkoscMs: number
  /** Power curve from the datasheet; at least 3 points, speed strictly increasing, power >= 0. */
  krzywa: PunktKrzywejMocy[]
  /** Cut-out speed [m/s]: above it the turbine stops (P = 0). 0 = not entered. */
  predkoscWylaczeniaMs: number
  /** Availability and losses factor 0..1 (downtime, wake, electrical losses) — typed in explicitly; null = not entered. */
  wspolczynnikDostepnosciStrat: number | null
}
