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
  "dobor-zrodel-zasilania": {
    migawka: {
      oCoChodzi: "To jest wykonawcza warstwa AI dla zasad, które ustaliłeś ręcznie w Module 4 — system nie wymyśla nowej hierarchii, tylko realizuje ją, uwzględniając prognozy.",
      jakDziala: "Źródło ładowania wybieram według hierarchii z Modułu 4: PV zawsze pierwsze, agregat dopiero poniżej progu krytycznego SoC i bez słońca jutro, sieć przy taniej taryfie. Prąd ładowania ograniczam według temperatury ogniw z Modułu 4: poniżej {blokada} °C ładowanie zablokowane, w zimnie {cZimno}C albo {cChlodno}C. Przesuwanie zadań na szczyt PV robi Ekran 5.",
      poCo: "Jedno miejsce z odpowiedzią „z czego i jakim prądem teraz”. Za wczesny agregat pali paliwo na energię, którą za godzinę dałoby słońce; za duży prąd w mrozie trwale uszkadza ogniwa.",
      fizyka: "I_ład = min(I_możliwy, C_Ah × C-rate(T)).",
    },
    pola: {
      pradMozliwy: {
        nazwa: "Prąd ładowania, jaki źródło może dać teraz [A]",
        cel: "Ile prądu dałoby wybrane źródło bez ograniczeń — porównywane z limitem w zimnie.",
        gdzie: "Nadwyżka PV ÷ napięcie baterii (np. 2400 W ÷ 48 V = 50 A) albo maksymalny prąd ładowarki/agregatu z karty.",
        zakres: "≥ 0. Puste = pokazany tylko limit z temperatury.",
      },
    },
  },
  "audyt-zimowy": {
    migawka: {
      oCoChodzi: "Lepiej odkryć, że generator nie startuje, w spokojny wtorek, niż w środku śnieżycy. Ten raport zbiera na początku zimy wszystko, co trzeba sprawdzić wcześniej.",
      jakDziala: "Oceniasz pięć punktów ze źródła: test generatora, test webasto, przegląd instalacji grzewczej, zapasy paliwa i grzałki BMS. Gdy wpiszesz zapas i potrzebę paliwa, punkt paliwa liczy się sam. Wynik to liczba gotowych punktów i lista braków — „zaplanowane, ale niewykonane” to wciąż brak.",
      poCo: "Zimą każda usterka jest droższa i groźniejsza. Lista z brakami mówi, co zrobić teraz, póki jest czas. Inny raport — Współczynnik Bezpieczeństwa Zimowego (Moduł 7) — patrzy na to samo jako wskaźnik ryzyka.",
    },
    pola: {
      testGeneratora: {
        nazwa: "Test generatora",
        cel: "Czy agregat został uruchomiony próbnie przed zimą.",
        gdzie: "Twój dziennik serwisu; rozruch w mrozie — Moduł 7, agregat w mrozie.",
        zakres: "gotowe / zaplanowane, niewykonane / niewykonane / nie dotyczy.",
      },
      testWebasto: {
        nazwa: "Test webasto (nagrzewnicy)",
        cel: "Czy nagrzewnica została uruchomiona przed sezonem.",
        gdzie: "Twój dziennik serwisu. Bez webasto — „nie dotyczy”.",
        zakres: "gotowe / zaplanowane, niewykonane / niewykonane / nie dotyczy.",
      },
      przegladGrzewczej: {
        nazwa: "Przegląd instalacji grzewczej",
        cel: "Czy źródło ciepła i jego zasilanie zostały sprawdzone przed mrozem.",
        gdzie: "Protokół przeglądu albo Twój dziennik.",
        zakres: "gotowe / zaplanowane, niewykonane / niewykonane / nie dotyczy.",
      },
      zapasPaliwa: {
        nazwa: "Zapasy paliwa",
        cel: "Czy paliwa wystarczy na zimę. Gdy wpiszesz liczby niżej, ten punkt ocenia się sam.",
        gdzie: "Stan zbiorników; potrzebę policzysz w Module 2 (agregat prądotwórczy).",
        zakres: "gotowe / zaplanowane, niewykonane / niewykonane / nie dotyczy.",
      },
      grzalkiBms: {
        nazwa: "Weryfikacja grzałek BMS",
        cel: "Czy grzałki baterii włączają się w mrozie i mają skąd brać prąd.",
        gdzie: "Test w zimną noc albo odczyt z BMS; Moduł 4, grzałki BMS.",
        zakres: "gotowe / zaplanowane, niewykonane / niewykonane / nie dotyczy.",
      },
      zapasL: {
        nazwa: "Zapas paliwa [l]",
        cel: "Porównywany z potrzebą na zimę.",
        gdzie: "Stan zbiorników/kanistrów.",
        zakres: "≥ 0.",
      },
      wymaganyL: {
        nazwa: "Paliwo potrzebne na zimę [l]",
        cel: "Twoja potrzeba — źródło mówi o „zalecanym minimum”, ale nie podaje liczby.",
        gdzie: "Moduł 2, agregat prądotwórczy (paliwo na deficyt) albo Moduł 7 (deficyty miesięczne).",
        zakres: "≥ 0.",
      },
    },
  },
  "wykrywanie-anomalii": {
    migawka: {
      oCoChodzi: "Panele dały dziś mniej, niż powinny, albo dom zużył więcej niż zwykle. Ten ekran mówi, o ile, i pomaga ustalić dlaczego.",
      jakDziala: "Odejmujesz energię oczekiwaną od zmierzonej z tego samego okresu i dostajesz odchylenie w kWh i w procentach. Gdy wpiszesz próg alarmu, ekran oceni, czy to anomalia. Przy spadku produkcji PV prowadzi przez przyczyny w stałej kolejności: pogoda, brud, śnieg, cień — pierwsze „tak” kończy szukanie, a cztery „nie” wskazują prawdopodobne uszkodzenie.",
      poCo: "Spadek produkcji najczęściej ma zwykłą przyczynę, którą widać gołym okiem. Kolejność od najprostszej do najrzadszej oszczędza wyjazd serwisu, a nietypowe zużycie wcześnie zdradza urządzenie, które zostało włączone albo przestało działać.",
    },
    pola: {
      podsystem: {
        nazwa: "Co sprawdzasz",
        cel: "Produkcja PV — szukasz spadku i jego przyczyny. Zużycie — szukasz nietypowego wzrostu albo spadku.",
        gdzie: "Wybierasz sam.",
        zakres: "produkcja PV / zużycie energii.",
      },
      oczekiwana: {
        nazwa: "Energia oczekiwana [kWh]",
        cel: "Punkt odniesienia. Dla PV: ile instalacja powinna dać przy faktycznym nasłonecznieniu tego okresu. Dla zużycia: ile zwykle zużywasz w takim samym okresie.",
        gdzie: "PV: prognoza (Moduł 10), symulacja albo instalacja referencyjna obok. Zużycie: odczyty z wcześniejszych tygodni.",
        zakres: "Liczba dodatnia, ten sam okres co energia zmierzona.",
      },
      zmierzona: {
        nazwa: "Energia zmierzona [kWh]",
        cel: "Ile faktycznie wyprodukowano albo zużyto.",
        gdzie: "Falownik, regulator, licznik albo aplikacja monitoringu.",
        zakres: "Liczba nieujemna, ten sam okres co energia oczekiwana.",
      },
      prog: {
        nazwa: "Próg alarmu [%]",
        cel: "Od jakiego odchylenia uznajesz wynik za anomalię. Bez progu ekran pokazuje samo odchylenie.",
        gdzie: "Twoja decyzja. Liczby z przykładów („o 20% mniej”, „o 40% więcej w nocy”) to ilustracje, nie normy.",
        zakres: "Liczba nieujemna w procentach; puste = bez werdyktu.",
      },
      pogoda: {
        nazwa: "Pogoda",
        cel: "Pierwszy krok: czy oczekiwana produkcja była liczona dla innej pogody niż faktyczna (chmury, mgła, krótszy dzień).",
        gdzie: "Obserwacja nieba, prognoza albo instalacja sąsiada.",
        zakres: "tak / nie / niesprawdzone.",
      },
      brud: {
        nazwa: "Brud",
        cel: "Drugi krok: kurz, pyłek, liście albo ptasie odchody na panelach.",
        gdzie: "Oględziny paneli; mycie — Moduł 3, czystość i śnieg.",
        zakres: "tak / nie / niesprawdzone.",
      },
      snieg: {
        nazwa: "Śnieg",
        cel: "Trzeci krok: czy panele są całkiem lub częściowo przykryte śniegiem albo szronem.",
        gdzie: "Oględziny paneli; odśnieżanie — Moduł 3, czystość i śnieg.",
        zakres: "tak / nie / niesprawdzone.",
      },
      cien: {
        nazwa: "Cień",
        cel: "Czwarty krok: nowa przeszkoda — urosłe drzewo, budynek, antena, sopel na krawędzi.",
        gdzie: "Oględziny w godzinach spadku; Moduł 1, analiza zacienienia.",
        zakres: "tak / nie / niesprawdzone.",
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
  "dobor-zrodel-zasilania": {
    migawka: {
      oCoChodzi: "This is the AI's executive layer for the rules you set by hand in Module 4 — the system does not invent a new hierarchy, it carries it out, taking the forecasts into account.",
      jakDziala: "I pick the charging source by the Module 4 hierarchy: PV always first, the generator only below the critical SoC and with no sun tomorrow, the grid on a cheap tariff. I cap the charging current by the cell temperature from Module 4: below {blokada} °C charging is blocked, in the cold {cZimno}C or {cChlodno}C. Shifting tasks to the PV peak is Screen 5.",
      poCo: "One place answering “from what and at what current now”. A generator started too early burns fuel for energy the sun would give in an hour; too high a current in frost damages the cells for good.",
      fizyka: "I_charge = min(I_possible, C_Ah × C-rate(T)).",
    },
    pola: {
      pradMozliwy: {
        nazwa: "Charging current the source can give now [A]",
        cel: "How much current the chosen source would give without limits — compared with the cold limit.",
        gdzie: "PV surplus ÷ battery voltage (e.g. 2400 W ÷ 48 V = 50 A) or the charger's/generator's maximum current from the datasheet.",
        zakres: "≥ 0. Empty = only the temperature limit is shown.",
      },
    },
  },
  "audyt-zimowy": {
    migawka: {
      oCoChodzi: "Better to find out the generator does not start on a quiet Tuesday than in the middle of a snowstorm. This report gathers at the start of winter everything that must be checked in advance.",
      jakDziala: "You assess the five items of the source: generator test, webasto test, heating system inspection, fuel stock and BMS heaters. If you enter the fuel stock and need, the fuel item is judged by itself. The result is the number of ready items and the list of gaps — “planned but not done” is still a gap.",
      poCo: "In winter every fault is more expensive and more dangerous. The list of gaps says what to do now, while there is time. Another report — the Winter Safety Factor (Module 7) — looks at the same thing as a risk index.",
    },
    pola: {
      testGeneratora: {
        nazwa: "Generator test",
        cel: "Whether the generator was trial-started before winter.",
        gdzie: "Your service log; cold start — Module 7, generator in frost.",
        zakres: "done / planned, not done / not done / not applicable.",
      },
      testWebasto: {
        nazwa: "Webasto (heater) test",
        cel: "Whether the heater was run before the season.",
        gdzie: "Your service log. Without webasto — “not applicable”.",
        zakres: "done / planned, not done / not done / not applicable.",
      },
      przegladGrzewczej: {
        nazwa: "Heating system inspection",
        cel: "Whether the heat source and its power supply were checked before the frost.",
        gdzie: "Inspection report or your log.",
        zakres: "done / planned, not done / not done / not applicable.",
      },
      zapasPaliwa: {
        nazwa: "Fuel stock",
        cel: "Whether there is enough fuel for the winter. If you enter the numbers below, this item is judged by itself.",
        gdzie: "Tank levels; work out the need in Module 2 (generator).",
        zakres: "done / planned, not done / not done / not applicable.",
      },
      grzalkiBms: {
        nazwa: "BMS heater check",
        cel: "Whether the battery heaters switch on in frost and have power to use.",
        gdzie: "A test on a cold night or a BMS reading; Module 4, BMS heaters.",
        zakres: "done / planned, not done / not done / not applicable.",
      },
      zapasL: {
        nazwa: "Fuel in stock [l]",
        cel: "Compared with the need for the winter.",
        gdzie: "Tank/canister levels.",
        zakres: "≥ 0.",
      },
      wymaganyL: {
        nazwa: "Fuel needed for the winter [l]",
        cel: "Your need — the source speaks of a “recommended minimum” but gives no number.",
        gdzie: "Module 2, generator (fuel for the deficit) or Module 7 (monthly deficits).",
        zakres: "≥ 0.",
      },
    },
  },
  "wykrywanie-anomalii": {
    migawka: {
      oCoChodzi: "The panels gave less today than they should, or the house used more than usual. This screen says by how much and helps work out why.",
      jakDziala: "You subtract the expected energy from the measured one for the same period and get the deviation in kWh and percent. Once you enter an alarm threshold, the screen judges whether it is an anomaly. For a PV production drop it walks through the causes in a fixed order: weather, dirt, snow, shade — the first “yes” ends the search, and four “no” answers point to likely damage.",
      poCo: "A production drop most often has an ordinary cause you can see with the naked eye. Going from the simplest to the rarest saves a service visit, and unusual consumption gives away early a device that was left on or has stopped working.",
    },
    pola: {
      podsystem: {
        nazwa: "What you are checking",
        cel: "PV production — you look for a drop and its cause. Consumption — you look for an unusual rise or fall.",
        gdzie: "Your choice.",
        zakres: "PV production / energy consumption.",
      },
      oczekiwana: {
        nazwa: "Expected energy [kWh]",
        cel: "The reference point. For PV: how much the installation should give at the actual sunshine of this period. For consumption: how much you usually use in a similar period.",
        gdzie: "PV: forecast (Module 10), a simulation or a reference installation nearby. Consumption: readings from earlier weeks.",
        zakres: "A positive number, the same period as the measured energy.",
      },
      zmierzona: {
        nazwa: "Measured energy [kWh]",
        cel: "How much was actually produced or consumed.",
        gdzie: "Inverter, charge controller, meter or monitoring app.",
        zakres: "A non-negative number, the same period as the expected energy.",
      },
      prog: {
        nazwa: "Alarm threshold [%]",
        cel: "From what deviation you treat the result as an anomaly. Without a threshold the screen shows the deviation only.",
        gdzie: "Your decision. The example figures (“20% less”, “40% more at night”) are illustrations, not norms.",
        zakres: "A non-negative percentage; empty = no verdict.",
      },
      pogoda: {
        nazwa: "Weather",
        cel: "Step one: was the expected production computed for different weather than the actual one (clouds, fog, a shorter day).",
        gdzie: "Looking at the sky, the forecast or a neighbour's installation.",
        zakres: "yes / no / not checked.",
      },
      brud: {
        nazwa: "Dirt",
        cel: "Step two: dust, pollen, leaves or bird droppings on the panels.",
        gdzie: "Inspecting the panels; cleaning — Module 3, cleanliness and snow.",
        zakres: "yes / no / not checked.",
      },
      snieg: {
        nazwa: "Snow",
        cel: "Step three: are the panels fully or partly covered with snow or frost.",
        gdzie: "Inspecting the panels; clearing snow — Module 3, cleanliness and snow.",
        zakres: "yes / no / not checked.",
      },
      cien: {
        nazwa: "Shade",
        cel: "Step four: a new obstacle — a grown tree, a building, an antenna, an icicle on the edge.",
        gdzie: "Inspection during the hours of the drop; Module 1, shading analysis.",
        zakres: "yes / no / not checked.",
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
  "dobor-zrodel-zasilania": {
    migawka: {
      oCoChodzi: "Это исполнительный слой ИИ для правил, которые вы задали вручную в модуле 4, — система не придумывает новую иерархию, а выполняет её с учётом прогнозов.",
      jakDziala: "Источник заряда выбираю по иерархии модуля 4: PV всегда первым, генератор только ниже критического SoC и без солнца завтра, сеть при дешёвом тарифе. Ток заряда ограничиваю по температуре ячеек из модуля 4: ниже {blokada} °C заряд заблокирован, в холоде {cZimno}C или {cChlodno}C. Перенос задач на пик PV — экран 5.",
      poCo: "Одно место с ответом «от чего и каким током сейчас». Слишком рано запущенный генератор жжёт топливо на энергию, которую через час дало бы солнце; слишком большой ток в мороз навсегда повреждает ячейки.",
      fizyka: "I_зар = min(I_возможный, C_Ah × C-rate(T)).",
    },
    pola: {
      pradMozliwy: {
        nazwa: "Ток заряда, который источник может дать сейчас [А]",
        cel: "Сколько тока дал бы выбранный источник без ограничений — сравнивается с лимитом в холоде.",
        gdzie: "Избыток PV ÷ напряжение батареи (например, 2400 Вт ÷ 48 В = 50 А) или максимальный ток зарядного устройства/генератора из паспорта.",
        zakres: "≥ 0. Пусто = показан только лимит по температуре.",
      },
    },
  },
  "audyt-zimowy": {
    migawka: {
      oCoChodzi: "Лучше узнать, что генератор не заводится, в спокойный вторник, чем посреди метели. Этот отчёт собирает в начале зимы всё, что нужно проверить заранее.",
      jakDziala: "Вы оцениваете пять пунктов из источника: тест генератора, тест вебасто, осмотр отопительной системы, запас топлива и нагреватели BMS. Если ввести запас и потребность в топливе, пункт топлива оценивается сам. Результат — число готовых пунктов и список пробелов; «запланировано, но не выполнено» — всё ещё пробел.",
      poCo: "Зимой каждая неисправность дороже и опаснее. Список пробелов говорит, что сделать сейчас, пока есть время. Другой отчёт — коэффициент зимней безопасности (модуль 7) — смотрит на то же как на индекс риска.",
    },
    pola: {
      testGeneratora: {
        nazwa: "Тест генератора",
        cel: "Был ли генератор пробно запущен до зимы.",
        gdzie: "Ваш журнал обслуживания; пуск в мороз — модуль 7, генератор в мороз.",
        zakres: "готово / запланировано, не выполнено / не выполнено / не относится.",
      },
      testWebasto: {
        nazwa: "Тест вебасто (обогревателя)",
        cel: "Был ли обогреватель запущен до сезона.",
        gdzie: "Ваш журнал обслуживания. Без вебасто — «не относится».",
        zakres: "готово / запланировано, не выполнено / не выполнено / не относится.",
      },
      przegladGrzewczej: {
        nazwa: "Осмотр отопительной системы",
        cel: "Проверены ли источник тепла и его питание до мороза.",
        gdzie: "Протокол осмотра или ваш журнал.",
        zakres: "готово / запланировано, не выполнено / не выполнено / не относится.",
      },
      zapasPaliwa: {
        nazwa: "Запас топлива",
        cel: "Хватит ли топлива на зиму. Если ввести числа ниже, пункт оценивается сам.",
        gdzie: "Уровень в баках; потребность посчитаете в модуле 2 (генератор).",
        zakres: "готово / запланировано, не выполнено / не выполнено / не относится.",
      },
      grzalkiBms: {
        nazwa: "Проверка нагревателей BMS",
        cel: "Включаются ли нагреватели батареи в мороз и есть ли откуда брать ток.",
        gdzie: "Тест холодной ночью или показания BMS; модуль 4, нагреватели BMS.",
        zakres: "готово / запланировано, не выполнено / не выполнено / не относится.",
      },
      zapasL: {
        nazwa: "Запас топлива [л]",
        cel: "Сравнивается с потребностью на зиму.",
        gdzie: "Уровень в баках/канистрах.",
        zakres: "≥ 0.",
      },
      wymaganyL: {
        nazwa: "Топливо, нужное на зиму [л]",
        cel: "Ваша потребность — источник говорит о «рекомендуемом минимуме», но без числа.",
        gdzie: "Модуль 2, генератор (топливо на дефицит) или модуль 7 (месячные дефициты).",
        zakres: "≥ 0.",
      },
    },
  },
  "wykrywanie-anomalii": {
    migawka: {
      oCoChodzi: "Панели дали сегодня меньше, чем должны, или дом потребил больше обычного. Этот экран показывает, насколько, и помогает понять почему.",
      jakDziala: "Вы вычитаете ожидаемую энергию из измеренной за один и тот же период и получаете отклонение в кВт·ч и процентах. Если ввести порог тревоги, экран оценит, аномалия ли это. При спаде выработки PV он проводит по причинам в постоянном порядке: погода, грязь, снег, тень — первое «да» заканчивает поиск, а четыре «нет» указывают на вероятное повреждение.",
      poCo: "Спад выработки чаще всего имеет обычную причину, видимую невооружённым глазом. Порядок от самой простой к самой редкой экономит выезд сервиса, а необычное потребление рано выдаёт устройство, которое осталось включённым или перестало работать.",
    },
    pola: {
      podsystem: {
        nazwa: "Что проверяете",
        cel: "Выработка PV — ищете спад и его причину. Потребление — ищете необычный рост или спад.",
        gdzie: "Выбираете сами.",
        zakres: "выработка PV / потребление энергии.",
      },
      oczekiwana: {
        nazwa: "Ожидаемая энергия [кВт·ч]",
        cel: "Точка отсчёта. Для PV: сколько установка должна дать при фактической инсоляции этого периода. Для потребления: сколько вы обычно потребляете за такой же период.",
        gdzie: "PV: прогноз (модуль 10), симуляция или опорная установка рядом. Потребление: показания за прошлые недели.",
        zakres: "Положительное число, тот же период, что и измеренная энергия.",
      },
      zmierzona: {
        nazwa: "Измеренная энергия [кВт·ч]",
        cel: "Сколько фактически выработано или потреблено.",
        gdzie: "Инвертор, контроллер заряда, счётчик или приложение мониторинга.",
        zakres: "Неотрицательное число, тот же период, что и ожидаемая энергия.",
      },
      prog: {
        nazwa: "Порог тревоги [%]",
        cel: "С какого отклонения вы считаете результат аномалией. Без порога экран показывает только отклонение.",
        gdzie: "Ваше решение. Цифры из примеров («на 20% меньше», «на 40% больше ночью») — иллюстрации, а не нормы.",
        zakres: "Неотрицательное число в процентах; пусто = без вердикта.",
      },
      pogoda: {
        nazwa: "Погода",
        cel: "Первый шаг: не считалась ли ожидаемая выработка для другой погоды, чем фактическая (облака, туман, более короткий день).",
        gdzie: "Наблюдение за небом, прогноз или установка соседа.",
        zakres: "да / нет / не проверено.",
      },
      brud: {
        nazwa: "Грязь",
        cel: "Второй шаг: пыль, пыльца, листья или птичий помёт на панелях.",
        gdzie: "Осмотр панелей; мойка — модуль 3, чистота и снег.",
        zakres: "да / нет / не проверено.",
      },
      snieg: {
        nazwa: "Снег",
        cel: "Третий шаг: покрыты ли панели полностью или частично снегом или инеем.",
        gdzie: "Осмотр панелей; уборка снега — модуль 3, чистота и снег.",
        zakres: "да / нет / не проверено.",
      },
      cien: {
        nazwa: "Тень",
        cel: "Четвёртый шаг: новое препятствие — выросшее дерево, здание, антенна, сосулька на краю.",
        gdzie: "Осмотр в часы спада; модуль 1, анализ затенения.",
        zakres: "да / нет / не проверено.",
      },
    },
  },
}
