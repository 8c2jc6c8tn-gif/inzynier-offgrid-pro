/**
 * Ekran 15, Moduł 3 "Instalacja PV" — "Technologie paneli" (scala dawne 2.28, 2.29, 2.30, 2.43;
 * §3.28–3.30, §3.43 `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 1858–1937,
 * 2262–2286; `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 15). Wzorzec B — zakładki
 * Sprawność / Degradacja / Uzysk roczny / Cienkowarstwowe.
 */

export type TechnologiePaneliInput = {
  /** Planowana moc instalacji [kWp] — do przeliczenia sprawności na powierzchnię. 0 = nie wpisano. */
  mocInstalacjiKwp: number
}
