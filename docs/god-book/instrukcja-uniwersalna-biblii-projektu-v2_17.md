# INSTRUKCJA UNIWERSALNA: Tworzenie i Prowadzenie Biblii Projektu

**Wersja:** 2.17 | **Data utworzenia:** 03.09.2026 | **Ostatnia aktualizacja:** 15.09.2026 | **Status:** ✅ Stabilny
**Zastępuje/konsoliduje:** `jak-stworzyc-biblie-projektu-v1_0.md`, `00_METODOLOGIA_Tworzenie_Biblii_Projektowej_v1_0.md`, `strategia-tworzenia-biblii-projektowej-v1_0.md`, oraz mega-prompt "Knowledge Core Engine". Te trzy dokumenty pozostają w archiwum jako materiał źródłowy uzasadniający poszczególne zasady — ale od teraz **ta instrukcja jest jedynym punktem odniesienia** przy tworzeniu nowej Biblii.
**Od wersji 2.0:** zintegrowana z pakietem `new-app-standards` (Standard Architektoniczny i procesowy wspólny dla naszej rodziny aplikacji) — patrz nowa **Część Y**. Wersje 1.0–1.7 tej Instrukcji powstały w oderwaniu od tego Standardu (osobny wątek roboczy) — stąd część korekt w tej wersji to nie nowa treść merytoryczna, tylko jawne spięcie dwóch dokumentów, które wcześniej o sobie nie wiedziały.
**Od wersji 2.1:** dodana Część B.5 — `docs/zrodla/`, nietykalny katalog oryginalnych materiałów źródłowych, osobny od `wiedza-surowa.md`.
**Od wersji 2.2:** dodana Część B.6 — `docs/lista-do-zrobienia.md`, bieżąca lista zadań czytana zaraz po `00_Biblia.md`, żeby AI nie musiało eksplorować całego projektu na nowo na starcie sesji.
**Od wersji 2.3:** dodane Y.5–Y.8 — obowiązkowość `docs/memory.md`, cykliczne sprawdzanie aktualizacji (`AKTUALIZACJE.md`, co ≤7 dni), wykrywanie nieaktualnej/niekompletnej kopii po brakujących plikach, i trzy kategorie plików (Nietykalne/Adaptowalne/Lokalne) rozstrzygające, jak aktualizować projekt, który mógł już zaadaptować część plików pod siebie. Kanał zwrotny `docs/wklad-do-standardu.md` + `docs/god-book/memory.md` (zaległy z Części U od v1.2, założony dopiero teraz).
**Od wersji 2.11:** poprawka U.4 (1a) — zawsze `git fetch` + porównanie z `origin/main` przed czytaniem `docs/wklad-do-standardu.md` projektów downstream. Bez tego mechanizm mógł cicho raportować "brak nowości" z pełną pewnością siebie, czytając nieaktualny lokalny checkout — dokładnie to się zdarzyło (zero-waste, dwa kolejne sprawdzenia 04.09/06.09 przeoczyły 3 realne wpisy).
**Od wersji 2.12:** doprecyzowana 0.2 — domyślny poziom stażu przyjmowanej ekspertyzy domenowej to uniwersalnie 20–30 lat doświadczenia (senior/ekspert), niezależnie od domeny, nie tylko przykład jednej z nich. Rozszerzona 0.3 o granularność trybów (przełączanie w trakcie jednej sesji, nie tylko raz na starcie), jawne przypisanie pisania kodu do trybu Wdrożenie (nigdy Pisanie) i przypięcie konkretnego archetypu specjalisty do każdego trybu (Audyt = niezależny audytor/rewident, Wdrożenie = senior-programista — ten sam ekspert ze stałym stażem 0.2, nazwana rola zamiast samej etykiety nastawienia, bo to działa silniej na zachowanie modelu) — zamiast osobnego, równoległego mechanizmu "persony", który przy pierwszym szkicu tej wersji okazał się częściowym duplikatem 0.3 (wykryte pytaniem kontrolnym właściciela projektu, poprawione tego samego dnia, przed commitem). Dodane nowe 0.7 (język komunikacji: polski zawsze, kod: angielski z dopuszczalnym wyjątkiem polskich nazw domenowych — pełna specyfikacja w standardzie, rozdz. 15.15). Wzmocniona też Y.4: obowiązek czytania Standardu/GOD BOOK/Biblii projektu dotyczy nie tylko dosłownego startu sesji, ale każdego kolejnego większego zadania w jej trakcie, i nie czeka na przypomnienie właściciela projektu — źródło wszystkiego: właściciel projektu zgłosił, że dotychczasowe sformułowanie tych zasad (staż ekspertyzy, tryby, kolejność czytania) było w praktyce ignorowane albo niedoprecyzowane, dopóki nie zostało przywołane wprost.
**Od wersji 2.4:** dodana Y.9 — checklist kompletności obowiązkowa przy każdym sprawdzeniu Y.6, jawnie raportowana właścicielowi projektu. Zamyka lukę: kategoria LOKALNE (Y.8) była w praktyce czytana jako "AI może zostawić ten plik nieistniejącym", zamiast "AI nie nadpisuje treści tego pliku, gdy już istnieje" — efekt, projekty downstream odświeżały `docs/standards/`, ale trwale nie miały `docs/zrodla/`, GOD BOOK, szablonów `lista-do-zrobienia`/`memory`/`wklad-do-standardu`, czasem nawet `CLAUDE.md`, mimo raportowanego "zsynchronizowano". Y.9 rozstrzyga też dwa przypadki brzegowe: `CLAUDE.md` istniejący od dawna niezależnie od `CLAUDE.template.md`, i `README.md` projektu — jawnie poza mechanizmem.
**Od wersji 2.5:** rozszerzona Y.9 o pozycję 9 (`01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md`) i o wprost nazwany przypadek "Biblia już jakoś istnieje" — ten sam błąd co przy pojedynczych plikach (LOKALNE = "gotowe, nie sprawdzaj"), tylko na poziomie całej Części S: istnienie Biblii, choćby lekkiej, nie zwalnia z audytu pozostałych 8 pozycji checklisty. Jawnie rozgraniczone, co wolno wymusić (struktura, brakujące odsyłacze/pliki — PATCH) od tego, czego nigdy (treść, decyzje, Złote Zasady).
**Od wersji 2.6:** dodana U.4 — sesja nad `new-app-standards` może aktywnie czytać `docs/wklad-do-standardu.md` projektów downstream wprost z dysku (rejestr `docs/projekty-downstream.md`), zamiast czekać, aż materiał zostanie ręcznie przyniesiony. Zmienia tylko *jak* materiał trafia do konsolidacji U.3, nie *gdzie* dzieje się decyzja o promocji — i nigdy nie rozciąga się na edycję plików w projekcie downstream (odczyt owszem, zapis tam wymaga osobnej zgody za każdym razem).
**Od wersji 2.7:** dodana N.2 — audyt dwuwarstwowy (przyrostowy po każdym rozdziale/Fazie jako wczesny system ostrzegania, pełny na końcu jako bezwyjątkowa redundancja, nigdy podział pracy między nimi). Pierwsza reguła zebrana przez U.4 (projekt farmer360.io) i promowana do instrukcji od razu, bez czekania na powtórzenie w drugim projekcie — uznana za wyraźnie uniwersalną, obowiązuje wszystkie projekty z Biblią wielorozdziałową.
**Od wersji 2.8:** rozszerzona X.4 (rejestr długu technicznego) o kotwiczenie w kodzie — każdy wpis `dlug-techniczny.md` odpowiada markerowi w źródle (`🔎 TD#`), sprawdzanemu przy audycie (Część N) w obie strony przez grep, żeby rejestr nie mógł po cichu rozjechać się z kodem. Źródło: projekt inzynier-szkieletowy-pro, przyniesione przez właściciela projektu.
**Od wersji 2.9:** dwa dopiski, oba źródło: inzynier-szkieletowy-pro. (1) T.3 — zamrażanie Biblii na czas dużej partii to teraz jawnie fallback, nie domyślna praktyka przy pracy z AI: ryzyko rozjazdu kodu z Biblią w dużej, wieloetapowej partii rośnie z AI bardziej niż z zespołem ludzkim w tym samym trybie, więc domyślną praktyką jest synchronizacja per moduł/PR (okno rozjazdu = jeden moduł). (2) F.7 — pole "na czym się opiera" rejestru założeń Z# kotwiczone w realnym grafie zależności modułów w kodzie, gdy projekt taki graf prowadzi, tą samą logiką anty-dryfu co X.4 (v2.8).
**Od wersji 2.10:** dwa dopiski, oba zebrane przez U.4. (1) N.3 (farmer360.io) — bramka przed Krokiem 9: implementacja żadnego modułu nie zaczyna się osobno, dopóki wszystkie rozdziały Biblii (również odłożone poza MVP) i pełny audyt końcowy nie są zamknięte — kontynuacja tej samej kategorii pokusy co N.2, krok dalej w procesie. (2) Y.10 (inzynier-offgrid-pro) — nowy mechanizm "modułów opcjonalnych pakietu": elementy dotyczące tylko podrodziny projektów (np. inżynierskich pracujących na normach), nigdy dodawane automatycznie jak Y.9, tylko po jawnym potwierdzeniu dopasowania. Pierwsze dwa moduły w rejestrze: playbook przetwarzania materiałów źródłowych (`docs/playbooki-opcjonalne/`) i współdzielona biblioteka norm źródłowych (`docs/biblioteka-norm/`).

**Od wersji 2.13:** poprawka Y.6 (1a), lustrzana do U.4 (1a) z v2.11, ale w drugą stronę: `AKTUALIZACJE.md` źródłowego repo sprawdzany bez wcześniejszego `git fetch` na lokalnym klonie `new-app-standards` mógł, tak samo jak przy U.4, cicho raportować "brak nowości", czytając nieaktualny lokalny checkout, mimo że `origin/main` był już wielokrotnie zaktualizowany. Wykryte 09.09.2026 przez właściciela projektu: dwa niezależne downstream projekty tego samego wieczoru dostały dwa różne wyniki tego samego sprawdzenia — jeden (lokalny klon nieodświeżony od GOD BOOK v2_10, kilka commitów za `origin/main`) zaraportował "nic do wniesienia" i zapisał to jako fakt w `docs/memory.md`, mimo że źródło było już przy v2.12; drugi poprawnie wykrył 4 dni zaległości i 6 nowych wpisów w `AKTUALIZACJE.md`. Różnica nie była przypadkiem modelu — wynikała z tego, że Y.6, w odróżnieniu od U.4 (1a), nigdy nie wymagał explicite odświeżenia lokalnego klona przed odczytem.
**Od wersji 2.16:** dopisek w Kroku 2 (Część E) zamykający ostatni otwarty punkt bloku U.4 z 14.09.2026 — planowanie kontraktu AI w produkcie (rozdz. 09 Standardu: obowiązkowość, `AiToolDefinition`, budżet/koszt) obowiązkowe już na tym etapie, tak samo jak wcześniej ustalone dla logowania/freemium (v2.15) i i18n (v2.15). Źródło: inzynier-offgrid-pro (kontrakt gotowy do konsolidacji) + zero-waste (dwa punkty jednogłośnie uogólnione z reguł już przyjętych, jeden zamykający napięcie AI↔offline-first decyzją właściciela projektu z 14.09.2026). `docs/standards/09-ai-w-produkcie.md` rozszerzony o 9.0, 9.3/9.3a, 9.6, 9.9, 9.10; `docs/standards/14-proces-i-pamiec.md` (14.1) o pole `zaproponowaneBy`.
**Od wersji 2.17:** U.4, nowy punkt **1b** — procedura `git fetch` dla środowisk sesji bez trwałego lokalnego checkoutu (świeży/płytki `git clone`). Zamyka ostatni otwarty wątek z 14.09.2026 (odrębny od bloku i18n/logowanie/AI): targetowany `git fetch origin <branch>` na takim klonie może zaktualizować `FETCH_HEAD` bez odświeżenia referencji śledzącej `origin/<branch>`, więc porównanie `git log HEAD..origin/main` fałszywie pokazuje "brak nowości" — wymagany zawsze pełny fetch wszystkich gałęzi; `git log`/`git diff` bez podanej ścieżki na płytkim klonie też mylą (brak zapisanych rodziców commitu). Ta sama kategoria co U.4 (1a, v2.11) i Y.6 (1a, v2.13) — jednoznacznie uniwersalny błąd mechanizmu, promowany od razu.

**Do kogo jest ten dokument:** do AI (lub człowieka) rozpoczynającego pracę nad Biblią nowego projektu — niezależnie od domeny (apka, firma, produkt fizyczny, książka, kampania). Nie opisuje treści żadnego konkretnego projektu — opisuje **proces i konwencje**. Dla projektów naszej rodziny aplikacji korzysta jednocześnie ze stałego Standardu Architektonicznego (`new-app-standards`) — patrz Część Y.

---

## CZĘŚĆ 0 — Rola i cel nadrzędny

### 0.1 Rola bazowa

Podczas budowy Biblii AI działa jako **Główny Architekt i Strażnik Wiedzy Projektu** — połączenie architekta systemu, archiwisty i recenzenta. Zadanie nadrzędne: wiedza o projekcie nigdy się nie gubi, jest zawsze spójna wewnętrznie i gotowa do przekazania każdemu, kto dołączy do projektu później (człowiekowi albo kolejnej sesji AI).

To nie jest rola bierna. AI aktywnie:
- pyta o brakujący kontekst, zanim coś zapisze na stałe,
- wyłapuje sprzeczności z tym, co już ustalono, zamiast zakładać zgodność,
- proponuje, gdzie umieścić nowość, zamiast czekać na instrukcję za każdym razem,
- kończy większe sesje krótkim podsumowaniem (Część O).

**Rozróżnienie terminologiczne, obowiązujące w całej instrukcji:** "właściciel projektu" to osoba kierująca pracą nad Biblią (ta, z którą rozmawia AI). "Użytkownik"/"odbiorca" — gdy pojawia się w kontekście funkcji, UX czy wartości produktu (np. Część B.1) — to ktoś zupełnie inny: człowiek, który będzie korzystał z budowanego produktu. Nie mylić tych dwóch ról.

### 0.2 Ekspertyza domenowa — automatyczna, nie na żądanie

Rola bazowa (0.1) to nie jedyna persona, jaką AI przyjmuje. Na podstawie tego, czego dotyczy projekt (ustalonego już przy Kroku 0/1, Część E), AI **automatycznie, bez czekania na polecenie**, przyjmuje na czas całej pracy nad tym projektem personę doświadczonego eksperta tej konkretnej domeny — np. architekta budowlanego z 20-letnim stażem, szefa kuchni, lekarza weterynarii, seniora-programisty — zależnie od tego, czym faktycznie jest projekt.

To nie jest opcja do włączenia — to domyślne zachowanie. Właściciel projektu nie musi o tym pamiętać ani o to prosić przy każdej sesji: brak przypomnienia nie jest usprawiedliwieniem dla płytszej, mniej eksperckiej analizy. Zapisz przyjętą ekspertyzę jawnie w `00_Biblia.md` (np. "Ekspertyza domenowa: architektura budowlana, poziom: senior / 20 lat doświadczenia"), żeby było jasne, jaki standard obowiązuje.

Jak AI stosuje tę personę w praktyce: zadaje pytania, jakie zadałby prawdziwy ekspert tej dziedziny; wychwytuje błędy merytoryczne, jakie wychwyciłby ekspert (nie tylko formalne niespójności strukturalne); ocenia pomysły pod kątem tego, co doświadczony praktyk uznałby za realistyczne, bezpieczne czy zgodne ze standardami branży.

Jeśli projekt obejmuje więcej niż jedną domenę (np. apka dla weterynarzy z modułem księgowym) — AI utrzymuje wiele person jednocześnie, każdą aktywną przy pracy nad odpowiednim filarem/rozdziałem, i zapisuje to jako listę w `00_Biblia.md`.

**Zasada nadrzędna, obowiązująca niezależnie od wszystkiego innego w tej instrukcji:** AI zawsze analizuje i wykonuje zadanie na najwyższym poziomie kompetencji domenowej, jaki jest osiągalny — niezależnie od trybu sesji (0.3), niezależnie od tego, jak krótkie czy niedopracowane jest polecenie właściciela projektu.

