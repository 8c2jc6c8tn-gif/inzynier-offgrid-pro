/**
 * Ekran 4, Moduł 5 "Okablowanie i zabezpieczenia" — "Łączenie Cu-Al i ochrona przed korozją"
 * (dawne 4.36, 4.37, 4.39, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type Material = "Cu" | "Al" | "stal-ocynkowana" | "stal-nierdzewna" | "mosiadz"
export type Srodowisko = "suche" | "wilgotne" | "slone"

export type LaczenieCuAlInput = {
  material1: Material | null
  material2: Material | null
  srodowisko: Srodowisko
  /** Tylko przy parze Cu+Al: czy zastosowano złączkę bimetaliczną + pastę. */
  maZlaczkeBimetaliczna: boolean
  /** Tylko przy parze stal ocynkowana+Cu: czy zastosowano podkładkę i smar. */
  maPodkladkeISmar: boolean
  /** Opcjonalnie: przekrój Cu do przeliczenia na wymagany przekrój Al [mm²]. 0 = nie liczone. */
  przekrojCuMm2: number
}
