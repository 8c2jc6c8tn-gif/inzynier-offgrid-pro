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
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Ciepłe powietrze ucieka kominem samo z siebie — trzeba je powstrzymać, ale nie kosztem świeżego powietrza w domu.",
      "jakDziala": "Wpisz kubaturę, liczbę wymian powietrza na dobę i temperatury. Aplikacja zamieni wymiany na strumień powietrza i policzy straty ciepła na dobę (i w okresie). Z pozostałymi stratami budynku — udział wentylacji; ze sprawnością rekuperatora — ile zostałoby przy tym samym strumieniu z odzyskiem ciepła.",
      "poCo": "Wentylacja grawitacyjna to często największa pojedyncza strata starego domu — wiesz, czy rekuperacja ma sens, zanim wydasz pieniądze.",
      "fizyka": "V̇ = n·V / 24 h; Φ = V̇·ρ·cp·ΔT (ρ = 1,2 kg/m³, cp = 1005 J/(kg·K) — jak Ekrany 3 i 12); z odzyskiem Φ·(1 − η). Przykład źródła „15% strat → 5% z rekuperacją” odpowiada sprawności ok. 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Kubatura ogrzewana [m³]",
        "cel": "Objętość powietrza, które wentylacja wymienia.",
        "gdzie": "Powierzchnia ogrzewana × wysokość pomieszczeń (Ekran 1/12).",
        "zakres": "Twój budynek."
      },
      "wymiany": {
        "nazwa": "Liczba wymian powietrza na dobę [1/doba]",
        "cel": "Ile razy na dobę wymienia się całe powietrze domu.",
        "gdzie": "Test szczelności (Ekran 12, wymiany na godzinę × 24) albo pomiar anemometrem na kratkach. Przy silnym wietrze i dużym mrozie wymian jest więcej.",
        "zakres": "Twój budynek — wzoru na ciąg kominowy aplikacja nie ma."
      },
      "tWew": {
        "nazwa": "Temperatura wewnątrz [°C]",
        "cel": "Różnica temperatur napędza straty.",
        "gdzie": "Temperatura, którą utrzymujesz zimą.",
        "zakres": "Twoje ustawienie."
      },
      "tZewn": {
        "nazwa": "Średnia temperatura zewnętrzna [°C]",
        "cel": "Doba, dla której liczysz.",
        "gdzie": "Dane klimatyczne (Moduł 1) albo średnie miesięczne z Ekranu 1.",
        "zakres": "Twoja lokalizacja."
      },
      "szczelny": {
        "nazwa": "Dom nowy, szczelny, bez wentylacji mechanicznej",
        "cel": "Ostrzeżenie źródła: w szczelnym domu wentylacja grawitacyjna nie wymieni powietrza — ryzyko pleśni.",
        "gdzie": "Nowe okna, membrany, dobry wynik testu szczelności.",
        "zakres": "Tak / nie."
      },
      "pozostale": {
        "nazwa": "Pozostałe straty ciepła budynku [W]",
        "cel": "Z nimi liczony jest udział wentylacji w całkowitych stratach.",
        "gdzie": "Strata przez przenikanie z Ekranu 1 przy tych samych temperaturach (bez wentylacji).",
        "zakres": "Puste = bez udziału procentowego."
      },
      "sprawnosc": {
        "nazwa": "Sprawność rekuperatora do porównania [%]",
        "cel": "Ile strat zostałoby przy tym samym strumieniu z odzyskiem ciepła.",
        "gdzie": "Karta rekuperatora (Ekran 3).",
        "zakres": "0–100%. Puste = bez porównania."
      },
      "dni": {
        "nazwa": "Liczba dni",
        "cel": "Mnoży stratę doby na okres (np. miesiąc).",
        "gdzie": "Liczba dni okresu o podobnej średniej temperaturze.",
        "zakres": "Puste = tylko na dobę."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "Grunt na głębokości kilku metrów ma stałą temperaturę przez cały rok — GWC to sposób, żeby to „pożyczyć” na wstępne podgrzanie lub schłodzenie powietrza.",
      "jakDziala": "Wpisz strumień powietrza, o ile stopni GWC podgrzewa powietrze zimą i ile godzin na dobę pracuje. Aplikacja policzy moc i ciepło na dobę; za rekuperatorem tylko część zysku zostaje w domu. Z zapotrzebowaniem — udział, z COP — mniej prądu.",
      "poCo": "Wiesz, ile realnie daje GWC w Twoim systemie — szczególnie za rekuperatorem, gdzie zysk jest dużo mniejszy, niż sugeruje sam przyrost temperatury.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1,2 kg/m³, cp = 1005 J/(kg·K) — jak Ekrany 3 i 12); Q = Φ·(1 − η)·h. Przykład źródła „+4 °C → −5%” nie podaje strumienia ani zapotrzebowania — sam z siebie nie jest odtwarzalny."
    },
    "pola": {
      "strumien": {
        "nazwa": "Strumień powietrza przez GWC [m³/h]",
        "cel": "Ile powietrza podgrzewa grunt.",
        "gdzie": "Nastawa centrali wentylacyjnej (Ekran 3).",
        "zakres": "Twoja instalacja."
      },
      "przyrost": {
        "nazwa": "Przyrost temperatury powietrza zimą [K]",
        "cel": "O ile stopni powietrze za GWC jest cieplejsze niż na zewnątrz.",
        "gdzie": "Dane producenta GWC dla Twojej długości i głębokości albo pomiar termometrem przed i za wymiennikiem w mroźny dzień.",
        "zakres": "Karta katalogowa albo Twój pomiar — aplikacja nie ma modelu gruntu."
      },
      "godziny": {
        "nazwa": "Godziny pracy GWC na dobę [h]",
        "cel": "Mnoży moc na ciepło doby.",
        "gdzie": "Sterowanie przepustnicą GWC (np. tylko poniżej określonej temperatury).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "Sprawność rekuperatora za GWC [%]",
        "cel": "Za rekuperatorem zostaje w domu tylko (1 − sprawność) zysku z GWC.",
        "gdzie": "Karta rekuperatora.",
        "zakres": "0–100%. Puste = brak rekuperatora."
      },
      "zapotrzebowanie": {
        "nazwa": "Zapotrzebowanie na ciepło na dobę [kWh]",
        "cel": "Z nim liczony jest udział GWC.",
        "gdzie": "Ekran 1 albo 2 dla tej samej temperatury zewnętrznej.",
        "zakres": "Puste = bez udziału."
      },
      "cop": {
        "nazwa": "COP ogrzewania",
        "cel": "Zamienia zaoszczędzone ciepło na zaoszczędzony prąd.",
        "gdzie": "1 = grzałka; pompa ciepła — karta (Ekran 5).",
        "zakres": "≥ 1. Puste = bez prądu."
      }
    }
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
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Warm air escapes up the chimney on its own — you have to stop it, but not at the cost of fresh air in the house.",
      "jakDziala": "Enter the volume, the air changes per day and the temperatures. The app turns air changes into an air flow and computes the heat loss per day (and over a period). With the building's other losses — the ventilation share; with a heat recovery efficiency — what would remain at the same flow with recovery.",
      "poCo": "Stack ventilation is often the largest single loss of an old house — you know whether heat recovery makes sense before spending money.",
      "fizyka": "V̇ = n·V / 24 h; Φ = V̇·ρ·cp·ΔT (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K) — as Screens 3 and 12); with recovery Φ·(1 − η). The source example “15% of losses → 5% with recovery” corresponds to an efficiency of about 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Heated volume [m³]",
        "cel": "Volume of air exchanged by ventilation.",
        "gdzie": "Heated floor area × room height (Screen 1/12).",
        "zakres": "Your building."
      },
      "wymiany": {
        "nazwa": "Air changes per day [1/day]",
        "cel": "How many times a day the whole air of the house is exchanged.",
        "gdzie": "Airtightness test (Screen 12, air changes per hour × 24) or an anemometer at the grilles. Strong wind and hard frost mean more changes.",
        "zakres": "Your building — the app has no formula for the stack effect."
      },
      "tWew": {
        "nazwa": "Indoor temperature [°C]",
        "cel": "The temperature difference drives the losses.",
        "gdzie": "The temperature you keep in winter.",
        "zakres": "Your setting."
      },
      "tZewn": {
        "nazwa": "Mean outdoor temperature [°C]",
        "cel": "The day you compute for.",
        "gdzie": "Climate data (Module 1) or monthly means from Screen 1.",
        "zakres": "Your location."
      },
      "szczelny": {
        "nazwa": "New, airtight house without mechanical ventilation",
        "cel": "Source warning: in an airtight house stack ventilation will not exchange the air — mould risk.",
        "gdzie": "New windows, membranes, a good airtightness test result.",
        "zakres": "Yes / no."
      },
      "pozostale": {
        "nazwa": "Other heat losses of the building [W]",
        "cel": "Gives the ventilation share of total losses.",
        "gdzie": "Transmission loss from Screen 1 at the same temperatures (without ventilation).",
        "zakres": "Empty = no percentage share."
      },
      "sprawnosc": {
        "nazwa": "Heat recovery efficiency for comparison [%]",
        "cel": "How much loss would remain at the same flow with heat recovery.",
        "gdzie": "Heat recovery unit datasheet (Screen 3).",
        "zakres": "0–100%. Empty = no comparison."
      },
      "dni": {
        "nazwa": "Number of days",
        "cel": "Multiplies the daily loss over a period (e.g. a month).",
        "gdzie": "Days of a period with a similar mean temperature.",
        "zakres": "Empty = per day only."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "The ground a few metres down has a constant temperature all year — a GHE is a way to “borrow” it to pre-heat or pre-cool the air.",
      "jakDziala": "Enter the air flow, how many degrees the GHE warms the air in winter and how many hours a day it runs. The app computes the power and daily heat; behind a heat recovery unit only part of the gain stays in the house. With the demand — the share; with COP — less electricity.",
      "poCo": "You know what the GHE really gives in your system — especially behind a recuperator, where the gain is much smaller than the temperature rise suggests.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1.2 kg/m³, cp = 1005 J/(kg·K) — as Screens 3 and 12); Q = Φ·(1 − η)·h. The source example “+4 °C → −5%” gives no air flow or demand — it cannot be reproduced by itself."
    },
    "pola": {
      "strumien": {
        "nazwa": "Air flow through the GHE [m³/h]",
        "cel": "How much air the ground warms.",
        "gdzie": "Ventilation unit setting (Screen 3).",
        "zakres": "Your installation."
      },
      "przyrost": {
        "nazwa": "Winter air temperature rise [K]",
        "cel": "How many degrees warmer the air after the GHE is than outdoors.",
        "gdzie": "GHE manufacturer data for your length and depth, or a thermometer before and after the exchanger on a frosty day.",
        "zakres": "Datasheet or your measurement — the app has no ground model."
      },
      "godziny": {
        "nazwa": "GHE operating hours per day [h]",
        "cel": "Turns power into daily heat.",
        "gdzie": "GHE damper control (e.g. only below a set temperature).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "Heat recovery efficiency behind the GHE [%]",
        "cel": "Behind a recuperator only (1 − efficiency) of the GHE gain stays in the house.",
        "gdzie": "Recuperator datasheet.",
        "zakres": "0–100%. Empty = no recuperator."
      },
      "zapotrzebowanie": {
        "nazwa": "Daily heating demand [kWh]",
        "cel": "Gives the GHE share.",
        "gdzie": "Screen 1 or 2 at the same outdoor temperature.",
        "zakres": "Empty = no share."
      },
      "cop": {
        "nazwa": "Heating COP",
        "cel": "Turns heat saved into electricity saved.",
        "gdzie": "1 = heater; heat pump — datasheet (Screen 5).",
        "zakres": "≥ 1. Empty = no electricity."
      }
    }
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
  "wentylacja-grawitacyjna": {
    "migawka": {
      "oCoChodzi": "Тёплый воздух сам уходит в дымоход — его нужно удержать, но не ценой свежего воздуха в доме.",
      "jakDziala": "Введите объём, кратность воздухообмена в сутки и температуры. Приложение переведёт кратность в расход воздуха и посчитает теплопотери за сутки (и за период). С прочими потерями здания — долю вентиляции; с КПД рекуператора — что осталось бы при том же расходе с рекуперацией.",
      "poCo": "Естественная вентиляция часто крупнейшая отдельная потеря старого дома — вы знаете, есть ли смысл в рекуперации, до трат.",
      "fizyka": "V̇ = n·V / 24 ч; Φ = V̇·ρ·cp·ΔT (ρ = 1,2 кг/м³, cp = 1005 Дж/(кг·К) — как на Экранах 3 и 12); с рекуперацией Φ·(1 − η). Пример источника «15% потерь → 5% с рекуперацией» соответствует КПД около 70%."
    },
    "pola": {
      "kubatura": {
        "nazwa": "Отапливаемый объём [м³]",
        "cel": "Объём воздуха, который обменивает вентиляция.",
        "gdzie": "Отапливаемая площадь × высота помещений (Экран 1/12).",
        "zakres": "Ваше здание."
      },
      "wymiany": {
        "nazwa": "Кратность воздухообмена в сутки [1/сутки]",
        "cel": "Сколько раз в сутки обменивается весь воздух дома.",
        "gdzie": "Тест герметичности (Экран 12, обмены в час × 24) или анемометр на решётках. При сильном ветре и морозе обменов больше.",
        "zakres": "Ваше здание — формулы тяги в приложении нет."
      },
      "tWew": {
        "nazwa": "Температура внутри [°C]",
        "cel": "Разница температур определяет потери.",
        "gdzie": "Температура, которую вы держите зимой.",
        "zakres": "Ваша настройка."
      },
      "tZewn": {
        "nazwa": "Средняя наружная температура [°C]",
        "cel": "Сутки, для которых считается.",
        "gdzie": "Климатические данные (Модуль 1) или средние по месяцам с Экрана 1.",
        "zakres": "Ваше местоположение."
      },
      "szczelny": {
        "nazwa": "Новый герметичный дом без механической вентиляции",
        "cel": "Предупреждение источника: в герметичном доме естественная вентиляция не обменяет воздух — риск плесени.",
        "gdzie": "Новые окна, мембраны, хороший результат теста герметичности.",
        "zakres": "Да / нет."
      },
      "pozostale": {
        "nazwa": "Прочие теплопотери здания [Вт]",
        "cel": "Из них считается доля вентиляции в общих потерях.",
        "gdzie": "Потери теплопередачей с Экрана 1 при тех же температурах (без вентиляции).",
        "zakres": "Пусто = без процентной доли."
      },
      "sprawnosc": {
        "nazwa": "КПД рекуператора для сравнения [%]",
        "cel": "Сколько потерь осталось бы при том же расходе с рекуперацией.",
        "gdzie": "Паспорт рекуператора (Экран 3).",
        "zakres": "0–100%. Пусто = без сравнения."
      },
      "dni": {
        "nazwa": "Число дней",
        "cel": "Умножает суточные потери на период (например, месяц).",
        "gdzie": "Дни периода с похожей средней температурой.",
        "zakres": "Пусто = только за сутки."
      }
    }
  },
  "gwc": {
    "migawka": {
      "oCoChodzi": "Грунт на глубине нескольких метров круглый год имеет постоянную температуру — ГТО позволяет «позаимствовать» её для подогрева или охлаждения воздуха.",
      "jakDziala": "Введите расход воздуха, на сколько градусов ГТО подогревает воздух зимой и сколько часов в сутки работает. Приложение посчитает мощность и тепло за сутки; после рекуператора в доме остаётся лишь часть выигрыша. С потребностью — доля, с COP — меньше электроэнергии.",
      "poCo": "Вы знаете, что реально даёт ГТО в вашей системе — особенно после рекуператора, где выигрыш намного меньше, чем кажется по приросту температуры.",
      "fizyka": "Φ = V̇·ρ·cp·ΔT (ρ = 1,2 кг/м³, cp = 1005 Дж/(кг·К) — как на Экранах 3 и 12); Q = Φ·(1 − η)·h. Пример источника «+4 °C → −5%» не даёт расхода и потребности — сам по себе не воспроизводим."
    },
    "pola": {
      "strumien": {
        "nazwa": "Расход воздуха через ГТО [м³/ч]",
        "cel": "Сколько воздуха подогревает грунт.",
        "gdzie": "Настройка вентустановки (Экран 3).",
        "zakres": "Ваша установка."
      },
      "przyrost": {
        "nazwa": "Прирост температуры воздуха зимой [K]",
        "cel": "На сколько градусов воздух после ГТО теплее наружного.",
        "gdzie": "Данные производителя ГТО для вашей длины и глубины или термометр до и после теплообменника в морозный день.",
        "zakres": "Паспорт или ваше измерение — модели грунта в приложении нет."
      },
      "godziny": {
        "nazwa": "Часы работы ГТО в сутки [ч]",
        "cel": "Переводит мощность в тепло за сутки.",
        "gdzie": "Управление заслонкой ГТО (например, только ниже заданной температуры).",
        "zakres": "0–24."
      },
      "rekuperator": {
        "nazwa": "КПД рекуператора после ГТО [%]",
        "cel": "После рекуператора в доме остаётся лишь (1 − КПД) выигрыша ГТО.",
        "gdzie": "Паспорт рекуператора.",
        "zakres": "0–100%. Пусто = без рекуператора."
      },
      "zapotrzebowanie": {
        "nazwa": "Суточная потребность в тепле [кВт·ч]",
        "cel": "Из неё считается доля ГТО.",
        "gdzie": "Экран 1 или 2 при той же наружной температуре.",
        "zakres": "Пусто = без доли."
      },
      "cop": {
        "nazwa": "COP отопления",
        "cel": "Переводит сэкономленное тепло в сэкономленную электроэнергию.",
        "gdzie": "1 = ТЭН; тепловой насос — паспорт (Экран 5).",
        "zakres": "≥ 1. Пусто = без электроэнергии."
      }
    }
  },
}
