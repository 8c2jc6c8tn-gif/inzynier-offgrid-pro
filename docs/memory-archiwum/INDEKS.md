# Indeks archiwum docs/memory.md

**Wersja:** 1.0 | **Utworzono:** 02.10.2026 | **Status:** append-only (nowe pliki i wiersze dopisujemy na końcu; nic nie edytujemy wstecz)
**Powiązane:** `docs/memory.md` (plik aktywny: skrót obowiązujących pułapek i decyzji + sekcje z ostatnich 7 dni), `docs/wklad-do-standardu.md` (wpis z 02.10.2026 o mechanizmie archiwizacji).

TL;DR: Pliki w tym katalogu zawierają dosłowną kopię (1:1, bez skrótów i poprawek) sekcji `docs/memory.md` z okresu 05.09–24.09.2026, przeniesionych 02.10.2026. Dzięki temu aktywny `memory.md` jest krótki, a nic nie zginęło. Jak szukać: (1) tabela niżej wskazuje plik po temacie i dacie, (2) `grep -rn "fraza" docs/memory-archiwum/`, (3) sekcja „Archiwizacja” w `docs/memory.md` opisuje procedurę i dowód bezstratności.

Uwaga o odsyłaczach: komentarze w kodzie i dokumenty zawierające „`docs/memory.md`, wpis DD.MM.2026” z datą do 24.09.2026 włącznie wskazują dziś na te pliki (odsyłaczy nie przepisywano); wpisy z 25.09.2026 i późniejsze są nadal w `docs/memory.md`.

Uwaga o numeracji: numer „c.d. N” w nagłówkach „Decyzje i uzasadnienie” to kolejność dopisywania w jednym pliku roboczym, nie data — datę niesie treść wpisu (np. „2026-09-04 — …”).

| Plik | Okres / temat | Sekcji | Rozmiar |
|---|---|---:|---:|
| [`01-audyty-i-pierwsze-ekrany-wrzesien-05.md`](01-audyty-i-pierwsze-ekrany-wrzesien-05.md) | 05.09: audyty GOD BOOK Część N (13 modułów), Dyrektywa #14, M11/A2+A5, M5/E6+E22, norma PN-HD 60364-5-52 (OCR) | 6 | 18 KB |
| [`02-synchronizacja-ze-standardem-04-23-09.md`](02-synchronizacja-ze-standardem-04-23-09.md) | 04–23.09: log synchronizacji Y.6/Y.9 z new-app-standards (GOD BOOK v2.3→v2.28), CI i audit-gate, CSP, spór o limit Actions, odstępstwo 17.7b | 1 | 44 KB |
| [`03-decyzje-i-uzasadnienia-cz1.md`](03-decyzje-i-uzasadnienia-cz1.md) | 29.08–04.09 (część 1): audyt 20.09, start Etapu 1, ekrany wzorców A–H, pulpit, motyw/kolory/czcionki, v0, ikony kafli, M11 ścieżki A/B, M4 ekrany 1–12 | 36 | 74 KB |
| [`03-decyzje-i-uzasadnienia-cz2.md`](03-decyzje-i-uzasadnienia-cz2.md) | 04.09 (część 2): M4 ekrany 5–34, M2 ekrany 2–17, M3 ekrany 5–18, Biblia GOD BOOK (pliki Części S) | 39 | 74 KB |
| [`03-decyzje-i-uzasadnienia-cz3.md`](03-decyzje-i-uzasadnienia-cz3.md) | 04–13.09 (część 3): M3 ekrany 6–26, M6 i M8 ekrany dodatkowe, normy 5-52/5-54/4-41/4-43/7-712/EN 1991-1-3, M5/E1, korekta ochrona-stringow, D20, Black Start | 25 | 75 KB |
| [`04-moduly-storage-i18n-pilotaz-logowanie-13-16-09.md`](04-moduly-storage-i18n-pilotaz-logowanie-13-16-09.md) | 13–15.09: mapa orientacyjna, M5 partie 1–3, moduł „Dobór napięcia” (M4/E2 v2.x), §8.11, StorageAdapter/autosave, pilotaż i18n, szkielet logowania, strażnik i18n | 19 | 59 KB |
| [`05-blad-procesowy-edycja-standardu-16-09.md`](05-blad-procesowy-edycja-standardu-16-09.md) | 16.09: błąd procesowy (edycja new-app-standards), audyt pełny, i18n EN/RU (wariant cookie), logowanie 18.5/18.8, PWA/SW, CSP nonce, pierwsze narzędzie AI, start rolloutu i18n | 1 | 48 KB |
| [`06-rollout-i18n-18-19-09.md`](06-rollout-i18n-18-19-09.md) | 18–19.09: rollout i18n partie 2–19 (Warning/assumptions → klucze), pułapki rolloutu | 18 | 54 KB |
| [`07-zaleglosci-i-kafle-19-23-09.md`](07-zaleglosci-i-kafle-19-23-09.md) | 19–23.09: 6 decyzji właściciela, „Mój sprzęt”, logo, M2 ekrany 3/10/14/15, autosave 114 ekranów, kafle 08–14, i18n client-side, CI/Actions, M5 29/29, asystent AI globalny, M4 „Item 3”, Wampiry energetyczne, D21 | 18 | 62 KB |
| [`08-moduly-1-i-sync-24-09.md`](08-moduly-1-i-sync-24-09.md) | 23–24.09: Y.6 adaptacyjny, Moduł 1 (jądro + proxy PVGIS + ULDK + UI), TD14–TD19, narzędzia AI M1, sync v2.38 | 11 | 39 KB |

