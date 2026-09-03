import type { NapiecieSystemu } from "./input"

/**
 * Ekran A1, Moduł 11 — dane 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */

/** 12V=4S, 24V=8S, 48V=16S — oczekiwana liczba ogniw w szeregu dla danego napięcia systemu. */
export const OCZEKIWANA_LICZBA_OGNIW: Record<NapiecieSystemu, number> = { 12: 4, 24: 8, 48: 16 }

/** Maksymalna dopuszczalna różnica napięć między ogniwami przed montażem w pakiet. */
export const MAX_ROZNICA_NAPIEC_V = 0.05

export type ChecklistItem = { id: string; element: string }

/** Pozycje bez własnej logiki liczbowej — proste potwierdzenie (Wzorzec E). */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "narzedzia", element: "Narzędzia: klucz dynamometryczny, miernik napięcia" },
  { id: "ochrona-osobista", element: "Środki ochrony: rękawice, okulary, gaśnica" },
  { id: "rezystancja", element: "Rezystancja wewnętrzna zmierzona (jeśli tester dostępny)" },
  { id: "ocena-wizualna", element: "Ocena wizualna: brak wybrzuszeń, przebarwień, uszkodzeń obudowy" },
]
