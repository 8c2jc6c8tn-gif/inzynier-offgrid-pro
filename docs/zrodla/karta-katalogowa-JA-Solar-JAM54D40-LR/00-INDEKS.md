# Karta katalogowa — JA Solar JAM54D40 LR "Deep Blue 4.0 Pro" (seria jednostronna 450–475 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta JA Solar, wersja „Global-EN-20250711A”). Zapisane jako obrazy, przycięte do samej karty (bez paska stanu telefonu,
nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: ogniwa, cechy modułu, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC, NOCT i 200 W/m²), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam54d40-lr-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). **Moduł jednostronny (monofacial)** — różni się od serii JAM54D41 LB (dwustronnej).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 15 lat |
| Gwarancja liniowa mocy | 30 lat (dotyczy warunków STC) |
| Degradacja w pierwszym roku | 1% |
| Degradacja liniowa po pierwszym roku | 0,4% rocznie (przez 30 lat) |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4% — zgodne z wykresem.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type |
| Masa | 22 kg |
| Wymiary | 1762 × 1134 × 30 mm |
| Przekrój kabla | 4 mm² (IEC) / 12 AWG (UL) |
| Liczba ogniw | 108 (6×18) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | Stäubli PV-KST4-EVO2A/xy, PV-KBT4-EVO2A/xy; QC Solar QC4.10-351 / QC4.10-35 |
| Długość kabla | pion: 400 mm (+) / 200 mm (−); poziom: 1200 mm (+) / 1200 mm (−) |
| Szkło przód/tył | 1,6 mm / 1,6 mm |
| Pakowanie | 36 szt./paleta; 936 szt./kontener 40' HQ |
| Kraj produkcji | Chiny / Wietnam |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -450/LR | -455/LR | -460/LR | -465/LR | -470/LR | -475/LR |
|---|---|---|---|---|---|---|
| Pmax [W] | 450 | 455 | 460 | 465 | 470 | 475 |
| Voc [V] | 39,30 | 39,50 | 39,70 | 40,20 | 40,40 | 40,55 |
| Vmp [V] | 32,82 | 33,00 | 33,17 | 33,50 | 33,84 | 34,18 |
| Isc [A] | 14,48 | 14,56 | 14,64 | 14,65 | 14,66 | 14,67 |
| Imp [A] | 13,71 | 13,79 | 13,87 | 13,88 | 13,89 | 13,90 |
| Sprawność modułu [%] | 22,5 | 22,8 | 23,0 | 23,3 | 23,5 | 23,8 |

Tolerancja mocy: −5 ~ +10 W. Tolerancje pomiaru w STC: Pmax ±3%, Voc ±3%, Isc ±5%. Współczynniki temperaturowe (wspólne dla serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

Uwaga: wartości przepisane tak, jak są wydrukowane na karcie; nie poprawiane (skok Voc 39,70 → 40,20 V między 460 a 465 W jest na karcie).

## Parametry w NOCT i przy małym natężeniu 200 W/m²

Warunki NOCT: 800 W/m², otoczenie 20 °C, wiatr 1 m/s, AM 1,5G. Niskie natężenie: (200 ± 2) W/m², moduł w (25 ± 2) °C. (Nagłówek kolumn na karcie: „10%” — moc w NOCT, „200 W/m²”.)

| Typ | -450/LR | -455/LR | -460/LR | -465/LR | -470/LR | -475/LR |
|---|---|---|---|---|---|---|
| Pmax w NOCT [W] | 341 | 344 | 348 | 352 | 356 | 360 |
| Pmax przy 200 W/m² [W] | 87 | 88 | 89 | 90 | 91 | 92 |
| Voc w NOCT / 200 W/m² [V] | 37,19 / 36,96 | 37,37 / 37,16 | 37,57 / 37,35 | 38,04 / 37,82 | 38,23 / 38,01 | 38,37 / 38,16 |
| Vmp w NOCT / 200 W/m² [V] | 31,06 / 31,96 | 31,22 / 32,13 | 31,38 / 32,31 | 31,68 / 32,60 | 32,00 / 32,90 | 32,31 / 33,05 |
| Isc w NOCT / 200 W/m² [A] | 11,58 / 2,90 | 11,65 / 2,91 | 11,71 / 2,93 | 11,72 / 2,93 | 11,73 / 2,93 | 11,74 / 2,93 |
| Imp w NOCT / 200 W/m² [A] | 10,97 / 2,73 | 11,03 / 2,75 | 11,10 / 2,76 | 11,11 / 2,77 | 11,12 / 2,77 | 11,13 / 2,79 |

**Sprawność względna przy 200 W/m²** (wartość wyliczona z karty, nie odczytana): `P(200 W/m², 25 °C) / (0,2 · Pmax_STC)`, bo przy
tej samej temperaturze moduł 200 W/m² daje wprost stosunek sprawności do sprawności w STC:
87/90 = 96,7%; 88/91 = 96,7%; 89/92 = 96,7%; 90/93 = 96,8%; 91/94 = 96,8%; 92/95 = 96,8%. Moc na karcie jest podana w pełnych watach,
więc wynik ma niepewność zaokrąglenia ok. ±0,5 punktu procentowego (±0,5 W / 90 W). W katalogu: wartość zaokrąglona do 0,1.

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +70 °C (moduł, 98. percentyl temperatury pracy: 70 °C) |
| Maks. prąd bezpiecznika szeregowego | 25 A |
| Maks. obciążenie statyczne przód / tył | 3600 Pa / 1600 Pa (współczynnik bezpieczeństwa 1,5) |
| NOCT | **45±2 °C** |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | Class C |

## Czego karta NIE podaje

- współczynnika bifacjalności (moduł jednostronny — brak dotyczy);
- sprawności względnej przy 200 W/m² jako gotowej liczby (jest tylko moc w watach — liczba w katalogu jest wyliczona, patrz wyżej).
