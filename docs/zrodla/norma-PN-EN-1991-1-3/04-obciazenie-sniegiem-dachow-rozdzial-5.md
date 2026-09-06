# Rozdział 5 — Obciążenie śniegiem dachów (str. 14–20)

**To jest rdzeń kalkulatora "Obciążenie dachu śniegiem".** Wzór główny (5.1) w połączeniu z
`s_k` z Załącznika krajowego NB (`01-zalacznik-krajowy-NA-NB.md`) i współczynnikiem kształtu `μ`
z Tablicy 5.2 niżej daje kompletną ścieżkę obliczeniową.

## 5.1 Charakter obciążenia

1. (P) W projekcie należy wziąć pod uwagę, że śnieg może się rozkładać na dachu na wiele różnych
   sposobów.
2. Właściwości dachu i inne czynniki powodujące różny rozkład śniegu mogą obejmować:
   a) kształt dachu; b) jego właściwości termiczne; c) chropowatość jego powierzchni;
   d) ilość ciepła wytwarzanego pod dachem; e) bliskość sąsiednich budynków; f) otaczający teren;
   g) miejscowe warunki klimatyczne, w szczególności wietrzność, zmiany temperatury i
   prawdopodobieństwo opadów (zarówno deszczu, jak i śniegu).

## 5.2 Układy obciążenia

1. (P) Należy wziąć pod uwagę dwa podstawowe układy obciążenia: równomierne obciążenie śniegiem
   dachu (patrz 1.6.5); nierównomierne obciążenie śniegiem dachu (patrz 1.6.6).
2. Układy obciążenia należy ustalać, stosując 5.3 i załącznik B, w którym są podane warunki
   zgodnie z 3.3.
3. (P) Obciążenie śniegiem dachów należy ustalać następująco:

   a) w trwałej i przejściowej sytuacji obliczeniowej:

      ```
      s = μᵢ × Ce × Ct × sk      (5.1)
      ```

   b) w wyjątkowej sytuacji obliczeniowej, gdzie obciążenie śniegiem jest oddziaływaniem
      wyjątkowym (z wyjątkiem przypadków wymienionych w 5.2(3)P c):

      ```
      s = μᵢ × Ce × Ct × sAd     (5.2)
      ```

   c) w wyjątkowej sytuacji obliczeniowej, gdzie wyjątkowe zaspy śnieżne traktuje się jako
      oddziaływanie wyjątkowe i gdzie stosuje się załącznik B:

      ```
      s = μᵢ × sk                (5.3)
      ```

   gdzie: `μᵢ` — współczynnik kształtu dachu (rozdział 5.3 i załącznik B); `sk` — wartość
   charakterystyczna obciążenia śniegiem gruntu; `sAd` — wartość obliczeniowa wyjątkowego
   obciążenia śniegiem gruntu (4.3); `Ce` — współczynnik ekspozycji; `Ct` — współczynnik termiczny.

   **Dla Polski**: wzór (5.2) się nie stosuje (NB1.4 — wyjątkowe `s_Ad` nieużywane); wzór (5.3)
   stosuje się wyłącznie dla wyjątkowych zasp śnieżnych (NB1.5, dotyczy całego kraju) — wzór
   podstawowy dla zwykłego projektowania to (5.1).

4. Należy przyjmować, że obciążenie działa pionowo na obszarze rzutu dachu na płaszczyznę poziomą.
5. Jeżeli przewiduje się sztuczne usuwanie lub przemieszczanie śniegu na dachu, to dach należy
   zaprojektować z uwzględnieniem odpowiednich układów obciążeń (układy podane w tym rozdziale
   wywodzą się tylko z naturalnych rozkładów śniegu na dachach).
6. W regionach, gdzie możliwe są opady deszczu na śnieg, a następnie kolejno topnienie i
   zamarzanie śniegu, należy zwiększyć obciążenie śniegiem dachu, zwłaszcza w przypadkach, gdy
   śnieg i lód mogą blokować odwodnienie dachu.
7. Do wyznaczania obciążenia śniegiem dachu należy stosować współczynnik ekspozycji `Ce`.
   Wybierając wartość `Ce`, należy rozważyć dalsze zmiany otoczenia projektowanego budynku. Należy
   przyjąć `Ce = 1,0`, jeżeli nie wyszczególniono inaczej dla różnych warunków terenowych.

   ### Tablica 5.1 — Zalecane wartości Ce dla różnych warunków terenowych

   | Teren | Ce |
   |---|---|
   | Wystawiony na działanie wiatru ᵃ | 0,8 |
   | Normalny ᵇ | 1,0 |
   | Osłonięty od wiatru ᶜ | 1,2 |

   ᵃ *Teren wystawiony na działanie wiatru*: płaskie obszary bez przeszkód, otwarte ze wszystkich
   stron, bez osłon lub z niewielkimi osłonami uformowanymi przez teren, wyższe budowle lub
   drzewa.

   ᵇ *Teren normalny*: obszary, na których nie występuje znaczące przenoszenie śniegu przez wiatr
   na budowle z powodu ukształtowania terenu, innych budowli lub drzew.

   ᶜ *Teren osłonięty*: obszary, na których rozpatrywana budowla jest znacznie niższa niż
   otaczający teren albo otoczona wysokimi budowlami lub drzewami.

