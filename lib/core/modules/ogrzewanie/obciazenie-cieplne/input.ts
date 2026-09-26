import type { StrefaKlimatyczna } from "./constants"

/**
 * Moduł 6, Ekran 1 "Charakterystyka termiczna budynku" (dawne 5.1, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`):
 * "straty ciepła (W) liczone z różnicy temperatur wewnątrz/na zewnątrz i współczynników U, dla każdego
 * miesiąca osobno". Heat loss by transmission (Σ U·A·ΔT) and ventilation (n·V·ρ·cp·ΔT) — physics
 * written out by the source; PN-EN 12831-1 itself is not in the repo, so its thermal bridges, ground
 * correction factors, gains and reheat capacity are NOT modelled (explicit warning). `null` = not entered.
 */
export type Przegroda = {
  nazwa: string
  powierzchniaM2: number | null
  /** Thermal transmittance U [W/(m²·K)] — from the design, energy certificate or product sheet. */
  uWM2K: number | null
  /** `true` = outdoor air on the other side (design θe, monthly mean for months). */
  zewnetrzna: boolean
  /**
   * Only when `zewnetrzna === false` (ground, unheated attic, garage): temperature on the other side
   * [°C], entered by the user, fixed all year (explicit assumption); `null` = not entered yet.
   */
  temperaturaPoDrugiejStronieC: number | null
}

export type ObciazenieCieplneInput = {
  przegrody: Przegroda[]
  temperaturaWewnetrznaC: number | null
  strefaKlimatyczna: StrefaKlimatyczna | null
  kubaturaM3: number | null
  /** Air changes per hour n [1/h] (infiltration + ventilation without recovery). */
  wymianyPowietrzaNaH: number | null
  /** Optional: COP of the heat source (electric heater = 1) — electric energy per day at θe. */
  cop: number | null
  /** Optional: 12 monthly mean outdoor temperatures [°C], January first; `null` = month skipped. */
  srednieTemperaturyMiesieczneC: (number | null)[]
}
