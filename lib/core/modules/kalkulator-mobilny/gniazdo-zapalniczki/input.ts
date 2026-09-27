/**
 * Ekran 30, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Gniazda zapalniczki samochodowej i adaptery"
 * (dawne 8.57, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md + Biblia §12.45). Źródło: Wzorzec C
 * (informacyjny) z twardym stopem — przeciążenie gniazda; tu z prostym sprawdzeniem prądu urządzeń
 * włączonych jednocześnie względem bezpiecznika gniazda.
 */

export type UrzadzenieGniazda = {
  id: string
  nazwa: string
  /** Moc urządzenia [W]. 0 = pusty wiersz. */
  mocW: number
}

export type GniazdoZapalniczkiInput = {
  /** Napięcie instalacji pojazdu [V]. 0 = jeszcze nie wybrano. */
  napiecieV: 0 | 12 | 24
  /** Prąd bezpiecznika obwodu gniazda [A] (instrukcja pojazdu / skrzynka bezpieczników). 0 = jeszcze nie wpisano. */
  pradBezpiecznikaA: number
  /** Urządzenia włączone jednocześnie przez to gniazdo (także przez rozgałęźnik). */
  urzadzenia: UrzadzenieGniazda[]
}
