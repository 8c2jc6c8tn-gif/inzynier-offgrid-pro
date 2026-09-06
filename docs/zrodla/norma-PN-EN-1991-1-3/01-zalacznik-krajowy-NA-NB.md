# Załącznik krajowy NA/NB — PN-EN 1991-1-3:2005 (str. 2–5)

Przedmowa krajowa: norma opracowana przez KT nr 102 ds. Podstaw Projektowania Konstrukcji
Budowlanych, zatwierdzona przez Prezesa PKN 15.09.2005 r. Jest tłumaczeniem — bez jakichkolwiek
zmian — angielskiej wersji normy europejskiej EN 1991-1-3:2003.

## Załącznik krajowy NA (informacyjny) — Odpowiedniki krajowe norm i dokumentów powołanych normatywnie

UWAGA źródła: oryginały norm powołanych, które nie mają odpowiedników krajowych, są dostępne
w Ośrodku Informacji Normalizacyjnej PKN.

| Normy powołane w EN | Odpowiedniki krajowe |
|---|---|
| EN 1990:2002 | PN-EN 1990:2004 Eurokod — Podstawy projektowania konstrukcji |
| EN 1991-1-1:2002 | PN-EN 1991-1-1:2004 Eurokod 1: Oddziaływania na konstrukcje — Część 1-1: Oddziaływania ogólne — Ciężar objętościowy, ciężar własny, obciążenia użytkowe w budynkach |
| EN 1991-2:2003 | — (brak odpowiednika krajowego) |

## Załącznik krajowy NB (informacyjny) — Postanowienie krajowe dotyczące obciążenia śniegiem

### NB 1 Wprowadzone zmiany

- **NB1.1** — dotyczy punktu 1.1(2). Dopuszcza się stosowanie niniejszej normy w projektowaniu
  obiektów położonych w Polsce powyżej 1500 m nad poziomem morza. *(Norma bazowa EN nie ma
  zastosowania powyżej 1500 m, chyba że podano inaczej — Polska jawnie to dopuszcza.)*
- **NB1.2** — dotyczy punktu 1.1(3). Informacje krajowe dotyczące sytuacji obliczeniowych i
  układów obciążeń zróżnicowanych zależnie od warunków klimatycznych są podane w NB 1.6.
- **NB1.3** — dotyczy punktów: 1.1(4), 5.2(2) oraz 5.3.4(4). Dopuszcza się stosowanie załącznika B
  w wyjątkowej sytuacji obliczeniowej, z wyjątkiem rozdziału B2, punkty B2(1) – B2(3).
- **NB1.4** — dotyczy punktów: 2(3) i 4.3(1). **W Polskiej Normie nie ma zastosowania wyjątkowe
  obciążenie śniegiem gruntu** (tj. `s_Ad = C_esl × s_k`, wzór 4.1, nie stosuje się w Polsce).
- **NB1.5** — dotyczy punktu 2(4). Obciążenie wyjątkowymi zaspami śnieżnymi należy traktować jako
  oddziaływanie wyjątkowe, **niezależnie od położenia geograficznego na całym terytorium Polski**.
- **NB1.6** — dotyczy punktów: 3.3(1) i 3.3(3) oraz A(1) (Tablica A1). Zaleca się stosowanie
  przypadku A oraz przypadku B2 (patrz `zalacznik-A-sytuacje-obliczeniowe.md`).
- **NB1.7** — dotyczy punktu 4.1(1). **Kluczowy dla kalkulatora.** Wartość charakterystyczną
  obciążenia śniegiem gruntu (`s_k`) należy wyznaczać zgodnie z mapą pokazaną na rysunku NB.1 i
  tablicą NB.1 (patrz niżej). Na granicach stref, w pasmach o szerokości 10 km po obu stronach
  granicy, można przyjmować wartość średnią z dwóch sąsiadujących ze sobą stref. Dopuszcza się
  uzgodnienie między inwestorem a odpowiednimi władzami innej wartości charakterystycznej niż
  podana, aby uwzględnić w indywidualnym projekcie wyjątkowe warunki miejscowe. Wartość tę należy
  wyznaczyć statystycznie, na podstawie wieloletnich danych pomiarowych, lub stosując załącznik D.
