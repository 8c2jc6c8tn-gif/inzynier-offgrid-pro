/**
 * Moduł 6, Część 2B — dokładka do Ekranu 6 (Cykle odszraniania): defrost w sezonie w kilku scenariuszach pogody
 * (dawne 5.56, Biblia §6.27.30). Moc w czasie defrostu przychodzi z pola Ekranu 6; cykl każdego scenariusza —
 * z karty pompy, historii pracy sterownika albo obserwacji (źródło nie daje modelu pogoda → częstość defrostu).
 */
export type ScenariuszDefrostu = {
  /** Odstęp między startami dwóch defrostów [min]. 0 = nie wpisano. */
  odstepMin: number
  /** Czas jednego defrostu [min]. 0 = nie wpisano. */
  czasDefrostuMin: number
  /** Godziny na dobę w tej pogodzie [h/doba]. 0 = nie wpisano. */
  godzinyDobaH: number
  /** Dni w sezonie z tą pogodą. 0 = nie wpisano. */
  dni: number
}

export type DefrostSezonInput = {
  /** Moc elektryczna w czasie defrostu [kW] (Ekran 6). 0 = nie wpisano. */
  mocDefrostuKw: number
  /** Scenariusze pogody; scenariusz z samymi zerami jest pomijany. */
  scenariusze: readonly ScenariuszDefrostu[]
  /** Zużycie prądu przez pompę w sezonie [kWh] — opcjonalne, do udziału defrostu; 0 = bez udziału. */
  zuzyciePompySezonKwh: number
}
