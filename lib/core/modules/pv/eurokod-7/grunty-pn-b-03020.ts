/**
 * Hint for the characteristic angle of internal friction Φu of NON-COHESIVE soils from the I_D chart of PN-B-03020
 * (the chart is read off the PDF with ±0.5° accuracy, so every value is an ESTIMATE). Only a hint: Φu is a correlation
 * value, NOT the critical-state angle φ′cv required by PN-EN 1997-1 clause 6.5.3 (10) — the user decides what to enter.
 */

export type GrupaGruntuNiespoistego = "zwir-pospolka" | "pr-ps" | "pd-ppi"

type OdcinekWykresu = { readonly idOd: number; readonly idDo: number; readonly phiOd: number; readonly phiDo: number }

/** Chart ends at I_D = 0.20 and 1.00 (values read from the PN-B-03020 chart, ±0.5°). */
export const WYKRES_PHI_U: Record<GrupaGruntuNiespoistego, OdcinekWykresu> = {
  "zwir-pospolka": { idOd: 0.2, idDo: 1.0, phiOd: 36.3, phiDo: 42.2 },
  "pr-ps": { idOd: 0.2, idDo: 1.0, phiOd: 31.0, phiDo: 36.2 },
  "pd-ppi": { idOd: 0.2, idDo: 1.0, phiOd: 28.9, phiDo: 33.1 },
}

export const TOLERANCJA_ODCZYTU_WYKRESU_DEG = 0.5

/** Φu [°] by linear interpolation along the chart; `null` outside I_D 0.20–1.00 (no extrapolation) or for non-numbers. */
export function katTarciaPhiU(grupa: GrupaGruntuNiespoistego, stopienZageszczeniaId: number): number | null {
  const w = WYKRES_PHI_U[grupa]
  if (!Number.isFinite(stopienZageszczeniaId) || stopienZageszczeniaId < w.idOd || stopienZageszczeniaId > w.idDo) return null
  const u = (stopienZageszczeniaId - w.idOd) / (w.idDo - w.idOd)
  return w.phiOd + u * (w.phiDo - w.phiOd)
}

export type WilgotnoscGruntu = "malo-wilgotne" | "wilgotne" | "mokre"

/** Bulk density ρ [t/m³] of non-cohesive soils, Table 1 of PN-B-03020: columns = dense (I_D 0.68–1.0), medium (0.34–0.67), loose (0–0.33). */
const GESTOSC_OBJETOSCIOWA_TABLICA_1: Record<GrupaGruntuNiespoistego, Record<WilgotnoscGruntu, readonly [number, number, number]>> = {
  "zwir-pospolka": { "malo-wilgotne": [1.85, 1.75, 1.7], wilgotne: [2.0, 1.9, 1.85], mokre: [2.1, 2.05, 2.0] },
  "pr-ps": { "malo-wilgotne": [1.8, 1.7, 1.65], wilgotne: [1.9, 1.85, 1.8], mokre: [2.05, 2.0, 1.95] },
  "pd-ppi": { "malo-wilgotne": [1.7, 1.65, 1.6], wilgotne: [1.85, 1.75, 1.7], mokre: [2.0, 1.9, 1.85] },
}

/** Bulk density ρ [t/m³] from Table 1 (PN-B-03020) for the state given by I_D; `null` outside I_D 0–1. */
export function gestoscObjetosciowaGruntu(grupa: GrupaGruntuNiespoistego, stopienZageszczeniaId: number, wilgotnosc: WilgotnoscGruntu): number | null {
  if (!Number.isFinite(stopienZageszczeniaId) || stopienZageszczeniaId < 0 || stopienZageszczeniaId > 1) return null
  const kolumny = GESTOSC_OBJETOSCIOWA_TABLICA_1[grupa][wilgotnosc]
  if (stopienZageszczeniaId > 0.67) return kolumny[0]
  if (stopienZageszczeniaId > 0.33) return kolumny[1]
  return kolumny[2]
}
