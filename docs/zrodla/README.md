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
prądowej kabli. Plik: `docs/zrodla/norma-PN-HD-60364-5-52/PN-HD-60364-5-52-2011-Instalacje-elektryczne-niskiego-napiecia-Oprzewodowanie.pdf`
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
`docs/zrodla/norma-PN-HD-60364-5-54/PN-HD-60364-5-54-2010-Instalacje-elektryczne-niskiego-napiecia-Uziemienia-przewody-ochronne-i-polaczen-ochronnych.pdf`
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

## Paczka `New-info` (13 plików) — rozłożona na foldery per norma/materiał (25.09.2026)

[25.09.2026] ✅ DODANO — źródło: właściciel projektu, foldery/pliki na jego własnych kontach
(Studocu i in.) — potwierdzone przez właściciela, nie kwestionowane dalej. Folder
`docs/zrodla/New-info/` (13 plików PDF, część skany, część tekst natywny) rozłożony na dedykowane
foldery wg dotychczasowego wzorca (`00-INDEKS.md` + treść, OCR tesseract pol+eng 250 DPI tam, gdzie
brak warstwy tekstowej):

| Nowy folder | Zawartość | Trafność w domenie off-grid PV |
|---|---|---|
| `norma-IEC-62305/` | "A Guide to BS EN 62305" (Furse/Thomas & Betts) — ochrona odgromowa, metoda toczącej się kuli, klasy LPL | **Bezpośrednia** — uzupełnia SPD/uziemienie (M5), kandydat na nowy ekran M8 (strefa ochronna zwodu) |
| `materialy-Purmo-PN-EN-12831-ogrzewanie/` | Poradnik (nie sama norma) metody obliczania obciążenia cieplnego PN-EN 12831 | **Bezpośrednia** — M6/M7, dziś niewykorzystana w kodzie |
| `norma-PN-EN-1991-1-4-wiatr/` | PN-EN 1991-1-4:2008 — obciążenie wiatrem | **Pośrednia, bez modułu-odbiorcy** — jak istniejąca `norma-PN-EN-1991-1-3` (śnieg), czeka na ewentualny przyszły moduł konstrukcji wsporczej PV |
| `norma-PN-82-B-02403/` | Temperatury obliczeniowe zewnętrzne (norma z 1982, częściowo zastąpiona przez PN-EN 12831) | Pośrednia — M1/M6/M7, status aktualności do potwierdzenia przed użyciem |
| `norma-PN-EN-1990-eurokod-0/` | Eurokod 0 — podstawy projektowania konstrukcji (4 pliki, w tym 2 słabej jakości duplikaty) | **Wątpliwa** — ogólna norma konstrukcyjna, nie elektryczna/energetyczna |
| `norma-PN-EN-1995-1-1-eurokod-5-drewno/` | Eurokod 5 — konstrukcje drewniane | **Wątpliwa/poza rdzeniem** — inżynieria budowlana, nie off-grid PV |
| `materialy-fizyka-budowli/` | 3 notatki: wilgotność dopuszczalna, kondensacja międzywarstwowa, czynnik f_Rsi | **Wątpliwa/poza rdzeniem** — fizyka budowli, nie instalacja PV/elektryka |

**Duplikat znaleziony i usunięty bez pytania (Y.2 — nie świadoma decyzja, błąd/nadmiarowość):**
plik `559094399-060364NHDD149-ES.pdf` (UNE-HD 60364-7-712:2017, hiszpańska wersja) był **bajt
w bajt identyczny** (ten sam MD5) z już istniejącym, przeczytanym w całości i wykorzystanym w kodzie
`docs/zrodla/norma-HD-60364-7-712/UNE-HD-60364-7-712-2017-pelny-tekst.pdf` — nie skopiowany ponownie.

