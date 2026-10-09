/**
 * PN-EN 1990:2004 (Eurokod 0) — ultimate limit state STR/GEO (set B, expression 6.10) for a panel loaded by snow and wind.
 * Source: `docs/zrodla/norma-PN-EN-1990-eurokod-0/` — Table A1.1 (ψ0) and Table A1.2(B), recommended values (verified visually 25–26.09.2026);
 * National Annex NB makes no national changes, so the recommended values apply in Poland. NB recommends the less favourable of (6.10a)/(6.10b);
 * expression (6.10) is never more favourable than either of them, so using it here is on the safe side (a documented assumption).
 */

/** Table A1.2(B), note 2: γG,j,sup for an unfavourable permanent action (self-weight of the panel pressing on it). */
export const GAMMA_G_SUP_STR = 1.35
/** Table A1.2(B), note 2: γQ,1 and γQ,i for an unfavourable variable action (snow, wind). */
export const GAMMA_Q_STR = 1.5
/** Table A1.1: ψ0 for wind loads on buildings. */
export const PSI0_WIATR = 0.6
/** Table A1.1: ψ0 for snow loads on buildings — other CEN countries, sites at H ≤ 1000 m a.s.l. / above 1000 m. */
export const PSI0_SNIEG_DO_1000_M = 0.5
export const PSI0_SNIEG_POWYZEJ_1000_M = 0.7
export const PSI0_SNIEG_WYSOKOSC_PROGOWA_M = 1000

/** ψ0 for snow depends only on the altitude of the site (Table A1.1). */
export function psi0Sniegu(wysokoscNpmM: number): number {
  return wysokoscNpmM > PSI0_SNIEG_WYSOKOSC_PROGOWA_M ? PSI0_SNIEG_POWYZEJ_1000_M : PSI0_SNIEG_DO_1000_M
}
