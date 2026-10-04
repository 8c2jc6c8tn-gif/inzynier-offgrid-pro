# Archiwum docs/lista-do-zrobienia.md — 04-zadania-cz4.md

Dosłowna kopia (1:1) wpisów ze statusem ✅ przeniesionych 03.10.2026 z `docs/lista-do-zrobienia.md` (Sekcja „Zadania”). Kolejność oryginalna. Nic nie edytowano wstecz.

---

- ✅ (2026-09-16) **Rozdział 9 (AI w produkcie) — pierwsza realna integracja (Priorytet 1, punkt 1
  z audytu wyżej).** Zakres świadomie wąski: jedno narzędzie AI (`kalkulatoryPomocniczeTool`,
  `operationType: "read"`), jeden pilotażowy ekran (`/kalkulatory/pomocnicze`, ten sam moduł co
  pilot i18n). Zbudowano: `lib/ai/types.ts` (kontrakt `AiToolDefinition<TInput,TOutput>` 1:1 z
  9.3 + `validateAiToolDefinition` — rzuca błąd dla `write`+`requiresConfirmation: false`),
  `lib/adapters/ai/{config,client}.ts` (`isAiConfigured()`, `createAnthropicClient()`,
  `server-only`), `lib/ai/tools/kalkulatory-pomocnicze-tool.ts` (handler deleguje do prawdziwego
  `calculateKalkulatoryPomocnicze()`, nigdy nie liczy sam), `lib/ai/to-anthropic-tool.ts`
  (`z.toJSONSchema()` — bez dodatkowej biblioteki), `lib/ai/pytaj-asystenta.ts` (ręczna pętla
  agentowa — zainstalowana wersja `@anthropic-ai/sdk` 0.126.0 nie ma jeszcze beta Tool Runnera,
  sprawdzone wprost w `node_modules`), `lib/ai/is-ai-available.ts` + `components/asystent-ai.tsx`
  (degradacja w milczeniu bez `ANTHROPIC_API_KEY`, ten sam wzorzec co `KontoSekcja`/Supabase w
  rozdz. 18). Testy: `lib/ai/__tests__/types.test.ts`, `lib/ai/tools/__tests__/kalkulatory-pomocnicze-tool.test.ts`,
  `lib/adapters/ai/__tests__/config.test.ts` (9+4+4 = razem 13 nowych testów). Zweryfikowane:
  `pnpm typecheck`/`lint`/`test` (722/722) czyste, `pnpm build` bez błędów, `pnpm start` + realny
  request na `/kalkulatory/pomocnicze` bez `ANTHROPIC_API_KEY` — strona renderuje się poprawnie,
  sekcja asystenta bezpiecznie nie pojawia się (brak wyjątku, brak martwego UI). Świadomie poza
  zakresem (nie przeoczenie): więcej narzędzi/modułów AI, `AiMode` (OFFLINE/HYBRID/CLOUD_ASSISTED,
  9.6) nie podłączony do trwałego stanu — dziś tylko `CLOUD_ASSISTED` ma sens (brak modelu
  lokalnego), pamięć rozmowy czatu (9.7 — świadome uproszczenie pierwszego kroku), budżet/limity
  zapytań (9.8), pełna obrona przed prompt injection z treści zewnętrznych (9.4 — dziś niskie
  ryzyko: brak zdjęć/OCR/importu dokumentów do apki, jedyny wektor to tekst pytania usera, już
  traktowany jako dane w `tool_result`, nigdy jako `system`). Szczegóły i uzasadnienia
  architektoniczne: `docs/memory.md`.
