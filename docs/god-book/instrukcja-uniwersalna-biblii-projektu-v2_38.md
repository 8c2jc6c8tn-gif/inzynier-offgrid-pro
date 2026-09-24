# INSTRUKCJA UNIWERSALNA: Tworzenie i Prowadzenie Biblii Projektu

**Wersja:** 2.38 | **Data utworzenia:** 03.09.2026 | **Ostatnia aktualizacja:** 24.09.2026 | **Status:** ✅ Stabilny
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
**Od wersji 2.18:** cykl sprawdzania rozjazdu skrócony z 7 dni do 3 godzin, w obie strony. **Y.6** — projekt downstream sprawdza `AKTUALIZACJE.md` źródła nie rzadziej niż co 3 godziny (było: co 7 dni), z jawnym zastrzeżeniem że sam zapis w GOD BOOK ustala politykę, nie automatyzuje wyzwalania (wymaga aktywnej sesji albo własnej zaplanowanej Routine tego projektu). **U.4** — sesja nad `new-app-standards` sprawdza wkład wszystkich zarejestrowanych projektów nie rzadziej niż co 3 godziny, zrealizowane jako zaplanowana Routine tej sesji, nie tylko zapis polityki; krok 3 (propozycja/pytanie o promocję) pozostaje bez zmian nawet w trybie automatycznym — automatyzacji podlega wyłącznie wykrycie, nigdy decyzja o promocji. Powód: przy cyklu tygodniowym standard i projekty downstream systematycznie się rozjeżdżały, poprawki czekały dni na ręczne poproszenie.
**Od wersji 2.19:** doprecyzowanie U.4 — pierwszy live test zaplanowanej Routine (16.09.2026) potwierdził, że mechanizm self-bind faktycznie działa (dostarczenie do sesji, z opóźnieniem do końca bieżącej tury, nie błąd), ale ujawnił, że "commit+push bezpośrednio na `main`" z księgowego kroku procedury nie da się wykonać dosłownie w środowisku sesji z zasadą wyznaczonego brancha deweloperskiego (Claude Code Remote) — tam bezpośredni push na `main` jest zablokowany zasadami harnessu niezależnie od GOD BOOK. Dopisek wyjaśnia, że w takim środowisku ta sama intencja (bezzwłoczny zapis stanu bez przeglądu właściciela) realizuje się przez PR + merge z wyznaczonego brancha, nie przez dosłowny bezpośredni push — i że to nie jest odstępstwo od reguły, tylko jedyna dostępna realizacja tej samej reguły pod ograniczeniem środowiska. Nie dotyczy granicy z 15.17 (PR do `new-app-standards` z sesji downstream) — to inne repo, inne ograniczenie.

