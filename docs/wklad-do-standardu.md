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

Status: 🔎 nowe

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

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — rozdział 09 (AI w produkcie) ma zasady, ale brak
konkretnego kontraktu narzędzia, wzorca UX i budżetu/kosztu

Szczegóły: `docs/standards/09-ai-w-produkcie.md` opisuje dobre, spójne zasady etyczne/architektoniczne
(co AI może/nie może, tryby OFFLINE/HYBRID/CLOUD_ASSISTED, obrona przed prompt injection), ale w
przeciwieństwie do rozdziału 03 (konkretny typ `CalcResult`) nie daje żadnego konkretnego kształtu
narzędzia (function calling), żadnego wzorca UX dla obecności AI w interfejsie (rozdział 08 ma pełną
taksonomię Wzorców A-H dla ekranów, zero dla AI), i nie porusza budżetu/kosztu wywołań modelu mimo
istniejącej warstwy freemium (rozdział 12). Każdy projekt rodziny, który zacznie faktycznie budować
funkcję AI, wymyśli te trzy rzeczy od nowa, niespójnie z resztą rodziny.

Pełna propozycja (wersja z pełnym uzasadnieniem/kontekstem zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/ai-w-produkcie-rozbudowa.md` w tym repo):

**1. Konkretny kontrakt narzędzia (uzupełnienie 9.3)** — ten sam duch co `CalcResult` z rozdziału 03,
jeden nazwany typ, żeby narzędzia były wzajemnie kompatybilne między projektami rodziny:

```ts
type AiToolDefinition<TInput, TOutput> = {
  name: string                       // np. "run_calculator.dobor_przekroju_kabla"
  description: string                // po ludzku, do czego służy — model to czyta
  inputSchema: ZodSchema<TInput>     // Zod, zgodnie z rozdziałem 02 (dane nie kod)
  outputSchema: ZodSchema<TOutput>   // typowo = CalcResult<T> albo jego podzbiór
  operationType: "read" | "write"
  requiresConfirmation: boolean      // obowiązkowe true dla "write" (9.3)
  scope: string[]                    // np. ["project:current"], nigdy "*"
  handler: (input: TInput) => Promise<TOutput>
}
```

Reguła: `handler` dla narzędzi typu "wywołaj kalkulator" zawsze deleguje do już istniejącej,
niezależnie przetestowanej funkcji domenowej (rozdział 03) — nigdy nie zawiera logiki obliczeniowej
samodzielnie. To czyni regułę 9.1 ("obliczenia nigdy nie zależą od AI") sprawdzalną maszynowo, nie
tylko deklaratywną.

**2. Budżet i koszt** — rozdział 9.6 opisuje tryby OFFLINE/HYBRID/CLOUD_ASSISTED wg dostępności
sieci, nie wg kosztu. Każde wywołanie modelu w trybie CLOUD_ASSISTED ma koszt per token — potrzebny
jawny budżet per użytkownik/projekt (limit miesięczny w warstwie freemium), egzekwowany server-side.
Degradacja przy wyczerpanym budżecie musi być łagodna i jawna (echo zasady z rozdziału 06): AI
przechodzi do trybu HYBRID/OFFLINE i mówi o tym wprost ("Wyczerpano miesięczny limit asystenta AI —
nadal możesz korzystać ze wszystkich kalkulatorów ręcznie"), nigdy nie ukrywa degradacji.

**3. Wzorce UX dla AI w produkcie (uzupełnienie rozdziału 08)** — dwa nazwane, rozróżnialne tryby
(decyzja per projekt, który wdrożyć):
- **Asystent wbudowany w ekran (inline)** — AI sugeruje wypełnienie konkretnych pól na już
  istniejącym ekranie Wzorca D, nigdy nie zastępuje samego ekranu; widoczne jako odznaczalna sugestia
  przy polu ("AI proponuje: 25% — użyj/odrzuć"), zgodnie z 9.2.
- **Czat/asystent rozmowny (osobny panel)** — dla pytań nieprzypisanych do jednego ekranu; zawsze
  kończy odpowiedź dotyczącą wyniku liczbowego linkiem do właściwego ekranu Doradcy, nie samą liczbą
  wygenerowaną przez model.
- W obu przypadkach: każda sugestia AI pokazuje źródło (`traceId`/`calculatorVersion`, rozdz. 03) —
  użytkownik zawsze może zweryfikować, skąd wzięła się liczba.

**4. Miejsce w procesie wersjonowania Biblii (uzupełnienie rozdziału 14)** — każda decyzja projektowa
zaakceptowana przez użytkownika na podstawie sugestii AI w produkcie zapisuje się w stanie projektu z
polem `zaproponowaneBy: "ai"` obok zwykłych zapisów — czysto informacyjne, nie zmienia procesu
zatwierdzania (wciąż wymaga zgody użytkownika, 9.2), pozwala odróżnić "user wpisał sam" od "user
zaakceptował sugestię AI" przy audycie/debugowaniu.

**5. Otwarte pytania dla sesji `new-app-standards`:** czy `AiToolDefinition` (punkt 1) żyje w
`03-jadro-obliczeniowe.md` (obok `CalcResult`) czy w `09-ai-w-produkcie.md`; czy budżet/koszt (punkt
2) to osobna sekcja w 09 czy dopisek do 12 (freemium) z odnośnikiem zwrotnym; ten dokument celowo nie
rozstrzyga "jakiego dostawcy modelu/architektury hostingu użyć" — decyzja produktowa per projekt.

Dlaczego warto zgłosić do new-app-standards: AI-w-produkcie to nie specyfika Offgrid — każda apka
rodziny prędzej czy później dostanie funkcję asystenta, a bez wspólnego kontraktu narzędzia i
wzorca UX każdy projekt zbuduje niekompatybilną, jednorazową implementację, tak jak dziś dzieje się
z i18n i logowaniem (patrz dwa zgłoszenia niżej).

Status: ✅ skonsolidowane (15.09.2026, `docs/standards/09-ai-w-produkcie.md` 9.3/9.6/9.9/9.10 —
kontrakt `AiToolDefinition`, budżet/koszt, dwa wzorce UX inline/czat, pole `zaproponowaneBy`;
zweryfikowane 20.09.2026 przy okazji kolejnej aktualizacji — wszystkie cztery punkty propozycji
faktycznie obecne w źródle, nie tylko zadeklarowane). Wpis wcześniej nieoznaczony mimo konsolidacji
tego samego dnia następnego sync-u — poprawione teraz, zgodnie z zasadą "zweryfikowane
programistycznie, nie z metryczki".

---

[14.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie/GOD BOOK jakiegokolwiek rozdziału o
logowaniu i kontach użytkownika

Szczegóły: Sprawdzone wprost (nie zgadywane) — zero trafień na "logowanie"/"konto użytkownika"/
"uwierzytelnianie"/"autoryzacja" w całym pakiecie `docs/standards/00`-`16` i w GOD BOOK. To nie jest
luka tylko tego projektu (ten też nie ma żadnego kodu auth) — to luka na poziomie samego pakietu.
Właściciel projektu wskazał apkę `zero-waste` (siostrzany projekt rodziny) jako wzorzec, na którym
mają bazować rekomendacje — ta sesja nie miała dostępu do tamtego repo, więc zgłoszenie jest
świadomie niedokończone (szkielet + pytania, nie gotowa specyfikacja).

Co już ustalone bez zero-waste — echo istniejących zasad standardu (wersja z pełnym uzasadnieniem
zostaje dodatkowo, nieusunięta, w `docs/propozycje-do-new-app-standards/logowanie-i-konta.md` w tym
repo, oznaczona tam jako **celowo niedokończona**, bo miała bazować na kodzie `zero-waste`, do
którego ta sesja nie miała dostępu):
1. Offline-first (rozdział 05) musi przetrwać brak konta — logowanie nie może być bramką blokującą
   dostęp do rdzenia aplikacji, najwyżej do funkcji wymagających synchronizacji/chmury. Konto =
   opcjonalne rozszerzenie, nie warunek wejścia.
2. Prywatność lokalna-domyślna (rozdział 07) — logowanie/konto to dokładnie moment zgody na chmurę,
   nowy rozdział powinien się do 07 odwoływać, nie duplikować.
3. Egzekwowanie freemium wyłącznie server-side (rozdział 12) — jeśli konto odblokowuje płatne
   funkcje, sprawdzanie uprawnień nigdy nie może żyć tylko w kliencie.
4. `StorageAdapter` (rozdział 05) — naturalne miejsce na dane sesji/tokenu, nie nowy równoległy
   mechanizm przechowywania.
5. Droga web→mobile (rozdział 13) — mechanizm auth powinien żyć za tym samym punktem wymiany
   (adapters), nie być wpleciony bezpośrednio w kod web.

Pytania wciąż czekające na odpowiedź z realnego kodu zero-waste (nierozstrzygnięte, nie zgadywane):
dostawca/mechanizm auth (własna implementacja vs Supabase/Clerk/NextAuth/Firebase); model konta
(jedno konto per apka, czy jedno konto rodziny na wszystkie apki); co dokładnie wymaga logowania
(cała apka, czy tylko synchronizacja/chmura/płatności zgodnie z punktem 1); spięcie offline↔online
(scenariusz "user pracował offline bez konta, potem się zalogował" — merge, nadpisanie, ręczny
wybór — dotyka rozdziału 05, Seed vs Wynik); role/uprawnienia (poza pojedynczym typem użytkownika,
np. instalator + klient); zakres bezpieczeństwa faktycznie wdrożony (reset hasła/weryfikacja
email/2FA, do rozdziału 07).

Dlaczego warto zgłosić do new-app-standards: logowanie to jeden z tych tematów, które "zawsze są
zakładane, nigdy nie są nigdzie zapisane" — dokładnie to odkryła ta sesja, sprawdzając wprost zamiast
zakładać. Dotyczy każdej apki rodziny, która kiedykolwiek doda konta użytkownika.

Status: ✅ skonsolidowane (15.09.2026, `docs/standards/18-logowanie.md` — pełny nowy rozdział 18
powstał, nie tylko szkielet; ten projekt zbudował własną implementację Supabase Auth na jego
podstawie, patrz zadanie "Rozdz. 18: audyt i zamknięcie realnych luk"). Zweryfikowane 20.09.2026.

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

---

[16.09.2026] KATEGORIA: BŁĄD — 18.4 (Supabase Auth jako wymóg) i 18.5 (token sesji wyłącznie w
`HttpOnly` cookie) kolidują w praktyce dla "oczywistego" sposobu użycia biblioteki

Szczegóły: Przy porządkowaniu szkieletu logowania (bez realnych kluczy, patrz `docs/memory.md`)
sprawdzone wprost w `node_modules/@supabase/ssr` (nie zgadywane): `DEFAULT_COOKIE_OPTIONS`
biblioteki to `{ path: "/", sameSite: "lax", httpOnly: **false** }`. Powód: `createBrowserClient()`
(klient dla komponentów klienckich, dokumentowany jako standardowy sposób odczytu stanu logowania
po stronie przeglądarki) musi umieć zapisać/odświeżyć tę samą cookie z poziomu JS — a `HttpOnly`
jest z definicji niemożliwy do ustawienia przez JS w przeglądarce (ograniczenie platformy, nie
wybór biblioteki). Skutek: każdy projekt, który podąży za "oczywistym" wzorcem (Server Component
loguje przez `createServerClient`, komponent kliencki czyta status logowania przez
`createBrowserClient().auth.getUser()` — dokładnie to, co ten projekt miał do 16.09.2026,
`components/konto-sekcja.tsx`) **cicho łamie 18.5** przy pierwszym odświeżeniu tokenu przez klienta
przeglądarkowego, mimo poprawnie ustawionych opcji po stronie serwera — sama obecność
`createBrowserClient` gdziekolwiek w kodzie wystarczy, żeby zepsuć całą resztę.

Naprawione w tym projekcie: `createBrowserClient`/`lib/adapters/supabase/client.ts` usunięte
całkowicie (jedyne użycie zastąpione Server Actionem, `lib/adapters/supabase/get-account-status.ts`
— stan logowania czytany server-side, nigdy przez klienta Supabase w przeglądarce). Dopiero bez
żadnego `createBrowserClient` w kodzie jawne `cookieOptions: { httpOnly: true, secure: ..., sameSite:
"lax" }` przekazane do `createServerClient` (sprawdzone w `node_modules`: biblioteka poprawnie
nadpisuje `DEFAULT_COOKIE_OPTIONS` przekazanymi opcjami) faktycznie działa zgodnie z 18.5, bez
ryzyka cichego nadpisania przez inny fragment kodu.

Dlaczego warto zgłosić do new-app-standards: 18.4 nakazuje Supabase Auth "spójnie z 6.5", 18.5
nakazuje czyste `HttpOnly` — żaden z dwóch punktów nie ostrzega, że najbardziej oczywisty,
udokumentowany wzorzec użycia narzędzia z 18.4 (klient przeglądarkowy do odczytu stanu logowania)
łamie 18.5 po cichu. Każdy kolejny projekt rodziny, który zacznie od klienta przeglądarkowego (bo
to jest to, co pokazuje oficjalna dokumentacja Supabase), odkryje to dopiero przy audycie
bezpieczeństwa, nie przy pisaniu kodu. Warta dopisania jako jawna, nazwana pułapka w 18.5 (albo
nowy podpunkt): "nigdy nie używaj `createBrowserClient`/klienta Supabase w przeglądarce do odczytu
stanu sesji — stan logowania czytany wyłącznie server-side (Server Component/Server Action), nawet
kosztem dodatkowego round-tripu do serwera przy każdym odczycie w komponencie klienckim".

Status: ✅ skonsolidowane (16.09.2026, `AKTUALIZACJE.md` wiersz 67 — nowa 18.5, "pułapka nazwana
wprost": `createBrowserClient()` ma domyślnie `httpOnly:false`, stan logowania czytany wyłącznie
server-side). Dokładnie ta pułapka, dokładnie to rozwiązanie.

---

[16.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — 18.5 wymaga "tokenu CSRF" na każdym endpoincie
zmieniającym stan, ale nie rozstrzyga, czy wbudowana ochrona Next.js Server Actions to spełnia

Szczegóły: 18.5 (dopisek 15.09.2026) mówi wprost: "Token CSRF (synchronizer token albo
double-submit cookie) na każdym endpoincie zmieniającym stan, niezależnie od `SameSite` — obrona w
głąb, nie zamiennik." Ten projekt miał `/auth/signout` jako zwykły Route Handler (`POST`) bez
żadnego tokenu — zamieniony na Server Action (`app/auth/signout/actions.ts`), bo Next.js
weryfikuje nagłówek Origin/Host przy każdym wywołaniu Server Action (mechanizm wbudowany w
framework, nie kod tego projektu). To realna, sprawdzalna ochrona — ale **nie jest to dosłownie
"synchronizer token" ani "double-submit cookie"**, tylko porównanie nagłówków żądania. Nie znaleziono
w tej sesji jednoznacznej odpowiedzi (bez zgadywania), czy sprawdzenie Origin/Host przez framework
ma być traktowane jako spełniające literę 18.5, czy 18.5 wymaga dodatkowo prawdziwego tokenu nawet
na Server Actions. Świadomie NIE rozstrzygnięte samodzielnie w tym projekcie — Server Actions
zamiast Route Handlerów to i tak poprawa względem stanu wyjściowego (zero ochrony → ochrona
frameworkowa), niezależnie od odpowiedzi na to pytanie.

Dlaczego warto zgłosić do new-app-standards: każdy projekt rodziny na Next.js App Router używający
Server Actions do logowania/wylogowania (ten wzorzec już jest w 18.2/18.5 przykładach) natrafi na
to samo pytanie. Jednoznaczne rozstrzygnięcie w rozdziale 18 (czy ochrona Origin/Host Next.js
Server Actions wystarcza, czy zawsze wymagany jest dodatkowy token) oszczędzi każdej kolejnej
sesji tę samą niepewność.

Status: ✅ skonsolidowane (16.09.2026, `AKTUALIZACJE.md` wiersz 67 — rozstrzygnięcie: ochrona
Origin/Host wbudowana we frameworku dla prawdziwych Server Actions spełnia wymóg "tokenu CSRF" z
18.5; zwykłe Route Handlery nadal wymagają jawnego tokenu). Dokładnie to pytanie, dokładnie ta
odpowiedź.

---

[16.09.2026] KATEGORIA: BŁĄD — 7.3 (hash CSP dla inline `<script>`) jest architektonicznie
niekompatybilny z Next.js App Router: produkcyjna CSP psuje hydrację Reacta na KAŻDEJ stronie

Szczegóły: Przy pracy nad 5.3 (PWA offline-first, ten sam dzień) — pierwsza w tej sesji realna
weryfikacja produkcyjnej CSP w prawdziwej przeglądarce (`pnpm build && pnpm start` + Playwright,
nie `pnpm dev`, gdzie CSP jest celowo złagodzona o `unsafe-inline`/`unsafe-eval` dla HMR) —
odkryto, że **hydracja Reacta psuje się na każdym ekranie aplikacji**, zawsze, w każdej produkcji:
`Uncaught (in promise) Minified React error #412` w konsoli, poprzedzony seriami `Refused to
execute inline script because it violates the following Content Security Policy directive`, za
każdym razem z INNYM wymaganym hashem SHA-256.

Przyczyna źródłowa: `script-src` tej CSP (wzorzec z rozdz. 7.3 tego standardu, wpis 16.09.2026,
wiersz 70 — "hash liczony automatycznie, nigdy ręcznie") dopuszcza inline-skrypty wyłącznie przez
jawnie wymieniony, stały hash — poprawne i wystarczające dla JEDNEGO, statycznego, znanego z góry
skryptu (np. `WYGLAD_INIT_SCRIPT` tego projektu, ustawiający motyw przed pierwszym malowaniem).
Next.js App Router (13+, w tym wersja tego projektu — 16) generuje jednak WŁASNE, dodatkowe
inline `<script>` do przesłania payloadu RSC streaming (`self.__next_f.push([...])`) — jeden lub
więcej PER ŻĄDANIE, z treścią zależną od danych renderowanej strony. Taka treść z definicji nie
może mieć stałego hasha z góry — każde żądanie generuje inny hash, więc żaden statyczny wpis w
`script-src` nigdy go nie obejmie. Rezultat: CSP oparta wyłącznie o statyczne hashe blokuje
hydrację na KAŻDEJ stronie z jakąkolwiek dynamiczną treścią (czyli praktycznie każdej), nie tylko
teoretycznie — potwierdzone jako **obecny, aktywny stan produkcji** tego projektu, nie ryzyko.

Zweryfikowane jako niezwiązane z konkretną zmianą tej sesji (PWA) — identyczny błąd reprodukuje
się na czystym `main` sprzed PWA (commit `b5fb177`), sprawdzone w izolowanym `git worktree`.
Najpewniej niewykryte wcześniej, bo cała dotychczasowa weryfikacja w przeglądarce w tej sesji szła
przez `pnpm dev` (złagodzona CSP) — nigdy przez `pnpm start` z prawdziwą produkcyjną CSP w
rzeczywistej przeglądarce, dopóki nie zaszła potrzeba realnie sprawdzić rejestrację service
workera.

Rozwiązanie standardowe dla tej klasy problemu (nieprzetestowane jeszcze w praktyce w żadnym
projekcie rodziny, ale to udokumentowany, oficjalny wzorzec Next.js): **CSP oparta o nonce
generowany per żądanie w middleware**, nie o stałe hashe. Middleware generuje losowy nonce
(`crypto.randomUUID()`/`crypto.randomBytes`), dokłada go do nagłówka CSP (`script-src 'self'
'nonce-{wartość}'`) ustawianego DYNAMICZNIE w middleware (nie w statycznej funkcji `headers()`
w `next.config.mjs`, bo ta nie ma dostępu do per-request nonce'u), i przekazuje ten sam nonce do
`<html>` przez nagłówek `x-nonce` odczytywany w Server Component roota — Next.js automatycznie
dokłada ten nonce do WSZYSTKICH generowanych przez siebie inline-skryptów (w tym RSC streaming),
jeśli wykryje go w nagłówku odpowiedzi zgodnie z własnym mechanizmem. To eliminuje potrzebę
ręcznego wyliczania hasha dla własnych inline-skryptów (jak `WYGLAD_INIT_SCRIPT`) — te też dostają
ten sam nonce zamiast osobnego hasha.

Dlaczego warto zgłosić do new-app-standards: **7.3 dziś opisuje wyłącznie wzorzec hash-based CSP**
(ostatnio wzmocniony wiersza 70 AKTUALIZACJE.md o automatyczne liczenie hasha) — ten wzorzec
działa poprawnie tylko dla stron w pełni statycznych, bez żadnego dynamicznego contentu
renderowanego przez RSC/Suspense. Każdy przyszły i obecny projekt rodziny na Next.js App Router
(dziś: ten projekt, potencjalnie inzynier-szkieletowy-pro), który wdroży hash-based CSP dosłownie
wg dzisiejszego brzmienia 7.3, odziedziczy dokładnie ten sam błąd — całkowicie zepsutą hydrację w
produkcji, cichą (bez błędu widocznego zwykłemu userowi, tylko w konsoli deweloperskiej), i bardzo
łatwą do przeoczyć, bo `pnpm dev`/testy lokalne z reguły nie używają identycznej, ścisłej CSP co
produkcja. Rekomendacja: 7.3 powinna jawnie rozróżnić dwa reżimy — (a) hash-based, tylko dla
projektów BEZ App Routera Next.js albo ze stronami w pełni statycznymi (`output: "export"`), (b)
nonce-per-request jako WYMAGANY wzorzec dla każdego projektu Next.js App Router z jakąkolwiek
stroną renderowaną dynamicznie (czyli w praktyce: prawie zawsze) — z konkretnym przykładem
middleware + odczytu nonce'u w root layout, analogicznym do już istniejących przykładów w
`docs/przyklady/`.

Świadomie NIE naprawione w tym projekcie na razie — właściciel repo zdecydował poczekać na
rozstrzygnięcie przez tę konsolidację, zamiast budować naprawę lokalnie przed nią. Bieżący,
częściowy obejście w tym projekcie: rejestracja service workera (5.3/PWA) zaprojektowana tak, by
NIE zależeć od hydracji Reacta (zewnętrzny plik `public/register-sw.js` przez zwykły `<script
src>`, nie komponent kliencki) — działa mimo błędu, ale to obejście jednego symptomu, nie
naprawa przyczyny; reszta interaktywności aplikacji zależnej od hydracji pozostaje dotknięta.

Status: ✅ skonsolidowane i naprawione (20.09.2026). `docs/standards/07-bezpieczenstwo.md` 7.3 ma
teraz oba reżimy CSP jawnie rozróżnione (hash-based tylko dla projektów bez App Routera/w pełni
statycznych; nonce-per-request wymagany dla Next.js App Router z dowolną stroną dynamiczną).
**Ten projekt też naprawiony** — zweryfikowane wprost w `middleware.ts`: nonce generowany per
żądanie (`crypto.randomUUID()`), przekazywany przez nagłówek `x-nonce` do Server Componentów i
przez `Content-Security-Policy` do przeglądarki, `app/layout.tsx` odczytuje go i wstawia do
`WYGLAD_INIT_SCRIPT`. Obejście serwis-workera opisane wyżej nie jest już potrzebne jako jedyna
ochrona — pozostaje jako dodatkowa odporność, nie jako jedyny mechanizm.

---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — "kompletny szablon sekcji" w audycie pokrycia funkcji ≠ "ma computable wzór"

Szczegóły: Wcześniejszy audyt (05.09.2026) oznaczył dwie funkcje (5.46 "ryzyko zamarznięcia
dolnego źródła", 5.31 "hałas i wibracje", oba Moduł 6) jako "gotowe do budowy — pełna treść
Doradcy z formułą", na podstawie tego, że źródło miało wypełniony pełny szablon sekcji A/B/C/D
(Wejście/Silnik/Wynik/Migawka). Przy faktycznej implementacji (20.09.2026) okazało się, że
źródło ma w Sekcji B (Silnik) tylko narrację słowną + jeden ilustracyjny przykład liczbowy —
BEZ wzoru wiążącego wejścia z wynikiem. Etykieta "kompletny szablon" w audycie źle przewidziała
budowalność — audyt sprawdzał obecność struktury (czy sekcje A/B/C/D są wypełnione tekstem),
nie obecność faktycznie odtwarzalnego wzoru wewnątrz Sekcji B. Skutek: dwie funkcje błędnie
zaklasyfikowane jako "todo, gotowe" zamiast "todo, wymaga Wzorca C (informacyjny, bez
kalkulatora)" — poprawione dopiero przy realizacji, nie przy audycie.

Dlaczego warto zgłosić do new-app-standards: to ogólny błąd metodologiczny audytu pokrycia
funkcji w KAŻDYM projekcie rodziny opartym o szablon Doradcy A/B/C/D — łatwo pomylić "sekcja
ma treść" z "sekcja ma wzór". Rekomendacja: standard (rozdział o Procesie/Audycie, albo
09-AI/03-jądro-obliczeniowe) powinien doprecyzować kryterium klasyfikacji "gotowe do budowy"
przy audycie pokrycia — wymagać jawnego potwierdzenia, że Sekcja B zawiera odtwarzalny wzór
matematyczny (nie tylko opis słowny + przykład), zanim funkcja dostanie status "gotowe do
budowy, pełna treść z formułą". Sam przykład liczbowy w źródle, bez ogólnego wzoru, powinien
z automatu klasyfikować funkcję jako kandydata do Wzorca C (informacyjny), nie D (kalkulator).

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/08-ui-ux.md` — doprecyzowanie 8.2: audyt
pokrycia musi potwierdzić odtwarzalny wzór w Sekcji B, nie tylko wypełnioną treść, zanim funkcja
dostanie status "gotowe do budowy, Wzorzec D"). Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: BŁĄD — nowy wzorzec ustalony w połowie projektu nie był retroaktywnie stosowany do kolejnych nowych modułów

