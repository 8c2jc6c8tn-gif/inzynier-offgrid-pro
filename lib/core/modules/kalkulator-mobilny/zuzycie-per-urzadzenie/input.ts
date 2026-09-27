/**
 * Ekran 11, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Kalkulator zużycia energii per urządzenie
 * — moduł zbiorczy" (scala dawne 8.23–8.28 + 8.15, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md).
 * Wzorzec D: `zużycie_dobowe = moc × czas_pracy`, dla urządzeń cyklicznych (lodówka, klimatyzator)
 * × współczynnik załączenia sprężarki.
 */

export type PozycjaZuzycia = {
  id: string
  nazwa: string
  /** Moc znamionowa [W]. 0 = pusty wiersz. */
  mocW: number
  /** Czas pracy (włączenia) na dobę [h], 0–24. 0 = pusty wiersz. */
  godzinNaDobe: number
  /** Urządzenie cykliczne — sprężarka/grzałka załącza się i wyłącza (lodówka, klimatyzator). */
  cykliczne: boolean
  /** Współczynnik pracy (załączenia) [%] — wymagany tylko dla cyklicznych. 0 = jeszcze nie wpisano. */
  wspolczynnikPracyPct: number
}

export type ZuzyciePerUrzadzenieInput = {
  urzadzenia: PozycjaZuzycia[]
}
