# 03 — Jądro logiki domenowej

Powiązane: [01 Architektura](01-architektura.md) · [04 Walidacja i twarde stopy](04-walidacja-i-twarde-stopy.md) · [10 Testy](10-testy.md)

---

## 3.1. Logika domenowa jako główne źródło wyników

**Reguła.** Funkcje domenowe (kalkulatory, reguły, silniki decyzyjne — nazwa zależy od projektu) zwracające wynik są **jedynym** źródłem wyników technicznych/merytorycznych w aplikacji. Muszą być deterministyczne (te same wejścia → te same wyjścia), testowalne i niezależne od modelu językowego. AI nigdy nie zastępuje tej logiki własnym szacunkiem (patrz rozdział 09).

## 3.2. Kontrakt wyniku

**Reguła.** Każda funkcja domenowa zwraca nie tylko wartość, ale pełną strukturę wyniku:

```ts
type CalcResult<T> = {
  value: T
  unit: string
  status: 'VALID' | 'VALID_WITH_WARNINGS' | 'INCOMPLETE' | 'OUT_OF_SCOPE' | 'ESTIMATE' | 'INVALID_INPUT'
  formula: string                  // wzór/reguła (np. LaTeX lub opis), np. "I = P / (V \\cdot \\eta)"
  inputs: Record<string, number>   // wartości użyte do obliczenia
  assumptions: string[]            // przyjęte założenia (np. "sprawność = 0,92", "produkt przechowywany w lodówce")
  warnings: Warning[]              // patrz rozdział 04
  calculatorVersion: string        // wersja funkcji/metody
  traceId: string                  // do audit trail, patrz 3.6
}
```

**Uzasadnienie.** Widok "Szczegóły"/Migawka (rozdział 08), audyt (3.6) i podwójna weryfikacja (3.4) wymagają, by wynik niósł ze sobą swój wywód — nie da się tego odtworzyć wstecz z samej wartości. Jawny `status` (a nie tylko lista ostrzeżeń) pozwala UI i logice biznesowej podejmować decyzje maszynowo, bez parsowania tekstu ostrzeżeń.

**Konsekwencja.** Zakaz "magicznych liczb" w kodzie. Wszystkie stałe (współczynniki, tolerancje, progi) pochodzą z nazwanych stałych lub z profilu kontekstowego (rozdział 02), nigdy nie są wpisane wprost w środku wzoru/reguły.

