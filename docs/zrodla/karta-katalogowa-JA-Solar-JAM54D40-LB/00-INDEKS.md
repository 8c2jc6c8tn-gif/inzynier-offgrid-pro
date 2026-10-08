# Karta katalogowa — JA Solar JAM54D40 LB "Deep Blue 4.0 Pro" (seria dwustronna 435–460 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(producent JA Solar, wersja karty „Global-EN-20250421A”). Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu, nakładek
przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka (460 W): ogniwa 16BB, cechy, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i z 10% tyłu), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam54d40-lb-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). **Uwaga na nazwę:** to wariant **LB (dwustronny)**; `JAM54D40 LR`
(`docs/zrodla/karta-katalogowa-JA-Solar-JAM54D40-LR/`) to osobny, jednostronny model o innych mocach (450–475 W).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 15 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono (N-type, 16BB) |
| Masa | 22 kg |
| Wymiary | 1762±2 × 1134±2 × 30±1 mm |
| Przekrój kabla | 4 mm² (IEC), 12 AWG (UL) |
| Liczba ogniw | 108 (6×18) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | QC 4.10-351 / MC4-EVO2A |
| Długość kabla (ze złączem) | pion: 300 mm (+) / 400 mm (−); poziom: 1200 mm (+) / 1200 mm (−) |
| Szkło przód/tył | 1,6 mm / 1,6 mm |
| Pakowanie | 36 szt./paleta, 936 szt./kontener 40' HQ |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -435/LB | -440/LB | -445/LB | -450/LB | -455/LB | -460/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 435 | 440 | 445 | 450 | 455 | 460 |
| Voc [V] | 38,70 | 38,90 | 39,10 | 39,30 | 39,50 | 39,70 |
| Vmp [V] | 32,29 | 32,47 | 32,65 | 32,82 | 33,00 | 33,17 |
| Isc [A] | 14,23 | 14,31 | 14,40 | 14,48 | 14,56 | 14,64 |
| Imp [A] | 13,47 | 13,55 | 13,63 | 13,71 | 13,79 | 13,87 |
| Sprawność modułu [%] | 21,8 | 22,0 | 22,3 | 22,5 | 22,8 | 23,0 |

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

## Parametry z 10% energii od tyłu (stosunek napromienienia tył/przód 10%)

| Typ | -435/LB | -440/LB | -445/LB | -450/LB | -455/LB | -460/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 470 | 475 | 481 | 486 | 491 | 497 |
| Isc [A] | 15,36 | 15,46 | 15,55 | 15,64 | 15,73 | 15,81 |
| Imp [A] | 14,55 | 14,63 | 14,72 | 14,81 | 14,89 | 14,98 |

Voc i Vmp bez zmian względem STC.

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. prąd bezpiecznika szeregowego | 30 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa (112 lb/ft²) / 2400 Pa (50 lb/ft²) |
| NOCT | **45±2 °C** |
| Bifacjalność | 80% ± 5% |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Type 38 / Class C |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
