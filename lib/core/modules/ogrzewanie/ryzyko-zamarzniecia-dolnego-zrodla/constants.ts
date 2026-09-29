/**
 * Moduł 6 "Ogrzewanie" — "Ryzyko zamarznięcia dolnego źródła" (dawne 5.46, Część 2C,
 * docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, linie 306-311). Wzorzec C — czysta treść,
 * bez kalkulatora. Źródło opisuje zjawisko narracyjnie ("system liczy temperaturę czynnika
 * roboczego w najgorszym scenariuszu"), ale NIE podaje wzoru wiążącego temperaturę gruntu,
 * głębokość kolektora, stężenie glikolu i czas pracy z temperaturą solanki — tylko jeden
 * ilustracyjny przykład liczbowy. Budowa kalkulatora wymagałaby wymyślenia modelu przewodnictwa
 * cieplnego gruntu, którego źródło nie daje — świadomie NIE zbudowany, zgodnie z dyscypliną
 * "nie wymyślaj wzoru" (CLAUDE.md, rdzeń operacyjny). Luka 5.46 znaleziona i domknięta natychmiast
 * przy audycie GOD BOOK Część N (05.09.2026, `docs/rejestr-pokrycia.md`) — dopiero teraz zbudowana,
 * w zakresie ograniczonym do informacyjnym.
 */

export const CZYNNIKI_RYZYKA = [
  { id: "temperatura-gruntu", etykieta: "Temperatura gruntu w najzimniejszym miesiącu", zrodlo: "Moduł 1 (lokalizacja/klimat)" },
  { id: "glebokosc-kolektora", etykieta: "Głębokość kolektora poziomego lub odwiertu", zrodlo: "projekt instalacji dolnego źródła" },
  { id: "stezenie-glikolu", etykieta: "Stężenie glikolu/solanki w obiegu dolnego źródła", zrodlo: "specyfikacja czynnika roboczego" },
  { id: "czas-pracy-ciaglej", etykieta: "Czas ciągłej pracy pompy bez przerwy na regenerację gruntu", zrodlo: "harmonogram/sterownik pompy" },
] as const

export const PRZYKLAD_ILUSTRACYJNY =
  "Przy −20°C i ciągłej pracy pompy temperatura solanki spadnie do −3°C. Zastosuj wyższe stężenie " +
  "glikolu (30%) lub większy kolektor. Wartość ilustracyjna ze źródła, nie liczona dla Twojej " +
  "konkretnej instalacji — źródło nie podaje wzoru wiążącego te cztery czynniki z temperaturą solanki."

export const TWARDY_STOP =
  "Temperatura czynnika roboczego zbliżająca się do punktu zamarzania. Zamarznięcie dolnego źródła " +
  "to koniec pracy pompy i ryzyko uszkodzenia wymiennika."

export const ZALECENIA = [
  "Zwiększ stężenie glikolu w solance (koszt: niższa sprawność cieplna czynnika).",
  "Powiększ kolektor (więcej metrów rury / głębszy odwiert) — rozkłada obciążenie cieplne na większą powierzchnię gruntu.",
  "Zaprogramuj przerwy w pracy ciągłej, żeby grunt zdążył się zregenerować między cyklami.",
  "Monitoruj temperaturę solanki na wyjściu z kolektora — spadek w kierunku 0°C to sygnał ostrzegawczy, nie dopiero zamarznięcie.",
]
