/** Zalecany zakres SoC na czas odstawienia — dane 1:1 ze źródła. */
export const SOC_ZALECANY_MIN_PCT = 50
export const SOC_ZALECANY_MAX_PCT = 60

/** Minimalna bezpieczna temperatura przechowywania — dane 1:1 ze źródła. */
export const TEMPERATURA_MIN_BEZPIECZNA_C = -20

export type ChecklistItem = { id: string; element: string }

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "odlaczenie", element: "Odłączono od falownika/obciążeń" },
  { id: "uspienie-bms", element: "Uśpiono BMS" },
]
