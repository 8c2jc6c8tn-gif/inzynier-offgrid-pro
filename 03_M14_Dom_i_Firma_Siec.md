# 03. M14 — „Dom – sieć” i „Firma – sieć”: rachunek za prąd, a potem przejście na off-grid

**Wersja:** 1.8 | **Filar:** B (merytoryczny) | **Data utworzenia:** 28.09.2026 | **Ostatnia aktualizacja:** 28.09.2026 | **Status:** Stabilny — ~~**kod zablokowany bramką N.3**~~ **kod odblokowany 28.09.2026 (D50)**, obowiązuje bramka danych DANE-1 (patrz „Stan i bramki”)
**Powiązane dokumenty:** `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md` (opracowanie źródłowe: weryfikacja, adnotacje ✏️ K1–K14, tabele stawek per OSD), `rejestr-decyzji.md` D35–D43 i D47–D48, `docs/rejestr-pokrycia.md` (sekcja M14), `docs/rejestr-twardych-stopow.md` (sekcja M14), `mapa-wdrozenia.md`, `slownik-pojec.md` (sekcja „Sieć i rozliczenia energii”)

TL;DR: Moduł **M14** ma dwa rozdziały i na pulpicie dwa duże kafle: **M14-D „Dom – sieć”** (grupy taryfowe G) oraz **M14-F „Firma – sieć”** (grupy C na nN). Każdy rozdział składa się z dwóch części w stałej kolejności:
1. najpierw **Sieć** — ile kosztuje mój rachunek i z czego się składa: taryfa, prosument, licznik;
2. potem, jako opcja, **Przejście na off-grid**. Obejmuje scenariusze A–D z TCO, dobór PV i magazynu (echo M3/M4), zimę (M7), agregat (M2/E17), pełną listę ryzyk oraz procedurę odłączenia przyłącza.

Kreator „Ścieżka przejścia” prowadzi użytkownika za rękę w 6 krokach. Stawki są danymi z okresami ważności, a użytkownik zawsze może wpisać **własne dane z faktury**.

---

## Pochodzenie treści

- **Materiał wyjściowy (B.5, nietknięty):** `docs/zrodla/Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md` (dok. 1) i `docs/zrodla/Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md` (dok. 2). Oba napisało inne narzędzie AI, więc obowiązuje podwyższona czujność (15.1b).
- **Opracowanie eksperckie (D.7):** `docs/zrodla/Opracowanie_M14_Z_Sieci_Na_OffGrid_DRAFT.md`. W nim są:
  - pełna weryfikacja i 14 adnotacji ✏️ (K1–K14);
  - pierwotne odczyty stawek (DANE-1) z PDF taryf OSD, Informacji Prezesa URE nr 58/2025 i ustawy o OZE (API ELI Sejmu);
  - części „Dom”, „przejście” i „ryzyka odłączenia” napisane z wiedzy eksperckiej na polecenie właściciela.
  
  Ten rozdział jest wersją kanoniczną, a w sprawach szczegółu źródła odsyła do sekcji opracowania (§).
- **Decyzje właściciela** (28.09.2026): `rejestr-decyzji.md` **D35–D38**.
- **Skala pewności** (z opracowania §0):
  - ✅ — prawo, fizyka, arytmetyka albo odczyt dokumentu pierwotnego;
  - 🔎A — ≥2 zgodne źródła wtórne;
  - 🔎B — jedno źródło albo wiedza ekspercka.
  
  **Do kodu jako wartość domyślna trafia tylko ✅.** 🔎A/🔎B pojawiają się wyłącznie w treści poradnikowej, z zastrzeżeniem.

---

## Cel

Użytkownik, który jest jeszcze podłączony do sieci, dostaje uczciwy obraz dwóch rzeczy:
- **ile płaci i za co**;
- **co się stanie**, jeśli zacznie się od sieci uniezależniać: częściowo (PV, magazyn) albo w pełni (odłączenie przyłącza).

Obraz obejmuje koszty, opłacalność, dobór PV i magazynu, zimę oraz ryzyka. Aplikacja nie zastępuje decyzji użytkownika — pokazuje ją liczbami (D35).

## Miejsce w aplikacji

| Kafel | Rozdział | Dla kogo |
|---|---|---|
| **Dom – sieć** | M14-D | Gospodarstwo domowe (grupy G), prosument lub nie |
| **Firma – sieć** | M14-F | Przedsiębiorca, rolnik (grupy C na nN; grupa B tylko jako wzmianka w poradniku) |

- Dwa osobne kafle zamiast przełącznika Dom/Firma, bo użytkownik jest w swoim świecie od pierwszego kliknięcia, a zbiory ekranów istotnie się różnią. Tylko Firma ma moc bierną, moc umowną i porównywarkę C.
- Wejście do części **Przejście** znajduje się na końcu części **Sieć** („Chcę policzyć przejście na off-grid”) — D35.
- **Ekrany wspólne** — ryzyka, procedura, przełącznik sieć/wyspa, test licznika:
  - w kodzie to jeden ekran z parametrem segmentu `dom | firma` (echo, D12/D20);
  - wchodzi się do nich z obu kafli;
  - treść różni się tylko tam, gdzie prawo odróżnia konsumenta od przedsiębiorcy.
- **Pozycja kafli na pulpicie (D39):** na końcu domyślnej kolejności, za kaflem 13. Później dojdzie preset onboardingu „Jestem podłączony do sieci”, który wysuwa je na początek. „Kafel 14” to Ustawienia (D9), więc kafle M14 nazywamy nazwą albo M14-D / M14-F, nie numerem.

## Kluczowe zasady i wzory

### 1. Rachunek = sprzedaż + dystrybucja (opracowanie §2.1–2.2)

