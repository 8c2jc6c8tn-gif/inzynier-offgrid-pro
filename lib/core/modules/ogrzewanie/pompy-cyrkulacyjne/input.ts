/**
 * Ekran 15, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Pompy cyrkulacyjne — dobór"
 * (dawne 5.15, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Wzorzec D). Porównanie zużycia
 * energii pompy obiegowej stałoobrotowej vs elektronicznej (PWM).
 */

export type PompyCyrkulacyjneInput = {
  /** Moc obecnej pompy obiegowej (typowo stałoobrotowa 100-150 W) [W]. 0 = jeszcze nie wpisano. */
  mocObecnejPompyW: number
  /** Moc rozważanej pompy elektronicznej PWM (typowo 5-50 W) [W]. 0 = jeszcze nie wpisano. */
  mocNowejPompyW: number
  /**
   * Godziny pracy pompy na dobę [h]. Źródło opisuje profil "ciągły/sterowany" bez wzoru
   * przeliczającego "sterowany" na konkretną liczbę godzin — pole ręcznego wpisu (D16), z
   * podpowiedzią "24 dla pracy ciągłej (24/7)". 0 = jeszcze nie wpisano.
   */
  godzinyPracyDobowoH: number
}
