# 19 — Dane środowiskowe (pogoda, klimat, strefy normowe, dane agro)

Powiązane: [01 Architektura](01-architektura.md) · [02 Model danych](02-model-danych.md) · [03 Jądro obliczeniowe](03-jadro-obliczeniowe.md) · [05 Baza danych i offline-first](05-baza-danych-offline.md) · [06 API i sieć](06-api-i-siec.md) · [10 Testy](10-testy.md) · [14 Proces i pamięć](14-proces-i-pamiec.md)

Dotyczy danych o środowisku zewnętrznym, z których korzysta więcej niż jedna aplikacja rodziny: pogoda, klimat, nasłonecznienie, strefy obciążeń normowych, gleba, wegetacja, teren. Nie dotyczy danych wprowadzanych przez użytkownika ani własnej telemetrii aplikacji (czujniki użytkownika zostają w aplikacji, ten rozdział mówi tylko, jakie metadane muszą nieść, żeby dało się ich użyć — 19.6).

Źródło: wpisy U.4 z 06.10.2026 (inzynier-offgrid-pro — kontrakt danych pogodowych; inzynier-szkieletowy-pro — wspólna baza meteorologiczna, stan v2, D144/D154–D160 — **adnotacja 07.10.2026:** odczyt był nieaktualny, aktualny stan to schemat v3, patrz `docs/dane-srodowiskowe-integracja-szkieletowy.md`) oraz decyzja właściciela repo z 07.10.2026: jedna wspólna baza dla całej rodziny, projektowana tutaj, budowana w osobnym repo. Weryfikacja źródeł danych i licencji: `docs/dane-srodowiskowe-raport-zrodel.md` (tylko to repo, nie jest kopiowany do projektów — stan źródeł się starzeje, rozdział nie).

**Status rozdziału (07.10.2026): ✅ zaakceptowany przez właściciela repo (07.10.2026; wcześniej szkic do akceptacji).** Oznaczenia: ✅ ustalone, 🔎 do weryfikacji. Wartości liczbowe poszczególnych źródeł nie są częścią standardu — są w repo danych.

---

## 19.1. Zasada nadrzędna

Jedna wspólna baza referencyjna dla całej rodziny. Projekt nie buduje własnej bazy pogodowej ani klimatycznej, nie wpisuje wartości ręcznie i nie pobiera tych samych danych równolegle własnym kodem. Baza żyje w osobnym repo (`dane-srodowiskowe`), z potokiem skryptów, schematem i wydaniami; ten rozdział jest kontraktem i zbiorem zasad po stronie konsumenta.

**Uzasadnienie:** bez wspólnej bazy każdy projekt odkrywa te same pułapki osobno (strefa czasowa, semantyka znacznika czasu, ciśnienie stacyjne kontra zredukowane, opad narastający, licencje) i buduje niezgodne schematy (wpisy U.4 offgrid i szkieletowego z 06.10.2026, niezależne od siebie).

## 19.2. Warstwy

Baza jest zbiorem **osobnych warstw** o wspólnym opisie pola (19.5). Warstwy mają niezależne wersje, źródła i licencje.

| Warstwa | Zawartość | Charakter |
|---|---|---|
| A. Lokalizacje | stacje, punkty na żądanie, współrzędne, wysokość n.p.m. | statyczna, wersjonowana |
| B. Klimatologia | normały miesięczne, rok typowy (TMY) godzinowy, stopniodni, lata rzeczywiste | statyczna, wersjonowana |
| C. Strefy normowe | strefy obciążenia śniegiem i wiatrem, strefy przemarzania, temperatury projektowe | statyczna, **osobna** od pomiarów (19.9) |
| D. Agro | gleba, susza, opady, przymrozki, ewapotranspiracja, wegetacja (NDVI) | mieszana |
| E. Obserwacje | pomiary stacji (szereg czasowy) | **nie w repo danych** — pobierane na żądanie |
| F. Prognozy | prognoza pogody i alerty | **efemeryczna, poza bazą** — tylko kontrakt i proxy (19.7) |

Do repo danych wchodzą wyłącznie warstwy A–D. Obserwacje i prognozy starzeją się w godzinach; wersjonowana baza nie jest dla nich miejscem.

## 19.3. Nośniki: JSON jako źródło prawdy, reszta jako artefakty ✅