## Spis sekcji w plikach (nagłówki dosłownie jak w oryginale)

### 01-audyty-i-pierwsze-ekrany-wrzesien-05.md

- Audyt GOD BOOK Część N (05.09.2026)
- Audyt GOD BOOK Część N — pełne przejście 13 modułów (05.09.2026)
- Decyzja procesowa: praca małymi partiami, rejestracja natychmiastowa (05.09.2026)
- Ekran A2, Moduł 11 (Montaż mechaniczny + separacja ogniw) — 05.09.2026
- Ekran 6, Moduł 5 (Dobór bezpieczników i rozłączników) — 05.09.2026
- Norma PN-HD 60364-5-52:2011 dostarczona i przeanalizowana (05.09.2026)

### 02-synchronizacja-ze-standardem-04-23-09.md

- Synchronizacja ze standardem

### 03-decyzje-i-uzasadnienia-cz1.md

- Pełny audyt na polecenie właściciela projektu (20.09.2026) — Y.6/Y.9 + Część N
- Decyzje i uzasadnienie
- Pułapki i lekcje
- Konwencje specyficzne dla projektu
- Decyzje i uzasadnienie (c.d. 2)
- Decyzje i uzasadnienie (c.d. 3)
- Decyzje i uzasadnienie (c.d. 4)
- Otwarte sprawy / dług
- Decyzje i uzasadnienie (c.d.)
- Decyzje i uzasadnienie (c.d. 5)
- Decyzje i uzasadnienie (c.d. 6)
- Decyzje i uzasadnienie (c.d. 7)
- Decyzje i uzasadnienie (c.d. 8)
- Decyzje i uzasadnienie (c.d. 9)
- Decyzje i uzasadnienie (c.d. 10)
- Decyzje i uzasadnienie (c.d. 11)
- Decyzje i uzasadnienie (c.d. 12)
- Decyzje i uzasadnienie (c.d. 13)
- Decyzje i uzasadnienie (c.d. 14)
- Decyzje i uzasadnienie (c.d. 15)
- Decyzje i uzasadnienie (c.d. 16)
- Decyzje i uzasadnienie (c.d. 17)
- Decyzje i uzasadnienie (c.d. 18)
- Decyzje i uzasadnienie (c.d. 19)
- Decyzje i uzasadnienie (c.d. 20)
- Decyzje i uzasadnienie (c.d. 21)
- Decyzje i uzasadnienie (c.d. 22)
- Decyzje i uzasadnienie (c.d. 23)
- Decyzje i uzasadnienie (c.d. 24)
- Decyzje i uzasadnienie (c.d. 25)
- Decyzje i uzasadnienie (c.d. 26)
- Decyzje i uzasadnienie (c.d. 27)
- Decyzje i uzasadnienie (c.d. 28)
- Decyzje i uzasadnienie (c.d. 29)
- Decyzje i uzasadnienie (c.d. 30)
- Decyzje i uzasadnienie (c.d. 31)

