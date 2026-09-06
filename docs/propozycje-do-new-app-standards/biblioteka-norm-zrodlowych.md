# PROPOZYCJA dla `new-app-standards` — Współdzielona biblioteka norm źródłowych

> **Status: propozycja, nie standard.** Ten plik to manifest/spis materiałów, powiązany ze
> zgłoszeniem w `docs/wklad-do-standardu.md`. **Nie jest częścią `docs/standards/`** i nie ma mocy
> obowiązującej — decyzja o utworzeniu współdzielonej biblioteki i sposób jej prowadzenia
> zapadają wyłącznie w sesji pracującej bezpośrednio nad repo `new-app-standards` (GOD BOOK
> Część Y.8). Ten plik istnieje, żeby ta przyszła sesja miała gotowy, dokładny spis "co i gdzie
> leży, w jakim jest stanie" zamiast przeszukiwać repo od zera.

## Kontekst i cel

W tym repo (`inzynier-offgrid-pro`) zgromadzono 10 źródeł normatywnych/branżowych w
`docs/zrodla/`, dotyczących w większości **generycznej elektryki niskiego napięcia i budownictwa**
(instalacje elektryczne, ochrona przeciwporażeniowa, PV, obciążenia budowlane) — nie tylko off-grid.
Każda przyszła aplikacja inżynierska tej rodziny (np. kolejny "Kalkulator Inżyniera Pro", instalator
PV on-grid, projektant instalacji elektrycznej budynku) prędzej czy później **potrzebuje tych
samych norm** — bez współdzielonej biblioteki każdy projekt kupuje/skanuje/OCR-uje/weryfikuje je
od nowa, tracąc czas i pieniądze (część tych norm to płatne zakupy PKN).

Propozycja: `new-app-standards` (albo osobne repo pod nim, np. `biblioteka-norm`) trzyma **kopię
tego, co jest tu już przetworzone i zweryfikowane** — oryginał + wyciąg treści w Markdown — jako
zasób współdzielony, z jasno oznaczonym stanem każdej pozycji (patrz tabela niżej), żeby kolejny
projekt wiedział, czemu może zaufać bez ponownej weryfikacji, a co wymaga jeszcze pracy.

## Konwencja przechowywania w tym repo (do skopiowania razem z treścią)

Pełny opis metodologii ekstrakcji: `docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`
(osobne zgłoszenie). Skrót struktury:

- Jeden folder na jeden dokument źródłowy: `docs/zrodla/norma-<OZNACZENIE>/` (formalne normy
  PN/IEC/EN/HD) albo `docs/zrodla/materialy-branzowe-<TEMAT>-<ROK>/` (literatura branżowa/
  szkoleniowa, nie norma — nazwa folderu celowo różna, żeby nie pomylić statusu prawnego).
- **Oryginał zachowany bez zmian** wewnątrz tego samego folderu (PDF/`.doc`/`.docx`, kopia 1:1
  tego, co dostarczył właściciel projektu).
- Treść przetworzona jako pliki `.md` w tym samym folderze, zawsze zaczynając od `00-INDEKS.md`
  (metoda ekstrakcji, zastrzeżenia o jakości źródła, mapa pozostałych plików, status weryfikacji
  i wykorzystania).
- **Znany drobny dryf, jeszcze nie naprawiony:** dwa najwcześniej dodane oryginały (5-52, 5-54)
  leżą w `docs/zrodla/` bezpośrednio (poziom wyżej niż ich własny folder `norma-*/`), zamiast
  wewnątrz `docs/zrodla/norma-PN-HD-60364-5-52/` i `docs/zrodla/norma-PN-HD-60364-5-54/` jak
  wszystkie kolejne — konwencja "oryginał w tym samym folderze" ustaliła się dopiero przy trzecim
  dodanym źródle. Nieszkodliwe (linki tekstowe w plikach `.md` cytują pełną ścieżkę), ale kopiując
  do wspólnej biblioteki, warto ujednolicić od razu — przenieść oba pliki do właściwych podfolderów.

## Manifest — co jest, w jakim stanie, dla kogo uniwersalne