- ✅ (2026-09-16) **5.3 (PWA offline-first) — manifest + service worker (Priorytet 2 z audytu
  wyżej).** `app/manifest.ts` (konwencja Next.js Metadata File → `/manifest.webmanifest`),
  `public/sw.js` (ręcznie pisany, bez biblioteki — cache-first dla `/_next/static/*`,
  network-first z fallbackiem do cache dla nawigacji), rejestrowany przez zewnętrzny
  `public/register-sw.js` (`<script src>` w `app/layout.tsx`, tylko produkcja). Ikony 192/512px
  wyrenderowane z istniejącego `public/icon.svg`. Przy okazji naprawiony realny placeholder:
  `app/layout.tsx` miał tytuł "v0 App"/"Created with v0" (nieużywany szkielet v0.app, nigdy
  niewypełniony) — teraz prawdziwa nazwa i opis projektu + `appleWebApp` (instalacja na iOS).
  **Uczciwie zgłoszone, nie ukryte:** ikony (`icon.svg`/`apple-icon.png`/192/512px) to wciąż
  domyślny znak graficzny v0.app, nie własne logo "Inżynier Offgrid Pro" — świadomie
  niezaadresowane w tym zadaniu (decyzja wizualna, nie inżynierska), do rozważenia osobno.
  **Znalezisko przy weryfikacji (poza zakresem tego zadania, zgłoszone i pozostawione na
  wyraźne polecenie właściciela — "poprawki idą z aktualizacją standardu, zaczekaj"):**
  produkcyjna CSP (`next.config.mjs`, 7.3) dopuszcza tylko jeden zahardkodowany hash inline
  skryptu (`WYGLAD_INIT_SCRIPT`) — nie obejmuje inline-skryptów RSC streaming, które Next.js
  generuje na każdej stronie, więc **hydracja Reacta psuje się na każdym ekranie w realnej
  produkcji** (`React error #412`), niezależnie od tego zadania. Zweryfikowane programistycznie
  jako pre-existing (identyczne na `main` sprzed PWA, w izolowanym worktree) — nie spowodowane
  tą zmianą. Rejestracja SW celowo zaprojektowana tak, by NIE zależeć od tej zepsutej hydracji
  (zewnętrzny `<script src>`, nie komponent kliencki w drzewie Reacta) — potwierdzone działające
  mimo błędu CSP. Właściwa naprawa (nonce-per-request zamiast statycznego hasha) czeka na
  aktualizację ze standardu, NIE wykonana teraz na wyraźną prośbę. Zweryfikowane end-to-end
  (Playwright, `pnpm start`, prawdziwa produkcyjna CSP): manifest serwowany poprawnie, SW
  rejestruje się automatycznie, strona odwiedzona wcześniej ładuje się offline (status 200,
  poprawna treść) po przejściu w tryb offline. `pnpm typecheck`/`lint`/`test` (722/722)/`build`
  czyste. Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16, czwarta synchronizacja tego dnia) **Aktualizacja ze standardem — 7 nowych wpisów
  `AKTUALIZACJE.md` (wiersze 67-73), GOD BOOK bez zmiany wersji (nadal v2.19).** Nadpisane:
  `00-INDEKS.md`, `07-bezpieczenstwo.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `18-logowanie.md`.
  **Konkretne zadanie dla tego projektu (wpis 70, 7.3 — "hash CSP liczony automatycznie, nigdy
  ręcznie"):** nowy `scripts/check-csp-hash.mjs` w CI (`pnpm check:csp-hash`) — liczy SHA-256
  `WYGLAD_INIT_SCRIPT` z `app/layout.tsx` i porównuje z `WYGLAD_INIT_SCRIPT_HASH` w
  `next.config.mjs`, blokuje merge przy rozjeździe zamiast polegać na pamięci. Zweryfikowany na
  obu przypadkach (zgodny hash → OK; ręcznie zepsuty skrypt → wykryty, exit 1).
  **🔴 Ważne rozróżnienie, nie pomylić:** ten wpis NIE naprawia krytycznego błędu znalezionego
  przy pracy nad 5.3 (PWA) — produkcyjna CSP nadal blokuje inline-skrypty RSC streaming Next.js
  na każdej stronie (`React error #412`), bo wpis 70 dotyczy tylko ryzyka rozjazdu hasha dla
  JEDNEGO już istniejącego skryptu, nie fundamentalnej niekompatybilności statycznego hasha z
  dynamicznie generowanymi skryptami Next.js. Właściwa naprawa (CSP oparta o nonce-per-request)
  wciąż nie jest częścią standardu — pozostaje odłożona, tak jak ustalono wcześniej dziś.
  Pozostałe wpisy (67-69, 71-73) nie wymagały zmian w kodzie — projekt już zgodny (18.5:
  `createBrowserClient` już usunięty w rozdz. 18; 17.4: cookie+server-side już jedyny mechanizm;
  17.8: pl/en/ru już zbudowane) albo dotyczą innych projektów rodziny/samego mechanizmu U.4.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-16, piąta synchronizacja tego dnia) **Naprawiony krytyczny błąd CSP/RSC streaming
  — hydracja Reacta działa poprawnie w produkcji.** Zgłoszony do `wklad-do-standardu.md` (PR #101)
  wcześniej dziś błąd (hash-based CSP blokujący inline-skrypty RSC Next.js na każdej stronie)
  został skonsolidowany przez `new-app-standards` z konkretną, jednoznaczną akcją dla tego
  projektu — nonce-per-request zamiast statycznego hasha. Wdrożone: `middleware.ts` generuje
  losowy nonce (`crypto.randomUUID()`) na każde żądanie, ustawia CSP dynamicznie (`script-src
  'self' 'nonce-{wartość}'`) i przekazuje nonce do `app/layout.tsx` przez nagłówek `x-nonce`
  (odczyt przez `headers()` z `next/headers`) — Next.js automatycznie dokłada ten sam nonce do
  własnych inline-skryptów RSC streaming. `next.config.mjs` już nie ustawia CSP (nie ma dostępu
  do per-request nonce'u w statycznej funkcji `headers()`) — tylko pozostałe, statyczne nagłówki
  bezpieczeństwa. Usunięty `scripts/check-csp-hash.mjs` (nieaktualny — nie ma już hasha do
  weryfikacji).
  **Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  prawdziwa produkcyjna CSP):** zero błędów CSP w konsoli, zero `React error #412`, **interakcja
  po hydracji realnie działa** (zmiana trybu w selektorze przelicza wynik na żywo — dowód, że to
  nie tylko "strona się ładuje", ale że hydracja faktycznie się powiodła), service worker
  rejestruje się automatycznie, offline nadal działa. Dodatkowo zweryfikowany `pnpm dev` (CSP
  złagodzona dla HMR, cookie języka nadal poprawnie ustawiana) — middleware nie regresował.
  `pnpm typecheck`/`lint`/`test` (722/722)/`build` czyste. Szczegóły uzasadnień: `docs/memory.md`.
- ✅ (2026-09-16) **Start rolloutu i18n (moduł po module, 17.9) — pierwsza partia: 3 moduły ponad
  pilotaż.** Zmigrowane do `i18nKey`/`params` (bez gotowego tekstu PL w `Warning.message`/
  `assumptions`): `systemy-podtrzymania-zycia`, `cop-pompy-ciepla`, `lokalizacja-i-klimat` —
  wybrane jako pierwsza partia, bo ich strony UI już korzystały z `useTranslate()`
  (najszybszy realny efekt: tylko treść, UI już podłączone). 8 nowych kluczy w
  `dictionary-{pl,en,ru}.ts`. `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone
  z 1 do 4 pozycji.
  **Realny błąd znaleziony i naprawiony przy tej migracji (nie w tych trzech modułach — w
  stronach UI, które je renderują):** wszystkie trzy strony renderowały ostrzeżenia przez samo
  `{w.message}`, bez fallbacku `?? t(w.i18nKey ?? w.code, w.params)` (w odróżnieniu od
  `assumptions`, które już miały poprawny wzorzec, i od współdzielonego
  `components/wzorce/wynik-szczegoly.tsx`, który też ma to poprawnie) — po usunięciu
  `Warning.message` z tych trzech modułów ostrzeżenia renderowałyby się jako puste. Naprawione
  w `app/kalkulatory/{systemy-podtrzymania-zycia,cop-pompy-ciepla,lokalizacja-i-klimat}/page.tsx`.
  Znalezione przez czytanie kodu przed uruchomieniem, nie przez awarię w przeglądarce — ale
  pokazuje, że "strona już używa `useTranslate()`" nie jest dowodem, że KAŻDA ścieżka renderowania
  na niej faktycznie tłumaczy — trzeba sprawdzić `warnings` i `assumptions` osobno.
  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU, zarówno `assumptions` jak i `warnings`): poprawny przetłumaczony
  tekst, zero znaczników braku klucza (`⚠ [...]`), zero błędów konsoli związanych z i18n. 8 nowych
  testów (parytet/podstawianie parametrów w `t.test.ts` + asercje `i18nKey`/`params`/`message ===
  undefined` w każdym z 3 modułów, zgodnie z 17.9 — test w tej samej turze co treść).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (730/730)/`build` czyste.
  **Pozostało do zrobienia** (świadomie odłożone do kolejnych partii, nie przeoczenie):
  ~86 pozostałych plików `warnings.ts`/`calculator.ts` z gotowym tekstem PL, cała reszta UI
  chrome (Pulpit, Ustawienia, nawigacja, etykiety werdyktu) — 0% zmigrowane. Napotkane, odłożone
  przypadki trudniejsze niż prosty `i18nKey`/`params`: `czystosc-i-snieg` (tekst PL wprost w polu
  `value` wyniku, np. `opis`/`powod` — wymaga zmiany kształtu typu wyniku, nie tylko
  `warnings`/`assumptions`), `porownanie-technologii` (nazwy/opisy technologii bateryjnych w
  `constants.ts` — osobna kategoria danych, nie komunikat). Szczegóły: `docs/memory.md`.
- ✅ (2026-09-18) **Rollout i18n — druga partia: kolejne 3 moduły.** Zmigrowane do `i18nKey`/
  `params`: `liczba-domownikow`, `dni-autonomii`, `moc-pozorna-cosfi` (wszystkie z Modułu 2
  "Zapotrzebowanie energetyczne", jak partia 1). 8 nowych kluczy w `dictionary-{pl,en,ru}.ts`
  (w tym reużycie istniejącego `WARTOSC-NIEDODATNIA` dla `moc-pozorna-cosfi`'s `notPositive` —
  identyczny tekst źródłowy, brak duplikatu). Uwaga: nowy klucz `SPRAWNOSC-PROCENT-POZA-ZAKRESEM`
  (nie `SPRAWNOSC-POZA-ZAKRESEM`, mimo że `dni-autonomii/warnings.ts` ma funkcję o tej nazwie) —
  bo istniejący klucz `SPRAWNOSC-POZA-ZAKRESEM` już oznacza co innego (zakres ułamkowy (0,1],
  z pilota `kalkulatory-pomocnicze`), a `dni-autonomii` waliduje zakres procentowy 0–100% —
  różna semantyka, nie wolno nadpisać/reużyć tego samego klucza. `scripts/check-i18n-guard.mjs`
  → `MIGRATED_MODULES` rozszerzone z 4 do 7 pozycji.
  **Ten sam wzorzec błędu co w partii 1, powtórzony w 2 z 3 stron:** `dni-autonomii/page.tsx` i
  `moc-pozorna-cosfi/page.tsx` renderowały `{w.message}` bez importu `useTranslate()` w ogóle
  (nie tylko brak fallbacku — brak w ogóle mechanizmu tłumaczenia na stronie). Naprawione
  (dodany `useTranslate()` + `?? t(w.i18nKey ?? w.code, w.params)`). `liczba-domownikow/page.tsx`
  był już poprawny — korzysta ze współdzielonego `components/wzorce/wynik-szczegoly.tsx`.
  Potwierdza wniosek z partii 1: sprawdzić rendering `warnings`/`assumptions` na KAŻDEJ stronie
  osobno, "moduł ma i18nKey" nie znaczy "strona go pokaże".
  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU): poprawny przetłumaczony tekst, zero `⚠ [...]`, zero błędów
  konsoli i18n. 8 nowych testów (parytet/podstawianie w `t.test.ts` + asercje `i18nKey`/`params`/
  `message === undefined` w każdym module, ta sama tura co treść, 17.9).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (738/738)/`build` czyste.
  **Pozostało:** ~83 plików. Napotkane, odłożone przypadki jak w partii 1 (`czystosc-i-snieg`,
  `porownanie-technologii`) — bez zmian, nadal czekają na osobną decyzję architektoniczną.
- ✅ (2026-09-18) **Rollout i18n — trzecia partia: 5 modułów `baterie/`, decyzja o kontynuacji do
  końca (83 pliki).** Właściciel poprosił o kontynuację bez przerw aż do wyczerpania listy — od
  tej partii PR-e obejmują większe partie modułów (nie po 3), żeby ograniczyć liczbę cykli
  PR/CI/merge na tak dużą liczbę plików. Zmigrowane: `chlodzenie-latem`, `cold-c-rate`,
  `cold-cranking-amps`, `detekcja-doziemienia`, `detekcja-zwarcia-efuse`. 18 nowych kluczy w
  `dictionary-{pl,en,ru}.ts` (w tym `WARTOSC-UJEMNA` — nowy generyczny klucz `{label}` dla
  wzorca "nie może być ujemna", odróżniony od istniejącego `WARTOSC-NIEDODATNIA`/`ZAPOTRZEBOWANIE-UJEMNE",
  bo semantyka >=0 vs >0 jest różna). `WARTOSC-NIEDODATNIA` reużyty w `detekcja-zwarcia-efuse`
  (identyczny tekst źródłowy). `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 7 do 12.
  **Trzeci raz ten sam wzorzec błędu w stronach UI:** `chlodzenie-latem`, `cold-c-rate`,
  `detekcja-zwarcia-efuse`, `detekcja-doziemienia` renderowały `{w.message}` bez fallbacku (2 z
  nich bez `useTranslate()` w ogóle). Naprawione. **Dodatkowo znaleziony i naprawiony osobny,
  niezależny od i18n błąd:** `cold-cranking-amps/page.tsx` w gałęzi sukcesu w ogóle nie
  przekazywało `warnings` do `WynikSzczegoly` — ostrzeżenie „Falownik się wyłączy”/„Falownik
  utrzyma napięcie” nigdy się nie wyświetlało, niezależnie od i18n. Dopisano `warnings={result.warnings}`.
  **Pułapka narzędziowa złapana podczas weryfikacji:** stary proces `next-server` z partii 2
  (uruchomiony przez `pnpm start`, nie zabity poprawnie poprzednim `pkill -f "next start"` — nazwa
  procesu to `next-server`, nie `next start`) wciąż nasłuchiwał na porcie 3000 i serwował
  przestarzały build bez nowych kluczy słownika — dał fałszywy `⚠ [BRAK-ZABEZPIECZENIA-DOZIEMIENIA]`
  w pierwszym przebiegu Playwright. Naprawione: `pkill -9 -f "next-server"` (dokładna nazwa
  procesu), rebuild + restart, powtórna weryfikacja czysta. Zapamiętane dla kolejnych partii:
  zawsze zabijać serwer po dokładnej nazwie procesu (`ps aux | grep next-server`), nie zgadywać
  nazwy komendy startowej.
  8 nowych testów domenowych + rozszerzony blok w `t.test.ts` (12 kluczy z parametrami/6 bez).
  Zweryfikowane end-to-end w przeglądarce (Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU
  — zero `⚠ [...]`, zero błędów konsoli i18n. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (746/746)/`build` czyste. **Pozostało ~76 plików**, `czystosc-i-snieg`/`porownanie-technologii`
  nadal odłożone bez zmian.
- ✅ (2026-09-18) **Rollout i18n — czwarta partia: 5 modułów `baterie/` + rozszerzenie strażnika
  o `validation.ts`.** Zmigrowane: `dobor-bezpiecznika-dc`, `dobor-pojemnosci`, `grzalki-bms-mroz`,
  `kalibracja-soc`, `koniec-ladowania`. 22 nowe klucze (w tym 2 retroaktywne poprawki dla już
  zmigrowanych modułów, patrz niżej). `komunikacja-bms` (kolejny kandydat w kolejce) **odłożony,
  dołączony do zbioru "dane katalogowe"** obok `porownanie-technologii` — jego ostrzeżenia
  wstawiają etykiety protokołów z `PROTOKOLY` (`constants.ts`), z których 2 z 5 zawierają polski
  tekst ("Pylontech (protokół producenta)", "Inny / nieznany") — migracja samego `Warning` bez
  migracji katalogu dałaby pół-przetłumaczony komunikat, ten sam problem architektoniczny co
  katalog technologii bateryjnych.
  **Znaleziona luka w strażniku i18n:** `scripts/check-i18n-guard.mjs` sprawdzał tylko
  `warnings.ts`/`calculator.ts`, nigdy `validation.ts` — a dwa moduły (jeden już zmigrowany w
  partii 3: `chlodzenie-latem`, jeden w tej partii: `koniec-ladowania`) miały twardy tekst PL
  wpisany bezpośrednio jako inline `Warning` w `validation.ts`, poza `warnings.ts`. Naprawione:
  `FILES_TO_CHECK` rozszerzone o `validation.ts`; oba znalezione przypadki zmigrowane
  (`TEMPERATURA-FIZYCZNIE-NIEMOZLIWA`, `PROG-KONCOWY-POZA-ZAKRESEM`), z testem dopisanym do
  `chlodzenie-latem.test.ts` retroaktywnie. **Zasada do zapamiętania:** przy każdym module od tej
  partii sprawdzać `grep -n message: validation.ts` obok `warnings.ts`/`calculator.ts` — twardy
  tekst potrafi być wpisany inline w walidacji, nie tylko przez funkcje z `warnings.ts`.
  3 strony UI naprawione (ten sam wzorzec `{w.message}` bez fallbacku, jak w partiach 1-3).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 12 do 17.
  7 nowych testów domenowych + rozszerzony blok w `t.test.ts`. Zweryfikowane end-to-end w
  przeglądarce (Playwright, świeży `pnpm build && pnpm start`, z potwierdzeniem że proces
  faktycznie zszedł przed startem — pułapka z poprzedniej partii) w PL/EN/RU — zero `⚠ [...]`.
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (753/753)/`build` czyste.
  **Pozostało ~71 plików** (+1 nowo odłożony: `komunikacja-bms`).
- ✅ (2026-09-18) **Rollout i18n — piąta partia: 5 modułów `baterie/`, wzorzec sezonowy.**
  Zmigrowane: `long-term-storage`, `mixing-rownolegle`, `modul-ev`, `obwod-precharge`,
  `pobor-wlasny-bms`. 15 nowych kluczy.
  **Nowy wzorzec pułapki znaleziony i naprawiony przed shipem (nie po):** `modul-ev`'s
  `pokryteWCalosci(sezon)`/`brakujeEnergii(sezon, brakKwh)` przyjmowały dosłowny polski tekst
  `"Latem"`/`"Zimą"` jako parametr `sezon`, wstawiany bezpośrednio do treści ostrzeżenia. Gdyby
  zmigrowano to naiwnie (`i18nKey` + `params: {sezon}`), słowo "Latem"/"Zimą" zostałoby wstawione
  dosłownie w środku przetłumaczonego zdania angielskiego/rosyjskiego — pół-przetłumaczony
  komunikat, dokładnie ten sam problem co katalog `komunikacja-bms`/`porownanie-technologii`, ale
  tym razem możliwy do naprawienia bez architektonicznej przebudowy (tylko 2 stałe warianty, nie
  otwarty katalog). Rozwiązanie: `warnings.ts` przyjmuje teraz identyfikator `Sezon = "lato" |
  "zima"` (nie wyświetlany tekst), a i18nKey jest wybierany warunkowo (`POKRYTE-W-CALOSCI-LATO`/
  `-ZIMA`, `BRAKUJE-ENERGII-LATO`/`-ZIMA`) — sezon zaszyty w przetłumaczonym tekście klucza, nie
  przekazywany jako `{param}`. `calculator.ts` zmieniony, żeby wołać `pokryteWCalosci("lato")`
  zamiast `pokryteWCalosci("Latem")`. **Zasada do zapamiętania dla kolejnych partii:** jeśli
  funkcja `warnings.ts` przyjmuje string, który jest jednocześnie (a) wyświetlanym tekstem PL i
  (b) parametrem sterującym wyborem treści (a nie czystą liczbą/etykietą pola) — sprawdzić, czy to
  nie jest zamknięty, mały zbiór wariantów (→ osobne klucze per wariant, jak tutaj) czy otwarty
  katalog (→ odłożyć, jak `komunikacja-bms`).
  3 strony naprawione (ten sam wzorzec `{w.message}` bez fallbacku).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 17 do 22.
  8 nowych testów domenowych (w tym test wprost sprawdzający, że `POKRYTE-W-CALOSCI-LATO` ≠
  `-ZIMA` w każdym języku — regresja tego wzorca byłaby niewidoczna bez takiego testu) +
  rozszerzony blok w `t.test.ts`. Zweryfikowane end-to-end w przeglądarce (Playwright, świeży
  `pnpm build && pnpm start`, z potwierdzeniem `ps aux | grep next-server` przed i po) w PL/EN/RU
  — zero `⚠ [...]`, spot-check `modul-ev`/EN potwierdził "Summer:"/"Winter:" zamiast
  "Latem:"/"Zimą:" w przetłumaczonym zdaniu. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (761/761)/`build` czyste. **Pozostało ~66 plików.** `napiecie-systemowe` (377 linii) świadomie
  odłożony do osobnej partii ze względu na rozmiar.
- ✅ (2026-09-18) **Rollout i18n — szósta partia: 5 modułów `baterie/`, dwie kolejne przeoczone
  wiadomości inline w `validation.ts` znalezione i naprawione.** Zmigrowane: `ochrona-wilgoc`,
  `oplacalnosc-magazynu`, `pozycjonowanie-ogniw`, `second-life`, `slabe-ogniwo`. 22 nowe klucze.
  Strażnik i18n (rozszerzony w partii 4 o `validation.ts`) złapał — jeszcze przed shipem, nie po —
  inline `Warning` z gotowym tekstem PL w `pozycjonowanie-ogniw/validation.ts`
  (`DOCISK-UJEMNY`) oraz w `second-life/calculator.ts` (`SOH-ZEROWY`, inline literal, nie funkcja
  z `warnings.ts`) — oba naprawione w tej samej turze.
  5 stron UI naprawionych (ten sam wzorzec `{w.message}` bez fallbacku, jak w partiach 1-5).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 22 do 27.
  9 nowych testów domenowych + rozszerzony blok w `t.test.ts` (13 kluczy z parametrami/9 bez).
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, `pnpm build && pnpm start`, z
  potwierdzeniem `ps aux | grep next-server` = puste przed startem) w PL/EN/RU — zero `⚠ [...]`.
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (768/768)/`build` czyste.
  **Pozostało ~61 plików.** `napiecie-systemowe`, `czystosc-i-snieg`, `porownanie-technologii`,
  `komunikacja-bms` nadal odłożone.
- ✅ (2026-09-18) **Rollout i18n — siódma partia: 5 modułów `baterie/`, zamyka "normalne" moduły
  tego katalogu.** Zmigrowane: `soh-per-ogniwo`, `starzenie-degradacja`,
  `szyny-zbiorcze-miedzypakietowe`, `topologia-bms`, `vehicle-to-home`. 16 nowych kluczy.
  2 strony UI naprawione (ten sam wzorzec `{w.message}` bez fallbacku: `soh-per-ogniwo`,
  `topologia-bms`) — pozostałe 3 strony modułów tej partii już poprawnie korzystały z
  `WynikSzczegoly`. `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 27 do 32.
  5 nowych bloków testowych domenowych (`it("i18n (17.2): ...")` per moduł) + nowy blok w
  `t.test.ts` (6 kluczy z parametrami/10 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (775/775)/`build` czyste. Zweryfikowane end-to-end w świeżej przeglądarce (Playwright,
  `pnpm build && pnpm start`, z potwierdzeniem `ps aux | grep next-server` = puste przed startem
  i po zatrzymaniu) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka wszystkie "normalne" moduły katalogu `baterie/`** — pozostają w nim tylko odłożone:
  `napiecie-systemowe` (rozmiar), `porownanie-technologii`, `komunikacja-bms` (katalog danych).
  **Pozostało ~56 plików** poza katalogiem `baterie/`: `okablowanie/` (~15), `pv/` (~10, bez
  odłożonego `czystosc-i-snieg`), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — kolejna partia zacznie od `okablowanie/`.
- ✅ (2026-09-18) **Rollout i18n — ósma partia: pierwsze 5 modułów `okablowanie/`.** Zmigrowane:
  `analiza-zwarciowa`, `dobor-bezpiecznika-rozlacznika`, `dobor-izolacji-kabla`,
  `dobor-mocy-falownika`, `dobor-przekroju-kabla`. 27 nowych kluczy (moduł
  `dobor-przekroju-kabla` sam wniósł 11 — największy, najbardziej rozbudowany moduł tej partii:
  1 błąd walidacji + 6 funkcji ostrzeżeń + 4 assumptions). 3 klucze reużyte z istniejącego
  słownika po weryfikacji identyczności tekstu 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×,
  `MODEL-ZWARCIA-PROSTEGO-NIZSZY` z Modułu 4 — trafne dopasowanie treści między modułami,
  nie tylko nazwy). Strażnik złapał kolejne 3 inline `Warning` z gotowym tekstem PL wpisane
  wprost w `dobor-bezpiecznika-rozlacznika/validation.ts` (`PRAD-ZNAMIONOWY-NIEDODATNI`,
  `PRAD-ZWARCIOWY-UJEMNY`, `AIC-UJEMNE`) — czwarty raz z rzędu, gdy rozszerzenie strażnika o
  `validation.ts` (partia 4) faktycznie wykrywa realną regresję przed shipem.
  1 strona UI naprawiona (`dobor-przekroju-kabla` — ten sam wzorzec `{w.message}` bez
  fallbacku ORAZ brak przekazania `warnings` do `WynikSzczegoly`, jak w `cold-cranking-amps`
  partii 3) — pozostałe 4 strony tej partii już poprawnie korzystały z `WynikSzczegoly`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 32 do 37.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (12 kluczy z parametrami/15
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (782/782)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostało ~51 plików**: `okablowanie/` (~10 pozostałych z 23 istniejących modułów), `pv/`
  (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2),
  `kalkulator-mobilny/` (~1) — kolejna partia kontynuuje `okablowanie/`.
- ✅ (2026-09-18) **Rollout i18n — dziewiąta partia: kolejne 5 modułów `okablowanie/`.**
  Zmigrowane: `glowna-szyna-wyrownawcza`, `laczenie-cu-al`, `ochrona-odwrotna-polaryzacja`,
  `ochrona-przepieciowa-spd`, `optymalizacja-trasy-kabla`. 27 nowych kluczy, 1 klucz reużyty
  1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 2×). 1 strona UI naprawiona (`glowna-szyna-wyrownawcza` —
  ten sam wzorzec `{w.message}` bez fallbacku i18n, tym razem wewnątrz `WerdyktPanel` bez
  `WynikSzczegoly`, naprawione wprost przez `useTranslate()` w stronie) — pozostałe 4 strony tej
  partii już poprawnie korzystały z `WynikSzczegoly`.
  🔴 **Znaleziony i naprawiony realny bug regresyjny (nie tylko literał tekstu):**
  `optymalizacja-trasy-kabla/calculator.ts` echuje krytyczne ostrzeżenia z
  `dobor-przekroju-kabla` (zmigrowany w partii 8) przez `trasaNieSpelniaWymagan(oznaczenie,
  w.message ?? w.code)` — od partii 8 `w.message` tego echa jest `undefined` (moduł zmigrowany
  nie ustawia już `message`), więc fallback pokazywałby surowy `w.code` (np.
  "PRZEKROJ-PONIZEJ-WYLICZONEGO") zamiast przetłumaczonego tekstu. Naprawione architektonicznie,
  nie kosmetycznie: `trasaNieSpelniaWymagan(oznaczenie)` teraz zwraca tylko ogólną etykietę
  ("Trasa X nie spełnia wymagań przekroju — zobacz szczegóły poniżej", nowy klucz
  `TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU`), a oryginalne ostrzeżenia echa (z ich `i18nKey`/`params`
  nienaruszone) są dociągane do wyniku obok, oznaczone `field: "trasaA"/"trasaB"` — żadny
  tekst nie jest spłaszczany do stringa w warstwie domenowej. Zweryfikowane end-to-end w
  przeglądarce (pełny wydruk `innerText` dla scenariusza z partii testowej, PL) — oba poziomy
  komunikatu (etykieta + szczegół) wyświetlają się poprawnie przetłumaczone.
  3 stringowe `assumptions` (w `ochrona-odwrotna-polaryzacja`, `ochrona-przepieciowa-spd`,
  `optymalizacja-trasy-kabla` ×4) skonwertowane na `{kod}`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 37 do 42 (żadnych inline
  literałów w `validation.ts` tej partii — strażnik przeszedł czysto bez nowych wykryć).
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (7 kluczy z parametrami/14
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (790/790)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostało ~46 plików**: `okablowanie/` (5 pozostałych: `pomiary-powykonawcze`,
  `string-box`, `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`,
  `wylaczniki-rcd` — zamyka katalog), `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — partia 10 kończy `okablowanie/`.
- ✅ (2026-09-19) **Rollout i18n — dziesiąta partia: ostatnie 5 modułów `okablowanie/`,
  zamyka cały katalog.** Zmigrowane: `pomiary-powykonawcze`, `string-box`,
  `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`, `wylaczniki-rcd`. 32 nowe
  klucze, 3 klucze reużyte 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×). 6 stringowych
  `assumptions` skonwertowanych na `{kod}`. Wszystkie 5 stron UI już poprawnie korzystały z
  `WynikSzczegoly` — brak napraw stron w tej partii (pierwszy raz od partii 6).
  Znalezione i naprawione proaktywnie (przed uruchomieniem strażnika, czytaniem kodu) 3
  inline `Warning` z gotowym tekstem PL wpisane wprost w `string-box/validation.ts`
  (`LICZBA-STRINGOW-UJEMNA`, `LICZBA-WEJSC-UJEMNA`, `BEZPIECZNIK-STRINGOWY-UJEMNY`) — piąty
  raz z rzędu to samo źródło regresji, ten sam wzorzec co w partiach 4, 6, 8.
  Dwa bliskie kolizje nazw kluczy rozstrzygnięte przez porównanie treści (nie tylko nazwy
  kodu): `wylaczniki-nadpradowe-dc`'s `AIC-PONIZEJ-PRADU-ZWARCIOWEGO` (kod) i `assumptions`
  tekst o AIC vs prąd zwarciowy miały bliskie, ale NIE identyczne odpowiedniki w istniejącym
  słowniku (`AIC-PONIZEJ-PRADU-ZWARCIOWEGO` z Modułu 4 — inny tekst; `AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA`
  z partii 8 — różni się słowem "łączeniowa" vs "wyłączania") — oba dostały odrębne, nowe
  klucze (`AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO`, `AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA`)
  zamiast błędnego reużycia.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 42 do 47.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (9 kluczy z parametrami/24
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (797/797)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **To zamyka cały katalog `okablowanie/`** (23 moduły — 18 zmigrowanych w partiach 8-10,
  5 wcześniej bez `message:` do migracji).
  **Pozostało ~41 plików**: `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1) — kolejna partia zaczyna `pv/`.
