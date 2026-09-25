# Indeks — PN-EN 1991-1-4:2008 (Eurokod 1 — Oddziaływania na konstrukcje, Część 1-4: Oddziaływania ogólne — Oddziaływania wiatru)

Źródło: `365459025-PN-EN-1991-1-4-2008-wiatr.pdf` (146 stron). Dokument to **skan** — 0 znaków przy
bezpośredniej ekstrakcji tekstu z każdej strony. **Pełny OCR wykonany w tej sesji** (tesseract,
pakiet pol+eng, 250 DPI, wszystkie 146 stron) — wynik: [`01-tresc-ocr.txt`](01-tresc-ocr.txt)
(~226 tys. znaków).

## ⚠️ Zastrzeżenie o jakości OCR — identyczne jak przy innych skanach w tym repo

> **[25.09.2026] NIEAKTUALNE w części — patrz sekcja „Weryfikacja OCR (25.09.2026)” niżej.** Zakres
> używany w projekcie (Załącznik krajowy NA, rozdziały 3–7.5, Załącznik A) jest już zweryfikowany
> wizualnie i przepisany; zastrzeżenie poniżej dotyczy tylko pozostałych stron.

Tylko wstępny spot-check (kilka stron, w tym wzór 4.1 `vb = cdir·cseason·vb,0` — rozpoznany
poprawnie z drobnym błędem OCR w indeksach dolnych). **Żadna tabela ani mapa stref wiatrowych nie
została zweryfikowana wizualnie strona po stronie.** Przed użyciem jakiejkolwiek wartości liczbowej
(strefa wiatrowa Polski, wartość bazowa prędkości wiatru v_b,0, współczynniki ekspozycji/kierunku/
sezonowe, współczynniki ciśnienia dla dachów/ścian) w kodzie kalkulatora — **obowiązkowa
weryfikacja wizualna względem oryginalnego PDF**, zgodnie z Dyrektywą #3 i CLAUDE.md ("nie zgaduj
brakujących norm/współczynników"). Krajowy załącznik (mapa stref wiatrowych Polski, wartości v_b,0
dla poszczególnych stref) to zwykle Załącznik krajowy NA — sprawdzić, czy ten skan go w ogóle
zawiera (nie potwierdzone w tym spot-checku).

## Zawartość (wg struktury normy)

Metoda obliczania obciążenia wiatrem konstrukcji: prędkość bazowa wiatru → ciśnienie prędkości →
współczynniki ekspozycji terenu → współczynniki ciśnienia zewnętrznego/wewnętrznego dla różnych
typów konstrukcji (w tym dachy — istotne dla konstrukcji wsporczych PV) → siła wiatru na konstrukcję.

## Trafność w domenie off-grid PV — **pośrednia, obecnie bez modułu-odbiorcy**

> **[25.09.2026] BŁĘDNA OCENA — skorygowana (weryfikacja OCR).** Ta norma **ma odbiorców w kodzie**:
> M3/E9 „Złoty środek” i M3/E2 „Typ montażu” (balast, D27) liczą siłę wiatru z Tablicy 7.6, 7.4.3 oraz
> NA.1/NA.3. Istnieje też wcześniejsza, zweryfikowana notatka robocza tej samej normy:
> **`docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`** (tor obliczeń użyty w kodzie) — czytać razem.
> Ten folder = pełny tekst (PDF + OCR), tamten = notatka robocza z liczbami. Skan **zawiera**
> Załącznik krajowy NA (strony 1–5 pliku).

Bezpośrednio potrzebne do zaprojektowania **konstrukcji wsporczej pod panele PV** (dach skośny/
płaski, grunt, maszt) — obciążenie wiatrem to jedno z dwóch głównych obciążeń środowiskowych takiej
konstrukcji (obok śniegu, `docs/zrodla/norma-PN-EN-1991-1-3/`). **Sprawdzone w `docs/rejestr-pokrycia.md`:
obecnie żaden moduł/ekran nie obejmuje doboru/weryfikacji konstrukcji wsporczej** — więc ten materiał
dziś nie odblokowuje żadnego konkretnego ekranu, jest zapasem na przyszłość (podobnie jak
`norma-PN-EN-1991-1-3`, śnieg, już w repo od wcześniej — sprawdź, czy to nie jest ten sam scenariusz
"czeka na moduł, który jeszcze nie istnieje").

