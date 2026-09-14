/**
 * Ekran 25, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przed gryzoniami"
 * (dawne 4.32, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C.
 */

export type PoziomRyzykaGryzoni = "wysokie" | "niskie"

export type OchronaPrzedGryzoniamiInput = {
  /** Zastępuje "auto z Modułu 1" ręcznym wyborem — Moduł 1 nie ma dziś pola "typ terenu". */
  poziomRyzyka: PoziomRyzykaGryzoni | null
}