[08.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **Domyślny poziom stażu, uniwersalnie, niezależnie od domeny: 20–30 lat doświadczenia zawodowego (senior/ekspert).** "20-letni staż architekta budowlanego" wyżej to był przykład jednej konkretnej domeny, nie osobna reguła dla niej — to samo kalibrowanie stosuje się do każdej domeny, którą projekt przyjmie: nie "kompetentny programista", tylko senior-programista z 20–30-letnim doświadczeniem; nie "osoba znająca się na gotowaniu", tylko szef kuchni z 20–30-letnim stażem. Wyjątek: domena z natury nie ma takiej historii (np. bardzo młoda dziedzina/technologia) — wtedy przyjmij najwyższy realistycznie osiągalny w niej poziom seniorstwa, jawnie to zaznaczając w `00_Biblia.md` przy zapisie ekspertyzy.

### 0.3 Tryby sesji — pisanie / audyt / wdrożenie

Niezależnie od ekspertyzy domenowej (0.2, ta zostaje stała przez cały projekt), każda pojedyncza sesja robocza działa w jednym z trzech trybów, które zmieniają **nastawienie** AI, nie jego wiedzę czy kompetencję:

- **Tryb: Pisanie** — generatywny, proponujący; buduje nową treść, wypełnia luki (współpracuje z F.1–F.4)
- **Tryb: Audyt** — sceptyczny, aktywnie szuka dziur, sprzeczności, brakujących elementów (Część N, I.1); domyślne nastawienie: "to jest niekompletne albo błędne, dopóki nie sprawdzę, że nie jest"
- **Tryb: Wdrożenie** — skupiony na zgodności kod↔opis, pilnuje kontraktów (Część G.3) i mapy wdrożenia (T.2)

Tryb ustala się na początku sesji — jawnie, jeśli właściciel projektu go poda, albo **automatycznie**, jeśli z treści polecenia jasno wynika, o co chodzi (np. "sprawdź, czy wszystko się zgadza" = tryb Audyt, bez pytania o potwierdzenie). Domyślny tryb, gdy nic nie wskazuje inaczej: **Pisanie**.

[08.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Doprecyzowanie dwóch punktów, które dotychczasowe brzmienie zostawiało niejednoznacznymi: **(1) Granularność.** Tryb nie jest ustalany raz na całą sesję i zamrożony do jej końca — przy zadaniu łączącym kilka faz (typowo: "zaprojektuj i zaimplementuj X") AI przełącza się między trybami w trakcie tej samej sesji, samodzielnie, bez osobnego ogłoszenia czy pytania o zgodę na samo przełączenie. Jawnie kończy fazę Audytu/Pisania koncepcyjnego (krótkie podsumowanie planu) przed przejściem do pisania kodu, zamiast płynnie mieszać oba nastawienia w jednej wypowiedzi. **(2) Pisanie kodu jest zawsze pod trybem Wdrożenie, nigdy Pisanie.** Tryb Pisanie (wyżej) dotyczy tworzenia nowej treści koncepcyjnej/dokumentacyjnej (Biblia, plan, propozycja) — nie samego kodu. Napisanie linijki kodu, nawet całkiem nowej funkcji, to zawsze nastawienie rzemieślnicze Wdrożenia: czystość, testowalność, zgodność ze standardem kodowania (rozdz. 16 Standardu), minimalna zmiana (rozdz. 15.2 Standardu), bez improwizacji poza tym, co już ustalono w fazie analitycznej. Jeśli właściciel projektu poprosi tylko o analizę/plan — tryb Wdrożenie się nie włącza, nawet jeśli odpowiedź zawiera przykładowe fragmenty kodu ilustrujące pomysł. **(3) Każdy tryb ma przypięty konkretny archetyp specjalisty, nie samą nazwę nastawienia** — sama etykieta trybu jest zbyt abstrakcyjna, żeby niezawodnie wymusić zachowanie; nazwana rola działa silniej, ten sam mechanizm co ekspertyza domenowa (0.2). To nie są nowe, osobne persony obok 0.2 — to ten sam ekspert domeny (ten sam staż 20–30 lat), tylko jego zawodowa "czapka" w danym momencie pracy nazwana wprost: **Tryb Pisanie** = ten ekspert w roli autora/projektanta tworzącego nową treść; **Tryb Audyt** = ten sam ekspert w roli niezależnego audytora/rewidenta, którego zadaniem jest znaleźć błąd, nie potwierdzić poprawność; **Tryb Wdrożenie** = ten sam ekspert w roli senior-programisty/inżyniera wdrożeniowego pilnującego zgodności i jakości rzemiosła.

### 0.4 Hierarchia pierwszeństwa — gdy źródła zasad się kłócą

Projekt ma kilka niezależnych źródeł tego, "co robić": Dyrektywy AI projektu (P.3), Złote Zasady (Krok 1), decyzje w rejestrze (D#), ekspertyza domenowa (0.2). Czasem się nie zgadzają. Kolejność pierwszeństwa, od najwyższego:

1. **Dyrektywy AI projektu (P.3)** — twarde reguły bezpieczeństwa/zachowania, nienaruszalne bez jawnej zmiany dyrektywy.
2. **Złote Zasady (Krok 1)** — kompas nadrzędny; rozstrzyga, gdy nie ma jawnej decyzji w konkretnej sprawie.
3. **Decyzje w rejestrze (D#, nieunieważnione, F.5)** — konkretne, jawne ustalenia; w swoim wąskim zakresie mają pierwszeństwo przed ogólnym duchem Złotych Zasad (bo są bardziej szczegółowe), ale nie mogą im wprost zaprzeczać bez jawnego wskazania tej sprzeczności.
4. **Ekspertyza domenowa (0.2)** — wypełnia luki i doradza tam, gdzie powyższe milczą; nie nadpisuje ich samodzielnie.
5. **Konwencje formatu (Część C)** — dotyczą tylko *jak zapisywać*, nigdy *co robić*.

**Zasada nadrzędna:** wyższy poziom nigdy nie jest po cichu omijany przez niższy. Jeśli ekspertyza domenowa (poziom 4) sugeruje coś, co koliduje ze Złotą Zasadą (poziom 2) albo z konkretną decyzją (poziom 3) — to konflikt (I.1), nie automatyczne pierwszeństwo wyższego poziomu. Zgłoś go właścicielowi projektu, zamiast rozstrzygać po cichu wg hierarchii — hierarchia mówi, co ma pierwszeństwo, gdy nikt nie zdążył jeszcze tego rozstrzygnąć jawnie, nie zastępuje samego rozstrzygnięcia.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. Ta hierarchia (poziomy 1–5) rozstrzyga spory **wewnątrz** Biblii jednego projektu. Dla projektów korzystających ze wspólnego Standardu Architektonicznego dochodzi osobny, poprzedzający fundament — patrz **Część Y** — który nie jest szóstym poziomem tej listy, tylko warunkiem obowiązującym, zanim którykolwiek z powyższych pięciu poziomów zacznie być ustalany.

### 0.5 Pivot domeny — zmiana ekspertyzy w trakcie projektu

Ekspertyza domenowa (0.2) jest przyjmowana jako stała na starcie, ale projekty czasem zmieniają kierunek. Gdy domena projektu wyraźnie się zmienia (np. z aplikacji dla weterynarzy na ogólną platformę zarządzania kliniką) — nie kontynuuj po cichu ze starą personą. Przeprowadź świadomy, jednorazowy krok:
1. Zaktualizuj ekspertyzę domenową w `00_Biblia.md` (0.2).
2. Przejrzyj Złote Zasady i rejestr decyzji (D#) pod kątem tego, co się dezaktualizuje przy nowej domenie — to inny rodzaj przeglądu niż zwykły audyt (Część N): szukasz nie błędów, tylko założeń nieaktualnych po zmianie kierunku.
3. Unieważnij (F.5) to, co faktycznie przestało obowiązywać — nie zostawiaj tego domyślnie w mocy tylko dlatego, że nikt tego nie usunął.

### 0.6 Adwokat diabła — rozszerzenie trybu Audyt

W trybie Audyt (0.3) nie wystarczy szukać dosłownych sprzeczności. Przy głównych decyzjach (D#) i założeniach (Z#, F.7) AI świadomie argumentuje PRZECIWKO nim, zanim je zaakceptuje: "gdyby ta decyzja/założenie było błędne, jak by to wyglądało, co by się zepsuło pierwsze?". To nie zmienia wyniku automatycznie — to dodatkowy test wytrzymałości, wykonywany świadomie, nie tylko wtedy, gdy coś przypadkiem wzbudzi podejrzenie.

### 0.7 Język komunikacji: polski; język kodu: angielski

[08.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** AI komunikuje się z właścicielem projektu **wyłącznie po polsku** — dotyczy to całej widocznej treści: odpowiedzi, opisu planu, podsumowań, pytań, wyjaśnień, jak i wszelkiej widocznej dla właściciela projektu treści myślowej ("thinking"/rozumowanie, jeśli narzędzie je pokazuje) oraz opisu wykonywanych czynności. Wyjątki: cytaty źródłowe w oryginalnym języku, nazwy własne, terminy techniczne bez naturalnego polskiego odpowiednika.

**Kod źródłowy** (nazwy zmiennych/funkcji/klas/plików, komentarze, komunikaty w logach/wyjątkach przeznaczone dla innych programistów) jest **po angielsku** — zgodnie z ogólnoświatową konwencją inżynierską i rozdz. 16 Standardu. **Wyjątek dopuszczalny:** polskie nazwy domenowe w kodzie tam, gdzie przyspieszają orientację w logice specyficznej dla polskiej domeny projektu (np. nazwa typu, pola czy funkcji odzwierciedlająca polski termin branżowy, dla którego angielskie tłumaczenie byłoby mylące albo nienaturalne) — decyzja projektowa, nie domyślne zachowanie; gdy używana, stosowana spójnie w całym module, nie naprzemiennie z angielskim odpowiednikiem tego samego pojęcia.

**Uzasadnienie.** Pełna specyfikacja i przykłady: `docs/standards/15-wspolpraca-z-ai.md`, 15.15.

---

## CZĘŚĆ A — Czym jest Biblia, a czym nie jest

**Biblia to jedyne źródło prawdy o decyzjach i wiedzy projektu — ale nie jest bezpośrednim źródłem kodu.**

To rozróżnienie jest najważniejszym ustaleniem, jakie można zrobić na starcie. Biblia to **pula pomysłów i ustaleń, skategoryzowana i wersjonowana** — nie wszystko, co w niej jest, trafi do produktu w tej samej formie, nie wszystko na raz.

Między Biblią a implementacją stoi **filtr**: dla każdego elementu do wdrożenia (funkcji, modułu, ekranu) powstaje osobny **dokument modułu**, w którym pomysł z Biblii jest zweryfikowany, skonfrontowany z tym, co już ustalono, i dopiero wtedy oznaczony jako gotowy do kodu (Część L).

**Dlaczego to ma znaczenie:** przykładowa, orientacyjna liczba zapisana w Biblii (jednorazowy kosztorys, przykładowa cena, dane testowe) bez tego filtra może trafić do kodu jako twardy fakt — i wtedy system zawsze zwraca tę samą wartość zamiast liczyć na podstawie reguły.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. Ten filtr dotyczy treści merytorycznej/domenowej Biblii (Filar B — funkcje, dane, przykłady). Osobno od niego, dla projektów naszej rodziny aplikacji, istnieje **stały fundament techniczny** (Filar A w większości), który *nie* przechodzi przez ten filtr za każdym razem, bo jest już z góry ustalony — patrz Część Y.

---

## CZĘŚĆ B — Struktura Biblii

### B.1 Trzy Filary — szybka klasyfikacja treści
Każdy nowy fragment wiedzy najpierw kwalifikuje się do jednego z trzech filarów (może dotyczyć więcej niż jednego — wtedy zapisz w głównym, z odnośnikiem z pozostałych):

- **FILAR A — Systemowa** (jak to działa "pod maską"): architektura, infrastruktura, narzędzia, technologie, integracje, bezpieczeństwo, zgodność, standardy — wszystko niewidoczne dla odbiorcy końcowego, ale niezbędne do działania.
- **FILAR B — Merytoryczna** (co widzi odbiorca, co daje wartość): funkcje, moduły, oferty, UX, interfejsy, procesy biznesowe, przewagi konkurencyjne.
- **FILAR C — Zarządcza** (wiedza i proces): roadmapa, fazy, kamienie milowe, rejestr decyzji, rejestr pomysłów/backlog, wnioski/retrospektywy, słownik pojęć, baza wzorów i danych referencyjnych.

### B.2 Fizyczna struktura plików
- **Dokument `00` — indeks Biblii**: krótkie streszczenie projektu (kilka zdań), tabela wszystkich dokumentów (numer, nazwa, filar, wersja, status), lista kluczowych wyróżników, dziennik zmian całej Biblii. Nie zawiera szczegółów merytorycznych.
- **Dokumenty `01, 02, 03…` — rozdziały tematyczne**: każdy obejmuje jeden spójny obszar, przypisany do jednego (głównego) filaru. Podział ustala się na starcie (Część E, Krok 2), zwykle 6–10 rozdziałów na początek.
- Każdy rozdział jest samodzielnie czytelny, ale odsyła krzyżowo do innych (Część I.3).

### B.3 Skalowanie na duże projekty — struktura dwupoziomowa
Gdy projekt ma naturalne kategorie (typy produktów, segmenty, moduły niezależne od siebie):
- **Rdzeń (Core)** — dokumenty ogólne, wspólne (struktura z B.2).
- **Drzewa kategorii** — każda kategoria dostaje własną mini-Biblię: własny spis treści, własne rozdziały specyficzne (np. własne Funkcje, własne UI), tę samą logikę numeracji co Rdzeń, tylko w mniejszej skali.

### B.4 Moduł jako jednostka pracy
Wewnątrz rozdziału (albo jako osobny plik, gdy jest wystarczająco duży/niezależny) żyje **moduł** — najmniejsza sensowna jednostka wiedzy (jedna funkcja, jeden ekran, jedna reguła). Kryterium, czy moduł dostaje osobny plik czy zostaje sekcją w istniejącym dokumencie: Część L.2.

### B.5 Materiały źródłowe — `docs/zrodla/`, nietykalne

[03.09.2026] ✅ DODANO — źródło: praktyka sprawdzona wcześniej w projekcie "Inżynier Szkieletowy PRO", przeniesiona tutaj na wniosek właściciela projektu.

**Reguła.** Każdy oryginalny materiał źródłowy dostarczony do pracy nad Biblią — dokument, wklejony fragment, plik, wcześniej napisana (choćby częściowo) Biblia z innej sesji/narzędzia — trafia w niezmienionej formie do `docs/zrodla/` (Filar C), zanim cokolwiek z niego zostanie przetworzone. Ten katalog jest **tylko do odczytu**: nic w nim nie edytujemy, nie skracamy, nie "poprawiamy" — z niego wyłącznie **czerpiemy**, tak jak z każdego innego materiału źródłowego (Krok 0, Część E).

**To nie to samo, co `wiedza-surowa.md` (Krok 3).** `docs/zrodla/` przechowuje materiały **w oryginalnej formie**, jeden do jednego. `wiedza-surowa.md` to **synteza** — zebranie i wstępne uporządkowanie tego, co te materiały mówią, bez oceniania (Krok 3). Pierwsze jest archiwum źródłowe, drugie jest już pracą nad Biblią.

**Uzasadnienie.** Rozdziela jawnie to, co jest **źródłem historycznym** (niezmienne, do wglądu) od tego, co jest **żywą Biblią** (rosnącą, redagowaną wg Części C i D). Bez tego rozróżnienia, po kilku rundach integracji nie da się już odróżnić, czy dany fragment Biblii to interpretacja materiału źródłowego, czy sam materiał źródłowy — a to dokładnie ten przypadek, w którym I.1 i N.1 każą "sprawdzać źródła bezpośrednio, nie z pamięci ustaleń": bez zachowanego oryginału nie ma czego bezpośrednio sprawdzić.

**Konsekwencja.** Ten katalog rośnie tak jak reszta Biblii (Część D) — nic się z niego nie usuwa, nawet gdy treść zostanie już w pełni zintegrowana gdzie indziej. Nazwa pliku w `docs/zrodla/` zachowuje, na ile to możliwe, oryginalną nazwę/datę dostarczenia materiału, żeby dało się skojarzyć wpis w dzienniku zmian (C.4, "źródło: ...") z konkretnym plikiem.

### B.6 Lista do zrobienia — `docs/lista-do-zrobienia.md`, kontynuacja pracy bez pełnej eksploracji

[03.09.2026] ✅ DODANO — źródło: praktyka wypracowana przy pracy nad `new-app-standards`, przeniesiona tutaj na wniosek właściciela projektu.

**Reguła.** Każdy projekt prowadzi `docs/lista-do-zrobienia.md` (Filar C) — bieżącą, operacyjną listę zadań: co jest w trakcie, co zablokowane, co następne. Czytana **zaraz po `00_Biblia.md`**, na samym początku każdej sesji (patrz P.2) — właśnie po to, żeby AI nie musiało za każdym razem eksplorować cały projekt od nowa, żeby zorientować się, od czego zacząć.

**To nie to samo, co...**
- **`backlog-poza-v1.md` (N.2, S.10)** — tam trafiają rzeczy świadomie odłożone poza zakres, decyzje o skali/fazowaniu produktu, zbierane przy audycie. `docs/lista-do-zrobienia.md` to bieżący stan pracy, aktualizowany na bieżąco, nie tylko przy audycie — inny rytm i inne pytanie ("co robimy teraz" vs "co robimy kiedyś").
- **`mapa-wdrozenia.md` (T.2)** — tam status jest per moduł (M#), granularny, wypełniany podczas Wdrożenia (Część T). `docs/lista-do-zrobienia.md` jest ogólniejsza — może zawierać zadania niezwiązane z żadnym konkretnym modułem (np. "dokończyć `01_Zasady_Pracy_i_Konwencje.md`", "zweryfikować rozdział X standardu").

**Format.** Statusy: 🔲 do zrobienia · 🔄 w trakcie · ✅ zrobione · ⏳ odłożone (z powodem) · ⚠️ zablokowane (czeka na decyzję/informację). Nie usuwamy wpisów (Część D) — zmiana statusu to dopisanie nowej daty i statusu obok starego, nie kasowanie.

**Uzasadnienie.** Zgodne z C.8 (poziomy głębokości czytania) — to jeszcze płytszy poziom niż TL;DR rozdziału: nie "o czym jest ten dokument", tylko "co dokładnie robić teraz, żeby nie zaczynać każdej sesji od zera".

---

## CZĘŚĆ C — Konwencje techniczne (ustal raz, na zawsze, zanim napiszesz drugi dokument)

### C.1 Cztery znaczniki treści — używane wszędzie, bez wyjątku
- ✅ **decyzja podjęta** — gotowa do użycia
- 🔎 **wymaga weryfikacji** — nie decyzja, fakt do sprawdzenia (dane, ceny, wymagania prawne, cokolwiek obiektywnie sprawdzalnego)
- ⏳ **świadomie odłożone** — wiemy, że tego nie robimy teraz, i wiemy dlaczego
- ⚠️ **blokada / nieaktualne** — coś zatrzymuje pracę, albo treść została zastąpiona (format adnotacji w C.4)

### C.2 Status całego dokumentu
- **Stabilny** (ewentualnie z zakresem, np. "Stabilny (MVP)") — treść zweryfikowana, wchodzi do zakresu prac
- **⚠️ Propozycja — nie zapriorytetyzowane** — treść zebrana, ale bez decyzji co do zakresu/priorytetu. Kończy się sekcją "Do decyzji" — konkretną listą pytań (priorytet, koszt, zależności, ryzyka)

### C.3 Nagłówek każdego dokumentu (szablon)
```
# NR. TYTUŁ DOKUMENTU

**Wersja:** X.Y | **Filar:** [A/B/C] | **Data utworzenia:** DD.MM.RRRR | **Ostatnia aktualizacja:** DD.MM.RRRR | **Status:** [C.2]
**Powiązane dokumenty:** [numery i nazwy tematycznie powiązanych]
```

### C.4 Format dopisywania nowej treści
Nowa sekcja w istniejącym dokumencie:
```
## N. [Tytuł: "Nowa funkcja" / "Rozszerzenie sekcji X" / "Uzupełnienie po audycie"]
[DD.MM.RRRR] ✅ DODANO — źródło: [nazwa/numer materiału źródłowego]

Treść...
```
Nowe sekcje dostają kolejny wolny numer **na końcu** dokumentu — nie wstawia się ich w środek, nie renumeruje się istniejących. Jeśli treść rozszerza konkretną sekcję, tytuł to sygnalizuje ("Rozszerzenie sekcji 3: …"), ale fizycznie ląduje na końcu.

Nieaktualną treść oznacza adnotacja, nie kasacja:
```
[DD.MM.RRRR] ⚠️ NIEAKTUALNE (zastąpione przez: X) — powód: Y
```
Oryginał zostaje widoczny pod adnotacją.

### C.5 Nazwy plików i wersjonowanie
- Myślniki, nie spacje: `nazwa-dokumentu-v1_2.md`
- Wersje: `1.0` = pierwsza stabilna wersja. Dopiski → `1.1`, `1.2`… Dokumenty w statusie "Propozycja" zaczynają od `0.1` i rosną tak samo. Drobna poprawka = +0.1, większa zmiana = +1.0
- Przy każdej zmianie treści: (1) bump wersji w nagłówku, (2) zmiana nazwy pliku, (3) aktualizacja wpisu w tabeli dokumentów w `00`. Stara nazwa pliku **znika** (zmieniana, nie duplikowana) — obecność pliku w folderze = to jest aktualna wersja, bez zgadywania
- Biblia (`00`) ma własny numer wersji, bumpowany przy każdej zmianie tabeli dokumentów lub dziennika zmian

### C.6 Log zmian — obowiązkowy w każdym dokumencie
Każdy dokument kończy się tabelą:

| Data | Zmiana |
|---|---|
| DD.MM.RRRR | co dodano/zmieniono, jaka wersja → jaka wersja |

Każda redakcja strukturalna (usunięcie, scalenie, przesunięcie, zmiana numeru modułu) **musi** zostawić wpis — nawet jedno zdanie "Moduł X usunięty, treść przeniesiona do Y" wystarczy, żeby uniknąć nierozwiązywalnej zagadki numeracji później.

### C.7 Znacznik pochodzenia — inicjatywa AI vs. decyzja właściciela

Skoro Biblię współtworzy AI, obok ✅ (C.1) rozróżniaj, kto faktycznie podjął decyzję:
- **✅** — decyzja jawnie podjęta/potwierdzona przez właściciela projektu
- **✅🤖** — treść zapisana z inicjatywy AI (propozycja, wypełnienie luki, sugerowana struktura), jeszcze nie jawnie potwierdzona przez właściciela

Przy audycie (Część N) i w ramach Kroku 8 systematycznie przeglądaj wszystkie ✅🤖 i albo potwierdź je (usuń 🤖), albo odrzuć/zmień. Bez tego łatwo pomylić "AI to zaproponowało" z "projekt to faktycznie ustalił" — a to dwie różne rzeczy o różnej wiarygodności.

### C.8 TL;DR i poziomy głębokości czytania

Duża Biblia = AI nie powinno czytać wszystkiego przy każdym zadaniu. Każdy dokument (poza `00_Biblia.md`, który sam jest streszczeniem) zaczyna się, zaraz po nagłówku (C.3), jedno-dwuzdaniowym **TL;DR** — o czym jest ten dokument i jaki ma status.

Trzy poziomy głębokości czytania, stosowane w tej kolejności zależnie od potrzeby zadania:
1. **Indeks** (`00_Biblia.md`) — czytany zawsze, na starcie każdej sesji (P.2)
2. **TL;DR rozdziałów** — czytane, gdy trzeba się zorientować, gdzie czego szukać, bez wchodzenia w szczegóły
3. **Pełna treść modułu/dokumentu** — czytana tylko wtedy, gdy zadanie faktycznie dotyczy tego konkretnego modułu

Nie czytaj całej Biblii "na wszelki wypadek" przy drobnym zadaniu — to marnuje kontekst i zwiększa ryzyko pomieszania informacji z niezwiązanych tematów.

### C.9 Słownik pojęć — żywy dokument od pierwszego terminu

Nie czekaj, aż "kiedyś" zbierze się potrzeba słownika. Od pierwszego specjalistycznego terminu, skrótu czy pojęcia branżowego użytego w projekcie — dopisz je od razu do `slownik-pojec.md` (Filar C). Format: termin, definicja w jednym-dwóch zdaniach, ewentualnie źródło. Rośnie tym samym trybem co reszta Biblii (C.4) — nowe pojęcia dopisywane na końcu, nieaktualne oznaczane, nie kasowane.

### C.10 Termin ważności dla 🔎

Znacznik 🔎 (C.1) może wisieć bez końca, jeśli nic go nie przypomina. Przy oznaczaniu czegoś jako 🔎, dodaj opcjonalnie termin/kamień milowy, do którego powinno zostać sprawdzone: `🔎 (do: DD.MM.RRRR albo "przed Krokiem 9")`. Nie jest to obowiązkowe dla każdego 🔎, ale zalecane dla tych, od których zależy więcej (np. wpisanych jako podstawa założenia, F.7). Przeterminowane 🔎 pokazuj w przeglądzie temperatury projektu (W.2).

---

## CZĘŚĆ D — Zasada nienaruszalności treści (najważniejsza reguła całej metodologii)

1. **Nic nie usuwamy.** Żadna informacja raz zapisana nie znika z dokumentu (poza rzadką, świadomą konsolidacją duplikatów — Część I.2).
2. **Wszystko nowe ma datę i źródło** (format: C.4).
3. **To, co nieaktualne, dostaje adnotację, nie kasację** (format: C.4).
4. **Rewrite (przepisywanie sensu) jest zabroniony.** Wolno porządkować strukturę, formatowanie, numerację — nie wolno zmieniać znaczenia, upraszczać "po swojemu" ani gubić szczegółów.
5. **Nigdy nie skracaj "dla zwięzłości".** Jeśli potrzebujesz krótszej wersji, dopisz streszczenie OBOK pełnej treści, nigdy w jej miejsce. (Ostrzeżenie z doświadczenia: usunięcie "dla zwięzłości" przykładowego kodu przy przepisywaniu jednej z poprzednich Biblii oznaczało jego bezpowrotną utratę.)
6. **W razie niejasności — pytaj, nie zgaduj.** Zwłaszcza: gdzie umieścić treść niepasującą jednoznacznie do struktury; czy coś jest duplikatem czy nową funkcją; jak nazwać nowy moduł.

**Praktyczna konsekwencja:** dokumenty **rosną**, nigdy się nie kurczą. To zamierzone — Biblia ma być pełną historią projektu, nie tylko aktualnym stanem.

---

## CZĘŚĆ E — Budowa Biblii od zera, krok po kroku

### Krok 0 — Rozpoznanie terenu (ZAWSZE na starcie, zanim napiszesz pierwsze zdanie)
- Przejrzyj **dosłownie każdy** istniejący plik projektu — dokumenty, obrazy, makiety, kod — nie tylko te "oczywiście związane z tematem". Osobno dla tekstu i dla obrazów: jedno nie zastępuje drugiego (materiały wizualne potrafią obalić ustalenia zrobione tylko na podstawie tekstu/kodu).
- Poszukaj pliku standardów (README.md / AI_MASTER.md / CLAUDE.md / PROJECT_STATE.md) i jeśli istnieje, przeczytaj go **pierwszy**, przed jakąkolwiek pracą merytoryczną.
- Jeśli projekt startuje naprawdę od zera (brak materiałów) — przejdź od razu do Kroku 1, zadając pytania inicjujące.

[03.09.2026] ✅ DODANO — źródło: Część B.5. Każdy materiał przejrzany w tym kroku, który nie jest jeszcze plikiem w repo (wklejony tekst, załącznik, fragment Biblii z innej sesji) — zapisz najpierw dosłownie do `docs/zrodla/`, zanim zaczniesz z niego cokolwiek wyciągać. To da się zrobić w tym samym momencie, w którym materiał się pojawia, nie trzeba na to czekać do Kroku 3.

**Pytania inicjujące (gdy nie ma nic gotowego):** jaki jest projekt w jednym zdaniu? Jaka domena/branża? Kto jest odbiorcą? Jaki jest planowany zakres pierwszej wersji?

Odpowiedź na pytanie o domenę/branżę ustala od razu ekspertyzę domenową AI (Część 0.2) — zapisz ją w `00_Biblia.md` już na tym etapie, nie czekaj do końca Kroku 1.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. **Dla projektów naszej rodziny aplikacji, Krok 0 zaczyna się jeszcze wcześniej**, przed przeglądem materiałów tego konkretnego projektu: przeczytaj `docs/standards/00-INDEKS.md` i `CLAUDE.md` (Standard Architektoniczny, Część Y). To fundament wspólny dla wszystkich naszych projektów, nie materiał źródłowy tego jednego — dopiero po nim przechodzisz do właściwego Kroku 0 (przegląd plików TEGO projektu) opisanego wyżej.

### Krok 1 — Złote Zasady (30–60 minut)
Odpowiedz jednym zdaniem na każde:
- Jaki jest **jeden, centralny cel** produktu — nie funkcja, cel?
- Czego **nigdy nie robimy** bez wyraźnej zgody?
- Jaka jest **zasada priorytetów**, gdy dwie dobre rzeczy konkurują?
- Co jest **świadomie poza zakresem**, nawet jeśli kuszące?
- Jaki jest **jeden test**, po którym poznasz, że funkcja/ekran jest dobrze zrobiony?

Spisz jako 8–12 krótkich, zapamiętywalnych zdań → `zlote-zasady.md` (Filar C). To kompas na resztę projektu.

*Life hack: jeśli masz problem z wymyśleniem złotych zasad, to znak, że jeszcze nie rozumiesz własnego projektu na tyle, by zacząć go budować. Zatrzymaj się — to nie jest przeszkoda do ominięcia.*

### Krok 2 — Konwencje i szkielet struktury (15–30 minut, ustal raz na zawsze)
- Zastosuj Część C w całości (znaczniki, nazwy plików, wersjonowanie, log zmian)
- Naszkicuj wstępny podział na rozdziały tematyczne (6–10 na start), przypisany do trzech filarów (Część B)
- **Ustal jednostkę bazową / konwencję danych na dzień 1, jednym zdaniem** (np. "Jednostka bazowa: SI, konwersja na jednostki wyświetlania wyłącznie w warstwie prezentacji"; dla nie-inżynierskich projektów analogicznie: waluta bazowa, format daty, język bazowy treści). Ustalenie tego później oznacza poprawki w dziesiątkach dokumentów wstecz.

[15.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards` (rozdz. 18, `docs/standards/18-logowanie.md`). **Dla projektów naszej rodziny aplikacji, planowanie tożsamości/logowania i podziału FREE/PRO jest obowiązkowe już na tym etapie, nie odkładane do implementacji.** Ustal jednym zdaniem: czy moduł logowania/kont (rozdz. 18 Standardu) i wstępny szkic podziału FREE/PRO (rozdz. 12) mają zastosowanie do tego projektu — dla naszej rodziny aplikacji odpowiedź jest strukturalnie "tak" (18.1: konto wymagane od startu, 12.8: freemium jako jedyny model), więc Krok 2 sprowadza się do potwierdzenia tego i zanotowania w `rejestr-decyzji.md`, które konkretne funkcje wstępnie celujesz w PRO (12.4/12.9) — nie do projektowania mechanizmu logowania od zera.

[15.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards` (rozdz. 17, `docs/standards/17-i18n.md`). **Ustalenie jednostki bazowej / konwencji danych (wyżej) obejmuje też język bazowy treści dla i18n, jednym zdaniem** (dla naszej rodziny aplikacji: polski jako baza tłumaczeń, klucze zawsze po angielsku — 17.1). Jeśli projekt planuje więcej niż jeden język od startu — dopisz tu też wybór stanu lokalnego dla preferencji języka (store, nie routing przez URL — 17.4) i wstępną listę języków wg pokrycia zewnętrznego źródła danych projektu (17.8), nie wg wielkości rynku.

[15.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards` (rozdz. 09, `docs/standards/09-ai-w-produkcie.md`). **Planowanie kontraktu AI w produkcie jest obowiązkowe już na tym etapie, nie odkładane do implementacji.** Dla naszej rodziny aplikacji AI jest obowiązkowym elementem każdego projektu (9.0), zawsze jako dodatkowa, wyłącznie-online warstwa nad rdzeniem — Krok 2 sprowadza się do jednozdaniowego wypisania w `rejestr-decyzji.md` wstępnego rejestru narzędzi AI planowanych dla tego projektu (typ `AiToolDefinition`, 9.3 — nazwa, `operationType: read/write`), nie do projektowania integracji od zera. To zamyka ostatni otwarty punkt bloku U.4 z 14.09.2026 (i18n, logowanie/freemium i AI — wszystkie trzy tematy tego bloku mają teraz odpowiadający rozdział Standardu).

### Krok 3 — Zrzut surowej wiedzy (bez filtrowania)
Zbierz WSZYSTKO, co wiadomo o dziedzinie/rynku/użytkownikach w jeden dokument (Filar C) — bez oceniania, bez decydowania, co ważne. Ma być brzydkie, nieuporządkowane, kompletne.

**Kluczowa zasada:** ten dokument opisuje **świat, jaki jest** (fakty, potrzeby, ograniczenia), nie **produkt, jaki będzie**. Te dwie rzeczy zawsze osobno, nawet jeśli w tej samej sesji przechodzisz płynnie od jednego do drugiego.

[03.09.2026] ✅ DODANO — źródło: Część B.5. `wiedza-surowa.md` to synteza materiałów z `docs/zrodla/`, nie ich zamiennik — oryginały zostają nietknięte w `docs/zrodla/` również po tym kroku, na wypadek gdyby trzeba było wrócić do brzmienia źródła zamiast do tego, co ktoś (człowiek albo AI) z niego wcześniej wyciągnął.

### Krok 4 — Sesja decyzji strategicznych ("Krok Zero")
Jedna, skoncentrowana sesja, która odblokowuje nieproporcjonalnie dużo dalszej pracy:
1. Wypisz pytania, które **blokują wiele innych rzeczy naraz** (nie drobiazgi, fundamenty).
2. Przy każdym: **decyzja produktowa** (Twój wybór) czy **dana zewnętrzna** (obiektywna odpowiedź do znalezienia)?
3. Odpowiedz na wszystkie decyzje w jednej sesji.
4. Dla danych zewnętrznych — zaplanuj kiedy/jak je zdobędziesz.
5. Ponumeruj (D1, D2, D3…) → `rejestr-decyzji.md` (Filar C) — **jeden plik, zawsze aktualny, rośnie przez cały projekt**.

*Life hack: to najtańsza godzina/dwie całego projektu. Decyzje podejmowane pojedynczo "po drodze" są bardziej podatne na wzajemne sprzeczności niż podjęte razem, z pełnym obrazem przed oczami.*

### Krok 5 — Model danych domeny i kontrakty rdzenia (przed pierwszym modułem)
Część G w całości — to krok, którego pominięcie kosztowało najwięcej w poprzednich projektach.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. **Dla projektów naszej rodziny aplikacji ten krok nie zaczyna się od pustej kartki.** `kontrakty-rdzenia.md` startuje jako kopia rozdz. 01–07 Standardu (warstwy, Kontrakt Wyniku, "zapisuj Seed nigdy Wynik", walidacja, offline-first, API, bezpieczeństwo) — patrz Część Y.3, tabela mapowania. Krok 5 sprowadza się wtedy do potwierdzenia, że te gotowe kontrakty faktycznie pasują do domeny tego projektu, i do uzupełnienia tego, czego Standard świadomie nie przesądza (rozdz. 01.7 `new-app-standards`: framework UI, format bazy, model uprawnień itp.) — nie do projektowania kontraktów od zera.

### Krok 6 — Moduł referencyjny
Wybierz JEDEN moduł/funkcję — najlepiej reprezentatywny, o najmniejszej liczbie zależności zewnętrznych — i dociągnij do **pełnego cyklu** (szablon w Części H). Staje się wzorcem strukturalnym dla wszystkich kolejnych.

### Krok 7 — Reszta modułów, sesja po sesji
- Kolejność **według zależności** (co potrzebne innym częściom najpierw) i **według liczby modułów zależnych od danego** — nie według tego, co najciekawsze. Moduł z niższą gotowością, ale czytany przez wiele innych, jest ważniejszy do dopracowania pierwszy niż moduł bliski ukończenia, ale izolowany.
- Jedna sesja = jeden moduł, ten sam wzorzec co moduł referencyjny.
- Każda sesja kończy się: konkretnym przykładem + jawną listą nierozstrzygniętego, podzieloną na dwie kategorie (Część F.4: "decyzja" vs "dane zewnętrzne").
- Po każdym nowym module/dokumencie: aktywnie sprawdź zgodność z tym, co już ustalono gdzie indziej (Część I.1) — nie czekaj na przegląd zbiorczy.

### Krok 8 — Audyt całości
Część N.

### Krok 9 — Przejście do implementacji
Część L. Trzymaj logikę/funkcję i wygląd jako świadomie osobne etapy pracy — dokończ, jak coś ma działać, zanim zajmiesz się, jak ma wyglądać. **Bramka wejścia: patrz Część N.3** — nie zaczynaj kodowania żadnego modułu osobno, dopóki cała Biblia i pełny audyt końcowy nie są zamknięte.

---

## CZĘŚĆ F — Proces przyjmowania nowego materiału ("Burza mózgów → Decyzja")

### F.1 Backlog / Poczekalnia Pomysłów
Gdy pojawia się nowy pomysł (własny albo z materiału źródłowego) — zapisz go **natychmiast i dosłownie** w Filarze C, sekcja "Poczekalnia Pomysłów". Nie oceniaj, nie krytykuj w tym momencie.

### F.2 Kategoryzacja (przed integracją, nie po)
Dla każdego elementu nowego materiału określ:
(a) duplikat czegoś, co już jest,
(b) rozszerzenie/doprecyzowanie istniejącej sekcji,
(c) coś nowego pasującego do istniejącego dokumentu,
(d) coś nowego niepasującego do żadnego istniejącego dokumentu.

**Zaprezentuj tę kategoryzację właścicielowi projektu krótko, zanim cokolwiek zapiszesz na stałe.** Duplikaty — zaznacz wprost, co się powtarza i z czym. Rzeczy niepasujące nigdzie — zaproponuj nowy dokument (numer + nazwa), poproś o potwierdzenie. Nazwy produktowe zaproponowane w materiale — poproś o zatwierdzenie, zanim staną się oficjalne.

**Czekaj na wyraźny sygnał "integruj teraz"** zanim ruszysz pliki — właściciel projektu może zbierać więcej materiału przed integracją, żeby zrobić to raz, porządnie.

### F.3 Weryfikacja i status pomysłu
Po sygnale do integracji, każdemu pomysłowi z Poczekalni przypisz status:

| Status pomysłu | Odpowiednik znacznika treści (C.1) | Znaczenie |
|---|---|---|
| **DO REALIZACJI** | → staje się ✅ po zapisaniu w docelowym dokumencie | pasuje do Złotych Zasad, planujemy |
| **ODŁOŻONY** | ⏳ | dobry pomysł, świadomie nie teraz — zapisz do jakiej fazy |
| **ODRZUCONY** | brak — zostaje w rejestrze z uzasadnieniem, nie trafia do dokumentów merytorycznych | nie pasuje, z jawnym uzasadnieniem dlaczego |
| **PRZESTARZAŁY** | ⚠️ NIEAKTUALNE | zastąpiony lepszym rozwiązaniem — adnotacja wg C.4 |

Sprawdź przy tym, czy pomysł nie koliduje z czymś, co już ustalono (Część I.1), zanim nadasz status.

### F.4 Integracja
Po decyzji: przenieś pomysł z Poczekalni do docelowego miejsca (Filar A/B/C, odpowiedni rozdział), zgodnie z Częścią C i D. Zwięźle opisz, co zdecydowano i dlaczego.

Przy pisaniu jawnie rozdziel otwarte pytania na dwie kategorie — to mówi czytającemu, czy ma usiąść i pomyśleć, czy usiąść i poszukać:
- **"Wymaga decyzji"** (architektura, priorytety — Twój wybór, nikt inny nie rozstrzygnie)
- **"Wymaga danych zewnętrznych"** (normy, ceny, katalogi, badania — istnieje obiektywnie poprawna odpowiedź)

### F.5 Odwracalność decyzji — unieważnianie wpisów w rejestrze

Rejestr decyzji (D1, D2, D3…, Krok 4) rośnie, ale czasem decyzja okazuje się błędna. Nie kasuj wpisu — dopisz nowy, który go jawnie unieważnia:
```
D14 (DD.MM.RRRR) — UNIEWAŻNIA D3, powód: [co się zmieniło / co się okazało]
```
Oryginalny wpis D3 zostaje widoczny, oznaczony ⚠️ NIEAKTUALNE z odnośnikiem do D14 (format C.4). Dzięki temu rejestr decyzji jest tak samo audytowalny jak reszta Biblii — widać nie tylko co zdecydowano, ale i co się zmieniło, i dlaczego.

### F.6 Koszt zmiany — metryka przy decyzjach fundamentalnych

Przy każdej decyzji w rejestrze, która blokuje wiele innych rzeczy naraz (Krok 4), dopisz obok treści decyzji jedno dodatkowe pole: **jak drogo będzie ją cofnąć później**, orientacyjnie: *tanio* (parametr, łatwo zmienić), *średnio* (wpływa na kilka modułów), *drogo* (wpływa na model danych/architekturę, zmiana wymaga przepisania wielu modułów). To nie jest ocena, czy decyzja jest dobra — to informacja, ile namysłu ona zasługuje PRZED zatwierdzeniem. Decyzje "drogie" w razie zmiany zasługują na dodatkowe sprawdzenie (np. konsultację z ekspertyzą domenową, 0.2) przed wpisaniem jako ✅.

### F.7 Rejestr założeń — osobna kategoria od 🔎 i decyzji

Trzecia kategoria, obok 🔎 (fakt do sprawdzenia) i D# (świadomy wybór): **założenie robocze** — coś przyjętego bez pełnej weryfikacji, bo brak czasu/danych, na czym mimo to buduje się dalszą pracę. To nie to samo, co 🔎 (tam wiadomo, że czegoś nie sprawdzono, ale nic na tym jeszcze nie stoi) ani D# (tam decyzja jest świadomym wyborem, nie tymczasowym zgadywaniem).

Prowadź sekcję "Założenia robocze" w `rejestr-decyzji.md` (Filar C), ponumerowaną Z1, Z2, Z3…, w formacie:
```
Z4 (DD.MM.RRRR) — przyjęto: [treść założenia], powód: [brak czasu/danych], na czym się opiera: [moduły/decyzje, najlepiej wg ID M#/D#]
```
Jeśli założenie okaże się błędne — oznacz je ⚠️ NIEAKTUALNE (C.4) i **jawnie sprawdź** wszystko, co w polu "na czym się opiera" — to lista, którą trzeba zrewidować, nie tylko sam wpis Z#.

[05.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro, przyniesione przez właściciela projektu. **Kotwiczenie pola "na czym się opiera" w kodzie, gdy to możliwe** — ta sama logika anty-dryfu, którą X.4 stosuje do rejestru długu technicznego. Ręcznie pisana lista modułów/decyzji może się zdezaktualizować po cichu, dokładnie jak rejestr TD# bez markera w kodzie. Gdy projekt prowadzi formalny, wymuszany przez typy graf zależności modułów (np. rejestr modułów z jawnym polem zależności) — pole "na czym się opiera" odsyła do niego zamiast być osobną, ręcznie utrzymywaną listą. Nie zastępuje to zapisu Z# (data, powód, treść założenia zostają opisowe) — zastępuje tylko tę jedną, najbardziej podatną na rozjazd część wpisu.

### F.8 Symulacja "co jeśli" przed zatwierdzeniem drogiej decyzji

F.6 ocenia koszt cofnięcia decyzji *po fakcie*. Dla decyzji ocenionej jako "drogo" (F.6), zanim trafi do rejestru jako ✅, przeprowadź krótki pre-mortem: "jeśli wybierzemy X, moduły Y i Z (przez pole Zależności, H.1) będą musiały się dostosować, ponieważ…". To nie jest formalność — to świadome sprawdzenie konsekwencji, zanim staną się faktem, nie dopiero gdy ktoś je odkryje przy wdrożeniu (T.4).

---

## CZĘŚĆ G — Model danych domeny i kontrakty rdzenia (przed pierwszym modułem)

### G.1 Model danych całej domeny
Zanim zaczniesz szczegółowe moduły, naszkicuj (choćby na kartce) pełny model encji domeny — co najmniej listę "rzeczowników", którymi projekt będzie operować. Łatwiej dodać pole do istniejącej encji, niż dopisać całą nową encję, gdy kilkanaście modułów już zakłada jej brak.

### G.2 Wspólne struktury danych
Kiedy widzisz, że drugi moduł potrzebuje podobnych danych co pierwszy — **zatrzymaj się natychmiast** i zaprojektuj wspólną strukturę (suma pól obu), zanim napiszesz opis trzeciego. Ostrzeżenie z doświadczenia: cztery moduły niezależnie wymyśliły swoją wersję tej samej struktury, każdy z innym podzbiorem pól — wykryto to dopiero po napisaniu wszystkich czterech, co zamieniło się w osobne zadanie integracyjne.

### G.3 Trzy kontrakty poprzeczne
Zaprojektuj te trzy rzeczy w pierwszym tygodniu prac nad architekturą, przed pierwszym modułem obliczeniowym/funkcjonalnym — retrofit po napisaniu kilkunastu modułów jest wielokrotnie droższy:
- **Kontrakt wyniku/widżetu** — każdy moduł zwraca wynik + status (OK / NIEKOMPLETNE / BŁĄD), żeby całość dała się uruchomić, zanim wszystkie moduły są gotowe.
- **Kontrakt zapisu** — każdy moduł oddaje swoje **dane wejściowe** do serializacji (zasada: "zapisuj wejście, nigdy wynik"), żeby stare zapisane stany korzystały automatycznie z poprawionych wzorów/logiki.
- **Kontrakt elementu wspólnego** (np. formatu do wizualizacji/eksportu/UI) — jednolity format, żeby nie pisać adaptera osobno dla każdego modułu.

### G.4 Jedna zasada rozstrzygająca dla powtarzalnych klasyfikacji
Sformułuj RAZ, jako ogólną regułę (np. "co jest błędem blokującym, a co ostrzeżeniem") — nie oceniaj osobno przy każdym przypadku.

---

## CZĘŚĆ H — Szablon modułu / funkcji referencyjnej

### H.1 Szablon modułu

Każdy moduł, niezależnie od tematu, opisuj tym samym szkieletem, bez wyjątków:

- **Cel** — jedno zdanie, po co ten moduł istnieje
- **Kluczowe zasady/wzory** — z konkretnymi liczbami, nie ogólnikami
- **Wejście** — dane wchodzące, nawet jeśli nieprecyzyjne na starcie, zawsze obecne
- **Walidacja** — co sprawdzamy, zanim policzymy/wykonamy
- **Logika / obliczenie / działanie** — sedno modułu
- **Wynik** — co moduł zwraca
- **Obsługa błędów** — co się dzieje, gdy coś pójdzie nie tak
- **Przykład** — konkretny, przeliczony/przetestowany, z podstawionymi wartościami
- **Zależności** — od jakich innych modułów (M#, Część H.2) ten zależy, jakie moduły blokuje swoją niegotowością
- **Wpływ na MVP** — czy moduł jest potrzebny do pierwszej działającej wersji, czy bezpiecznie odłożyć (oś osobna od gotowości T.1 i kosztu zmiany F.6)

*Moduł bez "Wejście/Wyjście" to prawie zawsze sygnał, że nie został przemyślany do końca, nawet jeśli reszta brzmi konkretnie.*

Pole Zależności zasila kolejność pracy z Kroku 7 (Część E) — zamiast szacować, co jest potrzebne najpierw, z pamięci, czytaj to wprost z pól modułów.

**Odnoszenie się modułów do siebie wprost w tekście** — jeden z najcenniejszych nawyków: pisząc nowy moduł, zawsze zadaj pytanie "z czym to się styka?" i zapisz odpowiedź w tekście modułu, choćby jednym zdaniem ("to jest rozszerzenie modułu X", "to potwierdza i rozszerza moduł Y"). Kosztuje sekundy przy pisaniu, oszczędza godziny przy integracji.

### H.2 ID modułu — stabilny identyfikator

Tak jak decyzje dostają D1, D2, D3… (Krok 4), każdy moduł przy powstaniu dostaje własny, stabilny identyfikator: **M1, M2, M3…**, niezależny od numeru dokumentu/rozdziału, w którym akurat mieszka. ID nadaje się raz i nigdy się nie zmienia, nawet jeśli moduł zostanie przeniesiony do innego rozdziału albo dokument zmieni numer/nazwę — dzięki temu odsyłacz do modułu (I.3) przeżywa reorganizację struktury, której odsyłacz oparty tylko na numerze dokumentu by nie przeżył.

---

## CZĘŚĆ I — Konflikty, spójność, duplikaty, odsyłacze

### I.1 Wykrywanie konfliktów — aktywnie, nie przy okazji
Zanim cokolwiek dodasz, **aktywnie sprawdź**, czy nowa informacja nie jest sprzeczna z wcześniejszymi ustaleniami — nie zakładaj zgodności. Jeśli wykryjesz konflikt, natychmiast zgłoś i poproś o decyzję, zanim cokolwiek zapiszesz. Po każdym nowym dokumencie/module zadaj pytanie "czy to zgodne z tym, co już ustalono gdzie indziej" i zanotuj wynik — nawet "zgodne, sprawdzone".

**Konflikt starego z nowym źródłem — rozstrzygaj indywidualnie**, nie regułą "nowsze zawsze wygrywa". Czasem starszy dokument miał rację merytorycznie. Każdy konflikt zasługuje na osobną ocenę.

### I.2 Duplikaty
Gdy ten sam pomysł pojawia się ponownie: **nie kopiuj treści drugi raz.** Dopisz do istniejącej sekcji notatkę: *"Ten sam pomysł opisany również w źródle X — bez nowej treści ponad to, co już tu jest"*, albo, jeśli źródło wnosi nowy detal, dopisz tylko ten detal z odnośnikiem.

Jeśli dwa źródła opisują tę samą funkcję pod **różnymi nazwami** — zapisz to wprost jako punkt do decyzji ("X i Y to ta sama funkcja pod dwiema nazwami roboczymi — do ujednolicenia"). **Nie wybieraj nazwy samodzielnie.**

### I.3 Odsyłacze między dokumentami
Standard: *"→ dokument NR, sekcja NR"* dla ogólnych odniesień do sekcji dokumentu. Gdy odsyłacz dotyczy konkretnego modułu — używaj zamiast tego jego stabilnego ID (H.2): *"→ moduł M[X]"*. Ten drugi zapis przeżywa zmianę numeru dokumentu czy przeniesienie modułu do innego rozdziału, pierwszy nie. Używaj odsyłaczy zawsze, gdy jedna funkcja/decyzja dotyka więcej niż jednego rozdziału. Żaden dokument nie duplikuje cudzej treści — tylko wskazuje, gdzie jej szukać.

**Nigdy nie zostawiaj dwóch niezależnych, pełnych opracowań tego samego tematu bez wzajemnego odesłania.** Ostrzeżenie z doświadczenia: ten sam temat rozwinięty niezależnie w kilku dokumentach, bez wiedzy o sobie nawzajem, oznaczał godziny "archeologii" (ręczne porównywanie zdanie po zdaniu), zamiast pisania.

### I.4 Uzupełnianie luk
Jeśli w rozmowie pojawia się coś kluczowego dla projektu, czego jeszcze nie ma w Biblii — sam zaproponuj uzupełnienie odpowiedniej sekcji, nie czekaj na polecenie.

### I.5 Integralność odsyłaczy przy redakcji strukturalnej

Odsyłacz (I.3) jest tak dobry, jak jego cel — jeśli moduł M5 zostanie usunięty, scalony albo znacząco przeniesiony, każdy istniejący odsyłacz do niego staje się martwy, i nic tego automatycznie nie wykrywa. Przy każdej redakcji strukturalnej (nie tylko przy dopisywaniu treści) sprawdź, czy coś innego odsyła do zmienianego elementu, i zaktualizuj albo jawnie oznacz te odsyłacze — dokładnie tym samym trybem co log zmian (C.6): to redakcja strukturalna, więc musi zostawić wpis.

---

## CZĘŚĆ J — Liczby, dane, jednostki, normy

Przy **każdej** liczbie w Biblii zaznacz od razu:
- czy to **stawka/wartość jednostkowa** (przenosi się na dowolny przypadek) czy **przykład jednorazowy** (konkretny przypadek, wymaga przeliczenia przed użyciem gdzie indziej) — np. cena za jednostkę vs. całkowity koszt jednego konkretnego zamówienia z konkretnej daty
- czy źródło jest **zweryfikowane** (z konkretnym odnośnikiem: paragraf normy, numer badania, link) czy **orientacyjne 🔎** (do potwierdzenia)

Ostrzeżenie z doświadczenia: dane kosztowe podane jako twarde kwoty dla jednego konkretnego przypadku (zamiast stawek jednostkowych) nie nadają się do użycia w działającym kalkulatorze bez przeliczenia na wzory skalowalne — a to się odkrywa dopiero przy pisaniu kodu, kosztem przeróbki.

---

## CZĘŚĆ K — Uwagi specjalne przy zapisywaniu pomysłów wrażliwych

Niektóre kategorie pomysłów wymagają dodatkowej adnotacji "Uwaga projektowa" obok standardowego opisu:
- **Tematy wrażliwe** (zdrowie psychiczne, żałoba, dane wrażliwych grup) — zaznacz udział specjalisty przy projektowaniu treści/moderacji, nie tylko wdrożenia jako "zwykła funkcja"
- **Treści prawne/podatkowe generowane automatycznie** — zaznacz, że to informacja, nie porada profesjonalna, wymagająca okresowej weryfikacji przez specjalistę
- **Dane biometryczne / rozpoznawanie tożsamości** — zaznacz wprost ryzyko prawne (ochrona danych osobowych), odrębna podstawa prawna przed wdrożeniem
- **Funkcje społecznościowe z ryzykiem nadużyć** — zaznacz potrzebę zaprojektowania moderacji przed wejściem do zakresu

Zasada ogólna: gdy pomysł niesie ryzyko (prawne, etyczne, dla użytkownika) — nie pomijaj go, ale też nie milcz o ryzyku. Zapisz pomysł **i** zastrzeżenie razem.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`, rozdz. 09 — **AI jako funkcja samego produktu** (nie mylić z AI piszącym tę Biblię — to inny byt, patrz nagłówek rozdz. 09 tamtego dokumentu). Gdy moduł Biblii opisuje funkcję, w której AI jest częścią działania aplikacji (asystent, rozpoznawanie zdjęć, generowanie treści) — dodaj Uwagę projektową analogiczną do powyższych, z dwóch dodatkowych kategorii:
- **AI nie zastępuje logiki domenowej** — jeśli funkcja daje wynik liczbowy/decyzyjny, wynik musi pochodzić z modułu deterministycznego (Część G.3 tej Instrukcji), AI go tylko interpretuje i tłumaczy „po ludzku”, nigdy nie szacuje go sama.
- **Obrona przed wstrzyknięciem poleceń z treści zewnętrznych** — treść pochodząca ze zdjęć, OCR, importowanych plików czy odpowiedzi zewnętrznego API jest zawsze traktowana jako dane do analizy, nigdy jako polecenie zmieniające zachowanie asystenta. Pełna specyfikacja: `new-app-standards` rozdz. 09.4.

---

## CZĘŚĆ L — Proces: moduł Biblii → dokument gotowy do implementacji

Stosuj identycznie przy każdym module, w tej kolejności:

1. **Czytaj moduł w całości** — nie streszczenie, nie sama pamięć z wcześniejszego skanowania.
2. **Sprawdź, czy temat już częściowo istnieje** gdzieś indziej (inny dokument, inny moduł, kod) — patrz zasady o duplikatach (I.2). Chwila czasu, oszczędza godziny (I.3).
3. **Aktywnie szukaj konfliktów** z ustalonymi zasadami (I.1).
4. **Zdecyduj o umiejscowieniu** — nowy plik czy dopisanie do istniejącego. Kryterium: czy funkcja jest **nierozdzielna** od czegoś istniejącego (dzieli silnik/logikę/stan) → razem; czy tylko **tematycznie pokrewna** → zawsze osobny plik.
5. **Pisz pełną treść**, z jawnie rozdzielonymi otwartymi pytaniami: "wymaga decyzji" vs "wymaga danych zewnętrznych" (F.4).
6. **Nigdy nie usuwaj starego pliku** bez dopisania w nowym, dokąd poszła każda część jego treści.

---

## CZĘŚĆ M — Testy i przykłady kontrolne

- **Każdy wzór/reguła dostaje przykład liczbowy/konkretny w momencie pisania, nie później.** Obok wzoru natychmiast dopisz jeden przykład z podstawionymi wartościami i wyliczonym wynikiem — to jednocześnie specyfikacja i gotowy przypadek testowy.
- **Wykorzystuj dane przykładowe z samej Biblii jako gotowe przypadki testowe** — jeśli moduł ma w Biblii kompletny przykład z wyliczonym wynikiem, oznacz go jako test regresyjny od razu, zamiast zostawiać "na kiedyś".
- **Po każdej większej edycji dokumentu źródłowego** (scalanie, wydzielanie sekcji) zweryfikuj, że nic nie zniknęło — sprawdź strukturę nagłówków i liczbę linii przed/po. Tania, szybka kontrola, robiona z automatu, nie tylko "gdy coś wygląda podejrzanie".

---

## CZĘŚĆ N — Audyt kompletności

### N.1 Wykonanie audytu

Na żądanie albo cyklicznie (po dużych partiach integracji, obowiązkowo przed uznaniem Biblii za "gotową do pracy zespołu"):

1. Przejdź **każdy** materiał źródłowy punkt po punkcie, sprawdzając źródła **bezpośrednio**, nie z pamięci wcześniejszych ustaleń — sprawdź, czy odpowiednik faktycznie istnieje w zintegrowanej strukturze. Nie ograniczaj się do "na oko wygląda dobrze".
2. Zbierz wszystkie rozproszone "⏳ na później" w jeden zbiorczy dokument (`backlog-poza-v1.md`, Filar C) — łatwiej planować kolejne fazy.
3. Sprawdź nazewnictwo/branding/wygląd na tyle, by nie blokowały końcówki.
4. Usuń nieaktualne wersje plików z folderu (nie z historii — C.5: nowa wersja natychmiast zastępuje starą).
5. Jeśli audyt znajdzie braki: zgłoś wprost (co brakuje, z jakiego źródła), napraw od razu tym samym trybem co zwykłe dopiski, i zaktualizuj log zmian z jasną notatką, że to wynik audytu, nie zwykłej integracji — buduje to zaufanie do procesu.

Duże integracje (wiele dokumentów naraz) są najbardziej podatne na przeoczenia — audytuj właśnie po nich, nie tylko na końcu.

### N.2 Audyt dwuwarstwowy — przyrostowy jako wczesny system ostrzegania, końcowy jako pełna, bezwyjątkowa redundancja

[04.09.2026] ✅ DODANO — źródło: projekt farmer360.io, zebrane przez GOD BOOK U.4, promowane po decyzji właściciela projektu (obowiązuje dla wszystkich projektów, bez czekania na powtórzenie w drugim — uznane za wyraźnie uniwersalne, U.3).

**Reguła.** Dla Biblii wielorozdziałowej (struktura dwupoziomowa, Część B.3) audyt N.1 wykonuj **dwuwarstwowo**, nie jednorazowo na końcu:

1. **Przyrostowo** — po każdym rozdziale/Fazie modułów, w momencie osiągnięcia checkpointu tej partii: audyt N.1 ograniczony do niej (plus relacje z modułami już istniejącymi), jako wczesny system ostrzegania — rośnie w zakresie razem z projektem, nie czeka do końca.
2. **W pełni, na końcu** — dosłownie wszystko, tak jak dotąd nakazuje N.1, **bez wyjątku i bez pomijania tego, co audyty przyrostowe już złapały**. Poleganie na "to już sprawdzone wcześniej" jest dokładnie tym ryzykiem, przed którym ten audyt ma chronić — audyt przyrostowy sam może coś przeoczyć, albo coś mogło się zepsuć między jednym audytem a drugim.

Te dwie warstwy nigdy nie dzielą między sobą pracy (żadne "to już sprawdzone przyrostowo, więc pomiń na końcu") — druga jest celową redundancją pierwszej, nie jej kontynuacją.

### N.3 Bramka przed Krokiem 9 — implementacja nie zaczyna się, dopóki cała Biblia nie jest gotowa

[06.09.2026] ✅ DODANO — źródło: projekt farmer360.io, zebrane przez GOD BOOK U.4, promowane po decyzji właściciela projektu.

**Reguła.** Krok 9 (Część L — przejście do implementacji) nie zaczyna się dla **żadnego** modułu, dopóki:
1. wszystkie rozdziały Biblii — również te świadomie odłożone poza pierwszą falę/MVP (Część F.3, status ODŁOŻONY) — nie są w pełni opracowane, i
2. pełny, bezwyjątkowy audyt końcowy (warstwa "w pełni na końcu" z N.2) nie jest wykonany i zamknięty.

Żaden moduł nie zaczyna być kodowany osobno wcześniej, niezależnie jak dokładnie sprawdzony/gotowy wygląda sam w sobie — rozdziały opisane później (np. pełna architektura uprawnień) mogą ujawnić sprzeczność z modułem napisanym wcześniej, czyniąc wczesny kod marnotrawstwem, nie oszczędnością czasu.

**Przykład, który uzasadnił regułę.** Przegląd kompletności M1–M17 w Farmer360 znalazł, że moduł M14 ("Giełda") miał schemat encji `Advert` niedopasowany do kategorii ogłoszeń opisanych w tej samej sekcji źródła — złapane właśnie dlatego, że nikt nie zaczął go kodować osobno, zanim reszta Biblii i pełny audyt nie były zamknięte. Zapisane jako D10 w `rejestr-decyzji.md` tamtego projektu.

**Relacja z N.2.** Ta sama kategoria pokusy co N.2 — "pomiń już-sprawdzone" — tylko krok dalej w procesie: N.2 chroni przed pomijaniem audytu, N.3 chroni przed pomijaniem oczekiwania na resztę Biblii przed startem kodu.

**Uzasadnienie.** Krok 8 (Część E) tradycyjnie rezerwuje audyt na jeden, końcowy moment — dla projektu wielorozdziałowego to jednorazowy audyt o rosnącej skali, z tą samą pokusą co przy każdym dużym, jednorazowym zadaniu: "zoptymalizować" je pomijaniem tego, co wygląda na już zweryfikowane. Empirycznie (farmer360.io): audyt przyrostowy ograniczony do jednego rozdziału (9 modułów) znalazł 4 realne problemy (przeterminowana decyzja w rejestrze, brakujące założenie robocze, niespójność nazewnictwa zdarzeń, brak zbiorczego rejestru) — złapane wcześnie, małym kosztem, zanim urosły w koszcie naprawy.

---

## CZĘŚĆ O — Zachowanie AI podczas sesji roboczej

- **Pytaj o kontekst, zanim zapiszesz na stałe.** Jeśli padnie hasło bez kontekstu, nie zapisuj go bezmyślnie — dopytaj o szczegóły.
- **Bądź recenzentem, nie tylko wykonawcą.** Wyłapuj błędy logiczne i niespójności wprost: "To koliduje z zasadą X ustaloną wcześniej. Jak chcesz to rozwiązać?"
- **Kończ większe sesje krótkim Checkpointem:**
  - Co dodano do Biblii?
  - Jaki jest status nowych pomysłów?
  - Co zostaje do zrobienia?
  - Czy są pytania otwarte?
- **Tryb pracy z materiałem źródłowym:**
  - Jeśli dostajesz treść Biblii/dokumentu — traktuj jako stan faktyczny, pracuj na jej podstawie.
  - Jeśli nie dostajesz treści, a jest potrzebna — poproś o nią, zanim cokolwiek zmienisz.
  - Jeśli projekt startuje od zera — zaproponuj inicjalizację: zadaj serię pytań (Część E, Krok 0-1), żeby zbudować pierwszą wersję.
- **Nigdy nie zgaduj z pamięci, gdy możesz sprawdzić źródło.** Jeśli istnieje materiał referencyjny (obraz, plik, wcześniejszy dokument), odwołaj się do niego bezpośrednio przy każdym istotnym pytaniu — nie polegaj na "przecież już to ustaliliśmy".
- **Przy pracy nad wspólnym, rosnącym kodem:** zawsze mów wprost, co ma zostać nietknięte. Przy każdej instrukcji dodania czegoś nowego do istniejącego kodu, dopisz explicite "nie zmieniaj/nie usuwaj istniejącego X".
- **Testuj/buduj małymi krokami**, nie dużymi partiami naraz — jedna rzecz, sprawdzona, zanim przejdziesz do następnej.

---

## CZĘŚĆ P — Przenoszenie zasad tej instrukcji DO Biblii projektu

To krok, który sprawia, że konkretna Biblia jest samowystarczalna — ktoś (człowiek albo kolejna sesja AI), kto dostanie do ręki samą Biblię, bez tej instrukcji, musi mieć wszystko, czego potrzebuje do dalszej pracy zgodnej z tymi zasadami.

### P.1 Dokument konwencji — `01_Zasady_Pracy_i_Konwencje.md`

**Przy inicjalizacji KAŻDEJ nowej Biblii, w ramach Kroku 2 (Część E), utwórz dokument `01_Zasady_Pracy_i_Konwencje.md` (Filar C) zawierający wyciąg operacyjny z tej instrukcji, dopasowany do konkretnego projektu:**

- Ekspertyza domenowa AI ustalona dla TEGO projektu (0.2) i tryby sesji (0.3) — pierwsze specyficzne dla projektu, drugie uniwersalne
- Hierarchia pierwszeństwa zasad (0.4), procedura pivotu domeny (0.5) i adwokat diabła w trybie Audyt (0.6) — bez zmian, uniwersalne
- Cztery znaczniki treści (C.1) i status dokumentu (C.2) — bez zmian, uniwersalne
- Szablon nagłówka dokumentu i format dopisywania treści (C.3, C.4) — bez zmian
- Konwencja nazw plików i wersjonowania (C.5) — bez zmian
- Zasada słownika pojęć (C.9) i termin ważności dla 🔎 (C.10) — bez zmian, uniwersalne
- **Jednostka bazowa / konwencja danych** ustalona dla TEGO projektu (Krok 2, Część E) — specyficzne dla projektu
- Trzy filary i lista rozdziałów tego konkretnego projektu z przypisaniem do filarów (B.1, B.2) — specyficzne dla projektu
- Szablon modułu z polami Zależności i Wpływ na MVP (Część H.1) — bez zmian, chyba że projekt wymaga modyfikacji (wtedy zapisz różnicę i uzasadnienie)
- Trzy kontrakty poprzeczne tego projektu, gdy już ustalone (G.3) — specyficzne dla projektu
- Tabela statusów pomysłu (F.3) — bez zmian
- Znacznik pochodzenia ✅🤖 (C.7) i zasada TL;DR/głębokości czytania (C.8) — bez zmian, uniwersalne
- Format unieważniania decyzji (F.5), metryka kosztu zmiany (F.6), rejestr założeń Z# (F.7), symulacja "co jeśli" przy drogich decyzjach (F.8) i stabilne ID modułów M1, M2… (H.2) — bez zmian, uniwersalne
- Zasada integralności odsyłaczy przy redakcji strukturalnej (I.5) — bez zmian, uniwersalna
- Standardy inżynierskie dla kodu — testy, code review, definicja gotowego, dług techniczny, konwencja commitów (Część X) — stosuj w całości, jeśli projekt obejmuje pisanie kodu; szczegóły (np. próg pokrycia testami) specyficzne dla projektu
  - [03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. Dla projektów naszej rodziny aplikacji ta sekcja **nie jest pisana od zera** — jej treść to rozdz. 10 (testy), 11 (CI/deployment) i 16 (standard kodowania) tego Standardu, kopiowane w całości. Lokalny próg (np. pokrycia testami) może iść dalej niż Standard, nigdy go nie obniżać po cichu — patrz rozdz. 16, akapit wstępny ("to jest podłoga, nie sufit").
- Skrócona lista "częstych pułapek" (Część Q) — bez zmian, uniwersalna

**Dlaczego osobny dokument, nie sama ta instrukcja skopiowana w całości:** ta instrukcja opisuje *proces tworzenia* (kroki, life hacki, uzasadnienia z doświadczenia) — Biblia potrzebuje tylko *wyciągu operacyjnego*, gotowego do stosowania bez czytania uzasadnień za każdym razem. Reguły "co robić" idą do Biblii; "dlaczego tak robimy" zostaje w tej instrukcji.

Ten dokument aktualizuje się jak każdy inny (C.4/D) — jeśli w trakcie projektu pojawi się nowa, warta zachowania konwencja specyficzna dla tego projektu, dopisz ją tutaj, nie tylko w pamięci sesji.

### P.2 Protokół startu sesji — sekcja w `00_Biblia.md`

Konwencje (P.1) mówią AI *jak formatować*. Osobny problem to *od czego zacząć każdą nową sesję pracy*, żeby nie trzeba było tego za każdym razem odkrywać na nowo (w jednym z projektów źródłowych plik z kolejnością czytania dokumentów istniał od dawna, ale został znaleziony i zastosowany dopiero po wielu sesjach pracy).

W `00_Biblia.md`, jako jedna z pierwszych sekcji indeksu, umieść **"Jak zacząć pracę"** — sztywną, krótką kolejność:
1. Przeczytaj `00_Biblia.md` w całości (streszczenie + tabela dokumentów + status).
2. Przeczytaj `01_Zasady_Pracy_i_Konwencje.md` i `02_Dyrektywy_AI_Projektu.md` (P.3).
3. Przeczytaj `rejestr-decyzji.md` — nie zakładaj, sprawdź, co już zdecydowano.
4. Dopiero potem przejdź do konkretnego modułu/dokumentu, nad którym pracujesz w tej sesji.

Ta sekcja jest tworzona **od razu przy Kroku 2** (Część E), nie odkrywana przypadkiem w połowie projektu.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`. Dla projektów naszej rodziny aplikacji powyższa lista ma **Krok 0, poprzedzający punkt 1**: `docs/standards/00-INDEKS.md` + `CLAUDE.md` (Standard Architektoniczny wspólny, Część Y tej Instrukcji). To fundament niezależny od tej konkretnej Biblii, czytany zawsze, przed nią — patrz Część Y.4.

[03.09.2026] ✅ DODANO — źródło: Część B.6. Powyższa lista ma dodatkowo **punkt 1.5, zaraz po punkcie 1**: `docs/lista-do-zrobienia.md`, jeśli istnieje. Czytany przed `01_Zasady_Pracy_i_Konwencje.md` i przed rejestrem decyzji — to najszybszy sposób ustalenia, od czego zacząć, zanim zajmie się głębszym czytaniem reszty.

### P.3 Dyrektywy AI projektu — osobno od konwencji formatu

`01_Zasady_Pracy_i_Konwencje.md` (P.1) opisuje **format** (jak wygląda dokument, znacznik, wersja). Osobna kategoria to **zachowanie AI specyficzne dla tego konkretnego projektu** — twarde reguły wynikające z natury domeny, nie z formatowania (np. "nigdy nie sugeruj dawki/kosztu bez jawnego oznaczenia 🔎", "zawsze przelicz wynik na jednostkę bazową projektu przed pokazaniem go", "nie modyfikuj Złotych Zasad bez wyraźnej, jednoznacznej zgody właściciela projektu", "przy tematach z Części K zawsze dodaj Uwagę projektową, nawet jeśli nikt nie pyta").

Trzymaj to w osobnym dokumencie `02_Dyrektywy_AI_Projektu.md` (Filar C), nie w `01_Zasady_Pracy_i_Konwencje.md` — bo te dwa dokumenty zmieniają się z różną częstotliwością i wagą: konwencje formatu ustala się raz i prawie się nie zmieniają, dyrektywy zachowania rosną w miarę jak projekt odkrywa nowe sytuacje ryzykowne czy powtarzalne błędy AI ("AI trzy razy pomyliło X — dopisz to jako dyrektywę, żeby czwarty raz się nie zdarzył").

---

## CZĘŚĆ Q — Częste pułapki (antywzorce)

| Antywzorzec | Skutek w praktyce |
|---|---|
| Pisanie szczegółowej treści przed ustaleniem architektury technicznej | Przepisywanie po zmianie stosu |
| Zakładanie, że mechanizm działa "jak powinien" bez sprawdzenia w dokumentacji narzędzia | Założenia nie potwierdzają się w praktyce |
| Description drift — opisywanie materiału referencyjnego z pamięci zamiast ponownego sprawdzenia | Drobne, kumulujące się nieścisłości |
| Milczące zmiany zasad — bez jawnego zaznaczenia, że to zmiana i dlaczego | Niespójność między dokumentami sprzed i po zmianie |
| Utrata rozróżnienia błąd/ostrzeżenie/informacja przy kopiowaniu wzorców | Przypadkowo skopiowana niepoprawna klasyfikacja |
| Skracanie treści "dla zwięzłości" | Bezpowrotna utrata szczegółów (np. kodu przykładowego) |
| Redakcja bez wpisu w logu zmian | Nierozwiązywalna zagadka luk w numeracji |
| Ten sam temat w wielu plikach bez odnośników | Godziny pracy porównawczej, wersje się rozjeżdżają |
| Twarde liczby zamiast stawek jednostkowych | Kalkulator/system, który zawsze zwraca to samo |
| Brak ustalenia jednostek/konwencji danych na starcie | Mieszanie formatów przez cały projekt |
| Analiza architektury bez sprawdzenia materiałów wizualnych | Część ustaleń trzeba robić drugi raz |
| Czytanie standardu projektu "przy okazji", nie na starcie | Zero zgodności z ustalonym już standardem |
| Wspólne struktury danych wymyślane osobno w każdym module | Niezgodne wersje tej samej koncepcji, osobne zadanie integracyjne |
| Budowa wielu modułów przed jednym w pełni ukończonym wzorcem | Brak szablonu, do którego kolejne mogłyby się dopasować od razu |

---

## CZĘŚĆ R — Skrócona checklista pierwszego dnia nowego projektu

- [ ] Przejrzano KAŻDY istniejący plik projektu — teksty, obrazy, makiety, kod (Krok 0)
- [ ] Znaleziono i przeczytano dokument standardów, jeśli istnieje (Krok 0)
- [ ] Spisano Złote Zasady, 8–12 zdań (Krok 1)
- [ ] Ustalono i zapisano w `00_Biblia.md` ekspertyzę domenową AI dla tego projektu (Część 0.2)
- [ ] Ustalono konwencje techniczne: znaczniki, nazwy plików, wersjonowanie (Krok 2 / Część C)
- [ ] Ustalono jednostkę bazową / konwencję danych, jednym zdaniem (Krok 2)
- [ ] Naszkicowano wstępny podział na rozdziały tematyczne + przypisanie do 3 filarów (Krok 2)
- [ ] Zebrano surową wiedzę bez filtrowania (Krok 3)
- [ ] Przeprowadzono sesję decyzji strategicznych, rejestr D1, D2… (Krok 4)
- [ ] Naszkicowano model danych całej domeny (Część G.1)
- [ ] Zaprojektowano trzy kontrakty poprzeczne — albo świadomie odłożono z zapisaną datą powrotu (Część G.3)
- [ ] Wybrano moduł referencyjny do przeprowadzenia w pełnym cyklu jako pierwszy (Krok 6)
- [ ] Utworzono `01_Zasady_Pracy_i_Konwencje.md` i `02_Dyrektywy_AI_Projektu.md` w Biblii projektu (Część P)
- [ ] Napisano sekcję "Jak zacząć pracę" w `00_Biblia.md` (Część P.2)
- [ ] Ustalono rubrykę gotowości modułu (kryteria × wagi), zanim napisano pierwszy moduł (Część T.1)
- [ ] Ustalono zasadę: każdy wzór/reguła dostaje przykład od razu, nie później (Część M)

---

## CZĘŚĆ S — Minimalny szkielet dokumentów na start

1. **`00_Biblia.md`** — indeks: streszczenie, tabela dokumentów, kluczowe wyróżniki, sekcja "Jak zacząć pracę" (P.2), dziennik zmian (Część B.2)
2. **`01_Zasady_Pracy_i_Konwencje.md`** — wyciąg operacyjny z tej instrukcji (Część P.1)
3. **`02_Dyrektywy_AI_Projektu.md`** — reguły zachowania AI specyficzne dla projektu (Część P.3)
4. **`zlote-zasady.md`** (Filar C) — z Kroku 1
5. **`rejestr-decyzji.md`** (Filar C) — rosnący D1, D2, D3… z Kroku 4, zawiera sekcje "Odchylenia w trakcie wdrożenia" (T.3) i "Założenia robocze" Z1, Z2… (F.7)
6. **`slownik-pojec.md`** (Filar C) — rośnie od pierwszego użytego terminu specjalistycznego (Część C.9)
7. **`wiedza-surowa.md`** (Filar C, jedna lub więcej, jeśli dziedzina szeroka) — z Kroku 3
8. **`kontrakty-rdzenia.md`** (Filar A) — z Części G
9. Osobny plik per moduł/funkcja/rozdział, w miarę powstawania (Filar A lub B) — z Kroków 6-7
10. **`backlog-poza-v1.md`** (Filar C) — zbiorczy, rosnący z Części N
11. **`mapa-wdrozenia.md`** (Filar C) — status opisany/zaimplementowany/przetestowany, zakładany od pierwszej sesji implementacyjnej (Część T.2)
12. **`dlug-techniczny.md`** (Filar C) — jeśli projekt obejmuje kod: rejestr świadomych uproszczeń kodu względem specyfikacji modułu (Część X.4)
13. **`docs/zrodla/`** (Filar C) — [03.09.2026 ✅ DODANO, źródło: Część B.5] katalog, nie pojedynczy plik: oryginalne materiały źródłowe, nietknięte, tylko do odczytu — zakładany od pierwszego materiału dostarczonego do projektu, nie odkładany na później
14. **`docs/lista-do-zrobienia.md`** (Filar C) — [03.09.2026 ✅ DODANO, źródło: Część B.6] bieżąca lista zadań, czytana zaraz po `00_Biblia.md` (P.2) — nie mylić z `backlog-poza-v1.md` (pozycja 10) ani `mapa-wdrozenia.md` (pozycja 11), patrz rozróżnienie w B.6

To szkielet minimalny — konkretny projekt naturalnie doda więcej, ale te czternaście pozycji to fundament niezależny od tego, co się buduje.

---

## CZĘŚĆ T — Wdrożenie: od Biblii do działającego produktu, kontrolowanie postępu

Biblia opisuje *co ma powstać*. Ta część pilnuje, żeby faza wdrożenia nie rozjechała się z tym, co Biblia mówi — i żeby dało się w każdej chwili odpowiedzieć na pytanie "ile z Biblii faktycznie działa".

### T.1 Rubryka gotowości modułu — od pierwszego modułu, nie na końcu

Ustal na starcie (Krok 2, Część E) stałą listę kryteriów oceny modułu, np. 10 kryteriów × 10%: ma Cel? ma Wejście/Wyjście? ma walidację? ma przykład przeliczony? ma sprawdzone odsyłacze/konflikty (I.1)? ma jednoznaczny status (C.2)? itd. — dopasuj listę do natury projektu, ale ustal ją RAZ, na starcie.

Każdy moduł, w momencie napisania (Krok 6, Krok 7), dostaje od razu ocenę wg tej rubryki — nie wstecznie, po napisaniu wszystkich. Dzięki temu widać na bieżąco, które kryteria systematycznie kuleją (najczęściej: brak przykładu kontrolnego, brak walidacji) i można to poprawiać w locie, zamiast masowo pod koniec.

### T.2 Mapa wdrożenia — osobny, żywy dokument

Status dokumentu w Biblii (Stabilny / Propozycja, Część C.2) to **status opisu**, nie status kodu. To dwie różne osie i łatwo je pomylić. Prowadź osobny plik `mapa-wdrozenia.md` (Filar C) — tabela kluczowana stabilnym ID modułu (M#, Część H.2), nie numerem dokumentu, żeby wiersz przeżył reorganizację struktury:

| Moduł (ID) | Opisany w Biblii | Zaimplementowany | Przetestowany | Gotowość wg T.1 |
|---|---|---|---|---|
| M1 | ✅ | ⏳ | ⏳ | 70% |

Aktualizuj ją przy każdej sesji implementacyjnej, nie tylko przy audycie. To jedyne miejsce, gdzie widać naraz "co jest udokumentowane" vs "co faktycznie działa" — bez tego różnica ujawnia się dopiero, gdy ktoś zapyta wprost.

### T.3 Zamrażanie Biblii na czas dużej partii wdrożenia

Kiedy zaczynasz kodować dużą partię modułów naraz, zrób "snapshot" — zanotuj w `mapa-wdrozenia.md` wersję każdego dokumentu Biblii, na której kod się opiera (np. "moduł 04 wdrożony wg wersji 1.3"). Nowe decyzje, które pojawiają się W TRAKCIE tej partii, trafiają do osobnej sekcji **"Odchylenia w trakcie wdrożenia"** w `rejestr-decyzji.md`, a nie od razu rozmywają się w żywej Biblii — inaczej traci się odpowiedź na pytanie "kod jest zgodny z którą dokładnie wersją opisu". Po zakończeniu partii: zintegruj odchylenia do Biblii normalnym trybem (Część C.4) i zaktualizuj snapshot.

[05.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro, przyniesione przez właściciela projektu. **To zamrażanie jest fallbackiem, nie domyślną praktyką, przy pracy z AI.** Ryzyko, przed którym T.3 chroni (rozjazd kodu z Biblią w trakcie dużej partii), rośnie właśnie przy pracy z AI bardziej niż przy pracy zespołu ludzkiego w tym samym trybie — agent prowadzący dużą, wieloetapową partię może "zgubić" ustalenie zapadłe kilka kroków wcześniej dokładnie tam, gdzie człowiek by pamiętał albo zapytał. **Domyślna, preferowana praktyka:** synchronizacja per moduł/PR — każdy moduł kończony testami, code review i aktualizacją dokumentacji (Część X.3), zanim zacznie się kolejny; okno potencjalnego rozjazdu to wtedy jeden moduł, nie cała partia. Mechanizm zamrażania z T.3 (snapshot + "Odchylenia w trakcie wdrożenia") zostaje w pełni ważny jako opcja dla sytuacji, gdzie synchronizacja per-moduł faktycznie nie jest wykonalna (duża partia równoległa, wielu współpracowników naraz) — nie jako domyślny tryb pracy z AI.

### T.4 Pętla zwrotna kod → Biblia

Gdy błąd w Biblii wychodzi na jaw dopiero **przy implementacji** (nie przy przeglądzie/decyzji) — to inny sygnał jakości niż zwykła korekta: oznacza, że wzór/założenie było błędne merytorycznie, nie że zmieniono zdanie. Oznaczaj to osobnym wariantem adnotacji z Części C.4:

```
[DD.MM.RRRR] ⚠️ NIEAKTUALNE (zastąpione przez: X) — powód: błąd wykryty przy implementacji, źródło: [nazwa modułu/testu kodu]
```

Zbieraj takie przypadki — jeśli ten sam typ błędu (np. brakująca walidacja, zły wzór jednostek) powtarza się kilka razy, to sygnał do dopisania nowej dyrektywy AI (Część P.3), żeby nie powtarzał się piąty raz.

### T.5 Diff między snapshotami Biblii

T.3 ustala snapshot wersji przy zamrażaniu na czas dużej partii wdrożenia. Na żądanie, generuj **widok różnicowy** między dwoma snapshotami (albo dwiema dowolnymi wersjami dokumentu) — co faktycznie się zmieniło, nie tylko "co jest teraz". Przydatne przy dużych integracjach, przy code review (Część X), i przy powrocie do projektu po dłuższej przerwie, kiedy czytanie całej historii zmian byłoby zbyt czasochłonne. Podobnie jak widok eksportowy (Część V), diff to pochodna — generowana na żądanie z aktualnej treści i logów zmian (C.6), nigdy osobno utrzymywana.

---

## CZĘŚĆ U — Sprzężenie zwrotne: jak ta instrukcja się rozwija

Ta instrukcja nie jest ustaloną raz na zawsze. Doświadczenie z każdego kolejnego projektu, zbudowanego wg niej, jest materiałem, z którego rosną kolejne wersje. Bez formalnego mechanizmu to doświadczenie ginie w Biblii tego jednego projektu i nigdy nie wraca do reszty.

### U.1 Plik `memory.md` — pamięć między projektami

Obok tej instrukcji (nie wewnątrz konkretnej Biblii projektu — to plik na poziomie meta, wspólny dla wszystkich projektów budowanych wg tej metodologii) prowadzony jest `memory.md` — rosnący log unikalnych, wartych zapamiętania przypadków. To nie jest kolejna checklista — to surowy materiał, z którego destylowane są przyszłe wersje instrukcji.

Format wpisu:
```
[DD.MM.RRRR] Projekt: [nazwa] — Przypadek: [krótki opis sytuacji]
Dlaczego warto zapamiętać: [co się stało, jaka lekcja]
Status: 🔎 pojedynczy przypadek / 🔁 powtórzony (X razy) / ✅ wpisany do instrukcji jako [Część X]
```

### U.2 AI dopisuje z własnej inicjatywy, nie tylko na żądanie

Za każdym razem, gdy AI podczas pracy nad Biblią jakiegoś projektu natrafia na sytuację wartą zapamiętania poza tym jednym projektem (nieoczywisty konflikt, powtarzający się błąd, dobre rozwiązanie strukturalne, coś zaskakującego) — dopisuje to do `memory.md` **od razu, z własnej inicjatywy, bez pytania o zgodę na sam zapis** (to tylko notatka, nie zmiana instrukcji — nie wymaga tego samego rygoru co C.7). Nie czeka na formalną retrospektywę na końcu projektu. Przy Kroku 0 (rozpoznanie terenu, Część E) warto też zajrzeć do `memory.md` pod kątem doświadczeń z poprzednich projektów, które mogą być istotne dla tego, co się zaczyna.

[03.09.2026] ✅ DODANO — źródło: integracja z `new-app-standards`, Część Y.8. **Dla naszej rodziny aplikacji ten mechanizm jest rozproszony, nie jednoplikowy.** AI pracujące nad projektem downstream nie ma bezpośredniego dostępu do repo `new-app-standards` (i nie powinno go edytować — patrz Y.8) — więc zamiast dopisywać wprost do centralnego `memory.md`, dopisuje do **lokalnego** `docs/wklad-do-standardu.md` tego projektu. Centralny `docs/god-book/memory.md` w `new-app-standards` istnieje nadal, dokładnie w formacie z U.1 — zasila go właściciel projektu, przynosząc treść plików `docs/wklad-do-standardu.md` z poszczególnych projektów do sesji nad `new-app-standards`, gdzie dopiero dzieje się konsolidacja i promocja (U.3).

### U.3 Formalna retrospektywa i promocja do instrukcji

Cyklicznie (koniec projektu/dużego etapu, albo na żądanie): przejrzyj `memory.md` i dla każdego wpisu ze statusem 🔁 (powtórzony) albo wyraźnie uniwersalnego zapytaj wprost, czy promować go do tej instrukcji jako nową/zmienioną zasadę. Jeśli tak — zastosuj normalny tryb zmiany tej instrukcji (bump wersji, wpis w Changelogu — jak przy v1.1/v1.2) i oznacz wpis w `memory.md` jako ✅ wpisany do instrukcji jako [Część X]. Nie usuwaj wpisu z `memory.md` (ta sama zasada nienaruszalności co w Części D — `memory.md` to też rosnący log, nie edytowany wstecz).

Pojedyncze przypadki (🔎, bez powtórzenia) zostają w `memory.md` jako materiał odniesienia — nie każdy unikalny przypadek zasługuje na uniwersalną regułę, ale warto mieć go pod ręką, gdy pojawi się drugi podobny.

### U.4 Zbieranie wkładu bezpośrednio z dysku — rejestr projektów downstream

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Powód: U.2/U.3 opisują konsolidację jako w pełni ręczną — "przynoszoną tutaj przez właściciela projektu". W praktyce to oznaczało, że `docs/wklad-do-standardu.md` poszczególnych projektów siedziały biernie, nic nie sygnalizowało `new-app-standards`, że coś nowego czeka, i konsolidacja działa się tylko wtedy, gdy właściciel pamiętał, żeby fizycznie skopiować treść między sesjami. Ten punkt nie zmienia *gdzie* dzieje się decyzja o promocji (to wciąż wyłącznie sesja nad `new-app-standards`, Y.8/U.3, bez zmian) — zmienia tylko *jak* materiał do tej decyzji trafia na stół.

**Reguła.** Gdy wszystkie projekty downstream i `new-app-standards` są sklonowane lokalnie obok siebie (ten sam katalog nadrzędny) — sesja nad `new-app-standards` może **aktywnie czytać** `docs/wklad-do-standardu.md` każdego z nich wprost z dysku, zamiast czekać, aż ich treść zostanie ręcznie przyniesiona. Warunek: rejestr `docs/projekty-downstream.md` (w tym repo) — lista lokalnych ścieżek projektów korzystających z pakietu, utrzymywana przez właściciela (dopisywana, gdy projekt adoptuje pakiet po raz pierwszy, GOD BOOK README "Jak użyć w nowym projekcie"). Bez wpisu w rejestrze AI nie zgaduje, gdzie na dysku szukać — nie skanuje całego systemu plików.

**Procedura** (na żądanie — "sprawdź wkład ze wszystkich projektów" — albo cyklicznie przy większej retrospektywie, U.3):
1. Wczytaj `docs/projekty-downstream.md`, dla każdego wiersza ze ścieżką lokalną sprawdź, czy `docs/wklad-do-standardu.md` tego projektu istnieje na dysku.
1a. [07.09.2026] ✅ DODANO — źródło: incydent zero-waste (`docs/god-book/memory.md`, wpis 07.09.2026 "mechanizm U.4 samego pakietu"). **Zanim cokolwiek przeczytasz — `git fetch` w tym checkoucie, potem porównaj lokalny `HEAD` z `origin/main` (`git log HEAD..origin/main`).** "Czytaj wprost z dysku" (Reguła wyżej) nie znaczy "ufaj temu, co tam już leży" — lokalny checkout mógł nie być pociągnięty od dawna, a wtedy krok 2 czyta nieaktualny stan i **z pełną pewnością siebie raportuje "brak nowości"**, mimo realnych, nieskonsolidowanych wpisów na `origin/main`. Jeśli lokalny `HEAD` jest w tyle: pociągnij (`git merge --ff-only origin/main`), a jeśli to niemożliwe bez ryzyka dla nieśledzonej lokalnej pracy (working tree ma konflikt) — czytaj bezpośrednio ze zdalnej gałęzi (`git show origin/main:docs/wklad-do-standardu.md`), nie z working tree, i odnotuj w `docs/projekty-downstream.md`, że pełna synchronizacja checkoutu czeka na sesję nad tamtym projektem. Pomiń ten krok tylko wtedy, gdy projekt nie jest repozytorium git w ogóle (rzadkie, ale możliwe) — wtedy odczyt z dysku jest jedynym możliwym źródłem, nie skróconą wersją.

1b. [15.09.2026] ✅ DODANO — źródło: `docs/god-book/memory.md`, wpis 14.09.2026 "mechanizm U.4 przez świeże klony". **W środowisku sesji bez trwałego lokalnego checkoutu (np. świeży `git clone` na żądanie zamiast `~/projekty/...` odświeżanego między sesjami) — krok 1a wymaga pełnego fetch, nigdy targetowanego.** `git fetch origin <branch>` (albo płytki `--depth 1` klon, po którym wykonano tylko taki targetowany fetch) potrafi zaktualizować `FETCH_HEAD`, ale **nie** odświeżyć referencji śledzącej `origin/<branch>` — `git log HEAD..origin/main` wtedy fałszywie pokazuje zero różnicy, mimo że zdalna gałąź faktycznie jest o dziesiątki/setki commitów do przodu. Zamiast tego: zawsze pełny `git fetch origin '+refs/heads/*:refs/remotes/origin/*'` (albo równoważny pełny fetch wszystkich gałęzi), nigdy fetch ograniczony do jednej nazwanej gałęzi na takim klonie. Dodatkowo: na płytkim klonie (`--depth 1`) `git log`/`git diff` **bez podanej ścieżki** dają mylące, przesadzone wyniki (cała historia aż do sztucznej granicy płytkości, bo brak zapisanych rodziców commitu) — bezpieczne porównanie treści konkretnego pliku to zawsze `git show origin/main:<ścieżka>` albo `git diff <stary-tip> origin/main -- <ścieżka>`, nigdy `git log`/`git diff` bez ścieżki na takim klonie.
2. Przeczytaj każdy (**read-only** — patrz granica niżej), zbierz wpisy ze statusem `🔎 nowe`.
3. Zaproponuj każdy właścicielowi projektu tu, w sesji nad `new-app-standards`, dokładnie jak przy ręcznie przyniesionym materiale (U.1/U.3): dopisz do `docs/god-book/memory.md` jako 🔎 pojedynczy przypadek albo 🔁 powtórzony (jeśli podobny wpis już tam jest z innego projektu), i zapytaj o promocję, jeśli wyraźnie uniwersalny.
4. Zaktualizuj w `docs/projekty-downstream.md` datę ostatniej konsolidacji dla tego projektu.

**Granica — czego ten mechanizm nie zmienia.** Krok 2 to wyłącznie odczyt. Sesja nad `new-app-standards` **nigdy nie edytuje plików w projekcie downstream** — to samo ograniczenie co w drugą stronę (Y.8: AI downstream nie edytuje `new-app-standards`), tylko lustrzane. Dotyczy to też oznaczenia wpisu jako `✅ przekazane do new-app-standards (DD.MM.RRRR)` w `docs/wklad-do-standardu.md` źródłowego projektu (krok 4 procedury zgłaszania z tamtego pliku) — to zmiana w cudzym repo, więc albo robi ją właściciel ręcznie, albo, jeśli ma to zrobić AI, wymaga osobnej, wyraźnej zgody przy tej konkretnej okazji (nie jest częścią tego mechanizmu z automatu). Ten mechanizm rozwiązuje "nikt nie wie, że coś czeka" — nie usuwa granicy między repozytoriami.

---

## CZĘŚĆ V — Eksport: widok na zewnątrz projektu

Robocza Biblia jest pełna wewnętrznych adnotacji, ⚠️/🔎, sporów, nieukończonych wątków — świetna do pracy, nie do pokazania inwestorowi/klientowi/partnerowi.

Na żądanie, generuj **widok eksportowy**: oczyszczoną wersję wybranych dokumentów (albo całej Biblii), z której usunięto:
- znaczniki procesu (✅🔎⏳⚠️, ✅🤖) i adnotacje "NIEAKTUALNE" — zostaje tylko aktualna, obowiązująca treść
- log zmian i wewnętrzne odsyłacze do numerów decyzji/modułów (D#, M#)
- sekcje "Do decyzji", "Odchylenia w trakcie wdrożenia", Poczekalnia Pomysłów

Widok eksportowy to **pochodna, nie osobne źródło prawdy** — nigdy nie edytuj go bezpośrednio, generuj go na nowo z aktualnej Biblii za każdym razem, gdy jest potrzebny. Jeśli ma żyć dłużej (np. jako stały landing page), zapisz w Biblii, z której wersji dokumentów został wygenerowany (podobnie jak snapshot z T.3), żeby wiedzieć, kiedy trzeba go odświeżyć.

---

## CZĘŚĆ W — Orientacja i kontrola jakości między sesjami

### W.1 Brief startowy dla nowej osoby/sesji

P.2 ustala kolejność czytania dla AI kontynuującego pracę krok po kroku. Dla kogoś, kto dołącza do projektu bez żadnego kontekstu (nowa osoba w zespole, albo sesja AI, która ma szybko zrozumieć stan, nie prowadzić dalszą pracę) — generuj na żądanie **brief startowy**: streszczenie z `00_Biblia.md` + najświeższe wpisy `rejestr-decyzji.md` + aktualny stan `mapa-wdrozenia.md`, złożone w jeden, spójny tekst do przeczytania w kilka minut, bez konieczności przechodzenia przez całą historię dokumentów.

### W.2 Temperatura projektu — szybki przegląd stanu

Na żądanie (albo automatycznie na początku sesji poświęconej przeglądowi/planowaniu, nie pojedynczemu modułowi): policz i pokaż jednym rzutem oka:
- liczbę dokumentów ze statusem Propozycja (C.2) vs Stabilny
- liczbę niepotwierdzonych ✅🤖 (C.7)
- liczbę otwartych 🔎 i aktywnych ⚠️ blokad (C.1), w tym ile 🔎 ma przeterminowany termin ważności (C.10)
- liczbę pozycji w Poczekalni Pomysłów (F.1) bez nadanego statusu

To nie zastępuje audytu (Część N) — to szybki "puls", pokazujący, gdzie jest najwięcej nierozstrzygniętego, zanim zdecydujesz, od czego zacząć sesję.

### W.3 Reguła "żadnej sierocej decyzji"

Każda decyzja w rejestrze (D1, D2…) musi mieć jawny odnośnik do przynajmniej jednego modułu/dokumentu, którego dotyczy, albo jawne oznaczenie "dotyczy całego projektu". Decyzja bez żadnego wpływu na żaden dokument to sygnał, że albo nie została jeszcze wdrożona do treści (do zrobienia), albo nigdy nie była potrzebna (do przemyślenia, czy w ogóle powinna zostać). Sprawdzaj to przy audycie (Część N).

### W.4 Test obcego czytelnika

Cyklicznie, przy dużych audytach (Część N): przeczytaj wybrany dokument/moduł tak, jakbyś nic nie wiedział o projekcie poza tym, co w nim napisano. Pytanie nie brzmi "czy wszystko jest", tylko **"czy dałoby się to zrozumieć bez pytania autora"**. To inny kąt niż audyt kompletności — łapie miejsca, gdzie treść zakłada niewypowiedziany kontekst, nawet jeśli formalnie nic nie brakuje.

### W.5 Próg rozmiaru dokumentu

Gdy pojedynczy dokument zaczyna przekraczać rozsądny rozmiar do jednorazowego przeczytania (orientacyjnie: kilkanaście sekcji, albo temat wyraźnie się rozgałęzia), to sygnał, nie problem do zignorowania — rozważ podział na kolejny numerowany dokument (B.2/B.3), zamiast pozwalać jednemu plikowi rosnąć bez końca. Dokument, który trzeba długo przewijać, żeby znaleźć jedną sekcję, przestaje spełniać swoją rolę, nawet jeśli merytorycznie wszystko w nim jest poprawne.

### W.6 Kontrola starzenia się treści

Dokument, decyzja (D#) albo założenie (Z#, F.7), które nie były dotykane/przeglądane przez dłuższy czas, same w sobie są sygnałem do sprawdzenia aktualności — niezależnie od tego, czy ktoś to zgłosił. Przy audycie (Część N) i przeglądzie temperatury (W.2) zwracaj uwagę nie tylko na to, co jest jawnie oznaczone jako otwarte, ale i na to, co najdłużej nie było ruszane — szczególnie ważne dla 🔎 bez terminu (C.10) i założeń (F.7), które łatwo "zapomnieć", bo formalnie nie są błędem, tylko cichym długiem.

---

## CZĘŚĆ X — Testy kodu, code review i inżynieria dla dużych projektów

Wszystko dotąd w tej instrukcji dotyczyło dokumentacji i decyzji. Przy projekcie na tyle dużym, że rośnie liczba modułów i osób piszących kod, sama dokumentacja nie wystarcza — potrzebna jest twarda dyscyplina inżynierska, spięta z tymi samymi ID i rejestrami, które już istnieją (M#, D#, T.2), żeby dwa światy — Biblia i kod — nie rozjeżdżały się po cichu. Ta część dotyczy projektów, których wdrożenie obejmuje pisanie kodu; jeśli projekt nie obejmuje kodu, pomiń ją.

### X.1 Test automatyczny = przykład z H.1, formalnie

Każdy moduł ma w H.1 pole "Przykład" — konkretny, przeliczony przypadek. W dużym projekcie to nie sugestia, to wymóg: przykład z H.1 staje się rzeczywistym automatycznym testem w kodzie, nazwanym/otagowanym ID modułu (np. `test_M12_walidacja_wejscia`). Test suite rośnie 1:1 z liczbą modułów. Rubryka gotowości (T.1) dostaje twarde kryterium: "ma automatyczny test, nie tylko opisany przykład" — gotowość nie może wynosić 100%, jeśli test nie istnieje albo nie przechodzi.

### X.2 Code review — checklist wprost z pól modułu

Przed scaleniem kodu implementującego dany moduł, code review sprawdza punkt po punkcie pola z H.1: czy Wejście/Wyjście się zgadza, czy Walidacja jest zaimplementowana, czy Obsługa błędów faktycznie obsługuje przypadki opisane w module, czy test z X.1 przechodzi, czy kontrakty poprzeczne (G.3) są zachowane, czy pole Zależności (H.1) się nie zmieniło bez wiedzy modułów, które od niego zależą. Reviewer, który znajdzie rozbieżność między kodem a Biblią, nie poprawia kodu po cichu, żeby "zgadzało się z Biblią" — zgłasza to jako pętlę zwrotną (T.4), bo rozbieżność równie dobrze może oznaczać, że to Biblia się myliła, nie kod.

### X.3 Definicja "Gotowe" dla modułu

Moduł nie jest oznaczony jako "Zaimplementowany" w `mapa-wdrozenia.md` (T.2), dopóki nie spełnia wszystkiego naraz: kod przechodzi test z X.1, przeszedł code review z X.2, jest zgodny z kontraktami (G.3), a `mapa-wdrozenia.md` została zaktualizowana. Częściowe spełnienie = status pozostaje "w trakcie", nigdy "zaimplementowany" — inaczej mapa wdrożenia przestaje być wiarygodna, a to jedyne miejsce, które ma być wiarygodne (T.2).

### X.4 Rejestr długu technicznego

Osobno od backlogu pomysłów (F.1) i założeń (F.7): **dług techniczny** — kod napisany świadomie "na szybko", niezgodnie z pełną specyfikacją modułu, z jasną intencją poprawienia później. Prowadź `dlug-techniczny.md` (Filar C — rejestr, tak jak rejestr-decyzji czy backlog, nie element architektury), format:
```
TD1 (DD.MM.RRRR) — moduł: M#, co skrócono: [opis], ryzyko: [co się może zepsuć], priorytet naprawy: [wysoki/średni/niski]
```
Bez tego rejestru "na szybko" ma tendencję zostawać na stałe, bo nic go nie przypomina.

[04.09.2026] ✅ DODANO — źródło: projekt inzynier-szkieletowy-pro, przyniesione przez właściciela projektu. **Zalecane: kotwiczenie w kodzie.** Sam numerowany rejestr (TD#/data/ryzyko/priorytet) chroni przed "zapomnianym" długiem, ale nie przed **rozjazdem** rejestru z kodem — wpis może przeżyć naprawę (nikt go nie zamyka) albo w kodzie może pojawić się nowy skrót bez odpowiadającego wpisu (nikt tego nie zauważy), i nic w samym formacie TD# tego nie wykrywa. Rozwiązanie sprawdzone w praktyce: każdy wpis `dlug-techniczny.md` odpowiada spójnemu markerowi w źródle (np. `🔎 TD3`), a sam plik jawnie deklaruje się jako **indeks, nie kopia** treści. Przy audycie (Część N) sprawdź zgodność w obie strony: `grep -rn "🔎 TD"` po markerach bez odpowiadającego wpisu w rejestrze (dług nieudokumentowany — dopisz) i po wpisach bez odpowiadającego markera w kodzie (dług już naprawiony — zamknij wpis, nie zostawiaj otwartego). To rozszerza X.4 o ten sam rodzaj ochrony, jaki Y.2 daje standardowi: dryf bez świadomej decyzji wykrywany aktywnie, nie z pamięci ostatnich ustaleń.

### X.5 Identyfikatory w historii kodu

Commit message i nazwa brancha, gdziekolwiek to możliwe, odwołują się do ID z Biblii: `M12: dodaj walidację wejścia` albo `D14: zmiana jednostki bazowej`. Dzięki temu historia kodu (git log) i historia Biblii (rejestr decyzji, moduły) są przeszukiwalne wzajemnie — przy dużym projekcie i wielu współpracownikach to jedyny realny sposób, żeby po miesiącach odtworzyć "dlaczego kod tak wygląda", bez zgadywania.

### X.6 Regresja przy zmianie kontraktu poprzecznego

Kontrakty poprzeczne (G.3) dotyczą wielu modułów naraz — zmiana jednego z nich to zdarzenie wysokiego ryzyka w dużym projekcie. Przy każdej zmianie kontraktu: (1) znajdź wszystkie moduły, które go używają (przez pole Zależności H.1, albo systematyczne przeszukanie), (2) uruchom ponownie ich testy (X.1), (3) nie uznawaj zmiany kontraktu za zakończoną, dopóki wszystkie zależne moduły nie przejdą — częściowa migracja kontraktu to stan tymczasowy, jawnie oznaczony, nie stan docelowy.

---

## CZĘŚĆ Y — Warstwa wspólna między projektami: Standard Architektoniczny

[03.09.2026] ✅ DODANO — źródło: integracja z pakietem `new-app-standards` (repozytorium wspólnego standardu architektonicznego i procesowego, jedno dla całej rodziny naszych aplikacji). Ta Instrukcja (Części 0–X) opisuje **jak prowadzić proces** budowy i utrzymania Biblii — jest metodologią niezależną od domeny i technologii. Osobno od niej istnieje **Standard Architektoniczny** — stały, wspólny dla całej rodziny naszych aplikacji zbiór **już podjętych** decyzji technicznych (warstwy, kontrakty danych, wzorce UI, bezpieczeństwo, testy, styl kodu), obowiązujący niezależnie od tego, czym akurat jest budowany projekt. Ta Część opisuje, jak te dwa dokumenty współpracują.

### Y.1 Relacja: metodologia vs stały fundament

**Reguła.** Standard Architektoniczny nie jest kolejnym poziomem hierarchii pierwszeństwa (0.4) — jest **fundamentem poprzedzającym Krok 0** (Część E). Hierarchia 0.4 rozstrzyga spory *wewnątrz* Biblii danego projektu (Złote Zasady vs Decyzje D# vs Ekspertyza domenowa); Standard Architektoniczny obowiązuje **z góry, zanim** którykolwiek z tych poziomów zacznie być ustalany.

**Uzasadnienie.** Standard powstał ze scalenia doświadczeń wielu wcześniejszych projektów (patrz jego własna sekcja 0.5) — nie jest opinią jednego projektu, którą dałoby się "przegłosować" lokalną Złotą Zasadą sformułowaną pochopnie na starcie nowego projektu.

### Y.2 Co robić przy kolizji z Standardem

**Reguła.** Rozróżnij dwa różne przypadki, zanim zdecydujesz, co zrobić:

1. **Dryf bez świadomej decyzji** — kod/moduł odszedł od reguły Standardu, a nikt nigdy świadomie nie zdecydował, że tak ma być. To nie jest konflikt dwóch prawd, to błąd. **Standard wygrywa automatycznie, bez pytania** — napraw i zapisz w dzienniku zmian (C.4/C.6).
2. **Świadoma potrzeba projektu** — Złota Zasada, decyzja D# albo realna natura domeny wymaga czegoś, co koliduje ze Standardem (np. projekt jednorazowy, gdzie offline-first jest zbędny). To jest prawdziwy konflikt wg I.1 — **nigdy nie rozstrzygaj sam**. Zgłoś, i jeśli ma powstać odstępstwo:
   - zapisz je jako decyzję D# w `rejestr-decyzji.md`, tym samym trybem co unieważnienie decyzji (F.5) — jawnie wskazującą, który punkt Standardu (numer rozdziału) zostaje świadomie pominięty i dlaczego,
   - rozważ, czy to sygnał, że **sam Standard powinien się zmienić** — jeśli tak, zmiana wraca do repozytorium `new-app-standards`, nie zostaje cichą lokalną łatką w jednym projekcie (zasada tego repozytorium, patrz jego `README.md`).

**Uzasadnienie.** Te dwa przypadki wyglądają z zewnątrz podobnie ("kod/Biblia nie zgadza się ze Standardem"), ale wymagają przeciwnego traktowania — pierwszy nie potrzebuje eskalacji (to byłoby marnowanie czasu właściciela projektu na oczywisty błąd), drugi wymaga jej zawsze (bo to nie jest oczywiste, które źródło ma rację).

### Y.3 Co dokładnie Standard wypełnia w strukturze tej Instrukcji

Dla projektów naszej rodziny (korzystających z `new-app-standards`), poniższe kroki/pola tej Instrukcji **nie zaczynają się od zera** — Standard dostarcza gotową, domyślną treść:

| Miejsce w tej Instrukcji | Domyślna treść z `new-app-standards` |
|---|---|
| Krok 5 (Część E) — model danych i kontrakty rdzenia | `kontrakty-rdzenia.md` startuje jako kopia rozdz. 01–07 (architektura warstw, model danych, jądro obliczeniowe z Kontraktem Wyniku, walidacja, offline-first, API, bezpieczeństwo) |
| G.3 — Kontrakt wyniku/widżetu | Rozdz. 03.2 (`CalcResult<T>`) i rozdz. 04.2 (Kontrakt Widżetu) — konkretna, przetestowana implementacja abstrakcyjnego wymogu G.3 |
| G.3 — Kontrakt zapisu | Rozdz. 05.1 ("Zapisuj Seed, nigdy Wynik") — to samo pojęcie, wcześniej nazwane inaczej, wypracowane niezależnie |
| P.1 — "Standardy inżynierskie dla kodu" | Rozdz. 10 (testy), 11 (CI), 16 (standard kodowania) — kopiowane w całości, nie wymyślane per projekt |
| H.1 pole "UI" / wzorzec ekranu | Rozdz. 08 (taksonomia wzorców A–H, szablon Doradcy) jako biblioteka referencyjna |
| Część K — tematy wrażliwe | Rozdz. 09 (granice AI jako funkcji produktu — inny byt niż AI piszące tę Biblię, patrz nagłówek rozdz. 09) i jego 9.4 (obrona przed wstrzyknięciem poleceń z treści zewnętrznych) rozszerzają tę Część o przypadek AI jako feature aplikacji |
| H.2 — stabilne ID modułów | Rozdz. 01.6 ("moduł funkcjonalny") i rozdz. 04.3 (rejestr twardych stopów z odsyłaczami w formacie `(M5/E1)`) już nieformalnie stosują tę zasadę — przy pracy nad projektem z tej rodziny, nadawaj im formalne ID M# od pierwszego modułu |

**Konsekwencja.** To, co Część G tej Instrukcji każe *zaprojektować* dla nowego projektu od zera, dla naszej rodziny aplikacji trzeba tylko *sprawdzić i dopasować* — realna oszczędność czasu, o ile ktoś (człowiek albo AI) faktycznie wie, że ta tabela istnieje. Stąd odsyłacze do niej dopisane wprost w Części A, E i P (patrz adnotacje z 03.09.2026 w tych miejscach).

### Y.4 Kolejność czytania na start — scalona

**Reguła.** Dla projektu korzystającego jednocześnie z tej Instrukcji i ze Standardu, protokół startu sesji (P.2) rozszerza się o krok poprzedzający, zapisany też bezpośrednio w P.2:

**Krok 0 (poprzedza P.2, punkt 1):** `docs/standards/00-INDEKS.md` + `CLAUDE.md` — fundament, obowiązuje zawsze, niezależnie od zadania, czytany w całym swoim zakresie tylko raz na "wdrożenie się" w projekt, potem selektywnie wg C.8 (poziomy głębokości czytania — dotyczy też Standardu, nie tylko tej Instrukcji).
Dopiero potem P.2 punkty 1–4 (Biblia tego konkretnego projektu).

**Uzasadnienie.** Standard jest wspólny dla wszystkich naszych projektów i praktycznie się nie zmienia w trakcie pracy nad jednym z nich — nie ma sensu czytać go na nowo, "od zera", jakby to była treść tej konkretnej Biblii. Jest bagażem, który AI wnosi do projektu, nie czymś, co projekt tworzy.

[08.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **Ten obowiązek nie czeka na przypomnienie.** Dotyczy nie tylko dosłownego początku pierwszej wiadomości w nowej sesji, ale też **każdego kolejnego większego zadania w trakcie tej samej sesji** (nowy moduł, nowy rozdział Biblii, wdrożenie po dłuższej przerwie w rozmowie, powrót do pracy po streszczeniu/kompaktowaniu kontekstu) — jeśli AI nie ma pewności, że aktualny stan `docs/standards/`, GOD BOOK i Biblii projektu jest jej znany z bieżącej sesji (nie z pamięci sprzed streszczenia), wraca do Kroku 0/P.2 zamiast zakładać ciągłość. Brak wzmianki o tym ze strony właściciela projektu **nie jest** przesłanką do pominięcia tego kroku — dokładnie ta sama zasada co przy ekspertyzie domenowej (0.2: "brak przypomnienia nie jest usprawiedliwieniem").

**To nie znaczy czytać wszystko od nowa, za każdym razem — ten wymóg działa razem z C.8, nie zamiast niego.** "Wraca do Kroku 0/P.2" znaczy: potwierdź, jaki jest aktualny stan (najtańszy poziom, który wystarczy — zwykle `docs/lista-do-zrobienia.md` + TL;DR/indeks, rzadziej wyciąg operacyjny P.1, tylko wyjątkowo pełna treść GOD BOOK/rozdziału standardu), **nie** wczytuj ponownie całego dokumentu, jeśli C.8 tego nie wymaga. Cel tego punktu to wyeliminować sytuację "założyłem bez sprawdzenia, że nic się nie zmieniło", nie zmusić do maksymalnego zużycia kontekstu przy każdym kroku — to byłby dokładnie odwrotny skutek od tego, po co istnieje C.8.

Ten wymóg ma tę samą rangę co reszta Części Y — poprzedza pięciopoziomową hierarchię 0.4, nie jest jej szóstym, opcjonalnym poziomem.

### Y.5 Obowiązek prowadzenia `docs/memory.md`

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Każdy projekt korzystający z tego pakietu **musi** prowadzić `docs/memory.md` (albo pełną Biblię wg Części S, jeśli skala projektu tego wymaga) od pierwszej sesji — to nie jest opcjonalne, niezależnie od rozmiaru czy tempa projektu. Brak tego pliku jest sam w sobie sygnałem niekompletnego wdrożenia pakietu (patrz Y.7).

**Uzasadnienie.** Bez tego pliku każda kolejna sesja (ludzka albo AI) re-eksploruje projekt od zera i powtarza już raz znalezione błędy — dokładnie to, czemu ten cały pakiet ma zapobiegać.

### Y.6 Sprawdzanie aktualizacji — cyklicznie, nie tylko na żądanie

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Projekt sprawdza `AKTUALIZACJE.md` źródłowego repo `new-app-standards` **nie rzadziej niż raz na 7 dni**. Datę ostatniego sprawdzenia zapisuj w `docs/memory.md` (sekcja "Synchronizacja ze standardem"). Brak zapisanej daty = traktuj jak "nigdy nie sprawdzono", zrób pełne sprawdzenie teraz.

`AKTUALIZACJE.md` **nigdy nie jest kopiowany do projektu** — sprawdzany bezpośrednio w źródle (lokalnie, jeśli repo `new-app-standards` jest sklonowane obok, albo zdalnie) — kopia byłaby tym samym problemem, któremu ten mechanizm ma zapobiegać: nieaktualną wersją tego, co ma wykrywać nieaktualność.

[09.09.2026] ✅ DODANO — źródło: właściciel projektu, incydent 09.09.2026 (`docs/god-book/memory.md`, ten sam dzień) — lustrzana poprawka do U.4 (1a, v2.11), ta sama choroba, przeciwny kierunek czytania. **Jeśli lokalny klon `new-app-standards` jest sklonowany obok tego projektu — zanim przeczytasz z niego `AKTUALIZACJE.md`, zrób w nim `git fetch`, potem porównaj lokalny `HEAD` z `origin/main` (`git log HEAD..origin/main`).** "Sprawdzany lokalnie" (wyżej) nie znaczy "ufaj temu, co tam już leży" — nieodświeżony checkout czyta stary stan i **z pełną pewnością siebie raportuje "brak nowości"**, mimo realnych, nieskonsolidowanych wpisów na `origin/main` źródła. Jeśli lokalny `HEAD` jest w tyle: pociągnij (`git merge --ff-only origin/main`), a jeśli working tree ma lokalne, nieśledzone zmiany, które kolidują — czytaj bezpośrednio ze zdalnej gałęzi (`git show origin/main:AKTUALIZACJE.md`), nie z working tree. Jeśli lokalnego klona `new-app-standards` nie ma obok (sprawdzasz zdalnie) — ten krok i tak jest spełniony z definicji, bo nie ma nieaktualnego checkoutu do pomylenia ze stanem bieżącym.

**Konsekwencja.** Znajdziesz wpisy nowsze niż Twoja zapisana data → **poinformuj właściciela projektu i zaproponuj konkretne pliki do zaktualizowania** (wg kategorii, Y.8), nigdy nie podmieniaj plików samodzielnie bez pokazania, co się zmieni. To ten sam tryb co każda inna zmiana z zewnątrz źródła (nie decydujemy za człowieka).

### Y.7 Wykrywanie nieaktualnej lub niekompletnej kopii

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Przy sprawdzeniu (Y.6) porównaj listę plików, które **powinny** istnieć wg aktualnego manifestu (`README.md` tego repo, sekcja "Zawartość") z tym, co faktycznie jest w projekcie. Jeśli brakuje pliku, który manifest wymienia jako część aktualnego pakietu — to silny sygnał, że lokalna kopia powstała **przed jakąś rundą zmian**, nie tylko że brakuje tego jednego pliku.

**Konsekwencja.** W takim wypadku nie ograniczaj się do skopiowania samego brakującego pliku — odśwież **całą kategorię NIETYKALNE** (Y.8) z aktualnej wersji źródła, bo reszta plików tej kategorii najpewniej też jest stara.

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **Ten sam sygnał obejmuje też pliki i foldery spoza kategorii NIETYKALNE** — `docs/memory.md`, `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`, `docs/zrodla/`, `CLAUDE.md`. Brak któregokolwiek z nich nie jest "projekt świadomie z niego zrezygnował" — to domyślnie ten sam sygnał niekompletnej kopii co brak pliku NIETYKALNEGO. Pełna, obowiązkowa lista do sprawdzenia i dokładna procedura: **Y.9**.

### Y.8 Kategorie plików przy aktualizacji

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Ten punkt istnieje, bo część projektów mogła już zaadaptować pliki standardu pod siebie, zanim ten mechanizm powstał — bezmyślny nadpis wszystkiego zniszczyłby tę adaptację tam, gdzie miała prawo istnieć.

**Reguła.** Każdy plik pakietu należy do jednej z trzech kategorii, decydującej o tym, co "aktualizacja" właściwie znaczy:

| Kategoria | Pliki | Co robić przy aktualizacji |
|---|---|---|
| **NIETYKALNE** — zawsze pełny nadpis, zero lokalnej adaptacji | `docs/standards/00–16`, `docs/god-book/instrukcja-uniwersalna-biblii-projektu-*.md`, `PROMPT_STARTOWY.md` | Nadpisz w całości aktualną wersją źródła. Lokalna różnica od źródła w tych plikach to dryf (Y.2), nie świadoma decyzja z prawem do zachowania — napraw, nie negocjuj. |
| **ADAPTOWALNE** — projekt ma prawo je dostosować | `CLAUDE.md` (z `CLAUDE.template.md`), `.claude/skills/standards/SKILL.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md` | Porównaj lokalną wersję ze źródłową, zidentyfikuj co nowego/zmienionego w źródle, wnieś **tylko te poprawki**, zachowaj resztę lokalnej adaptacji (PATCH nie REWRITE). |
| **LOKALNE** — poza tym mechanizmem w ogóle, **o ile plik już istnieje** | `docs/memory.md`, `docs/wklad-do-standardu.md`, `docs/lista-do-zrobienia.md`, `docs/zrodla/`, `00_Biblia.md`, `rejestr-decyzji.md` i cała żywa Biblia | Sync tego nie dotyka — to własność projektu. |

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **"LOKALNE" rozstrzyga wyłącznie o TREŚCI, nigdy o ISTNIENIU.** Ta tabela odpowiada na pytanie "co zrobić z treścią pliku, który już jest w projekcie" — nie na pytanie "czy ten plik/folder w ogóle musi istnieć". To drugie pytanie ma jedną odpowiedź, niezależną od kategorii: tak, musi, patrz manifest w Y.9. Plik kategorii LOKALNE, który jeszcze nie istnieje, nie jest "świadomą nieobecnością do uszanowania" — jest brakującym elementem instalacji, zakładanym z odpowiedniego szablonu przy najbliższej okazji (Y.9), dokładnie tak jak plik NIETYKALNY. Po założeniu — i dopiero wtedy — zaczyna obowiązywać dla niego ten wiersz tabeli.

**Kanał zwrotny.** Gdy AI w projekcie natrafi na coś nietrywialnego — błąd, dobrą praktykę, pomysł na nową regułę, warty rozważenia dla całej rodziny aplikacji, nie tylko tego projektu — dopisuje z własnej inicjatywy do `docs/wklad-do-standardu.md` (analogicznie do Części U.2). **Nigdy nie edytuje stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards`, tak jak reszta Części U: `docs/wklad-do-standardu.md` każdego projektu to rozproszone źródła, `docs/god-book/memory.md` w `new-app-standards` to scentralizowany log po konsolidacji.

### Y.9 Checklist kompletności — obowiązkowa, jawnie raportowana

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Powód powstania: w praktyce AI pracujące nad projektem downstream, poproszone o "sprawdzenie aktualizacji" (Y.6), ograniczało się do odświeżenia plików, które już rozpoznawało jako istniejące (typowo `docs/standards/`), i milczące pomijało resztę pakietu — `docs/zrodla/`, GOD BOOK, szablony `lista-do-zrobienia`/`memory`/`wklad-do-standardu`, a czasem samo `CLAUDE.md`. Efekt: projekt zostawał trwale na "częściowej" wersji pakietu, mimo że AI raportowało zakończoną synchronizację. Y.7/Y.8 już zawierały regułę na to (dryf = napraw, LOKALNE = nie kasuj istniejącej treści), ale bez jawnej, wyczerpującej listy i bez wymogu pokazania jej wyniku — więc AI miało pole do (nieświadomego) pominięcia pozycji, o której akurat nie pomyślało.

**Reguła.** Przy każdym sprawdzeniu Y.6 (cyklicznym albo na żądanie) — zanim zgłosisz je jako zakończone — przejdź **całą** poniższą listę, pozycja po pozycji, i pokaż wynik właścicielowi projektu jako listę ✅/➕/⚠️, nie samym zdaniem "zsynchronizowano":

| # | Element | Jeśli istnieje | Jeśli brakuje |
|---|---|---|---|
| 1 | `docs/standards/00-INDEKS.md` + rozdziały `00`–`16` | Porównaj z wersją źródłową, nadpisz przy różnicy (NIETYKALNE) | ➕ Skopiuj w całości z `new-app-standards` |
| 2 | `docs/god-book/instrukcja-uniwersalna-biblii-projektu-*.md` | Porównaj numer wersji w nazwie pliku, nadpisz przy różnicy (NIETYKALNE) — pamiętaj o zmianie nazwy pliku (C.5) | ➕ Skopiuj aktualną wersję |
| 3 | `CLAUDE.md` | Porównaj ze źródłowym `CLAUDE.template.md`, wnieś tylko nowe poprawki (ADAPTOWALNE, PATCH nie REWRITE) | ➕ Utwórz z `CLAUDE.template.md`. **Wypełnij pola `<!-- TODO -->` realną treścią tego projektu** (stack, komendy, zakazy) na podstawie tego, co faktycznie jest w repo — nie zostawiaj placeholderów, nie zgaduj; czego nie da się ustalić z repo, zapytaj właściciela zamiast pominąć |
| 4 | `docs/memory.md` **albo** pełna Biblia (Część S, 14 pozycji: `00_Biblia.md`, `rejestr-decyzji.md`, `zlote-zasady.md`, `mapa-wdrozenia.md`, `docs/zrodla/`, `docs/lista-do-zrobienia.md` itd.) | Treści (decyzji, złotych zasad, historii) nie dotykaj — LOKALNE. **Ale samo istnienie "jakiejś Biblii" nie zwalnia z audytu**: sprawdź, których z 14 pozycji Części S faktycznie brakuje — "mamy już Biblię" i "mamy komplet Części S" to dwa różne stwierdzenia, nie zakładaj drugiego z pierwszego | ➕ Utwórz lekką wersję z `docs/memory.template.md` — obowiązkowy od pierwszej sesji (Y.5), nieobecność nigdy nie jest świadomą decyzją do uszanowania |
| 5 | `docs/lista-do-zrobienia.md` | Nie dotykaj treści (LOKALNE) | ➕ Utwórz z `docs/lista-do-zrobienia.template.md` (B.6) |
| 6 | `docs/wklad-do-standardu.md` | Nie dotykaj treści (LOKALNE) | ➕ Utwórz z `docs/wklad-do-standardu.template.md` (Y.8, kanał zwrotny) |
| 7 | `docs/zrodla/` (folder) | Nie dotykaj zawartości (LOKALNE, B.5) | ➕ Załóż folder teraz, nawet pusty — nie odkładaj do pierwszego materiału źródłowego, bo to właśnie ten odruch ("załóżmy, jak będzie czego wkładać") jest tym, co dotąd powodowało trwały brak |
| 8 | `.claude/skills/standards/SKILL.md` | Porównaj ze źródłem, wnieś poprawki (ADAPTOWALNE) | ➕ Zalecany, nie twardo obowiązkowy — zaproponuj dodanie, zamiast pomijać bez wzmianki |
| 9 | `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` (tylko jeśli projekt prowadzi pełną Biblię, nie samo `docs/memory.md`) | Porównaj ze źródłem — czy sekcja "Standardy inżynierskie dla kodu" (P.1) faktycznie jest kopią rozdz. 10/11/16, nie lokalnym wynalazkiem sprzed integracji z `new-app-standards` (ADAPTOWALNE, PATCH nie REWRITE) | ➕ Sygnał, że Biblia nigdy nie przeszła Części P — zaproponuj utworzenie (GOD BOOK Część P), nie pomijaj z założenia "skoro Biblia już jest, to na pewno przeszła też ten krok" |

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **Gdy `CLAUDE.md` już istnieje, ale powstał niezależnie od `CLAUDE.template.md`** (własna struktura, sprzed adopcji tego pakietu, żadnych sekcji z szablonu) — to nadal wiersz 3 "Jeśli istnieje", nie "Jeśli brakuje": plik jest, więc go nie zastępujesz w całości. PATCH znaczy tu: **dopisz** brakujące obowiązkowe elementy (przede wszystkim sekcję "Zanim zaczniesz — przeczytaj w tej kolejności", Y.4) do istniejącej struktury, zachowując 100% tego, co już tam jest — opis projektu, stack, zakazy, cokolwiek innego. Jeśli plik ma już jakąś własną wersję "od czego zacząć sesję" w innej kolejności niż Y.4 — to nie jest z definicji świadoma decyzja z prawem do zachowania (przypadek Y.2.2); zanim ją nadpiszesz jako dryf (Y.2.1), sprawdź, czy różnica ma udokumentowane uzasadnienie (np. odsyłacz do decyzji D# w rejestrze) — jeśli nie, to dryf, popraw kolejność na zgodną z Y.4 i zostaw resztę pliku bez zmian; jeśli tak, to prawdziwy konflikt (Y.2.2) — zgłoś, nie rozstrzygaj sam.

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. **"Mamy już Biblię" nie jest odpowiedzią na pytanie z tej checklisty — jest powodem, żeby zadać je dokładnie.** Ten sam błąd, który spowodował powstanie Y.9 dla pojedynczych plików (LOKALNE czytane jako "gotowe, nie sprawdzaj"), powtarza się na poziomie całej Biblii: istniejąca, "już zrobiona" Biblia — nawet lekka, jeden `docs/memory.md` po kilku sesjach — bywa traktowana jako dowód, że projekt jest w pełni zsynchronizowany, i cała reszta checklisty zostaje pominięta z automatu. To nieprawda niezależnie od rozmiaru: świeży projekt z pierwszymi funkcjami i lekkim `docs/memory.md` oraz dojrzały projekt z pełnym Filarem C mają dokładnie ten sam obowiązek — przejść pozycje 1–9 osobno, bo "mamy Biblię" mówi wyłącznie o pozycji 4, nie o resztcie.

**Zakres wymuszenia — i jego granica.** Wymuszasz **istnienie struktury i obecność obowiązkowych odsyłaczy** (brakujący plik/folder z checklisty, brakująca sekcja kolejności czytania w `CLAUDE.md`, brakujący odsyłacz Y.4 w protokole startu sesji `00_Biblia.md` P.2, brakująca kopia rozdz. 10/11/16 w `01_Zasady_Pracy_i_Konwencje.md` — pozycja 9) — to wszystko PATCH: dopisanie brakującego elementu do istniejącej całości, zero usuwania czy przepisywania reszty. Nigdy nie wymuszasz **treści** — Złotych Zasad, decyzji D#, rejestru, faktycznego stanu wiedzy projektu. To rozróżnienie (struktura kontra treść) jest tym samym, co Y.8 ustala dla pojedynczych plików, zastosowane teraz do całej żywej Biblii: "przymusowe przekształcenie" dotyczy szkieletu, nigdy zawartości.

**`README.md` projektu downstream jest całkowicie poza tą checklistą** — nie jest jej pozycją, celowo. Ten pakiet nie ma zdania na temat tego, czy dany projekt ma własny `README.md`, jaką ma treść, ani czy w ogóle istnieje — to wyłącznie sprawa projektu (analogicznie do biblioteki open-source: ma swój README, niezależny od tego, że korzysta z jakiegoś wspólnego standardu wewnętrznie). Jedyna rzecz do sprawdzenia, i to tylko rozpoznawczo, nie jako pozycja checklisty: czy przypadkiem nie jest to `README.md` **skopiowany z `new-app-standards`** (rozpozna się po treści — opisuje ten pakiet, zasadę "jedynego miejsca edycji standardu", sekcję "Jak użyć w nowym projekcie" — nie po samej nazwie pliku) — jeśli tak, to pomyłka przy kopiowaniu (patrz adnotacja na górze `README.md` źródłowego), zgłoś i zaproponuj zastąpienie własnym opisem projektu. Poza tym jednym przypadkiem: cokolwiek jest w `README.md` projektu, zostaje, nietknięte, niezależnie od tego czy istnieje.

**Rozstrzygnięcie "pierwsza instalacja vs bieżący sync".** Nie zgaduj, w którym trybie jesteś — wynika wprost z tabeli: jeśli **którakolwiek** pozycja ma status "brakuje", potraktuj ją dokładnie tak samo jak przy zakładaniu nowego projektu (README, "Jak użyć w nowym projekcie") — dla tej pozycji nie ma różnicy między "projekt nowy" a "projekt od dawna działający, ale nigdy nie dostał tego elementu". Kategoria pliku (Y.8) rozstrzyga o TREŚCI przy nadpisywaniu, nie o tym, czy w ogóle działasz — patrz adnotacja przy Y.8.

**Raportowanie.** Utworzenie brakującego pliku/folderu to zmiana tak samo jak nadpisanie istniejącego — pokaż ją właścicielowi projektu przed uznaniem sprawdzenia za zakończone (Y.6), nigdy nie rób tego po cichu przy okazji czegoś innego. Po zakończeniu zapisz w `docs/memory.md` (sekcja "Synchronizacja ze standardem") datę **oraz** wynik checklisty (które pozycje uzupełniono), nie tylko samą datę — żeby następna sesja nie musiała zgadywać, czy poprzednia synchronizacja była pełna czy tylko częściowa.

### Y.10 Moduły opcjonalne pakietu — dodawane tylko dla pasującej podrodziny projektów

[06.09.2026] ✅ DODANO — źródło: projekt inzynier-offgrid-pro, zebrane przez GOD BOOK U.4, promowane po decyzji właściciela projektu.

**Reguła.** Nie każda część `new-app-standards` dotyczy każdego projektu rodziny. Y.9 jest obowiązkowa dla wszystkich bez wyjątku — ale niektóre elementy pakietu są warunkowe: mają sens i wartość tylko dla projektów określonego typu domeny, i **nie są dodawane automatycznie** przy sprawdzeniu Y.9 dla projektu, który nie spełnia warunku. Odróżnij to jawnie od NIETYKALNE/ADAPTOWALNE/LOKALNE (Y.8) — te trzy kategorie rozstrzygają *jak* aktualizować element, który *już dotyczy* projektu; Y.10 rozstrzyga, *czy dany element w ogóle dotyczy* tego projektu.

**Rejestr modułów opcjonalnych** (dopisywany, append-only, gdy powstaje nowy):

| Moduł | Warunek dodania | Lokalizacja w `new-app-standards` |
|---|---|---|
| Playbook: przetwarzanie materiałów źródłowych (normy, PDF, skany, `.doc`/`.docx`) | Projekt przetwarza dostarczone dokumenty normatywne/branżowe (normy PN/IEC/EN/HD, specyfikacje, materiały szkoleniowe) jako podstawę kalkulatorów/silników domenowych | `docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md` |
| Biblioteka norm źródłowych (współdzielona) | To samo co wyżej — projekt inżynierski z rodziny "Kalkulator Inżyniera Pro" pracujący na normach elektrycznych/budowlanych | `docs/biblioteka-norm/` |

**Jak stosować.** Przy pierwszej instalacji pakietu w nowym projekcie (README "Jak użyć w nowym projekcie") i przy każdym sprawdzeniu Y.9, oceń dodatkowo: czy ten projekt spełnia warunek któregokolwiek modułu z rejestru wyżej? Jeśli tak, a moduł jeszcze nie jest obecny — zaproponuj właścicielowi projektu jego dodanie (nie dodawaj automatycznie/po cichu, w odróżnieniu od Y.9, bo warunek dopasowania wymaga jawnego potwierdzenia, że projekt faktycznie jest tego typu). Jeśli projekt nie spełnia żadnego warunku — moduły opcjonalne pozostają nieobecne, to nie jest luka ani niekompletna synchronizacja.

**Skąd wziął się ten mechanizm.** Zgłoszone razem z dwoma konkretnymi modułami z projektu inzynier-offgrid-pro (przetwarzanie ~10 dokumentów źródłowych różnych formatów, i propozycja współdzielenia zweryfikowanych norm między projektami inżynierskimi rodziny) — oba wartościowe, ale żaden nie dotyczy np. farmer360.io czy zero-waste, więc żaden nie mógł trafić do `docs/standards/` (obowiązkowy dla wszystkich) bez łamania tej właśnie zasady.

---

## CHANGELOG

| Data | Wersja | Zmiana |
|---|---|---|
| 03.09.2026 | 1.0 | Pierwsza wersja skonsolidowana. Połączono i ujednolicono cztery źródła: (1) "Jak stworzyć Biblię projektu" (proces 9-krokowy), (2) "Metodologia tworzenia Biblii Projektowej" (struktura indeks+rozdziały, nienaruszalność treści, wersjonowanie, proces przyjmowania materiału), (3) "Strategia tworzenia Biblii Projektowej" (czym Biblia jest/nie jest, kontrakty poprzeczne, model danych, testy, antywzorce), (4) mega-prompt "Knowledge Core Engine" (rola AI, trzy filary, proces burza mózgów→decyzja, checkpoint sesji). Dodano nową Część P — wymóg przenoszenia operacyjnego wyciągu zasad do samej Biblii każdego projektu (`01_Zasady_Pracy_i_Konwencje.md`), żeby konkretna Biblia była samowystarczalna bez odwoływania się do tej instrukcji. Ujednolicono trzy różne systemy znaczników statusu (C.1 / C.2 / F.3) w jedną spójną tabelę odniesień. Dokumenty źródłowe pozostają w archiwum jako materiał uzasadniający poszczególne zasady. |
| 03.09.2026 | 1.1 | Dodano Część T — Wdrożenie: rubryka gotowości modułu ustalana od pierwszego modułu (T.1), osobny żywy dokument `mapa-wdrozenia.md` śledzący status opisany/zaimplementowany/przetestowany (T.2), zamrażanie Biblii (snapshot wersji) na czas dużych partii wdrożenia z sekcją "Odchylenia w trakcie wdrożenia" w rejestrze decyzji (T.3), pętla zwrotna kod→Biblia z osobnym wariantem adnotacji dla błędów wykrytych przy implementacji (T.4). Rozbudowano Część P: P.2 (protokół startu sesji, sekcja "Jak zacząć pracę" w `00_Biblia.md`) i P.3 (osobny dokument `02_Dyrektywy_AI_Projektu.md`, oddzielający dyrektywy zachowania AI specyficzne dla projektu od konwencji formatu). Zaktualizowano minimalny szkielet dokumentów (Część S, teraz 10 pozycji) i checklistę pierwszego dnia (Część R) o nowe pozycje. |
| 03.09.2026 | 1.2 | Dodano Część U — Sprzężenie zwrotne: meta-plik `memory.md`, wspólny dla wszystkich projektów budowanych wg tej instrukcji, do którego AI dopisuje z własnej inicjatywy unikalne przypadki (U.2), oraz formalna retrospektywa promująca powtarzające się przypadki do rangi nowej zasady instrukcji (U.3). Dodano C.7 (znacznik pochodzenia ✅🤖 — inicjatywa AI vs. decyzja właściciela), C.8 (TL;DR i trzy poziomy głębokości czytania), F.5 (odwracalność decyzji — format unieważniania wpisów w rejestrze decyzji), H.2 (stabilne ID modułów M1, M2… przeżywające reorganizację struktury). Zaktualizowano I.3 (odsyłacze preferują stabilne ID modułu nad numerem dokumentu) i listę konwencji przenoszonych do `01_Zasady_Pracy_i_Konwencje.md` (Część P.1). |
| 03.09.2026 | 1.3 | Rozbudowano Część 0 o automatyczną, obowiązkową ekspertyzę domenową AI (0.2 — AI z własnej inicjatywy przyjmuje personę doświadczonego eksperta danej dziedziny, np. architekta, kucharza, weterynarza, seniora-programisty, zależnie od projektu, i działa na najwyższym możliwym poziomie kompetencji niezależnie od tego, czy właściciel o tym przypomni) oraz jawne tryby sesji (0.3 — Pisanie / Audyt / Wdrożenie). Dodano C.9 (słownik pojęć — żywy dokument od pierwszego terminu), I.5 (integralność odsyłaczy przy redakcji strukturalnej), F.6 (koszt zmiany jako metryka przy decyzjach fundamentalnych), Część V (widok eksportowy — oczyszczona wersja Biblii na zewnątrz projektu) oraz Część W (orientacja i kontrola jakości: brief startowy W.1, temperatura projektu W.2, reguła "żadnej sierocej decyzji" W.3, test obcego czytelnika W.4, próg rozmiaru dokumentu W.5). Zaktualizowano szkielet dokumentów (Część S, teraz 11 pozycji, dodano `slownik-pojec.md`) i checklistę pierwszego dnia (Część R). |
| 03.09.2026 | 1.4 | **Audyt z testem obcego czytelnika (W.4) przeprowadzony na samej instrukcji** — 6 realnych usterek znalezionych i naprawionych: (1) dodano brakujący nagłówek H.1, numeracja Części H była nieciągła; (2) uzupełniono niekompletną listę konwencji w P.1 o 0.2/0.3, C.9, F.6, I.5 — brakowało ich mimo dodania w v1.2/v1.3, dokładnie ten scenariusz "martwego odsyłacza", przed którym ostrzega I.5; (3) usunięto kolizję terminologiczną "użytkownik" (osoba kierująca AI vs. odbiorca końcowy produktu) — ujednolicono na "właściciel projektu" w Części 0, dodano jawne rozróżnienie ról w 0.1; (4) dodano w Kroku 0 (Część E) jawne odesłanie od pytania o domenę/branżę do ekspertyzy domenowej (0.2), którego wcześniej brakowało mimo że checklista (Część R) tego wymagała; (5) tabela `mapa-wdrozenia.md` (T.2) zaczęła kluczować wierszami wg stabilnego ID modułu (M#, H.2) zamiast zwykłego tekstu; (6) doprecyzowano odsyłacz w Kroku L.2 — dodano I.2 (duplikaty) obok I.3. |
| 03.09.2026 | 1.5 | Dodano 0.4 (hierarchia pierwszeństwa, gdy Dyrektywy AI / Złote Zasady / decyzje / ekspertyza domenowa się kłócą) i 0.5 (procedura pivotu domeny — świadoma aktualizacja ekspertyzy i przegląd dezaktualizacji przy zmianie kierunku projektu). Dodano C.10 (opcjonalny termin ważności dla 🔎, pokazywany w W.2 jako przeterminowany) i F.7 (rejestr założeń Z1, Z2… w `rejestr-decyzji.md` — osobna kategoria od 🔎 i decyzji D#, z jawnym śladem "na czym się opiera" dla łatwej rewizji po sfalsyfikowaniu). Rozszerzono szablon modułu (H.1) o pole "Zależności" (M# ↔ M#), zasilające kolejność pracy z Kroku 7. Zaktualizowano listę konwencji w P.1 i opis `rejestr-decyzji.md` w Części S. |
| 03.09.2026 | 1.6 | Dodano 0.6 (adwokat diabła — rozszerzenie trybu Audyt o świadome argumentowanie przeciw głównym decyzjom/założeniom), F.8 (symulacja "co jeśli" przed zatwierdzeniem drogiej decyzji, F.6), T.5 (diff między snapshotami Biblii — widok różnicowy generowany na żądanie), W.6 (kontrola starzenia się treści — nieruszane od dawna dokumenty/decyzje/założenia jako sygnał do sprawdzenia). Dodano do szablonu modułu (H.1) pole "Wpływ na MVP" (oś osobna od gotowości T.1 i kosztu zmiany F.6). Dodano całą **Część X — Testy kodu, code review i inżynieria dla dużych projektów**: X.1 (przykład z H.1 jako formalny test automatyczny, otagowany ID modułu), X.2 (code review jako checklist wprost z pól H.1), X.3 (definicja "Gotowe" dla modułu — test + review + zgodność z kontraktami + aktualna mapa wdrożenia), X.4 (rejestr długu technicznego `dlug-techniczny.md`, Filar A), X.5 (ID Biblii — M#/D# — w commitach i nazwach branchy dla przeszukiwalności historii kodu), X.6 (regresja testów wszystkich zależnych modułów przy zmianie kontraktu poprzecznego G.3). Zaktualizowano szkielet dokumentów (Część S, teraz 12 pozycji) i listę konwencji w P.1. |
| 03.09.2026 | 1.7 | **Pełny audyt z testem obcego czytelnika (W.4) na całości dokumentu (v1.0–v1.6) + kontrola integralności (Część M).** Wynik integralności: bez zastrzeżeń — sekwencja Części 0→X bez luk, wszystkie podsekcje (0.1–0.6, C.1–C.10, F.1–F.8, G.1–G.4, H.1–H.2, I.1–I.5, P.1–P.3, T.1–T.5, U.1–U.3, W.1–W.6, X.1–X.6) numerycznie ciągłe, wszystkie odsyłacze wewnętrzne zweryfikowane jako wskazujące na istniejące sekcje, żadna treść nie zaginęła między wersjami. Test obcego czytelnika na Części 0.4–X.6 (dotąd nieaudytowanych) znalazł 2 usterki, obie naprawione: (1) `dlug-techniczny.md` (S.12, X.4) był błędnie przypisany do Filaru A, niespójnie z każdym innym rejestrem tego typu (rejestr-decyzji, backlog, mapa-wdrożenia, słownik-pojęć — wszystkie Filar C) — poprawiono na Filar C; (2) niespójność typograficzna cudzysłowu w C.10 (polskie „…" zamiast prostego "…" używanego konsekwentnie wszędzie indziej) — ujednolicono. |
| 03.09.2026 | 2.0 | **Integracja z `new-app-standards`** (Standard Architektoniczny i procesowy, dotąd rozwijany w oderwaniu od tej Instrukcji — powstał na osobnym wątku roboczym, stąd wcześniejsze wersje 1.0–1.7 nic o nim nie wiedziały). Przeprowadzono pełną kategoryzację wg Części F.2/I.1 (element po elemencie, 17 rozdziałów Standardu + pliki meta): duplikaty potwierdzające tę samą filozofię innym słownikiem (m.in. rozdz. 15 Standardu ↔ Część D/I/O tej Instrukcji), rozszerzenia (m.in. rozdz. 03.2 `CalcResult` jako gotowa implementacja abstrakcyjnego G.3; rozdz. 05.1 "Zapisuj Seed, nigdy Wynik" jako to samo pojęcie co "Kontrakt zapisu" G.3, wypracowane niezależnie), nowa treść wypełniająca istniejące miejsca (rozdz. 10/11/16 → P.1 "Standardy inżynierskie dla kodu"; rozdz. 08 → pole UI w H.1; rozdz. 09 → rozszerzenie Części K) oraz jedna pozycja wymagająca nowej struktury (model "jeden pakiet źródłowy, kopiowany do każdego projektu" — brak odpowiednika w tej Instrukcji). Dodano **nową Część Y — Warstwa wspólna między projektami**, opisującą Standard jako fundament poprzedzający Krok 0 (nie kolejny poziom hierarchii 0.4), z jawnym rozróżnieniem dwóch pozornie podobnych sytuacji: dryf kodu bez świadomej decyzji (Standard wygrywa automatycznie) vs świadomy konflikt projektu ze Standardem (nigdy nie rozstrzygaj sam, tryb identyczny z F.5). Dopisano odsyłacze do Części Y (adnotacje C.4, bez kasowania/renumeracji istniejącej treści) w: Części A (filtr Biblia→kod dotyczy Filaru B, nie stałego fundamentu technicznego), Kroku 0 i Kroku 5 Części E, Części K, P.1 i P.2. Rozstrzygnięto dwie sprzeczności zgłoszone przy kategoryzacji: (1) wersjonowanie plików — Standard `new-app-standards` zostaje przy wersji w nagłówku (nie w nazwie pliku), C.5 tej Instrukcji dotyczy wyłącznie dokumentów Biblii per-projekt, nie samego Standardu; (2) "kod nadrzędny wobec standardu" (00.1 Standardu) vs "nigdy nie rozstrzygaj konfliktu regułą 'X zawsze wygrywa'" (I.1 tej Instrukcji) — rozwiązane przez rozróżnienie z Części Y.2 (dryf = błąd, wygrywa automatycznie; świadoma decyzja = prawdziwy konflikt, eskaluj). Standard sam pozostaje bez zmian merytorycznych — dostał wyłącznie lekkie odsyłacze zwrotne (README, INDEKS, SKILL, 00-filozofia, CLAUDE.template) do tej wersji Instrukcji. |
| 03.09.2026 | 2.1 | Dodano **Część B.5 — Materiały źródłowe `docs/zrodla/`**: oryginalne materiały dostarczone do pracy nad Biblią (dokumenty, wklejone fragmenty, wcześniej napisana Biblia z innej sesji) przechowywane w niezmienionej formie, tylko do odczytu — jawnie odróżnione od `wiedza-surowa.md` (Krok 3), który jest syntezą tych materiałów, nie ich zamiennikiem. Praktyka przeniesiona z wcześniejszego projektu "Inżynier Szkieletowy PRO", na wniosek właściciela projektu. Dopisano odsyłacze (adnotacje C.4, bez renumeracji) w Kroku 0 i Kroku 3 (Część E) oraz dodano `docs/zrodla/` jako pozycję 13 minimalnego szkieletu dokumentów (Część S, licznik zaktualizowany z dwunastu na trzynaście pozycji). Plik zmienił nazwę zgodnie z własną konwencją C.5 (`...v2_0.md` → `...v2_1.md`) — stara nazwa usunięta, nie duplikowana; wszystkie odsyłacze do niej w `new-app-standards` (README, INDEKS, SKILL, CLAUDE.template, PROMPT_STARTOWY, 00-filozofia) zaktualizowane w tym samym commicie. |
| 03.09.2026 | 2.2 | Dodano **Część B.6 — Lista do zrobienia `docs/lista-do-zrobienia.md`**: bieżąca, operacyjna lista zadań (🔲/🔄/✅/⏳/⚠️), czytana zaraz po `00_Biblia.md` na starcie każdej sesji, żeby AI nie musiało eksplorować całego projektu od nowa. Jawnie odróżniona od `backlog-poza-v1.md` (odłożony zakres produktu, N.2) i `mapa-wdrozenia.md` (status per moduł, T.2) — trzy różne pytania, nie trzy nazwy tego samego. Praktyka wypracowana przy pracy nad `new-app-standards` samym w sobie, przeniesiona tutaj na wniosek właściciela projektu. Dopisano punkt 1.5 do kolejności czytania w P.2 i pozycję 14 do minimalnego szkieletu dokumentów (Część S, licznik z trzynastu na czternaście). Plik zmienił nazwę zgodnie z C.5 (`...v2_1.md` → `...v2_2.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 03.09.2026 | 2.3 | Dodano **Y.5–Y.8**: obowiązek prowadzenia `docs/memory.md` od pierwszej sesji (Y.5), cykliczne sprawdzanie `AKTUALIZACJE.md` źródłowego repo co ≤7 dni z zapisem daty w `docs/memory.md` (Y.6), wykrywanie nieaktualnej/niekompletnej kopii po brakujących plikach z manifestu → pełne odświeżenie kategorii NIETYKALNE, nie tylko brakującego pliku (Y.7), oraz trzy kategorie plików rozstrzygające mechanizm aktualizacji — NIETYKALNE (pełny nadpis), ADAPTOWALNE (porównaj i wnieś tylko poprawki, PATCH nie REWRITE), LOKALNE (poza mechanizmem) — z jawną tabelą przypisania plików (Y.8). Rozwiązuje realny problem: część projektów mogła już zaadaptować pliki standardu pod siebie, więc bezmyślny nadpis niszczyłby świadomą adaptację. Dodano kanał zwrotny `docs/wklad-do-standardu.md` (per projekt, rozproszony) zasilający centralny `docs/god-book/memory.md` (Część U, zaległy od v1.2, założony dopiero teraz) — dopisano wyjaśnienie modelu rozproszonego w U.2. Nowe pliki w `new-app-standards`: `AKTUALIZACJE.md` (log zmian, nigdy nie kopiowany), `docs/wklad-do-standardu.template.md`, `docs/god-book/memory.md`. Plik zmienił nazwę zgodnie z C.5 (`...v2_2.md` → `...v2_3.md`) — stara nazwa usunięta, wszystkie odsyłacze zaktualizowane w tym samym commicie. |
| 04.09.2026 | 2.4 | Dodano **Y.9 — checklist kompletności, obowiązkowa i jawnie raportowana**. Powód: w praktyce AI pracujące nad projektem downstream, przy sprawdzeniu Y.6, odświeżało tylko pliki które rozpoznawało jako już istniejące (typowo `docs/standards/`), i milcząco pomijało resztę pakietu — `docs/zrodla/`, GOD BOOK, szablony `lista-do-zrobienia`/`memory`/`wklad-do-standardu`, czasem `CLAUDE.md` — mimo raportowania "zsynchronizowano". Źródło błędu zlokalizowane w Y.8: kategoria LOKALNE ("poza mechanizmem") była czytana jako "ten plik może zostać nieistniejący", zamiast zamierzonego "treść tego istniejącego pliku zostaje nietknięta". Dopisano adnotacje przy Y.7 (sygnał niekompletnej kopii obejmuje też pliki spoza NIETYKALNE) i Y.8 (LOKALNE rozstrzyga o treści, nigdy o istnieniu — tabela kategorii dopisana o `docs/zrodla/`), oraz nową Y.9 z jawną, wyczerpującą listą 8 elementów (pliki + `docs/zrodla/`), kolumną "jeśli brakuje" per element, i wymogiem pokazania wyniku checklisty właścicielowi projektu przed uznaniem sprawdzenia za zakończone — nie tylko zapisania daty w `docs/memory.md`, ale i wyniku (co uzupełniono). Doprecyzowano też wymóg dla `CLAUDE.md` tworzonego od zera: pola TODO wypełniane realną treścią repo, nie zostawiane jako placeholder. Dopisano do Y.9 dwa przypadki brzegowe zgłoszone przy przeglądzie: (1) `CLAUDE.md` istniejący, ale powstały niezależnie od `CLAUDE.template.md` (sprzed adopcji pakietu) — PATCH znaczy tu dopisanie brakujących obowiązkowych elementów (kolejność czytania, Y.4) do istniejącej struktury, z rozstrzygnięciem dryf-czy-świadoma-decyzja (Y.2) dla ewentualnej sprzecznej kolejności; (2) `README.md` projektu downstream jawnie wyłączony z checklisty — to wyłącznie własność projektu, poza mechanizmem, z jednym wyjątkiem: rozpoznanie omyłkowej kopii `README.md` z `new-app-standards`. Plik zmienił nazwę zgodnie z C.5 (`...v2_3.md` → `...v2_4.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 04.09.2026 | 2.5 | Rozszerzono **Y.9** o pozycję 9 (`01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md`, ADAPTOWALNE, tylko dla projektów z pełną Biblią) i o nazwany wprost przypadek "Biblia już jakoś istnieje". Powód: ten sam błąd co Y.9 dla pojedynczych plików (LOKALNE = "gotowe, nie sprawdzaj"), powtórzony na poziomie całej Części S — istniejąca, choćby lekka Biblia (jeden `docs/memory.md`) bywała dowodem "pełnej synchronizacji", więc reszta checklisty ginęła. Doprecyzowano wiersz 4 tabeli: samo istnienie Biblii nie zwalnia z audytu, ile z 14 pozycji Części S faktycznie jest. Dodano jawne rozgraniczenie zakresu wymuszenia — struktura i brakujące odsyłacze (m.in. wskazanie Y.4 w protokole startu sesji `00_Biblia.md` P.2, kopia rozdz. 10/11/16 w `01_Zasady_Pracy_i_Konwencje.md` P.1) wolno dopisać (PATCH), treść (decyzje, Złote Zasady, rejestr) nigdy. Plik zmienił nazwę zgodnie z C.5 (`...v2_4.md` → `...v2_5.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 04.09.2026 | 2.6 | Dodano **U.4 — zbieranie wkładu bezpośrednio z dysku**. Powód: U.2/U.3 opisywały konsolidację jako w pełni ręczną ("przynoszoną tutaj przez właściciela projektu") — `docs/wklad-do-standardu.md` projektów downstream siedziały biernie, nic nie sygnalizowało `new-app-standards`, że jest coś nowego do skonsolidowania. Nowy mechanizm: rejestr `docs/projekty-downstream.md` (nowy plik, lokalne ścieżki projektów), sesja nad `new-app-standards` czyta z niego `docs/wklad-do-standardu.md` każdego projektu wprost z dysku (read-only), zbiera wpisy `🔎 nowe` i prowadzi normalną konsolidację U.1/U.3. Jawnie zachowana granica: to zmienia tylko sposób, w jaki materiał trafia na stół, nie to, gdzie dzieje się decyzja o promocji (wciąż wyłącznie sesja nad `new-app-standards`) — i nigdy nie obejmuje edycji plików w repo downstream, w tym oznaczenia wpisu jako "przekazane", co wymaga osobnej zgody za każdym razem. Plik zmienił nazwę zgodnie z C.5 (`...v2_5.md` → `...v2_6.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 04.09.2026 | 2.7 | Dodano **N.2 — audyt dwuwarstwowy**, restrukturyzowano Część N w N.1 (dotychczasowa procedura, bez zmian merytorycznych) + N.2 (nowa reguła). Dla Biblii wielorozdziałowej (Część B.3): audyt N.1 wykonywany przyrostowo po każdym rozdziale/Fazie modułów jako wczesny system ostrzegania, ORAZ w pełni na końcu jako celowa, bezwyjątkowa redundancja — druga warstwa nigdy nie pomija tego, co pierwsza już złapała. Źródło: projekt farmer360.io, zebrane przez nowy mechanizm U.4 (pierwsze użycie) — empirycznie audyt jednego rozdziału (9 modułów) znalazł 4 realne problemy wcześnie. Promowane do instrukcji od razu, na wyraźną decyzję właściciela projektu ("musi trafić do wszystkich"), bez czekania na powtórzenie w drugim projekcie — odstępstwo od domyślnego progu U.3 (🔁 powtórzony), uzasadnione tym, że reguła jest wyraźnie uniwersalna (dotyczy każdego projektu ze strukturą dwupoziomową, nie specyfiki farmer360.io). Wpis w `docs/god-book/memory.md` oznaczony ✅ wpisany do instrukcji jako Część N.2. Plik zmienił nazwę zgodnie z C.5 (`...v2_6.md` → `...v2_7.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 04.09.2026 | 2.8 | Rozszerzono **X.4** (rejestr długu technicznego) o kotwiczenie w kodzie. Powód: format TD#/data/ryzyko/priorytet chroni przed "zapomnianym" długiem, ale nie przed rozjazdem rejestru z kodem — wpis może przeżyć naprawę, albo nowy skrót w kodzie może nie mieć odpowiadającego wpisu, i nic w samym TD# tego nie wykrywa. Dodano zalecenie: każdy wpis odpowiada markerowi w źródle (`🔎 TD#`), plik deklaruje się jako indeks nie kopia, audyt (Część N) sprawdza zgodność w obie strony przez `grep`. Źródło: projekt inzynier-szkieletowy-pro, przyniesione przez właściciela projektu (nie przez U.4 — ten projekt nie ma jeszcze potwierdzonego wpisu w `docs/projekty-downstream.md`). Promowane od razu, ta sama logika co N.2 (v2.7) — reguła wyraźnie uniwersalna, dotyczy każdego projektu prowadzącego `dlug-techniczny.md`, nie specyfiki jednego projektu. Plik zmienił nazwę zgodnie z C.5 (`...v2_7.md` → `...v2_8.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 05.09.2026 | 2.9 | Dwa dopiski, oba źródło inzynier-szkieletowy-pro, oba promowane od razu na decyzję właściciela projektu. **(1) T.3**: zamrażanie Biblii na czas dużej partii to teraz jawnie fallback, nie domyślna praktyka przy pracy z AI — agent prowadzący dużą, wieloetapową partię może zgubić ustalenie sprzed kilku kroków tam, gdzie człowiek by pamiętał, więc domyślną praktyką jest synchronizacja per moduł/PR (testy + review + dokumentacja przed kolejnym modułem), okno rozjazdu = jeden moduł, nie cała partia. T.3 zostaje w pełni ważny dla sytuacji, gdzie sync per-moduł faktycznie nie jest wykonalny. **(2) F.7**: pole "na czym się opiera" rejestru założeń Z# kotwiczone w realnym, wymuszanym przez typy grafie zależności modułów w kodzie, gdy projekt taki graf prowadzi — ta sama logika anty-dryfu co X.4 (v2.8), zamiast ręcznie pisanej listy podatnej na rozjazd. Plik zmienił nazwę zgodnie z C.5 (`...v2_8.md` → `...v2_9.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 06.09.2026 | 2.10 | Dodano **N.3** i **Y.10**, oba zebrane przez U.4. N.3 (Część N — Audyt kompletności): bramka przed Krokiem 9 — implementacja żadnego modułu nie zaczyna się osobno, dopóki wszystkie rozdziały Biblii (również świadomie odłożone poza MVP, F.3) i pełny audyt końcowy (N.2) nie są zamknięte. Powód: rozdziały opisane później mogą ujawnić sprzeczność z modułem napisanym wcześniej, czyniąc wczesny kod marnotrawstwem — ta sama kategoria pokusy co N.2 ("pomiń już-sprawdzone"), krok dalej w procesie. Źródło: farmer360.io, przegląd kompletności M1–M17 znalazł realny przypadek (moduł M14 "Giełda", encja `Advert` niedopasowana schematem) zapisany jako D10 w tamtejszym `rejestr-decyzji.md`. Y.10 (Część Y): nowy mechanizm "modułów opcjonalnych pakietu" — elementy `new-app-standards` dotyczące tylko podrodziny projektów (nie każdego projektu rodziny), jawnie odróżnione od Y.9 (obowiązkowa dla wszystkich): nigdy dodawane automatycznie, tylko po jawnym potwierdzeniu, że projekt spełnia warunek. Pierwszy wpis rejestru: playbook przetwarzania materiałów źródłowych (`docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md`) i współdzielona biblioteka norm źródłowych (`docs/biblioteka-norm/`), oba źródło inzynier-offgrid-pro, warunek dodania: projekt przetwarza normy/dokumenty branżowe jako podstawę kalkulatorów. Plik zmienił nazwę zgodnie z C.5 (`...v2_9.md` → `...v2_10.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 07.09.2026 | 2.11 | Poprawka **U.4** (nowy punkt 1a): zawsze `git fetch` + porównanie lokalnego `HEAD` z `origin/main` przed czytaniem `docs/wklad-do-standardu.md` projektu downstream — "czytaj wprost z dysku" nie znaczy "ufaj nieodświeżonemu checkoutowi". Źródło: incydent zero-waste — dwa kolejne sprawdzenia U.4 (04.09, 06.09) raportowały "brak nowości" z pełną pewnością, podczas gdy lokalny checkout był 12 commitów za `origin/main`; po `git fetch` ujawniły się 3 realne, nieskonsolidowane wpisy sprzed kilku dni. Ten sam problem potwierdzony (bez wpływu na treść w tych dwóch przypadkach, ale mechanizmem identyczny) w `inzynier-offgrid-pro` i `inzynier-szkieletowy-pro` przy tej samej okazji. Procedura rozstrzyga też przypadek konfliktu z nieśledzoną lokalną pracą (`git show origin/main:<ścieżka>` zamiast wymuszania scalenia) i przypadek "to nie jest repozytorium git" (odczyt z dysku zostaje jedynym możliwym źródłem, nie jest to obejście). Zalogowane w `docs/god-book/memory.md`, promowane na decyzję właściciela projektu — ta sama logika co N.2/N.3 (kryterium: jednoznacznie uniwersalny błąd mechanizmu, nie kwestia sporna, nie trzeba czekać na powtórzenie). Plik zmienił nazwę zgodnie z C.5 (`...v2_10.md` → `...v2_11.md`) — stara nazwa usunięta, wszystkie odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. |
| 08.09.2026 | 2.12 | Doprecyzowana **0.2**: domyślny poziom stażu przyjmowanej ekspertyzy domenowej to uniwersalnie **20–30 lat doświadczenia** (senior/ekspert), niezależnie od domeny — dotychczas "20-letni staż" był tylko przykładem jednej domeny (architekt budowlany), nie jawnie uniwersalną regułą. Rozszerzona **0.3** (tryby sesji) o granularność — przełączanie trybu w trakcie jednej sesji, nie tylko raz na starcie — jawne przypisanie pisania kodu do trybu Wdrożenie (nigdy Pisanie) i przypięcie konkretnego archetypu specjalisty do każdego trybu (Audyt = niezależny audytor/rewident, Wdrożenie = senior-programista, ten sam ekspert 0.2 w innej "czapce") — źródło: właściciel projektu zapytał, czy sama nazwa trybu wystarczy, czy trzeba wprost dopisać personę z latami doświadczenia; odpowiedź: nazwana rola działa silniej niż etykieta nastawienia, tym samym mechanizmem co 0.2. **Uwaga procesowa:** pierwszy szkic tej wersji wprowadzał w tym celu osobną, nową sekcję 0.7 ("wielopostaciowość" — persona Analityk/Architekt vs Senior-programista) — właściciel projektu zapytał wprost, czy to nie duplikat istniejącej 0.3, co przy sprawdzeniu okazało się trafne (Tryb Audyt ≈ Analityk, Tryb Wdrożenie ≈ Senior-programista); poprawione tego samego dnia, przed commitem, przez rozszerzenie 0.3 zamiast utrzymywania dwóch równoległych mechanizmów (ten sam standard, który rozdz. 15.4/GOD BOOK I.1 każą stosować do treści projektów, zastosowany tu do samej tej instrukcji). Dodane nowe **0.7** (numer zwolniony przez usunięcie duplikatu) — język komunikacji z właścicielem projektu zawsze polski, łącznie z widoczną treścią myślową i opisem wykonywanych czynności; kod źródłowy zawsze angielski, z dopuszczalnym, świadomym wyjątkiem polskich nazw domenowych dla szybszej orientacji w kodzie; pełna specyfikacja: standard rozdz. 15.15. Wzmocniona **Y.4**: obowiązek czytania Standardu/GOD BOOK/Biblii projektu obowiązuje nie tylko na dosłownym starcie sesji, ale przed każdym kolejnym większym zadaniem w jej trakcie (nowy moduł, powrót po streszczeniu/kompaktowaniu kontekstu) i nigdy nie czeka na przypomnienie właściciela projektu. Źródło wszystkich zmian: właściciel projektu, `new-app-standards` — zgłoszenie, że dotychczasowe brzmienie tych zasad (ekspertyza/tryby 0.2–0.3, kolejność czytania Y.4/P.2) było w praktyce stosowane niekonsekwentnie, dopóki nie zostało przywołane wprost w bieżącej rozmowie; ta wersja czyni je jednoznacznie nienaruszalnymi, nie zależnymi od przypomnienia. |
