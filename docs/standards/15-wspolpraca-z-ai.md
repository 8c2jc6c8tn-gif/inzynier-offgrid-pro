# 15 — Współpraca z asystentami AI (Claude Code i inne)

Powiązane: [14 Proces i pamięć](14-proces-i-pamiec.md) · [00 Filozofia](00-filozofia.md) · `CLAUDE.md` (root repo — krótka wersja operacyjna tego rozdziału)

**Cel.** Ten rozdział określa nadrzędne zasady pracy modeli AI (Claude Code i inne narzędzia kodujące) nad kodem i dokumentacją projektów tej rodziny. Każdy model powinien przeczytać ten dokument (lub jego skrót w `CLAUDE.md`) przed rozpoczęciem większego zadania.

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

Ta metoda była w praktyce stosowana w tej sesji: znaleziona luka w treści i sprzeczność dwóch decyzji o liczbie funkcji zostały przedstawione użytkownikowi z pełnym kontekstem (co A mówi, co B mówi, źródło każdego), zamiast rozstrzygnięte automatycznie.

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

**Przed kodowaniem:** zidentyfikuj moduł, którego dotyczy zadanie · przeczytaj `CLAUDE.md`, ten rozdział, `docs/memory.md`, dokument domenowy związany z zadaniem · znajdź istniejące implementacje podobnych funkcji (nie duplikuj) · zapisz krótki plan zmian · wskaż ryzyka i brakujące dane.

**Podczas kodowania:** małe, logiczne zmiany · zachowuj kompatybilność publicznych interfejsów, chyba że zmiana jest uzasadniona i jawna · dodawaj walidację danych wejściowych (rozdział 04) · jawne typy i jednoznaczne nazwy · nie ukrywaj błędów · nie zostawiaj kodu tymczasowego bez oznaczenia.

**Po kodowaniu:** uruchom testy · uruchom lint/typecheck · sprawdź błędy importów/martwy kod · podsumuj zmienione pliki · opisz wpływ na resztę systemu · wskaż elementy wymagające decyzji człowieka.

## 15.9. Zakazane zachowania AI (dodatkowo do 15.1-15.2 i rozdziału 9)

Nie: tworzyć fikcyjnych norm/wzorów/wartości materiałowych · wpisywać losowych współczynników bezpieczeństwa · deklarować zgodności z normą bez wskazania wersji i zakresu · mieszać jednostek · zapisywać sekretów/kluczy API w repozytorium · zmieniać wielu niezwiązanych modułów naraz · zostawiać nieużywanych funkcji i importów · omijać testów przez wyłączanie walidacji · "sprzątać" kod/dokumentację uznaną za zbędną bez zgody (stary kod, "nieużywana" funkcja, "za długi" dokument — zawsze pytanie, nigdy cicha decyzja).

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
