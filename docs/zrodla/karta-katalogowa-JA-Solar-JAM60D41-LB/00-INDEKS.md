# Karta katalogowa — JA Solar JAM60D41 LB "Deep Blue 4.0" (seria 485–510W)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (13.09.2026) jako zdjęcie
karty katalogowej producenta. Zapisany 1:1: `karta-katalogowa-JAM60D41-LB.webp`. Uzupełnia
brakujące parametry elektryczne panelu JA Solar 500W wskazane jako luka w
`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md` (sekcja G.1 tamtego
materiału podawała tylko moc/wymiary/wagę, bez Voc/Vmp/Isc/Imp/współczynników temperaturowych).

## Parametry mechaniczne (wszystkie warianty serii)

| Parametr | Wartość |
|---|---|
| Ogniwo | Mono, N-type, 16-BB |
| Waga | 27,3 kg |
| Wymiary | 1953±2 × 1134±2 × 30±1 mm |
| Przekrój kabla | 4mm² (IEC) / 12 AWG (UL) |
| Liczba ogniw | 120 (6×20) |
| Skrzynka przyłączeniowa | IP68, 3 diody |
| Złącze | MC4-EVO2A |
| Długość kabla | 1200mm (+) / 1200mm (−) |

## Parametry elektryczne w STC (1000W/m², 25°C, AM 1.5G)

| Typ | -485/LB | -490/LB | -495/LB | **-500/LB** | -505/LB | -510/LB |
|---|---|---|---|---|---|---|
| Moc maksymalna znamionowa Pmax [W] | 485 | 490 | 495 | **500** | 505 | 510 |
| Napięcie jałowe Voc [V] | 43,25 | 43,45 | 43,65 | **43,85** | 44,05 | 44,25 |
| Napięcie w MPP (Vmp) [V]* | 36,28 | 36,49 | 36,70 | **36,91** | 37,11 | 37,31 |
| Prąd zwarciowy Isc [A] | 14,24 | 14,30 | 14,36 | **14,42** | 14,48 | 14,54 |
| Prąd w MPP (Imp) [A] | 13,37 | 13,43 | 13,49 | **13,55** | 13,61 | 13,67 |
| Sprawność modułu [%] | 21,9 | 22,1 | 22,4 | **22,6** | 22,8 | 23,0 |

Tolerancja mocy: 0~+3%. Współczynniki temperaturowe (wspólne dla całej serii):
- α (Isc): **+0,045%/°C**
- β (Voc): **−0,250%/°C**
- γ (Pmax): **−0,290%/°C**

*\* Uwaga o etykiecie źródła:* karta katalogowa nazywa ten wiersz "Maksymalne napięcie zasilania
(Voc)" — to najwyraźniej błąd/skrót producenta w tłumaczeniu, nie realny drugi Voc. Wartości w tym
wierszu są systematycznie niższe niż wiersz "Napięcie jałowe (Voc)" i pasują strukturalnie do
napięcia w punkcie mocy maksymalnej (Vmp < Voc, zgodnie z fizyką ogniwa PV oraz z sąsiednim
wierszem Imp < Isc) — potraktowane tu jako **Vmp**, nie jako osobny/dodatkowy Voc. Nie
rozstrzygnięte formalnie z producentem, ale wystarczająco pewne, żeby użyć w kalkulatorach (żadna
inna interpretacja tego wiersza nie ma sensu fizycznego).

## Warunki pracy

| Parametr | Wartość |
|---|---|
| Maksymalne napięcie układu | 1500V DC |
| Temperatura pracy | −40°C ~ +85°C |
| Maks. prąd znamionowy bezpiecznika (połączenia szeregowe) | 30A |
| Maks. obciążenie statyczne przód / tył (dopisane 09.10.2026 z obrazu karty, ramka „Warunki pracy”) | 5400 Pa (112 lb/ft²) / 2400 Pa (50 lb/ft²) |
| NOCT | 45±2°C |
| Klasa bezpieczeństwa | Class II |
| Odporność na ogień | UL Typ 29 / klasa C |

## Status wykorzystania

Nieużywane jeszcze w kodzie. Docelowe zastosowanie: dostarcza realne Voc/Vmp/Imp/β dla wariantu
**-500/LB** (ten, do którego odnosi się `Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md`,
Etap G) — do użycia jako dane wejściowe przy wywołaniu (echo) istniejących kalkulatorów
`lib/core/modules/pv/stress-test-mppt/` i `lib/core/modules/pv/dopasowanie-tablicy-falownika/`,
zamiast przybliżenia "Voc~50V" z materiału. Zobacz `docs/memory.md` (13.09.2026, sekcja "Poprawki
do modułu Dobór napięcia") po pełną analizę i przeliczenie kontrolne.

Karta katalogowa zawiera też tabelę "Parametry elektryczne przy uwzględnieniu 10% współczynnika
odbicia promieniowania" (zysk bifacjalny z tyłu modułu) — pominięta tu celowo jako nieużywana:
do doboru stringu/MPPT używa się wartości STC (przedniej strony) jako bezpiecznego, zachowawczego
punktu odniesienia; zysk bifacjalny podnosiłby Isc/Imp/Pmax, nie obniżał, więc pomijanie go nie
jest ryzykiem bezpieczeństwa (margines rośnie, nie maleje).

## Uzupełnienie 08.10.2026 — okładka karty w wersji polskiej (`karta-pl-okladka-gwarancja.webp`)

Właściciel dostarczył zrzut okładki polskiej wersji karty (pvzenit.pl), serwowany w aplikacji jako drugi obraz katalogu
(`public/zrodla/paneli/ja-solar-jam60d41-lb-2.webp`). Tabele polskiej wersji (STC, 10% odbicia, warunki pracy) zawierają te same liczby, co
transkrypcja wyżej. Nowa informacja z okładki — **gwarancje i degradacja**:

| Pozycja | Wartość |
|---|---|
| Gwarancja na produkt | 15 lat |
| Gwarancja liniowa mocy | 30 lat |
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat |
| Gwarantowana moc po 30 latach | 87,4% (wykres: 99% na starcie) |

Spójność: 100% − 1% − 29 × 0,4% = 87,4%. Wcześniej katalog miał tu `null` (stara fotografia nie zawierała okładki); teraz 1,0% + 0,4%/rok.
Karta podaje też współczynnik bifacjalności 80% ± 10% (w warunkach pracy) — niewykorzystywany w Etapie A1.
