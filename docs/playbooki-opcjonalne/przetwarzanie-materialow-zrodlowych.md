# Playbook opcjonalny — Przetwarzanie materiałów źródłowych (normy, PDF, skany, .doc/.docx)

> **Status: moduł opcjonalny pakietu (GOD BOOK Część Y.10), nie obowiązkowy rozdział `docs/standards/`.**
> Dodawany do projektu tylko wtedy, gdy projekt przetwarza dostarczone dokumenty normatywne/branżowe
> (normy PN/IEC/EN/HD, specyfikacje, materiały szkoleniowe) jako podstawę kalkulatorów/silników
> domenowych. Projekty spoza tej podrodziny (np. farmer360.io, zero-waste) nie potrzebują tego pliku
> i nie dostają go przy zwykłej synchronizacji Y.9.
>
> Źródło: projekt inzynier-offgrid-pro, zebrane przez GOD BOOK U.4, 06.09.2026. Wypracowane w praktyce
> przy przetwarzaniu ~10 dokumentów źródłowych (normy PN/IEC/EN/HD, materiały branżowe) w formatach
> PDF natywny, PDF-skan, stary binarny `.doc` (Word 95/97) i `.docx`.

> **[07.10.2026] ✅ DODANO** — rozszerzenie (temat 7 przeglądu U.4, decyzja właściciela repo): wzory/tablice/wykresy
> zawsze z renderu strony (Krok 1B, 2), trzecia metoda „odczyt bezpośredni” (Krok 1A), kontrola MD5 i kompletności
> indeksu (Krok 0, 5), nowsze wydanie normy i status w kodzie (Krok 4), Krok 6 „dane z rysunku” 🔎. Źródła:
> inzynier-szkieletowy-pro (05–06.10.2026) i inzynier-offgrid-pro (25–29.09.2026). Skrócony PROMPT niżej nie został
> przepisany — przy użyciu dodaj do niego te punkty albo wskaż sesji pełną wersję.

Instrukcja operacyjna: co robić, gdy właściciel projektu dostarcza dokument źródłowy (normę, materiał
branżowy/szkoleniowy, specyfikację), który ma trafić do `docs/zrodla/` (Część B.5 GOD BOOK) i być użyty
jako podstawa kodu kalkulatora. Napisana tak, żeby dało się ją dać nowej sesji AI bez tłumaczenia od
nowa — self-contained, z konkretnymi komendami.

---

## PROMPT — gotowy do skopiowania i przekazania sesji pracującej nad projektem, który tego potrzebuje

> Ten blok jest samodzielny i skrócony (bez uzasadnień/przykładów poniżej) — do wklejenia wprost jako
> pierwsza wiadomość nowej sesji AI.

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

---

## Pełna wersja robocza (z uzasadnieniami i przykładami)

**Zasada nadrzędna, z której wynika cała reszta:** dla aplikacji liczącej twarde fakty fizyczne
(rozdz. `00-filozofia.md` Standardu) żadna liczba bezpieczeństwa-krytyczna nie trafia do dokumentacji
ani kodu bez faktycznego sprawdzenia w źródle — nigdy z pamięci/wiedzy ogólnej, nawet jeśli wartość
wydaje się "dobrze znana branżowo".

### Krok 0 — rozpoznaj format i zdecyduj o metodzie

```bash
file "<ścieżka>"                    # typ pliku
python3 -c "
import pypdfium2 as pdfium
pdf = pdfium.PdfDocument('<ścieżka.pdf>')
print('pages:', len(pdf))
for i in [0, len(pdf)//2, len(pdf)-1]:
    t = pdf[i].get_textpage().get_text_range()
    print(i, 'chars:', len(t))
"
```

- **Przed dodaniem pliku do `docs/zrodla/`: `md5sum` i porównanie z plikami już w repo** (`md5sum docs/zrodla/*/*`).
  [07.10.2026] ✅ DODANO — źródło: offgrid 27.09.2026: materiał opisany jako „może inna edycja” był bajt-w-bajt
  identyczny z plikiem już w repo (22,5 MB duplikatu i fałszywe zadanie „porównaj treść”).