8. Współczynnik termiczny `Ct` powinien być stosowany do oceny zmniejszenia obciążenia śniegiem
   dachów o wysokim współczynniku przenikania ciepła (> 1 W/(m²K)), w szczególności niektórych
   dachów krytych szkłem, z powodu topnienia śniegu przez uchodzące ciepło.

   Dla wszystkich innych przypadków: `Ct = 1,0`.

   *(Polska, NB1.8: podaje konkretny wzór na `Ct` — patrz `01-zalacznik-krajowy-NA-NB.md`, wzór
   NB.1/NB.2, dla `1 ≤ U ≤ 4,5 W/(m²K)` i `5°C < t_i ≤ 18°C`.)*

## 5.3 Współczynniki kształtu dachu

### 5.3.1 Postanowienia ogólne

1. W podrozdziale 5.3 podano współczynniki kształtu dachu dla równomiernego i nierównomiernego
   obciążenia śniegiem dla wszystkich typów dachów przedstawionych w tej normie, z pominięciem
   wyjątkowych zasp śnieżnych ujętych w załączniku B, w którym dopuszcza się ich uwzględnienie.
2. Należy zwracać specjalną uwagę na przyjmowane do obliczeń współczynniki kształtu dachu,
   zwłaszcza jeżeli zewnętrzna geometria dachu może prowadzić do zwiększenia obciążenia śniegiem,
   które może być uznane za znaczące w porównaniu z obciążeniem dachu o liniowym profilu.
3. Współczynniki kształtu dachu podane w 5.3.2, 5.3.3 i 5.3.4 są przedstawione na rysunku 5.1
   (wykres `μ` w funkcji kąta nachylenia `α`: `μ1` maleje liniowo od 0,8 przy 0-30° do 0 przy 60°;
   `μ2` rośnie liniowo od 0,8 przy 0° do 1,6 przy 30°, potem stały 1,6 do 60°).

### 5.3.2 Dachy jednopołaciowe

Współczynnik kształtu dachu `μ1`, który należy stosować do dachów jednopołaciowych, jest podany w
poniższej **Tablicy 5.2**.

### Tablica 5.2 — Współczynniki kształtu dachu

| Kąt spadku dachu `α` | `μ1` | `μ2` |
|---|---|---|
| 0° ≤ α ≤ 30° | 0,8 | 0,8 + 0,8·α/30 |
| 30° < α < 60° | 0,8·(60−α)/30 | 1,6 |
| α ≥ 60° | 0,0 | — (brak zastosowania) |

Wartości podane w tablicy 5.2 stosuje się wówczas, gdy nie ma zabezpieczeń przed zsunięciem się
śniegu z dachu. Jeżeli na dachu są barierki przeciwśnieżne lub inne przeszkody, albo jeżeli dolna
krawędź dachu jest zakończona attyką, to wówczas współczynnik kształtu dachu nie powinien być
mniejszy niż 0,8.

Układ obciążenia dla dachu jednopołaciowego (rysunek 5.2: `μ1` jednolicie na całej połaci pod
kątem `α`) stosuje się zarówno do obciążeń równomiernych, jak i nierównomiernych.

### 5.3.3 Dachy dwupołaciowe

Współczynniki kształtu dachu, które należy stosować do dachów dwupołaciowych, są podane na
rysunku 5.3, przy czym współczynnik `μ1` jest podany w tablicy 5.2 (jak wyżej). Ta sama zasada o
barierkach/attyce (μ ≥ 0,8) obowiązuje.

**Rysunek 5.3 — trzy przypadki:**
- (i) `μ1(α1)` na całej połaci lewej, `μ1(α2)` na całej połaci prawej;
- (ii) `0,5·μ1(α1)` na połaci lewej, `μ1(α2)` na połaci prawej;
- (iii) `μ1(α1)` na połaci lewej, `0,5·μ1(α2)` na połaci prawej.

Równomierne obciążenie śniegiem należy stosować według przypadku (i). Nierównomierne obciążenie
śniegiem należy stosować według przypadków (ii) i (iii), chyba że podano inaczej dla warunków
miejscowych.

### 5.3.4 Dachy wielopołaciowe

