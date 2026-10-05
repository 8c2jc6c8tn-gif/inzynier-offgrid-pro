/**
 * FREE/PRO map as data (standard 12.1) — dashboard tile id → tier.
 * Only what D2 already decides is assigned: M7 stress-test and M13 Live → PRO, M12 emergency
 * calculators → FREE. Every other tile is explicitly "nieprzypisane" until the owner decides the
 * module-level split (D79); M14 tiles (15/16) stay unassigned per D37.
 * No enforcement yet — real gating needs accounts and server-side checks (12.2, 12.5); the UI only
 * shows a badge (D79).
 */

export type Tier = "FREE" | "PRO" | "nieprzypisane"

export const MAPA_TIER_KAFLI: Record<number, Tier> = {
  1: "nieprzypisane",
  2: "nieprzypisane",
  3: "nieprzypisane",
  4: "nieprzypisane",
  5: "nieprzypisane",
  6: "nieprzypisane",
  7: "PRO",
  8: "nieprzypisane",
  9: "nieprzypisane",
  10: "nieprzypisane",
  11: "nieprzypisane",
  12: "FREE",
  13: "PRO",
  15: "nieprzypisane",
  16: "nieprzypisane",
}

export function tierKafla(id: number): Tier {
  return MAPA_TIER_KAFLI[id] ?? "nieprzypisane"
}
