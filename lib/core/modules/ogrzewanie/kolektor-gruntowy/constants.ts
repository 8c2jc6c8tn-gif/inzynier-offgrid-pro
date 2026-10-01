/**
 * Zakresy podane wprost przez źródło (Tresc_Modul_6_Ogrzewanie_Ekrany.md, dawne 5.42; Biblia §6.27.16).
 * Służą tylko do pokazania widełek i do ostrzeżeń „wartość spoza zakresu źródła” — do obliczenia wchodzi
 * wskaźnik wpisany przez użytkownika (zależy od gruntu, którego źródło nie przelicza na liczby).
 */

/** Kolektor poziomy: 60–120 m² na każde 10 kW mocy. */
export const POZIOMY_M2_NA_10KW_ZRODLO = { min: 60, max: 120 } as const

/** Kolektor poziomy: głębokość ułożenia 1,2–1,8 m. */
export const POZIOMY_GLEBOKOSC_M_ZRODLO = { min: 1.2, max: 1.8 } as const

/** Kolektor pionowy: ok. 1 m odwiertu na 50–70 W mocy. */
export const PIONOWY_W_NA_M_ZRODLO = { min: 50, max: 70 } as const

/** Kolektor pionowy: odwierty o głębokości 50–100 m. */
export const PIONOWY_GLEBOKOSC_M_ZRODLO = { min: 50, max: 100 } as const
