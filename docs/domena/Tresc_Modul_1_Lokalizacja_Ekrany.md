# Moduł 1 (Kafel 1): Lokalizacja i teren — treść ekranów

**Etap 3 — kontynuacja.** Dziesiąty w pełni opisany moduł treściowy. Najmniejszy z modułów (4 funkcje), fundamentalny dla reszty aplikacji — dane stąd zasilają niemal wszystkie pozostałe moduły.

---

## EKRAN 1: GPS i dane klimatyczne — INFRASTRUKTURA
*(dawne 0.1 — infra, zasila silnik symulacji z §15.1)*

**Dane wejściowe:** online — GPS urządzenia, adres lub numer działki (API geolokalizacyjne, np. Geoportal); offline — ręczne wpisanie współrzędnych lub zapisane punkty. Dodatkowo jednorazowe pobranie danych nasłonecznienia z PVGIS/PVWatts (darmowe API), zapisywane lokalnie dla działania offline.

**Co system oblicza:** kąt padania promieni słonecznych dla każdego dnia roku (na podstawie szerokości geograficznej), strefa wiatrowa i śniegowa (zasila Moduł 3 — aerodynamika i Moduł 7 — obciążenie śniegiem), absolutne minima temperaturowe (zasila stress-testy zimowe w Module 7).

**Efekt na ekranie:** mapa z pinezką lokalizacji + "karta klimatyczna regionu": średnia roczna temperatura, strefa mrozowa, wykres nasłonecznienia miesięcznego (np. grudzień ma ok. 5× mniej słońca niż czerwiec).

---

## EKRAN 2: Skaner działki
*(dawne 0.2 — Wzorzec A, przełącznik trybu wg dostępności internetu)*

### Tryb "Online (Geoportal)"
Połączenie z państwowymi bazami GIS — automatyczne pobranie granic działki, obrysów budynków, wysokości.

### Tryb "Offline (spacer GPS)"
Użytkownik fizycznie obchodzi każdy róg działki i budynku, klikając "Zapisz punkt". Kalibracja: wpisanie znanego wymiaru (np. długość ściany 12m), żeby skorygować błąd GPS urządzenia mobilnego.

### Wynik wspólny dla obu trybów
System tworzy cyfrowy model terenu (DTM) i bryłę budynku na podstawie zebranych punktów (X,Y,Z) — wyznacza azymut każdej ściany, kąt nachylenia połaci dachowych, wysokość kalenicy, wykrywa potencjalne przeszkody (drzewa, sąsiednie budynki).

**Efekt na ekranie:** interaktywny widok 2D/3D działki z możliwością obracania i przeglądania poszczególnych płaszczyzn.

**D:** *"Tryb online jest szybszy, ale nie wszędzie dane są dokładne — spacer GPS zajmuje więcej czasu, ale daje pewność, że model odpowiada rzeczywistej działce, nie mapie sprzed kilku lat."*

---

## EKRAN 3: Analiza zacienienia (horyzont cieni)
*(dawne 0.3 — Wzorzec D)*

**A:** model 3D z Ekranu 2 (wysokości przeszkód, odległości), prognozowana przyszła wysokość rosnących drzew (wprowadzana ręcznie przez użytkownika).
**B:** algorytm dla każdej godziny dnia, w każdym miesiącu, sprawdza czy promień słońca jest zasłaniany przez przeszkodę; uwzględnia wzrost drzew w perspektywie lat; sumuje roczną stratę energii.
**C:** *"Południowo-wschodni narożnik dachu jest zacieniony przez drzewo — strata ok. 12% rocznie. Rozważ montaż na zachodniej połaci."*
**D:** *"Cień to niewidoczny złodziej energii — jedno drzewo, które dziś ledwo sięga dachu, za 10 lat może zasłaniać połowę instalacji, jeśli się z tym nie policzy od razu."*

**Wizualizacja:** mapa cieplna na modelu 3D pokazująca kolorami, które fragmenty są najbardziej zacienione w ciągu roku.

---

## EKRAN 4: Bryła budynku i orientacja ścian
*(dawne 0.4 — Wzorzec D)*

**A:** model przestrzenny z Ekranu 2 (automatyczne azymuty i kąty wszystkich połaci/ścian), możliwość ręcznej korekty (gdy budynek nie jest idealnie prostopadły).
**B:** system ocenia opłacalność PV dla każdej powierzchni na podstawie azymutu i kąta nachylenia względem optimum (południe, ~35°).
**C:** lista powierzchni ze wskaźnikiem opłacalności: *"Dach południowy: 94%. Elewacja wschodnia: 62%."*
**D:** *"Nie każda ściana i połać dachu są tak samo warte montażu paneli — ten wskaźnik pozwala od razu zobaczyć, gdzie inwestycja się najbardziej opłaci, zanim przejdziesz do szczegółowego projektowania w Module 3."*

**Uwaga integracyjna:** geometria budynku z tego ekranu częściowo pokrywa się z importem danych budynkowych z §12 Zasad UX (Kalkulator Inżyniera Pro) — przy pełnej integracji warto rozstrzygnąć, czy orientacja/bryła budynku pochodzi stąd (skan działki) czy z importu (dane projektowe budynku), żeby nie duplikować tej samej informacji w dwóch miejscach z możliwością rozjazdu.

---

## Podsumowanie modułu

**4 ekrany**, pokrywające wszystkie 4 pierwotne funkcje. Moduł fundamentalny — bez zmian strukturalnych względem oryginału, bo jest już maksymalnie skondensowany.

---

**Wersja:** 1.0 — pełna treść Modułu 1 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 4 ekrany gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, oraz pozostałe pliki Tresc_Modul_*.md