### 03-decyzje-i-uzasadnienia-cz2.md

- Decyzje i uzasadnienie (c.d. 32)
- Decyzje i uzasadnienie (c.d. 33)
- Decyzje i uzasadnienie (c.d. 34)
- Decyzje i uzasadnienie (c.d. 35)
- Decyzje i uzasadnienie (c.d. 36)
- Decyzje i uzasadnienie (c.d. 37)
- Decyzje i uzasadnienie (c.d. 38)
- Decyzje i uzasadnienie (c.d. 39)
- Decyzje i uzasadnienie (c.d. 40)
- Decyzje i uzasadnienie (c.d. 41)
- Decyzje i uzasadnienie (c.d. 42)
- Decyzje i uzasadnienie (c.d. 43)
- Decyzje i uzasadnienie (c.d. 44)
- Decyzje i uzasadnienie (c.d. 45)
- Decyzje i uzasadnienie (c.d. 46)
- Decyzje i uzasadnienie (c.d. 47)
- Decyzje i uzasadnienie (c.d. 48)
- Decyzje i uzasadnienie (c.d. 49)
- Decyzje i uzasadnienie (c.d. 50)
- Decyzje i uzasadnienie (c.d. 51)
- Decyzje i uzasadnienie (c.d. 52)
- Decyzje i uzasadnienie (c.d. 53)
- Decyzje i uzasadnienie (c.d. 54)
- Decyzje i uzasadnienie (c.d. 55)
- Decyzje i uzasadnienie (c.d. 56)
- Decyzje i uzasadnienie (c.d. 57)
- Decyzje i uzasadnienie (c.d. 58)
- Decyzje i uzasadnienie (c.d. 59)
- Decyzje i uzasadnienie (c.d. 60)
- Decyzje i uzasadnienie (c.d. 61)
- Decyzje i uzasadnienie (c.d. 62)
- Decyzje i uzasadnienie (c.d. 63)
- Decyzje i uzasadnienie (c.d. 64)
- Decyzje i uzasadnienie (c.d. 65)
- Decyzje i uzasadnienie (c.d. 66)
- Decyzje i uzasadnienie (c.d. 67)
- Decyzje i uzasadnienie (c.d. 68)
- Decyzje i uzasadnienie (c.d. 69)
- Decyzje i uzasadnienie (c.d. 70)

### 03-decyzje-i-uzasadnienia-cz3.md

- Decyzje i uzasadnienie (c.d. 71)
- Decyzje i uzasadnienie (c.d. 72)
- Decyzje i uzasadnienie (c.d. 73)
- Decyzje i uzasadnienie (c.d. 74)
- Decyzje i uzasadnienie (c.d. 75)
- Decyzje i uzasadnienie (c.d. 76)
- Decyzje i uzasadnienie (c.d. 77)
- Decyzje i uzasadnienie (c.d. 78)
- Decyzje i uzasadnienie (c.d. 79)
- Decyzje i uzasadnienie (c.d. 80)
- Decyzje i uzasadnienie (c.d. 81)
- Decyzje i uzasadnienie (c.d. 82)
- Decyzje i uzasadnienie (c.d. 83)
- Decyzje i uzasadnienie (c.d. 84)
- Decyzje i uzasadnienie (c.d. 85)
- Decyzje i uzasadnienie (c.d. 86)
- Decyzje i uzasadnienie (c.d. 87)
- Decyzje i uzasadnienie (c.d. 88)
- Decyzje i uzasadnienie (c.d. 89)
- Decyzje i uzasadnienie (c.d. 90) — korekta wpisu 89
- Decyzje i uzasadnienie (c.d. 91)
- Decyzje i uzasadnienie (c.d. 92)
- Decyzje i uzasadnienie (c.d. 93)
- Decyzje i uzasadnienie (c.d. 94)
- Decyzje i uzasadnienie (c.d. 95)

