# Archiwum docs/memory.md — 03-decyzje-i-uzasadnienia-cz2

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 1425–2370 stanu sprzed archiwizacji | **Liczba sekcji:** 39
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

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

## Decyzje i uzasadnienie (c.d. 52)

- **2026-09-04 — Zamknięcie sweepu Modułu 4 na 26/34, decyzja użytkownika: przejść do Modułu 2.**
  Zapytany wprost (AskUserQuestion), użytkownik wybrał kontynuację w Module 2 zamiast dalszego
  szukania pojedynczych budowalnych ekranów w resztkach Modułu 4 (pozostałe pozycje: 2 częściowo
  blocked, 3 cross-module, 4/25/31/32 blocked, 19/33 nie sprawdzone — odłożone, nie porzucone).

- **2026-09-04 — Ekran 17, Moduł 2: "Agregat prądotwórczy — definicja i logika pracy" — domyka
  lukę 1.19 znalezioną 2026-08-29 przy budowie standardu.** Ta luka była udokumentowana od
  początku Etapu 1 jako "treść źródłowa gotowa w Biblii, nigdy nie przepisana do pliku treści
  modułu" — teraz faktycznie odzyskana i zaimplementowana. Treść źródłowa:
  `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`, linie 503-521, funkcja 2.19
  (dawne 1.19). Trzy wzory w łańcuchu, wszystkie zweryfikowane niezależnie w Pythonie przed
  implementacją i razem odtwarzające dokładnie własny przykład źródła (deficyt 80 kWh, agregat
  5 kW → 20 godzin, 25 l paliwa, 200 zł):
  1. `godziny = deficytKwh / (mocAgregatuKw × 0,8)` — źródło podaje zakres "optymalne obciążenie
     70-80%", użyta górna granica (80%) jest jedyną wartością w tym zakresie, przy której wynik
     wychodzi dokładnie 20h (nie 21,3h ani inna wartość) — silny sygnał, że to właśnie ta granica
     została użyta w oryginalnym przykładzie, nie środek zakresu.
  2. `paliwo = godziny × zużycieLH` (zużycie w l/h jako bezpośredni input użytkownika, zgodnie z
     Sekcją "Skąd czerpie dane" Biblii).
  3. `koszt = paliwo × cenaZaLitr` (cena paliwa jako pole użytkownika — zmienna cena rynkowa, nie
     stała aplikacji, ten sam wzorzec co cena nowej baterii w Ekranie 17 Modułu 4 tego samego dnia).
  - **Deficyt energetyczny w najgorszym miesiącu wpisywany wprost przez użytkownika**, nie
    wyprowadzany automatycznie z produkcji PV (Moduł 3) minus zapotrzebowanie (ten sam Moduł 2) —
    ta integracja międzymodułowa to osobny, nie rozpoczęty krok, zgodnie z wzorcem stosowanym
    konsekwentnie w tej sesji (user wpisuje bezpośrednio zmierzoną/oszacowaną wartość zamiast
    czekać na pełny potok danych).
  - **Wpis "luka" w `docs/rejestr-pokrycia.md` NIE usunięty, tylko oznaczony jako rozwiązany**
    (przekreślenie + data + odniesienie do nowego wiersza) — zgodnie z zasadą "nie usuwaj —
    oznacz" (`docs/standards/15-wspolpraca-z-ai.md`, 15.3), ten sam wzorzec co korekta D-1.
  - `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/`, 5 testów, UI: `app/kalkulatory/
    agregat-pradotworczy/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 288/288 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (80kWh/5kW/1,25 l-h/8 zł/l
    → "20 h", "25 l", "200 zł", dokładnie zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 53)

- **2026-09-04 — Ekran 9, Moduł 2: "Pobór własny falownika" — bezpośredni odpowiednik już
  zbudowanego wzorca (M4/E22 Pobór własny BMS), ten sam kształt wzoru.** Wzór
  `E_doba = P_jałowy × 24 / 1000` (kWh/dobę) 1:1 ze źródła. Przykład źródła ("45W → 1,08 kWh/dobę")
  zweryfikowany niezależnie przed implementacją i odtworzony dokładnie. Domyślna wartość 50W
  (gdy model nieznany) pokazana jako podpowiedź w UI, nie ukryty domyślny stan pola.
  - `lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/`, 4 testy, UI: `app/kalkulatory/
    pobor-wlasny-falownika/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 292/292 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (45W → 1,08 kWh/dobę,
    zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 54)

