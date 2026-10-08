# Karta katalogowa — Astronergy ASTRO N5 CHSM72N(DG)/F-BH, seria dwustronna 570~595 W

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako dwa zrzuty ekranu strony sklepu pvzenit.pl
(karta producenta Chint New Energy Technology Co., Ltd., oznaczenie wersji karty „202401”). Zapisane jako obrazy
(z przyciętym tylko paskiem stanu telefonu u góry; reszta bez zmian):

- `karta-1-okladka-gwarancja.webp` — okładka: gwarancje (15 lat produktowa, 30 lat liniowa moc), cechy, certyfikaty, pasek podsumowania;
- `karta-2-parametry.webp` — parametry mechaniczne, elektryczne (STC i NMOT), współczynniki temperaturowe, parametry pracy, krzywe.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/astronergy-n5-chsm72n-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`). Zrzut zasłania na dole okładki początek tabeli mechanicznej;
komplet tabeli jest na drugim obrazie.

## Pasek podsumowania (okładka i strona 2)

| Pozycja | Wartość |
|---|---|
| Zakres mocy | 570~595 W |
| Sortowanie mocy | 0~+3% |
| Maks. sprawność modułu | 23,0% |
| Degradacja mocy w 1. roku | ≤ 1,0% |
| Degradacja mocy w latach 2–30 | ≤ 0,4% rocznie |
| Gwarancja | 15 lat produktowa; 30 lat liniowa moc (n-type: 99,00% na starcie, 87,40% po 30 latach; p-type: 84,95%) |

Spójność: 100% − 1,0% − 29 × 0,4% = 87,4% — zgodne z wykresem gwarancji dla n-type.

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Wymiary (dł. × szer. × wys.) | 2278 × 1134 × 30 mm |
| Ogniwa | n-type mono, 144 szt. (6×24), TOPCon / half-cut |
| Rama | aluminium, anodowana na srebrno |
| Szkło przód / tył | 2,0 + 2,0 mm |
| Kabel (z łącznikiem) | pion: (+) 350 mm, (−) 250 mm; długość na zamówienie |
| Przekrój kabla | 4 mm² / 12 AWG |
| Maks. obciążenie mechaniczne (test) | 5400 Pa (przód) / 2400 Pa (tył) |
| Łącznik | HCB40 (standard) / MC4-EVO2A (opcja) |
| Masa modułu | 32,1 kg |
| Pakowanie | 36 szt./paleta; 1207 kg (kontener 40' HQ); 720 szt. w kontenerze |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5)

| Moc Pmpp [W] | 570 | 575 | 580 | 585 | 590 | 595 |
|---|---|---|---|---|---|---|
| Napięcie Vmpp [V] | 42,77 | 42,94 | 43,11 | 43,27 | 43,45 | 43,61 |
| Prąd Impp [A] | 13,33 | 13,39 | 13,45 | 13,52 | 13,58 | 13,64 |
| Napięcie jałowe Voc [V] | 50,90 | 51,10 | 51,30 | 51,50 | 51,70 | 51,90 |
| Prąd zwarciowy Isc [A] | 14,10 | 14,19 | 14,28 | 14,36 | 14,45 | 14,53 |
| Sprawność modułu | 22,1% | 22,3% | 22,5% | 22,6% | 22,8% | 23,0% |

## Parametry w NMOT (800 W/m², otoczenie 20 °C, AM 1,5, wiatr 1 m/s)

| Moc Pmpp [W] | 570 | 575 | 580 | 585 | 590 | 595 |
|---|---|---|---|---|---|---|
| Moc w NMOT [W] | 428,6 | 432,4 | 436,2 | 439,9 | 443,7 | 447,4 |
| Vmpp [V] | 40,26 | 40,42 | 40,59 | 40,73 | 40,89 | 41,06 |
| Impp [A] | 10,65 | 10,70 | 10,75 | 10,80 | 10,85 | 10,90 |
| Voc [V] | 48,35 | 48,54 | 48,73 | 48,92 | 49,11 | 49,30 |
| Isc [A] | 11,39 | 11,46 | 11,53 | 11,59 | 11,66 | 11,73 |

## Współczynniki temperaturowe (STC) i parametry pracy

| Parametr | Wartość |
|---|---|
| γ (Pmpp) | **−0,29%/°C** |
| α (Isc) | +0,043%/°C |
| β (Voc) | −0,25%/°C |
| NMOT (nominalna temperatura pracy modułu) | **41 ± 2 °C** |
| Liczba diod | 3 |
| Skrzynka przyłączeniowa | IP68 |
| Maks. bezpiecznik szeregowy | 30 A |
| Maks. napięcie systemu (IEC/UL) | 1500 V DC |

Tabela „Electrical Specifications (Integrated power)” (zysk mocy od tyłu 5–25% względem 580 W: 609/638/667/696/725 W) i krzywe I–V/P–V dla 580 W
są na obrazie 2; w Etapie A1 nie są używane (panel dwustronny liczony tylko od strony przedniej).

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby);
- współczynnika bifacjalności w liczbach (jest tylko tabela zysku mocy od tyłu jako przykład 5–25%).

## Uwaga interpretacyjna: NMOT a NOCT

Karta podaje **NMOT 41 ± 2 °C** zamiast NOCT; warunki, w których karta go definiuje (800 W/m², 20 °C, wiatr 1 m/s), są identyczne z definicją
NOCT, której używa silnik (`T_c = T_a + (NOCT − 20) / 800 · G`). Silnik traktuje więc wartość NMOT jak NOCT; to wniosek z warunków
podanych na karcie, nie odczyt „NOCT” z karty.