1. **Źródło prawdy: JSON** zgodny ze schematem JSON Schema (`wersjaSchematu`, `wersjaDanych`). JSON da się przeglądać w PR i scalać w git; plik binarny nie — a projekty rodziny pracują wieloma sesjami równolegle.
2. **Artefakty budowane skryptem z JSON, nigdy edytowane ręcznie:**
   - **moduł TS / mały JSON dla konsumenta** — tylko pola i lokalizacje, które projekt zadeklarował (19.11); [07.10.2026] ✅ DOPISEK: moduł powstaje po stronie konsumenta, z **jednej wspólnej paczki** pobieranej przez wszystkie aplikacje tak samo (19.13); repo danych nie generuje modułów per projekt;
   - **SQLite / dump SQL / Parquet** — dystrybucja pełna: zapytania serwerowe (najbliższa stacja, statystyki), import do Postgresa (backend), analizy. Budowany powtarzalnie bajt w bajt; konflikt scalania pliku binarnego rozstrzyga się przebudową, nie ręcznie.
3. **SQL nie jest w ścieżce obliczeń aplikacji offline-first.** Rdzeń nie czyta bazy z platformy (01.1); dane wchodzą do silnika jako wygenerowany moduł. Powód: przeglądarkowy SQLite (WASM) to ciężar bez zysku przy danych rzędu dziesiątek KB, a pełne godzinowe lata (rząd 100 MB) w ogóle nie powinny trafić do paczki PWA.
4. Backend z Postgresem (np. farmer360) importuje warstwy A–D z wydania do tabel referencyjnych, a szeregi czasowe obserwacji trzyma w osobnej tabeli (np. Timescale) — poza wydaniem bazy.
5. **Skrypt generujący commitowane dane sprawdza wersję interpretera na starcie** [07.10.2026, źródło: inzynier-szkieletowy-pro, 06.10.2026]. Minimalna wersja jest w kodzie skryptu, nie tylko w README. Powód: ta sama przebudowa dała różnicę 0,1 K·d w 13 ze 124 serii stopniodni, bo od Pythona 3.12 `sum()` liczb zmiennoprzecinkowych jest kompensowany, a zaokrąglenie na granicy x,x5 przeniosło różnicę ostatniego bitu do danych. Walidacja porównuje przebudowę z plikami w repo: różnica jest błędem do wyjaśnienia, nie „szumem”.

## 19.4. Wydania i wersje ✅

- Wydanie = tag w repo danych + `CHECKSUMS` (SHA-256 każdego artefaktu) + `CHANGELOG-danych.md`.
- Konsument **przypina** `wersjaSchematu` i `wersjaDanych`; aktualizacja jest świadoma, nie automatyczna.
- **Zmiana wartości, która zmienia wyniki istniejących projektów użytkowników**, jest klasą „wpływ na wyniki” (przykład z wpisu szkieletowego: stopniodni 3600 → 4170 K·d zmieniły straty cieplne Warszawy o +15,8 %). Wymaga decyzji właściciela konsumenta i wpisu w jego rejestrze decyzji; nie przechodzi „po cichu” z aktualizacją danych.
- Oryginały źródeł przechowywane **bez zmian** (z SHA-256 i datą pobrania); każda liczba w bazie odtwarzalna z oryginału skryptem.

## 19.5. Opis pola — obowiązkowy ✅

Każde pole warstw A–D niesie w schemacie: **jednostkę**, **wariant** (np. GHI/POA, ciśnienie stacyjne/zredukowane do poziomu morza, opad na przedział/narastający, średnia/porywy), **pochodzenie** (`pomiar` / `reanaliza` / `wyliczone: <wzór>` / `norma: <oznaczenie>`), **źródło**, **okres**, **znaczniki jakości** wydawcy (np. niepełny ciąg, stacja wysokogórska), **licencję i atrybucję** (19.10). Pole wyliczone jest sprawdzane testem round-trip względem wzoru w kodzie konsumenta (10).

**Zasada „brak ≠ 0”:** brak danych to jawny stan (`null` + powód), nigdy zero i nigdy wypełnienie (zgodne z 03: brak danych nie daje „zielonego”). Doba/miesiąc z niekompletnych rekordów = `null`, nie średnia z tego, co jest.

## 19.6. Czas, metadane źródła i import cudzych danych ✅

