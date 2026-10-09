# Karta katalogowa — JA Solar JAM66D46 LB (seria dwustronna 695–720 W), wersja Global-EN-20241107A

**Status:** materiał źródłowy, dostarczony przez właściciela projektu (08.10.2026) jako zrzuty ekranu strony sklepu pvzenit.pl.
To **nowsza wersja karty** tego samego modułu co `docs/zrodla/karta-katalogowa-JA-Solar-JAM66D46-LB/` (690–715 W): dodaje moc **720 W**, a nie ma mocy 690 W.
Zapisane jako obrazy, przycięte do samej karty (bez pasków telefonu i przeglądarki). Na okładce odcięty został dół (część listy certyfikatów),
bo zasłaniała go nakładka koszyka sklepu — nie zawiera danych technicznych:

- `karta-1-okladka.webp` — okładka: moce 695–720 W, gwarancje (12 lat produkt, 30 lat liniowa moc), numer wersji karty „Global-EN-20241107A”;
- `karta-2-parametry.webp` — parametry mechaniczne i elektryczne (STC i z 10% tyłu), gwarancja (wykres), warunki pracy, krzywe I–V i P–V.

Te same obrazy są serwowane przez aplikację (`public/zrodla/paneli/ja-solar-jam66d46-lb-695-720-1.webp`, `-2.webp`) jako klikalne
potwierdzenie danych katalogu (`lib/core/dane/katalog-paneli-pv`).

## Parametry w STC (1000 W/m², 25 °C, AM 1,5G)

| Typ | -695/LB | -700/LB | -705/LB | -710/LB | -715/LB | -720/LB |
|---|---|---|---|---|---|---|
| Pmax [W] | 695 | 700 | 705 | 710 | 715 | 720 |
| Voc [V] | 48,00 | 48,20 | 48,40 | 48,60 | 48,80 | 49,00 |
| Vmp [V] | 40,22 | 40,42 | 40,61 | 40,80 | 41,00 | 41,19 |
| Isc [A] | 18,39 | 18,43 | 18,47 | 18,51 | 18,55 | 18,59 |
| Imp [A] | 17,28 | 17,32 | 17,36 | 17,40 | 17,44 | 17,48 |
| Sprawność modułu [%] | 22,4 | 22,5 | 22,7 | 22,9 | 23,0 | 23,2 |

Liczby dla 695–715 W są identyczne z wcześniejszą kartą 690–715 W. Tolerancja mocy 0~+3%. Współczynniki temperaturowe: α (Isc) **+0,045%/°C**,
β (Voc) **−0,250%/°C**, γ (Pmax) **−0,290%/°C**.

## Gwarancja i warunki pracy

| Pozycja | Wartość |
|---|---|
| Degradacja w pierwszym roku | 1% |
| Degradacja roczna | 0,4% przez 30 lat (87,4% po 30 latach; wykres: 99% na starcie) |
| Gwarancja produktowa / liniowa mocy | 12 lat / 30 lat |
| Mechanika | jak w karcie 690–715 W: 2384±2 × 1303±2 × 33±1 mm, 38,2 kg, 132 ogniwa (6×22), IP68, 3 diody |
| Maks. napięcie układu | 1500 V DC |
| Temperatura pracy | −40 °C ~ +85 °C |
| Maks. bezpiecznik szeregowy | 35 A |
| Maks. obciążenie statyczne przód / tył | 5400 Pa / 2400 Pa |
| NOCT | **45±2 °C** |
| Bifacjalność | 80% ± 5% |
| Odporność na ogień | UL Type 29 |

## Różnice względem wcześniejszej karty 690–715 W (nie rozstrzygane, zapisane)

| Pozycja | Karta 690–715 W | Karta 695–720 W (ta) |
|---|---|---|
| Bifacjalność | 80% ± 10% | 80% ± 5% |
| Odporność na ogień | UL Type 29 / Class C | UL Type 29 |
| Klasa bezpieczeństwa | Class II | nie podana |

Żadna z tych różnic nie wchodzi do obliczeń uzysku.

## Błąd druku w tabeli „10% promieniowania odbitego”

Tabela podaje Pmax: 751 (695 W), **659, 664, 670, 675, 680** (700–720 W). Wartości dla 700–720 W są niemożliwe (moc z tyłem 10% nie może być
niższa od mocy STC) i niezgodne z V·I tej samej tabeli (np. 700 W: 40,42 V × 18,71 A = 756 W; 720 W: 41,19 × 18,88 = 778 W); wcześniejsza karta podaje tu
756, 761, 767, 772. Przepisane 1:1 jako błąd druku producenta, nieużywane w katalogu ani w silniku.

## Czego karta NIE podaje (w katalogu: `null`, nigdy wartość typowa)

- sprawności względnej przy 200 W/m² (są tylko wykresy krzywych, bez liczby).
