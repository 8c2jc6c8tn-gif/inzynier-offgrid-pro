# EN ISO 13786:2007 — Thermal performance of building components — Dynamic thermal characteristics — Calculation methods

## [27.09.2026] OCR + weryfikacja wykonane — aktualny status

**Status: ✅ OCR wykonany, cała treść przeczytana wizualnie, wzory i tablice zweryfikowane
(w pełni, nie spot-check).** Wersja angielska EN ISO 13786:2007 (identyczna z ISO 13786:2007,
zastępuje EN ISO 13786:1999), bez załącznika krajowego PN.

| Plik | Zawartość |
|---|---|
| `EN-ISO-13786-2007-dynamiczne-charakterystyki-cieplne.pdf` | Oryginał (27 stron, **100% skan** — 0 znaków tekstu natywnego na każdej stronie) |
| [`01-tresc-ocr.txt`](01-tresc-ocr.txt) | Surowy OCR całości (tesseract 5.3.4, `eng`, 250 DPI) — tekst ciągły dobry, **wzory/tablice zniekształcone, nie używać** |
| [`02-wzory-i-tablice-zweryfikowane.md`](02-wzory-i-tablice-zweryfikowane.md) | Wszystkie wzory (1)–(26), (A.1)–(A.4), (B.1)–(B.16), (C.1)–(C.2) i tablice A.1, C.1, D.1–D.5 przepisane z odczytu wizualnego — **źródło prawdy dla kodu** |

**Metoda:** render PyMuPDF → dwa niezależne przebiegi OCR (250 DPI auto, 300 DPI `--psm 6`),
porównanie liczb strona po stronie → odczyt wizualny wszystkich stron treści (PDF 6–26) →
niezależne odtworzenie obu przykładów Załącznika D w Pythonie z przepisanych wzorów (zgodność do
ostatniej cyfry).

**Mapa treści (strona PDF):** 1–2 okładka/przedmowa CEN · 3 spis treści · 4 przedmowa ISO ·
5 wprowadzenie · 6 rozdz. 1–2 (zakres, powołania: ISO 6946, 7345, 10211) · 7–11 rozdz. 3–5
(definicje, symbole, okresy, dane) · 12–15 rozdz. 6–8 (macierz przenoszenia, charakterystyki,
raport) · 16–17 **Załącznik A (normatywny) — uproszczone obliczenie pojemności cieplnej** ·
18–21 Zał. B (zasada, przykłady) · 22–23 Zał. C (programowanie) · 24–26 Zał. D (przykłady) ·
27 bibliografia.

**Znaleziska (błędy/niespójności samego oryginału, nie OCR — nie poprawiane, oznaczone ⚠️):**
1. Przykład D.1: Z12 warstwy betonu wydrukowane jako −0,097 25 − 0,075 4j; wzór (14) daje
   −0,070 5j, a dalsze wyniki tego samego przykładu zgadzają się z −0,070 5j → literówka oryginału.
2. Wzór (26) (przesunięcie okresowego wsp. przenikania = arg Z12) nie odtwarza wartości z Tablic
   D.1/D.4 (−5,68 h, −8,11 h) — te wychodzą z arg(Y12) = arg(−1/Z12). Do rozstrzygnięcia z
   właścicielem **dopiero, gdy kod będzie potrzebował przesunięcia fazowego** (dziś nie potrzebuje).

**Co odblokowuje (hipoteza z sekcji niżej — POTWIERDZONA):** zadanie **M6/E8 „głębokość czynna
masy”** (`docs/lista-do-zrobienia.md`, wpis 2026-09-26; ostrzeżenie `POJC-CALA-MASA-ZAWYZA` w
`lib/core/modules/ogrzewanie/pojemnosc-cieplna/`). Załącznik A.2.4 daje dokładnie potrzebną regułę:
grubość efektywna = min(½ grubości elementu; grubość do pierwszej warstwy izolacji; **100 mm dla
okresu 1 doby** — Tablica A.1), κ = Σ ρ·d·c na tej grubości, opcjonalnie korekta oporu
przejmowania (A.4). Załącznik A jest normatywny, ale **tylko do zgrubnej oceny bezwładności
strefy** i wymaga adnotacji w wyniku, którą metodą liczono (A.1). Pełna metoda macierzowa (rozdz. 6–7)
też możliwa — liczby zespolone, przykłady D.1/D.2 gotowe jako testy referencyjne.

**Status wykorzystania: zweryfikowana, jeszcze niewykorzystana w kodzie** (implementacja w M6/E8 —
osobne zadanie).

---

