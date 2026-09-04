import type { TypPowierzchniPodSpodem } from "./input"

/** Zakresy dodatkowego uzysku z tylnej strony wg albedo powierzchni — 1:1 ze źródła. */
export const ZAKRESY_UZYSKU_PCT: Record<
  TypPowierzchniPodSpodem,
  { label: string; minPct: number; maxPct: number }
> = {
  biala_membrana: { label: "Biała membrana", minPct: 10, maxPct: 20 },
  jasny_beton: { label: "Jasny beton", minPct: 8, maxPct: 15 },
  piasek: { label: "Piasek", minPct: 10, maxPct: 18 },
  trawa: { label: "Trawa", minPct: 3, maxPct: 5 },
}
