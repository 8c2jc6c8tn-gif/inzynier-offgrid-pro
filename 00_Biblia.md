# 00. Biblia — Inżynier Offgrid Pro

**Wersja:** 1.8 | **Filar:** — (indeks, poza podziałem na filary) | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 28.09.2026 | **Status:** Stabilny
**Powiązane dokumenty:** wszystkie poniżej (tabela dokumentów)

TL;DR: Indeks kanonicznej Biblii projektu w formacie GOD BOOK (`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_39.md`, Część S). Migracja z `ZASADY_APLIKACJI.md`/`USTALENIA.md`, które pełniły tę rolę wcześniej pod inną nazwą — treść tamtych plików **zachowana, nie usunięta** (oznaczone jako historyczne, patrz "Relacja ze starą konstytucją" niżej).

---

## Streszczenie projektu

**Inżynier Offgrid Pro** — kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo). Web/PWA offline-first (Next.js 16 / React 19 / TypeScript), architektura przygotowana na przeniesienie na mobile. Część rodziny aplikacji "Inżynier Pro". Liczy twarde fakty fizyczne (nie opinie), tłumaczy je "po ludzku" i pokazuje wzór za każdym wynikiem, działa w pełni offline po pierwszym pobraniu danych.

## Ekspertyza domenowa (Część 0.2 GOD BOOK)

**Elektryk / inżynier instalacji off-grid PV (panele, magazyny energii, ogrzewanie, bezpieczeństwo elektryczne), poziom: senior / 20 lat doświadczenia w terenie.**

Konsekwencja praktyczna: każdy wzór weryfikowany niezależnie przed implementacją; uniwersalna, fundamentalna fizyka (prawo Ohma, ciepło właściwe wody, rezystywność miedzi, równanie Magnusa-Tetensa, deklinacja Słońca, standardowa praktyka DC dla pętli 2×L) odróżniana od współczynników projektowych/normatywnych, których źródło nie podaje wprost — te drugie nigdy nie są zgadywane; sprzeczności fizyczne we własnych przykładach źródła wyłapywane i jawnie dokumentowane, nie ciche poprawiane ani ślepo kopiowane. Pełne uzasadnienie i historia: `01_Zasady_Pracy_i_Konwencje.md` §1, `rejestr-decyzji.md` D18.

## Tryb sesji domyślny

**Pisanie** (Część 0.3 GOD BOOK) — sesje tego projektu w 2026-09 to głównie budowa kolejnych ekranów/modułów. Tryb Audyt używany świadomie przy sprawdzaniu spójności/synchronizacji ze standardem (patrz `docs/memory.md`, sekcja "Synchronizacja ze standardem").

## Jak zacząć pracę (Część P.2 GOD BOOK)

0. **Fundament wspólny rodziny aplikacji** (poprzedza tę Biblię, Część Y GOD BOOK): `docs/standards/00-INDEKS.md` + `CLAUDE.md`.
1. Ten plik (`00_Biblia.md`) w całości.
2. `docs/lista-do-zrobienia.md` — najszybszy sposób ustalenia, od czego zacząć (Część B.6).
3. `01_Zasady_Pracy_i_Konwencje.md` i `02_Dyrektywy_AI_Projektu.md`.
4. `rejestr-decyzji.md` — sprawdź, co już zdecydowano, zanim zaczniesz.
5. `docs/memory.md` — żywy log decyzji/pułapek specyficznych dla tego repo, szczegółowszy od rejestru decyzji (patrz rozróżnienie w `rejestr-decyzji.md`).
6. Dopiero potem: konkretny moduł/ekran, nad którym pracujesz w tej sesji (`docs/rejestr-pokrycia.md` → `docs/zrodla/Tresc_Modul_N_*.md` → kod).

## Relacja ze starą konstytucją (`ZASADY_APLIKACJI.md` / `USTALENIA.md`)

Do 04.09.2026 rolę Biblii pełniły `ZASADY_APLIKACJI.md` (pełna) i `USTALENIA.md` (skrót) — merytorycznie tę samą treść co ta Biblia, tylko poza kanonicznym nazewnictwem GOD BOOK. Ta decyzja o migracji (nie kasacji) opisana w `rejestr-decyzji.md`, D19. **Oba pliki zostają w repo, oznaczone na nagłówku jako historyczne/zastąpione** (Część D GOD BOOK — nic nie usuwamy) — ich treść (14 Zasad, D-1, D-2, dziennik zmian 0.1.0–0.1.7) została w całości przeniesiona/zmapowana do dokumentów poniżej, nic nie zginęło:

| Sekcja starego pliku | Nowe miejsce |
|---|---|
| §0.1 Ekspertyza domenowa | Ten plik, wyżej + `01_Zasady_Pracy_i_Konwencje.md` §1 |
| §1 Filozofia | `zlote-zasady.md` |
| §2–§13 Zasady 1–14 (architektura, jądro, offline, UI, bezpieczeństwo...) | `zlote-zasady.md` (zasady-kompas) + `kontrakty-rdzenia.md` (konkretne kontrakty techniczne) |
| §14 Kolejność budowy / roadmapa | `mapa-wdrozenia.md` |
| Dziennik zmian 0.1.0–0.1.7 | `rejestr-decyzji.md` D1–D19 |
| USTALENIA D‑1, D‑2 | `rejestr-decyzji.md` D1, D2 |
| Metryczka (funkcje/rozdziały) | `mapa-wdrozenia.md` (metryczka na bieżąco, nie statyczna tabela) |

