/**
 * Help content — Module 6 Part 2B additions (sections added to Part 1 screens: field groups without a Migawka of
 * their own) and the 2C screens built with them. Numbers kept by the engines enter through `{params}` (8.4b).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "m6d-dobor-mocy-pompy": {
    pola: {
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie na moc cieplną przy temperaturze projektowej [kW]",
        cel: "Ile ciepła dom traci w największy mróz — tyle pompa (z dogrzewaniem) musi dać.",
        gdzie: "Ekran 1 „Straty ciepła budynku” — puste pole bierze jego wynik.",
        zakres: "≥ 0. Twój budynek — aplikacja nie przyjmuje typowej wartości za Ciebie.",
      },
      mocProj: {
        nazwa: "Moc grzewcza pompy przy temperaturze projektowej [kW]",
        cel: "Porównywana z zapotrzebowaniem — różnica to zapas albo brak mocy.",
        gdzie: "Karta katalogowa: tabela mocy grzewczej dla temperatur zewnętrznych (np. A−20/W35) przy Twojej temperaturze zasilania. Nie moc nominalna A7/W35.",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
      tProj: {
        nazwa: "Temperatura projektowa zewnętrzna [°C]",
        cel: "Temperatura, dla której porównujesz moc pompy z zapotrzebowaniem (punkt startu prostych do punktu biwalentnego).",
        gdzie: "Ekran 1 (strefa klimatyczna) — puste pole bierze jego wartość.",
        zakres: "Twoja strefa klimatyczna.",
      },
      tWewn: {
        nazwa: "Temperatura w domu [°C]",
        cel: "Przy tej temperaturze zewnętrznej zapotrzebowanie spada do zera — potrzebne do punktu biwalentnego.",
        gdzie: "Ekran 1 — puste pole bierze jego wartość.",
        zakres: "Twój komfort.",
      },
      tDrugi: {
        nazwa: "Drugi punkt karty: temperatura zewnętrzna [°C]",
        cel: "Opcjonalne: z drugim punktem aplikacja rysuje prostą mocy pompy i liczy punkt biwalentny.",
        gdzie: "Karta katalogowa — druga temperatura z tabeli mocy (np. A2 albo A7).",
        zakres: "Inna niż temperatura projektowa.",
      },
      mocDrugi: {
        nazwa: "Drugi punkt karty: moc grzewcza pompy [kW]",
        cel: "Moc pompy w drugiej temperaturze — zwykle wyższa niż w mróz.",
        gdzie: "Karta katalogowa — ta sama tabela i ta sama temperatura zasilania.",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
      maDogrzew: {
        nazwa: "Zapasowe źródło ciepła w domu (grzałka, kominek, kocioł)",
        cel: "Decyduje o poziomie ostrzeżenia przy braku mocy pompy: bez żadnego dogrzewania to stop 🔴, z dogrzewaniem — ostrzeżenie 🟡.",
        gdzie: "Twój dom: czy jest grzałka elektryczna w buforze/na zasilaniu, kominek (najlepiej z płaszczem wodnym) albo kocioł.",
        zakres: "Jest / Brak / Nie wiem. „Nie wiem” liczy się jak 🟡 i prosi o uzupełnienie.",
      },
    },
  },
  "m6d-krzywa-grzewcza": {
    pola: {
      tZewn: {
        nazwa: "Temperatura zewnętrzna punktu krzywej [°C]",
        cel: "Dwa punkty (dwie temperatury zewnętrzne) wyznaczają prostą krzywej.",
        gdzie: "Menu sterownika pompy (krzywa grzewcza) albo instalator — np. +10 °C i −10 °C jak w przykładzie źródła.",
        zakres: "Dwie różne temperatury.",
      },
      tZasil: {
        nazwa: "Obecna krzywa: temperatura zasilania [°C]",
        cel: "Ile stopni sterownik daje na zasilaniu przy tej temperaturze zewnętrznej teraz.",
        gdzie: "Menu sterownika albo odczyt zasilania przy takiej pogodzie.",
        zakres: "Twoje ustawienia.",
      },
      tNowa: {
        nazwa: "Nowa krzywa: temperatura zasilania [°C]",
        cel: "Opcjonalne: krzywa, którą chcesz sprawdzić — zwykle niższa od obecnej.",
        gdzie: "Twoja propozycja (np. obecna minus kilka stopni).",
        zakres: "Nie niższa, niż pozwala komfort w domu.",
      },
      tOceny: {
        nazwa: "Temperatura zewnętrzna porównania [°C]",
        cel: "Przy tej temperaturze aplikacja odczytuje zasilanie obu krzywych.",
        gdzie: "Np. średnia sezonu grzewczego albo typowy styczniowy dzień (Moduł 1).",
        zakres: "Najlepiej między dwoma punktami krzywej.",
      },
      cop: {
        nazwa: "COP przy obecnym zasilaniu [–]",
        cel: "Opcjonalne: punkt wyjścia do widełek COP po obniżeniu krzywej (reguła źródła {min}–{max}% na °C).",
        gdzie: "Karta pompy — COP dla tej temperatury zewnętrznej i obecnej temperatury zasilania.",
        zakres: "≥ 1. Karta Twojej pompy.",
      },
      cieplo: {
        nazwa: "Ciepło do ogrzewania w sezonie [kWh]",
        cel: "Opcjonalne: przelicza zmianę COP na kWh prądu w sezonie.",
        gdzie: "Ekran 2 (suma miesięcy C.O.) albo Ekran 1.",
        zakres: "≥ 0. Wynik Twojego Ekranu 1/2.",
      },
    },
  },
  "model-sezonowy-pompy-ciepla": {
    migawka: {
      oCoChodzi: "Pompa to Twój zimowy apetyt — trzeba go znać, żeby nie zabrakło jedzenia. Katalog to marketing, rzeczywistość to Twoja instalacja i Twoja pogoda.",
      jakDziala: "Dla każdego miesiąca: prąd = ciepło miesiąca ÷ COP pompy w tym miesiącu. Suma to zużycie sezonu, a ciepło sezonu ÷ prąd sezonu to realny SCOP Twojego domu. Ciepło miesięcy bierze się z Ekranu 1, COP z karty pompy przy średniej temperaturze miesiąca.",
      poCo: "Wiesz, ile prądu pompa weźmie w styczniu i na dobę w najgorszym miesiącu — tyle energii musi dać bateria, PV albo agregat. Porównanie z katalogowym SCOP pokazuje, ile realnie tracisz.",
      fizyka: "E_m = Q_m / COP_m, SCOP = ΣQ / ΣE.",
    },
    pola: {
      cieplo: {
        nazwa: "Ciepło do ogrzewania w miesiącu [kWh]",
        cel: "Ile ciepła pompa ma dostarczyć w tym miesiącu.",
        gdzie: "Ekran 1 (miesiące) — puste pole bierze jego wynik; albo Ekran 2 × liczba dni.",
        zakres: "≥ 0. Puste albo 0 = w tym miesiącu nie grzejesz.",
      },
      cop: {
        nazwa: "COP pompy w miesiącu [–]",
        cel: "Dzieli ciepło miesiąca — wynik to prąd pompy w tym miesiącu.",
        gdzie: "Karta pompy: COP przy średniej temperaturze miesiąca (Moduł 1) i Twojej temperaturze zasilania. Miesiące ze szronieniem: COP z defrostem z Ekranu 6.",
        zakres: "≥ 1. Karta Twojej pompy.",
      },
      scop: {
        nazwa: "SCOP katalogowy [–]",
        cel: "Opcjonalne: porównanie z realnym SCOP Twojego domu.",
        gdzie: "Karta pompy / etykieta energetyczna (SCOP dla klimatu umiarkowanego i Twojej temperatury zasilania).",
        zakres: "≥ 1. Karta Twojej pompy.",
      },
    },
  },
  "m6d-bufor-praca-pompy": {
    pola: {
      obciazenie: {
        nazwa: "Średnie zapotrzebowanie na ciepło w analizowanym okresie [kW]",
        cel: "Tyle ciepła dom zabiera z wody, gdy pompa stoi — od tego zależy długość postoju i liczba startów.",
        gdzie: "Ekran 2 (kWh na dobę ÷ 24) dla miesiąca, który sprawdzasz — np. przejściowego, gdy taktowanie jest największe.",
        zakres: "≥ 0. Twój dom. Równe mocy pompy lub większe = praca ciągła.",
      },
      woda: {
        nazwa: "Woda w instalacji bez bufora [l]",
        cel: "Bez bufora tylko ta woda magazynuje ciepło między startami.",
        gdzie: "Projekt instalacji albo pojemność rur + grzejników/pętli podłogówki + wymiennika pompy (karty).",
        zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie.",
      },
      histereza: {
        nazwa: "Histereza sterownika [K]",
        cel: "O ile woda stygnie, zanim pompa znowu ruszy — razem z ilością wody daje ciepło jednego cyklu.",
        gdzie: "Ustawienia sterownika pompy (różnica załączenia/wyłączenia).",
        zakres: "> 0. Twój sterownik.",
      },
      dTMagazyn: {
        nazwa: "Ładowanie bufora ponad minimum [K]",
        cel: "Opcjonalne: o ile stopni możesz „naładować” bufor nadwyżką PV — daje zmagazynowane ciepło.",
        gdzie: "Najwyższa temperatura, do której pompa grzeje bufor, minus najniższa temperatura, przy której bufor jeszcze grzeje dom.",
        zakres: "≥ 0. Twoja instalacja.",
      },
      straty: {
        nazwa: "Straty postojowe bufora [W]",
        cel: "Opcjonalne: cena większego bufora — ciepło, które ucieka przez izolację.",
        gdzie: "Karta / etykieta energetyczna zbiornika (straty postojowe S w W).",
        zakres: "≥ 0. Karta Twojego bufora.",
      },
      dni: {
        nazwa: "Dni pracy w sezonie",
        cel: "Opcjonalne: straty postojowe w całym sezonie.",
        gdzie: "Długość sezonu grzewczego (Ekran 2) albo dni, gdy bufor jest gorący.",
        zakres: "≥ 0. Twój sezon.",
      },
    },
  },
  "m6d-pompy-cyrkulacyjne-sezon": {
    pola: {
      dni: {
        nazwa: "Dni pracy pompy w sezonie",
        cel: "Opcjonalne: zużycie i oszczędność w całym sezonie = wynik dobowy × dni.",
        gdzie: "Długość sezonu grzewczego (Ekran 2) — albo 365, jeśli pompa (np. cyrkulacja C.W.U.) pracuje cały rok.",
        zakres: "≥ 0. Twój sezon.",
      },
      cena: {
        nazwa: "Cena energii [{waluta}/kWh]",
        cel: "Opcjonalne: przelicza oszczędność sezonu na {waluta}.",
        gdzie: "Off-grid: koszt kWh z PV/baterii albo z agregatu (Moduł 2); z siecią — rachunek.",
        zakres: "≥ 0. Twoja cena.",
      },
    },
  },
  "m6d-przeplyw-pompy-ciepla": {
    pola: {
      moc: {
        nazwa: "Moc grzewcza pompy ciepła [kW]",
        cel: "Tyle ciepła woda musi odebrać z pompy.",
        gdzie: "Karta pompy — moc grzewcza w Twoich warunkach (największa, jaką pompa daje).",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
      dT: {
        nazwa: "Różnica temperatur zasilanie/powrót na pompie ciepła [K]",
        cel: "Im mniejsza różnica, tym większy przepływ potrzebny do przeniesienia tej samej mocy.",
        gdzie: "Karta pompy ciepła (nominalna ΔT) albo projekt instalacji.",
        zakres: "Źródło: np. {min}–{max} K.",
      },
      przeplyw: {
        nazwa: "Przepływ pompy obiegowej w punkcie pracy [m³/h]",
        cel: "Opcjonalne: porównanie z wymaganym przepływem i rzeczywista ΔT na pompie ciepła.",
        gdzie: "Krzywa pompy obiegowej (wybrany bieg) przecięta z oporem instalacji — od instalatora albo z odczytu przepływomierza.",
        zakres: "≥ 0. Twoja instalacja.",
      },
      min: {
        nazwa: "Minimalny przepływ pompy ciepła [m³/h]",
        cel: "Opcjonalne: poniżej niego pompa ciepła zgłasza alarm przepływu.",
        gdzie: "Karta pompy ciepła / instrukcja montażu (minimalny przepływ wody).",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
    },
  },
  "m6d-cwu-pompa-ciepla": {
    pola: {
      tMax: {
        nazwa: "Najwyższa temperatura C.W.U. z pompy ciepła [°C]",
        cel: "Do tej temperatury grzeje pompa, wyżej — grzałka.",
        gdzie: "Karta pompy ciepła (tryb C.W.U.) albo ustawienie sterownika.",
        zakres: "Źródło: zwykle 55–60 °C. Karta Twojej pompy.",
      },
      cop: {
        nazwa: "COP pompy w trybie C.W.U.",
        cel: "Ile kWh ciepła z 1 kWh prądu przy grzaniu wody — zwykle mniej niż przy ogrzewaniu domu (źródło).",
        gdzie: "Karta pompy — COP dla C.W.U. przy temperaturze wody i powietrza zbliżonej do Twojej (średni dla całego podgrzewu).",
        zakres: "≥ 1. Źródło: COP 3–4 (przykład).",
      },
      moc: {
        nazwa: "Moc grzewcza pompy w trybie C.W.U. [kW]",
        cel: "Ile ciepła na godzinę pompa daje do zasobnika — z niej czas grzania.",
        gdzie: "Karta pompy ciepła (moc grzewcza w trybie C.W.U.).",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
    },
  },
  "m6d-gwc-pompa-ciepla": {
    pola: {
      parownik: {
        nazwa: "Strumień powietrza przez parownik pompy [m³/h]",
        cel: "Im większy w porównaniu ze strumieniem GWC, tym mniej GWC podniesie temperaturę na wlocie.",
        gdzie: "Karta jednostki zewnętrznej pompy (przepływ powietrza wentylatora).",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
      moc: {
        nazwa: "Moc grzewcza pompy [kW]",
        cel: "Z niej i z COP — ile mocy pompa bierze z powietrza: P·(1 − 1/COP).",
        gdzie: "Karta pompy — moc w warunkach zimowych, w których pracuje GWC.",
        zakres: "≥ 0. Karta Twojej pompy.",
      },
      copBez: {
        nazwa: "COP bez GWC",
        cel: "Sprawność pompy przy obecnej temperaturze powietrza.",
        gdzie: "Karta pompy — COP przy temperaturze powietrza zewnętrznego.",
        zakres: "≥ 1. Karta Twojej pompy.",
      },
      copZ: {
        nazwa: "COP z GWC",
        cel: "Opcjonalne: sprawność przy powietrzu cieplejszym o wynik wyżej — z niej wzrost COP i oszczędność.",
        gdzie: "Karta pompy — COP przy temperaturze powietrza podniesionej o wyliczony wzrost (interpoluj między kolumnami karty).",
        zakres: "≥ 1. Źródło: tylko przykłady (+3 °C → +6%).",
      },
      cieplo: {
        nazwa: "Ciepło z pompy w okresie pracy GWC [kWh]",
        cel: "Opcjonalne: przelicza wzrost COP na oszczędność prądu.",
        gdzie: "Zapotrzebowanie z Ekranu 2 albo modelu sezonowego — tylko z miesięcy/dni, w których GWC pracuje.",
        zakres: "≥ 0. Twój dom.",
      },
    },
  },
  "m6d-defrost-sezon": {
    pola: {
      odstep: {
        nazwa: "Odstęp między defrostami w tej pogodzie [min]",
        cel: "Im częściej defrost, tym więcej energii — przy lekkim mrozie i wilgoci odstęp jest krótszy (źródło).",
        gdzie: "Historia pracy sterownika pompy, obserwacja albo karta producenta dla tych warunków.",
        zakres: "> czas defrostu. Źródło: np. co 35 min przy mgle i −2 °C.",
      },
      czas: {
        nazwa: "Czas jednego defrostu [min]",
        cel: "Przez ten czas pompa nie grzeje domu i pobiera moc defrostu.",
        gdzie: "Historia sterownika albo obserwacja (jednostka zewnętrzna paruje, wentylator stoi).",
        zakres: "> 0. Źródło: np. 4 min.",
      },
      godziny: {
        nazwa: "Godzin na dobę w tej pogodzie [h]",
        cel: "Defrost działa tylko wtedy, gdy parownik szronieje.",
        gdzie: "Twoja ocena albo dane pogodowe regionu (np. ile godzin trwa poranna mgła).",
        zakres: "0–24. Twoja lokalizacja.",
      },
      dni: {
        nazwa: "Dni w sezonie z tą pogodą",
        cel: "Mnoży energię na dobę na cały sezon.",
        gdzie: "Dane pogodowe regionu albo Twoje doświadczenie z poprzednich zim.",
        zakres: "≥ 0. Twoja lokalizacja.",
      },
      zuzycie: {
        nazwa: "Zużycie prądu przez pompę w sezonie [kWh]",
        cel: "Opcjonalne: pokazuje, jaką część zużycia zjada defrost.",
        gdzie: "Model sezonowy pompy (Moduł 6) albo licznik energii pompy z poprzedniego sezonu.",
        zakres: "≥ 0. Twoja pompa.",
      },
    },
  },
  "m6d-raport-efektywnosci": {
    pola: {
      powierzchnia: {
        nazwa: "Powierzchnia ogrzewana [m²]",
        cel: "Opcjonalne: dzieli roczne ciepło przez metry — wskaźnik do porównania domów.",
        gdzie: "Projekt, świadectwo energetyczne albo pomiar pomieszczeń ogrzewanych.",
        zakres: "≥ 0. Twój dom.",
      },
      cieploRok: {
        nazwa: "Ciepło na ogrzewanie w roku [kWh]",
        cel: "Z niego wskaźnik na m², prąd i koszt.",
        gdzie: "Puste = suma miesięcy z Ekranu 1 (jeśli wpisano temperatury miesięcy); albo z rachunków za ogrzewanie.",
        zakres: "≥ 0. Twój dom.",
      },
      cena: {
        nazwa: "Cena prądu [{waluta}/kWh]",
        cel: "Opcjonalne: przelicza roczny prąd na {waluta}.",
        gdzie: "Off-grid: koszt kWh z PV/baterii albo z agregatu (Moduł 2); z siecią — rachunek.",
        zakres: "≥ 0. Twoja cena.",
      },
    },
  },
  "plan-poprawy-efektywnosci": {
    migawka: {
      oCoChodzi: "To jak plan naprawczy domu: wiesz, od czego zacząć. Najpierw to, co tanie i szybko się zwraca.",
      jakDziala: "Dla każdego działania: prąd zaoszczędzony = ciepło ÷ COP, oszczędność = prąd × cena, zwrot = koszt ÷ oszczędność na rok. Lista ułożona od najszybszego zwrotu; działania bez kosztu — na końcu, od największej oszczędności.",
      poCo: "Pieniądze na modernizację są ograniczone — kolejność decyduje, ile zaoszczędzisz w pierwszych latach. Off-grid każda kWh mniej to też mniejsza bateria i mniej pracy agregatu.",
      fizyka: "E = Q / COP, Z = E · c, T = K / Z.",
    },
    pola: {
      nazwa: {
        nazwa: "Nazwa działania",
        cel: "Żeby wiedzieć, co jest na której pozycji listy.",
        gdzie: "Np. „Izolacja dachu 20 cm”, „Wymiana okien”, „Rekuperator”.",
        zakres: "Dowolny tekst.",
      },
      oszczednosc: {
        nazwa: "Oszczędność ciepła w roku [kWh]",
        cel: "Ile mniej ciepła dom zużyje po tym działaniu.",
        gdzie: "Ekran „Wpływ czynnika” (Moduł 6) — wynik „przed/po” dla danego czynnika; albo audyt energetyczny.",
        zakres: "≥ 0. Twój dom.",
      },
      koszt: {
        nazwa: "Koszt działania [{waluta}]",
        cel: "Z niego okres zwrotu. Puste = bez zwrotu (działanie na końcu listy).",
        gdzie: "Oferta wykonawcy albo koszt materiałów, jeśli robisz sam.",
        zakres: "≥ 0. Twoja oferta.",
      },
      cop: {
        nazwa: "COP źródła ciepła",
        cel: "Przelicza zaoszczędzone ciepło na prąd: przy pompie ciepła 1 kWh ciepła to mniej niż 1 kWh prądu.",
        gdzie: "Sezonowy COP (SCOP) z modelu sezonowego pompy; grzałka albo kocioł elektryczny = 1.",
        zakres: "≥ 1. Twoje źródło ciepła.",
      },
      cena: {
        nazwa: "Cena prądu [{waluta}/kWh]",
        cel: "Z niej oszczędność na rok i zwrot.",
        gdzie: "Off-grid: koszt kWh z PV/baterii albo z agregatu (Moduł 2); z siecią — rachunek.",
        zakres: "≥ 0. Twoja cena.",
      },
    },
  },
  "nagrzewnica-powietrza": {
    migawka: {
      oCoChodzi: "Nagrzewnica powietrza na paliwo (typu webasto) bierze mało prądu i może być tańszym sposobem dogrzewania niż prąd z baterii — tu liczysz to na swoich danych z karty, a nie na obietnicach.",
      jakDziala: "Koszt 1 kWh ciepła z nagrzewnicy = cena paliwa × zużycie [l/h] ÷ moc cieplna [kW] + własny prąd (pobór [W] ÷ 1000 ÷ moc) × cena prądu. Ogrzewanie prądem = cena prądu ÷ COP (grzałka: COP 1). Aplikacja pokazuje też cenę prądu równowagi i — dla ciepła na dobę — godziny pracy, litry, prąd własny (z rozruchami) oraz jaki to procent baterii w porównaniu z ogrzewaniem prądem.",
      poCo: "Widzisz, czy dogrzewanie nagrzewnicą naprawdę wychodzi taniej niż prądem i ile baterii zabiera — zanim cokolwiek kupisz.",
      fizyka: "c_Q = c_pal·V̇/P + c_el·P_el/(1000·P);  c_el/COP;  c_el* = c_Q,pal / (1/COP − P_el/(1000·P)). Spaliny zawierają tlenek węgla — patrz ostrzeżenia.",
    },
    pola: {
      moc: {
        nazwa: "Moc cieplna na wybranym ustawieniu [kW]",
        cel: "Dzieli zużycie paliwa i pobór prądu na 1 kWh ciepła oraz daje godziny pracy.",
        gdzie: "Karta katalogowa nagrzewnicy — moc cieplna dla ustawienia, na którym będzie pracować.",
        zakres: "Karta katalogowa urządzenia; aplikacja żadnej mocy nie zakłada.",
      },
      zuzycie: {
        nazwa: "Zużycie paliwa przy tej mocy [l/h]",
        cel: "Razem z mocą daje litry i koszt paliwa na 1 kWh ciepła.",
        gdzie: "Karta katalogowa — zużycie dla tego samego ustawienia mocy.",
        zakres: "Karta katalogowa urządzenia.",
      },
      cenaPaliwa: {
        nazwa: "Cena paliwa [{waluta}/l]",
        cel: "Zamienia litry na pieniądze.",
        gdzie: "Cena na stacji / z ostatniego zakupu (zimą — paliwo arktyczne).",
        zakres: "Twoja cena.",
      },
      pobor: {
        nazwa: "Pobór prądu w pracy [W]",
        cel: "Własny prąd nagrzewnicy (wentylator, pompka paliwa, świeca w pracy) — w off-gridzie bierze go bateria.",
        gdzie: "Karta katalogowa; często podawany osobno dla ustawień mocy.",
        zakres: "Puste lub 0 = prąd własny nie jest liczony.",
      },
      rozruch: {
        nazwa: "Energia jednego rozruchu [Wh]",
        cel: "Świeca żarowa pobiera najwięcej przy rozruchu; energia rozruchu jest doliczana do prądu własnego na dobę.",
        gdzie: "Karta katalogowa (moc świecy × czas rozruchu) albo pomiar.",
        zakres: "Puste lub 0 = rozruchy nie są liczone.",
      },
      rozruchy: {
        nazwa: "Liczba rozruchów na dobę",
        cel: "Mnoży energię jednego rozruchu.",
        gdzie: "Zależy od sposobu sterowania (termostat, ręcznie) — z doświadczenia albo z założenia użytkownika.",
        zakres: "Puste lub 0 = rozruchy nie są liczone.",
      },
      cenaPradu: {
        nazwa: "Koszt 1 kWh prądu zimą [{waluta}/kWh]",
        cel: "Wycenia prąd własny nagrzewnicy i ogrzewanie elektryczne, z którym jest porównywana.",
        gdzie: "Twój koszt prądu zimą: z agregatu (litry na kWh × cena paliwa z ekranu „Deficyty miesięczne i agregat”), z sieci albo wyceniony z PV.",
        zakres: "Puste = brak porównania i brak kosztu prądu własnego.",
      },
      cop: {
        nazwa: "COP ogrzewania elektrycznego [–]",
        cel: "Ile kWh ciepła daje 1 kWh prądu w alternatywie, z którą porównujesz nagrzewnicę.",
        gdzie: "Pompa ciepła: SCOP z karty albo z ekranu „COP pompy ciepła”. Grzałka, kocioł, promiennik: zostaw puste (COP = 1).",
        zakres: "Puste = grzanie oporowe, COP 1 (jak w porównaniu kosztów ogrzewania).",
      },
      zapotrzebowanie: {
        nazwa: "Ciepło potrzebne na dobę [kWh]",
        cel: "Pokazuje godziny pracy, litry, prąd własny i procent baterii na dobę.",
        gdzie: "Ekran „Zapotrzebowanie na C.O. i C.W.U.” albo „Straty ciepła budynku”, albo z własnych rachunków.",
        zakres: "Puste = tylko wartości na 1 kWh ciepła.",
      },
      dni: {
        nazwa: "Liczba dni ogrzewania [dni]",
        cel: "Mnoży wynik doby, żeby dać paliwo i koszt w sezonie.",
        gdzie: "Twoje założenie — ile dni nagrzewnica ma dogrzewać w zimie.",
        zakres: "Puste = bez sumy sezonu. Działa tylko z wpisanym ciepłem na dobę.",
      },
      bateria: {
        nazwa: "Użyteczna pojemność baterii [kWh]",
        cel: "Pokazuje, jaki procent baterii zabiera prąd własny nagrzewnicy, a jaki ogrzewanie prądem.",
        gdzie: "Moduł 4 (baterie) albo karta baterii — pojemność użyteczna, nie nominalna.",
        zakres: "Puste = bez wartości w procentach.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "m6d-dobor-mocy-pompy": {
    pola: {
      zapotrzebowanie: {
        nazwa: "Heat load at the design temperature [kW]",
        cel: "How much heat the house loses in the hardest frost — the pump (with backup) must give that much.",
        gdzie: "Screen 1 „Building heat loss” — an empty field takes its result.",
        zakres: "≥ 0. Your building — the app never assumes a typical value for you.",
      },
      mocProj: {
        nazwa: "Pump heating capacity at the design temperature [kW]",
        cel: "Compared with the load — the difference is the margin or the deficit.",
        gdzie: "Datasheet: heating capacity table for outdoor temperatures (e.g. A−20/W35) at your flow temperature. Not the nominal A7/W35 capacity.",
        zakres: "≥ 0. Your pump's datasheet.",
      },
      tProj: {
        nazwa: "Outdoor design temperature [°C]",
        cel: "The temperature at which you compare the pump capacity with the load (start of the lines for the balance point).",
        gdzie: "Screen 1 (climate zone) — an empty field takes its value.",
        zakres: "Your climate zone.",
      },
      tWewn: {
        nazwa: "Indoor temperature [°C]",
        cel: "At this outdoor temperature the load drops to zero — needed for the balance point.",
        gdzie: "Screen 1 — an empty field takes its value.",
        zakres: "Your comfort.",
      },
      tDrugi: {
        nazwa: "Second datasheet point: outdoor temperature [°C]",
        cel: "Optional: with a second point the app draws the pump capacity line and computes the balance point.",
        gdzie: "Datasheet — a second temperature from the capacity table (e.g. A2 or A7).",
        zakres: "Different from the design temperature.",
      },
      mocDrugi: {
        nazwa: "Second datasheet point: pump heating capacity [kW]",
        cel: "Pump capacity at the second temperature — usually higher than in frost.",
        gdzie: "Datasheet — the same table and the same flow temperature.",
        zakres: "≥ 0. Your pump's datasheet.",
      },
      maDogrzew: {
        nazwa: "Backup heat source in the house (heater, stove, boiler)",
        cel: "Sets the level of the warning when the pump lacks power: with no backup heating at all it is a 🔴 stop, with backup — a 🟡 warning.",
        gdzie: "Your house: is there an electric heater in the buffer/on the flow, a stove (best with a water jacket) or a boiler.",
        zakres: "Yes / None / Don't know. „Don't know” counts as 🟡 and asks you to fill it in.",
      },
    },
  },
  "m6d-krzywa-grzewcza": {
    pola: {
      tZewn: {
        nazwa: "Outdoor temperature of a curve point [°C]",
        cel: "Two points (two outdoor temperatures) define the curve line.",
        gdzie: "Pump controller menu (heating curve) or the installer — e.g. +10 °C and −10 °C as in the source example.",
        zakres: "Two different temperatures.",
      },
      tZasil: {
        nazwa: "Current curve: flow temperature [°C]",
        cel: "How many degrees the controller gives on the flow at this outdoor temperature now.",
        gdzie: "Controller menu, or the flow reading in such weather.",
        zakres: "Your settings.",
      },
      tNowa: {
        nazwa: "New curve: flow temperature [°C]",
        cel: "Optional: the curve you want to check — usually lower than the current one.",
        gdzie: "Your proposal (e.g. the current minus a few degrees).",
        zakres: "Not lower than the indoor comfort allows.",
      },
      tOceny: {
        nazwa: "Outdoor comparison temperature [°C]",
        cel: "At this temperature the app reads the flow of both curves.",
        gdzie: "E.g. the heating season mean or a typical January day (Module 1).",
        zakres: "Best between the two curve points.",
      },
      cop: {
        nazwa: "COP at the current flow temperature [–]",
        cel: "Optional: the starting point for the COP range after lowering the curve (source rule {min}–{max}% per °C).",
        gdzie: "Pump datasheet — COP for this outdoor temperature and the current flow temperature.",
        zakres: "≥ 1. Your pump's datasheet.",
      },
      cieplo: {
        nazwa: "Space heating heat per season [kWh]",
        cel: "Optional: turns the COP change into kWh of electricity per season.",
        gdzie: "Screen 2 (sum of heating months) or Screen 1.",
        zakres: "≥ 0. Your Screen 1/2 result.",
      },
    },
  },
  "model-sezonowy-pompy-ciepla": {
    migawka: {
      oCoChodzi: "The pump is your winter appetite — you need to know it so the food does not run out. The catalogue is marketing, reality is your installation and your weather.",
      jakDziala: "For each month: electricity = the month's heat ÷ the pump's COP that month. The sum is the season's consumption, and the season's heat ÷ the season's electricity is your house's real SCOP. Monthly heat comes from Screen 1, COP from the pump datasheet at the month's mean temperature.",
      poCo: "You know how much electricity the pump takes in January and per day in the worst month — the battery, PV or generator must supply that. The comparison with the catalogue SCOP shows what you really lose.",
      fizyka: "E_m = Q_m / COP_m, SCOP = ΣQ / ΣE.",
    },
    pola: {
      cieplo: {
        nazwa: "Space heating heat in the month [kWh]",
        cel: "How much heat the pump must deliver that month.",
        gdzie: "Screen 1 (months) — an empty field takes its result; or Screen 2 × the number of days.",
        zakres: "≥ 0. Empty or 0 = no heating that month.",
      },
      cop: {
        nazwa: "Pump COP in the month [–]",
        cel: "Divides the month's heat — the result is the pump's electricity that month.",
        gdzie: "Pump datasheet: COP at the month's mean temperature (Module 1) and your flow temperature. Months with frosting: COP with defrost from Screen 6.",
        zakres: "≥ 1. Your pump's datasheet.",
      },
      scop: {
        nazwa: "Catalogue SCOP [–]",
        cel: "Optional: comparison with your house's real SCOP.",
        gdzie: "Pump datasheet / energy label (SCOP for the average climate and your flow temperature).",
        zakres: "≥ 1. Your pump's datasheet.",
      },
    },
  },
  "m6d-bufor-praca-pompy": {
    pola: {
      obciazenie: {
        nazwa: "Average heat load in the analysed period [kW]",
        cel: "How much heat the house takes from the water while the pump stands — it sets the standstill and the number of starts.",
        gdzie: "Screen 2 (kWh per day ÷ 24) for the month you check — e.g. a mild one, when cycling is worst.",
        zakres: "≥ 0. Your house. Equal to the pump power or more = continuous run.",
      },
      woda: {
        nazwa: "Water in the installation without a buffer [l]",
        cel: "Without a buffer only this water stores heat between starts.",
        gdzie: "Installation design, or the volume of pipes + radiators/floor loops + the pump's heat exchanger (datasheets).",
        zakres: "≥ 0. Your installation — the app never assumes a typical value for you.",
      },
      histereza: {
        nazwa: "Controller hysteresis [K]",
        cel: "How much the water cools before the pump starts again — with the water volume it gives the heat of one cycle.",
        gdzie: "Pump controller settings (switch-on/switch-off difference).",
        zakres: "> 0. Your controller.",
      },
      dTMagazyn: {
        nazwa: "Buffer charge above minimum [K]",
        cel: "Optional: how many degrees you can „charge” the buffer with PV surplus — gives the stored heat.",
        gdzie: "The highest temperature the pump heats the buffer to, minus the lowest temperature at which the buffer still heats the house.",
        zakres: "≥ 0. Your installation.",
      },
      straty: {
        nazwa: "Buffer standing loss [W]",
        cel: "Optional: the price of a bigger buffer — heat leaking through the insulation.",
        gdzie: "Tank datasheet / energy label (standing loss S in W).",
        zakres: "≥ 0. Your buffer's datasheet.",
      },
      dni: {
        nazwa: "Days of operation per season",
        cel: "Optional: standing losses over the whole season.",
        gdzie: "Length of the heating season (Screen 2), or the days the buffer is hot.",
        zakres: "≥ 0. Your season.",
      },
    },
  },
  "m6d-pompy-cyrkulacyjne-sezon": {
    pola: {
      dni: {
        nazwa: "Days of pump operation per season",
        cel: "Optional: consumption and saving over the whole season = daily result × days.",
        gdzie: "Length of the heating season (Screen 2) — or 365 if the pump (e.g. hot-water circulation) runs all year.",
        zakres: "≥ 0. Your season.",
      },
      cena: {
        nazwa: "Energy price [{waluta}/kWh]",
        cel: "Optional: turns the season's saving into {waluta}.",
        gdzie: "Off-grid: the cost of a kWh from PV/battery or the generator (Module 2); with the grid — the bill.",
        zakres: "≥ 0. Your price.",
      },
    },
  },
  "m6d-przeplyw-pompy-ciepla": {
    pola: {
      moc: {
        nazwa: "Heat pump heating power [kW]",
        cel: "This much heat the water must carry away from the pump.",
        gdzie: "Pump datasheet — heating capacity in your conditions (the largest the pump gives).",
        zakres: "≥ 0. Your pump's datasheet.",
      },
      dT: {
        nazwa: "Flow/return temperature difference across the heat pump [K]",
        cel: "The smaller the difference, the larger the flow needed to carry the same power.",
        gdzie: "Heat pump datasheet (nominal ΔT) or the installation design.",
        zakres: "Source: e.g. {min}–{max} K.",
      },
      przeplyw: {
        nazwa: "Circulation pump flow at its operating point [m³/h]",
        cel: "Optional: comparison with the required flow and the real ΔT across the heat pump.",
        gdzie: "Circulation pump curve (chosen speed) crossed with the installation resistance — from the installer or a flow meter reading.",
        zakres: "≥ 0. Your installation.",
      },
      min: {
        nazwa: "Heat pump minimum flow [m³/h]",
        cel: "Optional: below it the heat pump raises a flow alarm.",
        gdzie: "Heat pump datasheet / installation manual (minimum water flow).",
        zakres: "≥ 0. Your pump's datasheet.",
      },
    },
  },
  "m6d-cwu-pompa-ciepla": {
    pola: {
      tMax: {
        nazwa: "Highest hot-water temperature from the heat pump [°C]",
        cel: "Up to this temperature the pump heats, above it — the heater.",
        gdzie: "Heat pump datasheet (hot-water mode) or the controller setting.",
        zakres: "Source: usually 55–60 °C. Your pump's datasheet.",
      },
      cop: {
        nazwa: "Heat pump COP in hot-water mode",
        cel: "How many kWh of heat from 1 kWh of electricity when heating water — usually less than when heating the house (source).",
        gdzie: "Pump datasheet — hot-water COP at water and air temperatures close to yours (average over the whole heat-up).",
        zakres: "≥ 1. Source: COP 3–4 (example).",
      },
      moc: {
        nazwa: "Heat pump heating power in hot-water mode [kW]",
        cel: "How much heat per hour the pump gives to the tank — the heating time follows from it.",
        gdzie: "Heat pump datasheet (heating power in hot-water mode).",
        zakres: "≥ 0. Your pump's datasheet.",
      },
    },
  },
  "m6d-gwc-pompa-ciepla": {
    pola: {
      parownik: {
        nazwa: "Air flow through the pump evaporator [m³/h]",
        cel: "The larger compared with the GHE flow, the less the GHE raises the intake temperature.",
        gdzie: "Outdoor unit datasheet (fan air flow).",
        zakres: "≥ 0. Your pump's datasheet.",
      },
      moc: {
        nazwa: "Pump heating power [kW]",
        cel: "From it and the COP — how much power the pump takes from the air: P·(1 − 1/COP).",
        gdzie: "Pump datasheet — power in the winter conditions in which the GHE runs.",
        zakres: "≥ 0. Your pump's datasheet.",
      },
      copBez: {
        nazwa: "COP without GHE",
        cel: "Pump efficiency at the current air temperature.",
        gdzie: "Pump datasheet — COP at the outdoor air temperature.",
        zakres: "≥ 1. Your pump's datasheet.",
      },
      copZ: {
        nazwa: "COP with GHE",
        cel: "Optional: efficiency with air warmer by the result above — the COP gain and saving follow from it.",
        gdzie: "Pump datasheet — COP at the air temperature raised by the computed rise (interpolate between datasheet columns).",
        zakres: "≥ 1. Source: examples only (+3 °C → +6%).",
      },
      cieplo: {
        nazwa: "Heat from the pump while the GHE runs [kWh]",
        cel: "Optional: turns the COP gain into electricity saved.",
        gdzie: "Demand from Screen 2 or the seasonal model — only for the months/days the GHE runs.",
        zakres: "≥ 0. Your house.",
      },
    },
  },
  "m6d-defrost-sezon": {
    pola: {
      odstep: {
        nazwa: "Interval between defrosts in this weather [min]",
        cel: "The more often the defrost, the more energy — in light frost and humidity the interval is shorter (source).",
        gdzie: "The pump controller's operating history, observation or the manufacturer's datasheet for these conditions.",
        zakres: "> defrost time. Source: e.g. every 35 min in fog at −2 °C.",
      },
      czas: {
        nazwa: "Duration of one defrost [min]",
        cel: "During this time the pump does not heat the house and draws the defrost power.",
        gdzie: "Controller history or observation (the outdoor unit steams, the fan stops).",
        zakres: "> 0. Source: e.g. 4 min.",
      },
      godziny: {
        nazwa: "Hours per day in this weather [h]",
        cel: "Defrost only runs while the evaporator frosts up.",
        gdzie: "Your estimate or regional weather data (e.g. how many hours the morning fog lasts).",
        zakres: "0–24. Your location.",
      },
      dni: {
        nazwa: "Days per season with this weather",
        cel: "Multiplies the daily energy over the season.",
        gdzie: "Regional weather data or your experience from previous winters.",
        zakres: "≥ 0. Your location.",
      },
      zuzycie: {
        nazwa: "Pump electricity consumption per season [kWh]",
        cel: "Optional: shows what part of the consumption the defrost eats.",
        gdzie: "The pump's seasonal model (Module 6) or the pump's energy meter from the previous season.",
        zakres: "≥ 0. Your pump.",
      },
    },
  },
  "m6d-raport-efektywnosci": {
    pola: {
      powierzchnia: {
        nazwa: "Heated floor area [m²]",
        cel: "Optional: divides the yearly heat by the area — an index to compare houses.",
        gdzie: "Design, energy certificate or measuring the heated rooms.",
        zakres: "≥ 0. Your house.",
      },
      cieploRok: {
        nazwa: "Heating heat per year [kWh]",
        cel: "The per-m² index, electricity and cost follow from it.",
        gdzie: "Empty = sum of months from Screen 1 (if monthly temperatures were entered); or from heating bills.",
        zakres: "≥ 0. Your house.",
      },
      cena: {
        nazwa: "Electricity price [{waluta}/kWh]",
        cel: "Optional: turns the yearly electricity into {waluta}.",
        gdzie: "Off-grid: the cost of a kWh from PV/battery or the generator (Module 2); with the grid — the bill.",
        zakres: "≥ 0. Your price.",
      },
    },
  },
  "plan-poprawy-efektywnosci": {
    migawka: {
      oCoChodzi: "It is like a repair plan for the house: you know where to start. First what is cheap and pays back quickly.",
      jakDziala: "For each measure: electricity saved = heat ÷ COP, money = electricity × price, payback = cost ÷ money per year. The list is ordered from the quickest payback; measures without a cost go last, from the largest saving.",
      poCo: "Money for upgrades is limited — the order decides how much you save in the first years. Off-grid every kWh less also means a smaller battery and less generator running.",
      fizyka: "E = Q / COP, Z = E · c, T = K / Z.",
    },
    pola: {
      nazwa: {
        nazwa: "Measure name",
        cel: "So you know what is where on the list.",
        gdzie: "E.g. “Roof insulation 20 cm”, “Window replacement”, “Heat recovery unit”.",
        zakres: "Any text.",
      },
      oszczednosc: {
        nazwa: "Heat saving per year [kWh]",
        cel: "How much less heat the house uses after this measure.",
        gdzie: "The “factor impact” screen (Module 6) — the before/after result for that factor; or an energy audit.",
        zakres: "≥ 0. Your house.",
      },
      koszt: {
        nazwa: "Cost of the measure [{waluta}]",
        cel: "The payback follows from it. Empty = no payback (the measure goes to the end).",
        gdzie: "A contractor's quote or the material cost if you do it yourself.",
        zakres: "≥ 0. Your quote.",
      },
      cop: {
        nazwa: "Heat source COP",
        cel: "Turns the heat saved into electricity: with a heat pump 1 kWh of heat is less than 1 kWh of electricity.",
        gdzie: "Seasonal COP (SCOP) from the pump's seasonal model; heater or electric boiler = 1.",
        zakres: "≥ 1. Your heat source.",
      },
      cena: {
        nazwa: "Electricity price [{waluta}/kWh]",
        cel: "Money per year and the payback follow from it.",
        gdzie: "Off-grid: the cost of a kWh from PV/battery or the generator (Module 2); with the grid — the bill.",
        zakres: "≥ 0. Your price.",
      },
    },
  },
  "nagrzewnica-powietrza": {
    migawka: {
      oCoChodzi: "A fuel-fired air heater (Webasto type) draws little electricity and can be a cheaper way to top up the heating than battery power — here you work it out with your own datasheet figures, not promises.",
      jakDziala: "Cost of 1 kWh of heat from the heater = fuel price × use [l/h] ÷ heat output [kW] + own electricity (draw [W] ÷ 1000 ÷ output) × electricity price. Electric heating = electricity price ÷ COP (heating element: COP 1). The app also shows the break-even electricity price and — for a daily heat demand — running hours, litres, own electricity (with starts) and what percent of the battery it is compared with electric heating.",
      poCo: "You see whether topping up with the heater really is cheaper than electricity and how much battery it takes — before you buy anything.",
      fizyka: "c_Q = c_fuel·V̇/P + c_el·P_el/(1000·P);  c_el/COP;  c_el* = c_Q,fuel / (1/COP − P_el/(1000·P)). The exhaust contains carbon monoxide — see the warnings.",
    },
    pola: {
      moc: {
        nazwa: "Heat output at the chosen setting [kW]",
        cel: "Divides fuel use and electric draw per 1 kWh of heat and gives the running hours.",
        gdzie: "Heater datasheet — the heat output of the setting it will run at.",
        zakres: "The device datasheet; the app assumes no output.",
      },
      zuzycie: {
        nazwa: "Fuel use at this output [l/h]",
        cel: "Together with the output gives litres and fuel cost per 1 kWh of heat.",
        gdzie: "Datasheet — use at the same output setting.",
        zakres: "The device datasheet.",
      },
      cenaPaliwa: {
        nazwa: "Fuel price [{waluta}/l]",
        cel: "Turns litres into money.",
        gdzie: "Pump price / your last purchase (in winter — arctic-grade fuel).",
        zakres: "Your price.",
      },
      pobor: {
        nazwa: "Electric draw while running [W]",
        cel: "The heater's own electricity (fan, fuel pump, glow plug while running) — in an off-grid system the battery supplies it.",
        gdzie: "Datasheet; often given separately per output setting.",
        zakres: "Empty or 0 = own electricity is not counted.",
      },
      rozruch: {
        nazwa: "Energy of one start [Wh]",
        cel: "The glow plug draws the most at start-up; the start energy is added to the own electricity per day.",
        gdzie: "Datasheet (plug power × start time) or a measurement.",
        zakres: "Empty or 0 = starts are not counted.",
      },
      rozruchy: {
        nazwa: "Starts per day",
        cel: "Multiplies the energy of one start.",
        gdzie: "Depends on the control (thermostat, manual) — from experience or the user's own assumption.",
        zakres: "Empty or 0 = starts are not counted.",
      },
      cenaPradu: {
        nazwa: "Cost of 1 kWh of electricity in winter [{waluta}/kWh]",
        cel: "Prices the heater's own electricity and the electric heating it is compared with.",
        gdzie: "Your winter cost of electricity: from a generator (litres per kWh × fuel price from the “Monthly shortfalls and the generator” screen), from the grid or valued from PV.",
        zakres: "Empty = no comparison and no cost of own electricity.",
      },
      cop: {
        nazwa: "COP of electric heating [–]",
        cel: "How many kWh of heat 1 kWh of electricity gives in the alternative the heater is compared with.",
        gdzie: "Heat pump: SCOP from the datasheet or from the “Heat pump COP” screen. Heating element, boiler, panel: leave empty (COP = 1).",
        zakres: "Empty = resistive heating, COP 1 (as in the heating cost comparison).",
      },
      zapotrzebowanie: {
        nazwa: "Heat needed per day [kWh]",
        cel: "Shows running hours, litres, own electricity and percent of the battery per day.",
        gdzie: "The “Space heating and DHW demand” or “Building heat loss” screen, or your own bills.",
        zakres: "Empty = only the values per 1 kWh of heat.",
      },
      dni: {
        nazwa: "Number of heating days [days]",
        cel: "Multiplies the daily result to give fuel and cost over the season.",
        gdzie: "Your assumption — how many days the heater is to top up the heating in winter.",
        zakres: "Empty = no season total. Works only with the daily heat entered.",
      },
      bateria: {
        nazwa: "Usable battery capacity [kWh]",
        cel: "Shows what percent of the battery the heater's own electricity takes and what percent electric heating would take.",
        gdzie: "Module 4 (batteries) or the battery datasheet — usable, not nominal capacity.",
        zakres: "Empty = no percent values.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "m6d-dobor-mocy-pompy": {
    pola: {
      zapotrzebowanie: {
        nazwa: "Тепловая нагрузка при расчётной температуре [кВт]",
        cel: "Сколько тепла дом теряет в самый сильный мороз — столько насос (с догревом) должен дать.",
        gdzie: "Экран 1 «Теплопотери здания» — пустое поле берёт его результат.",
        zakres: "≥ 0. Ваш дом — приложение не подставляет типичное значение за вас.",
      },
      mocProj: {
        nazwa: "Тепловая мощность насоса при расчётной температуре [кВт]",
        cel: "Сравнивается с нагрузкой — разница это запас или дефицит.",
        gdzie: "Паспорт: таблица тепловой мощности для наружных температур (например A−20/W35) при вашей температуре подачи. Не номинальная мощность A7/W35.",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
      tProj: {
        nazwa: "Расчётная наружная температура [°C]",
        cel: "Температура, при которой сравнивается мощность насоса с нагрузкой (начало прямых для бивалентной точки).",
        gdzie: "Экран 1 (климатическая зона) — пустое поле берёт его значение.",
        zakres: "Ваша климатическая зона.",
      },
      tWewn: {
        nazwa: "Температура в доме [°C]",
        cel: "При такой наружной температуре нагрузка падает до нуля — нужно для бивалентной точки.",
        gdzie: "Экран 1 — пустое поле берёт его значение.",
        zakres: "Ваш комфорт.",
      },
      tDrugi: {
        nazwa: "Вторая точка паспорта: наружная температура [°C]",
        cel: "Необязательно: со второй точкой приложение строит прямую мощности насоса и считает бивалентную точку.",
        gdzie: "Паспорт — вторая температура из таблицы мощности (например A2 или A7).",
        zakres: "Отличная от расчётной температуры.",
      },
      mocDrugi: {
        nazwa: "Вторая точка паспорта: тепловая мощность насоса [кВт]",
        cel: "Мощность насоса при второй температуре — обычно выше, чем в мороз.",
        gdzie: "Паспорт — та же таблица и та же температура подачи.",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
      maDogrzew: {
        nazwa: "Резервный источник тепла в доме (ТЭН, камин, котёл)",
        cel: "Определяет уровень предупреждения при нехватке мощности насоса: без догрева — стоп 🔴, с догревом — предупреждение 🟡.",
        gdzie: "Ваш дом: есть ли электрический ТЭН в буфере/на подаче, камин (лучше с водяной рубашкой) или котёл.",
        zakres: "Есть / Нет / Не знаю. «Не знаю» считается как 🟡 и просит указать.",
      },
    },
  },
  "m6d-krzywa-grzewcza": {
    pola: {
      tZewn: {
        nazwa: "Наружная температура точки кривой [°C]",
        cel: "Две точки (две наружные температуры) задают прямую кривой.",
        gdzie: "Меню контроллера насоса (отопительная кривая) или монтажник — например +10 °C и −10 °C, как в примере источника.",
        zakres: "Две разные температуры.",
      },
      tZasil: {
        nazwa: "Текущая кривая: температура подачи [°C]",
        cel: "Сколько градусов контроллер сейчас даёт на подаче при этой наружной температуре.",
        gdzie: "Меню контроллера или показание подачи в такую погоду.",
        zakres: "Ваши настройки.",
      },
      tNowa: {
        nazwa: "Новая кривая: температура подачи [°C]",
        cel: "Необязательно: кривая, которую хотите проверить, — обычно ниже текущей.",
        gdzie: "Ваше предложение (например, текущая минус несколько градусов).",
        zakres: "Не ниже, чем позволяет комфорт в доме.",
      },
      tOceny: {
        nazwa: "Наружная температура сравнения [°C]",
        cel: "При этой температуре приложение считывает подачу обеих кривых.",
        gdzie: "Например, средняя отопительного сезона или типичный январский день (модуль 1).",
        zakres: "Лучше между двумя точками кривой.",
      },
      cop: {
        nazwa: "COP при текущей подаче [–]",
        cel: "Необязательно: отправная точка для диапазона COP после снижения кривой (правило источника {min}–{max}% на °C).",
        gdzie: "Паспорт насоса — COP для этой наружной температуры и текущей подачи.",
        zakres: "≥ 1. Паспорт вашего насоса.",
      },
      cieplo: {
        nazwa: "Тепло на отопление за сезон [кВт·ч]",
        cel: "Необязательно: переводит изменение COP в кВт·ч электричества за сезон.",
        gdzie: "Экран 2 (сумма месяцев отопления) или экран 1.",
        zakres: "≥ 0. Результат вашего экрана 1/2.",
      },
    },
  },
  "model-sezonowy-pompy-ciepla": {
    migawka: {
      oCoChodzi: "Насос — ваш зимний аппетит: его нужно знать, чтобы еды хватило. Каталог — это маркетинг, реальность — ваша установка и ваша погода.",
      jakDziala: "Для каждого месяца: электричество = тепло месяца ÷ COP насоса в этом месяце. Сумма — потребление за сезон, а тепло сезона ÷ электричество сезона — реальный SCOP вашего дома. Тепло месяцев берётся с экрана 1, COP — из паспорта насоса при средней температуре месяца.",
      poCo: "Вы знаете, сколько электричества насос возьмёт в январе и за сутки в худший месяц — столько должны дать батарея, PV или генератор. Сравнение с каталожным SCOP показывает, сколько вы реально теряете.",
      fizyka: "E_m = Q_m / COP_m, SCOP = ΣQ / ΣE.",
    },
    pola: {
      cieplo: {
        nazwa: "Тепло на отопление за месяц [кВт·ч]",
        cel: "Сколько тепла насос должен дать в этом месяце.",
        gdzie: "Экран 1 (месяцы) — пустое поле берёт его результат; или экран 2 × число дней.",
        zakres: "≥ 0. Пусто или 0 = в этом месяце не отапливаете.",
      },
      cop: {
        nazwa: "COP насоса в месяце [–]",
        cel: "Делит тепло месяца — результат это электричество насоса за месяц.",
        gdzie: "Паспорт насоса: COP при средней температуре месяца (модуль 1) и вашей температуре подачи. Месяцы с обмерзанием: COP с оттайкой с экрана 6.",
        zakres: "≥ 1. Паспорт вашего насоса.",
      },
      scop: {
        nazwa: "Каталожный SCOP [–]",
        cel: "Необязательно: сравнение с реальным SCOP вашего дома.",
        gdzie: "Паспорт насоса / энергетическая этикетка (SCOP для умеренного климата и вашей температуры подачи).",
        zakres: "≥ 1. Паспорт вашего насоса.",
      },
    },
  },
  "m6d-bufor-praca-pompy": {
    pola: {
      obciazenie: {
        nazwa: "Средняя тепловая нагрузка в анализируемый период [кВт]",
        cel: "Столько тепла дом забирает из воды, пока насос стоит, — от этого зависят длина простоя и число пусков.",
        gdzie: "Экран 2 (кВт·ч в сутки ÷ 24) для проверяемого месяца — например, межсезонного, когда тактование сильнее всего.",
        zakres: "≥ 0. Ваш дом. Равно мощности насоса или больше = непрерывная работа.",
      },
      woda: {
        nazwa: "Вода в системе без буфера [л]",
        cel: "Без буфера только эта вода запасает тепло между пусками.",
        gdzie: "Проект системы или объём труб + радиаторов/петель тёплого пола + теплообменника насоса (паспорта).",
        zakres: "≥ 0. Ваша система — приложение не подставляет типичное значение за вас.",
      },
      histereza: {
        nazwa: "Гистерезис контроллера [K]",
        cel: "На сколько остывает вода, прежде чем насос снова запустится, — вместе с объёмом воды даёт тепло одного цикла.",
        gdzie: "Настройки контроллера насоса (разница включения/выключения).",
        zakres: "> 0. Ваш контроллер.",
      },
      dTMagazyn: {
        nazwa: "Зарядка буфера выше минимума [K]",
        cel: "Необязательно: на сколько градусов можно «зарядить» буфер избытком PV — даёт запасённое тепло.",
        gdzie: "Максимальная температура, до которой насос греет буфер, минус минимальная, при которой буфер ещё отапливает дом.",
        zakres: "≥ 0. Ваша система.",
      },
      straty: {
        nazwa: "Потери буфера в простое [Вт]",
        cel: "Необязательно: цена большего буфера — тепло, уходящее через изоляцию.",
        gdzie: "Паспорт / энергетическая этикетка бака (потери в простое S, Вт).",
        zakres: "≥ 0. Паспорт вашего буфера.",
      },
      dni: {
        nazwa: "Дней работы за сезон",
        cel: "Необязательно: потери в простое за весь сезон.",
        gdzie: "Длина отопительного сезона (экран 2) или дни, когда буфер горячий.",
        zakres: "≥ 0. Ваш сезон.",
      },
    },
  },
  "m6d-pompy-cyrkulacyjne-sezon": {
    pola: {
      dni: {
        nazwa: "Дней работы насоса за сезон",
        cel: "Необязательно: потребление и экономия за весь сезон = суточный результат × дни.",
        gdzie: "Длина отопительного сезона (экран 2) — или 365, если насос (например, циркуляция ГВС) работает весь год.",
        zakres: "≥ 0. Ваш сезон.",
      },
      cena: {
        nazwa: "Цена энергии [{waluta}/кВт·ч]",
        cel: "Необязательно: переводит экономию за сезон в {waluta}.",
        gdzie: "Off-grid: стоимость кВт·ч от PV/батареи или генератора (модуль 2); с сетью — счёт.",
        zakres: "≥ 0. Ваша цена.",
      },
    },
  },
  "m6d-przeplyw-pompy-ciepla": {
    pola: {
      moc: {
        nazwa: "Тепловая мощность теплового насоса [кВт]",
        cel: "Столько тепла вода должна забрать от насоса.",
        gdzie: "Паспорт насоса — тепловая мощность в ваших условиях (наибольшая, которую насос даёт).",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
      dT: {
        nazwa: "Разница температур подача/обратка на тепловом насосе [K]",
        cel: "Чем меньше разница, тем больший расход нужен для переноса той же мощности.",
        gdzie: "Паспорт теплового насоса (номинальная ΔT) или проект системы.",
        zakres: "Источник: например {min}–{max} K.",
      },
      przeplyw: {
        nazwa: "Расход циркуляционного насоса в рабочей точке [м³/ч]",
        cel: "Необязательно: сравнение с требуемым расходом и реальная ΔT на тепловом насосе.",
        gdzie: "Кривая циркуляционного насоса (выбранная скорость) в пересечении с сопротивлением системы — от монтажника или по расходомеру.",
        zakres: "≥ 0. Ваша система.",
      },
      min: {
        nazwa: "Минимальный расход теплового насоса [м³/ч]",
        cel: "Необязательно: ниже него тепловой насос выдаёт аварию расхода.",
        gdzie: "Паспорт теплового насоса / инструкция по монтажу (минимальный расход воды).",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
    },
  },
  "m6d-cwu-pompa-ciepla": {
    pola: {
      tMax: {
        nazwa: "Наибольшая температура ГВС от теплового насоса [°C]",
        cel: "До этой температуры греет насос, выше — ТЭН.",
        gdzie: "Паспорт теплового насоса (режим ГВС) или настройка контроллера.",
        zakres: "Источник: обычно 55–60 °C. Паспорт вашего насоса.",
      },
      cop: {
        nazwa: "COP насоса в режиме ГВС",
        cel: "Сколько кВт·ч тепла из 1 кВт·ч электричества при нагреве воды — обычно меньше, чем при отоплении дома (источник).",
        gdzie: "Паспорт насоса — COP для ГВС при температурах воды и воздуха, близких к вашим (средний за весь нагрев).",
        zakres: "≥ 1. Источник: COP 3–4 (пример).",
      },
      moc: {
        nazwa: "Тепловая мощность насоса в режиме ГВС [кВт]",
        cel: "Сколько тепла в час насос отдаёт в бойлер — из неё время нагрева.",
        gdzie: "Паспорт теплового насоса (тепловая мощность в режиме ГВС).",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
    },
  },
  "m6d-gwc-pompa-ciepla": {
    pola: {
      parownik: {
        nazwa: "Расход воздуха через испаритель насоса [м³/ч]",
        cel: "Чем он больше по сравнению с расходом ГТО, тем меньше ГТО поднимет температуру на входе.",
        gdzie: "Паспорт наружного блока (расход воздуха вентилятора).",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
      moc: {
        nazwa: "Тепловая мощность насоса [кВт]",
        cel: "Из неё и COP — сколько мощности насос берёт из воздуха: P·(1 − 1/COP).",
        gdzie: "Паспорт насоса — мощность в зимних условиях, в которых работает ГТО.",
        zakres: "≥ 0. Паспорт вашего насоса.",
      },
      copBez: {
        nazwa: "COP без ГТО",
        cel: "Эффективность насоса при текущей температуре воздуха.",
        gdzie: "Паспорт насоса — COP при температуре наружного воздуха.",
        zakres: "≥ 1. Паспорт вашего насоса.",
      },
      copZ: {
        nazwa: "COP с ГТО",
        cel: "Необязательно: эффективность при воздухе, тёплом на результат выше — из неё рост COP и экономия.",
        gdzie: "Паспорт насоса — COP при температуре воздуха, поднятой на вычисленный рост (интерполируйте между колонками паспорта).",
        zakres: "≥ 1. Источник: только примеры (+3 °C → +6%).",
      },
      cieplo: {
        nazwa: "Тепло от насоса за период работы ГТО [кВт·ч]",
        cel: "Необязательно: переводит рост COP в экономию электроэнергии.",
        gdzie: "Потребность с экрана 2 или сезонной модели — только за месяцы/дни работы ГТО.",
        zakres: "≥ 0. Ваш дом.",
      },
    },
  },
  "m6d-defrost-sezon": {
    pola: {
      odstep: {
        nazwa: "Интервал между оттайками в этой погоде [мин]",
        cel: "Чем чаще оттайка, тем больше энергии — при лёгком морозе и влажности интервал короче (источник).",
        gdzie: "История работы контроллера насоса, наблюдение или паспорт производителя для этих условий.",
        zakres: "> времени оттайки. Источник: например, каждые 35 мин при тумане и −2 °C.",
      },
      czas: {
        nazwa: "Длительность одной оттайки [мин]",
        cel: "В это время насос не греет дом и потребляет мощность оттайки.",
        gdzie: "История контроллера или наблюдение (наружный блок парит, вентилятор стоит).",
        zakres: "> 0. Источник: например, 4 мин.",
      },
      godziny: {
        nazwa: "Часов в сутки в этой погоде [ч]",
        cel: "Оттайка работает, только пока испаритель обмерзает.",
        gdzie: "Ваша оценка или погодные данные региона (например, сколько часов длится утренний туман).",
        zakres: "0–24. Ваше местоположение.",
      },
      dni: {
        nazwa: "Дней за сезон с этой погодой",
        cel: "Умножает суточную энергию на весь сезон.",
        gdzie: "Погодные данные региона или ваш опыт прошлых зим.",
        zakres: "≥ 0. Ваше местоположение.",
      },
      zuzycie: {
        nazwa: "Потребление электроэнергии насосом за сезон [кВт·ч]",
        cel: "Необязательно: показывает, какую часть потребления съедает оттайка.",
        gdzie: "Сезонная модель насоса (модуль 6) или счётчик энергии насоса за прошлый сезон.",
        zakres: "≥ 0. Ваш насос.",
      },
    },
  },
  "m6d-raport-efektywnosci": {
    pola: {
      powierzchnia: {
        nazwa: "Отапливаемая площадь [м²]",
        cel: "Необязательно: делит годовое тепло на площадь — показатель для сравнения домов.",
        gdzie: "Проект, энергетический сертификат или замер отапливаемых помещений.",
        zakres: "≥ 0. Ваш дом.",
      },
      cieploRok: {
        nazwa: "Тепло на отопление в год [кВт·ч]",
        cel: "Из него — показатель на м², электроэнергия и стоимость.",
        gdzie: "Пусто = сумма месяцев с экрана 1 (если введены температуры месяцев); или по счетам за отопление.",
        zakres: "≥ 0. Ваш дом.",
      },
      cena: {
        nazwa: "Цена электроэнергии [{waluta}/кВт·ч]",
        cel: "Необязательно: переводит годовую электроэнергию в {waluta}.",
        gdzie: "Off-grid: стоимость кВт·ч от PV/батареи или генератора (модуль 2); с сетью — счёт.",
        zakres: "≥ 0. Ваша цена.",
      },
    },
  },
  "plan-poprawy-efektywnosci": {
    migawka: {
      oCoChodzi: "Это как план ремонта дома: понятно, с чего начать. Сначала то, что дёшево и быстро окупается.",
      jakDziala: "Для каждого мероприятия: сэкономленная электроэнергия = тепло ÷ COP, деньги = электроэнергия × цена, окупаемость = стоимость ÷ деньги в год. Список упорядочен по самой быстрой окупаемости; мероприятия без стоимости — в конце, по наибольшей экономии.",
      poCo: "Деньги на модернизацию ограничены — порядок решает, сколько вы сэкономите в первые годы. В автономном доме каждый кВт·ч меньше — это ещё и меньшая батарея и меньше работы генератора.",
      fizyka: "E = Q / COP, Z = E · c, T = K / Z.",
    },
    pola: {
      nazwa: {
        nazwa: "Название мероприятия",
        cel: "Чтобы знать, что на какой позиции списка.",
        gdzie: "Например, «Утепление крыши 20 см», «Замена окон», «Рекуператор».",
        zakres: "Любой текст.",
      },
      oszczednosc: {
        nazwa: "Экономия тепла в год [кВт·ч]",
        cel: "Насколько меньше тепла дом потребит после этого мероприятия.",
        gdzie: "Экран «влияние фактора» (модуль 6) — результат «до/после» для этого фактора; или энергоаудит.",
        zakres: "≥ 0. Ваш дом.",
      },
      koszt: {
        nazwa: "Стоимость мероприятия [{waluta}]",
        cel: "Из неё — срок окупаемости. Пусто = без окупаемости (мероприятие в конце списка).",
        gdzie: "Предложение подрядчика или стоимость материалов, если делаете сами.",
        zakres: "≥ 0. Ваше предложение.",
      },
      cop: {
        nazwa: "COP источника тепла",
        cel: "Переводит сэкономленное тепло в электроэнергию: с тепловым насосом 1 кВт·ч тепла — это меньше 1 кВт·ч электроэнергии.",
        gdzie: "Сезонный COP (SCOP) из сезонной модели насоса; ТЭН или электрокотёл = 1.",
        zakres: "≥ 1. Ваш источник тепла.",
      },
      cena: {
        nazwa: "Цена электроэнергии [{waluta}/кВт·ч]",
        cel: "Из неё — деньги в год и окупаемость.",
        gdzie: "Off-grid: стоимость кВт·ч от PV/батареи или генератора (модуль 2); с сетью — счёт.",
        zakres: "≥ 0. Ваша цена.",
      },
    },
  },
  "nagrzewnica-powietrza": {
    migawka: {
      oCoChodzi: "Топливный воздушный отопитель (типа Webasto) потребляет мало электричества и может быть дешевле для догрева, чем электричество из батареи — здесь вы считаете это на своих паспортных данных, а не на обещаниях.",
      jakDziala: "Стоимость 1 кВт·ч тепла от отопителя = цена топлива × расход [л/ч] ÷ тепловая мощность [кВт] + собственное электричество (потребление [Вт] ÷ 1000 ÷ мощность) × цена электричества. Электрообогрев = цена электричества ÷ COP (ТЭН: COP 1). Приложение показывает также цену электричества безубыточности и — для суточной потребности в тепле — часы работы, литры, собственное электричество (с запусками) и какой это процент батареи по сравнению с электрообогревом.",
      poCo: "Вы видите, действительно ли догрев отопителем дешевле электричества и сколько батареи он забирает — до любой покупки.",
      fizyka: "c_Q = c_топл·V̇/P + c_эл·P_эл/(1000·P);  c_эл/COP;  c_эл* = c_Q,топл / (1/COP − P_эл/(1000·P)). Выхлоп содержит угарный газ — см. предупреждения.",
    },
    pola: {
      moc: {
        nazwa: "Тепловая мощность на выбранной ступени [кВт]",
        cel: "Делит расход топлива и потребление электричества на 1 кВт·ч тепла и даёт часы работы.",
        gdzie: "Паспорт отопителя — тепловая мощность ступени, на которой он будет работать.",
        zakres: "Паспорт устройства; приложение никакую мощность не предполагает.",
      },
      zuzycie: {
        nazwa: "Расход топлива при этой мощности [л/ч]",
        cel: "Вместе с мощностью даёт литры и стоимость топлива на 1 кВт·ч тепла.",
        gdzie: "Паспорт — расход на той же ступени мощности.",
        zakres: "Паспорт устройства.",
      },
      cenaPaliwa: {
        nazwa: "Цена топлива [{waluta}/л]",
        cel: "Переводит литры в деньги.",
        gdzie: "Цена на заправке / последней покупки (зимой — арктическое топливо).",
        zakres: "Ваша цена.",
      },
      pobor: {
        nazwa: "Потребление электричества в работе [Вт]",
        cel: "Собственное электричество отопителя (вентилятор, топливный насос, свеча в работе) — в off-grid его даёт батарея.",
        gdzie: "Паспорт; часто указывается отдельно для ступеней мощности.",
        zakres: "Пусто или 0 = собственное электричество не учитывается.",
      },
      rozruch: {
        nazwa: "Энергия одного запуска [Вт·ч]",
        cel: "Свеча накаливания потребляет больше всего при запуске; энергия запуска добавляется к собственному электричеству за сутки.",
        gdzie: "Паспорт (мощность свечи × время запуска) или измерение.",
        zakres: "Пусто или 0 = запуски не учитываются.",
      },
      rozruchy: {
        nazwa: "Число запусков в сутки",
        cel: "Умножает энергию одного запуска.",
        gdzie: "Зависит от управления (термостат, вручную) — из опыта или допущения пользователя.",
        zakres: "Пусто или 0 = запуски не учитываются.",
      },
      cenaPradu: {
        nazwa: "Стоимость 1 кВт·ч электричества зимой [{waluta}/кВт·ч]",
        cel: "Оценивает собственное электричество отопителя и электрообогрев, с которым он сравнивается.",
        gdzie: "Ваша зимняя стоимость электричества: от генератора (литры на кВт·ч × цена топлива с экрана «Месячные дефициты и генератор»), из сети или оценённая из PV.",
        zakres: "Пусто = нет сравнения и нет стоимости собственного электричества.",
      },
      cop: {
        nazwa: "COP электрообогрева [–]",
        cel: "Сколько кВт·ч тепла даёт 1 кВт·ч электричества в альтернативе, с которой сравнивается отопитель.",
        gdzie: "Тепловой насос: SCOP из паспорта или с экрана «COP теплового насоса». ТЭН, котёл, панель: оставьте пустым (COP = 1).",
        zakres: "Пусто = резистивный нагрев, COP 1 (как в сравнении стоимости отопления).",
      },
      zapotrzebowanie: {
        nazwa: "Тепло, нужное в сутки [кВт·ч]",
        cel: "Показывает часы работы, литры, собственное электричество и процент батареи за сутки.",
        gdzie: "Экран «Потребность в тепле на отопление и ГВС» или «Потери тепла здания», либо ваши счета.",
        zakres: "Пусто = только значения на 1 кВт·ч тепла.",
      },
      dni: {
        nazwa: "Число дней отопления [дн.]",
        cel: "Умножает суточный результат, чтобы получить топливо и стоимость за сезон.",
        gdzie: "Ваше допущение — сколько дней отопитель должен догревать зимой.",
        zakres: "Пусто = без суммы за сезон. Работает только при введённом тепле на сутки.",
      },
      bateria: {
        nazwa: "Полезная ёмкость батареи [кВт·ч]",
        cel: "Показывает, какой процент батареи забирает собственное электричество отопителя, а какой — электрообогрев.",
        gdzie: "Модуль 4 (батареи) или паспорт батареи — полезная, а не номинальная ёмкость.",
        zakres: "Пусто = без значений в процентах.",
      },
    },
  },
}
