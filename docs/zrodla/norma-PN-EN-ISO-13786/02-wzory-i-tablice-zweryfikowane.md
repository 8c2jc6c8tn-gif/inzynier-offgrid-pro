# EN ISO 13786:2007 — wzory i tablice zweryfikowane wizualnie

**[DATA — TRANSKRYPCJA POPRAWIONA]** Ten plik zastępuje wzory/tablice z `01-tresc-ocr.txt`
(tam zniekształcone). Metoda (27.09.2026): odczyt wizualny każdej strony treści (PDF str. 6–26,
render 150 DPI, fragmenty 400 DPI) + dwa niezależne przebiegi OCR (250 DPI auto / 300 DPI `--psm 6`)
porównane liczbowo strona po stronie + **niezależne odtworzenie w Pythonie obu przykładów
Załącznika D** z przepisanych wzorów (skrypt niżej) — zgodność do ostatniej podanej cyfry, poza
dwoma miejscami oznaczonymi ⚠️ (błędy/niespójności samego oryginału, nie transkrypcji).

Numeracja: „str. N” = strona normy ISO (PDF = N + 5).

## Rozdz. 3 — definicje i symbole (str. 2–6)

- (1) θn(t) = θ̄n + |θ̂n|·cos(ωt + ψ);  (2) Φn(t) analogicznie z φ.
- (4) Φ̂m = Lmm·θ̂m − Lmn·θ̂n (okresowa przewodność cieplna L, W/K).
- (5) Cm = (1/ω)·|Lmm − Lmn| (pojemność cieplna, J/K).
- Przesunięcie czasowe Δt: okres między maksimum przyczyny a maksimum skutku.
- Element płaski: najmniejszy promień krzywizny ≥ 5 × grubość. Warstwa jednorodna: największa
  niejednorodność ≤ 1/5 grubości warstwy.
- (6) Ymm = q̂m/θ̂m (admitancja cieplna, W/(m²·K)); (7) Ymn = −q̂m/θ̂n (okresowy współczynnik
  przenikania ciepła, W/(m²·K)).
- (8) κm = Cm/A = (1/ω)·|Ymm − Ymn| (powierzchniowa pojemność cieplna, J/(m²·K)); (9) Cm = A·κm.
- (10) f = |q̂m|/(|θ̂n|·U) = |Ymn|/U, m ≠ n (współczynnik tłumienia).
- **(11) δ = √(λ·T / (π·ρ·c))** — okresowa głębokość wnikania (amplituda maleje e-krotnie).
- (12) (θ̂2, q̂2)ᵀ = Z·(θ̂1, q̂1)ᵀ, Z = [[Z11, Z12], [Z21, Z22]].
- Symbole (3.2): A m², C J/K, Lmn W/K, R m²·K/W, T s, U W/(m²·K), Ymm/Ymn W/(m²·K), a m²/s,
  c J/(kg·K), d m, f —, q W/m², t s lub h, x m, Δt s lub h (dodatnie = wyprzedzenie, ujemne =
  opóźnienie), δ m, Φ W, ξ —, κ J/(m²·K), λ W/(m·K), ρ kg/m³, θ °C, ω = 2π/T rad/s, φ, ψ rad.
- Indeksy (3.3): a — warstwa powietrza, e — zewn., i — wewn., m, n — strefy, s — powierzchnia,
  ee — środowisko–środowisko.

## Rozdz. 4 — okresy (str. 6)

1 h = 3 600 s; **1 doba = 86 400 s** (wahania meteorologiczne dobowe, obniżenia nocne);
1 tydzień = 604 800 s; 1 rok = 31 536 000 s (wymiana ciepła z gruntem).

## Rozdz. 5–7 — metoda macierzowa (str. 6–10)

Dane: λ, c, ρ — wartości obliczeniowe materiałów. Mostki cieplne w elementach płaskich
„nie wpływają istotnie” na charakterystyki dynamiczne — pomija się (6.1); elementy niepłaskie
i z bardzo istotnymi mostkami — metody numeryczne wg ISO 10211.

