/**
 * HD 60364-4-443:2016, 443.5 (SRPS HD 60364-4-443:2017 in the repo, verified 27.09.2026): CRL = f_env / (L_P · N_g).
 * Tablica 443.1: f_env = 85·F (rural and suburban) or 850·F (urban); F = 1 for all installations (national committees
 * may choose 1–3 for dwellings — no Polish choice in the repo, so 1).
 */
export const F_ENV_BAZOWE = { wiejskie: 85, miejskie: 850 } as const
export const WSPOLCZYNNIK_F = 1

/** L_P = 2·L_PAL + L_PCL + 0,4·L_PAH + 0,2·L_PCH. */
export const WAGI_LP = { napowietrznaNn: 2, kablowaNn: 1, napowietrznaSn: 0.4, kablowaSn: 0.2 } as const

/** Total length taken into account [km] — or the distance to the first SPD in the network, whichever is smaller. */
export const LP_DLUGOSC_MAX_KM = 1

/** CRL ≥ this → protection against transient overvoltages of atmospheric origin not required. */
export const CRL_PROG = 1000

/** 443.5 Uwaga 2 (IEC 62305-2:2010, A.1): N_g = 0,1 · T_d. */
export const NG_NA_DZIEN_BURZOWY = 0.1

/** Sanity bound for N_g [1/(km²·rok)] — not a norm value; catches T_d typed into the N_g field. */
export const NG_SANITY_MAX = 30
/** Sanity bound for T_d [days/year]. */
export const TD_SANITY_MAX = 365
