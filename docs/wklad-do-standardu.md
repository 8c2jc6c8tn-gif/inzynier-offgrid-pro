# docs/wklad-do-standardu.md — Inżynier Offgrid Pro

Rosnący log nietrywialnych spostrzeżeń z pracy nad **tym** projektem, wartych rozważenia dla całego pakietu `new-app-standards`/GOD BOOK — nie tylko tego repo. To **nie jest** źródło prawdy o standardzie — to surowy materiał zgłoszeniowy. AI dopisuje tu z własnej inicjatywy (analogicznie do Części U.2 GOD BOOK), gdy natrafi na coś nietrywialnego. **Nigdy nie edytuj stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards` (Część Y.8 GOD BOOK).

Starsze, w pełni skonsolidowane wpisy: `docs/wklad-do-standardu-archiwum.md`, ostatnie przeniesienie 03.10.2026 (13 wpisów).

Format i zasada aktualizacji: nie usuwamy wpisów, tylko dopisujemy — tak jak reszta Biblii (Część D GOD BOOK).

## Co zapisywać, i pod jaką kategorią

- **BŁĄD** — decyzja architektoniczna/procesowa (ze standardu albo z GOD BOOK), która okazała się zła w praktyce, i dlaczego. Nie literówka — coś, co kosztowało realny czas albo spowodowało realny problem.
- **DOBRA PRAKTYKA** — rozwiązanie, które się sprawdziło, nieoczywiste, warte powtórzenia w innych projektach (nie "użyłem X" — coś specyficznego, co inaczej trzeba by wymyślić od nowa).
- **POMYSŁ NA REGUŁĘ** — luka zauważona w standardzie/GOD BOOK, którą warto rozważyć jako nową, uniwersalną zasadę.

**Nie zapisuj tutaj:** rzeczy trywialnych; specyficznych wyłącznie dla domeny *tego* projektu (te idą do `docs/memory.md`, nie tutaj); jednorazowych literówek.

[16.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo, `new-app-standards`. **Próg zgłoszenia jest niżej, niż wygląda.** Nie czekaj na coś spektakularnego — błąd, który kosztował choćby pół godziny pracy, albo rozwiązanie, którego nie chciałbyś wymyślać od zera w kolejnym projekcie rodziny, już się kwalifikuje. Cały mechanizm konsolidacji (U.1–U.4 GOD BOOK) działa tylko wtedy, gdy ten plik faktycznie rośnie — rzadkie wpisy oznaczają, że reszta rodziny projektów nie korzysta z lekcji wyciągniętych tutaj. Zgłaszaj częściej, nie rzadziej.

## Format wpisu

```
[DD.MM.RRRR] KATEGORIA: [BŁĄD / DOBRA PRAKTYKA / POMYSŁ NA REGUŁĘ] — [krótki opis]
Szczegóły: [co się stało / na czym polega]
Dlaczego warto zgłosić do new-app-standards: [uogólnienie — dlaczego to dotyczy więcej niż tego projektu]
Status: 🔎 nowe / ✅ przekazane do new-app-standards (DD.MM.RRRR)
```

---

## Wpisy

<!-- Pierwszy wpis powstaje, gdy AI natrafi na coś wartego zgłoszenia — nie czekaj na "koniec projektu". -->

[06.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie procedury przetwarzania dostarczonych materiałów źródłowych (normy, PDF, skany, .doc/.docx)

Szczegóły: W tej sesji przetworzono ~10 dokumentów źródłowych (normy PN/IEC/EN/HD, materiały
branżowe/szkoleniowe) dostarczonych przez właściciela projektu w różnych formatach: PDF z natywnym
tekstem, PDF-skan wymagający OCR, stary binarny `.doc` (Word 95/97 — LibreOffice/`soffice` odmawiał
otwarcia, wymagał `antiword`+`wv`), oraz `.docx` (w tym konwersje z `.pptx` zrobione przez
użytkownika). Standard nie miał dotąd żadnej wytycznej co robić w tej sytuacji — cała metodologia
(rozpoznanie formatu, dobór narzędzia ekstrakcji, dyscyplina weryfikacji) została wypracowana
ad-hoc w trakcie sesji, z kilkoma realnymi wpadkami po drodze zanim ustaliła się właściwa procedura:
- pierwszy pojedynczy spot-check jednej strony normy (5-52, Załącznik B) dał fałszywe poczucie
  bezpieczeństwa — pełne przejście przez wszystkie 26 stron tego załącznika znalazło **~35 błędów**,
  w tym całe brakujące kolumny/wiersze danych (niewidoczne przy losowym sprawdzeniu, bo nie
  wyglądają jak błąd — po prostu jest mniej liczb niż powinno);
- `antiword` bez jawnie podanej mapy znaków (`-m 8859-2.txt`) dawał mojibake na polskich znakach;
- `wvHtml` (a nie sam `antiword`) był potrzebny do odzyskania realnej struktury tabel i osadzonych
  obrazów WMF (wzory matematyczne) z plików `.doc`;
- `.docx` z zachowanymi natywnymi tabelami Worda okazał się czasem **bardziej** wiarygodny niż
  odczyt wizualny tego samego dokumentu jako PDF (dla tabel-jako-tabel), ale **mniej** wiarygodny
  dla treści, która w oryginale była diagramem/SmartArt (te wychodzą jako puste komórki) — czyli
  która metoda jest "lepsza" zależy od tego, czym dana treść była w oryginale, nie od samego
  formatu pliku.
Pełna procedura (skrócony, samodzielny blok — gotowy do wzięcia 1:1 i przekazania dowolnej innej
sesji/projektowi, w tym poza tą rodziną aplikacji; uzasadnienia, przykłady z Offgrid Pro i pełna
wersja robocza z komentarzem do każdego kroku zostają dodatkowo, nieusunięte, w
`docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md` w tym repo — plik
nie jest częścią standardu i nie trzeba go czytać, poniższy blok jest kompletny sam w sobie):

```
PROMPT: Przetwarzanie dostarczonych materiałów źródłowych (normy, PDF, skany, .doc/.docx)

Dostaję od użytkownika dokumenty źródłowe (normy PN/IEC/EN/HD, materiały branżowe/szkoleniowe) w
różnych formatach. Cel: wyciągnąć treść bezbłędnie, nic nie zgubić, nic nie zmyślić, i zapisać w
docs/zrodla/ w ustandaryzowanej strukturze.

Krok 0 — rozpoznanie formatu
- PDF: sprawdź pypdfium2 → page.get_textpage().get_text_range() na kilku stronach. Setki/tysiące
  znaków = natywny tekst (czytaj bezpośrednio narzędziem Read albo ekstrakcją tekstu). Zero znaków =
  skan → OCR.
- Stary binarny .doc (Word 95/97): LibreOffice/soffice --convert-to nie otworzy tego pliku ("source
  file could not be loaded") — nie trać na to czasu, od razu użyj antiword/wv.
- .docx: python-docx (pip install python-docx).

Krok 1 — ekstrakcja per format
- Skan PDF: pypdfium2 renderuje strony do PNG przy 300 DPI (page.render(scale=300/72)), potem
  tesseract -l pol --psm 6 dla tekstu OCR. Zasada krytyczna: nigdy nie ufaj tekstowi OCR dla liczb
  bezpieczeństwa-krytycznych — zawsze zweryfikuj wizualnie względem wyrenderowanego obrazu strony
  (użyj narzędzia Read na obrazie, nie tylko na tekście OCR).
- Krótki skan (kilkanaście stron): nie buduj całego pipeline'u OCR — czytaj bezpośrednio narzędziem
  Read z parametrem stron (wymaga poppler-utils/pdftoppm zainstalowanego).
- Stary .doc: antiword -m 8859-2.txt plik.doc | iconv -f ISO-8859-2 -t UTF-8 dla czystego tekstu (bez
  jawnej mapy znaków antiword daje mojibake na polskich znakach — sprawdź faktyczny kodepage przez
  file, czasem to cp1250.txt). Do struktury tabel i osadzonych obrazów: wvHtml plik.doc out.html
  (daje prawdziwe <table>, nie ASCII-art). Osadzone obrazy WMF (małe wzory): wmf2gd (pakiet
  libwmf-bin) → PNG do odczytu wizualnego. wvHtml zgłaszający StrangeNoGraphicData = nieodzyskiwalny
  obiekt OLE — sprawdź najpierw, czy potrzebna treść (np. cała tabela) po prostu nie występuje w tym
  konkretnym pliku (np. bo to "Wyciąg"/skrót), zanim uznasz to za porażkę odzyskiwania.
- .docx: docx.Document(path), iteruj .tables (prawdziwe tabele Worda/PPT → czysty ustrukturyzowany
  tekst, bardziej wiarygodny niż wizualne czytanie złożonych tabel) i .paragraphs. Uwaga: diagramy/
  kształty/SmartArt (częste w dokumentach z PowerPointa) konwertują się do tabel z pustymi komórkami
  — nie myl pustej tabeli z brakiem treści, sprawdź otaczający tekst akapitów.

Krok 2 — dyscyplina weryfikacji: pełne przejście, nie spot-check
Pojedyncze sprawdzenie jednej strony daje fałszywe poczucie bezpieczeństwa — najgorsze błędy (całe
brakujące kolumny/wiersze) są niewidoczne przy losowej próbce, bo nie wyglądają jak błąd, po prostu
jest mniej liczb niż powinno. Dla dużych załączników: podziel weryfikację na równoległe subagenty
(Agent tool, w tle) po ~5 stron każdy, każdy ma czytać obrazy stron bezpośrednio (nie ufać
dostarczonemu tekstowi OCR) i zgłosić każdą rozbieżność z dokładną lokalizacją, jawnie potwierdzając
"strona NN: brak rozbieżności" dla czystych stron.

Krok 3 — struktura folderów w docs/zrodla/
- norma-<OZNACZENIE>/ dla formalnych norm PN/IEC/EN/HD (np. norma-PN-HD-60364-5-52/).
- materialy-branzowe-<TEMAT>-<ROK>/ dla materiałów nieformalnych/branżowych/szkoleniowych — celowo
  inna nazwa, żeby nikt nie pomylił statusu prawnego.
- W każdym folderze: oryginalny plik(i) źródłowy bez zmian, 00-INDEKS.md (metoda ekstrakcji,
  zastrzeżenia co do jakości źródła, status użycia), pliki z treścią (01-...md, zalacznik-X-...md)
  zorganizowane wg struktury oryginału.

Krok 4 — obsługa brakujących/sprzecznych danych
- Jeśli tabela/wartość naprawdę nie istnieje w dostarczonym dokumencie — powiedz to wprost, nigdy nie
  wymyślaj wartości nawet jeśli "powszechnie znana" w branży.
- Jeśli dwie wersje normy podają różne wartości I źródło samo jednoznacznie wskazuje, która jest
  aktualna/zastąpiona (z datami) — to nie jest sprzeczność wymagająca pytania użytkownika: rozstrzygnij
  sam (użyj aktualnej, zachowaj starą jako kontekst historyczny), zapisz uzasadnienie w docs/memory.md.
- Jeśli nie ma takiego jasnego wskazania, albo to realna merytoryczna rozbieżność (nie tylko
  stara-vs-nowa) — nie rozstrzygaj sam, pokaż A vs B i zapytaj użytkownika.

Krok 5 — uczciwość wobec niekompletnych dostaw
Jeśli dokument dostarczony jako "kluczowy brakujący element" okazuje się być tylko spisem treści +
bibliografią bez merytorycznej treści — powiedz to wprost, nie sugeruj że luka jest zamknięta tylko
dlatego, że plik istnieje teraz w repo.

Ściąga narzędzi:
pip install pypdfium2 python-docx
apt-get install -y poppler-utils tesseract-ocr tesseract-ocr-pol antiword wv libwmf-bin

- pdftoppm (poppler-utils) — wymagane przez narzędzie Read do czytania stron PDF jako obrazów.
- tesseract -l pol --psm 6 obraz.png out — OCR po polsku.
- antiword -m 8859-2.txt plik.doc — tekst ze starego .doc.
- wvHtml plik.doc out.html — struktura HTML + odzyskanie obrazów ze starego .doc.
- wmf2gd wzor.wmf wzor.png — konwersja osadzonego WMF do PNG.
```

Dlaczego warto zgłosić do new-app-standards: każda aplikacja tej rodziny prędzej czy później
dostanie od właściciela dokument źródłowy (normę, specyfikację, materiał branżowy) w jednym z tych
formatów — bez tej procedury każda kolejna sesja/projekt odkrywa te same pułapki (LibreOffice nie
otwiera starych .doc, OCR bez pełnej weryfikacji daje fałszywe poczucie bezpieczeństwa, mojibake bez
jawnej mapy znaków) od nowa, tracąc czas i ryzykując ciche błędy w danych bezpieczeństwa-krytycznych.

Status: 🔎 nowe. **✅ Potwierdzone skonsolidowane (Routine Y.6, 20.09.2026)** — porównanie treści
(nie domysł) z `new-app-standards`: `docs/playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md`
istnieje, opisany jako moduł opcjonalny (GOD BOOK Y.10), jawnie oznaczony "Źródło: projekt
inzynier-offgrid-pro, zebrane przez GOD BOOK U.4, 06.09.2026", z tym samym gotowym PROMPT-em
(rozpoznanie formatu/ekstrakcja per format/dyscyplina pełnej weryfikacji nie spot-check) 1:1
odpowiadającym treści zgłoszonej tutaj. To stwierdzenie faktu (wpis już skonsolidowany), nie nowa
decyzja o promocji — ta zapadła wcześniej, w sesji nad `new-app-standards`.

---

[06.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak współdzielonej, wielorazowej biblioteki norm źródłowych między projektami rodziny

Szczegóły: W tym projekcie zgromadzono i przeprocesowano (metodologia — patrz zgłoszenie wyżej,
06.09.2026) 10 źródeł: 8 formalnych norm PN/IEC/EN/HD i 2 materiały branżowe, dotyczące w większości
**generycznej elektryki niskiego napięcia i budownictwa** (instalacje elektryczne, ochrona
przeciwporażeniowa, PV, obciążenie śniegiem dachów) — nie tylko off-grid. Każda przyszła aplikacja
inżynierska tej rodziny (np. kolejny "Kalkulator Inżyniera Pro", instalator PV on-grid, projektant
instalacji elektrycznej budynku) prędzej czy później potrzebuje tych samych norm. Dziś, bez
mechanizmu współdzielenia, każdy kolejny projekt musiałby kupować/skanować/OCR-ować/weryfikować je
od nowa — realny koszt czasu i pieniędzy (część tych norm to płatne zakupy PKN), a przy okazji
ryzyko, że różne projekty rodziny zbudują kalkulatory na niezależnie (i niespójnie) zweryfikowanych
kopiach tej samej normy.

Pełny manifest — dokładnie co jest, gdzie leży, w jakim jest stanie (jaka część zweryfikowana w
pełni vs spot-check vs bezużyteczny wyciąg) i czy nadaje się do skopiowania 1:1 do współdzielonej
biblioteki (wersja rozszerzona, z pełnym kontekstem, zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/biblioteka-norm-zrodlowych.md` w tym repo):

Konwencja przechowywania w tym repo (do skopiowania razem z treścią): jeden folder na jeden dokument
źródłowy — `docs/zrodla/norma-<OZNACZENIE>/` (formalne normy PN/IEC/EN/HD) albo
`docs/zrodla/materialy-branzowe-<TEMAT>-<ROK>/` (literatura branżowa/szkoleniowa, nie norma — nazwa
folderu celowo różna, żeby nie pomylić statusu prawnego). Oryginał zachowany bez zmian wewnątrz tego
samego folderu; treść przetworzona jako pliki `.md` w tym samym folderze, zawsze zaczynając od
`00-INDEKS.md` (metoda ekstrakcji, zastrzeżenia o jakości źródła, mapa pozostałych plików, status
weryfikacji i wykorzystania).

