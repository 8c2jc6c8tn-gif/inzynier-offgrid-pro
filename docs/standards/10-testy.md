# 10 — Testy

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [02 Model danych](02-model-danych.md) · [11 CI/Deployment](11-ci-deployment.md)

---

## 10.1. Zakres obowiązkowy

**Reguła.** Każdy nowy moduł — niezależnie od warstwy (domena, aplikacja, infrastruktura, prezentacja) — ma testy, zanim zostanie uznany za gotowy. Brak testu nie jest dopuszczalnym stanem końcowym, tylko otwartym zadaniem.

**Uzasadnienie.** Test jest jedynym dowodem, że moduł faktycznie odpowiada temu, co obiecuje standard i specyfikacja domenowa — nie samo "kompiluje się" czy "wygląda dobrze przy jednym kliknięciu". Decyzja właściciela projektu (2026-09-01): to obowiązuje bez wyjątku dla żadnej warstwy, także UI — wcześniejsza, łagodniejsza wersja tej reguły ("automatyczne testy UI tam gdzie opłacalne") jest uchylona.

- **Jądro logiki domenowej:** testy jednostkowe, z wartościami referencyjnymi (patrz podwójna weryfikacja, rozdział 03.4).
- **Profile kontekstowe:** walidacja schematem w CI (rozdział 02.1).
- **Ścieżki użytkownika (UI):** automatyczny test (jednostkowy komponentu i/lub e2e ścieżki) po każdej większej zmianie widocznej dla użytkownika. Ręczna weryfikacja w przeglądarce/na urządzeniu jest dodatkiem do automatycznego testu, nie jego zamiennikiem.
- **Warstwa aplikacyjna i infrastruktura** (use case'y, adaptery, route handlery): test co najmniej na ścieżce głównej i jednym przypadku błędu.

**Zasada podstawowa: "kompiluje się bez błędów" ≠ "działa poprawnie".** Typecheck przechodzący nie jest dowodem poprawności logiki.

## 10.2. Minimalny zestaw testów per moduł

Dla każdej funkcji/modułu logiki domenowej, obowiązkowo:
1. Przypadek nominalny (typowe, poprawne dane).
2. Wartości graniczne (skrajne, ale wciąż poprawne dane wejściowe).
3. Błędne jednostki lub zakres poza dozwolonym.
4. Brakujące dane (test statusu `INCOMPLETE`, rozdział 03.3).
5. Regresja dla każdego wykrytego wcześniej błędu — błąd raz znaleziony dostaje test, który nigdy więcej nie pozwoli mu wrócić po cichu.

Testy są deterministyczne — brak losowości, brak zależności od czasu systemowego czy zewnętrznej sieci w teście jednostkowym.

## 10.3. Test integracyjny całego jądra na danych domyślnych

**Reguła.** Dla projektów z architekturą wielomodułową (rozdział 01.2) — jeden test rejestrujący wszystkie moduły, przeliczający je na danych domyślnych nowego projektu, sprawdzający że żaden moduł nie kończy status `BŁĄD` na danych startowych, i weryfikujący że propagacja zmian (kaskada "dirty") poprawnie przechodzi przez cały graf zależności.

**Uzasadnienie.** Ten pojedynczy test wyłapuje całą klasę błędów integracyjnych, których żaden test jednostkowy pojedynczego modułu nie zobaczy — sprawdzone w praktyce jako skuteczne (realnie wykrywał błędy przed wdrożeniem).

## 10.4. Definicja ukończenia zadania (DoD)

Zadanie jest ukończone, gdy: kod działa, testy przechodzą, typowanie nie zgłasza nowych błędów, nie ma martwego kodu ani nieużywanych importów, dokumentacja (w tym `docs/memory.md` jeśli dotyczy — rozdział 14) została zaktualizowana, zmiana nie narusza innych modułów.

[29.09.2026] ✅ DODANO — dla ekranu (nowego albo zmienionego) DoD obejmuje dodatkowo komplet warstw z **8.12** (autosave, tłumaczenia we wszystkich językach minimalnego zestawu, `?` przy polach, „i” przy tytule, opis narzędzia AI) oraz zielone strażniki 11.9.

## 10.5. Kompleksowy audyt modułu wg 8 uniwersalnych kryteriów (K1–K8)

[10.09.2026] ✅ DODANO — źródło: projekt inzynier-szkieletowy-pro, zebrane mechanizmem U.4 GOD BOOK. Kontekst powstania: w ramach audytu 38 modułów Kernela tego projektu wypracowano i zastosowano w praktyce na 20+ modułach zestaw kryteriów opisanych niżej.

**Kontekst.** "Testy istnieją i przechodzą" (10.1–10.2) nie znaczy "testy sprawdzają to, co naprawdę trzeba". Dla projektów z architekturą wielomodułową (jądro logiki domenowej + rejestr modułów, każdy moduł deklaruje `dependsOn`/`produces` — rozdział 01.2/03) każdy moduł — nie tylko nowy, także dojrzały, od dawna "zielony" — zasługuje na drugą, głębszą warstwę audytu wg ośmiu uniwersalnych kryteriów niżej, niezależną od minimalnego zestawu testów (10.2).

**Zasada nadrzędna.** Status kryterium nigdy nie jest zgadywany. Kryterium bez realnego sprawdzenia zostaje otwarte (nieaudytowane), nie oznaczone jako spełnione — nawet jeśli "pewnie jest ok". Audyt modułu czasem uczciwie kończy się wnioskiem "nic tu nie było do naprawienia" — to też jest wynik audytu, nie porażka, o ile wynika z realnego sprawdzenia, nie z założenia.

| # | Kryterium | Co dokładnie sprawdza | Jak zweryfikować |
|---|---|---|---|
| K1 | Poprawność obliczeń | Kluczowy wzór/wzory dają WŁAŚCIWĄ liczbę, nie tylko "jakąś" liczbę | Przykład kontrolny z dokumentu źródłowego domeny lub ręczne przeliczenie krok po kroku w komentarzu testu |
| K2 | Przypadki brzegowe | Zero/skrajne/niekompletne dane wejściowe nie crashują, dają sensowny (nie NaN/Infinity) wynik | Test na dolnej/górnej granicy realnego zakresu wejść tego modułu |
| K3 | Walidacja | Każda reguła walidacyjna modułu ma test POZYTYWNY (wyzwala się) i NEGATYWNY (nie wyzwala się przy poprawnych danych) | n/d dla modułów bez logiki walidacyjnej (czyste agregatory/przeliczniki) |
| K4 | Kontrakt wejściowy | Moduł czytany jest przez ŻYWY silnik/rejestr z REALNYMI (nie ręcznie sklejonymi) wynikami swoich zależności, nie tylko wołany bezpośrednio z fixture'em | Test faktycznie rejestruje i przelicza zależności przez żywy silnik, nie tylko importuje go ozdobnie. n/d dla modułów bez zależności |
| K5 | Kontrakt wyjściowy | Jeśli inne moduły czytają wynik tego modułu, przynajmniej jeden test (w tym module lub w konsumencie) sprawdza, że pole faktycznie używane przez konsumenta ma oczekiwany kształt/wartość | n/d dla modułów liściowych bez konsumentów. Patrz pułapka K5 niżej |
| K6 | Niekompletność | Brak wymaganej zależności/danych wejściowych daje jawny stan "niekompletne" (nigdy fabrykowany wynik, nigdy wyjątek) | Test z celowo brakującą zależnością/danymi wejściowymi — w tym przypadek "nic w ogóle nie ustawione", osobno od "ustawione, ale niepełne" |
| K7 | Czystość jądra | Moduł logiki domenowej nie importuje warstwy prezentacji/platformy (UI framework, DOM, window, fetch, storage przeglądarki) | Wymuszane najlepiej automatycznie (hook/lint reguła) — audyt tylko odnotowuje, że sprawdzone dla tego modułu |
| K8 | Zgodność źródłowa | Kluczowe stałe/progi zweryfikowane względem dokumentu źródłowego domeny; świadome rozbieżności mają jawny, datowany wpis (nie cichą różnicę) | Porównanie z materiałem źródłowym domeny, gdzie dotyczy — n/d dla projektów bez "twardych faktów źródłowych" (norm, specyfikacji) |

Legenda statusu przy prowadzeniu audytu: ✅ sprawdzone i potwierdzone · ❌ sprawdzone i BRAKUJE (realna luka) · ⬜ jeszcze nieaudytowane · n/d nie dotyczy tego modułu.

**Pułapka K5 — "fallback nieodróżnialny od realnej wartości".** Częsty, subtelny sposób, w jaki test K5 daje fałszywe poczucie bezpieczeństwa: producent ma pole wyjściowe opcjonalne/echo, konsument czyta je z fallbackiem na wypadek nieobecności (`?? domyślna`). Jeśli WSZYSTKIE istniejące testy tego konsumenta rejestrują producenta z wartością akurat równą temu fallbackowi, test "przechodzi" identycznie dla poprawnego kodu i dla hipotetycznie zepsutego kodu, który w ogóle nie czyta pola producenta i zawsze używa fallbacku — żadna dotychczasowa asercja nie odróżnia tych dwóch przypadków. Weryfikacja: dla każdego pola konsumowanego przez inny moduł sprawdź, czy przynajmniej jeden test używa wartości NIEDOMYŚLNEJ i porównuje wynik do wartości przy domyślnej. Diagnoza szybsza niż pełne śledzenie kodu: sprawdź, czy konsument traktuje zależność jako WYMAGANĄ (bramka na stan niekompletny przy jej braku — wtedy nie ma miejsca na fallback, ryzyko nie istnieje) czy OPCJONALNĄ z własnym fallbackiem (wtedy ryzyko realne, wymaga testu z wartością nietrywialną). Liczba konsumentów nie przewiduje ryzyka — trzeba sprawdzić każdego z osobna, nie ekstrapolować z pierwszych kilku.

**Pułapka K3 — "walidacja nigdy niepotwierdzona przez samą funkcję walidującą".** Odkryta dopiero po kilkunastu audytach modułów, w praktyce częstsza niż pułapka K5: gałąź obliczeniowa stojąca ZA kodem walidacji jest dobrze przetestowana (np. pole `przyczyna`/status w wyniku obliczeń), i istniejący test sprawdza TO pole — ale żaden test nigdy nie wywołuje samej funkcji `zwaliduj<Modul>(...)` i nie sprawdza, że odpowiedni `KomunikatWalidacji` (kod/poziom) faktycznie się pojawia. Te dwie rzeczy nie są równoważne — pole wyniku może być całkowicie poprawnie przetestowane, a funkcja walidująca może nigdy nie zostać wywołana w żadnym teście, więc realny błąd w NIEJ (zły kod, zły poziom, odwrócony warunek, literówka w porównaniu) przejdzie niewykryty. Zaobserwowano 6 modułów z rzędu w jednym projekcie z tą samą luką, zanim wzorzec został nazwany. Weryfikacja — tańsza i pewniejsza niż śledzenie logiki: wypisz WSZYSTKIE kody z pliku walidacji modułu (i wszystkie odrębne gałęzie w obrębie tego samego kodu, jeśli funkcja ma `if/else if` generujące różne komunikaty pod tym samym kodem), potem grepem sprawdź w pliku testowym, które z nich faktycznie występują w asercji typu `komunikaty.find(k => k.kod === "XXX-00Y")` wywołanej na wyniku SAMEJ funkcji walidującej (nie tylko na polu wyniku obliczeń). Rekomendowane jako PIERWSZY krok audytu K3 każdego modułu, przed resztą kryteriów.

**Kolejność audytu.** Moduły źródłowe grafu zależności najpierw, potem w kolejności `dependsOn` — audyt modułu X może wtedy założyć, że jego zależności są już przeaudytowane, więc K5 sprawdzany "w dół" (X jako konsument) jest już częściowo pokryty przez wcześniejsze audyty "w górę" (X jako producent dla kolejnych modułów).

**Gdzie żyje kod testów audytu.** Bez nowego, równoległego folderu duplikującego testy jednostkowe — rozszerza się istniejący plik testów modułu. Jedyny uzasadniony nowy, osobny folder to miejsce na testy wieloetapowe/całego grafu, które nie mają naturalnego domu w jednym module (np. "zmiana w module źródłowym poprawnie płynie jednocześnie przez trzy różne gałęzie grafu naraz").

**Uzasadnienie.** K1–K7 nie są specyficzne dla żadnej domeny — to uniwersalna checklista kompletności testów dla dowolnego projektu z architekturą jądro logiki domenowej + rejestr modułów czytany przez żywy silnik z jawnym kontraktem zależności (K8 dotyczy tylko projektów liczących wg norm/dokumentów źródłowych, ale przenosi się na każdy projekt z "twardymi faktami źródłowymi"). Obie pułapki (K3 i K5) są łatwe do popełnienia i praktycznie niewidoczne bez systematycznego, kryterium-po-kryterium przeglądu — nawet gdy pokrycie testami "wygląda" kompletne. Metodologia sprawdzona w praktyce: audyt 38 modułów Kernela projektu inzynier-szkieletowy-pro, ujawniła realne luki pokrycia w większości dotąd zaudytowanych modułów.

## 10.6. Sprzątanie dev-serwera przed e2e — po porcie, nigdy po nazwie procesu

[16.09.2026] ✅ DODANO — źródło: zero-waste (U.4). `next dev` (i analogiczne polecenia innych frameworków) to drzewo procesów, nie jeden proces (`npm run dev` → `sh -c next dev` → `node .../next dev` → liść, np. `next-server`, który realnie trzyma port i pamięć). Gdy proces odpalający to drzewo ginie gwałtownie (przerwany bieg e2e, timeout narzędzia, `SIGKILL` z zewnątrz), sygnał czasem nie dociera do liścia i zostaje on osierocony — w praktyce zaobserwowany żywy 44 minuty, zużywający 5,6 GB RAM.

**Reguła.** Sprzątanie dev-serwera przed uruchomieniem e2e celuje w **PORT**, nigdy we wzorzec nazwy procesu (`pkill -f "next dev"` i podobne) — `cmdline` liścia drzewa procesów (np. `next-server (v15.5.25)`) może nie zawierać podciągu polecenia, którym go uruchomiono, więc dopasowanie po nazwie zawodzi w sposób niewidoczny bez sprawdzenia w `/proc`. `lsof -ti:<port>` bywa niewiarygodny w środowiskach kontenerowych sandboxowych (ograniczenia namespace/uprawnień) — `fuser <port>/tcp` jest sprawdzonym, odporniejszym zamiennikiem. Krok `pretest` sprzątający port (`SIGTERM`, odczekanie, `SIGKILL` jeśli proces przeżył) niezależnie od tego, jak zakończył się poprzedni przebieg, jest tańszy niż diagnozowanie zombie procesów po fakcie.

## 10.7. Niestabilny test e2e nigdy nie jest domyślnie "flaky"

[16.09.2026] ✅ DODANO — źródło: zero-waste (U.4). Etykieta "flaky, uruchom ponownie" bez diagnozy jest kuszącym skrótem, który w praktyce tego projektu za każdym razem krył realny błąd produkcyjny, nie szum środowiskowy (patrz 16.7 — trzykrotnie ten sam wzorzec błędu znaleziony właśnie dzięki odmowie tego skrótu).

**Reguła.** Niestabilny test e2e wymaga, PRZED jakąkolwiek etykietą "flaky": powtórzenia w izolacji i pod obciążeniem, oraz realnej diagnozy stanu/DOM-u w chwili awarii (nie samego faktu, że test czasem czerwony). Dopiero brak powtarzalności PO takiej diagnozie kwalifikuje coś jako szum środowiskowy — nigdy sam brak powtórzenia w kolejnym przebiegu CI.

## 10.8. E2E offline dla Service Workera własnego — bez nowych zależności

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW (5.8).

**Reguła.** Test E2E Service Workera własnego nie wymaga nowego frameworka testowego — `node --test` (wbudowany w Node.js) + biblioteka `playwright` (sterowanie przeglądarką), nie `@playwright/test` (osobny test-runner, zbędny obok już istniejącego `node --test`). Test aktualizacji SW przechodzi przez **dwa prawdziwe, kolejne buildy** produkcyjne (nie jeden build + ręczna zmiana pliku) — losowy `BUILD_ID` frameworka przy każdym buildzie daje naturalnie nową wersję SW, bez potrzeby sztucznego symulowania zmiany. Lista stron do przetestowania offline pochodzi z manifestu buildu (wygenerowanego automatycznie), nie z ręcznie utrzymywanej listy — ręczna lista rozjeżdża się z rzeczywistą strukturą aplikacji przy pierwszej dodanej stronie, o której ktoś zapomni.

**Strażnik "puste przejście".** Test musi zawierać przypadek żądania, którego SW **nie obsługuje** (nie ma go w cache, nie pasuje do żadnej strategii) — takie żądanie ma jawnie **zawieść** offline (błąd sieci), nie zwrócić pustą/domyślną odpowiedź. Bez tego strażnika wszystkie pozostałe asercje testu bywają fałszywie zielone — SW przechwytujący każde żądanie i zwracający cokolwiek (zamiast pozwolić mu zawieść, gdy nie ma dobrej odpowiedzi) maskuje realne dziury pokrycia cache'u, bo test nie odróżnia "poprawnie obsłużone z cache" od "przypadkiem coś zwrócone". W praktyce: zanim kontekst przeglądarki przejdzie offline, sprawdź wprost, że żądanie do trasy nieobsługiwanej przez SW (np. `/api/**`) faktycznie zawodzi po `context.setOffline(true)` — inaczej błąd w samej konfiguracji `setOffline` (np. przechwycone przez inny mechanizm) dałby fałszywie zielone testy na wszystkim, co następuje.

**Dodatkowe szczegóły implementacji.** [24.09.2026, uzupełnienie po odczytaniu dosłownego źródła] Dowód, że odpowiedź faktycznie poszła przez SW (nie przez sieć mimo trybu offline): `response.fromServiceWorker()`. Liczenie przeładowań strony: `request.isNavigationRequest()` na głównej ramce (`page.on('request', ...)`), nie zdarzenie `framenavigated` — to drugie liczy podwójnie przy `history.replaceState()` używanym przez router frameworka. Serwer produkcyjny (`next start`/odpowiednik) uruchamiany z opcją odseparowania od procesu testowego (np. `{detached: true}` w Node.js) i ubijany przez zabicie **grupy procesów** (`process.kill(-pid)`), nie pojedynczego procesu — polecenia `pkill -f`/`pgrep -f` po nazwie ryzykują trafienie i ubicie własnej powłoki wywołującej test, jeśli nazwa procesu jest zbyt ogólna.

Przykład (dosłowny kod core'u testowanego SW): `docs/przyklady/pwa/sw-rdzen.js`.

## 10.9. E2E domyślnie na buildzie produkcyjnym — `dev` tylko jako szybka pętla robocza

[25.09.2026] ✅ DODANO — źródło: zero-waste (U.4, `rejestr-decyzji.md` D143–D146), rozstrzygnięte przez właściciela repo: build produkcyjny jako domyślny. Trzy znaleziska tego samego bloku mają jedną przyczynę — e2e uruchamiane wyłącznie na serwerze deweloperskim (`next dev` lub odpowiednik).

**Przypadek, który uzasadnił regułę.** Service Worker jest w trybie deweloperskim wyłączony (5.8 — SW w dev samo-wyrejestrowuje się), więc tryb offline aplikacji PWA **nie miał żadnego testu**. W produkcji SW w ogóle się nie instalował — jeden plik z listy precache zwracał 404 przez middleware i18n, a instalacja precache jest atomowa (5.8). Suite e2e był zielony przez cały ten czas.

**Reguła.** Suite e2e uznawany za dowód działania (DoD 10.4, CI) biegnie na **buildzie produkcyjnym** (`next build` + `next start` lub odpowiednik). Serwer deweloperski wolno używać wyłącznie jako szybkiej pętli roboczej przy pisaniu testu — zielony wynik na `dev` nie jest dowodem niczego, co zależy od buildu (SW/offline, precache, nagłówki, optymalizacje, middleware w trybie produkcyjnym). Funkcje PWA/offline są testowalne **tylko** na buildzie produkcyjnym (10.8).

**Gdy e2e świadomie biegnie na `dev` (pętla robocza) — dwa znane źródła niestabilności.**
1. **Hydratacja nie kończy się przed pierwszą akcją testu** — kliknięcie trafia w element jeszcze bez podpiętych handlerów. Test czeka na **jawny sygnał gotowości wystawiony przez samą aplikację** (np. atrybut `data-hydrated` ustawiany na `<html>` w efekcie komponentu głównego), nigdy na `sleep`/stały timeout i nigdy na wewnętrzne pola frameworka (np. `__reactProps$…` — nie są API, mogą zniknąć w dowolnej wersji).
2. **Pierwsza kompilacja trasy na zimnym `.next` przeładowuje stronę otwartą w innym teście.** `globalSetup` rozgrzewa **wszystkie** trasy przed startem workerów — lista tras wykryta automatycznie ze struktury `app/`, nie z ręcznej listy (ta sama zasada co lista stron w 10.8).

Żaden z tych dwóch środków nie zastępuje przebiegu na buildzie produkcyjnym — usuwają niestabilność pętli roboczej, nie ślepą plamkę `dev`.

## 10.10. Testy uczciwości obliczeń — granice zakresu, przykłady z normy, niezmienniki

[07.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, wpisy z 05–06.10.2026), decyzja właściciela repo. Rozszerza kryteria K1, K2, K8 z 10.5 (nie dodaje K9) i dopełnia 3.7. Wspólna przyczyna: test sprawdzał tylko wygodną stronę przypadku.

1. **Warunek zakresu we wzorze jest granicą.** Każdy wzór normowy z warunkiem zakresu („tylko dla h < 20 mm”, „dla d ≥ …”) ma test **po obu stronach granicy** i **na samej granicy**, razem z gałęzią „poza zakresem” (`OUT_OF_SCOPE` albo `ESTIMATE`, 3.3). To rozszerzenie K2: warunek zakresu to nie „błąd danych”, więc łatwo go przeoczyć. Przykład: k_h = √(20/h_p) zastosowano do każdej grubości płyty, a testy obejmowały tylko płyty < 20 mm — błąd po stronie niebezpiecznej przeszedł przegląd wzorów.
2. **Przykłady liczbowe z normy jako test (K1/K8) i kontrola jej spójności.** Gdy norma zawiera przykłady liczbowe, test „norma-przykłady” jest obowiązkowy, z tolerancją uzasadnioną w komentarzu. Przy ekstrakcji stałych i wzorów sprawdź spójność wewnętrzną normy (wzór vs jego odwrotność vs tablica; sumy narastające w tabeli przykładu): **niezgodność zgłoś właścicielowi, nie wybieraj cicho** (15.4), i nie utrwalaj błędnej tabeli przykładu jako oczekiwania testu — wylicz ręcznie z wzorów. Stałe wzorów ze skanów czytaj w wysokiej rozdzielczości (237,5 vs 237,3 nie do odróżnienia przy 90 dpi). Przy rozbieżności tekstu wydawcy weryfikuj drugim, niezależnym źródłem.
3. **Niezmiennik „domyślny stan jest czysty” nie ma pierwszeństwa nad fizyką.** Gdy niezmiennik danych domyślnych (np. „domyślny projekt nie ma BŁĘDU”) łamie poprawny wynik, **nie wolno zmieniać obliczeń ani wyciszać testu**. Dopuszczalne wyłącznie: (a) zmiana danych startowych o udokumentowanej fizyce, razem z przeglądem „złotych wartości” w modułach zależnych, albo (b) jawny, skomentowany wyjątek w teście z numerem pozycji backlogu i decyzją właściciela. Patrz też praktyka z 8.13.
4. **Test przypadku `null` dla każdej agregacji z wartościami opcjonalnymi** (3.7 pkt 1), osobno od „nic nie ustawione”, z asercją kierunku błędu (wynik nie bezpieczniejszy niż przy wartości normowej).
5. **Test łańcucha na pełnym grafie** [07.10.2026, źródło: inzynier-szkieletowy-pro, 01.2]. Dla każdego nowego modułu wynikowego i nowego typu obiektu/wariantu projektu jeden test przechodzi przez pełny Kernel (stan nowego projektu → wynik → asercja), sprawdzając, że moduły agregujące go faktycznie czytają (np. dom z antresolą ma większą masę niż bez niej). Testy modułów z osobna tego nie wykryją, bo błąd leży w brakującej krawędzi, nie w module.
6. **Test wartości granicznej funkcji trygonometrycznej** [16.10.2026, źródło: inzynier-offgrid-pro, U.4 09.10.2026; zob. 3.7 pkt 7]. Dla każdego warunku „kierunek w półprzestrzeni”/„kąt w zakresie” opartego na `sin`/`cos`/`tan` test podaje kąt **dokładnie na granicy** (np. 90°, 0°, 180°) oraz tuż po obu jej stronach i sprawdza, że wynik pochodny (tangens, odstęp, stosunek) przechodzi w gałąź „poza zakresem”/jawny stan, a nie w wartość gigantyczną lub nieskończoną.
7. **Testy katalogów danych przepisanych z kart katalogowych — trzy warstwy** [16.10.2026, źródło: inzynier-offgrid-pro, U.4 09.10.2026, dwa wpisy; decyzja właściciela repo]. Katalog liczb przepisanych z kart (panele, falowniki, baterie, materiały) ma trzy niezależne testy, bo każdy łapie inną klasę błędu: **(a) pliki źródłowe istnieją** — każda ścieżka źródła wskazuje istniejący plik (8.14 reguła 6); **(b) każda liczba wpisu występuje w tekście transkrypcji karty** (wzorzec z granicami cyfr, żeby `12` nie pasowało do `120`) — wychwytuje liczbę, której nie ma w transkrypcji, np. wiersz widoczny na obrazie karty, a pominięty przy przepisywaniu; takiej liczbie nie wolno ufać jako „z serii”; **(c) relacje fizyczne właściwe dla typu urządzenia** działają jak suma kontrolna wyłapująca literówkę i zamianę wierszy bez drugiej osoby (przykład dla paneli PV: Vmp·Imp ≈ Pmax w tolerancji, Voc > Vmp, Isc > Imp, współczynnik temperaturowy napięcia < 0). Standard wymaga **klasy testu** (relacje danego typu urządzenia), a nie tych konkretnych relacji; **tolerancja jest uzasadniona per katalog**, nie przejęta z przykładu. Nazwa wiersza na karcie nie jest dowodem jego znaczenia fizycznego (playbook przetwarzania źródeł, Krok 0).
8. **Atrapa zewnętrznego API szuka sygnału w polu, które test kontroluje** [16.10.2026, źródło: inzynier-offgrid-pro, U.4 09.10.2026]. Atrapa (mock) rozpoznająca „przypadek” po podciągu w **całym ciele żądania** trafia także w treść promptu, który zawiera ten sam podciąg, i zwraca odpowiedź innego przypadku niż zamierzony. Test przekazuje sygnał w dedykowanym polu żądania, a atrapa czyta wyłącznie to pole.
