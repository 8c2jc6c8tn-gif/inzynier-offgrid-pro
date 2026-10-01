/**
 * Ekran 37, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Urządzenia zabronione dla małych falowników"
 * (dawne 8.64, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.52). Wzorzec C.
 */
export type UrzadzenieDoFalownika = {
  nazwa: string
  mocW: number
  /** Krotność mocy rozruchowej; 0 = nie wiadomo. */
  krotnoscRozruchu: number
}

export type UrzadzeniaZabronioneInput = {
  /** Moc ciągła falownika [W] (karta). */
  mocFalownikaW: number
  /** Moc szczytowa / przeciążalność falownika [W] (karta). */
  mocSzczytowaW: number
  urzadzenia: UrzadzenieDoFalownika[]
}
