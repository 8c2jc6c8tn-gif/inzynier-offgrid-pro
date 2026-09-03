/**
 * Ekran B6, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Pierwsze uruchomienie i
 * testy" (dawne 10.6 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna, bez wymuszonej kolejności.
 */

export type ChecklistItem = { id: string; element: string; uwaga: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "napiecie-spoczynkowe",
    element: "Pomiar napięcia spoczynkowego każdego akumulatora",
    uwaga: "—",
  },
  {
    id: "test-ladowania",
    element: "Test ładowania — obserwacja krzywej prądu/napięcia",
    uwaga: "—",
  },
  {
    id: "temperatura-ladowania",
    element: "Sprawdzenie temperatury podczas pierwszego ładowania",
    uwaga: "Akumulatory kwasowe grzeją się przy ładowaniu bardziej niż LiFePO4.",
  },
]
