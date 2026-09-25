/**
 * Ekran 3, Moduł 3 "Instalacja PV" — "Tracker vs konstrukcja stała" (dawne 2.8, Wzorzec B;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 3). Porównanie: te same pieniądze wydane na
 * tracker albo na dodatkowe panele na stałym stelażu.
 */

export type TrackerVsStalyInput = {
  /** Liczba paneli na trackerze [szt.]. 0 = nie wpisano. */
  liczbaPaneliTracker: number
  /** Koszt trackera: mechanizm + fundament [zł]. 0 = nie wpisano. */
  kosztTrackeraZl: number
  /** Koszt jednego dodatkowego panelu na stałym stelażu (panel + jego część stelaża i montażu) [zł]. 0 = nie wpisano. */
  kosztPaneluZl: number
  /** Roczny uzysk jednego panelu na stałym stelażu [kWh/rok] — np. z Ekranu 1. 0 = nie wpisano. */
  uzyskPaneluKwh: number
}
