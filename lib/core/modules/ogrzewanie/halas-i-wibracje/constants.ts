/**
 * Moduł 6 "Ogrzewanie" — "Hałas i wibracje pompy ciepła" (dawne 5.31, Część 2C,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, linie 320-326). Wzorzec C — czysta treść,
 * bez kalkulatora. Źródło opisuje "model rozprzestrzeniania hałasu z tłumieniem przez odległość,
 * ekrany, odbicia" narracyjnie, bez podania wzoru propagacji akustycznej (wymagałby
 * współczynników tłumienia/odbicia, których źródło nie podaje) — świadomie NIE zbudowany jako
 * kalkulator, zgodnie z dyscypliną "nie wymyślaj wzoru". Luka 5.31 znaleziona i domknięta
 * natychmiast przy audycie GOD BOOK Część N (05.09.2026, `docs/rejestr-pokrycia.md`) — dopiero
 * teraz zbudowana, w zakresie ograniczonym do informacyjnym.
 */

export const CZYNNIKI = [
  { id: "moc-akustyczna", etykieta: "Poziom mocy akustycznej pompy [dB(A)]", zrodlo: "karta katalogowa producenta / baza komponentów" },
  { id: "lokalizacja-montazu", etykieta: "Lokalizacja montażu jednostki", zrodlo: "Moduł 1 (lokalizacja)" },
  { id: "odleglosc-okien", etykieta: "Odległość od okien sypialni / granicy działki", zrodlo: "plan zagospodarowania" },
  { id: "norma-lokalna", etykieta: "Lokalna norma hałasu nocnego (typowo 40 dB(A) w nocy)", zrodlo: "przepisy lokalne — sprawdź samodzielnie" },
] as const

export const PRZYKLAD_ILUSTRACYJNY =
  "Poziom hałasu przy sypialni wyniesie 45 dB(A) w nocy — to za dużo. Zastosuj obudowę akustyczną " +
  "lub przenieś jednostkę. Wibroizolatory obniżą hałas o dodatkowe 5 dB. Wartość ilustracyjna ze " +
  "źródła, nie liczona dla Twojej konkretnej lokalizacji — źródło nie podaje wzoru propagacji " +
  "akustycznej (tłumienie odległością/ekranami/odbiciami)."

export const OSTRZEZENIE =
  "Przekroczenie lokalnej normy hałasu nocnego — sprawdź dokumentację akustyczną pompy i realną " +
  "odległość od najbliższych okien sypialni (własnych i sąsiada)."

export const MIGAWKA =
  "Pompa ciepła to maszyna z wentylatorem i sprężarką — jak stoi pod oknem sypialni, nie da Ci " +
  "spać, a sąsiad może złożyć skargę."

export const ZALECENIA = [
  "Zastosuj obudowę akustyczną jednostki zewnętrznej.",
  "Zamontuj wibroizolatory pod jednostką (ok. -5 dB wg przykładu źródła).",
  "Zwiększ odległość od okien sypialni, jeśli to możliwe na etapie planowania.",
  "Sprawdź kartę katalogową pompy — producenci podają poziom mocy akustycznej w dB(A), nie tylko ciśnienia akustycznego.",
]
