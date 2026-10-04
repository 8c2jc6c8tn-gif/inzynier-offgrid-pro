/**
 * Module 7 "Stress-test zimowy" — Screen 25 "Deep Winter Energy Budget" (dawne 6.39→7.37,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Pattern D.
 *
 * Budget of ONE winter month, checked on day `d` against the plan. Every number is typed by the user
 * (plan from Modules 2/3/4/6 or the user's own estimate, consumption from a meter) — the app assumes none.
 */

/** Spending categories of the plan (the source: heating, hot water, pumps, lighting + the rest). */
export type CelBudzetu = "ogrzewanie" | "cwu" | "pompy" | "oswietlenie" | "inne"

export const CELE_BUDZETU: readonly CelBudzetu[] = ["ogrzewanie", "cwu", "pompy", "oswietlenie", "inne"]

export type CelBudzetuWejscie = {
  cel: CelBudzetu
  /** Share of the whole plan given to this category [%]. */
  udzialPlanuPct: number
  /** Consumption of this category from day 1 to day `d` [kWh]. */
  zuzycieKwh: number
}

export type DeepWinterBudgetInput = {
  /** Days in the month, 28..31. 0 = not entered. */
  dniMiesiaca: number
  /** Current day of the month, 1..N (consumption below is counted from day 1 up to and including it). 0 = not entered. */
  biezacyDzien: number
  /** Planned PV energy of the month [kWh]. */
  planPvKwh: number
  /** Planned generator energy of the month [kWh]. */
  planAgregatKwh: number
  /** Usable battery reserve planned for the month [kWh]. */
  planMagazynKwh: number
  /** Consumption accumulated from day 1 to day `d` [kWh]. 0 = not entered. */
  zuzycieNarastajaceKwh: number
  /** Optional split of the plan into categories; empty = no split. */
  cele: CelBudzetuWejscie[]
  /** Optional: share of heating in the consumption [%]; 0 = not entered. */
  udzialOgrzewaniaPct: number
  /** Optional: mean indoor–outdoor temperature difference [K]; 0 = not entered. */
  roznicaTemperaturK: number
  /**
   * Optional: the user's own measured saving per 1 K lower indoor temperature [kWh/day]; 0 = not entered.
   * When given, it replaces the stationary approximation 1/ΔT (needs no ΔT).
   */
  oszczednoscKwhDobaNaK: number
}
