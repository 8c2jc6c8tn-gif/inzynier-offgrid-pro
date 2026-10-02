# Archiwum docs/memory.md — 02-synchronizacja-ze-standardem-04-23-09

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 144–553 stanu sprzed archiwizacji | **Liczba sekcji:** 1
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Synchronizacja ze standardem

<!-- Obowiązkowe od GOD BOOK Część Y.6. Sprawdzaj AKTUALIZACJE.md w new-app-standards co ≤3 godziny (GOD BOOK v2.18, było ≤7 dni). Brak wpisu = "nigdy nie sprawdzono". -->
- **2026-09-03 — pełna synchronizacja wykonana** (pierwsza, wcześniej nie istniała). Odświeżono `docs/standards/00`–`16` (dodano brakujący rozdział 16), dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, `PROMPT_STARTOWY.md`, `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`. Punktowo poprawiono `CLAUDE.md` i `.claude/skills/standards/SKILL.md` (nowe odsyłacze do GOD BOOK Część Y, bez nadpisania lokalnej treści). Szczegóły niżej, sekcja "Decyzje i uzasadnienie". Świadomie NIE wykonano: migracji `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/` (nazwa sprzed zmiany 2026-09-04, patrz niżej) do kanonicznego formatu GOD BOOK (`00_Biblia.md` itd.) — to osobna, większa decyzja, patrz `docs/lista-do-zrobienia.md`.
- **2026-09-04 — sprawdzono `AKTUALIZACJE.md`, znaleziono i zsynchronizowano 2 nowe wersje (v2.4, v2.5).** Obie dot. GOD BOOK: nowa, obowiązkowa **Y.9** — 9-pozycyjna checklist kompletności do przejścia przy *każdym* sprawdzeniu (nie tylko pierwszej instalacji), jawnie raportowana właścicielowi. `docs/standards/00`–`16` — bez zmian merytorycznych (tylko 2 kosmetyczne odsyłacze do nazwy pliku GOD BOOK w `00-INDEKS.md`/`00-filozofia.md`). Wykonane: podmieniono GOD BOOK w całości (`...v2_3.md` → `...v2_5.md`, stara nazwa usunięta, NIETYKALNE), nadpisano `PROMPT_STARTOWY.md` w całości (NIETYKALNE), punktowo poprawiono odsyłacze do wersji w `docs/standards/00-INDEKS.md`/`00-filozofia.md`/`CLAUDE.md`/`README.md` oraz `.claude/skills/standards/SKILL.md` (dodatkowo: doprecyzowanie punktu 2 o wariant pełnej Biblii, ADAPTOWALNE).
  **Wynik checklisty Y.9 (pokazany właścicielowi projektu przed uznaniem za zakończone):**
  1. `docs/standards/` — ✅ aktualne (odświeżone odsyłacze).
  2. GOD BOOK — ✅ podmienione na v2.5.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` (nie pełna Biblia) — ✅ istnieje; treść nietknięta (LOKALNE). Otwarta decyzja o migracji do kanonicznego formatu GOD BOOK pozostaje nierozstrzygnięta (patrz niżej i `docs/lista-do-zrobienia.md`).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ⚠️ w momencie sprawdzenia formalnie brakowało (folder nazywał się `docs/domena/`) — **rozstrzygnięte tego samego dnia**, patrz wpis niżej "Zmiana nazwy `docs/domena/` → `docs/zrodla/`".
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, spatchowane.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — nie dotyczy (projekt nie prowadzi pełnej Biblii, tylko `docs/memory.md`).
  Zweryfikowano: `grep -rn "v2_3"` w projekcie po synchronizacji trafia wyłącznie w historyczne wpisy tego logu i `docs/lista-do-zrobienia.md` (poprawnie — append-only, nie nadpisuje się historii) oraz w CHANGELOG samego pliku GOD BOOK (odniesienia do własnych, starszych wersji — też poprawne).
- **2026-09-04 — pełna Biblia GOD BOOK napisana; `AKTUALIZACJE.md` sprawdzone ponownie, bez nowych wpisów od poprzedniego sprawdzenia tego samego dnia (nadal v2.5).** Migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md` do kanonicznego formatu, wykonana na wyraźne polecenie właściciela projektu (poprzednio otwarta jako "czeka na decyzję" — patrz wpis wyżej i `docs/lista-do-zrobienia.md`). **Aktualizacja checklisty Y.9** (poprzedni wynik wyżej, punkty 4 i 9, zostaje jako historyczny snapshot — to nowy, osobny przebieg checklisty, nie edycja starego):
  1–3, 5–8. Bez zmian od poprzedniego sprawdzenia (✅).
  4. `docs/memory.md`/pełna Biblia — **✅➕ teraz PEŁNA BIBLIA istnieje**: `00_Biblia.md` + 11 dokumentów Części S (`01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `zlote-zasady.md`, `rejestr-decyzji.md`, `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`, `mapa-wdrozenia.md`, `backlog-poza-v1.md`, `dlug-techniczny.md`; `docs/zrodla/` i `docs/lista-do-zrobienia.md` już istniały = 14/14 pozycji Części S kompletne). `docs/memory.md` zostaje jako główny, szczegółowy dziennik roboczy — rozróżnienie od `rejestr-decyzji.md` opisane w nagłówku tego drugiego pliku.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — **✅➕ dotyczy teraz, oba istnieją.**
  `ZASADY_APLIKACJI.md`/`USTALENIA.md` oznaczone na nagłówku jako historyczne/zastąpione (Część D GOD BOOK — nic nie usunięte, cała treść zmapowana 1:1 do nowych plików, mapowanie w `00_Biblia.md`).
- **2026-09-04 — sprawdzono `AKTUALIZACJE.md` ponownie (na żądanie właściciela projektu, "audyt zgodnie z książką" po zamknięciu ekranu M8/E2), znaleziono i zsynchronizowano 3 nowe wersje GOD BOOK (v2.5→v2.8).** Zmiany merytoryczne: U.4 (zbieranie wkładu z `docs/wklad-do-standardu.md` projektów downstream wprost z dysku — dotyczy tylko sesji nad `new-app-standards`, brak akcji tutaj), N.2 (audyt dwuwarstwowy dla Biblii wielorozdziałowej — przyrostowo po każdym rozdziale/Fazie ORAZ w pełni na końcu, nigdy podział pracy między warstwami), X.4 rozszerzone o kotwiczenie długu technicznego markerami `🔎 TD#` w kodzie (audyt Część N sprawdza zgodność `dlug-techniczny.md` ↔ kod przez grep w obie strony — dług nieudokumentowany i wpisy-widma). `docs/standards/00`–`16` bez zmian merytorycznych (tylko odsyłacze do nazwy pliku GOD BOOK w `00-INDEKS.md`/`00-filozofia.md`, jak poprzednio).
  **Wynik checklisty Y.9 (9 pozycji, pokazany właścicielowi projektu przed uznaniem za zakończone):**
  1. `docs/standards/00`–`16` + `00-INDEKS.md` — ✅ aktualne (2 pliki nadpisane, tylko odsyłacz do wersji GOD BOOK się zmienił).
  2. GOD BOOK — ✅ podmienione w całości (`...v2_5.md` → `...v2_8.md`, stara nazwa usunięta, `git rm`+dodanie nowego pliku).
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany (PATCH, reszta treści nietknięta).
  4. Pełna Biblia (Część S, 14 pozycji) — ✅ komplet nadal istnieje (`00_Biblia.md` + 11 dokumentów + `docs/zrodla/` + `docs/lista-do-zrobienia.md`), sprawdzone ponownie że żadna pozycja nie zniknęła.
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje; przy okazji naprawiony drobny dryf: nagłówek pliku wciąż twierdził "ten projekt nie ma jeszcze pełnej Biblii" mimo że `00_Biblia.md` powstał 2026-09-04 — poprawione na aktualny opis (Y.2.1, dryf bez świadomej decyzji, nie konflikt).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany (PATCH).
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją; zweryfikowano że §10 (`01_Zasady_Pracy_i_Konwencje.md`) faktycznie odsyła do `docs/standards/10-testy.md`/`11-ci-deployment.md` (nie lokalny wynalazek sprzed integracji) — odsyłacz do wersji GOD BOOK zaktualizowany.
  Dodatkowo poprawione odsyłacze do wersji (nie pozycje Y.9 same w sobie, ale te same pliki, spójność): `README.md`, `PROMPT_STARTOWY.md`, `00_Biblia.md`, `ZASADY_APLIKACJI.md`, `USTALENIA.md`.
  Zweryfikowano: `grep -rln "instrukcja-uniwersalna-biblii-projektu-v2_5"` po synchronizacji — zero trafień w całym repo. Pozostałe historyczne wzmianki starszych wersji (v2_3) w tym logu i `docs/lista-do-zrobienia.md` celowo nietknięte (append-only, Część D GOD BOOK).
  **Nie wykonano (świadomie, poza zakresem tej sesji):** dopisanie tego projektu do `docs/projekty-downstream.md` w `new-app-standards` (U.4) — wymagałoby zmiany w repo `new-app-standards`, nie tutaj; do rozważenia przy najbliższej sesji nad tamtym repo.
- **2026-09-15 — sprawdzono `AKTUALIZACJE.md` (11 dni zaległości, ostatni sync 04.09.2026 przy v2.8; lokalny klon `new-app-standards` był 25 commitów za `origin/main` — wykonano `git fetch`+`git pull` przed odczytem, zgodnie z Y.6 1a/1b, żeby nie powtórzyć błędu "nieodświeżony klon = fałszywe 'brak nowości'"). Znaleziono i zsynchronizowano 15 wpisów logu (v2.8→v2.17). Pełna synchronizacja wykonana na wyraźne polecenie właściciela projektu, po zaprezentowaniu zakresu i uzyskaniu zgody (Y.6 punkt 7).**
  **Zmiany merytoryczne z realnym wpływem na ten projekt (zaplanowane, NIE wdrożone w tej sesji — zgodnie z zakresem zgody "sync dokumentacji, nie kodu"):**
  1. **Rozdz. 17 (i18n), nowy — 17.2 rozstrzyga kolizję zgłoszoną przez TEN projekt**: Kernel ma zwracać klucze tłumaczeń, nigdy gotowy tekst — PATCH do 01.1/03.2/04 (assumptions jako klucz+parametry, `Warning` zwraca wyłącznie `kod`). **Dzisiejszy kod całego `lib/core/modules/` zwraca wprost polski tekst w `assumptions` i komunikatach `Warning` — to niezgodność do zaplanowania**, nie pilna (tak formułuje sam standard). Do dopisania jako pozycja w `docs/lista-do-zrobienia.md`, gdy projekt zdecyduje się na i18n.
  2. **Rozdz. 18 (logowanie/konta), nowy** — obowiązkowy wzorzec (Supabase Auth, magic link/Google/Apple, sesja w HttpOnly cookie, sync = Seed nigdy Wynik). Projekt nie ma jeszcze żadnego logowania — nowy, duży temat do zaplanowania od Kroku 2 GOD BOOK, nie tylko doczytania rozdziału. Nasza własna propozycja `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` (SZKIELET, 06.09.2026) została jawnie wymieniona jako jeden ze źródeł tego rozdziału — oznaczona tam jako rozstrzygnięta (nagłówek), treść zachowana jako historyczny zapis analizy.
  3. **Rozbudowa rozdz. 09 (AI w produkcie)** — konkretny kontrakt `AiToolDefinition<TInput,TOutput>` (read/write, `requiresConfirmation` dla write), AI teraz obowiązkowe (nie opcjonalne) jako warstwa wyłącznie-online nad rdzeniem. Projekt nie ma jeszcze AI w runtime — do zaplanowania, nie pilne.
  4. **Rozbudowa rozdz. 12 (freemium)** — trial dwuetapowy (FREE bez karty → PRO z kartą 24h), płaski podział FREE/PRO. Projekt nie ma jeszcze freemium wdrożonego — do zaplanowania.
  5. Reszta (rozdz. 03, 04, 05, 06, 10, 14, 15 — poprawki techniczne: wynik wielopolowy z `calculatorVersion`/`traceId` obowiązkowym, Blob z Web Workera odtwarzany przed zapisem do IndexedDB na Safari/iOS, `ALTER DATABASE ... SET` zakazane na hostowanym Postgresie z RLS, K1–K8 audyt modułu, higiena okna kontekstu/`/compact`, zakaz lokalnego dopisywania do mirrora standardu) — czysto techniczne, NIETYKALNE, bez decyzji do podjęcia. Zweryfikowano: projekt dziś nie używa `ALTER DATABASE`, nie kompresuje plików w Web Workerze do IndexedDB — te dwie pułapki nie dotyczą jeszcze tego kodu.
  **Wykonane w tej sesji:** nadpisano `docs/standards/00-INDEKS.md`, `00-filozofia.md`, `03`, `04`, `05`, `06`, `09`, `10`, `12`, `14`, `15` w całości; dodano nowe `17-i18n.md`, `18-logowanie.md`; podmieniono GOD BOOK w całości (`...v2_8.md` → `...v2_17.md`, `git rm`+nowy plik); nadpisano `PROMPT_STARTOWY.md` w całości (nowe: sekcja języka/persony/trybów rozszerzona, higiena okna kontekstu); PATCH (nie REWRITE) do `CLAUDE.md` (nowa sekcja "Zasady bezwzględne" z wypełnionym TODO ekspertyzy: "projektowanie i instalacja systemów fotowoltaicznych off-grid", akapit o micie `docs/standards/*` jako NIETYKALNE mirror, akapit `/compact` w Definicji ukończenia, licznik rozdziałów 17→19); odświeżono odsyłacze do wersji GOD BOOK w `USTALENIA.md`, `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`, `.claude/skills/standards/SKILL.md`, `docs/lista-do-zrobienia.md`.
  **Wynik checklisty Y.9 (9 pozycji):**
  1. `docs/standards/00`–`18` + INDEKS — ✅ aktualne (odświeżone w tej sesji).
  2. GOD BOOK — ✅ podmienione na v2.17.
  3. `CLAUDE.md` — ✅ istnieje, spatchowane (PATCH, nie REWRITE — cała lokalna adaptacja zachowana).
  4. Pełna Biblia (Część S, 14 pozycji) — ✅ komplet nadal istnieje, zweryfikowane ponownie że żadna pozycja nie zniknęła.
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją.
  **Moduł opcjonalny Y.10 (osobno od Y.9, nie automatyczny) — NIE zainstalowany w tej sesji, świadomie:** `docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md` (playbook uogólniony z naszego własnego zgłoszenia z 06.09.2026) i skanonizowany `docs/biblioteka-norm/` w `new-app-standards` (dla którego TEN projekt był źródłem plików, commit `d7c81d1`) — projekt ma dziś normy w `docs/zrodla/` w innej, lokalnej strukturze; zgodnie z Y.10 ("nigdy automatycznie, tylko po jawnym potwierdzeniu dopasowania") to osobna propozycja do zatwierdzenia, nie część tej synchronizacji. Do rozważenia w kolejnej sesji, jeśli właściciel projektu chce ujednolicić strukturę z kanonicznym modułem.
  Zweryfikowano: `grep -rln "v2_8"` po synchronizacji — zero trafień poza historycznymi wzmiankami (ten log, `docs/lista-do-zrobienia.md`, `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` — jawnie oznaczone jako nieaktualne odniesienie w statusie na górze pliku — i changelog GOD BOOK samego, odniesienia do własnych starszych wersji), zgodnie z Częścią D GOD BOOK (append-only, historia nie jest cicho nadpisywana).
- **2026-09-15 (druga synchronizacja tego dnia) — `AKTUALIZACJE.md` sprawdzone ponownie na wyraźną
  wskazówkę właściciela projektu ("odpowiedź znajdziesz w nowej aktualizacji"), przed rozpoczęciem
  pracy nad rozdz. 18 (logowanie). `git fetch`+`git pull` w lokalnym klonie `new-app-standards`
  ujawniło 8 nowych commitów od poprzedniej synchronizacji (GOD BOOK bez zmiany wersji, wciąż
  v2.17 — tylko 6 plików `docs/standards/` zmienionych: `00-INDEKS`, `04`, `06`, `07`, `11`, `18`).**
  Nadpisane wszystkie 6 w całości (NIETYKALNE). Treść: dokończenie audytu bezpieczeństwa sesji
  zainicjowanego przy poprzedniej synchronizacji — nowa **7.7** (sanityzacja XSS u źródła, zakaz
  `dangerouslySetInnerHTML`/regex-filtrów dla treści użytkownika), dopisek do **7.3** (CSP +
  `X-Frame-Options`/`frame-ancestors` przeciw clickjackingowi), nowa **6.6** (SSRF — reguła
  warunkowa, tylko gdy backend robi fetch na URL od użytkownika), nowa **7.4** pozycja checklisty
  (SQL wyłącznie przez ORM/bind params, nigdy konkatenacja — osobne zagrożenie od RLS 6.5), nowa
  **11.5** (audyt podatności zależności jako bramka CI). Plus **18.15** (moduł opcjonalny — transfer
  danych między powiązanymi appkami rodziny przez plik, nie przez żywe połączenie baz) i dopisek do
  **18.2** (magic link a open redirect na URL powrotny).
  **Sprawdzone względem TEGO kodu (nie zgadywane):** `grep` na `dangerouslySetInnerHTML`/`innerHTML`
  — 2 wystąpienia, oba na treści statycznej autorskiej (skrypt inicjalizacji motywu w
  `app/layout.tsx`, definicje symboli SVG w `components/kafle-ikony/definicje-symboli.tsx`), **nie**
  treści od użytkownika — 7.7 nie jest naruszona, tylko warta odnotowania jako sprawdzona świadomie.
  6.6 (SSRF) i 7.4-SQL nie mają jeszcze zastosowania — projekt nie ma backendu wykonującego fetch na
  URL od użytkownika ani żadnych zapytań SQL (brak Supabase/bazy na razie). **11.5 nieaktualne do
  wdrożenia — projekt nie ma jeszcze żadnego CI** (`.github/` nie istnieje), znana, już zapisana luka.
  **Wykonane od razu, niezależnie od tematu logowania (7.3 — realny, zero-zależnościowy gap):**
  `next.config.mjs` nie miał ŻADNEGO nagłówka bezpieczeństwa. Dodano `headers()`: CSP (`script-src`
  ograniczony do `'self'` + SHA-256 hash jedynego inline-skryptu w apce — `WYGLAD_INIT_SCRIPT` z
  `app/layout.tsx`, nie `'unsafe-inline'`; w dev mode CSP celowo łagodniejsza dla React Refresh/HMR),
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Strict-Transport-Security`, `Permissions-Policy` (odmawia camera/microphone/geolocation — apka
  dziś nie używa żadnego z tych API, zweryfikowane grepem). Krzyżowy komentarz w obu plikach
  (`next.config.mjs` ↔ `app/layout.tsx`) tłumaczący, że zmiana treści skryptu wymaga przeliczenia
  hasha — inaczej CSP ubiłaby skrypt po cichu (błysk domyślnego wyglądu, bez widocznego błędu).
  Zweryfikowano: `tsc`/`lint`/`build` czyste, `pnpm start` + `curl -D-` potwierdza realne wysyłanie
  wszystkich 6 nagłówków z poprawną treścią CSP. **Nie zweryfikowano w headless browserze** (brak
  pakietu `playwright` jako zależności projektu, tylko sama binarka Chromium w środowisku) — hash
  wyliczony bezpośrednio z tego samego stringa co w kodzie, `dangerouslySetInnerHTML` nie przechodzi
  przez minifikację JS, więc ryzyko rozjazdu niskie, ale to rozumowanie, nie potwierdzenie wizualne.
- **2026-09-16 — CI (11.2/11.5) zbudowane, luka z wpisu wyżej ("projekt nie ma jeszcze żadnego
  CI") zamknięta.** `.github/workflows/ci.yml`, dwa niezależne joby na `pull_request` + `push`
  do `main`, rozdzielone celowo (znany, nienaprawialny natychmiast high w jednej zależności nie
  ma blokować mergowania czystego fixa lintera w drugim, i odwrotnie):
  - `quality` — `pnpm lint` → `pnpm typecheck` (nowy skrypt, `tsc --noEmit` — nie istniał wcześniej
    jako skrypt npm, tylko wywoływany ręcznie przez sesje AI) → `pnpm test` → `pnpm build`, na
    `pnpm/action-setup` + `actions/setup-node@22` z cache pnpm, `pnpm install --frozen-lockfile`
    (11.1 — lockfile jako źródło prawdy instalacji, nie tylko lokalnie).
  - `dependency-audit` — `pnpm audit --audit-level=high` (11.5, dosłownie z treści reguły).
  **Decyzja zakresu (to, co ta reguła sama nazywa "większą decyzją, nie mechaniczną łatką"):**
  pierwsze uruchomienie audytu **nie przechodziło** — 22 podatności `high` (`brace-expansion`,
  `js-yaml`, `fast-uri`, `postcss`, `sharp`), gdyby CI powstało wcześniej i włączono bramkę bez
  sprawdzenia, pierwszy PR zostałby zablokowany od zera. Rozstrzygnięcie: **nie** obniżono progu
  i **nie** dodano wyjątku/`--production`/allowlisty — sprawdzono każdą pozycję i naprawiono to,
  co naprawialne w granicach już zadeklarowanych zakresów `package.json` (żadna zmiana major, żadne
  ręczne podniesienie zakresu semver):
  1. `postcss` (`^8.5`, zależność bezpośrednia — dokładnie przypadek, który 11.5 nazywa
     najpoważniejszym) miał zainstalowaną `8.5.6` < łatka `8.5.12` mimo że zakres to dopuszczał —
     `pnpm update postcss` wystarczyło.
  2. Pozostałe 4 pakiety (`brace-expansion`/`js-yaml`/`fast-uri`/`sharp`) to zależności przechodnie
     dev-only (łańcuchy `eslint-config-next→...→minimatch`, `shadcn→cosmiconfig`/`@modelcontextprotocol/sdk→ajv`)
     plus `next→sharp` (produkcyjna, ale nieużywana realnie — `images.unoptimized: true` w
     `next.config.mjs`, zweryfikowane wcześniej). `pnpm update` (bez argumentu, w granicach
     zakresów `^` już zadeklarowanych) podciągnął `eslint-config-next`/`shadcn`/`react`/
     `react-dom`/`@base-ui/react`/`lucide-react`/`zod`/`tailwind-merge`/`@types/*` do najnowszych
     wersji dopuszczonych przez istniejące zakresy — to rozwiązało wszystkie 4 pozostałe pakiety
     przez łańcuch zależności, bez ręcznej ingerencji w `overrides`/`resolutions`.
  Wynik: `pnpm audit --audit-level=high` → **0 podatności** (`No known vulnerabilities found`).
  Zero wyjątków zapisanych — nie było potrzeby, każda pozycja miała realną łatkę w already-declared
  zakresie. **Zweryfikowano po zmianie zależności** (nie tylko sam audyt): `lint`/`typecheck`/
  `test` (660/660)/`build` — wszystkie czyste, żadna z podniesionych wersji nie złamała niczego.
  Dodane `packageManager: "pnpm@10.33.0"` do `package.json` (wzmacnia 11.1 — jawna, reprodukowalna
  wersja menedżera pakietów w CI, nie tylko lockfile). Jeden lockfile (`pnpm-lock.yaml`) — bez zmian
  w tej zasadzie, tylko zaktualizowany.
  **Korekta tego samego dnia:** poprzednia wersja tego wpisu twierdziła, że `moderate`/`low`
  (18+3) zostały świadomie zostawione — nieprawdziwe, nie zweryfikowane wystarczająco (sprawdzony
  był tylko `pnpm audit --audit-level=high`, nie pełny `pnpm audit` bez filtra poziomu). Pełny
  `pnpm audit` (bez `--audit-level`) po tym samym `pnpm update` daje **0 podatności wszystkich
  poziomów** (`metadata.vulnerabilities` z `--json`: info/low/moderate/high/critical = 0) —
  `eslint-config-next`/`shadcn`, źródło większości `moderate`/`low`, to te same łańcuchy zależności
  co naprawione `high`. Nic do zaostrzenia — próg `high` w CI (11.5) dziś i tak nie miał nic do
  odfiltrowania.
- **2026-09-16 (na wyraźne polecenie właściciela projektu — "Aktualizacje.md") — sprawdzone
  `AKTUALIZACJE.md` w lokalnym klonie `new-app-standards` (`git fetch`+`git pull`, `d950077..92b7bcf`,
  8 nowych wpisów tego dnia). Wszystkie wniesione do tego projektu:**
  1. **GOD BOOK v2.17→v2.18** (rename pliku, `git rm`+nowy) — cykl Y.6 (projekt sprawdza standard)
     skrócony z 7 dni do **3 godzin**; U.4 (odwrotny kierunek, dotyczy tylko sesji nad
     `new-app-standards`, nie tego projektu). Odsyłacze do nazwy pliku poprawione wszędzie, gdzie
     to bieżące wskazanie (nie cytat historyczny): `CLAUDE.md`, `USTALENIA.md`, `00_Biblia.md`,
     `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`,
     `.claude/skills/standards/SKILL.md`, `docs/standards/00-filozofia.md`, nagłówek (nie treść
     wpisów) `docs/lista-do-zrobienia.md`. Historyczne wzmianki `v2_17`/starszych wersji w tym logu
     i w `docs/lista-do-zrobienia.md` celowo nietknięte (Część D GOD BOOK, append-only).
  2. **Nadpisane w całości (NIETYKALNE):** `docs/standards/00-INDEKS.md`, `11-ci-deployment.md`,
     `13-droga-mobile.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `PROMPT_STARTOWY.md`.
  3. **Nowy `docs/przyklady/`** (README, PROMPT, `ci/{README,ci.yml,audit-gate.mjs}`,
     `i18n/{README,check-i18n-guard.mjs}`) skopiowany w całości — materiał referencyjny, pochodzi
     pierwotnie z **tego** projektu (własne zgłoszenie DOBRA PRAKTYKA z 16.09, patrz
     `docs/wklad-do-standardu.md`), teraz wraca jako promowana treść standardu.
  4. **PATCH (nie REWRITE) do `CLAUDE.md`:** dopisany słownik "aktualizacja"/"promocja" (sekcja
     Rdzeń operacyjny), cykl sync 7 dni→3h (punkt 4 "Zanim zaczniesz"), oraz — zauważone przy
     tej samej edycji, nie część zgłoszenia AKTUALIZACJE.md — poprawiona nieaktualna wzmianka
     "Brak jeszcze CI" w sekcji "Stan repo" (CI istnieje od 2026-09-16, wpis wyżej).
  5. **PATCH do `docs/wklad-do-standardu.md`:** dopisana klauzula "zgłaszaj częściej, nie rzadziej"
     (próg zgłoszenia niżej niż wygląda) z `docs/wklad-do-standardu.template.md`.
  **17.4/17.4a (SSR flash złego języka, cookie zamiast `localStorage`, `Accept-Language` nie
  `navigator.language`) — sprawdzone względem TEGO kodu, nie zgadywane: `grep -rl localStorage`
  nie znajduje żadnego mechanizmu przechowywania preferencji języka (tylko `lib/pulpit/storage.ts`,
  `lib/wyglad/storage.ts`, `lib/theme/storage.ts` — pulpit/wygląd/motyw, nie i18n) i żadnego
  language switchera w `app/`/`lib/`. Projekt nie ma jeszcze pełnego przełącznika języka UI (rollout
  17 wciąż tylko na poziomie strażnika AST per-moduł, `scripts/check-i18n-guard.mjs`) — poprawka
  standardu przyjęta do treści `17-i18n.md`, ale **nie ma dziś żadnego kodu do naprawienia**; zapisane
  jako rzecz do zastosowania przy budowie realnego przełącznika języka, nie zaległy dług.**
  **13.2 (preferencja języka web→mobile)** — czysto dokumentacyjne, projekt nie ma jeszcze fazy
  mobile (rozdział 13 poza obecnym zakresem), bez wpływu na kod dziś.
  **11.6/audit-gate.mjs (zawężenie audytu podatności do zależności bezpośrednich) — otwarta decyzja,
  NIE zastosowana automatycznie w `.github/workflows/ci.yml`.** Obecny `dependency-audit`
  (`pnpm audit --audit-level=high`, wpis wyżej z 2026-09-16) blokuje merge na KAŻDEJ podatności
  `high`/`critical`, w tym przechodniej — szerszy zakres niż dosłowne brzmienie 11.5 ("zależność
  bezpośrednia"). To zmiana semantyki bramki CI (co dokładnie blokuje merge), nie mechaniczna
  łatka — zgodnie z zasadą "nie rozstrzygaj sam, pokaż A/B" nie podjęto decyzji za właściciela
  projektu. **A: zostać przy szerszym zakresie** (bezpieczniej, ale czasem blokuje na podatności
  poza kontrolą projektu). **B: przyjąć `docs/przyklady/ci/audit-gate.mjs`** (wiernie 11.5, blokuje
  tylko bezpośrednie, przechodnie tylko informacyjnie). Dziś **0 podatności obu rodzajów** (wpis
  wyżej) — decyzja nie jest paląca, ale otwarta; do zapytania właściciela projektu przy najbliższej
  okazji, zapisana też w `docs/lista-do-zrobienia.md`.
- **2026-09-16 (trzecia edycja tego dnia) — Rozstrzygnięte: wariant B ("Zrób zgodnie z god book"
  — polecenie właściciela projektu).** `scripts/audit-gate.mjs` dodany, `pnpm audit:gate` (nowy
  skrypt `package.json`) zastępuje `pnpm audit --audit-level=high` w
  `.github/workflows/ci.yml`. **Adaptacja do pnpm, nie kopia `docs/przyklady/ci/audit-gate.mjs`:**
  źródłowy skrypt filtruje po `advisory.isDirect` z `npm audit --json` (npm audit report v2) —
  sprawdzone wprost w bundlu `pnpm` (`/opt/node22/lib/node_modules/pnpm/dist/pnpm.cjs`,
  `pnpm audit --json` zwraca starszy format `advisories`/`module_name`/`findings[].paths`, **bez
  pola `isDirect`**). Rozwiązanie: "bezpośrednia zależność" wg 11.5 = pakiet będący kluczem w
  `dependencies`/`devDependencies`/`optionalDependencies` własnego `package.json` — czytane wprost
  z pliku, nie parsowane ze stringów `paths` (format nieudokumentowany, ryzyko rozjazdu między
  wersjami pnpm). Zweryfikowano: `node --check` czysty; `pnpm audit:gate` uruchomiony na realnym
  drzewie zależności (0 podatności — bez zmiany zachowania dziś); logika klasyfikacji
  blokujące/tranzytywne sprawdzona osobno na spreparowanych danych (`react` jako pakiet
  rzeczywiście bezpośredni w `package.json` → blokuje przy `high`; nieznany pakiet → tylko
  informacyjnie; `low` nie blokuje nawet dla bezpośredniego) — trzy przypadki, wszystkie
  poprawne. `pnpm lint`/`typecheck`/`test` (685/685) czyste po zmianie.
- **2026-09-16 (tego samego dnia, druga synchronizacja — GOD BOOK v2.18→v2.19) — sprawdzone
  ponownie na wyraźne polecenie właściciela projektu ("New app standards aktualizacja... Ostatnia
  wersja 2.19"), `git fetch`+`git pull` w lokalnym klonie `new-app-standards`
  (`92b7bcf..741352e`, 1 nowy wpis `AKTUALIZACJE.md`).** Treść nowego wpisu dotyczy wyłącznie
  wewnętrznego mechanizmu procesowego samego repo `new-app-standards` (pierwszy live-test
  zaplanowanej Routine U.4 — self-bind działa, z opóźnieniem do końca tury; doprecyzowanie, że w
  środowisku z wyznaczonym branchem "commit+push na main" realizuje się jako PR+merge) — **U.4
  dotyczy tylko sesji nad `new-app-standards`, nie Y.6 tego projektu**, zero nowej reguły
  zastosowania w tym repo. Mimo to plik GOD BOOK (NIETYKALNE, mirror) nadpisany w całości pod
  nową nazwą (rename `git rm`+nowy plik), odsyłacze do nazwy poprawione we wszystkich bieżących
  wskazaniach (`CLAUDE.md`, `USTALENIA.md`, `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `.claude/skills/standards/SKILL.md`,
  `docs/standards/00-filozofia.md`, `docs/standards/00-INDEKS.md`, `PROMPT_STARTOWY.md`, nagłówek
  `docs/lista-do-zrobienia.md`) — historyczne wzmianki starszych wersji nietknięte (Część D GOD
  BOOK). Zweryfikowano `grep -rln "v2_18"` po synchronizacji — zero trafień poza tym logiem (który
  używa formatu `v2.18` z kropką, nie nazwy pliku, celowo nietknięty).
- **2026-09-16 (czwarta synchronizacja tego dnia) — 7 wpisów `AKTUALIZACJE.md` (wiersze 67-73),
  GOD BOOK bez zmiany wersji (nadal v2.19).** Pełne przetworzenie każdego wiersza: `docs/lista-do-zrobienia.md`,
  szczegóły uzasadnień: sekcja "Decyzje i uzasadnienie" niżej. W skrócie: jedno konkretne zadanie
  kodowe (7.3 — `scripts/check-csp-hash.mjs` w CI), reszta albo już spełniona (18.5/17.4/17.8),
  albo nie dotyczy tego projektu (71/73), albo czysto procesowa (69).
  **Wynik checklisty Y.9 (spot-check istnienia, nie tylko domniemanie z poprzednich sprawdzeń):**
  1. `docs/standards/` — ✅ (5 plików nadpisanych tą synchronizacją).
  2. GOD BOOK — ✅ v2.19 (bez zmiany wersji w tej partii).
  3. `CLAUDE.md` — ✅ istnieje, bez zmian wymaganych tą partią.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ (wpis dopisany).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, bez zmian wymaganych tą partią.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją.
- **2026-09-20 (piąta synchronizacja tego dnia, na wyraźne polecenie właściciela projektu —
  "zrób aktualizacje" przed rozpoczęciem Modułu 4/Modułu 2 wampirów) — `AKTUALIZACJE.md` sprawdzone
  do końca (wiersz 84, GOD BOOK v2.19→v2.20), plus mechaniczna re-weryfikacja wierszy 61-76
  (16.09.2026) przeciw obecnemu stanowi kodu, nie tylko przeciw deklaracji tego logu.**
  **Nowa treść (wiersz 84): GOD BOOK Y.8 — archiwizacja `docs/wklad-do-standardu.md`.** Plik jest
  append-only i rośnie bez końca; nowa reguła: cyklicznie przenosić wpisy w pełni zamknięte (status
  `✅ skonsolidowane`/`✅ przekazane`, bez otwartej dalszej akcji) do nowego,
  `docs/wklad-do-standardu-archiwum.md`, zostawiając w żywym pliku wskaźnik. **Wykonane od razu, w
  tej samej sesji** (nazwana wprost jako "Akcja dla inzynier-offgrid-pro" w tym wierszu): 12 z 16
  wpisów przeniesionych do nowego `docs/wklad-do-standardu-archiwum.md` (9.3/9.0a AI w produkcie,
  rozdz. 18 logowanie, 18.5 Supabase + CSRF Server Actions, 7.3 CSP nonce, 8.4a audyt pokrycia,
  15.19/15.20/15.7a wzorce procesowe, 5.7 autosave) — żywy plik spadł z 1102 do 572 linii. Przy
  okazji naprawiona drobna nieścisłość we własnym wpisie (cytowany numer sekcji "8.2" zamiast
  faktycznego "8.4a", `docs/standards/08-ui-ux.md` — pomyłka w cytowaniu, nie w treści merytorycznej,
  poprawiona dopiskiem w archiwum, Y.2.1 dryf bez świadomej decyzji). 4 wpisy zostają w żywym pliku
  jako wciąż otwarte (procedura materiałów źródłowych i biblioteka norm — czekają na sesję nad
  `new-app-standards`; wielojęzyczność — punkt C6 tłumaczenia treści bezpieczeństwa-krytycznych
  świadomie nierozstrzygnięty; CI referencyjny/i18n-guard — status cofnięty do "nowe" 16.09.2026 po
  incydencie PR #9, wciąż czeka).
  GOD BOOK podmieniony w całości (`...v2_19.md` → `...v2_20.md`, `git rm`+nowy plik, NIETYKALNE);
  odsyłacze do wersji poprawione we wszystkich bieżących wskazaniach (`CLAUDE.md`, `USTALENIA.md`,
  `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`,
  `.claude/skills/standards/SKILL.md`, `docs/standards/00-filozofia.md`, `docs/standards/00-INDEKS.md`,
  `PROMPT_STARTOWY.md`, nagłówek `docs/lista-do-zrobienia.md`) — historyczne wzmianki starszych
  wersji nietknięte.
  **Re-weryfikacja wierszy 61-76 (16.09.2026) — zweryfikowane programistycznie, nie z metryczki:**
  spot-checki kodu potwierdzają, że wszystkie punkty z jawnie nazwaną "Akcja dla inzynier-offgrid-pro"
  są już zaimplementowane: `middleware.ts` generuje nonce per-request (`crypto.randomUUID()`,
  nagłówki `x-nonce`/`Content-Security-Policy`) zgodnie z korektą 7.3 (wiersz 74); `lib/i18n/language.ts`
  i `lib/i18n/storage.ts` używają wyłącznie `localStorage`/`navigator.languages`, zero cookie/serwera,
  zgodnie z korektą architektoniczną 17.4/5.3 offline-first (wiersz 76, zastępuje wcześniejszą
  "Akcja: migracja cookie+middleware jak zero-waste" z tego samego dnia — świadomie NIE wykonana,
  poprawnie). Pozostałe wiersze 61-73/75 nie miały nazwanej akcji dla tego projektu albo dotyczą
  wyłącznie innych projektów rodziny (zero-waste/szkieletowy-pro) — bez działania tutaj.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ bez zmian merytorycznych tą partią (tylko odsyłacze do wersji GOD BOOK).
  2. GOD BOOK — ✅ podmienione na v2.20.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, odsyłacz zaktualizowany.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, przycięty do wpisów wciąż otwartych (Y.8).
  6a. `docs/wklad-do-standardu-archiwum.md` — ✅➕ **nowy plik**, pierwsza archiwizacja (Y.8).
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz w
     pierwszym zaktualizowany.
  Zweryfikowano: `grep -rln "v2_19"` po synchronizacji — zero trafień w całym repo poza historycznymi
  wzmiankami w tym logu (Część D GOD BOOK, append-only, celowo nietknięte).

- **2026-09-20 (kolejne sprawdzenie tego dnia, Routine Y.6 cykliczny co ≤3h) — sprawdzono
  `AKTUALIZACJE.md`, znaleziono 1 nowy wpis od poprzedniej synchronizacji (wiersz wyżej, PR #134,
  v2.20): rename GOD BOOK v2.20→v2.21 (commit `74d21fc` w `new-app-standards`, nowa GOD BOOK C.5 —
  bezpieczny zakres wyszukaj-zamień przy zmianie nazwy pliku wersjonowanego, zebrana po korekcie
  błędnego nadpisania historycznego wiersza z 16.09 przy poprzednim renamie). Zero zmian
  merytorycznych w `docs/standards/00–16` tą partią — 8.4a/5.7/15.19/15.20/15.7a/17.1a/9.0a
  (wpisy `AKTUALIZACJE.md` z 20.09 sprzed tego sprawdzenia) były już zsynchronizowane poprzednią
  partią (PR #134/#135), zweryfikowane `diff` plik-po-pliku — brak rozbieżności poza wskaźnikiem
  wersji.
  Wykonane: GOD BOOK podmieniony w całości (`...v2_20.md` → `...v2_21.md`, `git rm`+nowy plik,
  NIETYKALNE); odsyłacze do wersji poprawione we wszystkich bieżących wskazaniach (`CLAUDE.md`,
  `.claude/skills/standards/SKILL.md` — PATCH, zachowana lokalna adaptacja; `docs/standards/00-INDEKS.md`,
  `docs/standards/00-filozofia.md`, `PROMPT_STARTOWY.md` — pełne nadpisanie NIETYKALNE; `00_Biblia.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `USTALENIA.md`, `ZASADY_APLIKACJI.md` — punktowa poprawka
  wskaźnika) — historyczne wzmianki starszych wersji w `docs/memory.md`/`docs/lista-do-zrobienia.md`
  celowo nietknięte (GOD BOOK C.5).
  **Krok 6 Routine (przegląd `docs/wklad-do-standardu.md` pod kątem wpisów 🔎):** wszystkie 4 otwarte
  wpisy sprawdzone przez realne porównanie treści z aktualnym `new-app-standards` (nie domysł) —
  3 w pełni skonsolidowane, oznaczone ✅ z odnośnikiem: procedura przetwarzania materiałów źródłowych
  (`docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md`), biblioteka norm (`docs/biblioteka-norm/`,
  pliki fizycznie skopiowane od 15.09.2026, kwestia licencji PKN rozstrzygnięta), CI referencyjny +
  i18n-guard (`docs/przyklady/ci/`, `docs/przyklady/i18n/`). Wielojęzyczność (wpis 14.09) oznaczona
  ✅ częściowo — punkty 1–5 i B.3 skonsolidowane (17.1a), punkt C6 (tłumaczenie treści
  bezpieczeństwa-krytycznych) pozostaje otwarty, brak odpowiednika w standardzie, świadomie
  zostawiony. Żadna edycja `new-app-standards` — repo dołączone wyłącznie do odczytu.
  **Krok 5a (moduły opcjonalne Y.10):** sprawdzony rejestr w GOD BOOK — nadal tylko 2 pozycje
  (playbook + biblioteka norm), obie już obecne w tym projekcie. Brak nowych modułów do
  zaproponowania.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ bez zmian merytorycznych tą partią (tylko odsyłacze do wersji GOD BOOK).
  2. GOD BOOK — ✅ podmienione na v2.21.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, treść nietknięta (LOKALNE).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, 3 wpisy potwierdzone skonsolidowane, 1 częściowo
     (patrz wyżej), reszta bez zmian.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz w
     pierwszym zaktualizowany, drugi bez odsyłacza do wersji (bez zmian).
  Zweryfikowano: `grep -rln "v2_20"` po synchronizacji — zero trafień w całym repo poza historycznymi
  wzmiankami w `docs/memory.md`/`docs/lista-do-zrobienia.md` (Część D GOD BOOK, append-only, celowo
  nietknięte) i `README.md` (nigdy nie kopiowany, projekt-specyficzny).

- **2026-09-20 23:00 UTC (kolejne cykliczne sprawdzenie, Routine Y.6 co ≤3h) — brak nowości.**
  `git fetch origin main` w klonie `new-app-standards` — `HEAD` bez zmian, wciąż `80fc1c3` (ten sam
  commit co przy poprzednim sprawdzeniu ~2 minuty wcześniej). `AKTUALIZACJE.md` bez nowych wierszy
  od rename'u v2.20→v2.21 opisanego wyżej. Zero działania: GOD BOOK, `docs/standards/`, wskaźniki
  wersji i `docs/wklad-do-standardu.md` już aktualne z poprzedniego wpisu — nie ma nic do
  ponownego domykania. PR #136 (poprzednia partia) wciąż otwarty, czeka na CI/mergea, nieprzemergowany
  jeszcze do `main` — kolejne sprawdzenie za ≤3h ponownie zweryfikuje `origin/main` niezależnie od
  stanu tego PR-a.

**⚠️ (2026-09-20 23:0x UTC) Znany blocker CI, zgłoszony wprost przez właściciela projektu: GitHub
Actions dla tego repo nie działa do 1 października 2026 (limit minut/uruchomień konta wyczerpany).**
Potwierdzone technicznie na PR #136: `get_check_runs` → 0, `list_workflow_runs` dla gałęzi → 0 —
workflow `.github/workflows/ci.yml` w ogóle się nie kolejkuje (nie "czerwone", nie flaky — po prostu
nie startuje). **Nie jest to usterka do naprawienia w kodzie ani w YAML-u** — to limit na poziomie
konta/organizacji GitHub, poza kontrolą tego repo. Usunięty wcześniej zaplanowany check-in
(`trig_01FtWAXrja2sNSUAqoA2igRs`, próbowałby błędnie "diagnozować i naprawiać" brak CI jako
problem repo) — subskrypcja `subscribe_pr_activity` na PR #136 pozostaje aktywna i wystarczy
(webhook, nie polling) do wyłapania realnych zdarzeń (push, review, ewentualny powrót CI). **Dla
przyszłych sesji: przed 1 października nie oczekuj zielonego CI na żadnym PR w tym repo — brak
check runs nie oznacza błędu w zmianie.** Merge PR-ów w tym oknie wymaga świadomej decyzji
właściciela projektu (merge bez CI albo poczekać do 1.10) — nie do rozstrzygnięcia samodzielnie
przez AI.

**⚠️ KOREKTA (2026-09-20 23:1x UTC) — sprzeczność ze zweryfikowanym wcześniej dziś ustaleniem, nie
rozstrzygnięta.** Wpis wyżej ("limit Actions do 1.10") zapisano jako fakt na podstawie samego
stwierdzenia właściciela projektu, **bez ponownej weryfikacji** — naruszenie własnej zasady "nie
przedstawiaj hipotez jako faktów" (ten sam błąd co już raz udokumentowany w tym pliku przy PR #132,
patrz sekcja "Anulowany job CI przy PR #132" niżej). Tamten wpis, zweryfikowany **bezpośrednio przez
GitHub API tego samego dnia**, ustalił: `inzynier-offgrid-pro` to repo **publiczne**, GitHub Actions
na standardowych runnerach dla repo publicznych jest darmowe i nielimitowane, limit 2000 min/mies.
dotyczy wyłącznie repo prywatnych na koncie — wniosek: "CI dla tego repo NIE jest ograniczane
limitem minut". To wprost sprzeczne z wpisem wyżej. Zgłoszone właścicielowi projektu w tej samej
sesji (pokazane A/B) — polecił mergować mimo to, standardowym pakietem manualnym zamiast CI
(zrobione, PR #136 zmergowany `f68223c`, wszystko czyste: lint/typecheck/i18n-guard/test 1022/1022/
build/audit:gate). **Przyczyna sprzeczności NIEROZSTRZYGNIĘTA** — możliwe wyjaśnienia: zmiana
widoczności repo/planu między weryfikacjami, inny limit niż Actions (np. limit sesji/kont Claude),
albo któraś z dwóch weryfikacji była niepełna. Dla przyszłych sesji: **nie zakładaj żadnej z dwóch
wersji jako pewnika** — przy następnym PR sprawdź wprost (`get_check_runs`/`list_workflow_runs` +
w razie wątpliwości `GET /repos/.../` dla `private`/`visibility`), zanim zapiszesz cokolwiek jako
fakt.

- **2026-09-23 — synchronizacja na polecenie właściciela projektu ("zaktualizuj stan repo na
  komputerze, sprawdź rozjazd i przeprowadź aktualizację zgodnie z procedurą").** Lokalny checkout
  `inzynier-offgrid-pro` był 84 commity za `origin/main` (fast-forward, bez konfliktów; lokalna,
  niecommitowana zmiana `pnpm-workspace.yaml` — `allowBuilds: unrs-resolver: false` — zostawiona
  nietknięta, poza zakresem). Klon `new-app-standards`: `git fetch` (Y.6 1a), `HEAD` = `origin/main`
  = `6fc7140`. Od ostatniej synchronizacji (`80fc1c3`, 20.09) **7 nowych wierszy `AKTUALIZACJE.md`**
  (v2.21→v2.28): Y.11 (audyt zgodności KODU, na żądanie/koniec Fazy — nie cyklicznie), Y.11 poz. 6
  (reguła 9.0), korekta zakresu 17.1a/5.7/18.1 (obowiązkowe też w istniejących projektach), 17.7b
  (selektor języka tylko dla języków kompletnych), rozdz. 13 (Capacitor na stałe, 13.4–13.6,
  macOS/iPad/Linux/Huawei/Xiaomi).
  Przed nadpisaniem zweryfikowane: każdy z 7 lokalnych plików NIETYKALNE był identyczny z wersją
  źródła w `80fc1c3` — czysty dryf, zero lokalnych modyfikacji do stracenia.
  Wykonane: nadpisane w całości (NIETYKALNE) `docs/standards/00-INDEKS.md`, `00-filozofia.md`,
  `05-baza-danych-offline.md`, `13-droga-mobile.md`, `17-i18n.md`, `18-logowanie.md`,
  `PROMPT_STARTOWY.md`; GOD BOOK `...v2_21.md` → `...v2_28.md` (`git rm` + nowy plik); wskaźnik
  wersji poprawiony punktowo (C.5) w `CLAUDE.md`, `.claude/skills/standards/SKILL.md`,
  `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `USTALENIA.md`, `ZASADY_APLIKACJI.md`. Po
  synchronizacji `diff` całego `docs/standards/` + `PROMPT_STARTOWY.md` ze źródłem — zero różnic;
  `grep "v2_21"` — trafia wyłącznie w historię tego logu i CHANGELOG samego GOD BOOK (celowo).
  **Krok 5a (Y.10):** rejestr modułów opcjonalnych bez nowych pozycji; oba istniejące moduły
  (playbook, biblioteka norm) projekt ma od dawna w `docs/propozycje-do-new-app-standards/` — bez
  akcji.
  **Krok 6 (`docs/wklad-do-standardu.md`):** bez nowych wpisów od 20.09; jedyny otwarty punkt
  (C6 — tłumaczenie treści bezpieczeństwa-krytycznych) nadal bez odpowiednika w standardzie.
  **Znaleziska wymagające decyzji właściciela (NIE naprawiane — Y.11 nigdy nie poprawia kodu
  samodzielnie):**
  1. ⚠️ **17.7b** — `components/jezyk-wybor.tsx` renderuje wszystkie `SUPPORTED_LANGUAGES`
     (pl/en/ru) bez filtra kompletności, a migracja i18n trwa (17.9; `check-i18n-guard.mjs`
     obejmuje tylko `MIGRATED_MODULES`, a jego własny komentarz mówi, że reszta modułów "świadomie
     zwraca gotowy tekst PL"). Wybór en/ru daje więc dziś UI mieszane PL+EN/RU — wprost nazwane
     naruszenie 17.7b. (Stopień niekompletności nie zmierzony dokładnie w tej sesji.)
     **Decyzja właściciela (23.09.2026): "nic na razie nie ukrywaj, dopóki tłumaczenie nie będzie
     skończone"** — świadome, tymczasowe odstępstwo od 17.7b (Y.2: świadoma decyzja, nie dryf).
     Przełącznik zostaje bez zmian do zakończenia migracji i18n; nie "naprawiać" samodzielnie.
     Po skończeniu tłumaczenia en/ru odstępstwo wygasa samo.
  2. ✅ **18 (Huawei/magic link)** — `app/auth/login/actions.ts` ma magic link jako pełnoprawnego
     dostawcę obok Google/Apple — wymóg spełniony.
  3. ℹ️ **Y.11** — `docs/audyt-zgodnosci-kodu.md` nie istnieje; pierwsze uruchomienie Y.11
     (na żądanie albo na koniec Fazy/Etapu) do rozważenia przez właściciela.
  4. ℹ️ **Rozdz. 13 (Capacitor)** — tylko świadomość; projekt nie jest jeszcze na etapie buildu
     natywnego.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ zsynchronizowane (6 plików nadpisanych, 20 plików = komplet źródła).
  2. GOD BOOK — ✅ podmienione na v2.28.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md`/pełna Biblia — ✅ (ten wpis; `00_Biblia.md` z odsyłaczem zaktualizowanym).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, treść nietknięta (LOKALNE).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, bez zmian.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz
     w pierwszym zaktualizowany.

