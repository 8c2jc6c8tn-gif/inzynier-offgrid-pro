/**
 * Ekran 20, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Wentylacja naturalna vs mechaniczna —
 * porównanie" (dawne 5.26, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md; Biblia §6.26). Wzorzec B.
 */

export type WentylacjaPorownanieInput = {
  /** Temperatura wewnątrz [°C]; null = nie wpisano. */
  tWewC: number | null
  /** Średnia temperatura zewnętrzna doby [°C]; null = nie wpisano. */
  tZewnC: number | null
  /** Strumień powietrza wentylacji naturalnej [m³/h] (np. liczba wymian × kubatura, Ekran 12). 0 = nie wpisano. */
  strumienNaturalnyM3H: number
  /** Strumień powietrza wentylacji mechanicznej [m³/h] (Ekran 3). 0 = nie wpisano. */
  strumienMechanicznyM3H: number
  /** Sprawność odzysku ciepła rekuperatora [%] — karta. */
  sprawnoscOdzyskuPct: number
  /** Pobór wentylatorów centrali [W] — karta, praca całą dobę. */
  mocWentylatorowW: number
  /** COP ogrzewania (1 = grzałka/kocioł elektryczny; pompa — karta). 0 = ogrzewanie nieelektryczne — bez bilansu prądu. */
  copOgrzewania: number
  /** Liczba dni sezonu grzewczego, przez które liczysz oszczędność [dni] — opcjonalna; 0 = bez wyniku rocznego. */
  dniSezonu: number
  /** Cena prądu [zł/kWh] — opcjonalna. */
  cenaPraduZlKwh: number
  /** Dopłata za wentylację mechaniczną z rekuperacją [zł] — opcjonalna. */
  doplataZl: number
  /** Nowy, szczelny dom — 🟡 źródła o wentylacji naturalnej. */
  szczelnyDom: boolean
}
