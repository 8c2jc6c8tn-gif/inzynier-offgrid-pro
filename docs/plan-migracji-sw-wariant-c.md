# Plan migracji Service Workera do wzorca standardu — wariant C (A etapami)

**Data:** 29.09.2026 · **Kategoria pliku:** LOKALNE (plan wykonawczy) · **Decyzja właściciela:** wariant **C**
(29.09.2026) — zamyka punkt ⚠️ „Service Worker — decyzja A/B/C” w `docs/lista-do-zrobienia.md`.

**Dla kogo:** dla sesji, która wykona migrację. Plan jest samowystarczalny: zanim zaczniesz, przeczytaj ten plik,
`docs/audyt-sw-vs-wzorzec-pwa.md` (skąd się wziął, pomiary) i wzorzec `docs/przyklady/pwa/` (README + 10 plików;
kopia 1:1 z `new-app-standards` @ `af63da7`, zsynchronizowana 29.09 — nie trzeba mieć dostępu do tamtego repo).
Reguły: `docs/standards/05-baza-danych-offline.md` 5.3 i 5.8–5.12, `07-bezpieczenstwo.md` 7.3,
`08-*` 8.11, `10-testy.md` 10.8–10.9, `11-ci-deployment.md` 11.8.

**Już zrobione (29.09, ten sam PR co ten plan):** poprawka `matcher` w `middleware.ts` (raport, pkt 12) — `/sw.js`,
`/register-sw.js`, `/manifest.webmanifest` omijają middleware. Sprawdzone na `pnpm build` + `pnpm start`: strony
nadal mają nagłówek CSP, trzy pliki PWA go nie mają. Nie cofać: nowy `/sw.js` z Route Handlera musi to też omijać.

---

## 0. Zasady wykonania (dla całej migracji)

- **Dwa etapy = dwa PR-y.** Etap 1 to działający wzorzec (precache stron + JS/CSS + `public/` bez map). Etap 2 to
  pomiar i odchudzenie. Nie łączyć, bo etap 2 zależy od liczb z etapu 1.
- **Pliki wzorca są kopią dosłowną projektu źródłowego.** Przy przenoszeniu zmień tylko to, co ten plan wymienia
  (prefiks cache, ścieżki importów, i18n, lista wyjątków). Każde inne odstępstwo zapisz w `docs/memory.md` z powodem.
- **Nazewnictwo:** zostaw polskie nazwy z wzorca (`sledzAktualizacjeSw`, `zbudujWpisyPrecache` itd.) — CLAUDE.md
  dopuszcza polską nazwę domenową, jeśli jest konsekwentna w całym module; ułatwia porównanie z wzorcem. Komentarze
  po angielsku (wzorzec już ma angielskie).
- **Test offline zawsze z ubitym serwerem**, nie samym `context.setOffline(true)` — Playwright nie odcina `fetch()`
  wykonywanego przez sam SW (raport, „Znalezisko uboczne”; zgłoszone w `docs/wklad-do-standardu.md`). Bez tego
  nieodwiedzona strona „działa offline”, bo SW pobiera ją z sieci.
- **Pakiet przed każdym merge** (CI nie działa do końca września; od 1.10 — CI): `pnpm typecheck`, `lint`,
  `check:i18n-guard`, `check:pomoc-guard`, `check:ai-tools-guard`, `test`, `build`, `audit:gate` + e2e z etapu 1.6.

## 1. Decyzje do potwierdzenia przez właściciela NA STARCIE etapu 1 (zapytaj, nie rozstrzygaj sam)

