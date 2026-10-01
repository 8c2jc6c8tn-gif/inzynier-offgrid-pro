/**
 * Help content — Module 6 (heating), screens built on 01.10.2026 (branch `work/screens`). Numbers kept by the
 * engines as constants enter through `{params}`; the app never assumes a user value (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "To jak rozmrażanie zamrażarki — pompa ciepła od czasu do czasu musi „oczyścić się” ze szronu, żeby dalej efektywnie pracować, i to też kosztuje energię.",
      jakDziala: "Wpisz cykl defrostu: co ile minut, jak długo i z jaką mocą, oraz pobór przy normalnym grzaniu. Aplikacja policzy, jaką część czasu zajmuje defrost, ile energii dokłada na godzinę i na dobę oraz o ile procent rośnie zużycie — a z COP z katalogu realny COP z defrostem.",
      poCo: "Zimą w wilgotny mróz pompa zużywa więcej prądu, niż wynika z katalogowego COP — bez tego bilans baterii jest zbyt optymistyczny.",
      fizyka: "Szron osadza się na parowniku typowo poniżej 5–{prog} °C przy wysokiej wilgotności (źródło). E_h = P_def · t_def / T; narzut = P_def·t_def / (P_baz·T); COP_ef = COP_kat / (1 + narzut). Przykład źródła „co 45 min, 5 min → +8%” wymaga mocy defrostu 0,72 × mocy pracy (przy równej mocy wychodzi 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Temperatura zewnętrzna [°C]",
        cel: "Porównywana z zakresem szronienia ze źródła i z minimalną temperaturą pracy pompy.",
        gdzie: "Termometr zewnętrzny albo dane klimatyczne (Moduł 1).",
        zakres: "Twoja lokalizacja.",
      },
      wilgotnosc: {
        nazwa: "Wilgotność względna powietrza [%]",
        cel: "Tylko informacja przy wyniku — przy wysokiej wilgotności szronienie jest częstsze, ale źródło nie podaje progu.",
        gdzie: "Higrometr albo prognoza pogody.",
        zakres: "0–100%. Puste = nie wpisano.",
      },
      odstep: {
        nazwa: "Odstęp między defrostami [min]",
        cel: "Czas od początku jednego defrostu do początku następnego.",
        gdzie: "Instrukcja/karta pompy (sterowanie defrostem) albo obserwacja — licznik pracy, aplikacja producenta.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      czas: {
        nazwa: "Czas jednego defrostu [min]",
        cel: "Jak długo pompa pracuje „na chłodzenie”, topiąc szron.",
        gdzie: "Instrukcja albo obserwacja (wentylator jednostki zewnętrznej staje, z parownika paruje).",
        zakres: "Krótszy niż odstęp.",
      },
      mocDefrostu: {
        nazwa: "Pobór prądu w czasie defrostu [kW]",
        cel: "Z nim liczona jest energia jednego defrostu.",
        gdzie: "Pomiar licznikiem/watomierzem w czasie defrostu albo dane producenta.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      mocBazowa: {
        nazwa: "Pobór prądu przy normalnym grzaniu [kW]",
        cel: "Odniesienie dla narzutu procentowego.",
        gdzie: "Karta pompy przy tej temperaturze albo pomiar.",
        zakres: "Karta katalogowa urządzenia albo Twój pomiar.",
      },
      godziny: {
        nazwa: "Godziny szronienia na dobę [h]",
        cel: "Ile godzin w dobie panują warunki szronienia — mnoży energię na godzinę do energii na dobę.",
        gdzie: "Prognoza: godziny z temperaturą w zakresie szronienia i wysoką wilgotnością.",
        zakres: "0–24. Puste = bez wyniku dobowego.",
      },
      cop: {
        nazwa: "COP katalogowy w tej temperaturze",
        cel: "Z niego liczony jest realny COP z defrostem.",
        gdzie: "Karta pompy (COP przy tej temperaturze zewnętrznej) albo Ekran 5.",
        zakres: "≥ 1. Puste = bez realnego COP.",
      },
      tMin: {
        nazwa: "Minimalna temperatura pracy pompy [°C]",
        cel: "Poniżej niej pompa się wyłącza — dom muszą grzać grzałki awaryjne.",
        gdzie: "Karta pompy — zakres temperatur pracy w trybie grzania.",
        zakres: "Puste = nie sprawdzam.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "Like defrosting a freezer — a heat pump from time to time has to “clean itself” of frost to keep working efficiently, and that costs energy too.",
      jakDziala: "Enter the defrost cycle: every how many minutes, how long and at what power, and the power in normal heating. The app computes the share of time spent defrosting, the extra energy per hour and per day, and the percentage increase in consumption — and with the catalogue COP, the real COP including defrost.",
      poCo: "In humid frost the pump uses more electricity than the catalogue COP suggests — without this the battery balance is too optimistic.",
      fizyka: "Frost forms on the evaporator typically below 5–{prog} °C at high humidity (source). E_h = P_def · t_def / T; overhead = P_def·t_def / (P_base·T); COP_eff = COP_cat / (1 + overhead). The source example “every 45 min, 5 min → +8%” needs a defrost power of 0.72 × the running power (equal power gives 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Outdoor temperature [°C]",
        cel: "Compared with the source's frosting range and the pump minimum operating temperature.",
        gdzie: "Outdoor thermometer or climate data (Module 1).",
        zakres: "Your location.",
      },
      wilgotnosc: {
        nazwa: "Relative air humidity [%]",
        cel: "Information next to the result only — frosting is more frequent at high humidity, but the source gives no threshold.",
        gdzie: "Hygrometer or weather forecast.",
        zakres: "0–100%. Empty = not entered.",
      },
      odstep: {
        nazwa: "Interval between defrosts [min]",
        cel: "Time from the start of one defrost to the start of the next.",
        gdzie: "Pump manual/datasheet (defrost control) or observation — run counter, manufacturer app.",
        zakres: "The device datasheet or your measurement.",
      },
      czas: {
        nazwa: "Duration of one defrost [min]",
        cel: "How long the pump runs “in cooling” to melt the frost.",
        gdzie: "Manual or observation (the outdoor unit fan stops, the evaporator steams).",
        zakres: "Shorter than the interval.",
      },
      mocDefrostu: {
        nazwa: "Electrical power during defrost [kW]",
        cel: "Gives the energy of one defrost.",
        gdzie: "Meter/wattmeter reading during defrost or manufacturer data.",
        zakres: "The device datasheet or your measurement.",
      },
      mocBazowa: {
        nazwa: "Electrical power in normal heating [kW]",
        cel: "Reference for the percentage overhead.",
        gdzie: "Pump datasheet at this temperature or a measurement.",
        zakres: "The device datasheet or your measurement.",
      },
      godziny: {
        nazwa: "Frosting hours per day [h]",
        cel: "How many hours a day frosting conditions last — turns energy per hour into energy per day.",
        gdzie: "Forecast: hours with temperature in the frosting range and high humidity.",
        zakres: "0–24. Empty = no daily result.",
      },
      cop: {
        nazwa: "Catalogue COP at this temperature",
        cel: "Gives the real COP including defrost.",
        gdzie: "Pump datasheet (COP at this outdoor temperature) or Screen 5.",
        zakres: "≥ 1. Empty = no real COP.",
      },
      tMin: {
        nazwa: "Pump minimum operating temperature [°C]",
        cel: "Below it the pump switches off — backup heaters must heat the house.",
        gdzie: "Pump datasheet — heating mode operating range.",
        zakres: "Empty = not checked.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "cykle-odszraniania": {
    migawka: {
      oCoChodzi: "Как разморозка морозилки — тепловой насос время от времени должен «очиститься» от инея, чтобы дальше работать эффективно, и это тоже стоит энергии.",
      jakDziala: "Введите цикл оттайки: каждые сколько минут, как долго и с какой мощностью, а также потребление при обычном отоплении. Приложение посчитает долю времени на оттайку, дополнительную энергию за час и за сутки и рост потребления в процентах — а с каталожным COP реальный COP с оттайкой.",
      poCo: "Во влажный мороз насос потребляет больше электроэнергии, чем следует из каталожного COP, — без этого баланс батареи слишком оптимистичен.",
      fizyka: "Иней образуется на испарителе обычно ниже 5–{prog} °C при высокой влажности (источник). E_ч = P_отт · t_отт / T; надбавка = P_отт·t_отт / (P_баз·T); COP_эф = COP_кат / (1 + надбавка). Пример источника «каждые 45 мин, 5 мин → +8%» требует мощности оттайки 0,72 × рабочей (при равной мощности выходит 11%).",
    },
    pola: {
      tZewn: {
        nazwa: "Наружная температура [°C]",
        cel: "Сравнивается с диапазоном обмерзания из источника и с минимальной рабочей температурой насоса.",
        gdzie: "Уличный термометр или климатические данные (Модуль 1).",
        zakres: "Ваше местоположение.",
      },
      wilgotnosc: {
        nazwa: "Относительная влажность воздуха [%]",
        cel: "Только информация при результате — при высокой влажности обмерзание чаще, но источник не даёт порога.",
        gdzie: "Гигрометр или прогноз погоды.",
        zakres: "0–100%. Пусто = не введено.",
      },
      odstep: {
        nazwa: "Интервал между оттайками [мин]",
        cel: "Время от начала одной оттайки до начала следующей.",
        gdzie: "Инструкция/паспорт насоса (управление оттайкой) или наблюдение — счётчик работы, приложение производителя.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      czas: {
        nazwa: "Длительность одной оттайки [мин]",
        cel: "Как долго насос работает «на охлаждение», растапливая иней.",
        gdzie: "Инструкция или наблюдение (вентилятор наружного блока останавливается, испаритель парит).",
        zakres: "Короче интервала.",
      },
      mocDefrostu: {
        nazwa: "Потребляемая мощность во время оттайки [кВт]",
        cel: "Из неё считается энергия одной оттайки.",
        gdzie: "Измерение счётчиком/ваттметром во время оттайки или данные производителя.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      mocBazowa: {
        nazwa: "Потребляемая мощность при обычном отоплении [кВт]",
        cel: "Опорное значение для процентной надбавки.",
        gdzie: "Паспорт насоса при этой температуре или измерение.",
        zakres: "Паспорт устройства или ваше измерение.",
      },
      godziny: {
        nazwa: "Часы обмерзания в сутки [ч]",
        cel: "Сколько часов в сутки держатся условия обмерзания — переводит энергию за час в энергию за сутки.",
        gdzie: "Прогноз: часы с температурой в диапазоне обмерзания и высокой влажностью.",
        zakres: "0–24. Пусто = без суточного результата.",
      },
      cop: {
        nazwa: "Каталожный COP при этой температуре",
        cel: "Из него считается реальный COP с оттайкой.",
        gdzie: "Паспорт насоса (COP при этой наружной температуре) или Экран 5.",
        zakres: "≥ 1. Пусто = без реального COP.",
      },
      tMin: {
        nazwa: "Минимальная рабочая температура насоса [°C]",
        cel: "Ниже неё насос выключается — дом должны греть резервные ТЭНы.",
        gdzie: "Паспорт насоса — рабочий диапазон в режиме отопления.",
        zakres: "Пусто = не проверяется.",
      },
    },
  },
}
