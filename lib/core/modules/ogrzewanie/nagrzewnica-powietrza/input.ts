/**
 * Moduł 6 "Ogrzewanie" — "Nagrzewnica powietrza (typu webasto) vs ogrzewanie prądem" (D28 + owner decision
 * 02.10.2026: "dogrzewanie przez webasto, dogrzewanie powietrza — jest tanio i mało prądu potrzebuje, więc wyjdzie
 * taniej niż grzać prądem"). A compact companion of `koszty-ogrzewania` (season ranking of many sources): this
 * one prices the heater's own small electric draw, shows its drain on the battery and the break-even price of
 * electricity.
 *
 * Every heater figure comes from the user's datasheet (Directive #1) — the app assumes none. 0 = not entered.
 */
export type NagrzewnicaPowietrzaInput = {
  /** Heat output at the chosen setting [kW] — datasheet. */
  mocCieplnaKw: number
  /** Fuel use at that output [l/h] — datasheet. */
  zuzyciePaliwaLH: number
  /** Fuel price [PLN/l]. */
  cenaPaliwaZlL: number
  /** Own electric draw while running [W] (fan, fuel pump, glow plug while running) — datasheet. 0 = not counted. */
  poborPraduW: number
  /** Electric energy of one start (glow plug) [Wh] — datasheet. 0 = not counted. */
  energiaRozruchuWh: number
  /** Starts per day. 0 = not counted. */
  rozruchyNaDobe: number
  /** Cost of 1 kWh of electricity in winter [PLN/kWh] (stored PV, generator, grid). 0 = not entered (no comparison). */
  cenaPraduZlKwh: number
  /** COP of the electric alternative; 0 = resistive heating (COP = 1, as in `koszty-ogrzewania`). */
  copElektryczne: number
  /** Heat needed per day [kWh/day]. 0 = only per-kWh figures. */
  zapotrzebowanieCieplaDobaKwh: number
  /** Number of heating days (for the season total). 0 = no season total. */
  dniOgrzewania: number
  /** Usable battery capacity [kWh]. 0 = not entered (no % of the battery). */
  pojemnoscBateriiKwh: number
}