Współczynniki kształtu dachu dla dachów wielopołaciowych są podane w tablicy 5.2 i pokazane na
rysunku 5.4. Równomierne obciążenie śniegiem należy stosować według przypadku (i) rysunku 5.4.
Nierównomierne — według przypadku (ii), chyba że podano inaczej dla warunków miejscowych (tam,
gdzie dopuszcza się to w załączniku krajowym, może być wykorzystywany załącznik B).

**Rysunek 5.4 — przypadki:**
- (i) naprzemiennie `μ1(α1)`, `μ1(α2)`, `μ1(α1)`, `μ1(α2)` na kolejnych połaciach (bez efektu
  zagłębienia);
- (ii) w zagłębieniu: `μ1(α1)` na jednej połaci, `μ2(ᾱ)` w zagłębieniu (gdzie
  `ᾱ = (α1+α2)/2`), `μ1(α2)` na drugiej połaci — profil narastający do zagłębienia (kalenicy
  dolnej) i opadający.

Należy zwrócić szczególną uwagę na wartości współczynnika kształtu dachu w projektowaniu dachów
wielopołaciowych, jeżeli jedna połać lub obie połacie są nachylone do środka zagłębienia pod
kątem większym niż 60°. *(Polska, NB1.9: wtedy `μ2 = 1,6`.)*

### 5.3.5 Dachy walcowe

Współczynniki kształtu dachu, które należy stosować dla dachów walcowych, jeżeli brak barierek
przeciwśnieżnych (patrz też rysunek 5.6):

```
dla β > 60°:   μ3 = 0                    (5.4)
dla β ≤ 60°:   μ3 = 0,2 + 10·h/b         (5.5)
```

Należy określić górną wartość `μ3`. Zalecaną górną wartością `μ3` jest 2,0 (rysunek 5.5: wykres
`μ3` w funkcji `h/b` — liniowy wzrost od 0 do 2,0 przy `h/b = 0,18`, dalej stały na poziomie 2,0).

Równomierne obciążenie śniegiem należy stosować według przypadku (i) rysunku 5.6. Nierównomierne —
przypadek (ii), chyba że podano inaczej dla warunków miejscowych.

**Rysunek 5.6 — przypadki:**
- (i) `0,8` jednolicie na całej szerokości `b`;
- (ii) profil trójkątny: `0,5·μ3` z jednej strony narastający do `μ3`, podzielony na 4 równe
  odcinki `l_s/4`, przy wysokości walca `h`, kąt 60° oznaczony na obrysie łuku, `β` — kąt między
  poziomem a styczną do krzywizny dachu.

### 5.3.6 Dachy bliskie i przylegające do wyższych budowli

Współczynniki kształtu dachu dla dachów przylegających do wyższych budowli, podane wzorami i na
rysunku 5.7:

```
μ1 = 0,8   (przy założeniu, że niższy dach jest płaski)     (5.6)
μ2 = μs + μw                                                 (5.7)
```

gdzie:
- `μs` — współczynnik kształtu dachu uwzględniający efekt zeslizgu śniegu z dachu wyższego:
  - dla `α ≤ 15°`: `μs = 0`;
  - dla `α > 15°`: `μs` jest wyznaczany jako dodatkowe obciążenie wynoszące do 50% całkowitego,
    maksymalnego obciążenia śniegiem sąsiedniej połaci dachu wyższego, obliczonego według 5.3.3.
- `μw` — współczynnik kształtu dachu uwzględniający wpływ wiatru:

  ```
  μw = (b1 + b2) / (2h) ≤ γ·h/sk      (5.8)
  ```

  gdzie `γ` — ciężar objętościowy śniegu, który w tych obliczeniach może być przyjmowany jako
  2 kN/m³. Należy określić górną i dolną wartość `μw`. Zalecany zakres: `0,8 ≤ μw ≤ 4`.

Długość zaspy jest określona jako: `l_s = 2h` (5.9). Zalecane wartości `l_s` zawierają się w
przedziale `5 ≤ l_s ≤ 15 m`.

UWAGA 3: Jeżeli `b2 < l_s`, to współczynnik na końcu niższego dachu jest wyznaczany z prostej
interpolacyjnej między `μ1` a `μ2`, uciętej na końcu tego dachu (patrz rysunek 5.7).

Równomierne obciążenie śniegiem należy stosować według przypadku (i) rysunku 5.7. Nierównomierne —
przypadek (ii), chyba że podano inaczej dla warunków miejscowych (tam, gdzie dopuszcza się to w
załączniku krajowym, może być wykorzystany załącznik B — **Polska, NB1.10: dopuszcza się użycie
załącznika B, rozdział B3**).

**Rysunek 5.7** przedstawia dwa warianty geometrii (zależnie od tego, czy `b2 < l_s`), z
trapezoidalnym profilem obciążenia `μ2 = μs + μw` opadającym do `μ1` na końcu niższego dachu.
