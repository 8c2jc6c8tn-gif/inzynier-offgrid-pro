/**
 * Moduł 7 "Stress-test zimowy" — Ekran 11 "Obciążenie grzałek dachowych i rynnowych (Ice Dam
 * Prevention)" (dawne 6.16, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Wymiary
 * dachu z Modułu 1 nie istnieją jeszcze jako model — długość kabla (rynny, kosze) user wpisuje sam.
 */
export type GrzalkiDachoweInput = {
  /** Łączna długość kabla grzewczego (rynny, rury spustowe, kosze) [m]. null = nie wpisano. */
  dlugoscKablaM: number | null
  /** Moc jednostkowa kabla z karty katalogowej [W/m]. null = nie wpisano. */
  mocNaMetrW: number | null
  /** Czas pracy grzałek na dobę [h]. null = nie wpisano. */
  godzinyPracyNaDobe: number | null
  /** Moc elektryczna pompy ciepła [W] — do porównania ze źródła. null = brak pompy / nie podano. */
  mocPompyCieplaW: number | null
  /** Wolny zapas mocy systemu (falownika) na grzałki [W]. null = nie podano. */
  zapasMocyW: number | null
}
