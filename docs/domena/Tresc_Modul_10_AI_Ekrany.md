# Moduł 10 (Kafel 10): AI i prognozy — treść ekranów

**Etap 3 — kontynuacja.** Ósmy w pełni opisany moduł treściowy. Zgodnie z audytem §23 Zasad UX, duża część z 50 "funkcji AI" to nie osobne ekrany, tylko właściwości działania systemu w tle. Jedna korekta względem §23: dawne 12.37 okazało się **realną funkcją** ("mission_critical_ai" — nadrzędny priorytet ciepło/woda/powietrze), a nie tylko hasłem marketingowym, jak wcześniej błędnie założyłem po samym tytule. Poprawione poniżej.

---

## EKRAN 1: Prognozy — RAPORT
*(scala dawne: 12.1, 12.2, 12.3, 12.4, 12.5, 12.43 — Wzorzec G)*

To jest interfejs użytkownika dla silnika symulacji rocznej (§15.1) i prognozy pogody live (§15.3) z Zasad UX — nie osobny kalkulator, tylko wizualizacja tego, co te dwa fundamenty już obliczyły.

**Zakładki/sekcje ekranu:**
- **Produkcja PV 24h** (dawne 12.1): prognoza godzinowa na podstawie pogody i historii.
- **Zużycie 24h** (dawne 12.2): prognoza na podstawie profilu dobowego, dnia tygodnia, planowanych zadań.
- **Produkcja miesięczna** (dawne 12.3): trend 1-12 miesięcy naprzód, z uwzględnieniem degradacji paneli.
- **SoC baterii** (dawne 12.4): symulacja stanu baterii w kolejnych 24-72h.
- **Szczyty zapotrzebowania** (dawne 12.5): przewidywane momenty i wielkość szczytów (poranny/wieczorny).
- **Wizualizacja zbiorcza** (dawne 12.43): interaktywna oś czasu łącząca wszystkie powyższe — kiedy bateria się ładuje, kiedy rośnie zużycie, kiedy warto uruchomić odbiornik elastyczny.

**D:** *"To jest 'pogoda' Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile będziesz mieć prądu, ile zużyjesz, i kiedy będzie ciasno."*

---

## EKRAN 2: Jak AI się uczy — TRANSPARENTNOŚĆ
*(scala dawne: 12.6, 12.19, 12.24, 12.39, 12.40, 12.44, 12.45, 12.49, 12.50 — Wzorzec C)*

**Ważne:** 9 dawnych funkcji opisywało nie osobne działania AI, tylko **własność tego, jak AI działa w tle** — uczenie wzorców, personalizację rekomendacji, samokorektę modeli po błędach. To nie wymaga 9 ekranów, tylko jednego miejsca transparentności, gdzie user może zobaczyć, że i jak system się uczy, bez potrzeby codziennej interakcji z tym procesem.

**Zawartość ekranu:**
- Czego AI się nauczyło o Twoim gospodarstwie domowym (wzorce zużycia, sezonowość, preferencje temperaturowe)
- Historia samokorekt modeli (np. "AI poprawiło prognozę zużycia po zaobserwowaniu nowego urządzenia")
- Opcja: "zapomnij i zacznij uczenie od nowa" (reset modelu, jeśli np. zmienił się skład domowników)

**D:** *"AI w tle cały czas dostraja się do Twojego domu — to nie jest coś, co robisz Ty, tylko coś, co dzieje się dla Ciebie. Ten ekran pokazuje, co już zauważyło."*

---

## EKRAN 3: Priorytet misji — ciepło, woda, powietrze
*(dawne 12.37 — Wzorzec D — korekta: to realna funkcja, nie tylko hasło)*

**A:** monitoring wszystkich krytycznych systemów (ogrzewanie, woda, wentylacja — auto ze wszystkich modułów), historia awarii.
**B:** nadrzędna zasada priorytetów: AI wykrywa zagrożenie dla jednego z trzech zasobów krytycznych (ciepło/woda/powietrze) i automatycznie nadaje mu najwyższy priorytet nad wszystkimi innymi celami systemu — przełącza źródła energii, ogranicza zużycie niekrytyczne, aktywuje systemy zapasowe.
**C:** *"Priorytet misji: ciepło, woda, powietrze — wszystko w normie."*
🔴 *"Zagrożenie dla ogrzewania! AI przełącza zasilanie na agregat i ogranicza zużycie prądu."*
**D:** *"To pierwsza zasada systemu — reszta (komfort, oszczędność, wygoda) może poczekać, ale nie ciepło, woda i powietrze. To jest właśnie różnica między 'inteligentnym domem' a systemem podtrzymania życia."*

---

## EKRAN 4: Automatyczny dobór i optymalizacja źródeł zasilania
*(scala dawne: 12.7, 12.8, 12.9 — Wzorzec D)*

