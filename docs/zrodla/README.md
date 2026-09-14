# docs/zrodla/ — materiały źródłowe Offgrid (Biblia + treść modułów)

**2026-09-04 — zmiana nazwy z `docs/domena/`** na kanoniczną nazwę z GOD BOOK Część B.5
(`docs/zrodla/` — katalog materiałów źródłowych, nietykalny, tylko do odczytu). Ten folder pełnił
tę rolę od początku, tylko pod inną nazwą — na wyraźną decyzję właściciela projektu ujednolicono
nazewnictwo ze standardem. Treść plików bez zmian, patrz `docs/memory.md`.

To są surowe materiały produktowe/domenowe (specyfikacja Off-Grid PV v1.5/v2.0), **nie** część
`docs/standards/` (te są generyczne dla całej rodziny aplikacji). Trzymane w repo, żeby nie trzeba
było ich dosyłać ponownie w kolejnych sesjach AI — patrz `docs/memory.md`, wpis 2026-08-29
"Materiały źródłowe przeniesione do repo".

Zasada: pliki tu trafiają **bez zmian treści** (kopia 1:1 tego, co dostarczył autor projektu).
Jeśli treść okaże się przestarzała/sprzeczna z inną — nie nadpisywać cicho, zgłosić (Zasada 15.4).

## Stan na 2026-08-29 — komplet 13 modułów + pliki zbiorcze

| Plik | Moduł | Ekranów | Status |
|---|---|---|---|
| `Tresc_Modul_1_Lokalizacja_Ekrany.md` | 1 — Lokalizacja i teren | 4 | pełna treść |
| `Tresc_Modul_2_Zapotrzebowanie_Ekrany.md` | 2 — Zapotrzebowanie energetyczne | 16 + moduł zbiorczy wampirów | pełna treść, v1.1 (koryguje lokalizację 1.22/1.23, potwierdza duplikat 1.18) |
| `Tresc_Modul_3_PV_Ekrany.md` | 3 — Instalacja PV | 28 (2 infra + 26 treść) | pełna treść |
| `Tresc_Modul_4_Baterie_Ekrany.md` | 4 — Magazyn energii / baterie | 34 | pełna treść |
| `Tresc_Modul_5_Okablowanie_Ekrany.md` | 5 — Okablowanie | — | pełna treść |
| `Tresc_Modul_6_Ogrzewanie_Ekrany.md` | 6 — Ogrzewanie | — | pełna treść |
| `Tresc_Modul_7_StressTest_Ekrany.md` | 7 — Stress-test zimowy | — | pełna treść |
| `Tresc_Modul_8_Bezpieczenstwo_Ekrany.md` | 8 — Bezpieczeństwo | — | pełna treść |
| `Tresc_Modul_9_ESP32_Ekrany.md` | 9 — ESP32 / sterowanie | — | pełna treść |
| `Tresc_Modul_10_AI_Ekrany.md` | 10 — AI | — | pełna treść |
| `Tresc_Modul_11_MontazBaterii_Ekrany.md` | 11 — Montaż baterii | — | pełna treść |
| `Tresc_Modul_12_Kalkulator_Ekrany.md` | 12 — Kalkulator | — | pełna treść |
| `Tresc_Modul_13_Live_Ekrany.md` | 13 — Tryb Live | — | pełna treść |
| `Tresc_WSZYSTKIE_MODULY_scalone.md` | wszystkie, scalone | — | plik scalający treść 13 modułów + zbiorczy rejestr twardych stopów 🔴 + rejestr rozstrzygniętych duplikatów + sekcja "znane luki" (3911 linii) |
| `Zasady_UX_Doradca_v2_1.md` | — (metodologia, nie moduł) | — | pełna metodologia autorska: szablon Sekcja A/B/C/D, taksonomia wzorców A–H (§4), kryteria kwalifikacji do wzorca D, audyt wzorców per moduł (867 linii) |
| `Biblia_Offgrid_v2_0_Architektura_Modulowa.md` | wszystkie (źródło ~579 funkcji) | — | pełne źródło, bardzo duże (15317 linii) — przeszukiwać punktowo (grep), nie wczytywać w całości bez potrzeby |