Szczegóły: Hook `usePersistedDraft` (autosave draftu formularza do IndexedDB) powstał
15.09.2026 dla jednego ekranu (`napiecie-systemowe`), po zgłoszeniu użytkownika o utracie
wpisanych danych. Od tego dnia to był lepszy, ustalony wzorzec dla KAŻDEGO nowego ekranu
formularza w tym repo. Mimo to w tej samej sesji, już PO 15.09, zbudowano kolejnych 8 nowych
modułów (`ryzyko-pid`, `dobor-regulatora-pwm-mppt`, `wind-chill`, `urzadzenia-zmienne`,
`sprawnosc-inwertera-niskie-obciazenie`, `architektura-fazowa`, `kategorie-specjalne`,
`systemy-podtrzymania-zycia`) zwykłym `useState`, bez autosave — bo AI kopiowało stary
szablon plikowy (z czasów sprzed hooka) z przyzwyczajenia, zamiast za każdym razem sprawdzić,
czy wzorzec, który powiela, jest wciąż aktualny. Błąd wykryty dopiero przy osobnym zadaniu
rolloutu (punkt 8 z listy zaległości), które i tak musiało objąć te "świeże" moduły razem ze
starymi — koszt: 8 modułów zbudowanych od razu źle, do poprawki później, zamiast raz dobrze.

