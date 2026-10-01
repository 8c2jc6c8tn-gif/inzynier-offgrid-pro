/**
 * Help („?” + „i”) of the Module 6 screens built on 01.10.2026 (E13, E16–E20, 5.42, 2A). A separate file
 * from `m06-ogrzewanie.ts` only to keep parallel sessions from editing the same file; same shape.
 */
import type { Tlumaczenie } from "./typy"

const KARTA = "Karta katalogowa urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie."
const OPCJA = "Puste = nie liczymy tej części."

export const pl = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "To jak wybór butów — do biegania inne, do wspinaczki inne. Do pompy ciepła pasuje podłogówka albo duże grzejniki niskotemperaturowe, nie małe grzejniki „na wysoką temperaturę”.",
      jakDziala:
        "Wybierz źródło ciepła i system. Przy pompie ciepła wpisz z jej karty COP przy temperaturze zasilania Twojego systemu i przy temperaturze grzejników standardowych — aplikacja policzy, o ile mniej prądu zużyje pompa, a z zapotrzebowaniem i ceną prądu — oszczędność w zł i zwrot dopłaty.",
      poCo:
        "Im niższa temperatura zasilania, tym wyższy COP pompy. Zwykłe grzejniki wymagają wysokiej temperatury i potrafią zjeść dużą część zysku z pompy ciepła.",
      fizyka:
        "E = Q ÷ COP. Oszczędność = 1 − COP_odn ÷ COP_sys. Przykład źródła: COP 4,5 przy 35 °C zamiast 3,2 przy 55 °C → 1 − 3,2/4,5 ≈ 29% (źródło podaje 28%). Wielkości grzejnika przy niższej temperaturze ani projektu pętli podłogówki aplikacja nie liczy — wymagają norm PN-EN 442 i PN-EN 1264, których nie ma w aplikacji.",
    },
    pola: {
      zrodlo: {
        nazwa: "Źródło ciepła",
        cel: "Porównanie COP i ostrzeżenie o zwykłych grzejnikach dotyczą pompy ciepła.",
        gdzie: "Twoja instalacja.",
        zakres: "Pompa ciepła albo inne (kocioł, kominek).",
      },
      system: {
        nazwa: "System dystrybucji ciepła",
        cel: "Określa temperaturę zasilania: podłogówka ok. 30–35 °C, grzejniki niskotemperaturowe 45/35/20, standardowe 75/65/20 (dane źródła).",
        gdzie: "Projekt instalacji albo to, co masz w domu.",
        zakres: "Jeden z trzech.",
      },
      copSystemu: {
        nazwa: "COP pompy przy temperaturze zasilania wybranego systemu",
        cel: "Ile kWh ciepła daje 1 kWh prądu przy niższej temperaturze zasilania.",
        gdzie: KARTA + " Odczytaj przy tej samej temperaturze zewnętrznej co drugi COP.",
        zakres: "≥ 1. " + OPCJA,
      },
      copOdniesienia: {
        nazwa: "COP pompy przy temperaturze zasilania grzejników standardowych",
        cel: "Punkt odniesienia — to samo urządzenie przy wysokiej temperaturze zasilania.",
        gdzie: KARTA,
        zakres: "≥ 1. " + OPCJA,
      },
      cieplo: {
        nazwa: "Roczne zapotrzebowanie na ciepło do ogrzewania [kWh/rok]",
        cel: "Zamienia procent oszczędności na kWh prądu w roku.",
        gdzie: "Ekran 2 Modułu 6 (zapotrzebowanie na C.O.) albo audyt energetyczny.",
        zakres: OPCJA,
      },
      doplata: {
        nazwa: "Dopłata za wybrany system [zł]",
        cel: "Różnica kosztu względem grzejników standardowych — do policzenia zwrotu.",
        gdzie: "Oferty instalatorów, ceny grzejników.",
        zakres: OPCJA,
      },
      cena: {
        nazwa: "Cena prądu [zł/kWh]",
        cel: "Zamienia kWh oszczędności na złotówki.",
        gdzie: "Rachunek za prąd albo koszt kWh z Twojego systemu off-grid.",
        zakres: OPCJA,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Po co grzać puste pokoje? Sterowanie strefowe to jak oświetlenie tylko tam, gdzie akurat jesteś.",
      "jakDziala": "Podziel dom na strefy (np. salon, sypialnie, łazienka). Dla każdej wpisz jej część strat ciepła H, temperaturę komfortową i — jeśli ją obniżasz — temperaturę obniżoną i liczbę godzin. Aplikacja porówna ciepło z grzaniem całego domu do komfortu i policzy, ile prądu zużyją siłowniki i sterowniki (źródło: 1–5 W każdy).",
      "poCo": "Zysk ze stref może być spory, ale w off-gridzie każdy wat ciągłego poboru się liczy — przy wielu siłownikach i małym zysku sterowanie potrafi kosztować więcej prądu, niż oszczędza.",
      "fizyka": "Q = H·(θ − θe)·t dla każdej strefy — ta sama fizyka co Ekran 1, w stanie ustalonym (górne oszacowanie zysku). Prąd sterowania = n·P·h + P_sterownika·24. Oszczędność prądu ogrzewania = ciepło ÷ COP. „18%” ze źródła to przykład, nie stała."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Nazwa strefy",
        "cel": "Tylko opis — nie wpływa na wynik.",
        "gdzie": "Dowolna.",
        "zakres": "Tekst."
      },
      "h": {
        "nazwa": "Współczynnik strat ciepła strefy H [W/K]",
        "cel": "Ile watów traci strefa na każdy stopień różnicy temperatur.",
        "gdzie": "Ekran 1 Modułu 6 — straty przegród i wentylacji tej części domu; suma H stref = H budynku.",
        "zakres": "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
      },
      "komfort": {
        "nazwa": "Temperatura komfortowa [°C]",
        "cel": "Temperatura strefy, gdy jest używana.",
        "gdzie": "Ustawienie termostatu.",
        "zakres": "Twoje ustawienie."
      },
      "obnizona": {
        "nazwa": "Temperatura obniżona [°C]",
        "cel": "Temperatura strefy, gdy nikt jej nie używa.",
        "gdzie": "Ustawienie termostatu w trybie obniżonym.",
        "zakres": "Nie wyższa niż komfortowa. Puste = strefa bez obniżenia."
      },
      "godzin": {
        "nazwa": "Czas obniżenia [h/dobę]",
        "cel": "Przez ile godzin doby strefa ma temperaturę obniżoną.",
        "gdzie": "Twój plan dnia (np. sypialnia w dzień, salon w nocy).",
        "zakres": "0–24 h."
      },
      "tZewn": {
        "nazwa": "Średnia temperatura zewnętrzna [°C]",
        "cel": "Doba, dla której liczysz zysk (np. typowa doba zimowa).",
        "gdzie": "Dane klimatyczne lokalizacji (Moduł 1) albo średnia miesiąca z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "liczbaSilownikow": {
        "nazwa": "Liczba siłowników",
        "cel": "Każdy siłownik pobiera prąd przez czas zasilania.",
        "gdzie": "Projekt instalacji — zwykle jeden na pętlę/grzejnik sterowany.",
        "zakres": "Sztuki."
      },
      "mocSilownika": {
        "nazwa": "Pobór jednego siłownika [W]",
        "cel": "Pobór prądu siłownika w czasie zasilania.",
        "gdzie": "Karta siłownika.",
        "zakres": "Źródło: 1–5 W każdy — wpisz wartość z karty."
      },
      "godzinSilownikow": {
        "nazwa": "Zasilanie siłowników [h/dobę]",
        "cel": "Ile godzin na dobę siłowniki pobierają prąd.",
        "gdzie": "Typ siłownika (termiczny NC pobiera prąd, gdy zawór jest otwarty) i Twój plan.",
        "zakres": "0–24 h."
      },
      "mocSterownikow": {
        "nazwa": "Sterownik i termostaty — pobór łączny [W]",
        "cel": "Urządzenia zasilane całą dobę.",
        "gdzie": "Karty sterownika strefowego i termostatów (źródło: 1–5 W każde).",
        "zakres": "Suma z kart."
      },
      "cop": {
        "nazwa": "COP ogrzewania",
        "cel": "Zamienia zaoszczędzone ciepło na zaoszczędzony prąd, żeby porównać z poborem siłowników.",
        "gdzie": "1 = grzałka/kocioł elektryczny; pompa ciepła — karta (Ekran 5).",
        "zakres": "≥ 1. Puste = ogrzewanie nieelektryczne (paliwo) — bez bilansu prądu."
      }
    }
  },
}

