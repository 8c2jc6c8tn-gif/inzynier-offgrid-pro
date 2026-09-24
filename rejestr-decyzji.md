# Rejestr decyzji — Inżynier Offgrid Pro

**Wersja:** 1.3 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 24.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/memory.md`, `USTALENIA.md` (historyczny, Część II)

TL;DR: D1, D2, D3… — decyzje **strategiczne/fundamentalne** (blokujące wiele innych rzeczy naraz, Krok 4 GOD BOOK), ponumerowane, nigdy nie kasowane, tylko unieważniane jawnie (F.5). **Nie duplikuje `docs/memory.md`**: tam żyje pełna, szczegółowa historia każdej sesji (setki drobnych decyzji implementacyjnych per ekran) — tu tylko decyzje, które zmieniły kierunek/regułę obowiązującą cały projekt. Gdy wpis niżej odsyła do `docs/memory.md`, tam jest pełne uzasadnienie i przykłady.

**Rozróżnienie od `docs/memory.md`:** ten rejestr = decyzje na poziomie "co obowiązuje odtąd w całym projekcie" (F.6: koszt cofnięcia zwykle średni/drogi). `docs/memory.md` = "co się wydarzyło w tej sesji, jaka lekcja" — każda pojedyncza implementacja ekranu, każdy znaleziony błąd. Jeśli szukasz konkretnego uzasadnienia formuły jednego ekranu — idź do `docs/memory.md` albo `docs/rejestr-pokrycia.md`, nie tutaj.

---

## Decyzje

**D1 (28.08.2026) — Rozdział 7 (Tryb Live) = 33 funkcje, nie 50 czy 3.** Koszt cofnięcia: średni (wpływa na metryczkę i rejestr pokrycia). Pierwotnie 50 (błąd "3" w scaleniu odrzucony), skorygowane 29.08.2026 programistycznie na 33 (numeracja 7.9–7.25 nie istnieje w źródle). Pełne uzasadnienie: `USTALENIA.md` D-1 (historyczny), `docs/memory.md`.

**D2 (28.08.2026) — Podział FREE/PRO.** Koszt cofnięcia: drogi (wpływa na architekturę uprawnień). FREE: 1 projekt, tryb prosty, kalkulatory awaryjne (Moduł 12). PRO: wiele projektów, Tryb Inżyniera, stress-test zimowy, tryb Live, eksport, AI. Pełne: `USTALENIA.md` D-2 (historyczny).

**D3 (28.08.2026) — Etap 1 (szkielet architektury) wstrzymany.** Koszt cofnięcia: tani (to pauza, nie decyzja architektoniczna). Autor projektował szkielet osobno.

**D4 (29.08.2026) — D-01 zamknięty: kanoniczna wersja Biblii źródłowej v2.0 (Architektura Modułowa), 579 funkcji (nie 540), zweryfikowane programistycznie z `Tresc_WSZYSTKIE_MODULY_scalone.md`, nie z deklaratywnej metryczki dokumentu.** Koszt cofnięcia: drogi (podstawa całego rejestru pokrycia). **UNIEWAŻNIA częściowo D1** w sensie: ta sama metoda weryfikacji (przeliczenie, nie metryczka) zastosowana też do Rozdziału 7.

**D5 (29.08.2026) — Etap 1 wznowiony, kod startuje.** Koszt cofnięcia: drogi (odblokowuje całą resztę pracy). Pauza z D3 zakończona, decyzja autora.

**D6 (29.08.2026) — Kolejność budowy: fundament → Moduł 1 → 2 → … → 13, czysta kolejność zależności danych.** Koszt cofnięcia: tani (to kolejność pracy, nie architektura). Pełna lista: `mapa-wdrozenia.md`.

**D7 (30.08.2026) — Roadmapa przepisana z numeracji "Rozdział" na "Moduł/Kafel" (pulpit adaptacyjny, 13+1 kafli).** Koszt cofnięcia: średni (dotyka nazewnictwa w wielu plikach). Mapowanie: `docs/pulpit-i-nawigacja.md` §2.

**D8 (30.08.2026) — Porzucono wyciąganie Modułu 12 do przodu "na wczesne demo".** Koszt cofnięcia: tani. Wraca do czystej kolejności zależności (D6).

**D9 (30.08.2026) — Kafel 14 (Ustawienia) dostaje własny, jawny punkt w planie budowy**, zamiast być domyślnie wliczonym w szkielet.

**D10 (29.08.2026) — Standard `docs/standards/` (17 rozdziałów) zaadaptowany z `new-app-standards`, integracja z GOD BOOK jako fundament poprzedzający.** Koszt cofnięcia: drogi (dotyczy całej rodziny aplikacji, nie tylko tego projektu). Pełne: `docs/memory.md`, sekcja na początku pliku.

**D11 (03.09.2026) — `docs/domena/` przemianowany na `docs/zrodla/`**, ujednolicenie nazewnictwa z GOD BOOK Część B.5. Koszt cofnięcia: tani (mechaniczna zmiana nazwy, 79 odwołań zaktualizowanych jednym commitem).

**D12 (2026-09-04, w toku sesji) — Wzorzec "echo": gdy dwa ekrany potrzebują tego samego wzoru, wzór ekstrahowany do jednej, eksportowanej funkcji, drugi ekran ją importuje, zamiast duplikować logikę.** Koszt cofnięcia: tani, ale wysoka wartość (`docs/standards/01-architektura.md` §1.3). Zastosowane w praktyce ≥4 razy: Pre-Charge (M4/M11), prąd zwarciowy (dobor-bezpiecznika-dc → detekcja-zwarcia-efuse), pojemność użyteczna (dobor-pojemnosci → dni-autonomii), koszt/kWh (oplacalnosc-magazynu → vehicle-to-home).

**D13 (2026-09-04) — Konwencja statusu: tylko ostrzeżenia poziomu `warning`/`critical` podnoszą status na `VALID_WITH_WARNINGS`; same ostrzeżenia `info` zostawiają status `VALID`.** Koszt cofnięcia: średni (dotyka każdego kalkulatora z ostrzeżeniami info-level, wielu ekranów). Znaleziona i naprawiona jako błąd we wcześniejszych ekranach (`oplacalnosc-magazynu`), potem stosowana konsekwentnie jako reguła. Pełne: `docs/memory.md`.

**D14 (2026-09-04) — Konwencja UI werdyktu: kolor (🟢/🟡/🔴) liczony z poziomów `result.warnings` (`hasCritical`/`hasWarning`), nie bezpośrednio z dwuwartościowego `Status` enum.** Koszt cofnięcia: średni. Bez tego `VALID_WITH_WARNINGS` nie rozróżnia krytycznego twardego stopu od zwykłego ostrzeżenia. Wzorzec ustalony w `dobor-bezpiecznika-dc` (M4/E24), stosowany od tego momentu we wszystkich ekranach z twardym stopem.

**D15 (2026-09-04) — Konwencja `number | null` dla pól, gdzie `0` jest legalną, realną wartością** (temperatury, SoC, nadwyżka PV), w odróżnieniu od zwykłej konwencji "`0` = jeszcze nie wpisano" dla pól zawsze dodatnich. Koszt cofnięcia: tani (lokalne dla typu inputu). Ustalone przy `chlodzenie-latem` (M4), stosowane konsekwentnie dalej (`profil-astronomiczny`, `load-shedding`, `modul-ev`, `stress-test-mppt`).

**D16 (2026-09-04) — Zasada "nie zgaduj wewnątrz podanego zakresu": gdy źródło podaje tylko zakres (np. "-0,3 do -0,45%/°C", "25-30°C") bez pojedynczej wartości, pole wymaga ręcznego wpisania z podpowiedzią o zakresie — nigdy nie przyjmujemy środka/granicy zakresu jako cichego domyślnego.** Koszt cofnięcia: tani, ale fundamentalne dla wiarygodności wyników. Zastosowane konsekwentnie: ΔT w `bojler-cwu`, γ w `wplyw-temperatury`, β w `stress-test-mppt`, Vmp w `niedopasowanie-paneli`.

**D17 (2026-09-04) — Moduł 4 i Moduł 2 uznane za "wyczerpane" po osiągnięciu odpowiednio 29/34 i 13/17 — reszta pozycji sprawdzona i odrzucona jako niebuildowalna bez wymyślania danych (baza komponentów, brakująca norma/wzór, dane historyczne niedostępne).** Decyzja o przejściu do pojedynczych ekranów Modułu 3 (nie pełnego wyliczenia per-funkcja) podjęta przez AI z potwierdzeniem właściciela projektu (moduł 2→4 przejście: pytanie wprost; moduł 4→3: kontynuacja bez pytania, w duchu "dawaj dalej"). Pełna lista blocked: `backlog-poza-v1.md`.

**D18 (2026-09-04) — Ekspertyza domenowa formalnie zadeklarowana** (elektryk/inżynier off-grid PV, senior/20 lat) — merytorycznie stosowana od początku sesji, deklaracja dopisana po pytaniu właściciela projektu, czy GOD BOOK §0.2 jest przestrzegane. Naprawa dryfu (Część Y.2 GOD BOOK), nie nowa decyzja treściowa. Pełne: `docs/memory.md` c.d. 67, `ZASADY_APLIKACJI.md` §0.1 (historyczny, treść zachowana).

**D19 (04.09.2026) — Migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md` do kanonicznego formatu GOD BOOK (`00_Biblia.md` i pozostałe dokumenty Części S).** Koszt cofnięcia: średni (zmiana struktury plików, nie treści — wszystko zmapowane, nic nie usunięte). Decyzja właściciela projektu, wcześniej otwarta w `docs/lista-do-zrobienia.md` jako "czeka na właściciela" (patrz D17 tego rejestru — ta sama sesja). Stare pliki zostają, oznaczone jako historyczne (Część D GOD BOOK — nic nie usuwamy).

