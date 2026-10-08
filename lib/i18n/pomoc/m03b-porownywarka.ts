/**
 * Help content — Module 3, PV panel comparer (D81, stage A1). Every number comes from the panel datasheet or from
 * the user; the app assumes no catalogue value for a missing parameter (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "porownywarka-paneli": {
    migawka: {
      oCoChodzi:
        "Dwa panele o podobnej cenie potrafią dać zimą bardzo różną energię, a „więcej watów za mniej złotych” nie zawsze znaczy lepiej. Ten ekran porównuje do czterech paneli na Twoim miejscu miesiąc po miesiącu i pokazuje, który opłaca się bardziej — zwłaszcza w listopadzie–lutym.",
      jakDziala:
        "1) Wybierasz miejsce (powierzchnię z projektu albo własne nachylenie i azymut) i liczbę paneli. 2) Wpisujesz panele z ich kart (albo wstawiasz z katalogu) i obowiązkowo cenę. 3) Opcjonalnie wybierasz, ile warta jest dla Ciebie 1 kWh. 4) Aplikacja liczy energię z typowego roku pogodowego godzina po godzinie, osobno dla każdego panelu, i pokazuje 12 miesięcy z wyróżnioną zimą, koszt zimowej kWh i gwiazdki. Wagi kryteriów widzisz i możesz kryteria odznaczyć.",
      poCo:
        "Zimą w off-gridzie liczy się każda kilowatogodzina, a różnica między panelami jest wtedy największa — przez temperaturę, słabe światło i niskie słońce. Porównanie samych watów albo samej ceny prowadzi do złego zakupu; ten ekran liczy to, co naprawdę trafi do akumulatora. Aplikacja rekomenduje, decyzja jest Twoja.",
      fizyka:
        "Co i jak liczymy — i dlaczego. Dla każdej godziny roku liczymy nasłonecznienie płaszczyzny paneli modelem Muneera (jak w PVGIS). Temperatura ogniwa to temperatura powietrza plus (NOCT − 20)/800 razy nasłonecznienie — to standardowa definicja NOCT (800 W/m², 20 °C). Moc panelu to P_STC · G/1000 · [1 + γ·(T_ogniwa − 25)] · η_wzgl(G): im zimniej, tym wyższa sprawność, ale panel o niskim γ nie zyskuje tyle, ile ten o wysokim. η_wzgl to sprawność przy słabym świetle z karty (przy 200 W/m²), z interpolacją liniową do 100% przy 1000 W/m². Nie używamy żadnych reklamowych mnożników typu „+5% uzysku dla technologii X” — liczy się to, co jest na karcie. Jeśli którejś karcie brakuje γ, NOCT albo sprawności przy 200 W/m², dane zjawisko jest pominięte dla WSZYSTKICH paneli, żeby porównanie było uczciwe. Degradacja z gwarancji to górna granica, nie prognoza.",
    },
    pola: {
      miejsce: {
        nazwa: "Powierzchnia z projektu",
        cel: "Podstawia nachylenie i azymut powierzchni zapisanej w modelu działki, żeby nie wpisywać ich drugi raz.",
        gdzie: "Moduł 1, ekran Skaner działki — powierzchnie dachu i elewacji budynku. Jeśli modelu nie ma, wpisz nachylenie i azymut ręcznie.",
        zakres: "Jedna z powierzchni projektu albo własne wartości.",
      },
      nachylenie: {
        nazwa: "Nachylenie paneli [°]",
        cel: "Kąt między panelem a poziomem; zmienia, ile światła dostaje panel zimą (niskie słońce) i latem.",
        gdzie: "Pomiar kątomierzem albo aplikacją na telefonie przyłożonym do panelu; dla dachu — kąt połaci.",
        zakres: "0° (płasko) do 90° (pionowo).",
      },
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele; południe daje najwięcej energii zimą.",
        gdzie: "Kompas albo mapa: północ = 0°, wschód = 90°, południe = 180°, zachód = 270°.",
        zakres: "0° do 360°.",
      },
      albedo: {
        nazwa: "Albedo gruntu [-]",
        cel: "Jaka część światła odbija się od ziemi przed panelami; wpływa na energię panelu pochylonego.",
        gdzie: "Zostaw puste — użyję wartości domyślnej silnika nasłonecznienia (jak w Module 1). Własną wpisz, jeśli znasz podłoże (np. kostka, trawa, śnieg).",
        zakres: "0 do 1.",
      },
      liczbaPaneli: {
        nazwa: "Liczba paneli",
        cel: "Przez ile sztuk mnożymy energię i cenę. Ta sama liczba dla każdego porównywanego panelu.",
        gdzie: "Twój plan instalacji albo wynik ekranu „Ile paneli potrzebujesz”.",
        zakres: "Liczba całkowita, co najmniej 1.",
      },
      katalog: {
        nazwa: "Wstaw z katalogu",
        cel: "Wstawia dane panelu z karty katalogowej zapisanej w aplikacji, żeby nie przepisywać ich z ręki. Cenę wpisujesz sam.",
        gdzie: "Katalog zawiera panele, dla których dostarczono kartę katalogową; każdy parametr pochodzi z karty.",
        zakres: "Zależy od panelu.",
      },
      nazwa: {
        nazwa: "Producent i model",
        cel: "Nazwa pokazywana na wykresach i w wynikach.",
        gdzie: "Naklejka z tyłu panelu albo karta katalogowa.",
        zakres: "Dowolny tekst.",
      },
      moc: {
        nazwa: "Moc maksymalna w STC [W]",
        cel: "Moc panelu w warunkach standardowych (1000 W/m², 25 °C) — podstawa całego obliczenia uzysku.",
        gdzie: "Naklejka panelu albo karta katalogowa, wiersz Pmax. Uwaga: panele no-name bywają słabsze, niż mówi naklejka.",
        zakres: "Wartość z karty; dla paneli domowych zwykle kilkaset watów.",
      },
      cena: {
        nazwa: "Cena brutto za sztukę [{waluta}]",
        cel: "Pole wymagane do części „zł”: koszt, cena za Wp, koszt zimowej kWh i okres zwrotu. Bez ceny liczę tylko energię.",
        gdzie: "Oferta sklepu albo hurtowni — cena brutto jednej sztuki, którą znalazłeś.",
        zakres: "Większa od zera.",
      },
      gamma: {
        nazwa: "Współczynnik temperaturowy mocy γ [%/°C]",
        cel: "O ile procent spada moc na każdy stopień powyżej 25 °C ogniwa (zwykle liczba ujemna). Panel o mniejszym |γ| traci mniej w upale i zyskuje mniej w mrozie.",
        gdzie: "Karta katalogowa, wiersz „temperature coefficient of Pmax”. Jeśli karta go nie podaje, zostaw puste — kryterium będzie pominięte.",
        zakres: "Wartość z karty; typowo ujemna, rzędu −0,3 do −0,4 %/°C.",
      },
      noct: {
        nazwa: "NOCT [°C]",
        cel: "Temperatura pracy ogniwa w ustalonych warunkach (800 W/m², 20 °C, wiatr 1 m/s); z niej liczymy temperaturę ogniwa w każdej godzinie.",
        gdzie: "Karta katalogowa, wiersz „NOCT” (czasem „Nominal Operating Cell Temperature”).",
        zakres: "Wartość z karty, powyżej 20 °C.",
      },
      sprawnosc200: {
        nazwa: "Sprawność względna przy 200 W/m² [%]",
        cel: "Ile procent sprawności z STC panel zachowuje przy słabym świetle (pochmurnie, zima). Im więcej, tym lepiej zimą.",
        gdzie: "Karta katalogowa, wiersz „relative efficiency reduction at 200 W/m²” — podaj 100% minus spadek. Jeśli karta go nie podaje, zostaw puste.",
        zakres: "Powyżej 0 i do 100%; wartość z karty.",
      },
      degradacja1: {
        nazwa: "Degradacja w pierwszym roku [%]",
        cel: "O ile procent mocy panel traci w pierwszym roku wg gwarancji. To górna granica gwarantowana, nie prognoza.",
        gdzie: "Karta katalogowa albo warunki gwarancji mocy („linear power warranty”).",
        zakres: "Wartość z gwarancji, zero lub więcej.",
      },
      degradacjaLiniowa: {
        nazwa: "Degradacja w kolejnych latach [%/rok]",
        cel: "O ile procent mocy rocznie panel traci w latach 2 i dalej wg gwarancji (górna granica).",
        gdzie: "Karta katalogowa albo warunki gwarancji mocy.",
        zakres: "Wartość z gwarancji, zero lub więcej.",
      },
      bifacjalny: {
        nazwa: "Panel dwustronny (bifacjalny)",
        cel: "Zaznacz, jeśli panel łapie światło także tylną stroną. Ta wersja liczy tylko stronę przednią, więc uzysk takiego panelu jest ostrożny.",
        gdzie: "Karta katalogowa: „bifacial”, „glass-glass” albo tabela z uzyskiem tylnej strony.",
        zakres: "Tak albo nie.",
      },
      wycenaRodzaj: {
        nazwa: "Skąd bierzesz wartość kWh",
        cel: "Zamienia kWh na złotówki: sieć całodobowa albo dzienna i nocna (to, co zapłaciłbyś za kWh z sieci; w taryfie dwustrefowej energię z godzin taniej strefy liczymy po cenie nocnej), agregat (koszt paliwa na kWh — wartość „brakującej” kWh zimą) albo własna stawka. „Bez wyceny” pokazuje samą produkcję.",
        gdzie: "Faktura za prąd, ekran „Agregat przenośny” albo własne założenie.",
        zakres: "Jedna z pięciu opcji.",
      },
      stawka: {
        nazwa: "Cena 1 kWh [{waluta}/kWh]",
        cel: "Przez ile mnożymy energię, żeby dostać wartość w złotówkach.",
        gdzie: "Faktura za prąd: całkowity koszt kWh (energia plus dystrybucja) albo Twoja własna stawka.",
        zakres: "Większa od zera.",
      },
      stawkaDzien: {
        nazwa: "Cena 1 kWh w strefie dziennej [{waluta}/kWh]",
        cel: "Cena, po której liczymy energię z godzin poza tanią strefą.",
        gdzie: "Faktura: całkowity koszt kWh w strefie dziennej (energia plus opłaty zmienne dystrybucji), w tej samej konwencji (netto albo brutto) co cena paneli.",
        zakres: "Większa od zera; zwykle wyraźnie wyższa niż w strefie nocnej.",
      },
      stawkaNoc: {
        nazwa: "Cena 1 kWh w strefie nocnej [{waluta}/kWh]",
        cel: "Cena, po której liczymy energię z godzin taniej strefy (np. 13–15 w południe, gdy panele już pracują).",
        gdzie: "Faktura: całkowity koszt kWh w strefie nocnej (tańszej), w tej samej konwencji co cena dzienna.",
        zakres: "Większa od zera; niższa niż cena dzienna.",
      },
      strefaTania: {
        nazwa: "Godziny taniej strefy [godz.]",
        cel: "Zimą panele pracują głównie w dzień, więc liczy się, ile ich energii wypada w taniej strefie, a ile w drogiej. Okno „od–do” obejmuje godziny od początku do końca (22 do 6 to okno przez północ).",
        gdzie: "Umowa lub faktura (tabela stref taryfy G12). Podpowiedź 22–6 i 13–15 to przykład: tak publikują m.in. Energa, PGE i E.ON; Tauron i Enea wyznaczają godziny w przedziałach.",
        zakres: "Całkowite godziny 0–24; początek różny od końca. Drugie okno jest opcjonalne.",
      },
      agregatMoc: {
        nazwa: "Moc agregatu [kW]",
        cel: "Razem z obciążeniem i zużyciem paliwa daje koszt 1 kWh z agregatu.",
        gdzie: "Tabliczka znamionowa agregatu.",
        zakres: "Większa od zera.",
      },
      agregatObciazenie: {
        nazwa: "Obciążenie agregatu [%]",
        cel: "Jaka część mocy agregatu jest wykorzystana — od tego zależy spalanie i ilość oddanej energii.",
        gdzie: "Szacunek z mocy odbiorników, które agregat zasila.",
        zakres: "0–100%.",
      },
      agregatZuzycie: {
        nazwa: "Zużycie paliwa przy tym obciążeniu [l/h]",
        cel: "Ile litrów agregat spala w godzinę przy wpisanym obciążeniu.",
        gdzie: "Karta agregatu (tabela zużycia przy 50% i 75% obciążenia) — nie ma w aplikacji krzywej zużycia.",
        zakres: "Wartość z karty, większa od zera.",
      },
      agregatCena: {
        nazwa: "Cena paliwa [{waluta}/l]",
        cel: "Razem ze zużyciem daje koszt godziny pracy agregatu.",
        gdzie: "Cena na stacji, którą płacisz.",
        zakres: "Większa od zera.",
      },
      kryteria: {
        nazwa: "Kryteria oceny i ich wagi",
        cel: "Każde kryterium możesz zaznaczyć (liczone) albo odznaczyć (pominięte). Wagi są wstępne i przeliczają się do 100% z kryteriów, które da się policzyć dla wszystkich paneli. Kryterium, któremu brakuje danych na choć jednej karcie, jest pominięte i jawnie opisane.",
        gdzie: "Wagi startowe: uzysk zimowy 30%, koszt zimowej kWh 20%, degradacja i gwarancja 15%, słabe światło i temperatura po 5%. Uzysk roczny i cena za Wp mają po 5%, domyślnie odznaczone.",
        zakres: "Wagi stałe w tej wersji; zaznaczasz, które kryteria się liczą.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "porownywarka-paneli": {
    migawka: {
      oCoChodzi:
        "Two panels at a similar price can give very different energy in winter, and “more watts for less money” does not always mean better. This screen compares up to four panels at your place month by month and shows which pays off more — especially in November–February.",
      jakDziala:
        "1) You choose the place (a surface from the project or your own tilt and azimuth) and the number of panels. 2) You enter the panels from their datasheets (or insert them from the catalogue) and, mandatory, the price. 3) Optionally you choose what 1 kWh is worth to you. 4) The app computes the energy from the typical weather year hour by hour, separately for each panel, and shows 12 months with winter highlighted, the cost of a winter kWh and stars. You see the criterion weights and can untick criteria.",
      poCo:
        "In winter, in an off-grid system, every kilowatt-hour counts, and the difference between panels is largest then — because of temperature, low light and the low sun. Comparing watts alone or price alone leads to a wrong purchase; this screen computes what will really reach the battery. The app recommends, the decision is yours.",
      fizyka:
        "What we compute and how — and why. For each hour of the year we compute the irradiance on the panel plane with the Muneer model (as in PVGIS). The cell temperature is the air temperature plus (NOCT − 20)/800 times the irradiance — the standard definition of NOCT (800 W/m², 20 °C). The panel power is P_STC · G/1000 · [1 + γ·(T_cell − 25)] · η_rel(G): the colder, the higher the efficiency, but a panel with a low γ gains less than one with a high γ. η_rel is the low-light efficiency from the datasheet (at 200 W/m²), linearly interpolated to 100% at 1000 W/m². We use no advertising multipliers such as “+5% yield for technology X” — what counts is what is on the datasheet. If a datasheet lacks γ, NOCT or the efficiency at 200 W/m², that effect is skipped for ALL panels, so the comparison stays fair. Degradation from the warranty is an upper bound, not a forecast.",
    },
    pola: {
      miejsce: {
        nazwa: "Surface from the project",
        cel: "Inserts the tilt and azimuth of a surface saved in the plot model, so you do not enter them twice.",
        gdzie: "Module 1, Plot scanner screen — the roof and facade surfaces of the building. If there is no model, enter the tilt and azimuth by hand.",
        zakres: "One of the project surfaces or your own values.",
      },
      nachylenie: {
        nazwa: "Panel tilt [°]",
        cel: "The angle between the panel and the horizontal; it changes how much light the panel gets in winter (low sun) and in summer.",
        gdzie: "Measured with a protractor or a phone app placed on the panel; for a roof — the pitch angle.",
        zakres: "0° (flat) to 90° (vertical).",
      },
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face; south gives the most energy in winter.",
        gdzie: "Compass or map: north = 0°, east = 90°, south = 180°, west = 270°.",
        zakres: "0° to 360°.",
      },
      albedo: {
        nazwa: "Ground albedo [-]",
        cel: "What part of the light is reflected by the ground in front of the panels; it affects the energy of a tilted panel.",
        gdzie: "Leave empty — the default value of the irradiance engine is used (as in Module 1). Enter your own if you know the ground (e.g. paving, grass, snow).",
        zakres: "0 to 1.",
      },
      liczbaPaneli: {
        nazwa: "Number of panels",
        cel: "By how many pieces the energy and the price are multiplied. The same number for every compared panel.",
        gdzie: "Your installation plan or the result of the “How many panels do you need” screen.",
        zakres: "A whole number, at least 1.",
      },
      katalog: {
        nazwa: "Insert from the catalogue",
        cel: "Inserts the panel data from a datasheet saved in the app, so you do not retype it. You enter the price yourself.",
        gdzie: "The catalogue holds the panels for which a datasheet was supplied; every parameter comes from the datasheet.",
        zakres: "Depends on the panel.",
      },
      nazwa: {
        nazwa: "Manufacturer and model",
        cel: "The name shown in charts and results.",
        gdzie: "The label on the back of the panel or the datasheet.",
        zakres: "Any text.",
      },
      moc: {
        nazwa: "Maximum power at STC [W]",
        cel: "The panel power in standard conditions (1000 W/m², 25 °C) — the base of the whole yield calculation.",
        gdzie: "The panel label or the datasheet, the Pmax row. Note: no-name panels are sometimes weaker than the label says.",
        zakres: "Value from the datasheet; for household panels usually several hundred watts.",
      },
      cena: {
        nazwa: "Gross price per piece [{waluta}]",
        cel: "A required field for the money part: cost, price per Wp, cost of a winter kWh and payback. Without a price I compute only the energy.",
        gdzie: "The shop or wholesaler offer — the gross price of one piece that you found.",
        zakres: "Greater than zero.",
      },
      gamma: {
        nazwa: "Power temperature coefficient γ [%/°C]",
        cel: "By how many percent the power drops for every degree of cell temperature above 25 °C (usually a negative number). A panel with a smaller |γ| loses less in heat and gains less in frost.",
        gdzie: "The datasheet, the “temperature coefficient of Pmax” row. If the datasheet does not give it, leave it empty — the criterion will be skipped.",
        zakres: "Value from the datasheet; typically negative, around −0.3 to −0.4 %/°C.",
      },
      noct: {
        nazwa: "NOCT [°C]",
        cel: "The cell operating temperature in set conditions (800 W/m², 20 °C, wind 1 m/s); from it we compute the cell temperature in every hour.",
        gdzie: "The datasheet, the “NOCT” row (sometimes “Nominal Operating Cell Temperature”).",
        zakres: "Value from the datasheet, above 20 °C.",
      },
      sprawnosc200: {
        nazwa: "Relative efficiency at 200 W/m² [%]",
        cel: "What percentage of the STC efficiency the panel keeps in low light (overcast, winter). The higher, the better in winter.",
        gdzie: "The datasheet, the “relative efficiency reduction at 200 W/m²” row — enter 100% minus the reduction. If the datasheet does not give it, leave it empty.",
        zakres: "Above 0 and up to 100%; value from the datasheet.",
      },
      degradacja1: {
        nazwa: "Degradation in the first year [%]",
        cel: "By how many percent of power the panel loses in the first year per the warranty. This is the guaranteed upper bound, not a forecast.",
        gdzie: "The datasheet or the power warranty terms (“linear power warranty”).",
        zakres: "Value from the warranty, zero or more.",
      },
      degradacjaLiniowa: {
        nazwa: "Degradation in the following years [%/year]",
        cel: "By how many percent of power per year the panel loses from year 2 onwards per the warranty (upper bound).",
        gdzie: "The datasheet or the power warranty terms.",
        zakres: "Value from the warranty, zero or more.",
      },
      bifacjalny: {
        nazwa: "Double-sided (bifacial) panel",
        cel: "Tick if the panel also catches light with its rear side. This version counts the front side only, so the yield of such a panel is conservative.",
        gdzie: "The datasheet: “bifacial”, “glass-glass” or a table with the rear-side yield.",
        zakres: "Yes or no.",
      },
      wycenaRodzaj: {
        nazwa: "Where the kWh value comes from",
        cel: "Turns kWh into money: the grid, single-rate or day and night (what you would pay for a kWh from the grid; in a two-zone tariff energy from the cheap-zone hours is valued at the night price), a generator (fuel cost per kWh — the value of a “missing” kWh in winter) or your own rate. “No valuation” shows production only.",
        gdzie: "The electricity bill, the “Portable generator” screen or your own assumption.",
        zakres: "One of five options.",
      },
      stawka: {
        nazwa: "Price of 1 kWh [{waluta}/kWh]",
        cel: "What the energy is multiplied by to get the value in money.",
        gdzie: "The electricity bill: the total cost of a kWh (energy plus distribution) or your own rate.",
        zakres: "Greater than zero.",
      },
      stawkaDzien: {
        nazwa: "Price of 1 kWh in the day zone [{waluta}/kWh]",
        cel: "The price used for energy produced outside the cheap zone.",
        gdzie: "Invoice: the total cost of a kWh in the day zone (energy plus variable distribution charges), in the same convention (net or gross) as the panel price.",
        zakres: "Greater than zero; usually clearly higher than in the night zone.",
      },
      stawkaNoc: {
        nazwa: "Price of 1 kWh in the night zone [{waluta}/kWh]",
        cel: "The price used for energy produced in the cheap-zone hours (e.g. 13–15 at noon, when panels already work).",
        gdzie: "Invoice: the total cost of a kWh in the night (cheaper) zone, in the same convention as the day price.",
        zakres: "Greater than zero; lower than the day price.",
      },
      strefaTania: {
        nazwa: "Cheap-zone hours [h]",
        cel: "In winter panels work mostly by day, so what matters is how much of their energy falls in the cheap zone and how much in the expensive one. A „from–to” window covers the hours from the start to the end (22 to 6 is a window across midnight).",
        gdzie: "Contract or invoice (the zone table of the G12 tariff). The 22–6 and 13–15 hint is an example: published by e.g. Energa, PGE and E.ON; Tauron and Enea set the hours within ranges.",
        zakres: "Whole hours 0–24; start different from end. The second window is optional.",
      },
      agregatMoc: {
        nazwa: "Generator power [kW]",
        cel: "Together with the load and the fuel consumption it gives the cost of 1 kWh from the generator.",
        gdzie: "The generator rating plate.",
        zakres: "Greater than zero.",
      },
      agregatObciazenie: {
        nazwa: "Generator load [%]",
        cel: "What part of the generator power is used — fuel burn and delivered energy depend on it.",
        gdzie: "An estimate from the power of the appliances the generator feeds.",
        zakres: "0–100%.",
      },
      agregatZuzycie: {
        nazwa: "Fuel consumption at that load [l/h]",
        cel: "How many litres the generator burns per hour at the entered load.",
        gdzie: "The generator datasheet (consumption table at 50% and 75% load) — the app has no consumption curve.",
        zakres: "Value from the datasheet, greater than zero.",
      },
      agregatCena: {
        nazwa: "Fuel price [{waluta}/l]",
        cel: "Together with the consumption it gives the cost of an hour of generator work.",
        gdzie: "The price at the station that you pay.",
        zakres: "Greater than zero.",
      },
      kryteria: {
        nazwa: "Rating criteria and their weights",
        cel: "You can tick each criterion (counted) or untick it (skipped). The weights are preliminary and rescale to 100% from the criteria that can be computed for all panels. A criterion missing data on even one datasheet is skipped and openly described.",
        gdzie: "Starting weights: winter yield 30%, cost of a winter kWh 20%, degradation and warranty 15%, low light and temperature 5% each. Annual yield and price per Wp have 5% each, unticked by default.",
        zakres: "Fixed weights in this version; you tick which criteria count.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "porownywarka-paneli": {
    migawka: {
      oCoChodzi:
        "Две панели по похожей цене могут давать зимой совсем разную энергию, а «больше ватт за меньшие деньги» не всегда значит лучше. Этот экран сравнивает до четырёх панелей на вашем месте месяц за месяцем и показывает, какая окупается лучше — особенно в ноябре–феврале.",
      jakDziala:
        "1) Вы выбираете место (поверхность из проекта или свои наклон и азимут) и число панелей. 2) Вводите панели по их паспортам (или подставляете из каталога) и обязательно цену. 3) При желании выбираете, сколько для вас стоит 1 кВт·ч. 4) Приложение считает энергию по типичному погодному году по часам, отдельно для каждой панели, и показывает 12 месяцев с выделенной зимой, стоимость зимнего кВт·ч и звёзды. Веса критериев вы видите и можете снимать критерии.",
      poCo:
        "Зимой в автономной системе важен каждый киловатт-час, а разница между панелями тогда наибольшая — из-за температуры, слабого света и низкого солнца. Сравнение только ватт или только цены ведёт к неверной покупке; этот экран считает то, что реально попадёт в аккумулятор. Приложение рекомендует, решение за вами.",
      fizyka:
        "Что и как считаем — и почему. Для каждого часа года считаем освещённость плоскости панелей моделью Мюнира (как в PVGIS). Температура ячейки — это температура воздуха плюс (NOCT − 20)/800, умноженное на освещённость — стандартное определение NOCT (800 Вт/м², 20 °C). Мощность панели: P_STC · G/1000 · [1 + γ·(T_ячейки − 25)] · η_отн(G): чем холоднее, тем выше КПД, но панель с малым γ выигрывает меньше, чем с большим. η_отн — КПД при слабом свете из паспорта (при 200 Вт/м²), с линейной интерполяцией до 100% при 1000 Вт/м². Рекламных множителей вроде «+5% выработки для технологии X» мы не используем — важно то, что в паспорте. Если в каком-то паспорте нет γ, NOCT или КПД при 200 Вт/м², этот эффект пропускается для ВСЕХ панелей, чтобы сравнение оставалось честным. Деградация по гарантии — верхняя граница, а не прогноз.",
    },
    pola: {
      miejsce: {
        nazwa: "Поверхность из проекта",
        cel: "Подставляет наклон и азимут поверхности, сохранённой в модели участка, чтобы не вводить их дважды.",
        gdzie: "Модуль 1, экран «Сканер участка» — поверхности крыши и фасада здания. Если модели нет, введите наклон и азимут вручную.",
        zakres: "Одна из поверхностей проекта или собственные значения.",
      },
      nachylenie: {
        nazwa: "Наклон панелей [°]",
        cel: "Угол между панелью и горизонталью; меняет, сколько света получает панель зимой (низкое солнце) и летом.",
        gdzie: "Замер угломером или приложением в телефоне, приложенным к панели; для крыши — угол ската.",
        zakres: "От 0° (плоско) до 90° (вертикально).",
      },
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, куда смотрят панели; юг даёт больше всего энергии зимой.",
        gdzie: "Компас или карта: север = 0°, восток = 90°, юг = 180°, запад = 270°.",
        zakres: "От 0° до 360°.",
      },
      albedo: {
        nazwa: "Альбедо земли [-]",
        cel: "Какая часть света отражается от земли перед панелями; влияет на энергию наклонной панели.",
        gdzie: "Оставьте пустым — будет значение по умолчанию движка освещённости (как в Модуле 1). Своё введите, если знаете покрытие (например, плитка, трава, снег).",
        zakres: "От 0 до 1.",
      },
      liczbaPaneli: {
        nazwa: "Число панелей",
        cel: "На сколько штук умножаются энергия и цена. Одно и то же число для каждой сравниваемой панели.",
        gdzie: "Ваш план установки или результат экрана «Сколько нужно панелей».",
        zakres: "Целое число, не менее 1.",
      },
      katalog: {
        nazwa: "Подставить из каталога",
        cel: "Подставляет данные панели из паспорта, сохранённого в приложении, чтобы не переписывать их вручную. Цену вы вводите сами.",
        gdzie: "В каталоге панели, для которых предоставлен паспорт; каждый параметр взят из паспорта.",
        zakres: "Зависит от панели.",
      },
      nazwa: {
        nazwa: "Производитель и модель",
        cel: "Название, показываемое на графиках и в результатах.",
        gdzie: "Наклейка на обратной стороне панели или паспорт.",
        zakres: "Любой текст.",
      },
      moc: {
        nazwa: "Максимальная мощность в STC [Вт]",
        cel: "Мощность панели в стандартных условиях (1000 Вт/м², 25 °C) — основа всего расчёта выработки.",
        gdzie: "Наклейка панели или паспорт, строка Pmax. Внимание: панели безымянных производителей бывают слабее, чем указано на наклейке.",
        zakres: "Значение из паспорта; у бытовых панелей обычно несколько сотен ватт.",
      },
      cena: {
        nazwa: "Цена брутто за штуку [{waluta}]",
        cel: "Обязательное поле для денежной части: стоимость, цена за Вт·пик, стоимость зимнего кВт·ч и окупаемость. Без цены считаю только энергию.",
        gdzie: "Предложение магазина или оптовика — цена брутто одной штуки, которую вы нашли.",
        zakres: "Больше нуля.",
      },
      gamma: {
        nazwa: "Температурный коэффициент мощности γ [%/°C]",
        cel: "На сколько процентов падает мощность на каждый градус температуры ячейки выше 25 °C (обычно отрицательное число). Панель с меньшим |γ| меньше теряет в жару и меньше выигрывает в мороз.",
        gdzie: "Паспорт, строка «temperature coefficient of Pmax». Если паспорт его не указывает, оставьте пустым — критерий будет пропущен.",
        zakres: "Значение из паспорта; обычно отрицательное, порядка от −0,3 до −0,4 %/°C.",
      },
      noct: {
        nazwa: "NOCT [°C]",
        cel: "Рабочая температура ячейки в заданных условиях (800 Вт/м², 20 °C, ветер 1 м/с); по ней считаем температуру ячейки в каждый час.",
        gdzie: "Паспорт, строка «NOCT» (иногда «Nominal Operating Cell Temperature»).",
        zakres: "Значение из паспорта, выше 20 °C.",
      },
      sprawnosc200: {
        nazwa: "Относительный КПД при 200 Вт/м² [%]",
        cel: "Сколько процентов КПД из STC панель сохраняет при слабом свете (пасмурно, зима). Чем больше, тем лучше зимой.",
        gdzie: "Паспорт, строка «relative efficiency reduction at 200 W/m²» — введите 100% минус снижение. Если паспорт его не указывает, оставьте пустым.",
        zakres: "Больше 0 и до 100%; значение из паспорта.",
      },
      degradacja1: {
        nazwa: "Деградация в первый год [%]",
        cel: "Сколько процентов мощности панель теряет в первый год по гарантии. Это гарантированная верхняя граница, а не прогноз.",
        gdzie: "Паспорт или условия гарантии мощности («linear power warranty»).",
        zakres: "Значение из гарантии, ноль или больше.",
      },
      degradacjaLiniowa: {
        nazwa: "Деградация в последующие годы [%/год]",
        cel: "Сколько процентов мощности в год панель теряет со 2-го года по гарантии (верхняя граница).",
        gdzie: "Паспорт или условия гарантии мощности.",
        zakres: "Значение из гарантии, ноль или больше.",
      },
      bifacjalny: {
        nazwa: "Двусторонняя (бифациальная) панель",
        cel: "Отметьте, если панель ловит свет и тыльной стороной. Эта версия считает только лицевую сторону, поэтому выработка такой панели осторожная.",
        gdzie: "Паспорт: «bifacial», «glass-glass» или таблица с выработкой тыльной стороны.",
        zakres: "Да или нет.",
      },
      wycenaRodzaj: {
        nazwa: "Откуда берётся стоимость кВт·ч",
        cel: "Переводит кВт·ч в деньги: сеть, однозонная или дневная и ночная (сколько вы заплатили бы за кВт·ч из сети; в двухзонном тарифе энергия из часов дешёвой зоны оценивается по ночной цене), генератор (стоимость топлива на кВт·ч — ценность «недостающего» кВт·ч зимой) или собственная ставка. «Без оценки» показывает только выработку.",
        gdzie: "Счёт за электричество, экран «Переносной генератор» или ваше допущение.",
        zakres: "Один из пяти вариантов.",
      },
      stawka: {
        nazwa: "Цена 1 кВт·ч [{waluta}/кВт·ч]",
        cel: "На что умножается энергия, чтобы получить стоимость в деньгах.",
        gdzie: "Счёт за электричество: полная стоимость кВт·ч (энергия плюс распределение) или ваша ставка.",
        zakres: "Больше нуля.",
      },
      stawkaDzien: {
        nazwa: "Цена 1 кВт·ч в дневной зоне [{waluta}/кВт·ч]",
        cel: "Цена, по которой считается энергия, выработанная вне дешёвой зоны.",
        gdzie: "Счёт: полная стоимость кВт·ч в дневной зоне (энергия плюс переменные платежи за распределение), в той же конвенции (нетто или брутто), что и цена панелей.",
        zakres: "Больше нуля; обычно заметно выше, чем в ночной зоне.",
      },
      stawkaNoc: {
        nazwa: "Цена 1 кВт·ч в ночной зоне [{waluta}/кВт·ч]",
        cel: "Цена, по которой считается энергия, выработанная в часы дешёвой зоны (например, 13–15 в полдень, когда панели уже работают).",
        gdzie: "Счёт: полная стоимость кВт·ч в ночной (дешёвой) зоне, в той же конвенции, что и дневная цена.",
        zakres: "Больше нуля; ниже дневной цены.",
      },
      strefaTania: {
        nazwa: "Часы дешёвой зоны [ч]",
        cel: "Зимой панели работают в основном днём, поэтому важно, какая доля их энергии приходится на дешёвую зону, а какая на дорогую. Окно «с–до» охватывает часы от начала до конца (с 22 до 6 — окно через полночь).",
        gdzie: "Договор или счёт (таблица зон тарифа G12). Подсказка 22–6 и 13–15 — пример: такие часы публикуют, в частности, Energa, PGE и E.ON; Tauron и Enea задают часы в диапазонах.",
        zakres: "Целые часы 0–24; начало не равно концу. Второе окно необязательно.",
      },
      agregatMoc: {
        nazwa: "Мощность генератора [кВт]",
        cel: "Вместе с нагрузкой и расходом топлива даёт стоимость 1 кВт·ч от генератора.",
        gdzie: "Табличка генератора.",
        zakres: "Больше нуля.",
      },
      agregatObciazenie: {
        nazwa: "Нагрузка генератора [%]",
        cel: "Какая часть мощности генератора используется — от этого зависят расход топлива и отданная энергия.",
        gdzie: "Оценка по мощности приборов, которые питает генератор.",
        zakres: "0–100%.",
      },
      agregatZuzycie: {
        nazwa: "Расход топлива при этой нагрузке [л/ч]",
        cel: "Сколько литров генератор сжигает в час при введённой нагрузке.",
        gdzie: "Паспорт генератора (таблица расхода при 50% и 75% нагрузки) — в приложении нет кривой расхода.",
        zakres: "Значение из паспорта, больше нуля.",
      },
      agregatCena: {
        nazwa: "Цена топлива [{waluta}/л]",
        cel: "Вместе с расходом даёт стоимость часа работы генератора.",
        gdzie: "Цена на заправке, которую вы платите.",
        zakres: "Больше нуля.",
      },
      kryteria: {
        nazwa: "Критерии оценки и их веса",
        cel: "Каждый критерий можно отметить (учитывается) или снять (пропускается). Веса предварительные и пересчитываются до 100% по критериям, которые можно посчитать для всех панелей. Критерий, которому не хватает данных хотя бы в одном паспорте, пропускается и явно описывается.",
        gdzie: "Стартовые веса: зимняя выработка 30%, стоимость зимнего кВт·ч 20%, деградация и гарантия 15%, слабый свет и температура по 5%. Годовая выработка и цена за Вт·пик — по 5%, по умолчанию сняты.",
        zakres: "Веса в этой версии фиксированные; вы отмечаете, какие критерии учитываются.",
      },
    },
  },
}
