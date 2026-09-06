# PROPOZYCJA dla `new-app-standards` — Przetwarzanie materiałów źródłowych (normy, PDF, skany, .doc/.docx)

> **Status: propozycja, nie standard.** Ten plik to pełny szkic roboczy powiązany ze zgłoszeniem w
> `docs/wklad-do-standardu.md` (wpis z 06.09.2026). **Nie jest częścią `docs/standards/`** i nie ma
> mocy obowiązującej — konsolidacja i decyzja o promocji do faktycznej reguły standardu dzieje się
> wyłącznie w sesji pracującej bezpośrednio nad repo `new-app-standards` (GOD BOOK Część Y.8). Ten
> plik istnieje wyłącznie po to, żeby ta przyszła sesja miała gotowy materiał do oceny, zamiast
> odtwarzać go od zera z historii czatu.

Instrukcja operacyjna: co robić, gdy użytkownik dostarcza dokument źródłowy (normę PN/IEC/EN,
materiał branżowy/szkoleniowy, specyfikację), który ma trafić do `docs/zrodla/` i być użyty jako
podstawa kodu kalkulatora. Napisana tak, żeby dało się ją dać nowej sesji AI bez konieczności
tłumaczenia od nowa — self-contained, z konkretnymi komendami.

**Zasada nadrzędna, z której wynika cała reszta:** to aplikacja licząca twarde fakty fizyczne
(`docs/standards/00-filozofia.md`). Żadna liczba bezpieczeństwa-krytyczna nie trafia do dokumentacji
ani kodu bez faktycznego sprawdzenia w źródle — nigdy z pamięci/wiedzy ogólnej, nawet jeśli wartość
wydaje się "dobrze znana branżowo".

## Krok 0 — rozpoznaj format i zdecyduj o metodzie

Zanim zaczniesz ekstrakcję, sprawdź co masz:

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

- **0 znaków na każdej sprawdzonej stronie → to skan.** Idź do Kroku 1A (OCR).
- **Setki/tysiące znaków → natywny tekst.** Idź do Kroku 1B.
- **Plik `.doc` (Composite Document File, Word 95/97 binarny)** → Krok 1C.
- **Plik `.docx`** (współczesny, albo konwersja z `.pptx` zrobiona przez użytkownika) → Krok 1D.
- **Liczba stron ≤ ok. 20-25 i dokument ma być czytany raz** → rozważ ominięcie automatycznej
  ekstrakcji i użycie narzędzia `Read` z parametrem `pages` bezpośrednio (odczyt wizualny) — dla
  krótkich dokumentów bywa szybsze i równie pewne jak pełny pipeline, o ile i tak planujesz
  wizualnie zweryfikować tabele (patrz Krok 2).

## Krok 1A — PDF będący skanem: OCR

Zainstaluj narzędzia, jeśli ich nie ma (nie zakładaj, że są — w świeżym środowisku zwykle nie ma
żadnego z nich):

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

## Krok 1B — PDF z natywnym tekstem

Ekstrakcja per strona (`pdf[i].get_textpage().get_text_range()`) albo odczyt wizualny narzędziem
`Read` z `pages`. Nawet natywny tekst PDF-a potrafi rozjechać układ kolumn w tabelach
wielokolumnowych przy linearyzacji (kolejność komórek "z lewej do prawej, z góry na dół" gubi
informację, która wartość należy do której kolumny) — dla tabel liczbowych i tak zweryfikuj
wizualnie układ kolumn przed przepisaniem (Krok 2), nawet gdy nie ma ryzyka błędu OCR.

## Krok 1C — stary binarny `.doc` (Word 95/97)

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

## Krok 1D — `.docx` (natywny albo konwersja z `.pptx`)

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

Jeśli użytkownik dostarczy `.docx` **tej samej treści**, którą już przetworzyłeś z PDF — nie
powtarzaj całej analizy automatycznie. Wyciągnij tabele/tekst z `.docx` i porównaj z tym, co już
masz udokumentowane: jeśli się zgadza, to tylko dodatkowe potwierdzenie (warto odnotować w
`docs/memory.md` jako "potwierdzone niezależną metodą", nie trzeba nic zmieniać); jeśli `.docx` ma
więcej/dokładniej (częsty przypadek dla list/tabel, które w PDF trzeba było czytać wizualnie z
ograniczeniem miejsca) — uzupełnij istniejący plik, nie twórz duplikatu dokumentacji.

## Krok 2 — weryfikacja: zasada dla każdej liczby bezpieczeństwa-krytycznej

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

## Krok 3 — struktura dokumentacji w `docs/zrodla/`

Jeden folder na jeden dokument źródłowy:

- **Formalna norma (PN-/IEC/EN/HD z numerem)** → `docs/zrodla/norma-<OZNACZENIE>/`, np.
  `norma-PN-HD-60364-5-52/`.
- **Materiał branżowy/szkoleniowy, NIE norma** (artykuł ekspercki, prezentacja, dodatek do
  czasopisma) → `docs/zrodla/materialy-branzowe-<TEMAT>-<ROK>/` — nazwa folderu musi jasno sugerować
  "to nie jest norma", żeby nikt później nie pomylił statusu prawnego.

