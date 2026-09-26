# Rejestr brakujących norm — Inżynier Offgrid Pro

Zbiorcza, przeszukiwalna lista norm/materiałów formalnych, które są **potrzebne** kalkulatorom tej
aplikacji, ale **nie mamy jeszcze ich pełnej treści** w `docs/zrodla/`. To jest indeks stanu
pozyskania źródeł, nie rejestr zadań kodowych (te są w `docs/rejestr-pokrycia.md`) ani rejestr
twardych stopów (`docs/rejestr-twardych-stopow.md`). Cel: żeby żadna sesja AI/właściciel projektu
nie musiał od nowa ustalać, czego jeszcze brakuje.

**Zasada zapisu:** nie usuwać pozycji przy zmianie statusu — przenosić między sekcjami z datą i
notatką (`docs/standards/15-wspolpraca-z-ai.md`, 15.3 "nie usuwaj — oznacz"). Gdy norma zostanie
dostarczona: przenieść wpis do `docs/zrodla/README.md` (pełny opis) i tutaj zostawić tylko
jednolinijkowy wpis w nowej sekcji "Pozyskane (historia)" z odnośnikiem, żeby nie duplikować opisu.

**Statusy:** 🔴 krytyczna (aktywnie blokuje konkretny, już zidentyfikowany ekran) · 🟡 potrzebna,
nie blokuje dziś niczego konkretnego (na razie tylko `todo`/nie zaczęte) · 🔵 spodziewana
(właściciel projektu zapowiedział dostarczenie) · ⚪ zidentyfikowana tylko z nazwy (z bibliografii
innej normy albo z indeksu branżowego), treść nieznana nawet pobieżnie.

---

## 🔴 Krytyczne — aktywnie potrzebne dla już zidentyfikowanego ekranu

*(pusta — jedyna pozycja, UNE-HD 60364-7-712, dostarczona w pełni 06.09.2026, patrz "Pozyskane
(historia)" niżej. [07.09.2026] ✅ PRZENIESIONO — wynik audytu GOD BOOK Część N, znaleziony dryf:
plik pełnej normy trafił do repo bezpośrednio na `main` 06.09.2026 i został użyty w kodzie tego
samego dnia, ale ten wpis oraz odpowiedni `00-INDEKS.md`/`docs/zrodla/README.md` nie zostały
wtedy zaktualizowane — naprawione teraz, przy okazji.)*

[25.09.2026] ✅ DODANO — źródło: pełne wyliczenie Modułu 3 (sesja 25.09.2026).

- ✅ **[25.09.2026] POZYSKANA — patrz "Pozyskane (historia)".** ~~PN-EN 1991-1-4 (Eurokod 1 — oddziaływania wiatru)~~ — współczynniki siły/ciśnienia dla dachów
  wiat i paneli w zależności od kąta nachylenia. **Blokuje:** M3/E9 „Złoty środek” (krzywa naporu
  wiatru w funkcji kąta — wzór E6 nie zawiera kąta), M3/E6 (siła ssania i wymagany balast — dziś
  tylko `F=0,5ρv²ACd`), M3/E2 tryb „dach płaski/grunt” (balast). Ta sama rodzina co już
  dostarczona PN-EN 1991-1-3 (śnieg).

- ✅ **[26.09.2026] POZYSKANA I UŻYTA** (paczka New-info, `docs/zrodla/norma-PN-EN-1990-eurokod-0/`; Tablica A1.2(A) i
  załącznik krajowy NB zweryfikowane wizualnie z oryginałem PDF; kod: `lib/core/modules/pv/eurokod-0/`, D29).
  ~~**PN-EN 1990 (Eurokod — podstawy projektowania konstrukcji)** [25.09.2026] — częściowe
  współczynniki bezpieczeństwa (obciążenie zmienne — wiatr, oddziaływanie stałe stabilizujące —
  ciężar balastu). **Blokuje:** balast PROJEKTOWY w M3/E9 (D27), M3/E6, M3/E2 — bez niej aplikacja
  pokazuje tylko masę równoważącą samą siłę wiatru. Potrzebny fragment: Załącznik A1 (tablice
  wartości obliczeniowych oddziaływań) + Załącznik krajowy.

## 🔵 Spodziewane — zapowiedziane przez właściciela projektu

*(pusta na razie)*

## 🟡 Potrzebne, nie blokują dziś konkretnego kodu (zidentyfikowane wcześniej w rozmowie o normach)

- **IEC 62109-1** (bezpieczeństwo przetwornic mocy PV — część 1, wymagania ogólne). Mamy tylko
  **Część 2** (falowniki, `docs/zrodla/norma-IEC-62109-2/`) — Część 1 nigdy nie dostarczona.
- **IEC 61215** (kwalifikacja konstrukcji/typu modułów fotowoltaicznych) — norma testowa/
  certyfikacyjna dla samych paneli, nie instalacji; wyjaśniona użytkownikowi wcześniej co robi,
  treść nigdy nie pozyskana.
- **IEC 62619** (bezpieczeństwo akumulatorów litowo-jonowych w zastosowaniach stacjonarnych) —
  jw., wyjaśniona koncepcyjnie, treść nigdy nie pozyskana.
- **EN 61439** (pełna seria — rozdzielnice i sterownice niskonapięciowe, zestawy aparatury
  łączeniowej) — jw., wyjaśniona koncepcyjnie (w tym: czy wystarczy wersja angielska), treść
  nigdy nie pozyskana.

