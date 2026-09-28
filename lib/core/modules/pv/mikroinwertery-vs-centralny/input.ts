/**
 * Ekran 21, Moduł 3 "Instalacja PV" — "Mikroinwertery vs inwerter centralny" (dawne 2.36, §3.36
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 2075–2101;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 21). Wzorzec B z regułą rekomendacji.
 */

/** Czy instalacja ma falownik wyspowy (grid-forming) obsługujący sprzężenie AC mikroinwerterów. */
export type FalownikWyspowyAc = "tak" | "nie" | "nie-wiem"

export type MikroinwerteryVsCentralnyInput = {
  /** Czy instalacja ma częściowe/regularne zacienienie. `null` = jeszcze nie odpowiedziano. */
  regularneZacienienie: boolean | null
  /**
   * Pytane tylko przy rekomendacji mikroinwerterów. `null` = jeszcze nie odpowiedziano,
   * „nie wiem” liczone jak „nie” (strona bezpieczna, ten sam wzorzec co M8/E3).
   */
  falownikWyspowyAcCoupling: FalownikWyspowyAc | null
}
