/**
 * Ekran 6, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Szybki dobór paneli PV dla pojedynczego
 * urządzenia" (dawne 8.6, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.6). Wzorzec D.
 * Godziny słońca i współczynnik uzysku od usera — źródło podaje „np. 70% mocy nominalnej” tylko jako
 * przykład, nie jako stałą (Dyrektywa #1).
 */
export type PanelDlaUrzadzeniaInput = {
  mocUrzadzeniaW: number
  /** Godziny pracy urządzenia na dobę [h]. */
  godzinPracy: number
  /** Równoważne godziny pełnego słońca na dobę [h] — M1 / mapa nasłonecznienia. */
  godzinSlonca: number
  /** Jaka część mocy nominalnej panelu realnie trafia do urządzenia/akumulatora (temperatura, regulator, kable) [%]. */
  uzyskPct: number
  /** Moc panelu, który user już ma [W]; 0 = tylko dobór. */
  posiadanyPanelW: number
}
