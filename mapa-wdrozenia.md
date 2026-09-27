# Mapa wdrożenia — Inżynier Offgrid Pro

**Wersja:** 1.4 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 26.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `zlote-zasady.md` (Zasada 14 — kolejność budowy)

TL;DR: Status opisany/zaimplementowany/przetestowany per moduł (M1–M13, Część T.2 GOD BOOK) — status *kodu*, w odróżnieniu od statusu *opisu* w `docs/zrodla/` (które jest kompletne dla wszystkich 13 modułów od 29.08.2026). Budowana z `docs/rejestr-pokrycia.md`, aktualizowana przy każdej sesji implementacyjnej, nie tylko przy audycie.

**Rubryka gotowości (Część T.1 GOD BOOK, ustalona raz):** % ekranów danego modułu ze statusem `done` w `docs/rejestr-pokrycia.md` względem wszystkich zidentyfikowanych ekranów tego modułu (nie względem 579 funkcji łącznie — wiele funkcji źródła scala się w jeden ekran, patrz `docs/rejestr-pokrycia.md`, sekcja "Funkcje przeniesione"). Kryteria per ekran: ma Cel (nagłówek+opis) · ma Wejście/Wyjście (`input.ts`/`CalcResult`) · ma walidację · ma przykład przeliczony (test z wartością referencyjną) · ma sprawdzone odsyłacze (formuła 1:1 ze źródła albo jawnie udokumentowane odstępstwo) · ma jednoznaczny status (`done`/`⚠️ blocked`/`todo`).

---

## Tabela

