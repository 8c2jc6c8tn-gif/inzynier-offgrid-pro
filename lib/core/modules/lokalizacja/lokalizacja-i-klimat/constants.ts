/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 * Zakresy to tylko "sanity check" fizycznej możliwości, nie normy klimatyczne.
 */

export const SZEROKOSC_MIN = -90
export const SZEROKOSC_MAX = 90

export const DLUGOSC_MIN = -180
export const DLUGOSC_MAX = 180

/** Sanity check temperatury minimalnej — od rekordów biegunowych po tropiki. */
export const TEMPERATURA_MIN_C = -60
export const TEMPERATURA_MAX_C = 25
