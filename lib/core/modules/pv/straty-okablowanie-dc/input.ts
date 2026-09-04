/**
 * Ekran 8, Moduł 3 "Instalacja PV" — "Straty na okablowaniu DC (efekt Joule'a)" (dawne 2.14,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzorzec D.
 */

export type StratyOkablowanieDcInput = {
  /** Długość kabla panel→falownik (jeden odcinek, w jedną stronę) [m]. 0 = jeszcze nie wpisano. */
  dlugoscKablaM: number
  /** Prąd roboczy (Imp) [A]. 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie robocze (Vmp) [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Przekrój kabla [mm²]. 0 = jeszcze nie wpisano. */
  przekrojMm2: number
}
