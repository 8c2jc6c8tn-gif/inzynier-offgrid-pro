/**
 * Ekran 4, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Gruntowy wymiennik ciepła (GWC)" (dawne 5.4,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.4). Wzorzec D.
 *
 * The source lists pipe length, depth and soil type as inputs but gives no ground heat-exchange formula, so the
 * winter air temperature rise is entered from the manufacturer's data or a measurement (thermometer before and
 * after the exchanger) — the screen computes what that rise is worth.
 */
export type GwcInput = {
  /** Ventilation air flow through the GWC [m³/h]. 0 = not entered. */
  strumienM3H: number
  /** Winter air temperature rise in the GWC [K] — datasheet or measurement. 0 = not entered. */
  przyrostTempK: number
  /** Hours per day the GWC runs [h/day]. 0 = not entered. */
  godzinyPracyH: number
  /** Heat recovery efficiency of the ventilation unit behind the GWC [%] — 0 = no heat recovery. */
  sprawnoscRekuperatoraPct: number
  /** Daily heating demand of the building [kWh/day] (Screen 1/2) — optional, 0 = no share. */
  zapotrzebowanieDobaKwh: number
  /** Heating COP to turn heat into electricity — optional, 0 = not counted. */
  cop: number
}
