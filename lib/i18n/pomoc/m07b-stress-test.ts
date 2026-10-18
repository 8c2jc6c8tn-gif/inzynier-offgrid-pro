/**
 * Help content — Module 7 (winter stress test), screens built on 01.10.2026 (branch `work/screens`).
 * Numbers kept by the engines as constants enter through `{params}`; the app never assumes a user value
 * (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "deficyty-miesieczne": {
    migawka: {
      oCoChodzi: "To portfel zimy — wiesz, ile realnie wydasz na paliwo, zanim przyjdzie mróz, zamiast dowiadywać się w trakcie.",
      jakDziala: "Dla każdego miesiąca z deficytem: godziny pracy = deficyt ÷ (moc × {procent}%), paliwo = godziny × zużycie, koszt = paliwo × cena + godziny × stawka serwisu. Z zapasem paliwa — porównanie miesiąc po miesiącu albo na wybrany horyzont (3, 7, 14 dni, miesiąc, własna liczba dni). Z historią wielu lat aplikacja liczy realnie: rozkład deficytów, najgorsze okno między dostawami w każdym roku i serie słabych dób, a zapas dobiera z wybranego percentyla.",
      poCo: "Planujesz zapas paliwa, dostawy i budżet na cały sezon, a nie tylko na najgorszy miesiąc.",
      fizyka: "t = D ÷ (P × {procent}%) — agregat pracuje najoszczędniej przy 70–80% mocy (źródło), przyjęta górna granica jak w Module 2. Przykład źródła: 120 kWh ÷ (5 kW × 0,8) = 30 h.",
    },
    pola: {
      deficyt: {
        nazwa: "Deficyt energii w miesiącu [kWh]",
        cel: "Energia, której PV i bateria nie pokryją w danym miesiącu — tyle musi dać agregat.",
        gdzie: "Produkcja PV miesiąca (Moduł 3) minus zapotrzebowanie (Moduł 2); w przyszłości z symulacji dzień po dniu (Ekran 1).",
        zakres: "Puste albo 0 = miesiąc bez deficytu.",
      },
      moc: {
        nazwa: "Moc znamionowa agregatu [kW]",
        cel: "Z niej liczona jest moc przy optymalnym obciążeniu, a z niej godziny pracy.",
        gdzie: "Tabliczka znamionowa / karta agregatu (moc ciągła, nie szczytowa).",
        zakres: "Karta katalogowa urządzenia.",
      },
      zuzycie: {
        nazwa: "Zużycie paliwa [l/h]",
        cel: "Zamienia godziny pracy na litry paliwa.",
        gdzie: "Karta agregatu — zużycie przy 75–80% obciążenia.",
        zakres: "Karta katalogowa urządzenia.",
      },
      cena: {
        nazwa: "Cena paliwa [{waluta}/l]",
        cel: "Zamienia litry na pieniądze.",
        gdzie: "Cena na stacji / z ostatniego zakupu.",
        zakres: "Twoja cena.",
      },
      serwis: {
        nazwa: "Serwis i olej na motogodzinę [{waluta}/h]",
        cel: "Koszt oleju, filtrów i przeglądów rozłożony na godzinę pracy.",
        gdzie: "Koszt przeglądu ÷ interwał serwisowy z instrukcji (np. wymiana oleju co X h).",
        zakres: "Puste = koszt serwisu nie jest liczony.",
      },
      zapas: {
        nazwa: "Zapas paliwa na miejscu [l]",
        cel: "Z nim porównywane jest paliwo każdego miesiąca.",
        gdzie: "Pojemność kanistrów/zbiornika, którą trzymasz na zimę.",
        zakres: "Puste = aplikacja wskaże tylko miesiąc z najdłuższą pracą.",
      },
      horyzont: {
        nazwa: "Horyzont zapasu paliwa",
        cel: "Na ile dni z góry porównać wpisany zapas z potrzebą: 3, 7, 14 dni, cały miesiąc albo własna liczba dni. Liczone z najgorszego miesiąca (jego średnia doba × liczba dni, agregat daje całą brakującą energię).",
        gdzie: "Twoja decyzja: jak długo możesz nie mieć dostawy paliwa (zasypana droga, brak stacji, dojazd).",
        zakres: "To opcje startowe — realniejsze liczby daje historia wielu lat (sekcja niżej).",
      },
      horyzontDni: {
        nazwa: "Własna liczba dni [dni]",
        cel: "Własny horyzont zapasu paliwa, gdy wybrano „Własna liczba dni”.",
        gdzie: "Twoja decyzja — np. czas między dostawami paliwa.",
        zakres: "Od 1 do 366 dni.",
      },
      histDane: {
        nazwa: "Produkcja albo nasłonecznienie z poprzednich lat",
        cel: "Z nich aplikacja liczy rozkład deficytów, najgorsze okno między dostawami i serie słabych dób — zamiast jednego miesiąca z kalendarza.",
        gdzie: "Seria wieloletnia (np. PVGIS dla działki), pomiary z falownika budynku albo z Twojej miejscowości. Jedna linia = rok, od 1 stycznia; „-” oznacza brak danych tego dnia (nie jest wypełniany).",
        zakres: "Im więcej lat i dób, tym węższy i pewniejszy zakres; przy jednym roku to tylko jedna obserwacja.",
      },
      histZrodlo: {
        nazwa: "Źródło danych historii",
        cel: "Etykieta pokazywana przy wyniku, żeby było wiadomo, na czym opiera się szacunek (dane z własnego budynku są dokładniejsze niż ogólne z okolicy).",
        gdzie: "Wybierz, skąd pochodzą wklejone liczby.",
        zakres: "Wybór z listy.",
      },
      histRodzaj: {
        nazwa: "Co oznaczają wartości",
        cel: "Produkcja instalacji jest używana wprost; nasłonecznienie jest przeliczane na produkcję przez moc instalacji i współczynnik PR.",
        gdzie: "Zależy od źródła danych (falownik podaje kWh, seria pogodowa — kWh/m²).",
        zakres: "Wybór z listy.",
      },
      histKwp: {
        nazwa: "Moc instalacji PV [kWp]",
        cel: "Do przeliczenia nasłonecznienia na produkcję: kWh = nasłonecznienie × kWp × PR.",
        gdzie: "Suma mocy paneli z projektu lub tabliczek znamionowych.",
        zakres: "Twoja instalacja.",
      },
      histPr: {
        nazwa: "Współczynnik sprawności instalacji PR [0–1]",
        cel: "Uwzględnia straty instalacji (temperatura, falownik, kable, zabrudzenie) przy przeliczaniu nasłonecznienia na produkcję.",
        gdzie: "Z projektu/symulacji instalacji albo z pomiarów (rzeczywista produkcja ÷ idealna).",
        zakres: "Powyżej 0 i nie więcej niż 1; wartość wpisujesz Ty — aplikacja żadnej nie zakłada.",
      },
      histPopyt: {
        nazwa: "Średnie dobowe zapotrzebowanie domu [kWh/dobę]",
        cel: "Dobowy deficyt = zapotrzebowanie − produkcja PV tej doby (nie mniej niż 0). Ta sama wartość jest użyta dla każdego miesiąca, chyba że wybierzesz wpis osobno dla każdego miesiąca.",
        gdzie: "Moduł 2 (zapotrzebowanie energetyczne) albo licznik: roczne zużycie ÷ 365, najlepiej dla zimy.",
        zakres: "Twój dom; zimą zwykle wyższe niż średnia roczna.",
      },
      histPopytTryb: {
        nazwa: "Jak wpisać zapotrzebowanie",
        cel: "Zimą dom off-grid zużywa zwykle więcej (światło, pompy obiegów, ogrzewanie) — jedna średnia roczna zaniża zimowy deficyt. Wpis osobno dla każdego miesiąca daje dokładniejszy wynik.",
        gdzie: "Wybierz „osobno”, gdy znasz zużycie w poszczególnych miesiącach (faktury, licznik, ekran „Zużycie miesięczne”).",
        zakres: "Jedna średnia / osobno dla każdego miesiąca.",
      },
      histPopytMiesiac: {
        nazwa: "Średnie dobowe zapotrzebowanie w miesiącu [kWh/dobę]",
        cel: "Dobowy deficyt tego miesiąca = zapotrzebowanie − produkcja PV doby (nie mniej niż 0).",
        gdzie: "Zużycie miesiąca (faktura, licznik, ekran „Zużycie miesięczne”) ÷ liczba dni miesiąca — przycisk „Wstaw” robi to za Ciebie.",
        zakres: "≥ 0. Potrzebne wszystkie 12 miesięcy.",
      },
      histOkno: {
        nazwa: "Okno między dostawami paliwa [dni]",
        cel: "Długość okresu, na który zapas ma wystarczyć bez uzupełnienia. W każdym roku historii szukane jest najgorsze takie okno.",
        gdzie: "Twoja decyzja: jak długo możesz być bez dostawy paliwa.",
        zakres: "Od 1 do 366 dni.",
      },
      histPercentyl: {
        nazwa: "Percentyl do doboru zapasu [%]",
        cel: "Z najgorszych okien każdego roku bierze wartość, której nie przekroczyło tyle procent lat (metoda najbliższej rangi). Wyższy percentyl = większy zapas i rzadziej zabraknie paliwa. Puste = tylko min, mediana i max.",
        gdzie: "Twoja decyzja o ryzyku, które akceptujesz.",
        zakres: "Od 1 do 100; przy kilku latach danych wysoki percentyl to po prostu najgorszy rok (aplikacja to zaznaczy).",
      },
      histProg: {
        nazwa: "Próg słabej doby [% zapotrzebowania]",
        cel: "Doba jest „słaba”, gdy PV pokryło mniej niż ten procent zapotrzebowania tej doby. Z tego liczone są serie kolejnych słabych dób. Puste = serie nie są liczone.",
        gdzie: "Twoja decyzja — np. doby, w których PV daje mniej niż połowę potrzeb.",
        zakres: "Od 1 do 100; aplikacja żadnego progu nie narzuca.",
      },
      histNoc: {
        nazwa: "Udział zużycia nocnego [% doby]",
        cel: "Jaka część dobowego zużycia przypada na godziny bez produkcji PV (wieczór, noc, wczesny ranek). Tę część pokrywa tylko magazyn albo agregat — nie bieżące słońce. Puste = dzień i noc liczone razem (wynik może być zaniżony, aplikacja to zaznacza).",
        gdzie: "Licznik z podziałem godzinowym, profil zużycia od dostawcy energii albo własny pomiar wieczór/rano. Aplikacja nie przyjmuje żadnej wartości za Ciebie.",
        zakres: "Od 0 do 100%.",
      },
      histMagPoj: {
        nazwa: "Magazyn energii — pojemność użyteczna [kWh]",
        cel: "Nadwyżka PV z dobrej doby ładuje magazyn i pokrywa deficyt kolejnych dób, zanim ruszy agregat — zapas paliwa wychodzi mniejszy niż w bilansie bez magazynu. Puste = bilans bez magazynu.",
        gdzie: "Pojemność, którą wolno realnie zużyć (po odjęciu dopuszczalnej głębokości rozładowania) — karta katalogowa albo ekrany Modułu 4.",
        zakres: "≥ 0 kWh. W tym bilansie agregat nie ładuje magazynu (ładowanie z agregatu policzysz na ekranie „Ładowanie magazynu z agregatu”); dzień bez danych zeruje stan magazynu — uzupełnij brakujące dni, jeśli masz z nich dane.",
      },
      histMagSpr: {
        nazwa: "Sprawność cyklu magazynu [%]",
        cel: "Jaka część nadwyżki PV wraca z magazynu jako energia (ładowanie + rozładowanie). Aplikacja nie przyjmuje żadnej wartości za Ciebie — bez niej wynik czeka.",
        gdzie: "Karta katalogowa magazynu / falownika (sprawność „round-trip”).",
        zakres: "Od 1 do 100%.",
      },
      histMagStan: {
        nazwa: "Stan magazynu 1 stycznia [% pojemności]",
        cel: "Od jakiego naładowania liczony jest każdy rok historii. Puste lub 0 = pusty magazyn — strona bezpieczna.",
        gdzie: "Twoje założenie o typowym stanie na przełomie roku.",
        zakres: "Od 0 do 100%.",
      },
      histBrak: {
        nazwa: "Brakujący dzień historii",
        cel: "Wartość dnia, którego brakuje w danych (z PVGIS, z pliku albo z telemetrii). Po „Uzupełnij” trafia do historii w miejsce „-”, a okna i serie z tym dniem przestają być pomijane.",
        gdzie: "Tylko jeśli masz realną wartość: licznik dzienny falownika, aplikacja producenta, własne notatki. Bez danych zostaw puste — aplikacja niczego nie wstawia za Ciebie.",
        zakres: "≥ 0, w jednostce historii (kWh/dobę dla produkcji PV, kWh/m²/dobę dla nasłonecznienia).",
      },
      telZrodlo: {
        nazwa: "Źródło telemetrii",
        cel: "Źródło pomiarów zapisanych w aplikacji (import CSV, urządzenie, tryb na żywo), z którego zostanie złożona historia dobowa produkcji PV budynku.",
        gdzie: "Źródła dodajesz na ekranie „Źródła telemetrii”, a pomiary zbiera import CSV lub odczyt na żywo.",
        zakres: "Jedno ze źródeł z listy.",
      },
      telKanal: {
        nazwa: "Kanał mocy PV",
        cel: "Kanał, którego moc [W] jest produkcją PV (np. wyjście MPPT albo falownika PV). Energia doby to całka tej mocy po czasie.",
        gdzie: "Nazwa kanału z pliku lub urządzenia — taka sama jak na ekranie „Podsumowanie telemetrii”.",
        zakres: "Kanał z próbkami mocy.",
      },
      telPrzerwa: {
        nazwa: "Najdłuższa przerwa między próbkami [min]",
        cel: "Do tej przerwy energia jest liczona między sąsiednimi próbkami; dłuższa przerwa jest nieznana i nie jest mostkowana. Doba ma wartość tylko wtedy, gdy próbki pokrywają ją w całości — inaczej zostaje brakującym dniem do uzupełnienia.",
        gdzie: "Krok zapisu Twojego loggera z zapasem na pojedyncze zgubione próbki — to zależy od urządzenia, aplikacja go nie zgaduje.",
        zakres: "> 0 min.",
      },
      pvgisLat: {
        nazwa: "Szerokość geograficzna działki [°]",
        cel: "Miejsce, dla którego PVGIS poda archiwalne nasłonecznienie doba po dobie.",
        gdzie: "Mapa lub GPS w telefonie na działce; w Polsce zwykle 49–55 (N).",
        zakres: "Od -90 do 90; kropka dziesiętna. PVGIS ma dane tylko dla lądu w swoim zasięgu.",
      },
      pvgisLon: {
        nazwa: "Długość geograficzna działki [°]",
        cel: "Druga współrzędna miejsca, dla którego pobierane są dane.",
        gdzie: "Mapa lub GPS w telefonie na działce; w Polsce zwykle 14–24 (E).",
        zakres: "Od -180 do 180; kropka dziesiętna.",
      },
      pvgisNach: {
        nazwa: "Nachylenie paneli [°]",
        cel: "PVGIS liczy nasłonecznienie na płaszczyźnie Twoich paneli, nie na poziomej — zimą różnica jest duża.",
        gdzie: "Z projektu konstrukcji pod panele albo pomiar kątomierzem; 0 = panel leżący płasko, 90 = pionowo.",
        zakres: "Od 0 do 90; wartość wpisujesz Ty — aplikacja żadnej nie zakłada.",
      },
      pvgisAzym: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele — razem z nachyleniem wyznacza ilość złapanego słońca.",
        gdzie: "Z kompasu lub mapy. Konwencja PVGIS: 0 = południe, 90 = zachód, -90 = wschód, 180 = północ.",
        zakres: "Od -180 do 180; to nie jest azymut kompasowy liczony od północy.",
      },
      pvgisOd: {
        nazwa: "Pierwszy rok historii",
        cel: "Początek zakresu lat pobieranych z PVGIS; więcej lat = pewniejszy rozkład, ale dłuższe pobieranie.",
        gdzie: "Twoja decyzja.",
        zakres: "Od 2005 do 2023 (zakres bazy PVGIS-SARAH3 w używanej wersji) i nie później niż rok końcowy.",
      },
      pvgisDo: {
        nazwa: "Ostatni rok historii",
        cel: "Koniec zakresu lat pobieranych z PVGIS.",
        gdzie: "Twoja decyzja.",
        zakres: "Od 2005 do 2023 i nie wcześniej niż rok początkowy.",
      },
    },
  },
  "raport-kryzysowy": {
    "migawka": {
      "oCoChodzi": "Raport kryzysowy to protokół po próbie generalnej zimy: jedna kartka, na której widać wszystkie wyniki stress-testu obok siebie.",
      "jakDziala": "Ekran odczytuje to, co zapisałeś na ekranach Symulacja mrozu, Deficyty miesięczne i agregat, Blackout oraz Współczynnik Bezpieczeństwa Zimowego, i zestawia to w jednym miejscu. Część, której ekran nie został jeszcze wypełniony, jest oznaczona jako brak — nigdy jako zero.",
      "poCo": "Widzisz w jednym miejscu, ile dni z deficytem daje mróz, ile pracy agregatu i paliwa to kosztuje, czy magazyn przetrwa dni bez słońca i jaka składowa bezpieczeństwa jest najsłabsza — a na końcu możesz to wydrukować lub zapisać jako PDF.",
      "fizyka": "Raport niczego nie liczy własnym modelem: każda część to wynik silnika tego ekranu z jego zapisanego szkicu. Pokrycie najgorszego miesiąca = produkcja ÷ zapotrzebowanie (obcięte do 100%), brak = zapotrzebowanie − produkcja. Współczynnik Bezpieczeństwa Zimowego to ważona średnia pięciu składowych z Ekranu 12 (wagi wstępne, do dopracowania)."
    },
    "pola": {
      "liczbaDzis": {
        "nazwa": "Ile paneli masz dziś",
        "cel": "Z tej liczby wyliczam, ile energii daje jeden panel w najgorszym miesiącu (produkcja z ekranu współczynnika ÷ liczba paneli), a z tego ile paneli dołożyć, żeby pokryć brak.",
        "gdzie": "Policz panele zamontowane dziś. Użyj, gdy nie znasz uzysku jednego panelu; gdy podasz też uzysk, liczy się uzysk.",
        "zakres": "Liczba całkowita od 1. Zakłada panele jednakowe i w tym samym ustawieniu. Puste pole = bez przeliczenia na sztuki."
      },
      "uzyskPanelu": {
        "nazwa": "Uzysk jednego panelu w najgorszym miesiącu",
        "cel": "Dzielę przez niego brak energii z najgorszego miesiąca i zaokrąglam w górę do pełnych paneli.",
        "gdzie": "Z zakładki „Zima” w Porównywarce paneli (energia jednego panelu w miesiącach zimowych) albo z własnego pomiaru.",
        "zakres": "Dodatnia liczba kWh. Ma pierwszeństwo przed liczbą paneli. Puste pole = bez przeliczenia na sztuki."
      }
    }
  },
  "symulacja-mrozu": {
    "migawka": {
      "oCoChodzi": "Zimowa próba generalna: przez cały miesiąc ten sam mróz, co dzień inna pogoda — i sprawdzamy, ile dni system da radę bez agregatu.",
      "jakDziala": "Wybierz miesiąc, podaj moc i ustawienie paneli oraz zużycie domu. Dla każdego scenariusza temperatury aplikacja odtwarza dobowe ciepło budynku (z Ekranu 1 Modułu 6), dolicza je do zużycia, obniża pojemność baterii o spadek z karty ogniwa i przelicza bilans dzień po dniu na produkcji PV z danych TMY Twojej lokalizacji.",
      "poCo": "Średnia roczna ukrywa mroźne tygodnie. Tu widać, w których dniach zabraknie energii, ile jej brakuje łącznie i czy deficyty idą seriami — od tego zależy, jaki agregat i jaki zapas paliwa są potrzebne.",
      "fizyka": "Q_doba = max(0, H_zewn·(θi − θe) + Φ_st)·24 h; E_el = Q/COP; D = E_baz + E_el + E_dod; C_ef = C·(1 − s/100); deficyt dnia = max(0, D − P_PV − energia z magazynu). Produkcja dnia = Σ G_poa·Δt/1000 · kWp · PR. Temperatura stała przez miesiąc, COP stały w scenariuszu — to uproszczenie."
    },
    "pola": {
      "miesiac": {
        "nazwa": "Miesiąc symulacji",
        "cel": "Dni tego miesiąca z danych TMY to profil produkcji PV, na którym liczony jest bilans.",
        "gdzie": "Zwykle najzimniejszy miesiąc: grudzień lub styczeń.",
        "zakres": "Wymagane; dni z typowego roku meteorologicznego, nie z prognozy."
      },
      "mocKwp": {
        "nazwa": "Moc paneli [kWp]",
        "cel": "Skaluje nasłonecznienie płaszczyzny do energii elektrycznej.",
        "gdzie": "Suma mocy znamionowych paneli z kart katalogowych lub z projektu.",
        "zakres": "Twoja instalacja; wymagane > 0."
      },
      "pr": {
        "nazwa": "Współczynnik sprawności instalacji PR [-]",
        "cel": "Uwzględnia straty falownika, kabli, temperatury i zabrudzenia.",
        "gdzie": "Z projektu lub z pomiarów własnej instalacji; aplikacja go nie zgaduje.",
        "zakres": "Zwykle 0,6–0,9; wymagane > 0."
      },
      "nachylenieDeg": {
        "nazwa": "Nachylenie paneli [°]",
        "cel": "Od kąta zależy, ile zimowego słońca pada na panel.",
        "gdzie": "Pomiar na dachu lub projekt konstrukcji.",
        "zakres": "0° = płasko, 90° = pionowo."
      },
      "azymutDeg": {
        "nazwa": "Azymut paneli [°]",
        "cel": "Kierunek, w który patrzą panele — wpływa na zimową produkcję.",
        "gdzie": "Kompas lub plan dachu: N = 0°, E = 90°, S = 180°, W = 270°.",
        "zakres": "0–360°."
      },
      "korektaProdukcjiPct": {
        "nazwa": "Korekta produkcji PV [%]",
        "cel": "Obniża (wartość ujemna) lub podnosi produkcję, np. o szron i śnieg na panelach.",
        "gdzie": "Własna ocena albo wynik ekranów o śniegu i oblodzeniu; puste = bez korekty.",
        "zakres": "−100…100%; ujemna = mniej energii."
      },
      "zuzycieBazoweDobaKwh": {
        "nazwa": "Zużycie dobowe bez ogrzewania [kWh/dobę]",
        "cel": "Energia elektryczna domu bez ogrzewania, taka sama w każdym scenariuszu.",
        "gdzie": "Moduł 2 (odbiorniki) albo rachunek z lata, gdy dom nie grzeje prądem.",
        "zakres": "Twoje zużycie; wymagane ≥ 0."
      },
      "dodatkoweZuzycieDobaKwh": {
        "nazwa": "Dodatkowe zużycie z mrozu [kWh/dobę]",
        "cel": "Grzałki BMS, odszranianie, podgrzewanie rur i inne odbiorniki włączane przez mróz.",
        "gdzie": "Karty urządzeń lub pomiar; puste = brak dodatkowych odbiorników.",
        "zakres": "≥ 0."
      },
      "cop": {
        "nazwa": "COP ogólny źródła ciepła",
        "cel": "Ile ciepła powstaje z 1 kWh prądu; zastępuje COP z Ekranu 1, gdy go wpiszesz.",
        "gdzie": "Karta pompy ciepła przy temperaturze zewnętrznej scenariusza; grzałka = 1.",
        "zakres": "> 0; COP pompy spada wraz z mrozem."
      },
      "magazynKwh": {
        "nazwa": "Pojemność użyteczna magazynu [kWh]",
        "cel": "Magazyn przenosi nadwyżkę PV z dni słonecznych na dni bez słońca.",
        "gdzie": "Karta baterii: pojemność w dopuszczalnej głębokości rozładowania. Puste lub 0 = bez magazynu.",
        "zakres": "≥ 0; w temperaturze zwykłej, przed spadkiem z mrozu."
      },
      "magazynSprawnoscPct": {
        "nazwa": "Sprawność magazynu przy ładowaniu [%]",
        "cel": "Tyle energii nadwyżki trafia do baterii; reszta to straty.",
        "gdzie": "Karta baterii i falownika (sprawność cyklu).",
        "zakres": "Wymagana, gdy podano pojemność; 0–100%."
      },
      "magazynStanPoczatkowyPct": {
        "nazwa": "Stan naładowania na początku miesiąca [%]",
        "cel": "Od czego startuje bilans; puste = 0%, czyli strona bezpieczna.",
        "gdzie": "Własna ocena po poprzednim miesiącu.",
        "zakres": "0–100%."
      },
      "udzialNocyPct": {
        "nazwa": "Udział zużycia w nocy [%]",
        "cel": "Część zużycia przypadająca na godziny bez słońca — zasila się ją tylko z magazynu.",
        "gdzie": "Profil dobowy zużycia domu (Moduł 2); puste = dzień i noc jednej doby się nie rozdziela.",
        "zakres": "0–100%."
      },
      "scenariuszTemperaturaC": {
        "nazwa": "Temperatura scenariusza [°C]",
        "cel": "Stała temperatura zewnętrzna przez cały miesiąc w tym scenariuszu.",
        "gdzie": "Domyślnie −20 i −30 °C; możesz wpisać własną, np. temperaturę obliczeniową strefy.",
        "zakres": "−60…20 °C; do 6 scenariuszy."
      },
      "scenariuszCop": {
        "nazwa": "COP w tym scenariuszu",
        "cel": "COP pompy ciepła przy temperaturze scenariusza; puste = COP ogólny.",
        "gdzie": "Wykres lub tabela mocy i COP z karty pompy przy tej temperaturze zewnętrznej.",
        "zakres": "> 0."
      },
      "scenariuszSpadekPojemnosciPct": {
        "nazwa": "Spadek pojemności baterii w mrozie [%]",
        "cel": "Ogniwa w mrozie oddają mniej energii niż w temperaturze pokojowej.",
        "gdzie": "Karta ogniwa: pojemność w funkcji temperatury. Przykład ze źródeł (−20% przy −20 °C) to tylko ilustracja; puste = brak spadku.",
        "zakres": "0–99%."
      }
    }
  },
  "ladowanie-z-agregatu": {
    "migawka": {
      "oCoChodzi": "Agregat ładujący magazyn to jak kran napełniający wannę, z którego ktoś w tym samym czasie nabiera wodę wiadrem — do wanny płynie tylko to, co zostanie.",
      "jakDziala": "Wpisz moc agregatu, moc ładowania ładowarki/falownika, moc odbiorników na linii awaryjnej, pojemność magazynu, progi SOC startu i zatrzymania oraz sprawność ładowania. Aplikacja policzy moc ładowania, obciążenie agregatu, czas pracy na cykl i — gdy podasz zużycie z karty — paliwo i koszt.",
      "poCo": "Bilans dobowy (Deficyty miesięczne) nie wie, ile kW zostaje na ładowanie w danej chwili. Tu widać, czy agregat w ogóle ma zapas na ładowanie, przy jakim obciążeniu pracuje (od tego zależy zużycie l/h z karty) i ile godzin oraz litrów kosztuje jeden cykl.",
      "fizyka": "P_ład = min(P_ładowarki, P_agregatu − P_odbiorników); E = (SOC_stop − SOC_start)/100 · C; energia AC = E/η; t = E_AC / P_ład; paliwo = t · q [l/h]. Obciążenie = (P_odb + P_ład)/P_agregatu. Pod koniec ładowania (faza stałego napięcia) moc ładowania spada — rzeczywisty czas jest dłuższy."
    },
    "pola": {
      "mocAgregatuKw": {
        "nazwa": "Moc znamionowa (ciągła) agregatu [kW]",
        "cel": "Górna granica mocy, którą agregat odda odbiornikom i ładowarce razem.",
        "gdzie": "Tabliczka znamionowa / karta katalogowa — moc ciągła (nie szczytowa).",
        "zakres": "Twój agregat; wymagane > 0."
      },
      "mocLadowarkiKw": {
        "nazwa": "Moc ładowania z agregatu [kW]",
        "cel": "Ile maksymalnie ładowarka/falownik pobiera z agregatu na ładowanie magazynu.",
        "gdzie": "Karta falownika/ładowarki (maks. prąd ładowania × napięcie magazynu, albo ustawiony limit prądu wejścia AC).",
        "zakres": "Twoje urządzenie; wymagane > 0."
      },
      "mocOdbiornikowKw": {
        "nazwa": "Moc odbiorników na linii awaryjnej [kW]",
        "cel": "Odbiorniki pracujące w czasie ładowania zabierają część mocy agregatu.",
        "gdzie": "Suma mocy odbiorników linii awaryjnej pracujących w tym czasie (Moduł 2, pomiar).",
        "zakres": "0 = brak odbiorników; wartość stała przez cały cykl."
      },
      "pojemnoscKwh": {
        "nazwa": "Pojemność użyteczna magazynu [kWh]",
        "cel": "Przelicza różnicę progów SOC na energię do naładowania.",
        "gdzie": "Karta magazynu × dopuszczalne DoD (Moduł 4).",
        "zakres": "Twój magazyn; wymagane > 0."
      },
      "socStartPct": {
        "nazwa": "Próg SOC startu agregatu [%]",
        "cel": "Przy tym stanie naładowania agregat się uruchamia.",
        "gdzie": "Ustawienia falownika/sterownika agregatu.",
        "zakres": "0–100%, mniejszy niż próg zatrzymania."
      },
      "socStopPct": {
        "nazwa": "Próg SOC zatrzymania agregatu [%]",
        "cel": "Do tego stanu naładowania agregat ładuje magazyn.",
        "gdzie": "Ustawienia falownika/sterownika agregatu.",
        "zakres": "0–100%, większy niż próg startu."
      },
      "sprawnoscLadowaniaPct": {
        "nazwa": "Sprawność ładowania AC → magazyn [%]",
        "cel": "Część energii z agregatu tracona w ładowarce i magazynie przy ładowaniu.",
        "gdzie": "Karta ładowarki/falownika — sprawność ładowania (nie sprawność cyklu ładowanie+rozładowanie).",
        "zakres": "Większa od 0, najwyżej 100%."
      },
      "zuzyciePaliwaLH": {
        "nazwa": "Zużycie paliwa [l/h]",
        "cel": "Liczy paliwo i koszt cyklu.",
        "gdzie": "Karta katalogowa agregatu — wiersz dla obciążenia najbliższego temu, które pokazuje wynik.",
        "zakres": "Puste = paliwo nie jest liczone (aplikacja pokaże, przy jakim obciążeniu odczytać)."
      },
      "cenaPaliwaZlL": {
        "nazwa": "Cena paliwa [{waluta}/l]",
        "cel": "Liczy koszt cyklu.",
        "gdzie": "Twoja cena zakupu.",
        "zakres": "Puste = koszt nie jest liczony."
      }
    }
  },
  "okno-sloneczne": {
    "migawka": {
      "oCoChodzi": "Zimą słońce jest jak krótka wizyta gościa — trzeba wykorzystać każdą minutę, zanim sobie pójdzie.",
      "jakDziala": "Wpisz, ile energii PV da okno słoneczne, ile dom zużyje w tym czasie, baterię i bojler. Aplikacja rozdzieli resztę w kolejności ze źródła: grzałki BMS (jeśli bateria wymaga ogrzania), bateria do {prog}%, bojler, bateria do 100%, na końcu odbiorniki nadwyżkowe.",
      "poCo": "Wiesz przed nocą, ile energii zostanie w baterii i czy pralkę włączyć dziś, czy jutro.",
      "fizyka": "Bojler: Q = V·ΔT·c (ta sama stała wody co Moduł 2). SoC_k = SoC_0 + E_bat / C. Przykład źródła „4,5 kWh → bateria 65% i bojler 50 °C” przeczy regule „bojler dopiero powyżej 80%” — aplikacja trzyma się reguły."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Produkcja PV w oknie słonecznym [kWh]",
        "cel": "Energia do rozdzielenia.",
        "gdzie": "Moduł 3 (produkcja godzinowa) albo prognoza pogody dla godzin słońca.",
        "zakres": "Twoja instalacja."
      },
      "zuzycie": {
        "nazwa": "Zużycie domu w czasie okna [kWh]",
        "cel": "Odbiorniki pracujące w tym czasie są zasilane najpierw.",
        "gdzie": "Moduł 2 — zużycie w tych godzinach.",
        "zakres": "Puste = 0."
      },
      "pojemnosc": {
        "nazwa": "Pojemność użyteczna baterii [kWh]",
        "cel": "Przelicza energię na procent SoC.",
        "gdzie": "Karta baterii × dopuszczalne DoD (Moduł 4).",
        "zakres": "Karta katalogowa urządzenia."
      },
      "soc": {
        "nazwa": "Stan naładowania na początku okna [%]",
        "cel": "Od niego zależy, kiedy energia pójdzie do bojlera.",
        "gdzie": "Wyświetlacz BMS/falownika.",
        "zakres": "0–100%."
      },
      "grzalki": {
        "nazwa": "Energia grzałek BMS przed ładowaniem [kWh]",
        "cel": "Bateria LiFePO4 poniżej 0 °C nie przyjmie ładunku, dopóki grzałki jej nie ogrzeją.",
        "gdzie": "Moc mat grzewczych × czas ogrzania (Moduł 4).",
        "zakres": "Puste = bateria nie wymaga ogrzania."
      },
      "bojlerL": {
        "nazwa": "Pojemność bojlera [l]",
        "cel": "Z nią liczone jest ciepło do podgrzania wody.",
        "gdzie": "Tabliczka bojlera.",
        "zakres": "Puste = bez bojlera."
      },
      "tStart": {
        "nazwa": "Temperatura wody teraz [°C]",
        "cel": "Punkt startowy podgrzewania.",
        "gdzie": "Termometr/sterownik bojlera.",
        "zakres": "Twój pomiar."
      },
      "tCel": {
        "nazwa": "Temperatura docelowa wody [°C]",
        "cel": "Do ilu stopni chcesz podgrzać wodę słońcem.",
        "gdzie": "Nastawa termostatu.",
        "zakres": "Twoje ustawienie."
      }
    }
  },
  "snieg-na-pv": {
    "migawka": {
      "oCoChodzi": "Zasypany panel to martwy panel, a wiatr rozkłada śnieg nierównomiernie — trzeba wiedzieć nie tylko ile, ale i gdzie osiądzie.",
      "jakDziala": "Wybierz rodzaj osadu, wpisz kąt paneli i normalną produkcję na dobę. Aplikacja pokaże tabelę „co jeśli” — stratę energii przy 1, 3, 5 i 7 dniach zalegania (nie musisz znać dni ani procentu; własne liczby są opcjonalne), powie, czy sypki śnieg zsunie się sam (kąt powyżej {prog}°) i porówna sposoby radzenia sobie: kąt, ręczne zgarnianie, automaty oraz kabel i folię grzewczą z bilansem energii.",
      "poCo": "Wiesz, ile energii musi zastąpić bateria albo agregat i co faktycznie warto zrobić z panelami — zanim kupisz grzanie, które zje więcej, niż odzyska.",
      "fizyka": "E = E_doba · dni · (1 − p). Procent p to przykład ze źródła (śnieg i lód 0%, szadź ok. 5%), chyba że wpiszesz własny. Śnieg sypki zsuwa się przy kącie > {prog}° (ten sam próg co Moduł 3 „Czystość i śnieg”). Grzanie: zużycie = P · h, odzysk = E_doba · (1 − p) · (dni − h/24); zwraca się, gdy odzysk ≥ zużycie."
    },
    "pola": {
      "rodzaj": {
        "nazwa": "Rodzaj osadu",
        "cel": "Decyduje, czy osad może zejść sam.",
        "gdzie": "Obserwacja albo prognoza (opad sypki, mokry, marznący deszcz).",
        "zakres": "Sypki, mokry, gołoledź/szron, szadź."
      },
      "kat": {
        "nazwa": "Kąt nachylenia paneli [°]",
        "cel": "Przy kącie powyżej {prog}° sypki śnieg może zsunąć się sam.",
        "gdzie": "Projekt instalacji (Moduł 3).",
        "zakres": "0–90°."
      },
      "produkcja": {
        "nazwa": "Produkcja na dobę bez osadu [kWh]",
        "cel": "Energia, którą panele dałyby czyste.",
        "gdzie": "Moduł 3 — produkcja w tym miesiącu ÷ liczba dni.",
        "zakres": "Twoja instalacja."
      },
      "dni": {
        "nazwa": "Własna liczba dni zalegania [dni] (opcjonalnie)",
        "cel": "Dodaje własny wiersz do tabeli i jest scenariuszem, według którego oceniane są opcje z grzaniem.",
        "gdzie": "Obserwacja albo prognoza odwilży; zostaw puste, jeśli nie wiesz (przykład źródła: przy −5 °C śnieg ok. 3 dni).",
        "zakres": "Większa od zera; puste = tabela dla 1, 3, 5 i 7 dni."
      },
      "pozostala": {
        "nazwa": "Własna produkcja pod osadem [% normalnej] (opcjonalnie)",
        "cel": "Jaka część światła przechodzi przez osad; zastępuje przykład ze źródła.",
        "gdzie": "Obserwacja falownika; zostaw puste, jeśli nie wiesz (przykład źródła: śnieg 0%, szadź po 48 h ok. 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Łączna powierzchnia paneli [m²]",
        "cel": "Mnoży moc w W/m² kabla i folii.",
        "gdzie": "Projekt instalacji (Moduł 3) albo wymiary jednego panelu × liczba paneli.",
        "zakres": "Większa od zera dla kabla i folii."
      },
      "kabelMoc": {
        "nazwa": "Moc kabla grzewczego [W/m²]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa kabla — aplikacja nie zgaduje tej wartości.",
        "zakres": "Większa od zera."
      },
      "kabelGodz": {
        "nazwa": "Godziny pracy kabla do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej grzeje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      },
      "foliaMoc": {
        "nazwa": "Moc folii grzewczej [W/m²]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa folii — aplikacja nie zgaduje tej wartości.",
        "zakres": "Większa od zera."
      },
      "foliaGodz": {
        "nazwa": "Godziny pracy folii do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej grzeje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      },
      "automatMoc": {
        "nazwa": "Moc automatycznego systemu czyszczenia [W]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa systemu — to moc łączna, nie na m².",
        "zakres": "Większa od zera."
      },
      "automatGodz": {
        "nazwa": "Godziny pracy systemu do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej pracuje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      },
      "nierowno": {
        "nazwa": "Stringi zasypane nierówno",
        "cel": "Różne zasypanie stringów daje różnice napięć (niedopasowanie).",
        "gdzie": "Połacie o różnych kierunkach, strona zawietrzna, kosze dachu.",
        "zakres": "Tak / nie."
      }
    }
  },
  "szadz-na-pv": {
    "migawka": {
      "oCoChodzi": "Mgła to cichy zabójca paneli — zamarza na nich jak lukier na szybie i, w przeciwieństwie do śniegu, nie odpada sama.",
      "jakDziala": "Wpisz normalną produkcję na dobę. Aplikacja pokaże tabelę „co jeśli” — stratę energii przy 1, 2 (48 h z przykładu źródła), 3, 5 i 7 dniach mgły z szadzią — i porówna sposoby radzenia sobie, w tym bilans energii grzania. Własne dni i procent produkcji są opcjonalne.",
      "poCo": "Kilkudniowa mgła potrafi zabrać prawie całą produkcję — wiesz, ile musi pokryć bateria i agregat, i czy grzanie paneli w ogóle się opłaca.",
      "fizyka": "E = E_doba · dni · (1 − p). Przykład źródła: po 48 h mgły i szadzi produkcja spada do 5% nominalnej (p = 5%). Szadź nie zsuwa się sama, więc większy kąt nie pomaga. Grzanie: zużycie = P · h, odzysk = E_doba · (1 − p) · (dni − h/24)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Produkcja na dobę bez szadzi [kWh]",
        "cel": "Energia, którą panele dałyby czyste.",
        "gdzie": "Moduł 3 — produkcja w tym miesiącu ÷ liczba dni.",
        "zakres": "Twoja instalacja."
      },
      "dni": {
        "nazwa": "Własna liczba dni zalegania [dni] (opcjonalnie)",
        "cel": "Dodaje własny wiersz do tabeli i jest scenariuszem, według którego oceniane są opcje z grzaniem.",
        "gdzie": "Obserwacja albo prognoza odwilży; zostaw puste, jeśli nie wiesz (przykład źródła: przy −5 °C śnieg ok. 3 dni).",
        "zakres": "Większa od zera; puste = tabela dla 1, 3, 5 i 7 dni."
      },
      "pozostala": {
        "nazwa": "Własna produkcja pod osadem [% normalnej] (opcjonalnie)",
        "cel": "Jaka część światła przechodzi przez osad; zastępuje przykład ze źródła.",
        "gdzie": "Obserwacja falownika; zostaw puste, jeśli nie wiesz (przykład źródła: śnieg 0%, szadź po 48 h ok. 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Łączna powierzchnia paneli [m²]",
        "cel": "Mnoży moc w W/m² kabla i folii.",
        "gdzie": "Projekt instalacji (Moduł 3) albo wymiary jednego panelu × liczba paneli.",
        "zakres": "Większa od zera dla kabla i folii."
      },
      "kabelMoc": {
        "nazwa": "Moc kabla grzewczego [W/m²]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa kabla — aplikacja nie zgaduje tej wartości.",
        "zakres": "Większa od zera."
      },
      "kabelGodz": {
        "nazwa": "Godziny pracy kabla do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej grzeje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      },
      "foliaMoc": {
        "nazwa": "Moc folii grzewczej [W/m²]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa folii — aplikacja nie zgaduje tej wartości.",
        "zakres": "Większa od zera."
      },
      "foliaGodz": {
        "nazwa": "Godziny pracy folii do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej grzeje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      },
      "automatMoc": {
        "nazwa": "Moc automatycznego systemu czyszczenia [W]",
        "cel": "Z niej liczymy energię potrzebną na oczyszczenie paneli.",
        "gdzie": "Karta katalogowa systemu — to moc łączna, nie na m².",
        "zakres": "Większa od zera."
      },
      "automatGodz": {
        "nazwa": "Godziny pracy systemu do oczyszczenia [h]",
        "cel": "Mnoży moc — im dłużej pracuje, tym więcej energii zje.",
        "gdzie": "Instrukcja producenta albo własne doświadczenie.",
        "zakres": "Większa od zera."
      }
    }
  },
  "wspolczynnik-bezpieczenstwa-zimowego": {
    "migawka": {
      "oCoChodzi": "To ocena z egzaminu — pokazuje, czy system zda zimę, czy będzie miał poprawkę, i dokładnie z czego.",
      "jakDziala": "Wpisz (albo wstaw z innych ekranów zimowych) pięć grup danych: pokrycie energii w najgorszym miesiącu, dni autonomii, liczbę pojedynczych punktów awarii, moc agregatu i czas ochrony przed zamarznięciem. Każda składowa dostaje wynik 0–100%, a wskaźnik to średnia ważona. Obok wyniku widzisz najsłabszą składową (najsłabsze ogniwo) i kolejność składowych; słabe punkty — gdy wpiszesz próg.",
      "poCo": "Jedna liczba mówi, czy jest dobrze; lista słabych punktów — co poprawić najpierw.",
      "fizyka": "W = Σ wᵢ·sᵢ / Σ wᵢ, gdzie sᵢ = min(100%, co system ma ÷ czego wymaga scenariusz). Wagi (30/25/20/15/10%) są wstępne — do dopracowania przez właściciela aplikacji; możesz wpisać własne (suma 100%). Składowa poniżej progu, który wpiszesz, to słaby punkt; bez progu widzisz tylko kolejność od najsłabszej."
    },
    "pola": {
      "prog": {
        "nazwa": "Próg słabego punktu [%]",
        "cel": "Składowa z wynikiem poniżej tego progu jest oznaczona jako słaby punkt (🟡). Bez progu widzisz tylko kolejność składowych od najsłabszej.",
        "gdzie": "Twoja decyzja — jak ostrożnie chcesz oceniać instalację. Źródło nie podaje progu (przykład: 74% = „dobrze, ale są słabe punkty”).",
        "zakres": "Od 0 do 100%. Puste = bez progu.",
      },
      "produkcja": {
        "nazwa": "Produkcja PV w najgorszym miesiącu [kWh]",
        "cel": "Ile energii dadzą panele w najtrudniejszym miesiącu zimy.",
        "gdzie": "Moduł 3 — produkcja miesięczna (zwykle grudzień lub styczeń); albo przycisk z Ekranu 2.",
        "zakres": "Twoja instalacja; 0 = brak produkcji."
      },
      "zapotrzebowanie": {
        "nazwa": "Zapotrzebowanie w tym samym miesiącu [kWh]",
        "cel": "Z tym porównujemy produkcję.",
        "gdzie": "Moduł 2 — zużycie miesięczne (zimą razem z ogrzewaniem).",
        "zakres": "Większe od zera."
      },
      "autonomia": {
        "nazwa": "Dni pracy bez słońca [dni]",
        "cel": "Jak długo system działa z baterii (i agregatu), gdy PV nie produkuje.",
        "gdzie": "Ekran 4 „Blackout” (przycisk wstawia wynik) albo Moduł 4 „Dni autonomii”.",
        "zakres": "Od 0 do wymaganej liczby dni; więcej nie podnosi oceny."
      },
      "wymaganaAutonomia": {
        "nazwa": "Wymagana liczba dni bez słońca [dni]",
        "cel": "Ile dni bez słońca system ma przetrwać.",
        "gdzie": "Twoja decyzja; scenariusz Blackout w źródle to 10–14 dni.",
        "zakres": "Większa od zera."
      },
      "komponenty": {
        "nazwa": "Liczba sprawdzonych komponentów",
        "cel": "Podstawa do policzenia udziału komponentów z redundancją.",
        "gdzie": "Ekran 10 „Analiza SPOF” (przycisk wstawia liczby) — lista: BMS, falownik, bezpieczniki, MPPT, pompy, czujniki.",
        "zakres": "Liczba całkowita, co najmniej 1."
      },
      "spof": {
        "nazwa": "Komponenty bez redundancji (SPOF)",
        "cel": "Im ich mniej, tym wyższa odporność na awarie.",
        "gdzie": "Ekran 10 — komponenty bez zaznaczonej redundancji.",
        "zakres": "Od 0 do liczby sprawdzonych komponentów."
      },
      "brakAgregatu": {
        "nazwa": "Nie mam agregatu",
        "cel": "Bez agregatu składowa „zapas mocy agregatu” wynosi 0%.",
        "gdzie": "Twoja instalacja.",
        "zakres": "Tak albo nie."
      },
      "mocAgregatu": {
        "nazwa": "Moc agregatu [kW]",
        "cel": "Ile mocy da agregat.",
        "gdzie": "Tabliczka znamionowa agregatu; Ekran 2 (przycisk).",
        "zakres": "Większa od zera."
      },
      "mocWymagana": {
        "nazwa": "Moc, którą agregat musi udźwignąć [kW]",
        "cel": "Z tym porównujemy moc agregatu.",
        "gdzie": "Szczytowa moc odbiorników zasilanych z agregatu plus ładowarka baterii — Moduł 2.",
        "zakres": "Większa od zera."
      },
      "okno": {
        "nazwa": "Czas ochrony przed zamarznięciem [h]",
        "cel": "Jak długo instalacja sama utrzymuje ochronę przed zamarznięciem (odbiorniki krytyczne).",
        "gdzie": "Ekran 6 „Zamarzanie” (przycisk wstawia czas zasilania odbiorników krytycznych).",
        "zakres": "Co najmniej 0; więcej niż czas reakcji nie podnosi oceny."
      },
      "wymaganyCzas": {
        "nazwa": "Czas potrzebny na Twoją reakcję [h]",
        "cel": "Ile czasu potrzebujesz, żeby zareagować: dojechać, uruchomić agregat, spuścić wodę.",
        "gdzie": "Twoja ocena — zależy od tego, gdzie jesteś, gdy system padnie.",
        "zakres": "Większy od zera."
      },
      "wlasneWagi": {
        "nazwa": "Własne wagi",
        "cel": "Pozwala zastąpić wstępne wagi swoimi.",
        "gdzie": "Twoja decyzja — jak ważna jest dla Ciebie każda składowa.",
        "zakres": "Suma wag musi wynosić 100%."
      },
      "waga": {
        "nazwa": "Waga składowej [%]",
        "cel": "Jak mocno składowa wpływa na wynik końcowy.",
        "gdzie": "Domyślnie 30/25/20/15/10% (wstępne, do dopracowania przez właściciela aplikacji); tu wpisujesz własne.",
        "zakres": "0–100%, wszystkie razem 100%."
      }
    }
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "deficyty-miesieczne": {
    migawka: {
      oCoChodzi: "This is the winter wallet — you know how much you will really spend on fuel before the frost comes, instead of finding out during it.",
      jakDziala: "For every month with a shortfall: running hours = shortfall ÷ (power × {procent}%), fuel = hours × fuel use, cost = fuel × price + hours × service rate. With a fuel stock — a month-by-month comparison or against a chosen horizon (3, 7, 14 days, a month, your own days). With a multi-year history the app computes realistically: the distribution of shortfalls, the worst window between deliveries in every year and streaks of weak days, and sizes the stock from the chosen percentile.",
      poCo: "You plan the fuel stock, deliveries and budget for the whole season, not only for the worst month.",
      fizyka: "t = D ÷ (P × {procent}%) — a generator runs most economically at 70–80% of its power (source); the upper limit is used as in Module 2. Source example: 120 kWh ÷ (5 kW × 0.8) = 30 h.",
    },
    pola: {
      deficyt: {
        nazwa: "Energy shortfall in the month [kWh]",
        cel: "Energy that PV and the battery will not cover in the month — the generator must deliver it.",
        gdzie: "Monthly PV production (Module 3) minus demand (Module 2); later from the day-by-day simulation (Screen 1).",
        zakres: "Empty or 0 = month without a shortfall.",
      },
      moc: {
        nazwa: "Generator rated power [kW]",
        cel: "Gives the power at the optimal load, and from it the running hours.",
        gdzie: "Nameplate / generator datasheet (continuous, not peak power).",
        zakres: "The device datasheet.",
      },
      zuzycie: {
        nazwa: "Fuel use [l/h]",
        cel: "Turns running hours into litres of fuel.",
        gdzie: "Generator datasheet — consumption at 75–80% load.",
        zakres: "The device datasheet.",
      },
      cena: {
        nazwa: "Fuel price [{waluta}/l]",
        cel: "Turns litres into money.",
        gdzie: "Pump price / your last purchase.",
        zakres: "Your price.",
      },
      serwis: {
        nazwa: "Service and oil per running hour [{waluta}/h]",
        cel: "Cost of oil, filters and services spread over an hour of running.",
        gdzie: "Service cost ÷ service interval from the manual (e.g. oil change every X h).",
        zakres: "Empty = service cost not counted.",
      },
      zapas: {
        nazwa: "Fuel stock on site [l]",
        cel: "The fuel of every month is compared with it.",
        gdzie: "Capacity of the cans/tank you keep for the winter.",
        zakres: "Empty = the app only names the month with the longest running.",
      },
      horyzont: {
        nazwa: "Fuel stock horizon",
        cel: "How many days ahead to compare the entered stock with the need: 3, 7, 14 days, the whole month or your own number of days. Computed from the worst month (its average day × number of days, the generator delivers all the missing energy).",
        gdzie: "Your decision: how long you may be without a fuel delivery (snowed-in road, no station, travel).",
        zakres: "These are start options — the multi-year history (section below) gives more realistic numbers.",
      },
      horyzontDni: {
        nazwa: "Own number of days [days]",
        cel: "Your own fuel stock horizon when „Own number of days” is chosen.",
        gdzie: "Your decision — e.g. the time between fuel deliveries.",
        zakres: "From 1 to 366 days.",
      },
      histDane: {
        nazwa: "Production or irradiation of past years",
        cel: "From it the app computes the distribution of shortfalls, the worst window between deliveries and streaks of weak days — instead of one calendar month.",
        gdzie: "A multi-year series (e.g. PVGIS for the plot), measurements from the building's inverter or from your locality. One line = one year, from 1 January; „-” means no data for that day (it is not filled in).",
        zakres: "The more years and days, the narrower and more reliable the range; with one year it is just one observation.",
      },
      histZrodlo: {
        nazwa: "Data source of the history",
        cel: "A label shown with the result so it is clear what the estimate rests on (data from your own building is more accurate than general data from the area).",
        gdzie: "Choose where the pasted numbers come from.",
        zakres: "A choice from the list.",
      },
      histRodzaj: {
        nazwa: "What the values mean",
        cel: "Installation production is used as is; irradiation is converted to production with the installation power and the PR factor.",
        gdzie: "Depends on the data source (an inverter gives kWh, a weather series — kWh/m²).",
        zakres: "A choice from the list.",
      },
      histKwp: {
        nazwa: "PV installation power [kWp]",
        cel: "To convert irradiation to production: kWh = irradiation × kWp × PR.",
        gdzie: "The sum of the panel power from the design or nameplates.",
        zakres: "Your installation.",
      },
      histPr: {
        nazwa: "Installation performance ratio PR [0–1]",
        cel: "Covers the installation losses (temperature, inverter, cables, dirt) when converting irradiation to production.",
        gdzie: "From the design/simulation of the installation or from measurements (actual production ÷ ideal).",
        zakres: "Above 0 and at most 1; you enter the value — the app assumes none.",
      },
      histPopyt: {
        nazwa: "Average daily demand of the house [kWh/day]",
        cel: "Daily shortfall = demand − PV production of that day (not below 0). The same value is used for every month unless you choose to enter each month separately.",
        gdzie: "Module 2 (energy demand) or the meter: annual use ÷ 365, preferably for winter.",
        zakres: "Your house; usually higher in winter than the annual average.",
      },
      histPopytTryb: {
        nazwa: "How to enter the demand",
        cel: "In winter an off-grid house usually uses more (lighting, circulation pumps, heating) — one annual average understates the winter shortfall. Entering each month separately gives a more accurate result.",
        gdzie: "Choose „separately” when you know the consumption of each month (invoices, meter, the „Monthly consumption” screen).",
        zakres: "One average / separately for each month.",
      },
      histPopytMiesiac: {
        nazwa: "Average daily demand in the month [kWh/day]",
        cel: "The month's daily shortfall = demand − PV production of the day (not below 0).",
        gdzie: "The month's consumption (invoice, meter, the „Monthly consumption” screen) ÷ days in the month — the „Insert” button does it for you.",
        zakres: "≥ 0. All 12 months are needed.",
      },
      histOkno: {
        nazwa: "Window between fuel deliveries [days]",
        cel: "The length of the period the stock must last without a top-up. In every year of the history the worst such window is searched.",
        gdzie: "Your decision: how long you may be without a fuel delivery.",
        zakres: "From 1 to 366 days.",
      },
      histPercentyl: {
        nazwa: "Percentile for sizing the stock [%]",
        cel: "From the worst windows of every year it takes the value that this percent of the years did not exceed (nearest-rank method). A higher percentile = a bigger stock and fuel runs out less often. Empty = only min, median and max.",
        gdzie: "Your decision about the risk you accept.",
        zakres: "From 1 to 100; with a few years of data a high percentile is simply the worst year (the app says so).",
      },
      histProg: {
        nazwa: "Weak day threshold [% of demand]",
        cel: "A day is „weak” when PV covered less than this percent of that day's demand. Streaks of consecutive weak days are counted from it. Empty = streaks are not counted.",
        gdzie: "Your decision — e.g. days when PV gives less than half the need.",
        zakres: "From 1 to 100; the app imposes no threshold.",
      },
      histNoc: {
        nazwa: "Night share of consumption [% of the day]",
        cel: "What part of the daily consumption falls in hours without PV production (evening, night, early morning). That part is covered only by the store or the generator — not by the current sun. Empty = day and night counted together (the result may be too low, the app says so).",
        gdzie: "A meter with hourly split, a consumption profile from the energy supplier or your own evening/morning reading. The app assumes no value for you.",
        zakres: "From 0 to 100%.",
      },
      histMagPoj: {
        nazwa: "Energy store — usable capacity [kWh]",
        cel: "PV surplus from a good day charges the store and covers the shortfall of the following days before the generator starts — the fuel stock comes out smaller than in the balance without a store. Empty = balance without a store.",
        gdzie: "The capacity you may really use (after the allowed depth of discharge) — datasheet or the Module 4 screens.",
        zakres: "≥ 0 kWh. In this balance the generator does not charge the store (generator charging is calculated on the \"Charging the store from the generator\" screen); a day without data empties the store — fill in missing days if you have data for them.",
      },
      histMagSpr: {
        nazwa: "Store round-trip efficiency [%]",
        cel: "What share of the PV surplus comes back from the store as energy (charge + discharge). The app assumes no value for you — without it the result waits.",
        gdzie: "Store / inverter datasheet (round-trip efficiency).",
        zakres: "From 1 to 100%.",
      },
      histMagStan: {
        nazwa: "Store state on 1 January [% of capacity]",
        cel: "The state of charge every year of the history starts from. Empty or 0 = empty store — safe side.",
        gdzie: "Your assumption about the typical state at the turn of the year.",
        zakres: "From 0 to 100%.",
      },
      histBrak: {
        nazwa: "Missing day of the history",
        cel: "The value of a day missing from the data (PVGIS, a file or telemetry). After \"Fill in\" it replaces the \"-\" in the history, and windows and streaks with this day are no longer skipped.",
        gdzie: "Only if you have a real value: the inverter's daily counter, the manufacturer's app, your own notes. Without data leave it empty — the app inserts nothing for you.",
        zakres: "≥ 0, in the unit of the history (kWh/day for PV production, kWh/m²/day for irradiation).",
      },
      telZrodlo: {
        nazwa: "Telemetry source",
        cel: "The source of measurements stored in the app (CSV import, device, live mode) from which the building's daily PV production history is built.",
        gdzie: "Sources are added on the \"Telemetry sources\" screen; measurements come from a CSV import or live reading.",
        zakres: "One of the sources on the list.",
      },
      telKanal: {
        nazwa: "PV power channel",
        cel: "The channel whose power [W] is the PV production (e.g. the MPPT or PV inverter output). A day's energy is the integral of this power over time.",
        gdzie: "The channel name from the file or device — the same as on the \"Telemetry summary\" screen.",
        zakres: "A channel with power samples.",
      },
      telPrzerwa: {
        nazwa: "Longest gap between samples [min]",
        cel: "Up to this gap energy is counted between neighbouring samples; a longer gap is unknown and is not bridged. A day gets a value only when the samples cover all of it — otherwise it stays a missing day to fill in.",
        gdzie: "Your logger's recording step with a margin for single lost samples — it depends on the device, the app does not guess it.",
        zakres: "> 0 min.",
      },
      pvgisLat: {
        nazwa: "Latitude of the plot [°]",
        cel: "The place for which PVGIS will give the archived irradiation day by day.",
        gdzie: "A map or the phone GPS on the plot; in Poland usually 49–55 (N).",
        zakres: "From -90 to 90; decimal point. PVGIS has data only for land within its coverage.",
      },
      pvgisLon: {
        nazwa: "Longitude of the plot [°]",
        cel: "The second coordinate of the place the data is fetched for.",
        gdzie: "A map or the phone GPS on the plot; in Poland usually 14–24 (E).",
        zakres: "From -180 to 180; decimal point.",
      },
      pvgisNach: {
        nazwa: "Panel tilt [°]",
        cel: "PVGIS computes the irradiation on the plane of your panels, not on a horizontal one — in winter the difference is large.",
        gdzie: "From the mounting-structure design or measured with a protractor; 0 = panel lying flat, 90 = vertical.",
        zakres: "From 0 to 90; you enter the value — the app assumes none.",
      },
      pvgisAzym: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face — together with the tilt it sets how much sun they catch.",
        gdzie: "From a compass or a map. PVGIS convention: 0 = south, 90 = west, -90 = east, 180 = north.",
        zakres: "From -180 to 180; this is not a compass bearing measured from north.",
      },
      pvgisOd: {
        nazwa: "First year of the history",
        cel: "Start of the range of years fetched from PVGIS; more years = a more reliable distribution but a longer download.",
        gdzie: "Your decision.",
        zakres: "From 2005 to 2023 (the range of the PVGIS-SARAH3 database in the version used) and not later than the last year.",
      },
      pvgisDo: {
        nazwa: "Last year of the history",
        cel: "End of the range of years fetched from PVGIS.",
        gdzie: "Your decision.",
        zakres: "From 2005 to 2023 and not earlier than the first year.",
      },
    },
  },
  "raport-kryzysowy": {
    "migawka": {
      "oCoChodzi": "The crisis report is the protocol after the winter dress rehearsal: one sheet with all the stress-test results side by side.",
      "jakDziala": "The screen reads what you saved on the Frost simulation, Monthly shortfalls and generator, Blackout and Winter Safety Coefficient screens and puts it together in one place. A part whose screen has not been filled in yet is marked as missing — never as zero.",
      "poCo": "You see in one place how many days with a shortfall the frost causes, how much generator work and fuel that costs, whether the store survives the days without sun and which safety component is the weakest — and at the end you can print it or save it as a PDF.",
      "fizyka": "The report calculates nothing with a model of its own: each part is the result of that screen's engine from its saved draft. Worst-month coverage = production ÷ demand (capped at 100%), shortfall = demand − production. The Winter Safety Coefficient is the weighted mean of the five components from Screen 12 (provisional weights, to be reworked)."
    },
    "pola": {
      "liczbaDzis": {
        "nazwa": "Panels you have today",
        "cel": "From this number I work out how much energy one panel gives in the worst month (production from the coefficient screen ÷ number of panels), and from that how many panels to add to cover the shortfall.",
        "gdzie": "Count the panels installed today. Use it when you do not know the yield of one panel; if you also give the yield, the yield is used.",
        "zakres": "A whole number from 1. It assumes identical panels in the same setting. Empty = no conversion to a number of panels."
      },
      "uzyskPanelu": {
        "nazwa": "Yield of one panel in the worst month",
        "cel": "I divide the energy shortfall of the worst month by it and round up to whole panels.",
        "gdzie": "From the “Winter” tab of the panel comparison (the energy of one panel in the winter months) or from your own measurement.",
        "zakres": "A positive number of kWh. It takes precedence over the number of panels. Empty = no conversion to a number of panels."
      }
    }
  },
  "symulacja-mrozu": {
    "migawka": {
      "oCoChodzi": "A winter dress rehearsal: the same frost all month, a different weather every day — and we check how many days the system manages without a generator.",
      "jakDziala": "Pick the month and enter the panel power and orientation and the household consumption. For each temperature scenario the app rebuilds the daily heat of the building (from Module 6, Screen 1), adds it to the consumption, lowers the battery capacity by the datasheet derating and runs the balance day by day on the PV production from the TMY data of your location.",
      "poCo": "The annual average hides freezing weeks. Here you see which days run short of energy, how much is missing in total and whether the deficits come in runs — that decides which generator and how much fuel you need.",
      "fizyka": "Q_day = max(0, H_ext·(θi − θe) + Φ_fixed)·24 h; E_el = Q/COP; D = E_base + E_el + E_extra; C_eff = C·(1 − s/100); day deficit = max(0, D − P_PV − energy from the store). Day production = Σ G_poa·Δt/1000 · kWp · PR. Constant temperature through the month, constant COP within a scenario — a simplification."
    },
    "pola": {
      "miesiac": {
        "nazwa": "Month to simulate",
        "cel": "The days of this month in the TMY data are the PV production profile the balance runs on.",
        "gdzie": "Usually the coldest month: December or January.",
        "zakres": "Required; days of a typical meteorological year, not a forecast."
      },
      "mocKwp": {
        "nazwa": "Panel power [kWp]",
        "cel": "Scales the in-plane irradiance to electric energy.",
        "gdzie": "Sum of the rated powers of the panels from the datasheets or the design.",
        "zakres": "Your installation; required > 0."
      },
      "pr": {
        "nazwa": "Performance ratio PR [-]",
        "cel": "Covers inverter, cable, temperature and soiling losses.",
        "gdzie": "From the design or measurements of your own installation; the app does not guess it.",
        "zakres": "Usually 0.6–0.9; required > 0."
      },
      "nachylenieDeg": {
        "nazwa": "Panel tilt [°]",
        "cel": "The angle decides how much winter sun falls on the panel.",
        "gdzie": "Measurement on the roof or the mounting design.",
        "zakres": "0° = flat, 90° = vertical."
      },
      "azymutDeg": {
        "nazwa": "Panel azimuth [°]",
        "cel": "The direction the panels face — it affects the winter production.",
        "gdzie": "Compass or roof plan: N = 0°, E = 90°, S = 180°, W = 270°.",
        "zakres": "0–360°."
      },
      "korektaProdukcjiPct": {
        "nazwa": "PV production correction [%]",
        "cel": "Lowers (negative) or raises the production, e.g. for frost and snow on the panels.",
        "gdzie": "Your own estimate or the result of the snow and icing screens; empty = no correction.",
        "zakres": "−100…100%; negative = less energy."
      },
      "zuzycieBazoweDobaKwh": {
        "nazwa": "Daily consumption without heating [kWh/day]",
        "cel": "The household's electricity without heating, the same in every scenario.",
        "gdzie": "Module 2 (loads) or a summer bill when the house does not heat with electricity.",
        "zakres": "Your consumption; required ≥ 0."
      },
      "dodatkoweZuzycieDobaKwh": {
        "nazwa": "Extra consumption caused by frost [kWh/day]",
        "cel": "BMS heaters, defrost, pipe heating and other loads switched on by the frost.",
        "gdzie": "Device datasheets or measurement; empty = no extra loads.",
        "zakres": "≥ 0."
      },
      "cop": {
        "nazwa": "General COP of the heat source",
        "cel": "How much heat comes from 1 kWh of electricity; replaces the COP from Screen 1 when you type it.",
        "gdzie": "Heat pump datasheet at the scenario's outdoor temperature; heater = 1.",
        "zakres": "> 0; the heat pump COP falls with the frost."
      },
      "magazynKwh": {
        "nazwa": "Usable store capacity [kWh]",
        "cel": "The store carries the PV surplus from sunny days to sunless ones.",
        "gdzie": "Battery datasheet: capacity within the allowed depth of discharge. Empty or 0 = no store.",
        "zakres": "≥ 0; at ordinary temperature, before the derating."
      },
      "magazynSprawnoscPct": {
        "nazwa": "Store charging efficiency [%]",
        "cel": "The share of the surplus that reaches the battery; the rest is lost.",
        "gdzie": "Battery and inverter datasheet (round-trip efficiency).",
        "zakres": "Required when a capacity is given; 0–100%."
      },
      "magazynStanPoczatkowyPct": {
        "nazwa": "State of charge at the start of the month [%]",
        "cel": "Where the balance starts; empty = 0%, the safe side.",
        "gdzie": "Your own estimate after the previous month.",
        "zakres": "0–100%."
      },
      "udzialNocyPct": {
        "nazwa": "Share of consumption at night [%]",
        "cel": "The part of the consumption in hours without sun — supplied from the store only.",
        "gdzie": "The household's daily profile (Module 2); empty = day and night of one day are not separated.",
        "zakres": "0–100%."
      },
      "scenariuszTemperaturaC": {
        "nazwa": "Scenario temperature [°C]",
        "cel": "Constant outdoor temperature for the whole month in this scenario.",
        "gdzie": "−20 and −30 °C by default; you can enter your own, e.g. the design temperature of the zone.",
        "zakres": "−60…20 °C; up to 6 scenarios."
      },
      "scenariuszCop": {
        "nazwa": "COP in this scenario",
        "cel": "The heat pump COP at the scenario temperature; empty = the general COP.",
        "gdzie": "Capacity and COP chart or table from the heat pump datasheet at this outdoor temperature.",
        "zakres": "> 0."
      },
      "scenariuszSpadekPojemnosciPct": {
        "nazwa": "Battery capacity drop in the frost [%]",
        "cel": "Cells deliver less energy in the frost than at room temperature.",
        "gdzie": "Cell datasheet: capacity versus temperature. The source's example (−20% at −20 °C) is only an illustration; empty = no drop.",
        "zakres": "0–99%."
      }
    }
  },
  "ladowanie-z-agregatu": {
    "migawka": {
      "oCoChodzi": "A generator charging the store is like a tap filling a bathtub while someone scoops water out with a bucket — only what is left flows into the tub.",
      "jakDziala": "Enter the generator power, the charger/inverter charging power, the emergency-line load power, the store capacity, the start and stop SOC thresholds and the charging efficiency. The app calculates the charging power, the generator load, the run time per cycle and — once you give the datasheet consumption — the fuel and cost.",
      "poCo": "The daily balance (Monthly deficits) does not know how many kW are left for charging at a given moment. Here you see whether the generator has any margin for charging at all, at what load it runs (the datasheet l/h depends on it) and how many hours and litres one cycle costs.",
      "fizyka": "P_ch = min(P_charger, P_generator − P_loads); E = (SOC_stop − SOC_start)/100 · C; AC energy = E/η; t = E_AC / P_ch; fuel = t · q [l/h]. Load = (P_loads + P_ch)/P_generator. Near the end of charging (constant-voltage phase) the charging power drops — the real time is longer."
    },
    "pola": {
      "mocAgregatuKw": {
        "nazwa": "Generator rated (continuous) power [kW]",
        "cel": "Upper limit of the power the generator gives the loads and the charger together.",
        "gdzie": "Rating plate / datasheet — continuous power (not peak).",
        "zakres": "Your generator; required > 0."
      },
      "mocLadowarkiKw": {
        "nazwa": "Charging power from the generator [kW]",
        "cel": "The maximum the charger/inverter draws from the generator to charge the store.",
        "gdzie": "Inverter/charger datasheet (max charging current × store voltage, or the set AC-input current limit).",
        "zakres": "Your device; required > 0."
      },
      "mocOdbiornikowKw": {
        "nazwa": "Power of the emergency-line loads [kW]",
        "cel": "Loads running during charging take part of the generator's power.",
        "gdzie": "Sum of the emergency-line loads running at that time (Module 2, measurement).",
        "zakres": "0 = no loads; constant throughout the cycle."
      },
      "pojemnoscKwh": {
        "nazwa": "Usable store capacity [kWh]",
        "cel": "Converts the SOC threshold difference into the energy to charge.",
        "gdzie": "Store datasheet × permitted DoD (Module 4).",
        "zakres": "Your store; required > 0."
      },
      "socStartPct": {
        "nazwa": "Generator start SOC threshold [%]",
        "cel": "The generator starts at this state of charge.",
        "gdzie": "Inverter/generator controller settings.",
        "zakres": "0–100%, lower than the stop threshold."
      },
      "socStopPct": {
        "nazwa": "Generator stop SOC threshold [%]",
        "cel": "The generator charges the store up to this state of charge.",
        "gdzie": "Inverter/generator controller settings.",
        "zakres": "0–100%, higher than the start threshold."
      },
      "sprawnoscLadowaniaPct": {
        "nazwa": "Charging efficiency AC → store [%]",
        "cel": "Part of the generator energy lost in the charger and store while charging.",
        "gdzie": "Charger/inverter datasheet — charging efficiency (not the charge+discharge round-trip efficiency).",
        "zakres": "Greater than 0, at most 100%."
      },
      "zuzyciePaliwaLH": {
        "nazwa": "Fuel consumption [l/h]",
        "cel": "Calculates the fuel and cost of the cycle.",
        "gdzie": "Generator datasheet — the row for the load closest to the one shown in the result.",
        "zakres": "Empty = fuel is not calculated (the app shows at what load to read it)."
      },
      "cenaPaliwaZlL": {
        "nazwa": "Fuel price [{waluta}/l]",
        "cel": "Calculates the cost of the cycle.",
        "gdzie": "Your purchase price.",
        "zakres": "Empty = cost is not calculated."
      }
    }
  },
  "okno-sloneczne": {
    "migawka": {
      "oCoChodzi": "In winter the sun is like a short visit — you must use every minute before it leaves.",
      "jakDziala": "Enter how much PV energy the solar window gives, how much the house uses in that time, the battery and the tank. The app splits the rest in the source's order: BMS heaters (if the battery needs heating), battery to {prog}%, tank, battery to 100%, and finally surplus loads.",
      "poCo": "Before the night you know how much energy will be in the battery and whether to run the washing machine today or tomorrow.",
      "fizyka": "Tank: Q = V·ΔT·c (the same water constant as Module 2). SoC_end = SoC_0 + E_bat / C. The source example “4.5 kWh → battery 65% and tank 50 °C” contradicts the rule “tank only above 80%” — the app follows the rule."
    },
    "pola": {
      "produkcja": {
        "nazwa": "PV production in the solar window [kWh]",
        "cel": "Energy to split.",
        "gdzie": "Module 3 (hourly production) or the weather forecast for the sunny hours.",
        "zakres": "Your installation."
      },
      "zuzycie": {
        "nazwa": "House consumption during the window [kWh]",
        "cel": "Loads running in that time are supplied first.",
        "gdzie": "Module 2 — consumption in those hours.",
        "zakres": "Empty = 0."
      },
      "pojemnosc": {
        "nazwa": "Usable battery capacity [kWh]",
        "cel": "Turns energy into SoC percent.",
        "gdzie": "Battery datasheet × allowed DoD (Module 4).",
        "zakres": "The device datasheet."
      },
      "soc": {
        "nazwa": "State of charge at the start of the window [%]",
        "cel": "Decides when energy goes to the tank.",
        "gdzie": "BMS/inverter display.",
        "zakres": "0–100%."
      },
      "grzalki": {
        "nazwa": "BMS heater energy before charging [kWh]",
        "cel": "A LiFePO4 battery below 0 °C will not accept charge until the heaters warm it.",
        "gdzie": "Heating pad power × warm-up time (Module 4).",
        "zakres": "Empty = the battery needs no heating."
      },
      "bojlerL": {
        "nazwa": "Tank volume [l]",
        "cel": "Gives the heat to warm the water.",
        "gdzie": "Tank nameplate.",
        "zakres": "Empty = no tank."
      },
      "tStart": {
        "nazwa": "Water temperature now [°C]",
        "cel": "Starting point of heating.",
        "gdzie": "Tank thermometer/controller.",
        "zakres": "Your measurement."
      },
      "tCel": {
        "nazwa": "Target water temperature [°C]",
        "cel": "How warm you want the water from the sun.",
        "gdzie": "Thermostat setting.",
        "zakres": "Your setting."
      }
    }
  },
  "snieg-na-pv": {
    "migawka": {
      "oCoChodzi": "A covered panel is a dead panel, and wind spreads snow unevenly — you need to know not only how much but where it settles.",
      "jakDziala": "Choose the deposit type, enter the panel tilt and the normal daily production. The app shows a “what if” table — the energy lost for 1, 3, 5 and 7 days of cover (you do not have to know the days or the percentage; own numbers are optional), says whether dry snow will slide off (tilt above {prog}°) and compares ways to deal with it: tilt, manual clearing, automatic systems, and a heating cable and film with an energy balance.",
      "poCo": "You know how much energy the battery or generator must replace and what is actually worth doing with the panels — before you buy heating that uses more than it recovers.",
      "fizyka": "E = E_day · days · (1 − p). The percentage p is a source example (snow and ice 0%, rime about 5%) unless you enter your own. Dry snow slides off above {prog}° (the same threshold as Module 3 “Cleanliness and snow”). Heating: use = P · h, recovery = E_day · (1 − p) · (days − h/24); it pays back when recovery ≥ use."
    },
    "pola": {
      "rodzaj": {
        "nazwa": "Deposit type",
        "cel": "Decides whether the deposit can clear by itself.",
        "gdzie": "Observation or forecast (dry snow, wet snow, freezing rain).",
        "zakres": "Dry, wet, glaze/frost, rime."
      },
      "kat": {
        "nazwa": "Panel tilt [°]",
        "cel": "Above {prog}° dry snow may slide off by itself.",
        "gdzie": "Installation design (Module 3).",
        "zakres": "0–90°."
      },
      "produkcja": {
        "nazwa": "Production per day without deposit [kWh]",
        "cel": "Energy the clean panels would give.",
        "gdzie": "Module 3 — this month's production ÷ number of days.",
        "zakres": "Your installation."
      },
      "dni": {
        "nazwa": "Your own days covered [days] (optional)",
        "cel": "Adds your own row to the table and is the scenario the heating options are judged against.",
        "gdzie": "Observation or thaw forecast; leave empty if you do not know (source example: at −5 °C snow stays about 3 days).",
        "zakres": "Greater than zero; empty = the table for 1, 3, 5 and 7 days."
      },
      "pozostala": {
        "nazwa": "Your own production under the deposit [% of normal] (optional)",
        "cel": "What part of the light passes through the deposit; replaces the source example.",
        "gdzie": "Inverter observation; leave empty if you do not know (source example: snow 0%, rime after 48 h about 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Total panel area [m²]",
        "cel": "Multiplies the W/m² power of the cable and the film.",
        "gdzie": "Installation design (Module 3) or the size of one panel × number of panels.",
        "zakres": "Greater than zero for the cable and the film."
      },
      "kabelMoc": {
        "nazwa": "Heating cable power [W/m²]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The cable's datasheet — the app does not guess this value.",
        "zakres": "Greater than zero."
      },
      "kabelGodz": {
        "nazwa": "Cable hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it heats, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      },
      "foliaMoc": {
        "nazwa": "Heating film power [W/m²]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The film's datasheet — the app does not guess this value.",
        "zakres": "Greater than zero."
      },
      "foliaGodz": {
        "nazwa": "Film hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it heats, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      },
      "automatMoc": {
        "nazwa": "Automatic cleaning system power [W]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The system's datasheet — this is the total power, not per m².",
        "zakres": "Greater than zero."
      },
      "automatGodz": {
        "nazwa": "System hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it runs, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      },
      "nierowno": {
        "nazwa": "Strings covered unevenly",
        "cel": "Uneven cover of the strings causes voltage differences (mismatch).",
        "gdzie": "Roof planes facing different directions, the leeward side, roof valleys.",
        "zakres": "Yes / no."
      }
    }
  },
  "szadz-na-pv": {
    "migawka": {
      "oCoChodzi": "Fog is a silent panel killer — it freezes on them like icing on glass and, unlike snow, does not fall off by itself.",
      "jakDziala": "Enter the normal daily production. The app shows a “what if” table — the energy lost for 1, 2 (the 48 h of the source example), 3, 5 and 7 days of fog with rime — and compares ways to deal with it, including the energy balance of heating. Own days and own production percentage are optional.",
      "poCo": "A few days of fog can take almost all production — you know how much the battery and generator must cover, and whether heating the panels pays off at all.",
      "fizyka": "E = E_day · days · (1 − p). Source example: after 48 h of fog and rime production drops to 5% of nominal (p = 5%). Rime does not slide off by itself, so a steeper tilt does not help. Heating: use = P · h, recovery = E_day · (1 − p) · (days − h/24)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Production per day without rime [kWh]",
        "cel": "Energy the clean panels would give.",
        "gdzie": "Module 3 — this month's production ÷ number of days.",
        "zakres": "Your installation."
      },
      "dni": {
        "nazwa": "Your own days covered [days] (optional)",
        "cel": "Adds your own row to the table and is the scenario the heating options are judged against.",
        "gdzie": "Observation or thaw forecast; leave empty if you do not know (source example: at −5 °C snow stays about 3 days).",
        "zakres": "Greater than zero; empty = the table for 1, 3, 5 and 7 days."
      },
      "pozostala": {
        "nazwa": "Your own production under the deposit [% of normal] (optional)",
        "cel": "What part of the light passes through the deposit; replaces the source example.",
        "gdzie": "Inverter observation; leave empty if you do not know (source example: snow 0%, rime after 48 h about 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Total panel area [m²]",
        "cel": "Multiplies the W/m² power of the cable and the film.",
        "gdzie": "Installation design (Module 3) or the size of one panel × number of panels.",
        "zakres": "Greater than zero for the cable and the film."
      },
      "kabelMoc": {
        "nazwa": "Heating cable power [W/m²]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The cable's datasheet — the app does not guess this value.",
        "zakres": "Greater than zero."
      },
      "kabelGodz": {
        "nazwa": "Cable hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it heats, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      },
      "foliaMoc": {
        "nazwa": "Heating film power [W/m²]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The film's datasheet — the app does not guess this value.",
        "zakres": "Greater than zero."
      },
      "foliaGodz": {
        "nazwa": "Film hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it heats, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      },
      "automatMoc": {
        "nazwa": "Automatic cleaning system power [W]",
        "cel": "It gives the energy needed to clear the panels.",
        "gdzie": "The system's datasheet — this is the total power, not per m².",
        "zakres": "Greater than zero."
      },
      "automatGodz": {
        "nazwa": "System hours of operation to clear [h]",
        "cel": "Multiplies the power — the longer it runs, the more energy it uses.",
        "gdzie": "Manufacturer's instructions or your own experience.",
        "zakres": "Greater than zero."
      }
    }
  },
  "wspolczynnik-bezpieczenstwa-zimowego": {
    "migawka": {
      "oCoChodzi": "It is an exam grade — it shows whether the system will pass the winter or need a retake, and exactly because of what.",
      "jakDziala": "Enter (or insert from the other winter screens) five groups of data: energy coverage in the worst month, days of autonomy, the number of single points of failure, generator power and the freeze-protection time. Each component gets a 0–100% score and the factor is a weighted mean. Next to the result you see the weakest component (the weakest link) and the order of the components; weak points — when you enter a threshold.",
      "poCo": "One number tells whether things are fine; the list of weak points tells what to fix first.",
      "fizyka": "W = Σ wᵢ·sᵢ / Σ wᵢ, where sᵢ = min(100%, what the system has ÷ what the scenario needs). The weights (30/25/20/15/10%) are provisional — to be refined by the app owner; you can enter your own (sum 100%). A component below the threshold you enter is a weak point; without a threshold you only see the order from the weakest."
    },
    "pola": {
      "prog": {
        "nazwa": "Weak-point threshold [%]",
        "cel": "A component scoring below this threshold is marked as a weak point (🟡). Without a threshold you only see the components ordered from the weakest.",
        "gdzie": "Your decision — how cautiously you want to rate the installation. The source gives no threshold (example: 74% = “good, but there are weak points”).",
        "zakres": "From 0 to 100%. Empty = no threshold.",
      },
      "produkcja": {
        "nazwa": "PV production in the worst month [kWh]",
        "cel": "How much energy the panels give in the hardest month of winter.",
        "gdzie": "Module 3 — monthly production (usually December or January); or the button from Screen 2.",
        "zakres": "Your installation; 0 = no production."
      },
      "zapotrzebowanie": {
        "nazwa": "Demand in the same month [kWh]",
        "cel": "What the production is compared with.",
        "gdzie": "Module 2 — monthly consumption (in winter including heating).",
        "zakres": "Greater than zero."
      },
      "autonomia": {
        "nazwa": "Days of operation without sun [days]",
        "cel": "How long the system runs from the battery (and generator) when PV produces nothing.",
        "gdzie": "Screen 4 “Blackout” (the button inserts the result) or Module 4 “Days of autonomy”.",
        "zakres": "From 0 to the required days; more does not raise the score."
      },
      "wymaganaAutonomia": {
        "nazwa": "Required days without sun [days]",
        "cel": "How many days without sun the system has to survive.",
        "gdzie": "Your decision; the Blackout scenario in the source is 10–14 days.",
        "zakres": "Greater than zero."
      },
      "komponenty": {
        "nazwa": "Number of components checked",
        "cel": "The base for the share of components with redundancy.",
        "gdzie": "Screen 10 “SPOF analysis” (the button inserts the numbers) — list: BMS, inverter, fuses, MPPT, pumps, sensors.",
        "zakres": "A whole number, at least 1."
      },
      "spof": {
        "nazwa": "Components without redundancy (SPOF)",
        "cel": "The fewer there are, the higher the resistance to failures.",
        "gdzie": "Screen 10 — components without redundancy ticked.",
        "zakres": "From 0 to the number of components checked."
      },
      "brakAgregatu": {
        "nazwa": "I have no generator",
        "cel": "Without a generator the “generator power margin” component is 0%.",
        "gdzie": "Your installation.",
        "zakres": "Yes or no."
      },
      "mocAgregatu": {
        "nazwa": "Generator power [kW]",
        "cel": "How much power the generator gives.",
        "gdzie": "The generator's rating plate; Screen 2 (button).",
        "zakres": "Greater than zero."
      },
      "mocWymagana": {
        "nazwa": "Power the generator must carry [kW]",
        "cel": "What the generator power is compared with.",
        "gdzie": "Peak power of the loads fed from the generator plus the battery charger — Module 2.",
        "zakres": "Greater than zero."
      },
      "okno": {
        "nazwa": "Freeze protection time [h]",
        "cel": "How long the installation itself keeps freeze protection running (critical loads).",
        "gdzie": "Screen 6 “Freeze protection” (the button inserts the supply time of the critical loads).",
        "zakres": "At least 0; more than the reaction time does not raise the score."
      },
      "wymaganyCzas": {
        "nazwa": "Time you need to react [h]",
        "cel": "How much time you need to react: arrive, start the generator, drain the water.",
        "gdzie": "Your estimate — depends on where you are when the system fails.",
        "zakres": "Greater than zero."
      },
      "wlasneWagi": {
        "nazwa": "Own weights",
        "cel": "Lets you replace the provisional weights with your own.",
        "gdzie": "Your decision — how important each component is to you.",
        "zakres": "The weights must add up to 100%."
      },
      "waga": {
        "nazwa": "Component weight [%]",
        "cel": "How strongly the component affects the final result.",
        "gdzie": "Default 30/25/20/15/10% (provisional, to be refined by the app owner); here you enter your own.",
        "zakres": "0–100%, all together 100%."
      }
    }
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "deficyty-miesieczne": {
    migawka: {
      oCoChodzi: "Это кошелёк зимы — вы знаете, сколько реально потратите на топливо, ещё до морозов, а не узнаёте об этом посреди зимы.",
      jakDziala: "Для каждого месяца с дефицитом: часы работы = дефицит ÷ (мощность × {procent}%), топливо = часы × расход, стоимость = топливо × цена + часы × ставка сервиса. С запасом топлива — сравнение по месяцам или с выбранным горизонтом (3, 7, 14 дней, месяц, своё число дней). С многолетней историей приложение считает реалистично: распределение дефицитов, худшее окно между поставками в каждом году и серии слабых суток, а запас подбирает по выбранному процентилю.",
      poCo: "Вы планируете запас топлива, поставки и бюджет на весь сезон, а не только на худший месяц.",
      fizyka: "t = D ÷ (P × {procent}%) — генератор работает экономичнее всего при 70–80% мощности (источник); принята верхняя граница, как в Модуле 2. Пример источника: 120 кВт·ч ÷ (5 кВт × 0,8) = 30 ч.",
    },
    pola: {
      deficyt: {
        nazwa: "Дефицит энергии в месяце [кВт·ч]",
        cel: "Энергия, которую PV и батарея не покроют в этом месяце, — её должен дать генератор.",
        gdzie: "Выработка PV за месяц (Модуль 3) минус потребление (Модуль 2); в будущем — из посуточной симуляции (Экран 1).",
        zakres: "Пусто или 0 = месяц без дефицита.",
      },
      moc: {
        nazwa: "Номинальная мощность генератора [кВт]",
        cel: "Из неё считается мощность при оптимальной нагрузке, а из неё — часы работы.",
        gdzie: "Табличка / паспорт генератора (длительная, не пиковая мощность).",
        zakres: "Паспорт устройства.",
      },
      zuzycie: {
        nazwa: "Расход топлива [л/ч]",
        cel: "Переводит часы работы в литры топлива.",
        gdzie: "Паспорт генератора — расход при нагрузке 75–80%.",
        zakres: "Паспорт устройства.",
      },
      cena: {
        nazwa: "Цена топлива [{waluta}/л]",
        cel: "Переводит литры в деньги.",
        gdzie: "Цена на заправке / последней покупки.",
        zakres: "Ваша цена.",
      },
      serwis: {
        nazwa: "Сервис и масло на моточас [{waluta}/ч]",
        cel: "Стоимость масла, фильтров и обслуживания на час работы.",
        gdzie: "Стоимость обслуживания ÷ сервисный интервал из инструкции (например, замена масла каждые X ч).",
        zakres: "Пусто = стоимость сервиса не учитывается.",
      },
      zapas: {
        nazwa: "Запас топлива на месте [л]",
        cel: "С ним сравнивается топливо каждого месяца.",
        gdzie: "Объём канистр/бака, который вы держите на зиму.",
        zakres: "Пусто = приложение укажет только месяц с самой долгой работой.",
      },
      horyzont: {
        nazwa: "Горизонт запаса топлива",
        cel: "На сколько дней вперёд сравнить введённый запас с потребностью: 3, 7, 14 дней, весь месяц или своё число дней. Считается по худшему месяцу (его средние сутки × число дней, генератор даёт всю недостающую энергию).",
        gdzie: "Ваше решение: как долго вы можете остаться без поставки топлива (занесённая дорога, нет заправки, поездка).",
        zakres: "Это стартовые варианты — более реалистичные числа даёт многолетняя история (раздел ниже).",
      },
      horyzontDni: {
        nazwa: "Своё число дней [дн.]",
        cel: "Свой горизонт запаса топлива, когда выбрано «Своё число дней».",
        gdzie: "Ваше решение — например, время между поставками топлива.",
        zakres: "От 1 до 366 дней.",
      },
      histDane: {
        nazwa: "Выработка или инсоляция прошлых лет",
        cel: "Из них приложение считает распределение дефицитов, худшее окно между поставками и серии слабых суток — вместо одного месяца из календаря.",
        gdzie: "Многолетний ряд (например, PVGIS для участка), измерения с инвертора здания или из вашего населённого пункта. Одна строка = год, с 1 января; «-» означает отсутствие данных за день (не заполняется).",
        zakres: "Чем больше лет и суток, тем уже и надёжнее диапазон; при одном годе это лишь одно наблюдение.",
      },
      histZrodlo: {
        nazwa: "Источник данных истории",
        cel: "Метка у результата, чтобы было видно, на чём основана оценка (данные из вашего здания точнее общих данных по округе).",
        gdzie: "Выберите, откуда взяты вставленные числа.",
        zakres: "Выбор из списка.",
      },
      histRodzaj: {
        nazwa: "Что означают значения",
        cel: "Выработка установки используется как есть; инсоляция пересчитывается в выработку через мощность установки и коэффициент PR.",
        gdzie: "Зависит от источника данных (инвертор даёт кВт·ч, погодный ряд — кВт·ч/м²).",
        zakres: "Выбор из списка.",
      },
      histKwp: {
        nazwa: "Мощность PV-установки [кВп]",
        cel: "Для пересчёта инсоляции в выработку: кВт·ч = инсоляция × кВп × PR.",
        gdzie: "Сумма мощности панелей из проекта или шильдиков.",
        zakres: "Ваша установка.",
      },
      histPr: {
        nazwa: "Коэффициент производительности установки PR [0–1]",
        cel: "Учитывает потери установки (температура, инвертор, кабели, загрязнение) при пересчёте инсоляции в выработку.",
        gdzie: "Из проекта/симуляции установки или из измерений (фактическая выработка ÷ идеальная).",
        zakres: "Больше 0 и не более 1; значение вводите вы — приложение ничего не предполагает.",
      },
      histPopyt: {
        nazwa: "Среднесуточное потребление дома [кВт·ч/сут]",
        cel: "Суточный дефицит = потребление − выработка PV этих суток (не меньше 0). Одно и то же значение используется для каждого месяца, если вы не выберете ввод отдельно для каждого месяца.",
        gdzie: "Модуль 2 (потребление энергии) или счётчик: годовой расход ÷ 365, лучше для зимы.",
        zakres: "Ваш дом; зимой обычно выше среднегодового.",
      },
      histPopytTryb: {
        nazwa: "Как ввести потребление",
        cel: "Зимой автономный дом обычно потребляет больше (свет, циркуляционные насосы, отопление) — одно среднегодовое значение занижает зимний дефицит. Ввод отдельно для каждого месяца даёт более точный результат.",
        gdzie: "Выберите «отдельно», если знаете потребление по месяцам (счета, счётчик, экран «Помесячное потребление»).",
        zakres: "Одно среднее / отдельно для каждого месяца.",
      },
      histPopytMiesiac: {
        nazwa: "Среднесуточное потребление в месяце [кВт·ч/сут]",
        cel: "Суточный дефицит месяца = потребление − выработка PV суток (не меньше 0).",
        gdzie: "Потребление месяца (счёт, счётчик, экран «Помесячное потребление») ÷ число дней месяца — кнопка «Вставить» сделает это за вас.",
        zakres: "≥ 0. Нужны все 12 месяцев.",
      },
      histOkno: {
        nazwa: "Окно между поставками топлива [дн.]",
        cel: "Длина периода, на который запас должен хватить без пополнения. В каждом году истории ищется худшее такое окно.",
        gdzie: "Ваше решение: как долго вы можете быть без поставки топлива.",
        zakres: "От 1 до 366 дней.",
      },
      histPercentyl: {
        nazwa: "Процентиль для подбора запаса [%]",
        cel: "Из худших окон каждого года берётся значение, которое не превысил этот процент лет (метод ближайшего ранга). Выше процентиль — больше запас и реже кончается топливо. Пусто = только мин, медиана и макс.",
        gdzie: "Ваше решение о риске, который вы принимаете.",
        zakres: "От 1 до 100; при нескольких годах данных высокий процентиль — просто худший год (приложение это отметит).",
      },
      histProg: {
        nazwa: "Порог слабых суток [% потребления]",
        cel: "Сутки «слабые», когда PV покрыла меньше этого процента потребления этих суток. Из этого считаются серии подряд слабых суток. Пусто = серии не считаются.",
        gdzie: "Ваше решение — например, сутки, когда PV даёт меньше половины потребности.",
        zakres: "От 1 до 100; приложение не навязывает порог.",
      },
      histNoc: {
        nazwa: "Доля ночного потребления [% суток]",
        cel: "Какая часть суточного потребления приходится на часы без выработки PV (вечер, ночь, раннее утро). Эту часть покрывает только накопитель или генератор — не текущее солнце. Пусто = день и ночь считаются вместе (результат может быть занижен, приложение это отмечает).",
        gdzie: "Счётчик с почасовой разбивкой, профиль потребления от поставщика энергии или собственное измерение вечер/утро. Приложение не подставляет значение за вас.",
        zakres: "От 0 до 100%.",
      },
      histMagPoj: {
        nazwa: "Накопитель энергии — полезная ёмкость [кВт·ч]",
        cel: "Избыток PV хороших суток заряжает накопитель и покрывает дефицит следующих суток до запуска генератора — запас топлива получается меньше, чем в балансе без накопителя. Пусто = баланс без накопителя.",
        gdzie: "Ёмкость, которую реально можно использовать (с учётом допустимой глубины разряда) — паспорт или экраны Модуля 4.",
        zakres: "≥ 0 кВт·ч. В этом балансе генератор не заряжает накопитель (заряд от генератора считается на экране «Заряд накопителя от генератора»); день без данных обнуляет состояние накопителя — дополните пропущенные дни, если у вас есть данные.",
      },
      histMagSpr: {
        nazwa: "КПД цикла накопителя [%]",
        cel: "Какая доля избытка PV возвращается из накопителя в виде энергии (заряд + разряд). Приложение не подставляет значение за вас — без него результат ждёт.",
        gdzie: "Паспорт накопителя / инвертора (КПД «round-trip»).",
        zakres: "От 1 до 100%.",
      },
      histMagStan: {
        nazwa: "Состояние накопителя на 1 января [% ёмкости]",
        cel: "С какого заряда начинается расчёт каждого года истории. Пусто или 0 = пустой накопитель — в запас надёжности.",
        gdzie: "Ваше допущение о типичном состоянии на рубеже года.",
        zakres: "От 0 до 100%.",
      },
      histBrak: {
        nazwa: "Пропущенный день истории",
        cel: "Значение дня, которого нет в данных (PVGIS, файл или телеметрия). После «Дополнить» оно заменяет «-» в истории, и окна и серии с этим днём больше не пропускаются.",
        gdzie: "Только если у вас есть реальное значение: суточный счётчик инвертора, приложение производителя, свои записи. Без данных оставьте пустым — приложение ничего не подставляет за вас.",
        zakres: "≥ 0, в единице истории (кВт·ч/сутки для выработки PV, кВт·ч/м²/сутки для инсоляции).",
      },
      telZrodlo: {
        nazwa: "Источник телеметрии",
        cel: "Источник измерений, сохранённых в приложении (импорт CSV, устройство, режим онлайн), из которого строится суточная история выработки PV здания.",
        gdzie: "Источники добавляются на экране «Источники телеметрии», измерения — импортом CSV или онлайн-чтением.",
        zakres: "Один из источников списка.",
      },
      telKanal: {
        nazwa: "Канал мощности PV",
        cel: "Канал, мощность [Вт] которого — выработка PV (напр. выход MPPT или PV-инвертора). Энергия суток — интеграл этой мощности по времени.",
        gdzie: "Имя канала из файла или устройства — такое же, как на экране «Сводка телеметрии».",
        zakres: "Канал с выборками мощности.",
      },
      telPrzerwa: {
        nazwa: "Наибольший перерыв между выборками [мин]",
        cel: "До этого перерыва энергия считается между соседними выборками; более длинный перерыв неизвестен и не перекрывается. Сутки получают значение, только если выборки покрывают их полностью — иначе остаются пропущенным днём для дополнения.",
        gdzie: "Шаг записи вашего логгера с запасом на отдельные потерянные выборки — зависит от устройства, приложение его не угадывает.",
        zakres: "> 0 мин.",
      },
      pvgisLat: {
        nazwa: "Широта участка [°]",
        cel: "Место, для которого PVGIS выдаст архивную инсоляцию по суткам.",
        gdzie: "Карта или GPS телефона на участке; в Польше обычно 49–55 (с. ш.).",
        zakres: "От -90 до 90; десятичная точка. У PVGIS есть данные только для суши в зоне покрытия.",
      },
      pvgisLon: {
        nazwa: "Долгота участка [°]",
        cel: "Вторая координата места, для которого загружаются данные.",
        gdzie: "Карта или GPS телефона на участке; в Польше обычно 14–24 (в. д.).",
        zakres: "От -180 до 180; десятичная точка.",
      },
      pvgisNach: {
        nazwa: "Наклон панелей [°]",
        cel: "PVGIS считает инсоляцию на плоскости ваших панелей, а не на горизонтальной — зимой разница большая.",
        gdzie: "Из проекта опорной конструкции или замер угломером; 0 = панель лежит плашмя, 90 = вертикально.",
        zakres: "От 0 до 90; значение вводите вы — приложение ничего не предполагает.",
      },
      pvgisAzym: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, куда смотрят панели — вместе с наклоном определяет, сколько солнца они ловят.",
        gdzie: "По компасу или карте. Соглашение PVGIS: 0 = юг, 90 = запад, -90 = восток, 180 = север.",
        zakres: "От -180 до 180; это не компасный азимут от севера.",
      },
      pvgisOd: {
        nazwa: "Первый год истории",
        cel: "Начало диапазона лет, загружаемых из PVGIS; больше лет = надёжнее распределение, но дольше загрузка.",
        gdzie: "Ваше решение.",
        zakres: "От 2005 до 2023 (диапазон базы PVGIS-SARAH3 в используемой версии) и не позже последнего года.",
      },
      pvgisDo: {
        nazwa: "Последний год истории",
        cel: "Конец диапазона лет, загружаемых из PVGIS.",
        gdzie: "Ваше решение.",
        zakres: "От 2005 до 2023 и не раньше первого года.",
      },
    },
  },
  "raport-kryzysowy": {
    "migawka": {
      "oCoChodzi": "Кризисный отчёт — протокол после зимней генеральной репетиции: один лист, на котором рядом видны все результаты стресс-теста.",
      "jakDziala": "Экран читает то, что вы сохранили на экранах «Симуляция мороза», «Месячные дефициты и генератор», «Блэкаут» и «Коэффициент зимней безопасности», и собирает это в одном месте. Часть, экран которой ещё не заполнен, отмечается как отсутствующая — никогда как ноль.",
      "poCo": "Вы видите в одном месте, сколько дней с дефицитом даёт мороз, сколько работы генератора и топлива это стоит, переживёт ли накопитель дни без солнца и какая составляющая безопасности самая слабая — а в конце можно распечатать или сохранить как PDF.",
      "fizyka": "Отчёт ничего не считает собственной моделью: каждая часть — результат движка того экрана по его сохранённому черновику. Покрытие худшего месяца = выработка ÷ потребность (не более 100%), нехватка = потребность − выработка. Коэффициент зимней безопасности — взвешенное среднее пяти составляющих из Экрана 12 (предварительные веса, требуют доработки)."
    },
    "pola": {
      "liczbaDzis": {
        "nazwa": "Сколько панелей сейчас",
        "cel": "По этому числу я считаю, сколько энергии даёт одна панель в худшем месяце (выработка с экрана коэффициента ÷ число панелей), а по нему — сколько панелей добавить, чтобы покрыть нехватку.",
        "gdzie": "Посчитайте установленные сегодня панели. Используйте, если не знаете выработку одной панели; если указана и выработка, берётся она.",
        "zakres": "Целое число от 1. Предполагаются одинаковые панели в той же установке. Пусто = без пересчёта в штуки."
      },
      "uzyskPanelu": {
        "nazwa": "Выработка одной панели в худшем месяце",
        "cel": "Я делю на неё нехватку энергии худшего месяца и округляю вверх до целых панелей.",
        "gdzie": "Со вкладки «Зима» в сравнении панелей (энергия одной панели в зимние месяцы) или из собственного измерения.",
        "zakres": "Положительное число кВт·ч. Имеет приоритет над числом панелей. Пусто = без пересчёта в штуки."
      }
    }
  },
  "symulacja-mrozu": {
    "migawka": {
      "oCoChodzi": "Зимняя генеральная репетиция: весь месяц один и тот же мороз, каждый день разная погода — и мы проверяем, сколько дней система справится без генератора.",
      "jakDziala": "Выберите месяц, укажите мощность и ориентацию панелей и потребление дома. Для каждого температурного сценария приложение восстанавливает суточное тепло здания (из Экрана 1 Модуля 6), добавляет его к потреблению, снижает ёмкость батареи на спад из паспорта ячейки и считает баланс день за днём на выработке PV по данным TMY вашей локации.",
      "poCo": "Среднегодовое значение скрывает морозные недели. Здесь видно, в какие дни не хватит энергии, сколько её не хватает суммарно и идут ли дефициты сериями — от этого зависит, какой генератор и какой запас топлива нужны.",
      "fizyka": "Q_сут = max(0, H_внеш·(θi − θe) + Φ_ф)·24 ч; E_эл = Q/COP; D = E_баз + E_эл + E_доп; C_эф = C·(1 − s/100); дефицит дня = max(0, D − P_PV − энергия из накопителя). Выработка дня = Σ G_poa·Δt/1000 · кВт_п · PR. Температура постоянна весь месяц, COP постоянен в сценарии — это упрощение."
    },
    "pola": {
      "miesiac": {
        "nazwa": "Месяц симуляции",
        "cel": "Дни этого месяца из данных TMY — профиль выработки PV, на котором считается баланс.",
        "gdzie": "Обычно самый холодный месяц: декабрь или январь.",
        "zakres": "Обязательно; дни типичного метеорологического года, а не прогноз."
      },
      "mocKwp": {
        "nazwa": "Мощность панелей [кВт_п]",
        "cel": "Масштабирует облучённость плоскости до электрической энергии.",
        "gdzie": "Сумма номинальных мощностей панелей из паспортов или проекта.",
        "zakres": "Ваша установка; требуется > 0."
      },
      "pr": {
        "nazwa": "Коэффициент производительности PR [-]",
        "cel": "Учитывает потери инвертора, кабелей, температуры и загрязнения.",
        "gdzie": "Из проекта или измерений вашей установки; приложение его не угадывает.",
        "zakres": "Обычно 0,6–0,9; требуется > 0."
      },
      "nachylenieDeg": {
        "nazwa": "Наклон панелей [°]",
        "cel": "От угла зависит, сколько зимнего солнца попадает на панель.",
        "gdzie": "Измерение на крыше или проект конструкции.",
        "zakres": "0° = горизонтально, 90° = вертикально."
      },
      "azymutDeg": {
        "nazwa": "Азимут панелей [°]",
        "cel": "Направление, куда смотрят панели, — влияет на зимнюю выработку.",
        "gdzie": "Компас или план крыши: С = 0°, В = 90°, Ю = 180°, З = 270°.",
        "zakres": "0–360°."
      },
      "korektaProdukcjiPct": {
        "nazwa": "Коррекция выработки PV [%]",
        "cel": "Снижает (отрицательное значение) или повышает выработку, например из-за инея и снега на панелях.",
        "gdzie": "Ваша оценка или результат экранов о снеге и обледенении; пусто = без коррекции.",
        "zakres": "−100…100%; отрицательное = меньше энергии."
      },
      "zuzycieBazoweDobaKwh": {
        "nazwa": "Суточное потребление без отопления [кВт·ч/сут]",
        "cel": "Электроэнергия дома без отопления, одинаковая в каждом сценарии.",
        "gdzie": "Модуль 2 (нагрузки) или летний счёт, если дом не отапливается электричеством.",
        "zakres": "Ваше потребление; требуется ≥ 0."
      },
      "dodatkoweZuzycieDobaKwh": {
        "nazwa": "Дополнительное потребление из-за мороза [кВт·ч/сут]",
        "cel": "Нагреватели BMS, оттайка, обогрев труб и другие нагрузки, включаемые морозом.",
        "gdzie": "Паспорта устройств или измерение; пусто = нет дополнительных нагрузок.",
        "zakres": "≥ 0."
      },
      "cop": {
        "nazwa": "Общий COP источника тепла",
        "cel": "Сколько тепла получается из 1 кВт·ч электричества; заменяет COP из Экрана 1, если вы его введёте.",
        "gdzie": "Паспорт теплового насоса при наружной температуре сценария; ТЭН = 1.",
        "zakres": "> 0; COP теплового насоса падает с морозом."
      },
      "magazynKwh": {
        "nazwa": "Полезная ёмкость накопителя [кВт·ч]",
        "cel": "Накопитель переносит излишки PV из солнечных дней в дни без солнца.",
        "gdzie": "Паспорт батареи: ёмкость в пределах допустимой глубины разряда. Пусто или 0 = без накопителя.",
        "zakres": "≥ 0; при обычной температуре, до спада."
      },
      "magazynSprawnoscPct": {
        "nazwa": "КПД накопителя при заряде [%]",
        "cel": "Доля излишка, которая попадает в батарею; остальное — потери.",
        "gdzie": "Паспорт батареи и инвертора (КПД цикла).",
        "zakres": "Требуется, если указана ёмкость; 0–100%."
      },
      "magazynStanPoczatkowyPct": {
        "nazwa": "Уровень заряда в начале месяца [%]",
        "cel": "С чего начинается баланс; пусто = 0%, то есть безопасная сторона.",
        "gdzie": "Ваша оценка после предыдущего месяца.",
        "zakres": "0–100%."
      },
      "udzialNocyPct": {
        "nazwa": "Доля потребления ночью [%]",
        "cel": "Часть потребления в часы без солнца — питается только из накопителя.",
        "gdzie": "Суточный профиль потребления дома (Модуль 2); пусто = день и ночь одних суток не разделяются.",
        "zakres": "0–100%."
      },
      "scenariuszTemperaturaC": {
        "nazwa": "Температура сценария [°C]",
        "cel": "Постоянная наружная температура весь месяц в этом сценарии.",
        "gdzie": "По умолчанию −20 и −30 °C; можно ввести свою, например расчётную температуру зоны.",
        "zakres": "−60…20 °C; до 6 сценариев."
      },
      "scenariuszCop": {
        "nazwa": "COP в этом сценарии",
        "cel": "COP теплового насоса при температуре сценария; пусто = общий COP.",
        "gdzie": "График или таблица мощности и COP из паспорта насоса при этой наружной температуре.",
        "zakres": "> 0."
      },
      "scenariuszSpadekPojemnosciPct": {
        "nazwa": "Спад ёмкости батареи на морозе [%]",
        "cel": "Ячейки на морозе отдают меньше энергии, чем при комнатной температуре.",
        "gdzie": "Паспорт ячейки: ёмкость в зависимости от температуры. Пример из источника (−20% при −20 °C) — лишь иллюстрация; пусто = без спада.",
        "zakres": "0–99%."
      }
    }
  },
  "ladowanie-z-agregatu": {
    "migawka": {
      "oCoChodzi": "Генератор, заряжающий накопитель, — как кран, наполняющий ванну, из которой кто-то одновременно черпает воду ведром: в ванну попадает только то, что остаётся.",
      "jakDziala": "Введите мощность генератора, мощность заряда зарядного устройства/инвертора, мощность нагрузок аварийной линии, ёмкость накопителя, пороги SOC запуска и остановки и КПД заряда. Приложение рассчитает мощность заряда, нагрузку генератора, время работы за цикл и — если укажете расход по паспорту — топливо и стоимость.",
      "poCo": "Суточный баланс (Месячные дефициты) не знает, сколько кВт остаётся на заряд в данный момент. Здесь видно, есть ли у генератора вообще запас для заряда, при какой нагрузке он работает (от неё зависит расход л/ч по паспорту) и сколько часов и литров стоит один цикл.",
      "fizyka": "P_зар = min(P_зарядного, P_генератора − P_нагрузок); E = (SOC_стоп − SOC_старт)/100 · C; энергия AC = E/η; t = E_AC / P_зар; топливо = t · q [л/ч]. Нагрузка = (P_нагр + P_зар)/P_генератора. В конце заряда (фаза постоянного напряжения) мощность заряда падает — реальное время больше."
    },
    "pola": {
      "mocAgregatuKw": {
        "nazwa": "Номинальная (длительная) мощность генератора [кВт]",
        "cel": "Верхний предел мощности, которую генератор отдаёт нагрузкам и зарядному устройству вместе.",
        "gdzie": "Табличка / паспорт — длительная мощность (не пиковая).",
        "zakres": "Ваш генератор; требуется > 0."
      },
      "mocLadowarkiKw": {
        "nazwa": "Мощность заряда от генератора [кВт]",
        "cel": "Сколько максимум зарядное устройство/инвертор берёт от генератора на заряд накопителя.",
        "gdzie": "Паспорт инвертора/зарядного (макс. ток заряда × напряжение накопителя или установленный предел тока входа AC).",
        "zakres": "Ваше устройство; требуется > 0."
      },
      "mocOdbiornikowKw": {
        "nazwa": "Мощность нагрузок аварийной линии [кВт]",
        "cel": "Нагрузки, работающие во время заряда, забирают часть мощности генератора.",
        "gdzie": "Сумма нагрузок аварийной линии, работающих в это время (Модуль 2, измерение).",
        "zakres": "0 = нагрузок нет; постоянна весь цикл."
      },
      "pojemnoscKwh": {
        "nazwa": "Полезная ёмкость накопителя [кВт·ч]",
        "cel": "Переводит разницу порогов SOC в энергию для заряда.",
        "gdzie": "Паспорт накопителя × допустимая DoD (Модуль 4).",
        "zakres": "Ваш накопитель; требуется > 0."
      },
      "socStartPct": {
        "nazwa": "Порог SOC запуска генератора [%]",
        "cel": "При этом уровне заряда генератор запускается.",
        "gdzie": "Настройки инвертора/контроллера генератора.",
        "zakres": "0–100%, меньше порога остановки."
      },
      "socStopPct": {
        "nazwa": "Порог SOC остановки генератора [%]",
        "cel": "До этого уровня заряда генератор заряжает накопитель.",
        "gdzie": "Настройки инвертора/контроллера генератора.",
        "zakres": "0–100%, больше порога запуска."
      },
      "sprawnoscLadowaniaPct": {
        "nazwa": "КПД заряда AC → накопитель [%]",
        "cel": "Часть энергии генератора, теряемая в зарядном устройстве и накопителе при заряде.",
        "gdzie": "Паспорт зарядного/инвертора — КПД заряда (не КПД полного цикла заряд+разряд).",
        "zakres": "Больше 0, не более 100%."
      },
      "zuzyciePaliwaLH": {
        "nazwa": "Расход топлива [л/ч]",
        "cel": "Рассчитывает топливо и стоимость цикла.",
        "gdzie": "Паспорт генератора — строка для нагрузки, ближайшей к показанной в результате.",
        "zakres": "Пусто = топливо не считается (приложение покажет, при какой нагрузке смотреть)."
      },
      "cenaPaliwaZlL": {
        "nazwa": "Цена топлива [{waluta}/л]",
        "cel": "Рассчитывает стоимость цикла.",
        "gdzie": "Ваша цена покупки.",
        "zakres": "Пусто = стоимость не считается."
      }
    }
  },
  "okno-sloneczne": {
    "migawka": {
      "oCoChodzi": "Зимой солнце — как короткий визит гостя: нужно использовать каждую минуту, пока оно не ушло.",
      "jakDziala": "Введите, сколько энергии PV даст солнечное окно, сколько дом потребит за это время, батарею и бойлер. Приложение распределит остаток в порядке источника: подогрев BMS (если батарея требует подогрева), батарея до {prog}%, бойлер, батарея до 100%, в конце избыточные нагрузки.",
      "poCo": "До ночи вы знаете, сколько энергии останется в батарее и включать стирку сегодня или завтра.",
      "fizyka": "Бойлер: Q = V·ΔT·c (та же константа воды, что в Модуле 2). SoC_к = SoC_0 + E_бат / C. Пример источника «4,5 кВт·ч → батарея 65% и бойлер 50 °C» противоречит правилу «бойлер только выше 80%» — приложение следует правилу."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Выработка PV в солнечном окне [кВт·ч]",
        "cel": "Энергия для распределения.",
        "gdzie": "Модуль 3 (почасовая выработка) или прогноз погоды на солнечные часы.",
        "zakres": "Ваша установка."
      },
      "zuzycie": {
        "nazwa": "Потребление дома во время окна [кВт·ч]",
        "cel": "Нагрузки, работающие в это время, питаются в первую очередь.",
        "gdzie": "Модуль 2 — потребление в эти часы.",
        "zakres": "Пусто = 0."
      },
      "pojemnosc": {
        "nazwa": "Полезная ёмкость батареи [кВт·ч]",
        "cel": "Переводит энергию в проценты SoC.",
        "gdzie": "Паспорт батареи × допустимая DoD (Модуль 4).",
        "zakres": "Паспорт устройства."
      },
      "soc": {
        "nazwa": "Уровень заряда в начале окна [%]",
        "cel": "От него зависит, когда энергия пойдёт в бойлер.",
        "gdzie": "Дисплей BMS/инвертора.",
        "zakres": "0–100%."
      },
      "grzalki": {
        "nazwa": "Энергия подогрева BMS перед зарядкой [кВт·ч]",
        "cel": "Батарея LiFePO4 ниже 0 °C не примет заряд, пока подогрев её не согреет.",
        "gdzie": "Мощность нагревательных матов × время прогрева (Модуль 4).",
        "zakres": "Пусто = подогрев не нужен."
      },
      "bojlerL": {
        "nazwa": "Объём бойлера [л]",
        "cel": "Из него считается тепло на нагрев воды.",
        "gdzie": "Табличка бойлера.",
        "zakres": "Пусто = без бойлера."
      },
      "tStart": {
        "nazwa": "Температура воды сейчас [°C]",
        "cel": "Начальная точка нагрева.",
        "gdzie": "Термометр/контроллер бойлера.",
        "zakres": "Ваше измерение."
      },
      "tCel": {
        "nazwa": "Целевая температура воды [°C]",
        "cel": "До скольких градусов нагреть воду солнцем.",
        "gdzie": "Настройка термостата.",
        "zakres": "Ваша настройка."
      }
    }
  },
  "snieg-na-pv": {
    "migawka": {
      "oCoChodzi": "Засыпанная панель — мёртвая панель, а ветер распределяет снег неравномерно — нужно знать не только сколько, но и где он ляжет.",
      "jakDziala": "Выберите тип отложения, введите угол панелей и обычную суточную выработку. Приложение покажет таблицу «что если» — потерю энергии при 1, 3, 5 и 7 днях покрытия (знать дни и процент не обязательно; свои числа необязательны), скажет, сползёт ли сухой снег (угол больше {prog}°), и сравнит способы справиться: угол, ручную очистку, автоматические системы, а также греющий кабель и плёнку с балансом энергии.",
      "poCo": "Вы знаете, сколько энергии должны заменить батарея или генератор и что действительно стоит делать с панелями — прежде чем покупать обогрев, который потратит больше, чем вернёт.",
      "fizyka": "E = E_сут · дни · (1 − p). Процент p — пример из источника (снег и лёд 0%, изморозь около 5%), если не введёте свой. Сухой снег сползает при угле > {prog}° (тот же порог, что в Модуле 3 «Чистота и снег»). Обогрев: затраты = P · h, возврат = E_сут · (1 − p) · (дни − h/24); окупается, когда возврат ≥ затраты."
    },
    "pola": {
      "rodzaj": {
        "nazwa": "Тип отложения",
        "cel": "Определяет, может ли отложение сойти само.",
        "gdzie": "Наблюдение или прогноз (сухой снег, мокрый, ледяной дождь).",
        "zakres": "Сухой, мокрый, гололёд/иней, изморозь."
      },
      "kat": {
        "nazwa": "Угол наклона панелей [°]",
        "cel": "При угле больше {prog}° сухой снег может сползти сам.",
        "gdzie": "Проект установки (Модуль 3).",
        "zakres": "0–90°."
      },
      "produkcja": {
        "nazwa": "Выработка в сутки без отложения [кВт·ч]",
        "cel": "Энергия, которую дали бы чистые панели.",
        "gdzie": "Модуль 3 — выработка в этом месяце ÷ число дней.",
        "zakres": "Ваша установка."
      },
      "dni": {
        "nazwa": "Своё число дней покрытия [дни] (необязательно)",
        "cel": "Добавляет свою строку в таблицу и служит сценарием, по которому оцениваются варианты с обогревом.",
        "gdzie": "Наблюдение или прогноз оттепели; оставьте пустым, если не знаете (пример источника: при −5 °C снег держится около 3 дней).",
        "zakres": "Больше нуля; пусто = таблица для 1, 3, 5 и 7 дней."
      },
      "pozostala": {
        "nazwa": "Своя выработка под отложением [% от нормы] (необязательно)",
        "cel": "Какая часть света проходит через отложение; заменяет пример из источника.",
        "gdzie": "Наблюдение по инвертору; оставьте пустым, если не знаете (пример источника: снег 0%, изморозь через 48 ч около 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Общая площадь панелей [м²]",
        "cel": "Умножает мощность кабеля и плёнки в Вт/м².",
        "gdzie": "Проект установки (Модуль 3) или размер одной панели × число панелей.",
        "zakres": "Больше нуля для кабеля и плёнки."
      },
      "kabelMoc": {
        "nazwa": "Мощность греющего кабеля [Вт/м²]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт кабеля — приложение это значение не угадывает.",
        "zakres": "Больше нуля."
      },
      "kabelGodz": {
        "nazwa": "Часы работы кабеля до очистки [ч]",
        "cel": "Умножает мощность — чем дольше греет, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      },
      "foliaMoc": {
        "nazwa": "Мощность греющей плёнки [Вт/м²]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт плёнки — приложение это значение не угадывает.",
        "zakres": "Больше нуля."
      },
      "foliaGodz": {
        "nazwa": "Часы работы плёнки до очистки [ч]",
        "cel": "Умножает мощность — чем дольше греет, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      },
      "automatMoc": {
        "nazwa": "Мощность автоматической системы очистки [Вт]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт системы — это общая мощность, а не на м².",
        "zakres": "Больше нуля."
      },
      "automatGodz": {
        "nazwa": "Часы работы системы до очистки [ч]",
        "cel": "Умножает мощность — чем дольше работает, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      },
      "nierowno": {
        "nazwa": "Стринги засыпаны неравномерно",
        "cel": "Разное засыпание стрингов даёт разницу напряжений (рассогласование).",
        "gdzie": "Скаты разных направлений, подветренная сторона, ендовы крыши.",
        "zakres": "Да / нет."
      }
    }
  },
  "szadz-na-pv": {
    "migawka": {
      "oCoChodzi": "Туман — тихий убийца панелей: он замерзает на них, как глазурь на стекле, и, в отличие от снега, сам не опадает.",
      "jakDziala": "Введите обычную суточную выработку. Приложение покажет таблицу «что если» — потерю энергии при 1, 2 (48 ч из примера источника), 3, 5 и 7 днях тумана с изморозью — и сравнит способы справиться, включая баланс энергии обогрева. Свои дни и процент выработки необязательны.",
      "poCo": "Несколько дней тумана могут забрать почти всю выработку — вы знаете, сколько должны покрыть батарея и генератор, и окупается ли вообще обогрев панелей.",
      "fizyka": "E = E_сут · дни · (1 − p). Пример источника: после 48 ч тумана и изморози выработка падает до 5% номинальной (p = 5%). Изморозь сама не сползает, поэтому больший угол не помогает. Обогрев: затраты = P · h, возврат = E_сут · (1 − p) · (дни − h/24)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Выработка в сутки без изморози [кВт·ч]",
        "cel": "Энергия, которую дали бы чистые панели.",
        "gdzie": "Модуль 3 — выработка в этом месяце ÷ число дней.",
        "zakres": "Ваша установка."
      },
      "dni": {
        "nazwa": "Своё число дней покрытия [дни] (необязательно)",
        "cel": "Добавляет свою строку в таблицу и служит сценарием, по которому оцениваются варианты с обогревом.",
        "gdzie": "Наблюдение или прогноз оттепели; оставьте пустым, если не знаете (пример источника: при −5 °C снег держится около 3 дней).",
        "zakres": "Больше нуля; пусто = таблица для 1, 3, 5 и 7 дней."
      },
      "pozostala": {
        "nazwa": "Своя выработка под отложением [% от нормы] (необязательно)",
        "cel": "Какая часть света проходит через отложение; заменяет пример из источника.",
        "gdzie": "Наблюдение по инвертору; оставьте пустым, если не знаете (пример источника: снег 0%, изморозь через 48 ч около 5%).",
        "zakres": "0–100%."
      },
      "powierzchnia": {
        "nazwa": "Общая площадь панелей [м²]",
        "cel": "Умножает мощность кабеля и плёнки в Вт/м².",
        "gdzie": "Проект установки (Модуль 3) или размер одной панели × число панелей.",
        "zakres": "Больше нуля для кабеля и плёнки."
      },
      "kabelMoc": {
        "nazwa": "Мощность греющего кабеля [Вт/м²]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт кабеля — приложение это значение не угадывает.",
        "zakres": "Больше нуля."
      },
      "kabelGodz": {
        "nazwa": "Часы работы кабеля до очистки [ч]",
        "cel": "Умножает мощность — чем дольше греет, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      },
      "foliaMoc": {
        "nazwa": "Мощность греющей плёнки [Вт/м²]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт плёнки — приложение это значение не угадывает.",
        "zakres": "Больше нуля."
      },
      "foliaGodz": {
        "nazwa": "Часы работы плёнки до очистки [ч]",
        "cel": "Умножает мощность — чем дольше греет, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      },
      "automatMoc": {
        "nazwa": "Мощность автоматической системы очистки [Вт]",
        "cel": "По ней считается энергия, нужная для очистки панелей.",
        "gdzie": "Паспорт системы — это общая мощность, а не на м².",
        "zakres": "Больше нуля."
      },
      "automatGodz": {
        "nazwa": "Часы работы системы до очистки [ч]",
        "cel": "Умножает мощность — чем дольше работает, тем больше энергии потребит.",
        "gdzie": "Инструкция производителя или собственный опыт.",
        "zakres": "Больше нуля."
      }
    }
  },
  "wspolczynnik-bezpieczenstwa-zimowego": {
    "migawka": {
      "oCoChodzi": "Это оценка на экзамене — она показывает, сдаст ли система зиму или будет пересдача, и из-за чего именно.",
      "jakDziala": "Введите (или подставьте с других зимних экранов) пять групп данных: покрытие энергии в худшем месяце, дни автономии, число единичных точек отказа, мощность генератора и время защиты от замерзания. Каждая составляющая получает оценку 0–100%, а коэффициент — это средневзвешенное. Рядом с результатом видны самая слабая составляющая (самое слабое звено) и очерёдность составляющих; слабые места — когда введёте порог.",
      "poCo": "Одно число говорит, всё ли хорошо; список слабых мест — что исправлять в первую очередь.",
      "fizyka": "W = Σ wᵢ·sᵢ / Σ wᵢ, где sᵢ = min(100%, что есть у системы ÷ что требует сценарий). Веса (30/25/20/15/10%) предварительные — требуют доработки владельцем приложения; можно ввести свои (сумма 100%). Составляющая ниже введённого вами порога — слабое место; без порога видна только очерёдность от самой слабой."
    },
    "pola": {
      "prog": {
        "nazwa": "Порог слабого места [%]",
        "cel": "Составляющая с оценкой ниже этого порога отмечается как слабое место (🟡). Без порога видна только очерёдность составляющих от самой слабой.",
        "gdzie": "Ваше решение — насколько осторожно вы хотите оценивать установку. Источник порога не даёт (пример: 74% = «хорошо, но есть слабые места»).",
        "zakres": "От 0 до 100%. Пусто = без порога.",
      },
      "produkcja": {
        "nazwa": "Выработка PV в худшем месяце [кВт·ч]",
        "cel": "Сколько энергии дадут панели в самый тяжёлый месяц зимы.",
        "gdzie": "Модуль 3 — месячная выработка (обычно декабрь или январь); или кнопка с Экрана 2.",
        "zakres": "Ваша установка; 0 = нет выработки."
      },
      "zapotrzebowanie": {
        "nazwa": "Потребление в том же месяце [кВт·ч]",
        "cel": "С этим сравнивается выработка.",
        "gdzie": "Модуль 2 — месячное потребление (зимой вместе с отоплением).",
        "zakres": "Больше нуля."
      },
      "autonomia": {
        "nazwa": "Дни работы без солнца [дни]",
        "cel": "Как долго система работает от батареи (и генератора), когда PV ничего не вырабатывает.",
        "gdzie": "Экран 4 «Блэкаут» (кнопка подставляет результат) или Модуль 4 «Дни автономии».",
        "zakres": "От 0 до требуемого числа дней; больше оценку не повышает."
      },
      "wymaganaAutonomia": {
        "nazwa": "Требуемое число дней без солнца [дни]",
        "cel": "Сколько дней без солнца система должна пережить.",
        "gdzie": "Ваше решение; сценарий «Блэкаут» в источнике — 10–14 дней.",
        "zakres": "Больше нуля."
      },
      "komponenty": {
        "nazwa": "Число проверенных компонентов",
        "cel": "База для расчёта доли компонентов с резервированием.",
        "gdzie": "Экран 10 «Анализ SPOF» (кнопка подставляет числа) — список: BMS, инвертор, предохранители, MPPT, насосы, датчики.",
        "zakres": "Целое число, не менее 1."
      },
      "spof": {
        "nazwa": "Компоненты без резервирования (SPOF)",
        "cel": "Чем их меньше, тем выше устойчивость к отказам.",
        "gdzie": "Экран 10 — компоненты без отмеченного резервирования.",
        "zakres": "От 0 до числа проверенных компонентов."
      },
      "brakAgregatu": {
        "nazwa": "У меня нет генератора",
        "cel": "Без генератора составляющая «запас мощности генератора» равна 0%.",
        "gdzie": "Ваша установка.",
        "zakres": "Да или нет."
      },
      "mocAgregatu": {
        "nazwa": "Мощность генератора [кВт]",
        "cel": "Сколько мощности даёт генератор.",
        "gdzie": "Табличка генератора; Экран 2 (кнопка).",
        "zakres": "Больше нуля."
      },
      "mocWymagana": {
        "nazwa": "Мощность, которую генератор должен тянуть [кВт]",
        "cel": "С этим сравнивается мощность генератора.",
        "gdzie": "Пиковая мощность нагрузок, питаемых от генератора, плюс зарядное устройство батареи — Модуль 2.",
        "zakres": "Больше нуля."
      },
      "okno": {
        "nazwa": "Время защиты от замерзания [ч]",
        "cel": "Как долго установка сама поддерживает защиту от замерзания (критичные нагрузки).",
        "gdzie": "Экран 6 «Защита от замерзания» (кнопка подставляет время питания критичных нагрузок).",
        "zakres": "Не менее 0; больше времени реакции оценку не повышает."
      },
      "wymaganyCzas": {
        "nazwa": "Время, нужное вам на реакцию [ч]",
        "cel": "Сколько времени вам нужно, чтобы среагировать: приехать, запустить генератор, слить воду.",
        "gdzie": "Ваша оценка — зависит от того, где вы находитесь, когда система откажет.",
        "zakres": "Больше нуля."
      },
      "wlasneWagi": {
        "nazwa": "Собственные веса",
        "cel": "Позволяет заменить предварительные веса своими.",
        "gdzie": "Ваше решение — насколько важна для вас каждая составляющая.",
        "zakres": "Сумма весов должна быть 100%."
      },
      "waga": {
        "nazwa": "Вес составляющей [%]",
        "cel": "Насколько сильно составляющая влияет на итоговый результат.",
        "gdzie": "По умолчанию 30/25/20/15/10% (предварительные, требуют доработки владельцем приложения); здесь вводятся свои.",
        "zakres": "0–100%, все вместе 100%."
      }
    }
  },
}
