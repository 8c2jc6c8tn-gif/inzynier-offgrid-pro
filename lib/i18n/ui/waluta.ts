/** Currency settings (`components/waluta-wybor.tsx`, section in `app/ustawienia/page.tsx`). */
// English: ./waluta.en.ts, Russian: ./waluta.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-WAL-TYTUL": "Waluta rozliczeniowa",
  "UI-WAL-OPIS": "W tej walucie aplikacja pokazuje wszystkie wyniki i sumy. Każda wpisana kwota pamięta swoją walutę (domyślnie tę z Ustawień; przy polu możesz wybrać inną, np. cenę panelu w euro). Kwota w innej walucie jest przeliczana po kursie średnim NBP, a przeliczenie widać przy polu. Zmiana waluty tutaj nie zmienia wpisanych kwot. Stawki i opłaty z polskich taryf są w PLN.",
  "UI-WAL-WYBOR": "Waluta",
  "UI-WAL-NARZUT": "Narzut na kursie (%)",
  "UI-WAL-NARZUT-OPIS": "Poszerza kurs jak spread karty lub kantoru (kurs × (1 + narzut)). Domyślnie 0 — czysty kurs referencyjny.",
  "UI-WAL-KURS-RECZNY": "Własny kurs: ile {waluta} za 1 PLN (puste = kurs automatyczny)",
  "UI-WAL-ZRODLO": "Kursy automatyczne: kursy średnie Narodowego Banku Polskiego, tabela A (api.nbp.pl). Kursy pobiera i trwale zapisuje serwer aplikacji (z historią); gdy jesteś online, aplikacja pobiera aktualne dane i zapisuje je na urządzeniu — offline działa na ostatnio zapisanych (data ostatniej aktualizacji poniżej). Chcesz inny kurs (np. banku)? Wpisz go ręcznie powyżej (ewentualnie dodaj narzut).",
  "UI-WAL-STAN-KURSOW": "Kursy z dnia {data} (pobrano {pobrano}).",
  "UI-WAL-BRAK-KURSU": "Brak kursu dla {waluta} — kwoty pokazujemy w PLN. Połącz się z internetem albo wpisz kurs ręcznie.",
  "UI-WAL-ODSWIEZ": "Odśwież kursy",
  "UI-WAL-ODSWIEZONO": "Kursy odświeżone.",
  "UI-WAL-ODSWIEZ-BLAD": "Nie udało się pobrać kursów (offline?) — używam ostatnich zapisanych.",
  "UI-WAL-RECZNY-TYLKO": "Dla {waluta} nie ma kursu automatycznego — wpisz kurs ręcznie.",
  "UI-WAL-POLE-WYBOR": "Waluta kwoty",
  "UI-WAL-POLE-PRZELICZENIE": "≈ {kwota} (kurs NBP z {data})",
  "UI-WAL-POLE-PRZELICZENIE-RECZNY": "≈ {kwota} (Twój kurs z Ustawień)",
  "UI-WAL-POLE-BRAK-KURSU": "Brak kursu {z} → {na}: połącz się z internetem albo wpisz kurs w Ustawieniach. Do tego czasu ta kwota nie jest liczona.",
  "UI-WAL-ROZBICIE": "Wpisane kwoty: {lista}",
} as const
