# Rozdział 6 — Obciążenia miejscowe (str. 21–22)

## 6.1 Postanowienia ogólne

1. W niniejszym rozdziale podano obciążenia do miejscowego sprawdzania:
   - oddziaływania zasp śnieżnych przy występach i przeszkodach;
   - krawędzi dachu (nawisy śnieżne);
   - barierek przeciwśnieżnych.
2. Należy rozważyć trwałą i przejściową sytuację obliczeniową.

## 6.2 Zaspy przy występach i przeszkodach

1. W warunkach wietrznych zaspy śniegu mogą się pojawiać na każdym dachu z przeszkodami, gdyż
   przeszkody tworzą obszary cienia aerodynamicznego, na których gromadzi się śnieg.
2. Współczynniki kształtu dachu i długości zasp na dachach quasi-poziomych należy przyjmować jak
   podano niżej (patrz rysunek 6.1), chyba że podano inaczej dla warunków miejscowych:

   ```
   μ1 = 0,8       μ2 = γ·h/sk                          (6.1)
   z ograniczeniem: 0,8 ≤ μ2 ≤ 2,0                       (6.2)
   ```

   gdzie `γ` — ciężar objętościowy śniegu, który w tych obliczeniach może być przyjmowany jako
   2 kN/m³.

   ```
   l_s = 2h                                              (6.3)
   z ograniczeniem: 5 ≤ l_s ≤ 15 m
   ```

   UWAGA: Tam, gdzie dopuszcza się to w załączniku krajowym, do ustalenia nierównomiernego
   obciążenia śniegiem może być wykorzystany załącznik B. **(Polska, NB1.11: dopuszcza się użycie
   załącznika B, rozdział B4.)**

   **Rysunek 6.1** przedstawia dwie zaspy trójkątne (`μ1`/`μ2`, długość `l_s` każda) po obu
   stronach przeszkody (bariera pionowa) wystającej ponad dach o wysokości `h`.

## 6.3 Nawisy śnieżne na krawędzi dachu

1. Należy rozpatrywać nawisy śnieżne na krawędzi dachu.

   UWAGA: Załącznik krajowy może określać warunki stosowania tego postanowienia. Zaleca się, aby
   było ono stosowane dla miejsc położonych powyżej 800 metrów nad poziomem morza. **(Polska,
   NB1.12: zaleca się stosowanie w miejscach powyżej 300 m n.p.m., a także na całym obszarze
   strefy 4 — niezależnie od wysokości.)**

2. W projektowaniu tych części dachu, które wystają poza ściany, należy brać pod uwagę nawis
   śnieżny, jako obciążenie dodatkowe do obciążenia działającego na tę część dachu. Można
   przyjmować, że obciążenie od nawisu śnieżnego działa na krawędzi dachu i może ono być
   obliczane w sposób następujący:

   ```
   s_e = k × s² / γ         (6.4)
   ```

   gdzie:
   - `s_e` — obciążenie nawisem śniegu na metr długości krawędzi dachu (patrz rysunek 6.2);
   - `s` — najbardziej niekorzystny przypadek równomiernego obciążenia śniegiem, właściwy dla
     rozpatrywanego dachu (patrz 5.2);
   - `γ` — ciężar objętościowy śniegu, który w tych obliczeniach może być przyjmowany jako
     3 kN/m³;
   - `k` — współczynnik uwzględniający nieregularny kształt nawisu śniegu.

   UWAGA: Wartości `k` mogą być podane w załączniku krajowym. Zalecany sposób obliczania `k` jest
   następujący: `k = 3/d`, lecz `k ≤ d·γ`, gdzie `d` — grubość warstwy śniegu na dachu w metrach
   (patrz rysunek 6.2 — nawis w kształcie zakrzywionego "haka" zwisającego z krawędzi dachu,
   grubość warstwy `d`, obciążenie `s_e` skierowane pionowo w dół).

## 6.4 Obciążenie śniegiem barierek przeciwśnieżnych i innych przeszkód

1. W pewnych warunkach śnieg może się zsuwać z dachów nachylonych lub łukowych. Należy przyjmować,
   że współczynnik tarcia między śniegiem a dachem jest równy zeru. W tych obliczeniach siłę `F_s`,
   wywieraną w kierunku zeslizgu przez zsuwającą się masę śniegu, działającą na jednostkę
   długości budynku, wyznacza się ze wzoru:

   ```
   F_s = s × b × sin α       (6.5)
   ```

   w którym:
   - `s` — najbardziej niekorzystny przypadek równomiernego obciążenia śniegiem, właściwy dla
     obszaru dachu, z którego śnieg mógłby się zsuwać (patrz 5.2 i 5.3);
   - `b` — szerokość dachu w planie (rzutu na płaszczyznę poziomą) od barierki do następnej
     barierki lub do kalenicy;
   - `α` — nachylenie dachu, mierzone do płaszczyzny poziomej.

**Zastosowanie w projekcie:** ten rozdział jest istotny dla konstrukcji wsporczej paneli PV na
dachu nachylonym — zarówno obciążenie samego dachu pod panelami (rozdz. 5), jak i siła zeslizgu
śniegu na dolną krawędź instalacji PV (wzór 6.5, jeśli panele/ich rama pełnią funkcję "barierki"
zatrzymującej zsuwający się śnieg) mogą wymagać sprawdzenia.
