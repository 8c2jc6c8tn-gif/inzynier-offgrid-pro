/**
 * Ekran 11, Moduł 4 "Magazyn energii / baterie" — "Moment dokręcania śrub (Torque Control)"
 * (dawne 3.12 — docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna: sekwencja "zrób i potwierdź", nie kalkulacja
 * (docs/standards/08-ui-ux.md, 8.2). Wartości momentów dokręcania — dane 1:1 ze źródła.
 */

export type ChecklistItem = {
  id: string
  element: string
  moment: string
  uwaga: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "terminal-m6",
    element: "Terminal ogniwa M6 (typowy LiFePO4)",
    moment: "4–4,5 N·m",
    uwaga: "Klucz dynamometryczny, nigdy udarowy.",
  },
  {
    id: "terminal-m8",
    element: "Terminal ogniwa M8",
    moment: "8 N·m",
    uwaga: "—",
  },
  {
    id: "kontrola-24h",
    element: "Kontrola ponowna po 24h",
    moment: "—",
    uwaga: "Sprawdź osiadanie połączenia.",
  },
]

/** Ostrzeżenia stałe, zawsze widoczne — nie są powiązane z konkretnym krokiem. */
export const OSTRZEZENIA_STALE = [
  "Nie stosuj podkładek sprężystych bezpośrednio na terminalu.",
  "Nie używaj pasty miedziowej na aluminium (cross-ref Moduł 5, Ekran 4 — korozja galwaniczna).",
]