### Sekcja A
produkcja PV (live), SoC baterii, koszty paliwa agregatu, prognozy (Ekran 1), pojemność baterii i limity C-rate (cross-ref Moduł 4).

### Sekcja B — trzy powiązane decyzje AI
1. **Wybór źródła w danej chwili** (dawne 12.7): PV gdy świeci słońce → bateria gdy brak słońca → agregat/sieć w ostateczności, zgodnie z hierarchią z Modułu 4, Ekran 32.
2. **Optymalizacja ładowania z PV** (dawne 12.8): szybkie ładowanie przy dużej produkcji, ograniczenie prądu przy niskiej temperaturze ogniw (cross-ref Moduł 4, Ekran 12).
3. **Optymalizacja zużycia wg prognoz** (dawne 12.9): przesuwanie elastycznych zadań (pranie, ładowanie EV) na godziny szczytu produkcji PV.

### Sekcja C
*"System automatycznie wybiera PV jako główne źródło, ładuje baterię z ograniczeniem prądu przy niskiej temperaturze, i planuje uruchomienie pralki na 12:00, gdy prognozowana jest szczytowa produkcja."*

### Sekcja D
*"To jest wykonawcza warstwa AI dla zasad, które ustaliłeś ręcznie w Module 4 — system nie wymyśla nowej hierarchii, tylko realizuje ją inteligentnie, uwzględniając prognozy."*

---

## EKRAN 5: Dynamiczne przesuwanie zadań domowych
*(dawne 12.10 — Wzorzec D)*

**A:** prognozy produkcji PV (Ekran 1), lista zadań oczekujących (pranie, zmywanie, ładowanie EV), preferencje użytkownika (np. "pranie musi być gotowe do 18:00").
**B:** AI ustala kolejność i czas wykonania zadań, biorąc pod uwagę zarówno dostępność energii, jak i ograniczenia czasowe użytkownika — nie przesuwa zadania poza akceptowalne okno, nawet jeśli energetycznie byłoby to optymalne.
**C:** *"Pranie uruchomione o 11:30 (szczyt produkcji PV), gotowe na 13:00 — mieści się w Twoim wymaganym terminie 18:00."*
**D:** *"AI szuka najlepszego momentu energetycznego, ale zawsze w granicach tego, co Ci pasuje — nie zmusi Cię do czekania na pranie do wieczora, jeśli powiedziałeś, że potrzebujesz go wcześniej."*

---

## EKRAN 6: Rekomendacje i raporty z komentarzem AI
*(scala dawne: 12.11, 12.42 — Wzorzec G)*

**A:** historia pracy systemu, zużycia, produkcji, stanu baterii.
**B:** AI analizuje, które ustawienia można poprawić (dawne 12.11), i generuje raporty dobowe/tygodniowe/miesięczne z komentarzem tłumaczącym liczby, nie tylko suchymi danymi (dawne 12.42).
**C:** *"W tym tygodniu zużyłeś o 15% więcej energii niż zwykle — głównie z powodu częstszego grzania wody. Rozważ obniżenie temperatury bojlera o 5°C w dni bez gości."*
**D:** *"Zamiast tabeli liczb, dostajesz zdanie po polsku, które tłumaczy, co się stało i dlaczego — to jest różnica między danymi a zrozumieniem."*

---

## EKRAN 7: Wykrywanie anomalii
*(scala dawne: 12.13, 12.14, 12.15, 12.16, 12.17, 12.18 — Wzorzec D, jeden ekran z selektorem podsystemu)*

Sześć dawnych funkcji to ten sam mechanizm (porównaj rzeczywistość z oczekiwaniem, wykryj odchylenie) zastosowany do różnych podsystemów — jeden ekran, wybór podsystemu z listy.

| Podsystem | Co wykrywa | Przykład |
|---|---|---|
| Produkcja PV (12.13) | nagły/stopniowy spadek względem oczekiwanej dla warunków | *"Produkcja o 20% niższa niż oczekiwana przy tym nasłonecznieniu — sprawdź zabrudzenie lub zacienienie."* |
| Zużycie energii (12.14) | nietypowy wzrost/spadek, zużycie w dziwnych porach | *"Zużycie w nocy wzrosło o 40% — sprawdź, czy jakieś urządzenie nie zostało włączone."* |
| Falownik (12.15) | rosnąca temperatura, spadek sprawności, nietypowe harmoniczne — predykcja awarii | *"Temperatura falownika rośnie systematycznie od tygodnia — zaplanuj przegląd, zanim dojdzie do awarii."* |
| Bateria (12.16) | wzrost rezystancji, spadek pojemności, rozjazd napięć ogniw | cross-ref Moduł 4, Ekran 14 (SoH) — to jest live-monitoring tego samego mechanizmu |
| Przyczyny spadku produkcji (12.17) | analiza kaskadowa: pogoda→brud→śnieg→cień→uszkodzenie, w tej kolejności | *"Spadek produkcji nie wynika z pogody ani brudu — prawdopodobne uszkodzenie stringu 2, zalecana kontrola."* |
| Pompy i wentylacja (12.18) | wibracje, przegrzewanie, spadek przepływu | *"Pompa cyrkulacyjna wykazuje zwiększone wibracje od 3 dni — możliwe zużycie łożyska."* |