| # | Pytanie | Opcje | Rekomendacja |
|---|---|---|---|
| C-1 | Toast aktualizacji — skąd komponent? `sonner` nie ma w zależnościach. | **A** dodać `sonner` (wzorzec 1:1, ~ kilka KB). **B** własny mały komponent toastu w `components/pwa/` (trwały, `role="status"`, przycisk akcji) — bez nowej zależności. | **A** — wzorzec przetestowany; ten sam toast obsłuży potem 5.11 (kolizja wersji IndexedDB). Nowa zależność = `pnpm add sonner`, tylko `pnpm-lock.yaml`. |
| C-2 | E2e na buildzie (10.9) — biblioteka `playwright` nie jest w `devDependencies` (29.09 użyta ze scratchpadu). | **A** `pnpm add -D playwright` (bez `@playwright/test`, wzorzec: `node --test`), przeglądarka z `/opt/pw-browsers` w chmurze, w CI `playwright install chromium`. **B** e2e tylko ręczny skrypt poza repo. | **A** — 10.9 wymaga e2e na buildzie; bez tego regresja SW wraca niezauważona. |
| C-3 | Precache wszystkich ~230 tras przy instalacji: każda strona jest dynamiczna (`ƒ`, nonce z `headers()`), więc instalacja SW = ~230 renderów na serwerze na użytkownika i na każdą nową wersję (reużycie wpisów działa tylko przy tym samym `rev` = ten sam `BUILD_ID`, więc strony po deployu ściągają się od nowa). | **A** akceptujemy (Vercel, mała liczba użytkowników). **B** strony w precache tylko z listy „terenowych” ekranów, reszta cache w locie. | **A** — zgodne z 5.3 i profilem aplikacji; wrócić do tego w etapie 2, jeśli pomiar pokaże problem. |

Odpowiedzi zapisz jako decyzję D# w `rejestr-decyzji.md` (jedna decyzja „SW wariant C”, z podpunktami C-1…C-3).

## 2. Etap 1 — wzorzec standardu (jeden PR)

Kolejność kroków ma znaczenie: 1.1 → 1.2 → 1.3 dają działający SW; 1.4 → 1.5 to aktualizacje; 1.6 to testy; 1.7 to
sprzątanie. Każdy krok kończy się testem, zanim przejdziesz dalej.

### 1.1 Lista precache — `lib/pwa/precache.ts` + `lib/pwa/precache-build.ts`

1. Skopiuj `docs/przyklady/pwa/precache.ts` → `lib/pwa/precache.ts`. Zmiany względem wzorca:
   - **Usuń `slownikiPrepaint`** (pole w `WejsciePrecache` i wiersz w `wpisy`). U nas słowniki i18n są w chunku JS
     (`.next/static/chunks/0gyrr…js`, 580 KB), nie osobne pliki `/i18n-prepaint/*` — precache chunków je obejmie.
   - **`TRASY_STATYCZNE_Z_BUILDU`:** u nas `/manifest.webmanifest` (jest w `prerender-manifest.json`). **Nie**
     `/icon.svg`, `/apple-icon.png` jako trasy — u nas to zwykłe pliki w `public/` (wejdą przez `plikiPubliczne`).
     Sprawdź `app/` na `icon.*`/`apple-icon.*` przed decyzją; dziś ich nie ma.
   - **Trasa dynamiczna `/moduly/[id]`** — wzorzec ją pomija (`!trasa.includes('[')`), a to ekran modułu z pulpitu
     (18 kafli). Dodaj pole `wejscie.trasyDynamiczne: string[]` (np. `['/moduly/1', …]`) dołączane do `strony`.
     Źródło w `precache-build.ts`: `KAFLE` z `lib/pulpit/registry.ts` (to samo, co `generateStaticParams` w
     `app/moduly/[id]/page.tsx`) — **nie** `prerender-manifest.json`, bo przez nonce trasy nie są prerenderowane
     (29.09: prerender-manifest ma tylko `/_global-error` i `/manifest.webmanifest`).
   - **Wyłącz z precache `/auth/*`** — dodaj `/auth/login` do `POMIJANE_STRONY` (strona logowania nie ma sensu offline,
     a po włączeniu Supabase jest jedyną trasą publiczną). `/auth/callback` i `/api/pvgis/tmy` to Route Handlery
     (`/route`, nie `/page`) — filtr `endsWith('/page')` już je pomija; test to potwierdzi.
   - `/_not-found` zostaje obowiązkowy (wzorzec rzuca błąd, jeśli go nie ma). Dziś w `app/` nie ma `not-found.tsx` —
     Next generuje domyślną angielską stronę 404. Dodaj `app/not-found.tsx` z tekstem PL/EN/RU („Tego ekranu nie ma
     w pamięci offline — połącz się z siecią” + link do pulpitu) — to ją zobaczy użytkownik offline na nieznanym URL.
     Ekran musi spełnić definicję ukończenia (tłumaczenia; „?”/„i”/AI nie dotyczą, bo to nie ekran z polami — sprawdź
     `check:pomoc-guard`).
