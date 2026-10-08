# Karta katalogowa — JA Solar JAM54D41 LB "Deep Blue 4.0 Pro" (seria 440–465 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako dwa zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta JA Solar, oznaczenie wersji „Global-EN-20250928C”). Zapisane jako obrazy, przycięte do samej karty (bez paska stanu
telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: ogniwa, cechy modułu, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i z 10% tyłu), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam54d41-lb-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 25 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja liniowa po pierwszym roku | 0,4% rocznie (przez 30 lat) |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4% — zgodne z wykresem.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type |
| Masa | 22 kg |
| Wymiary | 1762±2 × 1134±2 × 30±1 mm |
| Przekrój kabla | 4 mm² (IEC) / 12 AWG (UL) |
| Liczba ogniw | 108 (6×18) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | QC 4.10-351 / MC4-EVO2A |
| Długość kabla | pion: 400 mm (+) / 200 mm (−); poziom: 1200 mm (+) / 1200 mm (−) |
| Szkło przód/tył | 1,6 mm / 1,6 mm |
| Pakowanie | 36 szt./paleta; 936 szt./kontener 40' HQ |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -440/LB | -445/LB | -450/LB | -455/LB | -460/LB | -465/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 440 | 445 | 450 | 455 | 460 | 465 |
| Voc [V] | 38,90 | 39,10 | 40,30 | 40,50 | 40,60 | 40,70 |
| Vmp [V] | 32,47 | 32,65 | 32,99 | 33,33 | 33,68 | 34,02 |
| Isc [A] | 14,31 | 14,40 | 14,41 | 14,42 | 14,43 | 14,44 |
| Imp [A] | 13,55 | 13,63 | 13,64 | 13,65 | 13,66 | 13,67 |
| Sprawność modułu [%] | 22,0 | 22,3 | 22,5 | 22,8 | 23,0 | 23,5 |

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

Uwaga: wartości przepisane tak, jak są wydrukowane na karcie; nie poprawiane. Spójność Pmax = Vmp × Imp sprawdzona (±0,1 W). Dwie rzeczy
do wiadomości: skok Voc 39,10 → 40,30 V między 445 a 450 W jest na karcie, a sprawność dla 465 W jest wydrukowana jako 23,5%, choć
465 W / (1,762 × 1,134 m²) ≈ 23,3% — karta nie jest tu spójna sama ze sobą; do obliczeń silnik i tak nie używa sprawności modułu.

## Parametry z 10% energii od tyłu (stosunek napromienienia tył/przód 10%)

| Typ | -440/LB | -445/LB | -450/LB | -455/LB | -460/LB | -465/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 475 | 481 | 486 | 491 | 497 | 502 |
| Isc [A] | 15,46 | 15,55 | 15,56 | 15,57 | 15,58 | 15,60 |
| Imp [A] | 14,63 | 14,72 | 14,73 | 14,74 | 14,75 | 14,76 |

Voc i Vmp bez zmian względem STC (te same wartości na karcie).

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. prąd bezpiecznika szeregowego | 30 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa / 2400 Pa |
| NOCT | 45±2 °C |
| Bifacjalność | 80% ± 10% |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Type 38 / Class C |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
