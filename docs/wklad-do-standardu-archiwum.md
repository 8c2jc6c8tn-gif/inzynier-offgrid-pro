# docs/wklad-do-standardu-archiwum.md — Inżynier Offgrid Pro

Archiwum w pełni zamkniętych wpisów `docs/wklad-do-standardu.md` (GOD BOOK Y.8, archiwizacja). Zawiera dosłowne kopie 1:1 (treść, data, status) wpisów ze statusem „✅ skonsolidowane w standardzie” bez otwartej dalszej akcji. Plik append-only — nic nie edytujemy wstecz. Ostatnie przeniesienie: 03.10.2026 (13 wpisów).

---

[24.09.2026] KATEGORIA: DOBRA PRAKTYKA — biblioteki z własnym Web Workerem (MapLibre GL 6 i podobne)
po zbundlowaniu przez Next.js: kopia workera w `public/` robiona w `predev`/`prebuild`, nie w repo

Szczegóły: MapLibre GL 6 tworzy worker z pliku leżącego obok własnego modułu (`new URL("./maplibre-gl-worker.mjs",
import.meta.url)`). Po zbundlowaniu (Turbopack) ten plik nie istnieje pod wyliczoną ścieżką — mapa
rysowała tło, ale nic więcej, a w konsoli było tylko "Worker failed to load". Rozwiązanie, które
zadziałało: skrypt `scripts/kopiuj-maplibre-worker.mjs` uruchamiany jako `predev` i `prebuild` kopiuje
worker (i moduł, który worker importuje względnie) z `node_modules` do `public/maplibre/`, katalog jest
w `.gitignore`, a kod wskazuje kopię przez `setWorkerUrl`. Kopia zawsze pasuje do wersji z lockfile'a,
w repo nie ma skopiowanego kodu biblioteki. Do tego CSP potrzebuje `worker-src 'self' blob:`. Przy tej
samej pracy: szablonowy nagłówek `Permissions-Policy: geolocation=()` po cichu wyłączał GPS w całej
aplikacji — nowa funkcja korzystająca z API przeglądarki (GPS, kamera, mikrofon) musi zacząć od
sprawdzenia nagłówków bezpieczeństwa, bo przeglądarka odmawia bez czytelnego błędu w UI.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z mapą, PDF.js, edytorem kodu albo
inną biblioteką z workerem trafi na ten sam problem, a "Worker failed to load" nie wskazuje przyczyny.
Rozdział 11 (CI/deployment) albo 07 (bezpieczeństwo — CSP `worker-src`, Permissions-Policy) mógłby mieć
krótką notę: "biblioteka z workerem → kopia w prebuild do public/ + `worker-src`; nowe API przeglądarki →
najpierw Permissions-Policy".

Status: ✅ skonsolidowane w standardzie (24.09.2026) — `docs/standards/11-ci-deployment.md` nowa
**11.7** (kopiowanie pliku zależnego od `node_modules` do `public/` skryptem `predev`/`prebuild`,
nigdy commitowane) + `docs/standards/07-bezpieczenstwo.md` dopisek do **7.3** (`worker-src 'self'
blob:`) i nowy punkt checklisty **7.4** (nowa funkcja API przeglądarki zaczyna od sprawdzenia
`Permissions-Policy`). Źródło potwierdzenia: `AKTUALIZACJE.md` w `new-app-standards`, wiersz
2026-09-24, GOD BOOK bez zmiany numeru wersji dla tego wiersza. Sprawdzone przy Y.6 24.09.2026
(sesja `claude/y6-adaptive-20260924`) — do zastosowania w tym projekcie przy pełnej synchronizacji
NIETYKALNE (`docs/standards/11`, `07`), jeszcze nie zaaplikowane lokalnie, patrz `docs/memory.md`.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — zapowiedź "pełne wyliczenie później" w rejestrze pokrycia jako sposób, w jaki Dyrektywa #14 (rejestruj natychmiast) jest omijana po cichu

