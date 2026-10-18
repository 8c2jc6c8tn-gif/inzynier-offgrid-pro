# docs/schematy-transferu/ — rejestr schematów plików transferu między appkami rodziny

> **Status: wzorzec opcjonalny (standard 18.15 i 18.16), nie dotyczy każdego projektu.**
> Folder jest potrzebny tylko tam, gdzie jedna appka rodziny realnie korzysta z danych drugiej.
> Do projektu kopiuje się wyłącznie schematy, w których ten projekt uczestniczy (jako eksporter albo importer), nie cały folder. Dziś jedyny uczestnik: `inzynier-szkieletowy-pro` (eksporter) → `inzynier-offgrid-pro` (importer).
> Założony 18.10.2026 na polecenie właściciela repo.

## Po co

Standard 18.15 mówi, że transfer idzie plikiem z wersjonowanym schematem, a 18.16 opisuje kopertę pliku. Ten folder trzyma **jedno źródło prawdy o kształcie każdego rodzaju pliku**: obie appki testują się względem tego samego schematu i tego samego przykładu, więc zmiana formatu po jednej stronie nie psuje cicho drugiej.

## Zasady rejestru

1. **Jeden schemat = jeden plik** `<schemat>.v<N>.schema.json` (JSON Schema 2020-12), gdzie `<schemat>` to wartość pola `schemat` z koperty, a `N` to `wersjaSchematu`.
2. **Każda zmiana kształtu podnosi `wersjaSchematu`.** Stary plik zostaje (zasada „nic nie usuwamy”), nowy powstaje jako `.v<N+1>.`; bieżąca jest najwyższa wersja. Importer odrzuca wersję wyższą niż zna i migruje w przód starsze (18.16 pkt 4).
3. **Własność ma appka eksportująca.** Tylko ona proponuje zmianę schematu; importer zgłasza potrzeby jej właścicielowi przez `docs/wklad-do-standardu.md`, a decyzję o wniesieniu tutaj podejmuje sesja nad `new-app-standards`.
4. **Do każdego schematu jest przykład** w `przyklady/` (`<schemat>.v<N>.przyklad.json`) z poprawną sumą kontrolną. To ten sam plik testuje obie strony.
5. **Dane w przykładach są fikcyjne** i tak oznaczone w `projekt.nazwa`. Nigdy nie wkładaj tu danych prawdziwego projektu użytkownika.
6. **Plik nie niesie tekstów dla człowieka** (tylko liczby, identyfikatory i kody; tłumaczy appka docelowa, 18.16 pkt 2).

## Transport: plik teraz, pośrednik planowo

Koperta i schemat opisują **zawartość**, nie sposób dostarczenia. Dziś plik jedzie jako plik (18.16). Standard 18.15 zapowiada drugi transport: pośrednika przekazującego tę samą zaszyfrowaną kopertę między własnymi kontami jednego użytkownika (rozdział 20 standardu: projekt zatwierdzony, 🔎 niewdrożony). Walidacja schematem, sprawdzenie sumy kontrolnej i dialog zgody z podglądem (instrukcja importera niżej) obowiązują **przy obu transportach**.

## Rodzaj danych: Seed albo migawka wyników

Domyślnie plik niesie **dane wejściowe (Seed)**, a appka docelowa liczy własnym Kernelem (18.15 reguła 2). **Migawka wyników** (policzone liczby) jest dopuszczona jako wyjątek czasowy i tylko przy łącznym spełnieniu warunków 1–6 z 18.15. Decyzja właściciela: pierwszy transfer szkieletowy→offgrid przekazuje **dane policzone**, bo silnik mostków cieplnych szkieletowego jest trudny i nie ma sensu kopiować go do offgrida.

Wyjątek wygasa, gdy silnik źródłowy zostanie zweryfikowany i przekazany do wspólnego użytku. Wtedy powstaje nowy schemat z danymi wejściowymi (np. `budynek-dane-wejsciowe`), a ten zostaje wycofany z użycia (plik zostaje w rejestrze). Projekt korzystający z wyjątku zapisuje w rejestrze decyzji, co go wygasza.

## Pierwszy schemat: `budynek-sumy-strat` (wersja 1, robocza 🔎)

| Pole w `dane` | Znaczenie | Jednostka |
|---|---|---|
| `przenikanieZMostkamiWK` | suma strat przez przenikanie z mostkami cieplnymi | W/K |
| `wentylacjaWK` | straty wentylacyjne | W/K |
| `powierzchniaM2` | powierzchnia budynku | m² |
| `kubaturaM3` | kubatura | m³ |

Koperta (nagłówek) wg 18.16: `schemat`, `wersjaSchematu`, `rodzajDanych`, `zrodlo`, `wyeksportowano`, `projekt`, `wersjaPaczkiSrodowiskowej` (opcjonalna), `statusWyniku`, opcjonalnie `statusyPol` i `ostrzezeniaKody`, `sumaKontrolna`. Pełny opis w [`budynek-sumy-strat.v1.schema.json`](budynek-sumy-strat.v1.schema.json), przykład w [`przyklady/`](przyklady/budynek-sumy-strat.v1.przyklad.json).

