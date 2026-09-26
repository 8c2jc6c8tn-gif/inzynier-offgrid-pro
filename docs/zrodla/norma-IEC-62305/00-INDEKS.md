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

> **[25.09.2026] NIEAKTUALNE dla tabel i wzorów — patrz „Weryfikacja OCR (25.09.2026)” niżej.**

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

## Weryfikacja OCR (25.09.2026)

Metoda: kompletność 140/140, drugi niezależny OCR (eng, 300 DPI), porównanie liczb, odczyt wizualny.
**Tekst ciągły OCR jest dobrej jakości; tabele i wzory — nie.** Dlatego na **47 stronach** z tabelami
lub wzorami dopisano pod tekstem OCR blok `[TABELE/WZORY ZWERYFIKOWANE WIZUALNIE ze skanem 25.09.2026 —
obowiązują zamiast rozsypanego OCR powyżej]` z tabelami przepisanymi ze skanu (Tablice 2.1–2.4,
3.1–3.10, 4.1–4.16, 5.1–5.5, 6.1–6.27, 7.1–7.3 oraz wzory 2.1, 3.1–3.29, 4.1–4.7, 7.1).

**Znalezione błędy OCR (najważniejsze):**
- **Tablica 2.3 (prąd SPD na tryb: 25 / 18,75 / 12,5 / 12,5 kA) — w OCR zgubiona całkowicie.**
- Wzór 2.1 `r = 10 · I^0,65` → „izddwl”; Tablica 3.1 `1×10⁻⁵` → „1x 10°>”; Tablica 4.3 (kąt ochronny)
  — kolumny rozsypane (przepisana i sprawdzona arytmetycznie: promień = wysokość · tg(kąt) dla 150 par).
- Tablica 4.4 (oczka 5×5 … 20×20 m) niepełna; Tablica 3.5 i NB.3 — wartości rozsypane.

**Błędy w samym poradniku** (oznaczone `⚠️`/`[sic]`, nie „poprawiane” po cichu):
- Wzór (3.17) wydrukowany `Ad = (L + W) + …` — literówka; sam poradnik w przykładzie (s. 96) liczy
  `Ad = L·W + 6H(L + W) + π(3H)²` = 2 578 m². Poprawna postać odnotowana przy wzorze.
- W przykładzie 2 (s. 105–109) kilka sum w tabelach 6.24/6.27 niezgodnych arytmetycznie z wierszami;
  rf archiwum „High” = 0,5 przy NC.5 „High” = 10⁻¹.

Status bez zmian: to **poradnik producenta (Furse/ABB), nie tekst normy** — liczby do kodu po
potwierdzeniu w PN-EN 62305.