| Norma / materiał | Folder w tym repo | Oryginał | Status weryfikacji | Zasięg | Rekomendacja |
|---|---|---|---|---|---|
| **PN-HD 60364-5-52:2011** (obciążalność prądowa kabli, dobór przekroju) | `docs/zrodla/norma-PN-HD-60364-5-52/` (oryginał dziś w `docs/zrodla/` — patrz dryf wyżej) | Skan, 96 str., zakupiona oficjalnie PKN | **Załącznik B (tabele obciążalności, str. 33-58) w pełni zweryfikowany strona po stronie** (~35 poprawionych błędów OCR). Reszta (Załączniki A, C, E-I, ZA-ZC) tylko wstępny spot-check. | Uniwersalny — każda aplikacja z instalacją elektryczną NN | Kopiować całość + jawnie przenieść status weryfikacji (Załącznik B ufny, reszta nie) |
| **PN-HD 60364-5-54:2010** (uziemienia, przewody ochronne PE) | `docs/zrodla/norma-PN-HD-60364-5-54/` (oryginał dziś w `docs/zrodla/`) | Natywny tekst PDF, 38 str., zakupiona oficjalnie | Kompletny, zweryfikowany wizualnie (wzory/tabele przeciw renderowi strony) | Uniwersalny | Kopiować całość. Uwaga: Załącznik ZC (krajowy PL) ma odnotowaną, nierozstrzygniętą rozbieżność 10mm²/16mm² dla Al chronionego mechanicznie — kopiować razem z tą flagą |
| **PN-IEC 60364-4-41:2000** (ochrona przeciwporażeniowa) | `docs/zrodla/norma-PN-IEC-60364-4-41/` | `.doc`, prywatny wyciąg z 2002, nie oficjalny skan PKN | Kompletny poza Tablicami 41A/41B (brakujące w tym konkretnym wyciągu — rozwiązane materiałem branżowym niżej) | Uniwersalny | Kopiować **razem z** `materialy-branzowe-ochrona-przeciwporazeniowa-2010/` (komplementarne — patrz niżej) |
| **PN-IEC 60364-4-43:1999** (ochrona przed przetężeniem) | `docs/zrodla/norma-PN-IEC-60364-4-43/` | `.doc`, prywatny wyciąg | Kompletny, zweryfikowany krzyżowo dwiema metodami ekstrakcji | Uniwersalny | Kopiować całość |
| **PN-EN 60445:2010** (identyfikacja zacisków urządzeń) | `docs/zrodla/norma-PN-EN-60445/` | Skan PKN, 16 str. | Kompletny, przeczytany w całości wizualnie | Uniwersalny | Kopiować całość |
| **IEC 62109-2:2011** (bezpieczeństwo przetwornic PV — falowniki, część 2) | `docs/zrodla/norma-IEC-62109-2/` | Natywny tekst, angielski (FDIS), 30 str. | Kompletny, od tytułu po bibliografię | Uniwersalny dla PV/inwerterów, nie tylko off-grid | Kopiować całość. **Uwaga: brak Części 1** (wymagania ogólne) — patrz `docs/normy-brakujace.md` tego repo |
| **UNE-HD 60364-7-712:2017** (instalacje PV) | `docs/zrodla/norma-HD-60364-7-712/` | Skan, 6 str. | 🔴 **Tylko spis treści + bibliografia — praktycznie bezużyteczny**, brak całej treści technicznej (klauzule 712.41-712.6, Załącznik B U_OC MAX/I_SC MAX) | Uniwersalny temat (każda instalacja PV), ale materiał bez wartości w obecnej postaci | Kopiować z **jawnym ostrzeżeniem "bezużyteczne"** albo pominąć do czasu zakupu pełnego tekstu przez którykolwiek projekt |
| **materiały branżowe "Bezpieczeństwo instalacji fotowoltaicznych" (2019)** | `docs/zrodla/materialy-branzowe-PV-2019/` | PDF + `.docx` (ten sam dokument, dwa formaty) | Przeanalizowany, nie jest normą — indeks 34/43 norm PV z dokładnymi numerami, tabele promieni gięcia/odległości/konserwacji | Uniwersalny dla tematyki PV | Kopiować całość — **szczególnie wartościowy jako gotowy indeks norm PV** do rozpoznania, czego jeszcze szukać |
| **materiał branżowy "Aktualne przepisy ochrony przeciwporażeniowej" (2010)** | `docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/` | PDF + `.docx` | Przeanalizowany, nie jest normą — rozwiązuje krytyczny brak Tablic 41A/41B z normy 4-41 wyżej, zawiera aktualną Tablicę 41.1 | Uniwersalny | Kopiować **razem z** `norma-PN-IEC-60364-4-41/` (jeden bez drugiego jest niepełny) |
| **PN-EN 1991-1-3:2005** (Eurokod 1, obciążenie śniegiem) | `docs/zrodla/norma-PN-EN-1991-1-3/` | Skan, 54 str. | Kompletny, przeczytany w całości wizualnie strona po stronie | Uniwersalny — każda aplikacja z konstrukcją dachową/budowlaną, nie tylko PV | Kopiować całość. **Uwaga**: Załącznik krajowy NB (mapa 5 stref) jest specyficzny dla Polski — dla projektu poza Polską potrzebny odpowiedni załącznik krajowy tego samego Eurokodu (Załącznik C, informacyjny, ma mapy dla 8 innych regionów Europy, ale to nie zastępuje formalnego załącznika krajowego danego kraju) |

## Co NIE jest tu uwzględnione (bo jest specyficzne dla Offgrid Pro, nie do kopiowania)

`docs/zrodla/Tresc_Modul_*.md`, `Tresc_WSZYSTKIE_MODULY_scalone.md`, `Zasady_UX_Doradca_v2_1.md`,
`Biblia_Offgrid_v2_0_Architektura_Modulowa.md` — to specyfikacja produktowa **tej konkretnej
aplikacji** (Offgrid Pro), nie normy inżynierskie — zostają tylko w tym repo.

## Lista wciąż brakujących norm (dla orientacji, co jeszcze dokupić/dodać do biblioteki w przyszłości)

Pełna, aktualna lista: `docs/normy-brakujace.md` w tym repo (IEC 62109-1, IEC 61215, IEC 62619,
EN 61439, HD 60364-4-443, HD 60364-5-551, EN 62305, EN 62852, EN 61427-1, PN-EN 50565-1, pełny
tekst UNE-HD 60364-7-712 — ta ostatnia jest jedyną oznaczoną jako krytyczna, reszta to zidentyfikowane
z nazwy, bez treści).