- **2026-09-04 — Ekran 11, Moduł 2: "Przetwornice DC/DC" — przykład źródła zweryfikowany
  matematycznie z niebanalnym wynikiem: strata jako % dotyczy mocy realnie pobranej, nie
  znamionowej urządzenia.** Wzór `P_realne = P_urządzenia / sprawność`. Źródło (Sekcja C):
  "sprawność ~92% → traci 8% energii". Sprawdzone w Pythonie: `strataW / P_realne × 100`
  wychodzi dokładnie `100 - sprawność` (tu: 8,0%) — czyli "traci 8%" ze źródła to strata
  liczona względem mocy faktycznie pobranej z magistrali (żeby dostarczyć 100W na wyjściu,
  urządzenie musi pobrać 108,7W, z czego 8,7W/108,7W = dokładnie 8% to strata) — nie jest to
  przypadkowe uproszczenie "100-sprawność", tylko matematycznie ścisła zależność.
  - Pole "zasilanie bezpośrednie" (bez przetwornicy) jako przełącznik — gdy aktywne, pole
    sprawności ukryte w UI (nieistotne), status VALID bez strat, zamiast wymuszać wpisanie
    nieużywanej wartości.
  - `lib/core/modules/zapotrzebowanie/przetwornice-dcdc/`, 4 testy, UI: `app/kalkulatory/
    przetwornice-dcdc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 296/296 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (100W/92% → 108,7W,
    "traci 8% (8,7 W)", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 55)

- **2026-09-04 — Ekran 8, Moduł 2: "Zaawansowane parametry obciążenia" — zbudowany tylko jeden
  z trzech podpunktów źródła, ten z prawdziwym, samodzielnym wzorem.** Sekcja B źródła opisuje
  "trzy powiązane korekty": (1) moc pozorna/cos φ — wzór podany wprost (`VA = P / cos φ`),
  domyślny cos φ=0,7 dla silników też podany wprost; (2) prądy rozruchowe — współczynniki (5× dla
  pompy głębinowej, 6× dla starej lodówki) opisane jako "z bazy komponentów", której ten projekt
  nie ma — użycie tych konkretnych mnożników jako uniwersalnej reguły byłoby wymyślaniem danych
  dla urządzeń spoza tych dwóch przykładów; (3) współczynnik jednoczesności — czysto opisowy,
  źródło nie podaje żadnej konkretnej liczby/wzoru statystycznego. Zbudowany wyłącznie podpunkt 1.
  - Przykład Sekcji C łączy wszystkie trzy podpunkty naraz (3,2 kW → 4,8 kVA przy rozruchu pompy)
    — nie da się go odtworzyć przy zbudowaniu tylko jednego podpunktu, więc test używa
    self-konsystentnych wartości (2000W/cos φ=0,7 → 2857 VA), nie próbuje wymusić dopasowania do
    przykładu źródła.
  - `lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/`, 5 testów, UI: `app/kalkulatory/
    moc-pozorna-cosfi/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 301/301 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (2000W/cos φ=0,7 →
    2857 VA, zgodne z niezależnym przeliczeniem w Pythonie).

## Decyzje i uzasadnienie (c.d. 56)

- **2026-09-04 — Ekran 13, Moduł 2: "Bufor na rozbudowę" (dawne 1.25, Wzorzec D-lite).** Prosty
  mnożnik procentowy na sumie całkowitego zapotrzebowania dobowego, wartości suwaka (0/10/20/30%)
  1:1 ze źródła — bez interpolacji ani wartości pośrednich, których źródło nie podaje.
  - Wzór `E_z buforem = E_całkowite × (1 + bufor%)`, `dodatek = E_z buforem - E_całkowite`.
    Przykład (12,4 kWh + 20% → 14,88 ≈ 14,9 kWh) zweryfikowany niezależnie w Pythonie przed
    implementacją i potwierdzony w przeglądarce (Playwright).
  - Tylko ostrzeżenie info-level ("bufor 20% dolicza X kWh/dobę zapasu...") — status zawsze
    `VALID`, zgodnie ze standardową konwencją tej sesji (info-only nigdy nie obniża statusu do
    `VALID_WITH_WARNINGS`).
  - `lib/core/modules/zapotrzebowanie/bufor-rozbudowe/`, 5 testów, UI: `app/kalkulatory/
    bufor-rozbudowe/page.tsx`.
  - Zweryfikowane: `lint` czysto, `pnpm build` czysto (306 testów), Playwright (12,4 kWh + 20% →
    "14,9 kWh/dobę", zgodne z przeliczeniem referencyjnym).

## Decyzje i uzasadnienie (c.d. 57)

- **2026-09-04 — Ekran 7, Moduł 2: "Dni autonomii" (dawne 1.9, Wzorzec D-lite) — trzecie
  zastosowanie wzorca "echo" w tej sesji.** Wartość główna to prosty wybór suwaka (1/2/3/5/7 dni,
  literalnie ze źródła), która docelowo auto-zasila Moduł 4/Ekran 1 ("Dobór pojemności baterii") —
  ta integracja nie istnieje jeszcze (brak współdzielonego stanu projektu), więc na razie ekran
  tylko produkuje i pokazuje wybraną wartość.
  - Źródło żąda też: "ekran powinien pokazywać na żywo szacunkowy wpływ na wielkość/koszt
    magazynu przy przesuwaniu suwaka" — zbudowane jako **opcjonalny** podgląd (trzy dodatkowe
    pola: zapotrzebowanie dobowe, sprawność falownika, DoD — te same co Moduł 4/Ekran 1), a nie
    obowiązkowa część ekranu, bo to nie jest jego własny zakres danych.
  - Zamiast duplikować wzór `C_użyteczna = E_dobowe × d_autonomii / (η × DoD)`, wyekstrahowano go
    z `lib/core/modules/baterie/dobor-pojemnosci/calculator.ts` do osobnej, eksportowanej funkcji
    `obliczPojemnoscUzytecznaKwh` i zaimportowano tutaj — dokładnie ten sam wzorzec co przy
    Ekranie 9 M4 (`obliczPradZwarciowyA`) i Pre-Charge (M4/M11) wcześniej w tej sesji. 7 istniejących
    testów `dobor-pojemnosci` nienaruszonych (refaktoryzacja czysto mechaniczna, bez zmiany logiki).
    Koszt (druga część żądania źródła) świadomie NIE policzony — wymagałby ceny magazynu/kWh, co
    duplikowałoby zakres `oplacalnosc-magazynu` (M4/Ekran 23) bez wyraźnej potrzeby tutaj.
  - `lib/core/modules/zapotrzebowanie/dni-autonomii/`, 5 testów, UI: `app/kalkulatory/
    dni-autonomii/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 311/311 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/` (import między dwoma modułami `lib/core/
    modules/` jest dozwolony — to nie jest import w górę warstw), Playwright (3 dni + 12 kWh/95%/80%
    → "47,4 kWh", zgodne z wartością referencyjną 900/19≈47,368 policzoną wcześniej dla tego samego
    wzoru w Ekranie 1 M4).

