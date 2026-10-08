# Karta katalogowa — Jinko Tiger Neo 66HL4M-BDV (seria dwustronna 605–630 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta Jinko Solar, oznaczenie karty „JKM605-630N-66HL4M-BDV-F4-EU”, © 2025). Zapisane jako obrazy, przycięte do samej karty
(bez pasków telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: technologia (TOPCon n-type, HOT 3.0, dwustronny), gwarancje, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, opakowanie, STC i BNPI, warunki zastosowania, rysunki i krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/jinko-tiger-neo-66hl4m-bdv-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). Moduł wielkoformatowy (2382 × 1134 mm, 32,4 kg) — odpowiednik małego
modelu `Jinko Tiger Neo 48HL4M-BDV` (445–470 W) w tym samym katalogu.

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | **12 lat** (w modelu 48HL4M-BDV: 15 lat) |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,40% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |
| Maks. obciążenie testowe (okładka) | 5400 Pa przód / 2400 Pa tył (w modelu 48HL4M-BDV: 6000 / 4000 Pa) |

Spójność: 100% − 1% − 29 × 0,40% = 87,4%.

## Parametry mechaniczne i opakowanie (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Typ ogniw | N-type mono, 132 szt. (66×2), half-cut |
| Wymiary | 2382 × 1134 × 30 mm |
| Masa | 32,4 kg |
| Szkło przód / tył | 2,0 mm, powłoka antyrefleksyjna / 2,0 mm, szkło wzmocnione termicznie |
| Rama | aluminium anodowane |
| Skrzynka przyłączeniowa | IP68 |
| Klasa ochronności / odporność na ogień | Class II / Class C |
| Złącze | JK03M / JK03M2 / inne (MC4 i MC4-EVO2 na zamówienie, wg dostępności) |
| Kable | 4,0 mm²; (+) 400 mm, (−) 200 mm lub na zamówienie |
| Paleta | 2396 × 1110 × 1251 mm; 36 szt./paleta, 72 szt./stos (2 palety), 720 szt./kontener 40' HQ |

## Parametry w STC (1000 W/m², 25 °C, AM 1,5)

| Moc Pmax [W] | 605 | 610 | 615 | 620 | 625 | 630 |
|---|---|---|---|---|---|---|
| Vmp [V] | 40,31 | 40,46 | 40,60 | 40,74 | 40,88 | 41,02 |
| Imp [A] | 15,01 | 15,08 | 15,15 | 15,22 | 15,29 | 15,36 |
| Voc [V] | 48,48 | 48,68 | 48,88 | 49,08 | 49,28 | 49,48 |
| Isc [A] | 15,90 | 15,96 | 16,02 | 16,08 | 16,14 | 16,20 |
| Sprawność modułu [%] | 22,40 | 22,58 | 22,77 | 22,95 | 23,14 | 23,32 |

Sortowanie mocy: 0 ~ +3%. Współczynniki temperaturowe (wspólne dla serii): γ (Pmax) **−0,29%/°C**, β (Voc) −0,25%/°C, α (Isc) +0,045%/°C.

## Parametry BNPI (przód 1000 W/m² + tył 135 W/m², 25 °C, AM 1,5)

| Typ | 605 | 610 | 615 | 620 | 625 | 630 |
|---|---|---|---|---|---|---|
| Pmax [W] | 668 | 674 | 679 | 685 | 690 | 696 |
| Vmp [V] | 40,29 | 40,46 | 40,59 | 40,75 | 40,88 | 41,04 |
| Imp [A] | 16,58 | 16,66 | 16,73 | 16,81 | 16,88 | 16,95 |
| Voc [V] | 48,46 | 48,66 | 48,86 | 49,06 | 49,26 | 49,46 |
| Isc [A] | 17,56 | 17,64 | 17,70 | 17,77 | 17,83 | 17,90 |

## Warunki zastosowania

| Parametr | Wartość |
|---|---|
| Temperatura pracy | −40 °C ~ +70 °C |
| Maks. napięcie układu | 1500 V DC (IEC) |
| Maks. bezpiecznik szeregowy | 35 A |
| Współczynniki bifacjalności | φVoc 98 ± 5%, φIsc 80 ± 5%, φPmax 80 ± 5% |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- **NOCT / NMOT** — karta nie zawiera tej pozycji (jak w modelu 48HL4M-BDV): `noctC: null`, zjawisko temperaturowe niedostępne dla tego panelu, dopóki
  użytkownik nie wpisze NOCT ręcznie z innego źródła;
- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych, bez liczby).
