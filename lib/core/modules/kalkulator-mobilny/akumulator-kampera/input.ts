/**
 * Ekran 17, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Dobór akumulatora do kampera (AGM vs LiFePO4)"
 * (dawne 8.37, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.25). Wzorzec B.
 * Wersja uproszczona M4/E30 (`baterie/porownanie-technologii`) pod kątem masy w pojeździe. Parametry
 * konkretnych akumulatorów wpisuje user z kart; M4/E30 daje tylko podpowiedzi (Dyrektywa #1).
 */
export type AkumulatorKamperaInput = {
  /** Zapotrzebowanie kampera na dobę [Wh]. */
  zapotrzebowanieWhDoba: number
  /** Ile dób akumulator ma wytrzymać bez ładowania. */
  dniBezLadowania: number
  napiecieV: number
  agmAh: number
  agmCenaZl: number
  agmMasaKg: number
  /** Dopuszczalna głębokość rozładowania AGM [%] — z karty. */
  agmDodPct: number
  /** Liczba cykli przy tej głębokości — z karty. */
  agmCykle: number
  lfpAh: number
  lfpCenaZl: number
  lfpMasaKg: number
  lfpDodPct: number
  lfpCykle: number
  /** Zapas ładowności pojazdu na akumulatory [kg]; 0 = nie sprawdzaj. */
  zapasMasyKg: number
}
