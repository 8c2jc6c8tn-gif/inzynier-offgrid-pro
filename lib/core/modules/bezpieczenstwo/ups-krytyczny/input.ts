/**
 * Ekran 6, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "UPS krytyczny — sprzęt i zarządzanie
 * AI" (scala dawne 11.54, 12.54, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md). Wzorzec D.
 * Sekcja B punkt 1 "Dobór sprzętowy" (11.54) since 1.0.0; punkt 2 "Zarządzanie priorytetami AI" (12.54) since
 * 1.1.0 (02.10.2026) — a shedding plan by priority, with the trigger threshold entered by the user (the source
 * gives only the example „10 minut”, so the app does not assume one).
 */

/** Priority of a critical load: 1 = kept to the end, 3 = shed first (source: siłowniki last in the list). */
export type PriorytetUps = 1 | 2 | 3

export type UrzadzenieKrytyczne = {
  id: string
  label: string
  /** Moc [W] — edytowalna wartość użytkownika, wystartowana z domyślnej (jeśli jest). */
  powerW: number
  /** Czy urządzenie ma być podtrzymywane przez ten UPS. */
  selected: boolean
  /**
   * Shedding priority (12.54). Missing = the source default for this id (`PRIORYTET_ZRODLA`); null = none chosen
   * for a device the source does not rank (emergency lighting, own devices).
   */
  priorytet?: PriorytetUps | null
}

export type UpsKrytycznyInput = {
  urzadzenia: UrzadzenieKrytyczne[]
  /** Pojemność akumulatora UPS [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
  /** Napięcie systemu UPS [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Sprawność układu (0,1]. Gdy nie podana — domyślna z `kalkulatory-pomocnicze` (0,92). */
  efficiency?: number
  /**
   * 12.54: remaining run time at the current load [min] at which the next priority level is shed. 0 or missing =
   * not entered — the plan then shows only the run time of each stage from a full UPS.
   */
  progOdcieciaMin?: number
  /** Section C: the UPS signals a weak battery. */
  akumulatorSlaby?: boolean
}
