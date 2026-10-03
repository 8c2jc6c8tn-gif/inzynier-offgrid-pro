# docs/memory.md — Inżynier Offgrid Pro

Żywy log decyzji, pułapek i stanu tego konkretnego projektu. Format i zasada aktualizacji: `docs/standards/14-proces-i-pamiec.md` (14.5). Nie duplikuje `ZASADY_APLIKACJI.md`/`USTALENIA.md` (te są konstytucją projektu, nadrzędną wobec kodu) ani `docs/standards/` (te są standardem wspólnym dla całej rodziny aplikacji) — tu trafia to, co specyficzne dla *tego* repo i *tej* historii pracy.

---

## Jak czytać ten plik

Na starcie sesji wystarczy ta część: **Archiwizacja** (zasady), **Skrót aktywny** (pułapki, konwencje i obowiązujące decyzje wyciągnięte z historii 29.08–24.09.2026) i **sekcje z ostatnich 7 dni** pod spodem (dosłownie, bez skrótów). Pełna historia starsza niż 25.09.2026 leży 1:1 w `docs/memory-archiwum/` — szukaj tam przez `docs/memory-archiwum/INDEKS.md` albo `grep -rn "fraza" docs/memory-archiwum/`. Odsyłacze `[A:NN]` niżej = plik archiwum o numerze NN (np. `[A:05]` → `05-blad-procesowy-edycja-standardu-16-09.md`).

**Odsyłacze „`docs/memory.md`, wpis DD.MM.2026” w komentarzach kodu i dokumentach** z datą 24.09.2026 lub wcześniejszą wskazują dziś na archiwum (wpisy z 25.09 i później są nadal tutaj): szukaj frazy przez `grep -rn "fraza" docs/memory-archiwum/` albo w `INDEKS.md`; odsyłaczy w kodzie nie przepisywano (minimalna zmiana).

Bieżące zadania i otwarte pytania: `docs/lista-do-zrobienia.md` (nie tutaj). Decyzje strategiczne (D#): `rejestr-decyzji.md`. Ten plik trzyma pułapki, lekcje i decyzje implementacyjne.

## Archiwizacja (zasada tego projektu, lokalna — od 02.10.2026)

**Po co.** `docs/memory.md` rósł do ok. 770 KB (264 sekcje). Sesja nie jest w stanie przeczytać go na starcie, a pułapki zapisane głęboko ginęły. GOD BOOK ma W.5 (próg rozmiaru) i C.8 (poziomy czytania), ale nie daje procedury dla plików roboczych — jedyny mechanizm archiwizacji to Y.8 dla `docs/wklad-do-standardu.md`. Zgłoszone do standardu: `docs/wklad-do-standardu.md`, wpis z 02.10.2026.

**Układ.** (1) `docs/memory.md` = plik aktywny: nagłówek, ta sekcja, Skrót aktywny, indeks archiwum, sekcje z ostatnich 7 dni. (2) `docs/memory-archiwum/NN-*.md` = dosłowna kopia starszych sekcji (nagłówek pliku + znacznik `<!-- ARCHIWUM-1:1 … -->` + treść bez zmian). (3) `docs/memory-archiwum/INDEKS.md` = tabela plik → okres/temat + spis nagłówków sekcji.

**Kryterium przeniesienia.** Sekcja starsza niż 7 dni (na dzień przebiegu) i bez otwartego wątku. Otwarte pytania i zadania żyją w `docs/lista-do-zrobienia.md`, więc sekcja memory.md praktycznie zawsze kwalifikuje się po samym wieku; jeśli sekcja niesie otwartą decyzję bez wpisu na liście, najpierw dopisz ją tam (albo zostaw sekcję w pliku aktywnym).

**Procedura przebiegu.** (a) Ustal granicę: pierwsza sekcja (`## `) z datą nowszą niż próg. (b) Wytnij starsze sekcje do plików ok. 40–75 KB, cięcie tylko na granicach sekcji, nazwa `NN-temat-zakres-dat.md`. (c) **Dowód bezstratności:** złączona treść plików archiwum (po znaczniku) musi być bajt w bajt równa wyciętemu fragmentowi oryginału — porównać skryptem przed jakąkolwiek zmianą `memory.md`; zapisać wynik w dzienniku niżej. (d) Przeczytać archiwizowaną treść i **wyciągnąć do Skrótu aktywnego** to, co nadal obowiązuje (pułapki środowiska i narzędzi, konwencje, decyzje z uzasadnieniem, odstępstwa); wpisy w stylu „zbudowano ekran X” zostają tylko w archiwum (status ekranów: `docs/rejestr-pokrycia.md`). (e) Zaktualizować `INDEKS.md` i wpis w dzienniku na końcu pliku. Nic nie jest skracane „dla zwięzłości” (GOD BOOK D.5) — skrót stoi OBOK archiwum, nie w jego miejsce.

**Następne przebiegi.** Wyzwalacz: plik aktywny powyżej ok. 150 KB albo pełny audyt (Y.9). Ta sama zasada obowiązuje dla `docs/lista-do-zrobienia.md` (wpisy ✅ starsze niż próg → `docs/lista-do-zrobienia-archiwum/`; ⚠️ 🔲 ⏳ 🔄 zostają) i `docs/wklad-do-standardu.md` (Y.8, już istnieje archiwum) — kolejność pierwszego przebiegu: memory (zrobione 02.10.2026), potem lista zadań, potem wkład do standardu; patrz wpis na liście zadań.

# SKRÓT AKTYWNY (stan wiedzy z historii 29.08–24.09.2026)

## 1. Proces i współpraca

- **Kanał do standardu jest jeden.** Nowa reguła uniwersalna idzie wyłącznie do `docs/wklad-do-standardu.md` (i ewent. `docs/propozycje-do-new-app-standards/`). Nigdy do `docs/standards/` ani GOD BOOK (mirror), nigdy do repo `new-app-standards`, nawet gdy sesja ma je dołączone przez `add_repo` — dołączenie ≠ autoryzacja; „sesja nad new-app-standards” (Y.8) to osobna, dedykowana sesja. Błąd z 16.09 (PR #9 zamknięty bez merge) i 06.09 (rozdział 17 dopisany do `docs/standards/` i cofnięty) nie powtarzać; zasada potwierdzona wprost przez właściciela 20.09: „ty nic nie robisz w cudzych repo”. Zgłoszenie wraca jako reguła zwykle w ciągu doby (wielojęzyczność, CSP nonce, 18.5) — cykl U.2/U.4 działa. `[A:05]`, `[A:03]`, `[A:07]`
- **Audyt Część N ≠ synchronizacja Y.9.** N = weryfikacja kompletności materiału źródłowego względem zintegrowanej treści, bezpośrednio w źródle; Y.9 = czy pliki/rozdziały istnieją i są w aktualnej wersji. Pierwsze N (05.09) pominęło porównanie 579 funkcji, a 13 agentów (1 na moduł) znalazło luki w 9 modułach → **Dyrektywa #14**: rejestruj natychmiast, sprawdzaj sąsiednie pozycje źródła, małe partie. `[A:01]`
- **Dryf vs konflikt.** Kod/dokument, który odjechał od ustalonej reguły bez świadomej decyzji → napraw od razu i zapisz (wyjątek CLAUDE.md/Y.2). Realna sprzeczność dwóch źródeł → pokaż A/B, nie rozstrzygaj (I.1). Rozstrzygnięcia: starsza vs nowsza norma z jawną datą obowiązywania (Tablice 41A/B z 2000 → Tablica 41.1 z 2009) — rozstrzygasz sam (kod wg aktualnej); sprzeczność merytoryczna bez wskazania — zgłaszasz. `[A:03]`
- **Dokumentacja kłamiąca „nie ma”, gdy jest** (komentarze „jeszcze nie zbudowane”, statusy `blocked` po dostarczeniu normy, `todo` po zbudowaniu, stale statusy 🔎 nowe w wkładzie) to powtarzający się dryf — przed „zaległą” pracą sprawdź realny stan kodu, nie ufaj liście. Przy audycie szukaj dokumentacji twierdzącej „brak”, gdy jest. `[A:05]`, `[A:07]`
- **Nie przedstawiaj hipotez jako faktów — weryfikuj przed zapisem.** Dwa razy zapisano o CI/limitach Actions niezweryfikowane twierdzenie (PR #132/#136); ustalenia o infrastrukturze sprawdzaj przez API (`visibility`, `actions/runs`), nie ze zrzutu. Sprostowania odnotowuj przekreśleniem (np. tabela C.1 „208 A” nie była błędem), nie kasuj. `[A:02]`, `[A:04]`, `[A:07]`
- **Pierwszeństwo własnych kalkulatorów (13.09).** Gdy aplikacja ma precyzyjniejszy kalkulator niż uproszczenie z materiału źródłowego, wygrywa kalkulator aplikacji; materiał = „pierwsze przybliżenie”. `[A:04]`
- **Konflikt numeracji D# (H.3):** przed nadaniem numeru sprawdź najwyższy na `origin/main`; pierwszy scalony zachowuje numer (D22/D23 = MapLibre/ULDK, adaptacyjny Y.6 przenumerowany na D24). `[A:08]`
- **Duże mechaniczne rollouty:** 2–4 subagentów albo sekwencyjnie. Osiem naraz wyczerpało limit sesji API (429) przy rolloucie autosave (część plików niedokończona; sprawdzić typecheck/lint na zmienionych). `[A:07]`
- **Gałęzie zdalne — NAJPIERW LISTA, potem ewentualne sprawdzanie (powtórzone 3× przez różne sesje: 27.09, 29.09, 02.10).** Lista gałęzi-śmieci jest w sekcji „Porządki gałęzi na GitHubie” (27.09.2026, uzupełniona 01.10) i „Przegląd niescalonych gałęzi zdalnych” (29.09.2026) w tym pliku: stan od 29.09 = **każda gałąź zdalna poza `main` jest do usunięcia**, nie weryfikuj, nie scalaj, nie porównuj; gałęzie zastąpione nowszymi PR-ami (m.in. `laughing-faraday-lp6ytt`, `youthful-fermat-tbxoxg`, `sync-offgrid-standard-ucgqok`, `screen-fixes-new-documents-80kzcm`) scalone cofnęłyby dokumenty. Sprawdzaj wyłącznie gałęzie spoza listy i nowsze niż ostatnia kontrola (np. gałąź innej sesji z dzisiejszą datą — to praca w toku, nie śmieć). Przed jakimkolwiek porównaniem `git rev-parse --is-shallow-repository` → jeśli `true`, `git fetch --unshallow origin` (płytki klon pokazuje setki fałszywych „niescalonych” commitów). Kasowanie gałęzi z sesji jest niemożliwe (HTTP 403) — robi to właściciel w GitHubie (*Branches* → kosz; ustawienie repo „Automatically delete head branches”). `[sekcje 27.09 i 29.09 niżej]`
- **`rejestr-decyzji.md`** = decyzje strategiczne; drobne decyzje implementacyjne per ekran zostają w memory. Nie re-transkrybować per-moduł specyfikacji do Biblii (rejestr-pokrycia + docs/zrodla pełnią tę rolę, I.2). `[A:03]`
- **Merge/PR:** „405 merge conflicts mimo identycznej treści” = gałąź z presquash commitami — `git merge origin/main` + `git checkout --ours` na jedynym realnym konflikcie, najpierw porównać `git diff <sha>:<plik> origin/main:<plik>`. Po squash: `git fetch origin main && git merge origin/main` (Dyrektywa #9). Plik dostarczony luzem do `docs/zrodla/` zawsze do katalogu `norma-*` + indeks + README + `normy-brakujace.md` (I.3). `[A:07]`, `[A:03]`

## 2. Środowisko, narzędzia, weryfikacja

- **`pnpm build` NIE zastępuje `pnpm typecheck` ani `pnpm lint`** (`next.config.mjs`: `typescript.ignoreBuildErrors: true`). Pakiet przed merge: typecheck, lint, check:i18n-guard, test, build, audit:gate (+ check:pomoc-guard, check:ai-tools-guard, check:stopy-guard). `[A:03]`, `[A:08]`
- **Weryfikacja w przeglądarce jest obowiązkowa tam, gdzie testy jednostkowe nie sięgają:** kolor werdyktu (🔴 liczyć z `warning.level`, nie z `status`), obcięty tekst SVG (etykiety przy krawędzi `viewBox`), duplikaty `id` pól w `.map()`/blokach A/B, pustka zamiast tekstu po migracji i18n, komentarz XML z `--` w SVG (Chromium nie renderuje), CSP/hydracja. Dowód hydracji = zmiana trybu przelicza wynik na żywo (SSR HTML wygląda dobrze mimo zepsutej hydracji). **CSP i nagłówki sprawdzać wyłącznie `pnpm build && pnpm start` + prawdziwa przeglądarka**; `pnpm dev` osłabia CSP, `curl` nie wykonuje JS. `[A:03]`, `[A:05]`, `[A:07]`
- **Serwer produkcyjny nazywa się `next-server`** (nie `next start`). Przed Playwright: `ps aux | grep next-server`, `pkill -9 -f next-server`, świeży `pnpm build && pnpm start` — inaczej stary build daje fałszywe `⚠ [KOD]`. `[A:06]`
- **`rm -rf .next`** po usunięciu route/pliku (stary `validator.ts` daje fałszywy błąd typów). Po pull wielu commitów: `CI=true pnpm install --frozen-lockfile` (bez `CI=true` pnpm przerywa bez TTY). **Nie uruchamiać Prettiera** (repo bez konfiguracji, styl bez średników). Heredoc `<<EOF` wykonuje backticki z JSDoc → `<<'EOF'`. `[A:05]`, `[A:08]`
- **`pnpm test` przy obciążonej maszynie** potrafi dać kod ≠ 0 mimo „passed” (`[vitest-pool]: Timeout terminating forks worker`, losowy plik) — patrz na liczbę testów i treść błędu, ponów. `gh pr create` pada przy limicie GraphQL → `gh api` (REST, 60/h). `[A:08]`
- **ESLint/React Compiler:** `react-hooks/set-state-in-effect` → odczyt zewnętrznego źródła przez `useSyncExternalStore` (subscribe + getSnapshot + getServerSnapshot z cache referencji) albo stan ustawiany w renderze (wzorzec „Adjusting state when a prop changes”) z flagą-stanem; `react-hooks/refs` — `ref.current=…` tylko w efekcie; `react-hooks/immutability` — mutacja `document.cookie` w closure komponentu odrzucana → funkcja modułowa w osobnym pliku; `@typescript-eslint/no-explicit-any` jest błędem (preset eslint-config-next); `eslint-disable-next-line` ma być OSTATNIĄ linią tuż nad kodem; flat config przez importy z `eslint-config-next/core-web-vitals` i `/typescript`, nie FlatCompat. Cudzysłowy w JSX: „…” (nie `"…"`). `[A:03]`, `[A:05]`
- **Nie ufać `pkill`/dziedziczonym założeniom, nie odpuszczać weryfikacji po zmianie typu współdzielonego kontraktu:** po zmianie `CalcResult`/`Warning` tylko `tsc --noEmit` znajduje wszystkie call site’y. `[A:04]`
- **Weryfikacja liczb:** każdy krytyczny wzór niezależnie w Pythonie/Node PRZED kodem (Dyr. #3), referencje testów liczone ręcznie przed napisaniem testów. Wartości z norm w kodzie — kontrola wizualna względem renderu strony PDF. `[A:03]`
- **Środowisko chmurowe:** `next dev` dopisuje blok `BEGIN:nextjs-agent-rules` do CLAUDE.md — commitować z resztą. Worktree: dowiązanie symboliczne do `node_modules` repo głównego wystarcza dla tsc/eslint/vitest (patrz sekcje z października niżej). Płytki klon: `git fetch --unshallow` przed porównaniem gałęzi (wpis w wkładzie do standardu z 01.10.2026). `[A:02]`
- **CI (stan):** `.github/workflows/ci.yml` — job `quality` (lint → typecheck → i18n-guard → test → build, `pnpm install --frozen-lockfile`) i `dependency-audit` (`pnpm audit:gate` = tylko zależności BEZPOŚREDNIE high/critical; `pnpm audit --json` nie ma pola `isDirect`, bezpośrednia = klucz w własnym package.json) rozdzielone celowo (11.2 + 11.5); `paths-ignore`: `docs/**`, `**/*.md`, `.claude/**` (zmiana samego ci.yml zawsze uruchamia CI); `packageManager: pnpm@10.33.0`; jeden lockfile. W dniach 20.09–30.09 CI nie działało (limit konta wg właściciela; repo publiczne, API pokazywało 0 uruchomień), merge szedł na pełnym pakiecie lokalnym; 01.10 CI wróciło (nota usunięta z CLAUDE.md). `[A:02]`, `[A:07]`, `[A:08]`

## 3. Kod domenowy — wzorce i granice

- **Nigdy nie zgaduj** współczynnika/normy/progu (Dyr. #1). Wolno: uniwersalna fizyka bez wolnego parametru (prawo Ohma, ciepło wody 4186 J/kgK, ρ_Cu 0,0175, Magnus-Tetens a=17,27/b=237,7, deklinacja Coopera, Q=n·V·ρ·cp·ΔT/3600, wzór Dwighta dla pręta uziemiającego, wind chill NWS, Meeus/Kasten-Young/Meinel/Liu-Jordan/Muneer). Zakres w źródle (γ −0,3…−0,45 %/°C, β Voc, ΔT bojlera, granice sezonu, przyrost temp. panelu) → pole ręczne z podpowiedzią zakresu, nie środek jako ukryty domyślny. Ceny rynkowe (bateria, paliwo, prąd, kursy) = pole użytkownika, nigdy stała. `[A:03]`
- **Luka w tabeli/drzewie źródła** (5–10°C w Cold C-Rate, SoC dokładnie 30% w grzałkach, przepust 5–15 cm, protokół „inny/nieznany”, 0 kWh nieobliczalne) → `OUT_OF_SCOPE` z jawnym komunikatem, bez interpolacji i „bezpieczniejszej” zgadywanki; wpis w `docs/rejestr-twardych-stopow.md` („Znane luki”); granice testować dokładnie. Brak normy (`docs/normy-brakujace.md`) to inna kategoria niż brak wzoru w źródle domenowym. `[A:03]`
- **Przykłady źródła nie są celem testów.** Przykład ze sprzecznością/niereprodukowalny (Magnus: −6°C „wykropli” przy rosie −7°C; sprawność 95% vs 100%; napór 350 N; MC4 25 W; „75% → +25%” zamiast +33,3%; kolektor gruntowy 5.42; „6× miedzi” zamiast ~1/V²) → wzór z sekcji „Silnik”, test na wartościach self-konsystentnych, rozbieżność w komentarzu kodu i tu (Dyr. #5/#13); kandydat z ≥2 niereprodukowalnymi przykładami = gorszy wybór. Uproszczony model źródła (jedna wspólna Vmp w mismatch) wdrażać wprost, nie „poprawiać” fizyką niepasującą do przykładu. `[A:03]`
- **Warstwa źródła bez wzoru** (ilustracja, sterowanie AI bez progu, SoH coulombowski wymagający historii, „kompletny szablon Doradcy” bez formuły) → nie budować kalkulatora; Wzorzec C (treść) albo TD#; etykieta „kompletny szablon” nie gwarantuje obliczalności. `[A:03]`, `[A:07]`
- **Statusy:** `0` jako „niewypełnione” → `INCOMPLETE`; gdy 0 jest realną wartością (0 V ogniwa, 0°C, 0 kWh nadwyżki) → `number | null`. Z progiem „<” zero daje fałszywy PASS (rezystancja uziemienia 0 < 10 Ω) → osobne `critical …-NIEZMIERZONA` PRZED porównaniem. Pola bezpieczeństwa boolean domyślnie `false` (nie `null`) — brak potwierdzenia = alarm. `info` nigdy nie podnosi statusu (Dyr. #6; powtarzało się 5×). Twardy stop 🔴 w UI z `warning.level` (Dyr. #4). `CalcResult.inputs` tylko numeryczne (Dyr. #10). `[A:03]`, `[A:04]`
- **Echo (Dyr. #8) z zastrzeżeniem D20:** ta sama liczba (1,25) ≠ ta sama reguła — przed ekstrakcją sprawdź uzasadnienie normatywne (przypadek M3/E22 vs M5/E6: margines Isc PV vs margines obwodu). Po refaktorze stare testy mają przejść bez zmian. Jednolinijkowe dzielenie nie uzasadnia ekstrakcji. Echo zwracające `0` dla niezgodnego wariantu (strataRocznaKwh=0) trzeba obsłużyć w wołającym (fałszywe „taniej”). Echo danych wejściowych między modułami = profil sprzętu (`lib/profil-sprzetu/`, jeden klucz `offgrid.profil-sprzetu.v1`). `[A:03]`, `[A:04]`, `[A:07]`
- **Moduł Wzorca D „mega-Doradca”:** etapy niepasujące do tematu ekranu usuwać/przenosić (nie rozbijać); dane przenoszone do przyszłego modułu zostawić w constants z komentarzem, nie kasować jako martwy kod. Ekrany pochodne i Kreator Pro (§8.11 standardu): artykuł (C) ≠ ekran pochodny ≠ Kreator Pro. `[A:04]`
- **Autosave:** `IndexedDbStorageAdapter` (baza `offgrid-storage`, store `kv`) + `usePersistedDraft<T>(klucz = nazwa katalogu app/kalkulatory/, STAN_POCZATKOWY)`, debounce 500 ms, Seed nie Wynik (wyniki nie zapisywane, 5.1); nowe pola w stanie jako opcjonalne (stary szkic ich nie ma — hook nie scalał ze stanem początkowym, potem poprawione 5.5). `[A:04]`, `[A:07]`
- **Narzędzia AI:** wynik dla modelu zawsze przez `lib/ai/tools/teksty-wyniku.ts` (`t("pl", …)`), nigdy `technicalMessage`/`JSON.stringify({kod})`; asystent globalny w `app/layout.tsx`, rejestr `NARZEDZIA` w `lib/ai/pytaj-asystenta.ts`; SDK 0.126 nie miał Tool Runnera (ręczna pętla), `z.toJSONSchema()` (Zod v4), `AiToolDefinition<any,any>` na granicy rejestru; weryfikować API biblioteki w `node_modules`, nie z pamięci (15.7a). `[A:05]`, `[A:07]`, `[A:08]`
- **Parser/Zod 4:** `z.coerce.number()` zamienia `null` na 0 → `z.string().trim().min(1).pipe(z.coerce.number<string>()…)`. `[A:08]`

## 4. Źródła i normy

- **OCR skanów norm zawodzi cicho.** Pełna weryfikacja wizualna Zał. B normy 5-52 znalazła ~35 błędów (cyfry `2,5→28`, całe pominięte kolumny/wiersze B.52.6/8/20, uszkodzone tabele B.52.1/16/17); reszta tej normy (Zał. A, C, E–I, ZA–ZC) NIE zweryfikowana. Jeden spot-check nie wystarcza; każda liczba z tabeli użyta w kodzie = kontrola względem renderu strony PDF. ≤20 stron czytać wizualnie zamiast OCR. `[A:01]`, `[A:03]`
- **Formaty:** nazwy z macOS w Unicode NFD → FileNotFoundError mimo `ls` (przemianować na ASCII); stary `.doc` → `antiword -m 8859-2.txt|cp1250.txt` i `wvHtml` (soffice odmawia); PDF→docx: najpierw diff, docx lepszy dla tabel, gorszy dla diagramów; pozycje zgubione w konwersji = „nieznane”. Materiały branżowe w `materialy-branzowe-*`, nie `norma-*`. `[A:03]`
- **Normy — stan i pułapki treści:** PN-EN 60445 normuje tylko kody alfanumeryczne (kolory żył = IEC 60446, brak w repo); PN-IEC 60364-4-41 w repo to wyciąg bez Tablic 41A/B — NIE uzupełniać z pamięci (kalkulator samoczynnego wyłączania Zs×Ia≤U0 wymaga osobnego źródła; aktualna jest Tablica 41.1); PN-HD 60364-5-54 Zał. ZC (krajowy): Al chroniony mech. min **10 mm²** dla PL zamiast 16 mm² z tekstu głównego; HD 60364-7-712: Voc_max = Zał. B.1, bezpiecznik stringu w przedziale 1,1·I_SC_MAX ≤ In ≤ I_MOD_MAX_OCPR, obowiązkowość przy Ns>2 gdy 1,35·I_MOD_MAX_OCPR < (Ns−1)·I_SC_MAX (1,25 to margines B.2, nie bezpiecznik); M5/E1 wg PN-HD 60364-5-52 (B.52.2 × temperatura B.52.14/15 × wiązka B.52.17/18, ΔU=I·ρ·2L/S, „k3” z produktowego źródła nie istnieje w normie, PVC domyślnie). `[A:03]`
- **Moment dokręcania M6 (spór 4–4,5 vs 5–7 N·m)** rozstrzygnięty przez właściciela: katalog typów ogniw, oba źródła zachowane, fallback „Inne” + karta producenta. Próg różnicy napięć ogniw M11 = 0,05 V (nie 0,1 V). Dioda BMS↔falownik niepotrzebna (rezystor pre-charge tak); dioda blokująca stringu PV to osobny temat (TD13). `[A:01]`, `[A:03]`

## 5. i18n (stan docelowy i pułapki rolloutu)

- **Architektura (od 20.09, zastępuje wariant cookie+middleware z 16.09):** client-side bundled — `lib/i18n/storage.ts` (`useSyncExternalStore` + localStorage `offgrid.jezyk.v1`), pierwsza wizyta `navigator.languages`, blokujący `JEZYK_INIT_SCRIPT` ustawia `lang` przed malowaniem, zero cookie/serwera dla języka (twardy wymóg offline, 5.3/17.4). **Znana, świadoma luka:** flash widocznej treści przy twardym przeładowaniu z językiem ≠ pl (SSR nie zna localStorage); pełne wyeliminowanie = CSS-multi-language-DOM (refaktor ~130 ekranów), czeka na decyzję. Selektor języka nie ukrywa niekompletnych języków (świadome odstępstwo przedpremierowe od 17.7b, decyzja 23.09; wygasa po skończeniu migracji). `[A:07]`, `[A:02]`
- **Kontrakt:** `Warning.message` opcjonalny/@deprecated, `i18nKey?/params?`; `Assumption = string | {kod, params?}`; `t(language, kod, params)` z jawnym językiem (globalny stan przeciekałby między żądaniami SSR); brak klucza = `⚠ [KOD]` + reporter, nigdy cichy fallback; słowniki EN/RU `satisfies Record<KluczTlumaczenia,string>` (parytet kluczy); nie dopisywać kluczy „na zapas”; klucze/kody po POLSKU (konwencja Warning.code × ~90 plików, 17.1 wyjątek). Nowy moduł: klucze dla `Warning.i18nKey` ORAZ każdego `{kod}` w `assumptions`, test PL/EN/RU w tej samej turze, dopisanie do `MIGRATED_MODULES` w tej samej sesji. `[A:04]`, `[A:05]`, `[A:07]`
- **Strażnik `scripts/check-i18n-guard.mjs`** (AST, nie regex): blokuje `message` z literałem i goły string w `assumptions` także za `?:`/`??`; sprawdza też `validation.ts` (inline `Warning` z tekstem PL — powracający nawyk). Test strażnika: wstrzyknąć regresję na prawdziwym pliku. `[A:04]`, `[A:06]`
- **Pułapki rolloutu:** (1) klucz porównywać po TREŚCI PL słowo w słowo, nie po nazwie funkcji (SPRAWNOSC-POZA-ZAKRESEM ułamek vs %; ten sam `code`, inny tekst → odrębny `i18nKey`; `code` nie musi być globalnie unikalny, `i18nKey` musi); (2) „strona używa useTranslate()” ≠ każda ścieżka tłumaczy — `warnings` i `assumptions` osobno, KAŻDE wywołanie `WynikSzczegoly` ma dostać `warnings`; (3) migracja modułu A psuje modułu B, który go echuje (`w.message ?? w.code`) — przed migracją `grep -rn "calculate<Nazwa>"`; (4) param to liczba/jednostka/symbol albo własny klucz — dosłowny polski tekst jako param daje półprzetłumaczone zdania (zamknięty mały zbiór → identyfikator + klucz per wariant, np. `Sezon`; etykieta pola → klucz per pole; otwarty katalog → kolejka „dane katalogowe”: `pv/czystosc-i-snieg`, `baterie/komunikacja-bms`, `baterie/porownanie-technologii`); (5) brak markera `⚠ [` nie dowodzi, że treść się pojawiła — porównać `innerText` PL/EN/RU; (6) szacunek zakresu liczyć programistycznie (`find` vs MIGRATED_MODULES), nie z pamięci. `[A:06]`
- **Wspólny słownik:** generyczne klucze osobne dla różnych semantyk (WARTOSC-NIEDODATNIA >0 vs WARTOSC-NIE-MOZE-BYC-UJEMNA ≥0). `[A:06]`

## 6. UI/UX

- **Tokeny, nie kolory:** werdykt przez `--werdykt-ok/-uwaga/-blad` + `color-mix()` i `WerdyktPanel`/`WerdyktBadge`; INCOMPLETE = osobny neutralny styl; akcent z kontrastem WCAG; nie hardkodować klas kolorów Tailwind. Motyw/wygląd/język: blokujący skrypt pre-paint w `layout.tsx` + `suppressHydrationWarning` na `<html>`; klasy fontów `next/font` statyczne w JSX, dynamiczne kolory/czcionka skryptem + localStorage; fonty z subsetem `latin-ext`. `[A:03]`
- **Pulpit:** `lib/pulpit/registry.ts` — jedyne źródło prawdy o kaflach/ekranach; maskotka > animowane SVG > emoji; kafel 14 (Ustawienia) poza gridem; klasy animacji `ki-`; dwie animacje na jednym elemencie przez shorthand `animation` się nie sumują; zasoby UI (PNG→WebP ≤900 px) lekkie, pliki referencyjne mogą być duże. Presety onboardingu = deterministyczne mapowanie, nie „AI”; zmiana układu tylko jako propozycja. Numeracja kolejności budowy = 1→13 jak kafle. `[A:03]`, `[A:07]`
- **Nawigacja:** `NawigacjaEkranu` z `href` jako prop (nie `usePathname`, żeby ekrany serwerowe nie wymagały "use client"); `KrokZMedia` renderuje jawny placeholder, nigdy wygenerowane zdjęcie; pola kreatora nigdy `disabled` do czasu zaznaczenia checkboxa. `[A:03]`, `[A:04]`
- **Pola `Pole`:** `id` z tekstu etykiety → w listach i blokach A/B nadawać jawne unikalne `id`. Ostrzeżenia z echa dla wielu napięć w jednej liście → tagować kodem (`${w.code}-${v}V`), inaczej duplikat `key`. `[A:04]`

## 7. Bezpieczeństwo, auth, PWA, mapy

- **CSP nonce-per-request** (od 16.09, naprawa błędu hydracji React #412 przy hash-CSP): `middleware.ts` generuje nonce (`crypto.randomUUID()`), `buildCsp(nonce)`, nagłówki `x-nonce` i `Content-Security-Policy` na WSZYSTKICH ścieżkach zwrotu; `next.config.mjs` bez CSP (statyczne nagłówki zostają); `app/layout.tsx` czyta `(await headers()).get('x-nonce')` dla własnych `<script>`. Dev: łagodniejsza CSP (HMR). `connect-src 'self' https://uldk.gugik.gov.pl`, `worker-src 'self' blob:`, `Permissions-Policy geolocation=(self)`. `[A:05]`, `[A:08]`
- **Supabase (szkielet):** `isSupabaseConfigured()` jedyne miejsce prawdy, middleware wyłączony bez konfiguracji; sesja tylko przez `@supabase/ssr` server-side — `createBrowserClient` usunięty (domyślnie `httpOnly:false`); `sessionCookieOptions()` {httpOnly:true, secure w prod, sameSite lax}; `safeNextPath()` przeciw open redirect; `useSearchParams` wymaga `<Suspense>`; usuwanie konta (18.8) przez `admin.ts` z `import "server-only"`, `SUPABASE_SERVICE_ROLE_KEY` bez `NEXT_PUBLIC_`; sign-out jako Server Action (kontrola Origin/Host). Włączenie logowania = klucze w `.env.local`, bez zmian kodu (do wykonania przez właściciela: projekt Supabase, migracja `0001_profiles.sql`, dostawcy OAuth; Apple Developer 99 USD/rok). Zależności zewnętrzne rozpoznawać PRZED pisaniem kodu. `[A:04]`, `[A:05]`
- **PWA/Service Worker:** `app/manifest.ts`, ręczny `public/sw.js` (bez next-pwa/Serwist), rejestracja zewnętrznym `register-sw.js`; dalszy rozwój SW (wariant C, D59) w sekcjach z końca września niżej; `docs/przyklady/pwa/` kopiować do repo dopiero przy faktycznej budowie PWA. Logo „Monogram OG” (tokeny `--primary` + `--werdykt-uwaga`) wdrożone 19.09. `[A:05]`, `[A:07]`, `[A:08]`
- **Moduł 1 (D22/D23, 23–24.09):** MapLibre GL + three.js/R3F; jądro w `lib/core/modules/lokalizacja/` (geometria słońca, skaner działki, analiza zacienienia, orientacja powierzchni — model Muneera wg JRC EUR 26075 po TD16: Warszawa 177°/38° vs PVGIS 177°/39°); PVGIS TMY przez własny Route Handler (`app/api/pvgis/tmy/route.ts`; JRC zakazuje wywołań AJAX, brak CORS; offset czasu rekordu = HH:00 + `irradiance_time_offset`), ULDK bezpośrednio z przeglądarki (CORS `*`; „-1 brak wyników” przy HTTP 200; MULTIPOLYGON odrzucany jawnie; `GetBuildingByXY` pokrycie niepełne); worker MapLibre kopiowany skryptem `kopiuj-maplibre-worker.mjs` (predev/prebuild, w .gitignore); strona nie importuje statycznie z modułu ładowanego `next/dynamic`; wyniki ciężkie (E3 ~0,15 s, E4 ~2,5 s) liczone w Web Workerze; synt. dane godzinowe próbkować w HH:30. TD14–TD19 i ich stan: `dlug-techniczny.md`. `[A:08]`

## 8. Standard i synchronizacja (Y.6)

- **Procedura:** `git fetch` klona `new-app-standards` PRZED odczytem `AKTUALIZACJE.md` (nieodświeżony klon = fałszywe „brak nowości”, zdarzyło się; klon bywał 25–273 commity za) → `merge --ff-only` → diff lokalnych plików NIETYKALNE vs poprzednia wersja źródła (czysty dryf = nic do stracenia) → zastosuj wg kategorii Y.8 (NIETYKALNE pełny nadpis, ADAPTOWALNE patch, LOKALNE tylko status) **bez pytania z góry** (v2.38) → checklista Y.9 raportowana → po sync `diff` całego `docs/standards/` ze źródłem i `grep -rln "v2_NN"` (trafienia tylko w historię; C.5: wskaźniki wersji punktowo, nigdy w historycznych wpisach) → Routine self-bind z `interwał_h`. Pytać właściciela tylko: plik poza 3 kategoriami, realny konflikt Y.2.2, treść LOKALNA wymagająca wiedzy projektu. Szablony (`README`, `*.template.md`, `CLAUDE.template.md`) nie dotyczą tego repo. Cykl adaptacyjny: start 12 h, ×1,5 do 48 h po zerze, reset po nowości (D24; lokalne ≤12 h z D21 zastąpione, zgodne z GOD BOOK 2.32+). Y.11 (audyt zgodności KODU) osobno, na żądanie. `[A:02]`, `[A:08]`
- **Wkład wraca szybko:** wielojęzyczność, CSP nonce, 18.5 (HttpOnly/Origin), 9.0a, 15.7a skonsolidowane w ≤1 dzień. Stale statusy 🔎 nowe weryfikować grepem po `inzynier-offgrid-pro` w świeżym `docs/standards/`. `[A:05]`, `[A:07]`

## 9. Odstępstwa, uproszczenia i decyzje właściciela, których nie wolno „naprawiać” z rozpędu

- Selektor języka bez filtra kompletności (23.09, do końca migracji). Klucze i18n/kody po polsku. Presety pulpitu deterministyczne. Ogrzewanie w M2/E1 bez domyślnej mocy (ręcznie). Rsi = 0,13 do czasu PKN (D54). Black Start `KROK-POZA-KOLEJNOSCIA` = critical tylko w M7/E5 (07.09; w M11 niezależne literały zostają warning). Ceny/kursy edytowalne. `FREE/PRO` nieprzypisane (D37). Szczegóły i otwarte pytania: `docs/lista-do-zrobienia.md`, `docs/przekazanie-nastepnej-sesji.md`, `rejestr-decyzji.md`.
- Dane LED (dawny Etap D w `napiecie-systemowe/constants.ts`, oznaczone komentarzem) czekają na moduł „Oświetlenie”; opracowanie DRAFT czeka na kartę katalogową taśm — nie proponować `R_taśmy_na_metr`. `[A:04]`

## Indeks archiwum

Pełny spis plików i sekcji: `docs/memory-archiwum/INDEKS.md`. Skrót:

| Plik | Okres / temat |
|---|---|
| `01-audyty-i-pierwsze-ekrany-wrzesien-05.md` | 05.09: audyty Część N, Dyrektywa #14, M11/A2+A5, M5/E6+E22, norma 5-52 (OCR) |
| `02-synchronizacja-ze-standardem-04-23-09.md` | 04–23.09: log synchronizacji Y.6/Y.9, CI/audit-gate, CSP, spór o limit Actions |
| `03-decyzje-i-uzasadnienia-cz1.md` … `cz3.md` | 29.08–13.09: start Etapu 1, wzorce A–H, pulpit, motyw/kolory, v0, kafle, M11, M4/M2/M3/M6/M8 ekrany, normy 5-52/5-54/4-41/4-43/7-712/EN 1991-1-3, D20 |
| `04-moduly-storage-i18n-pilotaz-logowanie-13-16-09.md` | 13–15.09: M5 partie, „Dobór napięcia” (M4/E2), autosave, pilotaż i18n, logowanie, strażnik i18n |
| `05-blad-procesowy-edycja-standardu-16-09.md` | 16.09: błąd procesowy, audyt, i18n EN/RU (wariant cookie, zastąpiony), 18.5/18.8, PWA/SW, CSP nonce, pierwsze narzędzie AI |
| `06-rollout-i18n-18-19-09.md` | 18–19.09: rollout i18n partie 2–19 |
| `07-zaleglosci-i-kafle-19-23-09.md` | 19–23.09: „Mój sprzęt”, autosave 114 ekranów, kafle 08–14, i18n client-side, CI/Actions, M5 29/29, asystent AI, M4 „Item 3”, Wampiry |
| `08-moduly-1-i-sync-24-09.md` | 23–24.09: Y.6 adaptacyjny, Moduł 1, TD14–TD19, narzędzia AI M1 |

---

# SEKCJE Z OSTATNICH 7 DNI (25.09.2026 i później — dosłownie, bez skrótów)

## Synchronizacja ze standardem — Y.6, automatyczne odpalenie Routine (25.09.2026, 10:57 UTC)

Pierwsze automatyczne odpalenie nowej Routine (`trig_01892Z45ThAi2T56PJRjQQAh`), zgodnie z
zaplanowanym `run_once_at`. Działanie samodzielne, bez udziału właściciela projektu.

**Krok 1:** przed dotknięciem lokalnego `main` wykonano `git fetch origin main` +
`git checkout -B main origin/main` — main był już aktualny (`fd684d9`, PR #150 z poprzedniego
sprawdzenia), żadna równoległa sesja nie scaliła nic w międzyczasie. `new-app-standards`:
`git fetch` + `git merge --ff-only` — 2 nowe commity, ale dotyczyły wyłącznie
`docs/projekty-downstream.md` (wewnętrzny plik roboczy sesji U.4 nad `new-app-standards`, nie
mirror żadnego pliku tego projektu) — commit źródła wprost potwierdza: *"inzynier-offgrid-pro
(Y.6 odświeżona do v2_38, wszystko już skonsolidowane)"*. GOD BOOK źródła bez zmiany nazwy pliku
(nadal `v2_38.md`), `AKTUALIZACJE.md` bez nowych wierszy od wczorajszego pełnego sync.

**Krok 2 — wynik: ZERO nowej treści.** Zweryfikowano wprost (`diff -rq`): `docs/standards/*`,
`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_38.md`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — wszystkie identyczne ze źródłem, zero różnic. Nic do zastosowania.

**Krok 3 (cykl adaptacyjny):** wczorajsze sprawdzenie zresetowało `interwał_h = 12`,
`licznik_zero_z_rzedu = 0` po pełnej synchronizacji. Dzisiejsze sprawdzenie nie znalazło nic nowego
→ `interwał_h = min(48, 12 × 1,5) = 18`, `licznik_zero_z_rzedu = 1`.

**Krok 4:** `update_trigger` na `trig_01892Z45ThAi2T56PJRjQQAh`, nowy `run_once_at` =
2026-09-26T04:58:00Z (+18h).

## Moduł 3 — pełne wyliczenie + start sesji budowy (25.09.2026)

**Znalezisko (Dyrektywa #14, ta sama klasa co luka 1.19):** 17 z 30 pozycji `Tresc_Modul_3_PV_Ekrany.md`
nie miało wiersza w `docs/rejestr-pokrycia.md` — sekcja "Moduł 3 — ekrany dodatkowe" z 04.09.2026
zapowiadała pełne wyliczenie jako "osobny, nie rozpoczęty krok", audyt N (05.09) złapał tylko PID.
Naprawione: nowa sekcja rejestru "Moduł 3 — pełne wyliczenie pozostałych pozycji źródła". Przy okazji
`mapa-wdrozenia.md` M3/M5 skorygowane (M5 29/29 od 20.09, mapa stała na 4/29) — reszta mapy nadal
z 07.09, pełna resynchronizacja dopisana do listy zadań. **Lekcja:** zapowiedź "pełne wyliczenie
później" w rejestrze to dokładnie ten stan, którego #14 zakazuje — przy starcie pracy nad modułem
najpierw grep nazw ekranów źródła w rejestrze, dopiero potem budowa.

**Decyzje właściciela projektu (25.09.2026):**
- **M3/E19 (degradacja paneli) — `⚠️ blocked`.** Źródło nie podaje modelu LID/LETID/PID; odrzucony
  też model gwarancyjny z karty katalogowej.
- **M3/E4 (liczba paneli) — zamiast 3 wariantów źródła drabinka okresów pokrycia** (propozycja:
  cze–sie / kwi–wrz / mar–paź / lut–lis / cały rok; `N = max_m(E_zapotrz,m / E_panel,m)`, miesiąc
  decydujący z danych lokalizacji). Szczegóły czekają na potwierdzenie — wtedy wpis D#.
- **M3/E9 (Złoty środek) — czeka.** Ustalone w rozmowie: z 3 krzywych tylko produkcja (silnik M1) i
  śnieg (PN-EN 1991-1-3 Tablica 5.2, `μ1 = 0,8` dla 0–30°, `0,8(60−α)/30` dla 30–60°, `0` od 60°) mają
  wzór; wiatr(kąt) wymaga PN-EN 1991-1-4 (brak w repo — wzór E6 nie zawiera kąta); brak wag
  łączenia. Przykład źródła "22° → −55% wiatru" niewyprowadzalny (rzut sin α: ok. −35%).

**Pułapka merytoryczna do zapamiętania (M3/E15, dane 2.30):** "TOPCon +5–8%, HJT +8–12% uzysku vs
PERC" — sprawność ogniwa to kWp z m², nie kWh z kWp. Różnica kWh/kWp wynika z γ, bifacjalności,
słabego światła, degradacji. Pokazywać jako dane źródła z 🔎, nigdy jako mnożnik w obliczeniu
(dotyczy też przyszłego Ekranu 27).

**Przejście nasłonecznienie → produkcja (M3/E1, E4, E20, E27):** silnik M1/E4 zwraca kWh/m²; kWh
wymaga PR instalacji — źródło go nie podaje → pole ręczne z podpowiedzią zakresu, bez domyślnego.

**[25.09.2026, po partii 1] Moduł 3 — 6 ekranów dobudowanych (E7, E12, E15, E21, E23, E25), 18/27 `done`.**
- **Echo z E13:** `obliczStrataPaneluPct` wyekstrahowane z `zacienienie-diody-bocznikujace` —
  E12 (wpływ diod bocznikujących) to ten sam fakt konstrukcyjny, nie nowa reguła; E12 nie ma
  własnego modułu domenowego ani narzędzia AI.
- **E15:** jedyne obliczenie to powierzchnia modułów z definicji STC; dane uzysku 2.30 z 🔎 (patrz
  wyżej). Nowe pliki narzędzi AI M3 testowane zbiorczo w `lib/ai/tools/__tests__/modul3-pv-tools.test.ts`
  — kolejne narzędzia M3 dopisuj tam, nie w osobnych plikach.
- **✏️ E21 — uzupełnienie eksperckie do potwierdzenia przez właściciela:** ostrzeżenie, że typowy
  mikroinwerter (falownik sieciowy) w off-gridzie wymaga sprzężenia AC z falownikiem wyspowym —
  źródło tego nie mówi, a rekomendacja "mikroinwertery przy cieniu" bez tego prowadzi do
  niedziałającej instalacji. Pełne 4 pola ✏️: `docs/rejestr-pokrycia.md`, wiersz Ekran 21.
- **Weryfikacja:** typecheck / lint (0 błędów, 2 ostrzeżenia `<img>` sprzed sesji) / i18n-guard (108
  modułów) / test 1248/1248 (+42) / build / audit:gate — czyste. `next start` + Playwright (390 px):
  6 nowych tras HTTP 200, interakcja na każdej, brak `⚠ [klucz]`; błędy konsoli tylko z
  `/_vercel/insights` (lokalnie nieobecny, niezwiązane). Poprawka po oględzinach: tabela E21 minWidth 480→320
  (na telefonie ukrywała kolumnę "Inwerter centralny").

## Licencje norm w publicznym repozytorium (25.09.2026)

**Problem (zgłoszony przez AI, do decyzji właściciela projektu):** repozytorium
`inzynier-offgrid-pro` jest **publiczne** (sprawdzone 25.09.2026), a `docs/zrodla/` zawiera PDF-y norm
chronionych prawem autorskim (np. PN-HD 60364-5-54 z nadrukiem "© Copyright by PKN") oraz pliki `.md`
z przepisaną treścią rozdziałów (np. `norma-PN-EN-1991-1-3/01…05-*.md`). Norma PN-EN 1991-1-4
dostarczona 25.09.2026 miała dodatkowo nadruk licencji jednostanowiskowej PKN ("kopiowanie i
umieszczanie w sieci zabronione") i znak wodny serwisu z danymi osobowymi pobierającego — **ten PDF
świadomie NIE trafił do repo**, w repo tylko notatka robocza z liczbami
(`docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`).

**Stanowisko AI (nie porada prawna):** przepisanie całej normy do `.md` nie rozwiązuje problemu —
prawo autorskie chroni treść, nie format pliku. Bezpieczne w publicznym repo: krótkie notatki
własne — numer punktu/tablicy + liczby i wzory faktycznie używane w kodzie. Właściciel projektu:
jeśli przepisanie nie jest dopuszczalne, istniejące pliki zostają w repo do pierwszych
użytkowników/publikacji, potem oryginały na własny dysk. **Uwaga:** repo publiczne = już
opublikowane — najprostsze zabezpieczenie teraz to zmiana widoczności repo na prywatne
(Ustawienia GitHub). Zadanie z terminem "przed publikacją": `docs/lista-do-zrobienia.md`.
**Zasada od 25.09.2026:** nowa norma z nadrukiem licencji/danymi osobowymi → oryginał poza repo,
w `docs/zrodla/norma-*/00-INDEKS.md` tylko notatka robocza (punkty, tablice, liczby używane w kodzie).

## Stelaż regulowany i norma wiatrowa — ustalenia (25.09.2026)

- **Stelaż PV jako wiata jednospadowa (PN-EN 1991-1-4, Tablica 7.6)** — zaakceptowane przez
  właściciela projektu; w aplikacji oznaczane jako założenie (praktyka inżynierska, nie zapis normy).
- **Tablica 7.6 obejmuje tylko 0–30°**, 7.4.3 daje `cf = 1,80` dla płyty pionowej (90°). Przedział
  30–90° niepokryty normą — nie interpolować (Dyrektywa #1).
- **Śnieg w zakresie 0–30° nie różnicuje kątów:** `μ1 = 0,8` stałe (PN-EN 1991-1-3, Tablica 5.2) — w
  tym przedziale "złoty środek" (M3/E9) to w praktyce wybór energia vs wiatr.
- **Nowe wymaganie właściciela:** naziemny stelaż z ręcznie regulowanym kątem (zmiana kąta w ciągu
  roku, zimą większy) — D26 w `rejestr-decyzji.md`.
- **[25.09.2026] Właściciel projektu wybrał plan B:** istniejące PDF-y/`.md` norm zostają w repo do
  pierwszych użytkowników/publikacji, potem oryginały na jego dysk. Nowe normy: dalej notatki robocze
  (`docs/zrodla/norma-*/00-INDEKS.md` — punkty, tablice, wzory i liczby używane w kodzie), żeby
  kolejne sesje nie czytały 100+ stron od nowa. PDF PN-EN 1991-1-4 (dane osobowe w znaku wodnym)
  nadal poza repo.
- **[25.09.2026] M3/E9 — D27:** tor siły wiatru z PN-EN 1991-1-4 kompletny (notatka robocza, sekcja
  "Tor obliczeń siły wiatru"); balast tylko jako `m = Fw/g` do czasu PN-EN 1990 (`docs/normy-brakujace.md`).

**[25.09.2026] M3/E1 „Kąt pochylenia i azymut” — done.** Nowe wzorce do reużycia (15.19):
- **Od 25.09: każdy ekran potrzebujący lokalizacji + PVGIS TMY używa `useLokalizacjaProjektu()`
  (`lib/lokalizacja/use-lokalizacja-projektu.ts`) i `<SekcjaDanychNaslonecznienia>` — nie kopiuje logiki
  z M1/E4** (E4 M1 przepięty na nie w tej samej zmianie).
- **Tabela napromieniowania kąt×miesiąc** (`obliczTabeleNapromieniowania`, zadanie workera
  `tabela-napromieniowania`) — wejście dla M3/E4 (liczba paneli, D25), E9 (krzywa produkcji, D27), E20.
- `napromieniowanieMiesieczne` w `muneer.ts`; miesiąc liczony raz w `przygotujGodziny` (pole `miesiac`) —
  pierwsza wersja (`new Date()` w pętli) spowolniła testy M1 ponad limit 5 s — pułapka wydajności.
- **PVGIS niedostępny z kontenera** (polityka sieci: `re.jrc.ec.europa.eu` odrzucony przez proxy) —
  test w przeglądarce przez wstrzyknięcie syntetycznego roku do IndexedDB (`offgrid-storage`/`kv`,
  klucze `offgrid.pvgis-tmy.v1`, `offgrid.draft.lokalizacja-i-klimat`). Weryfikacja: tabela 169 ms,
  optimum grudzień 77° / czerwiec 19° (dane syntetyczne bezchmurne — wartości kWh zawyżone, tylko
  kontrola mechaniki). Pełny pakiet: 1261/1261 testów, build, audit, i18n-guard (109) — czyste.

**[25.09.2026] M3/E20 „Orientacja wschód-zachód” — done.** Pułapka znaleziona przy oględzinach w
przeglądarce (nie przez testy): rozkład dobowy przypisywał rekord godzinowy PVGIS w całości do godziny
zegarowej jego chwili — rekord z 11:50 czasu słonecznego (reprezentujący 11:20–12:20) szedł cały "przed
południe", co dawało 56% poranka dla paneli na południe zamiast ~50%. Naprawione w
`napromieniowanieDobowe` (podział proporcjonalny), test regresji potwierdzony w obie strony (bez
poprawki 55,6%, z poprawką < 1,5 p.p. od 50%). Lekcja: przy agregacji danych godzinowych do przedziałów
czasu zawsze sprawdzić, czy rekord to chwila czy przedział. Pełny pakiet: 1273/1273 testów, build, audit — czyste.


**[25.09.2026] M3/E9 „Złoty środek” — done (D27).** Właściciel potwierdził: PN-EN 1990 nie ma w repo ani
w paczce 25.09 (obie części Eurokodu 1 tylko się do niej odwołują — sprawdzone grepem w tekście norm).
- **Nowy wspólny moduł `lib/core/modules/pv/eurokod-1/`** (`wiatr.ts`, `snieg.ts`) — czyste funkcje
  norm, bez CalcResult. M3/E6 i M3/E2 (balast) mają liczyć wiatr STĄD, nie od nowa (echo D12).
- **Uzupełnienie notatki normy:** Tablica NA.1 ma pełny wzór dla strefy 3 przy A > 300 m
  (`0,30·[1+0,0006(A−300)]²·(20000−A)/(20000+A)`) i dla strefy 1 (`0,30·[1+0,0006(A−300)]²`) —
  wcześniejsza notatka odsyłała do oryginału; teraz wpisane w `00-INDEKS.md`.
- **Interpretacja zachowawcza:** 7.3 (3) pozwala interpolować liniowo „wartości pośrednie” — w kontekście
  φ; dla kąta α między węzłami (co 5°) bierzemy bardziej niekorzystny węzeł (jawne założenie).
- 90°: cf = 1,80 to siła POZIOMA — balast kg nie liczony (tarcie/wywracanie poza normą).
- Wysokość n.p.m. z metadanych PVGIS, gdy user nie wpisał (dane lokalizacji, nie zgadywanie).
- Na danych syntetycznych (Warszawa, strefa 1, teren III, 2 m, 12 m²): qp = 476 Pa, 30° → 10,3 kN →
  1048 kg. Przy wycenie energii 1 zł/kWh × 10 lat wygrywa 30° (energia przeważa koszt balastu 1 zł/kg).

**[25.09.2026] M3/E4 „Ile paneli potrzebujesz” — done (D25).** Pole „dodatkowe zużycie w sezonie
grzewczym” potwierdzone przez właściciela; miesiące grzewcze — wybór użytkownika (brak źródła na sezon).
- Moduł 2 NIE ma zapisanej sumy dobowego zużycia (brak draftu z bilansem) — E4 ma pole ręczne. Gdy powstanie
  ekran bilansu M2, podpiąć jako podpowiedź.
- `Math.ceil(x − 1e-9)` przy N — iloraz 12,000000001 z arytmetyki zmiennoprzecinkowej nie może dać 13.
- Deficyt: przy N rekomendacji; gdy nawet lato przekracza limit — przy pełnym limicie (ostrzeżenie).
- Status: `LP-DEFICYT-POZA-OKRESEM` to `info` (D13 — nie podnosi statusu).

**[25.09.2026] M3/E3 „Tracker czy stały stelaż” — done.** Zysk trackera 30–40% nie jako pole ręczne
(tak zapowiadał wiersz rejestru), tylko wynik dla obu granic zakresu — jak E23 (Dyrektywa #1). Stąd trzeci
werdykt „zależy”: gdy przy 30% wygrywa stały stelaż, a przy 40% tracker. Pułapka: `Math.floor(0.3/0.1)` = 2
(float) — dzielenie z `+1e-9`, test K na to. Napór trackera nieliczony (brak wzoru w źródle) — `info`, nie
`warning` (fakt ze źródła, nie ryzyko wynikające z danych użytkownika; D13).

**[25.09.2026] M3/E2 „Typ montażu” — done (6 trybów: 5 ze źródła + stelaż regulowany D26).** Każdy tryb —
osobny kalkulator w `lib/core/modules/pv/typ-montazu/` i osobny szkic UI (przełączanie nie gubi danych).
Decyzje: (1) pion porównany z najlepszym kątem stałym przy tym samym azymucie, miesiące zysku z danych — bez
sztywnej granicy „lato/zima”, której źródło nie definiuje; (2) próg „trawa/zaspa > 30 cm” zastąpiony geometrią
(przeszkoda wyżej niż dolna krawędź) — dosłowny próg przeczyłby fizyce przy panelach zawieszonych wysoko; (3)
tryby skośny/wielopołaciowy nie liczą napromieniowania od nowa — to samo zadanie workera co M1/E4, a draft M1/E4
czytany tylko do odczytu (`useOdczytDraftu`, jeden właściciel zapisu); (4) wiata: układy dwublokowe
(gilotynowe) — przyzwoite, ale nie dowiedzione optimum → jawne założenie; kierunek podziału zwraca domena
(`podzial`), UI go nie zgaduje; (5) stelaż na dachu płaskim liczony jak wiata — ostrzeżenie `warning` o
strefach krawędziowych i nośności dachu (poza modelem). Pułapka: `ulozPanele` — pętla cięcia musi dojść do
`i <= floor(L/a)` (reszta krótsza niż bok w orientacji 1 może zmieścić panel obrócony).

**[25.09.2026] M6 „Porównanie kosztów ogrzewania” (dawne 5.39 + D28) — done; potwierdzenia E15 🔎 i E21 ✏️.**
Pomysł właściciela „webasto + paliwa stałe” okazał się mieć oparcie w źródle: funkcja 5.39 (Biblia §6.27.13),
dotąd nieobecna w rejestrze (Część 2C `Tresc_Modul_6` ją tylko wymienia). Źródło nie podaje wartości
opałowych ani sprawności — wszystko wpis użytkownika; okres 10 lat jest ze źródła, więc wolno go wstawić jako
start pola (inaczej niż np. PR). Źródło z brakami nie blokuje porównania pozostałych (info zamiast INCOMPLETE
całości) — przy liście budowanej stopniowo to jedyny użyteczny tryb, i nadal bez wartości domyślnych.
**Pułapka (znaleziona i naprawiona):** `Pole`/`PoleSelect` budują `id` z etykiety — w powtarzanych kartach
(ta sama etykieta N razy) powstają zduplikowane `id`, etykiety wiążą się tylko z pierwszym polem (dostępność,
testy Playwright `getByLabel`). Naprawione tu, w M3/E2 (moc powierzchni) i w M1/E4 (korekty i powierzchnie
ręczne); przy każdym `.map()` z `Pole` podawać jawne `id`. Inne ekrany z listami `Pole` — do przejrzenia.

## Pull 25.09.2026 — dwa naprawione dryfy po PR #147–#151

Po `git pull` (14 commitów) pełny lokalny pakiet wykrył dwa dryfy (Y.2, naprawione od razu):

1. **Testy z timeoutem w pełnym pakiecie.** `orientacja-powierzchni.test.ts` — dwa nowe testy TD15
   pkt 2 ("przeszkoda od południa…", "kilka punktów powierzchni…") trwają ~3,7 s w izolacji, pod
   równoległym obciążeniem całego pakietu (4 rdzenie) przekraczały domyślne 5 s Vitest. W izolacji
   przechodziły, więc łatwo przeoczyć. Dodano `{ timeout: 30_000 }` — ten sam wzorzec, który już
   mają inne ciężkie testy w tym pliku. **Pułapka:** każdy test uruchamiający pełny przebieg
   godzinowy TMY (optimum/profil horyzontu) potrzebuje jawnego limitu — sprawdzaj pełnym `pnpm test`,
   nie tylko plikiem.
2. **Martwe linki do GOD BOOK.** Pełny sync Y.9 (24.09, v2_28→v2_38) zaktualizował `CLAUDE.md`,
   `SKILL.md`, `PROMPT_STARTOWY.md`, ale pominął `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`,
   `README.md`, `docs/lista-do-zrobienia.md` — poprawione. Historyczne `USTALENIA.md`/
   `ZASADY_APLIKACJI.md` i wpisy historyczne w tym pliku celowo bez zmian.

## Paczka `docs/zrodla/New-info/` przetworzona (25.09.2026)

Właściciel projektu poprosił o zajęcie się folderem `docs/zrodla/New-info/` (13 plików PDF)
wg standardowej procedury materiałów źródłowych (15.4). Rozłożone na 7 dedykowanych folderów
(`norma-IEC-62305/`, `materialy-Purmo-PN-EN-12831-ogrzewanie/`, `norma-PN-EN-1991-1-4-wiatr/`,
`norma-PN-82-B-02403/`, `norma-PN-EN-1990-eurokod-0/`, `norma-PN-EN-1995-1-1-eurokod-5-drewno/`,
`materialy-fizyka-budowli/`) — pełny opis per plik i rekomendacja co do dalszego losu (część do
`new-app-standards`, ogólnobudowlana, nie off-grid-specyficzna): `docs/zrodla/README.md`, sekcja
"Paczka New-info".

**Pytanie o pochodzenie zadane i rozstrzygnięte:** większość plików "document-download*" nosiła
stopkę "Downloaded by Dmitrij Szulga (...)" (Studocu) — zapytano właściciela wprost, czy to
problem z legalnością/prowieniencją źródła. **Odpowiedź: to własne konta/pobrania właściciela,
źródło potwierdzone jako w porządku** — nie stawiać tego pytania ponownie przy tych plikach.

**Duplikat znaleziony i usunięty (Y.2, nie decyzja — nadmiarowość):** `559094399-060364NHDD149-ES.pdf`
(UNE-HD 60364-7-712:2017 ES) był bajt-w-bajt identyczny (MD5) z już istniejącym
`docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf` (już przeczytany
w całości, użyty w kodzie M3/E22 05-07.09.2026) — usunięty zamiast tworzenia martwej kopii.

**OCR wykonany w tej sesji** (tesseract, pakiet pol+eng, 250 DPI) dla trzech dużych skanów bez
warstwy tekstowej: PN-EN 1991-1-4 (wiatr, 146 str.), "A Guide to BS EN 62305" (140 str.), Eurokod 0
PN-EN 1990 (120 str., częściowo natywny tekst w załącznikach). **Tylko wstępny spot-check jakości
OCR, nie pełna weryfikacja strona-po-stronie** (w przeciwieństwie do w pełni zweryfikowanego
Załącznika B normy PN-HD 60364-5-52) — przed użyciem którejkolwiek liczby w kodzie kalkulatora,
obowiązkowa weryfikacja wizualna względem oryginalnego PDF, zgodnie z zastrzeżeniem w każdym
`00-INDEKS.md`.

**Najbardziej wartościowa pozycja: `norma-IEC-62305/`** (ochrona odgromowa, metoda toczącej się
kuli, klasy LPL) — bezpośrednio uzupełnia istniejące `ochrona-przepieciowa-spd` i
`projekt-uziemienia` (M5, `docs/rejestr-pokrycia.md` wiersze 2 i 9), kandydat na nowy ekran M8
liczący strefę ochronną zwodu odgromowego. To poradnik producenta (Furse/Thomas & Betts), nie
sama norma — jak poradnik Purmo dla PN-EN 12831 — nie traktować jako tekst normatywny wprost.

**Nic z tej paczki jeszcze nie wykorzystane w kodzie.** Trzy pozycje (Eurokod 0, Eurokod 5 drewno,
fizyka budowli) ocenione jako prawdopodobnie poza rdzeniem tego projektu (ogólne budownictwo, nie
off-grid PV) — rekomendacja przeniesienia do `new-app-standards` jako generyczna biblioteka,
decyzja czeka na najbliższą sesję nad tym repo (zgodnie z prośbą właściciela: "zaznacz jakie pliki
są potrzebne").

## Weryfikacja OCR paczki New-info (25.09.2026, wieczór)

Na prośbę właściciela („sprawdź dokładnie, czy OCR był dobrze przeprowadzony”) — przed użyciem liczb
w kodzie. Gałąź OCR (`claude/laughing-faraday-lp6ytt`) była już scalona do `main` (PR #153, squash —
drzewa identyczne), więc poprawki na bieżącym `main`.

**Wynik: OCR NIE był bezbłędny** — tekst ciągły dobry, ale tabele, wzory i Załączniki krajowe w wielu
miejscach zniekształcone albo zgubione. Najgroźniejsze znaleziska (wszystkie poprawione):
- PN-EN 1991-1-4: **Tablica NA.1 bez wiersza strefy 2** (26 m/s), NA.2/NA.3 rozsypane.
- PN-EN 1990: **poprawka Ap1 (ψ2 śniegu 0,20 → 0) — w PDF zniszczona warstwa tekstu, OCR dał losowe znaki**;
  „≤” czytane jako „<” (zmienia znaczenie warunków).
- IEC 62305 (poradnik Furse): **Tablica 2.3 (prądy SPD) zgubiona całkowicie**, wzory nieczytelne.
- Poradnik Purmo: **wszystkie 39 wzorów rozsypane** (tekst natywny, ale wzory składane z pojedynczych znaków).

**Metoda (do reużycia):** (1) kompletność stron; (2) drugi niezależny OCR (tesseract 5, 300 DPI, `--psm 6`)
i porównanie liczb strona po stronie — wskazuje strony do obejrzenia; (3) hunspell (pl/en) z poprawką tylko
przy kandydacie jednoznacznym lub potwierdzonym drugim przebiegiem (pierwsza wersja bez tego ograniczenia
„poprawiała” poprawne słowa: „nia→nią”, „cos→coś” — wycofana); (4) odczyt wizualny ze skanem dla całego
zakresu używanego w projekcie; (5) tabele z geometrią sprawdzone arytmetycznie (Tablica 4.3 IEC:
promień = wysokość · tg kąta, 150 par zgodnych).

**Pułapki:**
- Font `Symbol` w PDF Purmo wyświetla „+” jak „−” — przepisanie wzoru z podglądu daje zły znak w (3.1),
  (7.6), (9.1). Rozstrzygają dane PDF (kod znaku), nie obraz.
- W Eurokodzie 5 kod U+F06C to λ (font Symbol) albo ℓ (font MT-Extra) — nierozstrzygalne z samego tekstu,
  zostawione jako `[λ|ℓ]`.
- Błędy w samych oryginałach (nie OCR) oznaczone `[sic]`/`⚠️`, nie poprawiane: Rys. 7.20 i (A.5)/(A.12)
  w PN-EN 1991-1-4, wzór (3.17) w poradniku Furse (literówka potwierdzona przykładem z tego samego poradnika).

**Wartości gotowe do kodu:** PN-EN 1990 Tablica A1.2(A) EQU — γG,inf = 0,90, γG,sup = 1,10, γQ = 1,50;
NB = bez zmian krajowych. PN-82/B-02403 Tablica 1 — strefy I–V: −16/−18/−20/−22/−24 °C.

**Korekty opisów z sesji OCR (nie decyzje, błędy oceny):** PN-EN 1991-1-4 ma odbiorców w kodzie (D27);
PN-EN 1990 jest 🔴 potrzebna, nie „wątpliwa”; PN-82/B-02403 nie ma listy miejscowości. Dwa foldery normy
wiatrowej (`norma-PN-EN-1991-1-4/` notatka, `…-wiatr/` pełny tekst) — połączone odsyłaczami; scalenie
(A) albo zostawienie (B) — pytanie do właściciela, bez odpowiedzi.
**[25.09.2026, uzupełnienie] Rozstrzygnięte — wariant A (scalenie).** Folder `norma-PN-EN-1991-1-4-wiatr/`
przeniesiony do `norma-PN-EN-1991-1-4/` (PDF, `01-tresc-ocr.txt`; dawny `00-INDEKS.md` dopisany bez
skrótów jako sekcja „Pełny tekst normy”). Wybrano ten folder, bo wskazują go kod (`eurokod-1/wiatr.ts`)
i D26/D27. Starsze wpisy z nazwą `…-wiatr/` zostawione jako historia (z dopiskiem w README źródeł).
Uwaga: PDF normy jest teraz w publicznym repo — sprawa licencji rozstrzygnięta wcześniej przez
właściciela (wpis „Licencje norm…”), nie wracać.

Szczegóły per plik: sekcje „Weryfikacja OCR (25.09.2026)” w `00-INDEKS.md` każdego folderu paczki.

## Synchronizacja ze standardem — Y.6 na polecenie właściciela (26.09.2026, ok. 04:00 UTC)

Świeży płytki klon `new-app-standards` (`aaabc19`, 25.09 23:16). `AKTUALIZACJE.md` — nowy wiersz 2026-09-25
(blok U.4: zero-waste ×7, ten projekt ×3). **Zastosowane wg Y.8:**
- *NIETYKALNE (pełny nadpis):* GOD BOOK `v2_38.md`→`v2_39.md` (B.5 — do startu aplikacji wszystkie oryginały
  w `docs/zrodla/`, po starcie do `new-app-standards`; N.1 — kompletność źródło→rejestr liczona mechanicznie),
  `docs/standards/` 00-INDEKS, 00-filozofia, 05, 08, 10, 11, 14, 16; `PROMPT_STARTOWY.md`. Pozostałe rozdziały
  i `docs/przyklady/i18n/*` — identyczne (`diff -rq`).
- *ADAPTOWALNE (patch odsyłaczy v2_38→v2_39):* `CLAUDE.md`, `.claude/skills/standards/SKILL.md`, `00_Biblia.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `README.md`, nagłówek `docs/lista-do-zrobienia.md` (wpisy historyczne
  i `rejestr-decyzji.md` bez zmian — C.5).
- *LOKALNE:* `docs/wklad-do-standardu.md` — 3 wpisy z 25.09 oznaczone ✅ skonsolidowane (N.1/14.1, B.5, 8.10).
- **Y.2 (dryf kodu od nowej reguły 8.10, naprawiony od razu):** `Pole`/`PoleSelect` budowały `id` z etykiety →
  teraz `useId()`, jawne `id` nadal ma pierwszeństwo. Nikt nie odwoływał się do starych `id` `pole-*` (grep).
- **Uwaga B.5:** reguła mówi „do startu aplikacji wszystkie oryginały w repo” — PDF PN-EN 1991-1-4 trzymany poza
  repo (plan B z 25.09) *może* teraz trafić do `docs/zrodla/` (sformułowanie `AKTUALIZACJE.md`: „może”).
  Decyzja właściciela — oryginału i tak nie ma w tej sesji.
- **Nowe reguły do przeglądu przy okazji (nie w tym zadaniu):** 10.9 (e2e na buildzie produkcyjnym — oględziny
  tej sesji już tak robione), 16.8 (rozruch aplikacji niezależny od języka).
- Cykl adaptacyjny: znaleziono nowość → `interwał_h = 12`, `licznik_zero_z_rzedu = 0`; Routine przestawiona na +12 h.

## Balast projektowy PN-EN 1990 (M3/E9, E2, E6) — D29 (26.09.2026)

- Wspólny `lib/core/modules/pv/eurokod-0/rownowaga.ts`: EQU (6.7), Tablica A1.2(A) — `γG,inf = 0,90`, `γQ,1 = 1,50`,
  NB „bez zmian krajowych”. **Wartości zweryfikowane wizualnie** (PyMuPDF → PNG, strony PDF 34, 40, 41, 71), nie
  tylko z OCR. `poppler`/`pdftoppm` w kontenerze brak — `pip install pymupdf` działa (Read na PDF wymaga pdftoppm).
- `m = γQ·Fw/(γG,inf·g)` = 1,667 × dawne `Fw/g`. Ciężar paneli/stelaża pominięty (po stronie bezpiecznej), cała
  siła jako pionowa. Przesuw/wywracanie — nadal nie (brak μ i punktu przyłożenia) → `ZS-BALAST-EQU-TYLKO-ODRYWANIE`
  (`warning`) zastąpił `ZS-BALAST-BEZ-WSPOLCZYNNIKOW` (klucz usunięty ze słowników).
- E6: balast z `F = 0,5ρv²ACd` (info: tylko dla szczytowego porywu, tor normowy w E2/E9) + opcjonalny „planowany
  balast” → twardy stop `NW-BALAST-NIEWYSTARCZAJACY` (źródło, lista twardych stopów M3) — dopisany do rejestru.
  Stary draft E6 bez nowego pola: `stan.balastPlanowanyKg ?? ""` (`usePersistedDraft` nie scala z wartościami
  początkowymi — pułapka przy dodawaniu pola do istniejącego szkicu).
- **Pułapka (złapana przez test):** wartość referencyjną wpisałem z pamięci zamiast skopiować wynik Pythona
  (169,947 vs 169,953) — test to wychwycił. Liczby referencyjne zawsze kopiować z wydruku skryptu.
- **28.09.2026 — masa paneli+stelaża (decyzja właściciela):** `balastProjektowyEquKg(F, g, G = 0)` →
  `max(0, γQ·F/(γG,inf·g) − G)`; równoważne `γG,inf·(G + m)·g ≥ γQ·F`. Wynik = balast **dodatkowy** (clamp 0).
  W E2/regulowany `max_miesięcy(m) − G` = `max_miesięcy(m − G)` (ta sama stała). Pole `masaPaneliStelazaKg`
  (`null` = pominięta → założenie `ZS-ZALOZENIE-MASA-WLASNA-POMINIETA`), wspólny helper
  `zloty-srodek/zalozenia.ts`. Stare szkice: `?? ""` przy odczycie (ta sama pułapka co wyżej).

## M6/E1 „Straty ciepła budynku” (dawne 5.1) — 26.09.2026

- Źródło opisuje silnik fizycznie („z różnicy temperatur i współczynników U, dla każdego miesiąca”) — zbudowane
  bez PN-EN 12831-1 (jej w repo nie ma; Purmo to poradnik z zastrzeżeniem „nie zastępuje normy”). θe stref I–V
  (−16…−24 °C) z **dwóch zgodnych źródeł**: PN-82/B-02403 Tablica 1 i Purmo Tabela 2.1 (zał. krajowy PN-EN 12831).
- `wspolczynnikStratWentylacyjnychWK` wyekstrahowany z M6/E12 (echo). Przegroda „inna” (grunt, nieogrzewane)
  wymaga temperatury — bez niej INCOMPLETE, nigdy ciche „powietrze zewnętrzne” (pierwsza wersja UI podsuwała
  `NaN` — odrzucone, rozróżnienie `zewnetrzna` przeniesione do domeny).
- Przykład źródła: 8 kW × 24 h = 192 kWh ✓; „COP 3 → 60 kWh” to 64 kWh — rozbieżność przykładu (Dyrektywa #5).
- **Zapis PVGIS TMY nie przechowuje temperatur** (tylko promieniowanie) — miesiące E1 z temperatur wpisanych
  ręcznie; automatyczne wypełnienie wymaga zmiany schematu zapisu (zadanie na liście).
- Rejestr M6 Część 1: 15 brakujących wierszy dodanych (20/20) — N.1. Część 2 (74 funkcje) — zadanie na liście.
- **Oględziny:** headless Chromium domyślnie `en-US` → teksty założeń po angielsku; z `locale: "pl-PL"` poprawnie.
  Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (115) / test 1362/1362 / build / audit:gate; `next start`
  + Playwright 390 px: 6 tras, brak `⚠ [klucz]`, brak zduplikowanych `id`, brak poziomego przewijania; 404 tylko
  `/_vercel/insights`. E1: 3 przegrody + wentylacja = 4,8 kW (ręcznie: 2800 + 2010 W ✓).

## N.1 dla pozostałych modułów + M6/E2, E7 + temperatury PVGIS + separator dziesiętny (26.09.2026)

- **N.1 mechanicznie:** `pnpm audit:n1` (`scripts/audit-n1-rejestr.mjs`) — zbiera `(dawne X.Y)` z sekcji modułu w Biblii,
  rozwija zakresy („8.23-28”, „8.29–8.36”) i listy („8.17,18,19”), porównuje z rejestrem i z plikiem `Tresc_*`. Wynik: 579/579.
  **Pułapka regexu (złapana):** lista po przecinku „8.2, 8.10” łapała „8” z następnego ID jako element listy — elementy listy
  muszą mieć `(?![\d.])`. Plik `Tresc_Modul_12` nie ma dawnego 8.8 (PWM vs MPPT, ekran i tak `done` z Biblii).
- **M6/E2:** C.O. z miesięcy E1 (średnia doba miesiąca), C.W.U. z `WSPOLCZYNNIK_KWH_NA_L_K` (`bojler-cwu`). Szkic E1 odczytywany
  przez `lib/ogrzewanie/draft-obciazenia-cieplnego.ts` (wydzielone z `page.tsx` — Next nie pozwala eksportować z pliku strony
  innych nazw). 50 l/osobę jako widoczna wartość startowa (źródło podaje liczbę, nie zakres).
- **M6/E7 — decyzja do potwierdzenia przez właściciela (✅🤖):** lista zadań zakładała „wymaga PN-EN ISO 14683 / 12831-1”.
  Zbudowane bez nich: Ψ wpisuje użytkownik (jak U w E1), wzór H = Σ Ψ·l z PN-EN 12831 (3.4) zweryfikowany w Purmo. Norma byłaby
  potrzebna tylko do *podpowiadania* Ψ (tablice) lub metody uproszczonej ΔU_tb. Jeśli właściciel woli czekać na normę — ekran
  zostaje, zmienia się tylko status. Ważne merytorycznie: Ψ zależy od konwencji wymiarów (zewnętrzne → narożniki ujemne) —
  założenie `MT-ZALOZENIE-WYMIARY`.
- **Temperatury PVGIS:** `T2m` było w odpowiedzi PVGIS od początku, adapter je pomijał. Teraz `temperaturyMiesieczneC` (miesiąc ze
  znacznika PVGIS, nie z czasu po offsecie). **`T2m` opcjonalne** — pierwsza wersja z polem wymaganym wysypała 8 testów narzędzi
  M1/M3 (atrapy PVGIS bez `T2m`); lepiej też produkcyjnie: brak temperatury nie może blokować nasłonecznienia. Średnie tylko przy
  komplecie 8760 godzin. Klucz zapisu bez zmian (`v1`), bez migracji — pole opcjonalne, ekran prosi o ponowne pobranie.
  Godzinowe temperatury NIE są zapisywane (tylko 12 średnich) — M7 (godziny poniżej progu) będzie wymagał rozszerzenia.
- **Separator dziesiętny:** `t()` zamienia „.”→„,” (PL/RU) w parametrach `number` i w tekstach będących w całości liczbą
  dziesiętną (`toFixed`); bez grupowania tysięcy i zaokrąglania. Teksty dla modelu AI (PL) też mają teraz przecinek.
- **Y.2 (naprawione od razu):** `ogrzewanie/obciazenie-cieplne` (E1) nie był na liście `check-i18n-guard` od budowy — dopisany.
- **Weryfikacja:** typecheck / lint (0 błędów, 2 ostrzeżenia `<img>` sprzed sesji) / i18n-guard (118) / test 1387/1387 / build /
  audit:gate / audit:n1. `next start` + Playwright 390 px, `pl-PL`, odpowiedź `/api/pvgis/tmy` podstawiona w przeglądarce (JRC
  zablokowane w kontenerze): E1 → wstaw temperatury → E2 (styczeń C.O. 70 kWh = 125,75 W/K × 23,2 K × 24 h ✓) → E7 (892 W =
  22,3 W/K × 40 K ✓); brak zduplikowanych `id`, poziomego przewijania, `⚠ [klucz]`; 404 tylko `/_vercel/insights`.

## Strażnik i18n — domknięcie migracji wszystkich modułów (26.09.2026)

- **Stan przed:** 39 modułów `lib/core/modules/*/*` (+5 podmodułów `wampiry-energetyczne/*`, których pierwszy skan nie
  widział) poza `MIGRATED_MODULES`. Z tego 9 było w pełni zmigrowanych (kody we wszystkich 3 słownikach), ale bez ochrony
  (`baterie/hierarchia-ladowania`, `napiecie-odciecia-a-zywotnosc`, `symulacja-ladowania-rozladowania`,
  `symulacja-miesiaca-zachmurzenia`, 5× wampiry), 10 to checklisty z pustymi `assumptions/warnings`, 13 zwracało gotowy tekst
  PL (14 miejsc), reszta to katalogi z samymi stałymi albo `eurokod-0/1` bez pliku silnika (strażnik nie ma czego sprawdzać).
- **Migracja 13:** 14 nowych kluczy PL/EN/RU, treść PL 1:1 z dotychczasowego tekstu. Tam, gdzie kod ostrzeżenia już
  istniał z innym tekstem, osobny klucz (`PORTECH-POJEMNOSC-NIEDODATNIA` ≠ `POJEMNOSC-NIEDODATNIA`;
  `KROK-POZA-KOLEJNOSCIA-ROZRUCH` — Black Start, `critical`, inny tekst niż `KROK-POZA-KOLEJNOSCIA`). Strony czytające
  `w.message` wprost → `w.message ?? t(w.i18nKey ?? w.code, w.params)`. **Pułapka:** `audyt-pozarowy/page.tsx` to Server
  Component — hook `useTranslate` tam nie działa; założenia przez kliencki `ZalozeniaLista` (ten sam wzorzec co `prognozy`).
  Ostrzeżenia audytu (`message` z szablonu z danymi `SAMPLE_AUDIT_ITEMS`) zostają — to dane demonstracyjne, nie tekst silnika,
  i strona ich nie wyświetla (pokazuje pozycje wprost z `SAMPLE_AUDIT_ITEMS`).
- **Luka strażnika (naprawiona):** nie widział `assumptions.push("…")` do lokalnej tablicy `string[]` — tak
  `porownanie-technologii` zwracał 2 polskie założenia. Dodana reguła AST dla `assumptions.push(literał|szablon)`.
- **Kompletność listy mechanicznie:** strażnik kończy się błędem, gdy katalog w `lib/core/modules` ma plik silnika
  (`calculator/warnings/validation.ts`), a nie ma go na liście — powtarzająca się luka (M6/E1 i 19 powyższych).
- **Weryfikacja:** typecheck / lint (0 błędów) / i18n-guard (150) / test 1387/1387 / build / audit:gate / audit:n1;
  `next start` + Playwright 390 px `pl-PL`: Black Start, demontaż ołów, połączenia elektryczne (krok poza kolejnością),
  porównanie technologii (0 i puste pole), audyt, prognozy, komunikacja BMS („inny”) — teksty widoczne, bez surowych kluczy.

## Resynchronizacja mapy wdrożenia + zduplikowane `id` (26.09.2026)

- **Zduplikowane `id`:** zadanie z 25.09 było już rozwiązane u źródła (`useId()` w `Pole`/`PoleSelect`, commit `f475302`),
  tylko wpis na liście nie dostał domknięcia. Potwierdzone skanem wszystkich 160 tras (stan domyślny + po dodaniu pozycji).
- **Dryf kolumny statusu w rejestrze (pułapka):** 13 wierszy miało „→ done” tylko w notatce, a w kolumnie statusu nadal
  `todo`/`blocked` (11× M3 z 25.09 i moje E2/E7 z 26.09). Każde liczenie po kolumnie zaniżało postęp. Zasada: przy zmianie
  statusu poprawiać **kolumnę** (aktualny stan) i dopisywać datę w notatce (historia) — jak w wierszu M6/E1.
- **Metryka mapy zmieniona z „wierszy done” na „ekrany docelowe”:** rejestr ma duplikaty między sekcjami (wzorce A–H,
  „po jednym ekranie”), więc wiersze zawyżały wynik (163 wiersze = 153 ekrany + 3 dodatkowe + 7 duplikatów). Mianowniki
  z podsumowań `Tresc_*`; M6 = 48 (20 + 2A 1 + 2C 26 + 2D 1), M12 = 43 (42 z `Tresc` + dawne 8.8 z samej Biblii), M13 = 2.
  Surowe liczenie: `pnpm rejestr:licz [moduł]` (`scripts/policz-rejestr.mjs`) — duplikaty i mianowniki nadal ręcznie.

## M6/E10 — Optymalizacja izolacji (26.09.2026)

- **Bez normy:** Rsi/Rse (PN-EN ISO 6946) nie są w repo, ale nie są potrzebne — dokładana warstwa jest oporem szeregowym,
  a 1/U obecnej przegrody już zawiera opory przejmowania: U' = 1/(1/U + d/λ). Pominięte łączniki mechaniczne i nieciągłości
  (założenie `IZOL-ZALOZENIE-WARSTWA-SZEREGOWA` — rzeczywiste U wyższe).
- **Oszczędność** z tego samego modelu miesięcznego co E1 (Σ max(0, θi − θm)·24·d); wymaga kompletu 12 miesięcy (część roku
  cicho zaniżałaby wynik → `INCOMPLETE`). Wynik w kWh ciepła, nie prądu (÷ COP — założenie).
- **🟡 „kolejny centymetr się nie zwraca”** — źródło nie daje progu; ocena tylko względem ceny ciepła wpisanej przez
  użytkownika (koszt krańcowy wariantu względem cieńszego wariantu tego samego materiału, tj. ta sama nazwa i λ).
- **Przykład źródła niespójny** (5000 zł / (300 kWh × 10 lat) = 1,67 zł/kWh, nie 0,20) — nieodtwarzany.
- **Pułapka testu przeglądarkowego:** `page.fill` na `input[type=number]` nie przyjmuje „0,5” (Playwright), w teście kropka.
- Następne w M6 wymagają decyzji: E8 (źródło: Σ m·c całego budynku; fizycznie pracuje warstwa wewnętrzna — PN-EN ISO 13786
  poza repo), E11 (🔴 „wysokie U i niskie g” bez progów liczbowych).

## M6/E8 — Pojemność cieplna budynku (26.09.2026)

- **Decyzja właściciela:** C = Σ ρ·A·d·c całych warstw (jak w źródle) + powietrze z kubatury E1, ze **stałym** ostrzeżeniem
  🟡 `POJC-CALA-MASA-ZAWYZA` (status zawsze `VALID_WITH_WARNINGS`): w dobowym wychładzaniu pracuje tylko warstwa wewnętrzna,
  więc τ i czas do zamarznięcia są zawyżone. PN-EN ISO 13786 właściciel dostarczy później — wtedy głębokość czynna
  (wpis 🔲 na liście).
- **Model:** jeden węzeł, C·dθ/dt = −H_zewn(θ − θe) − Σ H_j(θ − θj) → θ∞ = średnia ważona H, τ = C/H, wychładzanie
  wykładnicze. H z E1: Σ U·A przegród zewnętrznych + H_V; przegrody do gruntu/stref nieogrzewanych z ich stałą temperaturą.
- **Dane materiałowe** (ρ, c) tylko od użytkownika — źródło mówi „auto z Modułu 1”, ale M1 nie ma materiałów; brak tabeli
  w repo (nie wymyślane). Zakres sanity c 100–5000 J/(kg·K) łapie wpis w kJ.
- 🟡 źródła „podłogówka przy dużej bezwładności” bez progu — niewyzwalane; przykład C (18 kWh/K → 1 °C w 4 h) bez H i ΔT —
  nieodtwarzalny.
- **E11 odłożony** decyzją właściciela (progi 🔴 poda później).

## Moduł 11 (Montaż baterii) — opisy narzędzi AI, 20/20 kalkulatorów (26.09.2026)

- **Zakres.** Backlog z wpisu 20.09.2026 ("116 z 122 kalkulatorów bez opisu narzędzia AI",
  kolejność rolloutu 11→3→4→2→reszta) — Moduł 11 zamknięty jako pierwszy. Dodano 20 plików
  `lib/ai/tools/*-tool.ts` (Ścieżka A LiFePO4: 10, Ścieżka B kwasowo-ołowiowa: 10) i
  zarejestrowano w `lib/ai/pytaj-asystenta.ts` (import + tablica `NARZEDZIA`).
- **Rozbieżność liczby ekranów vs kalkulatorów (wyjaśniona, nie błąd):** Moduł 11 ma 23 ekrany
  (`docs/rejestr-pokrycia.md`), ale tylko 20 ma realny `calculator.ts` — trzy ekrany (A10
  `przechowywanie-recykling`, B11 `ratowanie-zasiarczenia`, B12 `przechowywanie-recykling-olow`)
  to Wzorzec C (czysta treść, bez funkcji liczącej, żadnego pola do zwalidowania) — świadomie
  pominięte w tym rollout-cie: rozdział 9 dotyczy narzędzi zwracających policzony wynik, a tu nie
  ma nic do policzenia (nie jest to luka wymagająca dopisania, tylko naturalna granica zakresu 9.3).
  Ekran B5 (`dobor-kabli-bezpiecznikow-olow`) ma osobne narzędzie, mimo że jest wzorcem "echo"
  Modułu 5 — wywołuje realną logikę domenową (`calculateDoborPrzekrojuKabla` +
  `calculateDoborBezpiecznikaRozlacznika`), więc kwalifikuje się jak każdy inny kalkulator.
- **Wzorzec 1:1 z istniejącymi narzędziami** (`pojemnosc-cieplna-tool.ts`, `mostki-termiczne-tool.ts`,
  `zloty-srodek-tool.ts`): `operationType: 'read'`, `requiresConfirmation: false`, handler zawsze
  deleguje do prawdziwego `calculateXxx` z `lib/core/modules/montaz-baterii/**`, ostrzeżenia/
  założenia przez `tekstyOstrzezen`/`tekstyZalozen` (i18n → PL). Dane bezpieczeństwa (napięcia
  ogniw, napięcie pakietu, gęstość elektrolitu, prąd zwarciowy, AIC bezpiecznika, docisk, rezystor
  pre-charge) opisane w `.describe()` jako "tylko od usera, nie zgaduj" — zgodnie z 9.1/9.2.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, 2 istniejące wcześniej
  ostrzeżenia `no-img-element` niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 3.

## Moduł 3 (Instalacja PV) — opisy narzędzi AI, 12 nowych + 13 już istniejących (26.09.2026)

- **Zakres.** Kolejny krok rolloutu 11→3→4→2→reszta. Z 24 podkatalogów `lib/core/modules/pv/*` z
  realnym `calculator.ts`, 13 miało już narzędzie AI działające na prawdziwym `calculateXxx` tego
  ekranu (`kat-i-azymut`, `liczba-paneli`, `mikroinwertery-vs-centralny`, `mikropekniecia-termiczne`,
  `powloki-antyrefleksyjne`, `technologie-paneli`, `tracker-vs-staly`, `typ-montazu`,
  `warunki-nadmorskie-pyliste`, `wschod-zachod`, `zloty-srodek` — kilka z nich zarejestrowanych pod
  nazwą narzędzia z innego ekranu, np. `zloty-srodek-tool.ts` i `typ-montazu-tool.ts` importują też
  `eurokod-1/wiatr`, ale wywołują właściwe `calculateZlotySrodek`/`calculateDachPlaski` itd. —
  zweryfikowane treścią pliku, nie samą nazwą, jak w zadaniu). Dodano 12 nowych plików
  `lib/ai/tools/*-tool.ts`: `dopasowanie-tablicy-falownika`, `konfigurator-stringow`,
  `napor-wiatru`, `niedopasowanie-paneli`, `ochrona-stringow`, `panele-bifacjalne`, `ryzyko-pid`,
  `straty-okablowanie-dc`, `straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`,
  `zacienienie-diody-bocznikujace` — zarejestrowane w `lib/ai/pytaj-asystenta.ts`.
- **Świadomie pominięty: `czystosc-i-snieg`.** Dane katalogowe (i18n modelu tekstowego wprost w
  polu, nie prosty `i18nKey`/`params`), tak samo jak `baterie/komunikacja-bms` i
  `baterie/porownanie-technologii` — udokumentowane jako poza zakresem migracji i18n już we
  wpisach z 19–26.09.2026 wyżej w tym pliku i w `docs/lista-do-zrobienia.md`; ten sam powód
  wyklucza go z tego rolloutu narzędzi AI (opisy narzędzia i tak musiałyby wyciągać gotowy tekst PL
  bez klucza i18n, co nie jest błędem tego ekranu, tylko jego świadomym stanem przejściowym).
  `eurokod-0`, `eurokod-1`, `typ-montazu` (ten ostatni ma już narzędzie, patrz wyżej) nie mają
  własnego `calculator.ts` — to funkcje pomocnicze/warianty wzorca reużywane przez inne ekrany, nie
  osobne ekrany kwalifikujące się do tego rolloutu wg treści zadania.
- **Wzorzec 1:1** z Modułu 11 (`montaz-mechaniczny-tool.ts` itd.): `operationType: 'read'`,
  `requiresConfirmation: false`, handler zawsze deleguje do prawdziwego `calculateXxx` z
  `lib/core/modules/pv/**`, ostrzeżenia/założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane
  bezpieczeństwa/katalogowe (Voc/Vmp/Imp, β, Tmin, Isc, I_MOD_MAX_OCPR, rezystancja złączki/kabla,
  prędkość wiatru, procent uzysku bifacjalnego) opisane w `.describe()` jako dane usera, nie do
  zgadywania. `konfigurator-stringow-tool.ts` używa `z.discriminatedUnion` (wejście kalkulatora to
  unia trzech trybów: szereg/równolegle/mieszany). `straty-zlaczki-mc4-tool.ts` ma osobną nazwę
  narzędzia (`policz_straty_na_zlaczkach_mc4`) niż istniejący `zlacza-mc4-tool.ts` — to dwa różne
  kalkulatory w dwóch różnych modułach (`pv/straty-zlaczki-mc4` vs `okablowanie/zlacza-mc4`), nie
  duplikat.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
  ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 4.

## Moduł 4 (Magazyn energii / baterie) — opisy narzędzi AI (26.09.2026)

- Kontekst: rollout opisów narzędzi AI wg kolejności 11→3→4→2→reszta (wpis 20.09.2026). Moduł 4
  (`lib/core/modules/baterie/`) miał 0 istniejących narzędzi AI przed tą sesją (sprawdzone grep-em
  po treści importu `calculateXxx` z `modules/baterie`, nie tylko po nazwie pliku) — cały rollout
  tego modułu to nowe pliki.
- **32 podkatalogi w `lib/core/modules/baterie/`, z czego 29 dostało nowe narzędzie AI**:
  `chlodzenie-latem`, `cold-c-rate`, `cold-cranking-amps`, `detekcja-doziemienia`,
  `detekcja-zwarcia-efuse`, `dobor-bezpiecznika-dc`, `dobor-pojemnosci`, `grzalki-bms-mroz`,
  `hierarchia-ladowania`, `kalibracja-soc`, `koniec-ladowania`, `long-term-storage`,
  `mixing-rownolegle`, `modul-ev`, `moment-dokrecania-srub`, `napiecie-odciecia-a-zywotnosc`,
  `obwod-precharge`, `ochrona-wilgoc`, `oplacalnosc-magazynu`, `pobor-wlasny-bms`,
  `pozycjonowanie-ogniw`, `second-life`, `slabe-ogniwo`, `soh-per-ogniwo`,
  `starzenie-degradacja`, `symulacja-ladowania-rozladowania`, `symulacja-miesiaca-zachmurzenia`,
  `szyny-zbiorcze-miedzypakietowe`, `topologia-bms`, `vehicle-to-home`.
- **Pominięte (3):**
  - `matryca-alarmow-bms` — brak `calculator.ts` (Wzorzec C, czysta treść) — poza zakresem zadania.
  - `komunikacja-bms`, `porownanie-technologii` — dane katalogowe/nie-i18n, świadomie wyłączone z
    tego samego powodu co analogiczne wyłączenia z i18n (wpisy 19–26.09.2026 wyżej w tym pliku).
- **Zatrzymane na jednym pliku, do zrobienia osobno — `napiecie-systemowe` (Ekran 2):** kalkulator
  wielo-etapowy (Etapy A–H materiału źródłowego "Dobór napięcia systemu Off-Grid v3.0") — kreator
  odbiorników z analizą jednoczesności, echo doboru przekroju kabla z `okablowanie/dobor-przekroju-
  kabla` (typy `Material`/`SposobUlozenia`), trzy równoległe kosztorysy 12/24/48V z kilkunastoma
  cenami edytowalnymi, pułapka konwersji 24V→48V. Kształt wejścia/wyjścia jest znacznie bardziej
  złożony i zależny od typów innych modułów niż reszta wzorca Modułu 4 — zmapowanie 1:1 bez ryzyka
  pomyłki w danych elektrycznych/kosztorysowych wymaga osobnej, dedykowanej sesji, nie tego
  rollout-u. Zgodnie z zasadą zadania („jeśli kształt jest niejasny — zatrzymaj się na tym jednym
  pliku, opisz problem, idź dalej”) — reszta modułu zbudowana, ten jeden ekran czeka.
- **4 ekrany wcześniej opisywane w zadaniu jako „blocked/todo, cross-modułowe” — okazały się mieć
  już działający `calculator.ts`:** Symulacja czasu ładowania/rozładowania
  (`symulacja-ladowania-rozladowania`), Napięcie odcięcia a żywotność
  (`napiecie-odciecia-a-zywotnosc`), Hierarchia ładowania (`hierarchia-ladowania`), Symulacja
  miesiąca zachmurzenia (`symulacja-miesiaca-zachmurzenia`) — wszystkie cztery mają pełny, działający
  kalkulator (uproszczony wg deklaracji w komentarzach nagłówkowych, np. średnie moce zamiast
  pełnego profilu godzinowego z niebudowanych jeszcze Modułu 2/3, ale w pełni obliczalny z danych
  wejściowych usera). Zgodnie z dosłownym brzmieniem zadania („pomiń TYLKO jeśli nie mają jeszcze
  `calculator.ts`”) — zbudowane razem z resztą modułu, nie pominięte.
- **Wzorzec 1:1** z Modułów 11/3: `operationType: 'read'`, `requiresConfirmation: false`, handler
  zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/baterie/**`, ostrzeżenia/
  założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane bezpieczeństwa (napięcia/prądy/rezystancje
  zmierzone, temperatury ogniw, AIC bezpiecznika, zdolność łączeniowa tranzystorów BMS, obecność
  zabezpieczeń przed doziemieniem) opisane w `.describe()` jako dane WYŁĄCZNIE od usera/pomiaru/BMS
  — model nigdy ich nie zgaduje. `hierarchia-ladowania-tool.ts` i `moment-dokrecania-srub-tool.ts`
  mają kalkulatory bez `unit`/liczbowego wzoru (klasyfikator dyskretny / checklista) — output nadal
  pełny `CalcResult` (status, ew. ostrzeżenia/założenia), zgodnie z kontraktem.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
  ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 2. `napiecie-systemowe` (Ekran 2, Moduł 4) zostaje jako
  jawny dług do domknięcia osobno.

## Moduł 2 (Zapotrzebowanie) — opisy narzędzi AI (26.09.2026)

Kolejność rolloutu 11→3→4→2→reszta (wpisy 20–26.09.2026 wyżej): po Module 4 zrobiony Moduł 2
(Zapotrzebowanie energetyczne). 16 z 17 podkatalogów `lib/core/modules/zapotrzebowanie/*` miało
`calculator.ts` — dla wszystkich 16 zbudowano nowe narzędzie AI (`lib/ai/tools/*-tool.ts`), żaden
ekran Modułu 2 nie miał wcześniej narzędzia (jedyny istniejący plik referencyjny modułu,
`kalkulatory-pomocnicze-tool.ts`, powstał w sesji pilotażowej i18n, nie w tym rolloucie):
`systemy-podtrzymania-zycia` (Ekran 1), `urzadzenia-zmienne` (Ekran 3), `liczba-domownikow`
(Ekran 4), `profil-astronomiczny` (Ekran 5, tylko część astronomiczna — profil godzinowy
świadomie nie zbudowany, patrz komentarz w `input.ts`), `sezonowosc` (Ekran 6), `dni-autonomii`
(Ekran 7), `moc-pozorna-cosfi` (Ekran 8, podpunkt 1 — prądy rozruchowe/współczynnik jednoczesności
poza zakresem), `pobor-wlasny-falownika` (Ekran 9), `sprawnosc-inwertera-niskie-obciazenie`
(Ekran 10), `przetwornice-dcdc` (Ekran 11), `load-shedding` (Ekran 12), `bufor-rozbudowe`
(Ekran 13), `architektura-fazowa` (Ekran 14 — bez werdyktu ok/uwaga, źródło nie podaje progu
liczbowego, opisane w `.description`), `kategorie-specjalne` (Ekran 15), `agregat-pradotworczy`
(Ekran 17), `bojler-cwu` (Ekran 2).

**Świadomie pominięty: cały `wampiry-energetyczne/`** (5 podmodułów: `automatyzacja`,
`katalog-urzadzen`, `pomiar-mocy-jalowej`, `rekomendacje-sprzetowe`, `symulacje-i-raporty` —
wszystkie mają `calculator.ts`) — zgodnie z jawnym poleceniem zadania: to osobna, znacznie
większa sesja (24 funkcje wg backlogu), nie rollout narzędzi AI dla prostego wzorca reszty
Modułu 2. Sprawdzony wpis z 19.09.2026 potwierdza, że to świadomie odłożony moduł zbiorczy — nie
odblokowany do dziś, więc pominięty w całości bez próby zmapowania.

Wzorzec 1:1 z Modułów 11/3/4: `operationType: 'read'`, `requiresConfirmation: false`, handler
zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/zapotrzebowanie/**`, ostrzeżenia/
założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane, które źródło świadomie nie podaje jako
wartość domyślną (ΔT bojlera C.W.U., cos φ, sprawność przetwornicy/falownika/inwertera, granice
sezonu, moc "ogrzewanie" w Survival Core) opisane w `.describe()` jako WYŁĄCZNIE od usera — model
nigdy ich nie zgaduje. `dni-autonomii-tool.ts` i `profil-astronomiczny-tool.ts` mają pola opcjonalne
(wzorzec "echo"/podgląd) mapowane na `0`/`false` w handlerze, zgodnie z konwencją "0 = pominięte"
tych kalkulatorów.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
`pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).

**Następny w kolejności rolloutu:** reszta modułów spoza 11/3/4/2 wg backlogu. `napiecie-systemowe`
(Ekran 2, Moduł 4) i cały `wampiry-energetyczne` (Moduł 2) zostają jako jawny dług do domknięcia
osobno.

## Moduł 5 (Okablowanie) — opisy narzędzi AI (26.09.2026)

Pierwszy z "reszty" modułów po zakończeniu kolejki 11→3→4→2 (wpis wyżej). `lib/core/modules/okablowanie/`
ma 25 podkatalogów z `calculator.ts` (0 podkatalogów Wzorca C/informacyjnych bez `calculator.ts` w
tym module — inaczej niż sugerował ogólny backlog "reszty", tu wszystkie 25 ekranów mają jądro
obliczeniowe). 5 z 25 już miało narzędzie AI z wcześniejszych sesji (`zlacza-mc4`,
`przepust-powietrza`, `projekt-uziemienia`, `monitorowanie-izolacji-imd`, `normy-i-certyfikaty`) —
sprawdzone przez faktyczny import `calculateXxx` w treści pliku narzędzia, nie tylko po nazwie
(dwa inne pliki, `straty-zlaczki-mc4-tool.ts` i `sekwencja-montazu-tool.ts`, tylko wspominają
"okablowanie" w komentarzu/nazwie pola — nie importują niczego z tego modułu, sprawdzone i
odrzucone). Dla pozostałych 20 zbudowano nowe narzędzia (`lib/ai/tools/*-tool.ts`):
`analiza-zwarciowa` (Ekran 12), `dobor-bezpiecznika-rozlacznika` (Ekran 6), `dobor-izolacji-kabla`
(Ekran 28), `dobor-mocy-falownika` (Ekran 7), `dobor-przekroju-kabla` (Ekran 1, mega-Doradca z
tabelami PN-HD 60364-5-52), `glowna-szyna-wyrownawcza` (Ekran 10), `laczenie-cu-al` (Ekran 4),
`ochrona-odwrotna-polaryzacja` (Ekran 15), `ochrona-przed-dotykiem` (Ekran 17),
`ochrona-przed-gryzoniami` (Ekran 25), `ochrona-przepieciowa-spd` (Ekran 2),
`optymalizacja-trasy-kabla` (Ekran 26, wzorzec echo — TCO liczony realnymi stratami z
`dobor-przekroju-kabla`, nie osobnym wzorem), `oznakowanie-obwodow` (Ekran 20),
`peszle-koryta-rurki` (Ekran 24), `pomiary-powykonawcze` (Ekran 29), `puszki-polaczeniowe`
(Ekran 27), `string-box` (Ekran 22), `szyny-zbiorcze-polaczenia` (Ekran 3, tylko dolna sekcja E —
checklist momentów dokręcania, górna sekcja D dobór przekroju szyny świadomie niezbudowana w
jądrze), `uziemienie-funkcjonalne-ochronne` (Ekran 11), `wylaczniki-nadpradowe-dc` (Ekran 14),
`wylaczniki-rcd` (Ekran 16).

Wzorzec 1:1 z Modułów 11/3/4/2: `operationType: 'read'`, `requiresConfirmation: false`, handler
zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/okablowanie/**`, ostrzeżenia/
założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane wysokiego ryzyka elektrycznego (napięcie/
rezystancja wewnętrzna baterii, Isc panelu, prąd zwarciowy, AIC zabezpieczeń, Voc zimowe stringu,
rezystancje/czasy zmierzone przy odbiorze) opisane w `.describe()` jako pochodzące WYŁĄCZNIE z
karty katalogowej/pomiaru/projektu instalacji — model nigdy ich nie zgaduje. Kalkulatory typu
checklist (`glowna-szyna-wyrownawcza`, `ochrona-przed-dotykiem`, `oznakowanie-obwodow`,
`szyny-zbiorcze-polaczenia`) i klasyfikatory bez wzoru liczbowego (`ochrona-odwrotna-polaryzacja`,
`ochrona-przed-gryzoniami`, `ochrona-przepieciowa-spd`, `peszle-koryta-rurki`,
`puszki-polaczeniowe`, `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`) mają
uproszczony output (bez pól, których źródłowy `calculator.ts` też nie ma), zgodnie z kontraktem
`AiToolDefinition` — nadal pełny status/ostrzeżenia gdzie kalkulator je zwraca.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
`pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK),
`pnpm audit:gate` (OK, brak podatności high/critical).

**Następny w kolejności rolloutu:** Moduł 1 (Lokalizacja).

## Rollout opisów narzędzi AI — Moduł 1 (Lokalizacja), 26.09.2026

Sprawdzono `lib/core/modules/lokalizacja/*` (5 podkatalogów). Wynik: **0 nowych plików** —
Moduł 1 jest już w pełni pokryty albo świadomie poza zakresem, bez potrzeby żadnej zmiany kodu.

- `skaner-dzialki`, `analiza-zacienienia`, `orientacja-powierzchni` — narzędzia AI już istniały
  z sesji 24.09.2026 (`lib/ai/tools/skaner-dzialki-tool.ts`, `analiza-zacienienia-tool.ts`,
  `orientacja-powierzchni-tool.ts`), zweryfikowane treścią (realny import `calculateXxx` z
  odpowiedniego `calculator.ts`) i już zarejestrowane w `NARZEDZIA` (`lib/ai/pytaj-asystenta.ts`).
  Wzorzec 1:1 z resztą rolloutu, `analiza-zacienienia`/`orientacja-powierzchni` poprawnie
  pobierają 8760 rekordów PVGIS TMY po stronie serwera (handler), model dostaje tylko
  podsumowanie — nie zmieniano tego wzorca.
- `lokalizacja-i-klimat` (Ekran 1, "GPS i dane klimatyczne") — ma `calculator.ts`, ale bez
  jądra obliczeniowego: to ekran czysto infrastrukturalny (zapis współrzędnych/temperatury
  minimalnej wpisanych ręcznie przez użytkownika, `status: zapisano: boolean`, sam plik mówi
  wprost "Bez silnika obliczeniowego"). Świadomie pominięty — narzędzie AI nie miałoby nic do
  policzenia (user i tak podaje gotowe liczby), a 9.1–9.3 dotyczy sytuacji, gdy model inaczej
  policzyłby sam; tu nie ma nic do liczenia.
- `geometria-slonca` (`pozycja-slonca.ts`) — potwierdzone `grep`: to wewnętrzna biblioteka
  matematyczna (pozycja Słońca), reużywana przez `analiza-zacienienia`, `orientacja-powierzchni`
  i Moduł 3 (`wschod-zachod`, `kat-i-azymut`) — bez własnego ekranu/UI z sensownym wejściem od
  usera. Pominięta jako funkcja pomocnicza, nie osobny "ekran"; jej logika jest już pośrednio
  dostępna przez narzędzia AI modułów, które z niej korzystają.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170
plików, 1408 testów, zero regresji), `pnpm build` (OK).

**Następny w kolejności: Moduł 6 (Ogrzewanie).**

## Rollout opisów narzędzi AI — Moduł 6 (Ogrzewanie), 26.09.2026

Sprawdzono `lib/core/modules/ogrzewanie/*` (15 podkatalogów). 6 ekranów (`koszty-ogrzewania`,
`obciazenie-cieplne`, `zapotrzebowanie-co-cwu`, `mostki-termiczne`, `optymalizacja-izolacji`,
`pojemnosc-cieplna`) już miało narzędzie AI z sesji 26.09.2026, zweryfikowane realnym importem
`calculateXxx` w `lib/ai/tools/*-tool.ts` i obecnością w `NARZEDZIA` (`lib/ai/pytaj-asystenta.ts`)
— pominięte, nie duplikowane.

**7 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera** (wzorzec 1:1 z
`mostki-termiczne-tool.ts`/`pojemnosc-cieplna-tool.ts`), zarejestrowane w `NARZEDZIA`:
`bufor-ciepla-tool`, `cop-pompy-ciepla-tool`, `infiltracja-powietrza-tool`,
`kociol-elektryczny-tool`, `pompy-cyrkulacyjne-tool`, `ryzyko-niskiego-napiecia-tool`,
`wentylacja-odzysk-ciepla-tool`.

**Pominięte (2, brak `calculator.ts` — Wzorzec C, czysta treść):** `halas-i-wibracje` (tylko
`constants.ts`), `ryzyko-zamarzniecia-dolnego-zrodla` (tylko `constants.ts`).

Uwagi merytoryczne per narzędzie (żeby nie zgadywać przy przyszłej rozbudowie):
- `infiltracja-powietrza-tool` — liczy tylko podstawową fizykę strat wentylacyjnych (Q =
  n·V·ρ·cp·ΔT/3600); poprawa "8% po uszczelnieniu" z przykładu źródła świadomie NIE jest w
  `calculator.ts`, więc narzędzie też jej nie liczy — zgodnie z zadaniem "buduj narzędzie dla
  tego, co realnie liczy dzisiejszy calculator.ts".
- `wentylacja-odzysk-ciepla-tool` — analogicznie: tylko podstawowy bilans cieplno-elektryczny
  (E3), bez projektu strumieni per pomieszczenie (dawne 5.23) i bez logiki bypassu letniego
  (dawne 5.24) — obie świadomie poza `calculator.ts` (brak wzoru w źródle).
- `ryzyko-niskiego-napiecia-tool` — napięcie systemu off-grid jest polem ręcznego wpisu (nie
  wyprowadzanym z SoC baterii), bo krzywa rozładowania jest specyficzna dla producenta ogniw i
  nie ma jej w aplikacji — `.describe()` to podkreśla.
- `bufor-ciepla-tool`, `cop-pompy-ciepla-tool`, `kociol-elektryczny-tool`,
  `pompy-cyrkulacyjne-tool` — proste wzory jednorodne (mnożnik/dzielenie/różnica), bez pól
  specjalnych do odnotowania.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji — kalkulatory `lib/core/modules/ogrzewanie/**` nietknięte),
`pnpm build` (OK), `pnpm audit:gate` (OK, brak podatności high/critical).

**Następny w kolejności: Moduł 8 (Bezpieczeństwo).**

## Rollout opisów narzędzi AI — Moduł 8 (Bezpieczeństwo), 26.09.2026

Sprawdzono `lib/core/modules/bezpieczenstwo/*` — 3 podkatalogi, wszystkie z `calculator.ts`, żaden
nie miał wcześniej narzędzia AI (zweryfikowane brakiem importu z `modules/bezpieczenstwo/` w
`lib/ai/tools/*-tool.ts`). Zbudowane od zera i zarejestrowane w `NARZEDZIA`:
`ups-krytyczny-tool` (Ekran 6 — dobór sprzętowy UPS krytycznego, `calculateUpsKrytyczny`),
`dogrzewanie-paliwem-stalym-tool` (Ekran 2 — bezpieczeństwo pożarowe pieca/kotła na paliwo stałe,
`calculateDogrzewaniePaliwemStalym`), `audyt-pozarowy-tool` (Ekran 11 — podsumowanie audytu
pożarowego z listy pozycji, `calculateAuditPozarowy`).

Uwagi merytoryczne (dane wysokiego ryzyka bezpieczeństwa — dla przyszłej rozbudowy):
- `ups-krytyczny-tool` — moc każdego urządzenia krytycznego (`powerW`) oraz pojemność/napięcie
  akumulatora UPS muszą pochodzić wyłącznie od usera; `constants.ts` źródła jawnie mówi, że
  źródło NIE podaje mocy żadnego urządzenia z domyślnej listy — `.describe()` to podkreśla.
- `dogrzewanie-paliwem-stalym-tool` — `maNawiewPowietrzaDoSpalania` i `maCzujnikCo` to `boolean`
  bez wartości domyślnej „tak” w samym `input.ts` domeny; opis narzędzia dodatkowo zaznacza, że to
  dane bezpieczeństwa życia i nigdy nie wolno ich domyślnie zakładać jako `true`. Brak czujnika CO
  jest twardym stopem już w `warnings.ts` domeny — narzędzie tylko przekazuje ten wynik dalej.
- `audyt-pozarowy-tool` — `calculateAuditPozarowy` (Wzorzec G, ekran raportowy bez pól do
  wypełnienia) przyjmuje gotową listę pozycji ze statusem `ok`/`warning`/`critical`; opis narzędzia
  jasno mówi, że status musi pochodzić z realnej kontroli/odczytu czujnika, nie z domysłu modelu —
  narzędzie samo niczego nie "sprawdza", tylko liczy podsumowanie z dostarczonych danych.

Pominiętych 0 — wszystkie 3 podkatalogi Modułu 8 mają `calculator.ts`.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji), `pnpm build` (OK).

**Następny w kolejności: Moduł 9.**

## Rollout opisów narzędzi AI — Moduł 7 (stress-test)/9 (ESP32)/12 (mobilny), 26.09.2026 — ZAMYKA CAŁY ROLLOUT

Ostatnia część rolloutu "opisy narzędzi AI dla kalkulatorów" (backlog 20.09.2026, punkt 7).
Sprawdzone trzy pozostałe podkatalogi `lib/core/modules/*` bez wcześniejszego narzędzia
(zweryfikowane brakiem importu z ich ścieżek w `lib/ai/tools/*-tool.ts`): `stress-test/`
(`procedura-black-start`, `wind-chill`), `esp32/` (`katalog-czujnikow`), `kalkulator-mobilny/`
(`dobor-regulatora-pwm-mppt`, `tryb-uproszczony`). Wszystkie 5 miało `calculator.ts` — 5 nowych
plików `lib/ai/tools/*-tool.ts` zbudowanych od zera i zarejestrowanych w `NARZEDZIA`:

- `procedura-black-start-tool` — Ekran 5, M7. **Uwaga krytyczna:** `KROK-POZA-KOLEJNOSCIA` to
  twardy stop `level: "critical"` (decyzja właściciela 07.09.2026) — opis narzędzia i handler
  zwracają go z tą samą wagą co UI, bez łagodzenia. Wejście to wyłącznie lista ID kroków
  potwierdzonych przez usera.
- `wind-chill-tool` — Ekran 17, M7. Wzór NWS ważny tylko dla T ≤ 10°C i V > 4,8 km/h — poza
  zakresem `OUT_OF_SCOPE`, `.describe()` zaznacza, że temperatura/wiatr to dane z pomiaru
  lokalizacji usera, nie zgadywane.
- `katalog-czujnikow-tool` — M9/ESP32, Katalog 1. Wzorzec H (podsumowanie stanu katalogu, bez
  wzoru fizycznego) — lista instancji czujników (typ/etykieta/lokalizacja) wyłącznie od usera.
- `dobor-regulatora-pwm-mppt-tool` — M12. Reguła twarda: klasa napięciowa paneli > akumulatora →
  MPPT wymagany (nie tylko zalecany), PWM fizycznie nie zadziała — opis to podkreśla.
- `tryb-uproszczony-tool` — Ekran 1, M12. Czas teoretyczny (bez sprawności/DoD/temperatury) —
  `.describe()` jasno mówi, że to szybka orientacyjna odpowiedź trybu mobilnego, nie pełny proces
  projektowy.

Pominiętych 0 — wszystkie 5 kalkulatorów tej ostatniej partii miało `calculator.ts`. Poza tymi
trzema katalogami sprawdzono, że nie ma żadnych innych nietkniętych podkatalogów w
`lib/core/modules/` (wszystkie pozostałe: `baterie`, `bezpieczenstwo`, `lokalizacja`,
`montaz-baterii`, `ogrzewanie`, `okablowanie`, `pv`, `zapotrzebowanie` — zamknięte w poprzednich
sesjach rolloutu).

**Tym samym cały rollout "opisy narzędzi AI dla kalkulatorów" (backlog 20.09.2026, punkt 7) jest
zamknięty dla wszystkich `lib/core/modules/*`** — z wyjątkiem świadomie pominiętych w
poprzednich sesjach (Wzorzec C bez `calculator.ts`, dane katalogowe/nie-i18n, moduły
wielo-etapowe zbyt złożone do bezpiecznego mapowania 1:1, `wampiry-energetyczne` jako osobna
większa sesja) — pełna lista uzasadnień: wpisy tej sekcji `docs/memory.md` od Modułu 11 do
Modułu 8 wyżej.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji), `pnpm build` (OK).

## `napiecie-systemowe` — dług z Modułu 4 domknięty (26.09.2026)

Ekran 2, Moduł 4 (`lib/core/modules/baterie/napiecie-systemowe/`), świadomie pominięty przy
rollcie Modułu 4 (wpis wyżej: "kalkulator wielo-etapowy A–H... zbyt złożony, żeby bezpiecznie
zmapować 1:1"). Po ponownym, dokładnym przeczytaniu całego katalogu (`calculator.ts`, `input.ts`,
`jednoczesnosc.ts`, `kosztorys.ts`, `warnings.ts`, `validation.ts`, `constants.ts`): funkcja
`calculateNapiecieSystemowe()` jest zwykłą czystą funkcją (jeden argument `NapiecieSystemoweInput`
→ jeden `CalcResult<NapiecieSystemoweResult>`), bez efektów ubocznych, bez stanu sesji, bez
wielokrokowego kreatora wymagającego wielu wywołań — "kreator odbiorników" (Etap B) w jądrze to po
prostu pole `odbiorniki: OdbiornikWybor[]` przekazywane w jednym wywołaniu. Dało się więc
zmapować 1:1 pojedynczym `z.object` (z zagnieżdżonym `z.array` dla `odbiorniki` i zagnieżdżonymi
obiektami dla `kable`/`kosztorysy`/`jednoczesnosc` w wyjściu) — bez zgadywania i bez upraszczania
kształtu. Zbudowano `lib/ai/tools/napiecie-systemowe-tool.ts`:
- Wejście 1:1 z `NapiecieSystemoweInput` (29 pól, w tym `odbiorniki[]`, 3×ceny per napięcie,
  dane trasy kabla Etapu C — wszystkie opisane jako pochodzące wyłącznie od użytkownika/pomiaru/
  cennika, nigdy nie zgadywane przez model). `zastosowanie`/`priorytet` (Etap A) zaznaczone w
  `.describe()` jako informacyjne — jądro ich nie używa do liczenia, ale nadal muszą pochodzić od
  usera, nie od modelu.
- Wyjście 1:1 z `NapiecieSystemoweResult`: prądy przy 12/24/48V, `jednoczesnosc` (analiza z
  `jednoczesnosc.ts`, nullable — pomijana gdy brak odbiorników), `kable` (echo ×3 z Modułu 5,
  `dobor-przekroju-kabla-tool.ts` jako wzorzec, ostrzeżenia kabla przepuszczone przez
  `tekstyOstrzezen`), `kosztorysy` (×3, `kosztorys.ts`), `kosztKonwersji24Do48Zl`.
- Handler woła bezpośrednio `calculateNapiecieSystemowe()` — nie duplikuje algorytmu
  jednoczesności ani kosztorysu.

Zarejestrowano w `lib/ai/pytaj-asystenta.ts` (obok `doborPrzekrojuKablaTool`, koncepcyjnie
powiązanego przez echo Etapu C). `pnpm typecheck`/`lint`/`check:i18n-guard` (152 moduły, bez
regresji)/`test` (170 plików, 1408 testów)/`build` — czyste.

## Synchronizacja ze standardem — Y.6, sprawdzenie automatyczne (26.09.2026, 16:40 UTC)

**Krok 1:** `new-app-standards` zaktualizowany `b68e561`→`35c84bd` (ff-only) — GOD BOOK `v2_38`→`v2_39` już
odebrany w porannej synchronizacji (04:00 UTC, patrz wyżej); nowe commity to wyłącznie ruch **U.4**
(projekt→standard, `docs/god-book/memory.md`/`docs/projekty-downstream.md` samego `new-app-standards`) —
standard nietknięty ("Standard nietknięty" wprost w treści commita `3958477`). `docs/wklad-do-standardu.md`
tego repo ma 4 pozycje `🔎 nowe` (e2e locale, OCR norm, audyt N.1 skryptem, strażnik i18n kompletności listy)
— zgodnie ze stanem po stronie `new-app-standards`, nic do zmiany statusu.

**Krok 2 — `diff -rq` na wszystkich plikach NIETYKALNE:** `docs/standards/*`, GOD BOOK `v2_39`,
`PROMPT_STARTOWY.md`, `docs/przyklady/i18n/*` — bez różnic. Zero nowej treści NIETYKALNE/ADAPTOWALNE do
zastosowania.

**Znalezisko wymagające zgłoszenia właścicielowi (nie rozstrzygnięte samodzielnie — Y.2.2/15.4):**
wpis z 24.09.2026 wyżej ("LOKALNE — znaleziona rozbieżność...") i wpis z 25.09.2026 ("Uwaga:
`docs/przyklady/pwa/`... świadomie NIE skopiowany. Projekt nie ma jeszcze kodu PWA/Service Workera")
opierały się na sprawdzeniu ograniczonym do `app`/`lib`. **To sprawdzenie było niepełne — projekt ma
działający, wcześniej zbudowany kod PWA/Service Workera, tylko poza `app`/`lib`:** `public/sw.js` (79
linii, ręczny SW bez biblioteki), `public/register-sw.js` (rejestracja przez `<script src>`, niezależna
od hydracji Reacta), `app/manifest.ts` — udokumentowane obszernie wcześniej w tym pliku (sekcja ok. l. 4384,
5363: własne logo/ikony PWA, decyzja właściciela). Nie zgaduję rozstrzygnięcia — dwie osobne sprawy dla
właściciela:
1. Wpis `AKTUALIZACJE.md` 24.09.2026 przypisujący temu projektowi zgłoszenie o Web Workerze MapLibre GL/
   `Permissions-Policy: geolocation=()` opierał częściowo swoje "nie znaleziono" na tej samej, niepełnej
   przesłance — nadal nieznaleziony w historii gita ani w `docs/wklad-do-standardu.md` tego repo, ale
   przesłanka "brak kodu SW/PWA" jako dowód na błędne przypisanie źródła jest teraz nieaktualna. Sama
   rozbieżność (MapLibre) pozostaje niezamknięta.
2. Standard ma od 24–25.09.2026 gotowy wzorzec Grupa B PWA/SW (`docs/przyklady/pwa/`, `docs/standards/05`
   5.8–5.12, `07` dopisek 7.3, `08` 8.11, `10` 10.8/10.9) zbudowany na konwencji App Router
   (`app/sw.js/route.ts`) — inny kształt niż istniejący tu ręczny `public/sw.js`. To nie jest NIETYKALNE
   ani proste "brakujący plik" (kategoria (a) Y.8 — nie mieści się jednoznacznie, bo dotyka już działającego,
   przetestowanego kodu, nie tylko dokumentacji) — **pytanie do właściciela, nie decyzja tej sesji:** czy
   porównać istniejący `public/sw.js`/`register-sw.js` z wzorcem `docs/przyklady/pwa/` (audyt zgodności,
   osobne zadanie, poza zakresem Y.6) i ewentualnie zmigrować, czy zostawić jak jest (świadome odstępstwo,
   wymagałoby wpisu D# w `rejestr-decyzji.md` z uzasadnieniem). Nic nie skopiowano, nic nie zmieniono w
   kodzie — to sprawdzenie tylko koryguje błędną przesłankę w dokumentacji.

**Cykl adaptacyjny:** realne znalezisko (błędna przesłanka w dokumentacji + pytanie do właściciela) →
`interwał_h` pozostaje `12` (już było 12 po porannej synchronizacji), `licznik_zero_z_rzedu = 0`. Routine
przestawiona na +12 h od tego sprawdzenia.

## Synchronizacja ze standardem — Y.6, sprawdzenie automatyczne (27.09.2026, 04:40 UTC)

**Krok 1:** `new-app-standards` `35c84bd`→`8eff570` (ff-only) — jedyny nowy commit to znów ruch **U.4**
(`docs/god-book/memory.md`/`docs/projekty-downstream.md` samego źródła, "2 nowe znaleziska (offgrid-pro)"
z perspektywy `new-app-standards`, dotyczy tych samych pozycji co poprzednio). `AKTUALIZACJE.md` bez
nowego wiersza (112 linii, jak przy poprzednim sprawdzeniu). Zero nowej treści NIETYKALNE/ADAPTOWALNE.

**Krok 2:** `diff -rq` na `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — bez różnic. `docs/wklad-do-standardu.md` — nadal 4 pozycje `🔎 nowe` (bez zmian
od poprzedniego sprawdzenia, zgodnie ze stanem po stronie `new-app-standards`) — nic do oznaczenia ✅.
Pytanie z poprzedniego sprawdzenia (SW/PWA — porównanie `public/sw.js` ze wzorcem `docs/przyklady/pwa/`,
oraz rozbieżność MapLibre w `AKTUALIZACJE.md`) wciąż otwarte, czeka na właściciela — nic nowego do
dodania.

**Krok 2b — zero nowej treści:** `interwał_h = min(48, 12 × 1,5) = 18` (poprzednio 12),
`licznik_zero_z_rzedu = 1`. Routine przestawiona na +18 h od tego sprawdzenia.

## Dwa pliki norm dodane do `docs/zrodla/` — mostki cieplne + dynamiczne charakterystyki (27.09.2026)

Właściciel projektu przesłał 2 pliki PDF, polecił dodać do repo + opisać, powiedzieć czego jeszcze
brakuje, i zapisać co pozostało do zrobienia dla innej sesji (OCR odłożony wprost do innej sesji).

- **PN-EN ISO 14683:2007** (mostki cieplne, liniowy współczynnik przenikania ciepła) →
  `docs/zrodla/norma-PN-EN-ISO-14683-1/`. Natywny PDF (nie skan), 27 stron, **przeczytany w
  całości** w tej sesji. Zawiera Tablicę A.2 (Ψ orientacyjne dla ~9 kategorii złączy budowlanych)
  i przykład liczbowy (Załącznik B): mostki cieplne = 36–42% strat ciepła przez przenikanie w
  przykładowym budynku. Częściowo zaspokaja lukę zgłoszoną wcześniej przy PN-EN 12831-1
  (`docs/normy-brakujace.md`, "mostków cieplnych Ψ, M6/E7") — ale nie całą (12831-1 nadal
  potrzebna do strat do gruntu/zysków/nadwyżki mocy). **Niewykorzystana jeszcze w kodzie** —
  zadanie w `docs/lista-do-zrobienia.md`.
- **EN ISO 13786:2007** (dynamiczne charakterystyki cieplne komponentów budowlanych) →
  `docs/zrodla/norma-PN-EN-ISO-13786/`. **Treść NIE przeczytana** — struktura PDF wskazuje na skan
  (108 obiektów obrazu vs. 7 czcionek/62 fragmenty tekstu na ~28 stron, prawdopodobnie tylko
  okładka natywna). OCR i analiza jawnie odłożone do innej sesji, zadanie zapisane w
  `docs/lista-do-zrobienia.md` i `00-INDEKS.md` tego folderu. Nie ma jeszcze zidentyfikowanego
  ekranu/luki, którą by odblokowywała — hipoteza (akumulacyjność cieplna budynku, bufor
  termiczny off-grid) zapisana jako niepotwierdzona, do zweryfikowania po OCR.

Przy tej okazji przypomniana lista wciąż brakujących norm (bez zmian od poprzednich sprawdzeń):
PN-EN 12831-1 (pełny tekst), IEC 62109-1, IEC 61215, IEC 62619, EN 61439, pełna seria EN 62305,
HD 60364-4-443, HD 60364-5-551, PN-EN 62852, PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych
przy konwersji PPTX→DOCX materiału branżowego PV-2019. Pełny wykaz: `docs/normy-brakujace.md`.

`pnpm typecheck`/`lint`/`check:i18n-guard`/`test`/`build` czyste (brak zmian kodu, tylko
dokumentacja i pliki źródłowe w `docs/zrodla/`).

## Cztery kolejne pliki norm dodane, jeden duplikat pominięty (27.09.2026)

Właściciel projektu dostarczył 5 kolejnych PDF do dodania do `docs/zrodla/`. Jeden okazał się
identycznym duplikatem pliku już w repo (`Poradnik-Purmo-nowa-metoda-obliczania_12831_01_2012.pdf`
= treściowo ten sam plik co już posiadany `79967189-Poradnik-Purmo-...pdf`) — **nie dodany
ponownie**, żeby nie powielać treści (zasada B.5). Pozostałe 4:

- **SRPS HD 60364-4-443:2017** → `docs/zrodla/norma-HD-60364-4-443/`. Pełny tekst, natywny PDF,
  przeczytany w całości (18 stron, wersja serbska — technicznie identyczna z HD 60364-4-443:2016,
  dokument harmonizacyjny CENELEC, treść normatywna identyczna między wersjami językowymi).
  **Zamyka pozycję ⚪ "HD 60364-4-443" w `docs/normy-brakujace.md`** — przeniesiona do sekcji
  "Pozyskane". Zawiera wzór CRL do oceny konieczności SPD (443.5), tabelę kategorii przepięć I–IV
  (443.6) i 4 rozwiązane przykłady liczbowe (Załącznik A) — bezpośrednio użyteczne dla ekranu
  `ochrona-przepieciowa-spd` (M5), zadanie zapisane w `docs/lista-do-zrobienia.md`.
- **Artykuł naukowy PL "Zmiany zasad ochrony odgromowej... wg norm serii PN-EN 62305"** (Boryń,
  Olesz, Politechnika Gdańska, 2010) → dopisany do `docs/zrodla/norma-IEC-62305/00-INDEKS.md` jako
  drugie źródło wtórne (po angielskim poradniku Furse). Przeczytany w całości. **Nie zamyka luki
  EN 62305** — status bez zmian (🟡, nadal brak oficjalnego tekstu normy), ale daje krótszy,
  polskojęzyczny opis procedury R = N·P·L i tabel materiałowych/przeglądowych do krzyżowej
  weryfikacji z Furse.
- **Whitepaper "Isolation in solar power converters" (IEC 62109-1)** → nowy folder
  `docs/zrodla/norma-IEC-62109-1/`. **Rozpoznany tylko po tytule/metadanych PDF — treść NIE
  przeczytana w całości w tej sesji** (14 stron, natywny tekst, nie wymaga OCR — zadanie
  jednoznacznie dla następnej sesji, zapisane w `00-INDEKS.md` i `docs/lista-do-zrobienia.md`).
  Nie zamyka luki IEC 62109-1 (wciąż brak Części 1 normy — mamy tylko Część 2).
- **Poradnik ELEKTRA "Obliczanie EN 12831" (wyd. 2011)** → dopisany do
  `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/00-INDEKS.md`. Spis treści (z zakładek PDF)
  identyczny z już posiadanym poradnikiem Purmo (ten sam autorski krąg/bazowa metodyka, inny
  wydawca-branding) — **nie jest niezależnym drugim źródłem**, dodany jako kopia zapasowa na
  wypadek luki w treści Purmo, nieprzeanalizowany rozdział-po-rozdziale (niski priorytet).

Metoda identyfikacji treści bez OCR/renderowania stron (poppler-utils niedostępny w tej sesji):
odczyt zakładek/outline PDF (`/Title` w obiektach `/Outlines`) i ekstrakcja tekstu z zdekompresowanych
strumieni FlateDecode (Python `zlib` + regex na operatorach `Tj`/`TJ`) — pozwoliło rozpoznać pełny
spis treści `nowa_norma.pdf` (i tym samym zidentyfikować go jako dokument o PN-EN 12831) i pierwszy
fragment tekstu bez wywoływania `pdftoppm`.

Przypomniana lista wciąż brakujących norm (zaktualizowana, HD 60364-4-443 usunięta):
PN-EN 12831-1 (pełny tekst), IEC 62109-1 (norma — mamy tylko whitepaper), IEC 61215, IEC 62619,
EN 61439, pełna seria EN 62305 (mamy tylko 2 materiały wtórne), HD 60364-5-551, PN-EN 62852,
PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych przy konwersji PPTX→DOCX materiału
branżowego PV-2019. Pełny wykaz: `docs/normy-brakujace.md`.

`pnpm typecheck`/`check:i18n-guard` czyste (brak zmian kodu, tylko dokumentacja i pliki źródłowe
w `docs/zrodla/`).

## Materiał ze szkolenia ZIAD Bielsko-Biała dodany bez analizy (27.09.2026)

Właściciel projektu dostarczył plik `.docx` "Bezpieczeństwo instalacji fotowoltaicznych"
(dodatek Rynek Elektryczny nr 3/2019, egzemplarz szkolenia ZIAD Bielsko-Biała) z jawnym
poleceniem: dodać do repo, ale **nie analizować w tej sesji** — analiza odłożona do innej
sesji. Skopiowany do `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/`, opisany minimalnie
w `00-INDEKS.md` (tylko rozpoznanie tytułu/wydawcy przy pobieżnym podglądzie tekstu, bez
merytorycznej ekstrakcji).

Zauważona, ale niesprawdzona zależność: tytuł i wydawca są identyczne z już posiadanym
`docs/zrodla/materialy-branzowe-PV-2019/` — materiałem, w którym przy konwersji PPTX→DOCX
zgubiło się 9 pozycji z listy 43 norm (`docs/normy-brakujace.md`, sekcja ⚫, pozycje #2, #6,
#10, #13, #17, #27, #29, #33, #37). Spis treści widoczny przy pobieżnym podglądzie różni się
jednak numeracją rozdziałów, więc **nie jest to na pierwszy rzut oka identyczny duplikat** —
wymaga porównania treść-po-treści przez następną sesję (zadanie zapisane w
`docs/lista-do-zrobienia.md`). Jeśli okaże się, że to pełna (nieprzycięta) wersja tej samej
publikacji, zamknie to od razu 9 pozycji z listy brakujących norm bez konieczności zgadywania.

`pnpm typecheck`/`check:i18n-guard` czyste (brak zmian kodu, tylko dokumentacja i nowy plik
źródłowy w `docs/zrodla/`).

## OCR EN ISO 13786 + sprawdzenie materiału ZIAD (27.09.2026, sesja OCR)

Polecenie właściciela: „zrób OCR plików, które zostały dodane”. Z plików dodanych 27.09 **tylko EN ISO 13786 jest
skanem** (PyMuPDF: 0 znaków tekstu na wszystkich 27 stronach); pozostałe PDF (SRPS HD 60364-4-443, IEC 62109-1
whitepaper, Boryń/Olesz, ELEKTRA) mają tekst natywny na każdej stronie — OCR zbędny. `.docx` ZIAD — tekst natywny.

- **EN ISO 13786:2007** — OCR (tesseract 5.3.4 `eng`, 250 DPI auto + 300 DPI `--psm 6`, porównanie liczb strona po
  stronie) → odczyt wizualny wszystkich stron treści (PDF 6–26) → odtworzenie przykładów D.1/D.2 w Pythonie z
  przepisanych wzorów (zgodne do ostatniej cyfry). Pliki: `01-tresc-ocr.txt`, `02-wzory-i-tablice-zweryfikowane.md`.
  **Niespójności oryginału (nie OCR), nierozstrzygnięte, oznaczone ⚠️:** literówka Z12 w D.1 (−0,0754j zamiast
  −0,0705j — potwierdza to reszta tego samego przykładu); wzór (26) arg(Z12) vs Tablice D.1/D.4, które odpowiadają
  arg(Y12) — pytać właściciela dopiero, gdy kod będzie potrzebował przesunięcia fazowego.
  **Odblokowuje M6/E8** (Zał. A.2.4, Tablica A.1: 1 h/1 doba/1 tydzień → 20/100/250 mm) — zadanie w liście.
- **ZIAD = duplikat bajt-w-bajt** `materialy-branzowe-PV-2019/*.docx` (MD5 `428edf51…`). Nie usunięty (dodany na
  wyraźne polecenie) — A/B do właściciela. **Błąd poprzedniej sesji naprawiony:** 9 „zgubionych” pozycji listy norm
  były w akapitach `.docx` poza tabelami; uzupełnione w `01-tresc.md` PV-2019 po potwierdzeniu z PDF str. 8, sekcja ⚫
  `normy-brakujace.md` rozwiązana. Dawne przypuszczenie „#29 = 61730-1” było błędne (61730-1 to #27).
- **Korekta opisu z poprzedniej sesji:** 13786 miała „~28 stron, okładka natywna” — faktycznie 27 stron, 0 tekstu.
- **Pułapka narzędziowa:** równoległe `tesseract` bez `OMP_THREAD_LIMIT=1` → ~9 min/stronę (pierwszy przebieg
  przerwany); z limitem ~1,3 s/stronę. `tesseract`/`pymupdf`/`numpy`/`python-docx` w kontenerze trzeba doinstalować.
- Zgłoszenie do `docs/wklad-do-standardu.md` (MD5 przed dodaniem, akapity `.docx`, OMP, odtwarzanie przykładów).
- **[uzupełnienie, 27.09.2026] PDF „ZIAD”** dostarczony jako „plik, w którym zgubiły się rozdziały przy przeróbce” —
  identyczny (MD5 `007dfe6c…`) z PDF już w `materialy-branzowe-PV-2019/` (repo miało oryginał od 23.09). Tekst natywny,
  bez OCR. Porównanie linia po linii PDF vs `.docx`: rozdziały kompletne; konwersja zgubiła fragmenty pól tekstowych
  (str. 17 podpis Rys. 5, str. 18 przypis MC4, str. 21 akapit o odstępach separujących w materiałach stałych, podpisy
  Rys. 17/18, dwa zdania). Nowy plik `02-tresc-pelna-z-pdf.txt` (bezstratny); `01-tresc.md` uzupełniony o 2 myśli ze
  str. 21. Wniosek: przy materiałach z `.docx`-konwersją źródłem prawdy jest PDF.
- **[27.09.2026] Decyzja właściciela — wariant A:** usunięty folder `materialy-szkolenie-ZIAD-Bielsko-Biala/`
  (duplikat) i niekompletny `.docx` z `materialy-branzowe-PV-2019/` (−2×22,5 MB). Oryginałem publikacji jest tylko PDF;
  wzmianki o `.docx` w starszych opisach są historyczne (plik w historii git, commit `0033707`). Odnośniki zaktualizowane
  dopiskami (00-INDEKS PV-2019, `zrodla/README.md`, `normy-brakujace.md`, lista, biblioteka-norm-zrodlowych).

## Porządki gałęzi na GitHubie — 30 gałęzi oznaczonych jako śmieci (27.09.2026)

- **Stan:** jedyne żywe gałęzie to `main` i bieżąca gałąź sesji. Pozostałe 30 gałęzi zdalnych to **śmieci — nie weryfikuj
  ich, nie scalaj, nie porównuj z `main`**. Sprawdzone 27.09.2026 (`git cherry` + diff treści), żadna nie ma treści,
  której brakuje w `main`:
  - 5 ma identyczne łatki już w `main`: `claude/app-rules-r4guty`, `claude/prep-work-kppxeb`, `claude/sync-cadence-12h`,
    `claude/sync-offgrid-standard-ucgqok-2`, `claude/y6-routine-id-20260924`;
  - 3 zastąpione nowszymi wersjami (scalenie **cofnęłoby** dokumenty): `claude/laughing-faraday-lp6ytt` (→ PR #153),
    `claude/youthful-fermat-tbxoxg` (→ PR #154), `claude/sync-offgrid-standard-ucgqok` (GOD BOOK v2.21, w `main` v2.39);
  - 7 bez wspólnej historii z `main` (prototyp v0 z sierpnia, zastąpiony): `design-system-refinement`,
    `design-system-refinement-1`, `design-system-refinement-2`, `v0/jf7kryn4f9-6614-*` (4 gałęzie);
  - 15 pozostałych `claude/*` nie ma żadnego commita spoza `main`.
- **Dlaczego nie usunięte:** sesja w chmurze nie może kasować gałęzi zdalnych (proxy git zwraca HTTP 403 na push
  inny niż do gałęzi sesji). Właściciel może je usunąć ręcznie: GitHub → repo → *Branches* → ikona kosza.
- **[01.10.2026] Ponowna kontrola: 56 gałęzi poza `main`, wszystkie śmieci, żadna do scalenia.** 52 nie mają żadnej
  łatki spoza `main` (`git cherry`), w tym 26 nowych z 28.09–1.10 (PR scalone; `claude/engine-constants-formula` = #241).
  4 mają łatki spoza `main`, ale ich treść weszła inną drogą — scalenie **cofnęłoby** dokumenty: trzy z listy wyżej +
  `claude/screen-fixes-new-documents-80kzcm` (to samo co `bcf74de` w `main`, odczyt IEC 62109-1). Brak otwartych PR.
  Usunięcie i tagi archiwalne nadal blokowane (HTTP 403). **Pułapka:** klon sesji bywa płytki (`git rev-parse
  --is-shallow-repository` = `true`) — wtedy każda stara gałąź pokazuje setki „niescalonych” commitów; przed
  porównaniem gałęzi zawsze `git fetch --unshallow`. Dla właściciela: ustawienie repo *Automatically delete head
  branches* (Settings → General) usuwa gałąź sama po merge PR.

## Ekrany odblokowane przez normy z 27.09 (27.09.2026)

Polecenie właściciela: „wnieść poprawki w ekrany odblokowane po dodaniu nowych dokumentów”. Z plików 27.09 odblokowały
kod trzy normy (whitepaper IEC 62109-1 nadal nieprzeczytany, ELEKTRA = duplikat Purmo, Boryń/Olesz = materiał wtórny).

- **M6/E7 Mostki — PN-EN ISO 14683 Tablica A.2.** Katalog 76 detali w `mostki-termiczne/katalog-psi.ts`; wartości wyjęte
  skryptem z tekstu PDF i porównane z kodem (0 rozbieżności), opisy z odczytu rysunków (str. 12–22; W1–W18 to przekrój
  poziomy, góra = zewnątrz). Użytkownik wybiera detal (także „po poprawie”) i **system wymiarów** (Ψe/Ψoi/Ψi — E1 go nie
  zna, więc pytanie na E7); kod detalu ma pierwszeństwo przed wpisanym Ψ, kod bez systemu → `INCOMPLETE`. Testy = przykład
  Załącznika B normy (69,85 / 58,88 / 41,50 W/K). **Dryf naprawiony (Y.2, Dyrektywa #6):** E7 zwracał zawsze
  `VALID_WITH_WARNINGS`, choć jedyne ostrzeżenie było `info` — teraz `VALID`.
- **M6/E8 Pojemność — EN ISO 13786 Zał. A.** C użyte do τ = Σ n·A·κ′: dT = min(½ przegrody, grubość do izolacji,
  100 mm), (A.4) z Rsi = 0,13 (✅🤖 — ISO 6946 poza repo, wartość z D.1 i 14683 A.1). Nowe pola warstwy: położenie
  (jedna strona / obie — cała w strefie / za izolacją) i opcjonalna grubość całej przegrody; stare szkice działają
  (domyślnie „jedna strona”). Cała masa zostaje jako `pojemnoscCalkowitaKwhK` (informacyjnie). **Skutek:** w przykładzie
  testowym (strop 100 m² × 20 cm betonu) czas do 5 °C 26,1 h → 6,3 h — stary wynik był ~4× za optymistyczny.
  `POJC-CALA-MASA-ZAWYZA` usunięty (także ze słowników) → `POJC-ZALACZNIK-A-PRZYBLIZENIE` (🟡, adnotacja wymagana przez A.1).
  `CALCULATOR_VERSION` 2.0.0 (zmiana znaczenia wyniku).
- **M5/E2 SPD — HD 60364-4-443 443.4/443.5.** Nowy moduł `okablowanie/ocena-ryzyka-crl` (strażnik i18n sprawdza tylko
  `calculator/warnings/validation.ts`, więc osobny katalog zamiast pliku `crl.ts` w module SPD) + sekcja na ekranie
  (`sekcja-crl.tsx`, osobny szkic) + narzędzie AI. **Pułapka ekstrakcji:** symbole „<”/„≥” progu CRL znikają z tekstu
  PDF — kierunek rozstrzygnięty przykładami A.1–A.4. **Off-grid:** brak linii → L_P = 0 → brak wymogu z 443.5; zawsze
  info o stronie DC (712.443 — osobne wymagania) i przepięciach łączeniowych (443.4: generatory nn, magazyny).
- **Pułapka narzędziowa:** repo nie ma konfiguracji Prettiera — `npx prettier --write` przeformatował pliki domyślnymi
  ustawieniami (średniki, szerokość 80). Cofnięte; formatować ręcznie w stylu pliku (bez średników, linie do ~160).
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (153) / test 172 plików, 1429 / build / audit:gate / audit:n1;
  `next start` + Playwright 390 px `pl-PL`: E7 (C2 → Ψoi 0,10), E8, SPD (CRL 81,7) — bez poziomego przewijania.

## Przegląd niedokończonych sekcji + M12/E32 (27.09.2026)

Polecenie właściciela: „co można jeszcze zrobić beze mnie, czy są większe niedokończone sekcje”. Stan z `mapa-wdrozenia.md`
(przeliczony 26.09): 155/314 → po tej sesji **156/314**. Największe luki: M12 (2/43), M6 (14/48), M7 (2/26), M10, M9, M8, M13.

- **M12 wybrany jako pierwszy**, bo ekrany są małe i samodzielne (źródło: „Wzorzec D-lite”), często echo gotowych silników.
  Triaż wszystkich 40 pozostałych ekranów zapisany w `docs/lista-do-zrobienia.md` (budowalne / wymagają danych / zależne).
- **E32 zbudowany** — echo M4/E1: `obliczDniAutonomiiZPojemnosci` dopisana obok `obliczPojemnoscUzytecznaKwh`
  (ten sam wzór rozwiązany względem d), nie osobny wzór w M12. Przykład źródła M4/E1 w obie strony (45 kWh ↔ 3 dni).
  Uwaga do nazwy w M4/E1: `pojemnoscUzytecznaKwh = E·d/(η·DoD)` to w praktyce pojemność **znamionowa** (dzielenie przez DoD) —
  nazwa zmiennej myląca, ale przykład źródła („45 kWh użytecznej”) tak ją nazywa; nie zmieniane (15.1), tylko odnotowane.
  W E32 wejściem jest pojemność znamionowa z tabliczki (Ah × V), więc wzór odwrotny jest spójny.
- **E41 (przedłużacz) → `⚠️ blocked`**: przewody giętkie nie są w PN-HD 60364-5-52; przykład źródła („0,75 mm², 20 m → max ~1000 W”)
  nie wynika ze spadku napięcia (1000 W → ΔU ≈ 1,8%), więc pochodzi z tablicy obciążalności, której nie mamy. Dopisane do
  `docs/normy-brakujace.md` przy PN-EN 50565-1.
- **Pułapka narzędziowa:** `playwright` nie jest w zależnościach repo — skrypt zrzutu importuje go z globalnej instalacji
  `/opt/node22/lib/node_modules/playwright/index.mjs` (skrypt w scratchpadzie, nie w repo).
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (154) / test 1439 / build / audit:gate / audit:n1; `next start` +
  Playwright 390 px `pl-PL`: 100 Ah/12 V/80%/100%/300 Wh → „3,2 dni”, bez poziomego przewijania.
- **[27.09.2026, partia 2] M12/E9 (dozownik LVD) zbudowany.** Progi 12 V ze źródła; 24/48 V skalowane szeregowo (na ogniwo ×
  liczba ogniw). Kontrola krzyżowa: LiFePO4 11,0 V/4S = 2,75 V/ogniwo = kalibracja M4/E31 (44,0 V/16S) — brak sprzeczności między
  modułami. Kwasowy zalewowy bez progu (źródło podaje tylko AGM i LiFePO4). `PoleCheckbox` wymaga `id` → `useId()` (standard 08).
- **Pułapka narzędziowa:** `pkill -f next-server` w tym samym poleceniu Bash zabija własną powłokę (wzorzec jest w jej linii
  poleceń) — kolejne kroki się nie wykonują. Zatrzymywać serwer po porcie (`fuser -k 3123/tcp`) albo osobnym wywołaniem.
- **[27.09.2026, pakiet 2] M12/E27 (urządzenie 12 V wprost) zbudowany.** ✏️ **Rozbieżność A/B do decyzji właściciela:** górna
  granica napięcia akumulatora 12 V przy ładowaniu — `Tresc_Modul_12` (E27) **14,5 V**, Biblia §12.42 **14,6 V**. Użyte 14,5 V (plik
  ekranów = specyfikacja ekranu, Dyrektywa #13), stała w `urzadzenie-12v-bezposrednio/constants.ts`. Konsekwencja: urządzenie o
  max 14,55 V przejdzie bez 🔴, choć przy ładowarce 14,6 V (typowej dla LiFePO4) byłoby przekroczone. **Pułapka:** porównania granic
  zakresów liczonych z procentów wymagają tolerancji numerycznej (12,5 × 1,16 = 14,4999…) — tu `EPS_V = 1e-9`.
- **[27.09.2026, pakiet 2] M12/E39 (panel → stacja zasilania)** — echo `obliczNapiecieStringuZimowego` + progi M3/E5. `WerdyktPoziom`
  ma wartości `ok | uwaga | blad` (nie „ostrzezenie”). Prąd zwarciowy tylko 🟡 (źródło bez stopu, zachowanie stacji zależy od producenta).
- **[27.09.2026, pakiet 2] M12/E11 (zużycie per urządzenie)** — `obliczZuzycieDoboweWh(P, t, k%)` eksportowane (echo dla E12/E13
  kreatorów). Baza typowych mocy nie zbudowana: źródło ma tylko nazwy urządzeń — dane potrzebne od właściciela, jeśli ma powstać.
- **[27.09.2026, pakiet 2] M12/E30 (gniazdo zapalniczki)** — prąd bezpiecznika od usera (zakres 10–15 A tylko jako podpowiedź).
- **[27.09.2026, pakiet 2] M12/E42** — odsyłacz; dołożone B10 przed B11 (B11 sam mówi, że diagnoza przychodzi z B10).
- **[27.09.2026, pakiet 2] M12/E22 + E36 (checklisty wg chemii)** — wspólna logika `ocenChecklisteChemii` (E22) i wspólny komponent
  `components/wzorce/ekran-checklisty-chemii.tsx`. ⚠️ **Do decyzji właściciela:** alert Biblii o wodorze (ołowiowy bez wentylacji)
  wdrożony jako 🟡 `warning`, nie 🔴 — lista twardych stopów M12 w `Tresc` go nie wymienia. Podniesienie do 🔴 = zmiana `level` w
  `bezpieczenstwo-kamper/warnings.ts` + wpis w rejestrze twardych stopów.
- **[27.09.2026, pakiet 3] M12/E2 + E15 (kabel i bezpiecznik)** — echo M5/E1 + M5/E6 (jak M11/B5) + pierwsze użycie PN-IEC
  60364-4-43 433.2 (IB ≤ In ≤ Iz). ✏️ Przykłady źródła (15 A/3 m → 2,5 mm²; 15 A/4 m → 4 mm²) liczone wzorem jednostronnym ρ·L/S —
  ta sama rozbieżność co w M5/E1, nie powielana (2L → 6 mm² przy 3%). E15: tablice obciążalności dotyczą przewodów instalacyjnych
  PVC (H07V-K); przewody samochodowe FLRY mają osobne tablice — jawne założenie, nie blokada (inaczej niż E41, gdzie przedłużacz
  to przewód giętki poza zakresem normy i przykład źródła nie wynikał z żadnego wzoru).

### M7/E23 obciążenie dachu śniegiem (27.09.2026)

- Pierwszy ekran M7 zbudowany w pełni na normie z repo (PN-EN 1991-1-3 + NB), bez danych z M1 — strefę i wysokość n.p.m. wpisuje user. Tablice NB.1 (sk), 5.1 (Ce), E.1 (γ) i minimum μ = 0,8 przy barierkach dopisane do wspólnego `lib/core/modules/pv/eurokod-1/snieg.ts` (obok istniejącego μ1) — M3 może z nich korzystać bez duplikatu.
- **Pułapka IEEE-754 (drugi raz po E27):** 0,8 × 0,9 = 0,7200000000000001, więc s równe nośności dawało fałszywe 🔴. Porównanie z tolerancją `EPS_KN_M2 = 1e-9`. Wniosek: każde porównanie iloczynu z progiem „>” wpisanym przez usera potrzebuje tolerancji — kandydat do `docs/wklad-do-standardu.md`.
- Porównanie na wartościach charakterystycznych (bez γQ = 1,5) — założenie jawne w UI; nośność user musi podać też jako charakterystyczną.
- Otwarte dla właściciela: próg „zbliżania się do nośności” (źródło: 🔴 „zbliżające się lub przekraczające”, bez liczby) — dziś tylko % wykorzystania.

### M7/E13 sztywnienie izolacji (27.09.2026)

- Progi 1:1 ze źródła (PVC −10°C, XLPE −40°C). Asymetria świadoma: 🔴 tylko PVC (tak źródło), XLPE poniżej progu — 🟡. Guma/aluminium bez liczby → info. Para z M5/E28 (strona gorąca) — osobne ekrany, nie scalone, bo źródło ma je w dwóch modułach.

### M7/E19 elektronika w mrozie (27.09.2026)

- Źródło nie podaje progów per urządzenie — min. temperaturę pracy wpisuje user z karty katalogowej (Dyrektywa #1). 🔴 tylko BMS (jedyny „nie wystartuje” w źródle); przetwornica/falownik 🟡 mimo że realnie też krytyczne — otwarte dla właściciela (`docs/lista-do-zrobienia.md`). Porównanie ścisłe `<` (równo z minimum = w zakresie, jak E13).
- **Błąd naprawiony (wspólny komponent):** `components/wzorce/wynik-szczegoly.tsx` miał `key={w.code}` — przy kilku ostrzeżeniach o tym samym kodzie (lista urządzeń) React zostawiał nieaktualny komunikat. Teraz `key={w.code + i}`. Ten sam wzorzec `key={w.code}` jest jeszcze w ~10 stronach z własnym renderem ostrzeżeń (np. `mixing-rownolegle`, `liczba-paneli`) — nieruszone, bo tam kody są unikalne per wynik; do sprawdzenia przy dotknięciu tych ekranów. Wkład: `docs/wklad-do-standardu.md`.

### M7/E21 pompy i zawory w mrozie (27.09.2026)

- Kopia wzorca E19 (osobny moduł, nie wspólny silnik — inne kody, inne skutki, brak 🔴). Świadomie nie scalone z E19 w generyczny „sprzęt w mrozie”: dwa ekrany źródła, dwie różne listy skutków; przy trzecim podobnym ekranie rozważyć ekstrakcję.
- „Spadek ciśnienia” (sekcja B) nieliczony — źródło nie podaje zależności.

### M7/E11 grzałki dachowe (27.09.2026, częściowo)

- Wzór z przykładu źródła; 30 W/m i 6 h to przykład → pola usera. Zdanie źródła „sprawdź, czy masz zapas mocy” zamienione na realne porównanie z opcjonalnym polem „wolny zapas mocy falownika” (bez niego — info). Porównanie z pompą ciepła tylko, gdy user poda jej moc. Strefy zatorów (kosze, przy rynnach) — tylko opis; auto-identyfikacja czeka na model dachu M1.

### M7/E22 ryzyko zamarznięcia — tryb grunt (28.09.2026, częściowo)

- Zapas 20 cm dla wodociągu wzięty z `Biblia_Offgrid_v2_0` („minimum 20 cm poniżej strefy przemarzania”) — 🟡, bo tam to komunikat, nie twardy stop. Kabel/uziom: wymagane = h_z. Porównanie ścisłe `<` (dokładnie na granicy = OK).
- Mapy stref przemarzania (PN-81/B-03020) nie ma w repo → h_z od usera. Gdy właściciel dostarczy normę, można podpiąć wybór strefy.
- **Błąd naprawiony (dryf, Y.2):** `\;` w FORMULA pisane jednym backslashem — JS po cichu robi z tego `;`, odstęp LaTeX znikał. Było w 4 istniejących kalkulatorach (`powloki-antyrefleksyjne`, `mikropekniecia-termiczne`, `gniazdo-zapalniczki`, `zuzycie-per-urzadzenie`) i dwa razy w tej sesji. ESLint nie łapie (brak `no-useless-escape` w konfiguracji). Dodano strażnika: `lib/core/__tests__/formula-escapes.test.ts` (skan linii z FORMULA). **Uzupełnienie (28.09.2026):** strażnik rozszerzony o wzory łamane na kilka linii (`=`/`+`/`(` na końcu linii) — znalazł jeszcze 5 kalkulatorów (`kable-bezpieczniki-male`, `panel-do-stacji-zasilania`, `urzadzenie-12v-bezposrednio`, `koszty-ogrzewania`, `tracker-vs-staly`); poprawione. Łącznie 9 plików z dryfem. Wkład: `docs/wklad-do-standardu.md`.

### M7/E8 agregat w mrozie (28.09.2026, częściowo)

- **Konflikt w źródle (nie rozstrzygnięty samodzielnie):** próg parafinizacji zwykłego diesla — sekcja B „przy −20°C”, przykład C „nie wystartuje przy −15°C”. Dziś tylko info dla zwykłego diesla < 0°C. Wpis do decyzji: `docs/lista-do-zrobienia.md`.
- 120 h z przykładu to wymagany czas pracy, nie wynik (8 h + 1 h przez 168 h dałoby 150 h) — stąd wejście „łączny czas pracy”, a czas kalendarzowy jako wynik.

### M8 blok 1: E1, E3, E4 (28.09.2026)

Polecenie właściciela: „zacznij od modułów M8–M7 i ruszaj dalej; po każdym bloku, który możesz zrobić beze mnie — commit, push, PR, merge”.

- **E3 zamki drzwi ewakuacyjnych** — źródło sformułowało 🔴 nieprecyzyjnie („zamek elektromagnetyczny bez zasilania awaryjnego … jeśli logika nie jest fail-safe”). Fizycznie o bezpieczeństwie decyduje zachowanie przy zaniku prądu, nie typ zamka — stąd wejście „co robi zamek przy zaniku prądu” (otwiera/blokuje/nie wiem), a 🔴 = nie fail-safe ∧ brak zasilania awaryjnego. „Nie wiem” = blokuje (strona bezpieczna). Fail-secure z UPS → 🟡 (✅🤖, lista do decyzji).
- **E4 moduł gaśniczy** — 🔴 tylko dla środków wymienionych wprost jako nieskuteczne przy LiFePO4 (proszek, CO2); gaz obojętny/aerozol 🟡 (✅🤖). Próg 2 czujników z „np. dwa niezależne” — potwierdzenie jednym czujnikiem nie jest potwierdzeniem. Sekwencja 12.51 — lista na ekranie, nie logika (wykonanie to M9/M13).
- **E1 awaryjne źródło ciepła** — **pułapka echa:** przykład źródła (kominek 8 kW + bufor 400 l) pasuje liczbowo do reguły 50 l/kW z M6/E14, ale ta reguła dotyczy pompy ciepła — świadomie NIE przeniesiona na kominek (Dyrektywa #1). Paliwo m = P·t/(η·W_o): P to moc oddana, więc energia paliwa = E/η. Wartość opałowa drewna od usera (źródło jej nie podaje).
- Nowy plik testów narzędzi AI M8: `lib/ai/tools/__tests__/modul8-bezpieczenstwo-tools.test.ts`.
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (173) / test 196 plików, 1600 / build / audit:gate / audit:n1; `next start` + Playwright 390 px `pl-PL` — trzy ekrany, werdykty zgodne z testami, bez poziomego przewijania.

### M8 blok 2: E5, E7, E8, E10 (28.09.2026)

- Wszystkie cztery to kontrole konfiguracji (Wzorzec D bez liczb): flagi domyślnie `false`, 🔴 tylko tam, gdzie źródło je daje (E5 awaria centrali, E7 niesprawna lampa) + E10 zgoda na wezwanie służb (reguła produktowa, pogrubiona w źródle — ✅🤖). E8 — źródło bez 🔴, same 🟡/info.
- E10 — wynik `autoWezwanieAktywne = auto ∧ zgoda`: kalkulator sam „wyłącza” wezwanie bez zgody zamiast tylko ostrzegać; narzędzie AI niczego nie wysyła (`read`).
- E7 — lista lamp jak w M7/E19 (`id` tylko w stanie strony, silnik go nie potrzebuje); klucze ostrzeżeń w `WynikSzczegoly` już `code + i` (poprawka z 27.09), więc powtarzający się kod per lampa renderuje się poprawnie.
- Świadomie nie zbudowane: E9 (telemetria M13), część AI E6 (brak progu „zbliżającego się rozładowania” w źródle — przykład „10 minut” to ilustracja), adaptacyjna trasa ewakuacji E7 (mapa budynku M1), reset klap E8 (sterownik).

### M7 blok 3: E4, E6, E10 (28.09.2026)

- **E4 Blackout** — czyste echo M4/E1 w obie strony (`obliczDniAutonomiiZPojemnosci`, `obliczPojemnoscUzytecznaKwh`), DoD = SoC₀ − SoC_min. Testy sprawdzają spójność odwrotną: po dołożeniu wyliczonej pojemności albo redukcji zużycia system wytrzymuje dokładnie N dni. Przykład C (14 dni, 9. dzień, 30 kWh, 40%) nie ma danych wejściowych — test na własnych liczbach tej samej skali.
- **E6 Zamarzanie** — źródło w sekcji A odsyła do M2 „Ekran 1.20” (Smart Load Shedding) → progi wzięte stamtąd jako echo stałej, nie kopiowane. Zimą bez nadwyżki PV reguła M2/E12 odłącza komfort od razu.
- **E10 SPOF** — 🔴 tylko BMS (tak źródło), pozostałe z przykładu C jako 🟡 z konkretnym zaleceniem.
- **Pułapka (drugi raz tej samej doby):** `\;` w FORMULA — strażnik `formula-escapes.test.ts` złapał to w 2 nowych plikach. **Nowa pułapka przy naprawie:** regex w Pythonie wewnątrz heredoc (`(?<!\\)\;`) po warstwach escapowania dopasował każdy `;` i zepsuł komentarze oraz poprawny plik E1 — wykryte `git diff`/`od -c`, E1 przywrócony z HEAD. Wniosek: poprawki backslashy robić `str.replace` z `chr(92)`, zawsze sprawdzać `git diff` po masowej zamianie.
- Weryfikacja: typecheck / lint / i18n-guard (180) / test / build / audit:gate / audit:n1 — wynik w PR.

### M7 blok 4: E18, E20, E26 (28.09.2026)

- **E20** — wyodrębniona `obliczStrumienCieplaPowietrzaW(V̇, ΔT, η=100)` z M6/E3 (wzorzec echo); M6/E3 teraz ją wywołuje, jego 9 testów bez zmian. Ta sama funkcja z η=100% daje moc nagrzewnicy wstępnej.
- **E18** — stała wody z M2/E2 (`WSPOLCZYNNIK_KWH_NA_L_K`) zamiast nowej liczby; bufor = Q_dom / straty (straty stałe — założenie jawne).
- **E26** — deficyt + echo M4/E1 dla dni na baterii.
- **Pułapka narzędziowa (trzeci raz):** `\;` w FORMULA pisanej przez heredoc Basha ginie do `\;` pojedynczego — pliki z wzorami LaTeX pisać narzędziem Write, a w FORMULA używać `\\quad` zamiast `\;`. Strażnik `formula-escapes.test.ts` łapie to niezawodnie.
- M7 po bloku 4: z triażu nie zostało nic budowalnego bez właściciela — E24/E25/E16 wpisane do decyzji w `docs/lista-do-zrobienia.md`.

### M9 blok 5: E2, E4, E5, E6 (28.09.2026)

- **E2** — porównanie zakresu przetwornicy z **najwyższym** napięciem magistrali (przy ładowaniu), nie z nominalnym: nominalne 48 V przy przetwornicy do 50 V wyglądałoby dobrze, a ładowanie do 58,4 V ją niszczy. Przykład źródła „48 V → MP1584” podejrzany (hipoteza, wpis do weryfikacji w `docs/lista-do-zrobienia.md`); limitów konkretnych przetwornic nie wpisano do kodu — tylko z karty od usera.
- **E5** — rozróżnienie linii magistral współdzielonych (I2C, 1-Wire, SPI MOSI/MISO/SCK) od funkcji wyłącznych (CS, ADC, UART, PWM…). Mapa ADC1/ADC2 poza źródłem — tylko przypomnienie.
- **E4** — Biblia §9.4 („konflikty adresów i prędkości”) dała więcej niż `Tresc` — obie reguły wdrożone jako 🟡.
- Pliki z FORMULA pisane narzędziem Write, bez `\;` — strażnik escapowania zielony od razu.

### Chmurki „?” przy polach — niezgodność ze standardem 8.4 (28.09.2026)

- Pytanie właściciela: czy chmurki z opisem są na każdym ekranie. Sprawdzone: opis ekranu (nagłówek) — tak, wszędzie; chmurka `?` przy polach (`PomocPole`, prop `pomoc`) — tylko na 1 kalkulatorze + `/wzornik`, choć standard 8.4 wymaga jej przy każdym polu liczbowym. Dryf bez decyzji; ekrany M7/M8/M9 z 28.09 go powieliły. Właściciel zlecił wpis do pracy planowanej (inna sesja) — pełny opis, warianty A/B/C i rekomendacja: `docs/lista-do-zrobienia.md`, wpis z 28.09 „Chmurki „?” przy polach liczbowych”. Nowe ekrany od teraz: dodawać `pomoc` od razu.

## Nowy materiał źródłowy — rozliczenia energii (gospodarstwo / przedsiębiorca) (28.09.2026)

[28.09.2026] ✅ DODANO — właściciel dostarczył 2 dokumenty (zapisane 1:1:
`docs/zrodla/Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md`,
`docs/zrodla/Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md`). Cel właściciela: nowy
rozdział Biblii + kalkulatory/porównywarki, **osobne ekrany dla gospodarstwa domowego i dla
przedsiębiorcy** (wybór segmentu na pierwszym kliknięciu — na ekranie wyboru albo wyżej w menu).
Proces ustalony: źródło 1:1 [wykonane] → weryfikacja + kategoryzacja F.2 [wykonane, przedstawione
właścicielowi, czeka na decyzje] → opracowanie (dokument źródłowy poprawiony/uzupełniony) →
Biblia → plan ekranów → audyt N.2 → dopiero kod (bramka N.3). **Kodu nie zaczynać.**

**Pochodzenie:** oba dokumenty z innego narzędzia AI (dok. 2 wprost: „mogę napisać kod
kalkulatora”, kolumny „Źródło” puste) — 15.1b.

**Kontekst zakresu:** aplikacja jest off-grid; sieć występuje dotąd marginalnie (M6 „pompa ciepła
w taryfie nocnej”, „jeśli jest sieć”). To rozszerzenie domeny (rynek energii, prawo energetyczne,
podatki) — do potwierdzenia jako decyzja D# (GOD BOOK 0.5 — rozszerzenie ekspertyzy o analityka
rozliczeń energii; Część K — treści prawne/podatkowe = informacja, nie porada).

**Weryfikacja — błędy merytoryczne (do adnotacji ✏️ w opracowaniu, źródło nietknięte):**
1. **Wzór opłaty za moc bierną bez pierwiastka.** Źródło: `O_b = k·C_rk·[(1+tg²φ)/(1+tg²φ₀) − 1]·A`.
   Rozporządzenie taryfowe: `O_b = k·C_rk·(√((1+tg²φ)/(1+tg²φ₀)) − 1)·A` (stosunek mocy pozornej
   do czynnej = √(1+tg²φ)). Przeliczone: wzór źródła zawyża opłatę ok. 2× (tgφ=0,5: 0,0776 vs
   0,0381). Pewność wzoru: wysoka, 🔎 potwierdzić brzmieniem aktualnego rozporządzenia.
2. **C_rk to nie cena energii klienta** — to cena energii ogłaszana przez Prezesa URE (art. 23
   ust. 2 pkt 18 lit. b Prawa energetycznego), a energia bierna pojemnościowa i indukcyjna przy
   braku poboru czynnej rozliczana jest inną formułą (całość, nie nadwyżka). 🔎 treść rozporządzenia.
3. **Moc bierna w C1x „zawsze tak”** — nadmierne uogólnienie: dla nN obowiązek dotyczy zasadniczo
   mocy umownej >40 kW, dla ≤40 kW — gdy wynika z warunków przyłączenia/umowy. 🔎.
4. **Współczynnik 1,23 depozytu dla firm** — najpewniej dotyczy prosumentów niebędących
   podatnikami VAT (gospodarstwa domowe, rekompensata VAT); przykład 1 107 zł dla firmy
   prawdopodobnie powinien dać 900 zł. Data „1.02.2025” niepotwierdzona. 🔎 (ustawa OZE).
5. **Podatki (4.4)** — dwa zdania wzajemnie sprzeczne (nadwyżka „nie stanowi przychodu” vs
   „podlega opodatkowaniu jako przychód”), plus nieprawdziwe uogólnienie „przedsiębiorcy zwolnieni z
   podatku dochodowego i akcyzy”. Sygnatura interpretacji niezweryfikowana. Nie przenosić do
   kalkulatora; do poradnika tylko jako informacja z datą i zastrzeżeniem (Część K).
6. **Dotacje (5.4)** — program NFOŚiGW i ulga termomodernizacyjna dotyczą osób fizycznych/
   budynków mieszkalnych, nie firm; nabór FEPK zakończony 31.03.2026. Dane przeterminowane.
7. **Reklamacja (7.1)** — „14 dni na złożenie” nie wynika z ustawy (14 dni to termin na
   rozpatrzenie); termin złożenia wg umowy/OWU. 🔎. Tabela „dodatkowa ekspertyza — płaci odbiorca”
   uproszczona (przy stwierdzeniu nieprawidłowości koszt ponosi przedsiębiorstwo). 🔎.
8. **Przykład 9.3 wewnętrznie sprzeczny** — dane wejściowe 9.1 mają moc umowną 30 kW, a tabela
   rekomenduje C21 (wymaga >40 kW). Kwoty w tabeli nie są wyliczone, tylko ilustracyjne.
9. **„Od 2008 ceny taryfy C nieregulowane”** — dotyczy tylko sprzedaży; dystrybucja nadal
   zatwierdzana przez URE.
10. **Brakujące składniki rachunku:** opłata przejściowa, abonamentowa, handlowa sprzedawcy;
    grupa B (SN) poza zakresem materiału; inni OSD (np. Stoen Operator).

**Dokument 2 (tabele stawek) — niewiarygodny jako dane:** Tauron i PGE mają identyczne stawki co
do grosza (niemożliwe przy różnych taryfach OSD); stawka jakościowa różna per OSD (w praktyce
jednolita); „Energa = Ergo Energy (dawniej Stoen)” — pomylenie operatorów; Tauron C21 z „strefą
zalecanego poboru” (C21 jest jednostrefowa); Tauron C22a dzień = noc. **Wniosek: żadnej liczby z
dok. 2 nie wpisywać do kodu** — dane stawek wyłącznie z oficjalnych taryf OSD 2026 (PDF), wersjonowane
rocznie (Zasada 4 „profile jako dane”), albo wpisywane przez użytkownika z faktury.

**Poprawne/potwierdzone:** tgφ₀=0,4 domyślnie; akcyza 5 zł/MWh; VAT 23%; podział C1x ≤40 kW /
C2x >40 kW; godziny opłaty mocowej 7–22 w dni robocze; mikroinstalacja ≤50 kW; depozyt 12 mies.;
test diody (15×60/1000 = 0,9 kW ✅); arytmetyka 2×450×1,23 = 1 107 ✅, 169,99×1,23 = 209,09 ✅;
0,2194 vs 0,1413 (2025) = +55,3% — spójne ze źródłem, sama stawka 🔎 (Informacja Prezesa URE).
Ceny BESS, zwrot 5–8 lat, „0,3–0,4 współczynnik bilansowania”, „54% węgla” — orientacyjne, nie
stałe do kodu (kalkulator ma to liczyć, nie przyjmować).

**[28.09.2026] ✅ Decyzja właściciela — cel rozdziału (do zapisu jako D# przy integracji do Biblii):**
„Niektórzy są jeszcze podłączeni do sieci i chcą częściowo przejść do off-grid — nie możemy ich
ignorować. Muszą mieć podgląd i porównanie, żeby zrezygnować z sieci i przejść na off-grid. To
bardzo popularny kierunek.” Konsekwencja: rozdział nie jest porównywarką taryf samą w sobie, tylko
**ścieżką przejścia sieć → off-grid** (dziś: mój rachunek; jutro: porównanie scenariuszy z
kalkulatorami M2/M3/M4/M7). Pochodzenie materiału potwierdzone przez właściciela: pisane przez AI.

**[28.09.2026, później] Opracowanie M14 + korekta własnej notatki.** Właściciel: brak dalszych
materiałów (ponownie wklejony tekst = dok. 1, już zapisany), M14 potwierdzony, **dwa duże kafle
Dom/Firma**, prowadzenie za rękę (kalkulatory opłacalności, PV, magazynu) + pełna informacja o
ryzykach odłączenia; dane stawek — Claude znajduje poprawne + użytkownik zawsze może wpisać swoje.
Opracowanie: `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md` (czeka na P1–P4 i „integruj
teraz”).
- ✏️ **Korekta mojej notatki wyżej (pkt 10 „brakuje opłaty przejściowej”):** opłata przejściowa
  **zniesiona od 1.01.2026** (decyzja Ministra Energii, 🔎A) — brak w dok. 1 był poprawny, błędny jest
  krok algorytmu dok. 2, który ją nalicza.
- **Weryfikacja danych w sieci:** WebSearch działa, ale WebFetch do `ure.gov.pl`, `gov.pl`,
  `gramwzielone.pl`, `industria.eu` blokowany przez proxy środowiska → stawki ogólnokrajowe 2026 na
  poziomie 🔎A (≥2 zgodne źródła wtórne): mocowa G 4,29/10,31/17,18/24,05 zł/mies., C 0,2194 zł/kWh;
  OZE 7,30 zł/MWh; kogeneracyjna 3,00 zł/MWh; przejściowa 0; średnia cena G 495,16 zł/MWh.
  **Pułapka:** źródła wtórne o stawkach per OSD są wzajemnie sprzeczne (mieszają netto/brutto,
  podają zniesioną opłatę przejściową) — stawki per OSD tylko z PDF taryf (zadanie DANE-1).
- Wprowadzona skala pewności 🔎A/🔎B (opracowanie §0); do kodu jako dane domyślne tylko ✅.

## Synchronizacja ze standardem — Y.6, sprawdzenie (28.09.2026, 09:55 UTC)

Świeży płytki klon `new-app-standards` (`b59a052`, 27.09 06:17 UTC) — jedyny nowy commit od `8eff570`
to znów ruch U.4 po stronie źródła (cykliczne sprawdzenie, brak treści). `AKTUALIZACJE.md` 112 linii,
bez nowego wiersza. `diff -rq` `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — bez różnic. Zero nowej treści → `interwał_h = min(48, 18 × 1,5) = 27`,
`licznik_zero_z_rzedu = 2`. Kolejne sprawdzenie najpóźniej 29.09.2026 ok. 13:00 UTC.


**[28.09.2026, później] ✅ Decyzje właściciela do opracowania M14 (P1, P2):** (6) **FREE/PRO — na razie
nie ruszamy**, podział później, osobną decyzją; (7) **kafle „Dom – sieć” / „Firma – sieć”** — „moduły
opowiadają i liczą sieć, a dopiero potem jest opcja obliczenia dla przejścia Offgrid”. Opracowanie
zaktualizowane: każdy rozdział = część **Sieć** (najpierw) + część **Przejście** (opcja, wejście na
końcu części Sieć; kreator „Ścieżka przejścia” startuje stamtąd); kolumna FREE/PRO w planie ekranów
zastąpiona kolumną „Część”. Otwarte zostają P3 (autokonsumpcja w trybie prostym) i P4 (DANE-1).

**[28.09.2026, później] ✅ P3: autokonsumpcja w trybie prostym = profile** (decyzja właściciela).
Źródło kształtów: standardowe profile zużycia OSD (IRiESD) — 🔎B, do pozyskania; warianty tylko ze
źródłem albo jako jawne przesunięcie profilu typowego. **P4 (dane):** właściciel wybierze
odblokowanie domen w ustawieniach środowiska albo sam zweryfikuje ręcznie — lista kontrolna W1–W7
w opracowaniu §9.1. Najprościej: PDF-y taryf OSD, liczby wyciąga Claude.

**[28.09.2026, później] DANE-1 — pierwszy odczyt pierwotny (po zmianie sieci przez właściciela).**
Informacja Prezesa URE nr 58/2025 pobrana z `bip.ure.gov.pl` → `docs/zrodla/`: stawki mocowe 2026
✅ (4,29 / 10,31 / 17,18 / 24,05 zł/mies. ryczałt; 0,2194 zł/kWh pozostali, 15 godzin dni roboczych
od 7:00 do 22:00). **Pułapka dla kodu — granice progów:** `<500`, `500–1 200` (włącznie),
`>1 200–2 800`, `>2 800` kWh/rok — brzmienie URE, nie zaokrąglać. Ryczałt dotyczy odbiorców z art. 89a
ust. 1 pkt 1 ustawy o rynku mocy (w praktyce G) — nie „G” wprost.
**Dostęp sieciowy po zmianie:** działają `bip.ure.gov.pl`, `energa-operator.pl` (strona), a blokowane
nadal: wersje `www.` (`www.ure.gov.pl`, `www.gov.pl`, `www.nfosigw.gov.pl`, `www.pse.pl`,
`www.tauron-dystrybucja.pl`, `www.operator.enea.pl`, `www.stoen.pl` — domeny bez www przekierowują na
www), `pgedystrybucja.pl` (z i bez www), CDN z PDF-ami Energi `cdn-netpr.pl`; `isap.sejm.gov.pl` → 403.

**[28.09.2026, wieczór] DANE-1 — drugi odczyt pierwotny (sieć odblokowana w pełni, poza 2 hostami).**
Zamknięte ✅: W2 (OZE 7,30, kogeneracyjna 3,00 zł/MWh — z taryf OSD; przejściowa 0 — komunikat ME
28.11.2025 + brak w taryfach), W5 (1,23 — art. 4c ust. 4 OZE; zwrot nadpłaty 20%/30% — art. 4 ust.
11a), W7 (wzór mocy biernej z √, k=3/1/0,5, tgφ₀=0,4 min 0,2, przekroczenie = stały × suma 10
największych nadwyżek — w taryfach Tauron/Energa/Stoen). W3 częściowo: Tauron, Energa, Stoen ✅,
Enea tylko brutto (pełna taryfa = skan), PGE ❌. Otwarte: W4 profile, W6 PME, wartość `C_rk`.
**Trzy lekcje:**
1. **Moja poprawka ✏️ K4 (1,23 „tylko dla nie-VAT”, data niepotwierdzona) była błędna** — ustawa
   nie różnicuje, stosowanie od 1.02.2025 (art. 31 ustawy Dz.U. 2024/1847). Materiał właściciela miał
   rację; poprawkę wycofano jawnie (zostaje w historii). Wiedza „ekspercka” bez odczytu to 🔎B, nie ✏️.
2. **Stawki zmieniają się w trakcie roku** — jakościowa 0,0331 (I) → 0,0332 zł/kWh (od 1.02.2026, zmiana
   kok w taryfie PSE). Model danych: lista okresów `{odDnia, doDnia, wartosc}`, nie „stawka roczna”.
3. **Dostęp:** `pgedystrybucja.pl` i `www.nfosigw.gov.pl` mają niepełny łańcuch certyfikatów (brak
   pośredniego Certum) — curl je odrzuca; obejście przez dociąganie certyfikatu zablokował klasyfikator
   bezpieczeństwa → te dwa dokumenty tylko od właściciela (PDF). `isap.sejm.gov.pl` → 403, ale
   **API ELI Sejmu (`api.sejm.gov.pl/eli/...`) działa** i daje oficjalne PDF-y aktów — używać zamiast ISAP.
Narzędzia: brak `pdftotext`/`pdftoppm`; działa `pypdf` (pip `--no-deps`) z `sys.modules['cryptography']=None`
(zepsuty pakiet systemowy cryptography/cffi).

## Synchronizacja ze standardem — Y.6, sprawdzenie na starcie sesji (28.09.2026, ok. 09:20 UTC)

Termin cyklu minął (27.09 04:40 UTC + 18 h). `new-app-standards` sklonowany świeżo (tylko odczyt, bez
`register_repo_root`, bez push — 15.17), HEAD `b59a052` (27.09 08:17). `AKTUALIZACJE.md` — nadal 112 linii,
brak nowego wiersza. `diff` mirrora: `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md` — identyczne.
Jedyna różnica: `docs/przyklady/pwa/` (+ `README.md`/`PROMPT.md` przykładów) — znana od 26.09, czeka na decyzję
właściciela (porównanie `public/sw.js` ze wzorcem). **Zero nowej treści →** `interwał_h = min(48, 18 × 1,5) = 27`,
`licznik_zero_z_rzedu = 2`.

## Sesja decyzji po kolei (28.09.2026)

Polecenie właściciela: przerobić `docs/lista-do-zrobienia.md` po kolei, pytania z ≥3 wariantami. Rundy pytań
idą od najstarszych otwartych ⚠️. Decyzje rundy 1–2 i co z nimi zrobiono:

- **M3/E21 → 🔴** (było 🟡, samo ostrzeżenie potwierdzone już 25.09 — lista tego nie odnotowała). Nowe pytanie
  `falownikWyspowyAcCoupling` (tak/nie/nie wiem), pokazywane tylko przy rekomendacji mikroinwerterów; „nie wiem”
  = strona bezpieczna (wzorzec M8/E3); brak odpowiedzi → `INCOMPLETE`, ale rekomendacja zostaje widoczna.
- **M12/E22+E36 wodór:** poziom zależny od chemii w `brakWentylacjiOlowiowy(kod, chemia)` — kwasowy 🔴, AGM 🟡.
  Wspólny komponent `ekran-checklisty-chemii.tsx` mapuje teraz `critical` → werdykt „blad”.
- **M12/E27:** górna granica = pole usera „maks. napięcie ładowania instalacji” (wartość całej instalacji, nie
  jednego akumulatora); 14,5/14,6 V tylko w podpowiedzi (`NAPIECIE_LADOWANIA_12V_*` w `constants.ts`).
  Walidacja: wartość < napięcia znamionowego = `INVALID_INPUT` (typowy błąd: 14,6 V wpisane przy 24 V).
- **Pułapka powtórzona i obsłużona:** nowe pole w istniejącym szkicu `usePersistedDraft` — typ pola opcjonalny
  (`?:`) + `?? ""` przy odczycie (stare szkice nie mają klucza). Dotyczy E21 i E27.
- **Licencje norm:** zostaje plan B (świadomie). **27.09 pkt 2–4:** potwierdzone. **Rsi per kierunek:** czeka na
  PN-EN ISO 6946 od właściciela (0,10/0,17 nie ma w żadnym materiale repo — sprawdzone grepem i w PDF-ach).
- **D29:** masa paneli+stelaża jako siła utrzymująca (γG,inf) — ✅ zrobione 28.09 (wpis w sekcji D29).
- **M12 „uproszczone wersje”:** hybryda (odsyłacz dla prostych źródeł, wrapper dla rozbudowanych, Wzorce B budować).
- Nowe pola w tej sesji dostają od razu `pomoc` (chmurka 8.4) — zgodnie z wpisem 28.09 o chmurkach.
- **Błąd naprawiony (28.09): chmurka „?” nie działała na telefonie.** `Chmurka` używała `Tooltip` (Base UI) —
  hover-only, tap nic nie robi. Podmieniona na `Popover` z `openOnHover` (Base UI 1.8.0, API sprawdzone w
  `node_modules`, nie z pamięci). Zweryfikowane Playwright: desktop hover + `Pixel 5` tap + zamknięcie tapnięciem
  obok, na `/wzornik`, `dobor-przekroju-kabla`, E27. **Od 28.09: chmurki weryfikować też emulacją dotyku.**
  Wkład: `docs/wklad-do-standardu.md`.
- **Runda 3 (28.09) wdrożona — D30–D33** (`rejestr-decyzji.md`): E23 🟡 od 80% nośności; E19 falownik 🔴,
  nowy typ „regulator” 🟡; E8 progi rozruchu z praktyki właściciela (zwykły diesel 🟡 ≤ +5°C / 🔴 ≤ 0°C,
  każdy diesel 🟡 ≤ −10°C, benzyna ℹ️) — zastępują sprzeczne −20/−15 źródła; E11 przykładowe moce urządzeń
  jako podpowiedź (nigdy wartość domyślna). Wszystkie progi opisane w tekstach jako ustalenie aplikacji, nie
  norma. **Pułapka E8:** kalkulator zwracał INCOMPLETE bez czasu pracy/dni postoju — nowy 🔴 rozruchu byłby
  niewidoczny, więc „paliwo + temperatura” jest teraz osobną kompletną ścieżką. **Pułapka procesowa:** repo
  nie ma konfiguracji Prettiera — `prettier --write` przeformatowuje cały plik na domyślne reguły (średniki);
  nie uruchamiać, formatować ręcznie w stylu pliku. Do potwierdzenia ✅🤖: poziomy D32, lista/wartości D33.
  **[28.09] D33:** właściciel zlecił AI dopisanie mocy — pompa głębinowa 750 W, klimatyzator split 900 W,
  kamera IP 5 W (19 pozycji). **D32 potwierdzone z korektą:** zwykły diesel 🟡 ≤ +10°C, 🔴 < +5°C (ścisła
  nierówność — +5°C to jeszcze 🟡); teksty: paliwo zimowe od +5°C, arktyczne < −10°C, świece obowiązkowo,
  dodatek zimowy; zdanie „próg zależy od klasy paliwa (dystrybutor)” usunięte na życzenie właściciela.
- **Chmurki „?” — decyzja D34 (28.09):** wariant **B** (wybrany już w poprzedniej sesji, ale nieodnotowany —
  tu uzupełnione) + chmurki mają bogato wyjaśniać, jak i po co działa kalkulator. Realizacja w osobnej sesji,
  moduł po module. Nowe ekrany od razu w tym standardzie.
- **M12 runda „uproszczone wersje” — E28 (28.09):** odsyłacz = drugi wpis w kaflu M12 (`lib/pulpit/registry.ts`)
  z tym samym `href` co ekran-źródło (M4/E12 `cold-c-rate`, już 2 pola) — bez nowego silnika/strony. Duplikat
  `href` między kaflami jest bezpieczny (klucze React per kafel), ale okruszki `NawigacjaEkranu` pokazują moduł
  źródłowy (`znajdzKafelIEkranPoHref` — pierwsze trafienie, M4 przed M12) — świadomie, „jeden ekran, dwa wejścia”.

## Duplikat D29 i przejęcie gałęzi poprzedniej sesji (28.09.2026)

**Pułapka procesowa (kosztowała jedną pełną partię):** start sesji czytał `docs/lista-do-zrobienia.md` z `main`,
a poprzednia sesja pracowała na niescalonej gałęzi `claude/todo-list-review-l7me97` (bez PR) — tam D29 był już
zrobiony (commit `1b365cc`), razem z M12/E28, E31 i notatką przekazania „następny: E23”. Na `main` wpis D29 był nadal
🔲, więc zrobiłem go drugi raz (ta sama matematyka). Wykryte dopiero na prośbę właściciela. Naprawa bez przepisywania
historii (force-push zablokowany): `git revert` własnego commitu + merge gałęzi poprzedniej sesji (konflikt tylko w
liście zadań — scalone ręcznie: wpisy M12 i D32/D33 z tamtej gałęzi, wpis M14 z `main`). **Od teraz na starcie
sesji:** `git fetch` + lista gałęzi `claude/*` z datami i `git log origin/main..origin/<gałąź>` dla gałęzi z
ostatniej doby — notatka przekazania może leżeć poza `main`. Wkład: `docs/wklad-do-standardu.md`.

**M12/E23 (wrapper do M4/E10)** zbudowany według notatki przekazania — szczegóły w rejestrze pokrycia. Decyzja
interpretacyjna do potwierdzenia: przykład Biblii „wilgotny garaż → IP65” jako ℹ️ zalecenie, nie próg (wpis ⚠️).
→ Rozstrzygnięte **D44** (kalkulator 1.2.0): wszędzie z wilgocią zalecane IP65 (🟡 IP55–IP64); namiot/jacht zawsze
wilgotne, minimum IP65 (🔴), zalecane IP67–IP68 (🟡 IP65–IP66) — praktyka właściciela, nie norma. Numer D44 wybrany
z pominięciem D35–D43 zajętych wtedy na niescalonej gałęzi M14 (H.3) — przy scaleniu z `main` bez kolizji.

## Integracja M14 do Biblii (28.09.2026, „Integruj teraz”)

Polecenie właściciela „Integruj teraz” (F.2/F.4) wykonane na gałęzi odtworzonej z `main` po scaleniu PR #183.
- **Rozdział kanoniczny:** `03_M14_Dom_i_Firma_Siec.md` (Filar B, szablon H.1). To pierwszy moduł opisany
  wprost w Biblii, a nie w `docs/zrodla/Tresc_*`. Opracowanie w `docs/zrodla/` zostaje zapisem weryfikacji:
  ✏️ K1–K14, odczyty DANE-1 i tabele stawek per OSD, do których rozdział odsyła zamiast je kopiować.
  W nagłówku opracowania dopisano status „ZINTEGROWANE”.
- **Decyzje D35–D38**; najwyższy numer na `main` przed nadaniem to D34 (H.3a):
  - D35 — cel i kafle;
  - D36 — stawki jako dane z okresami ważności + tryb „moje dane z faktury”;
  - D37 — FREE/PRO dla M14 odłożone, D2 bez zmian;
  - D38 — autokonsumpcja z profili.
- **Rejestry:**
  - `docs/rejestr-pokrycia.md` — sekcja „Moduł 14”, 28 wierszy `todo` (25 ekranów unikalnych; 3 pary
    wspólnych Dom/Firma liczone raz). Nagłówek pasuje do `policz-rejestr.mjs` (mod 14). `audit:n1` go nie
    obejmuje, bo nie ma numeracji Biblii v2.0;
  - `docs/rejestr-twardych-stopow.md` — 5 stopów M14 jako „zaplanowane, bez kodu” (świadomy wyjątek od
    zasady „nie wyprzedza rejestru pokrycia”, bo chodzi o bezpieczeństwo życia na styku z OSD);
  - `slownik-pojec.md` — sekcja „Sieć i rozliczenia energii”; `mapa-wdrozenia.md` — wiersz M14;
  - `backlog-poza-v1.md` — FREE/PRO M14; `docs/pulpit-i-nawigacja.md` — pozycja kafli (✅🤖, do decyzji);
  - `00_Biblia.md` — dokument 03. Przy okazji poprawiona nieaktualna wersja rejestru decyzji w tabeli
    (1.11 → 1.14).
- **Audyt przyrostowy N.2 rozdziału** (mechanicznie, grep):
  - każdy identyfikator opracowania (K1–K14, R1–R10, RF1–RF3, W3/W4/W6, D1–D14, F1–F13, 5 narzędzi AI)
    ma odpowiednik w rozdziale;
  - każda liczba dziesiętna z rozdziału występuje w opracowaniu;
  - pierwsze przejście znalazło 7 braków (✏️ K2, K10, K11, grupy G12as/G13, okres wypowiedzenia umowy,
    usługi systemowe BESS, portale OSD) — uzupełnione od razu.
- **Pułapka numeracji:** „Kafel 14” to już Ustawienia (D9). Kafle M14 nazywać nazwą albo „M14-D” / „M14-F”.
- **Otwarte:**
  - dane (W3-PGE, W3-Enea netto, Stoen C22a/b, W4, W6, `C_rk`, stawki przyłączeniowe IV–VI, 495,16);
  - decyzje (pozycja kafli, domyślne TCO `N`=15/`r`=0/`g`=0 jako ✅🤖).
  
  Kod M14 zablokowany bramką N.3 (audyt końcowy całej Biblii) i DANE-1.

## M14 — decyzje D39/D40 i „Ścieżka UE” (28.09.2026)

- **Właściciel rozstrzygnął dwie otwarte decyzje M14:**
  - pozycja kafli → **D39**: na końcu, za kaflem 13, a później preset onboardingu;
  - parametry TCO → **D40**: `N` = 15, `r` = 0, `g` = 0 plus suwak, plus nowa opcja **„Ścieżka UE”**.
- **Źródło „Ścieżki UE”:** KE DG ENER, *EU Reference Scenario 2020*, arkusz „main results”, zakładka `PL_A`, wiersz „Average Price of Electricity in Final demand sectors (€'15/MWh)”. Punkty 2020–2050: 123,57 / 133,59 / 145,49 / 146,60 / 155,50 / 157,34 / 158,87. Arkusz podaje: +1,65%/rok (2020–2030), +0,44%/rok (2030–2050).
- **Na 28.09.2026 strona KE nie ma nowszej edycji.** REF2025 był konsultowany w latach 2024–2025, ale nie znalazłem publikacji.
- **Pułapki:**
  - linki `circabc.europa.eu/ui/.../details?download=true` zwracają przez curl 404 (to aplikacja Angular). Działa `https://circabc.europa.eu/rest/download/<id>`;
  - `openpyxl` nie ma w systemie. Instalacja lokalna: `pip install --target <scratchpad>/py`.
- **Audyt:** wiersz ceny w arkuszu to średnia dla **wszystkich** odbiorców końcowych, a status podatków jest nieokreślony. Średnia UE z arkusza (2020: 148,71) nie równa się wykresowi „po podatkach” w raporcie (151). Dlatego do obliczeń wchodzi **tylko dynamika realna**, nigdy poziom.
- **Doprecyzowanie przy okazji:** `r` = 0 oznacza wynik w dzisiejszych zł. `g` (suwak i UE) oznacza zmianę ponad inflację. Wcześniejszy zapis „suma nominalna” był nieprecyzyjny przy cenach wpisywanych dziś.
- **Lista zadań:** osobne wpisy „PDF-y od właściciela (PGE, PME)” (polecenie „Dodaj do listy zadań”) oraz „Ścieżka UE do pliku danych i jej aktualność”.

## M14 — D41 „Ścieżka UE + inflacja” (28.09.2026)

- **Polecenie właściciela:** dwie opcje wzrostu cen na 15 lat: plany UE, oraz plany UE plus średnioroczna inflacja.
- **Wzór:** Fisher `(1+g_UE)(1+π)−1`.
- **Źródła π:**
  - cel NBP 2,5% ±1 pkt, CPI — Uchwała RPP nr 7/2025, M.P. 2025 poz. 1013. Pobrane z `api.sejm.gov.pl/eli/acts/MP/2025/1013/text.pdf`, bo `nbp.pl` blokuje boty kodem 403;
  - średnia GUS z 15 lat 3,58% (2011–2025, geometryczna) z CSV „Roczne wskaźniki cen … od 1950 roku” (stat.gov.pl, kodowanie cp1250).
- **Pułapka źródła:** w pliku GUS wiersz 2025 ma opis „Rok poprzedni = 101” zamiast „= 100”. To błąd opisu, wartość 103,6 przyjęta.
- **Audyt (czapka rewidenta):**
  - inflacja musi obejmować wszystkie koszty bieżące, inaczej off-grid wychodzi sztucznie tanio;
  - suma nominalna przy `r` = 0 faworyzuje inwestycje na starcie, więc ranking idzie według złotych dzisiejszych, a suma nominalna jest pokazywana obok jako „ile zapłacisz”;
  - właściciel nazwał wariant z inflacją „realnym wzrostem”, a w ekonomii to cena nominalna. W UI unikamy słowa „realny”.
- **Otwarte:** która π ma być domyślna (✅🤖 NBP).
- **[28.09.2026] D42:** właściciel chce przełącznik ścieżek cen dokładnie w miejscu suwaka procentów (D7/F8). Jedno pole „Wzrost cen energii”: segmenty „Suwak %” / „Plany UE” / „Plany UE + inflacja”. Treść pod nimi podmienia się w tym samym miejscu, a tabela A–D przelicza się od razu.
- **[28.09.2026] D43:** właściciel wybrał domyślną inflację GUS (średnia 15 lat, 3,58%) zamiast proponowanej NBP 2,5%. Uzasadnienie właściciela: oficjalna inflacja jest zaniżona względem cen. Uwaga rewidenta w D43: to ten sam wskaźnik CPI, a różnica wynika z okna 2011–2025 z szokiem 2022–2023. Przykład kontrolny: 1,9440 w roku 15 i ≈109 699 zł.

## Audyt końcowy N.3 całej Biblii (28.09.2026, polecenie „Audyt końcowy”)

Tryb Audyt (czapka rewidenta). Warstwa „w pełni na końcu” z N.2 — wszystko od nowa, bez „już sprawdzone”.

- **Mechanicznie, w obie strony:**
  - `pnpm audit:n1`: każda pozycja źródła M1–M13 ma wiersz w rejestrze. Braki w plikach `Tresc_*` (M2 1.19, M3 2.15, M12 8.8, M13 7.7, M9 katalogi) są już znane i opisane — to nie nowe luki.
  - `policz-rejestr`: 4 wiersze „?” to sekcja „Funkcje przeniesione” (bez modułu z definicji), nie luka.
  - Rejestr decyzji D1–D43 ciągły.
  - `🔎 TD` ↔ `dlug-techniczny.md`: **TD20 i TD21 bez znacznika w kodzie** — naprawione (tylko komentarze).
  - Terminy `🔎 (do: …)`: brak przeterminowanych.
- **Metadane Biblii:** tabela w `00_Biblia.md` miała nieaktualne wersje 6 plików. Nagłówki mapy, backlogu i słownika też były nieaktualne. Poprawione. Do indeksu dopisane 3 istniejące rejestry.
- **Treść M14 na tle reszty (sens N.3):**
  1. **M7:** warunek zimowy scenariusza D (D5/D7/F8) potrzebuje ekranów M7 7.2 i 7.37, oba `todo`. Zapisane w rejestrze pokrycia.
  2. **M8:** rozdział M14 i stop „backfeed” odsyłają szczegół normowy przełącznika do M8, ale w M8 nie ma na to miejsca. Norma HD 60364-5-551 jest nieobecna (`docs/normy-brakujace.md`, dopisane M14). **Decyzja właściciela.**
  3. **M2/E17 i M7/E8 (kod istnieje):** brak ostrzeżeń „agregat w pomieszczeniu” (CO) i „agregat bez przełącznika”. W M14 to twarde stopy, a źródło M2/M7 ich nie wymaga. **Decyzja właściciela**, czy dopisać je do istniejących ekranów.
- **Rozdziały poza Biblią:**
  - „Dobór napięcia” — rozstrzygnięty 13.09 (rozbudowa M4/E2). `docs/zrodla/README.md` wciąż mówił „nierozstrzygnięte”, dopisana adnotacja.
  - **„Oświetlenie LED”** (szkic 14.09) czeka na kartę katalogową taśmy. Nie było go na liście zadań, dopisany. **Decyzja właściciela:** czy to rozdział blokujący N.3.
- **C.7:** 10 otwartych ✅🤖 w kodzie i rejestrach czeka na potwierdzenie właściciela (lista w `docs/lista-do-zrobienia.md`).
- **Sprawdzone niezależnie z danych pierwotnych:**
  - przykład kontrolny M14: 81 444 / 100 143 / 109 699 zł, mnożniki roku 1 i roku 15;
  - średnie GUS: 3,58 / 4,59 / 3,37 / 3,32;
  - nachylenia UE: 1,65% i 0,44%.

  Wszystko zgodne co do grosza.
- **Wynik:** audyt **nie jest jeszcze zamknięty**. Zamknie go odpowiedź właściciela na 4 decyzje: M8/przełącznik, stopy agregatu w M2/M7, status LED, ✅🤖. Do tego czasu bramka N.3 trzyma kod M14.

## Audyt N.3 — decyzje 1–3 właściciela wykonane (28.09.2026)

- **D47:** szczegół przełącznika sieć – 0 – wyspa mieszka w M14/D11; w rozdziale i w rejestrze stopów „🔎 w M8” przekreślone z adnotacją (F.5).
- **D48:** wspólny blok `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo.ts`, używany przez M2/E17 (1.1.0) i M7/E8 (1.3.0), narzędzia AI (opcjonalne pola, wspólny schemat `lib/ai/tools/agregat-bezpieczenstwo-schema.ts`) i UI (`components/agregat/pola-bezpieczenstwa-agregatu.tsx`). 🔴 w budynku (czad) i 🔴 bez przełącznika — zawsze, przy sieci i bez (zasada właściciela). 3 notki ℹ️ zawsze: gorące części/opary, paliwo osobno, gaśnica. Teksty PL/EN/RU.
  - **Pułapka:** `usePersistedDraft` zastępuje cały stan zapisem z IndexedDB, bez scalania z `poczatkowy`. Szkic zapisany przed dodaniem pola ma `undefined` zamiast `""`. Zabezpieczone (`|| null` w UI, `!= null` w jądrze). Dotyczy każdego ekranu, któremu dochodzi pole — kandydat do `docs/wklad-do-standardu.md`.
  - Dwa wyjątki (wejście AC falownika, odbiorniki wprost w agregat) to ✅🤖 — dopisane do decyzji 4.
- **D49:** szkic LED = kandydat poza Biblią; zapisany w rejestrze decyzji, backlogu, liście zadań i nagłówku szkicu.
- **Stan N.3:** otwarta tylko decyzja 4 (✅🤖).
- **Przekazanie:** na polecenie właściciela ta sesja nie pisze kodu M14. Instrukcja dla następnej sesji: `docs/przekazanie-nastepnej-sesji.md` (odsyłacz na górze `docs/lista-do-zrobienia.md`).

### Decyzja 4 audytu N.3 — odpowiedzi właściciela (28.09.2026)

- Pozycje 1–2 (D29, D32) były już zapisane na `main` przez równoległą sesję — pytanie w audycie wynikało z tego, że
  audyt robiono na gałęzi M14 bez tamtych commitów (lekcja: przed zadaniem pytań właścicielowi `git fetch` + sprawdź
  `main`, czy odpowiedź już nie istnieje). Nic nie zginęło.
- Odpowiedzi: 1 B (= stan `main`), 2 już ustalone, 3 zostawić, 4/7/8 odłożone, 5 odłożone do PKN (wartości 0,17/0,10/0,13
  podane przez właściciela, przypisanie do przegród do sprawdzenia z normą). Bez odpowiedzi: 6, 9, 10, 11, 12.
  Szczegóły: `docs/przekazanie-nastepnej-sesji.md`, `docs/lista-do-zrobienia.md`.
- **D50 (28.09.2026):** właściciel odłożył pozostałe pytania; bramka N.3 dla M14 zdjęta — kod M14 może startować.
  Stan i kolejność: `docs/przekazanie-nastepnej-sesji.md`, sekcja „STAN NA TERAZ”.

## M12/E38 — uziemienie małej instalacji i dryf rejestru twardych stopów M5 (28.09.2026)

- **E38 zbudowany** jako wrapper (hybryda) do M5/E9/E11. Treść `Tresc_Modul_12` to jedno zdanie — logika wzięta z
  Biblii §12.53 (dawne 8.65), bez liczb i norm spoza niej. Twardy stop obudowy falownika bierze **poziom** z
  `obudowaNiepolaczonaZGsw()` M5/E11 (echo), ale ma własny kod `UMI-…`, bo tekst M5 mówi o GSW budynku, której w
  kamperze/na jachcie nie ma. Poziomy 🔴 gniazd i ℹ️ wilgoci — ✅🤖 do potwierdzenia (lista zadań).
- **Dryf znaleziony (Y.2):** stopy `critical` całego M5 nie trafiły do `docs/rejestr-twardych-stopow.md` (4.3).
  Dopisane tylko M5/E11; reszta jako zadanie 🔲 z wysokim priorytetem. Szybkie wykrycie: pętla po
  `lib/core/modules/<moduł>/*/warnings.ts`, wyciągnięcie kodów z `level: "critical"` i `grep` każdego w rejestrze.
- **Pułapka narzędziowa:** `playwright` nie jest w `node_modules` repo — skrypty weryfikacyjne importują
  `/opt/node22/lib/node_modules/playwright/index.mjs`; headless bez `locale: "pl-PL"` pokazuje teksty EN.

## M14 — start kodu: plik danych `rozliczenia-pl-2026` i część Sieć (28.09.2026)

- **Zakres:** Krok 2a–2c przekazania (bez D3). Silniki `lib/core/modules/siec/*` (8 modułów, wszystkie na liście strażnika
  i18n), dane `lib/core/dane/rozliczenia-pl-2026`, 9 ekranów, kafle 15/16, narzędzia AI `rozbij_rachunek_za_prad`,
  `dobierz_taryfe`, `policz_oplate_za_moc_bierna`. Dwa pozostałe narzędzia z rozdziału (`porownaj_scenariusze_przejscia`,
  `oszacuj_koszt_powrotu_do_sieci`) czekają na TCO i stawki opłat przyłączeniowych.
- **Decyzja techniczna (bez decyzji właściciela — to wykonanie D36):** bramka DANE-1 wymuszona schematem —
  `pewnosc: z.literal("potwierdzone")`; test sprawdza, że podmiana na „wtorne-A” wywraca parsowanie. Ścieżka i wzorzec
  zapisane w `kontrakty-rdzenia.md` §9.
- **Weryfikacja niezależna:** przykład kontrolny §4 (81 444 / 100 143 / 109 699 zł, mnożniki roku 1 i 15) przeliczony w
  Pythonie przed implementacją — zgodny co do złotówki (GUS: 109 699,5 zł, test sprawdza część całkowitą). Progi opłaty
  mocowej G sprawdzone w PDF URE 58/2025 (art. 89b ust. 3: poniżej 500 / od 500 do 1 200 / powyżej 1 200 do 2 800 /
  powyżej 2 800). Pozostałe przykłady rozdziału (0,0381; 0,9 kW; 1 107 zł; +55,3%) w testach.
- **Pułapka:** ścieżka UE z bazą 2026 i N = 25 kończy się na 2051, a projekcja na 2050 — silnik zwraca `OUT_OF_SCOPE`,
  nie ekstrapoluje. Przy budowie D7/F8 UI musi to obsłużyć (np. maks. N = 24 przy „Plany UE”).
- **Pułapka interpretacyjna (zapisana jako założenie, nie decyzja):** limit zwrotu depozytu 20%/30% liczony od wartości
  energii (E × cena), bez mnożnika 1,23 — tak brzmi art. 4 ust. 11a („wartości energii elektrycznej wprowadzonej”).
- **Weryfikacja w przeglądarce:** `pnpm start` + `playwright-core` (Chromium `/opt/pw-browsers/chromium`) — D1 2 373 zł,
  F3 0,0381, D12 0,9 kW, D2 ranking; jedyne błędy konsoli to `/_vercel/insights` (lokalnie nieistniejący skrypt).
- **Pakiet kontroli lokalnie** (CI nie działa do 1.10): typecheck, lint (2 stare ostrzeżenia `<img>`), i18n-guard, 1 901
  testów, build, audit:gate, audit:n1 — zielone.


## M14 — rozdział zbudowany w całości (28.09.2026, „Rób dalej… commit push pr i merge”)

- **Zakres:** reszta części Sieć (D3, D13, D14, F6, F7, F12, F13), cała część Przejście (D4–D7, D9–D11, F8–F10), kreator
  `/kalkulatory/sciezka-przejscia`, pełne listy ekranów w kaflach 15/16. Nowe silniki `siec/bilans-miesieczny`,
  `scenariusze-przejscia`, `przelacznik-siec-wyspa`, `koszt-powrotu`, `strumienie-bess` (na liście strażnika i18n), plik
  `lib/core/dane/dotacje`, narzędzia AI `porownaj_scenariusze_przejscia` i `oszacuj_koszt_powrotu_do_sieci` (5/5 z rozdziału).
- **Wzorzec szkiców (decyzja techniczna):** każdy szkic ma jednego właściciela (`usePersistedDraft`), ekrany echo czytają go
  `useOdczytDraftu` i nigdy nie piszą. Właściciele: D1/F1 `siec-rachunek-*`, D3 `siec-zuzycie-dom`, F6 `siec-zuzycie-firma`
  i `siec-pv-firma`, D4 `siec-pv-dom`. Segment Dom/Firma ekranów wspólnych Przejścia — jeden szkic `siec-segment-przejscia`.
  F7 czyta szkic E23 `oplacalnosc-magazynu` (koszt 1 kWh z cyklu) — zmiana pól E23 zepsuje echo F7.
- **Pułapka:** `new Date()` na statycznie prerenderowanej stronie (dotacje: status naboru) daje błąd hydracji —
  `useSyncExternalStore` z migawką serwera = `stanNa` pliku.
- **Pułapka:** parametr ostrzeżenia z wewnętrznym id (`{strumien}`) pokazałby użytkownikowi kod — rozbite na dwa klucze
  słownika (`SIEC-BESS-STRATNA-AUTOKONSUMPCJA`, `SIEC-BESS-STRATNY-ARBITRAZ`).
- **Nic z pamięci:** linki regulaminów dotacji `null` (W6, TLS), stawki przyłączeniowe od użytkownika, ceny BESS z materiału
  nie weszły do kodu, norma przełącznika 🔎 (`SIEC-PRZELACZNIK-NORMA-BRAK` zawsze widoczne). Uproszczenia: TD23.
- **Pakiet kontroli lokalnie** (CI nie działa do 1.10): wyniki w opisie PR.

## M14 — DANE-1 uzupełnione: Enea netto, Stoen C22, abonament C Tauronu (29.09.2026, „Zrób to”)

- **Enea:** pełna taryfa 2026 to skan w załączniku decyzji URE (strona OSD, link „Decyzja Prezesa URE z dnia 17 grudnia
  2025 r.”) — skopiowana do `docs/zrodla/`, stawki odczytane wizualnie (render strony, nie OCR). Kontrola odczytu:
  netto × 1,23 = informacja OSD o stawkach brutto (grupy G); grupy C nie mają kontroli brutto (dokument OSD obejmuje
  tylko gospodarstwa domowe) — test utrwala wartości.
- **Pułapka dla danych:** Enea (C12a/b, C22a/b) i Stoen (C22a/b) mają w taryfie **jedną** stawkę zmienną sieciową dla
  całej energii w grupach dwustrefowych — strefy różnicują tylko cenę sprzedaży. Silnik liczy per strefa, więc stawka
  wpisana dla obu stref (opis w `zrodlo`). Nie „uzupełniać” drugiej strefy z innego OSD.
- **Tauron C21/C22:** abonament tylko dla okresu 1-mies. (9,50) — przy innym okresie silnik wymaga wpisu z faktury;
  test rachunku przepisany z „brak abonamentu Tauron C” na ten przypadek.
- **Dostęp sieciowy 29.09.2026:** `www.operator.enea.pl` działa; `pgedystrybucja.pl` nadal bez połączenia (TLS) —
  PGE czeka na PDF od właściciela.

## Chmurki „?” i migawka „i” — infrastruktura + M12 (29.09.2026, D51)

- **Polecenie właściciela:** D34 (wariant B) + odpowiedzi 29.09: `hint` usunąć i przenieść do „?”, tłumaczenia PL/EN/RU od
  razu, robić „?” i „i”, a regułę „ekran w komplecie” zapisać i **pilnować** (D51, Dyrektywa #15, wkład do standardu).
- **Stan wyjściowy (policzony):** 220 ekranów, `pomoc=` na 7, `hint=` na 115, `MigawkaBox` na 29; ~590 `<Pole>` + ~49 surowych
  `<input>/<select>`. Po D34 z 36 zmienionych ekranów 30 bez chmurek (cały M14) — dryf, powód strażnika.
- **Architektura:** treść w `lib/i18n/pomoc/<moduł>.ts` (`pl` + `en`/`ru: Tlumaczenie<typeof pl>`), scalana w
  `lib/i18n/pomoc/index.ts`; wpis = ekran (`migawka` + `pola`) albo grupa pól komponentu wspólnego (`pola`, np.
  `kable-male-instalacje`, `checklista-chemii`). Komponenty `components/ui/pomoc.tsx`: `PomocPola` (id ekranu i pola
  typowane — literówka się nie kompiluje) i `MigawkaInfo` (zakładki „Po ludzku”/„Fizyka”, tylko klik — ma przyciski).
  `NaglowekEkranu` przyjmuje `ekran`, `wzor` (= `result.formula`) i `parametry`. Liczby ze stałych silnika: `params` /
  `parametry` z `{nazwa}` (wspólna funkcja `podstaw()` w `lib/i18n/t.ts`).
- **Pułapka (naprawiona przed commitem):** `Pole` owijał `pomoc` w `PomocPole`, a `PomocPola` sam jest „?” — wychodziła
  chmurka w chmurce z samym „?” w środku. `Etykieta` rozpoznaje `PomocPola` (`isValidElement` + `type`) i nie owija.
- **Strażnik:** `scripts/check-pomoc-guard.mjs` (+ test w `lib/i18n/__tests__/pomoc.test.ts`), w CI i w `CLAUDE.md`.
  Lista zapadkowa `scripts/pomoc-guard-baseline.json` — startowo 243 pliki, po M12 226; maleje z każdym modułem.
- **MigawkaBox:** tekst przeniesiony do „i” (pole „O co chodzi”) i ramka usunięta z ekranu — ta sama zasada co `hint`
  (bez dublowania, bez nieprzetłumaczonego tekstu).
- **Znane ograniczenie:** etykiety pól, nagłówki i komunikaty na stronach są nadal tylko po polsku (strony nie są jeszcze
  w i18n) — tłumaczone są komunikaty silników oraz cała treść „?” i „i”. Wzór w „Fizyka” jest w zapisie LaTeX bez
  renderera (tak jak dotąd w `WynikSzczegoly`).
- **Weryfikacja:** Playwright (iPhone 13) — „i” i „?” otwierają się na dotyk, PL/EN/RU, `{params}` podstawione, bez
  poziomego przewijania.
- **Zamknięte 29.09.2026:** wszystkie moduły (M1–M14) w komplecie, lista zapadkowa pusta (255 plików zgodnych). Prop `hint`
  usunięty z `Pole`/`PoleSelect` — typecheck pilnuje, że nie wróci; `PoleCheckbox` go zachowuje. Pułapki z partii: surowy
  `<input>` w `{warunek && (...)}` + `PomocPola` obok wymaga fragmentu `<>…</>`; powtarzające się etykiety w listach
  (np. „Nachylenie” w M1/E4) wymagają osobnych id pól. Przy M10 znaleziona możliwa pomyłka Δt w silniku prognoz — pytanie
  A/B w `lista-do-zrobienia.md`, nie ruszane.

## Opisy narzędzi AI — strażnik (29.09.2026)

- Właściciel: „trzeba naprawić” (pytanie o rozbudowane opisy funkcji dla AI). 27 narzędzi dostało zdanie „Użyj, gdy…”.
- Strażnik `scripts/check-ai-tools-guard.mjs` (+ test `lib/ai/__tests__/ai-tools-guard.test.ts`): description z
  „Użyj, gdy ” (sprawdzane po sklejeniu `"…" + "…"` — wcześniejszy grep po liniach dawał fałszywe braki, bo zdanie bywa
  rozcięte na „Użyj, ” / „gdy”), rejestracja w `lib/ai/pytaj-asystenta.ts`, pokrycie `calculator.ts` → narzędzie
  (wyjątek tylko komentarzem `ai-tool: nie dotyczy — <powód>`). Lista zapadkowa `scripts/ai-tools-guard-baseline.json`
  startowo 18 kalkulatorów. Dyrektywa #15 v1.4, `CLAUDE.md`, CI.

## M12/E38 — D52 i sprawdzenie kolizji po zmianach na `main` (29.09.2026)

- Przed zmianą sprawdzone `main` po scaleniu PR #189 (D51 „pomoc” we wszystkich modułach, M14 w kodzie): E38 przeszedł
  migrację chmurek do `PomocPola` (teksty w `lib/i18n/pomoc/m12-kalkulator-mobilny.ts`) — bez kolizji z silnikiem.
  Dryf rejestru twardych stopów M5 nadal otwarty (nikt go nie ruszył).
- **D52:** gniazda bez styku ochronnego 🟡 z wyjaśnieniem roli bolca, wilgoć 🟡. Przy okazji: ostrzeżenie o wilgoci tylko
  przy DC — przy 230 V z kompletem uziemienia dawałoby fałszywe 🟡. **Pułapka:** zmiana poziomu = też teksty migawki „i”
  (mówiły „nie = czerwony stop”) i opis narzędzia AI, nie tylko `warnings.ts` — grep po kodzie ostrzeżenia i po „czerwony”.

## M12/E38 — D57 słupek, namiot, jacht (29.09.2026)

- **Kolizja numerów (dwukrotna):** równoległe sesje zajęły na `main` najpierw D53 (odpowiedzi na D50), potem D54
  (CRL/gaz/Rsi) — pętla zwarcia ostatecznie = **D56**, to rozszerzenie = **D57** (H.3, pierwszy scalony zachowuje numer).
  Lekcja: przed utworzeniem PR zawsze `git fetch origin main` i sprawdź ostatni numer D w `rejestr-decyzji.md` na main.
- Kamper/jacht: pytanie o zasilanie z zewnątrz; przy N–PE w falowniku — czy rozłączane; nie/nie wiem → 🔴 podwójne N–PE.
  Namiot = nowe miejsce: najpierw N–PE na wyjściu; pływające/nie wiem → 🟡 z zasadami (bez pytań o obudowę, gniazda, RCD).
  Kamper/jacht — ℹ️ (wiszący przewód, szpilka; Wzorzec C jachtu). RCD 🔴 tymczasowo do PN-HD 60364-7-721.
- W repo JEST wyciąg PN-IEC 60364-4-41:2000 z 413.5 (separacja) — właściciel pamiętał słusznie; brakuje wydania 2017.
- **Zasada właściciela (29.09.2026):** gdy poziom/decyzję opieram na słowach właściciela, podaję **dosłowny cytat i gdzie
  padł** (data, która wiadomość/sekcja), a nie samo „Twoje »musi«”. Dotyczy raportu i wpisów ✅🤖 w rejestrach.
- **[29.09.2026] Podwójne N–PE — poziom potwierdzony:** właściciel „Wybieram A” (🔴 dla „nie” i „nie wiem”); podstawa
  PN-HD 60364-5-54, 543.4.3 („niedopuszczalne”) — norma była w repo, wcześniej jej nie powiązałem. Na prośbę właściciela
  ekran (sekcja pętli, gdy słupek/keja) i komunikat tłumaczą fizykę: prąd w PE, wybija RCD na słupku, stary słupek bez RCD
  + przerwany PEN, jacht — korozja i marina. Lekcja: zanim oznaczę poziom ✅🤖, grep po `docs/zrodla/` za regułą ogólną.
- Pułapka: w teście `ac` bazowo zmieniony z kampera na garaż — kamper dokłada ℹ️ i pytanie o słupek, więc testy ogólne
  230 V przestałyby mieć pustą listę ostrzeżeń.

## M12/E38 — D56 pętla zwarcia (29.09.2026)

- Właściciel: ochrona na falowniku nie potrzebuje ziemi, tylko zamkniętej pętli obudowa → PE → N–PE w falowniku →
  falownik; trzy warunki (połączenie wyrównawcze PE, N–PE za zgodą producenta, RCD 30 mA za nim). Wdrożone jako D56:
  pola `polaczenieNPE`, `rcd30mA` (INCOMPLETE bez odpowiedzi), oba braki 🔴; RCD — poziom echo `progPowyzejOchronyOsob`.
- Stare autozapisy bez `npe`/`rcd` → `?? ""` (wzorzec `napor-wiatru`), więc wynik INCOMPLETE, nigdy „OK”.
- Otwarte (⚠️ na liście): pojedynczy odbiornik z wyjścia pływającego (separacja elektryczna) — dziś 🔴; bez źródła normy
  nie rozstrzygam.

## Rsi per kierunek — liczby odtworzone (29.09.2026)

- Decyzja z 28.09 („Rsi per kierunek, wartości z PN-EN ISO 6946, właściciel dostarczy PKN”) została zapisana **bez
  liczb** — w pamięci zostało samo „0,10/0,17”. Przy pkt 4 audytu właściciel podał liczby z pamięci
  (0,17/0,10/0,13 ściany/dach/podłoga) i zostały zapisane dosłownie. **Korekta właściciela 29.09:** wiążące są
  wartości z decyzji: **ściana 0,13 · strop/dach (strumień w górę) 0,10 · podłoga (strumień w dół) 0,17 m²·K/W**
  (✅🤖). Kod E8 bez zmian (0,13 wszędzie) do sprawdzenia końcowego z PKN — nie pytać ponownie.
- **Pułapka:** decyzję z wartościami liczbowymi zapisuj od razu z liczbami i ich przypisaniem, nie samym „tak”.

## D53 — odpowiedzi właściciela na odłożone pytania (29.09.2026)

- **M8/E3 zamki:** nowe pole `maOtwarcieReczneMechaniczne` (opcjonalne w typie — stare szkice i wywołania AI go nie
  mają, czytane jak `false`; w UI `?? false`). 🔴 tylko fail-secure bez UPS **i** bez ręcznego otwarcia. E3 → 1.1.0.
- **Agregat (D48 pkt 4):** „zawsze przez rozdzielnię” — enum bez zmian (szkice), zmienione tylko etykiety, teksty
  PL/EN/RU, chmurka i opis AI. Poziomy ℹ️ zostają.
- **Kafle M14:** widoczne we wszystkich 8 presetach — presetów nie ma jeszcze w kodzie (onboarding w backlogu).
- **Bez zmian w kodzie:** M8/E4 gaz (rekomendacja mgła wodna, czeka na wybór), M9/E2 (ESP32 z osobnego zasilania),
  M9/E4 CAN (właściciel jeszcze nie wie; rekomendacja 🔴).

## Sprawdzenie stanu po D53 (29.09.2026, „sprawdź jak daleko poszedł projekt”)

- `main` = scalenie #211; brak otwartych PR; gałęzie `claude/*` przed `main` pochodzą sprzed 28.09 i ich treść jest już
  na `main` (np. `youthful-fermat` → #154). Żadne z otwartych pytań nie zostało rozwiązane równolegle.
- Źródła repo: gaz przy LiFePO4 — Biblia v2.0 §4.10 (mgła wodna / środek do magazynów energii „jedyny skuteczny”);
  CAN — §9.28 to samo ostrzeżenie co RS485. Rsi kierunkowe i kolejność przycinania CRL — brak w repo.
- Poprawione nieaktualne wpisy: lista „Otwarte” w 03_M14 (Enea netto, Stoen C22 były już ✅), tabela i pkt 6 w
  „STAN NA TERAZ”, wskaźnik startowy na górze `docs/lista-do-zrobienia.md`.

## Prognozy M10 — Δt, decyzja A; narzędzia AI domknięte (29.09.2026)

- Właściciel wybrał **A**: punkt prognozy = średnia moc [kW] w oknie 3 h, energia = Σ P × 3 h. Silnik `ai/prognozy` 1.0.0
  sumował same kW (energia ×3 za mała); 1.1.0 mnoży przez stałą `KROK_PROBKOWANIA_H = 3` i ma wzór w `formula`.
  Demo: 27,3 / 26,1 / +1,2 kWh. Ekran nadal na danych demonstracyjnych (TD7), więc bez wpływu na projekty użytkowników.
- **Pułapka:** pola `…Kw` sumowane do wyniku `…Kwh` bez Δt — przy kolejnych szeregach czasowych (symulacja SoC 12.4,
  dane live) krok próbkowania musi być jawny w silniku, nie domyślny „1 h”.
- Narzędzie `policz_bilans_prognozy`; lista zapadkowa `ai-tools-guard-baseline.json` pusta — każdy kalkulator ma
  narzędzie AI albo adnotację `ai-tool: nie dotyczy — powód` (jedyna: `lokalizacja-i-klimat`).

## D54 — CRL od budynku, gaz 🟡 z propozycją, kafle M14, Rsi (29.09.2026)

- **CRL (M5/E2 1.1.0):** `kolejnoscOdBudynku?: OdcinekCrl[] | null` — opcjonalne (stare szkice, AI). Niewymienione
  typy dochodzą na koniec w kolejności ostrożnej. Bez kolejności wynik identyczny jak 1.0.0 (testy A.1–A.4 bez zmian).
  Przy CRL ≥ 1000 zawsze ℹ️ `CRL-SPD-ZALECANY` — preferencja właściciela, nie wymóg normy; werdykt nadal „nie wymaga”.
- **Gaz (M8/E4 1.1.0):** ℹ️ `GASZ-PROPOZYCJA-LIFEPO4` przy każdym środku spoza wymaganych w strefie LiFePO4.
  Chłodzenie/zamrażanie ogniw to propozycja AI bez liczb (brak źródła) — ✅🤖.
- **Rsi:** bez zmian w kodzie (0,13 ze źródeł); wartości kierunkowe czekają na PN-EN ISO 6946.
- Otwarte z listy D50: tylko M9/E4 CAN.

## Whitepaper IEC 62109-1 przeczytany + przegląd kompletności źródeł (27.09.2026)

- **Dlaczego wisiał nieprzeczytany:** sesja dodająca 4 pliki (27.09) rozpoznała go tylko po
  metadanych i odłożyła odczyt jako 🔲; sesja „ekrany odblokowane” wzięła na warsztat tylko normy
  odblokowujące ekrany i whitepaper pominęła, choć odnotowała go jako nieprzeczytany. Pułapka:
  wpis 🔲 „dokończyć odczyt” nie ma właściciela-ekranu, więc przegrywa z zadaniami kodowymi —
  przy każdym „przerób nowe dokumenty” przejrzyj wszystkie 🔲 dotyczące `docs/zrodla/`.
- **Wynik:** TI SLYY102 (2016), 11 stron (indeks podawał 14 — błąd z odczytu metadanych, poprawiony).
  Izolacja wewnątrz falownika (projektant elektroniki), nie instalacja → nic do kodu, luka normy 🟡.
- **Przegląd 22 folderów:** tylko ten plik był nieprzeczytany. 6 PDF `document-download 4–9`
  miało treść w `.txt`, ale indeksy nie wymieniały nazw oryginałów — dopisano mapowanie. Skrypt
  kontrolny (każdy plik folderu wymieniony z nazwy w `00-INDEKS.md`) — do powtarzania przy kolejnych paczkach.

## Przegląd niescalonych gałęzi zdalnych (29.09.2026)

- **Pułapka:** klon w sesji chmurowej jest płytki (`git rev-parse --is-shallow-repository` → `true`). Na płytkim klonie
  `git diff main...gałąź` daje „no merge base”, a `rev-list main..gałąź` pokazuje setki „niescalonych” commitów na
  prawie każdej gałęzi. Przed oceną gałęzi zawsze `git fetch --unshallow origin`.
- **Wynik (po odpłytczeniu):** 10 gałęzi miało commity spoza historii `main`, ale 8 z nich było już scalonych przez
  squash (PR #136–#139, #149, #153, #154, #163 — ta sama treść, inne SHA). Naprawdę brakowały 2 commity:
  `49b2d64` (`prace-rozdzialy-status-qb0uwf` — 2 wpisy 🔲 listy zadań: powrót CI 1.10, Δt prognoz M10) i `f139f78`
  (`screen-fixes-new-documents-80kzcm` — odczyt whitepapera IEC 62109-1 + mapowanie PDF→txt w indeksach). Przeniesione
  na `claude/git-branches-merge-o7sy31`; konflikty wyłącznie typu „oba dopisały na końcu” w plikach append-only —
  zachowane obie strony (PR #219). Pozostałe gałęzie zdalne nie wnoszą już nic ponad `main`.
- **Błąd procesu tej sesji:** przegląd powtórzył pracę z 27.09 — lista gałęzi-śmieci jest wyżej („Porządki gałęzi na
  GitHubie”, 27.09.2026). Przy poleceniu „sprawdź/scal gałęzie” najpierw ta lista; sprawdzać tylko gałęzie spoza niej.
  Poza listą 27.09 do usunięcia doszły gałęzie scalone później (wszystkie `claude/*` z PR #166–#219, m.in.
  `prace-rozdzialy-status-qb0uwf`, `screen-fixes-new-documents-80kzcm`, `e38-uziemienie-c3xs6h`,
  `nowy-rozdzial-biblia-kalkulator-to73by`). Stan 29.09: **każda gałąź zdalna poza `main` jest do usunięcia**.
  Kasowanie z sesji nadal niemożliwe (`git push --delete` → HTTP 403, sprawdzone 29.09) — robi to właściciel ręcznie.

## Synchronizacja ze standardem — Y.6 (29.09.2026, 19:00 UTC, na polecenie właściciela „przeprowadź aktualizacje”)

- Świeży płytki klon `new-app-standards` (`af63da7`, 29.09 18:50 UTC), tylko odczyt, bez `register_repo_root`.
  `AKTUALIZACJE.md` 112 → 114 linii: dwa wiersze 2026-09-29 (blok U.4 z tego projektu — 8.12, 11.9, 15.23, dopiski
  4.3/5.5/8.4/9.0a/10.4/17.1a/17.9; oraz 8.4b — forma „i”: zakładki „Po ludzku”/„Fizyka”).
- *NIETYKALNE (pełny nadpis):* `docs/standards/` 00-INDEKS, 04, 05, 08, 09, 10, 11, 15, 17. GOD BOOK `v2_39`,
  `PROMPT_STARTOWY.md`, `docs/przyklady/i18n/*` — identyczne. `docs/przyklady/pwa/` — nadal świadomie niekopiowany
  (pytanie do właściciela z 26.09 otwarte).
- *ADAPTOWALNE (patch):* `CLAUDE.md` — z `CLAUDE.template.md` dopisane 3 akapity: 15.23 (nowy wiersz) oraz 15.21 i 15.22,
  których brakowało od synchronizacji 24.09 (wtedy czekały na zgodę; od korekty Y.6/Y.8 z v2.38 ADAPTOWALNE stosuje się
  bez pytania). Skill: przywrócone „decyzja D#” ze źródła.
- *LOKALNE:* `docs/wklad-do-standardu.md` — 9 wpisów → ✅ skonsolidowane (w tym wpis 28.09 o liście na `main`, który nie
  miał linii `Status:`). Otwarte po stronie źródła: pkt 7–13, 15, 17–21 wpisów z 27–29.09 i wpisy z 26.09 (locale, OCR, N.1).
- **Y.2 — dryf kodu od nowych reguł, naprawiony od razu:** (1) 5.5 — `usePersistedDraft` zastępował stan szkicem;
  teraz `scalSzkic` nakłada szkic na stan początkowy (płytko, tylko zwykłe obiekty) + test „stary szkic bez nowego
  pola”. Wzorzec `?? ""` w ekranach zostaje (nieszkodliwy), nowych już nie wymaga. (2) 11.9 — puste listy zapadkowe
  `pomoc-guard-baseline.json`/`ai-tools-guard-baseline.json` usunięte, strażniki bez logiki listy.
- **Nie naprawione teraz (na liście zadań):** `MigawkaInfo` wobec 8.4b (brak `assumptions` w „Fizyka”, brak panelu od dołu
  na telefonie, cyfry w tekstach „Fizyka”); strażnik rejestru twardych stopów (4.3/11.9).
- **Checklista Y.9:** 1 `docs/standards/` ✅ (20 plików = źródło) · 2 GOD BOOK ✅ v2_39 · 3 `CLAUDE.md` ✅ (patch) ·
  4 pełna Biblia ✅ 14/14 · 5 lista ✅ · 6 wkład ✅ · 7 `docs/zrodla/` ✅ · 8 skill ✅ (patch) · 9 `01_`/`02_` ✅.
  Y.10: bez nowych modułów opcjonalnych (oba obecne).
- **Pakiet lokalny (CI nie działa do 30.09):** typecheck, lint (0 błędów, 2 stare ostrzeżenia `<img>`), `check:i18n-guard`,
  `check:pomoc-guard` (255 plików), `check:ai-tools-guard` (200/200), `audit:n1`, `audit:gate`, test 2089/2089, build — zielone.
- **Routine Y.6** `trig_01892Z45ThAi2T56PJRjQQAh` nie istnieje (not found) — nikt jej nie przestawiał od 27.09; pytanie
  do właściciela na liście.
- Cykl adaptacyjny: nowa treść → `interwał_h = 12`, `licznik_zero_z_rzedu = 0`. Kolejne sprawdzenie najpóźniej
  30.09.2026 ok. 07:00 UTC.

## Y.11 — pierwszy audyt zgodności kodu (29.09.2026, na żądanie właściciela)

- Raport: `docs/audyt-zgodnosci-kodu.md` (nowy plik, LOKALNE). 7 pozycji rejestru: 5 ✅, 1b ⚠️ nowe, 7 ⚠️ znane.
- **1b:** ekrany zmienione 29.09 (m.in. E38 `uziemienie-male-instalacje`, M14 `przelacznik-siec-wyspa`, `components/siec/*`)
  dodały polskie teksty JSX bez `t(...)`. `check:i18n-guard` pilnuje tylko silników — JSX nie ma strażnika, stąd dryf.
  Kodu nie zmieniono (Y.11) — decyzja właściciela A/B/C w raporcie.
- **7:** bramka logowania w `middleware.ts` wyłączona do czasu projektu Supabase — bez zmian od 15.09.
- **Pułapka tej sesji:** `git checkout -B <gałąź> origin/main` po scaleniu PR przez API — lokalny `origin/main` był sprzed
  scalenia (fetch zrobiony wcześniej). Zawsze `git fetch origin main` tuż przed takim resetem.

## D58 — teksty ekranów przez klucze UI-*, strażnik i18n na warstwie UI (29.09.2026, „wybieram A + B”)

- **Architektura:** teksty pisane przez sam ekran (etykiety, nagłówki, akapity) żyją w `lib/i18n/ui/<grupa>.ts` — `pl` (as const)
  jest źródłem, `en`/`ru` typowane `Record<klucz, string>`, więc brak tłumaczenia to błąd `tsc`. Klucze `UI-*`, scalane w
  `dictionaries.ts` obok komunikatów silników — ekran używa zwykłego `t()`/`useTranslate()`. `lib/i18n/ui/index.ts` importuje
  wszystkie części (po dodaniu pliku dopisz import). Test `lib/i18n/__tests__/ui.test.ts`: prefiks, unikalność (także wobec
  `dictionary-pl`), te same klucze i `{parametry}` w EN/RU.
- **Zdanie z wariantami = osobne pełne klucze**, nie sklejanie fragmentów (E38: `-J` jacht / `-K` kamper) — każdy język ma
  własną odmianę i szyk. Tablice etykiet (`MIEJSCA`, `FLAGI`, `KOLEJNOSCI`) trzymają klucze, render przez `t(label)`.
- **Strażnik:** `scripts/check-i18n-ui-guard.mjs` (AST, w `pnpm check:i18n-guard`). Lista zapadkowa
  `scripts/i18n-ui-guard-baseline.json` sporządzona raz 29.09.2026: 248 plików, 3711 tekstów — wszystkie ≤ stanu sprzed
  zmian 29.09 (commit 97dacda). `--pokaz <plik>` wypisuje trafienia, `--policz` bieżące liczby. Liczba per plik, więc także
  dopisanie tekstu do starego ekranu zatrzymuje build — nowy tekst na takim ekranie: `lib/i18n/ui/dopiski-starych-ekranow.ts`.
  Znana luka (w nagłówku skryptu): polskie słowo bez polskich liter, poza JSX i poza nazwami typu `label`, nie jest wykrywane.
- **Korekta zakresu audytu Y.11 1b:** raport mówił o ≈15 plikach; faktycznie ~40 plików M14 + E38 miało nowe teksty (m.in.
  całe `tresci-faq.ts`, `tresci-przejscia.ts`) — przetłumaczone wszystkie (≈580 kluczy). Pliki, w których 29.09 tylko
  przeformatowano stare teksty (hint → „?”), zostały na liście zapadkowej z bieżącą liczbą.
- **Pułapki tej pracy:** (1) generator słowników obcinał wieloliniowe teksty — po wygenerowaniu zawsze sprawdzić, że każdy
  oryginał PL jest w pliku; (2) skrypt podmieniający wstawiał `const t = useTranslate()`, a potem sprawdzał „czy jest
  `useTranslate`” zamiast ścieżki importu — 25 błędów TS2304; (3) heredoc bez cudzysłowu (`<<EOF`) wykonał backticki z
  komentarzy jako polecenia powłoki i wyciął fragmenty komentarzy — do skryptów z kodem TS zawsze `<<'EOF'`; (4) hook
  `useTranslate()` przed każdym wczesnym `return` i osobno w każdej funkcji-komponencie (np. schemat SVG w E38).
- **Poza zakresem (bez zmian):** parametry liczbowe formatowane `toLocaleString("pl-PL")` (np. „1 234”) trafiają do tekstu
  jak są; dane katalogu dotacji (`lib/core/dane/dotacje`) zostają po polsku (nazwy programów).
- **Dokończenie (29.09 wieczór, pełny pakiet):** zielony po jednej poprawce spoza D58 — znów timeouty 5 s w
  `orientacja-powierzchni.test.ts` i `modul1-lokalizacja-tools.test.ts` (za każdym przebiegiem inne testy; w izolacji też
  bywa > 5 s). Pułapka z 25.09 wróciła, bo limit dodawano test po teście. Teraz `{ timeout: 30_000 }` na poziomie
  `describe` dla każdego bloku wołającego `calculateOrientacjaPowierzchni` (pełny rok TMY). Nowy test w tych blokach
  dziedziczy limit — nie trzeba o nim pamiętać.
- **Znane, poza zakresem:** `components/wzorce/krok-z-media.tsx` („Miejsce na zdjęcie/nagranie…”) i okruszki nawigacji
  zostają po polsku w EN/RU — stare teksty z listy zapadkowej, wpis „Tłumaczenie samych stron”.

## Porównanie `public/sw.js` ze wzorcem PWA standardu (29.09.2026, na żądanie właściciela)

- Zamyka pytanie z 26.09 (pkt 2 sprawdzenia Y.6). Raport: `docs/audyt-sw-vs-wzorzec-pwa.md` (LOKALNE). Kod bez zmian —
  decyzja właściciela A/B/C w raporcie (rekomendacja: A etapami = C).
- **Pomiar na buildzie produkcyjnym:** nieodwiedzony ekran offline → `net::ERR_FAILED`; maskotki `public/` i manifest
  offline nie działają; cache `offgrid-v1` rośnie o stare chunki przy każdym deployu ze zmianą kodu (`CACHE_VERSION`
  nigdy niepodbijany, `sw.js` bajtowo stały → SW nigdy się nie aktualizuje).
- **Uśpiony błąd:** `matcher` w `middleware.ts` nie wyklucza `/sw.js`, `/register-sw.js`, `/manifest.webmanifest` —
  po włączeniu bramki Supabase (18.1) niezalogowany dostanie przekierowanie zamiast skryptu SW.
- **Pułapka (testy SW):** `context.setOffline(true)` Playwrighta nie obejmuje `fetch()` z wnętrza Service Workera —
  strona „działa offline”, bo SW pobiera ją z sieci. Prawdziwy offline = ubity serwer. Zgłoszone do standardu (10.8).
- Koszt pełnego precache dziś ≈ 26 MB (HTML 220 kalkulatorów 6,1 MB + chunki 14 MB + `media` 4,2 MB + `public/` 1,5 MB).

## SW — decyzja „wariant C” + poprawka `matcher` (29.09.2026)

- **Decyzja właściciela:** migracja SW do wzorca standardu etapami (C). Plan dla innej sesji:
  `docs/plan-migracji-sw-wariant-c.md` (decyzje C-1…C-3 do potwierdzenia na starcie etapu 1, potem D# w
  `rejestr-decyzji.md`).
- **Zrobione od razu:** `middleware.ts` `matcher` pomija `/sw.js`, `/register-sw.js`, `/manifest.webmanifest`
  (raport, pkt 12). Skutek uboczny, świadomy: odpowiedź ze skryptem SW nie ma nagłówka CSP (SW rozmawia tylko z własnym
  originem). Sprawdzone na buildzie: `/` i kalkulator — CSP jest; trzy pliki PWA — bez middleware.
- **Synchronizacja Y.9 (wycinek):** `docs/przyklady/pwa/` + `README.md` + `PROMPT.md` skopiowane 1:1 z
  `new-app-standards` @ `af63da7` (same dopisania, zero usunięć) — sesja wykonawcza nie potrzebuje dostępu do tamtego repo.
  Pliki `.ts/.tsx` wzorca importują moduły projektu źródłowego (`sonner`, `@/lib/pwa/*`) → `tsconfig.json` `exclude`
  dostał `docs/przyklady` (inaczej `pnpm typecheck` pada).
- **Pułapki znalezione przy planowaniu (do etapu 1):** (1) `/moduly/[id]` wzorzec pomija jako trasę dynamiczną —
  rozwinąć z `KAFLE`; `prerender-manifest.json` jest pusty przez nonce. (2) Po włączeniu Supabase instalacja SW u
  niezalogowanego zapisałaby stronę logowania pod adresem każdej strony (`bezPrzekierowania`) — plan dodaje strażnika.
  (3) Stary cache `offgrid-v1` nie zostanie usunięty przez nowy `aktywuj()` — plan dodaje jawne usunięcie.
  (4) W `.next/static/media` są wersje `-dev` MapLibre (~2,5 MB) w buildzie produkcyjnym — etap 2.
  (5) `pkill -f "next start"` ubija powłokę wywołującą (exit 144) — ubijać po PID / grupie procesów.

## D58 — uzupełnienie + pułapka „dwie sesje w jednym katalogu” (29.09.2026, wieczór)

- Uzupełnienie wpisu „Dokończenie” wyżej: ten sam brak limitu miał też blok TMY w `analiza-zacienienia.test.ts`
  („strata całkowitego napromieniowania na danych TMY (TD14)”) — dostał `{ timeout: 30_000 }` na `describe`.
- **Pułapka:** dwie sesje Claude pracowały równocześnie w tym samym katalogu roboczym i na tej samej gałęzi (obie
  domykały D58). Skutki: pełne pakiety testów szły równolegle (2× obciążenie 4 rdzeni → więcej timeoutów), edycje jednej
  sesji pojawiały się w drzewie drugiej w trakcie pomiaru, commit jednej wszedł pod commit drugiej. Przed startem
  zadania z listy sprawdź `git log`/`git status` jeszcze raz tuż przed commitem i nie uruchamiaj dwóch sesji na jednym
  checkoutcie — druga sesja w osobnym worktree.
- **Otwarte (przywrócone z notatki usuniętej przy konsolidacji):** w pierwszym przebiegu pakietu padły jednorazowo
  4 testy `orientacja-powierzchni`/`modul1-lokalizacja-tools`, choć ich `describe` miało już 30 s (Vitest 4.1.11 dziedziczy
  `timeout` z `describe` — sprawdzone w `@vitest/runner`); dwa kolejne przebiegi zielone, komunikatu błędu nie zachowano.
  Hipoteza (niepotwierdzona): drugi pakiet drugiej sesji w tym samym czasie albo limit dopisany w trakcie pomiaru. Jeśli
  wróci — zapisać pełny komunikat przed ponownym uruchomieniem (10.x: nie zakładać „flaky”).

## Strażnik rejestru twardych stopów — `pnpm check:stopy-guard` (29.09.2026, wieczór)

- Wdrożony wg 4.3 (dopisek 29.09) + 11.9: `scripts/check-stopy-guard.mjs` (AST), w pakiecie przed merge, w `ci.yml`
  i w `CLAUDE.md`. Stan na wejściu: **265 kodów 🔴** w `lib/core/**` → 69 w rejestrze, 145 wyjątków
  (`scripts/stopy-guard-wyjatki.json`: 134 „walidacja-danych” + 11 „poza-zakresem-modelu”), **51 na liście
  zapadkowej** (`scripts/stopy-guard-baseline.json` — stopy inżynierskie albo niejednoznaczne, jeszcze bez wpisu).
- Klasyfikacja wyjątków po `technicalMessage` każdego kodu („oczekiwano > 0”, zakres, sprzeczne pola, dane spoza
  tabeli), nie po nazwie. Niejednoznaczne (np. `ZA-DUZO-OGNIW`, `ZACIENIENIE-PELNY-PANEL`, `SYSTEM-NIE-PRZETRWA-SCENARIUSZA`)
  celowo na liście zapadkowej — rozstrzygane przy uzupełnianiu rejestru (wpis w rejestrze albo wyjątek z powodem).
- **Pułapki wykryte przy budowie:** (1) nie każdy stop to literał `{ code, level: "critical" }` — są funkcje pomocnicze
  `ostrzezenie("KOD", "critical", …)` (M14), poziom z innego ostrzeżenia (`obudowaNiepolaczonaZGsw().level`), `level:
  zmienna` (`KONFLIKT-JEDNOCZESNOSCI`) i kod przekazywany parametrem (`brakWentylacjiOlowiowy(kod, …)` dla
  `BK-/LG-OLOW-BEZ-WENTYLACJI`) — pierwsza wersja zbierająca same literały przegapiła 13 stopów, które rejestr już
  wymieniał. Poziom nieliteralny = traktowany jak 🔴 (ostrożnie); kod z parametru = „źródło dynamiczne” do zadeklarowania
  w JSON. (2) Każdy kod w odwrotnych apostrofach w rejestrze liczy się jako wpis — przykład w tekście opisowym
  (`` `PARA-POZA-ZAKRESEM` ``) od razu dał konflikt „i w rejestrze, i w wyjątkach”; w prozie rejestru nie cytować kodów,
  które nie są stopami.

- **[29.09, później] Lista zapadkowa 51 → 2:** 46 kodów dopisanych do rejestru (sekcje wg kategorii, notka HTML-komentarz
  w „Elektryczne / pożarowe”), 3 kody sekwencji montażu (status OUT_OF_SCOPE) do „poza-zakresem-modelu”. Zostają
  `ZACIENIENIE-2-SEKCJE`/`-PELNY-PANEL` — pytanie o poziom (strata uzysku, nie bezpieczeństwo), `lista-do-zrobienia.md`.
  **Rozstrzygnięte tego samego wieczoru (właściciel: wariant B):** oba obniżone do 🟡 `warning` (strata uzysku ≠ twardy
  stop; źródło daje tu 🟡), M3/E13 `CALCULATOR_VERSION` 1.0.1. Lista zapadkowa **pusta** — każdy nowy 🔴 bez wpisu w
  rejestrze albo wyjątkach od razu wywraca `check:stopy-guard`.
  Klasyfikacja po treści funkcji w `warnings.ts` — wyciąganie `technicalMessage` wycinkiem tekstu wokół kodu łapało
  komunikat sąsiedniej funkcji; wiarygodnie tylko przez AST (całe ciało funkcji).

## 8.4b — „i” z założeniami i panel od dołu na telefonie (29.09.2026, wieczór)

- `MigawkaInfo`/`NaglowekEkranu`: prop `wzor` zastąpiony przez `wynik` (`Partial<Pick<CalcResult, "formula" |
  "assumptions">>`, może być `null` przed obliczeniem) — zakładka „Fizyka” pokazuje wzór i założenia bieżącego wyniku.
  Założenia renderuje **jeden** komponent `components/zalozenia-lista.tsx` (pod wynikiem przez `WynikSzczegoly` i w „i”).
  Nowy ekran z wynikiem: `wynik={result}` w `NaglowekEkranu`, nie osobne pola.
- `Chmurka` (`components/ui/chmurka.tsx`) na szerokości < 640 px renderuje Base UI `Drawer` (panel od dołu) zamiast
  `Popover` — dotyczy „?” i „i” (8.4b: „oba otwierają się tak samo”). Hook `useTelefon` na `useSyncExternalStore` +
  `matchMedia`; `unstable-use-media-query` z Base UI celowo nie użyty (API niestabilne). Serwer renderuje wariant desktop.
- **Pułapka weryfikacji:** zrzut ekranu tuż po dotknięciu łapie panel w trakcie animacji (wygląda, jakby się nie
  otworzył), a współrzędne elementów z tego zrzutu są przesunięte — sprawdzać `[role=dialog]` w DOM i klikać po `ref`.
- Worktree bez własnego `node_modules` uruchamia vitest z katalogu nadrzędnego (rozwiązywanie modułów w górę drzewa),
  ale `pnpm typecheck` pada („tsc: not found”) — w nowym worktree najpierw `pnpm install --frozen-lockfile`.

## 8.4b pkt (3) — liczby silnika w tekstach pomocy przez `parametry` (30.09.2026)

- 16 ekranów: tekst `lib/i18n/pomoc/*` ma `{nazwa}`, strona podaje stałą z `constants.ts` w `parametry` (`NaglowekEkranu`)
  albo `params` (`PomocPola`). Kryterium: liczba jest stałą silnika → parametr; stała strukturalna wzoru, przykład,
  numer normy/artykułu, liczba bez stałej w silniku → zostaje w tekście. Pełna lista: `docs/lista-do-zrobienia.md`.
- Stawki ustawowe M14 (VAT, depozyt, zwrot, k) nie są stałymi, tylko okresami w `rozliczenia-pl-2026.json` —
  `stawkiDoPomocy()` (`components/siec/wspolne.tsx`) bierze wartość roku danych przez `wartoscNajdluzej` (jak silnik
  mocy biernej, D36). Nowy tekst M14 cytujący stawkę → ten sam helper, nie liczba w tekście.
- `podstaw()` zamienia `.` na przecinek w PL/RU tylko dla `number` albo tekstu w pełni dziesiętnego — ułamki z długim
  rozwinięciem podawać przez `toFixed()` (np. `WSPOLCZYNNIK_KWH_NA_L_K.toFixed(6)` → „0,001163”).
- **Pułapka:** zamiana tekstu po dosłownym fragmencie ominie język, w którym zdanie ma inny szyk (tu: RU depozytu).
  Pilnuje test „te same `{parametry}` w PL/EN/RU” (`lib/i18n/__tests__/pomoc.test.ts`) — nie wyłączać.

## Stałe silnika w `FORMULA` — wzór składany, nie przepisywany (30.09.2026)

- Kontynuacja 8.4b pkt (3). Ciągi `FORMULA` 15 kalkulatorów składane szablonem ze stałych przez `latexLiczba()`
  (`lib/core/latex.ts`, przecinek LaTeX `1{,}25`); wyniki obliczeń bez zmian, wersje kalkulatorów +patch.
- Wyciągnięte stałe: współczynniki wind chill (`WIND_CHILL_A…D`, `WIND_CHILL_WYKLADNIK`) i
  `WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA` (1,25 — reguła produktowa, osobna od K1 normy PV; `kable-bezpieczniki-male`
  używa tej samej stałej, bo i tak woła ten kalkulator).
- Depozyt: `k_dep` i `p` są okresami w danych, więc wzór bazowy symboliczny, a po rozstrzygnięciu daty dopisuje
  wartości dla miesiąca (`formulaZeStawkami`) — nie liczba „z roku danych” jak w pomocy.
- Strażnik: `lib/core/__tests__/formula-constants.test.ts` — żaden `calculator.ts` nie ma literału `\d{,}\d`, poza
  jawną listą strukturalnych (½ w naporze, 3,6·10⁶ J/kWh). Liczby całkowite (np. 25 °C) guard nie łapie — przegląd.

## SW wariant C — etap 1 (29.09.2026, D59)

- **Od 29.09: Service Worker = wzorzec standardu** — `app/sw.js/route.ts` (`force-static`) + `lib/pwa/sw-rdzen.js`
  (czysty JS, test `node:vm`) + lista precache `lib/pwa/precache.ts` (czysta) / `precache-build.ts` (czyta `.next`) +
  `lib/pwa/aktualizacja-sw.ts` + `components/pwa/sw-rejestracja.tsx` (toast) + `components/pwa/powiadomienia.tsx`
  (`<Toaster>` sonner, kolory z tokenów). **Nie** `public/sw.js`/`register-sw.js` (usunięte). Nowy toast w aplikacji =
  `toast` z `sonner` (host już jest w `app/layout.tsx`), nie własny komponent.
- **Odstępstwa od wzorca (plan 1.1–1.5):** prefiks `offgrid-precache-`; bez `slownikiPrepaint` (słowniki są w chunku);
  `trasyDynamiczne` = `/moduly/<id>` z `KAFLE`; `/auth/login` poza precache i `/auth/**` zawsze sieć; strażnik
  przekierowania na logowanie w `pobierzDoCache`; `aktywuj()` i wyłącznik kasują też stary `offgrid-v1`; wykluczenia
  MapLibre (`public/maplibre/**`, `media/maplibre-gl*`) i `public/placeholder*`; teksty przez klucze `UI-PWA-*`
  (`lib/i18n/ui/pwa.ts`, mechanizm D58 zamiast kluczy `pwa.aktualizacja.*` z planu); odwołania w komentarzach
  wskazują dokumenty tego repo.
- **Fakty sprawdzone:** w chwili prerenderu `app/sw.js/route.ts` (Next 16.3 + Turbopack) `.next/BUILD_ID`,
  `app-path-routes-manifest.json` i kompletny `.next/static` już istnieją (sonda: 254 chunki w trakcie = 254 po buildzie).
  `wersja` SW zmienia się przy każdym buildzie (losowy `BUILD_ID` = `rev` stron) — to oczekiwane, chunki (`rev: 'i'`)
  i tak są reużywane. Precache: 539 wpisów, **21,3 MB**. Hydracja z komponentem rejestracji — bez `#412`.
- **Wyłącznik awaryjny:** deploy zbudowany z `NEXT_PUBLIC_SW_WYLACZ=1` → `/sw.js` serwuje skrypt samousuwający (kasuje
  `offgrid-precache-*` i `offgrid-v1`, wyrejestrowuje się), nowy kod klienta nie rejestruje SW. Powrót: zwykły deploy.
- **E2e:** `pnpm test:e2e` (`node --test`, trzy buildy produkcyjne, port 3947, ~3 min). Lokalnie, gdy wersja
  `playwright` nie pasuje do zainstalowanej przeglądarki: `PW_CHROMIUM_PATH=~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
  `E2E_BEZ_BUILDU=1` tylko dla `offline.test.mjs` i tylko gdy `.next` to zwykły build (po `aktualizacja.test.mjs` leży
  tam build wyłącznika!). **Pułapki:** `waitForFunction` z predykatem `async` przechodzi od razu (zgłoszone do
  standardu); `/_vercel/insights` daje lokalnie 404 + błąd MIME w konsoli — oczekiwane, filtrowane.
- **Pierwszy deploy:** stary SW serwuje strony z sieci, więc od razu wczytuje się nowy HTML; nowy SW instaluje się w tle
  i toast pojawia się bez dodatkowej nawigacji (sprawdzone: build `main` → build gałęzi na tym samym porcie).

## Drobne zadania + SW etap 2 + 5.10/5.11 (30.09.2026, D60)

- **`middleware.ts` → `proxy.ts`** (Next 16, przewodnik `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`):
  zmiana nazwy pliku i funkcji, działanie bez zmian. Klasyfikacja 11.8: zmiana konwencji, nie zachowania. Jedyna różnica
  techniczna: proxy zawsze w runtime Node.js (nie Edge) — kod używa tylko `crypto.randomUUID`, `@supabase/ssr`,
  `NextResponse`, więc bez wpływu. `pnpm build`: ostrzeżenie o „middleware” zniknęło, w wyjściu `ƒ Proxy (Middleware)`.
  W dokumentach historycznych nazwa `middleware.ts` zostaje (nie przepisujemy historii); kod wskazuje `proxy.ts`.
- **`public/placeholder*` usunięte** (5 plików z szablonu) i zdjęte ich wykluczenie z precache.
- **CI:** job `e2e-sw` w `.github/workflows/ci.yml` (`playwright install --with-deps chromium` + `pnpm test:e2e`,
  osobny job, limit 30 min). Ruszy dopiero, gdy wróci GitHub Actions (1.10).
- **5.10:** `lib/adapters/trwaly-magazyn.ts` (kopia wzorca), wołane z `IndexedDbStorageAdapter.setItem` — raz na
  załadowanie strony, odmowa zapamiętana w `localStorage` (`trwaly-magazyn-odmowa`).
- **5.11:** zdarzenia wersji bazy w `lib/adapters/indexeddb-storage-adapter.ts` (`naZdarzenieWersjiBazy`),
  toast `components/pwa/baza-wersja-listener.tsx` (klucze `UI-PWA-BAZA-*`) w `app/layout.tsx`. **Od teraz wolno podbić
  `DB_VERSION`** — stara karta dostanie toast „Odśwież tę kartę” zamiast cicho gubić autozapis.
- **BŁĄD etapu 1 (dryf od D22, naprawiony wg Y.2):** worker MapLibre (`public/maplibre/**`) był wykluczony z precache
  z uzasadnieniem „mapa i tak wymaga sieci”. D22 mówi odwrotnie: spacer GPS działa bez sieci. Skutek sprawdzony na
  buildzie produkcyjnym: offline na Skanerze znikał obrys działki i budynku (zostawały same numerki punktów), bo
  MapLibre przetwarza GeoJSON w workerze. Worker wrócił do precache (+0,5 MB); `media/maplibre-gl*` (~3,7 MB) nadal
  poza precache — to nieużywane kopie emitowane przez bundler z `new URL(..., import.meta.url)` w bibliotece (mapa
  używa kopii z `public/maplibre/` przez `setWorkerUrl`). Regresję pilnuje test e2e w `e2e/offline.test.mjs`.
  **Lekcja:** zanim wykluczysz zasób z offline, sprawdź na buildzie, czy ekran naprawdę go nie używa bez sieci —
  „ekran ma część online” ≠ „biblioteka jest tylko online”.
- **D60 — widok 3D tylko online:** chunk three.js (~0,9 MB) poza precache, rozpoznawany po treści (`__THREE__`),
  nie po nazwie z hashem (`czyChunkTylkoOnline`). Import w `analiza-zacienienia/page.tsx` ma `.catch` → komponent
  z komunikatem `UI-PWA-3D-BRAK-*`, bez ekranu błędu.
- **BŁĄD znaleziony przy okazji:** `components/asystent-ai.tsx` wołał Server Action `isAiAvailable()` bez `.catch` —
  offline **każdy** ekran rzucał nieobsłużone `TypeError: Failed to fetch` (widoczne w e2e jako `pageerror`, wcześniej
  niewychwycone, bo test offline nie sprawdzał `pageerror`). Teraz: offline asystent ukryty (9.0 — ciche zdegradowanie).
- **Pomiar precache po etapie 2:** 540 wpisów, **20,85 MB surowo, ≈ 6,8 MB transferu** (gzip; Vercel wysyła brotli —
  jeszcze mniej). Podział (surowo / gzip): HTML 239 stron 6,64 / 1,25 MB; chunki 12,2 / 3,9 MB; media 0,57 MB;
  `public/` 1,41 / 1,05 MB. Największe: chunk tekstów/słowników ładowany na każdej stronie 1,17 MB, MapLibre 1,0 MB,
  drugi chunk tekstów 0,73 MB, worker MapLibre 0,5 MB, zod 0,4 MB (ekrany M14 — potrzebny offline). Budżet pierwszego
  pobrania: **D61 — wariant A**, obecny stan przyjęty, nic dalej nie ciąć (B tylko przy sygnale o słabym łączu).

## Migracja etykiet starych ekranów na `UI-*` — narzędzie i pułapki (30.09.2026)

- **Narzędzie:** `scripts/migracja-i18n-ui.mjs` (jednorazowe, AST TypeScript): `wyciagnij <grupa> <pliki…>` wypisuje
  `{klucz: tekst PL}`, `zastosuj <grupa> <tlumaczenia.json> <pliki…>` przepisuje strony na `t(...)`, tworzy
  `lib/i18n/ui/<grupa>.ts`, dopisuje import w `index.ts` i obniża listę zapadkową; `sprawdz <pliki…>` pokazuje literały
  bez polskich liter do przejrzenia. Teksty identyczne z `wspolne.ts` dostają klucz wspólny. Usunąć, gdy lista
  zapadkowa będzie pusta.
- **Pułapka 1 — strażnik nie widzi tekstów bez polskich liter** poza JSX (np. „Przewody prowadzone w peszlu” w stałej
  modułu): po `zastosuj` zawsze `sprawdz` i ręczny przegląd.
- **Pułapka 2 — teksty w stałych poza komponentem:** narzędzie wstawia tam klucz jako string i wypisuje „RĘCZNIE:” —
  trzeba dodać `t(...)` w miejscu renderu (inaczej ekran pokaże surowe `UI-…`). Po każdej partii grep `"UI-` poza `t(`.
- **Pułapka 3 — zmienna `t` w `.map((t) => …)`** przesłania `useTranslate()`; przed migracją zmienić nazwę (`tech`).
- **Pułapka 4 — `getStart()` na JsxText już pomija białe znaki;** ręczne przesunięcie ucinało pierwsze litery słów.
- **Rozmiar:** każda partia powiększa chunk tekstów ładowany na każdej stronie (D61 — przyjęty stan, obserwować).
- Teksty ze stałych `lib/core` renderowane na ekranach — osobny wpis w `docs/lista-do-zrobienia.md` (30.09.2026).

## Duże kafle M14 + presety pulpitu (30.09.2026)

- **Duży kafel** = `duzy: true` w `KafelEntry` (`lib/pulpit/registry.ts`): `col-span-2` w siatce pulpitu + opis pod nazwą.
  Tylko kafle M14 (id 15/16, D35). Siatka ma min. 2 kolumny, więc duży kafel nigdy nie wychodzi poza ekran telefonu.
- **Presety** (`lib/pulpit/presety.ts`) — dane 1:1 z tabeli §3 `docs/pulpit-i-nawigacja.md` + `[15, 16]` na końcu (D53/D54).
  `stanZPresetow(ids)` zwraca zwykły `PulpitState` — nie ma nowego klucza `localStorage` ani migracji. Kilka presetów =
  unia w kolejności domyślnej (✅🤖, §3 nie określa kolejności unii). Zaznaczenie nie jest zapamiętywane (jednorazowe
  „Zastosuj”). Dziewiąty preset „Jestem podłączony do sieci” czeka na decyzję o składzie (lista zadań 30.09).
- **Y.2 (naprawione od razu):** Ustawienia pokazywały „15. Dom – sieć” / „16. Firma – sieć” mimo D39 (kafle M14 bez numeru,
  „Kafel 14” = Ustawienia) — numer tylko dla id < 14.
- **Przecinek w liczbach założeń** — zadanie z indeksu po D54 było duplikatem wpisu zamkniętego 26.09; sprawdzone ponownie,
  nic do zrobienia (kropka tylko w `technicalMessage`).
- **[30.09.2026, D62]** Właściciel przyjął obie propozycje ✅🤖: unia w kolejności domyślnej oraz dziewiąty preset `siec`
  (M14 na początku, potem 1, 2, 3, 4, 6, 7, 8). Preset `siec` jest jedynym bez `[15, 16]` na końcu — test to rozróżnia.

## M9 blok 6 (30.09.2026) — E1, E3, Katalogi 2–4; M9 kompletny

- **E1 wybór płytki** (`esp32/wybor-plytki/`): dopasowanie po cechach z opisu wariantów w źródle (B), nie po liczbie
  czujników — próg „do 10 czujników” i „3× mniejszy pobór” z przykładu C to ilustracja (Dyrektywa #1). Brak jednej
  płytki z wszystkimi cechami → ℹ️ (status bez zmian, Dyrektywa #6). Zasilanie stałe bez potrzeb → ℹ️, brak rekomendacji.
- **E3 montaż i obudowa** (`esp32/montaz-obudowa/`): kontrola IP to czyste echo — `ipPonizejWymaganego` (M4/E10) i
  `wilgocZalecaneIp65` (M12/E23) z ich stałymi; wpis w rejestrze stopów uzupełniony o M9/E3. Pytania tak/nie jako
  `PoleSelect` z pustą opcją (checkbox dawałby fałszywe „nie” = ostrzeżenie od progu). Ujemny odstęp → `ESP-ODSTEP-UJEMNY`
  — **pułapka:** wzorzec `*-UJEMNY` w `scripts/stopy-guard-wyjatki.json` nie złapał kodu wieloczłonowego, trzeba było
  dopisać kod jawnie.
- **Katalogi 2–4**: jeden silnik `esp32/katalog-komponentow/` (ids w `constants.ts`, treść w `lib/i18n/ui/m09-esp32.ts`
  jako `UI-M9-<id>-N/T/D/U`), jeden komponent `components/wzorce/katalog-komponentow.tsx` (stan w stronie przez
  `usePersistedDraft`), jedno narzędzie AI z enum katalogu. Katalog 1 deleguje obliczenie do tego silnika (bez zmiany
  wyniku). **Id instancji** liczone z listy (`max+1`), nie z licznika modułu — **błąd naprawiony w Katalogu 1:** licznik
  `nextId` startował od 1 po każdym przeładowaniu, więc po odtworzeniu szkicu dawał zduplikowany `id` (klucz React,
  „Usuń” kasowało dwie pozycje naraz).

## M12 — ostatnia partia ekranów (01.10.2026, gałąź `claude/ekrany-m12-8ac1e6`)

- **Stan:** M12 40/42 `done` (E41 i asystent głosowy 12.41 zablokowane jak wcześniej). Partia: E8, E12, E24, E25, E26,
  E37, E40, E3, E33, E14 — każdy z silnikiem, testami, narzędziem AI „Użyj, gdy”, PL/EN/RU, pomocą „?”/„i”.
- **Decyzje właściciela w tej partii:** E26 — minimum 2 doby autonomii dla sprzętu medycznego jako 🟡 (nie 🔴),
  zapasowe źródło rekomendowane zawsze; E25 — kroki diagnozy dopisane eksperckie ✅🤖.
- **E33 bez tabeli napięć:** źródło każe „porównać z tabelą dla typu akumulatora”, ale jej nie podaje. Zamiast zgadywać
  progi SoC ekran liczy rezystancję wewnętrzną R = ΔU / I z testu znanym obciążeniem i porównuje z kartą progiem 50%
  z M4 (`soh-per-ogniwo`) — reużyta stała, nie nowa liczba. Jedyny próg napięciowy: 10,5 V (ołów 12 V), przeliczany
  przez liczbę ogniw 2 V.
- **Niespójne przykłady źródła (opisane w komentarzach silników, wynik liczony wzorem):** §12.9 „24 V→12 V 10 A → 11 A”
  (≈ 5,6 A); bramka §12.24.4/§12.55 40 Wh vs 11,1 Wh; LED §12.24.1 i CPAP §12.39 zgadzają się tylko przy sprawności 80%;
  §12.3 „1,8 kWh → 100 Ah” wymaga panelu doładowującego (1800 / 12 = 150 Ah nawet przy DoD 100%); §12.56 nieodtwarzalny;
  §12.48 „12,6 → 12,0 V przy 50 W = lekka utrata” daje R ≈ 144 mΩ — to akumulator do wymiany albo zły styk.
- **Pułapka (narzędzia):** pętla `until ! pgrep -f "<skrypt>"` w tle łapie samą siebie (jej wiersz poleceń zawiera
  szukany tekst) i nigdy się nie kończy. Czekać na PID (`wait`/`kill -0 <pid>`) albo `pgrep -f` ze wzorcem, który nie
  występuje w poleceniu czekającym.
- **Pułapka (testy):** granica progu liczona ze spadku napięcia (12,6 − 12,0) nie daje dokładnie 0,6 w zmiennoprzecinkowych
  — test „dokładnie na progu 50%” wychodzi 49,999…%. Testy graniczne ustawiać wyraźnie po obu stronach progu.

## Style wyglądu — mechanizm i pierwsza partia (01.10.2026, D67 kroki 1–4, gałąź `work/styles`)

- **Jedna tabela:** `lib/wyglad/style.ts` (grupa, `dostepnosc` bez egzekucji, schemat jasny/ciemny, tokeny, werdykty,
  warianty: nagłówki, liczby, promień). CSS generowany z tabeli (`generujCssStylow`, `<style id="style-wygladu">` w
  `app/layout.tsx`), selektor `html:root[data-styl=…]` (0,2,1) — wygrywa z `.dark` i `:root:not(.light)` niezależnie od
  kolejności arkuszy. W `globals.css` nic per styl, tylko `h1–h3` → `--font-naglowek`, `.tabular-nums` → `--font-liczby`.
- **Warstwy:** domyślne tokeny < styl < nadpisania kolorów usera (inline na `<html>`, wygrywają). Styl wymusza swój schemat
  (`data-schemat-stylu`, czytany przez `zastosujTryb` w `lib/theme`), zapisany tryb motywu wraca przy „Domyślny”.
  Nadpisanie koloru werdyktu przy aktywnym stylu zmienia obramowanie/ikonę; tło i tekst werdyktu zostają z tabeli (testowane) ✅🤖.
- **Test kontrastu (`lib/wyglad/__tests__/style.test.ts`) od razu złapał prototyp:** jasne werdykty z prototypu
  (#16A34A/#D97706/#DC2626) mają ~2,8:1 obramowania i 4,3:1 tekstu 🟢 na kremie „Jasnego architektonicznego”, a na szarości
  RAL 7035 „Rozdzielnicy” jeszcze mniej. Przyjęto te same odcienie o stopień ciemniejsze (700/800, w Rozdzielnicy tekst 900);
  akcent Jasnego #A47D3C → #8A6A2E (biały tekst przycisku); obrysy pól ze wszystkich 5 stylów podniesione do ≥ 3:1 (prototyp
  miał linie dekoracyjne ~1,2–1,6:1). Każda zmiana opisana przy wartości w tabeli.
- **Czcionki:** Source Serif 4 i JetBrains Mono (obie z cyrylicą) przez `next/font`, `preload: false`. OLED: prototyp
  miał liczby Inter 300 — nie dodano wagi 300 (byłaby preładowana na każdej stronie), liczby zostają bezszeryfowe.
- **Grupa „Ukryte i sezonowe”:** przełącznik w Ustawieniach (`pokazUkryteStyle` w `offgrid.wyglad.v1`) ✅🤖 — pytanie
  otwarte D67 (przełącznik vs daty sezonowe) do potwierdzenia przez właściciela.

## Style wyglądu — partia 2: pozostałe 22 style (01.10.2026, D67 krok 5, gałąź `work/styles2`)

- **Efekty poza tokenami** (`efekty` w tabeli, CSS z `cssEfektow`): warunki D66/D67 wbudowane w generator, nie w wpisy —
  efekty kart tylko na `SELEKTOR_KARTY` (`.bg-card`/`[data-karta]` z wyłączeniem `role=status|alert`, czyli nigdy
  `WerdyktPanel`/`StanBledu`); każda animacja w `prefers-reduced-motion: no-preference`; ruch tła tylko przy
  `[data-pulpit]` (`app/page.tsx`); szkło: nieprzezroczyste tło karty domyślnie, rozmycie tylko w `@supports`, bez
  `prefers-reduced-transparency` i bez `data-bez-rozmycia` (skrypt w layoucie: `deviceMemory < 4`,
  `hardwareConcurrency < 4` albo `saveData` — progi ✅🤖 do potwierdzenia).
- **Test kontrastu rozszerzony:** kolory dekoracji tła (`efekty.tlo.kolory`) i szkło nad każdym z nich liczą się jako
  podłoże tekstu, obrysów, akcentu i werdyktów. Złapał: plamy Płynnego gradientu w pełnej mocy (🔴/🟢 < 3:1 → plamy 35%),
  poświatę Szkła 14% (🔴 obrys 2,8:1 → 8%), żyłki Marmuru (tekst przygaszony i obrys o stopień ciemniej).
- **Test widzenia barw** (Machado 2009 + CIEDE2000, w `style.test.ts`): akcent nie może być bliżej żadnego koloru werdyktu
  niż 🟢/🟡/🔴 między sobą (deuteranopia/protanopia). Pomarańcz #FF6B1A vs 🟡 #F59E0B = ΔE 5,6 dla deuteranopii < 7,7
  (🟢 vs 🔴) — **prototyp nie przechodził**; 🟡 tego stylu rozjaśnione w swoim odcieniu (#FBBF24 / tekst #FCD34D),
  pomarańcz akcentu bez zmian, pierścień neutralny szary #A0A4AA. Kokpit HUD: turkus vs 🟢 przechodzi bez zmian.
- **Odstępstwa od prototypu (poza obrysami ≥ 3:1 we wszystkich stylach):** Marmur akcent #A8843D → #907234; Słoneczny
  tekst przygaszony #5E6878 → #5B6574; brak gradientowego tekstu wyniku (Różowe złoto, Holograficzny — brak jednego koloru
  do testu); brak zdjęć domów (Szkło: zastępcze tło z kolorów prototypu; Orbita bez planety; D61); Synthwave siatka płaska
  (bez perspektywy 3D); tęcza Holograficznego jako przesuwany gradient liniowy zamiast stożkowego z `@property`.
- **Czcionka Caveat** (cyrylica, `preload: false`) tylko nagłówki i `.wynik-glowny` Notatnika; liczby tabel `--font-sans-user`.
  Terminal DOS: `--font-tekst` mono na całe body (wygrywa z wyborem czcionki usera), wynik `#FFFFFF`.

## D58 — migracja kolejnych modułów + pułapka „useTranslate w Server Component” (01.10.2026, gałąź `work/i18n`)

- **Stan:** lista zapadkowa 168 → 82 plików (M5, M2, M7, M9, pojedyncze M4/M10/M12/M13, ekrany sieci D*/F*). Szczegóły
  i to, co zostało: `docs/lista-do-zrobienia.md`, wpis „Tłumaczenie samych stron”.
- **Pułapka (błąd naprawiony):** strona bez `"use client"`, która woła `useTranslate()`, zwraca **HTTP 500**
  („Attempted to call useTranslate() from the server”). `typecheck`, `lint`, strażnicy i Vitest tego nie widzą —
  wyszło dopiero na `next dev` + `curl`. Narzędzie `scripts/migracja-i18n-ui.mjs` dopisuje hook bez sprawdzania
  dyrektywy, więc tak trafiło na `main` 5 ekranów M4/M8 (matryca-alarmow-bms, audyt-pozarowy,
  przechowywanie-recykling, przechowywanie-recykling-olow, ratowanie-zasiarczenia) i 3 z M5 tej gałęzi (separacja-emc,
  trasy-kablowe, selektywnosc-zabezpieczen); prognozy i tryb-live przy migracji. Wszystkie dostały `"use client"`.
  Kontrola po każdej partii: `grep -rl "useTranslate()" app --include=page.tsx | xargs grep -L '"use client"'` musi
  być puste. Kandydat na strażnika (zgłoszone w `docs/wklad-do-standardu.md`).
- **Konwencje tej partii:** liczby dziesiętne w EN z kropką (PL/RU przecinek — tak jak `formatujParametr`); jednostki
  w RU cyrylicą jak w `dictionary-ru.ts` (кВт·ч, А, В, Вт, мм², Ом, зл); symbole techniczne w listach opcji (CAN,
  Wi-Fi, UART, PWM, jednostki „kWh”, „%”) zostają bez klucza — render `x.startsWith("UI-") ? t(x) : x`.
  Treść pisma reklamacyjnego (`test-licznika`) celowo zostaje po polsku (adresat: polski OSD).

## D58 — domknięcie migracji ekranów + pułapki narzędzia (02.10.2026, gałąź `work/i18n2`)

- **Stan:** lista zapadkowa 82 → 6 plików (1503 → 10 tekstów); co zostało i dlaczego — `docs/lista-do-zrobienia.md`,
  wpis „Tłumaczenie samych stron”.
- **Moduł, który musi zostać serwerowy** (eksportuje funkcje wołane przez Server Components, np. `poziomZStatusu` w
  `components/werdykt.tsx`, albo sam jest stroną serwerową `/moduly/[id]`): nie dopisywać `"use client"` — tekst przez
  `<TekstUi kod="UI-…" />` (`components/ui/tekst-ui.tsx`). Na atrybut (aria-label, title) to nie działa — tam
  komponent kliencki. Komponenty o samych serializowalnych propsach (`nawigacja-ekranu`, `stany`, `krok-z-media`)
  dostały `"use client"` — strony serwerowe mogą je dalej importować.
- **Pułapki `scripts/migracja-i18n-ui.mjs` (naprawione w narzędziu):** (1) gubił `{" "}` na brzegu przebiegu JSX
  (spacja przy `<Link>`); (2) trafienia strażnika są kluczowane linią + tekstem, więc
  `<option value="LiFePO4">LiFePO4</option>` dostawało `value={t(…)}` — atrybuty danych są teraz pomijane (dwa takie
  miejsca z wcześniejszych partii: `ochrona-przed-rozladowaniem`, `ratowanie-akumulatora-maly` — działają, bo klucz ma
  ten sam tekst w 3 językach, ale do poprawki przy najbliższej zmianie tych ekranów); (3) każdy `page.tsx` poza
  `/kalkulatory/` dostawał prefiks `PAG` — „Pulpit” i „← Pulpit” z dwóch stron zlały się w jeden klucz; teraz prefiks
  z nazwy folderu; (4) hook pod inną nazwą (`const tr = useTranslate()`) był traktowany jak obecny, a wstawione `t(…)`
  nie miały definicji — teraz zgłoszenie RĘCZNIE; (5) plik bez importów dostawał import doklejony przed komentarzem
  na pozycji 0.
- **Strażnik liczy też:** szablon w atrybucie `style` i encje `&nbsp;` w tekście JSX (zamiana na `{" "}`), oraz
  słowa polskie w nazwach klas (`werdykt-uwaga`) i znacznikach SVG w stringu — dwa ostatnie to fałszywe trafienia,
  zostają na liście.
- **Tablica kolumn / stan początkowy na poziomie modułu z `t()`:** zamienić na funkcję przyjmującą `t`
  (`kolumny(t)`, `stanPoczatkowy(t)`), stałe etykiet trzymają klucze, `t()` przy renderze.

## M6 — ekrany bez właściciela (01.10.2026, gałąź `work/m6`)

- **Stan:** zbudowane E13, E16, E17, E18, E19, E20, 5.42 (`kolektor-gruntowy`), 2A (`alternatywne-zrodla-ciepla`,
  rzędy 5.32/5.34/5.35/5.36; 5.33 był już osobno). Wspólna walidacja M6: `lib/core/modules/ogrzewanie/wspolne/walidacja.ts`
  (kody `M6-*` dopisane jawnie do `scripts/stopy-guard-wyjatki.json` — wzorce `*-UJEMNA`/`*-POZA-ZAKRESEM` ich nie łapały
  przy prefiksie `M6-`). Teksty UI: `lib/i18n/ui/m06-ogrzewanie.ts`, pomoc: `lib/i18n/pomoc/m06b-ogrzewanie.ts`.
- **Nowe 🔴:** `DYS-GRZEJNIKI-WYSOKOTEMP-POMPA` (E13), `KOL-PLYCEJ-NIZ-PRZEMARZANIE` (5.42, ta sama reguła co M7/E22).
  Wybory ✅🤖 do potwierdzenia: wpis ⚠️ w `docs/lista-do-zrobienia.md` (01.10.2026, M6).
- **Niespójne przykłady źródła (Dyrektywa #5, opisane w silnikach):** E13 „oszczędność 28%” = 1 − 3,2/4,5 ≈ 28,9%;
  E17 0,8 W/K → 1,2 kWh/dobę wymaga ΔT 62,5 K, a 0,5 W/K daje 0,75 (nie 0,7) i ok. 164 kWh/rok (nie 180);
  E18 „PV 3 kW → 3 h” przeczy grzałce 2 kW (moc ograniczona grzałką); E20 „8 − 3 − 0,5 = 4,5” zakłada COP 1,
  a „1600 kWh rocznie” = 4,5 × 365 (zimowa doba × cały rok); 5.42 „8 kW → 400 m² / 1 odwiert 100 m” = 500 m²/10 kW
  i 80 W/m, poza widełkami tego samego źródła (48–96 m², 114–160 m); 2A PCM „100 l ≈ 300 l wody” tylko przy
  ρ = 1 kg/l i ΔT ≈ 16 K, kominek „60% zapotrzebowania” bez podanego zapotrzebowania.
- **Pułapka (stopy-guard):** kod OUT_OF_SCOPE na poziomie `critical` (np. `OSL-SZEROKOSC-POZA-MODELEM`) trzeba dopisać
  ręcznie do `poza-zakresem-modelu`, nie do `walidacja-danych`.

## M7/M6 — ekrany zimowe (01–02.10.2026, gałąź `work/screens`)

- **Stan:** zbudowane M7/E2 `deficyty-miesieczne`, E15 `okno-sloneczne`, E7 `snieg-na-pv` + E14 `szadz-na-pv`
  (wspólny silnik `stress-test/osad-na-pv`), M6/E4 `gwc`, E6 `cykle-odszraniania` (zamyka 1.14 i 6.8), E9
  `wentylacja-grawitacyjna`. Teksty UI: `lib/i18n/ui/m07b-zima.ts`, `m06c-ogrzewanie.ts`; pomoc: `lib/i18n/pomoc/m07b-stress-test.ts`,
  `m06c-ogrzewanie.ts`; testy narzędzi AI: `lib/ai/tools/__tests__/ekrany-zima-ogrzewanie-01-10-tools.test.ts`.
  Brak nowych 🔴. Wybory ✅🤖: wpis ⚠️ w `docs/lista-do-zrobienia.md` (02.10.2026).
- **Refaktor:** `obliczPraceAgregatu` wydzielona z `zapotrzebowanie/agregat-pradotworczy/calculator.ts` (M2/E17) i użyta
  w M7/E2 — testy M2/E17 bez zmian.
- **Niespójne przykłady źródła (Dyrektywa #5, opisane w silnikach):** E2 45 l / 350 zł implikuje 1,5 l/h i 7,78 zł/l;
  E6 „co 45 min, 5 min → 8%” = 11,1% przy równej mocy (8% tylko przy P_def = 0,72·P_baz); E9 „15% → 5%” tylko przy
  η ≈ 70%; E4 „+4 °C → −5%” nieodtwarzalne (brak strumienia/zapotrzebowania); E15 „bateria 65% i bojler 50 °C”
  sprzeczne z regułą źródła (bojler dopiero > 80% SoC).
- **Nie zbudowane:** M7/E1, E3, E9, E12, E16, E24, E25, M6/E11 — powody w `docs/rejestr-pokrycia.md`. E12 jest blocked (→ zbudowany 02.10.2026, patrz sekcja „M7/E12 + M7/E7/E14 v2.0.0”)
  (źródło nie podaje wag składowych), E9 powielałby M3/E16 bifacjalne.
- **Pułapka (i18n-ui-guard):** jednostka z małymi literami w `unit=` (np. „zł/l”, „zł/h”) jest łapana jako tekst —
  przez klucz `t()` (`UI-J-ZL-L`). Porównanie nadwyżki energii z zerem po odejmowaniach — z tolerancją 1e-9, nie `=== 0`.
- **Pułapka (środowisko):** trzy agenty z testami/serwerem dev naraz → OOM i restart kontenera (dwa razy). Przy pracy
  równoległej: bez `next dev`, vitest tylko na swoich ścieżkach z `--maxWorkers=1`, commit po każdym ekranie.
## D70 — granica z apką „Elektryk Pro” i cel przychodu (02.10.2026, wątek analizy rozdzielnic)

- Decyzja: PV celowo w obu apkach (Offgrid: PV + magazyn + przejście na off-grid; Elektryk Pro: techniczne PV + cała elektryka AC). Szczegóły w D70.
- **Pułapka do unikania:** każda prośba o „pogłębienie” rozdzielnicy AC (obwód po obwodzie, selektywność dla całego mieszkania, pomiary okresowe) to materiał dla Elektryk Pro, nie dla Offgrid — ale twardy stop bezpieczeństwa zawsze zostaje w Offgrid.
- Cel finansowy właściciela: **min. 5000 zł netto miesięcznie z każdej apki rodziny**; ceny jeszcze nieustalone. Analiza rynku (ceny konkurencji, progi liczby klientów): `/mnt/project-files/analizy/ceny-apek-rodziny.md`.

## M6 Część 2 — silnik 2D „wpływ czynnika X” + ekrany 2C (02.10.2026, gałąź `work/screens`)

- **Stan:** 2D — jeden silnik `lib/core/modules/ogrzewanie/wplyw-czynnika/` (18 czynników, 21 pozycji źródła; mapa w
  `NUMERY_ZRODLA`, pozycje bez fizyki w `CZYNNIKI_NIEBUDOWANE`), ekran `wplyw-czynnika` z polami zależnymi od czynnika.
  2C — `rozruch-pompy-ciepla` (5.52/5.61/5.66), `basen` (5.48), `odzysk-ciepla-sciekow` (5.41), `chlodzenie-pompa-ciepla`
  (5.29/5.47/5.51/część 5.53). Wybory ✅🤖: wpis ⚠️ w `docs/lista-do-zrobienia.md` (02.10.2026). Brak nowych 🔴
  (`CHL-PONIZEJ-ROSY` 🟡 — kandydat).
- **Refaktor (wyniki bez zmian):** `uPoDociepleniu` wyeksportowana z `optymalizacja-izolacji/calculator.ts` (E7);
  `obliczPunktRosyC` (Magnus) wydzielona z M4 `baterie/ochrona-wilgoc/calculator.ts`.
- **Niespójne przykłady źródła (Dyrektywa #5, w komentarzach silników):** 5.69 „500 kWh” wymaga Q ≈ 7125 kWh; 5.81 i
  5.86 implikują 3000 h vs 1000 h; 5.82 2,5 kWh/d = 0,104 kW, nie 0,3 kW; 5.98 limit 60% → +67% czasu, nie +40%; 5.90
  +50% długości → +50% mocy, nie 20%, 5.91 porównuje różne długości; 5.48 46,5 kWh → 5,8 h, nie 5 h; 5.41 0,5 × 365 =
  182,5, nie 180; 5.51 1 − 3/4,5 = 33%, nie 40%; 5.52 przykład 40 A zależy od niepodanej mocy szczytowej falownika.
- **Pułapka (kolizja slugów):** `chlodzenie-latem` istnieje już w M4 (chłodzenie baterii) — `register.py` i zapis strony
  nadpisały cudzy ekran i narzędzie. Przed nowym slugiem: `ls app/kalkulatory/<slug>` i grep po `lib/ai/tools/`;
  `check:ai-tools-guard` i test „no screen id is defined in two module files” złapały to od razu.

## M6 Część 2B — dokładki do ekranów Części 1 + 2C 5.64/5.68 (02.10.2026, gałąź `work/m6-2b-dokladki`)

- **Stan:** wszystkie 14 pozycji 2B + 5.64 i 5.68. Dokładki to sekcje `app/kalkulatory/<ekran>/sekcja-*.tsx` z własnym
  kluczem autosave `<slug>.<sekcja>` (szkic ekranu nietknięty), pomoc w grupach `m6d-*` (`lib/i18n/pomoc/m06d-ogrzewanie.ts`),
  klucze UI `UI-M6D-*` (`lib/i18n/ui/m06d-dokladki.ts`). Pola, które ekran już ma (moc pompy, zasobnik, temperatury,
  strumień GWC, moc defrostu, wynik Ekranu 1), sekcja dostaje propsami — bez wpisywania drugi raz. Nowe ekrany 2C:
  `model-sezonowy-pompy-ciepla`, `plan-poprawy-efektywnosci`. Mapa pozycji → silnik: `docs/rejestr-pokrycia.md` 5.27–5.72.
- **Zmiana wyników istniejącego kalkulatora:** tylko `pompy-cyrkulacyjne` → 1.1.0 (nowe pola opcjonalne). Silnik Ekranu 1
  świadomie bez zmian (raport 5.40/5.67 to osobny silnik na wyniku E1).
- **Refaktor (wyniki bez zmian):** `wspolne/hydraulika.ts` (`przeplywWodyLH`, `cyklStartStop`, używa ich 2D),
  `energiaDefrostuNaGodzineKwh` z Ekranu 6, hook `useWynikEkranu1()` w `lib/ogrzewanie/draft-obciazenia-cieplnego.ts`.
- **Niespójne przykłady (Dyrektywa #5, w komentarzach silników):** 5.27 deficyt 1 kW, nie 2; 5.43 3,1 → 3,8 przy 15 K
  = 1,5 %/K vs reguła 2–3 %/K; 5.28 4×40 min vs 20×5 min, 15% vs 10% w 5.70; 5.71 „10%” = krzywa za wysoka o 3,7–5,6 K;
  5.30 „1,8 kWh przy COP 3,2” = start ok. 30 °C; 5.54 2 %/K vs 5.93 3 %/K; 5.56 „0,3 kWh/dobę” = 0,11 kW całą dobę.
- **Pułapki:** (1) `check:stopy-guard` liczy każdy kod `critical` — kody walidacji wieloczłonowe (`DMP-TEMPERATURY-POZA-ZAKRESEM`)
  trzeba dopisać jawnie do `scripts/stopy-guard-wyjatki.json` (wzorzec `*-POZA-ZAKRESEM` ich nie łapie); nowy silnik
  może też użyć istniejącego kodu (np. `GRZ-TEMPERATURA-POZA-ZAKRESEM`), gdy reguła jest ta sama. (2) `check:i18n-ui-guard`
  łapie jednostki wpisane wprost (`unit="zł/kWh"`) — są klucze `UI-J-ZL-KWH`, `UI-J-ZL`, `UI-J-KWH-ROK`. (3) Sandbox
  worktree odrzuca polecenia z `$ZMIENNA` i długie heredoki — skrypty pomocnicze zapisuj plikiem i uruchamiaj ze stałą ścieżką.
  (4) `liczba()` z `lib/lokalizacja/model-dzialki` zwraca `undefined`, nie `null` — przy polach `number | null` trzeba `?? null`.

## Domknięcia listy + M9/E4 link do Katalogu 3 (02.10.2026, gałąź `work/m9-e4-link-katalog3`)

- Sesja dostała do zbudowania M6/E8 (głębokość czynna EN ISO 13786), Ψ z PN-EN ISO 14683 w M6, M9/E4 link i M7/E18 Pre-Heat.
  **Trzy z czterech były już zrobione** (E8 i E7 — 27.09.2026, E18 — 28.09.2026), ale ich wpisy 🔲 w liście nie dostały
  domknięcia. Zamknięte z odsyłaczem, kod nietknięty. Zbudowany tylko link E4 → `katalog-protokolow`.
- Pułapka: wpis ✅ „zamyka wpisy 🔲 X, Y” nie wystarcza — trzeba też przestawić same wpisy 🔲, inaczej kolejna sesja
  bierze je jako otwarte. Przed budową zawsze grep kodu + `rejestr-pokrycia.md`, nie tylko lista.
- Wpis listy wskazywał `lib/i18n/ui/m09-esp32.ts`; klucze E4 są w `m09-ekrany.ts` (ekran już na `t()`).

## M10 + M8 ekrany bez właściciela (02.10.2026, gałąź `work/ekrany-bez-wlasciciela-m10-m8`, niewypchnięta)

- Zbudowane (5): M10/E5 `przesuwanie-zadan` (12.10), M8/E6 AI — plan odcinania w `ups-krytyczny` 1.1.0 (12.54),
  M10/E4 `dobor-zrodel-zasilania` (12.7 + 12.8, echo M4 `hierarchia-ladowania` + `cold-c-rate`), M10/E12
  `audyt-zimowy` (12.36), M10/E7 `wykrywanie-anomalii` (12.13, 12.14, 12.17). Założenia ✅🤖 — jeden wpis ⚠️ w liście.
- 12.54 było opisane jako niebudowalne „bez progu liczbowego” — rozwiązane progiem odcięcia od usera (źródło daje
  tylko przykład „10 minut”). 🔴 `UPS-AKUMULATOR-SLABY` dopisany do rejestru stopów, bo źródło oznacza go 🔴 wprost —
  do potwierdzenia właściciela.
- Pominięte z powodem (wiersze w `rejestr-pokrycia.md`): M10/E2, E3, E6, E8, E9, E10 (telemetria/ML/historia), E11
  (brak reguły SoC start/stop i progu temperatury testu; zależne od 12.4/TD7), części E7 (12.15, 12.16, 12.18).
- Pułapka: wzorzec `*-UJEMNA` w `scripts/stopy-guard-wyjatki.json` nie łapie nowych kodów walidacji — każdy kod
  🔴 walidacji trzeba dopisać jawnie.
- Pułapka: komunikat „{od}:00” psuje się przy siatce 30 min — godziny przekazywać jako gotowy tekst (`godzinaTekst()`).
- Przy okazji odświeżone statusy: `rejestr-pokrycia` 1.15, 1.18, 3.10 oraz trzy nieaktualne wpisy 🔲 listy (M12 ×2, M7).

## D71 — potwierdzenia ✅🤖 i nowe stopy cieplne + taryfa nocna (02.10.2026, gałąź lokalna, niewypchnięta)

- Właściciel potwierdził założenia partii M7/M6/M10/M8 (pkt 14–16, 20, 23, 25, 24), poza otwartymi: pkt 13 (M7/E2
  zapas paliwa), pkt 17 (M7/E7/E14 dni zalegania) i pytaniem o wagi M7/E12. Numeracja pytań 13–25 odtworzona z kolejności
  punktów wpisów listy — zapisana w D71 jako do sprostowania.
- Trzy poziomy do 🔴: `PRZ-PRZEPLYW-ZA-MALY`, `PRZ-PONIZEJ-MINIMUM` (1.1.0), `CHL-PONIZEJ-ROSY` (1.1.0);
  `DMP-DEFICYT` 🔴 tylko przy `maDogrzew === false` (nowe opcjonalne pole, domyślnie „nie wiem” → 🟡 + ℹ️; 1.1.0).
  Wpisy w `rejestr-twardych-stopow.md` (strażnik rozpoznaje poziom warunkowy `x ? "critical" : "warning"`).
- Taryfa nocna (5.59) zbudowana: `ogrzewanie/taryfa-nocna-pompy-ciepla`. Dane M14 (`rozliczenia-pl-2026`) nie pasują
  (składniki opłat sieciowych, bez godzin stref i ceny energii) — ceny i godziny wpisuje user.
- Pułapka narzędzia: złożone polecenia powłoki z pętlami i operacjami na repozytorium bywają odrzucane w worktree —
  skrypty pomocnicze trzymać w scratchpadzie.
## Realny dobór paliwa (M7/E2 1.1.0) i nagrzewnica powietrza (M6) — 02.10.2026, gałąź `worktree-agent-aeec741df94f9f9f7`, niewypchnięta

- Na polecenie właściciela (tekst decyzji w `lista-do-zrobienia.md`; `rejestr-decyzji.md` celowo nietknięty — edytuje go inna
  sesja): M7/E2 pokazuje łańcuch agregatu (kW na godzinę pracy, l/kWh), horyzonty startowe 3/7/14 dni/miesiąc/własne dni oraz
  tryb realistyczny z wieloletnią historią dobową (`historia.ts`). Nowy ekran M6 `nagrzewnica-powietrza` (osobny, bo
  `koszty-ogrzewania` nie wycenia prądu pomocniczego w koszcie kWh i nie pokazuje obciążenia baterii).
- Decyzja projektowa: typ `HistoriaDobowa` (lata × doby, `null` = brak dnia, etykieta źródła) jest jednym slotem dla danych
  PVGIS, pomiarów budynku i miejscowości — później więcej danych = węższy zakres bez zmiany silnika. Percentyl metodą
  najbliższej rangi (bez interpolacji) — przy małej liczbie lat wynik to zawsze zaobserwowana wartość, a „percentyl = max”
  jest jawnie zgłaszany jako mało danych.
- **Nie zweryfikowane:** pobieranie PVGIS `seriescalc` — z piaskownicy `re.jrc.ec.europa.eu` = 403 z proxy, więc adaptera nie
  zbudowano (kształtu odpowiedzi nie wolno zgadywać). Testy silnika na własnych fixture'ach, nie na danych klimatycznych.
- Pułapki: (1) worktree bez `node_modules` — dowiązanie symboliczne do `node_modules` repo głównego wystarcza dla
  `tsc`/`vitest`/`eslint` (jest w `.gitignore`); (2) sandbox odrzuca heredoki i złożone polecenia git — pliki przez Write/Edit;
  (3) nowy moduł w `lib/core/modules/**` trzeba dopisać do `MIGRATED_MODULES` w `scripts/check-i18n-guard.mjs`, a kody 🔴
  walidacji do `scripts/stopy-guard-wyjatki.json`; (4) nowy ekran: UI `lib/i18n/ui/index.ts`, pomoc `lib/i18n/pomoc/*`,
  narzędzie AI w `pytaj-asystenta.ts`, wpis w `lib/pulpit/registry.ts`.
- Założenia ✅🤖 (10 punktów) zebrane w jednym wpisie ⚠️ `lista-do-zrobienia.md` z 02.10.2026.

## Telemetria — kontrakt i transporty (02.10.2026)

- Zbudowano `lib/core/telemetria/*` (próbka, koperta ESP32 v1 w zod, CSV z profilem kolumn, jakość danych, symulator) i
  `lib/adapters/telemetria/*` (magazyn próbek IDB + pamięć, źródła: symulator, HTTP, Web Serial, Web Bluetooth). Kontrakt:
  `docs/telemetria-kontrakt-esp32.md`. Powód: WiFi/BLE nieznane przez miesiące — transport to wymienny adapter za portem `TelemetrySource`.
- `DB_VERSION` IndexedDB 1→2 (nowy store `telemetria-probki`, migracja addytywna, standard 5.4). Testy wersji nie wymagały zmian.
- Progi „zakres fizyczny” w `WIELKOSCI` to szerokie granice sensowności czujnika, nie normy. Wartości symulatora są poglądowe.
- **Nie zweryfikowane:** Web Serial / Web Bluetooth na prawdziwym sprzęcie (testy na atrapach); UUID BLE do ustalenia z firmware;
  MQTT-WS niezbudowany (zależność vs budżet SW, D61). Ekrany live (M13) jeszcze nie podpięte do źródeł.
- (02.10.2026, uzupełnienie) CSV bez nagłówka + osobna legenda: profil adresuje kolumny numerem, obsługuje czas w osobnych
  kolumnach / DD.MM.RRRR, stałe przesunięcie strefy i znaczniki braku; rejestr źródeł i zapisanych profili (zod, odczyt odporny
  na uszkodzone dane); `importujCsv` (parsowanie → dedup → magazyn → raport jakości). Wielkości pogodowe dodane z jednostkami
  SI — **legenda Pogodynki jeszcze niedostarczona**: jednostki i znaczniki braku z jej plików trzeba potwierdzić, nie zakładać.


## i18n poza zasięgiem strażników (02.10.2026)
Lista zapadkowa strażnika UI (`app/`+`components/`) pokazywała 6 plików, ale niezależny skan `lib/` znalazł polskie teksty renderowane surowo:
rejestr pulpitu (zrobione — `lib/i18n/ui/pulpit-rejestr.ts`, test z rejestru), stałe silnika (zrobione — `stale-*.ts`) i 11 grup luk (wpis „Audyt i18n
poza zasięgiem strażników” na liście). Wniosek: „strażnik OK” ≠ „EN/RU kompletne”; tekst z `lib/` wstawiany w JSX (`{x.label}`, `{x.blad}`) omija oba
strażniki. Kandydat do `docs/wklad-do-standardu.md` (strażnik skanujący eksportowane literały `lib/`).

## 2026-10-02 — waluta wyświetlania i metadane per rynek
- **Waluta (`lib/waluta/`, `components/waluta-wybor.tsx`, Ustawienia).** Silnik i dane (taryfy, opłaty) zostają w PLN — to polskie stawki prawne. Wybrana waluta (dowolna z listy, także w PL) zmienia tylko *wyświetlanie* wyników: `useZl()` zastąpił `zl()` (29 użyć). Kursy: ECB przez Frankfurter (`api.frankfurter.dev`, CSP `connect-src` w `proxy.ts`), bufor 12 h w localStorage (działa offline), kurs ręczny > automatyczny, narzut % (kurs × (1+p/100), domyślnie 0). **Revolut nie ma publicznego API kursów (revolut.com → 403)** — „kurs Revolut” = wpis ręczny + narzut; UAH tylko ręcznie (brak w ECB). Brak kursu → pokazujemy PLN, nie błędną liczbę.
- **Świadome ograniczenia (patrz lista):** pola wejściowe kwot nadal w PLN; „zł” wpisane wprost w słownikach/`lib/core` (opisy, jednostki „zł/kWh”) nie jest jeszcze sparametryzowane.
- **Metadane per rynek.** `generateMetadata()` + `app/manifest.ts` (dynamiczny) biorą język z `Accept-Language` (PL/EN/RU; teksty `lib/i18n/ui/meta.ts`), `<html lang>` renderowany wg tego samego. Jedyne miejsce, gdzie 17.4 dopuszcza nagłówek: serwer nie widzi localStorage, a title/manifest czyta przeglądarka przed skryptem. Zweryfikowane na `pnpm start` (ru → manifest po rosyjsku, en → `<title>Offgrid Engineer Pro</title>`). Baseline strażnika UI: layout/manifest/wspolne usunięte (3 pliki/4 teksty zostały).

## 2026-10-02 — parametryzacja `{waluta}` w słownikach (decyzja właściciela: rynek PL = PLN, inny = wybrana waluta)

`podstaw()` zawsze podstawia `{waluta}` (domyślnie „zł”); `useTranslate(stalaPln?)` dokłada symbol wybranej waluty (`useSymbolWaluty()` w `language-context.tsx` — tam, a nie w `use-waluta.ts`, żeby uniknąć cyklu importów; brak znanego kursu → PLN, ta sama reguła co `useZl`). `PomocPola`/`MigawkaInfo` dokładają `waluta` do parametrów. Migracja skryptowa (regex z lookaroundami na litery — omija „złącza/złączki”): skróty „zł”/„PLN”/„зл” → `{waluta}` w `lib/i18n/{ui,pomoc}/*` i `dictionary-{pl,en,ru}.ts`, z WYŁĄCZENIEM rynku PL (`m14-*`, `m15-m16-siec`, `komponenty-siec`, `pomoc/m14-siec`, klucze `SIEC-*`) — te zostają „zł” na sztywno, a ekrany PL wołają `useTranslate(true)`. Pułapka: test zgodności `{params}` PL/EN/RU w `pomoc.test.ts` wyłapał miejsca, gdzie jeden język miał prozę („в злотых”, „na złotówki”) a inny `{waluta}` — ujednolicone. Ograniczenie: wartości domyślne pól to PLN, bez konwersji (patrz `lista-do-zrobienia.md`).

## 2026-10-02 — przeliczanie wartości pól przy zmianie waluty (decyzja właściciela: przeliczać)

- `usePersistedDraft(klucz, poczatkowy, konwersjaKwot?)` zwraca `[stan, setStan, info]`; przy zmianie waluty mnoży pola kwotowe przez `kurs_nowy / kurs_stary` (`wspolczynnikPrzeliczenia`), 6 cyfr znaczących (`przeliczPoleTekst`, `przeliczPola`). Waluta, w której jest szkic, leży obok szkicu (`offgrid.draftwaluta.<ekran>`, zapisywana razem) — ekran nieotwarty w chwili zmiany przelicza się przy następnej wizycie. Brak kursu → PLN (bez konwersji).
- `components/przeliczone-info.tsx` pokazuje: „przeliczono z X na Y zgodnie z kursem EBC (Frankfurter) na dzień …” (albo „własnym kursem”, + narzut). Klucze `UI-WAL-PRZELICZONO-*`.
- Pola kwotowe weryfikowane po jednostkach `{waluta}` w UI/pomocy, nie po nazwach; ekrany rynku PL (`useTranslate(true)`) nie przeliczają. Pułapka: wielokrotne zaokrąglanie przy kolejnych zmianach waluty kumuluje błąd rzędu 1e-6 (akceptowalne).
- Lint `react-hooks/set-state-in-effect`: znacznik „wczytano” trzymany jako klucz (`wczytanoKlucz === key`), bez synchronicznego `setState` w efekcie.

- **Kursy walut — serwerowa kopia (02.10.2026, decyzja właściciela: zamiast Revolut).** `app/api/kursy/route.ts` pobiera Frankfurter/EBC (`next.revalidate` 12 h, `s-maxage` CDN) i oddaje `{ok,date,rates}`; `odswiezKursy()` w `lib/waluta/storage.ts` próbuje najpierw `/api/kursy` (same-origin), potem Frankfurter bezpośrednio (CSP `KURSY_SRC` zostaje jako fallback), zapisuje `{pobranoMs,dataEcb,kursy}` w localStorage (offline działa na ostatnich). Wspólny parser/URL: `lib/waluta/kursy-zrodlo.ts`. UI pokazuje datę kursu i moment pobrania (`UI-WAL-STAN-KURSOW`). Cache serwera = cache Next/CDN, nie trwała baza.

- **Kursy walut — trwały zapis na serwerze (02.10.2026, doprecyzowanie właściciela: „kursy muszą być zapisywane”).** Cache Next/CDN nie wystarcza. `/api/kursy` czyta najpierw tabelę `kursy_walut` (Supabase, migracja `supabase/migrations/0002_kursy_walut.sql`, jeden wiersz na datę ECB = historia, RLS bez polityk, dostęp tylko service role przez `lib/adapters/supabase/kursy-store.ts`); świeży zapis (<12 h) jest serwowany bez wołania Frankfurter, inaczej pobranie + zapis, a gdy Frankfurter nie działa — ostatni zapis (`source: zapis-nieaktualny`). **Wymaga uruchomienia migracji 0002 i ustawienia `NEXT_PUBLIC_SUPABASE_*` + `SUPABASE_SERVICE_ROLE_KEY` na hostingu; bez nich trasa degraduje się do samego cache (nic się nie psuje).** Nie rusza to logowania (pozycja 7), używa tylko klienta admin.

## Audyt i18n poza strażnikami — `pv/czystosc-i-snieg` (02.10.2026)
- Pułapka: `check:i18n-guard` przepuszczał moduł z polskim tekstem, bo widzi tylko `Warning.message` jako literał w obiekcie i `assumptions` jako gołe stringi — nie widzi pól `string` w `value` wyniku (`opis`, `powod`) ani `message` zbudowanego w funkcji pomocniczej (`outOfRange`). Naprawione w tym module: wynik niesie `opisKey`/`powodKey` + params, ekran i narzędzie AI rozwiązują `t()`. Klucze `KATSTOPNI-/SPADEKPRODUKCJIPCT-POZA-ZAKRESEM` wynikają z `code` (bez `i18nKey`).
- Do wypromowania (kandydat do `docs/wklad-do-standardu.md`): strażnik silnika powinien flagować polskie litery w literałach zwracanych w `value`, nie tylko w `message`.
- Zakres pozostały: wpis „Audyt i18n poza strażnikami” w `docs/lista-do-zrobienia.md`.

## M7/E12 + M7/E7/E14 v2.0.0 (02.10.2026)

- **M7/E12 „Współczynnik Bezpieczeństwa Zimowego” zbudowany** (`lib/core/modules/stress-test/wspolczynnik-bezpieczenstwa-zimowego/`,
  ekran `wspolczynnik-bezpieczenstwa-zimowego`, narzędzie AI `policz_wspolczynnik_bezpieczenstwa_zimowego`). Wagi 30/25/20/15/10%
  (pokrycie/autonomia/odporność/agregat/reakcja) to propozycja asystenta zaakceptowana przez właściciela „na razie” — **wstępne,
  do dopracowania**; ekran zawsze pokazuje je obok wyniku z notą PL/EN/RU i pozwala wpisać własne (suma 100%). Agregacja w jednej
  funkcji (`aggregation.ts`) — łatwa zamiana na regułę najsłabszego ogniwa. Nie dodano żadnych 🔴.
- **Skąd składowe** (ta sama tabela na ekranie i w `docs/lista-do-zrobienia.md`); odsyłacze źródła 6.1 → E1 (nie zbudowany),
  6.4 → E4, 6.7 → E7, 6.9 → E8, 6.11 → M6/E8:

  | Składowa (waga) | Wczytuje z | Zależy też od |
  |---|---|---|
  | Pokrycie energetyczne (30%) | E2 `deficyty-miesieczne` (produkcja = zapotrzebowanie − największy deficyt) | M2 `zuzycie-miesieczne`, M3 `liczba-paneli`, E7/E14 (strata śniegu/szadzi) |
  | Czas autonomii (25%) | E4 `blackout` (dni przetrwania, długość scenariusza) | M4 `dni-autonomii`, E6 `strategia-zamarzanie`, E2 (agregat) |
  | Odporność na awarie (20%) | E10 `analiza-spof` | E19 `elektronika-w-mrozie`, E21 `pompy-zawory-w-mrozie` |
  | Zapas mocy agregatu (15%) | E2 (moc agregatu) | M2 `agregat-pradotworczy`, E8 `agregat-w-mrozie` |
  | Czas reakcji na zamarznięcie (10%) | E6 `strategia-zamarzanie` (czas zasilania krytycznych) | M6/E8 `pojemnosc-cieplna`, E18 `pre-heat`, E22 `ryzyko-zamarzniecia` |

- **Mechanizm:** ekran czyta zapisane szkice innych ekranów przez `useOdczytDraftu` (tylko odczyt, jeden właściciel zapisu) i
  przelicza je silnikami tamtych ekranów (`zrodla.ts`) — nic nie jest powielone; wartość trafia do pola dopiero po kliknięciu.
- **✅🤖 (jeden wpis ⚠️ w liście zadań):** odwzorowanie wartości na 0–100% (stosunek obcięty do 100%, SPOF jako udział komponentów
  z redundancją), próg słabego punktu 70%, wynik tylko przy komplecie pięciu składowych, definicja czasu reakcji.
- **M7/E7 + E14 v2.0.0 (CALCULATOR_VERSION 2.0.0):** tabela „co jeśli” (1/3/5/7 dni + przykłady źródła), własne dni/% opcjonalne;
  sekcja „co z tym zrobić” (pięć opcji) z bilansem energii dla kabla, folii i automatu: zużycie = P × h, odzysk = strata dobowa ×
  (dni − h/24), 🟡 gdy grzanie zużywa więcej, niż odzyska; moc zawsze z karty katalogowej od usera; ℹ️ o gwarancji producenta.
  Wspólny komponent `components/wzorce/osad-na-pv.tsx`. Rekomendacja: kąt i ręczne zgarnianie najpierw; grzanie tylko gdy się
  zwraca, na żądanie, z nadwyżki/agregatu, nigdy z niskiej baterii.
- **Pułapka (środowisko):** w worktree nie ma `node_modules` — dowiązanie symboliczne do `node_modules` repozytorium głównego
  (ignorowane przez `.gitignore`) wystarcza do `tsc`, `eslint`, `vitest`.
- **Pułapka (stopy-guard):** nowe kody walidacji 🔴 (`WSP-WAGI-SUMA`, `WSP-SPOF-PONAD-LICZBE`, `WSP-WARTOSC-UJEMNA`) trzeba było
  dopisać jawnie do `scripts/stopy-guard-wyjatki.json`.

## Audyt i18n — konwencja `*Key` w params (02.10.2026)
- `t()` (`lib/i18n/t.ts`) rozwija każdy parametr `xKey` (string) do `x` przez słownik języka UI; domena podaje `labelKey: "POLE-…"`, szablon używa `{label}`. Zamiast polskiej etykiety w `params` — klucz; nie trzeba zmieniać ~100 stron renderujących ostrzeżenia.
- Pułapka przy mechanicznej podmianie: nazwa pola (`"albedo"`) i etykieta (`"albedo"`) bywają identyczne — podmieniać tylko argument etykiety, nie pierwszy (`field`).
- Partia 1: `lokalizacja/*` i 5 modułów `pv/*`; reszta wg wpisu w `docs/lista-do-zrobienia.md`.
- Partia 2: `stress-test/obciazenie-dachu-sniegiem`, `ogrzewanie/obciazenie-cieplne`. Etykieta z parametrem (np. nazwa przegrody) = klucz z `{przegroda}` + osobny param obok `labelKey`; `rozwinKlucze` podstawia pozostałe params do tekstu etykiety. Pułapka podmiany opisana też w `docs/wklad-do-standardu.md` (02.10).
- Partia 3 (02.10): 37 plików hurtowo skryptem (wywołania z literałem etykiety, mapy `ETYKIETY`, `params: { label }` → `labelKey`); 95 kluczy `POLE-*`, lowercase-first → sufiks `-L`. Typecheck dopilnował, że żadne `label` nie zostało w sygnaturach. Zostaje kategoria C (etykiety katalogowe/użytkownika, `message` w komunikacja-bms, katalogi `constants.ts`).
- Kategoria C, krok 1 (02.10): `komunikacja-bms` i `audyt-pozarowy` zmigrowane na `i18nKey` + params (3 nowe klucze PL/EN/RU); strażnik `check-i18n-guard` rozszerzony o `message` jako template literal i o `label:`/`*Key:` z literałem niebędącym kluczem (pusty string dozwolony). Dane demo audytu pożarowego (`SAMPLE_AUDIT_ITEMS`) zostają po polsku — do decyzji właściciela.

## Archiwizacja memory.md — pierwszy przebieg (02.10.2026, gałąź `claude/amazing-tesla-ovgwya`)

- **Polecenie właściciela:** „memory trzeba wymyślić jakiś system archiwizacji, lecz wyciągnąć wszystkie przydatne rzeczy”. Ustalenia z pytań: plik aktywny pod nazwą `docs/memory.md` (odsyłacze w CLAUDE.md i Biblii bez zmian), próg 7 dni + brak otwartego wątku, kolejność: najpierw memory, potem lista zadań (osobny przebieg), potem `wklad-do-standardu.md`.
- **Wynik:** 174 sekcje z linii 7–6569 oryginału (534 305 B) przeniesione 1:1 do 10 plików `docs/memory-archiwum/01…08-*.md` (+ `INDEKS.md`); 90 sekcji od 25.09.2026 (od linii 6570) zostało dosłownie w tym pliku. Rozmiar `memory.md`: 769 853 B → ok. 241 KB, z czego Skrót aktywny (pułapki, konwencje, decyzje) to ok. 38 KB na początku pliku.
- **Dowód bezstratności:** skrypt złożył nagłówek (linie 1–6) + zawartość plików archiwum po znaczniku + ogon pliku aktywnego i porównał z kopią oryginału: **identyczne co do bajta** (769 853 B). Kopia oryginału z tej sesji: scratchpad (nie jest w repo — dowodem jest też historia gita, commit sprzed archiwizacji).
- **Destylacja:** przeczytałem całość archiwizowanej treści (534 KB) i wyciągnąłem do Skrótu aktywnego wszystko, co nadal obowiązuje (proces, środowisko, wzorce kodu, źródła/normy, i18n, UI, bezpieczeństwo, synchronizacja Y.6, odstępstwa). Sprzeczności między okresami oznaczone: wariant i18n z cookie (16.09) zastąpiony client-side bundled (20.09), lokalny cykl Y.6 ≤12 h (D21) zastąpiony adaptacyjnym (D24), niezweryfikowane twierdzenie o limicie Actions (20.09) vs pomiar API (23.09) — w Skrócie opisane jako stan rzeczywisty, nie jako fakty.
- **Pułapka procesu:** daty w nagłówkach sekcji są niepełne (100 z 264 sekcji bez daty w nagłówku, „Decyzje i uzasadnienie (c.d. N)” to licznik dopisków, nie data), więc granicę wieku wyznaczono po POZYCJI w pliku (plik jest dopisywany chronologicznie), a nie z nagłówków; sekcja „Synchronizacja ze standardem” (44 KB, log 04–23.09) trafiła w całości do archiwum.
- **Następny przebieg:** ok. 09.10.2026 sekcje z 25–29.09 przekroczą próg 7 dni; wtedy wyciągnąć z nich do Skrótu to, co obowiązuje (np. D58 `UI-*`, strażnicy `check:pomoc-guard`/`check:stopy-guard`/`check:ai-tools-guard`, SW wariant C/D59, style D67), przenieść 1:1 do `docs/memory-archiwum/09-…` i zaktualizować `INDEKS.md`. Kolejne pliki: `docs/lista-do-zrobienia.md` (1646 linii) i `docs/wklad-do-standardu.md` (105 KB) — patrz wpis na liście zadań.
- **Zgłoszenie do standardu:** `docs/wklad-do-standardu.md`, wpis z 02.10.2026 (POMYSŁ NA REGUŁĘ: mechanizm archiwizacji dla plików roboczych — W.5/C.8 opisują problem, nie dają procedury).

## Zasada stała od właściciela: ważne rzeczy do standardu bez pytania (02.10.2026)
- Polecenie właściciela: „zawsze jak coś ważne jest, dodawaj do standardu i nie pytaj mnie”. Znaczy: pułapki, wzorce i luki strażników zapisywać od razu w `docs/wklad-do-standardu.md` (kanał zwrotny; `docs/standards/*` i GOD BOOK nadal nietykalne) i tylko poinformować w podsumowaniu. Dziś dopisane: strażnik i18n a `message` jako template literal i `label`/`*Key`, dane użytkownika w `params`.

## 2026-10-02 — Audyt i18n, kategoria C: katalogi `label:` nie wymagają migracji
Skan `label:` w `constants.ts` pokazał, że etykiety katalogowe są już tłumaczone na ekranie po id (`components/zapotrzebowanie/etykiety-stalych.ts`, `UI-STALEBAT-*`); silnik trzyma PL jako fallback i do zapisu szkiców. Nie migrować do `labelKey` — zmieniłoby to format zapisanych szkiców bez zysku. Lista zapadkowa 3/4: 1 fałszywy alarm (SVG), 1 `werdykt.tsx`, 2 w piśmie reklamacyjnym `test-licznika` (pytanie do właściciela o język pisma).

## 2026-10-02 — Pismo reklamacyjne w `test-licznika` przestało być wyjątkiem
Właściciel: pismo ma być tłumaczone (wcześniej komentarz w kodzie zakładał treść zawsze po polsku dla polskiego OSD). Wzorzec: pole edytowalne z wartością domyślną zależną od języka trzymaj jako `null` do pierwszej edycji, nie jako wpisany tekst — inaczej zmiana języka nie zmieni domyślnej treści.

## 2026-10-02 — PVGIS `seriescalc` zbudowany (M7/E2 „deficyty-miesieczne”)
- Dostęp do `re.jrc.ec.europa.eu` wrócił (HTTP 200), więc kształt odpowiedzi zweryfikowano na żywo: `outputs.hourly[]` z `time:"YYYYMMDD:HH10"` (UTC, średnia godzinowa), `G(i)` [W/m²] przy zadanym `angle`/`aspect` (0 = południe), baza PVGIS-SARAH3 + ERA5.
- Pułapki PVGIS: (1) zakres lat to **2005–2023** (v5_3) — poza nim 4xx; (2) ok. 0,75 MB/rok (19 lat ≈ 14 MB) → timeout 90 s i agregacja do dób po stronie serwera (klient dostaje kilkadziesiąt KB); (3) moc `P` jest w odpowiedzi tylko z `pvcalculation=1&peakpower=..&loss=..` — nie używamy, produkcję liczy silnik z kWh/m² × kWp × PR podanych przez użytkownika.
- Decyzja: doba = data UTC znacznika; doba bez kompletu 24 rekordów = `null` (nigdy dopełniana). Nachylenie i azymut użytkownik wpisuje sam (aplikacja żadnych nie zakłada); lata domyślnie cały zakres bazy.
- Wynik zapisuje się w szkicu ekranu (pole historii), więc po pobraniu działa offline.

## 2026-10-02 — Telemetria partia 2(a): ekran „Źródła danych telemetrii”
- Ekran składa gotowe funkcje rdzenia (bez nowego silnika): rejestr w `indexedDbStorageAdapter` (klucz `telemetria-rejestr`, osobno od szkicu formularza), import przez `importujCsv` + `IndexedDbMagazynProbek`. Szkic formularza w `usePersistedDraft("zrodla-telemetrii")`; zawartość pliku trzymana tylko w stanie Reacta (nie w szkicu — duże).
- Mapowanie kolumn z formularza buduje czysta funkcja `zbudujProfil` (`lib/core/telemetria/profil-formularza.ts`): adres kolumny to liczba tylko przy „bez nagłówka” i tekście `^\d+$`; walidacja `ProfilCsvSchema`; niepełne mapowanie = odmowa, nie zgadywanie. Krok próbkowania [s] wpisuje użytkownik (wymagany > 0).
- Usunięcie źródła kasuje też jego próbki (`usunZrodlo`) po `window.confirm`. Tłumaczenia EN/RU (`m13-telemetria.ts`, pomoc `zrodla-telemetrii`) — moje, do przeglądu właściciela.

## 2026-10-03 — Telemetria partia 2(b): „Pomiary na żywo i alarmy”
- Rdzeń `lib/core/telemetria/alarmy.ts`: `ocenAlarmy` liczy na NAJNOWSZEJ poprawnej próbce serii (źródło|kanał|wielkość); braki i poza-zakresem pomijane, nigdy zero; alarm gdy wartość ściśle poniżej/powyżej progu; sortowanie: priorytet, potem czas. Progi nie mają wartości domyślnych (Biblia daje tylko przykłady typu SoC < 25%) — wszystkie od użytkownika, Dyrektywa #1. Limit „po ilu sekundach dane nieaktualne” też od użytkownika (puste = bez kontroli).
- Ekran `app/kalkulatory/pomiary-na-zywo/` odświeża się co 3 s z `IndexedDbMagazynProbek.zakres`; dane CSV starsze niż okno nie są pokazywane (komunikat zamiast pustego wykresu). Przy zmianie źródła/wyjściu źródło jest rozłączane. Narzędzie AI `ocen_alarmy_telemetrii` (read). Tłumaczenia EN/RU i pomoc — moje, do przeglądu właściciela.
- Pułapka: nowy ekran wymaga wpisu w `EkranPomocy` (`lib/i18n/pomoc/*`), inaczej tsc odrzuca `ekran="..."`.

## 2026-10-03 — Telemetria: zapisane profile mapowania CSV
- Ekran „Źródła danych telemetrii” zapisuje mapowanie jako nazwany profil (`zapiszProfil`), wczytuje je do formularza (`profilDoFormularza` = odwrotność `zbudujProfil`, test round-trip) i usuwa (`usunProfil`). Ta sama nazwa nadpisuje profil. Krok próbkowania NIE jest częścią profilu — użytkownik podaje go przy każdym imporcie (Dyrektywa #1).

## 2026-10-03 — Telemetria: historia zdarzeń i odtwarzanie (7.43, 7.34)
- Rdzeń `epizodyAlarmow` (alarmy.ts): per próg i seria próbki `ok` po czasie; przekroczenie otwiera epizod, pierwsza próbka w limicie zamyka (`doMs = null` = trwa); wartość równa progowi nie jest przekroczeniem (spójnie z `ocenAlarmy`); braki i poza-zakresem nie otwierają ani nie zamykają. `probkiDoChwili` + `ostatnieWartosci`/`ocenAlarmy` dają stan z chwili t.
- Ekran `historia-zdarzen` NIE ma własnych progów: czyta draft `pomiary-na-zywo` przez `useOdczytDraftu` (jeden właściciel zapisu progów). Własny szkic: źródło, zakres (6/24/168 h), pozycja suwaka 0–1000.
- Tłumaczenia EN/RU i pomoc ekranu — moje, do przeglądu właściciela.

## 2026-10-03 — Telemetria: powiadomienia przeglądarki (7.7)
- `noweAlarmyDoPowiadomienia` (czysta funkcja): jedno powiadomienie na trwający alarm (klucz `progId|kanał`), po ustąpieniu klucz zapomniany → kolejne przekroczenie powiadamia znowu; minimalny priorytet z szkicu (`powiadomieniaMin`, domyślnie wyłączone). Zgoda przeglądarki prosi o osobny przycisk (nigdy automatycznie). SMS/e-mail/web-push w tle wymagają serwera — poza zakresem aplikacji offline-first.

## 2026-10-03 — Telemetria: podsumowanie i eksport CSV (7.50, 7.30)
- `podsumujSerie`: tylko próbki `ok`; pominięte (braki, poza zakresem) raportowane osobno, nigdy jako zero. Energia z mocy metodą trapezów TYLKO dla par próbek o odstępie ≤ limitu wpisanego przez użytkownika (`maxPrzerwaMin`, bez wartości domyślnej — Dyrektywa #1); bez limitu energia = null i ekran tłumaczy dlaczego. Średnia jest zwykła, nie ważona czasem.
- `probkiDoCsv`: czas ISO, wartości w jednostce podstawowej, braki jako puste komórki. PDF/API poza zakresem (serwer).
- Tłumaczenia EN/RU i pomoc ekranu — moje, do przeglądu właściciela.

## 2026-10-03 — Przekazanie sesji (telemetria i jakość)
- Telemetria zamknięta w zakresie bez sprzętu/serwera; jakość: odświeżone przestarzałe wpisy listy (dryf stopów M5, przegląd z 27.09), uwaga o aktualności w `mapa-wdrozenia.md`. Dalsze kroki (migracja `*Key`, przeliczenie mapy, CI po 1.10) spisane w jednym wpisie „PRZEKAZANIE SESJI” w `docs/lista-do-zrobienia.md`.

## Przegląd gałęzi 02.10.2026 — powtórzony błąd procesu (zapis w Skrócie aktywnym)

- Po poleceniu „sprawdź niescalone commity” sesja policzyła gałęzie od zera (po `--unshallow`: 5 gałęzi z łatkami spoza `main`) i ręcznie porównywała pliki, choć lista gałęzi-śmieci istniała w tym samym pliku (27.09/29.09). 4 z 5 sprawdzonych gałęzi były na liście (`laughing-faraday-lp6ytt`, `youthful-fermat-tbxoxg`, `sync-offgrid-standard-ucgqok`, `screen-fixes-new-documents-80kzcm`); wynik zgodny z listą (treść już w `main` w nowszej strukturze, scalenie cofnęłoby dokumenty).
- Jedyna gałąź poza listą: `claude/pensive-noether-jq72ja` (02.10.2026, i18n `pv/czystosc-i-snieg`, 1 commit kodu `be47430c` + 2 scalenia `main`; scala się z `main` bez konfliktów) — praca innej sesji w toku, nie scalana bez decyzji właściciela.
- Przyczyna powtórzenia: zasada „najpierw lista” leżała w sekcji z 27.09/29.09, nie w miejscu czytanym na starcie. Poprawka: punkt „Gałęzie zdalne” w Skrócie aktywnym (sekcja 1).

## 2026-10-03 — Kroki 2 i 4 przekazania, przywrócenie zasady o gałęziach

- Krok 4: `check-i18n-guard` skanuje wszystkie `.ts` silników i katalogi pomocnicze (`e2af58bb`). Krok 2: tylko pomiar wierszy rejestru (322 `done`, nie ekrany) — T.1 nieprzeliczone.
- Commit `9554a389` (zasada „najpierw lista gałęzi”) zniknął z gałęzi po przestawieniu na `origin/main` i nie był w `main`; przywrócony cherry-pickiem (`fe00ff77`).
