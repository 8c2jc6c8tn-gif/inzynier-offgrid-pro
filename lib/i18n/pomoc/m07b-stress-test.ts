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
      jakDziala: "Dla każdego miesiąca z deficytem: godziny pracy = deficyt ÷ (moc × {procent}%), paliwo = godziny × zużycie, koszt = paliwo × cena + godziny × stawka serwisu. Z zapasem paliwa — porównanie miesiąc po miesiącu.",
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
}

export const en: Tlumaczenie<typeof pl> = {
  "deficyty-miesieczne": {
    migawka: {
      oCoChodzi: "This is the winter wallet — you know how much you will really spend on fuel before the frost comes, instead of finding out during it.",
      jakDziala: "For every month with a shortfall: running hours = shortfall ÷ (power × {procent}%), fuel = hours × fuel use, cost = fuel × price + hours × service rate. With a fuel stock — a month-by-month comparison.",
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
}

export const ru: Tlumaczenie<typeof pl> = {
  "deficyty-miesieczne": {
    migawka: {
      oCoChodzi: "Это кошелёк зимы — вы знаете, сколько реально потратите на топливо, ещё до морозов, а не узнаёте об этом посреди зимы.",
      jakDziala: "Для каждого месяца с дефицитом: часы работы = дефицит ÷ (мощность × {procent}%), топливо = часы × расход, стоимость = топливо × цена + часы × ставка сервиса. С запасом топлива — сравнение по месяцам.",
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
}
