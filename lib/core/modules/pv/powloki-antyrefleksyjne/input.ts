/**
 * Ekran 23, Moduł 3 "Instalacja PV" — "Powłoki antyrefleksyjne" (dawne 2.39, §3.39
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 2156–2176;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 23). Wzorzec C z elementem obliczenia
 * (jak Ekran 26 — straty na złączkach MC4).
 */

export type PowlokiAntyrefleksyjneInput = {
  /** Roczny uzysk instalacji z panelami BEZ powłoki [kWh/rok]. 0 = nie wpisano. */
  rocznyUzyskKwh: number
}
