/**
 * Help content — Module 3, sun-path screen with hourly PV energy (Stage 1 of `docs/tor-slonca-ar-ocena.md`). The panel
 * parameters and PR come from the user (Directive #1: no hidden defaults); the sun geometry is computed by the app.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "tor-slonca": {
    migawka: {
      oCoChodzi:
        "Pokazuje, jak słońce wędruje po niebie w Twoim miejscu w ciągu roku (łuki dla 21 czerwca, 23 września, 21 grudnia i wybranego miesiąca) i — gdy podasz panele — ile energii dają godzina po godzinie. To ten sam obraz, który instalatorzy oglądają w aplikacjach z kamerą, ale policzony z naszych wzorów.",
      jakDziala:
        "1) Współrzędne bierze z projektu (Moduł 1). 2) Dla każdego z czterech dni liczy położenie słońca co minutę: azymut i wysokość nad horyzontem, z poprawką na załamanie światła. 3) Gdy podasz nachylenie, azymut, moc i PR, liczy energię w każdej godzinie dwoma sposobami: jako średni dzień miesiąca z danych pogodowych PVGIS (zawiera chmury) oraz jako dzień przy czystym niebie (tylko promieniowanie bezpośrednie). 4) Suwak godziny przesuwa słońce po łuku i pokazuje energię w tej godzinie.",
      poCo:
        "Zimą w off-gridzie liczy się każda kilowatogodzina, a niskie słońce wędruje wąskim łukiem tuż nad horyzontem. Ten ekran pokazuje, o której godzinie i w którym miesiącu panele naprawdę pracują, i pozwala zobaczyć, ile z letniego uzysku zostaje w grudniu. Wiedza, z której strony i jak wysoko stoi słońce, jest też potrzebna, żeby ocenić, które drzewo albo budynek je zasłoni (Analiza zacienienia).",
      fizyka:
        "Położenie słońca liczymy algorytmem NOAA/Meeusa: deklinacja δ i równanie czasu z dnia roku, kąt godzinny z czasu słonecznego, wysokość h z sin h = sin φ sin δ + cos φ cos δ cos ω, azymut z atan2. Najwyższa wysokość słońca w południe wynosi 90° − φ + δ, czyli w Warszawie ok. 61° latem i ok. 14° w grudniu. Czas na wykresie to czas urzędowy Polski (UTC+1 zimą, UTC+2 latem). Energia w godzinie: E = G_POA / 1000 × P × PR, gdzie G_POA to średnie nasłonecznienie płaszczyzny paneli [W/m²] (model Muneera z danych PVGIS), P moc w kWp, PR współczynnik wpisany przez Ciebie. Przy czystym niebie bierzemy tylko promieniowanie bezpośrednie wg Meinela (1976) pomnożone przez cosinus kąta padania.",
    },
    pola: {
      powierzchnia: {
        nazwa: "Powierzchnia z projektu",
        cel: "Podstawia nachylenie i azymut powierzchni zapisanej w modelu działki, żeby nie wpisywać ich drugi raz.",
        gdzie: "Moduł 1, ekran Skaner działki. Jeśli modelu nie ma, wpisz nachylenie i azymut ręcznie.",
        zakres: "Jedna z powierzchni projektu albo własne wartości.",
      },
      nachylenie: {
        nazwa: "Nachylenie paneli [°]",
        cel: "Kąt między panelem a poziomem. Wyznacza, ile światła pada na panel o danej godzinie i w danym miesiącu.",
        gdzie: "Zaplanowany kąt stelaża albo pomiar kątomierzem.",
        zakres: "0° (płasko) do 90° (pionowo).",
      },
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele. Panele patrzące na południe łapią najwięcej w południe, wschodnie rano, zachodnie po południu.",
        gdzie: "Kompas albo mapa: północ = 0°, wschód = 90°, południe = 180°, zachód = 270°.",
        zakres: "0° do 360°.",
      },
      moc: {
        nazwa: "Moc zainstalowana [kWp]",
        cel: "Łączna moc szczytowa paneli (liczba paneli × moc jednego). Energia na wykresie jest do niej wprost proporcjonalna.",
        gdzie: "Karta katalogowa panelu × liczba paneli albo oferta instalatora.",
        zakres: "Większa od 0, do 1000 kWp (górna granica wyłapuje wpisanie watów zamiast kilowatów).",
      },
      pr: {
        nazwa: "Współczynnik wydajności instalacji PR",
        cel: "Ułamek 0–1: jaka część „teoretycznej” energii zostaje po stratach (temperatura, kable, falownik, zabrudzenie). Mnoży energię z nasłonecznienia; ten ekran nie liczy osobno temperatury.",
        gdzie: "Z projektu instalatora albo monitoringu istniejącej instalacji.",
        zakres: "0–1. Źródło aplikacji nie podaje wartości — wpisz własną.",
      },
      miesiac: {
        nazwa: "Miesiąc",
        cel: "Miesiąc, którego 15. dzień rysuję grubą linią i dla którego pokazuję energię godzina po godzinie. Wybierz grudzień, żeby zobaczyć najtrudniejszy dzień roku.",
        gdzie: "Wybór z listy.",
        zakres: "Styczeń–grudzień.",
      },
      godzina: {
        nazwa: "Godzina doby (czas urzędowy)",
        cel: "Chwila, w której pokazuję słońce na łuku wybranego miesiąca, razem z jego wysokością, azymutem i energią w tej godzinie.",
        gdzie: "Suwak; przycisk „Odtwórz” przesuwa ją sam.",
        zakres: "0–24 h, w krokach co 15 minut.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "tor-slonca": {
    migawka: {
      oCoChodzi:
        "Shows how the sun moves across the sky at your site through the year (arcs for 21 June, 23 September, 21 December and the month you pick) and — once you enter panels — how much energy they give hour by hour. It is the same picture installers see in camera apps, but computed with our own formulas.",
      jakDziala:
        "1) The coordinates come from the project (Module 1). 2) For each of the four days it computes the sun's position every minute: azimuth and elevation above the horizon, corrected for atmospheric refraction. 3) Once you give tilt, azimuth, power and PR, it computes the energy in every hour in two ways: as the average day of the month from PVGIS weather data (clouds included) and as a clear-sky day (direct beam only). 4) The hour slider moves the sun along the arc and shows the energy in that hour.",
      poCo:
        "In winter off-grid every kilowatt-hour counts, and the low sun travels a narrow arc just above the horizon. This screen shows at which hour and in which month the panels really work, and how much of the summer yield is left in December. Knowing which side and how high the sun stands is also needed to judge which tree or building will block it (Shading analysis).",
      fizyka:
        "The sun's position is computed with the NOAA/Meeus algorithm: declination δ and the equation of time from the day of the year, the hour angle from solar time, elevation h from sin h = sin φ sin δ + cos φ cos δ cos ω, azimuth from atan2. The sun's noon elevation is 90° − φ + δ, i.e. about 61° in summer and about 14° in December in Warsaw. The time on the chart is official Polish time (UTC+1 in winter, UTC+2 in summer). Energy in an hour: E = G_POA / 1000 × P × PR, where G_POA is the mean irradiance on the panel plane [W/m²] (Muneer model from PVGIS data), P the power in kWp and PR the factor you enter. For a clear sky we take only the direct beam after Meinel (1976) times the cosine of the incidence angle.",
    },
    pola: {
      powierzchnia: {
        nazwa: "Surface from the project",
        cel: "Fills in the tilt and azimuth of a surface saved in the plot model so you do not type them twice.",
        gdzie: "Module 1, Plot scanner screen. If there is no model, enter the tilt and azimuth by hand.",
        zakres: "One of the project's surfaces or your own values.",
      },
      nachylenie: {
        nazwa: "Panel tilt [°]",
        cel: "The angle between the panel and the horizontal. It determines how much light hits the panel at a given hour and month.",
        gdzie: "The planned frame angle or a measurement with a protractor.",
        zakres: "0° (flat) to 90° (vertical).",
      },
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face. South-facing panels catch the most at noon, east-facing in the morning, west-facing in the afternoon.",
        gdzie: "Compass or map: north = 0°, east = 90°, south = 180°, west = 270°.",
        zakres: "0° to 360°.",
      },
      moc: {
        nazwa: "Installed power [kWp]",
        cel: "The total peak power of the panels (number of panels × power of one). The energy on the chart is directly proportional to it.",
        gdzie: "Panel datasheet × number of panels, or the installer's offer.",
        zakres: "Greater than 0, up to 1000 kWp (the upper bound catches watts entered instead of kilowatts).",
      },
      pr: {
        nazwa: "Performance ratio PR",
        cel: "A fraction 0–1: what part of the “theoretical” energy remains after losses (temperature, cables, inverter, soiling). It multiplies the energy from insolation; this screen does not compute temperature separately.",
        gdzie: "From the installer's design or the monitoring of an existing installation.",
        zakres: "0–1. The app's source gives no value — enter your own.",
      },
      miesiac: {
        nazwa: "Month",
        cel: "The month whose 15th day I draw with a thick line and for which I show the energy hour by hour. Pick December to see the hardest day of the year.",
        gdzie: "Pick from the list.",
        zakres: "January–December.",
      },
      godzina: {
        nazwa: "Hour of the day (official time)",
        cel: "The moment at which I show the sun on the arc of the chosen month, with its elevation, azimuth and the energy in that hour.",
        gdzie: "Slider; the “Play” button moves it by itself.",
        zakres: "0–24 h, in 15-minute steps.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "tor-slonca": {
    migawka: {
      oCoChodzi:
        "Показывает, как солнце движется по небу в вашем месте в течение года (дуги для 21 июня, 23 сентября, 21 декабря и выбранного месяца) и — когда вы укажете панели — сколько энергии они дают по часам. Это та же картина, которую монтажники видят в приложениях с камерой, но рассчитанная по нашим формулам.",
      jakDziala:
        "1) Координаты берутся из проекта (Модуль 1). 2) Для каждого из четырёх дней каждую минуту рассчитывается положение солнца: азимут и высота над горизонтом с поправкой на преломление света. 3) Когда вы укажете наклон, азимут, мощность и PR, энергия в каждый час считается двумя способами: как средний день месяца по погодным данным PVGIS (с облаками) и как день при ясном небе (только прямое излучение). 4) Ползунок часа двигает солнце по дуге и показывает энергию в этот час.",
      poCo:
        "Зимой в автономной системе важен каждый киловатт-час, а низкое солнце идёт узкой дугой у самого горизонта. Экран показывает, в какой час и в каком месяце панели действительно работают и сколько от летней выработки остаётся в декабре. Знание, с какой стороны и как высоко стоит солнце, нужно и для оценки, какое дерево или здание его закроет (анализ затенения).",
      fizyka:
        "Положение солнца считается алгоритмом NOAA/Мея: склонение δ и уравнение времени по дню года, часовой угол по солнечному времени, высота h из sin h = sin φ sin δ + cos φ cos δ cos ω, азимут через atan2. Высота солнца в полдень равна 90° − φ + δ, то есть в Варшаве около 61° летом и около 14° в декабре. Время на графике — официальное время Польши (UTC+1 зимой, UTC+2 летом). Энергия за час: E = G_POA / 1000 × P × PR, где G_POA — средняя облучённость плоскости панелей [Вт/м²] (модель Мунира по данным PVGIS), P — мощность в кВт·п, PR — коэффициент, который вы вводите. При ясном небе берётся только прямое излучение по Мейнелю (1976), умноженное на косинус угла падения.",
    },
    pola: {
      powierzchnia: {
        nazwa: "Поверхность из проекта",
        cel: "Подставляет наклон и азимут поверхности, сохранённой в модели участка, чтобы не вводить их дважды.",
        gdzie: "Модуль 1, экран «Сканер участка». Если модели нет, введите наклон и азимут вручную.",
        zakres: "Одна из поверхностей проекта или свои значения.",
      },
      nachylenie: {
        nazwa: "Наклон панелей [°]",
        cel: "Угол между панелью и горизонталью. Определяет, сколько света падает на панель в данный час и месяц.",
        gdzie: "Запланированный угол каркаса или замер угломером.",
        zakres: "От 0° (плашмя) до 90° (вертикально).",
      },
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, куда смотрят панели. Панели на юг ловят больше всего в полдень, на восток — утром, на запад — после обеда.",
        gdzie: "Компас или карта: север = 0°, восток = 90°, юг = 180°, запад = 270°.",
        zakres: "От 0° до 360°.",
      },
      moc: {
        nazwa: "Установленная мощность [кВт·п]",
        cel: "Суммарная пиковая мощность панелей (число панелей × мощность одной). Энергия на графике прямо пропорциональна ей.",
        gdzie: "Паспорт панели × число панелей или предложение монтажника.",
        zakres: "Больше 0, до 1000 кВт·п (верхняя граница ловит ввод ватт вместо киловатт).",
      },
      pr: {
        nazwa: "Коэффициент эффективности установки PR",
        cel: "Доля 0–1: какая часть «теоретической» энергии остаётся после потерь (температура, кабели, инвертор, загрязнение). Умножает энергию по инсоляции; этот экран отдельно температуру не считает.",
        gdzie: "Из проекта монтажника или мониторинга существующей установки.",
        zakres: "0–1. Источник приложения не даёт значения — введите своё.",
      },
      miesiac: {
        nazwa: "Месяц",
        cel: "Месяц, 15-й день которого рисуется толстой линией и для которого показана энергия по часам. Выберите декабрь, чтобы увидеть самый трудный день года.",
        gdzie: "Выбор из списка.",
        zakres: "Январь–декабрь.",
      },
      godzina: {
        nazwa: "Час суток (официальное время)",
        cel: "Момент, в который показано солнце на дуге выбранного месяца с его высотой, азимутом и энергией в этот час.",
        gdzie: "Ползунок; кнопка «Показать движение» двигает его сама.",
        zakres: "0–24 ч, с шагом 15 минут.",
      },
    },
  },
}
