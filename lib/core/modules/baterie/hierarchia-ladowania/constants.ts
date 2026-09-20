/**
 * Brak sugerowanej wartości progu krytycznego SoC — w całym projekcie (grep po
 * `lib/core/modules/` i `docs/zrodla/`) nie istnieje jedna kanoniczna wartość "SoC krytyczny".
 * Pole `socProguKrytycznegoPct` w input.ts jest więc czysto ręczne, bez ukrytego domyślnego
 * wypełnienia (docs/standards/08-ui-ux.md, 8.6 — dane bezpieczeństwa nigdy jako cichy default).
 */
export {}
