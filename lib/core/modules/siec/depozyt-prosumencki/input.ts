/**
 * M14 — D8 „Net-metering, net-billing, depozyt — co tracę, odchodząc” (mini-calculator part,
 * Wzorzec C + D). `03_M14_Dom_i_Firma_Siec.md` §3; opracowanie §3.1 (ustawa o OZE, t.j. Dz.U. 2026
 * poz. 68: art. 4c ust. 4 — ×1,23; art. 4 ust. 11a — refund max 20% RCEm / 30% RCE; art. 4c ust. 6
 * — the rest is written off after 12 months). Net-billing only: net-metering ratios are 🔎A and
 * stay in the article text.
 */
export type SystemCeny = "rcem" | "rce"

export type DepozytInput = {
  /** Month of feeding the energy in (ISO date inside that month) — selects the ×1,23 period. */
  dataMiesiaca: string
  /** Energy fed into the grid in that month [kWh]. 0 = not entered. */
  energiaOddanaKwh: number
  /** Average market price for that energy [zł/MWh] (RCEm, or RCE weighted by hours). Negative RCE hours count as 0. */
  cenaRynkowaZlMwh: number
  systemCeny: SystemCeny
  /** Part of this month's deposit used within 12 months [zł]; null = not known yet. */
  wykorzystanoZl: number | null
  /** Optional full gross cost of 1 kWh drawn [zł/kWh] (e.g. from D1) — for the balancing ratio (✏️ K14). */
  pelnyKosztKwhBruttoZl: number | null
}