Dlaczego warto zgłosić do new-app-standards: to nie specyfika tego projektu — to ogólny problem
procesowy przy pracy AI nad długim, wielosesyjnym projektem: gdy w trakcie projektu powstaje
nowy, lepszy wzorzec dla klasy plików (nie tylko autosave — dowolny: nowy hook, nowa konwencja
walidacji, nowy komponent bazowy), nic nie wymusza sprawdzenia "czy szablon, który zaraz
skopiuję, jest nadal aktualny" przy KAŻDYM kolejnym pliku tej klasy, nawet w tej samej sesji.
Rekomendacja dla standardu: gdy AI ustala nowy wzorzec dla całej klasy plików (nie
jednorazowa decyzja), powinno od razu dopisać jedno zdanie w `docs/memory.md` w formie
jawnej, przeszukiwalnej reguły ("od DD.MM: każdy nowy ekran typu X używa Y, nie starego Z") —
i AI powinno mieć nawyk, żeby przed kopiowaniem istniejącego pliku jako szablonu dla nowego,
sprawdzić `docs/memory.md` pod kątem takich reguł nowszych niż plik-źródło szablonu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.19 — nowy wzorzec
ustalony w trakcie sesji musi trafić do `docs/memory.md` od razu, sprawdzane przed kopiowaniem
szablonu). Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: DOBRA PRAKTYKA — kontrakt `AiToolDefinition` z 9.3 ma teraz działającą
implementację referencyjną (nie tylko typ na papierze), plus jedna reguła kolejności warta
dopisania obok niej

