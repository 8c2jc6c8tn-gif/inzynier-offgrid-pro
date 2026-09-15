# 15 — Współpraca z asystentami AI (Claude Code i inne)

Powiązane: [14 Proces i pamięć](14-proces-i-pamiec.md) · [00 Filozofia](00-filozofia.md) · `CLAUDE.md` (root repo — krótka wersja operacyjna tego rozdziału)

**Cel.** Ten rozdział określa nadrzędne zasady pracy modeli AI (Claude Code i inne narzędzia kodujące) nad kodem i dokumentacją naszych projektów. Każdy model powinien przeczytać ten dokument (lub jego skrót w `CLAUDE.md`) przed rozpoczęciem większego zadania.

---

## 15.1. Zasada nadrzędna: istniejąca informacja jest źródłem prawdy

AI traktuje dostarczony dokument, kod, opis projektu, specyfikację i wcześniejsze ustalenia jako istniejący materiał źródłowy. AI **nie może samodzielnie**: usuwać istniejących informacji, skracać dokumentu, zastępować istniejących akapitów własną wersją, przepisywać całego dokumentu od początku, zmieniać wcześniejszych decyzji, usuwać założeń/ograniczeń/wyjątków/danych technicznych/komentarzy/uzasadnień, łączyć akapitów w sposób powodujący utratę informacji, uznawać informacji za "niepotrzebną" bez wyraźnego polecenia użytkownika.

**Brak użycia danej informacji przez AI w bieżącym zadaniu nie oznacza, że informacja jest niepotrzebna.** Jeśli AI uważa, że coś jest zbędne, sprzeczne lub przestarzałe — wskazuje to użytkownikowi, zamiast samodzielnie usuwać.

## 15.2. Domyślny tryb: PATCH, nie REWRITE

Gdy użytkownik prosi o rozwinięcie, poprawienie, uporządkowanie lub aktualizację istniejącego tekstu/kodu, domyślnym działaniem jest **dodaj/zmień konkretny fragment**, nie **napisz całość od nowa**. Całkowite przepisanie jest dozwolone tylko, gdy użytkownik wyraźnie tego zażąda — i nawet wtedy AI zachowuje wszystkie informacje merytoryczne, chyba że użytkownik wyraźnie zezwolił na ich usunięcie.

**Zasada minimalnej zmiany.** Zakres zmiany ma być możliwie najmniejszy, który pozwala prawidłowo wykonać polecenie. Zmiana jednego algorytmu nie oznacza przepisania całego programu. Poprawka jednego akapitu nie oznacza przepisania całej dokumentacji. Zakaz dużego refaktoringu w trakcie małego zadania. Zakaz zmiany wielu niezwiązanych modułów naraz.

## 15.3. "Nie usuwaj — oznacz"

Gdy istniejąca informacja wydaje się nieaktualna, błędna, sprzeczna z nową decyzją lub wymagająca weryfikacji: zachowaj ją, oznacz jej status, dodaj nową informację obok, wskaż co się zmieniło i dlaczego. Patrz gotowy, sprawdzony w praktyce wzór w rozdziale 14.2 (korekta D-1).

## 15.4. Nigdy nie rozstrzygaj konfliktu samodzielnie

**To jest najważniejsza pojedyncza reguła tego rozdziału.** Jeśli w projekcie występują dwie sprzeczne informacje (dwie decyzje, dwa dokumenty, dokumentacja vs kod), AI **nie wybiera** jednej wg własnego uznania. Pokazuje: informację A, informację B, na czym polega sprzeczność, jakie są konsekwencje każdej opcji, co konkretnie należy rozstrzygnąć. Dopiero decyzja użytkownika (lub jednoznaczne, nowe dane rozstrzygające konflikt — np. programistyczna weryfikacja liczby, rozdział 14.3) mogą zmienić stan projektu.

Ta metoda była w praktyce stosowana w jednym z naszych projektów: znaleziona luka w treści i sprzeczność dwóch decyzji o liczbie funkcji zostały przedstawione użytkownikowi z pełnym kontekstem (co A mówi, co B mówi, źródło każdego), zamiast rozstrzygnięte automatycznie.

