/**
 * PN-EN 1990:2004 (Eurokod 0) — static equilibrium (EQU), only what Module 3 ballast needs.
 * Source: `docs/zrodla/norma-PN-EN-1990-eurokod-0/` — values verified visually against the original
 * PDF (26.09.2026), not only against the OCR text:
 *  - 6.4.2 (1)P, expression (6.7): Ed,dst ≤ Ed,stb;
 *  - Annex A1, Table A1.2(A) (EQU, set A), NOTE 1 recommended values: γG,j,inf = 0,90 (favourable
 *    permanent action), γQ,1 = 1,50 (unfavourable leading variable action);
 *  - National Annex NB (buildings): "nie wprowadza się żadnych zmian krajowych" → recommended values.
 * Pure functions without CalcResult — shared by M3/E9, M3/E2 and M3/E6 (echo D12).
 */

/** Table A1.2(A): partial factor for a favourable (stabilising) permanent action — ballast. */
export const GAMMA_G_INF_EQU = 0.9
/** Table A1.2(A): partial factor for the unfavourable leading variable action — wind uplift. */
export const GAMMA_Q_EQU = 1.5

/**
 * Minimum ballast mass [kg] from EQU (6.7) for a vertical uplift force:
 * γQ·Fk ≤ γG,inf·(m + mw)·g  →  m = max(0, γQ·Fk / (γG,inf·g) − mw).
 * `masaWlasnaKg` (mw) = panels + frame, from the datasheet or weighing — a permanent stabilising action
 * with the same γG,inf as ballast (D29, owner decision 28.09.2026). 0 = not entered → self-weight
 * ignored, on the safe side.
 */
export function balastProjektowyEquKg(silaOdrywajacaN: number, przyspieszenieZiemskieMS2: number, masaWlasnaKg = 0): number {
  return Math.max(0, (GAMMA_Q_EQU * silaOdrywajacaN) / (GAMMA_G_INF_EQU * przyspieszenieZiemskieMS2) - masaWlasnaKg)
}