| Składnik | Jednostka | Charakter | Znika przy… |
|---|---|---|---|
| Energia czynna (sprzedaż) | zł/kWh | zmienny | spadku poboru |
| Opłata handlowa sprzedawcy | zł/mies. | **stały** | rozwiązaniu umowy sprzedaży |
| Opłata sieciowa zmienna (OSD) | zł/kWh, per strefa | zmienny | spadku poboru |
| Opłata sieciowa stała (OSD) | G: zł/mies. (1f/3f); C: zł/kW mocy umownej/mies. | **stały** | odłączeniu (w C także przy obniżeniu mocy umownej) |
| Opłata abonamentowa (OSD) | zł/mies. (zależna od okresu rozliczeniowego) | **stały** | odłączeniu |
| Opłata mocowa — G (ryczałt wg progu rocznego zużycia) | zł/mies. | quasi-stały (skok na progu) | spadku zużycia poniżej progu albo odłączeniu |
| Opłata mocowa — pozostali (m.in. C) | zł/kWh w dni robocze 7:00–22:00 | zmienny | przesunięciu poboru |
| Stawka jakościowa, OZE, kogeneracyjna | zł/kWh, zł/MWh | zmienny | spadku poboru |
| Opłata przejściowa | — | **zniesiona od 1.01.2026** ✅ (✏️ K10: algorytm dok. 2 ją naliczał; pole z wartością 0 zostaje w danych dla faktur z 2025 r.) | — |
| Akcyza (w cenie energii), VAT 23% | — | — | — |
| Moc bierna, przekroczenie mocy umownej (C) | zł | zdarzeniowy | kompensacji / korekcie mocy umownej |

- Sprzedaż w G może pochodzić z taryfy sprzedawcy z urzędu, z oferty rynkowej albo z umowy z ceną dynamiczną. W C cena sprzedaży jest rynkowa.
- **Dystrybucja jest zawsze w taryfie OSD zatwierdzanej przez Prezesa URE**, także w C (✏️ K9).

**„Cena trzymania sieci”** (oś całej decyzji — ile kosztuje samo posiadanie sieci jako zapasu):

`K_stałe,rok = 12 · (opłata sieciowa stała + abonamentowa + handlowa + mocowa_G) · (1 + VAT)`

- PV i magazyn obniżają tylko składniki zmienne.
- Składniki stałe płaci się dopóty, dopóki istnieją umowa i licznik.

### 2. Stawki 2026 (opracowanie §2.3, §2.4a)

**Ogólnokrajowe, netto ✅:**

| Pozycja | Wartość | Źródło |
|---|---|---|
| Opłata mocowa, ryczałt | < 500 kWh/rok: 4,29 zł/mies.; 500–1 200: 10,31; > 1 200–2 800: 17,18; > 2 800: 24,05 | Informacja Prezesa URE nr 58/2025 |
| Opłata mocowa, pozostali | 0,2194 zł/kWh, 7:00–22:00 w dni robocze | j.w. |
| Opłata OZE | 7,30 zł/MWh | taryfy OSD 2026 |
| Opłata kogeneracyjna | 3,00 zł/MWh | taryfy OSD 2026 |
| Stawka jakościowa nN | **0,0331 zł/kWh (1–31.01.2026), 0,0332 zł/kWh (od 1.02.2026)** | taryfa PSE / komunikaty OSD |
| Akcyza | 5,00 zł/MWh | — |
| VAT | 23% | — |

Uwagi do tabeli:
- **Granice progów opłaty mocowej** trzeba odwzorować 1:1 wg brzmienia URE, bez zaokrąglania.
- **Średnia cena energii G (495,16 zł/MWh)** ma pewność 🔎A, więc nie jest wartością domyślną.

**Per OSD** (składnik stały/zmienny opłaty sieciowej, abonament, strefy): Tauron, Energa i Stoen ✅; Enea tylko brutto; PGE jeszcze niepobrana. Tabele: opracowanie §2.4a. **Żadna liczba z tabel dok. 2 nie wchodzi do danych** (✏️ K11): są wewnętrznie sprzeczne, a kontrola wyrywkowa po odczycie pierwotnym wykazała, że część jest trafna, a część nie.

Model danych dla OSD:
- lista OSD: PGE Dystrybucja, Tauron Dystrybucja, Enea Operator, Energa-Operator, Stoen Operator oraz „inny OSD” z wpisem ręcznym;
- grupy G11, G12, G12w, G12as, G13, C11, C12a, C12b, C21, C22a, C22b — nie każdy OSD oferuje każdą;
- strefy czasowe to dana per OSD, nie założenie (np. Stoen C2x ma inny podział).

**Prosument rozliczany jest w okresie 1-miesięcznym**, więc ścieżki A/B biorą abonament 1-miesięczny.

### 3. Prosument (opracowanie §3)

| System | Kogo dotyczy | Działanie |
|---|---|---|
| Net-metering (opusty) | wnioski sprzed 1.04.2022 | 0,8 kWh (≤10 kW) / 0,7 kWh (>10 kW) za 1 kWh oddaną; rozliczenie roczne; 15 lat (🔎A) |
| Net-billing | mikroinstalacje ≤50 kW od 1.04.2022 | wartość nadwyżki (RCEm albo RCE) trafia na depozyt ważny 12 mies. ✅ |

Szczegóły ✅ (ustawa o OZE, t.j. Dz.U. 2026 poz. 68):
- depozyt × **1,23** — dla każdego prosumenta, także firmy, od **1.02.2025** (art. 4c ust. 4).
  - Stała prawna z datą obowiązywania, bez pola „dotyczy”.
  - ✏️ K4 wycofana: materiał miał rację.
- zwrot niewykorzystanego depozytu:
  - najwyżej **20%** przy rozliczeniu RCEm, **30%** przy RCE (art. 4 ust. 11a);
  - reszta jest umarzana po 12 mies. (art. 4c ust. 6).
- przejścia jednokierunkowe — oba trafiają na ekran ryzyk jako „decyzja jednokierunkowa”:
  - z RCEm na RCE (art. 4b ust. 2a–2b);
  - z net-meteringu na net-billing (art. 4d ust. 1).
- ujemna RCE liczy się jako 0 (art. 4b ust. 2 pkt 2).
- „współczynnik bilansowania” nie jest stałą 0,3–0,4. Aplikacja **wylicza** go jako wartość RCE nadwyżki ÷ pełny koszt kWh pobranej (✏️ K14).

Konsekwencje dla przejścia (wiedza ekspercka):
- rozwiązanie umowy kończy rozliczenia, więc najpierw trzeba „wyjechać” saldo;
- stary prosument w net-meteringu zwykle wygrywa scenariuszem A i aplikacja mówi to uczciwie;
- dotacja na magazyn a odłączenie w okresie trwałości może oznaczać zwrot dotacji (🔎B, ostrzeżenie obowiązkowe).

### 4. Scenariusze przejścia A–D (opracowanie §4)

