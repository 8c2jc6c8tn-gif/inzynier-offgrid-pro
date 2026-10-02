# Archiwum docs/memory.md — 07-zaleglosci-i-kafle-19-23-09

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 5309–6098 stanu sprzed archiwizacji | **Liczba sekcji:** 18
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Sześć otwartych pytań zebranych i rozstrzygniętych przez właściciela projektu (19.09.2026)

Na prośbę właściciela ("zrób oddzielny wątek i dawaj zdecydujemy") zebrano wszystkie pytania z
`docs/lista-do-zrobienia.md`/`docs/memory.md`, które AI zgłosiło jako wymagające decyzji
właściciela (15.4) i nie rozstrzygnęło samodzielnie, z opcjami rozwiązania per pytanie. Sześć
odpowiedzi, różny status realizacji:

1. **Model i18n dla treści katalogowej** (`pv/czystosc-i-snieg`, `baterie/komunikacja-bms`,
   `baterie/porownanie-technologii`) — **decyzja: otworzyć nowy, odrębny wątek** (opcja B).
   Nie realizowane w tej sesji — czeka na osobne zadanie.
2. **Integracja Ekran 1 ↔ Ekran 6, Moduł 4 (baterie)** — **decyzja: zbudować pełny profil
   wejściowy "Mój sprzęt"** (opcja B), nie tylko wąskie spięcie tych dwóch ekranów. **Zrealizowane
   (19.09.2026) w zakresie świadomie zawężonym do baterii** — pełna wizja źródła
   (`docs/zrodla/Zasady_UX_Doradca_v2_1.md`, §10: panel/falownik/BMS/generator, wiele zapisanych
   profili/wariantów, ostrzeżenie o niezapisanych zmianach) jest dużo większa niż to, co realnie
   blokowało te dwa ekrany — zbudowano ją teraz w kształcie gotowym do rozszerzenia, nie w pełnej
   docelowej skali, żeby nie projektować pod hipotetyczne, jeszcze niepotrzebne pola (CLAUDE.md,
   "nie projektuj pod przyszłe wymagania").

   **Kod:** `lib/profil-sprzetu/types.ts` (`ProfilSprzetu { bateria?: ProfilSprzetuBaterii }` —
   kształt otwarty na przyszłe sekcje `panel`/`falownik`/`generator`, żadna z nich jeszcze nie
   istnieje) + `lib/profil-sprzetu/use-profil-sprzetu.ts` (ten sam wzorzec co
   `use-persisted-draft.ts` — `IndexedDbStorageAdapter`, Seed nie Wynik — ale z JEDNYM ustalonym
   kluczem `offgrid.profil-sprzetu.v1`, współdzielonym między ekranami, nie `kluczEkranu` per
   wywołanie jak w drafcie formularza). Ekran 1 (`dobor-pojemnosci-baterii/page.tsx`) zapisuje
   `pojemnoscUzytecznaDzisKwh` do profilu po każdym poprawnym przeliczeniu; Ekran 6
   (`starzenie-degradacja/page.tsx`) auto-wypełnia z niego swoje pierwsze pole (edytowalne, nie
   zablokowane — nadpisanie nie zapisuje się trwale do profilu, zgodnie z wymogiem źródła), i po
   swoim przeliczeniu zapisuje `pojemnoscPoczatkowaZBuforemKwh`/`buforHoryzontLata` z powrotem —
   Ekran 1 to wykrywa i dodaje drugą linię wyniku ("Z uwzględnieniem starzenia ogniw na N lat:
   X kWh"), z linkiem w obie strony (nawigacja, §9 Zasad UX — "brak ślepych zaułków").

   **Pułapka ESLint znaleziona i naprawiona przed shipem:** pierwsza wersja auto-wypełnienia w
   Ekranie 6 użyła `useEffect` + `setState` synchronicznie w ciele efektu —
   `react-hooks/set-state-in-effect` (kaskadowe re-rendery). Poprawiona wersja ustawia stan
   bezpośrednio w renderze (wzorzec "Adjusting state when a prop changes" z react.dev), z
   flagą-stanem `autoWypelnione` (nie `useRef` — kolejny błąd lintera, `react-hooks/refs`:
   odczyt/zapis refa w renderze jest w tym projekcie zablokowany, nie tylko w efekcie). `zapiszBaterie`
   w hooku owinięte w `useCallback([])`, inaczej nowa tożsamość funkcji przy każdym renderze
   wywołanym przez własny zapis dałaby nieskończoną pętlę efektu w komponencie wołającym.

   **Świadomie odłożone, nie przeoczone:** wiele zapisanych profili/wariantów (dziś jeden,
   niejawny profil na przeglądarkę — ten sam poziom co `lib/wyglad/`), ostrzeżenie o
   niezapisanych zmianach przy wyjściu z ekranu, sekcje `panel`/`falownik`/`generator`, UI w
   Ustawieniach do przeglądu/resetu profilu wprost (dziś tylko niejawny efekt boczny dwóch
   ekranów, bez własnego widoku). Do rozważenia w kolejnym kroku, jeśli więcej ekranów zacznie
   korzystać z tego samego profilu.

   Zweryfikowane: `pnpm typecheck`/`lint`/`test` (916/916)/`build` czyste. Playwright
   (`pnpm build && pnpm start`, potwierdzenie braku rezydualnego `next-server` przed i po):
   Ekran 1 → Ekran 6 (auto-wypełnienie 47,37 kWh z wejścia 12 kWh/3 dni/95%/80%) → powrót na
   Ekran 1 (bufor z Ekranu 6 poprawnie widoczny: "59,2 kWh" przy degradacji 2%/10 lat), zero
   błędów konsoli poza pre-existing 404 `_vercel/insights` (niezwiązane z tą zmianą, obecne też
   na `main` przed nią).
3. **Własne logo/ikony PWA** — **decyzja: zaprojektować własne logo teraz** (opcja A), kilka
   propozycji do wyboru właściciela. **Wybór dokonany i wdrożony (19.09.2026): koncepcja D
   "Monogram OG"** — litery O i G (Off Grid) zlane w jeden znak, kolory 1:1 z istniejącymi
   tokenami aplikacji (`--primary` na tło, akcent "G" pożyczony z `--werdykt-uwaga`, bez
   dodawania trzeciego koloru do palety). Zastąpiony domyślny znak v0.app: `public/icon.svg`
   (źródło wektorowe) + `icon-192.png`/`icon-512.png`/`apple-icon.png`/`icon-light-32x32.png`/
   `icon-dark-32x32.png` (rasteryzowane z niego Playwrightem — brak `sharp`/`rsvg-convert` w
   środowisku, headless Chromium jako zamiennik). Light/dark warianty faviconu celowo identyczne
   — to pełnokolorowa plakietka, nie inwertowany mono-znak jak stary placeholder, więc rozróżnienie
   motywu przestało być potrzebne (kod `app/layout.tsx` niezmieniony, dwa pliki zostają z tych
   samych powodów co poprzednio: łatwe zróżnicowanie w przyszłości, gdyby było potrzebne).

   **Bug znaleziony przez realną weryfikację w przeglądarce, nie przez samo `pnpm build`:**
   pierwsza wersja `icon.svg` miała komentarz XML z dwoma dosłownymi wystąpieniami `--` (nazwy
   tokenów CSS `--primary`/`--werdykt-uwaga` wklejone wprost do treści komentarza) — nielegalne
   w XML (komentarz nie może zawierać `--`). `pnpm build`/`typecheck`/`lint` tego nie złapały
   (to statyczny plik, nie kod), a `curl` na `/icon.svg` też pokazywał 200 (serwer i tak zwraca
   bajty pliku). Dopiero nawigacja Playwrightem wprost na `/icon.svg` pokazała natywny błąd
   parsera XML Chromium ("Comment must not contain '--'") zamiast obrazka — to samo spotkałoby
   każdą przeglądarkę ładującą `<link rel="icon" type="image/svg+xml">` z `app/layout.tsx`.
   Naprawione (komentarz przepisany bez `--`), zweryfikowane ponownie — poprawny render ikony.
   **Zasada do zapamiętania:** przy edycji `public/*.svg` zawsze nawigować bezpośrednio na plik w
   przeglądarce (nie tylko sprawdzać kod HTTP), nie tylko oglądać go jako `<img>`/tło w innym
   kontekście, który bywa bardziej tolerancyjny na błędy XML niż nawigacja na sam dokument.

   Zweryfikowane: `pnpm typecheck`/`lint`/`build` czyste (bez zmian w kodzie TS — tylko zasoby
   statyczne), Playwright (`pnpm build && pnpm start`, `next-server` sprzątnięty przed i po):
   wszystkie pliki ikon 200, `/icon.svg` renderuje się poprawnie jako obraz, zero nowych błędów
   konsoli (pre-existing 404 `_vercel/insights` niezwiązany).
4. **Żywy edytor kolorów w Ustawieniach** — **decyzja: pełny edytor** (opcja B), cała paleta
   tokenów motywu, nie tylko kilka kluczowych. **Korekta tego samego dnia:** przed napisaniem
   kodu sprawdzono stan repo — okazało się, że to pytanie było już nieaktualne (dryf dokumentacji,
   patrz akapit korekty wyżej, wpis 2026-08-30) — edytor już istnieje i już pokrywa dokładnie ten
   zakres. Nic do zrobienia.
5. **Logowanie/konta — konfiguracja Supabase** — właściciel podłączy klucze w niedzielę po
   20:00. Bez zmian w kodzie do tego czasu — szkielet czeka jak dotychczas (`docs/lista-do-
   zrobienia.md`, wpis 2026-09-15).
6. **Model freemium (rozdz. 12 standardu)** — właściciel zajmie się decyzją biznesową
   (co płatne, cena) w niedzielę. Bez zmian w tej sesji.

## Kontynuacja: punkty 5/6/7/8/9 z listy zaległości (19.09.2026)

Właściciel poprosił o realizację pięciu zaległych punktów z audytu "co jeszcze zostało do
zrobienia" (patrz odpowiedź w tej samej sesji): kontynuacja Modułu 2, animowane ikony kafli
08-14, luki z gotową treścią źródłową (`docs/rejestr-pokrycia.md`), rollout autozapisu
(`usePersistedDraft`) na resztę ekranów, i domknięcie luki 1000-3000W (M4/napięcie-systemowe).

**Punkt 9 — kolejny dryf dokumentacji, nie realna praca:** kod już ma rekomendację 24V dla pasma
1000–3000W (`PROG_12V_MAX_W`/`PROG_48V_MIN_W`, `constants.ts`), z jawną assumption
`NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE` — zrobione 2026-09-04, wpis w `docs/lista-do-
zrobienia.md` po prostu nigdy nie dostał domykającego dopisku. Skorygowane bez zmian w kodzie.
**Trzeci taki przypadek w tej sesji** (po edytorze kolorów i teraz tym) — wzorzec do zapamiętania:
zawsze sprawdzić realny stan kodu przed rozpoczęciem "zaległej" pracy, nie ufać samej liście zadań.

**Punkt 7a — cztery luki z rejestru pokrycia, "gotowe do budowy" wg audytu 05.09.2026:**
zbudowane 2.15 (Ryzyko PID, Moduł 3) i 8.8 (Dobór regulatora PWM vs MPPT, Moduł 12) jako
prawdziwe kalkulatory — obie miały realny, computable próg w źródle. **5.46 (ryzyko
zamarznięcia dolnego źródła) i 5.31 (hałas i wibracje), oba Moduł 6, okazały się PRZY
REALIZACJI nie mieć wzoru** — wcześniejszy audyt określił je jako "gotowe do budowy, pełna
treść Doradcy z formułą", ale źródło (`Tresc_Modul_6_Ogrzewanie_Ekrany.md:306-326`) daje tylko
narrację + jeden ilustracyjny przykład liczbowy, bez wzoru wiążącego wejścia z wynikiem
("pełny szablon Doradcy A/B/C/D" ≠ "ma computable formułę" — ważne rozróżnienie na przyszłość:
etykieta "kompletny szablon" w źródle nie gwarantuje obliczalności). Zbudowane jako Wzorzec C
(treść informacyjna: czynniki ryzyka z odniesieniem do źródła danych, przykład jawnie oznaczony
"ilustracyjny, nie liczony dla Twojej instalacji", zalecenia, bez kalkulatora) — zgodnie z
dyscypliną "nie wymyślaj wzoru fizycznego" (CLAUDE.md, rdzeń operacyjny). 5.46 dopisane do
`docs/rejestr-twardych-stopow.md` (🔴), 5.31 świadomie nie (🟡, rejestr indeksuje tylko 🔴).

**Bug znaleziony przez Playwright, nie przez typecheck/lint/test:** pierwsza wersja dodała
`i18nKey` dla `Warning` w obu kalkulatorach (PID, PWM/MPPT), ale zapomniała, że `assumptions`
(`{kod, params}`) też przechodzą przez `t()` w `WynikSzczegoly` — brakujące klucze
`PID-PROG-NAPIECIA-ZE-ZRODLA`/`PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY` dały realny błąd
konsoli "Brak tłumaczenia dla części komunikatu" (fail-loud po `lib/i18n/t.ts` — nigdy cichy
fallback), niewidoczny w markerze `⚠ [` bo dotyczy `assumptions`, nie `warnings`. Naprawione,
dopisane do `t.test.ts`. **Zasada do zapamiętania przy każdym nowym module z i18n od zera:**
sprawdzić klucze zarówno dla `Warning.i18nKey` JAK I dla każdego `{kod}` w `assumptions` —
oba idą przez ten sam `t()`, oba wymagają wpisu w słowniku.

`scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES`: 87→89 (oba nowe moduły budowane
od razu z `i18nKey`, bez `.message`, zgodnie z konwencją "nowy kod domenowy = i18n od startu").
7 nowych testów domenowych (`ryzyko-pid`, 7; `dobor-regulatora-pwm-mppt`, 8) + nowy blok w
`t.test.ts` (5 kluczy z parametrami, 2 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
(933/933)/`build` czyste. Zweryfikowane end-to-end w przeglądarce (Playwright, świeży
`pnpm build && pnpm start`, potwierdzenie braku rezydualnego `next-server` przed i po) w
PL/EN/RU dla obu kalkulatorów + render obu ekranów informacyjnych — zero `⚠ [...]`, zero
błędów konsoli po poprawce.

**Punkt 7b — Wind Chill (Moduł 7, stress-test zimowy), "najsilniejszy niezależny kandydat"
klastra zimowego wg rejestru pokrycia:** `lib/core/modules/stress-test/wind-chill/`. Wzór
NWS/Environment Canada (2001), metryczny — ten sam wzorzec co Magnus-Tetens (`ochrona-wilgoc`)
i deklinacja Coopera (`profil-astronomiczny`): uniwersalna, publicznie znana fizyka/meteorologia
niepodana wprost w źródle projektu, nie wymyślona. Zweryfikowane niezależnie w Node przed
implementacją: przykład źródła (-10°C, 40km/h → "-20°C") odtwarza się z dokładnością 0,8°C
(wzór daje -20,77°C) — silne potwierdzenie, że to właściwy wzór. Świadomie NIE liczony drugi
człon przykładu źródła ("+35% strat ciepła, +2 kWh/dobę") — wymagałby modelu termicznego
budynku (Moduł 6) wiążącego deltę wind chill z procentowym wzrostem strat, którego źródło nie
podaje (tylko jeden ilustracyjny przykład). Ekran liczy wyłącznie temperaturę odczuwalną.
`OUT_OF_SCOPE` poza zakresem ważności wzoru (T>10°C lub wiatr≤4,8km/h, granice wzoru NWS, nie
luka źródła).

`MIGRATED_MODULES`: 89→90. 10 nowych testów domenowych (w tym 3 z wartościami referencyjnymi
zweryfikowanymi niezależnie w Node) + nowy blok w `t.test.ts` (6 kluczy z parametrami, 3 bez).
`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (943/943)/`build` czyste. Zweryfikowane w
przeglądarce (Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU: przypadek VALID
(-20,8°C) i OUT_OF_SCOPE poprawnie przetłumaczone, zero `⚠ [...]`, zero nowych błędów konsoli.

To zamyka punkt 7 z listy zaległości (5,6,7,8,9) w zakresie, jaki dawał się zrealizować bez
wymyślania fizyki/wzorów. Pozostały klaster stress-test zimowy (~25 pozostałych `todo` w
`docs/rejestr-pokrycia.md`) jest w większości jawnie oznaczony jako "zależny" od modułów
jeszcze niezbudowanych (M1 geostruktura bez treści źródłowej, model termiczny M6, baza
komponentów) — nie kolejne "gotowe do budowy" luki, tylko architektoniczna kolejność.

## Punkt 5 — kontynuacja Modułu 2 "Zapotrzebowanie", 4 pozostałe ekrany numerowane (19.09.2026)

Ekrany 3, 10, 14, 15 — ostatnie cztery pozostałe `todo` z sekwencji numerowanej Modułu 2
(poza modułem zbiorczym "Wampiry energetyczne", 24 funkcje, świadomie odłożony jako osobny,
duży krok — patrz niżej).

- **Ekran 3 (1.3/1.4/1.5) — Urządzenia zmienne + płyta indukcyjna + klasa energetyczna:**
  `lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/`. Mnożnik klasy energetycznej 1:1 ze
  źródła. **Nowy wariant wzorca "echo"**: domyślne moce urządzeń (pralka/zmywarka/lodówka/
  czajnik/mikrofalówka/laptop/TV/oświetlenie) reużyte z `baterie/napiecie-systemowe/
  constants.ts` (`KATALOG_ODBIORNIKOW`) zamiast wymyślać nowe liczby — ale świadomie TYLKO moc,
  nie czas pracy (tamten katalog koduje `czasPracyDomyslnyMin: 0` jako "ciągłe/bazowe", inny
  sens niż "ile dziś używasz tego urządzenia" — echo dosłowne dałoby zero energii, więc pole
  czasu zostaje puste, do ręcznego wpisania).
- **Ekran 10 (1.13) — Sprawność inwertera przy niskim obciążeniu:**
  `lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/`. Sprawność WPISYWANA
  ręcznie (źródło daje tylko dwa punkty narracyjne krzywej, nie pełny wzór interpolacji).
  **Znaleziona i udokumentowana niespójność przykładu źródła**: "sprawność 75% → +25% zużycia"
  jest matematycznie błędne (75% daje +33,3%, nie +25%; +25% odpowiada sprawności 80%) — wzór
  wdrożony poprawnie fizycznie, przykład źródła NIE wymuszony do zgodności.
- **Ekran 14 (1.26) — Architektura 1-fazowa/3-fazowa:**
  `lib/core/modules/zapotrzebowanie/architektura-fazowa/`. Liczy rozkład obciążenia i asymetrię
  % między fazami (przykład źródła L1=4200W/L2=L3=2000W → 52,4%, odtworzony dokładnie).
  **Świadomie bez automatycznego werdyktu ok/zabroniona** — źródło opisuje "znaczną asymetrię"
  🔴 jakościowo, bez liczbowego progu; wymyślenie progu (np. z branżowych norm PN-EN 50160/IEC
  dla niezrównoważenia napięcia) byłoby złamaniem dyscypliny "nie wymyślaj norm" — inny rodzaj
  wielkości (napięcie vs moc) i inny kontekst (jakość sieci vs projekt off-grid), nie
  bezpośrednio przenośne. Kalkulator pokazuje liczby, użytkownik ocenia sam.
- **Ekran 15 (1.27) — Kategorie specjalne:** `lib/core/modules/zapotrzebowanie/kategorie-specjalne/`.
  Przełącznik 3 kategorii (Warsztat/Gospodarstwo/Oświetlenie terenowe) + ręczna lista urządzeń.
  Źródło podaje TYLKO nazwy przykładowych urządzeń dla "Warsztat" (szlifierka/wiertarka/
  spawarka), zero liczb dla żadnej kategorii — świadomie bez "gotowego profilu" z domyślnymi
  mocami wspomnianego w opisie źródła (Sekcja A: "przełącznik kategorii z gotowym profilem"),
  bo wymyślenie mocy urządzeń warsztatowych/gospodarczych/terenowych złamałoby dyscyplinę
  "nie wymyślaj danych" — przyciski szybkiego dodania nazwy (bez mocy) to maksimum uczciwie
  możliwe z tego źródła.

`MIGRATED_MODULES`: 90→94 (wszystkie 4 nowe moduły od startu z `i18nKey`, zero `.message`).
22 nowe testy domenowe + nowy blok w `t.test.ts` (9 kluczy z parametrami). `pnpm typecheck`/
`lint`/`check:i18n-guard`/`test` (965/965)/`build` czyste. Zweryfikowane w przeglądarce
(Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU dla wszystkich 4 ekranów — treść
tłumaczona poprawnie (sprawdzone wprost porównaniem tekstu ostrzeżeń między językami, nie
tylko brakiem markera `⚠ [`), zero nowych błędów konsoli.

**Świadomie odłożone, nie przeoczenie:** moduł zbiorczy "Wampiry energetyczne" (1.24, 1.28–1.50,
24 dawne funkcje w jednym ekranie z podzakładkami: Katalog urządzeń/Pomiar/Symulacje-Raporty/
Rekomendacje sprzętowe/Automatyzacja, pełna treść w `Biblia_Offgrid_v2_0_Architektura_Modulowa.md`
linie 607-680+) — to osobny, znacznie większy krok niż pojedynczy ekran D, wymaga własnej sesji
projektowej (5 podzakładek, nie jeden prosty kalkulator). Zamyka punkt 5 z listy zaległości w
zakresie czterech numerowanych ekranów; moduł wampirów pozostaje `todo` w rejestrze, do
zaplanowania jako osobne zadanie.

## Punkt 8 — rollout `usePersistedDraft` na wszystkie pozostałe ekrany kalkulatorów (20.09.2026)

Ostatni z pięciu punktów z prośby "5,6,7,8,9 proszę zrób" wymagający kodu (punkt 6 — kafle
08–14 — czeka osobno na przegląd użytkownika w artefakcie, patrz sekcja niżej). Przed tym
zadaniem tylko `napiecie-systemowe` miało autosave (zgłoszenie użytkownika 15.09.2026,
przeładowanie karty w tle gubiło wpisane dane) — pozostałe 114 z 115 ekranów kalkulatorów
używało zwykłego `useState`, tracąc draft formularza przy każdym odświeżeniu.

**Wzorzec transformacji** (mechaniczny, bez zmiany logiki domenowej): każde pojedyncze
`useState` per pole skonsolidowane w jeden `type FormularzStan` + `const STAN_POCZATKOWY`,
podłączone pod `const [stan, setStan] = usePersistedDraft<FormularzStan>("<klucz-ekranu>",
STAN_POCZATKOWY)` (klucz = nazwa katalogu pod `app/kalkulatory/`). Generyczny helper `setPole`
+ per-pole `setX` zachowujące dokładnie tę samą nazwę i sygnaturę wywołania (wartość albo
funkcja aktualizująca) co oryginalny `useState` — dzięki temu JSX/`useMemo`/handlery w reszcie
pliku nie wymagały żadnej zmiany. Objęte wszystkie kształty stanu napotkane w repo: skalarne
stringi, boolean, unie typu `X | ""`, tablice `string[]` (checklisty), tablice obiektów z
dynamicznym dodawaniem/usuwaniem wierszy (`szyny-zbiorcze-miedzypakietowe`), liczby (`number`,
nie tylko `string` z inputów kontrolowanych ręcznie konwertowanych).

**Realizacja: dwuetapowa, po awarii pierwszego podejścia.** Pierwsze podejście — 8 równoległych
agentów w tle (batch po ~15 plików), każdy z identycznym, w pełni samodzielnym promptem
(dosłowny przykład transformacji `architektura-fazowa` przed/po + 10 reguł, w tym zakaz
`pnpm build`/`git commit` w agencie, i ostrzeżenie że równoległe batche mogą chwilowo psuć
globalny `pnpm typecheck`/`lint` innymi plikami). **Wszystkie 8 agentów padło na limit sesji
API (429, "session limit resets 11:10pm UTC")** w trakcie pracy, każdy zostawiając część swoich
plików nieprzekonwertowanych (75 z 114 zmienionych łącznie, resztę dokończono ręcznie w drugim
etapie następnego dnia, po resecie limitu). **Zweryfikowane przed kontynuacją**: `pnpm
typecheck`/`lint` czyste na 75 już zmienionych plikach — agenci nie zostawili żadnego pliku w
połowie edycji (błąd był czysto na poziomie orkiestracji/rate-limitu, nie na poziomie
poszczególnych edycji). Pozostałe 39 plików dokończone bezpośrednio (bez kolejnych subagentów,
żeby nie powtórzyć tego samego rate-limitu), tym samym wzorcem.

**Lekcja do zapamiętania**: równoległe uruchomienie 8 subagentów naraz (każdy robiący dziesiątki
wywołań API) może wyczerpać limit sesji konta szybciej niż praca sekwencyjna — dla dużych
mechanicznych rolloutów bezpieczniej dzielić na mniej równoległych batchy (2-4) albo pracować
sekwencyjnie/bezpośrednio, zwłaszcza gdy zadanie jest w pełni mechaniczne i nie wymaga
kreatywnej oceny per plik.

**Weryfikacja końcowa (wszystkie 115 kluczy `usePersistedDraft` — 114 nowych + istniejący
`napiecie-systemowe` — sprawdzone jako unikalne, brak kolizji):** `pnpm typecheck`/`lint`/`test`
(965/965)/`build` czyste. Playwright (świeży `pnpm build && pnpm start`, `next-server`
sprzątnięty przed i po) na próbce 5 ekranów o różnych kształtach stanu (proste pole liczbowe,
checkbox-lista, dynamiczna tablica z dodawaniem wierszy) — wpisana wartość przetrwała pełne
przeładowanie strony (`page.reload()`) we wszystkich 5 przypadkach, zero nowych błędów konsoli
(jedyny zaobserwowany błąd — nieudane wczytanie `@vercel/analytics/next` insights script —
pre-istniejący, niezwiązany z tą zmianą, wynika z braku dostępu do sieci Vercel w tym
środowisku sandboxowym, występuje na każdej stronie niezależnie od rollout'u).

## Punkt 6 — kafle 08–14, wdrożenie po akceptacji (20.09.2026)

Ostatni punkt z prośby "5,6,7,8,9 proszę zrób". Artefakt "Off-Grid Tile Set 08–14"
(https://claude.ai/artifact/BzWE2Tgz2amFhRxDCMSFQi) zaakceptowany przez właściciela projektu
("kafle możesz dodawać") bez uwag per-kafel — wdrożone 1:1 wizualnie, z nazwami klas/gradientów
zmienionymi z roboczych (`k8-`, `g-sky`) na konwencję repo (`ki-` prefiks dla keyframes,
`ki-<nazwa>-grad` dla gradientów, `tile-<nazwa>-symbol` dla id symboli — analogicznie do
kafli 01–07).

- **Nowe gradienty** (`components/kafle-ikony/definicje-symboli.tsx`): `ki-pcb-grad` (09),
  `ki-ai-grad` (10), `ki-settings-grad` (14). Kafle 08/11/12 reużywają istniejący `ki-sky-grad`,
  kafel 13 reużywa `ki-sky-grad-night` — bez duplikowania.
- **7 nowych `<symbol>`**: `tile-safety-symbol` (08), `tile-electronics-symbol` (09),
  `tile-ai-forecast-symbol` (10), `tile-battery-mount-symbol` (11), `tile-quick-calc-symbol` (12),
  `tile-live-symbol` (13), `tile-settings-symbol` (14).
- **Reużyte generyczne klasy animacji** (bez duplikowania CSS): `.signal`/`.packet` (09, 13),
  `.bar` (10), `.cell-level` (11), `.bolt` (12), `.star` (13) — dokładnie tak, jak artefakt
  deklarował w swoim opisie. **Świadoma korekta względem artefaktu**: kafel 12 w wersji roboczej
  miał na tym samym elemencie DWIE klasy (`k12-bolt bolt`) z dwiema różnymi, konkurującymi
  animacjami na `animation` (shorthand — nie sumują się, wygrywa tylko later-in-cascade) — to
  nadmiarowość/błąd artefaktu, nie zamierzony efekt. Naprawione przy porcie: zostawiona tylko
  istniejąca `.bolt` (ten sam puls opacity+scale, którego już używają kafle 02/03/04), usunięta
  nadmiarowa `k12-bolt-flash`.
- **Nowe klasy per-kafel** (`kafle-ikony.css`): `.alarm-ring`/`.alarm-bell`/`.alarm-check` (08),
  `.led-a/b/c` + `.esp-wave` (09), `.ai-node` + `.ai-node-main` (10), `.wrench-tighten` (11),
  `.tap-ripple` (12), `.live-dot` (13), `.gear-spin` + `.toggle-slide` (14).
- **`ikona.tsx`**: `SYMBOL_PO_ID_KAFLA` rozszerzone o 8–14 (wszystkie), `KafelIkonaSvg` dostał
  opcjonalny prop `size` (domyślnie 44, jak wcześniej) — żeby ta sama ikona dała się użyć w
  innym rozmiarze niż kafel gridu, gdyby zaszła taka potrzeba.

**Znalezisko przy weryfikacji, nie błąd — kafel 14 "Ustawienia" nie ma miejsca w gridzie.**
`lib/pulpit/registry.ts`'s `KAFLE` (tablica renderowana w gridzie pulpitu) ma tylko id 1–13;
`USTAWIENIA_KAFEL` (id 14) to osobna stała, renderowana wyłącznie jako mały link tekstowy w
nagłówku (`⚙️ Ustawienia`), razem z dwoma innymi skrótami (`📍 Lokalizacja i teren`,
`📡 Tryb Live`) — **wszystkie trzy konsekwentnie używają samego emoji**, nawet mimo że kafle 1
i 13 MAJĄ już zbudowane animowane ikony widoczne w głównym gridzie. Rozważona i odrzucona opcja:
podmienić tylko emoji "Ustawień" na animowane SVG w tym pasku — zepsułoby to spójność stylu
całego paska (3 linki, 3 różne traktowania). Zamiast tego: symbol/CSS dla kafla 14 zarejestrowane
i gotowe do użycia (tak jak 08–13), ale nieużyte na razie nigdzie w UI — czeka na naturalne
miejsce (np. gdyby `/ustawienia` dostało kiedyś nagłówek z ikoną modułu, tak jak inne strony
`/moduly/[id]`).

**Znalezisko przy weryfikacji, nie błąd — kafle 09 i 11 nie pokazują nowych ikon SVG w gridzie.**
`lib/pulpit/maskotki.ts` (`MASKOTKA_PO_ID_KAFLA`) ma zdjęcia maskotki "Bob" dla kafli 3/5/6/7/9/11
— w `app/page.tsx` maskotka ma pierwszeństwo przed animowanym SVG (ten sam priorytet już
dotyczył kafli 3/6/7, które MAJĄ zbudowane ikony od dawna, a mimo to pokazują maskotkę na
gridzie) — świadome, pre-istniejące zachowanie, nie regresja tej zmiany. Nowe ikony 09/11 są
poprawnie zarejestrowane i renderują się, gdyby maskotka kiedyś zniknęła z mapy.

**Weryfikacja**: `pnpm typecheck`/`lint`/`build` czyste. Playwright (świeży `pnpm build &&
pnpm start`, `next-server` sprzątnięty przed i po) na pulpicie głównym — 4 z 7 nowych `<use>`
potwierdzone bezpośrednio w gridzie (08/10/12/13; 09/11 przesłonięte maskotką, opisane wyżej;
14 nie ma slotu w gridzie), zrzut ekranu całej strony sprawdzony wizualnie — bez nakładających
się elementów, bez złamanych ikon. Zamyka punkt 6 i całą prośbę "5,6,7,8,9 proszę zrób".

## Migracja i18n na client-side bundled (offline-first, 17.4) — 20.09.2026

Znalezisko z pełnego audytu GOD BOOK Y.6/Y.9 (sesja równoległa, branch `claude/app-rules-r4guty`,
PR #129 — zablokowany na CI infrastrukturalnie, 0ms billable na obu jobach, nie treścią diffu):
obecny mechanizm i18n (cookie+middleware) łamie deklarowany offline-first tego projektu. Na
wyraźną prośbę właściciela: zrealizowane od razu w osobnym branchu/PR (`claude/i18n-offline-first`,
z `main`, nie z zablokowanego branchu audytu, żeby nie czekać na jego CI), częściami z
weryfikacją po każdej.

**Kontekst decyzji.** `docs/standards/17-i18n.md`, 17.4 (korekta 16.09.2026, źródło: właściciel
repo): mandat "cookie+server-side domyślnie dla każdego projektu z dostępnym serwerem" łamał 5.3
(offline-first jako wymóg) — wymagał renderu per-request na serwerze przy KAŻDYM twardym
przeładowaniu, sprzeczne z sensem istnienia projektu "off-grid". Poprawiona oś decyzyjna: nie
"czy projekt ma serwer", tylko "czy projekt ma twardy wymóg offline (5.3)" — **jawna deklaracja
tego projektu (ten wpis)**: inzynier-offgrid-pro ma twardy wymóg offline, kategoria "zero cookie,
zero zależności od serwera dla języka", nie "głównie online" (ta druga — zero-waste, nazwany
wyjątek, 17.4a).

**Odkrycie procesowe przy starcie tego kroku.** Branch `claude/i18n-offline-first` utworzony z
`main` nie miał jeszcze zsynchronizowanego `docs/standards/17-i18n.md` z korektą 17.4 — bo ta
korekta była dotąd wdrożona tylko w osobnym, wciąż nieukończonym PR #129 (audyt, zablokowany na
CI infrastrukturalnie — 0ms billable na obu jobach, nie treścią diffu). Zsynchronizowano 5 plików
NIETYKALNE (00-INDEKS, 05, 08, 17 + 15-wspolpraca-z-ai — źródło miało już nowszy commit niż
audyt, w tym nową 17.1a) przed implementacją kodu, żeby branch był samospójny z regułą, którą
implementuje — osobny commit, `git diff -rq` zero różnic ze źródłem po synchronizacji.

**Co zmieniono (kod):**
- `lib/i18n/storage.ts` (nowy) — `useSyncExternalStore` + `localStorage` (`offgrid.jezyk.v1`),
  ten sam wzorzec co `lib/theme/storage.ts`/`lib/wyglad/storage.ts`/`lib/pulpit/storage.ts`.
  Pierwsza wizyta: `navigator.languages` (nie `Accept-Language` — niewidoczny bez serwera).
- `app/layout.tsx` — usunięty `getServerLanguage()`/cookie; `<html lang>` statyczne na
  `DEFAULT_LANGUAGE`, korygowane blokującym skryptem pre-paint (`JEZYK_INIT_SCRIPT`, ten sam
  wzorzec co `WYGLAD_INIT_SCRIPT` dla motywu) — zero błysku ATRYBUTU.
- `middleware.ts` — usunięta cała logika `ustawJezykJesliBrak`/cookie (CSP nonce i bramka
  Supabase nietknięte).
- `components/jezyk-wybor.tsx` — zapis do `localStorage` przez `zapiszJezyk()`, bez
  `router.refresh()` (zmiana natychmiastowa, czysto kliencka — realna poprawa UX, nie tylko
  neutralna zamiana mechanizmu).
- `app/kalkulatory/prognozy/page.tsx` + nowy `components/zalozenia-lista.tsx` — jedyny Server
  Component renderujący tłumaczony tekst wprost (`getServerLanguage()`+`t()`) wydzielony do
  Client Component (`useTranslate()` wymaga kontekstu Reacta, nie ma już cookie do odczytania
  server-side). Jedyny taki przypadek w projekcie — reszta ekranów już renderowała tłumaczenia
  przez `useTranslate()` w Client Components.
- Usunięte jako martwy kod: `lib/i18n/server-language.ts`, `lib/i18n/client-language.ts`.

**🟡 Znana, jawnie ujawniona luka do domknięcia (14.4) — flash widocznej treści.** Sam atrybut
`lang` nie migocze (skrypt pre-paint, jak wyżej). Widoczna TREŚĆ UI (tłumaczenia w komponentach)
może się skorygować krótko po hydratacji przy twardym przeładowaniu, jeśli zapisany/wykryty język
różni się od `DEFAULT_LANGUAGE` (polski) renderowanego server-side — SSR fizycznie nie może znać
`localStorage`. `useSyncExternalStore` (`getServerSnapshot()`→`getSnapshot()`) minimalizuje okno
i **nie generuje ostrzeżeń hydration mismatch** (potwierdzone Playwrightem na scenariuszu
en-US/pl/ru) — ale nie eliminuje flashu treści całkowicie, tylko skraca go do czasu hydracji.
Pełne wyeliminowanie wymagałoby architektury CSS-multi-language-DOM (wszystkie języki naraz w
SSR HTML, przełączane atrybutem/CSS — dosłowne odczytanie 17.4: "skrypt wstawia poprawną treść
PRZED pierwszym malowaniem") — świadomie NIE wdrożone teraz: duży refaktor dotykający ~130
ekranów używających `t()`, poza zakresem tego kroku ("częściami, żeby nic nie namieszać"), czeka
na wyraźną decyzję właściciela, jeśli flash treści okaże się realnym problemem w praktyce (dziś:
tylko przy twardym przeładowaniu z językiem ≠ polski — mniejszość ruchu, biorąc pod uwagę że
polski jest bazowy i domyślny).

**Weryfikacja**: `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (965/965)/`build` czyste.
Playwright (świeży `pnpm dev`): świeże wejście bez zapisanej preferencji → fallback
`navigator.languages` (en, locale przeglądarki testowej — nie zawsze pl, zgodnie ze specyfikacją
17.4, nie błąd); przełączenie w Ustawieniach na Polski → natychmiastowa zmiana `<html lang>` +
zapis `localStorage`, bez przeładowania strony; twarde przeładowanie z zapisanym `ru` → `<html
lang="ru">` od razu (skrypt pre-paint, przed hydracją); ekran Prognozy (skonwertowany) renderuje
poprawnie. Zero nowych błędów konsoli w żadnym z 4 scenariuszy.

## Limit minut GitHub Actions wyczerpany + `paths-ignore` w CI — 20.09.2026

**Znalezisko.** PR #129 i #130 failowały na obu wymaganych checkach z komunikatem, który
początkowo wyglądał na błąd infrastrukturalny (0ms billable, brak logów, identyczna awaria na
dwóch niezależnych PR-ach). Rzeczywista przyczyna, potwierdzona przez właściciela repo ze
zrzutu ekranu GitHub Actions: adnotacja *"The job was not started because recent account
payments have failed or your spending limit needs to be increased"* — **darmowy limit 2000
minut Actions/miesiąc (GitHub Free, repo prywatne) został w całości wyczerpany** (2000/2000,
reset za 11 dni), nie awaria konta ani treść PR-ów. Potwierdzone przez `github.com/settings/
billing/summary`: $12.00 zużycia w 100% pokryte darmowym limitem — zero realnej płatności,
tylko blokada dalszego zużycia (budżety kontowe ustawione na $0 ze "Stop usage: Yes").

**Przyczyna zużycia.** Tempo tej sesji (dziesiątki pełnych przebiegów CI dziennie, każdy commit
= osobne uruchomienie 2 jobów) zjadło 2000 minut w ~19 dni. Zmierzone realnie na udanym
przebiegu (run #83, 20.09.2026): job `Lint, typecheck, test, build` = 3m33s → liczony jako
**4 minuty** (Actions zaokrągla w górę do pełnej minuty), job `Dependency vulnerability audit`
= 25s → liczony jako **1 minuta** (minimum, nawet za parę sekund pracy — sam narzut
checkout+setup-node+pnpm install to ~17 z tych 25s). Razem **5 minut/przebieg**, niezależnie
od tego, czy diff dotyczył kodu czy samej dokumentacji.

**Rozważone i odrzucone: scalenie dwóch jobów w jeden.** Oszczędziłoby tylko ~1 minutę/przebieg
(job audytu i tak jest liczony jako minimum 1 minuta, bez względu na scalenie) kosztem
zgaszenia celowego rozdzielenia sygnałów awarii z `docs/standards/11-ci-deployment.md` (11.2 +
11.5) — "żeby znana, nienaprawialna od razu podatność nie blokowała np. mergowania czystego
fixa lintera, i odwrotnie". Zysk nie uzasadniał utraty tej własności — **dwa joby zostają
rozdzielone**.

**Wdrożone: `paths-ignore` w `.github/workflows/ci.yml`** (osobny PR, branch
`claude/ci-paths-ignore`) — `docs/**`, `**/*.md`, `.claude/**` pomijają CI całkowicie zarówno
na `pull_request`, jak i na `push` do `main`. Ta sesja miała sporo commitów czysto
dokumentacyjnych (wpisy do `docs/memory.md`/`docs/wklad-do-standardu.md`, synchronizacje
`docs/standards/`) — PR #129 w całości był tego typu (5 plików, same `docs/`) i przy tym
filtrze w ogóle nie zużyłby minut. Zweryfikowano: `yaml.safe_load` parsuje plik bez błędów,
struktura `on:` dokładnie taka jak zamierzona (`paths-ignore` na obu triggerach). Zmiana w
samym `ci.yml` nie jest objęta wzorcami — commit do workflow zawsze uruchamia CI.

**Otwarte, poza zakresem tej sesji:** trwały sposób na uniknięcie ponownego wyczerpania limitu
(repo publiczne — nielimitowane minuty, kosztem widoczności kodu; GitHub Pro — +1000 minut/mies.
za $4, prawdopodobnie niewystarczające przy tym tempie pracy) — decyzja biznesowa właściciela,
nie techniczna, czeka na wybór. Do tego czasu: PR #129 i #130 czekają na reset limitu (11 dni od
20.09.2026) albo decyzję właściciela o jednej z płatnych/publicznych opcji.

## Aktualizacja ze standardu (20.09.2026, druga tego dnia) — 9.0a, 15.7a, doprecyzowanie 9.3

Na polecenie "Aktualizacja" (Y.6). `git fetch`+`git merge --ff-only` w lokalnym klonie
`new-app-standards`, `8793045..a2f1580` — bez odświeżenia klonu poprzedni odczyt raportowałby
fałszywie "brak nowości" (ta sama pułapka co 15.09/16.09). Znaleziono i wprowadzono:

- **`docs/standards/09-ai-w-produkcie.md`** — nowa 9.0a (rejestr narzędzi AI jako architektoniczny
  domyślny od Etapu 1) + doprecyzowanie 9.3 (most JSON Schema, kolejność "opis na końcu").
- **`docs/standards/15-wspolpraca-z-ai.md`** — nowa 15.7a (nie zgaduj API biblioteki zewnętrznej,
  zweryfikuj `node_modules`).
- **`docs/standards/00-INDEKS.md`** — opisy rozdz. 9 i 15 zaktualizowane pod nową treść.

Wszystkie trzy pliki skopiowane **pełnym nadpisaniem** ze źródła (NIETYKALNE — `cp`, nie ręczny
merge), zweryfikowane `diff -q` = identyczne po skopiowaniu. Zero zmian w kodzie tego projektu
wymaganych — obie nowe reguły (9.0a, 15.7a) **pochodzą z tego samego projektu** (zgłoszone do
`docs/wklad-do-standardu.md` chwilę wcześniej tego samego dnia) — projekt już dziś robi dokładnie
to, co nowa reguła nakazuje, nie ma tu żadnej luki do domknięcia.

**Dodatkowo: korekta bookkeepingu `docs/wklad-do-standardu.md`.** Przy okazji tego sync-u sprawdzono
programistycznie (grep po `inzynier-offgrid-pro` w całym świeżo zsynchronizowanym `docs/standards/`),
które z dotychczasowych wpisów `Status: 🔎 nowe` są w rzeczywistości już od dawna skonsolidowane, a
status po prostu nigdy nie został zaktualizowany. Znaleziono i poprawiono **9 stale statusów**
(wpisy o: kontrakcie AI z 14.09, rozdziale logowania z 14.09, wielojęzyczności z 14.09, błędzie CSP
hash/nonce z 16.09 — **w tym przy okazji potwierdzone, że `middleware.ts` tego projektu też ma już
naprawę nonce-per-request**, nie tylko standard — audyt szablonu D vs C z 20.09, wzorca
nieretroaktywnego z 20.09, limitu subagentów z 20.09, oraz dwóch własnych wpisów z tego samego dnia
o AI). Dwa wpisy z 06.09 (procedura materiałów źródłowych, biblioteka norm) pozostają `🔎 nowe` —
sprawdzone, faktycznie jeszcze nieskonsolidowane. Ta sama lekcja co przy `docs/rejestr-pokrycia.md`
tego samego dnia: **nie ufaj metryczce/statusowi zapisanemu wcześniej — sprawdź programistycznie
względem aktualnego źródła**, zwłaszcza gdy okazja (tu: świeży `cp` ze źródła) pozwala to zrobić
tanio, przy okazji innego zadania.

## Doprecyzowanie zasady: konsolidacja do new-app-standards nigdy z tej sesji (20.09.2026, trzecia dziś)

Właściciel repo poprosił o dokończenie dwóch ostatnich otwartych zgłoszeń (materiały źródłowe,
biblioteka norm) — jednoznacznie odpowiedział, gdy zapytany o zakres: **"Ty nic nie robisz w cudzych
repo, działasz tylko w swoim... Ty nic nie robisz, robi to repo new app standards."** Potwierdza to
wprost zasadę z korekty 16.09.2026 (PR #9) — dostęp do `new-app-standards` w tej sesji (do
`git fetch`/odczytu przy "Aktualizacja") nie jest i nigdy nie będzie upoważnieniem do pisania tam,
niezależnie jak wyraźna wydaje się prośba w danym momencie. Jedyny kanał stąd: ten plik.

Zakres wykonany w granicach własnego repo: sprawdzono oba pliki propozycji
(`docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`,
`biblioteka-norm-zrodlowych.md`) — pierwszy już w pełni gotowy, bez zmian. Drugi miał jedną
sam-u-siebie-flagowaną niedoskonałość (dwa oryginały PDF norm 5-52/5-54 poza swoim folderem
`norma-*/`) — naprawione lokalnie: `git mv` obu plików do właściwych podfolderów, zaktualizowane
wszystkie odwołania w ~20 plikach `.md` (`docs/zrodla/norma-PN-HD-60364-5-52/*`, `.../5-54/00-INDEKS.md`,
`docs/zrodla/README.md`), manifest w propozycji zaktualizowany, żeby nie cytować już nieaktualnego
dryfu. Oba pliki propozycji są teraz w pełni gotowe do podjęcia — nic więcej do zrobienia w tym repo,
czekają wyłącznie na sesję nad `new-app-standards`.

## Moduł 5 (Okablowanie) domknięty — 29/29, ostatnie 6 ekranów (20.09.2026)

Na wyraźne polecenie ("Ruszajmy") po ustaleniu z właścicielem repo priorytetu (Moduł 1 pominięty na
razie — wymaga infrastruktury mapowej/GPS, osobna decyzja architektoniczna, patrz niżej; Moduł 5
zrobiony w całości). Zbudowano Ekrany 5, 8, 9, 13, 18, 21 — dokładnie w ustalonej kolejności
(kalkulator → i18n → opis narzędzia AI, w jednej sesji per ekran, patrz decyzja z tej samej rozmowy
o 9.0a).

**Decyzje warte zapamiętania:**

- **Ekran 5 (Złącza MC4):** bez bazy komponentów (§15.2 jeszcze nie istnieje) porównanie producentów
  po nazwie z listy zamkniętej (`PoleSelect`, `PRODUCENCI_MC4`), nie po numerze katalogowym — jawnie
  udokumentowane ograniczenie.
- **Ekran 8 (Przepust powietrza):** źródło daje tylko dwa punkty odniesienia (szczelina <5cm→~70°C,
  ≥15cm→bezpieczna) bez ciągłej zależności dla zakresu pośredniego — **świadomie NIE
  interpolowane** (nie wymyślamy zależności, której źródło nie podaje), zakres 5–15cm oznaczony jako
  "brak danych", osobny poziom `warning` (nie `critical`, nie `info`).
- **Ekran 9 (Projekt uziemienia), bezpieczeństwo-krytyczny:** źródło opisuje silnik słownie
  ("dobiera liczbę/rozstaw prętów"), bez samego wzoru — użyto **wzoru Dwighta** dla pojedynczego
  pręta pionowego (standardowy wzór inżynierski, IEEE Std 142 "Green Book", nie norma domenowa
  wymagająca zakupu — ten sam status co Magnus-Tetens czy deklinacja Coopera 1969 gdzie indziej w
  projekcie). **Podwójna weryfikacja przed implementacją** (03.4): policzone niezależnie w Pythonie
  dla przykładu źródła (ρ=100Ω·m glina, pręt 3m×16mm) — R pojedynczego pręta ≈29,82Ω, 3 pręty
  (uproszczone łączenie równoległe 1/n) ≈9,94Ω, zgodne z przykładem źródła "3 pręty → <10Ω" z
  dokładnością <1%. Uproszczenie (brak korekty na wzajemne oddziaływanie prętów) jawnie oznaczone w
  `assumptions`, z rekomendacją realnego pomiaru po instalacji. Materiał pręta (korozja galwaniczna)
  świadomie NIE duplikowany — cross-ref do Ekranu 4 (Łączenie Cu-Al).
- **Ekran 13 (Selektywność zabezpieczeń) i Ekran 21 (Normy i certyfikaty) — świadomie zbudowane
  jako Wzorzec C/informacyjny, nie D/kalkulator.** Ten sam wzorzec decyzyjny co M6/Ekrany 5.46 i
  5.31 (już skonsolidowany do standardu jako doprecyzowanie 8.2, 20.09.2026): źródło opisuje
  koncepcję, ale nie daje wzoru (Ekran 13 — krzywe czasowo-prądowe konkretnych zabezpieczeń, wymaga
  bazy komponentów) ani zamkniętej listy norm (Ekran 21 — źródło samo mówi "IEC 61730, 62109, 62619
  **itd.**", lista jawnie otwarta). Zamiast budować kalkulator udający precyzję, której źródło nie
  daje — Ekran 13 to przewodnik, Ekran 21 to checklist tylko trzech norm nazwanych wprost + jeden
  zbiorczy wpis dla reszty, bez dopisywania własnych numerów norm dla złączy/kabli/SPD (byłoby to
  zgadywanie).
- **Rejestr narzędzi AI (`lib/ai/pytaj-asystenta.ts`, `NARZEDZIA`) rozszerzony z 1 do 6 narzędzi** —
  wszystkie 5 nowych zbudowane od razu z opisem (9.0a), Ekran 13 pominięty (brak kalkulatora, nic do
  opisania jako narzędzie AI).
- **`scripts/check-i18n-guard.mjs` (`MIGRATED_MODULES`) rozszerzony o 5 nowych modułów** (bez
  Ekranu 13/selektywności — pure content, brak i18nKey/Warning do pilnowania).

**Weryfikacja:** `pnpm typecheck`/`lint`/`test` (991 testów, w tym 26 nowych)/`build` — wszystkie
czyste. Dodatkowo `pnpm dev` + `curl` na wszystkich 6 nowych tras (HTTP 200, treść realna w HTML,
zero błędów w logu serwera) — "kompiluje się" ≠ "działa" (10-testy.md), nie tylko typecheck.

**Poza zakresem tej sesji, świadomie:** Moduł 1 (Ekrany 2-4, Skaner działki/Zacienienie/Bryła
budynku) — wymaga realnej infrastruktury mapowej (biblioteka mapowa, GPS, model 3D terenu, algorytm
zacienienia godzina-po-godzinie), nie rozszerzenia istniejącego wzorca kalkulatora. Właściciel repo
zdecydował pominąć na razie, zamiast budować uproszczoną wersję bez mapy — czeka na osobną decyzję
architektoniczną (jaka biblioteka mapowa/GPS), nie na kolejne "Ruszajmy" tej samej formy.

## Asystent AI: scentralizowane okno zamiast integracji per-ekran (20.09.2026)

**Decyzja (potwierdzona przez właściciela repo):** `<AsystentAi />` przeniesiony z osadzenia
inline tylko na `/kalkulatory/pomocnicze` do jednego, globalnego montowania w `app/layout.tsx` —
pływający panel (przycisk "AI" fixed bottom-right, otwiera kartę nad przyciskiem), dostępny na
każdym ekranie aplikacji.

**Uzasadnienie (9.9 "czat swobodny" vs "asystent inline"):** rejestr narzędzi
(`NARZEDZIA` w `lib/ai/pytaj-asystenta.ts`) rośnie z każdym nowym kalkulatorem (obecnie 6) bez
dotykania UI żadnego ekranu — dodanie AI do kolejnego kalkulatora to tylko nowy plik `*-tool.ts` +
wpis w rejestrze, nie zmiana w 116+ plikach `page.tsx`. Integracja per-ekran wymagałaby N kopii tej
samej logiki UI i sztucznie zamykałaby pytania w silosie jednego kalkulatora, mimo że pytania
inżynierskie realnie mieszają moduły (np. przekrój kabla + uziom w jednej rozmowie).

**Implementacja:** komponent (`components/asystent-ai.tsx`) przepisany z sekcji inline na widget
`fixed bottom-4 right-4 z-50` z toggle otwarty/zamknięty (`useState`), ta sama logika
`isAiAvailable()`/`pytajAsystenta()` co wcześniej (bez zmian w `lib/ai/`), wciąż renderuje `null`
w milczeniu, gdy AI nieskonfigurowane (9.0). Import/użycie usunięte z
`app/kalkulatory/pomocnicze/page.tsx`, dodane do `app/layout.tsx` wewnątrz `LanguageProvider`.

**Weryfikacja:** `pnpm typecheck`/`lint`/`test` (991/991)/`build` — czyste. Wizualnie: `next start`
z tymczasowym (nierealnym) `ANTHROPIC_API_KEY` tylko na czas testu + Playwright — przycisk widoczny
i otwiera panel zarówno na `/` (pulpit) jak i na zupełnie niepowiązanym ekranie
(`/kalkulatory/przepust-powietrza`), potwierdzając globalność. Serwer testowy zatrzymany po
weryfikacji, brak realnego klucza API w repo/env.

**Znany dług, nie tej sesji:** treść komponentu (`"Zapytaj asystenta"`, etykiety, komunikaty) wciąż
hardkodowana po polsku, bez kluczy i18n — istniało tak już przed tą zmianą (nie nowy dług, tylko
przeniesiony). Do ujęcia przy rollout'cie i18n na komponenty wspólne, nie kalkulatory.

## Anulowany job CI przy PR #132 (20.09.2026) — zbadane, przyczyna NIE jest limitem minut

**Pierwotna, błędna diagnoza (skorygowana tego samego dnia):** job CI „Lint, typecheck, test,
build" na PR #132 został anulowany w połowie `pnpm test` (lint/typecheck/i18n-guard przeszły
wcześniej). Właściciel repo pokazał zrzut GitHub Settings → Billing → Usage z paskiem „Actions
minutes: 2000/2000 used" i wywnioskowałem stąd, że to wyczerpanie darmowego limitu blokuje CI.
**To wnioskowanie było błędne** — nie zweryfikowałem wprost, zanim zapisałem to jako fakt w tym
pliku (naruszenie własnej zasady "nie przedstawiaj hipotez jako faktów"; poprawka poniżej, ślad
oryginalnego wpisu zachowany zgodnie z 15-wspolpraca-z-ai.md, nie ciche nadpisanie).

**Ustalone przez API (nie z pamięci):** `inzynier-offgrid-pro` to **repo publiczne**
(`GET /repos/.../` → `"private": false, "visibility": "public"`, zweryfikowane bezpośrednio przez
`curl` do GitHub API). GitHub Actions na standardowych hostowanych runnerach (`ubuntu-latest` —
dokładnie to, czego używa `ci.yml`) jest dla repo publicznych **darmowe i nielimitowane** —
limit 2000 min/miesiąc dotyczy wyłącznie repo prywatnych na koncie (stąd zużycie widoczne na
koncie: prawdopodobnie inne repo właściciela, np. `zero-waste`, są prywatne i to one konsumują
limit — `inzynier-offgrid-pro` nie powinno być tym ograniczone).

**Wniosek operacyjny:** CI dla tego repo NIE jest ograniczane limitem minut — nie ma powodu
zakładać z góry, że kolejne joby będą się urywać z tego powodu. Rzeczywista przyczyna anulowania
w PR #132 pozostaje niewyjaśniona (prawdopodobnie pojedynczy, nieskorelowany glitch
infrastruktury GitHuba — runner reclaimed/lost) — jeśli powtórzy się w kolejnych PR-ach, badać
od nowa, nie zakładać automatycznie tej samej (błędnej) przyczyny.

## Synchronizacja ze standardem przed sesją "3 i 5" (20.09.2026)

[20.09.2026] Właściciel projektu: "Dawaj 3 i 5 ogarniemy. Tylko zrób przed tym aktualizacje" —
wykonana pełna synchronizacja Y.6/Y.9 z `new-app-standards` przed startem (PR #134, zmergowany
jako `1ee624f`): GOD BOOK zaktualizowany do v2.20 (pełne nadpisanie NIETYKALNE), `docs/wklad-do-standardu.md`
skrócony z 1102→572 linii (12 zamkniętych wpisów przeniesionych do nowego `docs/wklad-do-standardu-archiwum.md`,
zgodnie z nową zasadą Y.8 — nie było jej wcześniej w tym pliku, dopisana tu jako decyzja
architektoniczna: wpisy w `wklad-do-standardu.md` ze statusem `✅ skonsolidowane`/`✅ przekazane`
bez otwartego follow-upu przenosimy do archiwum z pointerem w pliku żywym, żeby plik roboczy nie
rósł bez ograniczeń). 4 wpisy zostały otwarte (procedura materiałów źródłowych, biblioteka norm,
wielojęzyczność C6, CI referencyjny/i18n-guard). Zero blokerów dla pracy nad Modułem 4/Baterie
ani modułem Wampirów energetycznych.

**Pułapka napotkana przy mergu PR #134:** "405 Pull Request has merge conflicts" mimo identycznej
treści — przyczyna: gałąź zawierała stare, presquash commity już zmergowane do `main` w PR #133.
Naprawione przez `git merge origin/main` + `git checkout --ours` na jedynym realnym konflikcie
(`docs/wklad-do-standardu.md`, HEAD był nadzbiorem treści origin/main). Wzorzec do zapamiętania:
jeśli PR raportuje konflikt mimo braku merytorycznej rozbieżności, sprawdzić `git diff <stary-sha>:<plik> origin/main:<plik>` pod kątem identyczności treści przed ręcznym rozwiązywaniem.

## Ekran 3, Moduł 4 — Symulacja czasu ładowania/rozładowania (20.09.2026)

[20.09.2026] ✅ DODANO — pierwszy z 4 ekranów zleconych w ramach "Item 3" (dawne 3.3, 3.35, 3.36,
3.37). `lib/core/modules/baterie/symulacja-ladowania-rozladowania/` + UI
`app/kalkulatory/symulacja-ladowania-rozladowania/page.tsx`, 7 testów, zarejestrowany w
`lib/pulpit/registry.ts` (Moduł 4) i `docs/rejestr-pokrycia.md`.

**Decyzja projektowa (jawna, nie zmyślona dana):** źródło (`docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md`,
Ekran 3) opisuje tylko narrację ("system liczy, o której godzinie bateria osiągnie 100% i kiedy
zacznie się rozładowywać w nocy"), bez jawnego wzoru ani przykładu liczbowego do odtworzenia.
Wzór (bilans energii: moc × czas = energia, osobno dla fazy ładowania i rozładowania) wyprowadzony
wprost z tej narracji i fizyki, udokumentowany w komentarzu `calculator.ts` jako decyzja projektowa
— odróżnione od zakazu zmyślania norm/współczynników bezpieczeństwa (ten zakaz dotyczy danych, nie
kształtu wzoru wynikającego z podstawowej fizyki bilansu energii, gdy źródło nie podaje własnego).
Moc ładowania/rozładowania i długość dnia to na razie ręczne pola z `hint` o docelowym auto-fill
z Modułu 3 (produkcja PV) i Modułu 1 (wschód/zachód słońca) — te moduły jeszcze nie istnieją,
zgodnie z ustalonym wzorcem obsługi zależności międzymodułowych (patrz Ekran 1 dobor-pojemnosci).

Weryfikacja: `pnpm test` (998/998), `pnpm typecheck`, `pnpm lint` (0 błędów, 2 przedistniejące
warningi img niezwiązane), `pnpm check:i18n-guard`, `pnpm build` — wszystko czyste.

## Ekrany 31/32/33, Moduł 4 — dopełnienie "Item 3" (20.09.2026)

[20.09.2026] ✅ DODANO — pozostałe 3 z 4 ekranów zleconych "Item 3" (Ekran 3 zrobiony i
zmergowany wcześniej, patrz wpis wyżej).

**Ekran 31 "Napięcie odcięcia vs żywotność" (dawne 3.35):** `lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/`,
UI `app/kalkulatory/napiecie-odciecia-a-zywotnosc/page.tsx`, 8 testów. Model: interpolacja
liniowa między dwoma punktami danych podanymi wprost w źródle (42,0V/16S→100% DoD→2000 cykli;
44,0V/16S→80% DoD→5000 cykli), zgeneralizowana na napięcie per ogniwo, żeby działać dla
dowolnej liczby ogniw szeregowo (nie tylko 16S/48V). Poza zakresem kalibracji (2,625–2,750V/
ogniwo) — ostrzeżenie ekstrapolacji (`EKSTRAPOLACJA-POZA-KALIBRACJA`), nie błąd — model tylko
traci pewność, napięcie odcięcia poza tym zakresem jest fizycznie możliwe.

**Ekran 32 "Hierarchia ładowania (PV > Agregat > Sieć)" (dawne 3.36):** `lib/core/modules/baterie/hierarchia-ladowania/`,
UI `app/kalkulatory/hierarchia-ladowania/page.tsx`, 9 testów. Źródło opisuje logikę jako
dyskretne drzewo decyzyjne (Sekcja B), nie wzór liczbowy — zaimplementowane 1:1 jako klasyfikator
priorytetów, bez wymuszania sztucznego wzoru matematycznego (ten sam pryncyp co macierz
load-shedding, Ekran 12 Modułu 2). **Sprawdzone grep-em: w całym projekcie nie istnieje jedna
kanoniczna wartość "SoC krytyczny"** — pole `socProguKrytycznegoPct` jest więc czysto ręczne,
bez ukrytego domyślnego wypełnienia (8.6). Rozróżnione dwa stany "BRAK aktywnego źródła":
benigne (SoC w normie, po prostu nikt teraz nie ładuje) vs realnie krytyczne (SoC pod progiem,
zero opcji ładowania) — tylko drugie generuje ostrzeżenie (`OCZEKIWANIE-NA-SLONCE` gdy system
świadomie czeka na prognozę słońca, jak w przykładzie źródła Sekcji C; `BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA`
level `critical` gdy naprawdę nie ma wyjścia).

**Ekran 33 "Symulacja miesiąca zachmurzenia (No-Sun Scenario)" (dawne 3.37):** `lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/`,
UI `app/kalkulatory/symulacja-miesiaca-zachmurzenia/page.tsx`, 7 testów. Wzór (bilans energii
dzień po dniu, z wyliczeniem dnia i godziny blackoutu przy założeniu stałej średniej mocy
deficytu w ciągu doby — ten sam wzorzec uproszczenia co Ekran 3) wyprowadzony z narracji źródła,
udokumentowany jako decyzja projektowa. `liczbaDniScenariusza=10` to jedyna wartość domyślna
jawnie podana w źródle (Sekcja A) — zachowana jako sugerowana. `poziomZachmurzeniaPct` NIE ma
jednej kanonicznej wartości (źródło podaje tylko zakres 5-10%) — pole ręczne bez defaultu, z
podpowiedzią o sugerowanym zakresie (8.6).

Wszystkie 3 ekrany zarejestrowane w `lib/pulpit/registry.ts` (Moduł 4) i `docs/rejestr-pokrycia.md`.
Weryfikacja łączna: `pnpm test` (1022/1022), `pnpm typecheck`, `pnpm lint` (0 błędów, tylko 2
przedistniejące warningi img niezwiązane), `pnpm check:i18n-guard`, `pnpm build` — wszystko
czyste. **Item 3 (Moduł 4, 4 ekrany) w całości zamknięty.** Item 5 (moduł "Wampiry energetyczne",
24 dawne funkcje) czeka jako następny — celowo nierozpoczęty w tym samym przejściu, wymaga
własnego skanu zakresu przed implementacją.

## Zamknięcie Item 3 (PR #135) + skan zakresu przed Item 5 "Wampiry energetyczne" (20.09.2026)

**Weryfikacja przed mergem (na wyraźne pytanie właściciela projektu):** żadny z dwóch commitów
Item 3 (`5ccff3e` Ekran 3, `aae3715` Ekrany 31/32/33) nie dotykał `docs/wklad-do-standardu.md` —
`git show <sha> --stat -- docs/wklad-do-standardu.md` puste dla obu. `main` był 2 commity za
branchem (`origin/main` na `1ee624f`, standard-sync PR #134) — utworzono i zmergowano PR #135.

**Skan zakresu/architektury dla Item 5, wykonany PRZED jakimkolwiek kodem (na wyraźną prośbę
"zanim zaczniemy 5 moduł"):**
- Treść źródłowa: `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`, linie 607–1167
  (24 funkcje 2.24.1–2.24.24, dawne 1.24 + 1.28–1.50), pełna, kompletna narracyjnie (Skąd/Gdzie/
  Jak/Efekt/Migawka/Powiązania dla każdej). Deklarowany podział na 5 podzakładek (linia 609):
  Katalog urządzeń, Pomiar, Symulacje/Raporty, Rekomendacje sprzętowe, Automatyzacja — **bez**
  jawnego mapowania która funkcja do której podzakładki (do zaprojektowania, nie do wymyślenia
  danych — to decyzja organizacyjna UI, nie inżynierska).
- `Zasady_UX_Doradca_v2_1.md` (§20, linie 644-681): moduł wampirów liczony jako **1 już scalony
  ekran** w wyniku Modułu 2 (18 ekranów łącznie z indywidualnymi) — nie rozbija dalej na
  osobne wzorce A-H, potwierdza podejście "jeden moduł zbiorczy z podzakładkami", nie 24 ekrany.
- **Zerowe pokrycie w kodzie** — `grep -rli "standby\|wampir" lib/core/modules/` → brak wyników.
  Żaden istniejący ekran (w tym `pobor-wlasny-falownika` 1.12, `dni-autonomii` 1.9, `load-shedding`
  1.20 — wszystkie wymienione w "Powiązania" źródła jako cross-referencje) nie duplikuje logiki
  standby/wampirów — to relacje "zasila"/"odwołuje się do", nie pokrycie. Brak ryzyka duplikacji.
- **Korekta notatki w `docs/rejestr-pokrycia.md`** (wiersz "Wampiry energetyczne"): poprzednia
  wersja mówiła "treść w Biblii poza tym repo" — nieaktualne, treść JEST w tym repo (patrz wyżej).
  Dryf notatki bez świadomej decyzji (nie konflikt merytoryczny) — poprawione wprost, zgodnie z
  wyjątkiem Części Y.2 GOD BOOK.
- **Cross-referencje do modułów jeszcze niezbudowanych** (informacyjnie, nie blokujące): wiele
  funkcji odwołuje się do Modułu 7 (stress-test, w większości `todo`), Modułu 8 (bezpieczeństwo,
  częściowo zbudowany), Modułu 3 (`3.1`, zbudowany jako reprezentant wzorca). Zgodnie z ustalonym
  wzorcem (Ekrany 31-33 Modułu 4) — pola takich zależności zostają polami ręcznego wpisu, nie
  blokują implementacji.
- **Wniosek:** moduł gotowy do zaprojektowania i implementacji jako osobna sesja projektowa —
  brak blokerów danych/norm (to głównie katalogi urządzeń z zakresami W podanymi w źródle, nie
  jedną kanoniczną wartością — wzorzec identyczny do już zbudowanych katalogów, np.
  `systemy-podtrzymania-zycia`), brak ryzyka duplikacji z istniejącym kodem.

## Zamknięcie Item 5 — moduł zbiorczy "Wampiry energetyczne" (20.09.2026)

Zbudowany w całości w jednej sesji (decyzja właściciela projektu: "Całość w jednej sesji", po
skanie zakresu udokumentowanym wyżej). 24 dawne funkcje (1.24, 1.28–1.50) scalone w **5 realnych
kalkulatorów** `lib/core/modules/zapotrzebowanie/wampiry-energetyczne/`, po jednym na podzakładkę
zadeklarowaną w źródle — nie 24 osobne ekrany, zgodnie z ustaloną praktyką konsolidacji
duplikatów (patrz Ekran 32 "Hierarchia ładowania" i Ekrany 31-33 Modułu 4):

- **`katalog-urzadzen`** (1.24 suma + katalog 1.29/1.41/1.48): 7 urządzeń standby, moc domyślna =
  środek zakresu źródła (dopowiedziany, udokumentowany jako nieliteralny), edytowalna. Wzór
  `E_doba/E_rok` zweryfikowany dokładnie (45W→1,08 kWh/dobę→394 kWh/rok, przykład 1.24).
- **`pomiar-mocy-jalowej`** (1.30+1.38): ręczna lista pomiarów, bez domyślnych mocy (z definicji
  specyficzne dla sprzętu użytkownika). Ten sam wzór — echo `GODZIN_W_DOBIE`/`DNI_W_ROKU` z
  `katalog-urzadzen/constants.ts`, nie duplikat stałych. Zweryfikowany: 8W→70 kWh/rok (1.38).
- **`symulacje-i-raporty`** (rdzeń modułu): trzy niezależne funkcje — autonomia baterii przy
  standby (1.28+1.31+1.42, zweryfikowana 45W→26h/15W→78h), roczny koszt standby (1.43,
  zweryfikowana 50W→438 kWh/rok/15% udziału przy 2920 kWh), wpływ eliminacji standby na dobór
  pojemności (1.45 — **świadomie NIE odtwarza** własnego przykładu liczbowego źródła, bo źródło
  pomija napięcie/dni autonomii/sprawność/DoD potrzebne do przeliczenia na Ah; echo formuły
  `obliczPojemnoscUzytecznaKwh` z `baterie/dobor-pojemnosci`, zwraca kWh zamiast Ah dla spójności
  jednostek). Cena energii i koszt sprzętu **zawsze wpisywane ręcznie, zero wartości domyślnych**
  — źródło daje je tylko jako ilustrację przykładu, nie normę cenową.
- **`rekomendacje-sprzetowe`** (1.32+1.39+1.44 porównanie metod, 1.33+1.46 dobór per kategoria):
  okres zwrotu kosztu zweryfikowany dokładnie (40zł/120zł→4 mies., 150zł/200zł→9 mies., 1.39).
  Drzewo decyzyjne 1.33 (ten sam wzorzec co Ekran 32 M4) ma **własny zestaw etykiet metod**,
  tylko częściowo pokrywający się z 4 metodami porównywanymi w 1.44 ("gniazdo z timerem" i
  "obwód w rozdzielni ze stycznikiem" to inne kategorie) — **błąd złapany i naprawiony przed
  testami**: pierwsza wersja błędnie zmapowała "ładowarki" na "gniazdo Wi-Fi" (kopiując 4 metody
  1.44) i dodała niewspieraną przez źródło warunkowość dla routera; poprawione na osobny typ
  `EtykietaRekomendacji`, klasyfikator 1:1 ze źródłem (ładowarki→gniazdo z timerem, router→
  gniazdo Wi-Fi bezwarunkowo).
- **`automatyzacja`** (1.34+1.40+1.48-scenariusze): jeden generyczny silnik "standby referencyjny
  vs standby w scenariuszu" zamiast 4 kopii tego samego liczenia dla różnych nazw scenariuszy
  (nocny tryb/nieobecność/praca z domu/weekend/urlop). Zweryfikowany: 45W→15W→0,72 kWh/dobę
  (1.34). 1.47 (redukcja poboru falownika nocą) to czyste echo/link do już istniejącego ekranu
  `pobor-wlasny-falownika` — bez własnej logiki. 1.35+1.36+1.49 (detekcja always-on, integracja
  smart-plug API, harmonogram wg obecności) to treść informacyjna w UI, bez kalkulatora — wymagają
  realnej integracji sprzętowej, poza zakresem offline-first. 1.50 (audyt zbiorczy) to widok
  podsumowujący nad wynikami innych podzakładek, bez własnej logiki.

**Odrzucone podczas projektowania (dyscyplina "nie wymyślaj progu"):** draft funkcji
`drenazSzybki(godziny)` w `symulacje-i-raporty/warnings.ts` z niejawnym progiem "szybkiego
rozładowania" — usunięty przed użyciem, źródło nie podaje żadnej liczby granicznej.

**UI:** `app/kalkulatory/wampiry-energetyczne/page.tsx` — 5 podzakładek jako `PoleSelect` +
renderowanie warunkowe (ten sam wzorzec co `kategorie-specjalne`, w kodzie nie istnieje
komponent Tabs), jeden `usePersistedDraft` na cały ekran (nie 5 osobnych kluczy) z jedną
zagnieżdżoną strukturą stanu — suma standby wyliczona w Katalogu+Pomiarze dostępna do wpisania
jednym kliknięciem ("Wpisz sumę…") w polach Symulacji i Automatyzacji, bez ręcznego przepisywania.
Komponenty podzakładek w `_components/` (Next.js private folder, bez nowych route'ów).

**i18n:** wszystkie 15 nowych kodów `WAMPIR-*` (błędy walidacji + 2 założenia/info) dodane
identycznie do `lib/i18n/dictionary-{pl,en,ru}.ts` — moduł od razu zmigrowany (17.9), zero
gotowego tekstu PL w `Warning.message`.

**Weryfikacja:** 38 nowych testów (5 plików) + pełny `pnpm test` (1060/1060), `pnpm typecheck`,
`pnpm lint` (0 nowych błędów/ostrzeżeń), `pnpm check:i18n-guard`, `pnpm build` — wszystko czyste.
Ręczny smoke test Playwright (kliknięcie checkboxów katalogu, przełączanie 5 podzakładek,
weryfikacja klasyfikatora rekomendacji) — bez błędów konsoli poza nieistotnym 404 Vercel Insights
(brak w środowisku lokalnym, niezwiązane z tym modułem). Rejestracja: `lib/pulpit/registry.ts`
(Moduł 2, na końcu listy ekranów) + `docs/rejestr-pokrycia.md` wiersz 18 (Moduł 2) → **done**.

## D21 — cykl Y.6 obniżony lokalnie do ≤12h (23.09.2026)

Na wyraźne polecenie właściciela projektu: `CLAUDE.md` (sekcja "Zanim zaczniesz", punkt 4) zmieniony
z "sprawdzaj `AKTUALIZACJE.md` co ≤3 godziny" na "co ≤12 godzin". Pełny zapis decyzji:
`rejestr-decyzji.md` D21. **Kluczowe rozróżnienie, żeby nie pomylić z aktualizacją Y.6 vs. lokalną
decyzją:** to NIE jest zmiana samego standardu GOD BOOK Y.6 (wciąż ≤3h dla całej rodziny projektów) —
`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md` i `PROMPT_STARTOWY.md` (NIETYKALNE,
mirror `new-app-standards`) celowo NIE zostały zmienione i nadal poprawnie mówią ≤3h. Zmieniony
został wyłącznie ten jeden cytat w `CLAUDE.md` (ADAPTOWALNE) — świadome, udokumentowane lokalne
odstępstwo tego projektu od domyślnej polityki standardu, nie błąd/dryf.

Powód praktyczny (zaobserwowany 20.09.2026, ta sama sesja co pierwsza wersja tego wpisu): dwa
kolejne cykliczne sprawdzenia Y.6 w odstępie ~2 minut oba nie znalazły niczego nowego w
`AKTUALIZACJE.md` — przy tempie zmian tego pliku (rzędu godzin/dni, nie minut) cykl 3h generuje dużo
zerowych sprawdzeń. Dopisano też odpowiadający wpis do `docs/wklad-do-standardu.md` (POMYSŁ NA
REGUŁĘ — cykl Y.6/U.4 mógłby być konfigurowalny per projekt zamiast sztywnego ≤3h) — to zgłoszenie
kanałem zwrotnym, nie samodzielna zmiana standardu; decyzję podejmie wyłącznie sesja nad
`new-app-standards`.

**Dla przyszłych sesji tego projektu:** przy Kroku "Zanim zaczniesz" i przy Routine Y.6 stosuj ≤12h
z `CLAUDE.md`, nie ≤3h z GOD BOOK — ten drugi zapis wciąż tam jest (poprawnie, jako mirror), ale nie
obowiązuje operacyjnie w tym repo od D21.

