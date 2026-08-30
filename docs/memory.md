# docs/memory.md — Inżynier Offgrid Pro

Żywy log decyzji, pułapek i stanu tego konkretnego projektu. Format i zasada aktualizacji: `docs/standards/14-proces-i-pamiec.md` (14.5). Nie duplikuje `ZASADY_APLIKACJI.md`/`USTALENIA.md` (te są konstytucją projektu, nadrzędną wobec kodu) ani `docs/standards/` (te są standardem wspólnym dla całej rodziny aplikacji) — tu trafia to, co specyficzne dla *tego* repo i *tej* historii pracy.

---

## Decyzje i uzasadnienie

- **2026-08-29 — Standard `docs/standards/` (16 rozdziałów) i ten plik utworzone.** Scalenie: `ZASADY_APLIKACJI.md`/`USTALENIA.md` (istniejące w repo) + audyt architektury "Kontrakty Kernela" (apka "Inżynier szkieletowy Pro") + pełna metodologia treści i wzorców UI Offgrid (Zasady UX Doradcy, plik scalony wszystkich modułów) + komplet dokumentów AI z projektu "Kalkulator Inżyniera Pro" (ARCHITECTURE/CODING_STANDARD/CALCULATORS/AI_MASTER/AI_CAMERA/LOCAL_AI/UI_GUIDE/praca_ai_z_teoria). Format: Markdown w `docs/standards/` jako źródło prawdy (przenośne między AI), `.claude/skills/standards/SKILL.md` jako cienki wrapper dla Claude Code.
- **2026-08-29 — D-1 skorygowane, D-01 zamknięty.** Rozdział 7 (Tryb Live) ma 33 funkcje, nie 50 (numeracja 7.9–7.25 nie istnieje w źródle). Finalna liczba funkcji Biblii: 579 (nie 540). Zweryfikowane programistycznie na podstawie dokumentu scalającego wszystkie moduły, nie z metryczki. Pełny zapis: `ZASADY_APLIKACJI.md` §12, `USTALENIA.md` D-1. Zmergowane do `main` w PR #2.

## Pułapki i lekcje

- **Jeden lockfile, zawsze.** Udokumentowany incydent w siostrzanym projekcie tej rodziny: drugi, nieaktualny lockfile obok żywego zerwał deploy na Vercelu na kilka dni — przyczyna niezwiązana z treścią commitów, trudna do zdiagnozowania bez CI niezależnego od hostingu. W tym repo dziś: tylko `pnpm-lock.yaml` — pilnować, żeby tak zostało.
- **Duże, organicznie rozrosłe dokumenty specyfikacji mają ukryte duplikaty międzyrozdziałowe.** W Offgrid znaleziono co najmniej 7 takich duplikatów (np. cykle odszraniania pompy ciepła opisane w trzech różnych rozdziałach źródła). Przy pracy nad kolejnymi modułami Offgrid: sprawdzać, czy dany temat nie jest już opisany gdzie indziej, zanim napisze się go od nowa.
- **Deklaratywna metryczka dokumentu ≠ rzeczywista treść.** Znaleziona luka: funkcja 1.19 Modułu 2 ("Agregat prądotwórczy — definicja i logika") miała gotową treść źródłową w Biblii i była jawnie zaplanowana jako osobny ekran, ale nigdy nie trafiła do pliku treści modułu — nawet własna sekcja "znane luki" tego dokumentu jej nie wymieniała. Wniosek: nie ufać podsumowaniom "X z X gotowe" bez przeliczenia.

## Konwencje specyficzne dla projektu

- Domena (kalkulatory, walidacja, jednostki) będzie żyła w `lib/` — mapowanie na `core/`/`domain/` ze standardu 01. Konkretna struktura podfolderów do ustalenia przy starcie Etapu 1.
- Encje i identyfikatory modułów mają być nazwane 1:1 z "Biblią" Offgrid (Zasada 7 ZASADY_APLIKACJI.md) — nie tłumaczyć/skracać swobodnie przy implementacji.

## Decyzje i uzasadnienie (c.d. 2)

