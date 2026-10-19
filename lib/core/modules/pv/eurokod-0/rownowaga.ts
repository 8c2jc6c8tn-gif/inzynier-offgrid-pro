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
 * γQ·Fk ≤ γG,inf·(m + G)·g  →  m = max(0, γQ·Fk / (γG,inf·g) − G).
 * G = self-weight of panels and frame [kg] (D29, 28.09.2026) — a permanent stabilising action with the
 * same γG,inf as the ballast. Only when the user enters it (datasheet/scale); default 0 = ignored, on
 * the safe side.
 */
export function balastProjektowyEquKg(silaOdrywajacaN: number, przyspieszenieZiemskieMS2: number, masaWlasnaKg = 0): number {
  return Math.max(0, (GAMMA_Q_EQU * silaOdrywajacaN) / (GAMMA_G_INF_EQU * przyspieszenieZiemskieMS2) - masaWlasnaKg)
}

/**
 * Stability of a free-standing frame against sliding and overturning — static equilibrium with the SAME partial
 * factors as the uplift check (EN 1990 Table A1.2(A): γQ = 1,50 wind, γG,inf = 0,90 ballast and self-weight).
 * The norm gives no friction coefficient nor point of application of the wind force, so both are user inputs
 * (no defaults) and the result is an application ESTIMATE, never a normative value. Wind force on a tilted panel
 * is perpendicular to it: F_h = F·sin α, F_v = F·cos α (uplift). At 90° F_h = F, F_v = 0.
 */
export type StatecznoscStelaza = {
  /** Friction coefficient between frame/ballast and ground, μ > 0 (user input, depends on ground). */
  wspolczynnikTarcia: number
  /** Height of the wind force application point above the ground [m], h > 0. */
  wysokoscSrodkaParciaM: number
  /** Footprint width of the frame in the wind direction [m], b > 0 (overturning about the leeward edge). */
  szerokoscPodstawyM: number
}

/**
 * Sliding: γQ·Fh ≤ μ·(γG,inf·(m + G)·g − γQ·Fv)  →  m = max(0, (γQ·Fh/μ + γQ·Fv)/(γG,inf·g) − G).
 * The uplift part of the wind reduces the normal force that carries the friction.
 */
export function balastPrzesuwuEquKg(silaPoziomaN: number, silaPionowaN: number, wspolczynnikTarcia: number, przyspieszenieZiemskieMS2: number, masaWlasnaKg = 0): number {
  return Math.max(0, (GAMMA_Q_EQU * (silaPoziomaN / wspolczynnikTarcia + silaPionowaN)) / (GAMMA_G_INF_EQU * przyspieszenieZiemskieMS2) - masaWlasnaKg)
}

/**
 * Overturning about the leeward edge, weight at b/2 and uplift reducing the restoring moment:
 * γQ·Fh·h ≤ (γG,inf·(m + G)·g − γQ·Fv)·b/2  →  m = max(0, γQ·(Fv + 2·Fh·h/b)/(γG,inf·g) − G).
 */
export function balastPrzewracaniaEquKg(silaPoziomaN: number, silaPionowaN: number, wysokoscSrodkaParciaM: number, szerokoscPodstawyM: number, przyspieszenieZiemskieMS2: number, masaWlasnaKg = 0): number {
  return Math.max(0, (GAMMA_Q_EQU * (silaPionowaN + (2 * silaPoziomaN * wysokoscSrodkaParciaM) / szerokoscPodstawyM)) / (GAMMA_G_INF_EQU * przyspieszenieZiemskieMS2) - masaWlasnaKg)
}