- ✅ (2026-09-19) **Rollout i18n — jedenasta partia: pierwsze 5 modułów `pv/`.** Zmigrowane:
  `dopasowanie-tablicy-falownika`, `konfigurator-stringow`, `napor-wiatru`,
  `niedopasowanie-paneli`, `ochrona-stringow`. `czystosc-i-snieg` (katalog `pv/`) pominięty —
  świadomie odłożony wcześniej (dane katalogowe). 41 nowych kluczy, 3 klucze reużyte 1:1
  (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 3×).
  Zweryfikowany brak zależności echo na `Warning[]` tego modułu z innych kalkulatorów przed
  migracją (lekcja z partii 9) — `dopasowanie-tablicy-falownika` importuje tylko czystą funkcję
  liczbową `obliczNapiecieStringuZimowego` z `stress-test-mppt` (nie odwrotnie, nie echo
  ostrzeżeń), a domniemana zależność `napiecie-systemowe` → `dopasowanie-tablicy-falownika`
  (Etap G) została usunięta z kodu 14.09.2026 — potwierdzone grepem, nie z komentarza.
  `konfigurator-stringow/warnings.ts`: `notPositive`/`notWholeNumber` przestały przyjmować
  polską etykietę pola jako parametr runtime (nietłumaczalny string wpisany na miejscu wywołania)
  — zamiast tego każde pole ma własny klucz słownika (np. `VMPV-NIEDODATNI`,
  `LICZBAPANELI-NIE-CALKOWITA`), z etykietą już przetłumaczoną w treści klucza, tak jak
  `Warning.code` (`field.toUpperCase()+"-NIEDODATNI"`) już to robił — `i18nKey` = `code`.
  8 stringowych `assumptions` (w tym jeden z interpolacją liczb) skonwertowanych na `{kod}`/`{kod,params}`.
  Wszystkie 5 stron UI już poprawnie korzystało z `WynikSzczegoly` — brak napraw stron.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 47 do 52.
  5 nowych bloków testowych domenowych (w tym poprawka istniejącej asercji na string assumption
  w `konfigurator-stringow`, która musiała się zmienić na `{kod}`) + nowy blok w `t.test.ts`
  (20 kluczy z parametrami/17 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
  (804/804)/`build` czyste. Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z
  potwierdzeniem braku rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki =
  15 sprawdzeń) — zero `⚠ [...]`.
  **Pozostało ~36 plików**: `pv/` (5 pozostałych: `panele-bifacjalne`, `straty-okablowanie-dc`,
  `straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`, plus `zacienienie-diody-bocznikujace`
  — czyli 6, nie 5, patrz uwaga niżej), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1).
  ⚠ Uwaga do partii 12: `stress-test-mppt` jest ECHOWANY przez `dopasowanie-tablicy-falownika`
  (funkcja czysta `obliczNapiecieStringuZimowego`, bez `Warning[]`) — bezpieczne wobec migracji,
  ale sprawdzić ponownie przy właściwej migracji `stress-test-mppt`, nie zakładać z góry.