Komplet wszystkich 13 modułów treściowych + oba pliki zbiorcze (scalony + Zasady UX) + Biblia
— nic już nie musi być dosyłane ponownie w kolejnych sesjach AI. Jeśli autor projektu zaktualizuje
którykolwiek plik źródłowy, nadpisać tutaj i odnotować w `docs/memory.md` (nie cicho — Zasada 15.4).

**Ważne:** pliki modułów oznaczają swoją własną, zamkniętą numerację ekranów (np. "Ekran 15"
Modułu 2) — nie mylić z ID Biblii (`1.27` itd.) ani z numerami z `docs/rejestr-pokrycia.md`,
które mapują 1:1 na ID Biblii, nie na numer ekranu w pliku treści.

## Norma PN-HD 60364-5-52:2011 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, zakupiona oficjalnie. Brakująca norma
blokująca M5/Ekran 1, M11/B5, M4/Ekran 25 (`docs/rejestr-pokrycia.md`) — tabele obciążalności
prądowej kabli. Plik: `PN-HD-60364-5-52-2011-Instalacje-elektryczne-niskiego-napiecia-Oprzewodowanie.pdf`
(96 stron, **skan**, nie tekst). Przeanalizowany i podzielony na rozdziały:
**`docs/zrodla/norma-PN-HD-60364-5-52/00-INDEKS.md`** — zacznij tutaj, ma mapę rozdziałów i
**obowiązkowe zastrzeżenie o jakości OCR**. [05.09.2026, aktualizacja] Załącznik B (tabele
B.52.1-B.52.21, str. 33-58) w pełni zweryfikowany wizualnie strona po stronie (nie tylko
spot-check) i skorygowany — znaleziono i naprawiono ~35 błędów OCR, w tym całe brakujące
kolumny/wiersze danych, nie tylko pojedyncze błędnie odczytane cyfry. Reszta dokumentu
(Załączniki A, C, E, F, G, H, I, ZA-ZC) ma nadal tylko wstępny spot-check, nie pełną weryfikację —
przed użyciem którejkolwiek liczby stamtąd, zweryfikuj wizualnie względem PDF. Status
wykorzystania: dane źródłowe gotowe i wiarygodne (Załącznik B), ale żaden kalkulator jeszcze ich
nie używa — patrz `docs/rejestr-pokrycia.md` i `docs/memory.md`.

## Normy PN-IEC 60364-4-41 i 4-43 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, pliki `.doc` (Word 95/97, prywatne
wyciągi/tłumaczenia z 2002, nie oficjalny skan PKN). Ekstrakcja: `antiword`/`wvHtml` (natywny
tekst z binarnego .doc, nie OCR).
- **PN-IEC 60364-4-41:2000** (Ochrona przeciwporażeniowa) — `docs/zrodla/norma-PN-IEC-60364-4-41/`.
  **🔴 Tablice 41A i 41B (czasy wyłączenia w układach TN/IT) nie istnieją w tym pliku** — dokument
  to świadomy "Wyciąg", nie pełny tekst; sprawdzone dwiema niezależnymi metodami. Reszta treści
  (definicje SELV/PELV/FELV, wzory Zs×Ia≤U0, RA×Ia≤50V i warianty IT) kompletna. **✅ Rozwiązane
  05.09.2026** przez materiał branżowy niżej — zawiera aktualną Tablicę 41.1 (norma obowiązująca
  dziś, PN-HD 60364-4-41:2009), do stosowania zamiast starych 41A/41B.
- **PN-IEC 60364-4-43:1999** (Ochrona przed prądem przetężeniowym) — `docs/zrodla/norma-PN-IEC-60364-4-43/`.
  Kompletny, zweryfikowany krzyżowo. Zawiera Tablicę 43A (współczynnik k dla przewodów roboczych) —
  uzupełnia Załącznik A normy 5-54 (który podaje k dla przewodu ochronnego).

Status wykorzystania: przeanalizowane, niewykorzystane jeszcze w kodzie.

