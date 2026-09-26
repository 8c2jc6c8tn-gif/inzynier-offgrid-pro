/**
 * Moduł 6, Ekran 8 "Pojemność cieplna budynku (bezwładność)" (dawne 5.8 + 6.11, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`).
 * A: "materiały konstrukcyjne i grubości warstw ..., objętość pomieszczeń". B: "całkowita pojemność cieplna budynku (kWh/K)"
 * and the same number answers "ile czasu do zamarznięcia instalacji przy awarii ogrzewania". Density and specific heat come
 * from the material sheet — the app has no material table (not invented). `null` = not entered.
 */
export type WarstwaMasy = {
  nazwa: string
  powierzchniaM2: number | null
  gruboscCm: number | null
  /** Density ρ [kg/m³]. */
  gestoscKgM3: number | null
  /** Specific heat c [J/(kg·K)]. */
  cieploWlasciweJKgK: number | null
}

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
