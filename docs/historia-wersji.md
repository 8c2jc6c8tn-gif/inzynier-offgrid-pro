# Historia wersji programu Inżynier Offgrid

Zasady numeracji: `docs/wersjonowanie.md`. Najnowszy wpis na górze; jego numer musi zgadzać się z `package.json` (pilnuje tego test). Każdy wpis ma linię „Wpływ na liczby”.

## [3.15.0] — 11.10.2026

Porównywarka paneli PV: udostępnianie porównania linkiem lub plikiem (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 43):
- w bloku „Moje zestawy” nowa sekcja „Udostępnij porównanie”: „Skopiuj link” (porównanie jest zapisane w samym adresie, bez konta i serwera) albo „Pobierz plik .json”; bez danych pogodowych, lokalizacji projektu, profilu firmy i danych klienta z oferty,
- odbiorca otwiera link, wkleja link lub kod albo wczytuje plik; widzi, co przyszło, i dopiero po kliknięciu „Dodaj do moich zestawów” dostaje to jako nowy zestaw — formularz, nad którym pracuje, zostaje bez zmian; kwoty są przeliczone na jego walutę,
- dane z zewnątrz są sprawdzane: limit rozmiaru (także po rozpakowaniu), przepisanie tylko znanych pól, kontrola wyliczeń i identyfikatorów katalogów, czytelny komunikat przy uszkodzonym lub obcym pliku.

Wpływ na liczby: brak. Silnik obliczeń bez zmian (1.9.0); zmiana dotyczy zapisu i wymiany danych wejściowych.

## [3.14.0] — 11.10.2026

Porównywarka paneli PV: własny katalog z pliku CSV i eksport wyników do CSV (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 42):
- w kroku „Panele” nowa sekcja „Własny katalog paneli z pliku CSV”: pobierasz wzorzec pliku, wypełniasz go (cennik dostawcy albo własna tabela z kart katalogowych) i wczytujesz; aplikacja pokazuje, które wiersze przyjęła, a które odrzuciła i dlaczego, a dopiero potem zapisujesz je w katalogu na tym urządzeniu (dołączasz albo zastępujesz katalog),
- wiersz jest przyjęty tylko wtedy, gdy przejdzie tę samą kontrolę danych co formularz panelu; puste komórki to brak danych, nic nie jest dopełniane „typową” wartością; separator (średnik, przecinek, tabulator) i przecinek dziesiętny są rozpoznawane automatycznie,
- przy każdym panelu porównania pojawia się wybór „Z Twojego katalogu (CSV)”, który wstawia nazwę, moc, cenę i pozostałe wpisane liczby (dane elektryczne jako wpisane ręcznie),
- w zakładce „Opłacalność” przycisk „Pobierz wyniki jako CSV”: jeden wiersz na panel, liczby bez formatowania, jednostka w nagłówku, kolumny z osprzętem przy włączonym przełączniku; formuły w nazwach są zabezpieczone przed wykonaniem w arkuszu.

Wpływ na liczby: brak. Silnik obliczeń bez zmian (1.9.0); zmiana dotyczy wprowadzania danych i zapisu wyników.

## [3.13.0] — 11.10.2026

Porównywarka paneli PV: osprzęt w scenariuszu „tańszy panel = więcej paneli” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 41):
- w zakładce „Więcej paneli?” pod dotychczasowym wynikiem (z samych cen paneli) pojawia się wariant „Z urządzeniem i osprzętem”: ceny obu zestawów razem z wybranym urządzeniem i osprzętem z zakładki „Falownik i osprzęt”, a liczba dodatkowych paneli jest wyszukiwana, nie dzielona, bo każda dokupiona sztuka zmienia układ stringów, liczbę urządzeń i ilości osprzętu,
- włącza go ten sam przełącznik „Wlicz urządzenie i osprzęt do ceny” z zakładki „Opłacalność”; ceny osprzętu są zakresem, więc liczba paneli jest podana dla obu końców zakresu, a energia dla ostrożniejszej liczby,
- bez wybranego urządzenia, bez najniższej temperatury albo gdy żaden układ nie mieści się w limitach urządzenia ekran mówi, czego brakuje; nic nie jest zgadywane.