Szczegóły: sekcja rejestru pokrycia Modułu 3 (04.09.2026) zawierała zdanie "pełne wyliczenie
per-funkcja całego modułu — nadal osobny, nie rozpoczęty krok". Zdanie było uczciwe, ale przez 3
tygodnie nikt go nie wykonał, a audyt kompletności (GOD BOOK Część N, 05.09.2026) je przepuścił —
sprawdzał, czy istniejące wiersze zgadzają się ze źródłem, a nie czy KAŻDA pozycja źródła ma wiersz.
Skutek: 17 z 30 pozycji źródła bez wiersza (niewidoczne, niepoliczalne), odkryte dopiero na starcie
sesji budowy tego modułu, prostym grepem nazw ekranów źródła w rejestrze.

Dlaczego warto zgłosić do new-app-standards: każdy projekt z rejestrem pokrycia (14.1) i dużą
specyfikacją źródłową może mieć tę samą lukę — zapowiedź odroczonego wyliczenia wygląda jak
świadome, udokumentowane "todo", a działa jak brak wiersza. Propozycja: (a) w GOD BOOK N.1 dodać
krok "dla każdego modułu: liczba pozycji źródła = liczba wierszy rejestru (grep nazw/ID), a nie
tylko zgodność istniejących wierszy"; (b) zdanie typu "pełne wyliczenie później" w rejestrze
traktować jako otwartą pozycję listy zadań z terminem (B.6/15.22), nie jako stan akceptowalny.

Status: ✅ skonsolidowane w standardzie (25.09.2026) — GOD BOOK v2.39 **N.1** (kompletność źródło → rejestr, liczbowo; placeholder "wyliczenie później" = brak wiersza) + dopisek w standardzie **14.1**. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersz 2026-09-25.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — materiały źródłowe chronione prawem autorskim (normy PKN/IEC) a publiczne repozytorium

Szczegóły: GOD BOOK B.5 każe trzymać każdy oryginalny materiał źródłowy w `docs/zrodla/` w
niezmienionej formie. W tym projekcie repozytorium jest publiczne, a `docs/zrodla/` zawiera PDF-y norm
PKN/IEC oraz `.md` z przepisaną treścią rozdziałów — dosłowne wykonanie B.5 publikuje materiały
licencjonowane. Nowa norma (25.09.2026) miała dodatkowo nadruk licencji jednostanowiskowej z zakazem
umieszczania w sieci i znak wodny z danymi osobowymi pobierającego. AI zatrzymało zapis i zapytało
właściciela; oryginał został poza repo, w repo tylko notatka robocza z liczbami używanymi w kodzie.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny liczący wg norm trafi na to samo.
Propozycja do B.5: przed zapisem materiału do `docs/zrodla/` sprawdzić (1) widoczność repozytorium,
(2) nadruki licencji/praw autorskich, (3) dane osobowe w znakach wodnych; dla materiału chronionego w
repo publicznym — oryginał poza repo, w repo notatka robocza (numer punktu/tablicy + liczby używane w
kodzie), z odnotowaniem, gdzie przechowywany jest oryginał. Przepisanie całości do `.md` nie jest
obejściem — chroniona jest treść, nie format.

Status: ✅ skonsolidowane w standardzie (25.09.2026) — GOD BOOK v2.39 **B.5**, rozstrzygnięte inaczej niż propozycja: do startu aplikacji wszystkie oryginały w `docs/zrodla/` repo projektu (bez wyjątków ze względu na rodzaj materiału), po starcie przeniesione do `new-app-standards` (`docs/biblioteka-norm/` dla norm). Źródło: `AKTUALIZACJE.md`, wiersz 2026-09-25.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — komponent pola formularza nie może budować `id` wyłącznie z etykiety

Szczegóły: wspólny komponent `Pole`/`PoleSelect` generuje `id` z tekstu etykiety. Gdy ten sam formularz
powtarza się w liście (karty źródeł ciepła, powierzchnie, pozycje), N pól dostaje to samo `id` — `<label
for>` wiąże się tylko z pierwszym, czytnik ekranu i kliknięcie w etykietę trafiają w złe pole, a testy
Playwright `getByLabel` znajdują jeden element. Błąd niewidoczny w typecheck, lint i testach jednostkowych;
wyszedł dopiero w teście przeglądarkowym nowego ekranu. Wstępny skan statyczny wskazał kilkadziesiąt
ekranów z polami w `.map()` bez jawnego `id` (do weryfikacji w przeglądarce).

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny ma ten sam wzorzec komponentu pola
(standard, rozdział UI). Propozycja: (a) komponent pola generuje `id` przez `useId()` (React 18+),
etykieta tylko jako czytelny prefiks; (b) albo reguła: pole w liście zawsze z jawnym `id`; (c) w
checkliście testów przeglądarkowych — sprawdzenie zduplikowanych `id` na stronie
(`document.querySelectorAll('[id]')` → duplikaty = błąd).

