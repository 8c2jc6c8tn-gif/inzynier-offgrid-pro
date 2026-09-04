# Mapa wdrożenia — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `zlote-zasady.md` (Zasada 14 — kolejność budowy)

TL;DR: Status opisany/zaimplementowany/przetestowany per moduł (M1–M13, Część T.2 GOD BOOK) — status *kodu*, w odróżnieniu od statusu *opisu* w `docs/zrodla/` (które jest kompletne dla wszystkich 13 modułów od 29.08.2026). Budowana z `docs/rejestr-pokrycia.md`, aktualizowana przy każdej sesji implementacyjnej, nie tylko przy audycie.

**Rubryka gotowości (Część T.1 GOD BOOK, ustalona raz):** % ekranów danego modułu ze statusem `done` w `docs/rejestr-pokrycia.md` względem wszystkich zidentyfikowanych ekranów tego modułu (nie względem 579 funkcji łącznie — wiele funkcji źródła scala się w jeden ekran, patrz `docs/rejestr-pokrycia.md`, sekcja "Funkcje przeniesione"). Kryteria per ekran: ma Cel (nagłówek+opis) · ma Wejście/Wyjście (`input.ts`/`CalcResult`) · ma walidację · ma przykład przeliczony (test z wartością referencyjną) · ma sprawdzone odsyłacze (formuła 1:1 ze źródła albo jawnie udokumentowane odstępstwo) · ma jednoznaczny status (`done`/`⚠️ blocked`/`todo`).

---

## Tabela

| Moduł (ID) | Nazwa | Opisany w źródle | Zaimplementowany | Przetestowany | Gotowość |
|---|---|---|---|---|---|
| M1 | Lokalizacja i teren | ✅ | ✅ (1 ekran, infrastrukturalny) | — (brak logiki do testowania) | Fundament gotowy, reszta ekranów `todo` |
| M2 | Zapotrzebowanie energetyczne | ✅ | ✅ (13/17 ekranów) | ✅ | ~76% — reszta (Ekrany 3/10/14/15, wampiry) `⚠️ blocked` |
| M3 | Instalacja PV | ✅ | 🔄 (12/~27 ekranów) | ✅ | ~44% — rozpoczęte 04.09.2026, w toku |
| M4 | Magazyn energii / baterie | ✅ | ✅ (29/34 ekranów) | ✅ | ~85% — reszta `⚠️ blocked` (cross-modułowe/brak normy) |
| M5 | Okablowanie i zabezpieczenia | ✅ | 🔄 (1/~20 ekranów) | ✅ | ~5% — Ekran 1 (mega-Doradca doboru kabla) `⚠️ blocked`, brak normy PN-IEC 60364-5-52 |
| M6 | Ogrzewanie / pompa ciepła | ✅ | 🔄 (2/~46 ekranów) | ✅ | ~4% — rozpoczęte 04.09.2026 (COP + pompy cyrkulacyjne), reszta w większości `todo`/blocked (auto z Modułu 1) |
| M7 | Stress-test zimowy | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Fundament (Black Start) gotowy, spina M1–M6 — sensowny dopiero po nich |
| M8 | Bezpieczeństwo i sytuacje awaryjne | ✅ | 🔄 (1 ekran reprezentatywny, dane demonstracyjne) | ✅ | Audyt pożarowy zbudowany z danych demo — docelowo z M8/M9/M13 na żywo |
| M9 | Elektronika / ESP32 / sensoryka | ✅ | 🔄 (1 katalog reprezentatywny) | ✅ | Katalog czujników (21 typów, Wzorzec H) gotowy, reszta `todo` |
| M10 | AI i prognozy | ✅ | 🔄 (1 ekran reprezentatywny, dane demonstracyjne) | ✅ | Czerpie z prawie wszystkiego wcześniejszego — naturalnie ostatni |
| M11 | Montaż baterii | ✅ | ✅ (19/22 ekranów) | ✅ | ~86% — Ścieżka A 8/10, Ścieżka B 11/12, reszta świadomie odłożona/blocked |
| M12 | Szybki kalkulator / tryb mobilny | ✅ | 🔄 (1 ekran reprezentatywny) | ✅ | Tryb uproszczony gotowy, reszta `todo` |
| M13 | Tryb Live | ✅ | 🔄 (1 ekran — brama bez telemetrii) | — (brak logiki domenowej) | Świadomie minimalny — sensowny dopiero, gdy reszta systemu ma dane na żywo do pokazania |

**Łącznie:** 85 pozycji ze statusem `done` w `docs/rejestr-pokrycia.md` (stan na 04.09.2026), rozłożone głównie na M2/M3/M4/M11.

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
