/**
 * Moduł 6, Ekran 10 "Optymalizacja izolacji" (dawne 5.10, `docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md`). B: "porównanie
 * materiałów ... i grubości; opłacalność = koszt izolacji vs oszczędności w 10 lat, uwzględniając λ (przewodność) i R (opór
 * cieplny)". An added layer is a thermal resistance in series with the existing element: U' = 1/(1/U + d/λ) — 1/U already
 * contains the surface resistances Rsi/Rse, so no PN-EN ISO 6946 table value is needed. λ and prices come from the product
 * sheet / shop (the source's "baza" of prices does not exist in the app). `null` = not entered.
 */
export type WariantIzolacji = {
  nazwa: string
  /** Declared thermal conductivity λ [W/(m·K)] from the product sheet. */
  lambdaWmK: number | null
  gruboscCm: number | null
  /** Price of the layer [zł/m²] at this thickness (material, optionally with labour). */
  cenaZlM2: number | null
}

export type OptymalizacjaIzolacjiInput = {
  /** External building element from Ekran 1 (outdoor air on the other side). */
  przegroda: { nazwa: string; powierzchniaM2: number | null; uWM2K: number | null }
  warianty: WariantIzolacji[]
  /** θi from Ekran 1. */
  temperaturaWewnetrznaC: number | null
  /** 12 monthly mean outdoor temperatures [°C] from Ekran 1 (PVGIS or typed), January first. */
  srednieTemperaturyMiesieczneC: (number | null)[]
  /** Optional price of heat [zł/kWh] — only then "the next centimetre no longer pays off" can be judged. */
  cenaCieplaZlKwh: number | null
}