- ✅ (2026-09-19) **Rollout i18n — dwunasta partia: kolejne 5 modułów `pv/`.** Zmigrowane:
  `panele-bifacjalne`, `straty-okablowanie-dc`, `straty-zlaczki-mc4`, `stress-test-mppt`,
  `wplyw-temperatury`. Zweryfikowane przed migracją (grepem): brak żadnego żywego importu
  `Warning[]` z `stress-test-mppt` spoza jego własnej strony — echo z `dopasowanie-tablicy-falownika`
  (partia 11) woła tylko czystą funkcję liczbową, potwierdzone ponownie, nie założone.
  38 nowych kluczy, 5 kluczy reużytych 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA` — 5×). 6 stringowych
  `assumptions` skonwertowanych na `{kod}`.
  🔴 **Znaleziony i naprawiony realny bug funkcjonalny (nie tylko i18n)** —
  `wplyw-temperatury/page.tsx`, ścieżka VALID (główny, sukcesowy wynik obliczenia) w ogóle nie
  przekazywała `warnings={result.warnings}` do `WynikSzczegoly` — jedyne ostrzeżenie tego
  kalkulatora (`utrataMocy`, poziom `info`, główna treść informacyjna ekranu: "Panel przy X°C
  traci Y% mocy...") było całkowicie niewidoczne dla użytkownika w normalnym, powodzeniowym
  przebiegu, nie tylko nieprzetłumaczone. Naprawione jednym dopisaniem propsa; zweryfikowane
  pełnym wydrukiem `innerText` przed i po (ostrzeżenie teraz widoczne). Pozostałe 4 strony tej
  partii już poprawnie korzystały z `WynikSzczegoly`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 52 do 57.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (10 kluczy z parametrami/6
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (811/811)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **Pozostał 1 plik w `pv/`:** `zacienienie-diody-bocznikujace` — partia 13 połączy go z
  początkiem kolejnego katalogu (`zapotrzebowanie/`, ~8 plików) albo zamknie samodzielnie,
  zależnie od rozmiaru po odczytaniu.
  **Pozostało ~31 plików** poza `pv/`: `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1), plus 1 z `pv/` wyżej.