**Rekomendacja co do dalszego losu (do decyzji właściciela, przy najbliższej sesji nad
`new-app-standards`):** trzy pozycje (`norma-PN-EN-1990-eurokod-0/`, `norma-PN-EN-1995-1-1-eurokod-5-drewno/`,
`materialy-fizyka-budowli/`) to ogólne budownictwo/fizyka budowli, nie specyficzne dla off-grid PV
ani nawet dla rodziny "Inżynier Pro" w wąskim sensie — kandydaci do przeniesienia jako generyczna
biblioteka referencyjna do `new-app-standards` (dostępna dla całej rodziny aplikacji), zamiast
zostawania w `docs/zrodla/` tego konkretnego projektu. Pozostałe cztery (`norma-IEC-62305/`,
`materialy-Purmo-PN-EN-12831-ogrzewanie/`, `norma-PN-EN-1991-1-4-wiatr/`, `norma-PN-82-B-02403/`)
zostają tu — mają bezpośredni lub prawdopodobny związek z modułami tego projektu.

Żadna z 4 norm/OCR-ów w tej paczce nie została zweryfikowana wizualnie strona po stronie (tylko
spot-check) — przed użyciem jakiejkolwiek liczby w kodzie patrz zastrzeżenie w odpowiednim
`00-INDEKS.md`. Status wykorzystania wszystkich siedmiu pozycji: przeanalizowane, niewykorzystane
jeszcze w kodzie.

**[25.09.2026, weryfikacja OCR — wieczór] Uzupełnienie i korekta powyższej sekcji** (nic nie usunięto):
- Zdanie „Żadna z 4 norm/OCR-ów … nie została zweryfikowana wizualnie” — **nieaktualne**. Zakres używany
  w projekcie zweryfikowany wizualnie ze skanem i przepisany: PN-EN 1991-1-4 (NA + rozdz. 3–7.5 + zał. A,
  58 stron), PN-EN 1990 (6.4, Załącznik A1, NB, poprawka Ap1), IEC 62305 (wszystkie tablice i wzory,
  47 stron), poradnik Purmo (39 wzorów → `02-wzory-zweryfikowane.md`). Szczegóły i lista błędów: sekcje
  „Weryfikacja OCR (25.09.2026)” w każdym `00-INDEKS.md` paczki; zbiorczo `docs/memory.md`.
- Ocena trafności w tabeli wyżej **skorygowana dla dwóch pozycji**: `norma-PN-EN-1991-1-4-wiatr/` — ma
  odbiorców w kodzie (M3/E9, E2 — D27), to drugi egzemplarz normy z notatką `norma-PN-EN-1991-1-4/`;
  `norma-PN-EN-1990-eurokod-0/` — bezpośrednio potrzebna (🔴 w `docs/normy-brakujace.md`, balast
  projektowy). Rekomendacja przeniesienia Eurokodu 0 do `new-app-standards` — nieaktualna.
- **[25.09.2026] Folder `norma-PN-EN-1991-1-4-wiatr/` scalony z `norma-PN-EN-1991-1-4/`** (decyzja
  właściciela projektu, wariant A): PDF, `01-tresc-ocr.txt` i dawny indeks są teraz w
  `norma-PN-EN-1991-1-4/`. Nazwa `…-wiatr/` w tabeli i akapitach wyżej to zapis historyczny.

## PN-EN ISO 14683 (mostki cieplne) i EN ISO 13786 (dynamiczne charakterystyki cieplne) (27.09.2026)

[27.09.2026] ✅ DODANO (częściowo) — źródło: właściciel projektu, 2 pliki PDF.
- **PN-EN ISO 14683:2007** (Mostki cieplne w budynkach — liniowy współczynnik przenikania ciepła —
  metody uproszczone i wartości orientacyjne) — `docs/zrodla/norma-PN-EN-ISO-14683-1/`.
  **Pełny tekst, natywny PDF (nie skan), przeczytany w całości** (27 stron). Zawiera Tablicę A.2
  (wartości orientacyjne Ψ dla ~9 kategorii złączy budowlanych × 4 warianty izolacji) i przykład
  liczbowy (Załącznik B) pokazujący, że mostki cieplne odpowiadają za 36–42% strat ciepła przez
  przenikanie w przykładowym budynku. **Odblokowuje częściowo lukę Ψ (mostki cieplne, M6/E7)**
  zgłoszoną w `docs/normy-brakujace.md` przy okazji normy PN-EN 12831-1 (nadal brak tekstu tej
  ostatniej — mostki to tylko jeden z kilku elementów, których ona wymaga). Szczegóły:
  `docs/zrodla/norma-PN-EN-ISO-14683-1/00-INDEKS.md`.
