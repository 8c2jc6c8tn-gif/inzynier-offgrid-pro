# Rejestr twardych stopów — Inżynier Offgrid Pro

Zbiorczy, przeszukiwalny indeks wszystkich warunków, które w dowolnym module aplikacji muszą
**zawsze** skutkować werdyktem 🔴 (`docs/standards/04-walidacja-i-twarde-stopy.md`, 4.3). To jest
**indeks**, nie duplikat logiki walidacji — każda pozycja odsyła do modułu/ekranu i pliku, gdzie
warunek jest faktycznie sprawdzany. Aktualizacja: przy każdym nowym module, który wprowadza własny
twardy stop, dopisz go tutaj (nie usuwaj starych pozycji przy zmianach — `docs/standards/15`, 15.3).

Zakres tego rejestru: **fakty inżynierskie/bezpieczeństwa** ("to jest niebezpieczne/uszkodzi
sprzęt"), nie generyczna walidacja formularza ("pole musi być większe od zera"). Ta druga kategoria
istnieje jednolicie w niemal każdym kalkulatorze (`notPositive`/`outOfRange` w plikach
`warnings.ts`) i jest opisana zbiorczo w sekcji na końcu tego pliku zamiast wypisana pozycja po
pozycji — patrz uzasadnienie 4.3: rejestr służy do audytu bezpieczeństwa *zainstalowanego systemu*,
nie do audytu poprawności formularza webowego.

---

## Elektryczne / pożarowe

- **Zdolność wyłączania (AIC) bezpiecznika niższa niż prąd zwarciowy pakietu** — bezpiecznik
  rozerwie się, tworząc łuk plazmowy, zamiast bezpiecznie przerwać obwód.
  (M4/E24 — `lib/core/modules/baterie/dobor-bezpiecznika-dc/warnings.ts`,
  `aicPonizejPraduZwarciowego`, kod `AIC-PONIZEJ-PRADU-ZWARCIOWEGO`)
- **Pasta miedziowa na aluminium** — korozja galwaniczna połączenia.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`,
  `OSTRZEZENIA_STALE`; cross-ref M5/E4)
- **Metalowe przedmioty luzem na stanowisku montażu baterii** — ryzyko zwarcia podczas pracy przy
  odkrytych terminalach.
  (M11/A7 — `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/constants.ts`,
  pozycja checklisty `brak-metalu-luzem`)
- **Załączenie głównego bezpiecznika/stycznika bez procedury pre-charge kondensatorów
  falownika** — zaiskrzenie i uszkodzenie styków bezpiecznika.
  (M11/A4 — `lib/core/modules/montaz-baterii/podlaczenie-bms/constants.ts`, `OSTRZEZENIA_STALE`)

## Bateryjne

- **Brak BMS z balancerem przed montażem pakietu LiFePO4** — bez balancera ogniwa rozjeżdżają się
  napięciowo, montaż jest niebezpieczny.
  (M11/A1 — `lib/core/modules/montaz-baterii/weryfikacja-ogniw/warnings.ts`, `brakBmsZBalancerem`,
  kod `BRAK-BMS-Z-BALANSEREM`)
- **Różnica napięć między ogniwami LiFePO4 przekracza 0,05 V przed połączeniem w pakiet** —
  wymaga wstępnego zbalansowania.
  (M11/A1 — `lib/core/modules/montaz-baterii/weryfikacja-ogniw/warnings.ts`,
  `roznicaNapiecOgniwZaDuza`, kod `ROZNICA-NAPIEC-OGNIW-ZA-DUZA`)
- **Demontaż pakietu LiFePO4 przy napięciu ogniwa powyżej zalecanych 3,2 V** — pakiet wciąż
  naładowany, ryzyko iskrzenia i uszkodzenia terminali przy odłączaniu.
  (M11/A6 — `lib/core/modules/montaz-baterii/demontaz-pakietu/warnings.ts`,
  `pakietWciazNaladowany`, kod `PAKIET-WCIAZ-NALADOWANY`)
- **Próba ratowania ogniwa LiFePO4 zmierzonego na 0 V** — prawdopodobne przebicie separatora,
  ładowanie grozi pożarem; zalecana utylizacja, nie ratunek.
  (M11/A9 — `lib/core/modules/montaz-baterii/ratowanie-ogniwa/warnings.ts`, `ogniwoZeroWoltowe`,
  kod `OGNIWO-ZERO-WOLTOWE`)
- **Agregat podłączony bezpośrednio do baterii, bez ładowarki/MPPT pomiędzy** — uszkodzenie ogniw.
  (M7/E5 — `lib/core/modules/stress-test/procedura-black-start/constants.ts`, `OSTRZEZENIA_STALE`)
- **Klucz udarowy zamiast dynamometrycznego na terminalach ogniw** — uszkodzenie połączenia/obudowy
  ogniwa.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, pozycja checklisty
  `terminal-m6`, pole `uwaga`)
- **Podkładki sprężyste bezpośrednio na terminalu ogniwa** — obniża pewność połączenia.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, `OSTRZEZENIA_STALE`)

## Bezpieczeństwo życia / montaż

- **Rozpoczęcie montażu baterii LiFePO4 bez pełnego kompletu: mata izolacyjna, klucz
  dynamometryczny z nasadkami izolowanymi, rękawice, okulary, gaśnica w zasięgu ręki** — checklist
  musi być potwierdzona w całości przed werdyktem "Stanowisko gotowe do montażu".
  (M11/A7 — `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/calculator.ts`, status
  `VALID` tylko gdy wszystkie pozycje potwierdzone)
- **Krok procedury Black Start potwierdzony poza kolejnością** — kolejność ma znaczenie (np.
  naładowanie baterii przed podłączeniem agregatu do ładowarki), pominięcie kroku nie liczy się do
  postępu.
  (M7/E5 — `lib/core/modules/stress-test/procedura-black-start/calculator.ts`, kod
  `KROK-POZA-KOLEJNOSCIA` — obecnie poziom `warning`, nie `critical`; do rewizji, patrz
  "Znane luki" niżej)

## Znane luki (świadomie, nie przeoczenie)

- **Moduł 8 (Bezpieczeństwo pożarowe), Ekran 11** — mechanizm agregacji (dowolna pozycja checklisty
  ze statusem `critical` → werdykt czerwony) już działa, ale same dane (`SAMPLE_AUDIT_ITEMS`) są
  demonstracyjne, nie realnym zestawem twardych stopów instalacji. Realne kryteria (np. "brak
  czujnika dymu w sypialni", "gaśnica po terminie ważności") do zdefiniowania, gdy ekran zostanie
  spięty z Modułami 8/9/13 (`docs/rejestr-pokrycia.md`).
- **`KROK-POZA-KOLEJNOSCIA` (Black Start) jest `warning`, nie `critical`** — mimo że opisuje realne
  ryzyko (uszkodzenie sprzętu przy złej kolejności rozruchu). Zostawione świadomie jako pytanie do
  właściciela projektu, nie zmienione samodzielnie w ramach tego audytu (`docs/standards/15`, 15.4
  — nie rozstrzygaj konfliktu/niejasności sam).
- Moduły z ekranami wciąż `todo` (większość Modułu 2, Moduł 1 ekrany 2–4, reszta ekranów 3/4/5/8/9)
  mogą kryć kolejne twarde stopy w treści źródłowej (`docs/domena/`), jeszcze nieprzepisane do
  kodu — ten rejestr rośnie razem z `docs/rejestr-pokrycia.md`, nie wyprzedza go.

## Walidacja danych wejściowych (wzorzec ogólny, nie wypisany pozycja po pozycji)

Niemal każdy kalkulator ma parę `notPositive`/`outOfRange` (albo odpowiednik specyficzny dla pola)
zwracającą `level: "critical"`, gdy wartość wejściowa jest niepoprawna (ujemna/zero/poza fizycznym
zakresem). To nie są fakty domenowe o niebezpieczeństwie — to bramka "dane się nie liczą, dopóki są
bez sensu". Pełna lista plików: `lib/core/modules/*/warnings.ts` (funkcje `notPositive`,
`outOfRange`, `efficiencyOutOfRange`, `copOutOfRange`, `pojemnoscNotPositive`,
`selectedItemNotPositive`).
