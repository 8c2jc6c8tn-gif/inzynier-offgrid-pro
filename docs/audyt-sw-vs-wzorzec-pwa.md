# Porównanie `public/sw.js` ze wzorcem PWA standardu (`docs/przyklady/pwa/`)

**Data:** 29.09.2026 · **Kategoria pliku:** LOKALNE (raport audytowy, Y.11) · **Kod:** bez zmian — decyzja właściciela niżej.

**Zamyka pytanie z 26.09.2026** (`docs/memory.md`, „Synchronizacja ze standardem — Y.6”, pkt 2): czy porównać nasz
ręczny Service Worker ze wzorcem Grupy B PWA/SW (`new-app-standards` @ `af63da7`, `docs/przyklady/pwa/`, reguły
5.8–5.12, 8.11, 10.8, 10.9).

## Metoda

1. Odczyt kodu: nasze `public/sw.js`, `public/register-sw.js`, `app/manifest.ts`, `middleware.ts`, `next.config.mjs`,
   `lib/adapters/indexeddb-storage-adapter.ts`, `lib/lokalizacja/use-online.ts` — wobec 10 plików wzorca + README.
2. **Pomiar na buildzie produkcyjnym** (10.9): `pnpm build` + `pnpm start`, Chromium sterowany biblioteką `playwright`
   (skrypt tymczasowy w scratchpadzie, poza repo). Scenariusz: wejście na `/` → na
   `/kalkulatory/agregat-pradotworczy` → offline → `/`, strona odwiedzona, strona nieodwiedzona
   (`/kalkulatory/analiza-spof`), obrazy pulpitu, manifest. Potem drugi i trzeci build (bez zmian w kodzie / z jedną
   tymczasową zmianą w `app/page.tsx`, cofniętą) na tym samym profilu przeglądarki.

## Wyniki pomiaru

| Sprawdzenie | Wynik |
|---|---|
| SW rejestruje się i przejmuje stronę | ✅ `/sw.js`, kontroler aktywny |
| Offline: `/` i strona odwiedzona | ✅ 200, `fromServiceWorker()` |
| Offline: **strona nieodwiedzona** | ❌ `net::ERR_FAILED` — natywny błąd przeglądarki |
| Offline: obrazy pulpitu `public/maskotki-bob/*.webp` | ❌ 6 z 6 niewyświetlonych |
| Offline: `/manifest.webmanifest` | ❌ błąd sieci |
| Strażnik „puste przejście” (`/api/**` offline) | ✅ zawodzi, jak powinien |
| Build 2 (ten sam kod) | Bez zmian: identyczne hashe chunków, `sw.js` bajtowo ten sam |
| Build 3 (1 zmiana w kodzie) | Cache `offgrid-v1` 27 → 28 wpisów: nowy chunk dodany, **stary nieusunięty** |

**Znalezisko uboczne (dotyczy standardu, 10.8):** w pierwszym przebiegu offline był emulowany samym
`context.setOffline(true)` i strona **nieodwiedzona** „działała” — SW pobrał ją z sieci i zapisał do cache.
`setOffline` Playwrighta (1.63, Chromium) **nie obejmuje `fetch()` wykonywanego przez sam Service Worker**. Strażnik z
10.8 (żądanie `/api/**` ze strony) tego nie wykrywa, bo takie żądanie SW puszcza wprost z karty, gdzie emulacja działa.
Dopiero ubicie serwera dało prawdziwy wynik (tabela wyżej). Zgłoszone w `docs/wklad-do-standardu.md`.

## Porównanie punkt po punkcie

