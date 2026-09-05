/**
 * Ekran A2, Moduł 11 — dane 1:1 ze źródła (docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Próg docisku (300-400 kgf) NIE jest tu zduplikowany — patrz calculator.ts, wzorzec "echo"
 * z Modułu 4/Ekran 21 (`pozycjonowanie-ogniw`).
 */

export type ChecklistItem = { id: string; element: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "separatory", element: "Separatory między ogniwami zamontowane (żywica epoksydowa lub plastik)" },
  { id: "krawedzie", element: "Krawędzie i naroża zabezpieczone (brak ostrych krawędzi mogących uszkodzić izolację kabli)" },
  { id: "obudowa", element: "Obudowa dobrana do liczby i wymiarów ogniw" },
]
