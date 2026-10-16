/**
 * Help content — Module 6, screen "Bilans ciepła małego obiektu" (micro-installation mode, spec 37.7). All numbers are the user's own
 * (Directive #1): the app has no default U, COP, calorific value or temperature.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "bilans-ciepla-malego-obiektu": {
    migawka: {
      oCoChodzi: "Mały obiekt to pudełko, które trzeba ogrzać — im lepiej ocieplone i szczelne, tym mniej prądu albo paliwa trzeba.",
      jakDziala: "Liczę wymiary jako prostopadłościan: ściany (bez okien), dach i podłoga z długości i szerokości, plus okna i drzwi z własnym U. Dalej to samo co w „Stratach ciepła budynku”: straty przez przegrody i z wymienianym powietrzem w mrozie obliczeniowym strefy, ciepło miesięczne ze średnich temperatur i — z COP — prąd tylko w miesiącach użytkowania z profilu obiektu. Z paliwem: na ile dni starczy zapasu.",
      poCo: "Wiesz, ile mocy musi mieć ogrzewanie w mrozie, ile prądu zabierze w sezonie i czy panele z baterią to udźwigną — albo na ile starczy paliwa.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  A_ścian = 2(L+W)H − A_otw.;  Q_m = [ΣUA + H_V]·max(0, θ_i − θ_m)·24·d_m.",
    },
    pola: {
      dlugosc: { nazwa: "Długość obiektu [m]", cel: "Wraz z szerokością daje powierzchnię dachu i podłogi oraz obwód ścian.", gdzie: "Pomiar zewnętrzny albo wymiar z dokumentów (kamper: długość nadwozia mieszkalnego).", zakres: "> 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      szerokosc: { nazwa: "Szerokość obiektu [m]", cel: "Wraz z długością daje powierzchnię dachu i podłogi oraz obwód ścian.", gdzie: "Pomiar zewnętrzny albo wymiar z dokumentów.", zakres: "> 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      wysokosc: { nazwa: "Wysokość ogrzewanego wnętrza [m]", cel: "Wysokość ścian; z niej liczę powierzchnię ścian i kubaturę powietrza do ogrzania.", gdzie: "Wysokość od podłogi do sufitu albo ścian bez podniesionego dachu.", zakres: "> 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      uScian: { nazwa: "U ścian [W/(m²·K)]", cel: "Ile W ucieka przez 1 m² ściany przy 1 K różnicy temperatur.", gdzie: "Z projektu, karty producenta zabudowy albo z ekranu „Straty ciepła budynku” (U z warstw i biblioteka materiałów).", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      uDachu: { nazwa: "U dachu [W/(m²·K)]", cel: "Ile W ucieka przez 1 m² dachu przy 1 K różnicy temperatur.", gdzie: "Jak dla ścian. Dach liczę jako płaski prostokąt długość × szerokość.", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      uPodlogi: { nazwa: "U podłogi [W/(m²·K)]", cel: "Ile W ucieka przez 1 m² podłogi przy 1 K różnicy temperatur.", gdzie: "Jak dla ścian.", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      podloga: { nazwa: "Co jest pod podłogą", cel: "Decyduje, czy liczę z temperaturą zewnętrzną strefy, czy z Twoją temperaturą pod podłogą.", gdzie: "Kamper i obiekt na nóżkach — powietrze zewnętrzne. Garaż lub altana na gruncie — grunt albo nieogrzewane pomieszczenie.", zakres: "Lista." },
      tempPodPodloga: { nazwa: "Temperatura pod podłogą [°C]", cel: "Stała temperatura gruntu albo nieogrzewanego pomieszczenia pod podłogą (cały rok).", gdzie: "Twoja ocena albo z projektu — aplikacja nie podaje wartości domyślnej.", zakres: "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      otwory: { nazwa: "Okna i drzwi razem [m²]", cel: "Ich powierzchnię odejmuję od ścian i liczę osobno z własnym U. 0 = bez okien i drzwi.", gdzie: "Suma powierzchni wszystkich okien, włazów, świetlików i drzwi.", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      uOtworow: { nazwa: "U okien i drzwi [W/(m²·K)]", cel: "Ile W ucieka przez 1 m² okna lub drzwi przy 1 K różnicy temperatur.", gdzie: "Z karty okna lub drzwi (U całego okna, nie samej szyby).", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      strefa: { nazwa: "Strefa klimatyczna", cel: "Wyznacza projektową temperaturę zewnętrzną najzimniejszego dnia.", gdzie: "Z mapy stref klimatycznych Polski (PN-82/B-02403 / PN-EN 12831). Dla wyjazdu w inne miejsce wybierz strefę najbliższą temu miejscu.", zakres: "Strefy I–V." },
      tempDom: { nazwa: "Temperatura w środku [°C]", cel: "Temperatura, którą chcesz utrzymać.", gdzie: "Jaką chcesz utrzymać w obiekcie w czasie użytkowania.", zakres: "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      wymiany: { nazwa: "Wymiany powietrza [1/h]", cel: "Ile razy na godzinę wymienia się powietrze w obiekcie.", gdzie: "Nieszczelności + wentylacja. Z testu szczelności albo Twoja ocena.", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      odzysk: { nazwa: "Odzysk ciepła z wentylacji [%] (opcjonalnie)", cel: "O tyle procent zmniejsza stratę wentylacyjną rekuperator.", gdzie: "Sprawność rekuperatora z karty. Puste = bez odzysku.", zakres: "0–100. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      zrodlo: { nazwa: "Źródło ciepła", cel: "Prąd (grzałka, nagrzewnica elektryczna, klimatyzator) wchodzi do zimowego bilansu paneli; paliwo (gaz, olej napędowy, drewno) liczy, na jak długo starczy zapasu.", gdzie: "Wybierz to, czym faktycznie grzejesz.", zakres: "Lista." },
      cop: { nazwa: "COP ogrzewania [–]", cel: "Przelicza ciepło na prąd.", gdzie: "Grzałka, nagrzewnica elektryczna: 1. Pompa ciepła lub klimatyzator: z karty.", zakres: "> 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      paliwoJednostka: { nazwa: "Jednostka paliwa", cel: "Tylko opis w wyniku (np. l, kg, butla).", gdzie: "Tak, jak kupujesz paliwo.", zakres: "Dowolny krótki tekst." },
      paliwoWo: { nazwa: "Wartość opałowa [kWh/jednostkę]", cel: "Ile ciepła daje jednostka paliwa przy spaleniu.", gdzie: "Od sprzedawcy paliwa albo z karty — aplikacja nie podaje wartości domyślnej.", zakres: "> 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      paliwoSprawnosc: { nazwa: "Sprawność nagrzewnicy lub pieca [%]", cel: "Jaka część ciepła ze spalania trafia do wnętrza.", gdzie: "Z karty nagrzewnicy (np. typu Webasto) lub pieca.", zakres: "Powyżej 0 do 100. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      paliwoZapas: { nazwa: "Zapas paliwa [jednostek]", cel: "Z niego liczę, na ile dni i jaką część roku wystarczy.", gdzie: "Ile paliwa masz albo planujesz zabrać.", zakres: "≥ 0. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
      miesiac: { nazwa: "Średnia temperatura miesiąca [°C]", cel: "Z niej liczone są straty i prąd w danym miesiącu.", gdzie: "Z PVGIS dla Twojej lokalizacji albo wpisana ręcznie.", zakres: "Puste miesiące są pomijane. Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie." },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "bilans-ciepla-malego-obiektu": {
    migawka: {
      oCoChodzi: "A small object is a box to be heated — the better insulated and tighter it is, the less electricity or fuel it needs.",
      jakDziala: "I treat the dimensions as a box: walls (without windows), roof and floor from length and width, plus windows and doors with their own U. Then the same as in “Building heat loss”: losses through the partitions and with the exchanged air at the zone’s design frost, monthly heat from mean temperatures and — with a COP — electricity only in the months of use from the object profile. With fuel: for how many days the stock lasts.",
      poCo: "You know what power the heating needs in frost, how much electricity it takes in the season and whether the panels with a battery can carry it — or how long the fuel lasts.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  A_walls = 2(L+W)H − A_open.;  Q_m = [ΣUA + H_V]·max(0, θ_i − θ_m)·24·d_m.",
    },
    pola: {
      dlugosc: { nazwa: "Object length [m]", cel: "Together with the width it gives the roof and floor area and the wall perimeter.", gdzie: "External measurement or a dimension from the documents (camper: length of the living body).", zakres: "> 0. Your installation — the app does not assume a typical value for you." },
      szerokosc: { nazwa: "Object width [m]", cel: "Together with the length it gives the roof and floor area and the wall perimeter.", gdzie: "External measurement or a dimension from the documents.", zakres: "> 0. Your installation — the app does not assume a typical value for you." },
      wysokosc: { nazwa: "Height of the heated interior [m]", cel: "Wall height; I use it for the wall area and the air volume to heat.", gdzie: "Height from floor to ceiling or of the walls without a raised roof.", zakres: "> 0. Your installation — the app does not assume a typical value for you." },
      uScian: { nazwa: "U of the walls [W/(m²·K)]", cel: "How many W escape through 1 m² of wall at 1 K temperature difference.", gdzie: "From the design, the body manufacturer’s data or the “Building heat loss” screen (U from layers and the material library).", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      uDachu: { nazwa: "U of the roof [W/(m²·K)]", cel: "How many W escape through 1 m² of roof at 1 K temperature difference.", gdzie: "As for the walls. The roof is a flat rectangle of length × width.", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      uPodlogi: { nazwa: "U of the floor [W/(m²·K)]", cel: "How many W escape through 1 m² of floor at 1 K temperature difference.", gdzie: "As for the walls.", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      podloga: { nazwa: "What is under the floor", cel: "Decides whether I use the zone’s outdoor temperature or your temperature under the floor.", gdzie: "Camper and an object on legs — outdoor air. A garage or garden house on the ground — ground or an unheated room.", zakres: "List." },
      tempPodPodloga: { nazwa: "Temperature under the floor [°C]", cel: "A fixed temperature of the ground or an unheated room under the floor (all year).", gdzie: "Your estimate or from the design — the app gives no default.", zakres: "Your installation — the app does not assume a typical value for you." },
      otwory: { nazwa: "Windows and doors together [m²]", cel: "I subtract their area from the walls and count it separately with its own U. 0 = no windows or doors.", gdzie: "Sum of the areas of all windows, hatches, skylights and doors.", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      uOtworow: { nazwa: "U of windows and doors [W/(m²·K)]", cel: "How many W escape through 1 m² of window or door at 1 K temperature difference.", gdzie: "From the window or door datasheet (U of the whole window, not just the glass).", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      strefa: { nazwa: "Climate zone", cel: "Sets the design outdoor temperature of the coldest day.", gdzie: "From the map of Polish climate zones (PN-82/B-02403 / PN-EN 12831). For a trip elsewhere pick the zone closest to that place.", zakres: "Zones I–V." },
      tempDom: { nazwa: "Indoor temperature [°C]", cel: "The temperature you want to keep.", gdzie: "What you want to keep in the object while it is in use.", zakres: "Your installation — the app does not assume a typical value for you." },
      wymiany: { nazwa: "Air changes [1/h]", cel: "How many times per hour the air in the object is exchanged.", gdzie: "Leaks + ventilation. From an air-tightness test or your estimate.", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      odzysk: { nazwa: "Ventilation heat recovery [%] (optional)", cel: "By this percentage a recuperator reduces the ventilation loss.", gdzie: "Recuperator efficiency from its datasheet. Empty = no recovery.", zakres: "0–100. Your installation — the app does not assume a typical value for you." },
      zrodlo: { nazwa: "Heat source", cel: "Electricity (resistive heater, electric heater, air conditioner) enters the winter panel balance; fuel (gas, diesel, wood) calculates how long the stock lasts.", gdzie: "Pick what you actually heat with.", zakres: "List." },
      cop: { nazwa: "Heating COP [–]", cel: "Converts heat into electricity.", gdzie: "Resistive or electric heater: 1. Heat pump or air conditioner: from the datasheet.", zakres: "> 0. Your installation — the app does not assume a typical value for you." },
      paliwoJednostka: { nazwa: "Fuel unit", cel: "Only a label in the result (e.g. l, kg, cylinder).", gdzie: "The way you buy the fuel.", zakres: "Any short text." },
      paliwoWo: { nazwa: "Calorific value [kWh/unit]", cel: "How much heat one unit of fuel gives when burnt.", gdzie: "From the fuel seller or the datasheet — the app gives no default.", zakres: "> 0. Your installation — the app does not assume a typical value for you." },
      paliwoSprawnosc: { nazwa: "Heater or stove efficiency [%]", cel: "What part of the combustion heat goes into the interior.", gdzie: "From the heater (e.g. Webasto type) or stove datasheet.", zakres: "Above 0 up to 100. Your installation — the app does not assume a typical value for you." },
      paliwoZapas: { nazwa: "Fuel stock [units]", cel: "From it I calculate for how many days and what part of the year it lasts.", gdzie: "How much fuel you have or plan to take.", zakres: "≥ 0. Your installation — the app does not assume a typical value for you." },
      miesiac: { nazwa: "Monthly mean temperature [°C]", cel: "Losses and electricity for that month are calculated from it.", gdzie: "From PVGIS for your location or entered by hand.", zakres: "Empty months are skipped. Your installation — the app does not assume a typical value for you." },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "bilans-ciepla-malego-obiektu": {
    migawka: {
      oCoChodzi: "Малый объект — это коробка, которую нужно отапливать: чем лучше она утеплена и герметична, тем меньше нужно электроэнергии или топлива.",
      jakDziala: "Размеры считаю как параллелепипед: стены (без окон), крыша и пол из длины и ширины, плюс окна и двери со своим U. Дальше так же, как в «Теплопотерях здания»: потери через ограждения и с воздухообменом при расчётном морозе зоны, месячное тепло по средним температурам и — с COP — электроэнергия только в месяцы использования из профиля объекта. С топливом: на сколько дней хватит запаса.",
      poCo: "Вы знаете, какая мощность нужна отоплению в мороз, сколько электроэнергии оно заберёт за сезон и потянут ли это панели с батареей — или на сколько хватит топлива.",
      fizyka: "Φ = Σ U·A·Δθ + n·V·ρ·c_p/3600·Δθ;  A_стен = 2(L+W)H − A_проём.;  Q_m = [ΣUA + H_V]·max(0, θ_i − θ_m)·24·d_m.",
    },
    pola: {
      dlugosc: { nazwa: "Длина объекта [м]", cel: "Вместе с шириной даёт площадь крыши и пола и периметр стен.", gdzie: "Наружный замер или размер из документов (кемпер: длина жилого кузова).", zakres: "> 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      szerokosc: { nazwa: "Ширина объекта [м]", cel: "Вместе с длиной даёт площадь крыши и пола и периметр стен.", gdzie: "Наружный замер или размер из документов.", zakres: "> 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      wysokosc: { nazwa: "Высота отапливаемого объёма [м]", cel: "Высота стен; по ней считаю площадь стен и объём воздуха для нагрева.", gdzie: "Высота от пола до потолка или стен без приподнятой крыши.", zakres: "> 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      uScian: { nazwa: "U стен [Вт/(м²·К)]", cel: "Сколько Вт уходит через 1 м² стены при разнице 1 К.", gdzie: "Из проекта, данных производителя кузова или экрана «Теплопотери здания» (U по слоям и библиотека материалов).", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      uDachu: { nazwa: "U крыши [Вт/(м²·К)]", cel: "Сколько Вт уходит через 1 м² крыши при разнице 1 К.", gdzie: "Как для стен. Крыша считается плоским прямоугольником длина × ширина.", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      uPodlogi: { nazwa: "U пола [Вт/(м²·К)]", cel: "Сколько Вт уходит через 1 м² пола при разнице 1 К.", gdzie: "Как для стен.", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      podloga: { nazwa: "Что под полом", cel: "Определяет, считаю ли я с наружной температурой зоны или с вашей температурой под полом.", gdzie: "Кемпер и объект на опорах — наружный воздух. Гараж или домик на грунте — грунт или неотапливаемое помещение.", zakres: "Список." },
      tempPodPodloga: { nazwa: "Температура под полом [°C]", cel: "Постоянная температура грунта или неотапливаемого помещения под полом (весь год).", gdzie: "Ваша оценка или из проекта — значения по умолчанию в приложении нет.", zakres: "Ваша установка — приложение не подставляет «типичное» значение за вас." },
      otwory: { nazwa: "Окна и двери вместе [м²]", cel: "Их площадь вычитаю из стен и считаю отдельно со своим U. 0 = без окон и дверей.", gdzie: "Сумма площадей всех окон, люков, световых фонарей и дверей.", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      uOtworow: { nazwa: "U окон и дверей [Вт/(м²·К)]", cel: "Сколько Вт уходит через 1 м² окна или двери при разнице 1 К.", gdzie: "Из паспорта окна или двери (U всего окна, а не только стекла).", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      strefa: { nazwa: "Климатическая зона", cel: "Задаёт расчётную наружную температуру самого холодного дня.", gdzie: "По карте климатических зон Польши (PN-82/B-02403 / PN-EN 12831). Для поездки в другое место выберите ближайшую зону.", zakres: "Зоны I–V." },
      tempDom: { nazwa: "Температура внутри [°C]", cel: "Температура, которую вы хотите поддерживать.", gdzie: "Какую вы хотите держать в объекте во время использования.", zakres: "Ваша установка — приложение не подставляет «типичное» значение за вас." },
      wymiany: { nazwa: "Воздухообмен [1/ч]", cel: "Сколько раз в час воздух в объекте обменивается.", gdzie: "Неплотности + вентиляция. Из теста герметичности или ваша оценка.", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      odzysk: { nazwa: "Рекуперация тепла вентиляции [%] (необязательно)", cel: "На столько процентов рекуператор снижает потери вентиляции.", gdzie: "КПД рекуператора из паспорта. Пусто = без рекуперации.", zakres: "0–100. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      zrodlo: { nazwa: "Источник тепла", cel: "Электричество (нагреватель, электрообогреватель, кондиционер) входит в зимний баланс панелей; топливо (газ, дизель, дрова) считает, на сколько хватит запаса.", gdzie: "Выберите то, чем вы фактически отапливаете.", zakres: "Список." },
      cop: { nazwa: "COP отопления [–]", cel: "Пересчитывает тепло в электроэнергию.", gdzie: "Нагреватель, электрообогреватель: 1. Тепловой насос или кондиционер: из паспорта.", zakres: "> 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      paliwoJednostka: { nazwa: "Единица топлива", cel: "Только подпись в результате (например, л, кг, баллон).", gdzie: "Так, как вы покупаете топливо.", zakres: "Любой короткий текст." },
      paliwoWo: { nazwa: "Теплотворная способность [кВт·ч/ед.]", cel: "Сколько тепла даёт единица топлива при сгорании.", gdzie: "От продавца топлива или из паспорта — значения по умолчанию в приложении нет.", zakres: "> 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      paliwoSprawnosc: { nazwa: "КПД обогревателя или печи [%]", cel: "Какая доля тепла сгорания попадает внутрь.", gdzie: "Из паспорта обогревателя (например, типа Webasto) или печи.", zakres: "Больше 0 до 100. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      paliwoZapas: { nazwa: "Запас топлива [ед.]", cel: "По нему считаю, на сколько дней и какую часть года хватит.", gdzie: "Сколько топлива у вас есть или вы планируете взять.", zakres: "≥ 0. Ваша установка — приложение не подставляет «типичное» значение за вас." },
      miesiac: { nazwa: "Средняя температура месяца [°C]", cel: "По ней считаются потери и электроэнергия за месяц.", gdzie: "Из PVGIS для вашего места или введена вручную.", zakres: "Пустые месяцы пропускаются. Ваша установка — приложение не подставляет «типичное» значение за вас." },
    },
  },
}
