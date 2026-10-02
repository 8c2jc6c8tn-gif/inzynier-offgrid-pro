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
}