## Tabela dokumentów

| # | Dokument | Filar | Wersja | Status | Opis |
|---|---|---|---|---|---|
| 00 | `00_Biblia.md` (ten plik) | — | 1.1 | Stabilny | Indeks |
| 01 | `01_Zasady_Pracy_i_Konwencje.md` | C | 1.0 | Stabilny | Wyciąg operacyjny z GOD BOOK dla tego projektu |
| 02 | `02_Dyrektywy_AI_Projektu.md` | C | 1.1 | Stabilny | Twarde reguły zachowania AI specyficzne dla domeny off-grid |
| 03 | `03_M14_Dom_i_Firma_Siec.md` | B | 1.9 | Stabilny (kod zbudowany, bramka DANE-1) | M14 „Dom – sieć” / „Firma – sieć” — rachunek za prąd, prosument, taryfy G/C, potem scenariusze przejścia A–D, ryzyka i procedura odłączenia (D35–D43). Pierwszy moduł opisany w Biblii, a nie w `docs/zrodla/Tresc_*` |
| — | `zlote-zasady.md` | C | 1.0 | Stabilny | Kompas projektu — 4 filozofie + 14 zasad architektonicznych |
| — | `rejestr-decyzji.md` | C | 1.23 | Stabilny | D1, D2, D3… decyzje strategiczne, ponumerowane, rosnące |
| — | `slownik-pojec.md` | C | 1.1 | Stabilny | Terminy branżowe (SoC, DoD, MPPT, Voc, C-rate...) |
| — | `wiedza-surowa.md` | C | 1.0 | Stabilny | Synteza materiałów źródłowych — wskaźnik do `docs/zrodla/`, nie duplikat |
| — | `kontrakty-rdzenia.md` | A | 1.2 | Stabilny | `CalcResult<T>`, Status, Warning, warstwy, wzorzec echo — konkretne kontrakty tego projektu |
| — | `docs/zrodla/` | C | — | Stabilny | Materiały źródłowe, niezmienione, tylko do odczytu (Filar C, B.5 GOD BOOK) — **już istniało** przed migracją |
| — | `docs/rejestr-pokrycia.md` | B | — | Stabilny (rosnący) | Per-moduł/ekran: status, wzór, przykład, notatki — pełni rolę "osobnego pliku per moduł" (Część S poz. 9) — **już istniało** przed migracją, nie duplikowane w nowym formacie |
| — | `mapa-wdrozenia.md` | C | 1.7 | Stabilny (rosnący) | M#, opisany/zaimplementowany/przetestowany, gotowość — zbudowana z `docs/rejestr-pokrycia.md` |
| — | `backlog-poza-v1.md` | C | 1.6 | Stabilny (rosnący) | Świadomie odłożone/blocked — ekstrakcja z `docs/rejestr-pokrycia.md` i `docs/lista-do-zrobienia.md` |
| — | `dlug-techniczny.md` | C | 2.5 | Stabilny (rosnący) | Świadome uproszczenia kodu względem specyfikacji źródła |
| — | `docs/rejestr-twardych-stopow.md` | B | — | Stabilny (rosnący) | Twarde stopy (🔴) per moduł, z plikiem i kodem ostrzeżenia; sekcja M14 wyprzedza kod świadomie — **już istniało**, dopisane do indeksu przy audycie końcowym 28.09.2026 |
| — | `docs/przekazanie-nastepnej-sesji.md` | C | 1.5 | Aktualne | Stan Biblii i kolejność kodu M14 dla następnej sesji (28.09.2026: cały rozdział M14 zbudowany) |
| — | `docs/pulpit-i-nawigacja.md` | B | — | Stabilny (rosnący) | Kafle pulpitu, domyślna kolejność, presety onboardingu — **już istniało**, dopisane do indeksu przy audycie końcowym 28.09.2026 |
| — | `docs/normy-brakujace.md` | C | — | Stabilny (rosnący) | Normy potrzebne, a nieobecne w `docs/zrodla/` — **już istniało**, dopisane do indeksu przy audycie końcowym 28.09.2026 |
| — | `docs/lista-do-zrobienia.md` | C | — | Stabilny (rosnący) | Bieżąca lista zadań — **już istniało** przed migracją |
| — | `docs/memory.md` | C | — | Stabilny (rosnący) | Żywy, szczegółowy log decyzji/pułapek — **już istniało**, zostaje główny dziennik roboczy (patrz rozróżnienie w `rejestr-decyzji.md`) |

## Kluczowe wyróżniki projektu