### 04-moduly-storage-i18n-pilotaz-logowanie-13-16-09.md

- Mapa orientacyjna
- Moduł 5 — 7 nowych ekranów niezablokowanych (13.09.2026)
- Nowy materiał źródłowy — propozycja modułu "Dobór napięcia systemu Off-Grid v3.0" (13.09.2026)
- Poprawki do modułu "Dobór napięcia" — runda 2 (13.09.2026)
- Poprawki do modułu "Dobór napięcia" — runda 3: C.3 rozstrzygnięte (13.09.2026)
- Poprawki do modułu "Dobór napięcia" — runda 4: A.3 rozstrzygnięte (13.09.2026)
- Miejsce modułu "Dobór napięcia" — ROZSTRZYGNIĘTE (13.09.2026)
- Budowa modułu "Dobór napięcia" — zakończona (14.09.2026)
- Moduł 5 — druga partia niezablokowanych ekranów (13.09.2026)
- Moduł 5 — trzecia partia: ostatnie 5 niezablokowanych ekranów (13.09.2026)
- B5 (Moduł 11) i M4/Ekran 25 — echo doboru kabli, nowa fizyka podziału prądu (14.09.2026)
- Dobudowa Etapu D w module "Dobór napięcia" (14.09.2026)
- Nowa reguła standardu: Ekrany pochodne i Kreator Pro (14.09.2026)
- Opracowanie "Oświetlenie LED" — wstrzymane na jednym punkcie (14.09.2026)
- M4/Ekran2 (Dobór napięcia systemowego) — poprawki Etapu B + usunięcie Etapów D/F/G (14.09.2026)
- Pierwsza realna implementacja `StorageAdapter` — autozapis Seed formularza (15.09.2026)
- Pierwsza implementacja i18n — pilotaż na module `kalkulatory-pomocnicze` (15.09.2026)
- Szkielet logowania (rozdz. 18) — bez realnych kluczy Supabase (15.09.2026)
- Mechanizm strażniczy i18n — `scripts/check-i18n-guard.mjs` (16.09.2026)

### 05-blad-procesowy-edycja-standardu-16-09.md

- Błąd procesowy: bezpośrednia edycja `new-app-standards` z tej sesji (16.09.2026)

### 06-rollout-i18n-18-19-09.md

- Rollout i18n — druga partia (18.09.2026)
- Rollout i18n — trzecia partia i decyzja o kontynuacji do końca (18.09.2026)
- Rollout i18n — czwarta partia: luka w strażniku + pierwszy przypadek "dane katalogowe" poza planem (18.09.2026)
- Rollout i18n — piąta partia: wzorzec "słowo-parametr jako identyfikator wariantu" (18.09.2026)
- Rollout i18n — szósta partia: strażnik `validation.ts` udowodnił swoją wartość (18.09.2026)
- Rollout i18n — siódma partia: zamknięcie katalogu `baterie/` (poza odłożonymi) (18.09.2026)
- Rollout i18n — ósma partia: start katalogu `okablowanie/` (18.09.2026)
- Rollout i18n — dziewiąta partia: kolejne 5 modułów `okablowanie/` + realny bug echa (18.09.2026)
- Rollout i18n — dziesiąta partia: zamknięcie katalogu `okablowanie/` (19.09.2026)
- Rollout i18n — jedenasta partia: start katalogu `pv/` (19.09.2026)
- Rollout i18n — dwunasta partia: kolejne 5 modułów `pv/` + drugi realny bug UI w tej rundzie (19.09.2026)
- Rollout i18n — trzynasta partia: zamknięcie katalogu `pv/`, start `zapotrzebowanie/` (19.09.2026)
- Rollout i18n — czternasta partia: zamknięcie katalogu `zapotrzebowanie/` (19.09.2026)
- Rollout i18n — piętnasta partia: start katalogu `ogrzewanie/` (19.09.2026)
- Rollout i18n — szesnasta partia: start katalogu `montaz-baterii/` (19.09.2026)
- Rollout i18n — siedemnasta partia: zamyka cały katalog `montaz-baterii/` (19.09.2026)
- Rollout i18n — osiemnasta partia: zamyka `bezpieczenstwo/` + `kalkulator-mobilny/` (19.09.2026)
- Rollout i18n — dziewiętnasta (ostatnia realna) partia: `baterie/napiecie-systemowe` (19.09.2026)

