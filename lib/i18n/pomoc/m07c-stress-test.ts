/**
 * Help content — Module 7 (winter stress test), screens built on 03.10.2026:
 * Deep Winter Energy Budget (E25), inverter under distorted loads (E24), wind turbine as winter support (E16).
 * Every number comes from the user or from a datasheet the user types in (Directive #1, owner decision 03.10.2026).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Energia zimą jest jak pensja — trzeba nią zarządzać, żeby starczyło do „pierwszego”, czyli do wiosny. Ten ekran pilnuje budżetu jednego zimowego miesiąca: porównuje to, co zużyłeś do dziś, z tym, co zaplanowałeś.",
      jakDziala:
        "1) Wpisujesz plan miesiąca: ile da PV, ile agregat i ile użytecznej rezerwy z magazynu przeznaczasz na ten miesiąc — plan P to ich suma. 2) Wpisujesz, który to dzień miesiąca i ile energii zużyto od 1. dnia. 3) Aplikacja liczy budżet na dziś (plan rozłożony po równo na dni), ile zostało z całego planu, tempo dzienne bieżące i dopuszczalne na resztę miesiąca oraz prognozę końca miesiąca. 4) Jeśli jesteś ponad budżetem, podaje o ile procent trzeba ograniczyć zużycie na pozostałe dni, a gdy wpiszesz udział ogrzewania i różnicę temperatur — o ile stopni obniżyć temperaturę w domu. 5) Opcjonalnie dzielisz plan na cele (ogrzewanie, ciepła woda, pompy, światło, reszta) i widzisz, który cel wyprzedził swój budżet.",
      poCo: "Bez tego o braku energii dowiadujesz się w ostatnim tygodniu miesiąca, kiedy zostają już tylko drastyczne decyzje. W środku miesiąca wystarczy obniżyć temperaturę o stopień lub dwa.",
      fizyka:
        "Co i jak liczymy — i dlaczego. Plan P = PV + agregat + magazyn [kWh]. Budżet narastający na dzień d z N dni: B = P·d/N — zakładamy, że plan wydajesz równo; to najprostsza, uczciwa linia odniesienia, ale zimą zużycie bywa nierówne. Odchylenie = zużycie/B − 1. Zostało = P − zużycie. Tempo bieżące = zużycie/d; tempo dopuszczalne = (P − zużycie)/(N − d): tyle możesz dziennie, żeby dociągnąć do końca. Prognoza końca = zużycie/d·N. Wymagane ograniczenie r = 1 − dopuszczalne/bieżące. Ogrzewanie: moc grzewcza jest w przybliżeniu proporcjonalna do różnicy temperatur wewnątrz–na zewnątrz ΔT, więc obniżenie temperatury o 1 K zmniejsza zużycie na ogrzewanie o 1/ΔT jego wartości, a całego zużycia o udział/ΔT. Potrzebne obniżenie = r·ΔT/udział. To przybliżenie stacjonarne — pomija zyski wewnętrzne i bezwładność budynku, traktuj wynik jako rząd wielkości. Uwaga: „prognoza większa od planu” i „zużycie większe od budżetu” to ten sam warunek (zużycie/d·N > P ⇔ zużycie > P·d/N), dlatego żółty oznacza „ponad budżet, jeszcze do uratowania”, a czerwony — „plan już wyczerpany albo nawet wyłączenie ogrzewania nie wystarczy”. Próg wynika z bilansu energii, nie z normy.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Liczba dni miesiąca",
        cel: "Rozkłada plan na dni: budżet jednego dnia to plan podzielony przez tę liczbę.",
        gdzie: "Kalendarz (styczeń 31, luty 28 lub 29, grudzień 31).",
        zakres: "Liczba całkowita 28–31.",
      },
      biezacyDzien: {
        nazwa: "Bieżący dzień miesiąca",
        cel: "Mówi, ile dni już minęło — od tego zależy budżet na dziś i tempo na resztę miesiąca.",
        gdzie: "Kalendarz; wpisz dzień, do którego masz odczytane zużycie (włącznie z nim).",
        zakres: "Liczba całkowita od 1 do liczby dni miesiąca.",
      },
      planPv: {
        nazwa: "Zaplanowana produkcja PV w miesiącu [kWh]",
        cel: "Pierwsze ze źródeł planu — razem z agregatem i magazynem daje całą energię do wydania.",
        gdzie: "Moduł 3 (produkcja miesięczna) albo Twoja ostrożna ocena dla tego miesiąca.",
        zakres: "Twoja instalacja; 0, jeśli PV w tym miesiącu nie liczysz.",
      },
      planAgregat: {
        nazwa: "Zaplanowana energia z agregatu [kWh]",
        cel: "Energia, którą w tym miesiącu zamierzasz wyprodukować agregatem.",
        gdzie: "Ekran „Deficyty miesięczne i agregat” (deficyt miesiąca) albo Twój plan pracy agregatu.",
        zakres: "Puste lub 0 = bez agregatu.",
      },
      planMagazyn: {
        nazwa: "Użyteczna rezerwa magazynu na ten miesiąc [kWh]",
        cel: "Energia z baterii, którą wolno wydać w tym miesiącu (po odjęciu rezerwy awaryjnej).",
        gdzie: "Pojemność użyteczna z Modułu 4 pomniejszona o zapas, który chcesz zostawić na kolejne miesiące.",
        zakres: "Nie więcej niż pojemność użyteczna baterii.",
      },
      zuzycie: {
        nazwa: "Zużycie od 1. dnia do dziś [kWh]",
        cel: "Dotychczas wydana energia — porównywana z budżetem na dziś.",
        gdzie: "Licznik energii / falownik / monitoring: suma zużycia domu od początku miesiąca (z agregatem i ogrzewaniem).",
        zakres: "Większe od zera.",
      },
      celUdzial: {
        nazwa: "Udział celu w planie [%]",
        cel: "Jaką część planu miesiąca przeznaczasz na ten cel; z niej liczony jest budżet celu.",
        gdzie: "Twoja decyzja — zwykle z historii zużycia lub Modułów 2 i 6.",
        zakres: "0–100%, wszystkie cele razem do 100%.",
      },
      celZuzycie: {
        nazwa: "Zużycie celu od 1. dnia do dziś [kWh]",
        cel: "Ile z dotychczasowego zużycia poszło na ten cel.",
        gdzie: "Podlicznik albo szacunek: ogrzewanie, ciepła woda, pompy, oświetlenie.",
        zakres: "Nie więcej niż zużycie razem.",
      },
      udzialOgrzewania: {
        nazwa: "Udział ogrzewania w zużyciu [%]",
        cel: "Pozwala przeliczyć wymagane ograniczenie zużycia na stopnie obniżki temperatury.",
        gdzie: "Podlicznik ogrzewania albo Moduł 6: zużycie na ogrzewanie podzielone przez zużycie razem.",
        zakres: "0–100%; puste = bez przeliczenia na stopnie.",
      },
      roznicaTemperatur: {
        nazwa: "Średnia różnica temperatur wewnątrz–na zewnątrz [K]",
        cel: "Od niej zależy, jak bardzo zmniejsza się ogrzewanie po obniżeniu temperatury o 1 K (o 1/ΔT).",
        gdzie: "Temperatura w domu minus średnia temperatura zewnętrzna z ostatnich dni.",
        zakres: "Większa od zera; zimą zwykle kilkanaście do kilkudziesięciu kelwinów.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Energy in winter is like a salary — you have to manage it so it lasts until „payday”, i.e. until spring. This screen watches the budget of one winter month: it compares what you have used so far with what you planned.",
      jakDziala:
        "1) You enter the month's plan: how much PV will give, how much the generator and how much usable reserve from storage you assign to this month — the plan P is their sum. 2) You enter which day of the month it is and how much energy was used since day 1. 3) The app computes the budget for today (the plan spread evenly over the days), what is left of the whole plan, the current daily pace and the pace allowed for the rest of the month, and the month-end forecast. 4) If you are over budget, it gives by what percentage consumption must be cut for the remaining days, and — if you enter the heating share and the temperature difference — by how many degrees to lower the indoor temperature. 5) Optionally you split the plan into categories (heating, hot water, pumps, light, the rest) and see which one is ahead of its budget.",
      poCo: "Without this you find out about a shortage in the last week of the month, when only drastic decisions are left. Mid-month it is enough to lower the temperature by a degree or two.",
      fizyka:
        "What we compute — and why. Plan P = PV + generator + storage [kWh]. Cumulative budget for day d of N: B = P·d/N — we assume you spend the plan evenly; it is the simplest honest reference line, but winter consumption is uneven. Deviation = consumption/B − 1. Left = P − consumption. Current pace = consumption/d; allowed pace = (P − consumption)/(N − d): that is what you can use per day to make it to the end. Month-end forecast = consumption/d·N. Required cut r = 1 − allowed/current. Heating: heating power is roughly proportional to the indoor–outdoor temperature difference ΔT, so lowering the temperature by 1 K reduces heating consumption by 1/ΔT of its value, and total consumption by share/ΔT. Required lowering = r·ΔT/share. This is a stationary approximation — it ignores internal gains and the building's inertia, so treat the result as an order of magnitude. Note: „forecast above the plan” and „consumption above the budget” are the same condition (consumption/d·N > P ⇔ consumption > P·d/N), so yellow means „over budget, still recoverable” and red means „the plan is already used up, or even switching the heating off is not enough”. The limit comes from the energy balance, not from a standard.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Days in the month",
        cel: "Spreads the plan over the days: one day's budget is the plan divided by this number.",
        gdzie: "Calendar (January 31, February 28 or 29, December 31).",
        zakres: "Whole number 28–31.",
      },
      biezacyDzien: {
        nazwa: "Current day of the month",
        cel: "Says how many days have passed — today's budget and the pace for the rest of the month depend on it.",
        gdzie: "Calendar; enter the day up to which you have the consumption reading (inclusive).",
        zakres: "Whole number from 1 to the number of days in the month.",
      },
      planPv: {
        nazwa: "Planned PV production in the month [kWh]",
        cel: "The first source of the plan — together with the generator and storage it gives all the energy to spend.",
        gdzie: "Module 3 (monthly production) or your cautious estimate for this month.",
        zakres: "Your installation; 0 if you do not count PV this month.",
      },
      planAgregat: {
        nazwa: "Planned generator energy [kWh]",
        cel: "The energy you intend to produce with the generator this month.",
        gdzie: "The „Monthly deficits and the generator” screen (the month's deficit) or your generator run plan.",
        zakres: "Empty or 0 = no generator.",
      },
      planMagazyn: {
        nazwa: "Usable storage reserve for this month [kWh]",
        cel: "Battery energy you may spend this month (after subtracting the emergency reserve).",
        gdzie: "Usable capacity from Module 4 minus the stock you want to leave for the following months.",
        zakres: "No more than the battery's usable capacity.",
      },
      zuzycie: {
        nazwa: "Consumption from day 1 to today [kWh]",
        cel: "Energy spent so far — compared with today's budget.",
        gdzie: "Energy meter / inverter / monitoring: the house's consumption summed since the start of the month (including generator and heating).",
        zakres: "Greater than zero.",
      },
      celUdzial: {
        nazwa: "Category share of the plan [%]",
        cel: "What part of the month's plan you give to this category; the category budget is computed from it.",
        gdzie: "Your decision — usually from consumption history or Modules 2 and 6.",
        zakres: "0–100%, all categories together up to 100%.",
      },
      celZuzycie: {
        nazwa: "Category consumption from day 1 to today [kWh]",
        cel: "How much of the consumption so far went to this category.",
        gdzie: "A sub-meter or an estimate: heating, hot water, pumps, lighting.",
        zakres: "No more than the total consumption.",
      },
      udzialOgrzewania: {
        nazwa: "Heating share of consumption [%]",
        cel: "Lets the required cut in consumption be converted into degrees of temperature reduction.",
        gdzie: "A heating sub-meter or Module 6: heating consumption divided by total consumption.",
        zakres: "0–100%; empty = no conversion to degrees.",
      },
      roznicaTemperatur: {
        nazwa: "Mean indoor–outdoor temperature difference [K]",
        cel: "It sets how much heating falls after lowering the temperature by 1 K (by 1/ΔT).",
        gdzie: "Indoor temperature minus the mean outdoor temperature of recent days.",
        zakres: "Greater than zero; in winter typically from over ten to a few dozen kelvins.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "deep-winter-budget": {
    migawka: {
      oCoChodzi:
        "Энергия зимой как зарплата — ею нужно управлять, чтобы хватило до «получки», то есть до весны. Этот экран следит за бюджетом одного зимнего месяца: сравнивает то, что вы израсходовали к сегодняшнему дню, с тем, что запланировали.",
      jakDziala:
        "1) Вы вводите план месяца: сколько даст PV, сколько генератор и какой полезный резерв накопителя вы отводите на этот месяц — план P это их сумма. 2) Вводите, какой сегодня день месяца и сколько энергии израсходовано с 1-го дня. 3) Приложение считает бюджет на сегодня (план, поровну разложенный по дням), сколько осталось от всего плана, текущий и допустимый на остаток месяца суточный темп и прогноз на конец месяца. 4) Если вы выше бюджета, оно показывает, на сколько процентов нужно сократить потребление на оставшиеся дни, а при вводе доли отопления и разности температур — на сколько градусов снизить температуру в доме. 5) По желанию вы делите план на категории (отопление, горячая вода, насосы, свет, остальное) и видите, какая из них опережает свой бюджет.",
      poCo: "Без этого о нехватке энергии узнаёшь в последнюю неделю месяца, когда остаются только радикальные решения. В середине месяца достаточно снизить температуру на градус-два.",
      fizyka:
        "Что и как считаем — и почему. План P = PV + генератор + накопитель [кВт·ч]. Нарастающий бюджет на день d из N: B = P·d/N — предполагаем, что план тратится равномерно; это простейшая честная опорная линия, но зимой потребление неравномерно. Отклонение = потребление/B − 1. Осталось = P − потребление. Текущий темп = потребление/d; допустимый темп = (P − потребление)/(N − d): столько можно тратить в сутки, чтобы дотянуть до конца. Прогноз конца месяца = потребление/d·N. Необходимое сокращение r = 1 − допустимый/текущий. Отопление: мощность отопления примерно пропорциональна разности температур внутри–снаружи ΔT, поэтому снижение температуры на 1 К уменьшает потребление отопления на 1/ΔT его величины, а всего потребления — на долю/ΔT. Необходимое снижение = r·ΔT/доля. Это стационарное приближение — не учитывает внутренние теплопритоки и инерцию здания, считайте результат порядком величины. Важно: «прогноз больше плана» и «потребление больше бюджета» — одно и то же условие (потребление/d·N > P ⇔ потребление > P·d/N), поэтому жёлтый означает «выше бюджета, ещё можно спасти», а красный — «план уже исчерпан или даже отключение отопления не поможет». Граница вытекает из энергетического баланса, а не из нормы.",
    },
    pola: {
      dniMiesiaca: {
        nazwa: "Число дней в месяце",
        cel: "Раскладывает план по дням: бюджет одного дня — это план, делённый на это число.",
        gdzie: "Календарь (январь 31, февраль 28 или 29, декабрь 31).",
        zakres: "Целое число 28–31.",
      },
      biezacyDzien: {
        nazwa: "Текущий день месяца",
        cel: "Показывает, сколько дней прошло — от этого зависят бюджет на сегодня и темп на остаток месяца.",
        gdzie: "Календарь; укажите день, до которого у вас есть показания потребления (включительно).",
        zakres: "Целое число от 1 до числа дней месяца.",
      },
      planPv: {
        nazwa: "Запланированная выработка PV за месяц [кВт·ч]",
        cel: "Первый источник плана — вместе с генератором и накопителем даёт всю энергию для расходования.",
        gdzie: "Модуль 3 (месячная выработка) или ваша осторожная оценка на этот месяц.",
        zakres: "Ваша установка; 0, если PV в этом месяце не учитываете.",
      },
      planAgregat: {
        nazwa: "Запланированная энергия генератора [кВт·ч]",
        cel: "Энергия, которую вы намерены выработать генератором в этом месяце.",
        gdzie: "Экран «Месячные дефициты и генератор» (дефицит месяца) или ваш план работы генератора.",
        zakres: "Пусто или 0 = без генератора.",
      },
      planMagazyn: {
        nazwa: "Полезный резерв накопителя на этот месяц [кВт·ч]",
        cel: "Энергия батареи, которую можно израсходовать в этом месяце (за вычетом аварийного резерва).",
        gdzie: "Полезная ёмкость из Модуля 4 за вычетом запаса, который вы хотите оставить на следующие месяцы.",
        zakres: "Не больше полезной ёмкости батареи.",
      },
      zuzycie: {
        nazwa: "Потребление с 1-го дня до сегодня [кВт·ч]",
        cel: "Израсходованная к настоящему моменту энергия — сравнивается с бюджетом на сегодня.",
        gdzie: "Счётчик энергии / инвертор / мониторинг: потребление дома с начала месяца (включая генератор и отопление).",
        zakres: "Больше нуля.",
      },
      celUdzial: {
        nazwa: "Доля категории в плане [%]",
        cel: "Какую часть плана месяца вы отводите на эту категорию; по ней считается бюджет категории.",
        gdzie: "Ваше решение — обычно по истории потребления или Модулям 2 и 6.",
        zakres: "0–100%, все категории вместе до 100%.",
      },
      celZuzycie: {
        nazwa: "Потребление категории с 1-го дня до сегодня [кВт·ч]",
        cel: "Сколько из потребления на сегодня пошло на эту категорию.",
        gdzie: "Субсчётчик или оценка: отопление, горячая вода, насосы, освещение.",
        zakres: "Не больше общего потребления.",
      },
      udzialOgrzewania: {
        nazwa: "Доля отопления в потреблении [%]",
        cel: "Позволяет пересчитать необходимое сокращение потребления в градусы снижения температуры.",
        gdzie: "Субсчётчик отопления или Модуль 6: потребление на отопление, делённое на общее потребление.",
        zakres: "0–100%; пусто = без пересчёта в градусы.",
      },
      roznicaTemperatur: {
        nazwa: "Средняя разность температур внутри–снаружи [К]",
        cel: "От неё зависит, насколько уменьшится отопление при снижении температуры на 1 К (на 1/ΔT).",
        gdzie: "Температура в доме минус средняя наружная температура последних дней.",
        zakres: "Больше нуля; зимой обычно от десятка до нескольких десятков кельвинов.",
      },
    },
  },
}
