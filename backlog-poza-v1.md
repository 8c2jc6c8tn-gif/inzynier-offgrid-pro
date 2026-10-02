# Backlog poza v1 — Inżynier Offgrid Pro

**Wersja:** 1.7 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 02.10.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `docs/lista-do-zrobienia.md`, `mapa-wdrozenia.md`

TL;DR: Rzeczy świadomie odłożone poza zakres pierwszej wersji — decyzje o skali/fazowaniu (N.2 GOD BOOK), zbierane tutaj przy audycie. **Nie to samo, co `docs/lista-do-zrobienia.md`** (bieżący stan pracy, inny rytm — patrz B.6 GOD BOOK). Dwie kategorie: (1) **⚠️ blocked** — ekran/funkcja sprawdzona i odrzucona jako niebuildowalna bez wymyślania danych, jawne uzasadnienie; (2) **⏳ poza zakresem v1** — świadomie odłożone całe obszary produktu (infrastruktura, płatności, i18n), nie kwestia brakujących danych.

---

## ⏳ Poza zakresem v1 — całe obszary

- **Głęboka elektryka AC → osobna apka „Elektryk Pro”** (02.10.2026, D70) — projekt rozdzielnicy AC obwód po obwodzie, schemat jednokreskowy, rozpływ na fazy, pomiary okresowe całej instalacji, szukanie usterek, stare instalacje, silniki i soft start, szkolenie elektryków. Nie budujemy tego w Offgrid; Offgrid daje wymagania dla rozdzielnicy za falownikiem i twarde stopy (D70 pkt 5–6) oraz odesłanie do Elektryk Pro jako innego zakresu.
- **`IndexedDBStorageAdapter`** — implementacja trwałego zapisu (interfejs `StorageAdapter` istnieje, `kontrakty-rdzenia.md` §3). Powód: kod dziś trzyma stan tylko w React state, wystarcza do zweryfikowania logiki domenowej każdego ekranu; trwały zapis to osobny, duży krok.
- **i18n wielojęzyczne** — profil `PL` jako jedyny start (Zasada 4, `zlote-zasady.md`). Nowy kraj = nowy plik JSON, bez zmian w jądrze, gdy będzie potrzebny.
- **Preset onboardingu „Jestem podłączony do sieci”** (28.09.2026, D39) — wysuwa kafle M14 na początek pulpitu. Odłożony razem z całym ekranem onboardingu (`docs/pulpit-i-nawigacja.md` §3 — osiem presetów to wersja robocza, onboarding jeszcze nie istnieje). Zebrane tu przy audycie końcowym N.3 (dotąd tylko w D39 i w „Otwartych sprawach” pulpitu). **[30.09.2026, D62] Preset zbudowany** (Ustawienia, `lib/pulpit/presety.ts`); w backlogu zostaje sam ekran onboardingu przy pierwszym uruchomieniu.
- **Rozdział „Oświetlenie LED” — kandydat poza Biblią** (28.09.2026, D49) — szkic `docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md` (14.09.2026) czeka na kartę katalogową taśmy (`R` na metr) od właściciela. Nie blokuje N.3 ani kodu M14; przy integracji dostaje własny pełny audyt.
- **FREE/PRO dla M14 „Dom – sieć” / „Firma – sieć”** (28.09.2026, D37) — ekrany M14 bez przypisania, podział wróci osobną decyzją właściciela. D2 dla M1–M13 bez zmian.
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
- ~~**Ekran 1 (mega-Doradca doboru kabla)** — brak tabeli obciążalności prądowej normy PN-HD 60364-5-52.~~ — **[06.09.2026] Zbudowany** — norma dostarczona i zweryfikowana 05.09.2026, silnik zaimplementowany 06.09.2026 (`lib/core/modules/okablowanie/dobor-przekroju-kabla/`). Wpis zachowany jako historia (zasada "nie usuwaj — oznacz"); nazwa normy poprawiona przy okazji audytu 07.09.2026 (było błędnie "PN-IEC", norma to PN-HD 60364-5-52). Pozostałe 25 z 29 ekranów M5 mają samodzielne wzory, niezależne od tej normy.

