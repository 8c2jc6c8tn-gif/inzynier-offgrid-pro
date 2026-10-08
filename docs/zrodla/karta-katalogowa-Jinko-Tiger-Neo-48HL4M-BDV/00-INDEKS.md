# Karta katalogowa — Jinko Tiger Neo 48HL4M-BDV (seria dwustronna 445–470 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta Jinko Solar, oznaczenie karty „JKM445-470N-48HL4M-BDV-Z1-EU”, © 2024). Zapisane jako obrazy, przycięte do samej karty
(bez pasków telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: technologia (TOPCon n-type, HOT 3.0, dwustronny), gwarancje, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, opakowanie, STC i BNPI, warunki zastosowania, rysunki i krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/jinko-tiger-neo-48hl4m-bdv-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 15 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,40% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |
| Maks. obciążenie testowe (okładka) | 6000 Pa przód / 4000 Pa tył |

Spójność: 100% − 1% − 29 × 0,40% = 87,4%.

## Parametry mechaniczne i opakowanie (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Typ ogniw | N-type mono, 96 szt. (48×2), half-cut |
| Wymiary | 1762 × 1134 × 30 mm |
| Masa | 24,0 kg |
| Szkło przód / tył | 2,0 mm, powłoka antyrefleksyjna / 2,0 mm, szkło wzmocnione termicznie |
| Rama | aluminium anodowane |
| Skrzynka przyłączeniowa | IP68 |
| Klasa ochronności / odporność na ogień | Class II / Class C |
| Złącze | JK03M / JK03M2 / inne (MC4 i MC4-EVO2 na zamówienie, wg dostępności) |
| Kable | 4,0 mm²; (+) 400 mm, (−) 200 mm lub na zamówienie |
| Paleta | 1792 × 1140 × 1249 mm; 37 szt./paleta, 74 szt./stos (2 palety), 962 szt./kontener 40' HQ |

## Parametry w STC (1000 W/m², 25 °C, AM 1,5)

| Moc Pmax [W] | 445 | 450 | 455 | 460 | 465 | 470 |
|---|---|---|---|---|---|---|
| Vmp [V] | 30,30 | 30,53 | 30,77 | 31,00 | 31,23 | 31,46 |
| Imp [A] | 14,69 | 14,74 | 14,79 | 14,84 | 14,89 | 14,94 |
| Voc [V] | 36,02 | 36,19 | 36,36 | 36,53 | 36,70 | 36,87 |
| Isc [A] | 15,60 | 15,65 | 15,70 | 15,75 | 15,80 | 15,85 |
| Sprawność modułu [%] | 22,27 | 22,52 | 22,77 | 23,02 | 23,27 | 23,52 |

Tolerancja mocy: 0 ~ +3%. Współczynniki temperaturowe (wspólne dla serii): γ (Pmax) **−0,29%/°C**, β (Voc) −0,25%/°C, α (Isc) +0,045%/°C.

## Parametry BNPI (przód 1000 W/m² + tył 135 W/m², 25 °C, AM 1,5)

| Typ | 445 | 450 | 455 | 460 | 465 | 470 |
|---|---|---|---|---|---|---|
| Pmax [W] | 489 | 494 | 500 | 505 | 511 | 516 |
| Imp [A] | 16,13 | 16,18 | 16,24 | 16,29 | 16,35 | 16,40 |
| Isc [A] | 17,13 | 17,18 | 17,24 | 17,29 | 17,35 | 17,40 |

Vmp i Voc bez zmian względem STC.

## Warunki zastosowania

| Parametr | Wartość |
|---|---|
| Temperatura pracy | −40 °C ~ +70 °C |
| Maks. napięcie układu | 1500 V DC (IEC) |
| Maks. bezpiecznik szeregowy | 35 A |
| Współczynnik bifacjalności | φVoc 98 ± 5%, φIsc 80 ± 5%, φPmax 80 ± 5% |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- **NOCT / NMOT** — karta nie zawiera tej pozycji w żadnej tabeli. W Porównywarce wpis ma `noctC: null`, więc zjawisko temperaturowe (zima/lato)
  jest dla tego panelu niedostępne i — zgodnie z regułą porównywalności — wyłącza się w zestawie, jeśli ten panel jest w nim porównywany (użytkownik może wpisać
  NOCT ręcznie z innego źródła, np. z karty producenta w pełnej wersji);
- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