const EN_SHEET = "The device datasheet — the app never assumes a typical value for you."
const EN_OPT = "Empty = this part is not calculated."

export const en: Tlumaczenie<typeof pl> = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "It is like choosing shoes — different for running, different for climbing. A heat pump suits underfloor heating or large low-temperature radiators, not small “high-temperature” radiators.",
      jakDziala:
        "Choose the heat source and the system. With a heat pump, enter from its datasheet the COP at your system's supply temperature and at the standard radiators' temperature — the app shows how much less electricity the pump uses, and with the demand and price, the saving in PLN and the payback of the extra cost.",
      poCo:
        "The lower the supply temperature, the higher the pump's COP. Ordinary radiators need a high temperature and can eat a large part of the heat pump's gain.",
      fizyka:
        "E = Q ÷ COP. Saving = 1 − COP_ref ÷ COP_sys. Source example: COP 4.5 at 35 °C instead of 3.2 at 55 °C → 1 − 3.2/4.5 ≈ 29% (the source says 28%). The app does not size radiators at a lower temperature nor design floor loops — that needs PN-EN 442 and PN-EN 1264, which the app does not have.",
    },
    pola: {
      zrodlo: {
        nazwa: "Heat source",
        cel: "The COP comparison and the warning about ordinary radiators apply to a heat pump.",
        gdzie: "Your installation.",
        zakres: "Heat pump or other (boiler, stove).",
      },
      system: {
        nazwa: "Heat distribution system",
        cel: "Sets the supply temperature: underfloor approx. 30–35 °C, low-temperature radiators 45/35/20, standard 75/65/20 (source data).",
        gdzie: "Installation design or what you have at home.",
        zakres: "One of three.",
      },
      copSystemu: {
        nazwa: "Pump COP at the chosen system's supply temperature",
        cel: "How many kWh of heat 1 kWh of electricity gives at the lower supply temperature.",
        gdzie: EN_SHEET + " Read it at the same outdoor temperature as the other COP.",
        zakres: "≥ 1. " + EN_OPT,
      },
      copOdniesienia: {
        nazwa: "Pump COP at the standard radiators' supply temperature",
        cel: "The reference — the same unit at a high supply temperature.",
        gdzie: EN_SHEET,
        zakres: "≥ 1. " + EN_OPT,
      },
      cieplo: {
        nazwa: "Annual space heating demand [kWh/year]",
        cel: "Turns the percentage saving into kWh of electricity per year.",
        gdzie: "Module 6 Screen 2 (space heating demand) or an energy audit.",
        zakres: EN_OPT,
      },
      doplata: {
        nazwa: "Extra cost of the chosen system [PLN]",
        cel: "Cost difference against standard radiators — for the payback.",
        gdzie: "Installer quotes, radiator prices.",
        zakres: EN_OPT,
      },
      cena: {
        nazwa: "Electricity price [PLN/kWh]",
        cel: "Turns the kWh saved into money.",
        gdzie: "Your electricity bill or the cost of a kWh from your off-grid system.",
        zakres: EN_OPT,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Why heat empty rooms? Zone control is like lighting only where you are.",
      "jakDziala": "Split the house into zones (e.g. living room, bedrooms, bathroom). For each enter its share of heat loss H, the comfort temperature and — if you lower it — the setback temperature and hours. The app compares the heat with heating the whole house to comfort and counts the electricity of actuators and controllers (source: 1–5 W each).",
      "poCo": "The zoning gain can be large, but off-grid every watt of continuous draw counts — with many actuators and a small gain the control can cost more electricity than it saves.",
      "fizyka": "Q = H·(θ − θe)·t for each zone — the same physics as Screen 1, in steady state (upper estimate of the gain). Control electricity = n·P·h + P_controller·24. Heating electricity saved = heat ÷ COP. The source's “18%” is an example, not a constant."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Zone name",
        "cel": "Only a description — does not affect the result.",
        "gdzie": "Anything.",
        "zakres": "Text."
      },
      "h": {
        "nazwa": "Zone heat loss coefficient H [W/K]",
        "cel": "How many watts the zone loses per degree of temperature difference.",
        "gdzie": "Module 6 Screen 1 — fabric and ventilation losses of this part of the house; the zones' H add up to the building's H.",
        "zakres": "Your installation — the app never assumes a typical value for you."
      },
      "komfort": {
        "nazwa": "Comfort temperature [°C]",
        "cel": "Zone temperature when in use.",
        "gdzie": "Thermostat setting.",
        "zakres": "Your setting."
      },
      "obnizona": {
        "nazwa": "Setback temperature [°C]",
        "cel": "Zone temperature when nobody uses it.",
        "gdzie": "Thermostat setback setting.",
        "zakres": "Not higher than comfort. Empty = no setback."
      },
      "godzin": {
        "nazwa": "Setback time [h/day]",
        "cel": "How many hours a day the zone is at the setback temperature.",
        "gdzie": "Your daily plan (e.g. bedroom by day, living room at night).",
        "zakres": "0–24 h."
      },
      "tZewn": {
        "nazwa": "Mean outdoor temperature [°C]",
        "cel": "The day you compute the gain for (e.g. a typical winter day).",
        "gdzie": "Climate data of the location (Module 1) or the month mean from Screen 1.",
        "zakres": "Your location."
      },
      "liczbaSilownikow": {
        "nazwa": "Number of actuators",
        "cel": "Each actuator draws power while powered.",
        "gdzie": "Installation design — usually one per controlled loop/radiator.",
        "zakres": "Pieces."
      },
      "mocSilownika": {
        "nazwa": "Power of one actuator [W]",
        "cel": "Actuator draw while powered.",
        "gdzie": "Actuator datasheet.",
        "zakres": "Source: 1–5 W each — enter the datasheet value."
      },
      "godzinSilownikow": {
        "nazwa": "Actuators powered [h/day]",
        "cel": "How many hours a day the actuators draw power.",
        "gdzie": "Actuator type (a thermal NC actuator draws power while the valve is open) and your plan.",
        "zakres": "0–24 h."
      },
      "mocSterownikow": {
        "nazwa": "Controller and thermostats — total power [W]",
        "cel": "Devices powered all day.",
        "gdzie": "Datasheets of the zone controller and thermostats (source: 1–5 W each).",
        "zakres": "Sum from the datasheets."
      },
      "cop": {
        "nazwa": "Heating COP",
        "cel": "Turns the heat saved into electricity saved, to compare with the actuators' draw.",
        "gdzie": "1 = electric heater/boiler; heat pump — datasheet (Screen 5).",
        "zakres": "≥ 1. Empty = non-electric heating (fuel) — no electricity balance."
      }
    }
  },
}

