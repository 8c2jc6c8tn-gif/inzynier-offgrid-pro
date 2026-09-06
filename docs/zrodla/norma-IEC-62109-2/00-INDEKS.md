# Indeks — IEC 62109-2:2011 ("Safety of power converters for use in photovoltaic power systems — Part 2: Particular requirements for inverters")

Źródło: `docs/zrodla/norma-IEC-62109-2/IEC-62109-2-2011-Safety-of-power-converters-inverters.pdf`
(30 stron, pobrany z pdfcoffee.com — kopia dokumentu FDIS/Final Draft International Standard
82/636/FDIS, w **języku angielskim**, natywny tekst PDF, nie skan). Metoda ekstrakcji: tekst
natywny + odczyt wizualny (weryfikacja tabel).

## ✅ Kompletny dokument — od strony tytułowej po bibliografię (str. 1-30), nic nie brakuje

W odróżnieniu od pliku HD 60364-7-712 dostarczonego w tym samym zestawie (patrz
`docs/zrodla/norma-HD-60364-7-712/00-INDEKS.md` — tam tylko wyciąg/spis treści), **to jest pełny
tekst normy**, zweryfikowany strona po stronie. Uwaga: to jest **FDIS** (Final Draft International
Standard, wersja z 2011-02-18 do głosowania równoległego IEC/CENELEC) — treść merytorycznie
odpowiada finalnie opublikowanej IEC 62109-2:2011, ale formalnie jest to wersja projektowa
("NIE MOŻE BYĆ PRZYWOŁYWANA JAKO NORMA MIĘDZYNARODOWA, dopóki nie zostanie opublikowana jako
taka" — zastrzeżenie z własnej strony tytułowej dokumentu). Dla celów tego projektu (referencja
techniczna, nie formalna certyfikacja) treść jest w pełni użyteczna.

## Odpowiada IEC 62109-2 z polskim odpowiednikiem PN-EN 62109-2:2011

Ta sama norma, do której odsyła materiał branżowy PV 2019
(`docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`, Tabela 1-5) oraz norma HD 60364-7-712
(`docs/zrodla/norma-HD-60364-7-712/`, lista norm do konsultacji, 712.2).

## Zakres i struktura

Część 2 uzupełnia/modyfikuje Część 1 (IEC 62109-1:2010, wymagania ogólne) — klauzule niewymienione
w Części 2 obowiązują wprost z Części 1. Dotyczy falowników grid-interactive, stand-alone i
multi-mode, zasilanych z jednego lub wielu modułów PV, także w połączeniu z akumulatorami — **to
czyni tę normę bezpośrednio istotną dla systemów off-grid**, nie tylko on-grid (w odróżnieniu od
materiału PV 2019, który sam siebie ograniczał do on-grid).

**Ważne zastrzeżenie własne normy:** norma NIE obejmuje wymagań przyłączenia do sieci
(interconnection) — to celowe (brak konsensusu międzynarodowego w momencie pisania).

### Definicje kluczowe (rozdz. 3)
- **functionally grounded array** — tablica PV z jednym przewodem celowo uziemionym w celach innych
  niż bezpieczeństwo (np. przez impedancję) — NIE jest to "grounded array".
- **grounded array** — tablica PV z jednym przewodem uziemionym zgodnie z wymaganiami uziemienia
  ochronnego.
- **isolated inverter** — falownik z co najmniej prostą separacją między siecią a obwodami PV.
- **non-isolated inverter** — falownik bez takiej separacji.
- **multiple mode inverter** — falownik pracujący w więcej niż jednym trybie (np. grid-interactive
  gdy sieć obecna, stand-alone gdy sieć odłączona) — **bezpośrednio opisuje typowy falownik
  hybrydowy off-grid/on-grid używany w tym projekcie**.
- **inverter backfeed current** — maksymalny prąd, jaki falownik może wymusić na tablicy PV i jej
  okablowaniu, w warunkach normalnych lub pojedynczej awarii.

### 4.7 Wymagania dla falowników stand-alone (istotne dla off-grid)
- Napięcie wyjściowe AC w stanie ustalonym: 90-110% wartości znamionowej (przy nominalnym napięciu
  wejściowym DC); 85-110% w całym zakresie napięcia wejściowego DC.
- Odpowiedź na skok obciążenia: napięcie AC musi wrócić do 85-110% w ciągu 1,5 s po zmianie
  obciążenia (pełne obciążenie ↔ brak obciążenia).
- Częstotliwość wyjściowa: odchylenie nie większe niż +4%/-6% wartości znamionowej.
- Kształt fali sinusoidalnej: THD ≤10%, żadna pojedyncza harmoniczna nie przekracza 6%.
- Kształt fali niesinusoidalnej (dopuszczalny alternatywnie): THD ≤40%, nachylenie zbocza ≤10 V/µs
  (mierzone między 10% a 90% wartości szczytowej), wartość szczytowa ≤1,414×110% wartości
  skutecznej znamionowej.
