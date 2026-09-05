/**
 * Ekran A5, Moduł 11 — dane 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */

/** Szybkość testowego ładowania — "0,1C" 1:1 ze źródła. */
export const TEST_LADOWANIA_C_RATE = 0.1

/** Czas trwania testu ładowania — "30 minut" 1:1 ze źródła (informacyjne, nie wchodzi do wzoru prądu). */
export const CZAS_TESTU_MIN = 30

/** Próg napięcia ogniwa uznający Top Balancing za osiągnięty — "3,55V" 1:1 ze źródła. */
export const PROG_TOP_BALANCING_V = 3.55

export type ChecklistItem = { id: string; element: string }

/** Pozycje bez własnej logiki liczbowej — proste potwierdzenie (Wzorzec E). */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "bms-balansuje", element: "Obserwacja: BMS zaczyna balansować" },
  { id: "weryfikacja-parametrow", element: "Weryfikacja wszystkich parametrów przed pełnym obciążeniem" },
]
