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

## Drugie źródło (27.09.2026): artykuł naukowy PL — Boryń, Olesz, "Zmiany zasad ochrony
## odgromowej obiektów budowlanych według norm serii PN-EN 62305"

Plik: `zmiany-zasad-ochrony-odgromowej-wg-PN-EN-62305-Boryn-Olesz-2010.pdf` (7 stron, Politechnika
Gdańska, Zeszyty Naukowe WEiA PG nr 27, Gdańskie Dni Elektryki 2010). Natywny tekst PDF,
przeczytany w całości. **To nie jest tekst normy** — to recenzowany referat naukowy w języku
polskim, streszczający strukturę i nowości całej serii PN-EN 62305 (Części 1–4) względem
wycofanych norm PN-IEC 61024/61312. **Drugie, niezależne od Furse, źródło do krzyżowej
weryfikacji** — po polsku, co ułatwia porównanie terminologii z resztą polskojęzycznej
dokumentacji projektu.

### Zawartość istotna dla kodu
- **Procedura oceny ryzyka R wg PN-EN 62305-2** — wzór ogólny `Rx = Nx · Px · Lx` (częstość ×
  prawdopodobieństwo uszkodzenia × strata), z rozbiciem na komponenty RA–RZ wg przyczyny
  wyładowania (S1–S4) i typu szkody (D1–D3) — Tabela 2 w artykule.
  `Nx = Ng · Aex · Cdx · Ctx · 10⁻⁶`, `Ae = ab + 6h(a+b) + 9πh²` dla samotnego budynku na
  płaskim terenie (Rys. 1) — **gotowy, prostszy wzór na powierzchnię zbierania wyładowań** niż
  cokolwiek dotąd w repo.
  Ryzyko tolerowane: `R_T = 10⁻⁵` (zagrożenie życia) / `R_T = 10⁻³` (utrata usług
  publicznych/dziedzictwa); w innych przypadkach ustala inwestor/projektant.
- **Tabela 3–4 (norma PN-EN 62305-3)**: minimalne przekroje/wymiary materiałów zwodów,
  przewodów odprowadzających i uziomów (miedź, aluminium, stal ocynkowana, stal nierdzewna) —
  wartości liczbowe zgodne co do rzędu wielkości z Tabelą 2.x u Furse, dobry materiał do
  krzyżowej weryfikacji przed użyciem w kodzie.
- **Odległości między przewodami odprowadzającymi wg klasy LPS**: I i II = 10 m, III = 15 m,
  IV = 20 m.
- **Tabela 5**: terminy przeglądów LPS — klasa I/II: oględziny rocznie, pełne sprawdzenie co 2
  lata; klasa III/IV: oględziny co 2 lata, pełne sprawdzenie co 4 lata; obiekty zagrożone
  wybuchem: oględziny co 6 mies., próby elektryczne raz/rok.
- Algorytm decyzyjny (Rys. 2): R > R_T? → LPS/LPMS zainstalowany? → dobór typu ochrony →
  ponowne przeliczenie R, aż do R ≤ R_T.

### Trafność w domenie off-grid PV

Ten sam gap co poradnik Furse — Moduł 8 (Bezpieczeństwo) nie liczy formalnie ryzyka
piorunowego R metodą PN-EN 62305-2 ani nie dobiera klasy LPS na tej podstawie. Artykuł, będąc
krótszym i po polsku, jest lepszym punktem startowym do zrozumienia procedury przed sięgnięciem
po pełny (140-stronicowy, po angielsku) poradnik Furse.

### Status wykorzystania

Przeanalizowany w całości (ta sesja), niewykorzystany w kodzie. **EN 62305 nadal NIE jest w pełni
pozyskana jako tekst normy** — mamy teraz dwa niezależne materiały wtórne (Furse + ten artykuł),
ale wciąż nie oficjalny tekst PN-EN 62305-1÷4.
