# Karta katalogowa — Jinko Tiger Neo 72HL4-BDV (seria dwustronna 575–600 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta Jinko Solar, oznaczenie karty „JKM575-600N-72HL4-BDV-F9-EN”, © 2024). Zapisane jako obrazy, przycięte do samej karty
(bez pasków telefonu, nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: technologia (TOPCon n-type, HOT 3.0, dwustronny), gwarancje, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, opakowanie, STC i BNPI, warunki zastosowania, rysunki i krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/jinko-tiger-neo-72hl4-bdv-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). Wymiary 2278 × 1134 mm — taki sam format jak Astronergy N5 i JA Solar JAM72D40 MB.

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 12 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,40% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |
| Maks. obciążenie testowe (okładka) | 5400 Pa przód / 2400 Pa tył |

Spójność: 100% − 1% − 29 × 0,40% = 87,4%.

## Parametry mechaniczne i opakowanie (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Typ ogniw | N-type mono, 144 szt. (72×2), half-cut |
| Wymiary | 2278 × 1134 × 30 mm |
| Masa | 31,0 kg |
| Szkło przód / tył | 2,0 mm, powłoka antyrefleksyjna / 2,0 mm, szkło wzmocnione termicznie |
| Rama | aluminium anodowane |
| Skrzynka przyłączeniowa | IP68 |
| Klasa ochronności / odporność na ogień | Class II / Class C |
| Złącze | JK03M / MC4 / inne |
| Kable | 4,0 mm²; (+) 400 mm, (−) 200 mm lub na zamówienie |
| Paleta | 2338 × 1140 × 1251 mm; 36 szt./paleta, 72 szt./stos (2 palety), 720 szt./kontener 40' HQ |

## Parametry w STC (1000 W/m², 25 °C, AM 1,5)

| Moc Pmax [W] | 575 | 580 | 585 | 590 | 595 | 600 |
|---|---|---|---|---|---|---|
| Vmp [V] | 43,73 | 43,88 | 44,02 | 44,17 | 44,31 | 44,45 |
| Imp [A] | 13,15 | 13,22 | 13,29 | 13,36 | 13,43 | 13,50 |
| Voc [V] | 52,30 | 52,50 | 52,70 | 52,90 | 53,10 | 53,30 |
| Isc [A] | 13,89 | 13,95 | 14,01 | 14,07 | 14,13 | 14,19 |
| Sprawność modułu [%] | 22,26 | 22,45 | 22,65 | 22,84 | 23,03 | 23,23 |

Tolerancja mocy: 0 ~ +3%. Współczynniki temperaturowe (wspólne dla serii): γ (Pmax) **−0,29%/°C**, β (Voc) −0,25%/°C, α (Isc) +0,045%/°C.

## Parametry BNPI (przód 1000 W/m² + tył 135 W/m², 25 °C, AM 1,5)

| Typ | 575 | 580 | 585 | 590 | 595 | 600 |
|---|---|---|---|---|---|---|
| Pmax [W] | 633 | 638 | 644 | 649 | 655 | 660 |
| Vmp [V] | 43,84 | 44,00 | 44,17 | 44,33 | 44,50 | 44,66 |
| Imp [A] | 14,44 | 14,50 | 14,58 | 14,64 | 14,72 | 14,78 |
| Voc [V] | 52,33 | 52,53 | 52,73 | 52,93 | 53,13 | 53,33 |
| Isc [A] | 15,19 | 15,25 | 15,31 | 15,37 | 15,43 | 15,49 |

## Warunki zastosowania

| Parametr | Wartość |
|---|---|
| Temperatura pracy | −40 °C ~ +70 °C |
| Maks. napięcie układu | 1500 V DC (IEC) |
| Maks. bezpiecznik szeregowy | 30 A |
| Współczynniki bifacjalności | φVoc 98 ± 5%, φIsc 80 ± 5%, φPmax 80 ± 5% |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- **NOCT / NMOT** — karta nie zawiera tej pozycji (jak pozostałe karty Jinko w katalogu): `noctC: null`, zjawisko temperaturowe niedostępne dla tego panelu,
  dopóki użytkownik nie wpisze NOCT ręcznie z innego źródła;
- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych, bez liczby).

## Uzupełnienie NOCT (09.10.2026, decyzja właściciela)

Karta tej edycji NOCT nie podaje. Na polecenie właściciela w katalogu jest **NOCT 45 °C z odpowiednika** — karty 550–570 W na rynek chiński
(`docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-72HL4-BDV-550-570-CN/00-INDEKS.md`, „45 ± 2”). Ekran oznacza ten wpis jako „NOCT z karty odpowiednika”.
