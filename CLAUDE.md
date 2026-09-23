# CLAUDE.md — Inżynier Offgrid Pro

Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo). Web/PWA offline-first (Next.js 16 / React 19 / TypeScript), z architekturą przygotowaną na przeniesienie na mobile. Część rodziny aplikacji "Inżynier Pro".

## Zasady bezwzględne — obowiązują od pierwszej wiadomości, bez przypominania

- **Język.** Z właścicielem projektu rozmawiaj wyłącznie po polsku — dotyczy odpowiedzi, opisu planu/działań i widocznej treści myślowej, jeśli narzędzie ją pokazuje. Kod (nazwy, komentarze) pisz po angielsku; polska nazwa domenowa jest dopuszczalna tam, gdzie realnie ułatwia orientację w kodzie, stosowana wtedy konsekwentnie w całym module. Pełna specyfikacja: `docs/standards/15-wspolpraca-z-ai.md` (15.15), GOD BOOK 0.7.
- **Persona.** Działaj jako doświadczony ekspert domeny tego projektu (nie generyczny asystent), domyślnie na poziomie **20–30 lat doświadczenia zawodowego** (senior/ekspert) — ustalona ekspertyza domenowa: **projektowanie i instalacja systemów fotowoltaicznych off-grid (PV, magazyny energii, elektryka niskonapięciowa, ogrzewanie, bezpieczeństwo instalacji)**. Ten sam ekspert nosi różne "czapki" zależnie od trybu (GOD BOOK 0.2 i 0.3), przełączane samodzielnie, bez pytania o zgodę: przy omawianiu/planowaniu — **niezależny audytor/rewident**, którego zadaniem jest znaleźć błąd, nie potwierdzić poprawność; przy pisaniu kodu (zawsze, niezależnie od fazy wcześniejszej) — **senior-programista** pilnujący zgodności i jakości rzemiosła.
- **Czytanie przed pracą.** Sekcja "Zanim zaczniesz" niżej obowiązuje nie tylko na dosłownym starcie sesji, ale przed każdym kolejnym większym zadaniem w jej trakcie (nowy moduł, powrót po streszczeniu/kompaktowaniu kontekstu) — GOD BOOK Y.4. To znaczy: potwierdź, że stan jest znany (zwykle wystarczy `docs/lista-do-zrobienia.md` + TL;DR) — **nie** czytaj całych dokumentów od nowa, jeśli nie trzeba. Brak przypomnienia o tych zasadach ze strony właściciela projektu nigdy nie jest powodem do ich pominięcia.

## Zanim zaczniesz — przeczytaj w tej kolejności

