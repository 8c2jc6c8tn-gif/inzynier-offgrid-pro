# Opracowanie: M14 „Sieć” (Dom – sieć / Firma – sieć) — rozliczenia energii, a potem opcja przejścia na off-grid

*(Nazwa pliku z roboczą nazwą „Z sieci na off-grid” zostaje dla ciągłości odsyłaczy; obowiązujące nazwy kafli — decyzja 7 niżej.)*

**[28.09.2026] ZINTEGROWANE do Biblii** — rozdział kanoniczny: `03_M14_Dom_i_Firma_Siec.md`, decyzje D35–D38 (`rejestr-decyzji.md`). Ten plik zostaje jako zapis weryfikacji (✏️ K1–K14, odczyty DANE-1, tabele stawek per OSD), do którego rozdział odsyła; nowe ustalenia dopisuj w rozdziale, a tu tylko nowe odczyty źródeł. Poniżej pierwotny status, dla historii:

~~**STATUS: SZKIC ROBOCZY — NIE JEST CZĘŚCIĄ BIBLII.**~~ To opracowanie eksperckie (GOD BOOK Część D.7,
F.2) poprzedza wpisanie treści do Biblii. Nie wpisywać go do Biblii i nie budować na jego podstawie
kodu bez polecenia właściciela „integruj teraz”. Bramka N.3 obowiązuje: najpierw cały rozdział
Biblii i audyt N.2, dopiero potem kod.

**Materiał wyjściowy (nietknięty, B.5):**
- `docs/zrodla/Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md` (dok. 1, firmy);
- `docs/zrodla/Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md` (dok. 2, tabele stawek).

Oba dokumenty pochodzą z innego narzędzia AI (potwierdził właściciel), więc obowiązuje podwyższona
czujność wg 15.1b. Części „Dom”, „przejście na off-grid” i „ryzyka odłączenia” nie mają materiału
źródłowego. Właściciel polecił napisać je z wiedzy eksperckiej: „wszystko brakujące musisz
uzupełnić ze swojej wiedzy eksperckiej”.

**Decyzje właściciela (28.09.2026) — do zapisu jako D# przy integracji:**
1. **Cel rozdziału** to ścieżka przejścia z sieci na off-grid, a nie sama porównywarka taryf:
   „niektórzy jeszcze są podłączeni do sieci i chcą częściowo przejść do Offgrid […] Muszą mieć
   podgląd i porównanie, żeby zrezygnować z sieci i przejść na Offgrid”.
2. **Moduł M14** jest potwierdzony. Na pulpicie są **dwa duże kafle: Dom i Firma**, każdy to osobny
   rozdział z osobnymi ekranami.
3. **Prowadzenie za rękę**: „jak przejść na off grid”, z kalkulatorami obliczeń, opłacalności,
   doboru magazynów energii, ilości PV i tak dalej. Moduł musi dokładnie informować, co i jak
   zrobić i jakie ryzyka niesie, także przy odłączeniu przyłącza.
4. **Dane stawek**: wpisuje je Claude z poprawnych źródeł, a **użytkownik zawsze może wpisać
   własne** (z faktury). Właściciel nie ma tych danych.
5. Więcej materiałów nie będzie.
6. **FREE/PRO — na razie nie ruszamy** (28.09.2026): „Potem będziemy dzielić.” Podział FREE/PRO nie
   jest częścią tego opracowania ani integracji do Biblii; wraca jako osobna decyzja później.
7. **Nazwy kafli: „Dom – sieć” i „Firma – sieć”** (28.09.2026): „tak będzie prościej, moduły
   opowiadają i liczą sieć, a dopiero potem jest opcja obliczenia dla przejścia Offgrid”.
   Konsekwencja dla układu: każdy rozdział ma **dwie części w stałej kolejności** — najpierw
   **Sieć** (jak działa i ile kosztuje mój rachunek, taryfy, prosument, licznik), potem
   **Przejście na off-grid** jako opcja (scenariusze A–D, dobór PV/magazynu, zima, ryzyka,
   procedura). Przejście nie jest punktem wejścia rozdziału.

---

## 0. Legenda pewności i reguła danych

| Znacznik | Znaczenie | Czy może trafić do kodu jako dana domyślna |
|---|---|---|
| ✅ | Potwierdzone: prawo/fizyka/arytmetyka albo odczyt dokumentu pierwotnego | Tak |
| 🔎A | Zgodne w ≥2 niezależnych źródłach wtórnych, dokument pierwotny jeszcze nieodczytany | **Nie**, dopóki nie zostanie odczytany pierwotny (zadanie DANE-1, §9) |
| 🔎B | Jedno źródło wtórne albo wiedza ekspercka bez potwierdzenia | Nie; w poradniku tylko z zastrzeżeniem |
| ✏️ | Poprawka materiału źródłowego (4 pola: źródło podało / poprawiono na / dlaczego / podstawa) | — |