- **EN ISO 13786:2007** (Thermal performance of building components — Dynamic thermal
  characteristics — Calculation methods) — `docs/zrodla/norma-PN-EN-ISO-13786/`. **⚠️ Tylko plik
  dodany, treść NIE przeczytana/OCR-owana** — dokument jest w większości skanem (~28 stron).
  OCR i analiza odłożone do innej sesji (polecenie właściciela, 27.09.2026) — patrz
  `docs/zrodla/norma-PN-EN-ISO-13786/00-INDEKS.md` dla zakresu zadania i hipotezy (niepotwierdzonej)
  o zastosowaniu w projekcie.

Status wykorzystania: 14683 przeanalizowana, niewykorzystana jeszcze w kodzie; 13786
nieprzeanalizowana. Lista wciąż brakujących norm/materiałów: `docs/normy-brakujace.md`.

## Norma PN-EN 1991-1-4:2008 + AC:2009 — Eurokod 1, oddziaływanie wiatru (25.09.2026)

Dostarczona przez właściciela projektu (6 plików PDF, 161 stron, z Załącznikiem krajowym NA).
**Oryginał NIE jest w repozytorium** — nadruk licencji PKN z zakazem umieszczania w sieci oraz
znak wodny z danymi osobowymi pobierającego, a repozytorium jest publiczne. Oryginał przechowuje
właściciel projektu; w repo tylko notatka robocza z liczbami używanymi w kodzie:
**`docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md`**. Odstępstwo od zasady B.5 (oryginał w
`docs/zrodla/`) — świadome, powód i otwarta decyzja o pozostałych normach: `docs/memory.md`,
"Licencje norm w publicznym repozytorium (25.09.2026)".

## Cztery pliki: SRPS HD 60364-4-443, artykuł PL o EN 62305, whitepaper IEC 62109-1, poradnik ELEKTRA 12831 (27.09.2026)

[27.09.2026] ✅ DODANO (4 pliki) — źródło: właściciel projektu, paczka 5 PDF (jeden pominięty jako duplikat, patrz niżej).

- **SRPS HD 60364-4-443:2017** (ochrona przed przepięciami atmosferycznymi/łączeniowymi, wersja
  serbska dokumentu harmonizacyjnego CENELEC, technicznie identyczna z HD 60364-4-443:2016) —
  `docs/zrodla/norma-HD-60364-4-443/`. **Pełny tekst, natywny PDF, przeczytany w całości** (18
  stron). **Wypełnia bezpośrednio pozycję ⚪ "HD 60364-4-443" z `docs/normy-brakujace.md`** — wzór
  CRL (ocena ryzyka, decyzja o konieczności SPD) + tabela kategorii przepięć I–IV + 4 przykłady
  liczbowe rozwiązane w Załączniku A. Trafność: uzupełnia Moduł 5 (`ochrona-przepieciowa-spd`).
- **Artykuł naukowy PL "Zmiany zasad ochrony odgromowej... wg norm serii PN-EN 62305"** (Boryń,
  Olesz, Politechnika Gdańska, 2010, 7 stron) — dopisany do `docs/zrodla/norma-IEC-62305/00-INDEKS.md`
  jako drugie źródło wtórne (po Furse), tym razem po polsku. Przeczytany w całości. **Nie zamyka
  luki EN 62305** (nadal brak oficjalnego tekstu normy) — ale daje krótszy, polskojęzyczny opis
  procedury oceny ryzyka R = N·P·L i tabel materiałowych/przeglądowych.