| Norma / materiał | Folder w tym repo | Oryginał | Status weryfikacji | Zasięg | Rekomendacja |
|---|---|---|---|---|---|
| **PN-HD 60364-5-52:2011** (obciążalność prądowa kabli, dobór przekroju) | `docs/zrodla/norma-PN-HD-60364-5-52/` | Skan, 96 str., zakupiona oficjalnie PKN | **Załącznik B (tabele obciążalności, str. 33-58) w pełni zweryfikowany strona po stronie** (~35 poprawionych błędów OCR). Reszta (Załączniki A, C, E-I, ZA-ZC) tylko wstępny spot-check. | Uniwersalny — każda aplikacja z instalacją elektryczną NN | Kopiować całość + jawnie przenieść status weryfikacji (Załącznik B ufny, reszta nie) |
| **PN-HD 60364-5-54:2010** (uziemienia, przewody ochronne PE) | `docs/zrodla/norma-PN-HD-60364-5-54/` | Natywny tekst PDF, 38 str., zakupiona oficjalnie | Kompletny, zweryfikowany wizualnie (wzory/tabele przeciw renderowi strony) | Uniwersalny | Kopiować całość. Uwaga: Załącznik ZC (krajowy PL) ma odnotowaną, nierozstrzygniętą rozbieżność 10mm²/16mm² dla Al chronionego mechanicznie — kopiować razem z tą flagą |
| **PN-IEC 60364-4-41:2000** (ochrona przeciwporażeniowa) | `docs/zrodla/norma-PN-IEC-60364-4-41/` | `.doc`, prywatny wyciąg z 2002, nie oficjalny skan PKN | Kompletny poza Tablicami 41A/41B (brakujące w tym konkretnym wyciągu — rozwiązane materiałem branżowym niżej) | Uniwersalny | Kopiować **razem z** `materialy-branzowe-ochrona-przeciwporazeniowa-2010/` (komplementarne) |
| **PN-IEC 60364-4-43:1999** (ochrona przed przetężeniem) | `docs/zrodla/norma-PN-IEC-60364-4-43/` | `.doc`, prywatny wyciąg | Kompletny, zweryfikowany krzyżowo dwiema metodami ekstrakcji | Uniwersalny | Kopiować całość |
| **PN-EN 60445:2010** (identyfikacja zacisków urządzeń) | `docs/zrodla/norma-PN-EN-60445/` | Skan PKN, 16 str. | Kompletny, przeczytany w całości wizualnie | Uniwersalny | Kopiować całość |
| **IEC 62109-2:2011** (bezpieczeństwo przetwornic PV — falowniki, część 2) | `docs/zrodla/norma-IEC-62109-2/` | Natywny tekst, angielski (FDIS), 30 str. | Kompletny, od tytułu po bibliografię | Uniwersalny dla PV/inwerterów, nie tylko off-grid | Kopiować całość. **Uwaga: brak Części 1** (wymagania ogólne) — patrz `docs/normy-brakujace.md` tego repo |
| **UNE-HD 60364-7-712:2017** (instalacje PV) | `docs/zrodla/norma-HD-60364-7-712/` | Skan, 6 str. | 🔴 **Tylko spis treści + bibliografia — praktycznie bezużyteczny**, brak całej treści technicznej (klauzule 712.41-712.6, Załącznik B U_OC MAX/I_SC MAX) | Uniwersalny temat, ale materiał bez wartości w obecnej postaci | Kopiować z **jawnym ostrzeżeniem "bezużyteczne"** albo pominąć do czasu zakupu pełnego tekstu |
| **materiały branżowe "Bezpieczeństwo instalacji fotowoltaicznych" (2019)** | `docs/zrodla/materialy-branzowe-PV-2019/` | PDF + `.docx` (ten sam dokument, dwa formaty) | Przeanalizowany, nie jest normą — indeks 34/43 norm PV z dokładnymi numerami, tabele promieni gięcia/odległości/konserwacji | Uniwersalny dla tematyki PV | Kopiować całość — szczególnie wartościowy jako gotowy indeks norm PV |
| **materiał branżowy "Aktualne przepisy ochrony przeciwporażeniowej" (2010)** | `docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/` | PDF + `.docx` | Przeanalizowany, nie jest normą — rozwiązuje krytyczny brak Tablic 41A/41B z normy 4-41 wyżej, zawiera aktualną Tablicę 41.1 | Uniwersalny | Kopiować **razem z** `norma-PN-IEC-60364-4-41/` (jeden bez drugiego jest niepełny) |
| **PN-EN 1991-1-3:2005** (Eurokod 1, obciążenie śniegiem) | `docs/zrodla/norma-PN-EN-1991-1-3/` | Skan, 54 str. | Kompletny, przeczytany w całości wizualnie strona po stronie | Uniwersalny — każda aplikacja z konstrukcją dachową/budowlaną | Kopiować całość. Uwaga: Załącznik krajowy NB (mapa 5 stref) jest specyficzny dla Polski — dla projektu poza Polską potrzebny odpowiedni załącznik krajowy tego samego Eurokodu |

Co NIE jest tu uwzględnione (specyficzne dla Offgrid Pro, nie do kopiowania):
`docs/zrodla/Tresc_Modul_*.md`, `Tresc_WSZYSTKIE_MODULY_scalone.md`, `Zasady_UX_Doradca_v2_1.md`,
`Biblia_Offgrid_v2_0_Architektura_Modulowa.md` — specyfikacja produktowa tej konkretnej aplikacji.

Wciąż brakujące normy (pełna, aktualna lista: `docs/normy-brakujace.md` w tym repo): IEC 62109-1,
IEC 61215, IEC 62619, EN 61439, HD 60364-4-443, HD 60364-5-551, EN 62305, EN 62852, EN 61427-1,
PN-EN 50565-1, pełny tekst UNE-HD 60364-7-712 (jedyna oznaczona jako krytyczna, reszta zidentyfikowana
z nazwy, bez treści).

Dlaczego warto zgłosić do new-app-standards: to naturalne rozszerzenie pomysłu zgłoszonego wyżej
(procedura przetwarzania materiałów) — ta reguluje JAK przetwarzać nowy dokument, ta tutaj reguluje
GDZIE trzymać wynik, żeby nie przetwarzać tego samego dokumentu dwa razy w dwóch różnych projektach
rodziny. Dotyczy każdej aplikacji inżynierskiej tej rodziny, nie tylko Offgrid.

Status: 🔎 nowe. **Porządek (20.09.2026):** jedyna niedoskonałość, jaką manifest sam u siebie
flagował (dwa oryginały PDF, 5-52/5-54, leżące poza swoim folderem `norma-*/`), naprawiona w tym
repo — przeniesione do właściwych podfolderów, wszystkie odwołania w treści zaktualizowane. Manifest
w `docs/propozycje-do-new-app-standards/biblioteka-norm-zrodlowych.md` jest teraz w pełni spójny
ze stanem `docs/zrodla/`, bez żadnej znanej niedoskonałości do naprawienia przed konsolidacją —
nadal czeka wyłącznie na sesję nad `new-app-standards`, nie na kolejną pracę tutaj.

**✅ Potwierdzone skonsolidowane (Routine Y.6, 20.09.2026)** — porównanie treści z `new-app-standards`:
`docs/biblioteka-norm/` istnieje z pełnym manifestem 10 pozycji identycznym co do treści z tabelą
wyżej, i (od 15.09.2026, `README.md` tamtego repo, commit źródłowy `d7c81d1`) **fizyczne pliki
skopiowane w całości** (oryginał + wyciąg Markdown) dla wszystkich 10 pozycji — pierwotnie otwarta
kwestia licencji PKN rozstrzygnięta przez właściciela repo, nie jest już blokerem. To stwierdzenie
faktu, nie nowa decyzja o promocji.

---

**[20.09.2026] Archiwizacja (GOD BOOK Y.8).** 12 wpisów w pełni zamkniętych (status `✅
skonsolidowane`, bez żadnej otwartej dalszej akcji — dot. 9.3/9.0a AI w produkcie, rozdz. 18
logowanie, 18.5 Supabase/CSRF, 7.3 CSP nonce, 8.4a audyt pokrycia, 15.19/15.20/15.7a/5.7)
przeniesione do `docs/wklad-do-standardu-archiwum.md`, zgodnie z nową regułą Y.8 (plik rośnie bez
końca, cyklicznie przenosimy w pełni skonsolidowaną treść). Poniżej zostają tylko wpisy wciąż
otwarte (🔎 nowe albo ✅ z jawnie nazwanym otwartym punktem).

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — wielojęzyczność wspomniana jednym zdaniem (rozdział 01),
brak strategii

Szczegóły: Jedyna wzmianka o i18n w całym standardzie to jedno zdanie w `01-architektura.md` — i18n
ma żyć w warstwie domenowej jako czysta funkcja, nie w UI. To reguła GDZIE, nie strategia JAK (które
języki, format tłumaczeń, przełącznik, fallback). Zero implementacji w tym projekcie. Tak jak przy
logowaniu — właściciel projektu wskazał `zero-waste` jako wzorzec, ta sesja nie miała dostępu, więc
zgłoszenie jest świadomie niedokończone.

Najważniejsze znalezisko możliwe bez zero-waste: realna kolizja z regułą z rozdziału 01 — pola
`CalcResult.formula`/`assumptions`/`Warning.message` (rozdział 03) są dziś tekstem w jednym języku
wpisanym wprost w logice domenowej, co narusza "i18n jako czysta funkcja w warstwie domenowej" —
brak decyzji, czy jądro obliczeniowe ma zwracać klucze tłumaczeń czy gotowy tekst w wybranym języku,
to fundamentalna zmiana dotycząca KAŻDEGO istniejącego kalkulatora w KAŻDYM projekcie rodziny, nie
kosmetyka (wersja z pełnym uzasadnieniem zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/wielojezycznosc.md` w tym repo).

Dodatkowe echo istniejących zasad (rozdział B pliku propozycji): model danych/profile regionalne
(rozdz. 02) — **język interfejsu i profil regionalny to dwie NIEZALEŻNE osie**, łatwe do pomylenia
(user może chcieć polski interfejs z profilem regionalnym USA/jednostkami imperialnymi, albo
odwrotnie) — nowy rozdział powinien to jawnie rozróżnić, nie zakładać "1 język = 1 profil". Styl
komunikatów (rozdz. 08.8) — reguła "proste, konkretne, bez straszenia" musi przetrwać tłumaczenie na
każdy obsługiwany język, nie tylko polski.

Rozstrzygnięcia z realnej implementacji w tym projekcie (16.09.2026, nie z zero-waste — na wyraźne
polecenie właściciela repo, patrz aktualizacja niżej):
1. Zakres języków — 3: `pl` (bazowy), `en`, `ru` (`lib/i18n/language.ts`, `SUPPORTED_LANGUAGES`);
   dodanie kolejnego = nowy plik słownika + jedna pozycja w tablicy, reszta generyczna.
2. Mechanizm — własne, proste rozwiązanie, zero zależności zewnętrznych: słownik to zwykły obiekt TS
   per język, `t(język, klucz, params?)` podstawia `{nazwa}` przez `String.replace`. Parytet kluczy
   wymuszony typem (`satisfies Record<KluczTlumaczenia, string>`) — brakujący/dodatkowy klucz to błąd
   kompilacji, nie runtime. Żadna biblioteka i18n nie była potrzebna przy tej skali — świadomie
   odłożone jako "gdy słownik urośnie", nie zbudowane z góry pod hipotetyczną skalę.
3. B.3 rozstrzygnięte — klucz + params, nigdy gotowy tekst z jądra. `Warning.i18nKey`/`params` i
   `CalcResult.Assumption` jako `string | {kod, params?}` — `lib/core` nigdy nie generuje tekstu dla
   użytkownika, tylko klucz; wyłącznie warstwa prezentacji (`t()`) rozwiązuje klucz → tekst. Jądro
   zostaje czyste i bezstanowe względem języka, bez przekazywania języka jako parametru do każdej
   funkcji domenowej.
4. Wykrywanie/wybór języka (to samo pytanie co 17.4a standardu) — automatyczne wykrycie tylko przy
   PIERWSZEJ wizycie (middleware czyta `Accept-Language`, ustawia cookie); każda kolejna wizyta czyta
   zapisaną cookie i nigdy jej nie nadpisuje automatycznym wykryciem. Jawny wybór usera w Ustawieniach
   zawsze wygrywa i jest trwały (cookie, 365 dni). Per-urządzenie, nie per-konto — ten projekt nie ma
   dziś aktywnych kont, więc pytanie "cookie vs konto między urządzeniami" nie było testowane w
   praktyce; wart ponownego sprawdzenia przy pierwszym projekcie rodziny z aktywnymi kontami i i18n
   jednocześnie.
5. Fallback przy brakującym tłumaczeniu — widoczny klucz (`⚠ [KLUCZ]`) w miejscu tekstu + zgłoszenie
   przez `Reporter` (rozdz. 03/15) z pełnym kontekstem technicznym, nigdy cichy fallback do języka
   bazowego (cichy fallback wygląda na "działające" tłumaczenie i ukrywa lukę przed osobą testującą
   inny język).
6. **Świadomie NIEROZSTRZYGNIĘTE, wciąż otwarte:** treści normatywne/bezpieczeństwa-krytyczne (progi
   z norm PN/IEC, ostrzeżenia 🔴) — ten projekt nie przetłumaczył dotąd żadnej takiej treści (5
   zmigrowanych kluczy to generyczna walidacja formularzy, nie fakty inżynierskie). Ryzyko utraty
   precyzji prawnej/technicznej przy tłumaczeniu normy nadal realne i nierozwiązane w praktyce — do
   jawnego oznaczenia jako otwarte w treści nowego rozdziału standardu (rozdz. 14, "Znane luki"), nie
   do rozstrzygnięcia na siłę bez realnego przypadku testowego.

Dlaczego warto zgłosić do new-app-standards: kolizja z rozdziałem 01 (punkt B.3 w pliku) to nie
drobiazg — to pytanie architektoniczne o kształt `CalcResult`/`Warning`, współdzielony przez każdy
kalkulator w każdej apce rodziny; im później rozstrzygnięte, tym droższa migracja wstecz.

Status: 🔎 nowe. **Aktualizacja (16.09.2026):** na wyraźne polecenie właściciela repo ("nie musisz
grzebać w innych repo projektów, żeby coś wyjaśniać... jak czegoś ci brakuje, piszesz w wkład do
standardu i tam decydują") — zgłoszenie NIE czeka już na `zero-waste`. Zbudowano i przetestowano
realną implementację w tym projekcie (przełącznik języka w Ustawieniach, 3 języki pl/en/ru, kontrakt
klucz+params w jądrze, cookie zgodna z 17.4/17.4a): `lib/i18n/`, `components/jezyk-wybor.tsx`,
`middleware.ts`, `app/layout.tsx`. Sekcja C `docs/propozycje-do-new-app-standards/wielojezycznosc.md`
zastąpiona konkretnymi rozstrzygnięciami z tego kodu (nie pytaniami czekającymi na inny projekt) —
plik ma teraz status "gotowa do konsolidacji", poza jednym świadomie wciąż otwartym pytanem (C6,
tłumaczenie treści bezpieczeństwa-krytycznych — ten projekt tego jeszcze nie zrobił, nie tylko nie
zgłosił). Punkt B.3 (kolizja z rozdz. 01) **rozstrzygnięty**: jądro zwraca klucz+params, nigdy gotowy
tekst — patrz plik propozycji, sekcja C.3.

**Finalna konsolidacja (20.09.2026):** ✅ `docs/standards/17-i18n.md` 17.1a — wielojęzyczność jako
założenie architektoniczne od Etapu 1 dla każdego NOWEGO projektu rodziny (minimalny zestaw
pl+en+ru). Zweryfikowane wprost w treści rozdziału, nie tylko w `AKTUALIZACJE.md`.

**Status zaktualizowany (Routine Y.6, 20.09.2026):** ✅ dla punktów 1–5 i B.3 (17.1a potwierdzone
powyżej). **Punkt 6 (C6, tłumaczenie treści normatywnych/bezpieczeństwa-krytycznych) pozostaje 🔎
nowe** — brak odpowiednika w aktualnym `docs/standards/17-i18n.md` ani GOD BOOK, ten projekt sam
jeszcze nie przetłumaczył żadnej takiej treści. Zostawione bez zmian, zgodnie z Y.6 pkt 6.

---

[16.09.2026] KATEGORIA: DOBRA PRAKTYKA — referencyjny CI (11.2/11.5) i mechanizm strażniczy i18n
(17.9) jako konkretne, sprawdzone przykłady dla reguł, które standard dotąd opisywał tylko abstrakcyjnie

Szczegóły: W tym projekcie 11.5 (audyt podatności jako bramka CI) i 17.9 (mechanizm strażniczy
wykrywający regresję i18n) istniały w standardzie jako **tekst reguły**, ale bez żadnego konkretnego
przykładu implementacji — dokładnie ten sam wzorzec luki, co już zgłoszony wcześniej dla rozdziału
09 (AI w produkcie: zasady są, kontraktu narzędzia nie ma). Zbudowano i zweryfikowano oba jako
realny, działający kod (nie szkic):
- `.github/workflows/ci.yml` — dwa niezależne joby (jakość / audyt), próg `high`, z realną,
  dokumentowaną lekcją: pierwsze włączenie bramki audytu **nie przechodziło** (22 podatności `high`),
  naprawione bez obniżania progu, w granicach już zadeklarowanych zakresów semver, zweryfikowane
  pełnym łańcuchem lint/typecheck/test/build po każdej zmianie zależności.
- `scripts/check-i18n-guard.mjs` — parsowanie AST (nie regex, żeby nie łapać pól świadomie
  wyłączonych z i18n) plus explicit allowlist modułów już zmigrowanych. Złapany i naprawiony
  realny błąd własnej pierwszej wersji (nie wykrywała regresji za wzorcem `warunek ? [...] : []`,
  mimo że to normalny, częsty wzorzec w kodzie, nie edge case) — znaleziony wyłącznie dzięki
  wstrzyknięciu prawdziwej regresji do prawdziwego pliku przed wdrożeniem, nie przez samo
  przeczytanie kodu skryptu.

Pełna treść (kształt decyzji transferowalny między stackami + dosłowny, działający YAML/skrypt do
adaptacji; wersja z rozszerzonymi uzasadnieniami zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/ci-referencyjny-i-mechanizm-strazniczy-i18n.md` w tym repo):

