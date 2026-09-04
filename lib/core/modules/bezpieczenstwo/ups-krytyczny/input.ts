/**
 * Ekran 6, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "UPS krytyczny — sprzęt i zarządzanie
 * AI" (scala dawne 11.54, 12.54, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Sekcja B
 * punkt 1: "Dobór sprzętowy"). Wzorzec D. Buduje TYLKO dobór sprzętowy (11.54) — zarządzanie
 * priorytetami AI przy rozładowaniu (12.54) to logika sterowania bez progu liczbowego, świadomie
 * pominięte.
 */

export type UrzadzenieKrytyczne = {
  id: string
  label: string
  /** Moc [W] — edytowalna wartość użytkownika, wystartowana z domyślnej (jeśli jest). */
  powerW: number
  /** Czy urządzenie ma być podtrzymywane przez ten UPS. */
  selected: boolean
}

export type UpsKrytycznyInput = {
  urzadzenia: UrzadzenieKrytyczne[]
  /** Pojemność akumulatora UPS [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
  /** Napięcie systemu UPS [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Sprawność układu (0,1]. Gdy nie podana — domyślna z `kalkulatory-pomocnicze` (0,92). */
  efficiency?: number
}
