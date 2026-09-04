/**
 * Ekran 8, Moduł 2 "Zapotrzebowanie energetyczne" — "Zaawansowane parametry obciążenia",
 * podpunkt 1 "Moc pozorna/cos φ" (dawne 1.10, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md,
 * Sekcja B). Zbudowany wyłącznie ten jeden z trzech podpunktów Ekranu 8 — pozostałe dwa
 * ("prądy rozruchowe" i "współczynnik jednoczesności") wymagają bazy komponentów (współczynniki
 * rozruchu per typ urządzenia) lub statystycznego modelu jednoczesności załączeń, których
 * źródło nie podaje jako konkretnych liczb/wzorów — nie budowane, żeby nie wymyślać danych.
 */

export type MocPozornaCosfiInput = {
  /** Moc czynna urządzenia z silnikiem/sprężarką [W]. 0 = jeszcze nie wpisano. */
  mocCzynnaW: number
  /** Współczynnik mocy (cos φ) — domyślnie 0,7 dla urządzeń z silnikami wg źródła. 0 = jeszcze nie wpisano. */
  cosFi: number
}
