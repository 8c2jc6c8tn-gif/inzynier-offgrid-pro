/** Progi prądu różnicowego wg celu ochrony — 1:1 ze źródła. */
export const PROG_OCHRONA_OSOB_MA = 30
export const PROG_OCHRONA_POZAROWA_MA = 300

/** Kolejność "siły" typów RCD, do porównań (AC < A < B). */
export const KOLEJNOSC_TYPOW_RCD: Record<"AC" | "A" | "B", number> = { AC: 0, A: 1, B: 2 }
