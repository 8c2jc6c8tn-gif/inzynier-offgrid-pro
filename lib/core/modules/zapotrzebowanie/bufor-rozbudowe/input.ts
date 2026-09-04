/**
 * Ekran 13, Moduł 2 "Zapotrzebowanie energetyczne" — "Bufor na rozbudowę" (dawne 1.25,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D-lite.
 */

export type BuforRozbudowyInput = {
  /** Całkowite zapotrzebowanie dobowe bez bufora [kWh]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieCalkowiteKwh: number
  /** Bufor na rozbudowę [%] — suwak 0/10/20/30 wg źródła. */
  buforPct: 0 | 10 | 20 | 30
}