| Moduł (ID) | Nazwa | Opisany w źródle | Zaimplementowany | Przetestowany | Gotowość |
|---|---|---|---|---|---|
| M1 | Lokalizacja i teren | ✅ | ✅ (1 ekran, infrastrukturalny) | — (brak logiki do testowania) | Fundament gotowy, reszta ekranów `todo` **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 4/4 `done` (100%; Analiza zacienienia częściowo — TD18/TD19). |
| M2 | Zapotrzebowanie energetyczne | ✅ | ✅ (13/17 ekranów) | ✅ | ~76% — reszta (Ekrany 3/10/14/15, wampiry) `todo` (nie `blocked` — sprawdzone i nieoceniane, nie sprawdzone-i-odrzucone, patrz `backlog-poza-v1.md`) **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 18/18 `done` (100%; E5 i E8 częściowo). "13/17" wyżej — sprzed dobudowania E16–E18 i wampirów. |
| M3 | Instalacja PV | ✅ | 🔄 (12/~27 ekranów) | ✅ | ~44% — rozpoczęte 04.09.2026, w toku **[25.09.2026] KOREKTA (przeliczone z `docs/rejestr-pokrycia.md`, sekcja "Moduł 3 — pełne wyliczenie"):** 12/27 ekranów numerowanych `done` (+ PID) ≈ 44%; 12 `todo`, 3 `⚠️ blocked` (E9 częściowo, E10, E19), INFRA-1 `todo`, INFRA-2 `in-progress`. Wartość "12/~27" wyżej pochodziła sprzed pełnego wyliczenia. **[25.09.2026, po partii 1]:** 18/27 `done` (+ PID) ≈ 67% — dodane E7, E12, E15, E21, E23, E25. **[25.09.2026, po E1]:** 19/27 `done` ≈ 70%. **[25.09.2026, po E20]:** 20/27 `done` ≈ 74%. **[25.09.2026, po E9]:** 21/27 `done` ≈ 78%. **[25.09.2026, po E4]:** 22/27 `done` ≈ 81%. **[25.09.2026, po E3]:** 23/27 `done` ≈ 85%. **[25.09.2026, po E2]:** 24/27 `done` ≈ 89%. **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 24/27 `done` (89%) + PID poza numeracją; E9 częściowo; zostają E10 i E19 `⚠️ blocked`, E27 `todo`. Kolumna statusu 11 wierszy z 25.09 poprawiona (była `todo` przy „→ done” w notatce). |
| M4 | Magazyn energii / baterie | ✅ | ✅ (29/34 ekranów) | ✅ | ~85% — tylko Ekran 25 (szyny zbiorcze) faktycznie `⚠️ blocked`; Ekrany 3/31/32/33 to `todo` (cross-modułowe/nieocenione, nie sprawdzone-i-odrzucone) **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 34/34 `done` (100%; E14 częściowo). E25 odblokowany i zbudowany po 04.09; "29/34" wyżej nieaktualne. |
| M5 | Okablowanie i zabezpieczenia | ✅ | 🔄 (4/29 ekranów) | ✅ | ~14% — **[07.09.2026] Ekran 1 (mega-Doradca doboru kabla) już `done`** (norma PN-HD 60364-5-52 dostarczona i zweryfikowana 05-06.09.2026, silnik zaimplementowany 06.09.2026) — nie jest już blocked; pozostałe 25 ekranów mają samodzielne wzory niezależne od tej normy, buildowalne równolegle **[25.09.2026] KOREKTA:** od 20.09.2026 moduł w pełni skończony — **29/29 `done` (100%)** (`docs/rejestr-pokrycia.md`, sekcja M5; `docs/memory.md` "Moduł 5 (Okablowanie) domknięty"). "4/29" wyżej — nieaktualne od 07.09.2026. **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 29/29 `done` (100%; 5 częściowo — sekcje bez danych w źródle). |
| M6 | Ogrzewanie / pompa ciepła | ✅ | 🔄 (7/~46 ekranów) | ✅ | ~15% — rozpoczęte 04.09.2026 (COP + pompy cyrkulacyjne + bufor ciepła + ryzyko niskiego napięcia + kocioł elektryczny + infiltracja powietrza + wentylacja z odzyskiem), reszta w większości `todo`/blocked (auto z Modułu 1) **[25.09.2026]** +1 ekran: porównanie kosztów ogrzewania (5.39 + D28: nagrzewnica typu webasto, olej) — pełne przeliczenie M6 przy resynchronizacji mapy (`docs/lista-do-zrobienia.md`). **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 12/48 `done` (25%): Część 1 — 8/20 (E1, E3, E7, E12 częściowo; E2, E5, E14, E15), 2C — 4/26 (5.31, 5.39, 5.46, 5.63), 2A — ekran zbiorczy niezbudowany (z jego 5 funkcji tylko 5.33 jako osobny ekran), 2D — 0/1 (scalony silnik). Cel 48 = 20 + 1 + 26 + 1 wg podsumowania `Tresc_Modul_6` („ok. 28-29 + 22”). |
| M7 | Stress-test zimowy | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Fundament (Black Start) gotowy, spina M1–M6 — sensowny dopiero po nich **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 2/26 `done` (8%): E5 Black Start, E17 Wind Chill. **[27.09.2026]** 3/26: + E23 obciążenie dachu śniegiem (PN-EN 1991-1-3). 4/26: + E13 sztywnienie izolacji. |
| M8 | Bezpieczeństwo i sytuacje awaryjne | ✅ | 🔄 (3/~11 ekranów) | ✅ | Audyt pożarowy (dane demo) + UPS krytyczny (dobór sprzętowy, częściowy) + dogrzewanie paliwem stałym (3 twarde stopy) **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 3/11 `done` (27%): E2, E11 (dane demo), E6 częściowo (bez części AI). |
| M9 | Elektronika / ESP32 / sensoryka | ✅ | 🔄 (1 katalog reprezentatywny) | ✅ | Katalog czujników (21 typów, Wzorzec H) gotowy, reszta `todo` **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 1/10 (6 ekranów + 4 katalogi): Katalog 1 częściowo. |
| M10 | AI i prognozy | ✅ | 🔄 (1 ekran reprezentatywny, dane demonstracyjne) | ✅ | Czerpie z prawie wszystkiego wcześniejszego — naturalnie ostatni **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 1/12 (E1 prognozy, częściowo — dane demo); dawne 12.41 (asystent głosowy) `⚠️ blocked`. |
| M11 | Montaż baterii | ✅ | ✅ (21/22 ekranów) | ✅ | ~95% — **Ścieżka A kompletna (10/10)**, Ścieżka B 11/12 (B5 blocked, czeka na Moduł 5/Ekran 1) **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 22/22 `done` (100%) + A3b dodatkowy; B5 zbudowany po dostarczeniu normy ("21/22" wyżej nieaktualne). |
| M12 | Szybki kalkulator / tryb mobilny | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Tryb uproszczony gotowy, reszta `todo` **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 2/43 (5%): E1 tryb uproszczony + dawne 8.8 PWM vs MPPT (pozycja Biblii nieobecna w `Tresc_Modul_12`, stąd 42 + 1). **[27.09.2026]** +E32 (dni bez słońca) → 3/43; +E9 (dozownik LVD) → 4/43; E41 `⚠️ blocked` (obciążalność przewodów giętkich — brak normy). +E27 (urządzenie 12 V wprost) → 5/43; +E39 (panel → stacja zasilania) → 6/43; +E11 (zużycie per urządzenie, częściowo) → 7/43; +E30 (gniazdo zapalniczki) → 8/43; +E42 (odsyłacz ratowania) → 9/43; +E22 (kamper — checklista) → 10/43; +E36 (garaż — checklista) → 11/43; +E2 (kabel i bezpiecznik, częściowo) → 12/43; +E15 (kamper, częściowo) → 13/43; |
| M13 | Tryb Live | ✅ | 🔄 (1 ekran — brama bez telemetrii) | — (brak logiki domenowej) | Świadomie minimalny — sensowny dopiero, gdy reszta systemu ma dane na żywo do pokazania **[26.09.2026] PRZELICZONE z `docs/rejestr-pokrycia.md` (ekrany docelowe wg `Tresc_*`):** 1/2 ekranów: E1 (brama) `done`; E2 (biblioteka widżetów, ~28 widżetów własnych) 0 — czeka na telemetrię. |

