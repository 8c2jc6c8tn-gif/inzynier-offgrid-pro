/**
 * Moduł 7 "Stress-test zimowy" — "Ładowanie magazynu z agregatu" (owner decision 1A, 05.10.2026). The daily kWh
 * balance of M7/E2 cannot answer how much power is left for charging (it has no kW at a given hour), so this screen
 * takes the instantaneous values from the user: generator power, charger/inverter charging power, emergency-line
 * loads and the SOC thresholds at which the generator starts and stops. Nothing is assumed (Directive #1).
 */

export type LadowanieZAgregatuInput = {
  /** Generator rated (continuous) power [kW]. */
  mocAgregatuKw: number | null
  /** Maximum charging power of the charger/inverter on the generator input [kW] (datasheet or setting). */
  mocLadowarkiKw: number | null
  /** Power of the loads on the emergency line running while the generator charges [kW]; 0 = none. */
  mocOdbiornikowKw: number | null
  /** Usable store capacity [kWh]. */
  pojemnoscKwh: number | null
  /** SOC at which the generator starts [%]. */
  socStartPct: number | null
  /** SOC at which the generator stops [%]. */
  socStopPct: number | null
  /** Charging efficiency AC → store [%] (charger datasheet; not the round-trip value). */
  sprawnoscLadowaniaPct: number | null
  /** Fuel use [l/h] read from the generator datasheet at the load shown by the screen; null = not given. */
  zuzyciePaliwaLH: number | null
  /** Fuel price [zł/l]; null = not given. */
  cenaPaliwaZlL: number | null
}
