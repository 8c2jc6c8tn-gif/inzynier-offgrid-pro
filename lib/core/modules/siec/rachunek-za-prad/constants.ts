import type { Grupa, Strefa } from "@/lib/core/dane/rozliczenia-pl-2026"

/** Zones of each group (opracowanie §2.4a, §8.1). Hours of the zones are OSD data, not needed here. */
export const STREFY_GRUPY: Record<Grupa, Strefa[]> = {
  G11: ["calodobowa"],
  G12: ["dzien", "noc"],
  G12w: ["szczyt", "pozaszczyt"],
  C11: ["calodobowa"],
  C12a: ["szczyt", "pozaszczyt"],
  C12b: ["dzien", "noc"],
  C21: ["calodobowa"],
  C22a: ["szczyt", "pozaszczyt"],
  C22b: ["dzien", "noc"],
}

/** Boundary between C1x and C2x [kW] (✅ opracowanie §8.1): C1x ≤ 40 kW, C2x > 40 kW. */
export const GRANICA_C1X_C2X_KW = 40

export function czyGrupaG(grupa: Grupa): boolean {
  return grupa.startsWith("G")
}

export function czyGrupaC2x(grupa: Grupa): boolean {
  return grupa.startsWith("C2")
}

/** Whether a C group is available for the contracted power (✏️ K8: unavailable = excluded, not "worse"). */
export function grupaDostepnaDlaMocy(grupa: Grupa, mocUmownaKw: number): boolean {
  if (czyGrupaG(grupa)) return true
  return czyGrupaC2x(grupa) ? mocUmownaKw > GRANICA_C1X_C2X_KW : mocUmownaKw <= GRANICA_C1X_C2X_KW
}
