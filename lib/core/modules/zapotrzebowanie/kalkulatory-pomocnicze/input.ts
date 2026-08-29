/**
 * Ekran 16, Moduł 2 "Zapotrzebowanie" — "Kalkulatory pomocnicze" (dawne 1.22, 1.23).
 * Trzy tryby przelicznika, jeden ekran (Wzorzec D-lite, docs/standards/08-ui-ux.md, 8.2).
 */

export type WattToAmpInput = {
  mode: "watt-to-amp"
  /** Moc urządzenia [W]. */
  powerW: number
  /** Napięcie systemu [V], np. 12/24/48. */
  voltageV: number
  /** Sprawność układu (0,1]. Domyślna: EFFICIENCY_DEFAULT z constants.ts. */
  efficiency?: number
}

export type AhToWhInput = {
  mode: "ah-to-wh"
  capacityAh: number
  voltageV: number
}

export type WhToAhInput = {
  mode: "wh-to-ah"
  energyWh: number
  voltageV: number
}

export type RuntimeInput = {
  mode: "runtime"
  capacityAh: number
  voltageV: number
  powerW: number
  efficiency?: number
}

export type KalkulatoryPomocniczeInput = WattToAmpInput | AhToWhInput | WhToAhInput | RuntimeInput
