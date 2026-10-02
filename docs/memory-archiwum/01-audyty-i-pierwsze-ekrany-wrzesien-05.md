# Archiwum docs/memory.md — 01-audyty-i-pierwsze-ekrany-wrzesien-05

**Przeniesiono:** 02.10.2026 (archiwizacja wg zasady z `docs/memory.md`, sekcja „Archiwizacja”) | **Źródło:** `docs/memory.md`, sekcje z linii 7–143 stanu sprzed archiwizacji | **Liczba sekcji:** 6
Plik jest append-only: treść pod znacznikiem to dosłowna kopia 1:1 (nic nie skrócono ani nie poprawiono). Indeks wszystkich plików archiwum: `docs/memory-archiwum/INDEKS.md`. Aktualne pułapki i decyzje w skrócie: `docs/memory.md`.

<!-- ARCHIWUM-1:1 — poniżej treść przeniesiona bez zmian z docs/memory.md, nie edytować wstecz -->

## Audyt GOD BOOK Część N (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, korekta wprost ("nie czytałeś GOD BOOK, tam jest opisany audyt, przeczytaj książkę i wszystkie standardy i podążaj według nich"). Wcześniejsze przejścia tej sesji (2026-09-03, "audyt zgodności ze standardem"; wpisy Y.9 z 2026-09-03/04) były checklistami **kompletności/synchronizacji** (Y.9 GOD BOOK) — sprawdzają, czy plik/rozdział istnieje i jest w aktualnej wersji. To **nie jest** to samo co Część N ("Audyt kompletności") — weryfikacja punkt-po-punkcie każdego materiału źródłowego względem faktycznie zintegrowanej treści, sprawdzana bezpośrednio w źródle, nie z pamięci. Pomylenie tych dwóch procedur w poprzednich przejściach było błędem, teraz naprawionym: przed audytem przeczytana w całości GOD BOOK (Części 0–Y, w tym Część X i Y dotąd nieczytane w tej sesji) oraz wszystkie 18 plików `docs/standards/` (00-INDEKS + 00–16).

