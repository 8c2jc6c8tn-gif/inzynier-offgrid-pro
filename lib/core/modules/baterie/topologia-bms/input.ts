/**
 * Ekran 26, Moduł 4 "Magazyn energii / baterie" — "Topologia BMS (Common Port vs Separate
 * Port)" (dawne 3.29, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec B (karty
 * porównawcze) z wbudowanym elementem D — Sekcja C daje konkretny, policzalny przykład
 * ("BMS Common Port 100A, falownik pobiera 150A przy rozruchu → wybierz Separate Port"), więc
 * poza opisowym porównaniem dwóch topologii dodano proste sprawdzenie tego samego progu.
 */

export type TopologiaBmsInput = {
  /** Prąd znamionowy portu Common Port wybranego BMS [A]. 0 = jeszcze nie wpisano. */
  bmsCommonPortA: number
  /** Szczytowy prąd pobierany przez falownik przy rozruchu [A]. 0 = jeszcze nie wpisano. */
  falownikPradRozruchuA: number
}