- **Whitepaper "Isolation in solar power converters" (IEC 62109-1, materiał firmowy)** — dodany do
  `docs/zrodla/norma-IEC-62109-1/` (nowy folder), 14 stron, natywny PDF. **Rozpoznany tylko po
  tytule/metadanych — treść NIE przeczytana w całości w tej sesji** (zadanie dla następnej sesji,
  patrz `00-INDEKS.md` tego folderu). Nie zamyka luki IEC 62109-1 (wciąż brak tekstu normy).
- **Poradnik ELEKTRA "Obliczanie EN 12831" (wyd. 2011)** — dodany do
  `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/` jako plik porównawczy. Spis treści
  identyczny z już posiadanym poradnikiem Purmo (ta sama bazowa metodyka, inny wydawca) —
  **nie jest niezależnym drugim źródłem**, tylko kopią zapasową na wypadek luki w treści Purmo.
- **Pominięty duplikat:** plik `Poradnik-Purmo-nowa-metoda-obliczania_12831_01_2012.pdf`
  dostarczony w tej samej paczce jest identyczny z plikiem już obecnym w repo
  (`materialy-Purmo-PN-EN-12831-ogrzewanie/79967189-Poradnik-Purmo-...pdf`) — **nie dodany
  ponownie**, żeby nie duplikować treści w repo.

Pełne opisy w `docs/zrodla/norma-HD-60364-4-443/00-INDEKS.md`, dopiskach w
`docs/zrodla/norma-IEC-62305/00-INDEKS.md` i `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/00-INDEKS.md`,
oraz `docs/zrodla/norma-IEC-62109-1/00-INDEKS.md`. Status w `docs/normy-brakujace.md` zaktualizowany.

## Materiał ze szkolenia ZIAD Bielsko-Biała (27.09.2026)