## Decyzje i uzasadnienie (c.d. 58)

- **2026-09-04 — Ekran 2, Moduł 2: "Inteligentny bojler C.W.U." (dawne 1.2, Wzorzec D) — ΔT
  jako pole ręczne, nie domyślne, żeby nie wymyślać danych.** Sekcja B źródła każe liczyć
  "dobowe zapotrzebowanie na ciepłą wodę na podstawie pojemności cieplnej i liczby osób" —
  fizycznie to `Q = m × c_wody × ΔT` (specyficzne ciepło wody, uniwersalna stała fizyczna,
  4186 J/(kg·K), ten sam rodzaj precedensu co wzór Magnusa-Tetensa w Ekranie 10 M4). Ale w
  przeciwieństwie do tamtego wzoru, tu jest wolny parametr projektowy: ΔT (wzrost temperatury
  zimna→C.W.U.), zależny od lokalnych warunków (temperatura wody wodociągowej, docelowa
  temperatura bojlera) — źródło NIE podaje go jako liczby.
  - Przykład Sekcji C (200l, 4 osoby → ok. 8 kWh) odpowiada ΔT≈35K (dokładnie 34,4K dla równego
    8,000 kWh) — zweryfikowane niezależnie w Pythonie. To nie jest jawnie stwierdzona dana
    źródła, więc NIE przyjęte jako domyślna wartość (byłoby wymyślaniem współczynnika projektowego)
    — pole wymaga ręcznego wpisania, ta sama zasada co "ogrzewanie" bez domyślnej mocy w Ekranie 1.
  - Dodatkowy, niewymyślony check: ostrzeżenie (poziom `warning`, nie `critical`) gdy pojemność
    zbiornika bojlera mniejsza niż dobowe zapotrzebowanie w litrach — to prosta różnica
    wielkości, nie tabela normatywna, więc nie łamie zasady "nie wymyślaj norm".
  - `lib/core/modules/zapotrzebowanie/bojler-cwu/`, 5 testów, UI: `app/kalkulatory/bojler-cwu/
    page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 316/316 (5 nowych), `pnpm build` czysto,
    Playwright (200l/ΔT=35K/2kW/200l → "8,1 kWh/dobę", zgodne z przykładem źródła "ok. 8 kWh";
    zmiana pojemności bojlera na 150l poprawnie przełącza werdykt na żółty z ostrzeżeniem).

## Decyzje i uzasadnienie (c.d. 59)

- **2026-09-04 — Ekran 6, Moduł 2: "Sezonowość i tryb wakacyjny" (dawne 1.8, Wzorzec D) —
  granice sezonu wpisywane per urządzenie, nie zakładane globalnie.** Sekcja C źródła podaje
  jeden przykład: "klimatyzacja aktywna tylko czerwiec-wrzesień" — to konkretna charakterystyka
  TEGO urządzenia (klimatyzacji), nie jawna, uniwersalna definicja "lato"/"zima" w miesiącach
  dla wszystkich urządzeń tej kategorii. Przyjęcie własnych granic (np. "lato = czerwiec-sierpień")
  byłoby wymyślaniem danych nieobecnych w źródle. Rozwiązanie: użytkownik wpisuje miesiąc
  początku/końca sezonu osobno dla każdego urządzenia — dokładnie odtwarza przykład źródła przy
  wpisaniu 6/9, ale nie narzuca tej granicy innym urządzeniom.
  - Trzy typy: całoroczny (zawsze aktywne), sezonowy (aktywne w oknie miesięcy, z obsługą
    przełomu roku — np. zima 12→2 — przetestowane), weekendowy (checkbox "czy dzisiaj weekend").
  - `CalcResult.inputs` jest typowany jako `Record<string, number>` — pola nienumeryczne (`typ`,
    `czyWeekend`) pominięte w `inputs`, zgodnie z istniejącym wzorcem z `komunikacja-bms` i
    `detekcja-doziemienia` (oba też mają nienumeryczne pola wejścia).
  - `lib/core/modules/zapotrzebowanie/sezonowosc/`, 9 testów, UI: `app/kalkulatory/sezonowosc/
    page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 325/325 (9 nowych), `pnpm build` czysto,
    Playwright (sezonowy 6→9, sprawdzany miesiąc 7 → "Aktywne", 3,00 kWh/dobę; miesiąc 12 →
    "Nieaktywne", 0,00 kWh/dobę — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 60)

