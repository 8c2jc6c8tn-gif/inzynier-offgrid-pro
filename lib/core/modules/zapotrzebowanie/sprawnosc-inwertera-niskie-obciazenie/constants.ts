/**
 * Progi obciążenia falownika ze źródła (Sekcja A): sprawność max ~95% przy 40-80% obciążenia,
 * spadek do 70-80% poniżej 10% obciążenia. Używane wyłącznie jako etykiety kontekstowe (którą
 * strefę krzywej reprezentuje wpisana sprawność) — sama sprawność procentowa jest zawsze
 * wpisywana ręcznie przez użytkownika (z karty katalogowej falownika), nigdy nie wyliczana
 * z krzywej, bo źródło nie podaje pełnego wzoru krzywej sprawności.
 */
export const PROG_NISKIEGO_OBCIAZENIA_PCT = 10
export const ZAKRES_OPTYMALNY_MIN_PCT = 40
export const ZAKRES_OPTYMALNY_MAX_PCT = 80
