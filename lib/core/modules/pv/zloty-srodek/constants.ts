/** Przyspieszenie ziemskie normalne [m/s²] — wartość definicyjna (CGPM 1901), m = F/g. */
export const PRZYSPIESZENIE_ZIEMSKIE_M_S2 = 9.80665

/**
 * Współczynnik konstrukcyjny cscd = 1 — dopuszczony przez 6.2 (1) dla niskich, sztywnych konstrukcji;
 * stelaż PV nie jest budynkiem, więc to założenie (jawne w `assumptions`).
 */
export const CSCD_STELAZ = 1

/**
 * Podpowiedź ceny balastu [zł/kg] — wartość właściciela projektu (D27, 25.09.2026) dla bloczków
 * odlewanych samodzielnie, NIE ze źródła ani normy. UI podstawia ją jako edytowalny start.
 */
export const CENA_BALASTU_PODPOWIEDZ_ZL_KG = 1

export const PHI_MIN = 0
export const PHI_MAX = 1
