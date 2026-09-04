/**
 * Ekran 17, Moduł 3 "Instalacja PV" — "Niedopasowanie mocy paneli (mismatch)" (scala dawne
 * 2.32, 2.41, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B/C). Wzorzec D. Dla stringu
 * szeregowego dwóch paneli — dokładnie ten przypadek, który podaje przykład źródła.
 *
 * Napięcie wspólne (Vmp) NIE jest wyliczane z mocy/prądu każdego panelu osobno (dałoby to inny
 * wynik niż przykład źródła — sprawdzone niezależnie w Pythonie) — źródło używa jednej,
 * współdzielonej wartości napięcia dla obu paneli w swoim przykładzie ("40V"), więc jest to pole
 * ręcznego wpisu, nie wyliczane automatycznie.
 */

export type NiedopasowaniePaneliInput = {
  /** Moc panelu 1 (znamionowa) [W]. 0 = jeszcze nie wpisano. */
  mocPanel1W: number
  /** Prąd roboczy panelu 1 (Imp) [A]. 0 = jeszcze nie wpisano. */
  impPanel1A: number
  /** Moc panelu 2 (znamionowa) [W]. 0 = jeszcze nie wpisano. */
  mocPanel2W: number
  /** Prąd roboczy panelu 2 (Imp) [A]. 0 = jeszcze nie wpisano. */
  impPanel2A: number
  /** Wspólne napięcie robocze przyjęte dla obu paneli w stringu [V]. 0 = jeszcze nie wpisano. */
  napiecieWspolneV: number
}