### Moduł 6 — Ogrzewanie
[05.09.2026] ✅ DODANO — źródło: audyt GOD BOOK Część N, drugie przejście (korekta wpisu 2A/2C/2D wyżej).
- **5.42 (Wymiarowanie kolektora gruntowego, Część 2C, 🔴)** — sprawdzone i odrzucone: przykład liczbowy źródła niereprodukowalny (rozbieżność 4-8× względem oczekiwanego wyniku), decyzja udokumentowana w `docs/memory.md` (2026-08-30), ale dotąd nieskonsolidowana tutaj.

### Moduł 6 — Ogrzewanie (luki jawnie oznaczone w samym źródle, skonsolidowane tutaj przy audycie 05.09.2026)

[05.09.2026] ✅ DODANO — źródło: audyt GOD BOOK Część N.1 ("zbierz rozproszone pozycje ⏳ do jednego pliku"). `docs/zrodla/Tresc_WSZYSTKIE_MODULY_scalone.md` ma własną sekcję "Znane luki do domknięcia" (linie 138–143) z 3 pozycjami dot. Modułu 6, uczciwie oznaczonymi przez autorów źródła — ale nigdy nie przeniesionymi do tego pliku ani do `docs/rejestr-pokrycia.md`/`mapa-wdrozenia.md` jako świadomy zakres poza v1. Nie są to nowo odkryte luki (źródło samo je nazywa), tylko rozproszony zapis, który audyt konsoliduje, zgodnie z zasadą tego pliku.

- **Moduł 6, Część 2C (silnik czynników wpływu na COP/wydajność pompy ciepła)** — źródło: "22 z 26 genuinie odrębnych funkcji ma zidentyfikowany temat i źródło, ale nie ma jeszcze pełnej treści wg szablonu Doradcy. 4 najbardziej safety-krytyczne rozpisane w pełni". [05.09.2026] ⚠️ KOREKTA (audyt GOD BOOK Część N, drugie przejście) — poprzednie zdanie w tym miejscu błędnie przypisywało "COP pompy ciepła" do tych 4 w pełni rozpisanych funkcji Części 2C; COP (5.5) należy do Części 1 (Ekran 5), nie 2C. Z faktycznych 4 w pełni rozpisanych funkcji 2C (5.31 hałas/wibracje, 5.42 kolektor gruntowy, 5.46 zamarznięcie dolnego źródła, 5.63 niskie napięcie) **tylko 5.63 jest dziś zbudowane** (ekran dodatkowy M6). Status pozostałych trzech: **5.42 sprawdzone i odrzucone** (`docs/memory.md`, 2026-08-30 — przykład źródła niereprodukowalny, rozbieżność 4-8×, patrz sekcja Blocked niżej); **5.46 (ryzyko zamarznięcia dolnego źródła, twardy stop 🔴) i 5.31 (hałas i wibracje) mają pełną, gotową treść źródłową i NIE SĄ jeszcze budowane ani śledzone jako `todo`** w `docs/rejestr-pokrycia.md` — dopisane tam w tym samym audycie. Pozostałe 22 funkcji 2C (poza tymi 4) czekają na pełną treść źródłową, nie tylko na implementację.
- **Moduł 6, Część 2A (alternatywne źródła ciepła: kominek, IR, maty kapilarne, PCM)** — źródło: "5 alternatywnych źródeł ciepła skategoryzowane, treść do napisania". Kocioł elektryczny (jedno z 5) już zbudowany (ekran dodatkowy, dawne 5.33) — pozostałe 4 (kominek, IR, maty kapilarne, PCM) czekają na treść źródłową.
- **Moduł 6, Część 2D (29 czynników wpływu na zapotrzebowanie cieplne)** — źródło: "24 z 29 czynników wpływu ma zachowaną pełną treść w Biblii v2.0, wymaga mechanicznego wypełnienia szablonu". Dotyczy generycznego silnika "wpływ czynnika X" (`docs/standards/01-architektura.md`, 1.4) — kandydat na jeden silnik + tabelę parametrów, nie 24 osobne ekrany, gdy będzie budowany.

### Poza modułami — nie mieści się w żadnym z 13 (jawnie oznaczone w źródle)