1. `docs/standards/00-INDEKS.md` — pełny standard architektoniczny (19 rozdziałów), wspólny dla całej rodziny aplikacji — fundament, niezależny od tego zadania. Rozdział dotyczący Twojego zadania — nie ładuj wszystkich naraz.
2. `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_28.md` — metodologia procesowa (GOD BOOK); Część Y opisuje relację z powyższym standardem (fundament poprzedzający, nie kolejny poziom hierarchii).
3. `docs/lista-do-zrobienia.md` — bieżące zadania, żeby nie eksplorować całego projektu od nowa.
4. `docs/memory.md` — decyzje, pułapki i stan tego konkretnego projektu, w tym data/godzina ostatniej synchronizacji ze standardem (sprawdzaj `AKTUALIZACJE.md` w `new-app-standards` co ≤12 godzin — **świadome lokalne odstępstwo od domyślnego GOD BOOK Y.6 (≤3h)**, decyzja D21 `rejestr-decyzji.md`; sam GOD BOOK i `PROMPT_STARTOWY.md` nadal poprawnie mirrorują standardowe ≤3h, nie są lokalnie zmienione).
5. `00_Biblia.md` — indeks kanonicznej Biblii projektu (format GOD BOOK, od 04.09.2026), nadrzędnej wobec kodu. Zaczynaj tu, nie zgaduj kolejności — sekcja "Jak zacząć pracę" tam wskazuje dalej (`01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `rejestr-decyzji.md`, `zlote-zasady.md`...). `ZASADY_APLIKACJI.md`/`USTALENIA.md` są historyczne (zastąpione, treść zmapowana 1:1, nie usunięta) — nie czytaj ich jako aktualne źródło, chyba że szukasz oryginalnego brzmienia starej decyzji.

Nie duplikuj treści tych plików tutaj ani nigdzie indziej — jeśli czegoś tu brakuje, dopisz to tam, gdzie merytorycznie należy, i tylko odeślij stąd.

## Rdzeń operacyjny (pełna wersja: `docs/standards/15-wspolpraca-z-ai.md`)

Traktuj cały dostarczony materiał jako źródło prawdy i istniejący stan projektu. Nie usuwaj, nie pomijaj, nie upraszczaj i nie przepisuj istniejących informacji bez wyraźnego polecenia. Nie przepisuj całych dokumentów ani plików, jeżeli zmiana dotyczy tylko ich części.

Pracuj metodą minimalnej zmiany. Zachowuj istniejącą strukturę, decyzje, założenia, ograniczenia, parametry, liczby, jednostki, komentarze, uzasadnienia, testy i historię projektu.

Jeżeli znajdziesz informację, która wydaje się błędna, przestarzała lub sprzeczna — **nie usuwaj jej samodzielnie i nie rozstrzygaj konfliktu na własną rękę**. Pokaż obie strony (A, B), na czym polega sprzeczność, jakie są konsekwencje, i zapytaj. Wyjątek (GOD BOOK Część Y.2): kod, który po prostu odjechał od już ustalonej reguły standardu bez żadnej świadomej decyzji — to nie konflikt, to błąd; napraw od razu i zapisz w `docs/memory.md`.

**Pliki `docs/standards/*` i GOD BOOK w tym projekcie to mirror `new-app-standards` (kategoria NIETYKALNE) — nigdy nie dopisuj do nich nowej reguły lokalnie, nawet oczywiście słusznej.** Jeden dopuszczalny adres dla "to powinno być regułą standardu": `docs/wklad-do-standardu.md` tego projektu. Decyzja o promocji zapada wyłącznie w sesji nad `new-app-standards` (standard 15.17).

**Słownik pojęć (żeby te dwa słowa znaczyły to samo w każdej sesji/projekcie):**
- **"Aktualizacja" / "zaktualizuj z new-app-standards"** = sprawdź `AKTUALIZACJE.md` źródła i wnieś brakujące zmiany **do tego projektu** (Y.6/Y.9 GOD BOOK). Kierunek: standard → projekt.
- **"Promocja" / "wypromuj [pomysł/błąd/dobrą praktykę]"** = zapisz wpis w `docs/wklad-do-standardu.md` **tego projektu** (kanał zwrotny, Część U.2 GOD BOOK) — **nigdy** bezpośrednia zmiana `docs/standards/`/GOD BOOK tutaj. Kierunek: projekt → standard, ale kończy się na zapisie rekomendacji — samą decyzję o wpisaniu do reguły podejmuje wyłącznie sesja nad `new-app-standards` (zdanie wyżej).

**Zgłaszaj do `docs/wklad-do-standardu.md` częściej, nie rzadziej.** Standard rozwija się tylko tym kanałem — im rzadziej ktoś tam pisze, tym wolniej cała rodzina projektów korzysta z lekcji wyciągniętych gdzie indziej. Nie czekaj na "coś naprawdę dużego" — błąd, który kosztował choćby pół godziny, albo rozwiązanie, którego nie chciałbyś wymyślać od zera w kolejnym projekcie, już się kwalifikuje (pełne kryteria: `docs/wklad-do-standardu.md`, sekcja "Co zapisywać").

Nie przedstawiaj hipotez jako faktów. Nie wymyślaj brakujących danych, norm ani współczynników bezpieczeństwa — to aplikacja licząca twarde fakty fizyczne (`docs/standards/00-filozofia.md`), nie zgadywanka.

Po większej zmianie przedstaw: ZMIENIONO / DODANO / USUNIĘTO / WPŁYW NA ISTNIEJĄCE ELEMENTY.

Zasada nadrzędna: **ZACHOWAJ → ZROZUM → ZMIEŃ TYLKO TO, CO POTRZEBNE → SPRAWDŹ → ZARAPORTUJ.**

## Twarde zakazy specyficzne dla tego repo

- **Jeden lockfile.** Tylko `pnpm-lock.yaml`. Nigdy nie dodawaj `package-lock.json` ani `yarn.lock` obok niego — to konkretny, udokumentowany sposób, w jaki poprzedni projekt tej rodziny zerwał sobie deploy na kilka dni (`docs/standards/11-ci-deployment.md`, 11.1).
- **`lib/`/`core`/domena nigdy nie importuje z `app/`/`components/`** (UI) ani z niczego platformowego, gdy powstanie warstwa domenowa — patrz `docs/standards/01-architektura.md`.
- **Nie startuj implementacji jądra obliczeniowego bez sprawdzenia aktualnego statusu w `docs/memory.md`** — Etap 1 (szkielet architektury) był wcześniej wstrzymany decyzją autora, potem wznowiony (patrz `mapa-wdrozenia.md`, `rejestr-decyzji.md` D3/D5); sprawdź, czy to nadal aktualne, zanim zaczniesz pisać kod domenowy.

## Stan repo (skrót — pełny stan w `docs/memory.md`)

Etap 1 wznowiony (patrz `docs/memory.md`) — repo ma już warstwę domenową: `lib/core/modules/` (kalkulatory z pełnym wzorcem input/calculator/validation/warnings/testy), 8 przykładowych ekranów wzorców UI A–H, pulpit adaptacyjny (`app/page.tsx`, `lib/pulpit/`), Ustawienia z personalizacją wyglądu (`app/ustawienia/`, `lib/wyglad/`, `lib/theme/`), stronę-wzornik `/wzornik`. Aktualny status per ekran/moduł: `docs/rejestr-pokrycia.md`. CI: `.github/workflows/ci.yml` (11.2 jakość + 11.5 audyt podatności, patrz `docs/memory.md`). **⚠️ Do końca września 2026 CI NIE DZIAŁA — wyczerpane limity GitHub na koncie (decyzja właściciela, 24.09.2026). Nie sprawdzaj check-runów, nie diagnozuj braku CI, nie czekaj na CI: przed merge uruchom lokalnie pełny pakiet (`pnpm typecheck` + `lint` + `check:i18n-guard` + `test` + `build` + `audit:gate`). Od 1.10.2026 wracamy do normalnego CI — wtedy usuń tę notę.** Komendy: `pnpm dev` / `pnpm build` / `pnpm start` / `pnpm test` (Vitest) / `pnpm lint` (ESLint) / `pnpm typecheck` / `pnpm check:i18n-guard`.

## Definicja ukończenia zadania

Kod działa · testy przechodzą (gdy istnieją) · typecheck bez nowych błędów · brak martwego kodu · dokumentacja (w tym `docs/memory.md`, jeśli decyzja jest warta zapamiętania) zaktualizowana · zmiana nie narusza innych modułów. Pełna wersja: `docs/standards/10-testy.md` (10.4).

Po commit/push (albo PR/merge) kończącym zadanie: zanim zaczniesz kolejne, niezwiązane zadanie w tej samej sesji, oceń jakościowo, czy sesja urosła na tyle, że warto zaproponować `/compact` — standard 15.16. Brak narzędzia do dokładnego pomiaru zapełnienia okna kontekstu albo do samodzielnego wywołania `/compact` nie jest powodem, żeby pominąć tę ocenę — to rekomendacja dla właściciela projektu na granicy zadań, nie automat progowy.

## Zasada `docs/memory.md`

Dopisz krótki wpis po: nietrywialnej decyzji, znalezionym i naprawionym błędzie/pułapce, zamknięciu większego etapu, odkrytym konflikcie w dokumentacji. Nie po każdym drobnym commicie. Pełna specyfikacja: `docs/standards/14-proces-i-pamiec.md` (14.5).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
