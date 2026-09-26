export { DNI_MIESIECY, GODZIN_NA_DOBE, U_SANITY_MAX } from "../obciazenie-cieplne/constants"

/** Source (Sekcja B): "koszt izolacji vs oszczędności w 10 lat". */
export const LAT_ANALIZY = 10

/**
 * Sanity bound for λ [W/(m·K)] — not a norm value; insulation materials are ~0.02–0.05 and even solid brick stays
 * below it. Catches λ typed in mW/(m·K) (e.g. 35 instead of 0.035).
 */
export const LAMBDA_SANITY_MAX = 2

/** Sanity bound for one added layer [cm] — not a norm value (typical input error: millimetres). */
export const GRUBOSC_SANITY_MAX_CM = 100
