# Karta katalogowa — JA Solar JAM72D40 MB "Deep Blue 4.0 Pro" (seria dwustronna 580–605 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl
(producent JA Solar). Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu i przeglądarki). Na okładce odcięty został dół
(ostatnie punkty listy certyfikatów i rząd ikon), a na stronie parametrów stopka z adresem producenta — zasłaniała je nakładka koszyka
sklepu; nie zawierają danych technicznych:

- `karta-1-okladka-gwarancja.webp` — okładka: ogniwa (16BB), cechy modułu, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i z 10% tyłu), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam72d40-mb-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). Okładka pokazuje panele ze srebrną ramą.

## Gwarancje i degradacja (okładka)

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 12 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type (16BB) |
| Masa | 31,8 kg |
| Wymiary | 2278±2 × 1134±2 × 30±1 mm |
| Przekrój kabla | 4 mm² (IEC), 12 AWG (UL) |
| Liczba ogniw | 144 (6×24) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | QC 4.10-351 / MC4-EVO2A |
| Długość kabla (ze złączem) | pion: 400 mm (+) / 200 mm (−); poziom: 1300 mm (+) / 1300 mm (−) |
| Szkło przód/tył | 2,0 mm / 2,0 mm |
| Pakowanie | 36 szt./paleta, 720 szt./kontener 40' HQ |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -580/MB | -585/MB | -590/MB | -595/MB | -600/MB | -605/MB |
|---|---|---|---|---|---|---|
| Pmax [W] | 580 | 585 | 590 | 595 | 600 | 605 |
| Voc [V] | 51,95 | 52,16 | 52,37 | 52,58 | 52,79 | 53,00 |
| Vmp [V] | 44,02 | 44,22 | 44,43 | 44,64 | 44,85 | 45,05 |
| Isc [A] | 13,84 | 13,89 | 13,94 | 13,99 | 14,04 | 14,09 |
| Imp [A] | 13,17 | 13,23 | 13,28 | 13,33 | 13,38 | 13,43 |
| Sprawność modułu [%] | 22,5 | 22,6 | 22,8 | 23,0 | 23,2 | 23,4 |

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

## Parametry z 10% energii od tyłu (stosunek napromienienia tył/przód 10%)

| Typ | -580/MB | -585/MB | -590/MB | -595/MB | -600/MB | -605/MB |
|---|---|---|---|---|---|---|
| Pmax [W] | 626 | 632 | 637 | 643 | 648 | 653 |
| Isc [A] | 14,95 | 15,00 | 15,06 | 15,11 | 15,16 | 15,22 |
| Imp [A] | 14,23 | 14,29 | 14,34 | 14,40 | 14,45 | 14,50 |

Voc i Vmp bez zmian względem STC.

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. prąd bezpiecznika szeregowego | 30 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa (112 lb/ft²) / 2400 Pa (50 lb/ft²) (dla trackerów Nextracker wymagany list kompatybilności) |
| NOCT | **45±2 °C** |
| Bifacjalność | 80% ± 5% |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Type 29 / Class C |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