[27.09.2026] ✅ DODANO (tylko dodanie, bez analizy — jawne polecenie właściciela projektu: "inna
sesja zajmie się tym") — `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/`. Plik `.docx`
"Bezpieczeństwo instalacji fotowoltaicznych" (dodatek do magazynu Rynek Elektryczny nr 3/2019,
egzemplarz rozdawany na szkoleniu ZIAD Bielsko-Biała). Tytuł i wydawca identyczne z już
posiadanym `docs/zrodla/materialy-branzowe-PV-2019/` — **niesprawdzona hipoteza**, czy to inna
edycja tej samej publikacji z pełną (nieprzyciętą) listą 43 norm, w tym 9 pozycji zgubionych w
tamtym materiale przy konwersji PPTX→DOCX. Zadanie porównawcze zapisane w
`docs/lista-do-zrobienia.md` i `00-INDEKS.md` tego folderu.

## OCR EN ISO 13786 + sprawdzenie materiału ZIAD (27.09.2026, sesja OCR)

- **EN ISO 13786:2007** — OCR (tesseract `eng`, dwa przebiegi 250/300 DPI) + odczyt wizualny
  wszystkich stron treści + odtworzenie przykładów D.1/D.2 w Pythonie. Nowe pliki:
  `norma-PN-EN-ISO-13786/01-tresc-ocr.txt` (surowy, wzory zniekształcone) i
  `02-wzory-i-tablice-zweryfikowane.md` (źródło prawdy). Dwie niespójności oryginału oznaczone ⚠️.
  Odblokowuje M6/E8 (Załącznik A.2.4). Status: zweryfikowana, niewykorzystana w kodzie.
- **`materialy-szkolenie-ZIAD-Bielsko-Biala/`** — plik jest **identyczny bajt-w-bajt (MD5)** z
  `materialy-branzowe-PV-2019/*.docx`; OCR niepotrzebny (tekst natywny). Hipoteza „inna edycja”
  obalona. 9 „zgubionych” pozycji listy norm odzyskane z akapitów tego samego pliku i potwierdzone
  z PDF — uzupełnione w `materialy-branzowe-PV-2019/01-tresc.md`. Usunięcie duplikatu — decyzja
  właściciela (A/B w `00-INDEKS.md` folderu ZIAD).
- **PDF „ZIAD”** (oryginał `.docx`) — identyczny (MD5) z PDF w `materialy-branzowe-PV-2019/`, nie dodany ponownie.
  Pełny tekst: `materialy-branzowe-PV-2019/02-tresc-pelna-z-pdf.txt`; lista fragmentów zgubionych w `.docx`:
  `materialy-branzowe-PV-2019/00-INDEKS.md`.
- **[27.09.2026] Decyzja właściciela — wariant A:** folder `materialy-szkolenie-ZIAD-Bielsko-Biala/` **usunięty**
  (duplikat), a niekompletny `.docx` usunięty też z `materialy-branzowe-PV-2019/` — oryginałem zostaje tylko pełny
  PDF. Opisy wyżej, wskazujące na folder ZIAD / `.docx`, są historyczne (pliki w historii git).

## Rozliczenia energii z siecią — gospodarstwo / przedsiębiorca (28.09.2026)

[28.09.2026] ✅ DODANO — źródło: właściciel projektu, dwa dokumenty zapisane 1:1:
- **`Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md`** — poradnik/FAQ/wytyczne
  kalkulatora dla firm: struktura rachunku, taryfy C, moc bierna, net-billing, BESS, weryfikacja
  licznika, reklamacja (11 części).
- **`Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md`** — tabele stawek dystrybucyjnych G i C
  czterech OSD na 2026 r. + opłata mocowa.

Oba najpewniej wygenerowane przez inne narzędzie AI (standard 15.1b — podwyższona czujność). **Nowa
domena** względem 13 modułów off-grid (rozliczenia z siecią), przypisanie do modułu
nierozstrzygnięte. Wynik weryfikacji (m.in. błąd we wzorze opłaty za moc bierną, tabele stawek
niewiarygodne jako dane): `docs/memory.md`, wpis z 28.09.2026.

[28.09.2026, później] ✅ Przypisanie rozstrzygnięte przez właściciela: **M14 „Z sieci na off-grid”**
(dwa kafle Dom / Firma). Opracowanie eksperckie (szkic, nie Biblia): 
**`Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md`** — poprawki ✏️ do obu dokumentów, części Dom i
„przejście/ryzyka” napisane z wiedzy eksperckiej (brak materiału źródłowego, polecenie właściciela).
Właściciel przesłał ponownie dok. 1 (identyczny z zapisanym) — nie dublowano pliku.

[28.09.2026, później] ✅ DODANO — **`URE-Informacja-58-2025-stawki-oplaty-mocowej-2026.pdf`** — dokument
pierwotny (bip.ure.gov.pl, pobrany 1:1), stawki opłaty mocowej na 2026 r. + godziny doby (7:00–22:00
w dni robocze, powołanie Informacji nr 57/2025). Zamyka W1 z opracowania M14 (§9.1) — stawki ✅.

[28.09.2026, wieczór] ✅ DODANO — dokumenty pierwotne DANE-1 (M14), pobrane 1:1 ze stron OSD po odblokowaniu
sieci przez właściciela:
- `Tauron-Dystrybucja-Taryfa-2026.pdf` (wersja z warstwą tekstową „_ocr” ze strony OSD) i
  `Tauron-Dystrybucja-Taryfa-2026-wyciag-grupy-G.pdf`;
- `Tauron-Dystrybucja-stawka-jakosciowa-od-2026-02-01.pdf`, `Enea-Operator-stawka-jakosciowa-od-2026-02-01.pdf`;
- `Energa-Operator-Taryfa-2026.pdf` (z cdn-netpr.pl, link ze strony energa-operator.pl);
- `Stoen-Operator-Taryfa-2026-tekst-z-25-02-2026.pdf`;
- `Enea-Operator-stawki-brutto-2026-od-02-01.pdf` (informacja poglądowa OSD — brutto; pełna taryfa Enea
  jest skanem w załączniku decyzji URE, nie kopiowana).
Ustawy o OZE (t.j. Dz.U. 2026 poz. 68 i nowelizacja Dz.U. 2024 poz. 1847) — nie kopiowane (rozmiar),
wskazane stałym adresem API ELI Sejmu + SHA-256 w opracowaniu M14 (sekcja „Źródła pierwotne”).