- **2026-08-29 — Szkielet architektury + pierwszy pełny kalkulator (Ekran 16, Moduł 2).**
  Dodano: `lib/core/calc-result.ts` (`CalcResult<T>`, `Status`, `Warning`), `lib/core/reporter.ts`,
  `lib/core/profiles/{types,pl}.ts` (Zod, minimalny profil PL — waluta/separator, reszta pól
  dogrywana w miarę potrzeb), `lib/adapters/storage-adapter.ts` (tylko interfejs, bez
  implementacji IndexedDB — świadomie odłożone). Dodano `vitest` + `eslint` (flat config przez
  `eslint-config-next/core-web-vitals` i `/typescript` — **nie** przez `FlatCompat`, bo ta ścieżka
  z ESLint 9/10 + eslint-config-next 16.3.3 rzuca `TypeError: Converting circular structure to
  JSON`; rozwiązanie: importować gotowe płaskie configi wprost z podścieżek pakietu). Ekran 16
  "Kalkulatory pomocnicze" zaimplementowany w pełni (3 tryby: W→A, Ah↔Wh, czas pracy z baterii),
  9 testów, zweryfikowany ręcznie w przeglądarce (3 stany werdyktu 🟢🟡🔴 ze screenshotami).
  Rejestr pokrycia: `docs/rejestr-pokrycia.md` (nowy plik, Zasada 12).
- **2026-08-29 — Uwaga narzędziowa: `next dev` dopisuje do `CLAUDE.md` blok
  `<!-- BEGIN:nextjs-agent-rules -->`** ostrzegający, że Next.js 16 ma zmiany API względem danych
  treningowych modelu, i każący czytać `node_modules/next/dist/docs/` przed pisaniem kodu. Blok
  jest generowany automatycznie przy każdym `next dev` — nie usuwać ręcznie z diffa (i tak wróci),
  commitować razem z resztą, żeby drzewo było czyste (tak mówi sam komentarz w bloku).

## Decyzje i uzasadnienie (c.d. 3)

- **2026-08-29 — Ekran 1, Moduł 2 (Survival Core) zaimplementowany.** Drugi kalkulator, celowo
  innego kształtu niż Ekran 16 (katalog wyboru + agregacja sumy, nie pojedynczy wzór). Katalog
  domyślnych mocy w `lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants.ts`.
  **"Ogrzewanie" nie ma domyślnej mocy w źródle** (Biblia dawne 1.1 podaje domyślne W dla 5 z 6
  kategorii) — potraktowane jako `defaultPowerW: null`, zaznaczenie bez ręcznie wpisanej mocy >0
  daje jawny błąd 🔴 ("musi mieć moc większą od zera"), nigdy ciche 0W. Docelowo ta wartość ma
  pochodzić z Modułu 6 (Ogrzewanie/pompa ciepła), jeszcze nie zbudowanego.

## Decyzje i uzasadnienie (c.d. 4)

- **2026-08-29 — Ogrzewanie w Ekranie 1 (Survival Core): potwierdzone, ręczne wpisywanie na razie.**
  Decyzja właściciela projektu: zostawiamy jak jest — brak domyślnej mocy, użytkownik wpisuje
  ręcznie (kod bez zmian, już tak działa — patrz wpis wyżej z 2026-08-29 o implementacji Ekranu 1).
  **Do wrócenia w przyszłości:** rozważyć albo (a) automatyczne pobieranie mocy ogrzewania z
  danych budynku (podobny wzorzec do "Kalkulatora Inżyniera Pro", gdzie dane budynkowe są
  importowane z osobnego modułu/aplikacji — `ARCHITECTURE.md` §9 z materiałów źródłowych), albo
  (b) użytkownik nadal wpisuje ręcznie jako świadomy wybór, nie prowizorka. Nierozstrzygnięte —
  nie blokuje dalszej pracy nad Modułem 2.

## Otwarte sprawy / dług

- **PWA — świadomie odłożone (2026-08-30).** Decyzja autora: "Pwa, jeszcze nie robiliśmy, czekamy
  na inne funkcje. Dla tam tej apki mam pwa, ale jeszcze nie wdrożone, wieczorem ci dam ten plik.
  Popatrzysz sobie." Brak `manifest.json` i service workera w repo — nie budować teraz. Autor ma
  gotową konfigurację PWA z siostrzanej aplikacji rodziny "Inżynier Pro" i dostarczy plik do
  przejrzenia/adaptacji. `app/layout.tsx` ma już `viewport.colorScheme: 'light dark'` i osobne
  `themeColor`/ikony per schemat (przygotowane pod PWA), ale zawiera nieaktualne pozostałości
  scaffoldu v0 (`title: 'v0 App'`, `description: 'Created with v0'`, `generator: 'v0.app'`,
  `<html lang="en">` mimo polskiej treści) — do poprawienia przy właściwym wdrożeniu PWA, nie teraz.
