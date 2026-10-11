/**
 * Moduł 10, Ekran „Prognoza stanu naładowania i oś czasu” (dawne 12.4 + 12.43, `docs/zrodla/Tresc_Modul_10_AI_Ekrany.md`).
 * Symulacja godzinowa SoC na 24–72 h z profilu dobowego WPISANEGO przez użytkownika (produkcja PV i zużycie w oknach 3-godzinnych)
 * i parametrów baterii z karty. Silnik nie zna pogody ani temperatury — pole puste to `null` (brak danych), nie wartość „typowa”.
 */

/** Number of 3-hour windows of the daily profile (00–03, 03–06, … 21–24). */
export const LICZBA_OKIEN = 8
/** Length of one profile window [h]. */
export const DLUGOSC_OKNA_H = 3
/** Longest forecast [h]. */
export const MAKS_HORYZONT_H = 72

export type PrognozaSocInput = {
  /** Usable battery capacity [kWh]. */
  pojemnoscUzytecznaKwh: number | null
  /** State of charge at the start of the forecast [%]. */
  socStartPct: number | null
  /** Lowest state of charge the user lets the battery reach [%] (discharge limit of the BMS or the user's own floor). */
  socMinPct: number | null
  /** Highest state of charge [%]; `null` = 100 %. */
  socMaksPct: number | null
  /** Charging / discharging efficiency [%]; `null` = 100 % (lossless, with an info). */
  sprawnoscLadowaniaPct: number | null
  sprawnoscRozladowaniaPct: number | null
  /** Power limits of the battery [kW] (from the datasheet or lowered by cold); `null` = no limit. */
  maksMocLadowaniaKw: number | null
  maksMocRozladowaniaKw: number | null
  /** Clock hour at which the forecast starts, 0…23. */
  godzinaStartu: number | null
  /** Forecast length [h], 1…72. */
  horyzontH: number | null
  /** Average PV production [kW] in each of the 8 three-hour windows of a day (index 0 = 00–03); `null` = not entered. */
  produkcjaKw: readonly (number | null)[]
  /** Average consumption [kW] in the same windows. */
  zuzycieKw: readonly (number | null)[]
  /** PV production as a share of the entered daily profile on each forecast day (24 h blocks from the start) [%]; `null` = 100 %. */
  wspolczynnikDniPct: readonly (number | null)[]
}