Wpływ na liczby: brak dla dotychczasowych wejść i głównych wyników scenariusza (te nadal liczą się z samych cen paneli). Nowy wariant dokłada osobne liczby tylko wtedy, gdy włączono przełącznik i wybrano urządzenie. Silnik porównywarki 1.8.0 → 1.9.0.

## [3.12.0] — 11.10.2026

Porównywarka paneli PV: limity mocy baterii i falownika w bilansie godzinowym (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 40):
- w zakładce „Bilans godzinowy” trzy opcjonalne pola z kart katalogowych: maksymalna moc ładowania baterii, maksymalna moc rozładowania baterii i moc ciągła falownika [kW]; puste pole = bez ograniczenia tej mocy (bez wartości domyślnej),
- bilans nie zakłada już, że sprzęt przeniesie każdą moc: nadwyżka ponad moc ładowania jest odcinana, brakująca część ponad moc rozładowania i ponad moc falownika liczy się jako brak energii (sieć albo agregat); dotyczy też doboru liczby paneli na zimę,
- narzędzie AI porównania paneli przyjmuje limity; pola mają „?” i tłumaczenia PL/EN/RU; założenie wyniku mówi, które limity wpisano.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanych limitów bilans jest taki sam). Z limitami spada pokrycie zużycia i rośnie brak energii oraz odcięta nadwyżka, więc zmieniają się: pokrycie, cykle baterii, koszt braku i dobór paneli na zimę w zakładce „Bilans godzinowy”. Silnik porównywarki 1.7.0 → 1.8.0.

## [3.11.0] — 11.10.2026

Porównywarka paneli PV: profil dobowy zużycia w bilansie godzinowym (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 39):
- w zakładce „Bilans godzinowy” trzy opcjonalne pola: jaka część dobowego zużycia przypada na dzień (6–18), wieczór (18–22) i noc (22–6); bez nich zużycie jest rozłożone równo na dobę jak dotąd (bez wartości domyślnej),
- zużycie każdego miesiąca dzieli się na godziny doby według tego profilu, więc bilans pokazuje realniejszy brak energii wieczorem i w nocy (albo mniejszy, gdy prąd zużywasz głównie w dzień); dotyczy też doboru liczby paneli na zimę,
- narzędzie AI porównania paneli przyjmuje profil w trzech porach doby; pola mają „?” i tłumaczenia PL/EN/RU.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanego profilu bilans jest taki sam). Z profilem zmienia się rozkład zużycia w ciągu doby, więc zmieniają się: pokrycie, brak energii, cykle baterii, koszt braku i dobór paneli na zimę w zakładce „Bilans godzinowy”. Suma zużycia miesiąca zostaje. Silnik porównywarki 1.6.0 → 1.7.0.

## [3.10.0] — 11.10.2026

Porównywarka paneli PV: test „co, jeśli panel ma mniej mocy, niż deklaruje” (spec `docs/porownywarka-paneli-pv-specyfikacja.md`, sekcja 38):
- w zakładce „Opłacalność” nowe pole: o ile procent mniej mocy może mieć panel niż na karcie lub naklejce (bez wartości domyślnej; puste = bez testu),
- po wpisaniu ekran pokazuje obok siebie liczby z karty i po zaniżeniu mocy: moc, energię zimą i w roku, cenę za Wp rzeczywistej mocy, koszt zimowej kWh i okres zwrotu, przy tej samej cenie panelu,
- narzędzie AI porównania paneli przyjmuje ten procent i zwraca scenariusz osobno dla każdego panelu; pole ma „?” i tłumaczenia PL/EN/RU.

Wpływ na liczby: brak dla dotychczasowych wejść (bez wpisanego procentu żaden wynik się nie zmienia, a z procentem główne wyniki też zostają). Nowe liczby powstają tylko w osobnym scenariuszu. Silnik porównywarki 1.5.0 → 1.6.0.

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
