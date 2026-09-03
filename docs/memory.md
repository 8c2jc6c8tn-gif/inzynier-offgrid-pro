# docs/memory.md — Inżynier Offgrid Pro

Żywy log decyzji, pułapek i stanu tego konkretnego projektu. Format i zasada aktualizacji: `docs/standards/14-proces-i-pamiec.md` (14.5). Nie duplikuje `ZASADY_APLIKACJI.md`/`USTALENIA.md` (te są konstytucją projektu, nadrzędną wobec kodu) ani `docs/standards/` (te są standardem wspólnym dla całej rodziny aplikacji) — tu trafia to, co specyficzne dla *tego* repo i *tej* historii pracy.

---

## Synchronizacja ze standardem

<!-- Obowiązkowe od GOD BOOK Część Y.6. Sprawdzaj AKTUALIZACJE.md w new-app-standards co ≤7 dni. Brak wpisu = "nigdy nie sprawdzono". -->
- **2026-09-03 — pełna synchronizacja wykonana** (pierwsza, wcześniej nie istniała). Odświeżono `docs/standards/00`–`16` (dodano brakujący rozdział 16), dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, `PROMPT_STARTOWY.md`, `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`. Punktowo poprawiono `CLAUDE.md` i `.claude/skills/standards/SKILL.md` (nowe odsyłacze do GOD BOOK Część Y, bez nadpisania lokalnej treści). Szczegóły niżej, sekcja "Decyzje i uzasadnienie". Świadomie NIE wykonano: migracji `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/` do kanonicznego formatu GOD BOOK (`00_Biblia.md` itd.) — to osobna, większa decyzja, patrz `docs/lista-do-zrobienia.md`.

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

## Decyzje i uzasadnienie (c.d. 13)

