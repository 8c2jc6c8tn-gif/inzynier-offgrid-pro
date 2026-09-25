# PN-EN 1991-1-4:2008 + AC:2009 — Eurokod 1, oddziaływania wiatru — notatka robocza

## Status pliku źródłowego — oryginał POZA repozytorium

- **Dostarczone:** 25.09.2026 przez właściciela projektu — PN-EN 1991-1-4:2008 (wprowadza
  EN 1991-1-4:2005) z polskim Załącznikiem krajowym NA, oraz poprawka PN-EN 1991-1-4:2008/AC:2009.
  6 plików PDF, 161 stron, tekst natywny (nie skan).
- **Oryginalny PDF NIE jest w repozytorium.** Na każdej stronie nadruk licencji PKN
  ("wersja jednostanowiskowa, kopiowanie i umieszczanie w sieci zabronione") oraz znak wodny
  serwisu, z którego plik pobrano, z danymi osobowymi pobierającego. Repozytorium jest publiczne.
  Oryginał przechowuje właściciel projektu. Pełny opis problemu: `docs/memory.md`, wpis
  "Licencje norm w publicznym repozytorium (25.09.2026)".
- **Ten plik to NIE przedruk normy** — własna notatka: które punkty/tablice są używane w kodzie,
  z numerem punktu normy i wyłącznie liczbami potrzebnymi do obliczeń. Przy wątpliwości co do
  wartości — sprawdzić w oryginale u właściciela projektu.

## Co z normy jest używane w projekcie

### Tablica 7.6 — wiaty jednospadowe: globalny współczynnik siły `cf` (punkt 7.3)

Łączny efekt wiatru na górną i dolną powierzchnię dachu przy wszystkich kierunkach wiatru
(7.3 (3)). `φ` — współczynnik ograniczenia przepływu pod wiatą: 0 = pusta, 1 = wypełniona do
krawędzi zawietrznej. Wartości pośrednie — interpolacja liniowa (7.3 (3)). Znak `+` = obciążenie
netto w dół (docisk), `−` = w górę (odrywanie). Siła wypadkowa przyłożona w odległości d/4 od
krawędzi nawietrznej (7.3 (6)). Wysokość odniesienia `ze = h` (7.3 (8)).

| Kąt α | cf maks. (wszystkie φ) | cf min. φ = 0 | cf min. φ = 1 |
|---|---|---|---|
| 0° | +0,2 | −0,5 | −1,3 |
| 5° | +0,4 | −0,7 | −1,4 |
| 10° | +0,5 | −0,9 | −1,4 |
| 15° | +0,7 | −1,1 | −1,4 |
| 20° | +0,8 | −1,3 | −1,4 |
| 25° | +1,0 | −1,6 | −1,4 |
| 30° | +1,2 | −1,8 | −1,4 |

**Zakres: tylko 0–30°.** Norma nie podaje wartości dla wiat o większym spadku.
Współczynniki ciśnienia netto `cp,net` (pola A/B/C — do łączników i pokrycia, 7.3 (5)) są w
oryginale; nie przepisane, bo żaden ekran ich dziś nie używa. **AC:2009** zmienia jedną wartość
`cp,net` w tej tablicy (α = 10°, pole A, minimum φ = 1: −2,1 → −1,6) — nie dotyczy `cf`.

### Punkt 7.4.3 — tablice wolno stojące: `cf = 1,80` (wzór 7.7)

Dla płyty pionowej (tablica/ogrodzenie) — jedyna wartość normy dla panelu ustawionego pionowo
(90°, montaż na ogrodzeniu/elewacji wolno stojącej). Warunki stosowania (odległość od terenu,
proporcje) — punkt 7.4.3 (2)–(3) w oryginale.

### Załącznik krajowy NA, Tablica NA.1 — bazowa prędkość wiatru w Polsce

| Strefa | vb,0 [m/s], A ≤ 300 m | vb,0 [m/s], A > 300 m | qb,0 [kN/m²], A ≤ 300 m |
|---|---|---|---|
| 1 | 22 | 22·[1 + 0,0006(A − 300)] | 0,30 |
| 2 | 26 | 26 | 0,42 |
| 3 | 22 | 22·[1 + 0,0006(A − 300)] | 0,30 (dla A > 300 m wzór z dodatkowym czynnikiem, patrz oryginał) |

A — wysokość nad poziomem morza [m]. Mapa stref: Rysunek NA.1 (w oryginale). Współczynnik
kierunkowy — Tablica NA.2, sezonowy — NA.4 (w oryginale).

## Znaczenie dla ekranów (stan 25.09.2026)

- **M3/E9 „Złoty środek”** — krzywa wiatru w funkcji kąta tylko dla 0–30° (Tablica 7.6) + punkt
  90° (7.4.3). **Przedział 30–90° niepokryty normą** — nie interpolowany (Dyrektywa #1).
- **Założenie zaakceptowane przez właściciela projektu (25.09.2026):** stelaż PV traktowany jak
  wiata jednospadowa (Tablica 7.6) — praktyka inżynierska, nie zapis normy; w aplikacji oznaczane
  jako założenie.
- **M3/E6 napór wiatru** — prędkość referencyjna mogłaby pochodzić ze strefy NA.1 zamiast ręcznego
  wpisu; pełny tor `qp(z)` (kategoria terenu, chropowatość, turbulencja — rozdział 4) nie jest
  jeszcze opracowany.
