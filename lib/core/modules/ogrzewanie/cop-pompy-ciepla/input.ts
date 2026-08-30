/**
 * Ekran 5, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Pompa ciepła — COP/SCOP w funkcji
 * temperatury" (dawne 5.5, docs/domena/Tresc_Modul_6_Ogrzewanie_Ekrany.md). Wzorzec D-lite:
 * COP to "mnożnik" — pompa ciepła nie produkuje ciepła z niczego, tylko przenosi je z zewnątrz,
 * zużywając mniej prądu niż grzałka elektryczna.
 */

export type CopPompyCieplaInput = {
  /** Zapotrzebowanie na moc cieplną w danym momencie [kW]. */
  mocCieplnaKw: number
  /** COP przy aktualnej temperaturze zewnętrznej — z krzywej COP pompy (karta katalogowa) lub zmierzony. */
  cop: number
}
