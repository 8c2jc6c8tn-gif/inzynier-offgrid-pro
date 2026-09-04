# Złote Zasady — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny
**Powiązane dokumenty:** `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `kontrakty-rdzenia.md`, `ZASADY_APLIKACJI.md` (historyczny, §1)

TL;DR: Kompas projektu — 4 filozofie nadrzędne (Krok 1 GOD BOOK) + 14 zasad architektonicznych, migrowane 1:1 z `ZASADY_APLIKACJI.md`/`USTALENIA.md` (treść nietknięta, tylko przeniesiona do kanonicznego pliku).

---

## Cztery filozofie (Krok 1 GOD BOOK)

1. **Aplikacja liczy twarde fakty fizyczne, nie „internetowe opinie".** Każdy wynik musi dać się wyprowadzić ze wzoru.
2. **Aplikacja ostrzega przed pułapkami**, o których nowicjusz zapomina.
3. **Aplikacja działa w pełni offline** po pierwszym pobraniu danych klimatycznych/PV.
4. **Aplikacja tłumaczy „po ludzku" (Migawki) i pokazuje twardą fizykę (wzory)** jednocześnie — nigdy tylko jedno z dwojga.

## Jeden test, po którym poznasz dobry ekran

Ekran jest dobrze zrobiony, jeśli: ma wzór dający się niezależnie zweryfikować, ma przynajmniej jeden przeliczony przykład (najlepiej z samego źródła), i pokazuje użytkownikowi zarówno liczbę, jak i dlaczego ta liczba wyszła taka, a nie inna.

## Czego nigdy nie robimy bez wyraźnej zgody

- Nie zgadujemy brakujących współczynników/norm/progów, których źródło nie podaje wprost (Zasada 4, Dyrektywa AI #1 w `02_Dyrektywy_AI_Projektu.md`).
- Nie usuwamy ani nie nadpisujemy cicho istniejącej treści/decyzji (Część D GOD BOOK).
- Nie rozstrzygamy samodzielnie sprzeczności między źródłami/decyzjami — zgłaszamy.
- Nie mieszamy jądra obliczeniowego z warstwą UI/platformy (Zasada 2).

## Zasada priorytetów przy konflikcie dobrych rzeczy

Hierarchia pierwszeństwa (0.4 GOD BOOK, w pełni w `01_Zasady_Pracy_i_Konwencje.md` §2): Dyrektywy AI projektu > te Złote Zasady > konkretna decyzja w rejestrze (w jej wąskim zakresie) > ekspertyza domenowa > konwencje formatu.

## Świadomie poza zakresem (v1)

Patrz `backlog-poza-v1.md` — pełna, rosnąca lista. Skrót: implementacja `IndexedDBStorageAdapter`, i18n wielojęzyczne, płatności/Stripe, dowolne obliczenia wymagające norm/tabel nieobecnych w źródle (np. PN-IEC 60364-5-52, krzywe SoH baterii, prognozy pogodowe).

---

## 14 zasad architektonicznych (migracja z `ZASADY_APLIKACJI.md` §2–§13, treść bez zmian)

### Zasada 1 — Logika nie wie nic o platformie
Cała logika inżynierska (jądro obliczeniowe, profile krajowe, walidacja, wzory, reguły biznesowe) jest napisana w czystym TypeScript, jako funkcje bez efektów ubocznych. Bez importów z React/Next.js/DOM/`window`/`fetch`/bazy/systemu plików. `lib/core/` — logika czysta, zakaz importów UI/IO. `lib/adapters/` — wszystko dotykające platformy za interfejsami. `app/` — warstwa widoku. Reguła egzekwowana lintem. Pełny kontrakt: `kontrakty-rdzenia.md` §1.

### Zasada 2 — Jądro obliczeniowe (Calculation Core)
Każda funkcja obliczeniowa jest czysta i deterministyczna, zwraca `CalcResult<T>` (`value`, `unit`, `formula`, `inputs`, `assumptions`, `warnings`, `calculatorVersion`, opcjonalnie `traceId`). Zakaz „magicznych liczb" — stałe z nazwanych stałych lub profilu krajowego. Pełny kontrakt: `kontrakty-rdzenia.md` §2.

### Zasada 3 — Podwójna weryfikacja obliczeń
Każdy krytyczny wzór (przekrój kabla, Voc max przy mrozie, bezpiecznik AIC, pojemność baterii, moc falownika) ma dwie niezależne ścieżki dające ten sam wynik w granicy tolerancji: analityczną i kontrolną (test jednostkowy z wartością referencyjną). W praktyce tego projektu: niezależne przeliczenie w Pythonie przed implementacją + test Vitest z tą samą wartością referencyjną.

### Zasada 4 — Profile krajowe jako dane, nie kod
Wszystko zależne od kraju/regionu żyje w plikach JSON walidowanych Zod, nigdy w `if (kraj === 'PL')`. Start: profil PL.

### Zasada 5 — Offline-first (web) i strategia mobile
Dane trwałe w IndexedDB, service worker do assetów, zapytania online buforowane na stałe. Stan projektu przez `StorageAdapter` (IndexedDB dziś, SQLite mobile jutro). Zakaz `localStorage` jako bazy stanu projektu.

### Zasada 6 — Model danych = tabele z Biblii
Nazwy encji przyjmujemy wprost z materiału źródłowego (Biblia Off-Grid PV). Jedna funkcja źródła → jeden nazwany moduł o tym samym ID.

### Zasada 7 — UI: Migawki, Tryb Inżyniera, Powiązania Bloków
Migawki `[i]` z zakładkami „Po ludzku"/„Fizyka" (treść z `formula`+`assumptions`, nie przepisywana ręcznie). Tryb Inżyniera jako globalny przełącznik. Powiązania Bloków (`powiazania: string[]`) do propagacji danych między funkcjami. Mobile-first UI. Pulpit adaptacyjny (13+1 kafli) — szczegóły `docs/pulpit-i-nawigacja.md`.

### Zasada 8 — Audit trail i logowanie błędów
Każde nietrywialne przeliczenie zapisuje `traceId`, funkcję, wejścia, wynik, wersję jądra, czas. Błędy do jednego `Reporter` (adapter). Zero cichych `catch {}`.

### Zasada 9 — Bezpieczeństwo (mapowanie natywne → web)
Żaden sekret/klucz API/logika płatności nie trafia do klienta. Walidacja i sanityzacja każdego wejścia. Nagłówki bezpieczeństwa. Mapowanie Keystore/Keychain/obfuskacja/SSL pinning → WebCrypto/minifikacja/HTTPS.

### Zasada 10 — Freemium i płatności
Podział free/pro danymi (`feature → tier`), egzekwowany po stronie serwera. Płatności przez Stripe. FREE: 1 projekt, tryb prosty, kalkulatory awaryjne (Moduł 12). PRO: reszta.

### Zasada 11 — Integralność wersji
Każda wersja dokumentu/danych ma metryczkę. Żadnej funkcji nie wolno usunąć/pominąć bez jawnego wpisu w dzienniku zmian. Rejestr pokrycia (`docs/rejestr-pokrycia.md`) po ID źródła.

### Zasada 12 — Testy
Jądro: testy jednostkowe obowiązkowe, z wartościami referencyjnymi. Profile krajowe: walidacja schematem w CI. UI: weryfikacja w przeglądarce po każdej większej zmianie. „Kompiluje się" ≠ „działa".

### Zasada 13 — Model danych domeny stabilny
Nazwy encji i identyfikatory 1:1 ze źródłem domenowym — nie tłumaczyć/skracać swobodnie przy implementacji (patrz `docs/memory.md`, "Konwencje specyficzne dla projektu").

### Zasada 14 — Kolejność budowy — fundament → dziedzina → nadbudowa
Kolejne etapy zatwierdzane osobno. Pełna, aktualna kolejność i status: `mapa-wdrozenia.md` (przeniesione z `ZASADY_APLIKACJI.md` §14, historia wersji 0.1.0–0.1.6 zachowana tamże jako `rejestr-decyzji.md` D3–D9).

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — migracja treści z `ZASADY_APLIKACJI.md` §1–§13 (bez zmiany znaczenia), wersja 1.0. |
