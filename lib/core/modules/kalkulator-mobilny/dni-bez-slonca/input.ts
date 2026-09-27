/**
 * Ekran 32, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Ile dni pracy bez słońca — mały zestaw"
 * (dawne 8.59, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Wzorzec D. Źródło: uproszczona
 * wersja Modułu 2/Ekran 7 (dni autonomii) z mniejszą liczbą parametrów — tu pytanie odwrotne:
 * ile dni wytrzyma akumulator, który użytkownik już ma.
 */

export type DniBezSloncaInput = {
  /** Pojemność znamionowa akumulatora [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
  /** Napięcie akumulatora [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Dopuszczalna głębokość rozładowania DoD [%], 0–100. 0 = jeszcze nie wpisano. */
  dodPct: number
  /** Sprawność przetwornicy/falownika [%], 0–100 (100 = odbiorniki DC wprost z akumulatora). 0 = jeszcze nie wpisano. */
  sprawnoscPct: number
  /** Zużycie energii na dobę [Wh]. 0 = jeszcze nie wpisano. */
  zuzycieDoboweWh: number
}
