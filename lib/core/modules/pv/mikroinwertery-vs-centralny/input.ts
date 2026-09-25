/**
 * Ekran 21, Moduł 3 "Instalacja PV" — "Mikroinwertery vs inwerter centralny" (dawne 2.36, §3.36
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 2075–2101;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 21). Wzorzec B z regułą rekomendacji.
 */

export type MikroinwerteryVsCentralnyInput = {
  /** Czy instalacja ma częściowe/regularne zacienienie. `null` = jeszcze nie odpowiedziano. */
  regularneZacienienie: boolean | null
}
