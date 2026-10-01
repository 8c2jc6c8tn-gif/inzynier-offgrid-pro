/**
 * Ekran 5, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Kalkulator na weekend"
 * (dawne 8.5, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.5). Wzorzec D.
 * Źródło mówi o „typowych mocach i czasach z bazy” — w repo takiej bazy nie ma (D33: przykładowe moce
 * to tylko podpowiedź), więc moc i czas pracy każdego urządzenia wpisuje user (Dyrektywa #1).
 */
export type UrzadzenieWeekendowe = {
  nazwa: string
  mocW: number
  /** Godziny pracy na dobę [h]. */
  godzinNaDobe: number
  /** Czy liczyć osobno dla każdej osoby (np. ładowarka telefonu). */
  naOsobe: boolean
}

export type WeekendInput = {
  dni: number
  osoby: number
  urzadzenia: UrzadzenieWeekendowe[]
  pojemnoscAh: number
  napiecieV: number
  /** Dopuszczalna głębokość rozładowania [%] — z karty akumulatora. */
  dodPct: number
  /** Moc panelu [W]; 0 = bez panelu. */
  mocPaneluW: number
  /** Równoważne godziny pełnego słońca na dobę [h] — od usera (M1 / mapa nasłonecznienia). */
  godzinSlonca: number
  /** Sprawność toru panel → akumulator (regulator, kable, ładowanie) [%] — od usera. */
  sprawnoscToruPct: number
}