- **Świadomie poza zakresem kroku "szkielet + Ekran 16" (2026-08-29):** realna implementacja
  `IndexedDbStorageAdapter` (dziś tylko interfejs), i18n, pozostałych 15 ekranów Modułu 2 +
  moduł zbiorczy wampirów energetycznych, cały Moduł 1 (czeka na treść źródłową — patrz niżej),
  CI (rozdział 11 standardu), delegowanie części UI do v0/Vercel (czeka na ten kontrakt
  `CalcResult`/`Warning` jako punkt odniesienia dla mockowanych ekranów).
- **Luka 1.19** (Moduł 2, "Agregat prądotwórczy") — do dopisania jako ekran D przy Etapie 3 treści Modułu 2. Treść źródłowa gotowa w Biblii, patrz `docs/domena/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`.
- ~~Materiały źródłowe Offgrid żyją poza tym repo~~ — **rozstrzygnięte 2026-08-29, patrz wpis niżej.**
- ~~Brak pełnej treści Modułu 1~~ — **rozstrzygnięte 2026-08-29** — pełna treść Modułu 1 (4 ekrany) dotarła i jest w `docs/domena/Tresc_Modul_1_Lokalizacja_Ekrany.md`.

## Decyzje i uzasadnienie (c.d.)

- **2026-08-29 — Wznowiono Etap 1 (szkielet architektury).** Pauza z `ZASADY_APLIKACJI.md` §14 (2026-08-28) zakończona decyzją autora. Pierwszy moduł domenowy: Rozdział 0+1 (Geostruktura + Bilans obciążeń), zgodnie z pierwotną, zatwierdzoną teraz kolejnością. Zmiana odnotowana w `ZASADY_APLIKACJI.md` §14 i `USTALENIA.md` (jawna korekta, stara notatka zachowana obok nowej, zgodnie z rozdziałem 14.2 standardu).

## Decyzje i uzasadnienie (c.d. 5)

- **2026-08-29 — Materiały źródłowe Offgrid przeniesione do repo (`docs/domena/`).** Powód: przy
  kompresji kontekstu długiej sesji AI traci dostęp do wcześniej wklejonej treści plików źródłowych
  (nawet jeśli w podsumowaniu zostaje odnotowane, że "zostały przeczytane") — realny koszt: pytanie
  do autora o ponowne wysłanie tego, co już raz dostarczył. Rozwiązanie: pliki trafiają do repo jako
  kopia 1:1, dostępna dla każdej przyszłej sesji AI bez ponownego wysyłania. Skopiowano komplet:
  wszystkie 13 plików `Tresc_Modul_X_*_Ekrany.md` (moduły 1–13), `Tresc_WSZYSTKIE_MODULY_scalone.md`,
  `Zasady_UX_Doradca_v2_1.md`, `Biblia_Offgrid_v2_0_Architektura_Modulowa.md`. Indeks i zasady
  aktualizacji: `docs/domena/README.md`. Zamyka otwartą sprawę z sekcji niżej i lukę "brak treści
  Modułu 1" (Moduł 1 dotarł w komplecie, 4 ekrany).

## Decyzje i uzasadnienie (c.d. 6)