- **Asystent głosowy (dawne 12.41)** — źródło: "nie mieści się we wzorcach A–H (inny kanał interakcji), wymaga osobnej specyfikacji drzewa intencji". Odłożone nie z powodu brakujących danych, tylko dlatego że wymaga innego rodzaju specyfikacji (drzewo intencji głosowych) niż reszta aplikacji — inna kategoria niż `⚠️ blocked` niżej.

### Moduł 11 — Montaż baterii
- ~~**Ścieżka B, pozycja B5** — blocked~~ — **[06.09.2026] Odblokowane źródłowo**: norma PN-HD 60364-5-52 dostarczona, M5/Ekran 1 (silnik doboru przekroju kabla) gotowy do reużycia jako "echo". Przeniesione z `⚠️ Blocked` do zwykłego `todo` — to już nie brak danych, tylko czysta praca implementacyjna (szczegóły: `docs/rejestr-pokrycia.md`, sekcja Moduł 11). Wpis zachowany jako historia (zasada "nie usuwaj — oznacz"), przeklasyfikowany przy audycie 07.09.2026.
- ~~**A2, A5** — świadomie odłożone~~ — **[05.09.2026] Oba zbudowane** (na wyraźną prośbę autora, kompletuje przygotowanie do realnego montażu 16S). **Ścieżka A (LiFePO4) teraz kompletna, 10/10.** Wpis zachowany jako historia decyzji "odłóż", nie usunięty (zasada "nie usuwaj — oznacz").

### Moduł 3 — Instalacja PV (poza zakresem korekty `ochrona-stringow`, HD 60364-7-712, 06-07.09.2026)

[07.09.2026] ✅ DODANO — źródło: przepisanie `ochrona-stringow` (M3/E22) wg normy HD 60364-7-712 znalazło dodatkowe wymagania normy, świadomie nieobjęte tą korektą (poza jej wąskim zakresem, nie brak danych — treść normy jest znana i dostępna).
- ~~**Reguła doboru diody blokującej**~~ — **[07.09.2026] Przeniesione do `dlug-techniczny.md` TD13**: to część istniejącego, częściowo zbudowanego ekranu M3/E22 (`ochrona-stringow` — tytuł źródłowy wprost "bezpieczniki, **diody blokujące**"), nie osobny nieoceniony obszar, więc pasuje do wzorca TD# (X.4 GOD BOOK), nie tego pliku. Treść: `dlug-techniczny.md`.
- **Alternatywa kablowa przy braku wymaganej ochrony nadprądowej** (§712.433.101: `Iz kabla stringu ≥ (Ns-1)×I_SC_MAX`) — `ochrona-stringow` zgłasza to jako ostrzeżenie do weryfikacji, ale sam kabel nie jest sprawdzany (wymaga integracji z M5/E1, `dobor-przekroju-kabla`).
- **Tabele decyzji o ochronie przepięciowej DC** (§712.443, Tabela 712.102 L_crit wg gęstości wyładowań Ng, Tabela 712.534 U_w wg U_OC_MAX) — brak ekranu.
- **Wymóg RCD typu B po stronie AC** (§712.530.3.101) — brak ekranu.
- **Etykieta ostrzegawcza PV na budynku** (§712.514, rysunek 712.514.101) — treść informacyjna/checklist, nie kalkulator; kandydat do ekranu montażowego (wzorzec E).

### Moduł 3 — Instalacja PV (pełne wyliczenie pozostałych pozycji, 25.09.2026)

