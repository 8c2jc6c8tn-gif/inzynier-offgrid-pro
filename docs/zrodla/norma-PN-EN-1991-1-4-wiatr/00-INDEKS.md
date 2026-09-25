# Indeks — PN-EN 1991-1-4:2008 (Eurokod 1 — Oddziaływania na konstrukcje, Część 1-4: Oddziaływania ogólne — Oddziaływania wiatru)

Źródło: `365459025-PN-EN-1991-1-4-2008-wiatr.pdf` (146 stron). Dokument to **skan** — 0 znaków przy
bezpośredniej ekstrakcji tekstu z każdej strony. **Pełny OCR wykonany w tej sesji** (tesseract,
pakiet pol+eng, 250 DPI, wszystkie 146 stron) — wynik: [`01-tresc-ocr.txt`](01-tresc-ocr.txt)
(~226 tys. znaków).

## ⚠️ Zastrzeżenie o jakości OCR — identyczne jak przy innych skanach w tym repo

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

Bezpośrednio potrzebne do zaprojektowania **konstrukcji wsporczej pod panele PV** (dach skośny/
płaski, grunt, maszt) — obciążenie wiatrem to jedno z dwóch głównych obciążeń środowiskowych takiej
konstrukcji (obok śniegu, `docs/zrodla/norma-PN-EN-1991-1-3/`). **Sprawdzone w `docs/rejestr-pokrycia.md`:
obecnie żaden moduł/ekran nie obejmuje doboru/weryfikacji konstrukcji wsporczej** — więc ten materiał
dziś nie odblokowuje żadnego konkretnego ekranu, jest zapasem na przyszłość (podobnie jak
`norma-PN-EN-1991-1-3`, śnieg, już w repo od wcześniej — sprawdź, czy to nie jest ten sam scenariusz
"czeka na moduł, który jeszcze nie istnieje").

## Status wykorzystania

Przeanalizowany (pełny OCR), **niewykorzystany w kodzie** — brak modułu doboru konstrukcji wsporczej.
