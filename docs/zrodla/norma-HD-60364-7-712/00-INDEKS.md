# Indeks — UNE-HD 60364-7-712:2017 ("Instalacje elektryczne niskiego napięcia — Część 7-712: Wymagania dotyczące instalacji lub specjalne miejsca — Systemy zasilania energią słoneczną fotowoltaiczną")

## [07.09.2026] ✅ PEŁNY TEKST DOSTARCZONY — sekcja niżej jest HISTORYCZNA (opis wyciągu z 05.09.2026)

Właściciel projektu dostarczył pełny tekst normy (35 stron, hiszpańska wersja UNE, tekst po
hiszpańsku, nie tłumaczenie maszynowe jak poniższy wyciąg) bezpośrednio do repo 06.09.2026 —
`UNE-HD-60364-7-712-2017-pelny-tekst.pdf` w tym katalogu. Przeczytany w całości tego samego dnia i
użyty do przepisania `lib/core/modules/pv/ochrona-stringow/` (M3/Ekran 22) wg §712.431-433
(przedział doboru bezpiecznika, test obowiązkowości ochrony przy Ns>2) i Załącznika B.2
(I_SC_MAX = K1×I_SC_STC, K1=1,25 minimum). Załącznik B.1 (U_OC_MAX) potwierdził bez zmian już
istniejący wzór w `stress-test-mppt` (M3/E5). Pełne uzasadnienie: `docs/memory.md` (2026-09-06/07),
`docs/rejestr-pokrycia.md` (M3/E22).

Sekcja "🔴 KRYTYCZNE OGRANICZENIE" niżej opisywała stan **przed** tą dostawą (tylko wyciąg spisu
treści) — zostaje jako historia (GOD BOOK Część D, "nie usuwamy"), już NIEAKTUALNA co do wniosku
"ten plik NIE odblokowuje żadnego ekranu" i "potrzebny zakup pełnego tekstu": oba stwierdzenia
rozwiązane przez dostawę z 06.09.2026.

---

Źródło (wyciąg, historyczny): `docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-wyciag-spis-tresci-i-bibliografia.pdf`
(6 stron, hiszpańska adopcja HD 60364-7-712:2016, ale tekst w pliku jest **po polsku** — prawdopodobnie
przetłumaczony automatycznie/maszynowo, widoczne błędy tłumaczenia jak "toda część instalacji"
zamiast "całą instalację"). Metoda ekstrakcji: tekst natywny PDF.

## 🔴 KRYTYCZNE OGRANICZENIE — to NIE jest pełny tekst normy, tylko spis treści + bibliografia

Dokument jest jawnie oznaczony "WYCIĄG Z DOKUMENTU UNE-HD 60364-7-712" (widoczne na każdej stronie
jako czerwony nagłówek/stopka). Sprawdzone w całości (6 stron) — zawiera:
- stronę tytułową,
- **indeks/spis treści** (pełna numeracja klauzul 712.1-712.6 + Załączniki A-D),
- **712.1 Przedmiot i zakres zastosowania** (krótki, 1 akapit — sam zakres, bez treści technicznej),
- **712.2 Normy do konsultacji** (pełna lista przywołanych norm, patrz niżej),
- koniec pliku.

**Brakuje całej właściwej treści technicznej**, w tym najważniejszych dla tego projektu fragmentów
zapowiadanych w spisie treści:
- 712.41-712.44 (ochrona przed porażeniem, skutkami termicznymi, przeciążeniami, przepięciami) —
  **konkretne wymagania i wartości liczbowe, zero z nich nie jest w tym pliku**,
  712.431-712.434 (wymagania nadprądowe/zwarciowe dla stringów PV — to jest dokładnie to, czego
  potrzebowałby kalkulator doboru bezpiecznika stringowego, żeby oprzeć się na normie PV
  specyficznej zamiast generycznej 60364-4-43),
- 712.5 (dobór i montaż materiałów — kanały, dozwolone prądy, spadek napięcia w instalacjach PV),
- 712.53 (urządzenia ochronne, SPD, sekcjonowanie i cięcie — bezpośrednio dotyczy String Box/Ekranu
  22 i rozłączników DC/Ekranu 6, M5),
- **Załącznik B (Normatywny) — Obliczenie U_OC MAX i I_SC MAX** — to jest DOKŁADNIE ta metoda
  obliczeniowa, której szukaliśmy dla stringów PV (napięcie otwartego obwodu i prąd zwarcia
  skorygowane o temperaturę — używane już częściowo w module `konfigurator-stringow` tego projektu,
  ale bez formalnego źródła normatywnego) — **nieobecna w tym wyciągu**,
  - Załącznik D (Normatywny) — Specjalne warunki krajowe — nieobecny.

