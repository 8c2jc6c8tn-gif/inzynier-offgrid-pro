# EN ISO 13786:2007 — Thermal performance of building components — Dynamic thermal characteristics — Calculation methods

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
