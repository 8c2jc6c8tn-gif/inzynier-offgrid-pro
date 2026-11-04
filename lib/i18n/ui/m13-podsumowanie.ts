/**
 * m13-podsumowanie — screen text of "Podsumowanie i eksport pomiarów" (Module 13, items 7.50, 7.30): per-series
 * statistics, energy from power and CSV export. Quantity names reuse UI-M13-TEL-W-*.
 */
// English: ./m13-podsumowanie.en.ts, Russian: ./m13-podsumowanie.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-M13-POD-TYTUL": "Podsumowanie i eksport pomiarów",
  "UI-M13-POD-OPIS": "Min, max, średnia i energia z mocy dla każdej serii w wybranym zakresie oraz eksport próbek do pliku CSV. Moduł 13.",
  "UI-M13-POD-BRAK-ZRODEL": "Brak źródeł danych",
  "UI-M13-POD-BRAK-ZRODEL-OPIS": "Najpierw dodaj źródło na ekranie „Źródła danych telemetrii” i zbierz lub zaimportuj pomiary.",
  "UI-M13-POD-ZAKRES-TYTUL": "Źródło i zakres",
  "UI-M13-POD-ZRODLO": "Źródło danych",
  "UI-M13-POD-OKNO": "Zakres",
  "UI-M13-POD-OKNO-24": "Ostatnie 24 godziny",
  "UI-M13-POD-OKNO-168": "Ostatnie 7 dni",
  "UI-M13-POD-OKNO-720": "Ostatnie 30 dni",
  "UI-M13-POD-MAX-PRZERWA": "Największa przerwa wliczana do energii",
  "UI-M13-POD-BRAK-PROBEK": "Brak próbek w tym zakresie",
  "UI-M13-POD-BRAK-PROBEK-OPIS": "Źródło nie ma zapisanych pomiarów z wybranego zakresu.",
  "UI-M13-POD-SERIE": "Serie pomiarowe",
  "UI-M13-POD-STATY": "Min {min}, max {max}, średnia {srednia} {jednostka}",
  "UI-M13-POD-PROBKI": "Poprawnych próbek: {n}, pominiętych (braki, poza zakresem): {pominiete}",
  "UI-M13-POD-ENERGIA": "Energia z mocy: {kwh} kWh",
  "UI-M13-POD-ENERGIA-LUKI": "Pominięte przerwy dłuższe niż limit: {n}",
  "UI-M13-POD-ENERGIA-BEZ-LIMITU": "Wpisz największą przerwę, żeby policzyć energię — bez niej aplikacja nie zgaduje, czy brak próbek to postój, czy awaria.",
  "UI-M13-POD-BRAK-WARTOSCI": "brak poprawnych próbek",
  "UI-M13-POD-EKSPORT-TYTUL": "Eksport CSV",
  "UI-M13-POD-EKSPORT-OPIS": "Plik zawiera wszystkie próbki z zakresu (czas ISO, kanał, wielkość, wartość w jednostce podstawowej, jakość). Braki są puste, nigdy zerem.",
  "UI-M13-POD-EKSPORT-PRZYCISK": "Pobierz CSV",
}
