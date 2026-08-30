/**
 * Ekran 11, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Autonomiczny audyt
 * bezpieczeństwa pożarowego" (dawne 12.57 — docs/domena/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md).
 * Wzorzec G — raport: ekran cykliczny, generowany automatycznie, bez pól do
 * wypełnienia przez użytkownika poza reagowaniem na wykryte braki
 * (docs/standards/08-ui-ux.md, 8.2).
 */

export type AuditItemStatus = "ok" | "warning" | "critical"

export type AuditCheckItem = {
  id: string
  kategoria: string
  element: string
  status: AuditItemStatus
  /** Opis problemu — puste, gdy status "ok". */
  opis: string
}
