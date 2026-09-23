/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 * Parametry próbkowania to wybór numeryczny (rozdzielczość całkowania), nie współczynniki fizyczne.
 */

/** Rok referencyjny próbkowania pozycji słońca (nieprzestępny). Zmiana pozycji słońca między latami jest pomijalna dla rocznego bilansu. */
export const ROK_REFERENCYJNY = 2026
export const DNI_W_ROKU_REFERENCYJNYM = 365
/** Krok próbkowania w ciągu doby [min]. Źródło mówi "dla każdej godziny"; próbkujemy gęściej (dokładniej, ten sam model). */
export const KROK_MIN = 10
export const MS_NA_MINUTE = 60_000
export const MS_NA_DOBE = 86_400_000
export const MIESIECY = 12

/** Rozdzielczość profilu horyzontu zwracanego do wykresu [°]. */
export const KROK_PROFILU_HORYZONTU_DEG = 1

/** Zakresy sanity-check (fizyczna możliwość, nie normy). */
export const SZEROKOSC_MIN = -90
export const SZEROKOSC_MAX = 90
export const DLUGOSC_MIN = -180
export const DLUGOSC_MAX = 180
export const NACHYLENIE_MIN_DEG = 0
export const NACHYLENIE_MAX_DEG = 90
export const AZYMUT_MIN_DEG = 0
export const AZYMUT_MAX_DEG = 360
export const MIN_WIERZCHOLKOW_OBRYSU = 3

/** Tolerancja numeryczna przecięć geometrycznych [m]. */
export const EPS_GEOMETRII = 1e-9
