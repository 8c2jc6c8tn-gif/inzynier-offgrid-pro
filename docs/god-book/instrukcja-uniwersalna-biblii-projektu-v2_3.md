# INSTRUKCJA UNIWERSALNA: Tworzenie i Prowadzenie Biblii Projektu

**Wersja:** 2.3 | **Data utworzenia:** 03.09.2026 | **Ostatnia aktualizacja:** 03.09.2026 | **Status:** ✅ Stabilny
**Zastępuje/konsoliduje:** `jak-stworzyc-biblie-projektu-v1_0.md`, `00_METODOLOGIA_Tworzenie_Biblii_Projektowej_v1_0.md`, `strategia-tworzenia-biblii-projektowej-v1_0.md`, oraz mega-prompt "Knowledge Core Engine". Te trzy dokumenty pozostają w archiwum jako materiał źródłowy uzasadniający poszczególne zasady — ale od teraz **ta instrukcja jest jedynym punktem odniesienia** przy tworzeniu nowej Biblii.
**Od wersji 2.0:** zintegrowana z pakietem `new-app-standards` (Standard Architektoniczny i procesowy wspólny dla naszej rodziny aplikacji) — patrz nowa **Część Y**. Wersje 1.0–1.7 tej Instrukcji powstały w oderwaniu od tego Standardu (osobny wątek roboczy) — stąd część korekt w tej wersji to nie nowa treść merytoryczna, tylko jawne spięcie dwóch dokumentów, które wcześniej o sobie nie wiedziały.
**Od wersji 2.1:** dodana Część B.5 — `docs/zrodla/`, nietykalny katalog oryginalnych materiałów źródłowych, osobny od `wiedza-surowa.md`.
**Od wersji 2.2:** dodana Część B.6 — `docs/lista-do-zrobienia.md`, bieżąca lista zadań czytana zaraz po `00_Biblia.md`, żeby AI nie musiało eksplorować całego projektu na nowo na starcie sesji.
**Od wersji 2.3:** dodane Y.5–Y.8 — obowiązkowość `docs/memory.md`, cykliczne sprawdzanie aktualizacji (`AKTUALIZACJE.md`, co ≤7 dni), wykrywanie nieaktualnej/niekompletnej kopii po brakujących plikach, i trzy kategorie plików (Nietykalne/Adaptowalne/Lokalne) rozstrzygające, jak aktualizować projekt, który mógł już zaadaptować część plików pod siebie. Kanał zwrotny `docs/wklad-do-standardu.md` + `docs/god-book/memory.md` (zaległy z Części U od v1.2, założony dopiero teraz).

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

### 0.3 Tryby sesji — pisanie / audyt / wdrożenie

Niezależnie od ekspertyzy domenowej (0.2, ta zostaje stała przez cały projekt), każda pojedyncza sesja robocza działa w jednym z trzech trybów, które zmieniają **nastawienie** AI, nie jego wiedzę czy kompetencję:

- **Tryb: Pisanie** — generatywny, proponujący; buduje nową treść, wypełnia luki (współpracuje z F.1–F.4)
- **Tryb: Audyt** — sceptyczny, aktywnie szuka dziur, sprzeczności, brakujących elementów (Część N, I.1); domyślne nastawienie: "to jest niekompletne albo błędne, dopóki nie sprawdzę, że nie jest"
- **Tryb: Wdrożenie** — skupiony na zgodności kod↔opis, pilnuje kontraktów (Część G.3) i mapy wdrożenia (T.2)

Tryb ustala się na początku sesji — jawnie, jeśli właściciel projektu go poda, albo **automatycznie**, jeśli z treści polecenia jasno wynika, o co chodzi (np. "sprawdź, czy wszystko się zgadza" = tryb Audyt, bez pytania o potwierdzenie). Domyślny tryb, gdy nic nie wskazuje inaczej: **Pisanie**.

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
Część L. Trzymaj logikę/funkcję i wygląd jako świadomie osobne etapy pracy — dokończ, jak coś ma działać, zanim zajmiesz się, jak ma wyglądać.

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

Na żądanie albo cyklicznie (po dużych partiach integracji, obowiązkowo przed uznaniem Biblii za "gotową do pracy zespołu"):

1. Przejdź **każdy** materiał źródłowy punkt po punkcie, sprawdzając źródła **bezpośrednio**, nie z pamięci wcześniejszych ustaleń — sprawdź, czy odpowiednik faktycznie istnieje w zintegrowanej strukturze. Nie ograniczaj się do "na oko wygląda dobrze".
2. Zbierz wszystkie rozproszone "⏳ na później" w jeden zbiorczy dokument (`backlog-poza-v1.md`, Filar C) — łatwiej planować kolejne fazy.
3. Sprawdź nazewnictwo/branding/wygląd na tyle, by nie blokowały końcówki.
4. Usuń nieaktualne wersje plików z folderu (nie z historii — C.5: nowa wersja natychmiast zastępuje starą).
5. Jeśli audyt znajdzie braki: zgłoś wprost (co brakuje, z jakiego źródła), napraw od razu tym samym trybem co zwykłe dopiski, i zaktualizuj log zmian z jasną notatką, że to wynik audytu, nie zwykłej integracji — buduje to zaufanie do procesu.

