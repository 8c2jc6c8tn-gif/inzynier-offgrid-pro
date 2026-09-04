/**
 * Ekran 13, Moduł 4 "Magazyn energii / baterie" — "Algorytm końca ładowania (Tail Current /
 * Absorption)" (dawne 3.15, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D.
 * Cykl CC (stały prąd) do napięcia absorpcji, potem CV (stałe napięcie) do spadku prądu poniżej
 * progu końcowego — przykład źródła (280Ah × 0,05C = 14A) potwierdza wzór `I_koncowy = C × Ah`.
 */

export type KoniecLadowaniaInput = {
  /** Pojemność baterii [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
  /** Napięcie absorpcji — cel fazy CC [V]. 0 = jeszcze nie wpisano. */
  napiecieAbsorpcjiV: number
  /** Próg prądu końcowego jako ułamek C (np. 0,05 = 0,05C). 0 = jeszcze nie wpisano. */
  progKoncowyC: number
  /** Aktualny (zmierzony/live) prąd ładowania [A]. `null` = jeszcze nie wpisano. */
  aktualnyPradA: number | null
  /** Aktualne (zmierzone/live) napięcie [V]. `null` = jeszcze nie wpisano. */
  aktualneNapiecieV: number | null
}
