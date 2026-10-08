# Karta katalogowa — JA Solar JAM66D46 LB "Deep Blue 4.0 Pro" (seria dwustronna 690–715 W, duży format)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(producent JA Solar). Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu i przeglądarki). Na okładce odcięty został dół
(ostatni punkt listy certyfikatów IEC 62941 i rząd ikon certyfikatów) oraz na stronie parametrów stopka z adresem producenta — zasłaniała je
nakładka koszyka sklepu; nie zawierają danych technicznych:

- `karta-1-okladka-gwarancja.webp` — okładka: ogniwa (18BB), cechy modułu, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i z 10% tyłu), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam66d46-lb-1.webp`, `-2.webp`) jako klikalne potwierdzenie
danych katalogu (`lib/core/dane/katalog-paneli-pv`). Moduł **wielkoformatowy** (2384 × 1303 mm, ok. 3,1 m²).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | **12 lat** (inaczej niż 15 lat w mniejszych seriach JA) |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type (18BB) |
| Masa | 38,2 kg |
| Wymiary | 2384±2 × 1303±2 × 33±1 mm |
| Przekrój kabla | 4 mm² (IEC), 12 AWG (UL) |
| Liczba ogniw | 132 (6×22) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | QC 4.10-351 / MC4-EVO2A |
| Długość kabla (ze złączem) | pion: 300 mm (+) / 400 mm (−); poziom: 1500 mm (+) / 1500 mm (−) |
| Szkło przód/tył | 2,0 mm / 2,0 mm |
| Pakowanie | 33 szt./paleta, 594 szt./kontener 40' HQ |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -690/LB | -695/LB | -700/LB | -705/LB | -710/LB | -715/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 690 | 695 | 700 | 705 | 710 | 715 |
| Voc [V] | 47,80 | 48,00 | 48,20 | 48,40 | 48,60 | 48,80 |
| Vmp [V] | 40,02 | 40,22 | 40,42 | 40,61 | 40,80 | 41,00 |
| Isc [A] | 18,35 | 18,39 | 18,43 | 18,47 | 18,51 | 18,55 |
| Imp [A] | 17,24 | 17,28 | 17,32 | 17,36 | 17,40 | 17,44 |
| Sprawność modułu [%] | 22,2 | 22,4 | 22,5 | 22,7 | 22,9 | 23,0 |

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

## Parametry z 10% energii od tyłu (stosunek napromienienia tył/przód 10%)

| Typ | -690/LB | -695/LB | -700/LB | -705/LB | -710/LB | -715/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 745 | 751 | 756 | 761 | 767 | 772 |
| Isc [A] | 19,82 | 19,86 | 19,90 | 19,95 | 19,99 | 20,03 |
| Imp [A] | 18,62 | 18,66 | 18,71 | 18,75 | 18,79 | 18,84 |

Voc i Vmp bez zmian względem STC.

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. prąd bezpiecznika szeregowego | 35 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa (112 lb/ft²) / 2400 Pa (50 lb/ft²) (dla trackerów Nextracker wymagany list kompatybilności) |
| NOCT | **45±2 °C** |
| Bifacjalność (Pmax tyłu / Pmax przodu) | 80% ± 10% |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Type 29 / Class C |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
