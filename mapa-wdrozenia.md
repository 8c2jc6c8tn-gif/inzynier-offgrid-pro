# Mapa wdrożenia — Inżynier Offgrid Pro

**Wersja:** 1.1 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 05.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `zlote-zasady.md` (Zasada 14 — kolejność budowy)

TL;DR: Status opisany/zaimplementowany/przetestowany per moduł (M1–M13, Część T.2 GOD BOOK) — status *kodu*, w odróżnieniu od statusu *opisu* w `docs/zrodla/` (które jest kompletne dla wszystkich 13 modułów od 29.08.2026). Budowana z `docs/rejestr-pokrycia.md`, aktualizowana przy każdej sesji implementacyjnej, nie tylko przy audycie.

**Rubryka gotowości (Część T.1 GOD BOOK, ustalona raz):** % ekranów danego modułu ze statusem `done` w `docs/rejestr-pokrycia.md` względem wszystkich zidentyfikowanych ekranów tego modułu (nie względem 579 funkcji łącznie — wiele funkcji źródła scala się w jeden ekran, patrz `docs/rejestr-pokrycia.md`, sekcja "Funkcje przeniesione"). Kryteria per ekran: ma Cel (nagłówek+opis) · ma Wejście/Wyjście (`input.ts`/`CalcResult`) · ma walidację · ma przykład przeliczony (test z wartością referencyjną) · ma sprawdzone odsyłacze (formuła 1:1 ze źródła albo jawnie udokumentowane odstępstwo) · ma jednoznaczny status (`done`/`⚠️ blocked`/`todo`).

---

## Tabela

| Moduł (ID) | Nazwa | Opisany w źródle | Zaimplementowany | Przetestowany | Gotowość |
|---|---|---|---|---|---|
| M1 | Lokalizacja i teren | ✅ | ✅ (1 ekran, infrastrukturalny) | — (brak logiki do testowania) | Fundament gotowy, reszta ekranów `todo` |
| M2 | Zapotrzebowanie energetyczne | ✅ | ✅ (13/17 ekranów) | ✅ | ~76% — reszta (Ekrany 3/10/14/15, wampiry) `todo` (nie `blocked` — sprawdzone i nieoceniane, nie sprawdzone-i-odrzucone, patrz `backlog-poza-v1.md`) |
| M3 | Instalacja PV | ✅ | 🔄 (12/~27 ekranów) | ✅ | ~44% — rozpoczęte 04.09.2026, w toku |
| M4 | Magazyn energii / baterie | ✅ | ✅ (29/34 ekranów) | ✅ | ~85% — tylko Ekran 25 (szyny zbiorcze) faktycznie `⚠️ blocked`; Ekrany 3/31/32/33 to `todo` (cross-modułowe/nieocenione, nie sprawdzone-i-odrzucone) |
| M5 | Okablowanie i zabezpieczenia | ✅ | 🔄 (1/29 ekranów) | ✅ | ~3% — tylko Ekran 1 (mega-Doradca doboru kabla) `⚠️ blocked`, brak normy PN-IEC 60364-5-52; pozostałe 27 ekranów mają samodzielne wzory NIEZALEŻNE od tej normy — zweryfikowane audytem 05.09.2026, buildowalne równolegle bez czekania na Ekran 1 |
| M6 | Ogrzewanie / pompa ciepła | ✅ | 🔄 (7/~46 ekranów) | ✅ | ~15% — rozpoczęte 04.09.2026 (COP + pompy cyrkulacyjne + bufor ciepła + ryzyko niskiego napięcia + kocioł elektryczny + infiltracja powietrza + wentylacja z odzyskiem), reszta w większości `todo`/blocked (auto z Modułu 1) |
| M7 | Stress-test zimowy | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Fundament (Black Start) gotowy, spina M1–M6 — sensowny dopiero po nich |
| M8 | Bezpieczeństwo i sytuacje awaryjne | ✅ | 🔄 (3/~11 ekranów) | ✅ | Audyt pożarowy (dane demo) + UPS krytyczny (dobór sprzętowy, częściowy) + dogrzewanie paliwem stałym (3 twarde stopy) |
| M9 | Elektronika / ESP32 / sensoryka | ✅ | 🔄 (1 katalog reprezentatywny) | ✅ | Katalog czujników (21 typów, Wzorzec H) gotowy, reszta `todo` |
| M10 | AI i prognozy | ✅ | 🔄 (1 ekran reprezentatywny, dane demonstracyjne) | ✅ | Czerpie z prawie wszystkiego wcześniejszego — naturalnie ostatni |
| M11 | Montaż baterii | ✅ | ✅ (20/22 ekranów) | ✅ | ~91% — Ścieżka A 9/10 (A5 pozostaje), Ścieżka B 11/12, reszta świadomie odłożona/blocked |
| M12 | Szybki kalkulator / tryb mobilny | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Tryb uproszczony gotowy, reszta `todo` |
| M13 | Tryb Live | ✅ | 🔄 (1 ekran — brama bez telemetrii) | — (brak logiki domenowej) | Świadomie minimalny — sensowny dopiero, gdy reszta systemu ma dane na żywo do pokazania |

**Łącznie:** 92 pozycji ze statusem `done` w `docs/rejestr-pokrycia.md` (stan na 04.09.2026), rozłożone głównie na M2/M3/M4/M11.

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
