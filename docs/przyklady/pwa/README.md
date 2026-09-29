# PWA / Service Worker referencyjny (5.8–5.10, 7.3, 8.11, 10.8)

Źródło: `inzynier-szkieletowy-pro`, PR #288 "PWA P0–P5: manifest, własny service worker offline,
aktualizacje, UX offline, e2e (D109)", zmergowany 24.09.2026, `docs/wklad-do-standardu.md`
(zgłoszenie U.4). Stack projektu źródłowego to Next.js (App Router)/TypeScript — **transferowalny
jest kształt decyzji i realny mechanizm przeglądarki, nie dosłowna treść pliku dla innego
frameworka.** Pliki w tym katalogu to dosłowna, niezmieniona treść odpowiednich plików z projektu
źródłowego (ścieżka oryginalna w nagłówku komentarza każdego pliku, jeśli tam była) — nie
szkielet, nie wersja "do adaptacji".

## Mapowanie plik → oryginalna ścieżka w projekcie źródłowym

| Plik tutaj | Ścieżka w `inzynier-szkieletowy-pro` |
|---|---|
| [`sw-route.ts`](sw-route.ts) | `app/sw.js/route.ts` |
| [`sw-rdzen.js`](sw-rdzen.js) | `lib/pwa/sw-rdzen.js` |
| [`precache.ts`](precache.ts) | `lib/pwa/precache.ts` |
| [`aktualizacja-sw.ts`](aktualizacja-sw.ts) | `lib/pwa/aktualizacja-sw.ts` |
| [`sw-rejestracja.tsx`](sw-rejestracja.tsx) | `components/pwa/sw-rejestracja.tsx` |
| [`use-online.ts`](use-online.ts) | `lib/hooks/use-online.ts` |
| [`indexeddb-baza.ts`](indexeddb-baza.ts) | `lib/store/indexeddb-baza.ts` |
| [`baza-wersja-listener.tsx`](baza-wersja-listener.tsx) | `components/pwa/baza-wersja-listener.tsx` |
| [`trwaly-magazyn.ts`](trwaly-magazyn.ts) | `lib/store/trwaly-magazyn.ts` |
| [`manifest.ts`](manifest.ts) | `app/manifest.ts` |

Świadomie pominięte (istnieją w projekcie źródłowym, ale nie zmieściły się w tym katalogu bez
utraty czytelności — dotyczą build-time czytania z `.next` i są bardziej specyficzne dla
Next.js-owego layoutu buildu niż resztą wzorca): `lib/pwa/precache-build.ts` (czyta
`app-path-routes-manifest.json`/`.next/static` i woła `zbudujWpisyPrecache`), testy
(`lib/pwa/__tests__/sw-rdzen.test.ts` w `node:vm`, `__tests__/aktualizacja-sw.test.ts`), pliki e2e
(`e2e/offline.test.mjs`, `e2e/aktualizacja.test.mjs`, `e2e/pomocnicze.mjs`) — ich **wzorzec
testowy** jest opisany niżej.

## Kształt (transferowalny do każdego stacku z App Router-podobnym routingiem)

- **Własny Service Worker, nie wtyczka bundlera.** D-PWA-1: `@ducanh2912/next-pwa`/Serwist
  sprzęgają się z wewnętrznym mechanizmem bundlera frameworka — ten sam rodzaj ryzyka, który
  utknął `zero-waste` na starym majorze Next.js (11.8). `sw-rdzen.js` to zwykły JS bez importów,
  serwowany dosłownie przez Route Handler (`sw-route.ts`, `dynamic = 'force-static'`) — działa
  identycznie na dowolnym hostingu, testowalny w `node:vm` bez przeglądarki.
- **Wersjonowanie przez hash listy precache, nie numer buildu.** `sw-route.ts` liczy
  `sha256(JSON.stringify(wpisy)).slice(0,12)` — SW dostaje nową wersję tylko wtedy, gdy realnie
  zmienił się zestaw/rev cachowanych URL-i, nie przy każdym deployu.