- (13) ξ = d/δ
- (14) Z11 = Z22 = cosh ξ·cos ξ + j·sinh ξ·sin ξ
  Z12 = −(δ/2λ)·{sinh ξ·cos ξ + cosh ξ·sin ξ + j·[cosh ξ·sin ξ − sinh ξ·cos ξ]}
  Z21 = −(λ/δ)·{sinh ξ·cos ξ − cosh ξ·sin ξ + j·[sinh ξ·cos ξ + cosh ξ·sin ξ]}
- (15) pustka powietrzna: Za = [[1, −Ra], [0, 1]] (Ra wg ISO 6946, pojemność pomijana).
- (16) Z = ZN·ZN−1·…·Z2·Z1, **warstwa 1 = najbardziej wewnętrzna**.
- (17) Zee = Zs2·Z·Zs1;  (18) Zs = [[1, −Rs], [0, 1]], Rs wg ISO 6946 (orientacja nieznana →
  pionowa, przepływ poziomy).
- (19) Y11 = −Z11/Z12, Y22 = −Z22/Z12 (Y11 — strona wewnętrzna).
- (20) ΔtY = (T/2π)·arg(Ymm), argument w zakresie 0…2π.
- (21) przegroda wewnętrzna: Y*mm = Ymm − Ymn.
- (22) κ1 = (T/2π)·|(Z11 − 1)/Z12|;  (23) κ2 = (T/2π)·|(Z22 − 1)/Z12|
  (przegrody zewnętrzne i wewnętrzne; UWAGA: dla przegrody wewnętrznej κm = |Y*mm|/ω).
- (24) Y12 = −1/Z12;  (25) f = |Y12|/U0 (U0 wg ISO 6946 **bez** mostków); f zawsze < 1.
- (26) Δtf = (T/2π)·arg(Z12), argument w zakresie −2π…0.
  **⚠️ Niespójność w oryginale:** wartości przesunięcia Y12 w Tablicach D.1 (−5,68 h) i D.4
  (−8,11 h) odtwarzają się tylko jako (T/2π)·arg(**Y12**) = (T/2π)·arg(−1/Z12) w zakresie −2π…0;
  wzór (26) dosłownie (arg Z12) daje −6,32 h i −3,89 h. Nie rozstrzygane tu — przed użyciem
  przesunięcia fazowego w kodzie decyzja z właścicielem projektu (dziś żaden kalkulator go nie
  potrzebuje).

Rozdz. 8 (str. 10): raport; 8.2 — minimalna specyfikacja wyrobu: **pojemności cieplne i
współczynnik tłumienia dla okresu 1 doby**.

## Załącznik A (normatywny) — uproszczone obliczenie pojemności cieplnej (str. 11–12)

A.1: tylko elementy płaskie; do zgrubnej oceny bezwładności cieplnej całej strefy, **nie** do
charakterystyki wyrobu; wynik musi mieć adnotację, że liczono wg Załącznika A i którym
przybliżeniem.

- **A.2.2 cienka warstwa** (d < δ/2 i następna warstwa izolacyjna): (A.1) κm = d·ρ·c.
- **A.2.3 półprzestrzeń** (d > 2δ): (A.2) κm ≅ δ·ρ·c/√2.
- **A.2.4 grubość efektywna** — umowna dyfuzyjność a = 0,7 × 10⁻⁶ m²/s. dT jednej strony =
  **minimum z:** a) połowy całkowitej grubości elementu; b) grubości materiałów od powierzchni do
  pierwszej warstwy izolacyjnej (bez powłok niebędących częścią elementu); c) grubości
  maksymalnej wg Tablicy A.1.

  **Tablica A.1 — Maksymalna grubość efektywna zależnie od okresu wahań**

  | Okres wahań | 1 godzina | 1 doba | 1 tydzień |
  |---|---|---|---|
  | Maksymalna grubość efektywna | 20 mm | **100 mm** | 250 mm |

  UWAGA (oryginał): wartości bardzo przybliżone; umowna dyfuzyjność bliska betonowi, tynkowi,
  zaprawie; typowe materiały budowlane (bez izolacji i metali) 0,12 × 10⁻⁶ m²/s (sosna) do
  1 × 10⁻⁶ m²/s (wapień) → rzeczywista grubość efektywna 40 % do 120 % wartości umownej.
  Wartości dla konkretnych materiałów mogą być podane w załączniku krajowym.

  (A.3) κm = Σi ρi·di·ci, przy Σi di = dT. Element w całości wewnątrz strefy: suma pojemności z obu
  powierzchni. Metoda może **zawyżać** pojemność np. dla drewna i betonu komórkowego.