## Materiały branżowe: "Bezpieczeństwo instalacji fotowoltaicznych" 2019 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, dodatek do magazynu "Rynek Elektryczny" 3/2019.
**Nie jest formalną normą** (literatura branżowa/szkoleniowa) — `docs/zrodla/materialy-branzowe-PV-2019/`.
Zawiera obszerny indeks norm specyficznych dla PV (w tym PN-HD 60364-7-712, PN-EN 62305, PN-EN 62852,
PN-EN 61215, PN-EN 62109, PN-EN 61427-1 dla off-grid), zasady prowadzenia przewodów DC/łuku
elektrycznego (tabele promieni gięcia i odległości montażowych), ochronę odgromową/przeciwprzepięciową,
zalecenia dla służb ratowniczych, harmonogram konserwacji. Status: przeanalizowany, niewykorzystany
w kodzie. **[06.09.2026]** Właściciel projektu dostarczył wersję `.docx` tego samego dokumentu
(konwersja z zachowanymi natywnymi tabelami) — pozwoliło to uzupełnić listę norm do 34 z 43
dokładnych pozycji (wcześniej tylko przykłady) oraz doprecyzować Tabelę 11 (progi mocy
mikroinstalacji). 9 pozycji nadal nieznanych (zgubione przy konwersji PPTX→DOCX) — odnotowane
jawnie w `01-tresc.md`.

## Cztery kolejne pliki: PN-EN 60445, IEC 62109-2, HD 60364-7-712, materiał ochrony przeciwporażeniowej (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu.
- **PN-EN 60445:2010** (identyfikacja zacisków urządzeń i zakończeń przewodów) —
  `docs/zrodla/norma-PN-EN-60445/`. Skan PKN, 16 stron, przeczytany w całości wizualnie (dokument
  krótki). Kompletny — zawiera Tablicę 1 (znakowanie L1/L2/L3/N/PE/PEN itd.). **Odblokowuje
  M5/Ekran 20 "Oznakowanie obwodów"** (`docs/rejestr-pokrycia.md:163`).
- **IEC 62109-2:2011** (bezpieczeństwo przetwornic mocy PV — falowniki) —
  `docs/zrodla/norma-IEC-62109-2/`. Angielski oryginał (FDIS), natywny tekst, 30 stron, kompletny
  od strony tytułowej po bibliografię. Dotyczy też falowników off-grid/multi-mode, nie tylko
  on-grid. Zawiera konkretne progi liczbowe (Tabela 31 — czasy odłączenia przy prądzie
  resztkowym, progi 4.8.3.1) i wymagania THD dla falowników stand-alone.
- **UNE-HD 60364-7-712:2017** (instalacje PV) —
  `docs/zrodla/norma-HD-60364-7-712/`. 🔴 **[HISTORYCZNE, 05.09.2026]** Wtedy: tylko wyciąg — spis
  treści + bibliografia (6 stron), brak całej treści technicznej (712.41-712.6, Załącznik B z
  obliczeniem U_OC MAX/I_SC MAX), praktycznie nic nie odblokowywał.
  **[06.09.2026] ✅ PEŁNY TEKST DOSTARCZONY** (35 stron, bezpośrednio na `main`) — przeczytany w
  całości i użyty tego samego dnia do przepisania `ochrona-stringow` (M3/Ekran 22) wg §712.431-433
  + Załącznik B.2; wzór w `stress-test-mppt` (M3/E5) potwierdzony jako zgodny z Załącznikiem B.1.
  Plik: `docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf`. Szczegóły:
  `docs/zrodla/norma-HD-60364-7-712/00-INDEKS.md`, `docs/memory.md`.
- **Materiał branżowy "Aktualne przepisy w zakresie ochrony przeciwporażeniowej"** (prezentacja
  szkoleniowa, nie norma) — `docs/zrodla/materialy-branzowe-ochrona-przeciwporazeniowa-2010/`.
  **Rozwiązuje krytyczny brak Tablic 41A/41B** z normy PN-IEC 60364-4-41 (patrz wyżej) — ale
  jednocześnie pokazuje, że aktualnie obowiązująca norma (PN-HD 60364-4-41:2009) ma inną, bardziej
  szczegółową Tablicę 41.1, którą należy stosować zamiast starych wartości. Zawiera też porównanie
  starej/nowej rezystancji izolacji oraz podsumowanie normy PN-HD 60364-7-704:2010 (instalacje na
  terenie budowy — nowa, dotąd nieomawiana norma).

