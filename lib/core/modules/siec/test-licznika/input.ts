/**
 * M14 — D12 / F11 „Test licznika i reklamacja” (shared screen, Wzorzec D + G). Calculator part:
 * power from the meter LED, `03_M14_Dom_i_Firma_Siec.md` §8; opracowanie §8.6 ✅:
 * `P = 3600 · n / (t[s] · stała [imp/kWh])` (counting the time of n pulses — smaller error at low load).
 */
export type TestLicznikaInput = {
  /** Number of pulses counted. 0 = not entered. */
  liczbaImpulsow: number
  /** Time of those pulses [s]. 0 = not entered. */
  czasS: number
  /** Meter constant from the nameplate [imp/kWh]. 0 = not entered. */
  stalaImpKwh: number
  /** Optional: known power of the only load switched on [W]; null = not compared. */
  mocOdbiornikaW: number | null
}
