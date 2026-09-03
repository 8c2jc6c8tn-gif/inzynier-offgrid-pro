/**
 * Ekran B1, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Weryfikacja + kontrola
 * wstępna" (scala dawne 10.1, 10.8 — docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec E — checklist weryfikacyjna, bez wymuszonej kolejności (docs/standards/08-ui-ux.md,
 * 8.2). Ten sam szkielet UI co Ekran A1/A7, treść specyficzna dla chemii kwasowo-ołowiowej.
 */

export type ChecklistItem = { id: string; element: string; uwaga: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "ten-sam-typ-i-wiek",
    element: "Akumulatory tego samego typu, pojemności i podobnego wieku",
    uwaga: "Mieszanie różnych generacji przyspiesza degradację słabszych ogniw.",
  },
  {
    id: "napiecie-spoczynkowe",
    element: "Napięcie spoczynkowe zmierzone",
    uwaga: "12,6–12,8 V = pełny.",
  },
  {
    id: "poziom-elektrolitu",
    element: "Poziom elektrolitu sprawdzony (jeśli z korkami)",
    uwaga: "—",
  },
  {
    id: "ocena-wizualna",
    element: "Ocena wizualna: brak pęknięć obudowy, wycieków",
    uwaga: "—",
  },
]
