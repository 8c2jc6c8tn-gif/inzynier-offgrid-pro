/**
 * Ekran 6, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór bezpieczników i rozłączników"
 * (dawne 4.2, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type DoborBezpiecznikaRozlacznikaInput = {
  /** Prąd znamionowy obwodu [A]. */
  pradZnamionowyA: number
  /** Prąd zwarciowy w tym punkcie instalacji [A] — docelowo z Ekranu 12 (Analiza zwarciowa,
   *  jeszcze niezbudowany), dziś ręczny wpis. 0 = jeszcze niesprawdzone. */
  pradZwarciowyA: number
  /** Zdolność wyłączania (AIC) wybranego bezpiecznika [A], z karty katalogowej. 0 = jeszcze niewybrany. */
  aicBezpiecznikaA: number
}
