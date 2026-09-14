import type { Izolacja } from "./input"

/** Maksymalna temperatura pracy izolacji [°C] — 1:1 ze źródła. */
export const MAX_TEMPERATURA_C: Record<Izolacja, number> = { PVC: 70, XLPE: 90 }
