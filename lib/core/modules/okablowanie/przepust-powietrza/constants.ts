/**
 * Wartości 1:1 ze źródła (Sekcje B/C): szczelina <5 cm może dopuścić temperaturę panelu do 70°C
 * (przykład źródła), szczelina ≥15 cm to rekomendowane minimum bezpieczne (Sekcja C). Źródło NIE
 * podaje ciągłej zależności szczelina→temperatura dla zakresu pośredniego (5–15 cm) — nie
 * wymyślamy interpolacji, patrz `calculator.ts`.
 */
export const PROG_KRYTYCZNY_CM = 5
export const PROG_BEZPIECZNY_CM = 15

/** Współczynnik straty mocy panelu powyżej temperatury odniesienia (STC) — 1:1 ze źródła. */
export const WSPOLCZYNNIK_STRATY_PCT_PER_C = 0.4
/** Temperatura odniesienia (STC) — 1:1 ze źródła. */
export const TEMPERATURA_ODNIESIENIA_C = 25
/** Temperatura panelu przy szczelinie <5 cm, z przykładu źródła (Sekcja B). */
export const TEMPERATURA_PRZY_SZCZELINIE_KRYTYCZNEJ_C = 70