**Łącznie [26.09.2026, przeliczone]:** **153 z 314 ekranów docelowych `done`** (w tym częściowo; + 3 ekrany dodatkowe poza numeracją źródła: PID, A3b, kocioł elektryczny) — 163 wiersze `done` w `docs/rejestr-pokrycia.md` minus 7 duplikatów (wzorce M4 ×3 i M5, Black Start w M7, Katalog 1 w M9, A7 w M11). Metryka zmieniona na ekrany (wcześniej wiersze rejestru), żeby liczba nie rosła od duplikatów. Moduły domknięte w 100%: M1, M2, M4, M5, M11.

**Łącznie (stan 07.09.2026):** 101 pozycji ze statusem `done` w `docs/rejestr-pokrycia.md` (stan na 07.09.2026, zweryfikowane przeliczeniem, nie z metryczki — poprzednia wartość 92 była z 04.09.2026), rozłożone głównie na M2/M3/M4/M11.

## Uwagi do interpretacji

- "Opisany w źródle" = ✅ dla wszystkich 13 modułów od 29.08.2026 (treść źródłowa kompletna, `docs/zrodla/`) — to NIE znaczy "zaimplementowany".
- M1, M13: brak logiki domenowej do testowania to świadoma cecha tych konkretnych ekranów (bramka informacyjna / zapis profilu), nie luka w procesie testowania.
- Blocked ≠ zapomniane: każda pozycja `⚠️ blocked` ma jawne uzasadnienie w `docs/rejestr-pokrycia.md` i/lub `backlog-poza-v1.md` — sprawdzone i odrzucone jako niebuildowalne bez wymyślania danych (Dyrektywa #1, `02_Dyrektywy_AI_Projektu.md`), nie pominięte przez przeoczenie.
- Kolejność budowy modułów: `zlote-zasady.md` Zasada 14 (fundament → dziedzina → nadbudowa, D6 `rejestr-decyzji.md`) — w praktyce kolejność faktycznej pracy odbiegła od czystej sekwencji 1→13 (M4/M11/M2/M3 budowane równolegle/naprzemiennie, w miarę jak kolejne moduły "wyczerpywały się" z buildowalnych ekranów) — to nie odstępstwo wymagające korekty, tylko naturalny efekt reguły "buduj to, co da się policzyć bez wymyślania danych, w kolejności odkrywania".

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — zbudowana z `docs/rejestr-pokrycia.md` (stan na 04.09.2026, 80 ekranów `done`). Wersja 1.0. |
| 04.09.2026 | M3: dodano Ekran 13 (zacienienie/diody bocznikujące, częściowy — tylko poziom panelu) → 9/~27, 81 `done` łącznie. |
| 04.09.2026 | M3: dodano Ekran 14 (dopasowanie tablicy PV do falownika, częściowy — 4/6 kryteriów) → 10/~27, 82 `done` łącznie. |
| 04.09.2026 | M3: dodano Ekran 26 (straty na złączkach MC4) → 11/~27, 83 `done` łącznie. |
| 04.09.2026 | M3: dodano Ekran 16 (panele bifacjalne, częściowy — bez współczynnika bifacjalności) → 12/~27, 84 `done` łącznie. |
| 04.09.2026 | M6: dodano Ekran 15 (pompy cyrkulacyjne — dobór) → 2/~46, 85 `done` łącznie. Pierwszy nowy ekran M6 poza reprezentatywnym wzorcem D (COP). |
| 04.09.2026 | M6: dodano Ekran 14 (bufor ciepła — dobór pojemności) → 3/~46, 86 `done` łącznie. |
| 04.09.2026 | M6: dodano ekran dodatkowy (dawne 5.63, ryzyko wyłączenia pompy przy niskim napięciu) → 4/~46, 87 `done` łącznie. Nowy twardy stop dopisany do `docs/rejestr-twardych-stopow.md`. |
| 04.09.2026 | M6: dodano ekran dodatkowy (dawne 5.33, kocioł elektryczny vs pompa ciepła) → 5/~46, 88 `done` łącznie. |
| 04.09.2026 | M6: dodano Ekran 12 (infiltracja powietrza, częściowy — bez poprawy 8% po uszczelnieniu) → 6/~46, 89 `done` łącznie. |
| 04.09.2026 | M6: dodano Ekran 3 (wentylacja z odzyskiem ciepła, częściowy — tylko bilans podstawowy) → 7/~46, 90 `done` łącznie. |
| 04.09.2026 | M8: dodano Ekran 6 (UPS krytyczny — dobór sprzętowy, częściowy — bez zarządzania priorytetami AI) → 2/~11, 91 `done` łącznie. Pierwszy nowy ekran M8 poza reprezentantem (audyt pożarowy). |
| 04.09.2026 | M8: dodano Ekran 2 (bezpieczeństwo pożarowe — dogrzewanie paliwem stałym, 3 twarde stopy) → 3/~11, 92 `done` łącznie. |
| 05.09.2026 | **Wynik audytu GOD BOOK Część N** (13 agentów równoległych, moduł po module źródło↔rejestr): poprawiono niespójność terminologii `todo`/`⚠️ blocked` w wierszach M2 i M4 (tylko realnie zablokowane ekrany oznaczone `blocked`, reszta `todo`), poprawiono liczbę ekranów Modułu 5 z "~20" na 29 (zweryfikowane audytem względem własnej metryczki źródła) i dopisano potwierdzenie, że 27 z 29 ekranów M5 jest niezależnych od blokady Ekranu 1. Szczegóły wszystkich znalezisk audytu: `docs/memory.md`. |
| 07.09.2026 | **Wynik kolejnego audytu GOD BOOK Część N** (na żądanie właściciela projektu): dokument nie był aktualizowany od 05.09.2026 mimo znaczącej pracy w międzyczasie — M5/Ekran 1 zbudowany 06.09.2026 (norma PN-HD 60364-5-52 dostarczona), ale wiersz M5 wciąż opisywał go jako `⚠️ blocked`/"brak normy". Poprawiono wiersz M5 (3/29→4/29, ~10%→~14%) i łączną liczbę `done` (92→101, przeliczone bezpośrednio z `docs/rejestr-pokrycia.md`, nie z pamięci). Wersja 1.1→1.2. |
| 25.09.2026 | Korekta wierszy M3 (pełne wyliczenie pozostałych 17 pozycji źródła — Dyrektywa #14) i M5 (29/29 od 20.09.2026). **Pozostałe wiersze (M1, M2, M4, M6–M13) oraz licznik "Łącznie" nadal ze stanu 07.09.2026 — pełna resynchronizacja to osobne zadanie w `docs/lista-do-zrobienia.md`**, nie wykonane teraz (wymaga przeliczenia każdego modułu, nie tylko tych dwóch). Wersja 1.2→1.3. |
| 25.09.2026 | M3: partia 1 (E7, E12, E15, E21, E23, E25) → 18/27 `done`. |
| 25.09.2026 | M3: E1 (kąt i azymut + optimum miesięczne D26) → 19/27 `done`. |
| 25.09.2026 | M3: E20 (wschód-zachód) → 20/27 `done`. |
| 26.09.2026 | **Pełna resynchronizacja** (zadanie z `docs/lista-do-zrobienia.md`, 25.09): wszystkie wiersze M1–M13 i licznik przeliczone skryptem z `docs/rejestr-pokrycia.md` (kolumna statusu, przypisanie do modułu per sekcja, odjęte duplikaty), mianowniki z podsumowań `Tresc_*`. Przy okazji w rejestrze poprawiono kolumnę statusu 13 wierszy (11× M3 z 25.09, M6 E2/E7 z 26.09), gdzie notatka mówiła „→ done”, a kolumna nadal `todo`/`blocked`. Wersja 1.3→1.4. |
| 26.09.2026 | M6: E10 (optymalizacja izolacji) → Część 1 9/20, M6 13/48; łącznie 154/314. |
| 26.09.2026 | M6: E8 (pojemność cieplna, częściowo — decyzja właściciela: cała masa + ostrzeżenie) → Część 1 10/20, M6 14/48; łącznie 155/314. E11 odłożony (progi 🔴 od właściciela). |
| 27.09.2026 | M12: E32 (ile dni pracy bez słońca, echo M4/E1) → 3/43; łącznie 156/314. E41 sprawdzony przy starcie budowy → `⚠️ blocked` (brak normy dla przewodów giętkich). |
| 27.09.2026 | M12: E9 (ochrona przed rozładowaniem — dozownik LVD, 🔴 dla kwasowego/AGM) → 4/43; łącznie 157/314. |
| 27.09.2026 | M12: E27 (czy mogę podłączyć urządzenie 12 V bezpośrednio, 🔴 przepięcie przy ładowaniu) → 5/43; łącznie 158/314. |
| 27.09.2026 | M12: E39 (łączenie paneli ze stacją zasilania, echo M3/E5, 🔴 napięcie wejścia) → 6/43; łącznie 159/314. |
| 27.09.2026 | M12: E11 (zużycie per urządzenie ze współczynnikiem pracy sprężarki, częściowo — bez bazy urządzeń) → 7/43; łącznie 160/314. |
| 27.09.2026 | M12: E30 (gniazdo zapalniczki, 🔴 przeciążenie) → 8/43; łącznie 161/314. |
| 27.09.2026 | M12: E42 (ratowanie rozładowanego akumulatora — odsyłacz do M11/A9, B10, B11) → 9/43; łącznie 162/314. |
| 27.09.2026 | M12: E22 (bezpieczeństwo akumulatora w kamperze — checklista wg chemii) → 10/43; łącznie 163/314. |
| 27.09.2026 | M12: E36 (bezpieczne ładowanie w garażu — checklista wg chemii) → 11/43; łącznie 164/314. |
| 27.09.2026 | M12: E2 (kabel i bezpiecznik małej instalacji — echo M5/E1+E6 + koordynacja 60364-4-43, częściowo) → 12/43; łącznie 165/314. |
| 27.09.2026 | M12: E15 (kable i bezpieczniki w kamperze — silnik E2 z flagą pojazdu, częściowo) → 13/43; łącznie 166/314. |
| 27.09.2026 | M7: E23 (obciążenie dachu śniegiem — PN-EN 1991-1-3 + NB, twardy stop przy przekroczeniu nośności) → 3/26; łącznie 167/314. |
| 27.09.2026 | M7: E13 (sztywnienie izolacji na mrozie — progi PVC/XLPE ze źródła) → 4/26; łącznie 168/314. |