Duże integracje (wiele dokumentów naraz) są najbardziej podatne na przeoczenia — audytuj właśnie po nich, nie tylko na końcu.

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

### Y.5 Obowiązek prowadzenia `docs/memory.md`

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Każdy projekt korzystający z tego pakietu **musi** prowadzić `docs/memory.md` (albo pełną Biblię wg Części S, jeśli skala projektu tego wymaga) od pierwszej sesji — to nie jest opcjonalne, niezależnie od rozmiaru czy tempa projektu. Brak tego pliku jest sam w sobie sygnałem niekompletnego wdrożenia pakietu (patrz Y.7).

**Uzasadnienie.** Bez tego pliku każda kolejna sesja (ludzka albo AI) re-eksploruje projekt od zera i powtarza już raz znalezione błędy — dokładnie to, czemu ten cały pakiet ma zapobiegać.

### Y.6 Sprawdzanie aktualizacji — cyklicznie, nie tylko na żądanie

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Projekt sprawdza `AKTUALIZACJE.md` źródłowego repo `new-app-standards` **nie rzadziej niż raz na 7 dni**. Datę ostatniego sprawdzenia zapisuj w `docs/memory.md` (sekcja "Synchronizacja ze standardem"). Brak zapisanej daty = traktuj jak "nigdy nie sprawdzono", zrób pełne sprawdzenie teraz.

`AKTUALIZACJE.md` **nigdy nie jest kopiowany do projektu** — sprawdzany bezpośrednio w źródle (lokalnie, jeśli repo `new-app-standards` jest sklonowane obok, albo zdalnie) — kopia byłaby tym samym problemem, któremu ten mechanizm ma zapobiegać: nieaktualną wersją tego, co ma wykrywać nieaktualność.

**Konsekwencja.** Znajdziesz wpisy nowsze niż Twoja zapisana data → **poinformuj właściciela projektu i zaproponuj konkretne pliki do zaktualizowania** (wg kategorii, Y.8), nigdy nie podmieniaj plików samodzielnie bez pokazania, co się zmieni. To ten sam tryb co każda inna zmiana z zewnątrz źródła (nie decydujemy za człowieka).

### Y.7 Wykrywanie nieaktualnej lub niekompletnej kopii

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`.

**Reguła.** Przy sprawdzeniu (Y.6) porównaj listę plików, które **powinny** istnieć wg aktualnego manifestu (`README.md` tego repo, sekcja "Zawartość") z tym, co faktycznie jest w projekcie. Jeśli brakuje pliku, który manifest wymienia jako część aktualnego pakietu — to silny sygnał, że lokalna kopia powstała **przed jakąś rundą zmian**, nie tylko że brakuje tego jednego pliku.

**Konsekwencja.** W takim wypadku nie ograniczaj się do skopiowania samego brakującego pliku — odśwież **całą kategorię NIETYKALNE** (Y.8) z aktualnej wersji źródła, bo reszta plików tej kategorii najpewniej też jest stara.

### Y.8 Kategorie plików przy aktualizacji

[03.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Ten punkt istnieje, bo część projektów mogła już zaadaptować pliki standardu pod siebie, zanim ten mechanizm powstał — bezmyślny nadpis wszystkiego zniszczyłby tę adaptację tam, gdzie miała prawo istnieć.

**Reguła.** Każdy plik pakietu należy do jednej z trzech kategorii, decydującej o tym, co "aktualizacja" właściwie znaczy:

| Kategoria | Pliki | Co robić przy aktualizacji |
|---|---|---|
| **NIETYKALNE** — zawsze pełny nadpis, zero lokalnej adaptacji | `docs/standards/00–16`, `docs/god-book/instrukcja-uniwersalna-biblii-projektu-*.md`, `PROMPT_STARTOWY.md` | Nadpisz w całości aktualną wersją źródła. Lokalna różnica od źródła w tych plikach to dryf (Y.2), nie świadoma decyzja z prawem do zachowania — napraw, nie negocjuj. |
| **ADAPTOWALNE** — projekt ma prawo je dostosować | `CLAUDE.md` (z `CLAUDE.template.md`), `.claude/skills/standards/SKILL.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md` | Porównaj lokalną wersję ze źródłową, zidentyfikuj co nowego/zmienionego w źródle, wnieś **tylko te poprawki**, zachowaj resztę lokalnej adaptacji (PATCH nie REWRITE). |
| **LOKALNE** — poza tym mechanizmem w ogóle | `docs/memory.md`, `docs/wklad-do-standardu.md`, `docs/lista-do-zrobienia.md`, `00_Biblia.md`, `rejestr-decyzji.md` i cała żywa Biblia | Sync tego nie dotyka — to własność projektu. |

**Kanał zwrotny.** Gdy AI w projekcie natrafi na coś nietrywialnego — błąd, dobrą praktykę, pomysł na nową regułę, warty rozważenia dla całej rodziny aplikacji, nie tylko tego projektu — dopisuje z własnej inicjatywy do `docs/wklad-do-standardu.md` (analogicznie do Części U.2). **Nigdy nie edytuje stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards`, tak jak reszta Części U: `docs/wklad-do-standardu.md` każdego projektu to rozproszone źródła, `docs/god-book/memory.md` w `new-app-standards` to scentralizowany log po konsolidacji.

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
