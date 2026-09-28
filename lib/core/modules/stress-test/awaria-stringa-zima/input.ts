/**
 * Moduł 7 "Stress-test zimowy" — Ekran 26 "Awaria jednego stringa PV w zimie" (dawne 6.40;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Produkcję całej instalacji i uszkodzonego stringu w
 * najgorszym miesiącu wpisuje user (M3 — produkcja per string nie jest jeszcze wyliczana automatycznie).
 */

export type AwariaStringaZimaInput = {
  /** Produkcja całej instalacji w najgorszym miesiącu [kWh/dobę]. */
  produkcjaCalkowitaKwhDoba: number | null
  /** Produkcja uszkodzonego stringu w tym miesiącu [kWh/dobę]. */
  produkcjaStringuKwhDoba: number | null
  /** Zapotrzebowanie dobowe w tym miesiącu [kWh/dobę]. */
  zapotrzebowanieKwhDoba: number | null
  /** Pojemność znamionowa baterii [kWh] — opcjonalnie, do liczby dni. */
  pojemnoscBateriiKwh: number | null
  /** Użyteczna głębokość rozładowania [%]. */
  dodPct: number | null
  sprawnoscFalownikaPct: number | null
}