- **0 znaków na każdej sprawdzonej stronie → to skan.** Idź do Kroku 1A (OCR).
- **Setki/tysiące znaków → natywny tekst.** Idź do Kroku 1B.
- **Plik `.doc` (Composite Document File, Word 95/97 binarny)** → Krok 1C.
- **Plik `.docx`** (współczesny, albo konwersja z `.pptx`) → Krok 1D.
- **Liczba stron ≤ ok. 20-25 i dokument ma być czytany raz** → rozważ ominięcie automatycznej
  ekstrakcji i użycie narzędzia `Read` z parametrem `pages` bezpośrednio (odczyt wizualny) — dla
  krótkich dokumentów bywa szybsze i równie pewne jak pełny pipeline, o ile i tak planujesz
  wizualnie zweryfikować tabele (patrz Krok 2).

**Nazwa pliku nie jest dowodem treści. 🔎** [07.10.2026] ✅ DODANO jako 🔎 — źródło: inzynier-szkieletowy-pro (U.4 07.10.2026, D182; gałąź niescalona z `main`, odczyt tylko do odczytu). Przed użyciem pliku z serwisu ze skryptami (Studocu i podobne) do porównań otwórz go i sprawdź, czy treść jest tym, co sugeruje nazwa: „PN-EN 338” okazał się rozdziałem podręcznika ze starymi klasami K i tabelą „wg PN-EN 338:2004”, a nie tablicą normy; „PN-EN 12831” to projekt do zatwierdzenia z 2006, nie wersja finalna. W `00-INDEKS.md` źródła zapisz **status i pochodzenie** (norma / projekt normy / materiał wtórny, wydanie), a źródła niepełnego lub wtórnego nie używaj jako wzorca do porównań stałych, dopóki tego pola nie ma. Podobnie przy wpisie „do zrobienia” opartym na numerze punktu: sprawdź w tekście, **do której normy** punkt należy (w jednym indeksie numery załączników dwóch norm zostały przypisane jednej).

**Nazwa wiersza na karcie nie jest dowodem jego znaczenia fizycznego** [16.10.2026, źródło: inzynier-offgrid-pro, U.4 09.10.2026]. Gdy karta nazywa wiersz inaczej niż fizyka (przykład: „maksymalne napięcie zasilania” = Vmp panelu), jawny opis tego, co wiersz naprawdę oznacza, jest **częścią danych w transkrypcji karty**, a nie komentarzem obok — bez niego test transkrypcji (10.10 pkt 7) i relacje fizyczne nie mają do czego się odwołać.

### Krok 1A — PDF będący skanem: OCR

```bash
apt-get install -y poppler-utils tesseract-ocr tesseract-ocr-pol
```

Renderuj wszystkie strony do PNG (300 DPI wystarcza do czytelnego OCR i do późniejszej wizualnej
weryfikacji):

```python
import pypdfium2 as pdfium
pdf = pdfium.PdfDocument('<plik.pdf>')
for i in range(len(pdf)):
    bitmap = pdf[i].render(scale=300/72)
    bitmap.to_pil().save(f'<scratchpad>/images/page_{i:03d}.png')
```

OCR każdej strony:

```bash
tesseract page_NNN.png output -l pol --psm 6
```

**Nie ufaj samemu tekstowi OCR dla żadnej liczby, która trafi do kodu lub dokumentacji.** Traktuj
go jako roboczy szkic do dalszej weryfikacji (Krok 2).

**Równoległy OCR:** `tesseract` uruchamiany równolegle wymaga `OMP_THREAD_LIMIT=1` (inaczej wątki wzajemnie się
spowalniają). [07.10.2026] ✅ DODANO — źródło: offgrid 27.09.2026.

**Metoda C — odczyt bezpośredni z renderu stron (gdy OCR niedostępny albo zbędny).** Skan bez warstwy tekstowej i
środowisko bez `tesseract` nie blokują pracy: wyrenderuj każdą stronę (`pdftoppm -r 150` do czytania, powiększenie
do stałych i indeksów) i przeczytaj wprost narzędziem `Read`; wzory i tablice przepisz z obrazu. Odnotuj tę metodę w
`00-INDEKS.md` źródła tak samo jak OCR. Zaleta: weryfikacja wizualna jest spełniona z definicji dla całości, nie tylko
dla tablic. Skan o niskiej rozdzielczości (90 dpi) nie odróżnia np. 237,5 od 237,3 — stałe czytaj z powiększenia.
Kontrola krzyżowa: tam, gdzie wydawca opublikował ten sam fakt drugim, niezależnym dokumentem (np. stawki netto i
brutto), odtwórz jedno z drugiego (netto × VAT = brutto) i zapisz wynik jako test. [07.10.2026] ✅ DODANO — źródło:
szkieletowy 06.10.2026, offgrid 29.09.2026.

