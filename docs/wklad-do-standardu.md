# docs/wklad-do-standardu.md — Inżynier Offgrid Pro

Rosnący log nietrywialnych spostrzeżeń z pracy nad **tym** projektem, wartych rozważenia dla całego pakietu `new-app-standards`/GOD BOOK — nie tylko tego repo. To **nie jest** źródło prawdy o standardzie — to surowy materiał zgłoszeniowy. AI dopisuje tu z własnej inicjatywy (analogicznie do Części U.2 GOD BOOK), gdy natrafi na coś nietrywialnego. **Nigdy nie edytuj stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards` (Część Y.8 GOD BOOK).

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

[24.09.2026] KATEGORIA: DOBRA PRAKTYKA — biblioteki z własnym Web Workerem (MapLibre GL 6 i podobne)
po zbundlowaniu przez Next.js: kopia workera w `public/` robiona w `predev`/`prebuild`, nie w repo

Szczegóły: MapLibre GL 6 tworzy worker z pliku leżącego obok własnego modułu (`new URL("./maplibre-gl-worker.mjs",
import.meta.url)`). Po zbundlowaniu (Turbopack) ten plik nie istnieje pod wyliczoną ścieżką — mapa
rysowała tło, ale nic więcej, a w konsoli było tylko "Worker failed to load". Rozwiązanie, które
zadziałało: skrypt `scripts/kopiuj-maplibre-worker.mjs` uruchamiany jako `predev` i `prebuild` kopiuje
worker (i moduł, który worker importuje względnie) z `node_modules` do `public/maplibre/`, katalog jest
w `.gitignore`, a kod wskazuje kopię przez `setWorkerUrl`. Kopia zawsze pasuje do wersji z lockfile'a,
w repo nie ma skopiowanego kodu biblioteki. Do tego CSP potrzebuje `worker-src 'self' blob:`. Przy tej
samej pracy: szablonowy nagłówek `Permissions-Policy: geolocation=()` po cichu wyłączał GPS w całej
aplikacji — nowa funkcja korzystająca z API przeglądarki (GPS, kamera, mikrofon) musi zacząć od
sprawdzenia nagłówków bezpieczeństwa, bo przeglądarka odmawia bez czytelnego błędu w UI.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny z mapą, PDF.js, edytorem kodu albo
inną biblioteką z workerem trafi na ten sam problem, a "Worker failed to load" nie wskazuje przyczyny.
Rozdział 11 (CI/deployment) albo 07 (bezpieczeństwo — CSP `worker-src`, Permissions-Policy) mógłby mieć
krótką notę: "biblioteka z workerem → kopia w prebuild do public/ + `worker-src`; nowe API przeglądarki →
najpierw Permissions-Policy".

Status: ✅ skonsolidowane w standardzie (24.09.2026) — `docs/standards/11-ci-deployment.md` nowa
**11.7** (kopiowanie pliku zależnego od `node_modules` do `public/` skryptem `predev`/`prebuild`,
nigdy commitowane) + `docs/standards/07-bezpieczenstwo.md` dopisek do **7.3** (`worker-src 'self'
blob:`) i nowy punkt checklisty **7.4** (nowa funkcja API przeglądarki zaczyna od sprawdzenia
`Permissions-Policy`). Źródło potwierdzenia: `AKTUALIZACJE.md` w `new-app-standards`, wiersz
2026-09-24, GOD BOOK bez zmiany numeru wersji dla tego wiersza. Sprawdzone przy Y.6 24.09.2026
(sesja `claude/y6-adaptive-20260924`) — do zastosowania w tym projekcie przy pełnej synchronizacji
NIETYKALNE (`docs/standards/11`, `07`), jeszcze nie zaaplikowane lokalnie, patrz `docs/memory.md`.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — zapowiedź "pełne wyliczenie później" w rejestrze pokrycia jako sposób, w jaki Dyrektywa #14 (rejestruj natychmiast) jest omijana po cichu

Szczegóły: sekcja rejestru pokrycia Modułu 3 (04.09.2026) zawierała zdanie "pełne wyliczenie
per-funkcja całego modułu — nadal osobny, nie rozpoczęty krok". Zdanie było uczciwe, ale przez 3
tygodnie nikt go nie wykonał, a audyt kompletności (GOD BOOK Część N, 05.09.2026) je przepuścił —
sprawdzał, czy istniejące wiersze zgadzają się ze źródłem, a nie czy KAŻDA pozycja źródła ma wiersz.
Skutek: 17 z 30 pozycji źródła bez wiersza (niewidoczne, niepoliczalne), odkryte dopiero na starcie
sesji budowy tego modułu, prostym grepem nazw ekranów źródła w rejestrze.

Dlaczego warto zgłosić do new-app-standards: każdy projekt z rejestrem pokrycia (14.1) i dużą
specyfikacją źródłową może mieć tę samą lukę — zapowiedź odroczonego wyliczenia wygląda jak
świadome, udokumentowane "todo", a działa jak brak wiersza. Propozycja: (a) w GOD BOOK N.1 dodać
krok "dla każdego modułu: liczba pozycji źródła = liczba wierszy rejestru (grep nazw/ID), a nie
tylko zgodność istniejących wierszy"; (b) zdanie typu "pełne wyliczenie później" w rejestrze
traktować jako otwartą pozycję listy zadań z terminem (B.6/15.22), nie jako stan akceptowalny.

Status: ✅ skonsolidowane w standardzie (25.09.2026) — GOD BOOK v2.39 **N.1** (kompletność źródło → rejestr, liczbowo; placeholder "wyliczenie później" = brak wiersza) + dopisek w standardzie **14.1**. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersz 2026-09-25.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — materiały źródłowe chronione prawem autorskim (normy PKN/IEC) a publiczne repozytorium

Szczegóły: GOD BOOK B.5 każe trzymać każdy oryginalny materiał źródłowy w `docs/zrodla/` w
niezmienionej formie. W tym projekcie repozytorium jest publiczne, a `docs/zrodla/` zawiera PDF-y norm
PKN/IEC oraz `.md` z przepisaną treścią rozdziałów — dosłowne wykonanie B.5 publikuje materiały
licencjonowane. Nowa norma (25.09.2026) miała dodatkowo nadruk licencji jednostanowiskowej z zakazem
umieszczania w sieci i znak wodny z danymi osobowymi pobierającego. AI zatrzymało zapis i zapytało
właściciela; oryginał został poza repo, w repo tylko notatka robocza z liczbami używanymi w kodzie.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny liczący wg norm trafi na to samo.
Propozycja do B.5: przed zapisem materiału do `docs/zrodla/` sprawdzić (1) widoczność repozytorium,
(2) nadruki licencji/praw autorskich, (3) dane osobowe w znakach wodnych; dla materiału chronionego w
repo publicznym — oryginał poza repo, w repo notatka robocza (numer punktu/tablicy + liczby używane w
kodzie), z odnotowaniem, gdzie przechowywany jest oryginał. Przepisanie całości do `.md` nie jest
obejściem — chroniona jest treść, nie format.

Status: ✅ skonsolidowane w standardzie (25.09.2026) — GOD BOOK v2.39 **B.5**, rozstrzygnięte inaczej niż propozycja: do startu aplikacji wszystkie oryginały w `docs/zrodla/` repo projektu (bez wyjątków ze względu na rodzaj materiału), po starcie przeniesione do `new-app-standards` (`docs/biblioteka-norm/` dla norm). Źródło: `AKTUALIZACJE.md`, wiersz 2026-09-25.

[25.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — komponent pola formularza nie może budować `id` wyłącznie z etykiety

Szczegóły: wspólny komponent `Pole`/`PoleSelect` generuje `id` z tekstu etykiety. Gdy ten sam formularz
powtarza się w liście (karty źródeł ciepła, powierzchnie, pozycje), N pól dostaje to samo `id` — `<label
for>` wiąże się tylko z pierwszym, czytnik ekranu i kliknięcie w etykietę trafiają w złe pole, a testy
Playwright `getByLabel` znajdują jeden element. Błąd niewidoczny w typecheck, lint i testach jednostkowych;
wyszedł dopiero w teście przeglądarkowym nowego ekranu. Wstępny skan statyczny wskazał kilkadziesiąt
ekranów z polami w `.map()` bez jawnego `id` (do weryfikacji w przeglądarce).

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny ma ten sam wzorzec komponentu pola
(standard, rozdział UI). Propozycja: (a) komponent pola generuje `id` przez `useId()` (React 18+),
etykieta tylko jako czytelny prefiks; (b) albo reguła: pole w liście zawsze z jawnym `id`; (c) w
checkliście testów przeglądarkowych — sprawdzenie zduplikowanych `id` na stronie
(`document.querySelectorAll('[id]')` → duplikaty = błąd).

Status: ✅ skonsolidowane w standardzie (25.09.2026) — `docs/standards/08-ui-ux.md` dopisek do **8.10** (`id` pola z `useId()`, nigdy z etykiety). Źródło: `AKTUALIZACJE.md`, wiersz 2026-09-25.

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

[26.09.2026] KATEGORIA: DOBRA PRAKTYKA — strażnik i18n sprawdza też kompletność własnej listy modułów

Szczegóły: 17.9 opisuje strażnika z listą zmigrowanych modułów, a zasada „dopisz moduł w tej samej sesji” była w tym projekcie
dwukrotnie pomijana (M6/E1 i 19 modułów w pełni zmigrowanych, ale bez ochrony). Teraz skrypt przechodzi po katalogach modułów
i kończy się błędem, gdy katalog z plikiem silnika nie jest na liście. Przy okazji: reguła AST łapała tylko
`assumptions: [...]` / `const assumptions = [...]`, a nie `assumptions.push("tekst")` — jeden moduł przemycał tak gotowy tekst.

Dlaczego warto zgłosić do new-app-standards: lista „ręcznie dopisywana” rozjeżdża się w każdym projekcie; 17.9 mogłoby
zalecać odwrócenie domyślności (po zakończeniu migracji: wszystkie moduły objęte, wyjątki jawne) oraz wymienić wzorzec
`push` wśród konstrukcji, które strażnik musi rozpoznawać.

Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/17-i18n.md` dopisek do **17.9** (strażnik sprawdza kompletność własnego zakresu) + **11.9** pkt 3. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[27.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak wprost sformułowanego obowiązku commit→push→PR→merge po każdym zamkniętym module/zadaniu (tylko obowiązek zadeklarowania stanu)

Szczegóły: sprawdzone wprost na żądanie właściciela repo, czy standard/GOD BOOK nakazuje commit+push+PR+merge po każdej
większej pracy/module. Wynik: **nie ma takiej reguły** — jest tylko 15.21 (deklaracja stanu commit/push/PR/merge zawsze
jako ostatnie zdanie odpowiedzi) i osobno GOD BOOK v2.39 dopisek "od wersji 2.19" (U.4), który mówi wyłącznie, że w
środowisku z wyznaczonym branchem (Claude Code Remote) intencja self-bind Routine "commit+push na main" realizuje się
jako PR+merge tej samej sesji — to opisuje jeden konkretny mechanizm (Routine Y.6), nie ogólną zasadę dla zwykłej pracy
nad modułami. W praktyce zaobserwowanej w tym repo: gałęzie robocze potrafią rosnąć przez wiele sesji/dni bez PR-a i
mergea do `main` (np. `claude/prep-work-kppxeb` przed tym wpisem: 12 commitów, kilka dni pracy, PR dopiero na wyraźne
polecenie właściciela), podczas gdy równolegle powstawały osobne krótkotrwałe gałęzie (`claude/y6-check-*`,
`claude/sync-*`) merge'owane szybciej. Efekt uboczny braku jawnej reguły: w repo narosło ~15 nigdy niescalonych gałęzi,
z których część (5 gałęzi `y6-check`/`sync-*`/`app-rules-*`) okazała się już martwa — ich jedyna unikalna treść była
później i tak zapisana inną drogą do `main`, więc same gałęzie stały się śmieciem wymagającym ręcznego audytu
(`git branch -r --no-merged`, sprawdzenie każdej pod kątem czy to nie regres).

Dlaczego warto zgłosić do new-app-standards: 15.21 zakłada, że *ktoś* (właściciel albo AI z własnej inicjatywy) i tak
zdecyduje o momencie push/PR/merge — ale bez jawnego progu ("po zamknięciu każdego zadania z listy `docs/lista-do-
zrobienia.md`", "po każdym module", albo "na koniec sesji") decyzja o kiedy scalić zostaje całkowicie do uznania,
co w projektach wielosesyjnych/wielogałęziowych (ta sama rodzina co self-bind Routine) prowadzi do narastania martwych
gałęzi i utrudnia orientację "co jest już w `main`, a co nie". Propozycja: 15.21 albo nowa podsekcja mogłaby dodać
zalecenie domyślnego progu (np. "po zamknięciu pozycji `docs/lista-do-zrobienia.md`, chyba że właściciel prosi o
wsadowanie kilku naraz") oraz rutynowe czyszczenie gałęzi już w pełni pokrytych przez `main` (`git branch -r
--merged`) jako część higieny repo (14.x?), nie tylko ad-hoc audyt na żądanie.

Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` nowa **15.23** + dopisek do 15.21 (commit→push→PR→merge obowiązkowy po większej pracy). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

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

[28.09.2026] KATEGORIA: BŁĄD — chmurka pomocy „?” (8.4) zbudowana na komponencie Tooltip nie otwiera się na ekranie dotykowym

Szczegóły: `components/ui/chmurka.tsx` (`Chmurka`/`PomocPole`, realizacja 8.4 — „?” obok etykiety pola z nazwą,
zastosowaniem i zakresem) był zbudowany na `Tooltip` z Base UI. Na desktopie działał (hover/focus), więc przeszedł
przez wzornik i pierwszy ekran bez uwag. Test Playwright z emulacją telefonu (`devices["Pixel 5"]`, `tap`) pokazał,
że na dotyk chmurka **w ogóle się nie otwiera** — Tooltip z założenia nie reaguje na tap (tak działa większość
bibliotek: tooltip = hover-only). W aplikacji mobile-first to oznacza, że cała warstwa wyjaśnień 8.4 była
niewidoczna dla głównej grupy użytkowników. Naprawa: `Popover` z `openOnHover` (hover zostaje na desktopie,
tap/klik/Enter działają wszędzie), API komponentu bez zmian. Wykryte przypadkiem, przy dodawaniu nowego `pomoc`.
Dlaczego warto zgłosić do new-app-standards: 8.4 każe dać „?” przy każdym polu liczbowym, ale nie mówi, jakim
prymitywem — naturalny wybór („to przecież tooltip”) jest błędny dla każdej aplikacji rodziny działającej na
telefonie (wszystkie, rozdz. 13). Propozycja: 8.4 dopowiada „popover otwierany dotknięciem, nie tooltip hover-only”
+ 10.x: weryfikacja chmurek e2e także z emulacją dotyku, nie tylko myszy.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/08-ui-ux.md` dopisek do **8.4** (`?` otwierany kliknięciem/dotknięciem, nigdy tooltip hover-only). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

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

[28.09.2026] KATEGORIA: BŁĄD / PUŁAPKA — notatka przekazania na niescalonej gałęzi: kolejna sesja powtarza zrobioną pracę

Szczegóły: sesja A zakończyła pracę na własnej gałęzi (bez PR, bez merge), zostawiając w `docs/lista-do-zrobienia.md`
wpis ✅ i notatkę „PRZEKAZANIE DLA KOLEJNEJ SESJI”. Sesja B (nowa gałąź z `main`) przeczytała listę z `main`, gdzie ten
sam wpis był nadal 🔲, i zrobiła identyczną zmianę (D29 — trzy kalkulatory, testy, UI, dokumentacja) drugi raz.
Standard (14.x, GOD BOOK P.2/Y.4) każe czytać listę zadań na starcie, ale zakłada, że lista na `main` jest aktualna —
przy pracy wielu równoległych sesji w chmurze, każda na własnej gałęzi, tak nie jest. Propozycja: (1) krok startu
sesji „`git fetch` + gałęzie `claude/*` zmienione w ostatniej dobie + `git log origin/main..origin/<gałąź>`, a notatkę
przekazania czytać z najnowszej gałęzi, nie z `main`”; (2) sesja kończąca bez merge zapisuje notatkę przekazania także
w miejscu widocznym z `main` (np. PR w stanie draft), albo wprost w prompcie dla kolejnej sesji podaje nazwę gałęzi.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` **15.23** pkt 3–4 (lista zadań i ślad gałęzi na gałęzi domyślnej, start z przeglądem niescalonych gałęzi). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ (zgłoszenie właściciela repo) — lista zadań zawsze aktualna na `main` + ślad ostatniej gałęzi + obowiązkowy commit→push→PR→merge po skończonej pracy

Szczegóły: bezpośrednia reakcja właściciela repo na wpis wyżej (28.09.2026, duplikat D29) i rozwinięcie wpisu z
27.09.2026 (brak obowiązku commit→push→PR→merge). Właściciel prosi o trzy reguły, które razem zamykają tę klasę błędów:
(1) **`docs/lista-do-zrobienia.md` aktualizowana zawsze na `main`**, niezależnie od gałęzi, na której toczy się praca —
zmiana statusu zadania (🔲→🔄→✅) i notatka „PRZEKAZANIE DLA KOLEJNEJ SESJI” trafiają na `main` od razu, a nie dopiero
razem z kodem przy (ewentualnym) merge'u; (2) **ślad ostatniej gałęzi** — lista na `main` zawsze podaje, na jakiej gałęzi
pracowała ostatnia sesja i co tam leży niescalone (nazwa gałęzi, ostatni commit, co zrobione, co jest następnym
krokiem), także gdy gałąź nie została scalona, żeby kolejna sesja startująca z `main` wiedziała, skąd przejąć pracę,
zamiast ją powtarzać; (3) **commit → push → PR → merge po skończonej pracy jest obowiązkowy**, nie „do uznania” — po
zamknięciu zadania z listy sesja scala swoją gałąź do `main` (z pełnym lokalnym pakietem kontroli przed merge'em, gdy CI
jest niedostępne), więc niescalona gałąź staje się wyjątkiem (praca realnie przerwana w połowie), a nie stanem domyślnym.
Reguła (3) sama w dużej mierze usuwa potrzebę (2); (2) zostaje jako zabezpieczenie na przypadek przerwanej sesji.
Dlaczego warto zgłosić do new-app-standards: problem nie jest specyficzny dla tego repo — dotyczy każdego projektu
rodziny prowadzonego równoległymi sesjami w chmurze, z których każda dostaje własną gałąź. Obecnie 15.21 wymaga tylko
*zadeklarowania* stanu commit/push/PR/merge, a GOD BOOK P.2/Y.4 każe czytać listę zadań na starcie, zakładając milcząco,
że `main` jest aktualny — obie reguły razem dopuszczają dokładnie scenariusz z wpisu wyżej. Propozycja brzmienia do
rozważenia w sesji nad `new-app-standards`: 14.x — „lista zadań i notatka przekazania żyją na gałęzi domyślnej; każda
zmiana statusu zadania trafia tam od razu, razem z nazwą gałęzi roboczej”; 15.21 — z „zadeklaruj stan” na „po zamknięciu
zadania wykonaj commit→push→PR→merge, chyba że właściciel wprost każe wstrzymać; wtedy zapisz na gałęzi domyślnej, gdzie
leży niescalona praca”. Uwaga praktyczna: w środowisku, w którym sesja ma prawo pushu tylko na wyznaczoną gałąź,
reguła (1) realizuje się przez mały PR+merge samej listy zadań (albo razem z kodem przez regułę (3)).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/15-wspolpraca-z-ai.md` nowa **15.23** + dopisek do 15.21 (wpis wcześniej bez linii `Status:`). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: BŁĄD — autozapis szkicu formularza nadpisuje cały stan, więc nowe pole po aktualizacji ma `undefined`

Szczegóły: `lib/adapters/use-persisted-draft.ts` (realizacja 5.1 — zapis Seed formularza do IndexedDB) po odczycie
robi `setStan(zapisany)`, bez scalania z `poczatkowy`. Gdy ekran dostaje nowe pole (tu: pytania o bezpieczeństwo
agregatu, D48), użytkownik ze starym szkicem dostaje `undefined` zamiast `""`. Porównanie `=== ""` przepuszcza wtedy
`undefined` do jądra, a lookup `MAPA[undefined]()` wywala ekran. Testy jednostkowe tego nie łapią (zaczynają od
`STAN_POCZATKOWY`). Wyłapane przy przeglądzie własnego diffu; zabezpieczone lokalnie (`|| null`, `!= null`).
Dlaczego warto zgłosić do new-app-standards: każda aplikacja rodziny z autozapisem 5.1 trafi na to przy pierwszym
nowym polu formularza. Propozycja do 5.1: odczyt szkicu scala `{ ...poczatkowy, ...zapisany }` (albo wersjonuje
kształt Seed), plus 10.x: test „stary szkic bez nowego pola” przy każdej zmianie kształtu formularza.
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/05-baza-danych-offline.md` dopisek do **5.5** (odczyt starego szkicu scala stan początkowy) + 8.12. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[28.09.2026] KATEGORIA: DOBRA PRAKTYKA — mechaniczne sprawdzanie kompletności rejestru twardych stopów (4.3) zamiast polegania na dyscyplinie „dopisz przy każdym module”

Szczegóły: przy budowie M12/E38 okazało się, że żaden stop `critical` całego Modułu 5 (ok. 20 realnych warunków, budowane
13–20.09.2026) nie trafił do `docs/rejestr-twardych-stopow.md`, mimo że reguła 4.3 i nagłówek rejestru każą dopisywać
stop przy każdym nowym module. Nikt tego nie zauważył przez 2 tygodnie — audyt N.1 sprawdzał rejestr pokrycia, nie
rejestr stopów. Wykrycie zajęło minutę: pętla po `lib/core/modules/<moduł>/*/warnings.ts`, wyciągnięcie kodów z
`level: "critical"` i `grep` każdego kodu w rejestrze (generyczne kody walidacji formularza odfiltrować ręcznie).
Dlaczego warto zgłosić do new-app-standards: 4.3 opisuje rejestr jako indeks, ale nie daje mechanizmu kontroli jego
kompletności — w każdym projekcie rodziny z wieloma modułami ten dryf powstaje tak samo (moduł budowany seriami, rejestr
zapominany). Propozycja do rozważenia: w 4.3 lub 10.x — „kompletność rejestru twardych stopów sprawdzana mechanicznie
(skrypt kod `critical` ↔ wpis w rejestrze, z listą świadomych wyjątków), najlepiej jako krok `audit:*` w pakiecie przed
merge'em”, analogicznie do dwukierunkowego `grep` markerów TD# (GOD BOOK X.4).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/04-walidacja-i-twarde-stopy.md` dopisek do **4.3** + `11-ci-deployment.md` nowa **11.9** (strażnik „każdy X ma Y”, lista zapadkowa tylko dla starego kodu). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

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

[29.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ (zgłoszenie właściciela repo) + BŁĄD — „Definicja ukończenia ekranu” musi obejmować komplet warstw użytkowych (autosave, tłumaczenia, „?” przy polach, „i” przy tytule) i mieć strażnika w CI, inaczej reguła nie działa

Szczegóły: standard 8.4 od dawna wymaga „?” przy każdym parametrze liczbowym, a decyzja projektu D34 (28.09.2026)
dodała „nowe ekrany od teraz od razu z chmurkami”. Nikt tego nie sprawdzał mechanicznie. Wynik po jednym dniu: z 220
ekranów tylko 7 miało „?”, a 30 z 36 ekranów zbudowanych **po** D34 (cały nowy moduł M14) znowu bez chmurek — każda
sesja kopiowała sąsiedni ekran, który ich nie miał. Teraz ta sama praca jest robiona drugi raz na ~640 polach, w trzech
językach. Właściciel repo: „wraz z autosave, tłumaczeniem na inne języki musi od razu być dodawana migawka ? i »i«, bo
teraz robimy robotę drugi raz, a to już było mówione, ale nikt tego nie pilnuje”. Rozwiązanie w tym repo (D51):
(1) treść pomocy jako typowany obiekt per ekran w `lib/i18n/pomoc/<moduł>.ts`, EN/RU typowane z kształtu PL — brak
tłumaczenia = błąd kompilacji; liczby ze stałych silnika wchodzą przez parametry `{nazwa}`, nie przepisane;
(2) `scripts/check-pomoc-guard.mjs` (AST TypeScript): każde `<Pole>` ma `pomoc={<PomocPola …/>}` i nie ma `hint=`, każde
surowe `<input>`/`<select>` ma `<PomocPola>` obok, każdy `<NaglowekEkranu>` ma `ekran=` („i”), każda strona z polami ma
`usePersistedDraft` albo komentarz z powodem; (3) **lista zapadkowa** (`pomoc-guard-baseline.json`): stare niezgodne pliki
są na liście, która może tylko maleć (strażnik odrzuca także plik, który już spełnia regułę, a wciąż jest na liście), nowy
plik musi przejść od razu — reguła działa od pierwszego dnia bez „big bang” na 220 ekranach.
Dlaczego warto zgłosić do new-app-standards: to ogólny wzorzec, nie domena off-grid. (a) Każda reguła UI typu „każdy X
ma Y” bez mechanicznego strażnika dryfuje w ciągu dni, bo nowy kod powstaje przez kopiowanie sąsiedniego — ten sam
mechanizm co 17.9 (strażnik i18n), tylko dla pomocy i autosave. (b) 10.4 „Definicja ukończenia” powinna wprost wymieniać
warstwy użytkowe ekranu (autozapis, i18n, pomoc per pole, migawka ekranu), nie tylko „testy przechodzą”. (c) Lista
zapadkowa to sposób na wprowadzenie nowej reguły do istniejącego projektu bez blokowania pracy — warto opisać ją raz
w rozdziale 11 (CI) jako wzorzec dla każdego nowego strażnika. (d) **Kolejność budowy ekranu w 9.0a/17.1a nie wymienia
pomocy** — jest tam „kalkulator → klucze i18n → opis narzędzia AI”, a autosave jest osobno w 5.7. Właściciel repo
(29.09.2026): „tam w zasadach już była kolejność, jak budować ekrany — do tej reguły trzeba dopisać migawki”. Propozycja
jednej, pełnej kolejności dla ekranu: kalkulator + testy → klucze i18n → ekran z autosave → „?” przy każdym polu + migawka
„i”, od razu we wszystkich językach → opis narzędzia AI na końcu. Migawka „i” i `description` narzędzia AI opisują to samo
(do czego służy ekran, kiedy go użyć) — warto zalecić pisanie ich razem. Lokalnie wpisane w Dyrektywę #15 (v1.3).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/08-ui-ux.md` nowa **8.12** (kolejność budowy i DoD ekranu) + **8.4b** (forma „i”: zakładki „Po ludzku”/„Fizyka”) + dopiski 9.0a/5.7/17.1a/10.4 + **11.9**. Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

[29.09.2026] KATEGORIA: BŁĄD + DOBRA PRAKTYKA — reguła 9.0a („opis narzędzia AI mówi, kiedy go użyć; każdy kalkulator ma narzędzie”) bez strażnika dryfuje tak samo jak pomoc przy polach
Szczegóły: pytanie właściciela repo „czy są rozbudowane opisy funkcji dla AI, żeby dokładnie wiedziało, do czego to służy
i w jakich przypadkach używać”. Stan: 183 narzędzia, 27 bez zdania „kiedy wywołać” (model widzi, co narzędzie liczy, ale
nie, na jakie pytanie usera odpowiada — wybiera gorzej przy ~180 narzędziach naraz), 18 kalkulatorów w ogóle bez
narzędzia (asystent nie może ich użyć i musiałby liczyć sam, co 9.1 zabrania). Wszystkie luki powstały po rolloucie, który
„domknął” opisy — nowe moduły (M7–M9, M14) kopiowały narzędzia bez tego zdania. Rozwiązanie w tym repo:
`scripts/check-ai-tools-guard.mjs` (AST TypeScript, skleja konkatenację literałów): każde `*-tool.ts` ma `description`
z „Użyj, gdy …”, każde jest zarejestrowane w rejestrze narzędzi, każdy `calculator.ts` jest importowany przez jakieś
narzędzie albo ma komentarz `ai-tool: nie dotyczy — <powód>`; brakujące kalkulatory na liście zapadkowej (tylko maleje).
Dlaczego warto zgłosić do new-app-standards: 9.0a warto uzupełnić o (a) obowiązkowe zdanie „kiedy użyć” w stałej,
wykrywalnej formie (tu „Użyj, gdy …”), bo to ono decyduje o wyborze narzędzia przez model, oraz (b) strażnika pokrycia
„kalkulator ↔ narzędzie ↔ rejestr” w CI — ten sam wzorzec co 17.9 i strażnik pomocy (wpis wyżej).
Status: ✅ skonsolidowane w standardzie (29.09.2026) — `docs/standards/09-ai-w-produkcie.md` dopisek do **9.0a** („kiedy użyć” w opisie narzędzia + strażnik 11.9). Źródło: `AKTUALIZACJE.md` `new-app-standards`, wiersze 2026-09-29.

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
