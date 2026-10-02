/**
 * Moduł 6, Część 2C — „Pompa ciepła – modelowanie zużycia energii w sezonie” (dawne 5.64, Biblia §6.27.38) z
 * porównaniem „SCOP katalogowy vs rzeczywisty” z dokładki 2B do Ekranu 5 (dawne 5.43, §6.27.17). Monthly heat from
 * Screen 1/2, monthly COP from the pump datasheet at the month's mean temperature — both from the user (Dyrektywa #1).
 */
export type ModelSezonowyPompyInput = {
  /** Heat for space heating per month [kWh], January first; null or 0 = no heating that month. */
  cieploKwh: (number | null)[]
  /** COP of the pump in that month (datasheet at the monthly mean temperature, or COP with defrost from Screen 6). */
  cop: (number | null)[]
  /** Catalogue SCOP for comparison — optional, 0 = not entered. */
  scopKatalogowy: number
}
