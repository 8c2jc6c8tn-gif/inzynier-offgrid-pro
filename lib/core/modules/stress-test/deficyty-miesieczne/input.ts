/**
 * Ekran 2, Moduł 7 "Stress-test zimowy" — "Deficyty miesięczne i agregat" (dawne 6.2,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md; Biblia §7.2). Wzorzec D.
 *
 * The monthly shortfalls come from the day-by-day simulation (Screen 1, not built yet) — until then
 * the user enters them per month (e.g. from Module 3 production minus Module 2 demand).
 */
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
}
