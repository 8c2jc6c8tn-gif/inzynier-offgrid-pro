/** Rezystywność miedzi — uniwersalna stała fizyczna, dana 1:1 ze źródła (Sekcja B). */
export const REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M = 0.0175

/** Standardowe przekroje kabli DC do porównania (nie wymyślone — typowe wartości katalogowe IEC). */
export const PRZEKROJE_DO_POROWNANIA_MM2 = [4, 6, 10, 16] as const

/** Cel źródła: strata poniżej tego zakresu (Sekcja B: "cel: strata <2-3%") — tylko do podpowiedzi w UI. */
export const CEL_STRATY_MAX_PCT = 3