- **2026-09-04 — Ekran 5, Moduł 2: "Profil dobowy + astronomiczny dzień/noc" (scala dawne
  1.7/1.16, Wzorzec D) — zbudowana tylko część astronomiczna, czwarte zastosowanie
  precedensu "uniwersalna fizyka/astronomia niepodana wprost w źródle, ale nie wymyślona".**
  Sekcja A/C źródła każe liczyć długość dnia/nocy z szerokości geograficznej — standardowe
  równanie wschodu/zachodu Słońca z przybliżeniem deklinacji metodą Coopera (1969),
  `δ = 23,45° sin(360/365 × (284+n))`, `N = (2/15) arccos(-tanφ·tanδ)` — uniwersalna, dobrze
  udokumentowana formuła inżynierii słonecznej (ten sam rodzaj precedensu co Magnus-Tetens w
  Ekranie 10 M4 i ciepło właściwe wody w Ekranie 2 M2), nie dana specyficzna dla źródła.
  - Zweryfikowane niezależnie w Pythonie przed implementacją: Warszawa (φ≈52,2°N), 21 grudnia
    (dzień 355) → 7,47h dnia / 16,53h nocy — zgodne z przykładem źródła Sekcji C ("Grudzień: 8h
    dnia, 16h nocy", zaokrąglone). Równik/równonoc → dokładnie 12h/12h (test sanity). Koło
    podbiegunowe (70°N) → poprawnie zwraca noc/dzień polarny (0h/24h) z ostrzeżeniem info.
  - Sekcja B (profil godzinowych współczynników zapotrzebowania, "0,3 w nocy, 1,5 w szczycie")
    świadomie NIE zbudowana — to przykładowe wartości ilustracyjne źródła, nie uniwersalna
    tabela, więc przyjęcie ich jako reguły byłoby wymyślaniem danych.
  - `szerokoscGeograficzna: number | null` — `null` jako sentinel "nie wpisano" (0° to legalna
    wartość na równiku), ten sam wzorzec co `temperaturaOgniwC` w `chlodzenie-latem` (M4).
  - Dodatkowy, praktyczny output: opcjonalna energia nocna odbiornika działającego tylko w
    ciemności (np. oświetlenie zewnętrzne) = moc × długość nocy — bezpośrednio realizuje
    przykład D źródła.
  - `lib/core/modules/zapotrzebowanie/profil-astronomiczny/`, 9 testów, UI: `app/kalkulatory/
    profil-astronomiczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 334/334 (9 nowych), `pnpm build` czysto,
    Playwright (52,2°/dzień 355/50W → "7,5 h dnia / 16,5 h nocy", "0,83 kWh tej doby").

## Decyzje i uzasadnienie (c.d. 61)

- **2026-09-04 — Ekran 12, Moduł 2: "Macierz priorytetów odłączania (Smart Load Shedding)"
  (dawne 1.20, Wzorzec D) — buildowalny bez bazy urządzeń, bo progi SoC są podane wprost.**
  W przeciwieństwie do wcześniej odrzuconych sub-punktów (np. prądy rozruchowe w Ekranie 8),
  ten ekran NIE wymaga bazy komponentów — logika działa na pojedynczym priorytecie (1/2/3) i
  aktualnym SoC, a oba progi (20% dla priorytetu 2, 90% dla priorytetu 3) są jawnie podane w
  Sekcji A źródła, nie wymyślone.
  - Logika: priorytet 1 nigdy nie odłączany; priorytet 2 odłączany gdy `SoC < 20%`; priorytet 3
    odłączany gdy `SoC < 90%` LUB brak nadwyżki PV (drugi warunek też wprost ze źródła: "lub
    braku nadwyżki PV").
  - Przykład źródła Sekcji C (SoC 18% → odłączone: zmywarka/suszarka [priorytet 3]; aktywne:
    ogrzewanie/pompa głębinowa [priorytet 1]) odtworzony dokładnie w testach.
  - Agregacja po wielu urządzeniach naraz (żeby np. wyświetlić "co dokładnie zostanie odłączone
    w Twoim domu") świadomie NIE zbudowana — wymaga listy urządzeń z Ekranu 3 (jeszcze nie
    istnieje) — ten ekran liczy pojedynczy odbiornik/kategorię na raz, zgodnie z ustalonym
    wzorcem "manualne wpisanie zamiast auto z ekranu, który jeszcze nie istnieje".
  - `socPct: number | null` — `null` jako sentinel "nie wpisano" (0% to legalna, krytyczna
    wartość SoC), ten sam wzorzec co w `profil-astronomiczny` i `chlodzenie-latem` (M4).
  - `lib/core/modules/zapotrzebowanie/load-shedding/`, 9 testów, UI: `app/kalkulatory/
    load-shedding/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 343/343 (9 nowych), `pnpm build` czysto,
    Playwright (priorytet 3 + SoC 18% → "Odłączony", żółty; priorytet 1 + SoC 18% → "Aktywny",
    zielony — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 62)

- **2026-09-04 — Ekran 2, Moduł 4: "Sugestia napięcia systemowego (12/24/48V)" (dawne 3.2,
  Wzorzec D) — dawny "blocked" z Modułu 4 teraz otwarty; Moduł 2 wyczerpany, wracamy dobierać
  pojedyncze buildowalne ekrany z innych modułów.** Moduł 2 doszedł do 13/17, a pozostałe cztery
  pozycje (Ekran 3 urządzenia zmienne, Ekran 10 sprawność inwertera, Ekran 14 architektura
  1-/3-fazowa, Ekran 15 kategorie specjalne) wymagają bazy komponentów lub progu nieobecnego w
  źródle (krzywa sprawności inwertera to tylko dwa luźne zakresy bez wzoru; próg "znacznej
  asymetrii" faz nigdzie nie podany liczbowo) — sprawdzone i odrzucone jako niebuildowalne bez
  wymyślania danych, tym samym wzorcem co poprzednie odrzucenia w tej sesji.
  - Sekcja B źródła podaje dwa progi wprost: `moc>3000W → 48V`, `moc<1000W → 12V`. Pasmo
    1000-3000W dopowiedziane logicznie jako 24V (jedyna pozostała opcja z trzech wymienionych w
    tytule ekranu) — udokumentowane jawnie jako uzupełnienie struktury, nie ukryty wymysł.
  - Prąd `I=P/V` dla wszystkich trzech napięć (czyste prawo Ohma) — przykład źródła (4800W →
    400A@12V, 100A@48V) odtworzony dokładnie w Pythonie przed implementacją i w teście.
  - Porównanie wymaganych przekrojów kabli (Sekcja C: "kabel 95mm²"/"25mm²") świadomie NIE
    zbudowane — wymaga tabeli obciążalności prądowej (PN-IEC 60364-5-52), ta sama brakująca
    norma co Moduł 5/Ekran 1 (już wcześniej blocked).
  - `lib/core/modules/baterie/napiecie-systemowe/`, 8 testów, UI: `app/kalkulatory/
    napiecie-systemowe/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 351/351 (8 nowych), `pnpm build` czysto,
    Playwright (4800W → "48V", "400A@12V · 200A@24V · 100A@48V", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 63)

- **2026-09-04 — Ekran 4, Moduł 4: "Moduł EV — ładowanie samochodu elektrycznego" (dawne 3.4,
  Wzorzec D) — zapotrzebowanie EV wpisywane wprost, nie wyprowadzane z przebiegu.** Sekcja A
  źródła wymienia "pojemność baterii EV, dzienny przebieg, moc ładowarki" jako wejścia, ale
  Sekcja B liczy "dodatkowe zapotrzebowanie" bez podania wzoru przebieg→energia — zużycie
  energii na kilometr różni się mocno między modelami EV (typowo 0,15-0,25 kWh/km, ale to
  zależy od modelu) i źródło nie podaje konkretnej liczby, więc nie jest zgadywane. Zamiast tego
  użytkownik wpisuje dobowe zapotrzebowanie EV wprost (własny szacunek lub dane z ładowarki).
  - Logika: `brak_sezon = max(0, E_EV - nadwyżka_PV_sezon)` dla lata i zimy osobno (nadwyżka PV
    wpisywana ręcznie — docelowo z Modułu 3, jeszcze nie istnieje jako integracja).
  - Przykład źródła Sekcji C (10 kWh/dobę EV, latem pokryte, zimą brak — "zimą będziesz musiał
    zwiększyć PV o 4 panele") odtworzony dokładnie w testach i Playwright (12/3 kWh nadwyżki →
    "Latem: pokryte", "Zimą: brak 7,0 kWh"). Przeliczenie braku energii na liczbę potrzebnych
    paneli PV świadomie NIE zbudowane — wymaga mocy panela i godzin nasłonecznienia, które
    dodałyby kolejną warstwę zgadywania.
  - `nadwyzkaPvLatemKwh`/`nadwyzkaPvZimaKwh: number | null` — `null` jako sentinel "nie wpisano"
    (0 kWh nadwyżki zimą to bardzo realna, legalna wartość).
  - `lib/core/modules/baterie/modul-ev/`, 5 testów, UI: `app/kalkulatory/modul-ev/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 356/356 (5 nowych), `pnpm build` czysto,
    Playwright (10/12/3 kWh → "Latem: pokryte", "Zimą: brak 7,0 kWh", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 64)

- **2026-09-04 — Ekran 19, Moduł 4: "Vehicle-to-Home (V2H)" (dawne 3.21, Wzorzec D) —
  czwarte zastosowanie wzorca "echo" w tej sesji.** Koszt za kWh z baterii trakcyjnej EV to
  strukturalnie identyczny wzór co "True Cost of Storage" (Ekran 23, `cena / (pojemność × cykle
  × sprawność)`) — zamiast duplikować, wyekstrahowano `obliczKosztZaKwh` jako czystą funkcję z
  `oplacalnosc-magazynu/calculator.ts` i zaimportowano tutaj z innymi polami wejścia (bateria
  trakcyjna zamiast domowej). 6 istniejących testów `oplacalnosc-magazynu` nienaruszonych po
  refaktoryzacji (potwierdzone przed dalszą pracą).
  - "Rezerwa na dojazd, degradacja, straty" (Sekcja B źródła) — trzy słowa bez rozbicia na osobne
    wzory. Zamiast zgadywać podział, zamodelowano jako: rezerwa (wprost odejmowana od pojemności)
    + jeden łączny "współczynnik sprawności efektywnej" (degradacja+straty razem, wpisywany
    ręcznie przez użytkownika). Przykład źródła (80 kWh → 40 kWh) jest z natury niejednoznaczny —
    wiele kombinacji rezerwa/sprawność go odtwarza — więc test świadomie NIE wymusza dopasowania
    do tego konkretnego przykładu, tylko sprawdza self-konsystentne wartości (ta sama zasada co
    Ekran 8 M2 wcześniej w tej sesji).
  - Boolean `wspieraV2h` (V2H pełny dom vs V2L pojedyncze urządzenia, max ok. 3,6 kW — wartość
    "np." ze źródła, użyta tylko w treści komunikatu, NIE jako twardy próg w kodzie) → info/
    warning zamiast blokowania obliczeń (numery liczą się niezależnie od trybu, zgodnie z
    przykładem źródła, gdzie liczby są pokazane nawet dla auta wspierającego tylko V2L).
  - `lib/core/modules/baterie/vehicle-to-home/`, 6 testów, UI: `app/kalkulatory/
    vehicle-to-home/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 362/362 (12 nowych łącznie z refaktoryzacją),
    `pnpm build` czysto, Playwright (80/10/60%/20000zł/1000cykli → "42,0 kWh", "0,42 zł/kWh",
    żółty werdykt z ostrzeżeniem "tylko V2L" przy niezaznaczonym checkboxie).

## Decyzje i uzasadnienie (c.d. 65)

- **2026-09-04 — Ekran 18, Moduł 3: "Wpływ temperatury na wydajność" (dawne 2.33, Wzorzec D) —
  przejście na pojedyncze buildowalne ekrany Modułu 3 po wyczerpaniu Modułów 2 i 4.** Moduł 2
  doszedł do 13/17 (reszta wymaga bazy komponentów lub progu nieobecnego w źródle), Moduł 4 do
  29/34 (Ekrany 3/25/31/32/33 blocked — brak normy/wzoru/danych historycznych). Moduł 3 miał
  dotąd tylko 2 ekrany (jako reprezentanci wzorców A i C z decyzji 2026-08-29) — ten ekran to
  pierwszy krok w kierunku pełnego wyliczenia per-funkcja tego modułu, wybrany bo ma kompletny,
  gotowy wzór fizyczny w źródle.
  - Wzór `P_rzeczywista = P_nominalna × (1 + γ×(T_panel−25))` 1:1 ze źródła (Sekcja B). Oba
    parametry wejściowe źródło podaje jako ZAKRESY, nie liczby: przyrost temperatury panelu
    ponad otoczenie "25-30°C" i współczynnik temperaturowy γ "typowo -0,3 do -0,45%/°C" — oba
    pola wymagają ręcznego wpisania (z podpowiedzią o typowym zakresie w UI), ta sama zasada co
    ΔT w Ekranie 2 M2 (bojler C.W.U.) i przyrost/γ w tym ekranie — nie przyjęto żadnej wartości
    środkowej jako cichego domyślnego.
  - Przykład źródła (35°C otoczenia + 25°C przyrost → 60°C panel, strata ok. 15%) odtworzony
    dokładnie przy γ≈-0,43%/°C — zweryfikowane niezależnie w Pythonie przed implementacją.
  - `lib/core/modules/pv/wplyw-temperatury/`, 5 testów, UI: `app/kalkulatory/
    wplyw-temperatury/page.tsx`. Nowa sekcja "Moduł 3 — ekrany dodatkowe" w
    `docs/rejestr-pokrycia.md` (nie wymuszona do tabeli wzorców A-H, która jest 1:1 z ośmioma
    wzorcami, nie z modułami).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 367/367 (5 nowych), `pnpm build` czysto,
    Playwright (35°C/25°C/-0,43%/450W → "382 W", "60°C", "15,0%", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 66)

- **2026-09-04 — Ekran 8, Moduł 3: "Straty na okablowaniu DC (efekt Joule'a)" (dawne 2.14,
  Wzorzec D) — pełny wzór fizyczny (rezystywność miedzi jako stała) reprodukuje CAŁĄ tabelę
  przykładu źródła naraz, nie tylko jedną wartość.** Wzór `R = ρ×L/S` ze źródła, z ρ_Cu=0,0175
  Ω·mm²/m podanym wprost jako stała — nie wymyślona. Rezystancja pętli liczona dla 2×L (prąd
  płynie przez oba przewody, plus i minus) — standardowa praktyka inżynierska DC, udokumentowana
  transparentnie w kodzie jako założenie, nie ukryta.
  - Przykład źródła Sekcji C (30m, 15A: 4mm²→6%, 6mm²→4%, 10mm²→2,4%) wymagał znajomości napięcia
    (Vmp) do przeliczenia straty mocy na %, którego przykład nie podaje wprost — wyprowadzone
    przez rozwiązanie równania wstecz (Vmp≈65,625V) i zweryfikowane: przy tej wartości WSZYSTKIE
    TRZY punkty przykładu (6%/4%/2,4%) wychodzą dokładnie, co potwierdza poprawność wzoru (gdyby
    wzór był błędny, trafienie we wszystkie trzy wartości jednocześnie byłoby przypadkiem
    astronomicznie mało prawdopodobnym).
  - Dodatkowy element: porównanie strat dla 4 standardowych przekrojów katalogowych (4/6/10/16
    mm² — typowe wartości IEC, nie wymyślone) na jednym ekranie, matching source's own
    porównawczy format tabeli w Sekcji C.
  - `lib/core/modules/pv/straty-okablowanie-dc/`, 6 testów, UI: `app/kalkulatory/
    straty-okablowanie-dc/page.tsx`. Dopisany do sekcji "Moduł 3 — ekrany dodatkowe" w
    `docs/rejestr-pokrycia.md` (razem z Ekranem 18 z poprzedniego PR).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 373/373 (6 nowych), `pnpm build` czysto,
    Playwright (30m/15A/65,625V/4mm² → "6,0%", tabela porównawcza 6,0/4,0/2,4/1,5% dla
    4/6/10/16mm² — dokładnie zgodne z tabelą źródła).

## Decyzje i uzasadnienie (c.d. 67)

- **2026-09-04 — Naprawa dryfu: brakująca deklaracja "Ekspertyza domenowa" wymagana przez GOD
  BOOK §0.2.** Użytkownik zapytał, czy sesja przyjmuje personę doświadczonego elektryka/fizyka
  off-gridu (20 lat doświadczenia), jak nakazuje `docs/god-book/instrukcja-uniwersalna-biblii-
  projektu-v2_5.md` §0.2 ("Ekspertyza domenowa — automatyczna, nie na żądanie"). Sprawdzone:
  merytorycznie tak przez całą sesję (niezależna weryfikacja każdego wzoru w Pythonie przed
  implementacją, wyłapana i udokumentowana sprzeczność fizyczna w przykładzie źródła — punkt
  rosy w `ochrona-wilgoc`, konsekwentne rozróżnianie uniwersalnej fizyki od współczynników,
  których nie wolno wymyślać, realna praktyka inżynierska — np. 2×L dla pętli DC w
  `straty-okablowanie-dc`, priorytetowe potraktowanie MPPT stress-test jako "najważniejszego
  twardego stopu w aplikacji" zgodnie z własnym podkreśleniem źródła) — ale formalna deklaracja
  wymagana przez §0.2 (wpis "Ekspertyza domenowa: ..., poziom: senior/20 lat doświadczenia" w
  `00_Biblia.md`) nigdy nie została zapisana, bo ten projekt nie ma jeszcze pliku o tej
  kanonicznej nazwie (`ZASADY_APLIKACJI.md`/`USTALENIA.md` pełnią tę rolę tymczasowo).
  - To dryf bez świadomej decyzji (GOD BOOK Część Y.2), nie konflikt do rozstrzygania z
    użytkownikiem — naprawiony od razu, nie zapytany.
  - **Ekspertyza domenowa: elektryk/inżynier instalacji off-grid PV (panele, magazyny energii,
    ogrzewanie, bezpieczeństwo elektryczne), poziom: senior / 20 lat doświadczenia w terenie.**
    Obowiązuje dla całej dalszej pracy nad tym projektem — nie tylko od teraz.

## Decyzje i uzasadnienie (c.d. 68)

- **2026-09-04 — Ekran 5, Moduł 3: "Zimowy stress-test napięciowy MPPT (Voc max)" (dawne 2.11,
  Wzorzec D) — źródło samo nazywa to "jednym z najważniejszych twardych stopów w całej
  aplikacji".** Wzór `V_max = Voc×(1+β×(Tmin−25))`, `V_string = V_max×n_paneli` 1:1 ze źródła
  (Sekcja B), z jawnymi progami werdyktu: 🔴 gdy `V_string > limit MPPT`, 🟡 gdy `V_string >
  0,95×limit`, 🟢 inaczej — też 1:1 ze źródła, nie wymyślone.
  - Przykład źródła (Voc 56,5V, β=-0,3%/°C, Tmin=-25°C, 8 paneli → 520V, limit MPPT 450V → 🔴,
    rekomendacja "2 stringi po 4 panele") odtworzony dokładnie: 8 paneli daje 519,8V (🔴), 4
    panele (rekomendacja źródła) daje 259,9V (🟢) — zweryfikowane niezależnie w Pythonie przed
    implementacją, oba warianty przetestowane.
  - β (współczynnik temperaturowy Voc) to zakres ze źródła (-0,29 do -0,32%/°C, "typowo") — pole
    ręczne z podpowiedzią, nie ukryty domyślny (ta sama zasada co ΔT/γ w poprzednich ekranach).
  - UI liczy `hasCritical`/`hasWarning` z poziomów ostrzeżeń (nie bezpośrednio ze `status`), ten
    sam wzorzec co `dobor-bezpiecznika-dc` (M4/E24) — czerwony/żółty/zielony werdykt niezależny
    od dwuwartościowego `Status` enum.
  - **Dopisany do `docs/rejestr-twardych-stopow.md`** (sekcja "Elektryczne/pożarowe") — jeden z
    ważniejszych wpisów w tym rejestrze wg własnej oceny źródła.
  - `lib/core/modules/pv/stress-test-mppt/`, 6 testów, UI: `app/kalkulatory/
    stress-test-mppt/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 379/379 (6 nowych), `pnpm build` czysto,
    Playwright (8 paneli → "520 V", czerwony "Zabronione"; 4 panele → "260 V", zielony "Bezpieczny
    margines" — oba stany zgodne z przykładem i rekomendacją źródła).

## Decyzje i uzasadnienie (c.d. 69)

- **2026-09-04 — Ekran 17, Moduł 3: "Niedopasowanie mocy paneli (mismatch)" (scala dawne
  2.32/2.41, Wzorzec D) — dla stringu szeregowego 2 paneli, tak jak podaje przykład źródła.**
  Wzór `P_rzeczywista = 2×min(I1,I2)×V_wspólne` (prąd stringu ogranicza najsłabszy panel).
  - Przykład źródła (400W/11A + 330W/9A, Vmp=40V → 720W zamiast 730W teoretycznych, strata 1,4%)
    odtworzony dokładnie, zweryfikowany niezależnie w Pythonie przed implementacją.
  - **Napięcie wspólne (Vmp) wpisywane ręcznie** — źródło używa jednej, uśrednionej wartości
    (40V) w swoim przykładzie, ale nie podaje jej jako osobnego pola wejściowego w Sekcji A (tam
    są tylko moc i Imp per panel); próba wyprowadzenia Vmp z P/I każdego panelu osobno (36,36V i
    36,67V) i zsumowania ich jak w prawdziwym obwodzie szeregowym daje INNY wynik niż przykład
    źródła (657W, nie 720W) — sprawdzone w Pythonie. Źródło używa uproszczonego modelu z jedną
    wspólną wartością, więc ta wartość musi pochodzić z zewnątrz (wpisana ręcznie), nie być
    zgadywana ani wyprowadzana przez "poprawniejszą" fizykę, która akurat nie pasuje do przykładu.
  - Twardy próg (Sekcja C: "🔴 różnica mocy paneli >10-15%") zaimplementowany jako trójstopniowe
    kubełkowanie z użyciem OBU podanych granic (< 10% zielone, 10-15% żółte, >15% czerwone) —
    zakres źródła wykorzystany w całości, nie zawężony do jednej wymyślonej liczby. Przykład
    źródła ma różnicę mocy 17,5% → poprawnie ląduje w czerwonej strefie.
  - Sekcja C osobno wspomina "strata może sięgać nawet 18% wg dawnej analizy ryzyka 2.41" — to
    inna liczba niż 1,4% obliczone wzorem z Sekcji B dla tego samego przykładu. Źródło samo to
    tłumaczy ("strata rośnie nieliniowo przy większej różnicy") — nie próbowano tego godzić:
    zbudowany tylko dokładny wzór z Sekcji B, druga liczba (18%) to osobna, nieformułowa
    obserwacja źródła, nie została wdrożona jako osobne obliczenie.
  - `lib/core/modules/pv/niedopasowanie-paneli/`, 5 testów, UI: `app/kalkulatory/
    niedopasowanie-paneli/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 384/384 (5 nowych), `pnpm build` czysto,
    Playwright (400W/11A + 330W/9A + 40V → "720 W", "strata: 1,4%", "różnica mocy paneli: 17,5%",
    czerwony werdykt — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 70)

- **2026-09-04 — Napisano pełną Biblię projektu w kanonicznym formacie GOD BOOK, na wyraźne
  polecenie właściciela projektu ("napisz pełną biblię, żeby projekt odpowiadał w całości
  naszym standardom").** Poprzedzone sprawdzeniem `AKTUALIZACJE.md` w `new-app-standards` (bez
  nowych wpisów od ostatniej synchronizacji tego samego dnia — v2.5 nadal aktualna).
  - **12 nowych plików w repo root** (Część S GOD BOOK, pozycje 1–8 i 10–12; pozycje 9 i 13–14
    już istniały): `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`,
    `02_Dyrektywy_AI_Projektu.md`, `zlote-zasady.md`, `rejestr-decyzji.md` (D1–D19 + Z1),
    `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`, `mapa-wdrozenia.md`,
    `backlog-poza-v1.md`, `dlug-techniczny.md`.
  - **Decyzja projektowa świadomie podjęta przy migracji: NIE re-transkrybować per-moduł
    specyfikacji wszystkich ~579 funkcji z `docs/zrodla/` do nowych plików Części S (pozycja 9,
    "osobny plik per moduł").** `docs/zrodla/` (materiały źródłowe, już istniało) i
    `docs/rejestr-pokrycia.md` (status/wzór/przykład per ekran, już istniało) już pełnią tę
    rolę merytorycznie — kopiowanie ich treści do równoległych plików byłoby złamaniem I.2
    GOD BOOK ("nie kopiuj treści drugi raz"), nie realizacją Części S. `00_Biblia.md`'s tabela
    dokumentów wprost mapuje te dwie pozycje Części S na istniejące artefakty, zamiast je
    duplikować — udokumentowane jawnie w `00_Biblia.md`, sekcja "Tabela dokumentów", żeby nie
    wyglądało to na przeoczenie przy przyszłym audycie Y.9.
  - **`rejestr-decyzji.md` (D1–D19)** zawiera tylko decyzje **strategiczne/fundamentalne**
    (Krok 4 GOD BOOK — blokujące wiele rzeczy naraz), nie każdą z dziesiątek drobnych decyzji
    implementacyjnych per ekran z tej sesji — te zostają w `docs/memory.md` (rozróżnienie opisane
    wprost w nagłówku `rejestr-decyzji.md`). Bez tego rozróżnienia rejestr D# rozrósłby się do
    setek wpisów i przestał pełnić swoją rolę ("co obowiązuje odtąd w całym projekcie").
  - **`mapa-wdrozenia.md`** zbudowana z aktualnego stanu `docs/rejestr-pokrycia.md` (80 ekranów
    `done` na 04.09.2026) — naprawia przy okazji dryf: metryczka w starym `ZASADY_APLIKACJI.md`
    ("Funkcje z zaimplementowanym kodem: 0") nigdy nie była aktualizowana mimo ~100 zbudowanych
    ekranów — nowy dokument zastępuje statyczną metryczkę żywą tabelą per moduł.
  - **`ZASADY_APLIKACJI.md`/`USTALENIA.md` NIE usunięte** — nagłówek każdego oznaczony jako
    "ZASTĄPIONE — treść zachowana", z jawnym mapowaniem sekcja-po-sekcji do nowych plików w
    `00_Biblia.md`. Zero utraconej treści (Część D GOD BOOK, zasada nienaruszalności).
  - `CLAUDE.md` punktowo poprawiony (odsyłacz z punktu 5 na `00_Biblia.md` zamiast na stare
    pliki), `docs/lista-do-zrobienia.md` zaktualizowana (otwarta decyzja z 03.09.2026 domknięta).
  - Zweryfikowane: żaden plik kodu nie zmieniony w tym kroku (czysto dokumentacyjna migracja),
    `pnpm build`/`pnpm test`/`pnpm lint` uruchomione po migracji dla pewności, że nic się nie
    zepsuło (dokumentacja nie powinna wpływać na kod, ale sprawdzone zgodnie z dyscypliną sesji).

