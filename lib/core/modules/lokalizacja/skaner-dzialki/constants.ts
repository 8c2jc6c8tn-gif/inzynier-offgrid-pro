/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 */

/** Elipsoida WGS84 — NIMA TR8350.2, "Department of Defense World Geodetic System 1984", 3rd ed., 2000. */
export const WGS84_A = 6378137.0
export const WGS84_F = 1 / 298.257223563
export const WGS84_E2 = WGS84_F * (2 - WGS84_F)

export const MIN_PUNKTOW_WIELOKATA = 3
export const MIN_PUNKTOW_POLACI = 3

export const SZEROKOSC_MIN = -90
export const SZEROKOSC_MAX = 90
export const DLUGOSC_MIN = -180
export const DLUGOSC_MAX = 180

/** Poniżej tego nachylenia połać jest płaska — azymut nieokreślony [°]. Tolerancja numeryczna, nie próg projektowy. */
export const NACHYLENIE_PLASKIE_EPS_DEG = 1e-6
/** Tolerancja numeryczna długości [m]. */
export const EPS_DLUGOSCI_M = 1e-9
