/**
 * Moduł 6, Ekran 8 "Pojemność cieplna budynku (bezwładność)" (dawne 5.8 + 6.11, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`).
 * A: "materiały konstrukcyjne i grubości warstw ..., objętość pomieszczeń". B: "całkowita pojemność cieplna budynku (kWh/K)"
 * and the same number answers "ile czasu do zamarznięcia instalacji przy awarii ogrzewania". Density and specific heat come
 * from the material sheet — the app has no material table (not invented). `null` = not entered.
 * Since 27.09.2026 the capacity used for cooling is the effective one of EN ISO 13786 Załącznik A (1-day period); the
 * whole mass (the source's C) is still reported as the long-term value.
 */
export type WarstwaMasy = {
  nazwa: string
  powierzchniaM2: number | null
  gruboscCm: number | null
  /** Density ρ [kg/m³]. */
  gestoscKgM3: number | null
  /** Specific heat c [J/(kg·K)]. */
  cieploWlasciweJKgK: number | null
  /**
   * EN ISO 13786 A.2.4 (since 27.09.2026). `gruboscCm` is the massive material from the room surface up to the first
   * insulating layer. "jedna" (default) — one surface faces the room; "obie" — element wholly inside the heated zone
   * (partition, intermediate floor), capacity of both surfaces; "za-izolacja" — layer behind insulation, not active.
   */
  strona?: StronaWarstwy
  /** Total thickness of the element this layer belongs to [cm] (A.2.4 a); `null`/missing = the layer is the whole element. */
  gruboscElementuCm?: number | null
}

export type StronaWarstwy = "jedna" | "obie" | "za-izolacja"

/** Heat loss to a space kept at a fixed temperature (ground, unheated attic) — Ekran 1 elements with `zewnetrzna: false`. */
export type StrataDoStrefy = { hWK: number; temperaturaC: number }

export type PojemnoscCieplnaInput = {
  warstwy: WarstwaMasy[]
  /** Air volume [m³] (Ekran 1 kubatura); optional — `null` leaves the air out. */
  kubaturaM3: number | null
  /** Σ U·A of external elements + H_V from Ekran 1 [W/K] (towards outdoor air). */
  hZewnetrzneWK: number | null
  stratyDoInnychStref: StrataDoStrefy[]
  /** Indoor temperature when heating fails [°C]. */
  temperaturaPoczatkowaC: number | null
  /** Outdoor temperature held during the outage [°C]. */
  temperaturaZewnetrznaC: number | null
  /** Optional: temperature the user must not go below (e.g. protection of pipes) [°C]. */
  temperaturaGranicznaC: number | null
}