- **2026-08-30 — Przycisk "Wstecz" + okruszki na wszystkich 17 ekranach kalkulatorów.** Autor
  zauważył (po pierwszej rundzie z v0), że żaden ekran `/kalkulatory/*` nie ma nawigacji powrotnej
  — brak zarówno przycisku wstecz, jak i okruszków wymaganych przez `docs/standards/08-ui-ux.md`
  8.7 ("Przycisk Wstecz zawsze w tym samym miejscu... Okruszki pokazujące pozycję w strukturze
  modułów"). To nie była luka po stronie v0 — my sami tego nie zbudowaliśmy wcześniej, na żadnym
  z 17 ekranów (wliczając 8 wzorców A–H).

  **Rozwiązanie:** `lib/pulpit/registry.ts` dostał `znajdzKafelIEkranPoHref()` (odwrotne
  wyszukiwanie: href ekranu → jego kafel + etykieta), `components/nawigacja-ekranu.tsx` —
  `NawigacjaEkranu` renderuje "← Wstecz" (do `/moduly/{id}` kafla nadrzędnego) + okruszki
  "Pulpit / Nazwa modułu / Nazwa ekranu" (oba środkowe poziomy klikalne). Świadomie **nie** przez
  `usePathname()` — każdy ekran przekazuje własny `href` jako prop, żeby nie wymuszać `"use
  client"` na ekranach czysto serwerowych (np. `audyt-pozarowy`, `prognozy`, `trasy-kablowe`).
  Wstawione na wszystkich 17 ekranów `/kalkulatory/*` (mechanicznie, jeden wzorzec).

  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm test` (87/87), `pnpm build` (35 tras),
  Playwright — kliknięcie w środkowy okruszek prowadzi do listy ekranów modułu, kliknięcie
  "Pulpit" wraca na start, "Wstecz" prowadzi do `/moduly/{id}`, zero błędów konsoli.

  **Nie zrobione w tej rundzie:** `/moduly/[id]`, `/ustawienia`, `/wzornik` mają nadal tylko
  prosty link `← Pulpit`, nie pełne okruszki — mniejszy priorytet, bo to i tak najwyższy poziom
  hierarchii (jeden krok od pulpitu), nie głęboko zagnieżdżony ekran.

## Decyzje i uzasadnienie (c.d. 14)

- **2026-08-30 — Scalona pierwsza runda projektowa v0 (branch `v0/jf7kryn4f9-6614-5a166525`).**
  v0 przeczytał `docs/brief-dla-v0.md` i zrealizował dokładnie to, o co proszono w sekcji 8:
  kolor akcentu ("Techniczny błękit", oklch(0.52 0.18 245) — dobrany świadomie z dala od hue
  werdyktów 152/70/27, żeby "wybrane" nigdy nie wyglądało jak status; alternatywa "Energetyczny
  cyjan" jako druga propozycja z żywym podglądem na `/wzornik`), skala typografii jako tokeny CSS
  (`--text-display/-h1/-h2/-h3/-body/-small/-caption`), audyt kontrastu WCAG z uzasadnieniem
  liczbowym w komentarzach (`scripts/audyt-kontrastu.mjs`, poprawki `--border`/`--input`/`--ring`),
  stany komponentów (`components/ui/pole.tsx` — `Pole`/`PoleSelect`/`PoleCheckbox`;
  `components/ui/stany.tsx` — `StanPusty`/`StanBledu`/`StanLadowania`), i zestaw komponentów
  wzorców (`components/wzorce/`: `NaglowekEkranu`, `ListaChecklist`, `KartaPorownawcza`,
  `BudowniczyListy`, `SekcjaAkordeon`, `PanelOdczytowy`/`ListaOdczytowa`, `WynikGlowny`,
  `WynikSzczegoly`, `MigawkaBox`) — dokładnie w duchu "szablon per wzorzec, nie ekran per ekran"
  z briefu. Nie dotknął `lib/core/` ani logiki obliczeniowej — zweryfikowane w diffie.

  **Konflikt scalania (spodziewany, nie błąd):** branch v0 odgałęził się przed naszym PR #8
  (przycisk Wstecz + okruszki), więc wszystkie 16 ekranów kalkulatorów, które oba branche
  zmieniały, dały prawdziwy konflikt gita (nie sprzeczność decyzji — obie zmiany były ze sobą
  zgodne, tylko dotykały tych samych linii). Scalone ręcznie: `git merge --no-commit --no-ff`,
  potem per plik "zachowaj obie strony" (import + `<NawigacjaEkranu>` z naszej strony, resztę
  przebudowy z `Pole`/`NaglowekEkranu`/`Stan*` od v0).

  **Dwie pułapki znalezione i naprawione po scaleniu (programistyczne rozstrzygnięcie konfliktu
  „zachowaj obie strony” zostawiło błędy, nie tylko redundancję):**
  1. **Zdublowany nagłówek na wszystkich 16 ekranach** — stary surowy `<div><h1 className="text-xl
     font-semibold">...</div>` (nasza strona konfliktu) został wyrenderowany **obok**, nie
     zamiast, nowego `<NaglowekEkranu>` v0 — dwa identyczne nagłówki jeden pod drugim, widoczne
     wizualnie, nie tylko w kodzie. Naprawione: usunięty stary blok, zostawiony tylko
     `NaglowekEkranu`. **Wniosek na przyszłość:** przy scalaniu konfliktu metodą "zachowaj obie
     strony" zawsze sprawdzić wizualnie (nie tylko `tsc`/`lint`/`build`) ekrany, gdzie obie strony
     zmieniały tę samą, wyrenderowaną treść — kompilacja przechodzi czysto nawet z dublującą się
     treścią.
  2. **`tryb-uproszczony` stracił `<NawigacjaEkranu>` całkowicie** — to jedyny z 17 plików, gdzie
     auto-merge gita zaszedł **bez** konfliktu (bo hunki nie nachodziły na siebie tekstowo), ale
     po cichu wziął tylko wersję v0 i zgubił nasz breadcrumb. Naprawione ręcznie — dopisany import
     i `<NawigacjaEkranu href="/kalkulatory/tryb-uproszczony" />`. **Wniosek:** brak konfliktu przy
     mergu nie znaczy brak utraty zmian — zawsze warto zweryfikować liczbę wystąpień kluczowego
     markera (`grep -c` po nazwie komponentu) po scaleniu, nie tylko polegać na "0 CONFLICT".

  Po naprawie: martwy kod po stronie starych helperów (`inputClass`/`Field`/`cn` nieużywane —
  zastąpione przez `Pole`/`Stan*`) posprzątany w 9 plikach, gdzie lint to wyłapał. Zweryfikowane
  od nowa po każdej naprawie: `tsc --noEmit`, `pnpm lint` (0/0), `pnpm test` (87/87), `pnpm build`
  (35 tras), Playwright (zrzuty ekranu `/`, `/wzornik`, `dobor-bezpiecznika-dc`,
  `katalog-czujnikow`, `tryb-uproszczony` — poprawny akcent, poprawne okruszki, zero błędów
  konsoli, brak duplikatów).

  **Pozostałe branche v0 bez unikalnej treści** (`design-system-refinement`, `design-system-
  refinement-1/-2`, pozostałe `v0/jf7kryn4f9-*`) — 0 commitów przed `main`, nie wymagają scalenia
  (prawdopodobnie checkpointy tej samej sesji v0 albo już nieaktualne warianty).

## Decyzje i uzasadnienie (c.d. 15)

- **Animowane ikony kafli pulpitu (kafle 1–7) wdrożone z artefaktu roboczego.** System ikon
  dopracowywany iteracyjnie w podglądowym Claude Artifact ("Off-Grid Tile Set") — jeden SVG
  `<symbol>` + zestaw CSS `@keyframes` per kafel, instancjonowany przez `<use>`. Przeniesiony
  1:1 do repo: `components/kafle-ikony/definicje-symboli.tsx` (defs wstrzyknięte przez
  `dangerouslySetInnerHTML` — świadoma decyzja: to statyczna, ręcznie autoryzowana treść, nie
  dane użytkownika, a ręczna konwersja setek SVG-atrybutów na JSX byłaby wyższym ryzykiem
  literówki niż wklejenie ze źródła), `kafle-ikony.css` (wszystkie animacje, zaczepione o klasę
  `.kafel-ikona-svg` i nazwy `@keyframes` z prefiksem `ki-` — żeby generyczne nazwy typu `.bar`
  czy `.flow` z artefaktu nie wyciekły jako globalne selektory do reszty aplikacji), `ikona.tsx`
  (mapowanie `id kafla → id symbolu` + `KAFLE_ZE_ZBUDOWANA_IKONA` do wyboru SVG vs emoji-fallback).
  `app/page.tsx` (Pulpit) renderuje `<KafelIkonaSvg>` dla kafli 1–7, pozostałe (8–14) zostają na
  emoji z `lib/pulpit/registry.ts`, dopóki ich ikony nie powstaną w artefakcie.
- **Kafel 01 zablokowany w artefakcie jako finalny** (pinezka GPS niebieska zamiast zielonej) —
  nowy wzorzec pracy: "dopracuj jeden kafel idealnie, oznacz jako Locked, nie wracaj do niego bez
  wyraźnej prośby". Kafle 02/04/06/07 dostały tego dnia poprawki (przepływ prądu kończący się na
  błyskawicy i niżej umieszczona chmurka w 02; 12 ogniw LiFePO4 w jednej obudowie zamiast 3 dużych
  w 04; prawdziwy dom + ogrzewanie podłogowe zamiast samego prostokąta w 06; kontrastowy śnieg,
  ogrzewanie podłogowe, zsynchronizowane drenowanie baterii z rosnącą temperaturą i przeniesiony
  termometr w 07) — nie są jeszcze jawnie zablokowane przez użytkownika, mogą wrócić do edycji.
  Kafle 03 i 05 bez zmian od poprzedniej rundy. Kafle 08–14 czekają na dopracowanie w artefakcie.
  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm build` (czysto), Playwright — `/` w jasnym i
  ciemnym motywie, animacje (cykl dzień/noc) faktycznie się kręcą.

## Decyzje i uzasadnienie (c.d. 16)

- **2026-09-03 — Pierwsza pełna synchronizacja z `new-app-standards`, przyjęty GOD BOOK jako metodologia procesowa.** Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (dotąd nigdy nie sprawdzane — mechanizm sam w sobie powstał dopiero tego dnia, Część Y.5–Y.8 GOD BOOK v2.3). Znaleziska: (1) rozdział 16 (`standard-kodowania.md`) brakował całkowicie; (2) wszystkie 17 dotychczasowych rozdziałów (`00-INDEKS`+`00`–`15`) faktycznie się różniły od lokalnej kopii — nie tylko kosmetycznie (m.in. nowa Zasada 6 filozofii — kod prosty do utrzymania przez człowieka; standard odchudzony z odniesień specyficznych dla "rodziny Inżynier Pro" na w pełni domenowo-neutralny; doprecyzowania bezpieczeństwa); (3) zintegrowano zupełnie nowy pakiet metodologiczny "GOD BOOK" (`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, 892 linii) — proces budowy/prowadzenia "Biblii projektu", spięty ze standardem przez nową Część Y (standard = fundament poprzedzający Krok 0 tej metodologii, nie kolejny poziom hierarchii; przy kolizji: dryf bez świadomej decyzji naprawiasz sam, świadomy konflikt zawsze zgłaszasz — patrz Część Y.2).
  **Wykonane (za jawną zgodą użytkownika, "wszystko na raz"):** odświeżono `docs/standards/00`–`16` w całości (kategoria NIETYKALNE, GOD BOOK Y.8 — pełny nadpis bez negocjacji, lokalna różnica w tych plikach to dryf, nie świadoma decyzja). Dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md` i `PROMPT_STARTOWY.md` (też NIETYKALNE). Utworzono z szablonów (kategoria LOKALNE, nowe pliki): `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md` (kanał zwrotny do `new-app-standards` — AI dopisuje tu z własnej inicjatywy, nigdy nie edytuje repo źródłowego bezpośrednio). Punktowo poprawiono (kategoria ADAPTOWALNE — patch, nie nadpis): `CLAUDE.md` (kolejność czytania na start, nowe odsyłacze do GOD BOOK i Części Y, liczba rozdziałów 16→17) i `.claude/skills/standards/SKILL.md` (odsyłacz do GOD BOOK jako fundamentu poprzedzającego, liczba rozdziałów). Dodana ta sekcja "Synchronizacja ze standardem" (obowiązkowa od Y.5/Y.6 — sprawdzać `AKTUALIZACJE.md` co ≤7 dni, zapisywać datę tutaj).
  **Świadomie NIE wykonane:** migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/`/`docs/rejestr-pokrycia.md` do kanonicznego nazewnictwa plików GOD BOOK (`00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `rejestr-decyzji.md`...). Te pliki są kategorii LOKALNE (Y.8 — "sync tego nie dotyka, to własność projektu") i już w praktyce pełnią rolę Biblii tego projektu — restrukturyzacja nazw to osobna, świadoma decyzja projektowa (GOD BOOK Część P/S), nie automatyczny efekt sync'u. Zostaje otwarte w `docs/lista-do-zrobienia.md`.

## Decyzje i uzasadnienie (c.d. 17)

- **2026-09-03 — Audyt zgodności apki z odświeżonym standardem (17 rozdziałów), 3 realne
  niezgodności naprawione.** Sprawdzone empirycznie (grep + czytanie kodu, nie deklaracja):
  warstwy (01) czyste — `lib/core/` nigdzie nie importuje `@/app`/`@/components`; kontrakt
  `CalcResult`/`Warning` (03.2, 04.2) konsekwentnie używany we wszystkich 15 modułach; nazewnictwo
  z jednostką (16.2), zamknięte unie zamiast stringów (16.4), zero generycznych `throw` (16.5) —
  zgodne; jeden lockfile; zero sekretów w repo; `pnpm test` 87/87.
  **Naprawione:**
  1. **Reporter (03.6/16.5) nie był nigdzie użyty** — `lib/core/reporter.ts` istniał jako kontrakt
     bez ani jednego importu. Catch-bloki w `lib/pulpit/storage.ts`, `lib/wyglad/storage.ts`,
     `lib/theme/storage.ts` (odczyt/zapis localStorage) teraz wołają `consoleReporter.reportError`
     zamiast cichego połykania błędu — 8 miejsc łącznie, z zachowaniem dotychczasowego fallbacku
     (te błędy nie są krytyczne, to drobne preferencje UI, nie dane domenowe).
  2. **Brak zbiorczego rejestru twardych stopów (04.3)** — dodano `docs/rejestr-twardych-stopow.md`,
     zbudowany z realnie znalezionych w kodzie faktów bezpieczeństwa (AIC bezpiecznika < prąd
     zwarciowy, agregat bez ładowarki niszczy ogniwa, pasta miedziowa na aluminium, klucz udarowy
     na terminalach, komplet PPE przed montażem baterii), pogrupowanych tematycznie z odsyłaczami
     do plików źródłowych — nie wypisano tam generycznej walidacji formularza (`notPositive` itp.),
     bo to nie są fakty domenowe w sensie 4.3, tylko bramka poprawności danych; to osobna,
     jednozdaniowa sekcja na końcu pliku. Przy okazji znaleziona i **świadomie nierozstrzygnięta**
     kwestia: `KROK-POZA-KOLEJNOSCIA` (Black Start, M7/E5) ma poziom `warning`, mimo że opisuje
     realne ryzyko — zostawione do decyzji właściciela projektu (`docs/standards/15`, 15.4),
     zapisane w `docs/lista-do-zrobienia.md`.
  3. **`StorageAdapter` (05.2) to sam kontrakt, bez implementacji i bez jednego wywołania w
     kodzie** — nie zbudowano IndexedDB teraz (byłoby to spekulacyjne: apka nie ma jeszcze żadnej
     funkcji zapisującej Seed projektu, każdy kalkulator liczy w locie z pól formularza).
     Zdecydowano: dopisać w komentarzu w kodzie i w `docs/lista-do-zrobienia.md` jawny warunek
     wyzwalający implementację (pierwsza funkcja "zapisz projekt"), żeby to była udokumentowana,
     świadoma decyzja, a nie cicho zapomniana luka.
  Zweryfikowane po zmianach: `tsc --noEmit` czysto, `pnpm test` nadal 87/87 (poprawki nie dotknęły
  logiki kalkulatorów, tylko catch-bloki trzech magazynów UI-preferencji).

## Decyzje i uzasadnienie (c.d. 18)

- **2026-09-03 — Ekran A1, Moduł 11 (Montaż baterii): "Weryfikacja kompletności i kontrola
  wstępna ogniw" zaimplementowany.** Pierwszy z rozdziału "podłączanie baterii" (Ścieżka LiFePO4,
  `docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md`) — użytkownik wybrał tylko A1 z zaproponowanej
  listy (A1/A3/A4/A6), A2/A5 świadomie odłożone. Świadoma decyzja projektowa: dwa punkty checklisty
  źródła ("liczba ogniw zgodna z napięciem", "różnica napięć <0,05V") mają realną logikę liczbową
  do policzenia z danych, które user i tak wpisuje — zamiast pytać "czy sprawdziłeś", apka liczy to
  sama (`OCZEKIWANA_LICZBA_OGNIW` 12V=4S/24V=8S/48V=16S, `MAX_ROZNICA_NAPIEC_V=0.05`). Tylko
  BMS-bez-balancera i różnica napięć są oznaczone 🔴 w źródle → `level: "critical"`; niezgodność
  liczby ogniw nie ma tam 🔴 → celowo `level: "warning"`, nie wymyślone. Reszta checklisty
  (narzędzia/PPE/rezystancja/ocena wizualna) — zwykły `ListaChecklist`, wzorzec z A7.
  **Naprawiony w trakcie realny błąd UX** (znaleziony przy weryfikacji w przeglądarce, nie
  domyślony): pole ogniwa zainicjowane na `0` było traktowane jako błąd walidacji ("musi być
  większe od zera") zamiast jako "jeszcze nie wypełnione" — na starcie ekran pokazywał 16
  komunikatów błędu naraz. Naprawione: `0` = niewypełnione → `INCOMPLETE`; tylko wartość ujemna to
  błąd. Zaktualizowano `docs/rejestr-pokrycia.md` (nowa sekcja "Moduł 11" z pełnym rozpisaniem
  A1–A10/B1–B12, nie tylko wierszem w zbiorczej tabeli) i `docs/rejestr-twardych-stopow.md` (2 nowe
  pozycje w kategorii Bateryjne). Zweryfikowane: 9 testów (nominalny/graniczny/błąd/niekompletne),
  `tsc`/`lint`/`pnpm test` 96/96/`pnpm build` czysto, Playwright — cztery stany werdyktu (pusty,
  🔴 brak BMS, 🔴 różnica napięć, 🟢 gotowe) w przeglądarce.

## Decyzje i uzasadnienie (c.d. 19)

- **2026-09-03 — Ekran A3, Moduł 11: "Połączenia elektryczne i kolejność łączenia".**
  Właściciel projektu ustalił termin: **piątek 2026-09-04 20:00 — maksymalna liczba rozdziałów**,
  tempo pracy odpowiednio przyspieszone (mniej narracji, więcej kodu, wpisy do `docs/memory.md`
  zwięźlejsze niż zwykle, bez utraty dyscypliny weryfikacji). A3 to 1:1 logika Procedury Black
  Start (Moduł 7, Ekran 5) — checklist z wymuszoną kolejnością, skopiowany wzorzec
  (`lib/core/modules/montaz-baterii/polaczenia-elektryczne/`, 4 testy, UI:
  `app/kalkulatory/polaczenia-elektryczne/page.tsx`). Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (100/100)/`pnpm build` czysto, Playwright (stan poza kolejnością → 🟡, wszystko po kolei → 🟢).

## Decyzje i uzasadnienie (c.d. 20)

- **2026-09-03 — Ekran A4, Moduł 11: "Podłączenie BMS" — pierwszy prawdziwy Doradca (Wzorzec D)
  w tym module.** Wzór `T = 5 × R_pre × C` (czas pre-charge kondensatorów falownika) liczony
  niezależnie od checklisty — użytkownik potrzebuje tej liczby, zanim wykona krok 3, więc panel
  wyniku jest widoczny od razu, checklist (kolejność jak A3) rządzi tylko werdyktem gotowości.
  50Ω to tylko przykład ze źródła użyty jako sugerowana wartość startowa pola, nie ukryty domyślny
  (rezystor faktycznie użyty musi być świadomie wpisany/potwierdzony przez montera).
  `lib/core/modules/montaz-baterii/podlaczenie-bms/`, 6 testów, UI:
  `app/kalkulatory/podlaczenie-bms/page.tsx`. Dopisano do `docs/rejestr-twardych-stopow.md`
  (kategoria Elektryczne/pożarowe: brak pre-charge → zaiskrzenie i uszkodzenie styków).
  Zweryfikowane: `tsc`/`lint`/`pnpm test` (106/106)/`pnpm build` czysto, Playwright.

## Mapa orientacyjna

- `docs/rejestr-twardych-stopow.md` — zbiorczy indeks warunków zawsze skutkujących 🔴 (04.3), z odsyłaczami do modułu/ekranu/pliku źródłowego. Dopisz tu nowy twardy stop, gdy kolejny moduł go wprowadzi.
- `docs/standards/00-INDEKS.md` — standard wspólny dla rodziny aplikacji (17 rozdziałów), zacznij tu przy pytaniach "jak mamy to robić".
- `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md` — metodologia procesowa (GOD BOOK) — jak prowadzić Biblię projektu; Część Y opisuje relację ze standardem powyżej. `PROMPT_STARTOWY.md` (root) to gotowy tekst startowy sesji wg tej metodologii.
- `docs/lista-do-zrobienia.md` — bieżące zadania, czytaj zaraz po tym pliku na starcie sesji.
- `docs/wklad-do-standardu.md` — tu AI dopisuje z własnej inicjatywy spostrzeżenia warte rozważenia dla całego `new-app-standards` (nigdy nie edytuje repo źródłowego bezpośrednio).
- `ZASADY_APLIKACJI.md` (pełna) / `USTALENIA.md` (skrót) — konstytucja Offgrid, nadrzędna wobec kodu. Pełni rolę "Biblii" tego projektu (GOD BOOK), jeszcze nie zmigrowana do jego kanonicznego nazewnictwa — patrz decyzja wyżej.
- `docs/domena/` — materiały źródłowe Offgrid (Biblia, treść 13 modułów, plik scalony, Zasady UX Doradcy) — przeszukiwać tu zamiast pytać użytkownika o ponowne wysłanie.
- `docs/pulpit-i-nawigacja.md` — decyzja o pulpicie adaptacyjnym (13+1 kafli, kolejność, presety onboardingu) — czytaj przed budową ekranu głównego lub menu wewnątrz modułu.
- `lib/pulpit/registry.ts` — jedyne źródło prawdy o 13 kaflach i ich ekranach; dopisz tu nowy ekran, żeby pojawił się w `/moduly/[id]`.
- `components/kafle-ikony/` — animowane SVG ikony kafli pulpitu (na razie 1–7); dopisz tu kolejny `<symbol>` + wpis w `ikona.tsx`, gdy kolejny kafel zostanie zablokowany jako finalny w artefakcie roboczym "Off-Grid Tile Set".
- `app/`, `components/ui/`, `lib/utils.ts` — obecny szkielet Next.js, bez kodu domenowego.
- `CLAUDE.md` — punkt wejścia dla AI, odsyła tutaj i do standardu.
