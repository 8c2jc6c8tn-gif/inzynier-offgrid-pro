/** Days per month (non-leap year) — the monthly model does not depend on the calendar year. */
export const DNI_MIESIACA = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

/** Winter months checked by the winter condition of scenario D (`03_M14` §4: December and January). */
export const MIESIACE_ZIMOWE = [11, 0] as const
