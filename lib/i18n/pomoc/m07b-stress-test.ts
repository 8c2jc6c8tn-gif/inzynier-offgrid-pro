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
}
