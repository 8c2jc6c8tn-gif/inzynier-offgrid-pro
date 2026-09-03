/**
 * Ekran 12, Moduł 4 "Magazyn energii / baterie" — "Ograniczenie prądu ładowania w mrozie
 * (Cold C-Rate)" (dawne 3.13, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D — tabela
 * limitów C-rate wg temperatury ogniwa.
 */

export type ColdCRateInput = {
  /** Temperatura ogniwa [°C], live z BMS. `null` = jeszcze nie zmierzono — 0°C jest prawidłowym pomiarem. */
  temperaturaOgniwaC: number | null
  /** Pojemność pakietu [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
}
