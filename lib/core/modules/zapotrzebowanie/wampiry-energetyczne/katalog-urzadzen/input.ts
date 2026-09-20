/**
 * Moduł zbiorczy "Wampiry energetyczne" (dawne 1.24, 1.28–1.50), podzakładka 1: Katalog urządzeń.
 * Domyka dawne 1.24 (definicja/suma) + katalog z 1.29/1.41/1.48 (baza urządzeń standby).
 */

export type StandbyDeviceItem = {
  id: string
  label: string
  /** Moc w trybie czuwania [W] — edytowalna, wystartowana z sugerowanej (jeśli jest). */
  powerW: number
  /** Czy urządzenie jest częścią dzisiejszego bilansu standby. */
  selected: boolean
}

export type KatalogUrzadzenInput = {
  items: StandbyDeviceItem[]
}
