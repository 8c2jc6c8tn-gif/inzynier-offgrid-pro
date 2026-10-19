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
