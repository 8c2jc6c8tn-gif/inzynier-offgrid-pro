/**
 * Ekran 39, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Łączenie paneli z powerbankiem/stacją
 * zasilania" (dawne 8.66, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md + Biblia §12.54). Wzorzec D:
 * Voc paneli (w mrozie) vs max napięcie wejścia solarnego stacji; opcjonalnie prąd zwarciowy vs max prąd.
 */

export type PanelDoStacjiZasilaniaInput = {
  /** Voc panelu w STC [V]. 0 = jeszcze nie wpisano. */
  vocStcV: number
  /** Współczynnik temperaturowy Voc (β) [%/°C], ujemny. 0 = jeszcze nie wpisano. */
  betaPctNaC: number
  /** Najniższa temperatura, w której panel będzie podłączony [°C]. null = jeszcze nie wpisano. */
  tminC: number | null
  /** Liczba paneli połączonych szeregowo. 0 = jeszcze nie wpisano. */
  liczbaSzeregowo: number
  /** Max napięcie wejścia solarnego stacji/powerbanka [V]. 0 = jeszcze nie wpisano. */
  maxNapiecieWejsciaV: number
  /** Opcjonalnie: prąd zwarciowy Isc panelu [A]. 0 = pominięte. */
  iscA: number
  /** Opcjonalnie: liczba gałęzi równoległych (0 lub 1 = jedna). */
  liczbaRownolegle: number
  /** Opcjonalnie: max prąd wejścia solarnego stacji [A]. 0 = pominięte. */
  maxPradWejsciaA: number
}
