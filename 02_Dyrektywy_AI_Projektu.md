# 02. Dyrektywy AI Projektu — Inżynier Offgrid Pro

**Wersja:** 1.1 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 05.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `CLAUDE.md`

TL;DR: Twarde reguły zachowania AI specyficzne dla domeny off-grid PV i dla historii tego konkretnego projektu — nie formatowanie (to `01_Zasady_Pracy_i_Konwencje.md`), tylko *co robić/czego nie robić* wynikające z natury tej domeny albo z powtarzających się błędów wykrytych w tej sesji. Rośnie w miarę jak projekt odkrywa nowe sytuacje ryzykowne (P.3 GOD BOOK).

---

## Dyrektywy bezpieczeństwa domenowego (nienaruszalne)

**#1 — Nigdy nie zgaduj brakującego współczynnika, normy ani progu bezpieczeństwa.** Gdy źródło podaje tylko przykład ilustracyjny albo zakres bez pojedynczej wartości (np. "-0,3 do -0,45%/°C", "10-15% różnicy"), pole wymaga **ręcznego wpisania przez użytkownika** z podpowiedzią o zakresie — nigdy nie przyjmuj środka/granicy jako cichego domyślnego. Jeśli formuła wymaga danych, których źródło w ogóle nie podaje (tabela normatywna PN-IEC, krzywa SoH, prognoza pogody) — ekran zostaje `⚠️ blocked`, nie buduj go z wymyśloną zależnością. (`rejestr-decyzji.md` D16, `zlote-zasady.md`)

**#2 — Zawsze rozróżniaj uniwersalną fizykę od współczynnika projektowego.** Prawo Ohma, ciepło właściwe wody, rezystywność miedzi, równanie Magnusa-Tetensa, deklinacja Słońca (Cooper) — wolno implementować, nawet gdy źródło nie podaje wzoru wprost, bo to fundamentalna, sprawdzalna fizyka bez wolnego parametru. Współczynnik z zakresu, wybór projektowy, norma bezpieczeństwa — nigdy nie wolno, dopóki źródło nie poda konkretnej liczby.

**#3 — Każdy krytyczny wzór (przekrój kabla, Voc max przy mrozie, bezpiecznik AIC, pojemność baterii, moc falownika) weryfikuj niezależnie w Pythonie PRZED implementacją**, potem pokryj testem z tą samą wartością referencyjną. Rozbieżność = nie commituj, dopóki nie wyjaśnisz przyczyny.

**#4 — Twardy stop (🔴, `docs/rejestr-twardych-stopow.md`) w UI licz z poziomów `warnings` (`hasCritical`), nigdy bezpośrednio z dwuwartościowego `Status` enum.** `VALID_WITH_WARNINGS` nie rozróżnia sam z siebie żółtego ostrzeżenia od czerwonego twardego stopu.

**#5 — Sprzeczność fizyczną we własnym przykładzie źródła wyłapuj i dokumentuj jawnie w kodzie i `docs/memory.md`, nigdy nie kopiuj jej ślepo ani nie "cichcem popraw" bez adnotacji.** Precedens: `ochrona-wilgoc` (M4/E10) — przykład źródła fizycznie niespójny, silnik liczy poprawną zależność, rozbieżność opisana w komentarzu.

## Dyrektywy procesowe (z powtarzających się błędów tej sesji)

**#6 — Info-level ostrzeżenie nigdy nie podnosi statusu na `VALID_WITH_WARNINGS`.** Tylko `warning`/`critical`. Błąd popełniony i naprawiony w `oplacalnosc-magazynu` (M4/E23) — stąd dyrektywa, żeby się nie powtórzył piąty raz.

**#7 — Cudzysłowy w treści polskiej w JSX: typograficzne („…”), nigdy proste `"…"`.** ESLint `react/no-unescaped-entities` łapie to niekonsekwentnie — sprawdzaj wzrokiem otwierający `„` (U+201E) i zamykający `"` (U+201D).

**#8 — Wzorzec "echo": zanim napiszesz drugi kalkulator z tym samym wzorem co istniejący, wyekstrahuj wzór z pierwszego do osobnej, eksportowanej funkcji i zaimportuj — nie duplikuj.** Sprawdź istniejące `lib/core/modules/**/calculator.ts` pod kątem tej samej struktury wzoru, zanim napiszesz nowy od zera.

