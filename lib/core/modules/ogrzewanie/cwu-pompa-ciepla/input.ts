/**
 * Moduł 6, Część 2B — dokładka do Ekranu 18 (Grzałki C.W.U.): pompa ciepła w grzaniu wody (dawne 5.30) i zyski
 * z grzania C.W.U. nadwyżką PV — pompa vs grzałka (dawne 5.58). Biblia §6.27.4, §6.27.32.
 * Zasobnik i temperatury przychodzą z pól Ekranu 18; reszta — z karty pompy ciepła (tryb C.W.U.).
 */
export type CwuPompaCieplaInput = {
  /** Pojemność zasobnika [l]. 0 = nie wpisano. */
  pojemnoscL: number
  /** Temperatura wody na starcie [°C]; null = nie wpisano. */
  tStartC: number | null
  /** Temperatura docelowa [°C]; null = nie wpisano. */
  tKoniecC: number | null
  /** Najwyższa temperatura C.W.U., jaką daje pompa ciepła (karta, źródło: zwykle 55–60 °C); null = nie wpisano. */
  tMaxPompyC: number | null
  /** COP pompy w trybie C.W.U. (karta — średni dla tej temperatury wody). 0 = nie wpisano. */
  copCwu: number
  /** Moc grzewcza pompy w trybie C.W.U. [kW] (karta). 0 = nie wpisano. */
  mocCieplnaPompyKw: number
  /** Moc grzałki dogrzewającej [kW] — do czasu dogrzewu ponad temperaturę pompy; 0 = bez czasu dogrzewu. */
  mocGrzalkiKw: number
  /** Nadwyżka PV w czasie grzania pompą [kW] — opcjonalna; 0 = nie liczymy udziału PV. */
  mocPvKw: number
}
