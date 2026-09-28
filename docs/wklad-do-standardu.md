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

Status: 🔎 nowe

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

[28.09.2026] KATEGORIA: BŁĄD / PUŁAPKA — notatka przekazania na niescalonej gałęzi: kolejna sesja powtarza zrobioną pracę

Szczegóły: sesja A zakończyła pracę na własnej gałęzi (bez PR, bez merge), zostawiając w `docs/lista-do-zrobienia.md`
wpis ✅ i notatkę „PRZEKAZANIE DLA KOLEJNEJ SESJI”. Sesja B (nowa gałąź z `main`) przeczytała listę z `main`, gdzie ten
sam wpis był nadal 🔲, i zrobiła identyczną zmianę (D29 — trzy kalkulatory, testy, UI, dokumentacja) drugi raz.
Standard (14.x, GOD BOOK P.2/Y.4) każe czytać listę zadań na starcie, ale zakłada, że lista na `main` jest aktualna —
przy pracy wielu równoległych sesji w chmurze, każda na własnej gałęzi, tak nie jest. Propozycja: (1) krok startu
sesji „`git fetch` + gałęzie `claude/*` zmienione w ostatniej dobie + `git log origin/main..origin/<gałąź>`, a notatkę
przekazania czytać z najnowszej gałęzi, nie z `main`”; (2) sesja kończąca bez merge zapisuje notatkę przekazania także
w miejscu widocznym z `main` (np. PR w stanie draft), albo wprost w prompcie dla kolejnej sesji podaje nazwę gałęzi.
Status: 🔎 nowe

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
Status: 🔎 nowe

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
Status: 🔎 nowe