- ✅ (2026-09-19) **Rollout i18n — trzynasta partia: zamyka katalog `pv/` + pierwsze 4 moduły
  `zapotrzebowanie/`.** Zmigrowane: `zacienienie-diody-bocznikujace` (pv/, ostatni plik),
  `agregat-pradotworczy`, `bojler-cwu`, `bufor-rozbudowe`, `load-shedding` (zapotrzebowanie/).
  Zweryfikowane grepem przed startem: brak echo-zależności `Warning[]` dla żadnego z 5 modułów.
  30 nowych kluczy, 2 klucze reużyte 1:1 (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, `SOC-POZA-ZAKRESEM` —
  ten drugi znaleziony byte-identycznie w istniejącym słowniku po weryfikacji treści, nie tylko
  nazwy). Jedna bliska kolizja rozstrzygnięta przez porównanie treści: `bufor-rozbudowe`'s
  `notPositive` miał tekst różny od istniejącego `ZAPOTRZEBOWANIE-NIEDODATNIE` — dostał odrębny
  klucz `ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE`.
  Drugi przypadek "etykieta pola jako nietłumaczalny parametr runtime" (pierwszy: partia 11,
  `konfigurator-stringow`) — `agregat-pradotworczy`'s `notPositive(field, label, value)` miał
  ten sam problem, naprawiony tym samym wzorcem (`i18nKey` = `code`, etykieta wpisana per pole w
  słowniku, parametr `label` usunięty z sygnatury).
  2 warunkowe funkcje ostrzeżeń (`buforInfo`, `odbiornikAktywny`) zwracały różny TEKST zależnie
  od warunku (nie tylko różne parametry tego samego szablonu) — rozbite na 2 odrębne klucze
  każda (`BUFOR-BRAK`/`BUFOR-DOLICZONY`, `ODBIORNIK-AKTYWNY-PRIORYTET-1`/`ODBIORNIK-AKTYWNY`),
  wybór klucza przeniesiony do logiki `warnings.ts`.
  🔴 **3 kolejne strony UI naprawione (ten sam wzorzec manualnego `{w.message}` bez fallbacku,
  czwarty-szósty przypadek w tej rundzie)**: `agregat-pradotworczy` (podwójny bug — manualny
  render ORAZ brak `warnings` w sąsiednim `WynikSzczegoly`, jak `cold-cranking-amps`/
  `dobor-przekroju-kabla`), `bufor-rozbudowe` i `load-shedding` (obie strony nie importowały
  nawet `WynikSzczegoly` — czysto manualny render bez żadnego fallbacku i18n). Wszystkie 3
  naprawione tym samym wzorcem (usunięcie manualnego `.map`, import + wywołanie
  `WynikSzczegoly` z `warnings`/`assumptions`). Zweryfikowane pełnym wydrukiem `innerText` dla
  wszystkich trzech — treść ostrzeżeń teraz widoczna i poprawnie przetłumaczona.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 57 do 62.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (9 kluczy z parametrami/18
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (818/818)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, z potwierdzeniem braku
  rezydualnego `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) —
  zero `⚠ [...]`.
  **To zamyka cały katalog `pv/`** (12 modułów zmigrowanych w partiach 11-13, plus
  `czystosc-i-snieg` świadomie odłożony).
  **Pozostało ~27 plików**: `zapotrzebowanie/` (4 pozostałe: `pobor-wlasny-falownika`,
  `profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`), `ogrzewanie/` (~6),
  `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1). Zweryfikować dokładną listę grepem na
  starcie partii 14, nie z tej metryczki.

