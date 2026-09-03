/**
 * Ekran 22, Moduł 4 "Magazyn energii / baterie" — "Pobór własny BMS i tryb uśpienia" (dawne
 * 3.24, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D.
 */

export type PoborWlasnyBmsInput = {
  /** Pobór BMS w trybie pracy ciągłej [W] — typowo 5-15W. 0 = jeszcze nie wpisano. */
  poborCiagleW: number
  /** Pobór BMS w trybie uśpienia (deep sleep) [W] — typowo 0,5-1W. 0 = jeszcze nie wpisano. */
  poborUspienieW: number
}