**Reguła danych (Dyrektywa #1, Zasada 4):**
- Stawki to **dane, nie stałe w kodzie**. Trzymamy je w jednym pliku JSON ze schematem Zod,
  wersjonowanym rocznie (np. `rozliczenia-pl-2026`).
- Każda liczba ma pola `zrodlo` (dokument, strona/paragraf), `stanNa` (data) i `pewnosc`.
- Każde pole stawki w UI ma przełącznik „dane z taryfy 2026” / „moje dane z faktury”.
- Po `waznoscDo` (31.12.2026) pojawia się ostrzeżenie „stawki mogą być nieaktualne — sprawdź
  fakturę”.

**Stan weryfikacji (28.09.2026):**
- ~~Środowisko sesji blokuje strony pierwotne (`ure.gov.pl`, `bip.ure.gov.pl`, `gov.pl`, strony OSD).
  Dlatego dane ogólnokrajowe są dziś na poziomie 🔎A, a stawki per OSD nie zostały zebrane
  (zadanie DANE-1).~~ **Aktualizacja 28.09.2026 (po odblokowaniu sieci przez właściciela):**
  opłaty mocowa, OZE, kogeneracyjna, jakościowa, VAT, akcyza — ✅ z dokumentów pierwotnych;
  stawki per OSD — Tauron, Energa, Stoen ✅, Enea tylko brutto, PGE niepobrane (§2.4a);
  przepisy o depozycie, 1,23 i zwrocie — ✅ (§3); moc bierna i przekroczenie mocy — ✅ (§8.2–8.3).
  Otwarte: W3-PGE, W3-Enea netto, W4 profile, W6 PME, wartość `C_rk`, średnia cena G 495,16.
- Wniosek z próby wyszukiwania stawek per OSD: źródła wtórne podają **sprzeczne** liczby, np.
  „opłata przejściowa 0,41 zł/mies.” mimo jej zniesienia oraz mieszanie netto z brutto. To
  potwierdza, że stawki per OSD wolno brać **wyłącznie** z PDF taryf OSD.

---

## 1. Miejsce w aplikacji i nawigacja

### 1.1 Pulpit

Dochodzą dwa duże kafle, każdy prowadzi do osobnego rozdziału:

| Kafel | Rozdział | Dla kogo |
|---|---|---|
| **Dom – sieć** | M14-D | Gospodarstwo domowe (grupy taryfowe G), prosument lub nie |
| **Firma – sieć** | M14-F | Przedsiębiorca, rolnik (grupy C na nN; grupa B tylko w poradniku) |

**Dlaczego dwa kafle, a nie przełącznik Dom/Firma w środku jednego:**
- użytkownik jest w swoim świecie od pierwszego kliknięcia (decyzja właściciela);
- zbiory ekranów różnią się istotnie (moc bierna, moc umowna, porównywarka C występują tylko w
  części firmowej).

**Układ każdego rozdziału (decyzja 7):** najpierw część **Sieć**, na jej końcu wejście
„Chcę policzyć przejście na off-grid” → część **Przejście**. Obie części w tabelach §10 oznaczone
kolumną „Część”.

**Ekrany wspólne** (ryzyka odłączenia, procedura rezygnacji z przyłącza, przełącznik sieć/wyspa,
test licznika):
- w kodzie są **jednym ekranem z parametrem segmentu** (echo, bez duplikacji logiki);
- dostęp do nich prowadzi z obu kafli;
- treść różni się tylko tam, gdzie prawo różni konsumenta od przedsiębiorcy.

### 1.2 Powiązania z istniejącymi silnikami (echo, bez nowej fizyki)

| Potrzeba M14 | Silnik | Uwagi |
|---|---|---|
| Zużycie roczne i miesięczne, profil odbiorników | M2 | Alternatywa: wpis z faktury |
| Agregat jako zapas (godziny, paliwo) | M2/E17 | Scenariusz D |
| Produkcja PV miesięczna dla lokalizacji | M1 (PVGIS) + M3 | Bez stałych „zima = x% lata” |
| Dobór i opłacalność magazynu | M4, M4/E23 | Scenariusze B, C, D |
| Bilans zimowy / dni bez słońca | M7 | Warunek konieczny scenariusza D |
| Ochrona, rozłącznik, przełącznik sieć/wyspa | M8 | Twarde stopy (§6) |
| Pompa ciepła w taryfie nocnej | M6 (5.59) | Istniejąca wzmianka o sieci |

---

## 2. Część wspólna — jak zbudowany jest rachunek za prąd (2026)

### 2.1 Dwie części rachunku

Rachunek (albo umowa kompleksowa, gdzie obie części są na jednej fakturze) składa się z dwóch
części:
1. **Sprzedaż energii (towar)**, czyli cena energii czynnej i opłata handlowa sprzedawcy.
   - Gospodarstwa: taryfa sprzedawcy z urzędu zatwierdzana przez URE albo oferta rynkowa.
   - Firmy: cena rynkowa, negocjowana.
2. **Dystrybucja (usługa OSD)**: taryfa OSD, **zawsze zatwierdzana przez Prezesa URE**, także dla
   firm (✏️ K9, §8).

### 2.2 Składniki i ich charakter — kluczowe dla decyzji o przejściu

| Składnik | Jednostka | Stały / zmienny | Znika przy… |
|---|---|---|---|
| Energia czynna (sprzedaż) | zł/kWh | zmienny | spadku poboru z sieci |
| Opłata handlowa sprzedawcy | zł/mies. | **stały** | rozwiązaniu umowy sprzedaży |
| Opłata sieciowa zmienna (OSD) | zł/kWh | zmienny | spadku poboru |
| Opłata sieciowa stała (OSD) | G: zł/mies. (zależna od 1-faz/3-faz); C: zł/kW mocy umownej/mies. | **stały** | tylko odłączeniu (albo obniżeniu mocy umownej w C) |
| Opłata abonamentowa (OSD, za odczyt i rozliczenie) | zł/mies. | **stały** | tylko odłączeniu |
| Opłata mocowa — G | zł/mies., ryczałt wg progu rocznego zużycia | **quasi-stały** (zmienia się skokowo z progiem) | spadku zużycia poniżej progu albo odłączeniu |
| Opłata mocowa — pozostali (m.in. C) | zł/kWh w dni robocze 7:00–22:00 | zmienny | przesunięciu poboru poza te godziny |
| Stawka jakościowa | zł/kWh | zmienny | spadku poboru |
| Opłata OZE | zł/MWh | zmienny | spadku poboru |
| Opłata kogeneracyjna | zł/MWh | zmienny | spadku poboru |
| **Opłata przejściowa** | — | **zniesiona od 1.01.2026** (🔎A, decyzja Ministra Energii) | — |
| Akcyza | zł/MWh (w cenie) | zmienny | — |
| VAT | 23% od sumy | — | — |
| Moc bierna, przekroczenie mocy umownej (C) | zł | zdarzeniowy | kompensacji / korekcie mocy umownej |

**Wniosek ekspercki — „cena trzymania sieci”.** Własne PV albo magazyn obniżają tylko wiersze
zmienne. Wiersze stałe płaci się dalej, nawet przy zużyciu bliskim zera, dopóki istnieje umowa i
licznik:

`K_stałe,rok = 12 · (opłata sieciowa stała + abonamentowa + handlowa + mocowa_G) · (1 + VAT)`

- Ta liczba jest osią całej decyzji: to cena ubezpieczenia „mam sieć jako zapas”.
- Porównuje się ją z kosztem alternatywnego zapasu, czyli agregatu i większego magazynu (§4).
- Przykład rzędu wielkości (🔎B, jedno źródło wtórne, **nie do kodu**): kilkadziesiąt zł/mies.
  brutto dla typowego domu w G11, czyli rzędu kilkuset zł rocznie.

### 2.3 Stawki ogólnokrajowe 2026

| Pozycja | Wartość 2026 | Podstawa | Pewność |
|---|---|---|---|
| Opłata mocowa — odbiorcy rozliczani ryczałtowo (art. 89a ust. 1 pkt 1 ustawy o rynku mocy; w praktyce G), zużycie roczne < 500 kWh | 4,29 zł/mies. netto, za punkt poboru | Informacja Prezesa URE nr 58/2025 (30.10.2025), pkt 1 — **odczyt pierwotny 28.09.2026**, plik `docs/zrodla/URE-Informacja-58-2025-stawki-oplaty-mocowej-2026.pdf` | ✅ |
| Opłata mocowa ryczałt, 500–1 200 kWh | 10,31 zł/mies. netto | j.w., pkt 2 | ✅ |
| Opłata mocowa ryczałt, >1 200–2 800 kWh | 17,18 zł/mies. netto | j.w., pkt 3 | ✅ |
| Opłata mocowa ryczałt, > 2 800 kWh | 24,05 zł/mies. netto | j.w., pkt 4 | ✅ |
| Opłata mocowa, pozostali odbiorcy (art. 89a ust. 1 pkt 2; m.in. C) | 0,2194 zł/kWh netto — energia pobrana w 15 kolejnych godzinach dni roboczych (pn–pt bez świąt ustawowych), pierwsza od 7:00, ostatnia od 21:00, czyli 7:00–22:00, jednakowo we wszystkich kwartałach 2026 | j.w., pkt 5 + str. 2 (powołuje Informację nr 57/2025) | ✅ |
| Opłata OZE | 7,30 zł/MWh netto (2025: 3,50) | Taryfy OSD 2026 zatwierdzone przez Prezesa URE, powołujące Informację Prezesa URE: Energa-Operator pkt 9.3, Stoen pkt 7.8, Tauron pkt 7.5 (+ Enea brutto 8,98 = 7,30 × 1,23) — **odczyt pierwotny 28.09.2026**, PDF-y w `docs/zrodla/` | ✅ |
| Opłata kogeneracyjna | 3,00 zł/MWh netto (planowane 4,36 wycofane) | j.w.: Energa pkt 9.4, Stoen pkt 7.9, Tauron pkt 7.6 (+ Enea brutto 3,69 = 3,00 × 1,23) | ✅ |
| Opłata przejściowa | 0 (zniesiona od 1.01.2026) | Komunikat Ministerstwa Energii z 28.11.2025 (gov.pl/web/energia, odczyt 28.09.2026): obwieszczenie Ministra Energii o wygaśnięciu opłaty, podstawa — ustawa KDT z 29.06.2007; żadna z odczytanych taryf OSD 2026 (Tauron, Energa, Stoen, Enea) nie zawiera już tej stawki | ✅ (komunikat organu + taryfy; tekst obwieszczenia w Dz.U./M.P. nieodczytany) |
| Stawka jakościowa, odbiorcy nN (G, C1x, C2x) | **0,0331 zł/kWh netto od 1.01 do 31.01.2026; 0,0332 zł/kWh netto od 1.02 do 31.12.2026** | Taryfa OSP (PSE), zmiana współczynnika kok decyzją Prezesa URE z 16.01.2026 (DRE.WPR.4211.1.4.2026.BTS); komunikaty Tauron i Enea, tabela 7.7 taryfy Stoen — **odczyt pierwotny 28.09.2026** | ✅ |
| Stawka jakościowa, odbiorcy SN/WN (B, A) | 33,06 zł/MWh (styczeń) → 33,16 zł/MWh (od 1.02.2026) | j.w. | ✅ |
| Akcyza | 5,00 zł/MWh | ustawa o podatku akcyzowym | ✅ |
| VAT na energię | 23% | ustawa o VAT | ✅ |
| Średnia cena energii w taryfach sprzedawców z urzędu (G) | 495,16 zł/MWh netto | Prezes URE, zatwierdzenie 17.12.2025 (PGE Obrót, Tauron Sprzedaż, Enea, Energa Obrót) | 🔎A |
| Zmiana taryf dystrybucyjnych G 2026/2025 | średnio +9,36% | Prezes URE, j.w. | 🔎A (informacja, nie dana obliczeniowa) |

✏️ **Opłata przejściowa.** Materiał (dok. 2, algorytm, krok 2) każe ją naliczać, a w pierwszej
weryfikacji (memory 28.09.2026, pkt 10) sam wskazałem ją jako brakującą. Poprawiono: od 1.01.2026
wynosi 0 (zniesiona). Podstawa: decyzja Ministra Energii, zgodna w kilku źródłach wtórnych.
Pewność 🔎A → **✅ od 28.09.2026** (tabela wyżej). W pliku danych pozostaje pole z wartością 0 i adnotacją, bo historyczne faktury z
2025 r. ją zawierają (tryb „moje dane z faktury”).

✏️ **Stawka jakościowa — jedna wartość na cały rok (moja wcześniejsza wersja tabeli, 🔎B).**
- **Źródło podało:** 0,0331 zł/kWh na 2026 r. (moja notatka z wyszukiwania; materiał właściciela
  jej nie ustalał).
- **Poprawiono na:** 0,0331 zł/kWh tylko w styczniu 2026; od 1.02.2026 wynosi 0,0332 zł/kWh netto.
- **Dlaczego:** PSE zmieniło w trakcie roku współczynnik kok w taryfie OSP, a OSD przenoszą
  zmianę automatycznie (Tauron pkt 7.4, Enea pkt 7.7.1–7.7.2, Energa pkt 9.1.1, Stoen pkt 7.7).
- **Podstawa:** komunikaty Tauron Dystrybucja i Enea Operator o zmianie od 1.02.2026, tabela 7.7
  taryfy Stoen (wersja z 25.02.2026).
- **Pewność:** ✅.
- **Konsekwencja dla kodu (ważna, ogólna):** stawka w pliku danych **nie jest parą (rok,
  wartość)**, tylko listą okresów `{ odDnia, doDnia, wartosc }`. Ta sama pułapka dotyczy każdej
  składowej ustalanej poza taryfą OSD (jakościowa, OZE, mocowa). Rachunek roczny liczy średnią
  ważoną zużyciem z miesięcy, a przy braku danych miesięcznych — stawkę obowiązującą najdłużej,
  z ostrzeżeniem.

### 2.4 Stawki per OSD — model danych, nie liczby

**OSD w zakresie:**
- PGE Dystrybucja, Tauron Dystrybucja, Enea Operator, Energa-Operator, Stoen Operator (Warszawa);
- dodatkowo „inny OSD” z wpisem ręcznym, bo są mniejsi operatorzy lokalni.

**Na OSD i grupę taryfową** (G11, G12, G12w, G12as, G13, C11, C12a, C12b, C21, C22a, C22b; nie
każdy OSD oferuje każdą):
- opłata sieciowa stała: G w zł/mies. z wariantem 1-faz/3-faz; C w zł/kW/mies.;
- opłata sieciowa zmienna per strefa (zł/kWh);
- opłata abonamentowa (zł/mies.; zależna od okresu rozliczeniowego);
- definicja stref czasowych: godziny, dni, sezon lato/zima. **Strefy różnią się między OSD i są
  daną, nie założeniem**;
- dla C: stawki opłaty za przekroczenie mocy umownej i krotność `k` dla mocy biernej;
- stawki opłaty przyłączeniowej dla grup IV–VI (zł/kW, kablowe/napowietrzne), potrzebne do
  wyceny ryzyka powrotu do sieci (§5.3);
- pola `zrodlo` (nazwa PDF taryfy, strona, tabela) i `stanNa`.

✏️ **Tabele dok. 2 (cała część 1 i 2).**
- **Źródło podało:** kompletne stawki G/C czterech OSD na 2026.
- **Poprawiono na:** żadna liczba z dok. 2 nie wchodzi do danych.
- **Dlaczego:**
  - PGE i Tauron mają identyczne stawki co do grosza;
  - stawka jakościowa jest w dok. 2 różna per OSD (0,0331 / 0,0164 / 0,0407), a w rzeczywistości
    jest jedna dla wszystkich OSD, bo pochodzi z taryfy PSE (✅ odczyt 28.09.2026, §2.3);
  - „Energa = Ergo Energy (dawniej Stoen)” to pomylenie trzech podmiotów (Energa-Operator, Stoen
    Operator, E.ON);
  - C21 ze strefami;
  - C22a z dniem równym nocy;
  - kolumna „Źródło” jest pusta.
- **Podstawa:** porównanie wewnętrzne + struktura taryf OSD. ✅ (odrzucenie danych).
- **Kontrola wyrywkowa po odczycie pierwotnym (28.09.2026):** Tauron G11 w dok. 2 — składnik
  zmienny 0,2464 ✅ zgodny, jakościowa 0,0331 ✅ (tylko styczeń), składnik stały 8,50 / 12,28 ❌
  (taryfa: 7,38 / 10,86). Energa G11 zmienna 0,3988 ❌ (taryfa: 0,3485). Część liczb jest więc
  trafna, część nie, i bez dokumentu pierwotnego nie da się ich rozróżnić. Decyzja „nic z dok. 2
  do danych” pozostaje w mocy.

### 2.4a Stawki per OSD 2026 — odczyt pierwotny (DANE-1, 28.09.2026)

Wszystkie wartości **netto** (bez VAT), chyba że zaznaczono inaczej. Źródła w `docs/zrodla/`:
- `Tauron-Dystrybucja-Taryfa-2026.pdf` (tabele 7.1, 7.4) i `…-wyciag-grupy-G.pdf`
  (zatw. decyzją Prezesa URE z 17.12.2025, DRE.WRE.4211.54.8.2025.ASa1);
- `Energa-Operator-Taryfa-2026.pdf` (tabele 8, 9.1–9.5; plik taryfy z 17.12.2025);
- `Stoen-Operator-Taryfa-2026-tekst-z-25-02-2026.pdf` (tabele 7.3–7.10);
- `Enea-Operator-stawki-brutto-2026-od-02-01.pdf` — **tylko brutto** (informacja poglądowa OSD;
  pełna taryfa Enea jest w załączniku do decyzji URE jako skan, bez warstwy tekstowej).

**Grupa G — składnik zmienny opłaty sieciowej [zł/kWh] i stały [zł/mies., 1-faz / 3-faz]**

| OSD | G11 | G12 dzień / noc | G12w szczyt / pozaszczyt | Stały 1f / 3f (G11, G12, G12w) | Abonament 1-mies. |
|---|---|---|---|---|---|
| Tauron | 0,2464 | 0,2841 / 0,0558 | 0,3298 / 0,0512 | 7,38 / 10,86 | 4,56 |
| Energa | 0,3485 | 0,3844 / 0,0827 | 0,4017 / 0,0851 | G11: 7,83 / 11,77; G12, G12w: 14,35 / 20,17 | 4,64 |
| Stoen | 0,2342 | 0,2545 / 0,0555 | 0,2570 / 0,1079 | 11,46 / 18,53 | 2,88 |
| Enea (**brutto**) | 0,3021 | 0,3418 / 0,1123 | 0,3323 / 0,1000 | G11: 9,16 / 12,80; G12: 11,80 / 17,91; G12w: 20,73 / 32,26 | 4,72 |
| PGE Dystrybucja | — | — | — | — | — (niepobrane, §9.1 W3) |

Abonament zależy od okresu rozliczeniowego (np. Tauron: 4,56 / 2,28 / 0,76 / 0,38 zł/mies. przy
okresie 1 / 2 / 6 / 12 mies.; Energa: 4,64 / 2,32, a przy zdalnym odczycie 0,74 / 0,70).
**Prosument rozliczany jest w okresie 1-miesięcznym** (Tauron wyciąg G pkt 2.3.1 ppkt 2 lit. b i
2.3.1b) — kalkulator ścieżki A/B bierze więc stawkę 1-miesięczną, nie tę z dotychczasowej faktury
dwumiesięcznej.

**Grupa C (nN) — składnik zmienny [zł/kWh] i stały [zł/kW/mies.]**

| OSD | C11 | C12a szczyt / pozaszczyt | C12b dzień / noc | C21 | C22a szczyt / pozaszczyt | C22b dzień / noc | Stały C1x / C2x | Abonament C1x / C2x (1 mies.) |
|---|---|---|---|---|---|---|---|---|
| Tauron | 0,2283 | 0,2333 / 0,1762 | 0,2152 / 0,1651 | 0,2153 | 0,2758 / 0,1968 | 0,2755 / 0,0954 | 5,73 / 17,52 | tab. 7.4 (do odczytu przy pliku danych) |
| Energa | 0,4045 | 0,5094 / 0,1482 | 0,4433 / 0,0983 | 0,2912 | 0,3432 / 0,2338 | 0,2960 / 0,1328 | 8,08 / 34,84 | 5,92 / 7,40 |
| Stoen | 0,2562 | 0,3027 / 0,1611 | 0,3226 / 0,1005 | 0,1481 | 🔎 | 🔎 | 7,72 / 18,33 | 3,12 / 7,83 |

🔎 Stoen C22a/C22b: tabela C2x w PDF ma strefy „zalecanego poboru / zalecanego ograniczenia /
pozostałe godziny doby” (0,1184 / 0,1481 / 0,1622 i 0,1708), a warstwa tekstowa nie pozwala
jednoznacznie przypisać kolumn do grup. **Nie przypisuję na oko** — do odczytu wizualnego tabeli
7.3 przy budowie pliku danych. Już teraz widać, że podział stref u Stoen różni się od pozostałych
OSD, co potwierdza zasadę §2.4: **strefy są daną per OSD**.

**Moc bierna i przekroczenie mocy umownej — zgodne w trzech taryfach (Tauron 3.2.11, 3.4.x;
Energa 4.2.11, 4.3.x; Stoen 3.2.11, 3.4.x) ✅:**
- `k` = 3,00 (nN), 1,00 (SN), 0,50 (110 kV);
- tgφ₀ = 0,4, chyba że warunki przyłączenia/umowa stanowią inaczej, ale nie mniej niż 0,2;
- przekroczenie mocy umownej = składnik stały stawki sieciowej × suma 10 największych nadwyżek
  (pomiar 15-minutowy) albo × 10 × największa nadwyżka, gdy układ pomiarowy nie pozwala na
  wariant pierwszy; naliczane za każdy miesiąc z przekroczeniem.

**Niepobrane (reszta W3):** PGE Dystrybucja (serwer z niepełnym łańcuchem certyfikatów — środowisko
go odrzuca), stawki netto Enea (skan), opłaty przyłączeniowe IV–VI (są w taryfach, do wyciągnięcia
razem z plikiem danych).

### 2.5 Sprzedaż: taryfa czy oferta rynkowa (Dom)

Od 2026 r. nie ma zamrożenia cen dla gospodarstw (🔎A). Odbiorca w G ma trzy możliwości:
- taryfę sprzedawcy z urzędu (zatwierdzaną przez URE);
- ofertę rynkową (stała cena na okres, często z opłatą handlową i karą za wcześniejsze
  zerwanie);
- **umowę z ceną dynamiczną**. Duzi sprzedawcy mają obowiązek ją oferować (🔎B co do daty i
  progu). Cena zmienia się godzinowo wg rynku dnia następnego. Ma to znaczenie przy magazynie
  (arbitraż) — to temat dla PRO.

**Konsekwencja dla przejścia:** przed wypowiedzeniem umowy sprawdź w niej **okres wypowiedzenia i
ewentualną karę** (oferty z gwarancją ceny). Ekran procedury (§5) ma w tym miejscu krok
kontrolny.

---

## 3. Prosument — co tracisz lub zachowujesz przy odejściu z sieci

### 3.1 Dwa systemy rozliczeń

| System | Kogo dotyczy | Jak działa | Pewność |
|---|---|---|---|
| **Net-metering (opusty)** | Mikroinstalacje przyłączone na wnioskach sprzed 1.04.2022 | Z 1 kWh oddanej odbierasz 0,8 kWh (instalacje ≤10 kW) albo 0,7 kWh (>10 kW); rozliczenie roczne; przez 15 lat od przyłączenia | 🔎A |
| **Net-billing** | Mikroinstalacje ≤50 kW przyłączone od 1.04.2022 | Nadwyżka sprzedawana po cenie rynkowej (RCEm miesięczna, od 07.2024 domyślnie RCE godzinowa) → wartość trafia na depozyt prosumencki ważny 12 mies. | 🔎A (mikroinstalacja ≤50 kW ✅, depozyt 12 mies. ✅) |

**Dodatkowe mechanizmy net-billingu:**
- częściowy zwrot niewykorzystanego depozytu ✅ (ustawa o OZE, t.j. Dz.U. 2026 poz. 68, art. 4
  ust. 11 pkt 2 i ust. 11a): środki z danego miesiąca niewykorzystane przez 12 kolejnych miesięcy
  są zwracane do końca 13. miesiąca, ale najwyżej:
  - **20%** wartości energii wprowadzonej w tym miesiącu — gdy wartość liczona jest ceną
    miesięczną RCEm (art. 4b ust. 1: pierwsze wprowadzenie energii do 30.06.2024);
  - **30%** — gdy liczona jest ceną godzinową RCE (art. 4b ust. 2: pierwsze wprowadzenie od
    1.07.2024, albo prosument „starszy”, który złożył oświadczenie z art. 4b ust. 2a).
  - Reszta niewykorzystanych środków jest umarzana po 12 miesiącach (art. 4c ust. 6).
- przejście z RCEm na RCE (art. 4b ust. 2a) jest **nieodwracalne** (art. 4b ust. 2b) ✅. Tak samo
  nieodwracalne jest przejście z net-meteringu na net-billing (art. 4d ust. 1) ✅. Oba fakty
  trafiają do ekranu ryzyk jako „decyzja jednokierunkowa”;
- ujemna cena RCE w danej godzinie liczy się jako zero dla zwykłego prosumenta (art. 4b ust. 2
  pkt 2) ✅;
- współczynnik 1,23 (poniżej).

✏️ **Współczynnik 1,23 dla firm (dok. 1, 4.2 i przykład).** — ~~poprawka~~ **wycofana 28.09.2026**, patrz „Rewizja” niżej; treść zostaje dla historii.
- **Źródło podało:** depozyt każdego prosumenta, także firmy, powiększany o 1,23; „od
  1.02.2025”; przykład firmy: 2 MWh × 450 zł × 1,23 = 1 107 zł.
- **Poprawiono na:** zakres podmiotowy współczynnika jest niepotwierdzony. Wiedza ekspercka
  wskazuje, że służy on wyrównaniu VAT prosumentom **niebędącym** podatnikami VAT, czyli
  typowemu gospodarstwu domowemu. Dla firmy-podatnika VAT przykład dałby 900 zł. Data „1.02.2025”
  też jest niepotwierdzona.
- **Dlaczego:** źródła wtórne opisują mechanizm, ale nie rozstrzygają zakresu. Jeden sygnał
  wskazuje na zmiany VAT w ustawie o OZE w toku.
- **Podstawa:** do odczytu — ustawa o OZE (przepis o depozycie prosumenckim), tekst jednolity.
- **Pewność:** 🔎B.
- **Konsekwencja dla kodu:** 1,23 jest danymi z polem `dotyczy: [...]`, nie stałą. Do czasu
  odczytu kalkulator firmowy liczy wariant bez 1,23 i pokazuje wariant z 1,23 jako „jeśli
  dotyczy Twojej firmy”.

**↩️ Rewizja po odczycie pierwotnym (28.09.2026) — poprawka K4 WYCOFANA, materiał miał rację.**
- **Brzmienie przepisu:** art. 4c ust. 4 ustawy o OZE (t.j. Dz.U. 2026 poz. 68): „Wartość
  depozytu prosumenckiego dotycząca danego miesiąca kalendarzowego jest ustalana, zwiększana o
  współczynnik 1,23 i przyporządkowywana do konta prosumenckiego w kolejnym miesiącu”. Przepis
  **nie różnicuje** prosumentów według statusu VAT. Dotyczy każdego prosumenta energii
  odnawialnej, zbiorowego i wirtualnego, a więc także firmy, która jest prosumentem.
- **Data:** zmianę wprowadziła ustawa z 27.11.2024 (Dz.U. 2024 poz. 1847, art. 1 pkt 4 lit. a),
  w mocy od 28.12.2024. Jej art. 31 każe stosować nowe brzmienie „od pierwszego dnia miesiąca
  kalendarzowego następującego po upływie miesiąca od dnia wejścia w życie”, czyli **od
  1.02.2025**. Data z materiału jest poprawna.
- **Pewność:** ✅. Źródła: API ELI Sejmu — `api.sejm.gov.pl/eli/acts/DU/2026/68/text.pdf`
  (SHA-256 zaczyna się od `82f1684302ec8932`) i `…/DU/2024/1847/text.pdf` (`1adfd0ca2ac1d8c9`).
- **Konsekwencja dla kodu:** 1,23 jest stałą prawną z datą obowiązywania (od 2025-02-01), wspólną
  dla Dom i Firma. Pole `dotyczy` znika. Wariant „bez 1,23” jest zbędny.
- **Uwaga K (informacja, nie porada):** skutki VAT/CIT po stronie firmy (np. czy depozyt jest
  przychodem) nie wynikają z art. 4c. Art. 4 ust. 12 mówi o nadwyżce **ilości energii** z ust. 11,
  a nie wprost o depozycie. Kalkulator firmowy pokazuje ten temat jako „do sprawdzenia z
  księgowym”, bez wyliczeń podatkowych.

Arytmetyka przykładu: 2 × 450 × 1,23 = 1 107 zł ✅ (rachunek i założenie materiału poprawne).

✏️ **„Realny współczynnik bilansowania 0,3–0,4” (dok. 1, 4.3).**
- **Źródło podało:** stałą 0,3–0,4.
- **Poprawiono na:** kalkulator wylicza go z danych: wartość RCE nadwyżki ÷ pełny koszt kWh
  pobranej.
- **Dlaczego:** zależy od profilu, miesiąca i ceny zakupu.
- **Podstawa:** definicja.
- **Pewność:** ✅ (metoda). Liczba 0,3–0,4 może zostać w poradniku jako „rząd wielkości wg
  materiału” z 🔎B.

### 3.2 Konsekwencje dla przejścia (wiedza ekspercka)

1. **Rozwiązanie umowy = koniec rozliczeń prosumenckich.**
   - W net-meteringu tracisz niewykorzystane opusty (energię „w banku”).
   - W net-billingu tracisz depozyt poza ewentualnym zwrotem wg ustawy (🔎B).
   - **Najpierw „wyjedź” zapas, potem wypowiadaj.** Ekran procedury pokazuje saldo do
     wykorzystania.
2. **Stary prosument w net-meteringu ma najmniej powodów, by odchodzić.**
   - Sieć działa dla niego jak tani magazyn sezonowy: lato → zima przy 0,8.
   - Scenariusz A zwykle wygrywa u niego finansowo do końca 15-letniego okresu.
   - Kalkulator musi to pokazać uczciwie, nawet jeśli wynik brzmi „zostań”.
3. **Net-billing i magazyn.** Im niższa wartość nadwyżki, tym bardziej opłaca się ją zużywać
   samemu (autokonsumpcja, magazyn). To pierwszy, odwracalny krok na ścieżce (scenariusz B).
4. **Dotacje na magazyn (§7) są dziś powiązane z byciem prosumentem przyłączonym do sieci**
   (🔎B). Kolejność ma znaczenie: wziąć dotację na magazyn i odłączyć się w okresie trwałości
   projektu może oznaczać zwrot dotacji (🔎B, do odczytu z regulaminu programu). **Ostrzeżenie
   obowiązkowe na ekranie scenariuszy.**

---

## 4. Scenariusze przejścia A–D (serce rozdziału)

### 4.1 Definicje

| Scenariusz | Sieć | Instalacja | Zapas w złych miesiącach | Odwracalność |
|---|---|---|---|---|
| **A — zostaję w sieci + PV** | umowa i licznik; prosument | PV on-grid | sieć | pełna |
| **B — sieć + PV + magazyn (hybryda, „częściowy off-grid”)** | umowa i licznik; prosument | PV + magazyn + falownik hybrydowy; opcjonalnie wydzielone obwody zasilane zawsze z magazynu | sieć | pełna |
| **C — off-grid z przyłączem jako zapas** | umowa i licznik zostają (minimalna moc/taryfa), pobór tylko awaryjnie; bez oddawania energii | system wyspowy dobrany jak do D, sieć przez przełącznik sieć/wyspa | sieć (płacisz „cenę trzymania sieci”, §2.2) | pełna |
| **D — pełne odłączenie** | umowa rozwiązana, licznik zdjęty | system wyspowy + agregat | agregat + zapas magazynu | **praktycznie nieodwracalne** (§5.3) |

**Uwaga ekspercka do B/C** (wydzielone obwody zawsze z magazynu):
- To ta sama topologia, którą aplikacja liczy dziś dla off-grid, więc M3/M4/M8 obsługują ją bez
  nowej fizyki.
- Różnica dotyczy tylko punktu styku z siecią:
  - w B falownik pracuje równolegle z siecią, co wymaga zgłoszenia do OSD (§6.2);
  - w C sieć jest wyłącznie przełączanym źródłem rezerwowym, bez pracy równoległej.

### 4.2 Wzory porównawcze (odtwarzalne — wymóg Wzorca D, standard 08)

Dla scenariusza `s` i horyzontu `N` lat (domyślnie 15, zakres 10–25):

```
TCO_s(N)  = I_s − D_s + Σ_{t=1..N} [ K_sieć,s(t) + K_paliwo,s(t) + K_serwis,s(t) ] / (1+r)^t
            + Σ wymian w horyzoncie  I_wym,s / (1+r)^t_wym  −  R_s(N) / (1+r)^N
```

| Symbol | Znaczenie | Skąd |
|---|---|---|
| `I_s` | nakład inwestycyjny (PV, magazyn, falownik, agregat, rozdzielnica, przełącznik) | M3/M4/M8 (dobór) × ceny wpisane przez użytkownika (**aplikacja nie zgaduje cen sprzętu**) |
| `D_s` | dotacja (tylko jeśli warunki programu spełnione w danym scenariuszu) | plik danych dotacji (§7) + deklaracja użytkownika |
| `K_sieć,s(t)` | roczny koszt sieci = stałe (§2.2) + zmienne × pobór z sieci − wartość rozliczeń prosumenckich | plik stawek / faktura; w D = 0 |
| `K_paliwo,s(t)` | koszt paliwa agregatu = godziny pracy × zużycie paliwa × cena paliwa | M2/E17 + cena wpisana |
| `K_serwis,s(t)` | serwis agregatu, przeglądy | wpis użytkownika (brak twardej normy) |
| `I_wym,s` | wymiana magazynu/falownika w horyzoncie | M4 (żywotność cyklowa/kalendarzowa) |
| `R_s(N)` | wartość rezydualna (liniowo wg pozostałej żywotności) | M4, uproszczenie jawne |
| `r` | stopa dyskontowa | domyślnie **0** (tryb prosty: suma nominalna); tryb zaawansowany: wpis |
| `g` | roczna zmiana cen energii | domyślnie **0** + suwak wrażliwości; **aplikacja nie prognozuje cen** |

**Pozostałe wyniki:**
- **Prosty okres zwrotu** scenariusza s względem A: najmniejsze `t`, dla którego skumulowana
  oszczędność ≥ `I_s − D_s − I_A`.
- **Pobór z sieci w B/C:** z bilansu miesięcznego `E_sieć,m = max(0, E_zuż,m − E_PV,m·η − ΔE_mag,m)`.
  Produkcja miesięczna pochodzi z PVGIS dla lokalizacji (M1).
- **Autokonsumpcja godzinowa** (ile nadwyżki idzie do sieci *w ciągu dnia*, zanim bilans
  miesięczny się domknie) wymaga profilu godzinowego zużycia. Tryb prosty: użytkownik wybiera
  profil z listy; tryb zaawansowany: profil z M2. **Decyzja właściciela (P3, 28.09.2026):
  profile.** Źródło kształtów: standardowe profile zużycia publikowane przez OSD w IRiESD dla
  grup G11/C11 (🔎B — do odczytu w DANE-1) jako profil „typowy”. Warianty („nikogo w dzień”,
  „praca zdalna”) wolno dodać tylko ze źródłem albo jako jawne przesunięcie profilu typowego z
  opisem założenia (bez ukrytych liczb). Wpis ręczny % zostaje jako opcja „znam swoją
  autokonsumpcję” (np. z aplikacji falownika).

### 4.3 Warunek konieczny scenariusza D (i C bez sięgania po sieć)

System wyspowy musi przejść **stress-test zimowy M7** dla lokalizacji użytkownika:
- produkcja grudnia i stycznia wg PVGIS **dla tej lokalizacji i tego kąta** (bez sztywnego
  „zima = x% lata”; w Polsce to zwykle rząd kilkunastu procent produkcji czerwcowej — 🔎B, tylko
  jako opis poglądowy);
- dni autonomii (M2), głębokość rozładowania i temperatura magazynu (M4);
- godziny agregatu (M2/E17);
- pompa ciepła, jeśli jest: jej zimowe zużycie z M6, bo to zwykle ona przesądza, że pełny
  off-grid zimą bez agregatu jest nierealny.

**Werdykty:**
- **D wykluczone bez agregatu**, jeśli bilans styczniowy jest ujemny, a agregatu nie ma
  (twardy stop, §6);
- **D ryzykowne**, jeśli wymaga agregatu przez więcej niż próg godzin/miesiąc ustawiony przez
  użytkownika (koszt, hałas, niezawodność).

### 4.4 Co ekran scenariuszy pokazuje zawsze (uczciwość wyniku)

- Tabelę A–D: `I`, dotacja, koszt roczny (rok 1), `TCO(N)`, okres zwrotu, liczba godzin agregatu,
  wynik stress-testu, **odwracalność**.
- „Najtańszy” i „najbardziej niezależny” jako dwa osobne wyróżnienia. **Nigdy jeden werdykt
  „najlepszy”**, bo cel użytkownika jest wyborem, nie wynikiem obliczeń.
- Wrażliwość: jak zmienia się ranking przy `g` = −3% / 0% / +5% / +10% rocznie (wartości
  suwaka, nie prognoza).
- Listę ryzyk D (§5) i zdanie: „powrót do sieci = nowe przyłączenie”.

---

## 5. Ryzyka i procedura odłączenia (Dom i Firma; wiedza ekspercka)

### 5.1 Rejestr ryzyk pełnego odłączenia (scenariusz D)

| # | Ryzyko | Skutek | Jak aplikacja pomaga | Pewność |
|---|---|---|---|---|
| R1 | **Nieodwracalność** — rozwiązanie umowy, demontaż licznika | powrót = nowy wniosek o przyłączenie, nowe warunki, opłata przyłączeniowa, czas realizacji, ryzyko odmowy (brak warunków technicznych) | wycena „kosztu powrotu” (stawka z taryfy OSD × moc) + ostrzeżenie 🔴 z potwierdzeniem | ✅ (mechanizm), 🔎B (terminy, kwoty) |
| R2 | **Zima** — deficyt produkcji | brak energii / długa praca agregatu | M7 obowiązkowy przed wyborem D | ✅ |
| R3 | **Awaria jedynego źródła** (falownik, BMS) | dom bez prądu do czasu naprawy | rekomendacja: zapasowy tor zasilania (agregat → ładowarka lub bypass), lista części krytycznych | ✅ (praktyka) |
| R4 | **Osoby zależne od zasilania** (koncentrator tlenu, sprzęt medyczny, lodówka z lekami) | zagrożenie zdrowia | pytanie kontrolne; przy „tak” — twardy stop D bez redundantnego zapasu | ✅ |
| R5 | **Pompa ciepła / ogrzewanie elektryczne** | zimowe zapotrzebowanie wielokrotnie większe | echo M6 → M7 | ✅ |
| R6 | **Formalności budynku** — odbiór, zameldowanie, kredyt hipoteczny, ubezpieczenie, sprzedaż domu | urząd/bank/ubezpieczyciel może oczekiwać przyłącza albo udokumentowanego źródła | informacja + lista do sprawdzenia *przed* odłączeniem (bank, ubezpieczyciel, umowa kredytu) | 🔎B (praktyka różna, brak jednolitego przepisu w zebranych źródłach) |
| R7 | **Bezpieczeństwo pożarowe magazynu i PV** | zwiększone ryzyko przy dużych magazynach w budynku | echo M8; przepisy dot. PV >6,5 kW (uzgodnienie z rzeczoznawcą ppoż. i zawiadomienie PSP) | 🔎A (przepis Prawa budowlanego) |
| R8 | **Agregat** — hałas, spaliny (CO!), paliwo, serwis | zatrucie CO przy pracy w pomieszczeniu; sąsiedzi | twardy stop: agregat spalinowy tylko na zewnątrz / w wentylowanym, wydzielonym miejscu | ✅ |
| R9 | **Utrata rozliczeń prosumenckich i dotacji** | utrata depozytu/opustów; ewentualny zwrot dotacji | §3.2, §7 | 🔎B |
| R10 | **Wartość nieruchomości / przyszły nabywca** | część kupujących oczekuje przyłącza | informacja | 🔎B |

**Dla firmy dochodzą:**

| # | Ryzyko | Skutek | Jak aplikacja pomaga | Pewność |
|---|---|---|---|---|
| RF1 | **Ciągłość działalności** (chłodnie, produkcja, serwery) | przestój = strata większa niż oszczędność | pytanie o dopuszczalny czas bez zasilania → minimalny zapas | ✅ |
| RF2 | **Umowy kompleksowe B2B** | okres wypowiedzenia, kary umowne, brak ochrony konsumenckiej | krok kontrolny w procedurze | 🔎B |
| RF3 | **Wymogi ubezpieczyciela i BHP** dla magazynu i agregatu | warunki polisy | lista do sprawdzenia | 🔎B |

### 5.2 Procedura krok po kroku (ekran F — przewodnik)

Kolejność ma znaczenie; kroki 1–4 są odwracalne, 5–7 nie.

1. **Policz** — scenariusze A–D, stress-test M7, wynik zaakceptowany przez użytkownika.
2. **Zbuduj i przetestuj system wyspowy przy wciąż podłączonej sieci** (scenariusz C) przez
   **pełną zimę**. To najważniejsza rada ekspercka całego rozdziału: sieć zostaje jako zapas,
   dopóki system nie przejdzie realnego grudnia–lutego.
   - Przełącznik sieć/wyspa (§6.1), bez pracy równoległej.
   - Wykonanie instalacji i pomiary przez osobę z uprawnieniami (świadectwo kwalifikacyjne SEP
     — 🔎B co do zakresu wymogu przy instalacji własnej).
3. **Sprawdź formalności** (R6, RF2, RF3): bank, ubezpieczyciel, umowa sprzedaży (okres
   wypowiedzenia, kary), regulamin dotacji (trwałość).
4. **Wykorzystaj saldo prosumenckie** (opusty / depozyt) przed końcem umowy.
5. **Wypowiedz umowę sprzedaży i umowę dystrybucyjną** (albo kompleksową), pisemnie. Terminy wg
   umowy/OWU; konsument ma ustawowe prawo do wypowiedzenia (🔎B — szczegóły kosztów przy
   umowach terminowych z Prawa energetycznego).
6. **Demontaż licznika przez OSD.** Opłaty stałe są naliczane do dnia demontażu (🔎B, praktyka
   OSD). Przyłącze (kabel do złącza) zwykle pozostaje własnością OSD. Jego fizyczna likwidacja to
   osobna sprawa, uzgadniana z OSD.
7. **Zachowaj dokumentację** (umowa, protokół demontażu, warunki przyłączenia z przeszłości),
   bo przyda się przy ewentualnym powrocie.

### 5.3 Koszt powrotu do sieci

- Wyliczenie: `K_powrót ≈ stawka opłaty przyłączeniowej OSD (zł/kW, kablowe/napowietrzne) ×
  moc przyłączeniowa` dla grup IV–VI przy standardowej odległości.
- Powyżej odległości z taryfy OSD liczy się wg rzeczywistych nakładów, a aplikacja podaje wtedy
  tylko wzór i komunikat „wycena indywidualna OSD”.
- Stawki pochodzą z pliku danych (DANE-1). Przykład z jednego źródła wtórnego (51,49 zł/kW
  kablowe, 36,12 zł/kW napowietrzne, netto, nieznany OSD i rok) jest 🔎B, **nie do kodu**.
- Czas: wydanie warunków przyłączenia + budowa, liczony w miesiącach (🔎B). W wyniku jako opis,
  nie jako liczba.

---

## 6. Bezpieczeństwo styku z siecią (twarde stopy)

### 6.1 Przełącznik sieć/wyspa — scenariusze C i hybrydowe obwody wydzielone

- 🔴 **Twardy stop — backfeed.** Instalacja wyspowa (falownik off-grid, agregat) **nie może mieć
  możliwości podania napięcia do sieci OSD**. Grozi to porażeniem osób pracujących na
  „wyłączonej” linii.
  - Wymagany przełącznik z pozycją 0 (sieć – 0 – wyspa), z blokadą mechaniczną, albo stycznikowy
    układ SZR z blokadą elektryczną i mechaniczną.
  - Przełączane są przewody fazowe **i neutralny**, zgodnie z układem sieci; szczegół jest do
    doprecyzowania w M8 wg PN-HD 60364 (norma w `docs/zrodla/`), 🔎 w M8.
- 🔴 **Twardy stop — agregat bez przełącznika.** Agregat nie może być podłączony do instalacji
  domowej „przez gniazdko” ani wtyczką z dwoma bolcami (tzw. „wtyczka samobójcza”).
- Echo w M8: wpis do `docs/rejestr-twardych-stopow.md` przy integracji.

### 6.2 Praca równoległa z siecią (scenariusze A i B)

- Falownik hybrydowy albo sieciowy pracujący **równolegle** z siecią to źródło wytwórcze
  przyłączone do sieci. Wymaga **zgłoszenia mikroinstalacji do OSD** i certyfikatu zgodności z
  wymaganiami (NC RfG). Dotyczy to także ustawienia „zero oddawania” (🔎A).
- Instalacja **wyłącznie przełączana** (sieć ↔ wyspa bez synchronizacji, scenariusz C) nie jest
  pracą równoległą (🔎B, zależy od konfiguracji falownika). Aplikacja pyta więc o tryb pracy i
  przy „równolegle” pokazuje obowiązek zgłoszenia.

---

## 7. Dotacje i podatki (Część K — informacja, nie porada)

Każda pozycja ma w pliku danych `stanNa`, link do regulaminu, `dotyczy` (Dom/Firma, prosument/
off-grid) i `waznoscDo`. Po terminie naboru pozycja jest automatycznie oznaczana „nabór
zakończony”.

| Program | Dla kogo | Co wiemy | Pewność |
|---|---|---|---|
| Przydomowe Magazyny Energii (NFOŚiGW, następca Mój Prąd) | osoby fizyczne, prosumenci | cz. 2: nabór 4.09.2026–31.08.2027 (budżet ok. 1 mld zł z Funduszu Modernizacyjnego); do 30% kosztów kwalifikowanych; max 16 000 zł na magazyn (do 19 000 zł na punkt poboru łącznie); magazyn min. 10 kWh; koszty od 1.11.2025 | 🔎B |
| Ulga termomodernizacyjna | podatnicy PIT — właściciele/współwłaściciele domu jednorodzinnego | lista wydatków w rozporządzeniu; czy obejmuje magazyn energii — **do odczytu** | 🔎B |
| Programy regionalne dla firm (np. FE dla Podkarpacia) | przedsiębiorcy z regionu | ✏️ nabór FEPK.02.03-IZ.00-002/26 trwał 3–31.03.2026 — **zakończony** | ✅ (data z materiału; minęła) |

✏️ **Dotacje w dok. 1 (5.4).**
- **Źródło podało:** program NFOŚiGW (magazyny przydomowe) i ulgę termomodernizacyjną jako
  dotacje dla firm; nabór FEPK jako aktualny.
- **Poprawiono na:** oba programy dotyczą osób fizycznych / budynków mieszkalnych, więc
  przeniesiono je do części Dom. FEPK jest zakończony.
- **Dlaczego:** zakres podmiotowy programów; data naboru minęła.
- **Podstawa:** regulaminy (🔎B, odczyt pierwotny w DANE-1); data — arytmetyka kalendarza ✅.

✏️ **Podatki w dok. 1 (4.4).**
- **Źródło podało:** (a) nadwyżka wyrażona depozytem nie stanowi przychodu w CIT; (b) wprowadzona
  nadwyżka podlega opodatkowaniu jako przychód; (c) przedsiębiorcy są zwolnieni z podatku
  dochodowego i akcyzy od sprzedaży zielonej energii.
- **Poprawiono na:** zdania (a) i (b) są wzajemnie sprzeczne, a (c) jest nieprawdziwym
  uogólnieniem. Treść nie trafia do kalkulatora. W poradniku zostaje jedno zdanie: „skutki
  podatkowe net-billingu w firmie zależą od formy opodatkowania — skonsultuj z księgowym;
  interpretacje indywidualne wiążą tylko wnioskodawcę”.
- **Dlaczego:** sprzeczność wewnętrzna; interpretacja indywidualna nie jest źródłem ogólnej
  reguły; sygnatura niezweryfikowana.
- **Podstawa:** Ordynacja podatkowa (moc wiążąca interpretacji indywidualnej).
- **Pewność:** ✅ (odrzucenie), 🔎B (sygnatura).

---

## 8. Część FIRMA — poprawiona i uzupełniona treść materiału

### 8.1 Grupy taryfowe (nN)

| Grupa | Moc umowna | Strefy | Uwagi |
|---|---|---|---|
| C11 | ≤ 40 kW | 1 | |
| C12a | ≤ 40 kW | 2 (szczyt / pozaszczyt; godziny wg OSD) | |
| C12b | ≤ 40 kW | 2 (dzień / noc; godziny wg OSD) | |
| C21 | > 40 kW | 1 | ✏️ K11: bez stref |
| C22a / C22b | > 40 kW | 2 | |
| C23 | > 40 kW | 3 | ✏️ brak w materiale; oferta zależy od OSD (🔎B) |
| B (SN) | przyłącze średniego napięcia | — | ✏️ poza materiałem; w poradniku tylko wzmianka |

Podział ≤40 / >40 kW ✅ (zgodny z materiałem i praktyką taryf OSD).

✏️ **K9 — „od 2008 ceny taryfy C nieregulowane”.**
- **Źródło podało:** ceny w C nie są regulowane przez URE.
- **Poprawiono na:** dotyczy **sprzedaży**. Stawki **dystrybucji** C są zatwierdzane przez Prezesa
  URE co roku.
- **Dlaczego:** rozdzielenie sprzedaży od dystrybucji.
- **Podstawa:** Prawo energetyczne (taryfy OSD).
- **Pewność:** ✅.

### 8.2 Moc bierna

**Kogo dotyczy.**

✏️ **K3 — moc bierna w C1x „zawsze tak”.**
- **Źródło podało:** każda taryfa C, także C11/C12, płaci za moc bierną przy tgφ > tgφ₀.
- **Poprawiono na:** rozliczenie mocy biernej na nN dotyczy odbiorców, u których wynika to z
  warunków przyłączenia/umowy. Zasadniczo są to odbiorcy z mocą >40 kW; przy ≤40 kW — jeśli
  umowa to przewiduje.
- **Dlaczego:** nadmierne uogólnienie materiału.
- **Podstawa:** taryfy OSD 2026 (Energa pkt 4.3.2; analogicznie Tauron i Stoen): „Rozliczeniami
  za pobór energii biernej są objęci odbiorcy zasilani z sieci średniego i wysokiego napięcia.
  Takimi rozliczeniami mogą być objęci także odbiorcy zasilani z sieci o napięciu znamionowym nie
  wyższym niż 1 kV” ✅. Próg „>40 kW” jako praktyczna reguła na nN pozostaje 🔎B (wiedza
  ekspercka; w taryfach 40 kW to granica grup C1x/C2x, nie reguła mocy biernej). Kalkulator
  pyta: „czy masz na fakturze pozycję za energię bierną?”.

**tgφ₀.** Domyślnie 0,4, chyba że umowa lub warunki przyłączenia stanowią inaczej, ale nigdy
poniżej 0,2 ✅ (zgodne z materiałem; granica 0,2 — taryfy OSD 2026, np. Energa pkt 4.3.4).

**Wzór.**

✏️ **K1 — wzór opłaty za nadwyżkę energii biernej indukcyjnej.**
- **Źródło podało:** `O_b = k · C_rk · [(1 + tg²φ)/(1 + tg²φ₀) − 1] · A`.
- **Poprawiono na:** `O_b = k · C_rk · ( √((1 + tg²φ)/(1 + tg²φ₀)) − 1 ) · A`.
- **Dlaczego:** stosunek mocy pozornej do czynnej wynosi `√(1 + tg²φ)`. Wzór źródła, bez
  pierwiastka, zawyża opłatę około dwukrotnie. Przeliczenie dla tgφ = 0,5 i tgφ₀ = 0,4:
  - wzór źródła: (1,25/1,16) − 1 = **0,0776**;
  - wzór poprawny: √(1,25/1,16) − 1 = **0,0381**.
- **Podstawa:** rozporządzenie w sprawie kształtowania i kalkulacji taryf w elektroenergetyce
  (paragraf do odczytu) + geometria trójkąta mocy.
- **Pewność:** ✅ — fizyka oraz brzmienie wzoru w taryfach OSD 2026 (Energa pkt 4.3.6, Tauron i
  Stoen pkt 3.4.6): pierwiastek jest w tekście taryfy. Rozporządzenia taryfowego nie odczytano,
  ale taryfa zatwierdzona przez URE jest dokumentem pierwotnym dla rozliczenia.

✏️ **K2 — `C_rk`.**
- **Źródło podało:** „cena energii czynnej [zł/kWh]”, sugerując cenę z faktury klienta.
- **Poprawiono na:** `C_rk` to cena energii elektrycznej ogłaszana przez Prezesa URE (art. 23
  ust. 2 pkt 18 lit. b Prawa energetycznego), obowiązująca w dniu zatwierdzenia taryfy OSD.
  `k` to krotność z taryfy OSD.
- **Dlaczego:** definicja z rozporządzenia.
- **Podstawa:** j.w.
- **Pewność:** definicja ✅ (taryfy OSD 2026: „cena energii elektrycznej, o której mowa w art. 23
  ust. 2 pkt 18 lit. b ustawy, obowiązująca w dniu zatwierdzenia Taryfy”); `k` ✅ = 3,00 nN /
  1,00 SN / 0,50 110 kV (zgodnie Tauron, Energa, Stoen). **Wartość liczbowa `C_rk` — 🔎
  (nieodczytana;** jest w komunikacie Prezesa URE, nie w taryfie). **Dane:** `C_rk` i `k` trafiają
  do pliku stawek per OSD; użytkownik może wpisać wartości z faktury.

**Pozostałe przypadki** (✏️ K2, uzupełnienie):
- energia bierna **pojemnościowa** (przekompensowanie);
- energia bierna indukcyjna **przy braku poboru czynnej**.

Oba przypadki rozlicza się od **całej** energii biernej, nie od nadwyżki: `O_b = k · C_rk · E_b`
(✅ taryfy OSD 2026: Energa pkt 4.3.3 lit. b i 4.3.8; „nadwyżka ponad tgφ = 0”). To typowa pułapka po montażu baterii kondensatorów bez automatyki (weekend, noc).

**Kompensacja — kalkulator opłacalności (nowy, wiedza ekspercka):**
- Wymagana moc kompensacyjna: `Q_C = P · (tgφ − tgφ_cel)`, gdzie P to średnia moc czynna w
  okresie pracy, a `tgφ_cel` jest poniżej tgφ₀ z zapasem (typowo 0,2–0,3; wybór użytkownika,
  nie stała) ✅ (fizyka).
- Okres zwrotu = koszt baterii kondensatorów (wpis użytkownika) ÷ roczna opłata `O_b`.
- Ostrzeżenie: przekompensowanie → rozliczenie pojemnościowe; potrzebna regulacja automatyczna.

### 8.3 Przekroczenie mocy umownej

✏️ **K12 — materiał nie podaje wzoru.**
- **Źródło podało:** „opłatę oblicza się od wartości przekraczającej moc umowną”.
- **Poprawiono na** (uzupełnienie): opłata = składnik stały stawki sieciowej [zł/kW/mies.] ×
  **suma 10 największych nadwyżek** mocy pobranej ponad umowną (pomiar 15-minutowy, a gdy
  niemożliwy — godzinowy), albo × **10 × największa nadwyżka**, gdy układ pomiarowy nie pozwala na
  wariant pierwszy. Naliczana za każdy miesiąc z przekroczeniem.
- **Dlaczego:** materiał jest niekompletny.
- **Podstawa:** taryfy OSD 2026 — Tauron pkt 3.2.11, Energa pkt 4.2.11–4.2.12, Stoen pkt 3.2.11
  (brzmienie jednakowe).
- **Pewność:** ✅. Wariant (a/b) zależy od licznika klienta, więc jest pytaniem do użytkownika,
  nie daną OSD.

**Optymalizacja mocy umownej (C2x):**
- kalkulator porównuje roczny koszt składnika stałego przy mocy umownej `P_u` z kosztem
  przekroczeń przy danych o mocy szczytowej;
- dane: 12 miesięcznych maksimów z faktur/portalu OSD, wpis użytkownika;
- wynik to `P_u` minimalizujące sumę kosztów.

### 8.4 Opłata mocowa w firmie

0,2194 zł/kWh netto za energię pobraną w dni robocze 7:00–22:00 (✅ Informacja URE 58/2025). Wzrost wobec 2025
(0,1413) to +55,3%, arytmetyka ✅.

Kalkulator pokazuje:
- udział poboru w tych godzinach;
- ile daje przesunięcie X% poboru poza nie (produkcja, ładowanie EV, pompa ciepła z buforem,
  magazyn).

### 8.5 PV i BESS w firmie

- **BESS:** definicja (ogniwa, BMS, PCS, EMS) ✅ i pięć strumieni korzyści ✅ (poprawna
  klasyfikacja).
- ✏️ **K13 — strumień „redukcja opłaty za moc umowną”.**
  - **Źródło podało:** strumień dostępny ogólnie.
  - **Poprawiono na:** realny tylko w C2x (opłata stała liczona od kW mocy umownej) i przy
    przekroczeniach.
  - **Dlaczego:** w C1x opłata stała też zależy od mocy umownej, ale moc umowną zmienia się
    administracyjnie, a zmiana zwykle nie wymaga magazynu.
  - **Podstawa:** struktura taryfy.
  - **Pewność:** 🔎B.
- **Usługi systemowe** (rynek bilansujący, rynek mocy) są dla małych magazynów praktycznie
  niedostępne bez agregatora. W poradniku tylko informacja (🔎B).
- **Ceny i zwrot:** 1 400–2 500 zł/kWh i zwrot 5–8 lat są orientacyjne wg materiału (🔎B).
  **Nie do kodu**; kalkulator liczy zwrot z cen wpisanych przez użytkownika (echo M4/E23).
- „54% energii z węgla” — liczba kontekstowa, **nie do aplikacji** (nie służy żadnemu
  obliczeniu).

### 8.6 Weryfikacja licznika i reklamacja (Dom i Firma)

- **Test diody** ✅: `P [kW] = impulsy/min × 60 ÷ stała licznika [imp/kWh]`.
  - Przykład z materiału: 15 × 60 ÷ 1000 = 0,9 kW ✅.
  - Dokładniej jest liczyć czas `n` impulsów: `P = 3600 · n / (t[s] · stała)`, co daje mniejszy
    błąd przy małym poborze. Uzupełnienie ✅.
- **Portale OSD** — nazwy usług to dane z datą (🔎B), nie treść na sztywno.
- ✏️ **K7 — terminy reklamacji.**
  - **Źródło podało:** „reklamację można złożyć w ciągu 14 dni od otrzymania faktury”.
  - **Poprawiono na:** **14 dni to termin odpowiedzi** przedsiębiorstwa energetycznego (🔎A),
    termin złożenia wynika z umowy/OWU. Dla konsumenta brak odpowiedzi w terminie oznacza
    uznanie reklamacji (🔎B).
  - **Dlaczego:** pomylenie terminów.
  - **Podstawa:** Prawo energetyczne / rozporządzenie systemowe (odczyt).
- **Badanie laboratoryjne licznika** — 14 dni na badanie od zgłoszenia ✅ (zgodne z materiałem,
  🔎A co do brzmienia).
  - ✏️ **K7b — koszty ekspertyzy.**
    - **Źródło podało:** „dodatkowa ekspertyza — płaci odbiorca” bezwarunkowo.
    - **Poprawiono na:** odbiorca pokrywa koszt, **chyba że** ekspertyza wykaże nieprawidłowości;
      wtedy koszt ponosi przedsiębiorstwo (🔎A).
    - **Podstawa:** rozporządzenie systemowe (odczyt).
  - Kwoty badania per OSD (209,09 / 127,70 + 56,02 / 130,00 + 57,03 zł) — 🔎B, stan na dzień
    materiału, dane z datą. Arytmetyka 169,99 × 1,23 = 209,09 ✅.
- **Wzór pisma reklamacyjnego** (elementy z materiału ✅) — ekran generuje tekst do skopiowania
  (Wzorzec G).

### 8.7 Porównywarka taryf C — algorytm (poprawiony)

✏️ **K8 — przykład 9.3.**
- **Źródło podało:** moc umowna 30 kW i rekomendacja C21.
- **Poprawiono na:** C2x wymaga >40 kW. Przy 30 kW porównujemy tylko C11/C12a/C12b. Kwoty w
  tabeli są ilustracyjne, niewyliczone.
- **Podstawa:** podział grup ✅.

**Koszt roczny w taryfie `T`:**

```
K_T = Σ_strefy E_z · (c_energia,z + c_sieć_zm,z + c_jakość + c_OZE + c_kogen)
      + E_mocowa · c_mocowa                      (energia w dni robocze 7–22)
      + 12 · (P_u · c_sieć_st + c_abonament + c_handlowa)
      + O_b + O_przekroczenia
      − wartość rozliczeń prosumenckich
K_T,brutto = K_T · 1,23   (akcyza zawarta w cenie energii; VAT 23%)
```

- Taryfy niedostępne dla podanej mocy umownej są **wyłączone**, a nie „gorsze”.
- Podział zużycia na strefy pochodzi z profilu: wpis albo import z portalu OSD, CSV — PRO.
- Godziny stref pochodzą z pliku danych danego OSD.

---

## 9. Plan danych i zadanie DANE-1 (bramka przed kodem)

**DANE-1** — zebranie stawek 2026 z dokumentów pierwotnych. Warunek konieczny przed kodem
kalkulatorów rachunku.
- **Potrzebne dokumenty:** PDF taryf 2026 (PGE Dystrybucja, Tauron Dystrybucja, Enea Operator,
  Energa-Operator, Stoen Operator), Informacja Prezesa URE nr 58/2025, obwieszczenia/
  rozporządzenia (OZE, kogeneracyjna, zniesienie przejściowej), rozporządzenie taryfowe
  (moc bierna, przekroczenia) i systemowe (reklamacje, badanie licznika), ustawa o OZE (depozyt,
  1,23, zwrot), regulamin programu Przydomowe Magazyny Energii.
- **Stan 28.09.2026:** większość pobrana i odczytana (§0 „Stan weryfikacji”). Otwarte pozycje
  wymagają albo ręcznego dostarczenia PDF (PGE Dystrybucja, regulamin PME z NFOŚiGW — oba serwery
  mają niepełny łańcuch certyfikatów TLS i środowisko je odrzuca), albo odczytu wizualnego (skan
  taryfy Enea, tabela C2x Stoen).
- ~~**Blokada:** środowisko tej sesji nie ma dostępu do tych domen.~~ (historyczne) Da się to rozwiązać na dwa
  sposoby:
  - dodać domeny do dozwolonych w ustawieniach środowiska (menu środowiska → Edit → Network
    access): `ure.gov.pl`, `bip.ure.gov.pl`, `gov.pl`, `isap.sejm.gov.pl`, `nfosigw.gov.pl`,
    `pse.pl`, `pgedystrybucja.pl`, `tauron-dystrybucja.pl`, `operator.enea.pl`,
    `energa-operator.pl`, `stoen.pl`;
  - albo dostarczyć PDF-y do `docs/zrodla/` — wtedy wchodzą 1:1 jako źródła.
- **Wynik:** plik danych z polami §2.4 + testy spójności (np. suma stawek w przykładowej fakturze
  = wartość z PDF-owego przykładu OSD, jeśli OSD go publikuje). Wszystkie 🔎A zamieniają się na
  ✅ albo na ✏️.
- **Do czasu DANE-1:** kalkulatory rachunku mogą działać **wyłącznie w trybie „moje dane z
  faktury”**. To pełnoprawny tryb, nie namiastka, i odpowiada decyzji właściciela 4.

### 9.1 Ręczna weryfikacja przez właściciela — lista kontrolna (alternatywa dla odblokowania sieci)

Wystarczy odesłać wartość + nazwę dokumentu/stronę (albo zdjęcie/PDF). Kolejność wg ważności:

| # | Co sprawdzić | Gdzie | Co odesłać |
|---|---|---|---|
| ~~W1~~ ✅ 28.09.2026 (odczyt pierwotny) | Stawki opłaty mocowej 2026 (G 4 progi, pozostali 0,2194 zł/kWh + godziny) | ure.gov.pl → Informacja Prezesa URE nr 58/2025 | potwierdzenie liczb albo różnice |
| ~~W2~~ ✅ 28.09.2026 (OZE, kogeneracyjna — z taryf OSD; przejściowa — komunikat ME + brak w taryfach) | Opłata OZE 2026 (7,30 zł/MWh?), kogeneracyjna (3,00 zł/MWh?), zniesienie przejściowej | gov.pl/web/energia (komunikaty), URE | j.w. |
| W3 — **częściowo** 28.09.2026: Tauron ✅, Energa ✅, Stoen ✅ (bez C22a/b), Enea tylko brutto; **PGE ❌** | Taryfa OSD 2026 (dla każdego OSD z osobna): G11, G12, G12w, G13, C11, C12a/b, C21, C22a/b — opłata sieciowa stała i zmienna, abonamentowa, stawka jakościowa, godziny stref, stawki opłaty przyłączeniowej IV–VI, krotność przekroczenia mocy umownej, `k` dla mocy biernej | strona OSD → „Taryfa” (PDF): pgedystrybucja.pl, tauron-dystrybucja.pl, operator.enea.pl, energa-operator.pl, stoen.pl | **najprościej: sam PDF taryfy** (wyciągnę liczby, Ty tylko potwierdzasz wynik) |
| W4 | Standardowe profile zużycia G11/C11 (do profili autokonsumpcji, P3) | strona OSD → IRiESD / „standardowe profile” | plik (zwykle XLS/CSV) |
| ~~W5~~ ✅ 28.09.2026 (API ELI Sejmu) | Współczynnik 1,23 — kogo dotyczy; zasady zwrotu depozytu | isap.sejm.gov.pl → ustawa o OZE, tekst jednolity, przepis o depozycie prosumenckim | brzmienie przepisu |
| W6 | Program „Przydomowe Magazyny Energii” — warunki (czy wymaga bycia prosumentem, trwałość, zwrot przy odłączeniu) | nfosigw.gov.pl → regulamin naboru | regulamin (PDF) |
| ~~W7~~ ✅ 28.09.2026 (z taryf OSD; wartość `C_rk` nadal 🔎) | Wzór mocy biernej, przekroczenie mocy umownej | isap.sejm.gov.pl → rozporządzenie w sprawie kształtowania i kalkulacji taryf w elektroenergetyce | paragraf (zdjęcie/tekst) |

Każda odesłana wartość wchodzi do `docs/zrodla/` jako źródło (1:1) i zamienia 🔎 na ✅ albo ✏️.

---

## 10. Plan ekranów

Role ekranów wg standardu (8.11, taksonomia z opracowania LED): **artykuł referencyjny** /
**ekran pochodny** (cienka nakładka na istniejący silnik) / **Kreator Pro**. Wzorce UI A–H wg
`slownik-pojec.md`. **FREE/PRO — odłożone decyzją właściciela (decyzja 6), tabele nie przypisują
ekranów do FREE/PRO.**

### 10.1 Kreator „Ścieżka przejścia” (w obu kaflach — prowadzenie za rękę)

Wejście do kreatora jest na końcu części **Sieć** („Chcę policzyć przejście na off-grid”), nie na
starcie rozdziału (decyzja 7). Krok 1 korzysta z już policzonego rachunku z części Sieć.

Kreator Pro, Wzorzec F + postęp zapisany lokalnie. Sześć kroków; każdy krok prowadzi do ekranu
poniżej (link, bez wklejania treści):
1. Mój rachunek →
2. Moje zużycie (M2) →
3. Ile PV i magazynu (M3/M4) →
4. Zima (M7) + agregat (M2/E17) →
5. Scenariusze A–D →
6. Ryzyka i procedura.

Na końcu podsumowanie (Wzorzec G) do zapisania/wydruku.

### 10.2 Rozdział DOM (M14-D)

| ID | Część | Ekran | Rola | Wzorzec | Silnik / dane |
|---|---|---|---|---|---|
| D1 | Sieć | Mój rachunek dziś — rozbicie na stałe/zmienne, „cena trzymania sieci” | kalkulator | D | plik stawek / faktura |
| D2 | Sieć | Która taryfa G (G11/G12/G12w/G13…) | kalkulator porównawczy | B | plik stawek + strefy OSD |
| D3 | Sieć | Moje zużycie miesięcznie | pochodny | D | M2 / faktury |
| D4 | Przejście | Ile PV i magazynu, żeby uniezależnić się od sieci | pochodny | D | M3, M4 |
| D5 | Przejście | Zima bez sieci | pochodny | G | M7 |
| D6 | Przejście | Agregat jako zapas | pochodny | D | M2/E17 |
| D7 | Przejście | Porównanie scenariuszy A–D | kalkulator | G | §4 |
| D8 | Sieć | Net-metering, net-billing, depozyt — co tracę, odchodząc | artykuł + mini-kalkulator | C + D | §3 |
| D9 | Przejście | Ryzyka odłączenia (lista z potwierdzeniem) | kalkulator/checklista | E | §5.1 — **wspólny** |
| D10 | Przejście | Jak zrezygnować z przyłącza — krok po kroku | artykuł | F | §5.2 — **wspólny** |
| D11 | Przejście | Przełącznik sieć/wyspa i bezpieczeństwo | artykuł + twarde stopy | F + E | §6, M8 — **wspólny** |
| D12 | Sieć | Test licznika i reklamacja (dioda + pismo) | kalkulator + generator | D + G | §8.6 — **wspólny** |
| D13 | Sieć | Dotacje (stan na dzień, z terminami) | artykuł | C | plik dotacji |
| D14 | Sieć | FAQ | artykuł | C | — |

### 10.3 Rozdział FIRMA (M14-F)

| ID | Część | Ekran | Rola | Wzorzec | Silnik / dane |
|---|---|---|---|---|---|
| F1 | Sieć | Mój rachunek dziś (C) | kalkulator | D | plik stawek / faktura |
| F2 | Sieć | Porównywarka taryf C | kalkulator | B + G | §8.7 |
| F3 | Sieć | Moc bierna — opłata i opłacalność kompensacji | kalkulator | D | §8.2 |
| F4 | Sieć | Moc umowna — przekroczenia i optymalny poziom | kalkulator | D | §8.3 |
| F5 | Sieć | Opłata mocowa — przesunięcie poboru | kalkulator | D | §8.4 |
| F6 | Sieć | PV w firmie i autokonsumpcja | pochodny | D | M3 + §3 |
| F7 | Sieć | Magazyn (BESS) dla firmy — strumienie korzyści | pochodny | D + G | M4/E23 + §8.5 |
| F8 | Przejście | Scenariusze A–D dla firmy (z ciągłością działalności) | kalkulator | G | §4 + RF1 |
| F9 | Przejście | Ryzyka odłączenia firmy | kalkulator/checklista | E | D9 + RF1–RF3 (**wspólny**, parametr segmentu) |
| F10 | Przejście | Procedura i umowy B2B | artykuł | F | D10 (**wspólny**) |
| F11 | Sieć | Test licznika, reklamacja, badanie laboratoryjne | kalkulator + generator | D + G | D12 (**wspólny**) |
| F12 | Sieć | Dotacje i podatki — informacja, nie porada | artykuł | C | §7 |
| F13 | Sieć | FAQ firm (poprawione pytania z materiału) | artykuł | C | dok. 1 cz. 8 z ✏️ |

### 10.4 Narzędzia AI (echo silników, wzorem istniejących)

- `rozbij_rachunek_za_prad` (D1/F1);
- `porownaj_scenariusze_przejscia` (D7/F8);
- `policz_oplate_za_moc_bierna` (F3);
- `dobierz_taryfe` (D2/F2);
- `oszacuj_koszt_powrotu_do_sieci` (§5.3).

Narzędzia nie mają własnej fizyki, tylko wywołują silniki.

### 10.5 Twarde stopy (do `docs/rejestr-twardych-stopow.md` przy integracji)

1. Backfeed / brak przełącznika z pozycją 0 (§6.1).
2. Agregat podłączony bez przełącznika / „wtyczka z dwoma bolcami” (§6.1).
3. Agregat spalinowy w pomieszczeniu (R8).
4. Scenariusz D przy ujemnym bilansie zimowym bez agregatu (§4.3).
5. Scenariusz D przy osobach zależnych od zasilania medycznego bez redundantnego zapasu (R4).

Ostrzeżenia (nie stopy): utrata depozytu/opustów, ryzyko zwrotu dotacji, nieodwracalność
odłączenia (wymagane potwierdzenie), dane stawek po terminie ważności.

---

## 11. Nowe pojęcia do słownika (przy integracji)

- **OSD** — operator systemu dystrybucyjnego.
- **Sprzedawca z urzędu**.
- **Grupa taryfowa G / C / B**.
- **Moc umowna / przyłączeniowa**.
- **Opłata sieciowa stała/zmienna**, **abonamentowa**, **mocowa**, **jakościowa**, **OZE**,
  **kogeneracyjna**.
- **Net-metering**, **net-billing**, **RCE/RCEm**, **depozyt prosumencki**.
- **tgφ / tgφ₀**, **energia bierna indukcyjna/pojemnościowa**.
- **„Cena trzymania sieci”** — nazwa robocza w M14 dla `K_stałe,rok`.
- **Backfeed**, **przełącznik sieć–0–wyspa**, **SZR**.
- **Scenariusze A–D**, **TCO**.

---

## 12. Rejestr adnotacji ✏️ (do audytu N.1)

| Nr | Miejsce w materiale | Sekcja opracowania | Pewność |
|---|---|---|---|
| K1 | dok. 1, 3.2 — wzór mocy biernej bez √ | §8.2 | ✅ (fizyka + brzmienie taryf OSD) |
| K2 | dok. 1, 3.2 — C_rk; pojemnościowa | §8.2 | ✅ definicja, k, pojemnościowa; 🔎 wartość C_rk |
| K3 | dok. 1, 2 i 3.1 — moc bierna w C1x | §8.2 | ✅ (taryfy OSD: SN/WN zawsze, nN „mogą być”); próg 40 kW 🔎B |
| ~~K4~~ | dok. 1, 4.2 — 1,23 dla firm, data | §3.1 | **wycofana** 28.09.2026 — materiał miał rację (art. 4c ust. 4 OZE, od 1.02.2025) ✅ |
| K5 | dok. 1, 4.4 — podatki sprzeczne | §7 | ✅ odrzucenie |
| K6 | dok. 1, 5.4 — dotacje | §7 | ✅ / 🔎B |
| K7 / K7b | dok. 1, 7.1, 7.3 — terminy, koszt ekspertyzy | §8.6 | 🔎A/🔎B |
| K8 | dok. 1, 9.3 — C21 przy 30 kW | §8.7 | ✅ |
| K9 | dok. 1, 2 — „ceny C nieregulowane” | §8.1 | ✅ |
| K10 | dok. 2, algorytm — opłata przejściowa (oraz moja wcześniejsza notatka „brakuje”) | §2.3 | 🔎A |
| K11 | dok. 2, cz. 1–2 — tabele stawek | §2.4 | ✅ odrzucenie |
| K12 | dok. 1, 3.4 — brak wzoru przekroczenia | §8.3 | ✅ (taryfy OSD) |
| K13 | dok. 1, 5.3 — redukcja opłaty za moc umowną | §8.5 | 🔎B |
| K14 | dok. 1, 4.3 — stały współczynnik 0,3–0,4 | §3.1 | ✅ metoda |

---

## 13. Otwarte kwestie do decyzji właściciela (przed „integruj teraz”)

- ~~**P1** — FREE/PRO z §10~~ → rozstrzygnięte: odłożone (decyzja 6).
- ~~**P2** — nazwy kafli~~ → rozstrzygnięte: „Dom – sieć” / „Firma – sieć”, Sieć najpierw, przejście jako opcja (decyzja 7).
- ~~**P3** — autokonsumpcja w trybie prostym~~ → rozstrzygnięte: **profile** (§4.2; źródło kształtów W4).
- **P4** — DANE-1: właściciel rozważa odblokowanie domen albo ręczną weryfikację (lista §9.1);
  obie drogi otwarte, nie blokują integracji do Biblii — blokują tylko dane domyślne w kodzie.

## Źródła wtórne użyte przy weryfikacji (28.09.2026, bez odczytu pierwotnego)

- [URE BIP — Stawki opłaty mocowej](https://bip.ure.gov.pl/bip/rynek-mocy/3993,Stawki-oplaty-mocowej.html) (tytuł/wynik wyszukiwania)
- [Informacja Prezesa URE nr 58/2025](https://www.ure.gov.pl/pl/urzad/informacje-ogolne/komunikaty-prezesa-ure/12930,Informacja-nr-582025.html) (tytuł/wynik wyszukiwania)
- [URE — zatwierdzenie taryf na 2026](https://www.ure.gov.pl/pl/urzad/informacje-ogolne/aktualnosci/13002,Prezes-Urzedu-Regulacji-Energetyki-zatwierdzil-taryfy-na-sprzedaz-i-dystrybucje-.html)
- [Infor.pl — ceny energii 2026, 495,16 zł/MWh](https://www.infor.pl/prawo/nowosci-prawne/7482689,ceny-energii-elektrycznej-odmrozone-w-2026-r-ure-gospodarstwa-domowe-zaplaca-w-sumie-3-wiecej-niz-teraz-tanszy-prad-49516-zl-netto-za-1-mwh-ale-drozsza-dystrybucja.html)
- [Ministerstwo Energii — koniec opłaty przejściowej od 2026](https://www.gov.pl/web/energia/koniec-oplaty-przejsciowej-na-rachunkach-za-prad-od-2026-r)
- [Ministerstwo Energii — brak podwyżki opłaty kogeneracyjnej 2026](https://www.gov.pl/web/energia/nie-bedzie-podwyzki-oplaty-kogeneracyjnej-w-2026-r)
- [Globenergia — opłata kogeneracyjna bez podwyżki](https://globenergia.pl/kolejne-zmiany-na-rachunkach-za-prad-oplata-kogeneracyjna-jednak-bez-podwyzki/)
- [Globenergia — Przydomowe Magazyny Energii, wznowienie naboru](https://globenergia.pl/druga-szansa-na-dotacje-do-magazynu-energii-i-pv-nfosigw-wznawia-nabor-po-programie-moj-prad/)
- [Globenergia — współczynnik 1,23 w net-billingu](https://globenergia.pl/prosumenci-w-net-bilingu-zyskaja-23-wartosci-depozytu-propozycje-zmian-w-ustawie/)

## Źródła pierwotne odczytane 28.09.2026 (DANE-1)

- Informacja Prezesa URE nr 58/2025 — `docs/zrodla/URE-Informacja-58-2025-stawki-oplaty-mocowej-2026.pdf`.
- Taryfy OSD 2026 — `docs/zrodla/Tauron-Dystrybucja-Taryfa-2026.pdf`, `…-wyciag-grupy-G.pdf`,
  `Energa-Operator-Taryfa-2026.pdf`, `Stoen-Operator-Taryfa-2026-tekst-z-25-02-2026.pdf`,
  `Enea-Operator-stawki-brutto-2026-od-02-01.pdf`.
- Zmiana stawki jakościowej od 1.02.2026 — `docs/zrodla/Tauron-Dystrybucja-stawka-jakosciowa-od-2026-02-01.pdf`,
  `docs/zrodla/Enea-Operator-stawka-jakosciowa-od-2026-02-01.pdf`.
- Ustawa o OZE, t.j. Dz.U. 2026 poz. 68 — https://api.sejm.gov.pl/eli/acts/DU/2026/68/text.pdf
  (3,2 MB, nie kopiowana do repo; SHA-256 `82f1684302ec8932…`): art. 4 ust. 11–11a, art. 4b, 4c, 4d.
- Ustawa z 27.11.2024 zmieniająca ustawę o OZE, Dz.U. 2024 poz. 1847 —
  https://api.sejm.gov.pl/eli/acts/DU/2024/1847/text.pdf (SHA-256 `1adfd0ca2ac1d8c9…`): art. 1 pkt 4
  lit. a, art. 31, art. 33.
- Komunikat Ministerstwa Energii z 28.11.2025 „Koniec opłaty przejściowej…” — gov.pl/web/energia.
