/**
 * Ekran 14, Moduł 3 "Instalacja PV" — "Dopasowanie tablicy PV do falownika" (scala dawne 2.24,
 * 2.25, 2.26, 2.27, 2.37, 2.42, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Wzorzec D — "mega-
 * scalenie" sześciu dawnych funkcji w jeden zintegrowany silnik oceny. Sprawdza tylko string
 * pojedynczy (bez wielu stringów równoległych) — zgodnie z parametrami Sekcji A źródła.
 */

export type DopasowanieTablicyFalownikaInput = {
  /** Voc panelu w warunkach STC (25°C) [V]. 0 = jeszcze nie wpisano. */
  vocStcV: number
  /** Vmp panelu w warunkach STC (25°C) [V]. 0 = jeszcze nie wpisano. */
  vmpStcV: number
  /** Prąd roboczy panelu (Imp) [A]. 0 = jeszcze nie wpisano. */
  impA: number
  /** Współczynnik temperaturowy Voc (β) [%/°C], ujemny, typowo -0,29 do -0,32. 0 = jeszcze nie wpisano. */
  betaPctNaC: number
  /** Minimalna temperatura w lokalizacji (Tmin) [°C]. null = jeszcze nie wpisano (0°C to legalna wartość). */
  tminC: number | null
  /** Liczba paneli w stringu. 0 = jeszcze nie wpisano. */
  liczbaPaneliWStringu: number
  /** Maksymalne dopuszczalne napięcie wejściowe DC falownika [V]. 0 = jeszcze nie wpisano. */
  vMaxFalownikaV: number
  /** Dolna granica okna MPPT falownika [V]. 0 = jeszcze nie wpisano. */
  mpptMinV: number
  /** Górna granica okna MPPT falownika [V]. 0 = jeszcze nie wpisano. */
  mpptMaxV: number
  /** Maksymalny prąd wejściowy na MPPT falownika [A]. 0 = jeszcze nie wpisano. */
  iMaxMpptA: number
  /** Moc znamionowa AC falownika [W]. 0 = jeszcze nie wpisano. */
  mocFalownikaAcW: number
}
