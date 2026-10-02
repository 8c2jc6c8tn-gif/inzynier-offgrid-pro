# Archiwum docs/memory.md — 05-blad-procesowy-edycja-standardu-16-09

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 4002–4580 stanu sprzed archiwizacji | **Liczba sekcji:** 1
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Błąd procesowy: bezpośrednia edycja `new-app-standards` z tej sesji (16.09.2026)

Po prośbie właściciela o promocję CI referencyjnego/guardu i18n jako przykładu dla innych apek —
zamiast ograniczyć się do kanału ustalonego w `docs/wklad-do-standardu.md` (zgłoszenie w tym
pliku, konsolidacja wyłącznie w osobnej sesji nad `new-app-standards`), ta sesja dołączyła repo
`new-app-standards` do siebie i **bezpośrednio** dodała tam pliki (`docs/przyklady/ci/`,
`docs/przyklady/i18n/`, podsekcje 11.6/17.11) na osobnym branchu + otworzyła PR #9. **Błędne
rozumowanie:** "sesja nad `new-app-standards`" (Część Y.8 GOD BOOK) odczytane jako "ta sesja, bo
ma repo dołączone", nie jako "osobna, dedykowana sesja". Właściciel repo poprawił wprost — to
nie jest sposób, w jaki ten mechanizm ma działać, niezależnie od technicznej możliwości dołączenia
repo.

**Naprawione:** PR #9 zamknięty bez mergowania (żadna treść nie trafiła na `main` tamtego repo,
zero wpływu na inne projekty rodziny), branch pozostaje bez referencji (usunięcie zdalne odmówione
przez proxy sesji, HTTP 403 — niekrytyczne, martwy branch bez PR nie ma żadnego mechanizmu wejścia
do `main`). `docs/wklad-do-standardu.md` skorygowany — status wrócił do `🔎 nowe`, zgłoszenie
czeka na właściwy kanał.

**Lekcja procesowa:** techniczna możliwość dołączenia repo (`add_repo`) nie jest tym samym co
autoryzacja do promocji treści do niego. "Sesja nad `new-app-standards`" w sensie Y.8 znaczy
osobna, celowo otwarta sesja poświęcona konsolidacji wkładu — nie dowolną sesję, która akurat ma
to repo w zasięgu z innego powodu. Dla tego projektu jedyny legalny wyjście stąd jest zawsze plik
`docs/wklad-do-standardu.md`, bez wyjątków, niezależnie od tego, co technicznie jest możliwe.

- **2026-09-16 — Audyt pełny ("Audyt pełny", na żądanie właściciela projektu) — dwie realne
  niezgodności znalezione i naprawione.** Sprawdzone programistycznie (grep + odczyt kodu +
  realne odpalenie `pnpm test`/`typecheck`/`lint`, nie z metryczek dokumentów), przekrojowo przez
  wszystkie 19 rozdziałów standardu (00–18), z naciskiem na rozdziały architektoniczne/procesowe —
  pełny przegląd 117 stron kalkulatorów ekran-po-ekran uznany za nieproporcjonalny do budżetu
  jednego przejścia (każdy moduł miał już własną weryfikację przy budowie).

  **Zgodne (zweryfikowane, nie tylko zadeklarowane):** 01 (0 importów `app/`/`components/` w
  `lib/core/`), 07 (CSP z hashem skryptu, pełny zestaw nagłówków, `connect-src` warunkowy na
  Supabase), 11 (CI zielony), 660/660 testów przed poprawką.

  **Niezgodność #1 (rozdz. 10, Testy/DoD) — 6 modułów bez żadnych testów.**
  `lib/core/modules/montaz-baterii/{weryfikacja-wstepna-olow, bezpieczenstwo-kwas,
  uruchomienie-testy-olow, polaczenia-czyszczenie-olow, montaz-mechaniczny-olow, demontaz-olow}`
  (Ścieżka B, Moduł 11) miały realną logikę domenową (`calculator.ts`, checklist →
  VALID/INCOMPLETE, `demontaz-olow` dodatkowo z wymuszoną kolejnością i ostrzeżeniem
  `KROK-POZA-KOLEJNOSCIA`), ale zero plików `__tests__` — nieodnotowane w `dlug-techniczny.md` ani
  gdzie indziej jako świadome odłożenie. **Naprawione:** dopisano 6 plików testowych (25 testów),
  wzorowanych na już istniejącym `przygotowanie-stanowiska`/`demontaz-pakietu` (ten sam wzorzec
  checklisty). `pnpm test` po poprawce: 685/685 (było 660/660), `tsc --noEmit`/`lint` czyste.

  **Niezgodność #2 (rozdz. 14, Proces i pamięć) — `docs/lista-do-zrobienia.md` z dziurą
  09-05→09-14.** W tym oknie zbudowano 14 ekranów Modułu 5/okablowanie + M5/Ekran 1 (norma
  PN-HD 60364-5-52) + przebudowę `napiecie-systemowe` v2 + odblokowanie B5/M11 i M4/E25 —
  poprawnie odnotowane na bieżąco w `docs/rejestr-pokrycia.md` i tu, w `docs/memory.md`, ale nie
  przeniesione do `docs/lista-do-zrobienia.md`, wbrew jego własnej deklarowanej zasadzie
  "aktualizowane na bieżąco". Nic w kodzie nie wymagało korekty — tylko log. **Naprawione:** jeden
  zbiorczy wpis retroaktywny dopisany do `docs/lista-do-zrobienia.md`, jawnie oznaczony jako
  retroaktywny (nie cichy dopisek udający wpis "na żywo" z tamtej daty), z odsyłaczem do
  `docs/rejestr-pokrycia.md` po szczegóły per ekran.

  **Bez zmian (już znane, nie odkryte na nowo):** rozdz. 09 (kontrakt AI) i 12 (freemium) — nie
  zaimplementowane, z listy "4 niezgodności" z 15.09.2026; rozdz. 18 (logowanie) — szkielet gotowy,
  czeka na akcję właściciela; rozdz. 17 (i18n) — guard działa, rollout moduł po module w toku.

- **2026-09-16 — Decyzja procesowa: koniec czekania na dostęp do repo innych projektów rodziny
  (`zero-waste`) dla zgłoszeń niedokończonych w `docs/propozycje-do-new-app-standards/`.**
  Polecenie właściciela projektu wprost: "Nie musisz grzebać w innych repo projektów, żeby coś
  wyjaśniać... jak czegoś ci brakuje czy nie wiesz czegoś, piszesz w wkład do standardu i tam
  decydują co i jak." Dotyczy dwóch plików oznaczonych dotąd jako "celowo niedokończone, czekają na
  zero-waste": `wielojezycznosc.md` (rozstrzygnięty tą samą sesją, patrz niżej) i
  `logowanie-i-konta.md` (wciąż otwarty — nie było dziś nowej pracy nad logowaniem, status bez
  zmian, ale ta sama zasada obowiązuje: nie czekać na `zero-waste`, tylko zgłosić co wiadomo z
  własnego kodu/decyzji właściciela, gdy będzie następna sesja nad tym tematem). Nie zmienia
  fundamentalnej zasady 15.17 (nigdy nie edytuj `new-app-standards` bezpośrednio) — zmienia tylko
  to, że brak dostępu do TRZECIEGO repo (nie `new-app-standards`, nie tego projektu) przestaje być
  powodem, żeby trzymać zgłoszenie w stanie szkicu.