### Krok 1B — PDF z natywnym tekstem

Ekstrakcja per strona (`pdf[i].get_textpage().get_text_range()`) albo odczyt wizualny narzędziem
`Read` z `pages`. Nawet natywny tekst PDF-a potrafi rozjechać układ kolumn w tabelach
wielokolumnowych przy linearyzacji (kolejność komórek "z lewej do prawej, z góry na dół" gubi
informację, która wartość należy do której kolumny) — dla tabel liczbowych i tak zweryfikuj
wizualnie układ kolumn przed przepisaniem (Krok 2), nawet gdy nie ma ryzyka błędu OCR.

**Wzory i tablice wyłącznie z renderu strony — także przy tekście natywnym.** [07.10.2026] ✅ DODANO — źródło:
szkieletowy 05.10.2026, offgrid 25–27.09.2026. Tekst natywny rozbija wykładniki na osobne linie (wzór z kwadratem
wygląda jak bez kwadratu), gubi znaki relacji (`<`, `≥`), czcionka symbolowa myli „+” i „−”, a tablica obrócona o 90°
traci λ, µ, ρ. Tekst służy wyłącznie do wyszukiwania numerów punktów. Opracowania branżowe (nie norma) mają własne
błędy merytoryczne (brak kwadratu, zły nagłówek grupy, literówka w µ) — oznaczaj ⚠️ i weryfikuj z normą nadrzędną.

### Krok 1C — stary binarny `.doc` (Word 95/97)