## Status wykorzystania

Przeanalizowany (pełny OCR), **niewykorzystany w kodzie** — brak modułu doboru konstrukcji wsporczej.

## Weryfikacja OCR (25.09.2026)

Wykonana na prośbę właściciela projektu. Metoda: (1) kompletność stron (146/146, bez luk i duplikatów);
(2) drugi, niezależny przebieg OCR (tesseract 5, pol, 300 DPI, `--psm 6`) i porównanie liczb strona po
stronie; (3) słownik (hunspell pl) — poprawiono 145 słów tylko tam, gdzie kandydat był jednoznaczny
albo potwierdzony drugim przebiegiem, plus ~30 poprawek ręcznych; (4) **odczyt wizualny ze skanem**.

**Zweryfikowane wizualnie i przepisane w całości** (nagłówek strony w `01-tresc-ocr.txt` ma dopisek
`[ZWERYFIKOWANO WIZUALNIE ze skanem 25.09.2026]`): strony pliku **1–5** (Przedmowa krajowa, Załącznik
krajowy NA z Tablicami NA.1–NA.3), **22–64** (rozdziały 3–7.5: prędkość i ciśnienie wiatru, współczynnik
konstrukcyjny, współczynniki ciśnienia budynków — Tablice 4.1, 5.1, 7.1–7.10, wiaty 7.3, tablice wolno
stojące 7.4.3), **89–96** (Załącznik A — kategorie terenu, Tablica A.1, orografia A.1–A.13).
Dodatkowo tylko tabele: strona 68 (Tablica 7.11), 142 (Tablica F.2).

**Znalezione i poprawione błędy OCR (przykłady typowych klas):**
- **Tablica NA.1 — brakował cały wiersz strefy 2** (26 m/s; 0,42 kN/m²), wzory dla A > 300 m rozbite.
- **Tablica NA.2** — zgubione przypisanie wartości do sektorów (scalone komórki); **NA.3** — przesunięte
  wykładniki, zgubiony wykładnik c_r kategorii 0.
- Wzory: np. (5.3) „Fry = CsCa* Ch (Ze) * Aref” → `Fw = cscd · cf · qp(ze) · Aref`; (4.8), (6.1)–(6.3),
  (A.4)–(A.13) — w OCR nieczytelne.
- **Systematycznie: „≤/≥” czytane jako „<” albo „2”, wykładniki potęg jako „°”** (np. `Re ≤ 2,4·10⁵` →
  „Re < 2,4 - 10°”). Dotyczy też stron niezweryfikowanych — tam zakładać ten błąd.
- Indeksy dolne greckich/łacińskich symboli (vb,0 → „vp g”, cdir → „Coir”, qp → „q,”).

**Rozbieżności w samym oryginale** (nie błędy OCR; oznaczone w tekście `⚠️`/`[sic]`, nie rozstrzygane):
Rysunek 7.20 (etykiety prostych ψs nie przechodzą przez narysowane punkty), wyrażenia (A.5)/(A.12)
(UWAGA mówi „identyczne”, druk różni się dwoma współczynnikami), Tablica 5.1 (cpi/cpe zamienione),
Tablica 7.3a zatytułowana „dla dachów płaskich”. Skan **nie zawiera poprawki AC:2009** (Tablica 7.6,
α = 10°, pole A, min φ = 1: −2,1 → −1,6) — odnotowane przy tablicy.

**Niezweryfikowane (poza zakresem projektu):** strony 0, 6–21 (przedmowa EN, spis treści, symbole),
65–88 (walce, kule, kratownice, flagi, mosty), 97–141, 143–145 (Załączniki A.4–F). Porównanie dwóch
przebiegów OCR wskazało rozbieżności liczb na 45 z tych stron — przed użyciem jakiejkolwiek liczby
stamtąd: weryfikacja wizualna ze skanem.