[05.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro, przyniesione przez właściciela projektu. **Wynik bogaty, wielopolowy.** `CalcResult<T>` powyżej modeluje kalkulator zwracający jedną wartość skalarną — jeden wzór, jedna jednostka, jeden zestaw założeń. Gdy funkcja domenowa zwraca wiele różnotypowych wartości naraz (różne jednostki, różne wzory dla każdego pola — silnik z dziesiątkami wyliczeń na moduł, nie pojedynczy kalkulator), dosłowne opakowanie całego wyniku w jeden `CalcResult<T>` fałszywie sugerowałoby jeden `formula`/`unit`/`inputs` na cały wynik; opakowanie każdego pola osobno oznaczałoby dublowanie tych samych `inputs`/`assumptions` dziesiątki razy zamiast jednego źródła danych — więcej kodu i więcej okazji do rozjazdu, nie mniej.

Dozwolony wariant dla tego przypadku: `formula`/`assumptions` opisane w dokumentacji modułu (nie jako pole runtime per wartość), `inputs` odtwarzalne z aktualnego kontekstu/Seed (dopuszczalne tylko tam, gdzie wynik zawsze odzwierciedla bieżące dane — nigdy nie jest przechowywany obok już nieaktualnych danych wejściowych), `status`/`warnings` w bogatszej strukturze walidacji niż pojedynczy `Warning[]` (rozdział 04). **Niezależnie od wybranego kształtu — jednowartościowego `CalcResult<T>` czy bogatego wielopolowego — `calculatorVersion` i `traceId` (3.6) muszą istnieć przy wyniku każdego nietrywialnego modułu.** Ich brak nie jest usprawiedliwiony bogatym kształtem wyniku; to jedyne dwa pola niezależne od tego, ile wartości i jakich jednostek wynik faktycznie niesie.

[15.09.2026] ✅ DODANO — źródło: integracja z rozdz. 17 (i18n), kolizja zgłoszona przez inzynier-offgrid-pro. **`assumptions` i i18n.** `assumptions: string[]` w kontrakcie wyżej nie może być gotowym tekstem w jednym języku — koliduje z 01.1 (i18n jako czysta funkcja domenowa). Domenowa funkcja zwraca zamiast tego strukturę `{kod: string, params?: Record<string, number | string>}[]`; tłumaczenie na tekst dla użytkownika dzieje się wyłącznie w warstwie prezentacji, przez odczyt `kod` ze słownika (17.2). `formula` pozostaje bez zmian, gdy jest notacją symboliczną/LaTeX (językowo neutralną z natury); ten sam wymóg klucza dotyczy `formula` tylko wtedy, gdy w konkretnym module jest opisową prozą, nie zapisem symbolicznym.

[07.10.2026] ✅ DOPRECYZOWANO (nic nie usunięto) — wyżej „odczyt `kod` ze słownika” należy czytać przez 17.2 (dopisek 07.10.2026): komunikat niesie `kod` (stabilny identyfikator reguły) **oraz jawne `i18nKey`** — klucz słownika jest osobnym polem, nie ukrytą konwencją „`kod` = klucz”. Źródło: rozbieżność między inzynier-offgrid-pro (jawne `i18nKey`) a inzynier-szkieletowy-pro (`kod` = klucz), rozstrzygnięta przez właściciela repo na rzecz jawnego pola.

## 3.3. Status wyniku

| Status | Znaczenie |
|---|---|
| `VALID` | Wynik pewny, dane kompletne, brak ostrzeżeń. |
| `VALID_WITH_WARNINGS` | Wynik policzony, ale są ostrzeżenia do przeczytania (rozdział 04). |
| `INCOMPLETE` | Brak wymaganych danych — wynik nie został jeszcze policzony, nie "policzony na zero". |
| `OUT_OF_SCOPE` | Dane wejściowe poza zakresem, dla którego funkcja jest ważna (np. inna kategoria/wariant). |
| `ESTIMATE` | Wynik **poza zakresem metody/normy**, policzony jako nasza interpretacja (np. norma tabelaryzuje konfigurację 1+1 i 2+2, a użytkownik pyta o 2+1). Liczba istnieje, ale **nigdy** nie jest podawana jako normowa — patrz dopisek 07.10.2026 niżej i 3.7. |
| `INVALID_INPUT` | Dane wejściowe błędne (ujemne tam gdzie nie wolno, zła jednostka, sprzeczność pól). |

**Konsekwencja w UI.** `INCOMPLETE` sprawdzane jest **przed** wywołaniem właściwej logiki obliczeniowej, nie po — `undefined` nigdy nie wpływa w głąb logiki domenowej.

[24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4). **Moduł obowiązku/ryzyka/zgodności musi używać `INCOMPLETE` jako osobnego, trzeciego stanu — nigdy dwuwartościowej logiki z dodatkową flagą kompletności.** Dotyczy każdego modułu sprawdzającego obowiązek prawny, ryzyko, uprawnienie albo zgodność (checklisty zgodności, kontrola dostępu, walidacja ryzyka, filtrowanie powiadomień/alertów) — niezależnie od domeny projektu. Brak danych wymaganych do sprawdzenia **nigdy** nie jest mapowany na wynik negatywny w sensie merytorycznym (np. "nie dotyczy", "brak ryzyka", "warunek niespełniony") — status wyniku to `INCOMPLETE` (wyżej), nie `VALID`/`VALID_WITH_WARNINGS` z wartością domyślną podstawioną za brakujące dane. Naiwna implementacja (brak danych → wartość domyślna → wynik negatywny) daje wynik fałszywie uspokajający; koszt fałszywego "nic nie grozi"/"nie dotyczy" jest wyższy niż koszt zbędnego, jawnie oznaczonego niedokończenia sprawdzenia. To samo rozróżnienie obowiązuje na poziomie kolekcji wyników, nie tylko pojedynczego wyniku: pusta lista (np. "brak obowiązujących przepisów", "brak alertów") wymaga jawnego rozróżnienia "sprawdzono, nic nie znaleziono" (`VALID`, pusta lista) od "źródło danych do sprawdzenia samo jest niekompletne/puste" (`INCOMPLETE`) — nigdy tej samej reprezentacji dla obu. Konsekwencja w warstwie prezentacyjnej (Kontrakt Widżetu, 4.2) już istnieje i się zgadza: moduł ze statusem `INCOMPLETE` nie generuje alertu — to ta sama zasada zastosowana od strony kontraktu wyniku źródłowego, nie nowy, równoległy mechanizm.

[07.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, wpis z 06.10.2026), decyzja właściciela repo. **Status `ESTIMATE` („szacunek”).** Gdy właściciel/użytkownik żąda liczby, której metoda normowa nie obejmuje, a istnieje uzasadniona interpretacja, wynik nie może wejść pod `VALID`/`VALID_WITH_WARNINGS` (sugerowałby zgodność z normą), a `OUT_OF_SCOPE` oznacza brak liczby. Trzeci stan jest osobną wartością statusu, **nie flagą logiczną obok statusu** — unia typów zmusza kompilator do obsłużenia go u każdego konsumenta (walidacja, widżet, schemat narzędzia AI), a flaga bool jest łatwa do pominięcia w nowym konsumencie. Wymagania: (a) znacznik 🔎 (albo odpowiednik projektu) w tekście wyniku i w UI, z dopiskiem typu „norma liczy X, to nasza interpretacja”; (b) lista założeń interpretacji w `assumptions`, każde po stronie bezpiecznej (kierunek wskazany jawnie, 3.7 pkt 1); (c) status przekazywany do warstwy AI (rozdział 09), żeby asystent nie przedstawił liczby jako normowej; (d) `ESTIMATE` nigdy nie zasila bramek/twardych stopów (rozdział 04) jako dane spełniające wymaganie bez decyzji właściciela projektu. Projekty, które mają już własną nazwę trzeciego stanu (np. `"szacunek"`), zachowują nazwę lokalną, jeśli semantyka jest identyczna.

## 3.4. Podwójna weryfikacja obliczeń krytycznych

**Reguła.** Każda krytyczna reguła/wzór (taka, gdzie błąd niesie realne ryzyko — dla zdrowia, bezpieczeństwa, pieniędzy lub zgodności z prawem, w zależności od domeny projektu) ma dwie niezależne ścieżki dające ten sam wynik w granicy tolerancji: (1) ścieżka główna — logika w kodzie, (2) ścieżka kontrolna — test jednostkowy z wartością referencyjną policzoną ręcznie lub wziętą z normy/dokumentacji źródłowej.

**Uzasadnienie.** Błąd w takim obliczeniu to realne ryzyko dla użytkownika. Co dokładnie jest "krytyczne" zależy od domeny — np. w projekcie inżynierskim: obliczenie wytrzymałościowe czy elektryczne; w projekcie dotyczącym żywności: data ważności/bezpieczeństwo spożycia; w finansowym: kwota do zapłaty. Aplikacja nie może mylić się po cichu w żadnym z tych przypadków.

**Konsekwencja.** Rozbieżność ponad ustaloną tolerancję = build fail, nie ostrzeżenie w logu.

## 3.5. Jednostki i zaokrąglenia

**Reguła.**
- System wewnętrzny stosuje spójny zestaw jednostek (np. SI, albo — gdy domena nie jest fizyczna — spójny, jawnie zdefiniowany zestaw jednostek własnych, np. dni/sztuki/waluta). Warstwa prezentacji może przeliczać jednostki na potrzeby wyświetlania, ale wynik źródłowy zawsze zachowuje jednostkę bazową.
- Nigdy nie przechowuj samej liczby bez informacji, czym jest (jednostka jest częścią wartości, nie komentarzem).
- Obliczenia pośrednie: bez przedwczesnego zaokrąglania. Prezentacja: zaokrąglanie wg reguł konkretnego modułu, udokumentowanych jawnie.
- Pieniądze: typ dziesiętny z kontrolowaną precyzją (np. `Decimal`), nigdy zmiennoprzecinkowy `float`.

## 3.6. Audit trail

**Reguła.** Każde nietrywialne przeliczenie zapisuje wpis: `traceId`, funkcja/moduł, wejścia, wynik, wersja jądra, znacznik czasu. Błędy (runtime, walidacja, rozbieżność weryfikacji z 3.4) trafiają do jednego centralnego raportera — z rozróżnieniem: użytkownik widzi komunikat "po ludzku", log niesie pełne szczegóły techniczne.

**Uzasadnienie.** Bez tego nie da się odtworzyć, dlaczego aplikacja pokazała dany wynik miesiąc temu — kluczowe przy reklamacjach, audytach bezpieczeństwa i debugowaniu.

**Konsekwencja.** Zero cichych `catch {}` / `except Exception: pass`. Każdy złapany błąd jest albo obsłużony merytorycznie, albo opakowany z kontekstem i zaraportowany.

[17.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, wpis z 07.10.2026, D185/TD17), decyzja właściciela repo (wariant S1-A). **Dwa poziomy audit trail i wzorzec obserwatora.** Reguła wyżej (wpis z wejściami i wynikiem) nie jest jedynym dopuszczalnym kształtem: gdy wejścia lub wyniki zawierają **dane osobowe, dane budowy albo inne dane wrażliwe** (i koliduje to z zasadą „zapisuj Seed, nie wynik”, 5.1/18.9), stosuje się poziom ograniczony. Wybór poziomu jest decyzją projektu zapisaną w rejestrze decyzji, nie domyślnością.
- **Poziom pełny** (dane niewrażliwe): wpis jak w regule wyżej — `traceId`, funkcja/moduł, wejścia, wynik, wersja jądra, czas.
- **Poziom ograniczony** (dane wrażliwe): raport **bez wartości danych** — nazwy modułów, rewizja/wersja jądra, status, błędy, czas. Seedów ani wyników nie zapisuje się w śladzie.

**Wzorzec realizacji (rekomendowany, spełnia 3.6 bez łamania czystości rdzenia).** Rdzeń udostępnia wyłącznie **czysty obserwator** (np. `naPrzeliczeniu(słuchacz)`), który dostaje raport zgodny z wybranym poziomem. Persystencję, zegar i limit retencji realizuje **osobny store w warstwie aplikacji**, nigdy rdzeń (zgodnie z regułą „rdzeń nie dotyka platformy”, 1.1). Słuchacz jest owinięty w `try/catch`, żeby diagnostyka nie mogła zepsuć obliczeń (a zgodnie z konsekwencją wyżej błąd słuchacza jest zaraportowany, nie połknięty po cichu).

**Pułapka (store zasilany zdarzeniami przy starcie).** Asynchroniczna rehydracja `persist` zastępuje wpisy dodane w czasie startu, zanim rehydracja się zakończyła. Store zasilany zdarzeniami wymaga własnego `merge`, który łączy wpisy z pamięci z wpisami z bieżącej sesji, a nie nadpisuje jednych drugimi. Dotyczy każdego store'u zasilanego zdarzeniami od startu aplikacji, nie tylko audit trail.

## 3.7. Uczciwość obliczeń

[07.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro i inzynier-offgrid-pro (U.4, bloki 02–06.10.2026, temat 5 przeglądu), decyzje właściciela repo. Wspólny mianownik: aplikacja licząca twarde fakty ma błędy **ciche i po stronie niebezpiecznej** — wynik wygląda poprawnie, tylko jest zawyżony na korzyść użytkownika. Poniższe reguły rozszerzają 3.3 (`INCOMPLETE`) o miejsca, gdzie 3.3 sama nie sięga: agregaty, progi, metody „wzorowane na” normie i dane bez źródła. Pytania kontrolne tej sekcji są też w GOD BOOK, Część N.5.

**1. Brak danych w agregacie nigdy nie staje się zerem.** `null`/„nie wiem”/miesiąc bez danych/składowa nieobecna nie może po cichu zostać elementem neutralnym (0 w sumie oporów, 0 w deficycie, 0% w średniej ważonej), jeśli zero jest korzystne dla wyniku. Dla każdej agregacji z wartościami opcjonalnymi **wskaż w komentarzu i teście, w którą stronę (bezpieczną/niebezpieczną) działa pominięcie**. Dozwolone wyjścia: (a) jawna reguła wyłączenia wynikająca z modelu (np. „warstwa za szczeliną wentylowaną”), albo (b) wynik `INCOMPLETE` / „brak wyniku” z ostrzeżeniem 🟡 — nigdy `VALID`. Obowiązkowy test przypadku `null` dla każdej takiej agregacji. Przykłady: dach z papą pokazywał „brak kondensacji” (s_d warstwy `null` liczone jako 0), a z wartością normową — 65 g/m²/rok; średnia ważona ze składową „brak agregatu = 0%” dawała nadal 85%.

**2. Agregat pokazuje najsłabsze ogniwo.** Wynik zbiorczy z wag/średniej nie może samodzielnie nieść oceny bezpieczeństwa: obok niego pokazuje się najsłabsze ogniwo (z tą samą wagą wizualną), a **nośność/spełnienie dla elementów powtarzalnych (słupki, belki, łączniki) liczy się dla najbardziej obciążonego egzemplarza wg ścieżki obciążenia**; średnia jest dopuszczalna wyłącznie informacyjnie. Przykład: podział obciążenia po równo dawał zapas gruntu 56%, a słupek pod ścianą okapową miał realnie 8%.

**3. Próg bezpieczeństwa jest funkcją stałej normowej.** Próg/zapas „z zapasem względem normy” wyraża się jako wyrażenie od stałej używanej przez silnik (np. `NORMA × współczynnik`), **nigdy jako osobna liczba**, która może się rozjechać po zmianie modelu. Przykład: próg 300 kg/m² opisany jako „więcej niż norma” stał się niedoszacowaniem, gdy norma po rozbudowie modelu wyniosła 326 kg/m². Uzupełnia zakaz magicznych liczb z 3.2.

**4. Liczba bez źródła.** Wartość liczbowa, której nie ma w normie, karcie produktu ani innym źródle zapisanym w repo (w szczególności: przyjęta przez AI przy budowie założeń, albo źródło podaje wyłącznie przykład), **nie może być stałą silnika**. Dwie dopuszczalne drogi: (a) pole użytkownika **bez** wartości domyślnej (kontynuacja 8.6), albo (b) wartość domyślna jawnie oznaczona jako założenie AI (🤖) i **do potwierdzenia przez właściciela projektu**, wpisana do `assumptions` wyniku — wtedy wynik, który od niej zależy, ma co najmniej status `VALID_WITH_WARNINGS`. Przykład: próg „słabego punktu 70%”, w źródle tylko przykład 74%.
[07.10.2026] ✅ DODANO — źródło: szkieletowy 05.10.2026. **Zakres to nie dane obliczeniowe.** Produkt o zmiennym parametrze (membrana „inteligentna”, s_d 0,3–25 m) wchodzi do metody wartością, którą **karta producenta wskazuje dla tej metody** (tu: osobne s_d statyczne dla metody Glasera). Zakres ze sklepu albo interpolacja po nim to wymyślone dane; zmienne właściwości ujmuje wyłącznie metoda dynamiczna (WUFI, EN 15026), której norma statyczna nie zakłada. Przy okazji: kierunek błędu zależy od elementu (dla paroizolacji większe s_d jest stroną niebezpieczną) — nie zakładaj „większe = bezpieczniej” (pkt 1).

[18.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 09.10.2026 „Dane z kart katalogowych… jawne założenie przy porównaniu z normą”), decyzja właściciela repo (wariant A). **Współczynnik przeliczenia karta ↔ norma bywa założeniem.** Gdy porównujesz wartość z karty katalogowej z wartością z normy (np. obciążenie testowe a obliczeniowe), przy wyniku pokaż **co jest czyje i skąd pochodzi współczynnik przeliczenia**. Jeśli współczynnik wynika z jednego źródła (np. tylko z jednej karty), a dla pozostałych wpisów jest założeniem, to: (1) wynik oparty na założeniu ma status `ESTIMATE` (3.3); (2) przekroczenie jest ostrzeżeniem 🟡 z jawnym opisem („opieram się na współczynniku X, potwierdzonym tylko w Y”), **nie twardym stopem 🔴** — twardy stop (4.3) wymaga progu wynikającego ze źródła, a próg oparty na założeniu jest liczbą bez źródła w rozumieniu pkt 4; (3) po potwierdzeniu współczynnika źródłem przekroczenie wraca do poziomu zdefiniowanego w rejestrze twardych stopów. **Wyjątek:** właściciel projektu może zdecydować (4.4, zapis w `docs/memory.md`), że dane przekroczenie jest stopem najwyższego ryzyka także przy współczynniku-założeniu (np. gdy grozi zawaleniem lub zagrożeniem życia); wtedy zostaje 🔴 i nie stosuje się obniżenia.

**5. „Zainspirowany normą” = 🔎 dla całej metody.** Słowa „inspirowane”, „zainspirowane”, „orientacyjne wg”, „na wzór” w opisie metody oznaczają status 🔎 **całej metody**, nie tylko stałych, które akurat się zgadzają. Cytowanie kilku stałych z normy nie czyni metody normową — w opisanym przypadku moduł odporności ogniowej cytował β₀, d₀, k₀ (poprawnie) i przez wiele etapów uchodził za zgodny z normą, a reszta stałych i sam model nośności pochodziły skądinąd. Przy budowie modułu normowego: (a) pełny tekst normy (lub właściwego załącznika) trafia do `docs/zrodla/` **przed kodem**, (b) moduł ma test zakresu stosowalności — poza zakresem metody wynik to `OUT_OF_SCOPE` albo `ESTIMATE` (3.3), nigdy liczba z `VALID`.

**6. Wynik normowy bez fałszywej precyzji.** Gdy metoda normowa podaje przedział (kres górny/dolny, metoda uproszczona vs dokładna, wartość charakterystyczna vs obliczeniowa), obowiązuje **jedna** liczba — wskazana w wyniku jako pole „wynik obowiązujący”, używana dalej w obliczeniach i przekazywana do AI — a granice są osobnym obiektem (przedział niepewności) z jawnym opisem. Nigdy kilka równorzędnych liczb bez wskazania, która obowiązuje; nigdy jedna liczba bez widocznej niepewności. Prezentacja: 8.13.

**7. Warunek graniczny na funkcji trygonometrycznej ma jawny, nazwany próg.** [16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 09.10.2026), decyzja właściciela repo. Porównanie `> 0` na wyniku `sin`/`cos`/`tan` w arytmetyce zmiennoprzecinkowej przepuszcza wartości-szum na granicy (`cos(π/2)` ≈ 6e-17, nie 0), a wynik pochodny (tangens profilowy, odstęp rzędów) rośnie wtedy do wartości absurdalnych albo „nieskończonych” — błąd cichy, wygląda jak poprawny wynik. Reguła: warunki typu „kierunek w półprzestrzeni”, „słońce przed/za płaszczyzną”, „kąt w zakresie” zapisuje się z **jawnym progiem w nazwanej stałej** (np. `EPS_COS`), nigdy z gołym `> 0`/`=== 0`; wartość progu jest uzasadniona w komentarzu modułu (dlaczego ta, jaki błąd przesłania) — nie jest „liczbą bez źródła” z pkt 4, tylko tolerancją numeryczną z opisaną rolą. Wynik pochodny dzielący przez taką wielkość ma gałąź „poza zakresem” (`OUT_OF_SCOPE`/jawny stan), nie wartość graniczną. Test: 10.10 pkt 6.

**Uzasadnienie.** Każdy z błędów powyżej przeszedł kompilator, przeglądy i zielone testy, bo wynik wyglądał wiarygodnie. Wspólne zabezpieczenie jest jedno: **zawsze pytaj, w którą stronę błąd przesuwa wynik**, i nie pozwalaj, by odpowiedź „na niekorzyść bezpieczeństwa” była domyślną ścieżką.

## 3.8. Ślad wersji obliczeń: numer wersji z wpływem na liczby, identyfikator builda, wersje danych na wydruku

[16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpisy z 09.10.2026: „Ślad wersji programu, silnika i danych na wydruku” oraz „Numer wersji z regułą podbijania”), decyzja właściciela repo (wariant A — jeden pakiet w jądrze). Dotyczy każdej aplikacji liczącej twarde fakty, w której wynik jest zapisywany, drukowany lub eksportowany i wraca do użytkownika później. Wynik sprzed miesiąca bywa liczony wg innych reguł i danych; bez śladu nie da się ustalić, czy różnica wynika z błędu użytkownika, czy ze zmiany reguł. Uzupełnia 3.6 (audit trail) o wymiar czasu.

**1. Numer wersji programu niesie informację o wpływie na liczby.** Pierwsza cyfra = zmiana zasad liczenia albo formatu danych użytkownika; druga = nowa funkcja, nowe dane albo poprawka błędu zmieniająca wynik; trzecia = bez wpływu na liczby. Sam skrót commita nie wystarcza: nie mówi, czy cokolwiek zmieniło się w liczbach. Każdy wpis historii zmian ma linię „Wpływ na liczby” (brak / zmiana, z opisem).

**2. Numer wersji zgadza się z historią — pilnuje tego test.** Test sprawdza, że numer w manifeście projektu (np. `package.json`) odpowiada najnowszemu wpisowi historii zmian; podbicie bez wpisu albo wpis bez podbicia przestaje przechodzić. Format historii jest lokalny dla projektu; wymagana jest sama spójność.

**3. Identyfikator builda.** Każdy build niesie identyfikator jednoznacznie wskazujący kod (np. skrót commita) dostępny w aplikacji i na wydruku. Sposób wstrzyknięcia jest szczegółem projektu (w Next.js np. zmienna `NEXT_PUBLIC_*` ustawiana w konfiguracji builda); standard wymaga samego identyfikatora.

**4. Wersja silnika danego kalkulatora — gdy silniki zmieniają się niezależnie (rozszerzenie).** Gdy moduły obliczeniowe są wersjonowane osobno, wydruk niesie także wersję silnika użytego kalkulatora, a zmiana reguł obliczeń podnosi tę wersję (test przypominający mile widziany). Gdy cała aplikacja zmienia się razem, wystarcza pkt 1.

**5. Wersje danych — z istniejącego mechanizmu, nie z nowego.** Wydruk niesie daty i wersje źródeł danych, z których liczono (pogoda, katalog, cennik) — dla danych środowiskowych jest to `wersjaDanych` z 19.4 (przypięta przez konsumenta), dla katalogów i cenników analogiczny identyfikator wydania. Nie wprowadzaj osobnego mechanizmu wersjonowania danych tylko dla wydruku.

**6. Gdzie widać ślad.** Wydruk lub PDF z wynikiem obliczeń zawiera: numer wersji programu, identyfikator builda, wersje danych (pkt 5) oraz — jeśli dotyczy — wersję silnika (pkt 4). Układ i powtarzanie na każdej stronie to kwestia prezentacji (8.15), nie tej reguły. Zapisany projekt użytkownika niesie wersję programu, w której został obliczony po raz ostatni, żeby aplikacja mogła ostrzec o możliwej zmianie reguł po aktualizacji.

**Granica z 19.4.** Zmiana wartości danych zmieniająca wyniki istniejących projektów jest klasą „wpływ na wyniki” w 19.4 i wymaga decyzji właściciela konsumenta; w numerze wersji programu odpowiada jej druga cyfra (pkt 1). Obie reguły opisują to samo zdarzenie z dwóch stron: dane (19.4) i program (3.8).