**Kształt (transferowalny do każdego stacku):** dwa niezależne joby, nie jeden (`quality` —
lint/typecheck/test/build — i `dependency-audit` — skaner podatności; podatność w transitive
dependency dev-only nie ma blokować mergowania niezwiązanego fixa lintera, i odwrotnie). Bramka na
`high`/`critical`, nie na wszystko (`moderate`/`low` nie blokują — inaczej CI byłoby czerwone
praktycznie zawsze, co uczy zespół ignorować czerwony status). Zanim włączysz bramkę, sprawdź ręcznie
czy przechodzi — nie włączaj "na wiarę" (w tym projekcie pierwsze uruchomienie nie przechodziło: 22
podatności `high`). Napraw, nie obniżaj progu (rozwiązane tu bez wyjątków/allowlisty: `pnpm update`
w granicach już zadeklarowanych zakresów `^` podciągnął wszystko do wersji bez podatności — 0
pozycji na wszystkich poziomach po naprawie, nie tylko `high`). Po każdej zmianie zależności: pełny
lint→typecheck→test→build musi przejść, nie tylko sam audyt.

Plik referencyjny — dosłowna, pełna zawartość `.github/workflows/ci.yml` tego repo:

```yaml
name: CI

# docs/standards/11-ci-deployment.md, 11.2 + 11.5 — sygnał o awarii ma być jawny w repo (PR),
# nie tylko pośrednio przez build hostingu. Dwa niezależne joby: jakość kodu (11.2) i audyt
# podatności zależności (11.5) — rozdzielone, żeby znana, nienaprawialna od razu podatność
# nie blokowała np. mergowania czystego fixa lintera, i odwrotnie.

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Lint, typecheck, test, build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm check:i18n-guard
      - run: pnpm test
      - run: pnpm build

  dependency-audit:
    name: Dependency vulnerability audit (11.5)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      # Poziom "high" — krytyczne/wysokie w zależności bezpośredniej blokują merge (11.5).
      # Świadomie zaakceptowane wyjątki: odnotować w docs/memory.md z powodem, nie wyciszać
      # tutaj bez śladu.
      - run: pnpm audit --audit-level=high
```

Odpowiedniki dla innych stacków rodziny: `npm audit --audit-level=high` / `pip-audit` (Python) —
komenda `run:` się zmienia, cała struktura (dwa joby, kroki, `pnpm check:i18n-guard` w środku
`quality` jeśli projekt ma i18n) zostaje identyczna.

**Mechanizm strażniczy i18n (17.9) — problem, który przykład rozwiązuje:** 17.9 mówi "mechanizm
strażniczy zapobiega cofaniu się", ale nie mówi jak go zbudować. Naiwne podejście (regex na
"czy plik zawiera polskie znaki") ma dwa problemy: łapie fałszywe trafienia w polach świadomie
niepodlegających i18n (`technicalMessage`, `formula` symboliczna, `field`/`code`), i migracja jest
stopniowa — reguła musi sprawdzać TYLKO moduły już zmigrowane, nie blokować pracy nad resztą.
Rozwiązanie: AST (nie regex) plus explicit allowlist zmigrowanych modułów. Dosłowna, pełna
zawartość `scripts/check-i18n-guard.mjs` tego repo:

```js
#!/usr/bin/env node
/**
 * Mechanizm strażniczy i18n — docs/standards/17-i18n.md, 17.9: "Mechanizm strażniczy (lint/hook
 * wykrywający nowy twardy string) zapobiega cofaniu się w trakcie dalszej pracy."
 *
 * Sprawdza WYŁĄCZNIE moduły z listy MIGRATED_MODULES niżej — nie blokuje pozostałych,
 * jeszcze niezmigrowanych modułów (17.9: migracja stopniowa, nigdy big bang; reszta
 * świadomie zwraca gotowy tekst PL, to nie jest regresja, to jeszcze niewykonana praca).
 *
 * Reguła (04.1/17.2 PATCH): domenowa funkcja w zmigrowanym module nigdy nie zwraca gotowego
 * tekstu dla użytkownika — ani jako `Warning.message` (string literal), ani jako element
 * `assumptions` będący gołym stringiem (zamiast `{kod, params?}`). `technicalMessage`/`formula`
 * (symboliczny wzór) i `field`/`code` nie podlegają tej regule — nie są tekstem dla użytkownika.
 *
 * WAŻNE: dopisz ścieżkę modułu do MIGRATED_MODULES w TEJ SAMEJ sesji, w której go migrujesz —
 * inaczej ten skrypt nie chroni nowo zmigrowanego modułu przed regresją.
 */
import ts from "typescript"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const MIGRATED_MODULES = [
  "lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze",
]

const FILES_TO_CHECK = ["warnings.ts", "calculator.ts"]

/** @type {{filePath: string, line: number, message: string}[]} */
const violations = []

function isAssumptionsName(name) {
  return name === "assumptions"
}

/**
 * Przeszukuje wyrażenie (np. całą stronę `? :`/`??`) w poszukiwaniu tablic literałów i
 * zgłasza każdy element będący gołym stringiem — nie schodzi w głąb obiektów zagnieżdżonych
 * (`{ kod: "X" }` jest poprawne, "X" jako wartość `kod` to nie jest tekst dla użytkownika).
 */
function findRawStringArrayElements(expr, report) {
  function visit(node) {
    if (ts.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        if (ts.isStringLiteralLike(element)) {
          report(element, `element "assumptions" jest gołym stringiem PL — użyj "{kod, params?}" (17.2).`)
        }
      }
      return // nie wchodzimy w elementy tej tablicy głębiej (obsłużone wyżej)
    }
    // Schodzimy tylko przez "przezroczyste" wyrażenia (warunkowe/nawiasy/??), nie w ogóle
    // w głąb dowolnego kodu — żeby nie złapać niezwiązanej tablicy w innym wyrażeniu.
    if (ts.isConditionalExpression(node)) {
      visit(node.whenTrue)
      visit(node.whenFalse)
    } else if (ts.isParenthesizedExpression(node)) {
      visit(node.expression)
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
      visit(node.left)
      visit(node.right)
    }
  }
  visit(expr)
}

function checkFile(filePath, source) {
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)

  function report(node, message) {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart())
    violations.push({ filePath, line: line + 1, message })
  }

  function visit(node) {
    // `message: "gotowy tekst"` — pole opcjonalne/@deprecated po migracji, nie ustawiać na nowo.
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "message" &&
      ts.isStringLiteralLike(node.initializer)
    ) {
      report(node, `"message" z gotowym tekstem PL — użyj "i18nKey"/"params" i słownika (17.2).`)
    }

    // `const assumptions = [...]` / `assumptions: [...]` — wartość bindowana pod nazwą
    // "assumptions", zawierająca gdziekolwiek w swoim wyrażeniu (także za `? :`/`??`, np.
    // `input.x === undefined ? [...] : []`) tablicę z gołym stringiem.
    const isAssumptionsBinding =
      (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && isAssumptionsName(node.name.text)) ||
      (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && isAssumptionsName(node.name.text))

    if (isAssumptionsBinding && node.initializer) {
      findRawStringArrayElements(node.initializer, report)
    }

    ts.forEachChild(node, visit)
  }

  visit(sf)
}

for (const moduleDir of MIGRATED_MODULES) {
  for (const file of FILES_TO_CHECK) {
    const filePath = path.join(moduleDir, file)
    if (!existsSync(filePath)) continue // np. moduł bez calculator.ts — pomiń, nie błąd
    checkFile(filePath, readFileSync(filePath, "utf8"))
  }
}

if (violations.length > 0) {
  console.error("Mechanizm strażniczy i18n (17.9) — znaleziono regresję w module już zmigrowanym:\n")
  for (const v of violations) {
    console.error(`  ${v.filePath}:${v.line} — ${v.message}`)
  }
  console.error(
    "\nTo są moduły z MIGRATED_MODULES w scripts/check-i18n-guard.mjs — jeśli to naprawdę nowy,\n" +
      "jeszcze niezmigrowany moduł, usuń go z tej listy, nie ignoruj tego ostrzeżenia.",
  )
  process.exit(1)
}

console.log(`Mechanizm strażniczy i18n (17.9): OK — ${MIGRATED_MODULES.length} zmigrowany(ch) modułów bez regresji.`)
```

**Pułapka złapana przy budowie:** pierwsza wersja sprawdzała tylko bezpośrednie przypisanie
`const assumptions = [...]` — nie wykrywała `const assumptions = warunek ? [...] : []` (wzorzec
faktycznie występujący w kodzie). Złapane przez ręczny test przed wdrożeniem (wstrzyknięcie
prawdziwej regresji do prawdziwego, już zmigrowanego pliku, sprawdzenie że guard ją złapał,
przywrócenie oryginału) — nie przez samo napisanie kodu. Integracja z CI: krok w jobie `quality`,
po `typecheck`, przed `test`.

Skrócony PROMPT gotowy do wklejenia w innej sesji budującej to od zera:

```
PROMPT: CI (lint/typecheck/test/build + audyt podatności) i mechanizm strażniczy i18n

Buduję CI dla tego projektu. Wymagania:

1. Dwa niezależne joby w CI: "quality" (lint, typecheck, testy, build) i "dependency-audit"
   (skaner podatności zależności twojego menedżera pakietów: `npm audit`/`pnpm audit`/`pip-audit`/
   itd., z progiem odcięcia na high/critical, --audit-level=high albo odpowiednik).
2. PRZED włączeniem bramki audytu: uruchom go ręcznie. Jeśli nie przechodzi, NIE obniżaj progu i
   NIE dodawaj wyjątku od razu — sprawdź każdą pozycję, napraw to, co się da w granicach już
   zadeklarowanych zakresów wersji (bump w ramach ^/~, nie zmiana major), włącz bramkę tylko na
   czystym stanie. Po każdej zmianie zależności: pełny lint/typecheck/test/build musi przejść.
3. Jeśli projekt ma już migrację i18n w toku (klucze tłumaczeń zamiast gotowego tekstu w warstwie
   domenowej, migrowane moduł-po-module, nie big bang): zbuduj skrypt weryfikujący AST (nie regex)
   plików domenowych modułów JUŻ zmigrowanych (explicit allowlist, nie automatyczna detekcja),
   który blokuje nowy hardcodowany tekst w polach user-facing (typowo: "message"/"assumptions" czy
   ich odpowiedniki w tym stacku) — ale NIE w polach technicznych (komunikat deweloperski, wzór
   symboliczny, kod/identyfikator). Zanim uznasz skrypt za gotowy: wstrzyknij prawdziwą regresję do
   prawdziwego, już zmigrowanego pliku (nie do wymyślonego przykładu) i sprawdź, że skrypt ją
   złapie — szczególnie dla wzorców warunkowych (`warunek ? tekst1 : tekst2`), nie tylko
   bezpośredniego przypisania.
4. Wpnij oba (audyt + guard i18n, jeśli dotyczy) jako kroki w CI, gating merge PR.
```

Dlaczego warto zgłosić do new-app-standards: bez konkretnego przykładu każdy projekt rodziny
odkrywa te same pułapki od zera (włączenie bramki audytu bez sprawdzenia najpierw, regex zamiast
AST dla guardu i18n, brak testu na prawdziwym wzorcu warunkowym) — dokładnie to, co już się
zdarzyło w TYM projekcie mimo że reguła była znana od dnia wcześniej.

Status: 🔎 nowe. **Korekta (16.09.2026):** ta sesja błędnie oznaczyła to jako "przekazane" i otworzyła
PR wprost w `new-app-standards` (#9, teraz zamknięty bez mergowania, żadna treść nie trafiła na
`main` tamtego repo) — naruszenie zasady z góry tego pliku: "nigdy nie edytuj stąd bezpośrednio
plików w `new-app-standards`". Właściciel repo poprawił: samo dołączenie tamtego repo do sesji nie
czyni jej "sesją nad `new-app-standards`" uprawnioną do konsolidacji — jedyny dopuszczalny kanał
stąd to ten plik, konsolidacja zapada wyłącznie w osobnej, dedykowanej sesji. Wpis wyżej pozostaje
aktualnym zgłoszeniem, czeka na tamtą sesję, nie na nic z tego repo.

**✅ Potwierdzone skonsolidowane (Routine Y.6, 20.09.2026)** — porównanie treści z `new-app-standards`:
`docs/przyklady/ci/ci.yml` + `docs/przyklady/ci/audit-gate.mjs` + `docs/przyklady/i18n/check-i18n-guard.mjs`
istnieją, treścią odpowiadają dosłownemu YAML/skryptowi wklejonemu wyżej. To stwierdzenie faktu
(wpis już skonsolidowany), nie nowa decyzja o promocji.

---

[23.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — sztywny cykl Y.6/U.4 (≤3h, od wersji 2.18) generuje dużo
zerowych sprawdzeń przy wolno zmieniającym się `new-app-standards`

Szczegóły: 20.09.2026, w jednej sesji, dwa kolejne cykliczne sprawdzenia Y.6 wykonane w odstępie
~2 minut (jedno po zakończeniu poprzedniego zadania, drugie zaraz po) oba wylądowały na identycznym
`HEAD` klonu `new-app-standards` i nie znalazły żadnych nowych wpisów w `AKTUALIZACJE.md` — drugie
sprawdzenie było całkowicie zbędne, poza samym zapisaniem znacznika czasu. Ten projekt sam obniżył
lokalnie cykl do ≤12h (`rejestr-decyzji.md` D21, na wyraźne polecenie właściciela projektu) —
**świadomie NIE zmieniając** samego GOD BOOK/`PROMPT_STARTOWY.md` (NIETYKALNE), tylko cytat w
lokalnym `CLAUDE.md`. To rozwiązuje problem dla tego jednego projektu, ale nie dla reguły samej w
sobie — każdy kolejny projekt rodziny, który dosłownie zastosuje GOD BOOK Y.6 (≤3h), natrafi na to
samo marnotrawstwo, jeśli tempo zmian `AKTUALIZACJE.md` pozostanie rzędu godzin/dni, nie minut.

Dlaczego warto zgłosić do new-app-standards: sam cykl ≤3h (wersja 2.18) był reakcją na odwrotny
problem — rozjazdy trwające tygodniami przy cyklu 7-dniowym. Możliwe kierunki do rozważenia w
sesji nad `new-app-standards`: (a) cykl konfigurowalny per projekt zamiast jednej sztywnej wartości
dla całej rodziny, z ≤3h jako zalecanym domyślnym; (b) adaptacyjny cykl — wydłużaj automatycznie po
N kolejnych zerowych sprawdzeniach, skracaj z powrotem po wykryciu realnej zmiany; (c) zostawić
≤3h jako jest i pozwolić projektom downstream świadomie odstępować lokalnie (tak jak D21 tutaj) —
w takim wypadku ta reguła sama w sobie mogłaby zostać jawnie dopisana do Y.6 (dziś D21 jest
"cichym" lokalnym odstępstwem bez wyraźnego przyzwolenia w GOD BOOK na taką decyzję, tylko ogólną
zasadą Y.2 o świadomych konfliktach). Nie rozstrzygam, który kierunek — to pytanie projektowe dla
sesji nad standardem.

Status: 🔎 nowe. **✅ Skonsolidowane w standardzie (GOD BOOK v2.32, potwierdzone przy
synchronizacji Y.6 24.09.2026)** — wariant (b) z propozycji wybrany: **Y.6/U.4 cykl adaptacyjny
12h→48h** (start 12h, ×1,5 do pułapu 48h po zerowym sprawdzeniu, reset do 12h po realnej zmianie)
jako nowy domyślny mechanizm, zamiast sztywnego ≤3h. Źródło potwierdzenia: `AKTUALIZACJE.md` w
`new-app-standards`, wiersz 2026-09-24, cytat wprost: "zamyka retroaktywnie D21
inzynier-offgrid-pro". Ten projekt przyjął formułę: `rejestr-decyzji.md` D24 (zastępuje D21,
`CLAUDE.md` punkt 4).

---


---

[26.09.2026] KATEGORIA: DOBRA PRAKTYKA — oględziny przeglądarkowe (Playwright/headless) z jawnym `locale` języka UI

Szczegóły: przy sprawdzaniu nowego ekranu na buildzie produkcyjnym teksty założeń/ostrzeżeń pojawiły się
po angielsku. Przyczyną nie był błąd i18n, tylko domyślny `en-US` przeglądarki headless — aplikacja
poprawnie wybrała język z przeglądarki. Pół kroku diagnozy zostałoby oszczędzone, gdyby skrypt od razu
ustawiał `locale` (np. `newPage({ locale: "pl-PL" })`).

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z i18n (17) i językiem z przeglądarki
ma ten sam efekt. Propozycja do 10.8/10.9: skrypt oględzin/e2e ustawia `locale` jawnie i przechodzi
każdy kompletny język (17.7b) — zamiast polegać na domyślnym języku środowiska testowego.

Status: 🔎 nowe

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — OCR normy wymaga weryfikacji dwoma przebiegami i odczytu wizualnego zakresu używanego w kodzie

Szczegóły: pierwszy OCR paczki norm (tesseract, spot-check kilku stron) uznano za „dobrej jakości”.
Pełna weryfikacja wykazała zgubione wiersze tablic Załącznika krajowego (NA.1 bez strefy 2), zgubioną
całą tablicę (IEC Tablica 2.3), stronę poprawki z zepsutą warstwą tekstu (losowe znaki zamiast ψ2 = 0),
systematyczne „≤”→„<” i utracone wykładniki — spot-check tego nie wyłapał. Także PDF z natywnym tekstem
nie jest bezpieczny: wzory składane z pojedynczych znaków rozsypują się, a font Symbol potrafi
wyświetlać „+” jak „−”.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny opiera liczby na normach, często
skanach. Propozycja do procedury materiałów źródłowych: (1) kompletność stron; (2) drugi niezależny
przebieg OCR i automatyczne porównanie liczb strona po stronie; (3) słownik z poprawką tylko przy
kandydacie jednoznacznym/potwierdzonym; (4) obowiązkowy odczyt wizualny każdej tablicy/wzoru, zanim
liczba trafi do kodu, z oznaczeniem strony „zweryfikowano”; (5) błędy samego oryginału oznaczać `[sic]`,
nie poprawiać po cichu; (6) wzory z PDF — rozstrzygać znaki z kodów znaków, nie z podglądu.