- Liczy **twarde fakty fizyczne** — każdy wynik ma wzór (`CalcResult.formula`), nie "opinię".
- **Nigdy nie zgaduje brakujących danych** — gdy źródło podaje tylko zakres/przykład bez wzoru, pole wymaga ręcznego wpisania (nie ukryty domyślny) albo ekran zostaje `⚠️ blocked` (patrz `backlog-poza-v1.md`).
- **Podwójna weryfikacja** — każdy krytyczny wzór zweryfikowany niezależnie (Python) przed implementacją i pokryty testem z wartością referencyjną.
- **Offline-first**, architektura `core`/`adapters`/`app` gotowa na mobile.
- Rodzina aplikacji dzieli wspólny Standard Architektoniczny (`docs/standards/`, `new-app-standards`) — ta Biblia jest warstwą specyficzną dla *tego* projektu, poprzedzoną tamtym fundamentem (Część Y GOD BOOK).

## Dziennik zmian (tego indeksu)

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono `00_Biblia.md` — migracja z `ZASADY_APLIKACJI.md`/`USTALENIA.md` do kanonicznego formatu GOD BOOK, na wniosek właściciela projektu. Wersja 1.0 (pierwsza stabilna). |
| 28.09.2026 | Dodano rozdział `03_M14_Dom_i_Firma_Siec.md` (Filar B) — integracja opracowania M14 na polecenie właściciela („Integruj teraz”); decyzje D35–D38. Wersja rejestru decyzji w tabeli zaktualizowana (1.11 → 1.14, była nieaktualna). |
| 28.09.2026 | Decyzje D39 (pozycja kafli M14) i D40 (TCO M14 plus „Ścieżka UE”); rozdział 03 v1.1; rejestr decyzji 1.14→1.15. |
| 28.09.2026 | D41 (M14 TCO: „Ścieżka UE + inflacja”); rozdział 03 v1.2; rejestr decyzji 1.15→1.16. |
| 28.09.2026 | D42 (M14: przełącznik ścieżek cen w miejscu suwaka); rozdział 03 v1.3; rejestr decyzji 1.16→1.17. |
| 28.09.2026 | D43 (M14: domyślna inflacja GUS 3,58%); rozdział 03 v1.4; rejestr decyzji 1.17→1.18. |
| 28.09.2026 | **Wynik audytu końcowego N.3** (tryb Audyt, N.1/N.2): wersje w tabeli zsynchronizowane z nagłówkami plików (02: 1.0→1.1, kontrakty-rdzenia: 1.0→1.1, słownik: 1.0→1.1, mapa: 1.3→1.5, backlog: 1.4→1.5, dług: 1.0→2.3 — były nieaktualne); dopisane do tabeli trzy istniejące rejestry (twarde stopy, pulpit, brakujące normy). Wersja indeksu 1.0→1.1 (C.5: bump przy każdej zmianie tabeli — wcześniej pomijany). |
| 28.09.2026 | Decyzje 1–3 właściciela z audytu N.3: D47 (przełącznik w M14/D11), D48 (bezpieczeństwo agregatu w M2/E17 i M7/E8), D49 (LED = kandydat poza Biblią). Rozdział 03 v1.5, rejestr decyzji 1.19, backlog 1.6. Wersja indeksu 1.1→1.2. Audyt czeka jeszcze na decyzję 4 (10 × ✅🤖 plus 2 wyjątki D48). |
| 28.09.2026 | Dodano `docs/przekazanie-nastepnej-sesji.md` — instrukcja kolejności pracy dla następnej sesji (polecenie właściciela: ta sesja nie pisze kodu M14). Wersja indeksu 1.2→1.3. |
| 28.09.2026 | Scalenie gałęzi M14 z `main`: D44–D46 tej gałęzi → D47–D49 (D44 na `main` = M12/E23), `rejestr-decyzji.md` 1.19→1.22 (łącznie z decyzjami z `main`), przekazanie 1.0→1.1 (pozycje 1–3 decyzji 4 zamknięte na `main`). Wersja indeksu 1.3→1.4. |
| 28.09.2026 | Odpowiedzi właściciela na decyzję 4 audytu N.3 zapisane w `docs/przekazanie-nastepnej-sesji.md` (1.1→1.2): D29/D32/D33 zamknięte, 4/5/7/8 odłożone, bez odpowiedzi 6 i 9–12. Wersja indeksu 1.4→1.5. |
| 28.09.2026 | D50: pozostałe pytania decyzji 4 odłożone, bramka N.3 dla M14 zdjęta. M14 1.5→1.6, rejestr 1.22→1.23, przekazanie 1.2→1.3 (sekcja „Stan na teraz”). Wersja indeksu 1.5→1.6. |
| 28.09.2026 | Start kodu M14: rozdział 03 1.6→1.7, kontrakty rdzenia 1.1→1.2 (§9 pliki danych), mapa 1.5→1.6, dług 2.3→2.4 (TD22), przekazanie 1.3→1.4. Wersja indeksu 1.6→1.7. |
| 28.09.2026 | Zamknięcie kodu M14: rozdział 03 1.7→1.8, mapa 1.6→1.7, dług 2.4→2.5 (TD23), przekazanie 1.4→1.5. Wersja indeksu 1.7→1.8. |
