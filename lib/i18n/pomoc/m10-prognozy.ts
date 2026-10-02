/**
 * Help content — Module 10 (forecasts, task shifting and the later AI screens). The forecasts screen runs on demonstration data and has no input
 * fields yet, so it gets a snapshot only; the text states what the engine really sums (TD7).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  prognozy: {
    migawka: {
      oCoChodzi: "To jest „pogoda” Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile będziesz mieć prądu, ile zużyjesz i kiedy będzie ciasno.",
      jakDziala: "Sumuję produkcję i zużycie z punktów prognozy (co 3 godziny), liczę bilans doby i wskazuję godzinę największego zużycia. Na razie ekran pokazuje dane demonstracyjne — docelowo weźmie je z symulacji rocznej i prognozy pogody.",
      poCo: "Widzisz z wyprzedzeniem, czy doba zamknie się nadwyżką czy deficytem i kiedy przypada szczyt — żeby przesunąć duże odbiorniki na godziny ze słońcem.",
    },
    pola: {},
  },
  "przesuwanie-zadan": {
    migawka: {
      oCoChodzi: "AI szuka najlepszego momentu energetycznego, ale zawsze w granicach tego, co Ci pasuje — nie zmusi Cię do czekania na pranie do wieczora, jeśli powiedziałeś, że potrzebujesz go wcześniej.",
      jakDziala: "Z prognozy doby liczę nadwyżkę PV (produkcja − zużycie bazowe) w każdym półgodzinnym odcinku. Potem po kolei, od zadania najwyżej na liście, sprawdzam każdy możliwy start w Twoim oknie i wybieram ten, w którym najwięcej energii zadania przyjdzie z nadwyżki. Zadanie zabiera tę nadwyżkę — następne dostaje to, co zostało. Zadania, które nie mieszczą się w oknie, nie są przesuwane, tylko zgłaszane.",
      poCo: "Każda kWh zużyta prosto z PV to kWh, która nie przechodzi przez baterię — mniej cykli i strat, więcej zapasu na noc. Widzisz od razu, ile energii zadań da słońce, a ile weźmie bateria.",
      fizyka: "N(t) = max(0, P_PV − P_baza); E_PV = Σ min(P_zadania, N) · Δt w oknie zadania; start = ten z największym E_PV.",
    },
    pola: {
      produkcja: {
        nazwa: "Prognozowana produkcja PV w oknie 3 h [kW]",
        cel: "Średnia moc PV w tym oknie — razem ze zużyciem bazowym daje nadwyżkę, pod którą planuję zadania.",
        gdzie: "Ekran Prognozy (przycisk „Wstaw przykładowe dane”), prognoza z falownika albo serwisu pogodowego.",
        zakres: "≥ 0. Nie wyżej niż moc szczytowa Twoich paneli.",
      },
      zuzycie: {
        nazwa: "Zużycie bazowe w oknie 3 h [kW]",
        cel: "Co dom bierze i tak, bez planowanych zadań — odejmowane od produkcji.",
        gdzie: "Historia zużycia z falownika/licznika albo Ekran Prognozy.",
        zakres: "≥ 0.",
      },
      nazwa: {
        nazwa: "Nazwa zadania",
        cel: "Tylko do rozpoznania zadania w planie — nie wpływa na wynik.",
        gdzie: "Dowolna, np. „Pranie”, „Zmywarka”, „Ładowanie auta”.",
        zakres: "Dowolny tekst.",
      },
      moc: {
        nazwa: "Średnia moc urządzenia w pracy [kW]",
        cel: "Ile mocy zadanie bierze w każdej chwili — z nadwyżki PV albo z baterii.",
        gdzie: "Tabliczka lub instrukcja urządzenia; dokładniej — pomiar gniazdkiem z licznikiem (energia cyklu ÷ czas cyklu).",
        zakres: "zakres z karty urządzenia — aplikacja nie przyjmuje typowej wartości za Ciebie.",
      },
      czas: {
        nazwa: "Czas pracy zadania [h]",
        cel: "Jak długo zadanie trwa — w krokach co pół godziny.",
        gdzie: "Czas programu z wyświetlacza pralki/zmywarki albo czas ładowania auta.",
        zakres: "> 0, co 0,5 h, nie dłużej niż Twoje okno.",
      },
      od: {
        nazwa: "Najwcześniejszy start [godzina]",
        cel: "Przed tą godziną zadanie nie ruszy.",
        gdzie: "Twoja decyzja (np. pranie po śniadaniu). Puste = od północy.",
        zakres: "0–24, co 0,5 h (11,5 = 11:30).",
      },
      do: {
        nazwa: "Gotowe do [godzina]",
        cel: "Twój termin — zadanie musi się skończyć najpóźniej o tej godzinie; plan nigdy go nie przekroczy.",
        gdzie: "Twoja decyzja (np. „pranie gotowe do 18:00”). Puste = do końca doby.",
        zakres: "0–24, co 0,5 h, później niż „najwcześniej od”.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  prognozy: {
    migawka: {
      oCoChodzi: "This is the “weather” of your energy system — not just the atmosphere but everything: how much power you'll have, how much you'll use and when it gets tight.",
      jakDziala: "I sum production and consumption from the forecast points (every 3 hours), compute the daily balance and show the hour of peak consumption. For now the screen shows demonstration data — eventually it will take them from the annual simulation and the weather forecast.",
      poCo: "You see ahead whether the day ends in surplus or deficit and when the peak falls — so you can move big loads to sunny hours.",
    },
    pola: {},
  },
  "przesuwanie-zadan": {
    migawka: {
      oCoChodzi: "The AI looks for the best energy moment, but always within what suits you — it will not make you wait for the laundry until evening if you said you need it earlier.",
      jakDziala: "From the day forecast I compute the PV surplus (production − base consumption) in each half-hour slot. Then, one by one from the task highest on the list, I check every possible start within your window and pick the one where most of the task's energy comes from the surplus. The task takes that surplus — the next one gets what is left. Tasks that do not fit their window are not moved, only reported.",
      poCo: "Every kWh used straight from PV is a kWh that does not pass through the battery — fewer cycles and losses, more reserve for the night. You see at once how much of the tasks' energy the sun gives and how much the battery takes.",
      fizyka: "N(t) = max(0, P_PV − P_base); E_PV = Σ min(P_task, N) · Δt over the task window; start = the one with the largest E_PV.",
    },
    pola: {
      produkcja: {
        nazwa: "Forecast PV production in the 3 h window [kW]",
        cel: "Average PV power in this window — together with base consumption it gives the surplus the tasks are planned into.",
        gdzie: "Forecasts screen (the “Insert sample data” button), the inverter's forecast or a weather service.",
        zakres: "≥ 0. Not above the peak power of your panels.",
      },
      zuzycie: {
        nazwa: "Base consumption in the 3 h window [kW]",
        cel: "What the house takes anyway, without the planned tasks — subtracted from production.",
        gdzie: "Consumption history from the inverter/meter or the Forecasts screen.",
        zakres: "≥ 0.",
      },
      nazwa: {
        nazwa: "Task name",
        cel: "Only to recognise the task in the plan — does not affect the result.",
        gdzie: "Anything, e.g. “Laundry”, “Dishwasher”, “Car charging”.",
        zakres: "Any text.",
      },
      moc: {
        nazwa: "Average running power of the appliance [kW]",
        cel: "How much power the task draws at each moment — from the PV surplus or the battery.",
        gdzie: "Nameplate or manual; more precisely — a plug-in energy meter (cycle energy ÷ cycle time).",
        zakres: "range from the device datasheet — the app does not assume a typical value for you.",
      },
      czas: {
        nazwa: "Task run time [h]",
        cel: "How long the task lasts — in half-hour steps.",
        gdzie: "Programme time on the washing machine/dishwasher display or the car charging time.",
        zakres: "> 0, in 0.5 h steps, not longer than your window.",
      },
      od: {
        nazwa: "Earliest start [hour]",
        cel: "The task will not start before this hour.",
        gdzie: "Your decision (e.g. laundry after breakfast). Empty = from midnight.",
        zakres: "0–24, in 0.5 h steps (11.5 = 11:30).",
      },
      do: {
        nazwa: "Ready by [hour]",
        cel: "Your deadline — the task must end by this hour at the latest; the plan never exceeds it.",
        gdzie: "Your decision (e.g. “laundry ready by 18:00”). Empty = until the end of the day.",
        zakres: "0–24, in 0.5 h steps, later than “earliest from”.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  prognozy: {
    migawka: {
      oCoChodzi: "Это «погода» вашей энергосистемы — не только атмосферная, а вся: сколько будет электричества, сколько вы потратите и когда станет туго.",
      jakDziala: "Суммирую выработку и потребление по точкам прогноза (каждые 3 часа), считаю баланс суток и показываю час наибольшего потребления. Пока экран показывает демонстрационные данные — в дальнейшем они будут браться из годовой симуляции и прогноза погоды.",
      poCo: "Вы заранее видите, закончатся ли сутки избытком или дефицитом и когда пик, — чтобы перенести крупные нагрузки на солнечные часы.",
    },
    pola: {},
  },
  "przesuwanie-zadan": {
    migawka: {
      oCoChodzi: "ИИ ищет лучший энергетический момент, но всегда в пределах того, что вам подходит, — он не заставит вас ждать стирку до вечера, если вы сказали, что она нужна раньше.",
      jakDziala: "По прогнозу суток считаю избыток PV (выработка − базовое потребление) в каждом получасовом отрезке. Затем по очереди, начиная с задачи выше всех в списке, проверяю каждый возможный старт в вашем окне и выбираю тот, при котором больше всего энергии задачи придёт из избытка. Задача забирает этот избыток — следующая получает остаток. Задачи, которые не помещаются в окно, не переносятся, а только отмечаются.",
      poCo: "Каждый кВт·ч, потреблённый прямо от PV, не проходит через батарею — меньше циклов и потерь, больше запаса на ночь. Сразу видно, сколько энергии задач даст солнце, а сколько возьмёт батарея.",
      fizyka: "N(t) = max(0, P_PV − P_база); E_PV = Σ min(P_задачи, N) · Δt в окне задачи; старт = тот, где E_PV наибольшая.",
    },
    pola: {
      produkcja: {
        nazwa: "Прогноз выработки PV в окне 3 ч [кВт]",
        cel: "Средняя мощность PV в этом окне — вместе с базовым потреблением даёт избыток, под который планируются задачи.",
        gdzie: "Экран «Прогнозы» (кнопка «Вставить примерные данные»), прогноз инвертора или погодного сервиса.",
        zakres: "≥ 0. Не выше пиковой мощности ваших панелей.",
      },
      zuzycie: {
        nazwa: "Базовое потребление в окне 3 ч [кВт]",
        cel: "Что дом берёт и так, без планируемых задач, — вычитается из выработки.",
        gdzie: "История потребления из инвертора/счётчика или экран «Прогнозы».",
        zakres: "≥ 0.",
      },
      nazwa: {
        nazwa: "Название задачи",
        cel: "Только чтобы узнать задачу в плане — на результат не влияет.",
        gdzie: "Любое, например «Стирка», «Посудомойка», «Зарядка авто».",
        zakres: "Любой текст.",
      },
      moc: {
        nazwa: "Средняя мощность прибора в работе [кВт]",
        cel: "Сколько мощности задача берёт в каждый момент — из избытка PV или из батареи.",
        gdzie: "Табличка или инструкция; точнее — розеточный счётчик энергии (энергия цикла ÷ время цикла).",
        zakres: "диапазон из технической документации устройства — приложение не подставляет типовое значение за вас.",
      },
      czas: {
        nazwa: "Время работы задачи [ч]",
        cel: "Сколько длится задача — с шагом полчаса.",
        gdzie: "Время программы на дисплее стиральной/посудомоечной машины или время зарядки авто.",
        zakres: "> 0, с шагом 0,5 ч, не дольше вашего окна.",
      },
      od: {
        nazwa: "Самый ранний старт [час]",
        cel: "Раньше этого часа задача не начнётся.",
        gdzie: "Ваше решение (например, стирка после завтрака). Пусто = с полуночи.",
        zakres: "0–24, с шагом 0,5 ч (11,5 = 11:30).",
      },
      do: {
        nazwa: "Готово к [час]",
        cel: "Ваш срок — задача должна закончиться не позже этого часа; план никогда его не превысит.",
        gdzie: "Ваше решение (например, «стирка готова к 18:00»). Пусто = до конца суток.",
        zakres: "0–24, с шагом 0,5 ч, позже, чем «не раньше».",
      },
    },
  },
}
