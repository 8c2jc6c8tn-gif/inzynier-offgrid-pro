/**
 * Fixed START horizons of the fuel stock (owner decision 02.10.2026): 3 / 7 / 14 days / the whole month,
 * plus a user-entered number of days. The source gives no horizon; these are the owner's own start options.
 */
export const HORYZONTY_STALE_DNI = [3, 7, 14] as const

/** Days per month, January..December, non-leap calendar (used to prorate the worst month to N days). */
export const DNI_W_MIESIACU = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

/** Upper bound of a user-entered horizon / window [days] — one calendar year. */
export const MAX_DNI = 366

/** Gregorian leap-year rule. */
export const czyRokPrzestepny = (rok: number): boolean => (rok % 4 === 0 && rok % 100 !== 0) || rok % 400 === 0

/** Days per month of a given year (February 29 in a leap year). */
export const dniWMiesiacuRoku = (rok: number): number[] =>
  DNI_W_MIESIACU.map((d, i) => (i === 1 && czyRokPrzestepny(rok) ? 29 : d))