Szczegóły: Wpis z 14.09.2026 (wyżej w tym pliku) zgłosił brak konkretnego kształtu narzędzia AI —
skonsolidowany 15.09.2026 jako 9.3 (`docs/standards/09-ai-w-produkcie.md`). Od tego czasu w tym
projekcie powstała pierwsza realna, przetestowana implementacja tego kontraktu (nie szkic):
`lib/ai/types.ts` (typ + `validateAiToolDefinition()`), `lib/ai/tools/kalkulatory-pomocnicze-tool.ts`
(pierwsze narzędzie), `lib/ai/to-anthropic-tool.ts` (adapter), `lib/ai/pytaj-asystenta.ts` (pętla
agentowa). Dwa elementy tej implementacji są transferowalne i dziś nigdzie w standardzie nieopisane:

1. **Most JSON Schema jako punkt przenośności między dostawcami AI.** `z.toJSONSchema()` (Zod v4,
   natywne, bez dodatkowej biblioteki) generuje z `inputSchema` obiekt JSON Schema, który Anthropic
   przyjmuje wprost jako `Tool.input_schema` — ale to DOKŁADNIE ten sam artefakt, którego zażąda
   `function.parameters` OpenAI i `FunctionDeclaration.parameters` Gemini. Konsekwencja dla każdego
   projektu rodziny planującego BYOK (podłączenie własnego klucza usera do wybranego dostawcy —
   temat poruszony wprost przez właściciela tego projektu, jeszcze nie zbudowany): rejestr narzędzi
   (9.3) pisany raz, w jednym miejscu, nie wymaga przepisania per dostawca — tylko cienkiego
   adaptera per dostawca (~15-20 linii, sama zmiana koperty wokół tego samego JSON Schema), nie
   powielenia opisów. Wart dopisania jako konkretna wskazówka architektoniczna obok samego typu
   `AiToolDefinition` w 9.3 — dziś typ jest tam, ale nic nie mówi, że to, co w niego wpiszesz, jest
   już z natury gotowe pod wielu dostawców, jeśli tylko trzyma się na Zod/schemacie generującym
   standardowy JSON Schema.