Status: ✅ skonsolidowane w standardzie (25.09.2026) — `docs/standards/08-ui-ux.md` dopisek do **8.10** (`id` pola z `useId()`, nigdy z etykiety). Źródło: `AKTUALIZACJE.md`, wiersz 2026-09-25.

[26.09.2026] KATEGORIA: DOBRA PRAKTYKA — strażnik i18n sprawdza też kompletność własnej listy modułów

Szczegóły: 17.9 opisuje strażnika z listą zmigrowanych modułów, a zasada „dopisz moduł w tej samej sesji” była w tym projekcie
dwukrotnie pomijana (M6/E1 i 19 modułów w pełni zmigrowanych, ale bez ochrony). Teraz skrypt przechodzi po katalogach modułów
i kończy się błędem, gdy katalog z plikiem silnika nie jest na liście. Przy okazji: reguła AST łapała tylko
`assumptions: [...]` / `const assumptions = [...]`, a nie `assumptions.push("tekst")` — jeden moduł przemycał tak gotowy tekst.

Dlaczego warto zgłosić do new-app-standards: lista „ręcznie dopisywana” rozjeżdża się w każdym projekcie; 17.9 mogłoby
zalecać odwrócenie domyślności (po zakończeniu migracji: wszystkie moduły objęte, wyjątki jawne) oraz wymienić wzorzec
`push` wśród konstrukcji, które strażnik musi rozpoznawać.

Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/17-i18n.md` dopisek do **17.9** (strażnik sprawdza kompletność własnego zakresu) + **11.9** pkt 3. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[27.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak wprost sformułowanego obowiązku commit→push→PR→merge po każdym zamkniętym module/zadaniu (tylko obowiązek zadeklarowania stanu)

Szczegóły: sprawdzone wprost na żądanie właściciela repo, czy standard/GOD BOOK nakazuje commit+push+PR+merge po każdej
większej pracy/module. Wynik: **nie ma takiej reguły** — jest tylko 15.21 (deklaracja stanu commit/push/PR/merge zawsze
jako ostatnie zdanie odpowiedzi) i osobno GOD BOOK v2.39 dopisek "od wersji 2.19" (U.4), który mówi wyłącznie, że w
środowisku z wyznaczonym branchem (Claude Code Remote) intencja self-bind Routine "commit+push na main" realizuje się
jako PR+merge tej samej sesji — to opisuje jeden konkretny mechanizm (Routine Y.6), nie ogólną zasadę dla zwykłej pracy
nad modułami. W praktyce zaobserwowanej w tym repo: gałęzie robocze potrafią rosnąć przez wiele sesji/dni bez PR-a i
mergea do `main` (np. `claude/prep-work-kppxeb` przed tym wpisem: 12 commitów, kilka dni pracy, PR dopiero na wyraźne
polecenie właściciela), podczas gdy równolegle powstawały osobne krótkotrwałe gałęzie (`claude/y6-check-*`,
`claude/sync-*`) merge'owane szybciej. Efekt uboczny braku jawnej reguły: w repo narosło ~15 nigdy niescalonych gałęzi,
z których część (5 gałęzi `y6-check`/`sync-*`/`app-rules-*`) okazała się już martwa — ich jedyna unikalna treść była
później i tak zapisana inną drogą do `main`, więc same gałęzie stały się śmieciem wymagającym ręcznego audytu
(`git branch -r --no-merged`, sprawdzenie każdej pod kątem czy to nie regres).

Dlaczego warto zgłosić do new-app-standards: 15.21 zakłada, że *ktoś* (właściciel albo AI z własnej inicjatywy) i tak
zdecyduje o momencie push/PR/merge — ale bez jawnego progu ("po zamknięciu każdego zadania z listy `docs/lista-do-
zrobienia.md`", "po każdym module", albo "na koniec sesji") decyzja o kiedy scalić zostaje całkowicie do uznania,
co w projektach wielosesyjnych/wielogałęziowych (ta sama rodzina co self-bind Routine) prowadzi do narastania martwych
gałęzi i utrudnia orientację "co jest już w `main`, a co nie". Propozycja: 15.21 albo nowa podsekcja mogłaby dodać
zalecenie domyślnego progu (np. "po zamknięciu pozycji `docs/lista-do-zrobienia.md`, chyba że właściciel prosi o
wsadowanie kilku naraz") oraz rutynowe czyszczenie gałęzi już w pełni pokrytych przez `main` (`git branch -r
--merged`) jako część higieny repo (14.x?), nie tylko ad-hoc audyt na żądanie.

Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` nowa **15.23** + dopisek do 15.21 (commit→push→PR→merge obowiązkowy po większej pracy). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: BŁĄD — chmurka pomocy „?” (8.4) zbudowana na komponencie Tooltip nie otwiera się na ekranie dotykowym