**D:** *"AI porównuje to, co się dzieje, z tym, co powinno się dziać w danych warunkach — różnica między tymi dwiema rzeczami to najwcześniejszy sygnał, że coś jest nie tak, zanim stanie się to poważną awarią."*

---

## EKRAN 8: AI ogrzewania, wody i wentylacji
*(scala dawne: 12.20, 12.21, 12.22 — Wzorzec D)*

### Sekcja A
temperatura wewnętrzna/zewnętrzna (live), prognozy pogody, obecność domowników, czujniki CO2/wilgotności (Moduł 9), historia zużycia CWU.

### Sekcja B — trzy powiązane systemy
1. **Prognoza CWU** (dawne 12.20): przewidywane zapotrzebowanie na ciepłą wodę w kolejnych 24h na podstawie historii i planowanych zadań.
2. **Adaptacyjne ogrzewanie** (dawne 12.21): uczenie się, jak budynek reaguje na zmiany, dostrajanie krzywej grzewczej (cross-ref Moduł 6, Ekran 5).
3. **Inteligentna wentylacja** (dawne 12.22): sterowanie rekuperacją i wentylatorami dla utrzymania jakości powietrza przy minimalnym zużyciu energii.

### Sekcja C
*"Jutro rano przewidywane większe zużycie CWU (weekend, więcej domowników) — bojler zacznie grzać wcześniej, wykorzystując nadwyżkę PV z rana."*

### Sekcja D
*"To AI-owa warstwa nad systemami z Modułu 6 — nie zmienia fizyki ogrzewania, tylko dostraja moment i intensywność pracy do rzeczywistych, zmieniających się warunków."*

---

## EKRAN 9: AI wody
*(scala dawne: 12.25, 12.26, 12.27, 12.28, 12.29, 12.30, 12.46, 12.47, 12.48 — Wzorzec D, jeden ekran z zakładkami tematycznymi)*

Dziewięć dawnych funkcji to kompleksowy system zarządzania wodą — jeden ekran z zakładkami zamiast dziewięciu osobnych.

**Zakładka "Prognoza i bilans"** (dawne 12.25, 12.26, 12.30): prognoza opadów i uzysku deszczówki, bieżący bilans (ile mamy/zużywamy/przybędzie), predykcja zużycia dobowego z rozbiciem godzinowym.

**Zakładka "Doradca zużycia"** (dawne 12.27): rekomendacje dot. prysznica/pralki/toalety na podstawie bilansu i priorytetów — *"Zbiornik na 60%, prognoza sucha na tydzień — ogranicz podlewanie ogrodu."*

**Zakładka "Ścieki i zrzut"** (dawne 12.28): zarządzanie zrzutem z oczyszczalni przed spodziewanym deszczem, żeby nie przepełnić systemu.

**Zakładka "Uczenie wzorców"** (dawne 12.29): identyfikacja typowych czynności (prysznic, kąpiel, pranie) z historii przepływu — feeds do zakładki prognozy.

**Zakładka "Jakość i przecieki"** (dawne 12.46, 12.47): monitoring mętności/pH/chloru wody oraz jakości powietrza; wykrywanie ciągłego, niewyjaśnionego przepływu jako sygnału przecieku.

**Zakładka "Rekomendacje modernizacji"** (dawne 12.48): identyfikacja słabych punktów systemu wodnego na podstawie zebranych danych.

**D:** *"Woda w off-gridzie to osobny, kompletny system — od nieba przez zbiornik, kran, kanalizację, z powrotem do gruntu. AI pilnuje całego cyklu naraz, nie tylko jednego punktu."*

---

## EKRAN 10: AI zimowego ryzyka
*(scala dawne: 12.31, 12.32, 12.33 — Wzorzec D)*

