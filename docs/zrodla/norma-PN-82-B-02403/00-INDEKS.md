# Indeks — PN-82/B-02403 (Ogrzewnictwo — Temperatury obliczeniowe zewnętrzne)

Źródło: `document-download.pdf` (skan/kopia z obiegu studenckiego Studocu, Politechnika Warszawska,
5 stron). Dokument tekstowy natywnie (dobra warstwa tekstu z OCR/PDF wydawcy, nie wymagał tesseract).
Treść surowa: [`01-tresc-surowa.txt`](01-tresc-surowa.txt).

**Uwaga o statusie normy:** PN-82/B-02403 to stara norma (1982), w dużej części **wycofana i
zastąpiona przez PN-EN 12831** (metoda w poradniku Purmo, `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/`)
w zakresie samej metody obliczania obciążenia cieplnego — ale tablica temperatur obliczeniowych
zewnętrznych dla stref klimatycznych Polski z tej normy bywa nadal cytowana jako punkt odniesienia
historycznego/pomocniczy. **Przed użyciem którejkolwiek wartości temperatury w kalkulatorze —
sprawdzić, czy nie ma nowszego odpowiednika w PN-EN 12831/danych klimatycznych dla Polski** (nie
zakładać automatycznie, że stara norma nadal obowiązuje wprost).

## Zawartość

Podział Polski na strefy klimatyczne + tablica temperatur obliczeniowych zewnętrznych (do
projektowania instalacji grzewczych) przypisanych do miejscowości/stref.

> **[25.09.2026] Korekta (weryfikacja):** dokument **nie zawiera listy miejscowości** — tylko Tablicę 1
> (strefa → temperatura), Tablicę 2 (temperatury nieogrzewanych przestrzeni zamkniętych, 8 pozycji × 5 stref)
> i **mapę stref** (obraz — w pliku tekstowym jej nie ma, tylko tytuł „ZAŁĄCZNIK — PODZIAŁ POLSKI NA STREFY
> KLIMATYCZNE”).

## Trafność w domenie off-grid PV

Pośrednio istotne dla Modułu 1 (Lokalizacja) i Modułu 6/7 (Ogrzewanie, stress-test zimowy) —
temperatura obliczeniowa zewnętrzna wpływa na dobór mocy grzewczej i głębokość stress-testu
zimowego systemu off-grid.

## Status wykorzystania

Przeanalizowany, **niewykorzystany w kodzie**. Status normy (aktualność względem PN-EN 12831) do
potwierdzenia przed użyciem — nie rozstrzygane w tej sesji.

## Weryfikacja (25.09.2026)

- Tablica 1 i Tablica 2 **zgodne ze skanem w całości** (wszystkie liczby sprawdzone wizualnie).
  **Tablica 1: strefa I −16 °C, II −18 °C, III −20 °C, IV −22 °C, V −24 °C** — potwierdzone niezależnie
  Tabelą 2.1 poradnika Purmo (`materialy-Purmo-PN-EN-12831-ogrzewanie/`), która przytacza te same wartości
  jako projektową temperaturę zewnętrzną do PN-EN 12831 (plus średnie roczne 7,7/7,9/7,6/6,9/5,5 °C).
- Poprawione w `01-tresc-surowa.txt`: znak „Ŝ” zamiast „ż” (20 wystąpień — błąd kodowania źródła,
  nie OCR). Rosyjski podtytuł na stronie tytułowej zapisany w złym kodowaniu (bez znaczenia) — bez zmian.
- Stopka „Powielanie dokumentu zabronione” (INTEGRAM) — dotyczy statusu licencyjnego, patrz `docs/memory.md`.