## Norma PN-HD 60364-5-54:2010 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, zakupiona oficjalnie. Dotyczy uziemień,
przewodów ochronnych (PE) i przewodów połączeń ochronnych — temat oddzielny od 5-52 (tam:
obciążalność prądowa/dobór przekroju fazowego). Plik:
`PN-HD-60364-5-54-2010-Instalacje-elektryczne-niskiego-napiecia-Uziemienia-przewody-ochronne-i-polaczen-ochronnych.pdf`
(38 stron, **natywny tekst PDF, nie skan** — bez ryzyka błędów OCR, w odróżnieniu od 5-52).
Przeanalizowany i podzielony na rozdziały: **`docs/zrodla/norma-PN-HD-60364-5-54/00-INDEKS.md`** —
zacznij tutaj. Wszystkie tabele/wzory dodatkowo zweryfikowane wizualnie względem renderu strony
(żeby uniknąć błędnego przypisania wartości do kolumn przy spłaszczeniu tekstu). Zawiera m.in.
wzór doboru przekroju przewodu ochronnego (S=√(I²t)/k, Tablica 54.3) i tablice współczynnika k
(Załącznik A) — bezpośrednio przydatne do kalkulatorów doboru PE. **Uwaga: Załącznik ZC (krajowy,
Polska) zmienia wartość 543.1.3 dla aluminium chronionego mechanicznie na 10 mm², inaczej niż
16 mm² w głównym tekście — rozbieżność odnotowana jawnie w pliku ZC, nie rozstrzygnięta cicho.**
Status wykorzystania: dopiero przeanalizowany, żaden kalkulator jeszcze go nie używa — patrz
`docs/memory.md`.

## Norma PN-EN 1991-1-3:2005 — Eurokod 1, obciążenie śniegiem (06.09.2026)

[06.09.2026] ✅ DODANO — źródło: właściciel projektu, zapowiedziana wcześniej w
`docs/normy-brakujace.md` (pozycja "Eurokod śnieg", 🔵 spodziewana), teraz przeniesiona do sekcji
"Pozyskane". Plik: `PN-EN-1991-1-3-2005-Eurokod-1-Obciazenie-sniegiem.pdf` (54 strony, **skan**,
nie tekst). Przeanalizowany i podzielony: **`docs/zrodla/norma-PN-EN-1991-1-3/00-INDEKS.md`** —
zacznij tutaj. **Wszystkie 54 strony przeczytane wizualnie bezpośrednio** (nie OCR, nie
spot-check) — dla dokumentu tej wielkości odczyt wizualny bezpośredni zastępuje pełny pipeline
OCR+weryfikacja bez utraty pewności. Dokument kompletny od okładki po ISBN, nie jest wyciągiem.

Zawiera: polski Załącznik krajowy NB (mapa 5 stref obciążenia śniegiem gruntu + Tablica NB.1,
wzory `s_k(strefa, A)`), wzór główny obciążenia dachu `s = μ Ce Ct sk` (Rozdział 5), **Tablicę 5.2**
(współczynniki kształtu dachu `μ1`/`μ2` wg kąta nachylenia — jedno-/dwu-/wielopołaciowe), dachy
walcowe i przylegające do wyższych budowli, obciążenia miejscowe (zaspy, nawisy, barierki
przeciwśnieżne, Rozdział 6), oraz Załączniki A–E (sytuacje obliczeniowe, wyjątkowe zaspy, mapy
europejskie — nieużywane dla Polski, okres powrotu, ciężar objętościowy śniegu).

**Odblokowuje ekran "Obciążenie dachu śniegiem"** (`docs/rejestr-pokrycia.md`, Moduł 3, dawne
6.34→7.32) — wcześniej `todo` z notatką "ryzyko braku normy budowlanej", teraz ma pełne, formalne
źródło normatywne. Status wykorzystania: przeanalizowany, jeszcze niewykorzystany w kodzie.

## Uzupełnienie praktyczne — Montaż 16S LiFePO4, Moduł 11 (13.09.2026)

[13.09.2026] ✅ DODANO — źródło: właściciel projektu, notatki z realnego montażu pakietu 16S
LiFePO4 (nie formalna norma, materiał praktyczny — analogicznie do `materialy-branzowe-*`).
Plik: **`docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md`** — 5 tomów: selekcja ogniw
i top-balancing, montaż mechaniczny/kompresja, dobór i montaż busbarów (+ obalenie mitu o
wierceniu otworu w środku busbara), sekwencja podłączenia/konfiguracji BMS, przekroje
przewodów/dobór złączy oczkowych, dioda vs rezystor pre-charge przy podłączeniu do falownika,
tabela kontrolna wartości.

