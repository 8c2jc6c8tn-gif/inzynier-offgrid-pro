/**
 * Ekran 7, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Powerbank solarny vs mały akumulator"
 * (dawne 8.7, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.7). Wzorzec B.
 * Moc ciągła i liczba ładowań; cena i masa na Wh — E34 (`stacja-vs-diy`), bez duplikatu.
 */
export type PowerbankVsAkumulatorInput = {
  /** Moc urządzenia podczas pracy/ładowania [W]. */
  mocUrzadzeniaW: number
  /** Energia na jedno pełne naładowanie albo na dobę pracy urządzenia [Wh]. */
  energiaNaUzycieWh: number
  /** Pojemność powerbanku z etykiety [Wh]. */
  powerbankWh: number
  /** Maksymalna ciągła moc wyjścia powerbanku [W]. */
  powerbankMocWyjsciaW: number
  akumulatorAh: number
  akumulatorV: number
  /** Część pojemności akumulatora do wykorzystania [%] — od usera (chemia, karta). */
  akumulatorUzytecznaPct: number
  /** Sprawność przetwarzania do urządzenia (przetwornica, kabel) [%] — od usera. */
  sprawnoscPct: number
}