Szczegóły: `components/ui/chmurka.tsx` (`Chmurka`/`PomocPole`, realizacja 8.4 — „?” obok etykiety pola z nazwą,
zastosowaniem i zakresem) był zbudowany na `Tooltip` z Base UI. Na desktopie działał (hover/focus), więc przeszedł
przez wzornik i pierwszy ekran bez uwag. Test Playwright z emulacją telefonu (`devices["Pixel 5"]`, `tap`) pokazał,
że na dotyk chmurka **w ogóle się nie otwiera** — Tooltip z założenia nie reaguje na tap (tak działa większość
bibliotek: tooltip = hover-only). W aplikacji mobile-first to oznacza, że cała warstwa wyjaśnień 8.4 była
niewidoczna dla głównej grupy użytkowników. Naprawa: `Popover` z `openOnHover` (hover zostaje na desktopie,
tap/klik/Enter działają wszędzie), API komponentu bez zmian. Wykryte przypadkiem, przy dodawaniu nowego `pomoc`.
Dlaczego warto zgłosić do new-app-standards: 8.4 każe dać „?” przy każdym polu liczbowym, ale nie mówi, jakim
prymitywem — naturalny wybór („to przecież tooltip”) jest błędny dla każdej aplikacji rodziny działającej na
telefonie (wszystkie, rozdz. 13). Propozycja: 8.4 dopowiada „popover otwierany dotknięciem, nie tooltip hover-only”
+ 10.x: weryfikacja chmurek e2e także z emulacją dotyku, nie tylko myszy.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/08-ui-ux.md` dopisek do **8.4** (`?` otwierany kliknięciem/dotknięciem, nigdy tooltip hover-only). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: BŁĄD / PUŁAPKA — notatka przekazania na niescalonej gałęzi: kolejna sesja powtarza zrobioną pracę

Szczegóły: sesja A zakończyła pracę na własnej gałęzi (bez PR, bez merge), zostawiając w `docs/lista-do-zrobienia.md`
wpis ✅ i notatkę „PRZEKAZANIE DLA KOLEJNEJ SESJI”. Sesja B (nowa gałąź z `main`) przeczytała listę z `main`, gdzie ten
sam wpis był nadal 🔲, i zrobiła identyczną zmianę (D29 — trzy kalkulatory, testy, UI, dokumentacja) drugi raz.
Standard (14.x, GOD BOOK P.2/Y.4) każe czytać listę zadań na starcie, ale zakłada, że lista na `main` jest aktualna —
przy pracy wielu równoległych sesji w chmurze, każda na własnej gałęzi, tak nie jest. Propozycja: (1) krok startu
sesji „`git fetch` + gałęzie `claude/*` zmienione w ostatniej dobie + `git log origin/main..origin/<gałąź>`, a notatkę
przekazania czytać z najnowszej gałęzi, nie z `main`”; (2) sesja kończąca bez merge zapisuje notatkę przekazania także
w miejscu widocznym z `main` (np. PR w stanie draft), albo wprost w prompcie dla kolejnej sesji podaje nazwę gałęzi.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` **15.23** pkt 3–4 (lista zadań i ślad gałęzi na gałęzi domyślnej, start z przeglądem niescalonych gałęzi). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ (zgłoszenie właściciela repo) — lista zadań zawsze aktualna na `main` + ślad ostatniej gałęzi + obowiązkowy commit→push→PR→merge po skończonej pracy

Szczegóły: bezpośrednia reakcja właściciela repo na wpis wyżej (28.09.2026, duplikat D29) i rozwinięcie wpisu z
27.09.2026 (brak obowiązku commit→push→PR→merge). Właściciel prosi o trzy reguły, które razem zamykają tę klasę błędów:
(1) **`docs/lista-do-zrobienia.md` aktualizowana zawsze na `main`**, niezależnie od gałęzi, na której toczy się praca —
zmiana statusu zadania (🔲→🔄→✅) i notatka „PRZEKAZANIE DLA KOLEJNEJ SESJI” trafiają na `main` od razu, a nie dopiero
razem z kodem przy (ewentualnym) merge'u; (2) **ślad ostatniej gałęzi** — lista na `main` zawsze podaje, na jakiej gałęzi
pracowała ostatnia sesja i co tam leży niescalone (nazwa gałęzi, ostatni commit, co zrobione, co jest następnym
krokiem), także gdy gałąź nie została scalona, żeby kolejna sesja startująca z `main` wiedziała, skąd przejąć pracę,
zamiast ją powtarzać; (3) **commit → push → PR → merge po skończonej pracy jest obowiązkowy**, nie „do uznania” — po
zamknięciu zadania z listy sesja scala swoją gałąź do `main` (z pełnym lokalnym pakietem kontroli przed merge'em, gdy CI
jest niedostępne), więc niescalona gałąź staje się wyjątkiem (praca realnie przerwana w połowie), a nie stanem domyślnym.
Reguła (3) sama w dużej mierze usuwa potrzebę (2); (2) zostaje jako zabezpieczenie na przypadek przerwanej sesji.
Dlaczego warto zgłosić do new-app-standards: problem nie jest specyficzny dla tego repo — dotyczy każdego projektu
rodziny prowadzonego równoległymi sesjami w chmurze, z których każda dostaje własną gałąź. Obecnie 15.21 wymaga tylko
*zadeklarowania* stanu commit/push/PR/merge, a GOD BOOK P.2/Y.4 każe czytać listę zadań na starcie, zakładając milcząco,
że `main` jest aktualny — obie reguły razem dopuszczają dokładnie scenariusz z wpisu wyżej. Propozycja brzmienia do
rozważenia w sesji nad `new-app-standards`: 14.x — „lista zadań i notatka przekazania żyją na gałęzi domyślnej; każda
zmiana statusu zadania trafia tam od razu, razem z nazwą gałęzi roboczej”; 15.21 — z „zadeklaruj stan” na „po zamknięciu
zadania wykonaj commit→push→PR→merge, chyba że właściciel wprost każe wstrzymać; wtedy zapisz na gałęzi domyślnej, gdzie
leży niescalona praca”. Uwaga praktyczna: w środowisku, w którym sesja ma prawo pushu tylko na wyznaczoną gałąź,
reguła (1) realizuje się przez mały PR+merge samej listy zadań (albo razem z kodem przez regułę (3)).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` nowa **15.23** + dopisek do 15.21 (wpis wcześniej bez linii `Status:`). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: BŁĄD — autozapis szkicu formularza nadpisuje cały stan, więc nowe pole po aktualizacji ma `undefined`

Szczegóły: `lib/adapters/use-persisted-draft.ts` (realizacja 5.1 — zapis Seed formularza do IndexedDB) po odczycie
robi `setStan(zapisany)`, bez scalania z `poczatkowy`. Gdy ekran dostaje nowe pole (tu: pytania o bezpieczeństwo
agregatu, D48), użytkownik ze starym szkicem dostaje `undefined` zamiast `""`. Porównanie `=== ""` przepuszcza wtedy
`undefined` do jądra, a lookup `MAPA[undefined]()` wywala ekran. Testy jednostkowe tego nie łapią (zaczynają od
`STAN_POCZATKOWY`). Wyłapane przy przeglądzie własnego diffu; zabezpieczone lokalnie (`|| null`, `!= null`).
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny z autozapisem 5.1 trafi na to przy pierwszym
nowym polu formularza. Propozycja do 5.1: odczyt szkicu scala `{ ...poczatkowy, ...zapisany }` (albo wersjonuje
kształt Seed), plus 10.x: test „stary szkic bez nowego pola” przy każdej zmianie kształtu formularza.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/05-baza-danych-offline.md` dopisek do **5.5** (odczyt starego szkicu scala stan początkowy) + 8.12. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — mechaniczne sprawdzanie kompletności rejestru twardych stopów (4.3) zamiast polegania na dyscyplinie „dopisz przy każdym module”

Szczegóły: przy budowie M12/E38 okazało się, że żaden stop `critical` całego Modułu 5 (ok. 20 realnych warunków, budowane
13–20.09.2026) nie trafił do `docs/rejestr-twardych-stopow.md`, mimo że reguła 4.3 i nagłówek rejestru każą dopisywać
stop przy każdym nowym module. Nikt tego nie zauważył przez 2 tygodnie — audyt N.1 sprawdzał rejestr pokrycia, nie
rejestr stopów. Wykrycie zajęło minutę: pętla po `lib/core/modules/<moduł>/*/warnings.ts`, wyciągnięcie kodów z
`level: "critical"` i `grep` każdego kodu w rejestrze (generyczne kody walidacji formularza odfiltrować ręcznie).
Dlaczego warto zgłosić do new-app-standards: 4.3 opisuje rejestr jako indeks, ale nie daje mechanizmu kontroli jego
kompletności — w każdym projekcie rodziny z wieloma modułami ten dryf powstaje tak samo (moduł budowany seriami, rejestr
zapominany). Propozycja do rozważenia: w 4.3 lub 10.x — „kompletność rejestru twardych stopów sprawdzana mechanicznie
(skrypt kod `critical` ↔ wpis w rejestrze, z listą świadomych wyjątków), najlepiej jako krok `audit:*` w pakiecie przed
merge'em”, analogicznie do dwukierunkowego `grep` markerów TD# (GOD BOOK X.4).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/04-walidacja-i-twarde-stopy.md` dopisek do **4.3** + `11-ci-deployment.md` nowa **11.9** (strażnik „każdy X ma Y”, lista zapadkowa tylko dla starego kodu). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[29.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ (zgłoszenie właściciela repo) + BŁĄD — „Definicja ukończenia ekranu” musi obejmować komplet warstw użytkowych (autosave, tłumaczenia, „?” przy polach, „i” przy tytule) i mieć strażnika w CI, inaczej reguła nie działa

Szczegóły: standard 8.4 od dawna wymaga „?” przy każdym parametrze liczbowym, a decyzja projektu D34 (28.09.2026)
dodała „nowe ekrany od teraz od razu z chmurkami”. Nikt tego nie sprawdzał mechanicznie. Wynik po jednym dniu: z 220
ekranów tylko 7 miało „?”, a 30 z 36 ekranów zbudowanych **po** D34 (cały nowy moduł M14) znowu bez chmurek — każda
sesja kopiowała sąsiedni ekran, który ich nie miał. Teraz ta sama praca jest robiona drugi raz na ~640 polach, w trzech
językach. Właściciel repo: „wraz z autosave, tłumaczeniem na inne języki musi od razu być dodawana migawka ? i »i«, bo
teraz robimy robotę drugi raz, a to już było mówione, ale nikt tego nie pilnuje”. Rozwiązanie w tym repo (D51):
(1) treść pomocy jako typowany obiekt per ekran w `lib/i18n/pomoc/<moduł>.ts`, EN/RU typowane z kształtu PL — brak
tłumaczenia = błąd kompilacji; liczby ze stałych silnika wchodzą przez parametry `{nazwa}`, nie przepisane;
(2) `scripts/check-pomoc-guard.mjs` (AST TypeScript): każde `<Pole>` ma `pomoc={<PomocPola …/>}` i nie ma `hint=`, każde
surowe `<input>`/`<select>` ma `<PomocPola>` obok, każdy `<NaglowekEkranu>` ma `ekran=` („i”), każda strona z polami ma
`usePersistedDraft` albo komentarz z powodem; (3) **lista zapadkowa** (`pomoc-guard-baseline.json`): stare niezgodne pliki
są na liście, która może tylko maleć (strażnik odrzuca także plik, który już spełnia regułę, a wciąż jest na liście), nowy
plik musi przejść od razu — reguła działa od pierwszego dnia bez „big bang” na 220 ekranach.
Dlaczego warto zgłosić do new-app-standards: to ogólny wzorzec, nie domena off-grid. (a) Każda reguła UI typu „każdy X
ma Y” bez mechanicznego strażnika dryfuje w ciągu dni, bo nowy kod powstaje przez kopiowanie sąsiedniego — ten sam
mechanizm co 17.9 (strażnik i18n), tylko dla pomocy i autosave. (b) 10.4 „Definicja ukończenia” powinna wprost wymieniać
warstwy użytkowe ekranu (autozapis, i18n, pomoc per pole, migawka ekranu), nie tylko „testy przechodzą”. (c) Lista
zapadkowa to sposób na wprowadzenie nowej reguły do istniejącego projektu bez blokowania pracy — warto opisać ją raz
w rozdziale 11 (CI) jako wzorzec dla każdego nowego strażnika. (d) **Kolejność budowy ekranu w 9.0a/17.1a nie wymienia
pomocy** — jest tam „kalkulator → klucze i18n → opis narzędzia AI”, a autosave jest osobno w 5.7. Właściciel repo
(29.09.2026): „tam w zasadach już była kolejność, jak budować ekrany — do tej reguły trzeba dopisać migawki”. Propozycja
jednej, pełnej kolejności dla ekranu: kalkulator + testy → klucze i18n → ekran z autosave → „?” przy każdym polu + migawka
„i”, od razu we wszystkich językach → opis narzędzia AI na końcu. Migawka „i” i `description` narzędzia AI opisują to samo
(do czego służy ekran, kiedy go użyć) — warto zalecić pisanie ich razem. Lokalnie wpisane w Dyrektywę #15 (v1.3).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/08-ui-ux.md` nowa **8.12** (kolejność budowy i DoD ekranu) + **8.4b** (forma „i”: zakładki „Po ludzku”/„Fizyka”) + dopiski 9.0a/5.7/17.1a/10.4 + **11.9**. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[29.09.2026] KATEGORIA: BŁĄD + DOBRA PRAKTYKA — reguła 9.0a („opis narzędzia AI mówi, kiedy go użyć; każdy kalkulator ma narzędzie”) bez strażnika dryfuje tak samo jak pomoc przy polach
Szczegóły: pytanie właściciela repo „czy są rozbudowane opisy funkcji dla AI, żeby dokładnie wiedziało, do czego to służy
i w jakich przypadkach używać”. Stan: 183 narzędzia, 27 bez zdania „kiedy wywołać” (model widzi, co narzędzie liczy, ale
nie, na jakie pytanie usera odpowiada — wybiera gorzej przy ~180 narzędziach naraz), 18 kalkulatorów w ogóle bez
narzędzia (asystent nie może ich użyć i musiałby liczyć sam, co 9.1 zabrania). Wszystkie luki powstały po rolloucie, który
„domknął” opisy — nowe moduły (M7–M9, M14) kopiowały narzędzia bez tego zdania. Rozwiązanie w tym repo:
`scripts/check-ai-tools-guard.mjs` (AST TypeScript, skleja konkatenację literałów): każde `*-tool.ts` ma `description`
z „Użyj, gdy …”, każde jest zarejestrowane w rejestrze narzędzi, każdy `calculator.ts` jest importowany przez jakieś
narzędzie albo ma komentarz `ai-tool: nie dotyczy — <powód>`; brakujące kalkulatory na liście zapadkowej (tylko maleje).
Dlaczego warto zgłosić do new-app-standards: 9.0a warto uzupełnić o (a) obowiązkowe zdanie „kiedy użyć” w stałej,
wykrywalnej formie (tu „Użyj, gdy …”), bo to ono decyduje o wyborze narzędzia przez model, oraz (b) strażnika pokrycia
„kalkulator ↔ narzędzie ↔ rejestr” w CI — ten sam wzorzec co 17.9 i strażnik pomocy (wpis wyżej).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/09-ai-w-produkcie.md` dopisek do **9.0a** („kiedy użyć” w opisie narzędzia + strażnik 11.9). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.