- **A.3 opór przejmowania:** (A.4) κ′m = √( κm² / (1 + ω²·κm²·(R + Rs)²) ), Rs — opór
  przejmowania, R — opór warstwy o pomijalnej masie przykrywającej element masywny.

## Załącznik B (informacyjny) — zasada i zastosowania (str. 13–16)

- (B.4) q̄ = U·(θ̄i − θ̄e). |Z11| — współczynnik amplitudy temperatury; |Z21| — amplituda gęstości
  strumienia po stronie 2 przy 1 K po stronie 1; |Z12| — amplituda temperatury po stronie 2 przy
  1 W/m² po stronie 1; |Z22| — współczynnik amplitudy strumienia.
- (B.5) Δtij = (T/2π)·arg(Zij).  (B.6) q̂2 = Z21·θ̂1 + Z22·q̂1.  (B.7) θ̂2 = Z11·θ̂1 + Z12·q̂1.
- (B.8) (q̂1, −q̂2)ᵀ = (1/Z12)·[[−Z11, 1], [1, −Z22]]·(θ̂1, θ̂2)ᵀ.  (B.9)–(B.11) jak (19), (24);
  zawsze Y21 = Y12.
- **(B.12) Q = 2·C1·|θ̂1|** — energia zmagazynowana po stronie 1 przy zmianie temperatury od
  −|θ̂1| do +|θ̂1| w pół okresu.
- (B.13) Φ̂j = Σk (L11,k·θ̂j − L12,k·θ̂k).
- Przykład chłodni: (B.14) Φ̄i = (Aw·Uw + Ar·Ur)·(θ̄e − θi); (B.15) Φ̂i = |Aw·Y12,w + Ar·Y12,r|·θ̂e
  (Y12 dla T = 24 h, warstwa wewnętrzna pierwsza); (B.16) Φp = Φ̄i + Φ̂i (moc szczytowa).

## Załącznik C (informacyjny) — programowanie (str. 17–18)

Schemat C.1: dane materiałów/grubości → okres → macierze warstw i powierzchni (13)–(15), (18) →
iloczyn → charakterystyki → wyniki → (kolejny okres?). (C.1) z = [[a, b], [−b, a]]; (C.2) |z| = √(a² + b²).

**Tablica C.1 — argument liczby zespolonej** (arctan w zakresie −π/2…+π/2)

| a, b | arg(z) dla admitancji | arg(z) dla okresowego wsp. przenikania |
|---|---|---|
| b = 0 | 0 | 0 |
| a > 0, b > 0 | arctan(b/a) | arctan(b/a) − 2π |
| a = 0, b > 0 | π/2 | −3π/2 |
| a < 0, b > 0 | arctan(b/a) + π | arctan(b/a) − π |
| a > 0, b < 0 | arctan(b/a) + 2π | arctan(b/a) |
| a = 0, b < 0 | 3π/2 | −π/2 |
| a < 0, b < 0 | arctan(b/a) + π | arctan(b/a) − π |

## Załącznik D (informacyjny) — przykłady (str. 19–21)

**D.1 — ściana jednowarstwowa, beton 200 mm:** λ = 1,8 W/(m·K), ρ = 2 400 kg/m³,
c = 1 000 J/(kg·K); T = 24 h → δ = 0,144 m, ξ = 1,393.
Macierz warstwy: Z11 = Z22 = 0,378 8 + 1,858j; Z21 = 22,16 − 30,55j;
Z12 = −0,097 25 − 0,075 4j **⚠️ [sic] — wzór (14) daje −0,097 25 − 0,070 5j, a macierz ściany
z oporami przejmowania podana w tym samym przykładzie (niżej) zgadza się właśnie z −0,070 5j;
najpewniej literówka oryginału (odczyt wizualny 400 DPI potwierdza, że w PDF stoi „0,075 4”).**
Z Rsi = 0,13, Rse = 0,04 m²·K/W: Z11 = −0,508 + 3,081j; Z12 = −0,046 − 0,545j;
Z21 = 22,16 − 30,55j; Z22 = −2,502 + 5,830j.

