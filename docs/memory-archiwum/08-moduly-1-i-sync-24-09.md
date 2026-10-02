# Archiwum docs/memory.md — 08-moduly-1-i-sync-24-09

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 6099–6569 stanu sprzed archiwizacji | **Liczba sekcji:** 11
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Konfiguracja Y.6 adaptacyjnego + sprawdzenie 24.09.2026 — GOD BOOK v2.21→v2.37 (16 wersji, NIE zastosowane, propozycja czeka na decyzję właściciela)

[24.09.2026] Pierwsze uruchomienie mechanizmu Y.6 opisanego jako "cykl adaptacyjny 12h→48h"
(zadanie właściciela projektu). `interwał_h = 12` (start), `licznik_zero_z_rzedu = 0`.

**Krok 1 (fetch+porównanie):** lokalny klon `new-app-standards` był 273 commity za `origin/main`
(ostatni fetch dawno, przed D21) — doprowadzony do zgodności (`git merge --ff-only`). GOD BOOK
źródła: `instrukcja-uniwersalna-biblii-projektu-v2_37.md` (rename z `...v2_21.md`, które miał ten
projekt jako ostatnio zsynchronizowane — patrz wpis PR #136 wyżej). Różnica: **16 kolejnych wersji
GOD BOOK (v2.22–v2.37)**, dziesiątki wierszy `AKTUALIZACJE.md` z datami 20–24.09.2026.

**Wynik: DUŻO nowej treści — to NIE jest "zero nowości".** Zgodnie z nową procedurą tego zadania
(Krok 2: "NIE podmieniaj plików samodzielnie, zaproponuj i zakończ turę pytaniem") — **nic z
poniższego NIE zostało jeszcze zastosowane do plików `docs/standards/`/GOD BOOK tego projektu.**
Pełna treść źródłowa: `AKTUALIZACJE.md` w `new-app-standards`, wiersze z datami 2026-09-20 do
2026-09-24 (ostatnie ~25 wierszy loga). Skrót wg kategorii Y.8, do decyzji właściciela:

**NIETYKALNE (pełny nadpis, czeka na zgodę):**
- GOD BOOK: rename `v2_21.md`→`v2_37.md`. Nowe/zmienione części: C.5 (bezpieczny zakres
  find&replace przy renamie pliku wersjonowanego — już zaaplikowane u nas ręcznie 20.09, zgodne),
  Y.11 (nowy, opcjonalny audyt zgodności KODU ze standardem — osobny od Y.6, na żądanie/koniec
  Fazy), Y.12 (kolizja reguły "na stałe dla rodziny" ze starszą decyzją stacku — test Spike),
  Y.6/U.4 (**cykl adaptacyjny 12h→48h — dokładnie to, co ten projekt wdraża dziś, patrz D22**;
  formuła jest teraz identyczna z domyślną GOD BOOK, D21/D22 zamknięte jako w pełni zgodne, zero
  akcji), Część D punkt 7 (weryfikacja merytoryczna materiału źródłowego przy przenoszeniu do
  Biblii, adnotacja ✏️, źródło samo nietknięte), 15.1a/15.1b (nie bać się zgłosić rozjazdu z
  rzeczywistością — przez całą pracę, nie tylko liczby), Część H.3 (kolizja numeracji M#/D# przy
  równoległych sesjach — sprawdź najwyższy numer na `origin/main` przed nadaniem nowego), U.3
  (inwentaryzacja downstream przed akceptacją reguły "na stałe").
- `docs/standards/`: **02** (2.1 — `validFrom`/`validTo`/`legalBasis`/`verifiedBy`/`confidence`
  jako pola strukturalne dla wartości regulowanych prawem — **potencjalnie dotyczy naszych danych
  norm/współczynników bezpieczeństwa**, do sprawdzenia przy Y.11), **03** (3.3 — `INCOMPLETE` jako
  osobny trzeci stan dla modułów obowiązku/ryzyka/zgodności, nigdy dwuwartościowa logika + flaga —
  **do sprawdzenia, czy dotyczy któregoś modułu bezpieczeństwa/doboru u nas**), **05** (5.8–5.11 —
  wzorzec własnego Service Workera bez wtyczki bundlera, aktualizacja przez toast nie cichy
  `skipWaiting`, `navigator.storage.persist()`, kolizja wersji IndexedDB między kartami —
  **projekt nie ma jeszcze PWA/SW w kodzie, więc na razie informacyjne**), **07** (CSP hash-based
  nie `'unsafe-inline'`, `worker-src 'self' blob:`, checklist `Permissions-Policy` przed nową
  funkcją API przeglądarki, `'wasm-unsafe-eval'` nie `'unsafe-eval'`), **08** (8.11 — wzorzec
  wskaźnika offline), **10** (10.8 — E2E offline dla własnego SW), **11** (11.7 — plik zależny od
  `node_modules` kopiowany skryptem `predev`/`prebuild`, nigdy commitowany — **potencjalnie
  dotyczy nas, jeśli mamy podobny wzorzec z jakąś biblioteką**; 11.8 — ryzyko migracji majora:
  wtyczka sprzężona z bundlerem, klasyfikacja zmian wg oficjalnego przewodnika nie z pamięci),
  **13** (przepisany niemal od zera — Capacitor jako technologia mobile/desktop rodziny NA STAŁE,
  nie generyczne "natywne/React Native"; tabela platform macOS=Mac App Store przez Capacitor
  Electron Platform, iPad+Universal Purchase, Linux=PWA, Android poza Google Play; nowe 13.4–13.6
  — **nie dotyczy nas dziś, projekt nie jest na etapie mobile**), **15** (15.1a/15.1b jak wyżej,
  15.21 — deklaracja stanu commit/push/PR/merge zawsze jako OSTATNIE zdanie odpowiedzi, 15.22 —
  `docs/lista-do-zrobienia.md` każdy otwarty wpis niesie priorytet/odblokowuje/plusy-minusy/
  kolizje/kolejność), **17** (17.6 — encje HTML w słowniku i18n muszą być znakami Unicode nie
  encjami; 17.7b/17.7c — selektor języka pokazuje tylko kompletne języki, wyjątek faza
  przedpremierowa bez realnych użytkowników — **dziś dotyczy nas, jesteśmy przedpremierowo**;
  17.9 — generator treści współdzielony między ekranami to jedno zadanie migracji i18n, nie per
  moduł; 17.11 — znane ograniczenie strażnika AST na template-literały w JSX), **18** (18.1
  retroaktywnie obowiązkowe w każdym projekcie, nie tylko nowych).
- Nowy katalog `docs/przyklady/pwa/` (10 plików + README, gotowy wzorzec SW) — do skopiowania
  tylko jeśli/gdy projekt faktycznie zacznie budować PWA/Service Worker (dziś nie ma).
- `PROMPT_STARTOWY.md`, `README.md`, `CLAUDE.template.md`, `.claude/skills/standards/SKILL.md`,
  `docs/standards/00-INDEKS.md`, `00-filozofia.md`, `docs/lista-do-zrobienia.template.md`,
  `docs/memory.template.md`, `docs/przyklady/i18n/*` — wskaźnik wersji GOD BOOK + drobne patche.

**ADAPTOWALNE (patch, czeka na zgodę):** `CLAUDE.md` (wskaźnik wersji GOD BOOK 14→v2_37 gdy owner
zaakceptuje pełny sync; punkt 15.21/15.22 jeśli properyjmiemy — dopisać do "Definicja ukończenia
zadania"/`docs/lista-do-zrobienia.md`), `.claude/skills/standards/SKILL.md` (wskaźnik wersji).

**LOKALNE — znaleziona rozbieżność, NIE naprawiona samodzielnie (zgłoszona właścicielowi, nie
rozstrzygnięta na własną rękę zgodnie z zasadą sprzeczności 15.4):** `AKTUALIZACJE.md` (wiersz
2026-09-24, plik 11-ci-deployment.md/07-bezpieczenstwo.md) przypisuje temu projektowi
("inzynier-offgrid-pro") zgłoszenie DOBRA PRAKTYKA o Web Workerze biblioteki MapLibre GL i pułapce
`Permissions-Policy: geolocation=()` z prośbą "oznaczcie ten wpis jako przekazany w
`docs/wklad-do-standardu.md`". **Nie znaleziono w tym repo:** brak "MapLibre" w historii gita
(`git log --all --grep`), brak wzmianki w `docs/wklad-do-standardu.md` tego repo, brak kodu
Service Workera/PWA w `app`/`lib`. Możliwe wyjaśnienia (nierozstrzygnięte): (a) zgłoszenie
pochodzi z innej, równoległej sesji nad tym samym repo na niezmergowanej gałęzi, (b) błędne
przypisanie źródła po stronie `new-app-standards`. Nic nie oznaczono jako ✅ w
`docs/wklad-do-standardu.md` — nie ma czego oznaczać bez odnalezienia oryginalnego wpisu.

**Co ZASTOSOWANO dziś, bez czekania na zgodę (nie jest to zmiana treści standardu, tylko przyjęcie
mechanizmu cyklu, który i tak już obowiązuje jako nowy domyślny GOD BOOK Y.6/U.4 — patrz D24
`rejestr-decyzji.md`, przenumerowane z pierwotnego D22 przez kolizję ID z równoległą sesją, patrz
niżej i H.3 GOD BOOK):** `CLAUDE.md` punkt 4 zaktualizowany na formułę adaptacyjną (start 12h,
×1,5 do pułapu 48h po zero-wyniku, reset do 12h po realnej zmianie). **Dzisiejsze sprawdzenie
znalazło realną zmianę → `interwał_h` resetuje się do 12 (nie rośnie), `licznik_zero_z_rzedu = 0`.**
Założona samo-przeplanowująca się Routine (self-bind, `trig_01La5dGeB9ycdVpPf2dmYgrk`),
`run_once_at` = 2026-09-25T10:20:00Z (+12h od tego sprawdzenia) — pierwsze uruchomienie po
zakończeniu prac naprawiających kolizję D# (merge z Modułem 1), stąd 8 minut różnicy względem
zapowiedzianego wcześniej 10:12.

**Kolizja numeracji D# przy scalaniu (przypadek H.3, GOD BOOK v2.37):** ten wpis pierwotnie
zapisywał decyzję jako "D22", ale przy scaleniu z `main` okazało się, że równoległa sesja (patrz
niżej, "Moduł 1... 23.09.2026") już zajęła D22/D23 dla architektury MapLibre GL/ULDK i to jej PR
scalił się pierwszy — zgodnie z regułą H.3(c) ("pierwszy scalony zachowuje numer") ta decyzja
przenumerowana na **D24** w `rejestr-decyzji.md` i w tej sekcji. Osobno: `AKTUALIZACJE.md` w
`new-app-standards` (wiersz 2026-09-24, `11-ci-deployment.md`/`07-bezpieczenstwo.md`) przypisuje
temu projektowi zgłoszenie DOBRA PRAKTYKA o Web Workerze MapLibre GL i pułapce
`Permissions-Policy: geolocation=()` — **prawdopodobnie właśnie z tej równoległej sesji Modułu 1**
(MapLibre GL jest dokładnie tą samą biblioteką), co tłumaczyłoby wcześniej niezrozumiałą
rozbieżność; nieodnalezione w `docs/wklad-do-standardu.md` tego repo — możliwe, że zgłoszone z
gałęzi tamtej sesji przed scaleniem, do zweryfikowania z właścicielem, nie rozstrzygnięte tutaj
samodzielnie.

## Moduł 1 (Lokalizacja), Ekrany 2–4 — jądro obliczeniowe (23.09.2026)

Na polecenie właściciela projektu ("zgoda na punkt 1" — Moduł 1 jako następny krok). Wcześniej
(20.09.2026) Moduł 1 świadomie pominięty do czasu decyzji architektonicznej — teraz podjęta:
**D22** w `rejestr-decyzji.md` (MapLibre GL + three.js/R3F + ULDK/PVGIS przez własny Route Handler,
najpierw jądro, potem UI). Wybory właściciela z 4 pytań z opcjami przedstawionymi przez AI.

**Zbudowane (tylko `lib/core`, zero UI, zero nowych zależności npm):**
- `lokalizacja/geometria-slonca/` — wspólny prymityw: pozycja słońca (NOAA Solar Calculator =
  Meeus rozdz. 22/25/28, z refrakcją), cos kąta padania (Duffie–Beckman 1.6.3), masa powietrza
  (Kasten–Young 1989), promieniowanie bezpośrednie clear-sky (Meinel 1976, tylko jako waga
  względna). Testy na przykładach liczbowych Meeusa 25.a (deklinacja −7,78507°) i 28.b (równanie
  czasu 13 min 42,7 s) + kontrole analityczne (przesilenia, równonoc, półkula południowa).
- `lokalizacja/skaner-dzialki/` (E2) — wspólne jądro obu trybów źródła (spacer GPS / Geoportal):
  GPS→płaszczyzna styczna WGS84 (promienie M, N; test: długość stopnia na równiku 110 574 /
  111 320 m), kalibracja znanym wymiarem (tylko poziomo — jawne założenie), azymuty ścian
  (normalna zewnętrzna niezależnie od kierunku obchodzenia), połacie metodą Newella (nachylenie,
  azymut, pole rzeczywiste, odchylenie od płaszczyzny), wysokość kalenicy, przeszkody → układ
  lokalny jako wejście E3.
- `lokalizacja/analiza-zacienienia/` (E3) — przeszkody: drzewo (walec korony) / bryła
  (graniastosłup), kąt = atan((H−z)/d) do najbliższej krawędzi (przecięcie analityczne), próbkowanie
  słońca co 10 min przez cały rok, strata ważona Meinel·cos θ, podział na miesiące i przeszkody,
  scenariusz prognozy z ręcznie podaną wysokością drzew (źródło: "wprowadzana ręcznie" — aplikacja
  nie wymyśla krzywej wzrostu), profil horyzontu 360° do wykresu.
- `lokalizacja/orientacja-powierzchni/` (E4) — model izotropowy Liu–Jordana na godzinowych danych
  PVGIS TMY, optimum wyszukiwane w danych (siatka 5°, potem 1°), wskaźnik = H/H_opt; albedo 0,2
  domyślne i zawsze raportowane.

**Decyzje warte zapamiętania:**
- Liczby przykładowe ze źródła ("94%", "62%", "12%", "południe ~35°") NIE są celem testów ani
  wartościami stałymi — to ilustracje. Testy sprawdzają tożsamości modelu (np. β=0 → H = ΣGHI) i
  wartości z publikacji, nie odtwarzanie przykładów.
- Uczciwy zakres E3: strata promieniowania **bezpośredniego clear-sky**, nie całkowitej energii —
  TD14. E4: konwencja czasu rekordów PVGIS niezweryfikowana — TD15 (sprawdzić przy budowie proxy,
  zanim ktokolwiek użyje realnych danych).
- Wydajność: E4 liczy ~1 s (przeszukiwanie ~1500 orientacji × 8760 h), E3 ~0,15 s — w UI oba
  do Web Workera, żeby nie blokować wątku głównego.
- Po pull 84 commitów `node_modules` było nieaktualne (brak `@anthropic-ai/sdk`, `@supabase/ssr`) —
  `tsc` zgłaszał błędy w nietkniętym kodzie. Naprawione `CI=true pnpm install --frozen-lockfile`
  (bez `CI=true` pnpm przerywa bez TTY: `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`). Lockfile
  bez zmian.

**Zweryfikowane:** 55 nowych testów (14+15+16+10), cały zestaw 1115/1115, `tsc --noEmit` czysty,
lint 0 błędów (2 stare ostrzeżenia `<img>` bez związku), `check:i18n-guard` OK (103 moduły,
4 nowe dopisane), `audit:gate` OK, `pnpm build` OK. i18n PL/EN/RU — 23 nowe klucze.

**Następny krok (UI, D22):** proxy PVGIS/ULDK (Route Handler, CSP `connect-src` tylko do własnego
origin), ekran Skanera z MapLibre GL + spacer GPS, widok 3D (R3F) z mapą cieplną zacienienia,
lista powierzchni E4, i18n + opisy narzędzi AI dla nowych kalkulatorów (kolejność z 20.09:
kalkulator → i18n → opis AI w tej samej sesji — dla tych 3 ekranów opisy AI czekają na UI).

## Proxy PVGIS TMY (23.09.2026) — D22, dane dla Ekranu 4 Modułu 1

Na polecenie właściciela ("potem proxy PVGIS"), zaraz po merge'u jądra Modułu 1 (PR #141).
- `lib/adapters/pvgis/tmy.ts` — czysty parser (zod, kształt sprawdzany na pełnym roku 8760 h,
  promieniowanie ≥ 0) + `pobierzTmy` (stały adres `re.jrc.ec.europa.eu/api/v5_3/tmy`, timeout 30 s,
  kody błędów `PVGIS-*`, nigdy dane zastępcze — 06-api-i-siec.md 6.1). 13 testów.
- `app/api/pvgis/tmy/route.ts` — GET `?lat&lon`, 400/422/502/504 z kodem powodu, sukces z
  `Cache-Control: private, max-age=86400`. CSP `connect-src 'self'` nietknięte (przeglądarka
  woła tylko własny origin).
- **Offset czasu PVGIS (TD15 punkt 1 — rozwiązany):** znacznik HH:00 jest umowny, wartości
  odpowiadają HH:00 + `inputs.location.irradiance_time_offset` (JRC, strona narzędzia TMY;
  SARAH — zależnie od szerokości, Warszawa 0,1832 h; ERA5 — 0,5 h). Adapter dodaje offset.
- **Pułapka zod 4:** `z.coerce.number()` zamienia `null` (brak parametru URL) na 0 — przepuściłoby
  zapytanie bez `lat` jako 0°. Rozwiązanie: `z.string().trim().min(1).pipe(z.coerce.number<string>()...)`
  (jawny typ wejścia `<string>` wymagany przez typy zod 4 w `pipe`). Ten błąd typów przeszedł przez
  `pnpm build`, bo `next.config.mjs` ma `typescript.ignoreBuildErrors: true` — **build nie
  zastępuje `pnpm typecheck`**, zawsze uruchamiaj oba.
- **Weryfikacja na realnych danych (Warszawa, TMY 2005–2023, SARAH3):** GHI 1054 kWh/m²·rok;
  silnik E4: optimum 176°/33°, 1182 kWh/m²; PVGIS PVcalc (`optimalangles=1`) dla tego samego punktu:
  177°/**39°**, **1314 kWh/m²**. Azymut zgodny, nachylenie i wartość bezwzględna nie — nowy **TD16**
  (model izotropowy; hipotezy przyczyny niezweryfikowane) — decyzja o modelu anizotropowym należy do
  właściciela przed UI E4. Route sprawdzony na żywo przez `pnpm dev`: Warszawa 200 (8760 rekordów,
  482 kB), morze 422 ("Location over the sea"), brak/błędny `lat` 400.

**CI — zawężenie nierozstrzygniętej sprawy z 20.09.2026 (sekcja "Synchronizacja ze standardem"):**
zweryfikowane wprost przez API 23.09.2026 ~23:55 CEST: repo `public`, `actions/permissions`
`enabled: true, allowed_actions: all`, workflow `CI` (`.github/workflows/ci.yml`) `active` — a
`GET /actions/runs` zwraca **`total_count: 0` dla całego repo** (nie tylko dla PR #141, który
zmienia `lib/**` i powinien wyzwolić CI mimo `paths-ignore`). Czyli: nie konfiguracja repo ani
workflow, tylko coś na poziomie konta (blokada/limit konta GitHub). PR #141 zmergowany na wyraźne
polecenie właściciela z pełnym pakietem lokalnym zamiast CI (ten sam tryb co PR #136). Przy
okazji: tokenowi `gh` kończy się limit REST (60/h) i GraphQL przy intensywnej pracy — przy
limicie GraphQL `gh pr create` nie działa, `gh api` (REST) tak.

**[24.09.2026] ROZSTRZYGNIĘTE przez właściciela projektu — CI nie działa do końca września 2026,
bo wyczerpały się limity GitHub na koncie** ("CI nie robimy do końca miesiąca, bo nam limity na
git się skończyły — żeby nie próbować znowu i nie tracić czasu"). Zamyka sprzeczność z 20.09.2026
(wersja A "limit Actions do 1.10" vs wersja B "repo publiczne = bez limitu") na korzyść A, zgodnie
z pomiarem z 23.09 (0 uruchomień w całym repo przy włączonych Actions). **Do 30.09.2026 włącznie:**
nie sprawdzać check-runów/workflow runs, nie diagnozować braku CI — merge na pełnym pakiecie
lokalnym (typecheck, lint, check:i18n-guard, test, build, audit:gate). Nota operacyjna także w
`CLAUDE.md` (sekcja "Stan repo") — usunąć ją od 1.10.2026, gdy CI wróci.

**[01.10.2026] CI wróciło (koniec okresu z wpisu wyżej).** Nota „CI NIE DZIAŁA” usunięta z `CLAUDE.md` na polecenie
właściciela projektu. Od teraz merge na zielonym CI, jak przed 24.09. Pierwszy przebieg na `main` trzeba sprawdzić
ręcznie: krok `check:ai-tools-guard` i job `e2e-sw` jeszcze nigdy nie ruszyły w GitHub Actions (`docs/lista-do-zrobienia.md`,
wpis „Powrót CI od 1.10.2026”). Pułapka z tego dnia: przy wyczerpanym limicie GraphQL `gh pr create` nie działa, a
`gh api` (REST) działa.
Druga pułapka (30.09–01.10.2026): przy obciążonej maszynie (inne sesje budują równolegle) `pnpm test` potrafi
zakończyć się kodem ≠ 0 mimo „wszystkie testy passed” — `[vitest-pool]: Timeout terminating forks worker`, za każdym
razem przy innym pliku. To nie błąd testu: ponowne `pnpm test` samo przechodzi z kodem 0. Przed merge zawsze patrzeć na
liczbę testów i treść błędu, nie tylko na kod wyjścia.

## TD16 naprawiony — model Muneera w Ekranie 4 Modułu 1 (24.09.2026)

Decyzja właściciela: wariant (a). Źródło równań: raport JRC EUR 26075 EN (Gracia Amillo, Huld,
2013) — pobrany PDF, równ. 28–31 (zacieniona/zachmurzone: N = 0,25227; nasłoneczniona:
N = 0,00263 − 0,712·Kb − 0,6883·Kb²; korekta h < 0,1 rad; zachmurzenie kt' < 0,3 wg Pereza/Ineichena),
Gsc = 1367 W/m² z tego raportu, mimośród z Duffie–Beckman 1.4.1a. Ten sam raport potwierdza, że
PVGIS stosuje Muneera i że modele izotropowe dają niższe wartości — hipoteza z TD16 potwierdzona.
Wynik na realnych danych (Warszawa): optimum 177°/38° vs PVGIS 177°/39°; wskaźniki powierzchni
±2 p.p. względem PVGIS. Stała różnica −6% wartości bezwzględnej także dla płaszczyzny poziomej →
dane (TMY vs seria 2005–2023), nie model.

**Pułapka testowa:** syntetyczne dane godzinowe próbkowane w HH:00 przy długości 0° dają sztuczną
asymetrię rano/popołudnie (optimum ~184°), którą człon okołosłoneczny Muneera wzmacnia — izotropowy
ją maskował. Naprawione próbkowaniem HH:30, nie poluzowaniem tolerancji; realne dane dają 177°
zgodnie z PVGIS. Wydajność: E4 z Muneerem ~2,5 s na wywołanie (optimum) — w UI koniecznie Web Worker.

## ULDK bezpośrednio z przeglądarki — D23 (24.09.2026)

Przed budową właściciel zapytał o koszt proxy. Ustalone i przedstawione na faktach (sprawdzone na
żywo): PVGIS nie ma CORS i dokumentacja JRC zakazuje wywołań z przeglądarki ("access to PVGIS APIs
via AJAX is not allowed"), limit 30 zapytań/s na IP — proxy konieczne; koszt proxy zmierzony:
~60 ms CPU i ~64 KB (gzip) na pobranie → darmowy plan Vercel Hobby (4 h Active CPU, 100 GB) starcza
na ~200 tys. pobrań/mies. (Hobby tylko niekomercyjnie — przy sprzedaży aplikacji Pro $20/mies.
niezależnie od proxy). ULDK ma `Access-Control-Allow-Origin: *` → właściciel wybrał wariant bez
proxy (**D23**).
- `lib/adapters/uldk/uldk.ts` — `dzialkaWPunkcie` (GetParcelByXY) i `dzialkaPoIdentyfikatorze`
  (GetParcelById), timeout 15 s, kody `ULDK-*`, czysty parser text/plain. Format sprawdzony na
  żywo: "0" + linia pól "|" w kolejności `result`; "-1 brak wyników" przy HTTP 200 (nie traktować
  statusu HTTP jako sygnału sukcesu); WKT "lon lat". MULTIPOLYGON i wiele wyników odrzucane jawnie
  (nie ucinamy/nie wybieramy po cichu); otwory → obrys zewnętrzny + `maOtwory`.
- Fixture: realna odpowiedź dla działki 146510_8.0309.23/3 (publiczne dane katastralne). Test
  spina ścieżkę online z jądrem: obrys ULDK → `calculateSkanerDzialki` → VALID.
- CSP: `connect-src 'self' https://uldk.gugik.gov.pl` — zweryfikowane w przeglądarce (dev):
  ULDK 200, bezpośredni PVGIS i example.org zablokowane z komunikatem naruszenia CSP.
- `GetParcelByIdOrNr` z nazwą obrębu ("Mokotów 1") zwracał pusto — wyszukiwanie po nazwie
  obrębu+numerze nie zbudowane; UI oferuje TERYT albo punkt na mapie/GPS.

## Moduł 1 — UI Ekranów 2–4 (24.09.2026) — D22

Na polecenie właściciela ("UI interfejs ekranów 2–4 (mapa, widok 3D, lista powierzchni)").
Nowe zależności (D22): `maplibre-gl` 6.11, `three` 0.186, `@react-three/fiber` 9.8, `@types/three`.

**Architektura danych między ekranami:** model działki = Seed Ekranu 2 (`usePersistedDraft`, klucz
`skaner-dzialki`); Ekrany 3 i 4 czytają go przez nowy `useOdczytDraftu` (tylko odczyt — jeden
właściciel zapisu) i mają własne drafty (E3: prognoza wzrostu drzew, dach płaski; E4: korekty,
powierzchnie ręczne, albedo). Przeliczenia Seed → wejścia kalkulatorów: `lib/lokalizacja/model-dzialki.ts`
(czyste funkcje, testy). Wyniki nigdy nie są zapisywane (05, 5.1) — tylko Seed i dane PVGIS TMY
(`offgrid.pvgis-tmy.v1`, dane wejściowe, nie wynik).

**Pułapki znalezione i naprawione:**
- `next.config.mjs` miał `Permissions-Policy: geolocation=()` — wyłączało GPS w całej apce (spacer
  GPS nie mógłby działać). Zmienione na `geolocation=(self)`.
- MapLibre GL 6 ładuje worker z pliku OBOK własnego modułu (`new URL("./maplibre-gl-worker.mjs",
  import.meta.url)`) — po zbundlowaniu przez Next plik nie istnieje ("Worker failed to load").
  Rozwiązanie: `scripts/kopiuj-maplibre-worker.mjs` (predev/prebuild) kopiuje worker + moduł
  wspólny do `public/maplibre/` (w .gitignore), mapa wskazuje go `setWorkerUrl`. CSP: `worker-src 'self' blob:`.
- Strona Ekranu 3 nie może statycznie importować nic z `widok-3d.tsx` (ładowanego `next/dynamic`),
  bo three.js wpadłby do bundla strony — wspólne helpery w `components/lokalizacja/mapa-cieplna.ts`.
- Reguła lint `react-hooks/refs`: nie przypisywać `ref.current = props` w renderze — w efekcie.

**Fakty sprawdzone na żywo (24.09.2026):**
- WMS ortofotomapy Geoportalu (`PZGIK/ORTO/WMS/HighResolution`) zwraca poprawne kafle w EPSG:3857,
  choć GetCapabilities deklaruje tylko 2180/4326 — nieudokumentowane; jeśli zniknie, mapa działa dalej
  bez podkładu. CORS odbija origin. Adres `.../StandardResolution` zwraca 404.
- ULDK `GetBuildingByXY` działa (Kraków, Sukiennice: 70 wierzchołków, 2876 m²), ale Warszawa: brak
  wyników — pokrycie budynków niepełne, UI mówi to wprost i kieruje na spacer GPS.
- WMS granic działek KIEG (`integracja.gugik.gov.pl`) przekierowuje (302) — nie użyty.

**Decyzje prezentacji (nie fizyka):** ściany budynku łączone w elewacje przy różnicy azymutu
< 15° (`TOLERANCJA_ELEWACJI_DEG` — obrys z ULDK ma dziesiątki odcinków); zapis PVGIS pasuje do
lokalizacji w promieniu 0,01° (~1 km, piksel SARAH ma kilka km); mapa cieplna E3 = siatka 4×4
punktów na powierzchnię, strata powierzchni = średnia punktów; numerowane znaczniki na mapie tylko
dla zbiorów ≤ 20 punktów.

**Zweryfikowane w przeglądarce (`pnpm dev`):** E2 online — działka po TERYT z ULDK (Kraków, 3828 m²)
i budynek kliknięciem w mapę; E3 — model testowy (dom 10×8 m, dąb 9 m 12 m na południe): połać S
3,8% rocznie, grudzień 31%, prognoza 15 m za 10 lat → 9,1%; E4 — realne dane PVGIS (Warszawa):
optimum 37°/180°, połać S 27° 99%, elewacja S 70%, E/W 53–54%, N 26%. Szerokość telefonu (375 px) bez
poziomego przewijania na wszystkich trzech ekranach.

**Otwarte:** TD14, TD15 (2), TD17 (nowy — przeszkody tylko jako walce). Opisy narzędzi AI — ✅ niżej.

**Opisy narzędzi AI (24.09.2026, 9.3):** `policz_skaner_dzialki`, `policz_zacienienie`,
`ocen_orientacje_powierzchni` (`lib/ai/tools/`, zarejestrowane w `pytaj-asystenta.ts`, wszystkie `read`).
- E2: wejście = współrzędne narożników, NIE numer działki — ULDK wołany tylko z przeglądarki (D23),
  więc narzędzie serwerowe go nie pobiera. Wynik bez punktów lokalnych (dane dla rysunku).
- E3: przeszkody jako odległość + kierunek od paneli (tak user opisuje je w rozmowie); handler
  przelicza na układ lokalny — zamiana współrzędnych, nie model. Budynek = prostokąt z bliższą ścianą
  prostopadłą do kierunku. Profil horyzontu (360 wartości) pominięty w wyniku.
- E4: handler sam pobiera PVGIS TMY (`pobierzTmy`, ten sam adapter co proxy D22) — 8760 rekordów nie
  przechodzi przez model; błąd PVGIS → `INCOMPLETE` + komunikat, bez wyniku. Fabryka z `fetchImpl` dla testów.
- Moduł 1 jest zmigrowany do i18n (ostrzeżenia/założenia jako kody) — nowy helper
  `lib/ai/tools/teksty-wyniku.ts` rozwiązuje je na tekst PL (`t("pl", …)`), bo surowy kod nic modelowi
  nie mówi. Starsze narzędzia przestawione na ten helper w PR #145 — sekcja niżej.

## Narzędzia AI modułów zmigrowanych do i18n — tekst PL zamiast kodu (24.09.2026)

Błąd: 6 starszych narzędzi w `lib/ai/tools/` (`kalkulatory-pomocnicze`, `projekt-uziemienia`,
`monitorowanie-izolacji-imd`, `normy-i-certyfikaty`, `przepust-powietrza`, `zlacza-mc4`) — wszystkie
na kalkulatorach już zmigrowanych do i18n — wysyłały modelowi założenia jako `JSON.stringify({kod})`,
a ostrzeżenia jako `technicalMessage` (surowe, np. `voltageV = -12, oczekiwano > 0`). Naprawione:
wszystkie przez `lib/ai/tools/teksty-wyniku.ts` (`tekstyOstrzezen`/`tekstyZalozen`, `t("pl", …)`;
dla niezmigrowanych zwraca `message`/string bez zmian). Helper przeniesiony w identycznej treści z
niewypchniętej gałęzi `claude/modul1-opisy-ai` (commit `62d786b`) — przy merge obu gałęzi plik się nie
skonfliktuje. Test: `kalkulatory-pomocnicze-tool.test.ts` sprawdza tekst PL założenia i ostrzeżenia.
**Nowe narzędzie AI = zawsze przez ten helper, nigdy `technicalMessage`/`JSON.stringify` do modelu.**
Otwarte (nie ruszane, poza zakresem): `monitorowanie-izolacji-imd` i `przepust-powietrza` w ogóle nie
wystawiają `zalozenia`, choć kalkulatory je mają (np. próg alarmu IMD = przykładowa wartość źródła).

## TD15 (2) naprawiony — zacienienie we wskaźniku Ekranu 4 Modułu 1 (24.09.2026)

Kolejność właściciela: TD15 (2) → TD14 → TD17 (dokończenie Modułu 1, odblokowuje Moduł 7).
- **Model:** bez nowej fizyki — godzina ze słońcem niżej niż przeszkoda w jego azymucie = powierzchnia
  zacieniona w sensie Muneera (EUR 26075 równ. 28), dokładnie ta sama gałąź co przy cos θ ≤ 0.
  Profil horyzontu: wspólna funkcja `profilHoryzontuDeg` (`analiza-zacienienia/przeszkody.ts`) —
  E3 z niej rysuje wykres, E4 z niej liczy zacienienie (jedna geometria, dwa ekrany).
- **Dane między ekranami:** wynik E3 nie jest zapisywany (05, 5.1), więc E4 liczy profile sam z Seedu
  E2 (`horyzontyPolaci` w `lib/lokalizacja/model-dzialki.ts`) na tej samej siatce 4×4
  (`SIATKA_PROBKOWANIA`, teraz wspólna stała E3/E4) — średnia napromieniowania po punktach.
- **Decyzje:** optimum lokalizacji zawsze bez przeszkód (wskaźnik zacienionej połaci spada, a nie
  "optimum się przesuwa"); przeszkody w obecnej wysokości; elewacje i powierzchnie ręczne jawnie "bez
  zacienienia" w założeniach (wysokości punktu na ścianie nie znamy — nie zgadujemy). Założenie
  `NAPROMIENIOWANIE-NIE-UZYSK` skorygowane (PL/EN/RU): nie mówi już, że wskaźnik "pomija zacienienie".
- **Weryfikacja:** +10 testów (w tym tożsamość: horyzont 90° dookoła → tylko Gd·F(β, 0,25227) + odbite;
  horyzont 0° → wynik identyczny jak bez profilu); pełny pakiet lokalny czysty (typecheck, lint,
  i18n-guard, 1186/1186, build, audit:gate). Kontrola na realnych danych PVGIS z tego kontenera
  niemożliwa (`PVGIS-ODRZUCIL-ZAPYTANIE` — sieć kontenera), do zrobienia w przeglądarce przy okazji.

## TD14 naprawiony — Ekran 3 liczy stratę całkowitej energii na danych TMY (24.09.2026)

Decyzje właściciela: 1(b) — przesłonięcie nieboskłonu nie modelowane, jawnie w założeniach (→ **TD18**);
wariant zapasowy clear-sky zostaje dla braku danych; drzewa liściaste zimą — "poszukaj źródła".
- **Jedna fizyka:** model Muneera wydzielony z kalkulatora E4 do `orientacja-powierzchni/muneer.ts`
  (`przygotujGodziny`, `plaszczyzna`, `natezenieGodziny(g, pl, zaPrzeszkoda)`, `napromieniowanie`) — E4
  bez zmiany wyniku (te same 18 testów), E3 liczy nim stratę godzina po godzinie. Walidacja danych
  godzinowych też wspólna (`bledyDanychGodzinowych`). Test zgodności E3↔E4 < 0,2 p.p.
- **UI E3:** ten sam zapis TMY co E4 (`useDaneTmy`, `zapisPasuje`) — pobrane raz na którymkolwiek ekranie
  działa na obu. Klucz aktualności wyniku bez 8760 rekordów (`JSON.stringify` per punkt siatki byłby
  kosztowny) — dane identyfikuje data pobrania. Do workera ta sama tablica rekordów we wszystkich
  wejściach — structured clone kopiuje ją raz.
- **Narzędzie AI** `policz_zacienienie`: fabryka z `fetchImpl` jak E4, PVGIS po stronie serwera; błąd →
  wariant zapasowy + komunikat (inaczej niż E4, który bez danych nie ma żadnego wyniku). Pole
  `zrodloPromieniowania` mówi modelowi, który wariant policzono.
- **Pułapka:** `pnpm prettier --write` przeformatował cały plik na styl ze średnikami — repo NIE używa
  Prettiera (brak konfiguracji, styl bez średników). Nie uruchamiać prettiera na plikach repo.
- **Pułapka:** heredoc bez cudzysłowu (`<<EOF`) w bashu wykonuje `` `...` `` z komentarzy JSDoc — przy
  generowaniu kodu przez skrypt używać `<<'EOF'`.
- **TD19 (drzewa liściaste zimą) — źródło znalezione, decyzja otwarta:** Konarska i in. 2014 (Theor. Appl.
  Climatol. 117:363–376): przepuszczalność bezpośredniego przez koronę bezlistną 40,2–51,9% (Göteborg,
  4 gatunki liściaste). Zweryfikowane tylko streszczenie — wydawcy zablokowani przez sieć kontenera.
- **TD19 — wdrożone częściowo (24.09.2026, decyzja właściciela: "wdrażamy na bazie tych danych"):**
  E3 v1.2.0. `PrzeszkodaDrzewo.lisciaste` + `miesiaceBezlisci` (wejście globalne, nie per drzewo —
  fenologia jest regionalna; wpisywane ręcznie, bez domyślnych miesięcy, bo nie mamy źródła). τ = 0,40
  (dolna granica 40,2% w dół). Kilka przeszkód na linii słońca → iloczyn τ; strata przypisana przeszkodzie
  najmniej przepuszczalnej (przy remisie najwyższej kątowo) — przy samych bryłach/drzewach z liśćmi wynik
  identyczny jak w v1.1.0. E4 świadomie bez zmian (profil horyzontu nie rozróżnia drzew) — ostrożnie.
  Seed E3 (`PrognozaSeed`) dostał pola opcjonalne — stare zapisy działają. Pełny tekst do znalezienia
  przez właściciela (lista zadań), potem dopracowanie.
- **Weryfikacja:** pełny pakiet lokalny czysty (typecheck, lint 0 błędów, i18n-guard, 1193/1193, build,
  audit:gate). Kontrola na realnych danych PVGIS i w przeglądarce — niemożliwa z tego kontenera, do zrobienia.

## TD17 — przeszkody o obrysie wielokąta w Skanerze (24.09.2026)

Na polecenie właściciela ("Robimy TD17"). Kierunek naprawy wprost z wpisu TD17 w `dlug-techniczny.md`,
bez nowych decyzji projektowych. Budowane równolegle z TD15 (2)/TD14/TD19 (gałąź
`claude/dazzling-archimedes-5x6iwl`, wpisy wyżej) — scalone razem: bryła z E2 przechodzi też do
horyzontów E4 (`horyzontyPolaci`) i do obliczeń TMY E3; pole "drzewo liściaste" pokazywane tylko dla walców.
- Jądro Skanera: `PrzeszkodaGps` = unia `walec` | `obrys` (narożniki + wysokość); obrys rzutowany do
  układu lokalnego i skalowany tą samą kalibracją poziomą co działka/budynek. Nowy kod walidacji
  `SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA` (PL/EN/RU); < 3 narożniki → istniejący `SKANER-ZA-MALO-PUNKTOW`.
- Seed (`lib/lokalizacja/model-dzialki.ts`): walec ma `typ?` opcjonalny — **drafty sprzed zmiany
  (IndexedDB) nie mają pola `typ` i czytają się jako walec**, bez migracji. Nie zmieniać na wymagane.
- E2 UI: przycisk "+ Dodaj przeszkodę-obrys" (jak połać — punkty GPS/mapy trafiają do aktywnej
  przeszkody); "Pobierz budynek w tym miejscu" przy aktywnej przeszkodzie-obrysie wczytuje obrys
  budynku sąsiada z ULDK do przeszkody (wysokość wpisuje użytkownik — ULDK jej nie ma).
- E3: obrys → `PrzeszkodaBryla` (bez prognozy), widok 3D rysuje bryłę; pola prognozy tylko dla drzew.
- **Pułapka znaleziona przy teście w przeglądarce:** `Pole` bez `id` generuje je z etykiety →
  w listach (kilka przeszkód/połaci) powtarzające się `id` i `label for` trafiające zawsze w pierwsze
  pole (dostępność, czytniki ekranu). Naprawione na Ekranie 2 jawnymi `id` per element. Ten sam wzorzec
  (`<Pole>` w `.map()` bez `id`) występuje jeszcze w kilku innych ekranach — do osobnego przejścia.
- Weryfikacja: `pnpm typecheck`/`lint` (0 nowych)/`check:i18n-guard`/`test` (149 plików)/`build`/`audit:gate`
  czyste; Playwright na buildzie produkcyjnym, 390 px: spacer GPS → budynek + przeszkoda-obrys (4 narożniki)
  + drzewo → E3 dach płaski 4 m: główna przyczyna straty = bryła sąsiada (18,7 p.p.), 1 pole prognozy (tylko
  drzewo), bez poziomego przewijania.

## Synchronizacja ze standardem — Y.6, pełny nadpis NIETYKALNE/ADAPTOWALNE (24.09.2026)

Nowa wersja Routine Y.6 (zastąpiła poprzednią, usuniętą — patrz niżej "Kolejne odpalenia"): Krok 2
zmieniony na "zastosuj wg kategorii Y.8, NIE pytając z góry o każdą pozycję" (poprzednia wersja
kazała proponować i czekać na zgodę nawet dla NIETYKALNE — to był regres względem Y.8, naprawiony
w źródle jako GOD BOOK v2.38, dopisek "[24.09.2026] ✅ KOREKTA" w Y.6: *Y.8 ma pierwszeństwo nad
literalnym brzmieniem "Konsekwencja" w Y.6*).

**Krok 1 (fetch+porównanie):** lokalny klon `new-app-standards` był 4 commity za `origin/main`
(od poprzedniego sprawdzenia dziś) — doprowadzony do zgodności (`git merge --ff-only`). GOD BOOK
źródła: rename `v2_37.md`→`v2_38.md`. Poprzednie sprawdzenie (ten sam dzień, wpis wyżej "Konfiguracja
Y.6 adaptacyjnego...") skatalogowało już pełny zakres v2.21→v2.37 jako propozycję czekającą na
decyzję właściciela — dziś właściciel polecił zastosować to bezpośrednio (nowe zadanie, Krok 2
"stosuj bez pytania z góry"), plus doszedł jeden nowy wiersz `AKTUALIZACJE.md` (2026-09-24, KOREKTA
v2.38 opisana wyżej).

**Krok 2 — zastosowano jako fakt dokonany (checklista Y.9):**

*NIETYKALNE (pełny nadpis, wykonane):*
- GOD BOOK: `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md`→`...v2_38.md` (plik
  usunięty przez `git rm`, nowy dodany pełną treścią źródła).
- `docs/standards/`: 11 plików nadpisanych pełną treścią źródła — `00-INDEKS.md`, `00-filozofia.md`,
  `02-model-danych.md`, `03-jadro-obliczeniowe.md`, `05-baza-danych-offline.md`,
  `07-bezpieczenstwo.md`, `08-ui-ux.md`, `10-testy.md`, `11-ci-deployment.md`, `15-wspolpraca-z-ai.md`,
  `17-i18n.md`. Pozostałe 8 plików (`01,04,06,09,12,13,14,16,18`) były już bajt-w-bajt identyczne ze
  źródłem — zero akcji (m.in. `13-droga-mobile.md`, mimo że katalog wcześniej wspominał przepisanie
  Capacitor — okazało się już zsynchronizowane wcześniej).
- `PROMPT_STARTOWY.md` — pełny nadpis (wskaźnik wersji GOD BOOK, próg checklisty Y.9 z ≥3h na ≥12h).
- `docs/przyklady/i18n/README.md`, `docs/przyklady/i18n/check-i18n-guard.mjs` — pełny nadpis.
- `docs/przyklady/pwa/` (nowy katalog źródła, 10 plików + README) — **świadomie NIE skopiowany.**
  Projekt nie ma jeszcze kodu PWA/Service Workera — pozycja informacyjna do czasu faktycznej budowy
  (Y.8: pełny nadpis dotyczy plików, które projekt już ma jako mirror; nowy katalog bez lokalnego
  odpowiednika kopiuje się dopiero, gdy jest faktycznie potrzebny, żeby nie wnosić martwego kodu).
- `README.md`, `CLAUDE.template.md`, `docs/lista-do-zrobienia.template.md`, `docs/memory.template.md`
  (wymienione w poprzednim katalogu jako "wskaźnik wersji + drobne patche") — **nie dotyczą tego
  repo**: to szablony dla NOWYCH projektów rodziny / README samego `new-app-standards`, ten projekt
  ich nie mirroruje (ma własny `README.md` projektowy, nie szablon).

*ADAPTOWALNE (patch, wykonane):*
- `CLAUDE.md` — wskaźnik wersji GOD BOOK w punkcie 2 (`v2_28`→`v2_38`); punkt 4 poprawiony: usunięto
  nieaktualne zdanie "mirror GOD BOOK wciąż wskazuje starszą wersję", dodano fakt wykonanej
  synchronizacji Y.9; poprawiono też literówkę odziedziczoną z poprzedniej sesji (D22→**D24**, ten
  punkt cytował nieaktualny numer decyzji sprzed przenumerowania H.3 — drift bez świadomej decyzji,
  naprawiony od razu per Y.2).
- `.claude/skills/standards/SKILL.md` — wskaźnik wersji GOD BOOK (`v2_28`→`v2_38`).

*LOKALNE — bez zmian treści (Y.8):* `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`
(oprócz oznaczenia ✅ dwóch już-skonsolidowanych wpisów, patrz niżej — to nie zmiana treści
zgłoszenia, tylko aktualizacja statusu, zgodnie z instrukcją Routine "sprawdź, czy któryś wpis
🔎 nowe został już realnie skonsolidowany"), `docs/zrodla/` — bez zmian.

**`docs/wklad-do-standardu.md` — status zaktualizowany (nie treść):**
- Wpis [23.09.2026] "sztywny cykl Y.6/U.4 generuje dużo zerowych sprawdzeń" → oznaczony ✅
  skonsolidowane: GOD BOOK v2.32 przyjął dokładnie wariant (b) z propozycji (cykl adaptacyjny),
  `AKTUALIZACJE.md` cytuje wprost "zamyka retroaktywnie D21 inzynier-offgrid-pro".
- Pozostałe wpisy `🔎 nowe` (biblioteka norm źródłowych, i18n rozdział 01, itd.) sprawdzone
  pobieżnie — bez nowych dowodów konsolidacji w dzisiejszym `AKTUALIZACJE.md`, status bez zmian.

**Kategorie NIETYKALNE ze skopiowanej treści, które mogą dotyczyć kodu tego projektu (poza zakresem
samego Y.6 — to jest Y.11, osobny audyt zgodności kodu, na żądanie/koniec Fazy, nie część tej
synchronizacji dokumentów):** 02.1 (`validFrom`/`validTo`/`legalBasis`/`verifiedBy`/`confidence` dla
wartości regulowanych prawem — normy/współczynniki bezpieczeństwa), 03.3 (`INCOMPLETE` jako trzeci
stan zamiast dwuwartościowej logiki+flagi w modułach obowiązku/ryzyka/zgodności), 07 (CSP hash-based
zamiast `'unsafe-inline'`, checklist `Permissions-Policy` przed nową funkcją API przeglądarki — już
zastosowane praktycznie w PR #144, patrz "Moduł 1 — UI Ekranów 2–4" wyżej), 17.7b/17.7c (selektor
języka tylko kompletne języki — dotyczy, projekt jest przedpremierowo), 18.1 (retroaktywnie
obowiązkowe). Nie sprawdzane teraz — to osobne zadanie.

**Krok 3 (cykl adaptacyjny):** poprzednie sprawdzenie (ten sam dzień) już zresetowało
`interwał_h = 12`, `licznik_zero_z_rzedu = 0` po znalezieniu nowości. Dzisiejsze sprawdzenie
**również** znalazło i zastosowało nowość (KOREKTA v2.38 + dokończenie zaległego pełnego sync) →
`interwał_h` **zostaje na 12** (reset, nie rośnie), `licznik_zero_z_rzedu = 0`.

**Krok 4 — Routine.** Stara Routine (`trig_01La5dGeB9ycdVpPf2dmYgrk`, pytała o KAŻDĄ podmianę
łącznie z NIETYKALNE — regres względem Y.8) **usunięta** na polecenie właściciela projektu.
Założona nowa, poprawiona: self-bind, `trig_01892Z45ThAi2T56PJRjQQAh`, `run_once_at` =
2026-09-25T10:57:00Z (+12h). Pełny prompt — patrz wywołanie `create_trigger` w tej sesji; kluczowa
różnica względem poprzedniej wersji: Krok 2 stosuje NIETYKALNE/ADAPTOWALNE automatycznie, pytanie
właściciela zostaje wyłącznie dla (a) pliku poza trzema kategoriami, (b) prawdziwego konfliktu
Y.2.2, (c) treści LOKALNE wymagającej wiedzy specyficznej dla projektu.

