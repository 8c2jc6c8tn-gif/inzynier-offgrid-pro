# CI referencyjny (11.2 + 11.5)

Źródło: `inzynier-offgrid-pro`, zgłoszenie 16.09.2026. Stack projektu źródłowego to
Next.js/TypeScript/pnpm — **transferowalny jest kształt decyzji, nie dosłowny YAML.**
Plik [`ci.yml`](ci.yml) to dosłowna, pełna zawartość `.github/workflows/ci.yml` tego projektu —
nie szkielet, nie skrócona wersja "do adaptacji", tak jak faktycznie działa i gatuje merge PR-ów
(krok `pnpm check:i18n-guard` w środku `quality` to ta sama bramka co [`../i18n/`](../i18n/),
wpięta jako jeden z kroków — usuń ten krok, jeśli projekt nie ma jeszcze migracji i18n w toku).

## Kształt (transferowalny do każdego stacku)

- **Dwa niezależne joby, nie jeden.** `quality` (lint/typecheck/test/build) i `dependency-audit`
  (skaner podatności) — rozdzielone celowo. Podatność w transitive dependency dev-only nie ma
  blokować mergowania niezwiązanego fixa lintera, i odwrotnie. Jeden monolityczny job myli sygnał:
  czerwony status nie mówi, co konkretnie jest zepsute, bez wchodzenia w logi.
- **Bramka na `high`/`critical`, nie na wszystko.** `moderate`/`low` nie blokują merge — inaczej CI
  byłoby czerwone praktycznie zawsze (w projekcie źródłowym: dziesiątki `moderate` w normalnym
  stanie ekosystemu npm), co uczy zespół ignorować czerwony status, dokładnie odwrotny efekt od
  zamierzonego.
- **Zanim włączysz bramkę, sprawdź, czy przechodzi — nie włączaj "na wiarę".** W projekcie
  źródłowym pierwsze uruchomienie realnego audytu (`pnpm audit --audit-level=high`) **nie
  przechodziło**: 22 podatności `high`. Włączenie bramki bez tego sprawdzenia zablokowałoby każdy
  PR od zera, w tym niezwiązane z bezpieczeństwem. Kolejność: (1) uruchom audyt ręcznie, (2) napraw,
  co się da w ramach już zadeklarowanych zakresów wersji (żadnych nowych ryzyk major), (3) dodaj
  bramkę do CI z czystym stanem jako punktem odniesienia.
- **Napraw, nie obniżaj progu.** Rozstrzygnięcie z projektu źródłowego: **nie** dodano wyjątku/
  allowlisty/`--production`. Sprawdzono każdą z 22 pozycji: 1 była w zależności bezpośredniej
  (`postcss`, miał zainstalowaną starszą wersję niż łatka, mimo że zakres semver już to dopuszczał
  — wystarczyło `pnpm update postcss`); reszta to zależności przechodnie przez 2 pakiety dev
  (`eslint-config-next`, `shadcn`) — `pnpm update` bez argumentu (w granicach już zadeklarowanych
  zakresów `^`) podciągnął je do najnowszych dopuszczalnych wersji i to rozwiązało wszystkie
  pozostałe. Wynik: 0 podatności wszystkich poziomów (nie tylko `high`).
- **Zweryfikuj po zmianie zależności, nie tylko sam audyt.** Bump wielu pakietów naraz (nawet w
  granicach deklarowanych zakresów) ma realną szansę złamać coś — pełny łańcuch
  lint→typecheck→test→build musi przejść PO aktualizacji, zanim się ją commituje.

## Odpowiedniki dla innych stacków rodziny

Komenda `run:` w jobie `dependency-audit` się zmienia, cała struktura zostaje identyczna:
`npm audit --audit-level=high` (npm), `pip-audit` (Python) i analogicznie dla innych menedżerów
pakietów (11.1).

## Poprawka 16.09.2026 — `--audit-level=high` jest szerszy niż reguła 11.5 wymaga

Źródło: `inzynier-szkieletowy-pro` (PR #230). 11.5 mówi wprost: podatność w **bezpośredniej
zależności** blokuje merge. `pnpm audit --audit-level=high`/`npm audit --audit-level=high` w
`ci.yml` blokuje na **każdej** podatności high/critical, także w zależnościach **tranzytywnych**,
których projekt nie kontroluje wprost (nie może ich samodzielnie zaktualizować bez czekania na
paczkę pośrednią) — szerszy zakres niż dosłowne brzmienie reguły.

`inzynier-szkieletowy-pro` zaimplementował to wiernie: [`audit-gate.mjs`](audit-gate.mjs) parsuje
`npm audit --json`, filtruje po polu `isDirect` — blokuje tylko bezpośrednie zależności,
tranzytywne pokazuje informacyjnie (nie blokująco). To dosłowna, pełna treść skryptu z projektu
źródłowego, zweryfikowana (`node --check`).

**Który wariant wybrać:** prosty `--audit-level=high` jest szybszy do wdrożenia i bezpieczniejszy
"w drugą stronę" (łapie więcej, nie mniej) — akceptowalny, jeśli projekt wybiera świadomie łapać
też tranzytywne. `audit-gate.mjs` jest wierny dosłownemu zakresowi 11.5 — wybierz go, jeśli chcesz,
żeby bramka CI dokładnie odpowiadała temu, co reguła standardu mówi. Skrypt wymaga adaptacji do
menedżera pakietów projektu (źródło używa `npm`; dla `pnpm`/innych sprawdź realny kształt JSON-a
audytu, nie zakładaj identycznej struktury).
