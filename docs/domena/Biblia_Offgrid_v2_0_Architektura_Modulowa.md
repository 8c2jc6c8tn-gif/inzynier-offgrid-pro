# BIBLIA OFF-GRID PV — v2.0 (Architektura Modułowa / Pulpit 14 kafli)

---

**Tytuł:** Biblia Off-Grid PV – Specyfikacja Techniczna, wersja zreorganizowana pod pulpit aplikacji
**Wersja:** 2.0 (reorganizacja v1.5)
**Data:** Sierpień 2026
**Zasada nadrzędna:** Żadna funkcja z v1.5 nie została usunięta. Funkcje zduplikowane lub tworzące jeden powtarzalny wzorzec zostały **scalone w moduły zbiorcze** (z zachowaniem pełnej treści każdej pozycji jako pod-punktu), a nie skasowane. Każda pozycja ma przypisany dawny numer (v1.5) dla identyfikowalności.

---

## Zasady architektury (bez zmian względem v1.5)

1. **Migawki (Tooltips):** Każda funkcja ma przycisk `[ i ]` — dymek "po ludzku" + zakładka "Fizyka" ze wzorem.
2. **Tryb Inżyniera:** domyślnie prosty tryb (suwaki, kafle); przełącznik w ustawieniach odblokowuje widoki zaawansowane.
3. **Powiązania Bloków:** funkcje wymieniają dane między sobą (pole „Powiązania” przy każdej funkcji, gdzie występuje w źródle).
4. **Integralność:** żadna funkcja nie ginie przy reorganizacji — patrz Załącznik D: Tabela mapowania v1.5 → v2.0.

---

## Struktura pulpitu — 14 kafli

| # | Kafel | Zawartość (dawne rozdziały) | Liczba funkcji |
|---|-------|------------------------------|-----------------|
| 1 | Lokalizacja i teren | Rozdz. 0 | 4 |
| 2 | Zapotrzebowanie energetyczne | Rozdz. 1 (+ moduł zbiorczy wampirów) | 27 pozycji / 50 funkcji |
| 3 | Instalacja PV | Rozdz. 2 | 50 |
| 4 | Magazyn energii / baterie | Rozdz. 3 | 39 |
| 5 | Okablowanie i zabezpieczenia | Rozdz. 4 (MC4 scalone) | 39 pozycji / 40 funkcji |
| 6 | Ogrzewanie / wentylacja / pompa ciepła | Rozdz. 5 (+ silnik analiz czynników) | 27 pozycji / 100 funkcji |
| 7 | Stress-test zimowy | Rozdz. 6 (minus 2 do kafla 8) | 38 |
| 8 | Bezpieczeństwo i sytuacje awaryjne | zebrane z Rozdz. 6, 11, 12 | 15 |
| 9 | Elektronika / ESP32 / sensoryka | Rozdz. 11 (minus 6 do kafla 8) | 50 |
| 10 | AI i prognozy | Rozdz. 12 (minus 7 do kafla 8) | 50 |
| 11 | Montaż baterii | Rozdz. 9 + 10 scalone (wybór chemii) | 40 |
| 12 | Szybki kalkulator / tryb mobilny | Rozdz. 8 (2 moduły zbiorcze) | 58 pozycji / 70 funkcji |
| 13 | **Tryb Live** (warstwa, nie treść) | Rozdz. 7 | 33 |
| 14 | Ustawienia / Tryb Inżyniera / Pomoc | Załączniki A, B, C + notatki systemowe | — |

**Suma funkcji zachowanych: 579** (tyle unikalnych pozycji faktycznie istniało w treści v1.5 — metryczka dokumentu źródłowego podawała 540, co było nieaktualne względem rzeczywistej zawartości; patrz uwaga w Metryczce na końcu).

---

## Moduł 1 (Kafel 1): Lokalizacja i teren

*Bez zmian względem v1.5 — dawny Rozdział 0.*

### 1.1. GPS i pobranie lokalizacji / warunków klimatycznych  *(dawne 0.1)*

  
**Skąd czerpie dane:**  
- Online: GPS urządzenia, adres lub numer działki – zewnętrzne API geolokalizacyjne (np. Geoportal).  
- Offline: użytkownik wprowadza współrzędne ręcznie lub korzysta z zapisanych punktów.  
- Dodatkowo pobiera dane nasłonecznienia z bezpłatnych baz **PVGIS** lub **PVWatts** (jednorazowe zapytanie przez API przy tworzeniu projektu).  
  
**Gdzie ląduje:**  
- W bazie danych projektu jako rekord `project_location` (szerokość, długość, strefa klimatyczna, średnie temperatury miesięczne, strefa wiatrowa, strefa śniegowa, głębokość przemarzania).  
- Pobrane dane nasłonecznienia (miesięczne kWh/m²) zapisywane są w tabeli `solar_radiation_data` i przechowywane lokalnie – aplikacja działa offline po pierwszym pobraniu.  
  
**Jak działa logika:**  
- Silnik przelicza kąt padania promieni słonecznych dla każdego dnia roku na podstawie szerokości geograficznej.  
- Określa strefę wiatrową i śniegową – wykorzystywane w modułach naporu wiatru i obciążenia śniegiem.  
- Pobiera absolutne minima temperaturowe (np. –30°C) do stress‑testów zimowych.  
  
**Efekt na ekranie:**  
- Mapa z pinezką lokalizacji oraz **„karta klimatyczna regionu”**: średnia roczna temperatura, strefa mrozowa, wykres nasłonecznienia miesięcznego (np. grudzień ma 5× mniej słońca niż czerwiec).

---

### 1.2. Skaner działki – tryb online (Geoportal) i offline (spacer GPS)  *(dawne 0.2)*

  
**Skąd czerpie dane:**  
- Online: połączenie z państwowymi bazami GIS – pobiera granice działki, obrysy budynków, wysokości.  
- Offline: użytkownik przechodzi w każdy róg działki i klika „Zapisz punkt”; robi to samo dla rogów budynku.  
- Kalibracja: użytkownik wpisuje znany wymiar (np. długość ściany 12 m), aby skorygować błąd GPS.  
  
**Gdzie ląduje:**  
- W lokalnej bazie danych jako model przestrzenny – zbiór punktów (X,Y,Z) tworzących kontur działki, budynków, altan, ogrodzeń, drzew.  
  
**Jak działa logika:**  
- Na podstawie punktów aplikacja tworzy **cyfrowy model terenu (DTM)** i **bryłę budynku**.  
- Wyznacza azymut każdej ściany, kąt nachylenia połaci dachowych, wysokość kalenicy.  
- Wykrywa potencjalne przeszkody (drzewa, sąsiednie budynki) do późniejszej analizy zacienienia.  
  
**Efekt na ekranie:**  
- Interaktywny widok 2D/3D działki z naniesionymi elementami.  
- Użytkownik może obracać modelem i przeglądać poszczególne płaszczyzny (dach, ogrodzenie, grunt).

---

### 1.3. Analiza zacienienia (horyzont cieni)  *(dawne 0.3)*

  
**Skąd czerpie dane:**  
- Z modelu 3D (wysokości przeszkód, odległości od potencjalnych miejsc montażu).  
- Z danych astronomicznych (trajektoria słońca dla danej szerokości geograficznej).  
  
**Gdzie ląduje:**  
- W tabeli `shading_analysis` – dla każdej płaszczyzny montażowej zapisywany jest procentowy ubytek promieniowania w poszczególnych miesiącach oraz w ciągu dnia.  
  
**Jak działa logika:**  
- Algorytm dla każdej godziny dnia, w każdym miesiącu, sprawdza, czy promień słońca jest zasłaniany przez przeszkodę.  
- Uwzględnia wzrost drzew w perspektywie kilku lat (użytkownik wprowadza prognozowaną wysokość).  
- Oblicza całkowitą roczną stratę energii spowodowaną cieniem.  
  
**Efekt na ekranie:**  
- Mapa cieplna na modelu 3D – kolorowe obszary pokazują, które fragmenty są najbardziej zacienione.  
- Ostrzeżenie: *„Południowo‑wschodni narożnik dachu jest zacieniony przez drzewo – strata ok. 12% rocznie. Rozważ montaż na zachodniej połaci.”*

---

### 1.4. Bryła budynku i orientacja ścian  *(dawne 0.4)*

  
**Skąd czerpie dane:**  
- Z modelu przestrzennego (pkt. 0.2) – automatycznie wyznacza azymuty i kąty nachylenia wszystkich połaci dachowych oraz ścian.  
  
**Gdzie ląduje:**  
- W tabeli `building_surfaces` – każda powierzchnia ma identyfikator, typ (dach, ściana, ogrodzenie), azymut, kąt nachylenia, wysokość, szerokość.  
  
**Jak działa logika:**  
- Użytkownik może ręcznie korygować parametry (np. gdy budynek nie jest idealnie prostopadły).  
- System automatycznie sugeruje, które powierzchnie są **najbardziej opłacalne** do montażu PV (najlepszy azymut i kąt).  
  
**Efekt na ekranie:**  
- Lista wszystkich powierzchni z wskaźnikiem **„opłacalność PV”** (np. *Dach południowy: 94%, Elewacja wschodnia: 62%*).  
- Użytkownik może zaznaczać powierzchnie, które rozważa pod montaż.  
  
---  
  
## Rozdział 1: Bilans zapotrzebowania i obciążeń elektrycznych

---

## Moduł 2 (Kafel 2): Zapotrzebowanie energetyczne

*Dawny Rozdział 1. Pozycje 1.24 oraz 1.28–1.50 (24 funkcje) opisywały ten sam temat — pobór standby/"wampiry energetyczne" — rozbity na osobne ekrany. Scalono w jeden moduł zbiorczy z zachowaną każdą pozycją jako pod-punktem.*

### 2.1. Systemy podtrzymania życia (Survival Core)  *(dawne 1.1)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza ręcznie lub wybiera z listy: pompa głębinowa/hydrofor, przepompownia ścieków, ogrzewanie, wentylacja (rekuperacja), monitoring, router.  
- Domyślnie aplikacja proponuje typowe moce godzinowe (np. pompa 800 W, przepompownia 400 W, rekuperator 80 W, router 15 W, kamery 20 W).  
  
**Gdzie ląduje:**  
- W tabeli `critical_loads` – każdy wpis ma moc (W), czas pracy (h), priorytet (1 – krytyczny), sezonowość (całoroczny).  
  
**Jak działa logika:**  
- System sumuje zużycie dobowe tych urządzeń i wyświetla je jako **„żelazne minimum”** – bez nich dom nie funkcjonuje.  
- Gdy użytkownik próbuje odznaczyć któryś z nich, pojawia się ostrzeżenie: *„Bez pompy głębinowej nie będziesz miał wody w kranie.”*  
  
**Efekt na ekranie:**  
- Wydzielona sekcja z czerwonym/zielonym paskiem – oznaczona jako **„Systemy krytyczne – zawsze zasilane”**.  
- Obok każdego elementu podana jest moc godzinowa oraz dobowe zużycie kWh.

---

### 2.2. Inteligentny bojler C.W.U. (dwukomorowy, samouczący się)  *(dawne 1.2)*

  
**Skąd czerpie dane:**  
- Użytkownik wpisuje pojemność bojlera (np. 200 l), moc grzałki (np. 2 kW), liczbę domowników (wpływa na profil zużycia C.W.U.).  
- Z poprzedniego kroku (1.1) pobierana jest liczba domowników.  
  
**Gdzie ląduje:**  
- W tabeli `thermal_storage` – zapisywana jest pojemność cieplna, moc grzałki, harmonogram ładowania, temperatura zadana.  
  
**Jak działa logika:**  
- Bojler traktowany jest jako **magazyn ciepła**, a nie zwykły odbiornik.  
- System planuje ładowanie wyłącznie wtedy, gdy produkcja PV przekracza bieżące zapotrzebowanie i akumulator jest naładowany >90% – energia, która i tak by się zmarnowała, jest kierowana do grzania wody.  
- Dwukomorowa konstrukcja i dobra izolacja (ok. 1700–1900 zł) pozwalają utrzymać ciepło przez wiele godzin.  
  
**Efekt na ekranie:**  
- W sekcji bojlera użytkownik widzi wykres: *„Dzisiaj zaplanowano 2 cykle grzania (12:30 i 15:45) – łącznie 4 kWh z nadwyżek PV.”*  
- Alert: *„Nie zalecamy grzania bojlera po zmroku – zużyjesz drogi prąd z akumulatora.”*

---

### 2.3. Urządzenia zmienne (AGD/RTV) – lista i konfiguracja  *(dawne 1.3)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera z predefiniowanej listy (pralka, zmywarka, lodówka, czajnik, mikrofalówka, laptop, telewizor, oświetlenie itp.).  
- Dla każdego urządzenia aplikacja podaje domyślną moc (W) i typowy czas pracy (h/dobę) – użytkownik może to zmienić.  
  
**Gdzie ląduje:**  
- W tabeli `variable_loads` – każdy wpis: nazwa, moc, czas pracy, pora dnia (dzień/noc/równomiernie), sezonowość (całoroczny/lato/zima/weekend), priorytet (2 – komfort / 3 – nadwyżkowy), klasa energetyczna.  
  
**Jak działa logika:**  
- Dla każdego urządzenia oblicza zużycie dobowe (kWh) = moc × czas.  
- Jeśli urządzenie ma silnik, system automatycznie dodaje **prąd rozruchowy** (5‑6×) oraz uwzględnia **cos φ** (moc pozorną VA).  
- Klasy energetyczne: przełącznik (nowoczesne / standardowe / stare) dodaje mnożnik (×0,8 / ×1,0 / ×1,4) do zużycia.  
  
**Efekt na ekranie:**  
- Przejrzysta lista z filtrami po kategoriach.  
- Obok każdego urządzenia widoczny udział w dobowym bilansie (kWh) oraz w szczycie mocy (W).  
- Podsumowanie: *„Wybrane urządzenia zużyją dziennie łącznie 8,2 kWh, w szczycie mogą pobrać 4,8 kW (z prądami rozruchowymi 7,5 kW).”*

---

### 2.4. Płyta indukcyjna – osobny wybór  *(dawne 1.4)*

  
**Skąd czerpie dane:**  
- Użytkownik zaznacza, czy w domu jest płyta indukcyjna, czy kuchenka gazowa. Jeśli indukcja – podaje moc palników (np. 7 kW) i średni czas gotowania dziennie.  
  
**Gdzie ląduje:**  
- W tabeli `cooking_load` jako osobny rekord o wysokim priorytecie (obciążenie szczytowe).  
  
**Jak działa logika:**  
- Indukcja to jeden z największych odbiorników – jej uruchomienie może dać skok 5‑7 kW.  
- System uwzględnia ten skok przy doborze falownika (moc znamionowa i przeciążalność).  
- Jeśli wybrano gaz, obciążenie to jest pomijane (ale uwzględniany jest zapłon i wentylacja).  
  
**Efekt na ekranie:**  
- Wyraźny przycisk: *„Sposób gotowania: [Indukcja] [Gaz]”*.  
- Przy indukcji: *„Uruchomienie 3 palników to skok 5,5 kW – upewnij się, że falownik wytrzyma przeciążenie.”*

---

### 2.5. Klasa energetyczna i wiek sprzętów  *(dawne 1.5)*

  
**Skąd czerpie dane:**  
- Użytkownik dla każdego urządzenia (lub globalnie) wybiera: *Nowoczesne (A+++)*, *Standardowe (5‑10 lat)*, *Stare (>10 lat)*.  
  
**Gdzie ląduje:**  
- Jako pole `efficiency_class` w tabeli `variable_loads`.  
  
**Jak działa logika:**  
- Do zużycia energii dodawany jest mnożnik:  
  - Nowoczesne: ×0,8  
  - Standardowe: ×1,0  
  - Stare: ×1,3–1,5  
- Mnożnik stosowany jest zarówno do mocy, jak i do czasu pracy.  
  
**Efekt na ekranie:**  
- Przy każdej zmianie aktualizuje się całkowite zużycie.  
- Podpowiedź: *„Wymiana starej lodówki na nową klasy A+++ obniży roczne zużycie o ok. 300 kWh.”*

---

### 2.6. Liczba domowników  *(dawne 1.6)*

  
**Skąd czerpie dane:**  
- Użytkownik przesuwa suwak (np. 1–6 osób).  
  
**Gdzie ląduje:**  
- W tabeli `household_profile` – zmienna liczba osób wpływa na zużycie C.W.U., częstotliwość prania, gotowania, zmywania.  
  
**Jak działa logika:**  
- Domyślnie dla każdej osoby aplikacja dodaje:  
  - ok. 50–70 l C.W.U. dziennie (energia do podgrzania)  
  - dodatkowy cykl prania tygodniowo  
  - dodatkowe posiłki (kuchenka / zmywarka)  
- Parametry skalowane są liniowo lub według krzywych statystycznych.  
  
**Efekt na ekranie:**  
- Przy zmianie liczby osób aktualizuje się zapotrzebowanie na C.W.U. i dobowe zużycie prądu.  
- Komunikat: *„Dla 4 osób zalecamy bojler o pojemności co najmniej 200 l.”*

---

### 2.7. Profil dobowy (24h) – okna szczytowego zużycia  *(dawne 1.7)*

  
**Skąd czerpie dane:**  
- Użytkownik przesuwa suwaki lub wskazuje na wykresie, kiedy w ciągu doby występują największe obciążenia (np. 7:00–8:00 i 18:00–21:00).  
  
**Gdzie ląduje:**  
- W tabeli `daily_profile` – dla każdej godziny zapisywany jest współczynnik zapotrzebowania (np. 0,3 w nocy, 1,5 w szczycie).  
  
**Jak działa logika:**  
- Sumaryczne zużycie dobowe rozkładane jest na godziny zgodnie z profilem.  
- System porównuje rozkład zużycia z godzinami produkcji PV – jeśli szczyt zużycia przypada na noc, całe obciążenie idzie z baterii, co zwiększa wymaganą pojemność.  
  
**Efekt na ekranie:**  
- Wykres słupkowy z godzinami produkcji PV (żółty) i zużycia (niebieski).  
- System wskazuje **deficyt** (godziny, gdy zużycie > produkcja) i oblicza, ile energii trzeba będzie pobrać z baterii.

---

### 2.8. Sezonowość urządzeń i tryb wakacyjny  *(dawne 1.8)*

  
**Skąd czerpie dane:**  
- Przy każdym urządzeniu (lub globalnie) użytkownik wybiera: *Całoroczny*, *Tylko lato*, *Tylko zima*, *Weekendowy*.  
  
**Gdzie ląduje:**  
- Pole `seasonality` w tabelach `variable_loads` i `critical_loads`.  
  
**Jak działa logika:**  
- *Tylko zima* – aktywowane tylko w miesiącach z niskimi temperaturami (system pobiera dane klimatyczne).  
- *Tylko lato* – np. klimatyzacja, pompa basenowa.  
- *Weekendowy* – urządzenia pracują tylko w wybrane dni (piątek–niedziela).  
- Dzięki temu aplikacja nie przewymiarowuje instalacji na potrzeby występujące tylko część roku.  
  
**Efekt na ekranie:**  
- Podsumowanie pokazuje zapotrzebowanie **„szczytowe zimowe”** i **„szczytowe letnie”** oddzielnie.  
- Ostrzeżenie: *„W trybie weekendowym bateria musi wystarczyć na cały tydzień – rozważ większy bufor.”*

---

### 2.9. Dni autonomii (bufor bez słońca)  *(dawne 1.9)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera z suwaka: 1, 2, 3, 5, 7 dni – ile dni system ma działać bez nasłonecznienia.  
  
**Gdzie ląduje:**  
- W tabeli `autonomy_settings` – wartość kluczowa dla doboru pojemności akumulatorów (rozdz. 3).  
  
**Jak działa logika:**  
- Całkowite dobowe zapotrzebowanie jest mnożone przez liczbę dni autonomii.  
- Doliczany jest bufor na straty (sprawność inwertera, samorozładowanie) oraz zapas na najgorsze warunki.  
- System ostrzega, jeśli wybrane dni autonomii prowadzą do nierealistycznie dużych baterii.  
  
**Efekt na ekranie:**  
- Wyświetlana jest wymagana pojemność użyteczna (kWh) i sugerowana pojemność nominalna (uwzględniając DoD).  
- Komentarz: *„3 dni autonomii przy twoim zapotrzebowaniu to 45 kWh użytecznej – ok. 6 akumulatorów 12V/200Ah.”*

---

### 2.10. Moc pozorna (VA) i współczynnik mocy (cos φ)  *(dawne 1.10)*

  
**Skąd czerpie dane:**  
- Dla urządzeń z silnikami (pompy, lodówki, kompresory) aplikacja automatycznie przypisuje typowy cos φ (np. 0,7). Użytkownik może go zmienić.  
  
**Gdzie ląduje:**  
- W tabeli `loads_power_factor` – dla każdego obciążenia zapisywany jest cos φ i moc pozorna (VA) = P / cos φ.  
  
**Jak działa logika:**  
- Moc czynna (W) to rzeczywista praca, ale falownik jest obciążany mocą pozorną (VA).  
- Pompa 1000 W przy cos φ = 0,7 daje zapotrzebowanie 1428 VA.  
- System sumuje moce pozorne wszystkich urządzeń, które mogą pracować jednocześnie, aby dobrać właściwą moc falownika.  
  
**Efekt na ekranie:**  
- Obok obciążenia szczytowego (W) pojawia się **„wymagana moc falownika (VA)”**.  
- Ostrzeżenie: *„Twoje obciążenie szczytowe to 4,2 kW, ale ze względu na cos φ falownik musi mieć 5,8 kVA.”*

---

### 2.11. Prądy rozruchowe (surge)  *(dawne 1.11)*

  
**Skąd czerpie dane:**  
- Z bazy urządzeń – dla silników i sprężarek aplikacja przechowuje współczynnik rozruchu (np. 5× dla pompy głębinowej, 6× dla starej lodówki).  
  
**Gdzie ląduje:**  
- W tabeli `surge_loads` – zapisywany jest dodatkowy pik prądu (A) i moc (W) trwający ułamki sekundy.  
  
**Jak działa logika:**  
- Podczas symulacji falownika system sprawdza, czy jego przeciążalność (np. 200% przez 5 s) wystarczy do uruchomienia wszystkich silników jednocześnie.  
- Jeśli nie – ostrzega i sugeruje większy falownik lub sekwencyjne załączanie.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy jednoczesnym starcie pompy i lodówki falownik doświadczy skoku 9,2 kW – Twój falownik 5 kW nie udźwignie. Wybierz model z przeciążalnością 200% lub zastosuj miękki start.”*

---

### 2.12. Pobór własny falownika (standby)  *(dawne 1.12)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera model falownika (lub wprowadza pobór w stanie jałowym – typowo 20–100 W).  
- Jeśli brak modelu, system przyjmuje domyślnie 50 W.  
  
**Gdzie ląduje:**  
- Jako osobny wpis w tabeli `constant_loads` z priorytetem 1 (zawsze aktywny).  
  
**Jak działa logika:**  
- Falownik pobiera energię 24/7, nawet bez obciążenia – 20–100 W × 24 h = 0,5–2,4 kWh/dobę.  
- System dolicza tę wartość do całkowitego zapotrzebowania dobowego.  
  
**Efekt na ekranie:**  
- Osobna pozycja w bilansie: *„Pobór własny falownika: 1,2 kWh/dobę”*.  
- Podpowiedź: *„Jeśli nocą falownik zasila tylko router, rozważ wydzielenie obwodu DC 12/24 V.”*

---

### 2.13. Sprawność inwertera przy niskim obciążeniu  *(dawne 1.13)*

  
**Skąd czerpie dane:**  
- Z charakterystyki sprawności wybranego falownika (producent podaje krzywą sprawności w funkcji obciążenia).  
- Jeśli brak danych – typowe wartości: sprawność max ~95% przy 40–80% obciążenia, spada do 70–80% przy <10%.  
  
**Gdzie ląduje:**  
- W module `inverter_efficiency` – system oblicza średnią ważoną sprawność dla profilu dobowego.  
  
**Jak działa logika:**  
- W nocy, przy małym obciążeniu (np. 40 W), falownik 5 kW ma bardzo niską sprawność – strata konwersji może być większa niż pobór odbiorników.  
- System proponuje rozwiązania: mniejszy falownik na noc, wydzielenie obwodu DC, lub użycie falownika o wysokiej sprawności przy małych obciążeniach.  
  
**Efekt na ekranie:**  
- Wykres sprawności w ciągu doby.  
- Alert: *„W nocy sprawność falownika spada do 52% – 48% energii z baterii jest marnowane. Rozważ zasilanie routera i kamer bezpośrednio z akumulatora (DC).”*

---

### 2.14. Cykle odszraniania pompy ciepła (defrost)  *(dawne 1.14)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera pompę ciepła – aplikacja zna typowe cykle defrostu; w wilgotnych warunkach ok. 0°C pompa odwraca obieg na kilka minut, co daje skokowy pobór (np. +2 kW przez 5 min co godzinę).  
  
**Gdzie ląduje:**  
- W tabeli `heat_pump_defrost` – dodatkowe zużycie energii przypisane do miesięcy zimowych.  
- Szczegółowe miesięczne wyliczenia znajdują się w rozdziale 5.6, ale dane wejściowe są zbierane tutaj.  
  
**Jak działa logika:**  
- System analizuje klimat lokalizacji – jeśli w okresie przejściowym występuje wiele dni z temperaturą ok. 0°C i wysoką wilgotnością, dolicza stały dodatkowy pobór na odszranianie.  
  
**Efekt na ekranie:**  
- Podsumowanie zimowe: *„Cykl defrost – dodatkowe 0,8 kWh/dobę (w styczniu i lutym).”*  
- Wyjaśnienie: *„Przy wilgotnym mrozie pompa zużywa więcej prądu na rozmrażanie – nie licz na COP z katalogu.”*

---

### 2.15. Grzałki BMS i samorozładowanie ogniw  *(dawne 1.15)*

  
**Skąd czerpie dane:**  
- Z ustawień magazynu – użytkownik podaje, czy akumulator ma maty grzewcze (lub system sugeruje na podstawie lokalizacji).  
- Pobór grzałek (np. 50 W na moduł) oraz pobór własny BMS (5–10 W).  
  
**Gdzie ląduje:**  
- W tabeli `bms_heating` – zapotrzebowanie na ogrzewanie ogniw w zależności od temperatury zewnętrznej (aktywne, gdy temp. < 5°C).  
- Szczegóły techniczne i dobór mat grzewczych znajdują się w rozdziale 3.5.  
  
**Jak działa logika:**  
- LiFePO4 nie można ładować poniżej 0°C – przed ładowaniem BMS włącza grzałki podgrzewające ogniwa.  
- System dolicza tę energię do zapotrzebowania dobowego w miesiącach zimowych.  
- Uwzględnia samorozładowanie ogniw (ok. 1–3% miesięcznie).  
  
**Efekt na ekranie:**  
- Podczas konfiguracji magazynu: *„Akumulator musi być ogrzewany – zimą dolicz 0,5 kWh/dobę na maty grzewcze.”*  
- Ostrzeżenie: *„Jeśli nie zastosujesz ogrzewania, nie będziesz mógł ładować baterii przy mrozie – dom zostanie bez prądu.”*

---

### 2.16. Astronomiczny profil dnia/nocy (długość nocy)  *(dawne 1.16)*

  
**Skąd czerpie dane:**  
- Z danych astronomicznych dla szerokości geograficznej – aplikacja oblicza długość dnia i nocy dla każdego dnia roku.  
  
**Gdzie ląduje:**  
- W tabeli `daylight_profile` – dla każdego miesiąca podany jest współczynnik oświetlenia (np. grudzień: 8 h dnia, 16 h nocy).  
  
**Jak działa logika:**  
- Urządzenia takie jak oświetlenie zewnętrzne, monitoring (kamery na podczerwień) pracują dłużej zimą.  
- System automatycznie skaluje czas pracy tych urządzeń w zależności od długości nocy.  
  
**Efekt na ekranie:**  
- Użytkownik nie musi ustawiać godzin oświetlenia – wystarczy zdefiniować *„oświetlenie zewnętrzne: 3 lampy LED 10 W”*, a system wyliczy: *„Grudzień: 3×10W×16h = 0,48 kWh/dobę; Czerwiec: 3×10W×7h = 0,21 kWh/dobę.”*

---

### 2.17. Przetwornice DC/DC – rozróżnienie zasilania  *(dawne 1.17)*

  
**Skąd czerpie dane:**  
- Użytkownik przy każdym urządzeniu niskonapięciowym (12V/24V) wybiera: *„Zasilanie przez przetwornicę DC/DC”* lub *„Bezpośrednio z magistrali DC”*.  
  
**Gdzie ląduje:**  
- W tabeli `dc_conversion` – dla każdego urządzenia zapisana jest sprawność przetwornicy (domyślnie 85%) i wynikający z niej dodatkowy pobór.  
  
**Jak działa logika:**  
- Przetwornice DC/DC mają sprawność 80–90%, zwłaszcza przy małych obciążeniach.  
- Jeśli urządzenie jest zasilane bezpośrednio z baterii (np. oświetlenie 12V), strata jest pomijalna.  
- W przeciwnym razie do bilansu doliczana jest strata mocy.  
  
**Efekt na ekranie:**  
- Po wyborze opcji system aktualizuje zapotrzebowanie: *„Router przez przetwornicę: 15 W / 0,85 = 17,6 W z baterii.”*  
- Podpowiedź: *„Jeśli masz wiele urządzeń DC, rozważ centralną przetwornicę o większej sprawności.”*

---

### 2.18. Degradacja i starzenie (aging factor)  *(dawne 1.18)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera horyzont czasowy: 5, 10, 15 lat (suwak).  
- System przyjmuje typowe współczynniki: panele PV –0,5%/rok, LiFePO4 – ok. 80% pojemności po 10 latach.  
  
**Gdzie ląduje:**  
- W tabeli `degradation_buffer` – obliczany jest całkowity współczynnik korekcyjny (np. 1,15 dla 10 lat).  
  
**Jak działa logika:**  
- Całkowite dzisiejsze zapotrzebowanie mnożone jest przez współczynnik starzenia – instalacja projektowana jest tak, aby po 10 latach nadal pokrywała 100% potrzeb.  
  
**Efekt na ekranie:**  
- Dwa wyniki: *„Zapotrzebowanie dziś: 12,4 kWh/dobę”* oraz *„Zapotrzebowanie za 10 lat: 14,3 kWh/dobę”*.  
- System dobiera akumulatory i panele pod wyższą wartość.

---

### 2.19. Agregat prądotwórczy – definicja i logika pracy  *(dawne 1.19)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza parametry agregatu: moc (kW), rodzaj paliwa, pojemność zbiornika (l), średnie zużycie paliwa (l/h).  
  
**Gdzie ląduje:**  
- W tabeli `generator_config` – parametry agregatu oraz reguły automatycznego załączania (np. gdy SoC baterii spadnie poniżej 20%).  
  
**Jak działa logika:**  
- System porównuje produkcję PV z zapotrzebowaniem w najgorszym miesiącu roku. Jeśli występuje deficyt, oblicza:  
  - Ile godzin agregat musi pracować w każdym miesiącu.  
  - Ile paliwa to zużyje.  
  - Jaki będzie koszt paliwa.  
- Uwzględnia optymalne obciążenie agregatu (ok. 70–80% mocy).  
  
**Efekt na ekranie:**  
- Raport: *„W styczniu deficyt 80 kWh. Agregat 5 kW będzie musiał pracować 20 godzin, zużywając 25 l paliwa. Koszt: ok. 200 zł.”*  
- Ostrzeżenie: *„Agregat musi być uruchamiany ręcznie lub przez autostart – upewnij się, że BMS ma wyjście sterujące.”*

---

### 2.20. Macierz priorytetów odłączania (Smart Load Shedding)  *(dawne 1.20)*

  
**Skąd czerpie dane:**  
- Użytkownik dla każdego urządzenia (lub kategorii) przypisuje priorytet:  
  - 1 – krytyczne (nigdy nie odłączane)  
  - 2 – komfort (odłączane, gdy SoC < 20%)  
  - 3 – nadwyżkowe (odłączane, gdy SoC < 90% lub brak nadwyżki PV).  
  
**Gdzie ląduje:**  
- W tabeli `load_priority` – każdy odbiornik ma przypisany priorytet i warunki odłączenia.  
  
**Jak działa logika:**  
- W trybie live (lub symulacji) system śledzi SoC i produkcję PV. Gdy bateria spada poniżej progu, automatycznie wyłącza obciążenia o niższym priorytecie – najpierw 3, potem 2.  
- Kluczowe systemy (pompy, ogrzewanie) pozostają zasilane jak najdłużej.  
  
**Efekt na ekranie:**  
- Drzewo priorytetów. W symulacji: *„Przy 3 dniach pochmurnej pogody system odłączy zmywarkę, klimatyzację i ładowarkę EV, ale utrzyma ogrzewanie i wodę.”*

---

### 2.21. Współczynnik jednoczesności (realne obciążenie)  *(dawne 1.21)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń (1.3) oraz profilu dobowego (1.7).  
  
**Gdzie ląduje:**  
- W tabeli `coincidence_factor` – dla każdej godziny dnia zapisany jest współczynnik jednoczesności.  
  
**Jak działa logika:**  
- System wylicza dwa scenariusze:  
  - **Bezwzględny pik mocy**: suma wszystkich urządzeń, które mogą pracować jednocześnie.  
  - **Realne obciążenie**: suma mocy ważona prawdopodobieństwem jednoczesnej pracy (statystyczny współczynnik jednoczesności, np. 0,6 przy 10 urządzeniach).  
- Użytkownik może ręcznie zaznaczyć urządzenia, które **na pewno** pracują razem (np. pompa + ogrzewanie), a resztę system szacuje automatycznie.  
  
**Efekt na ekranie:**  
- Dwa wskaźniki: *„Pik teoretyczny: 6,8 kW”* i *„Realne obciążenie szczytowe: 4,1 kW”*.  
- Podpowiedź: *„Falownik dobierany jest do piku teoretycznego, a bateria do realnego – dzięki temu nie przepłacisz za zbyt duży magazyn.”*

---

### 2.22. Świadomość prądowa (przelicznik W na A)  *(dawne 1.22)*

  
**Skąd czerpie dane:**  
- Z mocy urządzenia (W) i napięcia systemu bateryjnego (12/24/48V).  
  
**Gdzie ląduje:**  
- W module `current_awareness` – dla każdego urządzenia zapisywany jest prąd pobierany z baterii (A).  
  
**Jak działa logika:**  
- Wykorzystuje wzór: I = P / (V · η), gdzie η to sprawność inwertera (domyślnie 0,92).  
- Pokazuje, jak zmienia się prąd w zależności od napięcia systemowego.  
  
**Efekt na ekranie:**  
- Przy każdym urządzeniu wyświetlany jest prąd: *„Czajnik 2000 W przy 12V: 181 A, przy 48V: 45 A.”*  
- Alert: *„Przy 12V prąd dla czajnika wymaga kabla 50 mm² – rozważ przejście na 48V.”*

---

### 2.23. Szybki Niezbędnik (kalkulatory ręczne)  *(dawne 1.23)*

  
**Skąd czerpie dane:**  
- Użytkownik wpisuje dowolne wartości (moc, napięcie, pojemność Ah).  
  
**Gdzie ląduje:**  
- W podręcznej szufladzie `toolbox` – niezależny mini‑kalkulator.  
  
**Jak działa logika:**  
- Zawiera:  
  - Konwersję mocy (W) na prąd (A) dla zadanych napięć.  
  - Konwersję pojemności akumulatorów (Ah) na energię rzeczywistą (Wh/kWh) z uwzględnieniem napięcia i DoD.  
  - Przelicznik prądu rozruchowego.  
  
**Efekt na ekranie:**  
- Szybki dostęp z każdego miejsca aplikacji (ikonka kalkulatora).  
- Wynik natychmiastowy: *„Akumulator 12V/200Ah = 2,4 kWh nominalnie, przy DoD 80% = 1,92 kWh użyteczne.”*

---

### 2.24. Moduł zbiorczy: Wampiry energetyczne (standby)

> Scalono 24 dawne funkcje (1.24, 1.28–1.50) w jeden moduł z podzakładkami: Katalog urządzeń, Pomiar, Symulacje/Raporty, Rekomendacje sprzętowe, Automatyzacja. Cała oryginalna treść zachowana poniżej.

#### 2.24.1. Wampiry energetyczne (standby urządzeń)  *(dawne 1.24)*

  
**Skąd czerpie dane:**  
- Użytkownik zaznacza urządzenia z trybem czuwania (TV, ładowarki, mikrofalówka z wyświetlaczem).  
- Domyślnie system dodaje stały pobór tła (np. 30 W na cały dom).  
  
**Gdzie ląduje:**  
- W tabeli `standby_loads` – sumaryczna moc czuwania wszystkich urządzeń.  
  
**Jak działa logika:**  
- Oblicza straty dobowe: moc czuwania × 24 h.  
- Pokazuje, ile kWh rocznie marnuje się przez nieodłączone urządzenia.  
  
**Efekt na ekranie:**  
- Sekcja *„Wampiry energetyczne: 45 W”*.  
- Komunikat: *„Twoje urządzenia w standby pobierają 1,08 kWh/dobę – to 394 kWh rocznie. W off‑gridzie to 3 dni pełnej autonomii.”*

#### 2.24.2. Symulacja drenażu baterii przez urządzenia standby  *(dawne 1.28)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń w trybie czuwania i ich mocy standby (W).  
- Z pojemności baterii i napięcia systemowego (rozdz. 3).  
- Z dobowego profilu zużycia (funkcja 1.7).  
  
**Gdzie ląduje:**  
- W module `standby_drain_simulation`.  
  
**Jak działa logika:**  
- System sumuje całkowity pobór standby wszystkich urządzeń.  
- Oblicza dobowy i roczny pobór energii (kWh).  
- Symuluje, ile dni bateria wytrzyma wyłącznie na tym obciążeniu, bez innych odbiorników.  
- Porównuje z zużyciem całkowitym i wskazuje procentowy udział standby w bilansie.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twoje urządzenia standby pobierają łącznie 45 W. Bateria 100Ah (1,2 kWh) rozładuje się od nich w 26 h, a rocznie stracisz 394 kWh.”*  
- Alert: *„To 12% twojego całkowitego zapotrzebowania – rozważ wyłączanie standby.”*  
  
**Migawka:** *„O co chodzi? Wampiry energetyczne wysysają baterię po cichu. Sprawdź, ile dokładnie.”*  
  
**Powiązania:** Funkcja 1.24, 1.9, 8.14.

#### 2.24.3. Katalog urządzeń z poborem w trybie czuwania  *(dawne 1.29)*

  
**Skąd czerpie dane:**  
- Z wbudowanej bazy typowych urządzeń standby.  
  
**Gdzie ląduje:**  
- W module `standby_catalog`.  
  
**Jak działa logika:**  
- System udostępnia listę popularnych urządzeń z mocą czuwania:  
  - telewizor: 0,5–15 W,  
  - router: 5–15 W,  
  - konsola: 5–20 W,  
  - ładowarka bez odbiornika: 0,2–1 W,  
  - listwa zasilająca: 0,1–0,5 W,  
  - mikrofalówka z wyświetlaczem: 2–5 W,  
  - dekoder: 10–30 W.  
- Użytkownik zaznacza posiadane urządzenia i dodaje własne.  
  
**Efekt na ekranie:**  
- Lista z mocami i rocznym kosztem standby.  
- *„Dekoder 20 W standby to 175 kWh rocznie. W off-gridzie to bardzo dużo.”*  
  
**Migawka:** *„O co chodzi? Nie musisz zgadywać. Wybierasz z listy i widzisz, ile zjada każde urządzenie.”*  
  
**Powiązania:** Funkcja 1.28, 1.31, 1.41.

#### 2.24.4. Pomiar mocy jałowej ładowarek, zasilaczy i transformatorów  *(dawne 1.30)*

  
**Skąd czerpie dane:**  
- Z pomiarów użytkownika (miernik gniazdkowy) lub wartości katalogowych.  
  
**Gdzie ląduje:**  
- W module `idle_power_measurement`.  
  
**Jak działa logika:**  
- System prowadzi użytkownika przez pomiar mocy jałowej:  
  1. Podłącz miernik do gniazdka.  
  2. Włóż zasilacz bez urządzenia.  
  3. Odczytaj moc.  
- Umożliwia wpisanie wartości dla wielu zasilaczy.  
- Zapisuje je w bazie i sumuje.  
  
**Efekt na ekranie:**  
- Tabela pomiarów: *„Ładowarka od laptopa: 2 W jałowo. Zasilacz od routera: 5 W.”*  
  
**Migawka:** *„O co chodzi? Zasilacz wpięty bez laptopa nadal pobiera prąd. Zmierz to.”*  
  
**Powiązania:** Funkcja 1.28, 1.29, 8.44.

#### 2.24.5. Analiza autonomii systemu przy obciążeniu tylko standby  *(dawne 1.31)*

  
**Skąd czerpie dane:**  
- Z pojemności baterii i sumarycznego poboru standby.  
  
**Gdzie ląduje:**  
- W module `standby_autonomy`.  
  
**Jak działa logika:**  
- System oblicza, jak długo bateria utrzyma obciążenie standby przy braku produkcji PV.  
- Uwzględnia sprawność falownika i dopuszczalny DoD.  
- Pokazuje różnicę między pełnym standby a stanem „wszystko wyłączone ręcznie”.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy samym standby (45 W) bateria padnie po 26 h. Po wyłączeniu zbędnych urządzeń (15 W) wytrzyma 78 h.”*  
  
**Migawka:** *„O co chodzi? Każdy wat standby skraca autonomię. Policz, ile tracisz.”*  
  
**Powiązania:** Funkcja 1.28, 1.9, 3.1.

#### 2.24.6. Ekonomiczny próg opłacalności eliminacji standby  *(dawne 1.32)*

  
**Skąd czerpie dane:**  
- Z rocznych strat standby i kosztu urządzeń do ich eliminacji (wyłączniki, listwy, sterowniki).  
  
**Gdzie ląduje:**  
- W module `standby_economics`.  
  
**Jak działa logika:**  
- System porównuje koszt pozostawienia standby z kosztem jego eliminacji.  
- Oblicza okres zwrotu inwestycji w gniazda/przekaźniki/ listwy.  
- Uwzględnia wygodę użytkowania.  
  
**Efekt na ekranie:**  
- Tabela: *„Roczny koszt standby: 250 zł. Koszt 5 sterowanych gniazd: 150 zł. Zwrot po 7 miesiącach.”*  
  
**Migawka:** *„O co chodzi? Czasem opłaca się zainwestować w wyłączniki. Liczby to pokażą.”*  
  
**Powiązania:** Funkcja 1.28, 1.44, 1.49.

#### 2.24.7. Rekomendacje: wyłączniki ręczne, listwy, gniazda sterowane, przekaźniki Wi-Fi  *(dawne 1.33)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń standby i możliwych rozwiązań.  
  
**Gdzie ląduje:**  
- W module `standby_recommendations`.  
  
**Jak działa logika:**  
- System dobiera sposób odłączania standby do każdego urządzenia:  
  - TV i konsole: listwa z wyłącznikiem,  
  - router: gniazdo Wi-Fi (gdy potrzebny zdalny reset),  
  - ładowarki: gniazdo z timerem,  
  - sprzęt AGD: oddzielny obwód z wyłącznikiem w rozdzielni.  
- Uwzględnia pobór własny sterowników.  
  
**Efekt na ekranie:**  
- Lista rekomendacji.  
- Ostrzeżenie: *„Gniazdo Wi-Fi samo pobiera 1–2 W. Używaj go tylko tam, gdzie to uzasadnione.”*  
  
**Migawka:** *„O co chodzi? Nie ma jednego cudownego rozwiązania. Dla każdego urządzenia dobierz najlepszy wyłącznik.”*  
  
**Powiązania:** Funkcja 1.32, 1.44, 1.46.

#### 2.24.8. Tryb „czuwanie domowe” – minimalny profil nocny  *(dawne 1.34)*

  
**Skąd czerpie dane:**  
- Z dobowego profilu zużycia i listy urządzeń standby.  
  
**Gdzie ląduje:**  
- W module `night_standby_mode`.  
  
**Jak działa logika:**  
- System tworzy profil nocny:  
  - wyłącza zbędne obwody,  
  - zostawia tylko krytyczne (router, BMS, monitoring),  
  - ogranicza moc falownika,  
  - zapisuje scenariusz.  
- Oblicza oszczędności przy przejściu w tryb nocny.  
  
**Efekt na ekranie:**  
- Scenariusz: *„Nocny tryb czuwania: standby 15 W zamiast 45 W. Oszczędność 0,72 kWh na dobę.”*  
  
**Migawka:** *„O co chodzi? Dom może spać. Nie wszystko musi czuwać.”*  
  
**Powiązania:** Funkcja 1.33, 7.49, 7.17.

#### 2.24.9. Detekcja urządzeń „zawsze włączonych”  *(dawne 1.35)*

  
**Skąd czerpie dane:**  
- Z mierników na obwodach i analizy poboru.  
  
**Gdzie ląduje:**  
- W module `always_on_detection`.  
  
**Jak działa logika:**  
- System analizuje stałe obciążenie dobowe.  
- Identyfikuje urządzenia, które nie są nigdy wyłączane.  
- Wskazuje ich moc i roczny koszt.  
  
**Efekt na ekranie:**  
- Lista: *„Urządzenia zawsze włączone: dekoder 18 W, ładowarka 2 W, listwa 1 W.”*  
  
**Migawka:** *„O co chodzi? Łatwo zapomnieć o rzeczach, które nigdy nie gasną. System je znajdzie.”*  
  
**Powiązania:** Funkcja 7.33, 1.28, 1.43.

#### 2.24.10. Integracja z inteligentnymi listwami i gniazdami (API)  *(dawne 1.36)*

  
**Skąd czerpie dane:**  
- Z obsługiwanych protokołów (Wi-Fi, Zigbee, Z-Wave, MQTT).  
  
**Gdzie ląduje:**  
- W module `smart_plug_integration`.  
  
**Jak działa logika:**  
- System łączy się z inteligentnymi gniazdami/listwami.  
- Odczytuje pobór mocy i steruje zasilaniem.  
- Tworzy harmonogramy i scenariusze.  
  
**Efekt na ekranie:**  
- Panel: *„Gniazdo TV: 0,4 W standby. Wyłączone automatycznie o 23:00.”*  
  
**Migawka:** *„O co chodzi? Inteligentne gniazdo to zdalny wyłącznik i miernik w jednym.”*  
  
**Powiązania:** Funkcja 1.33, 7.17, 7.15.

#### 2.24.11. Jak samodzielnie zmierzyć pobór standby urządzeń (miernik gniazdkowy, pomiar prądu DC)  *(dawne 1.37)*

  
**Skąd czerpie dane:**  
- Z instrukcji pomiaru i wyników wpisanych przez użytkownika.  
  
**Gdzie ląduje:**  
- W module `standby_measurement_howto`.  
  
**Jak działa logika:**  
- System tłumaczy krok po kroku, jak zmierzyć standby:  
  - miernikiem gniazdkowym (AC),  
  - multimetrem z cęgami (DC),  
  - przez inteligentne gniazdo.  
- Umożliwia zapisanie wyników i budowanie bazy.  
  
**Efekt na ekranie:**  
- Instrukcja: *„Włóż miernik do gniazdka, podłącz urządzenie, odczytaj moc w watach.”*  
  
**Migawka:** *„O co chodzi? Nie musisz być elektrykiem, żeby zmierzyć standby. Wystarczy prosty miernik.”*  
  
**Powiązania:** Funkcja 1.30, 8.44, 8.50.

#### 2.24.12. Pobór własny przekaźników, sterowników i modułów zdalnego sterowania  *(dawne 1.38)*

  
**Skąd czerpie dane:**  
- Z listy używanych przekaźników, sterowników, modułów Wi-Fi/Zigbee i ich specyfikacji.  
- Z napięcia zasilania i liczby urządzeń.  
  
**Gdzie ląduje:**  
- W module `control_devices_consumption`.  
  
**Jak działa logika:**  
- System sumuje pobór mocy wszystkich urządzeń sterujących i komunikacyjnych.  
- Uwzględnia tryby pracy: czuwanie, aktywne działanie, tryb uśpienia.  
- Wskazuje, które urządzenia są najbardziej prądożerne.  
- Pokazuje roczny koszt energetyczny samej automatyki.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twoje moduły sterujące pobierają łącznie 8 W ciągle. To 70 kWh rocznie.”*  
- Ostrzeżenie: *„Jeśli automatyka zjada więcej, niż oszczędza, nie ma sensu.”*  
  
**Migawka:** *„O co chodzi? Sterowniki też potrzebują prądu. Nie mogą być gorsze od problemu, który rozwiązują.”*  
  
**Powiązania:** Funkcja 1.33, 1.44, 1.46.

#### 2.24.13. Optymalizacja wyłączania standby – koszt vs. zysk  *(dawne 1.39)*

  
**Skąd czerpie dane:**  
- Z kosztów zakupu i montażu wyłączników, gniazd, przekaźników.  
- Z rocznych oszczędności energii wynikających z eliminacji standby.  
- Z ceny energii (sieciowej lub kosztu z off-gridu).  
  
**Gdzie ląduje:**  
- W module `standby_optimization`.  
  
**Jak działa logika:**  
- System oblicza prosty okres zwrotu dla każdego rozwiązania.  
- Porównuje warianty: nic nie robić, wyłączniki ręczne, listwy, gniazda Wi-Fi, przekaźniki w rozdzielni.  
- Uwzględnia koszt instalacji i żywotność urządzeń.  
- Rekomenduje najbardziej opłacalne rozwiązanie.  
  
**Efekt na ekranie:**  
- Tabela: *„Listwy z wyłącznikiem: koszt 40 zł, oszczędność 120 zł/rok, zwrot 4 miesiące. Gniazda Wi-Fi: koszt 150 zł, oszczędność 200 zł/rok, zwrot 9 miesięcy.”*  
- Komunikat: *„Najlepszy stosunek zysku do kosztów dają listwy z wyłącznikiem.”*  
  
**Migawka:** *„O co chodzi? Nie zawsze opłaca się iść w drogie gadżety. Czasem zwykły wyłącznik jest najlepszy.”*  
  
**Powiązania:** Funkcja 1.32, 1.33, 1.44.

#### 2.24.14. Tryb „nieobecność” – wyłączanie zbędnych obwodów (rozbudowany)  *(dawne 1.40)*

  
**Skąd czerpie dane:**  
- Z harmonogramu nieobecności użytkownika.  
- Z listy obwodów i ich priorytetów.  
- Z temperatury wewnętrznej i zewnętrznej.  
  
**Gdzie ląduje:**  
- W module `absence_mode`.  
  
**Jak działa logika:**  
- System tworzy plan wyłączeń na czas nieobecności:  
  - wyłącza obwody niepotrzebne (TV, kuchnia, pralka),  
  - zostawia krytyczne (BMS, monitoring, router, pompa ciepła w trybie przeciwzamrożeniowym),  
  - obniża temperaturę zadaną,  
  - odłącza standby.  
- Oblicza oszczędności.  
- Umożliwia zdalne wznowienie pracy przed powrotem.  
  
**Efekt na ekranie:**  
- Scenariusz: *„Podczas nieobecności zużycie spadnie z 3 kWh/dobę do 0,8 kWh/dobę.”*  
- Alert: *„Pamiętaj, aby nie wyłączyć obwodu ogrzewania – ryzyko zamarznięcia.”*  
  
**Migawka:** *„O co chodzi? Gdy Cię nie ma, dom ma przejść w stan hibernacji, a nie czuwać jak przy Tobie.”*  
  
**Powiązania:** Funkcja 1.34, 7.27, 6.33.

#### 2.24.15. Baza typowych urządzeń standby – telewizor, router, konsola, ładowarka, listwa  *(dawne 1.41)*

  
**Skąd czerpie dane:**  
- Z wbudowanej, rozbudowanej bazy urządzeń.  
  
**Gdzie ląduje:**  
- W module `standby_device_database`.  
  
**Jak działa logika:**  
- System zawiera szczegółowe dane o poborze standby dla setek urządzeń.  
- Pozwala filtrować po kategorii, producencie, roczniku.  
- Umożliwia dodanie własnych urządzeń z pomiaru.  
- Przypisuje typowe zużycie standby do wybranych urządzeń.  
  
**Efekt na ekranie:**  
- Lista: *„Telewizor Samsung 55 cali – standby 0,5 W. Konsola PS5 – standby 5 W. Ładowarka Anker – standby 0,2 W.”*  
- Możliwość zaznaczenia i dodania do bilansu.  
  
**Migawka:** *„O co chodzi? Nie musisz szukać w instrukcjach. Wszystko jest w jednym miejscu.”*  
  
**Powiązania:** Funkcja 1.29, 1.48, 1.28.

#### 2.24.16. Scenariusz: ile wytrzyma bateria przy obciążeniu tylko standby (bez dużych odbiorników)  *(dawne 1.42)*

  
**Skąd czerpie dane:**  
- Z sumarycznego poboru standby i pojemności baterii.  
- Z dopuszczalnego DoD.  
  
**Gdzie ląduje:**  
- W module `standby_battery_runtime`.  
  
**Jak działa logika:**  
- System symuluje rozładowanie baterii wyłącznie przez obciążenia standby.  
- Oblicza czas do osiągnięcia minimalnego SoC.  
- Pokazuje wykres zaniku energii w czasie.  
  
**Efekt na ekranie:**  
- Wykres: *„Przy standby 35 W bateria 100Ah rozładuje się w 34 h.”*  
- Ostrzeżenie: *„To cichy drenaż – nawet bez żadnego dużego odbiornika.”*  
  
**Migawka:** *„O co chodzi? Jeśli wyjeżdżasz, standby może rozładować baterię szybciej, niż myślisz.”*  
  
**Powiązania:** Funkcja 1.31, 1.9, 3.1.

#### 2.24.17. Raport „roczny koszt wampirów energetycznych” – złotówki i kWh  *(dawne 1.43)*

  
**Skąd czerpie dane:**  
- Z bazy urządzeń standby i ich mocy.  
- Z ceny energii.  
  
**Gdzie ląduje:**  
- W module `standby_annual_report`.  
  
**Jak działa logika:**  
- System sumuje roczne zużycie standby.  
- Przelicza na koszt w złotówkach.  
- Porównuje z całkowitym zużyciem.  
- Generuje raport PDF lub ekran.  
  
**Efekt na ekranie:**  
- Raport: *„Roczne zużycie standby: 438 kWh. Koszt: 350 zł. To 15% całkowitego zużycia.”*  
- Wykres kołowy: *„Największy wampir: dekoder (175 kWh).”*  
  
**Migawka:** *„O co chodzi? Widzisz w złotówkach, ile kosztuje Cię nieodłączanie urządzeń.”*  
  
**Powiązania:** Funkcja 1.28, 1.31, 1.39.

#### 2.24.18. Porównanie: wyłącznik ręczny vs. listwa z wyłącznikiem vs. gniazdo Wi-Fi vs. przekaźnik Zigbee  *(dawne 1.44)*

  
**Skąd czerpie dane:**  
- Z kosztów zakupu, zużycia własnego, łatwości montażu.  
  
**Gdzie ląduje:**  
- W module `standby_switch_comparison`.  
  
**Jak działa logika:**  
- System porównuje cztery metody eliminacji standby:  
  - wyłącznik ręczny (0 W własnego poboru),  
  - listwa z wyłącznikiem (0 W),  
  - gniazdo Wi-Fi (1–2 W),  
  - przekaźnik Zigbee (0,5–1 W).  
- Uwzględnia wygodę, niezawodność, koszt.  
- Rekomenduje w zależności od stylu życia użytkownika.  
  
**Efekt na ekranie:**  
- Tabela: *„Wyłącznik ręczny: 0 zł, 0 W standby, pełna kontrola. Gniazdo Wi-Fi: 50 zł, 1,5 W standby, zdalne sterowanie.”*  
- Komunikat: *„Jeśli nie potrzebujesz zdalnego sterowania, zwykły wyłącznik jest bezkonkurencyjny.”*  
  
**Migawka:** *„O co chodzi? Zdalne sterowanie kosztuje energię. Czasem lepiej po prostu wstać i wyłączyć.”*  
  
**Powiązania:** Funkcja 1.33, 1.38, 1.39.

#### 2.24.19. Ocena wpływu standby na zapotrzebowanie projektowe – korekta bilansu  *(dawne 1.45)*

  
**Skąd czerpie dane:**  
- Z sumarycznego standby i obecnego bilansu energetycznego.  
  
**Gdzie ląduje:**  
- W module `standby_design_impact`.  
  
**Jak działa logika:**  
- System pokazuje, jak standby wpływa na projektowaną pojemność baterii i moc PV.  
- Oblicza, o ile można zmniejszyć magazyn, jeśli wyeliminuje się część standby.  
- Sugeruje korektę bilansu.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twój standby dodaje 0,7 kWh/dobę. Eliminacja 80% standby pozwoli zmniejszyć baterię o 30 Ah.”*  
- Alert: *„Projektowanie bez uwzględnienia standby prowadzi do przewymiarowania lub niedoszacowania.”*  
  
**Migawka:** *„O co chodzi? Zanim kupisz baterię, policz standby. Może nie potrzebujesz tak dużej.”*  
  
**Powiązania:** Funkcja 1.28, 1.9, 3.1.

#### 2.24.20. Rekomendacje dotyczące wydzielenia obwodów standby w rozdzielni  *(dawne 1.46)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń standby i ich lokalizacji w instalacji.  
  
**Gdzie ląduje:**  
- W module `standby_circuit_separation`.  
  
**Jak działa logika:**  
- System proponuje wydzielenie osobnego obwodu dla urządzeń standby.  
- Dobiera wyłącznik lub stycznik sterowany.  
- Uwzględnia krytyczne urządzenia, które muszą pozostać włączone.  
  
**Efekt na ekranie:**  
- Schemat: *„Obwód standby: TV, konsola, ładowarki – wyłączany jednym przyciskiem. Obwód krytyczny: router, BMS – zostaje.”*  
- Rekomendacja: *„Zastosuj stycznik 230V 16A sterowany przyciskiem.”*  
  
**Migawka:** *„O co chodzi? Jedno kliknięcie i wszystkie wampiry odcięte. Porządek w rozdzielni.”*  
  
**Powiązania:** Funkcja 1.33, 1.47, 4.23.

#### 2.24.21. Strategie redukcji nocnego poboru własnego falownika (tryb uśpienia, wyłączanie)  *(dawne 1.47)*

  
**Skąd czerpie dane:**  
- Z modelu falownika i jego poboru własnego.  
- Z profilu dobowego zużycia.  
  
**Gdzie ląduje:**  
- W module `inverter_night_mode`.  
  
**Jak działa logika:**  
- System analizuje, czy falownik może przejść w tryb uśpienia nocą.  
- Dobiera strategię:  
  - wyłączanie falownika na noc,  
  - tryb „Search” (poszukiwanie obciążenia),  
  - przełączenie na mniejszy falownik nocny.  
- Oblicza oszczędności.  
  
**Efekt na ekranie:**  
- Komunikat: *„Falownik pobiera 40 W w standby. Tryb uśpienia obniży to do 5 W, oszczędzając 0,84 kWh na dobę.”*  
- Ostrzeżenie: *„Nie wyłączaj falownika, jeśli zasila on krytyczne odbiorniki.”*  
  
**Migawka:** *„O co chodzi? Falownik też jest wampirem. W nocy może spać.”*  
  
**Powiązania:** Funkcja 1.12, 7.49, 1.34.

#### 2.24.22. Pobór mocy przez urządzenia w trybie gotowości – rozszerzona baza i scenariusze  *(dawne 1.48)*

  
**Skąd czerpie dane:**  
- Z rozszerzonej bazy standby i profili użytkowania.  
  
**Gdzie ląduje:**  
- W module `standby_extended`.  
  
**Jak działa logika:**  
- System oferuje jeszcze bardziej szczegółową bazę standby.  
- Tworzy scenariusze: „praca z domu”, „weekend”, „urlop”.  
- Dla każdego scenariusza oblicza pobór standby.  
  
**Efekt na ekranie:**  
- Tabela: *„Scenariusz praca z domu: standby 50 W. Scenariusz urlop: standby 12 W.”*  
  
**Migawka:** *„O co chodzi? Standby zmienia się zależnie od trybu życia. Sprawdź różne scenariusze.”*  
  
**Powiązania:** Funkcja 1.41, 1.29, 1.40.

#### 2.24.23. Harmonogram wyłączania obwodów standby na podstawie obecności domowników  *(dawne 1.49)*

  
**Skąd czerpie dane:**  
- Z czujników obecności lub harmonogramu.  
  
**Gdzie ląduje:**  
- W module `standby_schedule_presence`.  
  
**Jak działa logika:**  
- System tworzy harmonogram wyłączania standby w zależności od tego, czy domownicy są w domu.  
- Gdy nikogo nie ma, automatycznie odłącza zbędne obwody.  
- Gdy ktoś wraca, przywraca zasilanie.  
  
**Efekt na ekranie:**  
- Harmonogram: *„Poniedziałek–piątek 9:00–15:00: standby wyłączone. Weekend: włączone cały dzień.”*  
  
**Migawka:** *„O co chodzi? Po co grzać standby w pustym domu? Automatyka zrobi to za Ciebie.”*  
  
**Powiązania:** Funkcja 1.40, 7.26, 1.36.

#### 2.24.24. Audyt energetyczny domu pod kątem ukrytych obciążeń (raport)  *(dawne 1.50)*

  
**Skąd czerpie dane:**  
- Z pomiarów standby, listy urządzeń, obwodów.  
  
**Gdzie ląduje:**  
- W module `hidden_loads_audit`.  
  
**Jak działa logika:**  
- System generuje pełny audyt ukrytych obciążeń.  
- Pokazuje, które urządzenia i obwody nie są nigdy wyłączane.  
- Podaje konkretne kroki redukcji.  
- Generuje raport PDF.  
  
**Efekt na ekranie:**  
- Raport: *„Znaleziono 6 urządzeń standby o łącznej mocy 55 W. Zalecane wyłączenie 4 z nich.”*  
  
**Migawka:** *„O co chodzi? To jak przegląd techniczny, ale dla prądu. Wykrywa pasożytów.”*  
  
**Powiązania:** Funkcja 1.35, 1.43, 7.33.  
  
  
  
---  
  
  
## Rozdział 2: Zaawansowany moduł PV (panele, geometria, fizyka, termika, aerodynamika)


---

### 2.25. Bufor na rozbudowę  *(dawne 1.25)*

  
**Skąd czerpie dane:**  
- Użytkownik przesuwa suwak *„Dodaj bufor na rozbudowę”* (0%, 10%, 20%, 30%).  
  
**Gdzie ląduje:**  
- W tabeli `future_buffer` – dodatkowy procent doliczany do całkowitego zapotrzebowania.  
  
**Jak działa logika:**  
- Do wyliczonego zapotrzebowania dobowego dodawany jest wybrany procent.  
- System ostrzega, jeśli bufor jest zerowy: *„Doświadczenie pokazuje, że apetyt na prąd rośnie – dodaj minimum 10%.”*  
  
**Efekt na ekranie:**  
- Podsumowanie: *„Zapotrzebowanie bazowe: 12 kWh/dobę. Z buforem 20%: 14,4 kWh/dobę.”*

---

### 2.26. Architektura 1‑fazowa / 3‑fazowa (symetria obciążenia)  *(dawne 1.26)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera typ instalacji (1‑fazowa lub 3‑fazowa).  
- System sprawdza, które urządzenia wymagają zasilania 3‑fazowego (np. pompa ciepła, duża indukcja).  
  
**Gdzie ląduje:**  
- W tabeli `phase_architecture` – przypisanie obciążeń do faz L1, L2, L3.  
  
**Jak działa logika:**  
- Oblicza sumaryczne obciążenie każdej fazy i sprawdza symetrię.  
- Ostrzega, gdy jedna faza jest przeciążona, a pozostałe mają zapas.  
  
**Efekt na ekranie:**  
- Wykres trzech faz z obciążeniami.  
- Komunikat: *„Faza L1 przeciążona (4,2 kW), L2 i L3 po 1,5 kW – przesuń zmywarkę na fazę L2.”*

---

### 2.27. Kategoria warsztat / gospodarstwo / oświetlenie terenowe  *(dawne 1.27)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera dodatkowe kategorie obciążeń: elektronarzędzia, spawarka, pompy do podlewania, oświetlenie podjazdu, ogrodzenia.  
  
**Gdzie ląduje:**  
- W tabeli `special_loads` – z możliwością oznaczenia jako sezonowe lub weekendowe.  
  
**Jak działa logika:**  
- Urządzenia te są uwzględniane w bilansie, ale z reguły mają niższy priorytet (2 lub 3).  
- System sugeruje wydzielenie osobnego obwodu, aby nie przeciążać głównego falownika.  
  
**Efekt na ekranie:**  
- Dodatkowa lista z mocami i czasem pracy.  
- Ostrzeżenie: *„Spawarka 4 kW może wyłączyć cały system – zalecamy uruchamianie jej tylko przy pracy agregatu.”*

---

## Moduł 3 (Kafel 3): Instalacja PV

*Bez zmian względem v1.5 — dawny Rozdział 2. (Uwaga redakcyjna: pozycje 2.15, 2.29 i 2.34 dotyczą pokrewnych zjawisk degradacji — PID/LID/LETID — pozostawiono jako odrębne funkcje, ponieważ każda opisuje inny aspekt [zjawisko / technologia zapobiegawcza / symulacja pogłębiona], ale dodano wzajemne odsyłacze.)*

### 3.1. Baza modeli paneli PV i tryb ręczny (custom)  *(dawne 2.1)*

  
**Skąd czerpie dane:**  
- Wbudowana baza popularnych paneli (aktualizowana z API lub dostarczana z aplikacją).  
- Tryb custom: użytkownik ręcznie wprowadza parametry STC: Pmax, Voc, Isc, Vmp, Imp, współczynnik temperaturowy mocy β (%/°C).  
  
**Gdzie ląduje:**  
- W tabeli `pv_panels` – każdy panel ma ID, producent, model, parametry elektryczne.  
  
**Jak działa logika:**  
- System weryfikuje poprawność danych (np. Vmp < Voc).  
- Dla wybranego panelu oblicza moc w warunkach rzeczywistych (korygowana o temperaturę i nasłonecznienie).  
  
**Efekt na ekranie:**  
- Lista rozwijana z filtrami (producent, moc).  
- Karta techniczna panelu z wizualizacją.  
- Przycisk *„Dodaj panel ręcznie”* – otwiera formularz.

---

### 3.2. Pobranie danych nasłonecznienia (PVGIS / PVWatts)  *(dawne 2.2)*

  
**Skąd czerpie dane:**  
- Jednorazowe zapytanie przez API do PVGIS lub PVWatts przy tworzeniu nowego projektu (gdy jest internet). API zwraca miesięczne wartości promieniowania całkowitego (kWh/m²) i temperatur.  
  
**Gdzie ląduje:**  
- Zapisane lokalnie w pliku JSON lub tabeli `solar_data` – przechowywane na stałe, aby aplikacja działała offline.  
- Użytkownik może też ręcznie wprowadzić dane.  
  
**Jak działa logika:**  
- Silnik PV używa tych danych do wyliczenia produkcji dla każdego miesiąca, uwzględniając kąt nachylenia i azymut.  
- API są darmowe – nie generują kosztów.  
  
**Efekt na ekranie:**  
- Po pobraniu użytkownik widzi wykres nasłonecznienia dla swojej lokalizacji.  
- Komunikat: *„Dane pobrane pomyślnie – możesz teraz pracować offline.”*

---

### 3.3. Kąt pochylenia i azymut – interaktywne suwaki  *(dawne 2.3)*

  
**Skąd czerpie dane:**  
- Użytkownik przesuwa suwaki na ekranie (kąt 0–90°, azymut 0–360°).  
- Dla wybranych połaci budynku system automatycznie proponuje ich aktualne wartości.  
  
**Gdzie ląduje:**  
- W tabeli `panel_orientation` – dla każdej grupy paneli zapisywany jest kąt i azymut.  
  
**Jak działa logika:**  
- Na podstawie danych PVGIS algorytm oblicza miesięczną produkcję dla danego kąta i azymutu, wyświetlając wykres.  
- Użytkownik widzi na bieżąco, jak zmiana kąta wpływa na produkcję w grudniu vs. czerwcu.  
  
**Efekt na ekranie:**  
- Wykres słupkowy 12 miesięcy – przy przesuwaniu suwaka słupki zmieniają wysokość.  
- Pod wykresem: *„Roczna produkcja: 4 200 kWh.”*

---

### 3.4. Montaż pionowy (ogrodzenie / elewacja) – tryb dedykowany  *(dawne 2.4)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera opcję *„Montaż pionowy (90°)”*.  
- Dodatkowo wprowadza: wysokość paneli nad gruntem, zacienienie od trawy/zasp (suwak *„wysokość trawy/zasp”*).  
  
**Gdzie ląduje:**  
- W tabeli `pv_mounting` – typ montażu, dodatkowe parametry cienia.  
  
**Jak działa logika:**  
- Zimą słońce świeci nisko – pionowe panele mają lepszy kąt padania, co kompensuje krótkie dni.  
- System oblicza straty letnie i zyski zimowe, pokazując bilans roczny.  
- Uwzględnia zacienienie dolnej krawędzi przez trawę, śnieg lub mury.  
  
**Efekt na ekranie:**  
- Wykres porównawczy: *„Montaż pionowy – strata latem 22%, zysk zimą 35%, rocznie o 5% więcej niż dach skośny.”*  
- Ostrzeżenie: *„Przy wysokości zaspy 40 cm dolne ogniwa będą zacienione – strata ok. 8%.”*

---

### 3.5. Dach płaski / grunt – geometria 3D, wiatr, śnieg  *(dawne 2.5)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera *„Dach płaski”* lub *„Grunt”*.  
- Wprowadza wymiary powierzchni, wysokość nad poziomem terenu.  
  
**Gdzie ląduje:**  
- W tabeli `flat_mounting` – wymiary, kąt, wysokość podniesienia.  
  
**Jak działa logika:**  
- Oblicza wysokość podniesienia górnej krawędzi: h = L · sin(α).  
- Oblicza pole powierzchni narażonej na wiatr („żagiel”) i siłę naporu: F = 0,5 · ρ · v² · A · Cd.  
- Ocenia ryzyko zalegania śniegu – kąty <30° utrudniają samooczyszczanie.  
- Sugeruje balast (płyty betonowe) lub kotwienie.  
- Szczegółowa analiza aerodynamiczna znajduje się w sekcji 2.12.  
  
**Efekt na ekranie:**  
- Rysunek przekroju panelu uniesionego nad dachem.  
- Parametry: *„Kąt 35° → podniesienie 1,2 m, napór wiatru 450 kg na moduł, wymagany balast 80 kg.”*  
- Ostrzeżenie: *„Przy kącie 45° siła ssania od spodu może zerwać panele – skonsultuj z konstruktorem.”*

---

### 3.6. Dach skośny – wybór połaci  *(dawne 2.6)*

  
**Skąd czerpie dane:**  
- Z modelu bryły budynku (rozdz. 0) – wszystkie połacie są już znane.  
- Użytkownik klika na wybraną połać w widoku 3D.  
  
**Gdzie ląduje:**  
- W tabeli `pitched_roof` – przypisanie paneli do konkretnej połaci.  
  
**Jak działa logika:**  
- System automatycznie odczytuje kąt i azymut tej połaci i używa ich w dalszych obliczeniach.  
- Użytkownik może zdecydować, czy wykorzystać całą połać, czy tylko jej część.  
  
**Efekt na ekranie:**  
- Podświetlona wybrana połać na modelu 3D.  
- Parametry: *„Połać południowo‑zachodnia, kąt 38°, azymut 210° – roczny uzysk 4,8 MWh.”*

---

### 3.7. Analiza wielopołaciowa (Omni‑Surface Analysis)  *(dawne 2.7)*

  
**Skąd czerpie dane:**  
- Z listy wszystkich dostępnych powierzchni (dach, ściany, ogrodzenia) z rozdz. 0.  
  
**Gdzie ląduje:**  
- W tabeli `surface_analysis` – dla każdej powierzchni wyliczona jest roczna produkcja (kWh) i procent efektywności.  
  
**Jak działa logika:**  
- System dla każdej powierzchni oblicza, ile kWh rocznie można uzyskać.  
- Użytkownik może zaznaczać/odznaczać powierzchnie, a główny sumaryczny uzysk jest aktualizowany.  
  
**Efekt na ekranie:**  
- Lista z checkboxami: *„Dach południowy: 4 200 kWh (92%)”, „Ogrodzenie wschodnie: 1 800 kWh (42%)”*.  
- Suma zaznaczonych powierzchni na żywo.

---

### 3.8. Porównanie: Tracker vs. konstrukcja stała  *(dawne 2.8)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera liczbę paneli dla obu opcji.  
- Wprowadza koszt trackera (mechanizm + fundament) oraz koszt dodatkowych paneli na stałym stelażu.  
  
**Gdzie ląduje:**  
- W tabeli `tracker_comparison` – parametry obu rozwiązań.  
  
**Jak działa logika:**  
- Oblicza roczny uzysk dla trackera (zwiększenie ok. 30–40%) i dla stałego stelaża z większą liczbą paneli.  
- Oblicza napór wiatru (dla trackera znacznie większy) oraz wymagany fundament.  
- Porównuje koszt całkowity i uzysk na złotówkę.  
  
**Efekt na ekranie:**  
- Tabela porównawcza:  
  | Parametr | Tracker (9 paneli) | Stały stelaż (15 paneli) |  
  |----------|--------------------|--------------------------|  
  | Koszt    | +6 000 zł          | tyle samo                |  
  | Uzysk roczny | 5 200 kWh      | 6 800 kWh                |  
  | Napór wiatru | 1 800 kg        | 450 kg                   |  
- Komentarz: *„Za cenę trackera możesz dokupić 6 paneli – uzysk o 30% większy, a ryzyko zerwania dużo mniejsze.”*

---

### 3.9. Wiata / carport / altana – optymalne ułożenie paneli  *(dawne 2.9)*

  
**Skąd czerpie dane:**  
- Użytkownik wpisuje wymiary prostokątnej powierzchni (długość, szerokość).  
- Wybiera orientację (dach płaski, jednospadowy).  
  
**Gdzie ląduje:**  
- W tabeli `carport_layout` – wymiary, liczba paneli, układ.  
  
**Jak działa logika:**  
- Algorytm optymalnego pakowania (bin packing) rozmieszcza wybrane panele na powierzchni.  
- Sugeruje minimalny kąt nachylenia (5–10°) dla samooczyszczania, ale uwzględnia estetykę.  
- Oblicza, czy dach wiaty wytrzyma obciążenie śniegiem.  
  
**Efekt na ekranie:**  
- Widok z góry z narysowanymi panelami.  
- Informacja: *„Na wiacie 6×4 m zmieścisz 8 paneli (układ 4×2) – uzysk 3,2 kWp.”*

---

### 3.10. Symulacja ilości paneli (3 warianty)  *(dawne 2.10)*

  
**Skąd czerpie dane:**  
- Z całkowitego zapotrzebowania dobowego (rozdz. 1) oraz danych PV i geometrii.  
  
**Gdzie ląduje:**  
- W tabeli `pv_sizing` – dla każdego wariantu liczba paneli, moc, powierzchnia.  
  
**Jak działa logika:**  
- System oblicza, ile paneli potrzeba, aby pokryć zapotrzebowanie w:  
  - *Minimum* – tylko miesiące letnie (na styk).  
  - *Optymalnie* – cały rok z uwzględnieniem wiosny/jesieni.  
  - *Z zapasem* – najgorszy miesiąc zimowy (zapas na mrozy).  
  
**Efekt na ekranie:**  
- Trzy kafelki:  
  - *Minimum: 12 paneli, 4,2 kWp, 22 m²*  
  - *Optymalnie: 16 paneli, 5,6 kWp, 30 m²*  
  - *Z zapasem: 22 panele, 7,7 kWp, 41 m²*  
- Użytkownik wybiera jeden do dalszych obliczeń.

---

### 3.11. Zimowy stress‑test napięciowy MPPT (Voc max)  *(dawne 2.11)*

  
**Skąd czerpie dane:**  
- Z danych panelu (Voc, współczynnik β) oraz z klimatycznego minimum temperatury (np. –25°C).  
  
**Gdzie ląduje:**  
- W tabeli `mppt_voltage_check` – maksymalne napięcie dla proponowanego układu stringów.  
  
**Jak działa logika:**  
- Oblicza napięcie w najzimniejszym dniu: Vmax = Voc · (1 + β · (Tmin – 25)).  
- Porównuje z maksymalnym napięciem wejściowym falownika / MPPT.  
- Jeśli Vmax > limit, ostrzega i sugeruje zmianę konfiguracji.  
  
**Efekt na ekranie:**  
- Alert: *„Przy –25°C napięcie stringu 8 paneli wyniesie 520 V – Twój MPPT ma limit 450 V! Zmień układ na 2 stringi po 4 panele.”*

---

### 3.12. Aerodynamika – napór wiatru i ssanie  *(dawne 2.12)*

  
**Skąd czerpie dane:**  
- Z danych lokalizacji (strefa wiatrowa, prędkość referencyjna v).  
- Z geometrii montażu (wysokość, kąt, powierzchnia paneli).  
  
**Gdzie ląduje:**  
- W tabeli `wind_load` – siły działające na każdy moduł.  
  
**Jak działa logika:**  
- Oblicza napór frontowy: F = 0,5 · ρ · v² · A · Cd (Cd dla paneli ok. 1,2–1,5).  
- Dodatkowo uwzględnia **siłę ssania** od spodu (efekt skrzydła) – szczególnie niebezpieczną dla paneli naziemnych.  
- Wylicza moment wywracający i wymagane obciążenie balastowe.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy wietrze 120 km/h na każdy panel działa siła 350 N do przodu i 280 N do góry – zastosuj balast 60 kg na moduł.”*

---

### 3.13. Mikropęknięcia termiczne (micro‑cracks)  *(dawne 2.13)*

  
**Skąd czerpie dane:**  
- Z konstrukcji montażowej – system sprawdza, czy uwzględniono podkładki dylatacyjne i luz między panelami.  
  
**Gdzie ląduje:**  
- W sekcji `thermal_stress` – ostrzeżenie, jeśli montaż jest sztywny.  
  
**Jak działa logika:**  
- Panele nagrzewają się do 65–70°C, a przy nagłym deszczu chłodzą się o 30°C w kilka minut – powstają naprężenia.  
- Jeśli panele są dokręcone na sztywno, aluminium i krzem rozszerzają się inaczej, co powoduje mikropęknięcia.  
- System wymusza użycie podkładek EPDM i pozostawienie szczelin dylatacyjnych.  
  
**Efekt na ekranie:**  
- Ostrzeżenie: *„Sztywny montaż bez dylatacji doprowadzi do mikropęknięć w ciągu 2 lat – zastosuj podkładki gumowe i odstępy 5 mm.”*

---

### 3.14. Straty na okablowaniu DC (efekt Joule’a)  *(dawne 2.14)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza długość kabla od paneli do falownika (m).  
- System zna prąd (Imp paneli) i napięcie (Vmp).  
  
**Gdzie ląduje:**  
- W tabeli `cable_loss` – spadek napięcia i strata mocy (%) dla kilku proponowanych przekrojów.  
  
**Jak działa logika:**  
- Oblicza rezystancję kabla: R = ρ · L / S (ρ dla miedzi = 0,0175 Ω·mm²/m).  
- Oblicza spadek napięcia: ΔU = I · R.  
- Strata mocy: P_strata = I² · R.  
- Sugeruje minimalny przekrój, aby strata była < 2–3%.  
  
**Efekt na ekranie:**  
- *„Dla odległości 30 m i prądu 15 A: kabel 4 mm² → strata 6%, 6 mm² → 4%, 10 mm² → 2,4%. Zalecamy 10 mm².”*  
- *„Strata roczna to ok. 80 kWh – przy cenie 1 zł/kWh to 80 zł/rok.”*

---

### 3.15. Zjawisko PID (degradacja indukowana napięciem)  *(dawne 2.15)*

  
**Skąd czerpie dane:**  
- Z konfiguracji stringów (liczba paneli szeregowo, napięcie całkowite względem ziemi).  
  
**Gdzie ląduje:**  
- W tabeli `pid_risk` – ostrzeżenie, jeśli napięcie systemu DC przekracza 400 V przy dużej wilgotności.  
  
**Jak działa logika:**  
- W długich stringach (np. 10 paneli szeregowo) napięcie względem ramy może przekroczyć 500 V. Przy wilgotnej pogodzie jony sodu ze szkła migrują, powodując trwałą utratę mocy.  
- System zaleca uziemienie konstrukcji i użycie paneli anty‑PID.  
  
**Efekt na ekranie:**  
- Ostrzeżenie: *„Twój string ma 600 V – ryzyko PID. Zalecamy uziemienie ramy lub wybór paneli anty‑PID.”*

---

### 3.16. Zarządzanie śniegiem i dostępność serwisowa  *(dawne 2.16)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (strefa śniegowa) i rodzaju montażu (dach, grunt).  
  
**Gdzie ląduje:**  
- W tabeli `snow_management` – uwzględniane w bilansie zimowym.  
  
**Jak działa logika:**  
- Panele na dachu skośnym mogą być całkowicie zasypane – produkcja spada do zera.  
- System sugeruje montaż części paneli na gruncie (łatwe do odśnieżenia) lub zastosowanie powłok hydrofobowych.  
  
**Efekt na ekranie:**  
- *„W Twojej strefie występuje 15 dni z opadem śniegu >10 cm. Panele dachowe będą nieproduktywne – rozważ dodanie 2–3 paneli naziemnych jako rezerwy.”*

---

### 3.17. Optymalizator „Złotego Środka” (sweet spot)  *(dawne 2.17)*

  
**Skąd czerpie dane:**  
- Z wszystkich poprzednich obliczeń: produkcja dla różnych kątów, napór wiatru, ryzyko śniegu.  
  
**Gdzie ląduje:**  
- W tabeli `optimum_angle` – wskazywany jest kąt minimalizujący sumaryczne ryzyko i koszty.  
  
**Jak działa logika:**  
- Algorytm nakłada na siebie trzy krzywe w funkcji kąta:  
  1. Produkcja roczna (kWh) – max przy ok. 35°.  
  2. Napór wiatru (kg) – rośnie z kątem.  
  3. Ryzyko zalegania śniegu – maleje z kątem.  
- Znajduje punkt kompromisowy.  
  
**Efekt na ekranie:**  
- Wykres radarowy lub trzy linie na jednym wykresie.  
- Komunikat: *„Twój Złoty Środek to kąt 22°. Stracisz tylko 6% energii w porównaniu do 35°, ale zmniejszysz napór wiatru o 55% i unikniesz ryzyka zerwania.”*

---

### 3.18. Kalkulator konstrukcji wsporczej (BOM)  *(dawne 2.18)*

  
**Skąd czerpie dane:**  
- Z wybranego układu paneli (ziemia, dach, wiata) i ich wymiarów.  
  
**Gdzie ląduje:**  
- W tabeli `support_structure` – generowana lista profili i akcesoriów.  
  
**Jak działa logika:**  
- Na podstawie wybranego typu montażu system tworzy listę materiałów (BOM – Bill of Materials): profile aluminiowe/stalowe, śruby, podkładki, balast.  
- Uwzględnia obciążenie śniegiem i wiatrem.  
- Sprawdza wymaganą szczelinę wentylacyjną (min. 10–15 cm) i informuje o skutkach przegrzania.  
  
**Efekt na ekranie:**  
- Szkic kratownicy i lista zakupowa.  
- *„Potrzebujesz X metrów profilu 40×40. Utrzymaj szczelinę 12 cm, inaczej latem panele osiągną 70°C i stracisz 18% mocy.”*

---

### 3.19. Połączenia szeregowe paneli PV – zasady, napięcie, prąd, ryzyka  *(dawne 2.19)*

  
**Skąd czerpie dane:**  
- Z parametrów paneli (Voc, Vmp, Isc, Imp) z funkcji 2.1.  
- Z liczby paneli w stringu.  
- Z parametrów wejściowych falownika (maksymalne napięcie DC, zakres MPPT).  
  
**Gdzie ląduje:**  
- W module `series_connection`.  
  
**Jak działa logika:**  
- System wyjaśnia, że w połączeniu szeregowym napięcia się sumują, a prąd pozostaje taki sam.  
- Oblicza napięcie stringu: V_string = Vmp × liczba paneli.  
- Sprawdza, czy napięcie nie przekracza maksymalnego napięcia wejściowego falownika (Voc w niskiej temperaturze).  
- Wskazuje, że prąd stringu jest równy prądowi najsłabszego panelu.  
- Ostrzega przed efektem „słabego ogniwa” – jeden zacieniony panel ogranicza cały string.  
  
**Efekt na ekranie:**  
- Schemat połączenia szeregowego.  
- Komunikat: *„6 paneli po 40 V i 10 A w szeregu da 240 V i 10 A. Twój falownik ma limit 600 V – OK.”*  
- Ostrzeżenie: *„Przy –20°C napięcie stringu wzrośnie do 265 V – sprawdź limit falownika.”*  
  
**Migawka:** *„O co chodzi? Szereg to jak pociąg – jedzie tak szybko, jak najwolniejszy wagon.”*  
  
**Powiązania:** Funkcja 2.20, 2.21, 2.24.

---

### 3.20. Połączenia równoległe paneli PV – zasady, napięcie, prąd, ryzyka  *(dawne 2.20)*

  
**Skąd czerpie dane:**  
- Z parametrów paneli (Voc, Vmp, Isc, Imp).  
- Z liczby paneli równoległych.  
- Z parametrów falownika (maksymalny prąd wejściowy).  
  
**Gdzie ląduje:**  
- W module `parallel_connection`.  
  
**Jak działa logika:**  
- System wyjaśnia, że w połączeniu równoległym prądy się sumują, a napięcie pozostaje takie samo.  
- Oblicza prąd całkowity: I_total = Imp × liczba paneli.  
- Sprawdza, czy prąd nie przekracza maksymalnego prądu wejściowego falownika.  
- Uwzględnia potrzebę zastosowania bezpieczników dla każdego stringu równoległego.  
- Ostrzega przed prądami wyrównawczymi przy łączeniu paneli o różnych parametrach.  
  
**Efekt na ekranie:**  
- Schemat połączenia równoległego.  
- Komunikat: *„3 panele po 40 V i 10 A równolegle dadzą 40 V i 30 A.”*  
- Ostrzeżenie: *„Przy łączeniu równoległym zastosuj bezpiecznik 15 A na każdy string.”*  
  
**Migawka:** *„O co chodzi? Równolegle to jak dodanie pasów ruchu – więcej prądu, ale napięcie to samo.”*  
  
**Powiązania:** Funkcja 2.19, 2.21, 2.38.

---

### 3.21. Połączenia mieszane szeregowo-równoległe – projektowanie stringów  *(dawne 2.21)*

  
**Skąd czerpie dane:**  
- Z liczby dostępnych paneli.  
- Z ograniczeń falownika (napięcie i prąd).  
- Z konfiguracji dachu lub gruntu.  
  
**Gdzie ląduje:**  
- W module `series_parallel_combination`.  
  
**Jak działa logika:**  
- System dobiera optymalny układ mieszany: np. 2 stringi po 6 paneli w szeregu, połączone równolegle.  
- Oblicza napięcie i prąd dla całego zestawu.  
- Sprawdza, czy mieszczą się w zakresie MPPT falownika.  
- Uwzględnia różne orientacje i zacienienie.  
  
**Efekt na ekranie:**  
- Schemat: *„2 stringi × 6 paneli = 240 V, 20 A. Mieści się w falowniku 600 V / 25 A.”*  
- Rekomendacja: *„Podziel panele na dwa stringi, aby zmniejszyć skutki zacienienia.”*  
  
**Migawka:** *„O co chodzi? Mieszany układ to elastyczność. Łączysz zalety szeregu i równoległego.”*  
  
**Powiązania:** Funkcja 2.19, 2.20, 2.27.

---

### 3.22. Wpływ diod bocznikujących na pracę panelu i stringu  *(dawne 2.22)*

  
**Skąd czerpie dane:**  
- Z budowy panelu i liczby diod bocznikujących.  
- Z konfiguracji stringu.  
  
**Gdzie ląduje:**  
- W module `bypass_diodes`.  
  
**Jak działa logika:**  
- System wyjaśnia, że diody bocznikujące pozwalają prądowi ominąć zacienioną część panelu.  
- Pokazuje, jak panel jest podzielony na sekcje (np. 3 sekcje z diodami).  
- Symuluje, co się dzieje, gdy jedna sekcja jest zacieniona – reszta panelu nadal pracuje.  
- Wskazuje, że diody chronią przed hot-spotami.  
  
**Efekt na ekranie:**  
- Schemat diod bocznikujących w panelu.  
- Komunikat: *„Zacienienie jednej sekcji panelu obniży moc o 33%, a nie o 100%, dzięki diodom bocznikującym.”*  
  
**Migawka:** *„O co chodzi? Diody to objazdy dla prądu. Dzięki nim cień nie zatrzymuje całego panelu.”*  
  
**Powiązania:** Funkcja 2.23, 2.49, 2.13.

---

### 3.23. Symulacja zacienienia jednego panelu w stringu  *(dawne 2.23)*

  
**Skąd czerpie dane:**  
- Z konfiguracji stringu (liczba paneli).  
- Z parametrów diod bocznikujących.  
- Z modelu zacienienia (funkcja 0.3).  
  
**Gdzie ląduje:**  
- W module `string_shading_simulation`.  
  
**Jak działa logika:**  
- System symuluje, jak cień na jednym panelu wpływa na cały string.  
- W szeregu prąd całego stringu spada do prądu zacienionego panelu.  
- Oblicza straty mocy w zależności od stopnia zacienienia.  
- Porównuje z połączeniem równoległym lub mikroinwerterami.  
  
**Efekt na ekranie:**  
- Wykres produkcji stringu przy zacienieniu.  
- Komunikat: *„Zacienienie jednego panelu w stringu 6 paneli obniży produkcję o 55%.”*  
- Ostrzeżenie: *„W mocno zacienionych miejscach lepiej zastosować mikroinwertery.”*  
  
**Migawka:** *„O co chodzi? Jeden cień potrafi położyć cały string. Sprawdź, zanim zamontujesz.”*  
  
**Powiązania:** Funkcja 2.22, 2.36, 2.49.

---

### 3.24. Dobór liczby paneli do konkretnego falownika (model, parametry)  *(dawne 2.24)*

  
**Skąd czerpie dane:**  
- Z bazy danych falowników (moc, napięcie MPPT, maksymalny prąd).  
- Z parametrów wybranych paneli.  
  
**Gdzie ląduje:**  
- W module `inverter_panel_matching`.  
  
**Jak działa logika:**  
- Użytkownik wybiera konkretny model falownika.  
- System sprawdza dopuszczalny zakres napięć i prądów wejściowych.  
- Oblicza minimalną i maksymalną liczbę paneli w stringu.  
- Sprawdza moc całkowitą i prąd stringu.  
- Daje rekomendację: „Możesz podłączyć 6–10 paneli w 1 stringu.”  
  
**Efekt na ekranie:**  
- Tabela: *„Falownik X: napięcie 120–450 V, prąd max 13 A. Dla paneli 40 V/10 A: min 4 panele, max 10 paneli.”*  
- Alert: *„Przy 10 panelach Voc w zimie przekroczy 450 V – maksymalnie 9 paneli.”*  
  
**Migawka:** *„O co chodzi? Nie zgaduj liczby paneli. Policz dokładnie pod swój falownik.”*  
  
**Powiązania:** Funkcja 2.19, 2.21, 2.25.

---

### 3.25. Zasada przewymiarowania DC/AC – kalkulator mocy paneli do falownika  *(dawne 2.25)*

  
**Skąd czerpie dane:**  
- Z mocy falownika (AC).  
- Z mocy paneli (DC).  
- Z lokalizacji i warunków nasłonecznienia.  
  
**Gdzie ląduje:**  
- W module `dc_ac_oversizing`.  
  
**Jak działa logika:**  
- System oblicza stosunek mocy DC do mocy AC (współczynnik przewymiarowania).  
- Zaleca typowo 1,1–1,3 dla instalacji off-grid.  
- Uwzględnia straty i niższą produkcję w lecie.  
- Wyjaśnia, że przewymiarowanie zwiększa produkcję w słoneczne dni, ale nadmiar jest obcinany.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twój falownik 5 kW może współpracować z panelami do 6,5 kWp (130%).”*  
- Ostrzeżenie: *„Zbyt duże przewymiarowanie skraca życie falownika.”*  
  
**Migawka:** *„O co chodzi? Panele rzadko dają pełną moc. Lekkie przewymiarowanie to więcej energii.”*  
  
**Powiązania:** Funkcja 2.24, 2.26, 2.27.

---

### 3.26. Ryzyko przewymiarowania i niedowymiarowania – skutki  *(dawne 2.26)*

  
**Skąd czerpie dane:**  
- Z konfiguracji paneli i falownika.  
  
**Gdzie ląduje:**  
- W module `sizing_risks`.  
  
**Jak działa logika:**  
- System analizuje skutki:  
  - Niedowymiarowanie: falownik nie pracuje na pełnej mocy, strata potencjału.  
  - Przewymiarowanie: falownik może się przegrzewać, skraca żywotność, obcina moc.  
- Pokazuje, jakie problemy są groźniejsze.  
  
**Efekt na ekranie:**  
- Tabela ryzyka.  
- Komunikat: *„Zbyt duże panele obciążają falownik. Zbyt małe – nie wykorzystasz mocy.”*  
  
**Migawka:** *„O co chodzi? Ekstrema są złe. Trzeba znaleźć złoty środek.”*  
  
**Powiązania:** Funkcja 2.25, 2.24, 4.3.

---

### 3.27. Dopasowanie napięcia i prądu stringów do wejść MPPT falownika  *(dawne 2.27)*

  
**Skąd czerpie dane:**  
- Z parametrów MPPT falownika (zakres napięć, prąd maksymalny).  
- Z parametrów stringów.  
  
**Gdzie ląduje:**  
- W module `mppt_matching`.  
  
**Jak działa logika:**  
- System sprawdza, czy napięcie stringu mieści się w zakresie MPPT.  
- Uwzględnia zimowy wzrost Voc i letni spadek Vmp.  
- Sprawdza, czy prąd nie przekracza maksymalnego prądu MPPT.  
- Ostrzega przed niedopasowaniem.  
  
**Efekt na ekranie:**  
- Wykres napięcia stringu w różnych temperaturach.  
- Alert: *„Przy –25°C napięcie stringu przekroczy górny zakres MPPT. Zmniejsz liczbę paneli.”*  
  
**Migawka:** *„O co chodzi? Falownik ma swój zakres pracy. Trzeba się w nim zmieścić.”*  
  
**Powiązania:** Funkcja 2.11, 2.24, 2.25.

---

### 3.28. Przegląd technologii: Half-Cut, PERC, TOPCon, HJT, N-type  *(dawne 2.28)*

  
**Skąd czerpie dane:**  
- Z bazy technologii paneli.  
  
**Gdzie ląduje:**  
- W module `pv_technologies`.  
  
**Jak działa logika:**  
- System opisuje technologie:  
  - Half-Cut: przecięcie ogniw na pół – mniejsze straty, lepsza praca przy zacienieniu.  
  - PERC: dodatkowa warstwa odbijająca – wyższa sprawność.  
  - TOPCon: technologia N-type – wyższa sprawność, niska degradacja.  
  - HJT: heterozłącza – bardzo wysoka sprawność.  
- Porównuje sprawność, koszt, trwałość.  
  
**Efekt na ekranie:**  
- Tabela: *„TOPCon: sprawność 22%, degradacja 0,4%/rok. PERC: 20%, degradacja 0,5%/rok.”*  
- Rekomendacja: *„Do off-gridu wybierz TOPCon lub HJT.”*  
  
**Migawka:** *„O co chodzi? Technologia paneli to nie marketing. Ma realny wpływ na produkcję.”*  
  
**Powiązania:** Funkcja 2.30, 2.34, 2.39.

---

### 3.29. Technologie anty-PID, LID, LETID – co to jest i dlaczego ważne  *(dawne 2.29)*

  
**Skąd czerpie dane:**  
- Z bazy technologii paneli i materiałów produkcyjnych.  
  
**Gdzie ląduje:**  
- W module `degradation_tech`.  
  
**Jak działa logika:**  
- System wyjaśnia trzy kluczowe zjawiska degradacji:  
  - **PID** – degradacja indukowana napięciem (napięcie panelu powoduje migrację jonów).  
  - **LID** – degradacja wywołana światłem (początkowa utrata mocy po pierwszych godzinach pracy).  
  - **LETID** – degradacja wywołana światłem i temperaturą (długotrwała, powolna).  
- Wskazuje, które technologie (np. TOPCon, HJT) są bardziej odporne.  
- Podaje, o ile mniejsze straty gwarantuje producent.  
  
**Efekt na ekranie:**  
- Tabela: *„PERC: LID do 3%, PID umiarkowane. TOPCon: LID <1%, PID niskie.”*  
- Rekomendacja: *„Do instalacji off-grid wybierz panele z certyfikatem anty-PID i niskim LID.”*  
  
**Migawka:** *„O co chodzi? Panele starzeją się od pierwszego dnia. Wybierz taki, który starzeje się wolniej.”*  
  
**Powiązania:** Funkcja 2.34, 2.28, 2.50.

---

### 3.30. Wpływ technologii paneli na roczny uzysk energii (procentowy)  *(dawne 2.30)*

  
**Skąd czerpie dane:**  
- Z bazy technologii paneli i ich sprawności.  
- Z danych nasłonecznienia dla lokalizacji.  
  
**Gdzie ląduje:**  
- W module `technology_energy_impact`.  
  
**Jak działa logika:**  
- System porównuje roczny uzysk dla różnych technologii:  
  - PERC: wzorzec (100%),  
  - Half-Cut: +2–3%,  
  - TOPCon: +5–8%,  
  - HJT: +8–12%.  
- Uwzględnia degradację w czasie.  
- Przelicza różnicę na kWh i złotówki.  
  
**Efekt na ekranie:**  
- Komunikat: *„TOPCon da Ci o 6% więcej energii rocznie niż PERC, czyli 250 kWh przy instalacji 4 kWp.”*  
- Alert: *„Różnica w cenie zwróci się po 3–5 latach.”*  
  
**Migawka:** *„O co chodzi? Lepsza technologia to realnie więcej prądu. Sprawdź, ile dokładnie.”*  
  
**Powiązania:** Funkcja 2.28, 2.34, 2.50.

---

### 3.31. Panele bifacjalne – analiza zysków z odbicia światła (poza śniegiem)  *(dawne 2.31)*

  
**Skąd czerpie dane:**  
- Z parametrów bifacjalności paneli (współczynnik bifacjalności, zwykle 70–90%).  
- Z powierzchni odbijającej (biała membrana, jasny beton, piasek, trawa).  
  
**Gdzie ląduje:**  
- W module `bifacial_albedo`.  
  
**Jak działa logika:**  
- System oblicza dodatkowy uzysk z tylnej strony panelu w zależności od albedo podłoża:  
  - biała membrana: +10–20%,  
  - jasny beton: +8–15%,  
  - piasek: +10–18%,  
  - trawa: +3–5%.  
- Uwzględnia wysokość montażu nad gruntem i kąt nachylenia.  
  
**Efekt na ekranie:**  
- Komunikat: *„Panele bifacjalne na jasnym betonie zyskają 12% energii rocznie.”*  
- Ostrzeżenie: *„Bez jasnego podłoża zysk z bifacjalności jest niewielki.”*  
  
**Migawka:** *„O co chodzi? Panele bifacjalne zbierają światło także z dołu. Daj im jasne tło, a odwdzięczą się mocą.”*  
  
**Powiązania:** Funkcja 2.28, 2.39, 6.21.

---

### 3.32. Straty niedopasowania (mismatch) – łączenie paneli o różnej mocy  *(dawne 2.32)*

  
**Skąd czerpie dane:**  
- Z parametrów paneli o różnej mocy i prądzie.  
- Z konfiguracji połączeń.  
  
**Gdzie ląduje:**  
- W module `mismatch_losses`.  
  
**Jak działa logika:**  
- System wyjaśnia, że w szeregu prąd ogranicza najsłabszy panel, a w równoległym napięcie.  
- Oblicza straty wynikające z połączenia paneli o różnych mocach.  
- Ostrzega przed łączeniem paneli o różnym prądzie w jednym stringu.  
- Zaleca łączenie paneli o zbliżonych parametrach.  
  
**Efekt na ekranie:**  
- Przykład: *„Panel 400 W (Imp 11 A) + panel 330 W (Imp 9 A) w szeregu da 2 × 9 A × 40 V = 720 W, zamiast 730 W – strata 1,4%.”*  
- Ostrzeżenie: *„Przy większej różnicy mocy straty rosną lawinowo.”*  
  
**Migawka:** *„O co chodzi? Mieszanie różnych paneli to marnowanie ich potencjału.”*  
  
**Powiązania:** Funkcja 2.19, 2.41, 2.22.

---

### 3.33. Wpływ temperatury na wydajność paneli – współczynnik temperaturowy w praktyce  *(dawne 2.33)*

  
**Skąd czerpie dane:**  
- Z współczynnika temperaturowego mocy (γ, zwykle –0,3%/°C do –0,45%/°C).  
- Z temperatury panelu i otoczenia.  
  
**Gdzie ląduje:**  
- W module `temperature_performance`.  
  
**Jak działa logika:**  
- System oblicza rzeczywistą moc panelu w danej temperaturze:  
  - P_rzeczywista = P_nominalna × (1 + γ × (T_panel – 25°C)).  
- Uwzględnia nagrzewanie panelu przez słońce (T_panel = T_otoczenia + 25–30°C).  
- Pokazuje, że w lecie panel traci moc, a zimą zyskuje.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy 35°C na zewnątrz panel ma 60°C i traci 15% mocy.”*  
- Wykres mocy w funkcji temperatury.  
  
**Migawka:** *„O co chodzi? Panele nie lubią upałów. Im chłodniej, tym lepiej pracują.”*  
  
**Powiązania:** Funkcja 2.44, 2.34, 2.50.

---

### 3.34. Degradacja paneli w czasie – LID, LETID, PID (pogłębiona symulacja)  *(dawne 2.34)*

  
**Skąd czerpie dane:**  
- Z typu paneli i ich odporności na degradację.  
- Z warunków środowiskowych (temperatura, wilgotność).  
  
**Gdzie ląduje:**  
- W module `panel_degradation_sim`.  
  
**Jak działa logika:**  
- System symuluje spadek mocy paneli rok po roku:  
  - LID: szybka degradacja w pierwszym roku,  
  - LETID: powolna degradacja w kolejnych latach,  
  - PID: degradacja zależna od napięcia systemu i wilgotności.  
- Pokazuje prognozę mocy po 10, 15, 25 latach.  
- Uwzględnia gwarancję producenta.  
  
**Efekt na ekranie:**  
- Wykres: *„Po 25 latach panel będzie miał 84% mocy początkowej.”*  
- Alert: *„Jeśli degradacja jest wyższa niż gwarantowana, sprawdź warunki pracy.”*  
  
**Migawka:** *„O co chodzi? Panele powoli umierają. Wiedz, ile stracisz w perspektywie lat.”*  
  
**Powiązania:** Funkcja 2.29, 2.30, 2.50.

---

### 3.35. Orientacja wschód-zachód – projektowanie stringów na dwóch połaciach  *(dawne 2.35)*

  
**Skąd czerpie dane:**  
- Z orientacji dachu i kątów połaci.  
- Z danych nasłonecznienia dla wschodu i zachodu.  
  
**Gdzie ląduje:**  
- W module `east_west_orientation`.  
  
**Jak działa logika:**  
- System projektuje stringi na dwóch połaciach (wschód i zachód).  
- Uwzględnia, że produkcja jest rozłożona bardziej równomiernie w ciągu dnia.  
- Oblicza spadek produkcji w porównaniu z południem (zwykle 80–90%).  
- Wskazuje, że takie rozwiązanie lepiej dopasowuje się do profilu zużycia.  
  
**Efekt na ekranie:**  
- Wykres produkcji w ciągu dnia.  
- Komunikat: *„Orientacja wschód-zachód da 85% energii południa, ale dłużej w ciągu dnia.”*  
  
**Migawka:** *„O co chodzi? Nie masz idealnego południa? Wschód-zachód też może być dobry.”*  
  
**Powiązania:** Funkcja 2.7, 2.3, 2.21.

---

### 3.36. Mikroinwertery vs. inwerter centralny – porównanie dla instalacji off-grid  *(dawne 2.36)*

  
**Skąd czerpie dane:**  
- Z parametrów inwerterów i mikroinwerterów.  
- Z konfiguracji paneli i zacienienia.  
  
**Gdzie ląduje:**  
- W module `micro_vs_central`.  
  
**Jak działa logika:**  
- System porównuje mikroinwertery (jeden na panel) z inwerterem centralnym.  
- Uwzględnia:  
  - odporność na zacienienie,  
  - monitoring na poziomie panelu,  
  - koszt,  
  - sprawność,  
  - niezawodność.  
- Rekomenduje rozwiązanie dla danego przypadku.  
  
**Efekt na ekranie:**  
- Tabela: *„Mikroinwerter: +lepsza praca przy cieniu, –wyższy koszt. Centralny: +tańszy, –słabszy przy cieniu.”*  
- Komunikat: *„Przy częściowym zacienieniu wybierz mikroinwertery.”*  
  
**Migawka:** *„O co chodzi? Cień to wróg instalacji. Mikroinwerter daje odporność.”*  
  
**Powiązania:** Funkcja 2.23, 2.49, 2.21.

---

### 3.37. Analiza wydajności MPPT – dopasowanie napięcia stringu do zakresu pracy falownika  *(dawne 2.37)*

  
**Skąd czerpie dane:**  
- Z zakresu napięć MPPT falownika.  
- Z napięcia stringu w różnych warunkach.  
  
**Gdzie ląduje:**  
- W module `mppt_efficiency`.  
  
**Jak działa logika:**  
- System sprawdza, czy napięcie stringu przez większość czasu mieści się w zakresie MPPT.  
- Uwzględnia, że poza zakresem MPPT falownik obniża moc lub wyłącza się.  
- Oblicza potencjalne straty z powodu niedopasowania.  
  
**Efekt na ekranie:**  
- Wykres napięcia stringu w ciągu roku.  
- Ostrzeżenie: *„Latem napięcie stringu spada poniżej dolnego zakresu MPPT – tracisz 5% energii.”*  
  
**Migawka:** *„O co chodzi? Falownik ma swój ulubiony zakres napięć. Trzymaj się go.”*  
  
**Powiązania:** Funkcja 2.27, 2.24, 2.25.

---

### 3.38. Ochrona stringów – dobór bezpieczników i diod blokujących  *(dawne 2.38)*

  
**Skąd czerpie dane:**  
- Z prądu zwarciowego paneli (Isc).  
- Z liczby stringów równoległych.  
- Z norm i zaleceń producentów.  
  
**Gdzie ląduje:**  
- W module `string_protection`.  
  
**Jak działa logika:**  
- System dobiera bezpieczniki dla każdego stringu (zazwyczaj 1,25 × Isc).  
- Wskazuje, kiedy potrzebne są diody blokujące (zapobiegają prądom wstecznym).  
- Uwzględnia ochronę przeciwprzepięciową (SPD).  
  
**Efekt na ekranie:**  
- Schemat: *„Każdy string z bezpiecznikiem 15 A DC.”*  
- Ostrzeżenie: *„Brak bezpieczników przy 3 stringach równoległych grozi pożarem przy zwarciu.”*  
  
**Migawka:** *„O co chodzi? Chroń każdy string, żeby awaria jednego nie spaliła reszty.”*  
  
**Powiązania:** Funkcja 4.28, 4.13, 4.5.

---

### 3.39. Powłoki antyrefleksyjne i teksturowane szkło – wpływ na uzysk  *(dawne 2.39)*

  
**Skąd czerpie dane:**  
- Z technologii szkła i powłok paneli.  
  
**Gdzie ląduje:**  
- W module `anti_reflective_coating`.  
  
**Jak działa logika:**  
- System wyjaśnia, że powłoka antyrefleksyjna zmniejsza odbicie światła, zwiększając ilość energii docierającej do ogniw.  
- Porównuje panele z powłoką i bez.  
- Podaje procentowy wzrost uzysku (zwykle 1–3%).  
  
**Efekt na ekranie:**  
- Komunikat: *„Powloka antyrefleksyjna zwiększa uzysk o 2,5% rocznie.”*  
- Ostrzeżenie: *„Z czasem powłoka może ulegać zabrudzeniu – myj panele delikatnie.”*  
  
**Migawka:** *„O co chodzi? Nie odbijaj słońca – wchłoń je. Powłoka pomaga.”*  
  
**Powiązania:** Funkcja 2.28, 2.30, 2.40.

---

### 3.40. Harmonogram czyszczenia paneli – kiedy i ile zyskujesz (live)  *(dawne 2.40)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (kurz, pył, liście, ptasie odchody).  
- Z produkcji PV i porównania z oczekiwaną.  
- Z prognozy opadów.  
  
**Gdzie ląduje:**  
- W module `cleaning_schedule`.  
  
**Jak działa logika:**  
- System monitoruje spadek produkcji spowodowany zabrudzeniem.  
- Zaleca czyszczenie, gdy strata przekracza 5–10%.  
- Uwzględnia opady – deszcz może naturalnie czyścić panele.  
- Tworzy harmonogram czyszczenia na cały rok.  
  
**Efekt na ekranie:**  
- Alert: *„Zabrudzenie paneli obniżyło produkcję o 8%. Zalecane mycie.”*  
- Harmonogram: *„Czyszczenie 2 razy w roku: wiosną i latem.”*  
  
**Migawka:** *„O co chodzi? Brudne panele to mniej prądu. Myj je, gdy się opłaca.”*  
  
**Powiązania:** Funkcja 2.39, 7.41, 2.50.

---

### 3.41. Łączenie paneli o różnych mocach i typach – analiza ryzyka  *(dawne 2.41)*

  
**Skąd czerpie dane:**  
- Z bazy paneli o różnych mocach, technologiach i parametrach elektrycznych.  
- Z konfiguracji połączeń (szeregowe, równoległe, mieszane).  
  
**Gdzie ląduje:**  
- W module `mixed_panel_risk`.  
  
**Jak działa logika:**  
- System porównuje parametry paneli: Vmp, Imp, Voc, Isc, moc.  
- W połączeniu szeregowym identyfikuje ryzyko strat wynikające z różnicy prądów.  
- W połączeniu równoległym identyfikuje ryzyko strat wynikające z różnicy napięć.  
- Oblicza potencjalne straty mocy i ryzyko przegrzewania się paneli.  
- Ostrzega przed łączeniem paneli o mocach różniących się o więcej niż 10–15%.  
  
**Efekt na ekranie:**  
- Tabela parametrów paneli i ich kompatybilności.  
- Alert: *„Panel 400 W (Imp 11 A) i panel 330 W (Imp 9 A) w jednym stringu: strata do 18%. Rozdziel je na osobne MPPT.”*  
- Rekomendacja: *„Jeśli musisz łączyć różne panele, połącz je równolegle, gdy mają zbliżone Vmp.”*  
  
**Migawka:** *„O co chodzi? Nie mieszaj paneli bez powodu. Każdy string ma działać jak zgrany zespół, a nie zbieranina.”*  
  
**Powiązania:** Funkcja 2.32, 2.19, 2.20.

---

### 3.42. Projektowanie instalacji z uwzględnieniem minimalnego napięcia startowego falownika  *(dawne 2.42)*

  
**Skąd czerpie dane:**  
- Z minimalnego napięcia startowego falownika.  
- Z napięcia roboczego paneli (Vmp) w wysokiej temperaturze.  
- Z liczby paneli w stringu.  
  
**Gdzie ląduje:**  
- W module `inverter_start_voltage`.  
  
**Jak działa logika:**  
- System sprawdza, czy string osiąga minimalne napięcie startowe falownika w najgorszych warunkach (lato, upał, rozgrzane panele).  
- Uwzględnia spadek napięcia paneli pod obciążeniem i w wysokiej temperaturze.  
- Oblicza minimalną liczbę paneli w stringu, aby falownik w ogóle wystartował.  
- Ostrzega przed zbyt krótkimi stringami.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twój falownik wymaga min. 150 V DC. Panele Vmp 35 V, w upał spada do 31 V. Potrzebujesz minimum 5 paneli w stringu.”*  
- Ostrzeżenie: *„Zbyt krótki string to falownik, który rano i wieczorem nie startuje.”*  
  
**Migawka:** *„O co chodzi? Falownik potrzebuje minimalnego napięcia, żeby ruszyć. Daj mu je.”*  
  
**Powiązania:** Funkcja 2.27, 2.24, 2.37.

---

### 3.43. Panele cienkowarstwowe vs. krystaliczne – porównanie technologii  *(dawne 2.43)*

  
**Skąd czerpie dane:**  
- Z bazy technologii paneli: amorficzne, CIGS, CdTe, mono, poli.  
  
**Gdzie ląduje:**  
- W module `thin_film_vs_crystalline`.  
  
**Jak działa logika:**  
- System porównuje panele cienkowarstwowe i krystaliczne pod kątem:  
  - sprawności,  
  - kosztu,  
  - współczynnika temperaturowego,  
  - odporności na cień,  
  - trwałości,  
  - powierzchni potrzebnej na 1 kWp.  
  
**Efekt na ekranie:**  
- Tabela: *„Krystaliczne: sprawność 19–22%, mniejsza powierzchnia. Cienkowarstwowe: sprawność 12–15%, lepsza praca przy słabym świetle.”*  
- Rekomendacja: *„Do off-gridu na dachu wybierz krystaliczne. Cienkowarstwowe sprawdzi się na dużej, równej powierzchni gruntu.”*  
  
**Migawka:** *„O co chodzi? Cienkowarstwowe są mniej wydajne, ale lepiej znoszą cień i upał. Wszystko zależy od miejsca.”*  
  
**Powiązania:** Funkcja 2.28, 2.33, 2.30.

---

### 3.44. Wpływ kąta nachylenia na zabrudzenie i samooczyszczanie paneli  *(dawne 2.44)*

  
**Skąd czerpie dane:**  
- Z kąta nachylenia paneli.  
- Z lokalizacji (opady, kurz, liście, ptasie odchody).  
  
**Gdzie ląduje:**  
- W module `tilt_cleaning_effect`.  
  
**Jak działa logika:**  
- System analizuje, jak kąt nachylenia wpływa na samooczyszczanie:  
  - kąt < 10°: woda i brud zalegają,  
  - kąt 15–30°: deszcz spłukuje kurz,  
  - kąt > 30°: śnieg i liście zsuwają się łatwiej.  
- Oblicza straty wynikające z zabrudzenia przy danym kącie.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy kącie 15° deszcz częściowo oczyści panele. Przy 35° śnieg zsunie się sam.”*  
- Ostrzeżenie: *„Panele poziome wymagają częstszego mycia.”*  
  
**Migawka:** *„O co chodzi? Kąt to nie tylko produkcja, ale i czystość. Panele na płasko brudzą się szybciej.”*  
  
**Powiązania:** Funkcja 2.40, 2.3, 2.33.

---

### 3.45. Dobór paneli do warunków nadmorskich i pylistych (odporność na korozję, PID)  *(dawne 2.45)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (bliskość morza, zapylenie, wilgotność).  
- Z bazy paneli z certyfikatami antykorozyjnymi i anty-PID.  
  
**Gdzie ląduje:**  
- W module `harsh_environment_pv`.  
  
**Jak działa logika:**  
- System sprawdza, czy panele są przystosowane do trudnych warunków:  
  - mgła solna (korozja ramek i połączeń),  
  - pył i piasek (rysowanie szkła),  
  - wysoka wilgotność (ryzyko PID).  
- Dobiera panele z odpowiednimi certyfikatami (IEC 61701 – mgła solna).  
- Zaleca dodatkowe środki: czyszczenie, kontrola złączek.  
  
**Efekt na ekranie:**  
- Komunikat: *„Do lokalizacji nadmorskiej wybierz panele z ramą anodowaną i certyfikatem anty-PID.”*  
- Ostrzeżenie: *„Sól niszczy złączki MC4 – stosuj złączki dedykowane do warunków morskich.”*  
  
**Migawka:** *„O co chodzi? Morze i pustynia to trudne środowisko. Nie każdy panel tam wytrzyma.”*  
  
**Powiązania:** Funkcja 2.29, 2.39, 4.35.

---

### 3.46. Analiza strat na złączkach i połączeniach MC4 w praktyce  *(dawne 2.46)*

  
**Skąd czerpie dane:**  
- Z liczby złączek MC4 w instalacji.  
- Z prądu stringu.  
- Z jakości połączeń (rezystancja styku).  
  
**Gdzie ląduje:**  
- W module `mc4_loss_analysis`.  
  
**Jak działa logika:**  
- System oblicza straty mocy na złączkach i połączeniach.  
- Uwzględnia, że każda złączka MC4 ma rezystancję ok. 0,5–2 mΩ.  
- Wskazuje, że luźne lub zaśniedziałe złączki mogą mieć rezystancję 10× większą.  
- Oblicza straty roczne i ryzyko przegrzania.  
  
**Efekt na ekranie:**  
- Komunikat: *„Przy 20 złączkach i prądzie 10 A straty wynoszą 2 W. Przy złym styku – 25 W i ryzyko pożaru.”*  
- Ostrzeżenie: *„Sprawdź złączki MC4 – to częsta przyczyna awarii.”*  
  
**Migawka:** *„O co chodzi? Małe złączki, duże znaczenie. Zły styk to ciepło i straty.”*  
  
**Powiązania:** Funkcja 4.21, 4.35, 7.38.

---

### 3.47. Zabezpieczenie przeciwprzepięciowe stringów PV – koordynacja z SPD  *(dawne 2.47)*

  
**Skąd czerpie dane:**  
- Z napięcia stringu i rodzaju instalacji odgromowej.  
- Z bazy SPD DC.  
  
**Gdzie ląduje:**  
- W module `pv_spd_coordination`.  
  
**Jak działa logika:**  
- System dobiera SPD DC do każdego stringu.  
- Uwzględnia napięcie Voc w niskiej temperaturze.  
- Dobiera SPD Typ 1 lub Typ 2 w zależności od obecności instalacji odgromowej.  
- Wskazuje miejsce montażu: w string boxie, przy falowniku.  
  
**Efekt na ekranie:**  
- Schemat: *„SPD Typ 2 DC w skrzynce stringowej, Uc 600 V, Up 2 kV.”*  
- Ostrzeżenie: *„Bez SPD przepięcie z pioruna spali MPPT.”*  
  
**Migawka:** *„O co chodzi? Piorun nie pyta. Zabezpiecz stringi, zanim uderzy.”*  
  
**Powiązania:** Funkcja 4.5, 4.7, 4.28.

---

### 3.48. Monitoring wydajności paneli na żywo – porównanie stringów  *(dawne 2.48)*

  
**Skąd czerpie dane:**  
- Z mierników na każdym stringu (lub MPPT falownika).  
- Z produkcji i napięcia stringów.  
  
**Gdzie ląduje:**  
- W module `string_live_monitoring`.  
  
**Jak działa logika:**  
- System porównuje produkcję poszczególnych stringów.  
- Wykrywa różnice wskazujące na awarię, cień lub brud.  
- Generuje alert, gdy jeden string produkuje mniej o >5% od pozostałych.  
  
**Efekt na ekranie:**  
- Wykres: *„String 1: 1,2 kW, String 2: 1,1 kW, String 3: 0,7 kW – sprawdź String 3.”*  
  
**Migawka:** *„O co chodzi? Widzisz, który string choruje, i możesz działać.”*  
  
**Powiązania:** Funkcja 7.21, 7.41, 4.28.

---

### 3.49. Wpływ zacienienia na diody bocznikujące – symulacja strat  *(dawne 2.49)*

  
**Skąd czerpie dane:**  
- Z konfiguracji paneli i diod bocznikujących.  
- Z modelu zacienienia (funkcja 0.3).  
  
**Gdzie ląduje:**  
- W module `bypass_shading_simulation`.  
  
**Jak działa logika:**  
- System symuluje różne scenariusze zacienienia:  
  - liść na jednej sekcji,  
  - cień komina,  
  - śnieg na dolnej części.  
- Oblicza straty mocy i prądu.  
- Pokazuje, kiedy diody bocznikujące chronią panel, a kiedy nie.  
  
**Efekt na ekranie:**  
- Wykres: *„Zacienienie 1 sekcji: strata 33%. Zacienienie 2 sekcji: strata 66%.”*  
- Ostrzeżenie: *„Cień na całej szerokości panelu potrafi wyłączyć cały string.”*  
  
**Migawka:** *„O co chodzi? Diody pomagają, ale nie są cudotwórcą. Cień nadal boli.”*  
  
**Powiązania:** Funkcja 2.23, 2.22, 2.36.

---

### 3.50. Kalkulator rocznego uzysku z uwzględnieniem technologii paneli (podsumowanie)  *(dawne 2.50)*

  
**Skąd czerpie dane:**  
- Z bazy technologii paneli, ich sprawności i degradacji.  
- Z danych nasłonecznienia dla lokalizacji.  
  
**Gdzie ląduje:**  
- W module `annual_yield_technology`.  
  
**Jak działa logika:**  
- System łączy wcześniejsze analizy:  
  - technologia paneli,  
  - degradacja,  
  - temperatura,  
  - kąt i orientacja,  
  - zacienienie.  
- Oblicza roczny uzysk dla wybranej instalacji.  
- Porównuje różne warianty technologiczne.  
  
**Efekt na ekranie:**  
- Tabela: *„PERC: 4,2 MWh/rok. TOPCon: 4,5 MWh/rok. HJT: 4,6 MWh/rok.”*  
- Rekomendacja: *„Dopłata do TOPCon zwróci się po 4 latach.”*  
  
**Migawka:** *„O co chodzi? Wszystko, co ustaliliśmy, w jednym wyniku rocznym.”*  
  
**Powiązania:** Funkcja 2.30, 2.34, 2.33.  
  
  
## Rozdział 3: Centrum magazynowania energii (baterie LiFePO4 i EV)

---

## Moduł 4 (Kafel 4): Magazyn energii / baterie

*Bez zmian względem v1.5 — dawny Rozdział 3.*

### 4.1. Dobór pojemności baterii  *(dawne 3.1)*

  
**Skąd czerpie dane:**  
- Z całkowitego zapotrzebowania dobowego (rozdz. 1) oraz wybranej liczby dni autonomii (1.9).  
- Uwzględnia sprawność falownika, głębokość rozładowania (DoD) i starzenie.  
  
**Gdzie ląduje:**  
- W tabeli `battery_sizing` – sugerowana pojemność użyteczna (kWh) i nominalna.  
  
**Jak działa logika:**  
- Pojemność użyteczna = (zapotrzebowanie dobowe × dni autonomii) / (sprawność falownika × DoD).  
- DoD dla LiFePO4 przyjmuje się 80–90%.  
- Dodawany jest bufor starzeniowy (np. +20% na 10 lat).  
  
**Efekt na ekranie:**  
- *„Twoje zapotrzebowanie to 12 kWh/dobę. Przy 3 dniach autonomii potrzebujesz 45 kWh użytecznej – ok. 6 akumulatorów 12V/200Ah (57,6 kWh nominalnie).”*

---

### 4.2. Sugestia napięcia systemowego (12/24/48V)  *(dawne 3.2)*

  
**Skąd czerpie dane:**  
- Z obciążenia szczytowego (W) i prądów rozruchowych (A).  
  
**Gdzie ląduje:**  
- W sekcji `system_voltage` – rekomendacja dla użytkownika.  
  
**Jak działa logika:**  
- Dla mocy > 3000 W zaleca się 48V (mniejsze prądy, cieńsze kable).  
- Dla małych instalacji (< 1000 W) może wystarczyć 12V.  
- System wylicza porównawczo wymagane przekroje kabli.  
  
**Efekt na ekranie:**  
- *„Twoje obciążenie szczytowe to 4,8 kW – rekomendujemy 48V. Przy 12V prąd 400 A, kabel 95 mm² – przy 48V to 100 A, kabel 25 mm².”*

---

### 4.3. Symulacja czasu ładowania / rozładowania  *(dawne 3.3)*

  
**Skąd czerpie dane:**  
- Z pojemności baterii, aktualnego SoC (lub zakładanego), mocy ładowania z PV oraz obciążenia.  
  
**Gdzie ląduje:**  
- W tabeli `battery_simulation` – generowane wykresy czasu.  
  
**Jak działa logika:**  
- Dla profilu dobowego i produkcji PV system oblicza, o której godzinie bateria osiągnie 100% i kiedy zacznie się rozładowywać.  
- Pokazuje, czy bateria wystarczy na całą noc.  
  
**Efekt na ekranie:**  
- Wykres liniowy: SoC w czasie, produkcja/zużycie.  
- *„Bateria naładuje się do pełna o 14:30, rozładowanie do 20% o 5:45 – masz zapas.”*

---

### 4.4. Moduł EV – ładowanie samochodu elektrycznego  *(dawne 3.4)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza pojemność baterii EV (kWh), dzienny przebieg, moc ładowarki (kW).  
  
**Gdzie ląduje:**  
- W tabeli `ev_charging` – dodatkowe zapotrzebowanie.  
  
**Jak działa logika:**  
- System wylicza, ile dodatkowej energii potrzeba na naładowanie EV (np. 50 kWh/tydzień).  
- Sprawdza, czy instalacja ma nadwyżki, by ładować auto w dzień, czy trzeba korzystać z baterii/agregatu.  
  
**Efekt na ekranie:**  
- *„Do naładowania EV potrzebujesz 10 kWh dziennie. Twoja instalacja ma nadwyżkę tylko latem – zimą będziesz musiał zwiększyć PV o 4 panele.”*

---

### 4.5. Grzałki BMS i ochrona przed mrozem (szczegóły)  *(dawne 3.5)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (minimalne temperatury) i parametrów BMS (pobór grzałek).  
- Dane wejściowe zostały już zebrane w sekcji 1.15 – tutaj następuje dobór konkretnych mat grzewczych i algorytmu sterowania.  
  
**Gdzie ląduje:**  
- W tabeli `bms_heating_log` – zapotrzebowanie na ogrzewanie w miesiącach zimowych.  
  
**Jak działa logika:**  
- Gdy temperatura spada poniżej 5°C, BMS włącza grzałki przed ładowaniem.  
- System dolicza ten pobór do bilansu dobowego (np. 0,5 kWh/dobę w styczniu).  
- Ostrzega, jeśli magazyn będzie stał w nieogrzewanym pomieszczeniu.  
  
**Efekt na ekranie:**  
- *„Magazyn w garażu nieogrzewanym – zimą dolicz 0,6 kWh/dobę na grzanie ogniw. Jeśli tego nie zrobisz, BMS zablokuje ładowanie przy mrozie.”*

---

### 4.6. Starzenie i degradacja ogniw (bufor)  *(dawne 3.6)*

  
**Skąd czerpie dane:**  
- Z suwaka *„horyzont projektowy”* (5/10/15 lat).  
  
**Gdzie ląduje:**  
- W module `aging_buffer` – pojemność nominalna powiększana o współczynnik degradacji.  
  
**Jak działa logika:**  
- LiFePO4 traci ok. 2–3% pojemności rocznie. Po 10 latach ma ok. 80% pojemności początkowej.  
- System dobiera baterię tak, aby po 10 latach nadal miała wymaganą pojemność użyteczną.  
  
**Efekt na ekranie:**  
- *„Na dziś potrzebujesz 45 kWh użytecznej, ale za 10 lat będzie to 56 kWh – zamów akumulator o pojemności 60 kWh.”*

---

### 4.7. Obwód Pre-Charge (Ładowanie wstępne)  *(dawne 3.7)*

  
**Skąd czerpie dane:**  
- Z parametrów falownika (pojemność wejściowa DC `C` w µF) z bazy danych komponentów oraz z napięcia systemowego `V_sys` (np. 48V).  
  
**Gdzie ląduje:**  
- W module `battery_connection` (Schemat elektryczny i instrukcja montażu).  
  
**Jak działa logika:**  
- Silnik wykrywa, że użytkownik zamierza podłączyć falownik do baterii.  
- Oblicza energię uderzenia prądu ładowania kondensatorów wejściowych.  
- Dobiera rezystor wstępny `R_pre` ograniczający prąd do bezpiecznego poziomu (np. 5A) oraz czas ładowania kondensatorów `T = 5 * R_pre * C`.  
- Generuje algorytm załączenia: "Najpierw obwód przez rezystor -> czekaj X sekund -> dopiero wtedy załącz główny bezpiecznik/stycznik".  
  
**Efekt na ekranie:**  
- Alert: *"UWAGA! Bez obwodu pre-charge zaiskrzy i uszkodzisz styki bezpiecznika DC."*  
- Rekomendacja: *"Zastosuj rezystor 50Ω / 50W. Czas wstępnego ładowania: 3 sekundy. Poczekaj, aż zgaśnie dioda falownika."*  
- **Powiązania:** Funkcja 4.3 (Dobór mocy falownika).

---

### 4.8. Symulacja "Słabego Ogniwa" (Cell Drift & Ballancing)  *(dawne 3.8)*

  
**Skąd czerpie dane:**  
- Z liczby ogniw w szeregu (np. `16S`), pojemności znamionowej (Ah) oraz opcjonalnego pomiaru napięć z BMS (w trybie live).  
  
**Gdzie ląduje:**  
- W module `cell_balance`.  
  
**Jak działa logika:**  
- System symuluje rozładowanie pakietu. Zakłada tolerancję pojemności ogniw z fabryki (np. ±3%).  
- Algorytm identyfikuje scenariusz, w którym jedno ogniwo ma najmniejszą pojemność. Oblicza moment, w którym to ogniwo spadnie do napięcia odcięcia (np. 2.5V), podczas gdy reszta ma jeszcze zapas.  
- Oblicza "utraconą energię" pakietu (użyteczna pojemność = pojemność najsłabszego ogniwa).  
  
**Efekt na ekranie:**  
- Wykres napięć ogniw w funkcji rozładowania.  
- Komunikat: *"Twoja bateria nominalnie ma 10 kWh, ale przez słabe ogniwo #12 wykorzystasz tylko 8.8 kWh. Aby to naprawić, system rekomenduje balanser aktywny o prądzie 2A."*  
- **Migawka:** *"O co chodzi? To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł."*

---

### 4.9. Detekcja Zwarcia i Zabezpieczenia Półprzewodnikowe (e-Fuse)  *(dawne 3.9)*

  
**Skąd czerpie dane:**  
- Z prądu zwarciowego akumulatora (wynikającego z rezystancji wewnętrznej ogniw) oraz impedancji pętli zwarcia.  
  
**Gdzie ląduje:**  
- W module `protection_devices` (jako rozszerzenie dla BMS).  
  
**Jak działa logika:**  
- System porównuje czas reakcji standardowego bezpiecznika (np. `t = 10 ms`) z czasem zadziałania elektronicznego wyłącznika (e-Fuse, `t = < 100 µs`).  
- Jeśli prąd zwarciowy przekracza zdolność łączeniową pojedynczych tranzystorów, system wymusza zastosowanie bezpiecznika półprzewodnikowego w BMS.  
  
**Efekt na ekranie:**  
- Ostrzeżenie: *"Przy zwarciu w twoim systemie popłynie prąd 5000A. Zwykły bezpiecznik ANL wyłączy to w 20 ms (za wolno!). Twój BMS musi mieć funkcję e-Fuse (wyłączenie natychmiastowe)."*  
- **Powiązania:** Funkcja 4.2 (Dobór bezpieczników).

---

### 4.10. Gaszenie i Wentylacja Komory (Pożar Klasy B)  *(dawne 3.10)*

  
**Skąd czerpie dane:**  
- Z chemii baterii (LiFePO4), wymiarów komory baterii (wpisane przez użytkownika) i mocy strat cieplnych (z bilansu).  
  
**Gdzie ląduje:**  
- W module `battery_room_safety`.  
  
**Jak działa logika:**  
- System wylicza wymagany przepływ powietrza (wymiany na godzinę) do odprowadzenia ciepła i ewentualnych gazów (elektrolit).  
- Sprawdza, czy w bezpośrednim sąsiedztwie magazynu nie ma materiałów palnych (konfiguracja z Rozdz. 0).  
- Rekomenduje środek gaśniczy (dla LiFePO4 tlenek węgla i pył nie działają na wewnętrzną reakcję chemiczną).  
  
**Efekt na ekranie:**  
- *"Twoja komora 2m x 1m x 1m wymaga otworu wentylacyjnego 15x15 cm (nawiew i wywiew)."*  
- *"Jedyny skuteczny środek gaśniczy dla pakietu LiFePO4 to agregat wodny/mgłowy lub specjalny środek do magazynów energii. Piasek przyda się tylko do zasypania wycieku."*  
- **Notatka:** System nie tyle liczy, co edukuje i wymusza poprawną konfigurację.

---

### 4.11. Ochrona przed wilgocią i kondensacją  *(dawne 3.11)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (temperatura minimalna, wilgotność względna powietrza – dane z Rozdziału 0), z wymiarów i szczelności obudowy baterii (wpisane przez użytkownika) oraz z temperatury ogniw (w trybie live z BMS).  
  
**Gdzie ląduje:**  
- W module `battery_housing` (projekt obudowy i montażu).  
  
**Jak działa logika:**  
- Algorytm wylicza **punkt rosy** dla zadanej temperatury i wilgotności. Jeśli temperatura obudowy lub ogniw spada poniżej punktu rosy, system uznaje ryzyko kondensacji za wysokie.  
- Sprawdza stopień ochrony obudowy (IP). Dla miejsc narażonych na wilgoć (garaż, komora zewnętrzna) wymusza minimum IP55.  
- Jeśli wykryje ryzyko, proponuje rozwiązania: grzałka antykondensacyjna o niewielkiej mocy (np. 20–30 W) sterowana termostatem, osuszacz powietrza w komorze lub przeniesienie baterii.  
  
**Efekt na ekranie:**  
- Alert: *"W grudniu przy temp. –5°C i wilgotności 85% punkt rosy to –7°C. Twoja obudowa osiągnie –6°C – w środku wykropli się woda. Zalecam grzałkę antykondensacyjną 25 W sterowaną czujnikiem wilgotności."*  
- Wizualizacja obudowy z oznaczeniem miejsc newralgicznych.  
- **Migawka:** *"O co chodzi? Mokry BMS i miedziane szyny to zwarcie. Nie dopuszczamy do tego."*  
- **Powiązania:** Funkcja 3.5 (Grzałki BMS), Rozdział 0.1 (Warunki klimatyczne).

---

### 4.12. Moment dokręcania śrub (Torque Control)  *(dawne 3.12)*

  
**Skąd czerpie dane:**  
- Z bazy ogniw LiFePO4 (typ terminala: M6, M8, M10) i rekomendacji producenta.  
  
**Gdzie ląduje:**  
- W module `assembly_instructions` (instrukcja montażu i checklista).  
  
**Jak działa logika:**  
- System przypisuje do każdego połączenia śrubowego prawidłowy moment dokręcania (np. M8 – 8 N·m, M6 – 4 N·m).  
- Generuje ostrzeżenie o użyciu klucza dynamometrycznego. Dodatkowo podpowiada, aby nie stosować podkładek sprężystych bezpośrednio na terminalu i nie używać pasty miedziowej na aluminium.  
  
**Efekt na ekranie:**  
- W checkliście montażowej: *"Ogniwo EVE 280Ah – terminal M6, dokręć kluczem dynamometrycznym na 4,5 N·m. Sprawdź ponownie po 24 h (osiadanie)."*  
- Alert: *"Nie używaj klucza udarowego!"*  
- **Migawka:** *"O co chodzi? Śruba to sprężyna. Musisz ją naciągnąć dokładnie tyle, ile trzeba, żeby docisnęła końcówkę kablową."*  
- **Powiązania:** Funkcja 4.1 (Dobór przewodów), Funkcja 3.8 (Słabe ogniwo).

---

### 4.13. Ograniczenie prądu ładowania w mrozie (Cold C-Rate)  *(dawne 3.13)*

  
**Skąd czerpie dane:**  
- Z aktualnej temperatury ogniw (z BMS), z konfiguracji pakietu (pojemność w Ah) oraz z krzywej limitów C-rate.  
  
**Gdzie ląduje:**  
- W module `charging_control` (ograniczenia dla MPPT i falownika).  
  
**Jak działa logika:**  
- System wyznacza maksymalny prąd ładowania w zależności od temperatury ogniwa (np. poniżej –10°C: blokada; –10°C do 0°C: max 0,1C; 0°C do 5°C: max 0,2C; powyżej 10°C: pełny prąd).  
- Wysyła sygnał sterujący do ładowarki/MPPT, aby ta nie pobierała więcej, niż mogą przyjąć ogniwa.  
- W symulacji zimowej pokazuje, jak te ograniczenia wydłużają czas ładowania w grudniu.  
  
**Efekt na ekranie:**  
- Wykres krzywej C-rate vs. temperatura.  
- Komunikat: *"Dzisiaj rano przy –5°C bateria 280Ah może być ładowana prądem maks. 28 A. Pełne naładowanie zajmie 6 godzin zamiast 2."*  
- **Migawka:** *"O co chodzi? W lodówce miód ledwo leci. W baterii jony litu też się wolniej poruszają."*  
- **Powiązania:** Funkcja 3.5 (Grzałki BMS), Rozdział 6 (Stress test zimowy).

---

### 4.14. Inteligentne zasilanie grzałek BMS (PV vs Bateria)  *(dawne 3.14)*

  
**Skąd czerpie dane:**  
- Z bieżącej produkcji PV (z inwertera/MPPT), poziomu naładowania baterii (SoC) oraz temperatury ogniw.  
  
**Gdzie ląduje:**  
- W module `heating_logic` (algorytm decyzyjny).  
  
**Jak działa logika:**  
- Algorytm podejmuje decyzję:  
  - **Jest produkcja PV:** grzałki zasilane są bezpośrednio z paneli.  
  - **Nie ma PV, ale SoC > 30%:** grzanie z baterii, ale tylko do osiągnięcia minimalnej temperatury ładowania (np. +5°C).  
  - **Nie ma PV i SoC < 30%:** grzanie wstrzymane, system przechodzi w tryb uśpienia.  
- Uwzględnia bezwładność cieplną pakietu.  
  
**Efekt na ekranie:**  
- Diagram decyzyjny.  
- Komunikat: *"Jutro o 7:00 zacznie świecić słońce. Grzałki włączą się o 6:45 z baterii tylko na 15 minut, aby o 7:00 ogniwa miały 0°C i mogły przyjąć pełny prąd z PV."*  
- **Migawka:** *"O co chodzi? Nie marnuj prądu z baterii na grzanie, jeśli za chwilę słońce zrobi to za darmo."*  
- **Powiązania:** Funkcja 3.5, Funkcja 2.10, Funkcja 7.1.

---

### 4.15. Algorytm końca ładowania (Tail Current / Absorption)  *(dawne 3.15)*

  
**Skąd czerpie dane:**  
- Z ustawień ładowarki/MPPT (napięcie absorbcji, prąd końcowy), z pojemności baterii oraz z aktualnego prądu ładowania i napięcia ogniw.  
  
**Gdzie ląduje:**  
- W module `charging_algorithm`.  
  
**Jak działa logika:**  
- System definiuje cykl ładowania LiFePO4: najpierw stały prąd (CC) do osiągnięcia napięcia absorbcji (np. 3,55 V/ogniwo), potem stałe napięcie (CV) do momentu, aż prąd spadnie do progu końcowego (np. 0,05C).  
- Oblicza czas trwania fazy CV. Jeżeli użytkownik ustawi zbyt wysoki prąd końcowy, system ostrzeże, że bateria nie zostanie naładowana do pełna.  
  
**Efekt na ekranie:**  
- Wykres prądu i napięcia w czasie.  
- Komunikat: *"Bateria osiągnie 3,55 V/ogniwo o 13:20, ale pełne naładowanie nastąpi dopiero o 15:40, gdy prąd spadnie do 14 A. Nie odłączaj ładowania zbyt wcześnie!"*  
- **Migawka:** *"O co chodzi? To jak napełnianie butelki. Ciśnienie już jest, ale trzeba chwilę odczekać, żeby woda dotarła do końca."*  
- **Powiązania:** Funkcja 3.3, Funkcja 2.10.

---

### 4.16. SoH (State of Health) – prognoza śmierci baterii  *(dawne 3.16)*

  
**Skąd czerpie dane:**  
- Z historii pracy baterii (liczba cykli, średnia temperatura, średnie DoD, prądy) zapisywanej przez BMS.  
  
**Gdzie ląduje:**  
- W module `battery_health`.  
  
**Jak działa logika:**  
- System wyznacza aktualną pojemność użyteczną (metoda coulombowska) i porównuje ją z pojemnością znamionową.  
- Uwzględnia degradację kalendarzową i cykliczną. Prognozuje, kiedy bateria osiągnie np. 70% pojemności początkowej.  
  
**Efekt na ekranie:**  
- Wskaźnik zużycia: *"Twoja bateria ma 87% SoH. Przewidywany koniec życia: sierpień 2031. W obecnym tempie zimą 2031 będziesz miał deficyt 4 kWh/dobę."*  
- Wykres degradacji w czasie.  
- **Migawka:** *"O co chodzi? Bateria to nie drzewo – umiera powoli i systematycznie."*  
- **Powiązania:** Funkcja 3.6, Rozdział 6, Funkcja 7.3.

---

### 4.17. Cold Cranking Amps (Zimny start dużych odbiorników)  *(dawne 3.17)*

  
**Skąd czerpie dane:**  
- Z temperatury ogniw, prądu rozruchowego odbiornika, rezystancji wewnętrznej ogniw oraz minimalnego napięcia wejściowego falownika.  
  
**Gdzie ląduje:**  
- W module `cold_start_analysis`.  
  
**Jak działa logika:**  
- System symuluje skok napięcia przy rozruchu: `V_sag = V_oc - I_rozruch * R_wewn`. Jeśli `V_sag` spadnie poniżej minimalnego napięcia pracy falownika, falownik wyłączy się.  
- Sprawdza, czy BMS dopuści taki chwilowy prąd.  
- Sugeruje rozwiązania: podgrzanie baterii, superkondensatory, miękki start.  
  
**Efekt na ekranie:**  
- Wykres spadku napięcia w czasie.  
- Alert: *"Przy –20°C napięcie na pakiecie podczas startu pompy spadnie do 40,5 V. Falownik wyłączy się. Zalecam podgrzanie ogniw do min. 5°C lub zastosowanie soft‑startu."*  
- **Migawka:** *"O co chodzi? Zimna bateria to leniwa chemia."*  
- **Powiązania:** Funkcja 3.13, Funkcja 1.11, Funkcja 4.3.

---

### 4.18. Tryb "Long Term Storage" (Odstawienie na zimę)  *(dawne 3.18)*

  
**Skąd czerpie dane:**  
- Z planowanego okresu nieobecności, temperatury w miejscu przechowywania, możliwości doładowania.  
  
**Gdzie ląduje:**  
- W module `storage_mode`.  
  
**Jak działa logika:**  
- System generuje procedurę odstawienia: naładuj do 50–60% SoC, odłącz od falownika i obciążeń, wyłącz lub uśpij BMS, zabezpiecz przed mrozem.  
- Jeśli jest dostępny mały panel podtrzymujący, system zaproponuje minimalne ładowanie kompensujące samorozładowanie.  
- Sprawdza, czy temperatura nie spadnie poniżej –20°C.  
  
**Efekt na ekranie:**  
- Checklista krok po kroku.  
- Komunikat: *"Naładuj do 55%, odłącz BMS, upewnij się, że temperatura nie spadnie poniżej –20°C. Po powrocie bateria straci mniej niż 2% pojemności."*  
- **Migawka:** *"O co chodzi? Bateria to jak roślina – nie lubi być ani sucha, ani zalana."*  
- **Powiązania:** Funkcja 1.8, Funkcja 3.16, Funkcja 0.1.

---

### 4.19. Analiza Second-Life (Używane baterie z EV)  *(dawne 3.19)*

  
**Skąd czerpie dane:**  
- Od użytkownika: deklarowana pojemność, cena zakupu, wiek, liczba przejechanych kilometrów, typ chemii.  
  
**Gdzie ląduje:**  
- W module `second_life_battery`.  
  
**Jak działa logika:**  
- System szacuje realny SoH na podstawie wieku i przebiegu (ok. 2–3% rocznie lub ok. 1% na 10 000 km).  
- Porównuje realną pojemność użyteczną z pojemnością nowej baterii LiFePO4.  
- Wylicza koszt 1 kWh użytecznej w perspektywie pozostałego życia.  
  
**Efekt na ekranie:**  
- Alert: *"Deklarowana pojemność 10 kWh, ale realny SoH szacowany na 72% → 7,2 kWh użyteczne. Cena 6000 zł za 7,2 kWh = 833 zł/kWh. Nowa LiFePO4 kosztuje 1200 zł/kWh, ale ma 100% SoH i 10 lat życia."*  
- Wykres porównawczy.  
- **Migawka:** *"O co chodzi? Kupujesz kota w worku."*  
- **Powiązania:** Funkcja 3.16, Funkcja 3.25.

---

### 4.20. Łączenie równoległe różnych baterii (Mixing)  *(dawne 3.20)*

  
**Skąd czerpie dane:**  
- Z parametrów obu baterii: pojemność, rezystancja wewnętrzna, napięcie nominalne, typ chemii, wiek/SoH.  
  
**Gdzie ląduje:**  
- W module `battery_parallel_connection`.  
  
**Jak działa logika:**  
- System sprawdza różnicę napięć i rezystancji. Jeśli różnica napięć > 0,2 V, ostrzega przed iskrzeniem.  
- Oblicza prąd wyrównawczy: `I = ΔV / (R1 + R2)`. Jeśli przekracza bezpieczny prąd, blokuje połączenie.  
- Symuluje nierównomierny rozkład prądu – starsza bateria będzie oddawać mniej.  
  
**Efekt na ekranie:**  
- Alert: *"Nowa bateria 200Ah + stara 200Ah (SoH 70%) to zły pomysł. Stara będzie miała wyższą rezystancję, nowa będzie oddawać 60% prądu."*  
- Schemat połączeń z zaznaczonymi prądami.  
- **Migawka:** *"O co chodzi? To jak zaprzęgnięcie konia pociągowego z kucykiem – jeden pociągnie więcej i padnie."*  
- **Powiązania:** Funkcja 3.8, Funkcja 4.2, Funkcja 3.16.

---

### 4.21. Vehicle-to-Home (V2H) – Off-Grid na kółkach  *(dawne 3.21)*

  
**Skąd czerpie dane:**  
- Od użytkownika: model samochodu, pojemność baterii trakcyjnej, typ złącza, oraz od producenta falownika (obsługa V2H/V2G).  
  
**Gdzie ląduje:**  
- W module `v2h_integration`.  
  
**Jak działa logika:**  
- System sprawdza kompatybilność: czy samochód wspiera V2H, czy tylko V2L.  
- Oblicza realną pojemność dostępną dla domu (rezerwa na dojazd, degradacja, straty).  
- Porównuje koszt energii z baterii trakcyjnej z kosztem energii z domowej baterii lub agregatu.  
  
**Efekt na ekranie:**  
- Komunikat: *"Twój samochód ma baterię 80 kWh, ale wspiera tylko V2L (max 3,6 kW). Nie zasilisz całego domu. Do V2H potrzebujesz CHAdeMO i specjalnej ładowarki."*  
- Tabela: *"Ile energii realnie oddasz: 40 kWh. Koszt 1 kWh z baterii EV: 2,1 zł."*  
- **Migawka:** *"O co chodzi? Auto może być powerbankiem, ale to zużywa jego baterię."*  
- **Powiązania:** Funkcja 3.4, Funkcja 3.25.

---

### 4.22. Komunikacja BMS – CAN/RS485/Modbus  *(dawne 3.22)*

  
**Skąd czerpie dane:**  
- Z bazy danych komponentów (protokoły obsługiwane przez BMS i falownik/ładowarkę).  
  
**Gdzie ląduje:**  
- W module `bms_communication`.  
  
**Jak działa logika:**  
- System porównuje protokoły: CAN, RS485/Modbus, UART.  
- Sprawdza kompatybilność. Jeśli BMS mówi po RS485, a falownik po CAN, system wskazuje konwerter.  
- Generuje listę parametrów do monitorowania.  
- Uwzględnia redundancję: w razie zaniku komunikacji falownik ma przejść w tryb bezpieczny.  
  
**Efekt na ekranie:**  
- Diagram połączeń: *"BMS → RS485 → konwerter → CAN → falownik Victron"*  
- Ostrzeżenie: *"Ten BMS nie obsługuje protokołu Pylontech, więc falownik nie odczyta SoC. Potrzebny konwerter za 150 zł."*  
- **Migawka:** *"O co chodzi? Komputery muszą się dogadać."*  
- **Powiązania:** Funkcja 4.3, Funkcja 7.1.

---

### 4.23. Pozycjonowanie ogniw (Cell Compression / Swelling)  *(dawne 3.23)*

  
**Skąd czerpie dane:**  
- Z typu ogniw, wymiarów pakietu, prądów oraz temperatury pracy.  
  
**Gdzie ląduje:**  
- W module `cell_compression`.  
  
**Jak działa logika:**  
- System sprawdza, czy ogniwa wymagają docisku (dla pryzmatycznych LiFePO4 zalecany docisk 300–400 kgf).  
- Generuje schemat: płyta dociskowa + pręty gwintowane + sprężyny talerzowe.  
- Uwzględnia dylatację: ogniwa rosną o 1–2% podczas ładowania.  
  
**Efekt na ekranie:**  
- Rysunek 3D pakietu z zaznaczonymi punktami docisku.  
- Komunikat: *"Dla pakietu 16S 280Ah zastosuj 4 pręty M8. Docisk 3 N·m, ale zostaw 1 mm luzu na pęcznienie."*  
- **Migawka:** *"O co chodzi? Ogniwa lubią być trzymane stabilnie, ale nie jak w imadle."*  
- **Powiązania:** Funkcja 3.8, Funkcja 3.12, Funkcja 4.4.

---

### 4.24. Pobór własny BMS i tryb uśpienia (Deep Sleep)  *(dawne 3.24)*

  
**Skąd czerpie dane:**  
- Z parametrów BMS (pobór w trybie pracy, pobór w trybie uśpienia), liczby ogniw, trybu użytkowania.  
  
**Gdzie ląduje:**  
- W module `bms_self_consumption`.  
  
**Jak działa logika:**  
- System sumuje pobór stały BMS (np. 5–15 W w pracy, 0,5–1 W w deep sleep).  
- Oblicza dobową i roczną stratę energii.  
- Proponuje strategię: w trybie weekendowym lub zimowym przechodzenie BMS w stan głębokiego uśpienia.  
  
**Efekt na ekranie:**  
- Bilans: *"Twój BMS zużywa 7 W ciągle = 61 kWh rocznie. Przejście w deep sleep zmniejszy to do 0,024 kWh/dobę."*  
- Podpowiedź: *"Wyłącz Bluetooth i diody, jeśli nie używasz."*  
- **Migawka:** *"O co chodzi? BMS to też odbiornik."*  
- **Powiązania:** Funkcja 1.12, Funkcja 3.16, Funkcja 7.1.

---

### 4.25. Analiza opłacalności magazynu (True Cost of Storage)  *(dawne 3.25)*

  
**Skąd czerpie dane:**  
- Z ceny baterii, pojemności użytecznej, liczby cykli przy danym DoD, sprawności oraz kosztu agregatu.  
  
**Gdzie ląduje:**  
- W module `cost_analysis`.  
  
**Jak działa logika:**  
- System wylicza całkowity koszt magazynu.  
- Oblicza całkowitą energię oddaną w życiu (pojemność × cykle × sprawność).  
- Dzieli koszt przez energię, otrzymując **koszt 1 kWh z baterii**.  
- Porównuje z kosztem energii z agregatu lub sieci.  
  
**Efekt na ekranie:**  
- Wykres: *"Koszt 1 kWh z baterii: 1,1 zł. Koszt 1 kWh z agregatu: 3,4 zł. Magazyn zwraca się po 1200 cyklach."*  
- Alert: *"Twoja bateria jest zbyt mała i głęboko rozładowywana, co skraca jej życie."*  
- **Migawka:** *"O co chodzi? Bateria to skarbonka, ale sama też kosztuje."*  
- **Powiązania:** Funkcja 3.1, Funkcja 3.6, Funkcja 1.19.

---

### 4.26. Czarna Skrzynka (Data Logging & Alarmy)  *(dawne 3.26)*

  
**Skąd czerpie dane:**  
- Z BMS, falownika, czujników temperatury i prądu. Zapisuje co sekundę parametry.  
  
**Gdzie ląduje:**  
- W module `data_logger`.  
  
**Jak działa logika:**  
- System rejestruje zdarzenia krytyczne: przeładowanie, głębokie rozładowanie, zbyt wysoka/niska temperatura, zwarcie, zanik komunikacji.  
- Na żądanie generuje raport z ostatnich 30 dni przed awarią.  
- Umożliwia eksport do pliku (CSV/PDF).  
  
**Efekt na ekranie:**  
- Przycisk: *"Pobierz raport ostatnich 30 dni (PDF)"*.  
- Komunikat: *"Awaria nastąpiła po serii głębokich rozładowań. Zapisano: 12 alarmów, 4 zdarzenia krytyczne."*  
- **Migawka:** *"O co chodzi? Jak się spalisz, to musisz wiedzieć dlaczego."*  
- **Powiązania:** Funkcja 7.2, Funkcja 3.9.

---

### 4.27. Dobór bezpiecznika DC (AIC / Class T / NH)  *(dawne 3.27)*

  
**Skąd czerpie dane:**  
- Z prądu zwarciowego baterii (obliczanego na podstawie rezystancji wewnętrznej i napięcia) oraz z pojemności pakietu.  
  
**Gdzie ląduje:**  
- W module `battery_fusing`.  
  
**Jak działa logika:**  
- System wylicza maksymalny prąd zwarciowy, jaki może oddać bateria (np. 6000 A).  
- Sprawdza, czy wybrany bezpiecznik ma zdolność przerywania tego prądu (AIC). Dla LiFePO4 wymaga minimum AIC 10 000 A.  
- Rekomenduje typ bezpiecznika (Class T, NH00, e-fuse) zamiast ANL/Maxi.  
  
**Efekt na ekranie:**  
- Alert: *"Zwarciowy prąd twojego pakietu to 5200 A. Bezpiecznik ANL 200A ma zdolność wyłączenia tylko 2000 A i rozerwie się tworząc łuk plazmowy. Musisz zastosować bezpiecznik Class T (AIC 20 000 A)."*  
- **Migawka:** *"O co chodzi? Bezpiecznik musi umieć ugasić pożar, a nie tylko się stopić."*

---

### 4.28. Szyny zbiorcze i rozkład prądu (Busbars & Hot-spots)  *(dawne 3.28)*

  
**Skąd czerpie dane:**  
- Z liczby ogniw równoległych, maksymalnego prądu oraz wymiarów szyny.  
  
**Gdzie ląduje:**  
- W module `busbar_design`.  
  
**Jak działa logika:**  
- System oblicza spadek napięcia na szynie miedzianej i nierównomierny rozkład prądu.  
- Jeśli różnica rezystancji między pierwszym a ostatnim ogniwem jest zbyt duża, ostrzega.  
- Sugeruje optymalne ułożenie kabli (np. po przekątnej) lub zwiększenie przekroju szyny.  
  
**Efekt na ekranie:**  
- Schemat szyny z mapą cieplną.  
- Komunikat: *"Prąd na ogniwie #1 jest o 20% większy niż na ogniwie #8. Przesuń główny kabel na środek szyny."*  
- **Migawka:** *"O co chodzi? Elektrony to leniwe stworzenia."*

---

### 4.29. Topologia BMS (Common Port vs. Separate Port)  *(dawne 3.29)*

  
**Skąd czerpie dane:**  
- Z wybranego modelu BMS, falownika i ładowarki.  
  
**Gdzie ląduje:**  
- W module `bms_topology`.  
  
**Jak działa logika:**  
- System sprawdza, czy prąd ładowania i rozładowania może płynąć tą samą drogą.  
- Jeśli użytkownik ma osobny MPPT i osobny falownik, sugeruje BMS z osobnym portem.  
- Jeśli ma inwerter hybrydowy, wybiera Common Port.  
  
**Efekt na ekranie:**  
- Diagram połączeń.  
- Ostrzeżenie: *"Wybrany BMS ma Common Port 100A, ale twój inwerter pobiera 150A przy rozruchu. Wybierz wersję Separate Port."*  
- **Migawka:** *"O co chodzi? Jak masz jedną rurę do wody i ścieków, to w końcu się zapcha."*

---

### 4.30. Chłodzenie baterii latem (High Temperature Mitigation)  *(dawne 3.30)*

  
**Skąd czerpie dane:**  
- Z temperatur maksymalnych dla lokalizacji i z pomiaru temperatury ogniw.  
  
**Gdzie ląduje:**  
- W module `battery_cooling`.  
  
**Jak działa logika:**  
- System wyznacza dopuszczalny zakres pracy (np. 15–35°C). Jeśli temperatura otoczenia przekracza 35°C, wykrywa ryzyko.  
- Oblicza, ile ciepła wydzielają ogniwa przy ładowaniu.  
- Sugeruje rozwiązania: montaż w piwnicy, wentylator, klimatyzacja komory.  
  
**Efekt na ekranie:**  
- Alert: *"Symulacja lipca: temperatura w garażu 45°C. Twoje ogniwa osiągną 48°C. Degradacja przyspieszy o 30%. Przenieś magazyn do piwnicy."*  
- **Migawka:** *"O co chodzi? Bateria to nie piec."*

---

### 4.31. Kalibracja i dokładność SoC (Coulomb Counting & Voltage Sync)  *(dawne 3.31)*

  
**Skąd czerpie dane:**  
- Z historii ładowań, napięć ogniw, prądów i czasu.  
  
**Gdzie ląduje:**  
- W module `soc_algorithm`.  
  
**Jak działa logika:**  
- System liczy energię (Coulomb counting), ale wie, że przy długotrwałej pracy bez pełnego naładowania pojawia się błąd.  
- Wykrywa, kiedy nastąpiło ostatnie pełne naładowanie.  
- Jeśli bateria nie była w pełni naładowana od 2 tygodni, zaleca kalibrację.  
  
**Efekt na ekranie:**  
- Wykres dryfu SoC.  
- Komunikat: *"Wskaźnik SoC rozjechał się o 12%. Zrób pełne ładowanie, żeby BMS złapał punkty odniesienia."*  
- **Migawka:** *"O co chodzi? Liczenie prądu to szacunek."*

---

### 4.32. Detekcja doziemienia i ochrona (Ground Fault & IMD)  *(dawne 3.32)*

  
**Skąd czerpie dane:**  
- Z konfiguracji systemu (napięcie DC), uziemienia (TN/TT) i czujników.  
  
**Gdzie ląduje:**  
- W module `ground_fault_protection`.  
  
**Jak działa logika:**  
- System sprawdza, czy instalacja ma monitor izolacji (IMD) lub różnicówkę DC.  
- Symuluje scenariusz przebicia.  
- Generuje procedurę diagnozy.  
  
**Efekt na ekranie:**  
- Ostrzeżenie: *"Przebicie w panelu spowoduje pojawienie się niebezpiecznego potencjału na ramie. Zainstaluj monitor izolacji (IMD)."*  
- **Migawka:** *"O co chodzi? Prąd stały (DC) trzyma ofiarę mocniej niż zmienny (AC)."*

---

### 4.33. Pomiar i znaczenie rezystancji wewnętrznej (IR / Impedance Track)  *(dawne 3.33)*

  
**Skąd czerpie dane:**  
- Z manualnych pomiarów (użytkownik wpisuje wynik) lub z automatycznej analizy spadków napięcia.  
  
**Gdzie ląduje:**  
- W module `cell_diagnostics`.  
  
**Jak działa logika:**  
- System porównuje rezystancję zmierzoną z wartością fabryczną. Wzrost o 50% oznacza utratę pojemności.  
- Generuje mapę ogniw, wskazując te, które odstają od średniej.  
  
**Efekt na ekranie:**  
- Tabela: *"Ogniwo #1: 0.25 mΩ (OK), Ogniwo #7: 0.48 mΩ (UWAGA!), Ogniwo #12: 0.71 mΩ (KRYTYCZNE - wymień)."*  
- **Migawka:** *"O co chodzi? Jak masz zatkane naczynie krwionośne, to serce musi mocniej pompować."*

---

### 4.34. Porównanie technologii magazynów (LiFePO4 vs. AGM/Żel/Kwasowy/Trakcyjny)  *(dawne 3.34)*

  
**Skąd czerpie dane:**  
- Z bazy danych technologii, cen rynkowych, pojemności znamionowej (Ah) oraz wybranego napięcia systemowego.  
  
**Gdzie ląduje:**  
- W module `technology_comparison`.  
  
**Jak działa logika:**  
System porównuje 4 technologie:  
1. **LiFePO4:** Wysoka cena startowa, 5000 cykli przy 80% DoD, sprawność 98%, brak konserwacji, waga ok. 12 kg/kWh.  
2. **Kwasowy (rozruchowy/AGM):** Niska cena startowa, 300-500 cykli przy 50% DoD, sprawność 80%, wymaga wentylacji (gazy), waga ok. 25-30 kg/kWh.  
3. **Żelowy (GEL):** Średnia cena, 800-1000 cykli przy 50% DoD, sprawność 80%, bezobsługowy, waga ok. 30 kg/kWh, długi czas ładowania.  
4. **Trakcyjny z wózka widłowego:** Niska cena za kWh, 1500-2000 cykli przy 80% DoD (teoretycznie), masa własna ogromna (często 500-1000 kg na 48V), wymaga regularnego uzupełniania wody destylowanej i bardzo dobrej wentylacji.  
Algorytm oblicza **koszt 1 kWh** w całym okresie życia, uwzględniając wagę (koszt konstrukcji podłogi), koszt wody destylowanej oraz koszt wentylacji.  
  
**Efekt na ekranie:**  
- Tabela "Prawdy":  
  `[Technologia] | Cena za kWh | Waga | Na ile starczy tej samej pojemności? | Koszty obsługi | Koszt 1 kWh w życiu`  
- *Komunikat:* *"Kwasowy kosztuje 500 zł, ale w życiu jest 2x droższy od LiFePO4. Trakcyjny z wózka jest tani, ale waży 300 kg i musisz dolać do niego wodę."*

---

### 4.35. Napięcie odcięcia vs. żywotność (DoD vs. Voltage Cut-off)  *(dawne 3.35)*

  
**Skąd czerpie dane:**  
- Z charakterystyki rozładowania ogniw LiFePO4 i ustawień falownika.  
  
**Gdzie ląduje:**  
- W module `battery_protection_settings`.  
  
**Jak działa logika:**  
- System porównuje napięcie odcięcia ustawione na falowniku (np. 42V) z napięciem zalecanym (np. 48V dla pakietu 16S).  
- Oblicza realną głębokość rozładowania (DoD) i pokazuje zysk w liczbie cykli.  
  
**Efekt na ekranie:**  
- Alert: *"Twoje napięcie odcięcia to 42.0V (100% DoD). To daje 2000 cykli. Jeśli podniesiesz je do 44.0V (80% DoD), bateria wytrzyma 5000 cykli (+150% życia)."*  
- **Migawka:** *"O co chodzi? Nie wyciskaj baterii do ostatniej kropli."*

---

### 4.36. Hierarchia ładowania (PV > Agregat > Sieć)  *(dawne 3.36)*

  
**Skąd czerpie dane:**  
- Z konfiguracji źródeł (PV, agregat, sieć), prognozy pogody i aktualnego SoC.  
  
**Gdzie ląduje:**  
- W module `charging_hierarchy`.  
  
**Jak działa logika:**  
- System ustala algorytm priorytetów: (1) PV – zawsze pierwszeństwo; (2) Agregat – tylko, gdy bateria spada poniżej krytycznego SoC ORAZ prognoza mówi, że nie będzie słońca; (3) Sieć – doładowuje nocą, tylko jeśli jest tania taryfa.  
  
**Efekt na ekranie:**  
- Diagram decyzyjny.  
- Komunikat: *"Jutro wraca słońce. System NIE włączy dziś agregatu, mimo że SoC spadł do 25%, bo przewiduje produkcję 4 kWh od 9:00 rano."*  
- **Migawka:** *"O co chodzi? Mądry system czeka na darmowe paliwo ze słońca."*

---

### 4.37. Symulacja miesiąca zachmurzenia (No-Sun Scenario)  *(dawne 3.37)*

  
**Skąd czerpie dane:**  
- Z historycznych danych pogodowych (nasłonecznienie dni najgorszych) i pojemności baterii.  
  
**Gdzie ląduje:**  
- W module `extended_autonomy`.  
  
**Jak działa logika:**  
- System symuluje produkcję PV na poziomie 5-10% nominalnej przez zdefiniowaną liczbę dni (np. 10).  
- Oblicza codzienny ubytek energii z baterii.  
- Sprawdza, czy dojdzie do "śmierci systemu" (Blackout) i ile godzin będzie pracował agregat.  
  
**Efekt na ekranie:**  
- Wykres spadku SoC.  
- Komunikat: *"W czarnym scenariuszu (10 dni chmur) twój system padnie 7. dnia o 22:00. Aby przetrwać bez agregatu, potrzebujesz dodatkowych 20 kWh baterii."*  
- **Migawka:** *"O co chodzi? Projektujesz system nie na średnią pogodę, tylko na najgorszy tydzień w roku."*

---

### 4.38. Szyny łączące i połączenia pakietów (Inter-Pack Connections)  *(dawne 3.38)*

  
**Skąd czerpie dane:**  
- Z liczby i układu baterii równoległych oraz ich odległości.  
  
**Gdzie ląduje:**  
- W module `parallel_wiring`.  
  
**Jak działa logika:**  
- System wyznacza spadki napięcia na kablach łączących.  
- Oblicza, jak nierówno rozkłada się prąd między baterie.  
- Proponuje łączenie w gwiazdę (central busbar) lub kaskadę z równymi długościami kabli.  
  
**Efekt na ekranie:**  
- Schemat: *"Twoje 4 baterie są połączone kaskadowo. Bateria #1 oddaje 40% prądu, Bateria #4 tylko 15%. Zastosuj szynę zbiorczą i kable o równej długości."*  
- **Migawka:** *"O co chodzi? Prąd płynie tam, gdzie łatwiej."*

---

### 4.39. Matryca alarmów BMS i reakcje systemu (Alarm Matrix & Fail-safe)  *(dawne 3.39)*

  
**Skąd czerpie dane:**  
- Z rejestru zdarzeń BMS i ustalonych progów bezpieczeństwa.  
  
**Gdzie ląduje:**  
- W module `alarm_matrix`.  
  
**Jak działa logika:**  
- System definiuje listę alarmów (Nadmierne napięcie, Podnapięcie, Przegrzanie, Przeciążenie, Zwarcie, Awaria czujnika, Rozjazd ogniw).  
- Do każdego alarmu przypisuje reakcję: Ostrzeżenie, Ograniczenie prądu, Odłączenie ładowania, Odłączenie obciążenia, Awaryjne wyłączenie.  
- Wyświetla czytelny komunikat i instrukcję.  
  
**Efekt na ekranie:**  
- Alert: *"ALARM: Przegrzanie ogniwa #3 (52°C). BMS ograniczył prąd ładowania do 20A. Sprawdź wentylację komory."*  
- **Migawka:** *"O co chodzi? System broni się sam. Ty masz tylko zrozumieć, co się dzieje."*  
  
## Rozdział 4: Okablowanie, zabezpieczenia i aparatura (Balance of System)

---

## Moduł 5 (Kafel 5): Okablowanie i zabezpieczenia

*Dawny Rozdział 4. Pozycje 4.21 i 4.35 opisywały ten sam temat (złącza MC4) dwa razy — scalono w jedną funkcję z dwiema częściami (ogólna + szczegółowa), treść zachowana w całości.*

### 5.1. Dobór przekrojów przewodów DC i AC  *(dawne 4.1)*

  
**Skąd czerpie dane:**  
- Z długości tras, prądów (rozdz. 1 i 3) i napięcia systemowego.  
  
**Gdzie ląduje:**  
- W tabeli `cable_sizing` – dla każdego obwodu minimalny przekrój.  
  
**Jak działa logika:**  
- Oblicza spadek napięcia dla typowych przekrojów i wskazuje ten, przy którym strata < 3% dla DC i < 2% dla AC.  
- Uwzględnia korektę temperaturową.  
  
**Efekt na ekranie:**  
- *„Obwód DC paneli → regulator: 20 m, 20 A, 48 V → zalecany przekrój 6 mm² (spadek 2,1%).”*

---

### 5.2. Dobór bezpieczników i rozłączników  *(dawne 4.2)*

  
**Skąd czerpie dane:**  
- Z prądów znamionowych i zwarciowych (Isc paneli, prądy baterii).  
  
**Gdzie ląduje:**  
- W tabeli `protection_devices` – lista wymaganych zabezpieczeń.  
  
**Jak działa logika:**  
- Dla każdego obwodu dobiera bezpiecznik nadprądowy (1,25 × I nominalny) oraz rozłącznik DC/AC.  
- Uwzględnia koordynację selektywności.  
  
**Efekt na ekranie:**  
- *„Obwód baterii: bezpiecznik 125 A DC, rozłącznik 2‑biegunowy 125 A.”*

---

### 5.3. Dobór mocy falownika  *(dawne 4.3)*

  
**Skąd czerpie dane:**  
- Z mocy szczytowej (W), mocy pozornej (VA), prądów rozruchowych i współczynnika jednoczesności.  
  
**Gdzie ląduje:**  
- W tabeli `inverter_selection` – sugerowana moc ciągła i przeciążalność.  
  
**Jak działa logika:**  
- Falownik musi dostarczyć moc szczytową przez co najmniej 5 s (prądy rozruchowe).  
- Stosuje współczynnik jednoczesności (np. 0,7).  
- Dobiera napięcie wejściowe DC.  
  
**Efekt na ekranie:**  
- *„Twoje obciążenie szczytowe to 4,2 kW (6,1 kVA). Zalecamy falownik 6 kW / 8 kVA z przeciążalnością 200% przez 5 s.”*

---

### 5.4. Termika – przepust powietrza pod panelami  *(dawne 4.4)*

  
**Skąd czerpie dane:**  
- Z typu montażu – sprawdza, czy uwzględniono szczelinę wentylacyjną.  
  
**Gdzie ląduje:**  
- W tabeli `thermal_ventilation` – ostrzeżenie, jeśli szczelina < 10 cm.  
  
**Jak działa logika:**  
- Panele nagrzewają się latem – brak wentylacji powoduje spadek mocy (0,4%/°C powyżej 25°C).  
- Przy szczelinie < 5 cm temperatura może osiągnąć 70°C – strata 18% mocy.  
- System wymusza odstęp co najmniej 10 cm.  
  
**Efekt na ekranie:**  
- *„Przy montażu na dachu płaskim zachowaj szczelinę 15 cm, inaczej latem stracisz 18% mocy.”*

---

### 5.5. Dobór ochronników przeciwprzepięciowych (SPD DC i AC)  *(dawne 4.5)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (dane o burzach, strefa wyładowań atmosferycznych z Rozdziału 0).  
- Z konfiguracji systemu: napięcia DC (stringi PV), napięcia AC (falownik), długości przewodów.  
- Z bazy danych ochronników (SPD typu 1, 2, 3) i ich parametrów.  
  
**Gdzie ląduje:**  
- W module `spd_selection`.  
  
**Jak działa logika:**  
- System analizuje ryzyko przepięć:  
  - Bezpośrednie wyładowanie w instalację (wymagany SPD Typ 1),  
  - Przepięcia indukowane w przewodach DC i AC (wymagany SPD Typ 2),  
  - Ochrona wrażliwych urządzeń końcowych (SPD Typ 3).  
- Dla strony DC dobiera SPD między biegunami (polaryzacja) i między biegunem a ziemią. Sprawdza napięcie robocze (np. 600 V DC dla stringu 8 paneli) i dobiera ochronnik o odpowiednim napięciu trwałego działania (Uc).  
- Dla strony AC dobiera SPD po stronie falownika, uwzględniając układ sieci (TN/TT/IT).  
- Ustala parametry: poziom ochrony (Up), prąd udarowy (In, Imax), czas reakcji.  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia SPD: przy panelach, w string boxie, przy falowniku, w rozdzielni AC.  
- Komunikat: *„Dla stringu PV o napięciu 320 V DC dobierz SPD Typ 2 o Uc ≥ 400 V DC, Up ≤ 1,5 kV. Zainstaluj go w skrzynce stringowej blisko paneli.”*  
- Ostrzeżenie: *„Jeśli budynek ma instalację odgromową, SPD Typ 1 jest obowiązkowy. Bez niego przepięcie spali MPPT.”*  
  
**Migawka:** *„O co chodzi? Piorun nie musi trafić w panel. Wystarczy, że uderzy obok – i w kablach indukuje się napięcie, które niszczy elektronikę. Ochronnik to bezpiecznik dla napięcia.”*  
  
**Powiązania:** Funkcja 2.11 (Voc max), Funkcja 4.28 (String Box), Funkcja 4.7 (Koordynacja z odgromem).

---

### 5.6. Strefowa koncepcja ochrony (LPZ 0–3)  *(dawne 4.6)*

  
**Skąd czerpie dane:**  
- Z modelu 3D budynku i działki (Rozdział 0).  
- Z informacji o istniejącej instalacji odgromowej (wprowadzonej przez użytkownika).  
- Z lokalizacji geograficznej (liczba dni burzowych, poziom izokerauniczny).  
  
**Gdzie ląduje:**  
- W module `lpz_zones`.  
  
**Jak działa logika:**  
- System dzieli przestrzeń na strefy ochrony odgromowej:  
  - **LPZ 0A** – strefa bezpośredniego zagrożenia (gdzie może trafić piorun),  
  - **LPZ 0B** – strefa chroniona przed bezpośrednim uderzeniem, ale narażona na impulsy indukowane,  
  - **LPZ 1, 2, 3** – kolejne strefy wewnętrzne z coraz większym tłumieniem przepięć.  
- Analizuje, gdzie przebiegają przewody i gdzie zamontowane są urządzenia (panele, falownik, baterie, router).  
- Wskazuje granice stref i miejsca, w których przewody przechodzą z jednej strefy do drugiej – tam muszą być zamontowane SPD.  
- Sprawdza odstępy izolacyjne między elementami (np. między zwodem a przewodem DC).  
  
**Efekt na ekranie:**  
- Mapa 3D z kolorowymi strefami LPZ.  
- Lista przejść granicznych: *„Kabel DC wchodzi z LPZ 0B do LPZ 1 przy wejściu do budynku – tam zamontuj SPD Typ 2.”*  
- Ostrzeżenie: *„Falownik znajduje się w LPZ 1, ale jego obudowa musi być połączona z GSW.”*  
  
**Migawka:** *„O co chodzi? Piorun ma energię jak mała bomba. Strefy to bariery, które ją osłabiają, zanim dojdzie do twojego sprzętu.”*  
  
**Powiązania:** Funkcja 4.5 (Dobór SPD), Funkcja 4.7 (Koordynacja z odgromem), Funkcja 4.9 (GSW).

---

### 5.7. Koordynacja SPD z istniejącą instalacją odgromową  *(dawne 4.7)*

  
**Skąd czerpie dane:**  
- Z informacji, czy budynek ma zwody, przewody odprowadzające i uziom odgromowy (wprowadzone lub z modelu 3D).  
- Z rozmieszczenia paneli PV (dach, grunt) i ich odległości od zwodów.  
- Z parametrów dobranych SPD (funkcja 4.5).  
  
**Gdzie ląduje:**  
- W module `spd_lightning_coordination`.  
  
**Jak działa logika:**  
- System sprawdza, czy instalacja PV jest w strefie chronionej przez zwody (stożek ochronny).  
- Jeśli panele są blisko zwodów (np. < 0,5 m), system ostrzega przed przeskokiem iskry i zaleca zwiększenie odstępu.  
- Dobiera odpowiednią klasę SPD w zależności od tego, czy budynek ma instalację odgromową:  
  - **Jest instalacja odgromowa:** wymagany SPD Typ 1 (prąd udarowy 10/350 µs) na wejściu do budynku.  
  - **Nie ma instalacji odgromowej:** wystarczy SPD Typ 2 (prąd udarowy 8/20 µs).  
- Sprawdza, czy uziom instalacji PV jest połączony z uziomem odgromowym (wspólna szyna wyrównawcza) – zapobiega różnicy potencjałów.  
  
**Efekt na ekranie:**  
- Alert: *„Twój dom ma instalację odgromową, ale panele są zamontowane 30 cm od zwodu. To ryzyko przeskoku. Przesuń panele lub zastosuj separację 1 m.”*  
- Komunikat: *„Dobierz SPD Typ 1 do rozdzielni głównej i SPD Typ 2 do falownika.”*  
- Ostrzeżenie: *„Nie uziemiaj instalacji PV osobno! Musi być połączona z główną szyną wyrównawczą budynku.”*  
  
**Migawka:** *„O co chodzi? Piorun idzie po linii najmniejszego oporu. Jeśli panele są za blisko zwodu, może przeskoczyć na kable PV. Trzeba je trzymać z daleka lub dać im tarczę.”*  
  
**Powiązania:** Funkcja 4.5 (Dobór SPD), Funkcja 4.9 (GSW), Funkcja 4.8 (Projekt uziemienia).

---

### 5.8. Projekt uziemienia (rodzaj, wymiary, rezystancja)  *(dawne 4.8)*

  
**Skąd czerpie dane:**  
- Z lokalizacji: rodzaj gruntu (piach, glina, skała), wilgotność, strefa przemarzania, strefa wyładowań (z Rozdziału 0).  
- Z wymiarów działki i odległości od budynku.  
- Z konfiguracji systemu (napięcie, prądy zwarciowe, typ instalacji odgromowej).  
  
**Gdzie ląduje:**  
- W module `grounding_design`.  
  
**Jak działa logika:**  
- System dobiera rodzaj uziomu:  
  - **Uziom pionowy** (pręt stalowy miedziowany, np. 3 m) dla małych działek,  
  - **Uziom poziomy** (bednarka) dla dużych działek lub piaszczystych gruntów,  
  - **Uziom fundamentowy** dla nowych budynków (najlepsza opcja).  
- Oblicza wymaganą rezystancję uziemienia:  
  - < 10 Ω dla instalacji odgromowej,  
  - < 30 Ω dla ochrony przeciwporażeniowej,  
  - < 5 Ω dla czułej elektroniki (jeśli wymagane).  
- Szacuje rezystancję uziomu na podstawie rezystywności gruntu (Ω·m) i wymiarów uziomu.  
- Jeśli rezystancja jest za wysoka, proponuje: więcej prętów, dłuższą bednarkę, uziom otokowy, środek poprawiający przewodność (bentonit).  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia uziomu na działce.  
- Komunikat: *„Rezystywność gruntu (glina) ok. 100 Ω·m. Dla uzyskania < 10 Ω potrzebujesz 3 pręty 3 m w rozstawie 3 m, połączone bednarką 30×3,5 mm.”*  
- Ostrzeżenie: *„Nie łącz uziomu miedzianego z prętami ocynkowanymi bezpośrednio – korozja galwaniczna.”*  
  
**Migawka:** *„O co chodzi? Ziemia to kabel. Jak jest za cienki, to prąd zwarciowy nie ucieknie i wróci do Ciebie.”*  
  
**Powiązania:** Funkcja 4.9 (GSW), Funkcja 4.7 (Koordynacja z odgromem), Funkcja 4.40 (Pomiary).

---

### 5.9. Główna szyna wyrównawcza (GSW) i połączenia wyrównawcze  *(dawne 4.9)*

  
**Skąd czerpie dane:**  
- Z konfiguracji budynku (przyłącze, instalacje metalowe, rury, fundamenty) oraz z modelu 3D działki (Rozdział 0).  
- Z listy urządzeń wymagających wyrównania potencjałów: falownik, panele, baterie, konstrukcje wsporcze, rury, obudowy.  
- Z projektu uziemienia (funkcja 4.8).  
  
**Gdzie ląduje:**  
- W module `equipotential_bonding`.  
  
**Jak działa logika:**  
- System identyfikuje wszystkie metalowe części, które muszą być połączone z Główną Szyną Wyrównawczą (GSW), aby nie pojawiła się między nimi niebezpieczna różnica potencjałów.  
- Generuje listę połączeń wyrównawczych: konstrukcja paneli, falownik, bateria, rury wodne, instalacja odgromowa, uziom.  
- Dobiera przekroje przewodów wyrównawczych (np. min. 6 mm² dla połączeń wewnętrznych, 16 mm² dla głównych, 50 mm² dla uziemienia odgromowego).  
- Sprawdza, czy GSW jest umieszczona w dostępnym miejscu (np. przy rozdzielni głównej) i czy ma odpowiednią liczbę zacisków.  
- Ostrzega przed łączeniem różnych metali bez podkładek bimetalicznych (funkcja 4.39).  
  
**Efekt na ekranie:**  
- Schemat połączeń wyrównawczych z listą elementów.  
- Komunikat: *„Do GSW podłącz: konstrukcję paneli (16 mm²), falownik (10 mm²), baterię (16 mm²), instalację wodną (6 mm²), uziom (50 mm²).”*  
- Ostrzeżenie: *„Nie używaj GSW jako punktu przyłączeniowego dla odbiorników! To tylko wyrównanie potencjałów, nie szyna prądowa.”*  
  
**Migawka:** *„O co chodzi? Jeśli dotkniesz dwóch metalowych rzeczy o różnym napięciu, popłynie przez Ciebie prąd. GSW sprawia, że wszystko ma ten sam potencjał – więc nie kopie.”*  
  
**Powiązania:** Funkcja 4.8 (Uziemienie), Funkcja 4.16 (Ochrona przed dotykiem), Funkcja 4.40 (Pomiary).

---

### 5.10. Uziemienie funkcjonalne vs. ochronne  *(dawne 4.10)*

  
**Skąd czerpie dane:**  
- Z konfiguracji falownika i paneli (typ izolacji, wymagania producenta).  
- Z układu sieci (TN/TT/IT) i lokalnych norm.  
- Z analizy ryzyka porażeniowego i odgromowego (funkcje 4.5–4.8).  
  
**Gdzie ląduje:**  
- W module `functional_vs_protective_ground`.  
  
**Jak działa logika:**  
- System wyjaśnia różnicę:  
  - **Uziemienie ochronne** – chroni ludzi przed porażeniem. Odprowadza prąd zwarciowy do ziemi, aby zadziałało zabezpieczenie.  
  - **Uziemienie funkcjonalne** – zapewnia poprawną pracę urządzeń (np. filtr EMC, stabilizacja napięcia, praca monitoringu izolacji).  
- Sprawdza, czy falownik wymaga uziemienia jednego z biegunów DC (np. uziemiony minus w niektórych konstrukcjach) czy pracuje w układzie izolowanym (IT).  
- Dla instalacji off-grid często stosuje się układ IT (izolowany), ale wtedy konieczny jest monitor izolacji (IMD) – patrz funkcja 4.17.  
- System podpowiada, jak połączyć uziemienie funkcjonalne z ochronnym, aby nie tworzyć pętli i różnic potencjałów.  
  
**Efekt na ekranie:**  
- Schemat: *„Twój falownik pracuje w układzie IT – bieguny DC nie są uziemione. Zastosuj monitor izolacji (IMD). Uziem ochronne obudowy połącz z GSW.”*  
- Ostrzeżenie: *„Nie uziemiaj bieguna DC, jeśli producent tego nie wymaga – możesz uszkodzić MPPT i stworzyć ryzyko pożaru.”*  
- Wyjaśnienie w migawce.  
  
**Migawka:** *„O co chodzi? Ochronne to poduszka powietrzna dla Ciebie. Funkcjonalne to stabilizator dla elektroniki. Oba muszą być, ale nie zawsze razem.”*  
  
**Powiązania:** Funkcja 4.8 (Uziemienie), Funkcja 4.17 (IMD), Funkcja 4.7 (Koordynacja z odgromem).

---

### 5.11. Analiza zwarciowa instalacji DC i AC  *(dawne 4.11)*

  
**Skąd czerpie dane:**  
- Z parametrów baterii (rezystancja wewnętrzna, napięcie, pojemność) – z Rozdziału 3.  
- Z parametrów paneli (Isc, konfiguracja stringów) – z Rozdziału 2.  
- Z impedancji przewodów i połączeń (długości, przekroje) – z funkcji 4.1 i 4.18.  
  
**Gdzie ląduje:**  
- W module `short_circuit_analysis`.  
  
**Jak działa logika:**  
- System oblicza maksymalne spodziewane prądy zwarciowe:  
  - **Prąd zwarciowy baterii:** I = V / R_wewn (np. 48V / 0,01 Ω = 4800 A).  
  - **Prąd zwarciowy paneli:** Isc × liczba stringów równoległych (zwykle 10–20 A na string).  
  - **Prąd zwarciowy po stronie AC:** z parametrów falownika i sieci.  
- Sprawdza, czy zabezpieczenia mają zdolność wyłączania ≥ prąd zwarciowy (AIC dla DC, kA dla AC).  
- Wskazuje miejsca, gdzie prąd zwarciowy może przekroczyć wytrzymałość przewodów lub złączek.  
  
**Efekt na ekranie:**  
- Tabela: *„Prąd zwarciowy baterii: 4800 A. Twoje bezpieczniki ANL 200A mają AIC 2000 A – za mało! Wymagane Class T (AIC 20 000 A).”*  
- Ostrzeżenie: *„Przewód 10 mm² wytrzyma zwarciowo tylko 2000 A – zwarcie z baterii go stopi.”*  
- Schemat miejsc zwarć.  
  
**Migawka:** *„O co chodzi? Zwarcie to jak wybuch. Musisz wiedzieć, ile energii popłynie, zanim bezpiecznik zdąży przerwać.”*  
  
**Powiązania:** Funkcja 4.2 (Bezpieczniki), Funkcja 4.13 (Wyłączniki DC), Funkcja 4.12 (Selektywność).

---

### 5.12. Selektywność zabezpieczeń (koordynacja czasowo-prądowa)  *(dawne 4.12)*

  
**Skąd czerpie dane:**  
- Z hierarchii zabezpieczeń: przy odbiorniku, w rozdzielni, główne.  
- Z charakterystyk czasowo-prądowych bezpieczników i wyłączników (z bazy danych).  
- Z analizy zwarciowej (funkcja 4.11).  
  
**Gdzie ląduje:**  
- W module `selectivity`.  
  
**Jak działa logika:**  
- System sprawdza, czy przy zwarciu w jednym obwodzie zadziała tylko najbliższe zabezpieczenie, a reszta systemu będzie działać dalej.  
- Porównuje charakterystyki czasowo-prądowe:  
  - **Selektywność całkowita:** zadziała tylko jedno zabezpieczenie.  
  - **Selektywność częściowa:** przy dużych prądach zwarciowych mogą zadziałać dwa.  
- Dobiera zabezpieczenia tak, aby uzyskać selektywność (np. bezpiecznik gG przy odbiorniku, aM w rozdzielni, wyłącznik z opóźnieniem jako główny).  
- Dla DC (baterie) zaleca koordynację między bezpiecznikiem głównym a BMS (e-fuse).  
  
**Efekt na ekranie:**  
- Wykres charakterystyk: *„Przy zwarciu 500 A w obwodzie gniazd zadziała tylko bezpiecznik 16 A. Główny 125 A nie wyłączy się – reszta domu nadal działa.”*  
- Ostrzeżenie: *„Brak selektywności – zwarcie w jednym obwodzie wyłączy cały system. To niedopuszczalne w off-gridzie.”*  
  
**Migawka:** *„O co chodzi? Jak pęknie jedna rura, to nie zamykasz głównego zaworu w całym domu. Tak samo z prądem – ma zadziałać tylko ten bezpiecznik, który jest najbliżej awarii.”*  
  
**Powiązania:** Funkcja 4.11 (Analiza zwarciowa), Funkcja 4.2 (Bezpieczniki), Funkcja 4.13 (Wyłączniki DC).

---

### 5.13. Dobór wyłączników nadprądowych DC (MCB, MCCB)  *(dawne 4.13)*

  
**Skąd czerpie dane:**  
- Z prądów znamionowych i zwarciowych po stronie DC (z analizy zwarciowej – funkcja 4.11).  
- Z napięcia systemu DC (np. 48V, 96V, 200V) i liczby biegunów.  
- Z bazy danych wyłączników DC (MCB, MCCB) i ich zdolności wyłączania (kA).  
  
**Gdzie ląduje:**  
- W module `dc_breaker_selection`.  
  
**Jak działa logika:**  
- System dobiera wyłącznik nadprądowy DC do każdego obwodu:  
  - **Panele PV** – wyłącznik w string boxie, dobrany do prądu Isc × 1,25.  
  - **Bateria** – wyłącznik główny, dobrany do maksymalnego prądu ładowania/rozładowania.  
  - **Odbiorniki DC** – jeśli występują.  
- Sprawdza polaryzację i zdolność gaszenia łuku. Wyłączniki DC muszą mieć oznaczenie DC i odpowiednią zdolność wyłączania (np. 10 kA przy 48V).  
- Uwzględnia sposób montażu (szyna DIN, skrzynka) i temperaturę pracy.  
- Sprawdza selektywność z bezpiecznikami (funkcja 4.12).  
  
**Efekt na ekranie:**  
- Lista wyłączników: *„String 1: MCB 2P 16A DC 10kA. Bateria: MCCB 2P 125A DC 20kA.”*  
- Ostrzeżenie: *„Nie stosuj wyłączników AC do prądu stałego – łuk nie zgaśnie i wyłącznik się spali.”*  
- Schemat rozmieszczenia w rozdzielni.  
  
**Migawka:** *„O co chodzi? Prąd stały pali się jak spawarka. Wyłącznik musi umieć zgasić ten łuk, inaczej sam zamieni się w pożar.”*  
  
**Powiązania:** Funkcja 4.11 (Analiza zwarciowa), Funkcja 4.12 (Selektywność), Funkcja 4.28 (String Box).

---

### 5.14. Zabezpieczenie przed odwrotną polaryzacją  *(dawne 4.14)*

  
**Skąd czerpie dane:**  
- Z konfiguracji obwodów DC (panele, bateria, odbiorniki).  
- Z parametrów urządzeń (falownik, MPPT, BMS) – czy mają wbudowaną ochronę.  
- Z schematu połączeń (funkcja 4.28 – String Box).  
  
**Gdzie ląduje:**  
- W module `reverse_polarity_protection`.  
  
**Jak działa logika:**  
- System sprawdza, czy w każdym miejscu, gdzie użytkownik może pomylić plus z minusem, istnieje zabezpieczenie:  
  - **Bateria:** dioda zwrotna lub bezpiecznik topikowy w obwodzie BMS, który przepala się przy odwrotnym podłączeniu.  
  - **Panele:** diody blokujące lub bezpieczniki stringowe, które zapobiegają przepływowi prądu wstecznego.  
  - **Falownik/MPPT:** sprawdzenie, czy mają wewnętrzny układ ochrony (zwykle tak, ale tylko do określonego napięcia).  
- Jeśli brak ochrony, system generuje alert i proponuje montaż diod lub bezpieczników.  
- Oblicza potencjalne skutki odwrotnego podłączenia (prąd, napięcie, energia).  
  
**Efekt na ekranie:**  
- Alert: *„Odwrotne podłączenie baterii do falownika uszkodzi kondensatory wejściowe. Zamontuj diodę zabezpieczającą 200A lub wyłącznik z blokadą mechaniczną.”*  
- Schemat: gdzie i jak wpiąć diodę.  
- Ostrzeżenie: *„Zawsze sprawdzaj polaryzację miernikiem przed podłączeniem!”*  
  
**Migawka:** *„O co chodzi? Plus z minusem to jak ogień z benzyną. Zabezpieczenie to blokada, która nie pozwala na pomyłkę.”*  
  
**Powiązania:** Funkcja 4.11 (Analiza zwarciowa), Funkcja 4.28 (String Box), Funkcja 4.2 (Bezpieczniki).

---

### 5.15. Dobór wyłączników różnicowoprądowych (RCD)  *(dawne 4.15)*

  
**Skąd czerpie dane:**  
- Z układu sieci (TN/TT/IT), rodzaju odbiorników, typu falownika.  
- Z parametrów instalacji AC (napięcie, prąd, częstotliwość).  
- Z bazy danych wyłączników RCD (typ AC, A, B, F, B+).  
  
**Gdzie ląduje:**  
- W module `rcd_selection`.  
  
**Jak działa logika:**  
- System analizuje charakter odbiorników i falownika:  
  - **Falowniki off-grid** często generują prąd z komponentem stałym lub odkształconym – wymagają RCD typu B lub co najmniej A.  
  - **Odbiorniki z silnikami** (pompy, pralki) – wymagają RCD typu A (wykrywa prąd przemienny i pulsujący).  
  - **Ochrona osób** – RCD 30 mA.  
  - **Ochrona przeciwpożarowa** – RCD 300 mA.  
- System dobiera RCD do każdego obwodu końcowego i ewentualnie głównego.  
- Sprawdza selektywność różnicówki (główna 300 mA, obwodowa 30 mA).  
  
**Efekt na ekranie:**  
- Lista: *„Obwód gniazd: RCD typ A, 30 mA, 2P. Główny: RCD typ B, 300 mA, 4P (przy falowniku hybrydowym).”*  
- Ostrzeżenie: *„Ten falownik wymaga RCD typu B. Typ AC może nie zadziałać i zostaniesz porażony.”*  
- Schemat rozdzielni.  
  
**Migawka:** *„O co chodzi? RCD to strażnik, który wyczuwa, że prąd ucieka tam, gdzie nie powinien – np. do Twojego ciała. I wyłącza w ułamku sekundy.”*  
  
**Powiązania:** Funkcja 4.16 (Ochrona przed dotykiem), Funkcja 4.13 (Wyłączniki DC), Funkcja 4.40 (Pomiary).

---

### 5.16. Ochrona przed dotykiem bezpośrednim i pośrednim  *(dawne 4.16)*

  
**Skąd czerpie dane:**  
- Z rozmieszczenia urządzeń, stopnia ochrony obudów (IP), odległości izolacyjnych.  
- Z napięć i prądów w systemie (DC i AC).  
- Z norm i wytycznych (PN-EN 60529, IEC 61140).  
  
**Gdzie ląduje:**  
- W module `touch_protection`.  
  
**Jak działa logika:**  
- System analizuje dwa rodzaje ochrony:  
  - **Ochrona przed dotykiem bezpośrednim** – izolacja, obudowy, bariery, umieszczenie poza zasięgiem. Sprawdza, czy wszystkie przewody i zaciski są osłonięte.  
  - **Ochrona przed dotykiem pośrednim** – samoczynne wyłączenie zasilania przy zwarciu do obudowy. Wymaga sprawnego uziemienia i wyłączników (funkcje 4.8, 4.15).  
- Symuluje scenariusz: człowiek dotyka obudowy falownika, w którym przebiło się napięcie. Sprawdza, czy RCD zadziała w czasie < 0,4 s.  
- Wskazuje miejsca, gdzie wymagana jest osłona, kratka, osłona palcowa.  
  
**Efekt na ekranie:**  
- Lista: *„Zaciski baterii muszą być zakryte osłoną IP20. Przewody DC muszą być w peszlu izolacyjnym.”*  
- Ostrzeżenie: *„Obudowa paneli ma IP65, ale puszka przy gruncie ma IP54 – wymień na IP66, bo jest narażona na deszcz.”*  
- Schemat ochrony z oznaczeniami.  
  
**Migawka:** *„O co chodzi? Prąd nie wybacza. Jak dotkniesz nieosłoniętego plusa, to nie zdążysz krzyknąć. Osłony i szybkie wyłączniki to Twoje życie.”*  
  
**Powiązania:** Funkcja 4.8 (Uziemienie), Funkcja 4.15 (RCD), Funkcja 4.40 (Pomiary).

---

### 5.17. Monitorowanie izolacji (IMD) w instalacjach IT  *(dawne 4.17)*

  
**Skąd czerpie dane:**  
- Z konfiguracji systemu (układ IT/TN/TT), napięcia DC, liczby stringów.  
- Z parametrów falownika i BMS (czy wymagają pracy izolowanej).  
- Z norm i wytycznych dla instalacji off-grid.  
  
**Gdzie ląduje:**  
- W module `imd_monitoring`.  
  
**Jak działa logika:**  
- System sprawdza, czy instalacja DC pracuje w układzie izolowanym (IT). Jeśli tak, wymaga monitora izolacji (IMD).  
- Dobiera IMD o odpowiednim napięciu znamionowym i zakresie pomiaru rezystancji izolacji (np. alarm przy < 100 Ω/V).  
- Integruje IMD z systemem alarmowym (funkcja 3.26) i z wyłączeniem awaryjnym.  
- Ustala progi alarmowe i reakcję: ostrzeżenie, odłączenie stringa, wyłączenie falownika.  
  
**Efekt na ekranie:**  
- Schemat podłączenia IMD do szyn DC i GSW.  
- Komunikat: *„Dobierz IMD o napięciu 600V DC, alarm przy 50 kΩ. Przy doziemieniu system wyświetli ostrzeżenie i zaleci sprawdzenie instalacji.”*  
- Ostrzeżenie: *„Bez IMD w układzie IT pierwsze doziemienie może pozostać niewykryte, a drugie spowoduje zwarcie i pożar.”*  
  
**Migawka:** *„O co chodzi? W układzie IT nie ma bezpośredniego uziemienia, więc doziemienie nie wyłączy bezpiecznika. IMD to czujnik, który wyłapie problem, zanim stanie się groźny.”*  
  
**Powiązania:** Funkcja 4.8 (Uziemienie), Funkcja 4.10 (Uziemienie funkcjonalne vs. ochronne), Funkcja 4.40 (Pomiary).

---

### 5.18. Obciążalność długotrwała przewodów i korekcja temperaturowa  *(dawne 4.18)*

  
**Skąd czerpie dane:**  
- Z przekrojów kabli, temperatury otoczenia, sposobu ułożenia (w korytku, peszlu, ziemi), liczby obciążonych żył.  
- Z norm (PN-IEC 60364-5-52).  
  
**Gdzie ląduje:**  
- W module `cable_current_capacity`.  
  
**Jak działa logika:**  
- System sprawdza, czy wybrany przekrój przewodu wytrzyma długotrwale dany prąd w danych warunkach.  
- Uwzględnia współczynniki korekcyjne: temperatura otoczenia (np. 40°C → 0,87), liczba kabli w wiązce (np. 4 kable → 0,70), sposób ułożenia (w peszlu gorzej, w ziemi lepiej).  
- Oblicza efektywną obciążalność: `I_z = I_tab × k1 × k2 × k3...`  
- Porównuje z prądem znamionowym zabezpieczenia (`Ib ≤ In ≤ Iz`).  
  
**Efekt na ekranie:**  
- Tabela z wynikami: *„Kabel 6 mm² w peszlu w 40°C: obciążalność 28 A. Twój prąd: 25 A. OK.”*  
- Ostrzeżenie: *„Kabel 4 mm² w wiązce 6 kabli: obciążalność tylko 22 A, a prąd to 30 A. Za mało! Zwiększ przekrój lub rozdziel kable.”*  
  
**Migawka:** *„O co chodzi? Kable się nagrzewają. Jak jest gorąco i ciasno, to trzeba je odciążyć, żeby nie stopiły izolacji.”*  
  
**Powiązania:** Funkcja 4.1 (Dobór przekrojów), Funkcja 4.30 (Obciążalność w wiązkach), Funkcja 4.31 (Osłony).

---

### 5.19. Dobór szyn zbiorczych i listew rozdzielczych  *(dawne 4.19)*

  
**Skąd czerpie dane:**  
- Z prądów znamionowych i zwarciowych, liczby odpływów, wymiarów rozdzielni, materiału szyn (Cu/Al).  
  
**Gdzie ląduje:**  
- W module `busbar_selection`.  
  
**Jak działa logika:**  
- System oblicza minimalny przekrój szyn zbiorczych dla danego prądu i wytrzymałości zwarciowej.  
- Dobiera listwy rozdzielcze (zaciskowe) dla połączeń, uwzględniając liczbę obwodów i przekroje przewodów.  
- Sprawdza, czy szyna nie przegrzeje się przy zwarciu (wytrzymałość cieplna zwarciowa).  
- Zaleca stosowanie osłon na szyny i oznaczeń.  
  
**Efekt na ekranie:**  
- Schemat rozdzielni z rozmieszczeniem szyn.  
- Komunikat: *„Główna szyna 125 A: miedź 15×3 mm lub 2 × 10×3 mm. Liczba odpływów: 12. Potrzebujesz listwy zaciskowej 12-punktowej.”*  
- Ostrzeżenie: *„Nie podłączaj przewodów bezpośrednio do szyn bez zacisków – luźny styk to pożar.”*  
  
**Migawka:** *„O co chodzi? Szyna to autostrada dla prądu. Musi być wystarczająco szeroka, żeby się nie korkowało i nie grzało.”*  
  
**Powiązania:** Funkcja 4.18 (Obciążalność), Funkcja 4.24 (Zabezpieczenia termiczne), Funkcja 4.40 (Pomiary).

---

### 5.20. Połączenia śrubowe i zaciskowe – kontrola momentów  *(dawne 4.20)*

  
**Skąd czerpie dane:**  
- Z typów śrub (M6, M8, M10), materiałów przewodów (Cu, Al), rodzaju zacisków (śrubowe, sprężynowe).  
  
**Gdzie ląduje:**  
- W module `torque_control`.  
  
**Jak działa logika:**  
- System generuje tabelę momentów dokręcania dla różnych połączeń: szyny, wyłączniki, zaciski baterii, uziomy.  
- Uwzględnia, czy połączenie jest Cu-Cu, Cu-Al, czy Al-Al (dla Al wymagane inne momenty i pasta antykorozyjna).  
- Zaleca sprawdzenie momentu po 24 h (osiadanie) i okresowo (co 1–2 lata).  
- Ostrzega przed użyciem klucza udarowego i przed dokręcaniem na siłę.  
  
**Efekt na ekranie:**  
- Tabela: *„Zacisk baterii M8: 8 N·m. Szyna główna M10: 12 N·m. Uziom M8: 8 N·m.”*  
- Ostrzeżenie: *„Aluminium wymaga powtórnego dokręcenia po 24 h, bo ma skłonność do pełzania.”*  
  
**Migawka:** *„O co chodzi? Śruba to sprężyna. Jak za słabo – iskrzy. Jak za mocno – pęka. Trzeba trafić w idealny moment.”*  
  
**Powiązania:** Funkcja 3.12 (Moment dokręcania ogniw), Funkcja 4.39 (Korozja galwaniczna), Funkcja 4.40 (Pomiary).

---

### 5.21. Złącza MC4, rozgałęźniki i przejściówki (moduł scalony)

> Scalono dawne 4.21 i 4.35 — ta sama tematyka opisana dwukrotnie w v1.5.

#### 5.21.1. Złącza MC4, rozgałęźniki i przejściówki – dobór, kompatybilność i montaż  *(dawne 4.21)*

  
**Skąd czerpie dane:**  
- Z modeli paneli PV wybranych w Rozdziale 2 (typ złącz: MC4, MC4-Evo2, MC3, inne).  
- Z konfiguracji stringów i liczby paneli.  
- Z bazy danych złączek, rozgałęźników, przejściówek i narzędzi montażowych.  
- Z informacji o środowisku pracy (UV, wilgoć, temperatura).  
  
**Gdzie ląduje:**  
- W module `mc4_connectors`.  
  
**Jak działa logika:**  
- System sprawdza, jakie złącza mają wybrane panele i dobiera do nich kompatybilne elementy:  
  - **Typy złącz:** standard MC4, MC4-Evo2, MC3 (starsze panele). Sprawdza, czy parametry prądowe i napięciowe są odpowiednie dla prądu Isc i napięcia stringu.  
  - **Kompatybilność:** ostrzega przed łączeniem złączek różnych producentów bez pewności, że są certyfikowane jako kompatybilne. Zaleca stosowanie oryginalnych złączek tego samego producenta.  
  - **Rozgałęźniki:** dobiera trójniki Y lub T, jeśli użytkownik chce połączyć 2–3 stringi równolegle. Sprawdza prąd znamionowy rozgałęźnika (np. 15 A, 30 A).  
  - **Przejściówki:** jeśli panele mają stare MC3, system proponuje przejściówkę MC3 → MC4 lub wymianę złącz na nowe.  
  - **Narzędzia:** lista crimperów (zaciskarek), kluczy do MC4, ściągaczy izolacji, testerów ciągłości.  
- Generuje instrukcję montażu krok po kroku:  
  1. Zdejmij izolację z kabla solarnego (6–10 mm²) na długość ok. 6 mm.  
  2. Nałóż tulejkę uszczelniającą.  
  3. Zaciśnij pin na lince miedzianej.  
  4. Włóż pin do obudowy złączki, dokręć nakrętkę.  
  5. Sprawdź szczelność i ciągłość.  
- Ostrzega: nie łącz złączek pod napięciem, nie zostawiaj luzem na ziemi, nie ciągnij za kable.  
  
**Efekt na ekranie:**  
- Lista dobranych złączek i akcesoriów do koszyka.  
- Schemat rozgałęzień.  
- Komunikat: *„Twoje panele mają MC4-Evo2. Do połączenia 2 stringów użyj rozgałęźnika Y 2:1 MC4-Evo2 30 A. Potrzebujesz też crimpera do styków 4 mm².”*  
- Ostrzeżenie: *„Nie używaj tanich podróbek z nieznanym pinem – ryzyko przegrzania i pożaru.”*  
  
**Migawka:** *„O co chodzi? Złączka MC4 to jak wtyczka w sieci – niby prosta, ale jak styki są luźne, to się grzeje i pali. Trzeba ją zrobić porządnie.”*  
  
**Powiązania:** Funkcja 2.1 (Baza modeli paneli), Funkcja 4.28 (String Box), Funkcja 4.36 (Łączenie Cu/Al), Funkcja 4.40 (Pomiary).


---

#### 5.21.2. Złączki MC4, rozgałęźniki i przejściówki – szczegółowo  *(dawne 4.35)*

  
**Skąd czerpie dane:**  
- Z modeli paneli PV (typ złącz: MC4, MC4-Evo2, MC3) – z funkcji 2.1.  
- Z konfiguracji stringów i liczby paneli.  
- Z bazy danych złączek, rozgałęźników, przejściówek, narzędzi.  
- Z warunków środowiskowych (UV, wilgoć, temperatura).  
  
**Gdzie ląduje:**  
- W module `mc4_connectors`.  
  
**Jak działa logika:**  
- System sprawdza, jakie złącza mają wybrane panele i dobiera do nich kompatybilne elementy:  
  - **Typy złącz:** standard MC4, MC4-Evo2, MC3 (starsze panele). Sprawdza parametry prądowe i napięciowe.  
  - **Kompatybilność:** ostrzega przed łączeniem złączek różnych producentów bez certyfikatu kompatybilności. Zaleca stosowanie oryginalnych złączek tego samego producenta.  
  - **Rozgałęźniki:** dobiera trójniki Y lub T, jeśli użytkownik chce połączyć 2–3 stringi równolegle. Sprawdza prąd znamionowy (np. 15 A, 30 A).  
  - **Przejściówki:** jeśli panele mają stare MC3, proponuje przejściówkę MC3 → MC4 lub wymianę złącz.  
  - **Narzędzia:** lista crimperów, kluczy do MC4, ściągaczy izolacji, testerów ciągłości.  
- Generuje instrukcję montażu krok po kroku:  
  1. Zdejmij izolację z kabla solarnego (6–10 mm²) na długość ok. 6 mm.  
  2. Nałóż tulejkę uszczelniającą.  
  3. Zaciśnij pin na lince miedzianej.  
  4. Włóż pin do obudowy złączki, dokręć nakrętkę.  
  5. Sprawdź szczelność i ciągłość.  
- Ostrzega: nie łącz złączek pod napięciem, nie zostawiaj luzem na ziemi, nie ciągnij za kable.  
  
**Efekt na ekranie:**  
- Lista dobranych złączek i akcesoriów do koszyka.  
- Schemat rozgałęzień.  
- Komunikat: *„Twoje panele mają MC4-Evo2. Do połączenia 2 stringów użyj rozgałęźnika Y 2:1 MC4-Evo2 30 A. Potrzebujesz też crimpera do styków 4 mm².”*  
- Ostrzeżenie: *„Nie używaj tanich podróbek z nieznanym pinem – ryzyko przegrzania i pożaru.”*  
  
**Migawka:** *„O co chodzi? Złączka MC4 to jak wtyczka w sieci – niby prosta, ale jak styki są luźne, to się grzeje i pali. Trzeba ją zrobić porządnie.”*  
  
**Powiązania:** Funkcja 2.1 (Baza modeli paneli), 4.28 (String Box), 4.36 (Łączenie Cu/Al), 4.40 (Pomiary).


---

### 5.22. Trasy kablowe – prowadzenie i separacja  *(dawne 4.22)*

  
**Skąd czerpie dane:**  
- Z modelu 3D działki i budynku (Rozdział 0), z lokalizacji urządzeń (panele, falownik, baterie).  
- Z typów kabli (DC, AC, sygnałowe) i ich parametrów.  
- Z wymogów norm (PN-HD 60364-5-52, PN-EN 50174 dla kabli sygnałowych).  
  
**Gdzie ląduje:**  
- W module `cable_routing`.  
  
**Jak działa logika:**  
- System planuje optymalne trasy kablowe:  
  - **Kable DC (panele):** najkrótsza droga, najlepiej po północnej ścianie lub w cieniu, aby uniknąć przegrzania.  
  - **Kable AC (falownik):** prosto do rozdzielni, bez zbędnych zakrętów.  
  - **Kable sygnałowe (LAN, RS485):** oddzielnie, nie równolegle do DC/AC, odstęp min. 10–20 cm.  
- Sprawdza separację: kable silnoprądowe i sygnałowe nie mogą iść w tym samym korytku bez przegrody metalowej.  
- Uwzględnia promienie gięcia (dla kabli solarnych min. 4–5× średnica), mocowanie co ok. 30–50 cm dla kabli pionowych, co 50 cm dla poziomych.  
- Wskazuje przejścia przez ściany i dach – wymagane uszczelnienia i przepusty.  
  
**Efekt na ekranie:**  
- Mapa tras kablowych w 3D.  
- Lista punktów mocowania, przepustów, promieni gięcia.  
- Ostrzeżenie: *„Nie prowadź kabla DC w tym samym peszlu co kabel internetowy. Indukcja z falownika zakłóci transmisję.”*  
  
**Migawka:** *„O co chodzi? Kable to drogi. Nie chcesz, żeby ruch tranzytowy (prąd) blokował spokojną uliczkę (internet). Trzeba je prowadzić osobno.”*  
  
**Powiązania:** Funkcja 4.29 (Separacja EMC), Funkcja 4.31 (Osłony), Funkcja 4.33 (Optymalizacja trasy).

---

### 5.23. Oznakowanie i etykietowanie obwodów  *(dawne 4.23)*

  
**Skąd czerpie dane:**  
- Z listy obwodów, urządzeń, rozdzielni, puszek, tras kablowych.  
- Z norm (PN-EN 60445, IEC 62491) i zasad kolorystyki przewodów.  
  
**Gdzie ląduje:**  
- W module `labeling`.  
  
**Jak działa logika:**  
- System generuje etykiety dla wszystkich elementów:  
  - **Przewody:** kolorystyka – DC: czerwony (+), niebieski/żółto-zielony (–/PE), AC: fazy (brązowy/czarny/szary), neutralny (niebieski), ochronny (żółto-zielony).  
  - **Obwody:** np. „String 1 – Dach południowy”, „Bateria – główny”, „Oświetlenie – strych”.  
  - **Aparaty:** wyłączniki, RCD, SPD, bezpieczniki – nazwa, prąd, data montażu.  
  - **Rozdzielnice:** schemat jednokreskowy z numeracją.  
- Tworzy kody QR/etykiety drukowane na kabelek.  
- Uwzględnia oznaczenia ostrzegawcze: „Uwaga! Napięcie DC – nie odłączać pod obciążeniem”, „Bateria – ryzyko zwarcia”.  
  
**Efekt na ekranie:**  
- Podgląd etykiet do druku.  
- Lista: *„Oznacz 12 przewodów, 8 wyłączników, 3 puszki, 1 rozdzielnię.”*  
- Ostrzeżenie: *„Nieoznaczone przewody to proszenie się o błąd przy serwisie.”*  
  
**Migawka:** *„O co chodzi? Za 5 lat zapomnisz, co jest czym. Etykieta to pamięć twojego systemu.”*  
  
**Powiązania:** Funkcja 4.25 (BOM), Funkcja 4.40 (Pomiary), Funkcja 7.1 (Tryb live).

---

### 5.24. Zabezpieczenia termiczne szyn i połączeń  *(dawne 4.24)*

  
**Skąd czerpie dane:**  
- Z prądów znamionowych i zwarciowych, z materiałów szyn i przewodów, z temperatur dopuszczalnych.  
- Z wymiarów rozdzielni i sposobu montażu.  
  
**Gdzie ląduje:**  
- W module `thermal_monitoring`.  
  
**Jak działa logika:**  
- System oblicza, które połączenia są najbardziej narażone na przegrzanie (szyny, zaciski baterii, złączki MC4).  
- Dobiera czujniki temperatury (termistory, czujniki PT100, pirometry) do montażu na szynach i kluczowych zaciskach.  
- Integruje je z systemem alarmowym (funkcja 3.26) i z wyłączeniem awaryjnym.  
- Ustala progi: ostrzeżenie przy 60°C, alarm przy 80°C, wyłączenie przy 100°C (zależnie od izolacji).  
- Zaleca okresowe skanowanie termowizyjne (co 1–2 lata) – patrz funkcja 4.40.  
  
**Efekt na ekranie:**  
- Mapa cieplna rozdzielni z zaznaczonymi punktami pomiarowymi.  
- Komunikat: *„Zamontuj 3 czujniki temperatury: na szynie głównej, na zacisku baterii, na wejściu DC falownika.”*  
- Ostrzeżenie: *„Luźny styk na szynie to +50°C i ryzyko pożaru. Czujnik termiczny złapie to, zanim będzie za późno.”*  
  
**Migawka:** *„O co chodzi? Gorące punkty to pierwsze objawy awarii. Czujnik to termometr, który w porę podniesie alarm.”*  
  
**Powiązania:** Funkcja 4.20 (Momenty dokręcania), Funkcja 3.26 (Czarna skrzynka), Funkcja 4.40 (Pomiary).

---

### 5.25. Lista materiałów (BOM) dla instalacji elektrycznej  *(dawne 4.25)*

  
**Skąd czerpie dane:**  
- Z wszystkich wcześniejszych funkcji Rozdziału 4: dobrane przewody, bezpieczniki, RCD, SPD, szyny, złączki, osłony, uziomy, aparatura.  
- Z projektu systemu (Rozdziały 0–3) – długości tras, liczba paneli, moc falownika, pojemność baterii.  
  
**Gdzie ląduje:**  
- W module `electrical_bom`.  
  
**Jak działa logika:**  
- System zbiera wszystkie pozycje wymagane do wykonania instalacji elektrycznej i grupuje je w kategorie:  
  - Przewody (typ, przekrój, długość),  
  - Zabezpieczenia (bezpieczniki, wyłączniki, RCD, SPD),  
  - Szyny i listwy,  
  - Złączki MC4, rozgałęźniki, przejściówki,  
  - Osłony (peszle, korytka, rury),  
  - Uziomy i bednarka,  
  - Etykiety, opaski kablowe, dławiki,  
  - Narzędzia (crimper, klucze dynamometryczne, mierniki).  
- Generuje listę zakupową z ilościami, symbolami producentów, orientacyjnymi cenami.  
- Uwzględnia zapas 10–15% na odpady i nieprzewidziane sytuacje.  
- Ostrzega przed zakupem tanich zamienników bez certyfikatów.  
  
**Efekt na ekranie:**  
- Interaktywna lista z checkboxami do odhaczania.  
- Możliwość eksportu do PDF/CSV lub wysłania do sklepu.  
- Komunikat: *„Całkowity koszt materiałów: 4 280 zł. Zapas 10% doliczony. Brakuje Ci: 2 × bezpiecznik Class T 200A.”*  
  
**Migawka:** *„O co chodzi? Dobra lista zakupowa to połowa sukcesu. Bez niej pojedziesz po kabel trzy razy do sklepu.”*  
  
**Powiązania:** Funkcja 4.1 (Dobór przekrojów), 4.5 (SPD), 4.13 (Wyłączniki DC), 4.35 (Złączki MC4), 4.40 (Pomiary).

---

### 5.26. Normy i certyfikaty – sprawdzenie zgodności  *(dawne 4.26)*

  
**Skąd czerpie dane:**  
- Z bazy danych komponentów i ich certyfikatów.  
- Z lokalnych wymagań prawnych (Polska / UE).  
- Z konfiguracji instalacji (napięcia, moce, typ baterii).  
  
**Gdzie ląduje:**  
- W module `standards_compliance`.  
  
**Jak działa logika:**  
- System sprawdza, czy wybrane komponenty i projekt spełniają normy:  
  - **DC:** PN-EN 61730 (bezpieczeństwo modułów PV), PN-EN 62852 (złączki PV), IEC 62446 (dokumentacja systemu PV).  
  - **AC:** PN-HD 60364 (instalacje niskiego napięcia), IEC 62109 (falowniki), EN 61439 (rozdzielnice).  
  - **Baterie:** IEC 62619 (bezpieczeństwo ogniw LiFePO4), IEC 62620 (przemysłowe ogniwa), UN38.3 (transport).  
- Weryfikuje, czy aparatura ma odpowiednie certyfikaty (CE, TUV, UL, VDE) i czy jest dopuszczona do stosowania w instalacjach PV.  
- Ostrzega przed komponentami bez certyfikatów (np. tanie złączki MC4 z AliExpress bez atestu).  
  
**Efekt na ekranie:**  
- Tabela zgodności: *„Panele: OK (IEC 61215). Falownik: OK (IEC 62109). BMS: BRAK certyfikatu IEC 62619 – ryzyko!”*  
- Ostrzeżenie: *„Ten BMS nie przeszedł testów bezpieczeństwa. W razie pożaru ubezpieczyciel odmówi wypłaty.”*  
- Raport PDF dla projektu.  
  
**Migawka:** *„O co chodzi? Certyfikat to dowód, że coś nie wybuchnie przy normalnym użytkowaniu. Bez niego jesteś testerem beta.”*  
  
**Powiązania:** Funkcja 4.25 (BOM), 4.5 (SPD), 3.27 (Bezpieczniki DC), 3.34 (Porównanie technologii).

---

### 5.27. Obliczanie długości tras i spadków napięć na dystansie (Panel -> Falownik)  *(dawne 4.27)*

  
**Skąd czerpie dane:**  
- Z modelu 3D działki i budynku (Rozdział 0) – odległości między panelami a falownikiem.  
- Z prądu i napięcia stringów (funkcja 2.1, 2.2).  
- Z długości i przekrojów kabli (funkcja 4.1).  
  
**Gdzie ląduje:**  
- W module `long_distance_loss`.  
  
**Jak działa logika:**  
- System oblicza rzeczywistą długość trasy kablowej między panelem a falownikiem (np. 50 m, uwzględniając spadki przez korytka, peszle, zakręty).  
- Wykorzystuje wzór na spadek napięcia: ΔU = I × R, gdzie R = ρ × L / S (ρ dla miedzi = 0,0175 Ω·mm²/m).  
- Sprawdza dopuszczalny spadek napięcia dla obwodu DC (zwykle < 1–2%).  
- Jeśli spadek jest za duży, dobiera większy przekrój lub sugeruje podniesienie napięcia systemowego (np. z 24V na 48V), co obniża prąd i straty.  
- Uwzględnia koszty: grubszy kabel jest droższy, ale niższe straty energii w ciągu 10 lat mogą zwrócić różnicę.  
  
**Efekt na ekranie:**  
- Tabela: *„Dla trasy 45 m, prąd 15 A, napięcie 96V: kabel 6 mm² → spadek 3,2% (za dużo), 10 mm² → 1,9% (OK), 16 mm² → 1,2% (idealnie).”*  
- Ostrzeżenie: *„Przy spadku 4% rocznie tracisz 80 kWh – to 80 zł. Warto dopłacić do grubszego kabla.”*  
- Mapa trasy.  
  
**Migawka:** *„O co chodzi? Prąd idący długim kablem traci energię jak woda w długiej wążu. Trzeba dać grubszą rurę, żeby nie spadło ciśnienie.”*  
  
**Powiązania:** Funkcja 4.1 (Dobór przekrojów), 4.18 (Obciążalność), 4.33 (Optymalizacja trasy), 2.11 (Voc max).

---

### 5.28. Łączenie i rozdzielanie stringów (String Box / Array Box)  *(dawne 4.28)*

  
**Skąd czerpie dane:**  
- Z liczby stringów i ich parametrów (Isc, Vmp) – z Rozdziału 2.  
- Z lokalizacji paneli (dach, ogrodzenie, grunt).  
- Z konfiguracji falownika (liczba wejść MPPT, maksymalny prąd wejściowy).  
  
**Gdzie ląduje:**  
- W module `string_box`.  
  
**Jak działa logika:**  
- System sprawdza, czy użytkownik potrzebuje połączyć kilka stringów równolegle, zanim wprowadzi je do falownika.  
- Dobiera skrzynkę stringową (String Box) o odpowiedniej liczbie wejść (np. 2, 3, 4 stringi) i prądzie znamionowym.  
- Dobiera wyposażenie skrzynki:  
  - **Bezpieczniki stringowe** (zwykle 15–20 A na string),  
  - **SPD Typ 2** (zgodnie z funkcją 4.5),  
  - **Rozłącznik izolacyjny DC** (np. 2P 32A),  
  - **Złączki MC4** do wprowadzenia kabli.  
- Generuje schemat: każdy string wpina się do swojego bezpiecznika, potem do wspólnej szyny, a z szyny wychodzi jeden kabel do falownika.  
- Sprawdza, czy prąd sumaryczny nie przekracza prądu wejściowego MPPT i czy napięcie jest zgodne.  
  
**Efekt na ekranie:**  
- Schemat skrzynki stringowej.  
- Lista wyposażenia i wymiarów.  
- Ostrzeżenie: *„Nie łącz stringów bezpośrednio na wolnym powietrzu. Użyj skrzynki IP66 z bezpiecznikami.”*  
  
**Migawka:** *„O co chodzi? String box to węzeł, w którym kable z paneli spotykają się w uporządkowany sposób. Bez tego masz plątaninę i ryzyko pożaru.”*  
  
**Powiązania:** Funkcja 4.5 (SPD), 4.13 (Wyłączniki DC), 4.21 (Złączki MC4), 4.35 (Rozgałęźniki).

---

### 5.29. Separacja kabli silnoprądowych i sygnałowych (EMC)  *(dawne 4.29)*

  
**Skąd czerpie dane:**  
- Z listy kabli DC/AC oraz kabli sygnałowych (LAN, RS485, anteny).  
- Z norm EMC (PN-EN 50174).  
  
**Gdzie ląduje:**  
- W module `emc_separation`.  
  
**Jak działa logika:**  
- System sprawdza, czy w pobliżu tras DC/AC biegną kable sygnałowe.  
- Wymusza prowadzenie ich w osobnych kanałach, peszlach lub w odległości minimum 10–20 cm od siebie.  
- Jeśli muszą się skrzyżować, wymaga krzyżowania pod kątem prostym, a nie równolegle.  
- Uwzględnia ekranowanie kabli sygnałowych (np. skrętka FTP zamiast UTP) przy trasach w pobliżu falownika.  
  
**Efekt na ekranie:**  
- Ostrzeżenie: *„Kabel Ethernet nie może iść w tym samym pęczku co przewody DC z paneli! Zakłócenia z inwertera mogą przerwać monitoring systemu.”*  
- Schemat separacji.  
  
**Migawka:** *„O co chodzi? Prąd w kablu robi pole magnetyczne. To pole może mówić do kabla internetowego: 'Nie prześlesz dziś danych'. Trzeba je rozdzielić.”*  
  
**Powiązania:** Funkcja 4.22 (Trasy), 4.31 (Osłony), 7.1 (Tryb live).

---

### 5.30. Obciążalność kabli przy łączeniu w wiązki (Derating / Bundling)  *(dawne 4.30)*

  
**Skąd czerpie dane:**  
- Z liczby kabli prądowych prowadzonych w jednym pęczku, korytku lub peszlu.  
- Z przekrojów kabli i prądów roboczych.  
- Z tabel normatywnych (PN-IEC 60364-5-52).  
  
**Gdzie ląduje:**  
- W module `cable_bundling`.  
  
**Jak działa logika:**  
- System sprawdza, ile kabli prądowych leży obok siebie.  
- Im więcej kabli w wiązce, tym gorzej się chłodzą (ciepło). System stosuje współczynniki korekcyjne (np. dla 4-6 kabli w wiązce obniża obciążalność o 30-40%).  
- Oblicza skorygowaną obciążalność i porównuje z prądem roboczym.  
- Jeśli obciążalność jest zbyt niska, sugeruje:  
  - zwiększenie przekroju kabli,  
  - rozdzielenie ich do osobnych kanałów,  
  - zwiększenie odstępów między kablami.  
  
**Efekt na ekranie:**  
- Tabela: *„Masz 4 kable DC w jednym korytku. Przez gorsze chłodzenie ich obciążalność spada z 50A do 35A. Zwiększ przekrój kabli z 10 mm² na 16 mm².”*  
- Ostrzeżenie: *„Zbyt ciasno – kable się grzeją i tracą żywotność.”*  
  
**Migawka:** *„O co chodzi? Jak upchniesz za dużo kabli obok siebie, to zrobi się im gorąco. Trzeba dać im przestrzeń albo grubszy przekrój.”*  
  
**Powiązania:** Funkcja 4.18 (Obciążalność), 4.22 (Trasy), 4.31 (Osłony).

---

### 5.31. Zastosowanie peszli, koryt i rurek instalacyjnych  *(dawne 4.31)*

  
**Skąd czerpie dane:**  
- Z typu kabli (DC, AC, sygnałowe), warunków środowiskowych (UV, wilgoć, temperatura), miejsca montażu (ściana, ziemia, dach).  
- Z bazy danych osłon (peszle, korytka, rurki).  
  
**Gdzie ląduje:**  
- W module `cable_conduits`.  
  
**Jak działa logika:**  
- System dobiera odpowiedni typ osłony:  
  - **W budynku:** listwy, korytka PCV, peszle karbowane.  
  - **Na zewnątrz po ścianach:** peszle czarne UV-odporne, korytka metalowe ocynkowane.  
  - **W ziemi:** rury HDPE (twarde), peszle karbowane do gruntu.  
  - **Napowietrzne:** przewody samonośne lub mocowane na lince nośnej.  
- Sprawdza, czy osłona jest odporna na UV, wilgoć, ściskanie, temperaturę.  
- Uwzględnia promienie gięcia i średnice osłon (zapas 30–50% na przyszłe kable).  
  
**Efekt na ekranie:**  
- Lista osłon dla każdej trasy: *„Ściana południowa: peszel czarny UV 20 mm. Ziemia: rura HDPE 32 mm. Strych: korytko PCV 40×25 mm.”*  
- Ostrzeżenie: *„Nie używaj białych listew wewnętrznych na zewnątrz – rozsypią się od słońca.”*  
  
**Migawka:** *„O co chodzi? Osłona to ubranie dla kabla. Musi być dobrane do pogody i miejsca, inaczej kabel się zużyje.”*  
  
**Powiązania:** Funkcja 4.22 (Trasy), 4.32 (Gryzonie), 4.38 (Izolacje).

---

### 5.32. Ochrona przed gryzoniami i uszkodzeniami mechanicznymi  *(dawne 4.32)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (działka leśna, gospodarstwo, strych), z rodzaju kabli, z trasy prowadzenia.  
  
**Gdzie ląduje:**  
- W module `rodent_protection`.  
  
**Jak działa logika:**  
- System analizuje ryzyko uszkodzeń mechanicznych i gryzoni:  
  - **Działka leśna:** wysokie ryzyko kun, myszy, wiewiórek.  
  - **Gospodarstwo:** ryzyko uszkodzeń przez zwierzęta i maszyny.  
  - **Strych:** ryzyko myszy i kun.  
- Jeśli ryzyko wysokie, zaleca:  
  - peszle metalowe (stalowe spiralne),  
  - rury HDPE w ziemi,  
  - korytka stalowe z pokrywą,  
  - unikanie luźnych kabli na strychu.  
- Dobiera odpowiednie osłony i ostrzega przed tanimi plastikowymi peszlami, które gryzonie przegryzą.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto wysokie ryzyko (działka leśna). Zabezpiecz kable DC na zewnątrz peszlem metalowym spiralnym.”*  
- Lista zalecanych osłon.  
  
**Migawka:** *„O co chodzi? Mysz nie patrzy, czy kabel jest ładny. Po prostu go przegryzie i zrobi zwarcie.”*  
  
**Powiązania:** Funkcja 4.31 (Osłony), 4.22 (Trasy), 4.40 (Pomiary).

---

### 5.33. Optymalizacja trasy i kosztu kabla (Najkrótsza vs. Wykonalna)  *(dawne 4.33)*

  
**Skąd czerpie dane:**  
- Z modelu 3D działki i budynku (Rozdział 0), z lokalizacji paneli, falownika i baterii.  
- Z długości tras, przekrojów kabli, cen miedzi/aluminium.  
- Z obliczeń strat energii (funkcja 4.27) i spadków napięć.  
  
**Gdzie ląduje:**  
- W module `cable_cost_optimization`.  
  
**Jak działa logika:**  
- System porównuje możliwe trasy kablowe:  
  - **Najkrótsza** (np. po prostej przez strych) vs. **Wykonalna** (po obrysie dachu, w ziemi, wokół przeszkód).  
- Dla każdej trasy oblicza:  
  - długość i koszt kabla (uwzględniając przekrój),  
  - koszt osłon (peszle, korytka, rury),  
  - roczne straty energii (kWh) i ich koszt w perspektywie 10 lat.  
- Uwzględnia koszt robocizny (dłuższa trasa = więcej pracy).  
- Wskazuje trasę o najniższym całkowitym koszcie posiadania (TCO), nie tylko najtańszy kabel.  
- Uwzględnia realia terenu: przeszkody, estetyka, dostęp serwisowy.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Trasa A: 15 m, kabel 16 mm², koszt 400 zł, straty 20 kWh/rok. Trasa B: 25 m, kabel 10 mm², koszt 300 zł, straty 45 kWh/rok. Po 10 latach Trasa A jest tańsza o 200 zł.”*  
- Rekomendacja: *„Wybierz Trasę A – droższy kabel, ale mniejsze straty i niższy całkowity koszt.”*  
  
**Migawka:** *„O co chodzi? Nie patrz tylko na cenę kabla. Grubszy, krótszy kabel zwraca się w mniejszych stratach przez lata.”*  
  
**Powiązania:** Funkcja 4.27 (Spadki napięć), 4.18 (Obciążalność), 4.22 (Trasy), 4.25 (BOM).

---

### 5.34. Puszki połączeniowe i skrzynki przelotowe  *(dawne 4.34)*

  
**Skąd czerpie dane:**  
- Z tras kablowych (funkcja 4.22), z liczby połączeń, z warunków środowiskowych (IP).  
- Z typów kabli i ich przekrojów.  
  
**Gdzie ląduje:**  
- W module `junction_boxes`.  
  
**Jak działa logika:**  
- System identyfikuje miejsca, w których kable muszą być łączone, rozgałęziane lub przedłużane.  
- Dobiera puszki połączeniowe o odpowiednim stopniu ochrony (IP66 na zewnątrz, IP20 wewnątrz).  
- Uwzględnia wymagania:  
  - **Na zewnątrz:** puszki z uszczelkami, dławikami, odporne na UV.  
  - **W ziemi:** puszki zalewane żywicą lub specjalne puszki ziemne.  
  - **Przy panelach:** puszki przygruntowe IP66.  
- Zaleca zostawienie zapasu kabla w puszce (pętla 10–15 cm) na ewentualne poprawki.  
- Przypomina o oznaczeniu puszek i przewodów (funkcja 4.23).  
- Ostrzega przed łączeniem kabli na wolnym powietrzu bez ochrony.  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia puszek.  
- Lista: *„Puszka P1: przy rogu ściany, IP66, 3 wejścia. Puszka P2: przy gruncie, IP66, 2 wejścia.”*  
- Ostrzeżenie: *„Nie przedłużaj kabla w ziemi bez puszki – to tam wchodzi wilgoć i korozja.”*  
  
**Migawka:** *„O co chodzi? Każde połączenie to potencjalny przeciek. Trzeba je zamknąć w szczelnej puszce, żeby woda nie zrobiła zwarcia.”*  
  
**Powiązania:** Funkcja 4.22 (Trasy), 4.31 (Osłony), 4.23 (Oznakowanie), 4.40 (Pomiary).

---

### 5.35. Łączenie przewodów miedzianych i aluminiowych (bimetaliczne złączki, przejściówki)  *(dawne 4.36)*

  
**Skąd czerpie dane:**  
- Z materiału przewodów (Cu, Al) i ich przekrojów.  
- Z miejsc łączenia (rozdzielnice, szyny, zaciski).  
- Z warunków środowiskowych (wilgoć, temperatura, korozja).  
  
**Gdzie ląduje:**  
- W module `cu_al_connections`.  
  
**Jak działa logika:**  
- System wyjaśnia zasadę: **miedzi i aluminium nie wolno łączyć bezpośrednio**, bo powstaje ogniwo galwaniczne. Aluminium koroduje, rośnie rezystancja, połączenie się grzeje i iskrzy.  
- Dobiera odpowiednie złączki bimetaliczne (Cu/Al) lub przejściówki, które oddzielają oba metale.  
- Wskazuje miejsca, gdzie takie połączenia są dopuszczalne i jak je wykonać:  
  - **Zaciski bimetaliczne** w rozdzielnicach,  
  - **Podkładki bimetaliczne** pod śruby,  
  - **Pasty antykorozyjne** i smary do aluminium,  
  - **Śruby nierdzewne** (nie ocynkowane, bo reagują z aluminium).  
- Oblicza wymagany moment dokręcania dla połączeń Al (inne niż dla Cu).  
- Zaleca sprawdzenie połączenia po 24 h i okresowo.  
  
**Efekt na ekranie:**  
- Schemat prawidłowego połączenia Cu-Al.  
- Ostrzeżenie: *„Bezpośrednie połączenie miedź-aluminium będzie korodować i się grzać. Użyj złączki bimetalicznej i pasty antykorozyjnej.”*  
- Lista produktów do koszyka.  
  
**Migawka:** *„O co chodzi? Miedź i aluminium to jak małżeństwo z problemami – pod wpływem wilgoci zaczynają się kłócić. Trzeba je rozdzielić barierą.”*  
  
**Powiązania:** Funkcja 4.37 (Porównanie Cu/Al), 4.39 (Korozja galwaniczna), 4.20 (Momenty dokręcania), 4.40 (Pomiary).

---

### 5.36. Porównanie przewodów miedzianych i aluminiowych oraz jednodrutowych vs. linka  *(dawne 4.37)*

  
**Skąd czerpie dane:**  
- Z parametrów instalacji: prądy, napięcia, długości tras, warunki montażu.  
- Z bazy danych przewodów (Cu, Al, linka, drut) i ich obciążalności.  
  
**Gdzie ląduje:**  
- W module `cu_al_comparison`.  
  
**Jak działa logika:**  
- System porównuje właściwości przewodów:  
  - **Miedź (Cu):** wyższa przewodność (mniejszy przekrój dla tego samego prądu), odporna na korozję, droższa, cięższa.  
  - **Aluminium (Al):** niższa przewodność (wymaga ok. 1,6× większego przekroju), lżejsze, tańsze, wymaga specjalnych złączek (funkcja 4.36).  
- Dla tego samego prądu i długości system dobiera porównawcze przekroje:  
  - Cu 10 mm² odpowiada Al 16 mm².  
- Porównuje wagę, koszt, spadki napięcia, trwałość.  
- Osobno rozpatruje linkę vs. drut:  
  - **Linka (skrętka miedziana):** giętka, łatwa w prowadzeniu, lepsza przy zakrętach, wymaga zacisków linkowych, mniejsza odporność na uszkodzenia mechaniczne.  
  - **Drut (jednodrutowy):** sztywniejszy, tańszy, lepszy do prostych odcinków i szyn, łatwiejszy w mocowaniu, łatwiej pęka przy zginaniu.  
- Rekomenduje typ dla każdego zastosowania: linka do paneli i falownika (drgania, gięcie), drut do szyn i instalacji wewnętrznych (sztywno).  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Cu 10 mm² vs Al 16 mm²: obciążalność 60 A vs 60 A, waga 0,09 kg/m vs 0,05 kg/m, cena 12 zł/m vs 7 zł/m.”*  
- Komunikat: *„Dla długiej trasy 50 m w ziemi aluminium może być tańsze, ale wymaga złączek bimetalicznych. W instalacji wewnątrz budynku wybierz miedź – prostsza i bezpieczniejsza.”*  
- Ostrzeżenie: *„Nie używaj drutu tam, gdzie są drgania lub częste ruchy – pęknie.”*  
  
**Migawka:** *„O co chodzi? Miedź to koń wyścigowy, aluminium to oszczędny muł. Linka to wąż, drut to patyk. Do każdej drogi inny przewód.”*  
  
**Powiązania:** Funkcja 4.36 (Łączenie Cu/Al), 4.1 (Dobór przekrojów), 4.18 (Obciążalność), 4.25 (BOM).

---

### 5.37. Dobór izolacji i powłok kabli do warunków montażu (ziemia, UV, napowietrzne, ukryte)  *(dawne 4.38)*

  
**Skąd czerpie dane:**  
- Z lokalizacji tras kablowych (w ziemi, na zewnątrz, w budynku, napowietrznie).  
- Z warunków środowiskowych (UV, wilgoć, temperatura, gryzonie).  
- Z bazy danych kabli i ich powłok (PVC, XLPE, PE, bezhalogenowe).  
  
**Gdzie ląduje:**  
- W module `cable_insulation_selection`.  
  
**Jak działa logika:**  
- System dobiera izolację i powłokę dla każdego odcinka:  
  - **W ziemi:** kable YKY, YAKY (PVC), YKXS, YAKXS (XLPE), w rurach HDPE. Powłoka odporna na wilgoć i ściskanie.  
  - **Na zewnątrz po ścianach:** kable UV-odporne, najlepiej XLPE lub z powłoką PE. Peszel czarny UV.  
  - **Napowietrzne:** przewody samonośne (AsXSn, AXSn) lub mocowane na lince nośnej z izolacją XLPE.  
  - **W pomieszczeniach:** PVC (YY, YDY), bezhalogenowe (LIHCH) w budynkach użyteczności publicznej, unikać PVC przy wysokiej temperaturze.  
  - **W miejscach mokrych:** kable z powłoką gumową lub XLPE.  
- Sprawdza wytrzymałość temperaturową: dla instalacji przy panelach (lato +70°C) kable z izolacją XLPE (90°C), nie PVC (70°C).  
- Uwzględnia promień gięcia i elastyczność.  
- Ostrzega przed stosowaniem zwykłych kabli wewnętrznych na zewnątrz (UV niszczy izolację).  
  
**Efekt na ekranie:**  
- Tabela dla każdego odcinka: *„Ziemia: YKY 3×2,5 mm² w rurze HDPE 32. Ściana południowa: peszel czarny UV + kabel solarny 6 mm².”*  
- Ostrzeżenie: *„Kabel PVC na słońcu zrobi się kruchy w 2 lata – pęknie i dostanie się woda.”*  
  
**Migawka:** *„O co chodzi? Izolacja to skóra kabla. Musi być dobrana do pogody i miejsca, inaczej pęka i puszcza wilgoć.”*  
  
**Powiązania:** Funkcja 4.31 (Osłony), 4.22 (Trasy), 4.32 (Gryzonie), 4.27 (Długie trasy).

---

### 5.38. Ochrona przed korozją galwaniczną i podkładki bimetaliczne  *(dawne 4.39)*

  
**Skąd czerpie dane:**  
- Z materiałów łączonych elementów: miedź, aluminium, stal, mosiądz, nierdzewka.  
- Z miejsc montażu (rozdzielnice, szyny, uziomy, konstrukcje paneli).  
- Z warunków środowiskowych (wilgoć, sól, temperatura).  
  
**Gdzie ląduje:**  
- W module `galvanic_corrosion_protection`.  
  
**Jak działa logika:**  
- System analizuje pary metali, które mogą się dotykać:  
  - **Miedź – aluminium:** korozja bardzo szybka, wymagane złączki bimetaliczne i pasta antykorozyjna.  
  - **Stal ocynkowana – miedź:** korozja umiarkowana, wymagane podkładki i smar.  
  - **Stal nierdzewna – aluminium:** zwykle bezpieczne, ale w środowisku słonym może korodować.  
- Dobiera podkładki bimetaliczne, pasty, smary, śruby odpowiedniej jakości.  
- Sprawdza, czy uziomy i szyny nie są narażone na bezpośredni kontakt różnych metali.  
- Zaleca okresową kontrolę połączeń (funkcja 4.20) i pomiary termowizyjne (funkcja 4.40).  
  
**Efekt na ekranie:**  
- Tabela metali: *„Cu + Al: ZABRONIONE bez bariery. Cu + Stal ocynk: WYMAGANA podkładka. Al + Nierdzewka: OK w suchym środowisku.”*  
- Ostrzeżenie: *„Jeśli przykręcasz szynę miedzianą do aluminiowej, użyj podkładki bimetalicznej i pasty, inaczej za rok stracisz połączenie.”*  
  
**Migawka:** *„O co chodzi? Różne metale w wilgoci robią sobie nawzajem krzywdę. Trzeba je rozdzielić, żeby się nie zjadły.”*  
  
**Powiązania:** Funkcja 4.36 (Łączenie Cu/Al), 4.20 (Momenty dokręcania), 4.40 (Pomiary), 4.9 (GSW).

---

### 5.39. Pomiary i testy powykonawcze (ciągłość, izolacja, rezystancja uziemienia, termowizja)  *(dawne 4.40)*

  
**Skąd czerpie dane:**  
- Z wykonanej instalacji (wszystkie obwody, połączenia, uziomy, zabezpieczenia).  
- Z norm i wytycznych (IEC 62446, PN-HD 60364).  
- Z parametrów systemu (napięcia, prądy, moc).  
  
**Gdzie ląduje:**  
- W module `commissioning_tests`.  
  
**Jak działa logika:**  
- System generuje listę testów powykonawczych:  
  1. **Ciągłość przewodów ochronnych** – sprawdzenie, czy wszystkie metalowe części są połączone z GSW.  
  2. **Rezystancja izolacji** – pomiar megaomomierzem (DC 500V/1000V) między przewodami i ziemią. Wymagane > 1 MΩ.  
  3. **Rezystancja uziemienia** – dla uziomu < 10 Ω (odgrom), < 30 Ω (ochrona).  
  4. **Test RCD** – czy wyłączniki różnicowoprądowe działają przy prądzie zadziałania (30 mA/300 mA) w czasie < 0,4 s.  
  5. **Test zwarciowy pętli** – czy zabezpieczenia zadziałają przy zwarciu.  
  6. **Pomiar napięcia i polaryzacji** – na każdym stringu, wejściu falownika, baterii.  
  7. **Termowizja** – skan wszystkich połączeń, szyn, złączek MC4 pod obciążeniem. Wskazuje gorące punkty.  
- Zapisuje wyniki do dziennika (funkcja 3.26) i generuje raport.  
- Jeśli któryś test nie przechodzi, system wskazuje problem i kroki naprawcze.  
  
**Efekt na ekranie:**  
- Lista testów z polami „OK / Błąd”.  
- Komunikat: *„Rezystancja izolacji stringu 2: 0,8 MΩ – za mało! Sprawdź kabel i złączki.”*  
- Raport PDF dla klienta i ubezpieczyciela.  
  
**Migawka:** *„O co chodzi? Po montażu trzeba sprawdzić, czy wszystko działa i czy nic nie kopie. To jak badanie techniczne samochodu – bez niego nie wyjeżdżasz.”*  
  
**Powiązania:** Funkcja 4.8 (Uziemienie), 4.15 (RCD), 3.26 (Czarna skrzynka), 7.1 (Tryb live).  
  
## Rozdział 5: Termika, wentylacja i pompa ciepła

---

## Moduł 6 (Kafel 6): Ogrzewanie / wentylacja / pompa ciepła

*Dawny Rozdział 5. Pozycje 5.27–5.100 (74 funkcje) to w praktyce jeden schemat: "analiza wpływu czynnika X na dobór mocy / COP pompy ciepła", powielony dla 74 różnych czynników. Scalono w jeden silnik symulacyjny z listą parametrów wejściowych — cała oryginalna treść zachowana jako pod-punkty (jeden na czynnik).*

### 6.1. Charakterystyka termiczna budynku  *(dawne 5.1)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza powierzchnię, typ ocieplenia, rok budowy, współczynniki U dla ścian, dachu, okien.  
  
**Gdzie ląduje:**  
- W tabeli `building_thermal` – parametry do obliczania strat ciepła.  
  
**Jak działa logika:**  
- Na podstawie różnicy temperatur (wewnątrz/zewnątrz) i U obliczane są straty ciepła (W) dla każdego miesiąca.  
  
**Efekt na ekranie:**  
- Wykres strat ciepła w ciągu roku.  
- *„Twoje straty ciepła przy –20°C wynoszą 8 kW – ogrzewanie potrzebuje 192 kWh/dobę, ale pompa ciepła zmniejszy to do 60 kWh (COP=3).”*

---

### 6.2. Zapotrzebowanie na C.O. i C.W.U.  *(dawne 5.2)*

  
**Skąd czerpie dane:**  
- Z obliczeń strat ciepła (5.1) oraz liczby domowników (1.6).  
  
**Gdzie ląduje:**  
- Osobne tabele: `heating_demand` i `dhw_demand`.  
  
**Jak działa logika:**  
- C.O. – zapotrzebowanie zmienia się z temperaturą zewnętrzną.  
- C.W.U. – zależne od liczby osób (np. 50 l/osobę) i temperatury zimnej wody.  
  
**Efekt na ekranie:**  
- *„C.O. (styczeń): 40 kWh/dobę, C.W.U.: 10 kWh/dobę.”*

---

### 6.3. Rekuperacja (wentylacja z odzyskiem)  *(dawne 5.3)*

  
**Skąd czerpie dane:**  
- Użytkownik wprowadza sprawność rekuperatora (%), strumień powietrza (m³/h) i moc wentylatorów.  
  
**Gdzie ląduje:**  
- W tabeli `ventilation` – zyski ciepła i pobór prądu.  
  
**Jak działa logika:**  
- Oblicza odzyskane ciepło (zmniejsza zapotrzebowanie na ogrzewanie).  
- Dolicza pobór wentylatorów do bilansu elektrycznego (stały, ok. 50–100 W).  
  
**Efekt na ekranie:**  
- *„Rekuperacja o sprawności 80% odzyskuje 2,5 kW ciepła przy –10°C – oszczędność 15 kWh/dobę, ale pobiera 80 W prądu.”*

---

### 6.4. Gruntowy wymiennik ciepła (GWC)  *(dawne 5.4)*

  
**Skąd czerpie dane:**  
- Użytkownik podaje długość rur, głębokość, typ gruntu.  
  
**Gdzie ląduje:**  
- W tabeli `gwc` – zyski/straty ciepła.  
  
**Jak działa logika:**  
- GWC podgrzewa powietrze zimą (o kilka °C) i chłodzi latem.  
- System uwzględnia to w bilansie ogrzewania/chłodzenia.  
  
**Efekt na ekranie:**  
- *„GWC o długości 50 m podnosi temperaturę powietrza o 4°C zimą – zmniejsza zapotrzebowanie na ogrzewanie o 5%.”*

---

### 6.5. Pompa ciepła – COP/SCOP w funkcji temperatury  *(dawne 5.5)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera model pompy (lub wprowadza krzywą COP).  
- System zna temperatury zewnętrzne dla każdego miesiąca.  
  
**Gdzie ląduje:**  
- W tabeli `heat_pump_cop` – rzeczywisty COP dla każdego miesiąca.  
  
**Jak działa logika:**  
- COP maleje z temperaturą. Dla danej temp. system oblicza zużycie prądu: P_elek = P_ciepła / COP.  
- Uwzględnia tryb grzania i chłodzenia.  
  
**Efekt na ekranie:**  
- Wykres COP w ciągu roku.  
- *„W styczniu przy –5°C COP = 2,8 – pompa zużyje 14,3 kWh na 40 kWh ciepła.”*

---

### 6.6. Cykle odszraniania (defrost) – szczegóły  *(dawne 5.6)*

  
Patrz sekcja **1.14** – tam zebrano dane wejściowe i podstawową logikę. W tym miejscu system prezentuje miesięczny raport defrostu w kontekście pompy ciepła.

---

### 6.7. Mostki termiczne – analiza i eliminacja  *(dawne 5.7)*

  
**Skąd czerpie dane:**  
- Z modelu 3D budynku (Rozdział 0) – połączenia ścian, stropów, dachu, okna, drzwi.  
- Z konstrukcji budynku (materiały, warstwy, zbrojenie, nadproża).  
- Z norm budowlanych i współczynników liniowych (Ψ) dla mostków.  
  
**Gdzie ląduje:**  
- W module `thermal_bridges`.  
  
**Jak działa logika:**  
- System identyfikuje wszystkie mostki termiczne, czyli miejsca, przez które ucieka więcej ciepła niż przez zwykłą ścianę (np. narożniki, styk dachu ze ścianą, płyty balkonowe, ościeża okienne).  
- Dla każdego mostka oblicza liniowy współczynnik przenikania ciepła (Ψ) i straty ciepła (W/m).  
- Symuluje wpływ mostków na całkowite straty ciepła w skali roku.  
- Proponuje rozwiązania: dodatkowa izolacja, zmiana konstrukcji, ciepłe parapety, izolacja ościeży.  
  
**Efekt na ekranie:**  
- Mapa 3D z zaznaczonymi mostkami cieplnymi i ich stratami.  
- Komunikat: *„Twoje mostki termiczne to 12% całkowitych strat ciepła. Zastosowanie izolacji ościeży zmniejszy je o 4%.”*  
- Ostrzeżenie: *„Niezaizolowane nadproże nad oknem to stały wyciek ciepła.”*  
  
**Migawka:** *„O co chodzi? To jak dziura w swetrze. Nawet jak reszta jest ciepła, przez dziurę ucieka mnóstwo energii.”*  
  
**Powiązania:** Funkcja 5.1, 5.9, 5.10.

---

### 6.8. Pojemność cieplna budynku (bezwładność)  *(dawne 5.8)*

  
**Skąd czerpie dane:**  
- Z konstrukcji budynku (materiały, grubość warstw) z Rozdziału 0.  
- Z objętości pomieszczeń i rodzaju przegród (beton, cegła, drewno).  
  
**Gdzie ląduje:**  
- W module `thermal_mass`.  
  
**Jak działa logika:**  
- System oblicza całkowitą pojemność cieplną budynku (kWh/K).  
- Uwzględnia, że ciężkie materiały (beton, cegła) akumulują ciepło i oddają je powoli, a lekkie (drewno, gips) szybko się nagrzewają i stygną.  
- Symuluje, jak budynek reaguje na zmiany temperatury zewnętrznej i na pracę ogrzewania.  
- Wskazuje, czy duża bezwładność jest zaletą (ogrzewanie akumulacyjne, mniejsze wahania temperatury), czy wadą (dłuższe nagrzewanie po powrocie do domu).  
  
**Efekt na ekranie:**  
- Wykres temperatury wewnętrznej w czasie przy zmianie ogrzewania.  
- Komunikat: *„Twoja bezwładność cieplna to 18 kWh/K. Budynek wolno się wychładza – po wyłączeniu ogrzewania temperatura spadnie o 1°C w 4 godziny.”*  
- Ostrzeżenie: *„Przy dużej bezwładności ogrzewanie podłogowe sprawdzi się lepiej niż grzejniki.”*  
  
**Migawka:** *„O co chodzi? Ciężki dom to jak piec kaflowy – długo się nagrzewa, ale długo trzyma ciepło.”*  
  
**Powiązania:** Funkcja 5.1, 5.28, 6.11.

---

### 6.9. Analiza strat przez wentylację grawitacyjną  *(dawne 5.9)*

  
**Skąd czerpie dane:**  
- Z parametrów budynku (szczelność, liczba kominów, nieszczelności okien).  
- Z danych klimatycznych (wiatr, temperatura).  
- Z różnicy temperatur wewnątrz/na zewnątrz.  
  
**Gdzie ląduje:**  
- W module `natural_ventilation_losses`.  
  
**Jak działa logika:**  
- System szacuje, ile ciepła ucieka przez wentylację grawitacyjną (kominy, nieszczelności, okna).  
- Uwzględnia, że im większa różnica temperatur i silniejszy wiatr, tym intensywniejsza wymiana powietrza.  
- Oblicza straty ciepła w kWh/dobę i w skali miesiąca.  
- Porównuje z wentylacją mechaniczną z rekuperacją (funkcja 5.3) i pokazuje, ile energii można zaoszczędzić.  
  
**Efekt na ekranie:**  
- Wykres strat ciepła w zależności od temperatury zewnętrznej.  
- Komunikat: *„Twoja wentylacja grawitacyjna generuje 8 wymian powietrza na dobę. To 15% całkowitych strat ciepła. Rekuperacja obniżyłaby to do 5%.”*  
- Ostrzeżenie: *„Zbyt szczelny dom bez wentylacji mechanicznej to ryzyko pleśni.”*  
  
**Migawka:** *„O co chodzi? Ciepłe powietrze ucieka kominem. Trzeba je powstrzymać, ale nie kosztem świeżego powietrza.”*  
  
**Powiązania:** Funkcja 5.3, 5.1, 5.23.

---

### 6.10. Optymalizacja izolacji (grubość, materiał, opłacalność)  *(dawne 5.10)*

  
**Skąd czerpie dane:**  
- Z obecnej lub planowanej izolacji (materiał, grubość).  
- Z cen materiałów izolacyjnych i kosztów robocizny.  
- Z danych klimatycznych (zapotrzebowanie na ciepło).  
  
**Gdzie ląduje:**  
- W module `insulation_optimization`.  
  
**Jak działa logika:**  
- System porównuje różne materiały izolacyjne (wełna, styropian, piana PUR, celuloza) i ich grubości.  
- Oblicza opłacalność każdego wariantu: koszt izolacji vs. oszczędności na ogrzewaniu w ciągu 10 lat.  
- Uwzględnia współczynnik przewodzenia ciepła (λ) i opór cieplny (R).  
- Proponuje optymalny wariant, przy którym koszt 1 zaoszczędzonej kWh jest najniższy.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Wełna 20 cm: koszt 5 000 zł, oszczędność 300 kWh/rok. PUR 15 cm: koszt 6 000 zł, oszczędność 320 kWh/rok.”*  
- Komunikat: *„Najbardziej opłacalna jest wełna 25 cm – koszt 1 kWh zaoszczędzonej energii to 0,20 zł.”*  
- Ostrzeżenie: *„Przy zbyt grubej izolacji koszt dodatkowego centymetra nie zwróci się.”*  
  
**Migawka:** *„O co chodzi? Nie chodzi o to, żeby zaizolować jak najgrubiej, tylko żeby rozsądnie wydać pieniądze.”*  
  
**Powiązania:** Funkcja 5.1, 5.7, 5.11.

---

### 6.11. Okna i drzwi – straty ciepła, współczynnik U, g, zyski słoneczne  *(dawne 5.11)*

  
**Skąd czerpie dane:**  
- Z wymiarów okien i drzwi, orientacji, typu (dwuszybowe, trzyszybowe).  
- Z parametrów U (przenikanie), g (przepuszczalność energii słonecznej), ramy.  
- Z danych o nasłonecznieniu (Rozdział 0).  
  
**Gdzie ląduje:**  
- W module `windows_doors_losses`.  
  
**Jak działa logika:**  
- System oblicza straty ciepła przez okna i drzwi (W/K).  
- Uwzględnia zyski słoneczne, gdy świeci słońce – okna od południa mogą być „darmowym grzejnikiem”.  
- Bilansuje zyski i straty w skali roku.  
- Dobiera najlepsze okna dla danej orientacji (np. dla południa ważny wysoki g, dla północy niski U).  
  
**Efekt na ekranie:**  
- Wykres: straty i zyski przez okna w ciągu roku.  
- Komunikat: *„Okna południowe przynoszą 120 kWh zysków rocznie, ale okna północne tracą 200 kWh. Rozważ wymianę północnych na trzyszybowe.”*  
- Ostrzeżenie: *„Okno o wysokim U i niskim g to dziura w ścianie.”*  
  
**Migawka:** *„O co chodzi? Okno to jedyny element, który może zarówno grzać, jak i chłodzić. Trzeba je dobrać do strony świata.”*  
  
**Powiązania:** Funkcja 5.1, 5.10, 2.2.

---

### 6.12. Infiltracja powietrza (nieszczelności) – test szczelności  *(dawne 5.12)*

  
**Skąd czerpie dane:**  
- Z wyników testu szczelności (blower door test) lub szacunkowych nieszczelności.  
- Z parametrów budynku (rodzaj konstrukcji, połączenia, uszczelki).  
  
**Gdzie ląduje:**  
- W module `air_infiltration`.  
  
**Jak działa logika:**  
- System szacuje ilość powietrza przedostającego się przez nieszczelności (m³/h).  
- Oblicza straty ciepła związane z infiltracją.  
- Wskazuje miejsca, które trzeba uszczelnić (okna, drzwi, przejścia instalacyjne).  
- Zaleca wykonanie testu szczelności, jeśli straty są duże.  
  
**Efekt na ekranie:**  
- Lista potencjalnych nieszczelności.  
- Komunikat: *„Twoja infiltracja to 0,8 wymiany na godzinę. Uszczelnienie okien i drzwi obniży straty o 8%.”*  
- Ostrzeżenie: *„Przy zbyt szczelnym domu konieczna jest wentylacja mechaniczna, inaczej grozi pleśń.”*  
  
**Migawka:** *„O co chodzi? Szpary to darmowa wentylacja, ale zimą płacisz za nią ciepłem.”*  
  
**Powiązania:** Funkcja 5.9, 5.1, 5.23.

---

### 6.13. Dystrybucja ciepła – ogrzewanie podłogowe, grzejniki, dobór  *(dawne 5.13)*

  
**Skąd czerpie dane:**  
- Z modelu budynku (powierzchnie, wysokości, rodzaj pomieszczeń).  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z parametrów grzejników i ogrzewania podłogowego (moc, temperatura zasilania).  
  
**Gdzie ląduje:**  
- W module `heat_distribution`.  
  
**Jak działa logika:**  
- System porównuje ogrzewanie podłogowe i grzejnikowe dla danego budynku.  
- Uwzględnia temperaturę zasilania: podłogowe (30–40°C) jest bardziej efektywne przy pompie ciepła, grzejniki wymagają wyższej temperatury (50–70°C).  
- Dobiera moc i rozmieszczenie grzejników lub pętli podłogowych.  
- Oblicza koszty instalacji i efektywność energetyczną.  
  
**Efekt na ekranie:**  
- Tabela porównawcza ogrzewania podłogowego i grzejników.  
- Komunikat: *„Przy pompie ciepła ogrzewanie podłogowe obniży zużycie prądu o 15% w porównaniu do grzejników.”*  
- Ostrzeżenie: *„Ogrzewanie podłogowe ma dużą bezwładność – nie reaguje szybko na zmiany.”*  
  
**Migawka:** *„O co chodzi? To jak wybór butów – do biegania inne, do wspinaczki inne. Do pompy ciepła podłogówka, do kominka grzejnik.”*  
  
**Powiązania:** Funkcja 5.2, 5.17, 5.27.

---

### 6.14. Bufor ciepła – dobór pojemności  *(dawne 5.14)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło i profilu dobowego (funkcja 1.7).  
- Z typu źródła ciepła (pompa ciepła, kominek, kocioł elektryczny).  
- Z informacji o buforze (pojemność, izolacja).  
  
**Gdzie ląduje:**  
- W module `heat_buffer_sizing`.  
  
**Jak działa logika:**  
- System dobiera pojemność bufora ciepła, aby zoptymalizować pracę źródła ciepła.  
- Uwzględnia, że bufor pozwala:  
  - magazynować ciepło z tańszej energii (PV, kominek) i oddawać je później,  
  - unikać częstych startów i zatrzymań pompy ciepła,  
  - pokrywać chwilowe szczyty zapotrzebowania.  
- Oblicza zalecaną pojemność (np. 50 l na każdy kW mocy pompy).  
  
**Efekt na ekranie:**  
- Wykres temperatury bufora w ciągu doby.  
- Komunikat: *„Dla twojej pompy 8 kW zalecany bufor to 400 l. Z buforem pompa będzie pracować dłużej, ale rzadziej, co wydłuży jej życie.”*  
- Ostrzeżenie: *„Za mały bufor to częste starty pompy i większe zużycie prądu.”*  
  
**Migawka:** *„O co chodzi? Bufor to termos dla ciepła. Gromadzi, gdy jest tanio, oddaje, gdy jest drogo.”*  
  
**Powiązania:** Funkcja 5.28, 5.36, 3.14.

---

### 6.15. Pompy cyrkulacyjne – dobór i zużycie energii  *(dawne 5.15)*

  
**Skąd czerpie dane:**  
- Z projektu instalacji grzewczej (długość rur, liczba obiegów, opory hydrauliczne) z funkcji 5.13 i 5.17.  
- Z parametrów pomp (wydajność, wysokość podnoszenia, pobór mocy) z bazy produktów.  
- Z profilu pracy ogrzewania (godziny pracy, tryb ciągły/sterowany).  
  
**Gdzie ląduje:**  
- W module `circulation_pumps`.  
  
**Jak działa logika:**  
- System dobiera pompy cyrkulacyjne do obiegów grzewczych: pompa główna, pompa obiegowa ogrzewania podłogowego, pompa ładująca bufor, pompa cyrkulacji C.W.U.  
- Oblicza wymaganą wydajność (m³/h) i wysokość podnoszenia (m) na podstawie oporów hydraulicznych instalacji.  
- Uwzględnia energochłonność pomp – nowoczesne pompy elektroniczne pobierają 5–50 W, stare stałoobrotowe nawet 100–150 W.  
- Oblicza zużycie energii przez pompy w skali doby i roku.  
- Zaleca stosowanie pomp z regulacją PWM i trybem nocnym, które znacząco redukują pobór.  
  
**Efekt na ekranie:**  
- Lista pomp z parametrami i poborem mocy.  
- Komunikat: *„Twoja pompa obiegowa 25/60 pracująca 24/7 pobiera 45 W, czyli 1,08 kWh/dobę. Nowoczesna pompa elektroniczna z trybem adaptacyjnym pobierze 8 W i zużyje 0,19 kWh/dobę.”*  
- Ostrzeżenie: *„W off-gridzie pompy to cisi złodzieje energii. Nie lekceważ ich zużycia.”*  
  
**Migawka:** *„O co chodzi? Pompa to serce instalacji, ale jak bije za mocno, to marnuje prąd. Trzeba dobrać taką, która pompuje dokładnie tyle, ile trzeba.”*  
  
**Powiązania:** Funkcja 5.13, 5.17, 5.21, 1.12.

---

### 6.16. Sterowanie strefowe – zawory, siłowniki, termostaty  *(dawne 5.16)*

  
**Skąd czerpie dane:**  
- Z układu pomieszczeń (Rozdział 0) i sposobu użytkowania (funkcja 1.7).  
- Z projektu instalacji grzewczej (obwody, strefy) z funkcji 5.13.  
- Z bazy urządzeń sterujących: zawory termostatyczne, siłowniki, sterowniki strefowe, termostaty pokojowe.  
  
**Gdzie ląduje:**  
- W module `zonal_control`.  
  
**Jak działa logika:**  
- System projektuje podział budynku na strefy grzewcze (np. sypialnie, salon, łazienka) i dobiera do nich zawory i siłowniki.  
- Oblicza, jak sterowanie strefowe wpłynie na zużycie energii – grzanie tylko tam, gdzie potrzeba.  
- Dobiera termostaty pokojowe (przewodowe, bezprzewodowe) i centralny sterownik.  
- Uwzględnia energię zasilania siłowników i sterowników (pobór 1–5 W każdy).  
- Symuluje scenariusz: ogrzewanie tylko łazienki i salonu w dzień, sypialni w nocy, obniżenie temperatury w nieużywanych pokojach.  
  
**Efekt na ekranie:**  
- Schemat stref z zaznaczonymi zaworami i termostatami.  
- Komunikat: *„Sterowanie strefowe obniży zużycie energii o 18% w porównaniu do grzania całego domu jedną temperaturą.”*  
- Ostrzeżenie: *„Zbyt duża liczba siłowników może podnieść zużycie prądu – zbilansuj zyski i koszty.”*  
  
**Migawka:** *„O co chodzi? Po co grzać puste pokoje? Sterowanie strefowe to jak oświetlenie tylko tam, gdzie jesteś.”*  
  
**Powiązania:** Funkcja 5.13, 1.7, 6.33.

---

### 6.17. Ogrzewanie podłogowe – projekt, temperatura zasilania  *(dawne 5.17)*

  
**Skąd czerpie dane:**  
- Z planu pomieszczeń i rodzaju podłogi (płytki, panele, drewno) z Rozdziału 0.  
- Z zapotrzebowania na ciepło (funkcja 5.2) i izolacji podłogi.  
- Z parametrów rur (rozstaw, średnica) i temperatury zasilania.  
  
**Gdzie ląduje:**  
- W module `underfloor_heating`.  
  
**Jak działa logika:**  
- System projektuje ogrzewanie podłogowe: rozstaw pętli (np. 15 cm w salonie, 10 cm w łazience), długość pętli, liczba obiegów.  
- Oblicza wymaganą temperaturę zasilania – im lepsza izolacja, tym niższa (np. 30–35°C).  
- Dobiera rozdzielacze i pompy obiegowe.  
- Uwzględnia bezwładność cieplną ogrzewania podłogowego – reaguje wolniej, ale stabilizuje temperaturę.  
- Porównuje z grzejnikami w kontekście pompy ciepła (niska temperatura zasilania zwiększa COP).  
  
**Efekt na ekranie:**  
- Rysunek rozkładu pętli w pomieszczeniach.  
- Komunikat: *„Przy ogrzewaniu podłogowym i zasilaniu 35°C twoja pompa ciepła osiągnie COP 4,5, zamiast 3,2 przy grzejnikach 55°C. Oszczędzasz 28% energii.”*  
- Ostrzeżenie: *„Ogrzewanie podłogowe w domu o niskiej bezwładności może przegrzewać pomieszczenia.”*  
  
**Migawka:** *„O co chodzi? Podłogówka to jak ciepły dywan. Grzeje równo i pozwala pompie ciepła pracować spokojnie.”*  
  
**Powiązania:** Funkcja 5.13, 5.15, 5.27.

---

### 6.18. Grzejniki niskotemperaturowe – dobór i analiza  *(dawne 5.18)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło w pomieszczeniach (funkcja 5.2).  
- Z wymiarów i typów grzejników (płytowe, członowe, dekoracyjne).  
- Z krzywych mocy grzejników w funkcji temperatury zasilania.  
  
**Gdzie ląduje:**  
- W module `low_temp_radiators`.  
  
**Jak działa logika:**  
- System dobiera grzejniki niskotemperaturowe (np. 45/35/20°C) zamiast standardowych (75/65/20°C).  
- Oblicza, jak duże muszą być grzejniki, aby przy niższej temperaturze zasilania oddać wymaganą moc.  
- Uwzględnia, że przy pompie ciepła niska temperatura zasilania zwiększa COP.  
- Porównuje koszt grzejników niskotemperaturowych z oszczędnościami energii w ciągu 10 lat.  
- Sugeruje, gdzie lepiej sprawdzi się ogrzewanie podłogowe, a gdzie niskotemperaturowe grzejniki (np. w łazienkach, sypialniach).  
  
**Efekt na ekranie:**  
- Tabela: *„Pokój dzienny: standardowy grzejnik 2,5 kW przy 75°C, niskotemperaturowy 4 kW przy 45°C. Wyższy koszt o 200 zł, ale oszczędność 15% energii.”*  
- Komunikat: *„Grzejniki niskotemperaturowe pozwolą obniżyć temperaturę zasilania z 55°C do 40°C, co zwiększy COP pompy ciepła o 12%.”*  
- Ostrzeżenie: *„Nie montuj zwykłych grzejników przy pompie ciepła – będą potrzebować wysokiej temperatury i stracisz efektywność.”*  
  
**Migawka:** *„O co chodzi? Jak chcesz być efektywny, musisz grzać delikatnie. Do tego potrzebne są większe grzejniki.”*  
  
**Powiązania:** Funkcja 5.13, 5.27, 5.10.

---

### 6.19. C.W.U. – zasobniki, straty postojowe, cyrkulacja  *(dawne 5.19)*

  
**Skąd czerpie dane:**  
- Z liczby domowników i profilu zużycia wody (funkcja 1.6).  
- Z parametrów zasobnika C.W.U. (pojemność, izolacja, strata postojowa W/K).  
- Z temperatury zadanej C.W.U. i temperatury zimnej wody.  
  
**Gdzie ląduje:**  
- W module `dhw_storage`.  
  
**Jak działa logika:**  
- System oblicza dobowe zapotrzebowanie na ciepłą wodę użytkową (kWh/dobę).  
- Uwzględnia straty postojowe zasobnika – ciepło uciekające przez izolację.  
- Oblicza, ile energii potrzeba na podgrzanie wody i pokrycie strat.  
- Dobiera odpowiednią pojemność zasobnika (np. 200 l dla 4 osób) i klasę izolacji (erp A/B/C).  
- Symuluje, jak zmniejszenie strat postojowych wpływa na zużycie energii.  
  
**Efekt na ekranie:**  
- Wykres strat postojowych dla różnych zasobników.  
- Komunikat: *„Zasobnik 200 l o izolacji 0,8 W/K traci 1,2 kWh/dobę. Lepszy model 0,5 W/K straci 0,7 kWh/dobę. Oszczędzasz 180 kWh rocznie.”*  
- Ostrzeżenie: *„Stary zasobnik z grubą pianką potrafi tracić 3 kWh/dobę, czyli więcej niż wynosi samo zużycie wody.”*  
  
**Migawka:** *„O co chodzi? Bojler to termos. Dobry termos trzyma ciepło, zły wypuszcza je do garażu.”*  
  
**Powiązania:** Funkcja 5.20, 1.2, 3.14.

---

### 6.20. Straty ciepła w zasobniku C.W.U.  *(dawne 5.20)*

  
**Skąd czerpie dane:**  
- Z parametrów zasobnika (pojemność, powierzchnia, grubość izolacji, współczynnik przenikania).  
- Z temperatury wody w zasobniku i temperatury otoczenia (np. garaż, piwnica).  
- Z norm (EN 12897) i danych producenta.  
  
**Gdzie ląduje:**  
- W module `dhw_heat_loss`.  
  
**Jak działa logika:**  
- System szczegółowo oblicza straty postojowe zasobnika C.W.U.  
- Uwzględnia przewodzenie ciepła przez izolację, mostki termiczne na przyłączach, straty przez dno i pokrywę.  
- Oblicza dobową i roczną stratę energii (kWh).  
- Porównuje z zapotrzebowaniem na C.W.U. i wskazuje, czy zasobnik jest przewymiarowany lub źle zaizolowany.  
  
**Efekt na ekranie:**  
- Tabela strat dla różnych temperatur otoczenia.  
- Komunikat: *„Twój zasobnik traci 1,5 kWh/dobę, co stanowi 40% energii zużywanej na ciepłą wodę. Dodatkowa izolacja 50 mm zwróci się w 2 lata.”*  
- Ostrzeżenie: *„Przechowywanie zasobnika w nieogrzewanym garażu podwaja straty.”*  
  
**Migawka:** *„O co chodzi? Ciepła woda ucieka powoli, ale non stop. Trzeba ją dobrze opakować.”*  
  
**Powiązania:** Funkcja 5.19, 5.21, 1.2.

---

### 6.21. Cyrkulacja C.W.U. – zużycie energii  *(dawne 5.21)*

  
**Skąd czerpie dane:**  
- Z instalacji C.W.U. (długość rur cyrkulacyjnych, izolacja, temperatura zasilania).  
- Z profilu poboru wody (funkcja 1.7) i ustawień pompy cyrkulacyjnej.  
- Z parametrów pompy cyrkulacyjnej (moc, tryb pracy).  
  
**Gdzie ląduje:**  
- W module `dhw_circulation`.  
  
**Jak działa logika:**  
- System analizuje potrzebę cyrkulacji C.W.U. – utrzymania ciepłej wody w rurach, aby uniknąć spuszczania zimnej.  
- Oblicza straty ciepła z rur cyrkulacyjnych i energię zużywaną przez pompę cyrkulacyjną.  
- Porównuje koszty cyrkulacji ciągłej z cyrkulacją czasową (np. tylko rano i wieczorem) i z brakiem cyrkulacji.  
- Dobiera optymalny tryb pracy pompy: wyłączona, włączona na żądanie, czasowa, termostatyczna.  
  
**Efekt na ekranie:**  
- Wykres energii w zależności od trybu pracy cyrkulacji.  
- Komunikat: *„Cyrkulacja ciągła kosztuje Cię 1,2 kWh/dobę. Cyrkulacja na żądanie z przyciskiem tylko 0,3 kWh/dobę. Zainstaluj czujnik przepływu.”*  
- Ostrzeżenie: *„Nieizolowane rury cyrkulacyjne to grzejnik, którego nie chcesz.”*  
  
**Migawka:** *„O co chodzi? Cyrkulacja to luksus – ciepła woda od razu w kranie. Ale kosztuje energię i ciepło.”*  
  
**Powiązania:** Funkcja 5.19, 5.15, 1.7.

---

### 6.22. Dobór grzałek elektrycznych do C.W.U.  *(dawne 5.22)*

  
**Skąd czerpie dane:**  
- Z pojemności zasobnika i zapotrzebowania na C.W.U. (funkcja 5.19).  
- Z dostępnej mocy elektrycznej (Rozdział 1) i możliwości zasilania z PV.  
- Z informacji o taryfie (jeśli jest) i trybie off-grid.  
  
**Gdzie ląduje:**  
- W module `dhw_electric_heaters`.  
  
**Jak działa logika:**  
- System dobiera grzałkę elektryczną do zasobnika C.W.U. (moc, napięcie, sposób montażu).  
- Uwzględnia, czy grzałka ma być głównym źródłem ciepła, czy tylko awaryjnym.  
- Planuje pracę grzałki w godzinach największej produkcji PV (funkcja 1.2, 3.14).  
- Oblicza, ile energii zużyje grzałka i jak wpłynie na bilans off-grid.  
- Porównuje grzanie wody prądem z PV z grzaniem pompą ciepła (jeśli jest).  
  
**Efekt na ekranie:**  
- Tabela: *„Grzałka 2 kW zagrzeje 200 l od 10°C do 50°C w 4,6 h, zużywając 9,2 kWh. Przy produkcji PV 3 kW zajmie to 3 h.”*  
- Komunikat: *„W lecie grzanie C.W.U. z PV jest darmowe. Zimą lepiej dogrzewać pompą ciepła, bo grzałka elektryczna pożera baterię.”*  
- Ostrzeżenie: *„Grzałka 2 kW to duże obciążenie – sprawdź, czy falownik ją udźwignie.”*  
  
**Migawka:** *„O co chodzi? Grzałka to prosty i tani sposób na ciepłą wodę, ale bardzo głodny. Używaj jej mądrze.”*  
  
**Powiązania:** Funkcja 1.2, 3.14, 5.19, 5.27.

---

### 6.23. Wentylacja mechaniczna z odzyskiem – projekt, strumienie  *(dawne 5.23)*

  
**Skąd czerpie dane:**  
- Z modelu budynku (kubatura, liczba pomieszczeń, wilgotność) z Rozdziału 0.  
- Z liczby domowników i profilu użytkowania (funkcja 1.6).  
- Z norm wentylacyjnych (strumienie powietrza dla pomieszczeń).  
- Z parametrów central wentylacyjnych (wydajność, sprawność, pobór mocy).  
  
**Gdzie ląduje:**  
- W module `mhrv_design`.  
  
**Jak działa logika:**  
- System oblicza wymagane strumienie powietrza nawiewnego i wywiewnego dla budynku:  
  - łazienki, kuchnia, WC – wywiew,  
  - sypialnie, salon – nawiew.  
- Dobiera centralę rekuperacyjną o odpowiedniej wydajności (m³/h).  
- Oblicza straty ciepła przez wentylację i odzysk ciepła przy danej sprawności rekuperatora (np. 85%).  
- Uwzględnia pobór prądu przez wentylatory (zwykle 20–80 W przy pracy ciągłej).  
- Projektuje rozprowadzenie kanałów wentylacyjnych.  
  
**Efekt na ekranie:**  
- Schemat rozprowadzenia kanałów.  
- Komunikat: *„Dla domu 120 m² i 4 osób wymagany strumień to 200 m³/h. Centrala 250 m³/h ze sprawnością 85% odzyska 2,1 kW ciepła przy –10°C.”*  
- Ostrzeżenie: *„Zbyt mała centrala będzie głośna i nie dowiezie świeżego powietrza.”*  
  
**Migawka:** *„O co chodzi? Wentylacja to płuca domu. Rekuperacja sprawia, że płuca oddychają, ale nie tracą ciepła.”*  
  
**Powiązania:** Funkcja 5.3, 5.24, 5.9, 5.12.

---

### 6.24. Letni bypass w rekuperacji  *(dawne 5.24)*

  
**Skąd czerpie dane:**  
- Z parametrów centrali rekuperacyjnej (możliwość bypassu, rodzaj wymiennika).  
- Z danych klimatycznych (temperatura nocą i w dzień latem).  
- Z temperatury wewnętrznej budynku.  
  
**Gdzie ląduje:**  
- W module `summer_bypass`.  
  
**Jak działa logika:**  
- System analizuje, czy centrala ma letni bypass (omijanie wymiennika ciepła).  
- Uwzględnia, że latem w nocy powietrze zewnętrzne jest chłodniejsze i można nim przewietrzyć budynek bez podgrzewania w wymienniku.  
- Oblicza, ile energii chłodniczej można zaoszczędzić dzięki bypassowi.  
- Zaleca automatyczne sterowanie bypassem na podstawie temperatury zewnętrznej i wewnętrznej.  
  
**Efekt na ekranie:**  
- Wykres pracy bypassu w lecie.  
- Komunikat: *„Bypass automatyczny w nocy wywietrzy budynek do 19°C bez klimatyzacji. Oszczędzasz 150 kWh energii chłodniczej rocznie.”*  
- Ostrzeżenie: *„Bez bypassu rekuperacja latem podgrzewa świeże powietrze – to działa na Twoją szkodę.”*  
  
**Migawka:** *„O co chodzi? Latem wymiennik ciepła jest zbędny. Trzeba go odłączyć, żeby nie grzać świeżego powietrza.”*  
  
**Powiązania:** Funkcja 5.23, 5.26, 5.29.

---

### 6.25. Ochrona przed przegrzaniem latem (solar shading)  *(dawne 5.25)*

  
**Skąd czerpie dane:**  
- Z orientacji okien i powierzchni przeszkleń (Rozdział 0).  
- Z danych o nasłonecznieniu i kątach padania słońca (Rozdział 0).  
- Z parametrów osłon: rolety, żaluzje, markizy, okapy, drzewa.  
  
**Gdzie ląduje:**  
- W module `solar_shading`.  
  
**Jak działa logika:**  
- System analizuje zyski słoneczne przez okna w miesiącach letnich.  
- Uwzględnia, że słońce latem operuje wysoko, a zimą nisko – dlatego dobór osłon zależy od kąta padania.  
- Dobiera stałe lub ruchome osłony, aby latem ograniczyć przegrzanie, a zimą nie blokować darmowych zysków.  
- Oblicza, ile energii chłodniczej można zaoszczędzić dzięki zacienieniu.  
  
**Efekt na ekranie:**  
- Schemat kątów padania słońca na okna.  
- Komunikat: *„Okna południowe bez osłon przyniosą w lipcu 8 kWh/dobę zysków. Żaluzje zewnętrzne obniżą to do 2 kWh/dobę.”*  
- Ostrzeżenie: *„Stały okap nad oknem chroni latem, ale zimą odbiera cenne ciepło.”*  
  
**Migawka:** *„O co chodzi? Słońce latem to wróg, zimą przyjaciel. Osłona musi to rozróżnić.”*  
  
**Powiązania:** Funkcja 5.11, 5.26, 2.2.

---

### 6.26. Wentylacja naturalna a mechaniczna – porównanie  *(dawne 5.26)*

  
**Skąd czerpie dane:**  
- Z modelu budynku (szczelność, kominy, rozmieszczenie okien).  
- Z danych klimatycznych (wiatr, temperatura).  
- Z parametrów wentylacji mechanicznej (funkcja 5.23).  
  
**Gdzie ląduje:**  
- W module `ventilation_comparison`.  
  
**Jak działa logika:**  
- System porównuje wentylację naturalną (grawitacyjną) z mechaniczną z rekuperacją.  
- Uwzględnia:  
  - straty ciepła przez wentylację,  
  - kontrolę wilgotności,  
  - koszty instalacji i eksploatacji,  
  - zużycie energii elektrycznej przez wentylatory.  
- Oblicza całkowity bilans energetyczny dla obu opcji.  
- Wskazuje, która opcja jest lepsza dla danego budynku i stylu życia.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Wentylacja naturalna: straty 8 kWh/dobę, koszt 0 kWh prądu. Mechaniczna z rekuperacją: straty 3 kWh/dobę, zużycie wentylatorów 0,5 kWh/dobę.”*  
- Komunikat: *„Mechaniczna z odzyskiem oszczędza 4,5 kWh/dobę, czyli 1600 kWh rocznie. Zwraca się po 6 latach.”*  
- Ostrzeżenie: *„Wentylacja naturalna w nowym, szczelnym domu to prosta droga do pleśni.”*  
  
**Migawka:** *„O co chodzi? Oddychać trzeba, ale bez rekuperacji oddychanie zimą słono kosztuje.”*  
  
**Powiązania:** Funkcja 5.23, 5.9, 5.12.

---

### 6.27. Silnik analiz czynników wpływu na pompę ciepła (moduł zbiorczy)

> Scalono 74 dawne funkcje (5.27–5.100). W UI: jedna symulacja z tabelą suwaków/parametrów zamiast 74 osobnych ekranów. Każdy dawny czynnik zachowany poniżej jako pozycja tabeli parametrów.

#### 6.27.1. Pompa ciepła – dobór mocy do budynku  *(dawne 5.27)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło (funkcja 5.2) i strat ciepła budynku (5.1).  
- Z minimalnej temperatury zewnętrznej (Rozdział 0).  
- Z krzywych mocy pomp ciepła w funkcji temperatury (baza producentów).  
  
**Gdzie ląduje:**  
- W module `heat_pump_sizing`.  
  
**Jak działa logika:**  
- System dobiera moc pompy ciepła na podstawie zapotrzebowania przy minimalnej temperaturze zewnętrznej (np. –20°C).  
- Sprawdza, czy pompa utrzyma komfortową temperaturę przy największym mrozie, czy będzie potrzebować dogrzewania (grzałka elektryczna, kominek).  
- Oblicza współczynnik przewymiarowania – zbyt duża pompa cykluje (częste starty/stopnie), zbyt mała nie dogrzeje.  
- Uwzględnia, że przy niskich temperaturach moc pompy spada, a zapotrzebowanie budynku rośnie.  
  
**Efekt na ekranie:**  
- Wykres mocy pompy i zapotrzebowania w funkcji temperatury.  
- Komunikat: *„Twoje zapotrzebowanie przy –20°C to 6 kW. Pompa 5 kW nie wystarczy – potrzebujesz 8 kW lub grzałki awaryjnej 2 kW.”*  
- Ostrzeżenie: *„Pompa przewymiarowana o 40% będzie się załączać 20 razy na dobę – skróci to jej życie.”*  
  
**Migawka:** *„O co chodzi? Pompa to silnik ciepła. Musi być dobrana do potrzeb, nie na oko.”*  
  
**Powiązania:** Funkcja 5.2, 5.13, 6.8, 5.28.

#### 6.27.2. Pompa ciepła – współpraca z buforem  *(dawne 5.28)*

  
**Skąd czerpie dane:**  
- Z dobranej pompy ciepła (funkcja 5.27).  
- Z parametrów bufora ciepła (funkcja 5.14).  
- Z profilu zapotrzebowania na ciepło (funkcja 1.7).  
  
**Gdzie ląduje:**  
- W module `heat_pump_buffer_cooperation`.  
  
**Jak działa logika:**  
- System symuluje współpracę pompy ciepła z buforem ciepła.  
- Uwzględnia, że bufor pozwala:  
  - wydłużyć cykle pracy pompy (mniej startów/stopni),  
  - magazynować ciepło, gdy jest tanie (PV, nocna taryfa),  
  - pokryć szczyty zapotrzebowania bez dogrzewania.  
- Dobiera pojemność bufora i strategię ładowania.  
- Oblicza, jak bufor wpływa na zużycie energii i trwałość pompy.  
  
**Efekt na ekranie:**  
- Wykres pracy pompy z buforem i bez bufora.  
- Komunikat: *„Z buforem 200 l pompa będzie pracować 4 razy na dobę po 40 minut zamiast 20 razy po 5 minut. Oszczędzisz 15% energii.”*  
- Ostrzeżenie: *„Za mały bufor to jak za mały akumulator – ciągłe starty i stopnie.”*  
  
**Migawka:** *„O co chodzi? Bufor to magazyn ciepła. Dzięki niemu pompa pracuje spokojnie, a nie rwie się co chwilę.”*  
  
**Powiązania:** Funkcja 5.14, 5.27, 5.36.

#### 6.27.3. Pompa ciepła – chłodzenie latem  *(dawne 5.29)*

  
**Skąd czerpie dane:**  
- Z modelu budynku (straty ciepła, zyski słoneczne) z Rozdziału 0 i funkcji 5.25.  
- Z parametrów pompy ciepła (tryb chłodzenia, moc chłodnicza).  
- Z danych klimatycznych (temperatura letnia, wilgotność).  
  
**Gdzie ląduje:**  
- W module `heat_pump_cooling`.  
  
**Jak działa logika:**  
- System sprawdza, czy pompa ciepła może pracować w trybie chłodzenia (rewersyjna).  
- Oblicza zapotrzebowanie na chłód latem na podstawie zysków słonecznych, wentylacji i bytowych.  
- Dobiera temperaturę zasilania dla chłodzenia podłogowego (np. 16–18°C) lub klimakonwektorów.  
- Uwzględnia, że chłodzenie podłogowe wymaga, aby temperatura podłogi nie spadła poniżej punktu rosy (kondensacja).  
- Oblicza zużycie energii elektrycznej w trybie chłodzenia (EER).  
  
**Efekt na ekranie:**  
- Wykres: zapotrzebowanie na chłód latem i praca pompy.  
- Komunikat: *„Twoja pompa może chłodzić dom latem, zużywając 4 kWh/dobę. To taniej niż klimatyzator, który zużyje 8 kWh.”*  
- Ostrzeżenie: *„Chłodzenie podłogowe bez czujnika rosy grozi zawilgoceniem posadzki.”*  
  
**Migawka:** *„O co chodzi? Pompa to nie tylko grzejnik, ale też klimatyzator. Warto to wykorzystać.”*  
  
**Powiązania:** Funkcja 5.25, 5.17, 5.31.

#### 6.27.4. Pompa ciepła – praca w układzie grzania wody  *(dawne 5.30)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na C.W.U. (funkcja 5.19).  
- Z parametrów pompy ciepła (tryb C.W.U., temperatura zasilania).  
- Z profilu poboru wody (funkcja 1.7).  
  
**Gdzie ląduje:**  
- W module `heat_pump_dhw`.  
  
**Jak działa logika:**  
- System projektuje podgrzewanie C.W.U. przez pompę ciepła.  
- Uwzględnia, że pompa ciepła może podgrzać wodę do 55–60°C, a wyższa temperatura wymaga grzałki wspomagającej.  
- Oblicza czas podgrzewu zasobnika i zużycie energii (COP przy C.W.U. jest zwykle niższy niż przy ogrzewaniu).  
- Planuje priorytety: najpierw C.W.U., potem ogrzewanie, albo odwrotnie, w zależności od ustawień.  
  
**Efekt na ekranie:**  
- Wykres pracy pompy w trybie C.W.U.  
- Komunikat: *„Twoja pompa podgrzeje 200 l wody do 55°C w 2 godziny, zużywając 1,8 kWh przy COP 3,2.”*  
- Ostrzeżenie: *„Grzanie wody powyżej 60°C pompą jest mało efektywne – użyj grzałki tylko do przegrzewu antybakteryjnego.”*  
  
**Migawka:** *„O co chodzi? Pompa potrafi podgrzać wodę, ale nie lubi robić tego na maksa. Zostaw to grzałce.”*  
  
**Powiązania:** Funkcja 5.19, 5.22, 5.27.

#### 6.27.5. Pompa ciepła – analiza hałasu i wibracji  *(dawne 5.31)*

  
**Skąd czerpie dane:**  
- Z parametrów akustycznych pompy ciepła (poziom mocy akustycznej dB(A), częstotliwość).  
- Z lokalizacji pompy (w budynku, na zewnątrz, przy ścianie, na dachu) z Rozdziału 0.  
- Z odległości od okien, sypialni, sąsiadów.  
- Z lokalnych norm hałasu (np. 40 dB w nocy).  
  
**Gdzie ląduje:**  
- W module `heat_pump_noise`.  
  
**Jak działa logika:**  
- System oblicza rozprzestrzenianie się hałasu od pompy ciepła do punktów odbioru (okna sypialni, taras, granica działki).  
- Uwzględnia:  
  - poziom mocy akustycznej pompy,  
  - tłumienie przez odległość i ekrany,  
  - odbicia od ścian i powierzchni,  
  - pracę nocną (zwykle niższa moc, ale większa wrażliwość).  
- Sprawdza, czy hałas nie przekroczy norm.  
- Dobiera rozwiązania: obudowa akustyczna, wibroizolatory, przeniesienie pompy, ekrany akustyczne.  
  
**Efekt na ekranie:**  
- Mapa hałasu wokół pompy.  
- Alert: *„Poziom hałasu przy sypialni wyniesie 45 dB(A) w nocy. To za dużo! Zastosuj obudowę akustyczną lub przenieś pompę.”*  
- Komunikat: *„Wibroizolatory pod pompą obniżą hałas o 5 dB.”*  
  
**Migawka:** *„O co chodzi? Pompa to maszyna. Jak stoi pod oknem sypialni, to nie da Ci spać.”*  
  
**Powiązania:** Funkcja 4.16, 5.27, 0.4.

#### 6.27.6. Kominek z płaszczem wodnym – integracja  *(dawne 5.32)*

  
**Skąd czerpie dane:**  
- Z parametrów kominka (moc, sprawność, powierzchnia grzewcza, płaszcz wodny).  
- Z instalacji hydraulicznej (bufor, grzejniki, ogrzewanie podłogowe) z funkcji 5.13, 5.14.  
- Z profilu użytkowania (kiedy palimy, ile drewna) z funkcji 6.19.  
  
**Gdzie ląduje:**  
- W module `fireplace_integration`.  
  
**Jak działa logika:**  
- System sprawdza, jak kominek z płaszczem wodnym może wspomóc ogrzewanie off-grid.  
- Uwzględnia, że kominek może podgrzewać bufor, a następnie ciepło jest rozprowadzane po domu.  
- Oblicza, ile ciepła odda kominek do wody, a ile do pomieszczenia.  
- Dobiera wymiennik, zabezpieczenia (np. schładzanie grawitacyjne przy awarii prądu).  
- Ostrzega przed przegrzaniem instalacji przy braku prądu.  
  
**Efekt na ekranie:**  
- Schemat podłączenia kominka do bufora.  
- Komunikat: *„Kominek 10 kW z płaszczem wodnym 70% odda 7 kW do wody, resztę do powietrza. To pokryje 60% twojego zapotrzebowania w mroźny dzień.”*  
- Ostrzeżenie: *„Przy braku prądu pompa cyrkulacyjna nie działa – bez schładzania grawitacyjnego instalacja się przegrzeje.”*  
  
**Migawka:** *„O co chodzi? Kominek z płaszczem to nie tylko ciepło w salonie, ale też woda w kaloryferach.”*  
  
**Powiązania:** Funkcja 6.19, 5.14, 5.15.

#### 6.27.7. Kocioł elektryczny – dobór i sprawność  *(dawne 5.33)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z mocy przyłączeniowej i możliwości systemu off-grid (Rozdział 1, 3).  
- Z taryfy i dostępności energii (PV, agregat, sieć).  
- Z parametrów kotłów elektrycznych (moc, sprawność, modulacja).  
  
**Gdzie ląduje:**  
- W module `electric_boiler`.  
  
**Jak działa logika:**  
- System dobiera kocioł elektryczny jako główne lub awaryjne źródło ciepła.  
- Oblicza zużycie energii i koszty eksploatacji.  
- Porównuje kocioł elektryczny z pompą ciepła – kocioł ma sprawność 99%, ale zużywa 3–4 razy więcej prądu na każdą kWh ciepła.  
- Uwzględnia modulację mocy (im większa, tym mniejsze straty).  
- Zaleca kocioł tylko tam, gdzie pompa ciepła nie może być zastosowana.  
  
**Efekt na ekranie:**  
- Wykres porównawczy: kocioł vs. pompa ciepła.  
- Komunikat: *„Kocioł 8 kW zużyje 40 kWh/dobę przy –20°C, pompa ciepła tylko 12 kWh. Kocioł sprawdzi się tylko jako awaryjne dogrzewanie.”*  
- Ostrzeżenie: *„Kocioł elektryczny w off-gridzie bez dużej baterii to samobójstwo energetyczne.”*  
  
**Migawka:** *„O co chodzi? Kocioł to grzałka XL. Prosty, ale bardzo głodny. Używaj go jak awaryjnego kamizelki, a nie codziennego ubrania.”*  
  
**Powiązania:** Funkcja 5.27, 1.19, 6.4.

#### 6.27.8. Grzejniki podczerwieni (IR) – analiza  *(dawne 5.34)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło (funkcja 5.2) i kubatury pomieszczeń.  
- Z parametrów grzejników IR (moc, długość fali, temperatura pracy).  
- Z profilu użytkowania i montażu (na suficie, na ścianie).  
  
**Gdzie ląduje:**  
- W module `infrared_heaters`.  
  
**Jak działa logika:**  
- System analizuje zastosowanie grzejników podczerwieni jako ogrzewania podstawowego lub uzupełniającego.  
- Uwzględnia, że promienniki IR ogrzewają powierzchnie i ludzi, a nie powietrze, co daje szybsze odczucie ciepła przy niższej temperaturze powietrza.  
- Oblicza zużycie energii i porównuje z ogrzewaniem konwekcyjnym.  
- Wskazuje, gdzie IR ma sens (wysokie pomieszczenia, łazienka, strefowe dogrzewanie), a gdzie nie (słabo izolowane domy, stałe ogrzewanie).  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia paneli IR.  
- Komunikat: *„W łazience panel IR 600 W da natychmiastowe ciepło, zużywając 0,6 kWh na godzinę. Ogrzewanie podłogowe potrzebuje 2 h, aby osiągnąć komfort.”*  
- Ostrzeżenie: *„IR to ogrzewanie punktowe. Nie zastąpi pełnego ogrzewania w mroźną noc.”*  
  
**Migawka:** *„O co chodzi? IR to ciepło jak od słońca – od razu czujesz. Ale nie ogrzeje całego domu.”*  
  
**Powiązania:** Funkcja 5.13, 5.16, 1.7.

#### 6.27.9. Maty kapilarne i grzejniki płaszczyznowe  *(dawne 5.35)*

  
**Skąd czerpie dane:**  
- Z modelu pomieszczeń (powierzchnie ścian, sufitów) z Rozdziału 0.  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z parametrów mat kapilarnych (moc na m², temperatura zasilania).  
  
**Gdzie ląduje:**  
- W module `capillary_mats`.  
  
**Jak działa logika:**  
- System projektuje ogrzewanie płaszczyznowe z mat kapilarnych na ścianach lub suficie.  
- Uwzględnia niską temperaturę zasilania (25–35°C), co idealnie współpracuje z pompą ciepła.  
- Oblicza powierzchnię aktywną i moc grzewczą.  
- Porównuje z ogrzewaniem podłogowym i grzejnikami.  
- Zaleca maty kapilarne w domach o niskiej bezwładności cieplnej, gdzie podłogówka reagowałaby zbyt wolno.  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia mat.  
- Komunikat: *„Maty na suficie o mocy 60 W/m² pokryją 100% zapotrzebowania przy zasilaniu 30°C. Twoja pompa ciepła osiągnie COP 4,8.”*  
- Ostrzeżenie: *„Sufit z matami musi być odpowiednio zaizolowany, inaczej grzejesz strop.”*  
  
**Migawka:** *„O co chodzi? Ciepło z sufitu to jak delikatny deszcz ciepła. Idealne do pompy ciepła.”*  
  
**Powiązania:** Funkcja 5.13, 5.17, 5.27.

#### 6.27.10. Magazynowanie ciepła w materiałach zmiennofazowych (PCM)  *(dawne 5.36)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło i profilu dobowego (funkcje 1.7, 5.2).  
- Z właściwości materiałów zmiennofazowych (temperatura topnienia, ciepło topnienia, gęstość).  
- Z dostępnej przestrzeni na akumulatory PCM.  
  
**Gdzie ląduje:**  
- W module `pcm_thermal_storage`.  
  
**Jak działa logika:**  
- System analizuje możliwość magazynowania ciepła w materiałach zmiennofazowych (PCM).  
- Uwzględnia, że PCM topniejąc, pochłaniają dużo energii, a krzepnąc, oddają ją.  
- Dobiera odpowiedni PCM do danej temperatury (np. 21°C dla stabilizacji temperatury w pomieszczeniu, 50°C dla bufora C.W.U.).  
- Oblicza pojemność cieplną i porównuje z buforem wodnym.  
- Wskazuje, gdzie PCM może zastąpić lub uzupełnić bufor wodny (mniejsza objętość, większa stabilność).  
  
**Efekt na ekranie:**  
- Wykres temperatury w pomieszczeniu z PCM i bez.  
- Komunikat: *„100 l PCM o cieple topnienia 200 kJ/kg zmagazynuje tyle ciepła, co 300 l bufora wodnego. Stabilizuje temperaturę o 3°C.”*  
- Ostrzeżenie: *„PCM jest droższy od wody – stosuj go tam, gdzie brakuje miejsca.”*  
  
**Migawka:** *„O co chodzi? PCM to jak wosk w świecy – pochłania ciepło, gdy się topi, i oddaje, gdy stygnie.”*  
  
**Powiązania:** Funkcja 5.14, 5.28, 5.19.

#### 6.27.11. Sterowanie pogodowe ogrzewaniem  *(dawne 5.37)*

  
**Skąd czerpie dane:**  
- Z danych klimatycznych (temperatura zewnętrzna, prognoza) z Rozdziału 0.  
- Z parametrów instalacji grzewczej (krzywa grzewcza, moc, bezwładność) z funkcji 5.13.  
- Z ustawień komfortu użytkownika.  
  
**Gdzie ląduje:**  
- W module `weather_compensation`.  
  
**Jak działa logika:**  
- System projektuje sterowanie pogodowe, czyli automatyczne dostosowanie temperatury zasilania do temperatury zewnętrznej.  
- Dobiera krzywą grzewczą (np. 30°C zasilania przy 0°C, 40°C przy –10°C).  
- Uwzględnia bezwładność budynku – im większa, tym łagodniej należy zmieniać parametry.  
- Oblicza oszczędności energii w porównaniu ze stałą temperaturą zasilania.  
  
**Efekt na ekranie:**  
- Wykres krzywej grzewczej.  
- Komunikat: *„Sterowanie pogodowe obniży zużycie energii o 12% w porównaniu ze stałą temperaturą zasilania.”*  
- Ostrzeżenie: *„Zła krzywa grzewcza to przegrzewanie lub niedogrzewanie domu.”*  
  
**Migawka:** *„O co chodzi? Sterowanie pogodowe to jak inteligentny termostat – grzeje tyle, ile trzeba, nie więcej.”*  
  
**Powiązania:** Funkcja 5.13, 5.16, 5.28, 6.28.

#### 6.27.12. Optymalizacja temperatury w pomieszczeniach (eco mode)  *(dawne 5.38)*

  
**Skąd czerpie dane:**  
- Z profilu użytkowania (kiedy i gdzie przebywamy) z funkcji 1.7.  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z bezwładności cieplnej budynku (funkcja 5.8).  
  
**Gdzie ląduje:**  
- W module `eco_temperature_mode`.  
  
**Jak działa logika:**  
- System opracowuje harmonogram obniżania temperatury w pomieszczeniach, gdy są nieużywane.  
- Uwzględnia, że obniżanie temperatury o 1°C daje ok. 6–8% oszczędności.  
- Oblicza, ile energii można zaoszczędzić przy obniżeniu nocnym (np. 2°C) i dziennym (gdy dom pusty).  
- Dobiera czasy obniżenia tak, aby uniknąć gwałtownego dogrzewania (duża bezwładność).  
- Symuluje roczne oszczędności.  
  
**Efekt na ekranie:**  
- Harmonogram dobowy temperatury.  
- Komunikat: *„Obniżenie temperatury o 2°C na noc i 3°C na czas nieobecności daje oszczędność 18% energii.”*  
- Ostrzeżenie: *„Zbyt głębokie obniżenie przy dużej bezwładności budynku może zwiększyć zużycie energii przez dogrzewanie.”*  
  
**Migawka:** *„O co chodzi? Po co trzymać 22°C w pustym domu? Eco mode to tryb oszczędzania dla zmarzlucha.”*  
  
**Powiązania:** Funkcja 5.16, 5.8, 6.33.

#### 6.27.13. Analiza kosztów ogrzewania różnymi źródłami  *(dawne 5.39)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z cen paliw i energii: prąd, gaz, drewno, pellet, węgiel.  
- Z parametrów źródeł ciepła (sprawność, COP) z funkcji 5.27–5.34.  
  
**Gdzie ląduje:**  
- W module `heating_cost_comparison`.  
  
**Jak działa logika:**  
- System porównuje koszty ogrzewania różnymi źródłami: pompa ciepła, kocioł elektryczny, kominek, pellet, gaz, węgiel.  
- Uwzględnia koszty inwestycyjne (kocioł, pompa, kominek) i eksploatacyjne (paliwo, serwis).  
- Oblicza koszt 1 kWh ciepła z każdego źródła.  
- Generuje ranking opłacalności w skali 10 lat.  
  
**Efekt na ekranie:**  
- Tabela: *„Pompa ciepła: 0,25 zł/kWh ciepła. Kocioł elektryczny: 0,80 zł/kWh. Kominek drewno: 0,15 zł/kWh (ale praca). Pellet: 0,35 zł/kWh.”*  
- Komunikat: *„Pompa ciepła zwraca się po 5 latach w porównaniu z kotłem elektrycznym.”*  
- Ostrzeżenie: *„Koszt inwestycji to jedno, koszt paliwa to drugie. Sprawdź oba.”*  
  
**Migawka:** *„O co chodzi? Nie daj się zwieść tanim paliwom. Licz koszt całkowity, nie tylko cenę za kg.”*  
  
**Powiązania:** Funkcja 5.27, 5.33, 5.32, 6.14.

#### 6.27.14. Raport efektywności cieplnej budynku  *(dawne 5.40)*

  
**Skąd czerpie dane:**  
- Z wszystkich funkcji Rozdziału 5 (izolacja, mostki, wentylacja, ogrzewanie, C.W.U.).  
- Z danych klimatycznych i zużycia energii (Rozdziały 0, 1, 7).  
  
**Gdzie ląduje:**  
- W module `thermal_efficiency_report`.  
  
**Jak działa logika:**  
- System generuje kompleksowy raport efektywności cieplnej budynku.  
- Zawiera:  
  - całkowite straty ciepła i ich strukturę,  
  - zapotrzebowanie na energię końcową i pierwotną,  
  - efektywność źródeł ciepła,  
  - rekomendacje poprawy (izolacja, okna, wentylacja, pompa ciepła).  
- Wylicza klasę energetyczną budynku (np. A, B, C).  
- Określa potencjał oszczędności w kWh i złotówkach.  
  
**Efekt na ekranie:**  
- Raport PDF lub ekran podsumowujący.  
- Komunikat: *„Twój budynek ma klasę C. Poprawa izolacji i wymiana okien podniosą go do klasy A, oszczędzając 2500 kWh rocznie.”*  
- Ostrzeżenie: *„Bez raportu nie wiesz, gdzie ucieka najwięcej ciepła.”*  
  
**Migawka:** *„O co chodzi? To jak świadectwo energetyczne, ale z konkretnymi zaleceniami.”*  
  
**Powiązania:** Funkcja 5.1, 5.10, 5.39, 6.14.

#### 6.27.15. Pompa ciepła – odzysk ciepła ze ścieków (Drain Water Heat Recovery)  *(dawne 5.41)*

  
**Skąd czerpie dane:**  
- Z profilu zużycia wody i temperatury ścieków (prysznic, wanna, pralka, zmywarka).  
- Z parametrów wymiennika do odzysku ciepła (sprawność, średnica, typ).  
- Z instalacji kanalizacyjnej (pion, dostęp do rur).  
  
**Gdzie ląduje:**  
- W module `drain_water_heat_recovery`.  
  
**Jak działa logika:**  
- System analizuje ciepło odpadowe w ściekach. Ciepła woda z prysznica (ok. 38–40°C) trafia do kanalizacji i mogłaby ogrzać zimną wodę zasilającą bojler lub wspomagać pompę ciepła.  
- Dobiera wymiennik ciepła do pionu kanalizacyjnego (np. PowerPipe) – zimna woda zasilająca przepływa rurką owiniętą wokół rury ściekowej i przejmuje ciepło.  
- Oblicza, ile energii można odzyskać (zwykle 20–40% ciepła ze ścieków).  
- Uwzględnia, że najlepszy efekt jest przy równoczesnym poborze ciepłej wody i zasilaniu zimnej (np. podczas prysznica).  
- Podaje, ile kWh rocznie i ile złotych to oszczędza.  
  
**Efekt na ekranie:**  
- Schemat wymiennika na pionie kanalizacyjnym.  
- Komunikat: *„Odzysk ciepła ze ścieków z prysznica da Ci 0,5 kWh dziennie, czyli 180 kWh rocznie. To 10% zapotrzebowania na C.W.U.”*  
- Ostrzeżenie: *„Odzysk ciepła ma sens tylko przy dużym zużyciu ciepłej wody. Sprawdź, czy Twój prysznic jest głównym odbiorcą.”*  
  
**Migawka:** *„O co chodzi? Zamiast wylewać ciepło do szamba, oddaj je zimnej wodzie. To darmowa energia.”*  
  
**Powiązania:** Funkcja 5.19, 5.22, 6.10.

#### 6.27.16. Pompa ciepła – wymiarowanie kolektora gruntowego (poziomy / pionowy / spiralny)  *(dawne 5.42)*

  
**Skąd czerpie dane:**  
- Z mocy pompy ciepła (funkcja 5.27).  
- Z parametrów gruntu (typ, wilgotność, przewodność cieplna, temperatura) z Rozdziału 0.  
- Z dostępnej powierzchni działki.  
- Z danych o strefie przemarzania i głębokości wód gruntowych.  
  
**Gdzie ląduje:**  
- W module `ground_collector_sizing`.  
  
**Jak działa logika:**  
- System projektuje dolne źródło pompy ciepła. Uwzględnia trzy typy kolektorów:  
  1. **Poziomy:** rury układane na głębokości 1,2–1,8 m, powierzchnia zależna od mocy i gruntu (np. 60–120 m² na każde 10 kW mocy).  
  2. **Pionowy:** odwierty o głębokości 50–100 m, zwykle 1 m odwiertu na 50–70 W mocy.  
  3. **Spiralny / koszowy:** kompaktowe kolektory spiralne, gdy brak miejsca.  
- Oblicza wymaganą długość rur lub liczbę odwiertów.  
- Uwzględnia odległości od budynku, drzew, studni i granic działki.  
- Sprawdza, czy grunt nadaje się do tego typu kolektora (np. suchy piasek wymaga większej powierzchni niż wilgotna glina).  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia kolektora na działce.  
- Komunikat: *„Dla pompy 8 kW w gruncie gliniastym wilgotnym potrzebujesz 400 m² kolektora poziomego (4 pętle po 100 m) lub 1 odwiert 100 m.”*  
- Ostrzeżenie: *„Zbyt płytki kolektor zamarznie i straci wydajność. Zbyt głęboki – koszt odwiertu zabije budżet.”*  
  
**Migawka:** *„O co chodzi? Pompa ciepła pobiera ciepło z gruntu. Trzeba dać jej odpowiedni kolektor, inaczej będzie jak samochód bez paliwa.”*  
  
**Powiązania:** Funkcja 5.27, 5.40, 0.1, 6.35.

#### 6.27.17. Pompa ciepła – współczynnik COP/SCOP w off-gridzie (analiza rzeczywista)  *(dawne 5.43)*

  
**Skąd czerpie dane:**  
- Z krzywej COP pompy ciepła w funkcji temperatury (funkcja 5.5).  
- Z profilu zapotrzebowania na ciepło (funkcja 5.2) i temperatury zasilania (funkcja 5.13).  
- Z danych klimatycznych (temperatura zewnętrzna w sezonie grzewczym).  
- Z charakterystyki systemu off-grid (niestabilne napięcie, ograniczona moc).  
  
**Gdzie ląduje:**  
- W module `heat_pump_real_cop`.  
  
**Jak działa logika:**  
- System oblicza rzeczywisty sezonowy współczynnik efektywności (SCOP), a nie katalogowy COP.  
- Uwzględnia:  
  - spadki COP przy częściowym obciążeniu,  
  - częste starty i stopnie przy przewymiarowaniu,  
  - defrost (odszranianie) – patrz funkcja 6.8,  
  - temperaturę zasilania – im niższa, tym wyższy SCOP,  
  - stabilność napięcia w off-gridzie (wahania napięcia mogą obniżać sprawność).  
- Porównuje SCOP katalogowy z rzeczywistym dla danego budynku.  
- Symuluje, jak różne scenariusze (np. obniżenie temperatury zasilania) wpłyną na zużycie energii.  
  
**Efekt na ekranie:**  
- Wykres: COP katalogowy vs. SCOP rzeczywisty.  
- Komunikat: *„Katalogowy SCOP 4,5, ale przy Twojej instalacji z grzejnikami 55°C realnie wyniesie 3,1. Obniżenie zasilania do 40°C podniesie go do 3,8.”*  
- Ostrzeżenie: *„W off-gridzie każdy start pompy to chwilowy skok prądu. Zbyt częste starty obciążają baterię i falownik.”*  
  
**Migawka:** *„O co chodzi? Katalog to marketing. Rzeczywistość to Twoja instalacja i Twoja pogoda.”*  
  
**Powiązania:** Funkcja 5.5, 5.13, 6.8, 6.14.

#### 6.27.18. Pompa ciepła – tryb cichy nocny i ograniczenie mocy w off-gridzie  *(dawne 5.44)*

  
**Skąd czerpie dane:**  
- Z ustawień pompy ciepła (tryb cichy, ograniczenie prądu, nocny tryb).  
- Z parametrów falownika i baterii (maksymalny prąd rozruchowy, moc).  
- Z profilu taryfowego i produkcji PV.  
  
**Gdzie ląduje:**  
- W module `heat_pump_offgrid_modes`.  
  
**Jak działa logika:**  
- System projektuje strategię pracy pompy ciepła w nocy, gdy energia pochodzi z baterii.  
- Uwzględnia:  
  - ograniczenie mocy pompy, aby nie przeciążać falownika,  
  - tryb cichy, który obniża moc i hałas, ale wydłuża czas pracy,  
  - pracę tylko w dzień, gdy jest produkcja PV.  
- Oblicza, jak tryb nocny wpłynie na zużycie energii i komfort.  
  
**Efekt na ekranie:**  
- Harmonogram pracy pompy w trybie nocnym.  
- Komunikat: *„Tryb cichy obniży moc pompy z 5 kW do 3 kW. Będzie pracować dłużej, ale uniknie przeciążenia falownika przy starcie.”*  
- Ostrzeżenie: *„Praca pompy nocą z baterii może rozładować magazyn szybciej, niż myślisz.”*  
  
**Migawka:** *„O co chodzi? Pompa też musi umieć chodzić na palcach. W off-gridzie noc to czas delikatnej pracy.”*  
  
**Powiązania:** Funkcja 5.27, 5.31, 6.33, 6.39.

#### 6.27.19. Pompa ciepła – priorytety w systemie off-grid (ciepło vs. prąd)  *(dawne 5.45)*

  
**Skąd czerpie dane:**  
- Z profilu zapotrzebowania na ciepło i prąd (funkcje 1.1, 5.2).  
- Z produkcji PV i stanu baterii (Rozdziały 2, 3).  
- Z ustawień priorytetów (funkcja 1.20).  
  
**Gdzie ląduje:**  
- W module `heat_pump_priority`.  
  
**Jak działa logika:**  
- System ustala, kiedy pompa ciepła ma pierwszeństwo przed innymi odbiornikami.  
- Uwzględnia, że ciepło jest często ważniejsze niż prąd do urządzeń.  
- Planuje pracę pompy na godziny największej produkcji PV, aby ładować bufor ciepła.  
- Symuluje, jak decyzje priorytetowe wpłyną na bilans energetyczny.  
  
**Efekt na ekranie:**  
- Diagram priorytetów.  
- Komunikat: *„Pompa ciepła ma priorytet 1, gdy temperatura wewnętrzna spada poniżej 18°C. Powyżej 21°C może być wyłączana na rzecz pralki.”*  
- Ostrzeżenie: *„Zbyt niski priorytet pompy może doprowadzić do wychłodzenia domu.”*  
  
**Migawka:** *„O co chodzi? Ciepło to podstawa. Ale nie możesz zaniedbać wody i światła.”*  
  
**Powiązania:** Funkcja 1.20, 6.6, 6.28, 6.39.

#### 6.27.20. Pompa ciepła – analiza ryzyka zamarznięcia dolnego źródła  *(dawne 5.46)*

  
**Skąd czerpie dane:**  
- Z parametrów kolektora gruntowego (funkcja 5.42).  
- Z danych o temperaturze gruntu i strefie przemarzania (Rozdział 0).  
- Z temperatury roboczej dolnego źródła (glikol, solanka).  
  
**Gdzie ląduje:**  
- W module `ground_source_freeze_risk`.  
  
**Jak działa logika:**  
- System sprawdza, czy dolne źródło pompy ciepła nie zamarznie.  
- Uwzględnia:  
  - temperaturę gruntu w najzimniejszym miesiącu,  
  - głębokość ułożenia kolektora,  
  - stężenie glikolu lub solanki,  
  - czas pracy pompy (im dłużej pracuje, tym bardziej schładza grunt).  
- Oblicza temperaturę czynnika roboczego w najgorszym scenariuszu.  
- Ostrzega, gdy temperatura zbliża się do punktu zamarzania.  
  
**Efekt na ekranie:**  
- Wykres temperatury dolnego źródła w ciągu sezonu.  
- Alert: *„Przy –20°C i ciągłej pracy pompy temperatura solanki spadnie do –3°C. Zastosuj wyższe stężenie glikolu (30%) lub większy kolektor.”*  
- Ostrzeżenie: *„Zamarznięcie dolnego źródła to koniec pracy pompy i ryzyko uszkodzenia.”*  
  
**Migawka:** *„O co chodzi? Grunt to bateria ciepła. Jak za mocno z niej czerpiesz, to zamarza.”*  
  
**Powiązania:** Funkcja 5.42, 5.5, 6.35.

#### 6.27.21. Pompa ciepła – chłodzenie z dolnego źródła (free cooling)  *(dawne 5.47)*

  
**Skąd czerpie dane:**  
- Z parametrów kolektora gruntowego (funkcja 5.42).  
- Z zapotrzebowania na chłód latem (funkcja 5.29).  
- Z temperatury gruntu i powietrza.  
  
**Gdzie ląduje:**  
- W module `free_cooling`.  
  
**Jak działa logika:**  
- System analizuje, czy dolne źródło może chłodzić dom bez uruchamiania sprężarki pompy (free cooling).  
- Uwzględnia, że grunt latem ma temperaturę 8–12°C, co pozwala na pasywne chłodzenie.  
- Oblicza, ile energii chłodniczej można uzyskać bez sprężarki i ile to oszczędza.  
- Dobiera wymiennik i strategię pracy.  
  
**Efekt na ekranie:**  
- Wykres temperatury w domu z free coolingiem i bez.  
- Komunikat: *„Free cooling obniży temperaturę w domu o 2°C, zużywając tylko 0,2 kWh/dobę na pompę cyrkulacyjną. Sprężarka zużyłaby 2 kWh.”*  
- Ostrzeżenie: *„Free cooling wymaga niskotemperaturowego systemu dystrybucji (podłogówka, maty kapilarne).”*  
  
**Migawka:** *„O co chodzi? Grunt to naturalna klima. Wystarczy, że popłynie z niego chłód.”*  
  
**Powiązania:** Funkcja 5.42, 5.29, 5.17.

#### 6.27.22. Pompa ciepła – tryb ogrzewania basenu  *(dawne 5.48)*

  
**Skąd czerpie dane:**  
- Z parametrów basenu (powierzchnia, pojemność, przykrycie) z Rozdziału 0.  
- Z danych klimatycznych (temperatura wody, nasłonecznienie).  
- Z parametrów pompy ciepła (moc, tryb basenowy).  
  
**Gdzie ląduje:**  
- W module `heat_pump_pool`.  
  
**Jak działa logika:**  
- System dobiera pompę ciepła do ogrzewania basenu.  
- Uwzględnia straty ciepła przez parowanie i powierzchnię.  
- Oblicza czas podgrzewu i zużycie energii.  
- Porównuje z kolektorami słonecznymi i grzałką elektryczną.  
  
**Efekt na ekranie:**  
- Wykres temperatury wody.  
- Komunikat: *„Pompa 8 kW podniesie temperaturę basenu 40 m³ o 1°C w 5 godzin, zużywając 10 kWh.”*  
- Ostrzeżenie: *„Basen bez przykrycia traci 3°C na noc. To jak grzanie ulicy.”*  
  
**Migawka:** *„O co chodzi? Basen to wielki kaloryfer. Bez przykrycia marnujesz energię.”*  
  
**Powiązania:** Funkcja 5.27, 5.29, 5.39.

#### 6.27.23. Pompa ciepła – analiza pracy w trybie grzania i chłodzenia jednoczesnego  *(dawne 5.49)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło i chłód w różnych strefach (funkcje 5.2, 5.29).  
- Z parametrów pompy ciepła (tryb czterorurowy, odzysk ciepła).  
  
**Gdzie ląduje:**  
- W module `simultaneous_heating_cooling`.  
  
**Jak działa logika:**  
- System analizuje, czy pompa może jednocześnie grzać i chłodzić (np. chłodzić serwerownię i grzać wodę).  
- Uwzględnia, że część ciepła odpadowego może być wykorzystana.  
- Oblicza oszczędności energii w porównaniu z osobnymi systemami.  
  
**Efekt na ekranie:**  
- Schemat przepływów ciepła.  
- Komunikat: *„Twoja pompa może jednocześnie chłodzić piwnicę i grzać C.W.U. To 15% oszczędności energii.”*  
- Ostrzeżenie: *„Tryb jednoczesny wymaga zaawansowanego sterowania i większych kosztów instalacji.”*  
  
**Migawka:** *„O co chodzi? Jedno urządzenie, dwa zadania. Tak się oszczędza.”*  
  
**Powiązania:** Funkcja 5.29, 5.30, 5.27.

#### 6.27.24. Pompa ciepła – serwis i diagnostyka w off-gridzie  *(dawne 5.50)*

  
**Skąd czerpie dane:**  
- Z harmonogramu serwisowego producenta.  
- Z historii pracy pompy (liczba godzin, starty, temperatury) z funkcji 3.26.  
- Z parametrów pracy (ciśnienia, temperatury, pobór prądu).  
  
**Gdzie ląduje:**  
- W module `heat_pump_offgrid_service`.  
  
**Jak działa logika:**  
- System monitoruje pracę pompy i przypomina o serwisie.  
- Wykrywa anomalie: spadek COP, wzrost poboru prądu, niskie ciśnienie czynnika.  
- Generuje raport diagnostyczny z zaleceniami.  
- Uwzględnia specyfikę off-gridu – brak prądu na serwis, trudny dojazd.  
  
**Efekt na ekranie:**  
- Alert: *„Pompa pracuje już 3000 h. Wymagany przegląd czynnika chłodniczego.”*  
- Komunikat: *„Wykryto spadek COP o 8% – możliwy wyciek czynnika. Sprawdź instalację.”*  
  
**Migawka:** *„O co chodzi? Pompa to maszyna. Bez serwisu umiera powoli.”*  
  
**Powiązania:** Funkcja 5.27, 3.26, 5.43.

#### 6.27.25. Pompa ciepła – porównanie z klimatyzatorem (chłodzenie i grzanie)  *(dawne 5.51)*

  
**Skąd czerpie dane:**  
- Z parametrów pompy ciepła i klimatyzatora.  
- Z zapotrzebowania na ciepło i chłód (funkcje 5.2, 5.29).  
- Z cen urządzeń i energii.  
  
**Gdzie ląduje:**  
- W module `heat_pump_vs_ac`.  
  
**Jak działa logika:**  
- System porównuje pompę ciepła z klimatyzatorem w trybie grzania i chłodzenia.  
- Uwzględnia, że pompa ciepła jest droższa, ale grzeje efektywniej.  
- Klimatyzator sprawdza się głównie do chłodzenia.  
- Oblicza koszty i oszczędności w skali roku.  
  
**Efekt na ekranie:**  
- Tabela porównawcza.  
- Komunikat: *„Pompa ciepła 8 kW z COP 4,5 jest 40% tańsza w grzaniu niż klimatyzator z COP 3,0. Klimatyzator kup, jeśli chłodzenie jest ważniejsze niż grzanie.”*  
- Ostrzeżenie: *„Klimatyzator do grzania w zimie to pomysł, który słono kosztuje.”*  
  
**Migawka:** *„O co chodzi? Klima i pompa to kuzyni, ale pompa lepiej radzi sobie zimą.”*  
  
**Powiązania:** Funkcja 5.27, 5.29, 5.39.

#### 6.27.26. Pompa ciepła – praca w trybie off-grid z ograniczoną mocą  *(dawne 5.52)*

  
**Skąd czerpie dane:**  
- Z mocy dostępnej w systemie off-grid (falownik, bateria) z Rozdziału 3.  
- Z mocy pompy ciepła i jej prądu rozruchowego.  
- Z profilu produkcji PV.  
  
**Gdzie ląduje:**  
- W module `heat_pump_limited_power`.  
  
**Jak działa logika:**  
- System sprawdza, czy pompa ciepła może pracować z ograniczoną mocą w systemie off-grid.  
- Uwzględnia, że start pompy powoduje skok prądu (LRA), który może przeciążyć falownik.  
- Dobiera softstart lub ograniczenie prądu.  
- Planuje pracę pompy na godziny, gdy dostępna moc PV jest wysoka.  
  
**Efekt na ekranie:**  
- Wykres mocy pompy i dostępnej mocy PV.  
- Alert: *„Przy starcie pompy prąd skoczy do 40 A. Twój falownik 5 kW nie udźwignie. Zastosuj softstart.”*  
- Komunikat: *„Pracuj pompą tylko między 10:00 a 15:00, gdy PV daje nadwyżkę.”*  
  
**Migawka:** *„O co chodzi? Pompa to duży odbiornik. Trzeba ją wpiąć tak, żeby nie wywróciła całego systemu.”*  
  
**Powiązania:** Funkcja 5.27, 3.13, 6.22.

#### 6.27.27. Pompa ciepła – analiza przegrzania latem i chłodzenia nocą  *(dawne 5.53)*

  
**Skąd czerpie dane:**  
- Z danych klimatycznych (temperatura dzienna i nocna latem) z Rozdziału 0.  
- Z modelu budynku (zyski słoneczne, bezwładność) z funkcji 5.8, 5.25.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `summer_overheating`.  
  
**Jak działa logika:**  
- System analizuje ryzyko przegrzania budynku latem.  
- Uwzględnia, że budynki z dużą bezwładnością cieplną wolniej się nagrzewają, ale też trudniej oddają ciepło.  
- Oblicza, ile ciepła trzeba usunąć nocą, aby utrzymać komfortową temperaturę w dzień.  
- Dobiera strategię chłodzenia nocą (wentylacja, free cooling, pompa ciepła).  
  
**Efekt na ekranie:**  
- Wykres temperatury wewnętrznej latem.  
- Komunikat: *„Twoje okna południowe generują 8 kWh/dobę zysków. Chłodzenie nocą obniży temperaturę o 2°C, zużywając tylko 1 kWh.”*  
- Ostrzeżenie: *„Bez nocnego chłodzenia temperatura w sypialniach przekroczy 26°C.”*  
  
**Migawka:** *„O co chodzi? Latem dom może zamienić się w piekarnik. Trzeba go schłodzić nocą, zanim słońce znowu zaświeci.”*  
  
**Powiązania:** Funkcja 5.25, 5.24, 5.29.

#### 6.27.28. Pompa ciepła – integracja z gruntowym wymiennikiem ciepła (GWC)  *(dawne 5.54)*

  
**Skąd czerpie dane:**  
- Z parametrów GWC (długość, głębokość, przepływ) z funkcji 5.4.  
- Z parametrów pompy ciepła (dolne źródło, moc).  
- Z danych o gruncie i klimacie.  
  
**Gdzie ląduje:**  
- W module `heat_pump_gwc_integration`.  
  
**Jak działa logika:**  
- System sprawdza, czy GWC może wspomagać pompę ciepła jako wstępne źródło ciepła.  
- Uwzględnia, że GWC podgrzewa powietrze lub wodę o kilka stopni, co zwiększa COP pompy.  
- Oblicza oszczędności energii i dobiera połączenie hydrauliczne.  
  
**Efekt na ekranie:**  
- Schemat integracji GWC z pompą.  
- Komunikat: *„GWC podniesie temperaturę dolnego źródła o 3°C, co zwiększy COP pompy o 6%.”*  
- Ostrzeżenie: *„GWC to nie jest pełne dolne źródło – tylko wsparcie.”*  
  
**Migawka:** *„O co chodzi? GWC to przedsionek ciepła. Pompa dostaje cieplejsze powietrze i mniej pracuje.”*  
  
**Powiązania:** Funkcja 5.4, 5.42, 5.27.

#### 6.27.29. Pompa ciepła – analiza pracy przy wysokiej wilgotności powietrza  *(dawne 5.55)*

  
**Skąd czerpie dane:**  
- Z danych klimatycznych (wilgotność, temperatura) z Rozdziału 0.  
- Z parametrów pompy ciepła (tryb osuszania).  
- Z modelu budynku (wentylacja, wilgotność wewnętrzna).  
  
**Gdzie ląduje:**  
- W module `heat_pump_humidity`.  
  
**Jak działa logika:**  
- System analizuje wpływ wilgotności na pracę pompy ciepła.  
- Uwzględnia, że wysoka wilgotność zwiększa ryzyko defrostu i obniża COP.  
- W trybie chłodzenia pompa może osuszać powietrze, co poprawia komfort.  
- Oblicza, ile energii potrzeba na osuszanie.  
  
**Efekt na ekranie:**  
- Wykres wilgotności i COP.  
- Komunikat: *„Przy wilgotności 85% i temperaturze 2°C defrost będzie włączał się co 40 minut, obniżając COP o 10%.”*  
- Ostrzeżenie: *„Bez osuszania latem poczujesz się jak w saunie.”*  
  
**Migawka:** *„O co chodzi? Wilgoć to wróg pompy. Zimą zamarza, latem dusi.”*  
  
**Powiązania:** Funkcja 5.5, 6.8, 5.29.

#### 6.27.30. Pompa ciepła – strategia defrostu (odszranianie) w zależności od pogody  *(dawne 5.56)*

  
**Skąd czerpie dane:**  
- Z prognozy pogody (temperatura, wilgotność, opady) z Rozdziału 0.  
- Z parametrów pompy ciepła i ustawień defrostu.  
- Z historii pracy pompy (cykle defrostu).  
  
**Gdzie ląduje:**  
- W module `defrost_strategy`.  
  
**Jak działa logika:**  
- System dobiera strategię defrostu na podstawie warunków pogodowych.  
- Uwzględnia, że przy lekkim mrozie i dużej wilgotności defrost jest częstszy.  
- Planuje przerwy na odszranianie tak, aby nie zakłócały komfortu.  
- Oblicza zużycie energii na defrost w różnych scenariuszach.  
  
**Efekt na ekranie:**  
- Harmonogram cykli defrostu.  
- Komunikat: *„Przy mgle i –2°C defrost będzie włączany co 35 minut na 4 minuty, zużywając 0,3 kWh/dobę.”*  
- Ostrzeżenie: *„Złe ustawienia defrostu mogą pochłonąć 10% energii pompy.”*  
  
**Migawka:** *„O co chodzi? Defrost to konieczne zło. Trzeba nim zarządzać, żeby nie zjadł zbyt dużo.”*  
  
**Powiązania:** Funkcja 5.5, 6.8, 5.23.

#### 6.27.31. Pompa ciepła – porównanie grzania podłogowego i grzejnikowego dla SCOP  *(dawne 5.57)*

  
**Skąd czerpie dane:**  
- Z projektu dystrybucji ciepła (ogrzewanie podłogowe vs. grzejniki) z funkcji 5.13, 5.17, 5.18.  
- Z krzywej COP pompy ciepła (funkcja 5.5).  
- Z temperatur zasilania dla obu systemów.  
  
**Gdzie ląduje:**  
- W module `heat_distribution_scop`.  
  
**Jak działa logika:**  
- System porównuje sezonową efektywność pompy ciepła dla ogrzewania podłogowego i grzejnikowego.  
- Uwzględnia, że podłogówka wymaga zasilania 30–35°C, a grzejniki 50–55°C.  
- Oblicza SCOP dla każdej opcji i roczne zużycie energii.  
- Wskazuje, ile można zaoszczędzić, wybierając niskotemperaturową dystrybucję.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Podłogówka: SCOP 4,2, zużycie 2500 kWh. Grzejniki: SCOP 3,0, zużycie 3500 kWh. Oszczędzasz 1000 kWh rocznie.”*  
- Komunikat: *„Im niższa temperatura zasilania, tym pompa pracuje taniej. To najważniejsza zasada.”*  
- Ostrzeżenie: *„Jeśli masz grzejniki, nie podnoś temperatury zasilania – lepiej dołóż grzejniki.”*  
  
**Migawka:** *„O co chodzi? Pompa to mistrz niskich temperatur. Daj jej niską temperaturę, a odwdzięczy się niskim rachunkiem.”*  
  
**Powiązania:** Funkcja 5.13, 5.17, 5.18, 5.27.

#### 6.27.32. Pompa ciepła – analiza zysków z ogrzewania ciepłej wody przy nadwyżkach PV  *(dawne 5.58)*

  
**Skąd czerpie dane:**  
- Z produkcji PV i nadwyżek energii (Rozdział 2, funkcja 3.14).  
- Z zapotrzebowania na C.W.U. (funkcja 5.19).  
- Z parametrów pompy ciepła i grzałki elektrycznej.  
  
**Gdzie ląduje:**  
- W module `dhw_pv_surplus`.  
  
**Jak działa logika:**  
- System planuje podgrzewanie C.W.U. w godzinach największych nadwyżek PV.  
- Porównuje grzanie pompą ciepła (COP 3–4) z grzałką elektryczną (COP 1).  
- Uwzględnia, że pompa ciepła zużywa mniej energii, ale grzałka jest tańsza i prostsza.  
- Oblicza, ile energii można zagospodarować z nadwyżek PV.  
  
**Efekt na ekranie:**  
- Wykres produkcji PV i zużycia na C.W.U.  
- Komunikat: *„Latem nadwyżki PV pozwolą podgrzać 200 l wody pompą ciepła w 1,5 h, zużywając 1,8 kWh. Grzałka zużyłaby 5,5 kWh.”*  
- Ostrzeżenie: *„Bez nadwyżek PV podgrzewanie C.W.U. pompą w nocy obciąży baterię.”*  
  
**Migawka:** *„O co chodzi? Słońce daje prąd za darmo. Wykorzystaj go, zanim trafi do baterii lub wróci do nieba.”*  
  
**Powiązania:** Funkcja 5.19, 5.22, 3.14, 6.22.

#### 6.27.33. Pompa ciepła – praca w trybie off-grid z wykorzystaniem taryfy nocnej  *(dawne 5.59)*

  
**Skąd czerpie dane:**  
- Z informacji o taryfie (jeśli jest sieć) lub o dostępności energii nocnej (agregat).  
- Z parametrów pompy ciepła i bufora.  
- Z profilu zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `heat_pump_night_tariff`.  
  
**Jak działa logika:**  
- System planuje pracę pompy ciepła w nocy, gdy energia jest tańsza lub dostępna z agregatu.  
- Uwzględnia, że nocą pompa może ogrzać bufor, a w dzień ciepło jest oddawane.  
- Oblicza oszczędności z taryfy nocnej.  
  
**Efekt na ekranie:**  
- Harmonogram pracy nocnej.  
- Komunikat: *„Praca pompy w taryfie nocnej obniży koszt ogrzewania o 30%.”*  
- Ostrzeżenie: *„Nocna praca pompy z baterii off-grid to nie to samo, co z sieci – licz się z rozładowaniem.”*  
  
**Migawka:** *„O co chodzi? W nocy prąd bywa tańszy. Pompa może wtedy napełnić bufor.”*  
  
**Powiązania:** Funkcja 5.14, 5.28, 6.39.

#### 6.27.34. Pompa ciepła – ocena ryzyka hałasu sąsiedzkiego  *(dawne 5.60)*

  
**Skąd czerpie dane:**  
- Z lokalizacji pompy (odległość od granic działki, okien sąsiadów).  
- Z poziomu mocy akustycznej pompy.  
- Z norm hałasu dla terenów zabudowy.  
  
**Gdzie ląduje:**  
- W module `heat_pump_neighbour_noise`.  
  
**Jak działa logika:**  
- System sprawdza, czy hałas pompy nie przekroczy dopuszczalnych norm dla sąsiadów.  
- Uwzględnia, że hałas odbija się od ścian i może być odczuwalny na granicy działki.  
- Dobiera lokalizację pompy i ewentualne osłony.  
  
**Efekt na ekranie:**  
- Mapa hałasu wokół pompy.  
- Alert: *„Hałas na granicy działki wyniesie 45 dB, a norma nocą to 40 dB. Przenieś pompę lub zastosuj obudowę.”*  
- Komunikat: *„Obudowa akustyczna obniży hałas o 8 dB.”*  
  
**Migawka:** *„O co chodzi? Sąsiedzi też mają uszy. Nie chcesz wojny o hałas.”*  
  
**Powiązania:** Funkcja 5.31, 5.27, 0.4.

#### 6.27.35. Pompa ciepła – dobór urządzenia do pracy z falownikiem hybrydowym  *(dawne 5.61)*

  
**Skąd czerpie dane:**  
- Z parametrów falownika hybrydowego (moc, napięcie, funkcje).  
- Z parametrów pompy ciepła (pobór mocy, prąd rozruchowy).  
- Z konfiguracji systemu off-grid (bateria, PV).  
  
**Gdzie ląduje:**  
- W module `heat_pump_hybrid_inverter`.  
  
**Jak działa logika:**  
- System sprawdza, czy pompa ciepła jest kompatybilna z falownikiem hybrydowym.  
- Uwzględnia, że falownik musi udźwignąć prąd rozruchowy pompy.  
- Dobiera softstart, jeśli potrzebny.  
- Planuje pracę pompy w godzinach produkcji PV.  
  
**Efekt na ekranie:**  
- Schemat połączeń.  
- Komunikat: *„Twój falownik hybrydowy 5 kW nie udźwignie startu pompy 8 kW. Zastosuj softstart lub wymień falownik.”*  
- Ostrzeżenie: *„Pompa ciepła bez softstartu to jak młot na falownik.”*  
  
**Migawka:** *„O co chodzi? Falownik to serce off-gridu. Pompa musi się z nim dogadać.”*  
  
**Powiązania:** Funkcja 5.27, 4.3, 3.13.

#### 6.27.36. Pompa ciepła – integracja z systemem fotowoltaicznym (PV-ready)  *(dawne 5.62)*

  
**Skąd czerpie dane:**  
- Z produkcji PV (Rozdział 2) i profilu zużycia (Rozdział 1).  
- Z parametrów pompy ciepła.  
- Z ustawień priorytetów.  
  
**Gdzie ląduje:**  
- W module `heat_pump_pv_integration`.  
  
**Jak działa logika:**  
- System projektuje integrację pompy ciepła z PV, aby wykorzystać jak najwięcej darmowej energii.  
- Uwzględnia, że pompa powinna pracować, gdy PV produkuje najwięcej.  
- Planuje ładowanie bufora w dzień i oddawanie ciepła wieczorem.  
  
**Efekt na ekranie:**  
- Wykres produkcji PV i pracy pompy.  
- Komunikat: *„Integracja z PV pozwoli wykorzystać 80% nadwyżek energii latem.”*  
- Ostrzeżenie: *„Bez bufora ciepła integracja z PV jest niepełna.”*  
  
**Migawka:** *„O co chodzi? PV i pompa to idealna para – jedno produkuje prąd, drugie zamienia go na ciepło.”*  
  
**Powiązania:** Funkcja 5.14, 5.28, 2.2.

#### 6.27.37. Pompa ciepła – analiza ryzyka wyłączenia przy niskim napięciu  *(dawne 5.63)*

  
**Skąd czerpie dane:**  
- Z parametrów napięciowych pompy ciepła.  
- Z danych o napięciu w systemie off-grid (falownik, bateria).  
- Z historii napięć (jeśli dostępna).  
  
**Gdzie ląduje:**  
- W module `heat_pump_undervoltage`.  
  
**Jak działa logika:**  
- System sprawdza, czy napięcie w systemie off-grid jest stabilne dla pompy ciepła.  
- Uwzględnia, że przy niskim stanie baterii napięcie może spaść poniżej wymaganego przez pompę.  
- Oblicza ryzyko wyłączenia pompy i konsekwencje dla ogrzewania.  
  
**Efekt na ekranie:**  
- Wykres napięcia i pracy pompy.  
- Alert: *„Przy rozładowaniu baterii do 20% napięcie spadnie do 44 V i pompa się wyłączy. Zastosuj stabilizator lub większą baterię.”*  
- Ostrzeżenie: *„Niskie napięcie to cichy zabójca pomp.”*  
  
**Migawka:** *„O co chodzi? Pompa potrzebuje dobrego napięcia. Jak bateria siada, pompa też padnie.”*  
  
**Powiązania:** Funkcja 5.27, 3.17, 4.3.

#### 6.27.38. Pompa ciepła – modelowanie zużycia energii w sezonie  *(dawne 5.64)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na ciepło w sezonie (funkcja 5.2).  
- Z krzywej COP pompy ciepła (funkcja 5.5).  
- Z danych klimatycznych (temperatura miesięczna).  
  
**Gdzie ląduje:**  
- W module `heat_pump_seasonal_model`.  
  
**Jak działa logika:**  
- System tworzy model zużycia energii przez pompę ciepła w całym sezonie grzewczym.  
- Dla każdego miesiąca oblicza zapotrzebowanie na ciepło i zużycie prądu.  
- Uwzględnia defrost, częściowe obciążenie i spadki COP.  
  
**Efekt na ekranie:**  
- Wykres miesięcznego zużycia energii.  
- Komunikat: *„Twoja pompa zużyje 3200 kWh w sezonie. Największe zużycie w styczniu – 800 kWh.”*  
- Ostrzeżenie: *„Zimą pompa to największy odbiornik – zaplanuj zapas energii.”*  
  
**Migawka:** *„O co chodzi? Pompa to Twój zimowy apetyt. Trzeba go znać, żeby nie zabrakło jedzenia.”*  
  
**Powiązania:** Funkcja 5.2, 5.5, 6.39.

#### 6.27.39. Pompa ciepła – dobór przepływów i pomp obiegowych  *(dawne 5.65)*

  
**Skąd czerpie dane:**  
- Z projektu instalacji hydraulicznej (długości rur, opory) z funkcji 5.13.  
- Z wymaganego przepływu przez pompę ciepła (ΔT).  
- Z parametrów pomp obiegowych.  
  
**Gdzie ląduje:**  
- W module `heat_pump_flow`.  
  
**Jak działa logika:**  
- System dobiera przepływ czynnika przez pompę ciepła, aby utrzymać optymalną różnicę temperatur (np. 5–7°C).  
- Dobiera pompy obiegowe, aby zapewnić wymagany przepływ.  
- Sprawdza, czy przepływ nie jest za niski (ryzyko zamarznięcia) lub za wysoki (szumy, zużycie).  
  
**Efekt na ekranie:**  
- Schemat hydrauliczny z przepływami.  
- Komunikat: *„Wymagany przepływ to 1,2 m³/h. Pompa 25/60 w trybie 3 zapewni go, zużywając 45 W.”*  
- Ostrzeżenie: *„Za mały przepływ to alarm pompy ciepła i ryzyko zamarznięcia.”*  
  
**Migawka:** *„O co chodzi? Woda musi płynąć. Za wolno – zamarza, za szybko – hałasuje.”*  
  
**Powiązania:** Funkcja 5.13, 5.15, 5.27.

#### 6.27.40. Pompa ciepła – analiza pracy w trybie off-grid z agregatem  *(dawne 5.66)*

  
**Skąd czerpie dane:**  
- Z parametrów agregatu (moc, stabilność napięcia) z funkcji 1.19.  
- Z parametrów pompy ciepła (pobór mocy, prąd rozruchowy).  
- Z zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `heat_pump_generator`.  
  
**Jak działa logika:**  
- System sprawdza, czy agregat może zasilić pompę ciepła.  
- Uwzględnia, że pompa ciepła ma duży prąd rozruchowy, który agregat musi udźwignąć.  
- Dobiera softstart lub większy agregat.  
- Planuje pracę pompy z agregatu w awaryjnych sytuacjach.  
  
**Efekt na ekranie:**  
- Tabela kompatybilności.  
- Alert: *„Twój agregat 5 kW nie udźwignie startu pompy 8 kW. Zastosuj softstart lub agregat 10 kW.”*  
- Ostrzeżenie: *„Praca pompy z agregatu to drogie ogrzewanie.”*  
  
**Migawka:** *„O co chodzi? Agregat to ostatnia deska ratunku. Pompa musi umieć z niego pić.”*  
  
**Powiązania:** Funkcja 1.19, 5.27, 6.9.

#### 6.27.41. Pompa ciepła – bilans cieplny i energetyczny budynku  *(dawne 5.67)*

  
**Skąd czerpie dane:**  
- Z wszystkich funkcji Rozdziału 5.  
- Z zapotrzebowania na ciepło i energię elektryczną.  
- Z produkcji PV i stanu baterii.  
  
**Gdzie ląduje:**  
- W module `building_energy_balance`.  
  
**Jak działa logika:**  
- System tworzy całościowy bilans cieplny i energetyczny budynku.  
- Uwzględnia źródła ciepła, straty, zyski, zużycie energii.  
- Wskazuje, które elementy wpływają najwięcej na bilans.  
- Generuje rekomendacje optymalizacji.  
  
**Efekt na ekranie:**  
- Wykres Sankeya przepływów energii.  
- Komunikat: *„Twoje straty ciepła to 12 kW przy –20°C. Pompa ciepła pokrywa 80%, grzałki 20%.”*  
- Ostrzeżenie: *„Bez bilansu nie wiesz, gdzie ucieka energia.”*  
  
**Migawka:** *„O co chodzi? To mapa energetyczna Twojego domu. Widzisz, skąd przychodzi i dokąd ucieka ciepło.”*  
  
**Powiązania:** Funkcja 5.40, 6.14, 6.39.

#### 6.27.42. Pompa ciepła – rekomendacje poprawy efektywności  *(dawne 5.68)*

  
**Skąd czerpie dane:**  
- Z analizy wszystkich funkcji Rozdziału 5.  
- Z danych o zużyciu energii i kosztach.  
- Z dostępnych technologii poprawy (izolacja, okna, wentylacja, pompa).  
  
**Gdzie ląduje:**  
- W module `thermal_improvements`.  
  
**Jak działa logika:**  
- System generuje listę rekomendacji poprawy efektywności cieplnej.  
- Sortuje je według zwrotu z inwestycji.  
- Podaje szacunkowe oszczędności energii i pieniędzy.  
  
**Efekt na ekranie:**  
- Lista rekomendacji z ROI.  
- Komunikat: *„1. Izolacja dachu – oszczędność 2000 kWh, zwrot po 3 latach. 2. Wymiana okien – oszczędność 800 kWh, zwrot po 8 latach.”*  
- Ostrzeżenie: *„Zacznij od najtańszych i najszybszych poprawek.”*  
  
**Migawka:** *„O co chodzi? To jak plan naprawczy. Wiesz, od czego zacząć.”*  
  
**Powiązania:** Funkcja 5.40, 5.10, 5.11.

#### 6.27.43. Pompa ciepła – analiza wpływu temperatury zasilania na zużycie energii  *(dawne 5.69)*

  
**Skąd czerpie dane:**  
- Z krzywej grzewczej instalacji (funkcja 5.37).  
- Z parametrów pompy ciepła i COP (funkcja 5.5).  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
  
**Gdzie ląduje:**  
- W module `flow_temp_energy_impact`.  
  
**Jak działa logika:**  
- System analizuje, jak zmiana temperatury zasilania wpływa na zużycie energii przez pompę ciepła.  
- Uwzględnia, że obniżenie temperatury zasilania o 1°C zwykle zwiększa COP o 2–3%.  
- Oblicza oszczędności przy obniżeniu temperatury zasilania (np. z 50°C do 40°C).  
- Podaje, jak przeliczyć to na kWh i złotówki.  
  
**Efekt na ekranie:**  
- Wykres zależności COP od temperatury zasilania.  
- Komunikat: *„Obniżenie temperatury zasilania z 50°C do 40°C podniesie COP z 3,0 do 3,8 i zaoszczędzi 500 kWh rocznie.”*  
- Ostrzeżenie: *„Nie obniżaj temperatury poniżej komfortu – grzejniki muszą oddać wymaganą moc.”*  
  
**Migawka:** *„O co chodzi? Każdy stopień mniej w zasilaniu to więcej ciepła z tej samej energii.”*  
  
**Powiązania:** Funkcja 5.37, 5.13, 5.27, 5.43.

#### 6.27.44. Pompa ciepła – analiza pracy w trybie ogrzewania z buforem i bez bufora  *(dawne 5.70)*

  
**Skąd czerpie dane:**  
- Z parametrów pompy ciepła i bufora (funkcje 5.27, 5.14).  
- Z profilu zapotrzebowania na ciepło (funkcja 1.7).  
- Z danych o bezwładności budynku (funkcja 5.8).  
  
**Gdzie ląduje:**  
- W module `buffer_vs_no_buffer`.  
  
**Jak działa logika:**  
- System porównuje pracę pompy ciepła z buforem i bez bufora.  
- Uwzględnia, że bufor stabilizuje pracę i zmniejsza liczbę startów, ale zwiększa straty ciepła.  
- Oblicza zużycie energii w obu scenariuszach.  
  
**Efekt na ekranie:**  
- Wykres pracy pompy z buforem i bez.  
- Komunikat: *„Bez bufora pompa startuje 20 razy na dobę, z buforem 4 razy. Oszczędność 10% energii i dłuższa żywotność.”*  
- Ostrzeżenie: *„Za duży bufor to straty ciepła i miejsce. Dobierz optymalny.”*  
  
**Migawka:** *„O co chodzi? Bufor to taki kondensator ciepła. Wygładza pracę pompy.”*  
  
**Powiązania:** Funkcja 5.14, 5.28, 5.8.

#### 6.27.45. Pompa ciepła – optymalizacja ustawień krzywej grzewczej  *(dawne 5.71)*

  
**Skąd czerpie dane:**  
- Z danych o budynku (izolacja, bezwładność) z funkcji 5.1, 5.8.  
- Z parametrów pompy ciepła i instalacji.  
- Z danych pogodowych i profilu użytkowania.  
  
**Gdzie ląduje:**  
- W module `heating_curve_optimization`.  
  
**Jak działa logika:**  
- System dobiera optymalną krzywą grzewczą dla pompy ciepła.  
- Uwzględnia, że zbyt wysoka krzywa powoduje przegrzewanie, a zbyt niska – niedogrzanie.  
- Symuluje różne ustawienia i wybiera najbardziej efektywne.  
  
**Efekt na ekranie:**  
- Wykres krzywych grzewczych.  
- Komunikat: *„Zalecana krzywa: przy 10°C zasilanie 28°C, przy –10°C 38°C. To zoptymalizuje COP.”*  
- Ostrzeżenie: *„Zła krzywa to 10% niepotrzebnego zużycia energii.”*  
  
**Migawka:** *„O co chodzi? Krzywa grzewcza to przepis na idealną temperaturę. Trzeba go dobrze dobrać.”*  
  
**Powiązania:** Funkcja 5.37, 5.13, 5.27.

#### 6.27.46. Pompa ciepła – analiza zużycia energii przez pompę cyrkulacyjną w sezonie  *(dawne 5.72)*

  
**Skąd czerpie dane:**  
- Z parametrów pompy cyrkulacyjnej (moc, tryb pracy) z funkcji 5.15.  
- Z czasu pracy instalacji grzewczej.  
- Z taryfy energii.  
  
**Gdzie ląduje:**  
- W module `circulation_pump_seasonal`.  
  
**Jak działa logika:**  
- System oblicza, ile energii zużyje pompa cyrkulacyjna przez cały sezon grzewczy.  
- Uwzględnia, że pompa może pracować całą dobę, tylko w dzień lub w trybie adaptacyjnym.  
- Porównuje stare pompy stałoobrotowe z nowymi elektronicznymi.  
  
**Efekt na ekranie:**  
- Tabela zużycia energii dla różnych pomp.  
- Komunikat: *„Twoja stara pompa 75 W zużyje 180 kWh w sezonie. Nowa elektroniczna 15 W zużyje 36 kWh. Oszczędzasz 144 kWh.”*  
- Ostrzeżenie: *„Pompa cyrkulacyjna to cichy złodziej energii.”*  
  
**Migawka:** *„O co chodzi? Pompa, która non stop mieli wodę, potrafi zjeść tyle, co lodówka.”*  
  
**Powiązania:** Funkcja 5.15, 5.13, 1.12.

#### 6.27.47. Pompa ciepła – analiza wpływu izolacji rur na straty dystrybucji  *(dawne 5.73)*

  
**Skąd czerpie dane:**  
- Z długości rur i ich izolacji (grubość, materiał) z funkcji 5.13.  
- Z temperatury zasilania i powrotu.  
- Z temperatury otoczenia rur (garaż, piwnica, strych).  
  
**Gdzie ląduje:**  
- W module `pipe_insulation_losses`.  
  
**Jak działa logika:**  
- System oblicza straty ciepła z rur dystrybucyjnych.  
- Uwzględnia, że niezaizolowane rury w nieogrzewanym garażu mogą tracić nawet 20% ciepła.  
- Dobiera odpowiednią grubość izolacji i materiał.  
  
**Efekt na ekranie:**  
- Wykres strat na rurach.  
- Komunikat: *„Twoje rury w garażu bez izolacji tracą 0,8 kWh/dobę. Izolacja 20 mm obniży straty do 0,3 kWh/dobę.”*  
- Ostrzeżenie: *„Nieizolowane rury to grzejnik, który grzeje garaż.”*  
  
**Migawka:** *„O co chodzi? Po co grzać garaż? Zaizoluj rury.”*  
  
**Powiązania:** Funkcja 5.13, 5.17, 5.15.

#### 6.27.48. Pompa ciepła – analiza wpływu bezwładności budynku na pracę pompy  *(dawne 5.74)*

  
**Skąd czerpie dane:**  
- Z bezwładności cieplnej budynku (funkcja 5.8).  
- Z parametrów pompy ciepła i bufora (funkcje 5.27, 5.14).  
- Z profilu użytkowania.  
  
**Gdzie ląduje:**  
- W module `inertia_heat_pump`.  
  
**Jak działa logika:**  
- System analizuje, jak bezwładność budynku wpływa na pracę pompy ciepła.  
- Uwzględnia, że budynek o dużej bezwładności wolniej się nagrzewa i stygnie, co stabilizuje pracę pompy.  
- Dobiera strategię pracy: ciągła z niską mocą vs. przerywana z wyższą.  
  
**Efekt na ekranie:**  
- Wykres temperatury wewnętrznej przy różnych strategiach.  
- Komunikat: *„Twój budynek ma dużą bezwładność – pompa może pracować ciągle z mocą 30%, zamiast skokowo. To oszczędza 8% energii.”*  
- Ostrzeżenie: *„W budynku o małej bezwładności ciągła praca może przegrzewać pomieszczenia.”*  
  
**Migawka:** *„O co chodzi? Ciężki dom to spokojny dom. Pompa też to lubi.”*  
  
**Powiązania:** Funkcja 5.8, 5.13, 5.27.

#### 6.27.49. Pompa ciepła – analiza wpływu mostków termicznych na dobór mocy  *(dawne 5.75)*

  
**Skąd czerpie dane:**  
- Z analizy mostków termicznych (funkcja 5.7).  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z parametrów pompy ciepła (funkcja 5.27).  
  
**Gdzie ląduje:**  
- W module `bridges_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak mostki termiczne wpływają na wymaganą moc pompy ciepła.  
- Uwzględnia, że niezaizolowane mostki zwiększają zapotrzebowanie na ciepło.  
- Oblicza, czy eliminacja mostków pozwoli zmniejszyć pompę.  
  
**Efekt na ekranie:**  
- Wykres zapotrzebowania z mostkami i bez.  
- Komunikat: *„Mostki termiczne dodają 1,5 kW do zapotrzebowania przy –20°C. Po ich eliminacji pompa 8 kW będzie przewymiarowana – wystarczy 6 kW.”*  
- Ostrzeżenie: *„Nie dobieraj pompy pod straty, które możesz wyeliminować.”*  
  
**Migawka:** *„O co chodzi? Najpierw zatkaj dziury, potem kupuj większy silnik.”*  
  
**Powiązania:** Funkcja 5.7, 5.27, 5.10.

#### 6.27.50. Pompa ciepła – analiza wpływu wentylacji na zapotrzebowanie na ciepło  *(dawne 5.76)*

  
**Skąd czerpie dane:**  
- Z parametrów wentylacji (strumień, odzysk) z funkcji 5.23.  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z danych klimatycznych.  
  
**Gdzie ląduje:**  
- W module `ventilation_heat_demand`.  
  
**Jak działa logika:**  
- System oblicza, jak wentylacja wpływa na zapotrzebowanie na ciepło.  
- Uwzględnia, że rekuperacja z odzyskiem ciepła zmniejsza straty, ale zużywa prąd.  
- Porównuje wentylację grawitacyjną z mechaniczną.  
  
**Efekt na ekranie:**  
- Wykres zapotrzebowania dla różnych wentylacji.  
- Komunikat: *„Rekuperacja 85% obniży zapotrzebowanie na ciepło o 30%, ale doda 0,5 kWh/dobę na wentylatory.”*  
- Ostrzeżenie: *„Wentylacja bez odzysku to jak otwarte okno w zimie.”*  
  
**Migawka:** *„O co chodzi? Wentylacja to oddychanie, ale nie musi oznaczać marnowania ciepła.”*  
  
**Powiązania:** Funkcja 5.23, 5.3, 5.9.

#### 6.27.51. Pompa ciepła – analiza wpływu okien na dobór mocy  *(dawne 5.77)*

  
**Skąd czerpie dane:**  
- Z parametrów okien (U, g, powierzchnia) z funkcji 5.11.  
- Z orientacji okien i nasłonecznienia.  
- Z zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `windows_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak okna wpływają na wymaganą moc pompy ciepła.  
- Uwzględnia, że okna to jednocześnie straty i zyski słoneczne.  
- Oblicza, czy wymiana okien pozwoli zmniejszyć pompę.  
  
**Efekt na ekranie:**  
- Wykres strat i zysków przez okna.  
- Komunikat: *„Wymiana okien z U 1,5 na U 0,9 obniży zapotrzebowanie o 0,8 kW. To pozwoli zmniejszyć pompę o 1 kW.”*  
- Ostrzeżenie: *„Okna od północy to czysty wydatek, od południa to zysk.”*  
  
**Migawka:** *„O co chodzi? Okno to nie tylko widok, to energetyczny gracz.”*  
  
**Powiązania:** Funkcja 5.11, 5.27, 5.10.

#### 6.27.52. Pompa ciepła – analiza wpływu izolacji dachu na dobór mocy  *(dawne 5.78)*

  
**Skąd czerpie dane:**  
- Z parametrów izolacji dachu (grubość, materiał) z funkcji 5.10.  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `roof_insulation_heat_pump`.  
  
**Jak działa logika:**  
- System sprawdza, jak izolacja dachu wpływa na wymaganą moc pompy.  
- Uwzględnia, że dach to jedno z głównych miejsc ucieczki ciepła.  
- Oblicza oszczędności z docieplenia dachu.  
  
**Efekt na ekranie:**  
- Wykres zapotrzebowania przed i po dociepleniu.  
- Komunikat: *„Docieplenie dachu z 15 cm do 30 cm obniży zapotrzebowanie o 20%. Pompa 8 kW będzie pracować z zapasem.”*  
- Ostrzeżenie: *„Nie docieplasz dachu? To jak chodzić bez czapki w mróz.”*  
  
**Migawka:** *„O co chodzi? Ciepło ucieka górą. Zatrzymaj je.”*  
  
**Powiązania:** Funkcja 5.10, 5.1, 5.27.

#### 6.27.53. Pompa ciepła – analiza wpływu izolacji podłogi na dobór mocy  *(dawne 5.79)*

  
**Skąd czerpie dane:**  
- Z parametrów izolacji podłogi (grubość, materiał) z funkcji 5.10.  
- Z zapotrzebowania na ciepło.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `floor_insulation_heat_pump`.  
  
**Jak działa logika:**  
- System sprawdza, jak izolacja podłogi wpływa na moc pompy.  
- Uwzględnia, że podłoga na gruncie traci ciepło mniej niż dach, ale przy źle zaizolowanej posadzce straty rosną.  
- Oblicza oszczędności z docieplenia podłogi.  
  
**Efekt na ekranie:**  
- Wykres strat przez podłogę.  
- Komunikat: *„Docieplenie podłogi 10 cm obniży zapotrzebowanie o 5%. Mniejsza pompa, niższe rachunki.”*  
- Ostrzeżenie: *„Podłoga na gruncie bez izolacji to studnia ciepła.”*  
  
**Migawka:** *„O co chodzi? Zimno ciągnie od ziemi. Podłoga to bariera.”*  
  
**Powiązania:** Funkcja 5.10, 5.17, 5.27.

#### 6.27.54. Pompa ciepła – analiza wpływu szczelności budynku na dobór mocy  *(dawne 5.80)*

  
**Skąd czerpie dane:**  
- Z testu szczelności (funkcja 5.12).  
- Z zapotrzebowania na ciepło.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `airtightness_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak nieszczelności wpływają na wymaganą moc pompy.  
- Uwzględnia, że nieszczelności to niekontrolowana wentylacja.  
- Oblicza, czy uszczelnienie pozwoli zmniejszyć pompę.  
  
**Efekt na ekranie:**  
- Wykres strat przez nieszczelności.  
- Komunikat: *„Uszczelnienie budynku obniży zapotrzebowanie o 10%. Pompa 8 kW będzie przewymiarowana – wystarczy 7 kW.”*  
- Ostrzeżenie: *„Nieszczelności to darmowa wentylacja, ale zimą płacisz za nią podwójnie.”*  
  
**Migawka:** *„O co chodzi? Szpary to dziury. Zatkaj je, zanim kupisz pompę.”*  
  
**Powiązania:** Funkcja 5.12, 5.9, 5.27.

#### 6.27.55. Pompa ciepła – analiza zysków słonecznych i ich wpływ na dobór mocy  *(dawne 5.81)*

  
**Skąd czerpie dane:**  
- Z danych o nasłonecznieniu i oknach (funkcja 5.11).  
- Z zapotrzebowania na ciepło.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `solar_gains_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System oblicza, ile ciepła dostarczają zyski słoneczne.  
- Uwzględnia, że w słoneczne zimowe dni pompa może pracować mniej.  
- Oblicza, czy zyski słoneczne pozwalają zmniejszyć pompę.  
  
**Efekt na ekranie:**  
- Wykres zysków słonecznych w sezonie.  
- Komunikat: *„Twoje okna południowe dają 1500 kWh rocznie. To jak 0,5 kW mocy. Uwzględnij to w doborze pompy.”*  
- Ostrzeżenie: *„Nie przewymiaruj pompy – zyski słoneczne robią swoje.”*  
  
**Migawka:** *„O co chodzi? Słońce to darmowy grzejnik. Nie zapomnij o nim.”*  
  
**Powiązania:** Funkcja 5.11, 5.27, 2.2.

#### 6.27.56. Pompa ciepła – analiza zysków bytowych i ich wpływ na dobór mocy  *(dawne 5.82)*

  
**Skąd czerpie dane:**  
- Z profilu użytkowania (liczba osób, urządzenia) z funkcji 1.6, 1.3.  
- Z zapotrzebowania na ciepło.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `internal_gains_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System oblicza zyski bytowe: ludzie, urządzenia AGD, oświetlenie, gotowanie.  
- Uwzględnia, że w nowoczesnym domu zyski bytowe to często 2–3 kWh/dobę.  
- Oblicza, jak zyski bytowe wpływają na moc pompy.  
  
**Efekt na ekranie:**  
- Wykres zysków bytowych.  
- Komunikat: *„Zyski bytowe to 2,5 kWh/dobę. To obniża wymaganą moc pompy o 0,3 kW.”*  
- Ostrzeżenie: *„Zyski bytowe zimą pomagają, latem przeszkadzają.”*  
  
**Migawka:** *„O co chodzi? Człowiek i lodówka też grzeją. Nie zapomnij o nich.”*  
  
**Powiązania:** Funkcja 1.6, 5.2, 5.27.

#### 6.27.57. Pompa ciepła – analiza wpływu wysokości pomieszczeń na dobór mocy  *(dawne 5.83)*

  
**Skąd czerpie dane:**  
- Z modelu budynku (wysokość pomieszczeń) z Rozdziału 0.  
- Z zapotrzebowania na ciepło.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `ceiling_height_heat_pump`.  
  
**Jak działa logika:**  
- System sprawdza, jak wysokość pomieszczeń wpływa na zapotrzebowanie na ciepło.  
- Uwzględnia, że wysokie pomieszczenia mają większą kubaturę i straty przez strop.  
- Oblicza, czy obniżenie sufitów lub ogrzewanie strefowe obniży moc pompy.  
  
**Efekt na ekranie:**  
- Wykres strat dla różnych wysokości.  
- Komunikat: *„Wysokość 3 m zamiast 2,5 m zwiększa kubaturę o 20%. Zapotrzebowanie rośnie o 8%.”*  
- Ostrzeżenie: *„Wysokie pomieszczenia to luksus, który kosztuje ciepło.”*  
  
**Migawka:** *„O co chodzi? Im wyżej, tym więcej powietrza do ogrzania.”*  
  
**Powiązania:** Funkcja 5.2, 5.27, 5.17.

#### 6.27.58. Pompa ciepła – analiza wpływu orientacji budynku na dobór mocy  *(dawne 5.84)*

  
**Skąd czerpie dane:**  
- Z orientacji budynku i okien (Rozdział 0).  
- Z danych o nasłonecznieniu.  
- Z zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `building_orientation_heat_pump`.  
  
**Jak działa logika:**  
- System sprawdza, jak orientacja budynku wpływa na zyski słoneczne i straty ciepła.  
- Uwzględnia, że budynek z oknami na południe ma więcej zysków, ale i większe ryzyko przegrzania.  
- Oblicza, jak orientacja wpływa na moc pompy.  
  
**Efekt na ekranie:**  
- Wykres zysków dla różnych orientacji.  
- Komunikat: *„Twoje okna południowe dają 1200 kWh rocznie, północne tracą 800 kWh. Orientacja obniża wymaganą moc pompy o 0,2 kW.”*  
- Ostrzeżenie: *„Nie zmienisz orientacji, ale możesz zmienić okna.”*  
  
**Migawka:** *„O co chodzi? Słońce wschodzi i zachodzi. Twój dom to wie.”*  
  
**Powiązania:** Funkcja 5.11, 0.4, 5.27.

#### 6.27.59. Pompa ciepła – analiza wpływu wiatru na dobór mocy  *(dawne 5.85)*

  
**Skąd czerpie dane:**  
- Z danych wiatrowych (prędkość, kierunek) z Rozdziału 0.  
- Z modelu budynku (nieszczelności, wysokość).  
- Z zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `wind_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak wiatr wpływa na straty ciepła i moc pompy.  
- Uwzględnia, że silny wiatr zwiększa infiltrację i wychładzanie ścian.  
- Oblicza, czy budynek w wietrznej okolicy wymaga większej pompy.  
  
**Efekt na ekranie:**  
- Wykres strat przy różnych prędkościach wiatru.  
- Komunikat: *„Wiatr 30 km/h zwiększa straty o 15%. Pompa musi być o 0,5 kW większa.”*  
- Ostrzeżenie: *„Wietrzne działki to wyższe rachunki za ogrzewanie.”*  
  
**Migawka:** *„O co chodzi? Wiatr kradnie ciepło z domu.”*  
  
**Powiązania:** Funkcja 5.26, 5.12, 5.27.

#### 6.27.60. Pompa ciepła – analiza wpływu cieniowania na dobór mocy  *(dawne 5.86)*

  
**Skąd czerpie dane:**  
- Z analizy zacienienia (funkcja 0.3).  
- Z danych o nasłonecznieniu i oknach.  
- Z zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `shading_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak zacienienie budynku wpływa na zyski słoneczne i moc pompy.  
- Uwzględnia, że zacienione okna tracą zyski słoneczne.  
- Oblicza, czy usunięcie przeszkód (np. drzew) obniży wymaganą moc pompy.  
  
**Efekt na ekranie:**  
- Wykres zysków przed i po usunięciu cienia.  
- Komunikat: *„Drzewo przed oknem zabiera 300 kWh rocznie. Po wycięciu moc pompy spadnie o 0,3 kW.”*  
- Ostrzeżenie: *„Cień to oszczędność latem, strata zimą.”*  
  
**Migawka:** *„O co chodzi? Cień chłodzi, ale zimą nie chcesz chłodu.”*  
  
**Powiązania:** Funkcja 0.3, 5.11, 5.27.

#### 6.27.61. Pompa ciepła – analiza wpływu rodzaju gruntu na dobór mocy  *(dawne 5.87)*

  
**Skąd czerpie dane:**  
- Z parametrów gruntu (typ, wilgotność, przewodność) z Rozdziału 0.  
- Z projektu kolektora gruntowego (funkcja 5.42).  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `ground_type_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak rodzaj gruntu wpływa na dolne źródło pompy.  
- Uwzględnia, że suchy piasek ma mniejszą przewodność niż wilgotna glina.  
- Oblicza, czy grunt wymaga większego kolektora lub mocniejszej pompy.  
  
**Efekt na ekranie:**  
- Tabela przewodności gruntu.  
- Komunikat: *„Twój grunt to suchy piasek. Kolektor będzie o 30% większy niż w glinie. Pompa musi pracować z większym przepływem.”*  
- Ostrzeżenie: *„Zły grunt to za mało ciepła z ziemi.”*  
  
**Migawka:** *„O co chodzi? Grunt to paliwo pompy. Musisz wiedzieć, ile go masz.”*  
  
**Powiązania:** Funkcja 5.42, 5.27, 6.35.

#### 6.27.62. Pompa ciepła – analiza wpływu wysokości nad poziomem morza na dobór mocy  *(dawne 5.88)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (wysokość n.p.m.) z Rozdziału 0.  
- Z danych klimatycznych (temperatura, ciśnienie).  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `altitude_heat_pump_sizing`.  
  
**Jak działa logika:**  
- System sprawdza, jak wysokość n.p.m. wpływa na pracę pompy.  
- Uwzględnia, że na dużych wysokościach spada gęstość powietrza i wydajność pomp powietrznych.  
- Oblicza, czy pompa wymaga korekty mocy.  
  
**Efekt na ekranie:**  
- Wykres mocy pompy dla różnych wysokości.  
- Komunikat: *„Na wysokości 800 m pompa powietrzna traci 10% mocy. Skoryguj dobór.”*  
- Ostrzeżenie: *„W górach pompy powietrzne są mniej efektywne.”*  
  
**Migawka:** *„O co chodzi? Im wyżej, tym rzadsze powietrze. Pompa to czuje.”*  
  
**Powiązania:** Funkcja 5.27, 5.42, 0.1.

#### 6.27.63. Pompa ciepła – analiza wpływu wilgotności gruntu na dolne źródło  *(dawne 5.89)*

  
**Skąd czerpie dane:**  
- Z parametrów gruntu (wilgotność, typ) z Rozdziału 0.  
- Z projektu kolektora gruntowego (funkcja 5.42).  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `ground_moisture_heat_pump`.  
  
**Jak działa logika:**  
- System sprawdza, jak wilgotność gruntu wpływa na przewodność i wydajność dolnego źródła.  
- Uwzględnia, że wilgotny grunt lepiej przewodzi ciepło.  
- Oblicza, czy grunt wymaga nawadniania lub większego kolektora.  
  
**Efekt na ekranie:**  
- Tabela przewodności dla różnych wilgotności.  
- Komunikat: *„Twój grunt ma wilgotność 15%. Przewodność 1,5 W/mK. Przy 30% wilgotności wzrosłaby do 2,2 W/mK – mniejszy kolektor.”*  
- Ostrzeżenie: *„Suchy grunt to gorsze paliwo.”*  
  
**Migawka:** *„O co chodzi? Mokra ziemia lepiej oddaje ciepło.”*  
  
**Powiązania:** Funkcja 5.42, 5.87, 6.35.

#### 6.27.64. Pompa ciepła – analiza wpływu głębokości odwiertów na koszt i wydajność  *(dawne 5.90)*

  
**Skąd czerpie dane:**  
- Z projektu kolektora pionowego (funkcja 5.42).  
- Z cen odwiertów i parametrów gruntu.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `borehole_depth_analysis`.  
  
**Jak działa logika:**  
- System analizuje, jak głębokość odwiertów wpływa na wydajność i koszt.  
- Uwzględnia, że głębsze odwierty dają stabilniejszą temperaturę, ale są droższe.  
- Oblicza optymalną głębokość dla danego budynku i gruntu.  
  
**Efekt na ekranie:**  
- Wykres kosztów i wydajności dla różnych głębokości.  
- Komunikat: *„Odwiert 100 m kosztuje 20 000 zł, 150 m – 30 000 zł, ale daje 20% więcej ciepła. Optymalnie: 120 m.”*  
- Ostrzeżenie: *„Za głęboki odwiert to wyrzucone pieniądze.”*  
  
**Migawka:** *„O co chodzi? Głębiej nie znaczy lepiej. Trzeba znaleźć złoty środek.”*  
  
**Powiązania:** Funkcja 5.42, 5.27, 5.39.

#### 6.27.65. Pompa ciepła – analiza wpływu liczby odwiertów na koszt i wydajność  *(dawne 5.91)*

  
**Skąd czerpie dane:**  
- Z projektu kolektora pionowego (funkcja 5.42).  
- Z cen odwiertów i parametrów gruntu.  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `borehole_count_analysis`.  
  
**Jak działa logika:**  
- System analizuje, jak liczba odwiertów wpływa na wydajność i koszt.  
- Uwzględnia, że kilka płytszych odwiertów może być tańszych niż jeden głęboki.  
- Oblicza optymalną liczbę odwiertów.  
  
**Efekt na ekranie:**  
- Tabela kosztów i wydajności dla różnych liczby odwiertów.  
- Komunikat: *„2 odwierty po 80 m kosztują 32 000 zł, 1 odwiert 120 m – 24 000 zł. Wybierz 1 głęboki.”*  
- Ostrzeżenie: *„Więcej odwiertów to więcej rur i pomp.”*  
  
**Migawka:** *„O co chodzi? Czasem lepiej kopać głębiej, a nie szerzej.”*  
  
**Powiązania:** Funkcja 5.42, 5.90, 5.39.

#### 6.27.66. Pompa ciepła – analiza wpływu rodzaju kolektora na koszt i wydajność  *(dawne 5.92)*

  
**Skąd czerpie dane:**  
- Z projektu kolektora (funkcja 5.42).  
- Z cen kolektorów i robocizny.  
- Z parametrów gruntu i działki.  
  
**Gdzie ląduje:**  
- W module `collector_type_comparison`.  
  
**Jak działa logika:**  
- System porównuje kolektor poziomy, pionowy i spiralny pod kątem kosztów i wydajności.  
- Uwzględnia dostępną powierzchnię działki, rodzaj gruntu, koszty robocizny.  
- Oblicza, który kolektor jest najbardziej opłacalny.  
  
**Efekt na ekranie:**  
- Tabela porównawcza kolektorów.  
- Komunikat: *„Kolektor poziomy 400 m² kosztuje 15 000 zł, pionowy 100 m – 20 000 zł. Poziomy jest tańszy, ale wymaga dużej działki.”*  
- Ostrzeżenie: *„Brak miejsca na kolektor poziomy? Wybierz pionowy.”*  
  
**Migawka:** *„O co chodzi? Każdy kolektor ma swoje plusy i minusy. Trzeba wybrać do swojej działki.”*  
  
**Powiązania:** Funkcja 5.42, 5.90, 5.91.

#### 6.27.67. Pompa ciepła – analiza wpływu temperatury dolnego źródła na COP  *(dawne 5.93)*

  
**Skąd czerpie dane:**  
- Z temperatury dolnego źródła (grunt, powietrze) z Rozdziału 0.  
- Z parametrów pompy ciepła (funkcja 5.5).  
- Z danych o sezonie grzewczym.  
  
**Gdzie ląduje:**  
- W module `source_temp_cop`.  
  
**Jak działa logika:**  
- System analizuje, jak temperatura dolnego źródła wpływa na COP pompy.  
- Uwzględnia, że im cieplejsze źródło, tym wyższy COP.  
- Oblicza, o ile wzrośnie COP przy podniesieniu temperatury źródła (np. przez GWC).  
  
**Efekt na ekranie:**  
- Wykres COP w funkcji temperatury źródła.  
- Komunikat: *„Podniesienie temperatury źródła z 0°C do 5°C zwiększy COP o 15%.”*  
- Ostrzeżenie: *„Zimne źródło to gorsze paliwo.”*  
  
**Migawka:** *„O co chodzi? Ciepłe źródło to tańsze ciepło.”*  
  
**Powiązania:** Funkcja 5.42, 5.5, 5.54.

#### 6.27.68. Pompa ciepła – analiza wpływu prędkości przepływu na wymianę ciepła  *(dawne 5.94)*

  
**Skąd czerpie dane:**  
- Z parametrów przepływu (funkcja 5.65).  
- Z parametrów pompy ciepła.  
- Z danych o instalacji hydraulicznej.  
  
**Gdzie ląduje:**  
- W module `flow_rate_heat_exchange`.  
  
**Jak działa logika:**  
- System analizuje, jak prędkość przepływu wpływa na wymianę ciepła w pompie.  
- Uwzględnia, że zbyt niski przepływ powoduje zamarzanie, zbyt wysoki – szum i zużycie.  
- Oblicza optymalny przepływ.  
  
**Efekt na ekranie:**  
- Wykres wymiany ciepła w funkcji przepływu.  
- Komunikat: *„Optymalny przepływ to 1,5 m³/h. Niższy grozi alarmem, wyższy hałasem.”*  
- Ostrzeżenie: *„Nie lekceważ przepływu – to krew instalacji.”*  
  
**Migawka:** *„O co chodzi? Woda musi płynąć równo, nie za szybko, nie za wolno.”*  
  
**Powiązania:** Funkcja 5.65, 5.27, 5.15.

#### 6.27.69. Pompa ciepła – analiza wpływu temperatury powrotu na COP  *(dawne 5.95)*

  
**Skąd czerpie dane:**  
- Z projektu instalacji (temperatura zasilania i powrotu) z funkcji 5.13.  
- Z parametrów pompy ciepła.  
- Z danych o odbiornikach ciepła.  
  
**Gdzie ląduje:**  
- W module `return_temp_cop`.  
  
**Jak działa logika:**  
- System analizuje, jak temperatura powrotu wpływa na COP pompy.  
- Uwzględnia, że niższa temperatura powrotu oznacza lepszą wymianę ciepła.  
- Oblicza, o ile wzrośnie COP przy obniżeniu temperatury powrotu.  
  
**Efekt na ekranie:**  
- Wykres COP w funkcji temperatury powrotu.  
- Komunikat: *„Obniżenie temperatury powrotu z 45°C do 35°C zwiększy COP o 12%.”*  
- Ostrzeżenie: *„Zbyt niska temperatura powrotu może nie dogrzać pomieszczeń.”*  
  
**Migawka:** *„O co chodzi? Zimna woda wraca, pompa się cieszy.”*  
  
**Powiązania:** Funkcja 5.13, 5.17, 5.5.

#### 6.27.70. Pompa ciepła – analiza wpływu defrostu na sezonowe zużycie energii  *(dawne 5.96)*

  
**Skąd czerpie dane:**  
- Z parametrów defrostu (funkcja 5.56).  
- Z danych klimatycznych (temperatura, wilgotność).  
- Z parametrów pompy ciepła.  
  
**Gdzie ląduje:**  
- W module `defrost_seasonal_impact`.  
  
**Jak działa logika:**  
- System oblicza, ile energii zużywa defrost w całym sezonie.  
- Uwzględnia, że częsty defrost obniża efektywność pompy.  
- Oblicza, jak strategia defrostu wpływa na roczne zużycie energii.  
  
**Efekt na ekranie:**  
- Wykres zużycia energii na defrost.  
- Komunikat: *„Defrost zużyje 120 kWh w sezonie, co stanowi 4% całkowitego zużycia pompy.”*  
- Ostrzeżenie: *„Zła strategia defrostu to 10% więcej na rachunku.”*  
  
**Migawka:** *„O co chodzi? Defrost to przerwa na oddech. Zbyt częsta kosztuje.”*  
  
**Powiązania:** Funkcja 5.56, 6.8, 5.5.

#### 6.27.71. Pompa ciepła – analiza wpływu trybu cichego na zużycie energii  *(dawne 5.97)*

  
**Skąd czerpie dane:**  
- Z parametrów trybu cichego (funkcja 5.44).  
- Z profilu pracy pompy.  
- Z danych o taryfie i kosztach energii.  
  
**Gdzie ląduje:**  
- W module `silent_mode_energy`.  
  
**Jak działa logika:**  
- System analizuje, jak tryb cichy wpływa na zużycie energii.  
- Uwzględnia, że tryb cichy obniża moc, ale wydłuża czas pracy.  
- Oblicza, czy tryb cichy zwiększa czy zmniejsza zużycie.  
  
**Efekt na ekranie:**  
- Wykres pracy pompy w trybie cichym.  
- Komunikat: *„Tryb cichy wydłuży pracę o 20%, ale zużycie energii spadnie o 5% dzięki niższej mocy.”*  
- Ostrzeżenie: *„W trybie cichym pompa pracuje dłużej, co może przeszkadzać.”*  
  
**Migawka:** *„O co chodzi? Ciszej nie znaczy taniej.”*  
  
**Powiązania:** Funkcja 5.44, 5.27, 5.31.

#### 6.27.72. Pompa ciepła – analiza wpływu ograniczenia mocy na zużycie energii  *(dawne 5.98)*

  
**Skąd czerpie dane:**  
- Z ustawień ograniczenia mocy (funkcja 5.44).  
- Z parametrów pompy ciepła.  
- Z profilu zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `power_limit_energy`.  
  
**Jak działa logika:**  
- System analizuje, jak ograniczenie mocy wpływa na zużycie energii i komfort.  
- Uwzględnia, że mniejsza moc to dłuższa praca, ale niższe obciążenie falownika.  
- Oblicza, czy warto ograniczać moc.  
  
**Efekt na ekranie:**  
- Wykres pracy pompy z ograniczeniem mocy.  
- Komunikat: *„Ograniczenie do 60% mocy wydłuży pracę o 40%, ale pozwoli uniknąć przeciążenia falownika.”*  
- Ostrzeżenie: *„Zbyt duże ograniczenie to chłodny dom.”*  
  
**Migawka:** *„O co chodzi? Czasem lepiej jechać wolniej, żeby nie zgasł silnik.”*  
  
**Powiązania:** Funkcja 5.44, 4.3, 6.33.

#### 6.27.73. Pompa ciepła – analiza wpływu bufora na stabilność temperatury  *(dawne 5.99)*

  
**Skąd czerpie dane:**  
- Z parametrów bufora (funkcja 5.14).  
- Z bezwładności budynku (funkcja 5.8).  
- Z profilu zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `buffer_temperature_stability`.  
  
**Jak działa logika:**  
- System analizuje, jak bufor wpływa na stabilność temperatury w budynku.  
- Uwzględnia, że bufor wygładza skoki temperatury.  
- Oblicza, czy bufor zmniejsza wahania temperatury.  
  
**Efekt na ekranie:**  
- Wykres temperatury z buforem i bez.  
- Komunikat: *„Z buforem temperatura w salonie waha się o ±0,5°C, bez bufora ±1,5°C.”*  
- Ostrzeżenie: *„Brak bufora to huśtawka temperatury.”*  
  
**Migawka:** *„O co chodzi? Bufor to amortyzator. Wygładza skoki.”*  
  
**Powiązania:** Funkcja 5.14, 5.8, 5.28.

#### 6.27.74. Pompa ciepła – analiza wpływu bufora na liczbę startów  *(dawne 5.100)*

  
**Skąd czerpie dane:**  
- Z parametrów bufora (funkcja 5.14).  
- Z parametrów pompy ciepła (funkcja 5.27).  
- Z profilu zapotrzebowania na ciepło.  
  
**Gdzie ląduje:**  
- W module `buffer_start_reduction`.  
  
**Jak działa logika:**  
- System analizuje, jak bufor zmniejsza liczbę startów pompy.  
- Uwzględnia, że mniej startów to dłuższa żywotność sprężarki.  
- Oblicza, ile startów dziennie eliminuje bufor.  
  
**Efekt na ekranie:**  
- Wykres startów z buforem i bez.  
- Komunikat: *„Bez bufora 20 startów/dobę, z buforem 4 starty/dobę. To 5× dłuższa żywotność sprężarki.”*  
- Ostrzeżenie: *„Każdy start to zużycie sprężarki.”*  
  
**Migawka:** *„O co chodzi? Pompa to nie lubi ciągłego włączania i wyłączania.”*  
  
**Powiązania:** Funkcja 5.14, 5.28, 5.27.  
  
## Rozdział 6: Stress test zimowy (symulator surowej zimy)


---

## Moduł 7 (Kafel 7): Stress-test zimowy

*Dawny Rozdział 6, pomniejszony o 2 funkcje przeniesione do Kafla 8 (6.19, 6.25 — dotyczą bezpieczeństwa przy dogrzewaniu paliwem stałym, tematycznie należą do modułu bezpieczeństwa, nie stress-testu).*

### 7.1. Symulacja przy –20°C i –30°C  *(dawne 6.1)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (minimalne temperatury, dane klimatyczne) z Rozdziału 0.  
- Z profilu zapotrzebowania na energię (Rozdział 1) i zapotrzebowania na ciepło (Rozdział 5).  
- Z produkcji PV (Rozdział 2) i magazynu energii (Rozdział 3).  
- Z ustawień BMS i grzałek (funkcje 3.5, 3.13).  
  
**Gdzie ląduje:**  
- W module `winter_stress` – dzienny bilans energii dla najzimniejszego miesiąca.  
  
**Jak działa logika:**  
- System symuluje dzień po dniu dla zadanego zakresu temperatur (np. od 0°C do –30°C).  
- Dla każdego dnia wyznacza:  
  - produkcję PV (obniżoną przez spadek sprawności paneli przy mrozie),  
  - zapotrzebowanie na ogrzewanie (wzrost wraz ze spadkiem temperatury),  
  - zapotrzebowanie na prąd (dodatkowe grzałki BMS, pompy, defrost),  
  - spadek pojemności użytecznej baterii (np. –20% przy –20°C).  
- Oblicza dzienny deficyt lub nadwyżkę energii.  
- Sprawdza, czy bateria wystarcza do pokrycia nocnego zapotrzebowania.  
- Identyfikuje dni, w których system przechodzi w tryb krytyczny.  
  
**Efekt na ekranie:**  
- Wykres dzienny: produkcja PV, zużycie, SoC.  
- Komunikat: *„W styczniu, przy średniej –15°C, system będzie miał 7 dni z deficytem 55 kWh. Potrzebujesz agregatu lub dodatkowych paneli.”*  
- Tabela dni krytycznych z przewidywanym niedoborem energii.  
  
**Migawka:** *„O co chodzi? To codzienna symulacja zimy. Pokazuje, czy system da radę w normalne mroźne dni, a nie tylko w ekstremalnym scenariuszu.”*  
  
**Powiązania:** Funkcja 6.2, 6.4, 3.13, 3.16.

---

### 7.2. Deficyty miesięczne i agregat (szczegóły)  *(dawne 6.2)*

  
**Skąd czerpie dane:**  
- Z symulacji dziennej (funkcja 6.1) – sumuje deficyty dla każdego miesiąca.  
- Z parametrów agregatu prądotwórczego (funkcja 1.19).  
- Z cen paliwa i kosztów eksploatacji.  
  
**Gdzie ląduje:**  
- W module `monthly_deficit` – raport miesięczny dla użytkownika.  
  
**Jak działa logika:**  
- System sumuje wszystkie dzienne deficyty energii w danym miesiącu.  
- Przelicza brakujące kWh na czas pracy agregatu, uwzględniając jego moc i zalecane obciążenie (70–80% mocy).  
- Oblicza zużycie paliwa (l/h) i koszt paliwa na miesiąc.  
- Dodaje koszty serwisu i oleju.  
- Generuje listę miesięcy, w których agregat będzie musiał pracować.  
  
**Efekt na ekranie:**  
- Tabela: *„Grudzień: deficyt 120 kWh → agregat 5 kW pracuje 30 h → 45 l paliwa → 350 zł.”*  
- Wykres słupkowy: deficyty miesięczne i godziny pracy agregatu.  
- Ostrzeżenie: *„W lutym agregat będzie pracował 40 h – sprawdź zapas paliwa.”*  
  
**Migawka:** *„O co chodzi? To portfel zimy. Wiesz, ile wydasz na paliwo, zanim przyjdzie mróz.”*  
  
**Powiązania:** Funkcja 6.1, 1.19, 6.9.

---

### 7.3. Raport kryzysowy – podsumowanie  *(dawne 6.3)*

  
**Skąd czerpie dane:**  
- Z wszystkich symulacji zimowych (funkcje 6.1, 6.2, 6.4, 6.13 i inne).  
- Z modelu systemu (produkcja PV, magazyn, zapotrzebowanie).  
  
**Gdzie ląduje:**  
- W module `crisis_report` – generowany dokument PDF lub ekran podsumowujący.  
  
**Jak działa logika:**  
- System zestawia w jednym miejscu:  
  - całkowite zapotrzebowanie roczne i sezonowe,  
  - produkcję PV w miesiącach zimowych,  
  - deficyty miesięczne,  
  - łączną liczbę godzin pracy agregatu,  
  - całkowite zużycie paliwa i koszt,  
  - liczbę dni, w których system działał na granicy wyłączenia,  
  - wskazania, gdzie są największe straty.  
- Generuje rekomendacje: ile paneli dołożyć, ile kWh baterii dodać, czy zmienić strategię ogrzewania.  
- Określa **Współczynnik Bezpieczeństwa Zimowego** (np. 87%) – patrz funkcja 6.14.  
  
**Efekt na ekranie:**  
- Jedna strona z kolorowymi wskaźnikami i najważniejszymi liczbami.  
- Komunikat: *„Twój system przetrwa zimę na 87% – brakuje 13% energii, którą pokryje agregat. Zalecamy dodanie 4 paneli lub zwiększenie baterii o 10 kWh.”*  
- Przycisk: „Pobierz pełny raport PDF”.  
  
**Migawka:** *„O co chodzi? To ocena końcowa. Mówi, czy system jest gotowy na zimę, czy tylko udaje, że jest.”*  
  
**Powiązania:** Funkcja 6.2, 6.4, 6.14.

---

### 7.4. Pełny Scenariusz Awaryjny „Blackout” (100% chmur i -25°C)  *(dawne 6.4)*

  
**Skąd czerpie dane:**  
- Z danych klimatycznych (najgorsze miesiące, minimalne temperatury) z Rozdziału 0.  
- Z profilu zapotrzebowania (Rozdział 1), produkcji PV (Rozdział 2) i magazynu (Rozdział 3).  
- Z konfiguracji agregatu (funkcja 1.19).  
  
**Gdzie ląduje:**  
- W module `blackout_scenario`.  
  
**Jak działa logika:**  
- System symuluje skrajny scenariusz: 10–14 dni z całkowitym zachmurzeniem, temperatura spada do –25°C.  
- Dzień po dniu oblicza bilans energii: produkcja PV = 0, zużycie = maksymalne (ogrzewanie, pompy, grzanie BMS).  
- Śledzi poziom SoC baterii i moment, w którym spadnie do krytycznego minimum (np. 10%).  
- Sprawdza, czy agregat jest w stanie pokryć deficyt i ile paliwa zużyje.  
- Pokazuje, kiedy system umrze (tzw. „śmierć systemu”), jeśli nie podejmie się działań.  
  
**Efekt na ekranie:**  
- Wykres SoC w czasie dla całego scenariusza.  
- Alert: *„W scenariuszu 14 dni bez słońca przy –25°C Twój system padnie 9. dnia o 3:00 w nocy. Aby przetrwać, potrzebujesz dodatkowo 30 kWh baterii lub musisz ograniczyć zużycie o 40%.”*  
- Raport krytyczny z listą największych odbiorników energii.  
  
**Migawka:** *„O co chodzi? To jest test najgorszego koszmaru. Jeśli system przeżyje to, przeżyje wszystko.”*  
**Powiązania:** Funkcja 6.1, 6.2, 3.36, 1.19.

---

### 7.5. Procedura „Black Start” (Start z zera)  *(dawne 6.5)*

  
**Skąd czerpie dane:**  
- Z instrukcji obsługi BMS, falownika, agregatu.  
- Z aktualnego stanu systemu (bateria rozładowana, falownik wyłączony, BMS w trybie uśpienia).  
- Z listy dostępnych źródeł (agregat, rozrusznik, inne).  
  
**Gdzie ląduje:**  
- W module `black_start_procedure`.  
  
**Jak działa logika:**  
- System prowadzi użytkownika krok po kroku, jak ruszyć system po całkowitym blackoucie:  
  1. **Uruchom agregat** i poczekaj, aż osiągnie stabilne napięcie.  
  2. **Podłącz agregat do ładowarki/MPPT** (jeśli to możliwe) lub bezpośrednio do falownika (jeśli ma wejście AC).  
  3. **Wybudź BMS** (jeśli ma tryb uśpienia, podłącz go do napięcia przez chwilę).  
  4. **Naładuj baterię do minimalnego poziomu** (np. 20%), aby mogła zasilać elektronikę.  
  5. **Włącz falownik** i stopniowo załączaj najpierw systemy krytyczne.  
- Sprawdza, czy poszczególne komponenty są sprawne i czy nie ma zwarć przed ponownym uruchomieniem.  
  
**Efekt na ekranie:**  
- Interaktywna lista kroków z checkboxami.  
- Komunikat: *„Black start zakończony. Bateria naładowana do 20%. Możesz teraz załączyć ogrzewanie.”*  
- Ostrzeżenie: *„Nie podłączaj agregatu bezpośrednio do baterii bez ładowarki – uszkodzisz ogniwa!”*  
  
**Migawka:** *„O co chodzi? To jak rozruch samochodu po nocy na mrozie. Trzeba wiedzieć, co przekręcić, żeby zapalić.”*  
**Powiązania:** Funkcja 6.4, 3.36, 1.19, 3.18.

---

### 7.6. Priorytetowa Strategia „Zamarzanie” (Freeze Protection Load Shedding)  *(dawne 6.6)*

  
**Skąd czerpie dane:**  
- Z temperatury wewnętrznej budynku, temperatury zewnętrznej, poziomu SoC baterii.  
- Z listy odbiorników i ich priorytetów (funkcja 1.20).  
- Z modelu termicznego budynku (Rozdział 5).  
  
**Gdzie ląduje:**  
- W module `freeze_protection_shedding`.  
  
**Jak działa logika:**  
- System symuluje spadek temperatury w budynku podczas długiej przerwy w ogrzewaniu.  
- Jeśli SoC baterii jest niski i brakuje energii, system podejmuje decyzje o odłączaniu odbiorników, aby utrzymać ogrzewanie i pompy wody.  
- Algorytm priorytetów:  
  1. **Krytyczne:** pompa ciepła, pompa głębinowa, przepompownia ścieków, grzałki BMS – nigdy nie odłączane.  
  2. **Ważne:** oświetlenie, router, monitoring – odłączane w ostateczności.  
  3. **Komfort:** zmywarka, pralka, klimatyzacja – odłączane jako pierwsze.  
- Oblicza, o ile stopni spadnie temperatura wewnętrzna po odłączeniu ogrzewania i kiedy grozi zamarznięcie.  
  
**Efekt na ekranie:**  
- Wykres temperatury wewnętrznej przy różnych scenariuszach odłączania.  
- Komunikat: *„Przy SoC 15% system odłączy zmywarkę i pralkę, ale utrzyma ogrzewanie przez 12 godzin. Temperatura wewnętrzna spadnie do 12°C, ale rury nie zamarzną.”*  
  
**Migawka:** *„O co chodzi? Gdy energii jest mało, trzeba wybierać, co poświęcić. Ogrzewanie i woda są ważniejsze niż zmywarka.”*  
**Powiązania:** Funkcja 1.20, 6.4, 6.11.

---

### 7.7. Symulacja Oblodzenia i Śniegu na PV  *(dawne 6.7)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (strefa śniegowa, temperatura, opady) z Rozdziału 0.  
- Z konfiguracji paneli (typ, kąt, montaż) z Rozdziału 2.  
- Z danych o szronie, gołoledzi i wilgotności.  
  
**Gdzie ląduje:**  
- W module `snow_ice_simulation`.  
  
**Jak działa logika:**  
- System oblicza wpływ zalegającego śniegu i lodu na produkcję PV:  
  - **Śnieg sypki:** przy kącie >30° może się zsunąć, ale przy małych kątach zalega i blokuje produkcję.  
  - **Śnieg mokry:** przykleja się do paneli, ciężki, trudny do usunięcia.  
  - **Gołoledź / szron:** całkowicie blokuje światło, produkcja spada do zera.  
- Symuluje, jak długo po ustaniu opadów panele pozostaną nieproduktywne, jeśli nie zostaną odśnieżone.  
- Uwzględnia efekt samooczyszczania (przy większym kącie nachylenia i cieplejszych panelach).  
  
**Efekt na ekranie:**  
- Wykres produkcji PV w czasie podczas i po opadach.  
- Komunikat: *„Po 24 h opadów śniegu produkcja spadnie do 0%. Przy temperaturze –5°C śnieg utrzyma się 3 dni, chyba że panele zostaną odśnieżone.”*  
- Ostrzeżenie: *„Przy kącie 10° śnieg nie zsunie się sam. Rozważ system grzewczy lub odśnieżanie ręczne.”*  
  
**Migawka:** *„O co chodzi? Zasypany panel to martwy panel. Trzeba wiedzieć, ile energii tracisz i kiedy wróci słońce.”*  
**Powiązania:** Funkcja 2.5, 2.11, 6.10, 6.22.

---

### 7.8. Zimowa Wydajność Pompy Ciepła i Defrost  *(dawne 6.8)*

  
**Skąd czerpie dane:**  
- Z modelu pompy ciepła (krzywa COP, typ, moc) z Rozdziału 5.  
- Z danych klimatycznych (temperatura, wilgotność) z Rozdziału 0.  
- Z ustawień defrostu (funkcja 1.14).  
- Z zapotrzebowania na ciepło (funkcja 5.2).  
  
**Gdzie ląduje:**  
- W module `heat_pump_winter_performance`.  
  
**Jak działa logika:**  
- System symuluje rzeczywistą pracę pompy ciepła w warunkach zimowych.  
- Uwzględnia:  
  - spadek COP przy niskiej temperaturze,  
  - czas trwania cykli odszraniania (defrost) i energię na nie zużywaną,  
  - przerwy w pracy pompy podczas defrostu, kiedy grzanie jest wstrzymane,  
  - wzrost zapotrzebowania na ciepło przy silnym mrozie.  
- Oblicza efektywny COP (uwzględniający defrost), a nie tylko katalogowy.  
- Sprawdza, czy pompa jest w stanie w ogóle wystartować przy –20°C (niektóre modele mają ograniczenia).  
  
**Efekt na ekranie:**  
- Wykres: COP katalogowy vs. COP rzeczywisty w funkcji temperatury.  
- Komunikat: *„Przy –15°C katalogowy COP to 2,8, ale po uwzględnieniu defrostu realny COP spada do 2,2. To podnosi zużycie prądu o 27%.”*  
- Alert: *„Twoja pompa ciepła nie pracuje poniżej –20°C – system będzie musiał korzystać z grzałek awaryjnych.”*  
  
**Migawka:** *„O co chodzi? W katalogu pompa wygląda pięknie. Zima weryfikuje te obietnice. Defrost to dodatkowy głód energii.”*  
  
**Powiązania:** Funkcja 1.14, 5.5, 6.1, 6.4.

---

### 7.9. Awaryjna Praca Agregatu w Mrozie  *(dawne 6.9)*

  
**Skąd czerpie dane:**  
- Z parametrów agregatu (rodzaj paliwa, moc, olej, model) z funkcji 1.19.  
- Z danych klimatycznych (minimalna temperatura, wilgotność) z Rozdziału 0.  
- Z ustawień autostartu i BMS (funkcja 3.26).  
- Z informacji o miejscu przechowywania agregatu (w pomieszczeniu, na zewnątrz).  
  
**Gdzie ląduje:**  
- W module `generator_cold_operation`.  
  
**Jak działa logika:**  
- System analizuje ryzyko związane z pracą agregatu w niskich temperaturach:  
  - **Parafinizacja diesla** – przy –20°C olej napędowy gęstnieje, co uniemożliwia rozruch.  
  - **Problemy z akumulatorem rozruchowym** – w mrozie traci pojemność.  
  - **Gęstnienie oleju silnikowego** – wymaga oleju zimowego.  
  - **Zamarzanie układu wydechowego** – wilgoć może zamarzać.  
- Sprawdza, czy agregat jest w stanie wystartować i pracować przy zadanej temperaturze.  
- Generuje zalecenia: stosowanie paliwa arktycznego, oleju 5W‑40, podgrzewacza bloku silnika, akumulatora rozruchowego AGM.  
- Symuluje zużycie paliwa i godziny pracy w scenariuszu awaryjnym.  
  
**Efekt na ekranie:**  
- Alert: *„Twój agregat na zwykłym dieslu nie wystartuje przy –15°C. Zastosuj paliwo arktyczne i olej 5W‑40.”*  
- Komunikat: *„Przy –20°C agregat będzie zużywał o 15% więcej paliwa i wymagał rozgrzania przed obciążeniem.”*  
  
**Migawka:** *„O co chodzi? Agregat też nie lubi mrozu. Jak go nie przygotujesz, to w najgorszym momencie zrobi strajk.”*  
  
**Powiązania:** Funkcja 1.19, 6.2, 6.36.

---

### 7.10. Analiza Albedo (Odbicie od śniegu)  *(dawne 6.10)*

  
**Skąd czerpie dane:**  
- Z lokalizacji i pokrywy śnieżnej (dane klimatyczne) z Rozdziału 0.  
- Z konfiguracji paneli (kąt, azymut, bifacjalność) z Rozdziału 2.  
- Z modelu przestrzennego działki (Rozdział 0) – powierzchnie odbijające światło.  
  
**Gdzie ląduje:**  
- W module `albedo_analysis`.  
  
**Jak działa logika:**  
- System wyznacza współczynnik odbicia światła od śniegu (albedo), który wynosi zwykle 0,7–0,9, czyli śnieg odbija 70–90% światła.  
- Oblicza dodatkową energię docierającą do paneli:  
  - dla paneli pionowych lub o stromym kącie – bardzo duży zysk,  
  - dla paneli bifacjalnych – zysk z tylnej strony,  
  - dla paneli na dachu – zysk z odbicia od śniegu przed budynkiem.  
- Porównuje produkcję z uwzględnieniem i bez uwzględnienia albedo.  
- Uwzględnia przeszkody i zacienienie.  
  
**Efekt na ekranie:**  
- Wykres: produkcja PV w śnieżny dzień z albedo i bez albedo.  
- Komunikat: *„Panele pionowe na ogrodzeniu zyskują dodatkowo 25% energii dzięki odbiciu od śniegu. To ratuje bilans zimowy.”*  
- Ostrzeżenie: *„Panele na dachu prawie nie korzystają z albedo, bo śnieg przed budynkiem szybko się brudzi.”*  
  
**Migawka:** *„O co chodzi? Śnieg działa jak lustro. Panele pionowe dostają światło i z góry, i z dołu.”*  
  
**Powiązania:** Funkcja 6.7, 6.21, 2.5, 2.4.

---

### 7.11. Bezwładność Cieplna Budynku (Czas do Zamarznięcia)  *(dawne 6.11)*

  
**Skąd czerpie dane:**  
- Z modelu termicznego budynku (Rozdział 5) – pojemność cieplna, izolacja, straty.  
- Z temperatury wewnętrznej początkowej.  
- Z temperatury zewnętrznej i prognozy pogody.  
  
**Gdzie ląduje:**  
- W module `thermal_inertia`.  
  
**Jak działa logika:**  
- System oblicza, jak długo budynek będzie utrzymywał ciepło po wyłączeniu ogrzewania.  
- Uwzględnia:  
  - pojemność cieplną ścian, podłóg, stropów,  
  - współczynnik strat ciepła (U),  
  - temperaturę startową wewnątrz (np. 21°C),  
  - temperaturę zewnętrzną (np. –20°C).  
- Wyznacza czas, po którym temperatura spadnie do 0°C i do poziomu zagrożenia zamarznięcia rur.  
- Pokazuje, ile czasu użytkownik ma na reakcję przed szkodami.  
  
**Efekt na ekranie:**  
- Wykres spadku temperatury wewnętrznej w czasie.  
- Komunikat: *„Przy –20°C i wyłączonym ogrzewaniu temperatura spadnie do 0°C po 8 godzinach. Rury zamarzną po 14 godzinach. Masz czas do 22:00.”*  
- Ostrzeżenie: *„Budynek o niskiej bezwładności cieplnej wychładza się bardzo szybko. Rozważ bufor ciepła.”*  
  
**Migawka:** *„O co chodzi? Masz przewagę, jeśli dom długo trzyma ciepło. To jak termos – im lepszy, tym wolniej stygnie.”*  
  
**Powiązania:** Funkcja 5.1, 5.2, 6.6, 6.26.

---

### 7.12. Analiza SPOF (Single Point of Failure)  *(dawne 6.12)*

  
**Skąd czerpie dane:**  
- Z konfiguracji systemu (lista komponentów: BMS, falownik, bezpieczniki, MPPT, pompy, czujniki).  
- Z mapy połączeń elektrycznych i hydraulicznych.  
- Z funkcji zabezpieczeń (Rozdział 4).  
- Z listy najważniejszych odbiorników (funkcja 1.1).  
  
**Gdzie ląduje:**  
- W module `spof_analysis`.  
  
**Jak działa logika:**  
- System identyfikuje pojedyncze punkty awarii – elementy, których uszkodzenie powoduje całkowite zatrzymanie systemu.  
- Sprawdza, czy istnieje redundancja dla kluczowych podsystemów:  
  - BMS: czy jest możliwość podłączenia dwóch BMS?  
  - Falownik: czy jest mniejszy falownik awaryjny?  
  - Bezpiecznik główny: czy są zapasowe?  
  - Pompa obiegowa: czy jest druga pompa lub obejście?  
- Symuluje awarię każdego pojedynczego komponentu i ocenia skutki.  
- Generuje listę elementów, które są największym ryzykiem.  
  
**Efekt na ekranie:**  
- Tabela: *„Krytyczne SPOF: BMS (brak obejścia), bezpiecznik główny (brak zapasowego), pompa ciepła (brak grzałki awaryjnej).”*  
- Alert: *„Jeśli padnie BMS, cały system wyłączy się w 10 sekund. Zainstaluj drugi BMS lub przynajmniej stycznik awaryjny.”*  
- Schemat zaznaczonych punktów krytycznych.  
  
**Migawka:** *„O co chodzi? Jeden element może pociągnąć cały system na dno. Trzeba go znaleźć i dać mu kolegę.”*  
  
**Powiązania:** Funkcja 4.2, 4.13, 3.7, 6.14.

---

### 7.13. Test Mroźnego Startu Baterii  *(dawne 6.13)*

  
**Skąd czerpie dane:**  
- Z temperatury ogniw (BMS), pojemności baterii, prądu ładowania.  
- Z mocy grzałek BMS i dostępnej energii.  
- Z prognozy pogody (kiedy będzie słońce lub agregat).  
  
**Gdzie ląduje:**  
- W module `battery_cold_start`.  
  
**Jak działa logika:**  
- System symuluje proces nagrzewania baterii z temperatury ujemnej (np. –20°C) do minimalnej temperatury ładowania (0°C).  
- Oblicza:  
  - czas nagrzewania przy danej mocy grzałek,  
  - ilość energii potrzebnej do nagrzania ogniw,  
  - jak długo trzeba czekać, zanim bateria będzie mogła przyjąć ładowanie.  
- Sprawdza, czy dostępna energia (z agregatu, z paneli) wystarczy do zasilenia grzałek przed ładowaniem.  
- Uwzględnia straty ciepła do otoczenia.  
  
**Efekt na ekranie:**  
- Wykres temperatury ogniw w czasie nagrzewania.  
- Komunikat: *„Przy –20°C i grzałkach 200 W nagrzanie baterii do 0°C zajmie 3 godziny i zużyje 0,6 kWh. Dopiero potem zacznie się ładowanie.”*  
- Ostrzeżenie: *„Bez grzałek bateria nie przyjmie ładowania przy mrozie – zostaniesz bez prądu.”*  
  
**Migawka:** *„O co chodzi? Zanim nalejesz paliwo do zamarzniętego silnika, musisz go rozmrozić. Tak samo z baterią.”*  
  
**Powiązania:** Funkcja 3.5, 3.13, 6.4, 6.14.

---

### 7.14. Ocena Ryzyka i Współczynnik Bezpieczeństwa Zimowego  *(dawne 6.14)*

  
**Skąd czerpie dane:**  
- Z wszystkich symulacji zimowych (6.1, 6.4, 6.7, 6.8, 6.9, 6.11, 6.12 itd.).  
- Z parametrów systemu i jego komponentów.  
- Z danych klimatycznych i prognoz.  
  
**Gdzie ląduje:**  
- W module `winter_safety_score`.  
  
**Jak działa logika:**  
- System wylicza procentowy wskaźnik bezpieczeństwa zimowego (np. 0–100%).  
- Składa się z kilku składowych:  
  - **Pokrycie energetyczne**: stosunek produkcji do zapotrzebowania w najgorszym miesiącu.  
  - **Czas autonomii**: ile dni system wytrzyma bez słońca.  
  - **Odporność na awarie**: brak pojedynczych punktów awarii.  
  - **Czas reakcji na zamarznięcie**: ile czasu użytkownik ma na interwencję.  
  - **Zapas mocy agregatu**: czy agregat pokryje deficyt.  
- Każdej składowej przypisuje wagę, sumuje i przelicza na wynik procentowy.  
- Generuje listę „wąskich gardeł” – elementów, które obniżają ocenę.  
  
**Efekt na ekranie:**  
- Duży wskaźnik: *„Współczynnik Bezpieczeństwa Zimowego: 74% (dobrze, ale są słabe punkty).”*  
- Lista: *„Słabe punkty: brak grzałek BMS, za mała bateria, agregat bez paliwa arktycznego.”*  
- Rekomendacje poprawy z szacowanym wzrostem wskaźnika.  
  
**Migawka:** *„O co chodzi? To ocena z egzaminu. Pokazuje, czy system zda zimę, czy będzie poprawka.”*  
  
**Powiązania:** Funkcja 6.3, 6.12, 6.1, 6.4.

---

### 7.15. Symulacja zamarzania rur i instalacji wodnej (Freeze Risk Assessment)  *(dawne 6.15)*

  
**Skąd czerpie dane:**  
- Z modelu przestrzennego budynku (Rozdział 0) – lokalizacja rur, ściany zewnętrzne, strych, piwnica.  
- Z temperatury wewnętrznej i zewnętrznej.  
- Z izolacji rur i parametrów ogrzewania.  
- Z prognozy pogody.  
  
**Gdzie ląduje:**  
- W module `pipe_freeze_risk`.  
  
**Jak działa logika:**  
- System identyfikuje wszystkie odcinki rur narażone na zamarznięcie.  
- Dla każdego odcinka oblicza:  
  - czas do osiągnięcia 0°C,  
  - ryzyko pęknięcia przy zamarznięciu,  
  - wpływ na system (np. utrata wody, zalanie).  
- Uwzględnia miejsca, gdzie rury są prowadzone przez nieogrzewane przestrzenie.  
- Symuluje scenariusz awarii ogrzewania i sprawdza, które rury zamarzną jako pierwsze.  
- Proponuje rozwiązania: dodatkowa izolacja, kable grzewcze, obniżenie punktu zamarzania, cyrkulacja wody.  
  
**Efekt na ekranie:**  
- Mapa rur z zaznaczonymi strefami ryzyka.  
- Komunikat: *„Rura zasilająca w strychu zamarznie po 6 godzinach przy –20°C. Zastosuj kabel grzewczy 10 W/m lub izolację 50 mm.”*  
- Alert: *„Rura w ścianie zewnętrznej kuchni jest narażona – bez ogrzewania zamarznie po 4 godzinach.”*  
  
**Migawka:** *„O co chodzi? Zamarznięta rura to pęknięta rura. Trzeba wiedzieć, gdzie jest największe ryzyko, zanim będzie za późno.”*  
  
**Powiązania:** Funkcja 6.6, 6.11, 5.1, 6.37.

---

### 7.16. Analiza obciążenia grzałek dachowych i rynnowych (Ice Dam Prevention)  *(dawne 6.16)*

  
**Skąd czerpie dane:**  
- Z modelu dachu i rynien (Rozdział 0) – wymiary, kąty, długości rynien.  
- Z danych klimatycznych (opady śniegu, temperatura, wilgotność) z Rozdziału 0.  
- Z parametrów kabli grzewczych (moc na metr, sposób montażu) z bazy produktów.  
  
**Gdzie ląduje:**  
- W module `ice_dam_prevention`.  
  
**Jak działa logika:**  
- System analizuje ryzyko tworzenia się zatorów lodowych (ice dams) na dachu i w rynnach.  
- Oblicza, które strefy dachu są najbardziej narażone (np. kosze, strefy przy rynnach, przejścia dachowe).  
- Dobiera kable grzewcze do rynien i rur spustowych, a także do krawędzi dachu.  
- Oblicza całkowitą moc grzałek i zużycie energii w sezonie zimowym.  
- Symuluje, jak praca grzałek wpływa na bilans energetyczny off-gridu.  
- Ostrzega, że grzałki dachowe to duże obciążenie, które może zdestabilizować system zimą.  
  
**Efekt na ekranie:**  
- Schemat dachu z zaznaczonymi strefami grzewczymi.  
- Komunikat: *„Rynny o długości 12 m wymagają kabla 30 W/m, łącznie 360 W. Przy pracy 6 h/dobę zużyjesz 2,16 kWh/dobę.”*  
- Ostrzeżenie: *„Grzałki dachowe mogą obciążyć system bardziej niż pompa ciepła – sprawdź, czy masz zapas mocy.”*  
  
**Migawka:** *„O co chodzi? Zamarznięte rynny to ciężar i zniszczenia. Grzałki ratują dach, ale pożerają prąd.”*  
  
**Powiązania:** Funkcja 6.14, 6.4, 2.5.

---

### 7.17. Test sztywnienia izolacji i połączeń w niskich temperaturach  *(dawne 6.17)*

  
**Skąd czerpie dane:**  
- Z materiałów izolacji kabli, osłon, złączek i obudów.  
- Z minimalnej temperatury pracy podanej przez producentów.  
- Z lokalizacji i spodziewanych mrozów (Rozdział 0).  
  
**Gdzie ląduje:**  
- W module `cold_insulation_test`.  
  
**Jak działa logika:**  
- System sprawdza, czy użyte materiały wytrzymają niskie temperatury bez pękania, sztywnienia i kruszenia.  
- Uwzględnia:  
  - PVC: sztywnieje i pęka poniżej –10°C,  
  - XLPE: wytrzymuje do –40°C,  
  - Guma: zachowuje elastyczność,  
  - Aluminium: skurcz przy mrozie może poluzować połączenia.  
- Wskazuje miejsca, gdzie zalecane są materiały mrozoodporne.  
- Generuje listę kontrolną połączeń, które należy ponownie dokręcić po pierwszym mrozie.  
  
**Efekt na ekranie:**  
- Tabela materiałów z temperaturą krytyczną.  
- Alert: *„Twoje złączki PVC w ziemi pękną przy –15°C. Wymień na XLPE lub gumowe.”*  
- Przypomnienie: *„Po mrozie sprawdź wszystkie śruby i zaciski – skurcz metalu mógł je poluzować.”*  
  
**Migawka:** *„O co chodzi? Mróz nie tylko chłodzi, ale i ściska. Materiały kurczą się i pękają. Trzeba używać takich, które to znoszą.”*  
  
**Powiązania:** Funkcja 4.38, 4.20, 4.39.

---

### 7.18. Scenariusz „Wiecznej mgły i szadzi” (Freezing Fog)  *(dawne 6.18)*

  
**Skąd czerpie dane:**  
- Z danych klimatycznych (mgła, wilgotność, temperatura) z Rozdziału 0.  
- Z konfiguracji paneli (kąt, azymut, typ) z Rozdziału 2.  
- Z danych o szadzi i osadach atmosferycznych.  
  
**Gdzie ląduje:**  
- W module `freezing_fog_scenario`.  
  
**Jak działa logika:**  
- System symuluje ekstremalne warunki, w których przez kilka dni utrzymuje się gęsta mgła i szadź osadza się na panelach.  
- Oblicza, jak osadzanie szadzi zmniejsza przezroczystość i produkcję PV.  
- Uwzględnia, że szadź może utrzymywać się długo, ponieważ mgła nie pozwala na topnienie.  
- Szacuje straty energii w okresie 3–7 dni.  
- Porównuje to ze scenariuszem czystego śniegu (który szybciej się zsuwa lub topnieje).  
  
**Efekt na ekranie:**  
- Wykres produkcji PV w czasie mgły i szadzi.  
- Komunikat: *„Po 48 h mgły i szadzi produkcja spadnie do 5% nominalnej. System będzie musiał polegać na baterii i agregacie.”*  
- Ostrzeżenie: *„Szadź jest gorsza od śniegu – nie zsuwa się sama i blokuje światło.”*  
  
**Migawka:** *„O co chodzi? Mgła to cichy zabójca paneli. Zamarza na nich jak lukier na szybie.”*  
  
**Powiązania:** Funkcja 6.7, 6.4, 2.3.

---

### 7.19. Symulacja nierównomiernego śniegu na połaciach (rozkład śniegu)  *(dawne 6.20)*

  
**Skąd czerpie dane:**  
- Z modelu dachu (kąty, kierunki, kosze, przeszkody) z Rozdziału 0.  
- Z danych o wietrze i opadach śniegu (Rozdział 0).  
- Z konfiguracji paneli PV (Rozdział 2).  
  
**Gdzie ląduje:**  
- W module `snow_distribution`.  
  
**Jak działa logika:**  
- System symuluje, jak wiatr przenosi śnieg i osadza go nierównomiernie na różnych połaciach.  
- Uwzględnia:  
  - stronę zawietrzną (gdzie śnieg się gromadzi),  
  - krawędzie dachu (gdzie tworzą się zaspy),  
  - kosze i doliny (gdzie śnieg się zasysa).  
- Oblicza, które panele będą zasypane jako pierwsze i na jak długo.  
- Wskazuje ryzyko nierównomiernej produkcji PV w różnych stringach.  
  
**Efekt na ekranie:**  
- Mapa 3D dachu z zaznaczonymi strefami zasp.  
- Komunikat: *„Panele na południowej połaci są chronione przed wiatrem, ale północna strona będzie zasypywana. String północny straci produkcję na 5 dni.”*  
- Ostrzeżenie: *„Nierównomierne zasypanie może wywołać różnice napięć między stringami.”*  
  
**Migawka:** *„O co chodzi? Wiatr rozkłada śnieg jak piasek na pustyni. Trzeba wiedzieć, gdzie utworzy zaspy.”*  
  
**Powiązania:** Funkcja 6.7, 2.5, 6.21.

---

### 7.20. Test wydajności paneli bifacjalnych w śniegu (Bifacial Snow Boost)  *(dawne 6.21)*

  
**Skąd czerpie dane:**  
- Z typu paneli (bifacjalne, współczynnik bifacjalności) z Rozdziału 2.  
- Z danych o albedo (funkcja 6.10).  
- Z konfiguracji montażu (wysokość nad gruntem, kąt, odległość od powierzchni odbijającej).  
  
**Gdzie ląduje:**  
- W module `bifacial_snow_boost`.  
  
**Jak działa logika:**  
- System oblicza dodatkowy uzysk paneli bifacjalnych dzięki odbiciu światła od śniegu.  
- Uwzględnia:  
  - wysokość paneli nad gruntem (im wyżej, tym więcej odbitego światła),  
  - kąt nachylenia (panele pionowe zyskują najwięcej),  
  - odległość od powierzchni śniegu.  
- Porównuje z panelami monofacjalnymi.  
- Szacuje procentowy wzrost produkcji w śnieżne dni.  
  
**Efekt na ekranie:**  
- Wykres produkcji monofacjalne vs. bifacjalne w śnieżny dzień.  
- Komunikat: *„Panele bifacjalne przy 30 cm śniegu zyskują dodatkowo 20% produkcji. Przy panelach pionowych zysk rośnie do 30%.”*  
- Ostrzeżenie: *„Zysk z bifacjalności maleje, gdy śnieg jest brudny lub panele zbyt nisko.”*  
  
**Migawka:** *„O co chodzi? Bifacjalne panele mają oczy z tyłu. Śnieg świeci im z dołu.”*  
  
**Powiązania:** Funkcja 6.10, 2.4, 2.5, 6.20.

---

### 7.21. Strategia maksymalizacji ładowania w krótkim oknie słonecznym (Solar Window Priority)  *(dawne 6.22)*

  
**Skąd czerpie dane:**  
- Z danych o produkcji PV w ciągu dnia (Rozdział 2).  
- Z zapotrzebowania na energię (Rozdział 1).  
- Z pojemności baterii i jej aktualnego SoC (Rozdział 3).  
- Z prognozy pogody (funkcja 2.2).  
  
**Gdzie ląduje:**  
- W module `solar_window_priority`.  
  
**Jak działa logika:**  
- System planuje wykorzystanie krótkiego zimowego okna słonecznego (np. 9:00–15:00).  
- Priorytetowo kieruje energię na:  
  1. **Baterię** – aby naładować magazyn przed nocą.  
  2. **Bojler C.W.U.** – gdy bateria jest naładowana powyżej 80%.  
  3. **Grzałki BMS** – jeśli bateria wymaga ogrzania do ładowania.  
  4. **Odbiorniki nadwyżkowe** – dopiero na końcu.  
- Oblicza, ile energii uda się zgromadzić w tym oknie.  
- Sugeruje przesunięcie ciężkich odbiorników na godziny słoneczne.  
  
**Efekt na ekranie:**  
- Harmonogram dnia z optymalnym wykorzystaniem energii.  
- Komunikat: *„W oknie 9:00–15:00 wyprodukujesz 4,5 kWh. Naładujesz baterię do 65% i zagrzejesz bojler do 50°C. Pralkę włącz dopiero jutro.”*  
- Alert: *„Nie marnuj energii na grzanie wody w nocy – wykorzystaj słońce w dzień.”*  
  
**Migawka:** *„O co chodzi? Zimą słońce jest jak krótka wizyta gościa. Trzeba wykorzystać każdą minutę.”*  
  
**Powiązania:** Funkcja 3.14, 3.36, 6.10, 1.2.

---

### 7.22. Analiza pracy agregatu w trybie ciągłym (Continuous Generator Duty)  *(dawne 6.23)*

  
**Skąd czerpie dane:**  
- Z parametrów agregatu (moc, paliwo, zużycie paliwa, system chłodzenia) z funkcji 1.19.  
- Z danych klimatycznych (temperatura, wilgotność).  
- Z zapotrzebowania na energię (Rozdział 1).  
- Z instrukcji producenta (maksymalny czas pracy ciągłej).  
  
**Gdzie ląduje:**  
- W module `generator_continuous_duty`.  
  
**Jak działa logika:**  
- System sprawdza, czy agregat może pracować non-stop przez dłuższy czas (np. 24–72 h).  
- Uwzględnia:  
  - maksymalny czas pracy ciągłej (niektóre agregaty wymagają przerw co 8–12 h),  
  - konieczność uzupełniania paliwa,  
  - wymianę oleju po określonej liczbie godzin,  
  - przegrzewanie przy długiej pracy.  
- Symuluje scenariusz, w którym agregat jest jedynym źródłem energii przez tydzień.  
- Oblicza zużycie paliwa, koszt i wymagane przerwy serwisowe.  
  
**Efekt na ekranie:**  
- Tabela: *„Twój agregat może pracować ciągle 8 h, potem wymaga 1 h przerwy. W scenariuszu tygodniowym przepracuje 120 h, zużyje 180 l paliwa i wymaga 2 wymian oleju.”*  
- Ostrzeżenie: *„Nie masz zapasowego agregatu? Przerwa serwisowa może oznaczać brak prądu przez godzinę.”*  
  
**Migawka:** *„O co chodzi? Agregat to nie perpetuum mobile. Też się męczy i chce pić.”*  
  
**Powiązania:** Funkcja 6.9, 6.2, 1.19, 6.36.

---

### 7.23. Test turbiny wiatrowej jako wsparcie zimowe  *(dawne 6.24)*

  
**Skąd czerpie dane:**  
- Z parametrów turbiny wiatrowej (moc, średnica, krzywa mocy) – jeśli użytkownik ją posiada.  
- Z danych wiatrowych dla lokalizacji (średnie prędkości, porywy) z Rozdziału 0.  
- Z zapotrzebowania na energię (Rozdział 1) i stanu baterii (Rozdział 3).  
  
**Gdzie ląduje:**  
- W module `wind_turbine_winter_support`.  
  
**Jak działa logika:**  
- System symuluje produkcję energii z turbiny w miesiącach zimowych.  
- Uwzględnia, że zimą wiatry bywają silniejsze i bardziej regularne.  
- Oblicza, ile energii turbina może dostarczyć w dzień i w nocy, gdy PV nie pracuje.  
- Sprawdza, czy turbina jest w stanie pokryć część deficytu zimowego i odciążyć baterię.  
- Uwzględnia ryzyko oblodzenia łopat i konieczność ogrzewania turbiny (jeśli dotyczy).  
  
**Efekt na ekranie:**  
- Wykres produkcji PV + turbina w miesiącach zimowych.  
- Komunikat: *„Turbina 1 kW przy średniej prędkości wiatru 6 m/s dostarczy 3 kWh/dobę. To pokryje 25% twojego deficytu styczniowego.”*  
- Ostrzeżenie: *„Łopaty turbiny mogą oblodzić się przy –10°C i wysokiej wilgotności. Sprawdź system ogrzewania łopat.”*  
  
**Migawka:** *„O co chodzi? Zimą słońca mało, ale wiatr wieje. Turbina to dodatkowe źródło, które pracuje, gdy panele śpią.”*  
  
**Powiązania:** Funkcja 6.1, 6.2, 2.10, 1.19.

---

### 7.24. Symulacja zapotrzebowania na ciepło przy silnym wietrze (Wind Chill Effect)  *(dawne 6.26)*

  
**Skąd czerpie dane:**  
- Z danych wiatrowych (prędkość, kierunek) z Rozdziału 0.  
- Z modelu termicznego budynku (współczynniki strat, nieszczelności) z Rozdziału 5.  
- Z temperatury zewnętrznej.  
  
**Gdzie ląduje:**  
- W module `wind_chill_effect`.  
  
**Jak działa logika:**  
- System wyznacza temperaturę odczuwalną (wind chill) na podstawie temperatury i prędkości wiatru.  
- Uwzględnia dodatkowe straty ciepła przez nieszczelności w budynku przy silnych podmuchach.  
- Oblicza wzrost zapotrzebowania na ogrzewanie w dni wietrzne.  
- Porównuje z zapotrzebowaniem przy bezwietrznej pogodzie.  
- Wskazuje, jak silny wiatr wpłynie na bilans energetyczny.  
  
**Efekt na ekranie:**  
- Wykres: zapotrzebowanie na ciepło przy różnej prędkości wiatru.  
- Komunikat: *„Przy –10°C i wietrze 40 km/h temperatura odczuwalna to –20°C. Straty ciepła wzrosną o 35%. System będzie potrzebował dodatkowo 2 kWh/dobę.”*  
- Ostrzeżenie: *„Nieszczelności wokół okien i drzwi to główna przyczyna ucieczki ciepła.”*  
  
**Migawka:** *„O co chodzi? Wiatr wywiewa ciepło z domu, nawet jak termometr nie pokazuje bardzo niskiej temperatury.”*  
  
**Powiązania:** Funkcja 5.1, 6.1, 6.11.

---

### 7.25. Test zamarzania rur zewnętrznych i instalacji na strychu (Pipe Freeze Risk)  *(dawne 6.27)*

  
**Skąd czerpie dane:**  
- Z modelu budynku – lokalizacja rur zewnętrznych, w strychu, w ścianach zewnętrznych.  
- Z izolacji tych rur i temperatury panującej w tych miejscach.  
- Z prognozy pogody.  
  
**Gdzie ląduje:**  
- W module `external_pipe_freeze`.  
  
**Jak działa logika:**  
- System identyfikuje rury, które są najbardziej narażone na zamarznięcie, bo przechodzą przez nieogrzewane przestrzenie.  
- Dla każdego odcinka oblicza czas do zamarznięcia przy zadanej temperaturze.  
- Uwzględnia, że rury w strychu wychładzają się szybciej niż te w ziemi.  
- Symuluje, jak brak ogrzewania budynku wpłynie na te rury.  
- Proponuje rozwiązania: kabla grzewcze, dodatkowa izolacja, spuszczanie wody z instalacji.  
  
**Efekt na ekranie:**  
- Mapa z zaznaczonymi zagrożonymi odcinkami.  
- Komunikat: *„Rura w strychu zamarznie po 4 godzinach przy –15°C. Zastosuj kabel grzewczy 15 W/m.”*  
- Ostrzeżenie: *„Rura zewnętrzna do ogrodu musi być opróżniona przed zimą.”*  
  
**Migawka:** *„O co chodzi? Nie wszystkie rury są w cieple. Trzeba znaleźć te, które marzną.”*  
  
**Powiązania:** Funkcja 6.15, 6.37, 5.1.

---

### 7.26. Strategia magazynowania energii cieplnej przed nadejściem frontu (Pre‑Heat Thermal Storage)  *(dawne 6.28)*

  
**Skąd czerpie dane:**  
- Z prognozy pogody (nadchodzący front mrozowy) z Rozdziału 0.  
- Z modelu termicznego budynku (pojemność cieplna) z Rozdziału 5.  
- Z pojemności bojlera C.W.U. i możliwości grzania (funkcja 1.2).  
- Z dostępnej energii z PV i baterii.  
  
**Gdzie ląduje:**  
- W module `pre_heat_thermal_storage`.  
  
**Jak działa logika:**  
- System wykrywa nadchodzący spadek temperatury (np. za 2 dni –20°C).  
- Zaleca przegrzanie budynku przed nadejściem mrozu, aby zgromadzić bufor ciepła.  
- Oblicza, o ile stopni podnieść temperaturę wewnętrzną i ile energii to wymaga.  
- Planuje ładowanie bojlera do wyższej temperatury (np. 70°C zamiast 50°C), aby mieć zapas C.W.U.  
- Uwzględnia dostępną energię z PV – grzanie wykonuje się w dzień, gdy jest słońce.  
  
**Efekt na ekranie:**  
- Harmonogram przygotowania do frontu.  
- Komunikat: *„Jutro w dzień podnieś temperaturę w domu do 23°C i zagrzej bojler do 70°C. Zużyjesz 8 kWh, ale zyskasz 12 godzin buforu cieplnego.”*  
- Ostrzeżenie: *„Nie wykonuj grzania w nocy z baterii – to zrujnuje magazyn energii.”*  
  
**Migawka:** *„O co chodzi? To jak naładowanie powerbanku przed wyjazdem. Ładuj ciepło, zanim przyjdzie mróz.”*  
  
**Powiązania:** Funkcja 1.2, 6.22, 5.1, 3.14.

---

### 7.27. Analiza wpływu niskich temperatur na elektronikę (Cold Electronics Stress)  *(dawne 6.29)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń elektronicznych (BMS, falownik, czujniki, wyświetlacze) i ich minimalnych temperatur pracy.  
- Z lokalizacji i spodziewanych mrozów.  
- Z umiejscowienia urządzeń (w budynku, garażu, na zewnątrz).  
  
**Gdzie ląduje:**  
- W module `cold_electronics_stress`.  
  
**Jak działa logika:**  
- System sprawdza, które urządzenia mogą przestać działać przy –20°C.  
- Uwzględnia:  
  - wyświetlacze LCD – spowalniają lub gasną,  
  - BMS – może nie wystartować,  
  - czujniki temperatury – mogą podawać błędne odczyty,  
  - przetwornice DC/DC – spadek sprawności.  
- Symuluje awarię elektroniki w najzimniejszy dzień.  
- Zaleca przeniesienie wrażliwych urządzeń do ogrzewanego pomieszczenia lub montaż grzałek.  
  
**Efekt na ekranie:**  
- Tabela urządzeń z minimalną temperaturą pracy i ryzykiem.  
- Alert: *„Twój BMS ma minimalną temperaturę pracy –10°C. W garażu przy –20°C może nie wystartować. Przenieś go do piwnicy.”*  
- Komunikat: *„Czujnik zewnętrzny przy –30°C podaje błąd ±3°C.”*  
  
**Migawka:** *„O co chodzi? Elektronika też marznie. Jak jest za zimno, to nie myśli.”*  
  
**Powiązania:** Funkcja 3.13, 4.4, 6.12.

---

### 7.28. Symulacja „bez wentylacji” (Frozen Rekuperation / Ventilation Failure)  *(dawne 6.30)*

  
**Skąd czerpie dane:**  
- Z parametrów wentylacji mechanicznej (rekuperacji) z Rozdziału 5.  
- Z danych klimatycznych (temperatura, wilgotność, oblodzenie).  
- Z modelu budynku (szczelność, wilgotność wewnętrzna).  
  
**Gdzie ląduje:**  
- W module `frozen_ventilation`.  
  
**Jak działa logika:**  
- System symuluje, co się stanie, gdy rekuperacja zamarznie lub zostanie wyłączona.  
- Uwzględnia:  
  - wzrost wilgotności wewnętrznej,  
  - ryzyko pleśni i grzybów,  
  - spadek jakości powietrza,  
  - wzrost zapotrzebowania na ogrzewanie (bo wentylacja bez odzysku traci ciepło).  
- Sprawdza, czy urządzenie ma funkcję ochrony przed zamarzaniem (bypass, grzałka wstępna).  
- Zaleca okresowe sprawdzanie i rozmrażanie.  
  
**Efekt na ekranie:**  
- Alert: *„Rekuperacja zamarznie przy –15°C i wysokiej wilgotności. Produkcja ciepła spadnie o 30%, a wilgotność wzrośnie do 70%.”*  
- Komunikat: *„Zastosuj grzałkę wstępną 200 W lub wymiennik z bypassem.”*  
  
**Migawka:** *„O co chodzi? Wentylacja to płuca domu. Jak zamarzną, dom się dusi i pleśnieje.”*  
  
**Powiązania:** Funkcja 5.3, 5.4, 6.11.

---

### 7.29. Symulacja zamarzania szamba i oczyszczalni przydomowej (Blackwater Freeze Risk)  *(dawne 6.31)*

  
**Skąd czerpie dane:**  
- Z lokalizacji szamba/oczyszczalni (głębokość, izolacja, rodzaj zbiornika) z Rozdziału 0.  
- Z temperatury gruntu i powietrza.  
- Z przepływu ścieków (liczba domowników, zużycie wody).  
  
**Gdzie ląduje:**  
- W module `blackwater_freeze_risk`.  
  
**Jak działa logika:**  
- System ocenia ryzyko zamarznięcia szamba lub oczyszczalni.  
- Uwzględnia:  
  - głębokość posadowienia (im głębiej, tym cieplej),  
  - izolację zbiornika,  
  - przepływ ścieków (ciepło z odpływu),  
  - temperaturę zewnętrzną.  
- Oblicza, jak długo system może wytrzymać przy braku przepływu i silnym mrozie.  
- Symuluje skutki zamarznięcia (zablokowanie odpływu, cofka, uszkodzenie).  
  
**Efekt na ekranie:**  
- Wykres temperatury w zbiorniku w funkcji temperatury zewnętrznej.  
- Alert: *„Twoje szambo jest płycej niż 1 m i nieizolowane. Przy –20°C zamarznie po 5 dniach. Zastosuj izolację lub podgrzewanie.”*  
- Komunikat: *„Przy ciągłym przepływie ścieków ryzyko zamarznięcia jest mniejsze.”*  
  
**Migawka:** *„O co chodzi? Toaleta też może zamarznąć. Jak nie zadbasz, to kibel zamieni się w lodowisko.”*  
  
**Powiązania:** Funkcja 6.15, 6.11, 1.1.

---

### 7.30. Test wydajności pomp i zaworów w niskich temperaturach (Pump & Valve Cold Performance)  *(dawne 6.32)*

  
**Skąd czerpie dane:**  
- Z listy pomp i zaworów w systemie (pompa ciepła, pompa obiegowa, pompa głębinowa, zawory rozprężne, siłowniki).  
- Z minimalnych temperatur pracy podanych przez producentów.  
- Z lokalizacji urządzeń (w budynku, w garażu, na zewnątrz).  
  
**Gdzie ląduje:**  
- W module `pump_valve_cold_performance`.  
  
**Jak działa logika:**  
- System sprawdza, które pompy i zawory mogą działać wolniej lub zablokować się przy mrozie.  
- Uwzględnia:  
  - gęstnienie oleju w pompach,  
  - sztywnienie uszczelek,  
  - zamarzanie zaworów zewnętrznych,  
  - spadek ciśnienia w instalacji.  
- Symuluje rozruch pompy przy –20°C i ocenia ryzyko przeciążenia silnika.  
- Zaleca stosowanie pomp z oznaczeniem mrozoodpornym lub montaż w ogrzewanym pomieszczeniu.  
  
**Efekt na ekranie:**  
- Tabela urządzeń z ryzykiem awarii.  
- Alert: *„Pompa cyrkulacyjna w garażu może zablokować się przy –15°C. Zastosuj pompę z uszczelnieniem mrozoodpornym.”*  
- Komunikat: *„Zawór zewnętrzny do wody ogrodowej musi być opróżniony przed zimą.”*  
  
**Migawka:** *„O co chodzi? Pompy i zawory w mrozie stają się leniwe. Trzeba je przygotować, żeby nie zablokowały systemu.”*  
  
**Powiązania:** Funkcja 6.27, 5.5, 1.1.

---

### 7.31. Strategia „Survival Mode” dla trybu Live zimą (Live Winter Survival Mode)  *(dawne 6.33)*

  
**Skąd czerpie dane:**  
- Z aktualnego SoC baterii, produkcji PV, temperatury wewnętrznej i zewnętrznej.  
- Z listy odbiorników i ich priorytetów (funkcja 1.20).  
- Z ustawień trybu live (Rozdział 7).  
  
**Gdzie ląduje:**  
- W module `winter_survival_mode`.  
  
**Jak działa logika:**  
- System przełącza się w tryb minimalnego zużycia energii przez sterowniki i urządzenia pomocnicze.  
- Wyłącza zbędne funkcje: wyświetlacze, podświetlenie, Bluetooth, Wi‑Fi (opcjonalnie), pompy cyrkulacyjne (w odstępach).  
- Utrzymuje tylko krytyczne odbiory: ogrzewanie, pompy wody, BMS, wentylację minimalną.  
- Pokazuje na ekranie tylko najważniejsze parametry, aby użytkownik widział, co się dzieje.  
  
**Efekt na ekranie:**  
- Przełącznik: *„Włącz Survival Mode”*.  
- Komunikat: *„Survival Mode aktywny. Zużycie własne systemu spadło o 35%. Pozostały czas pracy: 11 godzin.”*  
- Ostrzeżenie: *„W tym trybie dostęp do internetu może być wyłączony.”*  
  
**Migawka:** *„O co chodzi? Gdy energii jest mało, system sam się odchudza, żeby przetrwać noc.”*  
  
**Powiązania:** Funkcja 7.1, 1.20, 6.6.

---

### 7.32. Symulacja obciążenia dachu lodem i śniegiem (Roof Ice & Snow Load)  *(dawne 6.34)*

  
**Skąd czerpie dane:**  
- Z modelu dachu (kąt, powierzchnia, konstrukcja) z Rozdziału 0.  
- Z danych o opadach śniegu i temperaturze z Rozdziału 0.  
- Z norm budowlanych (obciążenie śniegiem i lodem).  
  
**Gdzie ląduje:**  
- W module `roof_ice_snow_load`.  
  
**Jak działa logika:**  
- System oblicza ciężar śniegu i lodu na dachu.  
- Uwzględnia:  
  - strefę śniegową,  
  - kąt dachu (przy małych kątach śnieg zalega dłużej),  
  - zaspy i nawisy śnieżne,  
  - lód z topnienia i zamarzania.  
- Porównuje z dopuszczalnym obciążeniem konstrukcji.  
- Ostrzega, gdy ciężar zbliża się do granicy bezpieczeństwa.  
  
**Efekt na ekranie:**  
- Wykres obciążenia dachu w czasie.  
- Alert: *„Na dachu płaskim zalega 120 kg/m² śniegu. Dopuszczalne obciążenie to 150 kg/m². Zbliżasz się do granicy!”*  
- Komunikat: *„Zalecane odśnieżenie dachu, gdy warstwa śniegu przekroczy 50 cm.”*  
  
**Migawka:** *„O co chodzi? Śnieg jest cięższy, niż się wydaje. Dach może nie wytrzymać.”*  
  
**Powiązania:** Funkcja 6.7, 6.20, 2.5.

---

### 7.33. Analiza zamarzania gruntu przy instalacjach zewnętrznych (Ground Frost Penetration)  *(dawne 6.35)*

  
**Skąd czerpie dane:**  
- Z lokalizacji (strefa przemarzania gruntu, głębokość przemarzania) z Rozdziału 0.  
- Z parametrów gruntu (rodzaj, wilgotność).  
- Z lokalizacji przewodów, uziomów, fundamentów konstrukcji.  
  
**Gdzie ląduje:**  
- W module `ground_frost_penetration`.  
  
**Jak działa logika:**  
- System oblicza głębokość przemarzania gruntu dla danej lokalizacji.  
- Sprawdza, czy przewody w ziemi, uziomy i fundamenty konstrukcji są poniżej strefy przemarzania.  
- Uwzględnia, że woda w gruncie zamarza i zwiększa objętość, co może wypychać konstrukcje i uszkadzać przewody.  
- Zaleca odpowiednią głębokość układania kabli i rur.  
  
**Efekt na ekranie:**  
- Schemat głębokości przemarzania z zaznaczonymi instalacjami.  
- Alert: *„Twój kabel ziemny jest na głębokości 40 cm, a strefa przemarzania to 80 cm. Zamarzający grunt może go uszkodzić.”*  
- Komunikat: *„Przewody wodociągowe układaj minimum 20 cm poniżej strefy przemarzania.”*  
  
**Migawka:** *„O co chodzi? Ziemia też zamarza i pęcznieje. Trzeba kłaść instalacje poniżej mrozu.”*  
  
**Powiązania:** Funkcja 4.38, 6.15, 0.1.

---

### 7.34. Test długotrwałego postoju agregatu w mrozie (Generator Cold Standby)  *(dawne 6.36)*

  
**Skąd czerpie dane:**  
- Z parametrów agregatu (typ silnika, paliwo, olej, system rozruchu) z funkcji 1.19.  
- Z informacji o miejscu przechowywania (na zewnątrz, w garażu).  
- Z danych klimatycznych (minimalna temperatura).  
  
**Gdzie ląduje:**  
- W module `generator_cold_standby`.  
  
**Jak działa logika:**  
- System analizuje ryzyko związane z długotrwałym postojem agregatu w mrozie.  
- Sprawdza:  
  - akumulator rozruchowy – czy utrzyma napięcie przy –20°C,  
  - olej silnikowy – czy nie zgęstnieje,  
  - paliwo – czy nie zamarznie lub nie sparaffinuje,  
  - układ chłodzenia – czy nie zamarznie.  
- Oblicza, ile czasu potrzeba na rozruch po długim postoju.  
- Zaleca: podgrzewacz bloku silnika, akumulator AGM, olej zimowy, paliwo arktyczne.  
  
**Efekt na ekranie:**  
- Alert: *„Agregat w garażu przy –20°C po 2 tygodniach postoju może nie wystartować. Zastosuj podgrzewacz bloku i akumulator AGM.”*  
- Komunikat: *„Przy –20°C rozruch może zająć 20–30 sekund zamiast 2 sekund.”*  
  
**Migawka:** *„O co chodzi? Agregat, który stoi na mrozie, potrzebuje pomocy. Inaczej umrze przy pierwszym rozruchu.”*  
  
**Powiązania:** Funkcja 6.9, 6.23, 1.19.

---

### 7.35. Symulacja rozmrażania rur elektrycznymi kablami grzewczymi (Pipe Thawing Simulation)  *(dawne 6.37)*

  
**Skąd czerpie dane:**  
- Z długości i średnicy zamarzniętej rury.  
- Z mocy kabla grzewczego (W/m).  
- Z temperatury otoczenia i izolacji rury.  
  
**Gdzie ląduje:**  
- W module `pipe_thawing_simulation`.  
  
**Jak działa logika:**  
- System oblicza, ile energii potrzeba do rozmrożenia zamarzniętej rury.  
- Uwzględnia:  
  - ciepło właściwe lodu,  
  - straty ciepła do otoczenia,  
  - moc i długość kabla grzewczego.  
- Oblicza czas rozmrażania przy różnych mocach kabli.  
- Ostrzega przed zbyt szybkim rozmrażaniem, które może spowodować pęknięcie rury.  
  
**Efekt na ekranie:**  
- Wykres temperatury rury w czasie rozmrażania.  
- Komunikat: *„Rura 20 mm zamarznięta na długości 2 m. Kabel 20 W/m rozmrozi ją w 3 godziny. Zużyje 0,12 kWh.”*  
- Ostrzeżenie: *„Nie używaj otwartego ognia do rozmrażania – ryzyko pożaru!”*  
  
**Migawka:** *„O co chodzi? Rozmrażanie to delikatna operacja. Za szybko – pęknie rura. Za wolno – zamarznie cała instalacja.”*  
  
**Powiązania:** Funkcja 6.15, 6.27, 4.31.

---

### 7.36. Test wydajności falownika przy odkształconych obciążeniach zimą (Inverter Harmonic Winter Load)  *(dawne 6.38)*

  
**Skąd czerpie dane:**  
- Z listy odbiorników (pompa ciepła, silniki, grzałki, sterowniki) i ich harmonicznych.  
- Z parametrów falownika (THD, obciążalność).  
- Z pomiarów lub szacunków odkształceń prądu.  
  
**Gdzie ląduje:**  
- W module `inverter_harmonic_load`.  
  
**Jak działa logika:**  
- System analizuje, jak odkształcone obciążenia (szczególnie pompa ciepła i silniki) wpływają na falownik.  
- Uwzględnia:  
  - współczynnik THD (zawartość harmonicznych),  
  - dodatkowe nagrzewanie się falownika,  
  - ryzyko przeciążenia i wyłączenia.  
- Oblicza, o ile należy obniżyć moc czynną falownika, aby nie przegrzać go przy odkształconych obciążeniach.  
  
**Efekt na ekranie:**  
- Wykres obciążenia falownika z harmonicznymi.  
- Alert: *„Twoja pompa ciepła generuje THD 25%. Falownik 5 kW może realnie oddać tylko 4,1 kW. Zwiększ zapas mocy.”*  
- Komunikat: *„Zastosowanie filtra harmonicznych może zwiększyć dostępną moc falownika.”*  
  
**Migawka:** *„O co chodzi? Odkształcony prąd to jak brudne paliwo. Silnik chodzi, ale tracisz moc i grzejesz sprzęt.”*  
  
**Powiązania:** Funkcja 4.3, 5.5, 6.29.

---

### 7.37. Strategia „Deep Winter Energy Budget”  *(dawne 6.39)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania sezonowego (Rozdział 1, 5).  
- Z produkcji PV (Rozdział 2) i wiatru (6.24).  
- Z pojemności baterii i agregatu (Rozdział 3, 1.19).  
- Z prognoz pogody.  
  
**Gdzie ląduje:**  
- W module `winter_energy_budget`.  
  
**Jak działa logika:**  
- System tworzy budżet energetyczny na cały sezon zimowy.  
- Dzieli go na miesiące, tygodnie, dni.  
- Przydziela energię na poszczególne cele: ogrzewanie, C.W.U., pompy, oświetlenie.  
- Monitoruje zużycie i porównuje z planem.  
- Ostrzega, gdy zużycie przekracza budżet i grozi deficyt.  
  
**Efekt na ekranie:**  
- Tabela budżetu miesięcznego.  
- Komunikat: *„Na styczeń zaplanowano 300 kWh z PV, 150 kWh z agregatu, 250 kWh z baterii. Do 20 stycznia zużyłeś 280 kWh – zostało Ci 170 kWh.”*  
- Ostrzeżenie: *„Zużycie przekracza budżet o 12%. Ogranicz ogrzewanie o 1°C.”*  
  
**Migawka:** *„O co chodzi? Energia zimą jest jak pensja. Trzeba nią zarządzać, żeby starczyło do pierwszego.”*  
  
**Powiązania:** Funkcja 6.1, 6.3, 7.3.

---

### 7.38. Symulacja awarii jednego stringa PV w zimie (PV String Failure in Winter)  *(dawne 6.40)*

  
**Skąd czerpie dane:**  
- Z konfiguracji stringów PV (liczba, moc, napięcie) z Rozdziału 2.  
- Z listy możliwych awarii (śnieg, zwarcie, uszkodzenie złączki, przebicie izolacji).  
- Z danych o temperaturze i warunkach zimowych.  
  
**Gdzie ląduje:**  
- W module `pv_string_failure_winter`.  
  
**Jak działa logika:**  
- System symuluje awarię jednego stringa w najgorszym miesiącu.  
- Sprawdza, jak spadek produkcji wpłynie na bilans energetyczny.  
- Uwzględnia, że zimą każda kWh jest na wagę złota.  
- Analizuje ryzyko kaskadowej awarii (np. przeciążenie innego stringa).  
- Generuje zalecenia: redundancja stringów, monitoring napięć, szybka lokalizacja uszkodzenia.  
  
**Efekt na ekranie:**  
- Wykres produkcji z jednym stringiem awaryjnym.  
- Alert: *„Awaria stringu 2 w styczniu oznacza deficyt 8 kWh/dobę. System nie przetrwa bez agregatu.”*  
- Komunikat: *„Zastosuj monitoring napięć stringów, aby natychmiast wykryć awarię.”*  
  
**Migawka:** *„O co chodzi? Jeden chory string to mniej prądu. Zimą to może oznaczać, że dom nie przetrwa nocy.”*  
  
**Powiązania:** Funkcja 4.28, 2.11, 6.12, 6.14.  
  
## Rozdział 7: Tryb Live (monitoring i analiza bieżąca)

---

## Moduł 8 (Kafel 8): Bezpieczeństwo i sytuacje awaryjne  — NOWY MODUŁ ZBIORCZY

*Ten kafel nie istniał wprost w v1.5 — funkcje pożarowe/awaryjne były rozrzucone po 3 rozdziałach: 6 (scenariusze), 11 (sprzęt ESP32) i 12 (AI). Zebrano je w jeden spójny moduł, bo operacyjnie tworzą jeden przepływ: **czujnik → decyzja AI → akcja sprzętowa**. Cała treść źródłowa zachowana bez zmian, tylko przeniesiona.*

**Podział wewnętrzny:**
- Scenariusze i procedury (z dawnego Rozdz. 6)
- Warstwa sprzętowa / ESP32 (z dawnego Rozdz. 11)
- Warstwa AI / decyzyjna (z dawnego Rozdz. 12)

### Scenariusze i procedury *(przeniesione z Rozdz. 6)*

### 8.1. Integracja awaryjnego źródła ciepła (kominek, koza, piec na drewno)  *(dawne 6.19)*

  
**Skąd czerpie dane:**  
- Z informacji o alternatywnym źródle ciepła (typ, moc, sprawność, paliwo).  
- Z zapotrzebowania na ciepło (Rozdział 5).  
- Z modelu termicznego budynku (funkcja 5.1).  
- Z danych o dostępności drewna lub innego paliwa.  
  
**Gdzie ląduje:**  
- W module `backup_heat_source`.  
  
**Jak działa logika:**  
- System sprawdza, czy awaryjne źródło ciepła może pokryć zapotrzebowanie w czasie blackoutu.  
- Oblicza, ile drewna (kg lub m³) potrzeba na dobę, tydzień, miesiąc.  
- Uwzględnia sprawność kominka (np. 60–80%) i straty ciepła.  
- Symuluje, jak kominek wpłynie na zapotrzebowanie na prąd (mniejsze obciążenie pompy ciepła).  
- Ostrzega przed ryzykiem zaczadzenia i zaleca czujniki CO.  
  
**Efekt na ekranie:**  
- Tabela zapotrzebowania na drewno: *„Na tydzień mrozu przy –20°C potrzebujesz 0,8 m³ drewna.”*  
- Alert: *„Kominek znacznie odciąży baterię, ale nie ogrzeje całego domu – tylko jedno pomieszczenie.”*  
- Przypomnienie: *„Zainstaluj czujnik czadu. Off-grid bez wentylacji to pułapka.”*  
  
**Migawka:** *„O co chodzi? Stary dobry kominek to najlepszy przyjaciel off-gridu. Ale drewno też trzeba zaplanować.”*  
  
**Powiązania:** Funkcja 6.25, 6.4, 5.1, 1.14.

---

### 8.2. Symulacja bezpieczeństwa pożarowego przy dogrzewaniu paliwem stałym (Combustion Safety)  *(dawne 6.25)*

  
**Skąd czerpie dane:**  
- Z informacji o awaryjnym źródle ciepła (kominek, koza, piec) z funkcji 6.19.  
- Z modelu budynku (wentylacja, szczelność, rozmieszczenie pomieszczeń) z Rozdziału 0.  
- Z norm bezpieczeństwa pożarowego i czujników (CO, dym, temperatura).  
  
**Gdzie ląduje:**  
- W module `combustion_safety`.  
  
**Jak działa logika:**  
- System sprawdza, czy używanie paliwa stałego jest bezpieczne w danym budynku.  
- Analizuje:  
  - dostępność powietrza do spalania (szczelne domy mogą mieć problem z ciągiem),  
  - ryzyko cofnięcia spalin,  
  - obecność i rozmieszczenie czujników czadu (CO) i dymu,  
  - drożność przewodów kominowych.  
- Symuluje scenariusz pracy kominka przy zamkniętych oknach i wyłączonej wentylacji.  
- Ostrzega przed niedoborem tlenu i zatruciem czadem.  
  
**Efekt na ekranie:**  
- Alert: *„Twój dom jest bardzo szczelny. Przy zamkniętych oknach i braku wentylacji kominek może cofnąć spaliny. Zainstaluj czujnik CO w sypialni.”*  
- Komunikat: *„Zalecana minimalna wentylacja podczas pracy kominka: 1,5 m³/h na kW mocy.”*  
  
**Migawka:** *„O co chodzi? Ogień daje ciepło, ale też zabija, jeśli nie ma czym oddychać. Czujnik to anioł stróż.”*  
  
**Powiązania:** Funkcja 6.19, 5.3, 4.24.

---

### Warstwa sprzętowa *(przeniesione z Rozdz. 11)*

### 8.3. Sterowanie siłownikami drzwi i zamkami elektromagnetycznymi (Door Actuator Control)  *(dawne 11.51)*

  
**Skąd czerpie dane:**  
- Z systemu alarmowego i czujników pożaru.  
- Z konfiguracji drzwi ewakuacyjnych i zamków.  
  
**Gdzie ląduje:**  
- W module `door_actuator_control`.  
  
**Jak działa logika:**  
- System dobiera moduł sterowania zamkiem elektromagnetycznym lub siłownikiem drzwi.  
- W normalnym trybie drzwi są zamknięte.  
- Po wykryciu pożaru lub naciśnięciu przycisku ewakuacyjnego ESP32 odłącza napięcie z zamka, zwalniając blokadę.  
- Uwzględnia zasilanie awaryjne, aby drzwi dało się otworzyć także przy braku prądu.  
- Sprawdza stan drzwi (otwarte/zamknięte) przez kontaktron.  
  
**Efekt na ekranie:**  
- Status: *„Drzwi wejściowe: zwolnione. Droga ewakuacyjna otwarta.”*  
- Alert: *„Otwarto drzwi ewakuacyjne – możliwe zagrożenie.”*  
  
**Migawka:** *„O co chodzi? W pożarze nie może być zablokowanych drzwi. System sam je otwiera.”*  
  
**Powiązania:** Funkcja 11.53, 12.51, 12.52.

---

### 8.4. Sterowanie modułem gaśniczym / elektrozaworem gazu (Fire Suppression Control)  *(dawne 11.52)*

  
**Skąd czerpie dane:**  
- Z centrali sygnalizacji pożaru i czujników dymu/temperatury.  
- Z konfiguracji stref gaśniczych.  
  
**Gdzie ląduje:**  
- W module `fire_suppression_control`.  
  
**Jak działa logika:**  
- System steruje elektrozaworem lub modułem inicjującym środek gaśniczy (gaz obojętny, mgła wodna, aerozol).  
- Uruchamia gaszenie dopiero po potwierdzeniu alarmu (np. dwa czujniki).  
- Odłącza wentylację i zamyka klapy, aby środek gaśniczy nie uciekł.  
- Sygnalizuje rozładowanie butli lub modułu.  
  
**Efekt na ekranie:**  
- Alert: *„Uruchomiono gaszenie w strefie baterii. Odłączono wentylację.”*  
- Status: *„Moduł gaśniczy: rozładowany – wymień.”*  
  
**Migawka:** *„O co chodzi? Człowiek może nie zdążyć. ESP32 uruchamia gaszenie w sekundę.”*  
  
**Powiązania:** Funkcja 11.53, 12.51, 12.56.

---

### 8.5. Wejścia dla centrali sygnalizacji pożaru (Fire Panel Interface)  *(dawne 11.53)*

  
**Skąd czerpie dane:**  
- Z centrali sygnalizacji pożaru (SSP) przez styki bezpotencjałowe lub RS485.  
- Z czujek dymu, ciepła, gazu.  
  
**Gdzie ląduje:**  
- W module `fire_panel_interface`.  
  
**Jak działa logika:**  
- System podłącza ESP32 do centrali pożarowej jako moduł rozszerzeń.  
- Odbiera sygnały alarmu, awarii, rozbrojenia.  
- Umożliwia zdalne potwierdzenie alarmu lub test centrali.  
- Loguje wszystkie zdarzenia pożarowe.  
  
**Efekt na ekranie:**  
- Status: *„Centrala SSP: alarm w strefie 2 (bateria).”*  
- Alert: *„Awaria centrali pożarowej – sprawdź zasilanie.”*  
  
**Migawka:** *„O co chodzi? Centrala pożarowa to serce ochrony. ESP32 musi z nią rozmawiać.”*  
  
**Powiązania:** Funkcja 11.51, 11.52, 12.51.

---

### 8.6. Podtrzymanie zasilania (UPS) dla ESP32, routera i siłowników (Critical UPS Module)  *(dawne 11.54)*

  
**Skąd czerpie dane:**  
- Z wymaganego czasu podtrzymania krytycznych urządzeń.  
- Z poboru mocy ESP32, routera, siłowników, centrali pożarowej.  
  
**Gdzie ląduje:**  
- W module `critical_ups_module`.  
  
**Jak działa logika:**  
- System dobiera moduł UPS lub przetwornicę z akumulatorem podtrzymującym.  
- Zapewnia zasilanie dla:  
  - ESP32,  
  - routera/modemu,  
  - siłowników drzwi,  
  - centrali pożarowej,  
  - oświetlenia awaryjnego.  
- Monitoruje stan akumulatora UPS i czas podtrzymania.  
  
**Efekt na ekranie:**  
- Status: *„UPS aktywny. Czas podtrzymania: 45 minut.”*  
- Alert: *„Akumulator UPS słaby – wymień.”*  
  
**Migawka:** *„O co chodzi? W pożarze często pada prąd. UPS daje systemowi czas na reakcję.”*  
  
**Powiązania:** Funkcja 11.32, 11.51, 12.54.

---

### 8.7. Oświetlenie awaryjne i ewakuacyjne (Emergency Lighting Control)  *(dawne 11.55)*

  
**Skąd czerpie dane:**  
- Z centrali pożarowej i czujników obecności.  
- Z konfiguracji dróg ewakuacyjnych.  
  
**Gdzie ląduje:**  
- W module `emergency_lighting`.  
  
**Jak działa logika:**  
- System steruje lampami awaryjnymi zasilanymi z UPS lub własnych akumulatorów.  
- Po alarmie zapala światło ewakuacyjne wzdłuż dróg wyjścia.  
- Dodatkowo włącza oświetlenie zewnętrzne, aby ułatwić dojście służbom.  
- Sprawdza testy okresowe lamp awaryjnych.  
  
**Efekt na ekranie:**  
- Status: *„Oświetlenie ewakuacyjne: włączone. Lampy zewnętrzne: włączone.”*  
- Alert: *„Lampa awaryjna #3 nie działa – sprawdź.”*  
  
**Migawka:** *„O co chodzi? W dymie nie widać drogi. Światło ratuje życie.”*  
  
**Powiązania:** Funkcja 11.51, 12.52, 11.54.

---

### 8.8. Sterowanie wentylacją pożarową i klapami odcinającymi (Fire Damper Control)  *(dawne 11.56)*

  
**Skąd czerpie dane:**  
- Z centrali pożarowej i czujników dymu.  
- Z konfiguracji wentylacji i klap przeciwpożarowych.  
  
**Gdzie ląduje:**  
- W module `fire_damper_control`.  
  
**Jak działa logika:**  
- System zamyka klapy odcinające w kanałach wentylacyjnych po wykryciu pożaru.  
- Wyłącza rekuperację, aby nie tłoczyć dymu po domu.  
- Uruchamia wentylację oddymiającą w strefie zagrożonej.  
- Sygnalizuje stan klap (otwarte/zamknięte).  
  
**Efekt na ekranie:**  
- Alert: *„Zamknięto klapy pożarowe. Wyłączono rekuperację.”*  
- Status: *„Wentylacja oddymiająca: pracuje.”*  
  
**Migawka:** *„O co chodzi? Dym zabija szybciej niż ogień. Trzeba go zatrzymać i odprowadzić.”*  
  
**Powiązania:** Funkcja 11.53, 12.51, 12.56.

---

### Warstwa AI / decyzyjna *(przeniesione z Rozdz. 12)*

### 8.9. Scenariusz pożarowy AI – dowódca akcji gaśniczej (Fire Scenario Commander)  *(dawne 12.51)*

  
**Skąd czerpie dane:**  
- Z centrali sygnalizacji pożaru, czujników dymu, temperatury, gazów i zwarć.  
- Z mapy stref pożarowych, lokalizacji baterii, falownika, wyjść ewakuacyjnych.  
- Ze stanu instalacji: zasilanie, wentylacja, drzwi, oświetlenie awaryjne.  
  
**Gdzie ląduje:**  
- W module `fire_scenario_commander_ai`.  
  
**Jak działa logika:**  
- AI przejmuje dowodzenie w momencie wykrycia pożaru lub silnego zadymienia.  
- Ustala, w której strefie wybuchł pożar i jakie systemy tam pracują.  
- Realizuje scenariusz w ściśle określonej kolejności:  
  1. Odłącza zasilanie PV i baterii w zagrożonej strefie.  
  2. Wyłącza wentylację mechaniczną i zamyka klapy pożarowe.  
  3. Zwalnia zamki drzwi ewakuacyjnych.  
  4. Uruchamia oświetlenie ewakuacyjne i zewnętrzne.  
  5. Odłącza zbędne obwody, aby nie zasilały ognia.  
  6. Uruchamia moduł gaśniczy, jeśli jest dostępny.  
- Informuje użytkownika o każdym kroku i podaje instrukcje ewakuacji.  
  
**Efekt na ekranie:**  
- Alert: *„Pożar w strefie baterii. Odłączono zasilanie, zwolniono drzwi, uruchomiono oświetlenie ewakuacyjne.”*  
- Status: *„Akcja gaśnicza: aktywna. Ewakuuj się najbliższym wyjściem.”*  
  
**Migawka:** *„O co chodzi? W pożarze nie ma czasu na myślenie. AI działa jak dowódca straży pożarnej.”*  
  
**Powiązania:** Funkcja 11.53, 11.51, 12.52.

---

### 8.10. Adaptacyjna ewakuacja – oświetlenie i drogi wyjścia (Evacuation Path AI)  *(dawne 12.52)*

  
**Skąd czerpie dane:**  
- Z mapy budynku, lokalizacji czujników pożaru, drożności dróg ewakuacyjnych.  
- Z czujników obecności i lokalizacji domowników (jeśli dostępne).  
  
**Gdzie ląduje:**  
- W module `evacuation_path_ai`.  
  
**Jak działa logika:**  
- AI wyznacza najbezpieczniejszą drogę ewakuacji dla każdej strefy.  
- Bierze pod uwagę, gdzie jest pożar i którędy rozprzestrzenia się dym.  
- Włącza oświetlenie ewakuacyjne tylko na wybranej trasie, prowadząc domowników do wyjścia.  
- Gdy pożar odetnie jedną drogę, AI natychmiast wyznacza alternatywną.  
- Sygnalizuje dźwiękiem i światłem kierunek ucieczki.  
  
**Efekt na ekranie:**  
- Status: *„Droga ewakuacyjna: korytarz → wyjście boczne. Oświetlenie naprowadzające włączone.”*  
- Alert: *„Główna droga zablokowana. Wyznaczono trasę zapasową przez garaż.”*  
  
**Migawka:** *„O co chodzi? AI prowadzi Cię za rękę do wyjścia, gdy w domu jest dym.”*  
  
**Powiązania:** Funkcja 12.51, 11.55, 11.17.

---

### 8.11. Predykcja ryzyka pożaru i zwarcia łukowego (Fire Risk Prediction)  *(dawne 12.53)*

  
**Skąd czerpie dane:**  
- Z parametrów instalacji: temperatura połączeń, rezystancja, prądy, napięcia, harmoniczne.  
- Z czujników dymu, gazów, wilgotności i pyłu.  
- Z historii zdarzeń i starzenia się komponentów.  
  
**Gdzie ląduje:**  
- W module `fire_risk_prediction_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje, które elementy instalacji są najbardziej narażone na pożar.  
- Ocenia ryzyko zwarcia łukowego, przegrzania styków, uszkodzenia izolacji.  
- Wykrywa wczesne oznaki: iskrzenie, nagrzewanie, luźne połączenia.  
- Przewiduje, w których miejscach może dojść do pożaru w ciągu najbliższych dni.  
  
**Efekt na ekranie:**  
- Alert: *„Ryzyko pożaru w rozdzielni: 75% w ciągu 30 dni. Wykryto luźne połączenie na szynie głównej.”*  
- Rekomendacja: *„Dokręć śruby i sprawdź termowizyjnie szynę.”*  
  
**Migawka:** *„O co chodzi? AI czuje, że coś się przegrzewa, zanim buchnie ogniem.”*  
  
**Powiązania:** Funkcja 7.29, 4.24, 12.23.

---

### 8.12. Zarządzanie zasilaniem awaryjnym i UPS dla systemów krytycznych (Critical Load UPS AI)  *(dawne 12.54)*

  
**Skąd czerpie dane:**  
- Z obciążenia systemów krytycznych: ESP32, router, centrala pożarowa, siłowniki, oświetlenie awaryjne.  
- Z pojemności i stanu UPS/akumulatorów awaryjnych.  
  
**Gdzie ląduje:**  
- W module `critical_load_ups_ai`.  
  
**Jak działa logika:**  
- AI decyduje, które obwody krytyczne mają być podtrzymane w razie zaniku zasilania.  
- Monitoruje stan UPS i akumulatorów.  
- Wykrywa zbliżające się rozładowanie i ogranicza zasilanie mniej ważnych obwodów krytycznych.  
- Ustala priorytet: najpierw centrala pożarowa i ESP32, potem router, na końcu siłowniki.  
- Informuje o przewidywanym czasie podtrzymania.  
  
**Efekt na ekranie:**  
- Status: *„UPS podtrzymuje systemy krytyczne. Szacowany czas: 42 minuty.”*  
- Alert: *„UPS rozładuje się za 10 minut. Wyłączono zasilanie siłowników.”*  
  
**Migawka:** *„O co chodzi? W awarii liczy się każda minuta. AI pilnuje, żeby najważniejsze systemy działały najdłużej.”*  
  
**Powiązania:** Funkcja 11.54, 12.51, 11.32.

---

### 8.13. Integracja z syreną, monitoringiem i służbami (Emergency Dispatch AI)  *(dawne 12.55)*

  
**Skąd czerpie dane:**  
- Z alarmów pożarowych, włamaniowych, zalaniowych i innych zagrożeń.  
- Z konfiguracji powiadomień i kontaktów alarmowych.  
  
**Gdzie ląduje:**  
- W module `emergency_dispatch_ai`.  
  
**Jak działa logika:**  
- Po wykryciu krytycznego zagrożenia AI uruchamia syrenę lub sygnalizator zewnętrzny.  
- Włącza kamery monitoringu i zapisuje nagranie.  
- Wysyła powiadomienia do użytkownika, rodziny lub firmy ochroniarskiej.  
- W skrajnych przypadkach może automatycznie wezwać służby ratunkowe (jeśli użytkownik wyrazi zgodę).  
- Loguje cały przebieg zdarzenia.  
  
**Efekt na ekranie:**  
- Alert: *„Pożar potwierdzony. Wysłano powiadomienie do użytkownika i służb. Syrena aktywna.”*  
- Status: *„Monitoring: nagrywanie aktywne.”*  
  
**Migawka:** *„O co chodzi? AI nie tylko wykrywa zagrożenie, ale też wzywa pomoc.”*  
  
**Powiązania:** Funkcja 12.51, 11.53, 7.7.

---

### 8.14. Kontrola odcięcia wentylacji i klap oddymiających (Smoke Ventilation Control)  *(dawne 12.56)*

  
**Skąd czerpie dane:**  
- Z czujników dymu, centrali pożarowej, stanu wentylacji.  
- Z konfiguracji klap pożarowych i wentylatorów oddymiających.  
  
**Gdzie ląduje:**  
- W module `smoke_ventilation_control_ai`.  
  
**Jak działa logika:**  
- AI steruje wentylacją w trybie pożarowym:  
  - zamyka klapy odcinające na kanałach wentylacyjnych,  
  - wyłącza rekuperację,  
  - uruchamia wentylację oddymiającą w strefie objętej pożarem.  
- Zapobiega rozprzestrzenianiu się dymu na inne pomieszczenia.  
- Po ugaszeniu pożaru przewietrza budynek i resetuje klapy.  
  
**Efekt na ekranie:**  
- Status: *„Zamknięto klapy pożarowe, wyłączono rekuperację, uruchomiono oddymianie strefy 2.”*  
- Alert: *„Pożar ugaszony. Rozpoczynam przewietrzanie budynku.”*  
  
**Migawka:** *„O co chodzi? AI dusi ogień, odcinając mu tlen i wyprowadzając dym.”*  
  
**Powiązania:** Funkcja 11.56, 12.51, 12.52.

---

### 8.15. Autonomiczny audyt bezpieczeństwa pożarowego (Fire Safety Audit)  *(dawne 12.57)*

  
**Skąd czerpie dane:**  
- Z norm bezpieczeństwa pożarowego, stanu czujników, gaśnic, dróg ewakuacyjnych.  
- Z historii testów i przeglądów.  
  
**Gdzie ląduje:**  
- W module `fire_safety_audit_ai`.  
  
**Jak działa logika:**  
- AI regularnie sprawdza gotowość systemu przeciwpożarowego:  
  - czy czujniki dymu działają,  
  - czy gaśnice są na miejscu i sprawne,  
  - czy drogi ewakuacyjne są drożne,  
  - czy klapy pożarowe reagują poprawnie.  
- Generuje raport z listą nieprawidłowości.  
- Przypomina o wymaganych przeglądach i testach.  
- Wymusza potwierdzenie usunięcia usterek.  
  
**Efekt na ekranie:**  
- Raport: *„Audyt bezpieczeństwa: 92% gotowości. Braki: gaśnica w kuchni wymaga wymiany.”*  
- Alert: *„Czujnik dymu w sypialni nie odpowiada. Sprawdź baterię.”*  
  
**Migawka:** *„O co chodzi? AI pilnuje, żeby w razie pożaru wszystko zadziałało, a nie było niespodzianek.”*  
  
**Powiązania:** Funkcja 12.51, 11.53, 7.32.  
  
  
## Załączniki  
  
### A. Tabela zbiorcza pułapek inżynierskich i ich rozwiązań  
  
| Pułapka | Opis | Rozwiązanie w aplikacji |  
|---------|------|-------------------------|  
| Zbyt cienkie kable DC | Duże straty, ryzyko pożaru | Oblicza przekrój, ostrzega |  
| Napięcie Voc przy mrozie | Uszkodzenie MPPT | Stress‑test Voc, sugeruje zmianę stringów |  
| Mikropęknięcia termiczne | Spadek mocy po 2 latach | Wymusza dylatację i podkładki EPDM |  
| Brak wentylacji pod panelami | Spadek mocy o 18% latem | Wymusza szczelinę >10 cm |  
| Pominięcie cos φ | Falownik wyłącza się mimo poprawnych W | Oblicza VA, ostrzega |  
| Pominięcie prądów rozruchowych | Falownik przeciążany przy starcie | Uwzględnia 5‑6× skok prądu |  
| Brak mat grzewczych BMS | Blokada ładowania przy mrozie | Dolicza pobór, ostrzega |  
| Zbyt mały bufor na starzenie | System staje się niewystarczający po latach | Dodaje bufor degradacji |  
| Wampiry energetyczne | Ciągły pobór standby | Dolicza stałą moc czuwania |  
| Brak bufora na rozbudowę | System nie pokryje przyszłych potrzeb | Suwak +10/20/30% |  
| Niesymetryczne obciążenie 3‑fazowe | Przeciążenie jednej fazy | Analiza symetrii |  
| Łączenie Cu-Al bez złączki | Korozja galwaniczna, przegrzanie | Wymusza złączki bimetaliczne |  
| Brak SPD | Przepięcie niszczy elektronikę | Dobór SPD DC/AC |  
| Brak monitoringu izolacji (IT) | Niewykryte doziemienie, pożar | Dobiera IMD |  
| Brak selektywności | Zwarcie wyłącza cały system | Koordynacja zabezpieczeń |  
| Brak pre-charge | Iskrzenie, uszkodzenie styków | Wymusza rezystor wstępny |  
| Brak ochrony gryzoni | Przegryzione kable, zwarcie | Osłony metalowe |  
| Brak etykiet | Błędy przy serwisie | Generuje etykiety |  
| Brak testów powykonawczych | Ukryte wady, ryzyko pożaru | Lista testów, raport |  
  
---  
  
### B. Słownik kluczowych pojęć technicznych  
  
| Pojęcie | Wyjaśnienie |  
|---------|-------------|  
| SoC (State of Charge) | Poziom naładowania baterii (0–100%) |  
| DoD (Depth of Discharge) | Głębokość rozładowania – dla LiFePO4 zwykle 80–90% |  
| Voc (Voltage Open Circuit) | Napięcie obwodu otwartego panelu |  
| Vmp (Voltage at Maximum Power) | Napięcie w punkcie mocy maksymalnej |  
| Imp (Current at Maximum Power) | Prąd w punkcie mocy maksymalnej |  
| MPPT (Maximum Power Point Tracker) | Regulator śledzący punkt mocy maksymalnej paneli |  
| BMS (Battery Management System) | System zarządzania akumulatorem – nadzoruje ogniwa |  
| PID (Potential Induced Degradation) | Degradacja indukowana napięciem |  
| COP (Coefficient of Performance) | Współczynnik wydajności pompy ciepła |  
| GWC (Gruntowy Wymiennik Ciepła) | Rury w gruncie podgrzewające powietrze |  
| Wampiry energetyczne | Urządzenia pobierające prąd w trybie czuwania |  
| Cos φ | Współczynnik mocy – stosunek mocy czynnej do pozornej |  
| SPD (Surge Protective Device) | Ochronnik przeciwprzepięciowy |  
| RCD (Residual Current Device) | Wyłącznik różnicowoprądowy |  
| IMD (Insulation Monitoring Device) | Monitor izolacji |  
| GSW | Główna szyna wyrównawcza |  
| EMC (Electromagnetic Compatibility) | Kompatybilność elektromagnetyczna |  
| AIC (Ampere Interrupting Capacity) | Zdolność wyłączania zwarciowego |  
  
---  
  
### C. Lista kontrolna przed montażem  
  
1. Czy lokalizacja została pobrana z PVGIS / PVWatts?  
2. Czy model 3D działki i budynku jest poprawny?  
3. Czy przeanalizowano zacienienie (drzewa, sąsiedzi)?  
4. Czy bilans zapotrzebowania uwzględnia:  
   - [ ] Systemy krytyczne (woda, ścieki, ogrzewanie)  
   - [ ] Indukcję i prądy rozruchowe  
   - [ ] cos φ i moc pozorną  
   - [ ] Profile dobowe i sezonowość  
   - [ ] Dni autonomii  
   - [ ] Pobór własny falownika i sprawność nocną  
   - [ ] Defrost pompy ciepła i grzanie BMS  
   - [ ] Agregat (paliwo, godziny pracy)  
   - [ ] Bufor starzenia (10 lat)  
   - [ ] Wampiry energetyczne  
   - [ ] Bufor na rozbudowę  
   - [ ] Symetrię obciążeń (dla 3 faz)  
5. Czy moduł PV uwzględnia:  
   - [ ] Kąt i azymut (z suwaków)  
   - [ ] Opcję montażu pionowego (ogrodzenie)  
   - [ ] Dach płaski / skośny / grunt  
   - [ ] Porównanie tracker vs. stały stelaż  
   - [ ] Stress‑test Voc przy mrozie  
   - [ ] Aerodynamikę (wiart, ssanie)  
   - [ ] Straty na kablu (Joule)  
   - [ ] Zjawisko PID  
   - [ ] Kalkulator konstrukcji wsporczej  
6. Czy magazyn energii jest właściwie dobrany:  
   - [ ] Pojemność użyteczna (kWh)  
   - [ ] Napięcie systemowe (12/24/48V)  
   - [ ] Ogrzewanie ogniw (maty grzewcze)  
   - [ ] Bufor starzeniowy  
   - [ ] Balansery ogniw  
   - [ ] Bezpieczniki AIC  
   - [ ] Wentylacja komory baterii  
   - [ ] Czujniki dymu/temperatury  
   - [ ] Ochrona przeciwpożarowa  
7. Czy okablowanie i zabezpieczenia są dobrane:  
   - [ ] Przekroje kabli DC/AC  
   - [ ] Bezpieczniki i rozłączniki  
   - [ ] Moc falownika (W i VA)  
   - [ ] Wentylacja pod panelami (>10 cm)  
   - [ ] SPD DC/AC  
   - [ ] RCD odpowiedniego typu  
   - [ ] IMD (jeśli układ IT)  
   - [ ] GSW i uziemienie  
   - [ ] Złączki MC4 i rozgałęźniki  
   - [ ] Separacja kabli sygnałowych  
   - [ ] Etykiety i oznaczenia  
   - [ ] Testy powykonawcze  
  
---  
  
## Zakończenie  
  
Niniejszy dokument stanowi **kompletną specyfikację techniczną aplikacji Off‑Grid PV** – od geolokalizacji, przez bilans zapotrzebowania, fizykę PV, magazynowanie, okablowanie, termikę, stress‑test zimowy, aż po tryb live i szybki kalkulator mobilny. Każda funkcja została opisana według schematu: **skąd czerpie dane → gdzie ląduje → jak działa logika → efekt na ekranie**.  
  
Dokument jest otwarty na rozbudowę – można dodawać nowe funkcje, moduły lub aktualizować parametry w miarę postępu prac.  
  
---  
  
## Metryczka dokumentu  
  
| Wersja | Rozdziały | Funkcje | Sekcje w spisie treści | Załączniki |  
|--------|-----------|---------|------------------------|------------|  
| 1.7    | 13        | 540     | 540                    | A, B, C    |  
  
**Uwaga o integralności:** Przy każdej nowej wersji należy porównać metryczkę i spis treści. Żadna funkcja nie może zostać usunięta ani pominięta bez jawnego zatwierdzenia.  
  
---  
  
**Wersja:** 1.5    
**Data:** Sierpień 2026    
**Autor:** Opracowanie na podstawie rozmowy z Gemini    
**Licencja:** Własność projektu – do użytku wewnętrznego

---

## Moduł 9 (Kafel 9): Elektronika / ESP32 / sensoryka

*Dawny Rozdział 11, pomniejszony o 6 funkcji (11.51–11.56) przeniesionych do Kafla 8.*

### 9.1. Wybór płytki ESP32 do instalacji off-grid  *(dawne 11.1)*

  
**Skąd czerpie dane:**  
- Z wymagań instalacji: liczba wejść/wyjść, potrzebne interfejsy, pobór mocy, warunki montażu.  
  
**Gdzie ląduje:**  
- W module `esp32_board_selection`.  
  
**Jak działa logika:**  
- System porównuje popularne warianty:  
  - ESP32 DevKit V1 (klasyczny, dużo GPIO),  
  - ESP32 WROOM-32U (lepsze Wi‑Fi, z gniazdem U.FL),  
  - ESP32 S3 (więcej mocy, szybsze ADC),  
  - ESP32 C3 (małe zużycie, tylko RISC‑V),  
  - ESP32 POE (zasilanie przez Ethernet).  
- Uwzględnia liczbę kanałów ADC, interfejsy UART/I2C/SPI, pamięć flash, pobór prądu.  
- Dobiera wariant na podstawie planowanej liczby czujników i trybu pracy.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Do 10 czujników i komunikacji Modbus wybierz ESP32 DevKit V1. Do pracy na baterii lepszy ESP32 C3 (3× mniejszy pobór).”*  
  
**Migawka:** *„O co chodzi? Nie każdy ESP32 jest taki sam. Wybierz płytkę pod swoje potrzeby, a nie na odwrót.”*  
  
**Powiązania:** Funkcja 11.2, 11.4, 11.5.

---

### 9.2. Zasilanie ESP32 z magistrali 12/24/48V  *(dawne 11.2)*

  
**Skąd czerpie dane:**  
- Z napięcia magistrali systemowej (12V/24V/48V).  
- Z poboru mocy ESP32 i podłączonych czujników.  
  
**Gdzie ląduje:**  
- W module `esp32_power_supply`.  
  
**Jak działa logika:**  
- System dobiera przetwornicę step‑down (np. MP1584, LM2596) z odpowiednim zakresem wejściowym.  
- Uwzględnia sprawność przetwornicy i prąd potrzebny dla ESP32 + czujniki.  
- Sprawdza, czy konieczny jest filtr przeciwzakłóceniowy przy zasilaniu z instalacji PV.  
- Zaleca bezpiecznik na wejściu zasilania ESP32.  
  
**Efekt na ekranie:**  
- Schemat: *„Magistrala 48V → przetwornica MP1584 → 5V/3.3V dla ESP32. Bezpiecznik 1A.”*  
- Ostrzeżenie: *„Nie podłączaj ESP32 bezpośrednio do 12V – spalisz stabilizator.”*  
  
**Migawka:** *„O co chodzi? ESP32 potrzebuje 5V albo 3.3V. Przetwornica to jego zasilacz.”*  
  
**Powiązania:** Funkcja 11.1, 11.32, 11.34.

---

### 9.3. Montaż i obudowa ESP32 w rozdzielni  *(dawne 11.3)*

  
**Skąd czerpie dane:**  
- Z warunków w rozdzielni: temperatura, wilgotność, miejsce montażu.  
  
**Gdzie ląduje:**  
- W module `esp32_enclosure`.  
  
**Jak działa logika:**  
- System dobiera obudowę DIN lub natynkową o odpowiednim stopniu ochrony (IP20 w rozdzielni, IP65 w wilgotnym garażu).  
- Uwzględnia wentylację i odprowadzanie ciepła.  
- Zaleca montaż na szynie DIN lub płycie montażowej.  
- Przypomina o izolacji od elementów pod napięciem.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Obudowa DIN 3‑modułowa, IP20. Zachowaj 2 cm odstępu od szyn prądowych.”*  
  
**Migawka:** *„O co chodzi? ESP32 to elektronika. Potrzebuje suchego, przewiewnego miejsca.”*  
  
**Powiązania:** Funkcja 11.1, 11.34, 4.16.

---

### 9.4. Komunikacja ESP32 z falownikiem, BMS i aplikacją  *(dawne 11.4)*

  
**Skąd czerpie dane:**  
- Z protokołów obsługiwanych przez falownik, BMS i aplikację (Modbus, CAN, MQTT, Bluetooth).  
  
**Gdzie ląduje:**  
- W module `esp32_communication`.  
  
**Jak działa logika:**  
- System ustala architekturę komunikacji:  
  - ESP32 ↔ falownik: Modbus RTU przez RS485.  
  - ESP32 ↔ BMS: CAN lub RS485.  
  - ESP32 ↔ aplikacja: MQTT przez Wi‑Fi.  
- Dobiera transceivery: MAX485, SN65HVD230, itp.  
- Sprawdza konflikty adresów i prędkości transmisji.  
  
**Efekt na ekranie:**  
- Diagram: *„ESP32 → RS485 → falownik; ESP32 → CAN → BMS; ESP32 → Wi‑Fi → aplikacja.”*  
- Ostrzeżenie: *„Nie łącz bezpośrednio GPIO 3.3V z magistralą RS485 – wymagany transceiver.”*  
  
**Migawka:** *„O co chodzi? ESP32 to tłumacz. Musi umieć rozmawiać z każdym urządzeniem.”*  
  
**Powiązania:** Funkcja 11.27, 11.28, 11.31.

---

### 9.5. Konfiguracja wejść/wyjść: GPIO, ADC, I2C, SPI, UART  *(dawne 11.5)*

  
**Skąd czerpie dane:**  
- Z listy podłączonych czujników i modułów wykonawczych.  
  
**Gdzie ląduje:**  
- W module `esp32_io_config`.  
  
**Jak działa logika:**  
- System przydziela piny GPIO do poszczególnych funkcji:  
  - I2C: SDA, SCL,  
  - SPI: MOSI, MISO, SCK, CS,  
  - UART: TX, RX,  
  - ADC: pomiary analogowe.  
- Sprawdza konflikty pinów i ograniczenia (np. ADC2 niedostępny przy Wi‑Fi).  
- Generuje mapę pinów.  
  
**Efekt na ekranie:**  
- Tabela: *„GPIO21 – SDA, GPIO22 – SCL, GPIO34 – ADC pomiar napięcia, GPIO16 – UART TX.”*  
  
**Migawka:** *„O co chodzi? Zanim podłączysz, rozplanuj piny. Inaczej kable zrobią ci sieczkę.”*  
  
**Powiązania:** Funkcja 11.1, 11.4, 11.6.

---

### 9.6. Pomiar napięcia DC – dzielnik napięcia i ADS1115  *(dawne 11.6)*

  
**Skąd czerpie dane:**  
- Z napięcia baterii lub magistrali DC.  
- Z wymaganego zakresu pomiarowego i dokładności.  
  
**Gdzie ląduje:**  
- W module `dc_voltage_measurement`.  
  
**Jak działa logika:**  
- System dobiera dzielnik napięcia (rezystory) do mierzonego zakresu, np. 0–60V.  
- Uwzględnia rezystancję wejściową i dokładność.  
- Jeśli potrzebna większa precyzja, dobiera ADS1115 (16‑bitowy ADC przez I2C).  
- Przelicza napięcie na rzeczywistą wartość.  
  
**Efekt na ekranie:**  
- Komunikat: *„Pomiar 0–60V przez dzielnik 1:10 i ADS1115. Dokładność ±0,05V.”*  
  
**Migawka:** *„O co chodzi? ADC w ESP32 jest mierne. Lepszy dzielnik + ADS1115 to dokładny pomiar.”*  
  
**Powiązania:** Funkcja 11.5, 11.2, 3.31.

---

### 9.7. Pomiar prądu DC – INA219 / INA228  *(dawne 11.7)*

  
**Skąd czerpie dane:**  
- Z prądu ładowania/rozładowania baterii lub odbiorników DC.  
  
**Gdzie ląduje:**  
- W module `dc_current_measurement`.  
  
**Jak działa logika:**  
- System dobiera czujnik prądu:  
  - INA219 – do 26V, 3.2A,  
  - INA228 – do 85V, 20A (precyzyjny).  
- Uwzględnia rezystor pomiarowy (shunt) i zakres prądu.  
- Oblicza rozdzielczość pomiaru i straty na boczniku.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Do pomiaru prądu baterii 100A wybierz INA228 z bocznikiem 0,001Ω.”*  
  
**Migawka:** *„O co chodzi? Prąd DC trzeba mierzyć precyzyjnie, bo na podstawie tego liczysz SoC.”*  
  
**Powiązania:** Funkcja 11.6, 3.31, 7.13.

---

### 9.8. Pomiar prądu AC – SCT-013 i moduł ZMPT101B  *(dawne 11.8)*

  
**Skąd czerpie dane:**  
- Z obwodów AC: wyjście falownika, obwody odbiorników.  
  
**Gdzie ląduje:**  
- W module `ac_current_measurement`.  
  
**Jak działa logika:**  
- System dobiera przekładnik prądowy SCT-013 (np. 100A/50mA) lub moduł napięciowy ZMPT101B.  
- Uwzględnia sposób montażu (otwierany rdzeń) i kalibrację.  
- Oblicza przekładnię i dopasowuje do wejścia ADC.  
  
**Efekt na ekranie:**  
- Schemat: *„SCT-013 100A na przewodzie fazowym falownika. Rezystor obciążający 33Ω.”*  
  
**Migawka:** *„O co chodzi? Prąd AC zmierzysz bez przecinania kabla. Przekładnik obejmuje przewód.”*  
  
**Powiązania:** Funkcja 11.9, 7.5, 7.28.

---

### 9.9. Pomiar mocy AC – PZEM-004T / PZEM-003  *(dawne 11.9)*

  
**Skąd czerpie dane:**  
- Z obwodu AC: napięcie, prąd, moc, energia.  
  
**Gdzie ląduje:**  
- W module `ac_power_measurement`.  
  
**Jak działa logika:**  
- System dobiera moduł PZEM-004T (przez RS485) lub PZEM-003 (przez UART).  
- Umożliwia pomiar mocy czynnej, napięcia, prądu, częstotliwości i energii.  
- Sprawdza izolację galwaniczną modułu.  
  
**Efekt na ekranie:**  
- Status: *„PZEM-004T podłączony do wyjścia falownika. Odczyt: 220V, 5A, 1,1kW.”*  
  
**Migawka:** *„O co chodzi? To gotowy licznik energii AC. Podłączasz i masz pełne dane.”*  
  
**Powiązania:** Funkcja 11.8, 7.9, 7.28.

---

### 9.10. Pomiar prądu rozruchu i zwarć – szybki tor pomiarowy  *(dawne 11.10)*

  
**Skąd czerpie dane:**  
- Z czujnika prądu o szerokim zakresie i szybkim czasie reakcji.  
  
**Gdzie ląduje:**  
- W module `surge_current_measurement`.  
  
**Jak działa logika:**  
- System dobiera szybki tor pomiarowy:  
  - czujnik Halla (np. ACS758) z czasem reakcji < 10 µs,  
  - próbkowanie przez ADC z dużą częstotliwością.  
- Wykrywa prądy rozruchowe (surge) i zwarciowe.  
- Rejestruje przebieg prądu w czasie.  
  
**Efekt na ekranie:**  
- Wykres: *„Prąd rozruchowy pompy: 45A przez 200ms, potem spadek do 8A.”*  
- Alert: *„Wykryto prąd zwarciowy 180A – natychmiastowe odłączenie.”*  
  
**Migawka:** *„O co chodzi? Zwarcie trwa ułamki sekund. Musisz je złapać szybko.”*  
  
**Powiązania:** Funkcja 11.26, 7.45, 3.9.

---

### 9.11. Pomiar temperatury ogniw i baterii – DS18B20 / NTC  *(dawne 11.11)*

  
**Skąd czerpie dane:**  
- Z czujników temperatury montowanych na ogniwach lub obudowie baterii.  
  
**Gdzie ląduje:**  
- W module `battery_temp_measurement`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - DS18B20 – cyfrowy, 1-Wire, dokładność ±0,5°C,  
  - NTC 10kΩ – analogowy, tańszy, wymaga kalibracji.  
- Ustala liczbę punktów pomiarowych (np. co drugie ogniwo, plus obudowa).  
- Sprawdza izolację czujnika i sposób mocowania (taśma kaptonowa, klej termoprzewodzący).  
- Przelicza sygnał na temperaturę.  
  
**Efekt na ekranie:**  
- Wykres: *„Ogniwo #1: 28°C, Ogniwo #4: 31°C, Obudowa: 29°C.”*  
- Alert: *„Różnica temperatur ogniw >5°C – sprawdź połączenia.”*  
  
**Migawka:** *„O co chodzi? Temperatura ogniw to zdrowie baterii. Mierz ją w kilku punktach.”*  
  
**Powiązania:** Funkcja 3.5, 3.30, 7.29.

---

### 9.12. Pomiar temperatury otoczenia i wilgotności – BME280 / SHT31  *(dawne 11.12)*

  
**Skąd czerpie dane:**  
- Z czujnika środowiskowego montowanego w rozdzielni, garażu lub na zewnątrz.  
  
**Gdzie ląduje:**  
- W module `ambient_temp_humidity`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - BME280 – I2C, mierzy temperaturę, wilgotność i ciśnienie,  
  - SHT31 – dokładniejszy pomiar wilgotności.  
- Uwzględnia miejsce montażu: wewnątrz rozdzielni, na zewnątrz w osłonie.  
- Porównuje z dopuszczalnym zakresem pracy urządzeń.  
  
**Efekt na ekranie:**  
- Status: *„Temperatura otoczenia: 25°C, wilgotność: 60%.”*  
- Ostrzeżenie: *„Wilgotność w garażu >80% – ryzyko korozji.”*  
  
**Migawka:** *„O co chodzi? Otoczenie wpływa na całą instalację. Kontroluj je.”*  
  
**Powiązania:** Funkcja 7.14, 6.29, 4.16.

---

### 9.13. Pomiar nasłonecznienia – BH1750 / LDR  *(dawne 11.13)*

  
**Skąd czerpie dane:**  
- Z czujnika światła montowanego obok paneli lub na dachu.  
  
**Gdzie ląduje:**  
- W module `solar_irradiance`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - BH1750 – cyfrowy, I2C, zakres 0–65535 lx,  
  - LDR – tani, analogowy, wymaga kalibracji.  
- Przelicza natężenie światła na przybliżone nasłonecznienie (W/m²).  
- Porównuje z produkcją PV i wykrywa zabrudzenie lub cień.  
  
**Efekt na ekranie:**  
- Komunikat: *„Nasłonecznienie: 800 W/m². Produkcja PV: 2,1 kW.”*  
- Alert: *„Produkcja niższa o 30% od oczekiwanej przy danym nasłonecznieniu.”*  
  
**Migawka:** *„O co chodzi? Wiesz, ile słońca dochodzi do paneli. Bez tego nie ocenisz ich sprawności.”*  
  
**Powiązania:** Funkcja 2.14, 7.41, 7.21.

---

### 9.14. Detekcja dymu, gazu i wodoru – MQ-2 / MQ-8  *(dawne 11.14)*

  
**Skąd czerpie dane:**  
- Z czujników gazów montowanych w pobliżu baterii i agregatu.  
  
**Gdzie ląduje:**  
- W module `gas_detection`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - MQ-2 – dym, LPG, metan,  
  - MQ-8 – wodór.  
- Uwzględnia kalibrację i czas nagrzewania czujnika (ok. 24h pierwsze uruchomienie).  
- Ustala progi alarmowe.  
- Przy przekroczeniu progu odłącza ładowanie i włącza wentylację.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto wodór w komorze baterii. Wentylacja włączona.”*  
- Status: *„Czujnik MQ-8: 150 ppm – norma.”*  
  
**Migawka:** *„O co chodzi? Gaz to niewidzialny wróg. Czujnik daje czas na reakcję.”*  
  
**Powiązania:** Funkcja 3.10, 8.63, 6.25.

---

### 9.15. Detekcja zalania i wycieku wody  *(dawne 11.15)*

  
**Skąd czerpie dane:**  
- Z czujnika zalania montowanego na podłodze, przy rurach, w szafie elektrycznej.  
  
**Gdzie ląduje:**  
- W module `water_leak_detection`.  
  
**Jak działa logika:**  
- System dobiera czujnik przewodowy lub bezprzewodowy.  
- Ustala miejsca montażu: pod zlewem, przy bojlerze, w piwnicy.  
- Przy wykryciu wody generuje alarm i odłącza zagrożone obwody.  
  
**Efekt na ekranie:**  
- Alert: *„Zalanie w piwnicy! Wyłączono pompę i ogrzewanie.”*  
  
**Migawka:** *„O co chodzi? Woda i prąd to śmiertelne połączenie. Czujnik daje przewagę.”*  
  
**Powiązania:** Funkcja 6.15, 4.16, 7.6.

---

### 9.16. Pomiar ciśnienia atmosferycznego – BMP280  *(dawne 11.16)*

  
**Skąd czerpie dane:**  
- Z czujnika ciśnienia montowanego w rozdzielni lub na zewnątrz.  
  
**Gdzie ląduje:**  
- W module `pressure_measurement`.  
  
**Jak działa logika:**  
- System dobiera BMP280 (I2C) do pomiaru ciśnienia i temperatury.  
- Wykorzystuje dane do prognozy pogody i korekty nasłonecznienia.  
- Porównuje z danymi zewnętrznymi.  
  
**Efekt na ekranie:**  
- Status: *„Ciśnienie: 1012 hPa. Tendencja: spada – możliwy deszcz.”*  
  
**Migawka:** *„O co chodzi? Ciśnienie mówi o pogodzie. Przydaje się do prognoz.”*  
  
**Powiązania:** Funkcja 7.40, 7.24, 2.2.

---

### 9.17. Detekcja ruchu i obecności – PIR / radar mmWave  *(dawne 11.17)*

  
**Skąd czerpie dane:**  
- Z czujnika ruchu montowanego w pomieszczeniu lub na zewnątrz.  
  
**Gdzie ląduje:**  
- W module `motion_detection`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - PIR – tani, wykrywa ruch,  
  - radar mmWave – dokładniejszy, wykrywa obecność nawet statyczną.  
- Wykorzystuje sygnał do automatyki: oświetlenie, ogrzewanie, standby.  
  
**Efekt na ekranie:**  
- Scenariusz: *„Brak ruchu przez 2h – przełączono w tryb nieobecności.”*  
  
**Migawka:** *„O co chodzi? Dom wie, czy ktoś jest. I odpowiednio oszczędza.”*  
  
**Powiązania:** Funkcja 1.49, 7.17, 7.26.

---

### 9.18. Detekcja otwarcia drzwi i obudowy  *(dawne 11.18)*

  
**Skąd czerpie dane:**  
- Z czujnika kontaktronowego montowanego na drzwiach, oknach, obudowie szafy.  
  
**Gdzie ląduje:**  
- W module `door_open_detection`.  
  
**Jak działa logika:**  
- System dobiera kontaktron lub czujnik magnetyczny.  
- Monitoruje otwarcie obudowy falownika, baterii, rozdzielni.  
- Przy otwarciu generuje alarm i wstrzymuje pracę niebezpiecznych obwodów.  
  
**Efekt na ekranie:**  
- Alert: *„Otwarto obudowę baterii! Sprawdź, czy to Ty.”*  
  
**Migawka:** *„O co chodzi? Ochrona przed niepowołanym dostępem i przypadkowym dotykiem.”*  
  
**Powiązania:** Funkcja 7.35, 4.16, 3.10.

---

### 9.19. Czujnik zalania rur i szafy elektrycznej  *(dawne 11.19)*

  
**Skąd czerpie dane:**  
- Z czujnika wilgoci montowanego wewnątrz szafy elektrycznej i przy rurach.  
  
**Gdzie ląduje:**  
- W module `electrical_enclosure_flood`.  
  
**Jak działa logika:**  
- System dobiera czujnik zalania lub wilgotności.  
- Ustala próg alarmowy.  
- Przy wykryciu wody odłącza zasilanie szafy i informuje użytkownika.  
  
**Efekt na ekranie:**  
- Alert: *„Wilgoć w szafie elektrycznej! Odłączono obwody.”*  
  
**Migawka:** *„O co chodzi? Szafa to serce instalacji. Chroń ją przed wodą.”*  
  
**Powiązania:** Funkcja 4.16, 7.29, 6.15.

---

### 9.20. Detekcja przegrzania szyn i połączeń – czujnik kontaktowy  *(dawne 11.20)*

  
**Skąd czerpie dane:**  
- Z czujnika temperatury mocowanego na szynach, zaciskach, połączeniach.  
  
**Gdzie ląduje:**  
- W module `busbar_temp_sensor`.  
  
**Jak działa logika:**  
- System dobiera czujnik kontaktowy (np. DS18B20 w obudowie termoprzewodzącej).  
- Ustala progi: ostrzeżenie 60°C, alarm 80°C.  
- Przy przekroczeniu progu obniża moc lub odłącza obwód.  
  
**Efekt na ekranie:**  
- Alert: *„Szyna główna: 82°C! Sprawdź dokręcenie śrub.”*  
  
**Migawka:** *„O co chodzi? Gorące punkty to wczesny objaw awarii. Czujnik złapie je w porę.”*  
  
**Powiązania:** Funkcja 4.24, 7.29, 4.20.

---

### 9.21. Sterowanie przekaźnikami 230V AC  *(dawne 11.21)*

  
**Skąd czerpie dane:**  
- Z listy odbiorników 230V, które mają być sterowane przez ESP32.  
- Z mocy i charakteru obciążenia (rezystancyjne, indukcyjne).  
  
**Gdzie ląduje:**  
- W module `relay_control_ac`.  
  
**Jak działa logika:**  
- System dobiera moduł przekaźników (np. przekaźnik mechaniczny 10A/250V, moduł z transoptorem).  
- Uwzględnia prąd rozruchowy i typ obciążenia.  
- Przydziela piny GPIO do sterowania cewkami przekaźników.  
- Wymaga zastosowania diod gaszących i separacji galwanicznej.  
- Uwzględnia żywotność przekaźnika (liczba cykli).  
  
**Efekt na ekranie:**  
- Schemat: *„GPIO25 → transoptor → przekaźnik 10A → bojler 2kW.”*  
- Ostrzeżenie: *„Nie steruj przekaźnikiem bezpośrednio z GPIO – wymagany tranzystor i dioda.”*  
  
**Migawka:** *„O co chodzi? ESP32 to mózg, a przekaźnik to mięśnie. Razem załączają prąd.”*  
  
**Powiązania:** Funkcja 7.16, 1.33, 11.24.

---

### 9.22. Sterowanie obciążeniami DC – MOSFET / tranzystor  *(dawne 11.22)*

  
**Skąd czerpie dane:**  
- Z listy odbiorników DC (wentylatory, oświetlenie LED, grzałki 12/24V).  
- Z prądu obciążenia i napięcia.  
  
**Gdzie ląduje:**  
- W module `dc_load_control`.  
  
**Jak działa logika:**  
- System dobiera tranzystor MOSFET (np. IRLZ44N do niskich napięć) lub moduł z driverem.  
- Uwzględnia rezystancję kanału i straty mocy.  
- Wymaga zabezpieczenia przed przepięciami (dioda flyback).  
- Umożliwia sterowanie PWM do regulacji mocy.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Do wentylatora 12V 2A wybierz MOSFET IRLZ44N. Straty ok. 0,1W.”*  
  
**Migawka:** *„O co chodzi? MOSFET to szybki wyłącznik DC. Bez iskrzenia, bez hałasu.”*  
  
**Powiązania:** Funkcja 11.23, 7.16, 11.25.

---

### 9.23. Sterowanie PWM – wentylatory, grzałki, silniki  *(dawne 11.23)*

  
**Skąd czerpie dane:**  
- Z wymaganego zakresu regulacji mocy.  
- Z częstotliwości PWM i rodzaju obciążenia.  
  
**Gdzie ląduje:**  
- W module `pwm_control`.  
  
**Jak działa logika:**  
- System konfiguruje sygnał PWM na pinie GPIO (częstotliwość, wypełnienie).  
- Dobiera częstotliwość: 25kHz dla wentylatorów, 1kHz dla grzałek.  
- Uwzględnia filtrację sygnału przy obciążeniach rezystancyjnych.  
- Kontroluje moc płynnie zamiast załącz/wyłącz.  
  
**Efekt na ekranie:**  
- Scenariusz: *„Regulacja obrotów wentylatora 0–100% w zależności od temperatury.”*  
  
**Migawka:** *„O co chodzi? PWM to płynna regulacja mocy. Nie tylko włącz/wyłącz.”*  
  
**Powiązania:** Funkcja 11.22, 11.24, 7.17.

---

### 9.24. Sterowanie SSR – załączanie grzałek i bojlera  *(dawne 11.24)*

  
**Skąd czerpie dane:**  
- Z mocy grzałek i bojlera.  
- Z rodzaju sterowania (załączanie w zerze napięcia).  
  
**Gdzie ląduje:**  
- W module `ssr_control`.  
  
**Jak działa logika:**  
- System dobiera przekaźnik półprzewodnikowy (SSR) do obciążeń rezystancyjnych.  
- Uwzględnia załączanie w zerze napięcia – cicha praca, mniejsze zakłócenia.  
- Wymaga radiatora przy prądach >10A.  
- Steruje sygnałem 3.3V przez rezystor.  
  
**Efekt na ekranie:**  
- Schemat: *„ESP32 → GPIO → SSR 40A → grzałka bojlera 2kW.”*  
- Ostrzeżenie: *„SSR wymaga radiatora – przy 2kW wydzieli ok. 20W ciepła.”*  
  
**Migawka:** *„O co chodzi? SSR to bezgłośny przekaźnik. Idealny do częstego załączania grzałek.”*  
  
**Powiązania:** Funkcja 11.21, 7.17, 5.22.

---

### 9.25. Sterowanie stycznikami i rozłącznikami  *(dawne 11.25)*

  
**Skąd czerpie dane:**  
- Z obwodów wymagających bezpiecznego odłączenia (bateria, falownik, duże odbiorniki).  
- Z prądu i napięcia obwodu.  
  
**Gdzie ląduje:**  
- W module `contactor_control`.  
  
**Jak działa logika:**  
- System dobiera stycznik lub rozłącznik sterowany napięciem.  
- Uwzględnia cewkę stycznika (24V DC lub 230V AC) i sposób sterowania przez ESP32.  
- Wymaga zabezpieczenia cewki diodą gaszącą.  
- Umożliwia zdalne odłączenie całych sekcji instalacji.  
  
**Efekt na ekranie:**  
- Schemat: *„ESP32 → MOSFET → cewka stycznika 24V → główny obwód baterii.”*  
- Ostrzeżenie: *„Stycznik to nie przekaźnik – cewka potrzebuje więcej prądu.”*  
  
**Migawka:** *„O co chodzi? Duże prądy wymagają dużych wyłączników. Stycznik daje Ci nad nimi kontrolę.”*  
  
**Powiązania:** Funkcja 11.21, 4.13, 7.16.

---

### 9.26. Moduł e-Fuse / zabezpieczenie nadprądowe  *(dawne 11.26)*

  
**Skąd czerpie dane:**  
- Z prądu znamionowego obwodu i maksymalnego dopuszczalnego prądu.  
- Z szybkości reakcji wymaganej dla ochrony.  
  
**Gdzie ląduje:**  
- W module `efuse_module`.  
  
**Jak działa logika:**  
- System dobiera elektroniczny bezpiecznik (e-Fuse) lub moduł z pomiarem prądu.  
- Ustala próg zadziałania (np. 1,25 × prąd znamionowy).  
- Przy przekroczeniu prądu odłącza obwód w czasie < 1ms.  
- Zapisuje zdarzenie i umożliwia zdalny reset.  
  
**Efekt na ekranie:**  
- Alert: *„e-Fuse zadziałał na obwodzie gniazd. Prąd 16A, próg 12A.”*  
  
**Migawka:** *„O co chodzi? Bezpiecznik, który sam się wyłącza i informuje. To ochrona na miarę XXI wieku.”*  
  
**Powiązania:** Funkcja 11.7, 7.45, 3.9.

---

### 9.27. RS485 / Modbus RTU – komunikacja z falownikiem i BMS  *(dawne 11.27)*

  
**Skąd czerpie dane:**  
- Z parametrów falownika i BMS obsługujących Modbus RTU.  
- Z wymaganej prędkości transmisji i adresów.  
  
**Gdzie ląduje:**  
- W module `rs485_modbus`.  
  
**Jak działa logika:**  
- System dobiera transceiver MAX485 lub SP3485 do ESP32.  
- Konfiguruje UART (RX/TX) i linię DE/RE.  
- Ustala parametry transmisji: prędkość (np. 9600, 19200), parzystość, bity stopu.  
- Implementuje odpytywanie urządzeń Modbus (master) lub pracę jako slave.  
  
**Efekt na ekranie:**  
- Diagram: *„ESP32 UART2 → MAX485 → magistrala RS485 → falownik + BMS.”*  
- Ostrzeżenie: *„Nie zapomnij o terminacji 120Ω na końcach magistrali.”*  
  
**Migawka:** *„O co chodzi? Modbus to najpopularniejszy język falowników. ESP32 musi go znać.”*  
  
**Powiązania:** Funkcja 11.4, 7.12, 7.13.

---

### 9.28. CAN BUS – komunikacja z BMS  *(dawne 11.28)*

  
**Skąd czerpie dane:**  
- Z parametrów BMS obsługującego CAN.  
- Z prędkości transmisji (zwykle 250kbps lub 500kbps).  
  
**Gdzie ląduje:**  
- W module `can_bus`.  
  
**Jak działa logika:**  
- System dobiera transceiver CAN (np. SN65HVD230) do ESP32.  
- Konfiguruje kontroler CAN (wbudowany w ESP32 S3 lub zewnętrzny MCP2515).  
- Ustala prędkość i identyfikatory komunikatów.  
- Odczytuje ramki danych (napięcia ogniw, temperatury, SoC, SoH).  
  
**Efekt na ekranie:**  
- Diagram: *„ESP32 → SN65HVD230 → CAN H/L → BMS.”*  
- Ostrzeżenie: *„Bez transceivera nie podłączaj GPIO bezpośrednio do magistrali CAN.”*  
  
**Migawka:** *„O co chodzi? CAN to szybki i niezawodny protokół. Idealny do BMS.”*  
  
**Powiązania:** Funkcja 11.4, 11.27, 3.22.

---

### 9.29. Karta SD – lokalne logowanie danych  *(dawne 11.29)*

  
**Skąd czerpie dane:**  
- Z danych z czujników i urządzeń, które mają być zapisywane lokalnie.  
  
**Gdzie ląduje:**  
- W module `sd_card_logging`.  
  
**Jak działa logika:**  
- System dobiera moduł karty SD (SPI) do ESP32.  
- Konfiguruje zapis danych w formacie CSV.  
- Ustala interwał zapisu (np. co 1s, co 1min).  
- Zapewnia buforowanie i ochronę przed utratą danych przy zaniku zasilania.  
  
**Efekt na ekranie:**  
- Status: *„Zapis na karcie SD: 45 MB, 30 dni danych.”*  
  
**Migawka:** *„O co chodzi? Karta SD to lokalna skrzynka na dane. Działa nawet bez internetu.”*  
  
**Powiązania:** Funkcja 11.30, 7.30, 3.26.

---

### 9.30. Moduł RTC – podtrzymanie czasu  *(dawne 11.30)*

  
**Skąd czerpie dane:**  
- Z potrzeby utrzymania poprawnego czasu przy braku internetu.  
  
**Gdzie ląduje:**  
- W module `rtc_module`.  
  
**Jak działa logika:**  
- System dobiera moduł RTC (np. DS3231) z baterią podtrzymującą.  
- Synchronizuje czas z internetem, a potem utrzymuje go lokalnie.  
- Umożliwia poprawne znaczniki czasu w logach.  
  
**Efekt na ekranie:**  
- Status: *„Czas: 2026-08-23 14:35:00 (RTC).”*  
  
**Migawka:** *„O co chodzi? Bez RTC po zaniku zasilania stracisz czas. A logi bez czasu to chaos.”*  
  
**Powiązania:** Funkcja 11.29, 7.43, 7.36.

---

### 9.31. Łączność Wi‑Fi / Bluetooth – integracja z aplikacją  *(dawne 11.31)*

  
**Skąd czerpie dane:**  
- Z wymagań komunikacji bezprzewodowej: szybkość, zasięg, pobór mocy, lokalizacja.  
- Z konfiguracji aplikacji zdalnej i lokalnej.  
  
**Gdzie ląduje:**  
- W module `wifi_bt_integration`.  
  
**Jak działa logika:**  
- System wybiera tryb komunikacji:  
  - Wi‑Fi – do łączenia z aplikacją przez router lub hot‑spot,  
  - Bluetooth – do lokalnego podglądu bez sieci.  
- Uwzględnia zużycie energii: Wi‑Fi pobiera więcej, Bluetooth mniej.  
- Dobiera tryb pracy ciągłej lub okresowej (np. budzenie co 5 minut w celu wysłania danych).  
- Sprawdza bezpieczeństwo: szyfrowanie, hasła, certyfikaty.  
  
**Efekt na ekranie:**  
- Status: *„Połączono przez Wi‑Fi, IP 192.168.1.120. BLE gotowe do połączenia lokalnego.”*  
  
**Migawka:** *„O co chodzi? ESP32 ma dwa sposoby na rozmowę z telefonem. Wybierz Wi‑Fi, gdy masz router, albo Bluetooth, gdy jesteś obok.”*  
  
**Powiązania:** Funkcja 11.4, 7.15, 11.49.

---

### 9.32. Podtrzymanie zasilania ESP32 – superkondensator / mały akumulator  *(dawne 11.32)*

  
**Skąd czerpie dane:**  
- Z wymaganego czasu podtrzymania (np. do bezpiecznego zapisu danych).  
- Z poboru mocy ESP32 i modułów zewnętrznych.  
  
**Gdzie ląduje:**  
- W module `esp32_power_backup`.  
  
**Jak działa logika:**  
- System dobiera rozwiązanie podtrzymania zasilania:  
  - superkondensator – podtrzymanie przez kilka sekund, wystarczające na zapis stanu,  
  - mały akumulator Li‑Po / Li‑FePO4 – podtrzymanie godzinne.  
- Uwzględnia ładowanie i ochronę akumulatora.  
- Zapewnia poprawne zamknięcie zapisu na karcie SD i wysłanie ostatniego statusu.  
  
**Efekt na ekranie:**  
- Komunikat: *„Podtrzymanie 10 s przez superkondensator. ESP32 zdąży zapisać stan i się wyłączyć.”*  
  
**Migawka:** *„O co chodzi? Zasilanie potrafi zniknąć w ułamku sekundy. Daj ESP32 chwilę na pożegnanie.”*  
  
**Powiązania:** Funkcja 11.2, 11.33, 7.36.

---

### 9.33. Watchdog i automatyczny reset  *(dawne 11.33)*

  
**Skąd czerpie dane:**  
- Z rejestrów pracy ESP32 i sygnałów z zewnętrznego watchdoga sprzętowego.  
  
**Gdzie ląduje:**  
- W module `watchdog_reset`.  
  
**Jak działa logika:**  
- System konfiguruje watchdoga wewnętrznego (software) i zewnętrznego (hardware, np. TPL5010).  
- Watchdog wymaga okresowego „kopnięcia” – jeśli system się zawiesi, resetuje ESP32.  
- Uwzględnia maksymalny czas zawieszenia (np. 60 s).  
- Zapewnia logowanie przyczyny resetu.  
  
**Efekt na ekranie:**  
- Alert: *„Watchdog zresetował ESP32 po zawieszeniu. Przyczyna: brak odpowiedzi z BMS.”*  
  
**Migawka:** *„O co chodzi? Jak ESP32 zawiśnie, musi sam wstać. Watchdog to kopniak ratunkowy.”*  
  
**Powiązania:** Funkcja 11.32, 7.19, 7.43.

---

### 9.34. Izolacja galwaniczna wejść/wyjść  *(dawne 11.34)*

  
**Skąd czerpie dane:**  
- Z napięć i masy ESP32 w stosunku do urządzeń zewnętrznych.  
- Z ryzyka różnicy potencjałów i przepięć.  
  
**Gdzie ląduje:**  
- W module `galvanic_isolation`.  
  
**Jak działa logika:**  
- System dobiera izolację:  
  - transoptory – dla sygnałów cyfrowych,  
  - przetwornice izolowane – dla zasilania,  
  - transceivery z izolacją – dla RS485 i CAN.  
- Uwzględnia separację masy ESP32 od masy urządzeń wysokoprądowych.  
- Zapobiega przepływowi prądu wyrównawczego.  
  
**Efekt na ekranie:**  
- Schemat: *„GPIO → transoptor → RS485. Masa ESP32 oddzielona od masy BMS.”*  
  
**Migawka:** *„O co chodzi? Nie łącz bezpośrednio wrażliwej elektroniki z instalacją 48V. Izolacja to mur.”*  
  
**Powiązania:** Funkcja 11.27, 11.28, 11.35.

---

### 9.35. Ochrona przepięciowa linii sygnałowych  *(dawne 11.35)*

  
**Skąd czerpie dane:**  
- Z długości przewodów i ich położenia względem instalacji PV/AC.  
- Z ryzyka wyładowań i przepięć łączeniowych.  
  
**Gdzie ląduje:**  
- W module `signal_surge_protection`.  
  
**Jak działa logika:**  
- System dobiera diody TVS lub warystory na linie sygnałowe.  
- Zabezpiecza magistrale RS485, CAN, 1‑Wire i wejścia czujników.  
- Uwzględnia czas reakcji i napięcie przebicia.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Na magistralę RS485 podłącz diodę TVS 5.0V. Zabezpieczy transceiver przed przepięciem.”*  
  
**Migawka:** *„O co chodzi? Piorun nie musi trafić w ESP32, żeby go zabić. Wystarczy przepięcie w kablu.”*  
  
**Powiązania:** Funkcja 11.34, 4.5, 4.7.

---

### 9.36. Lokalny wyświetlacz OLED/LCD – status systemu  *(dawne 11.36)*

  
**Skąd czerpie dane:**  
- Z danych o stanie systemu: SoC, moc PV, temperatura, alarmy.  
  
**Gdzie ląduje:**  
- W module `local_display`.  
  
**Jak działa logika:**  
- System dobiera wyświetlacz:  
  - OLED 0.96” (I2C) – mały, energooszczędny,  
  - LCD 16×2 – czytelny, ale większy pobór.  
- Projektuje ekrany: główny, bateria, PV, alarmy.  
- Umożliwia przełączanie widoków przyciskami.  
  
**Efekt na ekranie:**  
- Wyświetlacz: *„SoC 87%, PV 1.2 kW, Dom 800 W, OK.”*  
  
**Migawka:** *„O co chodzi? Nie musisz otwierać aplikacji. Spójrz na wyświetlacz i wiesz, co się dzieje.”*  
  
**Powiązania:** Funkcja 11.37, 11.38, 7.1.

---

### 9.37. Dioda RGB i sygnalizacja stanu pracy  *(dawne 11.37)*

  
**Skąd czerpie dane:**  
- Z statusu systemu: OK, uwaga, alarm, tryb serwisowy.  
  
**Gdzie ląduje:**  
- W module `rgb_status`.  
  
**Jak działa logika:**  
- System przypisuje kolory do stanów:  
  - zielony – wszystko OK,  
  - żółty – uwaga,  
  - czerwony – alarm,  
  - niebieski – tryb serwisowy.  
- Uwzględnia miganie w razie nowego alarmu.  
  
**Efekt na ekranie:**  
- Sygnalizacja: *„Dioda miga na czerwono – nowy alarm krytyczny.”*  
  
**Migawka:** *„O co chodzi? Jedna dioda powie Ci więcej niż monitor. Zielony – spokój, czerwony – biegnij.”*  
  
**Powiązania:** Funkcja 11.36, 7.6, 7.8.

---

### 9.38. Przyciski fizyczne do sterowania lokalnego  *(dawne 11.38)*

  
**Skąd czerpie dane:**  
- Z listy akcji, które użytkownik chce wykonywać bez aplikacji.  
  
**Gdzie ląduje:**  
- W module `physical_buttons`.  
  
**Jak działa logika:**  
- System dobiera przyciski i konfiguruje ich funkcje:  
  - krótkie naciśnięcie – przełączanie widoków,  
  - długie naciśnięcie – tryb serwisowy,  
  - kombinacje – reset, załączenie obwodu awaryjnego.  
- Uwzględnia debouncing sygnału.  
  
**Efekt na ekranie:**  
- Instrukcja: *„Przycisk 1: zmiana widoku, Przycisk 2: wyciszenie alarmu.”*  
  
**Migawka:** *„O co chodzi? Czasem wygodniej nacisnąć przycisk niż szukać telefonu.”*  
  
**Powiązania:** Funkcja 11.36, 7.16, 7.20.

---

### 9.39. Brzęczyk / buzzer alarmowy  *(dawne 11.39)*

  
**Skąd czerpie dane:**  
- Z alarmów i zdarzeń krytycznych.  
  
**Gdzie ląduje:**  
- W module `buzzer_alarm`.  
  
**Jak działa logika:**  
- System dobiera brzęczyk pasywny sterowany PWM.  
- Ustala sygnały: krótki pik – info, przerywany – ostrzeżenie, ciągły – krytyczny.  
- Uwzględnia możliwość wyciszenia na czas naprawy.  
  
**Efekt na ekranie:**  
- Alert: *„Alarm dźwiękowy: ciągły – przeciążenie falownika.”*  
  
**Migawka:** *„O co chodzi? Czasem nie patrzysz na ekran. Dźwięk wbije Cię z fotela.”*  
  
**Powiązania:** Funkcja 11.37, 7.6, 7.8.

---

### 9.40. Czujnik jakości powietrza wewnątrz – CO2, LZO (SGP30/SCD30)  *(dawne 11.40)*

  
**Skąd czerpie dane:**  
- Z czujnika jakości powietrza montowanego w pomieszczeniu.  
  
**Gdzie ląduje:**  
- W module `indoor_air_sensor`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - SGP30 – LZO i CO2 (I2C),  
  - SCD30 – CO2, wilgotność i temperatura (dokładniejszy).  
- Uwzględnia kalibrację i czas nagrzewania.  
- Porównuje z normami (np. CO2 < 1000 ppm).  
  
**Efekt na ekranie:**  
- Status: *„CO2: 850 ppm, LZO: niskie. Wentylacja pracuje normalnie.”*  
  
**Migawka:** *„O co chodzi? Złe powietrze to mniejsza wydajność i zdrowie. Czujnik pilnuje, czym oddychasz.”*  
  
**Powiązania:** Funkcja 7.48, 5.3, 6.30.

---

### 9.41. Czujnik wibracji i wstrząsów (MPU6050/ADXL345)  *(dawne 11.41)*

  
**Skąd czerpie dane:**  
- Z akcelerometru lub żyroskopu montowanego na kluczowych urządzeniach: falowniku, pompie ciepła, agregacie.  
- Z historii wibracji i progów bezpieczeństwa.  
  
**Gdzie ląduje:**  
- W module `vibration_sensor`.  
  
**Jak działa logika:**  
- System dobiera czujnik wibracji:  
  - MPU6050 – akcelerometr + żyroskop, I2C,  
  - ADXL345 – akcelerometr 3‑osiowy, niski pobór.  
- Monitoruje ciągłe wibracje i wykrywa nagłe wstrząsy.  
- Analizuje sygnał: normalna praca, zużycie łożysk, poluzowanie mocowania.  
- Ostrzega o nietypowych drganiach lub uderzeniach.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto nadmierne wibracje pompy ciepła – możliwe poluzowanie mocowania lub zużycie wentylatora.”*  
- Status: *„Poziom wibracji agregatu: normalny.”*  
  
**Migawka:** *„O co chodzi? Wibracja to pierwszy objaw awarii mechanicznej. Czujnik usłyszy, zanim zobaczysz.”*  
  
**Powiązania:** Funkcja 7.21, 7.19, 5.31.

---

### 9.42. Czujnik deszczu / opadów  *(dawne 11.42)*

  
**Skąd czerpie dane:**  
- Z czujnika deszczu montowanego na zewnątrz, w pobliżu paneli lub rynien.  
- Z danych pogodowych i produkcji PV.  
  
**Gdzie ląduje:**  
- W module `rain_sensor`.  
  
**Jak działa logika:**  
- System dobiera czujnik deszczu:  
  - pojemnościowy – wykrywa wilgoć na powierzchni,  
  - wagowy – mierzy ilość opadu.  
- Uwzględnia ogrzewanie czujnika zimą (zapobieganie szronieniu).  
- Wykrywa początek opadów i ich intensywność.  
- Integruje się z automatyką: zamykanie okien dachowych, odłączanie wrażliwych obwodów.  
  
**Efekt na ekranie:**  
- Status: *„Opad: umiarkowany, 2 mm/h.”*  
- Alert: *„Deszcz wykryty – zamknięto świetlik dachowy.”*  
  
**Migawka:** *„O co chodzi? Deszcz potrafi zaskoczyć. Czujnik daje znać od razu.”*  
  
**Powiązania:** Funkcja 7.40, 7.26, 2.16.

---

### 9.43. Anemometr i kierunek wiatru (RS485 / impulsowy)  *(dawne 11.43)*

  
**Skąd czerpie dane:**  
- Z anemometru montowanego na dachu lub maszcie.  
- Z czujnika kierunku wiatru (wiatrowskazu).  
  
**Gdzie ląduje:**  
- W module `wind_sensor`.  
  
**Jak działa logika:**  
- System dobiera anemometr:  
  - impulsowy – liczy obroty,  
  - RS485 – cyfrowy, z kierunkiem i prędkością.  
- Przelicza impulsy na prędkość wiatru (m/s, km/h).  
- Wykorzystuje dane do:  
  - oceny obciążenia paneli wiatrem,  
  - prognozy produkcji turbiny,  
  - ostrzegania przed porywami.  
  
**Efekt na ekranie:**  
- Status: *„Wiatr: 12 m/s, kierunek NW.”*  
- Alert: *„Poryw 25 m/s – sprawdź mocowanie paneli.”*  
  
**Migawka:** *„O co chodzi? Wiatr to obciążenie i potencjalna energia. Czujnik daje pełny obraz.”*  
  
**Powiązania:** Funkcja 2.12, 6.24, 7.40.

---

### 9.44. Czujnik poziomu wody w zbiorniku (ultradźwiękowy / hydrostatyczny)  *(dawne 11.44)*

  
**Skąd czerpie dane:**  
- Z czujnika montowanego w zbiorniku na wodę pitną, deszczówkę lub szambo.  
- Z wymiarów zbiornika.  
  
**Gdzie ląduje:**  
- W module `water_tank_level`.  
  
**Jak działa logika:**  
- System dobiera czujnik:  
  - ultradźwiękowy – bezkontaktowy, montowany nad powierzchnią,  
  - hydrostatyczny – mierzy ciśnienie słupa wody.  
- Przelicza odległość/ciśnienie na poziom w procentach lub litrach.  
- Integruje się z pompą: włącza zasilanie, gdy poziom spada, wyłącza przy pełnym zbiorniku.  
  
**Efekt na ekranie:**  
- Status: *„Poziom wody: 65% (650 l).”  
- Alert: *„Niski poziom wody w zbiorniku – 10%.”*  
  
**Migawka:** *„O co chodzi? Bez wody ani rusz. Czujnik pilnuje, żebyś nie został suchy.”*  
  
**Powiązania:** Funkcja 8.17, 6.15, 1.1.

---

### 9.45. Czujnik prądu upływu / detekcja różnicowa (ochrona RCD)  *(dawne 11.45)*

  
**Skąd czerpie dane:**  
- Z przekładnika różnicowego montowanego na przewodach fazowych i neutralnym.  
- Z norm ochrony przeciwporażeniowej.  
  
**Gdzie ląduje:**  
- W module `rcd_sensor`.  
  
**Jak działa logika:**  
- System dobiera przekładnik różnicowy lub moduł detekcji prądu upływu.  
- Mierzy różnicę prądów L i N.  
- Wykrywa prąd upływowy > 30 mA (ochrona osób) lub > 300 mA (ochrona przeciwpożarowa).  
- Przy przekroczeniu progu natychmiast odłącza obwód i alarmuje.  
  
**Efekt na ekranie:**  
- Alert: *„Prąd upływu 45 mA – wyłączono obwód gniazd.”*  
  
**Migawka:** *„O co chodzi? To elektroniczny anioł stróż. Ochroni Cię przed porażeniem.”*  
  
**Powiązania:** Funkcja 4.15, 4.16, 7.45.

---

### 9.46. Moduł LoRa / LoRaWAN do komunikacji dalekiego zasięgu  *(dawne 11.46)*

  
**Skąd czerpie dane:**  
- Z potrzeby komunikacji na duże odległości bez Wi‑Fi.  
- Z lokalizacji oddalonych budynków lub czujników.  
  
**Gdzie ląduje:**  
- W module `lora_communication`.  
  
**Jak działa logika:**  
- System dobiera moduł LoRa (np. SX1276) do ESP32.  
- Umożliwia przesyłanie danych na odległość 2–10 km.  
- Wykorzystuje bramki LoRaWAN lub łącze punkt‑punkt.  
- Uwzględnia niski pobór mocy i małą przepustowość.  
  
**Efekt na ekranie:**  
- Status: *„Połączono przez LoRa z czujnikiem przy bramie (3 km).”*  
  
**Migawka:** *„O co chodzi? Wi‑Fi ma krótki zasięg. LoRa sięga tam, gdzie wzrok nie sięga.”*  
  
**Powiązania:** Funkcja 11.31, 7.15, 11.48.

---

### 9.47. Moduł Ethernet (LAN) dla połączenia przewodowego  *(dawne 11.47)*

  
**Skąd czerpie dane:**  
- Z wymagania stabilnego połączenia przewodowego.  
- Z dostępności sieci LAN w budynku.  
  
**Gdzie ląduje:**  
- W module `ethernet_module`.  
  
**Jak działa logika:**  
- System dobiera moduł Ethernet (np. W5500) do ESP32.  
- Umożliwia podłączenie przez kabel RJ45.  
- Zapewnia większą niezawodność niż Wi‑Fi.  
- Uwzględnia zasilanie PoE, jeśli dostępne.  
  
**Efekt na ekranie:**  
- Status: *„Połączono przez Ethernet: 100 Mbps.”*  
  
**Migawka:** *„O co chodzi? Kabel to stabilność. Żadnych zakłóceń Wi‑Fi.”*  
  
**Powiązania:** Funkcja 11.31, 7.15, 11.4.

---

### 9.48. Obsługa protokołu MQTT z TLS  *(dawne 11.48)*

  
**Skąd czerpie dane:**  
- Z konfiguracji brokera MQTT i certyfikatów.  
- Z wymagań bezpieczeństwa transmisji.  
  
**Gdzie ląduje:**  
- W module `mqtt_tls`.  
  
**Jak działa logika:**  
- System konfiguruje połączenie MQTT z szyfrowaniem TLS.  
- Umożliwia publikację danych i subskrypcję poleceń.  
- Uwzględnia jakość usług (QoS 0/1/2) i retencję.  
- Zapewnia bezpieczną wymianę z aplikacją.  
  
**Efekt na ekranie:**  
- Status: *„MQTT połączony, TLS aktywny. Publikacja co 5 s.”*  
  
**Migawka:** *„O co chodzi? Danych nie wysyła się gołym tekstem. TLS to sejf.”*  
  
**Powiązania:** Funkcja 11.31, 7.15, 7.35.

---

### 9.49. Aktualizacja OTA (Over‑The‑Air) oprogramowania ESP32  *(dawne 11.49)*

  
**Skąd czerpie dane:**  
- Z repozytorium z nową wersją oprogramowania.  
- Z wymagań bezpieczeństwa i stabilności.  
  
**Gdzie ląduje:**  
- W module `ota_update`.  
  
**Jak działa logika:**  
- System umożliwia bezprzewodową aktualizację firmware ESP32.  
- Sprawdza sumę kontrolną i podpis cyfrowy.  
- Wykonuje aktualizację dopiero po potwierdzeniu stabilnego zasilania.  
- Zapewnia powrót do poprzedniej wersji w razie błędu.  
  
**Efekt na ekranie:**  
- Alert: *„Nowa wersja ESP32 dostępna. Aktualizacja zaplanowana na 3:00.”*  
  
**Migawka:** *„O co chodzi? Nie musisz wchodzić na drabinę. ESP32 zaktualizuje się sam.”*  
  
**Powiązania:** Funkcja 11.31, 7.37, 7.36.

---

### 9.50. Redundancja ESP32 – tryb master/slave  *(dawne 11.50)*

  
**Skąd czerpie dane:**  
- Z potrzeb niezawodności systemu i krytyczności sterowania.  
- Z architektury dwóch ESP32.  
  
**Gdzie ląduje:**  
- W module `esp32_redundancy`.  
  
**Jak działa logika:**  
- System projektuje pracę dwóch ESP32:  
  - master – główny, wykonuje pomiary i sterowanie,  
  - slave – zapasowy, monitoruje mastera i przejmuje zadania po awarii.  
- Wykrywa awarię przez heartbeat (sygnał życia) i przełącza się automatycznie.  
- Uwzględnia wspólną magistralę danych i synchronizację.  
  
**Efekt na ekranie:**  
- Alert: *„ESP32 master nie odpowiada – przełączono na slave.”*  
  
**Migawka:** *„O co chodzi? Dwa mózgi są lepsze niż jeden. Jeden zawiśnie, drugi przejmuje pałeczkę.”*  
  
**Powiązania:** Funkcja 11.33, 7.19, 7.35.

---

## Moduł 10 (Kafel 10): AI i prognozy

*Dawny Rozdział 12, pomniejszony o 7 funkcji (12.51–12.57) przeniesionych do Kafla 8.*

### 10.1. Krótkoterminowa prognoza produkcji PV (24 h)  *(dawne 12.1)*

  
**Skąd czerpie dane:**  
- Z prognozy pogody (nasłonecznienie, zachmurzenie, temperatura).  
- Z historycznych danych produkcji PV i charakterystyki paneli.  
- Z bieżącej mocy systemu i poziomu naładowania baterii.  
  
**Gdzie ląduje:**  
- W module `short_term_pv_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI (np. LSTM lub regresja wzmocniona) uczy się zależności między pogodą a produkcją PV.  
- Przewiduje produkcję w kolejnych 24 godzinach z rozdzielczością 15–60 minut.  
- Uwzględnia porę roku, kąt słońca, cień i temperaturę paneli.  
- Aktualizuje prognozę co godzinę na podstawie nowych danych.  
- Wskazuje przedziały ufności (np. 80% pewności).  
  
**Efekt na ekranie:**  
- Wykres: *„Jutro produkcja 12–14 kWh, szczyt o 13:00 (3,2 kW).”*  
- Komunikat: *„Prognoza na 24 h: 13,5 kWh ± 8%.”*  
  
**Migawka:** *„O co chodzi? AI patrzy w niebo i mówi, ile prądu zrobisz jutro.”*  
  
**Powiązania:** Funkcja 7.24, 7.2, 12.44.

---

### 10.2. Krótkoterminowa prognoza zużycia energii (24 h)  *(dawne 12.2)*

  
**Skąd czerpie dane:**  
- Z historii zużycia, profilu dobowego, dnia tygodnia, pogody.  
- Z planowanych zadań (pranie, zmywanie, grzanie wody).  
- Z informacji o obecności domowników.  
  
**Gdzie ląduje:**  
- W module `short_term_load_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI uczy się wzorców zużycia dla różnych dni i warunków.  
- Przewiduje zapotrzebowanie na energię w kolejnych 24 godzinach.  
- Uwzględnia sezonowość, temperaturę zewnętrzną i zachowanie użytkowników.  
- Porównuje z prognozą produkcji PV, aby wykryć deficyty lub nadwyżki.  
  
**Efekt na ekranie:**  
- Wykres: *„Jutro zużycie 11 kWh, szczyt o 19:00 (2,8 kW).”*  
- Alert: *„Prognozowany deficyt wieczorem – 2 kWh.”*  
  
**Migawka:** *„O co chodzi? AI wie, kiedy włączysz pralkę i czy będziesz w domu.”*  
  
**Powiązania:** Funkcja 7.24, 7.2, 12.6.

---

### 10.3. Długoterminowa prognoza produkcji miesięcznej  *(dawne 12.3)*

  
**Skąd czerpie dane:**  
- Z historycznych danych produkcji PV z całego roku.  
- Z prognoz sezonowych i klimatycznych.  
- Z parametrów paneli i degradacji.  
  
**Gdzie ląduje:**  
- W module `monthly_pv_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje trendy roczne i zależności od pogody.  
- Prognozuje produkcję miesięczną na 1–12 miesięcy naprzód.  
- Uwzględnia degradację paneli i zmiany zacienienia (np. wzrost drzew).  
- Podaje przedziały ufności i scenariusze.  
  
**Efekt na ekranie:**  
- Tabela: *„Styczeń: 180 kWh, Luty: 220 kWh, Marzec: 350 kWh.”*  
- Komunikat: *„Produkcja w tym roku będzie o 5% niższa niż w ubiegłym z powodu degradacji.”*  
  
**Migawka:** *„O co chodzi? Planujesz z wyprzedzeniem, ile energii będziesz mieć za miesiąc.”*  
  
**Powiązania:** Funkcja 7.10, 7.11, 12.45.

---

### 10.4. Prognoza dostępności energii z baterii (SoC forecast)  *(dawne 12.4)*

  
**Skąd czerpie dane:**  
- Z bieżącego SoC, produkcji PV i prognoz zużycia.  
- Z pojemności baterii, sprawności i temperatury.  
- Z planowanych zadań i trybów pracy.  
  
**Gdzie ląduje:**  
- W module `battery_soc_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI symuluje przyszły stan baterii w kolejnych 24–72 godzinach.  
- Uwzględnia ładowanie z PV, rozładowanie przez odbiorniki, ograniczenia temperaturowe.  
- Przewiduje moment, w którym bateria osiągnie minimum lub maksimum.  
- Ostrzega przed ryzykiem blackoutu.  
  
**Efekt na ekranie:**  
- Wykres: *„Przewidywany SoC: jutro 7:00 – 30%, 12:00 – 80%, 22:00 – 45%.”*  
- Alert: *„Bateria osiągnie 15% w czwartek o 6:00, jeśli nie zmienisz zużycia.”*  
  
**Migawka:** *„O co chodzi? Wiesz, ile energii zostanie na jutro rano. Bez niespodzianek.”*  
  
**Powiązania:** Funkcja 3.3, 7.24, 12.7.

---

### 10.5. Predykcja szczytów zapotrzebowania  *(dawne 12.5)*

  
**Skąd czerpie dane:**  
- Z historii zużycia, profilu dobowego, dnia tygodnia.  
- Z informacji o urządzeniach, które mogą się jednocześnie włączyć.  
  
**Gdzie ląduje:**  
- W module `peak_load_prediction_ai`.  
  
**Jak działa logika:**  
- Model AI wykrywa momenty, w których zużycie przekroczy zadany próg.  
- Przewiduje wielkość i czas szczytu (np. poranny i wieczorny).  
- Uwzględnia prawdopodobieństwo jednoczesnej pracy urządzeń.  
- Sugeruje przesunięcie zadań, aby uniknąć przeciążenia falownika.  
  
**Efekt na ekranie:**  
- Alert: *„Prognozowany szczyt 4,8 kW o 19:00. Przełóż pranie na 13:00.”*  
- Wykres: *„Szczyty: 7:30 (3,2 kW), 19:00 (4,8 kW).”*  
  
**Migawka:** *„O co chodzi? AI przewiduje, kiedy system będzie najbardziej obciążony i radzi, jak tego uniknąć.”*  
  
**Powiązania:** Funkcja 1.21, 7.5, 12.10.

---

### 10.6. Uczenie się wzorców użytkowania domowników  *(dawne 12.6)*

  
**Skąd czerpie dane:**  
- Z historii pracy urządzeń, czujników obecności, zużycia energii i wody.  
- Z interakcji użytkowników z systemem (ręczne włączanie/wyłączanie).  
  
**Gdzie ląduje:**  
- W module `household_behavior_learning`.  
  
**Jak działa logika:**  
- Model AI identyfikuje powtarzalne wzorce:  
  - godziny pobudki i snu,  
  - korzystanie z prysznica,  
  - gotowanie,  
  - oglądanie telewizji,  
  - czas spędzany poza domem.  
- Tworzy profil domownika i przewiduje jego potrzeby.  
- Dostosowuje automatykę bez ingerencji użytkownika.  
  
**Efekt na ekranie:**  
- Komunikat: *„Nauczyłem się, że w soboty rano bierzesz prysznic o 8:00. Podgrzeję wodę na 7:45.”*  
- Status: *„Profil domownika: aktywny, przewidywalność 90%.”*  
  
**Migawka:** *„O co chodzi? Dom uczy się Twoich nawyków i przygotowuje się na nie.”*  
  
**Powiązania:** Funkcja 12.19, 12.20, 12.29.

---

### 10.7. Automatyczny dobór źródeł zasilania (PV / bateria / agregat / sieć)  *(dawne 12.7)*

  
**Skąd czerpie dane:**  
- Z produkcji PV, SoC baterii, kosztów paliwa, taryf sieciowych, prognoz.  
- Z obciążenia i priorytetów.  
  
**Gdzie ląduje:**  
- W module `source_selection_ai`.  
  
**Jak działa logika:**  
- Model AI wybiera optymalne źródło zasilania w każdej chwili:  
  - PV – gdy świeci słońce,  
  - bateria – gdy słońca brak,  
  - agregat – gdy bateria krytyczna i brak PV,  
  - sieć – gdy jest tania.  
- Uwzględnia koszt, żywotność baterii i niezawodność.  
- Przełącza źródła automatycznie i bez zakłóceń.  
  
**Efekt na ekranie:**  
- Status: *„Zasilanie: PV + bateria. Za 2 h przewidywany agregat.”*  
- Komunikat: *„AI oszczędziło dziś 3 l paliwa, przesuwając ładowanie na słońce.”*  
  
**Migawka:** *„O co chodzi? AI jak pilot wybiera najlepsze źródło energii, aby nie zabrakło i było tanio.”*  
  
**Powiązania:** Funkcja 7.18, 3.36, 12.8.

---

### 10.8. Optymalizacja ładowania baterii z PV  *(dawne 12.8)*

  
**Skąd czerpie dane:**  
- Z produkcji PV, SoC, temperatury ogniw, prognoz pogody.  
- Z pojemności baterii i ograniczeń C‑rate.  
  
**Gdzie ląduje:**  
- W module `pv_charge_optimization_ai`.  
  
**Jak działa logika:**  
- Model AI ustala strategię ładowania:  
  - szybkie ładowanie przy dużej produkcji PV,  
  - ograniczenie prądu przy niskiej temperaturze,  
  - odraczanie ładowania, gdy prognozowane są chmury.  
- Uwzględnia ochronę baterii i maksymalizację wykorzystania PV.  
- Wysyła sygnały do ładowarki/MPPT.  
  
**Efekt na ekranie:**  
- Komunikat: *„AI ograniczył ładowanie do 20 A z powodu temperatury 2°C. Pełne naładowanie o 15:00.”*  
- Wykres: *„Optymalna krzywa ładowania.”*  
  
**Migawka:** *„O co chodzi? Ładowanie to nie tylko podłączenie. AI dba o baterię i o każdy wat z PV.”*  
  
**Powiązania:** Funkcja 3.13, 3.14, 12.4.

---

### 10.9. Optymalizacja zużycia energii na podstawie prognoz  *(dawne 12.9)*

  
**Skąd czerbie dane:**  
- Z prognoz produkcji PV, zużycia, SoC.  
- Z listy odbiorników i ich elastyczności.  
  
**Gdzie ląduje:**  
- W module `consumption_optimization_ai`.  
  
**Jak działa logika:**  
- AI planuje pracę odbiorników, aby maksymalnie wykorzystać energię z PV.  
- Przesuwa elastyczne zadania (pranie, zmywanie, ładowanie EV) na godziny słoneczne.  
- Obniża zużycie w nocy i podczas szczytów.  
- Rekomenduje konkretne działania użytkownikowi.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Włącz pralkę o 12:00, a nie o 19:00. Oszczędzisz 0,8 kWh z baterii.”*  
- Scenariusz: *„Automatycznie przełożono zmywarkę na 11:00.”*  
  
**Migawka:** *„O co chodzi? AI przesuwa zużycie tam, gdzie jest darmowa energia.”*  
  
**Powiązania:** Funkcja 12.10, 12.22, 7.17.

---

### 10.10. Dynamiczne przesuwanie zadań (pranie, zmywanie, grzanie)  *(dawne 12.10)*

  
**Skąd czerpie dane:**  
- Z prognoz produkcji PV, cen energii, preferencji użytkownika.  
- Z listy zadań oczekujących.  
  
**Gdzie ląduje:**  
- W module `task_scheduling_ai`.  
  
**Jak działa logika:**  
- Model AI ustala kolejność i czas wykonania zadań.  
- Bierze pod uwagę komfort użytkownika i ograniczenia czasowe.  
- Dynamicznie zmienia plan, gdy zmienia się pogoda.  
- Uczy się, które przesunięcia są akceptowalne.  
  
**Efekt na ekranie:**  
- Harmonogram: *„Pranie: 12:00–13:30, Zmywarka: 14:00–15:00, Bojler: 11:00–13:00.”*  
- Alert: *„Zmieniono plan: pranie przesunięte na jutro z powodu chmur.”*  
  
**Migawka:** *„O co chodzi? AI jak sekretarka planuje domowe obowiązki tak, żeby było wygodnie i tanio.”*  
  
**Powiązania:** Funkcja 12.9, 7.26, 12.6.

---

### 10.11. Rekomendacje dotyczące ustawień systemu  *(dawne 12.11)*

  
**Skąd czerpie dane:**  
- Z historii pracy systemu, zużycia energii, produkcji PV i stanu baterii.  
- Z preferencji użytkownika i ograniczeń sprzętowych.  
  
**Gdzie ląduje:**  
- W module `system_settings_recommendation_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje, które ustawienia można poprawić, aby zwiększyć niezawodność lub oszczędność.  
- Bierze pod uwagę: napięcie odcięcia baterii, progi SoC, czasy ładowania, temperatury zadane, harmonogramy.  
- Porównuje obecną konfigurację z wzorcami optymalnymi dla danego typu instalacji.  
- Generuje listę rekomendacji z opisem spodziewanych korzyści.  
  
**Efekt na ekranie:**  
- Lista: *„1. Podnieś napięcie odcięcia z 42 V na 44 V – wydłuży to życie baterii o 20%. 2. Zmień czas grzania bojlera na 11:00 – wykorzystasz nadwyżki PV.”*  
- Alert: *„Wykryto nieoptymalne ustawienie progu rozładowania.”*  
  
**Migawka:** *„O co chodzi? System sam podpowiada, jak go lepiej skonfigurować. To jak darmowy doradca.”*  
  
**Powiązania:** Funkcja 7.25, 3.35, 12.45.

---

### 10.12. Ocena opłacalności magazynowania energii (AI)  *(dawne 12.12)*

  
**Skąd czerpie dane:**  
- Z kosztów baterii, prognoz cen energii, profilu zużycia i produkcji PV.  
- Z parametrów starzenia i sprawności magazynu.  
  
**Gdzie ląduje:**  
- W module `storage_economics_ai`.  
  
**Jak działa logika:**  
- Model AI oblicza koszt 1 kWh z baterii w całym okresie życia.  
- Porównuje z kosztem energii z sieci lub agregatu.  
- Uwzględnia zmiany cen i degradację baterii.  
- Prognozuje okres zwrotu i opłacalność ewentualnej rozbudowy.  
  
**Efekt na ekranie:**  
- Komunikat: *„Koszt 1 kWh z Twojej baterii to 1,1 zł, z sieci 0,9 zł. Bateria zwróci się po 8 latach. Przy obecnych cenach lepiej zwiększyć PV niż dokupować baterię.”*  
- Wykres: *„Skumulowane oszczędności w 10 lat.”*  
  
**Migawka:** *„O co chodzi? AI liczy, czy magazynowanie energii naprawdę się opłaca w Twoim przypadku.”*  
  
**Powiązania:** Funkcja 3.25, 5.39, 12.11.

---

### 10.13. Wykrywanie anomalii w produkcji PV  *(dawne 12.13)*

  
**Skąd czerpie dane:**  
- Z bieżącej produkcji PV, prognoz, nasłonecznienia, temperatury paneli.  
- Z historii produkcji i zdarzeń.  
  
**Gdzie ląduje:**  
- W module `pv_anomaly_detection_ai`.  
  
**Jak działa logika:**  
- Model AI porównuje rzeczywistą produkcję z oczekiwaną dla danych warunków.  
- Wykrywa odchylenia: nagły spadek, stopniowy spadek, pojedyncze straty.  
- Identyfikuje prawdopodobną przyczynę: cień, brud, śnieg, uszkodzenie, degradacja.  
- Generuje alert i zalecaną akcję.  
  
**Efekt na ekranie:**  
- Alert: *„Produkcja PV o 18% niższa niż prognozowana. Prawdopodobne zabrudzenie paneli. Zalecane czyszczenie.”*  
- Wykres: *„Odchylenie od normy w ostatnich 7 dniach.”*  
  
**Migawka:** *„O co chodzi? AI natychmiast widzi, że z panelami jest coś nie tak, i mówi dlaczego.”*  
  
**Powiązania:** Funkcja 7.21, 7.41, 2.40.

---

### 10.14. Wykrywanie anomalii w zużyciu energii  *(dawne 12.14)*

  
**Skąd czerpie dane:**  
- Z bieżącego zużycia, profilu dobowego, historii.  
- Z informacji o urządzeniach i obecności domowników.  
  
**Gdzie ląduje:**  
- W module `load_anomaly_detection_ai`.  
  
**Jak działa logika:**  
- Model AI uczy się normalnego wzorca zużycia.  
- Wykrywa odchylenia: nagły wzrost, spadek, zużycie w dziwnych porach.  
- Identyfikuje możliwe przyczyny: awaria urządzenia, pozostawione obciążenie, zwarcie, kradzież energii.  
- Informuje użytkownika i sugeruje sprawdzenie.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto nietypowe zużycie 2,5 kW o 3:00 w nocy. Możliwe awaria lub niepożądane obciążenie.”*  
- Status: *„Profil zużycia: odchylenie +12% w stosunku do normy.”*  
  
**Migawka:** *„O co chodzi? AI czuwa, gdy śpisz. Zauważy, że coś ciągnie prąd bez sensu.”*  
  
**Powiązania:** Funkcja 7.21, 1.35, 7.33.

---

### 10.15. Predykcja awarii falownika i podzespołów  *(dawne 12.15)*

  
**Skąd czerpie dane:**  
- Z parametrów pracy falownika: temperatura, napięcie, prąd, harmoniczne, czas pracy.  
- Z historii awarii i błędów.  
  
**Gdzie ląduje:**  
- W module `inverter_failure_prediction_ai`.  
  
**Jak działa logika:**  
- Model AI monitoruje oznaki zbliżającej się awarii: wzrost temperatury, spadek sprawności, nietypowe harmoniczne, częste błędy.  
- Przewiduje prawdopodobieństwo awarii w najbliższych dniach/tygodniach.  
- Zaleca przegląd lub wymianę, zanim dojdzie do zatrzymania systemu.  
  
**Efekt na ekranie:**  
- Alert: *„Ryzyko awarii falownika w ciągu 2 tygodni – 70%. Sprawdź wentylację i kondensatory.”*  
- Status: *„Predykcja: falownik sprawny, ryzyko 5%.”*  
  
**Migawka:** *„O co chodzi? AI słyszy, jak falownik kaszle, i każe iść do lekarza, zanim padnie.”*  
  
**Powiązania:** Funkcja 7.19, 7.21, 6.29.

---

### 10.16. Wczesne ostrzeganie przed uszkodzeniem baterii  *(dawne 12.16)*

  
**Skąd czerpie dane:**  
- Z BMS: napięcia ogniw, rezystancja wewnętrzna, temperatury, SoH, liczba cykli.  
- Z historii pracy baterii.  
  
**Gdzie ląduje:**  
- W module `battery_failure_early_warning_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje trendy: wzrost rezystancji, spadek pojemności, rozjazd napięć ogniw, wzrost temperatury.  
- Wykrywa słabe ogniwa i ryzyko awarii BMS.  
- Przewiduje moment, w którym bateria straci wymaganą pojemność.  
- Zaleca wymianę ogniwa lub całego pakietu.  
  
**Efekt na ekranie:**  
- Alert: *„Ogniwo #7 wykazuje 2× wyższą rezystancję niż pozostałe. Ryzyko awarii w ciągu 30 dni.”*  
- Rekomendacja: *„Zamów nowe ogniwo lub przygotuj się na wymianę pakietu.”*  
  
**Migawka:** *„O co chodzi? AI patrzy w głąb baterii i mówi, które ogniwo zaraz umrze.”*  
  
**Powiązania:** Funkcja 3.16, 3.33, 7.13.

---

### 10.17. Analiza przyczyn spadków produkcji  *(dawne 12.17)*

  
**Skąd czerpie dane:**  
- Z produkcji PV, nasłonecznienia, temperatury, zabrudzenia, zacienienia.  
- Z historii i prognoz.  
  
**Gdzie ląduje:**  
- W module `production_drop_analysis_ai`.  
  
**Jak działa logika:**  
- Gdy AI wykryje spadek produkcji, analizuje możliwe przyczyny.  
- Sprawdza kolejno: pogoda, brud, śnieg, cień, uszkodzenie, degradacja.  
- Przypisuje prawdopodobieństwo każdej przyczynie.  
- Podaje zalecaną akcję naprawczą.  
  
**Efekt na ekranie:**  
- Raport: *„Spadek produkcji o 20%. Przyczyny: brud (50%), cień (20%), degradacja (15%), śnieg (15%). Zalecam mycie paneli.”*  
  
**Migawka:** *„O co chodzi? AI nie tylko mówi, że jest źle, ale też dlaczego i co zrobić.”*  
  
**Powiązania:** Funkcja 12.13, 7.41, 2.23.

---

### 10.18. Wykrywanie nieprawidłowości w pracy pomp i wentylacji  *(dawne 12.18)*

  
**Skąd czerpie dane:**  
- Z wibracji, temperatury, prądu, przepływu powietrza/wody.  
- Z czujników i historii pracy.  
  
**Gdzie ląduje:**  
- W module `pump_fan_anomaly_ai`.  
  
**Jak działa logika:**  
- Model AI uczy się normalnego wzorca pracy pomp i wentylatorów.  
- Wykrywa nieprawidłowości: zwiększone wibracje, przegrzewanie, spadek przepływu, głośniejszą pracę.  
- Przewiduje awarię łożysk, wirnika lub silnika.  
- Zaleca serwis lub wymianę.  
  
**Efekt na ekranie:**  
- Alert: *„Wentylator rekuperacji: nadmierne wibracje. Prawdopodobne zużycie łożysk.”*  
- Status: *„Pompa cyrkulacyjna: praca normalna.”*  
  
**Migawka:** *„O co chodzi? Pompy i wentylatory zużywają się po cichu. AI słyszy, zanim staną.”*  
  
**Powiązania:** Funkcja 11.41, 7.21, 5.15.

---

### 10.19. Optymalizacja temperatury wewnętrznej (uczenie preferencji)  *(dawne 12.19)*

  
**Skąd czerpie dane:**  
- Z czujników temperatury, ustawień użytkownika, pory dnia, obecności.  
- Z historii zmian nastaw.  
  
**Gdzie ląduje:**  
- W module `temperature_preference_learning_ai`.  
  
**Jak działa logika:**  
- Model AI uczy się preferencji temperaturowych domowników.  
- Dopasowuje temperaturę do pory dnia, dnia tygodnia i obecności.  
- Uwzględnia kompromis między komfortem a zużyciem energii.  
- Automatycznie tworzy harmonogramy grzania i chłodzenia.  
  
**Efekt na ekranie:**  
- Komunikat: *„Ustawiam 21°C w salonie od 18:00 do 22:00, potem 18°C na noc. Oszczędność 8% energii.”*  
- Wykres: *„Preferowana temperatura w tygodniu.”*  
  
**Migawka:** *„O co chodzi? Dom sam dobiera temperaturę, żeby było wygodnie i bez marnowania prądu.”*  
  
**Powiązania:** Funkcja 5.38, 5.37, 12.6.

---

### 10.20. Prognozowanie zapotrzebowania na ciepłą wodę  *(dawne 12.20)*

  
**Skąd czerpie dane:**  
- Z historii zużycia wody, pory dnia, liczby domowników.  
- Z planowanych zadań (pralka, zmywarka, prysznic).  
  
**Gdzie ląduje:**  
- W module `dhw_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI przewiduje zapotrzebowanie na ciepłą wodę w kolejnych 24 godzinach.  
- Uwzględnia wzorce: poranny prysznic, wieczorna kąpiel, weekendowe pranie.  
- Dobiera czas i moc grzania, aby woda była gotowa na czas, ale nie grzała się bez potrzeby.  
  
**Efekt na ekranie:**  
- Plan: *„Jutro 7:30 – prysznic, zapotrzebowanie 60 l. Grzanie bojlera o 6:45.”*  
- Alert: *„Prognozowany brak ciepłej wody o 20:00, jeśli nie zmienisz planu grzania.”*  
  
**Migawka:** *„O co chodzi? AI wie, kiedy będziesz się myć, i grzeje wodę w ostatniej chwili.”*  
  
**Powiązania:** Funkcja 5.19, 12.6, 12.25.

---

### 10.21. Adaptacyjne zarządzanie ogrzewaniem (AI)  *(dawne 12.21)*

  
**Skąd czerpie dane:**  
- Z czujników temperatury wewnętrznej i zewnętrznej, prognoz pogody, obecności domowników.  
- Z historii zużycia energii i preferencji temperaturowych.  
  
**Gdzie ląduje:**  
- W module `adaptive_heating_ai`.  
  
**Jak działa logika:**  
- Model AI uczy się, jak budynek reaguje na zmiany temperatury zewnętrznej i pracę ogrzewania.  
- Dynamicznie dobiera moc i temperaturę zasilania, aby utrzymać komfort przy minimalnym zużyciu.  
- Uwzględnia bezwładność cieplną budynku i nadchodzące zmiany pogody (np. obniżenie temperatury przed nocą).  
- Reaguje na otwieranie okien, przebywanie domowników i inne zdarzenia.  
  
**Efekt na ekranie:**  
- Komunikat: *„AI obniżyło temperaturę w salonie do 19°C na noc, bo nikogo nie ma. Oszczędzono 1,2 kWh.”*  
- Wykres: *„Rzeczywista temperatura vs. zadana.”*  
  
**Migawka:** *„O co chodzi? Ogrzewanie sterowane przez AI to jak doświadczony palacz, który wie, kiedy dołożyć, a kiedy przygasić.”*  
  
**Powiązania:** Funkcja 5.37, 12.19, 5.38.

---

### 10.22. Inteligentne sterowanie wentylacją  *(dawne 12.22)*

  
**Skąd czerpie dane:**  
- Z czujników CO2, wilgotności, temperatury, obecności.  
- Z prognoz pogody i jakości powietrza.  
  
**Gdzie ląduje:**  
- W module `smart_ventilation_ai`.  
  
**Jak działa logika:**  
- Model AI steruje rekuperacją i wentylatorami, aby utrzymać dobrą jakość powietrza przy minimalnym zużyciu energii.  
- Zwiększa wentylację, gdy stężenie CO2 rośnie lub wilgotność jest zbyt wysoka.  
- Ogranicza wentylację w nocy lub przy dużej różnicy temperatur, aby nie tracić ciepła.  
- Wykorzystuje bypass latem i odzysk ciepła zimą.  
  
**Efekt na ekranie:**  
- Status: *„Wentylacja: tryb oszczędny, CO2 650 ppm, wilgotność 55%.”*  
- Alert: *„Wilgotność wzrosła do 75% – zwiększam wentylację.”*  
  
**Migawka:** *„O co chodzi? AI pilnuje, żebyś oddychał świeżym powietrzem, ale nie wietrzył domu na oścież.”*  
  
**Powiązania:** Funkcja 5.3, 5.23, 12.21.

---

### 10.23. Wykrywanie zagrożeń pożarowych i zwarciowych  *(dawne 12.23)*

  
**Skąd czerpie dane:**  
- Z czujników dymu, temperatury, prądu, napięcia, iskrzenia.  
- Z historii zdarzeń i parametrów instalacji.  
  
**Gdzie ląduje:**  
- W module `fire_short_circuit_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje sygnały w czasie rzeczywistym w poszukiwaniu wzorców wskazujących na zwarcie lub pożar.  
- Wykrywa nagłe skoki prądu, wzrost temperatury w newralgicznych punktach, obecność dymu lub gazów.  
- Różnicuje fałszywe alarmy od realnych zagrożeń.  
- Automatycznie odłącza zasilanie zagrożonego obwodu i uruchamia procedury awaryjne.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto zwarcie w obwodzie baterii. Odłączono zasilanie i uruchomiono wentylację.”*  
- Status: *„System monitoruje 24 punkty pomiarowe.”*  
  
**Migawka:** *„O co chodzi? AI potrafi odróżnić zwarcie od zwykłego poboru prądu i zareagować szybciej niż bezpiecznik.”*  
  
**Powiązania:** Funkcja 7.45, 11.53, 12.51.

---

### 10.24. Personalizacja trybów pracy (domowników)  *(dawne 12.24)*

  
**Skąd czerpie dane:**  
- Z profili użytkowników, ich preferencji, harmonogramów.  
- Z interakcji z systemem i historii użytkowania.  
  
**Gdzie ląduje:**  
- W module `personalized_modes_ai`.  
  
**Jak działa logika:**  
- Model AI tworzy indywidualne tryby pracy dla każdego domownika.  
- Przykłady: „tryb Marka” – chłodniej w sypialni, „tryb Ani” – cieplej w łazience rano.  
- System rozpoznaje, kto jest w domu, i automatycznie przełącza tryby.  
- Uwzględnia preferencje dotyczące oświetlenia, muzyki, temperatury, wentylacji.  
  
**Efekt na ekranie:**  
- Komunikat: *„Wykryto Annę – przełączam na tryb: temperatura 22°C, podłogówka w łazience, delikatne oświetlenie.”*  
- Lista: *„Profile: Marek, Anna, Gość, Dom pusty.”*  
  
**Migawka:** *„O co chodzi? Dom dostosowuje się do osoby, która w nim jest, jak lokaj.”*  
  
**Powiązania:** Funkcja 12.6, 12.19, 12.49.

---

### 10.25. Prognozowanie opadów i uzysku wody deszczowej  *(dawne 12.25)*

  
**Skąd czerpie dane:**  
- Z prognoz pogody (opady, intensywność, czas trwania).  
- Z danych o powierzchni dachu i systemie zbierania deszczówki.  
- Z historii opadów i napełnienia zbiorników.  
  
**Gdzie ląduje:**  
- W module `rainwater_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI przewiduje ilość deszczu, którą można zebrać w nadchodzących dniach.  
- Uwzględnia powierzchnię dachu, spływność, pojemność zbiorników.  
- Prognozuje, o ile wzrośnie poziom wody i kiedy zbiorniki będą pełne.  
- Informuje użytkownika o planowanym uzysku i czasie uzupełnienia zapasów.  
  
**Efekt na ekranie:**  
- Komunikat: *„Prognoza: jutro 15 mm deszczu. Zbierzesz ok. 1200 l. Zbiornik napełni się do 80%.”*  
- Wykres: *„Przewidywany poziom wody w zbiorniku w ciągu 7 dni.”*  
  
**Migawka:** *„O co chodzi? AI patrzy w chmury i mówi, ile wody spadnie Ci prosto do beczki.”*  
  
**Powiązania:** Funkcja 12.26, 12.28, 12.30.

---

### 10.26. Bilans wody – ile mamy, ile zużywamy, ile przybędzie  *(dawne 12.26)*

  
**Skąd czerpie dane:**  
- Z poziomu wody w zbiornikach, zużycia wody, prognoz opadów.  
- Z historii zużycia i napełnień.  
  
**Gdzie ląduje:**  
- W module `water_balance_ai`.  
  
**Jak działa logika:**  
- Model AI oblicza bieżący bilans wody: stan magazynu, przewidywane zużycie, przewidywane zasilenie.  
- Prognozuje, na ile dni wystarczy wody przy obecnym tempie zużycia.  
- Porównuje z prognozą opadów i wskazuje, czy wystarczy do kolejnego deszczu.  
- Generuje alerty, gdy grozi niedobór lub nadmiar (przepełnienie).  
  
**Efekt na ekranie:**  
- Status: *„Wody wystarczy na 6 dni. Do prognozowanego deszczu: 4 dni. Bilans: bezpieczny.”*  
- Alert: *„Uwaga: przy obecnym zużyciu zabraknie wody przed deszczem. Rozważ oszczędzanie.”*  
  
**Migawka:** *„O co chodzi? AI pilnuje Twojego zapasu wody jak bankier konta.”*  
  
**Powiązania:** Funkcja 12.25, 12.27, 12.29.

---

### 10.27. Doradca zużycia wody (prysznic, pralka, toaleta)  *(dawne 12.27)*

  
**Skąd czerpie dane:**  
- Z bilansu wody i prognoz opadów.  
- Z preferencji użytkownika i priorytetów zużycia.  
- Z historii zużycia wody przez poszczególne urządzenia i czynności.  
  
**Gdzie ląduje:**  
- W module `water_consumption_advisor_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje, ile wody zużywa każda czynność: prysznic, pranie, toaleta, zmywanie.  
- Gdy prognozowany jest niedobór, AI proponuje konkretne redukcje:  
  - „Weź krótszy prysznic (5 min zamiast 10) – oszczędzisz 30 l.”  
  - „Nie zmywaj toalety po każdym sikaniu – oszczędzisz 18 l dziennie.”  
  - „Przełóż pranie na pojutrze, gdy spadnie deszcz.”  
- Użytkownik może nacisnąć „oblicz rozwiązania”, a AI przedstawi warianty z różnymi ograniczeniami.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Aby starczyło do deszczu: 1 prysznic dziennie zamiast 2, pranie tylko raz w tygodniu, toaleta spłukiwana raz dziennie.”*  
- Warianty: *„Opcja A: mniej prysznica; Opcja B: mniej prania; Opcja C: mniej spłukiwania.”*  
  
**Migawka:** *„O co chodzi? AI powie Ci, jak oszczędzać wodę, żeby przetrwać do deszczu.”*  
  
**Powiązania:** Funkcja 12.26, 12.29, 12.50.

---

### 10.28. Zarządzanie zrzutem z oczyszczalni przed deszczem  *(dawne 12.28)*

  
**Skąd czerpie dane:**  
- Z poziomu ścieków w oczyszczalni lub szambie.  
- Z prognoz opadów i pojemności zbiorników na deszczówkę.  
- Z historii zrzutów i napełnień.  
  
**Gdzie ląduje:**  
- W module `sewage_discharge_ai`.  
  
**Jak działa logika:**  
- Gdy prognozowane są duże opady, AI zaleca wykonanie kontrolowanego zrzutu z oczyszczalni, aby zrobić miejsce na nadmiar wody deszczowej.  
- Oblicza optymalny moment zrzutu (np. na 1 dzień przed deszczem) i ilość do spuszczenia.  
- Automatycznie steruje zaworem zrzutu, jeśli jest podłączony do systemu.  
- Informuje użytkownika o wykonanej akcji i jej przyczynie.  
  
**Efekt na ekranie:**  
- Komunikat: *„Prognozowany deszcz 30 mm za 2 dni. Wykonano zrzut 200 l z oczyszczalni, aby przygotować miejsce.”*  
- Status: *„Poziom ścieków: 60%. Miejsce na deszczówkę: 40%.”*  
  
**Migawka:** *„O co chodzi? AI robi miejsce w szambie przed ulewą, żeby nic się nie przelało.”*  
  
**Powiązania:** Funkcja 6.31, 12.25, 11.44.

---

### 10.29. Uczenie się wzorców zużycia wody  *(dawne 12.29)*

  
**Skąd czerpie dane:**  
- Z czujników przepływu wody, liczników, historii zużycia.  
- Z pory dnia, dnia tygodnia, obecności domowników.  
  
**Gdzie ląduje:**  
- W module `water_usage_pattern_learning_ai`.  
  
**Jak działa logika:**  
- Model AI identyfikuje typowe czynności: prysznic, kąpiel, pranie, spłukiwanie toalety, zmywanie.  
- Uczy się, kiedy i ile wody zużywa każdy domownik.  
- Tworzy profil zużycia wody dla całego domu i poszczególnych osób.  
- Wykorzystuje te wzorce do prognoz i doradztwa.  
  
**Efekt na ekranie:**  
- Komunikat: *„Nauczyłem się, że w niedzielę wieczorem zużywasz 150 l na kąpiel i pranie. Prognozuję podobne zużycie w najbliższą niedzielę.”*  
- Wykres: *„Typowy profil zużycia wody w tygodniu.”*  
  
**Migawka:** *„O co chodzi? AI uczy się, kiedy bierzesz prysznic i ile wody lejesz, żeby lepiej planować.”*  
  
**Powiązania:** Funkcja 12.6, 12.20, 12.26.

---

### 10.30. Predykcja zużycia wody w cyklu dobowym  *(dawne 12.30)*

  
**Skąd czerpie dane:**  
- Z profili zużycia wody i historycznych danych.  
- Z planowanych czynności i obecności domowników.  
  
**Gdzie ląduje:**  
- W module `daily_water_prediction_ai`.  
  
**Jak działa logika:**  
- Model AI przewiduje zużycie wody w kolejnych 24 godzinach z rozbiciem na godziny.  
- Uwzględnia typowe pory kąpieli, gotowania, prania.  
- Prognozuje momenty szczytowego zużycia.  
- Pomaga w planowaniu grzania wody i zarządzaniu zapasami.  
  
**Efekt na ekranie:**  
- Wykres: *„Jutro zużycie wody: rano 40 l, południe 20 l, wieczór 80 l. Szczyt 19:00.”*  
- Status: *„Prognoza zużycia: 140 l/dobę.”*  
  
**Migawka:** *„O co chodzi? AI wie, kiedy poleci woda z kranu, i przygotowuje na to system.”*  
  
**Powiązania:** Funkcja 12.29, 12.26, 12.20.

---

### 10.31. Prognozowanie burz śniegowych i oblodzenia paneli  *(dawne 12.31)*

  
**Skąd czerpie dane:**  
- Z prognoz pogody (opady śniegu, temperatura, wiatr, wilgotność).  
- Z historii produkcji PV podczas opadów śniegu i oblodzenia.  
- Z czujników temperatury i nasłonecznienia.  
  
**Gdzie ląduje:**  
- W module `snow_ice_forecast_ai`.  
  
**Jak działa logika:**  
- Model AI przewiduje prawdopodobieństwo wystąpienia burzy śniegowej lub oblodzenia.  
- Uwzględnia lokalne warunki: temperaturę, wilgotność, kierunek wiatru, szadź.  
- Prognozuje czas trwania i intensywność opadów.  
- Szacuje, kiedy panele zostaną zasypane i produkcja PV spadnie.  
- Generuje powiadomienia o nadchodzącym zagrożeniu.  
  
**Efekt na ekranie:**  
- Alert: *„Jutro 14:00 prognozowana burza śniegowa. Panele mogą zostać zasypane do 16:00.”*  
- Wykres: *„Przewidywany spadek produkcji PV podczas śnieżycy.”*  
  
**Migawka:** *„O co chodzi? AI patrzy w niebo i mówi, kiedy śnieg uderzy w panele.”*  
  
**Powiązania:** Funkcja 12.32, 7.40, 6.7.

---

### 10.32. Planowanie odśnieżania paneli  *(dawne 12.32)*

  
**Skąd czerpie dane:**  
- Z prognoz śniegu i oblodzenia.  
- Z kąta nachylenia paneli, ich dostępności, narzędzi odśnieżania.  
- Z prognoz produkcji PV i strat.  
  
**Gdzie ląduje:**  
- W module `snow_clearing_plan_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje, czy odśnieżanie paneli ma sens ekonomiczny i energetyczny.  
- Uwzględnia: grubość śniegu, rodzaj śniegu (sypki/mokry), dalszą pogodę (czy słońce wróci).  
- Proponuje optymalny moment odśnieżania, np. rano po ustaniu opadów, zanim słońce się wzmoże.  
- Szacuje czas potrzebny na odśnieżenie i liczbę paneli do oczyszczenia.  
- Uwzględnia bezpieczeństwo: odśnieżanie na dachu vs. na ziemi.  
  
**Efekt na ekranie:**  
- Rekomendacja: *„Odśnież panele jutro o 8:00, zanim słońce wzrośnie. Szacowany czas: 30 min. Odzyskasz 2,5 kWh.”*  
- Alert: *„Nie opłaca się odśnieżać – dalsze opady śniegu przez cały dzień.”*  
  
**Migawka:** *„O co chodzi? AI powie Ci, czy warto wychodzić z łopatą, czy lepiej zostać przy herbacie.”*  
  
**Powiązania:** Funkcja 12.31, 7.41, 6.7.

---

### 10.33. Predykcja deficytu energii w mrozy  *(dawne 12.33)*

  
**Skąd czerpie dane:**  
- Z prognoz temperatury i produkcji PV.  
- Z zapotrzebowania na ogrzewanie, stanu baterii, pracy agregatu.  
- Z historii deficytów w mroźne dni.  
  
**Gdzie ląduje:**  
- W module `cold_deficit_prediction_ai`.  
  
**Jak działa logika:**  
- Model AI przewiduje dni, w których zapotrzebowanie na energię przewyższy produkcję PV i pojemność baterii.  
- Uwzględnia spadek sprawności baterii przy mrozie i wzrost zużycia przez grzałki BMS.  
- Prognozuje godziny, w których wystąpi deficyt.  
- Zaleca przygotowania: doładowanie baterii, sprawdzenie agregatu, ograniczenie zużycia.  
  
**Efekt na ekranie:**  
- Alert: *„Prognozowany deficyt 5 kWh w środę (mroźny poranek). Zalecam naładowanie baterii do 100% we wtorek.”*  
- Wykres: *„Przewidywany bilans energii w mroźnym tygodniu.”*  
  
**Migawka:** *„O co chodzi? AI wie, że mróz zje baterię szybciej, i ostrzega z wyprzedzeniem.”*  
  
**Powiązania:** Funkcja 6.39, 12.4, 6.14.

---

### 10.34. Proaktywne sprawdzanie generatora i webasto  *(dawne 12.34)*

  
**Skąd czerpie dane:**  
- Z harmonogramu przeglądów, prognoz pogody, historii pracy generatora i webasto.  
- Z czujników i testów rozruchowych.  
  
**Gdzie ląduje:**  
- W module `generator_webasto_proactive_check_ai`.  
  
**Jak działa logika:**  
- Gdy prognozowane są niskie temperatury lub burze, AI zaleca test generatora i webasto przed nadejściem zimy.  
- Sprawdza, kiedy ostatnio urządzenia były uruchamiane i czy przeszły test poprawnie.  
- Przypomina o sprawdzeniu paliwa, oleju, akumulatora rozruchowego, drożności układu wydechowego.  
- Może automatycznie uruchomić test, jeśli urządzenia są podłączone do systemu.  
  
**Efekt na ekranie:**  
- Alert: *„Zbliża się mroźny tydzień. Generator nie był uruchamiany od 30 dni. Przeprowadź test rozruchowy.”*  
- Status: *„Test webasto: OK. Test generatora: OK.”*  
  
**Migawka:** *„O co chodzi? AI każe Ci sprawdzić zapasowe źródła ciepła i prądu, zanim przyjdzie zima.”*  
  
**Powiązania:** Funkcja 12.33, 6.9, 12.36.

---

### 10.35. Autonomiczne zarządzanie generatorami (AI)  *(dawne 12.35)*

  
**Skąd czerpie dane:**  
- Z zapotrzebowania na energię, SoC baterii, prognoz produkcji PV.  
- Z parametrów generatora: paliwo, moc, zużycie, stan techniczny.  
  
**Gdzie ląduje:**  
- W module `autonomous_generator_ai`.  
  
**Jak działa logika:**  
- Model AI samodzielnie decyduje, kiedy uruchomić i zatrzymać generator.  
- Uwzględnia: koszt paliwa, żywotność generatora, ładowanie baterii, prognozy pogody.  
- Optymalizuje pracę generatora, aby uniknąć niepotrzebnych startów i zużycia paliwa.  
- Automatycznie uruchamia generator przed przewidywanym deficytem, a nie dopiero po rozładowaniu baterii.  
  
**Efekt na ekranie:**  
- Status: *„AI uruchomiło generator na 2 godziny, aby naładować baterię przed mroźną nocą.”*  
- Komunikat: *„Oszczędzono 1,5 l paliwa dzięki lepszemu planowaniu.”*  
  
**Migawka:** *„O co chodzi? AI jak pilot dba o to, żeby generator pracował tylko wtedy, gdy naprawdę trzeba.”*  
  
**Powiązania:** Funkcja 12.34, 6.9, 12.7.

---

### 10.36. Generalny audyt zimowy (test generatora i webasto)  *(dawne 12.36)*

  
**Skąd czerpie dane:**  
- Z listy zadań serwisowych, historii testów, prognoz zimy.  
- Z instrukcji producentów i zaleceń AI.  
  
**Gdzie ląduje:**  
- W module `winter_audit_ai`.  
  
**Jak działa logika:**  
- Na początku zimy AI generuje kompletną listę kontrolną:  
  - test generatora,  
  - test webasto,  
  - sprawdzenie paliwa i oleju,  
  - sprawdzenie akumulatora rozruchowego,  
  - kontrola grzałek BMS,  
  - sprawdzenie odśnieżania paneli,  
  - kontrola izolacji rur.  
- Użytkownik nie może przejść dalej bez potwierdzenia wykonania wszystkich punktów.  
- AI śledzi wyniki i przypomina o powtórnym teście, jeśli pierwszy był negatywny.  
  
**Efekt na ekranie:**  
- Checklista: *„Test generatora: OK. Test webasto: OK. Paliwo: 80%. Izolacja rur: sprawdzona.”*  
- Alert: *„Generator nie przeszedł testu. Powtórz sprawdzenie przed zimą.”*  
  
**Migawka:** *„O co chodzi? To przegląd przed zimą. Wszystko musi działać, zanim spadnie śnieg.”*  
  
**Powiązania:** Funkcja 12.34, 6.14, 7.32.

---

### 10.37. Zasada „nigdy nie zabraknie ciepła, wody, powietrza”  *(dawne 12.37)*

  
**Skąd czerpie dane:**  
- Z monitoringu wszystkich krytycznych systemów: ogrzewanie, woda, wentylacja.  
- Z prognoz i historii awarii.  
  
**Gdzie ląduje:**  
- W module `mission_critical_ai`.  
  
**Jak działa logika:**  
- Model AI działa według nadrzędnej zasady: **użytkownikowi nie może zabraknąć ciepła, wody ani czystego powietrza.**  
- Wykrywa zagrożenia dla tych trzech zasobów i nadaje im najwyższy priorytet.  
- Automatycznie uruchamia procedury awaryjne: przełącza źródła energii, ogranicza zużycie niekrytyczne, aktywuje zapasowe systemy.  
- Informuje użytkownika o zagrożeniu i podjętych działaniach.  
- Uczy się, jakie scenariusze prowadziły do niedoborów, i zapobiega im w przyszłości.  
  
**Efekt na ekranie:**  
- Status: *„Priorytet misji: ciepło, woda, powietrze – wszystko w normie.”*  
- Alert: *„Zagrożenie dla ogrzewania! AI przełącza zasilanie na agregat i ogranicza zużycie prądu.”*  
  
**Migawka:** *„O co chodzi? To pierwsza zasada systemu. Reszta może poczekać, ale nie ciepło, woda i powietrze.”*  
  
**Powiązania:** Funkcja 12.23, 12.33, 12.51.

---

### 10.38. Interaktywne symulacje scenariuszy z AI  *(dawne 12.38)*

  
**Skąd czerpie dane:**  
- Z modelu systemu i danych historycznych.  
- Z pytania użytkownika: „co by było, gdyby…?”  
  
**Gdzie ląduje:**  
- W module `ai_scenario_simulation`.  
  
**Jak działa logika:**  
- Użytkownik zadaje pytanie, np. „co się stanie, jeśli wyłączę pompę ciepła na noc?”  
- AI uruchamia symulację na modelu cyfrowym systemu.  
- Przewiduje skutki: temperaturę w domu, zużycie baterii, koszty, komfort.  
- Przedstawia wyniki w formie wykresów i rekomendacji.  
  
**Efekt na ekranie:**  
- Komunikat: *„Jeśli wyłączysz pompę ciepła na noc, temperatura spadnie do 15°C, bateria zaoszczędzi 2 kWh. Rekomenduję pozostawić ją w trybie eco.”*  
- Wykres: *„Symulacja temperatury przy wyłączonej pompie.”*  
  
**Migawka:** *„O co chodzi? Zanim coś zmienisz, zapytaj AI, co się stanie. To jak próba przed premierą.”*  
  
**Powiązania:** Funkcja 7.47, 12.42, 12.45.

---

### 10.39. Uczenie się sezonowych wzorców  *(dawne 12.39)*

  
**Skąd czerpie dane:**  
- Z długoterminowych danych: produkcja PV, zużycie energii, temperatura, woda, opady.  
- Z historii sezonów.  
  
**Gdzie ląduje:**  
- W module `seasonal_pattern_learning_ai`.  
  
**Jak działa logika:**  
- Model AI analizuje zmiany zachodzące w cyklu rocznym.  
- Uczy się, jak system zachowuje się wiosną, latem, jesienią i zimą.  
- Wykorzystuje te wzorce do prognoz i planowania z wyprzedzeniem.  
- Dostosowuje strategie do nadchodzącego sezonu.  
  
**Efekt na ekranie:**  
- Komunikat: *„Na podstawie ostatnich 3 zim AI przewiduje wzrost zużycia energii o 15% w grudniu.”*  
- Status: *„Sezonowy model: zima – aktywne procedury mroźne.”*  
  
**Migawka:** *„O co chodzi? AI uczy się pór roku i wie, czego się spodziewać.”*  
  
**Powiązania:** Funkcja 12.45, 12.3, 12.31.

---

### 10.40. Personalizacja rekomendacji na podstawie preferencji  *(dawne 12.40)*

  
**Skąd czerpie dane:**  
- Z interakcji użytkownika z systemem.  
- Z jego wyborów, odrzuceń rekomendacji, ustawień.  
  
**Gdzie ląduje:**  
- W module `personalized_recommendations_ai`.  
  
**Jak działa logika:**  
- Model AI dostosowuje styl i treść rekomendacji do preferencji użytkownika.  
- Uczy się, które rady użytkownik akceptuje, a które ignoruje.  
- Personalizuje ton, poziom szczegółowości i zakres rekomendacji.  
- Z czasem rekomendacje stają się trafniejsze i mniej inwazyjne.  
  
**Efekt na ekranie:**  
- Komunikat: *„Wiem, że wolisz mniej powiadomień. Wysyłam tylko alerty krytyczne i jedną rekomendację dziennie.”*  
- Status: *„Profil rekomendacji: minimalistyczny.”*  
  
**Migawka:** *„O co chodzi? AI uczy się Twojego stylu i nie zawraca Ci głowy tym, co nieistotne.”*  
  
**Powiązania:** Funkcja 12.49, 12.24, 12.11.

---

### 10.41. Asystent głosowy z AI (sterowanie i podpowiedzi)  *(dawne 12.41)*

  
**Skąd czerpie dane:**  
- Z modułu rozpoznawania mowy i przetwarzania języka naturalnego.  
- Z bieżących danych systemu, prognoz i rekomendacji AI.  
- Z preferencji użytkownika i historii rozmów.  
  
**Gdzie ląduje:**  
- W module `voice_ai_assistant`.  
  
**Jak działa logika:**  
- Użytkownik może wydawać polecenia głosowe, np.:  
  - „Jaki jest stan baterii?”  
  - „Włącz bojler.”  
  - „Czy jutro wystarczy wody?”  
- AI rozpoznaje intencję, analizuje kontekst i wykonuje akcję lub udziela odpowiedzi.  
- Uczy się stylu wypowiedzi użytkownika i skraca odpowiedzi.  
- W razie zagrożenia może sam rozpocząć rozmowę: „Uwaga, zbliża się burza. Zamknij okna i sprawdź generator.”  
  
**Efekt na ekranie:**  
- Transkrypcja rozmowy i potwierdzenie akcji.  
- Komunikat: *„Zapytano o stan baterii. Odpowiedź: SoC 78%, wystarczy na 14 godzin.”*  
  
**Migawka:** *„O co chodzi? Rozmawiasz z domem jak z członkiem załogi. On słucha i działa.”*  
  
**Powiązania:** Funkcja 12.40, 7.31, 12.37.

---

### 10.42. Raporty z komentarzem AI (co i dlaczego)  *(dawne 12.42)*

  
**Skąd czerpie dane:**  
- Z raportów dobowych, tygodniowych, miesięcznych.  
- Z analiz AI: produkcja, zużycie, anomalie, prognozy.  
  
**Gdzie ląduje:**  
- W module `ai_commentary_reports`.  
  
**Jak działa logika:**  
- System generuje raporty, w których AI dodaje zrozumiały komentarz do liczb.  
- Zamiast suchych danych użytkownik otrzymuje wyjaśnienie:  
  - co się wydarzyło,  
  - dlaczego,  
  - jakie to ma znaczenie,  
  - co zrobić dalej.  
- Komentarz jest personalizowany i dostosowany do poziomu wiedzy użytkownika.  
  
**Efekt na ekranie:**  
- Raport: *„Produkcja PV była dziś o 20% niższa niż zwykle, bo od 12:00 pojawiły się chmury. Dlatego bateria nie naładowała się do pełna. Jutro wraca słońce, więc nie ma powodu do obaw.”*  
  
**Migawka:** *„O co chodzi? AI tłumaczy Ci raporty jak dobry doradca, a nie zasypuje wykresami.”*  
  
**Powiązania:** Funkcja 12.44, 7.9, 12.40.

---

### 10.43. Wizualizacja przewidywanej pracy systemu  *(dawne 12.43)*

  
**Skąd czerpie dane:**  
- Z prognoz produkcji, zużycia, SoC, wody, temperatury.  
- Z planów AI i harmonogramów.  
  
**Gdzie ląduje:**  
- W module `ai_forecast_visualization`.  
  
**Jak działa logika:**  
- AI tworzy interaktywne wizualizacje przewidywanej pracy systemu.  
- Użytkownik może zobaczyć na osi czasu:  
  - kiedy bateria będzie się ładować,  
  - kiedy wzrośnie zużycie,  
  - kiedy nastąpi szczyt produkcji PV.  
- Wizualizacja obejmuje także wodę, temperaturę i pracę urządzeń.  
  
**Efekt na ekranie:**  
- Oś czasu: *„Jutro: 7:00 pobudka – grzanie wody; 11:00–15:00 ładowanie baterii; 18:00–21:00 szczyt zużycia.”*  
- Wykres: *„Przewidywany SoC i produkcja PV w 24 h.”*  
  
**Migawka:** *„O co chodzi? Zobaczysz przyszłość swojej instalacji na jednym ekranie.”*  
  
**Powiązania:** Funkcja 12.38, 7.24, 12.44.

---

### 10.44. Uczenie się z błędów prognoz (feedback loop)  *(dawne 12.44)*

  
**Skąd czerpie dane:**  
- Z porównania prognoz AI z rzeczywistymi pomiarami.  
- Z historii błędów prognoz.  
  
**Gdzie ląduje:**  
- W module `forecast_feedback_loop_ai`.  
  
**Jak działa logika:**  
- System stale porównuje prognozy z rzeczywistością.  
- Oblicza błąd prognozy (np. średni błąd absolutny, odchylenie).  
- Wykorzystuje te błędy do trenowania modelu AI.  
- Uczy się, które źródła prognoz były najbardziej wiarygodne.  
- Z czasem prognozy stają się dokładniejsze.  
  
**Efekt na ekranie:**  
- Status: *„Dokładność prognoz 24h: 93%. Błąd średni: 0,4 kWh.”*  
- Raport: *„AI poprawiło prognozy o 2% w porównaniu do zeszłego miesiąca.”*  
  
**Migawka:** *„O co chodzi? AI uczy się na własnych błędach. Im dłużej pracuje, tym lepiej przewiduje.”*  
  
**Powiązania:** Funkcja 12.45, 7.2, 12.3.

---

### 10.45. Autonomiczne korekty prognoz i modeli  *(dawne 12.45)*

  
**Skąd czerpie dane:**  
- Z feedback loop i nowych danych.  
- Z wykrytych anomalii i zmian w systemie.  
  
**Gdzie ląduje:**  
- W module `autonomous_model_adjustment_ai`.  
  
**Jak działa logika:**  
- System samodzielnie modyfikuje wagi i parametry modeli AI.  
- Reaguje na zmiany: degradację paneli, nowe urządzenia, zmiany zachowań domowników.  
- Bez udziału programisty poprawia jakość prognoz.  
- Zapisuje wersje modeli i umożliwia powrót do wcześniejszych, jeśli nowy model działa gorzej.  
  
**Efekt na ekranie:**  
- Status: *„Model prognostyczny zaktualizowany automatycznie po wykryciu nowego odbiornika.”*  
- Alert: *„Nowy model poprawił dokładność o 3,5%.”*  
  
**Migawka:** *„O co chodzi? AI samo się stroi jak instrument. Bez Twojej ingerencji.”*  
  
**Powiązania:** Funkcja 12.44, 7.3, 12.50.

---

### 10.46. Analiza jakości wody i powietrza (AI)  *(dawne 12.46)*

  
**Skąd czerpie dane:**  
- Z czujników jakości wody (mętność, pH, chlor, zanieczyszczenia).  
- Z czujników jakości powietrza (CO2, LZO, pyły, wilgotność).  
  
**Gdzie ląduje:**  
- W module `water_air_quality_ai`.  
  
**Jak działa logika:**  
- AI monitoruje parametry wody i powietrza.  
- Wykrywa odchylenia od normy i identyfikuje źródło problemu.  
- Ocena dotyczy:  
  - wody pitnej,  
  - wody deszczowej,  
  - wody w oczyszczalni,  
  - powietrza w pomieszczeniach.  
- Zaleca filtrację, czyszczenie zbiornika lub zwiększenie wentylacji.  
  
**Efekt na ekranie:**  
- Alert: *„Jakość powietrza w sypialni spadła: CO2 1400 ppm. Uruchamiam wentylację.”*  
- Status: *„Woda deszczowa: zdatna do podlewania, nie do picia.”*  
  
**Migawka:** *„O co chodzi? AI bada, czy woda i powietrze są bezpieczne dla Ciebie.”*  
  
**Powiązania:** Funkcja 11.40, 7.48, 12.37.

---

### 10.47. Wykrywanie przecieków wody  *(dawne 12.47)*

  
**Skąd czerpie dane:**  
- Z czujników przepływu, ciśnienia, wilgotności, akustyki rur.  
- Z bilansu wody i anomalii w zużyciu.  
  
**Gdzie ląduje:**  
- W module `water_leak_detection_ai`.  
  
**Jak działa logika:**  
- AI porównuje przepływ wody z oczekiwanym zużyciem.  
- Wykrywa ciągły, niewyjaśniony przepływ w nocy lub podczas nieobecności.  
- Analizuje dźwięk rur i spadki ciśnienia.  
- Określa prawdopodobne miejsce przecieku i automatycznie zamyka zawór główny.  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto przeciek w łazience: przepływ 0,5 l/min od 2:00. Zawór główny zamknięty.”*  
- Raport: *„Podejrzewany przeciek: uszczelka spłuczki. Zalecana naprawa.”*  
  
**Migawka:** *„O co chodzi? AI czuje, że woda ucieka z rur, i zatrzymuje ją, zanim zaleje dom.”*  
  
**Powiązania:** Funkcja 11.15, 12.26, 11.19.

---

### 10.48. Rekomendacje dotyczące modernizacji systemu wodnego  *(dawne 12.48)*

  
**Skąd czerpie dane:**  
- Z analizy zużycia wody, przecieków, jakości wody, bilansu zbiorników.  
- Z kosztów modernizacji i preferencji użytkownika.  
  
**Gdzie ląduje:**  
- W module `water_system_upgrade_ai`.  
  
**Jak działa logika:**  
- AI identyfikuje słabe punkty systemu wodnego:  
  - za mały zbiornik,  
  - brak drugiego zbiornika na deszczówkę,  
  - nieszczelne rury,  
  - brak filtracji,  
  - brak pompy zapasowej.  
- Szacuje koszty i oszczędności z modernizacji.  
- Rekomenduje najbardziej opłacalne ulepszenia.  
  
**Efekt na ekranie:**  
- Lista: *„1. Wymień uszczelkę w spłuczce – oszczędność 100 l dziennie. 2. Dodaj zbiornik 500 l na deszczówkę – koszt 800 zł.”*  
- Status: *„Modernizacja może zwiększyć bezpieczeństwo wodne o 30%.”*  
  
**Migawka:** *„O co chodzi? AI doradza, jak ulepszyć system wodny, żebyś nigdy nie został bez wody.”*  
  
**Powiązania:** Funkcja 12.47, 12.26, 12.25.

---

### 10.49. Samouczenie systemu na podstawie interakcji użytkownika  *(dawne 12.49)*

  
**Skąd czerpie dane:**  
- Z akcji użytkownika, wprowadzonych zmian, odrzuconych rekomendacji.  
- Z rozmów z asystentem głosowym i reakcji na alerty.  
  
**Gdzie ląduje:**  
- W module `user_interaction_learning_ai`.  
  
**Jak działa logika:**  
- AI obserwuje, jak użytkownik reaguje na komunikaty i rekomendacje.  
- Uczy się, co użytkownik akceptuje, co ignoruje, a co go irytuje.  
- Dostosowuje sposób działania: częstotliwość powiadomień, poziom automatyzacji, styl odpowiedzi.  
- Staje się coraz bardziej „osobistym asystentem” użytkownika.  
  
**Efekt na ekranie:**  
- Status: *„AI dostosowało harmonogram do Twoich reakcji: wyłączyło wieczorne alerty, które odrzucałeś.”*  
  
**Migawka:** *„O co chodzi? Im więcej rozmawiasz z systemem, tym lepiej Cię rozumie.”*  
  
**Powiązania:** Funkcja 12.40, 12.41, 12.50.

---

### 10.50. Autonomiczne korekty scenariuszy na podstawie doświadczeń  *(dawne 12.50)*

  
**Skąd czerpie dane:**  
- Z wyników wcześniejszych scenariuszy i automatyzacji.  
- Z porównania efektów z oczekiwaniami.  
  
**Gdzie ląduje:**  
- W module `autonomous_scenario_adjustment_ai`.  
  
**Jak działa logika:**  
- AI ocenia, czy zaprogramowane scenariusze działają poprawnie.  
- Wykrywa, że np. harmonogram grzania nie sprawdza się w weekendy i sam go modyfikuje.  
- Korekty są wprowadzane stopniowo i testowane w praktyce.  
- Użytkownik jest informowany o zmianach i może je cofnąć.  
  
**Efekt na ekranie:**  
- Komunikat: *„Scenariusz grzania wody został zmieniony: sobotni poranek z 7:00 na 8:30 na podstawie Twojego rytmu dnia.”*  
- Alert: *„Nowy scenariusz oszczędza 0,3 kWh dziennie.”*  
  
**Migawka:** *„O co chodzi? System sam poprawia swoje automatyzacje, gdy widzi, że coś nie gra.”*  
  
**Powiązania:** Funkcja 12.49, 7.17, 12.45.

---

## Moduł 11 (Kafel 11): Montaż baterii (LiFePO4 / kwasowo-ołowiowe)

*Dawne Rozdziały 9 i 10 — identyczny proces (weryfikacja → montaż mechaniczny → połączenia → BMS/balanser → uruchomienie → demontaż) opisany osobno dla dwóch chemii ogniw. Scalono w jeden tryb z przełącznikiem chemii na starcie; obie ścieżki zachowane w pełnej treści.*

**W UI:** ekran startowy „Jaką masz baterię?” → LiFePO4 / Kwasowo-ołowiowa (AGM/Żel/Trakcyjna) → reszta kroków identyczna w układzie, różna w treści.

### Ścieżka A: LiFePO4 *(dawny Rozdział 9)*

### 11.A.1. Weryfikacja kompletności i bezpieczeństwa przed montażem  *(dawne 9.1)*

  
**Skąd czerpie dane:** Z listy zakupowej wygenerowanej przez aplikację, z parametrów wybranych ogniw i BMS oraz z wprowadzonych przez użytkownika informacji o posiadanych elementach.  
  
**Gdzie ląduje:** W module `pre_assembly_check`.  
  
**Jak działa logika:**  
- System sprawdza, czy liczba ogniw odpowiada napięciu systemowemu:  
  - 12V = 4 ogniwa w szeregu (4S)  
  - 24V = 8 ogniw w szeregu (8S)  
  - 48V = 16 ogniw w szeregu (16S)  
- Weryfikuje, czy BMS ma odpowiednią liczbę przewodów balansujących (np. 17 przewodów dla 16S).  
- Sprawdza, czy użytkownik ma klucz dynamometryczny, miernik napięcia, izolację, bezpieczniki.  
- Przypomina o niezbędnych środkach ochrony: rękawice, okulary, gaśnica.  
  
**Efekt na ekranie:**  
- Checklista kompletności z polami „tak / nie”.  
- Alert, jeśli czegoś brakuje: *„Nie masz BMS z balanserem – bez tego montaż jest niebezpieczny.”*

---

### 11.A.2. Montaż mechaniczny pakietu  *(dawne 9.2)*

  
**Skąd czerpie dane:** Z wymiarów ogniw, zaleceń producenta (docisk), liczby ogniw i wybranej obudowy.  
  
**Gdzie ląduje:** W module `mechanical_assembly`.  
  
**Jak działa logika:**  
- System generuje schemat układu ogniw w obudowie.  
- Dla ogniw pryzmatycznych zaleca:  
  - płyty dociskowe z obu stron,  
  - pręty gwintowane M8 co ok. 20–30 cm,  
  - sprężyny talerzowe lub nakrętki z podkładkami,  
  - docisk ok. 3–4 N·m, ale z zachowaniem luzu na pęcznienie (ogniwa mogą urosnąć o 1–2%).  
- Wskazuje, aby separatory izolacyjne znalazły się między ogniwami.  
- Sprawdza, czy obudowa ma otwory wentylacyjne.  
  
**Efekt na ekranie:**  
- Rysunek 3D lub schemat rozmieszczenia ogniw.  
- Komunikat: *„Dla pakietu 16S 280Ah zastosuj 4 pręty M8. Dokręć z siłą 3 N·m, potem sprawdź po 24 h.”*  
- Ostrzeżenie: *„Nie używaj klucza udarowego!”*

---

### 11.A.3. Połączenia elektryczne ogniw (szeregowo i równolegle)  *(dawne 9.3)*

  
**Skąd czerpie dane:** Z konfiguracji pakietu (4S/8S/16S), z pojemności ogniw, z prądów maksymalnych.  
  
**Gdzie ląduje:** W module `cell_wiring`.  
  
**Jak działa logika:**  
- Dla połączenia szeregowego system generuje schemat: ogniwo 1 (+) → ogniwo 2 (–) itd.  
- Dla połączenia równoległego (tylko ogniwa o identycznych parametrach) system generuje schemat szyn zbiorczych.  
- Oblicza minimalny przekrój szyn i przewodów, aby nie było nadmiernych spadków napięć (odwołanie do funkcji 4.1).  
- Podaje wartości momentów dokręcania dla terminali:  
  - M6: 4,5 N·m  
  - M8: 8 N·m  
- Zaleca sprawdzenie wszystkich połączeń po 24 h.  
  
**Efekt na ekranie:**  
- Interaktywny schemat połączeń.  
- Instrukcja: *„Połącz ogniwa szeregowo: zacznij od B– (minus pakietu), potem plus pierwszego ogniwa z minusem drugiego itd.”*  
- Ostrzeżenie: *„Nie podłączaj ogniw o różnym napięciu równolegle – popłynie duży prąd wyrównawczy.”*

---

### 11.A.4. Podłączenie BMS – przewody balansujące, czujniki temperatury, główne przewody  *(dawne 9.4)*

  
**Skąd czerpie dane:** Z dokumentacji BMS (liczba przewodów, układ pinów, protokoły), z konfiguracji pakietu.  
  
**Gdzie ląduje:** W module `bms_connection`.  
  
**Jak działa logika:**  
- System krok po kroku prowadzi przez podłączenie:  
  1. **Przewody balansujące:** od B– (czarny) przez kolejne połączenia ogniw do B+ (czerwony). Każdy przewód musi być podłączony do właściwego punktu.  
  2. **Czujniki temperatury:** umieszczone między ogniwami (nie na zewnątrz obudowy).  
  3. **Główne przewody zasilające:** B– do minusa pakietu, P– do odbiornika/ładowarki, B+ do plusa pakietu.  
- System sprawdza napięcia na złączu BMS przed wpięciem wtyczki – wartości muszą rosnąć równomiernie o ok. 3,2 V na ogniwo.  
- Ostrzega przed odwrotnym podłączeniem.  
  
**Efekt na ekranie:**  
- Schemat BMS z opisem każdego przewodu.  
- Tabela napięć: *„Pin 1: 0 V, Pin 2: 3,2 V, Pin 3: 6,4 V...”*  
- Alert: *„Jeśli napięcie nie rośnie równomiernie, sprawdź kolejność przewodów balansujących!”*

---

### 11.A.5. Podłączenie BMS do falownika/MPPT – procedura pre-charge  *(dawne 9.5)*

  
**Skąd czerpie dane:** Z pojemności wejściowej falownika, napięcia systemu, rezystancji rezystora wstępnego.  
  
**Gdzie ląduje:** W module `precharge_procedure`.  
  
**Jak działa logika:**  
- System dobiera rezystor wstępny (np. 50 Ω / 50 W) i czas ładowania kondensatorów.  
- Instrukcja krok po kroku:  
  1. Podłącz rezystor wstępny między B+ baterii a wejście DC falownika (szeregowo).  
  2. Zaczekaj 3–5 sekund, aż napięcie na kondensatorach wzrośnie.  
  3. Dopiero wtedy załącz główny bezpiecznik/stycznik.  
  4. Odłącz rezystor.  
- Sprawdza komunikację BMS z falownikiem (CAN/RS485) i poprawność odczytu SoC.  
  
**Efekt na ekranie:**  
- Diagram podłączenia.  
- Komunikat: *„Zastosuj rezystor 50 Ω / 50 W. Czas wstępnego ładowania: 3 s.”*  
- Ostrzeżenie: *„Bez pre-charge zaiskrzy i uszkodzisz styki bezpiecznika.”*

---

### 11.A.6. Pierwsze uruchomienie i testy  *(dawne 9.6)*

  
**Skąd czerpie dane:** Z parametrów pakietu, BMS, falownika i ładowarki.  
  
**Gdzie ląduje:** W module `commissioning_tests`.  
  
**Jak działa logika:**  
- System uruchamia sekwencję testów:  
  1. **Test ładowania:** małym prądem (0,1C) przez 30 minut. Sprawdza balansowanie ogniw i różnice napięć.  
  2. **Test rozładowania:** umiarkowanym prądem (0,2C). Obserwuje spadki napięć i temperatury.  
  3. **Kalibracja SoC:** pełne naładowanie do 100% (napięcie 3,55 V/ogniwo, prąd końcowy <0,05C) i synchronizacja wskaźnika.  
- Zapisuje wyniki do dziennika systemowego (funkcja 3.26).  
- Jeśli różnica napięć ogniw > 0,1 V, zaleca sprawdzenie połączeń lub balanser aktywny.  
  
**Efekt na ekranie:**  
- Wykres napięć ogniw podczas testów.  
- Raport: *„Test zakończony pomyślnie. Różnica napięć ogniw: 0,02 V. BMS komunikuje się poprawnie.”*  
- Ostrzeżenie w razie problemów: *„Ogniwo #7 odbiega od reszty o 0,15 V – sprawdź dokręcenie śrub.”*

---

### 11.A.7. Procedura bezpiecznego odłączania i demontażu pakietu LiFePO4  *(dawne 9.7)*

  
**Skąd czerpie dane:** Z aktualnego stanu systemu (SoC, napięcia ogniw, tryb pracy), z konfiguracji pakietu (liczba ogniw, BMS) oraz z instrukcji montażu.  
  
**Gdzie ląduje:** W module `safe_disconnect_lifepo4`.  
  
**Jak działa logika:**  
System prowadzi użytkownika krok po kroku przez bezpieczne odłączenie i demontaż, minimalizując ryzyko iskrzenia, porażenia i uszkodzenia komponentów.  
  
**Kolejność odłączania (bezwzględnie przestrzegana):**  
1. **Zatrzymaj wszystkie obciążenia i ładowarki.** Wyłącz falownik, MPPT, agregat. Poczekaj, aż przestaną pobierać prąd.  
2. **Wyłącz BMS** (jeśli posiada fizyczny wyłącznik lub wejście Enable). Poczekaj na rozładowanie kondensatorów wewnętrznych.  
3. **Odłącz wtyczkę balansującą od BMS** (przewody balansujące), ale nie od ogniw.  
4. **Odłącz główne przewody zasilające:**  
   - najpierw **P–** (minus do obciążenia/ładowarki),  
   - potem **B–** (minus akumulatora),  
   - następnie **B+** (plus akumulatora).  
   - Zabezpiecz końcówki przewodów izolacją.  
5. **Dopiero teraz przystąp do demontażu ogniw:** odłącz połączenia szeregowe, zaczynając od najwyższego potencjału (np. od połączenia między ogniwem 16 a 15), schodząc w dół do najniższego. Przy każdym odkręceniu izoluj odsłonięte końcówki.  
  
**Warunki wstępne:**  
- Przed demontażem pakiet powinien być **rozładowany do bezpiecznego poziomu** – zalecane ok. 3,0–3,2 V na ogniwo (czyli 48V pakiet 16S: ok. 48–51 V). Zmniejsza to energię i ryzyko iskrzenia.  
- Używaj **izolowanych narzędzi**, rękawic ochronnych i okularów.  
- Pracuj na **nieprzewodzącym podłożu**.  
  
**Efekt na ekranie:**  
- Checklista z checkboxami, która prowadzi przez cały proces.  
- Ostrzeżenie: *„Nie odłączaj ogniw przy pełnym naładowaniu – ryzyko iskrzenia i uszkodzenia terminali.”*  
- Po zakończeniu: *„Demontaż zakończony. Ogniwa przechowuj w suchym miejscu, w temperaturze powyżej 0°C.”*  
  
**Powiązania:** Funkcja 3.7 (Pre-Charge – odwrotność), Funkcja 3.18 (Long Term Storage – dla odstawienia ogniw na zimę).

---

### 11.A.8. Kontrola wstępna ogniw przed montażem (Napięcie, IR, Wygląd)  *(dawne 9.8)*

  
**Skąd czerpie dane:**  
- Z pomiarów wykonanych przez użytkownika (miernik napięcia, tester rezystancji wewnętrznej).  
- Z oceny wizualnej ogniw.  
  
**Gdzie ląduje:**  
- W module `cell_pre_check`.  
  
**Jak działa logika:**  
- System prosi o wpisanie napięcia każdego ogniwa.  
- Sprawdza, czy różnica napięć między ogniwami nie przekracza 0.1 V (jeśli tak, zaleca wstępne wyrównanie).  
- Pyta o rezystancję wewnętrzną (IR) – odrzuca ogniwa z podejrzanie wysokim IR (np. > 0.5 mΩ dla dużych ogniw).  
- Wymaga potwierdzenia braku uszkodzeń mechanicznych (wgniecenia, przebicia, ślady korozji, puchnięcie).  
  
**Efekt na ekranie:**  
- Lista ogniw z polami do wpisania wartości.  
- Alert: *"Ogniwo #3 ma napięcie 2.8 V, reszta 3.2 V. Wyrównaj napięcie przed montażem, inaczej BMS będzie miał problem z balansowaniem."*  
  
**Migawka:** *"O co chodzi? Nie wkładaj do pakietu chorego ogniwa. Sprawdź je, zanim skręcisz całość."*

---

### 11.A.9. Przygotowanie stanowiska pracy i narzędzi izolowanych  *(dawne 9.9)*

  
**Skąd czerpie dane:**  
- Z listy niezbędnych narzędzi i warunków bezpieczeństwa.  
  
**Gdzie ląduje:**  
- W module `workstation_prep`.  
  
**Jak działa logika:**  
- System generuje checklistę:  
  - Mata izolacyjna na stole.  
  - Klucz dynamometryczny z nasadkami izolowanymi.  
  - Miernik napięcia (multimetr).  
  - Rękawice ochronne i okulary.  
  - Gaśnica (typ D lub piasek).  
  - Brak metalowych przedmiotów (zegarek, obrączka) na dłoniach.  
- Wymusza potwierdzenie, że stanowisko jest suche i nieprzewodzące.  
  
**Efekt na ekranie:**  
- Interaktywna lista "Zaznacz, jeśli masz".  
- Ostrzeżenie: *"Zdejmij metalową biżuterię! Zwarcie przez obrączkę to poważne poparzenie."*  
  
**Migawka:** *"O co chodzi? Prąd stały z ogniw jest bezlitosny. Przygotuj miejsce, zanim otworzysz pudło."*

---

### 11.A.10. Montaż mechaniczny – separacja ogniw i zabezpieczenie krawędzi  *(dawne 9.10)*

  
**Skąd czerpie dane:**  
- Z wymiarów ogniw i obudowy.  
  
**Gdzie ląduje:**  
- W module `mechanical_assembly_safety`.  
  
**Jak działa logika:**  
- System przypomina o umieszczeniu separatorów (np. żywica epoksydowa lub plastik) między ogniwami.  
- Sprawdza, czy krawędzie obudowy lub opasek nie przecinają izolacji (niebieskiej folii).  
- Zaleca stosowanie przekładek na rogach i pod płytami dociskowymi.  
- Podpowiada, aby nie stosować nadmiernego docisku (ogniwa muszą mieć luz na "oddychanie" podczas pracy).  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia separatorów.  
- Ostrzeżenie: *"Przetarcie niebieskiej folii = zwarcie ogniwa z obudową. Użyj dodatkowej izolacji na krawędziach."*  
  
**Migawka:** *"O co chodzi? Folia na ogniwie to jedyna bariera przed zwarciem. Chroń ją jak oka w głowie."*

---

### 11.A.11. Montaż elektryczny – kolejność łączenia i czyszczenie styków  *(dawne 9.11)*

  
**Skąd czerpie dane:**  
- Z konfiguracji pakietu (4S/8S/16S).  
  
**Gdzie ląduje:**  
- W module `electrical_assembly_order`.  
  
**Jak działa logika:**  
- System ustala kolejność: najpierw połączenia szeregowe (minus do plusa), potem szyny zbiorcze.  
- Zaleca przetarcie terminali alkoholem izopropylowym przed skręceniem.  
- Wymusza stosowanie podkładek i sprężyn (jeśli są w zestawie).  
- Przypomina o dokręcaniu na moment (M6: 4.5 Nm, M8: 8 Nm) i ponownym sprawdzeniu po 24h.  
  
**Efekt na ekranie:**  
- Instrukcja krok po kroku.  
- Ostrzeżenie: *"Brudny lub zaśniedziały terminal to wzrost rezystancji i grzanie się pakietu pod obciążeniem."*  
  
**Migawka:** *"O co chodzi? Czysty styk to szczęśliwy styk. Nie skręcaj na siłę, tylko z wyczuciem."*

---

### 11.A.12. Podłączenie BMS – kolejność złączy i pierwsze uruchomienie  *(dawne 9.12)*

  
**Skąd czerpie dane:**  
- Z dokumentacji BMS.  
  
**Gdzie ląduje:**  
- W module `bms_first_connection`.  
  
**Jak działa logika:**  
- System wyraźnie rozdziela kolejność:  
  1. Wtyczka balansująca (pomiarowa).  
  2. Przewody główne (B- do minusa, P- do odbiornika).  
  3. Sprawdzenie napięcia na wtyczce balansującej (musi rosnąć równomiernie).  
- Przypomina, aby NIE podłączać głównych przewodów przed balanserem (ryzyko uszkodzenia BMS).  
- Sprawdza komunikację (Bluetooth/UART) i odczyt temperatur.  
  
**Efekt na ekranie:**  
- Schemat połączeń BMS.  
- Alert: *"Jeśli napięcie na wtyczce balansującej nie rośnie sekwencyjnie, odłącz wszystko i sprawdź kolejność pinów!"*  
  
**Migawka:** *"O co chodzi? BMS to mózg. Najpierw podłącz mu czujniki (balanser), potem dopiero daj mu władzę (prąd główny)."*

---

### 11.A.13. Pierwsze ładowanie i test balansowania (Top Balancing)  *(dawne 9.13)*

  
**Skąd czerpie dane:**  
- Z parametrów ładowarki i BMS.  
  
**Gdzie ląduje:**  
- W module `first_charge_balance`.  
  
**Jak działa logika:**  
- System zaleca ładowanie małym prądem (np. 0.1C) do momentu, aż pierwsze ogniwo osiągnie 3.55 V.  
- Obserwuje, czy BMS zaczyna balansować (rozładowywać najwyższe ogniwo).  
- Sprawdza, czy różnica napięć spada zamiast rosnąć.  
- Podpowiada, kiedy uznać pakiet za gotowy (różnica < 0.010 V).  
  
**Efekt na ekranie:**  
- Wykres napięć ogniw podczas ładowania.  
- Komunikat: *"Balanser działa. Różnica napięć zmalała z 0.08 V do 0.015 V."*  
  
**Migawka:** *"O co chodzi? Pierwsze ładowanie to test dojrzałości pakietu. Sprawdź, czy BMS umie utrzymać porządek."*

---

### 11.A.14. Demontaż pakietu – w jakim stanie naładowania? (SoC)  *(dawne 9.14)*

  
**Skąd czerpie dane:**  
- Z aktualnego napięcia pakietu.  
  
**Gdzie ląduje:**  
- W module `dismantling_soc`.  
  
**Jak działa logika:**  
- System ustala bezpieczny poziom naładowania do demontażu (zalecane 30-50% SoC).  
- Wyjaśnia ryzyko: demontaż naładowanego pakietu (100% SoC) zwiększa energię iskrzenia i ryzyko zwarcia.  
- Demontaż rozładowanego (0% SoC) grozi zasiarczeniem lub uszkodzeniem ogniw.  
- Instruuje, jak rozładować pakiet do bezpiecznego poziomu (obciążenie rezystancyjne).  
  
**Efekt na ekranie:**  
- Alert: *"Pakiet ma 53.2 V (100% SoC). Rozładuj do ok. 51.5 V (40% SoC) przed demontażem."*  
- Instrukcja: *"Podłącz żarówkę lub grzałkę, aby obniżyć napięcie."*  
  
**Migawka:** *"O co chodzi? Nie rozbieraj naładowanego magazynu. Zredukuj energię, zanim ruszysz śruby."*

---

### 11.A.15. Procedura bezpiecznego odłączania BMS i balansera  *(dawne 9.15)*

  
**Skąd czerpie dane:**  
- Z konfiguracji BMS.  
  
**Gdzie ląduje:**  
- W module `safe_bms_disconnect`.  
  
**Jak działa logika:**  
- Kolejność demontażu:  
  1. Odłącz obciążenie (P-).  
  2. Odłącz B- (minus pakietu).  
  3. Odłącz wtyczkę balansującą.  
- Nigdy nie odłączaj wtyczki balansującej przy podłączonym B- lub P- (ryzyko uszkodzenia BMS).  
- Zabezpiecz końcówki wtyczki taśmą izolacyjną.  
  
**Efekt na ekranie:**  
- Diagram demontażu BMS.  
- Ostrzeżenie: *"Odłączenie wtyczki balansującej pod napięciem głównym może uszkodzić procesor BMS."*  
  
**Migawka:** *"O co chodzi? Najpierw odetnij prąd, potem czujniki. Jak w samochodzie."*

---

### 11.A.16. Ocena zużycia ogniwa po demontażu (Puchnięcie, Spadek mocy)  *(dawne 9.16)*

  
**Skąd czerpie dane:**  
- Z pomiarów użytkownika (grubość, napięcie, IR).  
  
**Gdzie ląduje:**  
- W module `cell_condition_assessment`.  
  
**Jak działa logika:**  
- System prosi o zmierzenie grubości ogniwa (puchnięcie).  
- Pyta o napięcie po 24h od demontażu (samorozładowanie).  
- Pyta o rezystancję wewnętrzną.  
- Klasyfikuje ogniwo: "Dobre", "Słabe", "Do utylizacji".  
  
**Efekt na ekranie:**  
- Tabela oceny.  
- Alert: *"Ogniwo #6 spuchło o 2 mm. Nie używaj go ponownie – ryzyko zwarcia wewnętrznego."*  
  
**Migawka:** *"O co chodzi? Spuchnięte ogniwo to tykająca bomba. Nie wkładaj go z powrotem do pakietu."*

---

### 11.A.17. Ratowanie głęboko rozładowanego ogniwa LiFePO4  *(dawne 9.17)*

  
**Skąd czerpie dane:**  
- Z pomiaru napięcia (0V, 1V, 2V).  
  
**Gdzie ląduje:**  
- W module `lifepo4_recovery`.  
  
**Jak działa logika:**  
- Jeśli napięcie > 1.5 V: system zaleca powolne ładowanie prądem 0.05C (np. 5A dla 100Ah) pod ścisłą obserwacją.  
- Jeśli napięcie 0 V: system zaleca utylizację, ale daje opcję "próby ratunkowej" przez zasilacz laboratoryjny.  
- Sprawdza, czy ogniwo się nie grzeje gwałtownie podczas ładowania (jeśli tak, natychmiast przerwać).  
- Ocenia realną pojemność po uratowaniu.  
  
**Efekt na ekranie:**  
- Alert: *"Ogniwo ma 0 V. Prawdopodobnie doszło do przebicia separatora. Próba ładowania grozi pożarem. Zalecana utylizacja."*  
- Instrukcja: *"Jeśli decydujesz się na ratunek, ustaw zasilacz na 3.0 V i limit prądu 0.5 A. Obserwuj temperaturę."*  
  
**Migawka:** *"O co chodzi? Głębokie rozładowanie to śmierć kliniczna ogniwa. Czasem da się je obudzić, ale zwykle to już trup."*

---

### 11.A.18. Przechowywanie ogniw i pakietów po demontażu  *(dawne 9.18)*

  
**Skąd czerpie dane:**  
- Z planowanego czasu przechowywania.  
  
**Gdzie ląduje:**  
- W module `cell_storage`.  
  
**Jak działa logika:**  
- System ustala optymalne warunki: 50% SoC (3.2 V), temperatura 10-25°C, sucho.  
- Zaleca izolowanie biegunów (taśma kaptonowa).  
- Zaleca ułożenie ogniw na nieprzewodzącej półce, z dala od materiałów palnych.  
- Przypomina o sprawdzeniu napięcia co 6 miesięcy.  
  
**Efekt na ekranie:**  
- Checklista przechowywania.  
- Ostrzeżenie: *"Nie przechowuj ogniw w garażu, gdzie temperatura spada poniżej -10°C."*  
  
**Migawka:** *"O co chodzi? Ogniwa to nie ziemniaki. Nie trzymaj ich byle gdzie."*

---

### 11.A.19. Utylizacja i recykling ogniw LiFePO4  *(dawne 9.19)*

  
**Skąd czerpie dane:**  
- Z powodu utylizacji.  
  
**Gdzie ląduje:**  
- W module `cell_recycling`.  
  
**Jak działa logika:**  
- System informuje, gdzie oddać zużyte ogniwa (punkty zbiórki, sklepy).  
- Zaleca rozładowanie ogniwa do 0 V przed oddaniem (przez zanurzenie w słonej wodzie na 48h - UWAGA: robić to na zewnątrz, pod nadzorem).  
- Odradza wyrzucanie do zwykłego kosza.  
  
**Efekt na ekranie:**  
- Instrukcja bezpiecznej utylizacji.  
- Ostrzeżenie: *"Nie wierć w ogniwie, nie zgniataj go i nie wrzucaj do ognia."*  
  
**Migawka:** *"O co chodzi? Nawet martwe ogniwo trzyma energię. Zneutralizuj je, zanim wyrzucisz."*

---

### 11.A.20. Specjalistyczne narzędzia do diagnostyki pakietów  *(dawne 9.20)*

  
**Skąd czerpie dane:**  
- Z potrzeb użytkownika.  
  
**Gdzie ląduje:**  
- W module `special_tools`.  
  
**Jak działa logika:**  
- System podpowiada, jakie narzędzia warto mieć:  
  - Tester rezystancji wewnętrznej (YR1035).  
  - Zasilacz laboratoryjny do balansowania.  
  - Tester pojemności (EBC-A20).  
  - Kamera termowizyjna (do szukania gorących punktów).  
  
**Efekt na ekranie:**  
- Lista narzędzi z orientacyjnymi cenami.  
- Komunikat: *"Tester IR to podstawa. Bez niego nie ocenisz stanu ogniwa."*  
  
**Migawka:** *"O co chodzi? Dobre narzędzia to połowa sukcesu. Nie zgaduj, tylko zmierz."*  
  
---  
  
## Rozdział 10: Instrukcja łączenia akumulatorów kwasowo-ołowiowych (AGM / Żel / Kwasowy / Trakcyjny) na 12V / 24V / 48V  
  
> **Cel rozdziału:** Zapewnić bezpieczne i efektywne łączenie akumulatorów kwasowo-ołowiowych w konfiguracje szeregowe (zwiększenie napięcia) i równoległe (zwiększenie pojemności). Rozdział obejmuje także dobór balanserów, kabli i zabezpieczeń.

---

### Ścieżka B: Kwasowo-ołowiowe (AGM / Żel / Kwasowy / Trakcyjny) *(dawny Rozdział 10)*

### 11.B.1. Weryfikacja kompletności i bezpieczeństwa przed montażem  *(dawne 10.1)*

  
**Skąd czerpie dane:** Z listy akumulatorów, ich pojemności (Ah), napięć, wieku i stanu naładowania.  
  
**Gdzie ląduje:** W module `lead_acid_precheck`.  
  
**Jak działa logika:**  
- System sprawdza, czy akumulatory są tego samego typu, pojemności i podobnego wieku.  
- Weryfikuje, czy napięcia spoczynkowe nie różnią się o więcej niż 0,1 V.  
- Przypomina o wentylacji pomieszczenia (gazy: wodór, tlen), o rękawicach i okularach ochronnych.  
- Wymusza obecność gaśnicy proszkowej i środka do neutralizacji kwasu.  
  
**Efekt na ekranie:**  
- Checklista: *„Czy wszystkie akumulatory są tego samego typu? Tak / Nie”*  
- Ostrzeżenie: *„Nie łącz akumulatorów o różnym wieku lub pojemności – starszy będzie przeciążany.”*

---

### 11.B.2. Montaż mechaniczny i lokalizacja  *(dawne 10.2)*

  
**Skąd czerpie dane:** Z liczby akumulatorów, ich wymiarów i wagi, z wybranego miejsca montażu.  
  
**Gdzie ląduje:** W module `lead_acid_mechanical`.  
  
**Jak działa logika:**  
- System proponuje rozmieszczenie akumulatorów na półce lub regale.  
- Sprawdza nośność podłoża (akumulatory trakcyjne bywają bardzo ciężkie).  
- Wymusza montaż w miejscu z wentylacją grawitacyjną lub mechaniczną, z dala od źródeł iskier.  
- Sugeruje zastosowanie wanien wychwytowych na wypadek wycieku elektrolitu.  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia z oznaczeniem odległości.  
- Komunikat: *„Zachowaj minimum 10 cm odstępu między akumulatorami, aby umożliwić odprowadzanie ciepła.”*

---

### 11.B.3. Połączenia szeregowe i równoległe (zwiększanie napięcia / pojemności)  *(dawne 10.3)*

  
**Skąd czerpie dane:** Z żądanego napięcia systemu (12/24/48V), pojemności akumulatorów i prądów obciążenia.  
  
**Gdzie ląduje:** W module `lead_acid_wiring`.  
  
**Jak działa logika:**  
- System generuje schemat:  
  - **Szeregowo:** dla 24V połącz dwa 12V (+ pierwszego do – drugiego). Dla 48V połącz cztery 12V szeregowo.  
  - **Równolegle:** połącz plusy razem i minusy razem, aby zwiększyć pojemność (Ah) przy zachowaniu napięcia.  
- Dobiera przekrój przewodów łączących (odwołanie do funkcji 4.1) – dla prądów rzędu 100 A minimum 35 mm².  
- Zaleca łączenie w gwiazdę (central busbar) zamiast kaskady, aby równomiernie obciążać akumulatory.  
- Podaje momenty dokręcania śrub: M8 – 8 N·m, M10 – 12 N·m.  
  
**Efekt na ekranie:**  
- Interaktywny schemat: *„Połącz akumulatory 1 i 2 szeregowo: (+) aku1 → (–) aku2. Napięcie wypadkowe: 24V.”*  
- Ostrzeżenie: *„Przy łączeniu równoległym upewnij się, że napięcia akumulatorów są równe, inaczej popłynie prąd wyrównawczy.”*

---

### 11.B.4. Balansery zewnętrzne i wyrównywanie napięć  *(dawne 10.4)*

  
**Skąd czerpie dane:** Z liczby akumulatorów w szeregu, ich napięć i pojemności.  
  
**Gdzie ląduje:** W module `lead_acid_balancing`.  
  
**Jak działa logika:**  
- System wyjaśnia, że akumulatory kwasowe w szeregu z czasem rozjeżdżają się napięciowo.  
- Proponuje zastosowanie zewnętrznego balansera (wyrównywacza napięć) – urządzenia podłączanego równolegle do każdego akumulatora w szeregu.  
- Dobiera balanser o prądzie wyrównawczym min. 5–10% pojemności akumulatora (np. 10 A dla 200 Ah).  
- Zaleca okresowe ładowanie wyrównawcze (napięciem podwyższonym o 2–3%) dla akumulatorów kwasowych zalewanych.  
  
**Efekt na ekranie:**  
- Schemat podłączenia balanserów do każdego akumulatora.  
- Komunikat: *„Dla zestawu 4 × 12V 200Ah szeregowo (48V) zastosuj 4 balansery 12V/10A.”*  
- Ostrzeżenie: *„Bez balanserów starszy akumulator będzie przeładowywany, a nowszy niedoładowywany.”*

---

### 11.B.5. Dobór kabli, bezpieczników i zabezpieczeń  *(dawne 10.5)*

  
**Skąd czerpie dane:** Z prądów ładowania i rozładowania, długości kabli, napięcia systemu.  
  
**Gdzie ląduje:** W module `lead_acid_protection`.  
  
**Jak działa logika:**  
- System oblicza minimalny przekrój przewodów łączących (odwołanie do funkcji 4.1).  
- Dobiera bezpieczniki i rozłączniki na podstawie prądu znamionowego (1,25 × I).  
- Wymusza zastosowanie bezpiecznika głównego przy biegunie dodatnim, blisko akumulatora.  
- Sprawdza, czy przekroje kabli są jednakowe dla wszystkich połączeń równoległych, aby uniknąć nierównomiernego obciążenia.  
  
**Efekt na ekranie:**  
- Tabela: *„Dla prądu 150 A i odległości 1,5 m: kabel 50 mm², bezpiecznik 175 A.”*  
- Ostrzeżenie: *„Bezpiecznik musi być jak najbliżej bieguna akumulatora – inaczej zwarcie nie będzie chronione.”*

---

### 11.B.6. Pierwsze uruchomienie i testy  *(dawne 10.6)*

  
**Skąd czerpie dane:** Z napięć akumulatorów, prądów ładowania, temperatury.  
  
**Gdzie ląduje:** W module `lead_acid_commissioning`.  
  
**Jak działa logika:**  
- System prowadzi przez testy:  
  1. **Pomiar napięcia spoczynkowego** każdego akumulatora.  
  2. **Test ładowania** prądem 0,1C, sprawdzenie równomierności napięć.  
  3. **Test rozładowania** umiarkowanym prądem, obserwacja spadków napięć.  
  4. **Kontrola temperatury** – nie może przekroczyć 45°C.  
- Zapisuje wyniki do dziennika.  
  
**Efekt na ekranie:**  
- Wykres napięć podczas testu.  
- Komunikat: *„Różnica napięć między akumulatorami po teście: 0,08 V – OK.”*  
- Ostrzeżenie: *„Jeśli temperatura któregokolwiek akumulatora gwałtownie rośnie, przerwij test i sprawdź połączenia.”*

---

### 11.B.7. Procedura bezpiecznego odłączania i demontażu akumulatorów kwasowo-ołowiowych  *(dawne 10.7)*

  
**Skąd czerpie dane:** Z liczby akumulatorów, ich napięć, stanu naładowania, lokalizacji i rodzaju połączeń.  
  
**Gdzie ląduje:** W module `safe_disconnect_lead_acid`.  
  
**Jak działa logika:**  
System prowadzi użytkownika przez bezpieczne rozłączenie zestawu akumulatorów, minimalizując ryzyko iskrzenia, wybuchu wodoru i poparzenia kwasem.  
  
**Kolejność odłączania (dla zestawu szeregowego/ równoległego):**  
1. **Wyłącz wszystkie odbiory i ładowarki.** Zatrzymaj falownik, regulator ładowania, agregat.  
2. **Otwórz wentylację** – odczekaj kilka minut, aby usunąć gazy (wodór) z okolicy akumulatorów.  
3. **Odłącz kabel od bieguna ujemnego (masy) jako pierwszy** – w instalacjach off-grid zwykle jest to minus całego zestawu. Zapobiega zwarciu przy przypadkowym dotknięciu narzędziem do obudowy.  
4. **Następnie odłącz kabel od bieguna dodatniego.**  
5. **Zdejmij balansery zewnętrzne** (jeśli były zamontowane) – odłącz przewody od każdego akumulatora.  
6. **Odłącz połączenia między akumulatorami:** zaczynaj od końca o wyższym potencjale (dodatniego), sukcesywnie w dół. Izoluj każdą odsłoniętą końcówkę.  
7. **Sprawdź napięcie** każdego akumulatora – zapisz do dziennika.  
  
**Bezpieczeństwo:**  
- Pracuj w **okularach ochronnych i rękawicach kwasoodpornych**.  
- Unikaj iskrzenia – nie dotykaj jednocześnie biegunów, nie używaj metalowych narzędzi bez izolacji.  
- Nie przechylaj akumulatorów – **elektrolit może wyciec**.  
- W pobliżu miej **gaśnicę proszkową** i środek neutralizujący kwas (soda oczyszczona).  
  
**Po demontażu:**  
- Akumulatory przechowuj w chłodnym, suchym i wentylowanym miejscu.  
- Naładuj je do ok. 50–60% SoC i sprawdzaj napięcie co 3–6 miesięcy (dotyczy zwłaszcza AGM/żel).  
  
**Efekt na ekranie:**  
- Interaktywna lista kroków z zaznaczaniem.  
- Ostrzeżenie: *„Nie odłączaj akumulatorów pod obciążeniem – łuk elektryczny może zapalić wodór.”*  
- Komunikat końcowy: *„Demontaż zakończony. Akumulatory zabezpieczone do przechowywania.”*  
  
**Powiązania:** Funkcja 10.4 (Balansery – demontaż), Funkcja 1.8 (Sezonowość – odstawienie na zimę).

---

### 11.B.8. Kontrola wstępna akumulatorów kwasowych przed montażem  *(dawne 10.8)*

  
**Skąd czerpie dane:**  
- Z pomiarów napięcia, poziomu elektrolitu, oceny wizualnej.  
  
**Gdzie ląduje:**  
- W module `lead_acid_precheck_2`.  
  
**Jak działa logika:**  
- Sprawdza napięcie spoczynkowe (12.6-12.8 V dla pełnego).  
- Wymaga sprawdzenia poziomu elektrolitu (w akumulatorach z korkami).  
- Pyta o wiek akumulatora (data produkcji na obudowie).  
- Ostrzega przed mieszaniem starych i nowych.  
  
**Efekt na ekranie:**  
- Lista kontrolna.  
- Alert: *"Akumulator #2 ma napięcie 11.9 V – jest niedoładowany. Naładuj go przed montażem."*  
  
**Migawka:** *"O co chodzi? Sprawdź akumulatory, zanim je połączysz. Oszczędzisz sobie awarii."*

---

### 11.B.9. Bezpieczeństwo pracy z kwasem – środki ochrony i neutralizacja  *(dawne 10.9)*

  
**Skąd czerpie dane:**  
- Z listy zagrożeń.  
  
**Gdzie ląduje:**  
- W module `lead_acid_safety`.  
  
**Jak działa logika:**  
- Wymusza stosowanie okularów i rękawic kwasoodpornych.  
- Zaleca dostęp do sody oczyszczonej (neutralizator kwasu).  
- Instruuje, co robić przy oparzeniu kwasem (płukać dużą ilością wody, nie mydłem).  
- Zabrania palenia i używania otwartego ognia.  
  
**Efekt na ekranie:**  
- Instrukcja BHP.  
- Ostrzeżenie: *"Kwas siarkowy wypala dziury w ubraniu i skórze. Nie lekceważ tego."*  
  
**Migawka:** *"O co chodzi? Kwas to nie woda. Chroń oczy i ręce."*

---

### 11.B.10. Czyszczenie biegunów i klemm przed podłączeniem  *(dawne 10.10)*

  
**Skąd czerpie dane:**  
- Z oceny stanu biegunów.  
  
**Gdzie ląduje:**  
- W module `terminal_cleaning`.  
  
**Jak działa logika:**  
- Zaleca czyszczenie biegunów szczotką drucianą lub papierem ściernym.  
- Połączenie smaruje się wazeliną techniczną (nie smarem miedzianym).  
- Sprawdza, czy klemy są odpowiedniego rozmiaru (nie za luźne).  
  
**Efekt na ekranie:**  
- Instrukcja czyszczenia.  
- Ostrzeżenie: *"Zaśniedziałe klemy to spadki napięcia i grzanie się instalacji."*  
  
**Migawka:** *"O co chodzi? Czysty styk to dobry styk. Wazelina chroni przed korozją."*

---

### 11.B.11. Montaż mechaniczny – mocowanie i wentylacja  *(dawne 10.11)*

  
**Skąd czerpie dane:**  
- Z miejsca montażu (pojazd, półka, skrzynia).  
  
**Gdzie ląduje:**  
- W module `lead_acid_mechanical_2`.  
  
**Jak działa logika:**  
- Wymusza stabilne mocowanie (pasy, obejmy).  
- Sprawdza wentylację (gazy!).  
- Zaleca montaż z dala od źródeł ciepła i iskier.  
- Zwraca uwagę na nierówności – akumulator musi stać poziomo.  
  
**Efekt na ekranie:**  
- Schemat mocowania.  
- Ostrzeżenie: *"Luźny akumulator w kamperze to pocisk w razie wypadku."*  
  
**Migawka:** *"O co chodzi? Akumulator musi stać stabilnie i mieć czym oddychać."*

---

### 11.B.12. Podłączanie balanserów zewnętrznych do zestawu  *(dawne 10.12)*

  
**Skąd czerpie dane:**  
- Z liczby akumulatorów w szeregu.  
  
**Gdzie ląduje:**  
- W module `lead_acid_balancer_install`.  
  
**Jak działa logika:**  
- Instruuje podłączenie balansera równolegle do każdego akumulatora.  
- Sprawdza, czy napięcie balansera pasuje (12V do 12V).  
- Zaleca stosowanie bezpieczników na przewodach balansera.  
  
**Efekt na ekranie:**  
- Schemat połączeń.  
- Ostrzeżenie: *"Balanser ratuje życie akumulatorów. Zamontuj go, zanim będzie za późno."*  
  
**Migawka:** *"O co chodzi? Balanser to lekarz rodzinny dla akumulatorów. Pilnuje, żeby żaden nie chorował."*

---

### 11.B.13. Test pojemności i gęstości elektrolitu (Areometr)  *(dawne 10.13)*

  
**Skąd czerpie dane:**  
- Z pomiarów użytkownika.  
  
**Gdzie ląduje:**  
- W module `lead_acid_test`.  
  
**Jak działa logika:**  
- System prosi o pomiar gęstości elektrolitu (dla akumulatorów z korkami).  
- Tabela: 1.28 g/cm3 = pełny, 1.20 = połowa, 1.12 = rozładowany.  
- Prosi o test obciążeniowy (np. żarówka 12V/50W na 10 minut).  
- Sprawdza spadek napięcia pod obciążeniem.  
  
**Efekt na ekranie:**  
- Tabela interpretacji wyników.  
- Alert: *"Gęstość 1.15 w jednej celi oznacza uszkodzenie tej celi. Akumulator do wymiany."*  
  
**Migawka:** *"O co chodzi? Zajrzyj do środka akumulatora. Gęstość kwasu mówi prawdę."*

---

### 11.B.14. Demontaż zestawu akumulatorów – kolejność odpinania klem  *(dawne 10.14)*

  
**Skąd czerpie dane:**  
- Z konfiguracji zestawu.  
  
**Gdzie ląduje:**  
- W module `lead_acid_dismantling`.  
  
**Jak działa logika:**  
- Wymusza kolejność: najpierw minus (masa), potem plus.  
- Przy rozpinaniu szeregu: od końca o najwyższym potencjale.  
- Zabezpiecza odpięte klemy taśmą.  
  
**Efekt na ekranie:**  
- Instrukcja krok po kroku.  
- Ostrzeżenie: *"Odpięcie plusa jako pierwszego grozi zwarciem przez klucz do masy pojazdu!"*  
  
**Migawka:** *"O co chodzi? Minus to bezpieczeństwo. Zawsze zdejmuj go pierwszy."*

---

### 11.B.15. Zabezpieczanie rozłączonego zestawu przed zwarciem  *(dawne 10.15)*

  
**Skąd czerpie dane:**  
- Z liczby rozłączonych przewodów.  
  
**Gdzie ląduje:**  
- W module `lead_acid_protection_2`.  
  
**Jak działa logika:**  
- Nakazuje założenie zaślepek na bieguny lub owinięcie taśmą.  
- Sprawdza, czy metalowe narzędzia nie leżą na akumulatorach.  
- Zaleca oznaczenie przewodów przed odłączeniem (fotografia).  
  
**Efekt na ekranie:**  
- Checklista zabezpieczeń.  
- Ostrzeżenie: *"Przypadkowe zwarcie kluczem to łuk elektryczny i poparzenia."*  
  
**Migawka:** *"O co chodzi? Po rozpięciu instalacji łatwo o wypadek. Zabezpiecz wszystko."*

---

### 11.B.16. Ocena zużycia akumulatora kwasowego (Siarczanowanie, Spadek napięcia)  *(dawne 10.16)*

  
**Skąd czerpie dane:**  
- Z obserwacji i pomiarów.  
  
**Gdzie ląduje:**  
- W module `lead_acid_wear`.  
  
**Jak działa logika:**  
- Pyta o objawy: długie ładowanie, szybkie rozładowanie, biały nalot na klemach.  
- Sprawdza, czy napięcie po naładowaniu szybko spada (samorozładowanie).  
- Klasyfikuje: "Sprawny", "Zasiarczony", "Uszkodzona cela".  
  
**Efekt na ekranie:**  
- Diagnoza: *"Akumulator szybko się rozładowuje i ma biały nalot. Prawdopodobne zasiarczenie."*  
  
**Migawka:** *"O co chodzi? Stary akumulator to studnia bez dna. Nie marnuj na niego prądu."*

---

### 11.B.17. Ratowanie zasiarczonego akumulatora kwasowego (Odsiarczanie)  *(dawne 10.17)*

  
**Skąd czerpie dane:**  
- Z diagnozy (zasiarczenie).  
  
**Gdzie ląduje:**  
- W module `lead_acid_desulfation`.  
  
**Jak działa logika:**  
- System opisuje metodę ładowania impulsowego lub długiego ładowania niskim prądem.  
- Zaleca ładowarki z trybem "Repair" lub "Desulfation".  
- Uczula, że nie każdy akumulator da się uratować (zwarcie w celi).  
  
**Efekt na ekranie:**  
- Instrukcja: *"Podłącz ładowarkę z trybem naprawy na 24h. Sprawdź, czy napięcie wzrosło i utrzymuje się."*  
  
**Migawka:** *"O co chodzi? Czasem da się obudzić akumulator z letargu, ale to nie cud."*

---

### 11.B.18. Przechowywanie akumulatorów kwasowych po demontażu  *(dawne 10.18)*

  
**Skąd czerpie dane:**  
- Z planowanego czasu przestoju.  
  
**Gdzie ląduje:**  
- W module `lead_acid_storage`.  
  
**Jak działa logika:**  
- Wymusza przechowywanie w pełni naładowanego akumulatora (zapobiega zamarzaniu).  
- Zaleca chłodne i suche miejsce.  
- Przypomina o doładowaniu konserwującym co 3-6 miesięcy.  
- Odradza stawianie bezpośrednio na betonie (wilgoć).  
  
**Efekt na ekranie:**  
- Checklista przechowywania.  
- Ostrzeżenie: *"Rozładowany akumulator kwasowy zimą zamarza i pęka. Zawsze przechowuj go naładowany."*  
  
**Migawka:** *"O co chodzi? Akumulator kwasowy to nie wino. Nie lubi leżeć w piwnicy zapomniany."*

---

### 11.B.19. Utylizacja i recykling akumulatorów kwasowych  *(dawne 10.19)*

  
**Skąd czerpie dane:**  
- Z decyzji o wymianie.  
  
**Gdzie ląduje:**  
- W module `lead_acid_recycling`.  
  
**Jak działa logika:**  
- System informuje o punktach zbiórki (sklepy, PSZOK).  
- Zwraca uwagę na kaucję (zwrot pieniędzy).  
- Kategorycznie zabrania wylewania kwasu do kanalizacji.  
  
**Efekt na ekranie:**  
- Lista punktów zbiórki.  
- Ostrzeżenie: *"Kwas z akumulatora to trucizna dla środowiska. Oddaj akumulator w całości."*  
  
**Migawka:** *"O co chodzi? Stary akumulator to surowiec wtórny i kasa za kaucję."*

---

### 11.B.20. Narzędzia i środki do serwisu akumulatorów kwasowych  *(dawne 10.20)*

  
**Skąd czerpie dane:**  
- Z potrzeb warsztatu.  
  
**Gdzie ląduje:**  
- W module `lead_acid_tools`.  
  
**Jak działa logika:**  
- Lista narzędzi: areometr, miernik napięcia, klucze izolowane, szczotka do klem, wazelina techniczna, ładowarka z funkcją odsiarczania, woda destylowana.  
  
**Efekt na ekranie:**  
- Lista zakupowa.  
  
**Migawka:** *"O co chodzi? Serwis kwasówek wymaga prostych narzędzi, ale muszą być."*

---

## Moduł 12 (Kafel 12): Szybki kalkulator / tryb mobilny

*Dawny Rozdział 8. Dwie grupy funkcji tworzyły powtarzalny wzorzec i zostały scalone w moduły zbiorcze z wyborem z listy zamiast osobnych ekranów: (a) kalkulatory zużycia per urządzenie [8.23–8.28], (b) tryby zasilania małych odbiorników [8.29–8.36]. Pełna treść zachowana jako pod-punkty.*

### 12.1. Tryb uproszczony – dobór akumulatora i odbiorników  *(dawne 8.1)*

  
**Skąd czerpie dane:**  
- Użytkownik wybiera typ i pojemność akumulatora oraz podłącza proste odbiorniki.  
  
**Gdzie ląduje:**  
- W wydzielonej, uproszczonej bazie `quick_calc`.  
  
**Jak działa logika:**  
- Oblicza czas pracy odbiorników na danym akumulatorze: czas = pojemność użyteczna / sumaryczny pobór.  
- Uwzględnia DoD i sprawność przetwornicy.  
  
**Efekt na ekranie:**  
- *„Akumulator AGM 100Ah (12V) zasili lodówkę 50W i 2 żarówki 10W przez 14 godzin.”*

---

### 12.2. Algorytm bezpieczeństwa – przewody, bezpieczniki, napięcie  *(dawne 8.2)*

  
**Skąd czerpie dane:**  
- Z prądu obciążenia i długości kabla.  
  
**Gdzie ląduje:**  
- W module `safety_check`.  
  
**Jak działa logika:**  
- Na podstawie prądu i napięcia system dobiera minimalny przekrój przewodu i bezpiecznik.  
- Jeśli prąd jest zbyt duży dla danego napięcia (np. >200 A przy 12V), sugeruje przejście na 24V.  
  
**Efekt na ekranie:**  
- *„Uwaga! Przy poborze 180 A przewód 16 mm² spłonie – zastosuj 35 mm² i bezpiecznik 200 A.”*

---

### 12.3. Gotowe szablony zestawów (Kamper / Jacht / Domek letniskowy / Warsztat)  *(dawne 8.3)*

  
**Skąd czerpie dane:**  
- Z wyboru użytkownika: typ obiektu (kamper, jacht, domek letniskowy, warsztat).  
- Z profilu użytkowania: liczba osób, dni pobytu, urządzenia.  
- Z bazy gotowych szablonów (listy odbiorników i czasów pracy).  
  
**Gdzie ląduje:**  
- W module `scenario_templates`.  
  
**Jak działa logika:**  
- Użytkownik wybiera jeden z czterech szablonów.  
- System ładuje predefiniowaną listę typowych odbiorników (np. dla kampera: lodówka 12V, oświetlenie LED, ładowarka USB, pompa wody, wentylator).  
- Każdemu odbiornikowi przypisuje domyślną moc i czas pracy na dobę.  
- Oblicza całkowite zapotrzebowanie dobowe (kWh/dobę) i szczytowe obciążenie (W).  
- Na tej podstawie dobiera minimalny zestaw: akumulator, panel, regulator.  
- Użytkownik może modyfikować listę i dodawać/usuwać urządzenia.  
  
**Efekt na ekranie:**  
- Lista odbiorników z mocami i czasami.  
- Podsumowanie: *„Zapotrzebowanie: 1,8 kWh/dobę, szczyt 400 W. Dobrany zestaw: akumulator LiFePO4 100Ah, panel 2 × 100W, regulator MPPT 20A.”*  
- Schemat podłączenia.  
  
**Migawka:** *„O co chodzi? Zamiast liczyć wszystko od zera, wybierasz scenariusz i dostajesz gotowy, sprawdzony zestaw.”*  
  
**Powiązania:** Funkcja 8.1, 8.2, 8.5.

---

### 12.4. Tryb „Mam akumulator – co mogę podłączyć?”  *(dawne 8.4)*

  
**Skąd czerpie dane:**  
- Od użytkownika: typ akumulatora (AGM, LiFePO4, kwasowy), pojemność (Ah), napięcie (12V/24V).  
- Z bazy urządzeń i ich poboru mocy.  
  
**Gdzie ląduje:**  
- W module `what_can_i_connect`.  
  
**Jak działa logika:**  
- Użytkownik wprowadza parametry posiadanego akumulatora.  
- System wylicza pojemność użyteczną w Wh (uwzględniając DoD).  
- Dla każdego urządzenia z bazy (oświetlenie, lodówka, ładowarka, pompa) oblicza, jak długo może pracować na tym akumulatorze.  
- Sortuje wyniki i pokazuje listę możliwych odbiorników z czasem pracy.  
- Ostrzega, jeśli podłączone urządzenie ma zbyt duży prąd rozruchowy lub moc.  
  
**Efekt na ekranie:**  
- Tabela: *„Akumulator 12V 100Ah (użyteczne 1,2 kWh). Lodówka turystyczna 50W – 24 h. Oświetlenie LED 20W – 60 h. Czajnik 1000W – 1,2 h (uwaga na prąd!).”*  
- Ostrzeżenie: *„Czajnik pobiera 100 A, co może przekroczyć maksymalny prąd akumulatora.”*  
  
**Migawka:** *„O co chodzi? Sprawdzasz, co faktycznie możesz podłączyć do akumulatora, żeby nie zniszczyć go na starcie.”*  
  
**Powiązania:** Funkcja 8.1, 8.6, 8.22.

---

### 12.5. Kalkulator „na weekend” (oświetlenie, ładowarki, radio)  *(dawne 8.5)*

  
**Skąd czerpie dane:**  
- Od użytkownika: liczba dni (2–3), liczba osób, lista urządzeń (oświetlenie LED, radio, ładowarki USB, wentylator).  
- Z bazy typowych mocy i czasów pracy.  
  
**Gdzie ląduje:**  
- W module `weekend_calculator`.  
  
**Jak działa logika:**  
- System sumuje zapotrzebowanie dobowe na podstawie typowego użytkowania weekendowego.  
- Uwzględnia, że w weekend zużycie jest zwykle mniejsze niż w stałym domku.  
- Dobiera minimalny akumulator i panel.  
- Oblicza, czy przy braku słońca (np. pochmurny weekend) bateria wystarczy na cały pobyt.  
  
**Efekt na ekranie:**  
- Komunikat: *„Na weekend potrzebujesz 800 Wh/dobę. Akumulator 12V 80Ah wystarczy na 2 dni bez słońca, pod warunkiem że nie używasz grzałek.”*  
- Lista rekomendowanych urządzeń.  
  
**Migawka:** *„O co chodzi? Jedziesz na działkę na dwa dni i chcesz wiedzieć, czy Twój zestaw da radę.”*  
  
**Powiązania:** Funkcja 8.3, 8.1, 8.9.

---

### 12.6. Szybki dobór paneli PV dla pojedynczego urządzenia  *(dawne 8.6)*

  
**Skąd czerpie dane:**  
- Od użytkownika: urządzenie (np. lodówka 50W, pompa 100W, oświetlenie 30W), czas pracy dziennie.  
- Z danych o nasłonecznieniu (uproszczona lokalizacja lub wartość średnia).  
  
**Gdzie ląduje:**  
- W module `single_device_pv`.  
  
**Jak działa logika:**  
- System oblicza dzienne zużycie energii przez urządzenie (W × h).  
- Przyjmuje, że w ciągu dnia panel będzie produkować przez X godzin przy średniej mocy (np. 70% mocy nominalnej).  
- Dobiera moc panelu, która pokryje zużycie, uwzględniając straty (regulator, kable).  
- Uwzględnia napięcie urządzenia (12V/24V/230V) i dobiera odpowiedni panel i regulator.  
  
**Efekt na ekranie:**  
- Komunikat: *„Lodówka 50W pracująca 8 h/dobę zużywa 400 Wh. Panel 150W wystarczy, jeśli będziesz ładować w ciągu dnia.”*  
- Ostrzeżenie: *„Przy pochmurnej pogodzie produkcja spada o 70% – rozważ większy panel.”*  
  
**Migawka:** *„O co chodzi? Liczysz panel tylko do jednego urządzenia, nie do całego domu.”*  
  
**Powiązania:** Funkcja 8.1, 8.4, 8.8.

---

### 12.7. Powerbank solarny vs. mały akumulator – co wybrać?  *(dawne 8.7)*

  
**Skąd czerpie dane:**  
- Od użytkownika: przeznaczenie (telefon, tablet, laptop, lodówka turystyczna, oświetlenie awaryjne).  
- Z bazy powerbanków solarnych i małych zestawów z akumulatorem.  
  
**Gdzie ląduje:**  
- W module `solar_powerbank_comparison`.  
  
**Jak działa logika:**  
- System porównuje dwie opcje:  
  - **Powerbank solarny:** kompaktowy, przenośny, zintegrowany panel, wyjścia USB/DC, pojemność 100–500 Wh.  
  - **Mały zestaw z akumulatorem:** większy, cięższy, wymaga osobnego panelu i regulatora, ale bardziej wydajny i tańszy przy większych pojemnościach.  
- Uwzględnia: cenę, wagę, czas ładowania, moc wyjściową, zastosowanie.  
- Rekomenduje najlepszą opcję dla danego użytkownika.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Powerbank 300 Wh: 400 zł, 2 kg, ładuje laptopa 1,5 razy. Zestaw DIY z akumulatorem 100Ah: 600 zł, 12 kg, ładuje laptopa 10 razy.”*  
- Komunikat: *„Na kemping do telefonów wystarczy powerbank. Do zasilania lodówki lepszy zestaw DIY.”*  
  
**Migawka:** *„O co chodzi? Powerbank to wygoda, ale zestaw DIY to pojemność i moc.”*  
  
**Powiązania:** Funkcja 8.3, 8.5, 8.36.

---

### 12.8. Dobór regulatora ładowania PWM vs MPPT do małej instalacji  *(dawne 8.8)*

  
**Skąd czerpie dane:**  
- Od użytkownika: moc paneli, napięcie paneli, napięcie akumulatora, budżet.  
- Z bazy regulatorów PWM i MPPT oraz ich sprawności.  
  
**Gdzie ląduje:**  
- W module `pwm_mppt_selection`.  
  
**Jak działa logika:**  
- System porównuje regulatory PWM i MPPT:  
  - **PWM:** tańszy, mniejsza sprawność przy wyższych napięciach paneli, lepszy do małych mocy (< 300W) i tanich zestawów.  
  - **MPPT:** droższy, ale odzyskuje więcej energii (sprawność 95%+), szczególnie przy niskich temperaturach i panelach o wyższym napięciu.  
- Uwzględnia, że MPPT jest opłacalny przy większych mocach (powyżej 200–300W).  
- Dobiera regulator o odpowiednim prądzie ładowania.  
  
**Efekt na ekranie:**  
- Tabela porównawcza.  
- Komunikat: *„Dla panelu 100W 12V i akumulatora 12V wystarczy PWM. Dla 400W 24V wybierz MPPT, bo zyskasz 15% energii.”*  
- Ostrzeżenie: *„PWM nie obniży napięcia panelu 24V do akumulatora 12V – sprawdź kompatybilność!”*  
  
**Migawka:** *„O co chodzi? PWM to tani robotnik, MPPT to inżynier. Do dużych zysków zatrudnij inżyniera.”*  
  
**Powiązania:** Funkcja 8.2, 8.6, 8.49.

---

### 12.9. Dobór przetwornicy / ładowarki USB (12V na 5V, 24V na 12V)  *(dawne 8.9)*

  
**Skąd czerpie dane:**  
- Od użytkownika: napięcie wejściowe (12V/24V), napięcie wyjściowe (5V USB, 12V, 230V), moc urządzenia.  
- Z bazy przetwornic i ładowarek.  
  
**Gdzie ląduje:**  
- W module `converter_selection`.  
  
**Jak działa logika:**  
- System dobiera przetwornicę DC/DC o odpowiednim napięciu wejściowym i wyjściowym.  
- Oblicza prąd wejściowy: I = P / (U_wej * sprawność).  
- Uwzględnia sprawność przetwornicy (typ. 85–95%).  
- Dobiera ładowarki USB (5V) do telefonów/tabletów.  
- Ostrzega przed przeciążeniem i zbyt małym przekrojem kabli.  
  
**Efekt na ekranie:**  
- Lista rekomendowanych przetwornic.  
- Komunikat: *„Do zasilania routera 12V z akumulatora 12V nie potrzebujesz przetwornicy. Do ładowania telefonu 5V z 12V wybierz ładowarkę USB 3A.”*  
- Ostrzeżenie: *„Przetwornica 24V→12V przy 10A pobierze z akumulatora 11A – sprawdź bezpiecznik.”*  
  
**Migawka:** *„O co chodzi? Przetwornica dopasowuje napięcie do urządzenia. Bez niej spalisz sprzęt.”*  
  
**Powiązania:** Funkcja 8.2, 8.4, 8.49.

---

### 12.10. Zabezpieczenia i bezpieczniki dla małych instalacji 12V/24V  *(dawne 8.10)*

  
**Skąd czerpie dane:**  
- Z prądów w instalacji (obliczonych na podstawie mocy i napięcia).  
- Z długości kabli i przekrojów.  
- Z bazy bezpieczników (nożowe, szklane, mini) i wyłączników.  
  
**Gdzie ląduje:**  
- W module `small_installation_protection`.  
  
**Jak działa logika:**  
- System oblicza prądy w każdym obwodzie (panel–regulator, regulator–akumulator, akumulator–odbiornik).  
- Dobiera bezpieczniki o wartości 1,25 × prąd znamionowy.  
- Uwzględnia, że bezpiecznik musi być umieszczony jak najbliżej źródła (akumulatora, panela).  
- Sprawdza, czy przewody wytrzymają prąd zwarciowy.  
- Zaleca rozłącznik lub wyłącznik przy akumulatorze.  
  
**Efekt na ekranie:**  
- Schemat instalacji z zaznaczonymi bezpiecznikami.  
- Tabela: *„Obwód akumulatora: bezpiecznik 20 A. Obwód panelu: bezpiecznik 10 A. Obwód odbiornika: bezpiecznik 15 A.”*  
- Ostrzeżenie: *„Bezpiecznik przy akumulatorze to podstawa – zwarcie bez niego to pożar.”*  
  
**Migawka:** *„O co chodzi? Bezpiecznik ratuje instalację i Twój kamper przed spaleniem.”*  
  
**Powiązania:** Funkcja 8.2, 8.4, 8.22.

---

### 12.11. Ochrona przed rozładowaniem akumulatora (dozownik napięcia)  *(dawne 8.11)*

  
**Skąd czerpie dane:**  
- Od użytkownika: typ akumulatora (AGM, LiFePO4), napięcie znamionowe (12V/24V).  
- Z bazy dozowników napięcia i BMS.  
  
**Gdzie ląduje:**  
- W module `battery_discharge_protection`.  
  
**Jak działa logika:**  
- System dobiera urządzenie (dozownik napięcia, czujnik napięcia, BMS) chroniące akumulator przed głębokim rozładowaniem.  
- Ustala napięcie odcięcia:  
  - AGM: 11,5–11,8 V (12V), 23,0–23,5 V (24V)  
  - LiFePO4: 11,0–11,5 V (12V), 22,0–23,0 V (24V)  
- Uwzględnia histerezę (ponowne załączenie przy wyższym napięciu).  
- Ostrzega, że głębokie rozładowanie skraca żywotność akumulatora.  
  
**Efekt na ekranie:**  
- Schemat podłączenia dozownika.  
- Komunikat: *„Dla akumulatora AGM 12V ustaw odcięcie przy 11,8 V. To zapewni 3× dłuższą żywotność niż rozładowanie do 10,5 V.”*  
- Ostrzeżenie: *„Bez ochrony akumulator szybko trafi na śmietnik.”*  
  
**Migawka:** *„O co chodzi? Akumulator nie lubi być rozładowywany do zera. Dozownik pilnuje, żeby tak się nie stało.”*  
  
**Powiązania:** Funkcja 8.2, 8.22, 8.45.

---

### 12.12. Łączenie paneli przenośnych (składane, maty, powerbanki solarne)  *(dawne 8.12)*

  
**Skąd czerpie dane:**  
- Od użytkownika: typ paneli (składane, mata, powerbank solarny), liczba sztuk, napięcie, moc.  
- Z bazy paneli przenośnych.  
  
**Gdzie ląduje:**  
- W module `portable_panel_connection`.  
  
**Jak działa logika:**  
- System sprawdza, jak połączyć panele przenośne – szeregowo (zwiększenie napięcia) czy równolegle (zwiększenie prądu).  
- Uwzględnia, że powerbanki solarne często mają wbudowany regulator i nie można ich łączyć z innymi panelami.  
- Dobiera złączki (MC4, XT60, USB) i ewentualnie przejściówki.  
- Sprawdza, czy napięcie paneli nie przekroczy maksymalnego napięcia wejściowego regulatora lub powerbanka.  
  
**Efekt na ekranie:**  
- Schemat połączeń.  
- Komunikat: *„Dwa panele przenośne 100W 18V połącz równolegle, aby uzyskać 18V i 11A. Szeregowo dałbyś 36V i ryzyko przekroczenia napięcia.”*  
- Ostrzeżenie: *„Nie łącz panelu bezpośrednio z powerbankiem, jeśli Voc panelu przekracza limit powerbanka.”*  
  
**Migawka:** *„O co chodzi? Panele przenośne to klocki. Trzeba je połączyć we właściwy sposób.”*  
  
**Powiązania:** Funkcja 8.7, 8.8, 8.49.

---

### 12.13. Przewody i bezpieczniki do samochodu / kampera  *(dawne 8.13)*

  
**Skąd czerpie dane:**  
- Z urządzeń, które mają być podłączone (moc, prąd).  
- Z długości przewodów i napięcia (12V/24V).  
- Z bazy przewodów i bezpieczników samochodowych.  
  
**Gdzie ląduje:**  
- W module `vehicle_wiring`.  
  
**Jak działa logika:**  
- System dobiera przekroje przewodów do instalacji samochodowej lub kamperowej.  
- Uwzględnia, że w pojazdach przewody są krótsze, ale prądy często duże.  
- Dobiera bezpieczniki samochodowe (nożowe, mini, maxi) odpowiednie do prądów.  
- Sprawdza, czy przewody mają odpowiednią izolację odporną na temperaturę i drgania.  
- Zaleca prowadzenie przewodów w peszlach ochronnych.  
  
**Efekt na ekranie:**  
- Tabela: *„Lodówka 50W z gniazda 12V: przewód 2,5 mm², bezpiecznik 10 A. Przetwornica 1000W: przewód 25 mm², bezpiecznik 100 A.”*  
- Ostrzeżenie: *„Nie używaj przewodów głośnikowych do zasilania – za cienkie i przegrzeją się.”*  
  
**Migawka:** *„O co chodzi? W samochodzie prąd płynie krótko, ale intensywnie. Przewód musi wytrzymać.”*  
  
**Powiązania:** Funkcja 8.2, 8.10, 8.49.

---

### 12.14. Kalkulator czasu pracy urządzeń na akumulatorze samochodowym  *(dawne 8.14)*

  
**Skąd czerpie dane:**  
- Z pojemności akumulatora samochodowego (Ah) i napięcia (12V/24V).  
- Z mocy podłączonych urządzeń.  
- Z informacji o typie akumulatora (rozruchowy, AGM, kwasowy).  
  
**Gdzie ląduje:**  
- W module `car_battery_runtime`.  
  
**Jak działa logika:**  
- System oblicza pojemność użyteczną akumulatora samochodowego (zwykle tylko 30–50% dla rozruchowego).  
- Sumuje moc podłączonych urządzeń.  
- Oblicza czas pracy do rozładowania przy zadanym obciążeniu.  
- Ostrzega, że akumulator rozruchowy nie jest przeznaczony do głębokiego rozładowania.  
  
**Efekt na ekranie:**  
- Komunikat: *„Akumulator 12V 60Ah rozruchowy ma użyteczne ok. 30 Ah. Lodówka 50W (4,2 A) będzie pracować 7 godzin, potem akumulator padnie i nie odpalisz auta.”*  
- Ostrzeżenie: *„Nie używaj akumulatora rozruchowego do długotrwałego zasilania – zabijesz go.”*  
  
**Migawka:** *„O co chodzi? Akumulator samochodowy to nie powerbank. Ma mało energii i nie lubi głębokiego rozładowania.”*  
  
**Powiązania:** Funkcja 8.4, 8.13, 8.37.

---

### 12.15. Kalkulator zużycia energii przez lodówkę turystyczną  *(dawne 8.15)*

  
**Skąd czerpie dane:**  
- Z modelu lodówki (pobór mocy, tryb pracy, pojemność).  
- Z temperatury otoczenia i ustawienia temperatury.  
- Z profilu użytkowania.  
  
**Gdzie ląduje:**  
- W module `fridge_tourist_calculator`.  
  
**Jak działa logika:**  
- System oblicza dzienne zużycie energii przez lodówkę turystyczną.  
- Uwzględnia, że lodówka nie pracuje ciągle – cyklicznie się włącza i wyłącza (np. 30% czasu pracy).  
- Uwzględnia wpływ temperatury otoczenia (im cieplej, tym częściej pracuje).  
- Oblicza wymaganą pojemność akumulatora i moc panelu.  
  
**Efekt na ekranie:**  
- Wykres pracy lodówki w ciągu doby.  
- Komunikat: *„Lodówka 50W przy 30°C zużyje 0,6 kWh/dobę. Akumulator 100Ah wystarczy na 2 dni bez słońca.”*  
- Ostrzeżenie: *„W upalne dni lodówka zużywa 2× więcej energii niż w chłodne.”*  
  
**Migawka:** *„O co chodzi? Lodówka to największy złodziej prądu w kamperze. Trzeba wiedzieć, ile naprawdę je.”*  
  
**Powiązania:** Funkcja 8.4, 8.6, 8.37.

---

### 12.16. Przenośna instalacja solarna na kemping  *(dawne 8.16)*

  
**Skąd czerpie dane:**  
- Z liczby osób i urządzeń (telefony, lodówka, oświetlenie).  
- Z danych o nasłonecznieniu.  
- Z bazy paneli przenośnych.  
  
**Gdzie ląduje:**  
- W module `camping_solar_kit`.  
  
**Jak działa logika:**  
- System dobiera kompletny zestaw solarny na kemping: panel przenośny, regulator, akumulator, przetwornica.  
- Uwzględnia wagę i wymiary (ważne przy transporcie).  
- Oblicza czas ładowania i czas pracy urządzeń.  
- Porównuje z powerbankiem solarnym.  
  
**Efekt na ekranie:**  
- Lista zakupowa: *„Panel składany 120W, regulator MPPT 10A, akumulator LiFePO4 50Ah, przetwornica 12V/230V 500W.”*  
- Komunikat: *„Zestaw waży 8 kg i zasili telefon, oświetlenie i lodówkę przez 3 dni.”*  
  
**Migawka:** *„O co chodzi? Kemping to wolność, ale telefon i lodówka potrzebują prądu.”*  
  
**Powiązania:** Funkcja 8.3, 8.5, 8.7.

---

### 12.17. Zasilanie pompki wodnej lub hydroforu z małej instalacji  *(dawne 8.17)*

  
**Skąd czerpie dane:**  
- Z mocy pompki (W), napięcia (12V/24V/230V), cyklu pracy.  
- Z wymaganej wydajności (l/min).  
- Z parametrów akumulatora i paneli.  
  
**Gdzie ląduje:**  
- W module `water_pump_solar`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez pompkę.  
- Uwzględnia prąd rozruchowy (zwykle 2–3× moc nominalna).  
- Dobiera akumulator i panel do zasilania pompki.  
- Oblicza, ile wody można przepompować w ciągu dnia.  
  
**Efekt na ekranie:**  
- Komunikat: *„Pompka 12V 100W pracująca 2 h/dobę zużywa 200 Wh. Panel 200W i akumulator 80Ah wystarczą z zapasem.”*  
- Ostrzeżenie: *„Pompka przy starcie może pobrać 300W – sprawdź, czy akumulator to wytrzyma.”*  
  
**Migawka:** *„O co chodzi? Woda nie leci bez prądu. Trzeba dobrać źródło, które ruszy pompkę.”*  
  
**Powiązania:** Funkcja 8.4, 8.6, 8.11.

---

### 12.18. Zasilanie elektronarzędzi z akumulatora  *(dawne 8.18)*

  
**Skąd czerpie dane:**  
- Z mocy narzędzi (wiertarka, szlifierka, piła).  
- Z napięcia (12V/18V/230V).  
- Z czasu pracy.  
  
**Gdzie ląduje:**  
- W module `power_tools_battery`.  
  
**Jak działa logika:**  
- System oblicza zapotrzebowanie na energię dla elektronarzędzi.  
- Uwzględnia prądy rozruchowe (szczególnie dla pił i szlifierek).  
- Dobiera akumulator i przetwornicę 12V/230V.  
- Ostrzega, że elektronarzędzia 230V wymagają dużej przetwornicy i szybko rozładują akumulator.  
  
**Efekt na ekranie:**  
- Komunikat: *„Szlifierka 1200W przez 30 minut zużyje 600 Wh. Akumulator 100Ah 12V (1,2 kWh) wystarczy na 1 godzinę pracy, ale prąd rozruchowy wymaga przetwornicy 2000W.”*  
- Ostrzeżenie: *„Nie podłączaj elektronarzędzi bezpośrednio do akumulatora 12V – to inne napięcie.”*  
  
**Migawka:** *„O co chodzi? Narzędzia są głodne mocy. Trzeba im dać solidne źródło.”*  
  
**Powiązania:** Funkcja 8.4, 8.13, 8.41.

---

### 12.19. Zasilanie routera i monitoringu z małej instalacji  *(dawne 8.19)*

  
**Skąd czerpie dane:**  
- Z mocy routera, kamer, rejestratora (zwykle 5–20W każde).  
- Z napięcia zasilania (5V/12V/230V).  
- Z czasu pracy (24/7).  
  
**Gdzie ląduje:**  
- W module `router_cctv_solar`.  
  
**Jak działa logika:**  
- System sumuje pobór wszystkich urządzeń pracujących non-stop.  
- Uwzględnia straty przetwornic i zasilaczy.  
- Dobiera akumulator i panel do pracy ciągłej.  
- Oblicza, ile dni system wytrzyma bez słońca.  
  
**Efekt na ekranie:**  
- Komunikat: *„Router 10W + kamera 8W + rejestrator 15W = 33W ciągle, czyli 0,8 kWh/dobę. Akumulator 100Ah 12V wystarczy na 1,5 dnia bez słońca.”*  
- Ostrzeżenie: *„Praca 24/7 wymaga ciągłego zasilania – panel musi być przewymiarowany.”*  
  
**Migawka:** *„O co chodzi? Monitoring to oczy domu. Musi działać non stop.”*  
  
**Powiązania:** Funkcja 8.6, 8.9, 8.22.

---

### 12.20. Tryb awaryjny „blackout w domu” – minimum do przeżycia  *(dawne 8.20)*

  
**Skąd czerpie dane:**  
- Z listy krytycznych odbiorników (lodówka, router, oświetlenie, ładowarki).  
- Z dostępnych akumulatorów i paneli.  
- Z czasu trwania blackoutu.  
  
**Gdzie ląduje:**  
- W module `home_blackout_emergency`.  
  
**Jak działa logika:**  
- System dobiera minimalny zestaw awaryjny do domu.  
- Uwzględnia, że w blackout najważniejsze: lodówka, ładowanie telefonów, oświetlenie, router (praca zdalna).  
- Oblicza, ile energii potrzeba na 12, 24, 48 h.  
- Porównuje z powerbankiem solarnym i małym generatorem.  
  
**Efekt na ekranie:**  
- Lista priorytetów: *„1. Lodówka, 2. Router, 3. Oświetlenie, 4. Ładowarki.”*  
- Komunikat: *„Na 24 h blackoutu potrzebujesz 2 kWh. Powerbank solarny 2000Wh lub akumulator 200Ah + przetwornica 1000W.”*  
  
**Migawka:** *„O co chodzi? Blackout to egzamin. Trzeba wiedzieć, co ratować w pierwszej kolejności.”*  
  
**Powiązania:** Funkcja 8.3, 8.4, 8.7.

---

### 12.21. Tryb „bojler turystyczny 12V/24V”  *(dawne 8.21)*

  
**Skąd czerpie dane:**  
- Z pojemności bojlera turystycznego (5–20 l).  
- Z mocy grzałki (100–500W).  
- Z napięcia (12V/24V).  
- Z czasu podgrzewu.  
  
**Gdzie ląduje:**  
- W module `tourist_boiler`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii na podgrzanie wody.  
- Uwzględnia straty ciepła.  
- Dobiera akumulator i panel do podgrzania.  
- Porównuje z grzałką 230V.  
  
**Efekt na ekranie:**  
- Komunikat: *„Podgrzanie 10 l wody od 15°C do 60°C wymaga 0,6 kWh. Grzałka 300W 12V zrobi to w 2 h, ale akumulator 100Ah rozładuje się w połowie.”*  
- Ostrzeżenie: *„Podgrzewanie wody z akumulatora to ogromne obciążenie.”*  
  
**Migawka:** *„O co chodzi? Ciepła woda w kempingu to komfort, ale prądożerny.”*  
  
**Powiązania:** Funkcja 8.4, 8.5, 8.15.

---

### 12.22. Raport bezpieczeństwa małej instalacji  *(dawne 8.22)*

  
**Skąd czerpie dane:**  
- Z wszystkich elementów instalacji (akumulator, panele, regulator, przewody, bezpieczniki).  
- Z obliczonych prądów, napięć i mocy.  
  
**Gdzie ląduje:**  
- W module `small_installation_safety_report`.  
  
**Jak działa logika:**  
- System generuje raport bezpieczeństwa małej instalacji.  
- Sprawdza:  
  - poprawność doboru bezpieczników,  
  - przekroje przewodów,  
  - ochronę przed rozładowaniem,  
  - wentylację akumulatora,  
  - poprawność połączeń.  
- Wskazuje błędy i zagrożenia.  
- Podaje kroki naprawcze.  
  
**Efekt na ekranie:**  
- Lista kontrolna z polami OK / Błąd.  
- Alert: *„Brak bezpiecznika przy akumulatorze! To niebezpieczne – zwarcie może spowodować pożar.”*  
- Komunikat: *„Instalacja jest w 80% bezpieczna. Dodaj bezpiecznik i popraw przewody.”*  
  
**Migawka:** *„O co chodzi? Bezpieczeństwo to podstawa. Raport pokazuje, gdzie są słabe punkty.”*  
  
**Powiązania:** Funkcja 8.10, 8.11, 8.13, 8.45.

---

### 12.23. Moduł zbiorczy: Kalkulator zużycia energii per urządzenie

> Scalono dawne 8.23–8.28 — jeden generyczny kalkulator z bazą urządzeń do wyboru zamiast 6 osobnych ekranów.

#### 12.23.1. Obliczanie zużycia energii przez oświetlenie LED  *(dawne 8.23)*

  
**Skąd czerpie dane:**  
- Z listy źródeł światła LED (moc, liczba punktów, czas pracy dziennie).  
- Z napięcia zasilania (12V/24V/230V).  
- Z profilu użytkowania (rano, wieczorem, nocą).  
  
**Gdzie ląduje:**  
- W module `led_lighting_energy`.  
  
**Jak działa logika:**  
- System sumuje moc wszystkich punktów LED.  
- Oblicza dzienne zużycie energii (Wh/dobę).  
- Uwzględnia, że oświetlenie LED ma bardzo niski pobór w porównaniu z tradycyjnym.  
- Dobiera akumulator i panel do zasilania oświetlenia.  
- Porównuje z oświetleniem halogenowym/żarowym, pokazując oszczędności.  
  
**Efekt na ekranie:**  
- Tabela: *„10 punktów LED po 5 W, łącznie 50 W, przez 5 h/dobę = 250 Wh/dobę.”*  
- Komunikat: *„Akumulator 50Ah 12V wystarczy na 2 doby ciągłego świecenia. Panel 100W naładuje go w 1 dzień.”*  
- Ostrzeżenie: *„Nie podłączaj LED 12V bezpośrednio do panelu – konieczny jest regulator napięcia.”*  
  
**Migawka:** *„O co chodzi? LED to najmniejszy złodziej prądu, ale i tak trzeba wiedzieć, ile zje.”*  
  
**Powiązania:** Funkcja 8.5, 8.6, 8.29.

#### 12.23.2. Kalkulator zużycia energii przez czajnik, grzałkę lub kuchenkę  *(dawne 8.24)*

  
**Skąd czerpie dane:**  
- Z mocy urządzenia (W), napięcia (12V/24V/230V), czasu pracy (minuty/dobę).  
- Z profilu użytkowania (ile razy dziennie gotujemy wodę).  
  
**Gdzie ląduje:**  
- W module `heating_elements_energy`.  
  
**Jak działa logika:**  
- System oblicza dzienne zużycie energii przez urządzenia grzewcze.  
- Uwzględnia, że czajnik lub grzałka pobierają bardzo dużą moc w krótkim czasie.  
- Przelicza pobór prądu przy danym napięciu (I = P / U).  
- Dobiera akumulator i przetwornicę/regulator.  
- Ostrzega przed przeciążeniem instalacji i ryzykiem rozładowania akumulatora.  
  
**Efekt na ekranie:**  
- Komunikat: *„Czajnik 1000W przez 5 minut dziennie zużywa 0,08 kWh. To mało energii, ale przy 12V pobiera chwilowo 83 A!”*  
- Ostrzeżenie: *„Sprawdź, czy Twój akumulator i przewody wytrzymają taki prąd.”*  
  
**Migawka:** *„O co chodzi? Czajnik to krótki, ale potężny strzał prądu.”*  
  
**Powiązania:** Funkcja 8.2, 8.4, 8.10.

#### 12.23.3. Kalkulator zużycia energii przez pompę głębinową  *(dawne 8.25)*

  
**Skąd czerpie dane:**  
- Z mocy pompy (W), napięcia (12V/24V/230V), czasu pracy (h/dobę).  
- Z prądu rozruchowego pompy.  
- Z głębokości studni i wydajności (opcjonalnie).  
  
**Gdzie ląduje:**  
- W module `deep_well_pump_energy`.  
  
**Jak działa logika:**  
- System oblicza dzienne zużycie energii przez pompę.  
- Uwzględnia, że pompa głębinowa ma wysoki prąd rozruchowy (3–5× moc nominalna).  
- Dobiera akumulator, przetwornicę i przewody.  
- Sprawdza, czy falownik/akumulator udźwignie start pompy.  
  
**Efekt na ekranie:**  
- Komunikat: *„Pompa 800W pracująca 1 h/dobę zużywa 0,8 kWh. Przy starcie pobiera 2400W – potrzebujesz przetwornicy min. 3000W.”*  
- Ostrzeżenie: *„Pompa bez softstartu może wyłączyć przetwornicę.”*  
  
**Migawka:** *„O co chodzi? Pompa to ciężki zawodnik. Potrzebuje solidnego zasilania.”*  
  
**Powiązania:** Funkcja 8.4, 8.10, 8.41.

#### 12.23.4. Kalkulator zużycia energii przez klimatyzator przenośny  *(dawne 8.26)*

  
**Skąd czerpie dane:**  
- Z mocy klimatyzatora (W), trybu pracy, czasu pracy (h/dobę).  
- Z napięcia (230V) i prądu rozruchowego.  
- Z danych o temperaturze otoczenia.  
  
**Gdzie ląduje:**  
- W module `portable_ac_energy`.  
  
**Jak działa logika:**  
- System oblicza dzienne zużycie energii przez klimatyzator.  
- Uwzględnia, że klimatyzator pracuje cyklicznie (nie non-stop) i ma duży prąd rozruchowy.  
- Dobiera przetwornicę i akumulator.  
- Ostrzega, że klimatyzator przenośny to ogromne obciążenie dla małej instalacji.  
  
**Efekt na ekranie:**  
- Komunikat: *„Klimatyzator 1000W pracujący 6 h/dobę zużywa 6 kWh. Akumulator 200Ah 12V wystarczy tylko na 2,5 h pracy.”*  
- Ostrzeżenie: *„Klimatyzator przenośny to złodziej energii. Bez dużego zestawu nie pomyśl o nim.”*  
  
**Migawka:** *„O co chodzi? Klima to luksus, który w off-gridzie kosztuje fortunę.”*  
  
**Powiązania:** Funkcja 8.4, 8.7, 8.41.

#### 12.23.5. Kalkulator zużycia energii przez falownik do telewizora/laptopa  *(dawne 8.27)*

  
**Skąd czerpie dane:**  
- Z mocy telewizora/laptopa (W), czasu pracy (h/dobę).  
- Z napięcia zasilania (230V przez falownik lub 12V/24V bezpośrednio).  
- Z parametrów falownika (sprawność, pobór własny).  
  
**Gdzie ląduje:**  
- W module `tv_laptop_inverter_energy`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez telewizor/laptop.  
- Uwzględnia sprawność falownika (zwykle 85–90%).  
- Porównuje zasilanie przez falownik 230V z bezpośrednim 12V/24V.  
- Dobiera akumulator i panel.  
  
**Efekt na ekranie:**  
- Komunikat: *„Telewizor 50W + laptop 60W przez 4 h = 440 Wh. Przez falownik 85% zużyjesz 520 Wh z akumulatora.”*  
- Ostrzeżenie: *„Falownik pobiera prąd nawet bez obciążenia – wyłączaj go, gdy nie używasz.”*  
  
**Migawka:** *„O co chodzi? Zasilanie przez falownik to dodatkowe straty. Czasem lepiej zasilać bezpośrednio.”*  
  
**Powiązania:** Funkcja 8.9, 8.41, 8.19.

#### 12.23.6. Kalkulator zużycia energii przez system monitoringu/kamery  *(dawne 8.28)*

  
**Skąd czerpie dane:**  
- Z liczby kamer, mocy każdej (W), rejestratora, dysku, routera.  
- Z napięcia zasilania (12V/24V/PoE).  
- Z czasu pracy (24/7).  
  
**Gdzie ląduje:**  
- W module `cctv_energy`.  
  
**Jak działa logika:**  
- System sumuje pobór mocy wszystkich elementów monitoringu.  
- Oblicza zużycie dobowe, miesięczne, roczne.  
- Uwzględnia, że system monitoringu pracuje non stop.  
- Dobiera akumulator i panel do pracy ciągłej.  
  
**Efekt na ekranie:**  
- Komunikat: *„4 kamery po 8W + rejestrator 20W = 52W ciągle, czyli 1,25 kWh/dobę. Akumulator 200Ah 12V wystarczy na 1,5 dnia bez słońca.”*  
- Ostrzeżenie: *„Monitoring to stały pobór – panel musi produkować codziennie.”*  
  
**Migawka:** *„O co chodzi? Oko zawsze czuwa, ale potrzebuje do tego prądu.”*  
  
**Powiązania:** Funkcja 8.19, 8.9, 8.22.


---

### 12.24. Moduł zbiorczy: Kreator zasilania małego odbiornika

> Scalono dawne 8.29–8.36 — jeden kreator ze scenariuszami do wyboru zamiast 8 osobnych trybów.

#### 12.24.1. Tryb „mała instalacja zasilająca światło awaryjne”  *(dawne 8.29)*

  
**Skąd czerpie dane:**  
- Z liczby punktów świetlnych, mocy, czasu działania w awarii.  
- Z napięcia (12V/24V/230V).  
- Z dostępnych akumulatorów.  
  
**Gdzie ląduje:**  
- W module `emergency_lighting`.  
  
**Jak działa logika:**  
- System projektuje minimalną instalację oświetlenia awaryjnego.  
- Dobiera akumulator, panel i ewentualnie przetwornicę.  
- Uwzględnia, że światło awaryjne ma działać przede wszystkim w nocy.  
- Oblicza, ile nocy wytrzyma bez doładowania.  
  
**Efekt na ekranie:**  
- Komunikat: *„6 punktów LED po 5W = 30W. Akumulator 50Ah 12V wystarczy na 16 h ciągłego świecenia.”*  
- Ostrzeżenie: *„Światło awaryjne nie może być podłączone przez falownik 230V – strata energii.”*  
  
**Migawka:** *„O co chodzi? W awarii światło ratuje życie. Musi być proste i niezawodne.”*  
  
**Powiązania:** Funkcja 8.23, 8.20, 8.5.

#### 12.24.2. Tryb „ładowanie telefonów i powerbanków”  *(dawne 8.30)*

  
**Skąd czerpie dane:**  
- Z liczby urządzeń, pojemności baterii (mAh), liczby ładowań dziennie.  
- Z napięcia ładowania (5V USB, 12V, 230V).  
- Z dostępnych akumulatorów.  
  
**Gdzie ląduje:**  
- W module `phone_charging`.  
  
**Jak działa logika:**  
- System oblicza dzienne zapotrzebowanie na ładowanie telefonów, tabletów, powerbanków.  
- Uwzględnia straty ładowania (zwykle 10–20%).  
- Dobiera akumulator i panel.  
- Porównuje ładowanie przez USB 5V z ładowarką sieciową 230V.  
  
**Efekt na ekranie:**  
- Komunikat: *„3 telefony po 5000 mAh ładowane codziennie: 3 × 25 Wh = 75 Wh/dobę. Akumulator 20Ah 12V wystarczy na 3 dni.”*  
- Ostrzeżenie: *„Ładowanie przez przetwornicę 230V traci 20% energii. Lepiej użyć ładowarek USB 12V.”*  
  
**Migawka:** *„O co chodzi? Telefon to małe urządzenie, ale codzienne ładowanie potrafi zjeść energię.”*  
  
**Powiązania:** Funkcja 8.9, 8.5, 8.7.

#### 12.24.3. Tryb „zasilanie systemu alarmowego”  *(dawne 8.31)*

  
**Skąd czerpie dane:**  
- Z mocy centrali alarmowej, czujek, sygnalizatora.  
- Z napięcia (12V/24V).  
- Z czasu pracy (24/7) i trybu awaryjnego.  
  
**Gdzie ląduje:**  
- W module `alarm_system_power`.  
  
**Jak działa logika:**  
- System sumuje pobór mocy wszystkich elementów alarmu.  
- Uwzględnia, że centrala alarmowa ma wbudowany akumulator, ale wymaga doładowania.  
- Dobiera zewnętrzny akumulator i panel do podtrzymania.  
- Oblicza, ile dni alarm będzie działał bez zasilania sieciowego.  
  
**Efekt na ekranie:**  
- Komunikat: *„Centrala 15W + czujki 10W = 25W ciągle, czyli 0,6 kWh/dobę. Akumulator 12V 40Ah podtrzyma alarm przez 19 h.”*  
- Ostrzeżenie: *„Alarm musi mieć podtrzymanie – inaczej w blackout przestaje chronić.”*  
  
**Migawka:** *„O co chodzi? Alarm to strażnik. Nie może zasnąć, gdy zabraknie prądu.”*  
  
**Powiązania:** Funkcja 8.28, 8.11, 8.20.

#### 12.24.4. Tryb „zasilanie bramy wjazdowej/furtki”  *(dawne 8.32)*

  
**Skąd czerpie dane:**  
- Z mocy napędu bramy (W), napięcia (12V/24V/230V), liczby cykli dziennie.  
- Z czasu otwierania/zamykania.  
- Z parametrów akumulatora i panelu.  
  
**Gdzie ląduje:**  
- W module `gate_power`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez napęd bramy.  
- Uwzględnia prąd rozruchowy silnika.  
- Dobiera akumulator i panel do zasilania.  
- Sprawdza, czy w trybie awaryjnym brama będzie działać.  
  
**Efekt na ekranie:**  
- Komunikat: *„Napęd bramy 200W, cykl 20 s, 10 cykli dziennie = 40 Wh/dobę. Akumulator 12V 20Ah wystarczy na 3 dni bez słońca.”*  
- Ostrzeżenie: *„Brama ma wysoki prąd rozruchowy – dobierz przetwornicę z zapasem.”*  
  
**Migawka:** *„O co chodzi? Brama to wygoda. W blackout może przestać działać, jeśli nie ma zasilania awaryjnego.”*  
  
**Powiązania:** Funkcja 8.13, 8.10, 8.20.

#### 12.24.5. Tryb „zasilanie oświetlenia ogrodu”  *(dawne 8.33)*

  
**Skąd czerpie dane:**  
- Z liczby lamp ogrodowych, mocy (W), napięcia (12V/24V/230V).  
- Z czasu świecenia (np. 4–6 h wieczorem).  
- Z lokalizacji (nasłonecznienie) i pory roku.  
  
**Gdzie ląduje:**  
- W module `garden_lighting`.  
  
**Jak działa logika:**  
- System sumuje moc wszystkich lamp ogrodowych.  
- Oblicza dzienne zużycie energii.  
- Dobiera akumulator i panel, aby zasilić oświetlenie wieczorem.  
- Uwzględnia, że zimą słońca jest mniej i panel może nie naładować akumulatora.  
- Sprawdza, czy lepiej zastosować oddzielne lampy solarne czy jeden centralny system.  
  
**Efekt na ekranie:**  
- Komunikat: *„8 lamp LED po 10W, 5 h dziennie = 400 Wh. Panel 200W i akumulator 50Ah wystarczą latem, ale zimą zabraknie.”*  
- Ostrzeżenie: *„W zimie oświetlenie ogrodu może nie działać – rozważ mniejszą liczbę lamp lub większy panel.”*  
  
**Migawka:** *„O co chodzi? Ogród to nie dom – nie musi świecić całą noc. Ale jak ma świecić, to potrzebuje prądu.”*  
  
**Powiązania:** Funkcja 8.23, 8.6, 8.22.

#### 12.24.6. Tryb „zasilanie małej fontanny lub oczka wodnego”  *(dawne 8.34)*

  
**Skąd czerpie dane:**  
- Z mocy pompy fontannowej (W), napięcia (12V/24V/230V).  
- Z czasu pracy dziennie.  
- Z pojemności wodnej i wymaganej cyrkulacji.  
  
**Gdzie ląduje:**  
- W module `fountain_power`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez pompę fontanny.  
- Uwzględnia, że pompa pracuje zwykle w dzień, gdy są nadwyżki energii.  
- Dobiera panel i akumulator.  
- Ostrzega przed pracą nocną, która niepotrzebnie rozładowuje akumulator.  
  
**Efekt na ekranie:**  
- Komunikat: *„Pompa 30W pracująca 8 h dziennie zużywa 240 Wh. Panel 100W i akumulator 30Ah wystarczą.”*  
- Ostrzeżenie: *„Nie uruchamiaj fontanny w nocy z akumulatora – to marnotrawstwo.”*  
  
**Migawka:** *„O co chodzi? Fontanna to relaks, ale nie może zjeść całej energii z akumulatora.”*  
  
**Powiązania:** Funkcja 8.6, 8.17, 8.3.

#### 12.24.7. Tryb „zasilanie wiatraka wentylacyjnego”  *(dawne 8.35)*

  
**Skąd czerpie dane:**  
- Z mocy wentylatora (W), napięcia (12V/24V).  
- Z czasu pracy (np. tylko w upalne dni).  
- Z danych o temperaturze i wilgotności.  
  
**Gdzie ląduje:**  
- W module `ventilation_fan`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez wentylator.  
- Uwzględnia, że wentylator nie musi pracować całą dobę.  
- Dobiera akumulator i panel.  
- Ostrzega, że wentylator w upał zużywa więcej energii, niż się wydaje.  
  
**Efekt na ekranie:**  
- Komunikat: *„Wentylator 20W pracujący 10 h dziennie zużywa 200 Wh. Panel 50W wystarczy.”*  
- Ostrzeżenie: *„W upały wentylator będzie chodził dłużej – to dodatkowe obciążenie.”*  
  
**Migawka:** *„O co chodzi? Wentylator to tani sposób na chłód, ale też nie działa za darmo.”*  
  
**Powiązania:** Funkcja 8.6, 8.5, 8.26.

#### 12.24.8. Tryb „zasilanie sterownika pieca C.O.”  *(dawne 8.36)*

  
**Skąd czerpie dane:**  
- Z mocy sterownika, pompy obiegowej, zaworów (W).  
- Z napięcia (12V/24V/230V).  
- Z czasu pracy w sezonie grzewczym.  
  
**Gdzie ląduje:**  
- W module `boiler_controller_power`.  
  
**Jak działa logika:**  
- System oblicza zapotrzebowanie na energię dla sterownika pieca i pompy.  
- Uwzględnia, że w blackout sterownik i pompa muszą działać, inaczej piec się przegrzeje.  
- Dobiera mały akumulator i przetwornicę do podtrzymania.  
- Ostrzega przed podłączeniem przez przetwornicę o zbyt małej mocy.  
  
**Efekt na ekranie:**  
- Komunikat: *„Sterownik 5W + pompa 40W = 45W ciągle. Akumulator 12V 50Ah podtrzyma system przez 12 h.”*  
- Ostrzeżenie: *„Bez pompy piec może się przegrzać – to kwestia bezpieczeństwa.”*  
  
**Migawka:** *„O co chodzi? Piec to serce domu. W blackout musi bić dalej.”*  
  
**Powiązania:** Funkcja 8.20, 8.4, 8.41.


---

### 12.25. Dobór akumulatora do kampera (AGM vs LiFePO4)  *(dawne 8.37)*

  
**Skąd czerpie dane:**  
- Z profilu zużycia energii w kamperze (oświetlenie, lodówka, ładowarki, pompa).  
- Z budżetu i wagi.  
- Z dostępnej przestrzeni.  
  
**Gdzie ląduje:**  
- W module `camper_battery_selection`.  
  
**Jak działa logika:**  
- System porównuje AGM i LiFePO4 dla kampera.  
- Uwzględnia:  
  - AGM: tańszy, cięższy, mniejsza liczba cykli, wrażliwy na głębokie rozładowanie.  
  - LiFePO4: droższy, lżejszy, 2–3× więcej cykli, większa pojemność użyteczna.  
- Oblicza koszt 1 kWh w całym życiu akumulatora.  
- Dobiera pojemność na podstawie zapotrzebowania.  
  
**Efekt na ekranie:**  
- Tabela porównawcza.  
- Komunikat: *„LiFePO4 100Ah jest 2× droższy od AGM, ale wytrzyma 3× dłużej i jest o 10 kg lżejszy. Do kampera lepszy LiFePO4.”*  
- Ostrzeżenie: *„AGM w kamperze szybko padnie, jeśli rozładujesz go do zera.”*  
  
**Migawka:** *„O co chodzi? Akumulator to serce kampera. Wybierz mądrze.”*  
  
**Powiązania:** Funkcja 8.4, 8.3, 8.14.

---

### 12.26. Dobór panelu do kampera (elastyczny vs sztywny)  *(dawne 8.38)*

  
**Skąd czerpie dane:**  
- Z wymiarów dachu kampera i dostępnej powierzchni.  
- Z budżetu i wymagań wagowych.  
- Z danych o nasłonecznieniu.  
  
**Gdzie ląduje:**  
- W module `camper_panel_selection`.  
  
**Jak działa logika:**  
- System porównuje panele elastyczne i sztywne do kampera.  
- Uwzględnia:  
  - Elastyczne: cienkie, lekkie, ale mniej wydajne i szybciej się nagrzewają.  
  - Sztywne: wydajniejsze, trwalsze, ale cięższe i wymagają mocowania.  
- Dobiera moc panelu do zapotrzebowania.  
- Sprawdza, czy panel zmieści się na dachu.  
  
**Efekt na ekranie:**  
- Komunikat: *„Na dachu kampera zmieścisz 2 panele 100W sztywne. Elastyczne byłyby lżejsze, ale stracisz 10% mocy.”*  
- Ostrzeżenie: *„Elastyczne panele bez szczeliny wentylacyjnej przegrzewają się i tracą wydajność.”*  
  
**Migawka:** *„O co chodzi? Panel na dachu to jak kapelusz dla kampera. Musi pasować i dawać moc.”*  
  
**Powiązania:** Funkcja 8.6, 8.3, 8.39.

---

### 12.27. Kalkulator „ile paneli na dachu kampera”  *(dawne 8.39)*

  
**Skąd czerpie dane:**  
- Z wymiarów dachu kampera (długość, szerokość).  
- Z wymiarów paneli (długość, szerokość, moc).  
- Z powierzchni zajmowanej przez inne urządzenia (klimatyzator, świetliki).  
  
**Gdzie ląduje:**  
- W module `roof_panel_count`.  
  
**Jak działa logika:**  
- System oblicza dostępną powierzchnię dachu kampera.  
- Odejmuje powierzchnię zajętą przez inne elementy.  
- Dzieli dostępną przestrzeń przez powierzchnię jednego panelu.  
- Uwzględnia odstępy między panelami.  
- Oblicza maksymalną moc instalacji PV na dachu.  
  
**Efekt na ekranie:**  
- Schemat rozmieszczenia paneli na dachu.  
- Komunikat: *„Na dachu kampera 6m × 2m zmieścisz 3 panele 100W (układ poziomy). Maksymalna moc to 300W.”*  
- Ostrzeżenie: *„Nie zapomnij o świetlikach i klimatyzacji – zajmują miejsce.”*  
  
**Migawka:** *„O co chodzi? Dach kampera to mała elektrownia. Trzeba ją dobrze zaprojektować.”*  
  
**Powiązania:** Funkcja 8.38, 8.6, 8.3.

---

### 12.28. Ładowanie z alternatora vs paneli – porównanie  *(dawne 8.40)*

  
**Skąd czerpie dane:**  
- Z parametrów alternatora (moc ładowania, prąd, czas jazdy).  
- Z parametrów paneli (moc, nasłonecznienie).  
- Z profilu użytkowania kampera (ile dni stoimy, ile jeździmy).  
  
**Gdzie ląduje:**  
- W module `alternator_vs_solar`.  
  
**Jak działa logika:**  
- System porównuje ładowanie akumulatora kampera z alternatora i z paneli.  
- Uwzględnia, że alternator ładuje szybko, ale tylko podczas jazdy.  
- Panele ładują wolno, ale przez cały dzień.  
- Oblicza, ile energii dostarczy każde źródło w ciągu doby.  
- Dobiera konfigurację (sam panel, sam alternator, oba).  
  
**Efekt na ekranie:**  
- Wykres ładowania z obu źródeł.  
- Komunikat: *„Jazda 2 h dziennie z alternatora da 60 Ah, panel 200W da 80 Ah. Panele wystarczą, jeśli stoisz dłużej niż 2 dni.”*  
- Ostrzeżenie: *„Alternator nie naładuje LiFePO4 do pełna bez przetwornicy DC/DC.”*  
  
**Migawka:** *„O co chodzi? Jedziesz albo stoisz. Trzeba dobrać ładowanie do stylu życia.”*  
  
**Powiązania:** Funkcja 8.37, 8.38, 8.13.

---

### 12.29. Przetwornica 12V na 230V – dobór mocy  *(dawne 8.41)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń 230V, które mają być zasilane (moc, prąd rozruchowy).  
- Z napięcia akumulatora (12V/24V).  
- Z czasu pracy urządzeń.  
  
**Gdzie ląduje:**  
- W module `inverter_sizing_12v`.  
  
**Jak działa logika:**  
- System sumuje moc urządzeń 230V, które mogą pracować jednocześnie.  
- Uwzględnia prąd rozruchowy (np. lodówka, elektronarzędzia).  
- Dobiera przetwornicę o mocy 1,5–2× większej niż suma obciążeń.  
- Sprawdza, czy akumulator wytrzyma pobór prądu.  
- Ostrzega przed przeciążeniem i zbyt małym przekrojem kabli.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twoje urządzenia 230V sumują się do 800W. Z prądem rozruchowym lodówki potrzebujesz przetwornicy min. 1500W.”*  
- Ostrzeżenie: *„Przetwornica 2000W przy 12V pobiera 166A – sprawdź kable i bezpieczniki.”*  
  
**Migawka:** *„O co chodzi? Przetwornica to most między 12V a 230V. Musi być wystarczająco mocna, żeby nie paść.”*  
  
**Powiązania:** Funkcja 8.4, 8.13, 8.10.

---

### 12.30. Przetwornica 12V na 24V – kiedy i po co  *(dawne 8.42)*

  
**Skąd czerpie dane:**  
- Z napięcia urządzeń (24V), które chcemy zasilać z akumulatora 12V.  
- Z mocy urządzeń.  
- Z dostępnych przetwornic DC/DC.  
  
**Gdzie ląduje:**  
- W module `12v_to_24v_converter`.  
  
**Jak działa logika:**  
- System sprawdza, czy warto stosować przetwornicę 12V→24V.  
- Uwzględnia, że niektóre urządzenia (pompy, telewizory, routery) wymagają 24V.  
- Oblicza sprawność przetwornicy i straty.  
- Dobiera przetwornicę o odpowiedniej mocy.  
- Porównuje z zasilaniem bezpośrednio z dwóch akumulatorów 12V szeregowo (24V).  
  
**Efekt na ekranie:**  
- Komunikat: *„Jeśli masz tylko akumulator 12V, a urządzenie 24V, zastosuj przetwornicę DC/DC 24V 10A. Sprawność 90%.”*  
- Ostrzeżenie: *„Jeśli często używasz urządzeń 24V, lepiej zbuduj system 24V z dwóch akumulatorów 12V.”*  
  
**Migawka:** *„O co chodzi? Czasem trzeba podnieść napięcie. Przetwornica to winda dla prądu.”*  
  
**Powiązania:** Funkcja 8.9, 8.4, 8.3.

---

### 12.31. Ładowanie akumulatora z prostownika/alternatora  *(dawne 8.43)*

  
**Skąd czerpie dane:**  
- Z typu akumulatora (AGM, LiFePO4, kwasowy) i jego pojemności.  
- Z parametrów prostownika lub alternatora (prąd ładowania, napięcie).  
- Z czasu ładowania.  
  
**Gdzie ląduje:**  
- W module `battery_charging_external`.  
  
**Jak działa logika:**  
- System sprawdza, czy prostownik/alternator jest odpowiedni do danego typu akumulatora.  
- Uwzględnia, że LiFePO4 wymaga innego napięcia ładowania (14,2–14,6 V) niż AGM (14,4–14,8 V) i kwasowy (14,8–15,0 V).  
- Oblicza czas ładowania na podstawie prądu ładowania i pojemności akumulatora.  
- Ostrzega przed przeładowaniem i zbyt wysokim napięciem.  
  
**Efekt na ekranie:**  
- Komunikat: *„Prostownik 10A naładuje akumulator 100Ah od 50% do 100% w 5 godzin.”*  
- Ostrzeżenie: *„Nie używaj prostownika do akumulatorów kwasowych z LiFePO4 – za wysokie napięcie zniszczy ogniwa.”*  
  
**Migawka:** *„O co chodzi? Ładowanie z sieci to szybszy sposób, ale trzeba dobrać odpowiednie napięcie.”*  
  
**Powiązania:** Funkcja 8.37, 8.40, 8.45.

---

### 12.32. Monitoring zużycia w małej instalacji (mierniki)  *(dawne 8.44)*

  
**Skąd czerpie dane:**  
- Z listy urządzeń i ich mocy.  
- Z napięcia i prądu w instalacji.  
- Z danych o produkcji i zużyciu.  
  
**Gdzie ląduje:**  
- W module `small_energy_monitoring`.  
  
**Jak działa logika:**  
- System dobiera mierniki napięcia, prądu i energii do małej instalacji.  
- Uwzględnia pomiar: napięcia akumulatora, prądu ładowania, prądu rozładowania, energii pobranej i oddanej.  
- Uwzględnia monitoring temperatury akumulatora.  
- Dobiera miernik z wyjściem do aplikacji (Bluetooth, Wi‑Fi) lub prosty wyświetlacz.  
  
**Efekt na ekranie:**  
- Schemat podłączenia mierników.  
- Komunikat: *„Zamontuj miernik napięcia i prądu 100A z wyświetlaczem. Będziesz widział aktualne zużycie i stan akumulatora.”*  
- Ostrzeżenie: *„Bez monitoringu łatwo przeoczyć spadek napięcia i uszkodzić akumulator.”*  
  
**Migawka:** *„O co chodzi? Miernik to oczy instalacji. Bez niego latasz po omacku.”*  
  
**Powiązania:** Funkcja 8.22, 8.11, 8.45.

---

### 12.33. Bezpieczeństwo w kamperze – wentylacja, mocowanie akumulatora  *(dawne 8.45)*

  
**Skąd czerpie dane:**  
- Z typu akumulatora (AGM, LiFePO4, kwasowy).  
- Z miejsca montażu (wnęka, szafka, zewnątrz).  
- Z wymiarów i wagi akumulatora.  
  
**Gdzie ląduje:**  
- W module `camper_battery_safety`.  
  
**Jak działa logika:**  
- System sprawdza, czy akumulator jest bezpiecznie zamontowany w kamperze.  
- Uwzględnia:  
  - wentylację (kwasowe wydzielają wodór),  
  - mocowanie (akumulator nie może się przemieszczać podczas jazdy),  
  - ochronę przed wilgocią i przegrzaniem,  
  - osłonę zacisków.  
- Zaleca skrzynię na akumulator z atestem.  
  
**Efekt na ekranie:**  
- Lista kontrolna bezpieczeństwa.  
- Alert: *„Akumulator kwasowy w kamperze musi być w skrzyni wentylowanej na zewnątrz! Wodór to ryzyko wybuchu.”*  
- Komunikat: *„LiFePO4 można montować wewnątrz, ale musi być stabilnie zamocowany.”*  
  
**Migawka:** *„O co chodzi? Akumulator to ciężki i niebezpieczny pasażer. Musi być odpowiednio zabezpieczony.”*  
  
**Powiązania:** Funkcja 8.37, 8.10, 8.22.

---

### 12.34. Zabezpieczenia przeciwwilgociowe dla małych instalacji  *(dawne 8.46)*

  
**Skąd czerpie dane:**  
- Z warunków środowiskowych (garaż, piwnica, namiot, jacht).  
- Z typu urządzeń i ich stopnia ochrony IP.  
- Z materiałów i obudów.  
  
**Gdzie ląduje:**  
- W module `moisture_protection_small`.  
  
**Jak działa logika:**  
- System sprawdza, czy mała instalacja jest narażona na wilgoć.  
- Uwzględnia, że wilgoć powoduje korozję, zwarcia i uszkodzenia elektroniki.  
- Dobiera obudowy, puszki, peszle i uszczelki o odpowiednim stopniu IP.  
- Zaleca osuszacze lub pochłaniacze wilgoci w pomieszczeniach.  
  
**Efekt na ekranie:**  
- Lista zalecanych osłon.  
- Komunikat: *„W garażu wilgotnym użyj obudów IP65 i puszki z uszczelką. Przewody prowadź w peszlu.”*  
- Ostrzeżenie: *„Wilgoć to cichy zabójca instalacji elektrycznej.”*  
  
**Migawka:** *„O co chodzi? Woda i prąd to nie jest dobra para. Trzeba je rozdzielić.”*  
  
**Powiązania:** Funkcja 8.49, 8.10, 8.22.

---

### 12.35. Co zabrać ze sobą na kemping – lista kontrolna  *(dawne 8.47)*

  
**Skąd czerpie dane:**  
- Z planowanego pobytu (liczba dni, liczba osób, sezon).  
- Z profilu użytkowania (telefony, lodówka, oświetlenie, radio).  
- Z bazy typowych akcesoriów.  
  
**Gdzie ląduje:**  
- W module `camping_checklist`.  
  
**Jak działa logika:**  
- System generuje listę rzeczy do zabrania na kemping związanych z zasilaniem.  
- Uwzględnia: akumulator, panel, regulator, przetwornicę, kable, bezpieczniki, miernik, ładowarki.  
- Dodaje elementy bezpieczeństwa: gaśnica, taśma izolacyjna, miernik napięcia.  
- Dzieli listę na „must have” i „opcjonalne”.  
  
**Efekt na ekranie:**  
- Interaktywna lista do odhaczania.  
- Komunikat: *„Na 3-dniowy kemping potrzebujesz: panel 120W, akumulator 100Ah, regulator MPPT, przetwornicę 500W, kable 6 mm², bezpieczniki 20A i miernik napięcia.”*  
- Ostrzeżenie: *„Nie zapomnij o gaśnicy i mierniku – to podstawa bezpieczeństwa.”*  
  
**Migawka:** *„O co chodzi? Kemping to przygoda, ale prąd nie bierze się znikąd. Trzeba go zabrać ze sobą.”*  
  
**Powiązania:** Funkcja 8.3, 8.5, 8.16.

---

### 12.36. Tryb „praca zdalna w terenie” – zasilanie laptopa i routera  *(dawne 8.48)*

  
**Skąd czerpie dane:**  
- Z mocy laptopa i routera (W), czasu pracy.  
- Z napięcia zasilania (230V przez przetwornicę lub 12V/24V bezpośrednio).  
- Z wymagań dotyczących stabilności napięcia.  
  
**Gdzie ląduje:**  
- W module `remote_work_power`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez laptopa i router.  
- Uwzględnia, że praca zdalna wymaga ciągłego zasilania przez kilka godzin.  
- Dobiera akumulator i panel, aby zapewnić stabilne zasilanie.  
- Sprawdza, czy lepiej zasilać bezpośrednio przez przetwornicę 12V na USB‑C czy przez falownik 230V.  
  
**Efekt na ekranie:**  
- Komunikat: *„Laptop 60W + router 10W przez 8 h = 560 Wh. Akumulator 100Ah 12V wystarczy na 2 dni pracy.”*  
- Ostrzeżenie: *„Zasilanie laptopa przez falownik 230V traci 15% energii. Lepsza ładowarka USB‑C PD z 12V.”*  
  
**Migawka:** *„O co chodzi? Praca zdalna w terenie to wolność, ale prądu trzeba pilnować.”*  
  
**Powiązania:** Funkcja 8.9, 8.19, 8.27.

---

### 12.37. Dobór kabli i złączek do małej instalacji  *(dawne 8.49)*

  
**Skąd czerpie dane:**  
- Z prądów w instalacji (obliczonych z mocy i napięcia).  
- Z długości kabli.  
- Z warunków środowiskowych (na zewnątrz, w kamperze, w garażu).  
  
**Gdzie ląduje:**  
- W module `small_wiring_selection`.  
  
**Jak działa logika:**  
- System dobiera przekroje kabli do poszczególnych obwodów.  
- Uwzględnia dopuszczalny spadek napięcia (zwykle < 3%).  
- Dobiera złączki (MC4, XT60, bananowe, oczkowe) i końcówki.  
- Sprawdza, czy izolacja kabli jest odpowiednia do środowiska.  
  
**Efekt na ekranie:**  
- Tabela: *„Panel 100W → regulator: kabel 4 mm², złączki MC4. Regulator → akumulator: kabel 6 mm², końcówki oczkowe. Akumulator → przetwornica: kabel 25 mm², bezpiecznik 100A.”*  
- Ostrzeżenie: *„Za cienki kabel to spadek napięcia i ryzyko pożaru.”*  
  
**Migawka:** *„O co chodzi? Kable to żyły instalacji. Muszą być odpowiednio grube.”*  
  
**Powiązania:** Funkcja 8.2, 8.10, 8.13.

---

### 12.38. Szybka diagnoza problemów – najczęstsze błędy  *(dawne 8.50)*

  
**Skąd czerpie dane:**  
- Z objawów zgłaszanych przez użytkownika (brak prądu, niskie napięcie, przegrzewanie).  
- Z historii instalacji i pomiarów.  
- Z bazy typowych usterek.  
  
**Gdzie ląduje:**  
- W module `troubleshooting`.  
  
**Jak działa logika:**  
- System zadaje pytania diagnostyczne.  
- Na podstawie odpowiedzi identyfikuje prawdopodobną przyczynę awarii.  
- Podaje kroki naprawcze.  
- Ostrzega przed niebezpiecznymi próbami naprawy.  
  
**Efekt na ekranie:**  
- Interaktywny przewodnik diagnostyczny.  
- Komunikat: *„Brak prądu? Sprawdź kolejno: napięcie akumulatora, bezpiecznik, połączenia, regulator.”*  
- Ostrzeżenie: *„Nie zwarcie przewodów podczas testów – grozi pożarem.”*  
  
**Migawka:** *„O co chodzi? Zamiast zgadywać, system prowadzi Cię za rękę i mówi, gdzie patrzeć.”*  
  
**Powiązania:** Funkcja 8.22, 8.44, 8.45.

---

### 12.39. Zasilanie urządzeń medycznych (CPAP, koncentrator tlenu, inhalator)  *(dawne 8.51)*

  
**Skąd czerpie dane:**  
- Z mocy urządzenia medycznego (W), napięcia zasilania (12V/24V/230V).  
- Z czasu pracy (zwykle cała noc, 8–10 h).  
- Z wymaganego zapasu bezpieczeństwa.  
  
**Gdzie ląduje:**  
- W module `medical_device_power`.  
  
**Jak działa logika:**  
- System oblicza zużycie energii przez urządzenie medyczne.  
- Uwzględnia, że takie urządzenia muszą działać niezawodnie – bez przerwy.  
- Dobiera akumulator z dużym zapasem (minimum 2 doby) oraz panel do doładowania.  
- Sprawdza, czy lepsza jest przetwornica 12V na 230V, czy bezpośrednie zasilanie 12V (jeśli urządzenie to obsługuje).  
- Zaleca redundancję: drugi akumulator lub powerbank jako awaryjne źródło.  
  
**Efekt na ekranie:**  
- Komunikat: *„CPAP 60W przez 8 h zużywa 0,48 kWh. Akumulator LiFePO4 100Ah (1,2 kWh) wystarczy na 2 noce, ale zalecamy drugi akumulator zapasowy.”*  
- Ostrzeżenie: *„Urządzenia medyczne nie mogą zostać bez zasilania – zawsze miej zapasowe źródło energii.”*  
  
**Migawka:** *„O co chodzi? Tu nie chodzi o wygodę, tylko o życie. Zasilanie musi być pewne jak w banku.”*  
  
**Powiązania:** Funkcja 8.4, 8.20, 8.22.

---

### 12.40. Awaryjne zasilanie lodówki domowej podczas blackoutu  *(dawne 8.52)*

  
**Skąd czerpie dane:**  
- Z mocy lodówki (W), klasy energetycznej, wieku.  
- Z temperatury otoczenia i częstotliwości otwierania.  
- Z dostępnych akumulatorów i przetwornic.  
  
**Gdzie ląduje:**  
- W module `blackout_fridge_power`.  
  
**Jak działa logika:**  
- System szacuje średni pobór mocy lodówki (zwykle 50–150 W, praca cykliczna).  
- Oblicza dobowe zużycie energii (przyjmuje ok. 0,8–1,5 kWh/dobę dla typowej lodówki).  
- Dobiera akumulator i przetwornicę o odpowiedniej mocy.  
- Uwzględnia prąd rozruchowy sprężarki (2–3× moc nominalna).  
- Sprawdza, ile dni lodówka wytrzyma bez prądu z sieci.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twoja lodówka zużywa ok. 1,2 kWh/dobę. Akumulator 200Ah 12V (2,4 kWh) podtrzyma ją przez 2 dni. Potrzebujesz przetwornicy min. 1000W (rozruch 2000W).”*  
- Ostrzeżenie: *„Bez zasilania lodówka w lecie wytrzyma tylko 4 godziny, potem jedzenie się psuje.”*  
  
**Migawka:** *„O co chodzi? Blackout to wyścig z czasem. Lodówka to pierwsza rzecz do uratowania.”*  
  
**Powiązania:** Funkcja 8.4, 8.20, 8.41.

---

### 12.41. Awaryjne zasilanie kotła gazowego / pompy C.O.  *(dawne 8.53)*

  
**Skąd czerpie dane:**  
- Z mocy kotła, pompy obiegowej, sterownika (W).  
- Z napięcia zasilania (230V).  
- Z czasu pracy w sezonie grzewczym.  
  
**Gdzie ląduje:**  
- W module `gas_boiler_backup_power`.  
  
**Jak działa logika:**  
- System sumuje moc wszystkich elementów: pompa obiegowa (40–80 W), sterownik (5–15 W), zawory (5–10 W).  
- Oblicza zużycie dobowe (zwykle 0,5–1 kWh/dobę).  
- Dobiera akumulator i przetwornicę (czysta sinusoida, bo pompa może źle pracować na modyfikowanej).  
- Sprawdza, ile godzin system będzie działał w blackoucie.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twój kocioł z pompą potrzebuje 70 W ciągle. Akumulator 100Ah 12V podtrzyma go przez 17 h. Zalecamy przetwornicę sinus 300W.”*  
- Ostrzeżenie: *„Użyj przetwornicy z czystą sinusoidą – inaczej pompa będzie buczeć i może się uszkodzić.”*  
  
**Migawka:** *„O co chodzi? Zima bez ogrzewania to nie przelewki. Kocioł musi działać nawet w blackout.”*  
  
**Powiązania:** Funkcja 8.20, 8.36, 8.41.

---

### 12.42. Moduł „Czy mogę podłączyć urządzenie 12V bezpośrednio?”  *(dawne 8.54)*

  
**Skąd czerpie dane:**  
- Z napięcia urządzenia (12V/24V) i jego tolerancji.  
- Z napięcia akumulatora (12V/24V, a w praktyce 11–14,5 V).  
- Z prądu pobieranego przez urządzenie.  
  
**Gdzie ląduje:**  
- W module `direct_12v_check`.  
  
**Jak działa logika:**  
- System sprawdza, czy urządzenie może być zasilane bezpośrednio z akumulatora.  
- Uwzględnia, że napięcie akumulatora nie jest stałe – waha się od 11 V (rozładowany) do 14,6 V (ładowanie).  
- Sprawdza, czy urządzenie ma wbudowany stabilizator lub szeroki zakres napięć.  
- Ostrzega przed przepięciem podczas ładowania akumulatora.  
  
**Efekt na ekranie:**  
- Alert: *„Urządzenie 12V o wąskiej tolerancji (±5%) nie powinno być podłączane bezpośrednio. Użyj stabilizatora lub przetwornicy DC/DC.”*  
- Komunikat: *„Router 12V z szerokim zakresem 9–15 V może być podłączony bezpośrednio, ale tylko gdy akumulator nie jest ładowany.”*  
  
**Migawka:** *„O co chodzi? 12V to nie zawsze 12V. Akumulator potrafi dać 14,6 V i usmażyć delikatne urządzenie.”*  
  
**Powiązania:** Funkcja 8.9, 8.42, 8.49.

---

### 12.43. Zabezpieczenie akumulatora przed zimnem w małej instalacji  *(dawne 8.55)*

  
**Skąd czerpie dane:**  
- Z typu akumulatora (AGM, LiFePO4, kwasowy).  
- Z lokalizacji i temperatury minimalnej.  
- Z dostępnych metod ogrzewania.  
  
**Gdzie ląduje:**  
- W module `battery_cold_protection_small`.  
  
**Jak działa logika:**  
- System sprawdza, czy akumulator będzie przechowywany w niskich temperaturach.  
- Uwzględnia, że LiFePO4 nie wolno ładować poniżej 0°C, a AGM traci pojemność przy mrozie.  
- Dobiera odpowiednią izolację, matę grzewczą lub ogrzewaną skrzynię.  
- Oblicza zużycie energii przez ogrzewanie i jego wpływ na bilans.  
  
**Efekt na ekranie:**  
- Komunikat: *„Akumulator LiFePO4 w garażu przy –10°C wymaga maty grzewczej 30 W sterowanej termostatem. Zużyje 0,2 kWh/dobę.”*  
- Ostrzeżenie: *„Bez ogrzewania nie naładujesz LiFePO4 zimą – BMS zablokuje ładowanie.”*  
  
**Migawka:** *„O co chodzi? Akumulator to też zmarzlak. Trzeba go otulić.”*  
  
**Powiązania:** Funkcja 8.4, 8.45, 8.60.

---

### 12.44. Porównanie kosztów małego zestawu solarnego vs. przedłużacz  *(dawne 8.56)*

  
**Skąd czerpie dane:**  
- Z odległości od sieci energetycznej i kosztu przedłużenia.  
- Z zapotrzebowania na energię.  
- Z cen zestawu solarnego i kosztów eksploatacji.  
  
**Gdzie ląduje:**  
- W module `solar_vs_extension_cord`.  
  
**Jak działa logika:**  
- System porównuje koszt małego zestawu solarnego (panel + akumulator + regulator) z kosztem poprowadzenia przedłużacza z sieci.  
- Uwzględnia: koszt zakupu, koszt energii z sieci, wygodę, ryzyko kradzieży, spadki napięcia na długim kablu.  
- Oblicza okres zwrotu zestawu solarnego.  
- Wskazuje, kiedy solar jest opłacalny (działka daleko od sieci, niskie zużycie).  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Przedłużacz 100 m: 300 zł, koszt energii 50 zł/rok. Zestaw solarny 200W: 800 zł, koszt energii 0 zł/rok. Zwrot po 6 latach.”*  
- Komunikat: *„Jeśli używasz działki tylko w weekendy i nie masz gniazdka, solar wygrywa.”*  
  
**Migawka:** *„O co chodzi? Czasem nie opłaca się ciągnąć kabla. Słońce jest za darmo.”*  
  
**Powiązania:** Funkcja 8.3, 8.5, 8.6.

---

### 12.45. Gniazda zapalniczki samochodowej i adaptery – co można podłączyć  *(dawne 8.57)*

  
**Skąd czerpie dane:**  
- Z maksymalnego prądu gniazda zapalniczki (zwykle 10–15 A).  
- Z mocy urządzeń (lodówka, ładowarka, kompresor).  
- Z napięcia (12V/24V).  
  
**Gdzie ląduje:**  
- W module `cigarette_lighter_socket`.  
  
**Jak działa logika:**  
- System sprawdza, czy urządzenie może być zasilane z gniazda zapalniczki.  
- Uwzględnia ograniczenie prądowe (zwykle 10 A przy 12V = 120 W).  
- Dobiera adaptery i rozgałęźniki.  
- Ostrzega przed przeciążeniem gniazda i spaleniem bezpiecznika.  
  
**Efekt na ekranie:**  
- Komunikat: *„Lodówka 50W pobiera 4,2 A – można podłączyć. Czajnik 120W pobiera 10 A – gniazdo na granicy, lepiej bezpośrednio do akumulatora.”*  
- Ostrzeżenie: *„Nie używaj urządzeń powyżej 120 W w gnieździe zapalniczki.”*  
  
**Migawka:** *„O co chodzi? Gniazdo zapalniczki to nie gniazdko w domu. Ma swoje limity.”*  
  
**Powiązania:** Funkcja 8.13, 8.4, 8.10.

---

### 12.46. Planowanie rozbudowy małej instalacji (dodawanie paneli, akumulatorów)  *(dawne 8.58)*

  
**Skąd czerpie dane:**  
- Z obecnej konfiguracji (panel, akumulator, regulator).  
- Z planowanego wzrostu zapotrzebowania.  
- Z budżetu i dostępnej przestrzeni.  
  
**Gdzie ląduje:**  
- W module `expansion_planning`.  
  
**Jak działa logika:**  
- System analizuje, jak rozbudować małą instalację bez wymiany wszystkiego.  
- Uwzględnia, że regulator musi obsłużyć dodatkowe panele, a akumulator można dołożyć równolegle (jeśli ten sam typ i wiek).  
- Planuje etapy rozbudowy: najpierw dodatkowy panel, potem drugi akumulator.  
- Ostrzega przed łączeniem akumulatorów o różnym wieku i pojemności.  
  
**Efekt na ekranie:**  
- Schemat rozbudowy.  
- Komunikat: *„Twój regulator 20A obsłuży jeszcze jeden panel 100W. Akumulator 100Ah możesz rozbudować tylko o taki sam model i podobny wiek.”*  
- Ostrzeżenie: *„Nie łącz nowego akumulatora ze starym – stary pociągnie nowy w dół.”*  
  
**Migawka:** *„O co chodzi? Rozbudowa to sztuka. Trzeba myśleć do przodu, żeby nie wymieniać wszystkiego.”*  
  
**Powiązania:** Funkcja 8.4, 8.37, 8.38.

---

### 12.47. Kalkulator „ile dni pracy bez słońca” dla małego zestawu  *(dawne 8.59)*

  
**Skąd czerpie dane:**  
- Z pojemności akumulatora i średniego zużycia dobowego.  
- Z prognozy nasłonecznienia lub średniej dla regionu.  
- Z typu akumulatora i DoD.  
  
**Gdzie ląduje:**  
- W module `no_sun_days_small`.  
  
**Jak działa logika:**  
- System oblicza, ile dni mały zestaw wytrzyma bez produkcji PV.  
- Uwzględnia, że pochmurne dni to produkcja 10–30% nominalnej.  
- Oblicza, jak długo akumulator pokryje zużycie.  
- Zaleca większy akumulator lub oszczędzanie energii.  
  
**Efekt na ekranie:**  
- Wykres spadku SoC w kolejnych dniach bez słońca.  
- Komunikat: *„Przy zużyciu 500 Wh/dobę i akumulatorze 100Ah (1,2 kWh) wytrzymasz 2,4 dnia bez słońca. Potem system padnie.”*  
- Ostrzeżenie: *„Zimą dni bez słońca zdarzają się częściej – zwiększ zapas.”*  
  
**Migawka:** *„O co chodzi? Słońce to kapryśny pracownik. Trzeba mieć zapas na jego nieobecność.”*  
  
**Powiązania:** Funkcja 8.4, 8.6, 8.20.

---

### 12.48. Test „czy mój akumulator jest jeszcze dobry?” – prosty miernik  *(dawne 8.60)*

  
**Skąd czerpie dane:**  
- Z napięcia spoczynkowego akumulatora.  
- Z pojemności znamionowej i wieku.  
- Z testów obciążeniowych (opcjonalnie).  
  
**Gdzie ląduje:**  
- W module `battery_health_check`.  
  
**Jak działa logika:**  
- System prowadzi użytkownika przez prosty test akumulatora.  
- Krok 1: zmierz napięcie spoczynkowe (po 4 h bez obciążenia).  
- Krok 2: podłącz znane obciążenie (np. żarówkę 50W) i obserwuj spadek napięcia.  
- Krok 3: porównaj wyniki z tabelą dla danego typu akumulatora.  
- Ocenia stan: dobry, do wymiany, uszkodzony.  
- Zaleca test pojemności w warsztacie, jeśli wyniki są niejasne.  
  
**Efekt na ekranie:**  
- Tabela napięć dla AGM i LiFePO4.  
- Komunikat: *„Napięcie spoczynkowe 12,6 V – akumulator dobry. Pod obciążeniem spadek do 12,0 V – lekka utrata pojemności.”*  
- Ostrzeżenie: *„Napięcie 10,5 V w spoczynku oznacza, że akumulator jest do wyrzucenia.”*  
  
**Migawka:** *„O co chodzi? Nie musisz być elektronikiem, żeby sprawdzić, czy akumulator jeszcze żyje.”*  
  
**Powiązania:** Funkcja 8.4, 8.44, 8.50.

---

### 12.49. Solarny generator (stacja zasilania) vs. zestaw DIY  *(dawne 8.61)*

  
**Skąd czerpie dane:**  
- Z potrzeb użytkownika: moc urządzeń, czas pracy, mobilność, budżet.  
- Z bazy gotowych stacji zasilania (EcoFlow, Bluetti, itp.) i zestawów DIY.  
- Z cen paneli, akumulatorów, regulatorów.  
  
**Gdzie ląduje:**  
- W module `solar_generator_vs_diy`.  
  
**Jak działa logika:**  
- System porównuje gotową stację zasilania z samodzielnie złożonym zestawem.  
- Uwzględnia:  
  - Gotowa stacja: kompaktowa, zintegrowana, prosta, ale droższa za 1 Wh.  
  - Zestaw DIY: tańszy, bardziej elastyczny, ale wymaga wiedzy i pracy.  
- Oblicza koszt 1 Wh dla obu opcji.  
- Uwzględnia wygodę użytkowania, gwarancję, serwis, możliwość rozbudowy.  
- Rekomenduje rozwiązanie w zależności od profilu użytkownika.  
  
**Efekt na ekranie:**  
- Tabela porównawcza: *„Stacja 500 Wh: 1200 zł, 4 kg, gotowa do pracy. Zestaw DIY 100Ah 12V: 700 zł, 12 kg, wymaga montażu.”*  
- Komunikat: *„Jeśli nie chcesz się bawić w kable, kup stację. Jeśli lubisz majsterkować, DIY da ci 2× więcej pojemności za te same pieniądze.”*  
  
**Migawka:** *„O co chodzi? Stacja to telefon, DIY to komputer. Jedno wygodne, drugie wydajne.”*  
  
**Powiązania:** Funkcja 8.7, 8.3, 8.16.

---

### 12.50. Agregat przenośny – ile paliwa na dobę?  *(dawne 8.62)*

  
**Skąd czerpie dane:**  
- Z mocy agregatu (kW), rodzaju paliwa, zużycia paliwa (l/h).  
- Z obciążenia (średnie zużycie energii).  
- Z planowanego czasu pracy na dobę.  
  
**Gdzie ląduje:**  
- W module `portable_generator_fuel`.  
  
**Jak działa logika:**  
- System oblicza zużycie paliwa przez mały agregat przenośny.  
- Uwzględnia, że agregat nie pracuje cały czas – tylko wtedy, gdy bateria jest niska.  
- Oblicza dobowe zużycie paliwa (l/dobę) i koszt.  
- Porównuje z kosztem energii z paneli i akumulatorów.  
  
**Efekt na ekranie:**  
- Komunikat: *„Agregat 2 kW przy obciążeniu 50% zużywa 0,5 l/h. Przy pracy 3 h/dobę spali 1,5 l, co kosztuje 10 zł/dobę.”*  
- Ostrzeżenie: *„Agregat to drogie paliwo. Używaj go tylko do ładowania baterii lub pracy krótkotrwałej.”*  
  
**Migawka:** *„O co chodzi? Agregat to mały smok, który pije paliwo. Trzeba wiedzieć, ile zje.”*  
  
**Powiązania:** Funkcja 8.20, 8.3, 8.4.

---

### 12.51. Bezpieczne ładowanie akumulatora w garażu (wentylacja i gazy)  *(dawne 8.63)*

  
**Skąd czerpie dane:**  
- Z typu akumulatora (AGM, kwasowy, LiFePO4).  
- Z miejsca ładowania (garaż, piwnica, pomieszczenie).  
- Z parametrów ładowania (prąd, napięcie).  
  
**Gdzie ląduje:**  
- W module `garage_battery_charging_safety`.  
  
**Jak działa logika:**  
- System sprawdza, czy ładowanie akumulatora w garażu jest bezpieczne.  
- Uwzględnia, że akumulatory kwasowe podczas ładowania wydzielają wodór – gaz wybuchowy.  
- Sprawdza, czy pomieszczenie ma wentylację (naturalną lub mechaniczną).  
- Zaleca ładowanie przy otwartych drzwiach lub z wentylatorem.  
- Ostrzega przed iskrzeniem, otwartym ogniem, papierosami.  
  
**Efekt na ekranie:**  
- Alert: *„Ładowanie akumulatora kwasowego w zamkniętym garażu grozi wybuchem wodoru! Otwórz drzwi lub zastosuj wentylację mechaniczną.”*  
- Komunikat: *„LiFePO4 nie wydziela gazów – ładowanie w garażu jest bezpieczne.”*  
  
**Migawka:** *„O co chodzi? Wodór to cichy zabójca. Wentylacja to Twój ochroniarz.”*  
  
**Powiązania:** Funkcja 8.45, 8.10, 8.60.

---

### 12.52. Urządzenia zabronione/ryzykowne dla małych falowników  *(dawne 8.64)*

  
**Skąd czerpie dane:**  
- Z mocy falownika (W) i jego przeciążalności.  
- Z listy urządzeń, które użytkownik chce podłączyć.  
- Z prądów rozruchowych urządzeń.  
  
**Gdzie ląduje:**  
- W module `forbidden_loads_small_inverter`.  
  
**Jak działa logika:**  
- System sprawdza, czy podłączane urządzenia nie przekroczą możliwości małego falownika.  
- Uwzględnia prądy rozruchowe: suszarka, czajnik, mikrofalówka, lodówka, elektronarzędzia.  
- Ostrzega przed podłączaniem urządzeń o mocy bliskiej maksimum falownika.  
- Zaleca: albo większy falownik, albo rezygnację z tych urządzeń.  
  
**Efekt na ekranie:**  
- Alert: *„Suszarka 1800W podłączona do falownika 1000W spali go przy starcie. Zrezygnuj z niej lub zastosuj falownik 3000W.”*  
- Tabela urządzeń z oceną: OK / Ryzykowne / Zabronione.  
  
**Migawka:** *„O co chodzi? Mały falownik to nie siłownia. Nie zmusisz go do dźwigania ciężarów.”*  
  
**Powiązania:** Funkcja 8.41, 8.10, 8.4.

---

### 12.53. Uziemienie i bezpieczeństwo porażeniowe małej instalacji  *(dawne 8.65)*

  
**Skąd czerpie dane:**  
- Z rodzaju instalacji (12V/24V DC, 230V AC z falownika).  
- Z miejsca montażu (garaż, kamper, jacht).  
- Z norm bezpieczeństwa.  
  
**Gdzie ląduje:**  
- W module `small_installation_grounding`.  
  
**Jak działa logika:**  
- System sprawdza, czy mała instalacja wymaga uziemienia.  
- Uwzględnia, że instalacje 12V/24V zwykle nie wymagają uziemienia ochronnego, ale instalacja 230V z falownika już tak.  
- Sprawdza, czy falownik ma uziemienie obudowy i czy gniazda 230V mają styk ochronny.  
- Zaleca uziemienie dla instalacji w wilgotnych miejscach (jacht, na zewnątrz).  
- Podaje schemat prawidłowego podłączenia.  
  
**Efekt na ekranie:**  
- Schemat: *„Falownik 230V musi mieć uziemioną obudowę. Gniazda 230V podłącz do uziemienia pojazdu lub uziomu.”*  
- Ostrzeżenie: *„Brak uziemienia przy zwarciach to ryzyko porażenia.”*  
  
**Migawka:** *„O co chodzi? Uziemienie to droga ucieczki dla prądu. Jak jej nie ma, prąd ucieka przez Ciebie.”*  
  
**Powiązania:** Funkcja 8.10, 8.45, 8.22.

---

### 12.54. Łączenie paneli z powerbankiem / stacją zasilania  *(dawne 8.66)*

  
**Skąd czerpie dane:**  
- Z napięcia panelu (Voc, Vmp), mocy, typu złącz.  
- Z parametrów wejścia solarnego stacji/powerbanka (max napięcie, max prąd, typ złącza).  
- Z liczby paneli i ich konfiguracji.  
  
**Gdzie ląduje:**  
- W module `panel_to_powerbank`.  
  
**Jak działa logika:**  
- System sprawdza, czy panel może być bezpiecznie podłączony do powerbanka/stacji.  
- Uwzględnia, że Voc panelu nie może przekroczyć maksymalnego napięcia wejściowego stacji.  
- Sprawdza prąd zwarciowy i moc panelu.  
- Dobiera złączki i ewentualnie przejściówki (MC4 na XT60, Anderson, itp.).  
- Ostrzega przed odwrotnym podłączeniem.  
  
**Efekt na ekranie:**  
- Komunikat: *„Twój panel ma Voc 21 V, stacja akceptuje do 30 V – OK. Możesz podłączyć bezpośrednio przez adapter MC4 na XT60.”*  
- Ostrzeżenie: *„Nie podłączaj panelu o Voc wyższym niż limit stacji – spalisz elektronikę!”*  
  
**Migawka:** *„O co chodzi? Panel i powerbank muszą mówić tym samym napięciem. Inaczej będzie awantura.”*  
  
**Powiązania:** Funkcja 8.7, 8.12, 8.49.

---

### 12.55. Awaryjne zasilanie bramy garażowej / wjazdowej  *(dawne 8.67)*

  
**Skąd czerpie dane:**  
- Z mocy napędu bramy (W), napięcia (12V/24V/230V).  
- Z liczby cykli otwarcia/zamknięcia w awarii.  
- Z dostępnych akumulatorów i przetwornic.  
  
**Gdzie ląduje:**  
- W module `garage_door_emergency`.  
  
**Jak działa logika:**  
- System oblicza, ile energii potrzeba do awaryjnego otwarcia bramy.  
- Uwzględnia prąd rozruchowy silnika.  
- Dobiera akumulator i przetwornicę, aby umożliwić kilka cykli otwarcia.  
- Sprawdza, czy lepiej zasilać bezpośrednio 12V/24V, czy przez przetwornicę 230V.  
  
**Efekt na ekranie:**  
- Komunikat: *„Napęd bramy 200W, jeden cykl 20 s zużywa 40 Wh. Akumulator 12V 7Ah (84 Wh) wystarczy na 2 cykle awaryjne.”*  
- Ostrzeżenie: *„Testuj awaryjne otwieranie bramy przed blackoutem, a nie w trakcie.”*  
  
**Migawka:** *„O co chodzi? Brama to jedyna droga wjazdu. W awarii musi się otworzyć.”*  
  
**Powiązania:** Funkcja 8.20, 8.32, 8.10.

---

### 12.56. Tryb „blackout w bloku” – balkonowy zestaw awaryjny  *(dawne 8.68)*

  
**Skąd czerpie dane:**  
- Z listy krytycznych odbiorników (lodówka, router, oświetlenie, telefon).  
- Z dostępnej przestrzeni na balkonie.  
- Z parametrów paneli balkonowych.  
  
**Gdzie ląduje:**  
- W module `balcony_blackout_kit`.  
  
**Jak działa logika:**  
- System projektuje awaryjny zestaw balkonowy na czas blackoutu w mieszkaniu.  
- Uwzględnia, że w bloku nie ma miejsca na duże panele i akumulatory.  
- Dobiera kompaktowy panel balkonowy i mały akumulator/stację zasilania.  
- Oblicza, ile godzin wytrzyma lodówka i router.  
- Porównuje ze stacją zasilania i powerbankiem.  
  
**Efekt na ekranie:**  
- Komunikat: *„Panel balkonowy 400W + stacja 1000 Wh podtrzyma lodówkę i router przez 6 h. Na dłuższy blackout potrzebujesz drugiej stacji.”*  
- Ostrzeżenie: *„Nie licz na klimatyzację w blackoucie – tylko lodówka i światło.”*  
  
**Migawka:** *„O co chodzi? W bloku nie masz działki, ale masz balkon. To Twoja minielektrownia.”*  
  
**Powiązania:** Funkcja 8.20, 8.7, 8.52.

---

### 12.57. Moduł „czy mój przedłużacz wytrzyma?”  *(dawne 8.69)*

  
**Skąd czerpie dane:**  
- Z przekroju przedłużacza (mm²), długości, rodzaju.  
- Z mocy podłączanego urządzenia.  
- Z napięcia (230V).  
  
**Gdzie ląduje:**  
- W module `extension_cord_capacity`.  
  
**Jak działa logika:**  
- System sprawdza, czy przedłużacz wytrzyma obciążenie.  
- Uwzględnia, że zbyt długi i cienki przedłużacz powoduje spadek napięcia i przegrzanie.  
- Oblicza prąd i spadek napięcia.  
- Ostrzega przed przeciążeniem, szczególnie przy grzałkach i czajnikach.  
  
**Efekt na ekranie:**  
- Alert: *„Przedłużacz 25 m 1,5 mm² nie wytrzyma czajnika 2000W – spadek napięcia 8% i ryzyko pożaru. Użyj 2,5 mm².”*  
- Komunikat: *„Dla urządzeń do 1000W wystarczy 1,5 mm². Powyżej 2000W wymagane 2,5 mm² i krótki kabel.”*  
  
**Migawka:** *„O co chodzi? Przedłużacz to nie wąż strażacki. Nie przeciągniesz przez niego wszystkiego.”*  
  
**Powiązania:** Funkcja 8.2, 8.13, 8.49.

---

### 12.58. Procedura ratowania rozładowanego akumulatora (AGM/kwasowy)  *(dawne 8.70)*

  
**Skąd czerpie dane:**  
- Z napięcia spoczynkowego akumulatora.  
- Z typu akumulatora (AGM, kwasowy).  
- Z wieku i historii użytkowania.  
  
**Gdzie ląduje:**  
- W module `dead_battery_recovery`.  
  
**Jak działa logika:**  
- System prowadzi użytkownika przez procedurę ratowania głęboko rozładowanego akumulatora.  
- Krok 1: zmierz napięcie spoczynkowe.  
- Krok 2: jeśli napięcie poniżej 10,5 V, akumulator jest krytycznie rozładowany.  
- Krok 3: podłącz ładowarkę z trybem regeneracji lub prostownik o niskim prądzie.  
- Krok 4: monitoruj napięcie i temperaturę.  
- Ostrzega przed ładowaniem zbyt wysokim prądem.  
  
**Efekt na ekranie:**  
- Komunikat: *„Akumulator 12V 0,5V – spróbuj ładowania prądem 1A przez 24 h. Jeśli napięcie nie wzrośnie, akumulator jest do utylizacji.”*  
- Ostrzeżenie: *„Nie ładować głęboko rozładowanego akumulatora wysokim prądem – grozi wybuchem.”*  
  
**Migawka:** *„O co chodzi? Czasem akumulator da się uratować, ale trzeba to robić powoli i ostrożnie.”*  
  
**Powiązania:** Funkcja 8.60, 8.43, 8.45.  
  
## Rozdział 9: Instrukcja montażu i uruchomienia pakietu LiFePO4 (12V / 24V / 48V)  
  
> **Cel rozdziału:** Przeprowadzić użytkownika krok po kroku przez fizyczne złożenie pakietu ogniw LiFePO4, podłączenie BMS i pierwsze uruchomienie systemu. Rozdział zakłada, że użytkownik ma już wszystkie komponenty (ogniwa, BMS, przewody, obudowę) i chce je bezpiecznie złożyć.

---

## Moduł 13 (Kafel 13): Tryb Live

*Dawny Rozdział 7. **To nie jest zestaw nowych funkcji technicznych** — to warstwa prezentacyjna, która czerpie dane z Kafli 1–12 i AI (Kafel 10) i pokazuje je w czasie rzeczywistym. Zgodnie z Twoim opisem: użytkownik wybiera, które bloki/dane mają się wyświetlać, może tworzyć kilka stron i przeciągać bloki (góra/dół, między stronami).*

**Zasada UI:**
- Domyślny układ Live pokazuje **wybrane przez usera** widżety z listy poniżej (nie wszystkie naraz).
- Każdy widżet to okno na dane/funkcję z innego kafla (np. widżet "SoC baterii" czerpie z Kafla 4, widżet "Produkcja PV" z Kafla 3).
- Strony (2, 3...) i kolejność bloków są w pełni edytowalne przez usera (drag & drop).
- Poniżej: pełna lista dostępnych widżetów/funkcji trybu Live (dawne 7.x), każdy jako osobna pozycja do wyboru na pulpicie Live.

### 13.1. Przełączenie w tryb dashboardu  *(dawne 7.1)*

  
**Skąd czerpie dane:**  
- Z czujników i inwertera (Modbus, MQTT) – użytkownik przełącza aplikację z trybu *projektowania* na *monitoring*.  
  
**Gdzie ląduje:**  
- Dane w pamięci podręcznej i bazie szeregowej (rozdz. 1, panel główny).  
  
**Jak działa logika:**  
- Aplikacja zaczyna odczytywać rzeczywiste parametry i wyświetlać je na żywo.  
  
**Efekt na ekranie:**  
- Zmiana interfejsu – wykresy live, kafelki z aktualnymi wartościami.

---

### 13.2. Porównanie prognozy z rzeczywistością  *(dawne 7.2)*

  
**Skąd czerpie dane:**  
- Z rzeczywistych odczytów (produkcja, zużycie, SoC) oraz z wcześniejszych prognoz projektowych.  
  
**Gdzie ląduje:**  
- W tabeli `forecast_vs_actual` – różnice do analizy.  
  
**Jak działa logika:**  
- System porównuje prognozowaną produkcję z rzeczywistą dla danego dnia i wskazuje odchylenia.  
- Uczy się korygować współczynniki na przyszłość.  
  
**Efekt na ekranie:**  
- Wykres z dwiema krzywymi: prognoza vs. rzeczywistość.  
- *„Dzisiejsza produkcja jest o 15% niższa od prognozy – prawdopodobnie chmury.”*

---

### 13.3. Machine Learning – korekta modeli  *(dawne 7.3)*

  
**Skąd czerpie dane:**  
- Z długoterminowej historii (miesiące) rzeczywistych danych.  
  
**Gdzie ląduje:**  
- W modelu ML (np. regresja) – dostosowuje współczynniki do lokalizacji.  
  
**Jak działa logika:**  
- Na podstawie kilku miesięcy pracy system modyfikuje prognozy, aby lepiej odzwierciedlały rzeczywiste warunki.  
  
**Efekt na ekranie:**  
- *„Po 3 miesiącach nauki system skorygował prognozę produkcji o +8% – teraz prognozy są dokładniejsze.”*

---

### 13.4. Widok „Teraz” – najważniejsze parametry w czasie rzeczywistym  *(dawne 7.4)*

  
**Skąd czerpie dane:**  
- Z bezpośredniego odczytu z inwertera, BMS, czujników i mierników.  
  
**Gdzie ląduje:**  
- W module `live_now_view`.  
  
**Jak działa logika:**  
- System wyświetla najważniejsze parametry na jednym ekranie:  
  - produkcja PV (W),  
  - zużycie domu (W),  
  - moc ładowania/rozładowania baterii (W),  
  - SoC (%),  
  - napięcie DC (V),  
  - temperatura ogniw (°C),  
  - status źródeł (PV, bateria, agregat, sieć).  
- Odświeża dane co 1–5 sekund.  
- Używa kolorów: zielony – OK, żółty – uwaga, czerwony – alarm.  
  
**Efekt na ekranie:**  
- Kafelki z wartościami i miniwykresami.  
- *„PV: 2,4 kW | Dom: 1,1 kW | Bateria: ładowanie +1,3 kW | SoC: 87%”*  
  
**Migawka:** *„O co chodzi? To pulpit systemu. Widzisz wszystko, co dzieje się teraz.”*  
  
**Powiązania:** Funkcja 7.1, 7.5, 7.6.

---

### 13.5. Wykresy mocy na żywo (produkcja / zużycie / bateria / agregat)  *(dawne 7.5)*

  
**Skąd czerpie dane:**  
- Z historii odczytów zapisywanych w bazie co kilka sekund.  
  
**Gdzie ląduje:**  
- W module `live_power_charts`.  
  
**Jak działa logika:**  
- System rysuje wykresy liniowe lub słupkowe w czasie rzeczywistym.  
- Pokazuje osobno:  
  - moc PV,  
  - zużycie,  
  - przepływ energii do/z baterii,  
  - pracę agregatu.  
- Umożliwia wybór zakresu czasowego: 1 h, 6 h, 24 h.  
- Zaznacza zdarzenia (np. start agregatu, odłączenie odbiornika).  
  
**Efekt na ekranie:**  
- Interaktywne wykresy z możliwością przybliżania.  
- *„O 14:30 produkcja PV zaczęła spadać, a bateria przeszła w tryb rozładowania.”*  
  
**Migawka:** *„O co chodzi? Widzisz, jak energia płynie w systemie – to jak EKG instalacji.”*  
  
**Powiązania:** Funkcja 7.1, 7.4, 7.10.

---

### 13.6. Centrum powiadomień i alarmów  *(dawne 7.6)*

  
**Skąd czerpie dane:**  
- Z progów alarmowych ustawionych w systemie (np. niski SoC, przegrzanie, awaria).  
- Z danych telemetrycznych.  
  
**Gdzie ląduje:**  
- W module `notification_center`.  
  
**Jak działa logika:**  
- System agreguje alarmy i powiadomienia w jednym miejscu.  
- Kategoryzuje je: bezpieczeństwo, wydajność, bateria, PV, komunikacja.  
- Umożliwia filtrowanie, oznaczanie jako przeczytane, ustawianie powiadomień.  
- Powiadamia o nowych zdarzeniach.  
  
**Efekt na ekranie:**  
- Lista alarmów z ikonami i kolorami.  
- *„Krytyczny: niski poziom baterii 15% o 22:00.”*  
  
**Migawka:** *„O co chodzi? To skrzynka odbiorcza systemu. Wiesz, co się dzieje i co wymaga reakcji.”*  
  
**Powiązania:** Funkcja 7.7, 7.8, 7.19.

---

### 13.7. Powiadomienia push, SMS, e-mail  *(dawne 7.7)*

  
**Skąd czerpie dane:**  
- Z konfiguracji kanałów powiadomień użytkownika.  
- Z centrum alarmów.  
  
**Gdzie ląduje:**  
- W module `notification_channels`.  
  
**Jak działa logika:**  
- System dobiera kanał powiadomienia w zależności od priorytetu:  
  - push – standardowe,  
  - SMS – alarmy krytyczne,  
  - e-mail – raporty i podsumowania.  
- Umożliwia ustawienie ciszy nocnej, powiadomień tylko krytycznych.  
  
**Efekt na ekranie:**  
- Ustawienia: *„Alarm krytyczny: SMS + push. Ostrzeżenie: push. Raporty: e-mail.”*  
  
**Migawka:** *„O co chodzi? System woła Cię, gdy coś się dzieje, nawet jak nie patrzysz.”*  
  
**Powiązania:** Funkcja 7.6, 7.8, 7.9.

---

### 13.8. Priorytety alarmów (info / ostrzeżenie / krytyczny)  *(dawne 7.8)*

  
**Skąd czerpie dane:**  
- Z progów alarmowych i logiki systemu.  
  
**Gdzie ląduje:**  
- W module `alarm_priorities`.  
  
**Jak działa logika:**  
- System dzieli alarmy na poziomy:  
  - info – zdarzenia neutralne (np. zakończenie cyklu ładowania),  
  - ostrzeżenie – wymaga uwagi wkrótce (np. SoC poniżej 25%),  
  - krytyczny – natychmiastowa reakcja (np. przegrzanie, zwarcie).  
- Określa domyślne progi i pozwala je edytować.  
  
**Efekt na ekranie:**  
- Lista alarmów z kolorami: niebieski, żółty, czerwony.  
- *„Krytyczny: temperatura ogniwa #4 przekroczyła 55°C.”*  
  
**Migawka:** *„O co chodzi? Nie każdy alarm to pożar. System mówi, co jest pilne, a co tylko informacją.”*  
  
**Powiązania:** Funkcja 7.6, 7.7, 7.19.

---

### 13.9. Harmonogram automatycznych zadań (scheduler)  *(dawne 7.26)*

  
**Skąd czerpie dane:**  
- Z profilu zużycia energii, preferencji użytkownika, prognoz pogody i produkcji PV.  
- Z listy odbiorników i ich priorytetów (funkcja 1.20).  
  
**Gdzie ląduje:**  
- W module `task_scheduler`.  
  
**Jak działa logika:**  
- System tworzy harmonogram automatycznych zadań: grzanie wody, pranie, zmywanie, ładowanie EV, praca pompy ciepła.  
- Uwzględnia dni tygodnia, pory roku i godziny szczytowej produkcji PV.  
- Użytkownik może tworzyć własne reguły czasowe.  
- System dba o to, aby ciężkie odbiorniki startowały wtedy, gdy jest najwięcej darmowej energii z PV.  
- Automatycznie przesuwa zadania w razie gorszej pogody lub niskiego SoC.  
  
**Efekt na ekranie:**  
- Kalendarz zadań: *„Poniedziałek 10:00 – ładowanie bojlera; 13:00 – pralka; 16:00 – zmywarka.”*  
- Alert: *„Przesunięto pranie na jutro z powodu niskiej produkcji PV.”*  
  
**Migawka:** *„O co chodzi? System sam planuje pracę urządzeń, żeby wykorzystać darmowe słońce i nie rozładować baterii.”*  
  
**Powiązania:** Funkcja 7.17, 7.25, 3.14.

---

### 13.10. Tryb wakacyjny / nieobecności  *(dawne 7.27)*

  
**Skąd czerpie dane:**  
- Z daty wyjazdu i powrotu, listy odbiorników, pojemności baterii, prognoz pogody.  
  
**Gdzie ląduje:**  
- W module `away_mode`.  
  
**Jak działa logika:**  
- System przełącza instalację w tryb minimalnego zużycia podczas nieobecności użytkownika.  
- Ustala:  
  - minimalną temperaturę w domu (ochrona przed zamarzaniem),  
  - ograniczone ładowanie C.W.U.,  
  - wyłączenie zbędnych odbiorników,  
  - tryb uśpienia BMS i routerów,  
  - okresowe sprawdzanie systemu i powiadamianie.  
- Uwzględnia podlewanie, monitoring, oświetlenie zewnętrzne.  
  
**Efekt na ekranie:**  
- Status: *„Tryb nieobecności aktywny. Bateria 78%. Zużycie: 0,2 kWh/dobę.”*  
- Alert: *„Wykryto spadek SoC poniżej planu – sprawdź instalację.”*  
  
**Migawka:** *„O co chodzi? Gdy Cię nie ma, dom nie marnuje energii. System pilnuje, żeby nic nie zamarzło i nie padło.”*  
  
**Powiązania:** Funkcja 7.26, 6.33, 1.8.

---

### 13.11. Analiza jakości zasilania AC (harmoniczne, napięcie, częstotliwość)  *(dawne 7.28)*

  
**Skąd czerpie dane:**  
- Z pomiarów na wyjściu falownika i wejściu do głównych odbiorników.  
  
**Gdzie ląduje:**  
- W module `power_quality_ac`.  
  
**Jak działa logika:**  
- System monitoruje parametry zasilania AC:  
  - napięcie (V),  
  - częstotliwość (Hz),  
  - współczynnik mocy (PF),  
  - harmoniczne (THD).  
- Porównuje z normami (np. EN 50160).  
- Wykrywa odkształcenia, zapady napięcia, skoki częstotliwości.  
- Ostrzega przed uszkodzeniem wrażliwych urządzeń lub przeciążeniem falownika.  
  
**Efekt na ekranie:**  
- Wykres: *„THD napięcia 6,5% – powyżej normy 5%.”*  
- Alert: *„Wykryto wysokie harmoniczne – możliwe przeciążenie falownika przez pompę ciepła.”*  
  
**Migawka:** *„O co chodzi? Prąd to nie tylko napięcie. Jakość zasilania decyduje o żywotności sprzętu.”*  
  
**Powiązania:** Funkcja 7.19, 7.38, 4.15.

---

### 13.12. Monitorowanie temperatury kluczowych komponentów  *(dawne 7.29)*

  
**Skąd czerpie dane:**  
- Z czujników temperatury zamontowanych na falowniku, baterii, szynach, złączkach i w rozdzielnicy.  
  
**Gdzie ląduje:**  
- W module `component_temperature`.  
  
**Jak działa logika:**  
- System zbiera temperatury z kluczowych punktów instalacji.  
- Ustala progi ostrzegawcze i alarmowe (np. falownik 60°C, szyny 70°C).  
- Wykrywa gorące punkty (hot-spots), które wskazują na luźne połączenia lub przeciążenie.  
- W razie przegrzania redukuje moc lub wyłącza zagrożony obwód.  
  
**Efekt na ekranie:**  
- Mapa cieplna: *„Szyna główna: 72°C – UWAGA.”*  
- Alert: *„Przegrzanie na zacisku baterii #3 – sprawdź dokręcenie śrub.”*  
  
**Migawka:** *„O co chodzi? Gorące punkty to wczesny objaw awarii. System widzi, zanim poczujesz zapach.”*  
  
**Powiązania:** Funkcja 7.21, 4.24, 3.26.

---

### 13.13. Eksport danych do CSV / PDF / API  *(dawne 7.30)*

  
**Skąd czerpie dane:**  
- Z bazy historycznej systemu.  
  
**Gdzie ląduje:**  
- W module `data_export`.  
  
**Jak działa logika:**  
- System umożliwia eksport danych:  
  - CSV – dla zaawansowanych analiz,  
  - PDF – dla raportów,  
  - JSON / API – dla integracji z innymi systemami.  
- Użytkownik wybiera zakres dat i parametry.  
- Możliwy eksport automatyczny co dzień/miesiąc.  
  
**Efekt na ekranie:**  
- Przycisk: *„Pobierz dane styczeń – PDF/CSV.”*  
- Status: *„Wyeksportowano 31 dni danych, 18 parametrów.”*  
  
**Migawka:** *„O co chodzi? Twoje dane należą do Ciebie. Możesz je wziąć i zrobić z nimi, co chcesz.”*  
  
**Powiązania:** Funkcja 7.9, 7.15, 7.36.

---

### 13.14. Integracja z asystentem głosowym (Google Home, Alexa)  *(dawne 7.31)*

  
**Skąd czerpie dane:**  
- Z konfiguracji konta i dostępnych komend.  
  
**Gdzie ląduje:**  
- W module `voice_assistant`.  
  
**Jak działa logika:**  
- System umożliwia sterowanie i odczyt przez asystenta głosowego:  
  - „Ile energii produkuję teraz?”  
  - „Włącz bojler.”  
  - „Jaki jest stan baterii?”  
- Tłumaczy komendy na akcje w systemie.  
- Zapewnia bezpieczne uwierzytelnienie.  
  
**Efekt na ekranie:**  
- Status: *„Połączono z Google Home.”*  
  
**Migawka:** *„O co chodzi? Czasem wygodniej powiedzieć niż klikać.”*  
  
**Powiązania:** Funkcja 7.15, 7.16, 7.26.

---

### 13.15. Przypomnienia o przeglądach i serwisie  *(dawne 7.32)*

  
**Skąd czerpie dane:**  
- Z harmonogramu serwisowego producentów i historii pracy urządzeń.  
  
**Gdzie ląduje:**  
- W module `service_reminders`.  
  
**Jak działa logika:**  
- System śledzi czas pracy i daty przeglądów.  
- Przypomina o:  
  - wymianie oleju w agregacie,  
  - sprawdzeniu dokręcenia połączeń,  
  - czyszczeniu paneli,  
  - sprawdzeniu wentylacji i filtrów,  
  - teście RCD i SPD.  
- Generuje listę zadań serwisowych.  
  
**Efekt na ekranie:**  
- Alert: *„Za 7 dni: przegląd agregatu (olej, filtry).”*  
  
**Migawka:** *„O co chodzi? Serwis to długowieczność. System pamięta, żebyś nie zapomniał.”*  
  
**Powiązania:** Funkcja 7.19, 4.40, 6.36.

---

### 13.16. Analiza zużycia per obwód / gniazdo  *(dawne 7.33)*

  
**Skąd czerpie dane:**  
- Z mierników energii na poszczególnych obwodach lub smart gniazdek.  
  
**Gdzie ląduje:**  
- W module `per_circuit_energy`.  
  
**Jak działa logika:**  
- System zbiera zużycie na poziomie obwodów:  
  - oświetlenie,  
  - gniazda,  
  - pompy,  
  - ogrzewanie,  
  - AGD.  
- Identyfikuje największych konsumentów.  
- Porównuje z normami i sugeruje oszczędności.  
  
**Efekt na ekranie:**  
- Wykres: *„Bojler 35%, pompa ciepła 40%, gniazda 25%.”*  
- Sugestia: *„Bojler zużywa więcej niż planowano – sprawdź grzałkę i cyrkulację.”*  
  
**Migawka:** *„O co chodzi? Wiesz dokładnie, co zjada prąd, i możesz działać precyzyjnie.”*  
  
**Powiązania:** Funkcja 7.10, 7.11, 8.44.

---

### 13.17. Tryb odtwarzania historycznego (playback)  *(dawne 7.34)*

  
**Skąd czerpie dane:**  
- Z bazy historycznej wszystkich parametrów systemu.  
  
**Gdzie ląduje:**  
- W module `historical_playback`.  
  
**Jak działa logika:**  
- System umożliwia odtworzenie dowolnego dnia, tygodnia lub zdarzenia z przeszłości.  
- Pokazuje animację pracy instalacji: produkcję, zużycie, SoC, przepływy energii.  
- Pozwala przewijać czas do przodu i do tyłu.  
- Użyteczne do analizy awarii i zachowania systemu w konkretnych warunkach.  
  
**Efekt na ekranie:**  
- Suwak czasu i animacja: *„15 stycznia, 14:30 – PV 2,1 kW, bateria ładowanie 1,4 kW.”*  
  
**Migawka:** *„O co chodzi? Możesz cofnąć się w czasie i zobaczyć, co dokładnie się działo.”*  
  
**Powiązania:** Funkcja 7.5, 7.9, 7.43.

---

### 13.18. Bezpieczeństwo dostępu – role i uprawnienia  *(dawne 7.35)*

  
**Skąd czerpie dane:**  
- Z konfiguracji kont użytkowników i ich ról.  
  
**Gdzie ląduje:**  
- W module `access_control`.  
  
**Jak działa logika:**  
- System tworzy role:  
  - administrator – pełny dostęp,  
  - technik – serwis i diagnostyka,  
  - użytkownik – podgląd i podstawowe sterowanie,  
  - gość – tylko odczyt.  
- Umożliwia nadawanie uprawnień do poszczególnych modułów.  
- Prowadzi rejestr logowań i zmian.  
  
**Efekt na ekranie:**  
- Ustawienia: *„Technik: dostęp do serwisu i diagnostyki. Użytkownik: tylko podgląd.”*  
  
**Migawka:** *„O co chodzi? Nie każdy powinien mieć klucze do całego systemu.”*  
  
**Powiązania:** Funkcja 7.15, 7.36, 7.43.

---

### 13.19. Kopia zapasowa konfiguracji i danych  *(dawne 7.36)*

  
**Skąd czerpie dane:**  
- Z ustawień systemu, historii, scenariuszy i raportów.  
  
**Gdzie ląduje:**  
- W module `backup`.  
  
**Jak działa logika:**  
- System regularnie tworzy kopie zapasowe:  
  - lokalnie na urządzeniu,  
  - w chmurze,  
  - na zewnętrznym dysku.  
- Umożliwia przywrócenie konfiguracji po awarii.  
- Weryfikuje integralność kopii.  
  
**Efekt na ekranie:**  
- Status: *„Ostatnia kopia: dziś 02:00. Status: OK.”*  
  
**Migawka:** *„O co chodzi? Kopia to polisa ubezpieczeniowa dla Twoich danych.”*  
  
**Powiązania:** Funkcja 7.15, 7.30, 7.35.

---

### 13.20. Aktualizacje oprogramowania i firmware  *(dawne 7.37)*

  
**Skąd czerpie dane:**  
- Z informacji o wersji oprogramowania systemu, inwertera, BMS i czujników.  
  
**Gdzie ląduje:**  
- W module `update_manager`.  
  
**Jak działa logika:**  
- System sprawdza dostępność aktualizacji.  
- Planuje aktualizacje w bezpiecznym czasie (nie w szczycie produkcji).  
- Tworzy punkt przywracania przed aktualizacją.  
- Aktualizuje po kolei komponenty i raportuje sukces lub błąd.  
  
**Efekt na ekranie:**  
- Alert: *„Nowa wersja oprogramowania inwertera dostępna. Zaplanowano aktualizację na 02:00.”*  
  
**Migawka:** *„O co chodzi? System jak telefon – aktualizacje naprawiają błędy i dodają nowe funkcje.”*  
  
**Powiązania:** Funkcja 7.36, 7.19, 7.15.

---

### 13.21. Monitorowanie rezystancji połączeń i stanu okablowania  *(dawne 7.38)*

  
**Skąd czerpie dane:**  
- Z czujników temperatury, pomiarów napięcia i prądu w kluczowych punktach.  
  
**Gdzie ląduje:**  
- W module `cable_health_monitoring`.  
  
**Jak działa logika:**  
- System porównuje spadki napięć i temperatury na połączeniach z normą.  
- Wykrywa luźne połączenia, utlenienie, wzrost rezystancji.  
- Ostrzega przed potencjalnym pożarem lub stratami energii.  
- Sugeruje sprawdzenie konkretnego punktu.  
  
**Efekt na ekranie:**  
- Alert: *„Wzrost rezystancji na złączu baterii #2 o 35% – sprawdź dokręcenie.”*  
  
**Migawka:** *„O co chodzi? Złe połączenie to pożar w zarodku. System wyłapuje to wcześnie.”*  
  
**Powiązania:** Funkcja 7.29, 7.21, 4.20.

---

### 13.22. Analiza strat energii i sprawności systemu  *(dawne 7.39)*

  
**Skąd czerpie dane:**  
- Z bilansu energii: produkcja, zużycie, ładowanie/rozładowanie baterii, straty na przewodach.  
  
**Gdzie ląduje:**  
- W module `system_efficiency`.  
  
**Jak działa logika:**  
- System oblicza całkowitą sprawność instalacji:  
  - straty na kablach,  
  - straty w falowniku,  
  - straty w baterii,  
  - straty przetwornic.  
- Porównuje z teoretycznym modelem.  
- Wskazuje, gdzie są największe straty i jak je obniżyć.  
  
**Efekt na ekranie:**  
- Wykres Sankeya strat: *„Całkowita sprawność: 88%. Największe straty: kable DC – 4%.”*  
  
**Migawka:** *„O co chodzi? Każda utracona kWh to pieniądze. System pokazuje, gdzie ucieka.”*  
  
**Powiązania:** Funkcja 7.11, 4.27, 2.14.

---

### 13.23. Powiadomienia pogodowe i alerty burzowe  *(dawne 7.40)*

  
**Skąd czerpie dane:**  
- Z prognoz pogody i danych o burzach dla lokalizacji.  
  
**Gdzie ląduje:**  
- W module `weather_alerts`.  
  
**Jak działa logika:**  
- System śledzi prognozę pogody i ostrzega o:  
  - burzach,  
  - silnym wietrze,  
  - opadach śniegu,  
  - przymrozkach,  
  - oblodzeniu.  
- Uwzględnia wpływ na produkcję PV i bezpieczeństwo instalacji.  
- Sugeruje działania prewencyjne (np. sprawdzenie SPD, odłączenie źródeł).  
  
**Efekt na ekranie:**  
- Alert: *„Nadciąga burza. Sprawdź ochronniki przepięciowe i zabezpiecz panele.”*  
  
**Migawka:** *„O co chodzi? Pogoda to żywioł. System ostrzega, żeby Cię nie zaskoczyła.”*  
  
**Powiązania:** Funkcja 7.22, 6.4, 4.5.

---

### 13.24. Detekcja oblodzenia i śniegu na panelach (live)  *(dawne 7.41)*

  
**Skąd czerpie dane:**  
- Z produkcji PV, temperatury zewnętrznej, wilgotności i danych o opadach.  
  
**Gdzie ląduje:**  
- W module `panel_ice_snow_detection`.  
  
**Jak działa logika:**  
- System porównuje bieżącą produkcję PV z teoretyczną dla danych warunków.  
- Wykrywa nagły spadek produkcji wskazujący na śnieg lub lód.  
- Pokazuje przybliżoną powierzchnię zasypaną/oblodzoną.  
- Sugeruje odśnieżenie lub włączenie grzałek (jeśli są).  
  
**Efekt na ekranie:**  
- Alert: *„Wykryto oblodzenie paneli. Produkcja spadła o 70%.”*  
  
**Migawka:** *„O co chodzi? Panele pod śniegiem nie pracują. System mówi, kiedy trzeba je odśnieżyć.”*  
  
**Powiązania:** Funkcja 7.22, 6.7, 6.18.

---

### 13.25. Monitorowanie stanu zabezpieczeń i bezpieczników  *(dawne 7.42)*

  
**Skąd czerpie dane:**  
- Z czujników stanu bezpieczników, wyłączników, rozłączników i RCD.  
  
**Gdzie ląduje:**  
- W module `protection_status`.  
  
**Jak działa logika:**  
- System monitoruje, czy zabezpieczenia są załączone i sprawne.  
- Wykrywa przepalenie bezpiecznika lub wyłączenie RCD.  
- Ostrzega o braku ochrony.  
  
**Efekt na ekranie:**  
- Status: *„Bezpiecznik baterii: OK. RCD: wyłączony – sprawdź obwód.”*  
  
**Migawka:** *„O co chodzi? Bezpieczniki to tarcza. System patrzy, czy tarcza jest cała.”*  
  
**Powiązania:** Funkcja 7.29, 4.2, 4.15.

---

### 13.26. Historia zdarzeń i logi systemowe  *(dawne 7.43)*

  
**Skąd czerpie dane:**  
- Z rejestru zdarzeń, alarmów, przełączeń i akcji użytkownika.  
  
**Gdzie ląduje:**  
- W module `event_log`.  
  
**Jak działa logika:**  
- System zapisuje zdarzenia z całej instalacji: alarmy, awarie, zmiany trybów, ręczne interwencje, aktualizacje.  
- Umożliwia filtrowanie według daty, źródła, priorytetu.  
- Pomaga w diagnostyce i analizie przyczyn awarii.  
  
**Efekt na ekranie:**  
- Lista: *„22:04 – alarm niskiego SoC (15%). 22:10 – automatyczne odłączenie zmywarki.”*  
  
**Migawka:** *„O co chodzi? To czarna skrzynka systemu. Zawsze wiesz, co się wydarzyło.”*  
  
**Powiązania:** Funkcja 7.6, 7.34, 7.19.

---

### 13.27. Benchmarking – porównanie z podobnymi instalacjami  *(dawne 7.44)*

  
**Skąd czerpie dane:**  
- Z bazy anonimowych danych innych instalacji o podobnej konfiguracji.  
  
**Gdzie ląduje:**  
- W module `benchmarking`.  
  
**Jak działa logika:**  
- System porównuje Twoją produkcję, zużycie i sprawność z instalacjami o podobnej mocy i lokalizacji.  
- Wskazuje, czy Twój system jest optymalny, czy poniżej średniej.  
- Podpowiada obszary do poprawy.  
  
**Efekt na ekranie:**  
- Wykres: *„Twoja produkcja: 4,1 kWh/kWp. Średnia w regionie: 4,3 kWh/kWp.”*  
  
**Migawka:** *„O co chodzi? Sprawdzasz, czy nie zostajesz w tyle za innymi.”*  
  
**Powiązania:** Funkcja 7.10, 7.11, 7.25.

---

### 13.28. Wykrywanie zwarć i przeciążeń w czasie rzeczywistym  *(dawne 7.45)*

  
**Skąd czerpie dane:**  
- Z szybkich pomiarów prądu i napięcia, z wyzwalaczy zabezpieczeń.  
  
**Gdzie ląduje:**  
- W module `short_circuit_detection`.  
  
**Jak działa logika:**  
- System analizuje prądy w czasie rzeczywistym.  
- Wykrywa gwałtowne skoki prądu charakterystyczne dla zwarć.  
- Reaguje w czasie < 100 ms, odłączając zagrożony obwód.  
- Zapisuje zdarzenie do logów i powiadamia użytkownika.  
  
**Efekt na ekranie:**  
- Alert: *„Zwarcie wykryte w obwodzie gniazd. Obwód odłączony automatycznie.”*  
  
**Migawka:** *„O co chodzi? Zwarcie to pożar w ułamku sekundy. System działa szybciej niż myślisz.”*  
  
**Powiązania:** Funkcja 7.6, 4.11, 3.9.

---

### 13.29. Dynamiczne zarządzanie priorytetami obciążeń  *(dawne 7.46)*

  
**Skąd czerpie dane:**  
- Z bieżącego SoC, produkcji PV, temperatury, prognoz.  
  
**Gdzie ląduje:**  
- W module `dynamic_load_priority`.  
  
**Jak działa logika:**  
- System automatycznie zmienia priorytety odbiorników w zależności od sytuacji.  
- Przy niskim SoC odłącza mniej ważne urządzenia.  
- Przy dużej nadwyżce PV włącza urządzenia nadwyżkowe.  
- Na podstawie prognozy pogody przewiduje potrzeby.  
  
**Efekt na ekranie:**  
- Status: *„Priorytet pompy ciepła podniesiony. Bojler przełączony na tryb nadwyżkowy.”*  
  
**Migawka:** *„O co chodzi? System sam decyduje, co jest teraz najważniejsze.”*  
  
**Powiązania:** Funkcja 1.20, 7.17, 6.6.

---

### 13.30. Symulacja „co by było, gdyby” na żywo  *(dawne 7.47)*

  
**Skąd czerpie dane:**  
- Z bieżących danych systemu i możliwych scenariuszy użytkownika.  
  
**Gdzie ląduje:**  
- W module `what_if_simulation`.  
  
**Jak działa logika:**  
- Użytkownik może sprawdzić:  
  - co się stanie, gdy wyłączy pompę ciepła,  
  - co się stanie, gdy dołoży panel,  
  - jak długo wytrzyma bateria bez słońca.  
- System symuluje scenariusz na żywo i pokazuje skutki.  
  
**Efekt na ekranie:**  
- Komunikat: *„Jeśli wyłączysz pompę ciepła, bateria wytrzyma 14 h zamiast 10 h.”*  
  
**Migawka:** *„O co chodzi? Sprawdzasz decyzję, zanim ją podejmiesz.”*  
  
**Powiązania:** Funkcja 7.25, 7.24, 6.4.

---

### 13.31. Monitoring jakości powietrza i wilgotności wewnątrz  *(dawne 7.48)*

  
**Skąd czerpie dane:**  
- Z czujników CO2, wilgotności, temperatury, LZO.  
  
**Gdzie ląduje:**  
- W module `indoor_air_quality`.  
  
**Jak działa logika:**  
- System monitoruje jakość powietrza wewnątrz budynku.  
- Uwzględnia:  
  - stężenie CO2,  
  - wilgotność względną,  
  - temperaturę,  
  - lotne związki organiczne (LZO).  
- Współpracuje z wentylacją i rekuperacją.  
- Ostrzega przed złą jakością powietrza i ryzykiem pleśni.  
  
**Efekt na ekranie:**  
- Alert: *„Wilgotność wzrosła do 75% – ryzyko pleśni. Zwiększ wentylację.”*  
  
**Migawka:** *„O co chodzi? Dbasz nie tylko o prąd, ale i o zdrowy dom.”*  
  
**Powiązania:** Funkcja 7.14, 5.3, 6.30.

---

### 13.32. Tryb nocny – minimalne zużycie i cisza  *(dawne 7.49)*

  
**Skąd czerpie dane:**  
- Z harmonogramu, pory dnia, obciążenia i preferencji użytkownika.  
  
**Gdzie ląduje:**  
- W module `night_mode`.  
  
**Jak działa logika:**  
- System przechodzi w tryb nocny po godzinie ustalonej przez użytkownika.  
- Ogranicza pracę głośnych urządzeń, wyłącza zbędne obciążenia, ścisza alarmy niekrytyczne.  
- Minimalizuje pobór własny: wygasza wyświetlacze, ogranicza komunikację.  
- Rano wraca do normalnej pracy.  
  
**Efekt na ekranie:**  
- Status: *„Tryb nocny aktywny do 6:00.”*  
  
**Migawka:** *„O co chodzi? W nocy dom ma spać. System też.”*  
  
**Powiązania:** Funkcja 7.27, 7.8, 7.17.

---

### 13.33. Interaktywne podsumowanie dnia / tygodnia  *(dawne 7.50)*

  
**Skąd czerpie dane:**  
- Z raportów, produkcji, zużycia, alarmów i zdarzeń.  
  
**Gdzie ląduje:**  
- W module `daily_weekly_summary`.  
  
**Jak działa logika:**  
- System generuje krótkie podsumowanie dnia lub tygodnia.  
- Pokazuje kluczowe liczby, wykresy i najważniejsze zdarzenia.  
- Umożliwia szybkie przejście do szczegółów.  
  
**Efekt na ekranie:**  
- Karta: *„Dziś: produkcja 4,1 kWh, zużycie 3,2 kWh, 1 alarm.”*  
  
**Migawka:** *„O co chodzi? Zamiast przekopywać dane, dostajesz esencję dnia.”*  
  
**Powiązania:** Funkcja 7.9, 7.10, 7.6.  
  
  
---  
  
## Rozdział 8: Szybki Kalkulator Awaryjny / Mobilny (garaż, jacht, namiot)

---

## Moduł 14 (Kafel 14): Ustawienia / Tryb Inżyniera / Pomoc

*Nie jest to moduł „funkcji technicznych” w tym samym sensie co Kafle 1–13 — to warstwa konfiguracji i materiałów pomocniczych, dostępna z poziomu ustawień aplikacji, a nie jako oddzielny ekran roboczy.*

**Zawartość:**
- Przełącznik **Tryb Prosty / Tryb Inżyniera** (zasada nadrzędna nr 2 z v1.5)
- Zarządzanie stronami i widżetami Trybu Live (edytor układu z Kafla 13)
- Załączniki referencyjne (poniżej, bez zmian względem v1.5)
- Metryczka i historia wersji dokumentu

### A. Tabela zbiorcza pułapek inżynierskich i ich rozwiązań  
  
| Pułapka | Opis | Rozwiązanie w aplikacji |  
|---------|------|-------------------------|  
| Zbyt cienkie kable DC | Duże straty, ryzyko pożaru | Oblicza przekrój, ostrzega |  
| Napięcie Voc przy mrozie | Uszkodzenie MPPT | Stress‑test Voc, sugeruje zmianę stringów |  
| Mikropęknięcia termiczne | Spadek mocy po 2 latach | Wymusza dylatację i podkładki EPDM |  
| Brak wentylacji pod panelami | Spadek mocy o 18% latem | Wymusza szczelinę >10 cm |  
| Pominięcie cos φ | Falownik wyłącza się mimo poprawnych W | Oblicza VA, ostrzega |  
| Pominięcie prądów rozruchowych | Falownik przeciążany przy starcie | Uwzględnia 5‑6× skok prądu |  
| Brak mat grzewczych BMS | Blokada ładowania przy mrozie | Dolicza pobór, ostrzega |  
| Zbyt mały bufor na starzenie | System staje się niewystarczający po latach | Dodaje bufor degradacji |  
| Wampiry energetyczne | Ciągły pobór standby | Dolicza stałą moc czuwania |  
| Brak bufora na rozbudowę | System nie pokryje przyszłych potrzeb | Suwak +10/20/30% |  
| Niesymetryczne obciążenie 3‑fazowe | Przeciążenie jednej fazy | Analiza symetrii |  
| Łączenie Cu-Al bez złączki | Korozja galwaniczna, przegrzanie | Wymusza złączki bimetaliczne |  
| Brak SPD | Przepięcie niszczy elektronikę | Dobór SPD DC/AC |  
| Brak monitoringu izolacji (IT) | Niewykryte doziemienie, pożar | Dobiera IMD |  
| Brak selektywności | Zwarcie wyłącza cały system | Koordynacja zabezpieczeń |  
| Brak pre-charge | Iskrzenie, uszkodzenie styków | Wymusza rezystor wstępny |  
| Brak ochrony gryzoni | Przegryzione kable, zwarcie | Osłony metalowe |  
| Brak etykiet | Błędy przy serwisie | Generuje etykiety |  
| Brak testów powykonawczych | Ukryte wady, ryzyko pożaru | Lista testów, raport |  
  
---  
  
### B. Słownik kluczowych pojęć technicznych  
  
| Pojęcie | Wyjaśnienie |  
|---------|-------------|  
| SoC (State of Charge) | Poziom naładowania baterii (0–100%) |  
| DoD (Depth of Discharge) | Głębokość rozładowania – dla LiFePO4 zwykle 80–90% |  
| Voc (Voltage Open Circuit) | Napięcie obwodu otwartego panelu |  
| Vmp (Voltage at Maximum Power) | Napięcie w punkcie mocy maksymalnej |  
| Imp (Current at Maximum Power) | Prąd w punkcie mocy maksymalnej |  
| MPPT (Maximum Power Point Tracker) | Regulator śledzący punkt mocy maksymalnej paneli |  
| BMS (Battery Management System) | System zarządzania akumulatorem – nadzoruje ogniwa |  
| PID (Potential Induced Degradation) | Degradacja indukowana napięciem |  
| COP (Coefficient of Performance) | Współczynnik wydajności pompy ciepła |  
| GWC (Gruntowy Wymiennik Ciepła) | Rury w gruncie podgrzewające powietrze |  
| Wampiry energetyczne | Urządzenia pobierające prąd w trybie czuwania |  
| Cos φ | Współczynnik mocy – stosunek mocy czynnej do pozornej |  
| SPD (Surge Protective Device) | Ochronnik przeciwprzepięciowy |  
| RCD (Residual Current Device) | Wyłącznik różnicowoprądowy |  
| IMD (Insulation Monitoring Device) | Monitor izolacji |  
| GSW | Główna szyna wyrównawcza |  
| EMC (Electromagnetic Compatibility) | Kompatybilność elektromagnetyczna |  
| AIC (Ampere Interrupting Capacity) | Zdolność wyłączania zwarciowego |  
  
---  
  
### C. Lista kontrolna przed montażem  
  
1. Czy lokalizacja została pobrana z PVGIS / PVWatts?  
2. Czy model 3D działki i budynku jest poprawny?  
3. Czy przeanalizowano zacienienie (drzewa, sąsiedzi)?  
4. Czy bilans zapotrzebowania uwzględnia:  
   - [ ] Systemy krytyczne (woda, ścieki, ogrzewanie)  
   - [ ] Indukcję i prądy rozruchowe  
   - [ ] cos φ i moc pozorną  
   - [ ] Profile dobowe i sezonowość  
   - [ ] Dni autonomii  
   - [ ] Pobór własny falownika i sprawność nocną  
   - [ ] Defrost pompy ciepła i grzanie BMS  
   - [ ] Agregat (paliwo, godziny pracy)  
   - [ ] Bufor starzenia (10 lat)  
   - [ ] Wampiry energetyczne  
   - [ ] Bufor na rozbudowę  
   - [ ] Symetrię obciążeń (dla 3 faz)  
5. Czy moduł PV uwzględnia:  
   - [ ] Kąt i azymut (z suwaków)  
   - [ ] Opcję montażu pionowego (ogrodzenie)  
   - [ ] Dach płaski / skośny / grunt  
   - [ ] Porównanie tracker vs. stały stelaż  
   - [ ] Stress‑test Voc przy mrozie  
   - [ ] Aerodynamikę (wiart, ssanie)  
   - [ ] Straty na kablu (Joule)  
   - [ ] Zjawisko PID  
   - [ ] Kalkulator konstrukcji wsporczej  
6. Czy magazyn energii jest właściwie dobrany:  
   - [ ] Pojemność użyteczna (kWh)  
   - [ ] Napięcie systemowe (12/24/48V)  
   - [ ] Ogrzewanie ogniw (maty grzewcze)  
   - [ ] Bufor starzeniowy  
   - [ ] Balansery ogniw  
   - [ ] Bezpieczniki AIC  
   - [ ] Wentylacja komory baterii  
   - [ ] Czujniki dymu/temperatury  
   - [ ] Ochrona przeciwpożarowa  
7. Czy okablowanie i zabezpieczenia są dobrane:  
   - [ ] Przekroje kabli DC/AC  
   - [ ] Bezpieczniki i rozłączniki  
   - [ ] Moc falownika (W i VA)  
   - [ ] Wentylacja pod panelami (>10 cm)  
   - [ ] SPD DC/AC  
   - [ ] RCD odpowiedniego typu  
   - [ ] IMD (jeśli układ IT)  
   - [ ] GSW i uziemienie  
   - [ ] Złączki MC4 i rozgałęźniki  
   - [ ] Separacja kabli sygnałowych  
   - [ ] Etykiety i oznaczenia  
   - [ ] Testy powykonawcze  
  
---


---

## Załącznik D: Zasada scaleń — skrót

| Kafel | Co scalono | Ile funkcji → ile pozycji w UI |
|---|---|---|
| 2. Zapotrzebowanie | 1.24 + 1.28–1.50 → "Wampiry energetyczne" | 24 → 1 moduł zbiorczy |
| 5. Okablowanie | 4.21 + 4.35 (duplikat MC4) → jedna funkcja | 2 → 1 |
| 6. Ogrzewanie/pompa ciepła | 5.27–5.100 → "Silnik analiz czynników" | 74 → 1 moduł zbiorczy |
| 8. Bezpieczeństwo *(nowy)* | 6.19, 6.25, 11.51–56, 12.51–57 | 15 funkcji zebranych z 3 rozdziałów |
| 11. Montaż baterii | Rozdz. 9 (LiFePO4) + Rozdz. 10 (kwasowe) → jeden tryb z wyborem chemii | 40 → 1 tryb, 2 ścieżki |
| 12. Kalkulator mobilny | 8.23–8.28 → "Kalkulator per urządzenie"; 8.29–8.36 → "Kreator zasilania" | 14 → 2 moduły zbiorcze |

**Żadna funkcja nie została usunięta.** Scalenie = ten sam tekst, inna organizacja ekranów (jeden ekran z listą wyboru zamiast N osobnych ekranów o tej samej strukturze).

---

## Metryczka dokumentu v2.0

| Wersja | Kafle (moduły) | Funkcje zachowane | Moduły zbiorcze (scalenia) | Nowe moduły cross-cuttingowe | Załączniki |
|--------|-----------------|--------------------|------------------------------|-------------------------------|------------|
| 2.0    | 14              | 579                | 5                             | 1 (Bezpieczeństwo — Kafel 8) | A, B, C, D |

**Uwaga o rozbieżności z metryczką v1.5:** oryginalny dokument deklarował 540 funkcji w 13 rozdziałach, ale faktyczna treść (po scaleniu wersji roboczych w jeden plik) zawierała **579 unikalnych, w pełni opisanych funkcji** — metryczka v1.5 nie została zaktualizowana po ostatnim scaleniu. W v2.0 liczba odzwierciedla rzeczywistą zawartość.

**Zasada integralności (utrzymana z v1.5):** przy kolejnych wersjach porównuj tę metryczkę i Załącznik D. Żadna funkcja nie może zniknąć bez jawnego potwierdzenia.

---

**Wersja:** 2.0
**Data:** Sierpień 2026
**Bazuje na:** Biblia Off-Grid PV v1.5
**Zmiana:** Reorganizacja pod strukturę pulpitu (14 kafli) + scalenie 5 klastrów duplikatów + wydzielenie nowego modułu cross-cuttingowego "Bezpieczeństwo i sytuacje awaryjne"
**Licencja:** Własność projektu – do użytku wewnętrznego
