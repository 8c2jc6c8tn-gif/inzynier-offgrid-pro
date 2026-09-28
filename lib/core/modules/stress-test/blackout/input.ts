/**
 * Moduł 7 "Stress-test zimowy" — Ekran 4 "Pełny scenariusz awaryjny Blackout" (dawne 6.4;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Scenariusz: produkcja PV = 0 przez N dni, bateria
 * rozładowywana do krytycznego minimum. Zużycie dobowe w mrozie wpisuje user (M2/M6) — temperatura działa przez nie.
 */

export type BlackoutInput = {
  /** Pojemność znamionowa baterii [kWh]. */
  pojemnoscKwh: number | null
  /** SoC na początku scenariusza [%]. */
  socStartPct: number | null
  /** Krytyczne minimum SoC [%] — źródło: „np. 10%”. */
  socMinPct: number | null
  /** Sprawność falownika [%]. */
  sprawnoscFalownikaPct: number | null
  /** Zużycie dobowe w mrozie [kWh/dobę]. */
  zuzycieDoboweKwh: number | null
  /** Długość scenariusza bez słońca [dni] — źródło: 10–14. */
  dniScenariusza: number | null
  /** Energia z agregatu na dobę [kWh]. null = bez agregatu. */
  agregatKwhDoba: number | null
}