- **Precache: strony cache-first z fallbackiem na `/_not-found`, `/api/**` nigdy nie cachowane.**
  `sw-rdzen.js`, `czyPominac()` — RSC fetch (`rsc=1`/`_rsc` w query), inne originy, non-GET i
  `/api/**` idą zawsze na sieć wprost. Fallback na `_not-found` zamiast na błąd przeglądarki —
  nawigacja offline do URL-a spoza precache pokazuje appkę, nie natywny błąd sieci.
- **Reużycie niezmienionych wpisów między wersjami.** `pobierzDoCache()` w `sw-rdzen.js` najpierw
  szuka tego samego klucza (`url+rev`) w starych cache'ach przed pobraniem z sieci — instalacja
  nowej wersji nie ściąga ponownie zasobów, które się nie zmieniły.
- **Aktualizacja: toast z akcją, nigdy cichy automatyczny reload.** `aktualizacja-sw.ts` +
  `sw-rejestracja.tsx` — nowy SW instaluje się i **czeka**; przejście na nową wersję wymaga
  kliknięcia w toast (`sonner`, `duration: Infinity`). Rozróżnienie **pierwszego**
  `controllerchange` (to `clients.claim()` przy pierwszej wizycie, nie aktualizacja) od
  **realnej** zmiany kontrolera — `bylKontroler`/`zadanoPrzelaczenia` w `sledzAktualizacjeSw()`.
  Inna karta, która dostała nową wersję niezależnie (albo kill-switch), dostaje osobny,
  informacyjny toast (`naZmianeWInnejKarcie`) zamiast być cicho przeładowana.
- **Kill-switch przez treść pliku, nie przez usunięcie rejestracji.** `SW_USUN` w `sw-route.ts` —
  budowa z `NEXT_PUBLIC_SW_WYLACZ=1` serwuje inny, samousuwający się skrypt pod tym samym URL-em
  (`/sw.js`); każdy zainstalowany worker dostaje go jako "aktualizację" (inna treść bajtowa),
  aktywuje się natychmiast, kasuje precache i wyrejestrowuje się — bez czekania na akcję
  użytkownika w każdej otwartej karcie.
- **`useOnline()` przez `useSyncExternalStore`, snapshot serwera zawsze `true`.** `use-online.ts`
  — unika hydration mismatch (SSR/statyczny HTML nie zna stanu sieci, więc zakłada online; React
  podmienia na realny stan zaraz po hydracji, zgodnie z kontraktem `useSyncExternalStore`).
  Subskrypcja (`subskrybujOnline`) wydzielona jako czysta funkcja — testowalna w środowisku `node`
  bez `jsdom` (`vi.stubGlobal`).
- **Kolizja wersji IndexedDB między kartami — osobny mechanizm od SW.** `indexeddb-baza.ts` +
  `baza-wersja-listener.tsx`: gdy jedna karta z nowszym kodem podbija wersję schematu bazy, karta
  ze starym kodem dostaje `VersionError` przy **każdym** kolejnym `indexedDB.open()` — pisanie do
  bazy (np. autosave) zaczyna cicho failować w tle, bez żadnego widocznego błędu użytkownikowi.
  Fix: `onversionchange`/`onblocked`/`onerror` (name `VersionError`) na otwartym połączeniu
  zgłaszają zdarzenie do subskrybentów poza React (moduł-level `Set` nasłuchujących), UI pokazuje
  trwały toast "odśwież" (`baza-wersja-listener.tsx`) — **nie** automatyczny reload, żeby nie
  zgubić niezapisanych danych w formularzu. Zdarzenie jest zapamiętywane
  (`wymagaOdswiezenia`) i odtwarzane późnym subskrybentom, bo store re-hydruje się zwykle
  zanim UI zdąży się zamontować.