Plik albo strumień pogodowy (własna stacja użytkownika, import CSV, wysyłka z urządzenia) wolno zaimportować dopiero z kompletnym opisem; **metadanej nie zgadujemy** — import bez niej jest blokowany albo oznaczony 🟡 z jawnym założeniem:

1. **Legenda:** kolumny, nagłówek, separator pól i dziesiętny, znaczniki braku (`-999`, puste, `---`) → stan „brak”.
2. **Czas:** format, **strefa** (UTC / czas lokalny stały / z przestawianiem), **krok zapisu**, **semantyka znacznika** (odczyt chwilowy, średnia z przedziału, koniec przedziału). Błędna semantyka daje błąd energii o czynnik kroku; znacznik godzinowy PVGIS jest umowny i wymaga korekty o offset (przykład z offgrid, D22).
3. **Wariant i jednostka każdej wielkości** (19.5), wysokość czujnika, osłona radiacyjna (temperatura powietrza ≠ temperatura komponentu).
4. **Metadane stacji:** współrzędne, wysokość n.p.m.
5. Dane godzinowe w bazie są w **UTC**; doby (np. do stopniodni) liczone po dobie UTC — konsument, który liczy w czasie lokalnym, musi to uwzględnić 🔎.
6. **Kopia strony wydawcy zbioru** (nie tylko pliki danych) trafia do repo danych razem z datą pobrania. [07.10.2026] ✅ DODANO — źródło: szkieletowy 06.10.2026: znacznik jakości („-” przed nazwą stacji = typowy rok z niepełnego 30-letniego ciągu, „mogą być obarczone błędem”) istniał tylko na stronie HTML pod tabelą, a pliki danych go nie niosły — dwie stacje z ciągiem 11 i 14 lat były domyślne bez ostrzeżenia. Znaczniki jakości przenosimy do **metadanych rekordu** (nie tylko do opisu zbioru), żeby UI mógł je pokazać w miejscu wyboru rekordu (19.11).

## 19.7. Pomiar a prognoza; dostęp zewnętrzny ✅

- Kontrakt rozróżnia `pomiar` i `prognoza`; prognoza niesie **czas wydania, horyzont, krok i źródło**. Ekran nie pokazuje prognozy jako pomiaru ani odwrotnie.
- Prognozy i obserwacje pobiera **serwerowy pośrednik** (proxy, 06): przeglądarka nie woła dostawcy bezpośrednio (CSP `connect-src 'self'`; niektórzy dostawcy wprost zabraniają wywołań z przeglądarki — PVGIS: AJAX niedozwolony, MET Norway: ruch przez pośrednika z cache). Kształt odpowiedzi i timeout dobiera się na **żywym zapytaniu próbnym**, nie z pamięci o dokumentacji (6.1).
- **Offline-first:** pobrane dane zapisuje projekt użytkownika; brak połączenia pokazuje ostatnie pobranie z datą („dane sprzed …”), nie błąd i nie pustkę.
- Wybór dostawcy prognozy jest decyzją produktu **po sprawdzeniu licencji w kontekście użycia komercyjnego** (raport źródeł); aplikacja freemium jest użyciem komercyjnym.

## 19.8. Słownik wielkości kanonicznych 🔎

Jedna nazwa, jedna jednostka, jawny wariant. Zbiór startowy (z `WIELKOSCI` w offgrid i pól bazy meteo w szkieletowym); rozszerzany w repo danych wersjonowaniem schematu.

| Wielkość | Jednostka | Warianty do jawnego wyboru |
|---|---|---|
| Nasłonecznienie | W/m² (moc), kWh/m² (suma) | pozioma całkowita/rozproszona/bezpośrednia; na płaszczyznę modułów (nachylenie, azymut); typ czujnika |
| Temperatura powietrza | °C | wysokość czujnika, osłona, temperatura punktu rosy osobno |
| Wilgotność względna | % | — |
| Wiatr | m/s | prędkość/kierunek (°); średnia/poryw; okres uśredniania; wysokość pomiaru |
| Ciśnienie | hPa | stacyjne / zredukowane do poziomu morza |
| Opad | mm | na przedział / narastający (od północy, od resetu) |
| Zachmurzenie | okta lub % | jednostka wprost |
| Śnieg | cm (pokrywa), mm (równoważnik wody) | — |
| Stopniodni | K·d | definicje A (Σ(20−θ) dla θ<15 °C) i B (Eurostat: Σ(18−θ) dla θ≤15 °C) obok siebie; konsument wybiera jawnie |

