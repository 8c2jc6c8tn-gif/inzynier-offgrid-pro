# docs/memory.md — Inżynier Offgrid Pro

Żywy log decyzji, pułapek i stanu tego konkretnego projektu. Format i zasada aktualizacji: `docs/standards/14-proces-i-pamiec.md` (14.5). Nie duplikuje `ZASADY_APLIKACJI.md`/`USTALENIA.md` (te są konstytucją projektu, nadrzędną wobec kodu) ani `docs/standards/` (te są standardem wspólnym dla całej rodziny aplikacji) — tu trafia to, co specyficzne dla *tego* repo i *tej* historii pracy.

---

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

## Synchronizacja ze standardem

<!-- Obowiązkowe od GOD BOOK Część Y.6. Sprawdzaj AKTUALIZACJE.md w new-app-standards co ≤3 godziny (GOD BOOK v2.18, było ≤7 dni). Brak wpisu = "nigdy nie sprawdzono". -->
- **2026-09-03 — pełna synchronizacja wykonana** (pierwsza, wcześniej nie istniała). Odświeżono `docs/standards/00`–`16` (dodano brakujący rozdział 16), dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, `PROMPT_STARTOWY.md`, `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`. Punktowo poprawiono `CLAUDE.md` i `.claude/skills/standards/SKILL.md` (nowe odsyłacze do GOD BOOK Część Y, bez nadpisania lokalnej treści). Szczegóły niżej, sekcja "Decyzje i uzasadnienie". Świadomie NIE wykonano: migracji `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/domena/` (nazwa sprzed zmiany 2026-09-04, patrz niżej) do kanonicznego formatu GOD BOOK (`00_Biblia.md` itd.) — to osobna, większa decyzja, patrz `docs/lista-do-zrobienia.md`.
- **2026-09-04 — sprawdzono `AKTUALIZACJE.md`, znaleziono i zsynchronizowano 2 nowe wersje (v2.4, v2.5).** Obie dot. GOD BOOK: nowa, obowiązkowa **Y.9** — 9-pozycyjna checklist kompletności do przejścia przy *każdym* sprawdzeniu (nie tylko pierwszej instalacji), jawnie raportowana właścicielowi. `docs/standards/00`–`16` — bez zmian merytorycznych (tylko 2 kosmetyczne odsyłacze do nazwy pliku GOD BOOK w `00-INDEKS.md`/`00-filozofia.md`). Wykonane: podmieniono GOD BOOK w całości (`...v2_3.md` → `...v2_5.md`, stara nazwa usunięta, NIETYKALNE), nadpisano `PROMPT_STARTOWY.md` w całości (NIETYKALNE), punktowo poprawiono odsyłacze do wersji w `docs/standards/00-INDEKS.md`/`00-filozofia.md`/`CLAUDE.md`/`README.md` oraz `.claude/skills/standards/SKILL.md` (dodatkowo: doprecyzowanie punktu 2 o wariant pełnej Biblii, ADAPTOWALNE).
  **Wynik checklisty Y.9 (pokazany właścicielowi projektu przed uznaniem za zakończone):**
  1. `docs/standards/` — ✅ aktualne (odświeżone odsyłacze).
  2. GOD BOOK — ✅ podmienione na v2.5.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` (nie pełna Biblia) — ✅ istnieje; treść nietknięta (LOKALNE). Otwarta decyzja o migracji do kanonicznego formatu GOD BOOK pozostaje nierozstrzygnięta (patrz niżej i `docs/lista-do-zrobienia.md`).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ⚠️ w momencie sprawdzenia formalnie brakowało (folder nazywał się `docs/domena/`) — **rozstrzygnięte tego samego dnia**, patrz wpis niżej "Zmiana nazwy `docs/domena/` → `docs/zrodla/`".
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, spatchowane.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — nie dotyczy (projekt nie prowadzi pełnej Biblii, tylko `docs/memory.md`).
  Zweryfikowano: `grep -rn "v2_3"` w projekcie po synchronizacji trafia wyłącznie w historyczne wpisy tego logu i `docs/lista-do-zrobienia.md` (poprawnie — append-only, nie nadpisuje się historii) oraz w CHANGELOG samego pliku GOD BOOK (odniesienia do własnych, starszych wersji — też poprawne).
- **2026-09-04 — pełna Biblia GOD BOOK napisana; `AKTUALIZACJE.md` sprawdzone ponownie, bez nowych wpisów od poprzedniego sprawdzenia tego samego dnia (nadal v2.5).** Migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md` do kanonicznego formatu, wykonana na wyraźne polecenie właściciela projektu (poprzednio otwarta jako "czeka na decyzję" — patrz wpis wyżej i `docs/lista-do-zrobienia.md`). **Aktualizacja checklisty Y.9** (poprzedni wynik wyżej, punkty 4 i 9, zostaje jako historyczny snapshot — to nowy, osobny przebieg checklisty, nie edycja starego):
  1–3, 5–8. Bez zmian od poprzedniego sprawdzenia (✅).
  4. `docs/memory.md`/pełna Biblia — **✅➕ teraz PEŁNA BIBLIA istnieje**: `00_Biblia.md` + 11 dokumentów Części S (`01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `zlote-zasady.md`, `rejestr-decyzji.md`, `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`, `mapa-wdrozenia.md`, `backlog-poza-v1.md`, `dlug-techniczny.md`; `docs/zrodla/` i `docs/lista-do-zrobienia.md` już istniały = 14/14 pozycji Części S kompletne). `docs/memory.md` zostaje jako główny, szczegółowy dziennik roboczy — rozróżnienie od `rejestr-decyzji.md` opisane w nagłówku tego drugiego pliku.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — **✅➕ dotyczy teraz, oba istnieją.**
  `ZASADY_APLIKACJI.md`/`USTALENIA.md` oznaczone na nagłówku jako historyczne/zastąpione (Część D GOD BOOK — nic nie usunięte, cała treść zmapowana 1:1 do nowych plików, mapowanie w `00_Biblia.md`).
- **2026-09-04 — sprawdzono `AKTUALIZACJE.md` ponownie (na żądanie właściciela projektu, "audyt zgodnie z książką" po zamknięciu ekranu M8/E2), znaleziono i zsynchronizowano 3 nowe wersje GOD BOOK (v2.5→v2.8).** Zmiany merytoryczne: U.4 (zbieranie wkładu z `docs/wklad-do-standardu.md` projektów downstream wprost z dysku — dotyczy tylko sesji nad `new-app-standards`, brak akcji tutaj), N.2 (audyt dwuwarstwowy dla Biblii wielorozdziałowej — przyrostowo po każdym rozdziale/Fazie ORAZ w pełni na końcu, nigdy podział pracy między warstwami), X.4 rozszerzone o kotwiczenie długu technicznego markerami `🔎 TD#` w kodzie (audyt Część N sprawdza zgodność `dlug-techniczny.md` ↔ kod przez grep w obie strony — dług nieudokumentowany i wpisy-widma). `docs/standards/00`–`16` bez zmian merytorycznych (tylko odsyłacze do nazwy pliku GOD BOOK w `00-INDEKS.md`/`00-filozofia.md`, jak poprzednio).
  **Wynik checklisty Y.9 (9 pozycji, pokazany właścicielowi projektu przed uznaniem za zakończone):**
  1. `docs/standards/00`–`16` + `00-INDEKS.md` — ✅ aktualne (2 pliki nadpisane, tylko odsyłacz do wersji GOD BOOK się zmienił).
  2. GOD BOOK — ✅ podmienione w całości (`...v2_5.md` → `...v2_8.md`, stara nazwa usunięta, `git rm`+dodanie nowego pliku).
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany (PATCH, reszta treści nietknięta).
  4. Pełna Biblia (Część S, 14 pozycji) — ✅ komplet nadal istnieje (`00_Biblia.md` + 11 dokumentów + `docs/zrodla/` + `docs/lista-do-zrobienia.md`), sprawdzone ponownie że żadna pozycja nie zniknęła.
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje; przy okazji naprawiony drobny dryf: nagłówek pliku wciąż twierdził "ten projekt nie ma jeszcze pełnej Biblii" mimo że `00_Biblia.md` powstał 2026-09-04 — poprawione na aktualny opis (Y.2.1, dryf bez świadomej decyzji, nie konflikt).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany (PATCH).
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją; zweryfikowano że §10 (`01_Zasady_Pracy_i_Konwencje.md`) faktycznie odsyła do `docs/standards/10-testy.md`/`11-ci-deployment.md` (nie lokalny wynalazek sprzed integracji) — odsyłacz do wersji GOD BOOK zaktualizowany.
  Dodatkowo poprawione odsyłacze do wersji (nie pozycje Y.9 same w sobie, ale te same pliki, spójność): `README.md`, `PROMPT_STARTOWY.md`, `00_Biblia.md`, `ZASADY_APLIKACJI.md`, `USTALENIA.md`.
  Zweryfikowano: `grep -rln "instrukcja-uniwersalna-biblii-projektu-v2_5"` po synchronizacji — zero trafień w całym repo. Pozostałe historyczne wzmianki starszych wersji (v2_3) w tym logu i `docs/lista-do-zrobienia.md` celowo nietknięte (append-only, Część D GOD BOOK).
  **Nie wykonano (świadomie, poza zakresem tej sesji):** dopisanie tego projektu do `docs/projekty-downstream.md` w `new-app-standards` (U.4) — wymagałoby zmiany w repo `new-app-standards`, nie tutaj; do rozważenia przy najbliższej sesji nad tamtym repo.
- **2026-09-15 — sprawdzono `AKTUALIZACJE.md` (11 dni zaległości, ostatni sync 04.09.2026 przy v2.8; lokalny klon `new-app-standards` był 25 commitów za `origin/main` — wykonano `git fetch`+`git pull` przed odczytem, zgodnie z Y.6 1a/1b, żeby nie powtórzyć błędu "nieodświeżony klon = fałszywe 'brak nowości'"). Znaleziono i zsynchronizowano 15 wpisów logu (v2.8→v2.17). Pełna synchronizacja wykonana na wyraźne polecenie właściciela projektu, po zaprezentowaniu zakresu i uzyskaniu zgody (Y.6 punkt 7).**
  **Zmiany merytoryczne z realnym wpływem na ten projekt (zaplanowane, NIE wdrożone w tej sesji — zgodnie z zakresem zgody "sync dokumentacji, nie kodu"):**
  1. **Rozdz. 17 (i18n), nowy — 17.2 rozstrzyga kolizję zgłoszoną przez TEN projekt**: Kernel ma zwracać klucze tłumaczeń, nigdy gotowy tekst — PATCH do 01.1/03.2/04 (assumptions jako klucz+parametry, `Warning` zwraca wyłącznie `kod`). **Dzisiejszy kod całego `lib/core/modules/` zwraca wprost polski tekst w `assumptions` i komunikatach `Warning` — to niezgodność do zaplanowania**, nie pilna (tak formułuje sam standard). Do dopisania jako pozycja w `docs/lista-do-zrobienia.md`, gdy projekt zdecyduje się na i18n.
  2. **Rozdz. 18 (logowanie/konta), nowy** — obowiązkowy wzorzec (Supabase Auth, magic link/Google/Apple, sesja w HttpOnly cookie, sync = Seed nigdy Wynik). Projekt nie ma jeszcze żadnego logowania — nowy, duży temat do zaplanowania od Kroku 2 GOD BOOK, nie tylko doczytania rozdziału. Nasza własna propozycja `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` (SZKIELET, 06.09.2026) została jawnie wymieniona jako jeden ze źródeł tego rozdziału — oznaczona tam jako rozstrzygnięta (nagłówek), treść zachowana jako historyczny zapis analizy.
  3. **Rozbudowa rozdz. 09 (AI w produkcie)** — konkretny kontrakt `AiToolDefinition<TInput,TOutput>` (read/write, `requiresConfirmation` dla write), AI teraz obowiązkowe (nie opcjonalne) jako warstwa wyłącznie-online nad rdzeniem. Projekt nie ma jeszcze AI w runtime — do zaplanowania, nie pilne.
  4. **Rozbudowa rozdz. 12 (freemium)** — trial dwuetapowy (FREE bez karty → PRO z kartą 24h), płaski podział FREE/PRO. Projekt nie ma jeszcze freemium wdrożonego — do zaplanowania.
  5. Reszta (rozdz. 03, 04, 05, 06, 10, 14, 15 — poprawki techniczne: wynik wielopolowy z `calculatorVersion`/`traceId` obowiązkowym, Blob z Web Workera odtwarzany przed zapisem do IndexedDB na Safari/iOS, `ALTER DATABASE ... SET` zakazane na hostowanym Postgresie z RLS, K1–K8 audyt modułu, higiena okna kontekstu/`/compact`, zakaz lokalnego dopisywania do mirrora standardu) — czysto techniczne, NIETYKALNE, bez decyzji do podjęcia. Zweryfikowano: projekt dziś nie używa `ALTER DATABASE`, nie kompresuje plików w Web Workerze do IndexedDB — te dwie pułapki nie dotyczą jeszcze tego kodu.
  **Wykonane w tej sesji:** nadpisano `docs/standards/00-INDEKS.md`, `00-filozofia.md`, `03`, `04`, `05`, `06`, `09`, `10`, `12`, `14`, `15` w całości; dodano nowe `17-i18n.md`, `18-logowanie.md`; podmieniono GOD BOOK w całości (`...v2_8.md` → `...v2_17.md`, `git rm`+nowy plik); nadpisano `PROMPT_STARTOWY.md` w całości (nowe: sekcja języka/persony/trybów rozszerzona, higiena okna kontekstu); PATCH (nie REWRITE) do `CLAUDE.md` (nowa sekcja "Zasady bezwzględne" z wypełnionym TODO ekspertyzy: "projektowanie i instalacja systemów fotowoltaicznych off-grid", akapit o micie `docs/standards/*` jako NIETYKALNE mirror, akapit `/compact` w Definicji ukończenia, licznik rozdziałów 17→19); odświeżono odsyłacze do wersji GOD BOOK w `USTALENIA.md`, `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`, `.claude/skills/standards/SKILL.md`, `docs/lista-do-zrobienia.md`.
  **Wynik checklisty Y.9 (9 pozycji):**
  1. `docs/standards/00`–`18` + INDEKS — ✅ aktualne (odświeżone w tej sesji).
  2. GOD BOOK — ✅ podmienione na v2.17.
  3. `CLAUDE.md` — ✅ istnieje, spatchowane (PATCH, nie REWRITE — cała lokalna adaptacja zachowana).
  4. Pełna Biblia (Część S, 14 pozycji) — ✅ komplet nadal istnieje, zweryfikowane ponownie że żadna pozycja nie zniknęła.
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz do wersji zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją.
  **Moduł opcjonalny Y.10 (osobno od Y.9, nie automatyczny) — NIE zainstalowany w tej sesji, świadomie:** `docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md` (playbook uogólniony z naszego własnego zgłoszenia z 06.09.2026) i skanonizowany `docs/biblioteka-norm/` w `new-app-standards` (dla którego TEN projekt był źródłem plików, commit `d7c81d1`) — projekt ma dziś normy w `docs/zrodla/` w innej, lokalnej strukturze; zgodnie z Y.10 ("nigdy automatycznie, tylko po jawnym potwierdzeniu dopasowania") to osobna propozycja do zatwierdzenia, nie część tej synchronizacji. Do rozważenia w kolejnej sesji, jeśli właściciel projektu chce ujednolicić strukturę z kanonicznym modułem.
  Zweryfikowano: `grep -rln "v2_8"` po synchronizacji — zero trafień poza historycznymi wzmiankami (ten log, `docs/lista-do-zrobienia.md`, `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` — jawnie oznaczone jako nieaktualne odniesienie w statusie na górze pliku — i changelog GOD BOOK samego, odniesienia do własnych starszych wersji), zgodnie z Częścią D GOD BOOK (append-only, historia nie jest cicho nadpisywana).
- **2026-09-15 (druga synchronizacja tego dnia) — `AKTUALIZACJE.md` sprawdzone ponownie na wyraźną
  wskazówkę właściciela projektu ("odpowiedź znajdziesz w nowej aktualizacji"), przed rozpoczęciem
  pracy nad rozdz. 18 (logowanie). `git fetch`+`git pull` w lokalnym klonie `new-app-standards`
  ujawniło 8 nowych commitów od poprzedniej synchronizacji (GOD BOOK bez zmiany wersji, wciąż
  v2.17 — tylko 6 plików `docs/standards/` zmienionych: `00-INDEKS`, `04`, `06`, `07`, `11`, `18`).**
  Nadpisane wszystkie 6 w całości (NIETYKALNE). Treść: dokończenie audytu bezpieczeństwa sesji
  zainicjowanego przy poprzedniej synchronizacji — nowa **7.7** (sanityzacja XSS u źródła, zakaz
  `dangerouslySetInnerHTML`/regex-filtrów dla treści użytkownika), dopisek do **7.3** (CSP +
  `X-Frame-Options`/`frame-ancestors` przeciw clickjackingowi), nowa **6.6** (SSRF — reguła
  warunkowa, tylko gdy backend robi fetch na URL od użytkownika), nowa **7.4** pozycja checklisty
  (SQL wyłącznie przez ORM/bind params, nigdy konkatenacja — osobne zagrożenie od RLS 6.5), nowa
  **11.5** (audyt podatności zależności jako bramka CI). Plus **18.15** (moduł opcjonalny — transfer
  danych między powiązanymi appkami rodziny przez plik, nie przez żywe połączenie baz) i dopisek do
  **18.2** (magic link a open redirect na URL powrotny).
  **Sprawdzone względem TEGO kodu (nie zgadywane):** `grep` na `dangerouslySetInnerHTML`/`innerHTML`
  — 2 wystąpienia, oba na treści statycznej autorskiej (skrypt inicjalizacji motywu w
  `app/layout.tsx`, definicje symboli SVG w `components/kafle-ikony/definicje-symboli.tsx`), **nie**
  treści od użytkownika — 7.7 nie jest naruszona, tylko warta odnotowania jako sprawdzona świadomie.
  6.6 (SSRF) i 7.4-SQL nie mają jeszcze zastosowania — projekt nie ma backendu wykonującego fetch na
  URL od użytkownika ani żadnych zapytań SQL (brak Supabase/bazy na razie). **11.5 nieaktualne do
  wdrożenia — projekt nie ma jeszcze żadnego CI** (`.github/` nie istnieje), znana, już zapisana luka.
  **Wykonane od razu, niezależnie od tematu logowania (7.3 — realny, zero-zależnościowy gap):**
  `next.config.mjs` nie miał ŻADNEGO nagłówka bezpieczeństwa. Dodano `headers()`: CSP (`script-src`
  ograniczony do `'self'` + SHA-256 hash jedynego inline-skryptu w apce — `WYGLAD_INIT_SCRIPT` z
  `app/layout.tsx`, nie `'unsafe-inline'`; w dev mode CSP celowo łagodniejsza dla React Refresh/HMR),
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Strict-Transport-Security`, `Permissions-Policy` (odmawia camera/microphone/geolocation — apka
  dziś nie używa żadnego z tych API, zweryfikowane grepem). Krzyżowy komentarz w obu plikach
  (`next.config.mjs` ↔ `app/layout.tsx`) tłumaczący, że zmiana treści skryptu wymaga przeliczenia
  hasha — inaczej CSP ubiłaby skrypt po cichu (błysk domyślnego wyglądu, bez widocznego błędu).
  Zweryfikowano: `tsc`/`lint`/`build` czyste, `pnpm start` + `curl -D-` potwierdza realne wysyłanie
  wszystkich 6 nagłówków z poprawną treścią CSP. **Nie zweryfikowano w headless browserze** (brak
  pakietu `playwright` jako zależności projektu, tylko sama binarka Chromium w środowisku) — hash
  wyliczony bezpośrednio z tego samego stringa co w kodzie, `dangerouslySetInnerHTML` nie przechodzi
  przez minifikację JS, więc ryzyko rozjazdu niskie, ale to rozumowanie, nie potwierdzenie wizualne.
- **2026-09-16 — CI (11.2/11.5) zbudowane, luka z wpisu wyżej ("projekt nie ma jeszcze żadnego
  CI") zamknięta.** `.github/workflows/ci.yml`, dwa niezależne joby na `pull_request` + `push`
  do `main`, rozdzielone celowo (znany, nienaprawialny natychmiast high w jednej zależności nie
  ma blokować mergowania czystego fixa lintera w drugim, i odwrotnie):
  - `quality` — `pnpm lint` → `pnpm typecheck` (nowy skrypt, `tsc --noEmit` — nie istniał wcześniej
    jako skrypt npm, tylko wywoływany ręcznie przez sesje AI) → `pnpm test` → `pnpm build`, na
    `pnpm/action-setup` + `actions/setup-node@22` z cache pnpm, `pnpm install --frozen-lockfile`
    (11.1 — lockfile jako źródło prawdy instalacji, nie tylko lokalnie).
  - `dependency-audit` — `pnpm audit --audit-level=high` (11.5, dosłownie z treści reguły).
  **Decyzja zakresu (to, co ta reguła sama nazywa "większą decyzją, nie mechaniczną łatką"):**
  pierwsze uruchomienie audytu **nie przechodziło** — 22 podatności `high` (`brace-expansion`,
  `js-yaml`, `fast-uri`, `postcss`, `sharp`), gdyby CI powstało wcześniej i włączono bramkę bez
  sprawdzenia, pierwszy PR zostałby zablokowany od zera. Rozstrzygnięcie: **nie** obniżono progu
  i **nie** dodano wyjątku/`--production`/allowlisty — sprawdzono każdą pozycję i naprawiono to,
  co naprawialne w granicach już zadeklarowanych zakresów `package.json` (żadna zmiana major, żadne
  ręczne podniesienie zakresu semver):
  1. `postcss` (`^8.5`, zależność bezpośrednia — dokładnie przypadek, który 11.5 nazywa
     najpoważniejszym) miał zainstalowaną `8.5.6` < łatka `8.5.12` mimo że zakres to dopuszczał —
     `pnpm update postcss` wystarczyło.
  2. Pozostałe 4 pakiety (`brace-expansion`/`js-yaml`/`fast-uri`/`sharp`) to zależności przechodnie
     dev-only (łańcuchy `eslint-config-next→...→minimatch`, `shadcn→cosmiconfig`/`@modelcontextprotocol/sdk→ajv`)
     plus `next→sharp` (produkcyjna, ale nieużywana realnie — `images.unoptimized: true` w
     `next.config.mjs`, zweryfikowane wcześniej). `pnpm update` (bez argumentu, w granicach
     zakresów `^` już zadeklarowanych) podciągnął `eslint-config-next`/`shadcn`/`react`/
     `react-dom`/`@base-ui/react`/`lucide-react`/`zod`/`tailwind-merge`/`@types/*` do najnowszych
     wersji dopuszczonych przez istniejące zakresy — to rozwiązało wszystkie 4 pozostałe pakiety
     przez łańcuch zależności, bez ręcznej ingerencji w `overrides`/`resolutions`.
  Wynik: `pnpm audit --audit-level=high` → **0 podatności** (`No known vulnerabilities found`).
  Zero wyjątków zapisanych — nie było potrzeby, każda pozycja miała realną łatkę w already-declared
  zakresie. **Zweryfikowano po zmianie zależności** (nie tylko sam audyt): `lint`/`typecheck`/
  `test` (660/660)/`build` — wszystkie czyste, żadna z podniesionych wersji nie złamała niczego.
  Dodane `packageManager: "pnpm@10.33.0"` do `package.json` (wzmacnia 11.1 — jawna, reprodukowalna
  wersja menedżera pakietów w CI, nie tylko lockfile). Jeden lockfile (`pnpm-lock.yaml`) — bez zmian
  w tej zasadzie, tylko zaktualizowany.
  **Korekta tego samego dnia:** poprzednia wersja tego wpisu twierdziła, że `moderate`/`low`
  (18+3) zostały świadomie zostawione — nieprawdziwe, nie zweryfikowane wystarczająco (sprawdzony
  był tylko `pnpm audit --audit-level=high`, nie pełny `pnpm audit` bez filtra poziomu). Pełny
  `pnpm audit` (bez `--audit-level`) po tym samym `pnpm update` daje **0 podatności wszystkich
  poziomów** (`metadata.vulnerabilities` z `--json`: info/low/moderate/high/critical = 0) —
  `eslint-config-next`/`shadcn`, źródło większości `moderate`/`low`, to te same łańcuchy zależności
  co naprawione `high`. Nic do zaostrzenia — próg `high` w CI (11.5) dziś i tak nie miał nic do
  odfiltrowania.
- **2026-09-16 (na wyraźne polecenie właściciela projektu — "Aktualizacje.md") — sprawdzone
  `AKTUALIZACJE.md` w lokalnym klonie `new-app-standards` (`git fetch`+`git pull`, `d950077..92b7bcf`,
  8 nowych wpisów tego dnia). Wszystkie wniesione do tego projektu:**
  1. **GOD BOOK v2.17→v2.18** (rename pliku, `git rm`+nowy) — cykl Y.6 (projekt sprawdza standard)
     skrócony z 7 dni do **3 godzin**; U.4 (odwrotny kierunek, dotyczy tylko sesji nad
     `new-app-standards`, nie tego projektu). Odsyłacze do nazwy pliku poprawione wszędzie, gdzie
     to bieżące wskazanie (nie cytat historyczny): `CLAUDE.md`, `USTALENIA.md`, `00_Biblia.md`,
     `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`,
     `.claude/skills/standards/SKILL.md`, `docs/standards/00-filozofia.md`, nagłówek (nie treść
     wpisów) `docs/lista-do-zrobienia.md`. Historyczne wzmianki `v2_17`/starszych wersji w tym logu
     i w `docs/lista-do-zrobienia.md` celowo nietknięte (Część D GOD BOOK, append-only).
  2. **Nadpisane w całości (NIETYKALNE):** `docs/standards/00-INDEKS.md`, `11-ci-deployment.md`,
     `13-droga-mobile.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `PROMPT_STARTOWY.md`.
  3. **Nowy `docs/przyklady/`** (README, PROMPT, `ci/{README,ci.yml,audit-gate.mjs}`,
     `i18n/{README,check-i18n-guard.mjs}`) skopiowany w całości — materiał referencyjny, pochodzi
     pierwotnie z **tego** projektu (własne zgłoszenie DOBRA PRAKTYKA z 16.09, patrz
     `docs/wklad-do-standardu.md`), teraz wraca jako promowana treść standardu.
  4. **PATCH (nie REWRITE) do `CLAUDE.md`:** dopisany słownik "aktualizacja"/"promocja" (sekcja
     Rdzeń operacyjny), cykl sync 7 dni→3h (punkt 4 "Zanim zaczniesz"), oraz — zauważone przy
     tej samej edycji, nie część zgłoszenia AKTUALIZACJE.md — poprawiona nieaktualna wzmianka
     "Brak jeszcze CI" w sekcji "Stan repo" (CI istnieje od 2026-09-16, wpis wyżej).
  5. **PATCH do `docs/wklad-do-standardu.md`:** dopisana klauzula "zgłaszaj częściej, nie rzadziej"
     (próg zgłoszenia niżej niż wygląda) z `docs/wklad-do-standardu.template.md`.
  **17.4/17.4a (SSR flash złego języka, cookie zamiast `localStorage`, `Accept-Language` nie
  `navigator.language`) — sprawdzone względem TEGO kodu, nie zgadywane: `grep -rl localStorage`
  nie znajduje żadnego mechanizmu przechowywania preferencji języka (tylko `lib/pulpit/storage.ts`,
  `lib/wyglad/storage.ts`, `lib/theme/storage.ts` — pulpit/wygląd/motyw, nie i18n) i żadnego
  language switchera w `app/`/`lib/`. Projekt nie ma jeszcze pełnego przełącznika języka UI (rollout
  17 wciąż tylko na poziomie strażnika AST per-moduł, `scripts/check-i18n-guard.mjs`) — poprawka
  standardu przyjęta do treści `17-i18n.md`, ale **nie ma dziś żadnego kodu do naprawienia**; zapisane
  jako rzecz do zastosowania przy budowie realnego przełącznika języka, nie zaległy dług.**
  **13.2 (preferencja języka web→mobile)** — czysto dokumentacyjne, projekt nie ma jeszcze fazy
  mobile (rozdział 13 poza obecnym zakresem), bez wpływu na kod dziś.
  **11.6/audit-gate.mjs (zawężenie audytu podatności do zależności bezpośrednich) — otwarta decyzja,
  NIE zastosowana automatycznie w `.github/workflows/ci.yml`.** Obecny `dependency-audit`
  (`pnpm audit --audit-level=high`, wpis wyżej z 2026-09-16) blokuje merge na KAŻDEJ podatności
  `high`/`critical`, w tym przechodniej — szerszy zakres niż dosłowne brzmienie 11.5 ("zależność
  bezpośrednia"). To zmiana semantyki bramki CI (co dokładnie blokuje merge), nie mechaniczna
  łatka — zgodnie z zasadą "nie rozstrzygaj sam, pokaż A/B" nie podjęto decyzji za właściciela
  projektu. **A: zostać przy szerszym zakresie** (bezpieczniej, ale czasem blokuje na podatności
  poza kontrolą projektu). **B: przyjąć `docs/przyklady/ci/audit-gate.mjs`** (wiernie 11.5, blokuje
  tylko bezpośrednie, przechodnie tylko informacyjnie). Dziś **0 podatności obu rodzajów** (wpis
  wyżej) — decyzja nie jest paląca, ale otwarta; do zapytania właściciela projektu przy najbliższej
  okazji, zapisana też w `docs/lista-do-zrobienia.md`.
- **2026-09-16 (trzecia edycja tego dnia) — Rozstrzygnięte: wariant B ("Zrób zgodnie z god book"
  — polecenie właściciela projektu).** `scripts/audit-gate.mjs` dodany, `pnpm audit:gate` (nowy
  skrypt `package.json`) zastępuje `pnpm audit --audit-level=high` w
  `.github/workflows/ci.yml`. **Adaptacja do pnpm, nie kopia `docs/przyklady/ci/audit-gate.mjs`:**
  źródłowy skrypt filtruje po `advisory.isDirect` z `npm audit --json` (npm audit report v2) —
  sprawdzone wprost w bundlu `pnpm` (`/opt/node22/lib/node_modules/pnpm/dist/pnpm.cjs`,
  `pnpm audit --json` zwraca starszy format `advisories`/`module_name`/`findings[].paths`, **bez
  pola `isDirect`**). Rozwiązanie: "bezpośrednia zależność" wg 11.5 = pakiet będący kluczem w
  `dependencies`/`devDependencies`/`optionalDependencies` własnego `package.json` — czytane wprost
  z pliku, nie parsowane ze stringów `paths` (format nieudokumentowany, ryzyko rozjazdu między
  wersjami pnpm). Zweryfikowano: `node --check` czysty; `pnpm audit:gate` uruchomiony na realnym
  drzewie zależności (0 podatności — bez zmiany zachowania dziś); logika klasyfikacji
  blokujące/tranzytywne sprawdzona osobno na spreparowanych danych (`react` jako pakiet
  rzeczywiście bezpośredni w `package.json` → blokuje przy `high`; nieznany pakiet → tylko
  informacyjnie; `low` nie blokuje nawet dla bezpośredniego) — trzy przypadki, wszystkie
  poprawne. `pnpm lint`/`typecheck`/`test` (685/685) czyste po zmianie.
- **2026-09-16 (tego samego dnia, druga synchronizacja — GOD BOOK v2.18→v2.19) — sprawdzone
  ponownie na wyraźne polecenie właściciela projektu ("New app standards aktualizacja... Ostatnia
  wersja 2.19"), `git fetch`+`git pull` w lokalnym klonie `new-app-standards`
  (`92b7bcf..741352e`, 1 nowy wpis `AKTUALIZACJE.md`).** Treść nowego wpisu dotyczy wyłącznie
  wewnętrznego mechanizmu procesowego samego repo `new-app-standards` (pierwszy live-test
  zaplanowanej Routine U.4 — self-bind działa, z opóźnieniem do końca tury; doprecyzowanie, że w
  środowisku z wyznaczonym branchem "commit+push na main" realizuje się jako PR+merge) — **U.4
  dotyczy tylko sesji nad `new-app-standards`, nie Y.6 tego projektu**, zero nowej reguły
  zastosowania w tym repo. Mimo to plik GOD BOOK (NIETYKALNE, mirror) nadpisany w całości pod
  nową nazwą (rename `git rm`+nowy plik), odsyłacze do nazwy poprawione we wszystkich bieżących
  wskazaniach (`CLAUDE.md`, `USTALENIA.md`, `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `.claude/skills/standards/SKILL.md`,
  `docs/standards/00-filozofia.md`, `docs/standards/00-INDEKS.md`, `PROMPT_STARTOWY.md`, nagłówek
  `docs/lista-do-zrobienia.md`) — historyczne wzmianki starszych wersji nietknięte (Część D GOD
  BOOK). Zweryfikowano `grep -rln "v2_18"` po synchronizacji — zero trafień poza tym logiem (który
  używa formatu `v2.18` z kropką, nie nazwy pliku, celowo nietknięty).
- **2026-09-16 (czwarta synchronizacja tego dnia) — 7 wpisów `AKTUALIZACJE.md` (wiersze 67-73),
  GOD BOOK bez zmiany wersji (nadal v2.19).** Pełne przetworzenie każdego wiersza: `docs/lista-do-zrobienia.md`,
  szczegóły uzasadnień: sekcja "Decyzje i uzasadnienie" niżej. W skrócie: jedno konkretne zadanie
  kodowe (7.3 — `scripts/check-csp-hash.mjs` w CI), reszta albo już spełniona (18.5/17.4/17.8),
  albo nie dotyczy tego projektu (71/73), albo czysto procesowa (69).
  **Wynik checklisty Y.9 (spot-check istnienia, nie tylko domniemanie z poprzednich sprawdzeń):**
  1. `docs/standards/` — ✅ (5 plików nadpisanych tą synchronizacją).
  2. GOD BOOK — ✅ v2.19 (bez zmiany wersji w tej partii).
  3. `CLAUDE.md` — ✅ istnieje, bez zmian wymaganych tą partią.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ (wpis dopisany).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, bez zmian wymaganych tą partią.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją.
- **2026-09-20 (piąta synchronizacja tego dnia, na wyraźne polecenie właściciela projektu —
  "zrób aktualizacje" przed rozpoczęciem Modułu 4/Modułu 2 wampirów) — `AKTUALIZACJE.md` sprawdzone
  do końca (wiersz 84, GOD BOOK v2.19→v2.20), plus mechaniczna re-weryfikacja wierszy 61-76
  (16.09.2026) przeciw obecnemu stanowi kodu, nie tylko przeciw deklaracji tego logu.**
  **Nowa treść (wiersz 84): GOD BOOK Y.8 — archiwizacja `docs/wklad-do-standardu.md`.** Plik jest
  append-only i rośnie bez końca; nowa reguła: cyklicznie przenosić wpisy w pełni zamknięte (status
  `✅ skonsolidowane`/`✅ przekazane`, bez otwartej dalszej akcji) do nowego,
  `docs/wklad-do-standardu-archiwum.md`, zostawiając w żywym pliku wskaźnik. **Wykonane od razu, w
  tej samej sesji** (nazwana wprost jako "Akcja dla inzynier-offgrid-pro" w tym wierszu): 12 z 16
  wpisów przeniesionych do nowego `docs/wklad-do-standardu-archiwum.md` (9.3/9.0a AI w produkcie,
  rozdz. 18 logowanie, 18.5 Supabase + CSRF Server Actions, 7.3 CSP nonce, 8.4a audyt pokrycia,
  15.19/15.20/15.7a wzorce procesowe, 5.7 autosave) — żywy plik spadł z 1102 do 572 linii. Przy
  okazji naprawiona drobna nieścisłość we własnym wpisie (cytowany numer sekcji "8.2" zamiast
  faktycznego "8.4a", `docs/standards/08-ui-ux.md` — pomyłka w cytowaniu, nie w treści merytorycznej,
  poprawiona dopiskiem w archiwum, Y.2.1 dryf bez świadomej decyzji). 4 wpisy zostają w żywym pliku
  jako wciąż otwarte (procedura materiałów źródłowych i biblioteka norm — czekają na sesję nad
  `new-app-standards`; wielojęzyczność — punkt C6 tłumaczenia treści bezpieczeństwa-krytycznych
  świadomie nierozstrzygnięty; CI referencyjny/i18n-guard — status cofnięty do "nowe" 16.09.2026 po
  incydencie PR #9, wciąż czeka).
  GOD BOOK podmieniony w całości (`...v2_19.md` → `...v2_20.md`, `git rm`+nowy plik, NIETYKALNE);
  odsyłacze do wersji poprawione we wszystkich bieżących wskazaniach (`CLAUDE.md`, `USTALENIA.md`,
  `00_Biblia.md`, `README.md`, `ZASADY_APLIKACJI.md`, `01_Zasady_Pracy_i_Konwencje.md`,
  `.claude/skills/standards/SKILL.md`, `docs/standards/00-filozofia.md`, `docs/standards/00-INDEKS.md`,
  `PROMPT_STARTOWY.md`, nagłówek `docs/lista-do-zrobienia.md`) — historyczne wzmianki starszych
  wersji nietknięte.
  **Re-weryfikacja wierszy 61-76 (16.09.2026) — zweryfikowane programistycznie, nie z metryczki:**
  spot-checki kodu potwierdzają, że wszystkie punkty z jawnie nazwaną "Akcja dla inzynier-offgrid-pro"
  są już zaimplementowane: `middleware.ts` generuje nonce per-request (`crypto.randomUUID()`,
  nagłówki `x-nonce`/`Content-Security-Policy`) zgodnie z korektą 7.3 (wiersz 74); `lib/i18n/language.ts`
  i `lib/i18n/storage.ts` używają wyłącznie `localStorage`/`navigator.languages`, zero cookie/serwera,
  zgodnie z korektą architektoniczną 17.4/5.3 offline-first (wiersz 76, zastępuje wcześniejszą
  "Akcja: migracja cookie+middleware jak zero-waste" z tego samego dnia — świadomie NIE wykonana,
  poprawnie). Pozostałe wiersze 61-73/75 nie miały nazwanej akcji dla tego projektu albo dotyczą
  wyłącznie innych projektów rodziny (zero-waste/szkieletowy-pro) — bez działania tutaj.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ bez zmian merytorycznych tą partią (tylko odsyłacze do wersji GOD BOOK).
  2. GOD BOOK — ✅ podmienione na v2.20.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, odsyłacz zaktualizowany.
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, przycięty do wpisów wciąż otwartych (Y.8).
  6a. `docs/wklad-do-standardu-archiwum.md` — ✅➕ **nowy plik**, pierwsza archiwizacja (Y.8).
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz w
     pierwszym zaktualizowany.
  Zweryfikowano: `grep -rln "v2_19"` po synchronizacji — zero trafień w całym repo poza historycznymi
  wzmiankami w tym logu (Część D GOD BOOK, append-only, celowo nietknięte).

- **2026-09-20 (kolejne sprawdzenie tego dnia, Routine Y.6 cykliczny co ≤3h) — sprawdzono
  `AKTUALIZACJE.md`, znaleziono 1 nowy wpis od poprzedniej synchronizacji (wiersz wyżej, PR #134,
  v2.20): rename GOD BOOK v2.20→v2.21 (commit `74d21fc` w `new-app-standards`, nowa GOD BOOK C.5 —
  bezpieczny zakres wyszukaj-zamień przy zmianie nazwy pliku wersjonowanego, zebrana po korekcie
  błędnego nadpisania historycznego wiersza z 16.09 przy poprzednim renamie). Zero zmian
  merytorycznych w `docs/standards/00–16` tą partią — 8.4a/5.7/15.19/15.20/15.7a/17.1a/9.0a
  (wpisy `AKTUALIZACJE.md` z 20.09 sprzed tego sprawdzenia) były już zsynchronizowane poprzednią
  partią (PR #134/#135), zweryfikowane `diff` plik-po-pliku — brak rozbieżności poza wskaźnikiem
  wersji.
  Wykonane: GOD BOOK podmieniony w całości (`...v2_20.md` → `...v2_21.md`, `git rm`+nowy plik,
  NIETYKALNE); odsyłacze do wersji poprawione we wszystkich bieżących wskazaniach (`CLAUDE.md`,
  `.claude/skills/standards/SKILL.md` — PATCH, zachowana lokalna adaptacja; `docs/standards/00-INDEKS.md`,
  `docs/standards/00-filozofia.md`, `PROMPT_STARTOWY.md` — pełne nadpisanie NIETYKALNE; `00_Biblia.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `USTALENIA.md`, `ZASADY_APLIKACJI.md` — punktowa poprawka
  wskaźnika) — historyczne wzmianki starszych wersji w `docs/memory.md`/`docs/lista-do-zrobienia.md`
  celowo nietknięte (GOD BOOK C.5).
  **Krok 6 Routine (przegląd `docs/wklad-do-standardu.md` pod kątem wpisów 🔎):** wszystkie 4 otwarte
  wpisy sprawdzone przez realne porównanie treści z aktualnym `new-app-standards` (nie domysł) —
  3 w pełni skonsolidowane, oznaczone ✅ z odnośnikiem: procedura przetwarzania materiałów źródłowych
  (`docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md`), biblioteka norm (`docs/biblioteka-norm/`,
  pliki fizycznie skopiowane od 15.09.2026, kwestia licencji PKN rozstrzygnięta), CI referencyjny +
  i18n-guard (`docs/przyklady/ci/`, `docs/przyklady/i18n/`). Wielojęzyczność (wpis 14.09) oznaczona
  ✅ częściowo — punkty 1–5 i B.3 skonsolidowane (17.1a), punkt C6 (tłumaczenie treści
  bezpieczeństwa-krytycznych) pozostaje otwarty, brak odpowiednika w standardzie, świadomie
  zostawiony. Żadna edycja `new-app-standards` — repo dołączone wyłącznie do odczytu.
  **Krok 5a (moduły opcjonalne Y.10):** sprawdzony rejestr w GOD BOOK — nadal tylko 2 pozycje
  (playbook + biblioteka norm), obie już obecne w tym projekcie. Brak nowych modułów do
  zaproponowania.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ bez zmian merytorycznych tą partią (tylko odsyłacze do wersji GOD BOOK).
  2. GOD BOOK — ✅ podmienione na v2.21.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md` — ✅ (ten wpis).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, treść nietknięta (LOKALNE).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, 3 wpisy potwierdzone skonsolidowane, 1 częściowo
     (patrz wyżej), reszta bez zmian.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz w
     pierwszym zaktualizowany, drugi bez odsyłacza do wersji (bez zmian).
  Zweryfikowano: `grep -rln "v2_20"` po synchronizacji — zero trafień w całym repo poza historycznymi
  wzmiankami w `docs/memory.md`/`docs/lista-do-zrobienia.md` (Część D GOD BOOK, append-only, celowo
  nietknięte) i `README.md` (nigdy nie kopiowany, projekt-specyficzny).

- **2026-09-20 23:00 UTC (kolejne cykliczne sprawdzenie, Routine Y.6 co ≤3h) — brak nowości.**
  `git fetch origin main` w klonie `new-app-standards` — `HEAD` bez zmian, wciąż `80fc1c3` (ten sam
  commit co przy poprzednim sprawdzeniu ~2 minuty wcześniej). `AKTUALIZACJE.md` bez nowych wierszy
  od rename'u v2.20→v2.21 opisanego wyżej. Zero działania: GOD BOOK, `docs/standards/`, wskaźniki
  wersji i `docs/wklad-do-standardu.md` już aktualne z poprzedniego wpisu — nie ma nic do
  ponownego domykania. PR #136 (poprzednia partia) wciąż otwarty, czeka na CI/mergea, nieprzemergowany
  jeszcze do `main` — kolejne sprawdzenie za ≤3h ponownie zweryfikuje `origin/main` niezależnie od
  stanu tego PR-a.

**⚠️ (2026-09-20 23:0x UTC) Znany blocker CI, zgłoszony wprost przez właściciela projektu: GitHub
Actions dla tego repo nie działa do 1 października 2026 (limit minut/uruchomień konta wyczerpany).**
Potwierdzone technicznie na PR #136: `get_check_runs` → 0, `list_workflow_runs` dla gałęzi → 0 —
workflow `.github/workflows/ci.yml` w ogóle się nie kolejkuje (nie "czerwone", nie flaky — po prostu
nie startuje). **Nie jest to usterka do naprawienia w kodzie ani w YAML-u** — to limit na poziomie
konta/organizacji GitHub, poza kontrolą tego repo. Usunięty wcześniej zaplanowany check-in
(`trig_01FtWAXrja2sNSUAqoA2igRs`, próbowałby błędnie "diagnozować i naprawiać" brak CI jako
problem repo) — subskrypcja `subscribe_pr_activity` na PR #136 pozostaje aktywna i wystarczy
(webhook, nie polling) do wyłapania realnych zdarzeń (push, review, ewentualny powrót CI). **Dla
przyszłych sesji: przed 1 października nie oczekuj zielonego CI na żadnym PR w tym repo — brak
check runs nie oznacza błędu w zmianie.** Merge PR-ów w tym oknie wymaga świadomej decyzji
właściciela projektu (merge bez CI albo poczekać do 1.10) — nie do rozstrzygnięcia samodzielnie
przez AI.

**⚠️ KOREKTA (2026-09-20 23:1x UTC) — sprzeczność ze zweryfikowanym wcześniej dziś ustaleniem, nie
rozstrzygnięta.** Wpis wyżej ("limit Actions do 1.10") zapisano jako fakt na podstawie samego
stwierdzenia właściciela projektu, **bez ponownej weryfikacji** — naruszenie własnej zasady "nie
przedstawiaj hipotez jako faktów" (ten sam błąd co już raz udokumentowany w tym pliku przy PR #132,
patrz sekcja "Anulowany job CI przy PR #132" niżej). Tamten wpis, zweryfikowany **bezpośrednio przez
GitHub API tego samego dnia**, ustalił: `inzynier-offgrid-pro` to repo **publiczne**, GitHub Actions
na standardowych runnerach dla repo publicznych jest darmowe i nielimitowane, limit 2000 min/mies.
dotyczy wyłącznie repo prywatnych na koncie — wniosek: "CI dla tego repo NIE jest ograniczane
limitem minut". To wprost sprzeczne z wpisem wyżej. Zgłoszone właścicielowi projektu w tej samej
sesji (pokazane A/B) — polecił mergować mimo to, standardowym pakietem manualnym zamiast CI
(zrobione, PR #136 zmergowany `f68223c`, wszystko czyste: lint/typecheck/i18n-guard/test 1022/1022/
build/audit:gate). **Przyczyna sprzeczności NIEROZSTRZYGNIĘTA** — możliwe wyjaśnienia: zmiana
widoczności repo/planu między weryfikacjami, inny limit niż Actions (np. limit sesji/kont Claude),
albo któraś z dwóch weryfikacji była niepełna. Dla przyszłych sesji: **nie zakładaj żadnej z dwóch
wersji jako pewnika** — przy następnym PR sprawdź wprost (`get_check_runs`/`list_workflow_runs` +
w razie wątpliwości `GET /repos/.../` dla `private`/`visibility`), zanim zapiszesz cokolwiek jako
fakt.

- **2026-09-23 — synchronizacja na polecenie właściciela projektu ("zaktualizuj stan repo na
  komputerze, sprawdź rozjazd i przeprowadź aktualizację zgodnie z procedurą").** Lokalny checkout
  `inzynier-offgrid-pro` był 84 commity za `origin/main` (fast-forward, bez konfliktów; lokalna,
  niecommitowana zmiana `pnpm-workspace.yaml` — `allowBuilds: unrs-resolver: false` — zostawiona
  nietknięta, poza zakresem). Klon `new-app-standards`: `git fetch` (Y.6 1a), `HEAD` = `origin/main`
  = `6fc7140`. Od ostatniej synchronizacji (`80fc1c3`, 20.09) **7 nowych wierszy `AKTUALIZACJE.md`**
  (v2.21→v2.28): Y.11 (audyt zgodności KODU, na żądanie/koniec Fazy — nie cyklicznie), Y.11 poz. 6
  (reguła 9.0), korekta zakresu 17.1a/5.7/18.1 (obowiązkowe też w istniejących projektach), 17.7b
  (selektor języka tylko dla języków kompletnych), rozdz. 13 (Capacitor na stałe, 13.4–13.6,
  macOS/iPad/Linux/Huawei/Xiaomi).
  Przed nadpisaniem zweryfikowane: każdy z 7 lokalnych plików NIETYKALNE był identyczny z wersją
  źródła w `80fc1c3` — czysty dryf, zero lokalnych modyfikacji do stracenia.
  Wykonane: nadpisane w całości (NIETYKALNE) `docs/standards/00-INDEKS.md`, `00-filozofia.md`,
  `05-baza-danych-offline.md`, `13-droga-mobile.md`, `17-i18n.md`, `18-logowanie.md`,
  `PROMPT_STARTOWY.md`; GOD BOOK `...v2_21.md` → `...v2_28.md` (`git rm` + nowy plik); wskaźnik
  wersji poprawiony punktowo (C.5) w `CLAUDE.md`, `.claude/skills/standards/SKILL.md`,
  `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `USTALENIA.md`, `ZASADY_APLIKACJI.md`. Po
  synchronizacji `diff` całego `docs/standards/` + `PROMPT_STARTOWY.md` ze źródłem — zero różnic;
  `grep "v2_21"` — trafia wyłącznie w historię tego logu i CHANGELOG samego GOD BOOK (celowo).
  **Krok 5a (Y.10):** rejestr modułów opcjonalnych bez nowych pozycji; oba istniejące moduły
  (playbook, biblioteka norm) projekt ma od dawna w `docs/propozycje-do-new-app-standards/` — bez
  akcji.
  **Krok 6 (`docs/wklad-do-standardu.md`):** bez nowych wpisów od 20.09; jedyny otwarty punkt
  (C6 — tłumaczenie treści bezpieczeństwa-krytycznych) nadal bez odpowiednika w standardzie.
  **Znaleziska wymagające decyzji właściciela (NIE naprawiane — Y.11 nigdy nie poprawia kodu
  samodzielnie):**
  1. ⚠️ **17.7b** — `components/jezyk-wybor.tsx` renderuje wszystkie `SUPPORTED_LANGUAGES`
     (pl/en/ru) bez filtra kompletności, a migracja i18n trwa (17.9; `check-i18n-guard.mjs`
     obejmuje tylko `MIGRATED_MODULES`, a jego własny komentarz mówi, że reszta modułów "świadomie
     zwraca gotowy tekst PL"). Wybór en/ru daje więc dziś UI mieszane PL+EN/RU — wprost nazwane
     naruszenie 17.7b. (Stopień niekompletności nie zmierzony dokładnie w tej sesji.)
     **Decyzja właściciela (23.09.2026): "nic na razie nie ukrywaj, dopóki tłumaczenie nie będzie
     skończone"** — świadome, tymczasowe odstępstwo od 17.7b (Y.2: świadoma decyzja, nie dryf).
     Przełącznik zostaje bez zmian do zakończenia migracji i18n; nie "naprawiać" samodzielnie.
     Po skończeniu tłumaczenia en/ru odstępstwo wygasa samo.
  2. ✅ **18 (Huawei/magic link)** — `app/auth/login/actions.ts` ma magic link jako pełnoprawnego
     dostawcę obok Google/Apple — wymóg spełniony.
  3. ℹ️ **Y.11** — `docs/audyt-zgodnosci-kodu.md` nie istnieje; pierwsze uruchomienie Y.11
     (na żądanie albo na koniec Fazy/Etapu) do rozważenia przez właściciela.
  4. ℹ️ **Rozdz. 13 (Capacitor)** — tylko świadomość; projekt nie jest jeszcze na etapie buildu
     natywnego.
  **Wynik checklisty Y.9:**
  1. `docs/standards/` — ✅ zsynchronizowane (6 plików nadpisanych, 20 plików = komplet źródła).
  2. GOD BOOK — ✅ podmienione na v2.28.
  3. `CLAUDE.md` — ✅ istnieje, odsyłacz zaktualizowany.
  4. `docs/memory.md`/pełna Biblia — ✅ (ten wpis; `00_Biblia.md` z odsyłaczem zaktualizowanym).
  5. `docs/lista-do-zrobienia.md` — ✅ istnieje, treść nietknięta (LOKALNE).
  6. `docs/wklad-do-standardu.md` — ✅ istnieje, bez zmian.
  7. `docs/zrodla/` — ✅ istnieje.
  8. `.claude/skills/standards/SKILL.md` — ✅ istnieje, odsyłacz zaktualizowany.
  9. `01_Zasady_Pracy_i_Konwencje.md` + `02_Dyrektywy_AI_Projektu.md` — ✅ oba istnieją, odsyłacz
     w pierwszym zaktualizowany.

## Pełny audyt na polecenie właściciela projektu (20.09.2026) — Y.6/Y.9 + Część N

Na wyraźne polecenie ("Zrób pełny audyt a potem podaj listę do zrobienia według god book").
Wykonane oba tryby audytu z GOD BOOK: **Y.6/Y.9** (sprawdzenie aktualizacji + checklist
kompletności struktury) i **Część N** (audyt kompletności — spot-check bezpośrednio w źródłach,
nie z pamięci).

**Y.6 — sprawdzono `AKTUALIZACJE.md`** (lokalny klon `new-app-standards`, `git fetch`+`git merge
--ff-only`, `0cff79a..0c56884`, zgodnie z 1a — bez tego kroku poprzedni checkout raportowałby
fałszywie "brak nowości"). Ostatni sync: 16.09.2026 (wiersze 67–73). **3 nowe wiersze (74–76),
wszystkie tego samego dnia, nieskonsolidowane:**

1. **Wiersz 74 — KOREKTA (BŁĄD KRYTYCZNY): hash-based CSP niekompatybilny z Next.js App Router.**
   Źródło: **ten projekt**, własne zgłoszenie z sesji 16.09 (patrz `docs/wklad-do-standardu.md`
   wcześniejszy wpis o tym samym dniu). Standard potwierdził: błąd produkcyjny aktywny (hydracja
   Reacta psuje się na każdej stronie), nakazana migracja na nonce-per-request. **Stan w tym
   repo: ✅ już naprawione** (ten sam dzień, `middleware.ts` generuje nonce per-request, przekazuje
   przez nagłówek `x-nonce`, `app/layout.tsx` odczytuje i wstawia do `WYGLAD_INIT_SCRIPT`,
   `next.config.mjs` ma komentarz wyjaśniający dlaczego CSP tam nie jest ustawiana). `docs/standards/07-bezpieczenstwo.md`
   już identyczny ze źródłem (`diff` — zero różnic). Nic do zrobienia poza formalnym zamknięciem
   tego wiersza w logu (ten wpis).
2. **Wiersz 75 — doprecyzowanie 17.4: atrybut `lang` (tani) vs widoczna treść (pełna 17.4),
   obowiązkowy jawny ślad w 14.4 jeśli wdrożono tylko atrybut.** Nie dotyczy wprost — projekt
   wdrożył już PEŁNY mechanizm (cookie+treść), nie tylko atrybut — ale sam ten mechanizm okazuje
   się nieaktualny, patrz wiersz 76.
3. **Wiersz 76 — KOREKTA ARCHITEKTONICZNA: 17.4 wraca do offline-first (5.3) jako osi decyzyjnej,
   nie "czy projekt ma dostępny serwer".** 🔴 **Realny, nienaprawiony gap w tym repo.**
   `CLAUDE.md` (linia 3) jawnie deklaruje ten projekt jako "Web/PWA offline-first" — dokładnie
   kategoria, dla której poprawiona reguła nakazuje **zero cookie, zero zależności od serwera**
   dla języka UI. Dzisiejszy kod (`lib/i18n/language.ts`, `middleware.ts` `ustawJezykJesliBrak`)
   implementuje dokładnie odrzucony wzorzec: cookie `jezyk` + odczyt `Accept-Language` w
   middleware + serwerowy render per-request. To nie jest hipotetyczne ryzyko — to aktywna
   zależność od serwera przy KAŻDYM twardym przeładowaniu, w aplikacji, której sens istnienia to
   praca bez sieci. Poprawny wzorzec dla tej kategorii: `localStorage` + `navigator.language` na
   pierwszą wizytę, blokujący skrypt pre-paint z treścią WSZYSTKICH języków w bundlu klienckim
   (cache'owany przez service worker), zero cookie/middleware dla języka. **Nie naprawione w tej
   sesji** — to migracja architektury runtime (middleware.ts, lib/i18n/*, layout.tsx), nie
   dokumentacyjny PATCH, i dotyka mechanizmu, z którego korzysta dziś cała apka — zgłoszone do
   listy zadań (patrz `docs/lista-do-zrobienia.md`), czeka na jawną zgodę przed startem.

**Zsynchronizowane (kategoria NIETYKALNE, pełny nadpis, zero negocjacji):**
`docs/standards/17-i18n.md`, `docs/standards/00-INDEKS.md`, `docs/standards/05-baza-danych-offline.md`.
Zweryfikowano po synchronizacji: `diff -rq` całego `docs/standards/` między tym repo a źródłem —
**zero różnic** (wcześniej: 3 pliki). GOD BOOK i `PROMPT_STARTOWY.md` — już identyczne ze źródłem,
bez zmian. `pnpm check:i18n-guard` — czyste (94 moduły, bez regresji po zmianie treści standardu,
zgodnie z oczekiwaniem — guard sprawdza AST kodu, nie treść dokumentacji).

**Y.9 — pełna checklista struktury (19 pozycji: 9 z tabeli + 10 z Części S), sprawdzona
bezpośrednio (`ls`/`test -e`), nie domniemana:** wszystkie ✅ istnieją — `docs/standards/00-INDEKS.md`,
GOD BOOK v2.19, `CLAUDE.md`, `docs/memory.md`, `docs/lista-do-zrobienia.md`,
`docs/wklad-do-standardu.md`, `docs/zrodla/`, `.claude/skills/standards/SKILL.md`,
`01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `00_Biblia.md`,
`rejestr-decyzji.md`, `zlote-zasady.md`, `mapa-wdrozenia.md`, `backlog-poza-v1.md`,
`dlug-techniczny.md`, `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`. Zero
brakujących pozycji.

**Część N — audyt kompletności, spot-check bezpośrednio w źródłach:**
1. **Markery długu technicznego `🔎 TD#`** (X.4) — `grep` w obie strony: `dlug-techniczny.md`
   ma TD1–TD13, kod (`lib/`+`app/`) ma dokładnie te same TD1–TD13, zero rozbieżności (brak
   długu nieudokumentowanego, brak wpisów-widm).
2. **`docs/rejestr-twardych-stopow.md`** — 41 pozycji, struktura (sekcje tematyczne + odsyłacze
   moduł/plik) spójna, brak oznak zaniedbania.
3. **CI na `main`** — ostatni bieg (run #83, PR #128) zielony, bez znanych regresji.
4. **`docs/rejestr-pokrycia.md`** — brak nowych, nieznanych wcześniej luk ponad to, co już
   udokumentowane; największe pozostałe otwarte obszary (niezmienione od poprzednich audytów,
   potwierdzone nadal aktualne): Moduł 5 (Okablowanie) 27/29 ekranów `todo` (niezależne od
   normy blokującej Ekran 1, budowalne równolegle), Moduł 11 (Montaż baterii) w większości
   `todo` poza już zbudowanymi ekranami referencyjnymi, klaster stress-test zimowy (Moduł 7,
   architektonicznie zależny od jeszcze niezbudowanego Modułu 1/modelu termicznego Modułu 6),
   moduł zbiorczy "Wampiry energetyczne" (Moduł 2, 24 funkcje, świadomie odłożony jako osobna
   sesja).

**Wynik ogólny:** projekt w dobrym stanie strukturalnym (Y.9 100%, GOD BOOK/standard w pełni
zsynchronizowane po tej sesji, TD markers czyste, CI zielone) — jeden realny, aktywny gap
architektoniczny (i18n cookie-based w projekcie offline-first, wiersz 76) i duży, znany,
nieprzeoczony backlog funkcjonalny (M5/M11/M7/moduł wampirów). Pełna, priorytetyzowana lista:
`docs/lista-do-zrobienia.md`, wpis z tego dnia.

## Decyzje i uzasadnienie

- **2026-08-29 — Standard `docs/standards/` (16 rozdziałów) i ten plik utworzone.** Scalenie: `ZASADY_APLIKACJI.md`/`USTALENIA.md` (istniejące w repo) + audyt architektury "Kontrakty Kernela" (apka "Inżynier szkieletowy Pro") + pełna metodologia treści i wzorców UI Offgrid (Zasady UX Doradcy, plik scalony wszystkich modułów) + komplet dokumentów AI z projektu "Kalkulator Inżyniera Pro" (ARCHITECTURE/CODING_STANDARD/CALCULATORS/AI_MASTER/AI_CAMERA/LOCAL_AI/UI_GUIDE/praca_ai_z_teoria). Format: Markdown w `docs/standards/` jako źródło prawdy (przenośne między AI), `.claude/skills/standards/SKILL.md` jako cienki wrapper dla Claude Code.
- **2026-08-29 — D-1 skorygowane, D-01 zamknięty.** Rozdział 7 (Tryb Live) ma 33 funkcje, nie 50 (numeracja 7.9–7.25 nie istnieje w źródle). Finalna liczba funkcji Biblii: 579 (nie 540). Zweryfikowane programistycznie na podstawie dokumentu scalającego wszystkie moduły, nie z metryczki. Pełny zapis: `ZASADY_APLIKACJI.md` §12, `USTALENIA.md` D-1. Zmergowane do `main` w PR #2.

## Pułapki i lekcje

- **Jeden lockfile, zawsze.** Udokumentowany incydent w siostrzanym projekcie tej rodziny: drugi, nieaktualny lockfile obok żywego zerwał deploy na Vercelu na kilka dni — przyczyna niezwiązana z treścią commitów, trudna do zdiagnozowania bez CI niezależnego od hostingu. W tym repo dziś: tylko `pnpm-lock.yaml` — pilnować, żeby tak zostało.
- **Duże, organicznie rozrosłe dokumenty specyfikacji mają ukryte duplikaty międzyrozdziałowe.** W Offgrid znaleziono co najmniej 7 takich duplikatów (np. cykle odszraniania pompy ciepła opisane w trzech różnych rozdziałach źródła). Przy pracy nad kolejnymi modułami Offgrid: sprawdzać, czy dany temat nie jest już opisany gdzie indziej, zanim napisze się go od nowa.
- **Deklaratywna metryczka dokumentu ≠ rzeczywista treść.** Znaleziona luka: funkcja 1.19 Modułu 2 ("Agregat prądotwórczy — definicja i logika") miała gotową treść źródłową w Biblii i była jawnie zaplanowana jako osobny ekran, ale nigdy nie trafiła do pliku treści modułu — nawet własna sekcja "znane luki" tego dokumentu jej nie wymieniała. Wniosek: nie ufać podsumowaniom "X z X gotowe" bez przeliczenia.

## Konwencje specyficzne dla projektu

- Domena (kalkulatory, walidacja, jednostki) będzie żyła w `lib/` — mapowanie na `core/`/`domain/` ze standardu 01. Konkretna struktura podfolderów do ustalenia przy starcie Etapu 1.
- Encje i identyfikatory modułów mają być nazwane 1:1 z "Biblią" Offgrid (Zasada 7 ZASADY_APLIKACJI.md) — nie tłumaczyć/skracać swobodnie przy implementacji.

## Decyzje i uzasadnienie (c.d. 2)

- **2026-08-29 — Szkielet architektury + pierwszy pełny kalkulator (Ekran 16, Moduł 2).**
  Dodano: `lib/core/calc-result.ts` (`CalcResult<T>`, `Status`, `Warning`), `lib/core/reporter.ts`,
  `lib/core/profiles/{types,pl}.ts` (Zod, minimalny profil PL — waluta/separator, reszta pól
  dogrywana w miarę potrzeb), `lib/adapters/storage-adapter.ts` (tylko interfejs, bez
  implementacji IndexedDB — świadomie odłożone). Dodano `vitest` + `eslint` (flat config przez
  `eslint-config-next/core-web-vitals` i `/typescript` — **nie** przez `FlatCompat`, bo ta ścieżka
  z ESLint 9/10 + eslint-config-next 16.3.3 rzuca `TypeError: Converting circular structure to
  JSON`; rozwiązanie: importować gotowe płaskie configi wprost z podścieżek pakietu). Ekran 16
  "Kalkulatory pomocnicze" zaimplementowany w pełni (3 tryby: W→A, Ah↔Wh, czas pracy z baterii),
  9 testów, zweryfikowany ręcznie w przeglądarce (3 stany werdyktu 🟢🟡🔴 ze screenshotami).
  Rejestr pokrycia: `docs/rejestr-pokrycia.md` (nowy plik, Zasada 12).
- **2026-08-29 — Uwaga narzędziowa: `next dev` dopisuje do `CLAUDE.md` blok
  `<!-- BEGIN:nextjs-agent-rules -->`** ostrzegający, że Next.js 16 ma zmiany API względem danych
  treningowych modelu, i każący czytać `node_modules/next/dist/docs/` przed pisaniem kodu. Blok
  jest generowany automatycznie przy każdym `next dev` — nie usuwać ręcznie z diffa (i tak wróci),
  commitować razem z resztą, żeby drzewo było czyste (tak mówi sam komentarz w bloku).

## Decyzje i uzasadnienie (c.d. 3)

- **2026-08-29 — Ekran 1, Moduł 2 (Survival Core) zaimplementowany.** Drugi kalkulator, celowo
  innego kształtu niż Ekran 16 (katalog wyboru + agregacja sumy, nie pojedynczy wzór). Katalog
  domyślnych mocy w `lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants.ts`.
  **"Ogrzewanie" nie ma domyślnej mocy w źródle** (Biblia dawne 1.1 podaje domyślne W dla 5 z 6
  kategorii) — potraktowane jako `defaultPowerW: null`, zaznaczenie bez ręcznie wpisanej mocy >0
  daje jawny błąd 🔴 ("musi mieć moc większą od zera"), nigdy ciche 0W. Docelowo ta wartość ma
  pochodzić z Modułu 6 (Ogrzewanie/pompa ciepła), jeszcze nie zbudowanego.

## Decyzje i uzasadnienie (c.d. 4)

- **2026-08-29 — Ogrzewanie w Ekranie 1 (Survival Core): potwierdzone, ręczne wpisywanie na razie.**
  Decyzja właściciela projektu: zostawiamy jak jest — brak domyślnej mocy, użytkownik wpisuje
  ręcznie (kod bez zmian, już tak działa — patrz wpis wyżej z 2026-08-29 o implementacji Ekranu 1).
  **Do wrócenia w przyszłości:** rozważyć albo (a) automatyczne pobieranie mocy ogrzewania z
  danych budynku (podobny wzorzec do "Kalkulatora Inżyniera Pro", gdzie dane budynkowe są
  importowane z osobnego modułu/aplikacji — `ARCHITECTURE.md` §9 z materiałów źródłowych), albo
  (b) użytkownik nadal wpisuje ręcznie jako świadomy wybór, nie prowizorka. Nierozstrzygnięte —
  nie blokuje dalszej pracy nad Modułem 2.

## Otwarte sprawy / dług

- **PWA — świadomie odłożone (2026-08-30).** Decyzja autora: "Pwa, jeszcze nie robiliśmy, czekamy
  na inne funkcje. Dla tam tej apki mam pwa, ale jeszcze nie wdrożone, wieczorem ci dam ten plik.
  Popatrzysz sobie." Brak `manifest.json` i service workera w repo — nie budować teraz. Autor ma
  gotową konfigurację PWA z siostrzanej aplikacji rodziny "Inżynier Pro" i dostarczy plik do
  przejrzenia/adaptacji. `app/layout.tsx` ma już `viewport.colorScheme: 'light dark'` i osobne
  `themeColor`/ikony per schemat (przygotowane pod PWA), ale zawiera nieaktualne pozostałości
  scaffoldu v0 (`title: 'v0 App'`, `description: 'Created with v0'`, `generator: 'v0.app'`,
  `<html lang="en">` mimo polskiej treści) — do poprawienia przy właściwym wdrożeniu PWA, nie teraz.
- **Świadomie poza zakresem kroku "szkielet + Ekran 16" (2026-08-29):** realna implementacja
  `IndexedDbStorageAdapter` (dziś tylko interfejs), i18n, pozostałych 15 ekranów Modułu 2 +
  moduł zbiorczy wampirów energetycznych, cały Moduł 1 (czeka na treść źródłową — patrz niżej),
  CI (rozdział 11 standardu), delegowanie części UI do v0/Vercel (czeka na ten kontrakt
  `CalcResult`/`Warning` jako punkt odniesienia dla mockowanych ekranów).
- **Luka 1.19** (Moduł 2, "Agregat prądotwórczy") — do dopisania jako ekran D przy Etapie 3 treści Modułu 2. Treść źródłowa gotowa w Biblii, patrz `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`.
- ~~Materiały źródłowe Offgrid żyją poza tym repo~~ — **rozstrzygnięte 2026-08-29, patrz wpis niżej.**
- ~~Brak pełnej treści Modułu 1~~ — **rozstrzygnięte 2026-08-29** — pełna treść Modułu 1 (4 ekrany) dotarła i jest w `docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md`.

## Decyzje i uzasadnienie (c.d.)

- **2026-08-29 — Wznowiono Etap 1 (szkielet architektury).** Pauza z `ZASADY_APLIKACJI.md` §14 (2026-08-28) zakończona decyzją autora. Pierwszy moduł domenowy: Rozdział 0+1 (Geostruktura + Bilans obciążeń), zgodnie z pierwotną, zatwierdzoną teraz kolejnością. Zmiana odnotowana w `ZASADY_APLIKACJI.md` §14 i `USTALENIA.md` (jawna korekta, stara notatka zachowana obok nowej, zgodnie z rozdziałem 14.2 standardu).

## Decyzje i uzasadnienie (c.d. 5)

- **2026-08-29 — Materiały źródłowe Offgrid przeniesione do repo (`docs/zrodla/`).** Powód: przy
  kompresji kontekstu długiej sesji AI traci dostęp do wcześniej wklejonej treści plików źródłowych
  (nawet jeśli w podsumowaniu zostaje odnotowane, że "zostały przeczytane") — realny koszt: pytanie
  do autora o ponowne wysłanie tego, co już raz dostarczył. Rozwiązanie: pliki trafiają do repo jako
  kopia 1:1, dostępna dla każdej przyszłej sesji AI bez ponownego wysyłania. Skopiowano komplet:
  wszystkie 13 plików `Tresc_Modul_X_*_Ekrany.md` (moduły 1–13), `Tresc_WSZYSTKIE_MODULY_scalone.md`,
  `Zasady_UX_Doradca_v2_1.md`, `Biblia_Offgrid_v2_0_Architektura_Modulowa.md`. Indeks i zasady
  aktualizacji: `docs/zrodla/README.md`. Zamyka otwartą sprawę z sekcji niżej i lukę "brak treści
  Modułu 1" (Moduł 1 dotarł w komplecie, 4 ekrany).

## Decyzje i uzasadnienie (c.d. 6)

- **2026-08-29 — Zbudowano 8 ekranów wzorcowych (A–H) jako przygotowanie do przekazania v0.**
  Zamiast kontynuować Moduł 2 ekran-po-ekranie, na wyraźną decyzję autora ("zrobimy od A do H a
  nie kilka") zbudowano po jednym w pełni zaimplementowanym przykładzie dla każdego z 8 wzorców UI
  z `docs/standards/08-ui-ux.md` (8.2), żeby dać v0 spójny materiał do ustalenia jednego systemu
  projektowego naraz, zamiast osobnych sesji per moduł. Wybrane ekrany (szczegóły i pliki:
  `docs/rejestr-pokrycia.md`, sekcja "Moduły 3–13 — wzorce UI reprezentatywne"):
  - A: Moduł 3/Ekran 11 — Konfigurator stringów PV (szereg/równolegle/mieszany)
  - B: Moduł 4/Ekran 30 — Porównanie technologii magazynów
  - C: Moduł 3/Ekran 24 — Czystość i śnieg na panelach (akordeon)
  - D: Moduł 4/Ekran 24 — Dobór bezpiecznika DC (AIC) — twardy stop bezpieczeństwa
  - E: Moduł 4/Ekran 11 — Moment dokręcania śrub (checklist)
  - F: Moduł 5/Ekran 19 — Trasy kablowe (ilustracja SVG, bez pól i bez kalkulatora)
  - G: Moduł 8/Ekran 11 — Audyt bezpieczeństwa pożarowego (raport na danych demonstracyjnych)
  - H: Moduł 9/Katalog 1 — Katalog czujników (21 typów, dodawanie wielu instancji)

  Wszystkie zweryfikowane: testy (E i F celowo bez pełnego kompletu plików — patrz notatki w
  rejestrze), lint, `tsc --noEmit`, `next build`, ręcznie w przeglądarce (Playwright, wszystkie
  stany werdyktu i brak błędów konsoli).

  **Świadome uproszczenia, nie przeoczenia:**
  - Ekran G (audyt pożarowy) używa danych demonstracyjnych (`SAMPLE_AUDIT_ITEMS`), jawnie
    oznaczonych w kodzie i UI — realna wersja wymaga Modułów 8/9/13 (na żywo), niezbudowanych.
  - Ekran C: zakres kąta 10–15° nie ma jednoznacznej klasyfikacji w źródle — zgłoszone jako
    ostrzeżenie w UI, nie zgadywane.
  - Ekran D: margines AIC vs prąd zwarciowy oparty wyłącznie na jawnie podanych w źródle
    regułach (AIC < I_zw = 🔴 twardy stop; AIC < 10 000 A zalecane minimum LiFePO4 = 🟡) — bez
    dodatkowego, nieuzasadnionego źródłowo współczynnika bezpieczeństwa.

  **Pozostaje do zrobienia:** przygotować zbiorczą notatkę/brief dla v0 (linki do wszystkich 8
  ekranów + krótki opis wzorca każdego), zaktualizować pełne wyliczenie per-funkcja dla modułów
  3/4/5/8/9 w rejestrze pokrycia (dziś: tylko te 8 ekranów jako `done`, reszta jako grupowe
  `todo` bez enumeracji — nie zgadywana teraz).

## Decyzje i uzasadnienie (c.d. 7)

- **2026-08-30 — Pulpit adaptacyjny: decyzja projektowa spisana, bez kodu.** Autor przedstawił
  koncept adaptacyjnego pulpitu (onboarding proponuje układ 13 kafli + Kafel 14 Ustawienia, user
  zawsze może zmienić, nic nie znika — tylko się chowa; ten sam mechanizm rekurencyjnie wewnątrz
  każdego modułu dla jego ekranów). Oceniony jako dobry kierunek, spójny z tym, co już istniało w
  źródle (`Tresc_WSZYSTKIE_MODULY_scalone.md` już definiuje "kafle pulpitu: 13+1"). Spisane w
  dwóch miejscach: `docs/standards/08-ui-ux.md` §8.11 (mechanizm generyczny, reużywalny w innych
  aplikacjach rodziny) i `docs/pulpit-i-nawigacja.md` (konkretna instancja Offgrid — domyślna
  kolejność 13 kafli uzasadniona przepływem zależności danych, 8 presetów onboardingu jako
  **pierwsza wersja robocza do potwierdzenia przez autora**, zasady interakcji).
  Ustalenia autora: (1) pasek górny (Lokalizacja/Live/Ustawienia) to **dodatkowy skrót**, Kafel 14
  i Kafel 1/13 zostają pełnoprawnymi pozycjami na pulpicie, nie są zastępowane; (2) kolejność
  budowy kodu (`ZASADY_APLIKACJI.md` §14) i kolejność kafli na pulpicie usera to **dwie niezależne
  sprawy** — kafle mogą zmieniać kolejność swobodnie, nie muszą być zsynchronizowane z planem
  pracy zespołu. Jedyne zidentyfikowane realne ryzyko: `§14` używa starszej numeracji "Rozdział
  0–12" nie pokrywającej się 1:1 z dzisiejszą "Moduł/Kafel 1–13" z `docs/zrodla/` — dopisano
  jednozdaniowe zastrzeżenie w `§14`, nie przenumerowano całej roadmapy (to i tak inny dokument).
  Wersja zasad `ZASADY_APLIKACJI.md`/`USTALENIA.md` → 0.1.4.
  **Nie robimy:** terminu "AI" dla mechanizmu presetów (to deterministyczne mapowanie, nie ML —
  patrz `docs/standards/09-ai-w-produkcie.md`), auto-zmiany układu pulpitu w trakcie pracy usera
  (tylko propozycja + jawne zatwierdzenie).
  **Otwarte:** 8 presetów onboardingu i presety per moduł — do przejrzenia/potwierdzenia przez
  autora przed implementacją; implementacja (`AdaptiveMenu` + strona główna) jeszcze nie
  rozpoczęta, świadomie (autor wybrał "spisz decyzję, jeszcze bez kodu").

## Decyzje i uzasadnienie (c.d. 8)

- **2026-08-30 — `§14` jednak przenumerowane w pełni, nie tylko zastrzeżenie (koryguje wpis wyżej).**
  Autor dopytał wprost o jeden fragment ("stary Rozdział 6 = Stress-test, dzisiejszy Moduł 6 =
  Ogrzewanie") i po weryfikacji ("dawne N.x" w `docs/zrodla/` to bezpośrednio stara numeracja)
  poprosił o rozwiązanie, nie tylko oznaczenie problemu. **Zweryfikowane źródłowo, nie zgadywane:**
  stary Rozdział 0–6 → dzisiejszy Moduł 1–7 to proste przesunięcie +1 (stary system liczył od 0);
  od Rozdziału 7 wzwyż kolejność faktycznie się przetasowała (Live 7→13, Kalkulator 8→12, Montaż
  9+10→11, ESP32 11→9, AI 12→10); Moduł 8 (Bezpieczeństwo) nie istniał jako osobny stary rozdział —
  złożony z kawałków starych 6+11+12 (cross-cutting, potwierdzone wprost w
  `Tresc_Modul_8_Bezpieczenstwo_Ekrany.md`). Pełna tabela: `docs/pulpit-i-nawigacja.md` §2.
  **Wykonano:** `ZASADY_APLIKACJI.md` §14 przepisane na wyłącznie numerację Moduł N; wersja
  pierwotna ("Rozdział") zachowana w zwijanym bloku `<details>`, nie usunięta (Zasada 14.2).
  Poprawiono też dwie stale referencje do starej numeracji w §11 (Freemium: "Rozdz. 8" →
  doprecyzowane jako "dawny Rozdz. 8, dzisiejszy Moduł 12") w obu plikach. Wersja zasad → 0.1.5.
  **Nie ruszone świadomie:** wpisy D-1/D-01 w dzienniku zmian i CZĘŚCI II `USTALENIA.md` — to
  historyczne zapisy konkretnej decyzji o liczbie funkcji (inny temat niż kolejność budowy),
  zostają z oryginalną numeracją jako ślad historii, zgodnie z zasadą "nie usuwaj — oznacz".

## Decyzje i uzasadnienie (c.d. 9)

- **2026-08-30 — `§14` skorygowane po raz drugi: czysta kolejność 1→13, bez wyjątków.** Autor
  zauważył, że wersja 0.1.5 (wyżej) nie była tym samym co kolejność kafli pulpitu, którą już
  zaakceptował wcześniej w tej samej sesji (`docs/pulpit-i-nawigacja.md` §2) — 0.1.5 zachowała
  stary wyjątek "wyciągnij Moduł 12 do przodu na wczesne demo" (odziedziczony z pierwotnej wersji
  z 2026-08-28). **Decyzja autora:** ten wyjątek jest nieaktualny, porzucony. `§14` teraz = czysta
  kolejność zależności danych 1→13, identyczna z kolejnością kafli pulpitu — jeden system, nie dwa
  podobne, ale nie identyczne. Dodatkowo: **Kafel 14 (Ustawienia) dostał własny, jawny punkt**
  (krok 2 planu budowy) — wcześniej był tylko domyślnie/niejawnie wliczony w krok "szkielet", co
  autor uznał za mylące ("nie stałe trzymać go w głowie"). Obie poprzednie wersje (2026-08-28
  "Rozdział" i 2026-08-30 pierwsza korekta "Moduł z wyjątkiem") zachowane w zwijanych blokach w
  `ZASADY_APLIKACJI.md` §14, nic nie usunięte. Wersja zasad → 0.1.6.

## Decyzje i uzasadnienie (c.d. 10)

- **2026-08-30 — Pulpit adaptacyjny zaimplementowany (v1) + 7 brakujących modułów dostało ekran.**
  Autor poprosił o realny, klikalny pulpit do paczki dla v0 — wymóg: każdy z 13 kafli musi
  prowadzić do czegoś realnego, nie ślepego zaułka. Moduły 3, 4, 5, 8, 9 miały to już z wzorców
  A–H; zbudowano po jednym prostym ekranie dla pozostałych sześciu (1, 6, 7, 10, 11, 12, 13 —
  Moduł 1 był już wcześniej pusty, dopisany przy okazji) — szczegóły i pliki w
  `docs/rejestr-pokrycia.md`. Świadome uproszczenia bez fabrykowania danych: Moduł 1 (Lokalizacja)
  tylko tryb offline/ręczny (integracja PVGIS poza zakresem); Moduł 10 (Prognozy) i Moduł 8 (już
  wcześniej) na danych demonstracyjnych, jawnie oznaczonych; Moduł 13 (Live) to czysta bramka
  informacyjna bez modułu domenowego — pokazuje "brak połączenia z telemetrią", nie zmyśla danych.

  **Pulpit:** `lib/pulpit/registry.ts` (jedyne źródło prawdy — 13 kafli + Kafel 14, każdy z listą
  zarejestrowanych ekranów), `lib/pulpit/storage.ts` (preferencje widoczności/kolejności w
  `localStorage` — Zasada 6, "drobna preferencja UI", nie dana projektu), `app/page.tsx` (siatka
  kafli — **zastąpił przestarzały `UstaleniaViewer`** hardkodowany na wersję 0.1.2, usunięty jako
  martwy kod), `app/moduly/[id]/page.tsx` (lista ekranów modułu po kliknięciu kafla),
  `app/ustawienia/page.tsx` (pokaż/ukryj/przenieś ↑↓/przywróć domyślne).

  **Pułapka napotkana i naprawiona:** pierwsza wersja (`useState`+`useEffect` do odczytu
  `localStorage` po mount) złapała nowe ESLint `react-hooks/set-state-in-effect` (blokujące,
  `next build` ma `ignoreBuildErrors: true`, więc to tylko `pnpm lint` by to złapał, nie build —
  ważne, żeby zawsze odpalać lint osobno). Naprawione przez `useSyncExternalStore` (subscribe +
  getSnapshot + getServerSnapshot z cache'owaniem referencji) — to jest właściwy hook Reacta do
  odczytu zewnętrznego źródła (localStorage) w sposób bezpieczny dla SSR/hydracji, nie obejście.

  Zweryfikowane: 87 testów, lint czysty, `tsc --noEmit` czysty, `next build` (34 trasy, w tym 13
  prerenderowanych `/moduly/[id]` przez `generateStaticParams`), ręcznie w przeglądarce (klik
  kafel → lista ekranów → realny kalkulator; ukrycie kafla w Ustawieniach → znika z pulpitu →
  "Przywróć domyślne" go zwraca; zero błędów konsoli).

  **Świadomie uproszczone w v1 (nie przeoczenia):** "Przenieś" to ↑/↓, nie drag-and-drop (ten sam
  efekt, bez nowej zależności); brak ekranu onboardingu ("co chcesz robić") — pulpit zawsze
  startuje z pełną domyślną kolejnością, presety trzeba by zastosować ręcznie; brak "Zmień
  rozmiar"/"Przypnij" z `docs/pulpit-i-nawigacja.md` §4. Zapisane jako otwarte w tym dokumencie.

## Decyzje i uzasadnienie (c.d. 11)

- **2026-08-30 — Przełącznik jasny/ciemny/systemowy zaimplementowany + brief dla v0 rozszerzony.**
  Autor: dodać przełącznik motywu od razu (odpowiedź na wcześniej otwarte pytanie), przygotować
  `docs/brief-dla-v0.md` tak, żeby v0 mógł go czytać wprost z repo, i doprecyzować dla v0 dwa
  wymogi: (1) każdy z 8 wzorców UI ma być reużywalnym szablonem/komponentem, nie kopiowanym kodem
  per ekran, (2) kolory nie mogą być hardkodowane — zawsze przez istniejące tokeny CSS.

  **Kod:** `lib/theme/storage.ts` (ten sam wzorzec co `lib/pulpit/storage.ts` —
  `useSyncExternalStore`, stan `"system" | "light" | "dark"` w `localStorage`), `components/theme-
  toggle.tsx` (przycisk 🖥️→☀️→🌙→🖥️ w pasku górnym pulpitu, `app/page.tsx`), inline skrypt w
  `app/layout.tsx` ustawiający klasę na `<html>` synchronicznie przed pierwszym malowaniem (bez
  błysku złego motywu przy odświeżeniu) — wymagało `suppressHydrationWarning` na `<html>`, bo
  klasa ustawiana poza kontrolą Reacta przed hydracją zawsze będzie się różnić od SSR-owanego
  znacznika (oczekiwane, nie błąd). Zweryfikowane w przeglądarce (Playwright): przełączanie działa,
  wybór przetrwa odświeżenie, zero błędów konsoli po dodaniu `suppressHydrationWarning`.

  ~~**Nie zrobione, czeka na decyzję autora:** żywy edytor kolorów w Ustawieniach (paleta + pole na
  HEX dla kilku kluczowych tokenów) — rekomendacja jest w `docs/brief-dla-v0.md`, sekcja "Edytor
  kolorów w Ustawieniach — opinia", ale zakres (które tokeny, kiedy budować) nie jest jeszcze
  potwierdzony.~~ — **KOREKTA (19.09.2026), dryf dokumentacji, nie świadoma decyzja (Część Y.2):**
  ten akapit był nieaktualny od samego dnia powstania. Edytor został zbudowany tego samego dnia,
  kilka godzin później — patrz `docs/brief-dla-v0.md`, sekcja "Edytor kolorów i czcionki — zrobione
  (2026-08-30)": `components/kolor-grupa-edytor.tsx`, 7 grup (tło/karty/tekst/akcent/3×werdykt),
  edycja pojedyncza i grupowa, wpięty w `/ustawienia` i `/wzornik`. Świadomie ograniczony do tych 7
  grup, nie wszystkich ~20 tokenów CSS — zapisane wprost w tym samym akapicie briefu jako decyzja,
  nie przeoczenie ("żeby nie było łatwo przypadkiem zepsuć kontrast"). Ten akapit `docs/memory.md`
  po prostu nigdy nie został poprawiony po zamknięciu zadania — znalezione przy próbie realizacji
  punktu 4 z sekcji "Sześć otwartych pytań" (19.09.2026, niżej) — zanim napisano nowy kod,
  sprawdzono istniejący stan i okazało się, że nie trzeba niczego budować.

## Decyzje i uzasadnienie (c.d. 12)

- **2026-08-30 — Edytor kolorów/czcionki + `/wzornik` + refaktoryzacja 14 ekranów na `WerdyktPanel`.**
  Autor: chce jedną stronę pokazującą wszystkie ikony/werdykty/chmurki naraz, z możliwością zmiany
  koloru pojedynczo albo grupowo (zaznacz kilka, zastosuj jeden kolor), plus wybór polskiej
  czcionki z opcją pogrubienia. Zaakceptował pełny zakres z góry ("akceptuję wszystkie twoje
  pomysły, rób to").

  **Odkrycie po drodze:** kolory werdyktu 🟢🟡🔴 były zahardkodowane jako surowe klasy Tailwind
  (`border-green-600 bg-green-50...`) osobno na 14 ekranach kalkulatorów — nie przez tokeny CSS.
  Edytor kolorów bez naprawienia tego byłby "kłamliwy" (zmiana w Ustawieniach nic by nie robiła na
  realnych ekranach) — więc zakres objął też refaktoryzację, nie tylko nowy edytor.

  **Kod:**
  - `app/globals.css` — nowe tokeny `--werdykt-ok/-uwaga/-blad` (kolor bazowy, edytowalny) +
    `--werdykt-*-bg/-border/-foreground` liczone automatycznie przez `color-mix()` (osobne
    proporcje mieszania dla jasnego/ciemnego motywu) — user zmienia jeden kolor, nie trzy odcienie
    naraz. Też: `--font-sans-user` (wskaźnik na aktywną czcionkę) i klasa `.czcionka-pogrubiona`.
  - `components/werdykt.tsx` — `WerdyktPanel`/`WerdyktBadge` (reużywalny komponent werdyktu) +
    `poziomZStatusu()`. Wszystkie 14 ekranów z hardkodowanymi klasami koloru przepisane na to
    (`audyt-pozarowy`, `cop-pompy-ciepla`, `czystosc-i-snieg`, `dobor-bezpiecznika-dc`,
    `konfigurator-stringow`, `lokalizacja-i-klimat`, `moment-dokrecania-srub`, `pomocnicze`,
    `porownanie-technologii-magazynow`, `procedura-black-start`, `prognozy`,
    `przygotowanie-stanowiska`, `systemy-podtrzymania-zycia`, `tryb-uproszczony`) — stan
    "niekompletne dane, jeszcze bez werdyktu" (np. `INCOMPLETE`) świadomie zostawiony jako osobny,
    neutralny styl (nie wciśnięty na siłę w 🟢/🟡/🔴, żeby nie sugerować oceny, której jeszcze nie ma).
  - `components/ui/chmurka.tsx` — `Chmurka`/`PomocPole` na `@base-ui/react/tooltip` (już w
    zależnościach, ten sam prymityw co `components/ui/button.tsx`) — dymek z 8.4.
  - `lib/wyglad/storage.ts` — 7 grup kolorów (Tło/Karty/Tekst/Akcent/Sukces/Uwaga/Błąd) + czcionka
    + waga tekstu, ten sam wzorzec `useSyncExternalStore`/`localStorage` co `lib/pulpit/storage.ts`
    i `lib/theme/storage.ts`. Akcent dostaje automatycznie dobrany kolor tekstu (luminancja WCAG,
    nie stały czarny/biały) — inaczej dowolny wybrany hex mógłby dać nieczytelny tekst na przycisku.
  - `app/layout.tsx` — 4 fonty przez `next/font/google` (Inter, Source Sans 3, Roboto, Lato),
    subset `latin-ext` (bez tego polskie znaki ą/ć/ę/ł/ń/ó/ś/ź/ż się nie renderują poprawnie).
    Inline skrypt w `<head>` rozszerzony: oprócz motywu odtwarza teraz też kolory/czcionkę z
    `localStorage` przed pierwszym malowaniem (ta sama logika co `lib/wyglad/storage.ts`,
    zduplikowana w czystym JS — skrypt biegnie przed hydracją, nie może importować modułów TS).
  - `components/kolor-grupa-edytor.tsx` / `components/czcionka-edytor.tsx` — UI edytorów,
    renderowane w dwóch miejscach (`app/ustawienia`, `app/wzornik`) przez ten sam komponent.
  - `app/wzornik/page.tsx` (nowy) — strona-wzornik: edytory + werdykty + chmurki + styl
    komunikatów + przyciski + typografia (z polskim pangramem) + komplet ikon nawigacji/modułów.

  **Pułapka napotkana i naprawiona:** `suppressHydrationWarning` na `<html>` było już potrzebne od
  przełącznika motywu (poprzedni wpis), ale przy dodaniu 4 klas fontowych z `next/font` trzeba było
  upewnić się, że te klasy są stosowane server-side (przez `className` w JSX, nie inline skryptem)
  — inaczej powtórzyłby się błąd hydracji. Kolory/czcionka-wybór (zmienne dynamiczne z
  `localStorage`) idą przez inline `style`/`classList` w skrypcie, klasy fontów statyczne przez
  JSX — rozdzielenie tych dwóch mechanizmów było celowe, nie przypadkowe.

  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm test` (87/87), `pnpm build` (35 tras, w tym
  `/wzornik`), Playwright — grupowa zmiana koloru w Ustawieniach/`/wzornik` widoczna po pełnej
  nawigacji na ekranie kalkulatora (`/kalkulatory/tryb-uproszczony`), zmiana czcionki, chmurka na
  hover, zrzuty ekranu jasny/ciemny na `dobor-bezpiecznika-dc` (kontrast OK w obu).

## Decyzje i uzasadnienie (c.d. 13)

- **2026-08-30 — Przycisk "Wstecz" + okruszki na wszystkich 17 ekranach kalkulatorów.** Autor
  zauważył (po pierwszej rundzie z v0), że żaden ekran `/kalkulatory/*` nie ma nawigacji powrotnej
  — brak zarówno przycisku wstecz, jak i okruszków wymaganych przez `docs/standards/08-ui-ux.md`
  8.7 ("Przycisk Wstecz zawsze w tym samym miejscu... Okruszki pokazujące pozycję w strukturze
  modułów"). To nie była luka po stronie v0 — my sami tego nie zbudowaliśmy wcześniej, na żadnym
  z 17 ekranów (wliczając 8 wzorców A–H).

  **Rozwiązanie:** `lib/pulpit/registry.ts` dostał `znajdzKafelIEkranPoHref()` (odwrotne
  wyszukiwanie: href ekranu → jego kafel + etykieta), `components/nawigacja-ekranu.tsx` —
  `NawigacjaEkranu` renderuje "← Wstecz" (do `/moduly/{id}` kafla nadrzędnego) + okruszki
  "Pulpit / Nazwa modułu / Nazwa ekranu" (oba środkowe poziomy klikalne). Świadomie **nie** przez
  `usePathname()` — każdy ekran przekazuje własny `href` jako prop, żeby nie wymuszać `"use
  client"` na ekranach czysto serwerowych (np. `audyt-pozarowy`, `prognozy`, `trasy-kablowe`).
  Wstawione na wszystkich 17 ekranów `/kalkulatory/*` (mechanicznie, jeden wzorzec).

  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm test` (87/87), `pnpm build` (35 tras),
  Playwright — kliknięcie w środkowy okruszek prowadzi do listy ekranów modułu, kliknięcie
  "Pulpit" wraca na start, "Wstecz" prowadzi do `/moduly/{id}`, zero błędów konsoli.

  **Nie zrobione w tej rundzie:** `/moduly/[id]`, `/ustawienia`, `/wzornik` mają nadal tylko
  prosty link `← Pulpit`, nie pełne okruszki — mniejszy priorytet, bo to i tak najwyższy poziom
  hierarchii (jeden krok od pulpitu), nie głęboko zagnieżdżony ekran.

## Decyzje i uzasadnienie (c.d. 14)

- **2026-08-30 — Scalona pierwsza runda projektowa v0 (branch `v0/jf7kryn4f9-6614-5a166525`).**
  v0 przeczytał `docs/brief-dla-v0.md` i zrealizował dokładnie to, o co proszono w sekcji 8:
  kolor akcentu ("Techniczny błękit", oklch(0.52 0.18 245) — dobrany świadomie z dala od hue
  werdyktów 152/70/27, żeby "wybrane" nigdy nie wyglądało jak status; alternatywa "Energetyczny
  cyjan" jako druga propozycja z żywym podglądem na `/wzornik`), skala typografii jako tokeny CSS
  (`--text-display/-h1/-h2/-h3/-body/-small/-caption`), audyt kontrastu WCAG z uzasadnieniem
  liczbowym w komentarzach (`scripts/audyt-kontrastu.mjs`, poprawki `--border`/`--input`/`--ring`),
  stany komponentów (`components/ui/pole.tsx` — `Pole`/`PoleSelect`/`PoleCheckbox`;
  `components/ui/stany.tsx` — `StanPusty`/`StanBledu`/`StanLadowania`), i zestaw komponentów
  wzorców (`components/wzorce/`: `NaglowekEkranu`, `ListaChecklist`, `KartaPorownawcza`,
  `BudowniczyListy`, `SekcjaAkordeon`, `PanelOdczytowy`/`ListaOdczytowa`, `WynikGlowny`,
  `WynikSzczegoly`, `MigawkaBox`) — dokładnie w duchu "szablon per wzorzec, nie ekran per ekran"
  z briefu. Nie dotknął `lib/core/` ani logiki obliczeniowej — zweryfikowane w diffie.

  **Konflikt scalania (spodziewany, nie błąd):** branch v0 odgałęził się przed naszym PR #8
  (przycisk Wstecz + okruszki), więc wszystkie 16 ekranów kalkulatorów, które oba branche
  zmieniały, dały prawdziwy konflikt gita (nie sprzeczność decyzji — obie zmiany były ze sobą
  zgodne, tylko dotykały tych samych linii). Scalone ręcznie: `git merge --no-commit --no-ff`,
  potem per plik "zachowaj obie strony" (import + `<NawigacjaEkranu>` z naszej strony, resztę
  przebudowy z `Pole`/`NaglowekEkranu`/`Stan*` od v0).

  **Dwie pułapki znalezione i naprawione po scaleniu (programistyczne rozstrzygnięcie konfliktu
  „zachowaj obie strony” zostawiło błędy, nie tylko redundancję):**
  1. **Zdublowany nagłówek na wszystkich 16 ekranach** — stary surowy `<div><h1 className="text-xl
     font-semibold">...</div>` (nasza strona konfliktu) został wyrenderowany **obok**, nie
     zamiast, nowego `<NaglowekEkranu>` v0 — dwa identyczne nagłówki jeden pod drugim, widoczne
     wizualnie, nie tylko w kodzie. Naprawione: usunięty stary blok, zostawiony tylko
     `NaglowekEkranu`. **Wniosek na przyszłość:** przy scalaniu konfliktu metodą "zachowaj obie
     strony" zawsze sprawdzić wizualnie (nie tylko `tsc`/`lint`/`build`) ekrany, gdzie obie strony
     zmieniały tę samą, wyrenderowaną treść — kompilacja przechodzi czysto nawet z dublującą się
     treścią.
  2. **`tryb-uproszczony` stracił `<NawigacjaEkranu>` całkowicie** — to jedyny z 17 plików, gdzie
     auto-merge gita zaszedł **bez** konfliktu (bo hunki nie nachodziły na siebie tekstowo), ale
     po cichu wziął tylko wersję v0 i zgubił nasz breadcrumb. Naprawione ręcznie — dopisany import
     i `<NawigacjaEkranu href="/kalkulatory/tryb-uproszczony" />`. **Wniosek:** brak konfliktu przy
     mergu nie znaczy brak utraty zmian — zawsze warto zweryfikować liczbę wystąpień kluczowego
     markera (`grep -c` po nazwie komponentu) po scaleniu, nie tylko polegać na "0 CONFLICT".

  Po naprawie: martwy kod po stronie starych helperów (`inputClass`/`Field`/`cn` nieużywane —
  zastąpione przez `Pole`/`Stan*`) posprzątany w 9 plikach, gdzie lint to wyłapał. Zweryfikowane
  od nowa po każdej naprawie: `tsc --noEmit`, `pnpm lint` (0/0), `pnpm test` (87/87), `pnpm build`
  (35 tras), Playwright (zrzuty ekranu `/`, `/wzornik`, `dobor-bezpiecznika-dc`,
  `katalog-czujnikow`, `tryb-uproszczony` — poprawny akcent, poprawne okruszki, zero błędów
  konsoli, brak duplikatów).

  **Pozostałe branche v0 bez unikalnej treści** (`design-system-refinement`, `design-system-
  refinement-1/-2`, pozostałe `v0/jf7kryn4f9-*`) — 0 commitów przed `main`, nie wymagają scalenia
  (prawdopodobnie checkpointy tej samej sesji v0 albo już nieaktualne warianty).

## Decyzje i uzasadnienie (c.d. 15)

- **Animowane ikony kafli pulpitu (kafle 1–7) wdrożone z artefaktu roboczego.** System ikon
  dopracowywany iteracyjnie w podglądowym Claude Artifact ("Off-Grid Tile Set") — jeden SVG
  `<symbol>` + zestaw CSS `@keyframes` per kafel, instancjonowany przez `<use>`. Przeniesiony
  1:1 do repo: `components/kafle-ikony/definicje-symboli.tsx` (defs wstrzyknięte przez
  `dangerouslySetInnerHTML` — świadoma decyzja: to statyczna, ręcznie autoryzowana treść, nie
  dane użytkownika, a ręczna konwersja setek SVG-atrybutów na JSX byłaby wyższym ryzykiem
  literówki niż wklejenie ze źródła), `kafle-ikony.css` (wszystkie animacje, zaczepione o klasę
  `.kafel-ikona-svg` i nazwy `@keyframes` z prefiksem `ki-` — żeby generyczne nazwy typu `.bar`
  czy `.flow` z artefaktu nie wyciekły jako globalne selektory do reszty aplikacji), `ikona.tsx`
  (mapowanie `id kafla → id symbolu` + `KAFLE_ZE_ZBUDOWANA_IKONA` do wyboru SVG vs emoji-fallback).
  `app/page.tsx` (Pulpit) renderuje `<KafelIkonaSvg>` dla kafli 1–7, pozostałe (8–14) zostają na
  emoji z `lib/pulpit/registry.ts`, dopóki ich ikony nie powstaną w artefakcie.
- **Kafel 01 zablokowany w artefakcie jako finalny** (pinezka GPS niebieska zamiast zielonej) —
  nowy wzorzec pracy: "dopracuj jeden kafel idealnie, oznacz jako Locked, nie wracaj do niego bez
  wyraźnej prośby". Kafle 02/04/06/07 dostały tego dnia poprawki (przepływ prądu kończący się na
  błyskawicy i niżej umieszczona chmurka w 02; 12 ogniw LiFePO4 w jednej obudowie zamiast 3 dużych
  w 04; prawdziwy dom + ogrzewanie podłogowe zamiast samego prostokąta w 06; kontrastowy śnieg,
  ogrzewanie podłogowe, zsynchronizowane drenowanie baterii z rosnącą temperaturą i przeniesiony
  termometr w 07) — nie są jeszcze jawnie zablokowane przez użytkownika, mogą wrócić do edycji.
  Kafle 03 i 05 bez zmian od poprzedniej rundy. Kafle 08–14 czekają na dopracowanie w artefakcie.
  Zweryfikowane: `tsc --noEmit`, `pnpm lint`, `pnpm build` (czysto), Playwright — `/` w jasnym i
  ciemnym motywie, animacje (cykl dzień/noc) faktycznie się kręcą.

## Decyzje i uzasadnienie (c.d. 16)

- **2026-09-03 — Pierwsza pełna synchronizacja z `new-app-standards`, przyjęty GOD BOOK jako metodologia procesowa.** Sprawdzono `AKTUALIZACJE.md` w `new-app-standards` (dotąd nigdy nie sprawdzane — mechanizm sam w sobie powstał dopiero tego dnia, Część Y.5–Y.8 GOD BOOK v2.3). Znaleziska: (1) rozdział 16 (`standard-kodowania.md`) brakował całkowicie; (2) wszystkie 17 dotychczasowych rozdziałów (`00-INDEKS`+`00`–`15`) faktycznie się różniły od lokalnej kopii — nie tylko kosmetycznie (m.in. nowa Zasada 6 filozofii — kod prosty do utrzymania przez człowieka; standard odchudzony z odniesień specyficznych dla "rodziny Inżynier Pro" na w pełni domenowo-neutralny; doprecyzowania bezpieczeństwa); (3) zintegrowano zupełnie nowy pakiet metodologiczny "GOD BOOK" (`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md`, 892 linii) — proces budowy/prowadzenia "Biblii projektu", spięty ze standardem przez nową Część Y (standard = fundament poprzedzający Krok 0 tej metodologii, nie kolejny poziom hierarchii; przy kolizji: dryf bez świadomej decyzji naprawiasz sam, świadomy konflikt zawsze zgłaszasz — patrz Część Y.2).
  **Wykonane (za jawną zgodą użytkownika, "wszystko na raz"):** odświeżono `docs/standards/00`–`16` w całości (kategoria NIETYKALNE, GOD BOOK Y.8 — pełny nadpis bez negocjacji, lokalna różnica w tych plikach to dryf, nie świadoma decyzja). Dodano `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_3.md` i `PROMPT_STARTOWY.md` (też NIETYKALNE). Utworzono z szablonów (kategoria LOKALNE, nowe pliki): `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md` (kanał zwrotny do `new-app-standards` — AI dopisuje tu z własnej inicjatywy, nigdy nie edytuje repo źródłowego bezpośrednio). Punktowo poprawiono (kategoria ADAPTOWALNE — patch, nie nadpis): `CLAUDE.md` (kolejność czytania na start, nowe odsyłacze do GOD BOOK i Części Y, liczba rozdziałów 16→17) i `.claude/skills/standards/SKILL.md` (odsyłacz do GOD BOOK jako fundamentu poprzedzającego, liczba rozdziałów). Dodana ta sekcja "Synchronizacja ze standardem" (obowiązkowa od Y.5/Y.6 — sprawdzać `AKTUALIZACJE.md` co ≤7 dni, zapisywać datę tutaj).
  **Świadomie NIE wykonane:** migracja `ZASADY_APLIKACJI.md`/`USTALENIA.md`/`docs/zrodla/`/`docs/rejestr-pokrycia.md` do kanonicznego nazewnictwa plików GOD BOOK (`00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`, `02_Dyrektywy_AI_Projektu.md`, `rejestr-decyzji.md`...). Te pliki są kategorii LOKALNE (Y.8 — "sync tego nie dotyka, to własność projektu") i już w praktyce pełnią rolę Biblii tego projektu — restrukturyzacja nazw to osobna, świadoma decyzja projektowa (GOD BOOK Część P/S), nie automatyczny efekt sync'u. Zostaje otwarte w `docs/lista-do-zrobienia.md`.

## Decyzje i uzasadnienie (c.d. 17)

- **2026-09-03 — Audyt zgodności apki z odświeżonym standardem (17 rozdziałów), 3 realne
  niezgodności naprawione.** Sprawdzone empirycznie (grep + czytanie kodu, nie deklaracja):
  warstwy (01) czyste — `lib/core/` nigdzie nie importuje `@/app`/`@/components`; kontrakt
  `CalcResult`/`Warning` (03.2, 04.2) konsekwentnie używany we wszystkich 15 modułach; nazewnictwo
  z jednostką (16.2), zamknięte unie zamiast stringów (16.4), zero generycznych `throw` (16.5) —
  zgodne; jeden lockfile; zero sekretów w repo; `pnpm test` 87/87.
  **Naprawione:**
  1. **Reporter (03.6/16.5) nie był nigdzie użyty** — `lib/core/reporter.ts` istniał jako kontrakt
     bez ani jednego importu. Catch-bloki w `lib/pulpit/storage.ts`, `lib/wyglad/storage.ts`,
     `lib/theme/storage.ts` (odczyt/zapis localStorage) teraz wołają `consoleReporter.reportError`
     zamiast cichego połykania błędu — 8 miejsc łącznie, z zachowaniem dotychczasowego fallbacku
     (te błędy nie są krytyczne, to drobne preferencje UI, nie dane domenowe).
  2. **Brak zbiorczego rejestru twardych stopów (04.3)** — dodano `docs/rejestr-twardych-stopow.md`,
     zbudowany z realnie znalezionych w kodzie faktów bezpieczeństwa (AIC bezpiecznika < prąd
     zwarciowy, agregat bez ładowarki niszczy ogniwa, pasta miedziowa na aluminium, klucz udarowy
     na terminalach, komplet PPE przed montażem baterii), pogrupowanych tematycznie z odsyłaczami
     do plików źródłowych — nie wypisano tam generycznej walidacji formularza (`notPositive` itp.),
     bo to nie są fakty domenowe w sensie 4.3, tylko bramka poprawności danych; to osobna,
     jednozdaniowa sekcja na końcu pliku. Przy okazji znaleziona i **świadomie nierozstrzygnięta**
     kwestia: `KROK-POZA-KOLEJNOSCIA` (Black Start, M7/E5) ma poziom `warning`, mimo że opisuje
     realne ryzyko — zostawione do decyzji właściciela projektu (`docs/standards/15`, 15.4),
     zapisane w `docs/lista-do-zrobienia.md`.
  3. **`StorageAdapter` (05.2) to sam kontrakt, bez implementacji i bez jednego wywołania w
     kodzie** — nie zbudowano IndexedDB teraz (byłoby to spekulacyjne: apka nie ma jeszcze żadnej
     funkcji zapisującej Seed projektu, każdy kalkulator liczy w locie z pól formularza).
     Zdecydowano: dopisać w komentarzu w kodzie i w `docs/lista-do-zrobienia.md` jawny warunek
     wyzwalający implementację (pierwsza funkcja "zapisz projekt"), żeby to była udokumentowana,
     świadoma decyzja, a nie cicho zapomniana luka.
  Zweryfikowane po zmianach: `tsc --noEmit` czysto, `pnpm test` nadal 87/87 (poprawki nie dotknęły
  logiki kalkulatorów, tylko catch-bloki trzech magazynów UI-preferencji).

## Decyzje i uzasadnienie (c.d. 18)

- **2026-09-03 — Ekran A1, Moduł 11 (Montaż baterii): "Weryfikacja kompletności i kontrola
  wstępna ogniw" zaimplementowany.** Pierwszy z rozdziału "podłączanie baterii" (Ścieżka LiFePO4,
  `docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md`) — użytkownik wybrał tylko A1 z zaproponowanej
  listy (A1/A3/A4/A6), A2/A5 świadomie odłożone. Świadoma decyzja projektowa: dwa punkty checklisty
  źródła ("liczba ogniw zgodna z napięciem", "różnica napięć <0,05V") mają realną logikę liczbową
  do policzenia z danych, które user i tak wpisuje — zamiast pytać "czy sprawdziłeś", apka liczy to
  sama (`OCZEKIWANA_LICZBA_OGNIW` 12V=4S/24V=8S/48V=16S, `MAX_ROZNICA_NAPIEC_V=0.05`). Tylko
  BMS-bez-balancera i różnica napięć są oznaczone 🔴 w źródle → `level: "critical"`; niezgodność
  liczby ogniw nie ma tam 🔴 → celowo `level: "warning"`, nie wymyślone. Reszta checklisty
  (narzędzia/PPE/rezystancja/ocena wizualna) — zwykły `ListaChecklist`, wzorzec z A7.
  **Naprawiony w trakcie realny błąd UX** (znaleziony przy weryfikacji w przeglądarce, nie
  domyślony): pole ogniwa zainicjowane na `0` było traktowane jako błąd walidacji ("musi być
  większe od zera") zamiast jako "jeszcze nie wypełnione" — na starcie ekran pokazywał 16
  komunikatów błędu naraz. Naprawione: `0` = niewypełnione → `INCOMPLETE`; tylko wartość ujemna to
  błąd. Zaktualizowano `docs/rejestr-pokrycia.md` (nowa sekcja "Moduł 11" z pełnym rozpisaniem
  A1–A10/B1–B12, nie tylko wierszem w zbiorczej tabeli) i `docs/rejestr-twardych-stopow.md` (2 nowe
  pozycje w kategorii Bateryjne). Zweryfikowane: 9 testów (nominalny/graniczny/błąd/niekompletne),
  `tsc`/`lint`/`pnpm test` 96/96/`pnpm build` czysto, Playwright — cztery stany werdyktu (pusty,
  🔴 brak BMS, 🔴 różnica napięć, 🟢 gotowe) w przeglądarce.

## Decyzje i uzasadnienie (c.d. 19)

- **2026-09-03 — Ekran A3, Moduł 11: "Połączenia elektryczne i kolejność łączenia".**
  Właściciel projektu ustalił termin: **piątek 2026-09-04 20:00 — maksymalna liczba rozdziałów**,
  tempo pracy odpowiednio przyspieszone (mniej narracji, więcej kodu, wpisy do `docs/memory.md`
  zwięźlejsze niż zwykle, bez utraty dyscypliny weryfikacji). A3 to 1:1 logika Procedury Black
  Start (Moduł 7, Ekran 5) — checklist z wymuszoną kolejnością, skopiowany wzorzec
  (`lib/core/modules/montaz-baterii/polaczenia-elektryczne/`, 4 testy, UI:
  `app/kalkulatory/polaczenia-elektryczne/page.tsx`). Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (100/100)/`pnpm build` czysto, Playwright (stan poza kolejnością → 🟡, wszystko po kolei → 🟢).

## Decyzje i uzasadnienie (c.d. 20)

- **2026-09-03 — Ekran A4, Moduł 11: "Podłączenie BMS" — pierwszy prawdziwy Doradca (Wzorzec D)
  w tym module.** Wzór `T = 5 × R_pre × C` (czas pre-charge kondensatorów falownika) liczony
  niezależnie od checklisty — użytkownik potrzebuje tej liczby, zanim wykona krok 3, więc panel
  wyniku jest widoczny od razu, checklist (kolejność jak A3) rządzi tylko werdyktem gotowości.
  50Ω to tylko przykład ze źródła użyty jako sugerowana wartość startowa pola, nie ukryty domyślny
  (rezystor faktycznie użyty musi być świadomie wpisany/potwierdzony przez montera).
  `lib/core/modules/montaz-baterii/podlaczenie-bms/`, 6 testów, UI:
  `app/kalkulatory/podlaczenie-bms/page.tsx`. Dopisano do `docs/rejestr-twardych-stopow.md`
  (kategoria Elektryczne/pożarowe: brak pre-charge → zaiskrzenie i uszkodzenie styków).
  Zweryfikowane: `tsc`/`lint`/`pnpm test` (106/106)/`pnpm build` czysto, Playwright.

## Decyzje i uzasadnienie (c.d. 21)

- **2026-09-03 — Ekran A6, Moduł 11: "Demontaż pakietu" — zamyka zaplanowaną czwórkę
  Ścieżki A (A1/A3/A4/A6).** Checklist z wymuszoną kolejnością (jak A3/A4) + warunek wstępny ze
  źródła policzony naprawdę: napięcie ogniwa = napięcie pakietu / S (reużywa
  `OCZEKIWANA_LICZBA_OGNIW` z Ekranu A1, zero duplikacji tej samej stałej domenowej), ostrzeżenie
  krytyczne gdy >3,2V/ogniwo — dokładny próg ze źródła, nic nie wymyślone. `lib/core/modules/
  montaz-baterii/demontaz-pakietu/`, 6 testów, UI: `app/kalkulatory/demontaz-pakietu/page.tsx`.
  Dopisano do `docs/rejestr-twardych-stopow.md`. Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (112/112)/`pnpm build` czysto, Playwright (stan "wciąż naładowany" → 🔴, stan bezpieczny + pełny
  checklist → 🟢).
  **Rozdział "podłączanie baterii" (Moduł 11, Ścieżka A) — 6/10 ekranów gotowych** (A1, A3, A4, A6,
  A7 gotowe wcześniej; A2/A5 świadomie odłożone; A8–A10 i cała Ścieżka B nadal `todo`). Właściciel
  projektu ustalił termin: piątek 2026-09-04 20:00, maksymalna liczba rozdziałów — następny krok
  (kontynuacja Modułu 11 vs. inny moduł) do potwierdzenia na starcie kolejnej rundy pracy.

## Decyzje i uzasadnienie (c.d. 22)

- **2026-09-03 — Ekran A9, Moduł 11: "Ratowanie głęboko rozładowanego ogniwa".** Drugi prawdziwy
  Doradca (Wzorzec D) w tym module — trzy strefy decyzyjne z pomiaru napięcia (0V / (0,1,5V] /
  >1,5V), dokładnie jak w źródle, nic pomiędzy nie wymyślone. **Ważna różnica konstrukcyjna
  względem Ekranu A1:** tu `0` jest prawdziwym, krytycznym wynikiem pomiaru (ogniwo martwe), nie
  placeholderem "jeszcze niewypełnione" jak w A1 — więc `napiecieOgniwaV: number | null` zamiast
  reużycia sztuczki "0 = incomplete". Typ zamknięty `Strefa = "krytyczna"|"ryzykowna"|"bezpieczna"`
  (16.4). Dopisano do `docs/rejestr-twardych-stopow.md`. Złapany przez lint przed commitem: proste
  cudzysłowy w JSX (`react/no-unescaped-entities`) — poprawione na typograficzne „…”.
  `lib/core/modules/montaz-baterii/ratowanie-ogniwa/`, 6 testów, UI:
  `app/kalkulatory/ratowanie-ogniwa/page.tsx`. Zweryfikowane: `tsc`/`lint`/`pnpm test`
  (118/118)/`pnpm build` czysto, Playwright (trzy strefy: 🔴 0V, 🟡 niskie-niezerowe, 🟢 bezpieczne).

## Decyzje i uzasadnienie (c.d. 23)

- **2026-09-03 — Ekran A8, Moduł 11: "Ocena zużycia ogniwa po demontażu" — 7/10 Ścieżki A.**
  Źródło opisuje trzy "pomiary do wykonania" (grubość vs fabryczna, napięcie po 24h, rezystancja
  wewnętrzna) bez podania progów liczbowych dla żadnego z nich — świadomie zamodelowane jako
  checklist procesu (Wzorzec E), nie jako pola z walidacją, żeby nie wymyślać tolerancji, których
  źródło nie podaje. Jedyny realnie decydowalny warunek to ocena wizualna puchnięcia obudowy —
  ten sam wzorzec co pozycja "ocena wizualna" w checklistcie Ekranu A1 (przycisk Tak/Nie zamiast
  liczonego progu grubości, bo źródło opisuje to jako ocenę wzrokową, nie pomiar z tolerancją).
  Puchnięcie wygrywa natychmiast, niezależnie od postępu checklisty. Dopisano do
  `docs/rejestr-twardych-stopow.md`. `lib/core/modules/montaz-baterii/ocena-zuzycia/`, 4 testy,
  UI: `app/kalkulatory/ocena-zuzycia/page.tsx` (pierwsze użycie w tym repo par przycisków
  Tak/Nie stylowanych przez Tailwind `aria-pressed:` zamiast osobnego komponentu — sprawdzone
  w przeglądarce, działa poprawnie). Zweryfikowane: `tsc`/`lint`/`pnpm test` (122/122)/`pnpm build`
  czysto, Playwright (puchnięcie → 🔴 natychmiast, checklist pełny bez puchnięcia → 🟢).

## Decyzje i uzasadnienie (c.d. 24)

- **2026-09-03 — Ekran A10, Moduł 11: "Przechowywanie / recykling / narzędzia diagnostyczne" —
  Ścieżka A LiFePO4 kompletna (8/10, A2/A5 świadomie odłożone).** Wzorzec C, dokładnie ten sam
  kształt co `trasy-kablowe` (Moduł 5) i `czystosc-i-snieg` (Moduł 3): brak kalkulatora, treść
  1:1 ze źródła w trzech niezależnych, uzupełniających się akordeonach (`SekcjaAkordeon`) —
  Przechowywanie / Recykling / Narzędzia diagnostyczne. `lib/core/modules/montaz-baterii/
  przechowywanie-recykling/constants.ts`, UI: `app/kalkulatory/przechowywanie-recykling/page.tsx`.
  Brak nowych testów (ten wzorzec ekranu nigdy ich nie miał — nie ma logiki do przetestowania).
  **Rozważono i świadomie NIE dopisano do `docs/rejestr-twardych-stopow.md`:** źródło opisuje
  rozładowanie pakietu do 0V przed oddaniem do recyklingu (np. przez zanurzenie w słonej wodzie)
  jako "metodę kontrolowaną, wymagającą zrozumienia ryzyka" — realna ostrożność, ale bez żadnego
  werdyktu 🔴/logiki na tym ekranie (ekran nie ma kalkulatora), więc nie pasuje do zakresu
  rejestru (który indeksuje warunki *sprawdzane w kodzie*, nie każdą ostrożną uwagę w treści).
  Zweryfikowane: `tsc`/`lint`/`pnpm test` (122/122, bez zmian — brak nowej logiki)/`pnpm build`
  czysto, Playwright (wszystkie 3 akordeony rozwijają się poprawnie, treść zgodna ze źródłem).

## Decyzje i uzasadnienie (c.d. 25)

- **2026-09-03 — Ścieżka B (kwasowo-ołowiowa), Moduł 11: 11/12 ekranów w jednym przejściu, po
  zamknięciu Ścieżki A.** Pełny tekst źródłowy B1–B12 przeczytany naraz
  (`docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md`, linie 145–282), co pozwoliło zaprojektować
  wszystkie ekrany od razu zamiast pojedynczo — bez zmiany rygoru weryfikacji (każdy ekran ma swój
  wpis w `docs/rejestr-pokrycia.md`, testy tam gdzie jest logika domenowa, jeden wspólny PR).
  - **B1/B3/B6/B8** — checklisty bez wymuszonej kolejności, dokładny klon wzorca A1/A7 (`ChecklistItem`
    z opcjonalnym `uwaga`, `calculate*` liczy tylko `potwierdzone/razem`).
  - **B2/B7** — B2 to ten sam wzorzec co B1 (twardy stop wentylacji dopisany jako `OSTRZEZENIA_STALE`,
    nie osobna gałąź logiki — checklist i tak wymaga 100% przed VALID). B7 to checklist z wymuszoną
    kolejnością, klon A3/A6.
  - **B4 (Balansery zewnętrzne)** — źródło nie podaje explicit progu liczbowego, ale sekcja B
    jednoznacznie mówi "balanser wymagany przy akumulatorach w szeregu" — próg `≥2` wyprowadzony
    wprost z definicji "szeregu" (1 akumulator = brak szeregu = brak ryzyka rozjazdu), nie
    wymyślony. 5 testów, dopisany do `docs/rejestr-twardych-stopow.md`.
  - **B5 (Dobór kabli) — świadomie NIE zbudowany.** Źródło: "ten sam silnik co Moduł 5, Ekran 1 —
    inne wartości wejściowe." Ale Moduł 5 Ekran 1 (dobór przekroju kabla) nie istnieje jeszcze w
    kodzie (Moduł 5 ma tylko Ekran 19 — trasy kablowe). Budowa tymczasowego, równoległego silnika
    wymagałaby wymyślenia tabel obciążalności/AIC nieobecnych w dostępnym materiale źródłowym dla
    B5 samodzielnie — złamałoby to zasadę "nie wymyślaj brakujących norm" (CLAUDE.md). Zamiast
    tego: flagowane jako `⚠️ blocked` w `docs/rejestr-pokrycia.md` i `docs/rejestr-twardych-stopow.md`
    ("Znane luki"), czeka na Moduł 5 Ekran 1, który B5 powinien wtedy re-używać (wzorzec "echo").
  - **B9 (Gęstość elektrolitu)** — trzy strefy z tabeli referencyjnej źródła (1,28=pełny/1,20=
    połowa/1,12=rozładowany); granice stref = same podane wartości (ten sam wzorzec co pojedynczy
    próg 1,5V w A9), żadna wartość pośrednia nie została wymyślona. Przykład źródła (gęstość
    1,15 g/cm³ → "naładowany w ok. 35%, wymagane doładowanie") odtworzony w teście jako
    `stan: "rozladowany"` — celowo NIE zaimplementowano interpolacji liniowej do wyliczania
    dokładnego %, żeby nie ryzykować wymyślenia formuły, której źródło nie podaje wprost; ekran
    pokazuje strefę i cytuje przykład jako opis, nie liczy %.
  - **B10 (Ocena zasiarczenia) — świadome odstępstwo od wzorca checklisty procesu.** W
    odróżnieniu od A7/B1/B6/B8 (gdzie "niezaznaczone" = "jeszcze nie sprawdzone"), tu każda
    pozycja to obserwowalny objaw — "niezaznaczone" realnie znaczy "nieobserwowany". Dlatego
    kalkulator ma pełną logikę werdyktu (≥1 objaw → ostrzeżenie z odesłaniem do B11), czego A8
    świadomie unikał dla swoich 2 pomiarów bez progu (tam wybór był między "brak progu" a
    "wymyślony próg"; tu wyboru nie trzeba było robić, bo semantyka pola jest inna).
  - **B11 (Ratowanie zasiarczenia) — zmiana etykiety z "Wzorzec D" na treść (Wzorzec C).**
    Pierwotny wpis w `docs/rejestr-pokrycia.md` (sprzed tej sesji) oznaczał B11 jako Wzorzec D,
    ale źródło nie daje żadnej gałęzi decyzyjnej ani progu — jedno stałe zalecenie (tryb
    "Repair"/"Desulfation" ładowarki). Zbudowany jako czysta treść, jawnie odnotowane jako
    odstępstwo od pierwotnej etykiety w `docs/rejestr-pokrycia.md`, nie ciche przemilczenie.
  - **B12 (Przechowywanie/recykling)** — ten sam wzorzec co A10, ale z ważną różnicą: oba twarde
    fakty (mróz, zakaz wylewania kwasu) SĄ oznaczone 🔴 w źródle (w odróżnieniu od A10, gdzie
    ostrożność przy słonej wodzie nie miała takiego oznaczenia) — dlatego, inaczej niż przy A10,
    tu oba fakty DOPISANO do `docs/rejestr-twardych-stopow.md`, mimo że ekran nie ma kalkulatora
    (rejestr indeksuje fakty oznaczone 🔴 w źródle, nie tylko warunki gated przez żywą logikę —
    potwierdzone precedensem `moment-dokrecania-srub`/`OSTRZEZENIA_STALE`).
  - Zweryfikowane razem: `tsc`/`lint` czysto, `pnpm test` 137/137 (15 nowych, w B4/B9/B10),
    `pnpm build` czysto (11 nowych tras), Playwright na 3 reprezentatywnych ekranach (B4 werdykt
    krytyczny→ok po zaznaczeniu balansera, B9 strefa "rozładowany" dokładnie wg przykładu źródła,
    B10 checklist objawów z ostrzeżeniem). **Moduł 11 razem: 19/22 (Ścieżka A 8/10, Ścieżka B
    11/12, B5 blocked, A2/A5 odłożone).**

## Decyzje i uzasadnienie (c.d. 26)

- **2026-09-03 — Moduł 5 Ekran 1 sprawdzony i odrzucony jako następny krok (blocked, nie
  zbudowany) — konsekwentne z decyzją B5.** Po zamknięciu Ścieżki B (PR #20), naturalnym
  następnym krokiem wydawało się zbudowanie Moduł 5 Ekran 1 (dobór przekroju kabla), bo
  odblokowałoby to zawieszony Ekran B5. Po przeczytaniu pełnego źródła (`docs/zrodla/
  Tresc_Modul_5_Okablowanie_Ekrany.md`, linie 9–52) okazało się, że silnik wymaga tabeli
  normatywnej PN-IEC 60364-5-52 (obciążalność bazowa kabla wg przekroju/materiału) oraz pełnych
  tabel współczynników korekcyjnych (temperatura, liczba kabli w wiązce, sposób ułożenia) — źródło
  podaje tylko PO JEDNEJ przykładowej wartości na współczynnik (k1=0,87 dla 40°C, k2=0,70 dla 4
  kabli), nie kompletne tabele. Budowa silnika bez tych danych oznaczałaby wymyślenie norm
  bezpieczeństwa elektrycznego — złamałoby to najbardziej podstawowy zakaz z CLAUDE.md. **Decyzja:
  nie budować.** Oba ekrany (M5/E1 i B5) zostają `⚠️ blocked` w `docs/rejestr-pokrycia.md` i
  `docs/rejestr-twardych-stopow.md`, czekając na dostarczenie pełnej tabeli normatywnej przez
  właściciela projektu — to nie jest "zabrakło czasu", to świadome zatrzymanie się przed granicą
  wymyślania danych inżynierskich.
- **2026-09-03 — Ekran 4, Moduł 2: "Liczba domowników" (Wzorzec D-lite) zaimplementowany
  zamiast tego.** Wybrany jako następny krok po odrzuceniu M5/E1 — jedyny ekran w kolejce
  `docs/rejestr-pokrycia.md` (Moduł 2) ze standalone, kompletnym wzorem źródłowym niezależnym od
  jeszcze niezbudowanych ekranów. Źródło: suwak 1–6 osób, zasilający docelowo C.W.U. (Ekran 2),
  częstotliwość prania/gotowania (Ekran 3) i profil zużycia wody (Moduł 10) — żaden z tych trzech
  ekranów jeszcze nie istnieje, więc zaimplementowano tylko jedyny fragment z gotowym wzorem
  niezależnym od nich: dobowe zapotrzebowanie C.W.U. = liczba domowników × 50–70 l (zakres 1:1 ze
  źródła). `lib/core/modules/zapotrzebowanie/liczba-domownikow/`, 5 testów, UI: `app/kalkulatory/
  liczba-domownikow/page.tsx`. Zweryfikowane: `tsc`/`lint`/`pnpm test` (142/142)/`pnpm build`
  czysto, Playwright (4 domowników → 200–280 l/dobę, zgodne z ręcznym przeliczeniem).

## Decyzje i uzasadnienie (c.d. 27)

- **2026-09-03 — Rysunki/schematy dodane do ekranów montażu baterii, na wyraźną prośbę autora.**
  Autor zauważył trafnie: "w elektryce bez rysunków nie ma opcji — połączenie akumulatorów musi
  być narysowane i krok po kroku prowadzone." Dotąd wszystkie ekrany Modułu 11 opisujące fizyczne
  łączenie/rozłączanie akumulatorów (A3, A4, A6, B3, B4, B7) miały tylko tekst kroków checklisty
  — realna luka, nie świadome pominięcie. Naprawione dodaniem inline'owych ilustracji SVG,
  **konsekwentnie w tym samym wzorcu, co już istniejący precedens** — Wzorzec F z Ekranu 19
  Modułu 5 (`trasy-kablowe`, lokalna funkcja komponentu w `page.tsx`, nie osobny współdzielony
  komponent — świadomie, żeby uniknąć przedwczesnej abstrakcji przy zaledwie 6 użyciach o różnej
  treści). Zakres:
  - **A3** (Połączenia elektryczne LiFePO4) — schemat 4 ogniw w szeregu z ponumerowaną
    kolejnością łączenia (1→2→3, minus do plusa następnego).
  - **A4** (Podłączenie BMS) — schemat Pakiet→BMS→Falownik z trzema oznaczonymi połączeniami:
    wtyczka balansująca (1), B− do minusa pakietu (2), P− przez rezystor pre-charge (3, symbol
    zygzaka), plus główny plus prowadzony bezpośrednio z pominięciem BMS.
  - **A6** (Demontaż pakietu) — ten sam układ co A3, ale zamiast pełnej numeracji 1-2-3 tylko
    znacznik "Zacznij tu (Pakiet +)" przy końcu o najwyższym potencjale — świadomie NIE
    wymyślono precyzyjnej kolejności rozpinania każdego z 3 wewnętrznych połączeń, bo źródło
    podaje tylko ogólną zasadę ("od końca o najwyższym potencjale"), nie pełny algorytm dla
    N ogniw.
  - **B3** (Połączenia kwasowe) — dwa panele: szeregowo (wyższe napięcie, 12+12=24V) i
    równolegle (większa pojemność, plusy razem/minusy razem) — bezpośrednio z treści źródła
    ("szeregowo dla napięcia, równolegle dla pojemności").
  - **B4** (Balansery zewnętrzne) — schemat balansera podłączonego równolegle do KAŻDEGO
    akumulatora, z podpisem wprost mówiącym "powtórz dla wszystkich, nie tylko dla dwóch
    pokazanych" (żeby 2-akumulatorowy przykład nie sugerował fałszywie, że dotyczy tylko pary).
  - **B7** (Demontaż kwasowy) — schemat z 3 ponumerowanymi krokami: 1 minus systemowy, 2 plus
    systemowy, 3 szereg wewnętrzny (z tą samą zasadą "od najwyższego potencjału" co A6).
  - **Pułapka znaleziona i naprawiona podczas budowy:** tekst wyśrodkowany (`textAnchor="middle"`)
    blisko krawędzi `viewBox` (np. etykieta "Do systemu (+)" wyśrodkowana na x=20 w SVG
    zaczynającym się od x=0) wychodzi poza `viewBox` i zostaje **obcięty** (domyślne
    `overflow:hidden` korzenia `<svg>`) — złapane dopiero na zrzutach ekranu Playwright w B3 i
    B7, nie na `tsc`/`lint` (błąd czysto wizualny, niewidoczny statycznie). Naprawione zmianą
    `textAnchor` na `start`/`end` przy etykietach blisko krawędzi, oraz przeprojektowaniem B3 na
    pełną szerokość `viewBox` (400→440, x wyśrodkowane na 220 zamiast 120). **Wniosek na
    przyszłość: każdą nową ilustrację SVG z etykietami blisko krawędzi zrzutować w Playwright
    przed commitem — `tsc`/`lint`/`pnpm test` tego nie złapią.**
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 142/142 (bez zmian — ilustracje czysto
    prezentacyjne, brak nowej logiki domenowej), `pnpm build` czysto, Playwright na wszystkich
    6 ekranach (w tym dwie iteracje na B3/B7 po znalezieniu i naprawieniu obcięcia tekstu).

## Decyzje i uzasadnienie (c.d. 28)

- **2026-09-04 — Zmiana nazwy `docs/domena/` → `docs/zrodla/`, decyzja właściciela projektu.**
  Rozstrzyga pozycję 7 checklisty Y.9 (patrz sekcja "Synchronizacja ze standardem" wyżej) i
  otwartą sprawę z `docs/lista-do-zrobienia.md` (wpis 2026-09-03): `docs/domena/` pełnił dokładnie
  rolę `docs/zrodla/` z GOD BOOK Część B.5 (materiały źródłowe 1:1, nietknięte) od początku, tylko
  pod inną, projektową nazwą sprzed adopcji standardu. Właściciel projektu zdecydował: ujednolicić
  nazewnictwo, nie zostawiać równoległej nazwy.
  **Wykonane:** `git mv docs/domena docs/zrodla`; wszystkie odwołania do ścieżki (79 plików —
  `docs/*.md`, `ZASADY_APLIKACJI.md`, `README.md`, komentarze nagłówkowe w ~70 plikach
  `lib/core/modules/**/*.ts` cytujących źródło, `app/kalkulatory/tryb-live/page.tsx`)
  zaktualizowane automatycznie (`sed`, sama ścieżka, zero zmian w treści merytorycznej plików).
  `docs/zrodla/README.md` dostał notatkę o zmianie nazwy na górze. **Świadomie naprawiona jedna
  usterka po automatycznej podmianie:** historyczny wpis w tym pliku z 2026-09-03 (opisujący co
  wtedy NIE zrobiono) też został omyłkowo podmieniony przez `sed` na nową nazwę — cofnięte ręcznie
  do `docs/domena/` z dopiskiem, bo to log append-only i ma opisywać stan **z tamtej daty**, nie
  bieżący (Zasada integralności informacji, `docs/standards/15`). Zweryfikowane: `tsc`/`lint`/
  `pnpm test` (142/142, bez zmian — tylko ścieżki w komentarzach)/`pnpm build` czysto,
  `grep -rn "docs/domena"` w projekcie po zmianie — pusty wynik.

## Decyzje i uzasadnienie (c.d. 29)

- **2026-09-04 — Ekran 1, Moduł 4 (Baterie): "Dobór pojemności baterii" — pierwszy ekran tego
  modułu poza wzorcami reprezentatywnymi B/D/E, na wyraźną prośbę autora o dwukrotne sprawdzanie
  wszystkich obliczeń.** Wybrany jako następny krok: fundament doboru magazynu energii (pojemność
  użyteczna), formuła w pełni podana w źródle, bez brakujących norm zewnętrznych (w odróżnieniu od
  zablokowanego Modułu 5 Ekranu 1).
  - **Wzór 1:1 ze źródła** (Sekcja B): `C_uzyteczna = (E_dobowe × d_autonomii) / (η_falownika × DoD)`.
  - **Podwójna weryfikacja przed napisaniem kodu** (nowa dyscyplina na prośbę autora): przykład
    źródła (Sekcja C: "12 kWh/dobę, 3 dni autonomii → 45 kWh użytecznej") policzony niezależnie w
    Pythonie DWOMA metodami — arytmetyką zmiennoprzecinkową i dokładnym ułamkiem (`Fraction`) —
    zanim powstał jakikolwiek kod kalkulatora. **Znaleziona i udokumentowana rozbieżność w samym
    źródle:** przykład w Sekcji C odtwarza się dokładnie tylko przy sprawności falownika = 100%,
    NIE przy 95% wskazanej jako "domyślnie 95%, edytowalne" w Sekcji A tego samego ekranu (95% →
    47,368421 kWh, nie 45). Rozstrzygnięcie: wzór wdrożony dokładnie jak podany w Sekcji B
    (autorytatywne "Silnik oceny"), rozbieżność w ilustracyjnym przykładzie Sekcji C udokumentowana
    w kodzie (komentarz w `calculator.ts`) i tutaj — **nie cicho "poprawiona"**, zgodnie z zasadą
    integralności informacji (nie rozstrzygaj sam, pokaż A/B). Oba warianty (η=100%→45 kWh,
    η=95%→47,4 kWh) zweryfikowane też w przeglądarce (Playwright) — wynik UI zgodny co do jednego
    miejsca po przecinku z obiema niezależnymi metodami obliczeniowymi.
  - Bufor starzeniowy (Ekran 6, "np. +20% na 10 lat") świadomie NIE doliczony — Ekran 6 jeszcze
    nie istnieje w kodzie, doliczenie teraz wymagałoby zbudowania jego logiki przy okazji.
  - `lib/core/modules/baterie/dobor-pojemnosci/`, 7 testów (w tym dwa niezależnie zweryfikowane
    przypadki liczbowe + graniczny + 3 błędne/niekompletne dane), UI: `app/kalkulatory/
    dobor-pojemnosci-baterii/page.tsx`. Dopisane pierwsze pełne wyliczenie per-funkcja Modułu 4
    (34 ekrany) do `docs/rejestr-pokrycia.md` — wcześniej moduł miał tylko 3 rozproszone wpisy w
    tabeli wzorców reprezentatywnych.
  - **Zidentyfikowany dobry następny krok:** Ekran 7 (Obwód Pre-Charge, Moduł 4) powinien
    re-używać logikę już zbudowaną w M11/A4 (`podlaczenie-bms`, wzór `T = 5×R×C`), nie duplikować
    jej — wzorzec "echo" (`docs/standards/01-architektura.md`). Odnotowane w `docs/rejestr-pokrycia.md`.
  - Zweryfikowane: `tsc`/`lint` czysto (1 błąd `react/no-unescaped-entities` znaleziony i
    naprawiony — proste cudzysłowy wokół "użyteczna" zamienione na typograficzne „…", ten sam
    wzorzec błędu co wcześniej w A9), `pnpm test` 149/149 (7 nowych), `pnpm build` czysto,
    Playwright na obu wariantach liczbowych.

## Decyzje i uzasadnienie (c.d. 30)

- **2026-09-04 — Ekran 7, Moduł 4: "Obwód Pre-Charge" — pierwszy praktyczny przypadek
  zastosowania wzorca "echo" (`docs/standards/01-architektura.md`, 1.3) w tym repo.** Źródło tego
  ekranu opisuje dokładnie ten sam fakt fizyczny (`T = 5×R×C`, przykład 50Ω/50W, to samo
  ostrzeżenie 🔴) co Ekran A4 Modułu 11 (`podlaczenie-bms`), zbudowany wcześniej w tej sesji —
  klasyczny przypadek organicznego duplikatu treści między modułami (Moduł 4 = ogólna wiedza
  elektryczna, Moduł 11 = ta sama wiedza w kontekście procedury montażu), dokładnie ten wzorzec,
  o którym mówi rozdział 14 standardu.
  - **Refaktor, nie duplikat:** wydzielono czystą funkcję `obliczCzasPreChargeS(R, C)` do
    `lib/core/modules/baterie/obwod-precharge/calculator.ts` jako kanoniczne źródło wzoru.
    `podlaczenie-bms/calculator.ts` (M11/A4) zrefaktoryzowany, żeby ją importować i wywoływać,
    zamiast liczyć inline — **własna walidacja/statusy M11/A4 zostały nietknięte** (ten ekran
    traktuje `pojemność=0` jako `INVALID_INPUT`, nowy Ekran 7 jako `INCOMPLETE` — świadomie różne
    konwencje dwóch różnych ekranów, więc re-użyty został tylko sam wzór liczbowy, nie cały
    wrapper `CalcResult`).
  - **Weryfikacja poprawności refaktoru:** istniejący plik testowy M11/A4 (6 testów, sprzed tej
    sesji) uruchomiony BEZ ŻADNEJ zmiany w swojej treści — przeszedł w całości, potwierdzając że
    refaktor nie zmienił zachowania. Dodatkowo zweryfikowane w przeglądarce: oba ekrany dla tych
    samych danych (R=50Ω, C=2200µF) pokazują identyczny wynik 0,55 s.
  - **Podwójna weryfikacja wzoru przed napisaniem kodu** (kontynuacja dyscypliny z Ekranu 1):
    R=50Ω/C=2200µF→0,55s i R=50Ω/C=10000µF→2,5s przeliczone niezależnie w Pythonie przed
    implementacją; dodatkowo sprawdzone przeliczenie odwrotne — przykład źródła "R=50Ω/50W,
    T≈3s" odpowiada pojemności ok. 12000µF (realistyczna wartość dla większego falownika, nie
    sprzeczność).
  - `lib/core/modules/baterie/obwod-precharge/`, 8 testów (w tym test na samej czystej funkcji
    `obliczCzasPreChargeS`, osobno od testów na pełnym `CalcResult`), UI: `app/kalkulatory/
    obwod-precharge/page.tsx`. Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 157/157 (8 nowych
    + 6 istniejących M11/A4 bez zmian), `pnpm build` czysto, `lib/core/` nadal nie importuje z
    `app/`/`components/`, Playwright na obu ekranach.

## Decyzje i uzasadnienie (c.d. 31)

- **2026-09-04 — Ekran 12, Moduł 4: "Ograniczenie prądu ładowania w mrozie (Cold C-Rate)" —
  pierwszy przypadek prawdziwej luki wewnątrz tabeli tego samego ekranu (nie brakującej normy
  zewnętrznej jak M5/E1, tylko brakującego wiersza we własnej tabeli źródła).** Tabela limitów
  C-rate (Sekcja B) ma 4 wiersze: `<-10°C` (blokada), `-10 do 0°C` (0,1C), `0 do 5°C` (0,2C),
  `>10°C` (pełny prąd) — zakres **5–10°C nie jest zdefiniowany żadnym wierszem**.
  - **Znalezione i zweryfikowane dwukrotnie przed napisaniem kodu:** ręczny odczyt tabeli źródła +
    niezależny skrypt Pythona potwierdzający brak pokrycia tego przedziału przez którykolwiek z 4
    warunków (`t < -10`, `t < 0`, `t < 5`, `t <= 10` z resztą jako "pełny") — bez piątej,
    specjalnej gałęzi ten zakres wpadłby milcząco w błędną klasyfikację.
  - **Rozstrzygnięcie:** piąta strefa `luka-zrodla`, status `OUT_OF_SCOPE` (pierwsze użycie tego
    statusu w tym repo — istniał w typie `Status` od początku, nieużywany dotąd), z jawnym
    komunikatem o luce zamiast interpolowanej/zgadywanej wartości pośredniej między 0,2C a "pełny
    prąd". Świadomie usunięta z pierwszej wersji komunikatu sugestia "użyj 0,2C jako bezpieczniejszej
    granicy" — to też byłaby wymyślona rekomendacja bezpieczeństwa, nie stwierdzenie ze źródła.
  - **"Pełny prąd" (>10°C) też bez wymyślonego maksimum:** źródło nie podaje konkretnej liczby
    C-rate dla tej strefy (tylko słowo "pełny"), więc `maxPradA` zostaje `null`, nie np. "1C" —
    `assumptions` jawnie mówi "brak ograniczenia od strony temperatury", nie podaje liczby.
  - **Nowy twardy stop dopisany do rejestru:** ładowanie poniżej -10°C — całkowita blokada w
    źródle, trwałe uszkodzenie ogniw (osadzanie litu metalicznego).
  - Przykład źródła (-5°C, 280Ah → 28A, strefa 0,1C) zweryfikowany niezależnie w Pythonie przed
    implementacją i odtworzony dokładnie w teście oraz w przeglądarce. Wszystkie 4 realne strefy +
    luka zweryfikowane wizualnie (Playwright, 4 zrzuty ekranu).
  - `lib/core/modules/baterie/cold-c-rate/`, 11 testów (w tym testy dokładnie na granicach każdej
    strefy — `-10`, `0`, `4.9`, `5`, `10`, `10.1`, wszystkie przeliczone niezależnie w Pythonie
    przed napisaniem testów), UI: `app/kalkulatory/cold-c-rate/page.tsx`. Zweryfikowane: `tsc`/
    `lint` czysto, `pnpm test` 168/168 (11 nowych), `pnpm build` czysto, `lib/core/` nadal nie
    importuje z `app/`/`components/`.

## Decyzje i uzasadnienie (c.d. 32)

- **2026-09-04 — Ekran 15, Moduł 4: "Cold Cranking Amps" — rozbieżność między listą pól Sekcji
  A a wzorem Sekcji B tego samego ekranu, rozwiązana transparentnie, nie ukryta.** Wzór
  `V_sag = V_oc − I_rozruch × R_wewn` wymaga napięcia pakietu bez obciążenia (V_oc), ale Sekcja A
  źródła wymienia jako pola wejściowe tylko "temperaturę ogniw, prąd rozruchowy odbiornika,
  rezystancję wewnętrzną ogniw, min. napięcie pracy falownika" — bez V_oc. Bez tej wartości wzoru
  nie da się w ogóle policzyć. Rozstrzygnięcie: V_oc dodany jako pole wejściowe, bo to realna,
  mierzalna wielkość (napięcie pakietu odczytane bez obciążenia), nie wymyślony współczynnik czy
  norma — różni się jakościowo od przypadków blokady (M5/E1, Ekran 2 Moduł 4), gdzie brakowało
  całych tabel norm, nie pojedynczej mierzalnej wartości. Notatka o tej rozbieżności zostawiona
  w kodzie (`input.ts`) i tutaj, zamiast cichego dopisania bez śladu.
  - **Temperatura ogniw** (też wymieniona w Sekcji A) świadomie NIE stała się osobnym polem
    obliczeniowym — nie wchodzi do wzoru wprost, tylko pośrednio wpływa na już zmierzoną
    rezystancję wewnętrzną (user mierzy R_wewn w bieżącej, zimnej temperaturze). Dodanie martwego
    pola bez wpływu na wynik byłoby niepotrzebną abstrakcją.
  - Przykład źródła (Sekcja C: "-20°C ... 40,5V") ma opisowy charakter bez pełnego kompletu liczb
    wejściowych (I_rozruch, R_wewn, V_oc nie podane) — nie do odtworzenia 1:1 jak w innych
    ekranach. Zamiast tego zbudowano własny, samodzielnie spójny przykład testowy (V_oc=51,2V,
    I=800A, R=13mΩ → 40,8V, bardzo blisko 40,5V źródła) i **zweryfikowano niezależnie w Pythonie
    przed napisaniem kodu**, jawnie oznaczony w teście jako "ilustracyjny", nie "odtwarza
    dokładnie przykład źródła".
  - `lib/core/modules/baterie/cold-cranking-amps/`, 5 testów (w tym przypadek graniczny —
    V_sag dokładnie równe V_min, próg włącznie policzony przez odwrócenie wzoru: I potrzebne do
    V_sag=44V przy V_oc=51,2V, R=13mΩ → 553,846...A, też zweryfikowane w Pythonie), UI:
    `app/kalkulatory/cold-cranking-amps/page.tsx`.
  - **Sprawdzono też Ekran 2 (Sugestia napięcia systemowego) jako kandydata — okazał się tylko
    częściowo zablokowany, nie w całości** (poprawka własnego pierwszego wrażenia po dokładniejszym
    czytaniu): rekomendacja napięcia (>3000W→48V, <1000W→12V) jest obliczalna wprost, ale zakres
    1000–3000W to kolejna luka w tabeli źródła (jak Ekran 12), a porównanie przekrojów kabli
    wymaga tej samej brakującej tabeli PN-IEC 60364-5-52 co M5/E1 i B5. Nie budowany teraz — wymaga
    decyzji o zakresie (okrojona wersja bez kabli, czy czekać na dane), patrz
    `docs/lista-do-zrobienia.md`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 173/173 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright na obu stanach (falownik
    się wyłączy / falownik wytrzyma), wartości zgodne co do dziesiątych z niezależnym przeliczeniem.

## Decyzje i uzasadnienie (c.d. 33)

- **2026-09-04 — Ekran 6, Moduł 4: "Starzenie i degradacja ogniw" — domyka bufor starzeniowy
  zapowiedziany, ale świadomie pominięty w Ekranie 1.** Model liniowy 1:1 ze źródła:
  `C_początkowa = C_dziś / (1 − r_degradacji × lata)`.
  - **Podwójna weryfikacja przed napisaniem kodu:** źródło mówi "LiFePO4 traci ok. 2-3% rocznie →
    po 10 latach ok. 80% pojemności" — sprawdzone w Pythonie, że 80% po 10 latach modelem liniowym
    odpowiada dokładnie stawce 2%/rok (dolna granica podanego zakresu 2-3%, nie środek), nie
    stawce kompoundowanej. Przykład Sekcji C (45 kWh dziś → "56 kWh za 10 lat") przeliczony
    niezależnie: 45 / (1 − 0,02×10) = 45/0,8 = 56,25 — zgodne z zaokrągleniem źródła do 56.
  - **Świadomie NIE doliczony ostatni krok przykładu źródła** ("zamów akumulator o pojemności
    60 kWh" — zaokrąglenie w górę do dostępnego rozmiaru komercyjnego). Źródło nie podaje siatki
    dostępnych pojemności produktów (60 kWh to jeden przykład, nie reguła), więc doliczenie tego
    kroku wymagałoby wymyślenia nieistniejącej normy handlowej. Kalkulator zwraca dokładną liczbę
    (56,25 kWh, wyświetlaną jako 56,3 kWh), z `assumption` jawnie tłumaczącym, że w praktyce
    zaokrągla się w górę do realnego produktu.
  - **Nowa, jawnie odnotowana luka integracyjna:** Ekran 1 (Dobór pojemności baterii) i Ekran 6
    liczą pokrewne wielkości, ale nie są ze sobą spięte — oba mają dziś niezależne pole ręcznego
    wpisu "pojemność użyteczna". Prawdziwa integracja (Ekran 1 → auto-wypełnia Ekran 6 → wynik
    Ekranu 6 wraca jako rekomendacja zakupu) wymaga wspólnego stanu wejściowego między ekranami,
    którego ten projekt jeszcze nie ma (koncepcja "Mój sprzęt"/profil wejściowy ze standardu,
    §13 wzorców z wcześniejszej fazy planowania) — nie budowane teraz, odnotowane w
    `docs/lista-do-zrobienia.md` jako osobny krok, nie cicho pominięte.
  - `lib/core/modules/baterie/starzenie-degradacja/`, 6 testów (w tym test na granicy modelu
    liniowego — `degradacja × lata >= 100%` → `INVALID_INPUT`, bo model liniowy fizycznie się
    załamuje poza tym zakresem), UI: `app/kalkulatory/starzenie-degradacja/page.tsx` (suwak 5/10/15
    lat ze źródła jako `PoleSelect`, nie dowolna liczba).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 179/179 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (56,3 kWh / 80% pozostałej
    pojemności, zgodne z niezależnym przeliczeniem).

## Decyzje i uzasadnienie (c.d. 34)

- **2026-09-04 — Ekran 22, Moduł 4: "Pobór własny BMS i tryb uśpienia" — najprostszy wzór z
  całej serii tego dnia, dwuwarstwowy przykład źródła zweryfikowany w całości.** Wzór
  `E_roczna = P_pobór × 24 × 365 / 1000` (kWh).
  - Przykład źródła ma dwie osobne liczby do sprawdzenia: "7W ciągle = 61 kWh rocznie" (7×24×365/
    1000 = 61,32, zgodne z zaokrągleniem źródła) i "deep sleep → 0,024 kWh/dobę" — ta druga liczba
    odtwarza się dokładnie tylko przy poborze uśpienia = 1W, górnej granicy podanego zakresu
    0,5-1W (1×24/1000=0,024), nie przy dolnej granicy ani środku zakresu. Oba przeliczone
    niezależnie w Pythonie przed implementacją.
  - Kalkulator zwraca też wielkości niewymienione wprost w przykładzie źródła, ale wynikające z
    tego samego wzoru wprost (roczna strata w uśpieniu, oszczędność roczna ciągłe-vs-uśpienie) —
    nie nowa logika, tylko ten sam wzór zastosowany do drugiego zestawu danych wejściowych.
  - `lib/core/modules/baterie/pobor-wlasny-bms/`, 5 testów, UI: `app/kalkulatory/
    pobor-wlasny-bms/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 184/184 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (61,32 kWh i 0,024 kWh/dobę,
    zgodne z niezależnym przeliczeniem co do dwóch miejsc po przecinku).

## Decyzje i uzasadnienie (c.d. 35)

- **2026-09-04 — Ekran 28, Moduł 4: "Kalibracja i dokładność SoC" — najprostszy ekran serii,
  jeden próg czasowy, bez formuły numerycznej do zweryfikowania.** Źródło: coulomb counting w
  BMS kumuluje błąd bez okresowego pełnego naładowania, "po ok. 2 tygodniach" (14 dni)
  rekomendowana kalibracja. Przykład Sekcji C ("rozjechał się o 12%") jest czystą ilustracją —
  źródło nie podaje wzoru wiążącego czas bez ładowania z wielkością błędu SoC, więc świadomie NIE
  liczony (wymyślenie takiej zależności byłoby złamaniem zasady "nie wymyślaj brakujących
  danych"). Kalkulator sprawdza wyłącznie jeden, jawnie podany próg: `dni >= 14`.
  - `lib/core/modules/baterie/kalibracja-soc/`, 6 testów (w tym granica dokładnie przy 14 dniach
    i 0 dni jako prawidłowa wartość — "dziś było pełne ładowanie" — nie placeholder), UI:
    `app/kalkulatory/kalibracja-soc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 190/190 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (20 dni → rekomendacja
    kalibracji, zgodnie z progiem >=14).

## Decyzje i uzasadnienie (c.d. 36)

- **2026-09-04 — Ekran 16, Moduł 4: "Tryb Long Term Storage (odstawienie na zimę)" — pierwszy
  ekran serii łączący dwie realne kontrole liczbowe z checklistą procedury (Wzorzec D z
  elementem E, jak M11/A4, ale bez wymuszonej kolejności checklisty).** Dwa progi ze źródła:
  SoC docelowy przed odstawieniem powinien mieścić się w 50–60% (nie przesuszona, nie przelana),
  temperatura miejsca przechowywania nie powinna spadać poniżej -20°C. Plus dwuelementowy
  checklist procedury (odłączenie od falownika/obciążeń, uśpienie BMS) — w odróżnieniu od M11/A4
  (pre-charge) źródło nie opisuje tu wymuszonej sekwencji kroków, więc checklist jest
  nieuporządkowany (zwykły `Set`, nie porównanie z kolejnością tablicy).
  - Status łączony wg precedensu z `podlaczenie-bms`: `VALID` gdy oba progi liczbowe spełnione
    ORAZ checklist w komplecie; `VALID_WITH_WARNINGS` gdy jest co najmniej jedno realne
    ostrzeżenie (SoC poza zakresem lub temperatura za niska); `INCOMPLETE` gdy pola liczbowe
    jeszcze nie wpisane ALBO gdy oba progi są w porządku, ale checklist nie w komplecie (ten
    drugi przypadek celowo nie generuje ostrzeżenia — czysta niekompletność kroków, nie błąd
    fizyczny).
  - **Sprawdzona i rozstrzygnięta flaga z rejestru pokrycia** ("możliwy duplikat/uzupełnienie
    M11 A10/B12 — sprawdzić przy budowie"): NIE jest duplikatem. A10/B12 to Wzorzec C — czysta
    treść informacyjna (3 akordeony: przechowywanie/recykling/narzędzia diagnostyczne), bez
    żadnego kalkulatora. Ten ekran to realny kalkulator dwóch progów liczbowych + checklist —
    inny wzorzec, inna treść źródłowa (3.18 vs 9.18–9.20/10.18–10.20), zero pokrywającej się
    logiki do zastosowania wzorca "echo".
  - Przy okazji naprawiona drobna drift-owa nieścisłość w tym pliku (Mapa orientacyjna niżej):
    odnośnik do GOD BOOK wskazywał nieistniejący już `...v2_3.md` (plik zastąpiony `...v2_5.md`
    w PR #23, referencja w tej sekcji nie została wtedy zaktualizowana) — poprawione zgodnie z
    zasadą Część Y.2 (dryf bez świadomej decyzji, nie konflikt do zgłoszenia).
  - `lib/core/modules/baterie/long-term-storage/`, 9 testów (w tym obie granice zakresu SoC
    50%/60% włącznie i granica temperatury dokładnie -20°C jako jeszcze bezpieczna), UI:
    `app/kalkulatory/long-term-storage/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 199/199 (9 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (3 stany: puste/INCOMPLETE,
    55%+5°C+checklist komplet→VALID "Gotowe do odstawienia", 100%→VALID_WITH_WARNINGS "Dopuszczalne"
    z komunikatem o zakresie 50–60%).

## Decyzje i uzasadnienie (c.d. 37)

- **2026-09-04 — Ekran 18, Moduł 4: "Łączenie równoległe różnych baterii (Mixing)" — dwa
  twarde stopy 🔴 jednocześnie, plus druga formuła wyprowadzona z tych samych wejść (nie
  osobna, wymyślona zależność).** Źródło (Sekcja B): `I_wyrównawczy = ΔV / (R1+R2)`, próg
  0,2V (Sekcja D, 🔴). Dodatkowo policzony udział każdej baterii w prądzie obciążenia
  (dzielnik prądowy `udział_i = R_druga / (R1+R2)`) — to bezpośrednia konsekwencja tego samego
  prawa Ohma dla gałęzi równoległych, liczona z tych samych dwóch zmierzonych rezystancji, nie
  nowy współczynnik. Świadomie odrzucony pomysł osobnego progu ostrzegawczego na wielkość
  nierównomierności (np. "powyżej 55% → ostrzeżenie") — źródło nie podaje takiego progu, byłoby
  to wymyślenie normy; liczby udziału pokazane jako informacja, nie jako wyzwalacz ostrzeżenia.
  Wiek/SoH z Sekcji A świadomie NIE stały się osobnym polem wejściowym — nie wchodzą do żadnego
  wzoru w źródle (efekt SoH jest już ujęty w zmierzonej rezystancji wewnętrznej, którą user
  wpisuje wprost) — dodanie ich byłoby polem dekoracyjnym bez wpływu na wynik.
  - **Błąd znaleziony i naprawiony w trakcie budowy tego samego ekranu (nie osobna sesja):**
    pierwsza wersja UI liczyła kolor werdyktu wyłącznie z `CalcResult.status`
    (`VALID_WITH_WARNINGS` → zawsze żółte "Dopuszczalne"), więc oba twarde stopy 🔴 renderowały
    się jako żółte ostrzeżenie zamiast czerwone "Zabronione" — visualnie niewidoczne w
    testach jednostkowych (te sprawdzają tylko `status`/`warnings`, nie kolor), złapane dopiero
    w zrzucie przeglądarki. Naprawione przez przejście na wzorzec z `dobor-bezpiecznika-dc`
    (już istniejący w kodzie): UI liczy własny 3-poziomowy werdykt z `warning.level` (`critical`
    → zawsze czerwony, niezależnie od `status`), a nie tylko z `CalcResult.status`. **Lekcja do
    zapamiętania na przyszłość**: przy każdym ekranie z twardym stopem 🔴 sprawdzić w
    przeglądarce, czy kolor werdyktu faktycznie jest czerwony, nie tylko czy `status` i
    `warnings[].code` się zgadzają w teście — dwa niezależne mechanizmy (`CalcResult.status` do
    kompletności/poprawności danych, `warning.level` do koloru werdyktu bezpieczeństwa) łatwo
    pomylić.
  - `lib/core/modules/baterie/mixing-rownolegle/`, 7 testów, UI: `app/kalkulatory/
    mixing-rownolegle/page.tsx`. Chemia ogniw w UI re-używa katalogu `BATTERY_TECHNOLOGIES`
    z Ekranu 30 (`porownanie-technologii`) zamiast duplikować listę — kolejne zastosowanie
    wzorca "echo", tym razem dla danych referencyjnych, nie tylko formuły.
  - Oba twarde stopy dopisane do `docs/rejestr-twardych-stopow.md` (sekcja Bateryjne).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 206/206 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (4 A przy ΔV=0,1V —
    zgodne z niezależnym przeliczeniem w Pythonie; oba twarde stopy potwierdzone jako czerwone
    "Zabronione" po naprawie błędu opisanego wyżej).

## Decyzje i uzasadnienie (c.d. 38)

- **2026-09-04 — Ekran 34, Moduł 4: "Matryca alarmów BMS i reakcje systemu" — najszybszy ekran
  serii, czysta tabela referencyjna bez kalkulatora, ten sam wzorzec co M11 A10/B12.** Źródło
  daje kompletną tabelę 7 wierszy (alarm → reakcja systemu) plus jeden przykładowy komunikat —
  przepisane 1:1, bez żadnej logiki do obliczenia. `lib/core/modules/baterie/matryca-alarmow-bms/`
  ma tylko `constants.ts` (bez `input.ts`/`calculator.ts`/`validation.ts`/`warnings.ts`/testów),
  dokładnie jak `przechowywanie-recykling` (M11/A10) — ta flaga z rejestru pokrycia
  ("podobny kształt do M11 A10/B12, bez kalkulatora") okazała się trafna.
  - UI: `app/kalkulatory/matryca-alarmow-bms/page.tsx`, tabela w tym samym stylu co `prognozy`
    (jedyny dotąd ekran z `<table>`) — ponowne użycie istniejącego wzorca HTML zamiast wymyślania
    nowego układu dla tabeli dwukolumnowej.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 206/206 (bez zmian — brak nowej logiki do
    testowania), `pnpm build` czysto, `lib/core/` nadal nie importuje z `app/`/`components/`,
    Playwright (tabela renderuje się poprawnie, 7 wierszy, przykładowy komunikat i migawka na
    dole).

## Decyzje i uzasadnienie (c.d. 39)

- **2026-09-04 — Ekran 5, Moduł 4: "Grzałki BMS i ochrona przed mrozem" — zbudowana tylko
  jedna z dwóch warstw silnika opisanego w źródle, druga świadomie pominięta.** Źródło (Sekcja
  B) opisuje "dwie warstwy zintegrowane w jeden silnik": (1) bilans energetyczny grzania —
  dawne 3.5, tylko dwa ilustracyjne przykłady liczbowe (0,5 kWh/dobę w styczniu, 0,6 kWh/dobę w
  nieogrzewanym garażu), bez żadnego wzoru wiążącego temperaturę/czas z ilością energii; (2)
  logika decyzyjna skąd brać prąd na grzanie — dawne 3.14, pełne drzewo decyzyjne z jawnymi
  progami (5°C, 30% SoC). Zbudowana wyłącznie warstwa 2 — warstwa 1 pokazana w UI jako czysta
  informacja (dwa przykłady ze źródła, bez przeliczania), nie jako wynik obliczenia z danych
  usera, żeby nie wymyślać brakującego wzoru.
  - **Znaleziona i udokumentowana luka**: źródło definiuje "SoC > 30% → grzanie z baterii" i
    "SoC < 30% → grzanie wstrzymane" jako dwa rozłączne warunki — SoC dokładnie 30% nie należy
    do żadnego z nich (ten sam rodzaj luki co Cold C-Rate 5–10°C, tym razem na granicy
    dyskretnego drzewa decyzyjnego, nie tabeli ciągłej). Kalkulator zwraca `OUT_OF_SCOPE`
    zamiast przypisywać wartość arbitralnie do jednej strony. Dopisane do
    `docs/rejestr-twardych-stopow.md`, sekcja "Znane luki".
  - Stan "grzanie wstrzymane" (mróz + brak PV + SoC<30%) potraktowany jako twardy stop —
    BMS realnie blokuje ładowanie w tym stanie, dopóki nie pojawi się PV lub SoC nie wzrośnie —
    dopisany do rejestru twardych stopów, sekcja Bateryjne, poziom `critical`.
  - Pole "czy magazyn jest w pomieszczeniu ogrzewanym" z Sekcji A świadomie NIE stało się
    osobnym polem wejściowym — źródło nie podaje formuły łączącej ten fakt z temperaturą
    zewnętrzną z Modułu 1 (ile stopni cieplej wewnątrz). Zamiast tego user wpisuje wprost
    rzeczywistą temperaturę przy baterii (ten sam wzorzec co temperatura ogniw w Cold Cranking
    Amps/Cold C-Rate — bezpośredni pomiar, nie wyprowadzona wartość), z podpowiedzią w UI.
  - `lib/core/modules/baterie/grzalki-bms-mroz/`, 9 testów (w tym granica dokładnie 5°C jako
    "brak potrzeby" i granica SoC dokładnie 30% jako `OUT_OF_SCOPE`), UI: `app/kalkulatory/
    grzalki-bms-mroz/page.tsx`. UI ponownie stosuje wzorzec z `mixing-rownolegle`/
    `dobor-bezpiecznika-dc`: własny 3-poziomowy werdykt liczony z `warning.level`, nie tylko
    z `CalcResult.status`, plus osobny stan wizualny dla `OUT_OF_SCOPE`.
  - Zweryfikowane: `tsc`/`lint` czysto (jeden przypadek `react/no-unescaped-entities` naprawiony
    typograficznymi cudzysłowami „…", ten sam nawracający błąd co wcześniej w sesji), `pnpm test`
    215/215 (9 nowych), `pnpm build` czysto, `lib/core/` nadal nie importuje z `app/`/
    `components/`, Playwright (4 stany: PV→zielony, bateria→żółty, wstrzymane→czerwony,
    SoC=30%→OUT_OF_SCOPE żółty z wyjaśnieniem luki).

## Decyzje i uzasadnienie (c.d. 40)

- **2026-09-04 — Ekran 27, Moduł 4: "Chłodzenie baterii latem" — jedno proste sprawdzenie
  progowe, druga część źródła (wielkość przyspieszenia degradacji) świadomie pominięta.**
  Źródło (Sekcja B): "dopuszczalny zakres pracy (typowo 15-35°C); powyżej 35°C wykrywane ryzyko
  przyspieszonej degradacji" — próg policzony 1:1. Przykład Sekcji C ("degradacja przyspieszy o
  30%") jest czysto ilustracyjny — źródło nie podaje wzoru wiążącego wielkość przekroczenia
  temperatury z wielkością przyspieszenia degradacji, więc świadomie NIE liczony (ten sam rodzaj
  decyzji co w Ekranie 5 tego samego dnia — jedna warstwa źródła ma gotowy wzór/próg, druga tylko
  ilustrację).
  - Zakres sprawdzany symetrycznie (15–35°C, oba brzegi włącznie), ale z asymetryczną wagą
    komunikatu: powyżej 35°C → `critical` (dokładnie temat tego ekranu, źródło mówi wprost o
    "trwale przyspieszonej degradacji"), poniżej 15°C → `info` z odesłaniem do Cold C-Rate/Cold
    Cranking Amps (osobne ekrany o ograniczeniach przy niskiej temperaturze — nie duplikowanie
    ich logiki, tylko wskazanie, gdzie szukać).
  - `lib/core/modules/baterie/chlodzenie-latem/`, 7 testów (w tym granice 15°C/35°C włącznie i
    0°C jako poprawna, nieplaceholderowa wartość — pole `temperaturaOgniwC: number | null` z
    `null` jako jedynym sentinelem "nie wpisano", ten sam wzorzec co Cold Cranking Amps/Cold
    C-Rate), UI: `app/kalkulatory/chlodzenie-latem/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 222/222 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (48°C → czerwony "Powyżej
    dopuszczalnej temperatury", 25°C → zielony "W dopuszczalnym zakresie").

## Decyzje i uzasadnienie (c.d. 41)

- **2026-09-04 — Ekran 23, Moduł 4: "Analiza opłacalności magazynu (True Cost of Storage)" —
  pierwszy ekran serii z osobnym, opcjonalnym polem porównawczym.** Źródło (Sekcja B) daje pełny,
  gotowy wzór: `energia_całkowita_życia = pojemność × liczba_cykli × sprawność`,
  `koszt_za_kWh = cena_baterii / energia_całkowita_życia` — oba przeliczone niezależnie w
  Pythonie przed implementacją. Źródło wprost oznacza ten ekran jako wchłaniający dawną funkcję
  12.12 z Modułu AI ("ocena opłacalności magazynowania (AI)") — uznaną w źródle za duplikat tego
  samego tematu, więc nie budowana osobno.
  - **Pole "koszt alternatywy" (agregat/sieć) jest opcjonalne** (`number | null`, nie `0`-jako-
    placeholder, bo `0 zł/kWh` byłoby samo w sobie prawidłową, choć nierealistyczną, wartością
    porównawczą) — porównanie to prosta różnica (`koszt magazynu < koszt alternatywy?`), BEZ
    próby policzenia "liczby cykli do zwrotu" wspomnianej w przykładzie źródła Sekcji C ("zwraca
    się po ok. 1200 cyklach") — to wymagałoby dodatkowego założenia o tempie zużycia energii
    (ile kWh/rok faktycznie pobierane z magazynu), którego źródło nie podaje.
  - **Poprawka podczas budowy**: pierwsza wersja `calculator.ts` ustawiała status
    `VALID_WITH_WARNINGS` przy DOWOLNYM niepustym `warnings[]`, także gdy jedyne ostrzeżenie
    miało poziom `info` (np. "magazyn tańszy niż alternatywa" — to dobra wiadomość, nie powód do
    żółtego werdyktu). Naprawione przed commitem: status liczony z `warnings.some(w => w.level
    !== "info")`, zgodnie z tym, jak inne ekrany tej sesji (np. `grzalki-bms-mroz`) już
    traktowały poziom `info` jako nie wpływający na status.
  - `lib/core/modules/baterie/oplacalnosc-magazynu/`, 6 testów, UI: `app/kalkulatory/
    oplacalnosc-magazynu/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 228/228 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (0,34 zł/kWh przy
    25000zł/15kWh/5000cykli/98% — zgodne z niezależnym przeliczeniem w Pythonie; oba stany
    porównania z alternatywą, tańszy/droższy, zweryfikowane wizualnie).

## Decyzje i uzasadnienie (c.d. 42)

- **2026-09-04 — Ekran 26, Moduł 4: "Topologia BMS (Common Port vs Separate Port)" —
  hybryda Wzorca B (karty porównawcze) z pojedynczym, prostym progiem z Sekcji C.** Etykieta
  źródła to "Wzorzec B", więc rdzeń ekranu to opisowe porównanie dwóch topologii (jak
  `porownanie-technologii`) — ale Sekcja C daje konkretny, w pełni policzalny przykład ("BMS
  Common Port 100A, falownik pobiera 150A przy rozruchu → wybierz Separate Port"), więc dodano
  to jako prosty próg (`bmsCommonPortA >= falownikPradRozruchuA`), zamiast zostawiać go tylko
  jako tekst. Przykład źródła odtworzony dokładnie w teście.
  - `lib/core/modules/baterie/topologia-bms/`, 5 testów, UI: `app/kalkulatory/
    topologia-bms/page.tsx`.
  - **Przy okazji sprawdzony i zablokowany Ekran 25** ("Szyny zbiorcze i połączenia
    międzypakietowe") — ten sam rodzaj luki co M5/E1 i M11/B5: Sekcja C daje tylko ilustracyjne
    przykłady nierównego rozkładu prądu ("20%", "40% vs 15%"), źródło nie podaje wzoru wiążącego
    długość/przekrój kabla z wielkością tego rozkładu. Dopisany do `docs/rejestr-twardych-
    stopow.md`, sekcja "Znane luki", i do `docs/rejestr-pokrycia.md` jako `⚠️ blocked`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 233/233 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (100A/150A → czerwony
    "Wybierz Separate Port", zgodny z przykładem źródła; 200A/150A → zielony "Common Port
    wystarczy").

## Decyzje i uzasadnienie (c.d. 43)

- **2026-09-04 — Ekran 20, Moduł 4: "Komunikacja BMS — CAN/RS485/Modbus" — sprawdzenie
  zgodności protokołów jako prosta równość, z jawnie oznaczonym trzecim stanem "nieznany".**
  Źródło (Sekcja B) opisuje "sprawdzenie kompatybilności" między protokołem BMS a
  falownika/ładowarki — bez tabeli konkretnych par, to zwykła równość dwóch wybranych wartości
  z tej samej listy (CAN/RS485/Modbus/Pylontech). Cena konwertera z przykładu Sekcji C ("ok. 150
  zł") jest ilustracyjna, nie ogólny cennik — nie liczona.
  - Dodana wartość "Inny/nieznany" na liście protokołów, z osobnym traktowaniem: jeśli
    którekolwiek urządzenie ma protokół "inny", zwracany jest `OUT_OF_SCOPE` zamiast fałszywego
    "zgodne" (dwa nieznane protokoły niekoniecznie są tym samym protokołem) — świadoma decyzja,
    żeby nie zgadywać zgodności tam, gdzie dane są niewystarczające.
  - `lib/core/modules/baterie/komunikacja-bms/`, 4 testy, UI: `app/kalkulatory/
    komunikacja-bms/page.tsx`. Bez `validation.ts` — brak wartości liczbowych do walidowania,
    tylko wybór z zamkniętej listy.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 237/237 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (Pylontech vs CAN →
    żółty "Potrzebny konwerter protokołu", Pylontech vs Pylontech → zielony "Zgodne").

## Decyzje i uzasadnienie (c.d. 44)

- **2026-09-04 — Ekran 10, Moduł 4: "Ochrona przed wilgocią i kondensacją" — pierwszy ekran
  serii wykorzystujący standardowy wzór fizyczny nie podany wprost w źródle, PLUS znaleziona i
  udokumentowana wewnętrzna niespójność we własnym przykładzie źródła.** Źródło (Sekcja B) każe
  "obliczyć punkt rosy dla zadanej temperatury/wilgotności", ale nie podaje samego wzoru —
  użyty standardowy wzór meteorologiczny Magnusa-Tetensa (stałe dla wody ciekłej, a=17,27,
  b=237,7°C). To rozstrzygnięcie inne niż w większości ekranów tej sesji (gdzie wzór był zawsze
  cytowany wprost) — uzasadnione tym, że to fundamentalna, jednoznaczna fizyka (jak prawo Ohma
  użyte wcześniej dla prądu zwarciowego), nie wymyślony współczynnik bezpieczeństwa czy norma.
  Zweryfikowany niezależnie w Pythonie, zgodny z zaokrągleniem własnego przykładu źródła
  (-5°C/85%RH → wzór daje -7,12°C, źródło pisze "-7°C").
  - **Znaleziona i udokumentowana niespójność fizyczna w przykładzie źródła (Sekcja C)**: "obudowa
    osiągnie -6°C — w środku wykropli się woda" przy punkcie rosy -7°C. Poprawna fizyka:
    kondensacja zachodzi, gdy powierzchnia jest ZIMNIEJSZA (lub równa) punktowi rosy; -6°C jest
    CIEPLEJSZE niż -7°C, więc przy tych liczbach kondensacja nie powinna zajść. To prawdopodobny
    błąd redakcyjny w źródle, nie w tej implementacji. Zgodnie z zasadą "nie usuwaj — oznacz"
    (i tym samym podejściem zastosowanym wcześniej przy Ekranie 1/Sekcja C): silnik liczy
    poprawną zależność fizyczną, przykład źródła NIE jest odtwarzany dosłownie w teście (byłoby
    to utrwalenie błędnej logiki), rozbieżność opisana wprost w komentarzu kodu i tutaj.
  - Twardy stop "obudowa poniżej IP55 w środowisku wilgotnym" 1:1 ze źródła — dopisany do
    `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/ochrona-wilgoc/`, 7 testów (w tym dokładna wartość punktu rosy
    zweryfikowana z sześcioma miejscami po przecinku), UI: `app/kalkulatory/
    ochrona-wilgoc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 244/244 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (2 stany: żółte ryzyko
    kondensacji przy -15°C obudowy/-11,3°C punktu rosy, czerwony twardy stop przy IP20 w
    środowisku wilgotnym).

## Decyzje i uzasadnienie (c.d. 45)

- **2026-09-04 — Ekran 8, Moduł 4: "Symulacja Słabego Ogniwa (Cell Drift & Balancing)" —
  najprostszy wzór serii, jedna linijka mnożenia.** Źródło (Sekcja B): "Użyteczna pojemność
  pakietu = pojemność najsłabszego ogniwa" — w połączeniu szeregowym cały pakiet jest
  ograniczony najgorszym ogniwem. Zaimplementowany najgorszy przypadek: ogniwo dokładnie na
  dolnej granicy tolerancji fabrycznej (domyślnie ±3% ze źródła).
  - "Liczba ogniw w szeregu" z Sekcji A świadomie NIE stała się polem wzoru — nie jest potrzebna
    do tego konkretnego obliczenia (pojemność w Ah nie zależy od liczby ogniw w szeregu, tylko
    napięcie pakietu by zależało, a napięcia ogniwa nie ma w Sekcji A). Wynik podany w Ah i %,
    nie w kWh — unikanie wymyślenia napięcia ogniwa.
  - Rekomendacja prądu balansera z przykładu Sekcji C ("2A") świadomie NIE liczona — czysto
    ilustracyjna, źródło nie podaje zależności między wielkością rozjazdu a zalecanym prądem.
  - `lib/core/modules/baterie/slabe-ogniwo/`, 5 testów, UI: `app/kalkulatory/
    slabe-ogniwo/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 249/249 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (280Ah/3% → 271,6Ah,
    zgodne z niezależnym przeliczeniem w Pythonie).

## Decyzje i uzasadnienie (c.d. 46)

- **2026-09-04 — Ekran 9, Moduł 4: "Detekcja zwarcia i e-Fuse" — drugie zastosowanie wzorca
  "echo" tej sesji (po Obwodzie Pre-Charge).** Sekcja A źródła wprost odwołuje się do prądu
  zwarciowego "z rezystancji wewnętrznej" — dokładnie ten sam wzór Ohma (`I_zw = V/R_wewn`) już
  zaimplementowany w Ekranie 24 (Dobór bezpiecznika DC). Zamiast duplikować, wzór wyekstrahowany
  do samodzielnej, eksportowanej funkcji `obliczPradZwarciowyA` w
  `lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator.ts`, którą ten ekran importuje.
  Istniejące 6 testów Ekranu 24 przeszło bez zmian po refaktorze (zachowanie identyczne).
  - Próg: jeśli prąd zwarciowy przekracza zdolność łączeniową tranzystorów BMS (podawaną przez
    użytkownika z karty katalogowej, nie zgadywaną), zwykły bezpiecznik (~10ms) jest za wolny —
    wymagana funkcja e-Fuse (<100µs). Przykład źródła (48V/0,0096Ω → 5000A, poniżej 500A
    tranzystorów) odtworzony dokładnie w teście.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/detekcja-zwarcia-efuse/`, 5 testów, UI: `app/kalkulatory/
    detekcja-zwarcia-efuse/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 254/254 (5 nowych, `dobor-bezpiecznika-dc`
    nadal 6/6 po refaktorze), `pnpm build` czysto, `lib/core/` nadal nie importuje z
    `app/`/`components/`, Playwright (48V/0,0096Ω/500A → czerwony "Wymagana funkcja e-Fuse",
    I_zw=5000A zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 47)

- **2026-09-04 — Ekran 13, Moduł 4: "Algorytm końca ładowania (Tail Current / Absorption)" —
  formuła 1:1 ze źródła potwierdzona liczbowo przez własny przykład Sekcji C.** Źródło (Sekcja
  B): próg prądu końcowego jako ułamek C-rate (np. 0,05C) razy pojemność. Przykład Sekcji C
  ("prąd spadnie do 14A") sprawdzony niezależnie w Pythonie: 280Ah × 0,05C = dokładnie 14A —
  potwierdza, że to właśnie ten wzór, nie tylko podobny.
  - Trzy fazy ładowania jako proste, w pełni określone drzewo decyzyjne z tej samej Sekcji B:
    CC (napięcie jeszcze poniżej absorpcji) → CV-końcówka (napięcie osiągnięte, prąd wciąż nad
    progiem) → zakończone (prąd na progu lub poniżej).
  - `lib/core/modules/baterie/koniec-ladowania/`, 6 testów (w tym dokładna granica 14A jako
    "zakończone", nie "CV-końcówka" — nie `>` tylko `<=`), UI: `app/kalkulatory/
    koniec-ladowania/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 260/260 (6 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (280Ah/3,55V/0,05C: prąd
    20A → żółta faza CV-końcówka, prąd 14A → zielone "Ładowanie zakończone", oba zgodne z progiem
    14A z przykładu źródła).

## Decyzje i uzasadnienie (c.d. 48)

- **2026-09-04 — Ekran 29, Moduł 4: "Detekcja doziemienia (Ground Fault & IMD)" — najprostszy
  ekran serii, dwa checkboxy i logiczne OR, bez pól numerycznych/`validation.ts`.** Źródło
  (Sekcja B) redukuje się do sprawdzenia obecności zabezpieczenia (IMD lub różnicówka DC) —
  binarny fakt, nie liczba do walidacji. Symulacja scenariusza przebicia z Sekcji C jest opisowa
  ("niebezpieczny potencjał na ramie"), nie liczbowa, więc nie liczona.
  - Domyślny stan (oba checkboxy odznaczone) poprawnie pokazuje czerwony twardy stop od razu —
    dla ekranu bezpieczeństwa to właściwe zachowanie (brak potwierdzonego zabezpieczenia = alarm),
    inaczej niż pola liczbowe, gdzie 0/pusty musi być stanem `INCOMPLETE`, nie ostrzeżeniem.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Elektryczne/pożarowe.
  - `lib/core/modules/baterie/detekcja-doziemienia/`, 4 testy, UI: `app/kalkulatory/
    detekcja-doziemienia/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 264/264 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (domyślnie czerwony "Brak
    zabezpieczenia", po zaznaczeniu IMD → zielony "Zabezpieczone").

## Decyzje i uzasadnienie (c.d. 49)

- **2026-09-04 — Ekran 21, Moduł 4: "Pozycjonowanie ogniw (kompresja/spuchnięcie)" — docisk
  podawany wprost w kgf, świadomie NIE przeliczany na moment dokręcania.** Źródło (Sekcja B)
  podaje zalecany zakres docisku 300-400 kgf dla ogniw pryzmatycznych. Przykład Sekcji C
  dodatkowo podaje "moment 3 N·m" dla konkretnego zestawu (16S 280Ah, 4 pręty M8) — ale to
  pojedynczy wynik dla jednej konfiguracji, nie ogólny wzór; przeliczenie siła→moment wymagałoby
  skoku gwintu i współczynnika tarcia (wzór `T = K×D×F`), których źródło nie podaje. Zamiast
  zgadywać te dwie wartości, user wpisuje zastosowany docisk bezpośrednio w kgf (np. z klucza
  dynamometrycznego skalibrowanego na docisk, albo z dokumentacji producenta prętów).
  - Drugi element: potwierdzenie zostawionego luzu na dylatację (ogniwa rosną 1-2% podczas
    ładowania) — checkbox, nie liczba, zgodnie z opisowym charakterem tego faktu w źródle.
  - Twardy stop (docisk poza zakresem w obie strony) dopisany do `docs/rejestr-twardych-stopow.md`.
  - `lib/core/modules/baterie/pozycjonowanie-ogniw/`, 7 testów (w tym granice 300/400 kgf
    włącznie), UI: `app/kalkulatory/pozycjonowanie-ogniw/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 271/271 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (350kgf + luz potwierdzony
    → zielone "Docisk prawidłowy").

## Decyzje i uzasadnienie (c.d. 50)

- **2026-09-04 — Ekran 14, Moduł 4: "SoH — diagnostyka per ogniwo" — zbudowana tylko jedna z
  dwóch warstw źródła, druga świadomie odrzucona jako niemożliwa do policzenia z jednorazowego
  wejścia.** Źródło (Sekcja B) opisuje "dwa powiązane silniki": (1) SoH ogólny pakietu metodą
  coulombowską, uwzględniający historię cykli/temperatury/DoD w czasie — wymaga ciągłego
  logowania danych z BMS (integracja z żywym strumieniem danych, którego apka jeszcze nie ma);
  (2) diagnostyka per ogniwo z jawnie podanym progiem ("wzrost rezystancji o 50% względem
  wartości fabrycznej = utrata pojemności"). Zbudowana wyłącznie warstwa 2 — warstwa 1 nie jest
  ani brakiem normy, ani brakiem wzoru (jak w innych blocked screenach), tylko brakiem
  architektury do zbierania danych w czasie — inny rodzaj blokady, odnotowany osobno.
  - Przykład Sekcji C ("Ogniwo #12: 0,71 mΩ — KRYTYCZNE") zweryfikowany niezależnie: przy
    typowej fabrycznej rezystancji 0,25 mΩ (wartość ogniwa #1 z tej samej tabeli, "OK") wzrost
    wynosi +184%, dużo powyżej progu 50% — spójne z klasyfikacją źródła. Środkowa strefa "UWAGA"
    (ogniwo #7: 0,48 mΩ) nie ma podanego progu liczbowego oddzielającego ją od "OK" — ocena
    pozostaje dwustanowa (OK / do wymiany), nie trójstanowa, żeby nie wymyślać granicy.
  - Twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, sekcja Bateryjne.
  - `lib/core/modules/baterie/soh-per-ogniwo/`, 5 testów, UI: `app/kalkulatory/
    soh-per-ogniwo/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 276/276 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (0,25→0,71mΩ → czerwony
    "+184% względem fabrycznej / Ogniwo do wymiany", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 51)

- **2026-09-04 — Ekran 17, Moduł 4: "Analiza Second-Life (baterie z EV)" — dwie alternatywne
  metody szacunku ze źródła, obie zaimplementowane, user wybiera którą ma dane do zastosowania.**
  Źródło (Sekcja B): SoH szacowany "na podstawie wieku/przebiegu (~2-3%/rok lub ~1%/10 000 km)".
  Dolna granica zakresu rocznego (2%/rok) — ten sam wzorzec konserwatywnego wyboru już
  zastosowany w Ekranie 6 (Starzenie i degradacja). Przykład Sekcji C (10 kWh, SoH ~72% →
  7,2 kWh, 6000 zł → 833 zł/kWh) zweryfikowany niezależnie w Pythonie: **obie metody**
  niezależnie reprodukują dokładnie 72% SoH przy self-konsystentnych wartościach (14 lat przy
  metodzie wieku, 280 000 km przy metodzie przebiegu) — źródło nie podaje, które dane wejściowe
  faktycznie użyło w tym przykładzie, więc żadna z dwóch metod nie jest "tą jedyną słuszną",
  obie są równie uprawnione i obie dają ten sam wynik na tym konkretnym przykładzie.
  - Cena nowej baterii LiFePO4 (w źródle: "1200 zł/kWh") świadomie NIE stała się stałą aplikacji
    — to zmienna cena rynkowa, nie stały parametr fizyczny/normatywny, więc pole opcjonalne z
    ceną wpisywaną przez użytkownika, nie hardkodowana wartość, która szybko staje się
    nieaktualna.
  - Skrajny przypadek: gdy model degradacji sprowadza SoH do 0% (bardzo stara/przejechana
    bateria), zwracane jest osobne, krytyczne ostrzeżenie zamiast dzielenia przez zero.
  - `lib/core/modules/baterie/second-life/`, 7 testów, UI: `app/kalkulatory/second-life/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 283/283 (7 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (10kWh/6000zł/14 lat →
    zielony "Szacowany SoH: 72%" / "833 zł/kWh", dokładnie zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 52)

- **2026-09-04 — Zamknięcie sweepu Modułu 4 na 26/34, decyzja użytkownika: przejść do Modułu 2.**
  Zapytany wprost (AskUserQuestion), użytkownik wybrał kontynuację w Module 2 zamiast dalszego
  szukania pojedynczych budowalnych ekranów w resztkach Modułu 4 (pozostałe pozycje: 2 częściowo
  blocked, 3 cross-module, 4/25/31/32 blocked, 19/33 nie sprawdzone — odłożone, nie porzucone).

- **2026-09-04 — Ekran 17, Moduł 2: "Agregat prądotwórczy — definicja i logika pracy" — domyka
  lukę 1.19 znalezioną 2026-08-29 przy budowie standardu.** Ta luka była udokumentowana od
  początku Etapu 1 jako "treść źródłowa gotowa w Biblii, nigdy nie przepisana do pliku treści
  modułu" — teraz faktycznie odzyskana i zaimplementowana. Treść źródłowa:
  `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`, linie 503-521, funkcja 2.19
  (dawne 1.19). Trzy wzory w łańcuchu, wszystkie zweryfikowane niezależnie w Pythonie przed
  implementacją i razem odtwarzające dokładnie własny przykład źródła (deficyt 80 kWh, agregat
  5 kW → 20 godzin, 25 l paliwa, 200 zł):
  1. `godziny = deficytKwh / (mocAgregatuKw × 0,8)` — źródło podaje zakres "optymalne obciążenie
     70-80%", użyta górna granica (80%) jest jedyną wartością w tym zakresie, przy której wynik
     wychodzi dokładnie 20h (nie 21,3h ani inna wartość) — silny sygnał, że to właśnie ta granica
     została użyta w oryginalnym przykładzie, nie środek zakresu.
  2. `paliwo = godziny × zużycieLH` (zużycie w l/h jako bezpośredni input użytkownika, zgodnie z
     Sekcją "Skąd czerpie dane" Biblii).
  3. `koszt = paliwo × cenaZaLitr` (cena paliwa jako pole użytkownika — zmienna cena rynkowa, nie
     stała aplikacji, ten sam wzorzec co cena nowej baterii w Ekranie 17 Modułu 4 tego samego dnia).
  - **Deficyt energetyczny w najgorszym miesiącu wpisywany wprost przez użytkownika**, nie
    wyprowadzany automatycznie z produkcji PV (Moduł 3) minus zapotrzebowanie (ten sam Moduł 2) —
    ta integracja międzymodułowa to osobny, nie rozpoczęty krok, zgodnie z wzorcem stosowanym
    konsekwentnie w tej sesji (user wpisuje bezpośrednio zmierzoną/oszacowaną wartość zamiast
    czekać na pełny potok danych).
  - **Wpis "luka" w `docs/rejestr-pokrycia.md` NIE usunięty, tylko oznaczony jako rozwiązany**
    (przekreślenie + data + odniesienie do nowego wiersza) — zgodnie z zasadą "nie usuwaj —
    oznacz" (`docs/standards/15-wspolpraca-z-ai.md`, 15.3), ten sam wzorzec co korekta D-1.
  - `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/`, 5 testów, UI: `app/kalkulatory/
    agregat-pradotworczy/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 288/288 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (80kWh/5kW/1,25 l-h/8 zł/l
    → "20 h", "25 l", "200 zł", dokładnie zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 53)

- **2026-09-04 — Ekran 9, Moduł 2: "Pobór własny falownika" — bezpośredni odpowiednik już
  zbudowanego wzorca (M4/E22 Pobór własny BMS), ten sam kształt wzoru.** Wzór
  `E_doba = P_jałowy × 24 / 1000` (kWh/dobę) 1:1 ze źródła. Przykład źródła ("45W → 1,08 kWh/dobę")
  zweryfikowany niezależnie przed implementacją i odtworzony dokładnie. Domyślna wartość 50W
  (gdy model nieznany) pokazana jako podpowiedź w UI, nie ukryty domyślny stan pola.
  - `lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/`, 4 testy, UI: `app/kalkulatory/
    pobor-wlasny-falownika/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 292/292 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (45W → 1,08 kWh/dobę,
    zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 54)

- **2026-09-04 — Ekran 11, Moduł 2: "Przetwornice DC/DC" — przykład źródła zweryfikowany
  matematycznie z niebanalnym wynikiem: strata jako % dotyczy mocy realnie pobranej, nie
  znamionowej urządzenia.** Wzór `P_realne = P_urządzenia / sprawność`. Źródło (Sekcja C):
  "sprawność ~92% → traci 8% energii". Sprawdzone w Pythonie: `strataW / P_realne × 100`
  wychodzi dokładnie `100 - sprawność` (tu: 8,0%) — czyli "traci 8%" ze źródła to strata
  liczona względem mocy faktycznie pobranej z magistrali (żeby dostarczyć 100W na wyjściu,
  urządzenie musi pobrać 108,7W, z czego 8,7W/108,7W = dokładnie 8% to strata) — nie jest to
  przypadkowe uproszczenie "100-sprawność", tylko matematycznie ścisła zależność.
  - Pole "zasilanie bezpośrednie" (bez przetwornicy) jako przełącznik — gdy aktywne, pole
    sprawności ukryte w UI (nieistotne), status VALID bez strat, zamiast wymuszać wpisanie
    nieużywanej wartości.
  - `lib/core/modules/zapotrzebowanie/przetwornice-dcdc/`, 4 testy, UI: `app/kalkulatory/
    przetwornice-dcdc/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 296/296 (4 nowe), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (100W/92% → 108,7W,
    "traci 8% (8,7 W)", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 55)

- **2026-09-04 — Ekran 8, Moduł 2: "Zaawansowane parametry obciążenia" — zbudowany tylko jeden
  z trzech podpunktów źródła, ten z prawdziwym, samodzielnym wzorem.** Sekcja B źródła opisuje
  "trzy powiązane korekty": (1) moc pozorna/cos φ — wzór podany wprost (`VA = P / cos φ`),
  domyślny cos φ=0,7 dla silników też podany wprost; (2) prądy rozruchowe — współczynniki (5× dla
  pompy głębinowej, 6× dla starej lodówki) opisane jako "z bazy komponentów", której ten projekt
  nie ma — użycie tych konkretnych mnożników jako uniwersalnej reguły byłoby wymyślaniem danych
  dla urządzeń spoza tych dwóch przykładów; (3) współczynnik jednoczesności — czysto opisowy,
  źródło nie podaje żadnej konkretnej liczby/wzoru statystycznego. Zbudowany wyłącznie podpunkt 1.
  - Przykład Sekcji C łączy wszystkie trzy podpunkty naraz (3,2 kW → 4,8 kVA przy rozruchu pompy)
    — nie da się go odtworzyć przy zbudowaniu tylko jednego podpunktu, więc test używa
    self-konsystentnych wartości (2000W/cos φ=0,7 → 2857 VA), nie próbuje wymusić dopasowania do
    przykładu źródła.
  - `lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/`, 5 testów, UI: `app/kalkulatory/
    moc-pozorna-cosfi/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 301/301 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/`, Playwright (2000W/cos φ=0,7 →
    2857 VA, zgodne z niezależnym przeliczeniem w Pythonie).

## Decyzje i uzasadnienie (c.d. 56)

- **2026-09-04 — Ekran 13, Moduł 2: "Bufor na rozbudowę" (dawne 1.25, Wzorzec D-lite).** Prosty
  mnożnik procentowy na sumie całkowitego zapotrzebowania dobowego, wartości suwaka (0/10/20/30%)
  1:1 ze źródła — bez interpolacji ani wartości pośrednich, których źródło nie podaje.
  - Wzór `E_z buforem = E_całkowite × (1 + bufor%)`, `dodatek = E_z buforem - E_całkowite`.
    Przykład (12,4 kWh + 20% → 14,88 ≈ 14,9 kWh) zweryfikowany niezależnie w Pythonie przed
    implementacją i potwierdzony w przeglądarce (Playwright).
  - Tylko ostrzeżenie info-level ("bufor 20% dolicza X kWh/dobę zapasu...") — status zawsze
    `VALID`, zgodnie ze standardową konwencją tej sesji (info-only nigdy nie obniża statusu do
    `VALID_WITH_WARNINGS`).
  - `lib/core/modules/zapotrzebowanie/bufor-rozbudowe/`, 5 testów, UI: `app/kalkulatory/
    bufor-rozbudowe/page.tsx`.
  - Zweryfikowane: `lint` czysto, `pnpm build` czysto (306 testów), Playwright (12,4 kWh + 20% →
    "14,9 kWh/dobę", zgodne z przeliczeniem referencyjnym).

## Decyzje i uzasadnienie (c.d. 57)

- **2026-09-04 — Ekran 7, Moduł 2: "Dni autonomii" (dawne 1.9, Wzorzec D-lite) — trzecie
  zastosowanie wzorca "echo" w tej sesji.** Wartość główna to prosty wybór suwaka (1/2/3/5/7 dni,
  literalnie ze źródła), która docelowo auto-zasila Moduł 4/Ekran 1 ("Dobór pojemności baterii") —
  ta integracja nie istnieje jeszcze (brak współdzielonego stanu projektu), więc na razie ekran
  tylko produkuje i pokazuje wybraną wartość.
  - Źródło żąda też: "ekran powinien pokazywać na żywo szacunkowy wpływ na wielkość/koszt
    magazynu przy przesuwaniu suwaka" — zbudowane jako **opcjonalny** podgląd (trzy dodatkowe
    pola: zapotrzebowanie dobowe, sprawność falownika, DoD — te same co Moduł 4/Ekran 1), a nie
    obowiązkowa część ekranu, bo to nie jest jego własny zakres danych.
  - Zamiast duplikować wzór `C_użyteczna = E_dobowe × d_autonomii / (η × DoD)`, wyekstrahowano go
    z `lib/core/modules/baterie/dobor-pojemnosci/calculator.ts` do osobnej, eksportowanej funkcji
    `obliczPojemnoscUzytecznaKwh` i zaimportowano tutaj — dokładnie ten sam wzorzec co przy
    Ekranie 9 M4 (`obliczPradZwarciowyA`) i Pre-Charge (M4/M11) wcześniej w tej sesji. 7 istniejących
    testów `dobor-pojemnosci` nienaruszonych (refaktoryzacja czysto mechaniczna, bez zmiany logiki).
    Koszt (druga część żądania źródła) świadomie NIE policzony — wymagałby ceny magazynu/kWh, co
    duplikowałoby zakres `oplacalnosc-magazynu` (M4/Ekran 23) bez wyraźnej potrzeby tutaj.
  - `lib/core/modules/zapotrzebowanie/dni-autonomii/`, 5 testów, UI: `app/kalkulatory/
    dni-autonomii/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 311/311 (5 nowych), `pnpm build` czysto,
    `lib/core/` nadal nie importuje z `app/`/`components/` (import między dwoma modułami `lib/core/
    modules/` jest dozwolony — to nie jest import w górę warstw), Playwright (3 dni + 12 kWh/95%/80%
    → "47,4 kWh", zgodne z wartością referencyjną 900/19≈47,368 policzoną wcześniej dla tego samego
    wzoru w Ekranie 1 M4).

## Decyzje i uzasadnienie (c.d. 58)

- **2026-09-04 — Ekran 2, Moduł 2: "Inteligentny bojler C.W.U." (dawne 1.2, Wzorzec D) — ΔT
  jako pole ręczne, nie domyślne, żeby nie wymyślać danych.** Sekcja B źródła każe liczyć
  "dobowe zapotrzebowanie na ciepłą wodę na podstawie pojemności cieplnej i liczby osób" —
  fizycznie to `Q = m × c_wody × ΔT` (specyficzne ciepło wody, uniwersalna stała fizyczna,
  4186 J/(kg·K), ten sam rodzaj precedensu co wzór Magnusa-Tetensa w Ekranie 10 M4). Ale w
  przeciwieństwie do tamtego wzoru, tu jest wolny parametr projektowy: ΔT (wzrost temperatury
  zimna→C.W.U.), zależny od lokalnych warunków (temperatura wody wodociągowej, docelowa
  temperatura bojlera) — źródło NIE podaje go jako liczby.
  - Przykład Sekcji C (200l, 4 osoby → ok. 8 kWh) odpowiada ΔT≈35K (dokładnie 34,4K dla równego
    8,000 kWh) — zweryfikowane niezależnie w Pythonie. To nie jest jawnie stwierdzona dana
    źródła, więc NIE przyjęte jako domyślna wartość (byłoby wymyślaniem współczynnika projektowego)
    — pole wymaga ręcznego wpisania, ta sama zasada co "ogrzewanie" bez domyślnej mocy w Ekranie 1.
  - Dodatkowy, niewymyślony check: ostrzeżenie (poziom `warning`, nie `critical`) gdy pojemność
    zbiornika bojlera mniejsza niż dobowe zapotrzebowanie w litrach — to prosta różnica
    wielkości, nie tabela normatywna, więc nie łamie zasady "nie wymyślaj norm".
  - `lib/core/modules/zapotrzebowanie/bojler-cwu/`, 5 testów, UI: `app/kalkulatory/bojler-cwu/
    page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 316/316 (5 nowych), `pnpm build` czysto,
    Playwright (200l/ΔT=35K/2kW/200l → "8,1 kWh/dobę", zgodne z przykładem źródła "ok. 8 kWh";
    zmiana pojemności bojlera na 150l poprawnie przełącza werdykt na żółty z ostrzeżeniem).

## Decyzje i uzasadnienie (c.d. 59)

- **2026-09-04 — Ekran 6, Moduł 2: "Sezonowość i tryb wakacyjny" (dawne 1.8, Wzorzec D) —
  granice sezonu wpisywane per urządzenie, nie zakładane globalnie.** Sekcja C źródła podaje
  jeden przykład: "klimatyzacja aktywna tylko czerwiec-wrzesień" — to konkretna charakterystyka
  TEGO urządzenia (klimatyzacji), nie jawna, uniwersalna definicja "lato"/"zima" w miesiącach
  dla wszystkich urządzeń tej kategorii. Przyjęcie własnych granic (np. "lato = czerwiec-sierpień")
  byłoby wymyślaniem danych nieobecnych w źródle. Rozwiązanie: użytkownik wpisuje miesiąc
  początku/końca sezonu osobno dla każdego urządzenia — dokładnie odtwarza przykład źródła przy
  wpisaniu 6/9, ale nie narzuca tej granicy innym urządzeniom.
  - Trzy typy: całoroczny (zawsze aktywne), sezonowy (aktywne w oknie miesięcy, z obsługą
    przełomu roku — np. zima 12→2 — przetestowane), weekendowy (checkbox "czy dzisiaj weekend").
  - `CalcResult.inputs` jest typowany jako `Record<string, number>` — pola nienumeryczne (`typ`,
    `czyWeekend`) pominięte w `inputs`, zgodnie z istniejącym wzorcem z `komunikacja-bms` i
    `detekcja-doziemienia` (oba też mają nienumeryczne pola wejścia).
  - `lib/core/modules/zapotrzebowanie/sezonowosc/`, 9 testów, UI: `app/kalkulatory/sezonowosc/
    page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 325/325 (9 nowych), `pnpm build` czysto,
    Playwright (sezonowy 6→9, sprawdzany miesiąc 7 → "Aktywne", 3,00 kWh/dobę; miesiąc 12 →
    "Nieaktywne", 0,00 kWh/dobę — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 60)

- **2026-09-04 — Ekran 5, Moduł 2: "Profil dobowy + astronomiczny dzień/noc" (scala dawne
  1.7/1.16, Wzorzec D) — zbudowana tylko część astronomiczna, czwarte zastosowanie
  precedensu "uniwersalna fizyka/astronomia niepodana wprost w źródle, ale nie wymyślona".**
  Sekcja A/C źródła każe liczyć długość dnia/nocy z szerokości geograficznej — standardowe
  równanie wschodu/zachodu Słońca z przybliżeniem deklinacji metodą Coopera (1969),
  `δ = 23,45° sin(360/365 × (284+n))`, `N = (2/15) arccos(-tanφ·tanδ)` — uniwersalna, dobrze
  udokumentowana formuła inżynierii słonecznej (ten sam rodzaj precedensu co Magnus-Tetens w
  Ekranie 10 M4 i ciepło właściwe wody w Ekranie 2 M2), nie dana specyficzna dla źródła.
  - Zweryfikowane niezależnie w Pythonie przed implementacją: Warszawa (φ≈52,2°N), 21 grudnia
    (dzień 355) → 7,47h dnia / 16,53h nocy — zgodne z przykładem źródła Sekcji C ("Grudzień: 8h
    dnia, 16h nocy", zaokrąglone). Równik/równonoc → dokładnie 12h/12h (test sanity). Koło
    podbiegunowe (70°N) → poprawnie zwraca noc/dzień polarny (0h/24h) z ostrzeżeniem info.
  - Sekcja B (profil godzinowych współczynników zapotrzebowania, "0,3 w nocy, 1,5 w szczycie")
    świadomie NIE zbudowana — to przykładowe wartości ilustracyjne źródła, nie uniwersalna
    tabela, więc przyjęcie ich jako reguły byłoby wymyślaniem danych.
  - `szerokoscGeograficzna: number | null` — `null` jako sentinel "nie wpisano" (0° to legalna
    wartość na równiku), ten sam wzorzec co `temperaturaOgniwC` w `chlodzenie-latem` (M4).
  - Dodatkowy, praktyczny output: opcjonalna energia nocna odbiornika działającego tylko w
    ciemności (np. oświetlenie zewnętrzne) = moc × długość nocy — bezpośrednio realizuje
    przykład D źródła.
  - `lib/core/modules/zapotrzebowanie/profil-astronomiczny/`, 9 testów, UI: `app/kalkulatory/
    profil-astronomiczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 334/334 (9 nowych), `pnpm build` czysto,
    Playwright (52,2°/dzień 355/50W → "7,5 h dnia / 16,5 h nocy", "0,83 kWh tej doby").

## Decyzje i uzasadnienie (c.d. 61)

- **2026-09-04 — Ekran 12, Moduł 2: "Macierz priorytetów odłączania (Smart Load Shedding)"
  (dawne 1.20, Wzorzec D) — buildowalny bez bazy urządzeń, bo progi SoC są podane wprost.**
  W przeciwieństwie do wcześniej odrzuconych sub-punktów (np. prądy rozruchowe w Ekranie 8),
  ten ekran NIE wymaga bazy komponentów — logika działa na pojedynczym priorytecie (1/2/3) i
  aktualnym SoC, a oba progi (20% dla priorytetu 2, 90% dla priorytetu 3) są jawnie podane w
  Sekcji A źródła, nie wymyślone.
  - Logika: priorytet 1 nigdy nie odłączany; priorytet 2 odłączany gdy `SoC < 20%`; priorytet 3
    odłączany gdy `SoC < 90%` LUB brak nadwyżki PV (drugi warunek też wprost ze źródła: "lub
    braku nadwyżki PV").
  - Przykład źródła Sekcji C (SoC 18% → odłączone: zmywarka/suszarka [priorytet 3]; aktywne:
    ogrzewanie/pompa głębinowa [priorytet 1]) odtworzony dokładnie w testach.
  - Agregacja po wielu urządzeniach naraz (żeby np. wyświetlić "co dokładnie zostanie odłączone
    w Twoim domu") świadomie NIE zbudowana — wymaga listy urządzeń z Ekranu 3 (jeszcze nie
    istnieje) — ten ekran liczy pojedynczy odbiornik/kategorię na raz, zgodnie z ustalonym
    wzorcem "manualne wpisanie zamiast auto z ekranu, który jeszcze nie istnieje".
  - `socPct: number | null` — `null` jako sentinel "nie wpisano" (0% to legalna, krytyczna
    wartość SoC), ten sam wzorzec co w `profil-astronomiczny` i `chlodzenie-latem` (M4).
  - `lib/core/modules/zapotrzebowanie/load-shedding/`, 9 testów, UI: `app/kalkulatory/
    load-shedding/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 343/343 (9 nowych), `pnpm build` czysto,
    Playwright (priorytet 3 + SoC 18% → "Odłączony", żółty; priorytet 1 + SoC 18% → "Aktywny",
    zielony — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 62)

- **2026-09-04 — Ekran 2, Moduł 4: "Sugestia napięcia systemowego (12/24/48V)" (dawne 3.2,
  Wzorzec D) — dawny "blocked" z Modułu 4 teraz otwarty; Moduł 2 wyczerpany, wracamy dobierać
  pojedyncze buildowalne ekrany z innych modułów.** Moduł 2 doszedł do 13/17, a pozostałe cztery
  pozycje (Ekran 3 urządzenia zmienne, Ekran 10 sprawność inwertera, Ekran 14 architektura
  1-/3-fazowa, Ekran 15 kategorie specjalne) wymagają bazy komponentów lub progu nieobecnego w
  źródle (krzywa sprawności inwertera to tylko dwa luźne zakresy bez wzoru; próg "znacznej
  asymetrii" faz nigdzie nie podany liczbowo) — sprawdzone i odrzucone jako niebuildowalne bez
  wymyślania danych, tym samym wzorcem co poprzednie odrzucenia w tej sesji.
  - Sekcja B źródła podaje dwa progi wprost: `moc>3000W → 48V`, `moc<1000W → 12V`. Pasmo
    1000-3000W dopowiedziane logicznie jako 24V (jedyna pozostała opcja z trzech wymienionych w
    tytule ekranu) — udokumentowane jawnie jako uzupełnienie struktury, nie ukryty wymysł.
  - Prąd `I=P/V` dla wszystkich trzech napięć (czyste prawo Ohma) — przykład źródła (4800W →
    400A@12V, 100A@48V) odtworzony dokładnie w Pythonie przed implementacją i w teście.
  - Porównanie wymaganych przekrojów kabli (Sekcja C: "kabel 95mm²"/"25mm²") świadomie NIE
    zbudowane — wymaga tabeli obciążalności prądowej (PN-IEC 60364-5-52), ta sama brakująca
    norma co Moduł 5/Ekran 1 (już wcześniej blocked).
  - `lib/core/modules/baterie/napiecie-systemowe/`, 8 testów, UI: `app/kalkulatory/
    napiecie-systemowe/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 351/351 (8 nowych), `pnpm build` czysto,
    Playwright (4800W → "48V", "400A@12V · 200A@24V · 100A@48V", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 63)

- **2026-09-04 — Ekran 4, Moduł 4: "Moduł EV — ładowanie samochodu elektrycznego" (dawne 3.4,
  Wzorzec D) — zapotrzebowanie EV wpisywane wprost, nie wyprowadzane z przebiegu.** Sekcja A
  źródła wymienia "pojemność baterii EV, dzienny przebieg, moc ładowarki" jako wejścia, ale
  Sekcja B liczy "dodatkowe zapotrzebowanie" bez podania wzoru przebieg→energia — zużycie
  energii na kilometr różni się mocno między modelami EV (typowo 0,15-0,25 kWh/km, ale to
  zależy od modelu) i źródło nie podaje konkretnej liczby, więc nie jest zgadywane. Zamiast tego
  użytkownik wpisuje dobowe zapotrzebowanie EV wprost (własny szacunek lub dane z ładowarki).
  - Logika: `brak_sezon = max(0, E_EV - nadwyżka_PV_sezon)` dla lata i zimy osobno (nadwyżka PV
    wpisywana ręcznie — docelowo z Modułu 3, jeszcze nie istnieje jako integracja).
  - Przykład źródła Sekcji C (10 kWh/dobę EV, latem pokryte, zimą brak — "zimą będziesz musiał
    zwiększyć PV o 4 panele") odtworzony dokładnie w testach i Playwright (12/3 kWh nadwyżki →
    "Latem: pokryte", "Zimą: brak 7,0 kWh"). Przeliczenie braku energii na liczbę potrzebnych
    paneli PV świadomie NIE zbudowane — wymaga mocy panela i godzin nasłonecznienia, które
    dodałyby kolejną warstwę zgadywania.
  - `nadwyzkaPvLatemKwh`/`nadwyzkaPvZimaKwh: number | null` — `null` jako sentinel "nie wpisano"
    (0 kWh nadwyżki zimą to bardzo realna, legalna wartość).
  - `lib/core/modules/baterie/modul-ev/`, 5 testów, UI: `app/kalkulatory/modul-ev/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 356/356 (5 nowych), `pnpm build` czysto,
    Playwright (10/12/3 kWh → "Latem: pokryte", "Zimą: brak 7,0 kWh", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 64)

- **2026-09-04 — Ekran 19, Moduł 4: "Vehicle-to-Home (V2H)" (dawne 3.21, Wzorzec D) —
  czwarte zastosowanie wzorca "echo" w tej sesji.** Koszt za kWh z baterii trakcyjnej EV to
  strukturalnie identyczny wzór co "True Cost of Storage" (Ekran 23, `cena / (pojemność × cykle
  × sprawność)`) — zamiast duplikować, wyekstrahowano `obliczKosztZaKwh` jako czystą funkcję z
  `oplacalnosc-magazynu/calculator.ts` i zaimportowano tutaj z innymi polami wejścia (bateria
  trakcyjna zamiast domowej). 6 istniejących testów `oplacalnosc-magazynu` nienaruszonych po
  refaktoryzacji (potwierdzone przed dalszą pracą).
  - "Rezerwa na dojazd, degradacja, straty" (Sekcja B źródła) — trzy słowa bez rozbicia na osobne
    wzory. Zamiast zgadywać podział, zamodelowano jako: rezerwa (wprost odejmowana od pojemności)
    + jeden łączny "współczynnik sprawności efektywnej" (degradacja+straty razem, wpisywany
    ręcznie przez użytkownika). Przykład źródła (80 kWh → 40 kWh) jest z natury niejednoznaczny —
    wiele kombinacji rezerwa/sprawność go odtwarza — więc test świadomie NIE wymusza dopasowania
    do tego konkretnego przykładu, tylko sprawdza self-konsystentne wartości (ta sama zasada co
    Ekran 8 M2 wcześniej w tej sesji).
  - Boolean `wspieraV2h` (V2H pełny dom vs V2L pojedyncze urządzenia, max ok. 3,6 kW — wartość
    "np." ze źródła, użyta tylko w treści komunikatu, NIE jako twardy próg w kodzie) → info/
    warning zamiast blokowania obliczeń (numery liczą się niezależnie od trybu, zgodnie z
    przykładem źródła, gdzie liczby są pokazane nawet dla auta wspierającego tylko V2L).
  - `lib/core/modules/baterie/vehicle-to-home/`, 6 testów, UI: `app/kalkulatory/
    vehicle-to-home/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 362/362 (12 nowych łącznie z refaktoryzacją),
    `pnpm build` czysto, Playwright (80/10/60%/20000zł/1000cykli → "42,0 kWh", "0,42 zł/kWh",
    żółty werdykt z ostrzeżeniem "tylko V2L" przy niezaznaczonym checkboxie).

## Decyzje i uzasadnienie (c.d. 65)

- **2026-09-04 — Ekran 18, Moduł 3: "Wpływ temperatury na wydajność" (dawne 2.33, Wzorzec D) —
  przejście na pojedyncze buildowalne ekrany Modułu 3 po wyczerpaniu Modułów 2 i 4.** Moduł 2
  doszedł do 13/17 (reszta wymaga bazy komponentów lub progu nieobecnego w źródle), Moduł 4 do
  29/34 (Ekrany 3/25/31/32/33 blocked — brak normy/wzoru/danych historycznych). Moduł 3 miał
  dotąd tylko 2 ekrany (jako reprezentanci wzorców A i C z decyzji 2026-08-29) — ten ekran to
  pierwszy krok w kierunku pełnego wyliczenia per-funkcja tego modułu, wybrany bo ma kompletny,
  gotowy wzór fizyczny w źródle.
  - Wzór `P_rzeczywista = P_nominalna × (1 + γ×(T_panel−25))` 1:1 ze źródła (Sekcja B). Oba
    parametry wejściowe źródło podaje jako ZAKRESY, nie liczby: przyrost temperatury panelu
    ponad otoczenie "25-30°C" i współczynnik temperaturowy γ "typowo -0,3 do -0,45%/°C" — oba
    pola wymagają ręcznego wpisania (z podpowiedzią o typowym zakresie w UI), ta sama zasada co
    ΔT w Ekranie 2 M2 (bojler C.W.U.) i przyrost/γ w tym ekranie — nie przyjęto żadnej wartości
    środkowej jako cichego domyślnego.
  - Przykład źródła (35°C otoczenia + 25°C przyrost → 60°C panel, strata ok. 15%) odtworzony
    dokładnie przy γ≈-0,43%/°C — zweryfikowane niezależnie w Pythonie przed implementacją.
  - `lib/core/modules/pv/wplyw-temperatury/`, 5 testów, UI: `app/kalkulatory/
    wplyw-temperatury/page.tsx`. Nowa sekcja "Moduł 3 — ekrany dodatkowe" w
    `docs/rejestr-pokrycia.md` (nie wymuszona do tabeli wzorców A-H, która jest 1:1 z ośmioma
    wzorcami, nie z modułami).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 367/367 (5 nowych), `pnpm build` czysto,
    Playwright (35°C/25°C/-0,43%/450W → "382 W", "60°C", "15,0%", zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 66)

- **2026-09-04 — Ekran 8, Moduł 3: "Straty na okablowaniu DC (efekt Joule'a)" (dawne 2.14,
  Wzorzec D) — pełny wzór fizyczny (rezystywność miedzi jako stała) reprodukuje CAŁĄ tabelę
  przykładu źródła naraz, nie tylko jedną wartość.** Wzór `R = ρ×L/S` ze źródła, z ρ_Cu=0,0175
  Ω·mm²/m podanym wprost jako stała — nie wymyślona. Rezystancja pętli liczona dla 2×L (prąd
  płynie przez oba przewody, plus i minus) — standardowa praktyka inżynierska DC, udokumentowana
  transparentnie w kodzie jako założenie, nie ukryta.
  - Przykład źródła Sekcji C (30m, 15A: 4mm²→6%, 6mm²→4%, 10mm²→2,4%) wymagał znajomości napięcia
    (Vmp) do przeliczenia straty mocy na %, którego przykład nie podaje wprost — wyprowadzone
    przez rozwiązanie równania wstecz (Vmp≈65,625V) i zweryfikowane: przy tej wartości WSZYSTKIE
    TRZY punkty przykładu (6%/4%/2,4%) wychodzą dokładnie, co potwierdza poprawność wzoru (gdyby
    wzór był błędny, trafienie we wszystkie trzy wartości jednocześnie byłoby przypadkiem
    astronomicznie mało prawdopodobnym).
  - Dodatkowy element: porównanie strat dla 4 standardowych przekrojów katalogowych (4/6/10/16
    mm² — typowe wartości IEC, nie wymyślone) na jednym ekranie, matching source's own
    porównawczy format tabeli w Sekcji C.
  - `lib/core/modules/pv/straty-okablowanie-dc/`, 6 testów, UI: `app/kalkulatory/
    straty-okablowanie-dc/page.tsx`. Dopisany do sekcji "Moduł 3 — ekrany dodatkowe" w
    `docs/rejestr-pokrycia.md` (razem z Ekranem 18 z poprzedniego PR).
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 373/373 (6 nowych), `pnpm build` czysto,
    Playwright (30m/15A/65,625V/4mm² → "6,0%", tabela porównawcza 6,0/4,0/2,4/1,5% dla
    4/6/10/16mm² — dokładnie zgodne z tabelą źródła).

## Decyzje i uzasadnienie (c.d. 67)

- **2026-09-04 — Naprawa dryfu: brakująca deklaracja "Ekspertyza domenowa" wymagana przez GOD
  BOOK §0.2.** Użytkownik zapytał, czy sesja przyjmuje personę doświadczonego elektryka/fizyka
  off-gridu (20 lat doświadczenia), jak nakazuje `docs/god-book/instrukcja-uniwersalna-biblii-
  projektu-v2_5.md` §0.2 ("Ekspertyza domenowa — automatyczna, nie na żądanie"). Sprawdzone:
  merytorycznie tak przez całą sesję (niezależna weryfikacja każdego wzoru w Pythonie przed
  implementacją, wyłapana i udokumentowana sprzeczność fizyczna w przykładzie źródła — punkt
  rosy w `ochrona-wilgoc`, konsekwentne rozróżnianie uniwersalnej fizyki od współczynników,
  których nie wolno wymyślać, realna praktyka inżynierska — np. 2×L dla pętli DC w
  `straty-okablowanie-dc`, priorytetowe potraktowanie MPPT stress-test jako "najważniejszego
  twardego stopu w aplikacji" zgodnie z własnym podkreśleniem źródła) — ale formalna deklaracja
  wymagana przez §0.2 (wpis "Ekspertyza domenowa: ..., poziom: senior/20 lat doświadczenia" w
  `00_Biblia.md`) nigdy nie została zapisana, bo ten projekt nie ma jeszcze pliku o tej
  kanonicznej nazwie (`ZASADY_APLIKACJI.md`/`USTALENIA.md` pełnią tę rolę tymczasowo).
  - To dryf bez świadomej decyzji (GOD BOOK Część Y.2), nie konflikt do rozstrzygania z
    użytkownikiem — naprawiony od razu, nie zapytany.
  - **Ekspertyza domenowa: elektryk/inżynier instalacji off-grid PV (panele, magazyny energii,
    ogrzewanie, bezpieczeństwo elektryczne), poziom: senior / 20 lat doświadczenia w terenie.**
    Obowiązuje dla całej dalszej pracy nad tym projektem — nie tylko od teraz.

## Decyzje i uzasadnienie (c.d. 68)

- **2026-09-04 — Ekran 5, Moduł 3: "Zimowy stress-test napięciowy MPPT (Voc max)" (dawne 2.11,
  Wzorzec D) — źródło samo nazywa to "jednym z najważniejszych twardych stopów w całej
  aplikacji".** Wzór `V_max = Voc×(1+β×(Tmin−25))`, `V_string = V_max×n_paneli` 1:1 ze źródła
  (Sekcja B), z jawnymi progami werdyktu: 🔴 gdy `V_string > limit MPPT`, 🟡 gdy `V_string >
  0,95×limit`, 🟢 inaczej — też 1:1 ze źródła, nie wymyślone.
  - Przykład źródła (Voc 56,5V, β=-0,3%/°C, Tmin=-25°C, 8 paneli → 520V, limit MPPT 450V → 🔴,
    rekomendacja "2 stringi po 4 panele") odtworzony dokładnie: 8 paneli daje 519,8V (🔴), 4
    panele (rekomendacja źródła) daje 259,9V (🟢) — zweryfikowane niezależnie w Pythonie przed
    implementacją, oba warianty przetestowane.
  - β (współczynnik temperaturowy Voc) to zakres ze źródła (-0,29 do -0,32%/°C, "typowo") — pole
    ręczne z podpowiedzią, nie ukryty domyślny (ta sama zasada co ΔT/γ w poprzednich ekranach).
  - UI liczy `hasCritical`/`hasWarning` z poziomów ostrzeżeń (nie bezpośrednio ze `status`), ten
    sam wzorzec co `dobor-bezpiecznika-dc` (M4/E24) — czerwony/żółty/zielony werdykt niezależny
    od dwuwartościowego `Status` enum.
  - **Dopisany do `docs/rejestr-twardych-stopow.md`** (sekcja "Elektryczne/pożarowe") — jeden z
    ważniejszych wpisów w tym rejestrze wg własnej oceny źródła.
  - `lib/core/modules/pv/stress-test-mppt/`, 6 testów, UI: `app/kalkulatory/
    stress-test-mppt/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 379/379 (6 nowych), `pnpm build` czysto,
    Playwright (8 paneli → "520 V", czerwony "Zabronione"; 4 panele → "260 V", zielony "Bezpieczny
    margines" — oba stany zgodne z przykładem i rekomendacją źródła).

## Decyzje i uzasadnienie (c.d. 69)

- **2026-09-04 — Ekran 17, Moduł 3: "Niedopasowanie mocy paneli (mismatch)" (scala dawne
  2.32/2.41, Wzorzec D) — dla stringu szeregowego 2 paneli, tak jak podaje przykład źródła.**
  Wzór `P_rzeczywista = 2×min(I1,I2)×V_wspólne` (prąd stringu ogranicza najsłabszy panel).
  - Przykład źródła (400W/11A + 330W/9A, Vmp=40V → 720W zamiast 730W teoretycznych, strata 1,4%)
    odtworzony dokładnie, zweryfikowany niezależnie w Pythonie przed implementacją.
  - **Napięcie wspólne (Vmp) wpisywane ręcznie** — źródło używa jednej, uśrednionej wartości
    (40V) w swoim przykładzie, ale nie podaje jej jako osobnego pola wejściowego w Sekcji A (tam
    są tylko moc i Imp per panel); próba wyprowadzenia Vmp z P/I każdego panelu osobno (36,36V i
    36,67V) i zsumowania ich jak w prawdziwym obwodzie szeregowym daje INNY wynik niż przykład
    źródła (657W, nie 720W) — sprawdzone w Pythonie. Źródło używa uproszczonego modelu z jedną
    wspólną wartością, więc ta wartość musi pochodzić z zewnątrz (wpisana ręcznie), nie być
    zgadywana ani wyprowadzana przez "poprawniejszą" fizykę, która akurat nie pasuje do przykładu.
  - Twardy próg (Sekcja C: "🔴 różnica mocy paneli >10-15%") zaimplementowany jako trójstopniowe
    kubełkowanie z użyciem OBU podanych granic (< 10% zielone, 10-15% żółte, >15% czerwone) —
    zakres źródła wykorzystany w całości, nie zawężony do jednej wymyślonej liczby. Przykład
    źródła ma różnicę mocy 17,5% → poprawnie ląduje w czerwonej strefie.
  - Sekcja C osobno wspomina "strata może sięgać nawet 18% wg dawnej analizy ryzyka 2.41" — to
    inna liczba niż 1,4% obliczone wzorem z Sekcji B dla tego samego przykładu. Źródło samo to
    tłumaczy ("strata rośnie nieliniowo przy większej różnicy") — nie próbowano tego godzić:
    zbudowany tylko dokładny wzór z Sekcji B, druga liczba (18%) to osobna, nieformułowa
    obserwacja źródła, nie została wdrożona jako osobne obliczenie.
  - `lib/core/modules/pv/niedopasowanie-paneli/`, 5 testów, UI: `app/kalkulatory/
    niedopasowanie-paneli/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 384/384 (5 nowych), `pnpm build` czysto,
    Playwright (400W/11A + 330W/9A + 40V → "720 W", "strata: 1,4%", "różnica mocy paneli: 17,5%",
    czerwony werdykt — zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 70)

- **2026-09-04 — Napisano pełną Biblię projektu w kanonicznym formacie GOD BOOK, na wyraźne
  polecenie właściciela projektu ("napisz pełną biblię, żeby projekt odpowiadał w całości
  naszym standardom").** Poprzedzone sprawdzeniem `AKTUALIZACJE.md` w `new-app-standards` (bez
  nowych wpisów od ostatniej synchronizacji tego samego dnia — v2.5 nadal aktualna).
  - **12 nowych plików w repo root** (Część S GOD BOOK, pozycje 1–8 i 10–12; pozycje 9 i 13–14
    już istniały): `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`,
    `02_Dyrektywy_AI_Projektu.md`, `zlote-zasady.md`, `rejestr-decyzji.md` (D1–D19 + Z1),
    `slownik-pojec.md`, `wiedza-surowa.md`, `kontrakty-rdzenia.md`, `mapa-wdrozenia.md`,
    `backlog-poza-v1.md`, `dlug-techniczny.md`.
  - **Decyzja projektowa świadomie podjęta przy migracji: NIE re-transkrybować per-moduł
    specyfikacji wszystkich ~579 funkcji z `docs/zrodla/` do nowych plików Części S (pozycja 9,
    "osobny plik per moduł").** `docs/zrodla/` (materiały źródłowe, już istniało) i
    `docs/rejestr-pokrycia.md` (status/wzór/przykład per ekran, już istniało) już pełnią tę
    rolę merytorycznie — kopiowanie ich treści do równoległych plików byłoby złamaniem I.2
    GOD BOOK ("nie kopiuj treści drugi raz"), nie realizacją Części S. `00_Biblia.md`'s tabela
    dokumentów wprost mapuje te dwie pozycje Części S na istniejące artefakty, zamiast je
    duplikować — udokumentowane jawnie w `00_Biblia.md`, sekcja "Tabela dokumentów", żeby nie
    wyglądało to na przeoczenie przy przyszłym audycie Y.9.
  - **`rejestr-decyzji.md` (D1–D19)** zawiera tylko decyzje **strategiczne/fundamentalne**
    (Krok 4 GOD BOOK — blokujące wiele rzeczy naraz), nie każdą z dziesiątek drobnych decyzji
    implementacyjnych per ekran z tej sesji — te zostają w `docs/memory.md` (rozróżnienie opisane
    wprost w nagłówku `rejestr-decyzji.md`). Bez tego rozróżnienia rejestr D# rozrósłby się do
    setek wpisów i przestał pełnić swoją rolę ("co obowiązuje odtąd w całym projekcie").
  - **`mapa-wdrozenia.md`** zbudowana z aktualnego stanu `docs/rejestr-pokrycia.md` (80 ekranów
    `done` na 04.09.2026) — naprawia przy okazji dryf: metryczka w starym `ZASADY_APLIKACJI.md`
    ("Funkcje z zaimplementowanym kodem: 0") nigdy nie była aktualizowana mimo ~100 zbudowanych
    ekranów — nowy dokument zastępuje statyczną metryczkę żywą tabelą per moduł.
  - **`ZASADY_APLIKACJI.md`/`USTALENIA.md` NIE usunięte** — nagłówek każdego oznaczony jako
    "ZASTĄPIONE — treść zachowana", z jawnym mapowaniem sekcja-po-sekcji do nowych plików w
    `00_Biblia.md`. Zero utraconej treści (Część D GOD BOOK, zasada nienaruszalności).
  - `CLAUDE.md` punktowo poprawiony (odsyłacz z punktu 5 na `00_Biblia.md` zamiast na stare
    pliki), `docs/lista-do-zrobienia.md` zaktualizowana (otwarta decyzja z 03.09.2026 domknięta).
  - Zweryfikowane: żaden plik kodu nie zmieniony w tym kroku (czysto dokumentacyjna migracja),
    `pnpm build`/`pnpm test`/`pnpm lint` uruchomione po migracji dla pewności, że nic się nie
    zepsuło (dokumentacja nie powinna wpływać na kod, ale sprawdzone zgodnie z dyscypliną sesji).

## Decyzje i uzasadnienie (c.d. 71)

- **2026-09-04 — Ekran 6, Moduł 3: "Aerodynamika — napór wiatru i ssanie" (dawne 2.12,
  Wzorzec D) — kolejna znaleziona rozbieżność w przykładzie źródła, tym razem w formule
  fizycznej z realnym stałym współczynnikiem.** Wzór `F = 0,5×ρ×v²×A×Cd` 1:1 ze źródła, `ρ` jako
  gęstość powietrza (1,225 kg/m³) podana wprost jako stała fizyczna.
  - Przykład źródła Sekcji C ("przy 120 km/h na panel działa 350 N") sprawdzony niezależnie w
    Pythonie: dla Cd w podanym zakresie (1,2–1,5) wymagałoby to powierzchni panelu 0,34–0,43 m²
    — nierealistycznie małej (rzeczywiste panele PV to ~1,6–2,6 m²). To rozbieżność wewnętrzna
    źródła (ten sam rodzaj co M3/E17 mismatch, 1,4% vs 18%) — wzór wdrożony dokładnie jak
    podany, test używa self-konsystentnych wartości (2 m², Cd=1,3 → 1769 N), nie wymuszony do
    dopasowania nieodtwarzalnej liczby.
  - Zbudowana tylko siła naporu (parcie na przód panelu). Siła ssania od spodu ("efekt
    skrzydła"), moment wywracający i wymagany balast NIE zbudowane — wymagają geometrii montażu
    (dźwignia od ziemi do środka parcia, typ konstrukcji), której źródło nie podaje jako liczb.
  - `lib/core/modules/pv/napor-wiatru/`, 4 testy, UI: `app/kalkulatory/napor-wiatru/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 388/388 (4 nowe), `pnpm build` czysto,
    Playwright (33,33 m/s / 2 m² / Cd=1,3 → "1769 N", zgodne z wartością referencyjną).

## Decyzje i uzasadnienie (c.d. 72)

- **2026-09-04 — Ekran 22, Moduł 3: "Ochrona stringów (bezpieczniki, diody blokujące)"
  (dawne 2.38, Wzorzec D) — czysty, w pełni dany przykład bez rozbieżności, priorytet ze
  względu na wpisany wprost twardy stop.** Wzór `I_bezpiecznik = 1,25×Isc` — współczynnik 1,25
  podany wprost jako liczba (nie zakres), przykład źródła (Isc→15A) odtworzony dokładnie.
  - Twardy stop dany wprost: przy ≥3 stringach równoległych bez bezpieczników/diod blokujących
    źródło samo oznacza to 🔴 z konkretnym uzasadnieniem fizycznym (prąd wsteczny z pozostałych
    stringów przy zwarciu jednego). Próg (3) i mechanizm w pełni określone, żadnej wymyślonej
    wartości.
  - `lib/core/modules/pv/ochrona-stringow/`, 6 testów, UI: `app/kalkulatory/
    ochrona-stringow/page.tsx`. Dopisany do `docs/rejestr-twardych-stopow.md`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 394/394 (6 nowych), `pnpm build` czysto,
    Playwright (Isc=12A/3 stringi bez zabezpieczeń → "15,0 A", czerwony "Zabronione"; z
    zabezpieczeniem → zielony "Dobrany bezpiecznik" — oba stany zgodne z przykładem źródła).

## Decyzje i uzasadnienie (c.d. 73)

- **2026-09-04 — Ekran 13, Moduł 3: "Symulacja zacienienia i wpływ na diody bocznikujące"**
  (scala dawne 2.23, 2.49, Wzorzec D) — **zbudowany świadomie tylko częściowo (poziom panelu),
  poziom stringu pozostawiony niepoliczony.**
  - Źródło podaje dwa poziomy: strata panelu (1 sekcja→33%, 2 sekcje→66%) i strata CAŁEGO
    STRINGU (przykład: 1 zacieniony panel w stringu 6 paneli → strata stringu 55%+, "zależnie
    od konfiguracji"). Tylko pierwszy poziom ma odtwarzalny wzór — drugi jest jawnie opisany
    przez źródło jako zależny od konfiguracji (topologia MPPT, liczba paneli, okablowanie), bez
    podanego wzoru.
  - Rozpoznanie: "1 sekcja→33%, 2 sekcje→66%" nie jest dowolną liczbą do zgadnięcia — to wynika
    wprost z konstrukcyjnego faktu, że standardowy panel PV (60/72-ogniwowy) ma 3 sekcje ogniw,
    każda z osobną diodą bocznikującą. Zacienienie sekcji uruchamia jej diodę, obniżając napięcie
    panelu o 1/3 przy zbliżonym prądzie → `strata_panelu = sekcje_zacienione/3`. Zweryfikowane
    niezależnie w Pythonie przed implementacją: 1/3=33,3%, 2/3=66,7% — zgodne z zaokrągleniem
    źródła do pełnych procent (33%/66%), nie rozbieżność formuły.
  - Poziom stringu (55%+) świadomie NIE dostał wymyślonego wzoru (np. proporcji liczby paneli) —
    byłoby to naruszenie Dyrektywy #1 (`02_Dyrektywy_AI_Projektu.md`, nigdy nie zgaduj brakującego
    współczynnika/normy). Zamiast tego: opisowa uwaga w `assumptions` wyniku, cytująca wprost
    przykład i zastrzeżenie źródła "zależy od konfiguracji". 🟡 rekomendacja mikroinwerterów przy
    regularnym/częściowym zacienieniu (cross-ref Ekran 18) wpisana do treści ostrzeżeń.
  - `lib/core/modules/pv/zacienienie-diody-bocznikujace/`, 7 testów, UI: `app/kalkulatory/
    zacienienie-diody-bocznikujace/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 401/401 (7 nowych), `pnpm build` czysto,
    Playwright (400W panel, 2 zacienione sekcje, string 6 paneli → "66,7%" straty, "133 W" moc
    rzeczywista, czerwony werdykt z pełnym uzasadnieniem tekstowym — zgodne z oczekiwaniem).

## Decyzje i uzasadnienie (c.d. 74)

- **2026-09-04 — Ekran 14, Moduł 3: "Dopasowanie tablicy PV do falownika"** (scala dawne 2.24,
  2.25, 2.26, 2.27, 2.37, 2.42, Wzorzec D) — **"mega-scalenie" 6 dawnych funkcji w jeden silnik,
  zbudowane świadomie tylko 4 z 6 kryteriów.**
  - Źródło samo mówi "ten ekran już zbudowany i zademonstrowany jako trzeci przykład w tej
    konwersacji" — to odniesienie do demonstracji z ORYGINALNEJ rozmowy specyfikującej projekt
    (przed powstaniem tego repo), nie dowód, że kod istnieje w tym repo. Sprawdzone: nie istnieje
    (`docs/rejestr-pokrycia.md` go nie wymieniał, brak plików `dopasowanie-tablicy-falownika`) —
    zbudowany od zera w tej sesji.
  - Cztery zbudowane kryteria, każde z jawnym wzorem/zakresem ze źródła: (1) napięcie zimowe
    stringu vs limit DC falownika — **wzorzec echo**: `obliczNapiecieStringuZimowego` wyekstrahowany
    z `stress-test-mppt/calculator.ts` (Ekran 5), zamiast duplikowania tego samego wzoru
    `V_max=Voc×(1+β×(Tmin−25))`; (2) napięcie robocze (STC, `Vmp×n`) vs okno MPPT falownika;
    (3) prąd roboczy (`Imp`) vs maks. prąd MPPT; (5+6) współczynnik przewymiarowania DC/AC
    (`P_PV/P_AC`, `P_PV` liczone jako `Vmp×Imp×n` — fizyka P=V×I, nie wpisywane osobno),
    zalecany zakres 1,1-1,3 dla off-gridu 1:1 ze źródła. Kryterium 6 ("ryzyko skrajności") to
    tylko interpretacja tej samej liczby z kryterium 5 (za mało = niewykorzystany potencjał, za
    dużo = przegrzewanie/obcinanie mocy) — scalone, nie osobny wzór.
  - **Kryterium 4 (napięcie startowe w upale) świadomie NIE zbudowane.** Źródłowy przykład
    ("Vmp 35V → w upał spada do 31V") to tylko ilustracja liczbowa, nie definiuje współczynnika
    temperaturowego Vmp — a to inny współczynnik niż β (który dotyczy Voc, użyty w kryterium 1).
    Sekcja A źródła też go nie wymienia jako osobnego pola wejściowego. Zgodnie z Dyrektywą #1
    (nigdy nie zgaduj brakującego współczynnika) — pominięte, udokumentowane w kodzie
    (`calculator.ts` docstring) i tutaj, nie przemilczane cicho.
  - Refaktor `stress-test-mppt/calculator.ts`: wewnętrzna logika `V_max`/`V_string` wyodrębniona
    do eksportowanej `obliczNapiecieStringuZimowego()`, oryginalne 6 testów Ekranu 5 nadal
    przechodzi bez zmian (potwierdza, że refaktor nie zmienił zachowania).
  - Zweryfikowane niezależnie w Pythonie/testach: dwa pełne scenariusze (8 paneli/wszystkie 4
    kryteria OK; 12 paneli z ciaśniejszymi limitami falownika → napięcie zimowe 🔴, MPPT-max i
    prąd i DC/AC osobno przetestowane w kolejnych scenariuszach) — 9 testów.
  - `lib/core/modules/pv/dopasowanie-tablicy-falownika/`, UI: `app/kalkulatory/
    dopasowanie-tablicy-falownika/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 410/410 (9 nowych), `pnpm build` czysto,
    Playwright (12 paneli, Voc=45V/β=-0,3%/Tmin=-25°C/limit falownika 500V → napięcie zimowe
    621V → czerwony "Konfiguracja niedopasowana"; pozostałe 3 kryteria zielone/info w tym samym
    scenariuszu — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 75)

- **2026-09-04 — Ekran 26, Moduł 3: "Straty na złączkach MC4 w praktyce"** (dawne 2.46,
  Wzorzec C z elementami D) — czysta fizyka (prawo Joule'a, `P=n×I²×R`), rezystancja złączki
  jako pole ręcznego wpisu w zakresie źródła.
  - Źródło podaje zakres, nie pojedynczą liczbę: złączka w dobrym stanie 0,5-2 mΩ, luźna/
    zaśniedziała "nawet 10× więcej" — zgodnie z D16 rezystancja jest polem ręcznego wpisu, nie
    ukrytym domyślnym.
  - Przykład źródła (20 złączek, prąd 10A, dobry styk → strata 2W) odtworzony DOKŁADNIE przy
    R=1mΩ (środek zakresu 0,5-2 mΩ), zweryfikowane niezależnie w Pythonie przed implementacją.
  - Przykład "zły styk → nawet 25W" jest z natury przybliżony (źródło samo używa słowa "nawet"
    zarówno dla mnożnika 10× jak i dla wyniku) — przy R=20mΩ (10× górna granica dobrego stanu)
    wzór daje 40W, nie 25W dokładnie. Zgodnie z Dyrektywą #13 (nie naciągaj wzoru do przykładu)
    wzór wdrożony dokładnie jak podany, rozbieżność udokumentowana w kodzie, analogicznie do
    precedensów `napor-wiatru`/`niedopasowanie-paneli`.
  - Progi bucketowania ostrzeżeń (🟢 ≤2mΩ, 🟡 2-20mΩ, 🔴 >20mΩ) to granice zakresu źródła
    (górna granica "dobry stan" i jej 10-krotność), nie wymyślone liczby.
  - `lib/core/modules/pv/straty-zlaczki-mc4/`, 6 testów, UI: `app/kalkulatory/
    straty-zlaczki-mc4/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 416/416 (6 nowych), `pnpm build` czysto,
    Playwright (R=25mΩ, 20 złączek, 10A → "50,0 W" straty, czerwony werdykt z uzasadnieniem
    "realne ryzyko przegrzania/pożaru" — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 76)

- **2026-09-04 — Ekran 16, Moduł 3: "Panele bifacjalne"** (dawne 2.31, Wzorzec D) — zbudowany
  świadomie BEZ współczynnika bifacjalności panelu, tylko na podstawie zakresów % per typ
  powierzchni.
  - Źródło podaje dwie różne liczby dla tego samego zjawiska: współczynnik bifacjalności panelu
    (70-90%, "z bazy komponentów") ORAZ bezpośredni zakres dodatkowego uzysku per typ powierzchni
    (biała membrana 10-20%, jasny beton 8-15%, piasek 10-18%, trawa 3-5%). Źródło NIE podaje
    wzoru łączącego te dwie liczby (np. czy zakres per powierzchnia zakłada już jakiś domyślny
    współczynnik bifacjalności, czy trzeba go dodatkowo mnożyć) — próba wymyślenia takiej formuły
    naruszałaby Dyrektywę #1. Decyzja: użyć TYLKO zakresu per powierzchnia (bezpośrednio
    reprezentuje końcowy efekt), pominąć współczynnik bifacjalności jako osobne pole.
  - Procent dodatkowego uzysku to pole ręcznego wpisu (D16), z podpowiedzią pokazującą zakres
    dla wybranej powierzchni. Przykład źródła ("jasny beton → 12%") odtworzony DOKŁADNIE — 12%
    mieści się w podanym zakresie 8-15% i jest wprost tą samą liczbą co w źródle, nie wymaga
    żadnej dodatkowej weryfikacji Pythonem (to czysta arytmetyka procentowa, nie nowy wzór
    fizyczny).
  - 🟡 ostrzeżenie o niskim zysku na trawie wpisane 1:1 z cytatu źródła ("nie przepłacaj za tę
    technologię, jeśli montujesz na trawie").
  - `lib/core/modules/pv/panele-bifacjalne/`, 5 testów, UI: `app/kalkulatory/
    panele-bifacjalne/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 421/421 (5 nowych), `pnpm build` czysto,
    Playwright (5000 kWh bazowe, jasny beton, 12% → "5600 kWh" całkowitego uzysku, zielony
    werdykt — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 77)

- **2026-09-04 — po wyczerpaniu łatwo buildowalnych ekranów Modułu 3, użytkownik wybrał
  przejście do innego modułu zamiast budowania ekranów czysto informacyjnych.** Sprawdzony
  Moduł 6 (Ogrzewanie) — miał dotąd tylko 1 ekran (COP, wzorzec reprezentatywny). Większość
  z 26 funkcji Części 1 wymaga danych "auto z Modułu 1" (model termiczny budynku, współczynniki
  U, PVGIS) nieobecnych w tym repo — blocked, analogicznie do Modułu 3.
- **Ekran 15, Moduł 6: "Pompy cyrkulacyjne — dobór"** (dawne 5.15, Wzorzec D) — pierwszy nowy
  ekran M6 poza reprezentatywnym wzorcem, w pełni samodzielny (żadnej zależności od "auto z
  Modułu 1").
  - `E = P × h / 1000` to definicja jednostki (kilowatogodzina), nie wymyślony współczynnik —
    porównanie zużycia energii pompy stałoobrotowej (typowo 100-150 W) vs elektronicznej PWM
    (typowo 5-50 W) przy tej samej liczbie godzin pracy.
  - Godziny pracy dobowo to pole ręcznego wpisu (D16) — źródło opisuje profil pracy pompy jako
    "ciągły/sterowany", ale nie podaje wzoru przeliczającego "sterowany" na konkretną liczbę
    godzin (ile dokładnie godzin dziennie pracuje pompa w trybie sterowanym zależy od
    indywidualnej konfiguracji sterownika, nie jest daną fizyczną).
  - Przykład źródła (pompa 45W pracująca 24/7 → 1,08 kWh/dobę; pompa elektroniczna 8W → 0,19
    kWh/dobę) odtworzony DOKŁADNIE przy godzinyPracyDobowoH=24, zweryfikowany niezależnie w
    Pythonie przed implementacją — oszczędność wynosi 82%.
  - `lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/`, 6 testów, UI: `app/kalkulatory/
    pompy-cyrkulacyjne/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 427/427 (6 nowych), `pnpm build` czysto,
    Playwright (45W obecna/8W nowa/24h → "0,89 kWh" oszczędności, "1,08 kWh/dobę" obecna,
    "0,19 kWh/dobę" nowa, "82%" oszczędności, zielony werdykt — zgodne z testem jednostkowym i
    przykładem źródła).

## Decyzje i uzasadnienie (c.d. 78)

- **2026-09-04 — Ekran 14, Moduł 6: "Bufor ciepła — dobór pojemności"** (dawne 5.14, Wzorzec D) —
  drugi nowy ekran M6 poza reprezentatywnym wzorcem, ekran o najprostszym wzorze budowanym w tej
  sesji (jedna stała, jedno mnożenie).
  - Współczynnik 50 l/kW (zalecana pojemność bufora na każdy kW mocy pompy ciepła) podany wprost
    jako pojedyncza liczba w źródle, nie zakres — więc żadnej decyzji D16 tu nie trzeba (w
    przeciwieństwie do większości poprzednich ekranów tej sesji).
  - Przykład źródła (pompa 8kW → zalecany bufor 400l) odtworzony DOKŁADNIE (8×50=400).
  - Dodano porównanie z posiadaną/planowaną pojemnością bufora (analogicznie do wzorca z
    `bojler-cwu`, M2/E2) — 🟡 gdy za mały, informacyjnie gdy wystarczający.
  - `lib/core/modules/ogrzewanie/bufor-ciepla/`, 5 testów, UI: `app/kalkulatory/
    bufor-ciepla/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 432/432 (5 nowych), `pnpm build` czysto,
    Playwright (8kW pompa, 400l bufor → "400 l" zalecanej pojemności, zielony werdykt "bufor
    mieści zalecaną pojemność" — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 79)

- **2026-09-04 — Ekran dodatkowy, Moduł 6: "Ryzyko wyłączenia pompy przy niskim napięciu"**
  (dawne 5.63, Część 2C źródła — "genuinie nowy, odrębny temat off-gridowy", nie ma numeru w
  sekwencji Ekranów 1-20 Części 1) — pierwszy bezpieczeństwo-krytyczny (twardy stop 🔴) ekran
  Modułu 6.
  - Wybrany zamiast innego kandydata z tej samej sekcji źródła (5.42, wymiarowanie kolektora
    gruntowego) — sprawdzony i odrzucony: przykład źródła (pompa 8kW → 400m² kolektora
    poziomego) jest niereprodukowalny z podanym zakresem (60-120 m²/10kW → dla 8kW oczekiwano by
    48-96 m², nie 400 m² — rozbieżność 4-8×, zweryfikowane w Pythonie), podobnie przykład
    kolektora pionowego (1 odwiert 100m dla 8kW, przy podanym zakresie 1m/50-70W wymagałoby
    114-160m) — dwie niereprodukowalne rozbieżności w jednym ekranie, gorszy kandydat niż 5.63.
  - `margines = V_{system} - V_{min,pompy}` — prosta różnica dwóch napięć, żaden wymyślony
    współczynnik. Napięcie systemu przy danym SoC baterii NIE jest tu wyprowadzane z SoC —
    zależy od krzywej rozładowania konkretnej technologii ogniw (specyficznej dla producenta),
    a źródło podaje tylko ilustracyjny przykład ("przy SoC 20% napięcie spada do 44V"), nie
    wzór/krzywą uniwersalną — więc napięcie systemu jest polem ręcznego wpisu (docelowo auto z
    Modułu 4, gdy tryb Live będzie miał dane na żywo).
  - Nowy twardy stop dopisany do `docs/rejestr-twardych-stopow.md`, nowa kategoria "Cieplne /
    systemowe" (pierwsza pozycja tej kategorii).
  - `lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/`, 5 testów, UI: `app/kalkulatory/
    ryzyko-niskiego-napiecia/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 437/437 (5 nowych), `pnpm build` czysto,
    Playwright (min. napięcie pompy 46V, aktualne napięcie systemu 44V → "-2.0 V" margines,
    czerwony werdykt "Pompa się wyłączy" z pełnym uzasadnieniem — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 80)

- **2026-09-04 — Ekran dodatkowy, Moduł 6: "Kocioł elektryczny — porównanie kosztu z pompą
  ciepła"** (dawne 5.33, Część 2A źródła — "Alternatywne źródła ciepła") — czwarty dodatkowy
  ekran M6, wzorzec echo Ekranu 5.
  - Źródło rekomenduje jeden ekran porównawczy (Wzorzec B) dla wszystkich 5 alternatywnych źródeł
    ciepła (kominek z płaszczem wodnym, kocioł elektryczny, grzejniki IR, maty kapilarne, magazyn
    PCM) — ale tylko kocioł elektryczny ma jawnie podaną liczbę do policzenia (COP=1 vs COP=3-4);
    pozostałe 4 są opisowe/jakościowe bez wzoru. Zbudowany tylko kocioł elektryczny jako
    samodzielny kalkulator Wzorzec D, zamiast wymuszać całą piątkę w jeden ekran bez liczb.
  - `E_elektryczna = Q_cieplna / COP` — dokładnie ten sam wzór co Ekran 5 (COP pompy ciepła),
    zastosowany dwukrotnie: raz dla pompy (COP wpisany ręcznie, tak jak w Ekranie 5), raz dla
    kotła (COP=1, sprawność 99% zaokrąglona — różnica 1% pomijalna wobec różnicy 3-4×). Nie
    wyodrębniono osobnej funkcji echo (jak przy `obliczNapiecieStringuZimowego`) — sama operacja
    to jedno dzielenie, zbyt trywialne żeby uzasadniać ekstrakcję.
  - Przykład źródła ("kocioł zużywa 3-4× więcej prądu na kWh ciepła, COP=1 vs COP=3-4") odtworzony
    DOKŁADNIE — przy wpisaniu copPompy=3 lub 4 obliczony mnożnik zużycia wychodzi dokładnie 3×
    lub 4×, zweryfikowane w testach.
  - `lib/core/modules/ogrzewanie/kociol-elektryczny/`, 6 testów, UI: `app/kalkulatory/
    kociol-elektryczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 443/443 (6 nowych), `pnpm build` czysto,
    Playwright (40 kWh zapotrzebowania, COP=3, 1 zł/kWh → "26,67 zł" oszczędności, "3,0× więcej
    prądu" — zgodne z testem jednostkowym i przykładem źródła).

## Decyzje i uzasadnienie (c.d. 81)

- **2026-09-04 — Ekran 12, Moduł 6: "Infiltracja powietrza (test szczelności)"** (dawne 5.12,
  Wzorzec D) — piąty dodatkowy ekran M6, druga fizyka termiczna po `bojler-cwu` (M2/E2, ciepło
  właściwe wody) — tym razem ciepło właściwe i gęstość powietrza.
  - `Q = n×V×ρ×cp×ΔT/3600` — strata ciepła przez wymianę powietrza (n wymian/h × kubatura ×
    gęstość powietrza × ciepło właściwe powietrza × różnica temperatur). ρ=1,2 kg/m³,
    cp=1005 J/(kg·K) to uniwersalne stałe fizyczne, nie dane specyficzne dla źródła.
    Współczynnik ρ×cp/3600≈0,335 Wh/(m³·K) odpowiada powszechnie cytowanej w budownictwie
    stałej ~0,33-0,34 Wh/(m³·K) — sprawdzone jako sanity check przed implementacją.
  - Źródło NIE podaje kubatury budynku ani ΔT dla swojego przykładu ("0,8 wymiany/h" bez
    towarzyszących liczb) — nie da się więc dokładnie odtworzyć jego konkretnego wyniku
    liczbowego (w przeciwieństwie do większości poprzednich ekranów tej sesji). Zdecydowano
    mimo to zbudować ekran, bo sam wzór jest niekwestionowaną, uniwersalną fizyką (analogicznie
    do `napor-wiatru`, gdzie też zbudowano wzór mimo niereprodukowalnego przykładu źródła) —
    zweryfikowany niezależnie w Pythonie na wewnętrznie spójnych wartościach testowych.
  - Poprawa "uszczelnienie obniży straty o 8%" (Sekcja C źródła) świadomie NIE liczona — to
    pojedynczy przykład liczbowy, nie ogólny współczynnik przenoszący się na inne budynki.
  - 🔴 ostrzeżenie źródła o ryzyku pleśni przy zbyt szczelnym domu bez wentylacji mechanicznej
    NIE zaimplementowane jako warunek liczbowy — źródło nie podaje progu ACH, od którego zaczyna
    się to ryzyko, tylko stwierdzenie jakościowe.
  - `lib/core/modules/ogrzewanie/infiltracja-powietrza/`, 6 testów, UI: `app/kalkulatory/
    infiltracja-powietrza/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 449/449 (6 nowych), `pnpm build` czysto,
    Playwright (0,8 wym/h, 300m³, ΔT=30K → "2,41 kW" straty, zielony werdykt — zgodne z testem
    jednostkowym: Q=0,8×300×1,2×1005×30/3600=2412W).

## Decyzje i uzasadnienie (c.d. 82)

- **2026-09-04 — Ekran 3, Moduł 6: "System wentylacji z odzyskiem ciepła"** (scala dawne 5.3,
  5.23, 5.24, Wzorzec D) — siódmy dodatkowy ekran M6, wzorzec echo `infiltracja-powietrza`
  (M6/E12).
  - Źródło scala 3 dawne funkcje w jeden ekran (bilans podstawowy 5.3, projekt strumieni per
    pomieszczenie 5.23, bypass letni 5.24) — zbudowany TYLKO bilans podstawowy (5.3), jedyny z
    trzech mający jawny wzór fizyczny. 5.23 wymaga tabeli wymaganych strumieni per typ
    pomieszczenia (łazienki/kuchnia = wywiew, sypialnie = nawiew — reguła jakościowa, nie liczba)
    i danych z modelu 3D budynku; 5.24 to logika sterowania (automatyczny bypass w nocy) bez
    progu liczbowego. Oba świadomie pominięte, udokumentowane w kodzie.
  - `Q_odzysk = V̇×η×ρ×cp×ΔT/3600` — dokładnie ten sam wzór fizyczny co Ekran 12 (infiltracja),
    tu pomnożony przez sprawność rekuperatora zamiast liczony jako czysta strata. Nie
    wyodrębniono osobnej funkcji echo — obie implementacje różnią się tylko jednym czynnikiem
    (η) i różnym kontekstem (odzysk vs strata), a duplikacja jednej krótkiej linijki arytmetyki
    nie uzasadnia ekstrakcji (analogicznie do decyzji przy `kociol-elektryczny`).
  - Przykład źródła (centrala 250 m³/h, sprawność 85%, ΔT dorozumiane z "−10°C" → odzysk 2,1 kW)
    odtworzony PRZYBLIŻONYM dopasowaniem: przy założeniu 20°C wewnątrz (typowa temperatura
    komfortu, nie podana explicite w źródle dla tego przykładu) ΔT=30K, wzór daje 2,14 kW —
    różnica 0,04 kW to zaokrąglenie źródła, nie rozbieżność wzoru. Zweryfikowane niezależnie w
    Pythonie przed implementacją.
  - Stały pobór wentylatorów (50-100 W, zakres ze źródła, D16) raportowany OSOBNO — nie
    odejmowany od odzyskanego ciepła, bo to dwie różne domeny (elektryczna vs cieplna), zgodnie
    z tym, jak źródło samo je rozdziela ("dolicza się do bilansu elektrycznego").
  - `lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/`, 6 testów, UI: `app/kalkulatory/
    wentylacja-odzysk-ciepla/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 455/455 (6 nowych), `pnpm build` czysto,
    Playwright (250 m³/h, 85%, ΔT=30K, pobór 70W → "2.14 kW" odzysku — zgodne z testem
    jednostkowym i przybliżeniem przykładu źródła).

## Decyzje i uzasadnienie (c.d. 83)

- **2026-09-04 — po wyczerpaniu łatwo buildowalnych ekranów Modułu 6, użytkownik wybrał
  przejście do innego modułu (opcja 1: kolejny moduł, nie ekrany informacyjne, nie zatrzymanie).**
  Sprawdzony Moduł 8 (Bezpieczeństwo) — miał dotąd tylko 1 ekran (audyt pożarowy, wzorzec G,
  dane demonstracyjne). Ten moduł jest cross-cuttingowy (zbiera funkcje z rozdziałów źródła 6,
  11, 12) — większość ekranów to "sprzęt + logika AI" scalone, gdzie warstwa AI to sekwencje
  sterowania bez progu liczbowego (np. Ekran 4 gaszenie, Ekran 7 ewakuacja adaptacyjna) — blocked
  dla warstwy AI, ale warstwa sprzętowa bywa policzalna.
- **Ekran 6, Moduł 8: "UPS krytyczny — sprzęt i zarządzanie AI"** (scala dawne 11.54, 12.54,
  Wzorzec D) — pierwszy nowy ekran M8 poza reprezentantem, zbudowana TYLKO warstwa sprzętowa
  (11.54, "dobór sprzętowy"), warstwa AI (12.54, zarządzanie priorytetami przy rozładowaniu)
  świadomie pominięta — to reguła sterowania ("najpierw centrala i ESP32, potem router, na
  końcu siłowniki"), nie próg liczbowy do policzenia.
  - **Podwójny wzorzec echo** — rzadki przypadek łączący dwa wcześniejsze wzorce w jednym
    ekranie: (1) checklist urządzeń z edytowalną mocą i sumowaniem zaznaczonych, identyczny wzór
    co `systemy-podtrzymania-zycia` (M2/E1); (2) formuła czasu podtrzymania `t=(C_Ah×V×η)/P`,
    identyczna z trybem "runtime" już istniejącym w `kalkulatory-pomocnicze` (M2/E16) — sprawność
    domyślna (0,92) zaimportowana wprost z tamtego modułu (`EFFICIENCY_DEFAULT`), nie
    zduplikowana liczba.
  - Źródło NIE podaje mocy żadnego z 5 domyślnych urządzeń (ESP32, router, siłowniki, centrala
    pożarowa, oświetlenie awaryjne) — w przeciwieństwie do `systemy-podtrzymania-zycia`, gdzie
    część miała domyślne W. Wszystkie pola tu wymagają ręcznego wpisania.
  - Źródło nie podaje konkretnych liczb dla swojego przykładu ("Czas podtrzymania: 45 minut" bez
    towarzyszącej pojemności/poboru) — nie da się go dokładnie odtworzyć, ale to ten sam,
    już zweryfikowany wzór z M2/E16, więc nie wymagało nowej weryfikacji w Pythonie.
  - `lib/core/modules/bezpieczenstwo/ups-krytyczny/`, 6 testów, UI: `app/kalkulatory/
    ups-krytyczny/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 461/461 (6 nowych), `pnpm build` czysto,
    Playwright (5 urządzeń zaznaczonych, moce 5/10/15/10/10W=50W łącznie, 20Ah/12V → "4.42 h"
    podtrzymania — zgodne z testem jednostkowym: t=20×12×0,92/50=4,416h).

## Decyzje i uzasadnienie (c.d. 84)

- **2026-09-04 — Ekran 2, Moduł 8: "Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym"**
  (dawne 6.25, Wzorzec D) — drugi dodatkowy ekran M8, trzy niezależne twarde stopy w jednym
  ekranie.
  - Minimalna odległość 40 cm od materiałów palnych — źródło formułuje to jako stanowczy wymóg
    ("Piec na drewno wymaga minimum 40 cm..."), nie jako liczbę przypisaną tylko do jednego
    przykładu — potraktowane jak dana norma, analogicznie do "1,25×Isc" (M3/E22) czy "50 l/kW"
    (M6/E14): pojedyncza podana liczba, nie zakres wymagający D16.
  - Dwa pola boolowskie (nawiew powietrza do spalania, czujnik CO) zaprojektowane z domyślną
    wartością `false` — świadoma decyzja zgodna z zasadą UI_GUIDE §5 ("dane wpływające na
    bezpieczeństwo nie mogą być ukryte jako wartość domyślna 'tak'"): użytkownik musi aktywnie
    potwierdzić obecność zabezpieczenia, inaczej ekran domyślnie pokazuje najgorszy scenariusz.
    To odstępstwo od wcześniejszego wzorca `ochrona-stringow` (który też ma `boolean` domyślnie
    `false`), więc nie nowy wzorzec — potwierdzenie już ustalonej konwencji.
  - Rozważono i odrzucono wariant z `boolean | null` (jak `deltaTK` w innych ekranach) — dla pól
    bezpieczeństwa `false`-jako-brak-potwierdzenia jest bezpieczniejszym stanem początkowym niż
    "jeszcze nie wiadomo", więc `null` nie daje tu żadnej dodatkowej wartości.
  - Wszystkie trzy warunki (odległość, nawiew, czujnik CO) dopisane do
    `docs/rejestr-twardych-stopow.md`, sekcja "Elektryczne / pożarowe".
  - `lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/`, 6 testów, UI: `app/kalkulatory/
    dogrzewanie-paliwem-stalym/page.tsx`.
  - Zweryfikowane: `tsc`/`lint` czysto, `pnpm test` 467/467 (6 nowych), `pnpm build` czysto,
    Playwright (drewno, 30cm, brak nawiewu, brak czujnika CO → "-10 cm" margines, czerwony
    werdykt ze wszystkimi trzema ostrzeżeniami — zgodne z testem jednostkowym).

## Decyzje i uzasadnienie (c.d. 85)

- **2026-09-05 — Pełna weryfikacja i korekta Załącznika B normy PN-HD 60364-5-52** (tabele
  obciążalności prądowej, str. 33-58, 26 stron). Kontekst: właściciel projektu zapytał wprost
  "czy napewno nie ma więcej błędów z tego dokumentu przy przeniesieniu?" po tym, jak wcześniejszy
  spot-check (jedna strona, Tablica B.52.4) już znalazł 3 błędy OCR. Odpowiedź uczciwa: nie było
  pewności — tylko 1 z 26 stron była sprawdzona. Wykonano pełną wizualną weryfikację (5 równoległych
  agentów, każdy porównujący bezpośredni odczyt renderu strony z tekstem OCR, komórka po komórce,
  nie tylko cyfra po cyfrze — instrukcja wprost mówiła "sprawdź czy któraś kolumna/wiersz nie
  zniknął w całości").
  - Wynik: **~35 błędów** w `docs/zrodla/norma-PN-HD-60364-5-52/zalacznik-B-tablice-obciazalnosci.md`,
    naprawionych bezpośrednio w pliku. Klasy błędów, od najgroźniejszej: (1) **całe kolumny cicho
    pominięte** w niektórych wierszach (Tablice B.52.6, B.52.8 — brakowała cała środkowa/ostatnia
    kolumna dla najmniejszych przekrojów 500V, bez żadnego śladu że coś zginęło); (2) **cały
    wiersz danych całkowicie brakujący** (Tablica B.52.20, Drabinki/Stykające się, wiersz "3") i
    jeden wiersz nieodzyskiwalny z samego OCR (ta sama tabela, inny wariant) — oba odtworzone z
    obrazu; (3) **strukturalne uszkodzenie całych tabel** (Tablica B.52.1 — wykaz metod
    referencyjnych A1-G, oraz Tablice B.52.16/B.52.17 — współczynniki poprawkowe) na tyle
    poważne, że przepisano je w całości ręcznie zamiast łatać punktowo; (4) pojedyncze błędnie
    odczytane cyfry (`2,5`→`28`, `13,5`→`13:95`, `77`→różne śmieci, `BD`→`75`, `144`→`77`,
    `144`→`77`, `22`→`32`), część z nich w komórkach o realnym znaczeniu bezpieczeństwa (prąd
    dopuszczalny kabla).
  - **Wniosek procesowy, ważniejszy niż same poprawki:** jeden spot-check nie wystarcza do
    stwierdzenia "OCR jest OK poza paroma cyframi" — najpoważniejsze błędy (brakujące
    kolumny/wiersze) są **niewidoczne** bez sprawdzenia każdej strony osobno, bo nie wyglądają
    jak błąd (nie ma "podejrzanego" znaku do zauważenia, po prostu liczby których miało być 7
    jest 6). Zapisane jawnie w `docs/zrodla/norma-PN-HD-60364-5-52/00-INDEKS.md` jako
    zaktualizowane zastrzeżenie: Załącznik B jest teraz w pełni zweryfikowany, **reszta dokumentu
    (Załączniki A, C, E, F, G, H, I, ZA-ZC) nadal nie jest** — nie ekstrapolować "to OCR jest
    dobre" na resztę pliku bez analogicznej pełnej weryfikacji, gdy przyjdzie ich używać.
  - Zweryfikowane po korekcie: `tsc --noEmit`/`pnpm lint`/`pnpm test` (docs-only change, bez
    wpływu na kod aplikacji — sprawdzone przed poprzednim commitem tej normy, nie powtarzane po
    tej korekcie, bo zmiana dotyczy tylko treści markdown w `docs/zrodla/`, poza zasięgiem
    typecheck/testów).

- **2026-09-05 — Dodano i przeanalizowano drugą normę: PN-HD 60364-5-54:2010** (uziemienia,
  przewody ochronne, przewody połączeń ochronnych) — dostarczona przez właściciela projektu tą
  samą drogą co 5-52 (plik przesłany bezpośrednio do sesji, nie przez git tym razem). W
  odróżnieniu od 5-52 (skan + OCR), **ten dokument to natywny tekst PDF** (38 stron, 0 stron
  wymagało OCR) — brak ryzyka błędnie odczytanych cyfr, jedyna niedoskonałość: ekstrakcja tekstu
  spłaszcza układ kolumn tabel wielokolumnowych (grecka ρ bywa odczytana jako łacińskie "r").
  Wszystkie tabele/wzory i tak zweryfikowane wizualnie względem renderu strony, żeby uniknąć
  błędnego przypisania wartości do kolumn — nie z powodu wątpliwej jakości źródła, tylko dla
  pewności co do struktury.
  - Podzielony na 13 plików w `docs/zrodla/norma-PN-HD-60364-5-54/` (indeks:
    `00-INDEKS.md`) — struktura wg klauzul normatywnych (541-544) i załączników (A, B, ZA, ZB,
    ZC, ZD), nie ściśle wg granic stron (klauzule normatywne swobodnie przechodzą między stronami
    źródła, w przeciwieństwie do 5-52 gdzie każda tabela to osobna strona).
  - Zawiera bezpośrednio przydatne dla przyszłych kalkulatorów: wzór doboru przekroju przewodu
    ochronnego S=√(I²t)/k (543.1.2, Tablica 54.3) + tablice współczynnika k dla różnych
    materiałów/izolacji (Załącznik A, Tablice A.54.1-A.54.6) + minimalne wymiary uziomów
    (Tablica 54.1) + orientacyjna rezystywność gruntu (Załącznik ZA, Tablice ZA.54A/B).
  - **🔴 Znaleziona i jawnie odnotowana rozbieżność (nie rozstrzygnięta samodzielnie):** główny
    tekst 543.1.3 podaje minimalny przekrój przewodu ochronnego z aluminium chronionego
    mechanicznie jako 16 mm², ale **Załącznik ZC (normatywny dla Polski)** zmienia tę wartość na
    10 mm² dla instalacji w Polsce. Odnotowane w
    `docs/zrodla/norma-PN-HD-60364-5-54/zalacznik-ZC-szczegolne-warunki-krajowe.md` i
    krzyżowo w pliku 543 — przy pisaniu kodu kalkulatora dla polskiego profilu regionalnego
    stosować wartość z Załącznika ZC (10 mm²), z komentarzem w kodzie odsyłającym do źródła
    rozbieżności, zgodnie z zasadą "nie rozstrzygaj konfliktu cicho" (`praca_ai_z_teoria.md`,
    rozdz. 15 standardu).
  - Status: przeanalizowany, jeszcze niewykorzystany w kodzie. Nie sprawdzono, który konkretny
    ekran/moduł był dotąd blokowany brakiem tej normy (w przeciwieństwie do 5-52, gdzie blokada
    M5/E1, M11/B5, M4/E25 była już wcześniej udokumentowana w `backlog-poza-v1.md`) — do
    ustalenia względem Biblii projektu przy właściwej implementacji.

## Decyzje i uzasadnienie (c.d. 86)

- **2026-09-05 — Dodano trzy kolejne pliki: PN-IEC 60364-4-41:2000, PN-IEC 60364-4-43:1999,
  materiał branżowy "Bezpieczeństwo instalacji fotowoltaicznych" 2019.** Kontekst: właściciel
  projektu dostarczył je po rozmowie o tym, jakich norm jeszcze brakuje (4-41 i 4-43 były wcześniej
  wskazane jako przydatne, bo cytowane wielokrotnie wewnątrz normy 5-54).
  - **Nowy format źródłowy: pliki `.doc` (Word 95/97 binarny), nie PDF.** LibreOffice/`soffice`
    odmówił ich otwarcia ("source file could not be loaded") — zainstalowano `antiword` i `wv`
    (pakiet `wv`/`wvHtml`) jako alternatywne narzędzia do starych binarnych `.doc`. Kodowanie
    plików to cp1250 — antiword wymaga jawnego podania mapy znaków (`-m 8859-2.txt` albo
    `-m cp1250.txt`), inaczej polskie znaki wychodzą jako mojibake (`bezpieczeñstwa` zamiast
    `bezpieczeństwa`). Zapamiętane jako nowy wzorzec narzędziowy obok już znanego OCR-dla-skanów.
  - **🔴 Znalezisko krytyczne w PN-IEC 60364-4-41 — Tablice 41A i 41B fizycznie nie istnieją w
    tym pliku.** Dokument to jawnie oznaczony "(Wyciąg)" (excerpt), nie pełny tekst normy. Miejsce,
    gdzie w oryginale byłaby treść tych tablic (czasy wyłączenia zasilania wg napięcia, układy
    TN/IT), jest po prostu puste — sprawdzone dwiema niezależnymi metodami konwersji (`antiword`
    tekstowo, `wvHtml` strukturalnie z odzyskaniem 4 osadzonych obrazów WMF) — żadna nie znalazła
    tych tablic ani jako tekstu, ani jako obrazu, ani jako uszkodzonego placeholdera. Świadomie
    **nie uzupełniono tych wartości z pamięci/wiedzy ogólnej**, mimo że są to dobrze znane,
    standardowe wartości branżowe (Dyrektywa: "nie wymyślaj brakujących danych" — dotyczy też
    "dobrze znanych" wartości spoza aktualnie posiadanego źródła, nie tylko zupełnie nieznanych).
    Zapisane jawnie jako zastrzeżenie w `docs/zrodla/norma-PN-IEC-60364-4-41/00-INDEKS.md` — każda
    przyszła próba zbudowania kalkulatora weryfikującego samoczynne wyłączenie zasilania (Zs×Ia≤U0
    itd.) będzie potrzebować osobnego, kompletnego źródła tych dwóch tablic.
  - **PN-IEC 60364-4-43 był kompletny** — Tablica 43A (współczynnik k dla przewodów roboczych)
    zweryfikowana dwiema niezależnymi metodami ekstrakcji (ASCII-art z antiword vs realna struktura
    `<table>` z wvHtml) z identycznym wynikiem, wysoka pewność. Ta tabela to brakująca połowa
    układanki do wzoru S=√(I²t)/k z Załącznika A normy 5-54 (5-54 miała tylko k dla przewodu
    ochronnego, ta norma daje k dla przewodu fazowego/roboczego — komplet potrzebny do
    interpretacji przypadku, gdy PE jest z innego materiału niż przewód fazowy).
  - **Materiał branżowy PV 2019** (dodatek do "Rynek Elektryczny", nie formalna norma) —
    świadomie oznaczony inną nazwą folderu (`materialy-branzowe-PV-2019/`, nie `norma-*`) żeby nie
    sugerować statusu prawnego normy. Zawiera najobszerniejszy dotąd znaleziony indeks norm
    specyficznych dla PV (43 pozycje) — w tym **PN-HD 60364-7-712** (norma instalacji PV, wcześniej
    tylko domyślana z ogólnej wiedzy, teraz potwierdzona z niezależnego źródła jako realnie
    istniejąca i faktycznie używana branżowo) oraz **PN-EN 61427-1** i **PN-EN 62124** — dwie normy
    specyficznie dla systemów **autonomicznych/off-grid**, których wcześniej nie było na żadnej
    liście w tym projekcie mimo że to dokładnie profil tej aplikacji. Znaleziono też konkretne,
    działające ostrzeżenie do sprawdzenia względem istniejącego kodu: **złącza DC różnych
    producentów (nawet deklarowane "kompatybilne z MC4") są zakazane przez IEC 62548 i
    IEC 60364-7-712:2017** — do sprawdzenia, czy moduł `string-box`/`zlacza-mc4` (Moduł 5) już to
    ostrzeżenie ma, czy trzeba dopisać.
  - Status wszystkich trzech: przeanalizowane, podzielone na pliki, niewykorzystane jeszcze w
    kodzie kalkulatorów.

## Decyzje i uzasadnienie (c.d. 87)

- **2026-09-06 — Dodano cztery kolejne pliki źródłowe: PN-EN 60445:2010, IEC 62109-2:2011,
  UNE-HD 60364-7-712:2017 (wyciąg), materiał szkoleniowy "Aktualne przepisy ochrony
  przeciwporażeniowej".** Kontekst: kontynuacja serii dostarczania norm po rozmowie o brakujących
  dokumentach.
  - **PN-EN 60445:2010** — skan PKN, tylko 16 stron, przeczytany w całości bezpośrednio wizualnie
    (szybsze i pewniejsze niż uruchamianie pełnego pipeline'u OCR dla tak małego pliku — nowy,
    świadomy wybór metody skalowany do rozmiaru dokumentu). Kompletny, zawiera Tablicę 1
    (znakowanie L1/L2/L3/N/PE itd.) — odblokowuje M5/Ekran 20.
  - **IEC 62109-2:2011** — pobrany z pdfcoffee.com, angielski, natywny tekst, 30 stron, w pełni
    kompletny (FDIS — formalnie wersja projektowa do głosowania równoległego, ale merytorycznie
    odpowiada finalnej normie). Obejmuje falowniki multi-mode/stand-alone, nie tylko on-grid —
    bezpośrednio istotne dla systemów off-grid tego projektu. Zawiera konkretne progi liczbowe
    (czasy odłączenia przy prądzie resztkowym, wymagania THD dla fali wyjściowej stand-alone).
  - **🔴 UNE-HD 60364-7-712:2017 — dostarczony jako "najważniejsza brakująca norma dla PV", ale
    plik zawiera TYLKO spis treści i bibliografię (6 stron), żadnej właściwej treści technicznej.**
    Sprawdzone w całości — jawnie oznaczone w samym pliku jako "WYCIĄG". Brakuje dokładnie tego, co
    było potrzebne: 712.41-712.6 (ochrona, dobór materiałów, SPD) i Załącznika B (obliczenie
    U_OC MAX/I_SC MAX dla stringów PV — metoda, której szukaliśmy formalnego źródła dla już
    istniejącego modułu `konfigurator-stringow`). Zapisane jawnie jako praktycznie bezużyteczny w
    obecnej postaci — nie udawać, że problem jest rozwiązany, bo plik "jest" w repo. Jedyna
    wartość: potwierdzona struktura normy i pełna lista norm powołanych (nowe tropy: HD
    60364-4-443, HD 60364-5-551, pełna seria EN 62305/EN 61439, których dotąd nie mieliśmy nawet
    z nazwy).
  - **✅ Materiał szkoleniowy "Aktualne przepisy..." (48 slajdów, nie norma) rozwiązuje krytyczny
    brak Tablic 41A/41B** zgłoszony wcześniej w normie PN-IEC 60364-4-41 — ale z ważnym
    zastrzeżeniem znalezionym przy tej okazji: **stare tablice 41A/41B (z normy z 2000 r.) różnią
    się wartościami i strukturą od aktualnie obowiązującej Tablicy 41.1 (norma PN-HD
    60364-4-41:2009, przywołana Rozporządzeniem Ministra Infrastruktury z 12.03.2009 r.)**.
    Zdecydowano: do nowego kodu kalkulatora stosować Tablicę 41.1 (aktualną), stare tablice
    zachować tylko jako kontekst historyczny w dokumentacji źródła. To jest przykład sytuacji z
    CLAUDE.md ("informacja, która wydaje się nieaktualna") — rozstrzygnięte samodzielnie, bo to nie
    jest sprzeczność do zgłoszenia użytkownikowi, tylko prosta relacja starsza-norma/nowsza-norma z
    jednoznacznie wskazaną datą obowiązywania w samym materiale źródłowym.
  - Wzorzec narzędziowy potwierdzony po raz kolejny: dla krótkich dokumentów (≤20 stron) czytać
    bezpośrednio wizualnie zamiast uruchamiać pełen pipeline OCR — oszczędza czas, ryzyko błędu
    OCR i tak eliminowane przez wizualną weryfikację na końcu.
  - Status wszystkich czterech: przeanalizowane, niewykorzystane jeszcze w kodzie kalkulatorów.

## Decyzje i uzasadnienie (c.d. 88)

- **2026-09-06 — Właściciel projektu przekonwertował dwa wcześniej dostarczone PDF-y na `.docx`
  ("Udało mi się dla ciebie przerobić pliki") — wykorzystane do uzupełnienia, nie powtórzenia
  analizy.** Sprawdzono najpierw, czy wersja `.docx` wnosi coś nowego względem tego, co już
  wyekstrahowano z PDF wizualnie, zamiast automatycznie przerabiać obie analizy od zera:
  - **och_pPp.docx** (materiał o ochronie przeciwporażeniowej) — 14 tabel, ale większość diagramów
    organizacyjnych (schematy blokowe SELV/PELV itd.) skonwertowały się jako puste komórki (to były
    kształty/smart-art w oryginale, nie prawdziwe tabele). Tabele z realnymi danymi (rezystancja
    izolacji, Tablica 54.2, stara tabela czasów wyłączenia dla warunków zwiększonego zagrożenia)
    **potwierdziły dokładnie** to, co już zapisano z odczytu wizualnego PDF — żadnej korekty
    niepotrzebnej, tylko dodatkowa pewność.
  - **PV2019.docx** (dodatek "Rynek Elektryczny" 2019) — tu konwersja wniosła realną wartość: 31
    tabel z czystym, edytowalnym tekstem, w tym **dokładny, numerowany wykaz norm** (wcześniej
    opisany tylko przykładowo, "pełna lista w PDF"). Wydobyto 34 z 43 pozycji z dokładnym numerem i
    opisem — m.in. nową, wcześniej nieznaną pozycję **PN-EN 50565-1:2014** (przewody elektryczne).
    9 pozycji (#2, #6, #10, #13, #17, #27, #29, #33, #37) zgubiło się przy konwersji PPTX→DOCX
    (prawdopodobnie na granicach slajdów) — **odnotowane jawnie jako nieznane, nie zgadywane**.
    Zaktualizowano `docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`: zastąpiono przykładową
    listę norm pełną numerowaną tabelą, doprecyzowano Tabelę 11 (progi mocy mikroinstalacji wg
    IRiESD: ≤3,68kW / 3,68-10kW / 10-40kW, z dokładnymi wymaganiami per próg — wcześniej opisane
    tylko ogólnie).
  - Wzorzec procesowy: kiedy użytkownik dostarcza tę samą treść w innym formacie, **najpierw
    sprawdzić różnicę (diff), nie zakładać z góry ani że nic się nie zmieniło, ani że trzeba
    powtórzyć całą pracę** — tu format `.docx` z zachowanymi tabelami okazał się bardziej
    wiarygodnym źródłem tabel niż odczyt wizualny slajdów PowerPointa (gdzie tabele-z-tekstem są
    czytane bezbłędnie, ale złożone diagramy/smart-art tracą strukturę przy konwersji — odwrotna
    sytuacja niż przy skanach, gdzie to wizualny odczyt jest bardziej wiarygodny niż OCR).

## Decyzje i uzasadnienie (c.d. 89)

- **2026-09-06 — Dodano nowy rozdział 17 standardu: "Przetwarzanie materiałów źródłowych"**
  (`docs/standards/17-przetwarzanie-materialow-zrodlowych.md`), na wyraźną prośbę właściciela
  projektu ("muszę taką instrukcję dać na inną sesję żeby nie zgadywała tego, czego nie pamiętam").
  Spisuje w formie samodzielnej, gotowej do przekazania instrukcji całą metodologię wypracowaną w
  tej sesji przy przetwarzaniu ~10 dostarczonych dokumentów źródłowych (norm PN/IEC/EN/HD i
  materiałów branżowych): rozpoznanie formatu (PDF natywny vs skan, stary binarny `.doc`, `.docx`),
  konkretne narzędzia i komendy per format (pypdfium2, tesseract+pol, antiword z jawną mapą znaków
  `-m 8859-2.txt`, wvHtml+wmf2gd dla obiektów WMF w starych `.doc`, python-docx dla tabel), zasadę
  pełnej weryfikacji strona-po-stronie zamiast spot-checku (z audytu Załącznika B normy 5-52, gdzie
  jeden spot-check nie wykrył ~35 błędów wykrytych dopiero pełnym przejściem), strukturę folderów
  `docs/zrodla/norma-*` vs `materialy-branzowe-*`, oraz rozróżnienie dwóch pozornie podobnych
  sytuacji: "stara/nowa wersja normy z jawnie podaną datą ważności" (rozstrzygnąć samodzielnie) vs
  "realna merytoryczna sprzeczność bez jednoznacznego wskazania" (zgłosić, nie rozstrzygać).
  - Umieszczony w `docs/standards/` (nie lokalnie w `docs/zrodla/`), bo ten folder jest jawnie
    zadeklarowany (`00-INDEKS.md` tego folderu) jako "pakiet wspólny dla wszystkich naszych
    aplikacji" — metodologia ekstrakcji dokumentów źródłowych dotyczy każdej przyszłej apki rodziny,
    nie tylko Offgrid. Zaktualizowano `docs/standards/00-INDEKS.md` (nowy wiersz w spisie) i
    `CLAUDE.md` (licznik rozdziałów 17→18).

## Decyzje i uzasadnienie (c.d. 90) — korekta wpisu 89

- **2026-09-06 — KOREKTA:** decyzja opisana wyżej ("c.d. 89", dodanie rozdziału 17 do
  `docs/standards/`) była **błędem procesowym**, wskazanym przez właściciela projektu ("Nie, musisz
  mi tutaj dać Promt, a twoja propozycję dać jako propozycję dla new standards app według zasad").
  `docs/standards/` to lokalna, **nieautorytatywna** synchronizowana kopia zewnętrznego repo
  `new-app-standards` — nowe reguły uniwersalne nigdy nie wchodzą tam bezpośrednio z tej sesji;
  właściwy kanał to `docs/wklad-do-standardu.md` (surowy materiał zgłoszeniowy, konsolidacja tylko
  w sesji nad `new-app-standards`, Część Y.8 GOD BOOK) — dokładnie to, co ten plik sam o sobie mówi
  w nagłówku, i co przeoczyłem przy poprzednim wpisie.
  - **Cofnięte:** `docs/standards/17-przetwarzanie-materialow-zrodlowych.md` usunięty,
    `docs/standards/00-INDEKS.md` i `CLAUDE.md` przywrócone do stanu sprzed tej zmiany (liczba
    rozdziałów z powrotem 17, bez nowego wiersza w spisie).
  - **Zrobione poprawnie zamiast tego:** dopisany wpis kategorii POMYSŁ NA REGUŁĘ w
    `docs/wklad-do-standardu.md` (opisujący tę samą lukę — brak procedury przetwarzania materiałów
    źródłowych), a pełna treść robocza przeniesiona do
    `docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md` — jawnie
    oznaczona jako "propozycja, nie standard", czeka na sesję nad `new-app-standards`.
  - Zgodnie z zasadą "jawna korekta zamiast cichego nadpisania" (rozdział 14) — wpis 89 pozostaje
    w historii niezmieniony, ta korekta stoi obok niego, nie zamiast niego.

## Decyzje i uzasadnienie (c.d. 91)

- **2026-09-06 — Utworzono `docs/normy-brakujace.md` i odświeżono status norm w istniejących
  dokumentach.** Na prośbę właściciela projektu ("odśwież wszystko i zapisz to wszystko na
  specjalną listę brakujące normy"), po przeglądzie całego stanu `docs/zrodla/` względem
  wcześniejszych rozmów o normach potrzebnych/blokujących kalkulator.
  - **Nowy plik `docs/normy-brakujace.md`** — zbiorcza lista wszystkich norm zidentyfikowanych jako
    potrzebne, ale bez pełnej treści: 🔴 krytyczna (UNE-HD 60364-7-712 pełny tekst — wciąż brak
    Załącznika B z wzorem U_OC MAX/I_SC MAX dla stringów PV), 🔵 spodziewana (Eurokod śnieg
    PN-EN 1991-1-3 — właściciel projektu zapowiedział dostarczenie), 🟡 potrzebne bez aktywnej
    blokady kodu (IEC 62109-1, IEC 61215, IEC 62619, EN 61439 — wcześniej tylko wyjaśnione
    koncepcyjnie), ⚪ zidentyfikowane tylko z nazwy (HD 60364-4-443, HD 60364-5-551 — nowe tropy z
    bibliografii 7-712, w tym 5-551 bezpośrednio istotna dla funkcji 1.19 "Agregat prądotwórczy";
    EN 62305, EN 62852, EN 61427-1, PN-EN 50565-1), ⚫ 9 pozycji z listy PV-2019 nieznanych nawet z
    nazwy (zgubione przy konwersji PPTX→DOCX).
  - **Naprawiony dryf w dokumentacji:** `docs/rejestr-pokrycia.md` (M5/Ekran 1, M11/B5, M4/Ekran 2,
    M4/Ekran 25), `docs/rejestr-twardych-stopow.md` i `docs/lista-do-zrobienia.md` nadal mówiły
    "⚠️ blocked"/"czeka na dostarczenie normy" dla tabel obciążalności kabli, mimo że norma
    PN-HD 60364-5-52 została kupiona i Załącznik B w pełni zweryfikowany już 05.09.2026 (patrz wpis
    wyżej) — to były cztery zapomniane, nieodświeżone statusy, nie świadoma decyzja. Zgodnie z
    Częścią Y.2 GOD BOOK (dryf bez świadomej decyzji naprawia się od razu, nie zgłasza jako
    konflikt) — statusy zmienione na `todo` z jawną notatką "norma już dostępna, do transkrypcji",
    stare wpisy w `docs/lista-do-zrobienia.md` (dziennik dat 09-03/09-04) NIE nadpisane, tylko
    dopisana korekta niżej w tym samym pliku (15.3 "nie usuwaj — oznacz").
  - **Rozróżnienie ważne dla przyszłych sesji:** brak normy źródłowej (`docs/normy-brakujace.md`)
    to inna kategoria niż brak wzoru fizycznego w samym źródle Biblii (np. Moduł 4/Ekran 12, luka
    5–10°C w tabeli Cold C-Rate) — to drugie zostaje `OUT_OF_SCOPE` w kodzie niezależnie od tego,
    ile norm zewnętrznych dostarczy właściciel projektu, bo problem leży w źródle domenowym, nie w
    normie.

## Decyzje i uzasadnienie (c.d. 92)

- **2026-09-06 — Dodano piątą normę tej serii: PN-EN 1991-1-3:2005 (Eurokod 1, obciążenie
  śniegiem)**, dostarczoną przez właściciela projektu na zapowiedź z `docs/normy-brakujace.md`
  ("Śnieg zaraz ci dam"). Skan, 54 strony, przeczytany w pełni wizualnie (6 partii po 10 stron,
  narzędzie `Read` z `pages`) — nie OCR, nie spot-check. Dokument kompletny od okładki po ISBN.
  - **Zawartość kluczowa:** polski Załącznik krajowy NB — mapa 5 stref + Tablica NB.1
    (`s_k = f(strefa, A)`, np. strefa 2 stała 0,9 kN/m², strefa 5 górska `0,93·exp(0,00134A)` z
    minimum 2,0 kN/m²); wzór główny Rozdziału 5 `s = μ·Ce·Ct·sk`; Tablica 5.2 (współczynniki
    kształtu dachu `μ1`/`μ2` w funkcji kąta nachylenia — dokładnie to, czego brakowało dla ekranu
    "Obciążenie dachu śniegiem").
  - **Krzyżowa weryfikacja potwierdzona samoistnie**: mapa polskich stref w Załączniku NB
    (Rysunek NB.1, str. 4) identyczna z mapą w Załączniku C (Rysunek C.13, "Polska", str. 43) —
    ten sam podział na 5 stref, ten sam wzór, dwa niezależne miejsca w tym samym dokumencie,
    zgodne.
  - Dokumentacja: `docs/zrodla/norma-PN-EN-1991-1-3/` (00-INDEKS + 10 plików treści: NA/NB,
    rozdziały 1-3/4/5/6, załączniki A-E), zaktualizowane `docs/zrodla/README.md`,
    `docs/rejestr-pokrycia.md` (ekran "Obciążenie dachu śniegiem" — notatka "ryzyko braku normy"
    zastąpiona odniesieniem do realnego źródła) i `docs/normy-brakujace.md` (pozycja przeniesiona
    z 🔵 spodziewane do sekcji "Pozyskane").
  - Status: przeanalizowana i podzielona, niewykorzystana jeszcze w kodzie kalkulatora.

## Decyzje i uzasadnienie (c.d. 93)

- **2026-09-06 — Zgłoszono pomysł współdzielonej biblioteki norm źródłowych między projektami
  rodziny**, na pytanie właściciela projektu o to, gdzie leżą oryginały vs przerobiona treść, i
  chęć udostępnienia tego przez `new-app-standards` innym projektom. Zgodnie z ustalonym procesem
  (nie edytować `docs/standards/` bezpośrednio — patrz korekta wyżej, wpis 90): utworzono
  `docs/propozycje-do-new-app-standards/biblioteka-norm-zrodlowych.md` — pełny manifest 10 źródeł
  w `docs/zrodla/` (co jest, w jakim stanie weryfikacji, dla kogo uniwersalne, rekomendacja
  kopiowania) — oraz dopisano zgłoszenie w `docs/wklad-do-standardu.md`.
  - Przy tej okazji odnotowany (nie naprawiony — poza zakresem tego zgłoszenia) drobny, nieszkodliwy
    dryf: oryginały PN-HD 60364-5-52 i 5-54 leżą w `docs/zrodla/` bezpośrednio, nie wewnątrz swoich
    folderów `norma-*/` jak wszystkie kolejno dodane źródła — konwencja "oryginał w tym samym
    folderze" ustaliła się dopiero przy trzecim źródle. Flaga zostawiona w manifeście do
    ujednolicenia przy kopiowaniu do wspólnej biblioteki.

## Decyzje i uzasadnienie (c.d. 94)

- **2026-09-06 — Dodano ilustracje maskotki "Bob" dla 6 z 13 kafli pulpitu**, dostarczone przez
  właściciela projektu jako PNG (~2-2,5 MB każdy, wygenerowane obrazy AI). Przeskalowane do maks.
  900px na dłuższym boku i przekonwertowane na WebP (Python/Pillow) — z ~14 MB łącznie do ~900 KB,
  bo w odróżnieniu od norm PDF w `docs/zrodla/` (referencje rzadko czytane) te obrazy ładują się
  przy każdym wejściu na pulpit/stronę modułu.
  - Nowy plik `lib/pulpit/maskotki.ts` — `MASKOTKA_PO_ID_KAFLA` (mapowanie id kafla → ścieżka
    WebP w `public/maskotki-bob/`), ten sam wzorzec fallbacku co `KAFLE_ZE_ZBUDOWANA_IKONA` w
    `components/kafle-ikony/ikona.tsx` (kafel bez wpisu = dotychczasowa ikona SVG/emoji, bez zmian).
  - `app/page.tsx` — kafel z maskotką pokazuje ją (64×64, `object-cover object-top`) zamiast
    ikony SVG/emoji, priorytet: maskotka > animowane SVG > emoji.
  - `app/moduly/[id]/page.tsx` — maskotka jako hero-obraz (h-48, pełna szerokość) nad nagłówkiem
    modułu, gdy dostępna.
  - Pokrycie: Moduł 3 (PV — panele na dachu), 5 (Okablowanie — rozdzielnica, potwierdzone wprost
    przez właściciela projektu), 6 (Ogrzewanie — ogrzewanie podłogowe/pompa ciepła), 7 (Stress-test
    zimowy — bateria w śniegu), 9 (ESP32/sensoryka — warsztat elektroniczny), 11 (Montaż baterii —
    składanie pakietu). Brakuje: 1, 2, 4, 8, 10, 12, 13 (+ opcjonalnie 14 Ustawienia).
  - Zweryfikowane: `tsc`/`lint`(2 nieblokujące warningi `no-img-element`, świadomie zaakceptowane —
    `next.config.mjs` ma `images.unoptimized: true`, `next/image` nic by tu nie zoptymalizował)/
    `test` (496/496)/`build` czyste; `pnpm dev` + zrzuty ekranu Playwrightem (pulpit + Moduł 3) —
    wygląda poprawnie, obraz przycięty sensownie (`object-top`, twarz Boba zawsze widoczna).

## Decyzje i uzasadnienie (c.d. 95)

- **2026-09-06 — Ekran 1, Moduł 5 "Dobór przekroju kabla" (mega-Doradca) zaimplementowany.**
  Odblokowany po dostarczeniu i pełnej weryfikacji normy PN-HD 60364-5-52 (05.09.2026). Był
  jedynym miejscem w źródle wymagającym tej normy — blokował też B5 (Moduł 11) i pośrednio M4/E2
  i M4/E25 (patrz `docs/rejestr-pokrycia.md`, `docs/rejestr-twardych-stopow.md`).
  - `lib/core/modules/okablowanie/dobor-przekroju-kabla/` — silnik: obciążalność bazowa (Tablica
    B.52.2, Cu/Al, PVC, 2 żyły obciążone) × korekta temperatury (B.52.14 powietrze / B.52.15
    grunt, interpolacja liniowa punktów co 5°C) × korekta wiązki (B.52.17 metody C/enclosed,
    B.52.18 grunt) — iteracja po 8 standardowych przekrojach (Cu) / 7 (Al, brak 1,5mm² w normie),
    plus sprawdzenie spadku napięcia. 11 testów, wartości referencyjne policzone niezależnie
    (ręcznie) przed napisaniem testów, nie "sprawdzone przez uruchomienie kalkulatora".
  - **Zakres świadomie ograniczony (decyzja, nie luka):** izolacja PVC przyjęta jako domyślna
    (Sekcja A źródła nie pyta o typ izolacji — PVC ma niższą obciążalność niż XLPE/EPR, więc jest
    zachowawczym wyborem); liczba żył obciążonych = 2 (obwód DC/jednofazowy AC — źródło nie
    rozróżnia dalej). "Sposób ułożenia" (4 opcje źródła) zmapowany na metody referencyjne normy:
    swobodnie→C, w peszlu→B2, w ziemi→D, w wiązce→C+korekta wiązki.
  - **Rozbieżność znaleziona i udokumentowana** (nie ukryta, ten sam wzorzec co Ekran 6 M3
    "aerodynamika wiatru" i Ekran 10 M4 "ochrona przed wilgocią"): źródło produktowe podaje wzór
    spadku napięcia `ΔU=I×R, R=ρ×L/S` (bez ×2), co pomija drogę powrotną prądu i zaniżyłoby
    wynik o połowę. Użyto `R=ρ×2L/S` — ten sam, fizycznie poprawny wzór co już zweryfikowany
    `straty-okablowanie-dc` (M3/E8). Ilustracyjny przykład Sekcji C źródła ("20m/20A/48V/w
    peszlu/35°C → 6mm², spadek 2,1%") nie odtwarza się dokładnie z poprawnego wzoru (daje ok.
    4,9%) — nie wymuszono dopasowania testu do niereprodukowalnego przykładu, testy używają
    własnych, w pełni zweryfikowanych scenariuszy.
  - Osobno: opisany w źródle mnożnik "k3" (korekta sposobu ułożenia) **nie istnieje w tej
    postaci w samej normie** — norma różnicuje sposób ułożenia przez wybór innej kolumny tabeli
    (metoda referencyjna), nie przez wspólny współczynnik. Zaimplementowano wersję zgodną z
    normą, rozbieżność względem uproszczonego opisu produktowego udokumentowana w kodzie.
  - Twardy stop 🔴 z opcji "sprawdź mój przekrój" (user ręcznie wybiera mniejszy przekrój niż
    wyliczone minimum) dopisany do `docs/rejestr-twardych-stopow.md`.
  - Dodany do `lib/pulpit/registry.ts` (Moduł 5, pierwszy ekran na liście). Zweryfikowane:
    `tsc`/`lint`/`test` (507/507)/`build` czyste; `pnpm dev` + zrzuty ekranu Playwrightem (pusty
    formularz, wypełniony 🟡, twardy stop 🔴) — wszystkie trzy stany wizualnie poprawne.
  - **Wciąż nie zbudowane (świadomie, następny krok, nie ten):** B5 (Moduł 11) i M4/Ekran 25 mogą
    teraz reużyć ten silnik jako "echo" — status w `docs/rejestr-pokrycia.md` pozostaje `todo`.

- **2026-09-06 — norma HD 60364-7-712 dodana (`docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf`,
  UNE-HD 60364-7-712:2017 / HD 60364-7-712:2016, "Sistemas de alimentación solar fotovoltaica"),
  przeanalizowana pod kątem przydatności, i użyta do korekty M3/Ekran 22.**
  - **Potwierdzenie bez zmian**: wzór `stress-test-mppt` (M3/E5, `V_max=Voc×(1+β×(Tmin−25))`) to
    dosłownie Załącznik B.1 tej normy (`U_OC_MAX=K_U×U_OC_STC`) — wcześniej "1:1 ze źródła
    produktowego", teraz niezależnie potwierdzone normatywnie.
  - **🔴 Sprzeczność znaleziona i naprawiona na wyraźną prośbę autora ("Przepisz zgodnie z
    normą")**: `ochrona-stringow` (M3/E22) miało wzór `bezpiecznik=1,25×Isc` + sztywny próg
    "obowiązkowe od ≥3 stringów" — oznaczone w kodzie jako "1:1 ze źródła [produktowego]". Norma
    pokazała, że współczynnik 1,25 to Załącznik B.2 (margines `I_SC_STC→I_SC_MAX`, K1min=1,25),
    NIE wzór na dobór bezpiecznika — rzeczywisty dobór to przedział §712.431.102
    `1,1×I_SC_MAX ≤ In ≤ I_MOD_MAX_OCPR` (górna granica z karty katalogowej panelu, nowe pole
    wejściowe `iModMaxOcprA`), a obowiązkowość przy Ns>2 to warunek §712.431.101
    `1,35×I_MOD_MAX_OCPR < (Ns−1)×I_SC_MAX`, nie sztywne "≥3". Przepisano: `CALCULATOR_VERSION`
    1.0.0→2.0.0, wynik zmieniony z pojedynczej liczby na zakres `[inMinA, inMaxA]` + osobny
    twardy stop gdy zakres jest sprzeczny (`inMinA>inMaxA`, ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY).
    Alternatywa kablowa normy (§712.433.101, gdy ochrona niewymagana wzorem przy Ns>2) zgłaszana
    jako ostrzeżenie do weryfikacji osobno w module doboru kabla — nie objęta tym kalkulatorem
    (brak dostępu do Iz stąd). Stary przykład źródła (Isc=12A→15A) nieodtwarzalny pod nowym
    wzorem — testy przepisane na własne, w pełni zweryfikowane scenariusze (ten sam wzorzec co
    M5/E1 i M3/E6 wcześniej w projekcie).
  - **Wzorzec "echo" M5/Ekran 6 (`dobor-bezpiecznika-rozlacznika`) ROZDZIELONY**: reużywał
    `obliczPradBezpiecznikaA` z `ochrona-stringow`, bo oba miały przypadkiem ten sam mnożnik
    1,25×. Norma pokazała, że to dwa różne prawa (margines Isc PV vs. ogólny margines na obwód
    elektryczny) — echo było przypadkowe, nie tym samym wzorem fizycznym. M5/E6 dostał lokalną
    kopię formuły (`obliczPradBezpiecznikaOgolnegoA`), zachowanie i testy M5/E6 bez zmian.
  - **Poza zakresem tej korekty (kandydaci do backlogu, nie budowane teraz)**: temperatura
    odniesienia kabli DC stringów ≥70°C (§712.523.101), dobór kabla na prąd wsteczny przy
    stringach równoległych (§712.433, `Iz≥(Ns−1)×I_SC_MAX`), reguła doboru diody blokującej
    (§712.512.101: napięcie wsteczne ≥2×U_OC_MAX, prąd ≥1,1×I_SC_MAX — brak modułu),
    tabele L_crit/U_w do decyzji o ochronie przepięciowej DC (§712.443, Tabela 712.102/712.534),
    wymóg RCD typu B po stronie AC (§712.530.3.101), etykieta ostrzegawcza PV (§712.514).
  - Zweryfikowane: `tsc`/`lint`/`test` (510/510)/`build` czyste; `pnpm start` + zrzuty ekranu
    Playwrightem (VALID z zakresem 13,75–20,00 A, oraz 🔴 brak obowiązkowego zabezpieczenia) —
    oba stany wizualnie poprawne.

- **2026-09-07 — Audyt GOD BOOK Część N (na żądanie właściciela projektu, "przeprowadź audyt
  według god book"), pełne przejście N.1 przez wszystkie 14 pozycji Części S.** Metoda:
  bezpośrednie sprawdzenie każdego dokumentu (daty "Ostatnia aktualizacja", liczby przeliczone z
  `docs/rejestr-pokrycia.md`, nie z pamięci ani metryczek), nie "na oko wygląda dobrze" (N.1.1).
  - **Znaleziony i naprawiony dryf** (Część Y.2 — błąd, nie świadoma decyzja, więc naprawiony od
    razu, nie tylko zgłoszony): `mapa-wdrozenia.md` i `backlog-poza-v1.md` nie były aktualizowane
    od 05.09.2026 mimo znaczącej pracy w międzyczasie — oba wciąż opisywały M5/Ekran 1 jako
    `⚠️ blocked`/"brak normy", chociaż norma PN-HD 60364-5-52 dostarczona i ekran zbudowany
    06.09.2026. Poprawione: licznik `done` 92→101 (przeliczony bezpośrednio z rejestru), wiersz M5
    (3/29→4/29), M11/B5 przeniesione z `⚠️ Blocked` do `todo` (odblokowane źródłowo, nie brak
    danych). `backlog-poza-v1.md` błędnie nazywał normę "PN-IEC" zamiast "PN-HD" — poprawione.
  - **Znaleziony i naprawiony dryf strukturalny w `docs/zrodla/`**: pełny tekst normy
    HD 60364-7-712 (35 stron, dostarczony 06.09.2026 bezpośrednio na `main`, użyty tego samego dnia
    do korekty `ochrona-stringow`) trafił luzem do `docs/zrodla/` pod nieopisową nazwą pliku
    (`559094399-060364NHDD149-ES.pdf`), zamiast do istniejącego katalogu
    `docs/zrodla/norma-HD-60364-7-712/` (gdzie leżał już 6-stronicowy wyciąg z 05.09.2026, z
    `00-INDEKS.md` jawnie stwierdzającym brak pełnego tekstu). Dokładnie ten antywzorzec, przed
    którym ostrzega GOD BOOK I.3 ("dwa niezależne opracowania tego samego tematu bez wzajemnego
    odesłania") — mój własny proces z 06.09.2026 (analiza pliku → użycie w kodzie) pominął krok
    zarejestrowania go we właściwym miejscu. Naprawione: `git mv` do
    `docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf`, odsyłacze w kodzie
    (`ochrona-stringow/input.ts`, `calculator.ts`) i w tym pliku zaktualizowane, `00-INDEKS.md`
    dostał sekcję "PEŁNY TEKST DOSTARCZONY" (stara analiza wyciągu zachowana jako historia, nie
    usunięta), `docs/zrodla/README.md` i `docs/normy-brakujace.md` zaktualizowane (jedyna pozycja
    🔴 krytyczna przeniesiona do "Pozyskane (historia)").
  - **Znaleziona i naprawiona luka w `slownik-pojec.md`** (C.9 — rośnie od pierwszego użycia):
    OCPR i I_SC_MAX/K1, wprowadzone 06.09.2026, nigdzie zdefiniowane.
  - **TD13 dodane do `dlug-techniczny.md`** (X.4): reguła doboru diody blokującej (§712.512.101)
    świadomie poza zakresem korekty `ochrona-stringow` — przeniesione z `backlog-poza-v1.md`, gdzie
    było błędnie sklasyfikowane jako "cały nieoceniony obszar" zamiast częściowego skrócenia
    istniejącego ekranu (tytuł źródłowy ekranu wprost wymienia "diody blokujące"). Bidirekcyjne
    sprawdzenie `grep "🔎 TD"` ↔ wpisy TD1-TD12 wykonane najpierw — w pełni zgodne, zero sierot.
  - **`kontrakty-rdzenia.md` §4 (wzorzec echo) dopisany**: pułapka "echo z przypadku" — dwie
    funkcje mogą dzielić tę samą liczbę (1,25) bez dzielenia tej samej reguły fizycznej/normatywnej
    (dokładnie przypadek M3/E22↔M5/E6 z dzisiejszej korekty). Zanim wyekstrahujesz echo: sprawdź
    uzasadnienie, nie tylko wartość.
  - **Backlog uzupełniony** o 4 pozostałe pozycje z normy HD 60364-7-712 świadomie poza zakresem
    (alternatywa kablowa, tabele SPD, RCD typu B, etykieta PV) — dotąd tylko w kodzie/na czacie,
    nigdzie skonsolidowane (N.1.2).
  - **Znalezione, NIE rozstrzygnięte samodzielnie (zgłoszone do rozważenia właścicielowi
    projektu, zgodnie z I.1 — nie rozstrzygaj konfliktu sam):**
    - Czy dzisiejsza korekta `ochrona-stringow` (norma + rozdzielenie echo) zasługuje na wpis D20 w
      `rejestr-decyzji.md`? Rejestr nie miał nowego wpisu od D19 (04.09.2026) mimo kilku
      per-modułowych korekt formuł w międzyczasie (wzorzec ρ×2L/S, ta korekta) — dotychczas
      traktowane jako `docs/memory.md`-poziom, nie strategiczne, ale warto potwierdzić, że to
      wciąż właściwa granica.
    - Otwarte pytanie z `docs/lista-do-zrobienia.md` (2026-09-03): poziom ostrzeżenia
      `KROK-POZA-KOLEJNOSCIA` w Black Start (M7/E5) — `warning` czy `critical`? Nieruszane od
      ~10 dni (W.6, kontrola starzenia) — wciąż czeka na decyzję właściciela projektu.
  - Zweryfikowane: `tsc`/`test` (510/510)/`lint` (0 błędów, 2 nieblokujące istniejące ostrzeżenia
    `no-img-element`) czyste po wszystkich poprawkach.

- **2026-09-07 — Oba pytania z audytu Część N rozstrzygnięte przez właściciela projektu ("D20
  wpisuj i podnosić poziom do critical").**
  - **D20 dopisane** do `rejestr-decyzji.md` — wzorzec "echo" (D12) wymaga wspólnego uzasadnienia
    fizycznego/normatywnego, nie tylko wspólnej wartości liczbowej (przypadek M3/E22↔M5/E6).
  - **`KROK-POZA-KOLEJNOSCIA` (Black Start, M7/E5) podniesiony z `warning` na `critical`**
    (`lib/core/modules/stress-test/procedura-black-start/calculator.ts`, `CALCULATOR_VERSION`
    1.0.0→1.1.0). Dotyczy tylko tego ekranu — ten sam kod ostrzeżenia jest niezależnie zdefiniowany
    (nie echo, osobne literały) w kilku ekranach Modułu 11 (`polaczenia-elektryczne`,
    `podlaczenie-bms`, `demontaz-pakietu`, `demontaz-olow`), świadomie NIEZMIENIONYCH — decyzja
    dotyczyła wprost Black Start, nie całego wzorca.
  - **Znaleziony i naprawiony bug przy okazji**: UI (`app/kalkulatory/procedura-black-start/page.tsx`)
    liczyło werdykt bezpośrednio ze `Status` (`VALID_WITH_WARNINGS`→🟡), nie z poziomów
    `result.warnings` (D14) — dokładnie przypadek, przed którym D14 ostrzega. Bez tej poprawki
    podniesienie poziomu na `critical` nie miałoby żadnego widocznego efektu w UI. Naprawione
    (`hasCritical` → 🔴), zweryfikowane zrzutem ekranu Playwrightem (krok 5 zaznaczony przed
    krokiem 2-4 → 🔴 "Zabronione").
  - `docs/rejestr-twardych-stopow.md` (Znane luki) i `docs/lista-do-zrobienia.md` (otwarte pytanie
    z 03.09.2026) oznaczone jako rozstrzygnięte, nie usunięte.
  - Zweryfikowane: `tsc`/`test` (510/510, w tym nowa asercja `level==="critical"`)/`lint`/`build`
    czyste.

- **2026-09-13 — Uzupełnienie praktyczne Modułu 11 (montaż 16S LiFePO4) dostarczone przez
  właściciela projektu i przeanalizowane wg GOD BOOK Część L (moduł Biblii → dokument gotowy do
  implementacji).** Zapisane w całości, niezmienione:
  `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (5 tomów). Cel wprost od właściciela:
  "żeby było wiadomo na bazie czego było robione" — dokument to notatki z realnego montażu, nie
  formalna norma (status jak `materialy-branzowe-*`).
  - **Sprawdzone względem duplikatów (I.2)** — Ścieżka A LiFePO4 (A1-A10) jest już `done` w całości
    (10/10, `docs/rejestr-pokrycia.md`), więc każdy fragment nowego materiału porównany z
    odpowiednim istniejącym ekranem, nie potraktowany jako nowy, nieoceniony obszar.
  - **Pytanie właściciela wprost: czy dioda jest potrzebna przy BMS↔falownik? ODPOWIEDŹ z nowego
    materiału: NIE.** Rezystor pre-charge tak, dioda nie — dokładnie to, co kod już zakłada
    (`obwod-precharge` M4/E7, `podlaczenie-bms` M11/A4 — żaden nigdy nie miał diody w tym miejscu).
    **Ważne rozróżnienie, żeby nie pomylić z inną, niezależną "diodą" w projekcie**: to pytanie o
    diodę BMS↔falownik (blokada wstecznego prądu między równoległymi pakietami) jest CAŁKOWICIE
    INNYM tematem niż TD13 (`dlug-techniczny.md`, dopisane 07.09.2026) — dioda blokująca stringu PV
    wg normy HD 60364-7-712 §712.512.101 (M3/E22, `ochrona-stringow`). Dwie różne diody, dwa różne
    konteksty, żadnego związku poza nazwą.
  - **🔴 Sprzeczność znaleziona, NIE rozstrzygnięta samodzielnie (I.1)**: moment dokręcania
    terminala M6 — kod ma dziś 4-4,5 N·m (1:1 z oryginalnej Biblii v2.0, `moment-dokrecania-srub`
    M4/E11), nowy materiał praktyczny podaje 5-7 N·m zależnie od pojemności ogniwa (dla EVE MB31
    max 6 N·m). M8 zgodne w przybliżeniu. Zgłoszone w `docs/rejestr-pokrycia.md` (wiersz M4/E11),
    czeka na decyzję właściciela — który wzór ma obowiązywać (może zależeć od konkretnego ogniwa,
    więc rozwiązaniem może być rozszerzenie ekranu o wybór ogniwa, nie prosta podmiana liczby).
  - **Drobna rozbieżność, niekrytyczna**: sugerowana startowa wartość UI rezystora pre-charge
    (`PRZYKLADOWA_REZYSTANCJA_OHM=50` Ω) różni się 50× od "typowo 1 Ω" z nowego materiału — pole
    edytowalne, nie ukryty domyślny, więc nie blokuje niczego, ale wartości aż tak różne sugerują
    zależność od wielkości falownika/sposobu przełączania, niewyjaśnioną w żadnym źródle. Zgłoszone,
    nie zmienione.
  - **Genuinie nowa treść, dziś nigdzie niepokryta w kodzie** (kandydaci do rozbudowy A2/A3/A4,
    nie budowane w tej sesji — czysto dokumentacyjny krok na razie):
    - Etap 0: selekcja ogniw (OCV ≤10mV rozstępu, IR testerem AC 1kHz, odrzucenie odstających >20%
      od mediany) i top-balancing przedmontażowy (ogniwa równolegle, zasilacz 3,60V, do ±5mV) —
      kandydat do rozszerzenia A2 lub nowego ekranu przed A2.
    - Dobór busbarów (wymiary, elastyczne vs sztywne) i obalenie mitu "dziurka w środku busbara
      poprawia balansowanie" (rezystancja miedzi pomijalna, jedyna zaleta to wygoda serwisowa) —
      kandydat do A3.
    - Konfiguracja parametrów BMS po podłączeniu (OVP/UVP/napięcie float/próg balansowania,
      konkretne wartości LiFePO4) — dziś A4 kończy się na podłączeniu fizycznym, nie konfiguracji.
    - Tabele przekrojów przewodów (ogniwo↔BMS, BMS↔falownik wg prądu) i dobór złączy oczkowych
      (materiał — miedź cynowana vs mosiądz, wymiary, konkretni dostawcy) — dziś brak odpowiednika
      w Module 11 (M5/E1 `dobor-przekroju-kabla` to inny, ogólny silnik normowy, nie ten sam zakres
      praktyczny).
  - Nie zbudowano żadnego nowego kodu w tej sesji — czysto dokumentacyjny krok (zapisanie źródła +
    cross-referencja), zgodnie z zakresem prośby właściciela projektu. Decyzje o dalszym kroku
    (rozstrzygnięcie sprzeczności momentu, budowa nowej treści) czekają na właściciela.

- **2026-09-13 (kontynuacja) — Ekran A3b, Moduł 11: generator sekwencji montażu (busbary + BMS),
  parametryzowany liczbą ogniw (4S/8S/16S), z miejscem na media per krok.** Realizacja pierwszych
  dwóch pozycji z listy "nowa treść bez pokrycia" z poprzedniego wpisu — na wyraźną prośbę
  właściciela: *"trzeba opracować, żeby nasz poradnik dopasowywał się do 4S,8s,16s"* +
  *"poradnik musi prowadzić dokładnie krok po kroku z pokazaniem zdjęć albo nagrań"*.
  - `lib/core/modules/montaz-baterii/sekwencja-montazu/` — czyste, testowalne generatory
    (`generujPolaczeniaBusbarow`, `generujOkablowanieBms`) uogólniające wzorzec 16S ze źródła
    (2 rzędy, serpentyna) na dowolną parzystą liczbę ogniw. 14 testów, w tym dokładna weryfikacja
    16S względem numeracji źródła (połączenie #8 = przejście między rzędami, `Połączenie 8` w
    źródle — dokładnie się zgadza) — nie tylko własna, niezależna reimplementacja.
  - **Rozróżnienie 1:1 ze źródła vs. logiczne rozszerzenie**: dla 4S/8S/16S `assumptions` mówi
    "1:1 ze źródła"; dla innej parzystej liczby (np. 6S, 10S) — "nie 1:1 ze źródła", bo źródło
    opisuje wprost tylko te trzy wartości. Nieparzysta/za mała (<4)/za duża (>32) liczba ogniw →
    `OUT_OF_SCOPE`, układ dwurzędowy nie ma sensu albo źródło go nie potwierdza — nie zgadywane.
  - **Nowy komponent `components/wzorce/krok-z-media.tsx`** (`KrokZMedia`) — pierwszy w projekcie
    komponent z opcjonalnym slotem na zdjęcie/nagranie per krok. **Ważne: żadne prawdziwe
    zdjęcia/nagrania nie zostały dostarczone** — komponent renderuje jawny placeholder
    ("Miejsce na zdjęcie/nagranie tego kroku — do dodania") zamiast wymyślonego/wygenerowanego
    obrazu (zasada "nie wymyślaj brakujących danych" — to samo dotyczy materiału wizualnego z
    realnego montażu, nie tylko liczb). Gotowy na `media: {typ, url, opis}`, gdy właściciel dostarczy
    prawdziwe pliki — do ustalenia jak (upload, linki).
  - Zarejestrowany w `lib/pulpit/registry.ts` (Moduł 11, po A3). Zweryfikowane: `tsc`/`test`
    (524/524)/`lint`/`build` czyste; `pnpm start` + zrzuty ekranu Playwrightem (16S — 15 połączeń
    busbarów poprawnie ponumerowanych z placeholderami media; 4S — 3 połączenia + 5 przewodów BMS,
    poprawne napięcia 0/3,2/6,4/9,6/12,8V, werdykt 🟢 12,8V; niepoprawna liczba (7, nieparzysta) —
    🔴 z jasnym komunikatem) — wszystkie trzy stany wizualnie poprawne.
  - **Poza zakresem tej sesji (pozostałe punkty z listy "nowa treść"):** selekcja ogniw/
    top-balancing przedmontażowy, konfiguracja parametrów BMS (OVP/UVP/float), tabele przekrojów
    przewodów i złączy oczkowych — wciąż nie zbudowane, `docs/memory.md` (2026-09-13, wpis wyżej).

- **2026-09-13 (kontynuacja) — Sprzeczność momentu dokręcania M6 (M4/E11) rozstrzygnięta przez
  właściciela projektu — decyzja: "Moment dokręcania podamy do wyboru dla kilku popularnych ogniw
  i ich pojemności. Jeśli nie ma Twojego ogniwa, sprawdź w instrukcji producenta albo użyj
  bezpiecznego momentu."**
  - **Rozwiązanie nie wybiera jednej z dwóch sprzecznych wartości — zachowuje obie, poprawnie
    zakresowane** (zasada "nie usuwaj — oznacz", nie "nowsze wygrywa"): `TYPY_OGNIW` w
    `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, 7 pozycji — oryginalne
    4–4,5 N·m z Biblii v2.0 jako opcja "pojemność nieznana" (nie usunięte), 4 nowe pozycje z
    `Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (50-150Ah→5-6, 280Ah/EVE LF280K→6-7,
    EVE MB31→maks.6, większe/M8→8-10), 2 fallbacki "Inne" (M6/M8) z bezpieczną najniższą wartością
    znaną w projekcie dla danego gwintu + dokładnie ta wiadomość, którą podał właściciel.
  - **Żaden inny model/producent nie został wymyślony** — tylko te 5 konkretnych pozycji, które
    faktycznie mają źródło w którymś z dwóch dokumentów. Ktoś z innym ogniwem dostaje "Inne" +
    instrukcję sprawdzenia karty katalogowej, nie zgadywaną liczbę.
  - Implementacja: UI dostał selektor typu ogniwa; wybór podmienia tylko wyświetlany tekst
    momentu dla pasującego gwintu (M6 albo M8) w istniejącym checkliście — id kroków, ich liczba
    i logika VALID/postęp bez zmian, więc 5 oryginalnych testów przeszło bez modyfikacji. 7 nowych
    testów dla katalogu/formatowania (`typy-ogniw.test.ts`).
  - Zweryfikowane: `tsc`/`test` (531/531)/`lint`/`build` czyste; zrzuty ekranu Playwrightem
    (280Ah/EVE LF280K → "6–7 N·m" na kroku M6; "Inne (M6)" → "maks. 4 N·m" + ostrzeżenie
    dokładnie z instrukcji właściciela) — oba stany wizualnie poprawne.

## Mapa orientacyjna

- `docs/rejestr-twardych-stopow.md` — zbiorczy indeks warunków zawsze skutkujących 🔴 (04.3), z odsyłaczami do modułu/ekranu/pliku źródłowego. Dopisz tu nowy twardy stop, gdy kolejny moduł go wprowadzi.
- `docs/normy-brakujace.md` — zbiorcza lista norm/materiałów formalnych, które są potrzebne kalkulatorom, ale których pełnej treści jeszcze nie mamy (w odróżnieniu od `docs/zrodla/`, gdzie leży to, co już mamy). Sprawdź tu, zanim zapytasz właściciela projektu "czy mamy normę X".
- `docs/standards/00-INDEKS.md` — standard wspólny dla rodziny aplikacji (17 rozdziałów), zacznij tu przy pytaniach "jak mamy to robić".
- `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_8.md` — metodologia procesowa (GOD BOOK) — jak prowadzić Biblię projektu; Część Y opisuje relację ze standardem powyżej. `PROMPT_STARTOWY.md` (root) to gotowy tekst startowy sesji wg tej metodologii.
- `docs/lista-do-zrobienia.md` — bieżące zadania, czytaj zaraz po tym pliku na starcie sesji.
- `docs/wklad-do-standardu.md` — tu AI dopisuje z własnej inicjatywy spostrzeżenia warte rozważenia dla całego `new-app-standards` (nigdy nie edytuje repo źródłowego bezpośrednio).
- `ZASADY_APLIKACJI.md` (pełna) / `USTALENIA.md` (skrót) — konstytucja Offgrid, nadrzędna wobec kodu. Pełni rolę "Biblii" tego projektu (GOD BOOK), jeszcze nie zmigrowana do jego kanonicznego nazewnictwa — patrz decyzja wyżej.
- `docs/zrodla/` — materiały źródłowe Offgrid (Biblia, treść 13 modułów, plik scalony, Zasady UX Doradcy) — przeszukiwać tu zamiast pytać użytkownika o ponowne wysłanie.
- `docs/pulpit-i-nawigacja.md` — decyzja o pulpicie adaptacyjnym (13+1 kafli, kolejność, presety onboardingu) — czytaj przed budową ekranu głównego lub menu wewnątrz modułu.
- `lib/pulpit/registry.ts` — jedyne źródło prawdy o 13 kaflach i ich ekranach; dopisz tu nowy ekran, żeby pojawił się w `/moduly/[id]`.
- `components/kafle-ikony/` — animowane SVG ikony kafli pulpitu (na razie 1–7); dopisz tu kolejny `<symbol>` + wpis w `ikona.tsx`, gdy kolejny kafel zostanie zablokowany jako finalny w artefakcie roboczym "Off-Grid Tile Set".
- `app/`, `components/ui/`, `lib/utils.ts` — obecny szkielet Next.js, bez kodu domenowego.
- `CLAUDE.md` — punkt wejścia dla AI, odsyła tutaj i do standardu.

## Moduł 5 — 7 nowych ekranów niezablokowanych (13.09.2026)

[13.09.2026] ✅ DODANO — na polecenie właściciela ("zacznijmy z tych co nic nie blokuje"): zbudowana pierwsza partia ekranów Modułu 5 zidentyfikowanych w audycie jako `todo` (nie `blocked`), buildowalnych bez wymyślania danych. Zaimplementowane: Ekran 2 (SPD), Ekran 4 (Łączenie Cu-Al), Ekran 10 (GSW), Ekran 12 (Analiza zwarciowa), Ekran 16 (Wyłączniki RCD), Ekran 28 (Dobór izolacji kabla), Ekran 29 (Pomiary powykonawcze) — pełny wzorzec plikowy każdy (input/constants/warnings/validation/calculator/testy + UI), zarejestrowane w `lib/pulpit/registry.ts` (Kafel 5) i `docs/rejestr-pokrycia.md`. `tsc --noEmit`/`pnpm test` (584/584)/`pnpm lint`/`pnpm build` — wszystkie czyste po całej partii.

**Świadomie NIE zbudowane w tej partii** (wymagają bazy komponentów albo wzoru nieobecnego w źródle, żeby nie zgadywać — pozostają `todo`, nie `blocked`): Ekran 5 (złącza MC4 — baza producentów), Ekran 9 (uziemienie — brak wzoru rezystywności gruntu w źródle), Ekran 13 (selektywność — baza krzywych wyzwalania), Ekran 18 (IMD — zależny od nierozstrzygniętego Ekranu 11, a próg "50kΩ" źródła jest wprost oznaczony jako "np.", nie normatywny), Ekran 21 (normy i certyfikaty — baza certyfikatów).

**Pułapka znaleziona i naprawiona przy Ekranie 29:** `rezystancjaUziemieniaOhm=0` i `czasZadzialaniaRcdS=0` (konwencja "0 = jeszcze nie wpisano") by pomyłkowo przeszły próg `< 10/30 Ω` i `< 0,4 s` jako fałszywy pass (0 < próg jest matematycznie prawdą). Rozwiązanie: dodane osobne ostrzeżenia `REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA`/`CZAS-RCD-NIEZMIERZONY` (critical) dla wartości 0, sprawdzane przed porównaniem z progiem — nie dotyczy `rezystancjaIzolacjiMohm` (próg ">1MΩ" — 0 naturalnie i poprawnie nie przechodzi progu).

**Powtórzona pułapka typów (już znana z wcześniejszych ekranów, dwa nowe przypadki tej sesji):** `CalcResult.inputs` to `Record<string, number>` — pola string/boolean (np. `material1`/`material2` w Ekranie 4, `uzywanaJakoPrzylaczeOdbiornikow` w Ekranie 10) muszą być pominięte w `inputs`, nie tylko w logice. Złapane przez `tsc --noEmit` uruchamiane od razu po każdym `calculator.ts`, nie na końcu partii.

## Nowy materiał źródłowy — propozycja modułu "Dobór napięcia systemu Off-Grid v3.0" (13.09.2026)

[13.09.2026] ✅ DODANO, decyzja o budowie **wstrzymana na wyraźną prośbę właściciela**. Właściciel
dostarczył pełną specyfikację roboczą nowego modułu — zapisana 1:1, bez zmian, jako
`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md` (indeks: `docs/zrodla/README.md`).
Ustalony proces: (1) zapis jak jest [wykonane] → (2) poprawki [oczekujące] → (3) budowa modułu
[oczekujące]. **Przypisanie do numeru modułu Off-Grid NIEROZSTRZYGNIĘTE** — właściciel wprost
powiedział, że nie wie, gdzie ten moduł najlepiej pasuje; nie decydować samodzielnie.

**Do sprawdzenia na etapie poprawek (zauważone przy zapisie, nierozstrzygnięte, nie naprawiane
samodzielnie — to materiał źródłowy, nietykalny):**
- ~~Tabela C.1 "do 208 A" dla obu kolumn 12V/24V — artefakt kopiowania~~ **[13.09.2026] SPROSTOWANIE:**
  po przeliczeniu to NIE jest błąd — matematyczna koincydencja, poprawna: 2500W/12V = 5000W/24V =
  208,3A dokładnie (bo 5000=2×2500 i 24=2×12). Tabela poprawna, tylko niejasno podpisana (miesza
  "maks. prąd w danym paśmie" z "prąd na granicy poprzedniego pasma"). Mój wcześniejszy wpis w tym
  miejscu był błędny — zostawiony przekreślony, nie usunięty (Zasada 15.4/GOD BOOK "nie usuwaj —
  oznacz").
- Materiał częściowo pokrywa się tematycznie z już istniejącym ekranem `napiecie-systemowe`
  (`lib/core/modules/baterie/napiecie-systemowe/`, M4) — ten nowy materiał go znacznie
  rozszerza (kontekst zastosowania, ogrzewanie, koszty, PV, łączenie pakietów, konwersja 24V→48V).
  Do ustalenia: czy nowy moduł **zastępuje** istniejący ekran, **rozszerza** go, czy to odrębne,
  równoległe ścieżki.
- Etap C (przekroje/prądy/nagrzewanie przewodów) częściowo nakłada się z Modułem 5 (Okablowanie),
  w tym z już zbudowanym `dobor-przekroju-kabla` (M5/Ekran 1, oparty na normie PN-HD 60364-5-52) —
  wzór `P_strat = I²R` w tym materiale jest uproszczony (bez uwzględnienia normy obciążalności),
  do ustalenia czy ma być zastąpiony/uzupełniony przez istniejący silnik normatywny, czy to
  świadomie inny, uproszczony poziom analizy (edukacyjny, nie projektowy).
- Ceny/kursy walut (75,50 USD/szt., 1 USD≈4,00 PLN, ceny VEVOR) są orientacyjne i ulegną
  dezaktualizacji — moduł ma już zaplanowaną opcję "wpisania własnych cen" (punkt 13 w treści),
  co jest zgodne z zasadą "nie wymyślaj/nie zamrażaj twardych danych rynkowych w kodzie".

**[13.09.2026] USTALENIE (potwierdzone z właścicielem):** Etap C tego materiału (wzór
`P_strat=I²R`, tabela nagrzewania przewodów) **nie zostanie zaimplementowany jako nowa logika**.
Zamiast tego przyszły moduł ma wywołać (echo, nie duplikacja):
1. `calculateNapiecieSystemowe` (`lib/core/modules/baterie/napiecie-systemowe/calculator.ts`,
   M4/Ekran 2) — już liczy `I=P/V` dla 12/24/48V i rekomenduje napięcie wg mocy szczytowej. Nic
   nowego do napisania, tylko import + wywołanie z mocą szczytową wyliczoną w nowych Etapach A/B.
2. `calculateDoborPrzekrojuKabla` (`lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator.ts`,
   M5/Ekran 1) — trzykrotnie (dla 12V, 24V, 48V z tą samą mocą) da realny, normatywny (PN-HD
   60364-5-52) przekrój/straty roczne/margines dla porównania — zamiast uproszczonego,
   nienormatywnego `P=I²R` z materiału.

Powód: M4 i M5 działają poprawnie i kompletnie w swoim zakresie — M4 świadomie NIE liczy
przekroju (zapisane w jego własnych `assumptions`), M5 liczy przekrój, ale wymaga 6 dodatkowych
danych wejściowych, których nie ma w M4 ani w tym materiale (długość trasy, materiał, sposób
ułożenia, temperatura otoczenia, liczba kabli w wiązce, dopuszczalny spadek napięcia%). Nowy
moduł ma dostarczyć formularz z tymi 6 polami RAZ i wywołać M5 trzykrotnie (różne V/I na wejściu)
— to jest brakujący element ("nie dograne"), nie brakująca fizyka. Zgodne z zasadą "echo zamiast
duplikowania logiki" (`docs/standards/01-architektura.md`), już stosowaną w tej sesji przy
`analiza-zwarciowa` (M5/E12, echo z `dobor-bezpiecznika-dc`).

Realnie nowa logika do napisania (nieistniejąca nigdzie): Etap A (kontekst+ogrzewanie), Etap B
(kreator odbiorników + analiza jednoczesności/długotrwałości), Etap E (3 kosztorysy), Etap F
(rozpływ prądu w łączeniu równoległym pakietów), Etap G (dobór paneli PV do falownika), Etap H
(pułapka 24V→48V, koszt przejścia).

**[13.09.2026] Zasada nadrzędna potwierdzona przez właściciela dla całego tego modułu:** gdziekolwiek
aplikacja ma już własne, precyzyjniejsze dane/kalkulator niż uproszczenie z tego materiału
źródłowego — **zawsze wygrywa istniejący kalkulator aplikacji**, materiał źródłowy traktowany jako
"pierwsze przybliżenie do zweryfikowania", nie jako ostateczna liczba. Dotyczy to już ustalonego
Etapu C (wyżej) i rozszerza się teraz jawnie na Etap G (patrz niżej).

## Poprawki do modułu "Dobór napięcia" — runda 2 (13.09.2026)

Właściciel dostarczył kartę katalogową JA Solar JAM60D41 LB (zdjęcie, zapisana jako
`docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/`) i podjął decyzje po analizie z rundy 1.

**A.3 (pytanie o ogrzewanie) — USTALENIE:** moduł ma domyślnie **czytać dane o ogrzewaniu z reszty
aplikacji** (Moduł 1 lokalizacja-i-klimat i/lub Moduł 6 ogrzewanie, jeśli użytkownik je już
wypełnił), zamiast pytać od nowa. Opcja "Nie dotyczy" pozostaje zawsze ręcznie wybieralna — dla
kontekstów, gdzie ogrzewanie elektryczne budynku nie ma zastosowania (łódź, kamper, inny obiekt
bez ogrzewania). To jest kolejny przypadek wspólnego stanu wejściowego (nie tylko echo wyniku
obliczenia, jak w Etapach C/G, ale echo DANYCH WEJŚCIOWYCH między modułami) — spójne z ideą
"profilu sprzętu/obiektu użytkownika" ze standardu (`docs/standards/`). Niespójność 80 W/m² vs
zakres 100-150 W/m² w przykładzie A.3 (zgłoszona w rundzie 1) pozostaje otwarta, nie dotyczy tej
decyzji.

**B.3 (długotrwałe obciążenie) — POPRAWKA:** wiersz "Pralka (grzanie wody)" w tabeli B.3 był
błędnie oznaczony jako "Chwilowe obciążenie" mimo czasu pracy 0,5-1h, co wg własnej definicji
sekcji ("odbiorniki pracujące długotrwale = powyżej 30 minut") kwalifikuje się jako
**długotrwałe**. Poprawka do zastosowania przy budowie: Pralka klasyfikowana jako długotrwałe
(wpływ: "przewody muszą być dobrane na prąd ciągły", jak pozostałe wiersze tej tabeli), nie
chwilowe.

**B.2 (analiza jednoczesności) — ZAPROJEKTOWANY ALGORYTM** (materiał źródłowy dawał tylko
przykłady, bez reguły — poniższe jest propozycją do zaakceptowania przed kodowaniem, nie jeszcze
zaimplementowane):
1. Podział zaznaczonych odbiorników na dwie grupy: **bazowe/ciągłe** (lodówka, router, oświetlenie,
   monitoring — działają praktycznie zawsze razem, sumowane bezwarunkowo) i **przełączalne/
   wysokomocowe** (AGD, narzędzia, ogrzewanie — użytkownik włącza je świadomie, mogą, ale nie
   muszą, nakładać się w czasie).
2. `sumaWorstCase = bazowe + Σ(wszystkie zaznaczone przełączalne)` — scenariusz najgorszego
   przypadku (wszystko naraz).
3. Jeśli `sumaWorstCase ≤ mocCiagłaFalownika` → brak możliwego konfliktu, jeden komunikat "OK",
   koniec (unika sprawdzania 2^n podzbiorów, co jest niepotrzebne i nieczytelne dla użytkownika).
4. Jeśli `sumaWorstCase > mocCiagłaFalownika` → konflikt istnieje. Żeby dać użytkownikowi
   praktyczną odpowiedź (nie tylko "masz konflikt"), algorytm:
   - sortuje przełączalne malejąco wg mocy,
   - podaje `nadwyzka = sumaWorstCase - mocCiagła` i zachłannie wskazuje najmniejszy zestaw
     odbiorników (zaczynając od największego), których wyłączenie/nieuruchamianie jednocześnie
     sprowadza sumę poniżej limitu — komunikat w stylu materiału źródłowego
     ("nie uruchamiaj razem: X + Y", zamiast enumerować wszystkie kombinacje).
5. **Waga ostrzeżenia z Etapu B.3:** konflikt między dwoma odbiornikami, które OBA mają
   długotrwały czas pracy (≥30 min, po poprawce wyżej) → `critical` (realne ryzyko przegrzania
   długotrwałego). Konflikt, gdzie przynajmniej jeden jest chwilowy (np. czajnik) → `warning`
   (przejściowe obciążenie, mniejsze ryzyko, ale wciąż warte zgłoszenia).
6. Świadomie POZA zakresem (brak danych źródłowych, nie zgadywane): prąd rozruchowy/inrush
   silników i pomp — źródło podaje tylko moc znamionową, nie prąd rozruchowy, więc nie jest on
   uwzględniany.

**E.4 pkt 1 ("6× więcej miedzi przy 12V") — USUNIĘTE, zastąpione echem z M5.** Sprawdzone: to
twierdzenie nie ma podanego wzoru i po przeliczeniu wygląda na nieprecyzyjne — przy stałym %
dopuszczalnego spadku napięcia wymagany przekrój skaluje się jak 1/V² (bo `%spadek = I×ρ×2L /
(A×V)`, a `I=P/V`, więc `A ∝ P×ρ×2L/(V²×próg%)`) — przejście z 48V na 12V (÷4 napięcia) dawałoby
**~16×** większy przekrój, nie 6×. Ale **ta liczba "16×" TEŻ jest tylko moim ręcznym przeliczeniem
pod jednym konkretnym kryterium (spadek napięcia) — nie jest to wartość do wpisania do kodu.**
Zgodnie z zasadą nadrzędną (wyżej): moduł ma pokazywać **realne wartości z echa
`calculateDoborPrzekrojuKabla`** (M5) dla 12V/24V/48V przy tej samej mocy/długości trasy — ten
kalkulator **już liczy** `przekrojMm2` (rzeczywisty, normatywny) ORAZ `strataRocznaKwh` (roczna
strata energii w kablu, patrz `calculator.ts` M5/Ekran1) — czyli dokładnie to porównanie "o ile
mniejszy spadek napięcia/strata", o które pytał właściciel, **już istnieje gotowe w kodzie**, nic
nowego nie trzeba liczyć. Nowy moduł ma pokazać te trzy wyniki obok siebie (12V/24V/48V), nie
żadną wymyśloną wielokrotność.

**G.1 (brakujące parametry elektryczne panelu) — ROZWIĄZANE.** Karta katalogowa JA Solar
JAM60D41-500/LB (dostarczona, `docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/00-INDEKS.md`)
daje realne wartości: Voc=43,85V, Vmp=36,91V, Isc=14,42A, Imp=13,55A, β(Voc)=−0,250%/°C. Te
zastępują przybliżenie "Voc~50V" z materiału. **Przeliczenie kontrolne** (wzór z
`stress-test-mppt`, założenie Tmin=−25°C spójne z resztą aplikacji): napięcie stringu w mrozie na
panel = 43,85×(1+(−0,0025)×(−25−25)) = **49,33V** (blisko przybliżenia "50V" materiału, więc
wnioski jakościowe Etapu G się nie zmieniają, ale teraz są policzone z realnych danych, nie
zgadywane):
- Model 2 (24V, 8 paneli w szeregu, limit MPPT 500V): string w mrozie = 394,7V → margines 21,1%
  do limitu. STC: 295,3V (w oknie MPPT), moc = 4000W (zgodne z materiałem).
- Model 3 (48V, 2×4, limit MPPT 145V): string w mrozie = 98,7V → margines 32,0% do limitu. STC:
  73,8V (w oknie MPPT), moc = 4000W (zgodne z materiałem).

Wniosek: konfiguracje z materiału (8 szeregowo dla Modelu 2, 2×4 dla Modelu 3) **potwierdzone**
jako bezpieczne, teraz z policzonym realnym marginesem zamiast przybliżenia. Przy budowie: te
wartości mają wejść jako `vocStcV`/`vmpStcV`/`impA`/`betaPctNaC` do echa
`calculateStressTestMppt`/`calculateDopasowanieTablicyFalownika` (M3), nie jako nowa logika w tym
module. Otwarte i nierozwiązane: brak analogicznej karty katalogowej dla 3 falowników VEVOR
(potrzebne realne okna MPPT/prądy do pełnej weryfikacji, dziś tylko z materiału źródłowego).

## Poprawki do modułu "Dobór napięcia" — runda 3: C.3 rozstrzygnięte (13.09.2026)

**C.3 (spadek napięcia 100A/25mm²/3m) — właściciel wybrał opcję A.** Liczba w materiale
("~1,2V, 10% napięcia systemu") zastąpiona rzeczywistym wynikiem tego samego wzoru, którego
materiał używa w C.2 (`R=ρ×2×L/A`, ρ=0,0172):

R = 0,0172×2×3/25 = 0,00413 Ω → U = 100A×0,00413Ω = **0,41V (3,4% z 12V)**, nie 1,2V/10%.

Do zastosowania przy budowie tego fragmentu (Etap C.3, akapit "Ostrzeżenie: Prąd 100A przy 12V"):
zdanie "Spadki napięcia: Przy 100A i przewodzie 25mm² o długości 3m spadek napięcia wynosi ~1,2V
(10% napięcia systemu!)" zamienić na "...spadek napięcia wynosi ~0,41V (3,4% napięcia systemu)".
Reszta akapitu (prąd spawalniczy, nagrzewanie złączek, ryzyko pożaru przy wibracjach) zostaje bez
zmian — to jedyna liczba w C.3 niezgodna z własnym wzorem dokumentu, pozostałe trzy argumenty
ostrzeżenia są poprawne i nie wymagają korekty. Ogólny wniosek akapitu (100A@12V jest niebezpieczne)
pozostaje prawdziwy — opiera się głównie na ryzyku łuku elektrycznego i nagrzewania złączek, nie na
samym spadku napięcia.

**Status pozostałych otwartych punktów z rundy 1:** niespójność 80 W/m² vs 100–150 W/m² w
przykładzie A.3 oraz miejsce/numer modułu w strukturze aplikacji — wciąż nierozstrzygnięte, czekają
na kolejną rundę.

## Poprawki do modułu "Dobór napięcia" — runda 4: A.3 rozstrzygnięte (13.09.2026)

**A.3 (niespójność 80 W/m² vs zakres 100–150 W/m²) — WYKREŚLONE, nie poprawione liczbowo.**
Sprawdzone: w aplikacji **nie istnieje dziś żaden kalkulator liczący moc szczytową ogrzewania z
powierzchni budynku** — Moduł 6 (`lib/core/modules/ogrzewanie/kociol-elektryczny/` i inne) bierze
`zapotrzebowanieCieplneKwh` jako gotowy input, nie liczy go z m²/typu izolacji. Skoro (decyzja z
rundy 2) A.3 ma czytać moc ogrzewania z danych już wpisanych w aplikacji (M2/Ekran 1
`systemy-podtrzymania-zycia`, pole "ogrzewanie" — patrz wątek w tym pliku o luce źródłowej dla tej
kategorii) albo z "Nie dotyczy", to **worked example materiału (100m²×80W/m²=8000W→667A/333A/167A)
nigdy nie stanie się żywą kalkulacją w kodzie** — jest to czysto ilustracyjne ręczne szacowanie,
zdegradowane do roli fallbacku.

**Decyzja:** ten konkretny przykład (i jego niespójna liczba 80 W/m²) **nie jest odtwarzany** przy
budowie modułu. Sama tabela kategorii ogrzewania z Etapu A.3 (zakresy W/m², nie punktowe liczby)
zostaje zachowana wyłącznie jako pomocniczy fallback do ręcznego wpisania mocy, gdy użytkownik nie
ma jeszcze żadnych danych w M2/M6 — jako zakresy (nie konkretne liczby) nie są wewnętrznie
sprzeczne, więc nie wymagają korekty.

**Etap A.3 uznany za w pełni rozstrzygnięty.** Jedyny pozostały otwarty punkt z całej rundy 1-4
poprawek: **miejsce/numer modułu w strukturze 13 modułów aplikacji** (patrz wątek "Nowy materiał
źródłowy" wyżej — właściciel wprost nie wie, gdzie to ma trafić).

## Miejsce modułu "Dobór napięcia" — ROZSTRZYGNIĘTE (13.09.2026)

**Decyzja (propozycja AI, zaakceptowana przez właściciela):** ten materiał **NIE** staje się
nowym, 14. modułem. Zamiast tego **rozbudowuje istniejący Ekran 2 Modułu 4** (Magazyn energii/
baterie) — `lib/core/modules/baterie/napiecie-systemowe/` — z dzisiejszego jednopolowego `I=P/V`
do pełnego Wzorca D "Doradca doboru napięcia".

**Uzasadnienie:**
1. Ekran 2 M4 już jest dokładnie tym samym pytaniem ("jakie napięcie systemu") — to rozbudowa
   istniejącego slotu, nie nowy temat.
2. Wybór napięcia systemu jest z natury decyzją architektury bateryjnej/DC (BMS, falownik,
   topologia) — to charter M4, nie M2 (obciążenia)/M3 (PV)/M5 (okablowanie), które dostarczają
   dane wejściowe przez echo, ale nie są miejscem samej decyzji.
3. M4 ma już sąsiadujące, pokrewne ekrany: `mixing-rownolegle` (blisko nowego Etapu F — rozpływ
   prądu przy łączeniu równoległym pakietów) i `oplacalnosc-magazynu` (blisko Etapu E, kosztorysy).
4. Odrzucony 14. moduł — struktura 13 modułów jest już wpisana wszędzie (`lib/pulpit/registry.ts`,
   `docs/rejestr-pokrycia.md`, GOD BOOK, nawigacja `/moduly/[id]`); dodanie kolejnego modułu dla
   jednego (choć dużego) ekranu byłoby nieproporcjonalną zmianą strukturalną wobec gotowego,
   pasującego slotu.

**Docelowy kształt ekranu** (do budowy w kolejnym kroku, poza zakresem tej sesji poprawek):
sekcje kontekstu (Etap A, echo z M1 lokalizacja-i-klimat / M2 systemy-podtrzymania-zycia dla
ogrzewania), kreator odbiorników + analiza jednoczesności (Etap B, nowa logika wg zaprojektowanego
algorytmu wyżej), rekomendacja napięcia (dotychczasowe `I=P/V`, zachowane bez zmian), echo realnego
przekroju kabla i strat rocznych z `dobor-przekroju-kabla` (Etap C→M5, dla 12V/24V/48V), kosztorysy
(Etap E, nowa logika z cenami edytowalnymi przez użytkownika), ostrzeżenie o łączeniu pakietów
(Etap F, blisko `mixing-rownolegle`), echo doboru PV z `stress-test-mppt`/`dopasowanie-tablicy-falownika`
(Etap G→M3, z realnymi Voc/Vmp/Imp/β z karty katalogowej), pułapka konwersji 24V→48V (Etap H, nowa
logika). Wersja kalkulatora rośnie (np. 2.0.0), stara logia `I=P/V` nie jest usuwana, tylko
osadzona w większym ekranie.

**Wszystkie 4 rundy poprawek do tego materiału są teraz zamknięte.** Kolejny krok to budowa —
osobne zadanie, nie część tej sesji poprawek.

## Budowa modułu "Dobór napięcia" — zakończona (14.09.2026)

Ekran `napiecie-systemowe` (M4/Ekran 2) rozbudowany do wersji 2.0.0 zgodnie z planem wyżej. Rdzeń
`I=P/V` (progi, formuła) **niezmieniony** — wszystkie 8 dawnych testów przechodzi bez modyfikacji
logiki. Nowe pliki w module: `jednoczesnosc.ts` (Etap B.2/B.3), `kosztorys.ts` (Etap E + H.4).
25 testów jednostkowych, wszystkie zweryfikowane ręcznie względem przykładów/tabel źródła.

**Odstępstwo od planu — Etap D świadomie pominięty.** Plan wyżej ("docelowy kształt ekranu") nie
wymieniał Etapu D (rekomendacja oświetlenia 24V vs 230V vs 48V, gniazda DC) — sprawdzone: to
czysto informacyjne tabele źródła, bez żadnego wzoru, więc pominięcie nie jest luką liczącą, tylko
brakiem osobnej sekcji UI. Nie dodane w tej turze (zgodnie z literalnym zakresem planu), do
ewentualnego dopisania jako czysto informacyjna sekcja w przyszłości, bez wpływu na kalkulator.

**Znaleziony i naprawiony błąd w trakcie budowy: liczba ogniw szeregowo ≠ V/3,2V.** Pierwsza wersja
`kosztorys.ts` liczyła `liczbaOgniwSzeregowo = napiecieV / 3.2` (np. 12/3.2=3.75 — niecałkowita,
fizycznie bez sensu). Poprawne: pakiet "12V" LiFePO4 to etykieta handlowa dla 4S (4×3,2V=12,8V
nominalnie), "24V"→8S, "48V"→16S — 1:1 ze źródła (Sekcja E). Naprawione tabelą `{12:4, 24:8, 48:16}`,
wykryte przez test jednostkowy (oczekiwane 16 ogniw dla 16kWh@12V, otrzymane 18,75 — niecałkowita
wartość natychmiast zdradziła błąd). Po poprawce kosztorys 16kWh odtwarza dokładnie tabelę E.3
źródła: 6332/6582/7162 zł (12V/24V/48V, bez przetwornic).

**Znaleziony i naprawiony błąd UI: kolizja klucza React w zbiorczej liście ostrzeżeń.** Ostrzeżenia
z echa `dobor-przekroju-kabla` dla 12V/24V/48V (Etap C) były dołączane do wspólnej listy
`result.warnings`, renderowanej przez `WynikSzczegoly` z `key={w.code}` — gdy DWA napięcia dają to
samo ostrzeżenie (np. `BRAK-PASUJACEGO-PRZEKROJU` przy bardzo dużej mocy i 12V ORAZ 24V naraz),
React dostawał duplikat klucza (wykryte na żywo przez Playwright: `[console] Encountered two
children with the same key`). Naprawione przez tagowanie kodu napięciem przed dołączeniem do
zbiorczej listy (`${w.code}-${v}V`) w `calculator.ts` — ostrzeżenia wewnątrz panelu Etapu C (per
napięcie) zachowały oryginalny kod. Ponowny smoke test: `NO CONSOLE/PAGE ERRORS`.

**Realny, pouczający wynik silnika normatywnego (nie błąd):** przy dużej mocy (np. 4615W) i 12V/24V
Etap C poprawnie zwraca "brak pasującego przekroju" (żaden z dostępnych standardowych przekrojów
do 35mm² nie udźwignie 385A/192A) — dokładnie demonstrując problem, przed którym cały ten ekran ma
ostrzegać, tym razem policzony z prawdziwej normy (PN-HD 60364-5-52), nie z uproszczonego `P=I²R`
materiału źródłowego.

**Weryfikacja końcowa:** `npx tsc --noEmit` czyste, `npx vitest run` 658/658 (105 plików), `pnpm
lint` czyste (2 niepowiązane wcześniejsze ostrzeżenia `<img>`), `pnpm build` bez błędów, smoke test
Playwright (formularz wypełniony przez wszystkie Etapy A-H, brak duplikatów DOM id, brak błędów
konsoli, wartości zgodne z ręcznymi przeliczeniami: kosztorys 6332/6582/7162 zł@16kWh, PV
4000Wp/DC-AC=1.33 dla modelu 24V/8 paneli, koszt konwersji 2250 zł). `docs/rejestr-pokrycia.md`
(M4/Ekran2) i `lib/pulpit/registry.ts` (etykieta kafla) zaktualizowane.

## Moduł 5 — druga partia niezablokowanych ekranów (13.09.2026)

[13.09.2026] ✅ DODANO — kontynuacja pracy nad Modułem 5 po przerwie na poprawki innego materiału.
Zbudowana kolejna partia 7 ekranów zidentyfikowanych jako buildowalne bez zgadywania danych:
Ekran 3 (tylko dolna sekcja — checklist momentów dokręcania szyn zbiorczych; górna sekcja dobór
przekroju szyny wg wytrzymałości zwarciowej pozostaje `todo`, brak wzoru w źródle), Ekran 7 (dobór
mocy falownika), Ekran 11 (uziemienie funkcjonalne vs ochronne), Ekran 14 (wyłączniki nadprądowe
DC), Ekran 15 (ochrona przed odwrotną polaryzacją), Ekran 20 (oznakowanie obwodów), Ekran 26
(optymalizacja trasy i kosztu kabla). Pełny wzorzec plikowy każdy, zarejestrowane w
`lib/pulpit/registry.ts` i `docs/rejestr-pokrycia.md`. `tsc --noEmit`/`pnpm test` (616/616)/
`pnpm lint`/`pnpm build` — czyste.

**Odkrycie przy Ekranie 20 (Oznakowanie obwodów):** treść źródłowa tego ekranu wspomina
kolorystykę żył ("czerwony +", "żółto-zielony PE" itd.) jako rzekomo "wg PN-EN 60445" — **to
nieprawda**. Sprawdzone bezpośrednio w `docs/zrodla/norma-PN-EN-60445/00-INDEKS.md`: ta norma
normuje WYŁĄCZNIE kody alfanumeryczne/graficzne (Tabela 1: +, −, PE, U/V/W, N...), nie kolorystykę
— tę normuje osobna norma (IEC 60446), której nie mamy w projekcie. Zbudowano tylko część
faktycznie potwierdzoną (kody alfanumeryczne), kolorystyka świadomie pominięta z jawną notatką w
kodzie i UI — nie przypisano normie treści, której nie zawiera.

**Pułapka znaleziona i naprawiona przy Ekranie 26 (Optymalizacja trasy i kosztu kabla) —
zweryfikowana w przeglądarce, nie tylko w testach jednostkowych:**
1. Dwa pola `Pole` o identycznym tekście etykiety ("Długość trasy" w Trasie A i B) generowały
   duplikat `id` (auto-generowany z tekstu etykiety w `components/ui/pole.tsx`), co łamało
   powiązanie `label`/`input` dla drugiego wystąpienia — złapane przez Playwright (`getByLabel`
   nie widział drugiego pola), nie przez `tsc`/testy jednostkowe. Naprawione: jawne unikalne `id`
   na każdym polu w sekcjach Trasa A/Trasa B. **Wniosek procesowy:** gdy ekran ma dwa powtórzone
   bloki pól o tej samej etykiecie (porównanie A/B, warianty), zawsze nadawać jawne `id` — nie
   polegać na auto-generowaniu z etykiety.
2. Realny błąd logiczny (nie tylko UI): gdy trasa nie spełnia wymagań przekroju, echo
   `calculateDoborPrzekrojuKabla` celowo zwraca `strataRocznaKwh=0` dla tej trasy (nie liczy
   straty dla niezgodnego przekroju — patrz kod M5/E1, tryb "sprawdź mój przekrój"). Pierwsza
   wersja kalkulatora TCO tego nie uwzględniała i pokazywała niezgodną trasę jako fałszywie
   "tańszą" (bo miała 0 kWh/rok straty). Naprawione: TCO NIE jest liczony/pokazywany, dopóki OBIE
   trasy nie spełniają wymagań przekroju — tylko krytyczne ostrzeżenie wskazujące, którą trasę
   poprawić. Znalezione dopiero przy ręcznym teście w przeglądarce z realnymi liczbami, nie przy
   pisaniu testów jednostkowych (które testowały tylko "zgodny" scenariusz) — potwierdza zasadę
   "kompiluje się ≠ działa" z `docs/standards/10-testy.md`.

**Nadal `todo` w Module 5** (świadomie odłożone — wymagają bazy komponentów/wzoru nieobecnego w
źródle): Ekran 5 (MC4), Ekran 8 (przepust powietrza — tylko jeden punkt danych "szczelina<5cm→70°C",
brak wzoru wiążącego szczelinę z temperaturą), Ekran 9 (uziemienie), Ekran 13 (selektywność), Ekran
17 (ochrona przed dotykiem — treść statyczna, niezbudowana w tej rundzie), Ekran 18 (IMD), Ekran 21
(normy i certyfikaty), Ekran 23 (separacja EMC), Ekran 24 (peszle/koryta/rurki), Ekran 25 (ochrona
przed gryzoniami), Ekran 27 (puszki połączeniowe) — te ostatnie 5 (17, 23–25, 27) są buildowalne
jako proste Wzorce B/C/F (treść porównawcza/referencyjna, dane konkretne w źródle), po prostu
jeszcze nie zbudowane w tej rundzie, nie zablokowane merytorycznie.

## Moduł 5 — trzecia partia: ostatnie 5 niezablokowanych ekranów (13.09.2026)

[13.09.2026] ✅ DODANO — dokończenie prostych Wzorców B/C/F zidentyfikowanych w poprzednim wpisie
jako buildowalne. Zbudowane: Ekran 17 (ochrona przed dotykiem — checklist 2 mechanizmów, źródło
nie podaje twardego stopu dla tego ekranu; "lista IP wg miejsca" NIE zbudowana — brak tabeli
miejsce→IP w treści TEGO ekranu, w odróżnieniu od Ekranu 27), Ekran 23 (separacja EMC — Wzorzec F
bez kalkulatora, jak Ekran 19: treść + ilustracja SVG), Ekran 24 (peszle/koryta/rurki — Wzorzec B,
dopasowanie miejsca montażu do 1 z 4 osłon), Ekran 25 (ochrona przed gryzoniami — "auto z Modułu 1"
zastąpione ręcznym wyborem poziomu ryzyka, M1 nie ma pola "typ terenu"), Ekran 27 (puszki
połączeniowe — Wzorzec B wg lokalizacji; "auto-lista punktów z Ekranu 19" NIE zbudowana, Ekran 19
nie ma modelu danych tras). `tsc --noEmit`/`pnpm test` (631/631)/`pnpm lint`/`pnpm build` — czyste,
zweryfikowane w przeglądarce (Playwright) w tym sprawdzenie duplikatów DOM `id` na każdej stronie
(nauczka z poprzedniej partii, Ekran 26).

**To zamyka wszystkie merytorycznie niezablokowane ekrany Modułu 5.** Pozostałe `todo` (6 ekranów:
5 MC4, 8 przepust powietrza, 9 uziemienie, 13 selektywność, 18 IMD, 21 normy/certyfikaty) wymagają
bazy komponentów albo wzoru nieobecnego w źródle — pozostają świadomie odłożone, nie przeoczone.
Moduł 5: 23 z 29 ekranów **done** (79%).

## B5 (Moduł 11) i M4/Ekran 25 — echo doboru kabli, nowa fizyka podziału prądu (14.09.2026)

[14.09.2026] ✅ DODANO — dwa dawno zidentyfikowane "gotowe do echa" ekrany, wreszcie zbudowane.

**B5 (Moduł 11, Ścieżka B — kwasowo-ołowiowa) "Dobór kabli, bezpieczników i zabezpieczeń":**
`lib/core/modules/montaz-baterii/dobor-kabli-bezpiecznikow-olow/`, 5 testów. Źródło jest
jednoznaczne: *"Dobór kabla nie zależy od chemii baterii, tylko od prądu i długości — ten sam
silnik obliczeniowy co w Module 5, tylko podstawiasz inne liczby."* Zaimplementowane jako czyste
echo dwóch gotowych kalkulatorów: `calculateDoborPrzekrojuKabla` (M5/Ekran 1) dla przekroju,
`calculateDoborBezpiecznikaRozlacznika` (M5/Ekran 6) dla bezpiecznika+AIC — zero nowej logiki
liczącej. Status łączny propagowany funkcją `najgorszyStatus` (ten sam wzorzec co w
`optymalizacja-trasy-kabla`, M5/Ekran 26).

**M4/Ekran 25 "Szyny zbiorcze i połączenia międzypakietowe":** `lib/core/modules/baterie/szyny-zbiorcze-miedzypakietowe/`,
5 testów. Wcześniej oznaczone jako wymagające "dodatkowej logiki ponad echo" — sekcja C źródła
daje tylko ilustracyjne przykłady (spadek "20%", "40% vs 15%") bez wzoru. Rozstrzygnięcie:
problem N gałęzi równoległych do wspólnego węzła ma dobrze znane, **niewymyślone** rozwiązanie —
regułę podziału prądu z prawa Ohma (prąd dzieli się odwrotnie proporcjonalnie do rezystancji
gałęzi), z rezystancją liczoną identycznym wzorem co M5/Ekran 1 (R=ρ×2L/A). Podwójna weryfikacja
ręczna w teście: 2 gałęzie z R_B=3×R_A dają dokładnie 75%/25% (bo I_A/I_total=R_B/(R_A+R_B)=3/4).

**Świadome ograniczenie zakresu M4/E25 (udokumentowane w kodzie, nie ukryte):** model obejmuje
TYLKO topologię gwiazda (każda gałąź niezależnym odcinkiem do wspólnego węzła/szyny). NIE
obejmuje: (a) połączenia kaskadowego — rezystancja sumuje się wzdłuż łańcucha, inna topologia
obwodu (drugi przykład źródła, "4 baterie kaskadowo"); (b) asymetrii punktu zasilania wzdłuż
JEDNEJ szyny zbiorczej — rozłożona rezystancja wzdłuż szyny, inny model niż N niezależnych gałęzi
(pierwszy przykład źródła, "ogniwo #1 vs #8, przesuń kabel na środek szyny"). Obie te topologie
wymagałyby osobnego modelu sieciowego (nie prostego podzielnika prądu) — świadomie nie zbudowane,
nie zgadywane. Żaden próg "niebezpiecznego" % odchylenia nie został wymyślony — źródło nie podaje
takiego progu (oba przykłady są ilustracyjne), więc kalkulator pokazuje policzone odchylenie
wprost, bez etykiety "bezpieczne/niebezpieczne".

`tsc --noEmit`/`pnpm test` (641/641)/`pnpm lint`/`pnpm build` — czyste. Zweryfikowane w
przeglądarce (Playwright), w tym sprawdzenie duplikatów DOM `id` (formularz M4/E25 ma dynamiczną
listę gałęzi z jawnymi unikalnymi `id` per gałąź — nauczka z Ekranu 26 zastosowana od razu przy
projektowaniu, nie znaleziona post factum).

## Dobudowa Etapu D w module "Dobór napięcia" (14.09.2026)

Na wyraźną prośbę autora dobudowany pominięty wcześniej Etap D (patrz sekcja "Budowa modułu
'Dobór napięcia' — zakończona" wyżej, akapit "Odstępstwo od planu"). Przeczytany pełny materiał
źródłowy (`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md`, linie 231-277):
D.1 (porównanie LED 230V/24V/48V + zalecenie) i D.2 (dedykowane gniazda DC dla elektroniki:
router/TV/laptop/telefon/radio).

**Ustalone przed implementacją:** numeryczny rdzeń D.1 (koszt przetwornic DC-DC 48V→24V dla linii
oświetlenia) już liczy się w Etapie E (`kosztorys.ts`, pola `liczbaLiniiOswietlenia24vPrzySystemie48v`/
`cenaPrzetwornicyDcDcZl`, zbudowane wcześniej) — więc Etap D nie potrzebuje nowej logiki
obliczeniowej ani nowego kalkulatora, tylko czysto informacyjnej treści (ten sam wzorzec co już
zbudowany Etap F: statyczne tabele + tekst, bez `calculator.ts`).

Dodane: `POROWNANIE_OSWIETLENIA_LED`, `ZALECENIE_OSWIETLENIA_LED`, `KATALOG_URZADZEN_DC`,
`ZALETA_GNIAZD_DC` w `constants.ts` (dane 1:1 ze źródła) + nowa sekcja `<details>` "Etap D" w
`app/kalkulatory/napiecie-systemowe/page.tsx`, umieszczona między Etapem C a Etapem E (kolejność
źródła). Brak zmian w `calculator.ts`/`input.ts`/testach — CALCULATOR_VERSION pozostaje 2.0.0
(treść informacyjna, nie logika).

Zweryfikowane: `tsc --noEmit` czyste, `vitest run` 658/658 (bez zmian — brak nowej logiki do
testowania), `pnpm lint` czyste (te same 2 niepowiązane ostrzeżenia `<img>`), `pnpm build` bez
błędów, smoke test Playwright (sekcja Etap D otwarta i odczytana — pełna treść D.1/D.2 renderuje
się poprawnie, brak duplikatów DOM `id`, brak błędów konsoli). `docs/rejestr-pokrycia.md`
(M4/Ekran2) zaktualizowany — usunięta wzmianka o świadomym pominięciu Etapu D, zastąpiona opisem
dobudowy.

## Nowa reguła standardu: Ekrany pochodne i Kreator Pro (14.09.2026)

Podczas projektowania (jeszcze roboczego, nieopublikowanego) modułu "Oświetlenie LED"
(`docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md`, Sekcja 15) autor doprowadził w
dyskusji do nowej, ogólnej reguły nawigacyjnej — zapisanej jako `docs/standards/08-ui-ux.md`
§8.11, nie tylko w szkicu tego jednego modułu, bo **ma być zastosowana retroaktywnie w całej
aplikacji** (wyraźna prośba autora — "musimy przejść przez całą apkę i wnieść takie same
poprawki").

**Reguła w skrócie:** w obrębie jednego modułu rozróżniamy trzy role ekranu, nigdy nie mieszane w
jeden: (1) **artykuł referencyjny** (Wzorzec C, samodzielny, edukacyjny) — nie wplatany między
kroki Doradcy; (2) **ekran pochodny** — cienka nakładka na już istniejącą funkcję kalkulatora
(echo, zero nowej logiki), zawężony/nazwany kontekst, jeden konkretny wynik zamiast pełnego
drzewa opcji, motywowany zarówno prowadzeniem początkującego za rękę jak i postrzeganą wartością
aplikacji (użytkownik ocenia po tym, co widzi jako osobne kafelki, nie po tym, co ukryte wewnątrz
jednego złożonego ekranu); (3) **Kreator Pro** — pełny, multi-ścieżkowy wariant Wzorca D/A, jako
świadomie wybierana opcja dla zaawansowanego użytkownika, nie domyślny punkt wejścia (to ten sam
podział co istniejące już §8.5 Tryb prosty/zaawansowany, tylko zrealizowany jako osobny ekran
zamiast przełącznika).

Decyzja **które konkretnie** ekrany pochodne wydzielić z Kreatora Pro zapada osobno w każdym
module (kryterium: da się odpowiedzieć jednym wywołaniem istniejącej funkcji na pojedyncze,
nazwane pytanie początkującego) — nie jest to sztywna, odgórna lista.

**Konsekwencja praktyczna, jeszcze nie wykonana:** autor zlecił przegląd **całej** istniejącej
aplikacji pod kątem tej reguły — czy któryś z 13 istniejących modułów ma dziś ekran, który w
jednym miejscu miesza artykuł/edukację z krokami Doradcy, albo który powinien dostać ekrany
pochodne dla typowych, nazwanych pytań początkujących. To osobne, jeszcze nierozpoczęte zadanie
(wymaga przejścia modułu po module) — nie mylić z samym zapisaniem reguły w standardzie, co
zostało wykonane teraz.

## Opracowanie "Oświetlenie LED" — wstrzymane na jednym punkcie (14.09.2026)

Szkic `docs/zrodla/Opracowanie_Tasmy_LED_Oswietlenie_DC_DRAFT.md` (15 sekcji, ~1280 linii) jest
merytorycznie kompletny i czeka na finalną akceptację autora przed Krokiem 2 (dodanie do Biblii).
**Jedyny blokujący punkt:** `R_taśmy_na_metr` (Sekcja 8.2) wymaga karty katalogowej konkretnego
producenta TAŚM (nie zasilaczy — to inna firma, pomyłka z wcześniejszej tury poprawiona w
dokumencie). Autor świadomie nie przekazał jeszcze tej karty w tej turze i przechodzi do innych
zadań — **nie proponować samodzielnie wartości `R_taśmy_na_metr` ani nie zamykać opracowania bez
tego dokumentu**, tylko czekać, aż autor go dostarczy. Wszystko inne w dokumencie (rodzaje taśm,
oznaczenia, żywotność, biel/RGBW, CCT, RGB/RGBIC, SMD/COB/FCOB, algorytm spadku napięcia, dobór
zasilacza — zapas mocy zamknięty na regule 80%, złącza, weryfikacja po zakupie, sterowanie,
struktura nawigacji "Oświetlenie"→LED z artykułami/ekranami pochodnymi/Kreatorem Pro/hubem
Hand-Made) jest gotowe i nie wymaga dalszej pracy do czasu tej jednej karty katalogowej.

Przy okazji tego opracowania powstała też nowa, ogólna reguła standardu — **Ekrany pochodne i
Kreator Pro** (`docs/standards/08-ui-ux.md` §8.11, zgłoszona równolegle do `new-app-standards` w
`docs/wklad-do-standardu.md`) — oraz trzy zgłoszenia do `new-app-standards`: rozbudowa AI (gotowa
do konsolidacji), i szkielety logowania/wielojęzyczności (świadomie niedokończone, autor robi
`zero-waste` osobno — nie ruszać tych dwóch plików w `docs/propozycje-do-new-app-standards/` do
czasu wyraźnej prośby).

## M4/Ekran2 (Dobór napięcia systemowego) — poprawki Etapu B + usunięcie Etapów D/F/G (14.09.2026)

Pierwsze zastosowanie §8.11 w praktyce, znalezione podczas przeglądu app-wide zainicjowanego przez
autora ("jaka to funkcja, a ja sprawdzę w apce"). Autor zgłosił trzy niezależne rzeczy:

1. **Błąd Etapu B (kreator odbiorników):** pola moc/czas miały `disabled={!stan.selected}` — nie
   dało się w nie wpisać wartości, dopóki nie zaznaczono checkboxa. Naprawione (usunięte
   `disabled`), plus dwa dodatkowe usprawnienia zgłoszone razem: układ wiersza przebudowany, żeby
   pola moc/czas/jednostka trzymały się jednej linii (`flex-nowrap`) niezależnie od szerokości
   ekranu, i dodany wybór jednostki czasu min/godz. z konwersją przy przełączaniu (żeby nie trzeba
   było przeliczać "16 godzin" na minuty w głowie). PR #87.
2. **Analiza strukturalna na żądanie autora** ("do czego ten rozdział ma służyć, jakie pytanie ma
   odpowiadać, jakie funkcje tam wylądowały"): pytanie ekranu to "jakie napięcie systemowe (12/24/
   48V) wybrać". Etapy A/B/C/E/H odpowiadają na to pytanie (kontekst, dane wejściowe, argument
   kosztu kabla, argument kosztu całości, pułapka konwersji). **Etapy D/F/G nie odpowiadały** —
   przykleiły się przy kolejnych rundach rozbudowy bez sprawdzenia dopasowania do tematu ekranu.
3. **Decyzja autora (potwierdzona wprost):** "F i G mają się nijak do tego rozdziału, nic tu nie
   wnoszą oprócz zamętu. Etap D do oświetlenia." Wykonane: Etap D (porównanie LED 24/48/230V,
   katalog gniazd DC) usunięty z UI, dane zachowane w `constants.ts` (oznaczone komentarzem) do
   przeniesienia do przyszłego modułu "Oświetlenie" (jeszcze nie zbudowanego — nie usuwać przy
   porządkach dead-code). Etap F (link do `szyny-zbiorcze-miedzypakietowe`) i Etap G (dobór PV do
   falowników VEVOR, dane `FALOWNIKI_VEVOR`/`PANEL_JA_SOLAR_500W`) **usunięte całkowicie** z kodu
   (nie tylko z UI) — sprawdzone grepem, że te dane nie są używane nigdzie indziej w repo.
   `CALCULATOR_VERSION` 2.0.0→2.1.0. Testy: 25→22 (usunięte 3 testy Etapu G), `tsc`/`vitest`/
   `lint`/`build` czyste. `docs/rejestr-pokrycia.md` zaktualizowany.

**Lekcja procesowa dla dalszego przeglądu app-wide (§8.11):** kandydaci "mega-Doradca" mogą mieć
nie tylko problem "za dużo w jednym ekranie" (rozwiązanie: ekrany pochodne/Kreator Pro), ale też
**etapy, które nie należą do tematu ekranu wcale** (rozwiązanie: usunięcie/przeniesienie, nie
rozbicie). Sprawdzać oba pytania przy każdym kolejnym kandydacie (M5/Ekran1, M3/Ekran14), nie tylko
"czy jest za duży".

## Pierwsza realna implementacja `StorageAdapter` — autozapis Seed formularza (15.09.2026)

**Zgłoszenie autora:** "strona się sama przeładowywała" na telefonie i po przeładowaniu wszystkie
wpisane dane (Etap A-H, `napiecie-systemowe`) trzeba wpisywać od nowa. Diagnoza: nie jest to błąd
tego ekranu — żaden kalkulator w apce nie zapisywał Seed-u formularza, `lib/adapters/storage-adapter.ts`
miał od początku (świadomie, patrz komentarz w pliku) tylko kontrakt, bez implementacji, do czasu
"pierwszej realnej funkcji zapisu". Samo przeładowanie karty na telefonie to prawdopodobnie
zachowanie przeglądarki mobilnej pod presją pamięci (odświeżenie karty w tle) — nie do naprawienia
w kodzie tej apki — ale brak zapisu Seed-u sprawiał, że KAŻDE odświeżenie (manualne, HMR w dev,
albo mobilne w tle) kosztowało cały wpisany formularz.

**Decyzja:** to jest właśnie ten moment z komentarza w `storage-adapter.ts` — zaimplementowano
`IndexedDbStorageAdapter` (`lib/adapters/indexeddb-storage-adapter.ts`, jedna baza `offgrid-storage`,
jeden object store `kv`, zgodnie z 5.2/5.3) oraz hook `usePersistedDraft<T>` (`lib/adapters/use-persisted-draft.ts`)
— zamiennik `useState` o identycznym kształcie `[stan, setStan]`, autozapis debounce 500ms, odczyt
asynchroniczny (SSR-safe, pierwszy render = wartość początkowa, dane doładowują się na kliencie).

**Zakres tej sesji: pilotaż na jednym ekranie** (`napiecie-systemowe`, ten który zgłoszono) —
13 osobnych `useState` scalone w jeden obiekt `FormularzStan` (Seed tego ekranu, 5.1 — Seed nie
Wynik), persystowany pod kluczem `offgrid.draft.napiecie-systemowe`. Wywołania niżej w komponencie
(JSX, `toggleOdbiornik`, `zmienJednostkeCzasu`, edytor cen) **nie zostały zmienione** — każdy
`setX` to teraz wrapper wołający `setPole(pole, akcja)`, akceptujący wartość albo funkcję
aktualizującą tak jak oryginalny `useState`, żeby nie przepisywać całego pliku. Zweryfikowano:
`tsc --noEmit`, `pnpm lint`, `pnpm test` (655/655), `pnpm build` — wszystko czyste.

**Świadomie NIE wykonane w tej sesji (do rozważenia, nie zapomniane):** wdrożenie tego samego
mechanizmu na pozostałych ~100 ekranach kalkulatorów — `usePersistedDraft` jest gotowy do
skopiowania 1:1 (jedna linia zamiast `useState` + bundle pól w jeden typ `FormularzStan`), ale
zrobienie tego dla każdego ekranu naraz to osobne, duże zadanie, nie część naprawy zgłoszonego
błędu. Do rozważenia jako kolejny krok, ekran po ekranie albo partiami.

## Pierwsza implementacja i18n — pilotaż na module `kalkulatory-pomocnicze` (15.09.2026)

**Kontekst:** przy synchronizacji ze standardem (v2.8→v2.17, patrz sekcja "Synchronizacja ze
standardem" wyżej) wykryto niezgodność: rozdz. 17 (i18n, 17.2) i PATCH do 03.2/04 wymagają, żeby
Kernel zwracał **klucze tłumaczeń**, nigdy gotowy tekst — a cały istniejący kod (`Warning.message`,
`CalcResult.assumptions: string[]`) zwraca wprost polski tekst. Autor wybrał tę niezgodność jako
pierwszą do domknięcia (z listy 4: i18n / logowanie / freemium / kontrakt AI).

**Skala sprawdzona przed decyzją o zakresie (nie zgadywana):** 116 katalogów modułów, 90 plików
`warnings.ts`, **326 wystąpień `message:`** w `lib/core/modules` (bez testów), **110 plików**
używających `assumptions`. Migracja wszystkiego naraz byłaby dokładnie tym, co standard sam
zabrania (17.9: "migracja stopniowa, moduł po module, nigdy big bang") — dodatkowo część
`message:` to szablony z wartościami dynamicznymi (np. `label`/`value` wstrzykiwane w runtime),
więc ekstrakcja do słownika wymaga decyzji per funkcja (co jest parametrem, co kluczem), nie jest
czysto mechaniczna dla całego kodu naraz.

**Decyzja o zakresie tej sesji:** zbudować infrastrukturę + zmigrować **jeden pilotażowy moduł**
w całości (ten sam wzorzec co przy `usePersistedDraft` — pilotaż, nie big bang), zamiast czekać z
czymkolwiek do czasu, aż wszystkie 116 modułów zostaną zrobione naraz.

**Wykonane:**
1. `lib/i18n/dictionary-pl.ts` — słownik `{klucz: szablon}`, klucze wielkimi literami z myślnikiem
   (ta sama konwencja co dotychczasowy `Warning.code`), placeholdery `{param}`. Dziś tylko klucze
   faktycznie użyte przez zmigrowany moduł — **nie wolno dopisywać kluczy "na przyszłość"** bez
   migracji modułu, który ich używa (martwe klucze to dług, nie postęp — zapisane jako komentarz
   w samym pliku, żeby przetrwało kompaktowanie kontekstu).
2. `lib/i18n/t.ts` — `t(kod, params?)`, podstawia `{param}` w szablonie. Brakujący klucz nie jest
   cichym fallbackiem (17.1) — raportowany przez `consoleReporter` i widoczny w UI jako `⚠ [KOD]`,
   żeby błąd migracji był widoczny od razu, nie ukryty.
3. **Kontrakt (`lib/core/calc-result.ts`) — zmiana addytywna, nie usuwająca.** `Warning.message`
   stał się **opcjonalny** (oznaczony `@deprecated`, z komentarzem odsyłającym do tej sekcji),
   dodano `i18nKey?`/`params?`. `CalcResult.assumptions` zmieniło typ z `string[]` na nowy
   `Assumption = string | {kod, params?}`. **To jest świadomy, tymczasowy stan przejściowy** — nie
   każe wszystkim 115 pozostałym modułom migrować się natychmiast (są nadal poprawne typowo,
   zwracając same stringi/`message`), ale otwiera legalną ścieżkę dla modułów zmigrowanych.
   Rozstrzyga to WPROST napięcie między 17.1 ("brakujący klucz = błąd typu, nie cichy fallback")
   i 17.9 ("migracja stopniowa, nigdy big bang") — 17.1 opisuje stan DOCELOWY (po migracji
   wszystkiego), nie wymóg natychmiastowy w trakcie przejścia.
4. **Pilotaż w całości:** `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/warnings.ts`
   (4 funkcje — `message` usunięty, `i18nKey`/`params` gdzie kod jest dynamiczny per pole, np.
   `notPositive`) i `calculator.ts` (2 miejsca `assumptions` → `{kod: "SPRAWNOSC-DOMYSLNA", params}`).
   `components/wzorce/wynik-szczegoly.tsx` (komponent współdzielony przez kilka ekranów) i
   `app/kalkulatory/pomocnicze/page.tsx` rozwiązują teraz `Assumption`/`Warning` niezależnie od
   tego, czy pochodzą z modułu zmigrowanego czy nie (`typeof a === "string" ? a : t(a.kod, a.params)`).
5. **Efekt uboczny zmiany typu (naprawiony, nie przeoczony):** poszerzenie `assumptions` na typ
   unii złapało 7 dodatkowych ekranów renderujących `assumptions.map` **bezpośrednio**, nie przez
   `WynikSzczegoly` (`cop-pompy-ciepla`, `czystosc-i-snieg`, `lokalizacja-i-klimat`,
   `porownanie-technologii-magazynow`, `prognozy`, `systemy-podtrzymania-zycia`, `tryb-uproszczony`)
   — każdy naprawiony tym samym wzorcem odczytu (moduły tych ekranów NIE są zmigrowane, nadal
   zwracają czyste stringi, tylko renderowanie musi już umieć obsłużyć oba kształty). Też: jedno
   miejsce w kodzie DOMENOWYM (`optymalizacja-trasy-kabla/calculator.ts`) czytające `w.message`
   z echo innego modułu jako wymagany `string` — naprawione fallbackiem `?? w.code` (transitional,
   do usunięcia gdy `dobor-przekroju-kabla` też się zmigruje). 2 testy asercji na dosłowny tekst
   `assumptions` i 1 na `w.message` — poprawione na `.includes`/`?.` odpowiednio bezpieczne dla
   typu unii/opcjonalnego pola.
6. Zweryfikowano: `tsc --noEmit`, `pnpm lint`, `pnpm test` (655/655), `pnpm build` — wszystko czyste.

**Świadomie NIE wykonane (rollout, osobne zadanie, `docs/lista-do-zrobienia.md`):** pozostałe ~89
plików `warnings.ts` (326 wystąpień `message:`) i ~109 innych plików z `assumptions: string[]`.
Kolejność rollout-u nie ustalona — naturalny kandydat to moduły najczęściej odwiedzane/najbardziej
"mega-Doradca" (per przegląd §8.11), ale to decyzja na kolejną sesję, nie założenie z tej.

**Lekcja procesowa:** zmiana typu współdzielonego kontraktu (`CalcResult`/`Warning`) używanego w
100+ miejscach, nawet "addytywna" (nowe pole opcjonalne, unia zamiast pojedynczego typu), potrafi
złapać nieoczywiste call site'y (renderowanie bezpośrednie z pominięciem współdzielonego
komponentu, konsumpcja międzymodułowa przez echo) — `tsc --noEmit` po zmianie typu bazowego jest
jedynym wiarygodnym sposobem znalezienia ich wszystkich, nie grep po nazwie pola.

## Szkielet logowania (rozdz. 18) — bez realnych kluczy Supabase (15.09.2026)

**Kontekst:** trzecia z 4 niezgodności znalezionych przy synchronizacji ze standardem (po i18n).
Projekt nie miał żadnego kodu auth (zero zależności Supabase, zero `.env`, zero `middleware.ts`).
Rozdz. 18 wymaga realnej infrastruktury (Supabase Auth, Google/Apple OAuth, sesja HttpOnly) — nie
dało się tego zbudować bez prawdziwego projektu Supabase, którego autor nie miał w tej sesji
(potwierdzone po kilku rundach wyjaśniania — patrz transkrypt, nie ma potrzeby powtarzać tu
przebiegu). **Decyzja: szkielet kodu teraz, bez kluczy — flip na "żywe" logowanie = wklejenie
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` do `.env.local`, bez zmian w kodzie.**

**Wykonane:**
- `@supabase/supabase-js` + `@supabase/ssr` jako zależności (jeden lockfile pnpm, bez naruszenia
  11.1). `.env.example` z placeholderami i komentarzem "skąd wziąć wartości".
- `lib/adapters/supabase/config.ts` — `isSupabaseConfigured()`: jedyne miejsce decydujące, czy
  Supabase jest realnie skonfigurowany (placeholder URL = "nie"). Cała reszta kodu pyta to, nigdy
  nie sprawdza `process.env` bezpośrednio — jedno miejsce prawdy.
- `lib/adapters/supabase/client.ts` (przeglądarka) / `server.ts` (Server Components/Actions/Route
  Handlers) — sesja wyłącznie przez `@supabase/ssr`, nigdy ręczne cookie (18.5).
- `middleware.ts` — 18.1 (konto wymagane od startu), ale **wyłączony całkowicie, gdy Supabase
  nieskonfigurowany** (`isSupabaseConfigured()` na wejściu, `return NextResponse.next()`) — jawny,
  dokumentowany stan przejściowy, nie cichy fallback. Zweryfikowane realnie (`pnpm build` +
  `pnpm start` + `curl`): `/kalkulatory/pomocnicze` odpowiada 200 bez przekierowania, dokładnie
  jak przed tym commitem — apka nie zmieniła zachowania dla użytkownika, dopóki nie ma kluczy.
- `app/auth/login/page.tsx` — 3 równorzędni dostawcy (18.2): magic link e-mail (formularz +
  Server Action `signInWithMagicLink`), Google/Apple (`signInWithOAuth`). Wymagało wrappera
  `<Suspense>` wokół `useSearchParams()` — bez tego `pnpm build` failował na prerenderingu
  (Next.js wymaga tego jawnie, nie ostrzeżenie, błąd zatrzymujący build).
- `app/auth/callback/route.ts` — wymiana kodu na sesję. `next` (URL powrotny) przechodzi przez
  `safeNextPath()` (nowy plik `lib/adapters/supabase/safe-redirect.ts`, z testami) — **realny
  fix na open redirect z 18.2 (dopisek 15.09.2026)**, nie tylko wzmianka w komentarzu: odrzuca
  wszystko, co nie zaczyna się od jednego `/` (łapie też `//host` protocol-relative).
- `app/auth/signout/route.ts` + `components/konto-sekcja.tsx` (sekcja w `/ustawienia`, renderuje
  się na coś tylko gdy `isSupabaseConfigured()` — inaczej apka nie ma jeszcze konceptu
  "zalogowany", pusta sekcja byłaby myląca, nie tylko nieprzydatna).
- `supabase/migrations/0001_profiles.sql` — `public.profiles` (1:1 z `auth.users`, `ON DELETE
  CASCADE` — prawdziwy DELETE, 18.8), RLS (`auth.uid() = id`), trigger auto-insert przy rejestracji.
  Pole `tier` (freemium, rozdz. 12) świadomie NIE dodane teraz — dojdzie, gdy projekt zdecyduje
  się na freemium, nie spekulacyjnie.
- `next.config.mjs` — `connect-src` w CSP dopuszcza URL Supabase, tylko gdy zmienna środowiskowa
  istnieje (`process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""` — pusty string nie dodaje nic do CSP).
- Zweryfikowano: `tsc --noEmit`/`pnpm lint`/`pnpm test` (660/660, +5 nowych testów
  `safe-redirect.test.ts`)/`pnpm build` czyste. `pnpm start`+`curl` potwierdza brak regresji w
  zachowaniu apki bez kluczy.

**Świadomie NIE wykonane (wymaga działań właściciela projektu, poza zasięgiem sesji):**
1. Założenie realnego projektu Supabase (supabase.com → New Project → Settings → API) i wklejenie
   `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` do `.env.local`.
2. Uruchomienie `supabase/migrations/0001_profiles.sql` w Supabase Dashboard → SQL Editor.
3. Włączenie dostawców Google/Apple w Supabase Dashboard → Authentication → Providers (wymaga
   danych OAuth z Google Cloud Console / Apple Developer Program — **99 USD/rok**, 18.2 — koszt
   realny, nie tylko konfiguracyjny, do rozważenia zanim się włączy).
4. Model grupy współdzielonej (18.7), rozwiązywanie konfliktu synchronizacji (18.14, wzorzec
   opcjonalny) — żadnego z tego projekt jeszcze nie potrzebuje (brak danych do synchronizacji w
   ogóle, poza tym co dziś żyje lokalnie w IndexedDB, patrz sekcja `usePersistedDraft` wyżej).
   `docs/lista-do-zrobienia.md` ma wpis na kolejny krok.

**Lekcja procesowa:** rozdz. 18 to pierwsza niezgodność z tej listy czterech, która jest naprawdę
blokowana na zewnętrznym zasobie (konto Supabase), nie na decyzji projektowej czy nakładzie pracy
— i18n/AI-kontrakt/freemium da się zaplanować i częściowo wdrożyć bez niczyjej zewnętrznej akcji,
logowanie nie. Warto to rozpoznawać wcześniej (przed pisaniem kodu), nie w trakcie.

## Mechanizm strażniczy i18n — `scripts/check-i18n-guard.mjs` (16.09.2026)

**Kontekst:** audyt zgodności rozdz. 17 (i18n) z żądania właściciela projektu ("czy nie mamy
odstępstw?") wykrył realną, nieodnotowaną dotąd niezgodność — 17.9 wymaga wprost "mechanizmu
strażniczego (lint/hook wykrywający nowy twardy string)", który nie istniał. Reszta rozdziału
sprawdzona punkt-po-punkcie i **zgodna**: 17.1 (klucze PL w `dictionaryPl` to zastosowanie
wyjątku 0.7 dla już ugruntowanej w projekcie polskiej konwencji `Warning.code` — nie odstępstwo,
patrz decyzja niżej), 17.2 + PATCH 03.2/04 (kontrakt `{kod, params?}`/`i18nKey` 1:1 z tekstem
standardu), 17.9 rollout (moduł-po-module, udokumentowany backlog). 17.3/17.4/17.7/17.8/17.10 nie
mają jeszcze zastosowania — nie istnieje drugi język, to nie jest odstępstwo, tylko punkt, który
zacznie obowiązywać przy dodaniu języka nr 2.

**Zbudowane:** `scripts/check-i18n-guard.mjs` — parsuje AST (`typescript`, nie regex, żeby nie
łapać fałszywych trafień w `technicalMessage`/`formula`, które świadomie NIE podlegają i18n) pliki
`warnings.ts`/`calculator.ts` modułów z listy `MIGRATED_MODULES` (dziś: tylko
`kalkulatory-pomocnicze`) i blokuje: (1) `message` z literałem stringu, (2) element `assumptions`
będący gołym stringiem — także wtedy, gdy tablica jest za `? :`/`??` (realny wzorzec w tym
projekcie, `input.efficiency === undefined ? [...] : []`; pierwsza wersja skryptu sprawdzała tylko
bezpośrednie przypisanie i **nie wykrywała** tego wzorca — złapane i naprawione przed wdrożeniem,
zweryfikowane wstrzyknięciem i usunięciem testowej regresji na obu polach, na prawdziwym pliku, nie
tylko na syntetycznym przykładzie). Nowy skrypt `pnpm check:i18n-guard`, dodany jako krok w
`.github/workflows/ci.yml` (job `quality`, po `typecheck`, przed `test`) — od teraz blokuje merge
PR, nie tylko lokalne uruchomienie.
**Świadomie NIE zrobione:** git hook (pre-commit) — repo nie ma `husky`/innego mechanizmu hooków,
dodanie go byłoby nową zależnością/konwencją poza zakresem tego zadania; bramka w CI wystarcza do
"zapobiega cofaniu się" (17.9), bo blokuje merge, nie tylko ostrzega lokalnie.
**Do pamiętania na przyszłość:** dopisz ścieżkę modułu do `MIGRATED_MODULES` w TEJ SAMEJ sesji, w
której go migrujesz — inaczej guard nie chroni nowo zmigrowanego modułu (guard jest allowlistą,
nie wykrywa automatycznie, które moduły są zmigrowane).

**Decyzja: klucze i18n zostają po polsku, NIE zmieniamy na angielski.** Właściciel projektu
zapytał wprost, czy warto zmienić. Rozpatrzone i odrzucone — uzasadnienie:
- 17.1 samo przewiduje wyjątek "jeśli projekt już go używa gdzie indziej" — a używa: **90 plików
  `warnings.ts`, setki wartości `Warning.code`** po polsku od pierwszego dnia projektu
  (`BEZPIECZNIK-DOBRANY`, `BRAK-CZUJNIKA-CO`, `AIC-WYSTARCZAJACE`...). Zmiana samych kluczy i18n
  na angielski przy pozostawieniu `code` po polsku rozbiłaby jedną konwencję na dwie równoległe
  (klucz i18n ≠ kod ostrzeżenia dla tego samego zjawiska) — dokładnie odwrotny skutek od tego, co
  0.7/15.15 chce osiągnąć ("stosowana wtedy konsekwentnie w całym module").
  Dziś `i18nKey ?? code` w warstwie prezentacji polega właśnie na tej wspólnej konwencji.
- Koszt zmiany na angielski: nie jest to zmiana "tylko 5 kluczy w słowniku" — żeby była
  konsekwentna (a niekonsekwentna nie miałaby sensu), wymagałaby przemianowania `Warning.code` w
  **całym** kodzie (90 plików, setki wystąpień), plus każde miejsce, które go odczytuje: testy
  asercji na dosłowny `code`, `docs/rejestr-twardych-stopow.md`, wszelkie `key={w.code}` w JSX.
  Ryzyko czysto mechaniczne, ale duże i rozsiane, dla zmiany, która **nie zmienia zachowania
  runtime** — `code` nie jest dziś nigdzie parsowany/porównywany po treści semantycznej poza
  równością stringów, tylko wyświetlany (po przetłumaczeniu) i używany jako identyfikator.
- Realna korzyść zmiany na angielski istniałaby tylko przy pracy z **zewnętrznym, nie-polskim
  współpracownikiem/AI bez kontekstu projektu** czytającym kod źle znającym polski — w tym
  projekcie (jedna osoba, PL jako język pracy, GOD BOOK/CLAUDE.md wymagają polskiego wprost) ta
  korzyść nie ma dziś zastosowania.
**Wniosek:** zero zmian kodu z tej decyzji — pozostaje jak jest, z wyjątkiem odnotowanym tutaj
jako świadomy, rozpatrzony i odrzucony, nie przeoczony.

## Błąd procesowy: bezpośrednia edycja `new-app-standards` z tej sesji (16.09.2026)

Po prośbie właściciela o promocję CI referencyjnego/guardu i18n jako przykładu dla innych apek —
zamiast ograniczyć się do kanału ustalonego w `docs/wklad-do-standardu.md` (zgłoszenie w tym
pliku, konsolidacja wyłącznie w osobnej sesji nad `new-app-standards`), ta sesja dołączyła repo
`new-app-standards` do siebie i **bezpośrednio** dodała tam pliki (`docs/przyklady/ci/`,
`docs/przyklady/i18n/`, podsekcje 11.6/17.11) na osobnym branchu + otworzyła PR #9. **Błędne
rozumowanie:** "sesja nad `new-app-standards`" (Część Y.8 GOD BOOK) odczytane jako "ta sesja, bo
ma repo dołączone", nie jako "osobna, dedykowana sesja". Właściciel repo poprawił wprost — to
nie jest sposób, w jaki ten mechanizm ma działać, niezależnie od technicznej możliwości dołączenia
repo.

**Naprawione:** PR #9 zamknięty bez mergowania (żadna treść nie trafiła na `main` tamtego repo,
zero wpływu na inne projekty rodziny), branch pozostaje bez referencji (usunięcie zdalne odmówione
przez proxy sesji, HTTP 403 — niekrytyczne, martwy branch bez PR nie ma żadnego mechanizmu wejścia
do `main`). `docs/wklad-do-standardu.md` skorygowany — status wrócił do `🔎 nowe`, zgłoszenie
czeka na właściwy kanał.

**Lekcja procesowa:** techniczna możliwość dołączenia repo (`add_repo`) nie jest tym samym co
autoryzacja do promocji treści do niego. "Sesja nad `new-app-standards`" w sensie Y.8 znaczy
osobna, celowo otwarta sesja poświęcona konsolidacji wkładu — nie dowolną sesję, która akurat ma
to repo w zasięgu z innego powodu. Dla tego projektu jedyny legalny wyjście stąd jest zawsze plik
`docs/wklad-do-standardu.md`, bez wyjątków, niezależnie od tego, co technicznie jest możliwe.

- **2026-09-16 — Audyt pełny ("Audyt pełny", na żądanie właściciela projektu) — dwie realne
  niezgodności znalezione i naprawione.** Sprawdzone programistycznie (grep + odczyt kodu +
  realne odpalenie `pnpm test`/`typecheck`/`lint`, nie z metryczek dokumentów), przekrojowo przez
  wszystkie 19 rozdziałów standardu (00–18), z naciskiem na rozdziały architektoniczne/procesowe —
  pełny przegląd 117 stron kalkulatorów ekran-po-ekran uznany za nieproporcjonalny do budżetu
  jednego przejścia (każdy moduł miał już własną weryfikację przy budowie).

  **Zgodne (zweryfikowane, nie tylko zadeklarowane):** 01 (0 importów `app/`/`components/` w
  `lib/core/`), 07 (CSP z hashem skryptu, pełny zestaw nagłówków, `connect-src` warunkowy na
  Supabase), 11 (CI zielony), 660/660 testów przed poprawką.

  **Niezgodność #1 (rozdz. 10, Testy/DoD) — 6 modułów bez żadnych testów.**
  `lib/core/modules/montaz-baterii/{weryfikacja-wstepna-olow, bezpieczenstwo-kwas,
  uruchomienie-testy-olow, polaczenia-czyszczenie-olow, montaz-mechaniczny-olow, demontaz-olow}`
  (Ścieżka B, Moduł 11) miały realną logikę domenową (`calculator.ts`, checklist →
  VALID/INCOMPLETE, `demontaz-olow` dodatkowo z wymuszoną kolejnością i ostrzeżeniem
  `KROK-POZA-KOLEJNOSCIA`), ale zero plików `__tests__` — nieodnotowane w `dlug-techniczny.md` ani
  gdzie indziej jako świadome odłożenie. **Naprawione:** dopisano 6 plików testowych (25 testów),
  wzorowanych na już istniejącym `przygotowanie-stanowiska`/`demontaz-pakietu` (ten sam wzorzec
  checklisty). `pnpm test` po poprawce: 685/685 (było 660/660), `tsc --noEmit`/`lint` czyste.

  **Niezgodność #2 (rozdz. 14, Proces i pamięć) — `docs/lista-do-zrobienia.md` z dziurą
  09-05→09-14.** W tym oknie zbudowano 14 ekranów Modułu 5/okablowanie + M5/Ekran 1 (norma
  PN-HD 60364-5-52) + przebudowę `napiecie-systemowe` v2 + odblokowanie B5/M11 i M4/E25 —
  poprawnie odnotowane na bieżąco w `docs/rejestr-pokrycia.md` i tu, w `docs/memory.md`, ale nie
  przeniesione do `docs/lista-do-zrobienia.md`, wbrew jego własnej deklarowanej zasadzie
  "aktualizowane na bieżąco". Nic w kodzie nie wymagało korekty — tylko log. **Naprawione:** jeden
  zbiorczy wpis retroaktywny dopisany do `docs/lista-do-zrobienia.md`, jawnie oznaczony jako
  retroaktywny (nie cichy dopisek udający wpis "na żywo" z tamtej daty), z odsyłaczem do
  `docs/rejestr-pokrycia.md` po szczegóły per ekran.

  **Bez zmian (już znane, nie odkryte na nowo):** rozdz. 09 (kontrakt AI) i 12 (freemium) — nie
  zaimplementowane, z listy "4 niezgodności" z 15.09.2026; rozdz. 18 (logowanie) — szkielet gotowy,
  czeka na akcję właściciela; rozdz. 17 (i18n) — guard działa, rollout moduł po module w toku.

- **2026-09-16 — Decyzja procesowa: koniec czekania na dostęp do repo innych projektów rodziny
  (`zero-waste`) dla zgłoszeń niedokończonych w `docs/propozycje-do-new-app-standards/`.**
  Polecenie właściciela projektu wprost: "Nie musisz grzebać w innych repo projektów, żeby coś
  wyjaśniać... jak czegoś ci brakuje czy nie wiesz czegoś, piszesz w wkład do standardu i tam
  decydują co i jak." Dotyczy dwóch plików oznaczonych dotąd jako "celowo niedokończone, czekają na
  zero-waste": `wielojezycznosc.md` (rozstrzygnięty tą samą sesją, patrz niżej) i
  `logowanie-i-konta.md` (wciąż otwarty — nie było dziś nowej pracy nad logowaniem, status bez
  zmian, ale ta sama zasada obowiązuje: nie czekać na `zero-waste`, tylko zgłosić co wiadomo z
  własnego kodu/decyzji właściciela, gdy będzie następna sesja nad tym tematem). Nie zmienia
  fundamentalnej zasady 15.17 (nigdy nie edytuj `new-app-standards` bezpośrednio) — zmienia tylko
  to, że brak dostępu do TRZECIEGO repo (nie `new-app-standards`, nie tego projektu) przestaje być
  powodem, żeby trzymać zgłoszenie w stanie szkicu.

- **2026-09-16 — Wielojęzyczność: przełącznik języka w Ustawieniach + dodane EN i RU.** Polecenie
  właściciela projektu wprost ("zrób w ustawieniach możliwość wyboru języka... dodaj nowe języki
  angielski i rosyjski"), połączone z decyzją procesową wyżej (nie czekać na `zero-waste`).

  **Zakres — dodaje infrastrukturę wielojęzyczności, NIE migruje więcej modułów.** Stan przed tą
  pracą: 1/116 modułów ma klucze tłumaczeń (`kalkulatory-pomocnicze`), słownik tylko polski, zero
  przełącznika UI. Ten wpis dodaje: drugi i trzeci język do istniejącego mechanizmu, przełącznik w
  Ustawieniach, i infrastrukturę SSR-bezpiecznego przechowywania wyboru. **Nie dodaje** nowych
  zmigrowanych modułów — rollout z wpisu 2026-09-15 (~89 plików `warnings.ts`/~109 miejsc
  `assumptions` wciąż z gotowym tekstem PL) zostaje bez zmian, świadomie (17.9: moduł po module).

  **Decyzja architektoniczna — cookie, nie `localStorage`, mimo że `lib/theme/storage.ts` i
  `lib/wyglad/storage.ts` (ten sam rodzaj "drobnej preferencji UI") używają `localStorage` +
  inline-skrypt w `app/layout.tsx`.** To NIE jest niespójność/dryf do naprawienia — inny kształt
  problemu: theme/wyglad zmieniają tylko klasy CSS/zmienne, które inline-skrypt może ustawić
  synchronicznie PRZED pierwszym malowaniem (zero widocznego błysku nawet przy twardym
  przeładowaniu). Język zmienia TEKST already server-rendered w strumieniu HTML — nie da się tego
  „naprawić” skryptem przed malowaniem bez przepisania DOM-u (co i tak dałoby widoczny błysk).
  Dokładnie to jest powód korekty 17.4/17.4a zsynchronizowanej dziś wcześniej (v2.18): SSR + cookie,
  nie `localStorage`. Dwa różne mechanizmy dla dwóch różnych klas problemu, oba świadome — nie
  wymaga zgłoszenia do `docs/wklad-do-standardu.md` jako konflikt, bo to nie jest konflikt reguł,
  tylko różne wymagania techniczne dwóch typów danych (CSS vs tekst).

  **Architektura (`lib/i18n/`):**
  - `language.ts` — `Language = "pl" | "en" | "ru"`, `negocjujJezyk(Accept-Language)` (Edge-safe,
    bez zależności od `next/headers`/DOM — używany też w `middleware.ts`), `LANGUAGE_COOKIE`/
    `LANGUAGE_COOKIE_MAX_AGE_SECONDS` jako nazwane stałe (nie magiczne liczby/stringi powielone).
  - `dictionary-en.ts`/`dictionary-ru.ts` — `satisfies Record<KluczTlumaczenia, string>` (typ z
    `dictionary-pl.ts`) wymusza dokładny parytet kluczy z bazowym słownikiem — brakujący/dodatkowy
    klucz to błąd kompilacji, zweryfikowane testem (`__tests__/t.test.ts`, "parytet kluczy").
  - `t(language, kod, params?)` — sygnatura ZMIENIONA (był `t(kod, params?)`, niejawnie
    `dictionaryPl`). Język jako jawny parametr, nie moduł-globalna zmienna — SSR w Next.js dzieli
    proces serwera między równoległe żądania różnych userów, moduł-globalny "aktualny język" na
    serwerze przeciekałby między nimi.
  - `language-context.tsx` (Client) — `LanguageProvider`/`useLanguage()`/`useTranslate()` (hook
    wiążący `t` z językiem z kontekstu, dla wygody wywołania identycznej jak przed zmianą sygnatury
    w większości miejsc: `const t = useTranslate(); ...t(kod, params)`).
  - `server-language.ts` — `getServerLanguage()` (jedyne miejsce w warstwie i18n importujące
    `next/headers` — Client Components nie mogą tego bundlować).
  - `client-language.ts` — `ustawCookieJezyka()` jako **funkcja modułowa, nie zamknięcie wewnątrz
    komponentu**. Odkryte przy pierwszym podejściu (inline `document.cookie = ...` w `onClick`
    wewnątrz `JezykWybor`): React Compiler (`react-hooks/immutability` z eslintem tego projektu)
    odrzuca mutację obiektu spoza zasięgu komponentu (`document`) zdefiniowaną w ciele
    komponentu/hooka — ten sam wzorzec ograniczenia, któremu już podlegają `zapiszTryb`/
    `zastosujTryb` w `lib/theme/storage.ts` (funkcje modułowe, nie closures). Naprawione przez
    wydzielenie do osobnego pliku, zgodnie z już istniejącą konwencją repo.

  **Integracja:**
  - `middleware.ts` — `ustawJezykJesliBrak()` ustawia cookie z `Accept-Language` tylko gdy cookie
    jeszcze nie istnieje (nigdy nie nadpisuje świadomego wyboru usera), wywoływana na WSZYSTKICH
    ścieżkach zwrotu (early-return bez Supabase, redirect do loginu, normalny `next()`) — istniejąca
    logika auth (18.5) zostawiona bez zmian, tylko dodany krok przed każdym `return`.
  - `app/layout.tsx` — Server Component (był, teraz jawnie `async`), czyta `getServerLanguage()`,
    ustawia `<html lang={language}>` (**naprawiony przy okazji realny, niezwiązany błąd** — było na
    sztywno `lang="en"` mimo że cała treść jest po polsku; nikt tego świadomie nie zdecydował, więc
    naprawione od razu per zasada dryfu bez pytania) i owija `children` w `<LanguageProvider>`.
  - `components/wzorce/wynik-szczegoly.tsx` — komponent współdzielony przez **70 stron**
    kalkulatorów (odkryte przy typecheck: znacznie więcej niż sugerował własny komentarz pliku
    "7+ plików", drift metryczki niewart osobnego zgłoszenia, skorygowany w komentarzu). Dodano
    `"use client"` + `useTranslate()` — bezpieczne, bo wszyscy 70 importerów już są `"use client"`
    (zweryfikowane `grep` przed zmianą, nie zgadywane).
  - 8 stron z własnym, zduplikowanym renderowaniem `assumptions` (nie przez `WynikSzczegoly` —
    osobny, starszy wzorzec, nieruszany poza wymaganą zmianą sygnatury): 7 Client Components →
    `useTranslate()` hook; `app/kalkulatory/prognozy/page.tsx` jedyny Server Component z tej grupy
    → `getServerLanguage()` + `t(language, kod, params)` wprost (Server Components nie mogą używać
    Reactowego kontekstu).
  - `components/jezyk-wybor.tsx` — przełącznik w Ustawieniach (`app/ustawienia/page.tsx`, nowa
    sekcja "Język"), zapisuje cookie + `router.refresh()` (cookie jest źródłem prawdy, kontekst
    tylko go odzwierciedla — bez dualnego stanu klient/serwer, w odróżnieniu od wzorca
    `useSyncExternalStore` używanego przez theme/wyglad, bo tam localStorage JEST źródłem prawdy).

  **Zweryfikowano:** `tsc --noEmit`/`pnpm lint` czyste (0 błędów, te same 2 znane niezwiązane
  warningi `<img>`), `pnpm test` 699/699 (685 + 14 nowych: `language.test.ts`, `t.test.ts` — w tym
  parytet kluczy, negocjacja Accept-Language z realnymi nagłówkami, podstawianie `{params}`, widoczny
  fallback przy brakującym kluczu), `pnpm check:i18n-guard` OK (bez regresji), `pnpm build` czysty.
  **Playwright na realnym `pnpm dev`** (nie tylko typecheck): pierwsza wizyta bez cookie →
  `<html lang="en">` (Accept-Language kontenera to `en-US` — potwierdza działającą negocjację, nie
  błąd domyślnego PL); kliknięcie "English"/"Русский" w Ustawieniach → cookie ustawiona poprawnie
  (nie `HttpOnly`, `path=/`, ~365 dni), `<html lang>` zmienia się po `router.refresh()`, utrzymuje
  się po nawigacji na inną stronę; realny przetłumaczony tekst na ekranie `kalkulatory/pomocnicze`
  ("System efficiency assumed as 0.92 (default value, not measured)." zamiast polskiego), reszta
  treści strony (nagłówki, etykiety) nadal po polsku — zgodnie z oczekiwanym stanem przejściowym
  17.9, nie błąd. Zero błędów konsoli/strony w całym przebiegu.

  **Dokumentacja/promocja (zgodnie z decyzją procesową wyżej):**
  `docs/propozycje-do-new-app-standards/wielojezycznosc.md` przepisany ze statusu "SZKIELET, czeka
  na zero-waste" na "gotowa do konsolidacji" — sekcja C (6 pytań) zastąpiona rozstrzygnięciami z tej
  implementacji, poza C6 (treści bezpieczeństwa-krytyczne), które zostaje świadomie otwarte — ten
  projekt tego nie rozwiązał w praktyce, nie tylko nie zgłosił, więc nieuczciwe byłoby przedstawić
  to jako gotową odpowiedź. `docs/wklad-do-standardu.md`, wpis 14.09.2026 — dopisana aktualizacja
  statusu (nie nowy wpis — kontynuacja tego samego zgłoszenia), z odsyłaczem do rozstrzygniętego
  punktu B.3.

- **2026-09-16 (trzecia synchronizacja tego dnia) — sprawdzone `AKTUALIZACJE.md` na polecenie
  właściciela projektu ("Aktualizacja"), `git fetch`+`git pull` w lokalnym klonie
  `new-app-standards` (`741352e..c89abb7`, 7 nowych wpisów). GOD BOOK bez zmiany wersji (nadal
  v2.19).** Nadpisane w całości (NIETYKALNE): `docs/standards/00-INDEKS.md`, `08-ui-ux.md`,
  `10-testy.md`, `16-standard-kodowania.md`, `17-i18n.md`. Pominięte świadomie: `docs/god-book/
  memory.md`, `docs/lista-do-zrobienia.md`, `docs/projekty-downstream.md` w `new-app-standards` —
  to własne pliki procesowe tamtej sesji (log U.3/U.4, rejestr projektów downstream), nie
  szablony/standard do mirrorowania tutaj.

  **Miła niespodzianka: własne zgłoszenie z dzisiejszej wcześniejszej pracy zostało skonsolidowane.**
  Jeden z 7 wpisów cytuje wprost "pełną treść offgrid-pro `docs/propozycje-do-new-app-standards/
  wielojezycznosc.md`" jako źródło trzech nowych reguł (8.8 rozszerzona — styl tłumaczeń jak
  oryginał; **17.4 rozszerzona — rozstrzyga nazwane pytanie otwarte z naszej sekcji C.4**: przy
  aktywnych kontach język synchronizuje się przez konto jak inne ustawienia 18.6/18.9, bez kont
  zostaje per-urządzenie — dokładnie nasz dzisiejszy wybór, teraz potwierdzony jako reguła rodziny,
  nie lokalna decyzja; **nowa 17.7a — dosłownie nasza implementacja** `⚠ [klucz]` zamiast cichego
  fallbacku, teraz kanoniczna). Cykl zamknięty tego samego dnia: zgłoszenie → sesja nad
  `new-app-standards` → wraca jako reguła, zamiast czekać tygodniami (dokładnie powód skrócenia
  cyklu Y.6/U.4 do 3h, zsynchronizowanego wcześniej dziś).

  **Sprawdzone względem TEGO kodu (nie zgadywane), pozostałe 4 wpisy:**
  - **17.4a (next-intl, pułapka `[locale]`/`localePrefix`)** — nie dotyczy: ten projekt nie używa
    next-intl ani żadnej biblioteki i18n (świadoma decyzja, patrz wpis wcześniej dziś, sekcja C.2 w
    `wielojezycznosc.md`), brak segmentów `[locale]` w `app/`. Zero wpływu na kod.
  - **17.3 (region obliczeń/towarów jako osobne osie + wymóg ręcznej zmiany języka)** —
    `grep` potwierdza `lib/i18n/`/`components/jezyk-wybor.tsx` nie dotykają `lib/core/profiles/`
    (jedyny profil: `pl.ts`) — przełącznik języka jest już niezależny od profilu regionalnego,
    zgodnie z regułą. Wymóg "zmiana języka zawsze ręcznie dostępna" — spełniony (Ustawienia).
    Projekt nie ma dziś żadnego UI wyboru regionu obliczeń/towarów (tylko wewnętrzny profil `PL`
    bez przełącznika) — nic do naprawienia, zapamiętane na przyszłość: gdy taki przełącznik
    powstanie, **nigdy GPS/geolokalizacja** (rozstrzygnięcie z kolejnego wpisu, ten sam dzień).
  - **10.6/16.7/10.7 (z zero-waste — port-based e2e cleanup, wzorzec async-reset, zakaz etykiety
    "flaky" bez diagnozy)** — 10.6 nie dotyczy dziś (projekt nie ma infrastruktury e2e z lokalnym
    dev-serwerem, tylko ad-hoc Playwright w tej sesji, nie stały skrypt). **16.7 sprawdzone realnie:**
    jedyny kandydat w kodzie (`async`+`useState` w komponencie klienckim) to
    `app/auth/login/page.tsx` (`handleMagicLink`) — przeanalizowany linia po linii: `status`/`error`
    są własnością TEGO konkretnego wywołania (przycisk wyłączony na czas `sending`, `email` nigdy
    nie jest nadpisywany przez wynik async), nie ma przechwyconej "przed `await`" wartości
    nadpisywanej bezwarunkowo po powrocie — wzorzec z 16.7 NIE występuje, false negative
    wykluczony przez czytanie kodu, nie zgadywanie. 10.7 to reguła procesowa (nie etykietuj testu
    jako "flaky" bez diagnozy) — bez zastosowania dziś (brak testów e2e w ogóle).

- **2026-09-16 — Rozdział 18 (logowanie/konta): audyt na polecenie właściciela projektu
  ("Zajmij się logowaniem i kontami"), dwie realne luki znalezione i zamknięte BEZ realnych
  kluczy Supabase** (wciąż blokujących samo "żywe" logowanie — bez zmian, patrz wpis 15.09.2026
  wyżej, kroki 1-3 dla właściciela projektu niezmienione).

  **Metoda audytu:** przeczytany cały `docs/standards/18-logowanie.md` (18.1-18.15), każda reguła
  sprawdzona wprost względem kodu (nie z metryczki) — 18.1/18.2/18.4/18.9-18.13 potwierdzone zgodne
  bez zmian; 18.6/18.7/18.14/18.15 świadomie bez zastosowania dziś (brak modelu grupy/sync — projekt
  nie ma jeszcze żadnych danych do synchronizacji); 18.3 (scalanie tożsamości) świadomie NIE
  zbudowane — wymaga już zalogowanego usera do przetestowania flow, przedwczesne bez realnego konta,
  zostaje jako kolejny krok po odblokowaniu przez właściciela, nie dzisiejsze zadanie.

  **Znalezisko #1 (18.5) — `@supabase/ssr` domyślnie `httpOnly: false`, sprawdzone wprost w
  `node_modules`, nie zgadywane.** `DEFAULT_COOKIE_OPTIONS` biblioteki
  (`node_modules/@supabase/ssr/dist/main/utils/constants.js`): `{ path: "/", sameSite: "lax",
  httpOnly: false }`. Powód architektoniczny (potwierdzony w README pakietu): `createBrowserClient`
  musi zapisywać tę samą cookie z poziomu JS przeglądarki, co z definicji wymaga `httpOnly: false`
  (JS nie może ustawić `HttpOnly` — ograniczenie platformy). Projekt miał dokładnie jedno miejsce
  używające `createBrowserClient` (`components/konto-sekcja.tsx`, odczyt statusu logowania w
  Ustawieniach) — samo to jedno miejsce wystarczyłoby, żeby przy pierwszym odświeżeniu tokenu
  cicho złamać 18.5, niezależnie od tego, co ustawia serwer.

  **Naprawione:**
  - `lib/adapters/supabase/client.ts` (`createSupabaseBrowserClient`) **usunięty całkowicie** — to
    była jedyna funkcja w projekcie tworząca klienta Supabase w przeglądarce, zero innych miejsc do
    sprawdzenia (`grep` przed usunięciem, potwierdzone).
  - `lib/adapters/supabase/get-account-status.ts` (nowy, `"use server"`) — status logowania czytany
    server-side, `components/konto-sekcja.tsx` woła to zamiast klienta przeglądarkowego (ten sam
    kształt UX: `useEffect` + `useState`, tylko inne źródło danych).
  - `lib/adapters/supabase/config.ts`: nowa `sessionCookieOptions()` (`{ httpOnly: true, secure:
    NODE_ENV === "production", sameSite: "lax" }`) — nazwana funkcja, nie duplikat literałów w
    dwóch miejscach. Przekazana jako `cookieOptions` do `createServerClient` w `server.ts` i
    `middleware.ts` (jedyne dwa miejsca tworzące klienta server-side). Sprawdzone wprost w
    `node_modules/@supabase/ssr`, że `cookieOptions` przekazane przez wywołującego POPRAWNIE
    nadpisują `DEFAULT_COOKIE_OPTIONS` (`{...DEFAULT_COOKIE_OPTIONS, ...cookieOptions}` — kolejność
    spreadu, nie zgadywane z dokumentacji, przeczytane z kodu biblioteki).
  - Efekt: teraz, bez żadnego `createBrowserClient` gdziekolwiek w kodzie, jawne `httpOnly: true`
    faktycznie obowiązuje przez cały cykl życia sesji (logowanie, odświeżenie w middleware,
    wylogowanie) — 18.5 spełnione dosłownie, nie tylko deklaratywnie.
  - Zgłoszone do `docs/wklad-do-standardu.md` (BŁĄD): 18.4 (Supabase) i 18.5 (czyste HttpOnly)
    kolidują dla "oczywistego" wzorca użycia biblioteki (klient przeglądarkowy do odczytu stanu
    logowania) — żaden z dwóch punktów standardu dziś o tym nie ostrzega.

  **Znalezisko #2 (18.8) — usuwanie konta całkowicie nieobecne.** Migracja SQL miała już
  `ON DELETE CASCADE` przygotowane (`supabase/migrations/0001_profiles.sql`), ale nic w kodzie nie
  wywoływało usunięcia wiersza `auth.users` — funkcja wymagana przez standard (nie opcjonalny
  wzorzec jak 18.7/18.14) po prostu nie istniała.

  **Zbudowane (ten sam wzorzec bezpiecznej degradacji co reszta szkieletu — bez realnych kluczy
  kod istnieje i się kompiluje, ale funkcjonalnie zwraca czytelny błąd zamiast awarii):**
  - `.env.example` — nowa `SUPABASE_SERVICE_ROLE_KEY` (jawnie NIE `NEXT_PUBLIC_`, komentarz
    ostrzegający + skąd wziąć). `lib/adapters/supabase/config.ts`:
    `isServiceRoleConfigured()`/`supabaseServiceRoleKey()`, ten sam wzorzec co
    `isSupabaseConfigured()` (placeholder = "nie skonfigurowane").
  - `lib/adapters/supabase/admin.ts` (nowy) — `createSupabaseAdminClient()`, klucz service role,
    **`import "server-only"`** (nowa zależność, `pnpm add server-only` — oficjalny pakiet
    Next.js/Vercel, czysto build-time, zero runtime — błąd builda, gdyby ten plik trafił
    przypadkiem do bundla klienckiego; klucz service role nigdy nie może dotrzeć do przeglądarki,
    ryzyko zbyt poważne, żeby polegać wyłącznie na dyscyplinie importów).
  - `lib/adapters/supabase/delete-account.ts` (nowy, `"use server"`) — weryfikuje zalogowanego
    usera, sprawdza `isServiceRoleConfigured()` (czytelny błąd, nie awaria, gdy brak klucza),
    `admin.auth.admin.deleteUser(user.id)` → CASCADE usuwa profil automatycznie → `signOut()` →
    `redirect("/auth/login")`. Klauzula 18.8 "administrator grupy nie może się usunąć" —
    nieaplikowalna dziś (brak modelu grupy, 18.7 nie zbudowane), odnotowana w komentarzu, nie
    pominięta po cichu.
  - `components/konto-sekcja.tsx` — przycisk "Usuń konto" (`variant="destructive"`),
    `window.confirm()` przed wywołaniem (proporcjonalne do skali — bez realnych kluczy i tak
    zawsze kończy się komunikatem błędu), stan `usuwam`/`błąd` lokalny w komponencie.

  **Przy okazji (18.5, obrona w głąb przeciw CSRF) — `/auth/signout` z Route Handlera na Server
  Action.** Było: `app/auth/signout/route.ts`, zwykły `POST`, zero ochrony CSRF poza samym
  `SameSite=Lax` cookie (co 18.5 explicite nazywa niewystarczające — "obrona w głąb, nie
  zamiennik"). Teraz: `app/auth/signout/actions.ts` (`"use server"`) — Next.js weryfikuje nagłówek
  Origin/Host przy każdym wywołaniu Server Action, mechanizm wbudowany w framework. **Nie jest to
  dosłownie "token CSRF" (synchronizer/double-submit) z litery 18.5** — zgłoszone do
  `docs/wklad-do-standardu.md` (POMYSŁ NA REGUŁĘ) jako otwarte pytanie, nie rozstrzygnięte
  samodzielnie: czy ochrona Origin/Host Next.js Server Actions spełnia wymóg 18.5, czy potrzebny
  jest dodatkowo prawdziwy token nawet na Server Actions. Server Action to i tak poprawa względem
  stanu wyjściowego (zero ochrony → ochrona frameworkowa) niezależnie od odpowiedzi.

  **Zweryfikowano:** `tsc --noEmit`/`pnpm lint` czyste (`.next/` wyczyszczone najpierw — stary
  wygenerowany `validator.ts` referencjonował usunięty `route.ts`, fałszywy błąd typów niezwiązany
  z kodem źródłowym, zniknął po `rm -rf .next`). `pnpm test` 709/709 (699 + 10 nowych,
  `lib/adapters/supabase/__tests__/config.test.ts`: `isSupabaseConfigured`/
  `isServiceRoleConfigured` z placeholderem i realną wartością, `sessionCookieOptions` — httpOnly
  zawsze true, sameSite=lax, secure zależny od `NODE_ENV`). `pnpm build` czysty. `pnpm start`+`curl`
  na `/kalkulatory/pomocnicze` i `/ustawienia` — oba 200, zero błędów w logu serwera, identyczne
  zachowanie jak przed zmianą (bez realnych kluczy `KontoSekcja` nadal zwraca `null` przed
  jakimkolwiek wywołaniem `getAccountStatus()`) — refaktoring nie zmienił zachowania apki dla
  użytkownika, tylko strukturę kodu pod spodem.

- **2026-09-16 — Audyt pełnego `docs/standards/` (00-18) + GOD BOOK na polecenie właściciela
  projektu ("Przeczytaj nowe standardy i god book dokładnie... Zrób listę do zrobienia").** Każdy
  z 19 rozdziałów przeczytany w całości (nie z metryczki/nagłówka), krzyżowo sprawdzony względem
  kodu przez `grep` tam, gdzie twierdzenie dało się sprawdzić programistycznie (14.3). Pełna lista
  w `docs/lista-do-zrobienia.md`, tu tylko streszczenie metody i największe znaleziska.

  **Cztery realne luki, w kolejności priorytetu:**
  1. Rozdz. 9 (AI w produkcie) — 9.0 mówi wprost "obowiązkowy element każdego projektu rodziny",
     nie moduł opcjonalny (w odróżnieniu od Y.10 GOD BOOK). Zero implementacji dziś.
  2. Rozdz. 12 (Freemium) — 12.8 "jedyny model rodziny". Zero implementacji, apka w 100% darmowa.
  3. 5.3 (PWA offline-first) — `CLAUDE.md` deklaruje "PWA offline-first", ale zero
     `manifest.json`/service workera/biblioteki PWA w `package.json`. `IndexedDbStorageAdapter`
     (5.2) działa od dawna (`use-persisted-draft.ts`) — to była tylko połowa wymogu 5.3, druga
     połowa (cache assetów przez SW) nigdy nie powstała i nikt tego wcześniej nie zauważył, bo
     żaden wcześniejszy audyt nie sprawdzał 5.3 dosłownie, tylko 5.1/5.2 (Seed/StorageAdapter).
  4. 18.3 (scalanie tożsamości) — już znane, bez zmian (patrz wpis wyżej, blokowane na żywe
     logowanie).

  **Świadomie NIE dodane jako nowe luki** (już znane/odłożone, żeby nie dublować): rollout i18n
  (89 plików/109 miejsc), 10.5 (audyt K1-K8, 116 modułów — rozłożony w czasie z definicji), 57
  pozycji `todo` w `docs/rejestr-pokrycia.md` (stress-test zimowy, w większości zależne).

  **Przy okazji znalezione i naprawione — higiena dokumentacji, nie nowa funkcja (14.2, jawna
  korekta nie ciche nadpisanie):**
  - `lib/adapters/storage-adapter.ts` — komentarz twierdził "apka nie ma jeszcze żadnej funkcji
    zapisującej Seed projektu, implementacja to osobne zadanie" — nieprawda od momentu powstania
    `IndexedDbStorageAdapter`/`use-persisted-draft.ts` (wcześniejsza sesja, nigdy nie wrócono
    poprawić ten konkretny komentarz). Poprawiony, odsyła teraz do realnej implementacji.
  - `docs/rejestr-pokrycia.md`, sekcja "Pozostałe moduły (6,7,10,11,12,13)" — z 30.08.2026,
    twierdziła "nie rozpoczęte" mimo że każdy z tych modułów ma dziś min. jeden ekran `done`
    (potwierdzone wierszami wyżej w tym samym pliku: M6 COP pompy ciepła, M7 Black Start, M10
    Prognozy, M11 Przygotowanie stanowiska + Montaż baterii, M12 Tryb uproszczony, M13 Tryb Live).
    Stary tekst zostawiony (nie usunięty), oznaczony jako korekta, z odsyłaczem do aktualnego stanu.
  - **Wzorzec do zapamiętania:** oba znaleziska to ten sam kształt błędu — komentarz/notatka
    napisana w momencie "jeszcze nie zbudowane", nikt nie wrócił jej poprawić, gdy budowa faktycznie
    nastąpiła w innej sesji/innym wątku pracy. Warte uwagi przy przyszłych audytach: szukać nie
    tylko brakującego kodu, ale też komentarzy/dokumentacji, które kłamią o istniejącym kodzie w
    drugą stronę (twierdzą "nie ma", a jest).

  Następny krok (na wyraźne polecenie): rozdz. 9 (AI w produkcie), patrz kolejny wpis.

- **2026-09-16 — Rozdz. 9 (AI w produkcie): pierwsza realna integracja, "Zapytaj asystenta" na
  `/kalkulatory/pomocnicze`.** Zakres celowo wąski (ten sam rytm co rollout i18n, 17.9: moduł po
  module, nie big bang) — jedno narzędzie AI, jeden ekran pilotażowy. Decyzje warte zapamiętania:

  - **`@anthropic-ai/sdk` 0.126.0 (aktualnie zainstalowana wersja) nie ma jeszcze beta Tool
    Runnera ani `betaZodTool`/`client.beta.messages.toolRunner`** — zweryfikowane wprost przez
    `find`/`grep` w `node_modules` przed napisaniem kodu (nie zgadywane z priorów treningowych,
    zgodnie z dyscypliną skilla `claude-api`: "Never guess SDK usage"). Zamiast tego użyto w pełni
    udokumentowanego, stabilnego wzorca ręcznej pętli agentowej (manual agentic loop) z tego
    samego skilla. **Jeśli w przyszłości SDK zostanie zaktualizowane**, warto rozważyć migrację na
    Tool Runner (mniej kodu do utrzymania) — nie zrobione teraz świadomie, nie przeoczenie.
  - **`z.toJSONSchema()`** (Zod v4, już zależność projektu) generuje `Anthropic.Tool.InputSchema`
    bezpośrednio ze schematu Zod narzędzia — bez dodatkowej biblioteki/helpera. `Tool.InputSchema`
    ma indeks `[k: string]: unknown`, więc toleruje dodatkowe pole `$schema`, które Zod dokłada.
  - **Rejestr narzędzi AI jest z natury heterogeniczny** (różne `TInput`/`TOutput` per narzędzie)
    — próba otypowania tablicy rejestru jako `AiToolDefinition<never, never>` dała błędy wariancji
    TypeScript (`TS2352`/`TS2345`). Rozwiązanie: `AiToolDefinition<any, any>` na granicy rejestru
    (`lib/ai/types.ts`, `lib/ai/to-anthropic-tool.ts`, `lib/ai/pytaj-asystenta.ts`), z komentarzem
    uzasadniającym + `eslint-disable-next-line @typescript-eslint/no-explicit-any` — pojedyncza
    definicja narzędzia (np. `kalkulatoryPomocniczeTool`) zostaje w pełni typowana w swoim miejscu
    deklaracji, `any` jest tylko wymazaniem typu na granicy, nie utratą bezpieczeństwa.
  - **Pułapka złapana przy pierwszym podejściu:** `eslint-disable-next-line` wyłącza regułę
    wyłącznie dla linii bezpośrednio pod dyrektywą — komentarz wyjaśniający w 2-3 liniach
    umieszczony NAD dyrektywą (zamiast pod nią, tuż nad kodem) sprawia, że dyrektywa "next line"
    trafia w kolejną linię komentarza, nie w kod, i `pnpm lint` zgłasza jednocześnie "unused
    eslint-disable directive" ORAZ oryginalny błąd `no-explicit-any` na tej samej linii. Poprawny
    wzorzec: wyjaśnienie jako zwykłe komentarze, `eslint-disable-next-line` jako **ostatnia** linia
    tuż przed kodem, którego dotyczy.
  - `eslint.config.mjs` (presety `eslint-config-next/core-web-vitals` + `.../typescript`) **ma
    aktywną regułę `@typescript-eslint/no-explicit-any` jako błąd** (nie tylko warning) — mimo że
    nie widać jej jawnie w pliku configu (dziedziczona z presetu). Sprawdzone programistycznie
    (`pnpm lint`), nie zgadywane z samej treści configu.
  - **9.4 (obrona przed prompt injection) rozstrzygnięta jako dziś niskie ryzyko, nie pominięta:**
    jedyny wektor wejścia to tekst pytania użytkownika, już traktowany jako zwykły `tool_result`/
    `user` content w kolejnej turze pętli, nigdy nie wstrzykiwany do `system`. Ryzyko wzrośnie,
    gdy pojawi się import zdjęć/dokumentów (AI_CAMERA-owy wzorzec z planu) — wtedy 9.4 wymaga
    ponownego przejrzenia.
  - Świadomie odłożone (nie przeoczenie): więcej narzędzi/ekranów AI, `AiMode` (9.6) nie
    podłączony do trwałego stanu (dziś tylko `CLOUD_ASSISTED` ma sens — brak modelu lokalnego),
    pamięć rozmowy czatu (9.7), budżet/limity zapytań (9.8). Pełny zakres i lista plików:
    `docs/lista-do-zrobienia.md`.

- **2026-09-16 — 5.3 (PWA offline-first): manifest + service worker.** Zakres: `app/manifest.ts`
  (Next.js Metadata File convention), `public/sw.js` (ręczny, bez biblioteki typu next-pwa/
  Serwist — 5.3 dla tego projektu to wąski wymóg: cache assetów + stron po pierwszym pobraniu,
  nie pełny runtime-caching framework; własny, w pełni audytowalny kod pasuje lepiej niż czarna
  skrzynka generowana przez bibliotekę, zwłaszcza przy już restrykcyjnej, ręcznie pisanej CSP w
  `next.config.mjs`), `public/register-sw.js` + warunkowy `<script src>` w `app/layout.tsx`.

  **Odkrycie krytyczne, poza zakresem tego zadania — udokumentowane, NIE naprawione na wyraźne
  polecenie właściciela projektu ("poprawki idą z aktualizacją standardu, zaczekaj"):**
  Podczas weryfikacji w prawdziwej przeglądarce z produkcyjną CSP (`pnpm build && pnpm start`,
  Playwright, nie `pnpm dev` gdzie CSP jest złagodzone o `unsafe-inline`) odkryłem, że **hydracja
  Reacta psuje się na każdym ekranie aplikacji** — `React error #412`. Przyczyna: CSP `script-src`
  w `next.config.mjs` dopuszcza wyłącznie jeden zahardkodowany SHA-256 hash (dla
  `WYGLAD_INIT_SCRIPT`, ustawiającego motyw przed pierwszym malowaniem) — nie obejmuje to
  inline-skryptów RSC streaming (`self.__next_f.push(...)`), które Next.js App Router generuje
  dynamicznie, per żądanie, na każdej stronie. Statyczny hash z definicji nie może objąć treści,
  która różni się między requestami. **Zweryfikowane programistycznie, że to błąd pre-existing,
  niespowodowany tą zmianą:** identyczny błąd reprodukuje się na czystym `main` (commit `b5fb177`,
  sprzed PWA), sprawdzone w izolowanym `git worktree`. Najpewniej niewykryte wcześniej, bo cała
  dotychczasowa weryfikacja w przeglądarce w tej sesji szła przez `pnpm dev` (złagodzona CSP), a
  nie przez `pnpm start` z prawdziwą produkcyjną CSP — pierwszy raz w tej sesji przetestowano
  rzeczywistą produkcyjną hydrację w realnej przeglądarce.
  **Właściwa naprawa** (zgłoszona właścicielowi, do decyzji): CSP oparta o nonce-per-request
  (oficjalny wzorzec Next.js — middleware generuje losowy nonce na każde żądanie, obejmuje
  wszystkie skrypty w tym RSC), zamiast statycznego hasha — silniejsze bezpieczeństwo niż dziś,
  bez `unsafe-inline`. Wymaga zmiany `next.config.mjs` (nagłówki przez middleware, nie statyczną
  funkcję `headers()`) + `app/layout.tsx` (nonce w inline skrypcie motywu). **Świadomie
  odłożone** — właściciel projektu: poprawki mają nadejść z aktualizacją standardu, czekamy.
  **Wpływ na to zadanie:** rejestracja service workera została celowo zaprojektowana tak, by NIE
  zależeć od hydracji Reacta — zewnętrzny plik (`public/register-sw.js` przez `<script src>` w
  `<head>`, warunkowany `process.env.NODE_ENV === 'production'` tym samym wzorcem co
  `<Analytics />`), nie komponent kliencki w drzewie Reacta. CSP `script-src 'self'` obejmuje
  zewnętrzne skrypty tej samej domeny bez potrzeby hasha (hash dotyczy wyłącznie treści inline)
  — to ominięcie problemu w zakresie własnego zadania, nie naprawa samego problemu CSP.
  Potwierdzone działające mimo błędu hydracji: SW rejestruje się automatycznie (Playwright,
  `pnpm start`), manifest serwowany poprawnie, strona odwiedzona wcześniej ładuje się offline.
  **Wzorzec do zapamiętania:** weryfikacja przez `pnpm dev` nie jest wystarczająca dla niczego
  związanego z CSP/bezpieczeństwem nagłówków — `pnpm dev` celowo osłabia CSP (`unsafe-inline`/
  `unsafe-eval` dla HMR), więc maskuje dokładnie tę klasę błędów. Przyszła weryfikacja
  bezpieczeństwa/CSP wymaga `pnpm build && pnpm start` + prawdziwej przeglądarki, nie samego
  `curl` (curl nie wykonuje JS, nie zobaczy naruszeń CSP) ani `pnpm dev`.

  **Świadomie odłożone (nie przeoczenie), zgłoszone jawnie w raporcie końcowym:** ikony PWA
  (192/512px, `icon.svg`, `apple-icon.png`) to nadal domyślny znak graficzny v0.app (szkielet, z
  którego projekt wystartował) — `app/layout.tsx` miał też tytuł "v0 App"/"Created with v0",
  nigdy niewypełniony realną nazwą projektu; to akurat poprawione od razu (nie decyzja wizualna,
  tylko nieuzupełniony placeholder — realna nazwa "Inżynier Offgrid Pro" już ustalona wszędzie
  indziej w repo). Własne logo to decyzja wizualna właściciela, nie techniczna — pozostawiona do
  osobnego rozstrzygnięcia.

- **2026-09-16 (czwarta synchronizacja tego dnia) — Aktualizacja ze standardem, 7 wpisów
  `AKTUALIZACJE.md` (wiersze 67-73).** GOD BOOK bez zmiany wersji (nadal v2.19 — brak nowego
  rename pliku w tej partii). Nadpisane w całości (NIETYKALNE): `00-INDEKS.md`,
  `07-bezpieczenstwo.md`, `15-wspolpraca-z-ai.md`, `17-i18n.md`, `18-logowanie.md`.

  **Przetworzone wiersz po wierszu:**
  - **67 (18.5 doprecyzowana)** — pułapka `createBrowserClient()`/`httpOnly:false` + rozstrzygnięcie
    Origin/Host jako CSRF dla Server Actions. To dosłownie **nasze własne zgłoszenie** z pracy nad
    rozdz. 18 tego samego dnia (`docs/wklad-do-standardu.md`), teraz skonsolidowane z powrotem do
    standardu. Zero akcji — już zgodni (`lib/adapters/supabase/client.ts` usunięty, stan logowania
    czytany wyłącznie server-side, PR #96).
  - **68 (17.4 uproszczona)** — cookie+server-side obowiązkowy dla KAŻDEGO projektu z jakimkolwiek
    runtime server-side (koniec oceny "SPA czy nie"). Zero akcji — już tak mamy (cookie `jezyk`,
    nigdy `localStorage`).
  - **69 (15.17 rozszerzona)** — przy niejednoznacznym poleceniu o "aktualizacji standardu"
    pierwszy krok to zawsze `git fetch` + odczyt `AKTUALIZACJE.md` przed budową czegokolwiek.
    Dokładnie to zrobione w tej synchronizacji. Zero akcji w kodzie.
  - **70 (nowa 7.3 — hash CSP liczony automatycznie) — JEDYNE konkretne zadanie kodowe z tej
    partii, nazwane wprost dla tego projektu.** Zbudowano `scripts/check-csp-hash.mjs` (liczy
    SHA-256 z treści `WYGLAD_INIT_SCRIPT` w `app/layout.tsx`, porównuje z `WYGLAD_INIT_SCRIPT_HASH`
    w `next.config.mjs`, exit 1 przy rozjeździe), dopięty do CI (`pnpm check:csp-hash`, krok w
    `.github/workflows/ci.yml` obok `check:i18n-guard`). Zweryfikowany na obu przypadkach (zgodny
    hash → OK; ręcznie zepsuty skrypt → wykryty).
    **🔴 Jawne rozróżnienie, żeby nie pomylić dwóch różnych problemów CSP w tym samym pliku:**
    ten wpis rozwiązuje wyłącznie ryzyko *rozjazdu* hasha jednego, konkretnego, już istniejącego
    skryptu po jego edycji — **nie** rozwiązuje krytycznego znaleziska z tej samej sesji (wpis PWA
    wyżej): produkcyjna CSP z definicji nie może dopuścić przez statyczny hash inline-skryptów RSC
    streaming, które Next.js generuje dynamicznie per-request, więc hydracja Reacta nadal psuje
    się na każdym ekranie w realnej produkcji. Właściwa naprawa (nonce-per-request) nie jest dziś
    częścią standardu — sprawdzone wprost w tej samej partii `AKTUALIZACJE.md`, żaden z 7 wpisów
    tego nie porusza. Pozostaje odłożona zgodnie z wcześniejszą decyzją właściciela projektu.
  - **71 (5.2 doprecyzowana)** — wzorzec blokującego skryptu pre-paint dla przełączników CSS
    (motyw/kontrast) potwierdzony jako poprawny, z tym projektem jako wzorzec źródłowy. Akcja
    nazwana dla innego projektu rodziny (inzynier-szkieletowy-pro), nie dla nas. Zero akcji.
  - **72 (nowa 17.8 — domyślne języki EN+RU)** — wpis wprost potwierdza: "inzynier-offgrid-pro:
    już zgodny (pl/en/ru zbudowane) — bez akcji." Zero akcji.
  - **73 (nowa 15.18)** — metareguła procesowa dla sesji nad `new-app-standards` (konsolidacja
    niesie gotową receptę innym projektom). Nie dotyczy kodu tego projektu.

  Zweryfikowane po zmianach: `pnpm typecheck`/`lint`/`check:csp-hash`/`check:i18n-guard`/`test`
  (722/722)/`build` — wszystkie czyste.

- **2026-09-16 (piąta synchronizacja tego dnia) — Naprawiony krytyczny błąd CSP/RSC streaming:
  nonce-per-request zastąpił hash-based CSP.** Zamknięcie pętli: błąd znaleziony przy pracy nad
  5.3 (PWA), zgłoszony do `docs/wklad-do-standardu.md` (PR #101), skonsolidowany przez
  `new-app-standards` tego samego dnia z konkretną, jednoznaczną akcją — "przejdź na
  nonce-per-request w middleware, nie auto-liczony hash — to teraz błąd produkcyjny aktywny, nie
  tylko ryzyko" (`AKTUALIZACJE.md`, wiersz 74, KOREKTA tego samego dnia co wiersz 70).

  **Implementacja:**
  - `middleware.ts` — nowa funkcja `buildCsp(nonce)` (przeniesiona z `next.config.mjs`, z
    `script-src` opartym o `'nonce-{wartość}'` zamiast hasha w produkcji; dev bez zmian —
    `'unsafe-inline' 'unsafe-eval'` dla HMR). Nonce generowany raz na żądanie
    (`crypto.randomUUID()`), ustawiany jako nagłówek żądania `x-nonce` (propagowany do Server
    Componentów) ORAZ jako nagłówek odpowiedzi `Content-Security-Policy` (przez nową funkcję
    `zastosujCsp()`, wywoływaną na wszystkich trzech ścieżkach zwrotu middleware — bez
    Supabase, po przekierowaniu do loginu, i na ścieżce normalnej — żadna odpowiedź nie omija
    CSP).
  - `next.config.mjs` — CSP całkowicie usunięta stąd (statyczna funkcja `headers()` nie ma
    dostępu do per-request nonce'u, z definicji nie może wygenerować poprawnej CSP dla tego
    wzorca) — zostają tylko pozostałe, statyczne nagłówki bezpieczeństwa (X-Frame-Options itd.).
  - `app/layout.tsx` — `const nonce = (await headers()).get('x-nonce')`, dokładany jawnie do
    obu własnych `<script>` (inline `WYGLAD_INIT_SCRIPT` i zewnętrzny `register-sw.js`). Next.js
    automatycznie dokłada ten sam nonce do własnych, dynamicznie generowanych inline-skryptów
    (RSC streaming), gdy wykryje go w nagłówku odpowiedzi — to jest właściwy mechanizm, nie coś
    do ręcznej implementacji.
  - Usunięty `scripts/check-csp-hash.mjs` + krok w CI + skrypt w `package.json` — nieaktualny,
    nie ma już hasha do zweryfikowania (zastąpiony wzorzec nie używa hasha wcale).

  **Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  prawdziwa produkcyjna CSP z nagłówkiem realnie zawierającym `'nonce-...'`, sprawdzone przez
  `curl -D -`):** zero błędów CSP w konsoli (poprzednio: seria `Refused to execute inline
  script`), zero `React error #412`. **Kluczowy dowód, że to nie tylko "strona się renderuje"**
  (SSR HTML wygląda poprawnie nawet gdy hydracja jest zepsuta — to właśnie zmyliło wcześniejsze
  sesje): zmiana trybu w selektorze na `/kalkulatory/pomocnicze` po załadowaniu strony realnie
  przelicza wynik na żywo (9.058 A → 1200.000 Wh) — to wymaga działających event handlerów
  Reacta, niemożliwych bez udanej hydracji. Service worker (5.3) rejestruje się automatycznie
  (nie tylko przez obejście z zewnętrznego `<script src>` — teraz działałby nawet jako zwykły
  komponent kliencki, obejście zostaje jako dodatkowa odporność, nie jedyny mechanizm). Offline
  nadal działa. Dodatkowo zweryfikowany `pnpm dev` — CSP złagodzona jak wcześniej, cookie języka
  nadal poprawnie ustawiana, middleware nie zaregresował.

  **Wzorzec do zapamiętania:** to zamyka temat otwarty w dwóch wcześniejszych wpisach tego dnia
  (5.3/PWA i aktualizacja ze standardem) — oba jawnie ostrzegały "to NIE jest naprawiony błąd,
  tylko auto-liczony hash dla innego, węższego problemu". Naprawa faktycznie nadeszła tego
  samego dnia przez kanał `wklad-do-standardu.md` → konsolidacja → `AKTUALIZACJE.md`, dokładnie
  tak, jak przewiduje mechanizm U.2/U.4 GOD BOOK — potwierdzenie, że ten proces działa
  end-to-end w praktyce, nie tylko w teorii dokumentu.

- **2026-09-16 — Start rolloutu treści i18n (17.9: moduł po module), pierwsza partia — 3 moduły.**
  Kontekst: audyt wcześniej dziś ustalił, że infrastruktura i18n jest gotowa, ale treść
  zmigrowana tylko w 1/90 plików `warnings.ts` (pilotaż `kalkulatory-pomocnicze`). Właściciel
  projektu: zacznij rollout. Wybór pierwszej partii: 3 z 6 modułów, których strony UI JUŻ
  korzystały z `useTranslate()` (widoczne przez wcześniejsze podłączenie tych stron do i18n bez
  migracji treści źródłowej) — `systemy-podtrzymania-zycia`, `cop-pompy-ciepla`,
  `lokalizacja-i-klimat`. Pozostałe 3 z tej szóstki (`czystosc-i-snieg`,
  `porownanie-technologii`, `prognozy`) celowo pominięte w tej partii — mają trudniejszy kształt
  problemu (patrz niżej), nie prosty `Warning.message`/`assumptions` string.

  **8 nowych kluczy słownika** (`WARTOSC-POZA-ZAKRESEM`, `POZYCJA-NIEDODATNIA`,
  `BRAK-ZAZNACZONYCH`, `POZYCJA-WARTOSC-DOMYSLNA`, `COP-POZA-ZAKRESEM`,
  `MOC-CIEPLNA-NIETYPOWO-WYSOKA`, `COP-ZALEZY-OD-TEMPERATURY`, `DANE-KLIMATYCZNE-TRYB-OFFLINE`) w
  `dictionary-{pl,en,ru}.ts`. Jeden klucz z pilotażu (`WARTOSC-NIEDODATNIA`) okazał się od razu
  wielokrotnego użytku — `cop-pompy-ciepla`'s `notPositive` ma identyczny kształt komunikatu, więc
  reużyty bez tworzenia duplikatu (dowód, że wspólny słownik zapobiega dryfowi identycznych
  komunikatów rozjeżdżających się osobno per moduł).

  **🔴 Realny błąd znaleziony PRZED uruchomieniem, przez czytanie kodu, nie przez awarię w
  przeglądarce — warty zapamiętania jako wzorzec audytu.** Wszystkie trzy docelowe strony
  (`app/kalkulatory/{systemy-podtrzymania-zycia,cop-pompy-ciepla,lokalizacja-i-klimat}/page.tsx`)
  renderowały `warnings` przez samo `{w.message}`, BEZ fallbacku `?? t(w.i18nKey ?? w.code,
  w.params)` — w odróżnieniu od `assumptions` na tych samych stronach, które już miały poprawny
  wzorzec, i od współdzielonego `components/wzorce/wynik-szczegoly.tsx` (używanego przez ~70
  innych stron), który też ma to poprawnie. Skutek, gdyby to przeoczyć: po usunięciu
  `Warning.message` z tych trzech modułów (co ta migracja właśnie robi), ostrzeżenia
  renderowałyby się jako **puste teksty** — `{w.message}` samo w sobie, bez `?? t(...)`, po
  prostu wypisuje `undefined` jako nic. Naprawione — dodany brakujący fallback we wszystkich
  trzech miejscach, zanim treść została zmigrowana (nie po fakcie).
  **Wzorzec do zapamiętania dla kolejnych partii:** "strona już używa `useTranslate()`" nie jest
  dowodem, że KAŻDA ścieżka renderowania na niej faktycznie tłumaczy — `assumptions` i `warnings`
  to dwie niezależne ścieżki kodu na tej samej stronie, obie trzeba sprawdzić osobno przed
  migracją treści źródłowej, nie zakładać z faktu importu `useTranslate()`.

  **Napotkane, świadomie odłożone przypadki trudniejsze niż `i18nKey`/`params`** (do rozważenia w
  osobnej sesji/partii, nie tego samego kształtu co reszta rollout):
  - `czystosc-i-snieg` — `CalcResult.value` (nie `warnings`/`assumptions`) zawiera bezpośrednio
    tekst PL: `KAT_OPISY` (Record z gotowym opisem per pasmo kąta) i `powod` (budowany przez
    interpolację string w `ocenHarmonogramCzyszczenia`). Migracja wymaga zmiany kształtu typu
    wyniku (`KatSamooczyszczaniaResult`/`HarmonogramCzyszczeniaResult`) na `opisKey`/`powodKey` +
    `params`, nie tylko podmiany `message`→`i18nKey` — większa zmiana kontraktu, nie ten sam
    wzorzec co reszta partii.
  - `porownanie-technologii` — `BATTERY_TECHNOLOGIES` w `constants.ts` zawiera nazwy/opisy
    technologii bateryjnych po polsku — to dane katalogowe, nie komunikaty `Warning`/
    `Assumption`; wymaga osobnej decyzji architektonicznej (czy katalog danych referencyjnych
    dostaje własny mechanizm i18n, czy zostaje częścią "profilu regionalnego" z 02-model-danych),
    nie mieści się w istniejącym wzorcu `i18nKey`/`params` bez zmiany.
  - `prognozy` — nie sprawdzone jeszcze w tej sesji (brak `warnings.ts`, moduł typu "raport" —
    może mieć własny kształt tekstu osadzonego w wyniku, analogicznie do `czystosc-i-snieg`).

  Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`,
  wszystkie 3 moduły × PL/EN/RU, osobno `assumptions` i osobno `warnings` — formularze faktycznie
  wypełniane, nie tylko stan początkowy): poprawny przetłumaczony tekst w każdym przypadku, zero
  znaczników `⚠ [...]`, zero błędów konsoli związanych z i18n. 8 nowych testów: parytet/
  podstawianie parametrów dla nowych kluczy w `lib/i18n/__tests__/t.test.ts` + w każdym z 3
  modułów asercja, że `warnings`/`assumptions` mają `i18nKey`/`kod`+`params` i `message ===
  undefined` (17.9: test treściowy w tej samej turze co treść, nie później).
  `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (730/730)/`build` czyste.

## Rollout i18n — druga partia (18.09.2026)

Kontynuacja partii 1 (wpis wyżej), ten sam wzorzec plikowy. Zmigrowane: `liczba-domownikow`,
`dni-autonomii`, `moc-pozorna-cosfi` (Moduł 2). 8 nowych kluczy w `dictionary-{pl,en,ru}.ts`,
`WARTOSC-NIEDODATNIA` reużyty dla `moc-pozorna-cosfi`'s `notPositive` (identyczny tekst źródłowy).

**Pułapka złapana przed commitem, nie po:** istniejący klucz `SPRAWNOSC-POZA-ZAKRESEM` (z pilota
`kalkulatory-pomocnicze`) znaczy "sprawność jako ułamek z przedziału (0, 1]". Funkcja
`dni-autonomii/warnings.ts`'s `sprawnoscPozaZakresem` waliduje **inny** zakres — procentowy
0–100% (`sprawnoscFalownikaPct`). Nazwa funkcji sugerowałaby reużycie tego samego klucza, ale
treść żródłowa jest inna — nowy klucz `SPRAWNOSC-PROCENT-POZA-ZAKRESEM` zamiast kolizji dwóch
różnych znaczeń pod jednym kodem. Zasada do zapamiętania: nazwa funkcji/`Warning.code` w module A
nigdy nie jest wystarczającym dowodem, że pasujący z nazwy klucz w słowniku (dodany przy innym
module) niesie tę samą treść — zawsze porównać oryginalny tekst PL słowo w słowo.

**Ten sam wzorzec błędu z partii 1, znaleziony ponownie (2 z 3 stron):** `dni-autonomii/page.tsx`
i `moc-pozorna-cosfi/page.tsx` w ogóle nie importowały `useTranslate()` i renderowały `{w.message}`
bez żadnego fallbacku — nie tylko brak `?? t(...)`, ale zero mechanizmu i18n na stronie mimo że
moduł domenowy już był migrowany. `liczba-domownikow/page.tsx` był już poprawny (korzysta z
współdzielonego `components/wzorce/wynik-szczegoly.tsx`). Potwierdza regułę z partii 1: sprawdzić
rendering `warnings`/`assumptions` na KAŻDEJ stronie osobno, przed usunięciem `message` z
domeny — "moduł ma i18nKey" nie znaczy "strona to pokaże poprawnie".

Zweryfikowane end-to-end w realnej przeglądarce (Playwright, `pnpm build && pnpm start`, wszystkie
3 moduły × PL/EN/RU, formularze faktycznie wypełnione): poprawny tekst, zero `⚠ [...]`, zero
błędów konsoli i18n. 8 nowych testów (ten sam wzorzec co partia 1, `t.test.ts` + asercje per
moduł, ta sama tura co treść). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (738/738)/`build`
czyste. Pozostało ~83 pliki; `czystosc-i-snieg`/`porownanie-technologii` nadal odłożone bez zmian.

## Rollout i18n — trzecia partia i decyzja o kontynuacji do końca (18.09.2026)

Właściciel: "Kontynuuj dopóki nie zakończysz tych 83 plików" — od tej partii, żeby nie mnożyć
cykli PR/CI/merge na 80+ plikach, partie rosną (5+ modułów naraz zamiast 3), proces per moduł
zostaje identyczny (dictionary keys → warnings.ts/calculator.ts → MIGRATED_MODULES → sprawdzenie
renderowania na stronie → testy w tej samej turze → pełna weryfikacja → Playwright → docs).

Zmigrowane: `baterie/{chlodzenie-latem,cold-c-rate,cold-cranking-amps,detekcja-doziemienia,
detekcja-zwarcia-efuse}`. 18 nowych kluczy. Nowy generyczny klucz `WARTOSC-UJEMNA` (`{label} nie
może być ujemna.`) — celowo osobny od `WARTOSC-NIEDODATNIA` (>0 wymagane) i od
`ZAPOTRZEBOWANIE-UJEMNE` (specyficzny dla jednego pola) — semantyka ">=0 wymagane" różni się od
obu, więc dostał własny reużywalny klucz zamiast doraźnego per-modułowego.

**Znaleziony trzeci raz ten sam wzorzec: strony renderujące `{w.message}` bez `?? t(...)`.**
Naprawione w 4 stronach. Osobno, niezależnie od i18n: `cold-cranking-amps/page.tsx` w ogóle nie
przekazywało `warnings` do `WynikSzczegoly` w gałęzi sukcesu — ostrzeżenie bezpieczeństwa
("Falownik się wyłączy") nigdy się nie wyświetlało. Naprawione jednym propsem.

**Pułapka narzędziowa (proces, nie kod):** poprzedni `pkill -f "next start"` po partii 2 nie
trafił w rzeczywisty proces — Next.js produkcyjny serwer nazywa się `next-server` w `ps aux`, nie
`next start` (to nazwa skryptu npm, nie procesu). Stary serwer został żywy na porcie 3000 i
serwował przestarzały build bez nowych kluczy — pierwszy przebieg Playwright dał fałszywy
`⚠ [BRAK-ZABEZPIECZENIA-DOZIEMIENIA]`, mimo że kod i testy jednostkowe były poprawne. Naprawa:
`pkill -9 -f "next-server"` + świeży `pnpm build && pnpm start` + powtórna weryfikacja (czysta).
**Zasada do zapamiętania:** po każdej partii sprawdzać `ps aux | grep next-server` przed
Playwright, nie ufać, że poprzedni `pkill` faktycznie coś zabił bez weryfikacji.

`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (746/746)/`build` czyste. Zweryfikowane w
przeglądarce PL/EN/RU, zero `⚠ [...]` po naprawie procesu. Pozostało ~76 plików.

## Rollout i18n — czwarta partia: luka w strażniku + pierwszy przypadek "dane katalogowe" poza planem (18.09.2026)

Zmigrowane: `dobor-bezpiecznika-dc`, `dobor-pojemnosci`, `grzalki-bms-mroz`, `kalibracja-soc`,
`koniec-ladowania`. **Dwie realne luki znalezione tym razem, nie tylko powtórka znanego wzorca:**

1. **Strażnik i18n nie sprawdzał `validation.ts`.** `scripts/check-i18n-guard.mjs` miał
   `FILES_TO_CHECK = ["warnings.ts", "calculator.ts"]` — inline `Warning` literały wpisane
   bezpośrednio w `validateInput()` (poza funkcjami z `warnings.ts`) nigdy nie były sprawdzane.
   Znaleziono dwa realne przypadki: `chlodzenie-latem/validation.ts` (już "zmigrowany" moduł z
   partii 3 — przeoczony wtedy) i `koniec-ladowania/validation.ts` (ten sam problem w bieżącej
   partii). Naprawa: `FILES_TO_CHECK` rozszerzone o `validation.ts`, oba przypadki zmigrowane,
   test retroaktywnie dopisany do `chlodzenie-latem.test.ts`. **Zasada na przyszłość: przy każdym
   kolejnym module sprawdzić `grep message: validation.ts`, nie tylko `warnings.ts`/`calculator.ts`
   — silnik strażnika teraz to egzekwuje automatycznie, ale ręczne przeszukanie przed edycją nadal
   oszczędza cykl.**

2. **Pierwszy nowy przypadek "dane katalogowe" poza `czystosc-i-snieg`/`porownanie-technologii`:**
   `komunikacja-bms` odłożony. Jego ostrzeżenia wstawiają `etykieta(id)` z `PROTOKOLY` w
   `constants.ts` — katalog 5 protokołów, gdzie 3 to czyste akronimy techniczne (CAN, RS485,
   Modbus, niewymagające tłumaczenia), ale 2 zawierają polski tekst opisowy ("Pylontech (protokół
   producenta)", "Inny / nieznany"). Zmigrowanie samego `Warning` bez migracji katalogu dałoby
   pół-przetłumaczony komunikat w EN/RU (angielski/rosyjski tekst z wtrąconym polskim fragmentem)
   — ten sam problem architektoniczny, co already-deferred `porownanie-technologii`. Dodany do tej
   samej kolejki "wymaga osobnej decyzji o mechanizmie i18n dla danych katalogowych", nie do
   głównego rollout'u.

3 strony naprawione (ten sam wzorzec `{w.message}` bez fallbacku). `MIGRATED_MODULES`: 12→17.
`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (753/753)/`build` czyste. Zweryfikowane w
przeglądarce PL/EN/RU (z jawnym potwierdzeniem `ps aux | grep next-server` przed testem — lekcja z
poprzedniej partii zastosowana). Pozostało ~71 plików + `komunikacja-bms` w kolejce "danych
katalogowych" obok `czystosc-i-snieg`/`porownanie-technologii`.

## Rollout i18n — piąta partia: wzorzec "słowo-parametr jako identyfikator wariantu" (18.09.2026)

Zmigrowane: `long-term-storage`, `mixing-rownolegle`, `modul-ev`, `obwod-precharge`,
`pobor-wlasny-bms`. 15 nowych kluczy.

**Trzeci odrębny typ pułapki znaleziony w tej sesji rolloutu (po: brak fallbacku w UI; luka w
strażniku dot. `validation.ts`):** `modul-ev`'s `pokryteWCalosci`/`brakujeEnergii` przyjmowały
dosłowny polski tekst `"Latem"`/`"Zimą"` jako parametr, wstawiany wprost do treści komunikatu.
Naiwna migracja (`i18nKey` + `params: {sezon}`) wstawiłaby polskie słowo w środku przetłumaczonego
zdania EN/RU — ten sam rodzaj problemu co katalog `komunikacja-bms`, ale tu naprawialny bez
przebudowy architektury, bo zbiór wariantów jest zamknięty i mały (2 sezony). Rozwiązanie:
`Sezon = "lato" | "zima"` jako identyfikator (nie tekst), i18nKey wybierany warunkowo per wariant
(`POKRYTE-W-CALOSCI-LATO`/`-ZIMA` itd.), sezon zaszyty w przetłumaczonym tekście klucza zamiast
przekazywany jako `{param}`. Dodany test wprost weryfikujący, że oba klucze dają różny tekst w
każdym języku (regresja tego wzorca — np. przypadkowe scalenie z powrotem w jeden klucz z
parametrem — byłaby niewidoczna bez takiego testu).

**Zasada ogólna do stosowania w kolejnych partiach:** gdy funkcja `warnings.ts` przyjmuje string,
który jest jednocześnie (a) czymś widocznym dla użytkownika w oryginalnym tekście PL i (b)
parametrem sterującym doborem treści (nie czystą liczbą/etykietą pola przepisywaną 1:1) — sprawdzić
najpierw, czy to zamknięty, mały zbiór wariantów (→ osobne i18nKey per wariant, jak tu) czy
otwarty katalog (→ odłożyć do kolejki "danych katalogowych", jak `komunikacja-bms`/
`porownanie-technologii`/`czystosc-i-snieg`).

`MIGRATED_MODULES`: 17→22. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (761/761)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU, spot-check `modul-ev`/EN potwierdził poprawne
"Summer:"/"Winter:" w tłumaczonym zdaniu (nie "Latem:"/"Zimą:"). Pozostało ~66 plików.
`napiecie-systemowe` (377 linii — moduł istotnie rozbudowany w tej sesji, Etapy A-H) świadomie
odłożony do osobnej, dedykowanej partii ze względu na rozmiar, nie łączony z resztą `baterie/`.

## Rollout i18n — szósta partia: strażnik `validation.ts` udowodnił swoją wartość (18.09.2026)

Zmigrowane: `ochrona-wilgoc`, `oplacalnosc-magazynu`, `pozycjonowanie-ogniw`, `second-life`,
`slabe-ogniwo`. 22 nowe klucze.

Rozszerzenie strażnika z partii 4 (`FILES_TO_CHECK` → `validation.ts`) po raz pierwszy realnie
zadziałało w tej partii, zanim cokolwiek trafiło do PR: `pozycjonowanie-ogniw/validation.ts` miał
inline `Warning` z gotowym tekstem PL (`DOCISK-UJEMNY`), a `second-life/calculator.ts` — osobny
przypadek, inline `Warning` w gałęzi `sohSzacowanyPct === 0` (`SOH-ZEROWY`), nie wywołanie funkcji
z `warnings.ts` jak reszta. Oba znalezione i naprawione w tej samej turze migracji, przed
uruchomieniem `check:i18n-guard` — potwierdza, że rozszerzenie strażnika o `validation.ts` z
partii 4 było warte zrobienia, nie tylko teoretyczną poprawką.

5 stron UI naprawionych (ten sam, czwarty z rzędu, wzorzec `{w.message}` bez fallbacku).
`MIGRATED_MODULES`: 22→27. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (768/768)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (z potwierdzeniem braku rezydualnego procesu
`next-server` przed startem — lekcja z partii 3 stosowana konsekwentnie od tamtej pory, bez
kolejnych wpadek). Pozostało ~61 plików.

## Rollout i18n — siódma partia: zamknięcie katalogu `baterie/` (poza odłożonymi) (18.09.2026)

Zmigrowane: `soh-per-ogniwo`, `starzenie-degradacja`, `szyny-zbiorcze-miedzypakietowe`,
`topologia-bms`, `vehicle-to-home`. 16 nowych kluczy. Bez nowych typów pułapek (żadnych inline
`Warning` w `validation.ts`, żadnych katalogowych parametrów) — czysta, mechaniczna migracja wg
ustalonego wzorca. 2 strony UI naprawione (`soh-per-ogniwo`, `topologia-bms`), pozostałe 3 już
poprawnie używały `WynikSzczegoly`.

`MIGRATED_MODULES`: 27→32. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (775/775)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem
braku rezydualnego `next-server` przed i po.

**To zamyka wszystkie "normalne" moduły `baterie/`** — w katalogu pozostają tylko świadomie
odłożone: `napiecie-systemowe` (rozmiar, 377 linii), `porownanie-technologii`, `komunikacja-bms`
(oba: katalog danych, wymagają osobnej decyzji architektonicznej o i18n dla treści katalogowej,
razem z już odłożonym `czystosc-i-snieg` z `pv/`). Kolejna partia (8.) zaczyna nowy katalog:
`okablowanie/` (~15 plików). Pozostało łącznie ~56 plików poza `baterie/`.

## Rollout i18n — ósma partia: start katalogu `okablowanie/` (18.09.2026)

Zmigrowane: `analiza-zwarciowa`, `dobor-bezpiecznika-rozlacznika`, `dobor-izolacji-kabla`,
`dobor-mocy-falownika`, `dobor-przekroju-kabla`. 27 nowych kluczy — `dobor-przekroju-kabla`
sam wniósł 11 (najbardziej rozbudowany moduł jak dotąd w tym katalogu: 6 funkcji ostrzeżeń +
4 assumptions + 1 błąd walidacji).

**Reużycie kluczy między modułami/katalogami zadziałało dwukrotnie w tej partii** —
`WARTOSC-NIE-MOZE-BYC-UJEMNA` (istniejący z `baterie/`) trafił do 3 nowych modułów po
weryfikacji identyczności tekstu, a `MODEL-ZWARCIA-PROSTEGO-NIZSZY` (istniejący klucz z Modułu
4, `dobor-bezpiecznika-dc`) okazał się być dosłownie tym samym zdaniem co assumption w nowym
module `analiza-zwarciowa` — potwierdza wcześniejszą dyscyplinę grepowania pełnego tekstu przed
tworzeniem nowego klucza, nie tylko po nazwie funkcji/modułu.

Strażnik (`validation.ts` z partii 4) złapał kolejne 3 inline `Warning` z gotowym tekstem PL w
`dobor-bezpiecznika-rozlacznika/validation.ts` (`PRAD-ZNAMIONOWY-NIEDODATNI`,
`PRAD-ZWARCIOWY-UJEMNY`, `AIC-UJEMNE`) — czwarty raz z rzędu to samo źródło regresji, ten sam
wzorzec co w partiach 4 i 6.

1 strona UI naprawiona — `dobor-przekroju-kabla/page.tsx` miał ten sam podwójny błąd co
`cold-cranking-amps` w partii 3: `{w.message}` bez fallbacku RENDEROWANE RĘCZNIE, a `warnings`
nie było wcale przekazane do `WynikSzczegoly` obok. Naprawione jednym uproszczeniem (usunięcie
manualnego `.map`, dodanie `warnings={result.warnings}` do istniejącego wywołania).

`MIGRATED_MODULES`: 32→37. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (782/782)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem
braku rezydualnego `next-server` przed i po.

Pozostało ~51 plików: `okablowanie/` (~10 z 23 istniejących modułów), `pv/` (~10),
`zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1).

## Rollout i18n — dziewiąta partia: kolejne 5 modułów `okablowanie/` + realny bug echa (18.09.2026)

Zmigrowane: `glowna-szyna-wyrownawcza`, `laczenie-cu-al`, `ochrona-odwrotna-polaryzacja`,
`ochrona-przepieciowa-spd`, `optymalizacja-trasy-kabla`. 27 nowych kluczy, 1 reużyty
(`WARTOSC-NIE-MOZE-BYC-UJEMNA`, 2×). 3 stringowe `assumptions` skonwertowane na `{kod}`
(w `ochrona-odwrotna-polaryzacja`, `ochrona-przepieciowa-spd`, i 4 w `optymalizacja-trasy-kabla`).

**🔴 Ważne znalezisko — migracja modułu A może cicho złamać moduł B, który go echuje.**
`optymalizacja-trasy-kabla/calculator.ts` woła `calculateDoborPrzekrojuKabla` (echo, M5/E1) i
budował z jego ostrzeżeń jeden spłaszczony string: `trasaNieSpelniaWymagan(oznaczenie, w.message
?? w.code)`. Ten kod miał już świadomy komentarz-TODO z partii 8 ("fallback na wypadek przyszłej
migracji tamtego modułu") — i przyszłość faktycznie nadeszła: `dobor-przekroju-kabla` został
zmigrowany W TEJ SAMEJ partii 8, więc `w.message` jego ostrzeżeń jest teraz `undefined`, a
fallback pokazywałby surowy kod (`w.code`, np. "PRZEKROJ-PONIZEJ-WYLICZONEGO") użytkownikowi
zamiast tłumaczonego tekstu — cicha regresja, którą żaden dotychczasowy strażnik (ograniczony do
`FILES_TO_CHECK` per moduł) by nie złapał, bo problem jest MIĘDZY modułami, nie wewnątrz jednego.
Znalezione przez czytanie kodu przed migracją (nie przez test/build — oba by przeszły, bo
`.message` bycie `undefined` nie jest błędem typu, `?? w.code` po prostu zwraca string).
**Napraw architektoniczna, nie kosmetyczna:** `trasaNieSpelniaWymagan` już nie przyjmuje
`komunikat: string` — zwraca tylko generyczną etykietę per trasa (nowy klucz
`TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU`, param `{oznaczenie}`), a oryginalne ostrzeżenia echa są
przekazywane dalej z ich `i18nKey`/`params` bez zmian (`{...w, field: "trasaA"/"trasaB"}`) —
`WynikSzczegoly` renderuje obie warstwy (etykieta + szczegół) poprawnie, bo już umie tłumaczyć
każde ostrzeżenie niezależnie od tego, skąd przyszło. **Lekcja procesowa (kandydat do
`docs/wklad-do-standardu.md`):** przy migracji modułu, który jest ECHOWANY przez inny moduł
(`grep -rn "calculate<Nazwa>" lib/core/modules/` przed migracją), sprawdź WSZYSTKICH wołających
pod kątem tego samego wzorca `w.message ?? ...` — migracja bazowego modułu i migracja
wołającego nie muszą wejść w tej samej partii, ale komentarz-TODO zostawiony "na przyszłość"
trzeba faktycznie sprawdzić w kolejnej partii, nie zakładać, że nikt nie zauważy.

1 strona UI naprawiona — `glowna-szyna-wyrownawcza/page.tsx` renderowała `{w.message}` bez
fallbacku, ale w innym miejscu niż zwykle: wewnątrz `WerdyktPanel` bez użycia
`WynikSzczegoly` wcale (własny `.map`) — naprawione wprost przez `useTranslate()` +
`w.message ?? t(w.i18nKey ?? w.code, w.params)` w samej stronie, bez migracji do
`WynikSzczegoly` (zakres poza tym zadaniem).

`MIGRATED_MODULES`: 37→42. Strażnik przeszedł czysto — żadnych inline literałów w
`validation.ts` tej partii. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (790/790)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z dodatkowym
pełnym wydrukiem `innerText` scenariusza obu tras nie spełniających wymagań — potwierdzone, że
etykieta i szczegół renderują się osobno i poprawnie przetłumaczone. Potwierdzone też
`ps aux | grep next-server` puste przed i po.

Pozostało ~46 plików: `okablowanie/` (5 pozostałych — `pomiary-powykonawcze`, `string-box`,
`uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`, `wylaczniki-rcd`, zamyka
katalog), `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2),
`kalkulator-mobilny/` (~1).

## Rollout i18n — dziesiąta partia: zamknięcie katalogu `okablowanie/` (19.09.2026)

Zmigrowane: `pomiary-powykonawcze`, `string-box`, `uziemienie-funkcjonalne-ochronne`,
`wylaczniki-nadpradowe-dc`, `wylaczniki-rcd`. 32 nowe klucze, 3 reużyte (`WARTOSC-NIE-MOZE-BYC-UJEMNA`,
3×). 6 stringowych `assumptions` skonwertowanych na `{kod}`.

**Pierwsza partia od nr 6, w której żadna strona UI nie wymagała naprawy** — wszystkie 5
stron już poprawnie korzystało z `WynikSzczegoly` z `warnings`/`assumptions` przekazanymi.
Nie oznacza to końca tego wzorca błędu — kolejne katalogi (`pv/`, `zapotrzebowanie/`,
`ogrzewanie/`) wciąż trzeba sprawdzać osobno, nie zakładać z góry.

Strażnik złapałby kolejny inline `Warning` (`string-box/validation.ts` — `LICZBA-STRINGOW-UJEMNA`,
`LICZBA-WEJSC-UJEMNA`, `BEZPIECZNIK-STRINGOWY-UJEMNY`), ale tym razem znaleziony i naprawiony
proaktywnie przez czytanie kodu przed uruchomieniem strażnika — piąty raz z rzędu ten sam
wzorzec regresji (partie 4, 6, 8, teraz 10), co potwierdza: to nie przypadek, tylko systematyczny
nawyk pisania walidacji inline w `validation.ts` bez przechodzenia przez `warnings.ts` — wart
rozważenia jako promocja do `docs/wklad-do-standardu.md` (reguła lintera/testu strukturalnego
zamiast powtarzanej manualnej korekty).

**Dwie bliskie kolizje nazw kluczy, obie rozstrzygnięte przez porównanie treści, nie nazwy:**
`wylaczniki-nadpradowe-dc`'s `aicPonizejPraduZwarciowego` ma ten sam `code`
(`AIC-PONIZEJ-PRADU-ZWARCIOWEGO`) jak istniejący klucz z Modułu 4, ale inny tekst — dostał
odrębny `i18nKey` (`AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO`). Jego `assumptions` string był
o jedno słowo różny od istniejącego `AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA` z partii 8 ("łączeniowa"
vs "wyłączania") — też dostał odrębny klucz (`AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA`).
Trzeci przypadek tej samej dyscypliny w tym katalogu (po partii 8's `AIC-PONIZEJ-PRADU-ZWARCIOWEGO`
i `MODEL-ZWARCIA-PROSTEGO-NIZSZY`) — potwierdza, że "podobny kod = podobny tekst" jest fałszywym
skrótem, trzeba zawsze grepować pełny tekst.

`MIGRATED_MODULES`: 42→47. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (797/797)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem
`ps aux | grep next-server` puste przed i po.

**To zamyka cały katalog `okablowanie/`** (23 moduły łącznie — 18 zmigrowanych w partiach
8-10, 5 wcześniej nie miało `message:` do migracji).

Pozostało ~41 plików: `pv/` (~10), `zapotrzebowanie/` (~8), `ogrzewanie/` (~6),
`bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1). Kolejna partia zaczyna `pv/`.

## Rollout i18n — jedenasta partia: start katalogu `pv/` (19.09.2026)

Zmigrowane: `dopasowanie-tablicy-falownika`, `konfigurator-stringow`, `napor-wiatru`,
`niedopasowanie-paneli`, `ochrona-stringow`. `czystosc-i-snieg` pominięty — wcześniej świadomie
odłożony (dane katalogowe, decyzja przed partią 8). 41 nowych kluczy, 3 reużyte
(`WARTOSC-NIE-MOZE-BYC-UJEMNA`).

**Zastosowana lekcja z partii 9 (echo między modułami przed migracją) — zapobiegawczo, nie po
fakcie tym razem.** `dopasowanie-tablicy-falownika` importuje `obliczNapiecieStringuZimowego` z
`stress-test-mppt/calculator` — sprawdzone PRZED migracją: to czysta funkcja liczbowa (nie
zwraca `Warning[]`), więc migracja `dopasowanie-tablicy-falownika` jej nie dotyka. Dodatkowo
sprawdzono grepem (nie z komentarza w kodzie) domniemaną odwrotną zależność
`napiecie-systemowe`→`dopasowanie-tablicy-falownika` (dawny "Etap G") — potwierdzone, że kod tej
zależności został usunięty 14.09.2026 (`docs/memory.md`, wpis z tamtej daty), został tylko
komentarz historyczny. Żadna z tych dwóch relacji nie wymagała naprawy tego typu, co
`optymalizacja-trasy-kabla` w partii 9 — ale sprawdzenie było obowiązkowe, nie założone.

**Nowy podtyp problemu "etykieta pola jako nietłumaczalny parametr runtime"** —
`konfigurator-stringow/warnings.ts` (`notPositive`/`notWholeNumber`) przyjmowały `label: string`
(np. "napięcie Vmp panelu", "liczba paneli w grupie") wpisywany po polsku wprost w wywołaniu w
`validation.ts` i wstawiany w treść komunikatu. To NIE jest bezpieczny techniczny parametr (jak
"PVC"/"XLPE" z partii 8) — to pełnoprawny tekst domenowy wymagający tłumaczenia, ale różny per
wywołanie tej samej funkcji (5 różnych etykiet dla `notPositive`, 3 dla `notWholeNumber`).
Rozwiązanie: usunięto parametr `label` całkowicie, `i18nKey` = `code` (już unikalny per pole
dzięki `field.toUpperCase()+"-NIEDODATNI"/"-NIE-CALKOWITA"`) — każde pole ma własny klucz
słownika z etykietą już przetłumaczoną w treści, tak jak dotychczasowe pojedyncze klucze robiły
to dla stałych komunikatów. 8 kluczy (5+3) zamiast jednego parametryzowanego. **Kandydat do
`docs/wklad-do-standardu.md`:** rozpoznawanie "czy param jest bezpieczny technicznie czy wymaga
tłumaczenia" — reguła: jeśli param bywa różnym słowem/frazą w języku źródłowym (nie liczbą, nie
jednostką, nie stałym symbolem technicznym), potrzebuje własnego klucza per wariant, nigdy
wolnego tekstu jako param.

`MIGRATED_MODULES`: 47→52. Żadna strona UI nie wymagała naprawy (wszystkie już `WynikSzczegoly`).
`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (804/804)/`build` czyste. Zweryfikowane w
przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem `ps aux | grep
next-server` puste przed i po.

Pozostało ~36 plików: `pv/` (6 pozostałych — `panele-bifacjalne`, `straty-okablowanie-dc`,
`straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`, `zacienienie-diody-bocznikujace`),
`zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1).
Partia 12: dokończenie `pv/` — sprawdzić ponownie przy migracji `stress-test-mppt`, czy coś je
echuje (na dziś potwierdzone: `dopasowanie-tablicy-falownika` woła z niego tylko czystą funkcję
liczbową, bez `Warning[]`).

## Rollout i18n — dwunasta partia: kolejne 5 modułów `pv/` + drugi realny bug UI w tej rundzie (19.09.2026)

Zmigrowane: `panele-bifacjalne`, `straty-okablowanie-dc`, `straty-zlaczki-mc4`,
`stress-test-mppt`, `wplyw-temperatury`. Zweryfikowana ponownie (nie założona z partii 11) —
zależność echa na `stress-test-mppt`: potwierdzone grepem, że `dopasowanie-tablicy-falownika`
importuje z niego tylko `obliczNapiecieStringuZimowego` (czysta funkcja liczbowa), żaden inny
plik nie woła jego `calculateStressTestMppt`/`Warning[]` poza własną stroną UI modułu. 38 nowych
kluczy, 5 reużytych (`WARTOSC-NIE-MOZE-BYC-UJEMNA`). 6 stringowych `assumptions` skonwertowanych
na `{kod}`.

**🔴 Drugi realny bug funkcjonalny znaleziony podczas rollout-u (pierwszy: echo bug partii 9;
ten: pominięty prop, nie literał tekstu).** `wplyw-temperatury/page.tsx` — ścieżka `VALID`
(główny, powodzeniowy wynik) renderowała `<WynikSzczegoly assumptions={result.assumptions}
formula={result.formula} />` BEZ `warnings={result.warnings}`. Jedyne ostrzeżenie tego
kalkulatora (`utrataMocy`, poziom `info` — to nie dodatkowe ostrzeżenie, to GŁÓWNA treść
informacyjna ekranu: "Panel przy X°C traci Y% mocy...") było całkowicie niewidoczne w normalnym
przebiegu, nie tylko nieprzetłumaczone jak w dotychczasowych naprawach tego wzorca. Naprawione
jednym dopisaniem propsa; zweryfikowane PRZED i PO pełnym wydrukiem `innerText`, nie tylko
brakiem markera `⚠ [` (bo brak ostrzeżenia w ogóle nie generuje markera — trzeba osobno
sprawdzić, że treść faktycznie się pojawiła). **Lekcja procesowa:** przy przeglądzie stron przed
migracją nie wystarczy sprawdzić "czy `WynikSzczegoly` jest wywoływane" — trzeba sprawdzić, że
KAŻDE wywołanie (nie tylko któreś) przekazuje `warnings`, bo strony z wieloma ścieżkami
(INVALID/INCOMPLETE/VALID) czasem mają `WynikSzczegoly` wywołane 2-3×, i błąd może siedzieć w
tej, która akurat nie jest pierwsza sprawdzona.

`MIGRATED_MODULES`: 52→57. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (811/811)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem
`ps aux | grep next-server` puste przed i po.

Pozostał 1 plik w `pv/`: `zacienienie-diody-bocznikujace`. Pozostało ~31 plików poza `pv/`:
`zapotrzebowanie/` (~8), `ogrzewanie/` (~6), `bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1).

## Rollout i18n — trzynasta partia: zamknięcie katalogu `pv/`, start `zapotrzebowanie/` (19.09.2026)

Zmigrowane: `zacienienie-diody-bocznikujace` (pv/, ostatni plik katalogu), `agregat-pradotworczy`,
`bojler-cwu`, `bufor-rozbudowe`, `load-shedding` (pierwsze 4 z `zapotrzebowanie/`). 30 nowych
kluczy, 2 reużyte (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, i `SOC-POZA-ZAKRESEM` — ten drugi znaleziony w
`load-shedding` jako byte-identyczny z istniejącym kluczem z innego modułu po weryfikacji treści).

**Trzeci wystąpienie problemu "etykieta pola jako nietłumaczalny parametr runtime"** (po
`konfigurator-stringow`, partia 11) — `agregat-pradotworczy`'s `notPositive(field, label, value)`
miał identyczny wzorzec (4 różne polskie etykiety wpisywane wprost w `validation.ts`). Naprawiony
identycznie: `i18nKey` = `code` (już unikalny per pole), `label` usunięty z sygnatury, etykieta
przeniesiona do treści klucza w słowniku. **To już trzeci raz — wart promocji do
`docs/wklad-do-standardu.md` jako rozpoznawalny wzorzec kodu do wychwycenia przy każdej migracji
kolejnego modułu z generyczną funkcją walidacji `notPositive`/podobną.**

**Nowy podtyp: funkcja ostrzeżenia zwracająca RÓŻNY TEKST (nie tylko różne parametry) zależnie
od warunku.** `bufor-rozbudowe`'s `buforInfo(buforPct, dodatekKwh)` i `load-shedding`'s
`odbiornikAktywny(priorytet)` obie miały rozgałęzienie `if/ternary` na POZIOMIE TEKSTU wiadomości
(nie tylko wartości parametru wewnątrz jednego szablonu) — np. "Bez bufora..." vs "Bufor X%
dolicza Y kWh...". Rozwiązanie: rozbite na 2 odrębne klucze każda, wybór klucza (nie tylko
parametrów) przeniesiony do logiki `warnings.ts` (funkcja zwraca różny `i18nKey` w zależności od
warunku, opcjonalnie z `params`). Odróżnić od zwykłego parametryzowania: tu różnica jest w
STRUKTURZE zdania, nie tylko w liczbie/słowie wstawianym w szablon.

**🔴 3 kolejne strony UI naprawione (wzorzec `{w.message}` bez fallbacku — czwarty, piąty, szósty
przypadek w całej rundzie).** `agregat-pradotworczy` miał podwójny bug jak `cold-cranking-amps`/
`dobor-przekroju-kabla` (manualny render ORAZ brak `warnings` w sąsiednim `WynikSzczegoly`).
`bufor-rozbudowe` i `load-shedding` nie importowały `WynikSzczegoly` WCALE — czysto manualny
render bez żadnego fallbacku i18n, jak `wplyw-temperatury` w partii 12, ale tu manualny render
BYŁ obecny (markery `⚠ [` by się pojawiły), różni się od partii 12 gdzie ostrzeżenie było
całkowicie pominięte (bez markera). Wszystkie 3 naprawione tym samym wzorcem. Zweryfikowane
pełnym wydrukiem `innerText` dla wszystkich trzech (nie tylko brakiem markera) — treść widoczna
i poprawnie przetłumaczona we wszystkich.

`MIGRATED_MODULES`: 57→62. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (818/818)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (15 kombinacji, zero `⚠ [...]`), z potwierdzeniem
`ps aux | grep next-server` puste przed i po.

**To zamyka cały katalog `pv/`** (12 modułów zmigrowanych w partiach 11-13, plus
`czystosc-i-snieg` świadomie odłożony jako dane katalogowe).

Pozostało ~27 plików: `zapotrzebowanie/` (4 pozostałe — `pobor-wlasny-falownika`,
`profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`), `ogrzewanie/` (~6),
`bezpieczenstwo/` (~2), `kalkulator-mobilny/` (~1). Zweryfikować grepem na starcie partii 14.

## Rollout i18n — czternasta partia: zamknięcie katalogu `zapotrzebowanie/` (19.09.2026)

Zmigrowane: `pobor-wlasny-falownika`, `profil-astronomiczny`, `przetwornice-dcdc`, `sezonowosc`
(ostatnie 4 pliki `zapotrzebowanie/`). 19 nowych kluczy (nie 22 — literówka w liczeniu na
poprzednim etapie tej sesji, skorygowana po przeliczeniu programistycznym słownika przed
weryfikacją; **"zweryfikowane programistycznie, nie z metryczki" — rozdział 14/03 standardu —
zastosowane tu wprost do własnej, wcześniejszej liczby, nie tylko do materiału źródłowego**).
Zero kolizji kluczy w tej partii (żaden z 19 nie pokrywał się z istniejącymi — sprawdzone
grepem przed finalizacją, jak w każdej wcześniejszej partii).

**Czwarty przypadek wzorca "etykieta pola jako nietłumaczalny parametr runtime"** (po
`konfigurator-stringow` p.11, `agregat-pradotworczy` p.13) — `przetwornice-dcdc`'s
`notPositive(field, label, value)`. Naprawiony identycznie: `label` usunięty, `i18nKey = code`.

**Drugi podtyp "różny tekst, nie tylko różne parametry, zależnie od warunku"** (po
`buforInfo`/`odbiornikAktywny`, p.13) — `profil-astronomiczny`'s `nocPolarnaLubDzienPolarny`
(noc polarna vs dzień polarny to dwa różne zdania, nie jeden szablon z inną wartością). Rozbite
na `NOC-POLARNA`/`DZIEN-POLARNY`, wybór klucza w `warnings.ts`, jak w p.13.

**🔴 Dryf znaleziony w module z WCZEŚNIEJSZEJ, już zamkniętej partii (`baterie/pobor-wlasny-bms`,
nie część listy plików tej partii) — naprawiony od razu, zgodnie z wyjątkiem CLAUDE.md dla dryfu
bez świadomej decyzji.** Znaleziony przy sprawdzaniu kolizji nazw kluczy z nowym
`POBOR-JALOWY-UJEMNY`: `pobor-wlasny-bms`'s `poborUjemny(pole, etykieta, value)` miał identyczny
wzorzec "etykieta jako parametr" (`i18nKey: "POBOR-UJEMNY"`, `params: {label: etykieta}`) — sam
klucz `POBOR-UJEMNY` ucieleśniał anty-wzorzec, mimo że module był zmigrowany wcześniej, przed
ustaleniem tej dyscypliny. Naprawiony tym samym wzorem (usunięcie `etykieta`, `i18nKey` =
`${pole.toUpperCase()}-UJEMNY`, np. `POBORCIAGLEW-UJEMNY`), test zaktualizowany.

**🔴 4 kolejne strony UI naprawione** (siódmy–dziesiąty przypadek w całej rundzie).
`pobor-wlasny-falownika` i `sezonowosc` nie importowały `WynikSzczegoly` wcale — czysto manualny
render `{w.message}` (marker `⚠ [` by się pojawił). `profil-astronomiczny` i `przetwornice-dcdc`
miały podwójny bug (manualny render ORAZ sąsiedni `WynikSzczegoly` bez propa `warnings`) — jak
`agregat-pradotworczy` w p.13. Wszystkie 4 naprawione tym samym wzorcem
(`<WynikSzczegoly assumptions warnings formula />`). Dla dwóch stron z podwójnym bugiem
(`profil-astronomiczny`, `przetwornice-dcdc`) zweryfikowano pełnym wydrukiem `innerText` przed/po
— treść ostrzeżenia (info-level, funkcjonalnie ważna: noc polarna / strata na konwersji) faktycznie
się pojawia, nie tylko brak markera.

`MIGRATED_MODULES`: 62→66. `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (833/833)/`build`
czyste. Zweryfikowane w przeglądarce PL/EN/RU (12 kombinacji — 4 moduły × 3 języki, zero
`⚠ [...]`), z potwierdzeniem `ps aux | grep next-server` puste przed i po.

**To zamyka cały katalog `zapotrzebowanie/`** (8 modułów zmigrowanych w partiach 13-14, licząc
tylko moduły z hardkodowanym polskim tekstem w `Warning`/`Assumption` — cały katalog `zapotrzebowanie/`
per `find` nie miał więcej takich plików).

**🔴 KOREKTA SZACUNKU POZOSTAŁYCH PLIKÓW — poprzednie "~27" było oparte na niepełnej mapie
katalogów, nie na przeliczeniu.** Programistyczna weryfikacja (`find lib/core/modules -maxdepth 2
-mindepth 2 -type d`, porównanie z `MIGRATED_MODULES`, potem grep `message:` w każdym
`warnings.ts` pozostałych katalogów) ujawniła katalog **`montaz-baterii/` (23 moduły, z czego
12 mają realny hardkodowany tekst do migracji)** — w ogóle nieuwzględniony w poprzednich
szacunkach tej sesji, nie tylko niedoszacowany. Poprawiony pełny obraz pozostałych plików z
rzeczywistym tekstem do migracji (potwierdzone grepem, nie zgadywane):
- `ogrzewanie/`: 6 modułów (`bufor-ciepla`, `infiltracja-powietrza`, `kociol-elektryczny`,
  `pompy-cyrkulacyjne`, `ryzyko-niskiego-napiecia`, `wentylacja-odzysk-ciepla`) — zgodne z
  wcześniejszym szacunkiem "~6".
- `montaz-baterii/`: 12 modułów (`balansery-zewnetrzne-olow`, `demontaz-pakietu`,
  `gestosc-elektrolitu`, `montaz-mechaniczny`, `ocena-zasiarczenia`, `ocena-zuzycia`,
  `pierwsze-uruchomienie`, `podlaczenie-bms`, `ratowanie-ogniwa`, `sekwencja-montazu`,
  `weryfikacja-ogniw` + reszta katalogu bez `warnings.ts`/bez `message:` — nie wymaga migracji).
  **Nowo odkryty katalog, nieujęty w żadnym wcześniejszym szacunku tej sesji.**
- `bezpieczenstwo/`: 2 moduły (`dogrzewanie-paliwem-stalym`, `ups-krytyczny`) — zgodne z "~2"
  (`audyt-pozarowy` już zmigrowany wcześniej, nie ma `warnings.ts` z tekstem).
- `kalkulator-mobilny/`: 1 moduł (`tryb-uproszczony`) — zgodne z "~1".
- Świadomie odłożone (dane katalogowe, nie zwykłe `Warning[]`, wymagają decyzji architektonicznej
  o i18n dla treści katalogowej — bez zmian względem wcześniejszych partii):
  `pv/czystosc-i-snieg`, `baterie/komunikacja-bms`, `baterie/porownanie-technologii`.
  **`baterie/napiecie-systemowe` (7× `message:`) wymaga sprawdzenia statusu** — plan wykonania
  wspomina go jako możliwe do zbudowania z i18n od początku (v2, inna sesja); do potwierdzenia na
  starcie partii, nie zakładać z góry.

Realny pozostały zakres z tekstem do migracji: **21 modułów** (6+12+2+1), nie ~27 — ale to
WIĘKSZY, nie mniejszy zakres niż poprzedni szacunek sugerował, bo `montaz-baterii/` był całkowicie
nieujęty. Kolejna partia (15.): start `ogrzewanie/`.

## Rollout i18n — piętnasta partia: start katalogu `ogrzewanie/` (19.09.2026)

Zmigrowane: `bufor-ciepla`, `infiltracja-powietrza`, `kociol-elektryczny`, `pompy-cyrkulacyjne`,
`ryzyko-niskiego-napiecia`, `wentylacja-odzysk-ciepla` (wszystkie 6 modułów `ogrzewanie/` z
hardkodowanym tekstem — zamyka cały katalog w jednej partii, po weryfikacji grepem że to
faktycznie wszystkie). 21 nowych kluczy PL/EN/RU (13 ostrzeżeń + 8 założeń), 2 klucze reużyte 1:1
po weryfikacji treści: `WARTOSC-NIE-MOZE-BYC-UJEMNA` (identyczny generyczny komunikat
`wartoscUjemna(field, value)` duplikowany w każdym z 6 modułów) i `COP-POZA-ZAKRESEM` (z
`cop-pompy-ciepla`, ten sam wzorzec `{min}–{max}`).

**Zero nowych wystąpień znanych anty-wzorców w tej partii** — pierwsza partia bez wzorca
"etykieta jako parametr" (generyczna `wartoscUjemna` używa `field` tylko w `technicalMessage`/
`field`, nie w treści komunikatu — bezpieczny wzorzec od początku) i bez wzorca "różny tekst
zależnie od warunku" (2-wariantowe ostrzeżenia jak `buforZaMaly`/`buforWystarczajacy` już były
osobnymi funkcjami z osobnymi kluczami, zgodnie z ustalonym wzorcem). Jedna bliska kolizja
rozstrzygnięta przez porównanie treści: `SPRAWNOSC-POZA-ZAKRESEM` (istniejący klucz, zakres
ułamkowy (0,1]) różni się od `wentylacja-odzysk-ciepla`'s tekstu zakresu procentowego 0–100% —
nowy klucz `SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM`, analogicznie do
`SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM` z partii 14. Druga bliska kolizja: kod `"OSZCZEDNOSC"` jest
identyczny w `kociol-elektryczny` i `pompy-cyrkulacyjne`, ale treść komunikatów różni się całkowicie
(kocioł vs pompa) — `code` (identyfikator testowy) zostawiony bez zmian w obu, ale każdy dostał
odrębny `i18nKey` (`OSZCZEDNOSC-KOCIOL-VS-POMPA`/`OSZCZEDNOSC-POMPA-CYRKULACYJNA`). Znaleziony i
naprawiony jeden inline literał `Warning` w `pompy-cyrkulacyjne/validation.ts` (poza `warnings.ts`
— strażnik sprawdza też `validation.ts`, zgodnie z rozszerzeniem z partii 6).

**Zero bugów UI w tej partii** — wszystkie 6 stron już poprawnie używały
`<WynikSzczegoly assumptions warnings formula />` z pełnym propem `warnings` na obu ścieżkach
(błąd i wynik), bez żadnego manualnego renderu `{w.message}`. Pierwsza partia w całej rundzie bez
ani jednego znalezionego bugu UI.

`MIGRATED_MODULES`: 66→72. 6 nowych bloków testowych domenowych (w tym jeden dodatkowy test dla
`NAPIECIE-POZA-SANITY-CHECK`, dopisany po zauważeniu braku pokrycia) + nowy blok w `t.test.ts` (10
kluczy z parametrami/11 bez — tylko 21 NOWYCH kluczy tej partii, bez dwóch reużytych).
`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (857/857)/`build` czyste — testy przeszły od
razu przy pierwszym uruchomieniu (żadnej korekty wartości parametrów po biegu, w przeciwieństwie
do partii 9 i 12). Zweryfikowane w przeglądarce PL/EN/RU (18 kombinacji — 6 modułów × 3 języki,
zero `⚠ [...]`), z potwierdzeniem `ps aux | grep next-server` puste przed i po.

**To zamyka cały katalog `ogrzewanie/`.** Pozostały zakres z realnym tekstem do migracji (per
korekta z partii 14): `montaz-baterii/` (12 modułów), `bezpieczenstwo/` (2: `dogrzewanie-paliwem-
stalym`, `ups-krytyczny`), `kalkulator-mobilny/` (1: `tryb-uproszczony`) = **15 modułów**.
Kolejna partia (16.): start `montaz-baterii/` (największy pozostały katalog, nowo odkryty w
partii 14 — sprawdzić grepem na starcie, czy lista 12 modułów z partii 14 jest wciąż aktualna).

## Rollout i18n — szesnasta partia: start katalogu `montaz-baterii/` (19.09.2026)

**🔴 Korekta liczby modułów `montaz-baterii/` z partii 14: 11, nie 12.** Ponowne przeliczenie
grepem na starcie tej partii (jak zalecono) pokazało dokładnie 11 modułów z realnym `message:`
w `warnings.ts`, nie 12 — drobny błąd liczenia w poprzednim wpisie, skorygowany tu programistycznie,
zgodnie z zasadą "zweryfikowane programistycznie, nie z metryczki" (rozdz. 03/14 standardu).
Lista niezmieniona co do treści: `balansery-zewnetrzne-olow`, `demontaz-pakietu`,
`gestosc-elektrolitu`, `montaz-mechaniczny`, `ocena-zasiarczenia`, `pierwsze-uruchomienie`,
`podlaczenie-bms`, `ratowanie-ogniwa`, `sekwencja-montazu`, `weryfikacja-ogniw` — to 10 nazw
policzonych ręcznie z poprzedniego wpisu; grep potwierdza 11 (ten zestaw + `ocena-zuzycia`,
przeoczony przy ręcznym przepisywaniu listy w partii 14 — dowód dlaczego programistyczna
weryfikacja > przepisywanie z pamięci).

Zmigrowane w tej partii (pierwsze 5 z 11, rozmiar partii zgodny z resztą rundy): `balansery-
zewnetrzne-olow`, `demontaz-pakietu`, `gestosc-elektrolitu`, `montaz-mechaniczny`,
`ocena-zasiarczenia`. 12 nowych kluczy PL/EN/RU, zero kolizji (sprawdzone grepem przed
finalizacją).

**Echo-zależności zweryfikowane przed migracją** (dyscyplina z partii 9+): `demontaz-pakietu`
echowany przez `sekwencja-montazu`/`procedura-black-start` tylko przez stałą liczbową
(`MAX_ZALECANE_NAPIECIE_OGNIWA_V`) lub wzmiankę w komentarzu — bezpieczne, brak zależności od
`Warning[]`. `montaz-mechaniczny` **faktycznie echuje `Warning[]`** z `baterie/pozycjonowanie-
ogniw` (`dociskZaDuzy`/`dociskZaMaly`) — potwierdzone, że `pozycjonowanie-ogniw` jest już
zmigrowany (obecny w `MIGRATED_MODULES` od wcześniejszej partii), więc echowane ostrzeżenia mają
już `i18nKey`/`params` — nie regresja, tylko potwierdzenie stanu.

**Nowy podtyp wzorca "różny tekst zależnie od warunku": zgodność liczby/rodzaju (singular/plural),
nie tylko wybór między dwiema niezależnymi treściami.** `ocena-zasiarczenia`'s
`objawyZasiarczeniaObecne(liczbaObjawow)` miał ternary wewnątrz szablonu (`{liczbaObjawow === 1 ?
"objaw" : "objawy"}`) — inny niż poprzednie przypadki (`buforInfo`, `nocPolarnaLubDzienPolarny`),
bo to nie dwie różne sytuacje domenowe, tylko gramatyczna odmiana tej samej informacji. Ponieważ
katalog objawów ma tylko 4 pozycje (nigdy nie sięga polskiego trzeciego wariantu "objawów" dla
5+), rozwiązanie: dwa klucze `OBJAWY-ZASIARCZENIA-JEDEN` (bez param, zawsze "1")/`OBJAWY-
ZASIARCZENIA-WIELE` (param `{liczba}`, zawsze 2-4), wybór w `warnings.ts` — ten sam mechanizm
"wybór klucza w logice domenowej", zastosowany do nowego powodu (gramatyka, nie różna treść).
**Ograniczenie świadomie przyjęte, nie przeoczone:** to rozwiązanie nie skalowałoby się do
pełnej polskiej odmiany liczebników (1/2-4/5+) — gdyby przyszły moduł miał katalog z 5+ pozycjami,
wymagałby trzeciego klucza; nie zakładać z góry przy podobnych przypadkach w kolejnych partiach.

**🔴 2 kolejne strony UI naprawione** (jedenasty-dwunasty przypadek w całej rundzie).
`demontaz-pakietu` importował `WynikSzczegoly` (używany w ścieżce INVALID_INPUT), ale ścieżka
główna renderowała ostrzeżenia manualnie (`.map` + `{w.message}`) — analogiczny "częściowy" bug
jak we wcześniejszych partiach. `ocena-zasiarczenia` nie importował `WynikSzczegoly` wcale —
czysto manualny render. Oba naprawione tym samym wzorcem. Zweryfikowane pełnym wydrukiem
`innerText` (nie tylko brakiem markera) — treść ostrzeżeń („Zabronione — pakiet wciąż
naładowany" / „Zaobserwowano 1 objaw zasiarczenia...") faktycznie widoczna i przetłumaczona.

`MIGRATED_MODULES`: 72→77. 5 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (6
kluczy z parametrami/6 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (872/872)/`build`
czyste — testy przeszły od razu przy pierwszym uruchomieniu. Zweryfikowane w przeglądarce PL/EN/RU
(15 kombinacji — 5 modułów × 3 języki, zero `⚠ [...]`), z potwierdzeniem `ps aux | grep
next-server` puste przed i po.

**Pozostało w `montaz-baterii/`: 6 modułów** — `pierwsze-uruchomienie`, `podlaczenie-bms`,
`ratowanie-ogniwa`, `sekwencja-montazu`, `weryfikacja-ogniw`, `ocena-zuzycia` (ten ostatni
przeoczony w partii 14, patrz korekta wyżej). Kolejna partia (17.): dokończenie
`montaz-baterii/` (6 modułów, zamknie cały katalog) — **sprawdzić grepem, że `sekwencja-montazu`
i inne moduły tej listy nie mają nowych echo-zależności między sobą, skoro migrowane w innej
partii niż `demontaz-pakietu`** (którego stałą liczbową echują — bezpieczne, ale zweryfikować
ponownie przy kolejnej partii, nie zakładać).

## Rollout i18n — siedemnasta partia: zamyka cały katalog `montaz-baterii/` (19.09.2026)

Zmigrowane: `pierwsze-uruchomienie`, `podlaczenie-bms`, `ratowanie-ogniwa`, `sekwencja-montazu`,
`weryfikacja-ogniw`, `ocena-zuzycia` — ostatnie 6 modułów katalogu, potwierdzone grepem jako
kompletna lista przed startem. 18 nowych kluczy PL/EN/RU, 3 klucze reużyte po weryfikacji treści
(`WARTOSC-NIE-MOZE-BYC-UJEMNA`, `POJEMNOSC-NIEDODATNIA` — byte-identyczny z istniejącym kluczem z
innego modułu, `KROK-POZA-KOLEJNOSCIA` — byte-identyczny z `demontaz-pakietu` partii 16).

**Piąty przypadek wzorca "etykieta jako nietłumaczalny parametr runtime"** (po
`konfigurator-stringow` p.11, `agregat-pradotworczy` p.13, `przetwornice-dcdc` p.14,
`pobor-wlasny-bms` drift-fix p.14) — `podlaczenie-bms`'s `notPositive(field, label, value)`,
naprawiony identycznie (`label` usunięty, `i18nKey = code` wywodzony z pola).

**Kolizja `code` między dwoma modułami wykryta i poprawnie rozstrzygnięta bez utraty informacji:**
`pierwsze-uruchomienie`'s `napiecieOgniwaUjemne` i `ratowanie-ogniwa`'s `napiecieUjemne` mają
identyczny `code: "NAPIECIE-OGNIWA-UJEMNE"`, ale RÓŻNY tekst źródłowy ("Napięcie ogniwa nie może
być ujemne." vs 'Wartość pola "napięcie ogniwa" nie może być ujemna.'). `code` (identyfikator
testowy/pole) zostawiony bez zmian w obu — nie musi być globalnie unikalny — ale każdy dostał
odrębny `i18nKey` (`NAPIECIE-OGNIWA-UJEMNE` / `NAPIECIE-OGNIWA-POLE-UJEMNE`), żeby nie nadpisać
jednego tekstu drugim. Znalezione przez rutynową kontrolę kolizji kluczy przed finalizacją —
gdyby nie ta kontrola, oba moduły pokazywałyby ten sam (błędny dla jednego z nich) tekst.

Skonwertowane stringowe `assumptions` na `{kod, params}` w `sekwencja-montazu` (2 warianty:
preset/niestandardowy, każdy z parametrami `{n}`/`{n, liczba}`) — **złapało i naprawiło 2
PRZEDISTNIEJĄCE asercje testowe** (`toContain("nie 1:1")` na starym stringu), które inaczej
zostałyby ciche regresje po migracji; poprawione na `toEqual({kod, params})`, zweryfikowane
pełnym przebiegiem testów po naprawie (pierwszy nie-zerowy wynik testów w całej rundzie — 1
failed przy pierwszym uruchomieniu tej partii, naprawione od razu, drugi bieg czysty).

**🔴 2 kolejne strony UI naprawione** (trzynasty-czternasty przypadek w całej rundzie).
`podlaczenie-bms` miał manualny render na głównej ścieżce (VALID/VALID_WITH_WARNINGS), mimo że
`WynikSzczegoly` był już importowany i używany gdzie indziej na tej samej stronie (dla wyniku
czasu pre-charge i ścieżki INVALID_INPUT) — ten sam "częściowy" wzorzec bugu co w kilku
wcześniejszych partiach. `ocena-zuzycia` nie importował `WynikSzczegoly` wcale. Oba naprawione
tym samym wzorcem. Zweryfikowane pełnym wydrukiem `innerText` (nie tylko brakiem markera).

`MIGRATED_MODULES`: 77→83. 6 nowych bloków testowych domenowych + nowy blok w `t.test.ts` (11
kluczy z parametrami/7 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (894/894, po
naprawie 2 przedistniejących asercji)/`build` czyste. Zweryfikowane w przeglądarce PL/EN/RU (18
kombinacji — 6 modułów × 3 języki, zero `⚠ [...]`), z potwierdzeniem `ps aux | grep next-server`
puste przed i po.

**To zamyka cały katalog `montaz-baterii/`** (11 modułów zmigrowanych w partiach 16-17).
Pozostały zakres z realnym tekstem do migracji: `bezpieczenstwo/` (2: `dogrzewanie-paliwem-
stalym`, `ups-krytyczny`), `kalkulator-mobilny/` (1: `tryb-uproszczony`) = **3 moduły**. Kolejna
partia (18.): `bezpieczenstwo/` + `kalkulator-mobilny/` razem (mały zakres, jedna partia
prawdopodobnie zamknie oba katalogi) — zweryfikować grepem na starcie, w tym status
`baterie/napiecie-systemowe` (7× `message:`, wzmiankowane jako niepewne od partii 14, wciąż nie
sprawdzone) i świadomie odłożone `pv/czystosc-i-snieg`, `baterie/komunikacja-bms`,
`baterie/porownanie-technologii`.

## Rollout i18n — osiemnasta partia: zamyka `bezpieczenstwo/` + `kalkulator-mobilny/` (19.09.2026)

Zmigrowane: `dogrzewanie-paliwem-stalym`, `ups-krytyczny` (`bezpieczenstwo/`), `tryb-uproszczony`
(`kalkulator-mobilny/`) — potwierdzone grepem jako kompletna lista realnego tekstu w obu
katalogach (`audyt-pozarowy` już zmigrowany wcześniej, bez `warnings.ts` z tekstem). 12 nowych
kluczy PL/EN/RU, 2 klucze reużyte po weryfikacji treści: `WARTOSC-NIE-MOZE-BYC-UJEMNA` (×2, oba
moduły `bezpieczenstwo/`) i **`SPRAWNOSC-DOMYSLNA`** — pierwszy przypadek w tej rundzie reużycia
klucza wraz z jego dokładną nazwą parametru (`{efficiency}`) między dwoma modułami z różnych
katalogów (`kalkulatory-pomocnicze` i `ups-krytyczny`), potwierdzający że wspólne "sprawność
domyślna, nie zmierzona" to faktycznie ten sam fakt domenowy, nie przypadkowa zbieżność tekstu.

Jedna bliska kolizja: `BRAK-ZAZNACZONYCH` (istniejący klucz, "Nie zaznaczono żadnego odbiornika
krytycznego") różni się od `ups-krytyczny`'s własnego tekstu ("...urządzenia krytycznego do
podtrzymania") — nowy klucz `BRAK-ZAZNACZONYCH-URZADZEN`.

**Szósty przypadek anty-wzorca "etykieta jako parametr"** (po `konfigurator-stringow` p.11,
`agregat-pradotworczy` p.13, `przetwornice-dcdc` p.14, `pobor-wlasny-bms` drift-fix p.14,
`podlaczenie-bms` p.17) — `tryb-uproszczony`'s `notPositive(field, label, value)`, naprawiony
tym samym wzorcem.

Skonwertowane 2 stringowe `assumptions` (`ups-krytyczny`, `tryb-uproszczony`) na `{kod, params}`
— **złapało kolejną przedistniejącą asercję testową** (`ups-krytyczny`'s `toContain("0.92")`),
naprawiona identycznie jak w partii 17 (`toEqual({kod, params})`).

**Zero bugów UI w tej partii** — trzecia partia w całej rundzie bez znalezionego bugu (po p.15).
`dogrzewanie-paliwem-stalym` i `ups-krytyczny` już poprawnie przekazywały `warnings` do
`WynikSzczegoly`. `tryb-uproszczony` nie renderuje `warnings` wcale (świadomy wzorzec UX tego
ekranu — błąd walidacji pokazuje jeden generyczny komunikat zamiast per-pole, niezmienione od
przed migracją, nie regresja) i już poprawnie tłumaczył `assumptions` przez `t(a.kod, a.params)`
— zweryfikowane wprost porównaniem treści PL/EN.

`MIGRATED_MODULES`: 83→86. 3 nowe bloki testowe domenowe (w tym poprawka 1 przedistniejącej
asercji) + nowy blok w `t.test.ts` (3 klucze z parametrami/9 bez). `pnpm typecheck`/`lint`/
`check:i18n-guard`/`test` (905/905)/`build` czyste — testy przeszły od razu przy pierwszym
uruchomieniu (poza przedistniejącą asercją naprawioną proaktywnie przed pierwszym biegiem, po
lekcji z partii 17). Zweryfikowane w przeglądarce PL/EN/RU (9 kombinacji — 3 moduły × 3 języki,
zero `⚠ [...]`), z potwierdzeniem `ps aux | grep next-server` puste przed i po.

**To zamyka oba katalogi `bezpieczenstwo/` i `kalkulator-mobilny/`.**

🔴 **Pozostały zakres z realnym tekstem do migracji, potwierdzony grepem na starcie tej partii
(nie zakładany z metryczki):** `baterie/napiecie-systemowe` — **1 moduł, 7× `message:`, NIE w
`MIGRATED_MODULES`**. To duży, wieloetapowy moduł (Etapy B/C/E/F/G/H tej samej sesji, patrz
historia zadań) — prawdopodobnie wymaga własnej, dedykowanej partii (echo-zależności do
sprawdzenia dokładnie, może mieć więcej niż 7 unikalnych ostrzeżeń jeśli część `message:` to
duplikaty w różnych gałęziach kodu). Kolejna partia (19.): `baterie/napiecie-systemowe` — zacząć
od pełnego odczytania `warnings.ts`/`validation.ts`/`calculator.ts` (może być większy niż typowa
partia 5-modułowa, mimo że to jeden moduł) i sprawdzenia grepem WSZYSTKICH miejsc, które go
echują (`sekwencja-montazu` już potwierdzone bezpieczne w partii 16 — reużywa tylko stałą
liczbową). Po zamknięciu tego modułu: świadomie odłożone `pv/czystosc-i-snieg`,
`baterie/komunikacja-bms`, `baterie/porownanie-technologii` pozostają jedynym znanym pozostałym
zakresem (dane katalogowe, wymagają osobnej decyzji architektonicznej o i18n dla treści
katalogowej) — **ale warto na starcie partii 19 ponownie przelecieć CAŁE `lib/core/modules/`
grepem** (`find ... | while read d; do grep -c message: $d/warnings.ts; done`), tak jak przy
odkryciu `montaz-baterii/` w partii 14 i `ocena-zuzycia` w partii 17 — ta dyscyplina już dwa razy
złapała realne braki, które ręczne szacunki przeoczyły.

## Rollout i18n — dziewiętnasta (ostatnia realna) partia: `baterie/napiecie-systemowe` (19.09.2026)

Pełny re-scan `lib/core/modules/` na starcie partii (grepem, nie z metryczki) potwierdził: to
faktycznie JEDYNY pozostały niezmigrowany moduł z realnym tekstem w całym kodzie, poza trzema
świadomie odłożonymi modułami katalogowymi (patrz niżej). 7 funkcji w `warnings.ts` skonwertowane
— w tym `konfliktJednoczesnosci` (Etap B.2) z wewnętrznym rozgałęzieniem na `KONFLIKT-JEDNOCZESNOSCI`
vs `KONFLIKT-JEDNOCZESNOSCI-Z-PROPOZYCJA` (ten drugi wariant dokleja listę urządzeń do wyłączenia,
połączoną `" + "` — nazwy urządzeń pozostają nieprzetłumaczone, wstrzyknięte jako `params.urzadzenia`,
zgodnie z ustalonym wzorcem "dynamicznie łączona lista nazw" z analizy tego modułu). 12 nowych
kluczy PL/EN/RU, 1 klucz reużyty (`WARTOSC-NIE-MOZE-BYC-UJEMNA`, treść bajtowo identyczna).
5 stringowych `assumptions` skonwertowane na `{kod}` (bez params) — brak przedistniejącej asercji
testowej na ich treść w tym module (sprawdzone proaktywnie przed uruchomieniem testów).

**Bug UI znaleziony i naprawiony — nowy podtyp wzorca "manual render bez fallbacku i18n":**
`app/kalkulatory/napiecie-systemowe/page.tsx`, Etap C (porównanie kabli ×3 napięcia), renderował
`{w.message}` bezpośrednio z `result.value.kable![k].warnings` (echo z już zmigrowanego
`dobor-przekroju-kabla`) — dane były translation-ready od dawna (mają `i18nKey`/`params`,
`message` niezdefiniowane), ale UI nigdy z tego nie korzystał, więc po tej partii wyświetlałyby
się jako pusty tekst. To pierwszy przypadek w całej rundzie, gdzie bug dotyczy ECHOWANYCH danych
z innego, dawno zmigrowanego modułu, nie własnych danych bieżącego modułu. Naprawione:
`t(w.i18nKey ?? w.code, w.params)` (import `useTranslate` z `@/lib/i18n/language-context`,
wzorzec z `tryb-uproszczony/page.tsx`), z zachowaniem prefiksu `{k.replace("v","")}V: `.
Zweryfikowane wprost porównaniem treści PL/EN/RU (nie tylko brakiem markera `⚠ [`) — tekst
faktycznie się różni między językami, nie "undefined".

`MIGRATED_MODULES`: 86→87. Nowy blok testowy domenowy (9 asercji, w tym pokrycie obu wariantów
`konfliktJednoczesnosci` — druga wersja testu dla warunku "bez propozycji" wymagała realnego
przypadku, gdzie WSZYSTKIE odbiorniki w konflikcie są "bazowe" — algorytm zachłanny nigdy nie
zwraca pustej propozycji, jeśli istnieje choć jeden odbiornik przełączalny w konflikcie) + nowy
blok w `t.test.ts` (5 kluczy z parametrami/7 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/
`test` (916/916)/`build` czyste. Zweryfikowane w przeglądarce PL/EN/RU realnym before/after
porównaniem treści sekcji Etap C (nie tylko markerem) — tekst tłumaczony poprawnie w każdym
języku, `ps aux | grep next-server` puste przed i po.

**To zamyka cały rollout `Warning.message`/string `Assumption` → `i18nKey`/`{kod,params}` dla
kodu domenowego z realnym tekstem.** Jedyny pozostały, świadomie odłożony zakres: `pv/czystosc-i-snieg`,
`baterie/komunikacja-bms`, `baterie/porownanie-technologii` — dane katalogowe (nazwy/opisy
produktów, technologii), wymagające osobnej decyzji architektonicznej o modelu i18n dla treści
katalogowej (nie prostego `Warning`/`Assumption`), poza pierwotnym zakresem instrukcji "83 pliki".
Rekomendacja na następną sesję: albo świadomie zamknąć temat jako "zrobione w zakresie
Warning/Assumption", albo otworzyć nowy, odrębny wątek dla i18n danych katalogowych — to wymaga
decyzji właściciela projektu, nie do rozstrzygnięcia samodzielnie (rozdział 15.4).

## Sześć otwartych pytań zebranych i rozstrzygniętych przez właściciela projektu (19.09.2026)

Na prośbę właściciela ("zrób oddzielny wątek i dawaj zdecydujemy") zebrano wszystkie pytania z
`docs/lista-do-zrobienia.md`/`docs/memory.md`, które AI zgłosiło jako wymagające decyzji
właściciela (15.4) i nie rozstrzygnęło samodzielnie, z opcjami rozwiązania per pytanie. Sześć
odpowiedzi, różny status realizacji:

1. **Model i18n dla treści katalogowej** (`pv/czystosc-i-snieg`, `baterie/komunikacja-bms`,
   `baterie/porownanie-technologii`) — **decyzja: otworzyć nowy, odrębny wątek** (opcja B).
   Nie realizowane w tej sesji — czeka na osobne zadanie.
2. **Integracja Ekran 1 ↔ Ekran 6, Moduł 4 (baterie)** — **decyzja: zbudować pełny profil
   wejściowy "Mój sprzęt"** (opcja B), nie tylko wąskie spięcie tych dwóch ekranów. **Zrealizowane
   (19.09.2026) w zakresie świadomie zawężonym do baterii** — pełna wizja źródła
   (`docs/zrodla/Zasady_UX_Doradca_v2_1.md`, §10: panel/falownik/BMS/generator, wiele zapisanych
   profili/wariantów, ostrzeżenie o niezapisanych zmianach) jest dużo większa niż to, co realnie
   blokowało te dwa ekrany — zbudowano ją teraz w kształcie gotowym do rozszerzenia, nie w pełnej
   docelowej skali, żeby nie projektować pod hipotetyczne, jeszcze niepotrzebne pola (CLAUDE.md,
   "nie projektuj pod przyszłe wymagania").

   **Kod:** `lib/profil-sprzetu/types.ts` (`ProfilSprzetu { bateria?: ProfilSprzetuBaterii }` —
   kształt otwarty na przyszłe sekcje `panel`/`falownik`/`generator`, żadna z nich jeszcze nie
   istnieje) + `lib/profil-sprzetu/use-profil-sprzetu.ts` (ten sam wzorzec co
   `use-persisted-draft.ts` — `IndexedDbStorageAdapter`, Seed nie Wynik — ale z JEDNYM ustalonym
   kluczem `offgrid.profil-sprzetu.v1`, współdzielonym między ekranami, nie `kluczEkranu` per
   wywołanie jak w drafcie formularza). Ekran 1 (`dobor-pojemnosci-baterii/page.tsx`) zapisuje
   `pojemnoscUzytecznaDzisKwh` do profilu po każdym poprawnym przeliczeniu; Ekran 6
   (`starzenie-degradacja/page.tsx`) auto-wypełnia z niego swoje pierwsze pole (edytowalne, nie
   zablokowane — nadpisanie nie zapisuje się trwale do profilu, zgodnie z wymogiem źródła), i po
   swoim przeliczeniu zapisuje `pojemnoscPoczatkowaZBuforemKwh`/`buforHoryzontLata` z powrotem —
   Ekran 1 to wykrywa i dodaje drugą linię wyniku ("Z uwzględnieniem starzenia ogniw na N lat:
   X kWh"), z linkiem w obie strony (nawigacja, §9 Zasad UX — "brak ślepych zaułków").

   **Pułapka ESLint znaleziona i naprawiona przed shipem:** pierwsza wersja auto-wypełnienia w
   Ekranie 6 użyła `useEffect` + `setState` synchronicznie w ciele efektu —
   `react-hooks/set-state-in-effect` (kaskadowe re-rendery). Poprawiona wersja ustawia stan
   bezpośrednio w renderze (wzorzec "Adjusting state when a prop changes" z react.dev), z
   flagą-stanem `autoWypelnione` (nie `useRef` — kolejny błąd lintera, `react-hooks/refs`:
   odczyt/zapis refa w renderze jest w tym projekcie zablokowany, nie tylko w efekcie). `zapiszBaterie`
   w hooku owinięte w `useCallback([])`, inaczej nowa tożsamość funkcji przy każdym renderze
   wywołanym przez własny zapis dałaby nieskończoną pętlę efektu w komponencie wołającym.

   **Świadomie odłożone, nie przeoczone:** wiele zapisanych profili/wariantów (dziś jeden,
   niejawny profil na przeglądarkę — ten sam poziom co `lib/wyglad/`), ostrzeżenie o
   niezapisanych zmianach przy wyjściu z ekranu, sekcje `panel`/`falownik`/`generator`, UI w
   Ustawieniach do przeglądu/resetu profilu wprost (dziś tylko niejawny efekt boczny dwóch
   ekranów, bez własnego widoku). Do rozważenia w kolejnym kroku, jeśli więcej ekranów zacznie
   korzystać z tego samego profilu.

   Zweryfikowane: `pnpm typecheck`/`lint`/`test` (916/916)/`build` czyste. Playwright
   (`pnpm build && pnpm start`, potwierdzenie braku rezydualnego `next-server` przed i po):
   Ekran 1 → Ekran 6 (auto-wypełnienie 47,37 kWh z wejścia 12 kWh/3 dni/95%/80%) → powrót na
   Ekran 1 (bufor z Ekranu 6 poprawnie widoczny: "59,2 kWh" przy degradacji 2%/10 lat), zero
   błędów konsoli poza pre-existing 404 `_vercel/insights` (niezwiązane z tą zmianą, obecne też
   na `main` przed nią).
3. **Własne logo/ikony PWA** — **decyzja: zaprojektować własne logo teraz** (opcja A), kilka
   propozycji do wyboru właściciela. **Wybór dokonany i wdrożony (19.09.2026): koncepcja D
   "Monogram OG"** — litery O i G (Off Grid) zlane w jeden znak, kolory 1:1 z istniejącymi
   tokenami aplikacji (`--primary` na tło, akcent "G" pożyczony z `--werdykt-uwaga`, bez
   dodawania trzeciego koloru do palety). Zastąpiony domyślny znak v0.app: `public/icon.svg`
   (źródło wektorowe) + `icon-192.png`/`icon-512.png`/`apple-icon.png`/`icon-light-32x32.png`/
   `icon-dark-32x32.png` (rasteryzowane z niego Playwrightem — brak `sharp`/`rsvg-convert` w
   środowisku, headless Chromium jako zamiennik). Light/dark warianty faviconu celowo identyczne
   — to pełnokolorowa plakietka, nie inwertowany mono-znak jak stary placeholder, więc rozróżnienie
   motywu przestało być potrzebne (kod `app/layout.tsx` niezmieniony, dwa pliki zostają z tych
   samych powodów co poprzednio: łatwe zróżnicowanie w przyszłości, gdyby było potrzebne).

   **Bug znaleziony przez realną weryfikację w przeglądarce, nie przez samo `pnpm build`:**
   pierwsza wersja `icon.svg` miała komentarz XML z dwoma dosłownymi wystąpieniami `--` (nazwy
   tokenów CSS `--primary`/`--werdykt-uwaga` wklejone wprost do treści komentarza) — nielegalne
   w XML (komentarz nie może zawierać `--`). `pnpm build`/`typecheck`/`lint` tego nie złapały
   (to statyczny plik, nie kod), a `curl` na `/icon.svg` też pokazywał 200 (serwer i tak zwraca
   bajty pliku). Dopiero nawigacja Playwrightem wprost na `/icon.svg` pokazała natywny błąd
   parsera XML Chromium ("Comment must not contain '--'") zamiast obrazka — to samo spotkałoby
   każdą przeglądarkę ładującą `<link rel="icon" type="image/svg+xml">` z `app/layout.tsx`.
   Naprawione (komentarz przepisany bez `--`), zweryfikowane ponownie — poprawny render ikony.
   **Zasada do zapamiętania:** przy edycji `public/*.svg` zawsze nawigować bezpośrednio na plik w
   przeglądarce (nie tylko sprawdzać kod HTTP), nie tylko oglądać go jako `<img>`/tło w innym
   kontekście, który bywa bardziej tolerancyjny na błędy XML niż nawigacja na sam dokument.

   Zweryfikowane: `pnpm typecheck`/`lint`/`build` czyste (bez zmian w kodzie TS — tylko zasoby
   statyczne), Playwright (`pnpm build && pnpm start`, `next-server` sprzątnięty przed i po):
   wszystkie pliki ikon 200, `/icon.svg` renderuje się poprawnie jako obraz, zero nowych błędów
   konsoli (pre-existing 404 `_vercel/insights` niezwiązany).
4. **Żywy edytor kolorów w Ustawieniach** — **decyzja: pełny edytor** (opcja B), cała paleta
   tokenów motywu, nie tylko kilka kluczowych. **Korekta tego samego dnia:** przed napisaniem
   kodu sprawdzono stan repo — okazało się, że to pytanie było już nieaktualne (dryf dokumentacji,
   patrz akapit korekty wyżej, wpis 2026-08-30) — edytor już istnieje i już pokrywa dokładnie ten
   zakres. Nic do zrobienia.
5. **Logowanie/konta — konfiguracja Supabase** — właściciel podłączy klucze w niedzielę po
   20:00. Bez zmian w kodzie do tego czasu — szkielet czeka jak dotychczas (`docs/lista-do-
   zrobienia.md`, wpis 2026-09-15).
6. **Model freemium (rozdz. 12 standardu)** — właściciel zajmie się decyzją biznesową
   (co płatne, cena) w niedzielę. Bez zmian w tej sesji.

## Kontynuacja: punkty 5/6/7/8/9 z listy zaległości (19.09.2026)

Właściciel poprosił o realizację pięciu zaległych punktów z audytu "co jeszcze zostało do
zrobienia" (patrz odpowiedź w tej samej sesji): kontynuacja Modułu 2, animowane ikony kafli
08-14, luki z gotową treścią źródłową (`docs/rejestr-pokrycia.md`), rollout autozapisu
(`usePersistedDraft`) na resztę ekranów, i domknięcie luki 1000-3000W (M4/napięcie-systemowe).

**Punkt 9 — kolejny dryf dokumentacji, nie realna praca:** kod już ma rekomendację 24V dla pasma
1000–3000W (`PROG_12V_MAX_W`/`PROG_48V_MIN_W`, `constants.ts`), z jawną assumption
`NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE` — zrobione 2026-09-04, wpis w `docs/lista-do-
zrobienia.md` po prostu nigdy nie dostał domykającego dopisku. Skorygowane bez zmian w kodzie.
**Trzeci taki przypadek w tej sesji** (po edytorze kolorów i teraz tym) — wzorzec do zapamiętania:
zawsze sprawdzić realny stan kodu przed rozpoczęciem "zaległej" pracy, nie ufać samej liście zadań.

**Punkt 7a — cztery luki z rejestru pokrycia, "gotowe do budowy" wg audytu 05.09.2026:**
zbudowane 2.15 (Ryzyko PID, Moduł 3) i 8.8 (Dobór regulatora PWM vs MPPT, Moduł 12) jako
prawdziwe kalkulatory — obie miały realny, computable próg w źródle. **5.46 (ryzyko
zamarznięcia dolnego źródła) i 5.31 (hałas i wibracje), oba Moduł 6, okazały się PRZY
REALIZACJI nie mieć wzoru** — wcześniejszy audyt określił je jako "gotowe do budowy, pełna
treść Doradcy z formułą", ale źródło (`Tresc_Modul_6_Ogrzewanie_Ekrany.md:306-326`) daje tylko
narrację + jeden ilustracyjny przykład liczbowy, bez wzoru wiążącego wejścia z wynikiem
("pełny szablon Doradcy A/B/C/D" ≠ "ma computable formułę" — ważne rozróżnienie na przyszłość:
etykieta "kompletny szablon" w źródle nie gwarantuje obliczalności). Zbudowane jako Wzorzec C
(treść informacyjna: czynniki ryzyka z odniesieniem do źródła danych, przykład jawnie oznaczony
"ilustracyjny, nie liczony dla Twojej instalacji", zalecenia, bez kalkulatora) — zgodnie z
dyscypliną "nie wymyślaj wzoru fizycznego" (CLAUDE.md, rdzeń operacyjny). 5.46 dopisane do
`docs/rejestr-twardych-stopow.md` (🔴), 5.31 świadomie nie (🟡, rejestr indeksuje tylko 🔴).

**Bug znaleziony przez Playwright, nie przez typecheck/lint/test:** pierwsza wersja dodała
`i18nKey` dla `Warning` w obu kalkulatorach (PID, PWM/MPPT), ale zapomniała, że `assumptions`
(`{kod, params}`) też przechodzą przez `t()` w `WynikSzczegoly` — brakujące klucze
`PID-PROG-NAPIECIA-ZE-ZRODLA`/`PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY` dały realny błąd
konsoli "Brak tłumaczenia dla części komunikatu" (fail-loud po `lib/i18n/t.ts` — nigdy cichy
fallback), niewidoczny w markerze `⚠ [` bo dotyczy `assumptions`, nie `warnings`. Naprawione,
dopisane do `t.test.ts`. **Zasada do zapamiętania przy każdym nowym module z i18n od zera:**
sprawdzić klucze zarówno dla `Warning.i18nKey` JAK I dla każdego `{kod}` w `assumptions` —
oba idą przez ten sam `t()`, oba wymagają wpisu w słowniku.

`scripts/check-i18n-guard.mjs` → `MIGRATED_MODULES`: 87→89 (oba nowe moduły budowane
od razu z `i18nKey`, bez `.message`, zgodnie z konwencją "nowy kod domenowy = i18n od startu").
7 nowych testów domenowych (`ryzyko-pid`, 7; `dobor-regulatora-pwm-mppt`, 8) + nowy blok w
`t.test.ts` (5 kluczy z parametrami, 2 bez). `pnpm typecheck`/`lint`/`check:i18n-guard`/`test`
(933/933)/`build` czyste. Zweryfikowane end-to-end w przeglądarce (Playwright, świeży
`pnpm build && pnpm start`, potwierdzenie braku rezydualnego `next-server` przed i po) w
PL/EN/RU dla obu kalkulatorów + render obu ekranów informacyjnych — zero `⚠ [...]`, zero
błędów konsoli po poprawce.

**Punkt 7b — Wind Chill (Moduł 7, stress-test zimowy), "najsilniejszy niezależny kandydat"
klastra zimowego wg rejestru pokrycia:** `lib/core/modules/stress-test/wind-chill/`. Wzór
NWS/Environment Canada (2001), metryczny — ten sam wzorzec co Magnus-Tetens (`ochrona-wilgoc`)
i deklinacja Coopera (`profil-astronomiczny`): uniwersalna, publicznie znana fizyka/meteorologia
niepodana wprost w źródle projektu, nie wymyślona. Zweryfikowane niezależnie w Node przed
implementacją: przykład źródła (-10°C, 40km/h → "-20°C") odtwarza się z dokładnością 0,8°C
(wzór daje -20,77°C) — silne potwierdzenie, że to właściwy wzór. Świadomie NIE liczony drugi
człon przykładu źródła ("+35% strat ciepła, +2 kWh/dobę") — wymagałby modelu termicznego
budynku (Moduł 6) wiążącego deltę wind chill z procentowym wzrostem strat, którego źródło nie
podaje (tylko jeden ilustracyjny przykład). Ekran liczy wyłącznie temperaturę odczuwalną.
`OUT_OF_SCOPE` poza zakresem ważności wzoru (T>10°C lub wiatr≤4,8km/h, granice wzoru NWS, nie
luka źródła).

`MIGRATED_MODULES`: 89→90. 10 nowych testów domenowych (w tym 3 z wartościami referencyjnymi
zweryfikowanymi niezależnie w Node) + nowy blok w `t.test.ts` (6 kluczy z parametrami, 3 bez).
`pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (943/943)/`build` czyste. Zweryfikowane w
przeglądarce (Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU: przypadek VALID
(-20,8°C) i OUT_OF_SCOPE poprawnie przetłumaczone, zero `⚠ [...]`, zero nowych błędów konsoli.

To zamyka punkt 7 z listy zaległości (5,6,7,8,9) w zakresie, jaki dawał się zrealizować bez
wymyślania fizyki/wzorów. Pozostały klaster stress-test zimowy (~25 pozostałych `todo` w
`docs/rejestr-pokrycia.md`) jest w większości jawnie oznaczony jako "zależny" od modułów
jeszcze niezbudowanych (M1 geostruktura bez treści źródłowej, model termiczny M6, baza
komponentów) — nie kolejne "gotowe do budowy" luki, tylko architektoniczna kolejność.

## Punkt 5 — kontynuacja Modułu 2 "Zapotrzebowanie", 4 pozostałe ekrany numerowane (19.09.2026)

Ekrany 3, 10, 14, 15 — ostatnie cztery pozostałe `todo` z sekwencji numerowanej Modułu 2
(poza modułem zbiorczym "Wampiry energetyczne", 24 funkcje, świadomie odłożony jako osobny,
duży krok — patrz niżej).

- **Ekran 3 (1.3/1.4/1.5) — Urządzenia zmienne + płyta indukcyjna + klasa energetyczna:**
  `lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/`. Mnożnik klasy energetycznej 1:1 ze
  źródła. **Nowy wariant wzorca "echo"**: domyślne moce urządzeń (pralka/zmywarka/lodówka/
  czajnik/mikrofalówka/laptop/TV/oświetlenie) reużyte z `baterie/napiecie-systemowe/
  constants.ts` (`KATALOG_ODBIORNIKOW`) zamiast wymyślać nowe liczby — ale świadomie TYLKO moc,
  nie czas pracy (tamten katalog koduje `czasPracyDomyslnyMin: 0` jako "ciągłe/bazowe", inny
  sens niż "ile dziś używasz tego urządzenia" — echo dosłowne dałoby zero energii, więc pole
  czasu zostaje puste, do ręcznego wpisania).
- **Ekran 10 (1.13) — Sprawność inwertera przy niskim obciążeniu:**
  `lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/`. Sprawność WPISYWANA
  ręcznie (źródło daje tylko dwa punkty narracyjne krzywej, nie pełny wzór interpolacji).
  **Znaleziona i udokumentowana niespójność przykładu źródła**: "sprawność 75% → +25% zużycia"
  jest matematycznie błędne (75% daje +33,3%, nie +25%; +25% odpowiada sprawności 80%) — wzór
  wdrożony poprawnie fizycznie, przykład źródła NIE wymuszony do zgodności.
- **Ekran 14 (1.26) — Architektura 1-fazowa/3-fazowa:**
  `lib/core/modules/zapotrzebowanie/architektura-fazowa/`. Liczy rozkład obciążenia i asymetrię
  % między fazami (przykład źródła L1=4200W/L2=L3=2000W → 52,4%, odtworzony dokładnie).
  **Świadomie bez automatycznego werdyktu ok/zabroniona** — źródło opisuje "znaczną asymetrię"
  🔴 jakościowo, bez liczbowego progu; wymyślenie progu (np. z branżowych norm PN-EN 50160/IEC
  dla niezrównoważenia napięcia) byłoby złamaniem dyscypliny "nie wymyślaj norm" — inny rodzaj
  wielkości (napięcie vs moc) i inny kontekst (jakość sieci vs projekt off-grid), nie
  bezpośrednio przenośne. Kalkulator pokazuje liczby, użytkownik ocenia sam.
- **Ekran 15 (1.27) — Kategorie specjalne:** `lib/core/modules/zapotrzebowanie/kategorie-specjalne/`.
  Przełącznik 3 kategorii (Warsztat/Gospodarstwo/Oświetlenie terenowe) + ręczna lista urządzeń.
  Źródło podaje TYLKO nazwy przykładowych urządzeń dla "Warsztat" (szlifierka/wiertarka/
  spawarka), zero liczb dla żadnej kategorii — świadomie bez "gotowego profilu" z domyślnymi
  mocami wspomnianego w opisie źródła (Sekcja A: "przełącznik kategorii z gotowym profilem"),
  bo wymyślenie mocy urządzeń warsztatowych/gospodarczych/terenowych złamałoby dyscyplinę
  "nie wymyślaj danych" — przyciski szybkiego dodania nazwy (bez mocy) to maksimum uczciwie
  możliwe z tego źródła.

`MIGRATED_MODULES`: 90→94 (wszystkie 4 nowe moduły od startu z `i18nKey`, zero `.message`).
22 nowe testy domenowe + nowy blok w `t.test.ts` (9 kluczy z parametrami). `pnpm typecheck`/
`lint`/`check:i18n-guard`/`test` (965/965)/`build` czyste. Zweryfikowane w przeglądarce
(Playwright, świeży `pnpm build && pnpm start`) w PL/EN/RU dla wszystkich 4 ekranów — treść
tłumaczona poprawnie (sprawdzone wprost porównaniem tekstu ostrzeżeń między językami, nie
tylko brakiem markera `⚠ [`), zero nowych błędów konsoli.

**Świadomie odłożone, nie przeoczenie:** moduł zbiorczy "Wampiry energetyczne" (1.24, 1.28–1.50,
24 dawne funkcje w jednym ekranie z podzakładkami: Katalog urządzeń/Pomiar/Symulacje-Raporty/
Rekomendacje sprzętowe/Automatyzacja, pełna treść w `Biblia_Offgrid_v2_0_Architektura_Modulowa.md`
linie 607-680+) — to osobny, znacznie większy krok niż pojedynczy ekran D, wymaga własnej sesji
projektowej (5 podzakładek, nie jeden prosty kalkulator). Zamyka punkt 5 z listy zaległości w
zakresie czterech numerowanych ekranów; moduł wampirów pozostaje `todo` w rejestrze, do
zaplanowania jako osobne zadanie.

## Punkt 8 — rollout `usePersistedDraft` na wszystkie pozostałe ekrany kalkulatorów (20.09.2026)

Ostatni z pięciu punktów z prośby "5,6,7,8,9 proszę zrób" wymagający kodu (punkt 6 — kafle
08–14 — czeka osobno na przegląd użytkownika w artefakcie, patrz sekcja niżej). Przed tym
zadaniem tylko `napiecie-systemowe` miało autosave (zgłoszenie użytkownika 15.09.2026,
przeładowanie karty w tle gubiło wpisane dane) — pozostałe 114 z 115 ekranów kalkulatorów
używało zwykłego `useState`, tracąc draft formularza przy każdym odświeżeniu.

**Wzorzec transformacji** (mechaniczny, bez zmiany logiki domenowej): każde pojedyncze
`useState` per pole skonsolidowane w jeden `type FormularzStan` + `const STAN_POCZATKOWY`,
podłączone pod `const [stan, setStan] = usePersistedDraft<FormularzStan>("<klucz-ekranu>",
STAN_POCZATKOWY)` (klucz = nazwa katalogu pod `app/kalkulatory/`). Generyczny helper `setPole`
+ per-pole `setX` zachowujące dokładnie tę samą nazwę i sygnaturę wywołania (wartość albo
funkcja aktualizująca) co oryginalny `useState` — dzięki temu JSX/`useMemo`/handlery w reszcie
pliku nie wymagały żadnej zmiany. Objęte wszystkie kształty stanu napotkane w repo: skalarne
stringi, boolean, unie typu `X | ""`, tablice `string[]` (checklisty), tablice obiektów z
dynamicznym dodawaniem/usuwaniem wierszy (`szyny-zbiorcze-miedzypakietowe`), liczby (`number`,
nie tylko `string` z inputów kontrolowanych ręcznie konwertowanych).

**Realizacja: dwuetapowa, po awarii pierwszego podejścia.** Pierwsze podejście — 8 równoległych
agentów w tle (batch po ~15 plików), każdy z identycznym, w pełni samodzielnym promptem
(dosłowny przykład transformacji `architektura-fazowa` przed/po + 10 reguł, w tym zakaz
`pnpm build`/`git commit` w agencie, i ostrzeżenie że równoległe batche mogą chwilowo psuć
globalny `pnpm typecheck`/`lint` innymi plikami). **Wszystkie 8 agentów padło na limit sesji
API (429, "session limit resets 11:10pm UTC")** w trakcie pracy, każdy zostawiając część swoich
plików nieprzekonwertowanych (75 z 114 zmienionych łącznie, resztę dokończono ręcznie w drugim
etapie następnego dnia, po resecie limitu). **Zweryfikowane przed kontynuacją**: `pnpm
typecheck`/`lint` czyste na 75 już zmienionych plikach — agenci nie zostawili żadnego pliku w
połowie edycji (błąd był czysto na poziomie orkiestracji/rate-limitu, nie na poziomie
poszczególnych edycji). Pozostałe 39 plików dokończone bezpośrednio (bez kolejnych subagentów,
żeby nie powtórzyć tego samego rate-limitu), tym samym wzorcem.

**Lekcja do zapamiętania**: równoległe uruchomienie 8 subagentów naraz (każdy robiący dziesiątki
wywołań API) może wyczerpać limit sesji konta szybciej niż praca sekwencyjna — dla dużych
mechanicznych rolloutów bezpieczniej dzielić na mniej równoległych batchy (2-4) albo pracować
sekwencyjnie/bezpośrednio, zwłaszcza gdy zadanie jest w pełni mechaniczne i nie wymaga
kreatywnej oceny per plik.

**Weryfikacja końcowa (wszystkie 115 kluczy `usePersistedDraft` — 114 nowych + istniejący
`napiecie-systemowe` — sprawdzone jako unikalne, brak kolizji):** `pnpm typecheck`/`lint`/`test`
(965/965)/`build` czyste. Playwright (świeży `pnpm build && pnpm start`, `next-server`
sprzątnięty przed i po) na próbce 5 ekranów o różnych kształtach stanu (proste pole liczbowe,
checkbox-lista, dynamiczna tablica z dodawaniem wierszy) — wpisana wartość przetrwała pełne
przeładowanie strony (`page.reload()`) we wszystkich 5 przypadkach, zero nowych błędów konsoli
(jedyny zaobserwowany błąd — nieudane wczytanie `@vercel/analytics/next` insights script —
pre-istniejący, niezwiązany z tą zmianą, wynika z braku dostępu do sieci Vercel w tym
środowisku sandboxowym, występuje na każdej stronie niezależnie od rollout'u).

## Punkt 6 — kafle 08–14, wdrożenie po akceptacji (20.09.2026)

Ostatni punkt z prośby "5,6,7,8,9 proszę zrób". Artefakt "Off-Grid Tile Set 08–14"
(https://claude.ai/artifact/BzWE2Tgz2amFhRxDCMSFQi) zaakceptowany przez właściciela projektu
("kafle możesz dodawać") bez uwag per-kafel — wdrożone 1:1 wizualnie, z nazwami klas/gradientów
zmienionymi z roboczych (`k8-`, `g-sky`) na konwencję repo (`ki-` prefiks dla keyframes,
`ki-<nazwa>-grad` dla gradientów, `tile-<nazwa>-symbol` dla id symboli — analogicznie do
kafli 01–07).

- **Nowe gradienty** (`components/kafle-ikony/definicje-symboli.tsx`): `ki-pcb-grad` (09),
  `ki-ai-grad` (10), `ki-settings-grad` (14). Kafle 08/11/12 reużywają istniejący `ki-sky-grad`,
  kafel 13 reużywa `ki-sky-grad-night` — bez duplikowania.
- **7 nowych `<symbol>`**: `tile-safety-symbol` (08), `tile-electronics-symbol` (09),
  `tile-ai-forecast-symbol` (10), `tile-battery-mount-symbol` (11), `tile-quick-calc-symbol` (12),
  `tile-live-symbol` (13), `tile-settings-symbol` (14).
- **Reużyte generyczne klasy animacji** (bez duplikowania CSS): `.signal`/`.packet` (09, 13),
  `.bar` (10), `.cell-level` (11), `.bolt` (12), `.star` (13) — dokładnie tak, jak artefakt
  deklarował w swoim opisie. **Świadoma korekta względem artefaktu**: kafel 12 w wersji roboczej
  miał na tym samym elemencie DWIE klasy (`k12-bolt bolt`) z dwiema różnymi, konkurującymi
  animacjami na `animation` (shorthand — nie sumują się, wygrywa tylko later-in-cascade) — to
  nadmiarowość/błąd artefaktu, nie zamierzony efekt. Naprawione przy porcie: zostawiona tylko
  istniejąca `.bolt` (ten sam puls opacity+scale, którego już używają kafle 02/03/04), usunięta
  nadmiarowa `k12-bolt-flash`.
- **Nowe klasy per-kafel** (`kafle-ikony.css`): `.alarm-ring`/`.alarm-bell`/`.alarm-check` (08),
  `.led-a/b/c` + `.esp-wave` (09), `.ai-node` + `.ai-node-main` (10), `.wrench-tighten` (11),
  `.tap-ripple` (12), `.live-dot` (13), `.gear-spin` + `.toggle-slide` (14).
- **`ikona.tsx`**: `SYMBOL_PO_ID_KAFLA` rozszerzone o 8–14 (wszystkie), `KafelIkonaSvg` dostał
  opcjonalny prop `size` (domyślnie 44, jak wcześniej) — żeby ta sama ikona dała się użyć w
  innym rozmiarze niż kafel gridu, gdyby zaszła taka potrzeba.

**Znalezisko przy weryfikacji, nie błąd — kafel 14 "Ustawienia" nie ma miejsca w gridzie.**
`lib/pulpit/registry.ts`'s `KAFLE` (tablica renderowana w gridzie pulpitu) ma tylko id 1–13;
`USTAWIENIA_KAFEL` (id 14) to osobna stała, renderowana wyłącznie jako mały link tekstowy w
nagłówku (`⚙️ Ustawienia`), razem z dwoma innymi skrótami (`📍 Lokalizacja i teren`,
`📡 Tryb Live`) — **wszystkie trzy konsekwentnie używają samego emoji**, nawet mimo że kafle 1
i 13 MAJĄ już zbudowane animowane ikony widoczne w głównym gridzie. Rozważona i odrzucona opcja:
podmienić tylko emoji "Ustawień" na animowane SVG w tym pasku — zepsułoby to spójność stylu
całego paska (3 linki, 3 różne traktowania). Zamiast tego: symbol/CSS dla kafla 14 zarejestrowane
i gotowe do użycia (tak jak 08–13), ale nieużyte na razie nigdzie w UI — czeka na naturalne
miejsce (np. gdyby `/ustawienia` dostało kiedyś nagłówek z ikoną modułu, tak jak inne strony
`/moduly/[id]`).

**Znalezisko przy weryfikacji, nie błąd — kafle 09 i 11 nie pokazują nowych ikon SVG w gridzie.**
`lib/pulpit/maskotki.ts` (`MASKOTKA_PO_ID_KAFLA`) ma zdjęcia maskotki "Bob" dla kafli 3/5/6/7/9/11
— w `app/page.tsx` maskotka ma pierwszeństwo przed animowanym SVG (ten sam priorytet już
dotyczył kafli 3/6/7, które MAJĄ zbudowane ikony od dawna, a mimo to pokazują maskotkę na
gridzie) — świadome, pre-istniejące zachowanie, nie regresja tej zmiany. Nowe ikony 09/11 są
poprawnie zarejestrowane i renderują się, gdyby maskotka kiedyś zniknęła z mapy.

**Weryfikacja**: `pnpm typecheck`/`lint`/`build` czyste. Playwright (świeży `pnpm build &&
pnpm start`, `next-server` sprzątnięty przed i po) na pulpicie głównym — 4 z 7 nowych `<use>`
potwierdzone bezpośrednio w gridzie (08/10/12/13; 09/11 przesłonięte maskotką, opisane wyżej;
14 nie ma slotu w gridzie), zrzut ekranu całej strony sprawdzony wizualnie — bez nakładających
się elementów, bez złamanych ikon. Zamyka punkt 6 i całą prośbę "5,6,7,8,9 proszę zrób".

## Migracja i18n na client-side bundled (offline-first, 17.4) — 20.09.2026

Znalezisko z pełnego audytu GOD BOOK Y.6/Y.9 (sesja równoległa, branch `claude/app-rules-r4guty`,
PR #129 — zablokowany na CI infrastrukturalnie, 0ms billable na obu jobach, nie treścią diffu):
obecny mechanizm i18n (cookie+middleware) łamie deklarowany offline-first tego projektu. Na
wyraźną prośbę właściciela: zrealizowane od razu w osobnym branchu/PR (`claude/i18n-offline-first`,
z `main`, nie z zablokowanego branchu audytu, żeby nie czekać na jego CI), częściami z
weryfikacją po każdej.

**Kontekst decyzji.** `docs/standards/17-i18n.md`, 17.4 (korekta 16.09.2026, źródło: właściciel
repo): mandat "cookie+server-side domyślnie dla każdego projektu z dostępnym serwerem" łamał 5.3
(offline-first jako wymóg) — wymagał renderu per-request na serwerze przy KAŻDYM twardym
przeładowaniu, sprzeczne z sensem istnienia projektu "off-grid". Poprawiona oś decyzyjna: nie
"czy projekt ma serwer", tylko "czy projekt ma twardy wymóg offline (5.3)" — **jawna deklaracja
tego projektu (ten wpis)**: inzynier-offgrid-pro ma twardy wymóg offline, kategoria "zero cookie,
zero zależności od serwera dla języka", nie "głównie online" (ta druga — zero-waste, nazwany
wyjątek, 17.4a).

**Odkrycie procesowe przy starcie tego kroku.** Branch `claude/i18n-offline-first` utworzony z
`main` nie miał jeszcze zsynchronizowanego `docs/standards/17-i18n.md` z korektą 17.4 — bo ta
korekta była dotąd wdrożona tylko w osobnym, wciąż nieukończonym PR #129 (audyt, zablokowany na
CI infrastrukturalnie — 0ms billable na obu jobach, nie treścią diffu). Zsynchronizowano 5 plików
NIETYKALNE (00-INDEKS, 05, 08, 17 + 15-wspolpraca-z-ai — źródło miało już nowszy commit niż
audyt, w tym nową 17.1a) przed implementacją kodu, żeby branch był samospójny z regułą, którą
implementuje — osobny commit, `git diff -rq` zero różnic ze źródłem po synchronizacji.

**Co zmieniono (kod):**
- `lib/i18n/storage.ts` (nowy) — `useSyncExternalStore` + `localStorage` (`offgrid.jezyk.v1`),
  ten sam wzorzec co `lib/theme/storage.ts`/`lib/wyglad/storage.ts`/`lib/pulpit/storage.ts`.
  Pierwsza wizyta: `navigator.languages` (nie `Accept-Language` — niewidoczny bez serwera).
- `app/layout.tsx` — usunięty `getServerLanguage()`/cookie; `<html lang>` statyczne na
  `DEFAULT_LANGUAGE`, korygowane blokującym skryptem pre-paint (`JEZYK_INIT_SCRIPT`, ten sam
  wzorzec co `WYGLAD_INIT_SCRIPT` dla motywu) — zero błysku ATRYBUTU.
- `middleware.ts` — usunięta cała logika `ustawJezykJesliBrak`/cookie (CSP nonce i bramka
  Supabase nietknięte).
- `components/jezyk-wybor.tsx` — zapis do `localStorage` przez `zapiszJezyk()`, bez
  `router.refresh()` (zmiana natychmiastowa, czysto kliencka — realna poprawa UX, nie tylko
  neutralna zamiana mechanizmu).
- `app/kalkulatory/prognozy/page.tsx` + nowy `components/zalozenia-lista.tsx` — jedyny Server
  Component renderujący tłumaczony tekst wprost (`getServerLanguage()`+`t()`) wydzielony do
  Client Component (`useTranslate()` wymaga kontekstu Reacta, nie ma już cookie do odczytania
  server-side). Jedyny taki przypadek w projekcie — reszta ekranów już renderowała tłumaczenia
  przez `useTranslate()` w Client Components.
- Usunięte jako martwy kod: `lib/i18n/server-language.ts`, `lib/i18n/client-language.ts`.

**🟡 Znana, jawnie ujawniona luka do domknięcia (14.4) — flash widocznej treści.** Sam atrybut
`lang` nie migocze (skrypt pre-paint, jak wyżej). Widoczna TREŚĆ UI (tłumaczenia w komponentach)
może się skorygować krótko po hydratacji przy twardym przeładowaniu, jeśli zapisany/wykryty język
różni się od `DEFAULT_LANGUAGE` (polski) renderowanego server-side — SSR fizycznie nie może znać
`localStorage`. `useSyncExternalStore` (`getServerSnapshot()`→`getSnapshot()`) minimalizuje okno
i **nie generuje ostrzeżeń hydration mismatch** (potwierdzone Playwrightem na scenariuszu
en-US/pl/ru) — ale nie eliminuje flashu treści całkowicie, tylko skraca go do czasu hydracji.
Pełne wyeliminowanie wymagałoby architektury CSS-multi-language-DOM (wszystkie języki naraz w
SSR HTML, przełączane atrybutem/CSS — dosłowne odczytanie 17.4: "skrypt wstawia poprawną treść
PRZED pierwszym malowaniem") — świadomie NIE wdrożone teraz: duży refaktor dotykający ~130
ekranów używających `t()`, poza zakresem tego kroku ("częściami, żeby nic nie namieszać"), czeka
na wyraźną decyzję właściciela, jeśli flash treści okaże się realnym problemem w praktyce (dziś:
tylko przy twardym przeładowaniu z językiem ≠ polski — mniejszość ruchu, biorąc pod uwagę że
polski jest bazowy i domyślny).

**Weryfikacja**: `pnpm typecheck`/`lint`/`check:i18n-guard`/`test` (965/965)/`build` czyste.
Playwright (świeży `pnpm dev`): świeże wejście bez zapisanej preferencji → fallback
`navigator.languages` (en, locale przeglądarki testowej — nie zawsze pl, zgodnie ze specyfikacją
17.4, nie błąd); przełączenie w Ustawieniach na Polski → natychmiastowa zmiana `<html lang>` +
zapis `localStorage`, bez przeładowania strony; twarde przeładowanie z zapisanym `ru` → `<html
lang="ru">` od razu (skrypt pre-paint, przed hydracją); ekran Prognozy (skonwertowany) renderuje
poprawnie. Zero nowych błędów konsoli w żadnym z 4 scenariuszy.

## Limit minut GitHub Actions wyczerpany + `paths-ignore` w CI — 20.09.2026

**Znalezisko.** PR #129 i #130 failowały na obu wymaganych checkach z komunikatem, który
początkowo wyglądał na błąd infrastrukturalny (0ms billable, brak logów, identyczna awaria na
dwóch niezależnych PR-ach). Rzeczywista przyczyna, potwierdzona przez właściciela repo ze
zrzutu ekranu GitHub Actions: adnotacja *"The job was not started because recent account
payments have failed or your spending limit needs to be increased"* — **darmowy limit 2000
minut Actions/miesiąc (GitHub Free, repo prywatne) został w całości wyczerpany** (2000/2000,
reset za 11 dni), nie awaria konta ani treść PR-ów. Potwierdzone przez `github.com/settings/
billing/summary`: $12.00 zużycia w 100% pokryte darmowym limitem — zero realnej płatności,
tylko blokada dalszego zużycia (budżety kontowe ustawione na $0 ze "Stop usage: Yes").

**Przyczyna zużycia.** Tempo tej sesji (dziesiątki pełnych przebiegów CI dziennie, każdy commit
= osobne uruchomienie 2 jobów) zjadło 2000 minut w ~19 dni. Zmierzone realnie na udanym
przebiegu (run #83, 20.09.2026): job `Lint, typecheck, test, build` = 3m33s → liczony jako
**4 minuty** (Actions zaokrągla w górę do pełnej minuty), job `Dependency vulnerability audit`
= 25s → liczony jako **1 minuta** (minimum, nawet za parę sekund pracy — sam narzut
checkout+setup-node+pnpm install to ~17 z tych 25s). Razem **5 minut/przebieg**, niezależnie
od tego, czy diff dotyczył kodu czy samej dokumentacji.

**Rozważone i odrzucone: scalenie dwóch jobów w jeden.** Oszczędziłoby tylko ~1 minutę/przebieg
(job audytu i tak jest liczony jako minimum 1 minuta, bez względu na scalenie) kosztem
zgaszenia celowego rozdzielenia sygnałów awarii z `docs/standards/11-ci-deployment.md` (11.2 +
11.5) — "żeby znana, nienaprawialna od razu podatność nie blokowała np. mergowania czystego
fixa lintera, i odwrotnie". Zysk nie uzasadniał utraty tej własności — **dwa joby zostają
rozdzielone**.

**Wdrożone: `paths-ignore` w `.github/workflows/ci.yml`** (osobny PR, branch
`claude/ci-paths-ignore`) — `docs/**`, `**/*.md`, `.claude/**` pomijają CI całkowicie zarówno
na `pull_request`, jak i na `push` do `main`. Ta sesja miała sporo commitów czysto
dokumentacyjnych (wpisy do `docs/memory.md`/`docs/wklad-do-standardu.md`, synchronizacje
`docs/standards/`) — PR #129 w całości był tego typu (5 plików, same `docs/`) i przy tym
filtrze w ogóle nie zużyłby minut. Zweryfikowano: `yaml.safe_load` parsuje plik bez błędów,
struktura `on:` dokładnie taka jak zamierzona (`paths-ignore` na obu triggerach). Zmiana w
samym `ci.yml` nie jest objęta wzorcami — commit do workflow zawsze uruchamia CI.

**Otwarte, poza zakresem tej sesji:** trwały sposób na uniknięcie ponownego wyczerpania limitu
(repo publiczne — nielimitowane minuty, kosztem widoczności kodu; GitHub Pro — +1000 minut/mies.
za $4, prawdopodobnie niewystarczające przy tym tempie pracy) — decyzja biznesowa właściciela,
nie techniczna, czeka na wybór. Do tego czasu: PR #129 i #130 czekają na reset limitu (11 dni od
20.09.2026) albo decyzję właściciela o jednej z płatnych/publicznych opcji.

## Aktualizacja ze standardu (20.09.2026, druga tego dnia) — 9.0a, 15.7a, doprecyzowanie 9.3

Na polecenie "Aktualizacja" (Y.6). `git fetch`+`git merge --ff-only` w lokalnym klonie
`new-app-standards`, `8793045..a2f1580` — bez odświeżenia klonu poprzedni odczyt raportowałby
fałszywie "brak nowości" (ta sama pułapka co 15.09/16.09). Znaleziono i wprowadzono:

- **`docs/standards/09-ai-w-produkcie.md`** — nowa 9.0a (rejestr narzędzi AI jako architektoniczny
  domyślny od Etapu 1) + doprecyzowanie 9.3 (most JSON Schema, kolejność "opis na końcu").
- **`docs/standards/15-wspolpraca-z-ai.md`** — nowa 15.7a (nie zgaduj API biblioteki zewnętrznej,
  zweryfikuj `node_modules`).
- **`docs/standards/00-INDEKS.md`** — opisy rozdz. 9 i 15 zaktualizowane pod nową treść.

Wszystkie trzy pliki skopiowane **pełnym nadpisaniem** ze źródła (NIETYKALNE — `cp`, nie ręczny
merge), zweryfikowane `diff -q` = identyczne po skopiowaniu. Zero zmian w kodzie tego projektu
wymaganych — obie nowe reguły (9.0a, 15.7a) **pochodzą z tego samego projektu** (zgłoszone do
`docs/wklad-do-standardu.md` chwilę wcześniej tego samego dnia) — projekt już dziś robi dokładnie
to, co nowa reguła nakazuje, nie ma tu żadnej luki do domknięcia.

**Dodatkowo: korekta bookkeepingu `docs/wklad-do-standardu.md`.** Przy okazji tego sync-u sprawdzono
programistycznie (grep po `inzynier-offgrid-pro` w całym świeżo zsynchronizowanym `docs/standards/`),
które z dotychczasowych wpisów `Status: 🔎 nowe` są w rzeczywistości już od dawna skonsolidowane, a
status po prostu nigdy nie został zaktualizowany. Znaleziono i poprawiono **9 stale statusów**
(wpisy o: kontrakcie AI z 14.09, rozdziale logowania z 14.09, wielojęzyczności z 14.09, błędzie CSP
hash/nonce z 16.09 — **w tym przy okazji potwierdzone, że `middleware.ts` tego projektu też ma już
naprawę nonce-per-request**, nie tylko standard — audyt szablonu D vs C z 20.09, wzorca
nieretroaktywnego z 20.09, limitu subagentów z 20.09, oraz dwóch własnych wpisów z tego samego dnia
o AI). Dwa wpisy z 06.09 (procedura materiałów źródłowych, biblioteka norm) pozostają `🔎 nowe` —
sprawdzone, faktycznie jeszcze nieskonsolidowane. Ta sama lekcja co przy `docs/rejestr-pokrycia.md`
tego samego dnia: **nie ufaj metryczce/statusowi zapisanemu wcześniej — sprawdź programistycznie
względem aktualnego źródła**, zwłaszcza gdy okazja (tu: świeży `cp` ze źródła) pozwala to zrobić
tanio, przy okazji innego zadania.

## Doprecyzowanie zasady: konsolidacja do new-app-standards nigdy z tej sesji (20.09.2026, trzecia dziś)

Właściciel repo poprosił o dokończenie dwóch ostatnich otwartych zgłoszeń (materiały źródłowe,
biblioteka norm) — jednoznacznie odpowiedział, gdy zapytany o zakres: **"Ty nic nie robisz w cudzych
repo, działasz tylko w swoim... Ty nic nie robisz, robi to repo new app standards."** Potwierdza to
wprost zasadę z korekty 16.09.2026 (PR #9) — dostęp do `new-app-standards` w tej sesji (do
`git fetch`/odczytu przy "Aktualizacja") nie jest i nigdy nie będzie upoważnieniem do pisania tam,
niezależnie jak wyraźna wydaje się prośba w danym momencie. Jedyny kanał stąd: ten plik.

Zakres wykonany w granicach własnego repo: sprawdzono oba pliki propozycji
(`docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`,
`biblioteka-norm-zrodlowych.md`) — pierwszy już w pełni gotowy, bez zmian. Drugi miał jedną
sam-u-siebie-flagowaną niedoskonałość (dwa oryginały PDF norm 5-52/5-54 poza swoim folderem
`norma-*/`) — naprawione lokalnie: `git mv` obu plików do właściwych podfolderów, zaktualizowane
wszystkie odwołania w ~20 plikach `.md` (`docs/zrodla/norma-PN-HD-60364-5-52/*`, `.../5-54/00-INDEKS.md`,
`docs/zrodla/README.md`), manifest w propozycji zaktualizowany, żeby nie cytować już nieaktualnego
dryfu. Oba pliki propozycji są teraz w pełni gotowe do podjęcia — nic więcej do zrobienia w tym repo,
czekają wyłącznie na sesję nad `new-app-standards`.

## Moduł 5 (Okablowanie) domknięty — 29/29, ostatnie 6 ekranów (20.09.2026)

Na wyraźne polecenie ("Ruszajmy") po ustaleniu z właścicielem repo priorytetu (Moduł 1 pominięty na
razie — wymaga infrastruktury mapowej/GPS, osobna decyzja architektoniczna, patrz niżej; Moduł 5
zrobiony w całości). Zbudowano Ekrany 5, 8, 9, 13, 18, 21 — dokładnie w ustalonej kolejności
(kalkulator → i18n → opis narzędzia AI, w jednej sesji per ekran, patrz decyzja z tej samej rozmowy
o 9.0a).

**Decyzje warte zapamiętania:**

- **Ekran 5 (Złącza MC4):** bez bazy komponentów (§15.2 jeszcze nie istnieje) porównanie producentów
  po nazwie z listy zamkniętej (`PoleSelect`, `PRODUCENCI_MC4`), nie po numerze katalogowym — jawnie
  udokumentowane ograniczenie.
- **Ekran 8 (Przepust powietrza):** źródło daje tylko dwa punkty odniesienia (szczelina <5cm→~70°C,
  ≥15cm→bezpieczna) bez ciągłej zależności dla zakresu pośredniego — **świadomie NIE
  interpolowane** (nie wymyślamy zależności, której źródło nie podaje), zakres 5–15cm oznaczony jako
  "brak danych", osobny poziom `warning` (nie `critical`, nie `info`).
- **Ekran 9 (Projekt uziemienia), bezpieczeństwo-krytyczny:** źródło opisuje silnik słownie
  ("dobiera liczbę/rozstaw prętów"), bez samego wzoru — użyto **wzoru Dwighta** dla pojedynczego
  pręta pionowego (standardowy wzór inżynierski, IEEE Std 142 "Green Book", nie norma domenowa
  wymagająca zakupu — ten sam status co Magnus-Tetens czy deklinacja Coopera 1969 gdzie indziej w
  projekcie). **Podwójna weryfikacja przed implementacją** (03.4): policzone niezależnie w Pythonie
  dla przykładu źródła (ρ=100Ω·m glina, pręt 3m×16mm) — R pojedynczego pręta ≈29,82Ω, 3 pręty
  (uproszczone łączenie równoległe 1/n) ≈9,94Ω, zgodne z przykładem źródła "3 pręty → <10Ω" z
  dokładnością <1%. Uproszczenie (brak korekty na wzajemne oddziaływanie prętów) jawnie oznaczone w
  `assumptions`, z rekomendacją realnego pomiaru po instalacji. Materiał pręta (korozja galwaniczna)
  świadomie NIE duplikowany — cross-ref do Ekranu 4 (Łączenie Cu-Al).
- **Ekran 13 (Selektywność zabezpieczeń) i Ekran 21 (Normy i certyfikaty) — świadomie zbudowane
  jako Wzorzec C/informacyjny, nie D/kalkulator.** Ten sam wzorzec decyzyjny co M6/Ekrany 5.46 i
  5.31 (już skonsolidowany do standardu jako doprecyzowanie 8.2, 20.09.2026): źródło opisuje
  koncepcję, ale nie daje wzoru (Ekran 13 — krzywe czasowo-prądowe konkretnych zabezpieczeń, wymaga
  bazy komponentów) ani zamkniętej listy norm (Ekran 21 — źródło samo mówi "IEC 61730, 62109, 62619
  **itd.**", lista jawnie otwarta). Zamiast budować kalkulator udający precyzję, której źródło nie
  daje — Ekran 13 to przewodnik, Ekran 21 to checklist tylko trzech norm nazwanych wprost + jeden
  zbiorczy wpis dla reszty, bez dopisywania własnych numerów norm dla złączy/kabli/SPD (byłoby to
  zgadywanie).
- **Rejestr narzędzi AI (`lib/ai/pytaj-asystenta.ts`, `NARZEDZIA`) rozszerzony z 1 do 6 narzędzi** —
  wszystkie 5 nowych zbudowane od razu z opisem (9.0a), Ekran 13 pominięty (brak kalkulatora, nic do
  opisania jako narzędzie AI).
- **`scripts/check-i18n-guard.mjs` (`MIGRATED_MODULES`) rozszerzony o 5 nowych modułów** (bez
  Ekranu 13/selektywności — pure content, brak i18nKey/Warning do pilnowania).

**Weryfikacja:** `pnpm typecheck`/`lint`/`test` (991 testów, w tym 26 nowych)/`build` — wszystkie
czyste. Dodatkowo `pnpm dev` + `curl` na wszystkich 6 nowych tras (HTTP 200, treść realna w HTML,
zero błędów w logu serwera) — "kompiluje się" ≠ "działa" (10-testy.md), nie tylko typecheck.

**Poza zakresem tej sesji, świadomie:** Moduł 1 (Ekrany 2-4, Skaner działki/Zacienienie/Bryła
budynku) — wymaga realnej infrastruktury mapowej (biblioteka mapowa, GPS, model 3D terenu, algorytm
zacienienia godzina-po-godzinie), nie rozszerzenia istniejącego wzorca kalkulatora. Właściciel repo
zdecydował pominąć na razie, zamiast budować uproszczoną wersję bez mapy — czeka na osobną decyzję
architektoniczną (jaka biblioteka mapowa/GPS), nie na kolejne "Ruszajmy" tej samej formy.

## Asystent AI: scentralizowane okno zamiast integracji per-ekran (20.09.2026)

**Decyzja (potwierdzona przez właściciela repo):** `<AsystentAi />` przeniesiony z osadzenia
inline tylko na `/kalkulatory/pomocnicze` do jednego, globalnego montowania w `app/layout.tsx` —
pływający panel (przycisk "AI" fixed bottom-right, otwiera kartę nad przyciskiem), dostępny na
każdym ekranie aplikacji.

**Uzasadnienie (9.9 "czat swobodny" vs "asystent inline"):** rejestr narzędzi
(`NARZEDZIA` w `lib/ai/pytaj-asystenta.ts`) rośnie z każdym nowym kalkulatorem (obecnie 6) bez
dotykania UI żadnego ekranu — dodanie AI do kolejnego kalkulatora to tylko nowy plik `*-tool.ts` +
wpis w rejestrze, nie zmiana w 116+ plikach `page.tsx`. Integracja per-ekran wymagałaby N kopii tej
samej logiki UI i sztucznie zamykałaby pytania w silosie jednego kalkulatora, mimo że pytania
inżynierskie realnie mieszają moduły (np. przekrój kabla + uziom w jednej rozmowie).

**Implementacja:** komponent (`components/asystent-ai.tsx`) przepisany z sekcji inline na widget
`fixed bottom-4 right-4 z-50` z toggle otwarty/zamknięty (`useState`), ta sama logika
`isAiAvailable()`/`pytajAsystenta()` co wcześniej (bez zmian w `lib/ai/`), wciąż renderuje `null`
w milczeniu, gdy AI nieskonfigurowane (9.0). Import/użycie usunięte z
`app/kalkulatory/pomocnicze/page.tsx`, dodane do `app/layout.tsx` wewnątrz `LanguageProvider`.

**Weryfikacja:** `pnpm typecheck`/`lint`/`test` (991/991)/`build` — czyste. Wizualnie: `next start`
z tymczasowym (nierealnym) `ANTHROPIC_API_KEY` tylko na czas testu + Playwright — przycisk widoczny
i otwiera panel zarówno na `/` (pulpit) jak i na zupełnie niepowiązanym ekranie
(`/kalkulatory/przepust-powietrza`), potwierdzając globalność. Serwer testowy zatrzymany po
weryfikacji, brak realnego klucza API w repo/env.

**Znany dług, nie tej sesji:** treść komponentu (`"Zapytaj asystenta"`, etykiety, komunikaty) wciąż
hardkodowana po polsku, bez kluczy i18n — istniało tak już przed tą zmianą (nie nowy dług, tylko
przeniesiony). Do ujęcia przy rollout'cie i18n na komponenty wspólne, nie kalkulatory.

## Anulowany job CI przy PR #132 (20.09.2026) — zbadane, przyczyna NIE jest limitem minut

**Pierwotna, błędna diagnoza (skorygowana tego samego dnia):** job CI „Lint, typecheck, test,
build" na PR #132 został anulowany w połowie `pnpm test` (lint/typecheck/i18n-guard przeszły
wcześniej). Właściciel repo pokazał zrzut GitHub Settings → Billing → Usage z paskiem „Actions
minutes: 2000/2000 used" i wywnioskowałem stąd, że to wyczerpanie darmowego limitu blokuje CI.
**To wnioskowanie było błędne** — nie zweryfikowałem wprost, zanim zapisałem to jako fakt w tym
pliku (naruszenie własnej zasady "nie przedstawiaj hipotez jako faktów"; poprawka poniżej, ślad
oryginalnego wpisu zachowany zgodnie z 15-wspolpraca-z-ai.md, nie ciche nadpisanie).

**Ustalone przez API (nie z pamięci):** `inzynier-offgrid-pro` to **repo publiczne**
(`GET /repos/.../` → `"private": false, "visibility": "public"`, zweryfikowane bezpośrednio przez
`curl` do GitHub API). GitHub Actions na standardowych hostowanych runnerach (`ubuntu-latest` —
dokładnie to, czego używa `ci.yml`) jest dla repo publicznych **darmowe i nielimitowane** —
limit 2000 min/miesiąc dotyczy wyłącznie repo prywatnych na koncie (stąd zużycie widoczne na
koncie: prawdopodobnie inne repo właściciela, np. `zero-waste`, są prywatne i to one konsumują
limit — `inzynier-offgrid-pro` nie powinno być tym ograniczone).

**Wniosek operacyjny:** CI dla tego repo NIE jest ograniczane limitem minut — nie ma powodu
zakładać z góry, że kolejne joby będą się urywać z tego powodu. Rzeczywista przyczyna anulowania
w PR #132 pozostaje niewyjaśniona (prawdopodobnie pojedynczy, nieskorelowany glitch
infrastruktury GitHuba — runner reclaimed/lost) — jeśli powtórzy się w kolejnych PR-ach, badać
od nowa, nie zakładać automatycznie tej samej (błędnej) przyczyny.

## Synchronizacja ze standardem przed sesją "3 i 5" (20.09.2026)

[20.09.2026] Właściciel projektu: "Dawaj 3 i 5 ogarniemy. Tylko zrób przed tym aktualizacje" —
wykonana pełna synchronizacja Y.6/Y.9 z `new-app-standards` przed startem (PR #134, zmergowany
jako `1ee624f`): GOD BOOK zaktualizowany do v2.20 (pełne nadpisanie NIETYKALNE), `docs/wklad-do-standardu.md`
skrócony z 1102→572 linii (12 zamkniętych wpisów przeniesionych do nowego `docs/wklad-do-standardu-archiwum.md`,
zgodnie z nową zasadą Y.8 — nie było jej wcześniej w tym pliku, dopisana tu jako decyzja
architektoniczna: wpisy w `wklad-do-standardu.md` ze statusem `✅ skonsolidowane`/`✅ przekazane`
bez otwartego follow-upu przenosimy do archiwum z pointerem w pliku żywym, żeby plik roboczy nie
rósł bez ograniczeń). 4 wpisy zostały otwarte (procedura materiałów źródłowych, biblioteka norm,
wielojęzyczność C6, CI referencyjny/i18n-guard). Zero blokerów dla pracy nad Modułem 4/Baterie
ani modułem Wampirów energetycznych.

**Pułapka napotkana przy mergu PR #134:** "405 Pull Request has merge conflicts" mimo identycznej
treści — przyczyna: gałąź zawierała stare, presquash commity już zmergowane do `main` w PR #133.
Naprawione przez `git merge origin/main` + `git checkout --ours` na jedynym realnym konflikcie
(`docs/wklad-do-standardu.md`, HEAD był nadzbiorem treści origin/main). Wzorzec do zapamiętania:
jeśli PR raportuje konflikt mimo braku merytorycznej rozbieżności, sprawdzić `git diff <stary-sha>:<plik> origin/main:<plik>` pod kątem identyczności treści przed ręcznym rozwiązywaniem.

## Ekran 3, Moduł 4 — Symulacja czasu ładowania/rozładowania (20.09.2026)

[20.09.2026] ✅ DODANO — pierwszy z 4 ekranów zleconych w ramach "Item 3" (dawne 3.3, 3.35, 3.36,
3.37). `lib/core/modules/baterie/symulacja-ladowania-rozladowania/` + UI
`app/kalkulatory/symulacja-ladowania-rozladowania/page.tsx`, 7 testów, zarejestrowany w
`lib/pulpit/registry.ts` (Moduł 4) i `docs/rejestr-pokrycia.md`.

**Decyzja projektowa (jawna, nie zmyślona dana):** źródło (`docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md`,
Ekran 3) opisuje tylko narrację ("system liczy, o której godzinie bateria osiągnie 100% i kiedy
zacznie się rozładowywać w nocy"), bez jawnego wzoru ani przykładu liczbowego do odtworzenia.
Wzór (bilans energii: moc × czas = energia, osobno dla fazy ładowania i rozładowania) wyprowadzony
wprost z tej narracji i fizyki, udokumentowany w komentarzu `calculator.ts` jako decyzja projektowa
— odróżnione od zakazu zmyślania norm/współczynników bezpieczeństwa (ten zakaz dotyczy danych, nie
kształtu wzoru wynikającego z podstawowej fizyki bilansu energii, gdy źródło nie podaje własnego).
Moc ładowania/rozładowania i długość dnia to na razie ręczne pola z `hint` o docelowym auto-fill
z Modułu 3 (produkcja PV) i Modułu 1 (wschód/zachód słońca) — te moduły jeszcze nie istnieją,
zgodnie z ustalonym wzorcem obsługi zależności międzymodułowych (patrz Ekran 1 dobor-pojemnosci).

Weryfikacja: `pnpm test` (998/998), `pnpm typecheck`, `pnpm lint` (0 błędów, 2 przedistniejące
warningi img niezwiązane), `pnpm check:i18n-guard`, `pnpm build` — wszystko czyste.

## Ekrany 31/32/33, Moduł 4 — dopełnienie "Item 3" (20.09.2026)

[20.09.2026] ✅ DODANO — pozostałe 3 z 4 ekranów zleconych "Item 3" (Ekran 3 zrobiony i
zmergowany wcześniej, patrz wpis wyżej).

**Ekran 31 "Napięcie odcięcia vs żywotność" (dawne 3.35):** `lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/`,
UI `app/kalkulatory/napiecie-odciecia-a-zywotnosc/page.tsx`, 8 testów. Model: interpolacja
liniowa między dwoma punktami danych podanymi wprost w źródle (42,0V/16S→100% DoD→2000 cykli;
44,0V/16S→80% DoD→5000 cykli), zgeneralizowana na napięcie per ogniwo, żeby działać dla
dowolnej liczby ogniw szeregowo (nie tylko 16S/48V). Poza zakresem kalibracji (2,625–2,750V/
ogniwo) — ostrzeżenie ekstrapolacji (`EKSTRAPOLACJA-POZA-KALIBRACJA`), nie błąd — model tylko
traci pewność, napięcie odcięcia poza tym zakresem jest fizycznie możliwe.

**Ekran 32 "Hierarchia ładowania (PV > Agregat > Sieć)" (dawne 3.36):** `lib/core/modules/baterie/hierarchia-ladowania/`,
UI `app/kalkulatory/hierarchia-ladowania/page.tsx`, 9 testów. Źródło opisuje logikę jako
dyskretne drzewo decyzyjne (Sekcja B), nie wzór liczbowy — zaimplementowane 1:1 jako klasyfikator
priorytetów, bez wymuszania sztucznego wzoru matematycznego (ten sam pryncyp co macierz
load-shedding, Ekran 12 Modułu 2). **Sprawdzone grep-em: w całym projekcie nie istnieje jedna
kanoniczna wartość "SoC krytyczny"** — pole `socProguKrytycznegoPct` jest więc czysto ręczne,
bez ukrytego domyślnego wypełnienia (8.6). Rozróżnione dwa stany "BRAK aktywnego źródła":
benigne (SoC w normie, po prostu nikt teraz nie ładuje) vs realnie krytyczne (SoC pod progiem,
zero opcji ładowania) — tylko drugie generuje ostrzeżenie (`OCZEKIWANIE-NA-SLONCE` gdy system
świadomie czeka na prognozę słońca, jak w przykładzie źródła Sekcji C; `BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA`
level `critical` gdy naprawdę nie ma wyjścia).

**Ekran 33 "Symulacja miesiąca zachmurzenia (No-Sun Scenario)" (dawne 3.37):** `lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/`,
UI `app/kalkulatory/symulacja-miesiaca-zachmurzenia/page.tsx`, 7 testów. Wzór (bilans energii
dzień po dniu, z wyliczeniem dnia i godziny blackoutu przy założeniu stałej średniej mocy
deficytu w ciągu doby — ten sam wzorzec uproszczenia co Ekran 3) wyprowadzony z narracji źródła,
udokumentowany jako decyzja projektowa. `liczbaDniScenariusza=10` to jedyna wartość domyślna
jawnie podana w źródle (Sekcja A) — zachowana jako sugerowana. `poziomZachmurzeniaPct` NIE ma
jednej kanonicznej wartości (źródło podaje tylko zakres 5-10%) — pole ręczne bez defaultu, z
podpowiedzią o sugerowanym zakresie (8.6).

Wszystkie 3 ekrany zarejestrowane w `lib/pulpit/registry.ts` (Moduł 4) i `docs/rejestr-pokrycia.md`.
Weryfikacja łączna: `pnpm test` (1022/1022), `pnpm typecheck`, `pnpm lint` (0 błędów, tylko 2
przedistniejące warningi img niezwiązane), `pnpm check:i18n-guard`, `pnpm build` — wszystko
czyste. **Item 3 (Moduł 4, 4 ekrany) w całości zamknięty.** Item 5 (moduł "Wampiry energetyczne",
24 dawne funkcje) czeka jako następny — celowo nierozpoczęty w tym samym przejściu, wymaga
własnego skanu zakresu przed implementacją.

## Zamknięcie Item 3 (PR #135) + skan zakresu przed Item 5 "Wampiry energetyczne" (20.09.2026)

**Weryfikacja przed mergem (na wyraźne pytanie właściciela projektu):** żadny z dwóch commitów
Item 3 (`5ccff3e` Ekran 3, `aae3715` Ekrany 31/32/33) nie dotykał `docs/wklad-do-standardu.md` —
`git show <sha> --stat -- docs/wklad-do-standardu.md` puste dla obu. `main` był 2 commity za
branchem (`origin/main` na `1ee624f`, standard-sync PR #134) — utworzono i zmergowano PR #135.

**Skan zakresu/architektury dla Item 5, wykonany PRZED jakimkolwiek kodem (na wyraźną prośbę
"zanim zaczniemy 5 moduł"):**
- Treść źródłowa: `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md`, linie 607–1167
  (24 funkcje 2.24.1–2.24.24, dawne 1.24 + 1.28–1.50), pełna, kompletna narracyjnie (Skąd/Gdzie/
  Jak/Efekt/Migawka/Powiązania dla każdej). Deklarowany podział na 5 podzakładek (linia 609):
  Katalog urządzeń, Pomiar, Symulacje/Raporty, Rekomendacje sprzętowe, Automatyzacja — **bez**
  jawnego mapowania która funkcja do której podzakładki (do zaprojektowania, nie do wymyślenia
  danych — to decyzja organizacyjna UI, nie inżynierska).
- `Zasady_UX_Doradca_v2_1.md` (§20, linie 644-681): moduł wampirów liczony jako **1 już scalony
  ekran** w wyniku Modułu 2 (18 ekranów łącznie z indywidualnymi) — nie rozbija dalej na
  osobne wzorce A-H, potwierdza podejście "jeden moduł zbiorczy z podzakładkami", nie 24 ekrany.
- **Zerowe pokrycie w kodzie** — `grep -rli "standby\|wampir" lib/core/modules/` → brak wyników.
  Żaden istniejący ekran (w tym `pobor-wlasny-falownika` 1.12, `dni-autonomii` 1.9, `load-shedding`
  1.20 — wszystkie wymienione w "Powiązania" źródła jako cross-referencje) nie duplikuje logiki
  standby/wampirów — to relacje "zasila"/"odwołuje się do", nie pokrycie. Brak ryzyka duplikacji.
- **Korekta notatki w `docs/rejestr-pokrycia.md`** (wiersz "Wampiry energetyczne"): poprzednia
  wersja mówiła "treść w Biblii poza tym repo" — nieaktualne, treść JEST w tym repo (patrz wyżej).
  Dryf notatki bez świadomej decyzji (nie konflikt merytoryczny) — poprawione wprost, zgodnie z
  wyjątkiem Części Y.2 GOD BOOK.
- **Cross-referencje do modułów jeszcze niezbudowanych** (informacyjnie, nie blokujące): wiele
  funkcji odwołuje się do Modułu 7 (stress-test, w większości `todo`), Modułu 8 (bezpieczeństwo,
  częściowo zbudowany), Modułu 3 (`3.1`, zbudowany jako reprezentant wzorca). Zgodnie z ustalonym
  wzorcem (Ekrany 31-33 Modułu 4) — pola takich zależności zostają polami ręcznego wpisu, nie
  blokują implementacji.
- **Wniosek:** moduł gotowy do zaprojektowania i implementacji jako osobna sesja projektowa —
  brak blokerów danych/norm (to głównie katalogi urządzeń z zakresami W podanymi w źródle, nie
  jedną kanoniczną wartością — wzorzec identyczny do już zbudowanych katalogów, np.
  `systemy-podtrzymania-zycia`), brak ryzyka duplikacji z istniejącym kodem.

## Zamknięcie Item 5 — moduł zbiorczy "Wampiry energetyczne" (20.09.2026)

Zbudowany w całości w jednej sesji (decyzja właściciela projektu: "Całość w jednej sesji", po
skanie zakresu udokumentowanym wyżej). 24 dawne funkcje (1.24, 1.28–1.50) scalone w **5 realnych
kalkulatorów** `lib/core/modules/zapotrzebowanie/wampiry-energetyczne/`, po jednym na podzakładkę
zadeklarowaną w źródle — nie 24 osobne ekrany, zgodnie z ustaloną praktyką konsolidacji
duplikatów (patrz Ekran 32 "Hierarchia ładowania" i Ekrany 31-33 Modułu 4):

- **`katalog-urzadzen`** (1.24 suma + katalog 1.29/1.41/1.48): 7 urządzeń standby, moc domyślna =
  środek zakresu źródła (dopowiedziany, udokumentowany jako nieliteralny), edytowalna. Wzór
  `E_doba/E_rok` zweryfikowany dokładnie (45W→1,08 kWh/dobę→394 kWh/rok, przykład 1.24).
- **`pomiar-mocy-jalowej`** (1.30+1.38): ręczna lista pomiarów, bez domyślnych mocy (z definicji
  specyficzne dla sprzętu użytkownika). Ten sam wzór — echo `GODZIN_W_DOBIE`/`DNI_W_ROKU` z
  `katalog-urzadzen/constants.ts`, nie duplikat stałych. Zweryfikowany: 8W→70 kWh/rok (1.38).
- **`symulacje-i-raporty`** (rdzeń modułu): trzy niezależne funkcje — autonomia baterii przy
  standby (1.28+1.31+1.42, zweryfikowana 45W→26h/15W→78h), roczny koszt standby (1.43,
  zweryfikowana 50W→438 kWh/rok/15% udziału przy 2920 kWh), wpływ eliminacji standby na dobór
  pojemności (1.45 — **świadomie NIE odtwarza** własnego przykładu liczbowego źródła, bo źródło
  pomija napięcie/dni autonomii/sprawność/DoD potrzebne do przeliczenia na Ah; echo formuły
  `obliczPojemnoscUzytecznaKwh` z `baterie/dobor-pojemnosci`, zwraca kWh zamiast Ah dla spójności
  jednostek). Cena energii i koszt sprzętu **zawsze wpisywane ręcznie, zero wartości domyślnych**
  — źródło daje je tylko jako ilustrację przykładu, nie normę cenową.
- **`rekomendacje-sprzetowe`** (1.32+1.39+1.44 porównanie metod, 1.33+1.46 dobór per kategoria):
  okres zwrotu kosztu zweryfikowany dokładnie (40zł/120zł→4 mies., 150zł/200zł→9 mies., 1.39).
  Drzewo decyzyjne 1.33 (ten sam wzorzec co Ekran 32 M4) ma **własny zestaw etykiet metod**,
  tylko częściowo pokrywający się z 4 metodami porównywanymi w 1.44 ("gniazdo z timerem" i
  "obwód w rozdzielni ze stycznikiem" to inne kategorie) — **błąd złapany i naprawiony przed
  testami**: pierwsza wersja błędnie zmapowała "ładowarki" na "gniazdo Wi-Fi" (kopiując 4 metody
  1.44) i dodała niewspieraną przez źródło warunkowość dla routera; poprawione na osobny typ
  `EtykietaRekomendacji`, klasyfikator 1:1 ze źródłem (ładowarki→gniazdo z timerem, router→
  gniazdo Wi-Fi bezwarunkowo).
- **`automatyzacja`** (1.34+1.40+1.48-scenariusze): jeden generyczny silnik "standby referencyjny
  vs standby w scenariuszu" zamiast 4 kopii tego samego liczenia dla różnych nazw scenariuszy
  (nocny tryb/nieobecność/praca z domu/weekend/urlop). Zweryfikowany: 45W→15W→0,72 kWh/dobę
  (1.34). 1.47 (redukcja poboru falownika nocą) to czyste echo/link do już istniejącego ekranu
  `pobor-wlasny-falownika` — bez własnej logiki. 1.35+1.36+1.49 (detekcja always-on, integracja
  smart-plug API, harmonogram wg obecności) to treść informacyjna w UI, bez kalkulatora — wymagają
  realnej integracji sprzętowej, poza zakresem offline-first. 1.50 (audyt zbiorczy) to widok
  podsumowujący nad wynikami innych podzakładek, bez własnej logiki.

**Odrzucone podczas projektowania (dyscyplina "nie wymyślaj progu"):** draft funkcji
`drenazSzybki(godziny)` w `symulacje-i-raporty/warnings.ts` z niejawnym progiem "szybkiego
rozładowania" — usunięty przed użyciem, źródło nie podaje żadnej liczby granicznej.

**UI:** `app/kalkulatory/wampiry-energetyczne/page.tsx` — 5 podzakładek jako `PoleSelect` +
renderowanie warunkowe (ten sam wzorzec co `kategorie-specjalne`, w kodzie nie istnieje
komponent Tabs), jeden `usePersistedDraft` na cały ekran (nie 5 osobnych kluczy) z jedną
zagnieżdżoną strukturą stanu — suma standby wyliczona w Katalogu+Pomiarze dostępna do wpisania
jednym kliknięciem ("Wpisz sumę…") w polach Symulacji i Automatyzacji, bez ręcznego przepisywania.
Komponenty podzakładek w `_components/` (Next.js private folder, bez nowych route'ów).

**i18n:** wszystkie 15 nowych kodów `WAMPIR-*` (błędy walidacji + 2 założenia/info) dodane
identycznie do `lib/i18n/dictionary-{pl,en,ru}.ts` — moduł od razu zmigrowany (17.9), zero
gotowego tekstu PL w `Warning.message`.

**Weryfikacja:** 38 nowych testów (5 plików) + pełny `pnpm test` (1060/1060), `pnpm typecheck`,
`pnpm lint` (0 nowych błędów/ostrzeżeń), `pnpm check:i18n-guard`, `pnpm build` — wszystko czyste.
Ręczny smoke test Playwright (kliknięcie checkboxów katalogu, przełączanie 5 podzakładek,
weryfikacja klasyfikatora rekomendacji) — bez błędów konsoli poza nieistotnym 404 Vercel Insights
(brak w środowisku lokalnym, niezwiązane z tym modułem). Rejestracja: `lib/pulpit/registry.ts`
(Moduł 2, na końcu listy ekranów) + `docs/rejestr-pokrycia.md` wiersz 18 (Moduł 2) → **done**.

## D21 — cykl Y.6 obniżony lokalnie do ≤12h (23.09.2026)

Na wyraźne polecenie właściciela projektu: `CLAUDE.md` (sekcja "Zanim zaczniesz", punkt 4) zmieniony
z "sprawdzaj `AKTUALIZACJE.md` co ≤3 godziny" na "co ≤12 godzin". Pełny zapis decyzji:
`rejestr-decyzji.md` D21. **Kluczowe rozróżnienie, żeby nie pomylić z aktualizacją Y.6 vs. lokalną
decyzją:** to NIE jest zmiana samego standardu GOD BOOK Y.6 (wciąż ≤3h dla całej rodziny projektów) —
`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md` i `PROMPT_STARTOWY.md` (NIETYKALNE,
mirror `new-app-standards`) celowo NIE zostały zmienione i nadal poprawnie mówią ≤3h. Zmieniony
został wyłącznie ten jeden cytat w `CLAUDE.md` (ADAPTOWALNE) — świadome, udokumentowane lokalne
odstępstwo tego projektu od domyślnej polityki standardu, nie błąd/dryf.

Powód praktyczny (zaobserwowany 20.09.2026, ta sama sesja co pierwsza wersja tego wpisu): dwa
kolejne cykliczne sprawdzenia Y.6 w odstępie ~2 minut oba nie znalazły niczego nowego w
`AKTUALIZACJE.md` — przy tempie zmian tego pliku (rzędu godzin/dni, nie minut) cykl 3h generuje dużo
zerowych sprawdzeń. Dopisano też odpowiadający wpis do `docs/wklad-do-standardu.md` (POMYSŁ NA
REGUŁĘ — cykl Y.6/U.4 mógłby być konfigurowalny per projekt zamiast sztywnego ≤3h) — to zgłoszenie
kanałem zwrotnym, nie samodzielna zmiana standardu; decyzję podejmie wyłącznie sesja nad
`new-app-standards`.

**Dla przyszłych sesji tego projektu:** przy Kroku "Zanim zaczniesz" i przy Routine Y.6 stosuj ≤12h
z `CLAUDE.md`, nie ≤3h z GOD BOOK — ten drugi zapis wciąż tam jest (poprawnie, jako mirror), ale nie
obowiązuje operacyjnie w tym repo od D21.

## Konfiguracja Y.6 adaptacyjnego + sprawdzenie 24.09.2026 — GOD BOOK v2.21→v2.37 (16 wersji, NIE zastosowane, propozycja czeka na decyzję właściciela)

[24.09.2026] Pierwsze uruchomienie mechanizmu Y.6 opisanego jako "cykl adaptacyjny 12h→48h"
(zadanie właściciela projektu). `interwał_h = 12` (start), `licznik_zero_z_rzedu = 0`.

**Krok 1 (fetch+porównanie):** lokalny klon `new-app-standards` był 273 commity za `origin/main`
(ostatni fetch dawno, przed D21) — doprowadzony do zgodności (`git merge --ff-only`). GOD BOOK
źródła: `instrukcja-uniwersalna-biblii-projektu-v2_37.md` (rename z `...v2_21.md`, które miał ten
projekt jako ostatnio zsynchronizowane — patrz wpis PR #136 wyżej). Różnica: **16 kolejnych wersji
GOD BOOK (v2.22–v2.37)**, dziesiątki wierszy `AKTUALIZACJE.md` z datami 20–24.09.2026.

**Wynik: DUŻO nowej treści — to NIE jest "zero nowości".** Zgodnie z nową procedurą tego zadania
(Krok 2: "NIE podmieniaj plików samodzielnie, zaproponuj i zakończ turę pytaniem") — **nic z
poniższego NIE zostało jeszcze zastosowane do plików `docs/standards/`/GOD BOOK tego projektu.**
Pełna treść źródłowa: `AKTUALIZACJE.md` w `new-app-standards`, wiersze z datami 2026-09-20 do
2026-09-24 (ostatnie ~25 wierszy loga). Skrót wg kategorii Y.8, do decyzji właściciela:

**NIETYKALNE (pełny nadpis, czeka na zgodę):**
- GOD BOOK: rename `v2_21.md`→`v2_37.md`. Nowe/zmienione części: C.5 (bezpieczny zakres
  find&replace przy renamie pliku wersjonowanego — już zaaplikowane u nas ręcznie 20.09, zgodne),
  Y.11 (nowy, opcjonalny audyt zgodności KODU ze standardem — osobny od Y.6, na żądanie/koniec
  Fazy), Y.12 (kolizja reguły "na stałe dla rodziny" ze starszą decyzją stacku — test Spike),
  Y.6/U.4 (**cykl adaptacyjny 12h→48h — dokładnie to, co ten projekt wdraża dziś, patrz D22**;
  formuła jest teraz identyczna z domyślną GOD BOOK, D21/D22 zamknięte jako w pełni zgodne, zero
  akcji), Część D punkt 7 (weryfikacja merytoryczna materiału źródłowego przy przenoszeniu do
  Biblii, adnotacja ✏️, źródło samo nietknięte), 15.1a/15.1b (nie bać się zgłosić rozjazdu z
  rzeczywistością — przez całą pracę, nie tylko liczby), Część H.3 (kolizja numeracji M#/D# przy
  równoległych sesjach — sprawdź najwyższy numer na `origin/main` przed nadaniem nowego), U.3
  (inwentaryzacja downstream przed akceptacją reguły "na stałe").
- `docs/standards/`: **02** (2.1 — `validFrom`/`validTo`/`legalBasis`/`verifiedBy`/`confidence`
  jako pola strukturalne dla wartości regulowanych prawem — **potencjalnie dotyczy naszych danych
  norm/współczynników bezpieczeństwa**, do sprawdzenia przy Y.11), **03** (3.3 — `INCOMPLETE` jako
  osobny trzeci stan dla modułów obowiązku/ryzyka/zgodności, nigdy dwuwartościowa logika + flaga —
  **do sprawdzenia, czy dotyczy któregoś modułu bezpieczeństwa/doboru u nas**), **05** (5.8–5.11 —
  wzorzec własnego Service Workera bez wtyczki bundlera, aktualizacja przez toast nie cichy
  `skipWaiting`, `navigator.storage.persist()`, kolizja wersji IndexedDB między kartami —
  **projekt nie ma jeszcze PWA/SW w kodzie, więc na razie informacyjne**), **07** (CSP hash-based
  nie `'unsafe-inline'`, `worker-src 'self' blob:`, checklist `Permissions-Policy` przed nową
  funkcją API przeglądarki, `'wasm-unsafe-eval'` nie `'unsafe-eval'`), **08** (8.11 — wzorzec
  wskaźnika offline), **10** (10.8 — E2E offline dla własnego SW), **11** (11.7 — plik zależny od
  `node_modules` kopiowany skryptem `predev`/`prebuild`, nigdy commitowany — **potencjalnie
  dotyczy nas, jeśli mamy podobny wzorzec z jakąś biblioteką**; 11.8 — ryzyko migracji majora:
  wtyczka sprzężona z bundlerem, klasyfikacja zmian wg oficjalnego przewodnika nie z pamięci),
  **13** (przepisany niemal od zera — Capacitor jako technologia mobile/desktop rodziny NA STAŁE,
  nie generyczne "natywne/React Native"; tabela platform macOS=Mac App Store przez Capacitor
  Electron Platform, iPad+Universal Purchase, Linux=PWA, Android poza Google Play; nowe 13.4–13.6
  — **nie dotyczy nas dziś, projekt nie jest na etapie mobile**), **15** (15.1a/15.1b jak wyżej,
  15.21 — deklaracja stanu commit/push/PR/merge zawsze jako OSTATNIE zdanie odpowiedzi, 15.22 —
  `docs/lista-do-zrobienia.md` każdy otwarty wpis niesie priorytet/odblokowuje/plusy-minusy/
  kolizje/kolejność), **17** (17.6 — encje HTML w słowniku i18n muszą być znakami Unicode nie
  encjami; 17.7b/17.7c — selektor języka pokazuje tylko kompletne języki, wyjątek faza
  przedpremierowa bez realnych użytkowników — **dziś dotyczy nas, jesteśmy przedpremierowo**;
  17.9 — generator treści współdzielony między ekranami to jedno zadanie migracji i18n, nie per
  moduł; 17.11 — znane ograniczenie strażnika AST na template-literały w JSX), **18** (18.1
  retroaktywnie obowiązkowe w każdym projekcie, nie tylko nowych).
- Nowy katalog `docs/przyklady/pwa/` (10 plików + README, gotowy wzorzec SW) — do skopiowania
  tylko jeśli/gdy projekt faktycznie zacznie budować PWA/Service Worker (dziś nie ma).
- `PROMPT_STARTOWY.md`, `README.md`, `CLAUDE.template.md`, `.claude/skills/standards/SKILL.md`,
  `docs/standards/00-INDEKS.md`, `00-filozofia.md`, `docs/lista-do-zrobienia.template.md`,
  `docs/memory.template.md`, `docs/przyklady/i18n/*` — wskaźnik wersji GOD BOOK + drobne patche.

**ADAPTOWALNE (patch, czeka na zgodę):** `CLAUDE.md` (wskaźnik wersji GOD BOOK 14→v2_37 gdy owner
zaakceptuje pełny sync; punkt 15.21/15.22 jeśli properyjmiemy — dopisać do "Definicja ukończenia
zadania"/`docs/lista-do-zrobienia.md`), `.claude/skills/standards/SKILL.md` (wskaźnik wersji).

**LOKALNE — znaleziona rozbieżność, NIE naprawiona samodzielnie (zgłoszona właścicielowi, nie
rozstrzygnięta na własną rękę zgodnie z zasadą sprzeczności 15.4):** `AKTUALIZACJE.md` (wiersz
2026-09-24, plik 11-ci-deployment.md/07-bezpieczenstwo.md) przypisuje temu projektowi
("inzynier-offgrid-pro") zgłoszenie DOBRA PRAKTYKA o Web Workerze biblioteki MapLibre GL i pułapce
`Permissions-Policy: geolocation=()` z prośbą "oznaczcie ten wpis jako przekazany w
`docs/wklad-do-standardu.md`". **Nie znaleziono w tym repo:** brak "MapLibre" w historii gita
(`git log --all --grep`), brak wzmianki w `docs/wklad-do-standardu.md` tego repo, brak kodu
Service Workera/PWA w `app`/`lib`. Możliwe wyjaśnienia (nierozstrzygnięte): (a) zgłoszenie
pochodzi z innej, równoległej sesji nad tym samym repo na niezmergowanej gałęzi, (b) błędne
przypisanie źródła po stronie `new-app-standards`. Nic nie oznaczono jako ✅ w
`docs/wklad-do-standardu.md` — nie ma czego oznaczać bez odnalezienia oryginalnego wpisu.

**Co ZASTOSOWANO dziś, bez czekania na zgodę (nie jest to zmiana treści standardu, tylko przyjęcie
mechanizmu cyklu, który i tak już obowiązuje jako nowy domyślny GOD BOOK Y.6/U.4 — patrz D24
`rejestr-decyzji.md`, przenumerowane z pierwotnego D22 przez kolizję ID z równoległą sesją, patrz
niżej i H.3 GOD BOOK):** `CLAUDE.md` punkt 4 zaktualizowany na formułę adaptacyjną (start 12h,
×1,5 do pułapu 48h po zero-wyniku, reset do 12h po realnej zmianie). **Dzisiejsze sprawdzenie
znalazło realną zmianę → `interwał_h` resetuje się do 12 (nie rośnie), `licznik_zero_z_rzedu = 0`.**
Założona samo-przeplanowująca się Routine (self-bind, `trig_01La5dGeB9ycdVpPf2dmYgrk`),
`run_once_at` = 2026-09-25T10:20:00Z (+12h od tego sprawdzenia) — pierwsze uruchomienie po
zakończeniu prac naprawiających kolizję D# (merge z Modułem 1), stąd 8 minut różnicy względem
zapowiedzianego wcześniej 10:12.

**Kolizja numeracji D# przy scalaniu (przypadek H.3, GOD BOOK v2.37):** ten wpis pierwotnie
zapisywał decyzję jako "D22", ale przy scaleniu z `main` okazało się, że równoległa sesja (patrz
niżej, "Moduł 1... 23.09.2026") już zajęła D22/D23 dla architektury MapLibre GL/ULDK i to jej PR
scalił się pierwszy — zgodnie z regułą H.3(c) ("pierwszy scalony zachowuje numer") ta decyzja
przenumerowana na **D24** w `rejestr-decyzji.md` i w tej sekcji. Osobno: `AKTUALIZACJE.md` w
`new-app-standards` (wiersz 2026-09-24, `11-ci-deployment.md`/`07-bezpieczenstwo.md`) przypisuje
temu projektowi zgłoszenie DOBRA PRAKTYKA o Web Workerze MapLibre GL i pułapce
`Permissions-Policy: geolocation=()` — **prawdopodobnie właśnie z tej równoległej sesji Modułu 1**
(MapLibre GL jest dokładnie tą samą biblioteką), co tłumaczyłoby wcześniej niezrozumiałą
rozbieżność; nieodnalezione w `docs/wklad-do-standardu.md` tego repo — możliwe, że zgłoszone z
gałęzi tamtej sesji przed scaleniem, do zweryfikowania z właścicielem, nie rozstrzygnięte tutaj
samodzielnie.

## Moduł 1 (Lokalizacja), Ekrany 2–4 — jądro obliczeniowe (23.09.2026)

Na polecenie właściciela projektu ("zgoda na punkt 1" — Moduł 1 jako następny krok). Wcześniej
(20.09.2026) Moduł 1 świadomie pominięty do czasu decyzji architektonicznej — teraz podjęta:
**D22** w `rejestr-decyzji.md` (MapLibre GL + three.js/R3F + ULDK/PVGIS przez własny Route Handler,
najpierw jądro, potem UI). Wybory właściciela z 4 pytań z opcjami przedstawionymi przez AI.

**Zbudowane (tylko `lib/core`, zero UI, zero nowych zależności npm):**
- `lokalizacja/geometria-slonca/` — wspólny prymityw: pozycja słońca (NOAA Solar Calculator =
  Meeus rozdz. 22/25/28, z refrakcją), cos kąta padania (Duffie–Beckman 1.6.3), masa powietrza
  (Kasten–Young 1989), promieniowanie bezpośrednie clear-sky (Meinel 1976, tylko jako waga
  względna). Testy na przykładach liczbowych Meeusa 25.a (deklinacja −7,78507°) i 28.b (równanie
  czasu 13 min 42,7 s) + kontrole analityczne (przesilenia, równonoc, półkula południowa).
- `lokalizacja/skaner-dzialki/` (E2) — wspólne jądro obu trybów źródła (spacer GPS / Geoportal):
  GPS→płaszczyzna styczna WGS84 (promienie M, N; test: długość stopnia na równiku 110 574 /
  111 320 m), kalibracja znanym wymiarem (tylko poziomo — jawne założenie), azymuty ścian
  (normalna zewnętrzna niezależnie od kierunku obchodzenia), połacie metodą Newella (nachylenie,
  azymut, pole rzeczywiste, odchylenie od płaszczyzny), wysokość kalenicy, przeszkody → układ
  lokalny jako wejście E3.
- `lokalizacja/analiza-zacienienia/` (E3) — przeszkody: drzewo (walec korony) / bryła
  (graniastosłup), kąt = atan((H−z)/d) do najbliższej krawędzi (przecięcie analityczne), próbkowanie
  słońca co 10 min przez cały rok, strata ważona Meinel·cos θ, podział na miesiące i przeszkody,
  scenariusz prognozy z ręcznie podaną wysokością drzew (źródło: "wprowadzana ręcznie" — aplikacja
  nie wymyśla krzywej wzrostu), profil horyzontu 360° do wykresu.
- `lokalizacja/orientacja-powierzchni/` (E4) — model izotropowy Liu–Jordana na godzinowych danych
  PVGIS TMY, optimum wyszukiwane w danych (siatka 5°, potem 1°), wskaźnik = H/H_opt; albedo 0,2
  domyślne i zawsze raportowane.

**Decyzje warte zapamiętania:**
- Liczby przykładowe ze źródła ("94%", "62%", "12%", "południe ~35°") NIE są celem testów ani
  wartościami stałymi — to ilustracje. Testy sprawdzają tożsamości modelu (np. β=0 → H = ΣGHI) i
  wartości z publikacji, nie odtwarzanie przykładów.
- Uczciwy zakres E3: strata promieniowania **bezpośredniego clear-sky**, nie całkowitej energii —
  TD14. E4: konwencja czasu rekordów PVGIS niezweryfikowana — TD15 (sprawdzić przy budowie proxy,
  zanim ktokolwiek użyje realnych danych).
- Wydajność: E4 liczy ~1 s (przeszukiwanie ~1500 orientacji × 8760 h), E3 ~0,15 s — w UI oba
  do Web Workera, żeby nie blokować wątku głównego.
- Po pull 84 commitów `node_modules` było nieaktualne (brak `@anthropic-ai/sdk`, `@supabase/ssr`) —
  `tsc` zgłaszał błędy w nietkniętym kodzie. Naprawione `CI=true pnpm install --frozen-lockfile`
  (bez `CI=true` pnpm przerywa bez TTY: `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`). Lockfile
  bez zmian.

**Zweryfikowane:** 55 nowych testów (14+15+16+10), cały zestaw 1115/1115, `tsc --noEmit` czysty,
lint 0 błędów (2 stare ostrzeżenia `<img>` bez związku), `check:i18n-guard` OK (103 moduły,
4 nowe dopisane), `audit:gate` OK, `pnpm build` OK. i18n PL/EN/RU — 23 nowe klucze.

**Następny krok (UI, D22):** proxy PVGIS/ULDK (Route Handler, CSP `connect-src` tylko do własnego
origin), ekran Skanera z MapLibre GL + spacer GPS, widok 3D (R3F) z mapą cieplną zacienienia,
lista powierzchni E4, i18n + opisy narzędzi AI dla nowych kalkulatorów (kolejność z 20.09:
kalkulator → i18n → opis AI w tej samej sesji — dla tych 3 ekranów opisy AI czekają na UI).

## Proxy PVGIS TMY (23.09.2026) — D22, dane dla Ekranu 4 Modułu 1

Na polecenie właściciela ("potem proxy PVGIS"), zaraz po merge'u jądra Modułu 1 (PR #141).
- `lib/adapters/pvgis/tmy.ts` — czysty parser (zod, kształt sprawdzany na pełnym roku 8760 h,
  promieniowanie ≥ 0) + `pobierzTmy` (stały adres `re.jrc.ec.europa.eu/api/v5_3/tmy`, timeout 30 s,
  kody błędów `PVGIS-*`, nigdy dane zastępcze — 06-api-i-siec.md 6.1). 13 testów.
- `app/api/pvgis/tmy/route.ts` — GET `?lat&lon`, 400/422/502/504 z kodem powodu, sukces z
  `Cache-Control: private, max-age=86400`. CSP `connect-src 'self'` nietknięte (przeglądarka
  woła tylko własny origin).
- **Offset czasu PVGIS (TD15 punkt 1 — rozwiązany):** znacznik HH:00 jest umowny, wartości
  odpowiadają HH:00 + `inputs.location.irradiance_time_offset` (JRC, strona narzędzia TMY;
  SARAH — zależnie od szerokości, Warszawa 0,1832 h; ERA5 — 0,5 h). Adapter dodaje offset.
- **Pułapka zod 4:** `z.coerce.number()` zamienia `null` (brak parametru URL) na 0 — przepuściłoby
  zapytanie bez `lat` jako 0°. Rozwiązanie: `z.string().trim().min(1).pipe(z.coerce.number<string>()...)`
  (jawny typ wejścia `<string>` wymagany przez typy zod 4 w `pipe`). Ten błąd typów przeszedł przez
  `pnpm build`, bo `next.config.mjs` ma `typescript.ignoreBuildErrors: true` — **build nie
  zastępuje `pnpm typecheck`**, zawsze uruchamiaj oba.
- **Weryfikacja na realnych danych (Warszawa, TMY 2005–2023, SARAH3):** GHI 1054 kWh/m²·rok;
  silnik E4: optimum 176°/33°, 1182 kWh/m²; PVGIS PVcalc (`optimalangles=1`) dla tego samego punktu:
  177°/**39°**, **1314 kWh/m²**. Azymut zgodny, nachylenie i wartość bezwzględna nie — nowy **TD16**
  (model izotropowy; hipotezy przyczyny niezweryfikowane) — decyzja o modelu anizotropowym należy do
  właściciela przed UI E4. Route sprawdzony na żywo przez `pnpm dev`: Warszawa 200 (8760 rekordów,
  482 kB), morze 422 ("Location over the sea"), brak/błędny `lat` 400.

**CI — zawężenie nierozstrzygniętej sprawy z 20.09.2026 (sekcja "Synchronizacja ze standardem"):**
zweryfikowane wprost przez API 23.09.2026 ~23:55 CEST: repo `public`, `actions/permissions`
`enabled: true, allowed_actions: all`, workflow `CI` (`.github/workflows/ci.yml`) `active` — a
`GET /actions/runs` zwraca **`total_count: 0` dla całego repo** (nie tylko dla PR #141, który
zmienia `lib/**` i powinien wyzwolić CI mimo `paths-ignore`). Czyli: nie konfiguracja repo ani
workflow, tylko coś na poziomie konta (blokada/limit konta GitHub). PR #141 zmergowany na wyraźne
polecenie właściciela z pełnym pakietem lokalnym zamiast CI (ten sam tryb co PR #136). Przy
okazji: tokenowi `gh` kończy się limit REST (60/h) i GraphQL przy intensywnej pracy — przy
limicie GraphQL `gh pr create` nie działa, `gh api` (REST) tak.

**[24.09.2026] ROZSTRZYGNIĘTE przez właściciela projektu — CI nie działa do końca września 2026,
bo wyczerpały się limity GitHub na koncie** ("CI nie robimy do końca miesiąca, bo nam limity na
git się skończyły — żeby nie próbować znowu i nie tracić czasu"). Zamyka sprzeczność z 20.09.2026
(wersja A "limit Actions do 1.10" vs wersja B "repo publiczne = bez limitu") na korzyść A, zgodnie
z pomiarem z 23.09 (0 uruchomień w całym repo przy włączonych Actions). **Do 30.09.2026 włącznie:**
nie sprawdzać check-runów/workflow runs, nie diagnozować braku CI — merge na pełnym pakiecie
lokalnym (typecheck, lint, check:i18n-guard, test, build, audit:gate). Nota operacyjna także w
`CLAUDE.md` (sekcja "Stan repo") — usunąć ją od 1.10.2026, gdy CI wróci.

**[01.10.2026] CI wróciło (koniec okresu z wpisu wyżej).** Nota „CI NIE DZIAŁA” usunięta z `CLAUDE.md` na polecenie
właściciela projektu. Od teraz merge na zielonym CI, jak przed 24.09. Pierwszy przebieg na `main` trzeba sprawdzić
ręcznie: krok `check:ai-tools-guard` i job `e2e-sw` jeszcze nigdy nie ruszyły w GitHub Actions (`docs/lista-do-zrobienia.md`,
wpis „Powrót CI od 1.10.2026”). Pułapka z tego dnia: przy wyczerpanym limicie GraphQL `gh pr create` nie działa, a
`gh api` (REST) działa.
Druga pułapka (30.09–01.10.2026): przy obciążonej maszynie (inne sesje budują równolegle) `pnpm test` potrafi
zakończyć się kodem ≠ 0 mimo „wszystkie testy passed” — `[vitest-pool]: Timeout terminating forks worker`, za każdym
razem przy innym pliku. To nie błąd testu: ponowne `pnpm test` samo przechodzi z kodem 0. Przed merge zawsze patrzeć na
liczbę testów i treść błędu, nie tylko na kod wyjścia.

## TD16 naprawiony — model Muneera w Ekranie 4 Modułu 1 (24.09.2026)

Decyzja właściciela: wariant (a). Źródło równań: raport JRC EUR 26075 EN (Gracia Amillo, Huld,
2013) — pobrany PDF, równ. 28–31 (zacieniona/zachmurzone: N = 0,25227; nasłoneczniona:
N = 0,00263 − 0,712·Kb − 0,6883·Kb²; korekta h < 0,1 rad; zachmurzenie kt' < 0,3 wg Pereza/Ineichena),
Gsc = 1367 W/m² z tego raportu, mimośród z Duffie–Beckman 1.4.1a. Ten sam raport potwierdza, że
PVGIS stosuje Muneera i że modele izotropowe dają niższe wartości — hipoteza z TD16 potwierdzona.
Wynik na realnych danych (Warszawa): optimum 177°/38° vs PVGIS 177°/39°; wskaźniki powierzchni
±2 p.p. względem PVGIS. Stała różnica −6% wartości bezwzględnej także dla płaszczyzny poziomej →
dane (TMY vs seria 2005–2023), nie model.

**Pułapka testowa:** syntetyczne dane godzinowe próbkowane w HH:00 przy długości 0° dają sztuczną
asymetrię rano/popołudnie (optimum ~184°), którą człon okołosłoneczny Muneera wzmacnia — izotropowy
ją maskował. Naprawione próbkowaniem HH:30, nie poluzowaniem tolerancji; realne dane dają 177°
zgodnie z PVGIS. Wydajność: E4 z Muneerem ~2,5 s na wywołanie (optimum) — w UI koniecznie Web Worker.

## ULDK bezpośrednio z przeglądarki — D23 (24.09.2026)

Przed budową właściciel zapytał o koszt proxy. Ustalone i przedstawione na faktach (sprawdzone na
żywo): PVGIS nie ma CORS i dokumentacja JRC zakazuje wywołań z przeglądarki ("access to PVGIS APIs
via AJAX is not allowed"), limit 30 zapytań/s na IP — proxy konieczne; koszt proxy zmierzony:
~60 ms CPU i ~64 KB (gzip) na pobranie → darmowy plan Vercel Hobby (4 h Active CPU, 100 GB) starcza
na ~200 tys. pobrań/mies. (Hobby tylko niekomercyjnie — przy sprzedaży aplikacji Pro $20/mies.
niezależnie od proxy). ULDK ma `Access-Control-Allow-Origin: *` → właściciel wybrał wariant bez
proxy (**D23**).
- `lib/adapters/uldk/uldk.ts` — `dzialkaWPunkcie` (GetParcelByXY) i `dzialkaPoIdentyfikatorze`
  (GetParcelById), timeout 15 s, kody `ULDK-*`, czysty parser text/plain. Format sprawdzony na
  żywo: "0" + linia pól "|" w kolejności `result`; "-1 brak wyników" przy HTTP 200 (nie traktować
  statusu HTTP jako sygnału sukcesu); WKT "lon lat". MULTIPOLYGON i wiele wyników odrzucane jawnie
  (nie ucinamy/nie wybieramy po cichu); otwory → obrys zewnętrzny + `maOtwory`.
- Fixture: realna odpowiedź dla działki 146510_8.0309.23/3 (publiczne dane katastralne). Test
  spina ścieżkę online z jądrem: obrys ULDK → `calculateSkanerDzialki` → VALID.
- CSP: `connect-src 'self' https://uldk.gugik.gov.pl` — zweryfikowane w przeglądarce (dev):
  ULDK 200, bezpośredni PVGIS i example.org zablokowane z komunikatem naruszenia CSP.
- `GetParcelByIdOrNr` z nazwą obrębu ("Mokotów 1") zwracał pusto — wyszukiwanie po nazwie
  obrębu+numerze nie zbudowane; UI oferuje TERYT albo punkt na mapie/GPS.

## Moduł 1 — UI Ekranów 2–4 (24.09.2026) — D22

Na polecenie właściciela ("UI interfejs ekranów 2–4 (mapa, widok 3D, lista powierzchni)").
Nowe zależności (D22): `maplibre-gl` 6.11, `three` 0.186, `@react-three/fiber` 9.8, `@types/three`.

**Architektura danych między ekranami:** model działki = Seed Ekranu 2 (`usePersistedDraft`, klucz
`skaner-dzialki`); Ekrany 3 i 4 czytają go przez nowy `useOdczytDraftu` (tylko odczyt — jeden
właściciel zapisu) i mają własne drafty (E3: prognoza wzrostu drzew, dach płaski; E4: korekty,
powierzchnie ręczne, albedo). Przeliczenia Seed → wejścia kalkulatorów: `lib/lokalizacja/model-dzialki.ts`
(czyste funkcje, testy). Wyniki nigdy nie są zapisywane (05, 5.1) — tylko Seed i dane PVGIS TMY
(`offgrid.pvgis-tmy.v1`, dane wejściowe, nie wynik).

**Pułapki znalezione i naprawione:**
- `next.config.mjs` miał `Permissions-Policy: geolocation=()` — wyłączało GPS w całej apce (spacer
  GPS nie mógłby działać). Zmienione na `geolocation=(self)`.
- MapLibre GL 6 ładuje worker z pliku OBOK własnego modułu (`new URL("./maplibre-gl-worker.mjs",
  import.meta.url)`) — po zbundlowaniu przez Next plik nie istnieje ("Worker failed to load").
  Rozwiązanie: `scripts/kopiuj-maplibre-worker.mjs` (predev/prebuild) kopiuje worker + moduł
  wspólny do `public/maplibre/` (w .gitignore), mapa wskazuje go `setWorkerUrl`. CSP: `worker-src 'self' blob:`.
- Strona Ekranu 3 nie może statycznie importować nic z `widok-3d.tsx` (ładowanego `next/dynamic`),
  bo three.js wpadłby do bundla strony — wspólne helpery w `components/lokalizacja/mapa-cieplna.ts`.
- Reguła lint `react-hooks/refs`: nie przypisywać `ref.current = props` w renderze — w efekcie.

**Fakty sprawdzone na żywo (24.09.2026):**
- WMS ortofotomapy Geoportalu (`PZGIK/ORTO/WMS/HighResolution`) zwraca poprawne kafle w EPSG:3857,
  choć GetCapabilities deklaruje tylko 2180/4326 — nieudokumentowane; jeśli zniknie, mapa działa dalej
  bez podkładu. CORS odbija origin. Adres `.../StandardResolution` zwraca 404.
- ULDK `GetBuildingByXY` działa (Kraków, Sukiennice: 70 wierzchołków, 2876 m²), ale Warszawa: brak
  wyników — pokrycie budynków niepełne, UI mówi to wprost i kieruje na spacer GPS.
- WMS granic działek KIEG (`integracja.gugik.gov.pl`) przekierowuje (302) — nie użyty.

**Decyzje prezentacji (nie fizyka):** ściany budynku łączone w elewacje przy różnicy azymutu
< 15° (`TOLERANCJA_ELEWACJI_DEG` — obrys z ULDK ma dziesiątki odcinków); zapis PVGIS pasuje do
lokalizacji w promieniu 0,01° (~1 km, piksel SARAH ma kilka km); mapa cieplna E3 = siatka 4×4
punktów na powierzchnię, strata powierzchni = średnia punktów; numerowane znaczniki na mapie tylko
dla zbiorów ≤ 20 punktów.

**Zweryfikowane w przeglądarce (`pnpm dev`):** E2 online — działka po TERYT z ULDK (Kraków, 3828 m²)
i budynek kliknięciem w mapę; E3 — model testowy (dom 10×8 m, dąb 9 m 12 m na południe): połać S
3,8% rocznie, grudzień 31%, prognoza 15 m za 10 lat → 9,1%; E4 — realne dane PVGIS (Warszawa):
optimum 37°/180°, połać S 27° 99%, elewacja S 70%, E/W 53–54%, N 26%. Szerokość telefonu (375 px) bez
poziomego przewijania na wszystkich trzech ekranach.

**Otwarte:** TD14, TD15 (2), TD17 (nowy — przeszkody tylko jako walce). Opisy narzędzi AI — ✅ niżej.

**Opisy narzędzi AI (24.09.2026, 9.3):** `policz_skaner_dzialki`, `policz_zacienienie`,
`ocen_orientacje_powierzchni` (`lib/ai/tools/`, zarejestrowane w `pytaj-asystenta.ts`, wszystkie `read`).
- E2: wejście = współrzędne narożników, NIE numer działki — ULDK wołany tylko z przeglądarki (D23),
  więc narzędzie serwerowe go nie pobiera. Wynik bez punktów lokalnych (dane dla rysunku).
- E3: przeszkody jako odległość + kierunek od paneli (tak user opisuje je w rozmowie); handler
  przelicza na układ lokalny — zamiana współrzędnych, nie model. Budynek = prostokąt z bliższą ścianą
  prostopadłą do kierunku. Profil horyzontu (360 wartości) pominięty w wyniku.
- E4: handler sam pobiera PVGIS TMY (`pobierzTmy`, ten sam adapter co proxy D22) — 8760 rekordów nie
  przechodzi przez model; błąd PVGIS → `INCOMPLETE` + komunikat, bez wyniku. Fabryka z `fetchImpl` dla testów.
- Moduł 1 jest zmigrowany do i18n (ostrzeżenia/założenia jako kody) — nowy helper
  `lib/ai/tools/teksty-wyniku.ts` rozwiązuje je na tekst PL (`t("pl", …)`), bo surowy kod nic modelowi
  nie mówi. Starsze narzędzia przestawione na ten helper w PR #145 — sekcja niżej.

## Narzędzia AI modułów zmigrowanych do i18n — tekst PL zamiast kodu (24.09.2026)

Błąd: 6 starszych narzędzi w `lib/ai/tools/` (`kalkulatory-pomocnicze`, `projekt-uziemienia`,
`monitorowanie-izolacji-imd`, `normy-i-certyfikaty`, `przepust-powietrza`, `zlacza-mc4`) — wszystkie
na kalkulatorach już zmigrowanych do i18n — wysyłały modelowi założenia jako `JSON.stringify({kod})`,
a ostrzeżenia jako `technicalMessage` (surowe, np. `voltageV = -12, oczekiwano > 0`). Naprawione:
wszystkie przez `lib/ai/tools/teksty-wyniku.ts` (`tekstyOstrzezen`/`tekstyZalozen`, `t("pl", …)`;
dla niezmigrowanych zwraca `message`/string bez zmian). Helper przeniesiony w identycznej treści z
niewypchniętej gałęzi `claude/modul1-opisy-ai` (commit `62d786b`) — przy merge obu gałęzi plik się nie
skonfliktuje. Test: `kalkulatory-pomocnicze-tool.test.ts` sprawdza tekst PL założenia i ostrzeżenia.
**Nowe narzędzie AI = zawsze przez ten helper, nigdy `technicalMessage`/`JSON.stringify` do modelu.**
Otwarte (nie ruszane, poza zakresem): `monitorowanie-izolacji-imd` i `przepust-powietrza` w ogóle nie
wystawiają `zalozenia`, choć kalkulatory je mają (np. próg alarmu IMD = przykładowa wartość źródła).

## TD15 (2) naprawiony — zacienienie we wskaźniku Ekranu 4 Modułu 1 (24.09.2026)

Kolejność właściciela: TD15 (2) → TD14 → TD17 (dokończenie Modułu 1, odblokowuje Moduł 7).
- **Model:** bez nowej fizyki — godzina ze słońcem niżej niż przeszkoda w jego azymucie = powierzchnia
  zacieniona w sensie Muneera (EUR 26075 równ. 28), dokładnie ta sama gałąź co przy cos θ ≤ 0.
  Profil horyzontu: wspólna funkcja `profilHoryzontuDeg` (`analiza-zacienienia/przeszkody.ts`) —
  E3 z niej rysuje wykres, E4 z niej liczy zacienienie (jedna geometria, dwa ekrany).
- **Dane między ekranami:** wynik E3 nie jest zapisywany (05, 5.1), więc E4 liczy profile sam z Seedu
  E2 (`horyzontyPolaci` w `lib/lokalizacja/model-dzialki.ts`) na tej samej siatce 4×4
  (`SIATKA_PROBKOWANIA`, teraz wspólna stała E3/E4) — średnia napromieniowania po punktach.
- **Decyzje:** optimum lokalizacji zawsze bez przeszkód (wskaźnik zacienionej połaci spada, a nie
  "optimum się przesuwa"); przeszkody w obecnej wysokości; elewacje i powierzchnie ręczne jawnie "bez
  zacienienia" w założeniach (wysokości punktu na ścianie nie znamy — nie zgadujemy). Założenie
  `NAPROMIENIOWANIE-NIE-UZYSK` skorygowane (PL/EN/RU): nie mówi już, że wskaźnik "pomija zacienienie".
- **Weryfikacja:** +10 testów (w tym tożsamość: horyzont 90° dookoła → tylko Gd·F(β, 0,25227) + odbite;
  horyzont 0° → wynik identyczny jak bez profilu); pełny pakiet lokalny czysty (typecheck, lint,
  i18n-guard, 1186/1186, build, audit:gate). Kontrola na realnych danych PVGIS z tego kontenera
  niemożliwa (`PVGIS-ODRZUCIL-ZAPYTANIE` — sieć kontenera), do zrobienia w przeglądarce przy okazji.

## TD14 naprawiony — Ekran 3 liczy stratę całkowitej energii na danych TMY (24.09.2026)

Decyzje właściciela: 1(b) — przesłonięcie nieboskłonu nie modelowane, jawnie w założeniach (→ **TD18**);
wariant zapasowy clear-sky zostaje dla braku danych; drzewa liściaste zimą — "poszukaj źródła".
- **Jedna fizyka:** model Muneera wydzielony z kalkulatora E4 do `orientacja-powierzchni/muneer.ts`
  (`przygotujGodziny`, `plaszczyzna`, `natezenieGodziny(g, pl, zaPrzeszkoda)`, `napromieniowanie`) — E4
  bez zmiany wyniku (te same 18 testów), E3 liczy nim stratę godzina po godzinie. Walidacja danych
  godzinowych też wspólna (`bledyDanychGodzinowych`). Test zgodności E3↔E4 < 0,2 p.p.
- **UI E3:** ten sam zapis TMY co E4 (`useDaneTmy`, `zapisPasuje`) — pobrane raz na którymkolwiek ekranie
  działa na obu. Klucz aktualności wyniku bez 8760 rekordów (`JSON.stringify` per punkt siatki byłby
  kosztowny) — dane identyfikuje data pobrania. Do workera ta sama tablica rekordów we wszystkich
  wejściach — structured clone kopiuje ją raz.
- **Narzędzie AI** `policz_zacienienie`: fabryka z `fetchImpl` jak E4, PVGIS po stronie serwera; błąd →
  wariant zapasowy + komunikat (inaczej niż E4, który bez danych nie ma żadnego wyniku). Pole
  `zrodloPromieniowania` mówi modelowi, który wariant policzono.
- **Pułapka:** `pnpm prettier --write` przeformatował cały plik na styl ze średnikami — repo NIE używa
  Prettiera (brak konfiguracji, styl bez średników). Nie uruchamiać prettiera na plikach repo.
- **Pułapka:** heredoc bez cudzysłowu (`<<EOF`) w bashu wykonuje `` `...` `` z komentarzy JSDoc — przy
  generowaniu kodu przez skrypt używać `<<'EOF'`.
- **TD19 (drzewa liściaste zimą) — źródło znalezione, decyzja otwarta:** Konarska i in. 2014 (Theor. Appl.
  Climatol. 117:363–376): przepuszczalność bezpośredniego przez koronę bezlistną 40,2–51,9% (Göteborg,
  4 gatunki liściaste). Zweryfikowane tylko streszczenie — wydawcy zablokowani przez sieć kontenera.
- **TD19 — wdrożone częściowo (24.09.2026, decyzja właściciela: "wdrażamy na bazie tych danych"):**
  E3 v1.2.0. `PrzeszkodaDrzewo.lisciaste` + `miesiaceBezlisci` (wejście globalne, nie per drzewo —
  fenologia jest regionalna; wpisywane ręcznie, bez domyślnych miesięcy, bo nie mamy źródła). τ = 0,40
  (dolna granica 40,2% w dół). Kilka przeszkód na linii słońca → iloczyn τ; strata przypisana przeszkodzie
  najmniej przepuszczalnej (przy remisie najwyższej kątowo) — przy samych bryłach/drzewach z liśćmi wynik
  identyczny jak w v1.1.0. E4 świadomie bez zmian (profil horyzontu nie rozróżnia drzew) — ostrożnie.
  Seed E3 (`PrognozaSeed`) dostał pola opcjonalne — stare zapisy działają. Pełny tekst do znalezienia
  przez właściciela (lista zadań), potem dopracowanie.
- **Weryfikacja:** pełny pakiet lokalny czysty (typecheck, lint 0 błędów, i18n-guard, 1193/1193, build,
  audit:gate). Kontrola na realnych danych PVGIS i w przeglądarce — niemożliwa z tego kontenera, do zrobienia.

## TD17 — przeszkody o obrysie wielokąta w Skanerze (24.09.2026)

Na polecenie właściciela ("Robimy TD17"). Kierunek naprawy wprost z wpisu TD17 w `dlug-techniczny.md`,
bez nowych decyzji projektowych. Budowane równolegle z TD15 (2)/TD14/TD19 (gałąź
`claude/dazzling-archimedes-5x6iwl`, wpisy wyżej) — scalone razem: bryła z E2 przechodzi też do
horyzontów E4 (`horyzontyPolaci`) i do obliczeń TMY E3; pole "drzewo liściaste" pokazywane tylko dla walców.
- Jądro Skanera: `PrzeszkodaGps` = unia `walec` | `obrys` (narożniki + wysokość); obrys rzutowany do
  układu lokalnego i skalowany tą samą kalibracją poziomą co działka/budynek. Nowy kod walidacji
  `SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA` (PL/EN/RU); < 3 narożniki → istniejący `SKANER-ZA-MALO-PUNKTOW`.
- Seed (`lib/lokalizacja/model-dzialki.ts`): walec ma `typ?` opcjonalny — **drafty sprzed zmiany
  (IndexedDB) nie mają pola `typ` i czytają się jako walec**, bez migracji. Nie zmieniać na wymagane.
- E2 UI: przycisk "+ Dodaj przeszkodę-obrys" (jak połać — punkty GPS/mapy trafiają do aktywnej
  przeszkody); "Pobierz budynek w tym miejscu" przy aktywnej przeszkodzie-obrysie wczytuje obrys
  budynku sąsiada z ULDK do przeszkody (wysokość wpisuje użytkownik — ULDK jej nie ma).
- E3: obrys → `PrzeszkodaBryla` (bez prognozy), widok 3D rysuje bryłę; pola prognozy tylko dla drzew.
- **Pułapka znaleziona przy teście w przeglądarce:** `Pole` bez `id` generuje je z etykiety →
  w listach (kilka przeszkód/połaci) powtarzające się `id` i `label for` trafiające zawsze w pierwsze
  pole (dostępność, czytniki ekranu). Naprawione na Ekranie 2 jawnymi `id` per element. Ten sam wzorzec
  (`<Pole>` w `.map()` bez `id`) występuje jeszcze w kilku innych ekranach — do osobnego przejścia.
- Weryfikacja: `pnpm typecheck`/`lint` (0 nowych)/`check:i18n-guard`/`test` (149 plików)/`build`/`audit:gate`
  czyste; Playwright na buildzie produkcyjnym, 390 px: spacer GPS → budynek + przeszkoda-obrys (4 narożniki)
  + drzewo → E3 dach płaski 4 m: główna przyczyna straty = bryła sąsiada (18,7 p.p.), 1 pole prognozy (tylko
  drzewo), bez poziomego przewijania.

## Synchronizacja ze standardem — Y.6, pełny nadpis NIETYKALNE/ADAPTOWALNE (24.09.2026)

Nowa wersja Routine Y.6 (zastąpiła poprzednią, usuniętą — patrz niżej "Kolejne odpalenia"): Krok 2
zmieniony na "zastosuj wg kategorii Y.8, NIE pytając z góry o każdą pozycję" (poprzednia wersja
kazała proponować i czekać na zgodę nawet dla NIETYKALNE — to był regres względem Y.8, naprawiony
w źródle jako GOD BOOK v2.38, dopisek "[24.09.2026] ✅ KOREKTA" w Y.6: *Y.8 ma pierwszeństwo nad
literalnym brzmieniem "Konsekwencja" w Y.6*).

**Krok 1 (fetch+porównanie):** lokalny klon `new-app-standards` był 4 commity za `origin/main`
(od poprzedniego sprawdzenia dziś) — doprowadzony do zgodności (`git merge --ff-only`). GOD BOOK
źródła: rename `v2_37.md`→`v2_38.md`. Poprzednie sprawdzenie (ten sam dzień, wpis wyżej "Konfiguracja
Y.6 adaptacyjnego...") skatalogowało już pełny zakres v2.21→v2.37 jako propozycję czekającą na
decyzję właściciela — dziś właściciel polecił zastosować to bezpośrednio (nowe zadanie, Krok 2
"stosuj bez pytania z góry"), plus doszedł jeden nowy wiersz `AKTUALIZACJE.md` (2026-09-24, KOREKTA
v2.38 opisana wyżej).

**Krok 2 — zastosowano jako fakt dokonany (checklista Y.9):**

*NIETYKALNE (pełny nadpis, wykonane):*
- GOD BOOK: `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_21.md`→`...v2_38.md` (plik
  usunięty przez `git rm`, nowy dodany pełną treścią źródła).
- `docs/standards/`: 11 plików nadpisanych pełną treścią źródła — `00-INDEKS.md`, `00-filozofia.md`,
  `02-model-danych.md`, `03-jadro-obliczeniowe.md`, `05-baza-danych-offline.md`,
  `07-bezpieczenstwo.md`, `08-ui-ux.md`, `10-testy.md`, `11-ci-deployment.md`, `15-wspolpraca-z-ai.md`,
  `17-i18n.md`. Pozostałe 8 plików (`01,04,06,09,12,13,14,16,18`) były już bajt-w-bajt identyczne ze
  źródłem — zero akcji (m.in. `13-droga-mobile.md`, mimo że katalog wcześniej wspominał przepisanie
  Capacitor — okazało się już zsynchronizowane wcześniej).
- `PROMPT_STARTOWY.md` — pełny nadpis (wskaźnik wersji GOD BOOK, próg checklisty Y.9 z ≥3h na ≥12h).
- `docs/przyklady/i18n/README.md`, `docs/przyklady/i18n/check-i18n-guard.mjs` — pełny nadpis.
- `docs/przyklady/pwa/` (nowy katalog źródła, 10 plików + README) — **świadomie NIE skopiowany.**
  Projekt nie ma jeszcze kodu PWA/Service Workera — pozycja informacyjna do czasu faktycznej budowy
  (Y.8: pełny nadpis dotyczy plików, które projekt już ma jako mirror; nowy katalog bez lokalnego
  odpowiednika kopiuje się dopiero, gdy jest faktycznie potrzebny, żeby nie wnosić martwego kodu).
- `README.md`, `CLAUDE.template.md`, `docs/lista-do-zrobienia.template.md`, `docs/memory.template.md`
  (wymienione w poprzednim katalogu jako "wskaźnik wersji + drobne patche") — **nie dotyczą tego
  repo**: to szablony dla NOWYCH projektów rodziny / README samego `new-app-standards`, ten projekt
  ich nie mirroruje (ma własny `README.md` projektowy, nie szablon).

*ADAPTOWALNE (patch, wykonane):*
- `CLAUDE.md` — wskaźnik wersji GOD BOOK w punkcie 2 (`v2_28`→`v2_38`); punkt 4 poprawiony: usunięto
  nieaktualne zdanie "mirror GOD BOOK wciąż wskazuje starszą wersję", dodano fakt wykonanej
  synchronizacji Y.9; poprawiono też literówkę odziedziczoną z poprzedniej sesji (D22→**D24**, ten
  punkt cytował nieaktualny numer decyzji sprzed przenumerowania H.3 — drift bez świadomej decyzji,
  naprawiony od razu per Y.2).
- `.claude/skills/standards/SKILL.md` — wskaźnik wersji GOD BOOK (`v2_28`→`v2_38`).

*LOKALNE — bez zmian treści (Y.8):* `docs/lista-do-zrobienia.md`, `docs/wklad-do-standardu.md`
(oprócz oznaczenia ✅ dwóch już-skonsolidowanych wpisów, patrz niżej — to nie zmiana treści
zgłoszenia, tylko aktualizacja statusu, zgodnie z instrukcją Routine "sprawdź, czy któryś wpis
🔎 nowe został już realnie skonsolidowany"), `docs/zrodla/` — bez zmian.

**`docs/wklad-do-standardu.md` — status zaktualizowany (nie treść):**
- Wpis [23.09.2026] "sztywny cykl Y.6/U.4 generuje dużo zerowych sprawdzeń" → oznaczony ✅
  skonsolidowane: GOD BOOK v2.32 przyjął dokładnie wariant (b) z propozycji (cykl adaptacyjny),
  `AKTUALIZACJE.md` cytuje wprost "zamyka retroaktywnie D21 inzynier-offgrid-pro".
- Pozostałe wpisy `🔎 nowe` (biblioteka norm źródłowych, i18n rozdział 01, itd.) sprawdzone
  pobieżnie — bez nowych dowodów konsolidacji w dzisiejszym `AKTUALIZACJE.md`, status bez zmian.

**Kategorie NIETYKALNE ze skopiowanej treści, które mogą dotyczyć kodu tego projektu (poza zakresem
samego Y.6 — to jest Y.11, osobny audyt zgodności kodu, na żądanie/koniec Fazy, nie część tej
synchronizacji dokumentów):** 02.1 (`validFrom`/`validTo`/`legalBasis`/`verifiedBy`/`confidence` dla
wartości regulowanych prawem — normy/współczynniki bezpieczeństwa), 03.3 (`INCOMPLETE` jako trzeci
stan zamiast dwuwartościowej logiki+flagi w modułach obowiązku/ryzyka/zgodności), 07 (CSP hash-based
zamiast `'unsafe-inline'`, checklist `Permissions-Policy` przed nową funkcją API przeglądarki — już
zastosowane praktycznie w PR #144, patrz "Moduł 1 — UI Ekranów 2–4" wyżej), 17.7b/17.7c (selektor
języka tylko kompletne języki — dotyczy, projekt jest przedpremierowo), 18.1 (retroaktywnie
obowiązkowe). Nie sprawdzane teraz — to osobne zadanie.

**Krok 3 (cykl adaptacyjny):** poprzednie sprawdzenie (ten sam dzień) już zresetowało
`interwał_h = 12`, `licznik_zero_z_rzedu = 0` po znalezieniu nowości. Dzisiejsze sprawdzenie
**również** znalazło i zastosowało nowość (KOREKTA v2.38 + dokończenie zaległego pełnego sync) →
`interwał_h` **zostaje na 12** (reset, nie rośnie), `licznik_zero_z_rzedu = 0`.

**Krok 4 — Routine.** Stara Routine (`trig_01La5dGeB9ycdVpPf2dmYgrk`, pytała o KAŻDĄ podmianę
łącznie z NIETYKALNE — regres względem Y.8) **usunięta** na polecenie właściciela projektu.
Założona nowa, poprawiona: self-bind, `trig_01892Z45ThAi2T56PJRjQQAh`, `run_once_at` =
2026-09-25T10:57:00Z (+12h). Pełny prompt — patrz wywołanie `create_trigger` w tej sesji; kluczowa
różnica względem poprzedniej wersji: Krok 2 stosuje NIETYKALNE/ADAPTOWALNE automatycznie, pytanie
właściciela zostaje wyłącznie dla (a) pliku poza trzema kategoriami, (b) prawdziwego konfliktu
Y.2.2, (c) treści LOKALNE wymagającej wiedzy specyficznej dla projektu.

## Synchronizacja ze standardem — Y.6, automatyczne odpalenie Routine (25.09.2026, 10:57 UTC)

Pierwsze automatyczne odpalenie nowej Routine (`trig_01892Z45ThAi2T56PJRjQQAh`), zgodnie z
zaplanowanym `run_once_at`. Działanie samodzielne, bez udziału właściciela projektu.

**Krok 1:** przed dotknięciem lokalnego `main` wykonano `git fetch origin main` +
`git checkout -B main origin/main` — main był już aktualny (`fd684d9`, PR #150 z poprzedniego
sprawdzenia), żadna równoległa sesja nie scaliła nic w międzyczasie. `new-app-standards`:
`git fetch` + `git merge --ff-only` — 2 nowe commity, ale dotyczyły wyłącznie
`docs/projekty-downstream.md` (wewnętrzny plik roboczy sesji U.4 nad `new-app-standards`, nie
mirror żadnego pliku tego projektu) — commit źródła wprost potwierdza: *"inzynier-offgrid-pro
(Y.6 odświeżona do v2_38, wszystko już skonsolidowane)"*. GOD BOOK źródła bez zmiany nazwy pliku
(nadal `v2_38.md`), `AKTUALIZACJE.md` bez nowych wierszy od wczorajszego pełnego sync.

**Krok 2 — wynik: ZERO nowej treści.** Zweryfikowano wprost (`diff -rq`): `docs/standards/*`,
`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_38.md`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — wszystkie identyczne ze źródłem, zero różnic. Nic do zastosowania.

**Krok 3 (cykl adaptacyjny):** wczorajsze sprawdzenie zresetowało `interwał_h = 12`,
`licznik_zero_z_rzedu = 0` po pełnej synchronizacji. Dzisiejsze sprawdzenie nie znalazło nic nowego
→ `interwał_h = min(48, 12 × 1,5) = 18`, `licznik_zero_z_rzedu = 1`.

**Krok 4:** `update_trigger` na `trig_01892Z45ThAi2T56PJRjQQAh`, nowy `run_once_at` =
2026-09-26T04:58:00Z (+18h).

## Moduł 3 — pełne wyliczenie + start sesji budowy (25.09.2026)

**Znalezisko (Dyrektywa #14, ta sama klasa co luka 1.19):** 17 z 30 pozycji `Tresc_Modul_3_PV_Ekrany.md`
nie miało wiersza w `docs/rejestr-pokrycia.md` — sekcja "Moduł 3 — ekrany dodatkowe" z 04.09.2026
zapowiadała pełne wyliczenie jako "osobny, nie rozpoczęty krok", audyt N (05.09) złapał tylko PID.
Naprawione: nowa sekcja rejestru "Moduł 3 — pełne wyliczenie pozostałych pozycji źródła". Przy okazji
`mapa-wdrozenia.md` M3/M5 skorygowane (M5 29/29 od 20.09, mapa stała na 4/29) — reszta mapy nadal
z 07.09, pełna resynchronizacja dopisana do listy zadań. **Lekcja:** zapowiedź "pełne wyliczenie
później" w rejestrze to dokładnie ten stan, którego #14 zakazuje — przy starcie pracy nad modułem
najpierw grep nazw ekranów źródła w rejestrze, dopiero potem budowa.

**Decyzje właściciela projektu (25.09.2026):**
- **M3/E19 (degradacja paneli) — `⚠️ blocked`.** Źródło nie podaje modelu LID/LETID/PID; odrzucony
  też model gwarancyjny z karty katalogowej.
- **M3/E4 (liczba paneli) — zamiast 3 wariantów źródła drabinka okresów pokrycia** (propozycja:
  cze–sie / kwi–wrz / mar–paź / lut–lis / cały rok; `N = max_m(E_zapotrz,m / E_panel,m)`, miesiąc
  decydujący z danych lokalizacji). Szczegóły czekają na potwierdzenie — wtedy wpis D#.
- **M3/E9 (Złoty środek) — czeka.** Ustalone w rozmowie: z 3 krzywych tylko produkcja (silnik M1) i
  śnieg (PN-EN 1991-1-3 Tablica 5.2, `μ1 = 0,8` dla 0–30°, `0,8(60−α)/30` dla 30–60°, `0` od 60°) mają
  wzór; wiatr(kąt) wymaga PN-EN 1991-1-4 (brak w repo — wzór E6 nie zawiera kąta); brak wag
  łączenia. Przykład źródła "22° → −55% wiatru" niewyprowadzalny (rzut sin α: ok. −35%).

**Pułapka merytoryczna do zapamiętania (M3/E15, dane 2.30):** "TOPCon +5–8%, HJT +8–12% uzysku vs
PERC" — sprawność ogniwa to kWp z m², nie kWh z kWp. Różnica kWh/kWp wynika z γ, bifacjalności,
słabego światła, degradacji. Pokazywać jako dane źródła z 🔎, nigdy jako mnożnik w obliczeniu
(dotyczy też przyszłego Ekranu 27).

**Przejście nasłonecznienie → produkcja (M3/E1, E4, E20, E27):** silnik M1/E4 zwraca kWh/m²; kWh
wymaga PR instalacji — źródło go nie podaje → pole ręczne z podpowiedzią zakresu, bez domyślnego.

**[25.09.2026, po partii 1] Moduł 3 — 6 ekranów dobudowanych (E7, E12, E15, E21, E23, E25), 18/27 `done`.**
- **Echo z E13:** `obliczStrataPaneluPct` wyekstrahowane z `zacienienie-diody-bocznikujace` —
  E12 (wpływ diod bocznikujących) to ten sam fakt konstrukcyjny, nie nowa reguła; E12 nie ma
  własnego modułu domenowego ani narzędzia AI.
- **E15:** jedyne obliczenie to powierzchnia modułów z definicji STC; dane uzysku 2.30 z 🔎 (patrz
  wyżej). Nowe pliki narzędzi AI M3 testowane zbiorczo w `lib/ai/tools/__tests__/modul3-pv-tools.test.ts`
  — kolejne narzędzia M3 dopisuj tam, nie w osobnych plikach.
- **✏️ E21 — uzupełnienie eksperckie do potwierdzenia przez właściciela:** ostrzeżenie, że typowy
  mikroinwerter (falownik sieciowy) w off-gridzie wymaga sprzężenia AC z falownikiem wyspowym —
  źródło tego nie mówi, a rekomendacja "mikroinwertery przy cieniu" bez tego prowadzi do
  niedziałającej instalacji. Pełne 4 pola ✏️: `docs/rejestr-pokrycia.md`, wiersz Ekran 21.
- **Weryfikacja:** typecheck / lint (0 błędów, 2 ostrzeżenia `<img>` sprzed sesji) / i18n-guard (108
  modułów) / test 1248/1248 (+42) / build / audit:gate — czyste. `next start` + Playwright (390 px):
  6 nowych tras HTTP 200, interakcja na każdej, brak `⚠ [klucz]`; błędy konsoli tylko z
  `/_vercel/insights` (lokalnie nieobecny, niezwiązane). Poprawka po oględzinach: tabela E21 minWidth 480→320
  (na telefonie ukrywała kolumnę "Inwerter centralny").

## Licencje norm w publicznym repozytorium (25.09.2026)

**Problem (zgłoszony przez AI, do decyzji właściciela projektu):** repozytorium
`inzynier-offgrid-pro` jest **publiczne** (sprawdzone 25.09.2026), a `docs/zrodla/` zawiera PDF-y norm
chronionych prawem autorskim (np. PN-HD 60364-5-54 z nadrukiem "© Copyright by PKN") oraz pliki `.md`
z przepisaną treścią rozdziałów (np. `norma-PN-EN-1991-1-3/01…05-*.md`). Norma PN-EN 1991-1-4
dostarczona 25.09.2026 miała dodatkowo nadruk licencji jednostanowiskowej PKN ("kopiowanie i
umieszczanie w sieci zabronione") i znak wodny serwisu z danymi osobowymi pobierającego — **ten PDF
świadomie NIE trafił do repo**, w repo tylko notatka robocza z liczbami
(`docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`).

**Stanowisko AI (nie porada prawna):** przepisanie całej normy do `.md` nie rozwiązuje problemu —
prawo autorskie chroni treść, nie format pliku. Bezpieczne w publicznym repo: krótkie notatki
własne — numer punktu/tablicy + liczby i wzory faktycznie używane w kodzie. Właściciel projektu:
jeśli przepisanie nie jest dopuszczalne, istniejące pliki zostają w repo do pierwszych
użytkowników/publikacji, potem oryginały na własny dysk. **Uwaga:** repo publiczne = już
opublikowane — najprostsze zabezpieczenie teraz to zmiana widoczności repo na prywatne
(Ustawienia GitHub). Zadanie z terminem "przed publikacją": `docs/lista-do-zrobienia.md`.
**Zasada od 25.09.2026:** nowa norma z nadrukiem licencji/danymi osobowymi → oryginał poza repo,
w `docs/zrodla/norma-*/00-INDEKS.md` tylko notatka robocza (punkty, tablice, liczby używane w kodzie).

## Stelaż regulowany i norma wiatrowa — ustalenia (25.09.2026)

- **Stelaż PV jako wiata jednospadowa (PN-EN 1991-1-4, Tablica 7.6)** — zaakceptowane przez
  właściciela projektu; w aplikacji oznaczane jako założenie (praktyka inżynierska, nie zapis normy).
- **Tablica 7.6 obejmuje tylko 0–30°**, 7.4.3 daje `cf = 1,80` dla płyty pionowej (90°). Przedział
  30–90° niepokryty normą — nie interpolować (Dyrektywa #1).
- **Śnieg w zakresie 0–30° nie różnicuje kątów:** `μ1 = 0,8` stałe (PN-EN 1991-1-3, Tablica 5.2) — w
  tym przedziale "złoty środek" (M3/E9) to w praktyce wybór energia vs wiatr.
- **Nowe wymaganie właściciela:** naziemny stelaż z ręcznie regulowanym kątem (zmiana kąta w ciągu
  roku, zimą większy) — D26 w `rejestr-decyzji.md`.
- **[25.09.2026] Właściciel projektu wybrał plan B:** istniejące PDF-y/`.md` norm zostają w repo do
  pierwszych użytkowników/publikacji, potem oryginały na jego dysk. Nowe normy: dalej notatki robocze
  (`docs/zrodla/norma-*/00-INDEKS.md` — punkty, tablice, wzory i liczby używane w kodzie), żeby
  kolejne sesje nie czytały 100+ stron od nowa. PDF PN-EN 1991-1-4 (dane osobowe w znaku wodnym)
  nadal poza repo.
- **[25.09.2026] M3/E9 — D27:** tor siły wiatru z PN-EN 1991-1-4 kompletny (notatka robocza, sekcja
  "Tor obliczeń siły wiatru"); balast tylko jako `m = Fw/g` do czasu PN-EN 1990 (`docs/normy-brakujace.md`).

**[25.09.2026] M3/E1 „Kąt pochylenia i azymut” — done.** Nowe wzorce do reużycia (15.19):
- **Od 25.09: każdy ekran potrzebujący lokalizacji + PVGIS TMY używa `useLokalizacjaProjektu()`
  (`lib/lokalizacja/use-lokalizacja-projektu.ts`) i `<SekcjaDanychNaslonecznienia>` — nie kopiuje logiki
  z M1/E4** (E4 M1 przepięty na nie w tej samej zmianie).
- **Tabela napromieniowania kąt×miesiąc** (`obliczTabeleNapromieniowania`, zadanie workera
  `tabela-napromieniowania`) — wejście dla M3/E4 (liczba paneli, D25), E9 (krzywa produkcji, D27), E20.
- `napromieniowanieMiesieczne` w `muneer.ts`; miesiąc liczony raz w `przygotujGodziny` (pole `miesiac`) —
  pierwsza wersja (`new Date()` w pętli) spowolniła testy M1 ponad limit 5 s — pułapka wydajności.
- **PVGIS niedostępny z kontenera** (polityka sieci: `re.jrc.ec.europa.eu` odrzucony przez proxy) —
  test w przeglądarce przez wstrzyknięcie syntetycznego roku do IndexedDB (`offgrid-storage`/`kv`,
  klucze `offgrid.pvgis-tmy.v1`, `offgrid.draft.lokalizacja-i-klimat`). Weryfikacja: tabela 169 ms,
  optimum grudzień 77° / czerwiec 19° (dane syntetyczne bezchmurne — wartości kWh zawyżone, tylko
  kontrola mechaniki). Pełny pakiet: 1261/1261 testów, build, audit, i18n-guard (109) — czyste.

**[25.09.2026] M3/E20 „Orientacja wschód-zachód” — done.** Pułapka znaleziona przy oględzinach w
przeglądarce (nie przez testy): rozkład dobowy przypisywał rekord godzinowy PVGIS w całości do godziny
zegarowej jego chwili — rekord z 11:50 czasu słonecznego (reprezentujący 11:20–12:20) szedł cały "przed
południe", co dawało 56% poranka dla paneli na południe zamiast ~50%. Naprawione w
`napromieniowanieDobowe` (podział proporcjonalny), test regresji potwierdzony w obie strony (bez
poprawki 55,6%, z poprawką < 1,5 p.p. od 50%). Lekcja: przy agregacji danych godzinowych do przedziałów
czasu zawsze sprawdzić, czy rekord to chwila czy przedział. Pełny pakiet: 1273/1273 testów, build, audit — czyste.


**[25.09.2026] M3/E9 „Złoty środek” — done (D27).** Właściciel potwierdził: PN-EN 1990 nie ma w repo ani
w paczce 25.09 (obie części Eurokodu 1 tylko się do niej odwołują — sprawdzone grepem w tekście norm).
- **Nowy wspólny moduł `lib/core/modules/pv/eurokod-1/`** (`wiatr.ts`, `snieg.ts`) — czyste funkcje
  norm, bez CalcResult. M3/E6 i M3/E2 (balast) mają liczyć wiatr STĄD, nie od nowa (echo D12).
- **Uzupełnienie notatki normy:** Tablica NA.1 ma pełny wzór dla strefy 3 przy A > 300 m
  (`0,30·[1+0,0006(A−300)]²·(20000−A)/(20000+A)`) i dla strefy 1 (`0,30·[1+0,0006(A−300)]²`) —
  wcześniejsza notatka odsyłała do oryginału; teraz wpisane w `00-INDEKS.md`.
- **Interpretacja zachowawcza:** 7.3 (3) pozwala interpolować liniowo „wartości pośrednie” — w kontekście
  φ; dla kąta α między węzłami (co 5°) bierzemy bardziej niekorzystny węzeł (jawne założenie).
- 90°: cf = 1,80 to siła POZIOMA — balast kg nie liczony (tarcie/wywracanie poza normą).
- Wysokość n.p.m. z metadanych PVGIS, gdy user nie wpisał (dane lokalizacji, nie zgadywanie).
- Na danych syntetycznych (Warszawa, strefa 1, teren III, 2 m, 12 m²): qp = 476 Pa, 30° → 10,3 kN →
  1048 kg. Przy wycenie energii 1 zł/kWh × 10 lat wygrywa 30° (energia przeważa koszt balastu 1 zł/kg).

**[25.09.2026] M3/E4 „Ile paneli potrzebujesz” — done (D25).** Pole „dodatkowe zużycie w sezonie
grzewczym” potwierdzone przez właściciela; miesiące grzewcze — wybór użytkownika (brak źródła na sezon).
- Moduł 2 NIE ma zapisanej sumy dobowego zużycia (brak draftu z bilansem) — E4 ma pole ręczne. Gdy powstanie
  ekran bilansu M2, podpiąć jako podpowiedź.
- `Math.ceil(x − 1e-9)` przy N — iloraz 12,000000001 z arytmetyki zmiennoprzecinkowej nie może dać 13.
- Deficyt: przy N rekomendacji; gdy nawet lato przekracza limit — przy pełnym limicie (ostrzeżenie).
- Status: `LP-DEFICYT-POZA-OKRESEM` to `info` (D13 — nie podnosi statusu).

**[25.09.2026] M3/E3 „Tracker czy stały stelaż” — done.** Zysk trackera 30–40% nie jako pole ręczne
(tak zapowiadał wiersz rejestru), tylko wynik dla obu granic zakresu — jak E23 (Dyrektywa #1). Stąd trzeci
werdykt „zależy”: gdy przy 30% wygrywa stały stelaż, a przy 40% tracker. Pułapka: `Math.floor(0.3/0.1)` = 2
(float) — dzielenie z `+1e-9`, test K na to. Napór trackera nieliczony (brak wzoru w źródle) — `info`, nie
`warning` (fakt ze źródła, nie ryzyko wynikające z danych użytkownika; D13).

**[25.09.2026] M3/E2 „Typ montażu” — done (6 trybów: 5 ze źródła + stelaż regulowany D26).** Każdy tryb —
osobny kalkulator w `lib/core/modules/pv/typ-montazu/` i osobny szkic UI (przełączanie nie gubi danych).
Decyzje: (1) pion porównany z najlepszym kątem stałym przy tym samym azymucie, miesiące zysku z danych — bez
sztywnej granicy „lato/zima”, której źródło nie definiuje; (2) próg „trawa/zaspa > 30 cm” zastąpiony geometrią
(przeszkoda wyżej niż dolna krawędź) — dosłowny próg przeczyłby fizyce przy panelach zawieszonych wysoko; (3)
tryby skośny/wielopołaciowy nie liczą napromieniowania od nowa — to samo zadanie workera co M1/E4, a draft M1/E4
czytany tylko do odczytu (`useOdczytDraftu`, jeden właściciel zapisu); (4) wiata: układy dwublokowe
(gilotynowe) — przyzwoite, ale nie dowiedzione optimum → jawne założenie; kierunek podziału zwraca domena
(`podzial`), UI go nie zgaduje; (5) stelaż na dachu płaskim liczony jak wiata — ostrzeżenie `warning` o
strefach krawędziowych i nośności dachu (poza modelem). Pułapka: `ulozPanele` — pętla cięcia musi dojść do
`i <= floor(L/a)` (reszta krótsza niż bok w orientacji 1 może zmieścić panel obrócony).

**[25.09.2026] M6 „Porównanie kosztów ogrzewania” (dawne 5.39 + D28) — done; potwierdzenia E15 🔎 i E21 ✏️.**
Pomysł właściciela „webasto + paliwa stałe” okazał się mieć oparcie w źródle: funkcja 5.39 (Biblia §6.27.13),
dotąd nieobecna w rejestrze (Część 2C `Tresc_Modul_6` ją tylko wymienia). Źródło nie podaje wartości
opałowych ani sprawności — wszystko wpis użytkownika; okres 10 lat jest ze źródła, więc wolno go wstawić jako
start pola (inaczej niż np. PR). Źródło z brakami nie blokuje porównania pozostałych (info zamiast INCOMPLETE
całości) — przy liście budowanej stopniowo to jedyny użyteczny tryb, i nadal bez wartości domyślnych.
**Pułapka (znaleziona i naprawiona):** `Pole`/`PoleSelect` budują `id` z etykiety — w powtarzanych kartach
(ta sama etykieta N razy) powstają zduplikowane `id`, etykiety wiążą się tylko z pierwszym polem (dostępność,
testy Playwright `getByLabel`). Naprawione tu, w M3/E2 (moc powierzchni) i w M1/E4 (korekty i powierzchnie
ręczne); przy każdym `.map()` z `Pole` podawać jawne `id`. Inne ekrany z listami `Pole` — do przejrzenia.

## Pull 25.09.2026 — dwa naprawione dryfy po PR #147–#151

Po `git pull` (14 commitów) pełny lokalny pakiet wykrył dwa dryfy (Y.2, naprawione od razu):

1. **Testy z timeoutem w pełnym pakiecie.** `orientacja-powierzchni.test.ts` — dwa nowe testy TD15
   pkt 2 ("przeszkoda od południa…", "kilka punktów powierzchni…") trwają ~3,7 s w izolacji, pod
   równoległym obciążeniem całego pakietu (4 rdzenie) przekraczały domyślne 5 s Vitest. W izolacji
   przechodziły, więc łatwo przeoczyć. Dodano `{ timeout: 30_000 }` — ten sam wzorzec, który już
   mają inne ciężkie testy w tym pliku. **Pułapka:** każdy test uruchamiający pełny przebieg
   godzinowy TMY (optimum/profil horyzontu) potrzebuje jawnego limitu — sprawdzaj pełnym `pnpm test`,
   nie tylko plikiem.
2. **Martwe linki do GOD BOOK.** Pełny sync Y.9 (24.09, v2_28→v2_38) zaktualizował `CLAUDE.md`,
   `SKILL.md`, `PROMPT_STARTOWY.md`, ale pominął `00_Biblia.md`, `01_Zasady_Pracy_i_Konwencje.md`,
   `README.md`, `docs/lista-do-zrobienia.md` — poprawione. Historyczne `USTALENIA.md`/
   `ZASADY_APLIKACJI.md` i wpisy historyczne w tym pliku celowo bez zmian.

## Paczka `docs/zrodla/New-info/` przetworzona (25.09.2026)

Właściciel projektu poprosił o zajęcie się folderem `docs/zrodla/New-info/` (13 plików PDF)
wg standardowej procedury materiałów źródłowych (15.4). Rozłożone na 7 dedykowanych folderów
(`norma-IEC-62305/`, `materialy-Purmo-PN-EN-12831-ogrzewanie/`, `norma-PN-EN-1991-1-4-wiatr/`,
`norma-PN-82-B-02403/`, `norma-PN-EN-1990-eurokod-0/`, `norma-PN-EN-1995-1-1-eurokod-5-drewno/`,
`materialy-fizyka-budowli/`) — pełny opis per plik i rekomendacja co do dalszego losu (część do
`new-app-standards`, ogólnobudowlana, nie off-grid-specyficzna): `docs/zrodla/README.md`, sekcja
"Paczka New-info".

**Pytanie o pochodzenie zadane i rozstrzygnięte:** większość plików "document-download*" nosiła
stopkę "Downloaded by Dmitrij Szulga (...)" (Studocu) — zapytano właściciela wprost, czy to
problem z legalnością/prowieniencją źródła. **Odpowiedź: to własne konta/pobrania właściciela,
źródło potwierdzone jako w porządku** — nie stawiać tego pytania ponownie przy tych plikach.

**Duplikat znaleziony i usunięty (Y.2, nie decyzja — nadmiarowość):** `559094399-060364NHDD149-ES.pdf`
(UNE-HD 60364-7-712:2017 ES) był bajt-w-bajt identyczny (MD5) z już istniejącym
`docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf` (już przeczytany
w całości, użyty w kodzie M3/E22 05-07.09.2026) — usunięty zamiast tworzenia martwej kopii.

**OCR wykonany w tej sesji** (tesseract, pakiet pol+eng, 250 DPI) dla trzech dużych skanów bez
warstwy tekstowej: PN-EN 1991-1-4 (wiatr, 146 str.), "A Guide to BS EN 62305" (140 str.), Eurokod 0
PN-EN 1990 (120 str., częściowo natywny tekst w załącznikach). **Tylko wstępny spot-check jakości
OCR, nie pełna weryfikacja strona-po-stronie** (w przeciwieństwie do w pełni zweryfikowanego
Załącznika B normy PN-HD 60364-5-52) — przed użyciem którejkolwiek liczby w kodzie kalkulatora,
obowiązkowa weryfikacja wizualna względem oryginalnego PDF, zgodnie z zastrzeżeniem w każdym
`00-INDEKS.md`.

**Najbardziej wartościowa pozycja: `norma-IEC-62305/`** (ochrona odgromowa, metoda toczącej się
kuli, klasy LPL) — bezpośrednio uzupełnia istniejące `ochrona-przepieciowa-spd` i
`projekt-uziemienia` (M5, `docs/rejestr-pokrycia.md` wiersze 2 i 9), kandydat na nowy ekran M8
liczący strefę ochronną zwodu odgromowego. To poradnik producenta (Furse/Thomas & Betts), nie
sama norma — jak poradnik Purmo dla PN-EN 12831 — nie traktować jako tekst normatywny wprost.

**Nic z tej paczki jeszcze nie wykorzystane w kodzie.** Trzy pozycje (Eurokod 0, Eurokod 5 drewno,
fizyka budowli) ocenione jako prawdopodobnie poza rdzeniem tego projektu (ogólne budownictwo, nie
off-grid PV) — rekomendacja przeniesienia do `new-app-standards` jako generyczna biblioteka,
decyzja czeka na najbliższą sesję nad tym repo (zgodnie z prośbą właściciela: "zaznacz jakie pliki
są potrzebne").

## Weryfikacja OCR paczki New-info (25.09.2026, wieczór)

Na prośbę właściciela („sprawdź dokładnie, czy OCR był dobrze przeprowadzony”) — przed użyciem liczb
w kodzie. Gałąź OCR (`claude/laughing-faraday-lp6ytt`) była już scalona do `main` (PR #153, squash —
drzewa identyczne), więc poprawki na bieżącym `main`.

**Wynik: OCR NIE był bezbłędny** — tekst ciągły dobry, ale tabele, wzory i Załączniki krajowe w wielu
miejscach zniekształcone albo zgubione. Najgroźniejsze znaleziska (wszystkie poprawione):
- PN-EN 1991-1-4: **Tablica NA.1 bez wiersza strefy 2** (26 m/s), NA.2/NA.3 rozsypane.
- PN-EN 1990: **poprawka Ap1 (ψ2 śniegu 0,20 → 0) — w PDF zniszczona warstwa tekstu, OCR dał losowe znaki**;
  „≤” czytane jako „<” (zmienia znaczenie warunków).
- IEC 62305 (poradnik Furse): **Tablica 2.3 (prądy SPD) zgubiona całkowicie**, wzory nieczytelne.
- Poradnik Purmo: **wszystkie 39 wzorów rozsypane** (tekst natywny, ale wzory składane z pojedynczych znaków).

**Metoda (do reużycia):** (1) kompletność stron; (2) drugi niezależny OCR (tesseract 5, 300 DPI, `--psm 6`)
i porównanie liczb strona po stronie — wskazuje strony do obejrzenia; (3) hunspell (pl/en) z poprawką tylko
przy kandydacie jednoznacznym lub potwierdzonym drugim przebiegiem (pierwsza wersja bez tego ograniczenia
„poprawiała” poprawne słowa: „nia→nią”, „cos→coś” — wycofana); (4) odczyt wizualny ze skanem dla całego
zakresu używanego w projekcie; (5) tabele z geometrią sprawdzone arytmetycznie (Tablica 4.3 IEC:
promień = wysokość · tg kąta, 150 par zgodnych).

**Pułapki:**
- Font `Symbol` w PDF Purmo wyświetla „+” jak „−” — przepisanie wzoru z podglądu daje zły znak w (3.1),
  (7.6), (9.1). Rozstrzygają dane PDF (kod znaku), nie obraz.
- W Eurokodzie 5 kod U+F06C to λ (font Symbol) albo ℓ (font MT-Extra) — nierozstrzygalne z samego tekstu,
  zostawione jako `[λ|ℓ]`.
- Błędy w samych oryginałach (nie OCR) oznaczone `[sic]`/`⚠️`, nie poprawiane: Rys. 7.20 i (A.5)/(A.12)
  w PN-EN 1991-1-4, wzór (3.17) w poradniku Furse (literówka potwierdzona przykładem z tego samego poradnika).

**Wartości gotowe do kodu:** PN-EN 1990 Tablica A1.2(A) EQU — γG,inf = 0,90, γG,sup = 1,10, γQ = 1,50;
NB = bez zmian krajowych. PN-82/B-02403 Tablica 1 — strefy I–V: −16/−18/−20/−22/−24 °C.

**Korekty opisów z sesji OCR (nie decyzje, błędy oceny):** PN-EN 1991-1-4 ma odbiorców w kodzie (D27);
PN-EN 1990 jest 🔴 potrzebna, nie „wątpliwa”; PN-82/B-02403 nie ma listy miejscowości. Dwa foldery normy
wiatrowej (`norma-PN-EN-1991-1-4/` notatka, `…-wiatr/` pełny tekst) — połączone odsyłaczami; scalenie
(A) albo zostawienie (B) — pytanie do właściciela, bez odpowiedzi.
**[25.09.2026, uzupełnienie] Rozstrzygnięte — wariant A (scalenie).** Folder `norma-PN-EN-1991-1-4-wiatr/`
przeniesiony do `norma-PN-EN-1991-1-4/` (PDF, `01-tresc-ocr.txt`; dawny `00-INDEKS.md` dopisany bez
skrótów jako sekcja „Pełny tekst normy”). Wybrano ten folder, bo wskazują go kod (`eurokod-1/wiatr.ts`)
i D26/D27. Starsze wpisy z nazwą `…-wiatr/` zostawione jako historia (z dopiskiem w README źródeł).
Uwaga: PDF normy jest teraz w publicznym repo — sprawa licencji rozstrzygnięta wcześniej przez
właściciela (wpis „Licencje norm…”), nie wracać.

Szczegóły per plik: sekcje „Weryfikacja OCR (25.09.2026)” w `00-INDEKS.md` każdego folderu paczki.

## Synchronizacja ze standardem — Y.6 na polecenie właściciela (26.09.2026, ok. 04:00 UTC)

Świeży płytki klon `new-app-standards` (`aaabc19`, 25.09 23:16). `AKTUALIZACJE.md` — nowy wiersz 2026-09-25
(blok U.4: zero-waste ×7, ten projekt ×3). **Zastosowane wg Y.8:**
- *NIETYKALNE (pełny nadpis):* GOD BOOK `v2_38.md`→`v2_39.md` (B.5 — do startu aplikacji wszystkie oryginały
  w `docs/zrodla/`, po starcie do `new-app-standards`; N.1 — kompletność źródło→rejestr liczona mechanicznie),
  `docs/standards/` 00-INDEKS, 00-filozofia, 05, 08, 10, 11, 14, 16; `PROMPT_STARTOWY.md`. Pozostałe rozdziały
  i `docs/przyklady/i18n/*` — identyczne (`diff -rq`).
- *ADAPTOWALNE (patch odsyłaczy v2_38→v2_39):* `CLAUDE.md`, `.claude/skills/standards/SKILL.md`, `00_Biblia.md`,
  `01_Zasady_Pracy_i_Konwencje.md`, `README.md`, nagłówek `docs/lista-do-zrobienia.md` (wpisy historyczne
  i `rejestr-decyzji.md` bez zmian — C.5).
- *LOKALNE:* `docs/wklad-do-standardu.md` — 3 wpisy z 25.09 oznaczone ✅ skonsolidowane (N.1/14.1, B.5, 8.10).
- **Y.2 (dryf kodu od nowej reguły 8.10, naprawiony od razu):** `Pole`/`PoleSelect` budowały `id` z etykiety →
  teraz `useId()`, jawne `id` nadal ma pierwszeństwo. Nikt nie odwoływał się do starych `id` `pole-*` (grep).
- **Uwaga B.5:** reguła mówi „do startu aplikacji wszystkie oryginały w repo” — PDF PN-EN 1991-1-4 trzymany poza
  repo (plan B z 25.09) *może* teraz trafić do `docs/zrodla/` (sformułowanie `AKTUALIZACJE.md`: „może”).
  Decyzja właściciela — oryginału i tak nie ma w tej sesji.
- **Nowe reguły do przeglądu przy okazji (nie w tym zadaniu):** 10.9 (e2e na buildzie produkcyjnym — oględziny
  tej sesji już tak robione), 16.8 (rozruch aplikacji niezależny od języka).
- Cykl adaptacyjny: znaleziono nowość → `interwał_h = 12`, `licznik_zero_z_rzedu = 0`; Routine przestawiona na +12 h.

## Balast projektowy PN-EN 1990 (M3/E9, E2, E6) — D29 (26.09.2026)

- Wspólny `lib/core/modules/pv/eurokod-0/rownowaga.ts`: EQU (6.7), Tablica A1.2(A) — `γG,inf = 0,90`, `γQ,1 = 1,50`,
  NB „bez zmian krajowych”. **Wartości zweryfikowane wizualnie** (PyMuPDF → PNG, strony PDF 34, 40, 41, 71), nie
  tylko z OCR. `poppler`/`pdftoppm` w kontenerze brak — `pip install pymupdf` działa (Read na PDF wymaga pdftoppm).
- `m = γQ·Fw/(γG,inf·g)` = 1,667 × dawne `Fw/g`. Ciężar paneli/stelaża pominięty (po stronie bezpiecznej), cała
  siła jako pionowa. Przesuw/wywracanie — nadal nie (brak μ i punktu przyłożenia) → `ZS-BALAST-EQU-TYLKO-ODRYWANIE`
  (`warning`) zastąpił `ZS-BALAST-BEZ-WSPOLCZYNNIKOW` (klucz usunięty ze słowników).
- E6: balast z `F = 0,5ρv²ACd` (info: tylko dla szczytowego porywu, tor normowy w E2/E9) + opcjonalny „planowany
  balast” → twardy stop `NW-BALAST-NIEWYSTARCZAJACY` (źródło, lista twardych stopów M3) — dopisany do rejestru.
  Stary draft E6 bez nowego pola: `stan.balastPlanowanyKg ?? ""` (`usePersistedDraft` nie scala z wartościami
  początkowymi — pułapka przy dodawaniu pola do istniejącego szkicu).
- **Pułapka (złapana przez test):** wartość referencyjną wpisałem z pamięci zamiast skopiować wynik Pythona
  (169,947 vs 169,953) — test to wychwycił. Liczby referencyjne zawsze kopiować z wydruku skryptu.
- **28.09.2026 — masa paneli+stelaża (decyzja właściciela):** `balastProjektowyEquKg(F, g, G = 0)` →
  `max(0, γQ·F/(γG,inf·g) − G)`; równoważne `γG,inf·(G + m)·g ≥ γQ·F`. Wynik = balast **dodatkowy** (clamp 0).
  W E2/regulowany `max_miesięcy(m) − G` = `max_miesięcy(m − G)` (ta sama stała). Pole `masaPaneliStelazaKg`
  (`null` = pominięta → założenie `ZS-ZALOZENIE-MASA-WLASNA-POMINIETA`), wspólny helper
  `zloty-srodek/zalozenia.ts`. Stare szkice: `?? ""` przy odczycie (ta sama pułapka co wyżej).

## M6/E1 „Straty ciepła budynku” (dawne 5.1) — 26.09.2026

- Źródło opisuje silnik fizycznie („z różnicy temperatur i współczynników U, dla każdego miesiąca”) — zbudowane
  bez PN-EN 12831-1 (jej w repo nie ma; Purmo to poradnik z zastrzeżeniem „nie zastępuje normy”). θe stref I–V
  (−16…−24 °C) z **dwóch zgodnych źródeł**: PN-82/B-02403 Tablica 1 i Purmo Tabela 2.1 (zał. krajowy PN-EN 12831).
- `wspolczynnikStratWentylacyjnychWK` wyekstrahowany z M6/E12 (echo). Przegroda „inna” (grunt, nieogrzewane)
  wymaga temperatury — bez niej INCOMPLETE, nigdy ciche „powietrze zewnętrzne” (pierwsza wersja UI podsuwała
  `NaN` — odrzucone, rozróżnienie `zewnetrzna` przeniesione do domeny).
- Przykład źródła: 8 kW × 24 h = 192 kWh ✓; „COP 3 → 60 kWh” to 64 kWh — rozbieżność przykładu (Dyrektywa #5).
- **Zapis PVGIS TMY nie przechowuje temperatur** (tylko promieniowanie) — miesiące E1 z temperatur wpisanych
  ręcznie; automatyczne wypełnienie wymaga zmiany schematu zapisu (zadanie na liście).
- Rejestr M6 Część 1: 15 brakujących wierszy dodanych (20/20) — N.1. Część 2 (74 funkcje) — zadanie na liście.
- **Oględziny:** headless Chromium domyślnie `en-US` → teksty założeń po angielsku; z `locale: "pl-PL"` poprawnie.
  Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (115) / test 1362/1362 / build / audit:gate; `next start`
  + Playwright 390 px: 6 tras, brak `⚠ [klucz]`, brak zduplikowanych `id`, brak poziomego przewijania; 404 tylko
  `/_vercel/insights`. E1: 3 przegrody + wentylacja = 4,8 kW (ręcznie: 2800 + 2010 W ✓).

## N.1 dla pozostałych modułów + M6/E2, E7 + temperatury PVGIS + separator dziesiętny (26.09.2026)

- **N.1 mechanicznie:** `pnpm audit:n1` (`scripts/audit-n1-rejestr.mjs`) — zbiera `(dawne X.Y)` z sekcji modułu w Biblii,
  rozwija zakresy („8.23-28”, „8.29–8.36”) i listy („8.17,18,19”), porównuje z rejestrem i z plikiem `Tresc_*`. Wynik: 579/579.
  **Pułapka regexu (złapana):** lista po przecinku „8.2, 8.10” łapała „8” z następnego ID jako element listy — elementy listy
  muszą mieć `(?![\d.])`. Plik `Tresc_Modul_12` nie ma dawnego 8.8 (PWM vs MPPT, ekran i tak `done` z Biblii).
- **M6/E2:** C.O. z miesięcy E1 (średnia doba miesiąca), C.W.U. z `WSPOLCZYNNIK_KWH_NA_L_K` (`bojler-cwu`). Szkic E1 odczytywany
  przez `lib/ogrzewanie/draft-obciazenia-cieplnego.ts` (wydzielone z `page.tsx` — Next nie pozwala eksportować z pliku strony
  innych nazw). 50 l/osobę jako widoczna wartość startowa (źródło podaje liczbę, nie zakres).
- **M6/E7 — decyzja do potwierdzenia przez właściciela (✅🤖):** lista zadań zakładała „wymaga PN-EN ISO 14683 / 12831-1”.
  Zbudowane bez nich: Ψ wpisuje użytkownik (jak U w E1), wzór H = Σ Ψ·l z PN-EN 12831 (3.4) zweryfikowany w Purmo. Norma byłaby
  potrzebna tylko do *podpowiadania* Ψ (tablice) lub metody uproszczonej ΔU_tb. Jeśli właściciel woli czekać na normę — ekran
  zostaje, zmienia się tylko status. Ważne merytorycznie: Ψ zależy od konwencji wymiarów (zewnętrzne → narożniki ujemne) —
  założenie `MT-ZALOZENIE-WYMIARY`.
- **Temperatury PVGIS:** `T2m` było w odpowiedzi PVGIS od początku, adapter je pomijał. Teraz `temperaturyMiesieczneC` (miesiąc ze
  znacznika PVGIS, nie z czasu po offsecie). **`T2m` opcjonalne** — pierwsza wersja z polem wymaganym wysypała 8 testów narzędzi
  M1/M3 (atrapy PVGIS bez `T2m`); lepiej też produkcyjnie: brak temperatury nie może blokować nasłonecznienia. Średnie tylko przy
  komplecie 8760 godzin. Klucz zapisu bez zmian (`v1`), bez migracji — pole opcjonalne, ekran prosi o ponowne pobranie.
  Godzinowe temperatury NIE są zapisywane (tylko 12 średnich) — M7 (godziny poniżej progu) będzie wymagał rozszerzenia.
- **Separator dziesiętny:** `t()` zamienia „.”→„,” (PL/RU) w parametrach `number` i w tekstach będących w całości liczbą
  dziesiętną (`toFixed`); bez grupowania tysięcy i zaokrąglania. Teksty dla modelu AI (PL) też mają teraz przecinek.
- **Y.2 (naprawione od razu):** `ogrzewanie/obciazenie-cieplne` (E1) nie był na liście `check-i18n-guard` od budowy — dopisany.
- **Weryfikacja:** typecheck / lint (0 błędów, 2 ostrzeżenia `<img>` sprzed sesji) / i18n-guard (118) / test 1387/1387 / build /
  audit:gate / audit:n1. `next start` + Playwright 390 px, `pl-PL`, odpowiedź `/api/pvgis/tmy` podstawiona w przeglądarce (JRC
  zablokowane w kontenerze): E1 → wstaw temperatury → E2 (styczeń C.O. 70 kWh = 125,75 W/K × 23,2 K × 24 h ✓) → E7 (892 W =
  22,3 W/K × 40 K ✓); brak zduplikowanych `id`, poziomego przewijania, `⚠ [klucz]`; 404 tylko `/_vercel/insights`.

## Strażnik i18n — domknięcie migracji wszystkich modułów (26.09.2026)

- **Stan przed:** 39 modułów `lib/core/modules/*/*` (+5 podmodułów `wampiry-energetyczne/*`, których pierwszy skan nie
  widział) poza `MIGRATED_MODULES`. Z tego 9 było w pełni zmigrowanych (kody we wszystkich 3 słownikach), ale bez ochrony
  (`baterie/hierarchia-ladowania`, `napiecie-odciecia-a-zywotnosc`, `symulacja-ladowania-rozladowania`,
  `symulacja-miesiaca-zachmurzenia`, 5× wampiry), 10 to checklisty z pustymi `assumptions/warnings`, 13 zwracało gotowy tekst
  PL (14 miejsc), reszta to katalogi z samymi stałymi albo `eurokod-0/1` bez pliku silnika (strażnik nie ma czego sprawdzać).
- **Migracja 13:** 14 nowych kluczy PL/EN/RU, treść PL 1:1 z dotychczasowego tekstu. Tam, gdzie kod ostrzeżenia już
  istniał z innym tekstem, osobny klucz (`PORTECH-POJEMNOSC-NIEDODATNIA` ≠ `POJEMNOSC-NIEDODATNIA`;
  `KROK-POZA-KOLEJNOSCIA-ROZRUCH` — Black Start, `critical`, inny tekst niż `KROK-POZA-KOLEJNOSCIA`). Strony czytające
  `w.message` wprost → `w.message ?? t(w.i18nKey ?? w.code, w.params)`. **Pułapka:** `audyt-pozarowy/page.tsx` to Server
  Component — hook `useTranslate` tam nie działa; założenia przez kliencki `ZalozeniaLista` (ten sam wzorzec co `prognozy`).
  Ostrzeżenia audytu (`message` z szablonu z danymi `SAMPLE_AUDIT_ITEMS`) zostają — to dane demonstracyjne, nie tekst silnika,
  i strona ich nie wyświetla (pokazuje pozycje wprost z `SAMPLE_AUDIT_ITEMS`).
- **Luka strażnika (naprawiona):** nie widział `assumptions.push("…")` do lokalnej tablicy `string[]` — tak
  `porownanie-technologii` zwracał 2 polskie założenia. Dodana reguła AST dla `assumptions.push(literał|szablon)`.
- **Kompletność listy mechanicznie:** strażnik kończy się błędem, gdy katalog w `lib/core/modules` ma plik silnika
  (`calculator/warnings/validation.ts`), a nie ma go na liście — powtarzająca się luka (M6/E1 i 19 powyższych).
- **Weryfikacja:** typecheck / lint (0 błędów) / i18n-guard (150) / test 1387/1387 / build / audit:gate / audit:n1;
  `next start` + Playwright 390 px `pl-PL`: Black Start, demontaż ołów, połączenia elektryczne (krok poza kolejnością),
  porównanie technologii (0 i puste pole), audyt, prognozy, komunikacja BMS („inny”) — teksty widoczne, bez surowych kluczy.

## Resynchronizacja mapy wdrożenia + zduplikowane `id` (26.09.2026)

- **Zduplikowane `id`:** zadanie z 25.09 było już rozwiązane u źródła (`useId()` w `Pole`/`PoleSelect`, commit `f475302`),
  tylko wpis na liście nie dostał domknięcia. Potwierdzone skanem wszystkich 160 tras (stan domyślny + po dodaniu pozycji).
- **Dryf kolumny statusu w rejestrze (pułapka):** 13 wierszy miało „→ done” tylko w notatce, a w kolumnie statusu nadal
  `todo`/`blocked` (11× M3 z 25.09 i moje E2/E7 z 26.09). Każde liczenie po kolumnie zaniżało postęp. Zasada: przy zmianie
  statusu poprawiać **kolumnę** (aktualny stan) i dopisywać datę w notatce (historia) — jak w wierszu M6/E1.
- **Metryka mapy zmieniona z „wierszy done” na „ekrany docelowe”:** rejestr ma duplikaty między sekcjami (wzorce A–H,
  „po jednym ekranie”), więc wiersze zawyżały wynik (163 wiersze = 153 ekrany + 3 dodatkowe + 7 duplikatów). Mianowniki
  z podsumowań `Tresc_*`; M6 = 48 (20 + 2A 1 + 2C 26 + 2D 1), M12 = 43 (42 z `Tresc` + dawne 8.8 z samej Biblii), M13 = 2.
  Surowe liczenie: `pnpm rejestr:licz [moduł]` (`scripts/policz-rejestr.mjs`) — duplikaty i mianowniki nadal ręcznie.

## M6/E10 — Optymalizacja izolacji (26.09.2026)

- **Bez normy:** Rsi/Rse (PN-EN ISO 6946) nie są w repo, ale nie są potrzebne — dokładana warstwa jest oporem szeregowym,
  a 1/U obecnej przegrody już zawiera opory przejmowania: U' = 1/(1/U + d/λ). Pominięte łączniki mechaniczne i nieciągłości
  (założenie `IZOL-ZALOZENIE-WARSTWA-SZEREGOWA` — rzeczywiste U wyższe).
- **Oszczędność** z tego samego modelu miesięcznego co E1 (Σ max(0, θi − θm)·24·d); wymaga kompletu 12 miesięcy (część roku
  cicho zaniżałaby wynik → `INCOMPLETE`). Wynik w kWh ciepła, nie prądu (÷ COP — założenie).
- **🟡 „kolejny centymetr się nie zwraca”** — źródło nie daje progu; ocena tylko względem ceny ciepła wpisanej przez
  użytkownika (koszt krańcowy wariantu względem cieńszego wariantu tego samego materiału, tj. ta sama nazwa i λ).
- **Przykład źródła niespójny** (5000 zł / (300 kWh × 10 lat) = 1,67 zł/kWh, nie 0,20) — nieodtwarzany.
- **Pułapka testu przeglądarkowego:** `page.fill` na `input[type=number]` nie przyjmuje „0,5” (Playwright), w teście kropka.
- Następne w M6 wymagają decyzji: E8 (źródło: Σ m·c całego budynku; fizycznie pracuje warstwa wewnętrzna — PN-EN ISO 13786
  poza repo), E11 (🔴 „wysokie U i niskie g” bez progów liczbowych).

## M6/E8 — Pojemność cieplna budynku (26.09.2026)

- **Decyzja właściciela:** C = Σ ρ·A·d·c całych warstw (jak w źródle) + powietrze z kubatury E1, ze **stałym** ostrzeżeniem
  🟡 `POJC-CALA-MASA-ZAWYZA` (status zawsze `VALID_WITH_WARNINGS`): w dobowym wychładzaniu pracuje tylko warstwa wewnętrzna,
  więc τ i czas do zamarznięcia są zawyżone. PN-EN ISO 13786 właściciel dostarczy później — wtedy głębokość czynna
  (wpis 🔲 na liście).
- **Model:** jeden węzeł, C·dθ/dt = −H_zewn(θ − θe) − Σ H_j(θ − θj) → θ∞ = średnia ważona H, τ = C/H, wychładzanie
  wykładnicze. H z E1: Σ U·A przegród zewnętrznych + H_V; przegrody do gruntu/stref nieogrzewanych z ich stałą temperaturą.
- **Dane materiałowe** (ρ, c) tylko od użytkownika — źródło mówi „auto z Modułu 1”, ale M1 nie ma materiałów; brak tabeli
  w repo (nie wymyślane). Zakres sanity c 100–5000 J/(kg·K) łapie wpis w kJ.
- 🟡 źródła „podłogówka przy dużej bezwładności” bez progu — niewyzwalane; przykład C (18 kWh/K → 1 °C w 4 h) bez H i ΔT —
  nieodtwarzalny.
- **E11 odłożony** decyzją właściciela (progi 🔴 poda później).

## Moduł 11 (Montaż baterii) — opisy narzędzi AI, 20/20 kalkulatorów (26.09.2026)

- **Zakres.** Backlog z wpisu 20.09.2026 ("116 z 122 kalkulatorów bez opisu narzędzia AI",
  kolejność rolloutu 11→3→4→2→reszta) — Moduł 11 zamknięty jako pierwszy. Dodano 20 plików
  `lib/ai/tools/*-tool.ts` (Ścieżka A LiFePO4: 10, Ścieżka B kwasowo-ołowiowa: 10) i
  zarejestrowano w `lib/ai/pytaj-asystenta.ts` (import + tablica `NARZEDZIA`).
- **Rozbieżność liczby ekranów vs kalkulatorów (wyjaśniona, nie błąd):** Moduł 11 ma 23 ekrany
  (`docs/rejestr-pokrycia.md`), ale tylko 20 ma realny `calculator.ts` — trzy ekrany (A10
  `przechowywanie-recykling`, B11 `ratowanie-zasiarczenia`, B12 `przechowywanie-recykling-olow`)
  to Wzorzec C (czysta treść, bez funkcji liczącej, żadnego pola do zwalidowania) — świadomie
  pominięte w tym rollout-cie: rozdział 9 dotyczy narzędzi zwracających policzony wynik, a tu nie
  ma nic do policzenia (nie jest to luka wymagająca dopisania, tylko naturalna granica zakresu 9.3).
  Ekran B5 (`dobor-kabli-bezpiecznikow-olow`) ma osobne narzędzie, mimo że jest wzorcem "echo"
  Modułu 5 — wywołuje realną logikę domenową (`calculateDoborPrzekrojuKabla` +
  `calculateDoborBezpiecznikaRozlacznika`), więc kwalifikuje się jak każdy inny kalkulator.
- **Wzorzec 1:1 z istniejącymi narzędziami** (`pojemnosc-cieplna-tool.ts`, `mostki-termiczne-tool.ts`,
  `zloty-srodek-tool.ts`): `operationType: 'read'`, `requiresConfirmation: false`, handler zawsze
  deleguje do prawdziwego `calculateXxx` z `lib/core/modules/montaz-baterii/**`, ostrzeżenia/
  założenia przez `tekstyOstrzezen`/`tekstyZalozen` (i18n → PL). Dane bezpieczeństwa (napięcia
  ogniw, napięcie pakietu, gęstość elektrolitu, prąd zwarciowy, AIC bezpiecznika, docisk, rezystor
  pre-charge) opisane w `.describe()` jako "tylko od usera, nie zgaduj" — zgodnie z 9.1/9.2.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, 2 istniejące wcześniej
  ostrzeżenia `no-img-element` niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 3.

## Moduł 3 (Instalacja PV) — opisy narzędzi AI, 12 nowych + 13 już istniejących (26.09.2026)

- **Zakres.** Kolejny krok rolloutu 11→3→4→2→reszta. Z 24 podkatalogów `lib/core/modules/pv/*` z
  realnym `calculator.ts`, 13 miało już narzędzie AI działające na prawdziwym `calculateXxx` tego
  ekranu (`kat-i-azymut`, `liczba-paneli`, `mikroinwertery-vs-centralny`, `mikropekniecia-termiczne`,
  `powloki-antyrefleksyjne`, `technologie-paneli`, `tracker-vs-staly`, `typ-montazu`,
  `warunki-nadmorskie-pyliste`, `wschod-zachod`, `zloty-srodek` — kilka z nich zarejestrowanych pod
  nazwą narzędzia z innego ekranu, np. `zloty-srodek-tool.ts` i `typ-montazu-tool.ts` importują też
  `eurokod-1/wiatr`, ale wywołują właściwe `calculateZlotySrodek`/`calculateDachPlaski` itd. —
  zweryfikowane treścią pliku, nie samą nazwą, jak w zadaniu). Dodano 12 nowych plików
  `lib/ai/tools/*-tool.ts`: `dopasowanie-tablicy-falownika`, `konfigurator-stringow`,
  `napor-wiatru`, `niedopasowanie-paneli`, `ochrona-stringow`, `panele-bifacjalne`, `ryzyko-pid`,
  `straty-okablowanie-dc`, `straty-zlaczki-mc4`, `stress-test-mppt`, `wplyw-temperatury`,
  `zacienienie-diody-bocznikujace` — zarejestrowane w `lib/ai/pytaj-asystenta.ts`.
- **Świadomie pominięty: `czystosc-i-snieg`.** Dane katalogowe (i18n modelu tekstowego wprost w
  polu, nie prosty `i18nKey`/`params`), tak samo jak `baterie/komunikacja-bms` i
  `baterie/porownanie-technologii` — udokumentowane jako poza zakresem migracji i18n już we
  wpisach z 19–26.09.2026 wyżej w tym pliku i w `docs/lista-do-zrobienia.md`; ten sam powód
  wyklucza go z tego rolloutu narzędzi AI (opisy narzędzia i tak musiałyby wyciągać gotowy tekst PL
  bez klucza i18n, co nie jest błędem tego ekranu, tylko jego świadomym stanem przejściowym).
  `eurokod-0`, `eurokod-1`, `typ-montazu` (ten ostatni ma już narzędzie, patrz wyżej) nie mają
  własnego `calculator.ts` — to funkcje pomocnicze/warianty wzorca reużywane przez inne ekrany, nie
  osobne ekrany kwalifikujące się do tego rolloutu wg treści zadania.
- **Wzorzec 1:1** z Modułu 11 (`montaz-mechaniczny-tool.ts` itd.): `operationType: 'read'`,
  `requiresConfirmation: false`, handler zawsze deleguje do prawdziwego `calculateXxx` z
  `lib/core/modules/pv/**`, ostrzeżenia/założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane
  bezpieczeństwa/katalogowe (Voc/Vmp/Imp, β, Tmin, Isc, I_MOD_MAX_OCPR, rezystancja złączki/kabla,
  prędkość wiatru, procent uzysku bifacjalnego) opisane w `.describe()` jako dane usera, nie do
  zgadywania. `konfigurator-stringow-tool.ts` używa `z.discriminatedUnion` (wejście kalkulatora to
  unia trzech trybów: szereg/równolegle/mieszany). `straty-zlaczki-mc4-tool.ts` ma osobną nazwę
  narzędzia (`policz_straty_na_zlaczkach_mc4`) niż istniejący `zlacza-mc4-tool.ts` — to dwa różne
  kalkulatory w dwóch różnych modułach (`pv/straty-zlaczki-mc4` vs `okablowanie/zlacza-mc4`), nie
  duplikat.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
  ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 4.

## Moduł 4 (Magazyn energii / baterie) — opisy narzędzi AI (26.09.2026)

- Kontekst: rollout opisów narzędzi AI wg kolejności 11→3→4→2→reszta (wpis 20.09.2026). Moduł 4
  (`lib/core/modules/baterie/`) miał 0 istniejących narzędzi AI przed tą sesją (sprawdzone grep-em
  po treści importu `calculateXxx` z `modules/baterie`, nie tylko po nazwie pliku) — cały rollout
  tego modułu to nowe pliki.
- **32 podkatalogi w `lib/core/modules/baterie/`, z czego 29 dostało nowe narzędzie AI**:
  `chlodzenie-latem`, `cold-c-rate`, `cold-cranking-amps`, `detekcja-doziemienia`,
  `detekcja-zwarcia-efuse`, `dobor-bezpiecznika-dc`, `dobor-pojemnosci`, `grzalki-bms-mroz`,
  `hierarchia-ladowania`, `kalibracja-soc`, `koniec-ladowania`, `long-term-storage`,
  `mixing-rownolegle`, `modul-ev`, `moment-dokrecania-srub`, `napiecie-odciecia-a-zywotnosc`,
  `obwod-precharge`, `ochrona-wilgoc`, `oplacalnosc-magazynu`, `pobor-wlasny-bms`,
  `pozycjonowanie-ogniw`, `second-life`, `slabe-ogniwo`, `soh-per-ogniwo`,
  `starzenie-degradacja`, `symulacja-ladowania-rozladowania`, `symulacja-miesiaca-zachmurzenia`,
  `szyny-zbiorcze-miedzypakietowe`, `topologia-bms`, `vehicle-to-home`.
- **Pominięte (3):**
  - `matryca-alarmow-bms` — brak `calculator.ts` (Wzorzec C, czysta treść) — poza zakresem zadania.
  - `komunikacja-bms`, `porownanie-technologii` — dane katalogowe/nie-i18n, świadomie wyłączone z
    tego samego powodu co analogiczne wyłączenia z i18n (wpisy 19–26.09.2026 wyżej w tym pliku).
- **Zatrzymane na jednym pliku, do zrobienia osobno — `napiecie-systemowe` (Ekran 2):** kalkulator
  wielo-etapowy (Etapy A–H materiału źródłowego "Dobór napięcia systemu Off-Grid v3.0") — kreator
  odbiorników z analizą jednoczesności, echo doboru przekroju kabla z `okablowanie/dobor-przekroju-
  kabla` (typy `Material`/`SposobUlozenia`), trzy równoległe kosztorysy 12/24/48V z kilkunastoma
  cenami edytowalnymi, pułapka konwersji 24V→48V. Kształt wejścia/wyjścia jest znacznie bardziej
  złożony i zależny od typów innych modułów niż reszta wzorca Modułu 4 — zmapowanie 1:1 bez ryzyka
  pomyłki w danych elektrycznych/kosztorysowych wymaga osobnej, dedykowanej sesji, nie tego
  rollout-u. Zgodnie z zasadą zadania („jeśli kształt jest niejasny — zatrzymaj się na tym jednym
  pliku, opisz problem, idź dalej”) — reszta modułu zbudowana, ten jeden ekran czeka.
- **4 ekrany wcześniej opisywane w zadaniu jako „blocked/todo, cross-modułowe” — okazały się mieć
  już działający `calculator.ts`:** Symulacja czasu ładowania/rozładowania
  (`symulacja-ladowania-rozladowania`), Napięcie odcięcia a żywotność
  (`napiecie-odciecia-a-zywotnosc`), Hierarchia ładowania (`hierarchia-ladowania`), Symulacja
  miesiąca zachmurzenia (`symulacja-miesiaca-zachmurzenia`) — wszystkie cztery mają pełny, działający
  kalkulator (uproszczony wg deklaracji w komentarzach nagłówkowych, np. średnie moce zamiast
  pełnego profilu godzinowego z niebudowanych jeszcze Modułu 2/3, ale w pełni obliczalny z danych
  wejściowych usera). Zgodnie z dosłownym brzmieniem zadania („pomiń TYLKO jeśli nie mają jeszcze
  `calculator.ts`”) — zbudowane razem z resztą modułu, nie pominięte.
- **Wzorzec 1:1** z Modułów 11/3: `operationType: 'read'`, `requiresConfirmation: false`, handler
  zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/baterie/**`, ostrzeżenia/
  założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane bezpieczeństwa (napięcia/prądy/rezystancje
  zmierzone, temperatury ogniw, AIC bezpiecznika, zdolność łączeniowa tranzystorów BMS, obecność
  zabezpieczeń przed doziemieniem) opisane w `.describe()` jako dane WYŁĄCZNIE od usera/pomiaru/BMS
  — model nigdy ich nie zgaduje. `hierarchia-ladowania-tool.ts` i `moment-dokrecania-srub-tool.ts`
  mają kalkulatory bez `unit`/liczbowego wzoru (klasyfikator dyskretny / checklista) — output nadal
  pełny `CalcResult` (status, ew. ostrzeżenia/założenia), zgodnie z kontraktem.
- **Weryfikacja:** `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
  ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
  `pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).
- **Następny w kolejności rolloutu:** Moduł 2. `napiecie-systemowe` (Ekran 2, Moduł 4) zostaje jako
  jawny dług do domknięcia osobno.

## Moduł 2 (Zapotrzebowanie) — opisy narzędzi AI (26.09.2026)

Kolejność rolloutu 11→3→4→2→reszta (wpisy 20–26.09.2026 wyżej): po Module 4 zrobiony Moduł 2
(Zapotrzebowanie energetyczne). 16 z 17 podkatalogów `lib/core/modules/zapotrzebowanie/*` miało
`calculator.ts` — dla wszystkich 16 zbudowano nowe narzędzie AI (`lib/ai/tools/*-tool.ts`), żaden
ekran Modułu 2 nie miał wcześniej narzędzia (jedyny istniejący plik referencyjny modułu,
`kalkulatory-pomocnicze-tool.ts`, powstał w sesji pilotażowej i18n, nie w tym rolloucie):
`systemy-podtrzymania-zycia` (Ekran 1), `urzadzenia-zmienne` (Ekran 3), `liczba-domownikow`
(Ekran 4), `profil-astronomiczny` (Ekran 5, tylko część astronomiczna — profil godzinowy
świadomie nie zbudowany, patrz komentarz w `input.ts`), `sezonowosc` (Ekran 6), `dni-autonomii`
(Ekran 7), `moc-pozorna-cosfi` (Ekran 8, podpunkt 1 — prądy rozruchowe/współczynnik jednoczesności
poza zakresem), `pobor-wlasny-falownika` (Ekran 9), `sprawnosc-inwertera-niskie-obciazenie`
(Ekran 10), `przetwornice-dcdc` (Ekran 11), `load-shedding` (Ekran 12), `bufor-rozbudowe`
(Ekran 13), `architektura-fazowa` (Ekran 14 — bez werdyktu ok/uwaga, źródło nie podaje progu
liczbowego, opisane w `.description`), `kategorie-specjalne` (Ekran 15), `agregat-pradotworczy`
(Ekran 17), `bojler-cwu` (Ekran 2).

**Świadomie pominięty: cały `wampiry-energetyczne/`** (5 podmodułów: `automatyzacja`,
`katalog-urzadzen`, `pomiar-mocy-jalowej`, `rekomendacje-sprzetowe`, `symulacje-i-raporty` —
wszystkie mają `calculator.ts`) — zgodnie z jawnym poleceniem zadania: to osobna, znacznie
większa sesja (24 funkcje wg backlogu), nie rollout narzędzi AI dla prostego wzorca reszty
Modułu 2. Sprawdzony wpis z 19.09.2026 potwierdza, że to świadomie odłożony moduł zbiorczy — nie
odblokowany do dziś, więc pominięty w całości bez próby zmapowania.

Wzorzec 1:1 z Modułów 11/3/4: `operationType: 'read'`, `requiresConfirmation: false`, handler
zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/zapotrzebowanie/**`, ostrzeżenia/
założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane, które źródło świadomie nie podaje jako
wartość domyślną (ΔT bojlera C.W.U., cos φ, sprawność przetwornicy/falownika/inwertera, granice
sezonu, moc "ogrzewanie" w Survival Core) opisane w `.describe()` jako WYŁĄCZNIE od usera — model
nigdy ich nie zgaduje. `dni-autonomii-tool.ts` i `profil-astronomiczny-tool.ts` mają pola opcjonalne
(wzorzec "echo"/podgląd) mapowane na `0`/`false` w handlerze, zgodnie z konwencją "0 = pominięte"
tych kalkulatorów.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
`pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK).

**Następny w kolejności rolloutu:** reszta modułów spoza 11/3/4/2 wg backlogu. `napiecie-systemowe`
(Ekran 2, Moduł 4) i cały `wampiry-energetyczne` (Moduł 2) zostają jako jawny dług do domknięcia
osobno.

## Moduł 5 (Okablowanie) — opisy narzędzi AI (26.09.2026)

Pierwszy z "reszty" modułów po zakończeniu kolejki 11→3→4→2 (wpis wyżej). `lib/core/modules/okablowanie/`
ma 25 podkatalogów z `calculator.ts` (0 podkatalogów Wzorca C/informacyjnych bez `calculator.ts` w
tym module — inaczej niż sugerował ogólny backlog "reszty", tu wszystkie 25 ekranów mają jądro
obliczeniowe). 5 z 25 już miało narzędzie AI z wcześniejszych sesji (`zlacza-mc4`,
`przepust-powietrza`, `projekt-uziemienia`, `monitorowanie-izolacji-imd`, `normy-i-certyfikaty`) —
sprawdzone przez faktyczny import `calculateXxx` w treści pliku narzędzia, nie tylko po nazwie
(dwa inne pliki, `straty-zlaczki-mc4-tool.ts` i `sekwencja-montazu-tool.ts`, tylko wspominają
"okablowanie" w komentarzu/nazwie pola — nie importują niczego z tego modułu, sprawdzone i
odrzucone). Dla pozostałych 20 zbudowano nowe narzędzia (`lib/ai/tools/*-tool.ts`):
`analiza-zwarciowa` (Ekran 12), `dobor-bezpiecznika-rozlacznika` (Ekran 6), `dobor-izolacji-kabla`
(Ekran 28), `dobor-mocy-falownika` (Ekran 7), `dobor-przekroju-kabla` (Ekran 1, mega-Doradca z
tabelami PN-HD 60364-5-52), `glowna-szyna-wyrownawcza` (Ekran 10), `laczenie-cu-al` (Ekran 4),
`ochrona-odwrotna-polaryzacja` (Ekran 15), `ochrona-przed-dotykiem` (Ekran 17),
`ochrona-przed-gryzoniami` (Ekran 25), `ochrona-przepieciowa-spd` (Ekran 2),
`optymalizacja-trasy-kabla` (Ekran 26, wzorzec echo — TCO liczony realnymi stratami z
`dobor-przekroju-kabla`, nie osobnym wzorem), `oznakowanie-obwodow` (Ekran 20),
`peszle-koryta-rurki` (Ekran 24), `pomiary-powykonawcze` (Ekran 29), `puszki-polaczeniowe`
(Ekran 27), `string-box` (Ekran 22), `szyny-zbiorcze-polaczenia` (Ekran 3, tylko dolna sekcja E —
checklist momentów dokręcania, górna sekcja D dobór przekroju szyny świadomie niezbudowana w
jądrze), `uziemienie-funkcjonalne-ochronne` (Ekran 11), `wylaczniki-nadpradowe-dc` (Ekran 14),
`wylaczniki-rcd` (Ekran 16).

Wzorzec 1:1 z Modułów 11/3/4/2: `operationType: 'read'`, `requiresConfirmation: false`, handler
zawsze deleguje do prawdziwego `calculateXxx` z `lib/core/modules/okablowanie/**`, ostrzeżenia/
założenia przez `tekstyOstrzezen`/`tekstyZalozen`. Dane wysokiego ryzyka elektrycznego (napięcie/
rezystancja wewnętrzna baterii, Isc panelu, prąd zwarciowy, AIC zabezpieczeń, Voc zimowe stringu,
rezystancje/czasy zmierzone przy odbiorze) opisane w `.describe()` jako pochodzące WYŁĄCZNIE z
karty katalogowej/pomiaru/projektu instalacji — model nigdy ich nie zgaduje. Kalkulatory typu
checklist (`glowna-szyna-wyrownawcza`, `ochrona-przed-dotykiem`, `oznakowanie-obwodow`,
`szyny-zbiorcze-polaczenia`) i klasyfikatory bez wzoru liczbowego (`ochrona-odwrotna-polaryzacja`,
`ochrona-przed-gryzoniami`, `ochrona-przepieciowa-spd`, `peszle-koryta-rurki`,
`puszki-polaczeniowe`, `uziemienie-funkcjonalne-ochronne`, `wylaczniki-nadpradowe-dc`) mają
uproszczony output (bez pól, których źródłowy `calculator.ts` też nie ma), zgodnie z kontraktem
`AiToolDefinition` — nadal pełny status/ostrzeżenia gdzie kalkulator je zwraca.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (0 błędów, te same 2 istniejące wcześniej
ostrzeżenia `no-img-element`, niezwiązane ze zmianą), `pnpm check:i18n-guard` (OK, 152 moduły),
`pnpm test` (170 plików, 1408 testów — wszystkie przeszły, zero regresji), `pnpm build` (OK),
`pnpm audit:gate` (OK, brak podatności high/critical).

**Następny w kolejności rolloutu:** Moduł 1 (Lokalizacja).

## Rollout opisów narzędzi AI — Moduł 1 (Lokalizacja), 26.09.2026

Sprawdzono `lib/core/modules/lokalizacja/*` (5 podkatalogów). Wynik: **0 nowych plików** —
Moduł 1 jest już w pełni pokryty albo świadomie poza zakresem, bez potrzeby żadnej zmiany kodu.

- `skaner-dzialki`, `analiza-zacienienia`, `orientacja-powierzchni` — narzędzia AI już istniały
  z sesji 24.09.2026 (`lib/ai/tools/skaner-dzialki-tool.ts`, `analiza-zacienienia-tool.ts`,
  `orientacja-powierzchni-tool.ts`), zweryfikowane treścią (realny import `calculateXxx` z
  odpowiedniego `calculator.ts`) i już zarejestrowane w `NARZEDZIA` (`lib/ai/pytaj-asystenta.ts`).
  Wzorzec 1:1 z resztą rolloutu, `analiza-zacienienia`/`orientacja-powierzchni` poprawnie
  pobierają 8760 rekordów PVGIS TMY po stronie serwera (handler), model dostaje tylko
  podsumowanie — nie zmieniano tego wzorca.
- `lokalizacja-i-klimat` (Ekran 1, "GPS i dane klimatyczne") — ma `calculator.ts`, ale bez
  jądra obliczeniowego: to ekran czysto infrastrukturalny (zapis współrzędnych/temperatury
  minimalnej wpisanych ręcznie przez użytkownika, `status: zapisano: boolean`, sam plik mówi
  wprost "Bez silnika obliczeniowego"). Świadomie pominięty — narzędzie AI nie miałoby nic do
  policzenia (user i tak podaje gotowe liczby), a 9.1–9.3 dotyczy sytuacji, gdy model inaczej
  policzyłby sam; tu nie ma nic do liczenia.
- `geometria-slonca` (`pozycja-slonca.ts`) — potwierdzone `grep`: to wewnętrzna biblioteka
  matematyczna (pozycja Słońca), reużywana przez `analiza-zacienienia`, `orientacja-powierzchni`
  i Moduł 3 (`wschod-zachod`, `kat-i-azymut`) — bez własnego ekranu/UI z sensownym wejściem od
  usera. Pominięta jako funkcja pomocnicza, nie osobny "ekran"; jej logika jest już pośrednio
  dostępna przez narzędzia AI modułów, które z niej korzystają.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170
plików, 1408 testów, zero regresji), `pnpm build` (OK).

**Następny w kolejności: Moduł 6 (Ogrzewanie).**

## Rollout opisów narzędzi AI — Moduł 6 (Ogrzewanie), 26.09.2026

Sprawdzono `lib/core/modules/ogrzewanie/*` (15 podkatalogów). 6 ekranów (`koszty-ogrzewania`,
`obciazenie-cieplne`, `zapotrzebowanie-co-cwu`, `mostki-termiczne`, `optymalizacja-izolacji`,
`pojemnosc-cieplna`) już miało narzędzie AI z sesji 26.09.2026, zweryfikowane realnym importem
`calculateXxx` w `lib/ai/tools/*-tool.ts` i obecnością w `NARZEDZIA` (`lib/ai/pytaj-asystenta.ts`)
— pominięte, nie duplikowane.

**7 nowych plików `lib/ai/tools/*-tool.ts` zbudowanych od zera** (wzorzec 1:1 z
`mostki-termiczne-tool.ts`/`pojemnosc-cieplna-tool.ts`), zarejestrowane w `NARZEDZIA`:
`bufor-ciepla-tool`, `cop-pompy-ciepla-tool`, `infiltracja-powietrza-tool`,
`kociol-elektryczny-tool`, `pompy-cyrkulacyjne-tool`, `ryzyko-niskiego-napiecia-tool`,
`wentylacja-odzysk-ciepla-tool`.

**Pominięte (2, brak `calculator.ts` — Wzorzec C, czysta treść):** `halas-i-wibracje` (tylko
`constants.ts`), `ryzyko-zamarzniecia-dolnego-zrodla` (tylko `constants.ts`).

Uwagi merytoryczne per narzędzie (żeby nie zgadywać przy przyszłej rozbudowie):
- `infiltracja-powietrza-tool` — liczy tylko podstawową fizykę strat wentylacyjnych (Q =
  n·V·ρ·cp·ΔT/3600); poprawa "8% po uszczelnieniu" z przykładu źródła świadomie NIE jest w
  `calculator.ts`, więc narzędzie też jej nie liczy — zgodnie z zadaniem "buduj narzędzie dla
  tego, co realnie liczy dzisiejszy calculator.ts".
- `wentylacja-odzysk-ciepla-tool` — analogicznie: tylko podstawowy bilans cieplno-elektryczny
  (E3), bez projektu strumieni per pomieszczenie (dawne 5.23) i bez logiki bypassu letniego
  (dawne 5.24) — obie świadomie poza `calculator.ts` (brak wzoru w źródle).
- `ryzyko-niskiego-napiecia-tool` — napięcie systemu off-grid jest polem ręcznego wpisu (nie
  wyprowadzanym z SoC baterii), bo krzywa rozładowania jest specyficzna dla producenta ogniw i
  nie ma jej w aplikacji — `.describe()` to podkreśla.
- `bufor-ciepla-tool`, `cop-pompy-ciepla-tool`, `kociol-elektryczny-tool`,
  `pompy-cyrkulacyjne-tool` — proste wzory jednorodne (mnożnik/dzielenie/różnica), bez pól
  specjalnych do odnotowania.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji — kalkulatory `lib/core/modules/ogrzewanie/**` nietknięte),
`pnpm build` (OK), `pnpm audit:gate` (OK, brak podatności high/critical).

**Następny w kolejności: Moduł 8 (Bezpieczeństwo).**

## Rollout opisów narzędzi AI — Moduł 8 (Bezpieczeństwo), 26.09.2026

Sprawdzono `lib/core/modules/bezpieczenstwo/*` — 3 podkatalogi, wszystkie z `calculator.ts`, żaden
nie miał wcześniej narzędzia AI (zweryfikowane brakiem importu z `modules/bezpieczenstwo/` w
`lib/ai/tools/*-tool.ts`). Zbudowane od zera i zarejestrowane w `NARZEDZIA`:
`ups-krytyczny-tool` (Ekran 6 — dobór sprzętowy UPS krytycznego, `calculateUpsKrytyczny`),
`dogrzewanie-paliwem-stalym-tool` (Ekran 2 — bezpieczeństwo pożarowe pieca/kotła na paliwo stałe,
`calculateDogrzewaniePaliwemStalym`), `audyt-pozarowy-tool` (Ekran 11 — podsumowanie audytu
pożarowego z listy pozycji, `calculateAuditPozarowy`).

Uwagi merytoryczne (dane wysokiego ryzyka bezpieczeństwa — dla przyszłej rozbudowy):
- `ups-krytyczny-tool` — moc każdego urządzenia krytycznego (`powerW`) oraz pojemność/napięcie
  akumulatora UPS muszą pochodzić wyłącznie od usera; `constants.ts` źródła jawnie mówi, że
  źródło NIE podaje mocy żadnego urządzenia z domyślnej listy — `.describe()` to podkreśla.
- `dogrzewanie-paliwem-stalym-tool` — `maNawiewPowietrzaDoSpalania` i `maCzujnikCo` to `boolean`
  bez wartości domyślnej „tak” w samym `input.ts` domeny; opis narzędzia dodatkowo zaznacza, że to
  dane bezpieczeństwa życia i nigdy nie wolno ich domyślnie zakładać jako `true`. Brak czujnika CO
  jest twardym stopem już w `warnings.ts` domeny — narzędzie tylko przekazuje ten wynik dalej.
- `audyt-pozarowy-tool` — `calculateAuditPozarowy` (Wzorzec G, ekran raportowy bez pól do
  wypełnienia) przyjmuje gotową listę pozycji ze statusem `ok`/`warning`/`critical`; opis narzędzia
  jasno mówi, że status musi pochodzić z realnej kontroli/odczytu czujnika, nie z domysłu modelu —
  narzędzie samo niczego nie "sprawdza", tylko liczy podsumowanie z dostarczonych danych.

Pominiętych 0 — wszystkie 3 podkatalogi Modułu 8 mają `calculator.ts`.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji), `pnpm build` (OK).

**Następny w kolejności: Moduł 9.**

## Rollout opisów narzędzi AI — Moduł 7 (stress-test)/9 (ESP32)/12 (mobilny), 26.09.2026 — ZAMYKA CAŁY ROLLOUT

Ostatnia część rolloutu "opisy narzędzi AI dla kalkulatorów" (backlog 20.09.2026, punkt 7).
Sprawdzone trzy pozostałe podkatalogi `lib/core/modules/*` bez wcześniejszego narzędzia
(zweryfikowane brakiem importu z ich ścieżek w `lib/ai/tools/*-tool.ts`): `stress-test/`
(`procedura-black-start`, `wind-chill`), `esp32/` (`katalog-czujnikow`), `kalkulator-mobilny/`
(`dobor-regulatora-pwm-mppt`, `tryb-uproszczony`). Wszystkie 5 miało `calculator.ts` — 5 nowych
plików `lib/ai/tools/*-tool.ts` zbudowanych od zera i zarejestrowanych w `NARZEDZIA`:

- `procedura-black-start-tool` — Ekran 5, M7. **Uwaga krytyczna:** `KROK-POZA-KOLEJNOSCIA` to
  twardy stop `level: "critical"` (decyzja właściciela 07.09.2026) — opis narzędzia i handler
  zwracają go z tą samą wagą co UI, bez łagodzenia. Wejście to wyłącznie lista ID kroków
  potwierdzonych przez usera.
- `wind-chill-tool` — Ekran 17, M7. Wzór NWS ważny tylko dla T ≤ 10°C i V > 4,8 km/h — poza
  zakresem `OUT_OF_SCOPE`, `.describe()` zaznacza, że temperatura/wiatr to dane z pomiaru
  lokalizacji usera, nie zgadywane.
- `katalog-czujnikow-tool` — M9/ESP32, Katalog 1. Wzorzec H (podsumowanie stanu katalogu, bez
  wzoru fizycznego) — lista instancji czujników (typ/etykieta/lokalizacja) wyłącznie od usera.
- `dobor-regulatora-pwm-mppt-tool` — M12. Reguła twarda: klasa napięciowa paneli > akumulatora →
  MPPT wymagany (nie tylko zalecany), PWM fizycznie nie zadziała — opis to podkreśla.
- `tryb-uproszczony-tool` — Ekran 1, M12. Czas teoretyczny (bez sprawności/DoD/temperatury) —
  `.describe()` jasno mówi, że to szybka orientacyjna odpowiedź trybu mobilnego, nie pełny proces
  projektowy.

Pominiętych 0 — wszystkie 5 kalkulatorów tej ostatniej partii miało `calculator.ts`. Poza tymi
trzema katalogami sprawdzono, że nie ma żadnych innych nietkniętych podkatalogów w
`lib/core/modules/` (wszystkie pozostałe: `baterie`, `bezpieczenstwo`, `lokalizacja`,
`montaz-baterii`, `ogrzewanie`, `okablowanie`, `pv`, `zapotrzebowanie` — zamknięte w poprzednich
sesjach rolloutu).

**Tym samym cały rollout "opisy narzędzi AI dla kalkulatorów" (backlog 20.09.2026, punkt 7) jest
zamknięty dla wszystkich `lib/core/modules/*`** — z wyjątkiem świadomie pominiętych w
poprzednich sesjach (Wzorzec C bez `calculator.ts`, dane katalogowe/nie-i18n, moduły
wielo-etapowe zbyt złożone do bezpiecznego mapowania 1:1, `wampiry-energetyczne` jako osobna
większa sesja) — pełna lista uzasadnień: wpisy tej sekcji `docs/memory.md` od Modułu 11 do
Modułu 8 wyżej.

Weryfikacja: `pnpm typecheck` (czysto), `pnpm lint` (te same 2 istniejące ostrzeżenia
`no-img-element`, niezwiązane), `pnpm check:i18n-guard` (OK, 152 moduły), `pnpm test` (170 plików,
1408 testów, zero regresji), `pnpm build` (OK).

## `napiecie-systemowe` — dług z Modułu 4 domknięty (26.09.2026)

Ekran 2, Moduł 4 (`lib/core/modules/baterie/napiecie-systemowe/`), świadomie pominięty przy
rollcie Modułu 4 (wpis wyżej: "kalkulator wielo-etapowy A–H... zbyt złożony, żeby bezpiecznie
zmapować 1:1"). Po ponownym, dokładnym przeczytaniu całego katalogu (`calculator.ts`, `input.ts`,
`jednoczesnosc.ts`, `kosztorys.ts`, `warnings.ts`, `validation.ts`, `constants.ts`): funkcja
`calculateNapiecieSystemowe()` jest zwykłą czystą funkcją (jeden argument `NapiecieSystemoweInput`
→ jeden `CalcResult<NapiecieSystemoweResult>`), bez efektów ubocznych, bez stanu sesji, bez
wielokrokowego kreatora wymagającego wielu wywołań — "kreator odbiorników" (Etap B) w jądrze to po
prostu pole `odbiorniki: OdbiornikWybor[]` przekazywane w jednym wywołaniu. Dało się więc
zmapować 1:1 pojedynczym `z.object` (z zagnieżdżonym `z.array` dla `odbiorniki` i zagnieżdżonymi
obiektami dla `kable`/`kosztorysy`/`jednoczesnosc` w wyjściu) — bez zgadywania i bez upraszczania
kształtu. Zbudowano `lib/ai/tools/napiecie-systemowe-tool.ts`:
- Wejście 1:1 z `NapiecieSystemoweInput` (29 pól, w tym `odbiorniki[]`, 3×ceny per napięcie,
  dane trasy kabla Etapu C — wszystkie opisane jako pochodzące wyłącznie od użytkownika/pomiaru/
  cennika, nigdy nie zgadywane przez model). `zastosowanie`/`priorytet` (Etap A) zaznaczone w
  `.describe()` jako informacyjne — jądro ich nie używa do liczenia, ale nadal muszą pochodzić od
  usera, nie od modelu.
- Wyjście 1:1 z `NapiecieSystemoweResult`: prądy przy 12/24/48V, `jednoczesnosc` (analiza z
  `jednoczesnosc.ts`, nullable — pomijana gdy brak odbiorników), `kable` (echo ×3 z Modułu 5,
  `dobor-przekroju-kabla-tool.ts` jako wzorzec, ostrzeżenia kabla przepuszczone przez
  `tekstyOstrzezen`), `kosztorysy` (×3, `kosztorys.ts`), `kosztKonwersji24Do48Zl`.
- Handler woła bezpośrednio `calculateNapiecieSystemowe()` — nie duplikuje algorytmu
  jednoczesności ani kosztorysu.

Zarejestrowano w `lib/ai/pytaj-asystenta.ts` (obok `doborPrzekrojuKablaTool`, koncepcyjnie
powiązanego przez echo Etapu C). `pnpm typecheck`/`lint`/`check:i18n-guard` (152 moduły, bez
regresji)/`test` (170 plików, 1408 testów)/`build` — czyste.

## Synchronizacja ze standardem — Y.6, sprawdzenie automatyczne (26.09.2026, 16:40 UTC)

**Krok 1:** `new-app-standards` zaktualizowany `b68e561`→`35c84bd` (ff-only) — GOD BOOK `v2_38`→`v2_39` już
odebrany w porannej synchronizacji (04:00 UTC, patrz wyżej); nowe commity to wyłącznie ruch **U.4**
(projekt→standard, `docs/god-book/memory.md`/`docs/projekty-downstream.md` samego `new-app-standards`) —
standard nietknięty ("Standard nietknięty" wprost w treści commita `3958477`). `docs/wklad-do-standardu.md`
tego repo ma 4 pozycje `🔎 nowe` (e2e locale, OCR norm, audyt N.1 skryptem, strażnik i18n kompletności listy)
— zgodnie ze stanem po stronie `new-app-standards`, nic do zmiany statusu.

**Krok 2 — `diff -rq` na wszystkich plikach NIETYKALNE:** `docs/standards/*`, GOD BOOK `v2_39`,
`PROMPT_STARTOWY.md`, `docs/przyklady/i18n/*` — bez różnic. Zero nowej treści NIETYKALNE/ADAPTOWALNE do
zastosowania.

**Znalezisko wymagające zgłoszenia właścicielowi (nie rozstrzygnięte samodzielnie — Y.2.2/15.4):**
wpis z 24.09.2026 wyżej ("LOKALNE — znaleziona rozbieżność...") i wpis z 25.09.2026 ("Uwaga:
`docs/przyklady/pwa/`... świadomie NIE skopiowany. Projekt nie ma jeszcze kodu PWA/Service Workera")
opierały się na sprawdzeniu ograniczonym do `app`/`lib`. **To sprawdzenie było niepełne — projekt ma
działający, wcześniej zbudowany kod PWA/Service Workera, tylko poza `app`/`lib`:** `public/sw.js` (79
linii, ręczny SW bez biblioteki), `public/register-sw.js` (rejestracja przez `<script src>`, niezależna
od hydracji Reacta), `app/manifest.ts` — udokumentowane obszernie wcześniej w tym pliku (sekcja ok. l. 4384,
5363: własne logo/ikony PWA, decyzja właściciela). Nie zgaduję rozstrzygnięcia — dwie osobne sprawy dla
właściciela:
1. Wpis `AKTUALIZACJE.md` 24.09.2026 przypisujący temu projektowi zgłoszenie o Web Workerze MapLibre GL/
   `Permissions-Policy: geolocation=()` opierał częściowo swoje "nie znaleziono" na tej samej, niepełnej
   przesłance — nadal nieznaleziony w historii gita ani w `docs/wklad-do-standardu.md` tego repo, ale
   przesłanka "brak kodu SW/PWA" jako dowód na błędne przypisanie źródła jest teraz nieaktualna. Sama
   rozbieżność (MapLibre) pozostaje niezamknięta.
2. Standard ma od 24–25.09.2026 gotowy wzorzec Grupa B PWA/SW (`docs/przyklady/pwa/`, `docs/standards/05`
   5.8–5.12, `07` dopisek 7.3, `08` 8.11, `10` 10.8/10.9) zbudowany na konwencji App Router
   (`app/sw.js/route.ts`) — inny kształt niż istniejący tu ręczny `public/sw.js`. To nie jest NIETYKALNE
   ani proste "brakujący plik" (kategoria (a) Y.8 — nie mieści się jednoznacznie, bo dotyka już działającego,
   przetestowanego kodu, nie tylko dokumentacji) — **pytanie do właściciela, nie decyzja tej sesji:** czy
   porównać istniejący `public/sw.js`/`register-sw.js` z wzorcem `docs/przyklady/pwa/` (audyt zgodności,
   osobne zadanie, poza zakresem Y.6) i ewentualnie zmigrować, czy zostawić jak jest (świadome odstępstwo,
   wymagałoby wpisu D# w `rejestr-decyzji.md` z uzasadnieniem). Nic nie skopiowano, nic nie zmieniono w
   kodzie — to sprawdzenie tylko koryguje błędną przesłankę w dokumentacji.

**Cykl adaptacyjny:** realne znalezisko (błędna przesłanka w dokumentacji + pytanie do właściciela) →
`interwał_h` pozostaje `12` (już było 12 po porannej synchronizacji), `licznik_zero_z_rzedu = 0`. Routine
przestawiona na +12 h od tego sprawdzenia.

## Synchronizacja ze standardem — Y.6, sprawdzenie automatyczne (27.09.2026, 04:40 UTC)

**Krok 1:** `new-app-standards` `35c84bd`→`8eff570` (ff-only) — jedyny nowy commit to znów ruch **U.4**
(`docs/god-book/memory.md`/`docs/projekty-downstream.md` samego źródła, "2 nowe znaleziska (offgrid-pro)"
z perspektywy `new-app-standards`, dotyczy tych samych pozycji co poprzednio). `AKTUALIZACJE.md` bez
nowego wiersza (112 linii, jak przy poprzednim sprawdzeniu). Zero nowej treści NIETYKALNE/ADAPTOWALNE.

**Krok 2:** `diff -rq` na `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — bez różnic. `docs/wklad-do-standardu.md` — nadal 4 pozycje `🔎 nowe` (bez zmian
od poprzedniego sprawdzenia, zgodnie ze stanem po stronie `new-app-standards`) — nic do oznaczenia ✅.
Pytanie z poprzedniego sprawdzenia (SW/PWA — porównanie `public/sw.js` ze wzorcem `docs/przyklady/pwa/`,
oraz rozbieżność MapLibre w `AKTUALIZACJE.md`) wciąż otwarte, czeka na właściciela — nic nowego do
dodania.

**Krok 2b — zero nowej treści:** `interwał_h = min(48, 12 × 1,5) = 18` (poprzednio 12),
`licznik_zero_z_rzedu = 1`. Routine przestawiona na +18 h od tego sprawdzenia.

## Dwa pliki norm dodane do `docs/zrodla/` — mostki cieplne + dynamiczne charakterystyki (27.09.2026)

Właściciel projektu przesłał 2 pliki PDF, polecił dodać do repo + opisać, powiedzieć czego jeszcze
brakuje, i zapisać co pozostało do zrobienia dla innej sesji (OCR odłożony wprost do innej sesji).

- **PN-EN ISO 14683:2007** (mostki cieplne, liniowy współczynnik przenikania ciepła) →
  `docs/zrodla/norma-PN-EN-ISO-14683-1/`. Natywny PDF (nie skan), 27 stron, **przeczytany w
  całości** w tej sesji. Zawiera Tablicę A.2 (Ψ orientacyjne dla ~9 kategorii złączy budowlanych)
  i przykład liczbowy (Załącznik B): mostki cieplne = 36–42% strat ciepła przez przenikanie w
  przykładowym budynku. Częściowo zaspokaja lukę zgłoszoną wcześniej przy PN-EN 12831-1
  (`docs/normy-brakujace.md`, "mostków cieplnych Ψ, M6/E7") — ale nie całą (12831-1 nadal
  potrzebna do strat do gruntu/zysków/nadwyżki mocy). **Niewykorzystana jeszcze w kodzie** —
  zadanie w `docs/lista-do-zrobienia.md`.
- **EN ISO 13786:2007** (dynamiczne charakterystyki cieplne komponentów budowlanych) →
  `docs/zrodla/norma-PN-EN-ISO-13786/`. **Treść NIE przeczytana** — struktura PDF wskazuje na skan
  (108 obiektów obrazu vs. 7 czcionek/62 fragmenty tekstu na ~28 stron, prawdopodobnie tylko
  okładka natywna). OCR i analiza jawnie odłożone do innej sesji, zadanie zapisane w
  `docs/lista-do-zrobienia.md` i `00-INDEKS.md` tego folderu. Nie ma jeszcze zidentyfikowanego
  ekranu/luki, którą by odblokowywała — hipoteza (akumulacyjność cieplna budynku, bufor
  termiczny off-grid) zapisana jako niepotwierdzona, do zweryfikowania po OCR.

Przy tej okazji przypomniana lista wciąż brakujących norm (bez zmian od poprzednich sprawdzeń):
PN-EN 12831-1 (pełny tekst), IEC 62109-1, IEC 61215, IEC 62619, EN 61439, pełna seria EN 62305,
HD 60364-4-443, HD 60364-5-551, PN-EN 62852, PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych
przy konwersji PPTX→DOCX materiału branżowego PV-2019. Pełny wykaz: `docs/normy-brakujace.md`.

`pnpm typecheck`/`lint`/`check:i18n-guard`/`test`/`build` czyste (brak zmian kodu, tylko
dokumentacja i pliki źródłowe w `docs/zrodla/`).

## Cztery kolejne pliki norm dodane, jeden duplikat pominięty (27.09.2026)

Właściciel projektu dostarczył 5 kolejnych PDF do dodania do `docs/zrodla/`. Jeden okazał się
identycznym duplikatem pliku już w repo (`Poradnik-Purmo-nowa-metoda-obliczania_12831_01_2012.pdf`
= treściowo ten sam plik co już posiadany `79967189-Poradnik-Purmo-...pdf`) — **nie dodany
ponownie**, żeby nie powielać treści (zasada B.5). Pozostałe 4:

- **SRPS HD 60364-4-443:2017** → `docs/zrodla/norma-HD-60364-4-443/`. Pełny tekst, natywny PDF,
  przeczytany w całości (18 stron, wersja serbska — technicznie identyczna z HD 60364-4-443:2016,
  dokument harmonizacyjny CENELEC, treść normatywna identyczna między wersjami językowymi).
  **Zamyka pozycję ⚪ "HD 60364-4-443" w `docs/normy-brakujace.md`** — przeniesiona do sekcji
  "Pozyskane". Zawiera wzór CRL do oceny konieczności SPD (443.5), tabelę kategorii przepięć I–IV
  (443.6) i 4 rozwiązane przykłady liczbowe (Załącznik A) — bezpośrednio użyteczne dla ekranu
  `ochrona-przepieciowa-spd` (M5), zadanie zapisane w `docs/lista-do-zrobienia.md`.
- **Artykuł naukowy PL "Zmiany zasad ochrony odgromowej... wg norm serii PN-EN 62305"** (Boryń,
  Olesz, Politechnika Gdańska, 2010) → dopisany do `docs/zrodla/norma-IEC-62305/00-INDEKS.md` jako
  drugie źródło wtórne (po angielskim poradniku Furse). Przeczytany w całości. **Nie zamyka luki
  EN 62305** — status bez zmian (🟡, nadal brak oficjalnego tekstu normy), ale daje krótszy,
  polskojęzyczny opis procedury R = N·P·L i tabel materiałowych/przeglądowych do krzyżowej
  weryfikacji z Furse.
- **Whitepaper "Isolation in solar power converters" (IEC 62109-1)** → nowy folder
  `docs/zrodla/norma-IEC-62109-1/`. **Rozpoznany tylko po tytule/metadanych PDF — treść NIE
  przeczytana w całości w tej sesji** (14 stron, natywny tekst, nie wymaga OCR — zadanie
  jednoznacznie dla następnej sesji, zapisane w `00-INDEKS.md` i `docs/lista-do-zrobienia.md`).
  Nie zamyka luki IEC 62109-1 (wciąż brak Części 1 normy — mamy tylko Część 2).
- **Poradnik ELEKTRA "Obliczanie EN 12831" (wyd. 2011)** → dopisany do
  `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/00-INDEKS.md`. Spis treści (z zakładek PDF)
  identyczny z już posiadanym poradnikiem Purmo (ten sam autorski krąg/bazowa metodyka, inny
  wydawca-branding) — **nie jest niezależnym drugim źródłem**, dodany jako kopia zapasowa na
  wypadek luki w treści Purmo, nieprzeanalizowany rozdział-po-rozdziale (niski priorytet).

Metoda identyfikacji treści bez OCR/renderowania stron (poppler-utils niedostępny w tej sesji):
odczyt zakładek/outline PDF (`/Title` w obiektach `/Outlines`) i ekstrakcja tekstu z zdekompresowanych
strumieni FlateDecode (Python `zlib` + regex na operatorach `Tj`/`TJ`) — pozwoliło rozpoznać pełny
spis treści `nowa_norma.pdf` (i tym samym zidentyfikować go jako dokument o PN-EN 12831) i pierwszy
fragment tekstu bez wywoływania `pdftoppm`.

Przypomniana lista wciąż brakujących norm (zaktualizowana, HD 60364-4-443 usunięta):
PN-EN 12831-1 (pełny tekst), IEC 62109-1 (norma — mamy tylko whitepaper), IEC 61215, IEC 62619,
EN 61439, pełna seria EN 62305 (mamy tylko 2 materiały wtórne), HD 60364-5-551, PN-EN 62852,
PN-EN 61427-1, PN-EN 50565-1, + 9 pozycji zgubionych przy konwersji PPTX→DOCX materiału
branżowego PV-2019. Pełny wykaz: `docs/normy-brakujace.md`.

`pnpm typecheck`/`check:i18n-guard` czyste (brak zmian kodu, tylko dokumentacja i pliki źródłowe
w `docs/zrodla/`).

## Materiał ze szkolenia ZIAD Bielsko-Biała dodany bez analizy (27.09.2026)

Właściciel projektu dostarczył plik `.docx` "Bezpieczeństwo instalacji fotowoltaicznych"
(dodatek Rynek Elektryczny nr 3/2019, egzemplarz szkolenia ZIAD Bielsko-Biała) z jawnym
poleceniem: dodać do repo, ale **nie analizować w tej sesji** — analiza odłożona do innej
sesji. Skopiowany do `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/`, opisany minimalnie
w `00-INDEKS.md` (tylko rozpoznanie tytułu/wydawcy przy pobieżnym podglądzie tekstu, bez
merytorycznej ekstrakcji).

Zauważona, ale niesprawdzona zależność: tytuł i wydawca są identyczne z już posiadanym
`docs/zrodla/materialy-branzowe-PV-2019/` — materiałem, w którym przy konwersji PPTX→DOCX
zgubiło się 9 pozycji z listy 43 norm (`docs/normy-brakujace.md`, sekcja ⚫, pozycje #2, #6,
#10, #13, #17, #27, #29, #33, #37). Spis treści widoczny przy pobieżnym podglądzie różni się
jednak numeracją rozdziałów, więc **nie jest to na pierwszy rzut oka identyczny duplikat** —
wymaga porównania treść-po-treści przez następną sesję (zadanie zapisane w
`docs/lista-do-zrobienia.md`). Jeśli okaże się, że to pełna (nieprzycięta) wersja tej samej
publikacji, zamknie to od razu 9 pozycji z listy brakujących norm bez konieczności zgadywania.

`pnpm typecheck`/`check:i18n-guard` czyste (brak zmian kodu, tylko dokumentacja i nowy plik
źródłowy w `docs/zrodla/`).

## OCR EN ISO 13786 + sprawdzenie materiału ZIAD (27.09.2026, sesja OCR)

Polecenie właściciela: „zrób OCR plików, które zostały dodane”. Z plików dodanych 27.09 **tylko EN ISO 13786 jest
skanem** (PyMuPDF: 0 znaków tekstu na wszystkich 27 stronach); pozostałe PDF (SRPS HD 60364-4-443, IEC 62109-1
whitepaper, Boryń/Olesz, ELEKTRA) mają tekst natywny na każdej stronie — OCR zbędny. `.docx` ZIAD — tekst natywny.

- **EN ISO 13786:2007** — OCR (tesseract 5.3.4 `eng`, 250 DPI auto + 300 DPI `--psm 6`, porównanie liczb strona po
  stronie) → odczyt wizualny wszystkich stron treści (PDF 6–26) → odtworzenie przykładów D.1/D.2 w Pythonie z
  przepisanych wzorów (zgodne do ostatniej cyfry). Pliki: `01-tresc-ocr.txt`, `02-wzory-i-tablice-zweryfikowane.md`.
  **Niespójności oryginału (nie OCR), nierozstrzygnięte, oznaczone ⚠️:** literówka Z12 w D.1 (−0,0754j zamiast
  −0,0705j — potwierdza to reszta tego samego przykładu); wzór (26) arg(Z12) vs Tablice D.1/D.4, które odpowiadają
  arg(Y12) — pytać właściciela dopiero, gdy kod będzie potrzebował przesunięcia fazowego.
  **Odblokowuje M6/E8** (Zał. A.2.4, Tablica A.1: 1 h/1 doba/1 tydzień → 20/100/250 mm) — zadanie w liście.
- **ZIAD = duplikat bajt-w-bajt** `materialy-branzowe-PV-2019/*.docx` (MD5 `428edf51…`). Nie usunięty (dodany na
  wyraźne polecenie) — A/B do właściciela. **Błąd poprzedniej sesji naprawiony:** 9 „zgubionych” pozycji listy norm
  były w akapitach `.docx` poza tabelami; uzupełnione w `01-tresc.md` PV-2019 po potwierdzeniu z PDF str. 8, sekcja ⚫
  `normy-brakujace.md` rozwiązana. Dawne przypuszczenie „#29 = 61730-1” było błędne (61730-1 to #27).
- **Korekta opisu z poprzedniej sesji:** 13786 miała „~28 stron, okładka natywna” — faktycznie 27 stron, 0 tekstu.
- **Pułapka narzędziowa:** równoległe `tesseract` bez `OMP_THREAD_LIMIT=1` → ~9 min/stronę (pierwszy przebieg
  przerwany); z limitem ~1,3 s/stronę. `tesseract`/`pymupdf`/`numpy`/`python-docx` w kontenerze trzeba doinstalować.
- Zgłoszenie do `docs/wklad-do-standardu.md` (MD5 przed dodaniem, akapity `.docx`, OMP, odtwarzanie przykładów).
- **[uzupełnienie, 27.09.2026] PDF „ZIAD”** dostarczony jako „plik, w którym zgubiły się rozdziały przy przeróbce” —
  identyczny (MD5 `007dfe6c…`) z PDF już w `materialy-branzowe-PV-2019/` (repo miało oryginał od 23.09). Tekst natywny,
  bez OCR. Porównanie linia po linii PDF vs `.docx`: rozdziały kompletne; konwersja zgubiła fragmenty pól tekstowych
  (str. 17 podpis Rys. 5, str. 18 przypis MC4, str. 21 akapit o odstępach separujących w materiałach stałych, podpisy
  Rys. 17/18, dwa zdania). Nowy plik `02-tresc-pelna-z-pdf.txt` (bezstratny); `01-tresc.md` uzupełniony o 2 myśli ze
  str. 21. Wniosek: przy materiałach z `.docx`-konwersją źródłem prawdy jest PDF.
- **[27.09.2026] Decyzja właściciela — wariant A:** usunięty folder `materialy-szkolenie-ZIAD-Bielsko-Biala/`
  (duplikat) i niekompletny `.docx` z `materialy-branzowe-PV-2019/` (−2×22,5 MB). Oryginałem publikacji jest tylko PDF;
  wzmianki o `.docx` w starszych opisach są historyczne (plik w historii git, commit `0033707`). Odnośniki zaktualizowane
  dopiskami (00-INDEKS PV-2019, `zrodla/README.md`, `normy-brakujace.md`, lista, biblioteka-norm-zrodlowych).

## Porządki gałęzi na GitHubie — 30 gałęzi oznaczonych jako śmieci (27.09.2026)

- **Stan:** jedyne żywe gałęzie to `main` i bieżąca gałąź sesji. Pozostałe 30 gałęzi zdalnych to **śmieci — nie weryfikuj
  ich, nie scalaj, nie porównuj z `main`**. Sprawdzone 27.09.2026 (`git cherry` + diff treści), żadna nie ma treści,
  której brakuje w `main`:
  - 5 ma identyczne łatki już w `main`: `claude/app-rules-r4guty`, `claude/prep-work-kppxeb`, `claude/sync-cadence-12h`,
    `claude/sync-offgrid-standard-ucgqok-2`, `claude/y6-routine-id-20260924`;
  - 3 zastąpione nowszymi wersjami (scalenie **cofnęłoby** dokumenty): `claude/laughing-faraday-lp6ytt` (→ PR #153),
    `claude/youthful-fermat-tbxoxg` (→ PR #154), `claude/sync-offgrid-standard-ucgqok` (GOD BOOK v2.21, w `main` v2.39);
  - 7 bez wspólnej historii z `main` (prototyp v0 z sierpnia, zastąpiony): `design-system-refinement`,
    `design-system-refinement-1`, `design-system-refinement-2`, `v0/jf7kryn4f9-6614-*` (4 gałęzie);
  - 15 pozostałych `claude/*` nie ma żadnego commita spoza `main`.
- **Dlaczego nie usunięte:** sesja w chmurze nie może kasować gałęzi zdalnych (proxy git zwraca HTTP 403 na push
  inny niż do gałęzi sesji). Właściciel może je usunąć ręcznie: GitHub → repo → *Branches* → ikona kosza.

## Ekrany odblokowane przez normy z 27.09 (27.09.2026)

Polecenie właściciela: „wnieść poprawki w ekrany odblokowane po dodaniu nowych dokumentów”. Z plików 27.09 odblokowały
kod trzy normy (whitepaper IEC 62109-1 nadal nieprzeczytany, ELEKTRA = duplikat Purmo, Boryń/Olesz = materiał wtórny).

- **M6/E7 Mostki — PN-EN ISO 14683 Tablica A.2.** Katalog 76 detali w `mostki-termiczne/katalog-psi.ts`; wartości wyjęte
  skryptem z tekstu PDF i porównane z kodem (0 rozbieżności), opisy z odczytu rysunków (str. 12–22; W1–W18 to przekrój
  poziomy, góra = zewnątrz). Użytkownik wybiera detal (także „po poprawie”) i **system wymiarów** (Ψe/Ψoi/Ψi — E1 go nie
  zna, więc pytanie na E7); kod detalu ma pierwszeństwo przed wpisanym Ψ, kod bez systemu → `INCOMPLETE`. Testy = przykład
  Załącznika B normy (69,85 / 58,88 / 41,50 W/K). **Dryf naprawiony (Y.2, Dyrektywa #6):** E7 zwracał zawsze
  `VALID_WITH_WARNINGS`, choć jedyne ostrzeżenie było `info` — teraz `VALID`.
- **M6/E8 Pojemność — EN ISO 13786 Zał. A.** C użyte do τ = Σ n·A·κ′: dT = min(½ przegrody, grubość do izolacji,
  100 mm), (A.4) z Rsi = 0,13 (✅🤖 — ISO 6946 poza repo, wartość z D.1 i 14683 A.1). Nowe pola warstwy: położenie
  (jedna strona / obie — cała w strefie / za izolacją) i opcjonalna grubość całej przegrody; stare szkice działają
  (domyślnie „jedna strona”). Cała masa zostaje jako `pojemnoscCalkowitaKwhK` (informacyjnie). **Skutek:** w przykładzie
  testowym (strop 100 m² × 20 cm betonu) czas do 5 °C 26,1 h → 6,3 h — stary wynik był ~4× za optymistyczny.
  `POJC-CALA-MASA-ZAWYZA` usunięty (także ze słowników) → `POJC-ZALACZNIK-A-PRZYBLIZENIE` (🟡, adnotacja wymagana przez A.1).
  `CALCULATOR_VERSION` 2.0.0 (zmiana znaczenia wyniku).
- **M5/E2 SPD — HD 60364-4-443 443.4/443.5.** Nowy moduł `okablowanie/ocena-ryzyka-crl` (strażnik i18n sprawdza tylko
  `calculator/warnings/validation.ts`, więc osobny katalog zamiast pliku `crl.ts` w module SPD) + sekcja na ekranie
  (`sekcja-crl.tsx`, osobny szkic) + narzędzie AI. **Pułapka ekstrakcji:** symbole „<”/„≥” progu CRL znikają z tekstu
  PDF — kierunek rozstrzygnięty przykładami A.1–A.4. **Off-grid:** brak linii → L_P = 0 → brak wymogu z 443.5; zawsze
  info o stronie DC (712.443 — osobne wymagania) i przepięciach łączeniowych (443.4: generatory nn, magazyny).
- **Pułapka narzędziowa:** repo nie ma konfiguracji Prettiera — `npx prettier --write` przeformatował pliki domyślnymi
  ustawieniami (średniki, szerokość 80). Cofnięte; formatować ręcznie w stylu pliku (bez średników, linie do ~160).
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (153) / test 172 plików, 1429 / build / audit:gate / audit:n1;
  `next start` + Playwright 390 px `pl-PL`: E7 (C2 → Ψoi 0,10), E8, SPD (CRL 81,7) — bez poziomego przewijania.

## Przegląd niedokończonych sekcji + M12/E32 (27.09.2026)

Polecenie właściciela: „co można jeszcze zrobić beze mnie, czy są większe niedokończone sekcje”. Stan z `mapa-wdrozenia.md`
(przeliczony 26.09): 155/314 → po tej sesji **156/314**. Największe luki: M12 (2/43), M6 (14/48), M7 (2/26), M10, M9, M8, M13.

- **M12 wybrany jako pierwszy**, bo ekrany są małe i samodzielne (źródło: „Wzorzec D-lite”), często echo gotowych silników.
  Triaż wszystkich 40 pozostałych ekranów zapisany w `docs/lista-do-zrobienia.md` (budowalne / wymagają danych / zależne).
- **E32 zbudowany** — echo M4/E1: `obliczDniAutonomiiZPojemnosci` dopisana obok `obliczPojemnoscUzytecznaKwh`
  (ten sam wzór rozwiązany względem d), nie osobny wzór w M12. Przykład źródła M4/E1 w obie strony (45 kWh ↔ 3 dni).
  Uwaga do nazwy w M4/E1: `pojemnoscUzytecznaKwh = E·d/(η·DoD)` to w praktyce pojemność **znamionowa** (dzielenie przez DoD) —
  nazwa zmiennej myląca, ale przykład źródła („45 kWh użytecznej”) tak ją nazywa; nie zmieniane (15.1), tylko odnotowane.
  W E32 wejściem jest pojemność znamionowa z tabliczki (Ah × V), więc wzór odwrotny jest spójny.
- **E41 (przedłużacz) → `⚠️ blocked`**: przewody giętkie nie są w PN-HD 60364-5-52; przykład źródła („0,75 mm², 20 m → max ~1000 W”)
  nie wynika ze spadku napięcia (1000 W → ΔU ≈ 1,8%), więc pochodzi z tablicy obciążalności, której nie mamy. Dopisane do
  `docs/normy-brakujace.md` przy PN-EN 50565-1.
- **Pułapka narzędziowa:** `playwright` nie jest w zależnościach repo — skrypt zrzutu importuje go z globalnej instalacji
  `/opt/node22/lib/node_modules/playwright/index.mjs` (skrypt w scratchpadzie, nie w repo).
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (154) / test 1439 / build / audit:gate / audit:n1; `next start` +
  Playwright 390 px `pl-PL`: 100 Ah/12 V/80%/100%/300 Wh → „3,2 dni”, bez poziomego przewijania.
- **[27.09.2026, partia 2] M12/E9 (dozownik LVD) zbudowany.** Progi 12 V ze źródła; 24/48 V skalowane szeregowo (na ogniwo ×
  liczba ogniw). Kontrola krzyżowa: LiFePO4 11,0 V/4S = 2,75 V/ogniwo = kalibracja M4/E31 (44,0 V/16S) — brak sprzeczności między
  modułami. Kwasowy zalewowy bez progu (źródło podaje tylko AGM i LiFePO4). `PoleCheckbox` wymaga `id` → `useId()` (standard 08).
- **Pułapka narzędziowa:** `pkill -f next-server` w tym samym poleceniu Bash zabija własną powłokę (wzorzec jest w jej linii
  poleceń) — kolejne kroki się nie wykonują. Zatrzymywać serwer po porcie (`fuser -k 3123/tcp`) albo osobnym wywołaniem.
- **[27.09.2026, pakiet 2] M12/E27 (urządzenie 12 V wprost) zbudowany.** ✏️ **Rozbieżność A/B do decyzji właściciela:** górna
  granica napięcia akumulatora 12 V przy ładowaniu — `Tresc_Modul_12` (E27) **14,5 V**, Biblia §12.42 **14,6 V**. Użyte 14,5 V (plik
  ekranów = specyfikacja ekranu, Dyrektywa #13), stała w `urzadzenie-12v-bezposrednio/constants.ts`. Konsekwencja: urządzenie o
  max 14,55 V przejdzie bez 🔴, choć przy ładowarce 14,6 V (typowej dla LiFePO4) byłoby przekroczone. **Pułapka:** porównania granic
  zakresów liczonych z procentów wymagają tolerancji numerycznej (12,5 × 1,16 = 14,4999…) — tu `EPS_V = 1e-9`.
- **[27.09.2026, pakiet 2] M12/E39 (panel → stacja zasilania)** — echo `obliczNapiecieStringuZimowego` + progi M3/E5. `WerdyktPoziom`
  ma wartości `ok | uwaga | blad` (nie „ostrzezenie”). Prąd zwarciowy tylko 🟡 (źródło bez stopu, zachowanie stacji zależy od producenta).
- **[27.09.2026, pakiet 2] M12/E11 (zużycie per urządzenie)** — `obliczZuzycieDoboweWh(P, t, k%)` eksportowane (echo dla E12/E13
  kreatorów). Baza typowych mocy nie zbudowana: źródło ma tylko nazwy urządzeń — dane potrzebne od właściciela, jeśli ma powstać.
- **[27.09.2026, pakiet 2] M12/E30 (gniazdo zapalniczki)** — prąd bezpiecznika od usera (zakres 10–15 A tylko jako podpowiedź).
- **[27.09.2026, pakiet 2] M12/E42** — odsyłacz; dołożone B10 przed B11 (B11 sam mówi, że diagnoza przychodzi z B10).
- **[27.09.2026, pakiet 2] M12/E22 + E36 (checklisty wg chemii)** — wspólna logika `ocenChecklisteChemii` (E22) i wspólny komponent
  `components/wzorce/ekran-checklisty-chemii.tsx`. ⚠️ **Do decyzji właściciela:** alert Biblii o wodorze (ołowiowy bez wentylacji)
  wdrożony jako 🟡 `warning`, nie 🔴 — lista twardych stopów M12 w `Tresc` go nie wymienia. Podniesienie do 🔴 = zmiana `level` w
  `bezpieczenstwo-kamper/warnings.ts` + wpis w rejestrze twardych stopów.
- **[27.09.2026, pakiet 3] M12/E2 + E15 (kabel i bezpiecznik)** — echo M5/E1 + M5/E6 (jak M11/B5) + pierwsze użycie PN-IEC
  60364-4-43 433.2 (IB ≤ In ≤ Iz). ✏️ Przykłady źródła (15 A/3 m → 2,5 mm²; 15 A/4 m → 4 mm²) liczone wzorem jednostronnym ρ·L/S —
  ta sama rozbieżność co w M5/E1, nie powielana (2L → 6 mm² przy 3%). E15: tablice obciążalności dotyczą przewodów instalacyjnych
  PVC (H07V-K); przewody samochodowe FLRY mają osobne tablice — jawne założenie, nie blokada (inaczej niż E41, gdzie przedłużacz
  to przewód giętki poza zakresem normy i przykład źródła nie wynikał z żadnego wzoru).

### M7/E23 obciążenie dachu śniegiem (27.09.2026)

- Pierwszy ekran M7 zbudowany w pełni na normie z repo (PN-EN 1991-1-3 + NB), bez danych z M1 — strefę i wysokość n.p.m. wpisuje user. Tablice NB.1 (sk), 5.1 (Ce), E.1 (γ) i minimum μ = 0,8 przy barierkach dopisane do wspólnego `lib/core/modules/pv/eurokod-1/snieg.ts` (obok istniejącego μ1) — M3 może z nich korzystać bez duplikatu.
- **Pułapka IEEE-754 (drugi raz po E27):** 0,8 × 0,9 = 0,7200000000000001, więc s równe nośności dawało fałszywe 🔴. Porównanie z tolerancją `EPS_KN_M2 = 1e-9`. Wniosek: każde porównanie iloczynu z progiem „>” wpisanym przez usera potrzebuje tolerancji — kandydat do `docs/wklad-do-standardu.md`.
- Porównanie na wartościach charakterystycznych (bez γQ = 1,5) — założenie jawne w UI; nośność user musi podać też jako charakterystyczną.
- Otwarte dla właściciela: próg „zbliżania się do nośności” (źródło: 🔴 „zbliżające się lub przekraczające”, bez liczby) — dziś tylko % wykorzystania.

### M7/E13 sztywnienie izolacji (27.09.2026)

- Progi 1:1 ze źródła (PVC −10°C, XLPE −40°C). Asymetria świadoma: 🔴 tylko PVC (tak źródło), XLPE poniżej progu — 🟡. Guma/aluminium bez liczby → info. Para z M5/E28 (strona gorąca) — osobne ekrany, nie scalone, bo źródło ma je w dwóch modułach.

### M7/E19 elektronika w mrozie (27.09.2026)

- Źródło nie podaje progów per urządzenie — min. temperaturę pracy wpisuje user z karty katalogowej (Dyrektywa #1). 🔴 tylko BMS (jedyny „nie wystartuje” w źródle); przetwornica/falownik 🟡 mimo że realnie też krytyczne — otwarte dla właściciela (`docs/lista-do-zrobienia.md`). Porównanie ścisłe `<` (równo z minimum = w zakresie, jak E13).
- **Błąd naprawiony (wspólny komponent):** `components/wzorce/wynik-szczegoly.tsx` miał `key={w.code}` — przy kilku ostrzeżeniach o tym samym kodzie (lista urządzeń) React zostawiał nieaktualny komunikat. Teraz `key={w.code + i}`. Ten sam wzorzec `key={w.code}` jest jeszcze w ~10 stronach z własnym renderem ostrzeżeń (np. `mixing-rownolegle`, `liczba-paneli`) — nieruszone, bo tam kody są unikalne per wynik; do sprawdzenia przy dotknięciu tych ekranów. Wkład: `docs/wklad-do-standardu.md`.

### M7/E21 pompy i zawory w mrozie (27.09.2026)

- Kopia wzorca E19 (osobny moduł, nie wspólny silnik — inne kody, inne skutki, brak 🔴). Świadomie nie scalone z E19 w generyczny „sprzęt w mrozie”: dwa ekrany źródła, dwie różne listy skutków; przy trzecim podobnym ekranie rozważyć ekstrakcję.
- „Spadek ciśnienia” (sekcja B) nieliczony — źródło nie podaje zależności.

### M7/E11 grzałki dachowe (27.09.2026, częściowo)

- Wzór z przykładu źródła; 30 W/m i 6 h to przykład → pola usera. Zdanie źródła „sprawdź, czy masz zapas mocy” zamienione na realne porównanie z opcjonalnym polem „wolny zapas mocy falownika” (bez niego — info). Porównanie z pompą ciepła tylko, gdy user poda jej moc. Strefy zatorów (kosze, przy rynnach) — tylko opis; auto-identyfikacja czeka na model dachu M1.

### M7/E22 ryzyko zamarznięcia — tryb grunt (28.09.2026, częściowo)

- Zapas 20 cm dla wodociągu wzięty z `Biblia_Offgrid_v2_0` („minimum 20 cm poniżej strefy przemarzania”) — 🟡, bo tam to komunikat, nie twardy stop. Kabel/uziom: wymagane = h_z. Porównanie ścisłe `<` (dokładnie na granicy = OK).
- Mapy stref przemarzania (PN-81/B-03020) nie ma w repo → h_z od usera. Gdy właściciel dostarczy normę, można podpiąć wybór strefy.
- **Błąd naprawiony (dryf, Y.2):** `\;` w FORMULA pisane jednym backslashem — JS po cichu robi z tego `;`, odstęp LaTeX znikał. Było w 4 istniejących kalkulatorach (`powloki-antyrefleksyjne`, `mikropekniecia-termiczne`, `gniazdo-zapalniczki`, `zuzycie-per-urzadzenie`) i dwa razy w tej sesji. ESLint nie łapie (brak `no-useless-escape` w konfiguracji). Dodano strażnika: `lib/core/__tests__/formula-escapes.test.ts` (skan linii z FORMULA). **Uzupełnienie (28.09.2026):** strażnik rozszerzony o wzory łamane na kilka linii (`=`/`+`/`(` na końcu linii) — znalazł jeszcze 5 kalkulatorów (`kable-bezpieczniki-male`, `panel-do-stacji-zasilania`, `urzadzenie-12v-bezposrednio`, `koszty-ogrzewania`, `tracker-vs-staly`); poprawione. Łącznie 9 plików z dryfem. Wkład: `docs/wklad-do-standardu.md`.

### M7/E8 agregat w mrozie (28.09.2026, częściowo)

- **Konflikt w źródle (nie rozstrzygnięty samodzielnie):** próg parafinizacji zwykłego diesla — sekcja B „przy −20°C”, przykład C „nie wystartuje przy −15°C”. Dziś tylko info dla zwykłego diesla < 0°C. Wpis do decyzji: `docs/lista-do-zrobienia.md`.
- 120 h z przykładu to wymagany czas pracy, nie wynik (8 h + 1 h przez 168 h dałoby 150 h) — stąd wejście „łączny czas pracy”, a czas kalendarzowy jako wynik.

### M8 blok 1: E1, E3, E4 (28.09.2026)

Polecenie właściciela: „zacznij od modułów M8–M7 i ruszaj dalej; po każdym bloku, który możesz zrobić beze mnie — commit, push, PR, merge”.

- **E3 zamki drzwi ewakuacyjnych** — źródło sformułowało 🔴 nieprecyzyjnie („zamek elektromagnetyczny bez zasilania awaryjnego … jeśli logika nie jest fail-safe”). Fizycznie o bezpieczeństwie decyduje zachowanie przy zaniku prądu, nie typ zamka — stąd wejście „co robi zamek przy zaniku prądu” (otwiera/blokuje/nie wiem), a 🔴 = nie fail-safe ∧ brak zasilania awaryjnego. „Nie wiem” = blokuje (strona bezpieczna). Fail-secure z UPS → 🟡 (✅🤖, lista do decyzji).
- **E4 moduł gaśniczy** — 🔴 tylko dla środków wymienionych wprost jako nieskuteczne przy LiFePO4 (proszek, CO2); gaz obojętny/aerozol 🟡 (✅🤖). Próg 2 czujników z „np. dwa niezależne” — potwierdzenie jednym czujnikiem nie jest potwierdzeniem. Sekwencja 12.51 — lista na ekranie, nie logika (wykonanie to M9/M13).
- **E1 awaryjne źródło ciepła** — **pułapka echa:** przykład źródła (kominek 8 kW + bufor 400 l) pasuje liczbowo do reguły 50 l/kW z M6/E14, ale ta reguła dotyczy pompy ciepła — świadomie NIE przeniesiona na kominek (Dyrektywa #1). Paliwo m = P·t/(η·W_o): P to moc oddana, więc energia paliwa = E/η. Wartość opałowa drewna od usera (źródło jej nie podaje).
- Nowy plik testów narzędzi AI M8: `lib/ai/tools/__tests__/modul8-bezpieczenstwo-tools.test.ts`.
- Weryfikacja: typecheck / lint (0 błędów) / i18n-guard (173) / test 196 plików, 1600 / build / audit:gate / audit:n1; `next start` + Playwright 390 px `pl-PL` — trzy ekrany, werdykty zgodne z testami, bez poziomego przewijania.

### M8 blok 2: E5, E7, E8, E10 (28.09.2026)

- Wszystkie cztery to kontrole konfiguracji (Wzorzec D bez liczb): flagi domyślnie `false`, 🔴 tylko tam, gdzie źródło je daje (E5 awaria centrali, E7 niesprawna lampa) + E10 zgoda na wezwanie służb (reguła produktowa, pogrubiona w źródle — ✅🤖). E8 — źródło bez 🔴, same 🟡/info.
- E10 — wynik `autoWezwanieAktywne = auto ∧ zgoda`: kalkulator sam „wyłącza” wezwanie bez zgody zamiast tylko ostrzegać; narzędzie AI niczego nie wysyła (`read`).
- E7 — lista lamp jak w M7/E19 (`id` tylko w stanie strony, silnik go nie potrzebuje); klucze ostrzeżeń w `WynikSzczegoly` już `code + i` (poprawka z 27.09), więc powtarzający się kod per lampa renderuje się poprawnie.
- Świadomie nie zbudowane: E9 (telemetria M13), część AI E6 (brak progu „zbliżającego się rozładowania” w źródle — przykład „10 minut” to ilustracja), adaptacyjna trasa ewakuacji E7 (mapa budynku M1), reset klap E8 (sterownik).

### M7 blok 3: E4, E6, E10 (28.09.2026)

- **E4 Blackout** — czyste echo M4/E1 w obie strony (`obliczDniAutonomiiZPojemnosci`, `obliczPojemnoscUzytecznaKwh`), DoD = SoC₀ − SoC_min. Testy sprawdzają spójność odwrotną: po dołożeniu wyliczonej pojemności albo redukcji zużycia system wytrzymuje dokładnie N dni. Przykład C (14 dni, 9. dzień, 30 kWh, 40%) nie ma danych wejściowych — test na własnych liczbach tej samej skali.
- **E6 Zamarzanie** — źródło w sekcji A odsyła do M2 „Ekran 1.20” (Smart Load Shedding) → progi wzięte stamtąd jako echo stałej, nie kopiowane. Zimą bez nadwyżki PV reguła M2/E12 odłącza komfort od razu.
- **E10 SPOF** — 🔴 tylko BMS (tak źródło), pozostałe z przykładu C jako 🟡 z konkretnym zaleceniem.
- **Pułapka (drugi raz tej samej doby):** `\;` w FORMULA — strażnik `formula-escapes.test.ts` złapał to w 2 nowych plikach. **Nowa pułapka przy naprawie:** regex w Pythonie wewnątrz heredoc (`(?<!\\)\;`) po warstwach escapowania dopasował każdy `;` i zepsuł komentarze oraz poprawny plik E1 — wykryte `git diff`/`od -c`, E1 przywrócony z HEAD. Wniosek: poprawki backslashy robić `str.replace` z `chr(92)`, zawsze sprawdzać `git diff` po masowej zamianie.
- Weryfikacja: typecheck / lint / i18n-guard (180) / test / build / audit:gate / audit:n1 — wynik w PR.

### M7 blok 4: E18, E20, E26 (28.09.2026)

- **E20** — wyodrębniona `obliczStrumienCieplaPowietrzaW(V̇, ΔT, η=100)` z M6/E3 (wzorzec echo); M6/E3 teraz ją wywołuje, jego 9 testów bez zmian. Ta sama funkcja z η=100% daje moc nagrzewnicy wstępnej.
- **E18** — stała wody z M2/E2 (`WSPOLCZYNNIK_KWH_NA_L_K`) zamiast nowej liczby; bufor = Q_dom / straty (straty stałe — założenie jawne).
- **E26** — deficyt + echo M4/E1 dla dni na baterii.
- **Pułapka narzędziowa (trzeci raz):** `\;` w FORMULA pisanej przez heredoc Basha ginie do `\;` pojedynczego — pliki z wzorami LaTeX pisać narzędziem Write, a w FORMULA używać `\\quad` zamiast `\;`. Strażnik `formula-escapes.test.ts` łapie to niezawodnie.
- M7 po bloku 4: z triażu nie zostało nic budowalnego bez właściciela — E24/E25/E16 wpisane do decyzji w `docs/lista-do-zrobienia.md`.

### M9 blok 5: E2, E4, E5, E6 (28.09.2026)

- **E2** — porównanie zakresu przetwornicy z **najwyższym** napięciem magistrali (przy ładowaniu), nie z nominalnym: nominalne 48 V przy przetwornicy do 50 V wyglądałoby dobrze, a ładowanie do 58,4 V ją niszczy. Przykład źródła „48 V → MP1584” podejrzany (hipoteza, wpis do weryfikacji w `docs/lista-do-zrobienia.md`); limitów konkretnych przetwornic nie wpisano do kodu — tylko z karty od usera.
- **E5** — rozróżnienie linii magistral współdzielonych (I2C, 1-Wire, SPI MOSI/MISO/SCK) od funkcji wyłącznych (CS, ADC, UART, PWM…). Mapa ADC1/ADC2 poza źródłem — tylko przypomnienie.
- **E4** — Biblia §9.4 („konflikty adresów i prędkości”) dała więcej niż `Tresc` — obie reguły wdrożone jako 🟡.
- Pliki z FORMULA pisane narzędziem Write, bez `\;` — strażnik escapowania zielony od razu.

### Chmurki „?” przy polach — niezgodność ze standardem 8.4 (28.09.2026)

- Pytanie właściciela: czy chmurki z opisem są na każdym ekranie. Sprawdzone: opis ekranu (nagłówek) — tak, wszędzie; chmurka `?` przy polach (`PomocPole`, prop `pomoc`) — tylko na 1 kalkulatorze + `/wzornik`, choć standard 8.4 wymaga jej przy każdym polu liczbowym. Dryf bez decyzji; ekrany M7/M8/M9 z 28.09 go powieliły. Właściciel zlecił wpis do pracy planowanej (inna sesja) — pełny opis, warianty A/B/C i rekomendacja: `docs/lista-do-zrobienia.md`, wpis z 28.09 „Chmurki „?” przy polach liczbowych”. Nowe ekrany od teraz: dodawać `pomoc` od razu.

## Nowy materiał źródłowy — rozliczenia energii (gospodarstwo / przedsiębiorca) (28.09.2026)

[28.09.2026] ✅ DODANO — właściciel dostarczył 2 dokumenty (zapisane 1:1:
`docs/zrodla/Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md`,
`docs/zrodla/Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md`). Cel właściciela: nowy
rozdział Biblii + kalkulatory/porównywarki, **osobne ekrany dla gospodarstwa domowego i dla
przedsiębiorcy** (wybór segmentu na pierwszym kliknięciu — na ekranie wyboru albo wyżej w menu).
Proces ustalony: źródło 1:1 [wykonane] → weryfikacja + kategoryzacja F.2 [wykonane, przedstawione
właścicielowi, czeka na decyzje] → opracowanie (dokument źródłowy poprawiony/uzupełniony) →
Biblia → plan ekranów → audyt N.2 → dopiero kod (bramka N.3). **Kodu nie zaczynać.**

**Pochodzenie:** oba dokumenty z innego narzędzia AI (dok. 2 wprost: „mogę napisać kod
kalkulatora”, kolumny „Źródło” puste) — 15.1b.

**Kontekst zakresu:** aplikacja jest off-grid; sieć występuje dotąd marginalnie (M6 „pompa ciepła
w taryfie nocnej”, „jeśli jest sieć”). To rozszerzenie domeny (rynek energii, prawo energetyczne,
podatki) — do potwierdzenia jako decyzja D# (GOD BOOK 0.5 — rozszerzenie ekspertyzy o analityka
rozliczeń energii; Część K — treści prawne/podatkowe = informacja, nie porada).

**Weryfikacja — błędy merytoryczne (do adnotacji ✏️ w opracowaniu, źródło nietknięte):**
1. **Wzór opłaty za moc bierną bez pierwiastka.** Źródło: `O_b = k·C_rk·[(1+tg²φ)/(1+tg²φ₀) − 1]·A`.
   Rozporządzenie taryfowe: `O_b = k·C_rk·(√((1+tg²φ)/(1+tg²φ₀)) − 1)·A` (stosunek mocy pozornej
   do czynnej = √(1+tg²φ)). Przeliczone: wzór źródła zawyża opłatę ok. 2× (tgφ=0,5: 0,0776 vs
   0,0381). Pewność wzoru: wysoka, 🔎 potwierdzić brzmieniem aktualnego rozporządzenia.
2. **C_rk to nie cena energii klienta** — to cena energii ogłaszana przez Prezesa URE (art. 23
   ust. 2 pkt 18 lit. b Prawa energetycznego), a energia bierna pojemnościowa i indukcyjna przy
   braku poboru czynnej rozliczana jest inną formułą (całość, nie nadwyżka). 🔎 treść rozporządzenia.
3. **Moc bierna w C1x „zawsze tak”** — nadmierne uogólnienie: dla nN obowiązek dotyczy zasadniczo
   mocy umownej >40 kW, dla ≤40 kW — gdy wynika z warunków przyłączenia/umowy. 🔎.
4. **Współczynnik 1,23 depozytu dla firm** — najpewniej dotyczy prosumentów niebędących
   podatnikami VAT (gospodarstwa domowe, rekompensata VAT); przykład 1 107 zł dla firmy
   prawdopodobnie powinien dać 900 zł. Data „1.02.2025” niepotwierdzona. 🔎 (ustawa OZE).
5. **Podatki (4.4)** — dwa zdania wzajemnie sprzeczne (nadwyżka „nie stanowi przychodu” vs
   „podlega opodatkowaniu jako przychód”), plus nieprawdziwe uogólnienie „przedsiębiorcy zwolnieni z
   podatku dochodowego i akcyzy”. Sygnatura interpretacji niezweryfikowana. Nie przenosić do
   kalkulatora; do poradnika tylko jako informacja z datą i zastrzeżeniem (Część K).
6. **Dotacje (5.4)** — program NFOŚiGW i ulga termomodernizacyjna dotyczą osób fizycznych/
   budynków mieszkalnych, nie firm; nabór FEPK zakończony 31.03.2026. Dane przeterminowane.
7. **Reklamacja (7.1)** — „14 dni na złożenie” nie wynika z ustawy (14 dni to termin na
   rozpatrzenie); termin złożenia wg umowy/OWU. 🔎. Tabela „dodatkowa ekspertyza — płaci odbiorca”
   uproszczona (przy stwierdzeniu nieprawidłowości koszt ponosi przedsiębiorstwo). 🔎.
8. **Przykład 9.3 wewnętrznie sprzeczny** — dane wejściowe 9.1 mają moc umowną 30 kW, a tabela
   rekomenduje C21 (wymaga >40 kW). Kwoty w tabeli nie są wyliczone, tylko ilustracyjne.
9. **„Od 2008 ceny taryfy C nieregulowane”** — dotyczy tylko sprzedaży; dystrybucja nadal
   zatwierdzana przez URE.
10. **Brakujące składniki rachunku:** opłata przejściowa, abonamentowa, handlowa sprzedawcy;
    grupa B (SN) poza zakresem materiału; inni OSD (np. Stoen Operator).

**Dokument 2 (tabele stawek) — niewiarygodny jako dane:** Tauron i PGE mają identyczne stawki co
do grosza (niemożliwe przy różnych taryfach OSD); stawka jakościowa różna per OSD (w praktyce
jednolita); „Energa = Ergo Energy (dawniej Stoen)” — pomylenie operatorów; Tauron C21 z „strefą
zalecanego poboru” (C21 jest jednostrefowa); Tauron C22a dzień = noc. **Wniosek: żadnej liczby z
dok. 2 nie wpisywać do kodu** — dane stawek wyłącznie z oficjalnych taryf OSD 2026 (PDF), wersjonowane
rocznie (Zasada 4 „profile jako dane”), albo wpisywane przez użytkownika z faktury.

**Poprawne/potwierdzone:** tgφ₀=0,4 domyślnie; akcyza 5 zł/MWh; VAT 23%; podział C1x ≤40 kW /
C2x >40 kW; godziny opłaty mocowej 7–22 w dni robocze; mikroinstalacja ≤50 kW; depozyt 12 mies.;
test diody (15×60/1000 = 0,9 kW ✅); arytmetyka 2×450×1,23 = 1 107 ✅, 169,99×1,23 = 209,09 ✅;
0,2194 vs 0,1413 (2025) = +55,3% — spójne ze źródłem, sama stawka 🔎 (Informacja Prezesa URE).
Ceny BESS, zwrot 5–8 lat, „0,3–0,4 współczynnik bilansowania”, „54% węgla” — orientacyjne, nie
stałe do kodu (kalkulator ma to liczyć, nie przyjmować).

**[28.09.2026] ✅ Decyzja właściciela — cel rozdziału (do zapisu jako D# przy integracji do Biblii):**
„Niektórzy są jeszcze podłączeni do sieci i chcą częściowo przejść do off-grid — nie możemy ich
ignorować. Muszą mieć podgląd i porównanie, żeby zrezygnować z sieci i przejść na off-grid. To
bardzo popularny kierunek.” Konsekwencja: rozdział nie jest porównywarką taryf samą w sobie, tylko
**ścieżką przejścia sieć → off-grid** (dziś: mój rachunek; jutro: porównanie scenariuszy z
kalkulatorami M2/M3/M4/M7). Pochodzenie materiału potwierdzone przez właściciela: pisane przez AI.

**[28.09.2026, później] Opracowanie M14 + korekta własnej notatki.** Właściciel: brak dalszych
materiałów (ponownie wklejony tekst = dok. 1, już zapisany), M14 potwierdzony, **dwa duże kafle
Dom/Firma**, prowadzenie za rękę (kalkulatory opłacalności, PV, magazynu) + pełna informacja o
ryzykach odłączenia; dane stawek — Claude znajduje poprawne + użytkownik zawsze może wpisać swoje.
Opracowanie: `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md` (czeka na P1–P4 i „integruj
teraz”).
- ✏️ **Korekta mojej notatki wyżej (pkt 10 „brakuje opłaty przejściowej”):** opłata przejściowa
  **zniesiona od 1.01.2026** (decyzja Ministra Energii, 🔎A) — brak w dok. 1 był poprawny, błędny jest
  krok algorytmu dok. 2, który ją nalicza.
- **Weryfikacja danych w sieci:** WebSearch działa, ale WebFetch do `ure.gov.pl`, `gov.pl`,
  `gramwzielone.pl`, `industria.eu` blokowany przez proxy środowiska → stawki ogólnokrajowe 2026 na
  poziomie 🔎A (≥2 zgodne źródła wtórne): mocowa G 4,29/10,31/17,18/24,05 zł/mies., C 0,2194 zł/kWh;
  OZE 7,30 zł/MWh; kogeneracyjna 3,00 zł/MWh; przejściowa 0; średnia cena G 495,16 zł/MWh.
  **Pułapka:** źródła wtórne o stawkach per OSD są wzajemnie sprzeczne (mieszają netto/brutto,
  podają zniesioną opłatę przejściową) — stawki per OSD tylko z PDF taryf (zadanie DANE-1).
- Wprowadzona skala pewności 🔎A/🔎B (opracowanie §0); do kodu jako dane domyślne tylko ✅.

## Synchronizacja ze standardem — Y.6, sprawdzenie (28.09.2026, 09:55 UTC)

Świeży płytki klon `new-app-standards` (`b59a052`, 27.09 06:17 UTC) — jedyny nowy commit od `8eff570`
to znów ruch U.4 po stronie źródła (cykliczne sprawdzenie, brak treści). `AKTUALIZACJE.md` 112 linii,
bez nowego wiersza. `diff -rq` `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md`,
`docs/przyklady/i18n/*` — bez różnic. Zero nowej treści → `interwał_h = min(48, 18 × 1,5) = 27`,
`licznik_zero_z_rzedu = 2`. Kolejne sprawdzenie najpóźniej 29.09.2026 ok. 13:00 UTC.


**[28.09.2026, później] ✅ Decyzje właściciela do opracowania M14 (P1, P2):** (6) **FREE/PRO — na razie
nie ruszamy**, podział później, osobną decyzją; (7) **kafle „Dom – sieć” / „Firma – sieć”** — „moduły
opowiadają i liczą sieć, a dopiero potem jest opcja obliczenia dla przejścia Offgrid”. Opracowanie
zaktualizowane: każdy rozdział = część **Sieć** (najpierw) + część **Przejście** (opcja, wejście na
końcu części Sieć; kreator „Ścieżka przejścia” startuje stamtąd); kolumna FREE/PRO w planie ekranów
zastąpiona kolumną „Część”. Otwarte zostają P3 (autokonsumpcja w trybie prostym) i P4 (DANE-1).

**[28.09.2026, później] ✅ P3: autokonsumpcja w trybie prostym = profile** (decyzja właściciela).
Źródło kształtów: standardowe profile zużycia OSD (IRiESD) — 🔎B, do pozyskania; warianty tylko ze
źródłem albo jako jawne przesunięcie profilu typowego. **P4 (dane):** właściciel wybierze
odblokowanie domen w ustawieniach środowiska albo sam zweryfikuje ręcznie — lista kontrolna W1–W7
w opracowaniu §9.1. Najprościej: PDF-y taryf OSD, liczby wyciąga Claude.

**[28.09.2026, później] DANE-1 — pierwszy odczyt pierwotny (po zmianie sieci przez właściciela).**
Informacja Prezesa URE nr 58/2025 pobrana z `bip.ure.gov.pl` → `docs/zrodla/`: stawki mocowe 2026
✅ (4,29 / 10,31 / 17,18 / 24,05 zł/mies. ryczałt; 0,2194 zł/kWh pozostali, 15 godzin dni roboczych
od 7:00 do 22:00). **Pułapka dla kodu — granice progów:** `<500`, `500–1 200` (włącznie),
`>1 200–2 800`, `>2 800` kWh/rok — brzmienie URE, nie zaokrąglać. Ryczałt dotyczy odbiorców z art. 89a
ust. 1 pkt 1 ustawy o rynku mocy (w praktyce G) — nie „G” wprost.
**Dostęp sieciowy po zmianie:** działają `bip.ure.gov.pl`, `energa-operator.pl` (strona), a blokowane
nadal: wersje `www.` (`www.ure.gov.pl`, `www.gov.pl`, `www.nfosigw.gov.pl`, `www.pse.pl`,
`www.tauron-dystrybucja.pl`, `www.operator.enea.pl`, `www.stoen.pl` — domeny bez www przekierowują na
www), `pgedystrybucja.pl` (z i bez www), CDN z PDF-ami Energi `cdn-netpr.pl`; `isap.sejm.gov.pl` → 403.

**[28.09.2026, wieczór] DANE-1 — drugi odczyt pierwotny (sieć odblokowana w pełni, poza 2 hostami).**
Zamknięte ✅: W2 (OZE 7,30, kogeneracyjna 3,00 zł/MWh — z taryf OSD; przejściowa 0 — komunikat ME
28.11.2025 + brak w taryfach), W5 (1,23 — art. 4c ust. 4 OZE; zwrot nadpłaty 20%/30% — art. 4 ust.
11a), W7 (wzór mocy biernej z √, k=3/1/0,5, tgφ₀=0,4 min 0,2, przekroczenie = stały × suma 10
największych nadwyżek — w taryfach Tauron/Energa/Stoen). W3 częściowo: Tauron, Energa, Stoen ✅,
Enea tylko brutto (pełna taryfa = skan), PGE ❌. Otwarte: W4 profile, W6 PME, wartość `C_rk`.
**Trzy lekcje:**
1. **Moja poprawka ✏️ K4 (1,23 „tylko dla nie-VAT”, data niepotwierdzona) była błędna** — ustawa
   nie różnicuje, stosowanie od 1.02.2025 (art. 31 ustawy Dz.U. 2024/1847). Materiał właściciela miał
   rację; poprawkę wycofano jawnie (zostaje w historii). Wiedza „ekspercka” bez odczytu to 🔎B, nie ✏️.
2. **Stawki zmieniają się w trakcie roku** — jakościowa 0,0331 (I) → 0,0332 zł/kWh (od 1.02.2026, zmiana
   kok w taryfie PSE). Model danych: lista okresów `{odDnia, doDnia, wartosc}`, nie „stawka roczna”.
3. **Dostęp:** `pgedystrybucja.pl` i `www.nfosigw.gov.pl` mają niepełny łańcuch certyfikatów (brak
   pośredniego Certum) — curl je odrzuca; obejście przez dociąganie certyfikatu zablokował klasyfikator
   bezpieczeństwa → te dwa dokumenty tylko od właściciela (PDF). `isap.sejm.gov.pl` → 403, ale
   **API ELI Sejmu (`api.sejm.gov.pl/eli/...`) działa** i daje oficjalne PDF-y aktów — używać zamiast ISAP.
Narzędzia: brak `pdftotext`/`pdftoppm`; działa `pypdf` (pip `--no-deps`) z `sys.modules['cryptography']=None`
(zepsuty pakiet systemowy cryptography/cffi).

## Synchronizacja ze standardem — Y.6, sprawdzenie na starcie sesji (28.09.2026, ok. 09:20 UTC)

Termin cyklu minął (27.09 04:40 UTC + 18 h). `new-app-standards` sklonowany świeżo (tylko odczyt, bez
`register_repo_root`, bez push — 15.17), HEAD `b59a052` (27.09 08:17). `AKTUALIZACJE.md` — nadal 112 linii,
brak nowego wiersza. `diff` mirrora: `docs/standards/*`, GOD BOOK `v2_39`, `PROMPT_STARTOWY.md` — identyczne.
Jedyna różnica: `docs/przyklady/pwa/` (+ `README.md`/`PROMPT.md` przykładów) — znana od 26.09, czeka na decyzję
właściciela (porównanie `public/sw.js` ze wzorcem). **Zero nowej treści →** `interwał_h = min(48, 18 × 1,5) = 27`,
`licznik_zero_z_rzedu = 2`.

## Sesja decyzji po kolei (28.09.2026)

Polecenie właściciela: przerobić `docs/lista-do-zrobienia.md` po kolei, pytania z ≥3 wariantami. Rundy pytań
idą od najstarszych otwartych ⚠️. Decyzje rundy 1–2 i co z nimi zrobiono:

- **M3/E21 → 🔴** (było 🟡, samo ostrzeżenie potwierdzone już 25.09 — lista tego nie odnotowała). Nowe pytanie
  `falownikWyspowyAcCoupling` (tak/nie/nie wiem), pokazywane tylko przy rekomendacji mikroinwerterów; „nie wiem”
  = strona bezpieczna (wzorzec M8/E3); brak odpowiedzi → `INCOMPLETE`, ale rekomendacja zostaje widoczna.
- **M12/E22+E36 wodór:** poziom zależny od chemii w `brakWentylacjiOlowiowy(kod, chemia)` — kwasowy 🔴, AGM 🟡.
  Wspólny komponent `ekran-checklisty-chemii.tsx` mapuje teraz `critical` → werdykt „blad”.
- **M12/E27:** górna granica = pole usera „maks. napięcie ładowania instalacji” (wartość całej instalacji, nie
  jednego akumulatora); 14,5/14,6 V tylko w podpowiedzi (`NAPIECIE_LADOWANIA_12V_*` w `constants.ts`).
  Walidacja: wartość < napięcia znamionowego = `INVALID_INPUT` (typowy błąd: 14,6 V wpisane przy 24 V).
- **Pułapka powtórzona i obsłużona:** nowe pole w istniejącym szkicu `usePersistedDraft` — typ pola opcjonalny
  (`?:`) + `?? ""` przy odczycie (stare szkice nie mają klucza). Dotyczy E21 i E27.
- **Licencje norm:** zostaje plan B (świadomie). **27.09 pkt 2–4:** potwierdzone. **Rsi per kierunek:** czeka na
  PN-EN ISO 6946 od właściciela (0,10/0,17 nie ma w żadnym materiale repo — sprawdzone grepem i w PDF-ach).
- **D29:** masa paneli+stelaża jako siła utrzymująca (γG,inf) — ✅ zrobione 28.09 (wpis w sekcji D29).
- **M12 „uproszczone wersje”:** hybryda (odsyłacz dla prostych źródeł, wrapper dla rozbudowanych, Wzorce B budować).
- Nowe pola w tej sesji dostają od razu `pomoc` (chmurka 8.4) — zgodnie z wpisem 28.09 o chmurkach.
- **Błąd naprawiony (28.09): chmurka „?” nie działała na telefonie.** `Chmurka` używała `Tooltip` (Base UI) —
  hover-only, tap nic nie robi. Podmieniona na `Popover` z `openOnHover` (Base UI 1.8.0, API sprawdzone w
  `node_modules`, nie z pamięci). Zweryfikowane Playwright: desktop hover + `Pixel 5` tap + zamknięcie tapnięciem
  obok, na `/wzornik`, `dobor-przekroju-kabla`, E27. **Od 28.09: chmurki weryfikować też emulacją dotyku.**
  Wkład: `docs/wklad-do-standardu.md`.
- **Runda 3 (28.09) wdrożona — D30–D33** (`rejestr-decyzji.md`): E23 🟡 od 80% nośności; E19 falownik 🔴,
  nowy typ „regulator” 🟡; E8 progi rozruchu z praktyki właściciela (zwykły diesel 🟡 ≤ +5°C / 🔴 ≤ 0°C,
  każdy diesel 🟡 ≤ −10°C, benzyna ℹ️) — zastępują sprzeczne −20/−15 źródła; E11 przykładowe moce urządzeń
  jako podpowiedź (nigdy wartość domyślna). Wszystkie progi opisane w tekstach jako ustalenie aplikacji, nie
  norma. **Pułapka E8:** kalkulator zwracał INCOMPLETE bez czasu pracy/dni postoju — nowy 🔴 rozruchu byłby
  niewidoczny, więc „paliwo + temperatura” jest teraz osobną kompletną ścieżką. **Pułapka procesowa:** repo
  nie ma konfiguracji Prettiera — `prettier --write` przeformatowuje cały plik na domyślne reguły (średniki);
  nie uruchamiać, formatować ręcznie w stylu pliku. Do potwierdzenia ✅🤖: poziomy D32, lista/wartości D33.
  **[28.09] D33:** właściciel zlecił AI dopisanie mocy — pompa głębinowa 750 W, klimatyzator split 900 W,
  kamera IP 5 W (19 pozycji). **D32 potwierdzone z korektą:** zwykły diesel 🟡 ≤ +10°C, 🔴 < +5°C (ścisła
  nierówność — +5°C to jeszcze 🟡); teksty: paliwo zimowe od +5°C, arktyczne < −10°C, świece obowiązkowo,
  dodatek zimowy; zdanie „próg zależy od klasy paliwa (dystrybutor)” usunięte na życzenie właściciela.
- **Chmurki „?” — decyzja D34 (28.09):** wariant **B** (wybrany już w poprzedniej sesji, ale nieodnotowany —
  tu uzupełnione) + chmurki mają bogato wyjaśniać, jak i po co działa kalkulator. Realizacja w osobnej sesji,
  moduł po module. Nowe ekrany od razu w tym standardzie.
- **M12 runda „uproszczone wersje” — E28 (28.09):** odsyłacz = drugi wpis w kaflu M12 (`lib/pulpit/registry.ts`)
  z tym samym `href` co ekran-źródło (M4/E12 `cold-c-rate`, już 2 pola) — bez nowego silnika/strony. Duplikat
  `href` między kaflami jest bezpieczny (klucze React per kafel), ale okruszki `NawigacjaEkranu` pokazują moduł
  źródłowy (`znajdzKafelIEkranPoHref` — pierwsze trafienie, M4 przed M12) — świadomie, „jeden ekran, dwa wejścia”.

## Duplikat D29 i przejęcie gałęzi poprzedniej sesji (28.09.2026)

**Pułapka procesowa (kosztowała jedną pełną partię):** start sesji czytał `docs/lista-do-zrobienia.md` z `main`,
a poprzednia sesja pracowała na niescalonej gałęzi `claude/todo-list-review-l7me97` (bez PR) — tam D29 był już
zrobiony (commit `1b365cc`), razem z M12/E28, E31 i notatką przekazania „następny: E23”. Na `main` wpis D29 był nadal
🔲, więc zrobiłem go drugi raz (ta sama matematyka). Wykryte dopiero na prośbę właściciela. Naprawa bez przepisywania
historii (force-push zablokowany): `git revert` własnego commitu + merge gałęzi poprzedniej sesji (konflikt tylko w
liście zadań — scalone ręcznie: wpisy M12 i D32/D33 z tamtej gałęzi, wpis M14 z `main`). **Od teraz na starcie
sesji:** `git fetch` + lista gałęzi `claude/*` z datami i `git log origin/main..origin/<gałąź>` dla gałęzi z
ostatniej doby — notatka przekazania może leżeć poza `main`. Wkład: `docs/wklad-do-standardu.md`.

**M12/E23 (wrapper do M4/E10)** zbudowany według notatki przekazania — szczegóły w rejestrze pokrycia. Decyzja
interpretacyjna do potwierdzenia: przykład Biblii „wilgotny garaż → IP65” jako ℹ️ zalecenie, nie próg (wpis ⚠️).
→ Rozstrzygnięte **D44** (kalkulator 1.2.0): wszędzie z wilgocią zalecane IP65 (🟡 IP55–IP64); namiot/jacht zawsze
wilgotne, minimum IP65 (🔴), zalecane IP67–IP68 (🟡 IP65–IP66) — praktyka właściciela, nie norma. Numer D44 wybrany
z pominięciem D35–D43 zajętych wtedy na niescalonej gałęzi M14 (H.3) — przy scaleniu z `main` bez kolizji.

## Integracja M14 do Biblii (28.09.2026, „Integruj teraz”)

Polecenie właściciela „Integruj teraz” (F.2/F.4) wykonane na gałęzi odtworzonej z `main` po scaleniu PR #183.
- **Rozdział kanoniczny:** `03_M14_Dom_i_Firma_Siec.md` (Filar B, szablon H.1). To pierwszy moduł opisany
  wprost w Biblii, a nie w `docs/zrodla/Tresc_*`. Opracowanie w `docs/zrodla/` zostaje zapisem weryfikacji:
  ✏️ K1–K14, odczyty DANE-1 i tabele stawek per OSD, do których rozdział odsyła zamiast je kopiować.
  W nagłówku opracowania dopisano status „ZINTEGROWANE”.
- **Decyzje D35–D38**; najwyższy numer na `main` przed nadaniem to D34 (H.3a):
  - D35 — cel i kafle;
  - D36 — stawki jako dane z okresami ważności + tryb „moje dane z faktury”;
  - D37 — FREE/PRO dla M14 odłożone, D2 bez zmian;
  - D38 — autokonsumpcja z profili.
- **Rejestry:**
  - `docs/rejestr-pokrycia.md` — sekcja „Moduł 14”, 28 wierszy `todo` (25 ekranów unikalnych; 3 pary
    wspólnych Dom/Firma liczone raz). Nagłówek pasuje do `policz-rejestr.mjs` (mod 14). `audit:n1` go nie
    obejmuje, bo nie ma numeracji Biblii v2.0;
  - `docs/rejestr-twardych-stopow.md` — 5 stopów M14 jako „zaplanowane, bez kodu” (świadomy wyjątek od
    zasady „nie wyprzedza rejestru pokrycia”, bo chodzi o bezpieczeństwo życia na styku z OSD);
  - `slownik-pojec.md` — sekcja „Sieć i rozliczenia energii”; `mapa-wdrozenia.md` — wiersz M14;
  - `backlog-poza-v1.md` — FREE/PRO M14; `docs/pulpit-i-nawigacja.md` — pozycja kafli (✅🤖, do decyzji);
  - `00_Biblia.md` — dokument 03. Przy okazji poprawiona nieaktualna wersja rejestru decyzji w tabeli
    (1.11 → 1.14).
- **Audyt przyrostowy N.2 rozdziału** (mechanicznie, grep):
  - każdy identyfikator opracowania (K1–K14, R1–R10, RF1–RF3, W3/W4/W6, D1–D14, F1–F13, 5 narzędzi AI)
    ma odpowiednik w rozdziale;
  - każda liczba dziesiętna z rozdziału występuje w opracowaniu;
  - pierwsze przejście znalazło 7 braków (✏️ K2, K10, K11, grupy G12as/G13, okres wypowiedzenia umowy,
    usługi systemowe BESS, portale OSD) — uzupełnione od razu.
- **Pułapka numeracji:** „Kafel 14” to już Ustawienia (D9). Kafle M14 nazywać nazwą albo „M14-D” / „M14-F”.
- **Otwarte:**
  - dane (W3-PGE, W3-Enea netto, Stoen C22a/b, W4, W6, `C_rk`, stawki przyłączeniowe IV–VI, 495,16);
  - decyzje (pozycja kafli, domyślne TCO `N`=15/`r`=0/`g`=0 jako ✅🤖).
  
  Kod M14 zablokowany bramką N.3 (audyt końcowy całej Biblii) i DANE-1.

## M14 — decyzje D39/D40 i „Ścieżka UE” (28.09.2026)

- **Właściciel rozstrzygnął dwie otwarte decyzje M14:**
  - pozycja kafli → **D39**: na końcu, za kaflem 13, a później preset onboardingu;
  - parametry TCO → **D40**: `N` = 15, `r` = 0, `g` = 0 plus suwak, plus nowa opcja **„Ścieżka UE”**.
- **Źródło „Ścieżki UE”:** KE DG ENER, *EU Reference Scenario 2020*, arkusz „main results”, zakładka `PL_A`, wiersz „Average Price of Electricity in Final demand sectors (€'15/MWh)”. Punkty 2020–2050: 123,57 / 133,59 / 145,49 / 146,60 / 155,50 / 157,34 / 158,87. Arkusz podaje: +1,65%/rok (2020–2030), +0,44%/rok (2030–2050).
- **Na 28.09.2026 strona KE nie ma nowszej edycji.** REF2025 był konsultowany w latach 2024–2025, ale nie znalazłem publikacji.
- **Pułapki:**
  - linki `circabc.europa.eu/ui/.../details?download=true` zwracają przez curl 404 (to aplikacja Angular). Działa `https://circabc.europa.eu/rest/download/<id>`;
  - `openpyxl` nie ma w systemie. Instalacja lokalna: `pip install --target <scratchpad>/py`.
- **Audyt:** wiersz ceny w arkuszu to średnia dla **wszystkich** odbiorców końcowych, a status podatków jest nieokreślony. Średnia UE z arkusza (2020: 148,71) nie równa się wykresowi „po podatkach” w raporcie (151). Dlatego do obliczeń wchodzi **tylko dynamika realna**, nigdy poziom.
- **Doprecyzowanie przy okazji:** `r` = 0 oznacza wynik w dzisiejszych zł. `g` (suwak i UE) oznacza zmianę ponad inflację. Wcześniejszy zapis „suma nominalna” był nieprecyzyjny przy cenach wpisywanych dziś.
- **Lista zadań:** osobne wpisy „PDF-y od właściciela (PGE, PME)” (polecenie „Dodaj do listy zadań”) oraz „Ścieżka UE do pliku danych i jej aktualność”.

## M14 — D41 „Ścieżka UE + inflacja” (28.09.2026)

- **Polecenie właściciela:** dwie opcje wzrostu cen na 15 lat: plany UE, oraz plany UE plus średnioroczna inflacja.
- **Wzór:** Fisher `(1+g_UE)(1+π)−1`.
- **Źródła π:**
  - cel NBP 2,5% ±1 pkt, CPI — Uchwała RPP nr 7/2025, M.P. 2025 poz. 1013. Pobrane z `api.sejm.gov.pl/eli/acts/MP/2025/1013/text.pdf`, bo `nbp.pl` blokuje boty kodem 403;
  - średnia GUS z 15 lat 3,58% (2011–2025, geometryczna) z CSV „Roczne wskaźniki cen … od 1950 roku” (stat.gov.pl, kodowanie cp1250).
- **Pułapka źródła:** w pliku GUS wiersz 2025 ma opis „Rok poprzedni = 101” zamiast „= 100”. To błąd opisu, wartość 103,6 przyjęta.
- **Audyt (czapka rewidenta):**
  - inflacja musi obejmować wszystkie koszty bieżące, inaczej off-grid wychodzi sztucznie tanio;
  - suma nominalna przy `r` = 0 faworyzuje inwestycje na starcie, więc ranking idzie według złotych dzisiejszych, a suma nominalna jest pokazywana obok jako „ile zapłacisz”;
  - właściciel nazwał wariant z inflacją „realnym wzrostem”, a w ekonomii to cena nominalna. W UI unikamy słowa „realny”.
- **Otwarte:** która π ma być domyślna (✅🤖 NBP).
- **[28.09.2026] D42:** właściciel chce przełącznik ścieżek cen dokładnie w miejscu suwaka procentów (D7/F8). Jedno pole „Wzrost cen energii”: segmenty „Suwak %” / „Plany UE” / „Plany UE + inflacja”. Treść pod nimi podmienia się w tym samym miejscu, a tabela A–D przelicza się od razu.
- **[28.09.2026] D43:** właściciel wybrał domyślną inflację GUS (średnia 15 lat, 3,58%) zamiast proponowanej NBP 2,5%. Uzasadnienie właściciela: oficjalna inflacja jest zaniżona względem cen. Uwaga rewidenta w D43: to ten sam wskaźnik CPI, a różnica wynika z okna 2011–2025 z szokiem 2022–2023. Przykład kontrolny: 1,9440 w roku 15 i ≈109 699 zł.

## Audyt końcowy N.3 całej Biblii (28.09.2026, polecenie „Audyt końcowy”)

Tryb Audyt (czapka rewidenta). Warstwa „w pełni na końcu” z N.2 — wszystko od nowa, bez „już sprawdzone”.

- **Mechanicznie, w obie strony:**
  - `pnpm audit:n1`: każda pozycja źródła M1–M13 ma wiersz w rejestrze. Braki w plikach `Tresc_*` (M2 1.19, M3 2.15, M12 8.8, M13 7.7, M9 katalogi) są już znane i opisane — to nie nowe luki.
  - `policz-rejestr`: 4 wiersze „?” to sekcja „Funkcje przeniesione” (bez modułu z definicji), nie luka.
  - Rejestr decyzji D1–D43 ciągły.
  - `🔎 TD` ↔ `dlug-techniczny.md`: **TD20 i TD21 bez znacznika w kodzie** — naprawione (tylko komentarze).
  - Terminy `🔎 (do: …)`: brak przeterminowanych.
- **Metadane Biblii:** tabela w `00_Biblia.md` miała nieaktualne wersje 6 plików. Nagłówki mapy, backlogu i słownika też były nieaktualne. Poprawione. Do indeksu dopisane 3 istniejące rejestry.
- **Treść M14 na tle reszty (sens N.3):**
  1. **M7:** warunek zimowy scenariusza D (D5/D7/F8) potrzebuje ekranów M7 7.2 i 7.37, oba `todo`. Zapisane w rejestrze pokrycia.
  2. **M8:** rozdział M14 i stop „backfeed” odsyłają szczegół normowy przełącznika do M8, ale w M8 nie ma na to miejsca. Norma HD 60364-5-551 jest nieobecna (`docs/normy-brakujace.md`, dopisane M14). **Decyzja właściciela.**
  3. **M2/E17 i M7/E8 (kod istnieje):** brak ostrzeżeń „agregat w pomieszczeniu” (CO) i „agregat bez przełącznika”. W M14 to twarde stopy, a źródło M2/M7 ich nie wymaga. **Decyzja właściciela**, czy dopisać je do istniejących ekranów.
- **Rozdziały poza Biblią:**
  - „Dobór napięcia” — rozstrzygnięty 13.09 (rozbudowa M4/E2). `docs/zrodla/README.md` wciąż mówił „nierozstrzygnięte”, dopisana adnotacja.
  - **„Oświetlenie LED”** (szkic 14.09) czeka na kartę katalogową taśmy. Nie było go na liście zadań, dopisany. **Decyzja właściciela:** czy to rozdział blokujący N.3.
- **C.7:** 10 otwartych ✅🤖 w kodzie i rejestrach czeka na potwierdzenie właściciela (lista w `docs/lista-do-zrobienia.md`).
- **Sprawdzone niezależnie z danych pierwotnych:**
  - przykład kontrolny M14: 81 444 / 100 143 / 109 699 zł, mnożniki roku 1 i roku 15;
  - średnie GUS: 3,58 / 4,59 / 3,37 / 3,32;
  - nachylenia UE: 1,65% i 0,44%.

  Wszystko zgodne co do grosza.
- **Wynik:** audyt **nie jest jeszcze zamknięty**. Zamknie go odpowiedź właściciela na 4 decyzje: M8/przełącznik, stopy agregatu w M2/M7, status LED, ✅🤖. Do tego czasu bramka N.3 trzyma kod M14.

## Audyt N.3 — decyzje 1–3 właściciela wykonane (28.09.2026)

- **D47:** szczegół przełącznika sieć – 0 – wyspa mieszka w M14/D11; w rozdziale i w rejestrze stopów „🔎 w M8” przekreślone z adnotacją (F.5).
- **D48:** wspólny blok `lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo.ts`, używany przez M2/E17 (1.1.0) i M7/E8 (1.3.0), narzędzia AI (opcjonalne pola, wspólny schemat `lib/ai/tools/agregat-bezpieczenstwo-schema.ts`) i UI (`components/agregat/pola-bezpieczenstwa-agregatu.tsx`). 🔴 w budynku (czad) i 🔴 bez przełącznika — zawsze, przy sieci i bez (zasada właściciela). 3 notki ℹ️ zawsze: gorące części/opary, paliwo osobno, gaśnica. Teksty PL/EN/RU.
  - **Pułapka:** `usePersistedDraft` zastępuje cały stan zapisem z IndexedDB, bez scalania z `poczatkowy`. Szkic zapisany przed dodaniem pola ma `undefined` zamiast `""`. Zabezpieczone (`|| null` w UI, `!= null` w jądrze). Dotyczy każdego ekranu, któremu dochodzi pole — kandydat do `docs/wklad-do-standardu.md`.
  - Dwa wyjątki (wejście AC falownika, odbiorniki wprost w agregat) to ✅🤖 — dopisane do decyzji 4.
- **D49:** szkic LED = kandydat poza Biblią; zapisany w rejestrze decyzji, backlogu, liście zadań i nagłówku szkicu.
- **Stan N.3:** otwarta tylko decyzja 4 (✅🤖).
- **Przekazanie:** na polecenie właściciela ta sesja nie pisze kodu M14. Instrukcja dla następnej sesji: `docs/przekazanie-nastepnej-sesji.md` (odsyłacz na górze `docs/lista-do-zrobienia.md`).

### Decyzja 4 audytu N.3 — odpowiedzi właściciela (28.09.2026)

- Pozycje 1–2 (D29, D32) były już zapisane na `main` przez równoległą sesję — pytanie w audycie wynikało z tego, że
  audyt robiono na gałęzi M14 bez tamtych commitów (lekcja: przed zadaniem pytań właścicielowi `git fetch` + sprawdź
  `main`, czy odpowiedź już nie istnieje). Nic nie zginęło.
- Odpowiedzi: 1 B (= stan `main`), 2 już ustalone, 3 zostawić, 4/7/8 odłożone, 5 odłożone do PKN (wartości 0,17/0,10/0,13
  podane przez właściciela, przypisanie do przegród do sprawdzenia z normą). Bez odpowiedzi: 6, 9, 10, 11, 12.
  Szczegóły: `docs/przekazanie-nastepnej-sesji.md`, `docs/lista-do-zrobienia.md`.
- **D50 (28.09.2026):** właściciel odłożył pozostałe pytania; bramka N.3 dla M14 zdjęta — kod M14 może startować.
  Stan i kolejność: `docs/przekazanie-nastepnej-sesji.md`, sekcja „STAN NA TERAZ”.

## M12/E38 — uziemienie małej instalacji i dryf rejestru twardych stopów M5 (28.09.2026)

- **E38 zbudowany** jako wrapper (hybryda) do M5/E9/E11. Treść `Tresc_Modul_12` to jedno zdanie — logika wzięta z
  Biblii §12.53 (dawne 8.65), bez liczb i norm spoza niej. Twardy stop obudowy falownika bierze **poziom** z
  `obudowaNiepolaczonaZGsw()` M5/E11 (echo), ale ma własny kod `UMI-…`, bo tekst M5 mówi o GSW budynku, której w
  kamperze/na jachcie nie ma. Poziomy 🔴 gniazd i ℹ️ wilgoci — ✅🤖 do potwierdzenia (lista zadań).
- **Dryf znaleziony (Y.2):** stopy `critical` całego M5 nie trafiły do `docs/rejestr-twardych-stopow.md` (4.3).
  Dopisane tylko M5/E11; reszta jako zadanie 🔲 z wysokim priorytetem. Szybkie wykrycie: pętla po
  `lib/core/modules/<moduł>/*/warnings.ts`, wyciągnięcie kodów z `level: "critical"` i `grep` każdego w rejestrze.
- **Pułapka narzędziowa:** `playwright` nie jest w `node_modules` repo — skrypty weryfikacyjne importują
  `/opt/node22/lib/node_modules/playwright/index.mjs`; headless bez `locale: "pl-PL"` pokazuje teksty EN.

## M14 — start kodu: plik danych `rozliczenia-pl-2026` i część Sieć (28.09.2026)

- **Zakres:** Krok 2a–2c przekazania (bez D3). Silniki `lib/core/modules/siec/*` (8 modułów, wszystkie na liście strażnika
  i18n), dane `lib/core/dane/rozliczenia-pl-2026`, 9 ekranów, kafle 15/16, narzędzia AI `rozbij_rachunek_za_prad`,
  `dobierz_taryfe`, `policz_oplate_za_moc_bierna`. Dwa pozostałe narzędzia z rozdziału (`porownaj_scenariusze_przejscia`,
  `oszacuj_koszt_powrotu_do_sieci`) czekają na TCO i stawki opłat przyłączeniowych.
- **Decyzja techniczna (bez decyzji właściciela — to wykonanie D36):** bramka DANE-1 wymuszona schematem —
  `pewnosc: z.literal("potwierdzone")`; test sprawdza, że podmiana na „wtorne-A” wywraca parsowanie. Ścieżka i wzorzec
  zapisane w `kontrakty-rdzenia.md` §9.
- **Weryfikacja niezależna:** przykład kontrolny §4 (81 444 / 100 143 / 109 699 zł, mnożniki roku 1 i 15) przeliczony w
  Pythonie przed implementacją — zgodny co do złotówki (GUS: 109 699,5 zł, test sprawdza część całkowitą). Progi opłaty
  mocowej G sprawdzone w PDF URE 58/2025 (art. 89b ust. 3: poniżej 500 / od 500 do 1 200 / powyżej 1 200 do 2 800 /
  powyżej 2 800). Pozostałe przykłady rozdziału (0,0381; 0,9 kW; 1 107 zł; +55,3%) w testach.
- **Pułapka:** ścieżka UE z bazą 2026 i N = 25 kończy się na 2051, a projekcja na 2050 — silnik zwraca `OUT_OF_SCOPE`,
  nie ekstrapoluje. Przy budowie D7/F8 UI musi to obsłużyć (np. maks. N = 24 przy „Plany UE”).
- **Pułapka interpretacyjna (zapisana jako założenie, nie decyzja):** limit zwrotu depozytu 20%/30% liczony od wartości
  energii (E × cena), bez mnożnika 1,23 — tak brzmi art. 4 ust. 11a („wartości energii elektrycznej wprowadzonej”).
- **Weryfikacja w przeglądarce:** `pnpm start` + `playwright-core` (Chromium `/opt/pw-browsers/chromium`) — D1 2 373 zł,
  F3 0,0381, D12 0,9 kW, D2 ranking; jedyne błędy konsoli to `/_vercel/insights` (lokalnie nieistniejący skrypt).
- **Pakiet kontroli lokalnie** (CI nie działa do 1.10): typecheck, lint (2 stare ostrzeżenia `<img>`), i18n-guard, 1 901
  testów, build, audit:gate, audit:n1 — zielone.


## M14 — rozdział zbudowany w całości (28.09.2026, „Rób dalej… commit push pr i merge”)

- **Zakres:** reszta części Sieć (D3, D13, D14, F6, F7, F12, F13), cała część Przejście (D4–D7, D9–D11, F8–F10), kreator
  `/kalkulatory/sciezka-przejscia`, pełne listy ekranów w kaflach 15/16. Nowe silniki `siec/bilans-miesieczny`,
  `scenariusze-przejscia`, `przelacznik-siec-wyspa`, `koszt-powrotu`, `strumienie-bess` (na liście strażnika i18n), plik
  `lib/core/dane/dotacje`, narzędzia AI `porownaj_scenariusze_przejscia` i `oszacuj_koszt_powrotu_do_sieci` (5/5 z rozdziału).
- **Wzorzec szkiców (decyzja techniczna):** każdy szkic ma jednego właściciela (`usePersistedDraft`), ekrany echo czytają go
  `useOdczytDraftu` i nigdy nie piszą. Właściciele: D1/F1 `siec-rachunek-*`, D3 `siec-zuzycie-dom`, F6 `siec-zuzycie-firma`
  i `siec-pv-firma`, D4 `siec-pv-dom`. Segment Dom/Firma ekranów wspólnych Przejścia — jeden szkic `siec-segment-przejscia`.
  F7 czyta szkic E23 `oplacalnosc-magazynu` (koszt 1 kWh z cyklu) — zmiana pól E23 zepsuje echo F7.
- **Pułapka:** `new Date()` na statycznie prerenderowanej stronie (dotacje: status naboru) daje błąd hydracji —
  `useSyncExternalStore` z migawką serwera = `stanNa` pliku.
- **Pułapka:** parametr ostrzeżenia z wewnętrznym id (`{strumien}`) pokazałby użytkownikowi kod — rozbite na dwa klucze
  słownika (`SIEC-BESS-STRATNA-AUTOKONSUMPCJA`, `SIEC-BESS-STRATNY-ARBITRAZ`).
- **Nic z pamięci:** linki regulaminów dotacji `null` (W6, TLS), stawki przyłączeniowe od użytkownika, ceny BESS z materiału
  nie weszły do kodu, norma przełącznika 🔎 (`SIEC-PRZELACZNIK-NORMA-BRAK` zawsze widoczne). Uproszczenia: TD23.
- **Pakiet kontroli lokalnie** (CI nie działa do 1.10): wyniki w opisie PR.

## M14 — DANE-1 uzupełnione: Enea netto, Stoen C22, abonament C Tauronu (29.09.2026, „Zrób to”)

- **Enea:** pełna taryfa 2026 to skan w załączniku decyzji URE (strona OSD, link „Decyzja Prezesa URE z dnia 17 grudnia
  2025 r.”) — skopiowana do `docs/zrodla/`, stawki odczytane wizualnie (render strony, nie OCR). Kontrola odczytu:
  netto × 1,23 = informacja OSD o stawkach brutto (grupy G); grupy C nie mają kontroli brutto (dokument OSD obejmuje
  tylko gospodarstwa domowe) — test utrwala wartości.
- **Pułapka dla danych:** Enea (C12a/b, C22a/b) i Stoen (C22a/b) mają w taryfie **jedną** stawkę zmienną sieciową dla
  całej energii w grupach dwustrefowych — strefy różnicują tylko cenę sprzedaży. Silnik liczy per strefa, więc stawka
  wpisana dla obu stref (opis w `zrodlo`). Nie „uzupełniać” drugiej strefy z innego OSD.
- **Tauron C21/C22:** abonament tylko dla okresu 1-mies. (9,50) — przy innym okresie silnik wymaga wpisu z faktury;
  test rachunku przepisany z „brak abonamentu Tauron C” na ten przypadek.
- **Dostęp sieciowy 29.09.2026:** `www.operator.enea.pl` działa; `pgedystrybucja.pl` nadal bez połączenia (TLS) —
  PGE czeka na PDF od właściciela.

## Chmurki „?” i migawka „i” — infrastruktura + M12 (29.09.2026, D51)

- **Polecenie właściciela:** D34 (wariant B) + odpowiedzi 29.09: `hint` usunąć i przenieść do „?”, tłumaczenia PL/EN/RU od
  razu, robić „?” i „i”, a regułę „ekran w komplecie” zapisać i **pilnować** (D51, Dyrektywa #15, wkład do standardu).
- **Stan wyjściowy (policzony):** 220 ekranów, `pomoc=` na 7, `hint=` na 115, `MigawkaBox` na 29; ~590 `<Pole>` + ~49 surowych
  `<input>/<select>`. Po D34 z 36 zmienionych ekranów 30 bez chmurek (cały M14) — dryf, powód strażnika.
- **Architektura:** treść w `lib/i18n/pomoc/<moduł>.ts` (`pl` + `en`/`ru: Tlumaczenie<typeof pl>`), scalana w
  `lib/i18n/pomoc/index.ts`; wpis = ekran (`migawka` + `pola`) albo grupa pól komponentu wspólnego (`pola`, np.
  `kable-male-instalacje`, `checklista-chemii`). Komponenty `components/ui/pomoc.tsx`: `PomocPola` (id ekranu i pola
  typowane — literówka się nie kompiluje) i `MigawkaInfo` (zakładki „Po ludzku”/„Fizyka”, tylko klik — ma przyciski).
  `NaglowekEkranu` przyjmuje `ekran`, `wzor` (= `result.formula`) i `parametry`. Liczby ze stałych silnika: `params` /
  `parametry` z `{nazwa}` (wspólna funkcja `podstaw()` w `lib/i18n/t.ts`).
- **Pułapka (naprawiona przed commitem):** `Pole` owijał `pomoc` w `PomocPole`, a `PomocPola` sam jest „?” — wychodziła
  chmurka w chmurce z samym „?” w środku. `Etykieta` rozpoznaje `PomocPola` (`isValidElement` + `type`) i nie owija.
- **Strażnik:** `scripts/check-pomoc-guard.mjs` (+ test w `lib/i18n/__tests__/pomoc.test.ts`), w CI i w `CLAUDE.md`.
  Lista zapadkowa `scripts/pomoc-guard-baseline.json` — startowo 243 pliki, po M12 226; maleje z każdym modułem.
- **MigawkaBox:** tekst przeniesiony do „i” (pole „O co chodzi”) i ramka usunięta z ekranu — ta sama zasada co `hint`
  (bez dublowania, bez nieprzetłumaczonego tekstu).
- **Znane ograniczenie:** etykiety pól, nagłówki i komunikaty na stronach są nadal tylko po polsku (strony nie są jeszcze
  w i18n) — tłumaczone są komunikaty silników oraz cała treść „?” i „i”. Wzór w „Fizyka” jest w zapisie LaTeX bez
  renderera (tak jak dotąd w `WynikSzczegoly`).
- **Weryfikacja:** Playwright (iPhone 13) — „i” i „?” otwierają się na dotyk, PL/EN/RU, `{params}` podstawione, bez
  poziomego przewijania.
- **Zamknięte 29.09.2026:** wszystkie moduły (M1–M14) w komplecie, lista zapadkowa pusta (255 plików zgodnych). Prop `hint`
  usunięty z `Pole`/`PoleSelect` — typecheck pilnuje, że nie wróci; `PoleCheckbox` go zachowuje. Pułapki z partii: surowy
  `<input>` w `{warunek && (...)}` + `PomocPola` obok wymaga fragmentu `<>…</>`; powtarzające się etykiety w listach
  (np. „Nachylenie” w M1/E4) wymagają osobnych id pól. Przy M10 znaleziona możliwa pomyłka Δt w silniku prognoz — pytanie
  A/B w `lista-do-zrobienia.md`, nie ruszane.

## Opisy narzędzi AI — strażnik (29.09.2026)

- Właściciel: „trzeba naprawić” (pytanie o rozbudowane opisy funkcji dla AI). 27 narzędzi dostało zdanie „Użyj, gdy…”.
- Strażnik `scripts/check-ai-tools-guard.mjs` (+ test `lib/ai/__tests__/ai-tools-guard.test.ts`): description z
  „Użyj, gdy ” (sprawdzane po sklejeniu `"…" + "…"` — wcześniejszy grep po liniach dawał fałszywe braki, bo zdanie bywa
  rozcięte na „Użyj, ” / „gdy”), rejestracja w `lib/ai/pytaj-asystenta.ts`, pokrycie `calculator.ts` → narzędzie
  (wyjątek tylko komentarzem `ai-tool: nie dotyczy — <powód>`). Lista zapadkowa `scripts/ai-tools-guard-baseline.json`
  startowo 18 kalkulatorów. Dyrektywa #15 v1.4, `CLAUDE.md`, CI.

## M12/E38 — D52 i sprawdzenie kolizji po zmianach na `main` (29.09.2026)

- Przed zmianą sprawdzone `main` po scaleniu PR #189 (D51 „pomoc” we wszystkich modułach, M14 w kodzie): E38 przeszedł
  migrację chmurek do `PomocPola` (teksty w `lib/i18n/pomoc/m12-kalkulator-mobilny.ts`) — bez kolizji z silnikiem.
  Dryf rejestru twardych stopów M5 nadal otwarty (nikt go nie ruszył).
- **D52:** gniazda bez styku ochronnego 🟡 z wyjaśnieniem roli bolca, wilgoć 🟡. Przy okazji: ostrzeżenie o wilgoci tylko
  przy DC — przy 230 V z kompletem uziemienia dawałoby fałszywe 🟡. **Pułapka:** zmiana poziomu = też teksty migawki „i”
  (mówiły „nie = czerwony stop”) i opis narzędzia AI, nie tylko `warnings.ts` — grep po kodzie ostrzeżenia i po „czerwony”.

## M12/E38 — D57 słupek, namiot, jacht (29.09.2026)

- **Kolizja numerów (dwukrotna):** równoległe sesje zajęły na `main` najpierw D53 (odpowiedzi na D50), potem D54
  (CRL/gaz/Rsi) — pętla zwarcia ostatecznie = **D56**, to rozszerzenie = **D57** (H.3, pierwszy scalony zachowuje numer).
  Lekcja: przed utworzeniem PR zawsze `git fetch origin main` i sprawdź ostatni numer D w `rejestr-decyzji.md` na main.
- Kamper/jacht: pytanie o zasilanie z zewnątrz; przy N–PE w falowniku — czy rozłączane; nie/nie wiem → 🔴 podwójne N–PE.
  Namiot = nowe miejsce: najpierw N–PE na wyjściu; pływające/nie wiem → 🟡 z zasadami (bez pytań o obudowę, gniazda, RCD).
  Kamper/jacht — ℹ️ (wiszący przewód, szpilka; Wzorzec C jachtu). RCD 🔴 tymczasowo do PN-HD 60364-7-721.
- W repo JEST wyciąg PN-IEC 60364-4-41:2000 z 413.5 (separacja) — właściciel pamiętał słusznie; brakuje wydania 2017.
- **Zasada właściciela (29.09.2026):** gdy poziom/decyzję opieram na słowach właściciela, podaję **dosłowny cytat i gdzie
  padł** (data, która wiadomość/sekcja), a nie samo „Twoje »musi«”. Dotyczy raportu i wpisów ✅🤖 w rejestrach.
- **[29.09.2026] Podwójne N–PE — poziom potwierdzony:** właściciel „Wybieram A” (🔴 dla „nie” i „nie wiem”); podstawa
  PN-HD 60364-5-54, 543.4.3 („niedopuszczalne”) — norma była w repo, wcześniej jej nie powiązałem. Na prośbę właściciela
  ekran (sekcja pętli, gdy słupek/keja) i komunikat tłumaczą fizykę: prąd w PE, wybija RCD na słupku, stary słupek bez RCD
  + przerwany PEN, jacht — korozja i marina. Lekcja: zanim oznaczę poziom ✅🤖, grep po `docs/zrodla/` za regułą ogólną.
- Pułapka: w teście `ac` bazowo zmieniony z kampera na garaż — kamper dokłada ℹ️ i pytanie o słupek, więc testy ogólne
  230 V przestałyby mieć pustą listę ostrzeżeń.

## M12/E38 — D56 pętla zwarcia (29.09.2026)

- Właściciel: ochrona na falowniku nie potrzebuje ziemi, tylko zamkniętej pętli obudowa → PE → N–PE w falowniku →
  falownik; trzy warunki (połączenie wyrównawcze PE, N–PE za zgodą producenta, RCD 30 mA za nim). Wdrożone jako D56:
  pola `polaczenieNPE`, `rcd30mA` (INCOMPLETE bez odpowiedzi), oba braki 🔴; RCD — poziom echo `progPowyzejOchronyOsob`.
- Stare autozapisy bez `npe`/`rcd` → `?? ""` (wzorzec `napor-wiatru`), więc wynik INCOMPLETE, nigdy „OK”.
- Otwarte (⚠️ na liście): pojedynczy odbiornik z wyjścia pływającego (separacja elektryczna) — dziś 🔴; bez źródła normy
  nie rozstrzygam.

## Rsi per kierunek — liczby odtworzone (29.09.2026)

- Decyzja z 28.09 („Rsi per kierunek, wartości z PN-EN ISO 6946, właściciel dostarczy PKN”) została zapisana **bez
  liczb** — w pamięci zostało samo „0,10/0,17”. Przy pkt 4 audytu właściciel podał liczby z pamięci
  (0,17/0,10/0,13 ściany/dach/podłoga) i zostały zapisane dosłownie. **Korekta właściciela 29.09:** wiążące są
  wartości z decyzji: **ściana 0,13 · strop/dach (strumień w górę) 0,10 · podłoga (strumień w dół) 0,17 m²·K/W**
  (✅🤖). Kod E8 bez zmian (0,13 wszędzie) do sprawdzenia końcowego z PKN — nie pytać ponownie.
- **Pułapka:** decyzję z wartościami liczbowymi zapisuj od razu z liczbami i ich przypisaniem, nie samym „tak”.

## D53 — odpowiedzi właściciela na odłożone pytania (29.09.2026)

- **M8/E3 zamki:** nowe pole `maOtwarcieReczneMechaniczne` (opcjonalne w typie — stare szkice i wywołania AI go nie
  mają, czytane jak `false`; w UI `?? false`). 🔴 tylko fail-secure bez UPS **i** bez ręcznego otwarcia. E3 → 1.1.0.
- **Agregat (D48 pkt 4):** „zawsze przez rozdzielnię” — enum bez zmian (szkice), zmienione tylko etykiety, teksty
  PL/EN/RU, chmurka i opis AI. Poziomy ℹ️ zostają.
- **Kafle M14:** widoczne we wszystkich 8 presetach — presetów nie ma jeszcze w kodzie (onboarding w backlogu).
- **Bez zmian w kodzie:** M8/E4 gaz (rekomendacja mgła wodna, czeka na wybór), M9/E2 (ESP32 z osobnego zasilania),
  M9/E4 CAN (właściciel jeszcze nie wie; rekomendacja 🔴).

## Sprawdzenie stanu po D53 (29.09.2026, „sprawdź jak daleko poszedł projekt”)

- `main` = scalenie #211; brak otwartych PR; gałęzie `claude/*` przed `main` pochodzą sprzed 28.09 i ich treść jest już
  na `main` (np. `youthful-fermat` → #154). Żadne z otwartych pytań nie zostało rozwiązane równolegle.
- Źródła repo: gaz przy LiFePO4 — Biblia v2.0 §4.10 (mgła wodna / środek do magazynów energii „jedyny skuteczny”);
  CAN — §9.28 to samo ostrzeżenie co RS485. Rsi kierunkowe i kolejność przycinania CRL — brak w repo.
- Poprawione nieaktualne wpisy: lista „Otwarte” w 03_M14 (Enea netto, Stoen C22 były już ✅), tabela i pkt 6 w
  „STAN NA TERAZ”, wskaźnik startowy na górze `docs/lista-do-zrobienia.md`.

## Prognozy M10 — Δt, decyzja A; narzędzia AI domknięte (29.09.2026)

- Właściciel wybrał **A**: punkt prognozy = średnia moc [kW] w oknie 3 h, energia = Σ P × 3 h. Silnik `ai/prognozy` 1.0.0
  sumował same kW (energia ×3 za mała); 1.1.0 mnoży przez stałą `KROK_PROBKOWANIA_H = 3` i ma wzór w `formula`.
  Demo: 27,3 / 26,1 / +1,2 kWh. Ekran nadal na danych demonstracyjnych (TD7), więc bez wpływu na projekty użytkowników.
- **Pułapka:** pola `…Kw` sumowane do wyniku `…Kwh` bez Δt — przy kolejnych szeregach czasowych (symulacja SoC 12.4,
  dane live) krok próbkowania musi być jawny w silniku, nie domyślny „1 h”.
- Narzędzie `policz_bilans_prognozy`; lista zapadkowa `ai-tools-guard-baseline.json` pusta — każdy kalkulator ma
  narzędzie AI albo adnotację `ai-tool: nie dotyczy — powód` (jedyna: `lokalizacja-i-klimat`).

## D54 — CRL od budynku, gaz 🟡 z propozycją, kafle M14, Rsi (29.09.2026)

- **CRL (M5/E2 1.1.0):** `kolejnoscOdBudynku?: OdcinekCrl[] | null` — opcjonalne (stare szkice, AI). Niewymienione
  typy dochodzą na koniec w kolejności ostrożnej. Bez kolejności wynik identyczny jak 1.0.0 (testy A.1–A.4 bez zmian).
  Przy CRL ≥ 1000 zawsze ℹ️ `CRL-SPD-ZALECANY` — preferencja właściciela, nie wymóg normy; werdykt nadal „nie wymaga”.
- **Gaz (M8/E4 1.1.0):** ℹ️ `GASZ-PROPOZYCJA-LIFEPO4` przy każdym środku spoza wymaganych w strefie LiFePO4.
  Chłodzenie/zamrażanie ogniw to propozycja AI bez liczb (brak źródła) — ✅🤖.
- **Rsi:** bez zmian w kodzie (0,13 ze źródeł); wartości kierunkowe czekają na PN-EN ISO 6946.
- Otwarte z listy D50: tylko M9/E4 CAN.

## Whitepaper IEC 62109-1 przeczytany + przegląd kompletności źródeł (27.09.2026)

- **Dlaczego wisiał nieprzeczytany:** sesja dodająca 4 pliki (27.09) rozpoznała go tylko po
  metadanych i odłożyła odczyt jako 🔲; sesja „ekrany odblokowane” wzięła na warsztat tylko normy
  odblokowujące ekrany i whitepaper pominęła, choć odnotowała go jako nieprzeczytany. Pułapka:
  wpis 🔲 „dokończyć odczyt” nie ma właściciela-ekranu, więc przegrywa z zadaniami kodowymi —
  przy każdym „przerób nowe dokumenty” przejrzyj wszystkie 🔲 dotyczące `docs/zrodla/`.
- **Wynik:** TI SLYY102 (2016), 11 stron (indeks podawał 14 — błąd z odczytu metadanych, poprawiony).
  Izolacja wewnątrz falownika (projektant elektroniki), nie instalacja → nic do kodu, luka normy 🟡.
- **Przegląd 22 folderów:** tylko ten plik był nieprzeczytany. 6 PDF `document-download 4–9`
  miało treść w `.txt`, ale indeksy nie wymieniały nazw oryginałów — dopisano mapowanie. Skrypt
  kontrolny (każdy plik folderu wymieniony z nazwy w `00-INDEKS.md`) — do powtarzania przy kolejnych paczkach.

## Przegląd niescalonych gałęzi zdalnych (29.09.2026)

- **Pułapka:** klon w sesji chmurowej jest płytki (`git rev-parse --is-shallow-repository` → `true`). Na płytkim klonie
  `git diff main...gałąź` daje „no merge base”, a `rev-list main..gałąź` pokazuje setki „niescalonych” commitów na
  prawie każdej gałęzi. Przed oceną gałęzi zawsze `git fetch --unshallow origin`.
- **Wynik (po odpłytczeniu):** 10 gałęzi miało commity spoza historii `main`, ale 8 z nich było już scalonych przez
  squash (PR #136–#139, #149, #153, #154, #163 — ta sama treść, inne SHA). Naprawdę brakowały 2 commity:
  `49b2d64` (`prace-rozdzialy-status-qb0uwf` — 2 wpisy 🔲 listy zadań: powrót CI 1.10, Δt prognoz M10) i `f139f78`
  (`screen-fixes-new-documents-80kzcm` — odczyt whitepapera IEC 62109-1 + mapowanie PDF→txt w indeksach). Przeniesione
  na `claude/git-branches-merge-o7sy31`; konflikty wyłącznie typu „oba dopisały na końcu” w plikach append-only —
  zachowane obie strony (PR #219). Pozostałe gałęzie zdalne nie wnoszą już nic ponad `main`.
- **Błąd procesu tej sesji:** przegląd powtórzył pracę z 27.09 — lista gałęzi-śmieci jest wyżej („Porządki gałęzi na
  GitHubie”, 27.09.2026). Przy poleceniu „sprawdź/scal gałęzie” najpierw ta lista; sprawdzać tylko gałęzie spoza niej.
  Poza listą 27.09 do usunięcia doszły gałęzie scalone później (wszystkie `claude/*` z PR #166–#219, m.in.
  `prace-rozdzialy-status-qb0uwf`, `screen-fixes-new-documents-80kzcm`, `e38-uziemienie-c3xs6h`,
  `nowy-rozdzial-biblia-kalkulator-to73by`). Stan 29.09: **każda gałąź zdalna poza `main` jest do usunięcia**.
  Kasowanie z sesji nadal niemożliwe (`git push --delete` → HTTP 403, sprawdzone 29.09) — robi to właściciel ręcznie.

## Synchronizacja ze standardem — Y.6 (29.09.2026, 19:00 UTC, na polecenie właściciela „przeprowadź aktualizacje”)

- Świeży płytki klon `new-app-standards` (`af63da7`, 29.09 18:50 UTC), tylko odczyt, bez `register_repo_root`.
  `AKTUALIZACJE.md` 112 → 114 linii: dwa wiersze 2026-09-29 (blok U.4 z tego projektu — 8.12, 11.9, 15.23, dopiski
  4.3/5.5/8.4/9.0a/10.4/17.1a/17.9; oraz 8.4b — forma „i”: zakładki „Po ludzku”/„Fizyka”).
- *NIETYKALNE (pełny nadpis):* `docs/standards/` 00-INDEKS, 04, 05, 08, 09, 10, 11, 15, 17. GOD BOOK `v2_39`,
  `PROMPT_STARTOWY.md`, `docs/przyklady/i18n/*` — identyczne. `docs/przyklady/pwa/` — nadal świadomie niekopiowany
  (pytanie do właściciela z 26.09 otwarte).
- *ADAPTOWALNE (patch):* `CLAUDE.md` — z `CLAUDE.template.md` dopisane 3 akapity: 15.23 (nowy wiersz) oraz 15.21 i 15.22,
  których brakowało od synchronizacji 24.09 (wtedy czekały na zgodę; od korekty Y.6/Y.8 z v2.38 ADAPTOWALNE stosuje się
  bez pytania). Skill: przywrócone „decyzja D#” ze źródła.
- *LOKALNE:* `docs/wklad-do-standardu.md` — 9 wpisów → ✅ skonsolidowane (w tym wpis 28.09 o liście na `main`, który nie
  miał linii `Status:`). Otwarte po stronie źródła: pkt 7–13, 15, 17–21 wpisów z 27–29.09 i wpisy z 26.09 (locale, OCR, N.1).
- **Y.2 — dryf kodu od nowych reguł, naprawiony od razu:** (1) 5.5 — `usePersistedDraft` zastępował stan szkicem;
  teraz `scalSzkic` nakłada szkic na stan początkowy (płytko, tylko zwykłe obiekty) + test „stary szkic bez nowego
  pola”. Wzorzec `?? ""` w ekranach zostaje (nieszkodliwy), nowych już nie wymaga. (2) 11.9 — puste listy zapadkowe
  `pomoc-guard-baseline.json`/`ai-tools-guard-baseline.json` usunięte, strażniki bez logiki listy.
- **Nie naprawione teraz (na liście zadań):** `MigawkaInfo` wobec 8.4b (brak `assumptions` w „Fizyka”, brak panelu od dołu
  na telefonie, cyfry w tekstach „Fizyka”); strażnik rejestru twardych stopów (4.3/11.9).
- **Checklista Y.9:** 1 `docs/standards/` ✅ (20 plików = źródło) · 2 GOD BOOK ✅ v2_39 · 3 `CLAUDE.md` ✅ (patch) ·
  4 pełna Biblia ✅ 14/14 · 5 lista ✅ · 6 wkład ✅ · 7 `docs/zrodla/` ✅ · 8 skill ✅ (patch) · 9 `01_`/`02_` ✅.
  Y.10: bez nowych modułów opcjonalnych (oba obecne).
- **Pakiet lokalny (CI nie działa do 30.09):** typecheck, lint (0 błędów, 2 stare ostrzeżenia `<img>`), `check:i18n-guard`,
  `check:pomoc-guard` (255 plików), `check:ai-tools-guard` (200/200), `audit:n1`, `audit:gate`, test 2089/2089, build — zielone.
- **Routine Y.6** `trig_01892Z45ThAi2T56PJRjQQAh` nie istnieje (not found) — nikt jej nie przestawiał od 27.09; pytanie
  do właściciela na liście.
- Cykl adaptacyjny: nowa treść → `interwał_h = 12`, `licznik_zero_z_rzedu = 0`. Kolejne sprawdzenie najpóźniej
  30.09.2026 ok. 07:00 UTC.

## Y.11 — pierwszy audyt zgodności kodu (29.09.2026, na żądanie właściciela)

- Raport: `docs/audyt-zgodnosci-kodu.md` (nowy plik, LOKALNE). 7 pozycji rejestru: 5 ✅, 1b ⚠️ nowe, 7 ⚠️ znane.
- **1b:** ekrany zmienione 29.09 (m.in. E38 `uziemienie-male-instalacje`, M14 `przelacznik-siec-wyspa`, `components/siec/*`)
  dodały polskie teksty JSX bez `t(...)`. `check:i18n-guard` pilnuje tylko silników — JSX nie ma strażnika, stąd dryf.
  Kodu nie zmieniono (Y.11) — decyzja właściciela A/B/C w raporcie.
- **7:** bramka logowania w `middleware.ts` wyłączona do czasu projektu Supabase — bez zmian od 15.09.
- **Pułapka tej sesji:** `git checkout -B <gałąź> origin/main` po scaleniu PR przez API — lokalny `origin/main` był sprzed
  scalenia (fetch zrobiony wcześniej). Zawsze `git fetch origin main` tuż przed takim resetem.

## D58 — teksty ekranów przez klucze UI-*, strażnik i18n na warstwie UI (29.09.2026, „wybieram A + B”)

- **Architektura:** teksty pisane przez sam ekran (etykiety, nagłówki, akapity) żyją w `lib/i18n/ui/<grupa>.ts` — `pl` (as const)
  jest źródłem, `en`/`ru` typowane `Record<klucz, string>`, więc brak tłumaczenia to błąd `tsc`. Klucze `UI-*`, scalane w
  `dictionaries.ts` obok komunikatów silników — ekran używa zwykłego `t()`/`useTranslate()`. `lib/i18n/ui/index.ts` importuje
  wszystkie części (po dodaniu pliku dopisz import). Test `lib/i18n/__tests__/ui.test.ts`: prefiks, unikalność (także wobec
  `dictionary-pl`), te same klucze i `{parametry}` w EN/RU.
- **Zdanie z wariantami = osobne pełne klucze**, nie sklejanie fragmentów (E38: `-J` jacht / `-K` kamper) — każdy język ma
  własną odmianę i szyk. Tablice etykiet (`MIEJSCA`, `FLAGI`, `KOLEJNOSCI`) trzymają klucze, render przez `t(label)`.
- **Strażnik:** `scripts/check-i18n-ui-guard.mjs` (AST, w `pnpm check:i18n-guard`). Lista zapadkowa
  `scripts/i18n-ui-guard-baseline.json` sporządzona raz 29.09.2026: 248 plików, 3711 tekstów — wszystkie ≤ stanu sprzed
  zmian 29.09 (commit 97dacda). `--pokaz <plik>` wypisuje trafienia, `--policz` bieżące liczby. Liczba per plik, więc także
  dopisanie tekstu do starego ekranu zatrzymuje build — nowy tekst na takim ekranie: `lib/i18n/ui/dopiski-starych-ekranow.ts`.
  Znana luka (w nagłówku skryptu): polskie słowo bez polskich liter, poza JSX i poza nazwami typu `label`, nie jest wykrywane.
- **Korekta zakresu audytu Y.11 1b:** raport mówił o ≈15 plikach; faktycznie ~40 plików M14 + E38 miało nowe teksty (m.in.
  całe `tresci-faq.ts`, `tresci-przejscia.ts`) — przetłumaczone wszystkie (≈580 kluczy). Pliki, w których 29.09 tylko
  przeformatowano stare teksty (hint → „?”), zostały na liście zapadkowej z bieżącą liczbą.
- **Pułapki tej pracy:** (1) generator słowników obcinał wieloliniowe teksty — po wygenerowaniu zawsze sprawdzić, że każdy
  oryginał PL jest w pliku; (2) skrypt podmieniający wstawiał `const t = useTranslate()`, a potem sprawdzał „czy jest
  `useTranslate`” zamiast ścieżki importu — 25 błędów TS2304; (3) heredoc bez cudzysłowu (`<<EOF`) wykonał backticki z
  komentarzy jako polecenia powłoki i wyciął fragmenty komentarzy — do skryptów z kodem TS zawsze `<<'EOF'`; (4) hook
  `useTranslate()` przed każdym wczesnym `return` i osobno w każdej funkcji-komponencie (np. schemat SVG w E38).
- **Poza zakresem (bez zmian):** parametry liczbowe formatowane `toLocaleString("pl-PL")` (np. „1 234”) trafiają do tekstu
  jak są; dane katalogu dotacji (`lib/core/dane/dotacje`) zostają po polsku (nazwy programów).
- **Dokończenie (29.09 wieczór, pełny pakiet):** zielony po jednej poprawce spoza D58 — znów timeouty 5 s w
  `orientacja-powierzchni.test.ts` i `modul1-lokalizacja-tools.test.ts` (za każdym przebiegiem inne testy; w izolacji też
  bywa > 5 s). Pułapka z 25.09 wróciła, bo limit dodawano test po teście. Teraz `{ timeout: 30_000 }` na poziomie
  `describe` dla każdego bloku wołającego `calculateOrientacjaPowierzchni` (pełny rok TMY). Nowy test w tych blokach
  dziedziczy limit — nie trzeba o nim pamiętać.
- **Znane, poza zakresem:** `components/wzorce/krok-z-media.tsx` („Miejsce na zdjęcie/nagranie…”) i okruszki nawigacji
  zostają po polsku w EN/RU — stare teksty z listy zapadkowej, wpis „Tłumaczenie samych stron”.

## Porównanie `public/sw.js` ze wzorcem PWA standardu (29.09.2026, na żądanie właściciela)

- Zamyka pytanie z 26.09 (pkt 2 sprawdzenia Y.6). Raport: `docs/audyt-sw-vs-wzorzec-pwa.md` (LOKALNE). Kod bez zmian —
  decyzja właściciela A/B/C w raporcie (rekomendacja: A etapami = C).
- **Pomiar na buildzie produkcyjnym:** nieodwiedzony ekran offline → `net::ERR_FAILED`; maskotki `public/` i manifest
  offline nie działają; cache `offgrid-v1` rośnie o stare chunki przy każdym deployu ze zmianą kodu (`CACHE_VERSION`
  nigdy niepodbijany, `sw.js` bajtowo stały → SW nigdy się nie aktualizuje).
- **Uśpiony błąd:** `matcher` w `middleware.ts` nie wyklucza `/sw.js`, `/register-sw.js`, `/manifest.webmanifest` —
  po włączeniu bramki Supabase (18.1) niezalogowany dostanie przekierowanie zamiast skryptu SW.
- **Pułapka (testy SW):** `context.setOffline(true)` Playwrighta nie obejmuje `fetch()` z wnętrza Service Workera —
  strona „działa offline”, bo SW pobiera ją z sieci. Prawdziwy offline = ubity serwer. Zgłoszone do standardu (10.8).
- Koszt pełnego precache dziś ≈ 26 MB (HTML 220 kalkulatorów 6,1 MB + chunki 14 MB + `media` 4,2 MB + `public/` 1,5 MB).

## SW — decyzja „wariant C” + poprawka `matcher` (29.09.2026)

- **Decyzja właściciela:** migracja SW do wzorca standardu etapami (C). Plan dla innej sesji:
  `docs/plan-migracji-sw-wariant-c.md` (decyzje C-1…C-3 do potwierdzenia na starcie etapu 1, potem D# w
  `rejestr-decyzji.md`).
- **Zrobione od razu:** `middleware.ts` `matcher` pomija `/sw.js`, `/register-sw.js`, `/manifest.webmanifest`
  (raport, pkt 12). Skutek uboczny, świadomy: odpowiedź ze skryptem SW nie ma nagłówka CSP (SW rozmawia tylko z własnym
  originem). Sprawdzone na buildzie: `/` i kalkulator — CSP jest; trzy pliki PWA — bez middleware.
- **Synchronizacja Y.9 (wycinek):** `docs/przyklady/pwa/` + `README.md` + `PROMPT.md` skopiowane 1:1 z
  `new-app-standards` @ `af63da7` (same dopisania, zero usunięć) — sesja wykonawcza nie potrzebuje dostępu do tamtego repo.
  Pliki `.ts/.tsx` wzorca importują moduły projektu źródłowego (`sonner`, `@/lib/pwa/*`) → `tsconfig.json` `exclude`
  dostał `docs/przyklady` (inaczej `pnpm typecheck` pada).
- **Pułapki znalezione przy planowaniu (do etapu 1):** (1) `/moduly/[id]` wzorzec pomija jako trasę dynamiczną —
  rozwinąć z `KAFLE`; `prerender-manifest.json` jest pusty przez nonce. (2) Po włączeniu Supabase instalacja SW u
  niezalogowanego zapisałaby stronę logowania pod adresem każdej strony (`bezPrzekierowania`) — plan dodaje strażnika.
  (3) Stary cache `offgrid-v1` nie zostanie usunięty przez nowy `aktywuj()` — plan dodaje jawne usunięcie.
  (4) W `.next/static/media` są wersje `-dev` MapLibre (~2,5 MB) w buildzie produkcyjnym — etap 2.
  (5) `pkill -f "next start"` ubija powłokę wywołującą (exit 144) — ubijać po PID / grupie procesów.

## D58 — uzupełnienie + pułapka „dwie sesje w jednym katalogu” (29.09.2026, wieczór)

- Uzupełnienie wpisu „Dokończenie” wyżej: ten sam brak limitu miał też blok TMY w `analiza-zacienienia.test.ts`
  („strata całkowitego napromieniowania na danych TMY (TD14)”) — dostał `{ timeout: 30_000 }` na `describe`.
- **Pułapka:** dwie sesje Claude pracowały równocześnie w tym samym katalogu roboczym i na tej samej gałęzi (obie
  domykały D58). Skutki: pełne pakiety testów szły równolegle (2× obciążenie 4 rdzeni → więcej timeoutów), edycje jednej
  sesji pojawiały się w drzewie drugiej w trakcie pomiaru, commit jednej wszedł pod commit drugiej. Przed startem
  zadania z listy sprawdź `git log`/`git status` jeszcze raz tuż przed commitem i nie uruchamiaj dwóch sesji na jednym
  checkoutcie — druga sesja w osobnym worktree.
- **Otwarte (przywrócone z notatki usuniętej przy konsolidacji):** w pierwszym przebiegu pakietu padły jednorazowo
  4 testy `orientacja-powierzchni`/`modul1-lokalizacja-tools`, choć ich `describe` miało już 30 s (Vitest 4.1.11 dziedziczy
  `timeout` z `describe` — sprawdzone w `@vitest/runner`); dwa kolejne przebiegi zielone, komunikatu błędu nie zachowano.
  Hipoteza (niepotwierdzona): drugi pakiet drugiej sesji w tym samym czasie albo limit dopisany w trakcie pomiaru. Jeśli
  wróci — zapisać pełny komunikat przed ponownym uruchomieniem (10.x: nie zakładać „flaky”).

## Strażnik rejestru twardych stopów — `pnpm check:stopy-guard` (29.09.2026, wieczór)

- Wdrożony wg 4.3 (dopisek 29.09) + 11.9: `scripts/check-stopy-guard.mjs` (AST), w pakiecie przed merge, w `ci.yml`
  i w `CLAUDE.md`. Stan na wejściu: **265 kodów 🔴** w `lib/core/**` → 69 w rejestrze, 145 wyjątków
  (`scripts/stopy-guard-wyjatki.json`: 134 „walidacja-danych” + 11 „poza-zakresem-modelu”), **51 na liście
  zapadkowej** (`scripts/stopy-guard-baseline.json` — stopy inżynierskie albo niejednoznaczne, jeszcze bez wpisu).
- Klasyfikacja wyjątków po `technicalMessage` każdego kodu („oczekiwano > 0”, zakres, sprzeczne pola, dane spoza
  tabeli), nie po nazwie. Niejednoznaczne (np. `ZA-DUZO-OGNIW`, `ZACIENIENIE-PELNY-PANEL`, `SYSTEM-NIE-PRZETRWA-SCENARIUSZA`)
  celowo na liście zapadkowej — rozstrzygane przy uzupełnianiu rejestru (wpis w rejestrze albo wyjątek z powodem).
- **Pułapki wykryte przy budowie:** (1) nie każdy stop to literał `{ code, level: "critical" }` — są funkcje pomocnicze
  `ostrzezenie("KOD", "critical", …)` (M14), poziom z innego ostrzeżenia (`obudowaNiepolaczonaZGsw().level`), `level:
  zmienna` (`KONFLIKT-JEDNOCZESNOSCI`) i kod przekazywany parametrem (`brakWentylacjiOlowiowy(kod, …)` dla
  `BK-/LG-OLOW-BEZ-WENTYLACJI`) — pierwsza wersja zbierająca same literały przegapiła 13 stopów, które rejestr już
  wymieniał. Poziom nieliteralny = traktowany jak 🔴 (ostrożnie); kod z parametru = „źródło dynamiczne” do zadeklarowania
  w JSON. (2) Każdy kod w odwrotnych apostrofach w rejestrze liczy się jako wpis — przykład w tekście opisowym
  (`` `PARA-POZA-ZAKRESEM` ``) od razu dał konflikt „i w rejestrze, i w wyjątkach”; w prozie rejestru nie cytować kodów,
  które nie są stopami.

- **[29.09, później] Lista zapadkowa 51 → 2:** 46 kodów dopisanych do rejestru (sekcje wg kategorii, notka HTML-komentarz
  w „Elektryczne / pożarowe”), 3 kody sekwencji montażu (status OUT_OF_SCOPE) do „poza-zakresem-modelu”. Zostają
  `ZACIENIENIE-2-SEKCJE`/`-PELNY-PANEL` — pytanie o poziom (strata uzysku, nie bezpieczeństwo), `lista-do-zrobienia.md`.
  **Rozstrzygnięte tego samego wieczoru (właściciel: wariant B):** oba obniżone do 🟡 `warning` (strata uzysku ≠ twardy
  stop; źródło daje tu 🟡), M3/E13 `CALCULATOR_VERSION` 1.0.1. Lista zapadkowa **pusta** — każdy nowy 🔴 bez wpisu w
  rejestrze albo wyjątkach od razu wywraca `check:stopy-guard`.
  Klasyfikacja po treści funkcji w `warnings.ts` — wyciąganie `technicalMessage` wycinkiem tekstu wokół kodu łapało
  komunikat sąsiedniej funkcji; wiarygodnie tylko przez AST (całe ciało funkcji).

## 8.4b — „i” z założeniami i panel od dołu na telefonie (29.09.2026, wieczór)

- `MigawkaInfo`/`NaglowekEkranu`: prop `wzor` zastąpiony przez `wynik` (`Partial<Pick<CalcResult, "formula" |
  "assumptions">>`, może być `null` przed obliczeniem) — zakładka „Fizyka” pokazuje wzór i założenia bieżącego wyniku.
  Założenia renderuje **jeden** komponent `components/zalozenia-lista.tsx` (pod wynikiem przez `WynikSzczegoly` i w „i”).
  Nowy ekran z wynikiem: `wynik={result}` w `NaglowekEkranu`, nie osobne pola.
- `Chmurka` (`components/ui/chmurka.tsx`) na szerokości < 640 px renderuje Base UI `Drawer` (panel od dołu) zamiast
  `Popover` — dotyczy „?” i „i” (8.4b: „oba otwierają się tak samo”). Hook `useTelefon` na `useSyncExternalStore` +
  `matchMedia`; `unstable-use-media-query` z Base UI celowo nie użyty (API niestabilne). Serwer renderuje wariant desktop.
- **Pułapka weryfikacji:** zrzut ekranu tuż po dotknięciu łapie panel w trakcie animacji (wygląda, jakby się nie
  otworzył), a współrzędne elementów z tego zrzutu są przesunięte — sprawdzać `[role=dialog]` w DOM i klikać po `ref`.
- Worktree bez własnego `node_modules` uruchamia vitest z katalogu nadrzędnego (rozwiązywanie modułów w górę drzewa),
  ale `pnpm typecheck` pada („tsc: not found”) — w nowym worktree najpierw `pnpm install --frozen-lockfile`.

## 8.4b pkt (3) — liczby silnika w tekstach pomocy przez `parametry` (30.09.2026)

- 16 ekranów: tekst `lib/i18n/pomoc/*` ma `{nazwa}`, strona podaje stałą z `constants.ts` w `parametry` (`NaglowekEkranu`)
  albo `params` (`PomocPola`). Kryterium: liczba jest stałą silnika → parametr; stała strukturalna wzoru, przykład,
  numer normy/artykułu, liczba bez stałej w silniku → zostaje w tekście. Pełna lista: `docs/lista-do-zrobienia.md`.
- Stawki ustawowe M14 (VAT, depozyt, zwrot, k) nie są stałymi, tylko okresami w `rozliczenia-pl-2026.json` —
  `stawkiDoPomocy()` (`components/siec/wspolne.tsx`) bierze wartość roku danych przez `wartoscNajdluzej` (jak silnik
  mocy biernej, D36). Nowy tekst M14 cytujący stawkę → ten sam helper, nie liczba w tekście.
- `podstaw()` zamienia `.` na przecinek w PL/RU tylko dla `number` albo tekstu w pełni dziesiętnego — ułamki z długim
  rozwinięciem podawać przez `toFixed()` (np. `WSPOLCZYNNIK_KWH_NA_L_K.toFixed(6)` → „0,001163”).
- **Pułapka:** zamiana tekstu po dosłownym fragmencie ominie język, w którym zdanie ma inny szyk (tu: RU depozytu).
  Pilnuje test „te same `{parametry}` w PL/EN/RU” (`lib/i18n/__tests__/pomoc.test.ts`) — nie wyłączać.

## Stałe silnika w `FORMULA` — wzór składany, nie przepisywany (30.09.2026)

- Kontynuacja 8.4b pkt (3). Ciągi `FORMULA` 15 kalkulatorów składane szablonem ze stałych przez `latexLiczba()`
  (`lib/core/latex.ts`, przecinek LaTeX `1{,}25`); wyniki obliczeń bez zmian, wersje kalkulatorów +patch.
- Wyciągnięte stałe: współczynniki wind chill (`WIND_CHILL_A…D`, `WIND_CHILL_WYKLADNIK`) i
  `WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA` (1,25 — reguła produktowa, osobna od K1 normy PV; `kable-bezpieczniki-male`
  używa tej samej stałej, bo i tak woła ten kalkulator).
- Depozyt: `k_dep` i `p` są okresami w danych, więc wzór bazowy symboliczny, a po rozstrzygnięciu daty dopisuje
  wartości dla miesiąca (`formulaZeStawkami`) — nie liczba „z roku danych” jak w pomocy.
- Strażnik: `lib/core/__tests__/formula-constants.test.ts` — żaden `calculator.ts` nie ma literału `\d{,}\d`, poza
  jawną listą strukturalnych (½ w naporze, 3,6·10⁶ J/kWh). Liczby całkowite (np. 25 °C) guard nie łapie — przegląd.

## SW wariant C — etap 1 (29.09.2026, D59)

- **Od 29.09: Service Worker = wzorzec standardu** — `app/sw.js/route.ts` (`force-static`) + `lib/pwa/sw-rdzen.js`
  (czysty JS, test `node:vm`) + lista precache `lib/pwa/precache.ts` (czysta) / `precache-build.ts` (czyta `.next`) +
  `lib/pwa/aktualizacja-sw.ts` + `components/pwa/sw-rejestracja.tsx` (toast) + `components/pwa/powiadomienia.tsx`
  (`<Toaster>` sonner, kolory z tokenów). **Nie** `public/sw.js`/`register-sw.js` (usunięte). Nowy toast w aplikacji =
  `toast` z `sonner` (host już jest w `app/layout.tsx`), nie własny komponent.
- **Odstępstwa od wzorca (plan 1.1–1.5):** prefiks `offgrid-precache-`; bez `slownikiPrepaint` (słowniki są w chunku);
  `trasyDynamiczne` = `/moduly/<id>` z `KAFLE`; `/auth/login` poza precache i `/auth/**` zawsze sieć; strażnik
  przekierowania na logowanie w `pobierzDoCache`; `aktywuj()` i wyłącznik kasują też stary `offgrid-v1`; wykluczenia
  MapLibre (`public/maplibre/**`, `media/maplibre-gl*`) i `public/placeholder*`; teksty przez klucze `UI-PWA-*`
  (`lib/i18n/ui/pwa.ts`, mechanizm D58 zamiast kluczy `pwa.aktualizacja.*` z planu); odwołania w komentarzach
  wskazują dokumenty tego repo.
- **Fakty sprawdzone:** w chwili prerenderu `app/sw.js/route.ts` (Next 16.3 + Turbopack) `.next/BUILD_ID`,
  `app-path-routes-manifest.json` i kompletny `.next/static` już istnieją (sonda: 254 chunki w trakcie = 254 po buildzie).
  `wersja` SW zmienia się przy każdym buildzie (losowy `BUILD_ID` = `rev` stron) — to oczekiwane, chunki (`rev: 'i'`)
  i tak są reużywane. Precache: 539 wpisów, **21,3 MB**. Hydracja z komponentem rejestracji — bez `#412`.
- **Wyłącznik awaryjny:** deploy zbudowany z `NEXT_PUBLIC_SW_WYLACZ=1` → `/sw.js` serwuje skrypt samousuwający (kasuje
  `offgrid-precache-*` i `offgrid-v1`, wyrejestrowuje się), nowy kod klienta nie rejestruje SW. Powrót: zwykły deploy.
- **E2e:** `pnpm test:e2e` (`node --test`, trzy buildy produkcyjne, port 3947, ~3 min). Lokalnie, gdy wersja
  `playwright` nie pasuje do zainstalowanej przeglądarki: `PW_CHROMIUM_PATH=~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
  `E2E_BEZ_BUILDU=1` tylko dla `offline.test.mjs` i tylko gdy `.next` to zwykły build (po `aktualizacja.test.mjs` leży
  tam build wyłącznika!). **Pułapki:** `waitForFunction` z predykatem `async` przechodzi od razu (zgłoszone do
  standardu); `/_vercel/insights` daje lokalnie 404 + błąd MIME w konsoli — oczekiwane, filtrowane.
- **Pierwszy deploy:** stary SW serwuje strony z sieci, więc od razu wczytuje się nowy HTML; nowy SW instaluje się w tle
  i toast pojawia się bez dodatkowej nawigacji (sprawdzone: build `main` → build gałęzi na tym samym porcie).

## Drobne zadania + SW etap 2 + 5.10/5.11 (30.09.2026, D60)

- **`middleware.ts` → `proxy.ts`** (Next 16, przewodnik `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`):
  zmiana nazwy pliku i funkcji, działanie bez zmian. Klasyfikacja 11.8: zmiana konwencji, nie zachowania. Jedyna różnica
  techniczna: proxy zawsze w runtime Node.js (nie Edge) — kod używa tylko `crypto.randomUUID`, `@supabase/ssr`,
  `NextResponse`, więc bez wpływu. `pnpm build`: ostrzeżenie o „middleware” zniknęło, w wyjściu `ƒ Proxy (Middleware)`.
  W dokumentach historycznych nazwa `middleware.ts` zostaje (nie przepisujemy historii); kod wskazuje `proxy.ts`.
- **`public/placeholder*` usunięte** (5 plików z szablonu) i zdjęte ich wykluczenie z precache.
- **CI:** job `e2e-sw` w `.github/workflows/ci.yml` (`playwright install --with-deps chromium` + `pnpm test:e2e`,
  osobny job, limit 30 min). Ruszy dopiero, gdy wróci GitHub Actions (1.10).
- **5.10:** `lib/adapters/trwaly-magazyn.ts` (kopia wzorca), wołane z `IndexedDbStorageAdapter.setItem` — raz na
  załadowanie strony, odmowa zapamiętana w `localStorage` (`trwaly-magazyn-odmowa`).
- **5.11:** zdarzenia wersji bazy w `lib/adapters/indexeddb-storage-adapter.ts` (`naZdarzenieWersjiBazy`),
  toast `components/pwa/baza-wersja-listener.tsx` (klucze `UI-PWA-BAZA-*`) w `app/layout.tsx`. **Od teraz wolno podbić
  `DB_VERSION`** — stara karta dostanie toast „Odśwież tę kartę” zamiast cicho gubić autozapis.
- **BŁĄD etapu 1 (dryf od D22, naprawiony wg Y.2):** worker MapLibre (`public/maplibre/**`) był wykluczony z precache
  z uzasadnieniem „mapa i tak wymaga sieci”. D22 mówi odwrotnie: spacer GPS działa bez sieci. Skutek sprawdzony na
  buildzie produkcyjnym: offline na Skanerze znikał obrys działki i budynku (zostawały same numerki punktów), bo
  MapLibre przetwarza GeoJSON w workerze. Worker wrócił do precache (+0,5 MB); `media/maplibre-gl*` (~3,7 MB) nadal
  poza precache — to nieużywane kopie emitowane przez bundler z `new URL(..., import.meta.url)` w bibliotece (mapa
  używa kopii z `public/maplibre/` przez `setWorkerUrl`). Regresję pilnuje test e2e w `e2e/offline.test.mjs`.
  **Lekcja:** zanim wykluczysz zasób z offline, sprawdź na buildzie, czy ekran naprawdę go nie używa bez sieci —
  „ekran ma część online” ≠ „biblioteka jest tylko online”.
- **D60 — widok 3D tylko online:** chunk three.js (~0,9 MB) poza precache, rozpoznawany po treści (`__THREE__`),
  nie po nazwie z hashem (`czyChunkTylkoOnline`). Import w `analiza-zacienienia/page.tsx` ma `.catch` → komponent
  z komunikatem `UI-PWA-3D-BRAK-*`, bez ekranu błędu.
- **BŁĄD znaleziony przy okazji:** `components/asystent-ai.tsx` wołał Server Action `isAiAvailable()` bez `.catch` —
  offline **każdy** ekran rzucał nieobsłużone `TypeError: Failed to fetch` (widoczne w e2e jako `pageerror`, wcześniej
  niewychwycone, bo test offline nie sprawdzał `pageerror`). Teraz: offline asystent ukryty (9.0 — ciche zdegradowanie).
- **Pomiar precache po etapie 2:** 540 wpisów, **20,85 MB surowo, ≈ 6,8 MB transferu** (gzip; Vercel wysyła brotli —
  jeszcze mniej). Podział (surowo / gzip): HTML 239 stron 6,64 / 1,25 MB; chunki 12,2 / 3,9 MB; media 0,57 MB;
  `public/` 1,41 / 1,05 MB. Największe: chunk tekstów/słowników ładowany na każdej stronie 1,17 MB, MapLibre 1,0 MB,
  drugi chunk tekstów 0,73 MB, worker MapLibre 0,5 MB, zod 0,4 MB (ekrany M14 — potrzebny offline). Budżet pierwszego
  pobrania: **D61 — wariant A**, obecny stan przyjęty, nic dalej nie ciąć (B tylko przy sygnale o słabym łączu).

## Migracja etykiet starych ekranów na `UI-*` — narzędzie i pułapki (30.09.2026)

- **Narzędzie:** `scripts/migracja-i18n-ui.mjs` (jednorazowe, AST TypeScript): `wyciagnij <grupa> <pliki…>` wypisuje
  `{klucz: tekst PL}`, `zastosuj <grupa> <tlumaczenia.json> <pliki…>` przepisuje strony na `t(...)`, tworzy
  `lib/i18n/ui/<grupa>.ts`, dopisuje import w `index.ts` i obniża listę zapadkową; `sprawdz <pliki…>` pokazuje literały
  bez polskich liter do przejrzenia. Teksty identyczne z `wspolne.ts` dostają klucz wspólny. Usunąć, gdy lista
  zapadkowa będzie pusta.
- **Pułapka 1 — strażnik nie widzi tekstów bez polskich liter** poza JSX (np. „Przewody prowadzone w peszlu” w stałej
  modułu): po `zastosuj` zawsze `sprawdz` i ręczny przegląd.
- **Pułapka 2 — teksty w stałych poza komponentem:** narzędzie wstawia tam klucz jako string i wypisuje „RĘCZNIE:” —
  trzeba dodać `t(...)` w miejscu renderu (inaczej ekran pokaże surowe `UI-…`). Po każdej partii grep `"UI-` poza `t(`.
- **Pułapka 3 — zmienna `t` w `.map((t) => …)`** przesłania `useTranslate()`; przed migracją zmienić nazwę (`tech`).
- **Pułapka 4 — `getStart()` na JsxText już pomija białe znaki;** ręczne przesunięcie ucinało pierwsze litery słów.
- **Rozmiar:** każda partia powiększa chunk tekstów ładowany na każdej stronie (D61 — przyjęty stan, obserwować).
- Teksty ze stałych `lib/core` renderowane na ekranach — osobny wpis w `docs/lista-do-zrobienia.md` (30.09.2026).

## Duże kafle M14 + presety pulpitu (30.09.2026)

- **Duży kafel** = `duzy: true` w `KafelEntry` (`lib/pulpit/registry.ts`): `col-span-2` w siatce pulpitu + opis pod nazwą.
  Tylko kafle M14 (id 15/16, D35). Siatka ma min. 2 kolumny, więc duży kafel nigdy nie wychodzi poza ekran telefonu.
- **Presety** (`lib/pulpit/presety.ts`) — dane 1:1 z tabeli §3 `docs/pulpit-i-nawigacja.md` + `[15, 16]` na końcu (D53/D54).
  `stanZPresetow(ids)` zwraca zwykły `PulpitState` — nie ma nowego klucza `localStorage` ani migracji. Kilka presetów =
  unia w kolejności domyślnej (✅🤖, §3 nie określa kolejności unii). Zaznaczenie nie jest zapamiętywane (jednorazowe
  „Zastosuj”). Dziewiąty preset „Jestem podłączony do sieci” czeka na decyzję o składzie (lista zadań 30.09).
- **Y.2 (naprawione od razu):** Ustawienia pokazywały „15. Dom – sieć” / „16. Firma – sieć” mimo D39 (kafle M14 bez numeru,
  „Kafel 14” = Ustawienia) — numer tylko dla id < 14.
- **Przecinek w liczbach założeń** — zadanie z indeksu po D54 było duplikatem wpisu zamkniętego 26.09; sprawdzone ponownie,
  nic do zrobienia (kropka tylko w `technicalMessage`).
- **[30.09.2026, D62]** Właściciel przyjął obie propozycje ✅🤖: unia w kolejności domyślnej oraz dziewiąty preset `siec`
  (M14 na początku, potem 1, 2, 3, 4, 6, 7, 8). Preset `siec` jest jedynym bez `[15, 16]` na końcu — test to rozróżnia.

## M9 blok 6 (30.09.2026) — E1, E3, Katalogi 2–4; M9 kompletny

- **E1 wybór płytki** (`esp32/wybor-plytki/`): dopasowanie po cechach z opisu wariantów w źródle (B), nie po liczbie
  czujników — próg „do 10 czujników” i „3× mniejszy pobór” z przykładu C to ilustracja (Dyrektywa #1). Brak jednej
  płytki z wszystkimi cechami → ℹ️ (status bez zmian, Dyrektywa #6). Zasilanie stałe bez potrzeb → ℹ️, brak rekomendacji.
- **E3 montaż i obudowa** (`esp32/montaz-obudowa/`): kontrola IP to czyste echo — `ipPonizejWymaganego` (M4/E10) i
  `wilgocZalecaneIp65` (M12/E23) z ich stałymi; wpis w rejestrze stopów uzupełniony o M9/E3. Pytania tak/nie jako
  `PoleSelect` z pustą opcją (checkbox dawałby fałszywe „nie” = ostrzeżenie od progu). Ujemny odstęp → `ESP-ODSTEP-UJEMNY`
  — **pułapka:** wzorzec `*-UJEMNY` w `scripts/stopy-guard-wyjatki.json` nie złapał kodu wieloczłonowego, trzeba było
  dopisać kod jawnie.
- **Katalogi 2–4**: jeden silnik `esp32/katalog-komponentow/` (ids w `constants.ts`, treść w `lib/i18n/ui/m09-esp32.ts`
  jako `UI-M9-<id>-N/T/D/U`), jeden komponent `components/wzorce/katalog-komponentow.tsx` (stan w stronie przez
  `usePersistedDraft`), jedno narzędzie AI z enum katalogu. Katalog 1 deleguje obliczenie do tego silnika (bez zmiany
  wyniku). **Id instancji** liczone z listy (`max+1`), nie z licznika modułu — **błąd naprawiony w Katalogu 1:** licznik
  `nextId` startował od 1 po każdym przeładowaniu, więc po odtworzeniu szkicu dawał zduplikowany `id` (klucz React,
  „Usuń” kasowało dwie pozycje naraz).
