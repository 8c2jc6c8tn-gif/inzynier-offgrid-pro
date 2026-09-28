/**
 * Moduł 7 "Stress-test zimowy" — Ekran 20 "Symulacja bez wentylacji (Frozen Recuperation)" (dawne 6.30;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Parametry centrali z M6/E3 i instrukcji producenta
 * wpisuje user — źródło podaje „−15°C” i „grzałka 200 W” tylko jako przykład.
 */

export type BezRekuperacjiInput = {
  /** Wydajność centrali [m³/h]. */
  strumienM3H: number | null
  /** Sprawność odzysku rekuperatora [%]. */
  sprawnoscOdzyskuPct: number | null
  tempWewnC: number | null
  /** Najniższa temperatura zewnętrzna w scenariuszu [°C]. */
  tempZewnC: number | null
  /** Temperatura zewnętrzna, poniżej której wymiennik zamarza wg producenta [°C]. null = nie podano. */
  tempZamarzaniaWymiennikaC: number | null
  /** Temperatura powietrza za nagrzewnicą wstępną wymagana przez producenta [°C]. null = nie podano. */
  tempZaNagrzewnicaC: number | null
}