Wielkości agro (wilgotność gleby, ewapotranspiracja, wskaźnik wegetacji NDVI) — do opisania w repo danych przy pierwszym konsumencie 🔎; do tego czasu żaden projekt nie definiuje ich lokalnie na własną rękę.

## 19.9. Strefy normowe — osobna warstwa ✅/🔎

Obciążenia i parametry z norm (śnieg i wiatr wg PN-EN 1991, temperatury projektowe i przemarzanie) **nie pochodzą ze zbiorów pomiarowych** i nie wolno ich mieszać z pomiarami. Warstwa C:

1. Każda wartość niesie oznaczenie normy, **załącznika krajowego i jego wersji**, strefę i regułę zależności od wysokości (np. strefy śniegowe zależą od wysokości n.p.m.).
2. Dane stref mają **mapowanie strefa ← współrzędne/gmina** z tej samej, wskazanej podstawy (nie zgadywane z odległości).
3. 🔎 **Prawo autorskie do norm:** Polskie Normy są chronione, a reprodukcja niezmienionych fragmentów wymaga zezwolenia PKN (regulamin: zwolnienie przy przedruku do 5 % objętości normy; reprodukcja w sieci jest opłatna). Dopóki właściciel nie rozstrzygnie sposobu pozyskania wartości (zezwolenie, wartości liczbowe z odesłaniem do normy, własne opracowanie), warstwa C nie trafia do wydania publicznego poza projektami, które już mają legalny dostęp do tych norm — decyzja właściciela, nie wykonawcy. **Decyzja właściciela 07.10.2026:** wartości liczbowe wpisujemy **z odesłaniem do normy** (oznaczenie normy, załącznika krajowego i wersji przy każdej wartości), o ile jest to możliwe; zakres dopuszczalnego cytowania ocenia się per wartość przy pierwszym wypełnieniu warstwy 🔎 (prawa PKN — nie rozstrzygnięte; ryzyko przeniesione na etap wypełniania, nie na kształt schematu).
4. 🔎 **Strefa wybierana jako klasa: klasa z mapy, pas niepewności, reguła konserwatywna.** [07.10.2026] ✅ DODANO jako 🔎 — źródło: inzynier-szkieletowy-pro (U.4 07.10.2026, D181–D183, gałąź niescalona z `main`; odczyt tylko do odczytu). Gdy norma dopuszcza w pasie granicznym wartość średnią, a aplikacja wybiera **klasę**, a nie wartość: (a) pokaż klasę z mapy i jawny komunikat o sąsiedniej klasie oraz odległości do granicy, z zaznaczeniem, że odległość jest **szacunkiem z siatki** (w jednym przypadku komórka ok. 5,6 × 3,5 km); (b) szerokość pasa bierz **z normy** (tam 10 km), nie stałą z siatki (tam 15 km było niezgodne); (c) niepewność położenia (np. RMS georeferencji) przekładaj na regułę **„bardziej niekorzystna klasa”**; (d) klas, których dane nie rozdzielają, nie scalaj w jedną (zob. playbook źródeł, Krok 6 pkt 5).

> **[07.10.2026] Gdzie są normy źródłowe:** pełne teksty norm i opracowania, z których pochodzą strefy normowe, leżą w `docs/biblioteka-norm/` (w `new-app-standards`); spis, luki i status pozycji: `docs/katalog-zasobow-wspolnych.md`.

## 19.10. Licencja i atrybucja — przed udostępnieniem ✅

Każde źródło, warstwa i wydanie mają zapis: nazwa licencji, URL, **data sprawdzenia**, wymagana atrybucja (dosłowne brzmienie), użycie komercyjne (tak/nie/warunki), czy licencja wymaga tej samej licencji dla pochodnych (ShareAlike), limity techniczne. Zasady:

