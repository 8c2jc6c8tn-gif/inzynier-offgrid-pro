/**
 * Ekran 13, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Blackout w domu — minimum do przeżycia"
 * (dawne 8.20, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.20). Wzorzec D.
 * Moce i czasy odbiorników krytycznych wpisuje user (brak bazy w repo, D33; Dyrektywa #1).
 * Scenariusz bez słońca i bez paneli — pełny blackout wielodniowy z PV liczy M7/E4 (`stress-test/blackout`).
 */
export type OdbiornikKrytyczny = {
  nazwa: string
  mocW: number
  /** Średni czas pracy na dobę [h] (lodówka — czas pracy sprężarki). */
  godzinNaDobe: number
}

export type BlackoutMinimumInput = {
  odbiorniki: OdbiornikKrytyczny[]
  /** Przewidywany czas blackoutu [h]. */
  czasBlackoutuH: number
  napiecieV: number
  /** Część pojemności akumulatora do wykorzystania [%] — z karty. */
  uzytecznaPct: number
  /** Sprawność przetwornicy 12/24 V → 230 V [%] — z karty; 100 gdy wszystko zasilane DC. */
  sprawnoscPrzetwornicyPct: number
  /** Akumulator, który user już ma [Ah]; 0 = tylko dobór. */
  posiadanyAh: number
}