| # | Obszar (reguła) | Nasz `public/sw.js` | Wzorzec standardu | Ocena |
|---|---|---|---|---|
| 1 | Własny SW, bez wtyczki (5.8, 11.8) | Ręczny JS, bez biblioteki | Ręczny JS, bez biblioteki | ✅ zgodne co do zasady |
| 2 | Forma (5.8) | Statyczny `public/sw.js` | `app/sw.js/route.ts` (`force-static`) wstrzykuje konfigurację do rdzenia | ⚠️ inna forma; nasza nie ma skąd wziąć listy plików buildu |
| 3 | Co jest offline (5.3) | Cache w locie: tylko strony i chunki **już odwiedzone** | Precache: wszystkie strony + `/_next/static` + `public/` przy instalacji | ❌ nieodwiedzony ekran offline nie działa (pomiar) |
| 4 | Nawigacja | Najpierw sieć, potem cache | Najpierw precache, potem sieć, potem `/_not-found` | ⚠️ u nas brak strony zastępczej — natywny błąd przeglądarki |
| 5 | Żądania RSC, `/api/**`, obce originy, nie-GET | Nieobsługiwane (idą do sieci) | Jawnie pomijane (`czyPominac`) | ✅ równoważne |
| 6 | Pliki `public/`, manifest (5.3) | Nie cache'owane | Precache z hashem treści | ❌ maskotki i manifest offline nie działają (pomiar) |
| 7 | Wersjonowanie (5.8) | Ręczne `CACHE_VERSION = "v1"`, nigdy niepodbite; `sw.js` bajtowo stały między deployami | Hash listy precache; klucz URL + `rev` | ❌ stare chunki nigdy nieusuwane — cache rośnie z każdym deployem (pomiar) |
| 8 | Aktualizacja (5.9) | `skipWaiting()` + `clients.claim()` bez pytania | Czekanie + toast „odśwież”, `SKIP_WAITING` na żądanie, rozróżnienie pierwszego `controllerchange` | ❌ niezgodne z regułą; skutek dziś mały, bo `sw.js` się nie zmienia (pkt 7) |
| 9 | Sprawdzanie aktualizacji (5.9) | Tylko domyślne przeglądarki (przy nawigacji) | Dodatkowo `visibilitychange`, max co 1 h | ⚠️ brak |
| 10 | SW w trybie dev (5.8) | Brak samousunięcia | Pod `/sw.js` w dev serwowany skrypt samousuwający | ❌ SW z `pnpm start` zostaje w przeglądarce przy późniejszym `pnpm dev` na tym samym porcie |
| 11 | Wyłącznik awaryjny (5.9) | Brak | `NEXT_PUBLIC_SW_WYLACZ=1` | ❌ brak |
| 12 | Middleware a pliki SW (5.8, akapit „instalacja atomowa”) | `matcher` w `middleware.ts` nie wyklucza `/sw.js`, `/register-sw.js`, `/manifest.webmanifest` (wyklucza tylko stare `manifest.json`) | Lista precache omija middleware | ❌ **uśpiony błąd:** po włączeniu Supabase (18.1) niezalogowany dostaje przekierowanie na `/auth/login` zamiast skryptu SW → rejestracja i każda aktualizacja SW zawodzą; manifest tak samo |
| 13 | Rejestracja | Zewnętrzny skrypt z `nonce`, tylko produkcja, `register("/sw.js")` | Komponent kliencki po `load`, `updateViaCache: 'none'`, sprzątanie | ⚠️ działa; brak `updateViaCache` i obsługi aktualizacji |
| 14 | Testy (10.8, 10.9) | Brak jakichkolwiek testów SW | Rdzeń w `node:vm` + e2e na dwóch buildach | ❌ brak |
| 15 | `navigator.storage.persist()` (5.10) | Nie wywoływane | Wywołanie + zapamiętanie odmowy | ❌ szkice formularzy (autosave 5.7) mogą zostać usunięte przez przeglądarkę (brak miejsca, iOS Safari po 7 dniach) |
| 16 | Kolizja wersji IndexedDB (5.11) | `DB_VERSION = 1`, brak `onversionchange`/`onblocked`/`VersionError` | Zdarzenia + trwały toast „odśwież” | ⚠️ uśpione — zadziała dopiero przy pierwszym podbiciu wersji bazy; trzeba zrobić **przed** nim |
| 17 | Wskaźnik offline (8.11) | `useOnline()` przez `useSyncExternalStore`, snapshot serwera `true` | To samo + subskrypcja jako eksportowana czysta funkcja, stały region `role="status"` | ⚠️ hook zgodny; subskrypcja nieeksportowana (nietestowalna osobno), brak stałego regionu `role="status"` |

**Podsumowanie:** 2 zgodne, 6 częściowo, 9 niezgodnych. Najważniejsze dla użytkownika: pkt **3** (montażysta w terenie
bez zasięgu otwiera ekran, którego wcześniej nie otworzył — dostaje błąd przeglądarki) i **12** (uśpiony błąd, który
wyłączy PWA w dniu włączenia logowania). Najważniejsze technicznie: pkt **7** (cache rośnie bez końca).

## Koszt pełnego precache w tym projekcie (fakty z buildu 29.09)

- Wszystkie ~230 tras są dynamiczne (`ƒ`) — `nonce` CSP z `headers()` w `app/layout.tsx`. Wzorzec pobierze więc każdą
  stronę z serwera przy instalacji SW (nie ze statycznego pliku). Działa, ale: zapisany HTML niesie `nonce` z chwili
  instalacji, używany potem wielokrotnie (osłabienie CSP 7.3 — **dziś to samo dotyczy stron odwiedzonych**, więc to nie
  nowe ryzyko, tylko większa skala).
- Rozmiar: HTML 220 kalkulatorów = **6,1 MB** (zmierzone, 21–78 KB/stronę) + `.next/static/chunks` **14 MB** +
  `.next/static/media` **4,2 MB** + `public/` **1,5 MB** ≈ **26 MB** przy pierwszej instalacji. Standard notuje
  33,9 MB jako „nie do przyjęcia” i 2,7 MB po odchudzeniu (5.8). Przed migracją trzeba sprawdzić, co zajmuje
  `media` i chunki (np. MapLibre, słowniki i18n) i co da się wyłączyć z precache albo dociągać przy pierwszym użyciu.
- Brak `sonner` w zależnościach — toast aktualizacji wymaga albo nowej zależności, albo własnego komponentu.

## Opcje do decyzji właściciela

