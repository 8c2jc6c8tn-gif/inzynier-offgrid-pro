/**
 * Ekran 6, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Cykle odszraniania (defrost)" (scala dawne 5.6 +
 * 1.14 + 6.8; docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §2.14, §6.6, §7.8). Wzorzec D.
 *
 * The defrost cycle (how often, how long, how much power) is entered from the pump datasheet or observation —
 * the source gives no model linking temperature and humidity to the frosting rate.
 */
export type CykleOdszranianiaInput = {
  /** Outdoor temperature [°C]; null = not entered. */
  tZewnC: number | null
  /** Relative humidity of the outdoor air [%] — shown with the result only (the source gives no threshold). 0 = not entered. */
  wilgotnoscPct: number
  /** Time between the starts of two defrosts [min]. 0 = not entered. */
  odstepMin: number
  /** Duration of one defrost [min]. 0 = not entered. */
  czasDefrostuMin: number
  /** Electrical power drawn during a defrost [kW]. 0 = not entered. */
  mocDefrostuKw: number
  /** Electrical power of the pump in normal heating [kW]. 0 = not entered. */
  mocBazowaKw: number
  /** Hours per day with frosting conditions [h/day] — optional, 0 = no daily result. */
  godzinySzronieniaH: number
  /** Catalogue COP at this temperature — optional, 0 = no effective COP. */
  copKatalogowy: number
  /** Lowest outdoor temperature the pump works at (datasheet) [°C]; null = not entered. */
  tMinPracyC: number | null
}
