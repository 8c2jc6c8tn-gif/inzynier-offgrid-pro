/**
 * Ekran 28, Moduł 4 "Magazyn energii / baterie" — "Kalibracja i dokładność SoC" (dawne 3.31,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D. Coulomb counting w BMS kumuluje błąd
 * bez okresowego pełnego naładowania — źródło podaje jeden konkretny próg czasowy ("po ok. 2
 * tygodniach"), reszta Sekcji B/C (np. "rozjechał się o 12%") to ilustracja, nie osobna liczona
 * wartość — źródło nie podaje wzoru wiążącego czas z wielkością błędu SoC.
 */

export type KalibracjaSocInput = {
  /** Dni od ostatniego pełnego naładowania. `null` = jeszcze nie wpisano — 0 jest prawidłową wartością (dziś było pełne ładowanie). */
  dniOdOstatniegoPelnegoNaladowania: number | null
}
