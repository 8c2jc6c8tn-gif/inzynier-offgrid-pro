/** Biblia §12.48, krok 1: napięcie spoczynkowe mierzone „po 4 h bez obciążenia”. */
export const CZAS_SPOCZYNKU_H = 4

/**
 * Biblia §12.48: „Napięcie 10,5 V w spoczynku oznacza, że akumulator jest do wyrzucenia” (12 V ołowiowy).
 * Ta sama wartość co próg krytycznego rozładowania Biblii §12.58 (E42) — 6 ogniw × 1,75 V.
 */
export const PROG_WYRZUCENIA_OLOW_12V = 10.5

/** Ogniwo ołowiowe ma 2 V znamionowo — próg 12 V przelicza się na inne napięcia przez liczbę ogniw. */
export const NAPIECIE_OGNIWA_OLOW_V = 2
