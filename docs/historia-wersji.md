# Historia wersji programu Inżynier Offgrid

Zasady numeracji: `docs/wersjonowanie.md`. Najnowszy wpis na górze; jego numer musi zgadzać się z `package.json` (pilnuje tego test). Każdy wpis ma linię „Wpływ na liczby”.

## [3.9.0] — 10.10.2026

Straty ciepła budynku (moduł 6, Ekran 1): U przegrody z warstw na ekranie i w narzędziu AI (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 37):
- przy każdej przegrodzie nowa sekcja „Policz U z warstw”: kierunek strumienia ciepła, warstwy (nazwa, grubość i λ albo gotowy opór R) i na żywo wyliczone U razem z oporem całkowitym; wpisane U ma pierwszeństwo i ekran o tym informuje,
- widoczna uwaga: bez mostków cieplnych (U ściany szkieletowej jest zbyt optymistyczne), dokładne liczenie jest w Inżynierze Szkieletowym Pro; λ wpisuje użytkownik z karty produktu, aplikacja jej nie zgaduje,
- ekrany zależne od Ekranu 1 (pojemność cieplna, optymalizacja izolacji) biorą U policzone z warstw,
- narzędzie AI „policz straty ciepła budynku” przyjmuje warstwy i kierunek zamiast U, a w wyniku zwraca U każdej przegrody,
- pola nowej sekcji mają „?” i tłumaczenia PL/EN/RU; stare szkice bez warstw działają jak dotąd.

Wpływ na liczby: brak dla dotychczasowych wejść (U wpisane ręcznie liczy się jak dotąd). Silnik obciążenia cieplnego bez zmian (1.1.0).

## [3.8.0] — 10.10.2026

Obciążenie cieplne budynku (moduł 6, Ekran 1): podstawa pod „Zimę z ociepleniem budynku” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 37):
- silnik umie policzyć U przegrody z warstw: U = 1 / (Rsi + Σ d/λ + Rse), gdzie Rsi = 0,10 / 0,13 / 0,17 m²·K/W zależnie od kierunku strumienia ciepła (dach / ściana / podłoga), Rse = 0,04 (PN-EN ISO 6946:2017, tablica 7); warstwa może mieć też gotowy opór R (np. szczelina z karty producenta),
- wpisane U przegrody nadal ma pierwszeństwo; niepełna warstwa albo brak kierunku strumienia daje „brak danych”, bez zgadywania; grubość, λ i opór ≤ 0 to błąd danych,
- widoczne założenie: mostki cieplne (słupki, belki, łączniki) nie są liczone, więc U ściany szkieletowej z tej funkcji jest optymistyczne; dokładne liczenie jest w Inżynierze Szkieletowym Pro.
Ekranu z warstwami jeszcze nie ma (kolejny etap); na razie to warstwa silnika z testami.

Wpływ na liczby: brak dla dotychczasowych wejść (przegroda z wpisanym U liczy się jak dotąd). Silnik obciążenia cieplnego 1.0.0 → 1.1.0.

## [3.7.0] — 10.10.2026

Porównywarka paneli PV: „Ile paneli pokryje zimę” bez sztywnego limitu 200 paneli (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 36):
- liczba paneli na cel zimowy jest liczona bez górnej granicy; gdy cel jest nieosiągalny nawet przy dowolnej liczbie paneli, ekran podaje fizyczne maksimum pokrycia z wpisaną baterią,
- gdy znamy wymiary miejsca, obok widać, ile paneli się mieści i jakie pokrycie zimy dają, oraz czy potrzebna liczba się mieści (miejsce nie obcina wyniku),
- poprawione sformułowanie założenia o nocy: brak pokrycia nocy dotyczy pojemności baterii 0, nie „braku baterii” jako zwykłego przypadku,
- narzędzie AI zwraca dodatkowo liczbę paneli mieszczących się w miejscu, pokrycie na miejscu i informację, czy potrzebna liczba się mieści.

Wpływ na liczby: tylko dobór liczby paneli na cel zimowy, i to wyłącznie tam, gdzie dotąd wychodziło „nieosiągalne do 200 paneli”: teraz podajemy rzeczywistą liczbę albo fizyczne maksimum (bywa wyższe niż dotychczasowe „pokrycie przy 200 panelach”). Pozostałe wyniki bez zmian. Silnik porównywarki 1.4.0 → 1.5.0.

## [3.6.0] — 10.10.2026

Porównywarka paneli PV: „Ile paneli pokryje zimę” w zakładce „Bilans godzinowy” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 36):
- opcjonalny cel: jaką część zużycia z listopada–lutego mają pokryć panele; ekran podaje, ile paneli to da „w sumie” (zbyt optymistycznie) i godzina po godzinie z baterią, albo że cel jest nieosiągalny (z informacją, ile najwyżej da się uzyskać przy 200 panelach),
- narzędzie AI rozszerzone o cel zimowy.