**A:** prognozy pogody (opady śniegu, temperatura, wiatr — cross-ref Moduł 7), historia produkcji podczas opadów/oblodzenia, stan baterii.
**B:** trzy powiązane prognozy: burze śnieżne i oblodzenie paneli (12.31), czy opłaca się odśnieżać w danej sytuacji (12.32, uwzględnia dostępność, koszt czasu/wysiłku vs zysk produkcji), deficyt energii w nadchodzącym mrozie (12.33, feeds z Modułu 7).
**C:** *"Prognozowane oblodzenie jutro rano. Odśnieżanie nie opłaca się — mróz i tak ograniczy produkcję do 15%. Zaplanuj deficyt 20 kWh — uruchom agregat profilaktycznie wieczorem."*
**D:** *"To AI-owe przedłużenie stress-testów zimowych z Modułu 7 — te same symulacje, ale aktualizowane na bieżąco realną prognozą, nie tylko danymi historycznymi."*

---

## EKRAN 11: AI zarządzania generatorem
*(scala dawne: 12.34, 12.35 — Wzorzec D)*

**A:** harmonogram przeglądów, prognozy pogody, historia pracy generatora/webasto, zapotrzebowanie i SoC.
**B:** proaktywne sprawdzanie (dawne 12.34) — gdy prognozowane są niskie temperatury, AI inicjuje testowy rozruch generatora z wyprzedzeniem, żeby wykryć problem, zanim będzie krytycznie potrzebny; autonomiczne zarządzanie (dawne 12.35) — AI decyduje samodzielnie, kiedy uruchomić generator na podstawie SoC, prognoz PV i kosztu paliwa.
**C:** *"Prognozowane −20°C za 3 dni. AI uruchomiła testowy rozruch generatora dziś — wykryto problem z akumulatorem rozruchowym. Masz czas na naprawę przed mrozem, zamiast odkryć to w potrzebie."*
**D:** *"Lepiej odkryć, że generator nie startuje, w spokojny wtorek, niż w środku śnieżycy, gdy jest jedynym źródłem prądu."*

---

## EKRAN 12: Generalny audyt zimowy — RAPORT
*(dawne 12.36 — Wzorzec G)*

Ekran generowany na początku sezonu zimowego, agregujący kompletną listę kontrolną: test generatora, test webasto, przegląd instalacji grzewczej, sprawdzenie zapasów paliwa, weryfikacja grzałek BMS.
**Przykład:** *"Audyt zimowy 2026: 8/10 punktów gotowych. Braki: test webasto zaplanowany, ale nie wykonany; zapas paliwa poniżej zalecanego minimum."*
Cross-ref: Moduł 7, Ekran 12 (Współczynnik Bezpieczeństwa Zimowego) — to dwa różne raporty patrzące na to samo zagadnienie z różnych stron (audyt zadaniowy vs wskaźnik ryzyka).

---

## Funkcje niebędące osobnymi ekranami

- **12.12 (Ocena opłacalności magazynowania energii, AI)** → duplikat 3.25 w Module 4 (True Cost of Storage). Nie tworzy nowego ekranu.
- **12.23 (Wykrywanie zagrożeń pożarowych i zwarciowych)** → duplikat 12.53, już w Module 8, Ekran 9.
- **12.38 (Interaktywne symulacje "co by było gdyby")** → to jest dokładnie §14.1 Zasad UX (Symulator awarii), już opisane jako gamechanger. Nie duplikować.

## Funkcja wymagająca osobnej specyfikacji interakcji

- **12.41 (Asystent głosowy)** — Wzorzec D nie pasuje, bo to inny kanał interakcji (głos, nie ekran dotykowy). Kluczowe dane z oryginału: rozpoznaje intencję z pytań typu "Jaki jest stan baterii?", może **sam inicjować rozmowę** przy zagrożeniu ("Uwaga, zbliża się burza. Zamknij okna i sprawdź generator."), uczy się stylu wypowiedzi użytkownika. To wymaga osobnej specyfikacji projektowej (drzewo intencji, obsługa niejednoznaczności głosowej) na etapie 3, nie mieści się w czterosekcyjnym szablonie Doradcy.

---

## Podsumowanie modułu

**12 ekranów** (1 raport zbiorczy prognoz, 1 ekran transparentności AI, 1 priorytet misji, 8 tematycznych Doradców/raportów, 1 funkcja oznaczona do osobnej specyfikacji głosowej), pokrywających wszystkie 50 pierwotnych funkcji tego rozdziału — 74% redukcji, największa w całym dokumencie.

---

**Wersja:** 1.0 — pełna treść Modułu 10 (Etap 3), z korektą kategoryzacji 12.37 względem wcześniejszego audytu §23
**Data:** Sierpień 2026
**Status:** Wszystkie 12 ekranów gotowe do przekazania deweloperowi. Asystent głosowy (12.41) wymaga dodatkowej specyfikacji interakcji przed implementacją.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md, Tresc_Modul_6_Ogrzewanie_Ekrany.md, Tresc_Modul_7_StressTest_Ekrany.md, Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Tresc_Modul_9_ESP32_Ekrany.md