Status: 🔎 nowe

[26.09.2026] KATEGORIA: DOBRA PRAKTYKA — audyt N.1 (źródło → rejestr) jako skrypt z kodem wyjścia, nie ręczny grep

Szczegóły: GOD BOOK v2.39 N.1 każe liczyć, czy każda pozycja źródła ma wiersz w rejestrze pokrycia. Ręczny przegląd modułów
w tym projekcie dwa razy przeoczył pozycje (M3 — 17 z 30; teraz M4 3.10 i M5 4.25 w modułach uznanych za „kompletne”).
Skrypt `scripts/audit-n1-rejestr.mjs` (`pnpm audit:n1`) zbiera identyfikatory z kanonicznej Biblii per moduł, rozwija zakresy
i listy skrótowe, porównuje z rejestrem i z plikami treści ekranów, kończy się kodem 1 przy brakującym wierszu. Przy okazji
wyłapuje luki pośrednich dokumentów (ID obecne w Biblii, pominięte w pliku treści modułu).

Dlaczego warto zgłosić do new-app-standards: każdy projekt z rejestrem pokrycia i numerowaną Biblią ma ten sam problem;
N.1 mogłoby wskazywać „kontrola mechaniczna (skrypt), nie przegląd” i opcjonalnie wpiąć ją do pakietu przed merge.
Pułapka do zapisania razem z regułą: regex list skrótowych („8.17,18”) musi wykluczać początek następnego ID („8.2, 8.10”).

Status: 🔎 nowe

[27.09.2026] KATEGORIA: BŁĄD / DOBRA PRAKTYKA — przetwarzanie źródeł: (1) MD5 przed dodaniem pliku, (2) `.docx` czytać akapity, nie tylko tabele, (3) tesseract z `OMP_THREAD_LIMIT=1`

Szczegóły: jedna sesja OCR znalazła trzy powtarzalne pułapki.
(1) Materiał „ze szkolenia ZIAD” dodany jako nowe źródło i opisany jako „może inna edycja” okazał się **bajt-w-bajt
identyczny** z plikiem już w repo (inna nazwa pliku) — 22,5 MB duplikatu i fałszywe zadanie „porównaj treść-po-treści”.
Jeden `md5sum` wobec `docs/zrodla/**` przed dodaniem rozstrzyga to w sekundę.
(2) W konwersji PPTX/PDF→DOCX co któryś wiersz tabeli ląduje **poza tabelą, jako zwykły akapit**. Sesja czytająca tylko
`d.tables` uznała 9 z 43 pozycji listy norm za „zgubione w konwersji” i przez 3 tygodnie trzymała je na liście
brakujących — a były w `d.paragraphs` tego samego pliku. Reguła: przy liście numerowanej sprawdzić ciągłość numeracji
w tabelach + akapitach łącznie, zanim cokolwiek uzna się za zgubione.
(3) `tesseract` uruchamiany równolegle (kilka procesów) bez `OMP_THREAD_LIMIT=1` zakleszcza się wątkami OpenMP —
1 strona trwała ~9 min zamiast ~1,3 s; z limitem 27 stron × 2 przebiegi w kilkadziesiąt sekund.
Plus (4) potwierdzona metoda weryfikacji norm z wzorami: odtworzyć przykłady liczbowe normy skryptem z przepisanych
wzorów — wykryło literówkę w samym oryginale (EN ISO 13786, D.1) i niespójność wzoru (26) z tablicami przykładów.

Dlaczego warto zgłosić do new-app-standards: dotyczy każdego projektu rodziny, który gromadzi normy w `docs/zrodla/`;
kandydat do procedury przetwarzania materiałów źródłowych (`docs/propozycje-do-new-app-standards/
przetwarzanie-materialow-zrodlowych.md`, Krok 0/1A/1D/2).

Status: 🔎 nowe

[27.09.2026] KATEGORIA: DOBRA PRAKTYKA / BŁĄD — tablice z norm w kodzie: (1) skrypt „kod ↔ tekst PDF” zamiast przepisywania na oko, (2) znaki relacji giną w ekstrakcji PDF, (3) formater bez konfiguracji w repo

Szczegóły: wdrożenie trzech norm w jednej sesji (PN-EN ISO 14683, EN ISO 13786, HD 60364-4-443).
(1) Tablica A.2 PN-EN ISO 14683 to 76 detali × 3 wartości = 228 liczb. Wartości wyjęte regexem z natywnego tekstu PDF do
JSON-a, a po napisaniu stałej TS drugi skrypt porównał kod z JSON-em (0 rozbieżności). Na oko 228 liczb to pewny błąd
przepisania; skrypt kosztuje minutę. Tam, gdzie znaczenie wiersza jest w rysunku (nie w tekście), opis z odczytu
wizualnego, a niepewny wiersz jawnie odsyła do rysunku normy zamiast zgadywać.
(2) W HD 60364-4-443 (PDF z tekstem) progi „CRL < 1000” / „CRL ≥ 1000” wyekstrahowały się jako „CRL  1 000” — oba
zdania identyczne. Kierunek rozstrzygnęły przykłady liczbowe normy. Reguła: po ekstrakcji sprawdzić, czy zdania z
nierównościami nie zgubiły symbolu; przykłady liczbowe normy jako test rozstrzygający.
(3) `npx prettier --write` w repo bez `.prettierrc` sformatował pliki domyślnymi ustawieniami (średniki, 80 znaków) —
setki linii szumu w diffie. Reguła: formatować tylko narzędziem i konfiguracją, które repo faktycznie ma.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny przenosi tablice normowe do kodu (rozdz. 03 —
stałe z nazwanych źródeł; rozdz. 10 — podwójna weryfikacja); (1) i (2) to konkretny, tani krok weryfikacji danych
tablicowych, (3) — higiena diffu przy pracy AI.

Status: 🔎 nowe