**D20 (07.09.2026) — Wzorzec "echo" (D12) wymaga wspólnego uzasadnienia fizycznego/normatywnego, nie tylko wspólnej wartości liczbowej — doprecyzowanie, nie unieważnienie D12.** Koszt cofnięcia: tani, ale wysoka wartość zapobiegawcza (dotyczy każdego przyszłego echo w projekcie). Znalezione przy audycie GOD BOOK Część N: `ochrona-stringow` (M3/E22) i `dobor-bezpiecznika-rozlacznika` (M5/E6) dzieliły funkcję `obliczPradBezpiecznikaA` przez ~2 dni, bo obie mnożyły przez współczynnik 1,25 — ale to były dwa niezależne prawa (margines Isc_STC→Isc_max wg Załącznika B.2 normy HD 60364-7-712 vs. ogólny margines doboru bezpiecznika obwodu), które tylko przypadkiem miały tę samą wartość. Gdy norma poprawiła pierwszy wzór (przedział `[1,1×I_SC_MAX, I_MOD_MAX_OCPR]` zamiast stałej `1,25×Isc`), echo trzeba było rozdzielić — M5/E6 dostał lokalną kopię formuły. Decyzja właściciela projektu, na wyraźną prośbę. Pełne: `docs/memory.md` (2026-09-07), `dlug-techniczny.md` TD13, `kontrakty-rdzenia.md` §4.

