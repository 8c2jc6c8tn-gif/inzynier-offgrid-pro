/**
 * Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — ekran dodatkowy "Wymiarowanie kolektora gruntowego"
 * (dawne 5.42, Część 2C, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.27.16). Wzorzec A,
 * przełącznik typu: poziomy / pionowy / spiralny.
 */

export type TypKolektora = "poziomy" | "pionowy" | "spiralny"

export type KolektorGruntowyInput = {
  /** Typ kolektora; null = nie wybrano. */
  typ: TypKolektora | null
  /** Moc pompy ciepła [kW] — wskaźniki źródła są podane „na moc pompy”. 0 = nie wpisano. */
  mocPompyKw: number
  /** Poziomy: powierzchnia kolektora na każde 10 kW mocy [m²/10 kW] — z projektu/gruntu (źródło: 60–120). 0 = nie wpisano. */
  m2Na10Kw: number
  /** Poziomy: głębokość ułożenia rur [m] (źródło: 1,2–1,8). null = nie wpisano. */
  glebokoscUlozeniaM: number | null
  /** Poziomy: głębokość przemarzania gruntu w lokalizacji [m] — z mapy stref / projektu. null = nie wpisano. */
  glebokoscPrzemarzaniaM: number | null
  /** Pionowy: moc odbierana z 1 m odwiertu [W/m] — z projektu/gruntu (źródło: 50–70). 0 = nie wpisano. */
  wNaMetr: number
  /** Pionowy: głębokość jednego odwiertu [m] (źródło: 50–100). 0 = nie wpisano. */
  glebokoscOdwiertuM: number
}
