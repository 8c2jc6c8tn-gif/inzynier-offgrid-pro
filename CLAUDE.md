# CLAUDE.md — Inżynier Offgrid Pro

Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo). Web/PWA offline-first (Next.js 16 / React 19 / TypeScript), z architekturą przygotowaną na przeniesienie na mobile. Część rodziny aplikacji "Inżynier Pro".

## Zanim zaczniesz — przeczytaj w tej kolejności

1. `docs/memory.md` — decyzje, pułapki i stan tego konkretnego projektu.
2. `docs/standards/00-INDEKS.md` — pełny standard architektoniczny (16 rozdziałów), wspólny dla całej rodziny aplikacji. Rozdział dotyczący Twojego zadania — nie ładuj wszystkich naraz.
3. `ZASADY_APLIKACJI.md` / `USTALENIA.md` — zasady i decyzje specyficzne dla Offgrid Pro (konstytucja tego projektu, nadrzędna wobec kodu).

Nie duplikuj treści tych plików tutaj ani nigdzie indziej — jeśli czegoś tu brakuje, dopisz to tam, gdzie merytorycznie należy, i tylko odeślij stąd.

## Rdzeń operacyjny (pełna wersja: `docs/standards/15-wspolpraca-z-ai.md`)

Traktuj cały dostarczony materiał jako źródło prawdy i istniejący stan projektu. Nie usuwaj, nie pomijaj, nie upraszczaj i nie przepisuj istniejących informacji bez wyraźnego polecenia. Nie przepisuj całych dokumentów ani plików, jeżeli zmiana dotyczy tylko ich części.

Pracuj metodą minimalnej zmiany. Zachowuj istniejącą strukturę, decyzje, założenia, ograniczenia, parametry, liczby, jednostki, komentarze, uzasadnienia, testy i historię projektu.

Jeżeli znajdziesz informację, która wydaje się błędna, przestarzała lub sprzeczna — **nie usuwaj jej samodzielnie i nie rozstrzygaj konfliktu na własną rękę**. Pokaż obie strony (A, B), na czym polega sprzeczność, jakie są konsekwencje, i zapytaj.

Nie przedstawiaj hipotez jako faktów. Nie wymyślaj brakujących danych, norm ani współczynników bezpieczeństwa — to aplikacja licząca twarde fakty fizyczne (`docs/standards/00-filozofia.md`), nie zgadywanka.

Po większej zmianie przedstaw: ZMIENIONO / DODANO / USUNIĘTO / WPŁYW NA ISTNIEJĄCE ELEMENTY.

Zasada nadrzędna: **ZACHOWAJ → ZROZUM → ZMIEŃ TYLKO TO, CO POTRZEBNE → SPRAWDŹ → ZARAPORTUJ.**

## Twarde zakazy specyficzne dla tego repo

- **Jeden lockfile.** Tylko `pnpm-lock.yaml`. Nigdy nie dodawaj `package-lock.json` ani `yarn.lock` obok niego — to konkretny, udokumentowany sposób, w jaki poprzedni projekt tej rodziny zerwał sobie deploy na kilka dni (`docs/standards/11-ci-deployment.md`, 11.1).
- **`lib/`/`core`/domena nigdy nie importuje z `app/`/`components/`** (UI) ani z niczego platformowego, gdy powstanie warstwa domenowa — patrz `docs/standards/01-architektura.md`.
- **Nie startuj implementacji jądra obliczeniowego bez sprawdzenia aktualnego statusu w `docs/memory.md`** — Etap 1 (szkielet architektury) był wstrzymany decyzją autora (patrz `ZASADY_APLIKACJI.md` §14); sprawdź, czy to nadal aktualne, zanim zaczniesz pisać kod domenowy.

## Stan repo (skrót — pełny stan w `docs/memory.md`)

Obecnie: szkielet Next.js (`app/`, `components/ui/`, `lib/utils.ts`) bez kodu domenowego. Brak jeszcze testów, lintera, CI. Komendy dostępne dziś: `pnpm dev` / `pnpm build` / `pnpm start`. Gdy dojdą test/lint, dopisz komendy tutaj i w `docs/memory.md`.

## Definicja ukończenia zadania

Kod działa · testy przechodzą (gdy istnieją) · typecheck bez nowych błędów · brak martwego kodu · dokumentacja (w tym `docs/memory.md`, jeśli decyzja jest warta zapamiętania) zaktualizowana · zmiana nie narusza innych modułów. Pełna wersja: `docs/standards/10-testy.md` (10.4).

## Zasada `docs/memory.md`

Dopisz krótki wpis po: nietrywialnej decyzji, znalezionym i naprawionym błędzie/pułapce, zamknięciu większego etapu, odkrytym konflikcie w dokumentacji. Nie po każdym drobnym commicie. Pełna specyfikacja: `docs/standards/14-proces-i-pamiec.md` (14.5).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
