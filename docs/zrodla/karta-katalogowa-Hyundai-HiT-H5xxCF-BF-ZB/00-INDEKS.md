# Karta katalogowa — HD Hyundai HeteroMax™ HiT-H500…H520CF-BF(ZB), seria dwustronna 500~520 W

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako dwa zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta HD Hyundai Energy Solutions). Zapisane jako obrazy, przycięte do samej karty (bez paska stanu telefonu, nakładek
przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: cechy (23,3% sprawności, technologia HJT, niski współczynnik temperaturowy), gwarancje, certyfikaty;
- `karta-2-parametry.webp` — parametry elektryczne (STC i BNPI), mechaniczne, warunki pracy, schemat modułu, krzywe I–V.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/hyundai-hit-h5xxcf-bf-zb-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 30 lat (materiały i wykonanie) |
| Gwarancja mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja liniowa po pierwszym roku | 0,3 punktu procentowego rocznie |
| Gwarantowana moc po 30 latach | 90,3% (wykres: 99% na starcie, 91,8% po 25 latach) |

Spójność: 100% − 1% − 29 × 0,3% = 90,3% — zgodne z wykresem gwarancji.

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5)

| Moc Pmax [W] | 500 | 505 | 510 | 515 | 520 |
|---|---|---|---|---|---|
| Voc [V] | 40,63 | 40,71 | 40,79 | 40,88 | 40,96 |
| Isc [A] | 15,09 | 15,18 | 15,26 | 15,33 | 15,42 |
| Vmpp [V] | 35,14 | 35,22 | 35,30 | 35,48 | 35,56 |
| Impp [A] | 14,31 | 14,40 | 14,49 | 14,58 | 14,67 |
| Sprawność modułu [%] | 22,4 | 22,7 | 22,9 | 23,1 | 23,3 |

Tolerancja mocy (sortowanie): 0~+5 W. Współczynniki temperaturowe (wspólne dla serii):

- γ (Pmax): **−0,24%/°C**
- β (Voc): −0,22%/°C
- α (Isc): +0,04%/°C
- Bifacjalność: 90 ± 5%

## Parametry BNPI (Bifacial Nameplate Irradiance: 1000 W/m² z przodu + 135 W/m² z tyłu)

| Moc Pmax [W] | 500 | 505 | 510 | 515 | 520 |
|---|---|---|---|---|---|
| Pmax BNPI [W] | 560 | 565 | 570 | 575 | 580 |
| Voc [V] | 40,63 | 40,71 | 40,79 | 40,88 | 40,94 |
| Isc [A] | 16,92 | 17,02 | 17,11 | 17,19 | 17,29 |
| Vmpp [V] | 35,14 | 35,22 | 35,30 | 35,48 | 35,54 |
| Impp [A] | 16,05 | 16,15 | 16,25 | 16,33 | 16,43 |

Uwaga: wartości przepisane tak, jak są wydrukowane na karcie (np. skok Vmpp 35,30 → 35,48 między 510 a 515 W jest na karcie); nie poprawiane.

## Parametry mechaniczne

| Parametr | Wartość |
|---|---|
| Wymiary (dł. × szer. × wys.) | 1961 × 1134 × 30 mm |
| Masa | 27,6 kg |
| Ogniwa | N-type HJT mono, 108 szt. (6×18), half-cut, dwustronne |
| Kable | 4 mm², (+) 1250 mm, (−) 1250 mm lub na zamówienie; złącze Stäubli MC4 albo MC4-EVO2A |
| Skrzynka przyłączeniowa | 3-częściowa, 3 diody bypass, IP68 |
| Konstrukcja | przód: szkło hartowane walcowane 2,0 mm z powłoką; tył: szkło 2,0 mm z 3 otworami |
| Rama | aluminium anodowane, czarna |
| Pakowanie | 36 szt./paleta; 24 palety w kontenerze 40' HC; 864 szt. w kontenerze |

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Nominalna temperatura pracy modułu (NMOT) | **44 ± 2 °C** |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. napięcie systemu | 1500 V DC |
| Maks. prąd wsteczny | 30 A |
| Maks. obciążenie testowe | przód 5400 Pa / tył 2400 Pa |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych I–V dla 200–1000 W/m², bez liczby);
- warunków, w których karta definiuje NMOT (nie są wydrukowane).

## Uwaga interpretacyjna: NMOT a NOCT

Karta podaje **NMOT 44 ± 2 °C** (nazwa „Nominal Module Operation Temperature”) bez warunków pomiaru. Norma IEC 61215 definiuje NMOT przy
800 W/m², otoczeniu 20 °C i wietrze 1 m/s — czyli identycznie jak NOCT, której używa silnik (`T_c = T_a + (NOCT − 20) / 800 · G`).
Silnik traktuje więc wartość NMOT jak NOCT; to wniosek z definicji normy, nie odczyt „NOCT” z karty (analogicznie do Astronergy N5).
