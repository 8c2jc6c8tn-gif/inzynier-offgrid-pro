/** Biblia §12.58, krok 2: „jeśli napięcie poniżej 10,5 V, akumulator jest krytycznie rozładowany” (AGM/kwasowy 12 V). */
export const PROG_KRYTYCZNEGO_ROZLADOWANIA_OLOW_12V = 10.5

/** Procedury Modułu 11, do których odsyła ten ekran (źródło: odesłanie zamiast potrójnej duplikacji logiki). */
export const PROCEDURY = {
  LiFePO4: [{ ekran: "M11/A9", href: "/kalkulatory/ratowanie-ogniwa" }],
  olow: [
    { ekran: "M11/B10", href: "/kalkulatory/ocena-zasiarczenia" },
    { ekran: "M11/B11", href: "/kalkulatory/ratowanie-zasiarczenia" },
  ],
} as const