**Od wersji 2.20:** dodana Y.8, dopisek archiwizacji `docs/wklad-do-standardu.md` — ten sam problem co W.5 (próg rozmiaru dokumentu), zastosowany do kanału zwrotnego: plik jest z zasady append-only (nigdy nie kasujemy wpisów), więc w długo żyjącym projekcie rośnie bez końca, mimo że większość jego treści to już dawno skonsolidowane, zamknięte wpisy — czyniąc go coraz trudniejszym do przeskanowania przy każdym kolejnym U.4. Nowa reguła: cyklicznie przenoś w pełni zamknięte wpisy do osobnego, też append-only `docs/wklad-do-standardu-archiwum.md` tego samego projektu, wykonywane wyłącznie przez sesję nad tamtym projektem (nigdy przez sesję nad `new-app-standards`, ta sama granica co reszta U.4). Źródło: właściciel repo, po obserwacji, że pliki 4 zarejestrowanych projektów downstream urosły do dziesiątek KB.
**Od wersji 2.21:** dopisek do C.5 (nazwy plików i wersjonowanie) — bezpieczna procedura globalnego wyszukaj-zamień przy zmianie nazwy pliku wersjonowanego. Znalezione tego samego dnia, przy przechodzeniu z v2.19 na v2.20: globalne wyszukaj-zamień starej nazwy pliku na nową, wykonane bez ograniczenia zakresu, poprawnie naprawiło bieżące (forward) odsyłacze w plikach typu README/CLAUDE.template, ale przy okazji nadpisało też JUŻ ZAMKNIĘTY, historyczny wiersz `AKTUALIZACJE.md` z 16.09.2026 opisujący WCZEŚNIEJSZE, osobne przemianowanie tego samego pliku — fałszując fakt sprzed czterech dni (ten wiersz zaczął fałszywie twierdzić, że już 16.09 plik nazywał się tak, jak dopiero po zmianie z 20.09). Naprawione dopiskiem KOREKTA w `AKTUALIZACJE.md`, nie nadpisaniem wiersza (append-only). Nowa reguła: przy zmianie nazwy pliku wersjonowanego, wyszukaj-zamień nigdy nie obejmuje wierszy logu zmian (`AKTUALIZACJE.md` i analogicznych) opisujących wcześniejsze, zamknięte, historyczne zdarzenia — tylko pliki z bieżącym, niedatowanym odsyłaczem do starej nazwy.
**Od wersji 2.22:** dodana **Y.11 — audyt zgodności kodu ze standardem**, mechanizm ukierunkowany i świadomie **oddzielny** od cyklu Y.6 (decyzja właściciela projektu, 20.09.2026: łączenie z tanim, 3-godzinnym cyklem Y.6 przeciążyłoby go, bo Y.11 czyta realny kod, nie tylko dwa pliki tekstowe). Sprawdza trzecią rzecz, dotąd nieobsadzoną przez żaden mechanizm: czy wprowadzony i faktycznie używany kod projektu (nie jego dokumentacja — to Y.6; nie kompletność jego testów — to K1–K8, rozdz. 10.5 Standardu) stosuje się do zamkniętej, jawnie wypisanej listy obiektywnie sprawdzalnych reguł architektonicznych standardu (i18n 17.1a, autosave 5.7, rejestracja narzędzi AI 9.0a, kategorie plików Część Y, czystość jądra K7 — rejestr append-only, rozszerzany tylko decyzją właściciela `new-app-standards`). Uruchamiany na żądanie albo na końcu każdej Fazy/Etapu (ten sam punkt co N.2), nigdy w cyklu Y.6. Wynik zawsze w formie raportu ✅/➕/⚠️ (`docs/audyt-zgodnosci-kodu.md`, LOKALNE) — Y.11 nigdy nie naprawia kodu samodzielnie, każde naruszenie wraca do zwykłego trybu pracy z właścicielem projektu przed commitem, bo w odróżnieniu od nadpisu dokumentacji (Y.8), zmiana kodu zmienia zachowanie działającej aplikacji. Źródło: pomysł zgłoszony pierwotnie w jednym z projektów downstream, ale utracony przez przerwanie tamtej sesji limitem (potwierdzone brakiem śladu przy przeszukaniu); odtworzony i sformalizowany na bezpośrednie żądanie właściciela repo. Plik zmienił nazwę zgodnie z C.5 (`...v2_21.md` → `...v2_22.md`, procedurą bezpieczną od v2.21) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.23:** rejestr **Y.11** uzupełniony o pozycję 6 (regułę 9.0 Standardu — AI obowiązkowe w KAŻDYM projekcie, bez zastrzeżenia "dla nowych projektów"). Źródło: zero-waste (U.4), potwierdzone przez sesję nad `new-app-standards` jako realna luka — rejestr Y.11 w wersji 2.22 obejmował 9.0a (rejestracja narzędzi AI, zastrzeżenie "od Etapu 1 dla nowych projektów"), ale nie obejmował samej 9.0 (obowiązek bezwarunkowy) — dokładnie ten sam typ luki, który Y.11 miał zamknąć (audyt przyrostowy Y.6 nigdy nie sprawdza reguł spoza swojego okna diffu), wciąż obecny jeden poziom wyżej, w samym rejestrze. Decyzja właściciela projektu: nie budować osobnego, systematycznego znacznika "reguła bezwarunkowo obowiązkowa" w `AKTUALIZACJE.md`/GOD BOOK odróżniającego takie reguły od reguł "dla nowych projektów" — zbyt wiele wyjątków i przypadków brzegowych, żeby ustalić to teraz jako ogólny mechanizm. Rozwiązanie zostaje punktowe: gdy znajdzie się kolejna podobna reguła pominięta w rejestrze, dopisać ją tak jak tę, nie budować taksonomii z góry. Plik zmienił nazwę zgodnie z C.5 (`...v2_22.md` → `...v2_23.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md`/`docs/lista-do-zrobienia.md` pozostawione bez zmian.

**Od wersji 2.24:** doprecyzowany zakres trzech reguł "od Etapu 1" — źródło: właściciel projektu, bezpośrednia decyzja. **17.1a (i18n), 5.7 (autosave) i 18.1 (logowanie, już wcześniej bez zastrzeżenia) są obowiązkowe w KAŻDYM projekcie rodziny, również już istniejących (zero-waste, inzynier-offgrid-pro, inzynier-szkieletowy-pro, farmer360.io), nie tylko nowo budowanych od zera** — ta sama, wcześniej już ustalona kategoria bezwarunkowej obowiązkowości co 9.0 (rozdz. 09, v2.23). "Od Etapu 1" opisywało dotąd najtańszy MOMENT wdrożenia (im wcześniej, tym taniej), nie granicę OBOWIĄZKU — odczytanie tego jako "dotyczy tylko nowych projektów" (dosłowne brzmienie 17.1a/5.7 w wersjach 2.22/2.23, `AKTUALIZACJE.md` wiersze z 20.09.2026) było zbyt wąskie. Rejestr **Y.11** rozszerzony: pozycja 1 (17.1a) rozdzielona na (a) obecność samego mechanizmu — obowiązkowa wszędzie — i (b) brak nowych naruszeń w zmienionym kodzie, z jawnym zastrzeżeniem, że niepełne pokrycie treścią w trakcie migracji (17.9) nie jest samo w sobie naruszeniem; pozycja 2 (5.7) doprecyzowana analogicznie (brak wzorca w istniejącym projekcie to dług, nie zwolnienie); nowa **pozycja 7** dla 18.1 (dotąd nieobecna w rejestrze). Standard: dopiski w `17-i18n.md` (17.1a), `05-baza-danych-offline.md` (5.7), `18-logowanie.md` (18.1) — wszystkie jako PATCH, oryginalna treść zostaje, nie usunięta.

**Od wersji 2.25:** nowa reguła **17.7b** — przełącznik języka widoczny dla zwykłego użytkownika końcowego w produkcji pokazuje wyłącznie języki ze statusem `reviewed`/pełnym pokryciem treścią (17.7); język w trakcie migracji (17.9) nie jest wybieralny, niezależnie od tego, ile ekranów już ma tłumaczenie. Źródło: właściciel projektu, dopisek do wątku 17.1a (v2.24) — zgłoszona wprost obawa "nie może być, że włączasz angielski, część apki po angielsku a pozostałe po polsku": mocniejszy wymóg niż istniejący zakaz CICHEGO fallbacku (17.7a, który dopuszczał jawnie oznaczony miks języków, np. `⚠ [klucz]`, jako stan zaakceptowany). Sesja przedstawiła tę sprzeczność właścicielowi zamiast rozstrzygać ją sama (15.4) — dwie opcje: (A) niekompletny język ukryty do 100% pokrycia, czy (B) widoczny z ogólną etykietą "beta" bez pokazywania miksu wewnątrz. Wybrana opcja (A). 17.7a zostaje (PATCH, nie usunięcie) — zmienia rolę na zabezpieczenie wewnętrzne dev/QA na czas migracji, nie akceptowany stan produkcyjny. Rejestr **Y.11**, pozycja 1 (17.1a) rozszerzona o podpunkt (c) — selektor języka filtruje wg statusu/pokrycia, nie pokazuje niekompletnego języka użytkownikowi końcowemu. Standard: dopisek w `17-i18n.md` (nowa sekcja 17.7b, PATCH, oryginalna treść 17.7/17.7a zostaje).

**Od wersji 2.26:** rozdz. **13 (droga mobile)** dostał konkretną, nazwaną technologię zamiast generycznego "natywne/React Native" — **Capacitor**, dla całej rodziny projektów, z docelowym podziałem platform (Windows = PWA na stałe, macOS = Capacitor, Android/iOS = Capacitor + sklepy). Źródło decyzji o technologii i podziale platform: właściciel projektu, bezpośrednio, w kontekście rozmowy o eksploracji AI offline (`docs/wiedza-surowa-ai-offline.md`, sekcja 13). Dodana nowa sekcja **13.4** — konkretna recepta wdrożenia Capacitor dla aplikacji Next.js z Route Handlerami (statyczny eksport warstwy prezentacji + wywołania REST do niezmienionego backendu + wtyczki natywne punktowo), oparta na realnym, udokumentowanym rozpoznaniu architektonicznym z projektu zero-waste (`ROADMAP.md`, Grupa 15 — status u źródła: "rozpoznanie zrobione, kod jeszcze nie"), które nigdy wcześniej nie trafiło do `docs/wklad-do-standardu.md` ani do tego standardu, mimo że nazywa dwie realne, udokumentowane ślepe uliczki (statyczny eksport łamiący Route Handlery; `server.url` odradzane przez sam Capacitor i ryzykowne wobec polityki sklepów dla aplikacji-WebView) oraz formalny wymóg App Store (Sign in with Apple, reguła 4.8, jeśli oferowane jest inne logowanie społecznościowe). **Recepta wpisana do standardu ze statusem "wymaga jeszcze weryfikacji w realnym buildzie i wysyłce do sklepu"** — ta sama ostrożność co przy recepcie CSP (07-bezpieczenstwo.md) — na wyraźną decyzję właściciela projektu (nie czekać na pełną weryfikację, żeby cała rodzina od razu widziała tę wiedzę zamiast odkrywać te same ślepe uliczki osobno). Świadomie poza zakresem tej wersji: "jak wyglądać jak natywna" (UI/UX — nawigacja, gesty, status bar) i odporność na błędy sieci przy synchronizacji — nazwane jako osobne, nierozstrzygnięte tematy w nowej sekcji 13.4.

**Od wersji 2.27:** doprecyzowany zakres wymogu "wygląda i działa jak natywna" z rozdz. 13 (v2.26) — właściciel projektu, bezpośrednio: **"Aplikacja ma być natywna, tylko że nie piszemy jej językiem dla natywnej apki (...). Musi mieć wszystkie charakterystyki natywnej aplikacji, niczym się nie różnić."** oraz **"Musi posiadać wszystkie odporności natywnej apki."** Dwa rozstrzygnięcia: (1) **Capacitor jest technologią rodziny NA STAŁE, nie przejściowym krokiem do docelowego pełnego przepisania natywnego** (Swift/Kotlin) — pełne przepisanie zostaje świadomie odłożonym wyjątkiem WARUNKOWYM, uruchamianym wyłącznie przy bardzo dużym popycie uzasadniającym koszt albo przy odrzuceniu aplikacji przez sklep mimo zastosowania się do recepty 13.4 — nie kolejnym, domyślnym krokiem roadmapy rodziny. (2) Do czasu (jeśli w ogóle) zajścia jednego z tych warunków, aplikacja musi być nieodróżnialna od natywnej zarówno w UI/UX, jak i w odporności na błędy sieci/tła. Nowa sekcja **13.5** (checklist Capacitor: StatusBar/safe-area/splash/haptyka/klawiatura/gesty/`isNativePlatform()`, źródło: dokumentacja Capacitor/Capawesome, WebSearch wrzesień 2026) i nowa sekcja **13.6** (odporność sieciowa/tła/wznowienia: fundament już zwalidowany w produkcji w zero-waste — `lib/sync/engine.ts`, kolejka z wykładniczym backoffem, nigdy nieporzucana — Capacitor dokłada wtyczki `@capacitor/network` i `@capacitor/app` jako dodatkowe wyzwalacze wznowienia synchronizacji, `@capacitor/background-runner` jako opcjonalne ulepszenie poza minimalnym wymogiem). Obie sekcje ze statusem "recepta, wymaga jeszcze weryfikacji w realnym buildzie" — ta sama ostrożność co 13.4/CSP. Dopisek w 13.1 zamyka pytanie otwarte w opisie v2.26 ("czy Capacitor jest docelowe na stałe, czy przejściowe") — było niedopowiedziane, teraz jawnie rozstrzygnięte jako "na stałe, z warunkowym wyjątkiem".

**Od wersji 2.28:** rozdz. **13** uzupełniony o pięć brakujących platform/decyzji zgłoszonych przez właściciela projektu w bezpośredniej rozmowie, jedna po drugiej, każda dopisana jako osobny, datowany dopisek do 13.1 — bez naruszania treści v2.26/v2.27. **(1) macOS nie dzieli mechanizmu z Android/iOS** — Capacitor dla desktopu (macOS/Windows/Linux) idzie przez osobną platformę **Capacitor Electron Platform** (Electron/Chromium, nie natywny WebView), z dwiema legalnymi ścieżkami dystrybucji dla macOS (Mac App Store + App Sandbox, albo notaryzacja poza sklepem). **(2) Wybór ścieżki rozstrzygnięty:** właściciel projektu, wprost — *"Mac, będzie jako universal purchase. Więc robimy pod Mac."* — macOS idzie **przez Mac App Store**, nie notaryzację poza sklepem, bo Universal Purchase (3) tego wymaga. **(3) iPad + Universal Purchase** — iPad jako platforma jest trywialny (`TARGETED_DEVICE_FAMILY="1,2"`, zero dodatkowej architektury); Universal Purchase (jeden zakup na iPhone+iPad+Mac) wymaga (a) macOS przez Mac App Store — spełnione przez (2), (b) tego samego bundle ID na wszystkich targetach, (c) wspólnego rekordu aplikacji w App Store Connect — (b)/(c) to konfiguracja do wykonania, nie otwarte pytania; jedyny pozostały punkt 🔎: Apple dokumentuje ten mechanizm najpełniej dla Mac Catalystu, nie dla naszej kombinacji (WebView iOS/iPadOS + Electron macOS) — bez jawnego potwierdzenia, do zweryfikowania wprost w App Store Connect przy pierwszym zgłoszeniu. Przy tej samej okazji: wymóg Xcode 26+/SDK iOS 26 dla zgłoszeń do App Store Connect (obowiązuje od 28.04.2026) to wyłącznie wymóg narzędzia budującego, zero migracji kodu źródłowego czy Capacitora. **(4) Linux — brakująca platforma w tabeli 13.1, dodana i rozstrzygnięta:** Capacitor Electron Platform technicznie obejmuje też Linuksa, co postawiło pytanie architektoniczne (Linux jak macOS, czy jak Windows?) — sesja zarekomendowała Linux=PWA (ten sam status co Windows, bez dodatkowego pipeline'u/podpisywania instalatorów, spójne z 13.3), właściciel projektu potwierdził ("Potwierdzam"); Capacitor Electron zostaje zarezerwowany wyłącznie dla macOS. **(5) Android poza Google Play: Xiaomi GetApps i Huawei AppGallery** — Xiaomi to głównie dodatkowy zasięg (większość urządzeń poza Chinami ma GMS), z nadchodzącym wymogiem weryfikacji tożsamości dewelopera (30.09.2026); Huawei to realna pułapka techniczna — urządzenia Huawei poza Chinami z reguły NIE mają GMS, więc natywne logowanie Google (rozdz. 18 Standardu) nie zadziała niezależnie od zgłoszenia do AppGallery — wniosek architektoniczny: logowanie magic-link/e-mail musi być pełnoprawną, pierwszoplanową opcją, nie zapasową; ten sam problem czeka przy ewentualnych przyszłych powiadomieniach push (FCM wymaga GMS, potrzebny odpowiednik Huawei Push Kit, odłożone do czasu aktualności tematu). Przy tej samej okazji, w sekcji **13.4**: dopisana analiza szans na przyjęcie do sklepu przy poprawnym zastosowaniu recepty — Apple nie odrzuca za sam stack technologiczny, realne ryzyko to Guideline 4.2 (Minimum Functionality), zaadresowane już checklistą 13.5; dla Mac App Store dochodzi niezależny wymóg App Sandbox. Wszystkie zmiany tej wersji to dopiski (PATCH) do istniejących sekcji 13.1/13.4, żadna wcześniejsza treść nie została usunięta ani przepisana; tabela platform w 13.1 zaktualizowana (wiersz macOS: dodana dystrybucja przez Mac App Store; wiersz Windows: "Windows i Linux").

**Od wersji 2.29:** cztery dopiski, wszystkie źródło: inzynier-szkieletowy-pro (U.4, sprawdzenie skonsolidowane 21-23.09.2026), potwierdzone do promocji wprost przez właściciela repo ("potwierdzam promocje wszystkich puktow"). **(1)** `17-i18n.md` 17.6 — encje HTML skopiowane dosłownie z oryginalnego JSX do wartości słownika i18n renderują się jako literalny tekst encji, nie jako znak; reguła: wartości słownika zawsze jako znaki Unicode wprost, nigdy jako encje HTML. **(2)** `17-i18n.md` 17.9 — "moduł po module" zakłada niezależność modułów, ale nie działa bez zmian dla warstwy współdzielonego generatora treści używanego przez kilka jeszcze-nieprzetłumaczonych ekranów naraz; reguła: przed retrofitem pojedynczego ekranu sprawdź, czy renderuje treść z generatora współdzielonego z innymi nieprzetłumaczonymi ekranami — jeśli tak, retrofit tej warstwy jest osobnym zadaniem "wszystkie współdzielające ekrany naraz". **(3)** nowa **N.4** (Część N) — audyt zamknięcia serii retrofitu/migracji modułowej wymaga przebiegu treściowego, nie tylko metadanowego: audyt liczący tylko metadane (status/checklisty per moduł) może dać fałszywe "kompletne", podczas gdy przebieg treściowy (realny grep/skan zawartości) znajduje pozostałe luki; reguła: pełny przebieg narzędziem po całym katalogu plus jawne wypisanie z góry warstw współdzielonych/przekrojowych. Świadomie NIE dodane jako pozycja rejestru Y.11 (Y.11 to zamknięty rejestr obiektywnie grep-sprawdzalnych reguł architektonicznych, to jest zasada metodologiczna prowadzenia audytu zamknięcia, więc trafia do Części N przez analogię do N.2/N.3). **(4)** `17-i18n.md` 17.11 + `docs/przyklady/i18n/check-i18n-guard.mjs` + `docs/przyklady/i18n/README.md` — druga, głębsza martwa strefa tego samego mechanizmu strażniczego: wizytator AST oparty na `ts.isJsxText` jest ślepy na tekst naturalny wewnątrz template-literału osadzonego w wyrażeniu JSX (`<p>{`${wartosc} dni`}</p>`) — luka w samym mechanizmie detekcji, nie w zasięgu sprawdzanych modułów; udokumentowane jako znane ograniczenie (rozszerzenie wymaga dodatkowego filtra kontekstu rodzica, nie zrobione w tej wersji standardu).

**Od wersji 2.30:** dwie zmiany, obie źródło: właściciel repo, bezpośrednia decyzja. **(1)** `17-i18n.md`, nowa **17.7c** — doprecyzowanie, kiedy 17.7b (selektor języka pokazuje wyłącznie języki kompletne, v2.25) faktycznie obowiązuje w pełnym rygorze: **(a)** faza przedpremierowa (projekt jeszcze w budowie, bez realnych użytkowników końcowych, dziś stan wszystkich 4 zarejestrowanych projektów) — przełącznik może pokazywać języki tak jak dziś zaimplementowane, do sprawdzania/testowania w trakcie migracji; **(b)** apka już działająca (realni użytkownicy) + dodanie NOWEGO języka — ukryty w trakcie tłumaczenia (17.7b w pełnym rygorze), po publikacji widoczny z etykietą "beta" przez pierwszy miesiąc, sygnalizującą wciąż trwające dopracowywanie, nie niekompletność treściową. Rejestr **Y.11** pozycja 1(c) rozszerzona o ten wyjątek fazowy. **(2)** Cykl sprawdzania aktualizacji wydłużony z 3 do **12 godzin**, w obie strony (Y.6 i U.4 — ta sama decyzja, ten sam powód: koszt uwagi przy cyklicznych odpaleniach bez nowej treści przewyższył korzyść z szybszej wykrywalności przy obecnym tempie). Zaplanowana Routine tej sesji dla U.4 przestawiona na `*/12` w tej samej sesji; trzy Routine projektów downstream z już skonfigurowanym cyklem (zero-waste, farmer360.io, inzynier-szkieletowy-pro) sprawdzone jako już działające na `*/12` niezależnie od tego zapisu.

**Od wersji 2.31:** nowa **Y.12** — pierwszy realny przypadek kolizji reguły Standardu ogłoszonej jako "na stałe dla całej rodziny" (rozdz. 13, Capacitor, 22.09.2026) z wcześniejszą, świadomą i uzasadnioną decyzją stacku pojedynczego projektu (D2, Flutter, farmer360.io, 03.09.2026), zgłoszony przez U.4 (23-24.09.2026). Doprecyzowuje Y.2 przypadek 2 dla tego konkretnego podtypu: **decyzja "na stałe" wygrywa domyślnie** (projekt migruje, formalny wyjątek Y.2 nie jest tu domyślnym rozwiązaniem), a **test Spike** — czasowo ograniczony kod eksploracyjny, jawny wąski wyjątek od bramki N.3, wymagający osobnej zgody właściciela projektu za każdym uruchomieniem — staje się ustandaryzowaną metodą rozstrzygania technicznych wątpliwości co do SZCZEGÓŁÓW wdrożenia w przyszłych, analogicznych przypadkach (progi zdał/nie zdał ustalone przed uruchomieniem, wynik zapisywany jako D# w `rejestr-decyzji.md` projektu). Dla samego przypadku D2/farmer360.io spike nie był uruchamiany — pierwszeństwo Standardu rozstrzygnęło migrację wprost; sporne ryzyka techniczne (WebView vs dostępność, wtyczki BLE) przechodzą do etapu wdrożenia recepty 13.4/13.5. Formalizuje też odpowiedź na pytanie właściciela repo o "bibliotekę przypadków" — `docs/god-book/memory.md` (U.1) pełni tę rolę, Y.12 to promocja metody po pierwszym przypadku (U.3), bez czekania na powtórzenie (ta sama logika co N.2/N.3). Źródło: właściciel repo, bezpośrednia decyzja, 24.09.2026. Plik zmienił nazwę zgodnie z C.5 (`...v2_30.md` → `...v2_31.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md`/`docs/lista-do-zrobienia.md` pozostawione bez zmian.

**Od wersji 2.32:** KOREKTA tego samego dnia — pierwszy zapis **Y.12** (v2.31, wyżej) błędnie stwierdzał, że reguła "na stałe dla rodziny" wygrywa domyślnie i że dla D2/farmer360.io spike nie jest uruchamiany (decyzja Capacitor wprost). Błąd: mechaniczne przypisanie jednej odpowiedzi właściciela repo ("2C, ale zmusić najpierw wszystkich do 2B, a potem już z czasem mogą sobie oddzielnie ustalić") do pytania o D2/Spike, podczas gdy ta konkretna odpowiedź dotyczyła w rzeczywistości **innego, równolegle zadanego pytania** — mechanizmu cyklu U.4/Y.6 (patrz Y.6 niżej, dopisek [24.09.2026]). Właściciel repo doprecyzował wprost obie sprawy osobno. Poprawiona treść **Y.12**: dla D2/farmer360.io wybrana jest opcja "spike rozstrzyga przed decyzją" (pierwotnie zgłoszona przez farmer360.io jako opcja C) — pełna procedura (4 scenariusze testowe z progami ustalonymi przed startem, time-box 1-3 dni, reguła decyzyjna: przejście wszystkich progów → migracja, niespełnienie choć jednego, zwłaszcza dostępności → formalny wyjątek) zatwierdzona przez właściciela repo, ale D2 **pozostaje otwarte** do czasu faktycznego wyniku spike'a — spike jeszcze nieuruchomiony, wymaga osobnej zgody za każdym razem (N.3). Protokół pisany teraz, przed zakończeniem pierwszego przypadku, na wyraźne życzenie właściciela repo, ze świadomym zastrzeżeniem korekty po realnych testach. Plik zmienił nazwę zgodnie z C.5 (`...v2_31.md` → `...v2_32.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie. Ta korekta nastąpiła przed jakąkolwiek synchronizacją do `origin/main`/projektów downstream (błędna wersja istniała wyłącznie na branchu roboczym tej sesji) — żaden projekt rodziny nie mógł jej jeszcze przeczytać.

**Od wersji 2.33:** rozszerzona **B.6** (lista do zrobienia) o obowiązkowy format pól per wpis — priorytet, co odblokowuje, plusy/minusy zrobienia teraz, kolizje z innymi zadaniami listy (żeby kilka sesji mogło świadomie podzielić pracę), kolejność wykonania względem zadań powiązanych (duże zadanie przed mniejszymi zależnymi od niego, żeby nie poprawiać dwukrotnie). Dodana też nowa **15.21/15.22** do standardu (rozdz. 15): deklaracja stanu commit/push/PR/merge zawsze jako ostatnie zdanie odpowiedzi, nigdy w środku/na początku. Źródło obu: właściciel repo, bezpośrednia decyzja, 24.09.2026 — powód: koordynacja kilku projektów/sesji naraz wymaga stałego, przewidywalnego miejsca na stan repo i pełnego kontekstu planowania w liście zadań, bez przeszukiwania całej odpowiedzi/historii czatu za każdym razem. Plik zmienił nazwę zgodnie z C.5 (`...v2_32.md` → `...v2_33.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.34:** format "świadomy wyjątek projektu" (**Y.2**, dopisek) — wpis D# z jawnym nagłówkiem "WYJĄTEK OD REGUŁY RODZINY", czterema polami (uzasadnienie/data/zakres/czasowość), rejestrowany centralnie w `docs/god-book/memory.md` (nowa stała sekcja "Rejestr świadomych wyjątków od reguł rodziny"); **Y.11** sprawdza ten rejestr przed oznaczeniem rozbieżności jako naruszenia. Nowy krok w **U.3** — sesja nad `new-app-standards` sama sprawdza `docs/projekty-downstream.md`/rejestry decyzji projektów pod kątem kolizji PRZED akceptacją reguły ogłaszanej jako "na stałe dla całej rodziny" (nie po fakcie, jak przy D2/rozdz. 13). Źródło obu: farmer360.io (U.4, zgłoszenie 23.09.2026) + luka zostawiona otwarta przez Y.12 (v2.32), rozstrzygnięte przez właściciela repo 24.09.2026 ("1 wprowadzamy. A drugi, downstream przeprowadzamy my przed akceptacją na przypadek kolizji."). Plik zmienił nazwę zgodnie z C.5 (`...v2_33.md` → `...v2_34.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.35:** nowy punkt 7 w **Część D** — rozróżnienie "zachowanie informacji" (punkty 1-3, już obowiązywały) od "poprawność merytoryczna materiału źródłowego" (nowe): plik w `docs/zrodla/` zostaje nietknięty, ale poprawka merytoryczna (liczba, obliczenie, twierdzenie) trafia do dokumentu Biblii, który faktycznie przenosi treść dalej, z jawną adnotacją ze znacznikiem ✏️ (co podało źródło / na co poprawiono / dlaczego / podstawa) i poziomem pewności ✅/🔎; Krok 8 (N.1) sprawdza kompletność tych adnotacji przy zwykłym przebiegu audytu. Odpowiadający dopisek **15.1a** w standardzie (rozdz. 15) — "źródło prawdy o tym, co powiedziano" ≠ "prawda w dziedzinie". Źródło: farmer360.io (U.4, D21 tamtego projektu — materiał źródłowy podał prawdopodobnie błędną stawkę VAT RR, 7%/3% zamiast jednej 7%, i błędnego wystawcę faktury), pytanie właściciela repo o różnicę między adnotacją w Biblii a zapisem procesowym gdzie indziej, rozstrzygnięte 24.09.2026: "Źródło zostawiamy jak jest, ale Biblię już redagujemy i zostawiamy [adnotację]." Plik zmienił nazwę zgodnie z C.5 (`...v2_34.md` → `...v2_35.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.36:** rozszerzenie punktu 7 Części D i nowy dopisek **15.1b** w standardzie — weryfikacja merytoryczna materiału (wersja 2.35, wyżej) nie jest ograniczona do momentu transferu do Biblii (Krok 3/6/7): AI porównuje ze swoją wiedzą ekspercką każdą podawaną mu informację przez cały czas pracy (polecenie, materiał źródłowy, wcześniejszy zapis, stwierdzenie w rozmowie) i zgłasza wprost rozjazd z rzeczywistością, nie tylko przy liczbach/obliczeniach — obejmuje każde stwierdzenie merytoryczne, i nie milczy z obawy przed sprzeciwieniem się poleceniu. Materiał pochodzący z innej sesji/narzędzia AI dostaje podwyższoną czujność (łańcuch AI→AI→Biblia bez naturalnego punktu kontroli człowieka), żeby niepoprawna informacja/dane nie były przekazywane dalej. Źródło: właściciel repo, bezpośrednie rozszerzenie żądania z wersji 2.35, ten sam dzień. Plik zmienił nazwę zgodnie z C.5 (`...v2_35.md` → `...v2_36.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.37:** nowa **H.3 — kolizja ID (M#/D#) przy równoległych sesjach**. Dwie sesje AI pracujące równolegle nad tym samym projektem, każda z nieodświeżonej lokalnej kopii, mogą nadać ten sam kolejny numer M#/D# — kolizja ujawnia się dopiero przy scalaniu (realny przypadek: 225 odwołań w 14 plikach do przenumerowania). Trzy elementy, w kolejności działania w cyklu pracy: **(a)** przed nadaniem nowego numeru — sprawdź najwyższy zajęty numer na gałęzi głównej (`git fetch` + porównanie, ta sama dyscyplina co U.4 (1a)/Y.6 (1a)); **(b)** przy scalaniu — jawnie sprawdź kolizje ID, nie tylko konflikty tekstowe Gita (dwa różne wpisy z tym samym numerem w różnych plikach nie tworzą konfliktu scalenia); **(c)** jeśli kolizja mimo to wystąpi — zasada domyślna "pierwszy scalony zachowuje numer", drugi wpis dostaje przenumerowanie z wpisem w logu zmian (I.5). Dotyczy obu rejestrów tym samym mechanizmem (M#, H.2; D#, Krok 4/F.5). Źródło: farmer360.io (U.4, zgłoszenie 24.09.2026, 225 odwołań w 14 plikach), wszystkie trzy elementy potwierdzone przez właściciela repo do wprowadzenia w kolejności a→b→c. Plik zmienił nazwę zgodnie z C.5 (`...v2_36.md` → `...v2_37.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

**Od wersji 2.38:** KOREKTA sprzeczności Y.6 vs Y.8, ujawnionej w praktyce — sesja przygotowująca gotowy tekst do wklejenia dla nowej Routine Y.6 (inzynier-offgrid-pro/inzynier-szkieletowy-pro) zacytowała dosłownie zdanie "Konsekwencja" z Y.6 ("nigdy nie podmieniaj plików samodzielnie bez pokazania, co się zmieni") i efektem był projekt każący pytać właściciela repo o KAŻDĄ podmianę pliku, łącznie z NIETYKALNE — mimo że Y.8 dla tej kategorii mówi wprost "napraw, nie negocjuj", bez pytania. Dwa zdania tego samego dokumentu, dwie różne reguły dla tego samego przypadku — właściciel repo to zgłosił, rozstrzygnięcie (nie moje własne, zgodnie z 15.4): Y.8 ma pierwszeństwo, Y.6 doprecyzowana, żeby nie sugerowała inaczej — patrz dopisek "[24.09.2026] ✅ KOREKTA" wprost w treści Y.6 niżej, oryginalne zdanie zostaje widoczne, nie skasowane. Źródło: właściciel repo, bezpośrednie zgłoszenie regresu ("wcześniej aktualizacja działała automatycznie... teraz zabrania się cokolwiek podmieniać... miało być jak wcześniej, na automacie"). Plik zmienił nazwę zgodnie z C.5 (`...v2_37.md` → `...v2_38.md`) — stara nazwa usunięta, wszystkie bieżące odsyłacze w `new-app-standards` zaktualizowane w tym samym commicie, wiersze historyczne `AKTUALIZACJE.md` pozostawione bez zmian.

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

[24.09.2026] ✅ DODANO — źródło: właściciel repo, bezpośrednia decyzja, 24.09.2026. Pełna specyfikacja: standard 15.22.

**Rozszerzenie formatu — pola obowiązkowe per wpis, nie tylko status.** Na koniec każdego zadania lista zostaje **żywa** (stan bieżący, nie migawka sprzed sesji) i każdy wpis zawiera, obok statusu wyżej: **priorytet** (jawnie nazwany, nie tylko pozycja); **co odblokowuje** (jakie inne zadanie/decyzję/etap otwiera po zamknięciu — albo wprost "nic"); **plusy/minusy zrobienia teraz** (co zyskujemy robiąc teraz, co tracimy odkładając, i odwrotnie); **kolizje z innymi zadaniami listy** (te same pliki/moduły/decyzje co inny otwarty wpis — żeby dwie sesje mogły świadomie podzielić pracę bez nadpisywania się nawzajem; brak kolizji też zapisany wprost, nie domyślnie pusty); **kolejność względem zadań powiązanych** (duże zadanie przed mniejszymi, zależnymi od niego — żeby uniknąć poprawki drobnego zadania przed zamknięciem dużego, a potem powtórnej poprawki po nim). Powód: właściciel repo koordynuje kilka projektów/sesji naraz — lista bez tych pól zmusza każdą kolejną sesję do odtwarzania tego kontekstu z pamięci albo z historii czatu, dokładnie to, co B.6 miało wyeliminować.

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
- **Zmiana nazwy pliku — bezpieczny zakres wyszukaj-zamień (od v2.21).** Globalne wyszukaj-zamień starej nazwy pliku na nową obejmuje wyłącznie pliki z bieżącym, niedatowanym odsyłaczem (np. README, CLAUDE.md, skille, indeksy) — **nigdy** wiersze logu zmian (`AKTUALIZACJE.md` i analogicznych append-only dzienników), które opisują wcześniejsze, zamknięte, historyczne zdarzenia pod konkretną datą. Taki wiersz mówi, jak plik nazywał się TAMTEGO dnia — nadpisanie go nową nazwą fałszuje fakt historyczny, nie naprawia odsyłacza. Znalezione 20.09.2026: rename v2.19→v2.20 nadpisał w ten sposób wiersz `AKTUALIZACJE.md` z 16.09.2026, opisujący wcześniejsze, osobne przemianowanie tego samego pliku.
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

[24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4, D21 tamtego projektu), doprecyzowanie właściciela repo.

7. **Zachowanie informacji ≠ poprawność merytoryczna materiału źródłowego.** Punkty 1-3 wyżej chronią przed utratą/cichym przepisaniem treści — nie mówią nic o tym, czy treść materiału źródłowego jest merytorycznie poprawna (zgodna z prawem, rachunkiem, wiedzą branżową). Materiał w `docs/zrodla/` (Krok 0) jest źródłem prawdy o tym, **co zostało powiedziane**, nie o tym, **co jest prawdą w dziedzinie** — AI (jako ekspert domenowy, Część 0.2) zawsze weryfikuje liczby, obliczenia i twierdzenia merytoryczne PRZED przeniesieniem ich do Biblii, niezależnie od tego, że punkt 1 każe traktować materiał źródłowy jako "istniejący stan projektu". Dosłowne, niekrytyczne przeniesienie błędu merytorycznego nie jest "zachowaniem informacji" w sensie punktów 1-3 — jest ich nadużyciem.

   **Gdzie i jak.** Plik w `docs/zrodla/` zostaje nietknięty — nic się tu nie zmienia, dokładnie jak przy każdej innej treści (punkt 1). Poprawka trafia do dokumentu Biblii, który faktycznie przenosi tę treść dalej (`wiedza-surowa.md` przy syntezie z Kroku 3, albo bezpośrednio moduł z Kroku 6/7 — zależnie od etapu, na którym błąd zostanie zauważony) — zapisana z jawną, wyszukiwalną adnotacją: znacznik **✏️**, co podało źródło, na co poprawiono, dlaczego, podstawa (przepis / przeliczenie / przykład / norma), poziom pewności (✅ zweryfikowane / 🔎 do potwierdzenia eksperckiego). Ten sam format co "nie usuwaj — oznacz" (punkt 3 wyżej, standard 15.3) — poprawka merytoryczna to nazwany, częsty przypadek tej samej zasady, nie osobny mechanizm.

   **Audyt.** Krok 8 (Część N, N.1) sprawdza przy zwykłym przebiegu, czy oznaczenia ✏️ mają komplet czterech pól i czy wpisy 🔎 nie utrzymują się bez planu domknięcia — jeden przebieg wystarcza, znacznik jest wyszukiwalny (grep) jak każdy inny status tej Części.

   **Uzasadnienie.** Farmer360 (D21, materiał #40): materiał źródłowy podał prawdopodobnie błędną stawkę zwrotu VAT RR (dwie stawki, 7%/3%, zamiast jednej 7%) i błędnego wystawcę faktury. Dosłowne przeniesienie do Biblii utrwaliłoby zaniżony zwrot (55,20 zł straty w przykładzie), a testy pisane z przykładów źródła "potwierdziłyby" błąd. Reguła "materiał jest źródłem prawdy" (standard 15.1), czytana dosłownie, zachęca do przenoszenia takich błędów bez weryfikacji — rozróżnienie wyżej nie osłabia 15.1 (informacja nadal się nie gubi, źródło zostaje nietknięte), tylko dodaje krok, którego 15.1 nie nazywało wprost: weryfikację poprawności.

   **Rozszerzenie: nie tylko przy transferze do Biblii, przez całą pracę.** [24.09.2026] ✅ DODANO — źródło: właściciel repo, na wyraźne żądanie po powyższym. Weryfikacja opisana wyżej nie jest ograniczona do jednego momentu (Krok 3/6/7) — AI porównuje ze swoją wiedzą ekspercką KAŻDĄ podawaną mu informację przez cały czas pracy (polecenie właściciela projektu, materiał źródłowy, wcześniejszy zapis w dokumentacji, dowolne stwierdzenie w rozmowie) i zgłasza wprost, jeśli widzi rozjazd z aktualną rzeczywistością/branżą/prawem/technologią — nie milczy z obawy przed sprzeciwieniem się poleceniu czy materiałowi. Materiał, który sam pochodzi z innej sesji/narzędzia AI, dostaje podwyższoną czujność (łańcuch AI→AI→Biblia nie ma naturalnego punktu kontroli człowieka) — pełna specyfikacja, w tym mechanizm zgłoszenia rozjazdu w bieżącej rozmowie (nie tylko przy zapisie do dokumentu): standard **15.1b**.

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

### H.3 Kolizja ID (M#/D#) przy równoległych sesjach

Problem realny, nie teoretyczny: dwie (lub więcej) sesje AI pracujące równolegle nad tym samym projektem, każda z własnej, nieodświeżonej kopii repo, nadają kolejny wolny numer — M# dla modułów (H.2), D# dla decyzji (Krok 4) — licząc od tej samej, już nieaktualnej wartości najwyższego zajętego ID. Kolizja (dwa różne wpisy z tym samym numerem) nie ujawnia się od razu — dopiero przy scalaniu gałęzi, i wtedy bywa kosztowna (realny przypadek: 225 odwołań do numeru w 14 plikach wymagających przenumerowania).

Trzy elementy mechanizmu, w kolejności, w jakiej działają w realnym cyklu pracy — zapobieganie przed detekcją przed rozstrzygnięciem:

a) **Przed nadaniem nowego numeru** — sprawdź najwyższy zajęty numer (M# albo D#, zależnie od typu) na gałęzi głównej, nie tylko w swojej lokalnej, potencjalnie nieodświeżonej kopii (`git fetch` + porównanie z `origin/<gałąź główna>` — ta sama dyscyplina co U.4 (1a)/Y.6 (1a)). Zmniejsza ryzyko kolizji u źródła, ale nie eliminuje go całkowicie — dwie sesje mogą sprawdzić w tej samej chwili, obie zanim którakolwiek scali swoją pracę.

b) **Przy scalaniu** — jawnie sprawdź kolizje ID, nie tylko konflikty tekstowe. Dwa wpisy `M14`/`D14` dodane w różnych plikach albo różnych miejscach tego samego pliku nie muszą tworzyć konfliktu scalenia Gita, więc scalenie może przejść bez ostrzeżenia mimo realnej kolizji numeracji — sprawdzenie musi być świadome, celowane w numerację (przeszukaj wszystkie ID danego typu po scaleniu, wykryj duplikat), nie poleganie na tym, że sam Git by to złapał.

c) **Jeśli kolizja mimo (a)/(b) mimo to wystąpi** — zasada domyślna: **pierwszy scalony zachowuje numer**, drugi wpis dostaje przenumerowanie na kolejny wolny numer w momencie wykrycia, z wpisem w logu zmian (I.5) wskazującym starą i nową wartość, żeby żaden odsyłacz do przenumerowanego ID nie został osierocony.

Dotyczy obu numerowanych rejestrów tym samym mechanizmem — M# (H.2) i D# (Krok 4/F.5) rosną tą samą metodą "kolejny wolny numer", więc obie są podatne na ten sam błąd i obie chroni ta sama procedura.

[24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4), realny przypadek kolizji numeracji M#/D# przy równoległych sesjach AI (225 odwołań w 14 plikach do przenumerowania). Decyzja właściciela repo: wszystkie trzy elementy (a)/(b)/(c) wprowadzone jako obowiązkowe.

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

### N.4 Audyt zamknięcia serii retrofitu/migracji modułowej wymaga przebiegu treściowego, nie tylko metadanowego

[23.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, D106). Ta sama kategoria pokusy co N.2/N.3 ("pomiń już-sprawdzone"), tym razem zastosowana nie do Biblii, tylko do **dowolnej serii retrofitu/migracji modułowej w kodzie** (nie tylko i18n — dowolna migracja "moduł po module": dodanie pola, zmiana kontraktu, refaktor wzorca, dowolny wzorzec 17.9-podobny).

**Przypadek, który uzasadnił regułę.** Retrofit i18n→autosave→AI tego projektu zamykał się seryjnie "moduł po module", z zamknięciem dokumentowanym nagłówkiem "Moduł #N — ZAMKNIĘTY" + wpisem w rejestrze decyzji + potwierdzeniem, że narzędzie AI istnieje w rejestrze. Audyt zamykający całą serię polegał na dwóch metodach, **obie metadanowe**: (a) grep potwierdzający, że każdy moduł jest czytany przez jakiekolwiek narzędzie AI, (b) policzenie nagłówków "Moduł #N — ZAMKNIĘTY" i zmapowanie ich na wszystkie nazwy modułów. Obie dały "kompletne, zero luk". Dopiero **ponowny audyt treściowy** — faktyczne uruchomienie parsera TS/JSX na **całym** katalogu docelowym (nie tylko liście modułów z istniejącego skryptu-strażnika) i ręczna weryfikacja każdego trafienia w kontekście — wykrył: (1) dwa ekrany **przekrojowe** (nienależące do żadnego pojedynczego zamknięcia modułu — rozdzielnik, kreator wieloetapowy), nigdy dotknięte mimo że jeden był planowany explicite; (2) jedną punktową regresję wewnątrz formalnie zamkniętego pliku; (3) mechanizm strażniczy i18n nigdy nieaktualizowany o pliki zmigrowane w całej serii, mimo udokumentowanego obowiązku w komentarzu tego samego pliku.

**Reguła.** Sama LICZBA zamkniętych pozycji i ISTNIENIE artefaktu (plik/test/wpis w rejestrze) dowodzi tylko, że PROCES zamknięcia się odbył — nie że TREŚĆ jest kompletna. Seria retrofitu/migracji modułowej kończy się pełnym zamknięciem dopiero po:
1. jednym dodatkowym przebiegu narzędzia analizującego CAŁY katalog docelowy (nie tylko listę modułów uwzględnionych w mechanizmie strażniczym/rejestrze zamknięć), i
2. jawnym wypisaniu na starcie serii ekranów/plików PRZEKROJOWYCH (niebędących własnością żadnego pojedynczego modułu — rozdzielniki, wizardy, wspólne layouty, wspólne generatory treści, patrz 17.9 standardu) jako osobnej pozycji kolejki, nie zakładaniu, że "przy okazji ktoś je zrobi".

Ekrany przekrojowe systematycznie wypadają z serii zamknięć modułowych, bo nikt formalnie nie jest za nie odpowiedzialny w żadnej pojedynczej turze — to nie przypadek jednego projektu, tylko strukturalna luka każdej serii "niezależnych zamknięć + nagłówek potwierdzający".

**Relacja z N.2/N.3.** N.2 dotyczy audytu Biblii (dokumentacji), N.3 bramkuje start implementacji przed zamknięciem Biblii — N.4 dotyczy audytu zamknięcia serii zmian już wprowadzonych w KODZIE (retrofit/migracja), trzeci, osobny punkt tej samej kategorii pokusy "pomiń już-sprawdzone", tym razem po stronie Y.11 (audyt zgodności kodu), nie N.1/Y.9 (audyt dokumentacji).

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

**Inwentaryzacja downstream przed akceptacją reguły "na stałe dla całej rodziny".** [24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4), po incydencie D2/rozdz. 13 (kolizja wykryta dopiero przy synchronizacji, nie przed ogłoszeniem reguły — patrz Y.12). Zanim sesja nad `new-app-standards` zamknie promocję reguły jawnie oznaczonej jako wiążąca na stałe dla całej rodziny (nie zwykły punktowy dopisek do standardu — reguła tego kalibru co rozdz. 13/Capacitor), **sesja sama** (nie projekty downstream) sprawdza `docs/projekty-downstream.md` i, dla każdego zarejestrowanego projektu, jego `rejestr-decyzji.md` (ten sam mechanizm odczytu co U.4 — `git fetch` + odczyt z `origin/main`) pod kątem istniejących, uzasadnionych decyzji D# kolidujących z nową regułą. Kolizja znaleziona przed akceptacją: pokaż ją właścicielowi repo razem z propozycją reguły (15.4 — nie rozstrzygaj sam, czy reguła mimo kolizji wchodzi w życie), zamiast promować regułę i dowiadywać się o kolizji dopiero z następnego sprawdzenia U.4/Y.6. Brak kolizji: odnotuj krótko przy wpisie w `memory.md` ("sprawdzono `docs/projekty-downstream.md`, brak kolizji") — to samo w sobie jest częścią dowodu, że reguła została wprowadzona świadomie, nie w ślepo.

### U.4 Zbieranie wkładu bezpośrednio z dysku — rejestr projektów downstream

[04.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Powód: U.2/U.3 opisują konsolidację jako w pełni ręczną — "przynoszoną tutaj przez właściciela projektu". W praktyce to oznaczało, że `docs/wklad-do-standardu.md` poszczególnych projektów siedziały biernie, nic nie sygnalizowało `new-app-standards`, że coś nowego czeka, i konsolidacja działa się tylko wtedy, gdy właściciel pamiętał, żeby fizycznie skopiować treść między sesjami. Ten punkt nie zmienia *gdzie* dzieje się decyzja o promocji (to wciąż wyłącznie sesja nad `new-app-standards`, Y.8/U.3, bez zmian) — zmienia tylko *jak* materiał do tej decyzji trafia na stół.

**Reguła.** Gdy wszystkie projekty downstream i `new-app-standards` są sklonowane lokalnie obok siebie (ten sam katalog nadrzędny) — sesja nad `new-app-standards` może **aktywnie czytać** `docs/wklad-do-standardu.md` każdego z nich wprost z dysku, zamiast czekać, aż ich treść zostanie ręcznie przyniesiona. Warunek: rejestr `docs/projekty-downstream.md` (w tym repo) — lista lokalnych ścieżek projektów korzystających z pakietu, utrzymywana przez właściciela (dopisywana, gdy projekt adoptuje pakiet po raz pierwszy, GOD BOOK README "Jak użyć w nowym projekcie"). Bez wpisu w rejestrze AI nie zgaduje, gdzie na dysku szukać — nie skanuje całego systemu plików.

**Procedura** (na żądanie — "sprawdź wkład ze wszystkich projektów" — albo cyklicznie, **nie rzadziej niż co 12 godzin** ([23.09.2026] było: co 3 godziny — patrz dopisek niżej i Y.6, ten sam powód/decyzja), U.3):
1. Wczytaj `docs/projekty-downstream.md`, dla każdego wiersza ze ścieżką lokalną sprawdź, czy `docs/wklad-do-standardu.md` tego projektu istnieje na dysku.
1a. [07.09.2026] ✅ DODANO — źródło: incydent zero-waste (`docs/god-book/memory.md`, wpis 07.09.2026 "mechanizm U.4 samego pakietu"). **Zanim cokolwiek przeczytasz — `git fetch` w tym checkoucie, potem porównaj lokalny `HEAD` z `origin/main` (`git log HEAD..origin/main`).** "Czytaj wprost z dysku" (Reguła wyżej) nie znaczy "ufaj temu, co tam już leży" — lokalny checkout mógł nie być pociągnięty od dawna, a wtedy krok 2 czyta nieaktualny stan i **z pełną pewnością siebie raportuje "brak nowości"**, mimo realnych, nieskonsolidowanych wpisów na `origin/main`. Jeśli lokalny `HEAD` jest w tyle: pociągnij (`git merge --ff-only origin/main`), a jeśli to niemożliwe bez ryzyka dla nieśledzonej lokalnej pracy (working tree ma konflikt) — czytaj bezpośrednio ze zdalnej gałęzi (`git show origin/main:docs/wklad-do-standardu.md`), nie z working tree, i odnotuj w `docs/projekty-downstream.md`, że pełna synchronizacja checkoutu czeka na sesję nad tamtym projektem. Pomiń ten krok tylko wtedy, gdy projekt nie jest repozytorium git w ogóle (rzadkie, ale możliwe) — wtedy odczyt z dysku jest jedynym możliwym źródłem, nie skróconą wersją.

1b. [15.09.2026] ✅ DODANO — źródło: `docs/god-book/memory.md`, wpis 14.09.2026 "mechanizm U.4 przez świeże klony". **W środowisku sesji bez trwałego lokalnego checkoutu (np. świeży `git clone` na żądanie zamiast `~/projekty/...` odświeżanego między sesjami) — krok 1a wymaga pełnego fetch, nigdy targetowanego.** `git fetch origin <branch>` (albo płytki `--depth 1` klon, po którym wykonano tylko taki targetowany fetch) potrafi zaktualizować `FETCH_HEAD`, ale **nie** odświeżyć referencji śledzącej `origin/<branch>` — `git log HEAD..origin/main` wtedy fałszywie pokazuje zero różnicy, mimo że zdalna gałąź faktycznie jest o dziesiątki/setki commitów do przodu. Zamiast tego: zawsze pełny `git fetch origin '+refs/heads/*:refs/remotes/origin/*'` (albo równoważny pełny fetch wszystkich gałęzi), nigdy fetch ograniczony do jednej nazwanej gałęzi na takim klonie. Dodatkowo: na płytkim klonie (`--depth 1`) `git log`/`git diff` **bez podanej ścieżki** dają mylące, przesadzone wyniki (cała historia aż do sztucznej granicy płytkości, bo brak zapisanych rodziców commitu) — bezpieczne porównanie treści konkretnego pliku to zawsze `git show origin/main:<ścieżka>` albo `git diff <stary-tip> origin/main -- <ścieżka>`, nigdy `git log`/`git diff` bez ścieżki na takim klonie.
2. Przeczytaj każdy (**read-only** — patrz granica niżej), zbierz wpisy ze statusem `🔎 nowe`.
3. Zaproponuj każdy właścicielowi projektu tu, w sesji nad `new-app-standards`, dokładnie jak przy ręcznie przyniesionym materiale (U.1/U.3): dopisz do `docs/god-book/memory.md` jako 🔎 pojedynczy przypadek albo 🔁 powtórzony (jeśli podobny wpis już tam jest z innego projektu), i zapytaj o promocję, jeśli wyraźnie uniwersalny.
4. Zaktualizuj w `docs/projekty-downstream.md` datę ostatniej konsolidacji dla tego projektu.

**Granica — czego ten mechanizm nie zmienia.** Krok 2 to wyłącznie odczyt. Sesja nad `new-app-standards` **nigdy nie edytuje plików w projekcie downstream** — to samo ograniczenie co w drugą stronę (Y.8: AI downstream nie edytuje `new-app-standards`), tylko lustrzane. Dotyczy to też oznaczenia wpisu jako `✅ przekazane do new-app-standards (DD.MM.RRRR)` w `docs/wklad-do-standardu.md` źródłowego projektu (krok 4 procedury zgłaszania z tamtego pliku) — to zmiana w cudzym repo, więc albo robi ją właściciel ręcznie, albo, jeśli ma to zrobić AI, wymaga osobnej, wyraźnej zgody przy tej konkretnej okazji (nie jest częścią tego mechanizmu z automatu). Ten mechanizm rozwiązuje "nikt nie wie, że coś czeka" — nie usuwa granicy między repozytoriami.

[16.09.2026] ✅ DODANO — źródło: właściciel repo. **Cykl co 3 godziny (wyżej) zrealizowany jako zaplanowana Routine tej sesji** (nie tylko zapis polityki) — automatyczne uruchomienie kroków 1-4 dla każdego zarejestrowanego projektu co 3h, bez czekania na ręczne poproszenie. **Krok 3 (propozycja/pytanie o promocję) zostaje bez zmian nawet w trybie automatycznym** — cykliczne uruchomienie automatyzuje wyłącznie *wykrycie i zebranie* nowej treści (kroki 1-2, 4), nigdy decyzję o promocji: znaleziona nowa treść trafia do właściciela repo do potwierdzenia, dokładnie jak przy sprawdzeniu na żądanie, nie jest automatycznie konsolidowana/mergowana bez pokazania. Jeśli nic nowego nie znaleziono — cykl kończy się cicho (bez angażowania właściciela), żeby nie zaśmiecać uwagi zerowym wynikiem co 3 godziny.

[16.09.2026, dopisek po pierwszym live-teście] ✅ DOPRECYZOWANO — źródło: test na żywo self-bind Routine (`trig_017vEH38Kp2aWskVDtgJKgwe`), właściciel repo. Test potwierdził, że mechanizm self-bind faktycznie dostarcza odpalenie do tej sesji — z opóźnieniem do końca bieżącej tury sesji (kolejka, nie błąd), co przy cyklu 3-godzinnym jest nieistotne. Ujawnił też, że **"commit+push bezpośrednio na `main`" (Krok 3/4, wariant "nic nowego") nie da się wykonać dosłownie w środowisku sesji z zasadą wyznaczonego brancha deweloperskiego** (Claude Code Remote i podobne) — tam bezpośredni push na `main` jest zablokowany zasadami harnessu, niezależnie od tego, co mówi ten dokument. W takim środowisku ta sama intencja (bezzwłoczny zapis stanu bez przeglądu właściciela, bo to nie zmiana reguły) realizuje się jako: commit na wyznaczonym branchu → push → PR do `main` → merge tego PR przez tę samą sesję, bez czekania na przegląd właściciela repo. To nie jest odstępstwo od reguły "bez PR" — to jedyna dostępna realizacja tej samej reguły pod ograniczeniem środowiska. Nie myl z granicą wyżej (Krok 4, treść nowa) ani z 15.17 — tam PR do `new-app-standards` z sesji **downstream** jest zakazany bezwzględnie, bo dotyczy cudzego repo i cudzej decyzji o promocji; tu chodzi o zapis we **własnym** repo tej sesji, gdzie jedyne ograniczenie jest techniczne (harness), nie procesowe.

[23.09.2026] ✅ ZMIENIONO (było: nie rzadziej niż co 3 godziny, od 16.09.2026) — źródło: właściciel repo, bezpośrednia decyzja ("przepisz ustawienia pobrania aktualizacji na raz na 12 godzin, zamiast co 3h"), ten sam powód i ta sama decyzja co lustrzana zmiana w Y.6 wyżej w tej Części (koszt uwagi/liczba cyklicznych odpaleń bez nowej treści przy tak częstym sprawdzaniu przewyższył korzyść z szybszej wykrywalności przy obecnym tempie rozwoju standardu). Zaplanowana Routine tej sesji (`trig_017vEH38Kp2aWskVDtgJKgwe`) przestawiona na cron `*/12` w tej samej sesji, w której padła decyzja — GOD BOOK formalizuje już wprowadzoną zmianę, nie wyprzedza jej.

[24.09.2026] ✅ ZMIENIONO (było: sztywne co 12h, od 23.09.2026) — lustrzana zmiana do Y.6 wyżej w tej Części (pełny opis reguły, uzasadnienie i konkretne liczby: patrz dopisek [24.09.2026] w Y.6). Cykl U.4 staje się **adaptacyjny**: start 12h, wydłużaj ×1,5 (pułap 48h) po każdym sprawdzeniu bez nowej treści, resetuj do 12h natychmiast po sprawdzeniu, które znajdzie realną nową treść. **Ograniczenie techniczne tego środowiska sesji (Claude Code Remote):** zaplanowana Routine tej sesji (`trig_017vEH38Kp2aWskVDtgJKgwe`) działa na cronie o stałym interwale (`*/12`), nie na dynamicznie przeliczanym opóźnieniu — mechanizm adaptacyjny wymaga więc, żeby sama sesja po każdym odpaleniu U.4 jawnie przeliczyła i ustawiła następne wybudzenie na nową długość cyklu (mechanizm dynamicznego planowania wybudzeń, jeśli dostępny w środowisku), zamiast polegać na stałym cronie. Do czasu pierwszego takiego przeliczenia Routine zostaje na `*/12` jako bezpieczna wartość wyjściowa — nie jest to odstępstwo od reguły, tylko kolejność wdrożenia (ta sama logika co dopisek [16.09.2026] wyżej o realizacji "bez PR" pod ograniczeniem harnessu).

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

   **Format zapisu — "świadomy wyjątek", żeby Y.6/Y.11 rozpoznały go jako oczekiwany, nie jako dryf.** [24.09.2026] ✅ DODANO — źródło: farmer360.io (U.4) + luka zgłoszona przez samą Y.12 (niżej). Wpis D# z punktu wyżej dostaje jawny, grep-owalny nagłówek **"WYJĄTEK OD REGUŁY RODZINY: [numer/nazwa reguły Standardu]"** i cztery pola: uzasadnienie, data, zakres (cały projekt / konkretny moduł), czasowość (na stałe / do kiedy / pod jakim warunkiem wygasa). Po zgłoszeniu kanałem U.2 (`docs/wklad-do-standardu.md`) i potwierdzeniu w sesji nad `new-app-standards` (U.3) wyjątek trafia do centralnego, stałego rejestru w `docs/god-book/memory.md` — sekcja "Rejestr świadomych wyjątków od reguł rodziny" (U.1). To jest miejsce, które Y.11 sprawdza **przed** zgłoszeniem rozbieżności jako naruszenia (patrz Y.11, dopisek [24.09.2026]) — obecność wpisu = rozbieżność oczekiwana (status ✅ wyjątek), brak wpisu = dryf albo nowa, nieskonsolidowana kolizja do zgłoszenia przez U.2.

**Uzasadnienie.** Te dwa przypadki wyglądają z zewnątrz podobnie ("kod/Biblia nie zgadza się ze Standardem"), ale wymagają przeciwnego traktowania — pierwszy nie potrzebuje eskalacji (to byłoby marnowanie czasu właściciela projektu na oczywisty błąd), drugi wymaga jej zawsze (bo to nie jest oczywiste, które źródło ma rację).

**Podtyp: kolizja z regułą jawnie ogłoszoną jako "na stałe dla całej rodziny".** [24.09.2026] Gdy przypadek 2 wyżej dotyczy nie zwykłej reguły punktowej Standardu, tylko reguły jawnie ogłoszonej jako obowiązująca na stałe dla całej rodziny (np. rozdz. 13, Capacitor) — patrz **Y.12** dla ustandaryzowanej metody testu Spike (progi zdał/nie zdał ustalone przed startem), którą właściciel repo może autoryzować do rozstrzygnięcia tego podtypu kolizji.

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

**Reguła.** Projekt sprawdza `AKTUALIZACJE.md` źródłowego repo `new-app-standards` **nie rzadziej niż co 12 godzin**. Datę/godzinę ostatniego sprawdzenia zapisuj w `docs/memory.md` (sekcja "Synchronizacja ze standardem"). Brak zapisanego znacznika = traktuj jak "nigdy nie sprawdzono", zrób pełne sprawdzenie teraz.

[16.09.2026] ✅ ZMIENIONO (było: nie rzadziej niż raz na 7 dni) — źródło: właściciel repo, `new-app-standards`. Powód: przy cyklu tygodniowym standard i projekty downstream systematycznie się rozjeżdżały — poprawki czekały dni na ręczne poproszenie o sprawdzenie zamiast trafiać do projektu przy najbliższej okazji. **Zastrzeżenie techniczne, żeby nie czytać tego zapisu jako gwarancji:** ten zapis mówi, jak często sprawdzenie ma się odbyć, nie sprawia samo z siebie, że się odbywa — wymaga albo aktywnej sesji AI nad danym projektem w tym oknie czasowym, albo osobnego mechanizmu cyklicznego (np. własnej zaplanowanej Routine tego projektu wywołującej sesję cyklicznie) skonfigurowanego świadomie przez właściciela tamtego projektu. Sam zapis w GOD BOOK ustala politykę (jak często sprawdzać, gdy sprawdzenie się odbywa), nie automatyzuje wyzwalania.

[23.09.2026] ✅ ZMIENIONO (było: nie rzadziej niż co 3 godziny, od 16.09.2026) — źródło: właściciel repo, bezpośrednia decyzja ("przepisz ustawienia pobrania aktualizacji na raz na 12 godzin, zamiast co 3h"). Powód: 3-godzinny cykl obowiązywał kilka dni bez zgłoszonego problemu z rozjazdem — właściciel zdecydował, że koszt uwagi/liczba cyklicznych odpaleń przy tak częstym sprawdzaniu (dla większości cykli bez żadnej nowej treści) przewyższa korzyść z szybszej wykrywalności przy tym tempie rozwoju standardu; 12 godzin zostaje wystarczająco szybkie, żeby uniknąć powrotu do problemu sprzed v2.18 (rozjazd trwający dniami). Dotyczy lustrzanego cyklu U.4 (niżej w tej samej Części) tą samą decyzją, jeden wspólny powód. Przy okazji tej zmiany sprawdzono rzeczywiste Routine trzech zarejestrowanych projektów z już skonfigurowanym mechanizmem cyklicznym (zero-waste, farmer360.io, inzynier-szkieletowy-pro) — wszystkie trzy już działały na `*/12`, ustawione wcześniej przez sesje nad tamtymi projektami niezależnie od tego zapisu; jedyny mechanizm cykliczny wciąż na starym cyklu 3h była własna Routine tej sesji dla U.4, przestawiona na `*/12` w tej samej sesji, w której padła decyzja.

`AKTUALIZACJE.md` **nigdy nie jest kopiowany do projektu** — sprawdzany bezpośrednio w źródle (lokalnie, jeśli repo `new-app-standards` jest sklonowane obok, albo zdalnie) — kopia byłaby tym samym problemem, któremu ten mechanizm ma zapobiegać: nieaktualną wersją tego, co ma wykrywać nieaktualność.

[09.09.2026] ✅ DODANO — źródło: właściciel projektu, incydent 09.09.2026 (`docs/god-book/memory.md`, ten sam dzień) — lustrzana poprawka do U.4 (1a, v2.11), ta sama choroba, przeciwny kierunek czytania. **Jeśli lokalny klon `new-app-standards` jest sklonowany obok tego projektu — zanim przeczytasz z niego `AKTUALIZACJE.md`, zrób w nim `git fetch`, potem porównaj lokalny `HEAD` z `origin/main` (`git log HEAD..origin/main`).** "Sprawdzany lokalnie" (wyżej) nie znaczy "ufaj temu, co tam już leży" — nieodświeżony checkout czyta stary stan i **z pełną pewnością siebie raportuje "brak nowości"**, mimo realnych, nieskonsolidowanych wpisów na `origin/main` źródła. Jeśli lokalny `HEAD` jest w tyle: pociągnij (`git merge --ff-only origin/main`), a jeśli working tree ma lokalne, nieśledzone zmiany, które kolidują — czytaj bezpośrednio ze zdalnej gałęzi (`git show origin/main:AKTUALIZACJE.md`), nie z working tree. Jeśli lokalnego klona `new-app-standards` nie ma obok (sprawdzasz zdalnie) — ten krok i tak jest spełniony z definicji, bo nie ma nieaktualnego checkoutu do pomylenia ze stanem bieżącym.

**Konsekwencja.** Znajdziesz wpisy nowsze niż Twoja zapisana data → **poinformuj właściciela projektu i zaproponuj konkretne pliki do zaktualizowania** (wg kategorii, Y.8), nigdy nie podmieniaj plików samodzielnie bez pokazania, co się zmieni. To ten sam tryb co każda inna zmiana z zewnątrz źródła (nie decydujemy za człowieka).

[24.09.2026] ✅ KOREKTA — źródło: właściciel repo, zgłoszony wprost regres (mechanizm, który wcześniej stosował aktualizacje automatycznie wg kategorii Y.8, zaczął pytać o każdą pojedynczą podmianę pliku, łącznie z NIETYKALNE). Przyczyna: zdanie wyżej, zacytowane dosłownie poza kontekstem Y.8, brzmi jak "zawsze pytaj o wszystko" — co wprost koliduje z Y.8 ("NIETYKALNE: nadpisz w całości... napraw, nie negocjuj"; "ADAPTOWALNE: wnieś tylko te poprawki... PATCH nie REWRITE" — obie kategorie **bez pytania**, nie propozycją do zatwierdzenia za każdym razem). **Rozstrzygnięcie (Y.8 ma pierwszeństwo dla NIETYKALNE/ADAPTOWALNE):** dla pliku jednoznacznie należącego do jednej z tych dwóch kategorii, stosuj aktualizację automatycznie — pełny nadpis (NIETYKALNE) albo scalający PATCH zachowujący lokalną adaptację (ADAPTOWALNE) — bez pytania właściciela projektu przed zastosowaniem, i zaloguj to w `docs/memory.md` (Y.9, "wynik checklisty") jako fakt dokonany, nie propozycję. Zdanie "Konsekwencja" wyżej, wraz z obowiązkiem informowania i pytania PRZED zastosowaniem, dotyczy wyłącznie przypadków, których Y.8 nie rozstrzyga automatycznie: (a) plik nie mieszczący się jednoznacznie w żadnej z trzech kategorii; (b) prawdziwy konflikt między wersją źródłową a lokalną adaptacją, nie sam fakt różnicy (Y.2.2 — dryf kontra świadoma decyzja z udokumentowanym uzasadnieniem); (c) plik kategorii LOKALNE, którego treść (nie sama obecność) wymaga wiedzy specyficznej dla projektu, niemożliwej do wypełnienia bez właściciela (np. TODO w nowo zakładanym `CLAUDE.md`, Y.9 wiersz 3). To przywraca mechanizm sprzed tej korekty — Y.8 był i pozostaje już podjętą decyzją o tym, jak aktualizować, nie punktem do ponownego zatwierdzania przy każdym pojedynczym sprawdzeniu Y.6.

[24.09.2026] ✅ ZMIENIONO (było: sztywne 12 godzin, od 23.09.2026) — źródło: właściciel repo, bezpośrednia decyzja, po zbieżnym zgłoszeniu tego samego dnia z inzynier-offgrid-pro (U.4) proponującym mechanizm konfigurowalny/adaptacyjny zamiast jednej sztywnej wartości dla całej rodziny (opcje: (a) konfigurowalny per projekt, (b) adaptacyjny — wydłużaj po zerowych sprawdzeniach, skracaj po realnej zmianie, (c) sztywna wartość + jawnie dopuszczone lokalne odstępstwo). Decyzja właściciela repo: **(b) wymuszone jako nowy domyślny mechanizm dla całej rodziny, z (c) dołożonym na wierzchu** ("zmusić najpierw wszystkich do [adaptacyjnego], a potem już z czasem mogą sobie oddzielnie ustalić").

**Reguła — cykl adaptacyjny (zastępuje sztywne 12h jako domyślny mechanizm).** Punkt startowy cyklu: 12 godzin (wartość z 23.09.2026, teraz punkt odniesienia, nie sztywny sufit). Po każdym sprawdzeniu Y.6 z wynikiem **zero nowej treści** — wydłuż cykl (orientacyjnie ×1,5, zaokrąglając w górę do pełnej godziny), do pułapu **48 godzin** (nie wydłużaj dalej bez świadomej decyzji projektu — patrz (c) niżej). Po sprawdzeniu, które **znajdzie realną nową treść** (choć jeden wpis w `AKTUALIZACJE.md` nowszy niż zapisana data) — cykl **resetuje się natychmiast do wartości startowej 12h** (nie stopniowe skracanie — moment realnej zmiany jest sygnałem zwiększonej aktywności standardu, lepiej sprawdzać częściej od razu, nie po kilku kolejnych cyklach). Aktualna długość cyklu i licznik kolejnych zerowych sprawdzeń zapisywane w `docs/memory.md` obok znacznika daty (Y.6, wyżej) — jawnie widoczne, nie tylko wyliczane w locie.

**Dopuszczone świadome lokalne odstępstwo (c).** Projekt może świadomie ustawić inny punkt startowy/pułap cyklu niż wartości domyślne wyżej (np. projekt wiedzący, że wchodzi w długi okres niskiej aktywności standardu, albo odwrotnie, chcący pozostać czujniejszym) — pod warunkiem zapisania tego jako decyzja D# w `rejestr-decyzji.md` tego projektu (ten sam tryb co Y.2/F.5), jawnie, nie jako cichy fakt wyłącznie w lokalnym `CLAUDE.md` bez śladu w rejestrze decyzji. Retroaktywnie zamyka to przypadek inzynier-offgrid-pro (D21, 23.09.2026, obniżenie cyklu do ≤12h zapisane tylko w `CLAUDE.md`) — taki zapis jest teraz jawnie dopuszczony przez GOD BOOK, nie tylko tolerowany po fakcie.

**Konkretne liczby wyżej (start 12h, mnożnik ×1,5, pułap 48h) są propozycją sesji, nie zweryfikowaną w praktyce receptą** — ta sama ostrożność co 13.4/CSP/Y.12: mogą wymagać korekty po pierwszym pełnym cyklu adaptacyjnym w realnym użyciu (np. jeśli pułap 48h okaże się za wolny albo za szybki przy faktycznym tempie zmian standardu). Dotyczy lustrzanego cyklu **U.4** (niżej w tej samej Części) tą samą decyzją, jeden wspólny powód i mechanizm — Routine tej sesji dla U.4 do przestawienia na logikę adaptacyjną zamiast sztywnego `*/12` przy najbliższej okazji technicznej pozwalającej na zmienny interwał.

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

[20.09.2026] ✅ DODANO — źródło: właściciel repo, `new-app-standards`. **Archiwizacja `docs/wklad-do-standardu.md`.** Ten sam problem co W.5 (próg rozmiaru dokumentu), zastosowany do kanału zwrotnego: plik jest z zasady append-only (nigdy nie kasujemy wpisów, wyżej), więc w projekcie żyjącym dłużej rośnie bez końca — w praktyce pierwsze 4 zarejestrowane projekty downstream mają dziś pliki rzędu kilkudziesięciu KB, w większości treść już dawno skonsolidowaną (Status `✅`). Duży plik nie jest błędem sam w sobie, ale utrudnia każdemu, kto go czyta (człowiekowi albo kolejnej sesji U.4), odróżnienie tego, co faktycznie jeszcze czeka na decyzję, od tego, co już dawno załatwione.

**Reguła.** Cyklicznie — przy pełnym audycie kompletności (Y.9), albo gdy plik wyraźnie urósł (orientacyjnie: więcej niż kilkanaście wpisów w pełni zamkniętych nagromadzonych od ostatniej archiwizacji) — sesja pracująca **bezpośrednio nad danym projektem downstream** przenosi w pełni zamknięte wpisy do nowego pliku `docs/wklad-do-standardu-archiwum.md` tego samego projektu:

1. Kandydat do przeniesienia to wyłącznie wpis ze statusem `✅ przekazane do new-app-standards (DD.MM.RRRR)` **bez żadnej otwartej dalszej akcji** czekającej ze strony `new-app-standards` (np. "zweryfikujcie i zgłoście wynik" jeszcze nierozstrzygnięte) — częściowo zamknięty wpis zostaje w żywym pliku, dopóki cała jego dalsza akcja się nie zamknie.
2. Skopiuj każdy kandydat 1:1 (treść, data, status) na koniec `docs/wklad-do-standardu-archiwum.md` — ten plik jest tak samo append-only jak źródłowy, nic w nim wstecz nie edytujemy.
3. Usuń skopiowany wpis z żywego `docs/wklad-do-standardu.md`. To jedyny dopuszczalny wyjątek od "nie usuwamy wpisów" w tym pliku — treść nie znika, zostaje 1:1 w archiwum, a git-historia obu plików jest trzecim, niezależnym śladem.
4. Na górze żywego pliku dopisz/zaktualizuj jedno zdanie: "Starsze, w pełni skonsolidowane wpisy: `docs/wklad-do-standardu-archiwum.md`, ostatnie przeniesienie DD.MM.RRRR" — żeby nikt nie szukał zgubionej historii.
5. Odnotuj samo przeniesienie (data, liczba przeniesionych wpisów — nie ich treść, ta już jest w `docs/god-book/memory.md` z konsolidacji) w lokalnym `docs/memory.md`, sekcja "Synchronizacja ze standardem" (Y.9).

**Granica z U.4 — ta sama co reszta tej sekcji.** To jest zmiana pliku w projekcie downstream — sesja nad `new-app-standards`, czytająca ten plik przez U.4, **nigdy jej nie wykonuje sama**; może co najwyżej zaproponować właścicielowi, że dany projekt kwalifikuje się do archiwizacji (rozmiar widoczny przy zwykłym odczycie U.4), nigdy tego nie wykonać z tej strony. Odwrotnie: gdy żywy plik ma już nagłówek wskazujący na archiwum (krok 4 wyżej), U.4 nie musi otwierać samego archiwum przy zwykłym sprawdzeniu — z definicji zawiera wyłącznie treść już dawno skonsolidowaną, więc nie może kryć niczego `🔎 nowe`; wystarczy odnotować w `docs/projekty-downstream.md`, że archiwizacja miała miejsce.

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

### Y.11 Audyt zgodności kodu ze standardem — mechanizm ukierunkowany, osobny od Y.6

[20.09.2026] ✅ DODANO — źródło: właściciel projektu, `new-app-standards`. Pomysł padł najpierw w jednym z projektów downstream (inzynier-szkieletowy-pro albo zero-waste — nie ustalono z całą pewnością, w którym), ale sesja, w której padł, została przerwana limitem, zanim zdążyła go zapisać w `docs/wklad-do-standardu.md` czy `docs/memory.md` tamtego projektu — sprawdzone bezpośrednio (grep obu projektów, brak śladu). Odtworzony i sformalizowany tutaj wprost na żądanie właściciela, bez czekania na odzyskanie oryginalnego zapisu.

**Cel i różnica względem Y.6 i K1–K8 (rozdz. 10.5 Standardu).** Trzy mechanizmy sprawdzają trzy różne rzeczy i żaden nie zastępuje pozostałych:
- **Y.6** sprawdza, czy **dokumentacja** projektu (pliki NIETYKALNE/ADAPTOWALNE pakietu) jest aktualną kopią źródła — nie zagląda do kodu w ogóle.
- **K1–K8** sprawdza **poprawność i kompletność testów** pojedynczego modułu wobec jego własnej domeny (czy liczy dobrze, czy ma testy brzegowe itd.) — nie odnosi się do reguł architektonicznych/procesowych standardu.
- **Y.11** sprawdza trzecią, dotąd nieobsadzoną rzecz: czy **realny, wprowadzony i faktycznie używany kod** projektu stosuje się do konkretnych, obowiązkowych reguł architektonicznych standardu — niezależnie od tego, czy dokumentacja projektu jest aktualna (Y.6 może być ✅, a kod i tak łamać regułę, której dokumentacja tylko *opisuje* istnienie) i niezależnie od tego, czy moduł ma komplet testów (K1–K8 może być ✅ dla modułu, który poprawnie liczy, ale nie ma wymaganego i18n).

**Zakres — ukierunkowany, nie generyczny code review.** Y.11 **nie jest** ogólnym audytem jakości kodu ani zastępstwem ludzkiego code review (Część X.2 tej Instrukcji). To sprawdzenie zamkniętej, jawnie wypisanej listy **konkretnych, obiektywnie i odtwarzalnie sprawdzalnych** reguł kodowych ze standardu — każda pozycja rejestru niżej ma podany sposób weryfikacji (grep / obecność pliku / obecność wpisu w rejestrze), nie ocenę "na oko". Reguła, której nie da się sprawdzić w sposób odtwarzalny przez dwie różne sesje niezależnie dochodzące do tego samego wyniku, nie trafia do tego rejestru — zostaje częścią standardu sprawdzaną przy zwykłym code review przez człowieka/AI w trybie Wdrożenie (0.3), nie przez Y.11.

**Rejestr reguł do audytu Y.11** (dopisywany, append-only, tą samą logiką co rejestr modułów opcjonalnych Y.10 — nowa pozycja to PATCH tej tabeli, nigdy przepisanie całości):

| # | Reguła źródłowa | Co sprawdzić w kodzie | Jak sprawdzić |
|---|---|---|---|
| 1 | 17.1a Standardu (i18n, obowiązkowe w każdym projekcie — [21.09.2026] doprecyzowanie zakresu, nie tylko nowe projekty; 17.7b [21.09.2026] selektor języka tylko dla języków kompletnych; 17.7c [23.09.2026] faza przedpremierowa vs apka już działająca) | (a) Mechanizm i18n (struktura kluczy, przełącznik, Kernel zwraca klucze nie tekst) faktycznie istnieje w projekcie — jego brak jest naruszeniem w KAŻDYM projekcie, nie tylko nowym. (b) Nowy/zmieniony kod UI nie dodaje kolejnych zahardkodowanych stringów poza tym mechanizmem. Brak stuprocentowego pokrycia treścią istniejących ekranów NIE jest samo w sobie naruszeniem, dopóki migracja trwa zgodnie z 17.9. (c) Przełącznik języka widoczny dla zwykłego użytkownika końcowego nie zawiera języka ze statusem `draft`/niepełnym pokryciem (17.7b) — pokazywanie niekompletnego języka w produkcyjnym selektorze JEST naruszeniem, niezależnie od (b). **[23.09.2026] Wyjątek (17.7c):** (c) obowiązuje wyłącznie dla projektu, który ma już realnych użytkowników końcowych w produkcji (faza (b) wg 17.7c) — projekt jeszcze w fazie przedpremierowej (faza (a), dziś wszystkie 4 zarejestrowane projekty) nie łamie (c) samym pokazywaniem niekompletnych języków; dla apki już działającej dopuszczalny jest też język świeżo opublikowany z widoczną etykietą "beta" przez pierwszy miesiąc — to NIE jest naruszenie (c), o ile status treściowy to `reviewed` | (a) Sprawdzenie obecności struktury i18n/Kernela zwracającego klucze. (b) Grep nowych/zmienionych plików warstwy prezentacji pod kątem literałów tekstowych spoza wywołań funkcji tłumaczącej. (c) Sprawdzenie, że komponent selektora języka filtruje listę wg statusu/pokrycia (nie renderuje statycznej listy wszystkich skonfigurowanych języków bez warunku) — **przed uznaniem za naruszenie, ustal najpierw fazę projektu (17.7c): przedpremierowa vs już działająca z realnymi użytkownikami** |
| 2 | 5.7 Standardu (autosave, obowiązkowe w każdym projekcie — [21.09.2026] doprecyzowanie zakresu, nie tylko nowe projekty) | Każdy formularz/edytor stanu, który standard klasyfikuje jako wymagający autosave, faktycznie wywołuje mechanizm autosave projektu — w KAŻDYM projekcie, również już istniejącym (brak wzorca to dług do domknięcia, nie trwałe zwolnienie) | Grep wywołań mechanizmu autosave w plikach formularzy/edytorów zidentyfikowanych jako objęte 5.7 |
| 3 | 9.0a Standardu (rejestracja narzędzi AI) | Każdy nowy endpoint/funkcja wystawiane AI ma odpowiadający wpis w rejestrze narzędzi AI projektu (`AiToolDefinition`) | Porównanie listy endpointów/funkcji oznaczonych jako AI-facing z zawartością rejestru |
| 4 | Część Y tej Instrukcji (kategorie plików pakietu) | Nowe pliki wprowadzone do projektu trafiają do właściwej kategorii NIETYKALNE/ADAPTOWALNE/LOKALNE, nie mieszają obcej treści w pliki pakietu | Sprawdzenie lokalizacji i treści nowych plików względem manifestu Y.9 |
| 5 | K7 Standardu (10.5 — czystość jądra) | Moduł logiki domenowej faktycznie nie importuje warstwy prezentacji/platformy | Grep importów w plikach jądra — ta sama reguła co K7, tu podniesiona do rangi audytu ogólnoprojektowego, nie tylko per-moduł |
| 6 | 9.0 Standardu (AI obowiązkowe w każdym projekcie) | Rejestr narzędzi AI (9.0a) istnieje i zawiera co najmniej jedno narzędzie faktycznie wywoływane z UI — nie tylko typy/scaffolding bez żywego wywołania | Sprawdzenie zawartości rejestru narzędzi AI projektu + potwierdzenie przynajmniej jednego realnego wywołania w kodzie UI (nie tylko obecność plików typu `types.ts`/`registry.ts` bez podpiętego handlera) |
| 7 | 18.1 Standardu (logowanie od pierwszego uruchomienia, bez wyjątku) | Każda ścieżka wejścia do aplikacji (nie tylko strona główna) faktycznie wymaga zalogowanej sesji przed dostępem do rdzenia — brak trwałego trybu gościa/obejścia logowania | Sprawdzenie middleware/route guard chroniącego wszystkie trasy poza samym ekranem logowania/rejestracji; grep tras bez ochrony sesji |

**Sprawdź rejestr wyjątków przed zgłoszeniem naruszenia.** [24.09.2026] ✅ DODANO — źródło: Y.2 (dopisek [24.09.2026], format "świadomy wyjątek"). Przed oznaczeniem pozycji rejestru wyżej jako ⚠️ (naruszenie), sprawdź `docs/god-book/memory.md` tego projektu (albo centralny, jeśli dostępny) pod kątem wpisu w sekcji "Rejestr świadomych wyjątków od reguł rodziny" dla tej konkretnej reguły. Jeśli wpis istnieje — rozbieżność jest oczekiwana, status to ✅ (wyjątek), nie ⚠️. Jeśli nie istnieje, a rozbieżność wygląda na świadomą (nie przypadkowy dryf) — to nowa, nieskonsolidowana kolizja: zgłoś kanałem U.2, nie oznaczaj cicho jako ✅ ani nie napraw samodzielnie (ta sama granica co reszta Y.11 niżej).

**Kiedy uruchamiany — świadomie oddzielony od cyklu Y.6.** Y.6 czyta dwa pliki tekstowe (`AKTUALIZACJE.md` własny znacznik) i jest tani — stąd cykl co 12 godzin ([23.09.2026] było: co 3 godziny, patrz Y.6 niżej). Y.11 czyta i analizuje realny kod projektu (grep/statyczna analiza wielu plików źródłowych) i jest znacząco droższy — **nigdy nie jest częścią rutynowego cyklu Y.6**, to świadoma decyzja rozdzielenia (właściciel projektu, 20.09.2026), nie przeoczenie. Y.11 uruchamiany jest:
- na wyraźne żądanie właściciela projektu, w dowolnym momencie;
- automatycznie na końcu każdej Fazy/Etapu projektu — ten sam naturalny punkt kontrolny co pełny audyt N.2, żeby audyt zgodności kodu nie czekał do samego końca projektu, gdzie naprawa byłaby najdroższa (F.6);
- nigdy częściej niż raz na Fazę bez wyraźnego żądania — to nie jest mechanizm cykliczny czasowo, tylko zdarzeniowy.

**Wynik i granice naprawy.** Wynik zawsze w formie raportu ✅/➕/⚠️ per pozycja rejestru (ta sama forma co Y.9), zapisywany w nowym pliku `docs/audyt-zgodnosci-kodu.md` projektu (kategoria LOKALNE — treść raportów nigdy nie jest kopiowana ani nadpisywana z `new-app-standards`; NIETYKALNY jest wyłącznie rejestr reguł w tabeli wyżej, bo to on żyje w tym pliku źródłowym). Y.11 **nigdy nie naprawia kodu samodzielnie** — inaczej niż Y.8 dla plików NIETYKALNYCH dokumentacji, gdzie pełny nadpis jest bezpieczny i automatyczny. Kod zmienia zachowanie działającej aplikacji, więc każde naruszenie znalezione przez Y.11 wraca do zwykłego trybu pracy z właścicielem projektu — pokaż dokładnie, co się zmieni, i czekaj na potwierdzenie, zanim trafi do commita. To ta sama logika co 15.4/Y.2.2 (nigdy nie rozstrzygaj sam), zastosowana tu nie do sprzeczności dokumentów, tylko do ryzyka zmiany zachowania kodu bez przeglądu.

**Granica z U.4 — ta sama co reszta Części Y.** Sesja nad `new-app-standards` nigdy nie wykonuje Y.11 za projekt downstream ani nie czyta jego kodu źródłowego w tym celu — to wyłącznie mechanizm sesji pracującej bezpośrednio nad danym projektem. Rejestr reguł (tabela wyżej) jest NIETYKALNY i rozwijany tylko przez ten sam proces promocji co reszta standardu (U.1–U.3): nowa, obiektywnie sprawdzalna reguła kodowa zgłoszona przez projekt downstream trafia do tego rejestru dopiero decyzją właściciela repo `new-app-standards`, nigdy samodzielnie przez sesję downstream.

### Y.12 Kolizja decyzji "na stałe dla całej rodziny" z wcześniejszą, uzasadnioną decyzją projektu — test Spike z progami ustalonymi przed startem

[24.09.2026] ✅ DODANO — źródło: właściciel repo, bezpośrednia decyzja, po zgłoszeniu przez farmer360.io (U.4, 23-24.09.2026) pierwszego realnego przypadku: rozdz. 13 Standardu (Capacitor na stałe dla całej rodziny, decyzja 22.09.2026) koliduje wprost z wcześniejszą, świadomą i technicznie uzasadnioną decyzją stacku D2 tego projektu (Flutter, 03.09.2026, `rejestr-decyzji.md`). Doprecyzowuje Y.2 przypadek 2 ("świadoma potrzeba projektu") dla konkretnego podtypu: kolizja nie z dowolną regułą Standardu, tylko z regułą jawnie ogłoszoną jako "na stałe dla całej rodziny".

[24.09.2026, KOREKTA — tego samego dnia] Pierwszy zapis tej sekcji błędnie stwierdzał, że reguła "na stałe" wygrywa domyślnie i że dla D2/farmer360.io spike nie jest uruchamiany, a decyzja to Capacitor wprost — oparte na błędnym przypisaniu jednej odpowiedzi właściciela repo (dotyczącej w rzeczywistości mechanizmu cyklu U.4/Y.6, patrz dopisek [24.09.2026] w Y.6 niżej) do tego pytania. Właściciel repo doprecyzował: dla D2/farmer360.io wybrana jest **opcja C z pierwotnego zgłoszenia farmer360.io — spike rozstrzyga przed decyzją**, z dokładną procedurą i progami (poniżej), zatwierdzoną wprost ("3. Ok"), oraz zgodą na spisanie tego jako ogólny protokół dla całej rodziny już teraz, nie dopiero po pierwszym zakończonym precedensie ("4. Tak, zróbmy protokół [...] możesz już teraz przygotować go dla całej rodziny. Po testach zrobimy korektę i tyle."). Treść niżej poprawiona zgodnie z tym.

**Reguła.** Kolizja reguły "na stałe dla rodziny" z wcześniejszą, uzasadnioną decyzją projektu (Y.2 przypadek 2, ten podtyp) **nie jest rozstrzygana automatycznie w żadną stronę** — ani "Standard zawsze wygrywa", ani "wcześniejsza decyzja projektu zostaje". Gdy zastrzeżenie projektu jest konkretne i techniczne (nie sama niechęć do zmiany), właściciel repo może autoryzować **test Spike** jako metodę rozstrzygającą samo pytanie "która strona wygrywa" — to jest jawnie ustandaryzowana realizacja opcji "spike rozstrzyga przed decyzją" (pierwotnie zgłoszonej przez farmer360.io jako opcja C, obok A: formalny wyjątek i B: projekt migruje wprost).

**Test Spike — procedura:**

1. **Zakres.** Spike to czasowo ograniczony, jednorazowy kod eksploracyjny/prototyp odpowiadający na konkretne pytanie techniczne w warunkach niepewności — kod ze spike'a **zawsze wyrzucany**, nigdy nie wchodzi do produkcji, nigdy kod Kroku 9 (Część L). Prowadzony na osobnej gałęzi/prototypie w repo projektu, nie w głównej linii rozwoju.
2. **Relacja z N.3 (bramka przed Krokiem 9).** Spike pisze kod przed zamknięciem pełnej Biblii, co z pozoru koliduje z N.3 — **nie jest to naruszenie N.3, jest jawnym, wąskim wyjątkiem od niej**, bo spike nie jest kodem produktu (punkt 1). Mimo to uruchomienie spike'a wymaga **jawnej, osobnej zgody właściciela projektu za każdym razem** (nigdy automatycznie, nigdy jako blankietowe domyślne uprawnienie) — ta sama ostrożność co reszta N.3, zastosowana tu do samego wyjątku. Źródło zastrzeżenia: farmer360.io, zgłoszenie 23.09.2026 (D10/N.3).
3. **Jeden scenariusz testowy na jedno zastrzeżenie.** Dla każdego zgłoszonego technicznego zastrzeżenia wobec reguły "na stałe" — jeden konkretny, mierzalny scenariusz testowy adresujący dokładnie to zastrzeżenie (nie generyczny "sprawdźmy czy działa"). Cztery scenariusze zatwierdzone dla pierwszego przypadku (D2/farmer360.io, Flutter vs Capacitor) są **wzorcem referencyjnym dla przyszłych przypadków**, nie obowiązkową listą — faktyczne scenariusze dobiera się każdorazowo do realnych zastrzeżeń danego przypadku: (a) kalkulator offline — identyczne zachowanie offline jak obecnie (Flutter), pełna funkcjonalność bez sieci; (b) lista ~1000 rekordów + synchronizacja — czas renderowania/scrolla i czas sync w granicach ustalonego % obecnego wyniku; (c) tryb dostępności — **sedno pierwotnego uzasadnienia D2** (pixel-identyczne renderowanie wariantów UI accessibility): czy nowe podejście daje tę samą precyzję na wszystkich wariantach; (d) test sprzętowy/BLE — czy natywna wtyczka w nowej technologii działa tak samo niezawodnie jak obecna integracja.
4. **Progi zdał/nie zdał ustalone PRZED uruchomieniem, per scenariusz.** Kryterium sukcesu/porażki każdego scenariusza (liczbowe, gdzie to możliwe — np. konkretny próg % czasu wyniku referencyjnego) zapisane i zatwierdzone przez właściciela projektu przed napisaniem pierwszej linii kodu spike'a, nigdy zmieniane w trakcie ani po — chroni przed racjonalizacją wyniku po fakcie.
5. **Time-box.** Orientacyjnie 1–3 dni na scenariusz — spike jest z definicji krótki; jeśli pytanie wymaga więcej czasu, to sygnał, że pytanie jest za szerokie i wymaga rozbicia na węższe scenariusze (punkt 3), nie wydłużania jednego spike'a.
6. **Wynik rozstrzyga wprost, wg z góry ustalonej reguły decyzyjnej.** Spike spełniający WSZYSTKIE progi → reguła "na stałe" wygrywa, projekt migruje (odpowiednik opcji B). Spike niespełniający choć jednego progu — zwłaszcza scenariusza dotyczącego bezpośrednio pierwotnego uzasadnienia kolidującej decyzji projektu (tu: dostępność, D2) — → kolidująca decyzja projektu zostaje jako **formalny, nazwany wyjątek** (odpowiednik opcji A). Opcja A wymaga, żeby standard miał format "świadomego wyjątku" — **dziś nie istnieje**; to luka metodologiczna zgłoszona przez farmer360.io (ich punkt 1, 23.09.2026), pozostaje osobnym, otwartym pytaniem do właściciela repo, pilnym dopiero jeśli spike faktycznie nie przejdzie.
7. **Zapis wyniku.** Wynik (zdał/nie zdał per scenariusz, z uzasadnieniem) wraca do `docs/god-book/memory.md` **tego repo** (`new-app-standards`) — normalnym kanałem U.2 (`docs/wklad-do-standardu.md` projektu) → U.4, nie rozstrzygany lokalnie przez sam projekt — jako materiał dowodowy do decyzji, którą podejmuje się tutaj (ta sama granica 15.4/Y.2 co zawsze: projekt downstream dostarcza fakty, nie rozstrzyga konfliktu ze Standardem sam). Ostateczna decyzja D# (uchylenie/zastąpienie kolidującej decyzji projektu, jeśli spike przejdzie) zapisywana jest w `rejestr-decyzji.md` **projektu** (ten sam tryb co F.5, nigdy nie kasuje wcześniejszej decyzji — unieważnia/zastępuje z odsyłaczem, Część D) — to zapis w cudzym repo, zostaje sesji nad tamtym projektem (Y.8/U.4).
8. **Recepta może wymagać korekty po realnych testach.** Tak jak recepty 13.4/13.5/13.6 (v2.26/2.27), wynik spike'a i wybrana implementacja dostają status "wymaga korekty po realnym użyciu" — pierwsze pełne wdrożenie może odkryć rozbieżność między testem eksploracyjnym a produkcyjną skalą/warunkami; korekta wraca normalnym trybem PATCH, nie unieważnia samej metody. Decyzja właściciela repo wprost: "po testach zrobimy korektę i tyle" — protokół pisany teraz, na bazie jednego jeszcze niezakończonego przypadku, ma świadomie niższy próg pewności niż reguła pisana po precedensie, i to jest zaakceptowane ryzyko, nie przeoczenie.

**Stan pierwszego przypadku (D2/farmer360.io).** 🔎 **Otwarte, oczekuje na przeprowadzenie spike'a** — procedura i cztery scenariusze (punkt 3) zatwierdzone przez właściciela repo (24.09.2026), ale samo uruchomienie spike'a w repo farmer360.io (napisanie kodu prototypowego, gałąź) wymaga osobnej, wyraźnej zgody właściciela za każdym razem (punkt 2) — zatwierdzenie protokołu nie jest tą zgodą. D2 (Flutter) **nie jest uchylone** do czasu wyniku spike'a.

**Relacja z biblioteką przypadków (U.1/U.3).** Ten mechanizm formalizuje odpowiedź na pytanie właściciela repo (24.09.2026: czy nie trzeba dopisać tego do biblioteki przypadków, że w taki sposób trzeba rozstrzygać problemy podobne) — `docs/god-book/memory.md` (U.1) jest już tą biblioteką; ta sekcja jest formalną promocją metody (U.3), pisaną **przed** zakończeniem pierwszego przypadku, na wyraźne życzenie właściciela repo (świadome odstępstwo od domyślnego progu U.3 "🔁 powtórzony/sprawdzony w praktyce" — patrz punkt 8 wyżej).

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
| 20.09.2026 | 2.22 | Dodana **Y.11 — audyt zgodności kodu ze standardem**, mechanizm ukierunkowany, świadomie oddzielny od cyklu Y.6 (pełny opis: patrz "Od wersji 2.22" na górze dokumentu). **Uwaga integralności (znaleziona przy tej edycji, nie spowodowana przez nią):** ta tabela nie ma wierszy 2.13–2.21 — te wersje są udokumentowane wyłącznie w prozie na górze pliku ("Od wersji 2.13" itd.), nie w tej tabeli. Zgłoszone właścicielowi projektu jako osobne znalezisko, nie naprawione w tym samym commicie, żeby nie mieszać dwóch niezwiązanych zmian. |
| 20.09.2026 | 2.23 | Rejestr **Y.11** uzupełniony o pozycję 6 (reguła 9.0 — AI obowiązkowe w każdym projekcie, bez zastrzeżenia "dla nowych projektów"; pełny opis: patrz "Od wersji 2.23" na górze dokumentu). Źródło: zero-waste (U.4) — rejestr w wersji 2.22 pominął tę regułę mimo że powstał tego samego dnia właśnie po to, żeby zamknąć klasę problemu "audyt przyrostowy Y.6 nigdy nie sprawdza reguł spoza swojego okna diffu". Właściciel projektu świadomie odrzucił budowę osobnego, ogólnego znacznika "reguła bezwarunkowo obowiązkowa" (zbyt wiele wyjątków, by ustalić to teraz jako mechanizm) — rozwiązanie zostaje punktowe, rejestr Y.11 rozszerzany pozycja po pozycji w miarę znajdowania kolejnych pominiętych reguł. |
| 21.09.2026 | 2.24 | Doprecyzowany zakres **17.1a, 5.7 i 18.1** — obowiązkowe w KAŻDYM projekcie rodziny, nie tylko nowo budowanych (pełny opis: patrz "Od wersji 2.24" na górze dokumentu). Źródło: właściciel projektu, bezpośrednia decyzja, ten sam dzień co konsekwencja: rozszerzenie rejestru **Y.11** (pozycja 1 rozdzielona na obecność mechanizmu vs nowe naruszenia, pozycja 2 doprecyzowana, nowa pozycja 7 dla 18.1). |
| 21.09.2026 | 2.25 | Nowa reguła **17.7b** — selektor języka dla użytkownika końcowego pokazuje wyłącznie języki kompletne (`reviewed`), niekompletny język (`draft`, w trakcie migracji 17.9) nie jest wybieralny (pełny opis: patrz "Od wersji 2.25" na górze dokumentu). Źródło: właściciel projektu, doprecyzowanie po zgłoszonej obawie o miks języków w UI. Rejestr **Y.11** rozszerzony: pozycja 1 o podpunkt (c). |
| 22.09.2026 | 2.26 | Rozdz. **13 (droga mobile)** dostał konkretną technologię (Capacitor) i docelowy podział platform (Windows=PWA, macOS=Capacitor, Android/iOS=Capacitor+sklepy) zamiast generycznego "natywne/React Native"; nowa sekcja **13.4** — recepta Capacitor dla Next.js z Route Handlerami, status "wymaga weryfikacji w realnym buildzie", oparta na rozpoznaniu z zero-waste (pełny opis: patrz "Od wersji 2.26" na górze dokumentu). Źródło: właściciel projektu, bezpośrednia decyzja. |
| 22.09.2026 | 2.27 | Doprecyzowany zakres "wygląda/działa jak natywna" z rozdz. 13 — Capacitor na stałe, pełne przepisanie natywne to warunkowy wyjątek (duży popyt/odrzucenie w sklepie), nie roadmapa; nowa sekcja **13.5** (checklist UI/UX Capacitor: StatusBar/safe-area/splash/haptyka/klawiatura/gesty) i nowa sekcja **13.6** (odporność sieć/tło/wznowienie — fundament już zwalidowany w zero-waste, `lib/sync/engine.ts`; Capacitor dokłada `@capacitor/network`+`@capacitor/app` jako wyzwalacze wznowienia) (pełny opis: patrz "Od wersji 2.27" na górze dokumentu). Źródło: właściciel projektu, bezpośrednia decyzja. |
| 22.09.2026 | 2.28 | Rozdz. **13** uzupełniony o pięć dopisków do 13.1: (1) macOS przez osobny mechanizm **Capacitor Electron Platform**, nie WebView; (2) macOS dystrybuowany **przez Mac App Store** (decyzja właściciela projektu, ze względu na Universal Purchase); (3) iPad trywialny + Universal Purchase (iPhone+iPad+Mac) skonfigurowany, jeden punkt 🔎 dla kombinacji spoza Mac Catalyst, + wymóg Xcode 26+; (4) **Linux = PWA** (jak Windows, nie jak macOS), rekomendacja sesji potwierdzona przez właściciela; (5) Android poza Google Play — Xiaomi GetApps (zasięg) vs. Huawei AppGallery (realna pułapka: brak GMS łamie logowanie Google, magic-link musi być pierwszoplanowy). Sekcja **13.4** uzupełniona o analizę szans na przyjęcie do App Store (pełny opis: patrz "Od wersji 2.28" na górze dokumentu). Źródło: właściciel projektu, seria bezpośrednich decyzji. |
| 23.09.2026 | 2.29 | Cztery dopiski, wszystkie źródło inzynier-szkieletowy-pro (U.4, sprawdzenie skonsolidowane 21-23.09.2026), promocja potwierdzona wprost przez właściciela repo. `17-i18n.md` 17.6 — encje HTML w słowniku i18n renderują się dosłownie, nie jako znak; reguła: zawsze znaki Unicode wprost. `17-i18n.md` 17.9 — retrofit "moduł po module" wymaga osobnego traktowania warstwy współdzielonego generatora treści używanej przez kilka jeszcze-nieprzetłumaczonych ekranów naraz. Nowa **N.4** — audyt zamknięcia serii retrofitu/migracji wymaga przebiegu treściowego (grep/skan realnej zawartości), nie tylko metadanowego (status/checklisty), inaczej możliwe fałszywe "kompletne"; świadomie nie dodane jako pozycja Y.11 (to zasada metodologiczna prowadzenia audytu, nie pojedyncza grep-sprawdzalna reguła architektoniczna). `17-i18n.md` 17.11 + `docs/przyklady/i18n/check-i18n-guard.mjs` + `docs/przyklady/i18n/README.md` — druga, głębsza martwa strefa mechanizmu strażniczego: wizytator AST `ts.isJsxText` ślepy na tekst naturalny wewnątrz template-literału osadzonego w wyrażeniu JSX, udokumentowane jako znane ograniczenie, nie naprawione w tej wersji (pełny opis: patrz "Od wersji 2.29" na górze dokumentu). |
| 23.09.2026 | 2.30 | Dwie zmiany, obie źródło: właściciel repo, bezpośrednia decyzja. **(1)** Nowa **17.7c** — faza przedpremierowa (bez realnych użytkowników — dziś wszystkie 4 projekty) może pokazywać niekompletne języki jak dotychczas; apka już działająca ukrywa nowy język w trakcie tłumaczenia, po publikacji pokazuje z etykietą "beta" przez pierwszy miesiąc. Rejestr Y.11 pozycja 1(c) rozszerzona o ten wyjątek. **(2)** Cykl sprawdzania aktualizacji **3h→12h** (Y.6 i U.4, ta sama decyzja) — koszt uwagi przy cyklicznych odpaleniach bez nowej treści przewyższył korzyść z szybszej wykrywalności. Routine tej sesji (U.4) przestawiona na `*/12`; trzy Routine downstream już były na `*/12` (pełny opis: patrz "Od wersji 2.30" na górze dokumentu). |
| 24.09.2026 | 2.31 | Nowa **Y.12** — pierwszy realny przypadek kolizji reguły Standardu "na stałe dla rodziny" (rozdz. 13, Capacitor) z wcześniejszą, uzasadnioną decyzją stacku pojedynczego projektu (D2, Flutter, farmer360.io), zgłoszony przez U.4. Reguła "na stałe" wygrywa domyślnie (projekt migruje); test Spike — wąski, jawny wyjątek od bramki N.3, zgoda właściciela za każdym uruchomieniem — formalizowany jako metoda rozstrzygania technicznych wątpliwości co do SZCZEGÓŁÓW wdrożenia w przyszłych, analogicznych przypadkach (progi zdał/nie zdał przed uruchomieniem, wynik jako D# w rejestrze decyzji projektu). Dla D2/farmer360.io spike nie uruchamiany — pierwszeństwo Standardu rozstrzygnęło wprost. Formalizuje też `docs/god-book/memory.md` (U.1) jako "bibliotekę przypadków" dla tej klasy kolizji (pełny opis: patrz "Od wersji 2.31" na górze dokumentu). Źródło: właściciel repo, bezpośrednia decyzja. **[Treść tej wersji skorygowana tego samego dnia w v2.32, patrz niżej — opis "spike nie uruchamiany, pierwszeństwo Standardu" był błędny.]** |
| 24.09.2026 | 2.32 | **KOREKTA v2.31 + nowa reguła Y.6/U.4.** (1) **Y.12** poprawione: dla D2/farmer360.io wybrana opcja "spike rozstrzyga przed decyzją" (nie "Standard wygrywa domyślnie") — błąd v2.31 wynikał z przypisania odpowiedzi właściciela repo o mechanizmie cyklu U.4/Y.6 do pytania o D2/Spike. Poprawiona procedura: 4 scenariusze testowe (offline, lista+sync, dostępność, BLE) z progami zdał/nie zdał ustalonymi przed startem, time-box 1-3 dni, reguła decyzyjna (wszystkie progi → migracja/B, niespełniony choć jeden, zwłaszcza dostępność → formalny wyjątek/A), wynik wraca do `docs/god-book/memory.md` przez U.2/U.4. D2 pozostaje **otwarte** do wyniku spike'a — spike jeszcze nieuruchomiony. (2) **Y.6/U.4** — cykl sprawdzania aktualizacji zmieniony ze sztywnych 12h na **adaptacyjny**: start 12h, wydłużaj ×1,5 (pułap 48h) po zerowym sprawdzeniu, reset do 12h po sprawdzeniu z realną nową treścią; jawnie dopuszczone świadome lokalne odstępstwo projektu (D# w `rejestr-decyzji.md`), zamykające retroaktywnie przypadek inzynier-offgrid-pro D21. Źródło obu: właściciel repo, bezpośrednia decyzja, ten sam dzień (pełny opis: patrz "Od wersji 2.32" na górze dokumentu, oraz dopiski [24.09.2026] w Y.6/U.4/Y.12). |
| 24.09.2026 | 2.33 | Rozszerzona **B.6** — obowiązkowy format pól per wpis `docs/lista-do-zrobienia.md`: priorytet, co odblokowuje, plusy/minusy zrobienia teraz, kolizje z innymi zadaniami listy, kolejność względem zadań powiązanych (duże przed mniejszymi zależnymi). Nowa **standard 15.21/15.22** — deklaracja stanu commit/push/PR/merge zawsze jako ostatnie zdanie odpowiedzi, nigdy w środku/na początku. Źródło obu: właściciel repo, bezpośrednia decyzja (pełny opis: patrz "Od wersji 2.33" na górze dokumentu). |
| 24.09.2026 | 2.34 | Format "świadomy wyjątek projektu" (**Y.2**) — wpis D# z nagłówkiem "WYJĄTEK OD REGUŁY RODZINY" + 4 pola, rejestrowany centralnie w `docs/god-book/memory.md` (nowa stała sekcja); **Y.11** sprawdza ten rejestr przed zgłoszeniem naruszenia. Nowy krok **U.3** — sesja nad `new-app-standards` sama sprawdza `docs/projekty-downstream.md`/rejestry decyzji projektów pod kątem kolizji przed akceptacją reguły "na stałe dla rodziny". Źródło: farmer360.io (U.4) + luka z Y.12, rozstrzygnięte przez właściciela repo (pełny opis: patrz "Od wersji 2.34" na górze dokumentu). |
| 24.09.2026 | 2.35 | Nowy punkt 7 w **Część D** — rozróżnienie "zachowanie informacji" od "poprawność merytoryczna materiału źródłowego": źródło (`docs/zrodla/`) nietknięte, poprawka trafia do dokumentu Biblii z adnotacją ✏️ (co podało źródło/na co poprawiono/dlaczego/podstawa) + poziom pewności ✅/🔎; Krok 8 (N.1) sprawdza kompletność adnotacji. Odpowiadający dopisek **15.1a** w standardzie. Źródło: farmer360.io (U.4, D21 tamtego projektu), rozstrzygnięte przez właściciela repo (pełny opis: patrz "Od wersji 2.35" na górze dokumentu). |
| 24.09.2026 | 2.36 | Rozszerzenie punktu 7 Części D + nowy dopisek **15.1b** w standardzie — weryfikacja merytoryczna nie ograniczona do transferu materiału do Biblii: AI porównuje każdą podawaną mu informację przez całą pracę ze swoją wiedzą ekspercką i zgłasza wprost rozjazd z rzeczywistością (nie tylko liczby — każde stwierdzenie), bez obawy przed sprzeciwieniem się poleceniu; podwyższona czujność przy materiale pochodzącym z innej sesji AI. Źródło: właściciel repo, bezpośrednie rozszerzenie żądania z wersji 2.35 (pełny opis: patrz "Od wersji 2.36" na górze dokumentu). |
| 24.09.2026 | 2.37 | Nowa **H.3 — kolizja ID (M#/D#) przy równoległych sesjach**: przed nadaniem numeru sprawdź najwyższy zajęty na gałęzi głównej (a), przy scalaniu jawnie sprawdź kolizje ID nie tylko konflikty tekstowe (b), przy kolizji mimo to — "pierwszy scalony zachowuje numer", drugi przenumerowany z wpisem w logu (c). Dotyczy M# (H.2) i D# (Krok 4/F.5) tym samym mechanizmem. Źródło: farmer360.io (U.4, 225 odwołań w 14 plikach do przenumerowania), wszystkie trzy elementy potwierdzone przez właściciela repo (pełny opis: patrz "Od wersji 2.37" na górze dokumentu). |
| 24.09.2026 | 2.38 | **KOREKTA sprzeczności Y.6 vs Y.8.** Zdanie "Konsekwencja" w Y.6 ("nigdy nie podmieniaj plików samodzielnie bez pokazania, co się zmieni"), zacytowane dosłownie w gotowym tekście do wklejenia dla nowej Routine Y.6, spowodowało regres — projekt zaczął pytać właściciela repo o każdą pojedynczą podmianę pliku, łącznie z kategorią NIETYKALNE, mimo że Y.8 dla NIETYKALNE/ADAPTOWALNE każe działać automatycznie ("napraw, nie negocjuj" / PATCH bez pytania). Rozstrzygnięcie (15.4, nie samodzielne): Y.8 ma pierwszeństwo dla obu tych kategorii — stosuj automatycznie, zaloguj w `docs/memory.md`, nie czekaj na potwierdzenie; obowiązek informowania/pytania z Y.6 zostaje wyłącznie dla plików nie mieszczących się jednoznacznie w żadnej kategorii, prawdziwego konfliktu (Y.2.2) i treści LOKALNE wymagającej wiedzy specyficznej dla projektu. Przywraca mechanizm sprzed regresu. Źródło: właściciel repo, bezpośrednie zgłoszenie (pełny opis: patrz "Od wersji 2.38" i dopisek "[24.09.2026] ✅ KOREKTA" w treści Y.6, na górze dokumentu). |