**Wniosek: ten plik NIE odblokowuje żadnego konkretnego ekranu.** Jego jedyna praktyczna wartość to
(a) potwierdzenie, że norma HD 60364-7-712:2016 faktycznie istnieje i ma dokładnie tę strukturę
(użyteczne przy ewentualnym zakupie pełnej wersji), (b) lista norm powołanych (poniżej), które same
w sobie są cennymi tropami do dalszych zakupów.

## 712.1 Przedmiot i zakres zastosowania (jedyny fragment techniczny obecny)

Dotyczy instalacji elektrycznej generatora fotowoltaicznego, od modułu/zestawu modułów PV
połączonych szeregowo (z kablami dostarczonymi przez producenta modułów) aż do instalacji
użytkownika lub punktu zasilania sieci. Zastosowanie do: generatorów zasilających instalację
niepodłączoną do sieci publicznej (**off-grid — bezpośrednio nasz przypadek**); generatorów
równoległych z siecią publiczną; generatorów jako alternatywy dla sieci publicznej; kombinacji
powyższych.

> "Wymagania dla generatorów fotowoltaicznych z bateriami lub innymi metodami przechowywania
> energii są w trakcie badań" — norma (w tej edycji 2016/2017) explicite NIE reguluje jeszcze
> systemów z magazynowaniem energii (baterie) — istotne zastrzeżenie dla systemu off-grid z
> akumulatorami LiFePO4, jak w tym projekcie: ta konkretna norma nie jest (jeszcze, wg tej edycji)
> autorytatywnym źródłem dla części bateryjnej systemu.

## 712.2 Normy do konsultacji (pełna lista — wartościowa sama w sobie)

CLC/TS 50539-12 (SPD dla instalacji PV, w tym DC); EN 50521 (złącza PV — testy i wymagania
bezpieczeństwa); EN 50539-11 (SPD przejściowe dla aplikacji PV, wymagania i testy); **EN 50618**
(kable elektryczne do systemów PV — już wspomniana w materiale branżowym PV 2019); EN 60269-6
(bezpieczniki niskiego napięcia — wkładki do ochrony systemów PV); EN 60529 (stopnie ochrony IP);
seria EN 60670 (skrzynki/osłony dla akcesoriów elektrycznych); EN 60898-2 (wyłączniki automatyczne
AC i DC); EN 60947-2/-3 (aparatura niskonapięciowa — wyłączniki, rozłączniki); seria EN 61439
(zestawy aparatury niskonapięciowej); EN 61557-8 (wykrywanie izolacji dla układów IT); EN 61643-11
(SPD niskiego napięcia); **EN 61730-1:2007** (kwalifikacja bezpieczeństwa modułów PV); **EN
62109-1:2010 i EN 62109-2:2011** (bezpieczeństwo przetwornic PV — **62109-2 już mamy w pełnej
treści**, patrz `docs/zrodla/norma-IEC-62109-2/`); EN 62262 (klasy IK — odporność mechaniczna
obudów); **EN 62305-2/-3/-4** (ochrona odgromowa — ocena ryzyka, uszkodzenia fizyczne, systemy
elektryczne); EN 62423 (wyłączniki różnicowoprądowe typu F i B); **EN 62446** (systemy PV
podłączone do sieci — dokumentacja i inspekcja); **EN 62852** (złącza DC dla systemów PV — już
wspomniana w materiale PV 2019, ostrzeżenie o niekompatybilności różnych producentów); HD
60364-4-41:2007 (ochrona przed porażeniem — mamy jako wyciąg, `docs/zrodla/norma-PN-IEC-60364-4-41/`,
plus rozwiązanie w `docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/`); HD
60364-4-443:2016 (ochrona przed przepięciami atmosferycznymi/łączeniowymi — nowa pozycja, nie mamy);
HD 60364-5-551:2010 (generatory grupowe niskiego napięcia — nowa pozycja, nie mamy); IEC 60050-826
(słownik).

**Nowe, konkretnie nazwane braki wynikające z tej listy:** HD 60364-4-443 (przepięcia), HD
60364-5-551 (generatory), EN 62305-2/-3/-4 w komplecie (mamy tylko nazwy przez materiał PV 2019, nie
same normy), EN 61439 (pełna seria — mamy nazwę, nie treść).

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, ale **praktycznie bezużyteczny w obecnej postaci** — sam spis treści i
bibliografia, bez żadnej z konkretnych wartości liczbowych, które czyniłyby tę normę faktycznym
odblokowaniem czegokolwiek w `docs/rejestr-pokrycia.md`. Jeśli ta norma ma faktycznie odblokować
kalkulatory PV (dobór bezpiecznika stringowego wg 712.433/712.434, obliczenie U_OC MAX/I_SC MAX wg
Załącznika B), **potrzebny jest zakup pełnego tekstu**, nie tego wyciągu.