- **A — migracja do wzorca standardu** (rdzeń `sw-rdzen.js`, `app/sw.js/route.ts`, `aktualizacja-sw.ts`, rejestracja
  z toastem, wyłącznik, test `node:vm`, e2e na buildzie) + poprawka `matcher` w middleware.
  *Plusy:* zamyka pkt 3–14 naraz; pełny offline każdego ekranu — zgodne z profilem aplikacji (praca w terenie);
  kod już przetestowany w innym projekcie. *Minusy:* ~26 MB przy pierwszej instalacji, dopóki nie odchudzimy; 1–2 sesje
  pracy; nowe teksty toastów PL/EN/RU.
- **B — zostać przy cache „w locie”, naprawić punktowo** (czyszczenie starych chunków, `public/` w cache, samousunięcie
  w dev, wyłącznik, `matcher`), a brak precache zapisać jako świadome odstępstwo (wpis D# w `rejestr-decyzji.md`).
  *Plusy:* mała zmiana, mały pierwszy download. *Minusy:* nieodwiedzony ekran nadal nie działa offline — trudne do
  obrony wobec 5.3 w aplikacji dla terenu bez zasięgu; czyszczenie starych chunków w cache „w locie” psuje strony
  odwiedzone przed deployem (dziś działają offline tylko dlatego, że stare chunki nie są kasowane).
- **C — A etapami:** najpierw wzorzec (rdzeń, wersjonowanie, aktualizacja, wyłącznik, testy, `matcher`) z precache
  samych stron + chunków, potem pomiar i odchudzenie `media`/chunków.

**Rekomendacja audytora: A w wariancie C.** Niezależnie od wyboru — pkt 12 (`matcher`) przed włączeniem Supabase,
pkt 15 (5.10) i 16 (5.11) to osobne, małe zadania, niezależne od kształtu SW (lista zadań).

## Stan po etapie 1 (29.09.2026, D59, `docs/plan-migracji-sw-wariant-c.md`)

| # | Obszar | Po etapie 1 | Dowód |
|---|---|---|---|
| 1 | Własny SW, bez wtyczki | ✅ bez zmian | `lib/pwa/sw-rdzen.js` |
| 2 | Forma | ✅ `app/sw.js/route.ts` (`force-static`), `public/sw.js` usunięty | build: `○ /sw.js` |
| 3 | Co jest offline | ✅ precache 238 stron + `/_next/static` + `public/` | e2e `offline.test.mjs`: każda strona offline przy **ubitym serwerze**, bez wcześniejszej wizyty |
| 4 | Nawigacja | ✅ precache → sieć → `/_not-found` (`app/not-found.tsx`, PL/EN/RU) | test `node:vm` + e2e |
| 5 | RSC, `/api/**`, obce originy, nie-GET | ✅ + `/auth/**` zawsze sieć | test `node:vm` |
| 6 | `public/`, manifest | ✅ z hashem treści (bez MapLibre i placeholderów) | e2e: maskotki `naturalWidth > 0`, manifest 200 offline |
| 7 | Wersjonowanie | ✅ hash listy; chunki `rev: 'i'` reużywane między wersjami; stary `offgrid-v1` kasowany | test `node:vm`; przejście ze starego SW sprawdzone ręcznie |
| 8 | Aktualizacja | ✅ czekanie + toast „Odśwież” (`sonner`), jedno przeładowanie | e2e `aktualizacja.test.mjs` na dwóch buildach |
| 9 | Sprawdzanie aktualizacji | ✅ `visibilitychange`, maks. co 1 h | kod wzorca 1:1 |
| 10 | SW w trybie dev | ✅ w dev `/sw.js` = skrypt samousuwający | ten sam mechanizm co pkt 11 (e2e) |
| 11 | Wyłącznik awaryjny | ✅ `NEXT_PUBLIC_SW_WYLACZ=1` | e2e: brak rejestracji i cache `offgrid-*` |
| 12 | Middleware a pliki SW | ✅ (29.09, przed etapem 1); martwe `register-sw.js`, `manifest.json` usunięte z `matcher` | build + e2e |
| 13 | Rejestracja | ✅ `components/pwa/sw-rejestracja.tsx`; hydracja bez `#412` | e2e: konsola bez błędów |
| 14 | Testy | ✅ Vitest (`lib/pwa/__tests__`, 26 testów) + `pnpm test:e2e` | — |
| 15 | `storage.persist()` (5.10) | 🔲 osobne zadanie | lista zadań |
| 16 | Kolizja wersji IndexedDB (5.11) | 🔲 osobne zadanie (toast już jest) | lista zadań |
| 17 | Wskaźnik offline (8.11) | 🔲 osobne zadanie | lista zadań |

**Pomiar precache po etapie 1:** 539 wpisów, **21,3 MB** (przed wykluczeniami ≈ 26 MB). Dalsze odchudzanie: etap 2.
**Przejście ze starego SW (jednorazowo przy pierwszym deployu):** stary SW serwuje strony z sieci, więc pierwsza
wizyta po deployu dostaje już nowy HTML z `SwRejestracja`; nowy SW instaluje się w tle (~14 s lokalnie), toast
pojawia się bez dodatkowej nawigacji, po „Odśwież” zostaje tylko `offgrid-precache-*`.