| Scenariusz | Sieć | Instalacja | Zapas w złych miesiącach | Odwracalność |
|---|---|---|---|---|
| **A** — sieć + PV | umowa, licznik, prosument | PV on-grid | sieć | pełna |
| **B** — sieć + PV + magazyn („częściowy off-grid”) | j.w. | PV + magazyn + falownik hybrydowy, opcjonalnie wydzielone obwody z magazynu | sieć | pełna |
| **C** — off-grid z przyłączem jako zapas | umowa i licznik zostają, pobór tylko awaryjny, bez oddawania | system wyspowy jak dla D + przełącznik sieć/wyspa | sieć („cena trzymania sieci”) | pełna |
| **D** — pełne odłączenie | umowa rozwiązana, licznik zdjęty | system wyspowy + agregat | agregat + magazyn | **praktycznie nieodwracalne** |

**TCO** (odtwarzalne, wymóg Wzorca D):

```
TCO_s(N) = I_s − D_s + Σ_{t=1..N} [K_sieć,s(t) + K_paliwo,s(t) + K_serwis,s(t)] / (1+r)^t
           + Σ I_wym,s / (1+r)^t_wym − R_s(N) / (1+r)^N
```

Znaczenie symboli: opracowanie §4.2.

Zasady liczenia:
- **Ceny sprzętu, paliwa i serwisu wpisuje użytkownik.** Aplikacja nie zgaduje cen i **sama nie prognozuje cen energii**. Zmiana ceny energii `g` ma trzy źródła do wyboru (D40):
  1. domyślnie `g` = 0;
  2. suwak wrażliwości −3 / 0 / +5 / +10%/rok;
  3. **„Ścieżka UE”** — dynamika cen z oficjalnej projekcji Komisji Europejskiej dla Polski, zawsze podpisana nazwą źródła i datą (niżej);
  4. **„Ścieżka UE + inflacja”** (D41) — ta sama dynamika plus średnioroczna inflacja. Pokazuje kwoty, które użytkownik faktycznie zapłaci w kolejnych latach (niżej).
- Parametry domyślne (D40, zatwierdzone przez właściciela 28.09.2026):
  - horyzont `N` = 15 lat, zakres 10–25;
  - `r` = 0 w trybie prostym: wynik w dzisiejszych złotych, bez inflacji i dyskonta. `g` z suwaka i ze „Ścieżki UE” oznacza zmianę ceny **ponad inflację**, żeby obie opcje dało się porównać.

**„Ścieżka UE” — projekcja cen energii elektrycznej dla Polski (D40)**

