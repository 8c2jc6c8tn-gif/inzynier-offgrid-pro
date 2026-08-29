/**
 * Ekran 1, Moduł 2 "Zapotrzebowanie" — "Systemy podtrzymania życia (Survival Core)" (dawne 1.1).
 * Katalog odbiorników krytycznych — dostają priorytet 1 (nigdy nie odłączane), zasilają
 * logikę load sheddingu (Ekran 12) i freeze protection (Moduł 7, Ekran 6).
 */

export type CriticalLoadItem = {
  id: string
  label: string
  /** Moc [W] — edytowalna wartość użytkownika, wystartowana z domyślnej (jeśli jest). */
  powerW: number
  /** Czy odbiornik jest częścią dzisiejszego zestawu krytycznego. */
  selected: boolean
}

export type SurvivalCoreInput = {
  items: CriticalLoadItem[]
}