- ✅ (2026-09-19) **Rollout i18n — czternasta partia: zamyka katalog `zapotrzebowanie/`.**
  Zmigrowane: `pobor-wlasny-falownika`, `profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`
  (ostatnie 4 pliki katalogu). 19 nowych kluczy (przeliczone programistycznie, nie 22 jak
  wstępnie liczone), zero kolizji.
  Czwarty przypadek "etykieta pola jako nietłumaczalny parametr runtime" — `przetwornice-dcdc`'s
  `notPositive`, naprawiony tym samym wzorcem. Drugi przypadek "różny tekst zależnie od warunku,
  nie tylko różne parametry" — `profil-astronomiczny`'s `nocPolarnaLubDzienPolarny`, rozbite na
  `NOC-POLARNA`/`DZIEN-POLARNY`.
  🔴 **Dryf znaleziony w module z wcześniejszej, już zamkniętej partii** (`baterie/pobor-wlasny-bms`,
  nie część listy plików tej partii) — ten sam anty-wzorzec "etykieta jako parametr" w kluczu
  `POBOR-UJEMNY`, naprawiony od razu zgodnie z wyjątkiem CLAUDE.md dla dryfu bez świadomej decyzji
  (nie zgłaszany jako konflikt — to błąd, nie decyzja do zatwierdzenia).
  🔴 **4 kolejne strony UI naprawione (siódmy-dziesiąty przypadek w tej rundzie)**:
  `pobor-wlasny-falownika`/`sezonowosc` (czysto manualny render, brak importu `WynikSzczegoly`),
  `profil-astronomiczny`/`przetwornice-dcdc` (podwójny bug — manualny render ORAZ brak `warnings`
  w sąsiednim `WynikSzczegoly`, jak `agregat-pradotworczy` p.13). Wszystkie 4 naprawione tym samym
  wzorcem, zweryfikowane pełnym wydrukiem `innerText` przed/po dla obu stron z podwójnym bugiem.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 62 do 66.
  4 nowe bloki testowe domenowe + nowy blok w `t.test.ts` (4 klucze z parametrami/15 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (833/833)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (4 moduły × 3 języki = 12 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka cały katalog `zapotrzebowanie/`** (8 modułów zmigrowanych w partiach 13-14).
  🔴 **Korekta szacunku pozostałych plików — poprzednie "~27" nie uwzględniało katalogu
  `montaz-baterii/` w ogóle.** Programistyczna weryfikacja (`find` + grep `message:` w każdym
  pozostałym `warnings.ts`) ujawniła realny pozostały zakres: **21 modułów** — `ogrzewanie/` (6,
  zgodne z szacunkiem), `montaz-baterii/` (12, **nowo odkryty katalog**), `bezpieczenstwo/` (2,
  zgodne), `kalkulator-mobilny/` (1, zgodne). Świadomie odłożone bez zmian: `pv/czystosc-i-snieg`,
  `baterie/komunikacja-bms`, `baterie/porownanie-technologii` (dane katalogowe). Do potwierdzenia
  na starcie partii 15: status `baterie/napiecie-systemowe` (7× `message:` — możliwe, że już
  objęty inną decyzją z wcześniejszej sesji, nie zakładać z góry). Pełne uzasadnienie i lista
  modułów: `docs/memory.md`, wpis "czternasta partia". Kolejna partia (15.): start `ogrzewanie/`.

- ✅ (2026-09-19) **Rollout i18n — piętnasta partia: zamyka cały katalog `ogrzewanie/` (6
  modułów, jedna partia).** Zmigrowane: `bufor-ciepla`, `infiltracja-powietrza`,
  `kociol-elektryczny`, `pompy-cyrkulacyjne`, `ryzyko-niskiego-napiecia`,
  `wentylacja-odzysk-ciepla`. 21 nowych kluczy, 2 reużyte po weryfikacji treści
  (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, `COP-POZA-ZAKRESEM`).
  **Pierwsza partia w całej rundzie bez żadnego znalezionego bugu UI** — wszystkie 6 stron już
  poprawnie przekazywały `warnings` do `WynikSzczegoly` na obu ścieżkach. Zero nowych wystąpień
  anty-wzorca "etykieta jako parametr" i wzorca "różny tekst zależnie od warunku" — obie funkcje
  generyczne (`wartoscUjemna`) i warunkowe (`buforZaMaly`/`buforWystarczajacy` itp.) już były
  napisane poprawnie od początku. Jedna bliska kolizja: `SPRAWNOSC-POZA-ZAKRESEM` (istniejący,
  zakres ułamkowy) vs tekst procentowy `wentylacja-odzysk-ciepla` → nowy klucz
  `SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM`. Naprawiony jeden inline literał `Warning` w
  `pompy-cyrkulacyjne/validation.ts` (poza `warnings.ts`).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 66 do 72.
  6 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (10 kluczy z parametrami/11
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (857/857)/`build` czyste — testy
  przeszły od razu, bez korekty wartości po pierwszym biegu.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (6 modułów × 3 języki = 18 sprawdzeń) — zero `⚠ [...]`.
  **Pozostały zakres z realnym tekstem do migracji**: `montaz-baterii/` (12 modułów, nowo odkryty
  w partii 14), `bezpieczenstwo/` (2), `kalkulator-mobilny/` (1) = **15 modułów**. Pełne
  uzasadnienie: `docs/memory.md`, wpis "piętnasta partia". Kolejna partia (16.): start
  `montaz-baterii/` (zweryfikować grepem, czy lista 12 modułów z partii 14 jest wciąż aktualna).

- ✅ (2026-09-19) **Rollout i18n — szesnasta partia: start katalogu `montaz-baterii/`.**
  🔴 Korekta: ponowne przeliczenie grepem pokazało **11 modułów** z realnym tekstem, nie 12 —
  drobny błąd liczenia w partii 14 (moduł `ocena-zuzycia` przeoczony przy ręcznym przepisywaniu
  listy), skorygowany programistycznie.
  Zmigrowane (pierwsze 5 z 11): `balansery-zewnetrzne-olow`, `demontaz-pakietu`,
  `gestosc-elektrolitu`, `montaz-mechaniczny`, `ocena-zasiarczenia`. 12 nowych kluczy, zero
  kolizji.
  Echo-zależności zweryfikowane: `montaz-mechaniczny` faktycznie echuje `Warning[]` z
  `baterie/pozycjonowanie-ogniw` (`dociskZaDuzy`/`dociskZaMaly`) — potwierdzone już zmigrowany,
  bezpieczne.
  **Nowy podtyp wzorca "różny tekst zależnie od warunku": zgodność liczby/rodzaju
  (singular/plural)** — `ocena-zasiarczenia`'s ternary `objaw`/`objawy` wewnątrz szablonu (nie
  dwie różne sytuacje domenowe, tylko odmiana gramatyczna). Rozwiązanie: dwa klucze
  (`OBJAWY-ZASIARCZENIA-JEDEN`/`OBJAWY-ZASIARCZENIA-WIELE`), wybór w `warnings.ts`. Świadome
  ograniczenie: nie skaluje się do pełnej polskiej odmiany 1/2-4/5+ (katalog ma tylko 4 pozycje,
  nigdy nie sięga trzeciego wariantu) — nie zakładać z góry w kolejnych partiach.
  🔴 **2 kolejne strony UI naprawione** (jedenasty-dwunasty przypadek w rundzie): `demontaz-
  pakietu` (manualny render na ścieżce głównej, mimo że `WynikSzczegoly` był już importowany dla
  ścieżki błędu) i `ocena-zasiarczenia` (brak importu `WynikSzczegoly` wcale). Zweryfikowane
  pełnym wydrukiem `innerText`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 72 do 77.
  5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (6 kluczy z parametrami/6 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (872/872)/`build` czyste — testy przeszły od
  razu.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (5 modułów × 3 języki = 15 sprawdzeń) — zero `⚠ [...]`.
  **Pozostało w `montaz-baterii/`: 6 modułów** — `pierwsze-uruchomienie`, `podlaczenie-bms`,
  `ratowanie-ogniwa`, `sekwencja-montazu`, `weryfikacja-ogniw`, `ocena-zuzycia`. Pełne
  uzasadnienie: `docs/memory.md`, wpis "szesnasta partia". Kolejna partia (17.): dokończenie
  `montaz-baterii/` (zamknie cały katalog).

- ✅ (2026-09-19) **Rollout i18n — siedemnasta partia: zamyka cały katalog `montaz-baterii/`
  (6 modułów).** Zmigrowane: `pierwsze-uruchomienie`, `podlaczenie-bms`, `ratowanie-ogniwa`,
  `sekwencja-montazu`, `weryfikacja-ogniw`, `ocena-zuzycia`. 18 nowych kluczy, 3 reużyte po
  weryfikacji treści.
  Piąty przypadek anty-wzorca "etykieta jako parametr" (`podlaczenie-bms`), naprawiony tym samym
  wzorcem.
  **Kolizja `code` między dwoma modułami** (`pierwsze-uruchomienie`/`ratowanie-ogniwa`, oba
  `NAPIECIE-OGNIWA-UJEMNE`, różny tekst) wykryta rutynową kontrolą i rozstrzygnięta odrębnymi
  `i18nKey` bez utraty informacji.
  Skonwertowane stringowe `assumptions` w `sekwencja-montazu` na `{kod, params}` — złapało 2
  przedistniejące asercje testowe (`toContain` na starym stringu), naprawione, drugi bieg
  testów czysty.
  🔴 **2 kolejne strony UI naprawione** (trzynasty-czternasty przypadek w rundzie):
  `podlaczenie-bms` (manualny render na głównej ścieżce mimo `WynikSzczegoly` używanego gdzie
  indziej na tej samej stronie) i `ocena-zuzycia` (brak importu wcale). Zweryfikowane pełnym
  wydrukiem `innerText`.
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 77 do 83.
  6 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (11 kluczy z parametrami/7
  bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (894/894)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (6 modułów × 3 języki = 18 sprawdzeń) — zero `⚠ [...]`.
  **Pozostały zakres z realnym tekstem do migracji**: `bezpieczenstwo/` (2), `kalkulator-
  mobilny/` (1) = **3 moduły**. Pełne uzasadnienie: `docs/memory.md`, wpis "siedemnasta
  partia". Kolejna partia (18.): `bezpieczenstwo/` + `kalkulator-mobilny/` razem.

- ✅ (2026-09-19) **Rollout i18n — osiemnasta partia: zamyka `bezpieczenstwo/` +
  `kalkulator-mobilny/` (3 moduły).** Zmigrowane: `dogrzewanie-paliwem-stalym`, `ups-krytyczny`,
  `tryb-uproszczony`. 12 nowych kluczy, 2 reużyte po weryfikacji treści (w tym `SPRAWNOSC-
  DOMYSLNA` — reużycie między dwoma różnymi katalogami, `kalkulatory-pomocnicze`/`ups-
  krytyczny`).
  Szósty przypadek anty-wzorca "etykieta jako parametr" (`tryb-uproszczony`), naprawiony tym
  samym wzorcem.
  Konwersja 2 stringowych `assumptions` na `{kod, params}` złapała kolejną przedistniejącą
  asercję testową (`ups-krytyczny`), naprawiona proaktywnie przed pierwszym biegiem testów.
  **Zero bugów UI** (trzecia taka partia w rundzie) — wszystkie strony już poprawnie
  obsługiwały i18n (w tym `tryb-uproszczony`, zweryfikowane wprost treścią PL/EN).
  `scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES` rozszerzone z 83 do 86.
  3 nowe bloki testowe domenowe + nowy blok w `t.test.ts` (3 klucze z parametrami/9 bez).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (905/905)/`build` czyste.
  Zweryfikowane end-to-end w świeżej przeglądarce (Playwright, potwierdzenie braku rezydualnego
  `next-server` przed i po) w PL/EN/RU (3 moduły × 3 języki = 9 sprawdzeń) — zero `⚠ [...]`.
  **To zamyka oba katalogi `bezpieczenstwo/` i `kalkulator-mobilny/`.**
  🔴 **Pozostały zakres potwierdzony grepem**: `baterie/napiecie-systemowe` — 1 moduł, 7×
  `message:`, duży wieloetapowy kalkulator, NIE w `MIGRATED_MODULES`. Po nim: `pv/czystosc-i-
  snieg`, `baterie/komunikacja-bms`, `baterie/porownanie-technologii` (świadomie odłożone, dane
  katalogowe). Pełne uzasadnienie: `docs/memory.md`, wpis "osiemnasta partia". Kolejna partia
  (19.): `baterie/napiecie-systemowe` (własna partia — zacząć od pełnego odczytania plików i
  ponownego przelecenia CAŁEGO `lib/core/modules/` grepem, nie ufać samej metryczce).
- ✅ (2026-09-19) **Sześć otwartych pytań (zebranych z tego pliku i `docs/memory.md`)
  rozstrzygnięte przez właściciela projektu jedną odpowiedzią.** Pełna treść pytań/opcji i
  decyzji: `docs/memory.md`, sekcja "Sześć otwartych pytań...". Status per pytanie:
  1. i18n danych katalogowych (wpis 2026-09-15/19 wyżej) → **nowy, odrębny wątek** — nie
     realizowane teraz.
  2. Integracja Ekran 1↔6 M4 (wpis 2026-09-04 wyżej) → **pełny profil "Mój sprzęt"** —
     ✅ zrealizowane (`lib/profil-sprzetu/`), zakres świadomie zawężony do baterii — szczegóły
     `docs/memory.md`.
  3. Logo/ikony PWA (wpis 2026-09-16 wyżej) → **własne logo teraz** — ✅ zrealizowane, koncepcja D
     "Monogram OG" wybrana i wdrożona (`public/icon.svg` + rasteryzacje). Szczegóły:
     `docs/memory.md`.
  4. Edytor kolorów (`docs/memory.md`, 2026-08-30) → **pełny edytor palety** — ✅ **już istnieje,
     nic do zrobienia.** Znaleziony dryf dokumentacji: pytanie było nieaktualne od 2026-08-30,
     edytor zbudowany tego samego dnia (`components/kolor-grupa-edytor.tsx`, wpięty w
     `/ustawienia` i `/wzornik`), tylko wpis w `docs/memory.md` nigdy nie oznaczony jako
     zamknięty. Skorygowane, nie usunięte — szczegóły: `docs/memory.md`.
  5. Logowanie/Supabase (wpis 2026-09-15 wyżej) → właściciel podłącza klucze w niedzielę po
     20:00 — bez zmian teraz.
  6. Model freemium (rozdz. 12) → decyzja biznesowa w niedzielę — bez zmian teraz.
- ✅ (2026-09-19) **Punkt 7a z prośby "5,6,7,8,9 proszę zrób"** — cztery luki z
  `docs/rejestr-pokrycia.md` oznaczone jako "gotowe do budowy" (audyt GOD BOOK Część N,
  05.09.2026): 2.15 (Ryzyko PID, Moduł 3), 8.8 (Dobór regulatora PWM vs MPPT, Moduł 12) —
  zbudowane jako kalkulatory. 5.46 (ryzyko zamarznięcia dolnego źródła) i 5.31 (hałas i
  wibracje), oba Moduł 6 — **korekta oceny źródła przy realizacji**: brak computable wzoru,
  zbudowane jako Wzorzec C (treść informacyjna). Szczegóły i wyjaśnienie rozbieżności:
  `docs/memory.md`.
- ✅ (2026-09-19) **Punkt 7b z tej samej prośby — Wind Chill (Moduł 7).** Wzór NWS/Environment
  Canada (2001), zweryfikowany niezależnie w Node. Zamyka punkt 7 w zakresie realizowalnym bez
  wymyślania fizyki — pozostały klaster stress-test zimowy jest w większości architektonicznie
  zależny od jeszcze niezbudowanych modułów, nie kolejnymi "gotowymi do budowy" lukami.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-19) **Punkt 5 z tej samej prośby — kontynuacja Modułu 2, Ekrany 3/10/14/15.**
  Ostatnie cztery pozostałe `todo` z numerowanej sekwencji Modułu 2. Ekran 3 wprowadza nowy
  wariant wzorca "echo" (reużycie samych mocy urządzeń z katalogu innego modułu, bez czasu
  pracy — inny sens semantyczny). Ekran 10 ma udokumentowaną niespójność przykładu źródła
  (75%→+25% jest matematycznie błędne). Ekran 14 świadomie bez automatycznego werdyktu —
  źródło nie podaje liczbowego progu asymetrii faz. Ekran 15 bez domyślnych mocy urządzeń —
  źródło podaje tylko nazwy. **Świadomie odłożony:** moduł zbiorczy "Wampiry energetyczne"
  (24 dawne funkcje, 5 podzakładek) — osobny, znacznie większy krok, wymaga własnej sesji.
  Szczegóły: `docs/memory.md`.
- ✅ (2026-09-20) **Punkt 8 z tej samej prośby — rollout `usePersistedDraft` na wszystkie
  pozostałe 114 ekranów kalkulatorów** (wcześniej autosave miał tylko `napiecie-systemowe`).
  Mechaniczna transformacja `useState` → jeden Seed obiekt + `usePersistedDraft`, bez zmiany
  logiki domenowej — zachowane nazwy/sygnatury `setX`. Pierwsze podejście (8 równoległych
  agentów w tle) padło na limit sesji API w połowie pracy — dokończone bezpośrednio, bez
  kolejnych subagentów. Zweryfikowane: 115/115 unikalnych kluczy, `pnpm typecheck`/`lint`/`test`
  (965/965)/`build` czyste, Playwright na próbce 5 ekranów potwierdza przetrwanie danych po
  przeładowaniu strony. Szczegóły i lekcja o limicie równoległych agentów: `docs/memory.md`.
- ✅ (2026-09-20) **Punkt 6, ostatni z prośby "5,6,7,8,9 proszę zrób" — kafle 08–14 wdrożone
  po akceptacji.** Artefakt "Off-Grid Tile Set 08–14" zaakceptowany bez uwag per-kafel, wdrożony
  1:1 (nazwy klas/gradientów dostosowane do konwencji `ki-`/`tile-*-symbol` repo). Znaleziska
  przy weryfikacji (nie błędy): kafel 14 "Ustawienia" nie ma slotu w gridzie pulpitu (tylko mały
  link tekstowy w nagłówku, konsekwentnie emoji jak sąsiednie skróty) — ikona zarejestrowana,
  czeka na naturalne miejsce; kafle 09/11 mają już maskotkę "Bob" z wyższym priorytetem niż SVG
  (pre-istniejące zachowanie, dotyczy też kafli 3/6/7). Zweryfikowane: typecheck/lint/build
  czyste, Playwright + zrzut ekranu pulpitu potwierdzają poprawny render 4 z 7 nowych ikon w
  gridzie. **To zamyka całą prośbę "5,6,7,8,9 proszę zrób".** Szczegóły: `docs/memory.md`.
- ✅ (2026-09-20) **Migracja i18n na client-side bundled (offline-first, `docs/standards/17-i18n.md`
  17.4)** — osobny branch/PR (`claude/i18n-offline-first`), na wyraźną prośbę właściciela projektu
  po pełnym audycie (znalezisko: mechanizm cookie+middleware łamał offline-first). Preferencja
  języka przeniesiona z cookie na `localStorage` (`lib/i18n/storage.ts`, wzorzec
  `useSyncExternalStore` jak `lib/theme/storage.ts`) + `navigator.languages` na pierwszą wizytę;
  `<html lang>` korygowany blokującym skryptem pre-paint (jak dla motywu). Jedyny Server Component
  renderujący tłumaczenia wprost (`prognozy/page.tsx`) wydzielony do Client Component. **Znana,
  jawnie ujawniona luka:** widoczna treść UI (nie sam atrybut) może się skorygować po hydratacji
  przy twardym przeładowaniu z językiem ≠ polski — pełne wyeliminowanie wymaga architektury
  CSS-multi-language-DOM (~130 ekranów), poza zakresem tego kroku, czeka na decyzję właściciela.
  Zweryfikowane: typecheck/lint/i18n-guard/test(965/965)/build czyste, Playwright (4 scenariusze:
  świeże wejście, przełączenie, twarde przeładowanie z zapisaną preferencją, ekran Prognozy) —
  zero nowych błędów konsoli. Szczegóły: `docs/memory.md`.
