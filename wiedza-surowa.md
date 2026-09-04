# Wiedza surowa — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny
**Powiązane dokumenty:** `00_Biblia.md`, `docs/zrodla/`, `docs/rejestr-pokrycia.md`

TL;DR: Synteza tego, co materiały źródłowe (`docs/zrodla/`) mówią o dziedzinie — świat, jaki jest (fizyka, potrzeby użytkownika off-gridu, ograniczenia), nie produkt, jaki będzie. **To nie zamiennik `docs/zrodla/`** — oryginały zostają tam nietknięte; ten dokument to wstępne uporządkowanie, nie ocena.

---

## Materiały źródłowe (katalog `docs/zrodla/`, niezmienione, Część B.5 GOD BOOK)

- `Biblia_Offgrid_v2_0_Architektura_Modulowa.md` — źródło wszystkich 579 funkcji, kanoniczna wersja (D4, `rejestr-decyzji.md`).
- `Tresc_Modul_1_Lokalizacja_Ekrany.md` … `Tresc_Modul_13_*_Ekrany.md` — treść per moduł (13 plików), szablon Sekcja A (dane wejściowe) / B (silnik/wzór) / C (przykład) / D (migawka "po ludzku").
- `Tresc_WSZYSTKIE_MODULY_scalone.md` — scalenie wszystkich 13 modułów + zbiorczy rejestr twardych stopów + rejestr rozstrzygniętych duplikatów + jawnie ujawnione luki. Źródło weryfikacji programistycznej D1/D4.
- `Zasady_UX_Doradcy_v2_1.md` — metodologia autorska: taksonomia wzorców ekranu A–H, kryteria kwalifikacji do wzorca D (Doradca z werdyktem bezpieczeństwa), szablon treści Sekcja A/B/C/D.

## Świat, jaki jest — kluczowe fakty domeny (nie produkt)

**Kim jest odbiorca:** osoba budująca albo projektująca instalację off-grid PV — od hobbysty po montera — która potrzebuje nie tylko liczby, ale zrozumienia, dlaczego wyszła akurat taka, i ostrzeżenia przed błędem, który normalnie odkrywa się dopiero w terenie (Zasada 2, `zlote-zasady.md`).

**Charakter źródła:** to specyfikacja produktowa (Biblia Off-Grid v1.5/v2.0), nie generyczny standard inżynierski — większość treści jest specyficzna dla tego projektu, nie dla całej rodziny aplikacji (stąd nie trafia do `docs/standards/`, tylko zostaje tutaj i w `docs/zrodla/`).

**Powtarzający się wzorzec luk w źródle** (obserwacja z wielu ekranów, potwierdzona wielokrotnie w `docs/memory.md`): źródło często podaje wzór z zakresem współczynnika ("typowo -0,3 do -0,45%/°C") zamiast pojedynczej liczby, albo podaje tylko przykład ilustracyjny bez ogólnego wzoru (np. "strata może sięgać 18%" bez formuły). To nie przeoczenie do naprawienia domysłem — to świadoma granica tego, co źródło rozstrzyga, a co zostawia inżynierowi w terenie. Konsekwencja: Dyrektywa #1 (`02_Dyrektywy_AI_Projektu.md`).

**Powtarzający się rodzaj twardego stopu:** źródło samo oznacza niektóre progi jako krytyczne (🔴) wprost w tekście (np. "jeden z najważniejszych twardych stopów w całej aplikacji" — M3/E5, Voc max MPPT) — te fragmenty mają pierwszeństwo przy budowie: buduj je przed ekranami bez takiego zastrzeżenia. Zbiorczy rejestr: `docs/rejestr-twardych-stopow.md`.

**Duplikaty międzyrozdziałowe:** duże, organicznie rozrosłe źródło ma ukryte powtórzenia tego samego tematu w kilku modułach (znaleziono ≥7, np. cykle odszraniania pompy ciepła w trzech rozdziałach) — sprawdzać przed napisaniem nowego ekranu, czy temat nie jest już opisany gdzie indziej (Część I.2 GOD BOOK). Rejestr rozstrzygniętych duplikatów: `Tresc_WSZYSTKIE_MODULY_scalone.md`.

**Deklaratywna metryczka źródła ≠ rzeczywista treść** — sprawdzone dwukrotnie (D1, D4): licz funkcje/luki programistycznie z rzeczywistej treści, nigdy z podsumowania "X z X gotowe" na wiarę.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — synteza z `docs/zrodla/` i lekcji zebranych w `docs/memory.md` przy budowie ~100 ekranów. Wersja 1.0. |