- **PN-EN 12831-1 (obciążenie cieplne budynków — metoda obliczania)** [25.09.2026] — silnik
  „zapotrzebowanie na ciepło z metrażu/przegród” (M6, Część 2D — luka jawnie oznaczona w samym
  źródle); potrzebna, żeby ekran liczby paneli (M3/E4, D25) i dobór dogrzewania (pomysł
  „ogrzewanie paliwowe typu webasto”, 25.09.2026) mogły powiązać metraż budynku z zimowym
  zapotrzebowaniem, zamiast wpisu ręcznego.
  **[26.09.2026] Częściowo obejście (nie pozyskanie):** M6/E1 „Straty ciepła budynku” zbudowany z fizyki
  opisanej wprost w źródle (Σ U·A·ΔT + wentylacja) i temperatur obliczeniowych stref (PN-82/B-02403 =
  zał. krajowy PN-EN 12831 wg Purmo). Norma nadal potrzebna do: mostków cieplnych (Ψ, M6/E7),
  współczynników strat do gruntu, zysków i nadwyżki mocy na nagrzewanie — ekran jawnie ostrzega o ich braku.

## ⚪ Zidentyfikowane tylko z nazwy (z bibliografii/indeksów innych źródeł)

Odkryte przy analizie bibliografii UNE-HD 60364-7-712 (05.09.2026) — dotąd nie mieliśmy ich nawet
z nazwy:

- **HD 60364-4-443** (ochrona przed przepięciami atmosferycznymi i łączeniowymi).
- **HD 60364-5-551** (zespoły prądotwórcze/agregaty) — **bezpośrednio istotna dla funkcji 1.19
  "Agregat prądotwórczy — definicja i logika"** (Moduł 2), dziś zbudowanej bez formalnego źródła
  normatywnego dla tej części.
- **Pełna seria EN 62305** (ochrona odgromowa) — mamy tylko wzmiankę z indeksu norm w materiale
  branżowym PV-2019 (`docs/zrodla/materialy-branzowe-PV-2019/`), nie treść.

Odkryte przy analizie indeksu norm w materiale branżowym PV-2019 (05–06.09.2026), lista 34 z 43
pozycji (`docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`) — nazwa/numer znany, treść nie:

- **PN-EN 62852** (złącza DC dla instalacji fotowoltaicznych).
- **PN-EN 61427-1** (akumulatory do zastosowań fotowoltaicznych off-grid).
- **PN-EN 50565-1:2014** (przewody elektryczne).

## ⚫ Nieznane nawet z nazwy — zgubione przy konwersji

9 pozycji z numerowanej listy 43 norm w materiale branżowym PV-2019 zgubiło się przy konwersji
PPTX→DOCX zrobionej przez użytkownika (prawdopodobnie na granicach slajdów) — nie zgadywane,
odnotowane jawnie jako nieznane w `docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`:
pozycje **#2, #6, #10, #13, #17, #27, #29, #33, #37** tej listy. Jeśli właściciel projektu ma
dostęp do oryginalnej prezentacji (nie konwersji), warto sprawdzić te konkretne numery.

---

## Pozyskane (historia — dla śledzenia, co przeszło z tej listy do `docs/zrodla/`)

- **[06.09.2026] Eurokod obciążenia śniegiem — PN-EN 1991-1-3:2005**, dostarczony przez
  właściciela projektu, 54 strony, w pełni zweryfikowany wizualnie strona po stronie (nie
  spot-check). Odblokowuje ekran "Obciążenie dachu śniegiem" (`docs/rejestr-pokrycia.md`). Pełny
  opis: `docs/zrodla/norma-PN-EN-1991-1-3/00-INDEKS.md` i `docs/zrodla/README.md`.
- **[06.09.2026] UNE-HD 60364-7-712:2017, pełny tekst (35 stron)**, dostarczony przez właściciela
  projektu bezpośrednio na `main` (poprzednio mieliśmy tylko 6-stronicowy wyciąg spisu treści).
  Przeczytany w całości i użyty tego samego dnia do przepisania `ochrona-stringow` (M3/E22) wg
  §712.431-433 + Załącznik B.2 (K1=1,25, I_SC_MAX, przedział doboru bezpiecznika); wzór w
  `stress-test-mppt` (M3/E5) potwierdzony jako zgodny z Załącznikiem B.1 bez zmian. Plik
  przeniesiony do `docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf` przy
  audycie 07.09.2026 (wcześniej leżał luzem w `docs/zrodla/` pod nieopisową nazwą). Pełny opis:
  `docs/zrodla/norma-HD-60364-7-712/00-INDEKS.md` i `docs/zrodla/README.md`.
- **[25.09.2026] PN-EN 1991-1-4:2008 + AC:2009 — Eurokod 1, oddziaływanie wiatru**, dostarczona przez
  właściciela projektu (161 stron, z Załącznikiem krajowym NA). Oryginał poza repo (licencja PKN,
  dane osobowe w znaku wodnym — `docs/memory.md` "Licencje norm w publicznym repozytorium").
  Notatka robocza: `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`. Odblokowuje M3/E9 częściowo
  (wiatr 0–30° i 90°), M3/E6 i E2 (balast) — do opracowania.