**Co musi potwierdzić eksporter (szkieletowy) przed pierwszym eksportem — dlatego wersja jest robocza 🔎:**
1. Dokładna definicja każdej z czterech wartości: metoda i założenia dla `przenikanieZMostkamiWK` i `wentylacjaWK`; która powierzchnia (ogrzewana użytkowa, całkowita); kubatura brutto czy ogrzewana.
2. Czy `statusyPol` jest potrzebny osobno, czy wystarcza `statusWyniku` (silnik mostków ma wzory „niezweryfikowane wizualnie”, więc status `ESTIMATE` dla `przenikanieZMostkamiWK` jest prawdopodobny).
3. Czy offgrid potrzebuje czegoś jeszcze (np. współrzędnych lokalizacji do własnego klimatu). Nie dodano ich, bo nie podał tego żaden wpis; brak pola to decyzja do podjęcia, nie założenie.
4. Proponowany limit rozmiaru pliku tego schematu: 64 KiB (propozycja, do potwierdzenia przez importera).
Po potwierdzeniu: nowa wersja schematu (jeśli kształt się zmienia) albo zdjęcie 🔎 z tego opisu.

## Instrukcja dla eksportera (appka źródłowa)

1. Zbuduj obiekt `dane` z policzonych wartości. Jednostka jest w nazwie klucza, `null` = nie wpisano, `0` = zero. Eksportuj tylko, gdy wynik ma status `VALID`, `VALID_WITH_WARNINGS` albo `ESTIMATE`. Przy `INCOMPLETE`, `OUT_OF_SCOPE` i `INVALID_INPUT` odmów eksportu z komunikatem po ludzku.
2. Ustaw `statusWyniku` na **najsłabszy** status spośród wartości (3.7 pkt 2). Opcjonalnie wypełnij `statusyPol` i `ostrzezeniaKody` (same kody ostrzeżeń, bez tekstu).
3. Wypełnij `zrodlo` (nazwa appki, numer wersji programu wg 3.8, opcjonalnie identyfikator builda), `wyeksportowano` (ISO 8601 ze strefą), `projekt` (id, nazwa wpisana przez użytkownika).
4. Policz `sumaKontrolna`: SHA-256 z kanonicznego JSON pola `dane` (RFC 8785). Pomocniczy skrypt: `node docs/schematy-transferu/sprawdz-sume-kontrolna.mjs <plik> --wypisz`. W kodzie appki użyj biblioteki kanonizującej zgodnej z RFC 8785 albo własnej kanonizacji sprawdzonej względem tego skryptu na przykładzie.
5. Zwaliduj gotowy plik **schematem** (np. Ajv albo Zod wygenerowany ze schematu) przed zapisem. Plik, który nie przechodzi walidacji, nie jest zapisywany.
6. Pokaż użytkownikowi, co eksportujesz (podgląd), i zapisz plik. Rozszerzenie pliku wybiera klaster (w marce „Inżynier Pro” przykładowo `.inzpro.json`) — to wybór lokalny, nie wymóg rodziny.

## Instrukcja dla importera (appka docelowa)

1. Sprawdź rozmiar pliku **przed** odczytem (limit z punktu „Co musi potwierdzić…”).
2. Zwaliduj plik schematem. Odrzuć przy `wersjaSchematu` wyższej niż znana (czytelny komunikat „zaktualizuj aplikację”). Starsze wersje migruj w przód. Nieznane pola zignoruj, brakujące wymagane odrzuć.
3. Sprawdź `sumaKontrolna`. Niezgodna = plik uszkodzony, odrzuć. Pamiętaj: zgodna suma **nie** dowodzi wiarygodności źródła.
4. Pokaż **dialog zgody z podglądem** zawartości; nic nie trafia do projektu bez zgody (7.5).
5. Zaimportuj wartości jako **cudze, nieliczone tu** (oznaczenie w UI i raporcie) z napisem „stan na <wyeksportowano>” i prośbą o ponowny import po zmianie projektu źródłowego. Brak synchronizacji zwrotnej.
6. **Dziedzicz najsłabszy status.** Wynik oparty na migawce o statusie `ESTIMATE` nie jest prezentowany jako `VALID`. Kody z `ostrzezeniaKody` tłumacz własnym słownikiem (17.2).
7. Nie wnioskuj o danych pogodowych ani strefach z pliku; te pochodzą z paczki `dane-srodowiskowe` (19.13).
8. Zapisz w rejestrze decyzji projektu, że korzystasz z wyjątku „migawka wyników” i co go wygasza (18.15, warunek 6).

## Test kontraktowy (po obu stronach)

- **Eksporter:** test buduje plik z przykładowego projektu, waliduje go schematem, a `sumaKontrolna` sprawdza skryptem lub własną kanonizacją. Plik ma być zgodny z `przyklady/*.przyklad.json` pod względem **kształtu** (te same pola i typy).
- **Importer:** test wczytuje `przyklady/*.przyklad.json`, importuje go i sprawdza, że (a) walidacja schematem przechodzi, (b) zmiana jednej liczby bez przeliczenia sumy kończy się odrzuceniem, (c) nieznana wyższa `wersjaSchematu` kończy się odrzuceniem z komunikatem, (d) status `ESTIMATE` w pliku skutkuje statusem `ESTIMATE` (nie `VALID`) w importerze.
- Skopiowany do projektu schemat i przykład są NIETYKALNE (nadpis w całości przy synchronizacji); zmiana tylko tu, przez sesję nad `new-app-standards`.

## Czego ten folder nie robi

Nie zastępuje współdzielonej subskrypcji ani wspólnej tożsamości (18.15, „Granica”), nie przenosi danych pogodowych (19.13) i nie jest podpisem cyfrowym.
