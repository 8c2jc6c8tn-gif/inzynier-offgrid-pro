/**
 * Moduł 6, Część 2B — dokładka do Ekranu 5 (COP/SCOP): „Pompa ciepła – optymalizacja ustawień krzywej grzewczej”
 * (dawne 5.71, Biblia §6.27.45). The curve points come from the controller settings (or the installer), the COP from the
 * pump datasheet — nothing assumed (Dyrektywa #1). `null` = not entered.
 */
export type KrzywaGrzewczaInput = {
  /** Outdoor temperature of the first curve point [°C]. */
  tZewn1C: number | null
  /** Outdoor temperature of the second curve point [°C]. */
  tZewn2C: number | null
  /** Current curve: supply temperature at `tZewn1C` [°C]. */
  tZasil1C: number | null
  /** Current curve: supply temperature at `tZewn2C` [°C]. */
  tZasil2C: number | null
  /** Proposed curve: supply temperature at `tZewn1C` [°C] — optional. */
  tZasilNowa1C: number | null
  /** Proposed curve: supply temperature at `tZewn2C` [°C] — optional. */
  tZasilNowa2C: number | null
  /** Outdoor temperature the curves are read at (e.g. the season mean or a January day) [°C]. */
  tOcenyC: number | null
  /** COP of the pump at the current curve's supply temperature at `tOcenyC` (datasheet) — optional, 0 = not entered. */
  copObecny: number
  /** Heat delivered in the season [kWh] (Screen 2) — optional, 0 = not entered. */
  cieploSezonKwh: number
}