2. Napisz `lib/pwa/precache-build.ts` (wzorzec go **nie** zawiera — README wzorca opisuje, co robi). Funkcje:
   - `wczytajWpisyPrecache()`: czyta `.next/BUILD_ID`, `.next/app-path-routes-manifest.json`, rekurencyjnie
     `.next/static/**` (ścieżki względne, separator `/`), rekurencyjnie `public/**` z `sha256` treści (obcięty do 12
     znaków), `KAFLE` → `/moduly/<id>`; woła `zbudujWpisyPrecache`.
   - `wczytajRdzenSw()`: zwraca treść `lib/pwa/sw-rdzen.js` (`fs.readFileSync`, ścieżka od `process.cwd()`).
   - **Wykluczenia (etap 1, od razu, bo znane z pomiaru 29.09):**
     - `public/sw.js`, `public/register-sw.js` — znikną w 1.7; do tego czasu nie precache'ować.
     - `public/placeholder*` (`.jpg`, `.png`, `.svg`, `-logo`, `-user`) — sprawdź `grep -r placeholder app components
       lib`; jeśli nieużywane, wyklucz (i zgłoś do usunięcia osobnym zadaniem, nie usuwaj w tym PR).
     - **Mapa jest tylko online** (D22/D23: podkład WMS Geoportalu nie działa bez sieci) → wyklucz
       `public/maplibre/**` (528 KB), `.next/static/media/maplibre-gl*` (**w tym trzy pliki `*-dev.*`, razem ~2,5 MB —
       wersje deweloperskie w buildzie produkcyjnym**, osobne zadanie: dlaczego trafiają do buildu) i chunki MapLibre
       (rozpoznanie w 1.1.3).
   - **Ryzyko do sprawdzenia jako pierwsze:** czy `.next/app-path-routes-manifest.json` i `.next/static` istnieją
     w chwili, gdy `next build` prerenderuje `app/sw.js/route.ts` (`force-static`). Projekt źródłowy tak robił, ale my
     budujemy Turbopackiem (Next 16.3). Sprawdź przed resztą: minimalny route z `console.log(fs.existsSync(...))`
     w logu `pnpm build`. **Jeśli manifestu nie ma w tym momencie** — nie zgaduj obejścia, zatrzymaj się i przedstaw
     właścicielowi opcje (np. skrypt `postbuild` generujący `public/sw.js`, czyli inna forma niż 5.8 → wymaga D#).
3. Rozpoznanie chunków MapLibre / three.js (do wykluczeń): chunk z MapLibre to ten, w którym jest ciąg `maplibre`
   (29.09: `0a83lqcbxvn-h.js`, 1008 KB); three.js (`widok-3d.tsx`) — ciąg `DOLLY`/`ROTATE` (29.09: `1608qgrl9jsj7.js`,
   916 KB). **Nie wpisuj nazw z hashem na sztywno** — zmieniają się co build. Wykluczenie po zawartości pliku
   (wzorzec tekstu w `precache-build.ts`) albo w ogóle nie wykluczaj chunków w etapie 1 (tylko `media`/`public`)
   i zostaw to na etap 2. **Rekomendacja: w etapie 1 wykluczaj tylko po ścieżce (media, public), chunki — etap 2.**
   Czy widok 3D ma działać offline — pytanie do właściciela w etapie 2 (dziś nieznane).
4. Test `lib/pwa/__tests__/precache.test.ts` (Vitest, `environment: "node"` przez komentarz
   `// @vitest-environment node` — domyślny w `vitest.config.ts` to `jsdom`): brak stron → błąd; brak
   `/_not-found` → błąd; brak `.js` → błąd; duplikat → błąd; `/moduly/[id]` nie trafia, `/moduly/1` trafia;
   `/auth/login`, `/_global-error` nie trafiają; `/_next/static/*` mają `rev: 'i'`; `public/` ma `rev` = hash.

### 1.2 Rdzeń SW — `lib/pwa/sw-rdzen.js`

1. Skopiuj `docs/przyklady/pwa/sw-rdzen.js` → `lib/pwa/sw-rdzen.js`. Zmiany:
   - `PREFIKS = 'isp-precache-'` → **`'offgrid-precache-'`** (i ten sam prefiks w `SW_USUN` w 1.3).
   - **Strażnik logowania (nowe, wzorzec tego nie ma):** w `pobierzDoCache`, po `fetch`, jeśli `odp.redirected` i
     `new URL(odp.url).pathname.indexOf('/auth/') === 0` → `throw new Error('precache: redirected to login')`.
     Powód: po włączeniu Supabase (18.1) instalacja SW u niezalogowanego zapisałaby **stronę logowania pod
     adresem każdego kalkulatora** (`bezPrzekierowania` zapisuje treść po przekierowaniu). Rzucenie błędu = instalacja
     się nie udaje, stara wersja zostaje, przeglądarka spróbuje przy następnej nawigacji. Dopisz do
     `docs/wklad-do-standardu.md` (BŁĄD, wzorzec PWA nie zabezpiecza tego przypadku).
   - `czyPominac`: dodaj `url.pathname.indexOf('/auth/') === 0` → pomijaj (logowanie zawsze przez sieć).
   - Reszta bez zmian (w tym brak automatycznego `skipWaiting`, `/_vercel/`, RSC).
2. Test `lib/pwa/__tests__/sw-rdzen.test.ts` w `node:vm` (`// @vitest-environment node`). Wzorzec testu nie jest
   w katalogu przykładów — napisz: kontekst `vm` z atrapami `self` (`addEventListener` zbierający handlery,
   `location.origin`, `clients.claim`, `skipWaiting`, `registration`), `caches` (Map nazw → Map kluczy), `fetch`
   (atrapa zwracająca `Response` z Node 18+), `Request`, `Response`, `URL`; `self.__SW_KONFIG` ustawione przed
   uruchomieniem źródła. Przypadki minimum:
   - install: wszystkie wpisy w cache `offgrid-precache-<wersja>`, klucz z `__sw_rev`;
   - install: wpis o tym samym kluczu w starym cache → skopiowany bez `fetch`;
   - install: HTTP 500 dla wpisu → install odrzucony; 404 dla `/_not-found` → akceptowany;
   - install: przekierowanie na `/auth/login` → install odrzucony (strażnik z 1.2.1);
   - activate: stare `offgrid-precache-*` usunięte, cudze cache (inny prefiks, np. stary `offgrid-v1`) — **patrz
     1.7.3**;
   - fetch nawigacji: strona z precache → z cache bez sieci; nieznana ścieżka + sieć pada → `/_not-found`;
     ukośnik na końcu (`/kalkulatory/x/`) → ta sama strona;
   - fetch pomijany: POST, inny origin, `/api/pvgis/tmy`, `/auth/login`, nagłówek `rsc: 1`, `?_rsc=` → brak
     `respondWith`;
   - message `{typ:'SKIP_WAITING'}` → `skipWaiting()` wywołane.

### 1.3 Route Handler — `app/sw.js/route.ts`

1. Skopiuj `docs/przyklady/pwa/sw-route.ts` → `app/sw.js/route.ts`. Zmiany: import z `@/lib/pwa/precache-build`
   (bez zmian), w `SW_USUN` prefiks `'offgrid-precache-'`; **dodatkowo** `SW_USUN` ma kasować też stary cache
   `offgrid-v1` (warunek `k.indexOf('offgrid-precache-')===0||k==='offgrid-v1'`) — inaczej kill-switch zostawi
   pozostałość po dzisiejszym SW.
2. **Konflikt ścieżek:** `public/sw.js` i `app/sw.js/route.ts` obsługują ten sam URL — Next zgłosi konflikt albo
   plik z `public/` wygra. **Usuń `public/sw.js` w tym samym commicie** co dodanie route (rejestracja nadal woła
   `/sw.js`, więc zainstalowane SW u użytkowników dostaną nową treść jako aktualizację).
3. `next.config.mjs`, w `headers()`: dla `source: '/sw.js'` nagłówek `Cache-Control: no-cache` (wzorzec to zakłada
   w komentarzu `sw-route.ts`) + dotychczasowe `securityHeaders` (sprawdź, że nie nadpiszesz ich osobnym wpisem —
   Next łączy nagłówki z wielu pasujących reguł).
4. `middleware.ts` — już zrobione (`sw\\.js$` w `matcher`). Nie ruszać.
5. Sprawdzenie ręczne: `pnpm build` (w logu `/sw.js` jako `○` static), `curl localhost:PORT/sw.js | head -c 300` —
   zaczyna się od `self.__SW_KONFIG={"wersja":"…","wpisy":[…]}`; drugi `pnpm build` bez zmian w kodzie — **ta sama
   `wersja`?** Nie: `BUILD_ID` jest losowy, a to `rev` stron, więc wersja zmienia się przy każdym buildzie (tak samo
   we wzorcu; README: „losowy `BUILD_ID` naturalnie daje nową wersję SW między buildami”). Zapisz to w
   `docs/memory.md` jako znany fakt, nie błąd; chunki (`rev: 'i'`) i tak są reużywane między wersjami.

### 1.4 Aktualizacje — `lib/pwa/aktualizacja-sw.ts`

1. Skopiuj `docs/przyklady/pwa/aktualizacja-sw.ts` → `lib/pwa/aktualizacja-sw.ts` bez zmian (czysty TS, bez React).
2. Test `lib/pwa/__tests__/aktualizacja-sw.test.ts` (atrapy `kontener`/`rejestracja` jako obiekty z
   `EventTarget`): pierwszy `controllerchange` bez kontrolera → nic; `waiting` przy starcie + kontroler →
   `naNowaWersje`; `zastosuj` → `postMessage({typ:'SKIP_WAITING'})`, potem `controllerchange` → `przeladuj` dokładnie
   raz; `controllerchange` bez żądania → `naZmianeWInnejKarcie`; brak kontrolera → brak toastu.

### 1.5 Rejestracja i toast — `components/pwa/sw-rejestracja.tsx`

1. Zależnie od C-1: `pnpm add sonner` + `<Toaster />` w `app/layout.tsx` (pozycja i motyw zgodne z
   `lib/theme`/`lib/wyglad`; sprawdź czytelność w trybie ciemnym i przy powiększonej czcionce z Ustawień), albo
   własny komponent.
2. Skopiuj `docs/przyklady/pwa/sw-rejestracja.tsx` → `components/pwa/sw-rejestracja.tsx`. Zmiany:
   - Wzorzec: `const { t } = useT()` z `@/lib/i18n/use-t`. U nas: `const t = useTranslate()` z
     `@/lib/i18n/language-context` (zwraca funkcję wprost, nie obiekt).
   - Klucze i18n: `pwa.aktualizacja.nowaTytul`, `nowaOpis`, `odswiezAkcja`, `innaKartaTytul`, `innaKartaOpis` —
     dopisz do `lib/i18n/dictionary-pl.ts`, `-en.ts`, `-ru.ts` (8.12; `pnpm check:i18n-guard`). Treść PL:
     „Jest nowa wersja aplikacji” / „Odśwież, żeby z niej korzystać. Niezapisane dane formularza są w szkicu.”
     (sprawdź, że to prawda dla autosave 5.7 — jeśli nie wszystkie ekrany mają autosave, usuń drugie zdanie) /
     „Odśwież” / „Aplikacja zaktualizowała się w innej karcie” / „Odśwież tę kartę, żeby uniknąć błędów.”
3. `app/layout.tsx`: zamień `<script nonce={nonce} src="/register-sw.js" defer />` (linia ~152, warunek
   `NODE_ENV === 'production'`) na `<SwRejestracja />` (komponent sam sprawdza produkcję) i usuń komentarz nad nim.
   **Tło:** rejestrację zrobiono kiedyś zewnętrznym skryptem celowo, żeby nie zależała od hydracji Reacta, bo ta
   psuła się w produkcji (`React error #412`, statyczny hash CSP; `docs/lista-do-zrobienia.md` ok. linii 310–320).
   Od 16.09 CSP jest nonce-per-request (`middleware.ts`), więc ten powód powinien być nieaktualny — **sprawdź w e2e
   1.6** (konsola bez `#412`, toast faktycznie się pokazuje). Jeśli hydracja nadal się psuje — to konflikt z wzorcem:
   przedstaw właścicielowi A (naprawić hydrację, potem komponent) / B (zostawić zewnętrzny skrypt z logiką
   aktualizacji i toastem bez Reacta). Nie rozstrzygaj sam.
4. Usuń `public/register-sw.js` (po 3.) i wyjątek `register-sw\\.js$` z `matcher` w `middleware.ts` (martwy).

### 1.6 E2e na buildzie produkcyjnym (10.8, 10.9)

1. Zależnie od C-2: `pnpm add -D playwright`. Pliki `e2e/pomocnicze.mjs`, `e2e/offline.test.mjs`,
   `e2e/aktualizacja.test.mjs`, uruchamiane `node --test e2e/` (skrypt `pnpm test:e2e`). Punkt wyjścia — skrypt
   z 29.09 opisany w raporcie (Metoda, pkt 2): serwer `pnpm start -p <port>` z `{detached: true}`, ubijany
   `process.kill(-pid)` (**nie** `pkill -f` — 29.09 ubił powłokę wywołującą, exit 144).
2. `offline.test.mjs`: wejście na `/` → `navigator.serviceWorker.ready` → czekaj na koniec instalacji (aktywny
   worker, `caches.keys()` zawiera `offgrid-precache-*`) → **ubij serwer** + `setOffline(true)` → strażnik
   „pusty przelot” (`/api/pvgis/tmy` musi zawieść) → **każda strona z listy precache** (lista z `/sw.js`, nie
   ręczna) otwiera się, `response.fromServiceWorker() === true`, `h1` niepusty → nieznany URL → strona
   `not-found` z naszym tekstem → obrazy maskotek na `/` (`naturalWidth > 0`) → `/manifest.webmanifest` 200.
3. `aktualizacja.test.mjs`: build 1 → wizyta → build 2 z jedną zmianą (np. zmienna środowiskowa wpływająca na
   treść strony — **nie** edycja pliku repo w teście) → wizyta → toast „nowa wersja” widoczny, stary SW nadal
   kontroluje → klik „Odśwież” → dokładnie jedno przeładowanie (`request.isNavigationRequest()` na głównej ramce),
   nowa wersja aktywna, stary cache `offgrid-precache-<stara>` usunięty.
4. Kill-switch: build z `NEXT_PUBLIC_SW_WYLACZ=1` po buildzie normalnym → brak rejestracji, `caches.keys()` bez
   `offgrid-*`.
5. `.github/workflows/ci.yml` — **nie dodawać kroku e2e przed 1.10** (CI nie działa); dopisać do zadania „Powrót CI
   od 1.10” w liście: nowy job e2e (`pnpm build` ×2, `playwright install chromium`).

### 1.7 Sprzątanie i przejście ze starego SW

1. Usunięte w tym PR: `public/sw.js` (1.3.2), `public/register-sw.js` (1.5.4).
2. `manifest.json` w `matcher` — dziś nie ma takiego pliku (`app/manifest.ts` daje `/manifest.webmanifest`);
   sprawdź `git log -S manifest.json` i jeśli to relikt, usuń z `matcher` w tym PR (zapis w `docs/memory.md`).
3. **Stary cache `offgrid-v1`** u użytkowników: nowy `aktywuj()` kasuje tylko `offgrid-precache-*`, więc
   `offgrid-v1` (strony i chunki z dzisiejszego SW) zostałby na zawsze. Dopisz w `aktywuj()` usunięcie `offgrid-v1`
   (jedna nazwa, jawnie, z komentarzem „legacy cache of the pre-D# worker”) i przypadek w teście 1.2.2.
4. Przejście: stary SW ma `skipWaiting()` w install, nowy nie. Stary → nowy: przeglądarka instaluje nowy (pełny
   precache ~20+ MB w tle), nowy **czeka**, a stary strony nie mają jeszcze `SwRejestracja` (stary HTML) → toast
   pojawi się dopiero po nawigacji na nowy HTML. Zapisz to w `docs/memory.md` jako znane jednorazowe zachowanie
   przy pierwszym deployu (nie błąd). Sprawdź w e2e 1.6.3 z buildem 1 = obecny `main` (stary SW).
5. Dokumentacja: `docs/memory.md` (wpis „SW wariant C — etap 1”), `docs/lista-do-zrobienia.md` (✅ etap 1,
   🔲 etap 2), `docs/audyt-sw-vs-wzorzec-pwa.md` — **nie przepisywać**, dopisać na końcu sekcję „Stan po etapie 1”
   z tabelą: które z 17 punktów zamknięte. `rejestr-decyzji.md` — D# z sekcji 1. `docs/rejestr-pokrycia.md` —
   jeśli ma wiersz PWA/offline.

**Kryteria ukończenia etapu 1:** testy 1.1.4, 1.2.2, 1.4.2 zielone; e2e 1.6 zielone na dwóch buildach z ubitym
serwerem; każdy ekran z listy precache działa offline bez wcześniejszej wizyty; pakiet z sekcji 0 zielony;
rozmiar precache zmierzony i zapisany (`suma rozmiarów wpisów` z `/sw.js` — skrypt w e2e, wypisuje MB).

## 3. Etap 2 — pomiar i odchudzenie (osobny PR, po merge etapu 1)

Stan wyjściowy (pomiar 29.09, przed wykluczeniami etapu 1): HTML 220 stron **6,1 MB** + chunki **14 MB** +
media **4,2 MB** (z czego fonty `woff2` 632 KB, reszta MapLibre) + `public/` **1,5 MB** ≈ **26 MB**. Standard: 33,9 MB
„nie do przyjęcia”, 2,7 MB po odchudzeniu (5.8).

1. **Pomiar** po etapie 1: łączny rozmiar precache i 10 największych wpisów (skrypt z 1.6). Zapisz w raporcie.
2. **Pytanie do właściciela** (z liczbami z pkt 1): jaki budżet pierwszej instalacji (np. ≤ 10 MB)? Czy widok 3D
   (`components/lokalizacja/widok-3d.tsx`, three.js ~0,9 MB) ma działać offline?
3. Kandydaci do cięcia (w kolejności zysku, każdy osobno zmierzony):
   - chunki MapLibre — mapa i tak wymaga sieci (D22/D23) → wykluczyć (wykluczenie po zawartości, patrz 1.1.3);
     **[30.09.2026] Błędne założenie — nie wykluczać.** D22 wymaga, żeby spacer GPS działał offline, a MapLibre
     rysuje geometrię przez swój worker; sprawdzone na buildzie: bez workera offline znika obrys działki. Chunk
     MapLibre i `public/maplibre/**` zostają w precache (D60, `docs/memory.md`);
   - pliki `maplibre-gl*-dev.*` w `.next/static/media` — dlaczego w buildzie produkcyjnym (`scripts/kopiuj-maplibre-worker.mjs`,
     import w `mapa-dzialki.tsx`)? Naprawa u źródła, nie tylko wykluczenie;
   - three.js — zależnie od odpowiedzi z pkt 2;
     **[30.09.2026] Odpowiedź: tylko online (D60)** — wykluczony po treści (`__THREE__`), komunikat na ekranie 3.
   - HTML stron: 21–78 KB na stronę — sprawdzić, co jest inline w HTML (payload RSC? słowniki?). Standard (README
     wzorca, „Odchudzenie HTML”) wydzielił słowniki i18n z HTML → 33,9 → 2,7 MB. U nas słowniki są w chunku (580 KB,
     jeden raz), więc zysk będzie mniejszy — zmierzyć zanim cokolwiek się ruszy;
   - chunki z `rev: 'i'` są reużywane między wersjami (`pobierzDoCache`), więc koszt 14 MB płaci się raz, a nie przy
     każdym deployu — uwzględnić to w rozmowie o budżecie.
4. Każde wykluczenie z precache = ten zasób nie działa offline. Lista wykluczeń + powód → `docs/memory.md` i sekcja
   w raporcie. Wykluczenie ekranu (nie biblioteki) z offline wymaga zgody właściciela i D#.

## 4. Czego ten plan NIE obejmuje (osobne zadania z listy, niezależne)

- 5.10 `navigator.storage.persist()` (`docs/przyklady/pwa/trwaly-magazyn.ts`).
- 5.11 kolizja wersji IndexedDB (`indexeddb-baza.ts`, `baza-wersja-listener.tsx`) — **po etapie 1**, bo użyje tego
  samego toastu (C-1).
- 8.11 eksport `subskrybujOnline` + stały region `role="status"` (raport, pkt 17).
- Wylogowanie a precache: po wylogowaniu strony zostają w cache i otwierają się offline. Do rozstrzygnięcia przy
  18.x (czy przy wylogowaniu kasować `offgrid-precache-*`) — zapisać jako pytanie w liście przy włączeniu Supabase.