## [historyczne — stan z 27.09.2026 sprzed OCR, zachowany bez zmian]

> **Korekta (27.09.2026, sesja OCR):** opis niżej mówi o „~28 stronach” i „prawdopodobnie tylko
> okładka natywna” — faktycznie PDF ma **27 stron i 0 znaków tekstu natywnego na każdej**
> (sprawdzone PyMuPDF). Hipoteza o zakresie normy i o związku z akumulacją cieplną — potwierdzona.

**Status: ⚠️ tylko plik dodany i pobieżnie zidentyfikowany — treść NIE przeczytana/OCR-owana w
tej sesji.** Dokument jest w większości **skanem** (analiza struktury PDF: 108 obiektów obrazu,
tylko 7 czcionek/62 fragmenty tekstu natywnego na ~28 stron — prawdopodobnie tylko okładka/strona
tytułowa ma tekst natywny, resztę trzeba przejść przez OCR, analogicznie do
`norma-PN-HD-60364-5-52` czy paczki `New-info`). **To zadanie zostało wprost odłożone do innej
sesji** (polecenie właściciela projektu, 27.09.2026) — nie zgadywać treści na podstawie samego
tytułu.

Plik: `EN-ISO-13786-2007-dynamiczne-charakterystyki-cieplne.pdf` (~28 stron wg liczby obiektów
`/Type/Page` w PDF, wersja angielska — brak w tym pliku wersji polskiej PN, tylko oryginał EN).

## Co wiadomo o zakresie normy bez czytania treści (ostrzeżenie: to wiedza ogólna o normie ISO 13786, NIE potwierdzona odczytem tego konkretnego pliku — nie traktować jako źródło liczb)

ISO 13786 to metoda obliczania **dynamicznych charakterystyk cieplnych komponentów budowlanych**
w warunkach zmiennych okresowo (nie stanu ustalonego, jak U-value w ISO 6946) — m.in.:
periodyczny współczynnik przenikania ciepła, współczynnik tłumienia (decrement factor), przesunięcie
fazowe/czasowe (time lag), admitancja cieplna. Używana głównie do oceny **akumulacyjności cieplnej**
budynku (masa termiczna, wygaszanie wahań dobowych temperatury) — inny temat niż statyczne straty
ciepła (12831) czy mostki liniowe (14683, wyżej). **Powyższe jest opisem ogólnym normy z wiedzy
domenowej, nie z przeczytania tego pliku — wymaga potwierdzenia przy OCR.**

## Dlaczego mogłaby być potrzebna w tym projekcie (hipoteza do zweryfikowania przy OCR)

Off-grid + brak sieciowego ogrzewania = duże znaczenie akumulacji cieplnej budynku (bufor na
przerwy w produkcji PV/dogrzewaniu). Potencjalny związek z M6/M7 (ogrzewanie, stress-test zimowy)
— ale **nie ma dziś żadnego zidentyfikowanego ekranu/luki w `docs/rejestr-pokrycia.md` czy
`docs/normy-brakujace.md`, który wprost wymagałby dynamicznych charakterystyk cieplnych** (luka
dot. mostków liniowych i metody obliczania obciążenia cieplnego, nie akumulacji). Do ustalenia
przy OCR i po konsultacji z właścicielem projektu, czy to realnie odblokowuje coś konkretnego,
czy jest to materiał "na przyszłość".

## Zadanie dla następnej sesji

1. OCR (tesseract pol+eng, 250 DPI — wzorzec z paczki `New-info`, patrz `docs/zrodla/README.md`).
2. Podział na rozdziały analogicznie do innych `00-INDEKS.md` w tym katalogu.
3. Weryfikacja wizualna tablic/wzorów względem renderu stron (wzorzec: `norma-PN-HD-60364-5-54`).
4. Dopiero po OCR: ustalić, czy norma odblokowuje konkretny ekran (dodać/zmienić wpis w
   `docs/normy-brakujace.md`) — dziś status: pozyskana, nieprzeanalizowana, nieprzypisana do
   żadnej luki.

**Status wykorzystania: dodana, nieprzeanalizowana, niewykorzystana w kodzie.**

**[27.09.2026] ✅ Wykorzystana w kodzie:** Załącznik A (A.2.4, Tablica A.1 — 100 mm dla 1 doby, A.4 z Rsi = 0,13)
→ M6/E8 `lib/core/modules/ogrzewanie/pojemnosc-cieplna/`; przykład D.1/D.2 (97 kJ/(m²·K)) jako test. Status wyżej
(„niewykorzystana”) jest historyczny.
