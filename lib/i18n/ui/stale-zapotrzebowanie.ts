/**
 * stale-zapotrzebowanie — screen text for the Polish `label:` constants of the demand-category engine modules
 * (kategorie-specjalne, systemy-podtrzymania-zycia, urzadzenia-zmienne, wampiry-energetyczne/katalog-urzadzen and
 * /rekomendacje-sprzetowe). The engine keeps its Polish labels (warnings use them); screens resolve the text from
 * the item `id` via `components/zapotrzebowanie/etykiety-stalych.ts`.
 */
// English: ./stale-zapotrzebowanie.en.ts, Russian: ./stale-zapotrzebowanie.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-STAZAP-KAT-WARSZTAT": "Warsztat",
  "UI-STAZAP-KAT-GOSPODARSTWO": "Gospodarstwo",
  "UI-STAZAP-KAT-OSWIETLENIE-TERENOWE": "Oświetlenie terenowe",
  "UI-STAZAP-PRZ-SZLIFIERKA": "Szlifierka",
  "UI-STAZAP-PRZ-WIERTARKA": "Wiertarka",
  "UI-STAZAP-PRZ-SPAWARKA": "Spawarka",
  "UI-STAZAP-SYS-POMPA-GLEBINOWA": "Pompa głębinowa / hydrofor",
  "UI-STAZAP-SYS-PRZEPOMPOWNIA-SCIEKOW": "Przepompownia ścieków",
  "UI-STAZAP-SYS-WENTYLACJA-REKUPERATOR": "Wentylacja (rekuperator)",
  "UI-STAZAP-SYS-ROUTER": "Router",
  "UI-STAZAP-SYS-MONITORING-KAMERY": "Monitoring (kamery)",
  "UI-STAZAP-SYS-OGRZEWANIE": "Ogrzewanie",
  "UI-STAZAP-ZMI-PRALKA": "Pralka (grzanie wody)",
  "UI-STAZAP-ZMI-ZMYWARKA": "Zmywarka",
  "UI-STAZAP-ZMI-LODOWKA-230V": "Lodówka 230V AC",
  "UI-STAZAP-ZMI-CZAJNIK": "Czajnik elektryczny",
  "UI-STAZAP-ZMI-MIKROFALOWKA": "Mikrofalówka",
  "UI-STAZAP-ZMI-LAPTOP": "Laptop",
  "UI-STAZAP-ZMI-TV": "Telewizor 32\"",
  "UI-STAZAP-ZMI-LED-230V": "Oświetlenie LED 230V (żarówka)",
  "UI-STAZAP-STB-TELEWIZOR": "Telewizor",
  "UI-STAZAP-STB-ROUTER": "Router",
  "UI-STAZAP-STB-KONSOLA": "Konsola do gier",
  "UI-STAZAP-STB-LADOWARKA": "Ładowarka bez odbiornika",
  "UI-STAZAP-STB-LISTWA": "Listwa zasilająca",
  "UI-STAZAP-STB-MIKROFALOWKA": "Mikrofalówka (z wyświetlaczem)",
  "UI-STAZAP-STB-DEKODER": "Dekoder TV",
  "UI-STAZAP-MET-WYLACZNIK-RECZNY": "Wyłącznik ręczny",
  "UI-STAZAP-MET-LISTWA-Z-WYLACZNIKIEM": "Listwa z wyłącznikiem",
  "UI-STAZAP-MET-GNIAZDO-WIFI": "Gniazdo Wi-Fi",
  "UI-STAZAP-MET-PRZEKAZNIK-ZIGBEE": "Przekaźnik Zigbee",
  "UI-STAZAP-KUR-TV-KONSOLA": "TV / konsola do gier",
  "UI-STAZAP-KUR-ROUTER": "Router",
  "UI-STAZAP-KUR-LADOWARKI": "Ładowarki",
  "UI-STAZAP-KUR-AGD-INNE": "Sprzęt AGD / inne",
} as const
