/**
 * Ekran 10, Moduł 4 "Magazyn energii / baterie" — "Ochrona przed wilgocią i kondensacją"
 * (dawne 3.11, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D. Źródło każe
 * policzyć "punkt rosy dla zadanej temperatury/wilgotności", ale nie podaje samego wzoru —
 * użyty standardowy wzór meteorologiczny Magnusa-Tetensa (stałe dla wody ciekłej, a=17,27,
 * b=237,7°C), zweryfikowany niezależnie w Pythonie i zgodny z własnym przykładem źródła
 * (-5°C/85% → -7°C, wzór daje -7,12°C).
 */

export type OchronaWilgocInput = {
  /** Temperatura otoczenia [°C], do wzoru punktu rosy. `null` = jeszcze nie wpisano. */
  temperaturaOtoczeniaC: number | null
  /** Wilgotność względna [%]. 0 = jeszcze nie wpisano. */
  wilgotnoscPct: number
  /** Zmierzona/spodziewana temperatura obudowy lub ogniw [°C] — porównywana z punktem rosy. `null` = jeszcze nie wpisano. */
  temperaturaObudowyC: number | null
  /** Czy miejsce jest narażone na wilgoć (garaż, komora zewnętrzna). */
  srodowiskoWilgotne: boolean
  /** Kod IP obudowy (np. 55 dla IP55). 0 = jeszcze nie wybrano. */
  ipKod: number
}
