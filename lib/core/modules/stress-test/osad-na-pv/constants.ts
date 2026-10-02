/**
 * Ekran 7 + Ekran 14, Moduł 7 — deposit on PV. The source gives no melting or transmission model, only examples,
 * so the screen shows a „what if” table instead of asking for the days and the percentage (owner's decision
 * 02.10.2026). Every number below is either a source example (named as such) or the owner's list of horizons.
 */

/** Days of cover shown in the „what if” table — the owner's list (1, 3, 5 and 7 days). */
export const DNI_SCENARIUSZY = [1, 3, 5, 7] as const

/** Source (Ekran 7, sekcja C), example: „Przy −5°C śnieg utrzyma się 3 dni”. */
export const DNI_PRZYKLAD_SNIEG = 3

/** Source (Ekran 14, sekcja C), example: „Po 48h mgły i szadzi…” = 2 days. */
export const DNI_PRZYKLAD_SZADZ = 2

/** Source (Ekran 7, sekcja C), example: „Po 24h opadów śniegu produkcja spadnie do 0%”; glaze/frost blocks the light completely. */
export const POZOSTALA_SNIEG_PCT = 0

/** Source (Ekran 14, sekcja C), example: „produkcja spadnie do 5% nominalnej”. */
export const POZOSTALA_SZADZ_PCT = 5
