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
