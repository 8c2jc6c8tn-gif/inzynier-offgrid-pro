/**
 * Moduł 10, Ekran „Prognoza produkcji miesięcznej” (dawne 12.3, `docs/zrodla/Tresc_Modul_10_AI_Ekrany.md`). Prognoza z danych
 * WPISANYCH przez użytkownika: produkcja PV w każdym z ostatnich 12 miesięcy (z falownika, regulatora albo rachunku) i roczna
 * degradacja paneli z karty. Silnik nie zna pogody ani zacienienia przyszłego roku — pola puste to `null` (brak danych), nie wartość „typowa”.
 */
export type PrognozaMiesiecznaInput = {
  /** Production in each calendar month of the LAST 12 months [kWh], index 0 = January … 11 = December; `null` = no data for that month. */
  produkcjaHistoriaKwh: readonly (number | null)[]
  /** Yearly degradation of the panels [%/year], from the datasheet; `null` = not entered (counted as 0, with an info). */
  degradacjaRocznaPct: number | null
  /** First forecast month, 1 = January … 12 = December. */
  miesiacStartu: number | null
  /** How many months ahead to forecast, 1…12. */
  miesiecyNaprzod: number | null
  /** Year-to-year weather swing [%] the user wants the low/high scenario to span; `null` = no scenarios. */
  odchylenieMeteoPct: number | null
}
