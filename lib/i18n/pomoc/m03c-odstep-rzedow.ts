/**
 * Help content — Module 3, row-spacing calculator (D81). Numbers come from the user's panel datasheet and from the sun
 * geometry; the window of hours is a design choice of the user, not a standard (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "odstep-rzedow": {
    migawka: {
      oCoChodzi:
        "Panele pochylone na gruncie lub płaskim dachu stoją rzędami, a zimą niskie słońce rzuca cień jednego rzędu na następny. Ten ekran liczy, jak daleko postawić rzędy, żeby się nie zacieniały — i ile energii tracisz, jeśli postawisz je gęściej.",
      jakDziala:
        "1) Podajesz nachylenie, azymut i wymiar panelu wzdłuż spadu (albo wstawiasz panel z katalogu). 2) Wybierasz okno godzin 21 grudnia, w którym rzędy mają się nie zacieniać. 3) Aplikacja liczy pozycję słońca w tym oknie dla współrzędnych Twojego projektu i z geometrii wyznacza odstęp rzędów. 4) Jeśli podasz własny odstęp, pokazuje, jak daleko sięga cień i ile energii zimą i w roku tracisz (z typowego roku pogodowego). 5) Tabela kątów pokazuje, jaki kąt daje najwięcej zimowej energii na metr kwadratowy gruntu przy tym samym oknie albo odstępie.",
      poCo:
        "Zimą w off-gridzie liczy się każda kilowatogodzina, ale stromy kąt, który najlepiej łapie niskie słońce, wymaga bardzo dużych odstępów. Bez tego rachunku łatwo ustawić rzędy za gęsto i stracić zimą dużą część energii albo zająć dużo więcej gruntu, niż trzeba. Aplikacja liczy, decyzja o kompromisie jest Twoja.",
      fizyka:
        "Odstęp rzędów P liczymy w przekroju prostopadłym do rzędów. Górna krawędź stołu o długości L i nachyleniu β leży na wysokości h = L·sinβ, rzut poziomy stołu to d = L·cosβ. Słońce o wysokości α i azymucie γs, przy panelach o azymucie γp, widać w tym przekroju pod kątem profilowym tan α' = tan α / cos(γs − γp). Cień górnej krawędzi sięga za nią na h / tan α' = h·cos(γs − γp) / tan α, więc rzędy nie zacieniają się, gdy P ≥ d + h·cos(γs − γp) / tan α w każdej chwili okna; wyznacza go chwila o największym ilorazie cos(γs − γp) / tan α, zwykle brzeg okna. Gdy słońce świeci zza paneli (cos ≤ 0), rząd przed nimi ich nie zacienia. Strata energii: dla każdej godziny roku z typowego roku PVGIS liczymy zacienioną część stołu u/L, u = [h − (P − d)·tan α'] / (sin β + cos β·tan α'), i mnożymy ją przez promieniowanie bezpośrednie na płaszczyznę; energia rozproszona nie jest pomniejszana, więc wynik jest lekko optymistyczny, a pas cienia przy dolnej krawędzi (diody bocznikujące) może kosztować więcej, zwłaszcza przy panelach ustawionych pionowo. Pozycja słońca pochodzi z tego samego silnika co w Module 1.",
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
        cel: "Kąt między panelem a poziomem. Im większy, tym wyższa górna krawędź, a więc dłuższy cień rzędu.",
        gdzie: "Zaplanowany kąt stelaża albo pomiar kątomierzem.",
        zakres: "0° (płasko) do 90° (pionowo).",
      },
      azymut: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele. Cień rzędu liczę względem niego: słońce z boku rzuca krótszy cień na następny rząd niż słońce prosto z przodu.",
        gdzie: "Kompas albo mapa: północ = 0°, wschód = 90°, południe = 180°, zachód = 270°.",
        zakres: "0° do 360°.",
      },
      albedo: {
        nazwa: "Albedo gruntu [-]",
        cel: "Jaka część światła odbija się od ziemi przed panelami. Wpływa tylko na liczoną energię (kolumny strat), nie na odstęp.",
        gdzie: "Zostaw puste — użyję wartości domyślnej silnika nasłonecznienia. Własną wpisz, jeśli znasz podłoże (trawa, żwir, śnieg).",
        zakres: "0 do 1.",
      },
      katalog: {
        nazwa: "Wymiary panelu z katalogu",
        cel: "Podstawia długość i szerokość panelu z karty katalogowej, żeby nie wpisywać ich ręcznie.",
        gdzie: "Lista paneli z katalogu aplikacji; wymiary pochodzą z kart producentów.",
        zakres: "Jeden z paneli katalogu albo własne wymiary.",
      },
      uklad: {
        nazwa: "Układ panelu w stole",
        cel: "Który bok panelu biegnie wzdłuż spadu. Pionowo (dłuższy bok wzdłuż spadu) daje wyższy stół i dłuższy cień, poziomo — niższy stół, ciaśniejsze rzędy i mniejszy cień przy tej samej liczbie paneli.",
        gdzie: "Twój plan stelaża.",
        zakres: "Pionowo albo poziomo.",
      },
      dlugoscPanelu: {
        nazwa: "Dłuższy bok panelu [mm]",
        cel: "Wymiar panelu; wraz z układem i liczbą paneli jeden nad drugim wyznacza długość stołu wzdłuż spadu.",
        gdzie: "Karta katalogowa panelu, rysunek z wymiarami.",
        zakres: "Z karty katalogowej (typowo 1700–2400 mm).",
      },
      szerokoscPanelu: {
        nazwa: "Krótszy bok panelu [mm]",
        cel: "Wymiar panelu; przy układzie poziomym to on biegnie wzdłuż spadu.",
        gdzie: "Karta katalogowa panelu, rysunek z wymiarami.",
        zakres: "Z karty katalogowej (typowo 1000–1300 mm).",
      },
      panelowWPionie: {
        nazwa: "Paneli jeden nad drugim w stole",
        cel: "Ile paneli leży na stole wzdłuż spadu (jeden rząd paneli albo dwa nad sobą). Więcej to wyższy stół i większy odstęp.",
        gdzie: "Twój plan stelaża.",
        zakres: "Liczba całkowita, co najmniej 1.",
      },
      oknoOd: {
        nazwa: "Początek okna bez cienia [godz.]",
        cel: "Pierwsza godzina czasu słonecznego 21 grudnia, od której rzędy nie mają się zacieniać. Czas słoneczny: południe = 12:00.",
        gdzie: "To Twój wybór projektowy. Szerokie okno (np. 9–15) daje bardzo duże odstępy, wąskie (np. 11–13) małe; zobacz też zakładkę „Strata a odstęp”.",
        zakres: "0 do 24, początek przed końcem; ułamki dozwolone (np. 9,5).",
      },
      oknoDo: {
        nazwa: "Koniec okna bez cienia [godz.]",
        cel: "Ostatnia godzina czasu słonecznego, do której rzędy nie mają się zacieniać.",
        gdzie: "To Twój wybór projektowy; wybierz symetrycznie względem południa albo pod swoje zużycie.",
        zakres: "0 do 24, koniec po początku.",
      },
      odstep: {
        nazwa: "Odstęp rzędów [m]",
        cel: "Odstęp, który masz albo planujesz: pokażę, jak daleko w nim sięga cień i ile energii kosztuje.",
        gdzie: "Zmierz poziomo od dolnej krawędzi jednego rzędu do dolnej krawędzi następnego (to nie jest przerwa w świetle).",
        zakres: "Co najmniej rzut poziomy stołu (długość × cos nachylenia).",
      },
      docelowaStrata: {
        nazwa: "Dopuszczalna strata energii zimą [%]",
        cel: "Strata, którą akceptujesz w listopadzie–lutym. Aplikacja znajdzie najmniejszy odstęp, który się w niej mieści.",
        gdzie: "Twoja decyzja — porównaj z tabelą „Strata a odstęp”.",
        zakres: "Powyżej 0 i poniżej 100%.",
      },
      liczbaRzedow: {
        nazwa: "Liczba rzędów w tablicy",
        cel: "Pierwszy rząd od strony słońca nie jest zacieniany, więc średnia strata tablicy to strata × (liczba rzędów − 1) / liczba rzędów. Bez tej liczby przyjmuję ostrożnie, że tracą wszystkie rzędy.",
        gdzie: "Twój plan rozmieszczenia.",
        zakres: "Liczba całkowita, co najmniej 1.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "odstep-rzedow": {
    migawka: {
      oCoChodzi:
        "Tilted panels on the ground or a flat roof stand in rows, and the low winter sun throws the shadow of one row onto the next. This screen computes how far apart to place the rows so they do not shade each other — and how much energy you lose if you place them closer.",
      jakDziala:
        "1) You give the tilt, azimuth and the panel dimension along the slope (or insert a catalogue panel). 2) You choose the window of hours on 21 December in which the rows must not shade each other. 3) The app computes the sun's position in that window for your project's coordinates and derives the row pitch from the geometry. 4) If you give your own pitch, it shows how far the shadow reaches and how much energy you lose in winter and over the year (from the typical weather year). 5) The angle table shows which tilt gives the most winter energy per square metre of ground for the same window or pitch.",
      poCo:
        "In winter off-grid every kilowatt-hour counts, but a steep tilt that catches the low sun best needs very large spacing. Without this calculation it is easy to place rows too tight and lose a large part of winter energy, or to use much more ground than necessary. The app computes; the compromise is your decision.",
      fizyka:
        "The row pitch P is computed in the cross-section perpendicular to the rows. The upper edge of a table of length L and tilt β sits at height h = L·sinβ, and the table's horizontal projection is d = L·cosβ. The sun at altitude α and azimuth γs, with panels at azimuth γp, appears in this cross-section at the profile angle tan α' = tan α / cos(γs − γp). The shadow of the upper edge reaches h / tan α' = h·cos(γs − γp) / tan α behind it, so rows do not shade each other when P ≥ d + h·cos(γs − γp) / tan α at every moment of the window; the moment with the largest ratio cos(γs − γp) / tan α sets it, usually the edge of the window. When the sun shines from behind the panels (cos ≤ 0), the row in front does not shade them. Energy loss: for every hour of the PVGIS typical year we compute the shaded part of the table u/L, u = [h − (P − d)·tan α'] / (sin β + cos β·tan α'), and multiply it by the direct irradiance on the plane; diffuse energy is not reduced, so the result is slightly optimistic, and a shadow strip along the lower edge (bypass diodes) may cost more, especially with portrait panels. The sun position comes from the same engine as in Module 1.",
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
        cel: "The angle between the panel and the horizontal. The larger it is, the higher the upper edge and so the longer the row's shadow.",
        gdzie: "The planned frame angle or a protractor measurement.",
        zakres: "0° (flat) to 90° (vertical).",
      },
      azymut: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face. The row shadow is computed relative to it: a sun from the side throws a shorter shadow onto the next row than a sun straight in front.",
        gdzie: "Compass or map: north = 0°, east = 90°, south = 180°, west = 270°.",
        zakres: "0° to 360°.",
      },
      albedo: {
        nazwa: "Ground albedo [-]",
        cel: "What fraction of light bounces off the ground in front of the panels. It affects only the computed energy (loss columns), not the pitch.",
        gdzie: "Leave empty — the irradiance engine's default is used. Enter your own if you know the ground (grass, gravel, snow).",
        zakres: "0 to 1.",
      },
      katalog: {
        nazwa: "Panel dimensions from the catalogue",
        cel: "Fills in the panel length and width from the datasheet so you do not type them.",
        gdzie: "The app's panel catalogue; the dimensions come from manufacturers' datasheets.",
        zakres: "One of the catalogue panels or your own dimensions.",
      },
      uklad: {
        nazwa: "Panel orientation in the table",
        cel: "Which side of the panel runs along the slope. Portrait (longer side along the slope) gives a taller table and a longer shadow; landscape a lower table, tighter rows and a smaller shadow for the same number of panels.",
        gdzie: "Your frame plan.",
        zakres: "Portrait or landscape.",
      },
      dlugoscPanelu: {
        nazwa: "Longer side of the panel [mm]",
        cel: "A panel dimension; together with the orientation and the number of panels one above another it sets the table length along the slope.",
        gdzie: "Panel datasheet, the drawing with dimensions.",
        zakres: "From the datasheet (typically 1700–2400 mm).",
      },
      szerokoscPanelu: {
        nazwa: "Shorter side of the panel [mm]",
        cel: "A panel dimension; in landscape this side runs along the slope.",
        gdzie: "Panel datasheet, the drawing with dimensions.",
        zakres: "From the datasheet (typically 1000–1300 mm).",
      },
      panelowWPionie: {
        nazwa: "Panels one above another in the table",
        cel: "How many panels lie on the table along the slope (one row of panels or two stacked). More means a taller table and a larger pitch.",
        gdzie: "Your frame plan.",
        zakres: "Integer, at least 1.",
      },
      oknoOd: {
        nazwa: "Start of the no-shadow window [h]",
        cel: "The first solar-time hour on 21 December from which the rows must not shade each other. Solar time: noon = 12:00.",
        gdzie: "This is your design choice. A wide window (e.g. 9–15) gives very large pitches, a narrow one (e.g. 11–13) small ones; see also the “Loss vs pitch” tab.",
        zakres: "0 to 24, start before end; fractions allowed (e.g. 9.5).",
      },
      oknoDo: {
        nazwa: "End of the no-shadow window [h]",
        cel: "The last solar-time hour up to which the rows must not shade each other.",
        gdzie: "This is your design choice; pick it symmetric around noon or to suit your consumption.",
        zakres: "0 to 24, end after start.",
      },
      odstep: {
        nazwa: "Row pitch [m]",
        cel: "The pitch you have or plan: I show how far the shadow reaches in it and what it costs in energy.",
        gdzie: "Measure horizontally from the lower edge of one row to the lower edge of the next (it is not the clear gap).",
        zakres: "At least the table's horizontal projection (length × cos of the tilt).",
      },
      docelowaStrata: {
        nazwa: "Allowed winter energy loss [%]",
        cel: "The loss you accept in November–February. The app finds the smallest pitch that fits.",
        gdzie: "Your decision — compare it with the “Loss vs pitch” table.",
        zakres: "Above 0 and below 100%.",
      },
      liczbaRzedow: {
        nazwa: "Number of rows in the array",
        cel: "The first row on the sun side is not shaded, so the array's average loss is loss × (rows − 1) / rows. Without this number I cautiously assume all rows lose.",
        gdzie: "Your layout plan.",
        zakres: "Integer, at least 1.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "odstep-rzedow": {
    migawka: {
      oCoChodzi:
        "Наклонённые панели на земле или плоской крыше стоят рядами, а зимой низкое солнце отбрасывает тень одного ряда на следующий. Этот экран считает, как далеко ставить ряды, чтобы они не затеняли друг друга, и сколько энергии вы теряете, если ставите их теснее.",
      jakDziala:
        "1) Вы указываете наклон, азимут и размер панели вдоль ската (или подставляете панель из каталога). 2) Выбираете окно часов 21 декабря, в котором ряды не должны затенять друг друга. 3) Приложение считает положение солнца в этом окне для координат вашего проекта и по геометрии определяет шаг рядов. 4) Если вы укажете свой шаг, оно покажет, докуда достаёт тень и сколько энергии вы теряете зимой и за год (по типичному погодному году). 5) Таблица углов показывает, какой угол даёт больше всего зимней энергии на квадратный метр грунта при том же окне или шаге.",
      poCo:
        "Зимой в автономной системе важен каждый киловатт-час, но крутой угол, лучше всего ловящий низкое солнце, требует очень больших промежутков. Без этого расчёта легко поставить ряды слишком тесно и потерять значительную часть зимней энергии или занять намного больше земли, чем нужно. Приложение считает, а решение о компромиссе — за вами.",
      fizyka:
        "Шаг рядов P считается в сечении, перпендикулярном рядам. Верхний край стола длиной L и наклоном β находится на высоте h = L·sinβ, горизонтальная проекция стола d = L·cosβ. Солнце высотой α и азимутом γs при азимуте панелей γp видно в этом сечении под профильным углом tan α' = tan α / cos(γs − γp). Тень верхнего края достаёт за ним на h / tan α' = h·cos(γs − γp) / tan α, поэтому ряды не затеняют друг друга при P ≥ d + h·cos(γs − γp) / tan α в любой момент окна; его определяет момент с наибольшим отношением cos(γs − γp) / tan α, обычно край окна. Когда солнце светит сзади панелей (cos ≤ 0), ряд впереди их не затеняет. Потери энергии: для каждого часа типичного года PVGIS считаем затенённую часть стола u/L, u = [h − (P − d)·tan α'] / (sin β + cos β·tan α'), и умножаем на прямое излучение на плоскость; рассеянная энергия не уменьшается, поэтому результат слегка оптимистичен, а полоса тени у нижнего края (шунтирующие диоды) может стоить больше, особенно при вертикальной установке панелей. Положение солнца берётся из того же движка, что и в Модуле 1.",
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
        cel: "Угол между панелью и горизонтом. Чем он больше, тем выше верхний край и тем длиннее тень ряда.",
        gdzie: "Запланированный угол каркаса или замер угломером.",
        zakres: "От 0° (горизонтально) до 90° (вертикально).",
      },
      azymut: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, куда смотрят панели. Тень ряда считается относительно него: солнце сбоку даёт более короткую тень на следующий ряд, чем солнце прямо спереди.",
        gdzie: "Компас или карта: север = 0°, восток = 90°, юг = 180°, запад = 270°.",
        zakres: "От 0° до 360°.",
      },
      albedo: {
        nazwa: "Альбедо грунта [-]",
        cel: "Какая часть света отражается от земли перед панелями. Влияет только на считаемую энергию (столбцы потерь), не на шаг.",
        gdzie: "Оставьте пустым — будет использовано значение по умолчанию движка освещённости. Свою введите, если знаете покрытие (трава, гравий, снег).",
        zakres: "От 0 до 1.",
      },
      katalog: {
        nazwa: "Размеры панели из каталога",
        cel: "Подставляет длину и ширину панели из даташита, чтобы не вводить их вручную.",
        gdzie: "Список панелей из каталога приложения; размеры взяты из даташитов производителей.",
        zakres: "Одна из панелей каталога или свои размеры.",
      },
      uklad: {
        nazwa: "Ориентация панели в столе",
        cel: "Какая сторона панели идёт вдоль ската. Вертикально (длинная сторона вдоль ската) даёт более высокий стол и более длинную тень; горизонтально — более низкий стол, более тесные ряды и меньшую тень при том же числе панелей.",
        gdzie: "Ваш план каркаса.",
        zakres: "Вертикально или горизонтально.",
      },
      dlugoscPanelu: {
        nazwa: "Длинная сторона панели [мм]",
        cel: "Размер панели; вместе с ориентацией и числом панелей одна над другой определяет длину стола вдоль ската.",
        gdzie: "Даташит панели, чертёж с размерами.",
        zakres: "Из даташита (обычно 1700–2400 мм).",
      },
      szerokoscPanelu: {
        nazwa: "Короткая сторона панели [мм]",
        cel: "Размер панели; при горизонтальной установке именно эта сторона идёт вдоль ската.",
        gdzie: "Даташит панели, чертёж с размерами.",
        zakres: "Из даташита (обычно 1000–1300 мм).",
      },
      panelowWPionie: {
        nazwa: "Панелей одна над другой в столе",
        cel: "Сколько панелей лежит на столе вдоль ската (один ряд панелей или два друг над другом). Больше — выше стол и больше шаг.",
        gdzie: "Ваш план каркаса.",
        zakres: "Целое число, не менее 1.",
      },
      oknoOd: {
        nazwa: "Начало окна без тени [ч]",
        cel: "Первый час солнечного времени 21 декабря, начиная с которого ряды не должны затенять друг друга. Солнечное время: полдень = 12:00.",
        gdzie: "Это ваш проектный выбор. Широкое окно (например 9–15) даёт очень большие шаги, узкое (например 11–13) — небольшие; смотрите также вкладку «Потери и шаг».",
        zakres: "От 0 до 24, начало раньше конца; допускаются дроби (например 9,5).",
      },
      oknoDo: {
        nazwa: "Конец окна без тени [ч]",
        cel: "Последний час солнечного времени, до которого ряды не должны затенять друг друга.",
        gdzie: "Это ваш проектный выбор; выбирайте симметрично относительно полудня или под своё потребление.",
        zakres: "От 0 до 24, конец после начала.",
      },
      odstep: {
        nazwa: "Шаг рядов [м]",
        cel: "Шаг, который у вас есть или планируется: покажу, докуда в нём достаёт тень и сколько энергии это стоит.",
        gdzie: "Измеряйте по горизонтали от нижнего края одного ряда до нижнего края следующего (это не просвет).",
        zakres: "Не менее горизонтальной проекции стола (длина × cos наклона).",
      },
      docelowaStrata: {
        nazwa: "Допустимые потери энергии зимой [%]",
        cel: "Потери, которые вы готовы принять в ноябре–феврале. Приложение найдёт наименьший шаг, который в них укладывается.",
        gdzie: "Ваше решение — сравните с таблицей «Потери и шаг».",
        zakres: "Больше 0 и меньше 100%.",
      },
      liczbaRzedow: {
        nazwa: "Количество рядов в массиве",
        cel: "Первый ряд со стороны солнца не затеняется, поэтому средние потери массива равны потерям × (число рядов − 1) / число рядов. Без этого числа я осторожно считаю, что теряют все ряды.",
        gdzie: "Ваш план размещения.",
        zakres: "Целое число, не менее 1.",
      },
    },
  },
}