**D21 (23.09.2026) — Cykl sprawdzania Y.6 (`AKTUALIZACJE.md` w `new-app-standards`) w tym projekcie obniżony do ≤12h, świadome lokalne odstępstwo od domyślnego GOD BOOK Y.6 (≤3h od wersji 2.18).** Koszt cofnięcia: tani (jedna linia w `CLAUDE.md`, bez wpływu na kod). Na wyraźne polecenie właściciela projektu. **Nie jest to zmiana samego standardu** — `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md` i `PROMPT_STARTOWY.md` (kategoria NIETYKALNE, mirror `new-app-standards`) nadal poprawnie mówią ≤3h i celowo nie zostały lokalnie zmienione (kolejna synchronizacja Y.6 i tak by je nadpisała z powrotem — lokalna edycja byłaby myląca, nie trwała). Realny powód praktyczny zaobserwowany kilka dni wcześniej: dwa kolejne sprawdzenia Y.6 w odstępie ~2 minut (20.09.2026) obie nie znalazły niczego nowego — cykl 3h przy wolno zmieniającym się `new-app-standards` generuje dużo zerowych sprawdzeń. Pełne: `docs/memory.md`. **Zastąpione przez D22 (24.09.2026) — patrz niżej.**

**D22 (24.09.2026) — Cykl Y.6 zastąpiony formułą adaptacyjną (start 12h, ×1,5 do pułapu 48h po zerowym sprawdzeniu, reset do 12h po realnej zmianie); D21 (sztywne ≤12h) uchylone.** Koszt cofnięcia: tani (formuła w `CLAUDE.md` + logika Routine, bez wpływu na kod aplikacji). Na wyraźne polecenie właściciela projektu (skonfiguruj Y.6 z cyklem adaptacyjnym 12h→48h). **Kluczowa różnica względem D21: to już NIE jest lokalne odstępstwo od standardu.** Przy tym samym sprawdzeniu Y.6 (24.09.2026) okazało się, że `new-app-standards` niezależnie wprowadził dokładnie tę samą formułę jako nowy **domyślny** mechanizm GOD BOOK Y.6/U.4 (wersja 2.32, wiersz `AKTUALIZACJE.md` z 24.09.2026 — "Y.6/U.4 cykl adaptacyjny... zamyka retroaktywnie D21 inzynier-offgrid-pro"). Od D22 ten projekt jest więc zgodny z bieżącym standardem, nie odstaje od niego — `interwał_h` i licznik zerowych sprawdzeń żyją w `docs/memory.md` (sekcja "Synchronizacja ze standardem"), nie w tym pliku. Realizacja: samo-przeplanowująca się Routine (`create_trigger`/`update_trigger`, self-bind), `run_once_at` przeliczany po każdym odpaleniu. Pełne: `docs/memory.md` (24.09.2026, sprawdzenie Y.6 v2.21→v2.37).

