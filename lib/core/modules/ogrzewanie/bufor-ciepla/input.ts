/**
 * Ekran 14, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Bufor ciepła — dobór pojemności"
 * (dawne 5.14, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Wzorzec D).
 */

export type BuforCieplaInput = {
  /** Moc pompy ciepła [kW]. 0 = jeszcze nie wpisano. */
  mocPompyKw: number
  /** Posiadana/planowana pojemność bufora [l] — do sprawdzenia, czy wystarcza. 0 = jeszcze nie wpisano. */
  pojemnoscBuforaL: number
}