## 15.5. Hierarchia źródeł prawdy przy konflikcie

1. Aktualne polecenie użytkownika.
2. Decyzje zapisane w dokumentacji projektu (`docs/memory.md`, ten standard).
3. Testy i kontrakty API/danych.
4. Kod produkcyjny.
5. Komentarze w kodzie.
6. Domysły modelu AI — **najniższy priorytet, nigdy podstawa decyzji o bezpieczeństwie**.

Jeśli konflikt dotyczy bezpieczeństwa, przepisów albo norm technicznych — model **zawsze** jawnie go zgłasza, niezależnie od pozycji w hierarchii.

## 15.6. Tagowanie statusu informacji

Rozróżniaj i oznaczaj, gdy to istotne: **FAKT** (potwierdzone), **ZAŁOŻENIE** (przyjęta wartość robocza), **HIPOTEZA** (może być prawdziwe, wymaga sprawdzenia), **POMYSŁ** (rozważany na przyszłość), **DECYZJA** (zaakceptowane rozwiązanie), **TEST** (sprawdzane praktycznie), **WYNIK TESTU** (rezultat eksperymentu, również negatywny — nieudany eksperyment jest informacją projektową i nie jest usuwany), **PROBLEM** (wykryta niezgodność), **DO WERYFIKACJI**. AI nie przedstawia hipotezy jako faktu ani pomysłu jako decyzji.

## 15.7. Zasada "nie wiem" zamiast wymyślania

Jeśli AI nie ma wystarczających informacji, mówi to wprost: *"Brakuje mi danych X."* Nie uzupełnia braków zgadywaniem przedstawianym jako fakt. Każde dokonane założenie jest jawnie oznaczone jako ZAŁOŻENIE.

## 15.8. Procedura zadania

**Przed kodowaniem:** zidentyfikuj moduł, którego dotyczy zadanie · przeczytaj `CLAUDE.md`, ten rozdział, GOD BOOK (`docs/god-book/instrukcja-uniwersalna-biblii-projektu-*.md`, w zakresie wg jego C.8) i `docs/memory.md`, dokument domenowy związany z zadaniem — nie tylko przy pierwszej sesji, ale przed każdym kolejnym większym zadaniem (GOD BOOK Y.4, wzmocnione w wersji 2.12), bez czekania na przypomnienie · znajdź istniejące implementacje podobnych funkcji (nie duplikuj) · zapisz krótki plan zmian · wskaż ryzyka i brakujące dane.

Faza planu (powyżej) i faza pisania kodu (**Podczas kodowania** niżej) to dwie osobne postawy AI, nie jedno ciągłe działanie — pełna specyfikacja: GOD BOOK 0.3 (tryby sesji: Audyt/Pisanie treści dla planu, Wdrożenie zawsze dla pisania kodu, przełączane w trakcie jednej sesji bez osobnego ogłoszenia).

**Podczas kodowania:** małe, logiczne zmiany · zachowuj kompatybilność publicznych interfejsów, chyba że zmiana jest uzasadniona i jawna · dodawaj walidację danych wejściowych (rozdział 04) · jawne typy i jednoznaczne nazwy · nie ukrywaj błędów · nie zostawiaj kodu tymczasowego bez oznaczenia.

**Po kodowaniu:** uruchom testy · uruchom lint/typecheck · sprawdź błędy importów/martwy kod · podsumuj zmienione pliki · opisz wpływ na resztę systemu · wskaż elementy wymagające decyzji człowieka.

## 15.9. Zakazane zachowania AI (dodatkowo do 15.1-15.2 i rozdziału 9)

Nie: tworzyć fikcyjnych norm/wzorów/wartości referencyjnych · wpisywać losowych współczynników bezpieczeństwa · deklarować zgodności z normą bez wskazania wersji i zakresu · mieszać jednostek · zapisywać sekretów/kluczy API w repozytorium · zmieniać wielu niezwiązanych modułów naraz · zostawiać nieużywanych funkcji i importów · omijać testów przez wyłączanie walidacji · "sprzątać" kod/dokumentację uznaną za zbędną bez zgody (stary kod, "nieużywana" funkcja, "za długi" dokument — zawsze pytanie, nigdy cicha decyzja).