**#9 — Po `mcp__github__merge_pull_request` (squash) zawsze `git fetch origin main && git merge origin/main` przed kolejnym commitem** — origin/main squash commit nie ma wspólnej historii z lokalną gałęzią, prosty `git pull` nie wystarczy.

**#10 — `CalcResult.inputs` jest typowany `Record<string, number>` — pola nienumeryczne (string, boolean) pomiń w `inputs`, nie próbuj ich tam wcisnąć.**

## Dyrektywy dotyczące integralności dokumentacji

**#11 — Nigdy nie usuwaj ani nie nadpisuj cicho istniejącej treści w `docs/memory.md`, `docs/rejestr-pokrycia.md`, `rejestr-decyzji.md`.** Nowe wpisy zawsze na końcu, z datą. Nieaktualne — adnotacja, nie kasacja.

**#12 — Po większej zmianie (nowy ekran, refaktor współdzielony) zaktualizuj `docs/rejestr-pokrycia.md`, `docs/lista-do-zrobienia.md` i dopisz wpis w `docs/memory.md` w tym samym zestawie zmian — nie odkładaj na później.**

**#13 — Nie rozstrzygaj samodzielnie sprzeczności między dwoma źródłami danych (np. Sekcja B kontra Sekcja C tego samego ekranu, jeśli dają różne liczby) — zaimplementuj dokładny wzór z Sekcji z formułą, udokumentuj rozbieżność, nie próbuj jej "pogodzić" przez wymyślenie łączącej zależności.** Precedens: `niedopasowanie-paneli` (M3/E17) — 1,4% z wzoru vs 18% z narracji, oba zostawione jako osobne fakty.

**#14 — Rejestruj natychmiast, nie w seriach. Przy pracy nad ekranem/funkcją X sprawdź w tym samym kroku wszystkie SĄSIADUJĄCE pozycje tego samego fragmentu źródła (te same sekcje/podsekcje, ten sam klaster w Biblii) i nadaj każdej wiersz w `docs/rejestr-pokrycia.md` — `done`, `todo` albo `⚠️ blocked` — zanim przejdziesz dalej.** Brak wiersza to nie to samo co `todo`: `todo` jest widoczne i policzalne, brak wiersza jest niewidoczny i wygląda jak "sprawdzone" dopóki nikt nie porówna źródła linia po linii. Analogicznie: gdy kod świadomie skraca specyfikację (buduje tylko część ekranu), wpis `🔎 TD#` w `dlug-techniczny.md` + marker w kodzie piszesz **od razu przy pisaniu tego kodu**, nie przy najbliższym audycie. Preferuj małe partie w pełni dopieszczone (jedna funkcja: kod + testy + wiersz w rejestrze + ewentualny TD# w jednym kroku) nad dużymi seriami budowanymi szybko z zamiarem "uzupełnić rejestr później" — szukanie błędów po fakcie jest droższe niż ich niedopuszczenie.

**Precedens (dlaczego ta dyrektywa istnieje):** luka 1.19 (2026-08-29, Moduł 2) była pierwszym przypadkiem tego błędu. Mimo dyrektywy #12 ("zaktualizuj rejestr w tym samym zestawie zmian") ten sam wzorzec powtórzył się w kolejnych czterech modułach — 2.15 (Moduł 3, PID), 5.46 i 5.31 (Moduł 6), 8.8 (Moduł 12), 7.7 (Moduł 13) — zanim dedykowany audyt GOD BOOK Część N (05.09.2026, 13 agentów równoległych, moduł po module) to złapał. #12 mówiła "zaktualizuj po zmianie" — nie mówiła wprost "sprawdź też sąsiadów w źródle, nie tylko to co właśnie budujesz". Ta dyrektywa domyka tę lukę.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — dyrektywy #1–#13 zrekonstruowane z `CLAUDE.md`, `docs/memory.md` (pułapki i lekcje) i historii tej sesji. Wersja 1.0. |
| 05.09.2026 | Dodano **#14** ("rejestruj natychmiast, nie w seriach") — na wyraźne polecenie właściciela projektu po audycie GOD BOOK Część N (13 agentów, pełne przejście modułów), który znalazł tę samą klasę błędu (gotowa treść źródłowa nigdzie niezarejestrowana) w 5 modułach, nie tylko w Module 2 gdzie została po raz pierwszy znaleziona i "naprawiona". Wersja 1.0→1.1. |
