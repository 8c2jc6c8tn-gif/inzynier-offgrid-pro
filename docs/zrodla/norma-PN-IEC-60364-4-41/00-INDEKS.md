# Indeks — PN-IEC 60364-4-41:2000 (Instalacje elektryczne w obiektach budowlanych —
Ochrona dla zapewnienia bezpieczeństwa — Ochrona przeciwporażeniowa) (Wyciąg)

Źródło: `docs/zrodla/norma-PN-IEC-60364-4-41/PN-IEC-60364-4-41-2000-Ochrona-przeciwporazeniowa.doc`
(plik `.doc` Word 95/97, dostarczony przez właściciela projektu, prywatne tłumaczenie/wyciąg z 2002,
nie oficjalny skan PKN jak pozostałe normy w tym repo). Metoda ekstrakcji: `antiword`/`wvHtml`
(natywny tekst z pliku binarnego .doc, kodowanie cp1250/8859-2 poprawnie zdekodowane) — nie OCR,
brak ryzyka błędnie odczytanych cyfr w tekście ciągłym.

## 🔴 KRYTYCZNE ZASTRZEŻENIE — Tablice 41A i 41B NIE ZNAJDUJĄ SIĘ W TYM PLIKU

Ten dokument to **"(Wyciąg)"** — świadomie skrócone tłumaczenie normy, nie pełny tekst. Sprawdzone
trzema niezależnymi metodami (tekst `antiword`, HTML z zachowaną strukturą `wvHtml`, ręczne
przejrzenie wszystkich 4 odzyskanych obrazów wzorów WMF) — **żadna nie zawiera treści Tablicy 41A
(maksymalne czasy wyłączenia zasilania w układzie TN, w zależności od napięcia U₀) ani Tablicy 41B
(analogicznie dla układu IT)**. Dokument odwołuje się do obu tablic wielokrotnie (m.in. 413.1.3.3,
413.1.3.4, 413.1.3.5, 413.1.5.6), ale w miejscu, gdzie w oryginale znajdowałaby się ich treść, nie
ma nic — ani tekstu, ani obrazu, ani nawet zepsutego/nieczytelnego placeholdera. To nie błąd
konwersji z mojej strony (sprawdzone dwoma niezależnymi narzędziami, zgodny wynik) — te tabele po
prostu nie zostały ujęte w tym konkretnym wyciągu z 2002 roku.

**Skutek praktyczny:** wzory warunków wyłączenia (Zs×Ia≤U₀ dla TN, RA×Ia≤50V dla TT, warianty dla
IT) są w pliku kompletne i poprawne — ale bez wartości granicznych czasu wyłączenia te wzory nie
dają się dokończyć.

**✅ 05.09.2026 — ROZWIĄZANE innym źródłem.** Materiał szkoleniowy
`docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/00-INDEKS.md` zawiera zarówno stare
Tablice 41A/41B (dokładnie ten brak, historyczny kontekst), jak i — co ważniejsze —
**aktualną Tablicę 41.1 z obowiązującej dziś normy PN-HD 60364-4-41:2009** (przywołanej
Rozporządzeniem Ministra Infrastruktury z 12.03.2009 r.). Struktura i wartości Tablicy 41.1 różnią
się od starych 41A/41B (m.in. rozbicie a.c./d.c., osobne pasma TT). **Do nowego kodu kalkulatora
używać Tablicy 41.1 (aktualnej), nie 41A/41B (te pozostają tu tylko jako kontekst historyczny,
dlaczego "Wyciąg" ich nie zawierał).**

## Co ten dokument faktycznie zawiera (kompletne i użyteczne)

| Plik | Zawartość |
|---|---|
| [`01-tresc-normy.md`](01-tresc-normy.md) | Pełny tekst rozdziałów 400, 41, 411, 412, 413 (SELV/PELV/FELV, ochrona przed dotykiem bezpośrednim, ochrona przed dotykiem pośrednim — układy TN/TT/IT, połączenia wyrównawcze, separacja elektryczna, urządzenie II klasy) |

Kluczowe wzory (kompletne, zweryfikowane wizualnie z odzyskanych obrazów WMF):
- **413.1.3.3 (TN):** Zs × Ia ≤ U₀ — impedancja pętli zwarciowej × prąd wyłączający ≤ napięcie znamionowe względem ziemi
- **413.1.3.7:** RB/RE ≤ 50/(U₀−50) — stosunek rezystancji uziomów
- **413.1.4.2 (TT):** RA × Ia ≤ 50 V — rezystancja uziemienia części dostępnych × prąd wyłączający
- **413.1.5.6 (IT):** Zs ≤ (√3×U₀)/(2×Ia) [bez przewodu neutralnego] lub Ss ≤ U₀/(2×Ia) [z przewodem neutralnym]

Definicje SELV (25V AC/60V DC bez uziemienia), PELV (25V AC/60V DC z uziemieniem, 6V/15V w
warunkach wilgotnych), FELV — bezpośrednio przydatne dla niskonapięciowych obwodów sterowania
ESP32/czujników w Module 9, jeśli kiedyś będzie tam potrzebna formalna kwalifikacja napięciowa.

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany, ale **niewykorzystany w kodzie**. Przed użyciem
czegokolwiek z tego dokumentu w kalkulatorze sprawdzającym wyłączenie zasilania — potrzebna
osobna, kompletna wersja z Tablicami 41A/41B (patrz zastrzeżenie wyżej).
