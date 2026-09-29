export { CIEPLO_WLASCIWE_POWIETRZA_J_KG_K, GESTOSC_POWIETRZA_KG_M3 } from "../infiltracja-powietrza/constants"

/** Sanity bound for one layer [cm] — not a norm value (typical input error: millimetres). */
export const GRUBOSC_SANITY_MAX_CM = 200

/** Sanity bound for density [kg/m³] — not a norm value; steel is ~7850. Catches g/m³ or a misplaced digit. */
export const GESTOSC_SANITY_MAX_KG_M3 = 10000

/**
 * Sanity range for specific heat [J/(kg·K)] — not a norm value; building materials and water lie inside it.
 * The lower bound catches values typed in kJ/(kg·K) (e.g. 0,84 instead of 840).
 */
export const CIEPLO_WLASCIWE_SANITY_MIN = 100
export const CIEPLO_WLASCIWE_SANITY_MAX = 5000

/** Points of the cooling curve shown on screen [h]. */
export const PUNKTY_PRZEBIEGU_H = [6, 12, 24, 48, 72] as const

export const J_NA_WH = 3600
export const WH_NA_KWH = 1000

/**
 * EN ISO 13786:2007, Załącznik A.2.4, Tablica A.1 — maximum effective thickness per period of variation [cm]
 * (`docs/zrodla/norma-PN-EN-ISO-13786/02-wzory-i-tablice-zweryfikowane.md`). The screen uses the 1-day period
 * (daily cooling after a heating failure; also the product period of 8.2).
 */
export const GRUBOSC_EFEKTYWNA_MAX_CM = { godzina: 2, doba: 10, tydzien: 25 } as const
export const OKRES_DOBA_S = 86400

/**
 * Surface resistance used in A.3 (A.4) [m²·K/W]. EN ISO 13786 rozdz. 7, (18): Rs per ISO 6946, unknown orientation →
 * vertical (horizontal heat flow); the norm's own example D.1 takes Rsi = 0,13, as does PN-EN ISO 14683 Tablica A.1.
 * ISO 6946 itself is not in the repo — ~~confirmation by the owner pending (✅🤖, 27.09.2026)~~ D54 (29.09.2026, owner):
 * use the value available in the sources until PKN delivers ISO 6946; per-direction values then. 🔎 TD20.
 */
export const OPOR_PRZEJMOWANIA_WEWN_M2K_W = 0.13