2. **Kolejność pisania: opis narzędzia AI na końcu, nie na początku.** Przy planowaniu, jak
   efektywnie dobudować opisy AI do pozostałych kalkulatorów tego projektu (116 z 117 nie ma dziś
   żadnego), ustalona rekomendacja: kalkulator (input/calculator/validation/warnings + testy) →
   i18n (klucze tłumaczeń) → dopiero na końcu `AiToolDefinition`. Powód: dokładny opis narzędzia
   (pola `.describe()` w Zod, treść `description` narzędzia) wymaga znajomości OSTATECZNEGO,
   przetestowanego kształtu wejścia/wyjścia — pisanie go przed ustabilizowaniem kalkulatora ryzykuje,
   że opis skłamie o kształcie danych po pierwszej zmianie w trakcie testowania. To osobna,
   dodatkowa reguła obok już istniejącej 17.1a (i18n jako założenie architektoniczne od Etapu 1) —
   ta ostatnia mówi "buduj razem od początku", ta tutaj doprecyzowuje wewnętrzną kolejność KROKÓW
   w ramach tego samego, jednosesyjnego podejścia, żeby nie była to dowolna kolejność trzech
   rzeczy naraz.

Kod referencyjny (pierwsze narzędzie end-to-end, gotowe do skopiowania jako wzorzec): pliki
wymienione wyżej, `lib/ai/` w tym repo.

