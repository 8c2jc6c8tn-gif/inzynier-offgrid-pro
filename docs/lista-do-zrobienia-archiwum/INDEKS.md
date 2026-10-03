# Indeks archiwum docs/lista-do-zrobienia.md

**Wersja:** 1.0 | **Utworzono:** 03.10.2026 | **Status:** append-only
**Powiązane:** `docs/lista-do-zrobienia.md` (plik aktywny), `docs/memory-archiwum/INDEKS.md`, sekcja „Archiwizacja” w `docs/memory.md`.

TL;DR: pliki zawierają dosłowną kopię (1:1) wpisów ✅, w których najpóźniejsza data wzmianki to 26.09.2026 lub wcześniej. W liście aktywnej zostają wszystkie wpisy otwarte (🔲 ⚠️ 🔄 ⏳ ✏️ 🟢 🟡 ℹ️) niezależnie od wieku oraz ✅ z datą po 26.09. Szukanie: `grep -rn "fraza" docs/lista-do-zrobienia-archiwum/`.

Uwaga o odsyłaczach: dokumenty wskazujące „wpis w `docs/lista-do-zrobienia.md`” z datą do 26.09.2026 mogą wskazywać dziś na te pliki (odsyłaczy nie przepisywano).

| Plik | Zakres | Wpisów | Rozmiar |
|---|---|---:|---:|
| [`01-zadania-cz1.md`](01-zadania-cz1.md) | Sekcja „Zadania”; daty wpisów 03.09–07.09.2026 | 28 | 10 KB |
| [`02-zadania-cz2.md`](02-zadania-cz2.md) | Sekcja „Zadania”; daty wpisów 04.09–04.09.2026 | 29 | 9 KB |
| [`03-zadania-cz3.md`](03-zadania-cz3.md) | Sekcja „Zadania”; daty wpisów 04.09–16.09.2026 | 29 | 17 KB |
| [`04-zadania-cz4.md`](04-zadania-cz4.md) | Sekcja „Zadania”; daty wpisów 16.09–20.09.2026 | 29 | 55 KB |
| [`05-pelny-audyt-20-09.md`](05-pelny-audyt-20-09.md) | Sekcja „Pełny audyt (20.09.2026…)”; daty wpisów 20.09–26.09.2026 | 29 | 19 KB |

## Spis wpisów (początek linii dosłownie jak w oryginale, skrócony do ~110 znaków)

### 01-zadania-cz1.md

