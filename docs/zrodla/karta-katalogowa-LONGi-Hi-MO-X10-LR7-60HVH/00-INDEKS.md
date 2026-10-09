# Karta katalogowa — LONGi Hi-MO X10 Scientist LR7-60HVH 535~560M (seria jednostronna BC, 535–560 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu polskiej wersji karty na stronie sklepu
pvzenit.pl (producent LONGi; oznaczenie wersji karty „BGV01 20250613”). Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu,
nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka.webp` — okładka: cechy, gwarancje (15 lat na materiały i obróbkę, 30 lat na dodatkową liniową moc wyjściową), certyfikaty;
- `karta-2-parametry.webp` — pasek wartości, wykres gwarancji mocy, parametry mechaniczne, elektryczne (STC i NOCT), robocze, temperaturowe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/longi-himo-x10-lr7-60hvh-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). **Moduł jednostronny** (szkło jednościenne 3,2 mm), ogniwa BC (back contact).

## Gwarancje i degradacja

| Pozycja | Wartość |
|---|---|
| Gwarancja na materiały i obróbkę | 15 lat |
| Gwarancja na dodatkową liniową moc wyjściową | 30 lat |
| Degradacja mocy w pierwszym roku | < 1% |
| Degradacja mocy w latach 2–30 | 0,35% rocznie |
| Gwarantowana moc po 30 latach | 88,85% (wykres: 99% w roku 1) |

Spójność: 100% − 1% − 29 × 0,35% = 88,85% — „< 1%” w katalogu to granica górna 1,0%.

## Parametry mechaniczne

| Parametr | Wartość |
|---|---|
| Orientacja ogniw | 120 (6×20) |
| Skrzynka przyłączeniowa | IP68, trzy diody |
| Kabel wyjściowy | 4 mm², +400, −200 mm / ±1400 mm; długość do dopasowania |
| Szkło | jednościenne, hartowane, powlekane 3,2 mm |
| Rama | anodowana, ze stopu aluminium |
| Waga | 25 kg |
| Wymiary | 1990 × 1134 × 30 mm |
| Opakowanie | 36 szt./paleta; 180 szt. na 20' GP; 792 szt. na 40' HC |

## Charakterystyka elektryczna — STC (1000 W/m², 25 °C, AM 1,5) i NOCT (800 W/m², 20 °C, 1 m/s, AM 1,5)

| Typ modułu | LR7-60HVH-535M | -540M | -545M | -550M | -555M | -560M |
|---|---|---|---|---|---|---|
| Pmax STC / NOCT [W] | 535 / 407 | 540 / 411 | 545 / 415 | 550 / 419 | 555 / 422 | 560 / 426 |
| Voc STC / NOCT [V] | 44,78 / 42,57 | 44,88 / 42,66 | 44,98 / 42,76 | 45,08 / 42,85 | 45,18 / 42,95 | 45,28 / 43,04 |
| Isc STC / NOCT [A] | 15,15 / 12,17 | 15,25 / 12,25 | 15,35 / 12,33 | 15,45 / 12,41 | 15,55 / 12,49 | 15,65 / 12,57 |
| Vmp STC / NOCT [V] | 37,01 / 35,16 | 37,11 / 35,26 | 37,21 / 35,35 | 37,31 / 35,45 | 37,41 / 35,54 | 37,51 / 35,64 |
| Imp STC / NOCT [A] | 14,46 / 11,58 | 14,55 / 11,66 | 14,65 / 11,73 | 14,74 / 11,81 | 14,84 / 11,89 | 14,93 / 11,96 |
| Wydajność modułu [%] | 23,7 | 23,9 | 24,2 | 24,4 | 24,6 | 24,8 |

Niepewność testu dla Pmax: ±3%.

## Parametry robocze i temperaturowe

| Parametr | Wartość |
|---|---|
| Temperatura robocza | −40 °C ~ +85 °C |
| Tolerancja mocy wyjściowej | 0% ~ 3% |
| Maks. napięcie systemu | DC 1500 V (IEC) |
| Maks. bezpiecznik szeregowy | 25 A |
| Nominalna temperatura robocza ogniwa (NOCT; warunki: 800 W/m², 20 °C, 1 m/s) | **45 °C ± 2 °C** |
| Klasa ochrony | Klasa II |
| Klasyfikacja ogniowa | IEC Klasa C |
| Obciążenie mechaniczne przód / tył | 5400 Pa / 2400 Pa; test gradowy: grad 25 mm przy 23 m/s |
| Współczynnik temperaturowy Isc | +0,050%/°C |
| Współczynnik temperaturowy Voc | −0,200%/°C |
| Współczynnik temperaturowy Pmax (γ) | **−0,260%/°C** |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (jest tylko moc w NOCT, czyli przy 800 W/m², bez punktu 200 W/m²).
