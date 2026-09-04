/**
 * Ekran 2, Moduł 4 "Magazyn energii / baterie" — "Sugestia napięcia systemowego (12/24/48V)"
 * (dawne 3.2, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D.
 */

export type NapiecieSystemoweInput = {
  /** Obciążenie szczytowe [W]. 0 = jeszcze nie wpisano. */
  mocSzczytowaW: number
}