- ✅ (2026-09-03) Synchronizacja pakietu `new-app-standards`: rozdziały 00–16 odświeżone, dodano `docs/god-book/`
- ✅ (2026-09-04) **Rozstrzygnięte: migracja do kanonicznego formatu GOD BOOK wykonana.** Właściciel projektu zde
- ✅ (2026-09-04) **Część powyższej decyzji rozstrzygnięta: `docs/domena/` → `docs/zrodla/` (zmiana nazwy).** Wła
- ✅ (2026-09-04) Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (GOD BOOK Y.6) — znaleziono i zsynchronizowa
- ✅ (2026-09-03) Audyt zgodności apki ze standardem (17 rozdziałów) wykonany, 3 znalezione niezgodności naprawio
- ✅ (2026-09-07) **Rozstrzygnięte: podniesiono do `critical`.** Decyzja właściciela projektu, po audycie GOD BOO
- ✅ (2026-09-03) Ekran A1, Moduł 11 (Montaż baterii) — "Weryfikacja kompletności i kontrola wstępna ogniw" zaimp
- ✅ (2026-09-03) Ekran A3, Moduł 11 — "Połączenia elektryczne i kolejność łączenia" zaimplementowany (ten sam wz
- ✅ (2026-09-03) Ekran A4, Moduł 11 — "Podłączenie BMS" (+ procedura pre-charge, realny wzór `T = 5×R_pre×C`) za
- ✅ (2026-09-03) Ekran A6, Moduł 11 — "Demontaż pakietu" zaimplementowany (checklist z wymuszoną kolejnością + k
- ✅ (2026-09-03) Ekran A9, Moduł 11 — "Ratowanie głęboko rozładowanego ogniwa" zaimplementowany (Wzorzec D, 3 st
- ✅ (2026-09-03) Ekran A8, Moduł 11 — "Ocena zużycia ogniwa po demontażu" zaimplementowany (ocena wizualna puchn
- ✅ (2026-09-03) Ekran A10, Moduł 11 — "Przechowywanie / recykling / narzędzia diagnostyczne" (Wzorzec C) zaimpl
- ✅ (2026-09-03) Ścieżka B (kwasowo-ołowiowa), Moduł 11 — 11/12 ekranów zaimplementowane w jednym przejściu: B1 
- ✅ (2026-09-03) Ekran 4, Moduł 2 — "Liczba domowników" (Wzorzec D-lite) zaimplementowany. Liczy dobowe C.W.U. (
- ✅ (2026-09-03) **Rysunki/schematy dodane do ekranów montażu baterii, na wyraźną prośbę autora** ("w elektryce 
- ✅ (2026-09-04) Ekran 1, Moduł 4 (Baterie) — "Dobór pojemności baterii" (Wzorzec D) zaimplementowany, pierwszy 
- ✅ (2026-09-04) Ekran 7, Moduł 4 (Baterie) — "Obwód Pre-Charge" zaimplementowany, **i wzorzec "echo" zastosowan
- ✅ (2026-09-04) Ekran 12, Moduł 4 (Baterie) — "Ograniczenie prądu ładowania w mrozie (Cold C-Rate)" zaimplement
- ✅ (2026-09-04) Ekran 15, Moduł 4 (Baterie) — "Cold Cranking Amps" zaimplementowany. Wzór `V_sag = V_oc − I×R_w
- ✅ (2026-09-04) Ekran 6, Moduł 4 (Baterie) — "Starzenie i degradacja ogniw" zaimplementowany. Model liniowy 1:1
- ✅ (2026-09-04) Ekran 22, Moduł 4 (Baterie) — "Pobór własny BMS i tryb uśpienia" zaimplementowany. Wzór `E_rocz
- ✅ (2026-09-04) Ekran 28, Moduł 4 (Baterie) — "Kalibracja i dokładność SoC" zaimplementowany. Jeden próg czasow
- ✅ (2026-09-04) Ekran 16, Moduł 4 (Baterie) — "Tryb Long Term Storage (odstawienie na zimę)" zaimplementowany. 
- ✅ (2026-09-04) Ekran 18, Moduł 4 (Baterie) — "Łączenie równoległe różnych baterii (Mixing)" zaimplementowany. 
- ✅ (2026-09-04) Ekran 34, Moduł 4 (Baterie) — "Matryca alarmów BMS i reakcje systemu" zaimplementowany. Wzorzec
- ✅ (2026-09-04) Ekran 5, Moduł 4 (Baterie) — "Grzałki BMS i ochrona przed mrozem" zaimplementowany. Tylko druga
- ✅ (2026-09-04) Ekran 27, Moduł 4 (Baterie) — "Chłodzenie baterii latem" zaimplementowany. Sprawdzenie temperat

### 02-zadania-cz2.md

- ✅ (2026-09-04) Ekran 23, Moduł 4 (Baterie) — "Analiza opłacalności magazynu (True Cost of Storage)" zaimplemen
- ✅ (2026-09-04) Ekran 26, Moduł 4 (Baterie) — "Topologia BMS (Common Port vs Separate Port)" zaimplementowany. 
- ✅ (2026-09-04) Ekran 20, Moduł 4 (Baterie) — "Komunikacja BMS — CAN/RS485/Modbus" zaimplementowany. Sprawdzeni
- ✅ (2026-09-04) Ekran 10, Moduł 4 (Baterie) — "Ochrona przed wilgocią i kondensacją" zaimplementowany. Punkt ro
- ✅ (2026-09-04) Ekran 8, Moduł 4 (Baterie) — "Symulacja Słabego Ogniwa (Cell Drift & Balancing)" zaimplementowa
- ✅ (2026-09-04) Ekran 9, Moduł 4 (Baterie) — "Detekcja zwarcia i e-Fuse" zaimplementowany. **Drugie zastosowani
- ✅ (2026-09-04) Ekran 13, Moduł 4 (Baterie) — "Algorytm końca ładowania (Tail Current / Absorption)" zaimplemen
- ✅ (2026-09-04) Ekran 29, Moduł 4 (Baterie) — "Detekcja doziemienia (Ground Fault & IMD)" zaimplementowany. Spr
- ✅ (2026-09-04) Ekran 21, Moduł 4 (Baterie) — "Pozycjonowanie ogniw (kompresja/spuchnięcie)" zaimplementowany. 
- ✅ (2026-09-04) Ekran 14, Moduł 4 (Baterie) — "SoH — diagnostyka per ogniwo" zaimplementowany **częściowo**. Ty
- ✅ (2026-09-04) Ekran 17, Moduł 4 (Baterie) — "Analiza Second-Life (baterie z EV)" zaimplementowany. SoH z wiek
- ✅ (2026-09-04) **Moduł 4 zamknięty na 26/34** (reszta blocked/cross-module/wymaga integracji jeszcze nie zbudo
- ✅ (2026-09-04) **Ekran 17, Moduł 2 — "Agregat prądotwórczy — definicja i logika pracy" — domyka lukę 1.19** zn
- ✅ (2026-09-04) Ekran 9, Moduł 2 (Zapotrzebowanie) — "Pobór własny falownika" zaimplementowany. Wzór `E_doba = 
- ✅ (2026-09-04) Ekran 11, Moduł 2 (Zapotrzebowanie) — "Przetwornice DC/DC" zaimplementowany. Wzór `P_realne = P
- ✅ (2026-09-04) Ekran 8, Moduł 2 (Zapotrzebowanie) — "Zaawansowane parametry obciążenia" zaimplementowany **czę
- ✅ (2026-09-04) Ekran 13, Moduł 2 (Zapotrzebowanie) — "Bufor na rozbudowę" zaimplementowany. Wzór `E_z buforem 
- ✅ (2026-09-04) Ekran 7, Moduł 2 (Zapotrzebowanie) — "Dni autonomii" zaimplementowany. Suwak 1/2/3/5/7 dni 1:1 
- ✅ (2026-09-04) Ekran 2, Moduł 2 (Zapotrzebowanie) — "Inteligentny bojler C.W.U." zaimplementowany. Energia z p
- ✅ (2026-09-04) Ekran 6, Moduł 2 (Zapotrzebowanie) — "Sezonowość i tryb wakacyjny" zaimplementowany. Trzy typy 
- ✅ (2026-09-04) Ekran 5, Moduł 2 (Zapotrzebowanie) — "Profil dobowy + astronomiczny dzień/noc" zaimplementowany
- ✅ (2026-09-04) Ekran 12, Moduł 2 (Zapotrzebowanie) — "Macierz priorytetów odłączania (Smart Load Shedding)" za
- ✅ (2026-09-04) Ekran 2, Moduł 4 (Baterie) — "Sugestia napięcia systemowego (12/24/48V)" zaimplementowany, dawn
- ✅ (2026-09-04) Ekran 4, Moduł 4 (Baterie) — "Moduł EV — ładowanie samochodu elektrycznego" zaimplementowany. S
- ✅ (2026-09-04) Ekran 19, Moduł 4 (Baterie) — "Vehicle-to-Home (V2H)" zaimplementowany. **Czwarte zastosowanie 
- ✅ (2026-09-04) Ekran 18, Moduł 3 (Instalacja PV) — "Wpływ temperatury na wydajność" zaimplementowany. Wzór `P_
- ✅ (2026-09-04) Ekran 8, Moduł 3 (Instalacja PV) — "Straty na okablowaniu DC (efekt Joule'a)" zaimplementowany.
- ✅ (2026-09-04) Ekran 5, Moduł 3 (Instalacja PV) — "Zimowy stress-test napięciowy MPPT (Voc max)" zaimplementow
- ✅ (2026-09-04) Naprawa dryfu: deklaracja "Ekspertyza domenowa" (GOD BOOK §0.2) dopisana do `docs/memory.md`, `

### 03-zadania-cz3.md

- ✅ (2026-09-04) Ekran 17, Moduł 3 (Instalacja PV) — "Niedopasowanie mocy paneli (mismatch)" zaimplementowany. P
- ✅ (2026-09-04) **Napisano pełną Biblię projektu (12 nowych plików, format GOD BOOK).** `AKTUALIZACJE.md` w `ne
- ✅ (2026-09-04) Ekran 6, Moduł 3 (Instalacja PV) — "Aerodynamika — napór wiatru" zaimplementowany. Wzór `F=0,5×
- ✅ (2026-09-04) Ekran 22, Moduł 3 (Instalacja PV) — "Ochrona stringów (bezpieczniki, diody blokujące)" zaimplem
- ✅ (2026-09-04) Ekran 13, Moduł 3 (Instalacja PV) — "Symulacja zacienienia i wpływ na diody bocznikujące" zaimp
- ✅ (2026-09-04) Ekran 14, Moduł 3 (Instalacja PV) — "Dopasowanie tablicy PV do falownika" zaimplementowany (czę
- ✅ (2026-09-04) Ekran 26, Moduł 3 (Instalacja PV) — "Straty na złączkach MC4 w praktyce" zaimplementowany. Praw
- ✅ (2026-09-04) Ekran 16, Moduł 3 (Instalacja PV) — "Panele bifacjalne" zaimplementowany (częściowo, świadomie)
- ✅ (2026-09-04) Ekran 15, Moduł 6 (Ogrzewanie) — "Pompy cyrkulacyjne — dobór" zaimplementowany. Pierwszy nowy e
- ✅ (2026-09-04) Ekran 14, Moduł 6 (Ogrzewanie) — "Bufor ciepła — dobór pojemności" zaimplementowany. Współczynn
- ✅ (2026-09-04) Ekran dodatkowy, Moduł 6 (Ogrzewanie, dawne 5.63) — "Ryzyko wyłączenia pompy przy niskim napięc
- ✅ (2026-09-04) Ekran dodatkowy, Moduł 6 (Ogrzewanie, dawne 5.33) — "Kocioł elektryczny — porównanie kosztu z p
- ✅ (2026-09-04) Ekran 12, Moduł 6 (Ogrzewanie) — "Infiltracja powietrza (test szczelności)" zaimplementowany (c
- ✅ (2026-09-04) Ekran 3, Moduł 6 (Ogrzewanie) — "System wentylacji z odzyskiem ciepła" zaimplementowany (części
- ✅ (2026-09-04) Ekran 6, Moduł 8 (Bezpieczeństwo) — "UPS krytyczny — dobór sprzętowy" zaimplementowany (częścio
- ✅ (2026-09-04) Ekran 2, Moduł 8 (Bezpieczeństwo) — "Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym" z
- ✅ (2026-09-04) Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (GOD BOOK Y.6) — znaleziono i zsynchronizowa
- ✅ (2026-09-06) **KOREKTA — norma PN-HD 60364-5-52 dostarczona i Załącznik B w pełni zweryfikowany
- ✅ (2026-09-06) **Ekran 1, Moduł 5 — "Dobór przekroju kabla" (mega-Doradca) zaimplementowany.**
- ✅ (2026-09-16, wpis retroaktywny) **Domknięta dziura w tym pliku za okres 2026-09-05 →
- ✅ (2026-09-15) **Rozstrzygnięte częściowo: `StorageAdapter` (wpis ⏳ z 2026-09-03) ma teraz realną
- ✅ (2026-09-15, zamknięte 2026-09-19) **Rollout rozdz. 17 (i18n) na resztę modułów.** Kontrakt
- ✅ (2026-09-16) **Luka "brak CI" (11.2/11.5) zamknięta.** `.github/workflows/ci.yml` — dwa
- ✅ (2026-09-16) **Luka "brak mechanizmu strażniczego i18n" (17.9) zamknięta.**
- ✅ (2026-09-16) **Aktualizacja ze standardu wykonana** (8 nowych wpisów `AKTUALIZACJE.md`,
- ✅ (2026-09-16, druga synchronizacja tego dnia) GOD BOOK v2.18→v2.19 — 1 nowy wpis
- ✅ (2026-09-16) **Rozstrzygnięte: wariant B — zgodnie z dosłownym 11.5.** `scripts/audit-gate.mjs`
- ✅ (2026-09-16) **Przełącznik języka w Ustawieniach + EN/RU dodane.** `lib/i18n/language.ts`
- ✅ (2026-09-16, trzecia synchronizacja tego dnia) **Aktualizacja ze standardem — 7 nowych wpisów

### 04-zadania-cz4.md

- ✅ (2026-09-16) **Rozdział 9 (AI w produkcie) — pierwsza realna integracja (Priorytet 1, punkt 1
- ✅ (2026-09-16) **5.3 (PWA offline-first) — manifest + service worker (Priorytet 2 z audytu
- ✅ (2026-09-16, czwarta synchronizacja tego dnia) **Aktualizacja ze standardem — 7 nowych wpisów
- ✅ (2026-09-16, piąta synchronizacja tego dnia) **Naprawiony krytyczny błąd CSP/RSC streaming
- ✅ (2026-09-16) **Start rolloutu i18n (moduł po module, 17.9) — pierwsza partia: 3 moduły ponad
- ✅ (2026-09-18) **Rollout i18n — druga partia: kolejne 3 moduły.** Zmigrowane do `i18nKey`/
- ✅ (2026-09-18) **Rollout i18n — trzecia partia: 5 modułów `baterie/`, decyzja o kontynuacji do
- ✅ (2026-09-18) **Rollout i18n — czwarta partia: 5 modułów `baterie/` + rozszerzenie strażnika
- ✅ (2026-09-18) **Rollout i18n — piąta partia: 5 modułów `baterie/`, wzorzec sezonowy.**
- ✅ (2026-09-18) **Rollout i18n — szósta partia: 5 modułów `baterie/`, dwie kolejne przeoczone
- ✅ (2026-09-18) **Rollout i18n — siódma partia: 5 modułów `baterie/`, zamyka "normalne" moduły
- ✅ (2026-09-18) **Rollout i18n — ósma partia: pierwsze 5 modułów `okablowanie/`.** Zmigrowane:
- ✅ (2026-09-18) **Rollout i18n — dziewiąta partia: kolejne 5 modułów `okablowanie/`.**
- ✅ (2026-09-19) **Rollout i18n — dziesiąta partia: ostatnie 5 modułów `okablowanie/`,
- ✅ (2026-09-19) **Rollout i18n — jedenasta partia: pierwsze 5 modułów `pv/`.** Zmigrowane:
- ✅ (2026-09-19) **Rollout i18n — dwunasta partia: kolejne 5 modułów `pv/`.** Zmigrowane:
- ✅ (2026-09-19) **Rollout i18n — trzynasta partia: zamyka katalog `pv/` + pierwsze 4 moduły
- ✅ (2026-09-19) **Rollout i18n — czternasta partia: zamyka katalog `zapotrzebowanie/`.**
- ✅ (2026-09-19) **Rollout i18n — piętnasta partia: zamyka cały katalog `ogrzewanie/` (6
- ✅ (2026-09-19) **Rollout i18n — szesnasta partia: start katalogu `montaz-baterii/`.**
- ✅ (2026-09-19) **Rollout i18n — siedemnasta partia: zamyka cały katalog `montaz-baterii/`
- ✅ (2026-09-19) **Rollout i18n — osiemnasta partia: zamyka `bezpieczenstwo/` +
- ✅ (2026-09-19) **Sześć otwartych pytań (zebranych z tego pliku i `docs/memory.md`)
- ✅ (2026-09-19) **Punkt 7a z prośby "5,6,7,8,9 proszę zrób"** — cztery luki z
- ✅ (2026-09-19) **Punkt 7b z tej samej prośby — Wind Chill (Moduł 7).** Wzór NWS/Environment
- ✅ (2026-09-19) **Punkt 5 z tej samej prośby — kontynuacja Modułu 2, Ekrany 3/10/14/15.**
- ✅ (2026-09-20) **Punkt 8 z tej samej prośby — rollout `usePersistedDraft` na wszystkie
- ✅ (2026-09-20) **Punkt 6, ostatni z prośby "5,6,7,8,9 proszę zrób" — kafle 08–14 wdrożone
- ✅ (2026-09-20) **Migracja i18n na client-side bundled (offline-first, `docs/standards/17-i18n.md`

### 05-pelny-audyt-20-09.md

- ✅ **[PILNE, architektura] Migracja i18n z cookie+server-side na client-side bundled —
- ✅ (2026-09-20, Routine Y.6 cykliczny) **Kolejne sprawdzenie `AKTUALIZACJE.md` — 1 nowy wpis od
- ✅ (2026-09-25, rozstrzygnięte → D27: rekomendacja + wykresy + dowolny kąt, wiatr %/N, balast kg, 1 zł/kg edyto
- ✅ (2026-09-25, potwierdzone tego samego dnia → D25 w `rejestr-decyzji.md`: okresy lato/mar–paź/lut–lis/cały ro
- ✅ (2026-09-25, zbudowane → D28: ekran M6 „Porównanie kosztów ogrzewania” z nagrzewnicą typu webasto, olejem i 
- ✅ (2026-09-25) **Weryfikacja OCR paczki New-info** — zakres używany w projekcie zweryfikowany wizualnie i prze
- ✅ (2026-09-25) ~~**Do decyzji właściciela:** dwa foldery normy wiatrowej (`norma-PN-EN-1991-1-4/` — notatka ro
- ✅ (2026-09-26) **M6/E1 „Straty ciepła budynku” (dawne 5.1)** — przegrody Σ U·A·ΔT + wentylacja, θe ze strefy I
- ✅ (2026-09-26, zweryfikowane ponownie 26.09) ~~**Audyt N.1 (GOD BOOK v2.39) w kierunku źródło → rejestr dla po
- ✅ (2026-09-26) Zamyka dwa wpisy 🔲 z 25.09 (równoległa sesja OCR, PR #154): „Balast projektowy wg PN-EN 1990 (E
- ✅ (2026-09-26) **M6/E2 „Zapotrzebowanie na C.O. i C.W.U.”** i **M6/E7 „Mostki termiczne”** (zamyka wpis 🔲 z 26
- ✅ (2026-09-26) **Temperatury miesięcy z PVGIS** na M6/E1 (zamyka część opcjonalną wpisu z 26.09) — bez zmiany 
- ✅ (2026-09-26) **Przecinki w liczbach w tekstach założeń** (zamyka wpis 🔲 „Drobne (UI)” z 26.09) — `t()` forma
- ✅ (2026-09-26, zamknięte niezależnie 26.09) ~~**Strażnik i18n — 41 modułów `lib/core/modules/*` poza listą `MI
- ✅ (2026-09-26) **Strażnik i18n — domknięte** (zamyka wpis 🔲 „41 modułów poza listą” z 26.09): 19 modułów już z
- ✅ (2026-09-26) **Zduplikowane `id` pól formularza** (zamyka wpis 🔲 z 25.09 oraz podpunkt „przejście po ekranac
- ✅ (2026-09-26) **Pełna resynchronizacja `mapa-wdrozenia.md`** (zamyka wpis 🔲 z 25.09): 153 z 314 ekranów docel
- ✅ (2026-09-26) Domknięcie dwóch martwych wpisów 🔲 z początku listy (bez zmian w kodzie): „Kontynuacja kafli pu
- ✅ (2026-09-26) **M6/E10 „Optymalizacja izolacji”** — bez PN-EN ISO 6946 (U' = 1/(1/U + d/λ), opory przejmowani
- ✅ (2026-09-26) **M6/E8 „Pojemność cieplna budynku”** (częściowo) — decyzja właściciela: C = Σ m·c całej masy j
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 3 (Instalacja PV) zamknięty.** Kolejność 11→3→4→2→reszta (
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 4 (Magazyn energii / baterie) zamknięty.** Kolejność 11→3→
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 2 (Zapotrzebowanie) zamknięty.** Kolejność 11→3→4→2→reszta
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 5 (Okablowanie) zamknięty (pierwszy z "reszty").** 20 nowy
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 1 (Lokalizacja) zamknięty (0 nowych plików).** `skaner-dzi
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 6 (Ogrzewanie) zamknięty.** 7 nowych plików `lib/ai/tools/
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 8 (Bezpieczeństwo) zamknięty.** 3 nowe pliki `lib/ai/tools
- ✅ (2026-09-26) **Rollout opisów narzędzi AI — Moduł 7 (stress-test)/9 (ESP32)/12 (mobilny) zamknięty — KOŃCZY 
- ✅ (2026-09-26) **`napiecie-systemowe` (Ekran 2, Moduł 4) — dług z rolloutu Modułu 4 domknięty.** Ponowna anali