const RU_SHEET = "Паспорт устройства — приложение не подставляет типовое значение за вас."
const RU_OPT = "Пусто = эта часть не считается."

export const ru: Tlumaczenie<typeof pl> = {
  "dystrybucja-ciepla": {
    migawka: {
      oCoChodzi:
        "Это как выбор обуви — для бега одна, для скалолазания другая. Тепловому насосу подходит тёплый пол или большие низкотемпературные радиаторы, а не маленькие «высокотемпературные».",
      jakDziala:
        "Выберите источник тепла и систему. Для теплового насоса введите из паспорта COP при температуре подачи вашей системы и при температуре стандартных радиаторов — приложение покажет, насколько меньше электроэнергии потребит насос, а с потребностью и ценой — экономию в злотых и окупаемость доплаты.",
      poCo:
        "Чем ниже температура подачи, тем выше COP насоса. Обычным радиаторам нужна высокая температура, и они могут съесть большую часть выгоды от теплового насоса.",
      fizyka:
        "E = Q ÷ COP. Экономия = 1 − COP_отн ÷ COP_сис. Пример источника: COP 4,5 при 35 °C вместо 3,2 при 55 °C → 1 − 3,2/4,5 ≈ 29% (в источнике 28%). Размер радиатора при более низкой температуре и проект петель тёплого пола приложение не считает — для этого нужны PN-EN 442 и PN-EN 1264, которых в приложении нет.",
    },
    pola: {
      zrodlo: {
        nazwa: "Источник тепла",
        cel: "Сравнение COP и предупреждение об обычных радиаторах относятся к тепловому насосу.",
        gdzie: "Ваша установка.",
        zakres: "Тепловой насос или другое (котёл, камин).",
      },
      system: {
        nazwa: "Система распределения тепла",
        cel: "Задаёт температуру подачи: тёплый пол ок. 30–35 °C, низкотемпературные радиаторы 45/35/20, стандартные 75/65/20 (данные источника).",
        gdzie: "Проект установки или то, что есть в доме.",
        zakres: "Одна из трёх.",
      },
      copSystemu: {
        nazwa: "COP насоса при температуре подачи выбранной системы",
        cel: "Сколько кВт·ч тепла даёт 1 кВт·ч электроэнергии при более низкой температуре подачи.",
        gdzie: RU_SHEET + " Берите при той же наружной температуре, что и второй COP.",
        zakres: "≥ 1. " + RU_OPT,
      },
      copOdniesienia: {
        nazwa: "COP насоса при температуре подачи стандартных радиаторов",
        cel: "Точка отсчёта — то же устройство при высокой температуре подачи.",
        gdzie: RU_SHEET,
        zakres: "≥ 1. " + RU_OPT,
      },
      cieplo: {
        nazwa: "Годовая потребность в тепле на отопление [кВт·ч/год]",
        cel: "Переводит процент экономии в кВт·ч электроэнергии за год.",
        gdzie: "Экран 2 Модуля 6 (потребность в отоплении) или энергоаудит.",
        zakres: RU_OPT,
      },
      doplata: {
        nazwa: "Доплата за выбранную систему [зл]",
        cel: "Разница в стоимости по сравнению со стандартными радиаторами — для окупаемости.",
        gdzie: "Предложения монтажников, цены радиаторов.",
        zakres: RU_OPT,
      },
      cena: {
        nazwa: "Цена электроэнергии [зл/кВт·ч]",
        cel: "Переводит сэкономленные кВт·ч в деньги.",
        gdzie: "Счёт за электричество или стоимость кВт·ч вашей автономной системы.",
        zakres: RU_OPT,
      },
    },
  },
  "sterowanie-strefowe": {
    "migawka": {
      "oCoChodzi": "Зачем отапливать пустые комнаты? Зональное управление — как свет только там, где вы находитесь.",
      "jakDziala": "Разделите дом на зоны (гостиная, спальни, ванная). Для каждой введите её долю теплопотерь H, комфортную температуру и — если понижаете — пониженную температуру и число часов. Приложение сравнит тепло с отоплением всего дома до комфорта и посчитает электроэнергию приводов и контроллеров (источник: 1–5 Вт каждый).",
      "poCo": "Выигрыш от зон может быть большим, но в автономной системе каждый ватт постоянного потребления на счету — при многих приводах и малом выигрыше управление может стоить больше электроэнергии, чем экономит.",
      "fizyka": "Q = H·(θ − θe)·t для каждой зоны — та же физика, что на Экране 1, в установившемся режиме (верхняя оценка выигрыша). Электроэнергия управления = n·P·h + P_контроллера·24. Сэкономленная электроэнергия отопления = тепло ÷ COP. «18%» из источника — пример, не константа."
    },
    "pola": {
      "nazwa": {
        "nazwa": "Название зоны",
        "cel": "Только описание — на результат не влияет.",
        "gdzie": "Любое.",
        "zakres": "Текст."
      },
      "h": {
        "nazwa": "Коэффициент теплопотерь зоны H [Вт/К]",
        "cel": "Сколько ватт теряет зона на каждый градус разницы температур.",
        "gdzie": "Экран 1 Модуля 6 — потери ограждений и вентиляции этой части дома; сумма H зон = H здания.",
        "zakres": "Ваша установка — приложение не подставляет типовое значение за вас."
      },
      "komfort": {
        "nazwa": "Комфортная температура [°C]",
        "cel": "Температура зоны, когда ею пользуются.",
        "gdzie": "Настройка термостата.",
        "zakres": "Ваша настройка."
      },
      "obnizona": {
        "nazwa": "Пониженная температура [°C]",
        "cel": "Температура зоны, когда ею никто не пользуется.",
        "gdzie": "Настройка термостата в пониженном режиме.",
        "zakres": "Не выше комфортной. Пусто = без понижения."
      },
      "godzin": {
        "nazwa": "Время понижения [ч/сутки]",
        "cel": "Сколько часов в сутки зона при пониженной температуре.",
        "gdzie": "Ваш распорядок (спальня днём, гостиная ночью).",
        "zakres": "0–24 ч."
      },
      "tZewn": {
        "nazwa": "Средняя наружная температура [°C]",
        "cel": "Сутки, для которых считается выигрыш (например, типичные зимние).",
        "gdzie": "Климатические данные места (Модуль 1) или средняя месяца с Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "liczbaSilownikow": {
        "nazwa": "Количество приводов",
        "cel": "Каждый привод потребляет ток, пока запитан.",
        "gdzie": "Проект установки — обычно один на управляемую петлю/радиатор.",
        "zakres": "Штуки."
      },
      "mocSilownika": {
        "nazwa": "Потребление одного привода [Вт]",
        "cel": "Потребление привода во время питания.",
        "gdzie": "Паспорт привода.",
        "zakres": "Источник: 1–5 Вт каждый — введите значение из паспорта."
      },
      "godzinSilownikow": {
        "nazwa": "Питание приводов [ч/сутки]",
        "cel": "Сколько часов в сутки приводы потребляют ток.",
        "gdzie": "Тип привода (термический NC потребляет, пока клапан открыт) и ваш план.",
        "zakres": "0–24 ч."
      },
      "mocSterownikow": {
        "nazwa": "Контроллер и термостаты — суммарное потребление [Вт]",
        "cel": "Устройства, запитанные круглые сутки.",
        "gdzie": "Паспорта зонального контроллера и термостатов (источник: 1–5 Вт каждый).",
        "zakres": "Сумма по паспортам."
      },
      "cop": {
        "nazwa": "COP отопления",
        "cel": "Переводит сэкономленное тепло в сэкономленную электроэнергию для сравнения с потреблением приводов.",
        "gdzie": "1 = ТЭН/электрокотёл; тепловой насос — паспорт (Экран 5).",
        "zakres": "≥ 1. Пусто = неэлектрическое отопление (топливо) — без баланса электроэнергии."
      }
    }
  },
}
