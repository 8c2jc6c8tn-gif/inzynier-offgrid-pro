/**
 * Nazwane stałe — zakaz "magicznych liczb" w kodzie (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 */

/**
 * Domyślna sprawność układu, gdy użytkownik jej nie poda. Ta sama wartość co przykład
 * w docs/standards/03-jadro-obliczeniowe.md ("η falownika = 0,92") — to jest założenie
 * robocze, nie prawo fizyczne; zawsze oznaczane w `assumptions` wyniku.
 */
export const EFFICIENCY_DEFAULT = 0.92

export const EFFICIENCY_MIN = 0
export const EFFICIENCY_MAX = 1

/** Próg, poniżej którego sprawność jest na tyle niska, że warto ostrzec (nietypowa wartość). */
export const EFFICIENCY_LOW_WARNING_THRESHOLD = 0.5

/** Górna granica "sanity check" mocy — powyżej tego to już nie jest kalkulator kieszonkowy. */
export const POWER_W_SANITY_MAX = 20000
