/**
 * Ekran 24, Moduł 3 "Instalacja PV" — "Czystość i śnieg na panelach"
 * (scala dawne: 2.16, 2.40, 2.44 — docs/zrodla/Tresc_Modul_3_PV_Ekrany.md).
 * Wzorzec C — akordeon: trzy tematy uzupełniające się, każdy z osobną, lekką logiką
 * (docs/standards/08-ui-ux.md, 8.2). Nie ma tu jednego werdyktu — to informacja
 * z lokalnymi obliczeniami tam, gdzie źródło podaje konkretne liczby.
 */

/** Sekcja "Kąt a samooczyszczanie" (dawne 2.44). */
export type KatSamooczyszczaniaInput = {
  katStopni: number
}

/** Sekcja "Harmonogram czyszczenia — live" (dawne 2.40). */
export type HarmonogramCzyszczeniaInput = {
  /** Zmierzony spadek produkcji względem oczekiwanej dla warunków [%]. */
  spadekProdukcjiPct: number
  /** Czy w ciągu najbliższych kilku dni prognozowany jest deszcz (może naturalnie umyć panele)? */
  deszczWCiaguKilkuDni: boolean
}
