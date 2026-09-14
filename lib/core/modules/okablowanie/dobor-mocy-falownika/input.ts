/**
 * Ekran 7, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór mocy falownika"
 * (dawne 4.3, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type DoborMocyFalownikaInput = {
  /** Moc szczytowa odbiorników [W] (z Modułu 2). 0 = jeszcze nie wpisano. */
  mocSzczytowaW: number
  /** Moc pozorna odbiorników [VA], opcjonalnie. 0 = nie podano. */
  mocPozornaVa: number
  /** Współczynnik jednoczesności — domyślnie 0,7 ze źródła, edytowalny. 0 = jeszcze nie wpisano. */
  wspolczynnikJednoczesnosci: number
  /** Moc rozważanego/posiadanego falownika [W], opcjonalnie do sprawdzenia. 0 = nie podano. */
  mocFalownikaWybranaW: number
}
