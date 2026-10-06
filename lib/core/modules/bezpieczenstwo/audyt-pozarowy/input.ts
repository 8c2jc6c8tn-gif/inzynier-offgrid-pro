/**
 * Ekran 11, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Autonomiczny audyt
 * bezpieczeństwa pożarowego" (dawne 12.57 — docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md).
 * Wzorzec G — raport: ekran cykliczny, generowany automatycznie, bez pól do
 * wypełnienia przez użytkownika poza reagowaniem na wykryte braki
 * (docs/standards/08-ui-ux.md, 8.2).
 * [06.10.2026] Until Modules 8/9/13 feed the list live, the user enters it by hand after
 * their own inspection (owner decision — demo data removed, docs/memory.md).
 */

/** Checked categories, 1:1 with the source (Ekran 11, "Sprawdzane elementy"). */
export type AuditKategoria = "czujniki-dymu" | "gasnice" | "drogi-ewakuacyjne" | "klapy-pozarowe" | "przeglady"

export type AuditItemStatus = "ok" | "warning" | "critical"

export type AuditCheckItem = {
  id: string
  kategoria: AuditKategoria
  /** User's own name of the element (data, never translated); empty = numbered fallback. */
  element: string
  status: AuditItemStatus
  /** Opis problemu — puste, gdy status "ok". */
  opis: string
}
