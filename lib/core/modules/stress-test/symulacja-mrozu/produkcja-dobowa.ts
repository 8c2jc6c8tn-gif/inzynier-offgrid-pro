import { KROK_GODZIN, W_NA_KW } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"

const MS_NA_DOBE = 86_400_000

/** Hourly in-plane irradiance of the TMY records — the part of `ProfilNaslonecznienia` this needs. */
export type NaslonecznienieGodzinowe = {
  /** G_poa [W/m²] of each record. */
  gPoa: ArrayLike<number>
  /** Month of each record (0 = January). */
  miesiac: ArrayLike<number>
}

/**
 * PV energy of every day of one month of the TMY [kWh/day]: Σ G_poa·Δt / 1000 × P_kWp × PR. Days are grouped by the UTC date of
 * the record; the UTC midnight falls at 01:00–02:00 in Poland, when there is no sun, so a day is never cut through the production.
 * A TMY month comes from one real year, so its days are consecutive. The user's kWp and PR are the only scaling (no defaults).
 */
export function produkcjaDobowaMiesiaca(naslonecznienie: NaslonecznienieGodzinowe, czasyUtcMs: ArrayLike<number>, miesiac0: number, mocKwp: number, pr: number): number[] {
  const dni = new Map<number, number>()
  for (let i = 0; i < naslonecznienie.gPoa.length; i++) {
    if (naslonecznienie.miesiac[i] !== miesiac0) continue
    const dzien = Math.floor(czasyUtcMs[i]! / MS_NA_DOBE)
    dni.set(dzien, (dni.get(dzien) ?? 0) + (naslonecznienie.gPoa[i]! * KROK_GODZIN) / W_NA_KW)
  }
  return [...dni.entries()].sort((a, b) => a[0] - b[0]).map(([, kwhNaM2]) => kwhNaM2 * mocKwp * pr)
}