Tablica D.1: Y11 5,70 W/(m²·K), 0,95 h; Y22 11,59, 1,87 h; Y12 1,83, −5,68 h (⚠️ patrz (26));
κ1 86 kJ/(m²·K); κ2 171 kJ/(m²·K); U 3,56 W/(m²·K); f 0,514.
Pojemności bez Rs: dokładnie κ1 = κ2 = 224; A.2.4: 240 / 240. Z Rs: dokładnie 86 / 171;
A.2.4: 97 / 197 kJ/(m²·K).

**D.2 — beton + 100 mm styropianu + powłoka (Tablica D.2):**

| Warstwa | λ W/(m·K) | ρ kg/m³ | c J/(kg·K) | d m | R m²·K/W | a mm²/s | δ m | ξ |
|---|---|---|---|---|---|---|---|---|
| Powierzchnia wewn. | — | — | — | — | 0,130 | — | — | — |
| Beton | 1,80 | 2 400 | 1 000 | 0,200 | 0,111 | 0,75 | 0,144 | 1,393 |
| Izolacja | 0,04 | 30 | 1 400 | 0,100 | 2,500 | 0,95 | 0,162 | 0,618 |
| Powłoka | 1,00 | 1 200 | 1 500 | 0,005 | 0,005 | 0,56 | 0,124 | 0,040 |
| Powierzchnia zewn. | — | — | — | — | 0,040 | — | — | — |

Tablica D.3 (moduł; przesunięcie w h, zakres −12…12): Z11 98,12; 8,96 · Z21 83,07 W/(m²·K); 0,99 ·
Z12 16,51 m²·K/W; −3,89 · Z22 13,99; −11,86. Macierz odwrotna: Z′11 13,99; −11,86 · Z′21 83,07;
−11,01 · Z′12 16,51; 8,11 · Z′22 98,12; 8,96.

Tablica D.4: Y11 5,94 W/(m²·K), 0,85 h; Y22 0,85, 4,03 h; Y12 0,061, −8,11 h; κ1 82 kJ/(m²·K);
κ2 12 kJ/(m²·K); U 0,359 W/(m²·K); f 0,169. Pojemność harmoniczna (24 h) < długoterminowej
Σ d·ρ·c = 493 kJ/(m²·K).

Tablica D.5 (Załącznik A, kJ/(m²·K), bez Rs / z Rs): wewn. półprzestrzeń 244 / 97; wewn. grubość
efektywna 240 / 97; zewn. cienka warstwa 9 / 9. „Z oporem przejmowania różnica między metodą
dokładną a Załącznikiem A jest niewielka.”

## Odtworzenie przykładów (weryfikacja wzorów)

Skrypt Python/numpy (macierze (14), (17), (18), charakterystyki (19)–(25), Załącznik A (A.2)–(A.4)),
wynik 27.09.2026:

- D.1: δ = 0,144, ξ = 1,393; Zee = [[−0,508+3,081j, −0,046−0,545j], [22,161−30,553j, −2,502+5,830j]];
  Y11 5,704 / 0,948 h; Y22 11,592 / 1,873 h; |Y12| 1,827; κ1 86,17; κ2 170,88; U 3,557; f 0,514;
  A.2.4 z Rs: 96,8 / 196,8. ✅ (poza Z12 warstwy — ⚠️ wyżej)
- D.2: Z11 98,12 / 8,96 h; Z21 83,07 / 0,99; Z12 16,51 / −3,89; Z22 13,99 / −11,86; Y11 5,942 / 0,853;
  Y22 0,847 / 4,032; |Y12| 0,061; κ1 82,29; κ2 12,48; U 0,359; f 0,169; Σ dρc 493,2; A.2.3 wewn.
  243,7 → z Rs 97,0; A.2.2 zewn. 9,0 / 9,0. ✅
- Przesunięcie Y12: arg(Z12) → −6,32 h (D.1), −3,89 h (D.2); arg(−1/Z12) w −2π…0 → −5,68 h, −8,11 h
  (= tablice). ⚠️ patrz (26).