- Test przełączenia awaryjnego (load transfer, 4.4.4.16): przy przełączniku transferowym
  mains↔falownik, przesunięcie fazowe 180° (1-fazowy) / 120° (3-fazowy) nie może spowodować
  pożaru ani porażenia.

### 4.8 Dodatkowe testy dla falowników grid-interactive
**Tablica 30 — Wymagania wg izolacji falownika i uziemienia tablicy PV** (macierz 3×4: kombinacje
non-isolated/isolated × ungrounded/grounded, określające wymagany pomiar rezystancji izolacji i
wykrywanie prądu resztkowego).

**4.8.2 Wykrywanie rezystancji izolacji tablicy PV:** próg R = V_MAX_PV / 30 mA. Poniżej tego progu
— falownik izolowany: sygnalizuje usterkę, może kontynuować pracę; falownik nieizolowany (lub o
izolacji niespełniającej wymagań): sygnalizuje usterkę i NIE łączy się z siecią.

**Tablica 31 — Limity czasu odpowiedzi na nagłe zmiany prądu resztkowego:**

| Nagła zmiana prądu resztkowego | Maks. czas do odłączenia falownika od sieci |
|---|---|
| 30 mA | 0,3 s |
| 60 mA | 0,15 s |
| 150 mA | 0,04 s |

(Wartości oparte na normie RCD IEC 61008-1.)

**4.8.3.1 Progi prądu resztkowego ciągłego (fire hazard):** 300 mA RMS dla falowników ≤30 kVA;
10 mA RMS na kVA mocy ciągłej dla falowników >30 kVA. Próg dotyku (shock hazard, izolowane
falowniki): 30 mA.

### 5. Znakowanie i dokumentacja
**Tablica 32 — Wymagania znakowania znamionowego falownika:** V_max PV (d.c.), I_sc PV (d.c.),
napięcie/prąd/częstotliwość/moc/współczynnik mocy wyjścia AC, napięcie/prąd/częstotliwość wejścia
AC (jeśli dotyczy), napięcie/prąd wejścia DC innego niż PV (jeśli dotyczy), napięcie/prąd wyjścia
DC (jeśli dotyczy), klasa ochronności (I/II/III), stopień IP.

**Tablica 33 — Wymagania dokumentacyjne (szersze niż znakowanie):** jak wyżej plus: zakres pracy
napięcia wejściowego PV, maksymalny prąd wejściowy PV, **maksymalny prąd zwrotny falownika do
tablicy (backfeed current)**, prąd rozruchowy AC, maksymalny prąd zwarciowy wyjścia AC lub
maksymalne zabezpieczenie nadprądowe wyjścia, napięcie nominalne akumulatora (jeśli dotyczy).

### 7-14. Ochrona przed zagrożeniami
- **7.3.10-7.3.11:** wymagania dodatkowe dla falowników stand-alone — uziemienie przewodu wyjścia
  (jeśli wymagane przez system zasilania) musi być zrealizowane w jednym miejscu na raz w każdym
  trybie pracy; wszystkie przewody PV w tablicy funkcjonalnie uziemionej traktowane jako części
  czynne dla celów ochrony przed porażeniem.
- **9.3.4 Prąd zwrotny falownika do tablicy (backfeed current):** wymagane testowanie i
  dokumentacja wartości niezależnie od jej wielkości — chroni przed przeciążeniem okablowania
  tablicy PV prądem płynącym z sieci/akumulatora z powrotem przez falownik.
- **13.9 Sygnalizacja usterki:** wymagana zarówno sygnalizacja lokalna (widoczna/słyszalna) JAK I
  zdalna (elektroniczna/sieciowa) — dwa niezależne kanały jednocześnie.

## Bibliografia (odniesienia normatywne cytowane w dokumencie)

IEC 60364-7-712 (instalacje PV — norma, którą mamy tylko jako wyciąg, patrz
`docs/zrodla/norma-HD-60364-7-712/`); IEC 61008-1 (RCD); IEC 61727 (charakterystyki przyłączenia do
sieci); IEC 61730-1 (kwalifikacja bezpieczeństwa modułów PV); IEC 62116 (zapobieganie wyspowej
pracy falowników); EN 50438; IEEE 1547; DIN V VDE V 0126-1-1; AS 4777.3.

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany, kompletny. Niewykorzystany jeszcze w kodzie — dotąd
IEC 62109 był na liście certyfikatów tylko jako nazwa (M5/Ekran 21), teraz mamy pełną treść
techniczną, w tym konkretne progi liczbowe (Tabela 31, progi backfeed current) przydatne dla
przyszłych kalkulatorów doboru/weryfikacji falownika, zwłaszcza multi-mode (hybrydowe off-grid).
