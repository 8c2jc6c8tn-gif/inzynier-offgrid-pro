/**
 * Ekran 18, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Dobór panelu do kampera (elastyczny vs sztywny)"
 * (dawne 8.38, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.26). Wzorzec B.
 * Dane konkretnych paneli wpisuje user z kart (Dyrektywa #1); wpływ nagrzewania — M3 `wplyw-temperatury`.
 */
export type PanelKamperaInput = {
  elastycznyMocW: number
  elastycznyMasaKg: number
  elastycznyCenaZl: number
  /** Gwarancja mocy producenta [lat] — z karty, jako miara trwałości. */
  elastycznyGwarancjaLat: number
  sztywnyMocW: number
  sztywnyMasaKg: number
  sztywnyCenaZl: number
  sztywnyGwarancjaLat: number
  /** Czy panel elastyczny będzie przyklejony płasko do dachu, bez szczeliny wentylacyjnej. null = nie wiadomo. */
  elastycznyBezSzczeliny: boolean | null
}
