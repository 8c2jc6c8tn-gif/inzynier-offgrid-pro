/** Currency settings (`components/waluta-wybor.tsx`, section in `app/ustawienia/page.tsx`). */
// English: ./waluta.en.ts, Russian: ./waluta.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-WAL-TYTUL": "Waluta wyświetlania",
  "UI-WAL-OPIS": "Kwoty wyników (koszty, rachunki, zwroty) pokazujemy w wybranej walucie, przeliczone z PLN. Stawki i opłaty w danych to polskie stawki w PLN — zmienia się tylko sposób pokazania wyniku. Kwoty wpisane w polach przeliczamy przy zmianie waluty po kursie z dnia pobrania.",
  "UI-WAL-WYBOR": "Waluta",
  "UI-WAL-NARZUT": "Narzut na kursie (%)",
  "UI-WAL-NARZUT-OPIS": "Poszerza kurs jak spread karty lub kantoru (kurs × (1 + narzut)). Domyślnie 0 — czysty kurs referencyjny.",
  "UI-WAL-KURS-RECZNY": "Własny kurs: ile {waluta} za 1 PLN (puste = kurs automatyczny)",
  "UI-WAL-ZRODLO": "Kursy automatyczne: referencyjne kursy Europejskiego Banku Centralnego (api.frankfurter.dev). Kursy pobiera i trwale zapisuje serwer aplikacji (z historią); gdy jesteś online, aplikacja pobiera aktualne dane i zapisuje je na urządzeniu — offline działa na ostatnio zapisanych (data ostatniej aktualizacji poniżej). Chcesz inny kurs (np. banku)? Wpisz go ręcznie powyżej (ewentualnie dodaj narzut).",
  "UI-WAL-STAN-KURSOW": "Kursy z dnia {data} (pobrano {pobrano}).",
  "UI-WAL-BRAK-KURSU": "Brak kursu dla {waluta} — kwoty pokazujemy w PLN. Połącz się z internetem albo wpisz kurs ręcznie.",
  "UI-WAL-ODSWIEZ": "Odśwież kursy",
  "UI-WAL-ODSWIEZONO": "Kursy odświeżone.",
  "UI-WAL-ODSWIEZ-BLAD": "Nie udało się pobrać kursów (offline?) — używam ostatnich zapisanych.",
  "UI-WAL-RECZNY-TYLKO": "Dla {waluta} nie ma kursu automatycznego — wpisz kurs ręcznie.",
  "UI-WAL-PRZELICZONO-ECB": "Kwoty w polach przeliczono z {z} na {na} zgodnie z kursem Europejskiego Banku Centralnego (Frankfurter) na dzień {data}{narzut}.",
  "UI-WAL-PRZELICZONO-RECZNY": "Kwoty w polach przeliczono z {z} na {na} zgodnie z Twoim własnym kursem{narzut}.",
  "UI-WAL-NARZUT-DOPISEK": ", z narzutem {narzut}%",
} as const