W każdym folderze:
- oryginalny plik(i) źródłowy — bez zmian treści, kopia 1:1 tego co dostarczył użytkownik;
- `00-INDEKS.md` — obowiązkowo zawiera: metodę ekstrakcji użytą (i czy to OCR czy tekst natywny —
  wpływa na poziom zaufania), mapę pozostałych plików rozdziałów, **zastrzeżenie o jakości źródła**
  jeśli dotyczy (OCR, wyciąg/fragment zamiast pełnego tekstu, tłumaczenie maszynowe), status
  wykorzystania w projekcie (przeanalizowany / częściowo zweryfikowany / w pełni zweryfikowany /
  użyty w którym kalkulatorze);
- pliki treści (`01-...md`, `zalacznik-X-...md`) — pogrupowane wg struktury oryginału (rozdziały/
  klauzule normy, nie sztywno wg granic stron, chyba że oryginał i tak jest podzielony 1:1 na strony
  jak skan tabel).

## Krok 4 — zasady nadrzędne przy niepełnych/sprzecznych źródłach

- **Brakujące dane (tabela nie istnieje w dostarczonym pliku)** — nie wymyślaj wartości, nawet
  "dobrze znanych" ogólnie w branży. Napisz to wprost w `00-INDEKS.md` jako krytyczne zastrzeżenie
  (przykład z pracy nad Offgrid Pro: Tablice 41A/41B nieobecne w `PN-IEC 60364-4-41:2000` "Wyciąg"
  — odnotowane, nie zgadywane, dopóki nie znalazło się innego źródła z tą samą tabelą).
- **Dwie wersje tej samej normy z różnymi wartościami** — rozróżnij dwa przypadki:
  - Jeśli materiał **sam jednoznacznie mówi**, która wersja jest aktualna/obowiązująca (np. slajd
    podpisany "norma nieaktualna" obok slajdu "norma aktualna", z podanymi datami/numerami wydań) —
    to nie jest sprzeczność do zgłaszania użytkownikowi, tylko prosta relacja starsza→nowsza wersja.
    Zapisz obie (starą jako kontekst historyczny, nową jako tę do stosowania w kodzie), rozstrzygnij
    samodzielnie, odnotuj w `docs/memory.md`.
  - Jeśli **nie ma jednoznacznego wskazania**, która wersja obowiązuje, albo to nie jest kwestia
    starzenia się normy tylko realna merytoryczna rozbieżność (np. dwa różne krajowe załączniki
    podają różne wartości dla tego samego parametru) — **nie rozstrzygaj sam**, pokaż A/B i zapytaj.
- **Dokument dostarczony jako "najważniejsze rozwiązanie X", a po analizie okazuje się fragmentem
  bez treści technicznej (sam spis treści, sama bibliografia)** — powiedz to wprost, nie udawaj że
  problem jest rozwiązany dlatego że plik "jest już w repo". Przykład z pracy nad Offgrid Pro:
  `UNE-HD 60364-7-712:2017` dostarczony jako rozwiązanie brakującej normy PV, ale zawierał tylko 6
  stron spisu treści i bibliografii — zapisane jawnie jako "praktycznie bezużyteczny w obecnej
  postaci".

## Krok 5 — po ekstrakcji: aktualizacja i commit

1. Zaktualizuj `docs/zrodla/README.md` — nowa sekcja z datą, źródłem, jednym-dwoma zdaniami co
   dokument wnosi, statusem wykorzystania.
2. Zaktualizuj `docs/memory.md` — wpis "Decyzje i uzasadnienie" z: co dodano, jaką metodą, jakie
   znaleziska (błędy, luki, rozbieżności), jaka decyzja podjęta i dlaczego. To jest główne miejsce,
   które pozwala kolejnej sesji nie zgadywać, co się wydarzyło.
3. Uruchom weryfikację projektu nawet dla zmian samego `docs/` (tania, szybka pewność że nic się nie
   zepsuło): `npx tsc --noEmit`, `pnpm lint`, `pnpm test`.
4. `git add` tylko plików faktycznie dotyczących tej zmiany (nowe źródło + dokumentacja +
   `README.md`/`memory.md`) — nie `git add -A` w ciemno.
5. Commit z opisowym komunikatem (co dodano, jaka metoda, jakie krytyczne znaleziska) + push na
   branch roboczy.

## Ściągawka narzędzi (do zainstalowania w świeżym środowisku)

| Potrzeba | Pakiet/narzędzie |
|---|---|
| Renderowanie stron PDF do obrazu | `pypdfium2` (Python, zwykle już jest) |
| OCR skanów | `tesseract-ocr` + `tesseract-ocr-pol` |
| Render PDF → PNG z linii poleceń | `poppler-utils` (`pdftoppm`) |
| Stary binarny `.doc` → tekst | `antiword` (z jawną mapą znaków `-m 8859-2.txt`) |
| Stary binarny `.doc` → HTML+obrazy | `wv` (`wvHtml`) |
| Konwersja WMF → PNG | `libwmf-bin` (`wmf2gd`) |
| `.docx` → tekst/tabele | `pip install python-docx` |

## Gdzie umiejscowić tę regułę w strukturze standardu (propozycja)

Kandydat: nowy rozdział w `docs/standards/` (np. po rozdziale 14 "Proces i pamięć" albo po
rozdziale 02 "Model danych", jako że dotyczy pozyskiwania danych domenowych) — **decyzja o numerze
i dokładnym umiejscowieniu należy do sesji pracującej nad `new-app-standards`**, nie do tej propozycji.
