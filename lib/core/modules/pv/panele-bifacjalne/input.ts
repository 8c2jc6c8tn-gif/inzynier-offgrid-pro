/**
 * Ekran 16, Moduł 3 "Instalacja PV" — "Panele bifacjalne" (dawne 2.31,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Wzorzec D).
 */

export type TypPowierzchniPodSpodem = "biala_membrana" | "jasny_beton" | "piasek" | "trawa"

export type PaneleBifacjalneInput = {
  /** Roczny uzysk energii z samej przedniej strony paneli (bez efektu bifacjalnego) [kWh]. 0 = jeszcze nie wpisano. */
  mocRocznaBazowaKwh: number
  /** Typ powierzchni pod spodem paneli. null = jeszcze nie wybrano. */
  typPowierzchni: TypPowierzchniPodSpodem | null
  /**
   * Dodatkowy uzysk z tylnej strony (bifacjalny) [%]. Źródło podaje zakres per typ powierzchni,
   * nie pojedynczą liczbę — pole wymaga ręcznego wpisania (D16, `rejestr-decyzji.md`), z
   * podpowiedzią typowego zakresu dla wybranej powierzchni. 0 = jeszcze nie wpisano.
   */
  dodatkowyUzyskPct: number
}