**Wykonane sprawdzenia (N.1, bezpośrednio w źródle, nie z metryczki):**
1. `grep` dwukierunkowy `🔎 TD#` w kodzie ↔ `dlug-techniczny.md` — **znalezisko**: rejestr istniał od 04.09.2026, ale bez numerów TD# i bez ani jednego markera w kodzie, mimo że GOD BOOK v2.8 (rozszerzenie X.4, wprowadzone tego samego dnia co plik) tego wymaga. Naprawione: wpisy przenumerowane TD1–TD5 wg formatu X.4 (moduł/co skrócono/ryzyko/priorytet), dodane 5 markerów `🔎 TD#` w odpowiednich `calculator.ts`. Zweryfikowane po naprawie: `grep` w obie strony daje dokładnie 5/5 dopasowań, `tsc --noEmit` czysty (zmiana to tylko komentarze).
2. Własna sekcja źródła "Znane luki do domknięcia" (`docs/zrodla/Tresc_WSZYSTKIE_MODULY_scalone.md`, linie 138–143) skonfrontowana z `backlog-poza-v1.md`/`docs/rejestr-pokrycia.md`/`mapa-wdrozenia.md` — **znalezisko**: 4 pozycje uczciwie oznaczone przez autorów źródła (Moduł 6 Część 2A/2C/2D — alternatywne źródła ciepła, silnik czynników COP, silnik czynników zapotrzebowania; Asystent głosowy 12.41 — poza wzorcami A-H) nigdy nie trafiły do żadnego z naszych rejestrów śledzenia — dokładnie ten sam rodzaj przeoczenia co luka 1.19 znaleziona 2026-08-29 (deklaratywne "znane luki" źródła nie zostały przeliczone/przeniesione). Naprawione: skonsolidowane do `backlog-poza-v1.md`.
3. Stare wersje plików (git-mv artefakty, nazwy z poprzednich wersji GOD BOOK/CLAUDE template) — `find` po wzorcach `v2_[0-7]`, `*.md.bak` — czysto, brak stray plików (poprzednie sync'i Y.9 poprawnie usuwały stare nazwy, nie duplikowały).
4. Naming/branding konsystencja — sprawdzona wcześniej i na bieżąco przy każdym Y.9 sync (nie powtórzone od zera, N.1 punkt 3 wymaga tylko "wystarczająco, żeby nie blokowało domknięcia", nie osobnego pełnego przejścia).

**Świadomie NIE wykonane w tym przejściu (zakres, nie przeoczenie):** pełne, dosłowne porównanie każdej z 579 funkcji źródła z `docs/rejestr-pokrycia.md` linia po linii — rejestr już dokumentuje każdy zbudowany ekran z bezpośrednim odniesieniem do numeru linii/sekcji źródła i niezależną weryfikacją wzoru (widoczne w samym rejestrze), a moduły z ekranami wciąż zbiorczo `todo` (M3 ~44%, M5 ~5%, M6 ~15%, M7/M9/M10/M12/M13 po 1 ekranie) są już jawnie, uczciwie oznaczone jako niekompletne w `mapa-wdrozenia.md` — to nie jest ukryta luka w rozumieniu N.1, tylko widoczny, śledzony backlog. Pełne przejście funkcja-po-funkcji dla tych modułów to praca budowy ekranów (`docs/lista-do-zrobienia.md`), nie audytu.

**N.2 (audyt dwuwarstwowy) — zastosowanie do tego projektu:** ta Biblia nie ma jeszcze osobnych "rozdziałów" w sensie Części B.3 (jeden płaski zestaw plików w Filarze C, nie drzewo kategorii) — N.2 dosłownie nie ma dziś zastosowania (nie ma warstwy "przyrostowej po rozdziale" odrębnej od tego pełnego przejścia). Jeśli struktura się rozrośnie do dwupoziomowej, N.2 zaczyna obowiązywać od tego momentu, nie retroaktywnie.

## Audyt GOD BOOK Część N — pełne przejście 13 modułów (05.09.2026)

Kontynuacja audytu z sekcji wyżej ("Audyt GOD BOOK Część N (05.09.2026)"). Właściciel projektu zapytał wprost, dlaczego pierwsze przejście świadomie pominęło pełne porównanie 579 funkcji źródło-po-źródle — odpowiedź: skala (setki KB materiału źródłowego) sprawiła, że potraktowałem istniejące statusy `todo`/`blocked` w `mapa-wdrozenia.md` jako dowód "nic nie ukryte", bez realnej ponownej weryfikacji źródła. Właściciel zlecił zrobienie tego właściwie: **13 agentów równoległych, jeden na moduł, każdy czytający pełną treść źródłową swojego modułu i porównujący ją z rejestrami** — dokładnie metoda, którą znaleziono lukę 1.19.

**Wynik: 4 moduły (M1, M2, M5-częściowo, M7) bez ukrytych luk podobnych do 1.19; 9 modułów z realnymi znaleziskami.** Wszystkie naprawione w tym samym audycie (zarejestrowane, nie zawsze zbudowane — budowa nowych ekranów to osobny krok, nie audyt):

- **M3 (PV):** luka **2.15 "Zjawisko PID"** — gotowa treść źródłowa (Biblia, redakcyjnie odróżniona od LID/LETID), nigdy nieprzeniesiona do `Tresc_Modul_3_PV_Ekrany.md` (49/50 funkcji, nie 50/50 jak deklarowane) ani do żadnego rejestru. Dopisana jako `todo` w `docs/rejestr-pokrycia.md`. Dodatkowo: 4 istniejące partial-ekrany (napór wiatru, zacienienie-diody, dopasowanie-tablicy, panele-bifacjalne) nie miały wpisów TD#/markerów mimo udokumentowanego skrócenia — dodano TD9-TD12.
- **M4 (Baterie):** scalenie dawnej funkcji **6.13 → Ekran 15** (Cold Cranking Amps) potwierdzone w 3 źródłach, ale nigdzie nieodnotowane (w odróżnieniu od analogicznego 12.12→E23, które jest opisane) — poprawione ID Biblii na "3.17, 6.13" z notatką.
- **M5 (Okablowanie):** dostał pierwszą własną sekcję z pełną tabelą 29 ekranów (wcześniej rejestr nie miał sekcji M5 w ogóle, mimo zapowiedzi). **Kluczowe ustalenie: norma PN-IEC 60364-5-52 blokuje wyłącznie Ekran 1** — pozostałe 27 z 29 ekranów mają samodzielne wzory, niezależne od tej normy, buildowalne równolegle. Poprawiona liczba ekranów modułu (~20/21 → 29) w `mapa-wdrozenia.md`/`backlog-poza-v1.md`.
- **M6 (Ogrzewanie):** własny wcześniejszy wpis w `backlog-poza-v1.md` (z pierwszego przejścia audytu) miał błąd — błędnie przypisywał "COP pompy ciepła" do Części 2C. Poprawione. Znalezione i dopisane 2 nowe luki: **5.46 "ryzyko zamarznięcia dolnego źródła"** (twardy stop 🔴, gotowa treść) i **5.31 "hałas i wibracje"** — obie `todo` w rejestrze. Decyzja odrzucenia 5.42 (kolektor gruntowy, istniała tylko w tym logu) skonsolidowana do `backlog-poza-v1.md`.
- **M7 (StressTest):** brak ukrytej luki, ale brak granularności — dodana pełna tabela 26 ekranów (wcześniej tylko zbiorcze zdanie), z oznaczeniem 3 kandydatów budowalnych niezależnie od reszty modułu (Wind Chill — najsilniejszy, uniwersalna fizyka; Sztywnienie izolacji; Elektronika w mrozie).
- **M8 (Bezpieczeństwo):** **TD6** — UPS krytyczny buduje tylko warstwę sprzętową (11.54), warstwa AI priorytetyzacji (12.54) opisana słownie w rejestrze, ale bez formalnego wpisu długu/markera. Dodane.
- **M9 (ESP32):** Katalog czujników (`done`) nie ma pola "progi alarmowe", mimo że źródło wprost je specyfikuje jako trzecią właściwość instancji — **TD8**.
- **M10 (AI):** Ekran "Prognozy" był oznaczony jako pokrywający 6 funkcji (12.1-12.5,12.43), kod liczy tylko 3 (12.1,12.2,12.5) — **TD7**, notatka w rejestrze poprawiona.
- **M11 (Montaż baterii):** **realny konflikt A vs B, przedstawiony właścicielowi, nie rozstrzygnięty samodzielnie** — `Tresc_Modul_11_MontazBaterii_Ekrany.md` podaje próg różnicy napięć między ogniwami <0,05V, kanoniczna Biblia podaje <0,1V. Właściciel zdecydował: **zostaje 0,05V** (kod bez zmian). Dodatkowo: A2/A5 "świadomie odłożone" nie miały warunku powrotu — dopisany ("przy następnej rundzie Ścieżki A").
- **M12 (Kalkulator mobilny):** luka **8.8 "dobór regulatora PWM vs MPPT"** — gotowa treść źródłowa, nigdy nieprzeniesiona do `Tresc_Modul_12_Kalkulator_Ekrany.md` (deklaruje 70/70, faktycznie 69/70). Dopisana jako `todo`.
- **M13 (Tryb Live):** **D-1 (33 funkcje) potwierdzone jako poprawne** bezpośrednio w źródle (pozorne "brakujące" ID 7.9-7.25 to w rzeczywistości błędnie oznaczone nagłówki Rozdziału 6/Modułu 7, nie Trybu Live). Mniejsza luka: 7.7 "Powiadomienia push/SMS/e-mail" jest jedną z kanonicznych 33 funkcji, ale plik roboczy modułu (`Tresc_Modul_13_Live_Ekrany.md`) wymienia tylko 32 — dopisane jako `todo`, żeby nie zniknęło przy budowie biblioteki widżetów.

**Pliki źródłowe (`docs/zrodla/`) świadomie NIE edytowane** — zgodnie z GOD BOOK B.5 (materiały źródłowe niezmienne, tylko do odczytu). Wszystkie znalezione rozbieżności/literówki źródła (np. "57,6 kWh" dla 6×12V/200Ah w M4/Ekran 1 — matematycznie 14,4 kWh, zgadza się tylko dla 48V; błędne nagłówki "7.9-7.25" w Rozdziale 6 Biblii) zostały tu odnotowane, nie cicho poprawione w źródle ani w kodzie.

**Weryfikacja po zmianach:** `tsc --noEmit` czysto, `pnpm test` 467/467 (bez regresji — zmiany to komentarze `🔎 TD#` w 7 plikach + poprawki w rejestrach/dokumentacji, zero zmian logiki). Zmienione pliki: `docs/rejestr-pokrycia.md` (nowe wiersze M3/M6/M7/M9/M10/M12/M13, nowa sekcja M5, korekta ID M4/E15), `mapa-wdrozenia.md` (terminologia M2/M4, liczba ekranów M5), `backlog-poza-v1.md` (korekta M6, dodanie 5.42/A2-A5-warunek), `dlug-techniczny.md` (TD6-TD12, wersja 1.1→1.2).

## Decyzja procesowa: praca małymi partiami, rejestracja natychmiastowa (05.09.2026)

Właściciel projektu, po zobaczeniu wyników audytu 13 modułów: dyrektywa na przyszłość, nie tylko wniosek z przeszłości. Polecenie wprost: brać pod uwagę tę klasę błędów i już ich nie popełniać — sprawdzać, czy wszystko jest wpisane od razu, pracować małymi partiami kodu w pełni dopieszczonymi, zamiast budować szybko seriami i potem szukać błędów zbiorczym audytem. Zapisane jako **Dyrektywa #14** w `02_Dyrektywy_AI_Projektu.md` (P.3 GOD BOOK — dokument dyrektyw specyficznych dla projektu rośnie właśnie w reakcji na takie odkrycia). Konsekwencja praktyczna na przyszłość: przy pracy nad kolejnym ekranem/funkcją — sprawdzić w tym samym kroku sąsiadujące pozycje tej samej sekcji źródła i nadać im wiersz w `docs/rejestr-pokrycia.md` (nawet `todo`), zamiast zostawiać je bez wiersza do wyłapania przy następnym audycie.

## Ekran A2, Moduł 11 (Montaż mechaniczny + separacja ogniw) — 05.09.2026

Autor poprosił o dokończenie sekcji "łączenia akumulatorów" (Moduł 11, Ścieżka A LiFePO4) — będzie
montował realny pakiet 16S i potrzebuje wszystkich funkcji tej ścieżki gotowych, budowanych po
kolei małymi partiami (zgodnie z Dyrektywą #14, ustaloną tego samego dnia). Ustalono zakres: cała
Ścieżka A (A1-A10), włącznie z A2 i A5 dotąd świadomie odłożonymi.

**A2 zbudowany jako pierwszy.** `lib/core/modules/montaz-baterii/montaz-mechaniczny/` — **wzorzec
"echo" w praktyce**: docisk (300-400 kgf) reużywa gotowego progu i komunikatów ostrzegawczych z
Modułu 4/Ekran 21 (`pozycjonowanie-ogniw/{constants,warnings}.ts`), zamiast duplikować — źródło
wprost każe użyć tego samego progu ("cross-ref Moduł 4, Ekran 21"). Checklist 3-punktowy
(separatory/krawędzie/obudowa) bez własnej logiki liczbowej, ten sam wzorzec co A7. 7 testów
(nominalny/graniczny/oba kierunki poza zakresem/błędne dane/brak danych/checklist niepełny mimo
docisku w zakresie). Zarejestrowany od razu: `docs/rejestr-pokrycia.md`, `mapa-wdrozenia.md`
(19/22→20/22), `backlog-poza-v1.md` (A2 wykreślone z listy odłożonych, A5 zostaje), `lib/pulpit/registry.ts`.

Zweryfikowane: `tsc --noEmit` czysto, `pnpm test` 474/474, `pnpm lint` czysto, `pnpm build` (nowa
trasa `/kalkulatory/montaz-mechaniczny` w liście, zero błędów kompilacji).

**A5 zbudowany jako druga, osobna partia (ta sama sesja).** `lib/core/modules/montaz-baterii/pierwsze-uruchomienie/`
— prąd testowy `I=0,1C×C_Ah` liczony wprost z pojemności (1:1 ze źródła), próg Top Balancing (3,55V)
sprawdzany jako kamień milowy poziomu `info` (Dyrektywa #6 — nigdy nie podnosi statusu), checklist
2-punktowy dla reszty kroków. 7 testów. Zarejestrowany od razu: `docs/rejestr-pokrycia.md`,
`mapa-wdrozenia.md` (20/22→21/22, **Ścieżka A LiFePO4 teraz kompletna 10/10**), `backlog-poza-v1.md`
(wpis "odłożone" oznaczony jako zamknięty, nie usunięty), `lib/pulpit/registry.ts`.

Zweryfikowane: `tsc --noEmit` czysto, `pnpm test` 481/481, `pnpm lint` czysto, `pnpm build` (nowa
trasa `/kalkulatory/pierwsze-uruchomienie`, zero błędów). Obie partie (A2, A5) budowane i
commitowane osobno, zgodnie z Dyrektywą #14 — żadna nie czekała na drugą do zarejestrowania.

## Ekran 6, Moduł 5 (Dobór bezpieczników i rozłączników) — 05.09.2026

Autor poprosił o zajęcie się "przewodami" (Moduł 5, Okablowanie) — wybrał start od Ekranu 6
(Bezpieczniki/rozłączniki DC) + Ekranu 22 (String Box), zamiast czekać na zablokowany Ekran 1
(brak normy PN-IEC). Budowane po kolei, osobno, zgodnie z Dyrektywą #14.

**Ekran 6 zbudowany jako pierwszy.** `lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/`
— **wzorzec "echo"**: wzór `I_bezpiecznik=1,25×I` jest identyczny z Ekranem 22 Modułu 3
(`ochrona-stringow`), więc zamiast duplikować, wyekstrahowano `obliczPradBezpiecznikaA()` do
kanonicznego miejsca (`ochrona-stringow/calculator.ts`) i zaimportowano tutaj — refaktor
zweryfikowany (istniejące 6 testów `ochrona-stringow` przeszły bez zmian). Twardy stop AIC < prąd
zwarciowy (1:1 ze źródła 🔴) — prąd zwarciowy dziś ręczny wpis (docelowo z Ekranu 12, Analiza
zwarciowa, jeszcze niezbudowanego), sprawdzenie jawnie pomijane (nie fałszywie "OK"), dopóki oba
pola (AIC + prąd zwarciowy) niepodane — `aicWystarczajace: boolean | null`. Koordynacja
selektywności z Ekranem 13 świadomie NIE sprawdzana (ekran nie istnieje) — w `assumptions`, nie
cicho pominięta. 7 testów.

Zarejestrowane od razu: `docs/rejestr-pokrycia.md` (sekcja Moduł 5, wiersz Ekran 6 → done),
`mapa-wdrozenia.md` (1/29→2/29), `lib/pulpit/registry.ts`. Zweryfikowane: `tsc --noEmit` czysto,
`pnpm test` 488/488, `pnpm lint` czysto, `pnpm build` (nowa trasa, zero błędów).

**Ekran 22 zbudowany jako druga, osobna partia (ten sam wątek).** `lib/core/modules/okablowanie/string-box/`
— twardy stop 1:1 ze źródła: brak skrzynki IP66 przy łączeniu stringów na wolnym powietrzu
(checkbox domyślnie `false`, dane bezpieczeństwa nigdy jako ukryty domyślny "tak", UI_GUIDE §5).
Bezpiecznik stringowy sprawdzany wobec zakresu 15-20A/string, liczba wejść skrzynki vs liczba
stringów — oba jako opcjonalne sprawdzenia (`boolean | null`, ten sam wzorzec co Ekran 6, pomijane
jawnie w `assumptions` dopóki niepodane, nie fałszywie "OK"). SPD Typ 2 i rozłącznik izolacyjny DC
świadomie NIE liczone — źródło nie podaje parametrów. 8 testów.

Zarejestrowane od razu: `docs/rejestr-pokrycia.md`, `mapa-wdrozenia.md` (2/29→3/29),
`lib/pulpit/registry.ts`. Zweryfikowane: `tsc --noEmit` czysto, `pnpm test` 496/496, `pnpm lint`
czysto, `pnpm build` (nowa trasa, zero błędów). Obie partie tego wątku (Ekran 6, Ekran 22)
budowane i commitowane osobno, zgodnie z Dyrektywą #14.

## Norma PN-HD 60364-5-52:2011 dostarczona i przeanalizowana (05.09.2026)

Właściciel projektu kupił i dostarczył (push bezpośrednio do `main`, plik 45 MB) brakującą normę
blokującą M5/Ekran 1 ("mega-Doradca doboru kabla"), M11/B5 i M4/Ekran 25 — dokładnie tę, o której
brak wspominał `backlog-poza-v1.md` od 04.09.2026.

**Naprawiony dryf przy okazji:** nazwa pliku dostarczona z macOS miała polskie znaki zapisane w
formie zdekomponowanej Unicode (NFD — "ę" jako "e"+U+0328), w odróżnieniu od NFC/ASCII używanego
we wszystkich pozostałych plikach `docs/zrodla/`. Realny problem, nie kosmetyczny: powodował
`FileNotFoundError` przy próbie odczytu przez standardowe API (mimo że `ls` pokazywał plik
poprawnie). Przemianowano na ASCII (`git mv`, wykryty poprawnymi bajtami przez `os.listdir`),
zgodnie z konwencją reszty folderu.

**Analiza:** PDF to skan (96 stron, 0 znaków przy bezpośredniej ekstrakcji tekstu) — zainstalowano
`tesseract-ocr` + pakiet polski, wyrenderowano wszystkie strony (300 DPI) i wykonano OCR. Zbudowano
mapę struktury dokumentu (klauzule 520-529 = tekst normatywny, Załączniki A-I + ZA-ZC = tabele i
odstępstwa krajowe) i podzielono na 19 plików w `docs/zrodla/norma-PN-HD-60364-5-52/` (indeks:
`00-INDEKS.md`) — jeden plik na rozdział/załącznik, mirror konwencji `Tresc_Modul_N` już istniejącej
w tym folderze.

**Kluczowe empiryczne odkrycie o jakości OCR (Dyrektywa #3 w praktyce):** zweryfikowano Tablicę
B.52.4 (obciążalność prądowa PVC/3 żyły/miedź-aluminium) równolegle OCR-em i bezpośrednim odczytem
obrazu strony — sam skan jest bardzo czytelny, ale OCR ma realne, ciche błędy w cyfrach na tej
jednej tabeli (`2,5`→`28`, `13,5`→`13:95`, `77`→`Ł44` w jednej komórce). Wniosek zapisany jawnie w
`00-INDEKS.md`: **każda konkretna liczba z tabel Załącznika B/C/E/G użyta w kodzie kalkulatora musi
być zweryfikowana wizualnie względem renderu oryginalnej strony PDF, nie ufać samemu tekstowi OCR.**
Renderowanie strony z PDF jest szybkie (~70s dla wszystkich 96 stron przy 300 DPI) — nie ma potrzeby
trzymać wyrenderowanych obrazów w repo, można je odtworzyć na żądanie przy weryfikacji konkretnej tabeli.

**Status:** dokument przeanalizowany i podzielony, ale **jeszcze niewykorzystany w kodzie** — M5/E1,
M11/B5, M4/E25 pozostają `⚠️ blocked` do czasu osobnej sesji budowy tych ekranów (transkrypcja
konkretnych potrzebnych tabel + kod kalkulatora, po kolei małymi partiami zgodnie z Dyrektywą #14).