- **2026-08-29 — Zbudowano 8 ekranów wzorcowych (A–H) jako przygotowanie do przekazania v0.**
  Zamiast kontynuować Moduł 2 ekran-po-ekranie, na wyraźną decyzję autora ("zrobimy od A do H a
  nie kilka") zbudowano po jednym w pełni zaimplementowanym przykładzie dla każdego z 8 wzorców UI
  z `docs/standards/08-ui-ux.md` (8.2), żeby dać v0 spójny materiał do ustalenia jednego systemu
  projektowego naraz, zamiast osobnych sesji per moduł. Wybrane ekrany (szczegóły i pliki:
  `docs/rejestr-pokrycia.md`, sekcja "Moduły 3–13 — wzorce UI reprezentatywne"):
  - A: Moduł 3/Ekran 11 — Konfigurator stringów PV (szereg/równolegle/mieszany)
  - B: Moduł 4/Ekran 30 — Porównanie technologii magazynów
  - C: Moduł 3/Ekran 24 — Czystość i śnieg na panelach (akordeon)
  - D: Moduł 4/Ekran 24 — Dobór bezpiecznika DC (AIC) — twardy stop bezpieczeństwa
  - E: Moduł 4/Ekran 11 — Moment dokręcania śrub (checklist)
  - F: Moduł 5/Ekran 19 — Trasy kablowe (ilustracja SVG, bez pól i bez kalkulatora)
  - G: Moduł 8/Ekran 11 — Audyt bezpieczeństwa pożarowego (raport na danych demonstracyjnych)
  - H: Moduł 9/Katalog 1 — Katalog czujników (21 typów, dodawanie wielu instancji)

  Wszystkie zweryfikowane: testy (E i F celowo bez pełnego kompletu plików — patrz notatki w
  rejestrze), lint, `tsc --noEmit`, `next build`, ręcznie w przeglądarce (Playwright, wszystkie
  stany werdyktu i brak błędów konsoli).

  **Świadome uproszczenia, nie przeoczenia:**
  - Ekran G (audyt pożarowy) używa danych demonstracyjnych (`SAMPLE_AUDIT_ITEMS`), jawnie
    oznaczonych w kodzie i UI — realna wersja wymaga Modułów 8/9/13 (na żywo), niezbudowanych.
  - Ekran C: zakres kąta 10–15° nie ma jednoznacznej klasyfikacji w źródle — zgłoszone jako
    ostrzeżenie w UI, nie zgadywane.
  - Ekran D: margines AIC vs prąd zwarciowy oparty wyłącznie na jawnie podanych w źródle
    regułach (AIC < I_zw = 🔴 twardy stop; AIC < 10 000 A zalecane minimum LiFePO4 = 🟡) — bez
    dodatkowego, nieuzasadnionego źródłowo współczynnika bezpieczeństwa.

  **Pozostaje do zrobienia:** przygotować zbiorczą notatkę/brief dla v0 (linki do wszystkich 8
  ekranów + krótki opis wzorca każdego), zaktualizować pełne wyliczenie per-funkcja dla modułów
  3/4/5/8/9 w rejestrze pokrycia (dziś: tylko te 8 ekranów jako `done`, reszta jako grupowe
  `todo` bez enumeracji — nie zgadywana teraz).

## Decyzje i uzasadnienie (c.d. 7)

- **2026-08-30 — Pulpit adaptacyjny: decyzja projektowa spisana, bez kodu.** Autor przedstawił
  koncept adaptacyjnego pulpitu (onboarding proponuje układ 13 kafli + Kafel 14 Ustawienia, user
  zawsze może zmienić, nic nie znika — tylko się chowa; ten sam mechanizm rekurencyjnie wewnątrz
  każdego modułu dla jego ekranów). Oceniony jako dobry kierunek, spójny z tym, co już istniało w
  źródle (`Tresc_WSZYSTKIE_MODULY_scalone.md` już definiuje "kafle pulpitu: 13+1"). Spisane w
  dwóch miejscach: `docs/standards/08-ui-ux.md` §8.11 (mechanizm generyczny, reużywalny w innych
  aplikacjach rodziny) i `docs/pulpit-i-nawigacja.md` (konkretna instancja Offgrid — domyślna
  kolejność 13 kafli uzasadniona przepływem zależności danych, 8 presetów onboardingu jako
  **pierwsza wersja robocza do potwierdzenia przez autora**, zasady interakcji).
  Ustalenia autora: (1) pasek górny (Lokalizacja/Live/Ustawienia) to **dodatkowy skrót**, Kafel 14
  i Kafel 1/13 zostają pełnoprawnymi pozycjami na pulpicie, nie są zastępowane; (2) kolejność
  budowy kodu (`ZASADY_APLIKACJI.md` §14) i kolejność kafli na pulpicie usera to **dwie niezależne
  sprawy** — kafle mogą zmieniać kolejność swobodnie, nie muszą być zsynchronizowane z planem
  pracy zespołu. Jedyne zidentyfikowane realne ryzyko: `§14` używa starszej numeracji "Rozdział
  0–12" nie pokrywającej się 1:1 z dzisiejszą "Moduł/Kafel 1–13" z `docs/domena/` — dopisano
  jednozdaniowe zastrzeżenie w `§14`, nie przenumerowano całej roadmapy (to i tak inny dokument).
  Wersja zasad `ZASADY_APLIKACJI.md`/`USTALENIA.md` → 0.1.4.
  **Nie robimy:** terminu "AI" dla mechanizmu presetów (to deterministyczne mapowanie, nie ML —
  patrz `docs/standards/09-ai-w-produkcie.md`), auto-zmiany układu pulpitu w trakcie pracy usera
  (tylko propozycja + jawne zatwierdzenie).
  **Otwarte:** 8 presetów onboardingu i presety per moduł — do przejrzenia/potwierdzenia przez
  autora przed implementacją; implementacja (`AdaptiveMenu` + strona główna) jeszcze nie
  rozpoczęta, świadomie (autor wybrał "spisz decyzję, jeszcze bez kodu").

## Decyzje i uzasadnienie (c.d. 8)

- **2026-08-30 — `§14` jednak przenumerowane w pełni, nie tylko zastrzeżenie (koryguje wpis wyżej).**
  Autor dopytał wprost o jeden fragment ("stary Rozdział 6 = Stress-test, dzisiejszy Moduł 6 =
  Ogrzewanie") i po weryfikacji ("dawne N.x" w `docs/domena/` to bezpośrednio stara numeracja)
  poprosił o rozwiązanie, nie tylko oznaczenie problemu. **Zweryfikowane źródłowo, nie zgadywane:**
  stary Rozdział 0–6 → dzisiejszy Moduł 1–7 to proste przesunięcie +1 (stary system liczył od 0);
  od Rozdziału 7 wzwyż kolejność faktycznie się przetasowała (Live 7→13, Kalkulator 8→12, Montaż
  9+10→11, ESP32 11→9, AI 12→10); Moduł 8 (Bezpieczeństwo) nie istniał jako osobny stary rozdział —
  złożony z kawałków starych 6+11+12 (cross-cutting, potwierdzone wprost w
  `Tresc_Modul_8_Bezpieczenstwo_Ekrany.md`). Pełna tabela: `docs/pulpit-i-nawigacja.md` §2.
  **Wykonano:** `ZASADY_APLIKACJI.md` §14 przepisane na wyłącznie numerację Moduł N; wersja
  pierwotna ("Rozdział") zachowana w zwijanym bloku `<details>`, nie usunięta (Zasada 14.2).
  Poprawiono też dwie stale referencje do starej numeracji w §11 (Freemium: "Rozdz. 8" →
  doprecyzowane jako "dawny Rozdz. 8, dzisiejszy Moduł 12") w obu plikach. Wersja zasad → 0.1.5.
  **Nie ruszone świadomie:** wpisy D-1/D-01 w dzienniku zmian i CZĘŚCI II `USTALENIA.md` — to
  historyczne zapisy konkretnej decyzji o liczbie funkcji (inny temat niż kolejność budowy),
  zostają z oryginalną numeracją jako ślad historii, zgodnie z zasadą "nie usuwaj — oznacz".

## Decyzje i uzasadnienie (c.d. 9)

- **2026-08-30 — `§14` skorygowane po raz drugi: czysta kolejność 1→13, bez wyjątków.** Autor
  zauważył, że wersja 0.1.5 (wyżej) nie była tym samym co kolejność kafli pulpitu, którą już
  zaakceptował wcześniej w tej samej sesji (`docs/pulpit-i-nawigacja.md` §2) — 0.1.5 zachowała
  stary wyjątek "wyciągnij Moduł 12 do przodu na wczesne demo" (odziedziczony z pierwotnej wersji
  z 2026-08-28). **Decyzja autora:** ten wyjątek jest nieaktualny, porzucony. `§14` teraz = czysta
  kolejność zależności danych 1→13, identyczna z kolejnością kafli pulpitu — jeden system, nie dwa
  podobne, ale nie identyczne. Dodatkowo: **Kafel 14 (Ustawienia) dostał własny, jawny punkt**
  (krok 2 planu budowy) — wcześniej był tylko domyślnie/niejawnie wliczony w krok "szkielet", co
  autor uznał za mylące ("nie stałe trzymać go w głowie"). Obie poprzednie wersje (2026-08-28
  "Rozdział" i 2026-08-30 pierwsza korekta "Moduł z wyjątkiem") zachowane w zwijanych blokach w
  `ZASADY_APLIKACJI.md` §14, nic nie usunięte. Wersja zasad → 0.1.6.

## Decyzje i uzasadnienie (c.d. 10)

- **2026-08-30 — Pulpit adaptacyjny zaimplementowany (v1) + 7 brakujących modułów dostało ekran.**
  Autor poprosił o realny, klikalny pulpit do paczki dla v0 — wymóg: każdy z 13 kafli musi
  prowadzić do czegoś realnego, nie ślepego zaułka. Moduły 3, 4, 5, 8, 9 miały to już z wzorców
  A–H; zbudowano po jednym prostym ekranie dla pozostałych sześciu (1, 6, 7, 10, 11, 12, 13 —
  Moduł 1 był już wcześniej pusty, dopisany przy okazji) — szczegóły i pliki w
  `docs/rejestr-pokrycia.md`. Świadome uproszczenia bez fabrykowania danych: Moduł 1 (Lokalizacja)
  tylko tryb offline/ręczny (integracja PVGIS poza zakresem); Moduł 10 (Prognozy) i Moduł 8 (już
  wcześniej) na danych demonstracyjnych, jawnie oznaczonych; Moduł 13 (Live) to czysta bramka
  informacyjna bez modułu domenowego — pokazuje "brak połączenia z telemetrią", nie zmyśla danych.

  **Pulpit:** `lib/pulpit/registry.ts` (jedyne źródło prawdy — 13 kafli + Kafel 14, każdy z listą
  zarejestrowanych ekranów), `lib/pulpit/storage.ts` (preferencje widoczności/kolejności w
  `localStorage` — Zasada 6, "drobna preferencja UI", nie dana projektu), `app/page.tsx` (siatka
  kafli — **zastąpił przestarzały `UstaleniaViewer`** hardkodowany na wersję 0.1.2, usunięty jako
  martwy kod), `app/moduly/[id]/page.tsx` (lista ekranów modułu po kliknięciu kafla),
  `app/ustawienia/page.tsx` (pokaż/ukryj/przenieś ↑↓/przywróć domyślne).

  **Pułapka napotkana i naprawiona:** pierwsza wersja (`useState`+`useEffect` do odczytu
  `localStorage` po mount) złapała nowe ESLint `react-hooks/set-state-in-effect` (blokujące,
  `next build` ma `ignoreBuildErrors: true`, więc to tylko `pnpm lint` by to złapał, nie build —
  ważne, żeby zawsze odpalać lint osobno). Naprawione przez `useSyncExternalStore` (subscribe +
  getSnapshot + getServerSnapshot z cache'owaniem referencji) — to jest właściwy hook Reacta do
  odczytu zewnętrznego źródła (localStorage) w sposób bezpieczny dla SSR/hydracji, nie obejście.

  Zweryfikowane: 87 testów, lint czysty, `tsc --noEmit` czysty, `next build` (34 trasy, w tym 13
  prerenderowanych `/moduly/[id]` przez `generateStaticParams`), ręcznie w przeglądarce (klik
  kafel → lista ekranów → realny kalkulator; ukrycie kafla w Ustawieniach → znika z pulpitu →
  "Przywróć domyślne" go zwraca; zero błędów konsoli).

  **Świadomie uproszczone w v1 (nie przeoczenia):** "Przenieś" to ↑/↓, nie drag-and-drop (ten sam
  efekt, bez nowej zależności); brak ekranu onboardingu ("co chcesz robić") — pulpit zawsze
  startuje z pełną domyślną kolejnością, presety trzeba by zastosować ręcznie; brak "Zmień
  rozmiar"/"Przypnij" z `docs/pulpit-i-nawigacja.md` §4. Zapisane jako otwarte w tym dokumencie.

## Decyzje i uzasadnienie (c.d. 11)

- **2026-08-30 — Przełącznik jasny/ciemny/systemowy zaimplementowany + brief dla v0 rozszerzony.**
  Autor: dodać przełącznik motywu od razu (odpowiedź na wcześniej otwarte pytanie), przygotować
  `docs/brief-dla-v0.md` tak, żeby v0 mógł go czytać wprost z repo, i doprecyzować dla v0 dwa
  wymogi: (1) każdy z 8 wzorców UI ma być reużywalnym szablonem/komponentem, nie kopiowanym kodem
  per ekran, (2) kolory nie mogą być hardkodowane — zawsze przez istniejące tokeny CSS.

  **Kod:** `lib/theme/storage.ts` (ten sam wzorzec co `lib/pulpit/storage.ts` —
  `useSyncExternalStore`, stan `"system" | "light" | "dark"` w `localStorage`), `components/theme-
  toggle.tsx` (przycisk 🖥️→☀️→🌙→🖥️ w pasku górnym pulpitu, `app/page.tsx`), inline skrypt w
  `app/layout.tsx` ustawiający klasę na `<html>` synchronicznie przed pierwszym malowaniem (bez
  błysku złego motywu przy odświeżeniu) — wymagało `suppressHydrationWarning` na `<html>`, bo
  klasa ustawiana poza kontrolą Reacta przed hydracją zawsze będzie się różnić od SSR-owanego
  znacznika (oczekiwane, nie błąd). Zweryfikowane w przeglądarce (Playwright): przełączanie działa,
  wybór przetrwa odświeżenie, zero błędów konsoli po dodaniu `suppressHydrationWarning`.

  **Nie zrobione, czeka na decyzję autora:** żywy edytor kolorów w Ustawieniach (paleta + pole na
  HEX dla kilku kluczowych tokenów) — rekomendacja jest w `docs/brief-dla-v0.md`, sekcja "Edytor
  kolorów w Ustawieniach — opinia", ale zakres (które tokeny, kiedy budować) nie jest jeszcze
  potwierdzony.

## Decyzje i uzasadnienie (c.d. 12)

- **2026-08-30 — Edytor kolorów/czcionki + `/wzornik` + refaktoryzacja 14 ekranów na `WerdyktPanel`.**
  Autor: chce jedną stronę pokazującą wszystkie ikony/werdykty/chmurki naraz, z możliwością zmiany
  koloru pojedynczo albo grupowo (zaznacz kilka, zastosuj jeden kolor), plus wybór polskiej
  czcionki z opcją pogrubienia. Zaakceptował pełny zakres z góry ("akceptuję wszystkie twoje
  pomysły, rób to").

  **Odkrycie po drodze:** kolory werdyktu 🟢🟡🔴 były zahardkodowane jako surowe klasy Tailwind
  (`border-green-600 bg-green-50...`) osobno na 14 ekranach kalkulatorów — nie przez tokeny CSS.
  Edytor kolorów bez naprawienia tego byłby "kłamliwy" (zmiana w Ustawieniach nic by nie robiła na
  realnych ekranach) — więc zakres objął też refaktoryzację, nie tylko nowy edytor.

  **Kod:**
  - `app/globals.css` — nowe tokeny `--werdykt-ok/-uwaga/-blad` (kolor bazowy, edytowalny) +
    `--werdykt-*-bg/-border/-foreground` liczone automatycznie przez `color-mix()` (osobne
    proporcje mieszania dla jasnego/ciemnego motywu) — user zmienia jeden kolor, nie trzy odcienie
    naraz. Też: `--font-sans-user` (wskaźnik na aktywną czcionkę) i klasa `.czcionka-pogrubiona`.
  - `components/werdykt.tsx` — `WerdyktPanel`/`WerdyktBadge` (reużywalny komponent werdyktu) +
    `poziomZStatusu()`. Wszystkie 14 ekranów z hardkodowanymi klasami koloru przepisane na to
    (`audyt-pozarowy`, `cop-pompy-ciepla`, `czystosc-i-snieg`, `dobor-bezpiecznika-dc`,
    `konfigurator-stringow`, `lokalizacja-i-klimat`, `moment-dokrecania-srub`, `pomocnicze`,
    `porownanie-technologii-magazynow`, `procedura-black-start`, `prognozy`,
    `przygotowanie-stanowiska`, `systemy-podtrzymania-zycia`, `tryb-uproszczony`) — stan
    "niekompletne dane, jeszcze bez werdyktu" (np. `INCOMPLETE`) świadomie zostawiony jako osobny,
    neutralny styl (nie wciśnięty na siłę w 🟢/🟡/🔴, żeby nie sugerować oceny, której jeszcze nie ma).
  - `components/ui/chmurka.tsx` — `Chmurka`/`PomocPole` na `@base-ui/react/tooltip` (już w
    zależnościach, ten sam prymityw co `components/ui/button.tsx`) — dymek z 8.4.
  - `lib/wyglad/storage.ts` — 7 grup kolorów (Tło/Karty/Tekst/Akcent/Sukces/Uwaga/Błąd) + czcionka
    + waga tekstu, ten sam wzorzec `useSyncExternalStore`/`localStorage` co `lib/pulpit/storage.ts`
    i `lib/theme/storage.ts`. Akcent dostaje automatycznie dobrany kolor tekstu (luminancja WCAG,
    nie stały czarny/biały) — inaczej dowolny wybrany hex mógłby dać nieczytelny tekst na przycisku.
  - `app/layout.tsx` — 4 fonty przez `next/font/google` (Inter, Source Sans 3, Roboto, Lato),
    subset `latin-ext` (bez tego polskie znaki ą/ć/ę/ł/ń/ó/ś/ź/ż się nie renderują poprawnie).
    Inline skrypt w `<head>` rozszerzony: oprócz motywu odtwarza teraz też kolory/czcionkę z
    `localStorage` przed pierwszym malowaniem (ta sama logika co `lib/wyglad/storage.ts`,
    zduplikowana w czystym JS — skrypt biegnie przed hydracją, nie może importować modułów TS).
  - `components/kolor-grupa-edytor.tsx` / `components/czcionka-edytor.tsx` — UI edytorów,
    renderowane w dwóch miejscach (`app/ustawienia`, `app/wzornik`) przez ten sam komponent.
  - `app/wzornik/page.tsx` (nowy) — strona-wzornik: edytory + werdykty + chmurki + styl
    komunikatów + przyciski + typografia (z polskim pangramem) + komplet ikon nawigacji/modułów.

  **Pułapka napotkana i naprawiona:** `suppressHydrationWarning` na `<html>` było już potrzebne od
  przełącznika motywu (poprzedni wpis), ale przy dodaniu 4 klas fontowych z `next/font` trzeba było
  upewnić się, że te klasy są stosowane server-side (przez `className` w JSX, nie inline skryptem)
  — inaczej powtórzyłby się błąd hydracji. Kolory/czcionka-wybór (zmienne dynamiczne z
  `localStorage`) idą przez inline `style`/`classList` w skrypcie, klasy fontów statyczne przez
  JSX — rozdzielenie tych dwóch mechanizmów było celowe, nie przypadkowe.

  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm test` (87/87), `pnpm build` (35 tras, w tym
  `/wzornik`), Playwright — grupowa zmiana koloru w Ustawieniach/`/wzornik` widoczna po pełnej
  nawigacji na ekranie kalkulatora (`/kalkulatory/tryb-uproszczony`), zmiana czcionki, chmurka na
  hover, zrzuty ekranu jasny/ciemny na `dobor-bezpiecznika-dc` (kontrast OK w obu).

## Mapa orientacyjna

- `docs/standards/00-INDEKS.md` — standard wspólny dla rodziny aplikacji, zacznij tu przy pytaniach "jak mamy to robić".
- `ZASADY_APLIKACJI.md` (pełna) / `USTALENIA.md` (skrót) — konstytucja Offgrid, nadrzędna wobec kodu.
- `docs/domena/` — materiały źródłowe Offgrid (Biblia, treść 13 modułów, plik scalony, Zasady UX Doradcy) — przeszukiwać tu zamiast pytać użytkownika o ponowne wysłanie.
- `docs/pulpit-i-nawigacja.md` — decyzja o pulpicie adaptacyjnym (13+1 kafli, kolejność, presety onboardingu) — czytaj przed budową ekranu głównego lub menu wewnątrz modułu.
- `lib/pulpit/registry.ts` — jedyne źródło prawdy o 13 kaflach i ich ekranach; dopisz tu nowy ekran, żeby pojawił się w `/moduly/[id]`.
- `app/`, `components/ui/`, `lib/utils.ts` — obecny szkielet Next.js, bez kodu domenowego.
- `CLAUDE.md` — punkt wejścia dla AI, odsyła tutaj i do standardu.