- **NB1.8** — dotyczy punktu 5.2(8). Współczynnik termiczny `C_t` można obliczać, dla
  1 W/(m²K) ≤ U ≤ 4,5 W/(m²K), z wzoru:

  ```
  C_t = 1 − 0,054 × (s_k / 3,5)^0,25 × Δt × {sin[57,3 × (0,4×U − 0,1)]}^0,25    (NB.1)
  ```

  gdzie: `s_k` — wartość charakterystyczna obciążenia śniegiem gruntu, kN/m²; `Δt` — różnica
  temperatury, °C; `U` — współczynnik przenikania ciepła przegrody dachowej, W/(m²K).

  Różnicę temperatury oblicza się z wzoru: `Δt = t_i − 5, °C` (NB.2), gdzie `t_i` — temperatura
  wewnętrzna.

  Wzór (NB.1) stosuje się w zakresie `5°C < t_i ≤ 18°C`. Jeżeli temperatura wewnętrzna w
  pomieszczeniu pod rozpatrywaną przegrodą dachową `t_i ≤ 5°C`, to należy przyjmować `C_t = 1,0`;
  jeżeli `t_i > 18°C`, to należy przyjmować `t_i = 18°C`.

  Zastosowanie współczynnika termicznego `C_t < 1,0` powinno być starannie rozważone.
- **NB1.9** — dotyczy punktu 5.3.4(4). Jeżeli jedna połać lub obie połacie są nachylone do środka
  zagłębienia pod kątem większym niż 60°, to należy przyjmować `μ2 = 1,6`.
- **NB1.10** — dotyczy punktu 5.3.6(3). Dopuszcza się użycie załącznika B, rozdział B3.
- **NB1.11** — dotyczy punktu 6.2.(2). Dopuszcza się użycie załącznika B, rozdział B4.
- **NB1.12** — dotyczy punktu 6.3(1). Zaleca się stosowanie (nawisów śnieżnych na krawędzi dachu)
  w miejscach położonych powyżej 300 m nad poziomem morza, a także na całym obszarze strefy 4.
- **NB1.13** — dotyczy punktu D(2). Zależność między wartością charakterystyczną obciążenia
  śniegiem gruntu, a obciążeniem śniegiem gruntu o średnim okresie powrotu `n` lat jest wyrażona w
  normie wzorem (D.1) (patrz `zalacznik-D-okres-powrotu.md`). Wartości współczynnika zmienności
  należy obliczać z wzoru:

  ```
  V = 0,8 × exp(−0,0006 × A)    (NB.3)
  ```

  gdzie: `A` — wysokość nad poziomem morza, m.

  Dla miejscowości położonych nie wyżej niż 300 m nad poziomem morza dopuszcza się przyjmowanie
  wartości `V = 0,7`.

### NB 2 Wymienione w Przedmowie — Załącznik krajowy punkty pozostające bez zmian

W odniesieniu do pozostałych punktów wymienionych w "Przedmowie – Załącznik krajowy do EN 1991-1-3"
nie wprowadza się zmian.

## Rysunek NB.1 — Podział Polski na strefy obciążenia śniegiem gruntu

Mapa Polski podzielona na 5 stref geograficznych (opisana słownie, bo źródło jest rysunkiem
graficznym — granice stref w oryginale są liniami na mapie administracyjnej, nie da się ich
odtworzyć jako współrzędnych z samego tekstu):

- **Strefa 1** — pas południowo-zachodni (część woj. dolnośląskiego, opolskiego i śląskiego
  przygranicznych z Czechami — obszar oznaczony na mapie numerem "1", w lewym dolnym rogu mapy).
- **Strefa 2** — największy obszar, pas centralny kraju (od zachodu przez środek do wschodu).
- **Strefa 3** — dwa oddzielne obszary: pas zachodni (przy granicy z Niemcami) i pas
  południowo-wschodni.
- **Strefa 4** — pas północno-zachodni (Pomorze Zachodnie i część Wielkopolski/Kujaw).
- **Strefa 5** — mały obszar w okolicach Zakopanego/Tatr (południe woj. małopolskiego),
  oznaczony na mapie strzałką z etykietą "5" — górska strefa najwyższego obciążenia.

**Ta sama mapa jest odtworzona jako Rysunek C.13 w Załączniku C** (`zalacznik-C-mapy-europejskie.md`),
identyczna treść, potwierdzona krzyżowo przy odczycie obu stron.

## Tablica NB.1 — Wartości charakterystyczne obciążenia śniegiem gruntu w Polsce

| Strefa | `s_k`, kN/m² |
|---|---|
| 1 | `0,007A − 1,4`;  `s_k ≥ 0,70` |
| 2 | `0,9` |
| 3 | `0,006A − 0,6`;  `s_k ≥ 1,2` |
| 4 | `1,6` |
| 5 | `0,93 × exp(0,00134A)`;  `s_k ≥ 2,0` |

UWAGA źródła: `A` = wysokość nad poziomem morza (m).

**To jest kluczowa tabela dla kalkulatora** — wzór `s_k(strefa, A)` w połączeniu z Rozdziałem 5
(`04-obciazenie-sniegiem-dachow-rozdzial-5.md`, wzór główny `s = μᵢ × Ce × Ct × sk`) daje pełną
ścieżkę obliczeniową od lokalizacji budynku (strefa + wysokość n.p.m.) do obciążenia dachu w kN/m².
