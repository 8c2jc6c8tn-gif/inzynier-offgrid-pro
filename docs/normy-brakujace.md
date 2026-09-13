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
