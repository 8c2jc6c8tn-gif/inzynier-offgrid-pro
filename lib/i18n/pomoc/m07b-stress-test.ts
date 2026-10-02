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
        nazwa: "Cena paliwa [zł/l]",
        cel: "Zamienia litry na złotówki.",
        gdzie: "Cena na stacji / z ostatniego zakupu.",
        zakres: "Twoja cena.",
      },
      serwis: {
        nazwa: "Serwis i olej na motogodzinę [zł/h]",
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
        cel: "Dobowy deficyt = zapotrzebowanie − produkcja PV tej doby (nie mniej niż 0). Ta sama wartość jest użyta dla każdego miesiąca.",
        gdzie: "Moduł 2 (zapotrzebowanie energetyczne) albo licznik: roczne zużycie ÷ 365, najlepiej dla zimy.",
        zakres: "Twój dom; zimą zwykle wyższe niż średnia roczna.",
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
    },
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
      "jakDziala": "Wybierz rodzaj osadu, wpisz kąt paneli, normalną produkcję na dobę, ile dni osad zostanie i ile produkcji zostaje pod nim. Aplikacja policzy utraconą energię i powie, czy sypki śnieg zsunie się sam (kąt powyżej {prog}°).",
      "poCo": "Wiesz, ile energii musi zastąpić bateria albo agregat i czy warto odśnieżać.",
      "fizyka": "E = E_doba · dni · (1 − p). Śnieg sypki zsuwa się przy kącie > {prog}° (ten sam próg co Moduł 3 „Czystość i śnieg”); mokry się przykleja; gołoledź i szron blokują światło całkowicie."
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
        "nazwa": "Dni zalegania osadu",
        "cel": "Mnoży stratę doby.",
        "gdzie": "Obserwacja albo prognoza odwilży (źródło: przy −5 °C śnieg ok. 3 dni).",
        "zakres": "Twoja ocena — aplikacja nie ma modelu topnienia."
      },
      "pozostala": {
        "nazwa": "Produkcja pod osadem [% normalnej]",
        "cel": "Jaka część światła przechodzi przez osad.",
        "gdzie": "Obserwacja falownika; źródło: śnieg 0%, szadź po 48 h ok. 5%.",
        "zakres": "0–100%."
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
      "jakDziala": "Wpisz normalną produkcję na dobę, ile dni utrzyma się mgła z szadzią i ile produkcji zostaje pod szadzią. Aplikacja policzy utraconą energię — tę samą fizyką co ekran śniegu na PV.",
      "poCo": "Kilkudniowa mgła potrafi zabrać prawie całą produkcję — wiesz, ile musi pokryć bateria i agregat.",
      "fizyka": "E = E_doba · dni · (1 − p). Przykład źródła: po 48 h mgły i szadzi produkcja spada do 5% nominalnej (p = 5%)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Produkcja na dobę bez szadzi [kWh]",
        "cel": "Energia, którą panele dałyby czyste.",
        "gdzie": "Moduł 3 — produkcja w tym miesiącu ÷ liczba dni.",
        "zakres": "Twoja instalacja."
      },
      "dni": {
        "nazwa": "Dni mgły z szadzią",
        "cel": "Mnoży stratę doby.",
        "gdzie": "Prognoza; źródło: scenariusze 3–7 dni.",
        "zakres": "Twoja ocena."
      },
      "pozostala": {
        "nazwa": "Produkcja pod szadzią [% normalnej]",
        "cel": "Jaka część światła przechodzi przez szadź.",
        "gdzie": "Obserwacja falownika; źródło: ok. 5% po 48 h.",
        "zakres": "0–100%."
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
        nazwa: "Fuel price [PLN/l]",
        cel: "Turns litres into money.",
        gdzie: "Pump price / your last purchase.",
        zakres: "Your price.",
      },
      serwis: {
        nazwa: "Service and oil per running hour [PLN/h]",
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
        cel: "Daily shortfall = demand − PV production of that day (not below 0). The same value is used for every month.",
        gdzie: "Module 2 (energy demand) or the meter: annual use ÷ 365, preferably for winter.",
        zakres: "Your house; usually higher in winter than the annual average.",
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
    },
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
      "jakDziala": "Choose the deposit type, enter the panel tilt, normal daily production, how many days the deposit stays and how much production is left under it. The app computes the lost energy and says whether dry snow will slide off (tilt above {prog}°).",
      "poCo": "You know how much energy the battery or generator must replace and whether clearing is worth it.",
      "fizyka": "E = E_day · days · (1 − p). Dry snow slides off above {prog}° (the same threshold as Module 3 “Cleanliness and snow”); wet snow sticks; glaze and frost block the light completely."
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
        "nazwa": "Days the deposit stays",
        "cel": "Multiplies the daily loss.",
        "gdzie": "Observation or thaw forecast (source: about 3 days of snow at −5 °C).",
        "zakres": "Your estimate — the app has no melting model."
      },
      "pozostala": {
        "nazwa": "Production under the deposit [% of normal]",
        "cel": "What part of the light passes through the deposit.",
        "gdzie": "Inverter observation; source: snow 0%, rime about 5% after 48 h.",
        "zakres": "0–100%."
      },
      "nierowno": {
        "nazwa": "Strings covered unevenly",
        "cel": "Different cover on strings gives voltage differences (mismatch).",
        "gdzie": "Roof planes facing different ways, leeward side, roof valleys.",
        "zakres": "Yes / no."
      }
    }
  },
  "szadz-na-pv": {
    "migawka": {
      "oCoChodzi": "Fog is a silent panel killer — it freezes on them like icing on glass and, unlike snow, does not fall off by itself.",
      "jakDziala": "Enter the normal daily production, how many days the fog with rime lasts and how much production is left under the rime. The app computes the lost energy — the same physics as the snow on PV screen.",
      "poCo": "A few days of fog can take almost all production — you know how much the battery and generator must cover.",
      "fizyka": "E = E_day · days · (1 − p). Source example: after 48 h of fog and rime production drops to 5% of nominal (p = 5%)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Production per day without rime [kWh]",
        "cel": "Energy the clean panels would give.",
        "gdzie": "Module 3 — this month's production ÷ number of days.",
        "zakres": "Your installation."
      },
      "dni": {
        "nazwa": "Days of fog with rime",
        "cel": "Multiplies the daily loss.",
        "gdzie": "Forecast; source: 3–7 day scenarios.",
        "zakres": "Your estimate."
      },
      "pozostala": {
        "nazwa": "Production under rime [% of normal]",
        "cel": "What part of the light passes through the rime.",
        "gdzie": "Inverter observation; source: about 5% after 48 h.",
        "zakres": "0–100%."
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
        nazwa: "Цена топлива [зл/л]",
        cel: "Переводит литры в деньги.",
        gdzie: "Цена на заправке / последней покупки.",
        zakres: "Ваша цена.",
      },
      serwis: {
        nazwa: "Сервис и масло на моточас [зл/ч]",
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
        cel: "Суточный дефицит = потребление − выработка PV этих суток (не меньше 0). Одно и то же значение используется для каждого месяца.",
        gdzie: "Модуль 2 (потребление энергии) или счётчик: годовой расход ÷ 365, лучше для зимы.",
        zakres: "Ваш дом; зимой обычно выше среднегодового.",
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
    },
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
      "jakDziala": "Выберите тип отложения, введите угол панелей, обычную суточную выработку, сколько дней отложение пролежит и сколько выработки остаётся под ним. Приложение посчитает потерянную энергию и скажет, сползёт ли сухой снег (угол больше {prog}°).",
      "poCo": "Вы знаете, сколько энергии должны заменить батарея или генератор и стоит ли чистить панели.",
      "fizyka": "E = E_сут · дни · (1 − p). Сухой снег сползает при угле > {prog}° (тот же порог, что в Модуле 3 «Чистота и снег»); мокрый прилипает; гололёд и иней полностью перекрывают свет."
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
        "gdzie": "Модуль 3 — выработка месяца ÷ число дней.",
        "zakres": "Ваша установка."
      },
      "dni": {
        "nazwa": "Дни покрытия",
        "cel": "Умножает суточную потерю.",
        "gdzie": "Наблюдение или прогноз оттепели (источник: при −5 °C снег около 3 дней).",
        "zakres": "Ваша оценка — модели таяния в приложении нет."
      },
      "pozostala": {
        "nazwa": "Выработка под отложением [% от обычной]",
        "cel": "Какая часть света проходит через отложение.",
        "gdzie": "Наблюдение по инвертору; источник: снег 0%, изморозь через 48 ч около 5%.",
        "zakres": "0–100%."
      },
      "nierowno": {
        "nazwa": "Стринги засыпаны неравномерно",
        "cel": "Разное покрытие стрингов даёт разницу напряжений (рассогласование).",
        "gdzie": "Скаты разной ориентации, подветренная сторона, ендовы.",
        "zakres": "Да / нет."
      }
    }
  },
  "szadz-na-pv": {
    "migawka": {
      "oCoChodzi": "Туман — тихий убийца панелей: он намерзает на них, как глазурь на стекле, и, в отличие от снега, сам не отпадает.",
      "jakDziala": "Введите обычную суточную выработку, сколько дней продержится туман с изморозью и сколько выработки остаётся под изморозью. Приложение посчитает потерянную энергию — той же физикой, что экран снега на PV.",
      "poCo": "Несколько дней тумана могут забрать почти всю выработку — вы знаете, сколько должны покрыть батарея и генератор.",
      "fizyka": "E = E_сут · дни · (1 − p). Пример источника: через 48 ч тумана и изморози выработка падает до 5% номинальной (p = 5%)."
    },
    "pola": {
      "produkcja": {
        "nazwa": "Выработка в сутки без изморози [кВт·ч]",
        "cel": "Энергия, которую дали бы чистые панели.",
        "gdzie": "Модуль 3 — выработка месяца ÷ число дней.",
        "zakres": "Ваша установка."
      },
      "dni": {
        "nazwa": "Дни тумана с изморозью",
        "cel": "Умножает суточную потерю.",
        "gdzie": "Прогноз; источник: сценарии 3–7 дней.",
        "zakres": "Ваша оценка."
      },
      "pozostala": {
        "nazwa": "Выработка под изморозью [% от обычной]",
        "cel": "Какая часть света проходит через изморозь.",
        "gdzie": "Наблюдение по инвертору; источник: около 5% через 48 ч.",
        "zakres": "0–100%."
      }
    }
  },
}