### 07-zaleglosci-i-kafle-19-23-09.md

- Sześć otwartych pytań zebranych i rozstrzygniętych przez właściciela projektu (19.09.2026)
- Kontynuacja: punkty 5/6/7/8/9 z listy zaległości (19.09.2026)
- Punkt 5 — kontynuacja Modułu 2 "Zapotrzebowanie", 4 pozostałe ekrany numerowane (19.09.2026)
- Punkt 8 — rollout `usePersistedDraft` na wszystkie pozostałe ekrany kalkulatorów (20.09.2026)
- Punkt 6 — kafle 08–14, wdrożenie po akceptacji (20.09.2026)
- Migracja i18n na client-side bundled (offline-first, 17.4) — 20.09.2026
- Limit minut GitHub Actions wyczerpany + `paths-ignore` w CI — 20.09.2026
- Aktualizacja ze standardu (20.09.2026, druga tego dnia) — 9.0a, 15.7a, doprecyzowanie 9.3
- Doprecyzowanie zasady: konsolidacja do new-app-standards nigdy z tej sesji (20.09.2026, trzecia dziś)
- Moduł 5 (Okablowanie) domknięty — 29/29, ostatnie 6 ekranów (20.09.2026)
- Asystent AI: scentralizowane okno zamiast integracji per-ekran (20.09.2026)
- Anulowany job CI przy PR #132 (20.09.2026) — zbadane, przyczyna NIE jest limitem minut
- Synchronizacja ze standardem przed sesją "3 i 5" (20.09.2026)
- Ekran 3, Moduł 4 — Symulacja czasu ładowania/rozładowania (20.09.2026)
- Ekrany 31/32/33, Moduł 4 — dopełnienie "Item 3" (20.09.2026)
- Zamknięcie Item 3 (PR #135) + skan zakresu przed Item 5 "Wampiry energetyczne" (20.09.2026)
- Zamknięcie Item 5 — moduł zbiorczy "Wampiry energetyczne" (20.09.2026)
- D21 — cykl Y.6 obniżony lokalnie do ≤12h (23.09.2026)

### 08-moduly-1-i-sync-24-09.md

- Konfiguracja Y.6 adaptacyjnego + sprawdzenie 24.09.2026 — GOD BOOK v2.21→v2.37 (16 wersji, NIE zastosowane, propozycja czeka na decyzję właściciela)
- Moduł 1 (Lokalizacja), Ekrany 2–4 — jądro obliczeniowe (23.09.2026)
- Proxy PVGIS TMY (23.09.2026) — D22, dane dla Ekranu 4 Modułu 1
- TD16 naprawiony — model Muneera w Ekranie 4 Modułu 1 (24.09.2026)
- ULDK bezpośrednio z przeglądarki — D23 (24.09.2026)
- Moduł 1 — UI Ekranów 2–4 (24.09.2026) — D22
- Narzędzia AI modułów zmigrowanych do i18n — tekst PL zamiast kodu (24.09.2026)
- TD15 (2) naprawiony — zacienienie we wskaźniku Ekranu 4 Modułu 1 (24.09.2026)
- TD14 naprawiony — Ekran 3 liczy stratę całkowitej energii na danych TMY (24.09.2026)
- TD17 — przeszkody o obrysie wielokąta w Skanerze (24.09.2026)
- Synchronizacja ze standardem — Y.6, pełny nadpis NIETYKALNE/ADAPTOWALNE (24.09.2026)

