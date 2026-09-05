# Backlog poza v1 — Inżynier Offgrid Pro

**Wersja:** 1.1 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 05.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `docs/lista-do-zrobienia.md`, `mapa-wdrozenia.md`

TL;DR: Rzeczy świadomie odłożone poza zakres pierwszej wersji — decyzje o skali/fazowaniu (N.2 GOD BOOK), zbierane tutaj przy audycie. **Nie to samo, co `docs/lista-do-zrobienia.md`** (bieżący stan pracy, inny rytm — patrz B.6 GOD BOOK). Dwie kategorie: (1) **⚠️ blocked** — ekran/funkcja sprawdzona i odrzucona jako niebuildowalna bez wymyślania danych, jawne uzasadnienie; (2) **⏳ poza zakresem v1** — świadomie odłożone całe obszary produktu (infrastruktura, płatności, i18n), nie kwestia brakujących danych.

---

## ⏳ Poza zakresem v1 — całe obszary

- **`IndexedDBStorageAdapter`** — implementacja trwałego zapisu (interfejs `StorageAdapter` istnieje, `kontrakty-rdzenia.md` §3). Powód: kod dziś trzyma stan tylko w React state, wystarcza do zweryfikowania logiki domenowej każdego ekranu; trwały zapis to osobny, duży krok.
- **i18n wielojęzyczne** — profil `PL` jako jedyny start (Zasada 4, `zlote-zasady.md`). Nowy kraj = nowy plik JSON, bez zmian w jądrze, gdy będzie potrzebny.
- **Freemium/Stripe** — podział FREE/PRO zdecydowany (D2, `rejestr-decyzji.md`), egzekwowanie i integracja płatności nie zaimplementowane.
- **Tryb Live z realną telemetrią** (M13) — dziś czysta brama informacyjna bez połączenia; sensowny dopiero, gdy M8/M9 mają dane na żywo do pokazania.
- **Dane demonstracyjne → dane na żywo** (M8 Audyt pożarowy, M10 Prognozy) — oba ekrany jawnie oznaczają w kodzie i UI, że dziś czerpią z przykładowych danych (`SAMPLE_AUDIT_ITEMS` itp.), docelowo z modułów źródłowych.
- **Migracja przekazania na mobile** (React Native) — architektura `core`/`adapters`/`app` przygotowana pod to od początku (Zasada 1), sama migracja nie rozpoczęta.

## ⚠️ Blocked — ekrany sprawdzone i odrzucone (brak danych, nie przeoczenie)

### Moduł 2 — Zapotrzebowanie
- **Ekran 3 (Urządzenia zmienne + płyta indukcyjna + klasa energetyczna)** — wymaga bazy komponentów (współczynniki rozruchu per typ urządzenia).
- **Ekran 8, podpunkty 2–3 (prądy rozruchowe, współczynnik jednoczesności)** — jak wyżej + brak wzoru statystycznego (podpunkt 1, moc pozorna, zbudowany).
- **Ekran 10 (Sprawność inwertera przy niskim obciążeniu)** — źródło daje tylko dwa luźne zakresy bez wzoru wiążącego je z % obciążenia.
- **Ekran 14 (Architektura 1-/3-fazowa)** — brak progu liczbowego "znacznej asymetrii" faz.
- **Ekran 15 (Kategorie specjalne)** — Wzorzec A z gotowym presetem, wymaga bazy komponentów (moce narzędzi warsztatowych itd.).
- **Wampiry energetyczne (24 funkcje, zbiorczy ekran)** — treść w źródle poza tym repo w praktycznej formie do budowy, `todo`.

### Moduł 3 — Instalacja PV
Pełne wyliczenie per-funkcja nierozpoczęte (rozpoczęto pojedyncze buildowalne ekrany 04.09.2026, `mapa-wdrozenia.md`) — większość pozostałych ~21 ekranów jeszcze **nie oceniona** (nie mylić z "blocked" — to `todo`, patrz `docs/rejestr-pokrycia.md`).

### Moduł 4 — Baterie
- **Ekran 3 (Symulacja czasu ładowania/rozładowania)** — cross-modułowe, wymaga profilu produkcji PV (M3) i obciążenia (M2) na żywo.
- **Ekran 25 (Szyny zbiorcze i połączenia międzypakietowe)** — brak wzoru wiążącego długość/przekrój z rozkładem prądu, tylko ilustracyjne przykłady.
- **Ekran 31 (Napięcie odcięcia vs żywotność)** — wymaga krzywej napięcie↔SoC i krzywej DoD↔cykle życia specyficznej dla chemii ogniwa, źródło nie podaje.
- **Ekran 32 (Hierarchia ładowania PV>Agregat>Sieć)** — wymaga prognozy pogody (zewnętrzne API) i nieopisanego liczbowo "progu krytycznego" SoC.
- **Ekran 33 (Symulacja miesiąca zachmurzenia)** — wymaga historycznych danych pogodowych z M1, niedostępnych.

