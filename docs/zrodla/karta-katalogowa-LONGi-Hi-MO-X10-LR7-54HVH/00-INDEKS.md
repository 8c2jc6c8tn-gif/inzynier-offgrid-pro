# Karta katalogowa — LONGi Hi-MO X10 Explorer LR7-54HVH 475~490M (seria jednostronna BC, 475–490 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu polskiej wersji karty na stronie sklepu
pvzenit.pl (producent LONGi; stopka karty: „20241118 BGV02 Draft” — oznaczenie wersji roboczej na karcie). Zapisane jako obrazy, przycięte do
samej karty (bez pasków telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka.webp` — okładka: cechy, gwarancje (15 lat na materiały i przetwarzanie, 30 lat na liniowy spadek mocy), certyfikaty;
- `karta-2-parametry.webp` — pasek wartości, wykres gwarancji mocy, parametry mechaniczne, elektryczne (STC i NOCT), operacyjne, temperaturowe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/longi-himo-x10-lr7-54hvh-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). **Moduł jednostronny** (szkło pojedyncze 3,2 mm), ogniwa BC (back contact).

## Gwarancje i degradacja

| Pozycja | Wartość |
|---|---|
| Gwarancja na materiały i przetwarzanie | 15 lat |
| Gwarancja na liniowy spadek mocy | 30 lat |
| Degradacja mocy w pierwszym roku | < 1% |
| Degradacja mocy w latach 2–30 | 0,35% rocznie |
| Gwarantowana moc po 30 latach | 88,85% (wykres: 99% w roku 1) |

Spójność: 100% − 1% − 29 × 0,35% = 88,85% — zgodne z wykresem, więc „< 1%” w katalogu to granica górna 1,0%.

## Parametry mechaniczne

| Parametr | Wartość |
|---|---|
| Orientacja ogniw | 108 (6×18) |
| Skrzynka przyłączeniowa | IP68, trzy diody |
| Kabel wyjściowy | 4 mm², +400 mm, −200 mm / ±1200 mm; długość do dostosowania |
| Szkło | pojedyncze, powlekane szkło hartowane 3,2 mm |
| Rama | z anodowanego stopu aluminium |
| Ciężar | 21,6 kg |
| Wymiar | 1800 × 1134 × 30 mm |
| Opakowanie | 36 szt./paleta; 216 szt. na 20' GP; 864 szt. na 40' HC |

## Charakterystyka elektryczna — STC (1000 W/m², 25 °C, AM 1,5) i NOCT (800 W/m², 20 °C, 1 m/s, AM 1,5)

| Typ modułu | LR7-54HVH-475M | LR7-54HVH-480M | LR7-54HVH-485M | LR7-54HVH-490M |
|---|---|---|---|---|
| Pmax STC / NOCT [W] | 475 / 362 | 480 / 365 | 485 / 369 | 490 / 373 |
| Voc STC / NOCT [V] | 40,18 / 38,18 | 40,29 / 38,29 | 40,40 / 38,39 | 40,52 / 38,51 |
| Isc STC / NOCT [A] | 15,03 / 12,08 | 15,13 / 12,16 | 15,23 / 12,24 | 15,33 / 12,32 |
| Vmp STC / NOCT [V] | 33,16 / 31,52 | 33,28 / 31,63 | 33,40 / 31,74 | 33,51 / 31,85 |
| Imp STC / NOCT [A] | 14,33 / 11,49 | 14,43 / 11,57 | 14,53 / 11,65 | 14,63 / 11,73 |
| Wydajność modułu [%] | 23,3 | 23,5 | 23,8 | 24,0 |

Niepewność pomiaru dla Pmax: ±3%.

## Parametry operacyjne i temperaturowe

| Parametr | Wartość |
|---|---|
| Temperatura robocza | −40 °C ~ +85 °C |
| Tolerancja mocy wyjściowej | 0 ~ 3% |
| Maks. napięcie systemu | DC 1500 V (IEC) |
| Maks. znamionowa wartość bezpiecznika szeregowego | 25 A |
| Nominalna temperatura robocza ogniwa (NOCT; warunki: 800 W/m², 20 °C, 1 m/s) | **45 ± 2 °C** |
| Klasa ochrony | Klasa II |
| Klasa odporności ogniowej | IEC klasa C |
| Obciążenie mechaniczne przód / tył | 5400 Pa / 2400 Pa; test gradowy: grad 25 mm przy 23 m/s |
| Współczynnik temperaturowy Isc | +0,050%/°C |
| Współczynnik temperaturowy Voc | −0,200%/°C |
| Współczynnik temperaturowy Pmax (γ) | **−0,260%/°C** |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (jest tylko moc w NOCT, czyli przy 800 W/m², bez punktu 200 W/m²).

Uwaga: karta ma w stopce oznaczenie „Draft” (wersja robocza) — wartości przepisane 1:1; przed zakupem warto sprawdzić zgodność z finalną kartą producenta.
