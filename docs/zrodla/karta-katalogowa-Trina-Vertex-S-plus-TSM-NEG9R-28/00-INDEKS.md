# Karta katalogowa — Trina Solar Vertex S+ TSM-NEG9R.28 (podwójne szkło, n-type i-TOPCon, 430–460 W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu polskiej wersji karty na stronie sklepu
pvzenit.pl (producent Trina Solar; oznaczenie wersji karty „TSM_PL_2024_C”). Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu,
nakładek przeglądarki i elementów sklepu):

- `karta-1-okladka.webp` — okładka: cechy, rozszerzona gwarancja Vertex S+ (wykres), certyfikaty;
- `karta-2-parametry.webp` — wymiary i krzywe, parametry elektryczne (STC i NOCT), mechaniczne, wskaźniki temperaturowe, gwarancja, wartości graniczne.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/trina-vertex-s-plus-neg9r28-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Gwarancje i degradacja

| Pozycja | Wartość |
|---|---|
| Gwarancja produktowa | 25 lat |
| Gwarancja mocy | 30 lat |
| Maks. degradacja w pierwszym roku | 1% |
| Maks. degradacja roczna w latach 2–30 | 0,4% (wykres: 0,4% dla Vertex S+, 0,45% dla standardowego modułu) |
| Gwarantowana moc po 30 latach | 87,4% (wykres) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%. Wytrzymałość podana na okładce: śnieg do 5400 Pa, wiatr do 4000 Pa.

## Parametry mechaniczne

| Parametr | Wartość |
|---|---|
| Ogniwa | N-type i-TOPCon, 144 szt. |
| Wymiary | 1762 × 1134 × 30 mm |
| Waga | 21,0 kg |
| Szkło przód / tył | 1,6 mm, szkło wzmocnione z powłoką antyrefleksyjną AR / 1,6 mm, szkło o wysokiej przepuszczalności, wzmocnione termicznie |
| Rama | 30 mm, anodowany stop aluminium, czarna |
| Skrzynka przyłączeniowa | IP68 |
| Kable | przewód fotowoltaiczny 4,0 mm²; poziomo 1100/1100 mm; pionowo 280/350 mm (na specjalne zamówienie) |
| Złącze | TS4 Plus / TS4 / MC4 EVO2 (tylko na specjalne zamówienie) |
| Pakowanie | 36 szt./paleta; 936 szt./kontener 40' |

## Parametry elektryczne w STC (1000 W/m², 25 °C, AM 1,5; tolerancja pomiaru ±3%)

| Typ | TSM-430 | -435 | -440 | -445 | -450 | -455 | -460 (NEG9R.28) |
|---|---|---|---|---|---|---|---|
| Pmax [W] | 430 | 435 | 440 | 445 | 450 | 455 | 460 |
| Vmpp [V] | 43,2 | 43,6 | 44,0 | 44,3 | 44,6 | 45,0 | 45,4 |
| Impp [A] | 9,96 | 9,99 | 10,01 | 10,05 | 10,09 | 10,11 | 10,14 |
| Voc [V] | 51,4 | 51,8 | 52,2 | 52,6 | 52,9 | 53,4 | 53,8 |
| Isc [A] | 10,59 | 10,64 | 10,67 | 10,71 | 10,74 | 10,77 | 10,81 |
| Sprawność modułu [%] | 21,5 | 21,8 | 22,0 | 22,3 | 22,5 | 22,8 | 23,0 |

Tolerancja mocy: 0/+5 W.

## Parametry elektryczne w NOCT (800 W/m², 20 °C, wiatr 1 m/s)

| Typ | 430 | 435 | 440 | 445 | 450 | 455 | 460 |
|---|---|---|---|---|---|---|---|
| Pmax [W] | 329 | 333 | 337 | 341 | 344 | 348 | 352 |
| Vmpp [V] | 40,7 | 41,0 | 41,4 | 41,7 | 42,0 | 42,3 | 42,7 |
| Impp [A] | 8,08 | 8,12 | 8,14 | 8,17 | 8,19 | 8,22 | 8,25 |
| Voc [V] | 48,7 | 49,1 | 49,5 | 49,9 | 50,2 | 50,6 | 51,0 |
| Isc [A] | 8,54 | 8,58 | 8,60 | 8,63 | 8,66 | 8,68 | 8,71 |

## Wskaźniki temperaturowe i wartości graniczne

| Parametr | Wartość |
|---|---|
| NOCT (nominalna temperatura pracy ogniwa; warunki: 800 W/m², 20 °C, 1 m/s) | **43 °C (±2 °C)** |
| Współczynnik temperaturowy Pmax (γ) | **−0,29%/°C** |
| Współczynnik temperaturowy Voc | −0,24%/°C |
| Współczynnik temperaturowy Isc | +0,04%/°C |
| Temperatura pracy | −40 do +85 °C |
| Maks. napięcie układu | 1500 V DC (IEC) |
| Maks. zabezpieczenie prądowe | 25 A |

## Czego karta NIE podaje (w katalogu: `null` lub wniosek opisany niżej, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych dla 200–1000 W/m², bez liczby);
- **bifacjalności**: karta nazywa moduł „podwójne szkło”, ale nie zawiera współczynnika bifacjalności, tabeli zysku od tyłu ani słowa „dwustronny”;
  zdjęcie na okładce pokazuje jasny (biały) tył. W katalogu `bifacjalny: false` (to flaga wyłącznie ostrzegawcza „panel dwustronny — liczona tylko strona przednia”,
  nie wpływa na uzysk). Wniosek z braku danych, nie z odczytu — do potwierdzenia z dostawcą.
