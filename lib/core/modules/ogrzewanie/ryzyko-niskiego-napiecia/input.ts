/**
 * Ekran dodatkowy, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Ryzyko wyłączenia pompy
 * przy niskim napięciu" (dawne 5.63, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Część 2C,
 * Wzorzec D). Przy rozładowanej baterii napięcie systemu off-grid spada — jeśli spadnie poniżej
 * progu wymaganego przez pompę ciepła, ta wyłączy się w najgorszym możliwym momencie (mróz +
 * rozładowana bateria).
 */

export type RyzykoNiskiegoNapieciaInput = {
  /** Minimalne napięcie pracy pompy ciepła [V], z karty katalogowej. 0 = jeszcze nie wpisano. */
  minNapiecieRoboczeV: number
  /**
   * Aktualne napięcie systemu off-grid [V]. Docelowo auto z Modułu 4 (live) — dziś pole ręcznego
   * wpisu. 0 = jeszcze nie wpisano.
   */
  aktualneNapiecieSystemuV: number
}
