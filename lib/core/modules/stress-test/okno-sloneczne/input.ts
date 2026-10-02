/**
 * Ekran 15, Moduł 7 "Stress-test zimowy" — "Strategia maksymalizacji ładowania w krótkim oknie słonecznym"
 * (dawne 6.22, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md; Biblia §7.21). Wzorzec D.
 *
 * The window's PV energy comes from Module 3 (or the forecast) and is entered by the user, like the SoC (live).
 */
export type OknoSloneczneInput = {
  /** PV energy produced in the window [kWh]. 0 = not entered. */
  energiaOknaKwh: number
  /** Consumption of the house during the window, supplied directly [kWh] — optional, 0 = none. */
  zuzycieWOknieKwh: number
  /** Usable battery capacity [kWh]. 0 = not entered. */
  pojemnoscBateriiKwh: number
  /** State of charge at the start of the window [%]; null = not entered. */
  socStartPct: number | null
  /** Energy of the BMS heaters needed before the battery may charge [kWh] — 0 = the battery does not need heating. */
  grzalkiBmsKwh: number
  /** Hot water tank volume [l] — optional, 0 = no boiler. */
  bojlerL: number
  /** Tank temperature at the start [°C]; null = not entered. */
  bojlerTStartC: number | null
  /** Target tank temperature [°C]; null = not entered. */
  bojlerTCelC: number | null
}
