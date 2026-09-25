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

> **[25.09.2026] Pełny tekst tej samej normy (PDF + OCR) jest w `docs/zrodla/norma-PN-EN-1991-1-4-wiatr/`**
> — dodany przez właściciela projektu w paczce New-info (inny egzemplarz, 146 stron, skan z Załącznikiem
> krajowym NA, bez poprawki AC:2009). Zakres używany w kodzie zweryfikowany tam wizualnie ze skanem —
> wszystkie liczby tej notatki (Tablica 7.6 cf, 7.4.3, NA.1, NA.3) zgodne. Zdanie wyżej „Oryginalny PDF
> NIE jest w repozytorium” dotyczy egzemplarza z 25.09 (rano); decyzja o licencji/obecności PDF w publicznym
> repo — `docs/memory.md` „Licencje norm w publicznym repozytorium”.

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
| 3 | 22 | 22·[1 + 0,0006(A − 300)] | 0,30 |

qb,0 dla A > 300 m [kN/m²] (uzupełnione 25.09.2026 przy M3/E9): strefa 1 — `0,30·[1 + 0,0006(A − 300)]²`;
strefa 2 — `0,42` (bez zmian); strefa 3 — `0,30·[1 + 0,0006(A − 300)]²·(20000 − A)/(20000 + A)`.
Zgodne z `qb = ½·ρ·vb²` przy ρ = 1,25 kg/m³ (wartość zalecana, 4.5 (1) UWAGA 2) — kod używa wprost
wartości tablicowych, nie gęstości powietrza.

A — wysokość nad poziomem morza [m]. Mapa stref: Rysunek NA.1 (w oryginale). Współczynnik
kierunkowy — Tablica NA.2, sezonowy — NA.4 (w oryginale).

### Tor obliczeń siły wiatru na stelaż (punkty 4.5, 5.3, 6.2 + NA)

- **Siła:** `Fw = cscd · cf · qp(ze) · Aref` — wzór (5.3). `Aref` — powierzchnia odniesienia (dla
  wiaty: powierzchnia dachu/paneli).
- **Ciśnienie szczytowe:** `qp(z) = ce(z) · qb` — wzór (4.8); NA.8 dopuszcza `ce(z)` wg Tablicy NA.3.
  `qb = qb,0` z Tablicy NA.1 (przy `cdir = 1,0` — wartość najbardziej niekorzystna z Tablicy NA.2 —
  i `cseason = 1,0`, wartość zalecana w NA.4).
- **Tablica NA.3 — współczynnik ekspozycji `ce(z)`** (z — wysokość nad terenem [m]; dla `z < zmin`
  przyjmuje się `zmin` (4.3.2, wzór 4.4); dla `z > zmax` jak dla `zmax`):

| Kategoria terenu | ce(z) | zmin [m] | zmax [m] |
|---|---|---|---|
| 0 (morze, brzeg otwarty na morze) | 3,0·(z/10)^0,17 | 1 | 200 |
| I (jeziora, teren bez przeszkód) | 2,8·(z/10)^0,19 | 1 | 200 |
| II (niska roślinność, pojedyncze przeszkody ≥ 20 wysokości od siebie) | 2,3·(z/10)^0,24 | 2 | 300 |
| III (regularna zabudowa/roślinność, wsie, przedmieścia) | 1,9·(z/10)^0,26 | 5 | 400 |
| IV (≥ 15% zabudowy o wysokości > 15 m) | 1,5·(z/10)^0,29 | 10 | 500 |

  Opisy kategorii — skrót własny; pełne definicje: Tablica 4.1 i Załącznik A.1 (w oryginale).
  Kategoria obowiązuje, gdy teren tej kategorii sięga pod wiatr na odległość ≥ 30 h (NA.7).
- **Współczynnik konstrukcyjny:** `cscd = 1` dopuszczony dla budynków niższych niż 15 m (6.2 (1)a)
  i elementów o częstotliwości drgań własnych > 5 Hz (6.2 (1)b). Stelaż PV nie jest budynkiem —
  przyjęcie `cscd = 1` to założenie (niska, sztywna konstrukcja), jawnie oznaczane.
- **Współczynnik kierunkowy `cdir`** (Tablica NA.2) — od 0,7 do 1,0 zależnie od sektora; bez
  znajomości orientacji względem kierunków wiatru przyjmujemy 1,0 (najbardziej niekorzystne).

**Czego ta norma NIE daje (potrzebne do kg balastu):** częściowych współczynników bezpieczeństwa
(obciążenie wiatrem vs. stabilizujący ciężar balastu) — to **PN-EN 1990** (podstawy projektowania),
brak w repo. Bez niej aplikacja może pokazać tylko masę równoważącą samą siłę (`m = Fw / g`), nie
balast projektowy. Nie daje też współczynnika tarcia balastu o podłoże (przesuw).

## Znaczenie dla ekranów (stan 25.09.2026)

- **M3/E9 „Złoty środek”** — krzywa wiatru w funkcji kąta tylko dla 0–30° (Tablica 7.6) + punkt
  90° (7.4.3). **Przedział 30–90° niepokryty normą** — nie interpolowany (Dyrektywa #1).
- **Założenie zaakceptowane przez właściciela projektu (25.09.2026):** stelaż PV traktowany jak
  wiata jednospadowa (Tablica 7.6) — praktyka inżynierska, nie zapis normy; w aplikacji oznaczane
  jako założenie.
- **M3/E6 napór wiatru** — prędkość referencyjna mogłaby pochodzić ze strefy NA.1 zamiast ręcznego
  wpisu; pełny tor `qp(z)` (kategoria terenu, chropowatość, turbulencja — rozdział 4) nie jest
  jeszcze opracowany.