Wpływ na liczby: nowa funkcja, tylko gdy użytkownik wpisze cel; żaden dotychczasowy wynik się nie zmienia. Silnik porównywarki 1.3.0 → 1.4.0.

## [3.5.0] — 10.10.2026

Porównywarka paneli PV: zakładka „Producenci” (Etap C, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcje 15 i 35):
- fakty o producentach paneli z katalogu (kraj, rok założenia, siedziba, giełda, obecność na listach niezależnych testów Kiwa PVEL i RETC, hurtownie w Polsce), każdy z odnośnikiem do źródła i datą odczytu, wpis czeka na akceptację właściciela aplikacji,
- jawne braki: czego nie sprawdzono (certyfikaty, serwis w Polsce, oficjalny dystrybutor) i co jest niespójne w źródłach.

Wpływ na liczby: brak. Opisy są tylko informacją, nie dodają punktów w gwiazdkach; silnik porównywarki (1.3.0) i wszystkie wyniki bez zmian.

## [3.4.0] — 09.10.2026

Porównywarka paneli PV: zakładka „Bilans godzinowy” (Etap A5, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 34):
- godzina po godzinie roku typowego: ile energii z paneli zużyjesz od razu, ile przejdzie przez baterię, ile brakuje z sieci albo agregatu i ile nie mieści się w baterii, osobno zimą (XI–II) i w roku,
- pojemność baterii wpisana albo wzięta z ekranu „Dobór pojemności baterii”, opcjonalna sprawność cyklu, koszt brakującej energii wg wybranej wyceny kWh (także taryfy dzienno-nocnej wg godziny braku), cykle baterii, brak po miesiącach,
- narzędzie AI rozszerzone o bilans godzinowy.

Wpływ na liczby: nowa funkcja; żaden dotychczasowy wynik (energia, koszty, stringi, zwrot, nadwyżka) się nie zmienia. Nowe liczby powstają tylko po wpisaniu pojemności baterii i przy uzupełnionym zużyciu. Silnik porównywarki 1.2.0 → 1.3.0.

## [3.3.0] — 09.10.2026

Porównywarka paneli PV: odczyt karty katalogowej albo naklejki ze zdjęcia lub PDF (Etap B, spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 33):
- blok „Wypełnij ze zdjęcia lub PDF karty (AI)” przy panelu wpisywanym ręcznie: asystent AI przepisuje liczby (moc, Voc, Vmp, Isc, Imp, współczynniki temperaturowe, wymiary, masa, obciążenia mechaniczne i inne), a użytkownik zatwierdza każdą z nich osobno, zanim trafi do formularza,
- jawna zgoda na wysłanie pliku do dostawcy AI przy każdym odczycie, limit odczytów po stronie serwera, kontrole spójności odczytu (Vmp·Imp a moc, Voc > Vmp, Isc > Imp, sprawność z wymiarów, znak współczynników).

Wpływ na liczby: brak. Odczyt tylko wypełnia istniejące pola formularza po zatwierdzeniu przez użytkownika; silnik porównywarki (1.2.0) i wszystkie wyniki bez zmian.

## [3.2.0] — 09.10.2026

Porównywarka paneli PV: zakładka „Obciążenia” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 32):
- obciążenie panelu śniegiem i wiatrem wg Eurokodu (PN-EN 1991-1-3, 1991-1-4, 1990) zestawione z nośnością mechaniczną z karty, osobno dla środka pola i krawędzi,
- nośności mechaniczne wpisane do katalogu paneli z kart, pola dla panelu ręcznego,
- ostrzeżenie, gdy obciążenie obliczeniowe przekracza nośność panelu; narzędzie AI rozszerzone.

Wpływ na liczby: nowa funkcja; żaden dotychczasowy wynik (energia, koszty, stringi, zwrot) się nie zmienia. Nowe liczby (obciążenia w Pa, wykorzystanie nośności) powstają tylko po wpisaniu warunków miejsca. Silnik porównywarki 1.1.0 → 1.2.0.

## [3.1.0] — 09.10.2026 (początek numeracji)

Porównywarka paneli PV, etapy A3b, A4 i dalsze (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcje 26–31):
- ręczne dane elektryczne panelu spoza katalogu,
- zakładka „Falownik i osprzęt”: dopasowanie do falownika, regulatora MPPT i mikroinwertera z katalogu, orientacyjny koszt osprzętu,
- wydruk oferty (PDF) z danymi firmy i logo, wersjami A/B/C i napisami „Wykonano w programie Inżynier Offgrid”,
- ślad wersji programu, silnika i danych na wydruku,
- włącznik „Wlicz urządzenie i osprzęt do ceny” w Opłacalności,
- tryb prosty dla początkujących (trzy pytania, jedna rekomendacja).

Wpływ na liczby: nowe funkcje; wyniki istniejącego porównania paneli bez zmian, a z włączonym wliczaniem osprzętu okres zwrotu i koszt zimowej kWh są liczone od ceny paneli plus urządzenie i osprzęt (zakres). Numer 3.1.0 jest punktem startowym: poprzednie wersje nie były numerowane.