**Status wykorzystania:** przeanalizowane względem już zbudowanych ekranów A2–A5 Modułu 11
(`docs/rejestr-pokrycia.md`) — część treści potwierdza istniejące wartości, część je uszczegóławia,
jedna wartość (moment dokręcania M6) jest w jawnej sprzeczności z wartością już w kodzie
(`moment-dokrecania-srub`, M4/E11) — zgłoszone do rozstrzygnięcia właścicielowi projektu, nie
rozstrzygnięte samodzielnie. Pełna analiza: `docs/memory.md` (2026-09-13).

## Propozycja nowego modułu — Dobór napięcia systemu Off-Grid v3.0 (13.09.2026)

[13.09.2026] ✅ DODANO — źródło: właściciel projektu, pełna specyfikacja robocza (nie formalna
norma, materiał produktowy/koncepcyjny analogiczny do plików `Tresc_Modul_*`). Plik:
**`docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md`** — zapisany 1:1, bez
zmian treści, jako pierwszy krok ustalonego z właścicielem procesu: (1) zapisać jak jest → (2)
wnieść poprawki → (3) zbudować moduł.

Zawiera: kontekst zastosowania (dom/kamper/łódź/nowy budynek), pytanie o ogrzewanie i jego wpływ
na wymagane napięcie, kreator odbiorników z automatyczną analizą jednoczesności i długotrwałego
obciążenia, progi decyzyjne 12/24/48V, analizę nagrzewania przewodów (P=I²R) i bezpieczeństwa
prądowego (100A@12V), rekomendację oświetlenia DC (24V vs 230V vs 48V + koszt przetwornic),
trzy kosztorysy równoległe (EVE MB31 314Ah, falowniki VEVOR), problem równoległego łączenia
pakietów akumulatorów (busbar vs daisy-chain), dobór paneli JA Solar 500W do 3 modeli falowników
VEVOR, oraz kluczowy rozdział H — dlaczego nie można łączyć dwóch pakietów 24V szeregowo w 48V
(rozjazd BMS, brak komunikacji master-slave) i koszt "przejścia" 24V→48V.

**Przypisanie do numeru modułu Off-Grid: NIEROZSTRZYGNIĘTE**, właściciel wprost zaznaczył, że nie
wie, gdzie ten moduł najlepiej pasuje. Ma częściowe pokrycie tematyczne z już istniejącymi
ekranami: `lib/core/modules/baterie/napiecie-systemowe/` (M4, sugestia napięcia wg mocy — ten
materiał go znacznie rozszerza), Moduł 2 (bilans odbiorników, Etapy A-B), Moduł 5 (przekroje/
prądy, Etap C), Moduł 3 (dobór paneli PV do falownika, Etap G — pokrywa się z
`dopasowanie-tablicy-falownika`/`stress-test-mppt`/`konfigurator-stringow`). Decyzja o
przypisaniu i budowie **czeka na etap poprawek**, nie podejmowana samodzielnie — patrz
`docs/memory.md`.

Status wykorzystania: zapisany, trwa etap poprawek (patrz `docs/memory.md`, 13.09.2026),
jeszcze niewykorzystany w kodzie.

## Karta katalogowa JA Solar JAM60D41 LB, seria 485-510W (13.09.2026)

[13.09.2026] ✅ DODANO — źródło: właściciel projektu, zdjęcie karty katalogowej producenta.
Uzupełnia lukę zgłoszoną przy analizie materiału wyżej (Etap G nie miał realnych Voc/Vmp/Isc/Imp/
współczynników temperaturowych panelu). Plik: `docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/`,
zacznij od `00-INDEKS.md`. Zawiera pełną tabelę elektryczną dla 6 wariantów mocy (485-510W) +
parametry mechaniczne + warunki pracy. Status wykorzystania: przeanalizowany, wartości dla
wariantu -500/LB przeliczone kontrolnie względem istniejących kalkulatorów M3
(`stress-test-mppt`/`dopasowanie-tablicy-falownika`) — patrz `docs/memory.md`.
