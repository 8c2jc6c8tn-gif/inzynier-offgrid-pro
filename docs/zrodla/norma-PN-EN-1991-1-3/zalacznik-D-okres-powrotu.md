# Załącznik D (informacyjny) — Wyznaczanie obciążenia śniegiem gruntu w zależności od okresu powrotu (str. 44–45)

1. Wartość obciążenia śniegiem gruntu o dowolnym, średnim okresie powrotu, innym niż ten, dla
   którego podano wartość charakterystyczną `s_k` (którego roczne prawdopodobieństwo przekroczenia
   z definicji wynosi 0,02), może być wyznaczona według p. D(2) do D(4). Jednakże, wyrażenie (D.1)
   nie powinno być stosowane do wyznaczania wartości o rocznym prawdopodobieństwie przekroczenia
   większym niż 0,2 (tj. o okresie powrotu krótszym niż około 5 lat).

2. Jeżeli dostępne dane pomiarowe wskazują na to, że rozkład rocznych wartości maksymalnych
   obciążenia śniegiem może być aproksymowany rozkładem prawdopodobieństwa Gumbela, wówczas
   zależność między wartością charakterystyczną obciążenia śniegiem gruntu, a obciążeniem śniegiem
   gruntu o średnim okresie powrotu `n` lat jest wyrażona wzorem:

   ```
   s_n = s_k × { [1 − V·(√6/π)·[ln(−ln(1−Pn)) + 0,57722]] / (1 + 2,5923·V) }     (D.1)
   ```

   w którym:
   - `s_k` — charakterystyczne obciążenie śniegiem gruntu (o okresie powrotu 50 lat, zgodnie z
     EN 1990:2002);
   - `s_n` — obciążenie śniegiem gruntu o okresie powrotu `n` lat;
   - `P_n` — roczne prawdopodobieństwo przekroczenia (równoważne w przybliżeniu `1/n`, gdzie `n`
     jest okresem powrotu w latach);
   - `V` — współczynnik zmienności rocznych maksymalnych wartości obciążenia śniegiem.

   UWAGA 1: W razie potrzeby odpowiednie władze krajowe mogą przyjąć inną funkcję rozkładu
   prawdopodobieństwa do oceny obciążenia śniegiem gruntu w zależności od okresu powrotu.

   UWAGA 2: Informacja o współczynniku zmienności może być podana przez odpowiednie władze
   krajowe. **(Polska, NB1.13: `V = 0,8·exp(−0,0006·A)`, wzór NB.3 — patrz
   `01-zalacznik-krajowy-NA-NB.md`; dla miejscowości ≤ 300 m n.p.m. dopuszcza się `V = 0,7`.)**

3. Wyrażenie (D.1) jest przedstawione graficznie na rysunku D.1: wykres `s_n/s_k` w funkcji okresu
   powrotu (20–100 lat), dwie krzywe dla `V = 0,2` i `V = 0,6` — przy okresie powrotu 50 lat obie
   krzywe przecinają się w `s_n/s_k = 1` (zgodnie z definicją `s_k`), poniżej 50 lat stosunek < 1,
   powyżej > 1, z szerszym rozstępem krzywych dla większego `V`.

4. Za zgodą odpowiednich władz krajowych, wyrażenie (D.1) może być także użyte do obliczenia
   obciążenia śniegiem gruntu o innych prawdopodobieństwach przekroczenia, np. dla:
   a) konstrukcji, dla których wyższe ryzyko przekroczenia wartości charakterystycznej jest
      uważane za możliwe do przyjęcia;
   b) konstrukcji, dla których wymagane jest bezpieczeństwo wyższe niż normalne.

**Zastosowanie w projekcie:** raczej drugorzędne dla kalkulatora podstawowego (który operuje na
`s_k` o standardowym okresie powrotu 50 lat, wg Tablicy NB.1) — przydatne, gdyby ekran miał
oferować tryb "podwyższone bezpieczeństwo" (krótszy okres powrotu wymagany → wyższe `s_n`) jako
opcję zaawansowaną, nie podstawową ścieżkę obliczeniową.