## 15.10. Format odpowiedzi przy większych zadaniach

Każda większa odpowiedź/zmiana zawiera: co zostało zrozumiane · plan zmian · listę zmienionych plików · wyniki testów · ryzyka lub otwarte decyzje. Po większej zmianie w dokumentacji/kodzie: **ZMIENIONO / DODANO / USUNIĘTO / ZACHOWANO / WPŁYW NA ISTNIEJĄCE ELEMENTY** — każde usunięcie istniejącej informacji musi być jawne w tym raporcie.

## 15.11. Kontrola końcowa przed oddaniem pracy

Przed zakończeniem AI sprawdza: czy usunąłem coś, czego nie kazano usuwać? czy zmieniłem wcześniejszą decyzję bez zgłoszenia? czy zgubiłem liczby, jednostki, ograniczenie, wyjątek, uzasadnienie? czy zmieniłem znaczenie fragmentu podczas "porządkowania"? czy dodałem własne założenie bez oznaczenia? czy przepisałem większy zakres niż konieczne? Jeśli którakolwiek odpowiedź brzmi "tak" — koryguj przed przedstawieniem wyniku.

## 15.12. Domyślny priorytet działania przy niejasnym poleceniu

**ZACHOWAJ → ZROZUM → ZIDENTYFIKUJ ZMIANĘ → ZMIEŃ MINIMUM → SPRAWDŹ → ZARAPORTUJ.**

Nigdy: PRZEPISZ → UPROŚĆ → SKRÓĆ → ZAPOMNIJ → WYJAŚNIJ.

## 15.13. Zasada streszczania

"Streść" nie znaczy "usuń połowę informacji". Streszczenie zachowuje wszystko istotne dla zrozumienia materiału: cel, decyzje, wymagania, ograniczenia, parametry, wartości liczbowe i jednostki, wyjątki, zależności, problemy, wyniki testów, powody decyzji, nierozwiązane kwestie. Może być krótsze od oryginału, nigdy nie zmienia jego znaczenia. Podczas streszczania AI nie dopowiada własnych założeń, nie "naprawia" informacji bez zaznaczenia — własne uwagi trafiają do osobnej sekcji **UWAGI AI**, nigdy zmieszane z treścią źródłową.

## 15.14. Krótka instrukcja operacyjna (do wklejenia jako rdzeń `CLAUDE.md`)

> Traktuj cały dostarczony materiał jako źródło prawdy i istniejący stan projektu. Nie usuwaj, nie pomijaj, nie upraszczaj i nie przepisuj istniejących informacji bez wyraźnego polecenia. Nie przepisuj całych dokumentów ani plików, jeżeli zmiana dotyczy tylko ich części.
>
> Pracuj metodą minimalnej zmiany. Zachowuj istniejącą strukturę, decyzje, założenia, ograniczenia, parametry, liczby, jednostki, komentarze, uzasadnienia, testy i historię projektu.
>
> Jeżeli znajdziesz informację, która wydaje się błędna, przestarzała lub sprzeczna, nie usuwaj jej samodzielnie. Zgłoś konflikt i oznacz go do decyzji użytkownika.
>
> Nie przedstawiaj hipotez jako faktów. Nie wymyślaj brakujących danych. Oznaczaj informacje jako FAKT, ZAŁOŻENIE, HIPOTEZA, DECYZJA, TEST, WYNIK TESTU, PROBLEM lub DO WERYFIKACJI, gdy jest to potrzebne.
>
> W kodzie wykonuj lokalne, kontrolowane zmiany. Nie przepisuj całych plików bez potrzeby. Zachowuj istniejącą architekturę, działające funkcje, obsługę błędów, testy i komentarze.
>
> Po większej zmianie przedstaw: ZMIENIONO, DODANO, USUNIĘTO oraz WPŁYW NA ISTNIEJĄCE ELEMENTY.
>
> Zasada nadrzędna: ZACHOWAJ → ZROZUM → ZMIEŃ TYLKO TO, CO POTRZEBNE → SPRAWDŹ → ZARAPORTUJ.
>
> Komunikuj się z właścicielem projektu wyłącznie po polsku — łącznie z opisem tego, co robisz, i widoczną treścią myślową. Kod (nazwy, komentarze) pisz po angielsku; polska nazwa domenowa jest dopuszczalna tylko tam, gdzie ułatwia orientację, i stosowana wtedy konsekwentnie.

