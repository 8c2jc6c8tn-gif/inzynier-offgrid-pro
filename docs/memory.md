# docs/memory.md — Inżynier Offgrid Pro

Żywy log decyzji, pułapek i stanu tego konkretnego projektu. Format i zasada aktualizacji: `docs/standards/14-proces-i-pamiec.md` (14.5). Nie duplikuje `ZASADY_APLIKACJI.md`/`USTALENIA.md` (te są konstytucją projektu, nadrzędną wobec kodu) ani `docs/standards/` (te są standardem wspólnym dla całej rodziny aplikacji) — tu trafia to, co specyficzne dla *tego* repo i *tej* historii pracy.

---

## Synchronizacja ze standardem

<!-- Obowiązkowe od GOD BOOK Część Y.6. Sprawdzaj AKTUALIZACJE.md w new-app-standards co ≤7 dni. Brak wpisu = "nigdy nie sprawdzono". -->
- **2026-09-03 — pełna synchronizacja wykonana** (pierwsza, wcześniej nie istniała). Odświeżono `docs/standards/00`–`16` (dodano brakujący rozdział 16), dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, `PROMPT_STARTOWY.md`, `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`. Punktowo poprawiono `CLAUDE.md` i `.claude/skills/standards/SKILL.md` (nowe odsyłacze do GOD BOOK Część Y, bez nadpisania lokalnej treści). Szczegóły niżej, sekcja "Decyzje i uzasadnienie". Świadomie NIE wykonano: migracji `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/` (nazwa sprzed zmiany 2026-09-04, patrz niżej) do kanonicznego formatu GOD BOOK (`00_Biblia.md` itd.) — to osobna, większa decyzja, patrz `docs/lista-do-zrobienia.md`.
- **2026-09-04 — sprawdzono `AKTUALIZACJE.md`, znaleziono i zsynchronizowano 2 nowe wersje (v2.4, v2.5).** Obie dot. GOD BOOK: nowa, obowiązkowa **Y.9** — 9-pozycyjna checklist kompletności do przejścia przy *każdym* sprawdzeniu (nie tylko pierwszej instalacji), jawnie raportowana właścicielowi. `docs/standards/00`–`16` — bez zmian merytorycznych (tylko 2 kosmetyczne odsyłacze do nazwy pliku GOD BOOK w `00-INDEKS.md`/`00-filozofia.md`). Wykonane: podmieniono GOD BOOK w całości (`...v2_3.md` → `...v2_5.md`, stara nazwa usunięta, NIETYKALNE), nadpisano `PROMPT_STARTOWY.md` w całości (NIETYKALNE), punktowo poprawiono odsyłacze do wersji w `docs/standards/00-INDEKS.md`/`00-filozofia.md`/`CLAUDE.md`/`README.md` oraz `.claude/skills/standards/SKILL.md` (dodatkowo: doprecyzowanie punktu 2 o wariant pełnej Biblii, ADAPTOWALNE).
  **Wynik checklisty Y.9 (pokazany właścicielowi projektu przed uznaniem za zakończone):**
  1. `docs/standards/` — ✅ aktualne (odświeżone odsyłacze).
  2. GOD BOOK — ✅ podmienione na v2.5.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` (nie pełna Biblia) — ✅ istnieje; treść nietknięta (LOKALNE). Otwarta decyzja o migracji do kanonicznego formatu GOD BOOK pozostaje nierozstrzygnięta (patrz niżej i `docs/lista-do-zrobienia.md`).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ⚠️ w momencie sprawdzenia formalnie brakowało (folder nazywał się `docs/domena/`) — **rozstrzygnięte tego samego dnia**, patrz wpis niżej "Zmiana nazwy `docs/domena/` → `docs/zrodla/`".
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, spatchowane.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — nie dotyczy (projekt nie prowadzi pełnej Biblii, tylko `docs/memory.md`).
  Zweryfikowano: `grep -rn "v2_3"` w projekcie po synchronizacji trafia wyłącznie w historyczne wpisy tego logu i `docs/lista-do-zrobienia.md` (poprawnie — append-only, nie nadpisuje się historii) oraz w CHANGELOG samego pliku GOD BOOK (odniesienia do własnych, starszych wersji — też poprawne).

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
- **Luka 1.19** (Moduł 2, "Agregat prądotwórczy") — do dopisania jako ekran D przy Etapie 3 treści Modułu 2. Treść źródłowa gotowa w Biblii, patrz `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`.
- ~~Materiały źródłowe Offgrid żyją poza tym repo~~ — **rozstrzygnięte 2026-08-29, patrz wpis niżej.**
- ~~Brak pełnej treści Modułu 1~~ — **rozstrzygnięte 2026-08-29** — pełna treść Modułu 1 (4 ekrany) dotarła i jest w `docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md`.

## Decyzje i uzasadnienie (c.d.)

- **2026-08-29 — Wznowiono Etap 1 (szkielet architektury).** Pauza z `ZASADY_APLIKACJI.md` §14 (2026-08-28) zakończona decyzją autora. Pierwszy moduł domenowy: Rozdział 0+1 (Geostruktura + Bilans obciążeń), zgodnie z pierwotną, zatwierdzoną teraz kolejnością. Zmiana odnotowana w `ZASADY_APLIKACJI.md` §14 i `USTALENIA.md` (jawna korekta, stara notatka zachowana obok nowej, zgodnie z rozdziałem 14.2 standardu).

## Decyzje i uzasadnienie (c.d. 5)

- **2026-08-29 — Materiały źródłowe Offgrid przeniesione do repo (`docs/zrodla/`).** Powód: przy
  kompresji kontekstu długiej sesji AI traci dostęp do wcześniej wklejonej treści plików źródłowych
  (nawet jeśli w podsumowaniu zostaje odnotowane, że "zostały przeczytane") — realny koszt: pytanie
  do autora o ponowne wysłanie tego, co już raz dostarczył. Rozwiązanie: pliki trafiają do repo jako
  kopia 1:1, dostępna dla każdej przyszłej sesji AI bez ponownego wysyłania. Skopiowano komplet:
  wszystkie 13 plików `Tresc_Modul_X_*_Ekrany.md` (moduły 1–13), `Tresc_WSZYSTKIE_MODULY_scalone.md`,
  `Zasady_UX_Doradca_v2_1.md`, `Biblia_Offgrid_v2_0_Architektura_Modulowa.md`. Indeks i zasady
  aktualizacji: `docs/zrodla/README.md`. Zamyka otwartą sprawę z sekcji niżej i lukę "brak treści
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
  0–12" nie pokrywającej się 1:1 z dzisiejszą "Moduł/Kafel 1–13" z `docs/zrodla/` — dopisano
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
  Ogrzewanie") i po weryfikacji ("dawne N.x" w `docs/zrodla/` to bezpośrednio stara numeracja)
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
  **Świadomie NIE wykonane:** migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/zrodla/`/`docs/rejestr-pokrycia.md` do kanonicznego nazewnictwa plików GOD BOOK (`00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `rejestr-decyzji.md`...). Te pliki są kategorii LOKALNE (Y.8 — "sync tego nie dotyka, to własność projektu") i już w praktyce pełnią rolę Biblii tego projektu — restrukturyzacja nazw to osobna, świadoma decyzja projektowa (GOD BOOK Część P/S), nie automatyczny efekt sync'u. Zostaje otwarte w `docs/lista-do-zrobienia.md`.

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
  `docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md`) — użytkownik wybrał tylko A1 z zaproponowanej
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

## Decyzje i uzasadnienie (c.d. 21)

- **2026-09-03 — Ekran A6, Moduł 11: "Demontaż pakietu" — zamyka zaplanowaną czwórkę
  Ścieżki A (A1/A3/A4/A6).** Checklist z wymuszoną kolejnością (jak A3/A4) + warunek wstępny ze
  źródła policzony naprawdę: napięcie ogniwa = napięcie pakietu / S (reużywa
  `OCZEKIWANA_LICZBA_OGNIW` z Ekranu A1, zero duplikacji tej samej stałej domenowej), ostrzeżenie
  krytyczne gdy >3,2V/ogniwo — dokładny próg ze źródła, nic nie wymyślone. `lib/core/modules/
  montaz-baterii/demontaz-pakietu/`, 6 testów, UI: `app/kalkulatory/demontaz-pakietu/page.tsx`.
  Dopisano do `docs/rejestr-twardych-stopow.md`. Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (112/112)/`pnpm build` czysto, Playwright (stan "wciąż naładowany" → 🔴, stan bezpieczny + pełny
  checklist → 🟢).
  **Rozdział "podłączanie baterii" (Moduł 11, Ścieżka A) — 6/10 ekranów gotowych** (A1, A3, A4, A6,
  A7 gotowe wcześniej; A2/A5 świadomie odłożone; A8–A10 i cała Ścieżka B nadal `todo`). Właściciel
  projektu ustalił termin: piątek 2026-09-04 20:00, maksymalna liczba rozdziałów — następny krok
  (kontynuacja Modułu 11 vs. inny moduł) do potwierdzenia na starcie kolejnej rundy pracy.

## Decyzje i uzasadnienie (c.d. 22)

- **2026-09-03 — Ekran A9, Moduł 11: "Ratowanie głęboko rozładowanego ogniwa".** Drugi prawdziwy
  Doradca (Wzorzec D) w tym module — trzy strefy decyzyjne z pomiaru napięcia (0V / (0,1,5V] /
  >1,5V), dokładnie jak w źródle, nic pomiędzy nie wymyślone. **Ważna różnica konstrukcyjna
  względem Ekranu A1:** tu `0` jest prawdziwym, krytycznym wynikiem pomiaru (ogniwo martwe), nie
  placeholderem "jeszcze niewypełnione" jak w A1 — więc `napiecieOgniwaV: number | null` zamiast
  reużycia sztuczki "0 = incomplete". Typ zamknięty `Strefa = "krytyczna"|"ryzykowna"|"bezpieczna"`
  (16.4). Dopisano do `docs/rejestr-twardych-stopow.md`. Złapany przez lint przed commitem: proste
  cudzysłowy w JSX (`react/no-unescaped-entities`) — poprawione na typograficzne „…”.
  `lib/core/modules/montaz-baterii/ratowanie-ogniwa/`, 6 testów, UI:
  `app/kalkulatory/ratowanie-ogniwa/page.tsx`. Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (118/118)/`pnpm build` czysto, Playwright (trzy strefy: 🔴 0V, 🟡 niskie-niezerowe, 🟢 bezpieczne).

## Decyzje i uzasadnienie (c.d. 23)

- **2026-09-03 — Ekran A8, Moduł 11: "Ocena zużycia ogniwa po demontażu" — 7/10 Ścieżki A.**
  Źródło opisuje trzy "pomiary do wykonania" (grubość vs fabryczna, napięcie po 24h, rezystancja
  wewnętrzna) bez podania progów liczbowych dla żadnego z nich — świadomie zamodelowane jako
  checklist procesu (Wzorzec E), nie jako pola z walidacją, żeby nie wymyślać tolerancji, których
  źródło nie podaje. Jedyny realnie decydowalny warunek to ocena wizualna puchnięcia obudowy —
  ten sam wzorzec co pozycja "ocena wizualna" w checklistcie Ekranu A1 (przycisk Tak/Nie zamiast
  liczonego progu grubości, bo źródło opisuje to jako ocenę wzrokową, nie pomiar z tolerancją).
  Puchnięcie wygrywa natychmiast, niezależnie od postępu checklisty. Dopisano do
  `docs/rejestr-twardych-stopow.md`. `lib/core/modules/montaz-baterii/ocena-zuzycia/`, 4 testy,
  UI: `app/kalkulatory/ocena-zuzycia/page.tsx` (pierwsze użycie w tym repo par przycisków
  Tak/Nie stylowanych przez Tailwind `aria-pressed:` zamiast osobnego komponentu — sprawdzone
  w przeglądarce, działa poprawnie). Zweryfikowane: `tsc`/`lint`/`pnpm test` (122/122)/`pnpm build`
  czysto, Playwright (puchnięcie → 🔴 natychmiast, checklist pełny bez puchnięcia → 🟢).

## Decyzje i uzasadnienie (c.d. 24)

- **2026-09-03 — Ekran A10, Moduł 11: "Przechowywanie / recykling / narzędzia diagnostyczne" —
  Ścieżka A LiFePO4 kompletna (8/10, A2/A5 świadomie odłożone).** Wzorzec C, dokładnie ten sam
  kształt co `trasy-kablowe` (Moduł 5) i `czystosc-i-snieg` (Moduł 3): brak kalkulatora, treść
  1:1 ze źródła w trzech niezależnych, uzupełniających się akordeonach (`SekcjaAkordeon`) —
  Przechowywanie / Recykling / Narzędzia diagnostyczne. `lib/core/modules/montaz-baterii/
  przechowywanie-recykling/constants.ts`, UI: `app/kalkulatory/przechowywanie-recykling/page.tsx`.
  Brak nowych testów (ten wzorzec ekranu nigdy ich nie miał — nie ma logiki do przetestowania).
  **Rozważono i świadomie NIE dopisano do `docs/rejestr-twardych-stopow.md`:** źródło opisuje
  rozładowanie pakietu do 0V przed oddaniem do recyklingu (np. przez zanurzenie w słonej wodzie)
  jako "metodę kontrolowaną, wymagającą zrozumienia ryzyka" — realna ostrożność, ale bez żadnego
  werdyktu 🔴/logiki na tym ekranie (ekran nie ma kalkulatora), więc nie pasuje do zakresu
  rejestru (który indeksuje warunki *sprawdzane w kodzie*, nie każdą ostrożną uwagę w treści).
  Zweryfikowane: `tsc`/`lint`/`pnpm test` (122/122, bez zmian — brak nowej logiki)/`pnpm build`
  czysto, Playwright (wszystkie 3 akordeony rozwijają się poprawnie, treść zgodna ze źródłem).

## Decyzje i uzasadnienie (c.d. 25)

- **2026-09-03 — Ścieżka B (kwasowo-ołowiowa), Moduł 11: 11/12 ekranów w jednym przejściu, po
  zamknięciu Ścieżki A.** Pełny tekst źródłowy B1–B12 przeczytany naraz
  (`docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md`, linie 145–282), co pozwoliło zaprojektować
  wszystkie ekrany od razu zamiast pojedynczo — bez zmiany rygoru weryfikacji (każdy ekran ma swój
  wpis w `docs/rejestr-pokrycia.md`, testy tam gdzie jest logika domenowa, jeden wspólny PR).
  - **B1/B3/B6/B8** — checklisty bez wymuszonej kolejności, dokładny klon wzorca A1/A7 (`ChecklistItem`
    z opcjonalnym `uwaga`, `calculate*` liczy tylko `potwierdzone/razem`).
  - **B2/B7** — B2 to ten sam wzorzec co B1 (twardy stop wentylacji dopisany jako `OSTRZEZENIA_STALE`,
    nie osobna gałąź logiki — checklist i tak wymaga 100% przed VALID). B7 to checklist z wymuszoną
    kolejnością, klon A3/A6.
  - **B4 (Balansery zewnętrzne)** — źródło nie podaje explicit progu liczbowego, ale sekcja B
    jednoznacznie mówi "balanser wymagany przy akumulatorach w szeregu" — próg `≥2` wyprowadzony
    wprost z definicji "szeregu" (1 akumulator = brak szeregu = brak ryzyka rozjazdu), nie
    wymyślony. 5 testów, dopisany do `docs/rejestr-twardych-stopow.md`.
  - **B5 (Dobór kabli) — świadomie NIE zbudowany.** Źródło: "ten sam silnik co Moduł 5, Ekran 1 —
    inne wartości wejściowe." Ale Moduł 5 Ekran 1 (dobór przekroju kabla) nie istnieje jeszcze w
    kodzie (Moduł 5 ma tylko Ekran 19 — trasy kablowe). Budowa tymczasowego, równoległego silnika
    wymagałaby wymyślenia tabel obciążalności/AIC nieobecnych w dostępnym materiale źródłowym dla
    B5 samodzielnie — złamałoby to zasadę "nie wymyślaj brakujących norm" (CLAUDE.md). Zamiast
    tego: flagowane jako `⚠️ blocked` w `docs/rejestr-pokrycia.md` i `docs/rejestr-twardych-stopow.md`
    ("Znane luki"), czeka na Moduł 5 Ekran 1, który B5 powinien wtedy re-używać (wzorzec "echo").
  - **B9 (Gęstość elektrolitu)** — trzy strefy z tabeli referencyjnej źródła (1,28=pełny/1,20=
    połowa/1,12=rozładowany); granice stref = same podane wartości (ten sam wzorzec co pojedynczy
    próg 1,5V w A9), żadna wartość pośrednia nie została wymyślona. Przykład źródła (gęstość
    1,15 g/cm³ → "naładowany w ok. 35%, wymagane doładowanie") odtworzony w teście jako
    `stan: "rozladowany"` — celowo NIE zaimplementowano interpolacji liniowej do wyliczania
    dokładnego %, żeby nie ryzykować wymyślenia formuły, której źródło nie podaje wprost; ekran
    pokazuje strefę i cytuje przykład jako opis, nie liczy %.
  - **B10 (Ocena zasiarczenia) — świadome odstępstwo od wzorca checklisty procesu.** W
    odróżnieniu od A7/B1/B6/B8 (gdzie "niezaznaczone" = "jeszcze nie sprawdzone"), tu każda
    pozycja to obserwowalny objaw — "niezaznaczone" realnie znaczy "nieobserwowany". Dlatego
    kalkulator ma pełną logikę werdyktu (≥1 objaw → ostrzeżenie z odesłaniem do B11), czego A8
    świadomie unikał dla swoich 2 pomiarów bez progu (tam wybór był między "brak progu" a
    "wymyślony próg"; tu wyboru nie trzeba było robić, bo semantyka pola jest inna).
  - **B11 (Ratowanie zasiarczenia) — zmiana etykiety z "Wzorzec D" na treść (Wzorzec C).**
    Pierwotny wpis w `docs/rejestr-pokrycia.md` (sprzed tej sesji) oznaczał B11 jako Wzorzec D,
    ale źródło nie daje żadnej gałęzi decyzyjnej ani progu — jedno stałe zalecenie (tryb
    "Repair"/"Desulfation" ładowarki). Zbudowany jako czysta treść, jawnie odnotowane jako
    odstępstwo od pierwotnej etykiety w `docs/rejestr-pokrycia.md`, nie ciche przemilczenie.
  - **B12 (Przechowywanie/recykling)** — ten sam wzorzec co A10, ale z ważną różnicą: oba twarde
    fakty (mróz, zakaz wylewania kwasu) SĄ oznaczone 🔴 w źródle (w odróżnieniu od A10, gdzie
    ostrożność przy słonej wodzie nie miała takiego oznaczenia) — dlatego, inaczej niż przy A10,
    tu oba fakty DOPISANO do `docs/rejestr-twardych-stopow.md`, mimo że ekran nie ma kalkulatora
    (rejestr indeksuje fakty oznaczone 🔴 w źródle, nie tylko warunki gated przez żywą logikę —
    potwierdzone precedensem `moment-dokrecania-srub`/`OSTRZEZENIA_STALE`).
  - Zweryfikowane razem: `tsc`/`lint` czysto, `pnpm test` 137/137 (15 nowych, w B4/B9/B10),
    `pnpm build` czysto (11 nowych tras), Playwright na 3 reprezentatywnych ekranach (B4 werdykt
    krytyczny→ok po zaznaczeniu balansera, B9 strefa "rozładowany" dokładnie wg przykładu źródła,
    B10 checklist objawów z ostrzeżeniem). **Moduł 11 razem: 19/22 (Ścieżka A 8/10, Ścieżka B
    11/12, B5 blocked, A2/A5 odłożone).**

## Decyzje i uzasadnienie (c.d. 26)

- **2026-09-03 — Moduł 5 Ekran 1 sprawdzony i odrzucony jako następny krok (blocked, nie
  zbudowany) — konsekwentne z decyzją B5.** Po zamknięciu Ścieżki B (PR #20), naturalnym
  następnym krokiem wydawało się zbudowanie Moduł 5 Ekran 1 (dobór przekroju kabla), bo
  odblokowałoby to zawieszony Ekran B5. Po przeczytaniu pełnego źródła (`docs/zrodla/
  Tresc_Modul_5_Okablowanie_Ekrany.md`, linie 9–52) okazało się, że silnik wymaga tabeli
  normatywnej PN-IEC 60364-5-52 (obciążalność bazowa kabla wg przekroju/materiału) oraz pełnych
  tabel współczynników korekcyjnych (temperatura, liczba kabli w wiązce, sposób ułożenia) — źródło
  podaje tylko PO JEDNEJ przykładowej wartości na współczynnik (k1=0,87 dla 40°C, k2=0,70 dla 4
  kabli), nie kompletne tabele. Budowa silnika bez tych danych oznaczałaby wymyślenie norm
  bezpieczeństwa elektrycznego — złamałoby to najbardziej podstawowy zakaz z CLAUDE.md. **Decyzja:
  nie budować.** Oba ekrany (M5/E1 i B5) zostają `⚠️ blocked` w `docs/rejestr-pokrycia.md` i
  `docs/rejestr-twardych-stopow.md`, czekając na dostarczenie pełnej tabeli normatywnej przez
  właściciela projektu — to nie jest "zabrakło czasu", to świadome zatrzymanie się przed granicą
  wymyślania danych inżynierskich.
- **2026-09-03 — Ekran 4, Moduł 2: "Liczba domowników" (Wzorzec D-lite) zaimplementowany
  zamiast tego.** Wybrany jako następny krok po odrzuceniu M5/E1 — jedyny ekran w kolejce
  `docs/rejestr-pokrycia.md` (Moduł 2) ze standalone, kompletnym wzorem źródłowym niezależnym od
  jeszcze niezbudowanych ekranów. Źródło: suwak 1–6 osób, zasilający docelowo C.W.U. (Ekran 2),
  częstotliwość prania/gotowania (Ekran 3) i profil zużycia wody (Moduł 10) — żaden z tych trzech
  ekranów jeszcze nie istnieje, więc zaimplementowano tylko jedyny fragment z gotowym wzorem
  niezależnym od nich: dobowe zapotrzebowanie C.W.U. = liczba domowników × 50–70 l (zakres 1:1 ze
  źródła). `lib/core/modules/zapotrzebowanie/liczba-domownikow/`, 5 testów, UI: `app/kalkulatory/
  liczba-domownikow/page.tsx`. Zweryfikowane: `tsc`/`lint`/`pnpm test` (142/142)/`pnpm build`
  czysto, Playwright (4 domowników → 200–280 l/dobę, zgodne z ręcznym przeliczeniem).

## Decyzje i uzasadnienie (c.d. 27)

- **2026-09-03 — Rysunki/schematy dodane do ekranów montażu baterii, na wyraźną prośbę autora.**
  Autor zauważył trafnie: "w elektryce bez rysunków nie ma opcji — połączenie akumulatorów musi
  być narysowane i krok po kroku prowadzone." Dotąd wszystkie ekrany Modułu 11 opisujące fizyczne
  łączenie/rozłączanie akumulatorów (A3, A4, A6, B3, B4, B7) miały tylko tekst kroków checklisty
  — realna luka, nie świadome pominięcie. Naprawione dodaniem inline'owych ilustracji SVG,
  **konsekwentnie w tym samym wzorcu, co już istniejący precedens** — Wzorzec F z Ekranu 19
  Modułu 5 (`trasy-kablowe`, lokalna funkcja komponentu w `page.tsx`, nie osobny współdzielony
  komponent — świadomie, żeby uniknąć przedwczesnej abstrakcji przy zaledwie 6 użyciach o różnej
  treści). Zakres:
  - **A3** (Połączenia elektryczne LiFePO4) — schemat 4 ogniw w szeregu z ponumerowaną
    kolejnością łączenia (1→2→3, minus do plusa następnego).
  - **A4** (Podłączenie BMS) — schemat Pakiet→BMS→Falownik z trzema oznaczonymi połączeniami:
    wtyczka balansująca (1), B− do minusa pakietu (2), P− przez rezystor pre-charge (3, symbol
    zygzaka), plus główny plus prowadzony bezpośrednio z pominięciem BMS.
  - **A6** (Demontaż pakietu) — ten sam układ co A3, ale zamiast pełnej numeracji 1-2-3 tylko
    znacznik "Zacznij tu (Pakiet +)" przy końcu o najwyższym potencjale — świadomie NIE
    wymyślono precyzyjnej kolejności rozpinania każdego z 3 wewnętrznych połączeń, bo źródło
    podaje tylko ogólną zasadę ("od końca o najwyższym potencjale"), nie pełny algorytm dla
    N ogniw.
  - **B3** (Połączenia kwasowe) — dwa panele: szeregowo (wyższe napięcie, 12+12=24V) i
    równolegle (większa pojemność, plusy razem/minusy razem) — bezpośrednio z treści źródła
    ("szeregowo dla napięcia, równolegle dla pojemności").
  - **B4** (Balansery zewnętrzne) — schemat balansera podłączonego równolegle do KAŻDEGO
    akumulatora, z podpisem wprost mówiącym "powtórz dla wszystkich, nie tylko dla dwóch
    pokazanych" (żeby 2-akumulatorowy przykład nie sugerował fałszywie, że dotyczy tylko pary).
  - **B7** (Demontaż kwasowy) — schemat z 3 ponumerowanymi krokami: 1 minus systemowy, 2 plus
    systemowy, 3 szereg wewnętrzny (z tą samą zasadą "od najwyższego potencjału" co A6).
  - **Pułapka znaleziona i naprawiona podczas budowy:** tekst wyśrodkowany (`textAnchor="middle"`)
    blisko krawędzi `viewBox` (np. etykieta "Do systemu (+)" wyśrodkowana na x=20 w SVG
    zaczynającym się od x=0) wychodzi poza `viewBox` i zostaje **obcięty** (domyślne
    `overflow:hidden` korzenia `<svg>`) — złapane dopiero na zrzutach ekranu Playwright w B3 i
    B7, nie na `tsc`/`lint` (błąd czysto wizualny, niewidoczny statycznie). Naprawione zmianą
    `textAnchor` na `start`/`end` przy etykietach blisko krawędzi, oraz przeprojektowaniem B3 na
    pełną szerokość `viewBox` (400→440, x wyśrodkowane na 220 zamiast 120). **Wniosek na
    przyszłość: każdą nową ilustrację SVG z etykietami blisko krawędzi zrzutować w Playwright
    przed commitem — `tsc`/`lint`/`pnpm test` tego nie złapią.**
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 142/142 (bez zmian — ilustracje czysto
    prezentacyjne, brak nowej logiki domenowej), `pnpm build` czysto, Playwright na wszystkich
    6 ekranach (w tym dwie iteracje na B3/B7 po znalezieniu i naprawieniu obcięcia tekstu).

## Decyzje i uzasadnienie (c.d. 28)

- **2026-09-04 — Zmiana nazwy `docs/domena/` → `docs/zrodla/`, decyzja właściciela projektu.**
  Rozstrzyga pozycję 7 checklisty Y.9 (patrz sekcja "Synchronizacja ze standardem" wyżej) i
  otwartą sprawę z `docs/lista-do-zrobienia.md` (wpis 2026-09-03): `docs/domena/` pełnił dokładnie
  rolę `docs/zrodla/` z GOD BOOK Część B.5 (materiały źródłowe 1:1, nietknięte) od początku, tylko
  pod inną, projektową nazwą sprzed adopcji standardu. Właściciel projektu zdecydował: ujednolicić
  nazewnictwo, nie zostawiać równoległej nazwy.
  **Wykonane:** `git mv docs/domena docs/zrodla`; wszystkie odwołania do ścieżki (79 plików —
  `docs/*.md`, `ZASADY_APLIKACJI.md`, `README.md`, komentarze nagłówkowe w ~70 plikach
  `lib/core/modules/**/*.ts` cytujących źródło, `app/kalkulatory/tryb-live/page.tsx`)
  zaktualizowane automatycznie (`sed`, sama ścieżka, zero zmian w treści merytorycznej plików).
  `docs/zrodla/README.md` dostał notatkę o zmianie nazwy na górze. **Świadomie naprawiona jedna
  usterka po automatycznej podmianie:** historyczny wpis w tym pliku z 2026-09-03 (opisujący co
  wtedy NIE zrobiono) też został omyłkowo podmieniony przez `sed` na nową nazwę — cofnięte ręcznie
  do `docs/domena/` z dopiskiem, bo to log append-only i ma opisywać stan **z tamtej daty**, nie
  bieżący (Zasada integralności informacji, `docs/standards/15`). Zweryfikowane: `tsc`/`lint`/
  `pnpm test` (142/142, bez zmian — tylko ścieżki w komentarzach)/`pnpm build` czysto,
  `grep -rn "docs/domena"` w projekcie po zmianie — pusty wynik.

## Decyzje i uzasadnienie (c.d. 29)

- **2026-09-04 — Ekran 1, Moduł 4 (Baterie): "Dobór pojemności baterii" — pierwszy ekran tego
  modułu poza wzorcami reprezentatywnymi B/D/E, na wyraźną prośbę autora o dwukrotne sprawdzanie
  wszystkich obliczeń.** Wybrany jako następny krok: fundament doboru magazynu energii (pojemność
  użyteczna), formuła w pełni podana w źródle, bez brakujących norm zewnętrznych (w odróżnieniu od
  zablokowanego Modułu 5 Ekranu 1).
  - **Wzór 1:1 ze źródła** (Sekcja B): `C_uzyteczna = (E_dobowe × d_autonomii) / (η_falownika × DoD)`.
  - **Podwójna weryfikacja przed napisaniem kodu** (nowa dyscyplina na prośbę autora): przykład
    źródła (Sekcja C: "12 kWh/dobę, 3 dni autonomii → 45 kWh użytecznej") policzony niezależnie w
    Pythonie DWOMA metodami — arytmetyką zmiennoprzecinkową i dokładnym ułamkiem (`Fraction`) —
    zanim powstał jakikolwiek kod kalkulatora. **Znaleziona i udokumentowana rozbieżność w samym
    źródle:** przykład w Sekcji C odtwarza się dokładnie tylko przy sprawności falownika = 100%,
    NIE przy 95% wskazanej jako "domyślnie 95%, edytowalne" w Sekcji A tego samego ekranu (95% →
    47,368421 kWh, nie 45). Rozstrzygnięcie: wzór wdrożony dokładnie jak podany w Sekcji B
    (autorytatywne "Silnik oceny"), rozbieżność w ilustracyjnym przykładzie Sekcji C udokumentowana
    w kodzie (komentarz w `calculator.ts`) i tutaj — **nie cicho "poprawiona"**, zgodnie z zasadą
    integralności informacji (nie rozstrzygaj sam, pokaż A/B). Oba warianty (η=100%→45 kWh,
    η=95%→47,4 kWh) zweryfikowane też w przeglądarce (Playwright) — wynik UI zgodny co do jednego
    miejsca po przecinku z obiema niezależnymi metodami obliczeniowymi.
  - Bufor starzeniowy (Ekran 6, "np. +20% na 10 lat") świadomie NIE doliczony — Ekran 6 jeszcze
    nie istnieje w kodzie, doliczenie teraz wymagałoby zbudowania jego logiki przy okazji.
  - `lib/core/modules/baterie/dobor-pojemnosci/`, 7 testów (w tym dwa niezależnie zweryfikowane
    przypadki liczbowe + graniczny + 3 błędne/niekompletne dane), UI: `app/kalkulatory/
    dobor-pojemnosci-baterii/page.tsx`. Dopisane pierwsze pełne wyliczenie per-funkcja Modułu 4
    (34 ekrany) do `docs/rejestr-pokrycia.md` — wcześniej moduł miał tylko 3 rozproszone wpisy w
    tabeli wzorców reprezentatywnych.
  - **Zidentyfikowany dobry następny krok:** Ekran 7 (Obwód Pre-Charge, Moduł 4) powinien
    re-używać logikę już zbudowaną w M11/A4 (`podlaczenie-bms`, wzór `T = 5×R×C`), nie duplikować
    jej — wzorzec "echo" (`docs/standards/01-architektura.md`). Odnotowane w `docs/rejestr-pokrycia.md`.
  - Zweryfikowane: `tsc`/`lint` czysto (1 błąd `react/no-unescaped-entities` znaleziony i
    naprawiony — proste cudzysłowy wokół "użyteczna" zamienione na typograficzne „…", ten sam
    wzorzec błędu co wcześniej w A9), `pnpm test` 149/149 (7 nowych), `pnpm build` czysto,
    Playwright na obu wariantach liczbowych.

## Decyzje i uzasadnienie (c.d. 30)

- **2026-09-04 — Ekran 7, Moduł 4: "Obwód Pre-Charge" — pierwszy praktyczny przypadek
  zastosowania wzorca "echo" (`docs/standards/01-architektura.md`, 1.3) w tym repo.** Źródło tego
  ekranu opisuje dokładnie ten sam fakt fizyczny (`T = 5×R×C`, przykład 50Ω/50W, to samo
  ostrzeżenie 🔴) co Ekran A4 Modułu 11 (`podlaczenie-bms`), zbudowany wcześniej w tej sesji —
  klasyczny przypadek organicznego duplikatu treści między modułami (Moduł 4 = ogólna wiedza
  elektryczna, Moduł 11 = ta sama wiedza w kontekście procedury montażu), dokładnie ten wzorzec,
  o którym mówi rozdział 14 standardu.
  - **Refaktor, nie duplikat:** wydzielono czystą funkcję `obliczCzasPreChargeS(R, C)` do
    `lib/core/modules/baterie/obwod-precharge/calculator.ts` jako kanoniczne źródło wzoru.
    `podlaczenie-bms/calculator.ts` (M11/A4) zrefaktoryzowany, żeby ją importować i wywoływać,
    zamiast liczyć inline — **własna walidacja/statusy M11/A4 zostały nietknięte** (ten ekran
    traktuje `pojemność=0` jako `INVALID_INPUT`, nowy Ekran 7 jako `INCOMPLETE` — świadomie różne
    konwencje dwóch różnych ekranów, więc re-użyty został tylko sam wzór liczbowy, nie cały
    wrapper `CalcResult`).
  - **Weryfikacja poprawności refaktoru:** istniejący plik testowy M11/A4 (6 testów, sprzed tej
    sesji) uruchomiony BEZ ŻADNEJ zmiany w swojej treści — przeszedł w całości, potwierdzając że
    refaktor nie zmienił zachowania. Dodatkowo zweryfikowane w przeglądarce: oba ekrany dla tych
    samych danych (R=50Ω, C=2200µF) pokazują identyczny wynik 0,55 s.
  - **Podwójna weryfikacja wzoru przed napisaniem kodu** (kontynuacja dyscypliny z Ekranu 1):
    R=50Ω/C=2200µF→0,55s i R=50Ω/C=10000µF→2,5s przeliczone niezależnie w Pythonie przed
    implementacją; dodatkowo sprawdzone przeliczenie odwrotne — przykład źródła "R=50Ω/50W,
    T≈3s" odpowiada pojemności ok. 12000µF (realistyczna wartość dla większego falownika, nie
    sprzeczność).
  - `lib/core/modules/baterie/obwod-precharge/`, 8 testów (w tym test na samej czystej funkcji
    `obliczCzasPreChargeS`, osobno od testów na pełnym `CalcResult`), UI: `app/kalkulatory/
    obwod-precharge/page.tsx`. Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 157/157 (8 nowych
    + 6 istniejących M11/A4 bez zmian), `pnpm build` czysto, `lib/core/` nadal nie importuje z
    `app/`/`components/`, Playwright na obu ekranach.

## Decyzje i uzasadnienie (c.d. 31)

- **2026-09-04 — Ekran 12, Moduł 4: "Ograniczenie prądu ładowania w mrozie (Cold C-Rate)" —
  pierwszy przypadek prawdziwej luki wewnątrz tabeli tego samego ekranu (nie brakującej normy
  zewnętrznej jak M5/E1, tylko brakującego wiersza we własnej tabeli źródła).** Tabela limitów
  C-rate (Sekcja B) ma 4 wiersze: `<-10°C` (blokada), `-10 do 0°C` (0,1C), `0 do 5°C` (0,2C),
  `>10°C` (pełny prąd) — zakres **5–10°C nie jest zdefiniowany żadnym wierszem**.
  - **Znalezione i zweryfikowane dwukrotnie przed napisaniem kodu:** ręczny odczyt tabeli źródła +
    niezależny skrypt Pythona potwierdzający brak pokrycia tego przedziału przez którykolwiek z 4
    warunków (`t < -10`, `t < 0`, `t < 5`, `t <= 10` z resztą jako "pełny") — bez piątej,
    specjalnej gałęzi ten zakres wpadłby milcząco w błędną klasyfikację.
  - **Rozstrzygnięcie:** piąta strefa `luka-zrodla`, status `OUT_OF_SCOPE` (pierwsze użycie tego
    statusu w tym repo — istniał w typie `Status` od początku, nieużywany dotąd), z jawnym
    komunikatem o luce zamiast interpolowanej/zgadywanej wartości pośredniej między 0,2C a "pełny
    prąd". Świadomie usunięta z pierwszej wersji komunikatu sugestia "użyj 0,2C jako bezpieczniejszej
    granicy" — to też byłaby wymyślona rekomendacja bezpieczeństwa, nie stwierdzenie ze źródła.
  - **"Pełny prąd" (>10°C) też bez wymyślonego maksimum:** źródło nie podaje konkretnej liczby
    C-rate dla tej strefy (tylko słowo "pełny"), więc `maxPradA` zostaje `null`, nie np. "1C" —
    `assumptions` jawnie mówi "brak ograniczenia od strony temperatury", nie podaje liczby.
  - **Nowy twardy stop dopisany do rejestru:** ładowanie poniżej -10°C — całkowita blokada w
    źródle, trwałe uszkodzenie ogniw (osadzanie litu metalicznego).
  - Przykład źródła (-5°C, 280Ah → 28A, strefa 0,1C) zweryfikowany niezależnie w Pythonie przed
    implementacją i odtworzony dokładnie w teście oraz w przeglądarce. Wszystkie 4 realne strefy +
    luka zweryfikowane wizualnie (Playwright, 4 zrzuty ekranu).
  - `lib/core/modules/baterie/cold-c-rate/`, 11 testów (w tym testy dokładnie na granicach każdej
    strefy — `-10`, `0`, `4.9`, `5`, `10`, `10.1`, wszystkie przeliczone niezależnie w Pythonie
    przed napisaniem testów), UI: `app/kalkulatory/cold-c-rate/page.tsx`. Zweryfikowane: `tsc`/
    `lint` czysto, `pnpm test` 168/168 (11 nowych), `pnpm build` czysto, `lib/core/` nadal nie
    importuje z `app/`/`components/`.

## Decyzje i uzasadnienie (c.d. 32)

- **2026-09-04 — Ekran 15, Moduł 4: "Cold Cranking Amps" — rozbieżność między listą pól Sekcji
  A a wzorem Sekcji B tego samego ekranu, rozwiązana transparentnie, nie ukryta.** Wzór
  `V_sag = V_oc − I_rozruch × R_wewn` wymaga napięcia pakietu bez obciążenia (V_oc), ale Sekcja A
  źródła wymienia jako pola wejściowe tylko "temperaturę ogniw, prąd rozruchowy odbiornika,
  rezystancję wewnętrzną ogniw, min. napięcie pracy falownika" — bez V_oc. Bez tej wartości wzoru
  nie da się w ogóle policzyć. Rozstrzygnięcie: V_oc dodany jako pole wejściowe, bo to realna,
  mierzalna wielkość (napięcie pakietu odczytane bez obciążenia), nie wymyślony współczynnik czy
  norma — różni się jakościowo od przypadków blokady (M5/E1, Ekran 2 Moduł 4), gdzie brakowało
  całych tabel norm, nie pojedynczej mierzalnej wartości. Notatka o tej rozbieżności zostawiona
  w kodzie (`input.ts`) i tutaj, zamiast cichego dopisania bez śladu.
  - **Temperatura ogniw** (też wymieniona w Sekcji A) świadomie NIE stała się osobnym polem
    obliczeniowym — nie wchodzi do wzoru wprost, tylko pośrednio wpływa na już zmierzoną
    rezystancję wewnętrzną (user mierzy R_wewn w bieżącej, zimnej temperaturze). Dodanie martwego
    pola bez wpływu na wynik byłoby niepotrzebną abstrakcją.
  - Przykład źródła (Sekcja C: "-20°C ... 40,5V") ma opisowy charakter bez pełnego kompletu liczb
    wejściowych (I_rozruch, R_wewn, V_oc nie podane) — nie do odtworzenia 1:1 jak w innych
    ekranach. Zamiast tego zbudowano własny, samodzielnie spójny przykład testowy (V_oc=51,2V,
    I=800A, R=13mΩ → 40,8V, bardzo blisko 40,5V źródła) i **zweryfikowano niezależnie w Pythonie
    przed napisaniem kodu**, jawnie oznaczony w teście jako "ilustracyjny", nie "odtwarza
    dokładnie przykład źródła".
  - `lib/core/modules/baterie/cold-cranking-amps/`, 5 testów (w tym przypadek graniczny —
    V_sag dokładnie równe V_min, próg włącznie policzony przez odwrócenie wzoru: I potrzebne do
    V_sag=44V przy V_oc=51,2V, R=13mΩ → 553,846...A, też zweryfikowane w Pythonie), UI:
    `app/kalkulatory/cold-cranking-amps/page.tsx`.
  - **Sprawdzono też Ekran 2 (Sugestia napięcia systemowego) jako kandydata — okazał się tylko
    częściowo zablokowany, nie w całości** (poprawka własnego pierwszego wrażenia po dokładniejszym
    czytaniu): rekomendacja napięcia (>3000W→48V, <1000W→12V) jest obliczalna wprost, ale zakres
    1000–3000W to kolejna luka w tabeli źródła (jak Ekran 12), a porównanie przekrojów kabli
    wymaga tej samej brakującej tabeli PN-IEC 60364-5-52 co M5/E1 i B5. Nie budowany teraz — wymaga
    decyzji o zakresie (okrojona wersja bez kabli, czy czekać na dane), patrz
    `docs/lista-do-zrobienia.md`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 173/173 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright na obu stanach (falownik
    się wyłączy / falownik wytrzyma), wartości zgodne co do dziesiątych z niezależnym przeliczeniem.

## Decyzje i uzasadnienie (c.d. 33)

- **2026-09-04 — Ekran 6, Moduł 4: "Starzenie i degradacja ogniw" — domyka bufor starzeniowy
  zapowiedziany, ale świadomie pominięty w Ekranie 1.** Model liniowy 1:1 ze źródła:
  `C_początkowa = C_dziś / (1 − r_degradacji × lata)`.
  - **Podwójna weryfikacja przed napisaniem kodu:** źródło mówi "LiFePO4 traci ok. 2-3% rocznie →
    po 10 latach ok. 80% pojemności" — sprawdzone w Pythonie, że 80% po 10 latach modelem liniowym
    odpowiada dokładnie stawce 2%/rok (dolna granica podanego zakresu 2-3%, nie środek), nie
    stawce kompoundowanej. Przykład Sekcji C (45 kWh dziś → "56 kWh za 10 lat") przeliczony
    niezależnie: 45 / (1 − 0,02×10) = 45/0,8 = 56,25 — zgodne z zaokrągleniem źródła do 56.
  - **Świadomie NIE doliczony ostatni krok przykładu źródła** ("zamów akumulator o pojemności
    60 kWh" — zaokrąglenie w górę do dostępnego rozmiaru komercyjnego). Źródło nie podaje siatki
    dostępnych pojemności produktów (60 kWh to jeden przykład, nie reguła), więc doliczenie tego
    kroku wymagałoby wymyślenia nieistniejącej normy handlowej. Kalkulator zwraca dokładną liczbę
    (56,25 kWh, wyświetlaną jako 56,3 kWh), z `assumption` jawnie tłumaczącym, że w praktyce
    zaokrągla się w górę do realnego produktu.
  - **Nowa, jawnie odnotowana luka integracyjna:** Ekran 1 (Dobór pojemności baterii) i Ekran 6
    liczą pokrewne wielkości, ale nie są ze sobą spięte — oba mają dziś niezależne pole ręcznego
    wpisu "pojemność użyteczna". Prawdziwa integracja (Ekran 1 → auto-wypełnia Ekran 6 → wynik
    Ekranu 6 wraca jako rekomendacja zakupu) wymaga wspólnego stanu wejściowego między ekranami,
    którego ten projekt jeszcze nie ma (koncepcja "Mój sprzęt"/profil wejściowy ze standardu,
    §13 wzorców z wcześniejszej fazy planowania) — nie budowane teraz, odnotowane w
    `docs/lista-do-zrobienia.md` jako osobny krok, nie cicho pominięte.
  - `lib/core/modules/baterie/starzenie-degradacja/`, 6 testów (w tym test na granicy modelu
    liniowego — `degradacja × lata >= 100%` → `INVALID_INPUT`, bo model liniowy fizycznie się
    załamuje poza tym zakresem), UI: `app/kalkulatory/starzenie-degradacja/page.tsx` (suwak 5/10/15
    lat ze źródła jako `PoleSelect`, nie dowolna liczba).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 179/179 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (56,3 kWh / 80% pozostałej
    pojemności, zgodne z niezależnym przeliczeniem).

## Decyzje i uzasadnienie (c.d. 34)

- **2026-09-04 — Ekran 22, Moduł 4: "Pobór własny BMS i tryb uśpienia" — najprostszy wzór z
  całej serii tego dnia, dwuwarstwowy przykład źródła zweryfikowany w całości.** Wzór
  `E_roczna = P_pobór × 24 × 365 / 1000` (kWh).
  - Przykład źródła ma dwie osobne liczby do sprawdzenia: "7W ciągle = 61 kWh rocznie" (7×24×365/
    1000 = 61,32, zgodne z zaokrągleniem źródła) i "deep sleep → 0,024 kWh/dobę" — ta druga liczba
    odtwarza się dokładnie tylko przy poborze uśpienia = 1W, górnej granicy podanego zakresu
    0,5-1W (1×24/1000=0,024), nie przy dolnej granicy ani środku zakresu. Oba przeliczone
    niezależnie w Pythonie przed implementacją.
  - Kalkulator zwraca też wielkości niewymienione wprost w przykładzie źródła, ale wynikające z
    tego samego wzoru wprost (roczna strata w uśpieniu, oszczędność roczna ciągłe-vs-uśpienie) —
    nie nowa logika, tylko ten sam wzór zastosowany do drugiego zestawu danych wejściowych.
  - `lib/core/modules/baterie/pobor-wlasny-bms/`, 5 testów, UI: `app/kalkulatory/
    pobor-wlasny-bms/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 184/184 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (61,32 kWh i 0,024 kWh/dobę,
    zgodne z niezależnym przeliczeniem co do dwóch miejsc po przecinku).

## Decyzje i uzasadnienie (c.d. 35)

- **2026-09-04 — Ekran 28, Moduł 4: "Kalibracja i dokładność SoC" — najprostszy ekran serii,
  jeden próg czasowy, bez formuły numerycznej do zweryfikowania.** Źródło: coulomb counting w
  BMS kumuluje błąd bez okresowego pełnego naładowania, "po ok. 2 tygodniach" (14 dni)
  rekomendowana kalibracja. Przykład Sekcji C ("rozjechał się o 12%") jest czystą ilustracją —
  źródło nie podaje wzoru wiążącego czas bez ładowania z wielkością błędu SoC, więc świadomie NIE
  liczony (wymyślenie takiej zależności byłoby złamaniem zasady "nie wymyślaj brakujących
  danych"). Kalkulator sprawdza wyłącznie jeden, jawnie podany próg: `dni >= 14`.
  - `lib/core/modules/baterie/kalibracja-soc/`, 6 testów (w tym granica dokładnie przy 14 dniach
    i 0 dni jako prawidłowa wartość — "dziś było pełne ładowanie" — nie placeholder), UI:
    `app/kalkulatory/kalibracja-soc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 190/190 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (20 dni → rekomendacja
    kalibracji, zgodnie z progiem >=14).

## Decyzje i uzasadnienie (c.d. 36)

- **2026-09-04 — Ekran 16, Moduł 4: "Tryb Long Term Storage (odstawienie na zimę)" — pierwszy
  ekran serii łączący dwie realne kontrole liczbowe z checklistą procedury (Wzorzec D z
  elementem E, jak M11/A4, ale bez wymuszonej kolejności checklisty).** Dwa progi ze źródła:
  SoC docelowy przed odstawieniem powinien mieścić się w 50–60% (nie przesuszona, nie przelana),
  temperatura miejsca przechowywania nie powinna spadać poniżej -20°C. Plus dwuelementowy
  checklist procedury (odłączenie od falownika/obciążeń, uśpienie BMS) — w odróżnieniu od M11/A4
  (pre-charge) źródło nie opisuje tu wymuszonej sekwencji kroków, więc checklist jest
  nieuporządkowany (zwykły `Set`, nie porównanie z kolejnością tablicy).
  - Status łączony wg precedensu z `podlaczenie-bms`: `VALID` gdy oba progi liczbowe spełnione
    ORAZ checklist w komplecie; `VALID_WITH_WARNINGS` gdy jest co najmniej jedno realne
    ostrzeżenie (SoC poza zakresem lub temperatura za niska); `INCOMPLETE` gdy pola liczbowe
    jeszcze nie wpisane ALBO gdy oba progi są w porządku, ale checklist nie w komplecie (ten
    drugi przypadek celowo nie generuje ostrzeżenia — czysta niekompletność kroków, nie błąd
    fizyczny).
  - **Sprawdzona i rozstrzygnięta flaga z rejestru pokrycia** ("możliwy duplikat/uzupełnienie
    M11 A10/B12 — sprawdzić przy budowie"): NIE jest duplikatem. A10/B12 to Wzorzec C — czysta
    treść informacyjna (3 akordeony: przechowywanie/recykling/narzędzia diagnostyczne), bez
    żadnego kalkulatora. Ten ekran to realny kalkulator dwóch progów liczbowych + checklist —
    inny wzorzec, inna treść źródłowa (3.18 vs 9.18–9.20/10.18–10.20), zero pokrywającej się
    logiki do zastosowania wzorca "echo".
  - Przy okazji naprawiona drobna drift-owa nieścisłość w tym pliku (Mapa orientacyjna niżej):
    odnośnik do GOD BOOK wskazywał nieistniejący już `...v2_3.md` (plik zastąpiony `...v2_5.md`
    w PR #23, referencja w tej sekcji nie została wtedy zaktualizowana) — poprawione zgodnie z
    zasadą Część Y.2 (dryf bez świadomej decyzji, nie konflikt do zgłoszenia).
  - `lib/core/modules/baterie/long-term-storage/`, 9 testów (w tym obie granice zakresu SoC
    50%/60% włącznie i granica temperatury dokładnie -20°C jako jeszcze bezpieczna), UI:
    `app/kalkulatory/long-term-storage/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 199/199 (9 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (3 stany: puste/INCOMPLETE,
    55%+5°C+checklist komplet→VALID "Gotowe do odstawienia", 100%→VALID_WITH_WARNINGS "Dopuszczalne"
    z komunikatem o zakresie 50–60%).

## Decyzje i uzasadnienie (c.d. 37)

- **2026-09-04 — Ekran 18, Moduł 4: "Łączenie równoległe różnych baterii (Mixing)" — dwa
  twarde stopy 🔴 jednocześnie, plus druga formuła wyprowadzona z tych samych wejść (nie
  osobna, wymyślona zależność).** Źródło (Sekcja B): `I_wyrównawczy = ΔV / (R1+R2)`, próg
  0,2V (Sekcja D, 🔴). Dodatkowo policzony udział każdej baterii w prądzie obciążenia
  (dzielnik prądowy `udział_i = R_druga / (R1+R2)`) — to bezpośrednia konsekwencja tego samego
  prawa Ohma dla gałęzi równoległych, liczona z tych samych dwóch zmierzonych rezystancji, nie
  nowy współczynnik. Świadomie odrzucony pomysł osobnego progu ostrzegawczego na wielkość
  nierównomierności (np. "powyżej 55% → ostrzeżenie") — źródło nie podaje takiego progu, byłoby
  to wymyślenie normy; liczby udziału pokazane jako informacja, nie jako wyzwalacz ostrzeżenia.
  Wiek/SoH z Sekcji A świadomie NIE stały się osobnym polem wejściowym — nie wchodzą do żadnego
  wzoru w źródle (efekt SoH jest już ujęty w zmierzonej rezystancji wewnętrznej, którą user
  wpisuje wprost) — dodanie ich byłoby polem dekoracyjnym bez wpływu na wynik.
  - **Błąd znaleziony i naprawiony w trakcie budowy tego samego ekranu (nie osobna sesja):**
    pierwsza wersja UI liczyła kolor werdyktu wyłącznie z `CalcResult.status`
    (`VALID_WITH_WARNINGS` → zawsze żółte "Dopuszczalne"), więc oba twarde stopy 🔴 renderowały
    się jako żółte ostrzeżenie zamiast czerwone "Zabronione" — visualnie niewidoczne w
    testach jednostkowych (te sprawdzają tylko `status`/`warnings`, nie kolor), złapane dopiero
    w zrzucie przeglądarki. Naprawione przez przejście na wzorzec z `dobor-bezpiecznika-dc`
    (już istniejący w kodzie): UI liczy własny 3-poziomowy werdykt z `warning.level` (`critical`
    → zawsze czerwony, niezależnie od `status`), a nie tylko z `CalcResult.status`. **Lekcja do
    zapamiętania na przyszłość**: przy każdym ekranie z twardym stopem 🔴 sprawdzić w
    przeglądarce, czy kolor werdyktu faktycznie jest czerwony, nie tylko czy `status` i
    `warnings[].code` się zgadzają w teście — dwa niezależne mechanizmy (`CalcResult.status` do
    kompletności/poprawności danych, `warning.level` do koloru werdyktu bezpieczeństwa) łatwo
    pomylić.
  - `lib/core/modules/baterie/mixing-rownolegle/`, 7 testów, UI: `app/kalkulatory/
    mixing-rownolegle/page.tsx`. Chemia ogniw w UI re-używa katalogu `BATTERY_TECHNOLOGIES`
    z Ekranu 30 (`porownanie-technologii`) zamiast duplikować listę — kolejne zastosowanie
    wzorca "echo", tym razem dla danych referencyjnych, nie tylko formuły.
  - Oba twarde stopy dopisane do `docs/rejestr-twardych-stopow.md` (sekcja Bateryjne).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 206/206 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (4 A przy ΔV=0,1V —
    zgodne z niezależnym przeliczeniem w Pythonie; oba twarde stopy potwierdzone jako czerwone
    "Zabronione" po naprawie błędu opisanego wyżej).

## Decyzje i uzasadnienie (c.d. 38)

- **2026-09-04 — Ekran 34, Moduł 4: "Matryca alarmów BMS i reakcje systemu" — najszybszy ekran
  serii, czysta tabela referencyjna bez kalkulatora, ten sam wzorzec co M11 A10/B12.** Źródło
  daje kompletną tabelę 7 wierszy (alarm → reakcja systemu) plus jeden przykładowy komunikat —
  przepisane 1:1, bez żadnej logiki do obliczenia. `lib/core/modules/baterie/matryca-alarmow-bms/`
  ma tylko `constants.ts` (bez `input.ts`/`calculator.ts`/`validation.ts`/`warnings.ts`/testów),
  dokładnie jak `przechowywanie-recykling` (M11/A10) — ta flaga z rejestru pokrycia
  ("podobny kształt do M11 A10/B12, bez kalkulatora") okazała się trafna.
  - UI: `app/kalkulatory/matryca-alarmow-bms/page.tsx`, tabela w tym samym stylu co `prognozy`
    (jedyny dotąd ekran z `<table>`) — ponowne użycie istniejącego wzorca HTML zamiast wymyślania
    nowego układu dla tabeli dwukolumnowej.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 206/206 (bez zmian — brak nowej logiki do
    testowania), `pnpm build` czysto, `lib/core/` nadal nie importuje z `app/`/`components/`,
    Playwright (tabela renderuje się poprawnie, 7 wierszy, przykładowy komunikat i migawka na
    dole).

## Decyzje i uzasadnienie (c.d. 39)

- **2026-09-04 — Ekran 5, Moduł 4: "Grzałki BMS i ochrona przed mrozem" — zbudowana tylko
  jedna z dwóch warstw silnika opisanego w źródle, druga świadomie pominięta.** Źródło (Sekcja
  B) opisuje "dwie warstwy zintegrowane w jeden silnik": (1) bilans energetyczny grzania —
  dawne 3.5, tylko dwa ilustracyjne przykłady liczbowe (0,5 kWh/dobę w styczniu, 0,6 kWh/dobę w
  nieogrzewanym garażu), bez żadnego wzoru wiążącego temperaturę/czas z ilością energii; (2)
  logika decyzyjna skąd brać prąd na grzanie — dawne 3.14, pełne drzewo decyzyjne z jawnymi
  progami (5°C, 30% SoC). Zbudowana wyłącznie warstwa 2 — warstwa 1 pokazana w UI jako czysta
  informacja (dwa przykłady ze źródła, bez przeliczania), nie jako wynik obliczenia z danych
  usera, żeby nie wymyślać brakującego wzoru.
  - **Znaleziona i udokumentowana luka**: źródło definiuje "SoC > 30% → grzanie z baterii" i
    "SoC < 30% → grzanie wstrzymane" jako dwa rozłączne warunki — SoC dokładnie 30% nie należy
    do żadnego z nich (ten sam rodzaj luki co Cold C-Rate 5–10°C, tym razem na granicy
    dyskretnego drzewa decyzyjnego, nie tabeli ciągłej). Kalkulator zwraca `OUT_OF_SCOPE`
    zamiast przypisywać wartość arbitralnie do jednej strony. Dopisane do
    `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
  - Stan "grzanie wstrzymane" (mróz + brak PV + SoC<30%) potraktowany jako twardy stop —
    BMS realnie blokuje ładowanie w tym stanie, dopóki nie pojawi się PV lub SoC nie wzrośnie —
    dopisany do rejestru twardych stopów, sekcja Bateryjne, poziom `critical`.
  - Pole "czy magazyn jest w pomieszczeniu ogrzewanym" z Sekcji A świadomie NIE stało się
    osobnym polem wejściowym — źródło nie podaje formuły łączącej ten fakt z temperaturą
    zewnętrzną z Modułu 1 (ile stopni cieplej wewnątrz). Zamiast tego user wpisuje wprost
    rzeczywistą temperaturę przy baterii (ten sam wzorzec co temperatura ogniw w Cold Cranking
    Amps/Cold C-Rate — bezpośredni pomiar, nie wyprowadzona wartość), z podpowiedzią w UI.
  - `lib/core/modules/baterie/grzalki-bms-mroz/`, 9 testów (w tym granica dokładnie 5°C jako
    "brak potrzeby" i granica SoC dokładnie 30% jako `OUT_OF_SCOPE`), UI: `app/kalkulatory/
    grzalki-bms-mroz/page.tsx`. UI ponownie stosuje wzorzec z `mixing-rownolegle`/
    `dobor-bezpiecznika-dc`: własny 3-poziomowy werdykt liczony z `warning.level`, nie tylko
    z `CalcResult.status`, plus osobny stan wizualny dla `OUT_OF_SCOPE`.
  - Zweryfikowane: `tsc`/`lint` czysto (jeden przypadek `react/no-unescaped-entities` naprawiony
    typograficznymi cudzysłowami „…", ten sam nawracający błąd co wcześniej w sesji), `pnpm test`
    215/215 (9 nowych), `pnpm build` czysto, `lib/core/` nadal nie importuje z `app/`/
    `components/`, Playwright (4 stany: PV→zielony, bateria→żółty, wstrzymane→czerwony,
    SoC=30%→OUT_OF_SCOPE żółty z wyjaśnieniem luki).

## Decyzje i uzasadnienie (c.d. 40)

- **2026-09-04 — Ekran 27, Moduł 4: "Chłodzenie baterii latem" — jedno proste sprawdzenie
  progowe, druga część źródła (wielkość przyspieszenia degradacji) świadomie pominięta.**
  Źródło (Sekcja B): "dopuszczalny zakres pracy (typowo 15-35°C); powyżej 35°C wykrywane ryzyko
  przyspieszonej degradacji" — próg policzony 1:1. Przykład Sekcji C ("degradacja przyspieszy o
  30%") jest czysto ilustracyjny — źródło nie podaje wzoru wiążącego wielkość przekroczenia
  temperatury z wielkością przyspieszenia degradacji, więc świadomie NIE liczony (ten sam rodzaj
  decyzji co w Ekranie 5 tego samego dnia — jedna warstwa źródła ma gotowy wzór/próg, druga tylko
  ilustrację).
  - Zakres sprawdzany symetrycznie (15–35°C, oba brzegi włącznie), ale z asymetryczną wagą
    komunikatu: powyżej 35°C → `critical` (dokładnie temat tego ekranu, źródło mówi wprost o
    "trwale przyspieszonej degradacji"), poniżej 15°C → `info` z odesłaniem do Cold C-Rate/Cold
    Cranking Amps (osobne ekrany o ograniczeniach przy niskiej temperaturze — nie duplikowanie
    ich logiki, tylko wskazanie, gdzie szukać).
  - `lib/core/modules/baterie/chlodzenie-latem/`, 7 testów (w tym granice 15°C/35°C włącznie i
    0°C jako poprawna, nieplaceholderowa wartość — pole `temperaturaOgniwC: number | null` z
    `null` jako jedynym sentinelem "nie wpisano", ten sam wzorzec co Cold Cranking Amps/Cold
    C-Rate), UI: `app/kalkulatory/chlodzenie-latem/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 222/222 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (48°C → czerwony "Powyżej
    dopuszczalnej temperatury", 25°C → zielony "W dopuszczalnym zakresie").

## Decyzje i uzasadnienie (c.d. 41)

- **2026-09-04 — Ekran 23, Moduł 4: "Analiza opłacalności magazynu (True Cost of Storage)" —
  pierwszy ekran serii z osobnym, opcjonalnym polem porównawczym.** Źródło (Sekcja B) daje pełny,
  gotowy wzór: `energia_całkowita_życia = pojemność × liczba_cykli × sprawność`,
  `koszt_za_kWh = cena_baterii / energia_całkowita_życia` — oba przeliczone niezależnie w
  Pythonie przed implementacją. Źródło wprost oznacza ten ekran jako wchłaniający dawną funkcję
  12.12 z Modułu AI ("ocena opłacalności magazynowania (AI)") — uznaną w źródle za duplikat tego
  samego tematu, więc nie budowana osobno.
  - **Pole "koszt alternatywy" (agregat/sieć) jest opcjonalne** (`number | null`, nie `0`-jako-
    placeholder, bo `0 zł/kWh` byłoby samo w sobie prawidłową, choć nierealistyczną, wartością
    porównawczą) — porównanie to prosta różnica (`koszt magazynu < koszt alternatywy?`), BEZ
    próby policzenia "liczby cykli do zwrotu" wspomnianej w przykładzie źródła Sekcji C ("zwraca
    się po ok. 1200 cyklach") — to wymagałoby dodatkowego założenia o tempie zużycia energii
    (ile kWh/rok faktycznie pobierane z magazynu), którego źródło nie podaje.
  - **Poprawka podczas budowy**: pierwsza wersja `calculator.ts` ustawiała status
    `VALID_WITH_WARNINGS` przy DOWOLNYM niepustym `warnings[]`, także gdy jedyne ostrzeżenie
    miało poziom `info` (np. "magazyn tańszy niż alternatywa" — to dobra wiadomość, nie powód do
    żółtego werdyktu). Naprawione przed commitem: status liczony z `warnings.some(w => w.level
    !== "info")`, zgodnie z tym, jak inne ekrany tej sesji (np. `grzalki-bms-mroz`) już
    traktowały poziom `info` jako nie wpływający na status.
  - `lib/core/modules/baterie/oplacalnosc-magazynu/`, 6 testów, UI: `app/kalkulatory/
    oplacalnosc-magazynu/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 228/228 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (0,34 zł/kWh przy
    25000zł/15kWh/5000cykli/98% — zgodne z niezależnym przeliczeniem w Pythonie; oba stany
    porównania z alternatywą, tańszy/droższy, zweryfikowane wizualnie).

## Decyzje i uzasadnienie (c.d. 42)

- **2026-09-04 — Ekran 26, Moduł 4: "Topologia BMS (Common Port vs Separate Port)" —
  hybryda Wzorca B (karty porównawcze) z pojedynczym, prostym progiem z Sekcji C.** Etykieta
  źródła to "Wzorzec B", więc rdzeń ekranu to opisowe porównanie dwóch topologii (jak
  `porownanie-technologii`) — ale Sekcja C daje konkretny, w pełni policzalny przykład ("BMS
  Common Port 100A, falownik pobiera 150A przy rozruchu → wybierz Separate Port"), więc dodano
  to jako prosty próg (`bmsCommonPortA >= falownikPradRozruchuA`), zamiast zostawiać go tylko
  jako tekst. Przykład źródła odtworzony dokładnie w teście.
  - `lib/core/modules/baterie/topologia-bms/`, 5 testów, UI: `app/kalkulatory/
    topologia-bms/page.tsx`.
  - **Przy okazji sprawdzony i zablokowany Ekran 25** ("Szyny zbiorcze i połączenia
    międzypakietowe") — ten sam rodzaj luki co M5/E1 i M11/B5: Sekcja C daje tylko ilustracyjne
    przykłady nierównego rozkładu prądu ("20%", "40% vs 15%"), źródło nie podaje wzoru wiążącego
    długość/przekrój kabla z wielkością tego rozkładu. Dopisany do `docs/rejestr-twardych-
    stopow.md`, sekcja "Znane luki", i do `docs/rejestr-pokrycia.md` jako `⚠️ blocked`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 233/233 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (100A/150A → czerwony
    "Wybierz Separate Port", zgodny z przykładem źródła; 200A/150A → zielony "Common Port
    wystarczy").

## Decyzje i uzasadnienie (c.d. 43)

- **2026-09-04 — Ekran 20, Moduł 4: "Komunikacja BMS — CAN/RS485/Modbus" — sprawdzenie
  zgodności protokołów jako prosta równość, z jawnie oznaczonym trzecim stanem "nieznany".**
  Źródło (Sekcja B) opisuje "sprawdzenie kompatybilności" między protokołem BMS a
  falownika/ładowarki — bez tabeli konkretnych par, to zwykła równość dwóch wybranych wartości
  z tej samej listy (CAN/RS485/Modbus/Pylontech). Cena konwertera z przykładu Sekcji C ("ok. 150
  zł") jest ilustracyjna, nie ogólny cennik — nie liczona.
  - Dodana wartość "Inny/nieznany" na liście protokołów, z osobnym traktowaniem: jeśli
    którekolwiek urządzenie ma protokół "inny", zwracany jest `OUT_OF_SCOPE` zamiast fałszywego
    "zgodne" (dwa nieznane protokoły niekoniecznie są tym samym protokołem) — świadoma decyzja,
    żeby nie zgadywać zgodności tam, gdzie dane są niewystarczające.
  - `lib/core/modules/baterie/komunikacja-bms/`, 4 testy, UI: `app/kalkulatory/
    komunikacja-bms/page.tsx`. Bez `validation.ts` — brak wartości liczbowych do walidowania,
    tylko wybór z zamkniętej listy.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 237/237 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (Pylontech vs CAN →
    żółty "Potrzebny konwerter protokołu", Pylontech vs Pylontech → zielony "Zgodne").

## Decyzje i uzasadnienie (c.d. 44)

- **2026-09-04 — Ekran 10, Moduł 4: "Ochrona przed wilgocią i kondensacją" — pierwszy ekran
  serii wykorzystujący standardowy wzór fizyczny nie podany wprost w źródle, PLUS znaleziona i
  udokumentowana wewnętrzna niespójność we własnym przykładzie źródła.** Źródło (Sekcja B) każe
  "obliczyć punkt rosy dla zadanej temperatury/wilgotności", ale nie podaje samego wzoru —
  użyty standardowy wzór meteorologiczny Magnusa-Tetensa (stałe dla wody ciekłej, a=17,27,
  b=237,7°C). To rozstrzygnięcie inne niż w większości ekranów tej sesji (gdzie wzór był zawsze
  cytowany wprost) — uzasadnione tym, że to fundamentalna, jednoznaczna fizyka (jak prawo Ohma
  użyte wcześniej dla prądu zwarciowego), nie wymyślony współczynnik bezpieczeństwa czy norma.
  Zweryfikowany niezależnie w Pythonie, zgodny z zaokrągleniem własnego przykładu źródła
  (-5°C/85%RH → wzór daje -7,12°C, źródło pisze "-7°C").
  - **Znaleziona i udokumentowana niespójność fizyczna w przykładzie źródła (Sekcja C)**: "obudowa
    osiągnie -6°C — w środku wykropli się woda" przy punkcie rosy -7°C. Poprawna fizyka:
    kondensacja zachodzi, gdy powierzchnia jest ZIMNIEJSZA (lub równa) punktowi rosy; -6°C jest
    CIEPLEJSZE niż -7°C, więc przy tych liczbach kondensacja nie powinna zajść. To prawdopodobny
    błąd redakcyjny w źródle, nie w tej implementacji. Zgodnie z zasadą "nie usuwaj — oznacz"
    (i tym samym podejściem zastosowanym wcześniej przy Ekranie 1/Sekcja C): silnik liczy
    poprawną zależność fizyczną, przykład źródła NIE jest odtwarzany dosłownie w teście (byłoby
    to utrwalenie błędnej logiki), rozbieżność opisana wprost w komentarzu kodu i tutaj.
  - Twardy stop "obudowa poniżej IP55 w środowisku wilgotnym" 1:1 ze źródła — dopisany do
    `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/ochrona-wilgoc/`, 7 testów (w tym dokładna wartość punktu rosy
    zweryfikowana z sześcioma miejscami po przecinku), UI: `app/kalkulatory/
    ochrona-wilgoc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 244/244 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (2 stany: żółte ryzyko
    kondensacji przy -15°C obudowy/-11,3°C punktu rosy, czerwony twardy stop przy IP20 w
    środowisku wilgotnym).

## Decyzje i uzasadnienie (c.d. 45)

- **2026-09-04 — Ekran 8, Moduł 4: "Symulacja Słabego Ogniwa (Cell Drift & Balancing)" —
  najprostszy wzór serii, jedna linijka mnożenia.** Źródło (Sekcja B): "Użyteczna pojemność
  pakietu = pojemność najsłabszego ogniwa" — w połączeniu szeregowym cały pakiet jest
  ograniczony najgorszym ogniwem. Zaimplementowany najgorszy przypadek: ogniwo dokładnie na
  dolnej granicy tolerancji fabrycznej (domyślnie ±3% ze źródła).
  - "Liczba ogniw w szeregu" z Sekcji A świadomie NIE stała się polem wzoru — nie jest potrzebna
    do tego konkretnego obliczenia (pojemność w Ah nie zależy od liczby ogniw w szeregu, tylko
    napięcie pakietu by zależało, a napięcia ogniwa nie ma w Sekcji A). Wynik podany w Ah i %,
    nie w kWh — unikanie wymyślenia napięcia ogniwa.
  - Rekomendacja prądu balansera z przykładu Sekcji C ("2A") świadomie NIE liczona — czysto
    ilustracyjna, źródło nie podaje zależności między wielkością rozjazdu a zalecanym prądem.
  - `lib/core/modules/baterie/slabe-ogniwo/`, 5 testów, UI: `app/kalkulatory/
    slabe-ogniwo/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 249/249 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (280Ah/3% → 271,6Ah,
    zgodne z niezależnym przeliczeniem w Pythonie).

## Decyzje i uzasadnienie (c.d. 46)

- **2026-09-04 — Ekran 9, Moduł 4: "Detekcja zwarcia i e-Fuse" — drugie zastosowanie wzorca
  "echo" tej sesji (po Obwodzie Pre-Charge).** Sekcja A źródła wprost odwołuje się do prądu
  zwarciowego "z rezystancji wewnętrznej" — dokładnie ten sam wzór Ohma (`I_zw = V/R_wewn`) już
  zaimplementowany w Ekranie 24 (Dobór bezpiecznika DC). Zamiast duplikować, wzór wyekstrahowany
  do samodzielnej, eksportowanej funkcji `obliczPradZwarciowyA` w
  `lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator.ts`, którą ten ekran importuje.
  Istniejące 6 testów Ekranu 24 przeszło bez zmian po refaktorze (zachowanie identyczne).
  - Próg: jeśli prąd zwarciowy przekracza zdolność łączeniową tranzystorów BMS (podawaną przez
    użytkownika z karty katalogowej, nie zgadywaną), zwykły bezpiecznik (~10ms) jest za wolny —
    wymagana funkcja e-Fuse (<100µs). Przykład źródła (48V/0,0096Ω → 5000A, poniżej 500A
    tranzystorów) odtworzony dokładnie w teście.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/detekcja-zwarcia-efuse/`, 5 testów, UI: `app/kalkulatory/
    detekcja-zwarcia-efuse/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 254/254 (5 nowych, `dobor-bezpiecznika-dc`
    nadal 6/6 po refaktorze), `pnpm build` czysto, `lib/core/` nadal nie importuje z
    `app/`/`components/`, Playwright (48V/0,0096Ω/500A → czerwony "Wymagana funkcja e-Fuse",
    I_zw=5000A zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 47)

- **2026-09-04 — Ekran 13, Moduł 4: "Algorytm końca ładowania (Tail Current / Absorption)" —
  formuła 1:1 ze źródła potwierdzona liczbowo przez własny przykład Sekcji C.** Źródło (Sekcja
  B): próg prądu końcowego jako ułamek C-rate (np. 0,05C) razy pojemność. Przykład Sekcji C
  ("prąd spadnie do 14A") sprawdzony niezależnie w Pythonie: 280Ah × 0,05C = dokładnie 14A —
  potwierdza, że to właśnie ten wzór, nie tylko podobny.
  - Trzy fazy ładowania jako proste, w pełni określone drzewo decyzyjne z tej samej Sekcji B:
    CC (napięcie jeszcze poniżej absorpcji) → CV-końcówka (napięcie osiągnięte, prąd wciąż nad
    progiem) → zakończone (prąd na progu lub poniżej).
  - `lib/core/modules/baterie/koniec-ladowania/`, 6 testów (w tym dokładna granica 14A jako
    "zakończone", nie "CV-końcówka" — nie `>` tylko `<=`), UI: `app/kalkulatory/
    koniec-ladowania/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 260/260 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (280Ah/3,55V/0,05C: prąd
    20A → żółta faza CV-końcówka, prąd 14A → zielone "Ładowanie zakończone", oba zgodne z progiem
    14A z przykładu źródła).

## Decyzje i uzasadnienie (c.d. 48)

- **2026-09-04 — Ekran 29, Moduł 4: "Detekcja doziemienia (Ground Fault & IMD)" — najprostszy
  ekran serii, dwa checkboxy i logiczne OR, bez pól numerycznych/`validation.ts`.** Źródło
  (Sekcja B) redukuje się do sprawdzenia obecności zabezpieczenia (IMD lub różnicówka DC) —
  binarny fakt, nie liczba do walidacji. Symulacja scenariusza przebicia z Sekcji C jest opisowa
  ("niebezpieczny potencjał na ramie"), nie liczbowa, więc nie liczona.
  - Domyślny stan (oba checkboxy odznaczone) poprawnie pokazuje czerwony twardy stop od razu —
    dla ekranu bezpieczeństwa to właściwe zachowanie (brak potwierdzonego zabezpieczenia = alarm),
    inaczej niż pola liczbowe, gdzie 0/pusty musi być stanem `INCOMPLETE`, nie ostrzeżeniem.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/detekcja-doziemienia/`, 4 testy, UI: `app/kalkulatory/
    detekcja-doziemienia/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 264/264 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (domyślnie czerwony "Brak
    zabezpieczenia", po zaznaczeniu IMD → zielony "Zabezpieczone").

## Decyzje i uzasadnienie (c.d. 49)

- **2026-09-04 — Ekran 21, Moduł 4: "Pozycjonowanie ogniw (kompresja/spuchnięcie)" — docisk
  podawany wprost w kgf, świadomie NIE przeliczany na moment dokręcania.** Źródło (Sekcja B)
  podaje zalecany zakres docisku 300-400 kgf dla ogniw pryzmatycznych. Przykład Sekcji C
  dodatkowo podaje "moment 3 N·m" dla konkretnego zestawu (16S 280Ah, 4 pręty M8) — ale to
  pojedynczy wynik dla jednej konfiguracji, nie ogólny wzór; przeliczenie siła→moment wymagałoby
  skoku gwintu i współczynnika tarcia (wzór `T = K×D×F`), których źródło nie podaje. Zamiast
  zgadywać te dwie wartości, user wpisuje zastosowany docisk bezpośrednio w kgf (np. z klucza
  dynamometrycznego skalibrowanego na docisk, albo z dokumentacji producenta prętów).
  - Drugi element: potwierdzenie zostawionego luzu na dylatację (ogniwa rosną 1-2% podczas
    ładowania) — checkbox, nie liczba, zgodnie z opisowym charakterem tego faktu w źródle.
  - Twardy stop (docisk poza zakresem w obie strony) dopisany do `docs/rejestr-twardych-stopow.md`.
  - `lib/core/modules/baterie/pozycjonowanie-ogniw/`, 7 testów (w tym granice 300/400 kgf
    włącznie), UI: `app/kalkulatory/pozycjonowanie-ogniw/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 271/271 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (350kgf + luz potwierdzony
    → zielone "Docisk prawidłowy").

## Decyzje i uzasadnienie (c.d. 50)

- **2026-09-04 — Ekran 14, Moduł 4: "SoH — diagnostyka per ogniwo" — zbudowana tylko jedna z
  dwóch warstw źródła, druga świadomie odrzucona jako niemożliwa do policzenia z jednorazowego
  wejścia.** Źródło (Sekcja B) opisuje "dwa powiązane silniki": (1) SoH ogólny pakietu metodą
  coulombowską, uwzględniający historię cykli/temperatury/DoD w czasie — wymaga ciągłego
  logowania danych z BMS (integracja z żywym strumieniem danych, którego apka jeszcze nie ma);
  (2) diagnostyka per ogniwo z jawnie podanym progiem ("wzrost rezystancji o 50% względem
  wartości fabrycznej = utrata pojemności"). Zbudowana wyłącznie warstwa 2 — warstwa 1 nie jest
  ani brakiem normy, ani brakiem wzoru (jak w innych blocked screenach), tylko brakiem
  architektury do zbierania danych w czasie — inny rodzaj blokady, odnotowany osobno.
  - Przykład Sekcji C ("Ogniwo #12: 0,71 mΩ — KRYTYCZNE") zweryfikowany niezależnie: przy
    typowej fabrycznej rezystancji 0,25 mΩ (wartość ogniwa #1 z tej samej tabeli, "OK") wzrost
    wynosi +184%, dużo powyżej progu 50% — spójne z klasyfikacją źródła. Środkowa strefa "UWAGA"
    (ogniwo #7: 0,48 mΩ) nie ma podanego progu liczbowego oddzielającego ją od "OK" — ocena
    pozostaje dwustanowa (OK / do wymiany), nie trójstanowa, żeby nie wymyślać granicy.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Bateryjne.
  - `lib/core/modules/baterie/soh-per-ogniwo/`, 5 testów, UI: `app/kalkulatory/
    soh-per-ogniwo/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 276/276 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (0,25→0,71mΩ → czerwony
    "+184% względem fabrycznej / Ogniwo do wymiany", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 51)

- **2026-09-04 — Ekran 17, Moduł 4: "Analiza Second-Life (baterie z EV)" — dwie alternatywne
  metody szacunku ze źródła, obie zaimplementowane, user wybiera którą ma dane do zastosowania.**
  Źródło (Sekcja B): SoH szacowany "na podstawie wieku/przebiegu (~2-3%/rok lub ~1%/10 000 km)".
  Dolna granica zakresu rocznego (2%/rok) — ten sam wzorzec konserwatywnego wyboru już
  zastosowany w Ekranie 6 (Starzenie i degradacja). Przykład Sekcji C (10 kWh, SoH ~72% →
  7,2 kWh, 6000 zł → 833 zł/kWh) zweryfikowany niezależnie w Pythonie: **obie metody**
  niezależnie reprodukują dokładnie 72% SoH przy self-konsystentnych wartościach (14 lat przy
  metodzie wieku, 280 000 km przy metodzie przebiegu) — źródło nie podaje, które dane wejściowe
  faktycznie użyło w tym przykładzie, więc żadna z dwóch metod nie jest "tą jedyną słuszną",
  obie są równie uprawnione i obie dają ten sam wynik na tym konkretnym przykładzie.
  - Cena nowej baterii LiFePO4 (w źródle: "1200 zł/kWh") świadomie NIE stała się stałą aplikacji
    — to zmienna cena rynkowa, nie stały parametr fizyczny/normatywny, więc pole opcjonalne z
    ceną wpisywaną przez użytkownika, nie hardkodowana wartość, która szybko staje się
    nieaktualna.
  - Skrajny przypadek: gdy model degradacji sprowadza SoH do 0% (bardzo stara/przejechana
    bateria), zwracane jest osobne, krytyczne ostrzeżenie zamiast dzielenia przez zero.
  - `lib/core/modules/baterie/second-life/`, 7 testów, UI: `app/kalkulatory/second-life/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 283/283 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (10kWh/6000zł/14 lat →
    zielony "Szacowany SoH: 72%" / "833 zł/kWh", dokładnie zgodne z przykładem źródła).

## Mapa orientacyjna

- `docs/rejestr-twardych-stopow.md` — zbiorczy indeks warunków zawsze skutkujących 🔴 (04.3), z odsyłaczami do modułu/ekranu/pliku źródłowego. Dopisz tu nowy twardy stop, gdy kolejny moduł go wprowadzi.
- `docs/standards/00-INDEKS.md` — standard wspólny dla rodziny aplikacji (17 rozdziałów), zacznij tu przy pytaniach "jak mamy to robić".
- `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_5.md` — metodologia procesowa (GOD BOOK) — jak prowadzić Biblię projektu; Część Y opisuje relację ze standardem powyżej. `PROMPT_STARTOWY.md` (root) to gotowy tekst startowy sesji wg tej metodologii.
- `docs/lista-do-zrobienia.md` — bieżące zadania, czytaj zaraz po tym pliku na starcie sesji.
- `docs/wklad-do-standardu.md` — tu AI dopisuje z własnej inicjatywy spostrzeżenia warte rozważenia dla całego `new-app-standards` (nigdy nie edytuje repo źródłowego bezpośrednio).
- `ZASADY_APLIKACJI.md` (pełna) / `USTALENIA.md` (skrót) — konstytucja Offgrid, nadrzędna wobec kodu. Pełni rolę "Biblii" tego projektu (GOD BOOK), jeszcze nie zmigrowana do jego kanonicznego nazewnictwa — patrz decyzja wyżej.
- `docs/zrodla/` — materiały źródłowe Offgrid (Biblia, treść 13 modułów, plik scalony, Zasady UX Doradcy) — przeszukiwać tu zamiast pytać użytkownika o ponowne wysłanie.
- `docs/pulpit-i-nawigacja.md` — decyzja o pulpicie adaptacyjnym (13+1 kafli, kolejność, presety onboardingu) — czytaj przed budową ekranu głównego lub menu wewnątrz modułu.
- `lib/pulpit/registry.ts` — jedyne źródło prawdy o 13 kaflach i ich ekranach; dopisz tu nowy ekran, żeby pojawił się w `/moduly/[id]`.
- `components/kafle-ikony/` — animowane SVG ikony kafli pulpitu (na razie 1–7); dopisz tu kolejny `<symbol>` + wpis w `ikona.tsx`, gdy kolejny kafel zostanie zablokowany jako finalny w artefakcie roboczym "Off-Grid Tile Set".
- `app/`, `components/ui/`, `lib/utils.ts` — obecny szkielet Next.js, bez kodu domenowego.
- `CLAUDE.md` — punkt wejścia dla AI, odsyła tutaj i do standardu.