Źródło: Komisja Europejska, DG ENER, *EU Reference Scenario 2020 (REF2020)*, arkusz „main results on energy, transport and GHG emissions”, zakładka `PL_A`, wiersz „Average Price of Electricity in Final demand sectors (€'15/MWh)”, model PRIMES, lipiec 2021. Odczyt pierwotny 28.09.2026 (✅ — co mówi źródło). Plik pobrany ze strony KE (energy.ec.europa.eu → EU Reference Scenario 2020); strona na 28.09.2026 nie podaje nowszej edycji.

| Rok | 2020 | 2025 | 2030 | 2035 | 2040 | 2045 | 2050 |
|---|---|---|---|---|---|---|---|
| €'15/MWh | 123,57 | 133,59 | 145,49 | 146,60 | 155,50 | 157,34 | 158,87 |

Średnia roczna zmiana wg arkusza: **+1,65%/rok** w latach 2020–2030 i **+0,44%/rok** w latach 2030–2050 (ceny stałe z 2015 r., czyli realnie, ponad inflację).

Zasady użycia:
- Do aplikacji wchodzi **tylko dynamika** (indeks rok do roku, między punktami 5-letnimi interpolacja geometryczna), nigdy poziom w €/MWh. Powody:
  - wartość to średnia dla **wszystkich odbiorców końcowych**, nie tylko gospodarstw domowych;
  - arkusz nie mówi, czy cena zawiera podatki. Średnia UE z arkusza (2020: 148,71) nie równa się liczbie z wykresu „po podatkach” w raporcie (151), więc nie wolno tego zakładać.
- **Ostrzeżenie widoczne przy wyborze ścieżki:** projekcja przyjmuje politykę z końca 2019 r. Nie uwzględnia kryzysu cen 2021–2023, pakietu Fit for 55 ani ETS2. To oficjalny scenariusz odniesienia UE, a nie przewidywanie rachunku.
- Wartości trafiają do pliku danych `rozliczenia-pl-2026` (lub osobnego, patrz lista zadań) z polami `zrodlo` / `stanNa` / `pewnosc`, tak jak stawki (D36).
- Gdy KE opublikuje nowszą edycję (prace nad *Reference Scenario 2025* trwały w latach 2024–2025), dane zostaną podmienione. Stara wersja zostaje w logu źródła.

**„Ścieżka UE + inflacja” — ceny nominalne, czyli kwoty do zapłaty (D41)**

Wzór (Fisher, mnożenie, nie dodawanie):

```
indeks_nom(t) = indeks_UE(t) · (1 + π)^t
g_nom(t)      = (1 + g_UE(t)) · (1 + π) − 1
```

Źródła inflacji `π` do wyboru:

| Opcja | Wartość | Źródło | Pewność |
|---|---|---|---|
| **Cel inflacyjny NBP** (do wyboru; do 28.09.2026 proponowana jako domyślna ✅🤖, zastąpione przez D43) | **2,5%/rok** (pasmo ±1 pkt proc.) | Uchwała nr 7/2025 RPP z 2.09.2025 w sprawie założeń polityki pieniężnej na rok 2026, M.P. 2025 poz. 1013: „celem polityki pieniężnej jest utrzymanie inflacji – rozumianej jako procentowa roczna zmiana indeksu cen towarów i usług konsumpcyjnych – na poziomie 2,5 % z symetrycznym przedziałem odchyleń o szerokości ±1 punktu procentowego w średnim okresie” (od 2004 r.) | ✅ odczyt pierwotny 28.09.2026 |
| **Średnia z ostatnich 15 lat (GUS)** — **domyślna (D43)** | **3,58%/rok** (2011–2025, średnia geometryczna) | GUS, „Roczne wskaźniki cen towarów i usług konsumpcyjnych od 1950 roku” (CSV, rok poprzedni = 100) | ✅ wyliczone z danych pierwotnych 28.09.2026 |
| **Własna wartość** | wpis użytkownika | — | — |

Średnie GUS dla porównania (ten sam plik): 10 lat (2016–2025) 4,59%/rok, 20 lat (2006–2025) 3,37%/rok, od 2004 r. 3,32%/rok. Okno 15 lat wybrano, bo tyle wynosi domyślny horyzont `N`. W pliku GUS wiersz 2025 ma w kolumnie „Sposób prezentacji” wpis „Rok poprzedni = 101” zamiast „= 100”. To oczywisty błąd opisu; wartość 103,6 przyjmujemy jako wskaźnik rok do roku. Po publikacji danych za 2026 średnie trzeba przeliczyć.

Zasady (twarde, żeby porównanie scenariuszy nie kłamało):
- **Gdy wybrano inflację, rośnie o `π` każdy koszt bieżący**: paliwo do agregatu, serwis i wymiany sprzętu. Energia z sieci rośnie o `g_nom`. Bez tego scenariusze off-grid wyglądałyby sztucznie tanio.
- **Wynik pokazuje dwie liczby obok siebie:**
  1. „zapłacisz łącznie (w złotych z tamtych lat)” — suma nominalna;
  2. „w dzisiejszych złotych” — ta sama suma przeliczona przez `(1+π)^t`, czyli wynik „Ścieżki UE”.
  
  Ranking scenariuszy aplikacja podaje według liczby 2. Suma nominalna bez dyskonta zawyża koszty odległe w czasie, a przez to faworyzuje scenariusze z dużą inwestycją na starcie.
- W nagłówku wyniku zawsze widać, która ścieżka i które `π` zostały użyte, ze źródłem.

**Przykład kontrolny (do testów)**, liczony od 2026 r. (punkt 2026 z interpolacji geometrycznej 2025–2030), `N` = 15, koszt energii z sieci 5 000 zł/rok w cenach 2026:

| Ścieżka | Mnożnik ceny w roku 15 (2041) | Średnio %/rok | Suma 15 lat |
|---|---|---|---|
| `g` = 0 | 1,0000 | 0,00 | 75 000 zł |
| Ścieżka UE | 1,1470 | 0,92 | ≈ 81 444 zł |
| Ścieżka UE + inflacja 2,5% (NBP) | 1,6612 | 3,44 | ≈ 100 143 zł (nominalnie) |
| **Ścieżka UE + inflacja 3,58% (GUS, domyślna)** | 1,9440 | 4,53 | ≈ 109 699 zł (nominalnie) |

W roku 1 (2027) mnożniki wynoszą 1,0172 (UE), 1,0426 (UE + 2,5%) i 1,0536 (UE + 3,58%). Do danych i testów wchodzi π = 3,58% (zaokrąglenie do 0,01 pkt proc.; dokładna średnia z pliku to 3,5768%).

**Gdzie użytkownik to wybiera — jedno pole „Wzrost cen energii” (D42)**

Przełącznik ścieżek stoi **dokładnie w miejscu suwaka procentów**, na ekranach porównania scenariuszy (D7 dom, F8 firma). Nie ma osobnego ekranu ani ustawienia gdzie indziej. Budowa pola:

1. **Przełącznik segmentowy** z trzema pozycjami:
   - „Suwak %”;
   - „Plany UE”;
   - „Plany UE + inflacja”.
2. **Pod przełącznikiem zmienia się zawartość, w tym samym miejscu:**
   - **„Suwak %”** (domyślnie): suwak −3 / 0 / +5 / +10%/rok, ustawiony na 0 (ceny stałe);
   - **„Plany UE”**: zamiast suwaka widać średnią %/rok dla wybranego horyzontu `N`, podpis źródła (EU Reference Scenario 2020, KE) i ostrzeżenie o założeniach z 2019 r.;
   - **„Plany UE + inflacja”**: to samo, plus pod spodem wybór inflacji: **średnia GUS 3,58% (domyślnie, D43)** / cel NBP 2,5% / własna wartość. Obok widać wynikową średnią %/rok.
3. Każda zmiana **od razu przelicza tabelę A–D** na tym samym ekranie.
4. Na telefonie przełącznik mieści się w jednej linii (krótkie etykiety). Pełne nazwy i wyjaśnienie „ponad inflację / kwoty do zapłaty” trafiają do chmurki „?” (D34).
- Okres zwrotu liczony jest względem A.
- Pobór z sieci w B/C: `E_sieć,m = max(0, E_zuż,m − E_PV,m·η − ΔE_mag,m)`, produkcja z PVGIS dla lokalizacji (M1).
- **Autokonsumpcja w trybie prostym = profile** (D38):
  - kształt „typowy” ze standardowych profili zużycia OSD (IRiESD) — 🔎B, do pozyskania (W4);
  - warianty tylko ze źródłem albo jako jawne przesunięcie profilu typowego;
  - opcja „znam swoją autokonsumpcję” (wpis %);
  - tryb zaawansowany: profil z M2.

**Warunek konieczny D** (i C bez sięgania po sieć): stress-test zimowy M7 dla lokalizacji i kąta. Obejmuje:
- grudzień i styczeń wg PVGIS, bez stałej „zima = x% lata”;
- dni autonomii (M2), DoD i temperaturę magazynu (M4);
- godziny agregatu (M2/E17);
- zimowe zużycie pompy ciepła (M6).

Werdykty:
- ujemny bilans styczniowy bez agregatu → **twardy stop**;
- agregat ponad próg godzin/mies. ustawiony przez użytkownika → „D ryzykowne”.

**Uczciwość wyniku:** ekran pokazuje zawsze tabelę A–D. Kolumny:
- `I`, dotacja;
- koszt roku 1, `TCO(N)`, okres zwrotu;
- godziny agregatu, wynik M7;
- odwracalność.

Wyniki „najtańszy” i „najbardziej niezależny” są osobno. **Nigdy nie ma jednego werdyktu „najlepszy”.**

### 5. Ryzyka pełnego odłączenia i procedura (opracowanie §5)

Rejestr ryzyk dla D (tabela i pewność każdej pozycji: opracowanie §5.1):
- **R1** nieodwracalność — powrót to nowe przyłączenie;
- **R2** zima;
- **R3** awaria jedynego źródła;
- **R4** osoby zależne od zasilania medycznego;
- **R5** pompa ciepła lub ogrzewanie elektryczne;
- **R6** formalności: odbiór, bank, ubezpieczyciel, sprzedaż domu;
- **R7** bezpieczeństwo pożarowe magazynu i PV;
- **R8** agregat: CO, hałas, paliwo;
- **R9** utrata rozliczeń i dotacji;
- **R10** wartość nieruchomości.

Firma dodatkowo:
- **RF1** ciągłość działalności — pytanie o dopuszczalny czas bez zasilania;
- **RF2** umowy B2B;
- **RF3** ubezpieczyciel i BHP.

**Procedura** — kroki 1–4 są odwracalne, 5–7 nie:
1. Policz scenariusze i M7.
2. **Zbuduj i przetestuj system wyspowy przy wciąż podłączonej sieci (C) przez pełną zimę.** To najważniejsza rada rozdziału.
3. Sprawdź formalności.
4. Wykorzystaj saldo prosumenckie.
5. Wypowiedz umowy pisemnie. Najpierw sprawdź okres wypowiedzenia i ewentualną karę (oferty z gwarancją ceny, umowy B2B).
6. OSD demontuje licznik; przyłącze zwykle zostaje własnością OSD.
7. Zachowaj dokumentację.

**Koszt powrotu do sieci:** `K_powrót ≈ stawka opłaty przyłączeniowej OSD [zł/kW] × moc przyłączeniowa` (grupy IV–VI, odległość standardowa).
- Stawki są danymi DANE-1.
- Powyżej standardowej odległości aplikacja podaje tylko wzór i komunikat „wycena indywidualna OSD”.
- Czas realizacji podawany jest opisowo.

### 6. Bezpieczeństwo styku z siecią (opracowanie §6)

- Scenariusz C i obwody wydzielone:
  - wymagany przełącznik sieć – 0 – wyspa z blokadą mechaniczną albo SZR z blokadą elektryczną i mechaniczną;
  - przełączane są fazy **i N** zgodnie z układem sieci.
  
  ~~Szczegóły normowe mają być doprecyzowane w M8 wg PN-HD 60364 (🔎 w M8).~~ **[28.09.2026, D47]** Szczegóły normowe mieszkają tu, na ekranie D11; M8 tylko do niego odsyła. Wymagają HD 60364-5-551, której nie ma w repo (🔎, `docs/normy-brakujace.md`).
- **[28.09.2026, D48]** Agregat: przełącznik jest wymagany zawsze, gdy agregat zasila instalację budynku — przy sieci i bez niej. Ekrany M2/E17 i M7/E8 mają już ten stop w kodzie; D6 go powtarza (echo).
- Praca **równoległa** z siecią (A, B, także „zero oddawania”) wymaga zgłoszenia mikroinstalacji do OSD i certyfikatu NC RfG (🔎A). Aplikacja pyta o tryb pracy i przy „równolegle” pokazuje ten obowiązek.

### 7. Część FIRMA (opracowanie §8)

**Grupy nN:**
- C11, C12a, C12b dla mocy ≤ 40 kW;
- C21 (bez stref, ✏️), C22a/b i C23 (🔎B, zależnie od OSD) dla mocy > 40 kW;
- B (SN) tylko jako wzmianka.

**Moc bierna** (✅ z taryf OSD 2026):
- nadwyżka indukcyjna: `O_b = k · C_rk · ( √((1 + tg²φ)/(1 + tg²φ₀)) − 1 ) · A` — ✏️ K1: materiał nie miał √ i zawyżał opłatę ok. 2×;
- energia pojemnościowa oraz indukcyjna przy braku poboru czynnej: `O_b = k · C_rk · E_b`;
- `k` = 3,00 nN / 1,00 SN / 0,50 110 kV;
- tgφ₀ = 0,4, nie mniej niż 0,2;
- `C_rk` = cena z art. 23 ust. 2 pkt 18 lit. b Prawa energetycznego, obowiązująca w dniu zatwierdzenia taryfy, a nie cena z faktury klienta (✏️ K2; wartość 🔎).

Kogo dotyczy (✏️ K3): SN/WN zawsze, na nN — gdy tak stanowią umowa lub warunki przyłączenia. Kalkulator pyta: „czy masz na fakturze pozycję za energię bierną?”.

Kompensacja:
- `Q_C = P · (tgφ − tgφ_cel)`, gdzie `tgφ_cel` wybiera użytkownik;
- zwrot = koszt baterii kondensatorów ÷ roczna opłata `O_b`;
- ostrzeżenie o przekompensowaniu.

**Przekroczenie mocy umownej** (✅, ✏️ K12):
- opłata = składnik stały [zł/kW/mies.] × suma 10 największych nadwyżek (15 min);
- albo × 10 × największa nadwyżka, gdy układ pomiarowy nie pozwala na wariant pierwszy — wariant to pytanie do użytkownika.

Optymalna moc umowna = `P_u` minimalizujące sumę kosztu składnika stałego i kosztu przekroczeń (dane: 12 miesięcznych maksimów).

**Opłata mocowa w firmie:**
- 0,2194 zł/kWh w dni robocze 7:00–22:00;
- ekran pokazuje udział poboru w tych godzinach i efekt przesunięcia X% poboru.

**BESS:**
- pięć strumieni korzyści;
- „redukcja opłaty za moc umowną” jest realna tylko w C2x oraz przy przekroczeniach (✏️ K13, 🔎B);
- ceny i zwrot z materiału **nie trafiają do kodu**, zwrot liczony jest z cen użytkownika (echo M4/E23);
- usługi systemowe (rynek bilansujący, rynek mocy) są dla małych magazynów praktycznie niedostępne bez agregatora, więc pojawiają się tylko jako informacja (🔎B).

**Porównywarka taryf C:**

```
K_T = Σ_strefy E_z · (c_energia,z + c_sieć_zm,z + c_jakość + c_OZE + c_kogen)
      + E_mocowa · c_mocowa + 12 · (P_u · c_sieć_st + c_abonament + c_handlowa)
      + O_b + O_przekroczenia − wartość rozliczeń prosumenckich
K_T,brutto = K_T · 1,23
```

Taryfa niedostępna dla danej mocy umownej jest **wyłączona** z porównania, a nie „gorsza” (✏️ K8: przy 30 kW nie ma C21).

### 8. Licznik i reklamacja (Dom i Firma, opracowanie §8.6)

**Test diody:** `P = 3600 · n / (t[s] · stała [imp/kWh])` ✅. Przykład z materiału: 15 imp/min przy stałej 1000 → 0,9 kW.

Nazwy portali OSD z danymi pomiarowymi to dane z datą (🔎B), a nie tekst na sztywno.

Reklamacja:
- 14 dni to termin **odpowiedzi** przedsiębiorstwa (✏️ K7, 🔎A);
- laboratoryjne badanie licznika — 14 dni;
- koszt ekspertyzy pokrywa odbiorca, **chyba że** ekspertyza wykaże nieprawidłowości (✏️ K7b, 🔎A);
- ekran generuje pismo reklamacyjne (Wzorzec G).

### 9. Dotacje i podatki (Część K GOD BOOK — informacja, nie porada; opracowanie §7)

- Dotacje to plik danych z polami `stanNa`, `waznoscDo`, `dotyczy` i linkiem do regulaminu. Po terminie pozycja jest oznaczana „nabór zakończony”.
- Przydomowe Magazyny Energii (🔎B, W6) i ulga termomodernizacyjna trafiają do części Dom (✏️ K6).
- Nabór FEPK jest zakończony.
- Podatki w firmie: jedno zdanie „skonsultuj z księgowym” (✏️ K5), **bez wyliczeń podatkowych**.

## Wejście

- **Segment:** `dom | firma` (wynika z kafla).
- **Sieć:**
  - OSD, grupa taryfowa i liczba faz (G) albo moc umowna (C);
  - zużycie roczne albo miesięczne (faktury albo M2), podział na strefy (wpis albo profil);
  - okres rozliczeniowy;
  - status prosumenta (net-metering / net-billing RCEm / RCE, saldo);
  - dla C także: energia bierna, 12 maksimów mocy, wariant pomiaru przekroczeń.
- **Stawki:** przełącznik per pole „dane z taryfy 2026” / „moje dane z faktury” (D36).
- **Przejście:**
  - lokalizacja (M1), kąt i moc PV (M3), magazyn (M4), agregat (M2/E17);
  - ceny sprzętu, paliwa i serwisu, dotacja;
  - horyzont `N`, `r`, `g`;
  - tryb pracy z siecią (równolegle / przełączany);
  - odpowiedzi kontrolne: osoby zależne od zasilania, pompa ciepła, dopuszczalny czas bez zasilania (Firma).

## Walidacja

- **Grupa vs moc umowna:** C2x tylko dla > 40 kW, C1x dla ≤ 40 kW.
- **Dane i strefy:** strefy muszą pochodzić z danych OSD. Brak stawek dla wybranego OSD daje wyłącznie tryb „moje dane z faktury”, bez zgadywania.
- **Zakresy i daty:**
  - tgφ₀ ≥ 0,2;
  - `N` w zakresie 10–25;
  - data rozliczenia mieści się w okresie ważności stawki.
  
  Po `waznoscDo` pojawia się ostrzeżenie „stawki mogą być nieaktualne — sprawdź fakturę”.
- Generyczna walidacja pól liczbowych działa jak w innych kalkulatorach.

## Logika

Część Sieć:
1. Rachunek = suma składników z okresów ważności stawek. Rachunek roczny to średnia ważona zużyciem z miesięcy; przy braku danych miesięcznych — stawka obowiązująca najdłużej, z ostrzeżeniem (D36).
2. Rozbicie na stałe/zmienne i „cena trzymania sieci”.
3. Dobór taryfy (G albo C): koszt `K_T` dla każdej dostępnej taryfy, taryfy niedostępne są wyłączone.
4. Kalkulatory firmowe: moc bierna, przekroczenia i optymalna moc umowna, opłata mocowa.

Część Przejście:
1. Bilans miesięczny scenariuszy (echo M3/M4, PVGIS z M1).
2. TCO.
3. Stress-test M7 dla C i D.
4. Ryzyka i procedura.

**Brak nowej fizyki poza rachunkiem** — reszta to wywołania istniejących silników (§1.2 opracowania).

## Wynik

- `CalcResult` (kontrakty rdzenia) z rozbiciem rachunku (netto/brutto, stałe/zmienne, „cena trzymania sieci”).
- Ranking taryf.
- Tabela A–D (patrz „uczciwość wyniku”).
- Lista ryzyk z potwierdzeniem.
- Koszt powrotu do sieci.
- Pismo reklamacyjne (tekst).
- Podsumowanie kreatora do zapisu/wydruku (Wzorzec G).
- Każda liczba stawki ma `zrodlo`, `stanNa` i `pewnosc`.

## Obsługa błędów

- `INCOMPLETE`, gdy brakuje stawek lub zużycia. Komunikat wskazuje brakujące pole i proponuje tryb „moje dane z faktury”.
- `INVALID_INPUT` przy niezgodności grupy z mocą umowną.
- Twarde stopy — sekcja niżej.
- Ostrzeżenia, które nie są stopami:
  - utrata depozytu lub opustów;
  - ryzyko zwrotu dotacji;
  - nieodwracalność odłączenia (wymagane potwierdzenie);
  - decyzje jednokierunkowe prosumenta;
  - stawki po terminie ważności;
  - praca równoległa wymaga zgłoszenia.

## Twarde stopy (do `docs/rejestr-twardych-stopow.md`)

1. **Backfeed:** instalacja wyspowa lub agregat może podać napięcie do sieci OSD, bo nie ma przełącznika z pozycją 0 i blokadą.
2. **Agregat podłączony bez przełącznika:** przez gniazdko albo „wtyczką z dwoma bolcami”.
3. **Agregat spalinowy w pomieszczeniu (CO).**
4. **Scenariusz D przy ujemnym bilansie zimowym bez agregatu.**
5. **Scenariusz D przy osobach zależnych od zasilania medycznego bez redundantnego zapasu.**

## Przykład (kontrolny, do testów przy implementacji)

1. **Moc bierna** (✏️ K1): tgφ = 0,5, tgφ₀ = 0,4.
   - Czynnik √(1,25/1,16) − 1 = **0,0381**.
   - Wzór materiału bez √ dawał 0,0776.
   - Test porównuje czynnik, a nie kwotę, bo `C_rk` jest 🔎.
2. **Test diody:** 15 imp/min, stała 1000 imp/kWh.
   - 15 × 60 / 1000 = **0,9 kW**.
   - W wersji czasowej: n = 15, t = 60 s, `P = 3600 · 15 / (60 · 1000)` = **0,9 kW**.
3. **Depozyt × 1,23:** 2 MWh × 450 zł/MWh × 1,23 = **1 107 zł** (arytmetyka materiału ✅).
4. **Opłata mocowa firmy:** wzrost 0,1413 → 0,2194 zł/kWh = **+55,3%** (arytmetyka ✅).

Przykłady rachunku G/C z pełnymi stawkami powstaną z pliku danych DANE-1 (test spójności z przykładem OSD, jeśli OSD go publikuje).

## Plan ekranów

Role wg standardu 8.11 (artykuł / pochodny / Kreator Pro), wzorce A–H. **FREE/PRO nie jest przypisane (D37).**

**Kreator „Ścieżka przejścia”** (oba kafle, Wzorzec F, postęp zapisany lokalnie). Wejście jest na końcu części Sieć. Kroki:
1. Mój rachunek.
2. Moje zużycie (M2).
3. Ile PV i magazynu (M3/M4).
4. Zima (M7) i agregat (M2/E17).
5. Scenariusze A–D.
6. Ryzyka i procedura.

Na końcu podsumowanie (Wzorzec G).

**M14-D (Dom):**

| ID | Część | Ekran | Rola | Wzorzec |
|---|---|---|---|---|
| D1 | Sieć | Mój rachunek dziś — stałe/zmienne, „cena trzymania sieci” | kalkulator | D |
| D2 | Sieć | Która taryfa G | kalkulator porównawczy | B |
| D3 | Sieć | Moje zużycie miesięcznie | pochodny (M2) | D |
| D8 | Sieć | Net-metering, net-billing, depozyt — co tracę, odchodząc | artykuł + mini-kalkulator | C + D |
| D12 | Sieć | Test licznika i reklamacja — **wspólny** | kalkulator + generator | D + G |
| D13 | Sieć | Dotacje (stan na dzień) | artykuł | C |
| D14 | Sieć | FAQ | artykuł | C |
| D4 | Przejście | Ile PV i magazynu (M3, M4) | pochodny | D |
| D5 | Przejście | Zima bez sieci (M7) | pochodny | G |
| D6 | Przejście | Agregat jako zapas (M2/E17) | pochodny | D |
| D7 | Przejście | Porównanie scenariuszy A–D | kalkulator | G |
| D9 | Przejście | Ryzyka odłączenia — **wspólny** | checklista | E |
| D10 | Przejście | Jak zrezygnować z przyłącza — **wspólny** | artykuł | F |
| D11 | Przejście | Przełącznik sieć/wyspa i bezpieczeństwo — **wspólny** | artykuł + twarde stopy | F + E |

**M14-F (Firma):**

| ID | Część | Ekran | Rola | Wzorzec |
|---|---|---|---|---|
| F1 | Sieć | Mój rachunek dziś (C) | kalkulator | D |
| F2 | Sieć | Porównywarka taryf C | kalkulator | B + G |
| F3 | Sieć | Moc bierna — opłata i kompensacja | kalkulator | D |
| F4 | Sieć | Moc umowna — przekroczenia i optymalny poziom | kalkulator | D |
| F5 | Sieć | Opłata mocowa — przesunięcie poboru | kalkulator | D |
| F6 | Sieć | PV w firmie i autokonsumpcja (M3) | pochodny | D |
| F7 | Sieć | Magazyn (BESS) — strumienie korzyści (M4/E23) | pochodny | D + G |
| F11 | Sieć | Test licznika, reklamacja, badanie — **wspólny z D12** | kalkulator + generator | D + G |
| F12 | Sieć | Dotacje i podatki — informacja, nie porada | artykuł | C |
| F13 | Sieć | FAQ firm | artykuł | C |
| F8 | Przejście | Scenariusze A–D dla firmy (z RF1) | kalkulator | G |
| F9 | Przejście | Ryzyka odłączenia firmy — **wspólny z D9** | checklista | E |
| F10 | Przejście | Procedura i umowy B2B — **wspólny z D10** | artykuł | F |

Numeracja ID ekranów jest przejęta z opracowania §10 bez zmian, dla ciągłości odsyłaczy. Kolejność wierszy odzwierciedla części rozdziału (D35).

**Narzędzia AI** (echo silników, bez własnej fizyki):
- `rozbij_rachunek_za_prad`;
- `porownaj_scenariusze_przejscia`;
- `policz_oplate_za_moc_bierna`;
- `dobierz_taryfe`;
- `oszacuj_koszt_powrotu_do_sieci`.

## Zależności

- **Czyta z:**
  - M1 (PVGIS);
  - M2 (zużycie, E17 agregat);
  - M3 (PV);
  - M4 (magazyn, E23 opłacalność);
  - M6 (pompa ciepła zimą);
  - M7 (stress-test zimowy — warunek D);
  - M8 (przełącznik, ochrona, pożar).
- **Nie blokuje** żadnego innego modułu.
- **Dane:** plik stawek `rozliczenia-pl-2026` (JSON + Zod, okresy ważności — D36) i plik dotacji.

## Wpływ na MVP

Nie jest potrzebny do pierwszej działającej wersji rdzenia off-grid (M1–M8). To moduł **wejścia dla użytkowników podłączonych do sieci** — decyzja właściciela nadaje mu wysoką wartość produktową (D35), ale technicznie da się go bezpiecznie odłożyć za moduły, z których czyta. Część Sieć (D1–D3, F1–F5) jest samodzielna, więc może powstać wcześniej niż część Przejście.

## Stan i bramki

- ~~**Bramka N.3:** kod M14 nie startuje przed zamknięciem pełnego audytu końcowego N.2 całej Biblii.~~ **[28.09.2026] Zdjęta (D50):** audyt końcowy wykonany, decyzje 1–3 wdrożone (D47–D49), pozostałe pytania odłożone przez właściciela i nie blokują M14. Kolejność pracy: `docs/przekazanie-nastepnej-sesji.md`. Audyt przyrostowy N.2 tego rozdziału: `docs/memory.md` (28.09.2026, „Integracja M14 do Biblii”).
- **Kod rachunków — bramka danych DANE-1:**
  - do czasu pełnego pliku danych kalkulatory rachunku działają **wyłącznie w trybie „moje dane z faktury”** (pełnoprawny tryb, D36);
  - jako domyślne wolno wpisać tylko wartości ✅ (Tauron, Energa i Stoen netto; stawki ogólnokrajowe).
  - **[28.09.2026] Plik danych istnieje:** `lib/core/dane/rozliczenia-pl-2026/` (JSON + Zod). Schemat przyjmuje wyłącznie
    `pewnosc: "potwierdzone"`, więc wartość 🔎 nie przejdzie walidacji. PGE, Enea i „inny OSD” są w pliku bez stawek (tryb
    faktury). Nie ma w nim: godzin stref OSD, abonamentu C Tauronu (tab. 7.4), Stoen C22a/C22b, `C_rk`, opłat
    przyłączeniowych — nadal lista „Otwarte — wymaga danych zewnętrznych”.
- **[28.09.2026] Stan kodu:** część Sieć — D1, D2, D8, D12 (= F11), F1–F5 zbudowane (`lib/core/modules/siec/`, ekrany
  `app/kalkulatory/…`, dwa kafle w pulpicie), plus silnik pola „Wzrost cen energii” (D40–D43) z testem przykładu
  kontrolnego §4 (ekran D7/F8 jeszcze nie). Ograniczenia: `dlug-techniczny.md` TD22. Szczegóły: `docs/rejestr-pokrycia.md`.
- **[28.09.2026] Stan kodu — rozdział zbudowany w całości:** reszta części Sieć (D3, D13, D14, F6, F7, F12, F13), cała część
  Przejście (D4–D7, D9–D11, F8–F10) i kreator „Ścieżka przejścia”; oba kafle mają pełną listę ekranów. Silniki:
  `bilans-miesieczny`, `scenariusze-przejscia`, `przelacznik-siec-wyspa`, `koszt-powrotu`, `strumienie-bess`; plik dotacji
  `lib/core/dane/dotacje` (terminy naborów, linki regulaminów puste do odczytu W6). Pięć twardych stopów — w kodzie
  (`docs/rejestr-twardych-stopow.md`). Narzędzia AI — wszystkie pięć z listy wyżej. Uproszczenia: TD23 (bilans miesięczny
  zamiast M7, autokonsumpcja bez W4, stawka przyłączeniowa od użytkownika). Bramka DANE-1 i lista „Otwarte” bez zmian.

### Otwarte — wymaga danych zewnętrznych

- **W3-PGE** — taryfa PGE Dystrybucja 2026. Serwer ma niepełny łańcuch TLS, więc PDF musi dostarczyć właściciel.
- **W3-Enea netto** — pełna taryfa jest skanem; do odczytu wizualnego.
- **Stoen C22a/C22b** — przypisanie kolumn tabeli 7.3 do odczytu wizualnego.
- **W4** — standardowe profile zużycia G11/C11 (IRiESD OSD), potrzebne dla D38.
- **W6** — regulamin Przydomowych Magazynów Energii (NFOŚiGW). Serwer ma niepełny łańcuch TLS, więc PDF musi dostarczyć właściciel.
- **Wartość `C_rk`** — komunikat Prezesa URE.
- **Stawki opłaty przyłączeniowej IV–VI** — są w taryfach, do wyciągnięcia przy pliku danych.
- **Średnia cena G 495,16 zł/MWh** — 🔎A, do odczytu pierwotnego.
- **Nowsza projekcja cen UE** — sprawdzać, czy KE opublikowała *EU Reference Scenario 2025* (lub nowszy). Jeśli tak, podmienić „Ścieżkę UE” (D40).

### Otwarte — wymaga decyzji

- ~~Pozycja dwóch kafli na pulpicie~~ — **rozstrzygnięte 28.09.2026 (D39):** na końcu, za kaflem 13, a później preset onboardingu.
- ~~Parametry domyślne TCO~~ — **rozstrzygnięte 28.09.2026 (D40):** `N` = 15 (10–25), `r` = 0, `g` = 0 plus suwak plus „Ścieżka UE”.
- **FREE/PRO dla M14** — odłożone (D37), wraca osobną decyzją.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 28.09.2026 | Utworzono — integracja opracowania M14 na polecenie właściciela („Integruj teraz”, F.2/F.4). Decyzje D35–D38. Wersja 1.0. |
| 28.09.2026 | Decyzje właściciela: pozycja kafli (D39); parametry TCO plus „Ścieżka UE” z EU Reference Scenario 2020, odczyt pierwotny arkusza KE (D40). Zdanie „nie prognozuje cen energii” doprecyzowane: aplikacja sama nie prognozuje, pokazuje projekcję UE ze źródłem i datą. Wersja 1.0→1.1. |
| 28.09.2026 | D41: opcja „Ścieżka UE + inflacja” (Fisher). π = cel NBP 2,5% (M.P. 2025 poz. 1013, domyślne ✅🤖) albo średnia GUS z 15 lat 3,58% albo własna. Inflacja stosowana do wszystkich kosztów bieżących; ranking według złotych dzisiejszych. Przykład kontrolny. Wersja 1.1→1.2. |
| 28.09.2026 | D42: przełącznik ścieżek cen („Suwak %” / „Plany UE” / „Plany UE + inflacja”) w miejscu suwaka procentów na D7/F8. Wersja 1.2→1.3. |
| 28.09.2026 | D43: domyślna inflacja w „Plany UE + inflacja” = średnia GUS z 15 lat 3,58% (decyzja właściciela); NBP 2,5% zostaje do wyboru. Przykład kontrolny uzupełniony o wiersz GUS. Wersja 1.3→1.4. |
| 28.09.2026 | D47: szczegół przełącznika w D11 zamiast „🔎 w M8”; D48: przełącznik agregatu zawsze (sieć i bez sieci), stopy w M2/E17 i M7/E8. Wersja 1.4→1.5. |
| 28.09.2026 | D50: bramka N.3 zdjęta — kod M14 może startować (od pliku danych `rozliczenia-pl-2026`, bramka DANE-1 dalej obowiązuje). Wersja 1.5→1.6. |
| 28.09.2026 | Start kodu M14 (po D50): plik danych `rozliczenia-pl-2026`, część Sieć D1, D2, D8, D12/F11, F1–F5, silnik ścieżki cen. Treść rozdziału bez zmian — dopisany tylko stan w „Stan i bramki”. Wersja 1.6→1.7. |
| 28.09.2026 | Zamknięcie kodu rozdziału: reszta części Sieć, część Przejście, kreator, kafle. Treść rozdziału bez zmian — dopisany tylko stan w „Stan i bramki”. Wersja 1.7→1.8. |