- Wydanie poza jedną aplikację nie powstaje, dopóki dla każdej warstwy pole `licencja` nie jest rozstrzygnięte (nie „niesprawdzone”). To odwraca dotychczasową praktykę jednego projektu (D155: „sprawdzenie niepotrzebne”) — dla bazy współdzielonej ryzyko dotyczy wszystkich. **Decyzja właściciela 07.10.2026:** rozstrzygnięcie licencji MIIB/IMGW/PVGIS jest **odroczone do dokończenia aplikacji**; do tego czasu pole `licencja` może mieć jawną wartość „nie sprawdzono” (tak jak w szkieletowym), a bramka z tego punktu obowiązuje **przed publicznym wydaniem aplikacji**, nie przed wewnętrzną współpracą rodziny nad wspólną bazą.
- Atrybucja jest wyświetlana użytkownikowi (stopka/„O danych”) w brzmieniu wymaganym przez źródło; dane przetworzone mają oznaczenie przetworzenia, jeśli źródło tego wymaga.
- **Aplikacje rodziny są użyciem komercyjnym** (freemium, rozdz. 12). Źródło ograniczone do „użytku prywatnego/niekomercyjnego” nie wchodzi do bazy bez pisemnej zgody albo płatnego planu.

## 19.11. Konsument ✅

- Projekt deklaruje w pliku (np. `meteo.konsument.json`) listę pól, warstw i lokalizacji, których używa; generator zwraca podzbiór jako moduł TS. Nie dodajemy martwych pól „na zapas” i nie rozdymamy paczki PWA offline. [07.10.2026] ✅ DOPISEK: filtr działa dopiero przy generowaniu modułu — do projektu wszyscy pobierają identyczną paczkę (19.13); deklaracja z nieistniejącym polem, lokalizacją lub źródłem jest błędem generatora, nie cichym pominięciem.
- Wybór źródła (np. dwa zbiory obok siebie) jest jawny dla użytkownika, a wynik niesie informację, które źródło użyto. Zbiory nie są mieszane po cichu; przy rozbieżności wartości (różne okresy i metody) aplikacja nie rozstrzyga sama, która jest „prawdziwsza”.
- Znacznik jakości wydawcy (niepełny ciąg pomiarowy, stacja wysokogórska) jest **przenoszony do użytkownika** jako ostrzeżenie (z propozycją najbliższych stacji pełnych), nie ukrywany i nie podmieniany automatycznie.
- **TMY składany z miesięcy różnych lat** (PVGIS TMY, typowe lata) nie jest ciągłym przebiegiem roku: reguła metody miesięcznej typu „start od pierwszego miesiąca z kondensacją po miesiącu bez” (ISO 13788) trafia na łagodny miesiąc w środku zimy i daje fałszywy wynik (w opisanym przypadku „kondensat nie odparowuje, 301 g/m²” dla przegrody, która wysycha w maju). 🔎 Reguły „pierwszy miesiąc spełniający warunek” testuj na danych o przebiegu niemonotonicznym; start cyklu liczony po **najdłuższej serii miesięcy bez kondensacji**, oznaczony jako interpretacja. [07.10.2026] ✅ DODANO — źródło: szkieletowy 05.10.2026.
- Test w konsumencie: zgodność wartości z wydaniem (checksum), zakresy fizyczne (RH 0–100 %), round-trip pól wyliczonych.

## 19.12. Zasięg i ograniczenia 🔎

Stan na 07.10.2026: istniejąca baza (szkieletowy, schemat v3; wcześniejsze „v2” = nieaktualny odczyt, adnotacja 07.10.2026) obejmuje wyłącznie Polskę (współrzędne ≈ 49–55° N, 14–24,2° E); rozszerzenie wymaga innych źródeł. Zależność od serwisów zewnętrznych (np. wersje API wyłączane przez dostawców) jest ryzykiem do monitorowania w repo danych, nie w konsumentach.

## 19.13. Jedna paczka, jeden sposób pobierania — dla wszystkich projektów ✅

[07.10.2026] Źródło: decyzja właściciela repo — jedna wspólna metoda dla obecnych i przyszłych projektów; dotychczasowy stan (szkieletowy z własnym `baza-meteo.ts` i skryptami, reszta projektów musiałaby się „dostrajać”) jest zastępowany. Wybrane warianty: kanał = GitHub Release + kopia w repo konsumenta; zakres = jeden plik dla wszystkich, filtr przy generowaniu modułu.

