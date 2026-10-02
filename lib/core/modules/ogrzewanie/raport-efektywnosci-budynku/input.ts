/**
 * Moduł 6, Część 2B — dokładka do Ekranu 1: raport efektywności cieplnej budynku (dawne 5.40) i bilans strat
 * (dawne 5.67, część „które elementy wpływają najwięcej”). Biblia §6.27.14, §6.27.41. Straty przegród i wentylacji
 * przychodzą z wyniku Ekranu 1; reszta od usera.
 */
export type PozycjaStraty = {
  /** Nazwa przegrody albo „wentylacja” — tekst do wyświetlenia. */
  nazwa: string
  /** Strata przy temperaturze obliczeniowej [W]. */
  strataW: number
}

export type RaportEfektywnosciInput = {
  pozycje: readonly PozycjaStraty[]
  /** Ciepło na ogrzewanie w roku [kWh] (Ekran 1 — suma miesięcy, albo z rachunków). 0 = nie wpisano. */
  cieploRokKwh: number
  /** Powierzchnia ogrzewana [m²]. 0 = nie wpisano. */
  powierzchniaM2: number
  /** COP źródła ciepła (grzałka = 1). 0 = nie wpisano. */
  cop: number
  /** Cena energii elektrycznej [zł/kWh]. 0 = nie wpisano. */
  cenaZlKwh: number
}