[27.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — porównanie wyniku zmiennoprzecinkowego z progiem wymaga tolerancji (fałszywe twarde stopy na granicy)

Szczegóły: w jednym dniu dwa niezależne ekrany dały fałszywe 🔴 dokładnie na granicy, oba złapane testem przypadku granicznego:
(1) 12,5 × 1,16 = 14,499999999999998 zamiast 14,5 V (limit napięcia urządzenia), (2) 0,8 × 0,9 = 0,7200000000000001 zamiast
0,72 kN/m² (obciążenie śniegiem równe nośności dachu wpisanej przez usera). W aplikacji liczącej twarde fakty różnica 1e-16
zmienia werdykt z ✅ na 🔴, a użytkownik widzi „przekroczono” przy wartościach, które sam wpisał jako równe. Rozwiązanie:
jawnie nazwana stała tolerancji w jednostce porównania (`EPS_V = 1e-9`, `EPS_KN_M2 = 1e-9`) plus test „wartość równa progowi
nie jest przekroczeniem” w każdym kalkulatorze z twardym stopem progowym.

Dlaczego warto zgłosić do new-app-standards: rozdz. 04 (walidacja i twarde stopy) opisuje progi, ale nie sposób porównania;
każdy projekt rodziny z twardymi stopami progowymi trafi na ten sam błąd. Kandydat na regułę: „porównanie iloczynu/ilorazu
z progiem — z nazwaną tolerancją; obowiązkowy test przypadku równości”.

Status: 🔎 nowe

[27.09.2026] KATEGORIA: BŁĄD — React `key={w.code}` przy liście ostrzeżeń zostawia nieaktualne komunikaty na ekranie
Szczegóły: wspólny `WynikSzczegoly` kluczował ostrzeżenia samym kodem. Ekran z listą urządzeń (M7/E19) emituje ten sam kod
kilka razy (jeden na urządzenie) — duplikaty kluczy sprawiły, że po uzupełnieniu danych na ekranie został komunikat „brak
minimalnej temperatury” dla urządzenia, które już ją miało. Silnik zwracał poprawny wynik; błąd tylko w DOM, złapany
zrzutem Playwright. Naprawa: `key={w.code + i}` (tak jak już dla założeń). Kod ostrzeżenia identyfikuje typ, nie wystąpienie.

Dlaczego warto zgłosić do new-app-standards: rozdz. o CalcResult/UI zakłada kod jako identyfikator ostrzeżenia; każdy
projekt rodziny z listami wejściowymi (wiele odbiorników, ogniw, obwodów) trafi na to samo, a skutek — nieaktualny werdykt
bezpieczeństwa na ekranie — jest groźny. Kandydat na regułę: „kod ostrzeżenia ≠ klucz renderowania; klucz = kod + indeks
(lub kod + pole/id wiersza)”.

Status: 🔎 nowe

[28.09.2026] KATEGORIA: BŁĄD — LaTeX w stringach JS: pojedynczy backslash przed `;` `,` `:` `!` znika bez ostrzeżenia
Szczegóły: wzory `FORMULA` pisane jako string JS z `\;` (odstęp w LaTeX) — JS traktuje `\;` jako zbędny escape i zostawia
samo `;`. Wzór pokazywany w UI traci odstępy, ale nic nie pada: typecheck, testy i build przechodzą. Znalezione w 4
istniejących kalkulatorach + 2 razy w nowym kodzie tej samej nocy. Naprawa: podwójny backslash + test strażnik skanujący
linie z `FORMULA` (`lib/core/__tests__/formula-escapes.test.ts`); alternatywa — włączyć ESLint `no-useless-escape`.

Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny pokazuje wzory (standard: jawny wzór w wyniku), więc
każda ma ten sam cichy błąd. Kandydat na regułę: „wzory LaTeX w kodzie — `String.raw` albo podwójny backslash, pilnowane
lintem (`no-useless-escape`) lub testem”.

Status: 🔎 nowe

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — „przykład źródła pasuje liczbowo do reguły z innego modułu” to nie dowód, że reguła obowiązuje
Szczegóły: M8/E1 (kominek z płaszczem wodnym) ma w źródle przykład „kominek 8 kW + bufor 400 l”. Liczbowo to dokładnie reguła
50 l/kW z M6/E14 — ale tam źródło podaje ją wyłącznie dla pompy ciepła. Kuszące echo (reużycie gotowego silnika) przeniosłoby
współczynnik na inne urządzenie bez podstawy w źródle ani normie. Nie przeniesiono; zapisane w rejestrze pokrycia jako „nie
zbudowane — reguła dotyczy innego urządzenia”.

Dlaczego warto zgłosić do new-app-standards: wzorzec „echo” (reużycie silnika) jest w rodzinie aplikacji promowany, a zgodność
liczbowa z przykładem wygląda jak weryfikacja. Kandydat na regułę: „echo wolno użyć tylko, gdy źródło/norma przypisuje regułę
temu samemu obiektowi fizycznemu; zbieżność z przykładem to hipoteza, nie podstawa”.

Status: 🔎 nowe

[28.09.2026] KATEGORIA: BŁĄD/PUŁAPKA — stawki regulowane zmieniają się w trakcie roku; model „stawka na rok” jest błędny
Szczegóły: M14 (rachunek za energię) — stawka jakościowa 2026 wynosiła 0,0331 zł/kWh w styczniu i 0,0332 zł/kWh od 1.02.2026
(zmiana współczynnika w taryfie operatora przesyłowego, przeniesiona automatycznie do wszystkich taryf dystrybucyjnych).
Źródła wtórne i pierwsza wersja opracowania podawały jedną wartość „na 2026”. Wykryte dopiero przy odczycie PDF taryf.

Dlaczego warto zgłosić do new-app-standards: Zasada 4 („stawki to dane, wersjonowane rocznie”) sugeruje granulację roczną.
Kandydat na regułę: każda stawka regulowana w pliku danych to lista okresów obowiązywania `{od, do, wartość, źródło}`;
walidator Zod odrzuca nakładające się okresy i dziury; kalkulator roczny waży okresy zużyciem.

Status: 🔎 nowe

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — poprawka ✏️ oparta na „wiedzy eksperckiej” bez odczytu pierwotnego to 🔎B, nie ✏️
Szczegóły: M14 — materiał właściciela podał „1,23 dla każdego prosumenta, także firmy, od 1.02.2025”. Opracowanie oznaczyło to
jako ✏️ (błąd), opierając się na wiedzy eksperckiej („dotyczy tylko nie-VAT”). Odczyt ustawy (art. 4c ust. 4 OZE + art. 31
noweli Dz.U. 2024/1847) wykazał, że materiał miał rację. Poprawka wycofana jawnie.

Dlaczego warto zgłosić do new-app-standards: D.7 (✏️) nie rozróżnia „poprawiono na podstawie dokumentu” od „poprawiono z
pamięci”. Kandydat na regułę: ✏️ zmieniające treść źródła wymaga odczytanej podstawy; bez niej wpis to „🔎 wątpliwość do
materiału” (treść źródła zostaje, obok pytanie), a nie korekta.

Status: 🔎 nowe

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — opcjonalne wejście, które przesuwa wynik w stronę mniej bezpieczną: `null` = strona bezpieczna + jawne założenie w każdym wyniku

Szczegóły: D29 (addendum) dodał do trzech kalkulatorów balastu pole „masa paneli i stelaża”. Masa działa korzystnie
(zmniejsza wymagany balast), więc źle wpisana albo zgadnięta obniża bezpieczeństwo. Zrobione tak: brak wartości
domyślnej (także w narzędziach AI — opis pola „nigdy nie zgaduj”), `null` = pominięta (dawny, zachowawczy wynik), a
każdy wynik niesie jedno z dwóch założeń: `…-MASA-WLASNA` (z wpisaną masą i współczynnikiem) albo `…-MASA-WLASNA-POMINIETA`.
Użytkownik zawsze widzi, na czym oparto liczbę; wynik nazwany jawnie „balast dodatkowy ponad …” (clamp do 0).
Dlaczego warto zgłosić do new-app-standards: rozdz. 00/07 zabraniają ukrytych domyślnych, ale nie mówią, co z polem
opcjonalnym, którego wpisanie działa na niekorzyść bezpieczeństwa. Kandydat na regułę: „pole opcjonalne zmniejszające
zapas bezpieczeństwa: puste = wariant zachowawczy, a wynik zawsze deklaruje, który wariant policzono”.
Status: 🔎 nowe

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — poziom pewności danych jako typ w schemacie, nie konwencja

Szczegóły: Plik stawek M14 (`lib/core/dane/rozliczenia-pl-2026`) ma przy każdej wartości pole `pewnosc`, a schemat Zod
przyjmuje wyłącznie `z.literal("potwierdzone")`. Wartość z jednego źródła wtórnego (🔎) po prostu nie przechodzi walidacji
przy starcie modułu i w testach — reguła „do kodu jako domyślna trafia tylko ✅” nie zależy od pamięci kolejnej sesji. Do
tego każda stawka jest listą okresów `{ odDnia, doDnia | null, wartosc }`, a nie parą (rok, wartość), bo stawka zmieniła się
w trakcie roku (1.02.2026). Brak wartości (ani w danych, ani z faktury użytkownika) daje `INCOMPLETE` z listą braków.
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny, która trzyma dane normatywne/cennikowe (stawki, normy,
współczynniki), ma ten sam problem „nie zgaduj brakujących danych”; wymuszenie typem jest tańsze niż audyt po fakcie i
pasuje do rozdziałów 02 (model danych) i 04 (walidacja).
Status: 🔎 nowe

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA / BŁĄD — ekrany-echo: jeden właściciel szkicu, reszta tylko czyta; data „dziś” na stronie prerenderowanej

Szczegóły: M14 ma kilkanaście ekranów, które liczą z tych samych danych (rachunek, zużycie miesięczne, PV). Zamiast
kopiować pola na każdy ekran, każdy szkic ma dokładnie jednego właściciela (`usePersistedDraft`), a ekrany pochodne czytają
go hookiem tylko do odczytu (`useOdczytDraftu`) i odsyłają linkiem do właściciela, gdy danych brak. Dwa ekrany piszące ten
sam klucz nadpisywałyby sobie stan (autozapis zapisuje cały obiekt). Druga lekcja: `new Date()` w renderze komponentu na
stronie statycznie prerenderowanej (status naboru dotacji „trwa/zakończony”) daje inny HTML na serwerze i kliencie → błąd
hydracji; rozwiązanie: `useSyncExternalStore` z migawką serwera równą dacie `stanNa` pliku danych.
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny z modułami „pochodnymi” (echo innego modułu) i z
danymi z datą ważności ma oba problemy; reguła „jeden właściciel szkicu” pasuje do rozdziału 05 (dane offline), a pułapka
daty — do 08 (UI) albo 12 (wydajność/SSR).
Status: 🔎 nowe


[29.09.2026] KATEGORIA: DOBRA PRAKTYKA — odczyt wizualny skanu dokumentu normatywnego: kontrola niezależnym dokumentem i testem

Szczegóły: Taryfa Enea 2026 istnieje tylko jako skan (załącznik decyzji URE, bez warstwy tekstowej). Zamiast OCR — render
stron w wysokiej rozdzielczości i odczyt wizualny tabel, a potem kontrola krzyżowa z niezależnym dokumentem tego samego
wydawcy (informacja OSD o stawkach brutto: netto × VAT musi dać opublikowaną kwotę; 11/11 zgodne). Kontrola zapisana jako
test, żeby przyszła edycja danych nie rozjechała się z brutto po cichu. Druga lekcja z tych samych tabel: tekst wyciągnięty
z PDF z warstwą tekstową (Stoen) gubi przypisanie komórek do kolumn przy pustych polach — przy tabelach z lukami odczyt
tekstowy służy tylko do znalezienia strony, wartości potwierdza render.
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny wpisuje dane z tabel norm/cenników w PDF; reguła
„odczyt skanu = render + kontrola niezależnym źródłem + test” pasuje do rozdziału 14 (proces) lub 02 (dane referencyjne).

[27.09.2026] KATEGORIA: BŁĄD PROCESU / DOBRA PRAKTYKA — dokument źródłowy „dodany, nieprzeczytany” potrafi wisieć bez końca; mechaniczna kontrola kompletności folderu źródeł

Szczegóły: whitepaper IEC 62109-1 dodano z opisem „rozpoznany tylko po tytule” i wpisem 🔲 „dokończyć odczyt”. Kolejna
sesja („popraw ekrany odblokowane przez nowe dokumenty”) zajęła się tylko normami odblokowującymi kod — wpis bez
powiązanego ekranu przegrał z zadaniami kodowymi, dopóki właściciel sam nie zapytał. Przy okazji indeks podawał błędną
liczbę stron (14 zamiast 11), wziętą bez otwarcia treści. Przegląd całego `docs/zrodla/` krótkim skryptem („każdy plik
folderu wymieniony z nazwy w jego `00-INDEKS.md`” + grep statusów „nieprzeczytany/fragmentarycznie”) znalazł też 6
oryginałów PDF, których nazwy indeksy pomijały (treść była wyekstrahowana do `.txt`, ale powiązania plik→wyciąg brakowało).
Reguły: (1) przy poleceniu typu „przerób nowe dokumenty” przejrzeć wszystkie 🔲 dotyczące folderu źródeł, nie tylko te
powiązane z ekranami; (2) po każdej paczce źródeł uruchomić kontrolę kompletności indeksów; (3) nie wpisywać do indeksu
metryk (liczba stron, zakres) bez otwarcia pliku.

Dlaczego warto zgłosić do new-app-standards: rozdz. 14 (proces i pamięć) i biblioteka norm źródłowych — każdy projekt
rodziny gromadzi normy w repo; kontrola jest tania, a „dodany, nieprzeczytany” to cicha luka wiedzy.

Status: 🔎 nowe

[29.09.2026] KATEGORIA: BŁĄD + POMYSŁ NA REGUŁĘ — strażnik i18n pilnuje tylko silników, nie tekstów w interfejsie; nowe ekrany znów dostają twarde polskie teksty w JSX
Szczegóły: pierwszy audyt Y.11 w tym repo (`docs/audyt-zgodnosci-kodu.md`, przebieg 1, pkt 1b) wykazał, że zmiany z jednego
dnia (29.09.2026, ok. 40 plików `app/`/`components/`) dodały polskie teksty wpisane wprost w JSX, bez `t(...)` — m.in.
`przelacznik-siec-wyspa` (18 linii), `porownanie-scenariuszy` (16), `optymalizacja-trasy-kabla` (13), `magazyn-firmy` (13),
a nowy ekran E38 `uziemienie-male-instalacje` nie ma ani jednego tłumaczenia. Stało się to w dniu, w którym standard dostał
8.12 (ekran bez PL/EN/RU nie jest ukończony) i 11.9 (strażnik „każdy X ma Y” od dnia wprowadzenia reguły). Przyczyna:
`check:i18n-guard` (17.9) sprawdza wyłącznie jądro — `Warning.message`/`assumptions` w `lib/core/modules/*` — a warstwy UI
nie sprawdza nic. Wszystkie kontrole były zielone, więc ani sesja pisząca kod, ani pakiet przed merge'em nie miały sygnału.
Reguła 17.1a („nowy kod UI nie dodaje twardych stringów”) istniała, ale jako jedyna z rodziny „każdy X ma Y” nie miała
strażnika na tej warstwie — i dryfowała dokładnie tak, jak 11.9 przewiduje. Tło: tylko 58 z 220 `page.tsx` używa
`useTranslate`, więc bez strażnika sesja nie odróżnia „stary ekran jeszcze niezmigrowany” (dozwolone, 17.9) od „nowy tekst
dopisany dziś” (naruszenie).
Propozycja: dopisać do 17.9 (albo 17.1a), że strażnik i18n obejmuje **obie warstwy**: (1) jądro — jak dziś; (2) UI —
skrypt AST (17.11) po `app/**/*.tsx` i `components/**/*.tsx`, który zgłasza tekst dla użytkownika podany wprost: `JsxText`
z literami, literał string w atrybutach tekstowych (`title`, `label`, `placeholder`, `aria-label`, `alt`, propsy typu
`tytul`/`opis`/`jednostka`) i literał w `{...}` wewnątrz JSX. Poza zakresem: klucze i18n, nazwy klas, identyfikatory,
same liczby/jednostki SI/symbole wzorów, pliki testów i strony-wzorniki (jawna lista wyjątków z powodem). Stary kod — lista
zapadkowa per plik sporządzona **jednorazowo** przy wprowadzeniu strażnika, dokładnie wg 11.9 (nic nie dochodzi, tylko
maleje; plik z listy, który już jest czysty, wymusza jej skrócenie). Opcjonalnie liczba trafień per plik zamiast samej
obecności — wtedy także dopisanie nowego tekstu do starego, niezmigrowanego ekranu zatrzymuje build.
Dlaczego warto zgłosić do new-app-standards: 17.9 mówi „mechanizm strażniczy wykrywający nowy twardy string”, ale nie mówi,
**gdzie** — projekt, który zaczyna migrację od jądra (jak ten), naturalnie pisze strażnika tylko tam i uznaje regułę za
pilnowaną. Warstwa UI to miejsce, gdzie teksty powstają najczęściej (każdy nowy ekran), więc luka jest największa właśnie
tam. Każdy projekt rodziny z i18n (17.1a jest bezwarunkowa) ma tę samą lukę, dopóki standard nie nazwie obu warstw wprost.
Lokalnie: decyzja A/B/C (naprawa + strażnik) czeka na właściciela — `docs/lista-do-zrobienia.md`, wpis Y.11 pkt 1b.
Status: 🔎 nowe
[29.09.2026] Wdrożone lokalnie (D58, decyzja właściciela „A + B”): `scripts/check-i18n-ui-guard.mjs` — AST po `app/**` i
`components/**`, liczba trafień per plik (wariant „opcjonalnie” z propozycji), lista zapadkowa 248 plików / 3711 tekstów.
Koszt wdrożenia z listą zapadkową: jedno popołudnie; do rozważenia w standardzie gotowy skrypt jako wzór (17.11).

[29.09.2026] KATEGORIA: BŁĄD — `context.setOffline(true)` Playwrighta nie odcina `fetch()` wykonywanego przez Service Workera; strażnik „puste przejście” z 10.8 tego nie wykrywa

Szczegóły: Porównanie naszego `public/sw.js` ze wzorcem `docs/przyklady/pwa/` (`docs/audyt-sw-vs-wzorzec-pwa.md`),
pomiar na buildzie produkcyjnym, `playwright` 1.63 + Chromium. Po `context.setOffline(true)` nawigacja do strony
nigdy wcześniej nieodwiedzonej zwróciła 200 z `fromServiceWorker() === true` — SW (strategia „najpierw sieć”) pobrał ją
z sieci i zapisał do cache. Strażnik z 10.8 (żądanie `/api/**` ze strony ma zawieść offline) był zielony, bo takie
żądanie SW puszcza wprost z karty, a tam emulacja działa. Dopiero ubicie serwera (`process.kill(-pid)`) dało prawdziwy
wynik: `net::ERR_FAILED`. Test oparty na samym `setOffline` dałby fałszywie zielony wynik dla każdej strategii SW, która
w ogóle sięga do sieci (fallback „precache → sieć” we wzorcu też).

Dlaczego warto zgłosić do new-app-standards: 10.8 opisuje `setOffline` jako sposób przejścia offline i strażnik, który
ma chronić przed fałszywą zielenią — a ten konkretny przypadek przepuszcza. Propozycja: w 10.8 prawdziwy offline przez
zatrzymanie serwera (albo `context.route('**', r => r.abort())`, do sprawdzenia, czy obejmuje SW) i drugi strażnik:
nawigacja do strony spoza cache SW ma zawieść offline.

Status: 🔎 nowe

[29.09.2026] KATEGORIA: DOBRA PRAKTYKA — strażnik rejestru twardych stopów (4.3 + 11.9) musi rozpoznawać nie tylko literał `{ code, level: "critical" }`

Szczegóły: Wdrożenie `scripts/check-stopy-guard.mjs` (AST). Pierwsza wersja zbierała tylko literały obiektów i przegapiła
13 stopów, które rejestr już wymieniał: funkcje pomocnicze `ostrzezenie("KOD", "critical", …)`, poziom przejęty z innego
ostrzeżenia (`inneOstrzezenie().level`), `level: zmienna` i kod przekazany parametrem do wspólnej funkcji. Działające
rozwiązanie: (1) poziom nieliteralny traktować jak 🔴 (ostrożnie); (2) wywołanie z argumentem `"critical"` = stop, kod =
pierwszy argument w kształcie kodu; (3) szablon `${field}-NIEDODATNI` → wzorzec `*-NIEDODATNI`; (4) kod z parametru =
„źródło dynamiczne”, które trzeba zadeklarować z listą możliwych kodów (nowe miejsce = błąd). Druga lekcja: wyjątki
„walidacja danych” klasyfikować po treści warunku (`technicalMessage`), nie po nazwie kodu — `*-POZA-ZAKRESEM` bywa
walidacją formularza, ale `WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM` to stan instalacji.

Dlaczego warto zgłosić do new-app-standards: 4.3 (dopisek) i 11.9 wymagają strażnika, ale nie mówią, co ma rozpoznawać;
każdy projekt rodziny, który napisze go „na literałach”, dostanie fałszywie zielony wynik przy pierwszej funkcji
pomocniczej. Skrypt z testami (`lib/core/__tests__/stopy-guard.test.ts`) nadaje się na wzór (17.11).

Status: 🔎 nowe

[29.09.2026] KATEGORIA: BŁĄD — wzorzec PWA (`docs/przyklady/pwa/sw-rdzen.js`) przy włączonej bramce logowania zapisze stronę logowania pod adresem każdego ekranu

Szczegóły: Migracja SW do wzorca (D59, `docs/plan-migracji-sw-wariant-c.md`). `pobierzDoCache` przyjmuje każdą
odpowiedź `ok`, a `bezPrzekierowania` zapisuje treść po przekierowaniu. Standard 18.1 każe przekierować niezalogowanego
na logowanie z każdej trasy — instalacja SW w przeglądarce bez sesji (albo po wygaśnięciu sesji w trakcie instalacji)
zapisze więc HTML strony logowania pod URL-em każdego ekranu, a offline użytkownik zobaczy wszędzie logowanie. Lokalnie
naprawione: po `fetch`, jeśli `odp.redirected` i ścieżka docelowa zaczyna się od `/auth/` → `throw` (instalacja się nie
udaje, stara wersja zostaje, przeglądarka ponowi przy kolejnej nawigacji) + `czyPominac` pomija `/auth/**`; test w
`lib/pwa/__tests__/sw-rdzen.test.ts`. Przy okazji: wzorzec pomija trasy dynamiczne (`[id]`), a przy CSP nonce-per-request
(7.3) `prerender-manifest.json` jest pusty — lista konkretnych URL musi przyjść z rejestru aplikacji (u nas
`trasyDynamiczne` z `lib/pulpit/registry.ts`).

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny ma logowanie od pierwszego uruchomienia (18.1) i ten
sam wzorzec SW (5.8) — luka dotyczy wszystkich, a ujawnia się dopiero w dniu włączenia logowania. Propozycja: strażnik
przekierowania do `sw-rdzen.js` wzorca (ścieżka logowania jako parametr `__SW_KONFIG`) i pole `trasyDynamiczne` w
`precache.ts`.

Status: 🔎 nowe

[29.09.2026] KATEGORIA: BŁĄD — `page.waitForFunction` Playwrighta z predykatem `async` przechodzi od razu (Promise = „prawda”)

Szczegóły: e2e SW (D59, `e2e/pomocnicze.mjs`). Oczekiwanie „SW aktywny i precache gotowy” zapisane jako
`page.waitForFunction(async () => …)` kończyło się po ~100 ms przy pustym cache — zwrócony Promise jest traktowany jak
wartość prawdziwa. Kolejne kroki testu (ubicie serwera, nawigacje offline) biegły przed końcem instalacji i dawały
mylące `ERR_INTERNET_DISCONNECTED`. Poprawka: pętla z `page.evaluate` (ono czeka na Promise) + `.catch(() => false)`, bo
przeładowanie w trakcie niszczy kontekst wykonania.

Dlaczego warto zgłosić do new-app-standards: wzorzec testowy 10.8/10.9 każe czekać na gotowość SW i precache — naturalny
zapis tego czekania jest asynchroniczny (`getRegistration()`, `caches.keys()`), więc każdy projekt wpadnie w to samo.
Propozycja: gotowa funkcja „czekaj na SW” w `docs/przyklady/pwa/` (nasza: `e2e/pomocnicze.mjs`, `czekajNaSw`).

Status: 🔎 nowe

[30.09.2026] KATEGORIA: BŁĄD — wykluczenie biblioteki z precache „bo ekran ma część online” zepsuło tryb offline tego ekranu

Szczegóły: SW etap 1 (D59) wykluczył worker MapLibre z precache z uzasadnieniem „mapa i tak wymaga sieci” (podkład WMS).
Ta sama mapa rysuje jednak offline geometrię spaceru GPS (D22) — a MapLibre przetwarza GeoJSON w workerze. Offline
znikał obrys działki, zostawały same znaczniki HTML. Test e2e „każdy ekran otwiera się offline” przeszedł, bo sprawdzał
tylko HTTP 200 + `<h1>`, nie treść mapy ani `pageerror`. Wykryte dopiero przy ręcznym pomiarze etapu 2 (sesja 30.09),
naprawione, pilnuje test e2e z modelem działki w IndexedDB. W tym samym przebiegu: Server Action wołana przy montowaniu
komponentu w layoucie (`isAiAvailable()`) bez `.catch` rzucała offline `TypeError: Failed to fetch` na **każdym**
ekranie — też niewidoczne dla testu, który nie zbierał `pageerror`.

Dlaczego warto zgłosić do new-app-standards: 5.8 każe odchudzać precache, a README wzorca podaje wykluczenia jako
zwykły krok — łatwo wykluczyć zasób, który ekran używa także offline. Propozycja: (1) w 5.8 zdanie „przed wykluczeniem
zasobu z precache sprawdź na buildzie produkcyjnym, offline, każdy ekran, który go ładuje — „ekran ma część online” ≠
„zasób jest tylko online”; (2) w 10.9 test offline zbiera `pageerror` na każdej stronie (nie tylko status i `<h1>`);
(3) w 9.0: sprawdzenie dostępności AI przez Server Action musi mieć `.catch` — offline to normalny stan appki.

Status: 🔎 nowe

[30.09.2026] KATEGORIA: DOBRA PRAKTYKA + BŁĄD — migracja tekstów starych ekranów na klucze i luki strażnika i18n UI

Szczegóły: Lista zapadkowa strażnika UI (17.1a) miała 248 plików / 3711 tekstów. Ręczna migracja plik po pliku była
nierealna, więc powstał jednorazowy skrypt AST (`scripts/migracja-i18n-ui.mjs`: wyciągnij teksty → tłumaczenia w JSON →
zastosuj: przepisz JSX na `t()`, utwórz plik grupy kluczy, obniż listę zapadkową → sprawdź podejrzane literały).
Partia ~400 tekstów to ~30 minut zamiast dni. Po drodze trzy luki, których strażnik nie łapie: (1) teksty bez polskich
znaków diakrytycznych w stałych modułu (np. „Przewody prowadzone w peszlu”) — heurystyka „polskie litery” je pomija;
(2) teksty ze stałych domeny (`lib/core/**/constants.ts`, `label` opcji) renderowane wprost na ekranie — poza zasięgiem
strażnika UI, w EN/RU zostają po polsku; (3) klucz wstawiony do stałej poza komponentem bez `t()` przy renderze —
ekran pokazuje surowe `UI-…`, typecheck tego nie widzi (to nadal `string`).

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny, który zaczynał bez i18n, ma tę samą listę
zapadkową do spłaty. Propozycja: (1) w 17.1a wzmianka, że migrację robi się narzędziem AST partiami (moduł po module),
z krokiem „sprawdź” po zastosowaniu; (2) strażnik dodatkowo zgłasza literały w tablicach/rekordach stałych na stronach
(nie tylko teksty z polskimi literami); (3) reguła, że etykiety stałych domeny to kody tłumaczone w UI, nie gotowe
zdania PL; (4) test/strażnik szukający surowych `"UI-` przekazywanych do JSX bez `t()`.

Status: 🔎 nowe

[30.09.2026] KATEGORIA: DOBRA PRAKTYKA — test „te same `{parametry}` w każdym języku” dla tekstów pomocy

Szczegóły: 8.4b pkt (3) — liczby silnika w tekstach „Fizyka”/„i” podawane przez `{nazwa}` + `parametry`, nie przepisane.
Przy przepinaniu 16 ekranów M2–M14 jeden rosyjski tekst (depozyt prosumencki) miał inne brzmienie niż PL/EN, więc
zamiana go ominęła — PL/EN pokazywały stawki z pliku danych, RU nadal wpisane na sztywno. Wyłapał to od razu test
w `lib/i18n/__tests__/pomoc.test.ts`: dla każdej ścieżki tekstu zbiór `{…}` w EN i RU musi być równy PL.

Dlaczego warto zgłosić do new-app-standards: 8.4b wymaga parametrów zamiast przepisanych liczb, ale nie mówi, jak
pilnować, że wszystkie języki się przepięły — przepisana liczba w jednym języku to dokładnie ten dryf, któremu 8.4b
ma zapobiegać, a wizualnie niewidoczny (liczba wygląda poprawnie, dopóki silnik jej nie zmieni). Propozycja: w 8.12
(lub 10.x) zdanie „test i18n porównuje zbiór placeholderów każdego tekstu między językami” — kilka linii, zero kosztu.

Status: 🔎 nowe

[01.10.2026] BŁĄD — pętla czekania `until ! pgrep -f "<skrypt>"` łapie samą siebie i nigdy się nie kończy
Szczegóły: sesja AI czekała w tle na zakończenie skryptu kontroli pętlą `until ! pgrep -f "sprawdz.sh …"; do sleep …; done`.
`pgrep -f` dopasowuje pełny wiersz poleceń — także powłoki, w której ta pętla działa (jej tekst zawiera szukany wzorzec),
więc warunek nigdy nie stał się prawdziwy. Kolejne kroki (rejestracja ekranu) czekały w nieskończoność; trzeba było
zabić procesy ręcznie.
Dlaczego warto zgłosić do new-app-standards: to samo czekanie na proces tła robi AI w każdym projekcie rodziny (build,
testy, dev server). Propozycja do 15.x: „czekaj na PID (`wait <pid>` / `kill -0 <pid>`) albo na plik-znacznik, nie na
`pgrep -f` z tekstem występującym we własnym poleceniu”.
Status: 🔎 nowe

[01.10.2026] PUŁAPKA — porównanie gałęzi z `main` w płytkim klonie daje fałszywe „setki niescalonych commitów”
Szczegóły: sesja w chmurze dostała płytki klon (`git rev-parse --is-shallow-repository` = `true`, 173 z 743 commitów
`main`). `git rev-list main..gałąź` i `git cherry` pokazały 300–570 „niescalonych” commitów na każdej starej gałęzi,
choć po `git fetch --unshallow` 52 z 56 gałęzi miało zero łatek spoza `main`. Na tej podstawie łatwo zaraportować
właścicielowi rozjazd, którego nie ma, albo scalić stare gałęzie „na wszelki wypadek” i cofnąć dokumenty.
Dlaczego warto zgłosić do new-app-standards: przegląd niescalonych gałęzi na starcie sesji (15.23) robi każda sesja
AI w każdym projekcie rodziny. Propozycja do 15.23: „przed porównaniem gałęzi sprawdź `--is-shallow-repository`;
`true` → `git fetch --unshallow`”.
Status: 🔎 nowe

[01.10.2026] PUŁAPKA — hook tłumaczeń w Server Component przechodzi wszystkie kontrole statyczne i daje HTTP 500
Szczegóły: masowa migracja tekstów do `t()` (D58) dopisała `const t = useTranslate()` do stron bez dyrektywy
`"use client"`. `tsc`, ESLint, strażnicy i testy jednostkowe były zielone; strona zwracała 500 („Attempted to call
useTranslate() from the server”) — 8 ekranów, 5 z nich już na `main`. Wykryte dopiero przez `next dev` + `curl`.
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z i18n po stronie klienta (17.4, offline-first)
ma ten sam hook i te same masowe migracje. Propozycja do 17.x/11.9: tani strażnik AST „plik bez `"use client"`
nie wywołuje `use*()` z modułu klienckiego” albo smoke-test HTTP 200 dla każdej trasy w CI.
Status: 🔎 nowe

## 2026-10-02 — strażnik i18n musi widzieć teksty z `lib/` wstawiane w JSX
Strażnik UI skanował tylko `app/`+`components/` i raportował „OK”, podczas gdy ~100+ polskich tekstów z `lib/` (rejestr nawigacji, label-e stałych,
komunikaty błędów hooków, parametry ostrzeżeń) trafiało na ekran surowo. Rekomendacja: strażnik skanujący eksportowane literały z polskimi znakami w `lib/`
(poza promptami AI, testami) przypisane do pól tekstowych, oraz test „każdy wpis rejestru ma klucze we wszystkich językach” generowany z rejestru.

## 2026-10-02 — waluta wyświetlania i metadane per język jako część i18n
Rekomendacja: standard 17 powinien mówić, że „język” i „waluta” to dwie osobne preferencje (nie „zł” w kodzie), z formatterem `Intl` na granicy wyświetlania i domeną liczoną w jednej walucie bazowej; oraz że metadane serwerowe (title/description/manifest) idą z `Accept-Language`, bo serwer nie widzi localStorage — wyjątek od „zero serwera” z 17.4 uzasadniony tylko tagami czytanymi przed JS. Dodatkowo: brak publicznego API kursów banku/fintechu → ECB + kurs ręczny + narzut, nie udawanie źródła.

[02.10.2026] KATEGORIA: DOBRA PRAKTYKA — waluta wyświetlania, przeliczanie kwot w polach po zmianie waluty i źródło kursów (EBC/Frankfurter + serwerowa kopia)
Szczegóły: pełna, samodzielna instrukcja w `docs/propozycje-do-new-app-standards/waluta-i-kursy.md`. Streszczenie: domena w jednej walucie bazowej, wybór waluty tylko na granicy wyświetlania (`useZl`, `{waluta}` w tekstach, ekrany rynku bazowego przypięte do bazowej); wartości w polach kwotowych **przeliczane** przy zmianie waluty (szkic zapisany ze znacznikiem waluty, współczynnik kursNowy/kursStary, 6 cyfr znaczących, komunikat „przeliczono kursem EBC z dnia …”); kurs efektywny = ręczny > automatyczny × (1+narzut); automatycznie Frankfurter (kursy referencyjne EBC, bez klucza), łańcuch `/api/kursy` (trwały zapis w tabeli z historią, świeży <12 h, zapis nieaktualny gdy źródło padnie) → Frankfurter bezpośrednio → ostatni zapis lokalny z widoczną datą aktualizacji; brak kursu → waluta bazowa, nigdy błędna liczba.
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny z kwotami i wieloma rynkami ma ten sam problem (u nas „zł” zaszyte w słownikach i polach przez cały projekt, naprawa objęła ~26 ekranów i setki tekstów); wcześniejsze wpisy z 02.10 zawierały tylko rekomendację — tu jest gotowy wzorzec do wzięcia 1:1. Propozycja do 17.x: osobna sekcja „waluta” obok „języka”.
Status: 🔎 nowe

[02.10.2026] KATEGORIA: BŁĄD — strażnik i18n „OK” przy niekompletnych tłumaczeniach EN/RU (zasięg skanu węższy niż powierzchnia tekstów)
Szczegóły: strażnik UI skanował `app/`+`components/`; teksty z `lib/` wstawiane w JSX, teksty bez polskich liter i „zł” w słownikach/nazwach pól omijały go, więc zielone CI przykrywało surowy polski w EN/RU. Realnie pomogły: niezależny skan `lib/`, test z rejestru (klucze we wszystkich językach) i test zgodności `{params}` PL/EN/RU (złapał brak `{waluta}` w jednym tłumaczeniu RU). Dodatkowa pułapka tego samego rodzaju: test trasy `app/api/**` leżał poza `include` runnera (`lib/**`) i po cichu się nie uruchamiał — logikę trzymać w `lib/`, trasę robić cienką.
Dlaczego warto zgłosić do new-app-standards: „strażnik zielony” bywa fałszywym poczuciem bezpieczeństwa w każdym projekcie z ratchetem. Propozycja do 17.9/10.x: (a) strażnik raportuje swój zasięg i liczbę skanowanych plików, (b) skan literałów z `lib/`, (c) obowiązkowy test zgodności `{params}` między językami, (d) kontrola, że każdy plik testowy mieści się w `include` runnera.

[02.10.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak mechanizmu archiwizacji dla `docs/memory.md` i `docs/lista-do-zrobienia.md` (W.5 opisuje problem, nie daje procedury)
Szczegóły: GOD BOOK W.5 mówi, że rosnący dokument jest sygnałem do podziału, a C.8 ustala poziomy czytania (indeks → TL;DR → pełna treść), ale żaden z nich nie wskazuje, JAK skrócić plik, który z zasady jest append-only. Jedyny mechanizm archiwizacji w GOD BOOK (Y.8) dotyczy wyłącznie `docs/wklad-do-standardu.md`. W tym projekcie po miesiącu pracy `docs/memory.md` ma ok. 770 KB (264 sekcje, 8,8 tys. linii), `docs/lista-do-zrobienia.md` ok. 300 KB (1,6 tys. linii), a GOD BOOK ok. 255 KB. Każda sesja AI musi na starcie czytać te pliki (CLAUDE.md: „Zanim zaczniesz”), więc albo zużywa większość okna kontekstu, albo czyta wybiórczo i traci pułapki zapisane głęboko w pliku. Efekt uboczny: w tak długim logu nie da się odróżnić pułapki nadal obowiązującej od historii zamkniętego etapu.
Propozycja mechanizmu (do rozważenia jako rozszerzenie Y.8 / nowa część przy W.5; pilotaż w tym projekcie od 02.10.2026, wynik dopiszemy w tym wpisie):
1. **Układ.** `docs/memory.md` zostaje pod tą samą nazwą (nie psuje odsyłaczy w CLAUDE.md/Biblii) jako **plik aktywny**: TL;DR + skrót obowiązujących pułapek, konwencji i decyzji pogrupowany tematycznie + indeks archiwum + sekcje z ostatniego okna czasowego i wszystkie z otwartym wątkiem. Pełna historia: `docs/memory-archiwum/` (pliki okresowe lub tematyczne, ok. 40–75 KB) + `INDEKS.md` (plik → zakres dat → tematy). Ta sama zasada dla `docs/lista-do-zrobienia.md`: wpisy ✅ starsze niż próg do archiwum, w żywej liście zostają ⚠️ 🔲 ⏳ 🔄.
2. **Kryterium przeniesienia (jak w Y.8):** sekcja bez otwartego wątku (brak ⚠️/🔲/⏳/„do potwierdzenia”) i starsza niż próg wieku (w pilotażu 7 dni).
3. **Bezstratność jako warunek.** Przeniesienie 1:1, z dowodem: złączona treść plików archiwum musi być bajt w bajt równa wycinkowi oryginału (skrypt porównujący, wynik w `memory.md`). Nic nie jest skracane „dla zwięzłości” (D.5) — skrót jest dopisywany OBOK, nigdy w miejsce.
4. **Destylacja.** Przed przeniesieniem ktoś (człowiek lub AI) czyta archiwizowaną treść i wyciąga do pliku aktywnego to, co nadal obowiązuje (pułapki środowiska i narzędzi, konwencje, decyzje i ich uzasadnienie, otwarte odstępstwa) z odsyłaczem „szczegóły: plik archiwum, sekcja”. Historia zamkniętych partii („zbudowano ekran X”) zostaje tylko w archiwum.
5. **Punkt wejścia dla sesji.** C.8/Y.4 uzupełnione o zdanie: na starcie czytaj TL;DR i skrót aktywny, do archiwum sięgaj przez `INDEKS.md` i `grep`, nie przez pełne wczytanie.
6. **Wyzwalacz.** Przy pełnym audycie (Y.9) albo gdy plik przekroczy próg rozmiaru (propozycja: >150 KB lub >2 tys. linii), sesja pracująca bezpośrednio nad projektem wykonuje przebieg i odnotowuje go w `memory.md` (data, liczba sekcji, wynik weryfikacji bezstratności) — ta sama granica co w Y.8 (sesja nad `new-app-standards` tego nie wykonuje, może tylko zaproponować).
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny stosuje ten sam tryb pracy (append-only log decyzji + lista zadań + obowiązek czytania ich na starcie sesji), więc każdy dojdzie do tego samego punktu (u nas po ok. 4 tygodniach intensywnej pracy z AI). Reguła „nie kasujemy” bez mechanizmu archiwizacji wymusza albo rozrost plików, albo cichą utratę kontekstu, albo ad hoc przeróbki bez weryfikacji. Wzorcem jest istniejące Y.8; brakuje jego uogólnienia na pliki robocze, kryterium wieku/otwartego wątku, dowodu bezstratności i kroku destylacji.
Status: 🔎 nowe

[02.10.2026] KATEGORIA: PUŁAPKA + DOBRA PRAKTYKA — migracja etykiet w ostrzeżeniach silnika do kluczy (`*Key`): mechaniczna podmiana trafia w nazwę pola, a centralne rozwijanie kluczy oszczędza ~100 ekranów
Szczegóły: (1) Pułapka. Ostrzeżenia zakresu miały `field: "albedo"` i `params: { label: "albedo", … }` — nazwa pola (identyfikator techniczny) i polska etykieta bywają identyczne. Zbiorcza podmiana „literał etykiety → klucz tłumaczenia” po tekście zmieniłaby też `field` (a ten łączy ostrzeżenie z polem formularza) i zepsułaby powiązanie po cichu: typecheck, lint i strażnik zostają zielone, bo oba są `string`. Skuteczne: podmieniać wyłącznie argument etykiety (regex z kontekstem, np. poprzedzony `, `), nigdy pierwszy argument `field`; po migracji test na istniejących ostrzeżeniach sprawdzający, że `field` został bez zmian. (2) Wzorzec. Zamiast edytować każdą stronę renderującą ostrzeżenia, konwencja „parametr zakończony na `Key` niesie klucz słownika”: `t(language, key, params)` przed podstawieniem rozwija `labelKey: "POLE-X"` do `label` = tekst w języku UI, a szablon używa `{label}`. Strony i narzędzia AI nie wymagają zmian; dodatkowo test „każdy klucz `POLE-*` ma wpis w PL/EN/RU”. (3) Luka strażnika silnika: nie widzi pól `string` w `value` wyniku ani `message` budowanego w funkcji pomocniczej, więc takie teksty omijają kontrolę — do domknięcia osobno.
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z silnikiem zwracającym klucze + params przechodzi tę migrację, a pułapka „zielone kontrole, zepsute powiązanie pole↔ostrzeżenie” kosztuje debugowanie w UI. Propozycja do 17.x: (a) konwencja `*Key` rozwijana centralnie w `t()`; (b) w opisie migracji masowych zapis „podmieniaj argument, nie identyfikator; dodaj test niezmienności identyfikatorów”; (c) strażnik silnika skanujący także `value` typu `string` i `message` w funkcjach pomocniczych.
Status: 🔎 nowe

[02.10.2026] KATEGORIA: DOBRA PRAKTYKA + LUKA STRAŻNIKA — strażnik i18n silnika powinien łapać też `message` jako template literal oraz literały w `label`/`*Key`; typ parametru wymusza migrację sygnatur
Szczegóły: (1) `message: `…${x}…`` (TemplateExpression) omijało strażnika, który sprawdzał tylko literały proste — dwa moduły (komunikacja-bms, audyt-pozarowy) zwracały gotowy tekst PL mimo „zielonego” strażnika. Poprawka: reguła obejmuje `StringLiteralLike` i `TemplateExpression`. (2) Reguła dla parametrów: właściwość `*Key` musi mieć wartość będącą kluczem słownika (UPPER-CASE-Z-MYSLNIKAMI; pusty string dozwolony), a `label:` z literałem tekstowym jest zgłaszane — łapie polski tekst przemycony pod nazwą parametru. (3) Przy masowej migracji etykiet zmiana typu argumentu (etykieta → klucz) sprawia, że kompilator wskazuje każde nieprzemigrowane wywołanie; nie trzeba ręcznie szukać. (4) Dane instalacji (kategoria/element/opis z danych użytkownika lub z odczytu) przekazuje się w `params` jako zwykłe wartości — to nie tekst silnika i nie podlega tłumaczeniu; tłumaczeniu podlega tylko szablon (`{kategoria} — {element}: {opis}`).
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z silnikiem „klucze + params” powieli te dwie luki strażnika, a rozróżnienie „tekst silnika vs dane użytkownika w params” rozstrzyga częste wątpliwości przy migracji. Propozycja do 17.9: strażnik silnika obejmuje template literal w `message` i walidację `*Key`/`label`; zapis w 17.2, że dane użytkownika w `params` są dozwolone.
Status: 🔎 nowe

## [02.10.2026] Domyślna wartość pola edytowalnego zależna od języka — `null` zamiast wpisanego tekstu
**Problem:** pole formularza startujące z przetłumaczonym tekstem (np. domyślne „żądanie” w piśmie) zapisane do stanu przy montowaniu zamraża język z chwili wejścia; po zmianie języka zostaje stary tekst. **Wzorzec:** stan `string | null`, `null` = „użytkownik nie edytował”; wyświetlana wartość `stan ?? t(klucz)`. Tak samo przy generowanych dokumentach (pisma, eksporty): treść składana z `t()` w momencie renderu, nie w stanie.

## [02.10.2026] Proxy ciężkiego API zewnętrznego — agreguj po stronie serwera i weryfikuj kształt NA ŻYWO przed pisaniem adaptera
**Problem:** odpowiedź zewnętrznego API (PVGIS `seriescalc`) to do ~14 MB godzinowych rekordów, a ekran potrzebuje sum dobowych (kilkadziesiąt KB). Do tego udokumentowane granice (zakres lat 2005–2023, pola tylko przy dodatkowych parametrach) wychodzą dopiero przy żywym zapytaniu. **Wzorzec:** (1) przed adapterem zrób jedno żywe zapytanie próbne i na jego kształcie oprzyj schemat zod i fixture testowe — nie na pamięci o dokumentacji; (2) Route Handler zwraca klientowi już zagregowany wynik (rozmiar odpowiedzi do przeglądarki ≪ rozmiar odpowiedzi upstream), z cache `private, max-age`; (3) timeout dobierz do rozmiaru odpowiedzi, nie kopiuj z lżejszego endpointu; (4) brakująca/niekompletna jednostka agregacji (doba bez 24 rekordów) = `null`, nigdy dopełnienie. **Dlaczego warto:** ta sama klasa błędów (zgadywany kształt, zbyt krótki timeout, wysyłanie megabajtów do klienta) czeka każdy projekt rodziny z proxy do danych zewnętrznych (06-api-i-siec.md, 6.1).
Status: 🔎 nowe

[03.10.2026] KATEGORIA: DOBRA PRAKTYKA — tłumaczenie `CalcResult.formula` przez opcjonalne `formulaKey`/`formulaParams` obok polskiego `formula`
Szczegóły: standard 03 (dopisek z 15.09.2026) mówi tylko, że klucz dotyczy `formula` w modułach z opisową prozą, ale nie opisuje techniki. Wdrożenie w tym projekcie (91 formuł): (1) kontrakt `CalcResult` dostaje opcjonalne `formulaKey?: string` i `formulaParams?: Record<string, string | number>`; `formula` (PL) zostaje — narzędzia AI, testy i eksporty dalej go czytają, więc zmiana jest wsteczna; (2) tłumaczy wyłącznie warstwa prezentacji (`formulaKey ? t(formulaKey, formulaParams) : formula`) — jeden komponent wyniku + migawka pomocy; (3) tłumaczy się prozę i indeksy opisowe, symbole matematyczne zostają; (4) stałe liczbowe interpolowane do wzoru idą jako `{p1}…` w `formulaParams`, nie wklejone w tekst; (5) test zgodności: placeholdery PL = EN = RU, każdy klucz użyty i istniejący; (6) ogólny test placeholderów musi pomijać klucze wzorów, bo nawiasy LaTeX (`_{ready}`) wyglądają jak placeholdery. Ocena skali przed pracą: policz formuły z polskimi słowami skryptem — nasze szacunki „~25” wyszły 91.
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z wzorami w wyniku ma ten sam problem, a bez opisanej techniki każdy wymyśli własną (np. tłumaczenie po treści wzoru, co psuje się przy każdej edycji). Propozycja do 03/17.2: zapis kontraktu `formulaKey`/`formulaParams`, zasada „PL zostaje, tłumaczy prezentacja” i wymóg testu zgodności placeholderów; oraz test dryfu PL słownika względem literału wzoru w module (wdrożony u nas 03.10.2026; zielony od razu, ale sprawdzony, że pada po zmianie wpisu).
Status: 🔎 nowe

[04.10.2026] KATEGORIA: DOBRA PRAKTYKA — przegląd założeń ✅🤖 pod kątem „liczby bez źródła” i „zera, które znika”
Szczegóły: przy potwierdzaniu przez właściciela 3 partii założeń AI (D73–D75) wszystkie realne problemy były jednego z dwóch typów: (a) liczba przyjęta przez AI bez źródła (próg słabego punktu 70% w M7/E12 — źródło miało tylko przykład 74%); (b) brak danych albo zero, które w agregacie nie jest widoczne i zawyża bezpieczeństwo (miesiąc bez danych liczony jako deficyt 0 w doborze zapasu paliwa; średnia ważona, w której składowa 0% — brak agregatu — daje nadal 85%; brak strat bufora i COP nocny = dzienny zawyżające oszczędność). Rozwiązania: liczba → pole użytkownika bez wartości domyślnej; brak danych → „brak wyniku” + 🟡, nigdy 0; agregat → najsłabsze ogniwo pokazane obok wyniku z tą samą wagą wizualną.
Dlaczego warto zgłosić do new-app-standards: to dwa proste pytania kontrolne, które można dopisać do checklisty audytu (GOD BOOK Część N / standard 03 — walidacja i ostrzeżenia), zanim założenia trafią do właściciela; oszczędza rundę pytań i łapie błędy zawyżające bezpieczeństwo — najgroźniejszy rodzaj błędu w aplikacji liczącej twarde fakty.
Status: 🔎 nowe


[05.10.2026] KATEGORIA: BŁĄD PROCESU + DOBRA PRAKTYKA — przekazanie sesji wskazujące zadania już zrobione; bilans łączny wpisany ręcznie rozjechał się z sumą wierszy
Szczegóły: (1) Właściciel wydał polecenie wg przekazania z 03.10 („1. migracja `*Key` ~74 plików, 3. rozszerzenie strażnika…”), a oba punkty zrobiono jeszcze 03.10 (commity `7dedac4f`, `e2af58bb`); zadania zamknięto innym wpisem listy, a wpisu przekazania nie domknięto. Do tego trzy inne pozycje z tego samego polecenia (kafle 08–14 z 20.09, etykiety stron EN/RU, Moduł 2) były zrobione od dawna. Wykryte tylko dlatego, że przed pracą sprawdziłem stan kodu (git log, skan AST, strażniki), a nie listę. (2) `mapa-wdrozenia.md` od 26.09 podawała bilans „x/314”, a mianowniki z wierszy tej samej tabeli sumują się do 286 (różnica = biblioteka widżetów M13 policzona i jako 1 ekran, i jako 28 pozycji). Liczbę łączną wpisano ręcznie i powielano przez 9 dni w kolejnych dopiskach.
Dlaczego warto zgłosić do new-app-standards: oba błędy kosztują sesję (praca od nowa albo planowanie na złych liczbach) i powtórzą się w każdym projekcie z listą zadań i mapą postępu. Propozycja do 14.x / GOD BOOK B.6 i T.1: (a) wpis przekazania zawiera tylko odsyłacze do wpisów listy, nie własną kopię zadań — zamknięcie zadania domyka wtedy jedno miejsce; (b) na starcie zadania z przekazania obowiązkowa krótka weryfikacja w kodzie/git (jedno polecenie), zanim zacznie się praca; (c) bilans łączny mapy postępu liczony skryptem z wierszy tabeli (suma liczników i mianowników), nigdy wpisywany ręcznie.
Status: 🔎 nowe

[05.10.2026] KATEGORIA: BŁĄD + DOBRA PRAKTYKA — sprawdzenie i18n silników w runtime; strażnik argumentów pozycyjnych `*Key`
Szczegóły: helpery ostrzeżeń zmieniły sygnaturę z `label` na `labelKey: string` (klucz słownika). Kompilator nie zgłosił nic, bo typ nadal `string`, a 6 modułów wciąż podawało polski tekst pozycyjnie — EN/RU pokazywały `⚠ [Kubatura]` przez 3 dni. Strażnik AST łapał tylko `labelKey: "…"` jako właściwość obiektu, a mój skan statyczny przed pracą dał fałszywe „0 pozostałych”. Wykryło to dopiero zebranie wszystkich `Warning`/`assumptions` zwracanych przez silniki w istniejących testach (setup Vitest owijający eksporty `lib/core/modules`) i rozwinięcie ich przez `t()` w każdym języku: brakujący klucz, znaki narodowe w nie-PL, tekst identyczny z PL. Naprawione + strażnik: mapa `funkcja → pozycje parametrów *Key` z deklaracji w `lib/core`, zgłoszenie literału nie-klucza na tej pozycji.
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny używa tego samego wzorca (17.2, klucze w params). Propozycja do 17.9: (a) strażnik i18n sprawdza także argumenty pozycyjne parametrów `*Key`, nie tylko właściwości; (b) przed uznaniem migracji i18n za domkniętą — jednorazowe sprawdzenie w runtime (wyniki silników z testów × wszystkie języki), bo skan statyczny nie widzi przepływu wartości; (c) przy zmianie sygnatury helpera na typ-klucz rozważyć typ markowany (`type I18nKey = string & {__brand}` albo unia kluczy słownika), żeby błąd dał kompilator.
Status: 🔎 nowe


[05.10.2026] KATEGORIA: LUKA STRAŻNIKA + POMYSŁ NA REGUŁĘ — strażnik i18n oparty na samym AST nie widzi argumentów pozycyjnych `*Key`; druga warstwa na kompilatorze TypeScript sprawdza, czy argument jest istniejącym kluczem słownika
Szczegóły: (uzupełnia wpis wyżej o argumentach pozycyjnych `*Key`). (1) Luka. `check:i18n-guard` rozpoznawał tylko zapis właściwości `xKey: "…"`. Wywołanie `wartoscUjemna("kubatura", "Kubatura", v)` przekazuje polski tekst pozycyjnie do parametru `labelKey`, a w drzewie składni nie ma tam żadnej nazwy `*Key`. Przez to przeszła regresja z 02.10: kompilator milczał, bo typem był `string`, strażnik był zielony, a EN/RU pokazywały `⚠ [Kubatura]`. (2) Pierwsza łata działa na samym AST, bez `typeChecker`. Buduje mapę `funkcja → pozycje parametrów *Key` z deklaracji w `lib/core` i sprawdza format argumentu (`/^[A-Z0-9][A-Z0-9-]*$/`). Ma trzy ograniczenia: dopasowuje funkcje po nazwie, więc myli je przy imporcie z aliasem, przy re-eksporcie i przy dwóch funkcjach o tej samej nazwie; nie rozwiązuje stałej, zmiennej, warunku `a ? "X" : "Y"` ani wywołania przez metodę; sprawdza tylko kształt klucza, a nie to, czy klucz istnieje (literówka `POLE-KUBATRA` przechodzi). (3) Druga warstwa, wdrożona 05.10 jako `scripts/check-i18n-keys.mjs` (część `pnpm check:i18n-guard`). Skrypt buduje program przez `ts.createProgram` z `tsconfig.json` i korzysta z `typeChecker`. Klucze słowników PL/EN/RU zbiera z typów obiektów słownikowych, także z części UI. Każde wywołanie rozwiązuje przez `getResolvedSignature`, więc aliasy, re-eksporty i metody nie mają znaczenia. Każdy wyliczony napis musi istnieć we wszystkich trzech słownikach. Różnice względem łaty z punktu (2): (3.1) Sprawdza więcej niż argumenty — także właściwości `xKey:` w literałach obiektów. (3.2) Wylicza więcej niż literały i unie (typ: literał, `const`, `as const`, unia z obu gałęzi warunku), a gdy typ nie wystarcza, śledzi źródła wartości: `let` ze wszystkimi przypisaniami, importowane stałe, `TABELA[x]`, `TABELA[x].pole`, `TABELA.find(…).pole`, `??`/`||`, pętle po krotkach `for (const [a, b] of TABELA)` i `Object.entries`, szablony z `.toUpperCase()`/`.toLowerCase()`, wywołania funkcji z wiązaniem parametrów z argumentami. (3.3) Klucz zbudowany z parametru (np. `${field.toUpperCase()}-NIEDODATNI`, `kody.lifepo4`) wylicza osobno w każdym miejscu wywołania, także przez funkcje pośredniczące, do 4 poziomów. (3.4) Wartość niewyliczalną przyjmuje tylko na podstawie trzech jawnych reguł, każda liczona w raporcie: (P) goły parametr — sprawdzane są argumenty we wszystkich miejscach wywołania, przechodnio; (D) odczyt `x.fooKey` — pod warunkiem, że każde miejsce zapisu `fooKey:` też jest sprawdzane; (W) wyjątek z powodem i ręcznie wypisanymi kluczami, które nadal są sprawdzane w słownikach, a wyjątek, który przestał być potrzebny, jest błędem. Wszystko inne jest zgłaszane. (3.5) Stan na 05.10: 1535 wartości, 3 wyjątki — wszystkie w `komunikacja-bms`: ID protokołu pochodzi z wejścia typu `string`, a nieznany ID jest celowo przekazywany bez zmian. Koszt: przy zmianie tabeli `PROTOKOLY` trzeba ręcznie zaktualizować listę kluczy `PROTOKOLY_BMS` w skrypcie (rozjazd wyjdzie dopiero wtedy, gdy klucz z listy zniknie ze słowników — nowy protokół bez wpisu na liście nie zostanie zgłoszony). (3.6) Granice: funkcja bez wywołań w zakresie skanu (`lib/`, `app/`, `components/`; testy pominięte) nie jest sprawdzana; nazwy `*Key`, które nie są kluczami i18n (`NIE_I18N`: `storageKey`, `cacheKey`, `apiKey`, `sortKey`, `queryKey`, `idempotencyKey`, `rowKey`, `supabaseKey`), są wyłączone; śledzenie ma ograniczoną głębokość. Test negatywny przeprowadzono na tymczasowej sondzie: literówka w stałej, alias importu, re-eksport, gałąź warunku i szablon z parametrem — wszystkie pięć zostało zgłoszonych. AST zostaje jako szybki pierwszy filtr, a kompilator jest źródłem prawdy o tym, który parametr dostaje wartość.
Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z konwencją „parametr `*Key` niesie klucz” (17.2) ma tę samą ślepą plamkę. Strażnik oparty na nazwie właściwości jest zielony przy każdym wywołaniu pozycyjnym, a format klucza nie gwarantuje jego istnienia. Propozycja do 17.9: (a) strażnik i18n ustala parametr docelowy przez kompilator (rozwiązana sygnatura), a nie przez nazwę właściwości ani dopasowanie nazwy funkcji; (b) sprawdza istnienie klucza w słowniku każdego języka, nie tylko jego format; (c) wartość niewyliczalna statycznie jest zgłoszeniem albo jawnym wyjątkiem, nigdy cichym „OK”. Docelowo (zob. wpis wyżej, pkt c) typ `I18nKey` jako unia kluczy słownika przenosi to sprawdzenie do samego `tsc` i czyni ten skrypt zbędnym.
Status: 🔎 nowe

[06.10.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — wspólny kontrakt danych pogodowych (pomiar ze stacji + prognoza) dla całej rodziny aplikacji
Szczegóły: telemetria Offgrid Pro (`lib/core/telemetria/probka.ts`, `docs/telemetria-kontrakt-esp32.md`) ma już wielkości pogodowe z jednostkami kanonicznymi: `naswietlenie` (W/m²), `temperatura` (°C), `predkoscWiatru` (m/s), `wilgotnosc` (%RH), `cisnienie` (hPa), `opad` (mm), `zachmurzenie` (okta) oraz import CSV z profilem kolumn (legenda osobno, znaczniki braku, stałe przesunięcie strefy). Podłączenie prawdziwej stacji stoi jednak w miejscu, bo **nikt nie zdefiniował, jakie metadane musi nieść plik albo strumień pogodowy**, żeby dało się go użyć bez zgadywania (`docs/memory.md`, 02.10: „legenda Pogodynki jeszcze niedostarczona”). Lista tego, czego brakuje do jednoznacznego importu, okazała się niezależna od domeny PV:
1. **Legenda pliku:** znaczenie i kolejność kolumn, nagłówek tak/nie, separator pól, separator dziesiętny, znaczniki braku (`-999`, puste pole, `---`) → stan „brak”, nigdy 0.
2. **Czas:** format; **strefa** (UTC / czas lokalny stały / z przestawianiem zegara); **krok zapisu**; **semantyka znacznika** (odczyt chwilowy, średnia z przedziału, koniec przedziału). Bez tego energia z mocy wychodzi zła o czynnik kroku (u nas: Prognozy M10, decyzja A z 29.09 — Δt = 3 h).
3. **Jednostka i wariant każdej wielkości:**
   - nasłonecznienie: W/m², płaszczyzna pozioma (GHI) czy płaszczyzna modułów (POA + kąt i azymut), typ czujnika (pyranometr / ogniwo referencyjne);
   - temperatura powietrza: °C, wysokość czujnika, osłona radiacyjna tak/nie (temperatura powietrza ≠ temperatura komponentu — dziś jedna wielkość `temperatura`);
   - wiatr: m/s / km/h / węzły, średnia czy poryw, okres uśredniania;
   - wilgotność: %RH;
   - ciśnienie: hPa, **na poziomie stacji czy zredukowane do poziomu morza**;
   - opad: mm na przedział czy suma narastająca (od północy / od resetu);
   - zachmurzenie: okty czy %.
4. **Metadane stacji:** szerokość/długość, wysokość n.p.m. (porównanie z bazami klimatycznymi, np. PVGIS TMY).
5. **Wielkości, których kontrakt dziś nie ma, a stacje zwykle dają:** kierunek wiatru (°), pokrywa śnieżna (cm), opcjonalnie temperatura punktu rosy.
6. **Prognoza ≠ pomiar.** Funkcje typu „alert burzowy”, „ryzyko zimowe”, „pre-heat przed mrozem” potrzebują prognozy (horyzont, krok, czas wydania prognozy, źródło), a nie tylko historii ze stacji. Kontrakt powinien rozróżniać `pomiar` i `prognoza` (+ czas wydania), żeby ekran nie pokazał prognozy jako pomiaru ani odwrotnie.
Priorytet wielkości (z praktyki tego projektu): nasłonecznienie + temperatura zewnętrzna (produkcja PV, ogrzewanie, defrost) > wilgotność + wiatr (oblodzenie, burze) > opad + ciśnienie > zachmurzenie (zbędne, gdy jest pomiar nasłonecznienia).
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny „Inżynier Pro”, która liczy coś zależnego od warunków zewnętrznych (energia, ogrzewanie, wentylacja, wilgoć, obciążenia wiatrem/śniegiem), będzie importować te same dane z tych samych stacji i serwisów. Bez wspólnej bazy każdy projekt osobno odkryje te same pułapki (strefa czasowa, semantyka znacznika, ciśnienie zredukowane vs stacyjne, opad narastający) i zbuduje niezgodne schematy. Propozycja: nowy podrozdział standardu (06 — dane zewnętrzne, albo osobny rozdział „Dane środowiskowe”) z (a) słownikiem wielkości pogodowych z jednostkami kanonicznymi i wariantami jak w pkt 3, (b) obowiązkowymi metadanymi źródła (pkt 1, 2, 4), (c) rozróżnieniem pomiar/prognoza (pkt 6), (d) zasadą „brak = stan jawny, nie 0” i „metadanej nie zgadujemy — import bez niej jest blokowany albo oznaczony 🟡”, (e) wspólnym szablonem „legendy źródła pogodowego” do wypełnienia przez użytkownika przy podpinaniu stacji. Punkt startowy do skopiowania: `WIELKOSCI` w `lib/core/telemetria/probka.ts` i `ProfilCsv` w `lib/core/telemetria/csv.ts` tego repo.
Status: 🔎 nowe

## [08.10.2026] Kryteria porównania jako pola z zaznaczeniem + reguła porównywalności
Przy porównywarkach (np. paneli PV) każde kryterium jest osobnym polem z checkboxem: zaznaczone = liczone, odznaczone = pomijane; wagi zawsze widoczne i automatycznie przeliczane do 100%. Dodatkowo reguła porównywalności: brak parametru w karcie katalogowej = `null` i kryterium oznaczone „nie do porównania” dla tego elementu (nigdy 0 ani wartość domyślna), a gwiazdki informują, że skala jest względna w obrębie zestawu. Dlaczego do standardu: każda aplikacja rodziny z „rankingiem opcji” trafi na tę samą pułapkę zgadywania brakujących danych i niewidocznych wag. Źródło wzorca: `docs/porownywarka-paneli-pv-specyfikacja.md`.
Status: 🔎 nowe

## [08.10.2026] Źródło danych katalogowych jako klikalny obraz w aplikacji
Dane z kart katalogowych (panele, falowniki, baterie) niech niosą w katalogu ścieżki obrazów karty serwowanych przez aplikację, a ekran pokazuje link „Zobacz kartę katalogową” przy każdym wpisie wstawionym z katalogu — użytkownik sam sprawdza, że liczba pochodzi z karty. Link znika, gdy użytkownik ręcznie zmieni liczbę z karty (dane przestają być potwierdzone). Test pilnuje, że pliki obrazów istnieją. Dlaczego do standardu: zasada „źródło każdej liczby” (brak danych = `null`, nie wartość typowa) jest weryfikowalna tylko wtedy, gdy użytkownik ma źródło pod ręką.
Status: 🔎 nowe


## [09.10.2026] Próg numeryczny zamiast „> 0” przy funkcjach trygonometrycznych w warunkach granicznych
Przy cieniu międzyrzędowym warunek „słońce przed panelami” `cos(Δ) > 0` przepuścił Δ = 90°, bo `cos(π/2)` w zmiennoprzecinkowym to ~6e-17, nie 0 — tangens profilowy wyszedł gigantyczny, a odstęp rzędów „nieskończony”. Reguła do rozważenia: w kalkulatorach geometrycznych warunki typu „kierunek w półprzestrzeni” zapisywać z jawnym progiem (np. `<= 1e-9`) i mieć test na kąt dokładnie 90°/270°.
Status: 🔎 nowe


## [09.10.2026] Test spójności fizycznej dla danych przepisywanych z kart katalogowych
Przy przepisywaniu około stu zestawów Voc/Vmp/Isc/Imp z kart paneli test sprawdzający relacje fizyczne (Vmp·Imp ≈ Pmax w ±2%, Voc > Vmp, Isc > Imp, współczynnik temperaturowy napięcia < 0) działa jak suma kontrolna: wyłapuje literówkę i zamianę wierszy bez drugiej osoby. Reguła do rozważenia: każdy katalog liczb z kart (panele, falowniki, baterie) niech ma taki test relacji fizycznych obok testu „pliki źródłowe istnieją”. Druga lekcja: gdy karta nazywa wiersz inaczej niż fizyka (JA Solar „maksymalne napięcie zasilania” = Vmp), to jawny opis w transkrypcji karty jest częścią danych, nie komentarzem.
Status: 🔎 nowe

## [09.10.2026] Ślad wersji programu, silnika i danych na każdym wydruku z obliczeniami
Wydruk lub PDF z wynikiem obliczeń niesie wersję programu (z hashem builda), wersję silnika danego kalkulatora i daty źródeł danych (pogoda, katalog, cennik). Powód: wynik zapisany miesiąc temu bywa liczony wg innych reguł i danych; bez śladu nie da się ustalić, czy różnica pochodzi z błędu użytkownika czy ze zmiany reguł. Warunek utrzymania: zmiana reguł obliczeń podnosi wersję silnika (test przypominający mile widziany). W tym projekcie: hash commita wstrzykiwany w `next.config` jako `NEXT_PUBLIC_BUILD_ID`. Mechanizm ten sam dla całej rodziny aplikacji (wspólny blok „Wersja obliczeń i danych”).
Status: 🔎 nowe

## [09.10.2026] Stopka powtarzana na każdej stronie wydruku: `<tfoot>`, nie `position: fixed`
Stopka w wydruku HTML, która ma być na każdej stronie i nie nachodzić na treść, najpewniej działa jako `<tfoot>` tabeli otaczającej dokument: przeglądarka powtarza ją i rezerwuje na nią miejsce. `position: fixed` powtarza element, ale zasłania treść dochodzącą do dołu strony. Sprawdzone w druku do PDF (Chromium, 3 strony A4). Dopisać do rozdziału o dokumentach i wydrukach, jeśli taki powstanie.
Status: 🔎 nowe

## [09.10.2026] Tryb prosty i pełny ekranu na jednym szkicu; tryb zapisywany, nie wyliczany na żywo
Ekran z wieloma polami warto dać w dwóch trybach (prosty: kilka pytań i jedna rekomendacja po ludzku; pełny: wszystkie ustawienia) na tym samym szkicu, żeby przełączanie niczego nie gubiło. Pułapka: domyślny tryb wyliczany z zawartości szkicu („puste = prosty, są dane = pełny”) przeskakuje w trakcie wpisywania pierwszej liczby; wyliczenie trzeba wykonać raz przy pierwszym renderze szkicu i zapisać w nim. Rekomendacja trybu prostego ma być tabelą decyzyjną na liczbach, które ekran pełny też pokazuje (bez nowych wag), a przy sprzeczności kryteriów pokazywać kompromis zamiast wskazywać zwycięzcę.
Status: 🔎 nowe

## [09.10.2026] Numer wersji programu z regułą podbijania opartą na wpływie na liczby, plus test spójności z historią
Dla aplikacji liczących twarde fakty numer wersji ma służyć do ustalenia, czy stary wynik jest jeszcze aktualny. Reguła: pierwsza cyfra = zmiana zasad liczenia albo formatu danych użytkownika; druga = nowa funkcja, nowe dane albo poprawka błędu zmieniającego wynik; trzecia = bez wpływu na liczby. Każdy wpis historii ma linię „Wpływ na liczby”, a test sprawdza, że `package.json` zgadza się z najnowszym wpisem (podbicie bez wpisu albo odwrotnie przestaje przechodzić). Sam skrót commita nie wystarcza: nie mówi, czy cokolwiek zmieniło się w liczbach.
Status: 🔎 nowe

## [09.10.2026] Dane z kart katalogowych: test „każda liczba występuje w transkrypcji karty” i jawne założenie przy porównaniu z normą
Gdy katalog danych jest przepisywany z kart, test może sprawdzać, że każda liczba wpisu występuje w tekście transkrypcji karty (wzorzec z granicami cyfr). W jednym przebiegu wychwycił on dwie karty, których transkrypcja nie zawierała wiersza z obciążeniem mechanicznym, choć obraz karty go miał — a tym samym uniemożliwił zaufanie liczbie „z serii”. Druga rzecz: porównując wartość z karty z wartością z normy (obciążenie testowe a obliczeniowe), trzeba przy wyniku pokazać, co jest czyje i skąd współczynnik przeliczenia; gdy współczynnik wynika tylko z jednej karty, a dla reszty jest założeniem, ostrzeżenie o przekroczeniu zostaje poziomem niższym niż twardy stop do decyzji właściciela.
Status: 🔎 nowe

## [09.10.2026] Odczyt zdjęcia/PDF przez model: wymuszone jedyne narzędzie, trasa zamiast akcji serwerowej, zatwierdzanie pole po polu i kalibracja kontroli na danych z kart
Wzorzec odczytu dokumentu przez AI, który zadziałał bez obaw o wstrzyknięcie poleceń: model dostaje plik i jedno narzędzie z wymuszonym wyborem narzędzia (nie ma jak zrobić nic poza zwróceniem pól), każde pole ma wartość, flagę „widoczne” i pewność, odpowiedź walidowana schematem, a do formularza trafia tylko to, co użytkownik zatwierdził pole po polu (z podglądem pliku obok). Kontrole spójności odczytu (iloczyn napięcia i prądu a moc, kolejność wielkości, znak współczynników) warto skalibrować testem na całym katalogu danych z kart: ten sam test dowodzi, że kontrole nie dają fałszywych alarmów na poprawnych danych. Upload większy niż 1 MB: trasa POST z multipart zamiast akcji serwerowej Next (domyślny limit ciała akcji to 1 MB, a jego podniesienie dotyczyłoby wszystkich akcji). Zgodę na wysłanie pliku do chmury egzekwuj także po stronie serwera, nie tylko wyszarzonym przyciskiem. Pułapka testowa: atrapa API szukająca sygnału w całym ciele żądania (podciąg) trafia w treść promptu; szukaj w polu, które test kontroluje.
Status: 🔎 nowe


## [10.10.2026] Transfer budynku między aplikacjami rodziny: czy migawka wyników jest dopuszczalnym wyjątkiem od „tylko Seed, nigdy Wynik” (18.15)?
Sytuacja z inzynier-offgrid-pro i inzynier-szkieletowy-pro: Szkieletowy ma gotowy, trudny silnik mostków cieplnych (ISO 6946 §6.7.2 + Zał. F, część wzorów niezweryfikowana wizualnie), a Offgrid potrzebuje od budynku tylko sum strat (przenikanie z mostkami i wentylacja w W/K, powierzchnia, kubatura), żeby policzyć zapotrzebowanie zimą z własnym klimatem. Pełny transfer danych wejściowych wymagałby skopiowania całego silnika mostków do drugiej aplikacji. Właściciel wybrał etap pośredni: najpierw migawka sum (z datą eksportu i wersją aplikacji źródłowej, UI w aplikacji docelowej pokazuje „stan na <data>” i prosi o ponowny import po zmianie projektu), dane wejściowe dopiero gdy silnik zostanie zweryfikowany. Do rozstrzygnięcia w standardzie: czy 18.15 dopuszcza takie migawki jako jawny, opisany wyjątek (warunki: data i wersja w pliku, widoczne ostrzeżenie o starzeniu, brak synchronizacji zwrotnej), czy zawsze wymagać danych wejściowych i wspólnego silnika (paczka współdzielona między aplikacjami).
Status: 🔎 nowe

## [10.10.2026] PROPOZYCJA: jednolita koperta pliku do importu i eksportu między aplikacjami rodziny
Cel: 18.15 mówi, że transfer idzie plikiem z wersjonowanym schematem, ale nie mówi, jak plik wygląda. Dwie aplikacje (inzynier-szkieletowy-pro → inzynier-offgrid-pro) mają dziś ustalać format od zera. Propozycja jednej koperty dla wszystkich plików transferu:
1. **Nagłówek:** `schemat` (stały identyfikator, np. `budynek-sumy-strat`), `wersjaSchematu` (liczba całkowita), `rodzajDanych` (`dane-wejsciowe` albo `migawka-wynikow`), `zrodlo` (`aplikacja`, `wersjaAplikacji`), `wyeksportowano` (ISO 8601 z strefą), `projekt` (`id`, `nazwa`), `wersjaPaczkiSrodowiskowej` (wersja `dane-srodowiskowe`, z której liczono; pozwala ostrzec o różnicy), `sumaKontrolna` (SHA-256 z kanonicznego JSON pola `dane`).
2. **Ładunek:** pole `dane`. Bez tekstów dla człowieka (tylko liczby, identyfikatory, kody; teksty tłumaczy aplikacja docelowa). Jednostka w nazwie klucza (`htrWK`, `afM2`, `grubosc_mm`). `null` = nie wpisano, `0` = zero. Liczby jako liczby, nie napisy.
3. **Domyślnie tylko dane wejściowe** (zgodnie z 18.15). **Migawka wyników jest świadomym wyjątkiem** i wymaga: `rodzajDanych: "migawka-wynikow"`, daty i wersji aplikacji w nagłówku, widocznego w aplikacji docelowej napisu „stan na <data>” i prośby o ponowny import po zmianie projektu, braku synchronizacji zwrotnej. Do rozstrzygnięcia w standardzie: czy takie wyjątki w ogóle dopuszczać, czy wymagać wspólnego silnika (paczki współdzielonej).
4. **Wersjonowanie:** aplikacja docelowa odmawia importu przy `wersjaSchematu` wyższej niż zna, z czytelnym komunikatem; starsze wersje migruje w przód; nieznane pola ignoruje, brakujące wymagane odrzuca (walidacja schematem, np. Zod / JSON Schema).
5. **Rejestr schematów:** jeden plik JSON Schema na `schemat` w `new-app-standards` (`docs/schematy-transferu/`), własność aplikacji eksportującej; test kontraktowy w obu repo na wspólnych przykładach (ten sam plik przykładowy eksportuje jedna aplikacja i importuje druga).
6. **Bezpieczeństwo i prywatność:** limit rozmiaru, brak danych osobowych i sekretów poza tym, co użytkownik sam wpisał w projekcie, jawny dialog zgody przy imporcie z podglądem, rozszerzenie pliku wspólne (np. `.inzpro.json`).
7. **Dane środowiskowe:** pliki transferu nie niosą danych pogodowych ani stref, tylko współrzędne i wersję paczki środowiskowej; dane pogodowe zawsze z paczki `dane-srodowiskowe` (19.13).
Status: 🔎 nowe

## [11.10.2026] Lista zadań: jeden wpis „STAN BIEŻĄCY” na moduł z długim dziennikiem, żeby sesja nie raportowała jako braków rzeczy już zrobionych
W inzynier-offgrid-pro wpis listy zadań o module (Porównywarka paneli) rósł jako chronologiczny dziennik z dopiskami „✅ zrobione” w środku, a jego nagłówek zostawał 🔲. Sesja, która czytała tylko nagłówki, przedstawiła właścicielowi jako braki: ręczny panel, dobór falownika, wydruk, tryb prosty, Eurokod, OCR i ocenę producentów, choć wszystkie były zrobione i opisane w historii wersji. Proponowana reguła: gdy wpis listy zbiera więcej niż kilka pozycji, na samej górze listy stoi jeden wpis „STAN BIEŻĄCY” z podziałem zrobione/zostaje, a zamknięcie pozycji ze środka długiego wpisu wymaga zmiany tego wpisu i nagłówka długiego. Do tego reguła dla raportów: odpowiedź „co zostało” opiera się na rejestrze pokrycia i historii wersji, nie tylko na liście zadań, i podaje, z czego wynika. Koszt błędu: właściciel dostał nieprawdziwą listę braków i musiał to wyłapać.
Status: 🔎 nowe

## [16.10.2026] Skala rozmiarów ikon jako tokeny CSS zamiast liczb w komponentach
W inzynier-offgrid-pro ilustracje 256×256 z cienką kreską pokazywano w 44 px i wyglądały na rozjechane, a każda próba „zmniejszenia” pogarszała efekt. Naprawa: jedna skala w wielokrotnościach 4 px, tokeny `--ikona-*` zależne od szerokości ekranu, komponent bez propsa `size`, test pilnujący skali. SVG skaluje się z gęstością pikseli sam, więc osobne pakiety rozdzielczości są zbędne (raster tylko dla PWA i favicon).
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny z ilustrowanymi lub animowanymi ikonami trafi na ten sam problem; reguła „rozmiar ikony z tokenu, minimum czytelności ilustracji ustalone wprost” oszczędza iteracji po obrazkach.
Status: 🔎 nowe
