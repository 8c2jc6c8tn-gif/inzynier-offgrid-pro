/**
 * Moduł 6, Część 2B — dokładka do Ekranu 4 (GWC): GWC jako wsparcie dolnego źródła pompy ciepła powietrze-woda
 * (dawne 5.54, Biblia §6.27.28). Strumień i przyrost temperatury w GWC przychodzą z pól Ekranu 4; reszta — z karty
 * pompy ciepła.
 */
export type GwcPompaCieplaInput = {
  /** Strumień powietrza przez GWC [m³/h] (Ekran 4). 0 = nie wpisano. */
  strumienGwcM3H: number
  /** Zimowy przyrost temperatury powietrza w GWC [K] (Ekran 4). 0 = nie wpisano. */
  przyrostGwcK: number
  /** Strumień powietrza przez parownik pompy [m³/h] (karta). 0 = nie wpisano. */
  strumienParownikaM3H: number
  /** Moc grzewcza pompy [kW] (karta, w warunkach zimowych). 0 = nie wpisano. */
  mocPompyKw: number
  /** COP pompy bez GWC — przy obecnej temperaturze powietrza (karta). 0 = nie wpisano. */
  copBezGwc: number
  /** COP pompy przy temperaturze powietrza podniesionej przez GWC (karta) — opcjonalny; 0 = nie wpisano. */
  copZGwc: number
  /** Ciepło z pompy w okresie pracy GWC [kWh] — opcjonalne, do oszczędności prądu; 0 = nie liczymy. */
  cieploKwh: number
}
