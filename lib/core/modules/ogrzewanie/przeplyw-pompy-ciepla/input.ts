/**
 * Moduł 6, Część 2B — dokładka do Ekranu 15 (pompy cyrkulacyjne): „Pompa ciepła – dobór przepływów i pomp obiegowych”
 * (dawne 5.65, Biblia §6.27.39). Pump power and ΔT from the user/datasheet, the circulation pump's flow at its operating
 * point from its curve, the minimum flow from the heat pump datasheet (Dyrektywa #1).
 */
export type PrzeplywPompyCieplaInput = {
  /** Heating power of the heat pump [kW]. 0 = not entered. */
  mocPompyKw: number
  /** Design temperature difference flow/return across the heat pump [K]. 0 = not entered. */
  dTK: number
  /** Flow the circulation pump gives at its operating point [m³/h] — its curve; optional, 0 = not entered. */
  przeplywPompyM3H: number
  /** Minimum water flow of the heat pump [m³/h] — datasheet; optional, 0 = not entered. */
  minPrzeplywM3H: number
}
