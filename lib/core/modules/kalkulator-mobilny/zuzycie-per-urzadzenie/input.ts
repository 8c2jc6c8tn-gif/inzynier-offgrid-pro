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
  /**
   * Months of operation (12 flags from January; `true` = the device runs). Absent = every month of the object's use. Only the
   * object-level monthly consumption (`lib/obiekt/`) reads it — the daily sum of this screen is a plain sum of all devices.
   */
  miesiace?: readonly boolean[]
  /**
   * Micro-installation kinds this device belongs to (one shared list, chosen per site: owner decision 11.10.2026). Absent = every kind.
   * Only the object-level monthly consumption (`lib/obiekt/`) reads it, like `miesiace`.
   */
  obiekty?: readonly ObiektMikroinstalacji[]
}

export const OBIEKTY_MIKROINSTALACJI = ["kamper", "altana-rod", "garaz"] as const
export type ObiektMikroinstalacji = (typeof OBIEKTY_MIKROINSTALACJI)[number]

export type ZuzyciePerUrzadzenieInput = {
  urzadzenia: PozycjaZuzycia[]
}
