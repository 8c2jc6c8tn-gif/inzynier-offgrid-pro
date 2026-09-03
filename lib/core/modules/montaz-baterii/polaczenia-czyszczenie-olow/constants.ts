/**
 * Ekran B3, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Połączenia + czyszczenie
 * biegunów" (scala dawne 10.3, 10.10 — docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna, bez wymuszonej kolejności.
 */

export type ChecklistItem = { id: string; element: string; uwaga: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "oczyszczone-bieguny",
    element: "Bieguny oczyszczone szczotką drucianą/papierem ściernym przed podłączeniem",
    uwaga: "—",
  },
  {
    id: "wazelina-techniczna",
    element: "Połączenie posmarowane wazeliną techniczną",
    uwaga: "Nie smarem miedzianym — reakcja z ołowiem.",
  },
  {
    id: "schemat-polaczen",
    element: "Schemat połączeń zgodny z żądanym napięciem",
    uwaga: "Szeregowo dla napięcia, równolegle dla pojemności.",
  },
]
