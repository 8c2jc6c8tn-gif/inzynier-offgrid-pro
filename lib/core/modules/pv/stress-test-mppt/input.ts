/**
 * Ekran 5, Moduł 3 "Instalacja PV" — "Zimowy stress-test napięciowy MPPT (Voc max)" (dawne 2.11,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzorzec D — jeden z najważniejszych
 * twardych stopów w całej aplikacji wg źródła (przekroczenie limitu MPPT = gwarantowane
 * uszkodzenie sprzętu, nie tylko ryzyko).
 */

export type StressTestMpptInput = {
  /** Voc panelu w warunkach STC (25°C) [V]. 0 = jeszcze nie wpisano. */
  vocStcV: number
  /** Współczynnik temperaturowy Voc (β) [%/°C], ujemny, typowo -0,29 do -0,32. 0 = jeszcze nie wpisano. */
  betaPctNaC: number
  /** Minimalna temperatura w lokalizacji (Tmin) [°C]. null = jeszcze nie wpisano (0°C to legalna wartość). */
  tminC: number | null
  /** Liczba paneli w stringu. 0 = jeszcze nie wpisano. */
  liczbaPaneliWStringu: number
  /** Maksymalne napięcie wejściowe MPPT/falownika [V]. 0 = jeszcze nie wpisano. */
  limitMpptV: number
}
