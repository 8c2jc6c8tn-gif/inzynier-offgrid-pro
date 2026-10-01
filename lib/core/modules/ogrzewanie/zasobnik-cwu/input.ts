/**
 * Ekran 17, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "System C.W.U. — zasobnik i cyrkulacja"
 * (scala dawne 5.19, 5.20, 5.21; docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.19–§6.21).
 * Wzorzec D.
 */

export type ZasobnikCwuInput = {
  /** Liczba domowników. 0 = nie wpisano. */
  osoby: number
  /** Zużycie C.W.U. na osobę [l/dobę] (źródło E2: ok. 50). 0 = nie wpisano. */
  litrowNaOsobe: number
  /** Temperatura zimnej wody [°C]; null = nie wpisano. */
  tZimnaC: number | null
  /** Temperatura C.W.U. w zasobniku [°C]; null = nie wpisano. */
  tCwuC: number | null
  /** Pojemność zasobnika [l]. 0 = nie wpisano. */
  pojemnoscL: number
  /** Strata postojowa zasobnika UA [W/K] — karta (źródło: np. 0,8 W/K). 0 = nie wpisano. */
  uaWK: number
  /** UA innego (lepszego) zasobnika do porównania [W/K] — opcjonalne; 0 = bez porównania. */
  uaPorownawczyWK: number
  /** Temperatura otoczenia zasobnika [°C]; null = nie wpisano. */
  tOtoczeniaC: number | null
  /** Zasobnik stoi w pomieszczeniu nieogrzewanym (garaż, piwnica) — 🟡 źródła. */
  nieogrzewane: boolean
  /** Długość rur cyrkulacyjnych [m] — opcjonalna; 0 = bez cyrkulacji. */
  dlugoscCyrkulacjiM: number
  /** Strata liniowa izolowanej rury [W/(m·K)] — karta otuliny / producent. */
  strataRuryWmK: number
  /** Temperatura otoczenia rur [°C]; null = nie wpisano. */
  tOtoczeniaRurC: number | null
  /** Ile godzin na dobę pracuje cyrkulacja [h] (ciągła = 24). */
  godzinCyrkulacji: number
  /** Moc pompy cyrkulacyjnej [W] — karta. */
  mocPompyW: number
}