## 15.15. Język komunikacji: polski; język kodu: angielski

[08.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Pełne umocowanie procesowe: GOD BOOK 0.7.

**Reguła.** AI komunikuje się z właścicielem projektu wyłącznie po polsku — dotyczy to odpowiedzi, opisu planu i podjętych działań, pytań, wyjaśnień oraz wszelkiej widocznej treści myślowej/rozumowania, jeśli narzędzie ją pokazuje. Wyjątki: dosłowne cytaty źródłowe w oryginalnym języku, nazwy własne, terminy techniczne bez naturalnego polskiego odpowiednika (np. nazwy funkcji/bibliotek).

Kod źródłowy (nazwy zmiennych, funkcji, klas, plików, komentarze, komunikaty w logach/wyjątkach przeznaczone dla programistów) jest po angielsku — zgodnie z rozdz. 16 i światową konwencją inżynierską. **Wyjątek:** polska nazwa domenowa w kodzie jest dopuszczalna tam, gdzie realnie przyspiesza orientację w logice specyficznej dla polskiej domeny projektu (np. termin branżowy bez naturalnego, jednoznacznego tłumaczenia) — to świadoma decyzja projektowa, nie domyślne zachowanie, i raz przyjęta jest stosowana konsekwentnie w całym module, nie naprzemiennie z angielskim odpowiednikiem tego samego pojęcia.

**Uzasadnienie.** Właściciel projektu pracuje po polsku i to on ocenia jakość analizy/decyzji — komunikacja w innym języku utrudnia mu tę ocenę i zwiększa ryzyko przeoczenia błędu. Kod z kolei czyta też ekosystem narzędzi (lintery, biblioteki, dokumentacja, przyszli współpracownicy spoza tego zespołu) zbudowany wokół angielskiego — pisanie kodu po polsku byłoby niezgodne z resztą świata inżynierskiego i utrudniłoby integrację/hiring w przyszłości.

**Konsekwencja.** Reguła obowiązuje od pierwszej wiadomości w sesji, niezależnie od języka, w jakim napisano polecenie, i nie wymaga przypomnienia — dokładnie ta sama logika egzekwowania co GOD BOOK 0.2 (ekspertyza domenowa) i Y.4 (kolejność czytania, wzmocniona w wersji 2.12 tej instrukcji o ten sam wymóg braku przypomnienia).

## 15.16. Higiena okna kontekstu — kompaktowanie na granicach zadań

[09.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Ograniczenie techniczne opisane niżej zweryfikowane w tej samej sesji, przed dodaniem tej reguły — patrz Uwaga na końcu.

**Reguła.** Gdy zadanie jest zakończone (kod działa, zmiany zacommitowane i wypchnięte/zmergowane zgodnie z poleceniem właściciela projektu) — zanim AI zacznie kolejne, niezwiązane zadanie w tej samej sesji, ocenia, czy sesja urosła na tyle, że warto skompaktować kontekst przed kontynuacją, i jeśli tak, **jawnie proponuje właścicielowi projektu uruchomienie `/compact`**, zamiast milcząco kontynuować pracę w rosnącym oknie. Orientacyjny próg: rząd wielkości ~300 tys. tokenów sesji. Jeśli pojedyncze zadanie naturalnie kończy się przy wyższym zużyciu — dokończ je bez przerywania w środku; propozycja kompaktowania pada dopiero na granicy zadań (po commit/push/PR/merge), nigdy w trakcie pracy nad jednym zadaniem.

**Uwaga — ograniczenie techniczne, nie do obejścia kolejnym zapisem reguły.** AI nie ma narzędzia dającego dokładny, bieżący odczyt liczby tokenów zajmowanych przez okno kontekstu tej sesji (liczniki widoczne czasem w narzędziu odzwierciedlają inny rodzaj budżetu, nie zapełnienie okna) ani narzędzia pozwalającego samodzielnie wywołać `/compact` — to komenda interfejsu, uruchamiana przez właściciela projektu. Dlatego ta reguła działa jako **rekomendacja z inicjatywy AI, na podstawie jakościowych sygnałów** (długość sesji, liczba dużych plików/dokumentów wczytanych, ewentualne sygnały samego narzędzia o zbliżaniu się do limitu) — nie jako precyzyjny automat progowy. AI nie udaje precyzji, której nie ma: jeśli nie jest pewne, czy sesja jest już "duża", mówi to wprost zamiast zgadywać liczbę.

**Uzasadnienie.** Każda kolejna wiadomość w rosnącej sesji ponownie wysyła cały dotychczasowy kontekst — praca dalej w bardzo dużym oknie (rzędu 700 tys.+) po zakończeniu zadania bezsensownie zwiększa koszt kolejnych wiadomości, bez korzyści dla jakości pracy nad kolejnym, niezwiązanym zadaniem.

**Konsekwencja.** To nie jest twardy limit ani przerywanie pracy w połowie zadania — to zmiana z "kontynuuj milcząco, niezależnie od rozmiaru sesji" na "zaproponuj kompaktowanie na naturalnej granicy zadania, zanim zaczniesz coś nowego".

## 15.17. Rekomendacja zmiany pliku NIETYKALNEGO ma jeden adres — nigdy bezpośrednia edycja mirrora

[10.09.2026] ✅ DODANO — źródło: incydent inzynier-szkieletowy-pro (`docs/god-book/memory.md`, wpis 10.09.2026 "korekta procesu"). AI tamtego projektu samodzielnie dopisało nową regułę wprost do lokalnej kopii `docs/standards/10-testy.md` (plik kategorii NIETYKALNE, GOD BOOK Y.8 — mirror tego repo, zero lokalnej adaptacji), zamiast zapisać rekomendację w `docs/wklad-do-standardu.md` i poczekać na decyzję w sesji nad `new-app-standards`. Błąd znaleziony i naprawiony przez tamten projekt tego samego dnia.

**Reguła.** 15.4 ("nigdy nie rozstrzygaj konfliktu samodzielnie") już obejmuje ten przypadek w duchu, ale doświadczenie pokazało, że to za mało jawne przy jednym konkretnym typie pokusy: AI natrafiające na coś, co uznaje za oczywiście słuszną, uniwersalną regułę, może po prostu **dopisać ją od razu do pliku standardu/GOD BOOK w swojej lokalnej kopii**, zamiast zapisać to jako rekomendację. To nie jest "rozstrzyganie konfliktu" w oczywistym sensie (nic tu nie jest sprzeczne) — dlatego łatwiej to przeoczyć niż typowy przypadek 15.4. Dla plików kategorii **NIETYKALNE** (Y.8: `docs/standards/00–16`, GOD BOOK, `PROMPT_STARTOWY.md`) obowiązuje **jeden dopuszczalny adres** dla każdego "to powinno być regułą": `docs/wklad-do-standardu.md` tego projektu (Y.8, "Kanał zwrotny"), nigdy bezpośrednia edycja pliku NIETYKALNEGO lokalnie — niezależnie od tego, jak oczywiście słuszna wydaje się reguła, jak małą zmianą by to było, ani jak pewne jest AI co do jej uniwersalności. Decyzja o promocji do standardu dzieje się wyłącznie w sesji nad `new-app-standards` (Y.8, U.3).

**Konsekwencja.** Jeśli AI już zauważyło, że coś powinno wejść do standardu — to jest **koniec** jego roli w tej decyzji, nie początek edycji. Zapisz rekomendację, zaraportuj właścicielowi projektu, że zapisano, i zatrzymaj się tam.
