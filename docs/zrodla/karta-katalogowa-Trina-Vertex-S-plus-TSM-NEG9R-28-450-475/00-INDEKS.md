# Karta katalogowa — Trina Solar Vertex S+ TSM-NEG9R.28, seria 450–475 W (wersja karty TSM_PL_2026_A)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu polskiej wersji karty na stronie sklepu
pvzenit.pl (producent Trina Solar; © 2026, oznaczenie wersji „TSM_PL_2026_A”). To **nowsza wersja karty** tego samego modułu co
`docs/zrodla/karta-katalogowa-Trina-Vertex-S-plus-TSM-NEG9R-28/` (430–460 W, wersja „TSM_PL_2024_C”): dodaje moce **465, 470, 475 W**, a nie ma 430–445 W.
Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka.webp` — okładka: moc 475 W, sprawność 23,8%, cechy, rozszerzona gwarancja (wykres), certyfikaty;
- `karta-2-parametry.webp` — wymiary i krzywe, parametry elektryczne (STC i NOCT), mechaniczne, wskaźniki temperaturowe, gwarancja, wartości graniczne.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/trina-vertex-s-plus-neg9r28-450-475-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5; tolerancja pomiaru ±3%)

| Typ | TSM-450 | -455 | -460 | -465 | -470 | -475 (NEG9R.28) |
|---|---|---|---|---|---|---|
| Pmax [W] | 450 | 455 | 460 | 465 | 470 | 475 |
| Vmpp [V] | 44,6 | 45,0 | 45,4 | 45,8 | 46,1 | 46,4 |
| Impp [A] | 10,09 | 10,11 | 10,14 | 10,16 | 10,20 | 10,24 |
| Voc [V] | 52,9 | 53,4 | 53,8 | 54,2 | 54,6 | 55,0 |
| Isc [A] | 10,74 | 10,77 | 10,81 | 10,85 | 10,89 | 10,93 |
| Sprawność modułu [%] | 22,5 | 22,8 | 23,0 | 23,3 | 23,5 | 23,8 |

Zakres mocy: do +3% (starsza karta: 0/+5 W). Liczby dla 450–460 W identyczne ze starszą kartą.

## Parametry elektryczne w NOCT (800 W/m², 20 °C, wiatr 1 m/s)

| Typ | 450 | 455 | 460 | 465 | 470 | 475 |
|---|---|---|---|---|---|---|
| Pmax [W] | 344 | 348 | 352 | 355 | 358 | 362 |
| Vmpp [V] | 42,0 | 42,3 | 42,7 | 42,8 | 43,1 | 43,4 |
| Impp [A] | 8,19 | 8,22 | 8,25 | 8,28 | 8,31 | 8,35 |
| Voc [V] | 50,2 | 50,6 | 51,0 | 51,4 | 51,8 | 52,1 |
| Isc [A] | 8,66 | 8,68 | 8,71 | 8,74 | 8,76 | 8,79 |

## Wskaźniki temperaturowe, gwarancja, wartości graniczne

| Parametr | Wartość |
|---|---|
| NOCT (warunki: 800 W/m², 20 °C, 1 m/s) | **43 °C (±2 °C)** |
| Współczynnik temperaturowy Pmax (γ) | **−0,29%/°C** |
| Współczynnik temperaturowy Voc / Isc | −0,24%/°C / +0,04%/°C |
| Gwarancja produktowa / mocy | 25 lat / 30 lat |
| Maks. degradacja w pierwszym roku / roczna w latach 2–30 | 1% / 0,4% (87,4% po 30 latach) |
| Temperatura pracy | −40 do **+70 °C** (przypis: 98. percentyl temperatury pracy modułu PV: 70 °C) |
| Maks. napięcie układu / zabezpieczenie prądowe | 1500 V DC (IEC) / 25 A |
| Pakowanie | 36 szt./paleta, 936 szt./kontener 40' |
| Wytrzymałość (okładka, dopisane 09.10.2026 z obrazu karty) | śnieg do 5400 Pa, wiatr do 4000 Pa |

Mechanika jak w starszej karcie (144 ogniwa i-TOPCon, 1762 × 1134 × 30 mm, 21,0 kg, szkło 1,6 / 1,6 mm, IP68).

## Różnice względem starszej karty (430–460 W, TSM_PL_2024_C) — zapisane, nie rozstrzygane

| Pozycja | Starsza karta | Ta karta (2026_A) |
|---|---|---|
| Temperatura pracy | −40 do +85 °C | −40 do +70 °C (z przypisem o 98. percentylu) |
| Tolerancja / dobór mocy | 0/+5 W | do +3% |
| Skrzynka | IP68 | IP68, 3 diody bypass |
| Kable pionowo | 280/350 mm | 200/320 mm |
| Szkło przód / tył | „wzmocnione”, AR / wzmocnione termicznie | wzmocnione termicznie, AR / wzmocnione termicznie |

Żadna z tych różnic nie wchodzi do obliczeń uzysku (γ, NOCT, degradacja są te same).

## Czego karta NIE podaje (jak w starszej karcie)

- sprawności względnej przy 200 W/m² (`null`);
- bifacjalności (`bifacjalny: false` — flaga tylko ostrzegawcza; patrz starsza karta).
