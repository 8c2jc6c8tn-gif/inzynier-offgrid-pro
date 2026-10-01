/**
 * Ekran 18, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Grzałki elektryczne do C.W.U." (dawne 5.22,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.22). Wzorzec D.
 */

/** "stala" = grzałka włączona na pełną moc (termostat); "regulator-pv" = moc dopasowana do nadwyżki PV. */
export type SterowanieGrzalki = "stala" | "regulator-pv"

export type GrzalkaCwuInput = {
  /** Pojemność zasobnika [l] (Ekran 17). 0 = nie wpisano. */
  pojemnoscL: number
  /** Temperatura wody na starcie [°C]; null = nie wpisano. */
  tStartC: number | null
  /** Temperatura docelowa [°C]; null = nie wpisano. */
  tKoniecC: number | null
  /** Moc grzałki [kW] — tabliczka. 0 = nie wpisano. */
  mocGrzalkiKw: number
  /** Dostępna nadwyżka PV w czasie grzania [kW] — opcjonalna; 0 = nie liczymy udziału PV. */
  mocPvKw: number
  /** Sposób sterowania — potrzebny tylko z nadwyżką PV; null = nie wybrano. */
  sterowanie: SterowanieGrzalki | null
  /** Moc ciągła falownika [kW] — opcjonalna; 0 = bez sprawdzenia. */
  mocFalownikaKw: number
}