### Moduł 5 — Okablowanie
- **Ekran 1 (mega-Doradca doboru kabla)** — brak tabeli obciążalności prądowej normy PN-IEC 60364-5-52. Blokuje większość reszty modułu (wiele ekranów M5 zależy od tego samego kontraktu doboru przekroju).

### Moduł 6 — Ogrzewanie (luki jawnie oznaczone w samym źródle, skonsolidowane tutaj przy audycie 05.09.2026)

[05.09.2026] ✅ DODANO — źródło: audyt GOD BOOK Część N.1 ("zbierz rozproszone pozycje ⏳ do jednego pliku"). `docs/zrodla/Tresc_WSZYSTKIE_MODULY_scalone.md` ma własną sekcję "Znane luki do domknięcia" (linie 138–143) z 3 pozycjami dot. Modułu 6, uczciwie oznaczonymi przez autorów źródła — ale nigdy nie przeniesionymi do tego pliku ani do `docs/rejestr-pokrycia.md`/`mapa-wdrozenia.md` jako świadomy zakres poza v1. Nie są to nowo odkryte luki (źródło samo je nazywa), tylko rozproszony zapis, który audyt konsoliduje, zgodnie z zasadą tego pliku.

- **Moduł 6, Część 2C (silnik czynników wpływu na COP/wydajność pompy ciepła)** — źródło: "22 z 26 genuinie odrębnych funkcji ma zidentyfikowany temat i źródło, ale nie ma jeszcze pełnej treści wg szablonu Doradcy. 4 najbardziej safety-krytyczne rozpisane w pełni" (i to te 4 zasiliły dziś zbudowane ekrany: COP pompy ciepła, ryzyko niskiego napięcia i pokrewne — patrz `docs/rejestr-pokrycia.md`, Moduł 6). Pozostałe 22 czekają na pełną treść źródłową, nie tylko na implementację.
- **Moduł 6, Część 2A (alternatywne źródła ciepła: kominek, IR, maty kapilarne, PCM)** — źródło: "5 alternatywnych źródeł ciepła skategoryzowane, treść do napisania". Kocioł elektryczny (jedno z 5) już zbudowany (ekran dodatkowy, dawne 5.33) — pozostałe 4 (kominek, IR, maty kapilarne, PCM) czekają na treść źródłową.
- **Moduł 6, Część 2D (29 czynników wpływu na zapotrzebowanie cieplne)** — źródło: "24 z 29 czynników wpływu ma zachowaną pełną treść w Biblii v2.0, wymaga mechanicznego wypełnienia szablonu". Dotyczy generycznego silnika "wpływ czynnika X" (`docs/standards/01-architektura.md`, 1.4) — kandydat na jeden silnik + tabelę parametrów, nie 24 osobne ekrany, gdy będzie budowany.

### Poza modułami — nie mieści się w żadnym z 13 (jawnie oznaczone w źródle)

- **Asystent głosowy (dawne 12.41)** — źródło: "nie mieści się we wzorcach A–H (inny kanał interakcji), wymaga osobnej specyfikacji drzewa intencji". Odłożone nie z powodu brakujących danych, tylko dlatego że wymaga innego rodzaju specyfikacji (drzewo intencji głosowych) niż reszta aplikacji — inna kategoria niż `⚠️ blocked` niżej.

### Moduł 11 — Montaż baterii
- **Ścieżka B, pozycja B5** — blocked (szczegóły: `docs/rejestr-pokrycia.md`, sekcja Moduł 11).
- **A2, A5** — świadomie odłożone (nie "blocked" w sensie brakujących danych — inna kategoria, patrz `docs/rejestr-pokrycia.md`).

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — ekstrakcja z `docs/rejestr-pokrycia.md` i `docs/lista-do-zrobienia.md`. Wersja 1.0. |
| 05.09.2026 | **Wynik audytu GOD BOOK Część N** (nie rutynowa integracja): skonsolidowano 4 pozycje z własnej sekcji "Znane luki do domknięcia" źródła (`Tresc_WSZYSTKIE_MODULY_scalone.md`), nigdzie dotąd nieodnotowane w tym pliku ani w `docs/rejestr-pokrycia.md`/`mapa-wdrozenia.md` — Moduł 6 Część 2A/2C/2D (alternatywne źródła ciepła, silnik czynników COP, silnik czynników zapotrzebowania) i Asystent głosowy (12.41, poza wzorcami A-H). Wersja 1.0→1.1. |
