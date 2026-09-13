/**
 * Ekran 20, Moduł 5 "Okablowanie i zabezpieczenia" — "Oznakowanie obwodów"
 * (dawne 4.23, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, wg PN-EN 60445). Wzorzec E.
 */

export type OznakowanieObwodowInput = {
  /** Id oznaczonych elementów z `CHECKLIST_ITEMS`, potwierdzone przez użytkownika. */
  oznaczoneIds: string[]
}
