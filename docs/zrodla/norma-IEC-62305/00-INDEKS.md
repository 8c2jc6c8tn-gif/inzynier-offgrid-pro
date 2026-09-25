# Indeks — "A Guide to BS EN 62305" (Furse/Thomas & Betts, 3rd edition)

Źródło: `670881858-Bs-en-Iec-62305-Full.pdf` (140 stron). **To NIE jest tekst samej normy
BS EN/IEC 62305** — to komercyjny poradnik producenta systemów odgromowych (Furse, marka
Thomas & Betts/ABB Group), analogiczny status do poradnika Purmo dla PN-EN 12831
(`docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/`): wyjaśnia metodykę normy własnymi słowami
producenta, w celach marketingowo-edukacyjnych, **nie zastępuje officjalnego tekstu normy**.

Dokument to skan (0 znaków przy bezpośredniej ekstrakcji). **Pełny OCR wykonany w tej sesji**
(tesseract, pol+eng, 250 DPI, 140 stron) — [`01-tresc-ocr.txt`](01-tresc-ocr.txt) (~376 tys.
znaków, jakość dobra, tekst wyłącznie angielski mimo pakietu pol+eng).

## ⚠️ Zastrzeżenie o jakości OCR

Wstępny spot-check (kilka stron, w tym Tabela 2.4 "Radius of rolling sphere for each LPL" — wartości
20/30/45/60 m rozpoznane poprawnie). Żadna tabela nie została zweryfikowana systematycznie strona
po stronie. Przed użyciem wartości liczbowej w kodzie — weryfikacja wizualna względem PDF.

## Zawartość

Metoda ochrony odgromowej wg BS EN 62305 (odpowiednik IEC 62305): klasy ochrony odgromowej (LPL
I-IV), metoda toczącej się kuli (rolling sphere method) z promieniami wg klasy, prąd piorunowy
szczytowy per LPL, projektowanie zwodów/przewodów odprowadzających/uziemienia, komponenty LPSC
(IEC/BS EN 62561), ochrona przed przepięciami (SPD) w kontekście systemu odgromowego całościowego
(nie tylko strony DC instalacji PV, jak dotychczasowe materiały w repo).

## Trafność w domenie off-grid PV — **bezpośrednia, uzupełnia istniejące pokrycie**

Najbardziej wartościowy plik z całej paczki `New-info` dla tego projektu. **Moduł 8
(Bezpieczeństwo)** i częściowo Moduł 5 (`ochrona-przepieciowa-spd`, `projekt-uziemienia` —
`docs/rejestr-pokrycia.md` wiersze 2 i 9) już implementują fragmenty tematu (margines napięciowy
SPD, uziemienie wzorem Dwighta, próg <10Ω dla uziomu odgromowego), ale **żaden istniejący ekran nie
liczy strefy ochronnej zwodu metodą toczącej się kuli** — ten materiał to bezpośrednie źródło do
ewentualnego nowego ekranu "Dobór i rozmieszczenie zwodów odgromowych" (promień wg klasy LPL, wg
Tabeli 2.4).

## Status wykorzystania

Przeanalizowany (pełny OCR), **niewykorzystany jeszcze w kodzie** — brak dziś ekranu liczącego
strefę ochronną metodą toczącej się kuli. Kandydat na kolejny ekran Modułu 8, po weryfikacji
liczb względem oficjalnego tekstu normy (to poradnik producenta, nie sama norma).