[25.09.2026] ✅ DODANO — źródło: pełne wyliczenie M3 (`docs/rejestr-pokrycia.md`, sekcja "Moduł 3 — pełne wyliczenie pozostałych pozycji źródła").
- **Ekran 9 — Optymalizator „Złotego Środka”** (2.17) — ⚠️ blocked częściowo: krzywa naporu wiatru w funkcji kąta wymaga PN-EN 1991-1-4 (brak w repo), źródło nie podaje wag łączenia trzech kryteriów. Krzywe produkcji (silnik M1) i śniegu (PN-EN 1991-1-3, `μ1(α)`) są liczalne. Czeka na decyzję właściciela projektu. **[25.09.2026] ✅ ODBLOKOWANE → done** (D27 + PN-EN 1991-1-4); w backlogu zostaje tylko balast projektowy — czeka na PN-EN 1990 (`docs/normy-brakujace.md`).
- **Ekran 10 — Konstrukcja wsporcza (BOM)** (2.18) — ⚠️ blocked: wymaga mechanizmu BOM (§13.1) i bazy komponentów; źródło nie daje wzoru długości/liczby elementów konstrukcji.
- **Ekran 19 — Degradacja paneli w czasie** (2.34) — ⚠️ blocked (decyzja właściciela projektu 25.09.2026): brak modelu łączonej degradacji LID/LETID/PID i tempa degradacji w źródle.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — ekstrakcja z `docs/rejestr-pokrycia.md` i `docs/lista-do-zrobienia.md`. Wersja 1.0. |
| 05.09.2026 | **Wynik audytu GOD BOOK Część N** (nie rutynowa integracja): skonsolidowano 4 pozycje z własnej sekcji "Znane luki do domknięcia" źródła (`Tresc_WSZYSTKIE_MODULY_scalone.md`), nigdzie dotąd nieodnotowane w tym pliku ani w `docs/rejestr-pokrycia.md`/`mapa-wdrozenia.md` — Moduł 6 Część 2A/2C/2D (alternatywne źródła ciepła, silnik czynników COP, silnik czynników zapotrzebowania) i Asystent głosowy (12.41, poza wzorcami A-H). Wersja 1.0→1.1. |
| 05.09.2026 | **Wynik drugiego przejścia audytu Część N** (13 agentów równoległych, moduł po module): skorygowano błąd merytoryczny we wpisie Moduł 6/2C wyżej (COP błędnie przypisany do Części 2C); dodano wpis 5.42 (kolektor gruntowy, sprawdzone i odrzucone, dotąd tylko w `docs/memory.md`) do sekcji Blocked; doprecyzowano Moduł 5 — tylko Ekran 1 realnie zablokowany normą, 27/29 pozostałych ekranów niezależnych; dopisano warunek powrotu do A2/A5 (Moduł 11). Wersja 1.1→1.2. |
| 07.09.2026 | **Wynik audytu GOD BOOK Część N (na żądanie właściciela projektu)**: plik nie był aktualizowany od 05.09.2026 mimo znaczącej pracy w międzyczasie. Poprawiono: wpis M5/Ekran 1 (zbudowany 06.09.2026, nie jest już blocked; skorygowana nazwa normy PN-IEC→PN-HD 60364-5-52), wpis M11/B5 (przeniesiony z `⚠️ Blocked` do zwykłego `todo` — odblokowany źródłowo tego samego dnia). Dodano nową sekcję M3 z pięcioma pozycjami świadomie poza zakresem dzisiejszej korekty `ochrona-stringow` wg HD 60364-7-712 (dioda blokująca, alternatywa kablowa, tabele SPD, RCD typu B, etykieta PV) — dotąd tylko w `docs/memory.md`/kodzie, nigdzie skonsolidowane. Wersja 1.2→1.3. |
| 25.09.2026 | Dodano sekcję M3 (E9 częściowo, E10, E19 — blocked) z pełnego wyliczenia pozostałych pozycji M3. Wersja 1.3→1.4. |
| 28.09.2026 | Dodano pozycję „FREE/PRO dla M14” (D37) — integracja rozdziału M14 do Biblii. |
| 28.09.2026 | **Wynik audytu końcowego N.3:** dodano pozycję „Preset onboardingu »Jestem podłączony do sieci«” (D39), dotąd poza backlogiem (N.1 pkt 2). Nagłówek zsynchronizowany: 1.4→1.5, data 28.09.2026. |
| 28.09.2026 | Dodano pozycję „Rozdział »Oświetlenie LED« — kandydat poza Biblią” (D49, decyzja właściciela z audytu N.3). Wersja 1.5→1.6. |
| 02.10.2026 | Dodano pozycję „Głęboka elektryka AC → osobna apka Elektryk Pro” (D70). Wersja 1.6→1.7. |
