/**
 * Design outdoor temperature θe per Polish climate zone [°C]. Two independent sources in the repo
 * agree: PN-82/B-02403, Tablica 1 (`docs/zrodla/norma-PN-82-B-02403/`) and the Purmo guide,
 * Tabela 2.1, quoting the national annex of PN-EN 12831 (`docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/`,
 * section 2.3: "odpowiada obliczeniowej temperaturze ... wg PN-82/B-02403").
 */
export type StrefaKlimatyczna = 1 | 2 | 3 | 4 | 5
export const STREFY_KLIMATYCZNE: readonly StrefaKlimatyczna[] = [1, 2, 3, 4, 5]
export const TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C: Record<StrefaKlimatyczna, number> = {
  1: -16,
  2: -18,
  3: -20,
  4: -22,
  5: -24,
}

export const GODZIN_NA_DOBE = 24
/** Days per month of a non-leap year (TMY convention). */
export const DNI_MIESIECY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

/** Sanity bound for U [W/(m²·K)] — a single uninsulated glass pane is ~5–6; not a norm value. */
export const U_SANITY_MAX = 10
/** Sanity bound for air changes per hour — same as M6/E12 (not a norm value). */
export { WYMIANY_SANITY_MAX } from "../infiltracja-powietrza/constants"