LibreOffice/`soffice --convert-to` regularnie **odmawia otwarcia** tego formatu ("source file could
not be loaded") — nie trać na to czasu, przejdź od razu do:

```bash
apt-get install -y antiword wv
```

Tekst z poprawnym kodowaniem polskich znaków (kluczowe: **jawna mapa znaków**, inaczej wychodzi
mojibake typu "bezpieczeñstwa" zamiast "bezpieczeństwa" — sprawdź realne kodowanie przez
`file plik.doc`, zwykle cp1250):

```bash
antiword -m 8859-2.txt plik.doc > plik-iso.txt
iconv -f ISO-8859-2 -t UTF-8 plik-iso.txt > plik-utf8.txt
```

Dla realnej struktury tabel (antiword renderuje je jako niepewny ASCII-art, który potrafi zgubić
komórki przy zawijaniu tekstu) i do odzyskania osadzonych obrazów (wzory matematyczne, drobne
diagramy, wstawione jako WMF):

```bash
wvHtml plik.doc plik.html   # generuje też pliki .wmf obok
apt-get install -y libwmf-bin
wmf2gd -o obrazek.png obrazek.wmf   # WMF → PNG do odczytu wizualnego
```

Jeśli `wvHtml` zgłasza `StrangeNoGraphicData` dla jakiegoś `<img>` — to obiekt OLE, którego nie da
się odzyskać tymi narzędziami (często duże tabele wklejone jako obraz/obiekt). Sprawdź w tekście,
czy dokument w ogóle zawiera potrzebną tabelę, zanim założysz, że tylko trzeba ją "odzyskać" — bywa,
że w tym konkretnym pliku jej po prostu nie ma (np. "Wyciąg" = świadomie skrócone tłumaczenie).

### Krok 1D — `.docx` (natywny albo konwersja z `.pptx`)

[07.10.2026] ✅ DODANO — źródło: offgrid 27.09.2026: czytaj **akapity razem z tabelami**; sama iteracja `.tables` pomija treść akapitów.

```bash
pip install python-docx
python3 -c "
import docx
d = docx.Document('plik.docx')
print('paragraphs:', len(d.paragraphs), 'tables:', len(d.tables))
for i, t in enumerate(d.tables):
    print(f'=== TABLE {i} ({len(t.rows)}x{len(t.columns)}) ===')
    for row in t.rows:
        print(' | '.join(c.text.strip().replace(chr(10),' / ') for c in row.cells))
"
```

Tabele realne w oryginalnym dokumencie (Word/PowerPoint) wychodzą jako czysty, wiarygodny tekst —
lepszy punkt wyjścia niż odczyt wizualny, bo nie ma ryzyka błędnego odczytu znaku. **Ale**: diagramy
narysowane kształtami/SmartArt (typowe dla prezentacji — schematy blokowe, drzewa decyzyjne)
konwertują się na tabele z **pustymi komórkami** (treść żyła w kształtach, nie w komórkach) — nie
traktuj pustej tabeli jako braku treści, sprawdź czy dana informacja nie jest opisana równoważnie w
tekście akapitów w innym miejscu tego samego dokumentu (`d.paragraphs`).

Jeśli właściciel projektu dostarczy `.docx` **tej samej treści**, którą już przetworzyłeś z PDF — nie
powtarzaj całej analizy automatycznie. Wyciągnij tabele/tekst z `.docx` i porównaj z tym, co już
masz udokumentowane: jeśli się zgadza, to tylko dodatkowe potwierdzenie (warto odnotować w
`docs/memory.md` jako "potwierdzone niezależną metodą", nie trzeba nic zmieniać); jeśli `.docx` ma
więcej/dokładniej (częsty przypadek dla list/tabel, które w PDF trzeba było czytać wizualnie z
ograniczeniem miejsca) — uzupełnij istniejący plik, nie twórz duplikatu dokumentacji.

### Krok 2 — weryfikacja: zasada dla każdej liczby bezpieczeństwa-krytycznej

**Jeden spot-check jednej strony/tabeli nie wystarcza**, nawet jeśli nie znalazł błędów — błędy typu
"cała kolumna/wiersz zniknęły" są niewidoczne bez sprawdzenia każdej strony osobno (nie wyglądają
jak błąd, po prostu jest mniej liczb niż powinno). Dla całego załącznika z tabelami:

1. Wyrenderuj strony do obrazu (jeśli jeszcze nie zrobione, patrz Krok 1A).
2. Przejdź **każdą** stronę tabeli — nie próbkę — porównując bezpośredni odczyt obrazu z tekstem
   uzyskanym w Kroku 1, komórka po komórce, licząc również, czy liczba kolumn/wierszy się zgadza
   (nie tylko czy widoczne cyfry są poprawne).
3. Dla dużej liczby stron: rozdziel na kilka równoległych subagentów (Agent tool), po ~5 stron
   każdy, z jednoznaczną instrukcją: czytać obraz bezpośrednio (nie ufać dostarczonemu tekstowi),
   zgłosić każdą rozbieżność z dokładną lokalizacją (strona, tabela, wiersz, kolumna, wartość z
   tekstu vs wartość z obrazu), oraz **jawnie napisać "strona NN: brak rozbieżności"** dla stron bez
   błędów (żeby nie było niejasne, czy strona została w ogóle sprawdzona).
4. Napraw znalezione błędy bezpośrednio w pliku dokumentacji, z komentarzem `[DATA — TRANSKRYPCJA
   POPRAWIONA]` przy większych poprawkach (całe tabele przepisane na nowo) — żeby było widać, że to
   nie jest oryginalny tekst źródła.
5. Jeśli tabela/rozdział nie został poddany tej pełnej weryfikacji (bo np. nie był jeszcze potrzebny
   do żadnego kalkulatora) — napisz to wprost w `00-INDEKS.md` tego źródła: co jest zweryfikowane w
   pełni, co tylko wstępnie/punktowo. Nie zostawiaj czytelnika w przekonaniu, że "OCR ogólnie jest
   OK" na podstawie sprawdzenia jednej strony.

6. **Typowe przekłamania — checklista dla każdej strony:** `≥`/`≤` czytane jako `2`/`<`; litery greckie (β → „fi”/„13”,
   ψ, λ, µ, ρ); utracone wykładniki i indeksy; gubione pojedyncze słowa i całe wiersze/kolumny tablic (np. wiersz
   krajowego załącznika dla jednej strefy); strona poprawki z zepsutą warstwą tekstu (losowe znaki). Pierwszy OCR
   „dobrej jakości” po spot-checku nie jest dowodem — liczy się pełne przejście (zasada u góry Kroku 2).
   [07.10.2026] ✅ DODANO — źródło: offgrid 25.09.2026, szkieletowy 05.10.2026.
7. **Wykres, z którego bierzemy liczby** (nomogram, krzywa): weryfikuj na wyrenderowanym obrazie strony i zapisz w
   ekstrakcji **kształt całej krzywej** — odcinki stałe, punkty końcowe, zakres — nie tylko podpisane równania.
   Elementy bez podpisu znikają z warstwy tekstowej (w opisanym przypadku niepodpisane poziome odcinki Δp(θe) poniżej
   0 °C zniknęły, a przez trzy decyzje aplikacja pytała właściciela o „zatwierdzenie” czegoś, co było narysowane w
   źródle). [07.10.2026] ✅ DODANO — źródło: szkieletowy 06.10.2026.
8. **Duże tablice do kodu: skrypt „kod ↔ źródło” zamiast przepisywania na oko.** Wartości wyjęte do JSON-a (z tekstu
   lub z odczytu), drugi skrypt porównuje stałą w kodzie z JSON-em (przykład: 76 detali × 3 wartości = 228 liczb, 0
   rozbieżności). Znaki relacji ginące w ekstrakcji rozstrzyga przykład liczbowy ze źródła jako test. Formatera
   (prettier itp.) używaj tylko z konfiguracją w repo — bez niej diff zapełnia szum.
   [07.10.2026] ✅ DODANO — źródło: offgrid 27.09.2026.

### Krok 3 — struktura dokumentacji w `docs/zrodla/`

Jeden folder na jeden dokument źródłowy:

- **Formalna norma (PN-/IEC/EN/HD z numerem)** → `docs/zrodla/norma-<OZNACZENIE>/`, np.
  `norma-PN-HD-60364-5-52/`.
- **Materiał branżowy/szkoleniowy, NIE norma** (artykuł ekspercki, prezentacja, dodatek do
  czasopisma) → `docs/zrodla/materialy-branzowe-<TEMAT>-<ROK>/` — nazwa folderu musi jasno sugerować
  "to nie jest norma", żeby nikt później nie pomylił statusu prawnego.

W każdym folderze:
- oryginalny plik(i) źródłowy — bez zmian treści, kopia 1:1 tego co dostarczył właściciel projektu;
- `00-INDEKS.md` — obowiązkowo zawiera: metodę ekstrakcji użytą (i czy to OCR czy tekst natywny —
  wpływa na poziom zaufania), mapę pozostałych plików rozdziałów, **zastrzeżenie o jakości źródła**
  jeśli dotyczy (OCR, wyciąg/fragment zamiast pełnego tekstu, tłumaczenie maszynowe), status
  wykorzystania w projekcie (przeanalizowany / częściowo zweryfikowany / w pełni zweryfikowany /
  użyty w którym kalkulatorze);
- pliki treści (`01-...md`, `zalacznik-X-...md`) — pogrupowane wg struktury oryginału (rozdziały/
  klauzule normy, nie sztywno wg granic stron, chyba że oryginał i tak jest podzielony 1:1 na strony
  jak skan tabel).

### Krok 4 — zasady nadrzędne przy niepełnych/sprzecznych źródłach

- **Brakujące dane (tabela nie istnieje w dostarczonym pliku)** — nie wymyślaj wartości, nawet
  "dobrze znanych" ogólnie w branży. Napisz to wprost w `00-INDEKS.md` jako krytyczne zastrzeżenie.
- **Dwie wersje tej samej normy z różnymi wartościami** — rozróżnij dwa przypadki:
  - Jeśli materiał **sam jednoznacznie mówi**, która wersja jest aktualna/obowiązująca (np. slajd
    podpisany "norma nieaktualna" obok slajdu "norma aktualna", z podanymi datami/numerami wydań) —
    to nie jest sprzeczność do zgłaszania właścicielowi projektu, tylko prosta relacja
    starsza→nowsza wersja. Zapisz obie (starą jako kontekst historyczny, nową jako tę do stosowania
    w kodzie), rozstrzygnij samodzielnie, odnotuj w `docs/memory.md`.
  - Jeśli **nie ma jednoznacznego wskazania**, która wersja obowiązuje, albo to nie jest kwestia
    starzenia się normy tylko realna merytoryczna rozbieżność (np. dwa różne krajowe załączniki
    podają różne wartości dla tego samego parametru) — **nie rozstrzygaj sam**, pokaż A/B i zapytaj.
- **Niespójność wewnątrz normy** (zapis sprzeczny z jej własnymi przykładami albo z praktyką; np. Rsi 0,25 w tekście
  a 0,13 w przykładach): krok 1 to sprawdzenie, czy istnieje nowsze wydanie, i przeczytanie jego publicznego
  podglądu (strona katalogu dystrybutora, darmowe próbki; podgląd na stronie bywa dłuższy niż próbka PDF). Cytat i
  adres zapisz w `docs/zrodla/<norma>-fragment/` z oznaczeniem „fragment”; dopiero potem eskaluj do zakupu. Przy
  ekstrakcji wzoru wraz z odwrotnością i tablicą sprawdź, czy wszystkie trzy są zgodne, a niezgodność zgłoś
  właścicielowi zamiast cicho wybierać. Rozbieżności w tekście wydawcy danych (liczba stacji, numer) weryfikuj
  drugim źródłem (np. nagłówki pobranych plików). [07.10.2026] ✅ DODANO — źródło: szkieletowy 06.10.2026.
- **Status „zgodne/rozbieżne” z wcześniejszego indeksu źródła nie jest dowodem.** Porównanie z kodem rób za każdym
  razem w kodzie (`grep` stałej); nieaktualny wpis w starym indeksie oznacz datowaną notką („[data] nieaktualne —
  rozwiązane D#”), nie kasuj. [07.10.2026] ✅ DODANO — źródło: szkieletowy 05.10.2026.
- **Przykład źródła, który liczbowo pasuje do reguły z innego modułu, nie dowodzi, że reguła obowiązuje.** Przykład
  „kominek 8 kW + bufor 400 l” zgadza się z regułą 50 l/kW, ale źródło podaje ją wyłącznie dla pompy ciepła —
  nie przenoś współczynnika na inne urządzenie bez podstawy w źródle. [07.10.2026] ✅ DODANO — źródło: offgrid 28.09.2026.
- **Dokument dostarczony jako "najważniejsze rozwiązanie X", a po analizie okazuje się fragmentem
  bez treści technicznej (sam spis treści, sama bibliografia)** — powiedz to wprost, nie udawaj że
  problem jest rozwiązany dlatego że plik "jest już w repo".

### Krok 5 — po ekstrakcji: aktualizacja i commit

1. Zaktualizuj `docs/zrodla/README.md` — nowa sekcja z datą, źródłem, jednym-dwoma zdaniami co
   dokument wnosi, statusem wykorzystania.
2. Zaktualizuj `docs/memory.md` — wpis "Decyzje i uzasadnienie" z: co dodano, jaką metodą, jakie
   znaleziska (błędy, luki, rozbieżności), jaka decyzja podjęta i dlaczego. To jest główne miejsce,
   które pozwala kolejnej sesji nie zgadywać, co się wydarzyło.
3. Uruchom weryfikację projektu nawet dla zmian samego `docs/` (tania, szybka pewność że nic się nie
   zepsuło): testy/lint/typecheck zgodnie ze stackiem projektu.
4. `git add` tylko plików faktycznie dotyczących tej zmiany (nowe źródło + dokumentacja +
   `README.md`/`memory.md`) — nie `git add -A` w ciemno.
5. Commit z opisowym komunikatem (co dodano, jaka metoda, jakie krytyczne znaleziska) + push na
   branch roboczy.
6. **Kontrola kompletności folderu źródeł:** `00-INDEKS.md` każdego źródła wymienia z nazwy każdy plik folderu
   (skrypt, nie ręczny grep), a metryk (liczba stron, liczba tablic) nie wpisuje się bez otwarcia pliku. Źródło
   „dodane, nieprzeczytane” z wpisem 🔲 „dokończyć odczyt” potrafi wisieć bez końca, bo przegrywa z zadaniami
   kodowymi. [07.10.2026] ✅ DODANO — źródło: offgrid 27.09.2026.

### Krok 6 — dane z rysunku w normie (mapa, nomogram) 🔎

[07.10.2026] ✅ DODANO jako 🔎 (jeden projekt, wzorzec jeszcze nieprzećwiczony drugi raz) — źródło: szkieletowy
06.10.2026 (D177). Gdy dane istnieją w normie wyłącznie jako rysunek (np. mapa stref), a otwartej tabeli brak:

1. Skrypt powtarzalny w repo (nie ręczna obróbka): render PDF → rozmycie przeciw półtonom → segmentacja (grube linie
   albo jasność) → georeferencja wielomianem z punktów kontrolnych (np. kropki miast) → siatka (tam 0,05°) z flagą
   „pas przy granicy stref”.
2. Wynik niesie **jawną dokładność**; testy na punktach o znanym wyniku; punkty kontrolne niepasujące po resztach
   odrzucaj.
3. Pułapki: wielomian nie ekstrapoluje (błąd ok. 10 km na brzegu mapy); „odległość do granicy” nie może liczyć
   granicy państwa; mapa o trzech klasach jasności nie rozróżnia stref zakodowanych jednym kolorem — UI mówi to
   jawnie i zostawia wybór człowiekowi, a wynik poza pewnością ma status 🔎/`ESTIMATE` (standard 3.3, 3.7).

4. **Pochodzenie rysunku jest częścią danych. 🔎** [07.10.2026] ✅ DODANO jako 🔎 — źródło: inzynier-szkieletowy-pro (U.4 07.10.2026, D181–D183, gałąź niescalona z `main`; odczyt tylko do odczytu). Gdy mapa jest dostępna tylko jako zrzut z materiału wtórnego (np. producenta, „na podstawie [20]”), wartości mogą być normowe, ale rysunek nie jest: oznacz to jako „materiał wtórny, nie norma” w interfejsie i w `00-INDEKS.md` źródła.
5. **Zweryfikuj zdigitalizowaną mapę drugim, niezależnym źródłem.** Porównanie liczbowe z drugą mapą lub tablicą (w jednym przypadku klimat zgodny w 96,8 % z niezależną mapą z normy), lista klas z normy kontra klas w danych i **zakaz scalania klas, których segmentacja nie rozdziela**: siatka śniegowa scaliła strefy 3/4/5 w „3”, co zaniżało obciążenie w NE i Tatrach, czyli po stronie niebezpiecznej, i wyszło dopiero przy ponownej cyfryzacji. Klasa, której nie da się rozróżnić, ma status niepewności (`ESTIMATE`), a nie wartość z najbliższej rozróżnialnej klasy.
6. **Skrypt jest idempotentny, a test to pilnuje.** Ponowne uruchomienie na tych samych danych nie zmienia wyniku (kody pasa granicznego nie degradują stref). Pomocne przy georeferencji: wielomian 2. stopnia z członem symetrycznym (bez niego degeneracja) i poligony ręcznie wg grubych linii. Pułapki narzędziowe: `binary_dilation(iterations=0)` w scipy powtarza do ustabilizowania, a nie „zero razy” (chroń warunkiem); przerwy w cienkich liniach powodują wyciek flood-fill (pomaga pogrubienie linii zależne od rozmiaru strefy i tryb „tylko ziarno” dla małych stref).

## Ściągawka narzędzi (do zainstalowania w świeżym środowisku)

| Potrzeba | Pakiet/narzędzie |
|---|---|
| Renderowanie stron PDF do obrazu | `pypdfium2` (Python) |
| OCR skanów | `tesseract-ocr` + `tesseract-ocr-pol` |
| Render PDF → PNG z linii poleceń | `poppler-utils` (`pdftoppm`) |
| Stary binarny `.doc` → tekst | `antiword` (z jawną mapą znaków `-m 8859-2.txt`) |
| Stary binarny `.doc` → HTML+obrazy | `wv` (`wvHtml`) |
| Konwersja WMF → PNG | `libwmf-bin` (`wmf2gd`) |
| `.docx` → tekst/tabele | `pip install python-docx` |

## Relacja z resztą pakietu

Ten playbook wypełnia operacyjną lukę pod Częścią B.5 GOD BOOK (`docs/zrodla/`, materiały źródłowe
tylko do odczytu) — B.5 mówi *co* tam trzymać i *że* jest nietykalny, nie mówi *jak* dojść od
dostarczonego pliku (skan/`.doc`/`.docx`) do zweryfikowanej treści w `docs/zrodla/`. Zobacz też
[`../biblioteka-norm/`](../biblioteka-norm/) — moduł opcjonalny współdzielenia już przetworzonych
norm między projektami, żeby ta procedura nie musiała być powtarzana od zera dla tej samej normy w
kolejnym projekcie rodziny.