---

## Założenia robocze (F.7 GOD BOOK)

**Z1 (04.09.2026) — przyjęto:** ID modułów (H.2 GOD BOOK, M#) odpowiadają wprost numeracji "Moduł N" już używanej w całym projekcie (1–13), nie nowej, niezależnej numeracji. **Powód:** ta numeracja jest już stabilna, używana w kodzie, dokumentacji i UI od 29.08.2026 — wprowadzenie równoległej numeracji M# byłoby duplikatem, nie nowym bytem. **Na czym się opiera:** cała struktura `docs/rejestr-pokrycia.md`, `lib/pulpit/registry.ts`, `docs/pulpit-i-nawigacja.md`.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — D1–D19 zrekonstruowane z `USTALENIA.md` Część II, dziennika zmian `ZASADY_APLIKACJI.md`, oraz decyzji strategicznych z `docs/memory.md`. Z1 dodane. Wersja 1.0. |
| 07.09.2026 | Dodano D20 (echo wymaga wspólnego uzasadnienia, nie tylko wspólnej wartości) — na wyraźną prośbę właściciela projektu, po audycie GOD BOOK Część N. Wersja 1.0→1.1. |
| 23.09.2026 | Dodano D21 (cykl Y.6 obniżony lokalnie do ≤12h, GOD BOOK/PROMPT_STARTOWY.md bez zmian) — na wyraźne polecenie właściciela projektu. Wersja 1.1→1.2. |
| 24.09.2026 | Dodano D22 (cykl Y.6 zastąpiony formułą adaptacyjną 12h→48h, zgodną z nowym domyślnym GOD BOOK Y.6/U.4 v2.32 — D21 uchylone, to już nie lokalne odstępstwo). Wersja 1.2→1.3. |
