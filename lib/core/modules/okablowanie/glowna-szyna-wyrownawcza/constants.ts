/**
 * Elementy do podłączenia do GSW z minimalnym przekrojem przewodu wyrównawczego —
 * 1:1 ze źródła (docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Ekran 10).
 */
export type ChecklistItem = { id: string; element: string; minPrzekrojMm2: number }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "konstrukcja-paneli", element: "Konstrukcja paneli", minPrzekrojMm2: 16 },
  { id: "falownik", element: "Falownik", minPrzekrojMm2: 10 },
  { id: "bateria", element: "Bateria", minPrzekrojMm2: 16 },
  { id: "instalacja-wodna", element: "Instalacja wodna (jeśli metalowa)", minPrzekrojMm2: 6 },
  { id: "uziom", element: "Uziom", minPrzekrojMm2: 50 },
]