Dlaczego warto zgłosić do new-app-standards: AI w produkcie jest już dziś obowiązkowym elementem
każdej apki rodziny (9.0) — każdy kolejny projekt, który zacznie budować rejestr narzędzi, odkryje
te same dwie rzeczy (przenośność JSON Schema, kolejność pisania opisu) samodzielnie, chyba że
zostaną nazwane raz, tutaj. To dokładnie ten sam wzorzec zgłoszenia, co CI referencyjny/i18n guard
(wpis 16.09.2026 wyżej) — reguła bez przykładu kodu jest dużo łatwiejsza do błędnego wdrożenia niż
reguła z gotowym, zweryfikowanym wzorcem obok.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/09-ai-w-produkcie.md` — doprecyzowanie 9.3:
Zod/JSON Schema jako most przenośności między dostawcami AI, reguła kolejności "opis na końcu").
Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: DOBRA PRAKTYKA — weryfikacja zainstalowanej wersji SDK wprost w
`node_modules` (nie z pamięci treningowej modelu) przed wyborem konkretnego wzorca integracji,
z konkretnym, udokumentowanym przykładem decyzji

Szczegóły: Przy budowie `lib/ai/pytaj-asystenta.ts` (16.09.2026, PR #98 — pierwsza realna
integracja rozdziału 09) padła konkretna decyzja techniczna: "pętla agentowa ręczna (manual
agentic loop), nie beta Tool Runner SDK (`client.beta.messages.toolRunner`/`betaZodTool`)".
Powód nie był domysłem — sprawdzone wprost `find`/`grep` w `node_modules`, że zainstalowana
wersja `@anthropic-ai/sdk` (0.126.0) jeszcze nie ma tej bety. Zapisane w `docs/memory.md`
(wpis z 16.09.2026) z jawną notatką na przyszłość: "jeśli SDK zostanie zaktualizowane, warto
rozważyć migrację na Tool Runner — nie zrobione teraz świadomie, nie przeoczenie".

To zastosowanie reguły "Never guess SDK usage" ze skilla `claude-api` (bundlowany skill Claude
Code, nie część `new-app-standards`) — ale sam mechanizm, który tę regułę wymusił (sprawdzenie
`node_modules` PRZED napisaniem kodu, zamiast polegania na tym, co model "pamięta" z treningu
o danym SDK), jest ogólniejszy niż jeden konkretny skill i dotyczy **każdej** biblioteki
zewnętrznej w **każdym** projekcie rodziny, nie tylko integracji AI. SDK-i i biblioteki
zewnętrzne driftują między wersjami szybciej, niż aktualizuje się wiedza treningowa modelu —
to samo ryzyko dotyczy Next.js (patrz już istniejący blok w `CLAUDE.md`/`generate-agent-files.js`:
"This is NOT the Next.js you know"), Supabase, Zod, i każdej kolejnej biblioteki, którą projekt
rodziny kiedykolwiek zaktualizuje.

Rozdział 15 ma dziś **generyczną** wersję tej zasady (15.7, "nie wiem zamiast wymyślania" — nie
zgaduj brakujących DANYCH), ale nie ma jej **konkretnej odmiany dla kodu integrującego bibliotekę
zewnętrzną**: "nie zgaduj API/metod/kształtu wywołania biblioteki z pamięci treningowej — zweryfikuj
wprost w zainstalowanej wersji (`node_modules`/`vendor`/odpowiednik stosu) przed napisaniem kodu,
zwłaszcza gdy bibliotieka ma szybki cykl wydań (SDK dostawców AI, frameworki webowe)". Propozycja:
dopisać to jako **15.7a**, z tym konkretnym przykładem (Anthropic SDK 0.126.0 vs beta Tool Runner)
jako gotowa ilustracja "jak to wygląda w praktyce", analogicznie do już zgłoszonego wzorca
(wpis 16.09.2026 wyżej — "reguła bez przykładu kodu jest łatwiejsza do błędnego wdrożenia niż
reguła z gotowym wzorcem obok").

Dlaczego warto zgłosić do new-app-standards: to nie jest specyfika AI czy jednego SDK — to ogólny
problem każdej sesji AI piszącej kod na bibliotece, która aktualizuje się częściej niż wiedza
treningowa modelu. Bez jawnie nazwanej reguły z konkretnym przykładem, kolejny projekt rodziny
(albo ta samo, po aktualizacji zależności) ryzykuje napisanie kodu na nieistniejące/przestarzałe
API biblioteki, wykryte dopiero przy `pnpm build`/`pnpm typecheck`, a nie przed napisaniem kodu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.7a — nie zgaduj
API biblioteki zewnętrznej z pamięci treningowej, zweryfikuj zainstalowaną wersję wprost).
Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — rejestr narzędzi AI powinien być architektonicznym
domyślnym od Etapu 1 (jak 17.1a i18n oraz 5.7 autosave), nie dobudowywany reaktywnie

Szczegóły: Na wyraźną prośbę właściciela projektu ("róbmy to od razu, nie tylko dla
wielojęzyczności, ale i dla AI") — rozszerzenie wpisu bezpośrednio wyżej (referencyjna
implementacja `AiToolDefinition`) o formalną propozycję reguły w tym samym kształcie, co dwie już
skonsolidowane reguły tego standardu: [17.1a](../standards/17-i18n.md) (wielojęzyczność od Etapu 1)
i [5.7](../standards/05-baza-danych-offline.md) (autosave od Etapu 1). Ten projekt ma dziś **trzeci
niezależny przypadek tego samego wzorca kosztu**: warstwa dobudowana reaktywnie do już istniejących
ekranów (i18n — dziesiątki ekranów z twardym polskim tekstem; autosave — ~90 ekranów bez
persystencji; teraz AI — 116 ze 117 kalkulatorów bez zarejestrowanego narzędzia) zawsze kończy się
osobną, kosztowną kampanią retrofitu zamiast kosztem rozłożonym na każdy ekran budowany od razu
poprawnie. Trzecie wystąpienie tego samego kształtu w jednym projekcie to silny sygnał ogólnej
prawidłowości, nie przypadku.

Gotowa, pełna treść proponowanej reguły (wzorowana 1:1 na strukturze 17.1a/5.7, z jednym świadomie
nazwanym odstępstwem — inną kolejnością pisania wewnątrz pojedynczego ekranu niż przy i18n, bo opis
narzędzia AI wymaga ustabilizowanego kontraktu I/O, więc musi powstać na końcu, nie na początku;
wersja z pełnym uzasadnieniem zostaje dodatkowo, nieusunięta, w
`docs/propozycje-do-new-app-standards/ai-w-produkcie-rozbudowa.md`, sekcja 6, w tym repo) — proponowany
podpunkt **9.0a**, obok 9.0 "Obowiązkowość AI w produkcie":

> Każdy nowy projekt rodziny zakłada od **Etapu 1** (szkielet architektury, zanim powstanie pierwszy
> ekran kalkulatora), że każdy kalkulator dostanie zarejestrowane narzędzie AI (`AiToolDefinition`,
> patrz zgłoszenie 14.09.2026 wyżej) — nigdy "AI dodamy do interfejsu później, jako osobny projekt
> nad już gotowymi ekranami". Konkretnie, od pierwszego dnia:
>
> - Szkielet ma gotowy, generyczny rejestr narzędzi (`NARZEDZIA`/`AiToolDefinition[]`) i adapter do
>   wybranego dostawcy modelu (most JSON Schema, patrz zgłoszenie 20.09.2026 wyżej) — zbudowane razem
>   z Kernelem, nie po fakcie.
> - **Kolejność wewnątrz jednego ekranu pozostaje świadomie inna niż dla i18n**: kalkulator →
>   struktura i18n → dopiero na końcu opis narzędzia AI, bo dokładny opis (`.describe()` na polach
>   Zod, treść `description`) wymaga znajomości OSTATECZNEGO, przetestowanego kształtu
>   wejścia/wyjścia — w odróżnieniu od i18n (gdzie struktura kluczy powstaje pierwsza, bo kalkulator
>   i tak musi zwracać klucze, nie gotowy tekst), tutaj struktura rejestru powstaje pierwsza (na
>   poziomie szkieletu), ale WPIS per-kalkulator powstaje ostatni (na poziomie pojedynczego ekranu).
> - `handler` każdego nowego narzędzia deleguje 1:1 do już istniejącej funkcji domenowej (9.2) —
>   nigdy nowa logika pisana specjalnie pod AI.

Dowód z tego projektu: w chwili zgłoszenia 116 ze 117 zbudowanych kalkulatorów
(`lib/core/modules/*/calculator.ts`) nie miało żadnego zarejestrowanego narzędzia AI — dokładnie ten
sam kształt zaległości, co ~90 ekranów bez autosave przed 5.7 i dziesiątki ekranów z twardo wpisanym
polskim tekstem przed 17.1a.

Dlaczego warto zgłosić do new-app-standards: dokładnie ten sam argument, co przy konsolidacji
17.1a/5.7 — trzy niezależne projekty/warstwy odkryły ten sam koszt osobno, w różnym czasie, co było
wystarczającym sygnałem, żeby podnieść autosave i i18n do rangi reguły. AI w produkcie jest już
dziś obowiązkowa dla każdej apki rodziny (9.0) — bez tej reguły każdy kolejny projekt powtórzy
dokładnie ten sam błąd sekwencji po raz czwarty.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/09-ai-w-produkcie.md` 9.0a — rejestr
narzędzi AI jako architektoniczny domyślny od Etapu 1, z zastrzeżeniem o kolejności "opis na
końcu" przeniesionym 1:1 z propozycji). Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: BŁĄD — równoległe uruchomienie wielu subagentów wyczerpało limit sesji API szybciej niż praca sekwencyjna

Szczegóły: Duży mechaniczny rollout (114 plików, ta sama transformacja `useState` →
`usePersistedDraft` w każdym) podzielony na 8 batchy po ~15 plików, uruchomionych jako 8
niezależnych agentów w tle RÓWNOCZEŚNIE (jedno wywołanie narzędzia z 8 blokami). Wszystkie 8
padło w trakcie pracy na błąd 429 "session limit" — konto wyczerpało limit zanim którykolwiek
agent skończył, zostawiając 75 ze 114 plików przekonwertowanych, resztę trzeba było dokończyć
bezpośrednio (bez kolejnych subagentów, żeby nie powtórzyć błędu). Koszt: przerwana praca,
dodatkowa runda diagnozy (`pnpm typecheck`/`lint` na częściowym stanie, żeby upewnić się, że
żaden agent nie zostawił pliku w połowie edycji) zanim dokończenie było możliwe.

Dlaczego warto zgłosić do new-app-standards: 8 subagentów naraz, każdy robiący dziesiątki
wywołań API w krótkim czasie, może wyczerpać limit sesji konta znacznie szybciej niż ta sama
praca rozłożona sekwencyjnie/mniejszymi turami — to nieoczywiste, bo intuicyjnie
"równoległe = szybsze i bezpieczniejsze". Dla zadań w pełni mechanicznych (bez potrzeby
kreatywnej oceny per plik, jak w tym przypadku) sekwencyjna praca bezpośrednia bywa
bezpieczniejsza niż orkiestracja wielu subagentów. Rekomendacja: standard powinien zawierać
wytyczną o rozsądnym limicie równoległych subagentów (np. 2-4 na raz) dla dużych mechanicznych
rolloutów, z sugestią sprawdzenia typecheck/lint na częściowym stanie przed kontynuacją, gdyby
któryś padł w trakcie.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/15-wspolpraca-z-ai.md` 15.20 — limit 2-4
równoległych subagentów dla dużych mechanicznych rolloutów). Zweryfikowane wprost w treści rozdziału.

---

[20.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — autosave draftu formularza powinien być architektonicznym domyślnym od pierwszego ekranu, nie dobudowywanym reaktywnie po zgłoszeniu

Szczegóły: W tym projekcie autosave (`usePersistedDraft`, zapis draftu formularza do
IndexedDB przy każdej zmianie) powstał 15.09.2026 — dopiero po tym, jak użytkownik zgłosił
realną utratę danych (przeglądarka mobilna odświeżyła kartę w tle, formularz wrócił pusty).
Do tego dnia zbudowano już ~90 ekranów kalkulatorów zwykłym `useState`, bez żadnej persystencji
— wszystkie wymagały późniejszego, osobnego zadania konwersji (114 plików, jedna sesja, viz.
powiązany wpis BŁĄD wyżej o nowym wzorcu nie stosowanym retroaktywnie — to jest jego pierwotna
przyczyna: gdyby autosave był domyślny od Ekranu 1, tamten błąd w ogóle nie mógłby powstać).
Koszt: dziesiątki ekranów budowanych dwa razy (raz bez autosave, raz z konwersją), zamiast raz
z automatycznym mechanizmem od początku.

Dlaczego warto zgłosić do new-app-standards: to nie specyfika tego projektu — **każda** aplikacja
offline-first z formularzami wielopolowymi (dokładnie profil całej rodziny "Inżynier Pro", patrz
`docs/standards/05-baza-danych-offline.md`, "Seed nie Wynik") ma ten sam ryzyko: użytkownik traci
wpisane dane przy odświeżeniu/zamknięciu karty, zanim ktoś to zgłosi jako bug. To przewidywalne
z góry, nie coś, co trzeba było odkryć w praktyce. Rekomendacja dwuczęściowa:
1. **Architektoniczna:** standard (rozdział 05 lub 03-jądro-obliczeniowe) powinien wymagać, żeby
   każdy nowy projekt rodziny miał gotowy, generyczny hook/wzorzec autosave draftu formularza
   (Seed → `StorageAdapter`, debounce'owany zapis, async odczyt przy montowaniu) **zbudowany
   razem ze szkieletem architektury (Etap 1), zanim powstanie pierwszy ekran kalkulatora** — nie
   jako osobne zadanie dobudowywane później per zgłoszenie. Ten sam hook/wzorzec używany od
   pierwszego dnia przez KAŻDY nowy ekran z polami formularza, bez wyjątków.
2. **Procesowa (uzupełnienie wcześniejszego wpisu o kopiowaniu nieaktualnych szablonów):** dopóki
   punkt 1 nie jest jeszcze zaimplementowany w danym projekcie, standard/`CLAUDE.md` powinien
   jawnie nakazywać: przed napisaniem nowego ekranu/pliku wg istniejącego wzorca, AI **musi**
   sprawdzić `docs/memory.md`/`docs/standards/` pod kątem najnowszej, aktualnej wersji tego
   wzorca — nigdy nie kopiować z pamięci/z najbliższego przykładu w kodzie bez tej weryfikacji,
   nawet w obrębie tej samej sesji. Powtarzalny koszt tego zaniedbania (ten projekt: 8 nowych
   modułów zbudowanych bez autosave w tej samej sesji, w której autosave już istniał) pokazuje,
   że "AI pamięta niedawno ustalony wzorzec" nie jest wystarczającym zabezpieczeniem — potrzebna
   jest jawna, wymuszona checklista, nie poleganie na pamięci kontekstu.

Status: ✅ skonsolidowane (20.09.2026, `docs/standards/05-baza-danych-offline.md` 5.7 — autosave
draftu formularza jako architektoniczny domyślny od Etapu 1, ten sam wzorzec co 17.1a).
Zweryfikowane wprost w treści rozdziału.
