/**
 * m13b-tryb-ograniczony — screen text of "Tryb wyjazdu i tryb nocny" (M13 7.27 + 7.49 without telemetry).
 */
// English: ./m13b-tryb-ograniczony.en.ts, Russian: ./m13b-tryb-ograniczony.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-TOGR-TYTUL": "Tryb wyjazdu i tryb nocny",
  "UI-TOGR-OPIS": "Wybierz, które odbiorniki z Twojej listy mają zostać włączone, a policzę, ile energii zużyjesz w czasie wyjazdu albo w nocy i na ile wystarczy baterii. To Ty decydujesz, co zostaje (lodówka, alarm, pompa) — aplikacja nie ocenia bezpieczeństwa.",
  "UI-TOGR-TRYB": "Tryb",
  "UI-TOGR-TRYB-WYJAZD": "Wyjazd (nieobecność w dobach)",
  "UI-TOGR-TRYB-NOC": "Noc (okno nocne w godzinach)",
  "UI-TOGR-DNI": "Liczba dób nieobecności",
  "UI-TOGR-GODZINY": "Długość okna nocnego",
  "UI-TOGR-POJEMNOSC": "Energia użyteczna baterii (opcjonalnie)",
  "UI-TOGR-ODBIORNIKI": "Odbiorniki — zaznacz te, które zostają włączone",
  "UI-TOGR-ZOSTAJE": "zostaje włączony",
  "UI-TOGR-DOBA-WH": "{wh} Wh/dobę",
  "UI-TOGR-PUSTA-LISTA": "Brak odbiorników z zużyciem. Wpisz je na ekranie „Zużycie energii per urządzenie” — ten ekran czyta tę samą listę.",
  "UI-TOGR-PUSTA-LISTA-LINK": "Otwórz listę odbiorników",
  "UI-TOGR-WERDYKT": "Zużycie w trybie ograniczonym",
  "UI-TOGR-DOBA": "Na dobę: {ogr} kWh zamiast {norm} kWh — oszczędzasz {opt} kWh ({pct}%).",
  "UI-TOGR-OKRES": "Przez {dni} dób: {ogr} kWh zamiast {norm} kWh.",
  "UI-TOGR-NOC": "W oknie {h} h: {ogr} kWh zamiast {norm} kWh (zakładam równomierne zużycie w ciągu doby).",
  "UI-TOGR-BATERIA-WYJAZD": "Bateria wystarczy na {ogr} dób w trybie wyjazdu (normalnie: {norm}) — bez ładowania z paneli.",
  "UI-TOGR-BATERIA-NOC": "Bateria wystarczy na {ogr} nocy w trybie nocnym (normalnie: {norm}) — bez ładowania z paneli.",
  "UI-TOGR-ZOSTAJA": "Zostają: {lista}.",
  "UI-TOGR-WYLACZONE": "Wyłączone: {lista}.",
  "UI-TOGR-BRAK": "brak",
  "UI-TOGR-UZUPELNIJ-WYJAZD": "Wpisz liczbę dób nieobecności, żeby policzyć zużycie w całym okresie.",
  "UI-TOGR-UZUPELNIJ-NOC": "Wpisz długość okna nocnego (godziny), żeby policzyć zużycie w nocy.",
  "UI-TOGR-SPRAWDZ": "Sprawdź dane",
  "UI-TOGR-DOBA-JEDN": "dobę",
} as const
