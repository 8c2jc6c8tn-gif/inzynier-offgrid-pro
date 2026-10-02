/**
 * Moduł 6, Część 2B — dokładka do Ekranu 5 (COP/SCOP): „Pompa ciepła – dobór mocy do budynku” (dawne 5.27, Biblia
 * §6.27.1) i część „pompa pokrywa X%, grzałki Y%” bilansu cieplnego (dawne 5.67, §6.27.41). Every number comes from the
 * user: the design heat load from Screen 1, the pump heating capacity from its datasheet table (Dyrektywa #1).
 */
export type DoborMocyPompyInput = {
  /** Design heat load of the building at the design outdoor temperature [kW] (Screen 1). 0 = not entered. */
  zapotrzebowanieKw: number
  /** Heating capacity of the pump at the design outdoor temperature [kW] — datasheet table. 0 = not entered. */
  mocPompyProjKw: number
  /** Design outdoor temperature θe [°C] (Screen 1 climate zone); null = not entered (no balance point). */
  tProjC: number | null
  /** Indoor temperature θi [°C]; null = not entered (no balance point). */
  tWewnC: number | null
  /** Second datasheet point: outdoor temperature [°C]; null = not entered (no balance point). */
  tDrugiC: number | null
  /** Second datasheet point: pump heating capacity at `tDrugiC` [kW]. 0 = not entered. */
  mocPompyDrugiKw: number
  /**
   * Is there a backup heat source in the house (heater, stove, boiler)? true = yes, false = none, null/omitted = not
   * entered (unknown). Decides the level of the power-deficit warning (D71).
   */
  maDogrzew?: boolean | null
}