1. **Jedna paczka.** `srodowisko-<wersjaDanych>.json` (+ `.json.gz`, `manifest.json`, `CHECKSUMS`): warstwy A–D z 19.2 (lokalizacje, klimat miesięczny, opady, strefy normowe), opis każdego pola (19.5), źródła i stan licencji (19.10), `wersjaSchematu`, `wersjaDanych`. Bez danych godzinowych i SQLite (dystrybucja pełna, 19.3 pkt 2). Budowana skryptem w repo danych, powtarzalnie bajt w bajt (dwa przebiegi dają identyczne skróty). Rozmiar 0.1.0: ok. 1 MB, ok. 220 KB po gzipie; jeśli kolejne warstwy (agro) zmienią rząd wielkości, dzielimy na pliki **w tej samej obwiedni i tym samym kanale**, nie per projekt.
2. **Jeden kanał.** Wydanie = tag `vX.Y.Z` w repo danych → GitHub Release z assetami (workflow w repo danych). Konsument czyta najpierw `manifest.json`, pobiera paczkę, weryfikuje SHA-256 (plik `.gz` i rozpakowany). Prywatne repo → token **tylko do odczytu** (`DANE_SRODOWISKOWE_TOKEN`) w sekretach CI i środowiska sesji; nie w kodzie, nie w logu.
3. **Kopia w repo konsumenta (`vendor/dane-srodowiskowe/`, commitowana) + lock.** `dane-srodowiskowe.lock.json` przypina `wersjaDanych` i SHA-256 (19.4). Codzienny build i sesje AI nie potrzebują sieci ani tokenu; CI sprawdza, że `vendor/` zgadza się z lockiem. Zmiana wersji tylko świadomym poleceniem (`--zaktualizuj`), nigdy automatycznie; zmiana zmieniająca wyniki obliczeń to klasa „wpływ na wyniki” (19.4).
4. **Różnice między projektami tylko w deklaracji konsumenta** (`meteo.konsument.json`, 19.11): które lokalizacje, źródła, pola, czy strefy normowe. Generator modułu jest wspólny; odmawia, gdy paczka ma nieznany `wersjaSchematu` albo deklaracja wskazuje nieistniejące pole (brak zgadywania; brak danych w paczce = `null`, nie 0 — 19.5).
5. **Zakaz kanałów własnych.** Projekt nie buduje własnej bazy, formatu ani skryptu pobierającego (19.1), nie czyta `dane/` repo danych bezpośrednio i nie trzyma ręcznych kopii wartości. Odstępstwo wyłącznie jako świadomy wyjątek od reguły rodziny (GOD BOOK Y.2, rejestr w `docs/god-book/memory.md`), z inwentaryzacją downstream przed akceptacją (U.3).
6. **Nowy projekt: 4 kroki** (kopia narzędzi, token, pierwsze przypięcie, CI) — `docs/przyklady/dane-srodowiskowe/README.md`. Narzędzia referencyjne (`pobierz-dane-srodowiskowe.mjs`, `generuj-modul.mjs`, przykładowy `meteo.konsument.json` i lock) leżą tam; to dosłowny, przetestowany kod, nie szkielet.
7. **Ewolucja.** Zmiana kształtu paczki = podbicie `wersjaSchematu` + wiersz w `AKTUALIZACJE.md` z receptą dla generatora; stare wydania zostają dostępne. Przed pierwszym wydaniem zewnętrznym obowiązuje bramka licencyjna z 19.10 (dziś `statusLicencji` paczki mówi wprost, że jest niezamknięta).

**Stan (07.10.2026):** kod po stronie repo danych (`skrypty/zbuduj_paczke.py`, `wersja.json`, `schemat/paczka.schema.json`, `.github/workflows/wydanie.yml`) leży na gałęzi `claude/env-data-repos-1t8k77` tamtego repo do czasu jej scalenia. 🔎 ścieżka HTTP (Release API prywatnego repo + pobranie assetu) **nie była sprawdzona na żywym GitHubie** — pierwszy tag wydania jest jej testem; [07.10.2026, później] `waliduj.py` i `zbuduj_ts.py` odsprzężone od konsumenta: wydanie zawiera samodzielny moduł TS `baza-meteo-<wersja>.ts` (typy w pliku, wpis `modulTs` w manifeście; `tsc --strict` OK, 62/62 lokalizacji zgodne z paczką) — do sprawdzenia w jednym konsumencie. pozostałe elementy (budowa powtarzalna, weryfikacja sum, wykrycie podmiany, generator, `tsc --strict`) sprawdzone lokalnie na paczce 0.1.0. 🔎 Przełączenie `inzynier-szkieletowy-pro` z własnego `baza-meteo.ts` na wspólną paczkę — wymaga osobnej zgody właściciela na edycję tamtego repo (test zerowej różnicy: wartości z paczki muszą dać `baza-meteo.ts` bez zmian).
