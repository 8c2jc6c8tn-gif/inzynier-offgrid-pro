# Karta katalogowa — JA Solar JAM60D40 LB "Deep Blue 4.0" (seria dwustronna 485–510 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu polskiej wersji karty na stronie sklepu
pvzenit.pl (producent JA Solar). Zapisane jako obrazy, przycięte do samej karty (bez paska stanu telefonu, nakładek przeglądarki i
elementów sklepu):

- `karta-1-okladka-gwarancja.webp` — okładka: ogniwa, cechy modułu, wykres gwarancji liniowej, certyfikaty;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i z 10% odbicia), warunki pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam60d40-lb-1.webp`, `-2.webp`) jako klikalne potwierdzenie
danych katalogu (`lib/core/dane/katalog-paneli-pv`). Moduł **JAM60D40 LB** to ta sama platforma co **JAM60D41 LB**
(`docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/`): tabele elektryczne mają identyczne liczby. Okładka polskiej wersji pokazuje panele ze srebrną
ramą, okładka angielskiej wersji (poniżej) — „Black Frame”.

## Druga wersja karty: angielska, „Black Frame” (zrzuty 08.10.2026, 21:42)

- `karta-en-1-okladka-black-frame.webp`, `karta-en-2-parametry.webp` (w aplikacji: `ja-solar-jam60d40-lb-3.webp`, `-4.webp`).
- Wszystkie liczby elektryczne (STC, 10% tyłu), γ/β/α, NOCT, bifacjalność 80% ± 5% i obciążenia — **identyczne** z wersją polską.
- **Rozbieżności między wersjami (nie rozstrzygnięte):**

| Pozycja | Wersja polska (okładka srebrna) | Wersja angielska (Black Frame) |
|---|---|---|
| Gwarancja produktowa | 15 lat | **12 lat** |
| Złącze | MC4-EVO2A | QC 4.10-351 / MC4-EVO2A |
| Kabel | 1200 mm (+) / 1200 mm (−) | pion: 300 mm (+) / 400 mm (−); poziom: 1200 mm (+) / 1200 mm (−) |
| Szyba przód/tył | 2,0 / 2,0 mm | 2,0 / 2,0 mm (bez różnicy) |

Gwarancja produktowa i złącze nie wchodzą do obliczeń uzysku; katalog zapisuje jeden wpis (liczby elektryczne bez różnic). Która wersja gwarancji
dotyczy konkretnej partii zamawianej w sklepie — do sprawdzenia z dostawcą przed zakupem (otwarte pytanie, nie rozstrzygam).

## Gwarancje i degradacja (okładka polska; angielska: produkt 12 lat, reszta jak niżej)

| Pozycja | Wartość |
|---|---|
| Gwarancja na produkt | 15 lat (wersja angielska: 12 lat) |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type, 16-BB |
| Waga | 27,3 kg |
| Wymiary | 1953±2 × 1134±2 × 30±1 mm |
| Przekrój kabla | 4 mm² (IEC), 12 AWG (UL) |
| Liczba ogniw | 120 (6×20) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | MC4-EVO2A |
| Długość kabla (ze złączem) | 1200 mm (+) / 1200 mm (−) |
| Szyba przód/tył | 2,0 mm / 2,0 mm |
| Pakowanie | 36 szt./paleta, 864 szt./kontener |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5)

| Typ | -485/LB | -490/LB | -495/LB | -500/LB | -505/LB | -510/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 485 | 490 | 495 | 500 | 505 | 510 |
| Voc [V] | 43,25 | 43,45 | 43,65 | 43,85 | 44,05 | 44,25 |
| Vmp [V]* | 36,28 | 36,49 | 36,70 | 36,91 | 37,11 | 37,31 |
| Isc [A] | 14,24 | 14,30 | 14,36 | 14,42 | 14,48 | 14,54 |
| Imp [A] | 13,37 | 13,43 | 13,49 | 13,55 | 13,61 | 13,67 |
| Sprawność modułu [%] | 21,9 | 22,1 | 22,4 | 22,6 | 22,8 | 23,0 |

*Karta (polska wersja) nazywa wiersz „Maksymalne napięcie zasilania (Voc)” — to napięcie w punkcie mocy maksymalnej (Vmp), jak w
transkrypcji JAM60D41 LB; ten sam skrót producenta.

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla serii): α (Isc) **+0,045%/°C**, β (Voc) **−0,250%/°C**, γ (Pmax) **−0,290%/°C**.

## Parametry z 10% współczynnikiem odbicia promieniowania (tył)

| Typ | -485/LB | -490/LB | -495/LB | -500/LB | -505/LB | -510/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 524 | 529 | 535 | 540 | 545 | 551 |
| Isc [A] | 15,38 | 15,44 | 15,51 | 15,57 | 15,64 | 15,70 |
| Imp [A] | 14,44 | 14,50 | 14,57 | 14,63 | 14,70 | 14,76 |

Voc i Vmp bez zmian względem STC.

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. prąd bezpiecznika w połączeniach szeregowych | 30 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa (112 lb/ft²) / 2400 Pa (50 lb/ft²) |
| NOCT | **45±2 °C** |
| Bifacjalność | 80% ± 5% |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Typ 29 / klasa C |

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby).
