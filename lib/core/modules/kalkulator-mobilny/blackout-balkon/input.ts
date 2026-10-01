/**
 * Ekran 40, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Blackout w bloku — zestaw balkonowy" (dawne 8.68,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.56). Wzorzec D. Moce, pojemność, sprawności
 * i wymiary — od usera (Dyrektywa #1).
 */
export type OdbiornikBalkonowy = { nazwa: string; mocW: number; godzinNaDobe: number }

export type BlackoutBalkonInput = {
  odbiorniki: OdbiornikBalkonowy[]
  /** Czas blackoutu do przetrwania [h]. */
  czasBlackoutuH: number
  /** Energia stacji zasilania / akumulatora [Wh] (z tabliczki). */
  pojemnoscWh: number
  /** Część użyteczna [%]. */
  uzytecznaPct: number
  /** Sprawność falownika stacji [%]. */
  sprawnoscFalownikaPct: number
  /** Długość balustrady dostępna pod panele [m]; 0 = bez panelu. */
  dlugoscBalustradyM: number
  /** Szerokość panelu wzdłuż balustrady [m]. */
  szerokoscPaneluM: number
  mocPaneluW: number
  /** Równoważne godziny pełnego słońca na balkonie [h/dobę] (z uwzględnieniem orientacji i zacienienia). */
  godzinSlonca: number
  sprawnoscToruPct: number
}
