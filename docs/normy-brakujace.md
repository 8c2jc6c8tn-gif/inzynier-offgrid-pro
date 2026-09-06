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

- **UNE-HD 60364-7-712:2017 (instalacje PV), pełny tekst.** Dziś mamy tylko wyciąg — sam spis
  treści + bibliografia (6 stron), `docs/zrodla/norma-HD-60364-7-712/`. Brakuje dokładnie
  klauzul 712.41–712.6 (ochrona, dobór materiałów, SPD) i **Załącznika B** (wzór
  U_OC MAX / I_SC MAX dla stringów PV) — formalnego źródła normatywnego dla modułu
  `konfigurator-stringow` (dziś ten wzór w kodzie nie jest oparty o żadną normę, bo żadnej nie
  mieliśmy). To jest dziś **jedyna** pozycja w tej sekcji z realnym, nazwanym wpływem na
  konkretny, już istniejący kod.

## 🔵 Spodziewane — zapowiedziane przez właściciela projektu

- **Eurokod obciążenia śniegiem (PN-EN 1991-1-3 + załącznik krajowy).** Potrzebny dla ekranu
  "Obciążenie dachu śniegiem" (`docs/rejestr-pokrycia.md`, dziś `todo` z notatką "ryzyko braku
  normy budowlanej"). **[06.09.2026] Zapowiedziane przez właściciela projektu — w drodze.**

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

*(pusta na razie — pierwszy wpis pojawi się, gdy któraś z norm powyżej zostanie dostarczona i
przeniesiona do `docs/zrodla/README.md`)*