- **2026-09-16 — Wielojęzyczność: przełącznik języka w Ustawieniach + dodane EN i RU.** Polecenie
  właściciela projektu wprost ("zrób w ustawieniach możliwość wyboru języka... dodaj nowe języki
  angielski i rosyjski"), połączone z decyzją procesową wyżej (nie czekać na `zero-waste`).

  **Zakres — dodaje infrastrukturę wielojęzyczności, NIE migruje więcej modułów.** Stan przed tą
  pracą: 1/116 modułów ma klucze tłumaczeń (`kalkulatory-pomocnicze`), słownik tylko polski, zero
  przełącznika UI. Ten wpis dodaje: drugi i trzeci język do istniejącego mechanizmu, przełącznik w
  Ustawieniach, i infrastrukturę SSR-bezpiecznego przechowywania wyboru. **Nie dodaje** nowych
  zmigrowanych modułów — rollout z wpisu 2026-09-15 (~89 plików `warnings.ts`/~109 miejsc
  `assumptions` wciąż z gotowym tekstem PL) zostaje bez zmian, świadomie (17.9: moduł po module).

  **Decyzja architektoniczna — cookie, nie `localStorage`, mimo że `lib/theme/storage.ts` i
  `lib/wyglad/storage.ts` (ten sam rodzaj "drobnej preferencji UI") używają `localStorage` +
  inline-skrypt w `app/layout.tsx`.** To NIE jest niespójność/dryf do naprawienia — inny kształt
  problemu: theme/wyglad zmieniają tylko klasy CSS/zmienne, które inline-skrypt może ustawić
  synchronicznie PRZED pierwszym malowaniem (zero widocznego błysku nawet przy twardym
  przeładowaniu). Język zmienia TEKST already server-rendered w strumieniu HTML — nie da się tego
  „naprawić” skryptem przed malowaniem bez przepisania DOM-u (co i tak dałoby widoczny błysk).
  Dokładnie to jest powód korekty 17.4/17.4a zsynchronizowanej dziś wcześniej (v2.18): SSR + cookie,
  nie `localStorage`. Dwa różne mechanizmy dla dwóch różnych klas problemu, oba świadome — nie
  wymaga zgłoszenia do `docs/wklad-do-standardu.md` jako konflikt, bo to nie jest konflikt reguł,
  tylko różne wymagania techniczne dwóch typów danych (CSS vs tekst).

  **Architektura (`lib/i18n/`):**
  - `language.ts` — `Language = "pl" | "en" | "ru"`, `negocjujJezyk(Accept-Language)` (Edge-safe,
    bez zależności od `next/headers`/DOM — używany też w `middleware.ts`), `LANGUAGE_COOKIE`/
    `LANGUAGE_COOKIE_MAX_AGE_SECONDS` jako nazwane stałe (nie magiczne liczby/stringi powielone).
  - `dictionary-en.ts`/`dictionary-ru.ts` — `satisfies Record<KluczTlumaczenia, string>` (typ z
    `dictionary-pl.ts`) wymusza dokładny parytet kluczy z bazowym słownikiem — brakujący/dodatkowy
    klucz to błąd kompilacji, zweryfikowane testem (`__tests__/t.test.ts`, "parytet kluczy").
  - `t(language, kod, params?)` — sygnatura ZMIENIONA (był `t(kod, params?)`, niejawnie
    `dictionaryPl`). Język jako jawny parametr, nie moduł-globalna zmienna — SSR w Next.js dzieli
    proces serwera między równoległe żądania różnych userów, moduł-globalny "aktualny język" na
    serwerze przeciekałby między nimi.
  - `language-context.tsx` (Client) — `LanguageProvider`/`useLanguage()`/`useTranslate()` (hook
    wiążący `t` z językiem z kontekstu, dla wygody wywołania identycznej jak przed zmianą sygnatury
    w większości miejsc: `const t = useTranslate(); ...t(kod, params)`).
  - `server-language.ts` — `getServerLanguage()` (jedyne miejsce w warstwie i18n importujące
    `next/headers` — Client Components nie mogą tego bundlować).
  - `client-language.ts` — `ustawCookieJezyka()` jako **funkcja modułowa, nie zamknięcie wewnątrz
    komponentu**. Odkryte przy pierwszym podejściu (inline `document.cookie = ...` w `onClick`
    wewnątrz `JezykWybor`): React Compiler (`react-hooks/immutability` z eslintem tego projektu)
    odrzuca mutację obiektu spoza zasięgu komponentu (`document`) zdefiniowaną w ciele
    komponentu/hooka — ten sam wzorzec ograniczenia, któremu już podlegają `zapiszTryb`/
    `zastosujTryb` w `lib/theme/storage.ts` (funkcje modułowe, nie closures). Naprawione przez
    wydzielenie do osobnego pliku, zgodnie z już istniejącą konwencją repo.

  **Integracja:**
  - `middleware.ts` — `ustawJezykJesliBrak()` ustawia cookie z `Accept-Language` tylko gdy cookie
    jeszcze nie istnieje (nigdy nie nadpisuje świadomego wyboru usera), wywoływana na WSZYSTKICH
    ścieżkach zwrotu (early-return bez Supabase, redirect do loginu, normalny `next()`) — istniejąca
    logika auth (18.5) zostawiona bez zmian, tylko dodany krok przed każdym `return`.
  - `app/layout.tsx` — Server Component (był, teraz jawnie `async`), czyta `getServerLanguage()`,
    ustawia `<html lang={language}>` (**naprawiony przy okazji realny, niezwiązany błąd** — było na
    sztywno `lang="en"` mimo że cała treść jest po polsku; nikt tego świadomie nie zdecydował, więc
    naprawione od razu per zasada dryfu bez pytania) i owija `children` w `<LanguageProvider>`.
  - `components/wzorce/wynik-szczegoly.tsx` — komponent współdzielony przez **70 stron**
    kalkulatorów (odkryte przy typecheck: znacznie więcej niż sugerował własny komentarz pliku
    "7+ plików", drift metryczki niewart osobnego zgłoszenia, skorygowany w komentarzu). Dodano
    `"use client"` + `useTranslate()` — bezpieczne, bo wszyscy 70 importerów już są `"use client"`
    (zweryfikowane `grep` przed zmianą, nie zgadywane).
  - 8 stron z własnym, zduplikowanym renderowaniem `assumptions` (nie przez `WynikSzczegoly` —
    osobny, starszy wzorzec, nieruszany poza wymaganą zmianą sygnatury): 7 Client Components →
    `useTranslate()` hook; `app/kalkulatory/prognozy/page.tsx` jedyny Server Component z tej grupy
    → `getServerLanguage()` + `t(language, kod, params)` wprost (Server Components nie mogą używać
    Reactowego kontekstu).
  - `components/jezyk-wybor.tsx` — przełącznik w Ustawieniach (`app/ustawienia/page.tsx`, nowa
    sekcja "Język"), zapisuje cookie + `router.refresh()` (cookie jest źródłem prawdy, kontekst
    tylko go odzwierciedla — bez dualnego stanu klient/serwer, w odróżnieniu od wzorca
    `useSyncExternalStore` używanego przez theme/wyglad, bo tam localStorage JEST źródłem prawdy).

  **Zweryfikowano:** `tsc --noEmit`/`pnpm lint` czyste (0 błędów, te same 2 znane niezwiązane
  warningi `<img>`), `pnpm test` 699/699 (685 + 14 nowych: `language.test.ts`, `t.test.ts` — w tym
  parytet kluczy, negocjacja Accept-Language z realnymi nagłówkami, podstawianie `{params}`, widoczny
  fallback przy brakującym kluczu), `pnpm check:i18n-guard` OK (bez regresji), `pnpm build` czysty.
  **Playwright na realnym `pnpm dev`** (nie tylko typecheck): pierwsza wizyta bez cookie →
  `<html lang="en">` (Accept-Language kontenera to `en-US` — potwierdza działającą negocjację, nie
  błąd domyślnego PL); kliknięcie "English"/"Русский" w Ustawieniach → cookie ustawiona poprawnie
  (nie `HttpOnly`, `path=/`, ~365 dni), `<html lang>` zmienia się po `router.refresh()`, utrzymuje
  się po nawigacji na inną stronę; realny przetłumaczony tekst na ekranie `kalkulatory/pomocnicze`
  ("System efficiency assumed as 0.92 (default value, not measured)." zamiast polskiego), reszta
  treści strony (nagłówki, etykiety) nadal po polsku — zgodnie z oczekiwanym stanem przejściowym
  17.9, nie błąd. Zero błędów konsoli/strony w całym przebiegu.

  **Dokumentacja/promocja (zgodnie z decyzją procesową wyżej):**
  `docs/propozycje-do-new-app-standards/wielojezycznosc.md` przepisany ze statusu "SZKIELET, czeka
  na zero-waste" na "gotowa do konsolidacji" — sekcja C (6 pytań) zastąpiona rozstrzygnięciami z tej
  implementacji, poza C6 (treści bezpieczeństwa-krytyczne), które zostaje świadomie otwarte — ten
  projekt tego nie rozwiązał w praktyce, nie tylko nie zgłosił, więc nieuczciwe byłoby przedstawić
  to jako gotową odpowiedź. `docs/wklad-do-standardu.md`, wpis 14.09.2026 — dopisana aktualizacja
  statusu (nie nowy wpis — kontynuacja tego samego zgłoszenia), z odsyłaczem do rozstrzygniętego
  punktu B.3.

- **2026-09-16 (trzecia synchronizacja tego dnia) — sprawdzone `AKTUALIZACJE.md` na polecenie
  właściciela projektu ("Aktualizacja"), `git fetch`+`git pull` w lokalnym klonie
  `new-app-standards` (`741352e..c89abb7`, 7 nowych wpisów). GOD BOOK bez zmiany wersji (nadal
  v2.19).** Nadpisane w całości (NIETYKALNE): `docs/standards/00-INDEKS.md`, `08-ui-ux.md`,
  `10-testy.md`, `16-standard-kodowania.md`, `17-i18n.md`. Pominięte świadomie: `docs/god-book/
  memory.md`, `docs/lista-do-zrobienia.md`, `docs/projekty-downstream.md` w `new-app-standards` —
  to własne pliki procesowe tamtej sesji (log U.3/U.4, rejestr projektów downstream), nie
  szablony/standard do mirrorowania tutaj.

  **Miła niespodzianka: własne zgłoszenie z dzisiejszej wcześniejszej pracy zostało skonsolidowane.**
  Jeden z 7 wpisów cytuje wprost "pełną treść offgrid-pro `docs/propozycje-do-new-app-standards/
  wielojezycznosc.md`" jako źródło trzech nowych reguł (8.8 rozszerzona — styl tłumaczeń jak
  oryginał; **17.4 rozszerzona — rozstrzyga nazwane pytanie otwarte z naszej sekcji C.4**: przy
  aktywnych kontach język synchronizuje się przez konto jak inne ustawienia 18.6/18.9, bez kont
  zostaje per-urządzenie — dokładnie nasz dzisiejszy wybór, teraz potwierdzony jako reguła rodziny,
  nie lokalna decyzja; **nowa 17.7a — dosłownie nasza implementacja** `⚠ [klucz]` zamiast cichego
  fallbacku, teraz kanoniczna). Cykl zamknięty tego samego dnia: zgłoszenie → sesja nad
  `new-app-standards` → wraca jako reguła, zamiast czekać tygodniami (dokładnie powód skrócenia
  cyklu Y.6/U.4 do 3h, zsynchronizowanego wcześniej dziś).

  **Sprawdzone względem TEGO kodu (nie zgadywane), pozostałe 4 wpisy:**
  - **17.4a (next-intl, pułapka `[locale]`/`localePrefix`)** — nie dotyczy: ten projekt nie używa
    next-intl ani żadnej biblioteki i18n (świadoma decyzja, patrz wpis wcześniej dziś, sekcja C.2 w
    `wielojezycznosc.md`), brak segmentów `[locale]` w `app/`. Zero wpływu na kod.
  - **17.3 (region obliczeń/towarów jako osobne osie + wymóg ręcznej zmiany języka)** —
    `grep` potwierdza `lib/i18n/`/`components/jezyk-wybor.tsx` nie dotykają `lib/core/profiles/`
    (jedyny profil: `pl.ts`) — przełącznik języka jest już niezależny od profilu regionalnego,
    zgodnie z regułą. Wymóg "zmiana języka zawsze ręcznie dostępna" — spełniony (Ustawienia).
    Projekt nie ma dziś żadnego UI wyboru regionu obliczeń/towarów (tylko wewnętrzny profil `PL`
    bez przełącznika) — nic do naprawienia, zapamiętane na przyszłość: gdy taki przełącznik
    powstanie, **nigdy GPS/geolokalizacja** (rozstrzygnięcie z kolejnego wpisu, ten sam dzień).
  - **10.6/16.7/10.7 (z zero-waste — port-based e2e cleanup, wzorzec async-reset, zakaz etykiety
    "flaky" bez diagnozy)** — 10.6 nie dotyczy dziś (projekt nie ma infrastruktury e2e z lokalnym
    dev-serwerem, tylko ad-hoc Playwright w tej sesji, nie stały skrypt). **16.7 sprawdzone realnie:**
    jedyny kandydat w kodzie (`async`+`useState` w komponencie klienckim) to
    `app/auth/login/page.tsx` (`handleMagicLink`) — przeanalizowany linia po linii: `status`/`error`
    są własnością TEGO konkretnego wywołania (przycisk wyłączony na czas `sending`, `email` nigdy
    nie jest nadpisywany przez wynik async), nie ma przechwyconej "przed `await`" wartości
    nadpisywanej bezwarunkowo po powrocie — wzorzec z 16.7 NIE występuje, false negative
    wykluczony przez czytanie kodu, nie zgadywanie. 10.7 to reguła procesowa (nie etykietuj testu
    jako "flaky" bez diagnozy) — bez zastosowania dziś (brak testów e2e w ogóle).

- **2026-09-16 — Rozdział 18 (logowanie/konta): audyt na polecenie właściciela projektu
  ("Zajmij się logowaniem i kontami"), dwie realne luki znalezione i zamknięte BEZ realnych
  kluczy Supabase** (wciąż blokujących samo "żywe" logowanie — bez zmian, patrz wpis 15.09.2026
  wyżej, kroki 1-3 dla właściciela projektu niezmienione).

  **Metoda audytu:** przeczytany cały `docs/standards/18-logowanie.md` (18.1-18.15), każda reguła
  sprawdzona wprost względem kodu (nie z metryczki) — 18.1/18.2/18.4/18.9-18.13 potwierdzone zgodne
  bez zmian; 18.6/18.7/18.14/18.15 świadomie bez zastosowania dziś (brak modelu grupy/sync — projekt
  nie ma jeszcze żadnych danych do synchronizacji); 18.3 (scalanie tożsamości) świadomie NIE
  zbudowane — wymaga już zalogowanego usera do przetestowania flow, przedwczesne bez realnego konta,
  zostaje jako kolejny krok po odblokowaniu przez właściciela, nie dzisiejsze zadanie.

  **Znalezisko #1 (18.5) — `@supabase/ssr` domyślnie `httpOnly: false`, sprawdzone wprost w
  `node_modules`, nie zgadywane.** `DEFAULT_COOKIE_OPTIONS` biblioteki
  (`node_modules/@supabase/ssr/dist/main/utils/constants.js`): `{ path: "/", sameSite: "lax",
  httpOnly: false }`. Powód architektoniczny (potwierdzony w README pakietu): `createBrowserClient`
  musi zapisywać tę samą cookie z poziomu JS przeglądarki, co z definicji wymaga `httpOnly: false`
  (JS nie może ustawić `HttpOnly` — ograniczenie platformy). Projekt miał dokładnie jedno miejsce
  używające `createBrowserClient` (`components/konto-sekcja.tsx`, odczyt statusu logowania w
  Ustawieniach) — samo to jedno miejsce wystarczyłoby, żeby przy pierwszym odświeżeniu tokenu
  cicho złamać 18.5, niezależnie od tego, co ustawia serwer.

  **Naprawione:**
  - `lib/adapters/supabase/client.ts` (`createSupabaseBrowserClient`) **usunięty całkowicie** — to
    była jedyna funkcja w projekcie tworząca klienta Supabase w przeglądarce, zero innych miejsc do
    sprawdzenia (`grep` przed usunięciem, potwierdzone).
  - `lib/adapters/supabase/get-account-status.ts` (nowy, `"use server"`) — status logowania czytany
    server-side, `components/konto-sekcja.tsx` woła to zamiast klienta przeglądarkowego (ten sam
    kształt UX: `useEffect` + `useState`, tylko inne źródło danych).
  - `lib/adapters/supabase/config.ts`: nowa `sessionCookieOptions()` (`{ httpOnly: true, secure:
    NODE_ENV === "production", sameSite: "lax" }`) — nazwana funkcja, nie duplikat literałów w
    dwóch miejscach. Przekazana jako `cookieOptions` do `createServerClient` w `server.ts` i
    `middleware.ts` (jedyne dwa miejsca tworzące klienta server-side). Sprawdzone wprost w
    `node_modules/@supabase/ssr`, że `cookieOptions` przekazane przez wywołującego POPRAWNIE
    nadpisują `DEFAULT_COOKIE_OPTIONS` (`{...DEFAULT_COOKIE_OPTIONS, ...cookieOptions}` — kolejność
    spreadu, nie zgadywane z dokumentacji, przeczytane z kodu biblioteki).
  - Efekt: teraz, bez żadnego `createBrowserClient` gdziekolwiek w kodzie, jawne `httpOnly: true`
    faktycznie obowiązuje przez cały cykl życia sesji (logowanie, odświeżenie w middleware,
    wylogowanie) — 18.5 spełnione dosłownie, nie tylko deklaratywnie.
  - Zgłoszone do `docs/wklad-do-standardu.md` (BŁĄD): 18.4 (Supabase) i 18.5 (czyste HttpOnly)
    kolidują dla "oczywistego" wzorca użycia biblioteki (klient przeglądarkowy do odczytu stanu
    logowania) — żaden z dwóch punktów standardu dziś o tym nie ostrzega.

  **Znalezisko #2 (18.8) — usuwanie konta całkowicie nieobecne.** Migracja SQL miała już
  `ON DELETE CASCADE` przygotowane (`supabase/migrations/0001_profiles.sql`), ale nic w kodzie nie
  wywoływało usunięcia wiersza `auth.users` — funkcja wymagana przez standard (nie opcjonalny
  wzorzec jak 18.7/18.14) po prostu nie istniała.

  **Zbudowane (ten sam wzorzec bezpiecznej degradacji co reszta szkieletu — bez realnych kluczy
  kod istnieje i się kompiluje, ale funkcjonalnie zwraca czytelny błąd zamiast awarii):**
  - `.env.example` — nowa `SUPABASE_SERVICE_ROLE_KEY` (jawnie NIE `NEXT_PUBLIC_`, komentarz
    ostrzegający + skąd wziąć). `lib/adapters/supabase/config.ts`:
    `isServiceRoleConfigured()`/`supabaseServiceRoleKey()`, ten sam wzorzec co
    `isSupabaseConfigured()` (placeholder = "nie skonfigurowane").
  - `lib/adapters/supabase/admin.ts` (nowy) — `createSupabaseAdminClient()`, klucz service role,
    **`import "server-only"`** (nowa zależność, `pnpm add server-only` — oficjalny pakiet
    Next.js/Vercel, czysto build-time, zero runtime — błąd builda, gdyby ten plik trafił
    przypadkiem do bundla klienckiego; klucz service role nigdy nie może dotrzeć do przeglądarki,
    ryzyko zbyt poważne, żeby polegać wyłącznie na dyscyplinie importów).
  - `lib/adapters/supabase/delete-account.ts` (nowy, `"use server"`) — weryfikuje zalogowanego
    usera, sprawdza `isServiceRoleConfigured()` (czytelny błąd, nie awaria, gdy brak klucza),
    `admin.auth.admin.deleteUser(user.id)` → CASCADE usuwa profil automatycznie → `signOut()` →
    `redirect("/auth/login")`. Klauzula 18.8 "administrator grupy nie może się usunąć" —
    nieaplikowalna dziś (brak modelu grupy, 18.7 nie zbudowane), odnotowana w komentarzu, nie
    pominięta po cichu.
  - `components/konto-sekcja.tsx` — przycisk "Usuń konto" (`variant="destructive"`),
    `window.confirm()` przed wywołaniem (proporcjonalne do skali — bez realnych kluczy i tak
    zawsze kończy się komunikatem błędu), stan `usuwam`/`błąd` lokalny w komponencie.

  **Przy okazji (18.5, obrona w głąb przeciw CSRF) — `/auth/signout` z Route Handlera na Server
  Action.** Było: `app/auth/signout/route.ts`, zwykły `POST`, zero ochrony CSRF poza samym
  `SameSite=Lax` cookie (co 18.5 explicite nazywa niewystarczające — "obrona w głąb, nie
  zamiennik"). Teraz: `app/auth/signout/actions.ts` (`"use server"`) — Next.js weryfikuje nagłówek
  Origin/Host przy każdym wywołaniu Server Action, mechanizm wbudowany w framework. **Nie jest to
  dosłownie "token CSRF" (synchronizer/double-submit) z litery 18.5** — zgłoszone do
  `docs/wklad-do-standardu.md` (POMYSŁ NA REGUŁĘ) jako otwarte pytanie, nie rozstrzygnięte
  samodzielnie: czy ochrona Origin/Host Next.js Server Actions spełnia wymóg 18.5, czy potrzebny
  jest dodatkowo prawdziwy token nawet na Server Actions. Server Action to i tak poprawa względem
  stanu wyjściowego (zero ochrony → ochrona frameworkowa) niezależnie od odpowiedzi.

  **Zweryfikowano:** `tsc --noEmit`/`pnpm lint` czyste (`.next/` wyczyszczone najpierw — stary
  wygenerowany `validator.ts` referencjonował usunięty `route.ts`, fałszywy błąd typów niezwiązany
  z kodem źródłowym, zniknął po `rm -rf .next`). `pnpm test` 709/709 (699 + 10 nowych,
  `lib/adapters/supabase/__tests__/config.test.ts`: `isSupabaseConfigured`/
  `isServiceRoleConfigured` z placeholderem i realną wartością, `sessionCookieOptions` — httpOnly
  zawsze true, sameSite=lax, secure zależny od `NODE_ENV`). `pnpm build` czysty. `pnpm start`+`curl`
  na `/kalkulatory/pomocnicze` i `/ustawienia` — oba 200, zero błędów w logu serwera, identyczne
  zachowanie jak przed zmianą (bez realnych kluczy `KontoSekcja` nadal zwraca `null` przed
  jakimkolwiek wywołaniem `getAccountStatus()`) — refaktoring nie zmienił zachowania apki dla
  użytkownika, tylko strukturę kodu pod spodem.

- **2026-09-16 — Audyt pełnego `docs/standards/` (00-18) + GOD BOOK na polecenie właściciela
  projektu ("Przeczytaj nowe standardy i god book dokładnie... Zrób listę do zrobienia").** Każdy
  z 19 rozdziałów przeczytany w całości (nie z metryczki/nagłówka), krzyżowo sprawdzony względem
  kodu przez `grep` tam, gdzie twierdzenie dało się sprawdzić programistycznie (14.3). Pełna lista
  w `docs/lista-do-zrobienia.md`, tu tylko streszczenie metody i największe znaleziska.

  **Cztery realne luki, w kolejności priorytetu:**
  1. Rozdz. 9 (AI w produkcie) — 9.0 mówi wprost "obowiązkowy element każdego projektu rodziny",
     nie moduł opcjonalny (w odróżnieniu od Y.10 GOD BOOK). Zero implementacji dziś.
  2. Rozdz. 12 (Freemium) — 12.8 "jedyny model rodziny". Zero implementacji, apka w 100% darmowa.
  3. 5.3 (PWA offline-first) — `CLAUDE.md` deklaruje "PWA offline-first", ale zero
     `manifest.json`/service workera/biblioteki PWA w `package.json`. `IndexedDbStorageAdapter`
     (5.2) działa od dawna (`use-persisted-draft.ts`) — to była tylko połowa wymogu 5.3, druga
     połowa (cache assetów przez SW) nigdy nie powstała i nikt tego wcześniej nie zauważył, bo
     żaden wcześniejszy audyt nie sprawdzał 5.3 dosłownie, tylko 5.1/5.2 (Seed/StorageAdapter).
  4. 18.3 (scalanie tożsamości) — już znane, bez zmian (patrz wpis wyżej, blokowane na żywe
     logowanie).

  **Świadomie NIE dodane jako nowe luki** (już znane/odłożone, żeby nie dublować): rollout i18n
  (89 plików/109 miejsc), 10.5 (audyt K1-K8, 116 modułów — rozłożony w czasie z definicji), 57
  pozycji `todo` w `docs/rejestr-pokrycia.md` (stress-test zimowy, w większości zależne).

  **Przy okazji znalezione i naprawione — higiena dokumentacji, nie nowa funkcja (14.2, jawna
  korekta nie ciche nadpisanie):**
  - `lib/adapters/storage-adapter.ts` — komentarz twierdził "apka nie ma jeszcze żadnej funkcji
    zapisującej Seed projektu, implementacja to osobne zadanie" — nieprawda od momentu powstania
    `IndexedDbStorageAdapter`/`use-persisted-draft.ts` (wcześniejsza sesja, nigdy nie wrócono
    poprawić ten konkretny komentarz). Poprawiony, odsyła teraz do realnej implementacji.
  - `docs/rejestr-pokrycia.md`, sekcja "Pozostałe moduły (6,7,10,11,12,13)" — z 30.08.2026,
    twierdziła "nie rozpoczęte" mimo że każdy z tych modułów ma dziś min. jeden ekran `done`
    (potwierdzone wierszami wyżej w tym samym pliku: M6 COP pompy ciepła, M7 Black Start, M10
    Prognozy, M11 Przygotowanie stanowiska + Montaż baterii, M12 Tryb uproszczony, M13 Tryb Live).
    Stary tekst zostawiony (nie usunięty), oznaczony jako korekta, z odsyłaczem do aktualnego stanu.
  - **Wzorzec do zapamiętania:** oba znaleziska to ten sam kształt błędu — komentarz/notatka
    napisana w momencie "jeszcze nie zbudowane", nikt nie wrócił jej poprawić, gdy budowa faktycznie
    nastąpiła w innej sesji/innym wątku pracy. Warte uwagi przy przyszłych audytach: szukać nie
    tylko brakującego kodu, ale też komentarzy/dokumentacji, które kłamią o istniejącym kodzie w
    drugą stronę (twierdzą "nie ma", a jest).

  Następny krok (na wyraźne polecenie): rozdz. 9 (AI w produkcie), patrz kolejny wpis.

- **2026-09-16 — Rozdz. 9 (AI w produkcie): pierwsza realna integracja, "Zapytaj asystenta" na
  `/kalkulatory/pomocnicze`.** Zakres celowo wąski (ten sam rytm co rollout i18n, 17.9: moduł po
  module, nie big bang) — jedno narzędzie AI, jeden ekran pilotażowy. Decyzje warte zapamiętania:

  - **`@anthropic-ai/sdk` 0.126.0 (aktualnie zainstalowana wersja) nie ma jeszcze beta Tool
    Runnera ani `betaZodTool`/`client.beta.messages.toolRunner`** — zweryfikowane wprost przez
    `find`/`grep` w `node_modules` przed napisaniem kodu (nie zgadywane z priorów treningowych,
    zgodnie z dyscypliną skilla `claude-api`: "Never guess SDK usage"). Zamiast tego użyto w pełni
    udokumentowanego, stabilnego wzorca ręcznej pętli agentowej (manual agentic loop) z tego
    samego skilla. **Jeśli w przyszłości SDK zostanie zaktualizowane**, warto rozważyć migrację na
    Tool Runner (mniej kodu do utrzymania) — nie zrobione teraz świadomie, nie przeoczenie.
  - **`z.toJSONSchema()`** (Zod v4, już zależność projektu) generuje `Anthropic.Tool.InputSchema`
    bezpośrednio ze schematu Zod narzędzia — bez dodatkowej biblioteki/helpera. `Tool.InputSchema`
    ma indeks `[k: string]: unknown`, więc toleruje dodatkowe pole `$schema`, które Zod dokłada.
  - **Rejestr narzędzi AI jest z natury heterogeniczny** (różne `TInput`/`TOutput` per narzędzie)
    — próba otypowania tablicy rejestru jako `AiToolDefinition<never, never>` dała błędy wariancji
    TypeScript (`TS2352`/`TS2345`). Rozwiązanie: `AiToolDefinition<any, any>` na granicy rejestru
    (`lib/ai/types.ts`, `lib/ai/to-anthropic-tool.ts`, `lib/ai/pytaj-asystenta.ts`), z komentarzem
    uzasadniającym + `eslint-disable-next-line @typescript-eslint/no-explicit-any` — pojedyncza
    definicja narzędzia (np. `kalkulatoryPomocniczeTool`) zostaje w pełni typowana w swoim miejscu
    deklaracji, `any` jest tylko wymazaniem typu na granicy, nie utratą bezpieczeństwa.
  - **Pułapka złapana przy pierwszym podejściu:** `eslint-disable-next-line` wyłącza regułę
    wyłącznie dla linii bezpośrednio pod dyrektywą — komentarz wyjaśniający w 2-3 liniach
    umieszczony NAD dyrektywą (zamiast pod nią, tuż nad kodem) sprawia, że dyrektywa "next line"
    trafia w kolejną linię komentarza, nie w kod, i `pnpm lint` zgłasza jednocześnie "unused
    eslint-disable directive" ORAZ oryginalny błąd `no-explicit-any` na tej samej linii. Poprawny
    wzorzec: wyjaśnienie jako zwykłe komentarze, `eslint-disable-next-line` jako **ostatnia** linia
    tuż przed kodem, którego dotyczy.
  - `eslint.config.mjs` (presety `eslint-config-next/core-web-vitals` + `.../typescript`) **ma
    aktywną regułę `@typescript-eslint/no-explicit-any` jako błąd** (nie tylko warning) — mimo że
    nie widać jej jawnie w pliku configu (dziedziczona z presetu). Sprawdzone programistycznie
    (`pnpm lint`), nie zgadywane z samej treści configu.
  - **9.4 (obrona przed prompt injection) rozstrzygnięta jako dziś niskie ryzyko, nie pominięta:**
    jedyny wektor wejścia to tekst pytania użytkownika, już traktowany jako zwykły `tool_result`/
    `user` content w kolejnej turze pętli, nigdy nie wstrzykiwany do `system`. Ryzyko wzrośnie,
    gdy pojawi się import zdjęć/dokumentów (AI_CAMERA-owy wzorzec z planu) — wtedy 9.4 wymaga
    ponownego przejrzenia.
  - Świadomie odłożone (nie przeoczenie): więcej narzędzi/ekranów AI, `AiMode` (9.6) nie
    podłączony do trwałego stanu (dziś tylko `CLOUD_ASSISTED` ma sens — brak modelu lokalnego),
    pamięć rozmowy czatu (9.7), budżet/limity zapytań (9.8). Pełny zakres i lista plików:
    `docs/lista-do-zrobienia.md`.

- **2026-09-16 — 5.3 (PWA offline-first): manifest + service worker.** Zakres: `app/manifest.ts`
  (Next.js Metadata File convention), `public/sw.js` (ręczny, bez biblioteki typu next-pwa/
  Serwist — 5.3 dla tego projektu to wąski wymóg: cache assetów + stron po pierwszym pobraniu,
  nie pełny runtime-caching framework; własny, w pełni audytowalny kod pasuje lepiej niż czarna
  skrzynka generowana przez bibliotekę, zwłaszcza przy już restrykcyjnej, ręcznie pisanej CSP w
  `next.config.mjs`), `public/register-sw.js` + warunkowy `<script src>` w `app/layout.tsx`.

  **Odkrycie krytyczne, poza zakresem tego zadania — udokumentowane, NIE naprawione na wyraźne
  polecenie właściciela projektu ("poprawki idą z aktualizacją standardu, zaczekaj"):**
  Podczas weryfikacji w prawdziwej przeglądarce z produkcyjną CSP (`pnpm build && pnpm start`,
  Playwright, nie `pnpm dev` gdzie CSP jest złagodzone o `unsafe-inline`) odkryłem, że **hydracja
  Reacta psuje się na każdym ekranie aplikacji** — `React error #412`. Przyczyna: CSP `script-src`
  w `next.config.mjs` dopuszcza wyłącznie jeden zahardkodowany SHA-256 hash (dla
  `WYGLAD_INIT_SCRIPT`, ustawiającego motyw przed pierwszym malowaniem) — nie obejmuje to
  inline-skryptów RSC streaming (`self.__next_f.push(...)`), które Next.js App Router generuje
  dynamicznie, per żądanie, na każdej stronie. Statyczny hash z definicji nie może objąć treści,
  która różni się między requestami. **Zweryfikowane programistycznie, że to błąd pre-existing,
  niespowodowany tą zmianą:** identyczny błąd reprodukuje się na czystym `main` (commit `b5fb177`,
  sprzed PWA), sprawdzone w izolowanym `git worktree`. Najpewniej niewykryte wcześniej, bo cała
  dotychczasowa weryfikacja w przeglądarce w tej sesji szła przez `pnpm dev` (złagodzona CSP), a
  nie przez `pnpm start` z prawdziwą produkcyjną CSP — pierwszy raz w tej sesji przetestowano
  rzeczywistą produkcyjną hydrację w realnej przeglądarce.
  **Właściwa naprawa** (zgłoszona właścicielowi, do decyzji): CSP oparta o nonce-per-request
  (oficjalny wzorzec Next.js — middleware generuje losowy nonce na każde żądanie, obejmuje
  wszystkie skrypty w tym RSC), zamiast statycznego hasha — silniejsze bezpieczeństwo niż dziś,
  bez `unsafe-inline`. Wymaga zmiany `next.config.mjs` (nagłówki przez middleware, nie statyczną
  funkcję `headers()`) + `app/layout.tsx` (nonce w inline skrypcie motywu). **Świadomie
  odłożone** — właściciel projektu: poprawki mają nadejść z aktualizacją standardu, czekamy.
  **Wpływ na to zadanie:** rejestracja service workera została celowo zaprojektowana tak, by NIE
  zależeć od hydracji Reacta — zewnętrzny plik (`public/register-sw.js` przez `<script src>` w
  `<head>`, warunkowany `process.env.NODE_ENV === 'production'` tym samym wzorcem co
  `<Analytics />`), nie komponent kliencki w drzewie Reacta. CSP `script-src 'self'` obejmuje
  zewnętrzne skrypty tej samej domeny bez potrzeby hasha (hash dotyczy wyłącznie treści inline)
  — to ominięcie problemu w zakresie własnego zadania, nie naprawa samego problemu CSP.
  Potwierdzone działające mimo błędu hydracji: SW rejestruje się automatycznie (Playwright,
  `pnpm start`), manifest serwowany poprawnie, strona odwiedzona wcześniej ładuje się offline.
  **Wzorzec do zapamiętania:** weryfikacja przez `pnpm dev` nie jest wystarczająca dla niczego
  związanego z CSP/bezpieczeństwem nagłówków — `pnpm dev` celowo osłabia CSP (`unsafe-inline`/
  `unsafe-eval` dla HMR), więc maskuje dokładnie tę klasę błędów. Przyszła weryfikacja
  bezpieczeństwa/CSP wymaga `pnpm build && pnpm start` + prawdziwej przeglądarki, nie samego
  `curl` (curl nie wykonuje JS, nie zobaczy naruszeń CSP) ani `pnpm dev`.

  **Świadomie odłożone (nie przeoczenie), zgłoszone jawnie w raporcie końcowym:** ikony PWA
  (192/512px, `icon.svg`, `apple-icon.png`) to nadal domyślny znak graficzny v0.app (szkielet, z
  którego projekt wystartował) — `app/layout.tsx` miał też tytuł "v0 App"/"Created with v0",
  nigdy niewypełniony realną nazwą projektu; to akurat poprawione od razu (nie decyzja wizualna,
  tylko nieuzupełniony placeholder — realna nazwa "Inżynier Offgrid Pro" już ustalona wszędzie
  indziej w repo). Własne logo to decyzja wizualna właściciela, nie techniczna — pozostawiona do
  osobnego rozstrzygnięcia.

- **2026-09-16 (czwarta synchronizacja tego dnia) — Aktualizacja ze standardem, 7 wpisów
  `AKTUALIZACJE.md` (wiersze 67-73).** GOD BOOK bez zmiany wersji (nadal v2.19 — brak nowego
  rename pliku w tej partii). Nadpisane w całości (NIETYKALNE): `00-INDEKS.md`,
  `07-bezpieczenstwo.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `18-logowanie.md`.

  **Przetworzone wiersz po wierszu:**
  - **67 (18.5 doprecyzowana)** — pułapka `createBrowserClient()`/`httpOnly:false` + rozstrzygnięcie
    Origin/Host jako CSRF dla Server Actions. To dosłownie **nasze własne zgłoszenie** z pracy nad
    rozdz. 18 tego samego dnia (`docs/wklad-do-standardu.md`), teraz skonsolidowane z powrotem do
    standardu. Zero akcji — już zgodni (`lib/adapters/supabase/client.ts` usunięty, stan logowania
    czytany wyłącznie server-side, PR #96).
  - **68 (17.4 uproszczona)** — cookie+server-side obowiązkowy dla KAŻDEGO projektu z jakimkolwiek
    runtime server-side (koniec oceny "SPA czy nie"). Zero akcji — już tak mamy (cookie `jezyk`,
    nigdy `localStorage`).
  - **69 (15.17 rozszerzona)** — przy niejednoznacznym poleceniu o "aktualizacji standardu"
    pierwszy krok to zawsze `git fetch` + odczyt `AKTUALIZACJE.md` przed budową czegokolwiek.
    Dokładnie to zrobione w tej synchronizacji. Zero akcji w kodzie.
  - **70 (nowa 7.3 — hash CSP liczony automatycznie) — JEDYNE konkretne zadanie kodowe z tej
    partii, nazwane wprost dla tego projektu.** Zbudowano `scripts/check-csp-hash.mjs` (liczy
    SHA-256 z treści `WYGLAD_INIT_SCRIPT` w `app/layout.tsx`, porównuje z `WYGLAD_INIT_SCRIPT_HASH`
    w `next.config.mjs`, exit 1 przy rozjeździe), dopięty do CI (`pnpm check:csp-hash`, krok w
    `.github/workflows/ci.yml` obok `check:i18n-guard`). Zweryfikowany na obu przypadkach (zgodny
    hash → OK; ręcznie zepsuty skrypt → wykryty).
    **🔴 Jawne rozróżnienie, żeby nie pomylić dwóch różnych problemów CSP w tym samym pliku:**
    ten wpis rozwiązuje wyłącznie ryzyko *rozjazdu* hasha jednego, konkretnego, już istniejącego
    skryptu po jego edycji — **nie** rozwiązuje krytycznego znaleziska z tej samej sesji (wpis PWA
    wyżej): produkcyjna CSP z definicji nie może dopuścić przez statyczny hash inline-skryptów RSC
    streaming, które Next.js generuje dynamicznie per-request, więc hydracja Reacta nadal psuje
    się na każdym ekranie w realnej produkcji. Właściwa naprawa (nonce-per-request) nie jest dziś
    częścią standardu — sprawdzone wprost w tej samej partii `AKTUALIZACJE.md`, żaden z 7 wpisów
    tego nie porusza. Pozostaje odłożona zgodnie z wcześniejszą decyzją właściciela projektu.
  - **71 (5.2 doprecyzowana)** — wzorzec blokującego skryptu pre-paint dla przełączników CSS
    (motyw/kontrast) potwierdzony jako poprawny, z tym projektem jako wzorzec źródłowy. Akcja
    nazwana dla innego projektu rodziny (inzynier-szkieletowy-pro), nie dla nas. Zero akcji.
  - **72 (nowa 17.8 — domyślne języki EN+RU)** — wpis wprost potwierdza: "inzynier-offgrid-pro:
    już zgodny (pl/en/ru zbudowane) — bez akcji." Zero akcji.
  - **73 (nowa 15.18)** — metareguła procesowa dla sesji nad `new-app-standards` (konsolidacja
    niesie gotową receptę innym projektom). Nie dotyczy kodu tego projektu.

  Zweryfikowane po zmianach: `pnpm typecheck`/`lint`/`check:csp-hash`/`check:i18n-guard`/`test`
  (722/722)/`build` — wszystkie czyste.

- **2026-09-16 (piąta synchronizacja tego dnia) — Naprawiony krytyczny błąd CSP/RSC streaming:
  nonce-per-request zastąpił hash-based CSP.** Zamknięcie pętli: błąd znaleziony przy pracy nad
  5.3 (PWA), zgłoszony do `docs/wklad-do-standardu.md` (PR #101), skonsolidowany przez
  `new-app-standards` tego samego dnia z konkretną, jednoznaczną akcją — "przejdź na
  nonce-per-request w middleware, nie auto-liczony hash — to teraz błąd produkcyjny aktywny, nie
  tylko ryzyko" (`AKTUALIZACJE.md`, wiersz 74, KOREKTA tego samego dnia co wiersz 70).

  **Implementacja:**
  - `middleware.ts` — nowa funkcja `buildCsp(nonce)` (przeniesiona z `next.config.mjs`, z
    `script-src` opartym o `'nonce-{wartość}'` zamiast hasha w produkcji; dev bez zmian —
    `'unsafe-inline' 'unsafe-eval'` dla HMR). Nonce generowany raz na żądanie
    (`crypto.randomUUID()`), ustawiany jako nagłówek żądania `x-nonce` (propagowany do Server
    Componentów) ORAZ jako nagłówek odpowiedzi `Content-Security-Policy` (przez nową funkcję
    `zastosujCsp()`, wywoływaną na wszystkich trzech ścieżkach zwrotu middleware — bez
    Supabase, po przekierowaniu do loginu, i na ścieżce normalnej — żadna odpowiedź nie omija
    CSP).
  - `next.config.mjs` — CSP całkowicie usunięta stąd (statyczna funkcja `headers()` nie ma
    dostępu do per-request nonce'u, z definicji nie może wygenerować poprawnej CSP dla tego
    wzorca) — zostają tylko pozostałe, statyczne nagłówki bezpieczeństwa (X-Frame-Options itd.).
  - `app/layout.tsx` — `const nonce = (await headers()).get('x-nonce')`, dokładany jawnie do
    obu własnych `<script>` (inline `WYGLAD_INIT_SCRIPT` i zewnętrzny `register-sw.js`). Next.js
    automatycznie dokłada ten sam nonce do własnych, dynamicznie generowanych inline-skryptów
    (RSC streaming), gdy wykryje go w nagłówku odpowiedzi — to jest właściwy mechanizm, nie coś
    do ręcznej implementacji.
  - Usunięty `scripts/check-csp-hash.mjs` + krok w CI + skrypt w `package.json` — nieaktualny,
    nie ma już hasha do zweryfikowania (zastąpiony wzorzec nie używa hasha wcale).

  **Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  prawdziwa produkcyjna CSP z nagłówkiem realnie zawierającym `'nonce-...'`, sprawdzone przez
  `curl -D -`):** zero błędów CSP w konsoli (poprzednio: seria `Refused to execute inline
  script`), zero `React error #412`. **Kluczowy dowód, że to nie tylko "strona się renderuje"**
  (SSR HTML wygląda poprawnie nawet gdy hydracja jest zepsuta — to właśnie zmyliło wcześniejsze
  sesje): zmiana trybu w selektorze na `/kalkulatory/pomocnicze` po załadowaniu strony realnie
  przelicza wynik na żywo (9.058 A → 1200.000 Wh) — to wymaga działających event handlerów
  Reacta, niemożliwych bez udanej hydracji. Service worker (5.3) rejestruje się automatycznie
  (nie tylko przez obejście z zewnętrznego `<script src>` — teraz działałby nawet jako zwykły
  komponent kliencki, obejście zostaje jako dodatkowa odporność, nie jedyny mechanizm). Offline
  nadal działa. Dodatkowo zweryfikowany `pnpm dev` — CSP złagodzona jak wcześniej, cookie języka
  nadal poprawnie ustawiana, middleware nie zaregresował.

  **Wzorzec do zapamiętania:** to zamyka temat otwarty w dwóch wcześniejszych wpisach tego dnia
  (5.3/PWA i aktualizacja ze standardem) — oba jawnie ostrzegały "to NIE jest naprawiony błąd,
  tylko auto-liczony hash dla innego, węższego problemu". Naprawa faktycznie nadeszła tego
  samego dnia przez kanał `wklad-do-standardu.md` → konsolidacja → `AKTUALIZACJE.md`, dokładnie
  tak, jak przewiduje mechanizm U.2/U.4 GOD BOOK — potwierdzenie, że ten proces działa
  end-to-end w praktyce, nie tylko w teorii dokumentu.

- **2026-09-16 — Start rolloutu treści i18n (17.9: moduł po module), pierwsza partia — 3 moduły.**
  Kontekst: audyt wcześniej dziś ustalił, że infrastruktura i18n jest gotowa, ale treść
  zmigrowana tylko w 1/90 plików `warnings.ts` (pilotaż `kalkulatory-pomocnicze`). Właściciel
  projektu: zacznij rollout. Wybór pierwszej partii: 3 z 6 modułów, których strony UI JUŻ
  korzystały z `useTranslate()` (widoczne przez wcześniejsze podłączenie tych stron do i18n bez
  migracji treści źródłowej) — `systemy-podtrzymania-zycia`, `cop-pompy-ciepla`,
  `lokalizacja-i-klimat`. Pozostałe 3 z tej szóstki (`czystosc-i-snieg`,
  `porownanie-technologii`, `prognozy`) celowo pominięte w tej partii — mają trudniejszy kształt
  problemu (patrz niżej), nie prosty `Warning.message`/`assumptions` string.

  **8 nowych kluczy słownika** (`WARTOSC-POZA-ZAKRESEM`, `POZYCJA-NIEDODATNIA`,
  `BRAK-ZAZNACZONYCH`, `POZYCJA-WARTOSC-DOMYSLNA`, `COP-POZA-ZAKRESEM`,
  `MOC-CIEPLNA-NIETYPOWO-WYSOKA`, `COP-ZALEZY-OD-TEMPERATURY`, `DANE-KLIMATYCZNE-TRYB-OFFLINE`) w
  `dictionary-{pl,en,ru}.ts`. Jeden klucz z pilotażu (`WARTOSC-NIEDODATNIA`) okazał się od razu
  wielokrotnego użytku — `cop-pompy-ciepla`'s `notPositive` ma identyczny kształt komunikatu, więc
  reużyty bez tworzenia duplikatu (dowód, że wspólny słownik zapobiega dryfowi identycznych
  komunikatów rozjeżdżających się osobno per moduł).

  **🔴 Realny błąd znaleziony PRZED uruchomieniem, przez czytanie kodu, nie przez awarię w
  przeglądarce — warty zapamiętania jako wzorzec audytu.** Wszystkie trzy docelowe strony
  (`app/kalkulatory/{systemy-podtrzymania-zycia,cop-pompy-ciepla,lokalizacja-i-klimat}/page.tsx`)
  renderowały `warnings` przez samo `{w.message}`, BEZ fallbacku `?? t(w.i18nKey ?? w.code,
  w.params)` — w odróżnieniu od `assumptions` na tych samych stronach, które już miały poprawny
  wzorzec, i od współdzielonego `components/wzorce/wynik-szczegoly.tsx` (używanego przez ~70
  innych stron), który też ma to poprawnie. Skutek, gdyby to przeoczyć: po usunięciu
  `Warning.message` z tych trzech modułów (co ta migracja właśnie robi), ostrzeżenia
  renderowałyby się jako **puste teksty** — `{w.message}` samo w sobie, bez `?? t(...)`, po
  prostu wypisuje `undefined` jako nic. Naprawione — dodany brakujący fallback we wszystkich
  trzech miejscach, zanim treść została zmigrowana (nie po fakcie).
  **Wzorzec do zapamiętania dla kolejnych partii:** "strona już używa `useTranslate()`" nie jest
  dowodem, że KAŻDA ścieżka renderowania na niej faktycznie tłumaczy — `assumptions` i `warnings`
  to dwie niezależne ścieżki kodu na tej samej stronie, obie trzeba sprawdzić osobno przed
  migracją treści źródłowej, nie zakładać z faktu importu `useTranslate()`.

  **Napotkane, świadomie odłożone przypadki trudniejsze niż `i18nKey`/`params`** (do rozważenia w
  osobnej sesji/partii, nie tego samego kształtu co reszta rollout):
  - `czystosc-i-snieg` — `CalcResult.value` (nie `warnings`/`assumptions`) zawiera bezpośrednio
    tekst PL: `KAT_OPISY` (Record z gotowym opisem per pasmo kąta) i `powod` (budowany przez
    interpolację string w `ocenHarmonogramCzyszczenia`). Migracja wymaga zmiany kształtu typu
    wyniku (`KatSamooczyszczaniaResult`/`HarmonogramCzyszczeniaResult`) na `opisKey`/`powodKey` +
    `params`, nie tylko podmiany `message`→`i18nKey` — większa zmiana kontraktu, nie ten sam
    wzorzec co reszta partii.
  - `porownanie-technologii` — `BATTERY_TECHNOLOGIES` w `constants.ts` zawiera nazwy/opisy
    technologii bateryjnych po polsku — to dane katalogowe, nie komunikaty `Warning`/
    `Assumption`; wymaga osobnej decyzji architektonicznej (czy katalog danych referencyjnych
    dostaje własny mechanizm i18n, czy zostaje częścią "profilu regionalnego" z 02-model-danych),
    nie mieści się w istniejącym wzorcu `i18nKey`/`params` bez zmiany.
  - `prognozy` — nie sprawdzone jeszcze w tej sesji (brak `warnings.ts`, moduł typu "raport" —
    może mieć własny kształt tekstu osadzonego w wyniku, analogicznie do `czystosc-i-snieg`).

  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU, osobno `assumptions` i osobno `warnings` — formularze faktycznie
  wypełniane, nie tylko stan początkowy): poprawny przetłumaczony tekst w każdym przypadku, zero
  znaczników `⚠ [...]`, zero błędów konsoli związanych z i18n. 8 nowych testów: parytet/
  podstawianie parametrów dla nowych kluczy w `lib/i18n/__tests__/t.test.ts` + w każdym z 3
  modułów asercja, że `warnings`/`assumptions` mają `i18nKey`/`kod`+`params` i `message ===
  undefined` (17.9: test treściowy w tej samej turze co treść, nie później).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (730/730)/`build` czyste.

