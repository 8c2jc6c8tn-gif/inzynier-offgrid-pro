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
}
