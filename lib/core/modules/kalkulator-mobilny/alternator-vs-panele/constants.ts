/**
 * Charging voltage windows for a 12 V battery — Biblia §12.31 (dawne 8.43): "LiFePO4 wymaga innego napięcia
 * ładowania (14,2–14,6 V) niż AGM (14,4–14,8 V) i kwasowy (14,8–15,0 V)". For 24/48 V banks the window scales
 * with the number of 12 V blocks in series (× U / 12).
 */
export type TypAkumulatoraLadowanie = "lifepo4" | "agm" | "kwasowy"

export const NAPIECIE_LADOWANIA_12V: Record<TypAkumulatoraLadowanie, { minV: number; maxV: number }> = {
  lifepo4: { minV: 14.2, maxV: 14.6 },
  agm: { minV: 14.4, maxV: 14.8 },
  kwasowy: { minV: 14.8, maxV: 15.0 },
}

export const NAPIECIE_BAZOWE_V = 12