- **`navigator.storage.persist()` — zapamiętaj odmowę, nie zgodę.** `trwaly-magazyn.ts` — Firefox
  pokazuje natywny prompt zgody na **każde** uruchomienie appki, dopóki odmowa nie zostanie
  zapamiętana lokalnie (`localStorage`, klucz `trwaly-magazyn-odmowa`); zgoda nie wymaga osobnej
  pamięci, bo `persisted()` już wiarygodnie zwraca `true` przy kolejnym sprawdzeniu. Wywołanie
  ograniczone do raz na wczytanie strony (moduł-level `Promise`, `_resetTrwalyMagazyn()` tylko do
  testów).

## Pułapka `experimental.useOffline` (App Router, Next.js)

Nie włączać w architekturze offline-first: zamiast przełączyć nawigację na stronę z precache przy
braku sieci, `experimental.useOffline` **wstrzymuje nawigację do powrotu sieci** — dokładne
przeciwieństwo tego, czego appka offline-first potrzebuje. Wzorzec w `sw-rdzen.js` (fallback RSC
fetch → pełna nawigacja → precache) działa bez tej flagi i celowo ją omija.

## Pułapka CSP + WASM (`'wasm-unsafe-eval'`, nigdy szerszy `'unsafe-eval'`)

Weryfikacja CSP musi obejmować **klikanie** akcji korzystających z WASM/Workerów/Blob/zewnętrznego
fetch, nie tylko sam load strony — w projekcie źródłowym `@react-pdf/renderer` liczy layout przez
`yoga-layout` skompilowane do WebAssembly, które kompiluje się dopiero **w momencie kliknięcia**
"Generuj PDF", nie przy wczytaniu strony; bez `'wasm-unsafe-eval'` w `script-src` akcja kończyła
się błędem CSP (`WebAssembly.instantiate`) niewidocznym przy zwykłym przeglądaniu appki. Dyrektywa
pozwala **tylko** na kompilację WASM, nie na `eval()` dowolnego JS — nie mylić z szerszym
`'unsafe-eval'`.

## Wzorzec testowy (e2e bez nowych zależności)

`node --test` (wbudowane w Node.js) + biblioteka `playwright` (nie `@playwright/test`) przeciwko
dwóm prawdziwym, kolejnym buildom produkcyjnym (`next build && next start`) — losowy `BUILD_ID`
naturalnie daje nową wersję SW między buildami, bez sztucznego bumpowania. Kluczowe elementy:
- `response.fromServiceWorker()` jako dowód, że odpowiedź faktycznie poszła przez SW, nie przez
  sieć mimo `context.setOffline(true)`.
- **Strażnik "pusty przelot"**: żądanie, którego SW nie obsługuje (`/api/**`), musi jawnie
  **failować** offline (`fetch(..., {cache:'no-store'}).then(()=>true,()=>false)` przed testami)
  — inaczej błąd w konfiguracji `context.setOffline` dawałby fałszywie zielone testy na wszystkim.
- Lista stron do przetestowania offline pochodzi z manifestu buildu, nie jest ręcznie utrzymywana.
- `request.isNavigationRequest()` na głównej ramce do liczenia przeładowań — nie
  `framenavigated`, które liczy podwójnie przy `history.replaceState` routera.
- Serwer (`next start`) uruchamiany z `{detached: true}`, ubijany przez `process.kill(-pid)`
  (grupa procesów) — `pkill -f`/`pgrep -f` ryzykują ubicie własnej powłoki wywołującej.

## Odchudzenie HTML przed włączeniem SW (kontekst 5.2)

Słowniki i18n pre-paint (EN/RU) wbudowane inline w każdą z 43 statycznych stron dawały ~860 KB
HTML na stronę (i drugi raz w payloadzie RSC). Wydzielenie ich do osobnych, statycznych plików JS
(Route Handler `force-static`, `/i18n-prepaint/{en,ru}`, wersjonowane przez `?v=`) zmniejszyło
łączny rozmiar precache z 33.9 MB do 2.7 MB — zrobione **przed** P1 (sam SW), bo precache
33.9 MB byłby nie do przyjęcia na słabszym łączu/urządzeniu.
