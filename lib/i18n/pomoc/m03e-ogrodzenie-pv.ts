/**
 * Help content — Module 3, PV-panel fence. The wind zone, height above sea level and terrain category reuse the help of
 * `typ-montazu-pola`; the soil group and density index reuse nothing (own entries: the fence also needs the density).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "ogrodzenie-pv": {
    "migawka": {
      "oCoChodzi": "Panele PV tworzą przęsła ogrodzenia. Ten ekran dobiera, ile słupków, jakie rury i jak głęboki fundament, żeby ogrodzenie wytrzymało wiatr — a panele wisiały co najmniej 25 cm nad ziemią.",
      "jakDziala": "Rozstaw słupków to długość panela plus szczeliny i szerokość słupka. Liczba rzędów wynika z dopuszczalnej wysokości (albo ją wpisujesz). Z Eurokodu 1 (wiatr na tablicę wolno stojącą, albo na ścianę, gdy panele wiszą nisko) aplikacja liczy siłę na słupek, potem szuka najlżejszej rury z katalogu, która przenosi moment u podstawy, i rygla (2 na rząd) dla rozpiętości między słupkami. Fundament to wiercony słup betonu w gruncie niespoistym: głębokość liczona jest dwiema metodami (zachowawczą i Bromsa) z czterech podejść obliczeniowych Eurokodu 7, a o wyniku decyduje większa z nich lub głębokość przemarzania. Grunt wybierasz z tablicy PN-B-03020 — kąt tarcia i gęstość czyta aplikacja.",
      "poCo": "Ogrodzenie z paneli jest żaglem. Zbyt cienkie słupki albo płytki fundament to przewrócone ogrodzenie i rozbite panele. Pod panelami robi się geowłókninę i podsypkę z piasku i żwiru, żeby deszcz nie rozbryzgiwał błota na ich dolną krawędź.",
      "fizyka": "q_p = c_e(z_e)·q_b; F = c_f·q_p·s·h; M_Ed = γQ·F·z_c ≤ W_el·f_y/γM0; H_u = c·γ·D·Kp·L³/(e + L) ≥ γQ·F. Stal i wzór Bromsa nie mają źródła w repozytorium — wynik zawsze jest szacunkiem."
    },
    "pola": {
      "dlugoscPanela": {
        "nazwa": "Długość panela [mm]",
        "cel": "Wyznacza rozstaw słupków — każdy panel opiera się na dwóch słupkach.",
        "gdzie": "Karta katalogowa panela (wymiar dłuższego boku). Ustaw panele tak, by długość biegła wzdłuż ogrodzenia.",
        "zakres": "Z karty katalogowej panela."
      },
      "wysokoscPanela": {
        "nazwa": "Wysokość panela [mm]",
        "cel": "Wysokość jednego rzędu paneli; z niej i z liczby rzędów wynika wysokość ogrodzenia i powierzchnia chwytająca wiatr.",
        "gdzie": "Karta katalogowa panela (wymiar krótszego boku).",
        "zakres": "Z karty katalogowej panela."
      },
      "grubosc": {
        "nazwa": "Grubość panela [mm]",
        "cel": "Do sprawdzenia licowania: czy słupek, rygiel i panel dają jedną płaszczyznę od strony drogi. Puste = licowanie nie jest sprawdzane.",
        "gdzie": "Karta katalogowa panela (rama).",
        "zakres": "Z karty katalogowej panela."
      },
      "szczelinaPozioma": {
        "nazwa": "Szczelina panel–słupek [mm]",
        "cel": "Luz montażowy między krawędzią panela a słupkiem; zwiększa rozstaw słupków.",
        "gdzie": "Zależy od sposobu mocowania (uchwyty, kątowniki).",
        "zakres": "Puste = 0 mm (założenie pokazane w wyniku)."
      },
      "szczelinaPionowa": {
        "nazwa": "Szczelina między rzędami [mm]",
        "cel": "Luz między kolejnymi rzędami paneli; zwiększa wysokość ogrodzenia.",
        "gdzie": "Zależy od sposobu mocowania.",
        "zakres": "Puste = 0 mm (założenie pokazane w wyniku)."
      },
      "przeswit": {
        "nazwa": "Prześwit od ziemi [mm]",
        "cel": "Odległość dolnego brzegu paneli od terenu. Panele nisko przy ziemi brudzą się od dołu kurzem i rozbryzgami deszczu.",
        "gdzie": "Twoja decyzja projektowa; reguła projektu to co najmniej 250 mm (25–30 cm). Pamiętaj o limicie wysokości ogrodzenia bez pozwolenia.",
        "zakres": "Co najmniej 250 mm — poniżej aplikacja zgłasza problem."
      },
      "liczbaRzedow": {
        "nazwa": "Liczba rzędów paneli",
        "cel": "Ile rzędów paneli jest w ogrodzeniu. Puste = aplikacja bierze tyle, ile się zmieści pod limitem wysokości.",
        "gdzie": "Twoja decyzja; musi być liczbą całkowitą.",
        "zakres": "Liczba całkowita, co najmniej 1."
      },
      "maxWysokosc": {
        "nazwa": "Dopuszczalna wysokość ogrodzenia [mm]",
        "cel": "Górna granica wysokości (prześwit + panele). Aplikacja nie przekracza jej przy automatycznym doborze rzędów i ostrzega przy ręcznej liczbie rzędów.",
        "gdzie": "Przepisy budowlane i miejscowy plan zagospodarowania obowiązujące w Twojej gminie — aplikacja nie ma tej wartości, bo zależy od lokalizacji.",
        "zakres": "Puste = brak limitu."
      },
      "dlugoscOgrodzenia": {
        "nazwa": "Długość ogrodzenia [m]",
        "cel": "Tylko do policzenia, ile słupków i paneli potrzeba. Nie wpływa na dobór przekrojów.",
        "gdzie": "Pomiar na działce.",
        "zakres": "Puste = bez liczenia ilości."
      },
      "grupaGruntu": {
        "nazwa": "Grupa gruntu niespoistego",
        "cel": "Wybiera krzywą z wykresu PN-B-03020 (kąt tarcia Φu) i wiersz Tablicy 1 (gęstość objętościowa).",
        "gdzie": "Z dokumentacji geotechnicznej albo z badania gruntu: żwir i pospółka, piasek gruby i średni, piasek drobny i pylasty. Grunty spoiste nie są obsługiwane.",
        "zakres": "Jedna z trzech grup."
      },
      "stopienZageszczeniaId": {
        "nazwa": "Stopień zagęszczenia I_D",
        "cel": "Im grunt bardziej zagęszczony, tym większy kąt tarcia i większa gęstość, więc płytszy fundament.",
        "gdzie": "Z dokumentacji geotechnicznej (sondowanie). Gdy jej nie masz, przyjmij ostrożnie wartość niższą — luźny grunt wymaga głębszego fundamentu.",
        "zakres": "0,20–1,00 (zakres wykresu PN-B-03020; poza nim aplikacja nie ekstrapoluje)."
      },
      "wilgotnosc": {
        "nazwa": "Wilgotność gruntu",
        "cel": "Wybiera kolumnę gęstości objętościowej z Tablicy 1 PN-B-03020. Mokry grunt jest cięższy.",
        "gdzie": "Ocena na miejscu albo dokumentacja geotechniczna.",
        "zakres": "Mało wilgotny, wilgotny albo mokry."
      },
      "gruntPodWoda": {
        "nazwa": "Grunt poniżej zwierciadła wody",
        "cel": "Pod wodą grunt jest „lżejszy” o wyporność (odejmujemy gęstość wody), więc opór gruntu spada i fundament musi być głębszy.",
        "gdzie": "Dokumentacja geotechniczna albo obserwacja poziomu wody w okolicy w porze największych opadów.",
        "zakres": "Tak lub nie."
      },
      "przemarzanie": {
        "nazwa": "Głębokość przemarzania [m]",
        "cel": "Dolna granica głębokości fundamentu — podstawa ma sięgać poniżej strefy przemarzania, żeby mróz jej nie wypychał.",
        "gdzie": "Strefa przemarzania dla Twojej miejscowości z lokalnej mapy lub od urzędu/geotechnika. Aplikacja nie ma tej tablicy w swoich źródłach, więc wartość wpisujesz sam.",
        "zakres": "Większa od 0 [m]."
      },
      "metodaOporu": {
        "nazwa": "Metoda oporu gruntu",
        "cel": "Wybiera, która z dwóch metod liczenia oporu poziomego gruntu wyznacza głębokość fundamentu. Zachowawcza daje głębiej, Broms płyciej; oba wyniki widzisz w wyniku.",
        "gdzie": "Zachowawcza: parcie bierne wg Rankine’a. Broms: wzór z literatury, niepotwierdzony w źródłach aplikacji.",
        "zakres": "Zachowawcza albo Broms."
      },
      "stal": {
        "nazwa": "Gatunek stali rur",
        "cel": "Od granicy plastyczności zależy nośność rury, a więc rozmiar profilu. S355 pozwala na cieńsze profile niż S235.",
        "gdzie": "Zamówienie rur (atest). Granice plastyczności 235 i 355 MPa to wartości z pamięci — do potwierdzenia wg PN-EN 1993-1-1.",
        "zakres": "S235 albo S355."
      },
      "ugiecie": {
        "nazwa": "Dopuszczalne ugięcie rygla [mm]",
        "cel": "Gdy wpiszesz, aplikacja odrzuca rygle, które uginają się bardziej. Puste = ugięcie tylko pokazane.",
        "gdzie": "Wymaganie producenta paneli (karta montażu) albo Twoja decyzja. Norma nie podaje tu jednej wartości.",
        "zakres": "Większe od 0 [mm]."
      }
    }
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "ogrodzenie-pv": {
    "migawka": {
      "oCoChodzi": "PV panels form the spans of the fence. This screen selects how many posts, which tubes and how deep a foundation the fence needs to withstand wind — with the panels hanging at least 25 cm above the ground.",
      "jakDziala": "The post spacing is the panel length plus gaps and the post width. The number of rows follows from the allowed height (or you enter it). From Eurocode 1 (wind on a free-standing signboard, or on a wall when the panels hang low) the application calculates the force on a post, then finds the lightest tube in the catalogue that carries the base moment, and the rail (2 per row) for the span between posts. The foundation is a bored concrete pier in non-cohesive soil: the depth is calculated by two methods (conservative and Broms) from the four Eurocode 7 design approaches, and the larger of them or the frost depth governs. You choose the soil from the PN-B-03020 table — the application reads the friction angle and density.",
      "poCo": "A fence of panels is a sail. Posts that are too thin or a foundation that is too shallow mean a toppled fence and broken panels. Under the panels a geotextile with a sand and gravel bedding is laid, so that rain does not splash mud onto their lower edge.",
      "fizyka": "q_p = c_e(z_e)·q_b; F = c_f·q_p·s·h; M_Ed = γQ·F·z_c ≤ W_el·f_y/γM0; H_u = c·γ·D·Kp·L³/(e + L) ≥ γQ·F. Steel and the Broms formula have no source in the repository — the result is always an estimate."
    },
    "pola": {
      "dlugoscPanela": {
        "nazwa": "Panel length [mm]",
        "cel": "Sets the post spacing — each panel rests on two posts.",
        "gdzie": "Panel datasheet (longer side). Orient the panels so that the length runs along the fence.",
        "zakres": "From the panel datasheet."
      },
      "wysokoscPanela": {
        "nazwa": "Panel height [mm]",
        "cel": "The height of one row of panels; with the number of rows it gives the fence height and the area catching the wind.",
        "gdzie": "Panel datasheet (shorter side).",
        "zakres": "From the panel datasheet."
      },
      "grubosc": {
        "nazwa": "Panel thickness [mm]",
        "cel": "For the flush-face check: whether post, rail and panel make one plane on the road side. Empty = flush face is not checked.",
        "gdzie": "Panel datasheet (frame).",
        "zakres": "From the panel datasheet."
      },
      "szczelinaPozioma": {
        "nazwa": "Gap between panel and post [mm]",
        "cel": "Installation clearance between the panel edge and the post; increases the post spacing.",
        "gdzie": "Depends on the fixing method (clamps, angles).",
        "zakres": "Empty = 0 mm (assumption shown in the result)."
      },
      "szczelinaPionowa": {
        "nazwa": "Gap between rows [mm]",
        "cel": "Clearance between successive panel rows; increases the fence height.",
        "gdzie": "Depends on the fixing method.",
        "zakres": "Empty = 0 mm (assumption shown in the result)."
      },
      "przeswit": {
        "nazwa": "Clearance from the ground [mm]",
        "cel": "Distance from the lower panel edge to the ground. Panels close to the ground get dirty from below with dust and rain splash.",
        "gdzie": "Your design decision; the project rule is at least 250 mm (25–30 cm). Remember the fence height limit without a permit.",
        "zakres": "At least 250 mm — below that the application reports a problem."
      },
      "liczbaRzedow": {
        "nazwa": "Number of panel rows",
        "cel": "How many rows of panels the fence has. Empty = the application takes as many as fit under the height limit.",
        "gdzie": "Your decision; must be a whole number.",
        "zakres": "Whole number, at least 1."
      },
      "maxWysokosc": {
        "nazwa": "Allowed fence height [mm]",
        "cel": "Upper limit of the height (clearance + panels). The application does not exceed it when choosing rows automatically and warns when you enter the rows manually.",
        "gdzie": "Building regulations and the local zoning plan of your municipality — the application does not have this value because it depends on the location.",
        "zakres": "Empty = no limit."
      },
      "dlugoscOgrodzenia": {
        "nazwa": "Fence length [m]",
        "cel": "Only to count how many posts and panels are needed. It does not affect the section selection.",
        "gdzie": "Measurement on the plot.",
        "zakres": "Empty = no quantities."
      },
      "grupaGruntu": {
        "nazwa": "Non-cohesive soil group",
        "cel": "Selects the curve from the PN-B-03020 chart (friction angle Φu) and the row of Table 1 (bulk density).",
        "gdzie": "From the geotechnical documentation or a soil test: gravel and gravelly sand, coarse and medium sand, fine and silty sand. Cohesive soils are not supported.",
        "zakres": "One of three groups."
      },
      "stopienZageszczeniaId": {
        "nazwa": "Density index I_D",
        "cel": "The denser the soil, the larger the friction angle and density, so the shallower the foundation.",
        "gdzie": "From the geotechnical documentation (sounding). If you do not have it, take a lower value cautiously — loose soil needs a deeper foundation.",
        "zakres": "0.20–1.00 (range of the PN-B-03020 chart; the application does not extrapolate beyond it)."
      },
      "wilgotnosc": {
        "nazwa": "Soil moisture",
        "cel": "Selects the bulk-density column of Table 1 of PN-B-03020. Wet soil is heavier.",
        "gdzie": "On-site assessment or the geotechnical documentation.",
        "zakres": "Slightly moist, moist or wet."
      },
      "gruntPodWoda": {
        "nazwa": "Soil below the water table",
        "cel": "Under water the soil is “lighter” by buoyancy (the water density is subtracted), so the soil resistance drops and the foundation has to be deeper.",
        "gdzie": "Geotechnical documentation or observing the local water level in the wettest season.",
        "zakres": "Yes or no."
      },
      "przemarzanie": {
        "nazwa": "Frost depth [m]",
        "cel": "Lower bound of the foundation depth — the base must reach below the frost zone so that frost does not heave it.",
        "gdzie": "Frost zone for your town from a local map or from the authority/geotechnical engineer. The application does not have this table in its sources, so you enter the value yourself.",
        "zakres": "Greater than 0 [m]."
      },
      "metodaOporu": {
        "nazwa": "Soil resistance method",
        "cel": "Selects which of the two methods of horizontal soil resistance sets the foundation depth. Conservative gives deeper, Broms shallower; you see both results.",
        "gdzie": "Conservative: Rankine passive pressure. Broms: a formula from the literature, not confirmed in the application's sources.",
        "zakres": "Conservative or Broms."
      },
      "stal": {
        "nazwa": "Steel grade of the tubes",
        "cel": "The yield strength sets the tube resistance and therefore the profile size. S355 allows thinner profiles than S235.",
        "gdzie": "Tube order (mill certificate). The yield strengths of 235 and 355 MPa are values from memory — to be confirmed per EN 1993-1-1.",
        "zakres": "S235 or S355."
      },
      "ugiecie": {
        "nazwa": "Allowed rail deflection [mm]",
        "cel": "When entered, the application rejects rails that deflect more. Empty = deflection only shown.",
        "gdzie": "Panel manufacturer's requirement (installation manual) or your decision. The standard gives no single value here.",
        "zakres": "Greater than 0 [mm]."
      }
    }
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "ogrodzenie-pv": {
    "migawka": {
      "oCoChodzi": "PV-панели образуют пролёты ограждения. Этот экран подбирает число стоек, трубы и глубину фундамента, чтобы ограждение выдержало ветер, а панели висели не ниже 25 см от земли.",
      "jakDziala": "Шаг стоек — это длина панели плюс зазоры и ширина стойки. Число рядов вытекает из допустимой высоты (или вы вводите его сами). По Еврокоду 1 (ветер на отдельно стоящий щит либо на стену, если панели висят низко) приложение считает силу на стойку, затем ищет самую лёгкую трубу из каталога, воспринимающую момент в основании, и ригель (2 на ряд) для пролёта между стойками. Фундамент — буровая бетонная опора в несвязном грунте: глубина считается двумя методами (консервативным и Бромса) из четырёх расчётных подходов Еврокода 7, а определяет её больший результат либо глубина промерзания. Грунт вы выбираете по таблице PN-B-03020 — угол трения и плотность приложение считывает само.",
      "poCo": "Ограждение из панелей — это парус. Слишком тонкие стойки или мелкий фундамент означают упавшее ограждение и разбитые панели. Под панелями кладут геотекстиль и песчано-гравийную подсыпку, чтобы дождь не разбрызгивал грязь на их нижний край.",
      "fizyka": "q_p = c_e(z_e)·q_b; F = c_f·q_p·s·h; M_Ed = γQ·F·z_c ≤ W_el·f_y/γM0; H_u = c·γ·D·Kp·L³/(e + L) ≥ γQ·F. Сталь и формула Бромса не имеют источника в репозитории — результат всегда является оценкой."
    },
    "pola": {
      "dlugoscPanela": {
        "nazwa": "Длина панели [мм]",
        "cel": "Определяет шаг стоек — каждая панель опирается на две стойки.",
        "gdzie": "Паспорт панели (длинная сторона). Расположите панели так, чтобы длина шла вдоль ограждения.",
        "zakres": "Из паспорта панели."
      },
      "wysokoscPanela": {
        "nazwa": "Высота панели [мм]",
        "cel": "Высота одного ряда панелей; вместе с числом рядов даёт высоту ограждения и площадь, воспринимающую ветер.",
        "gdzie": "Паспорт панели (короткая сторона).",
        "zakres": "Из паспорта панели."
      },
      "grubosc": {
        "nazwa": "Толщина панели [мм]",
        "cel": "Для проверки совпадения плоскостей: образуют ли стойка, ригель и панель одну плоскость со стороны дороги. Пусто = проверка не выполняется.",
        "gdzie": "Паспорт панели (рама).",
        "zakres": "Из паспорта панели."
      },
      "szczelinaPozioma": {
        "nazwa": "Зазор панель–стойка [мм]",
        "cel": "Монтажный зазор между краем панели и стойкой; увеличивает шаг стоек.",
        "gdzie": "Зависит от способа крепления (зажимы, уголки).",
        "zakres": "Пусто = 0 мм (допущение показано в результате)."
      },
      "szczelinaPionowa": {
        "nazwa": "Зазор между рядами [мм]",
        "cel": "Зазор между рядами панелей; увеличивает высоту ограждения.",
        "gdzie": "Зависит от способа крепления.",
        "zakres": "Пусто = 0 мм (допущение показано в результате)."
      },
      "przeswit": {
        "nazwa": "Просвет от земли [мм]",
        "cel": "Расстояние от нижнего края панелей до земли. Панели у самой земли загрязняются снизу пылью и брызгами дождя.",
        "gdzie": "Ваше проектное решение; правило проекта — не менее 250 мм (25–30 см). Помните о пределе высоты ограждения без разрешения.",
        "zakres": "Не менее 250 мм — ниже приложение сообщает о проблеме."
      },
      "liczbaRzedow": {
        "nazwa": "Число рядов панелей",
        "cel": "Сколько рядов панелей в ограждении. Пусто = приложение берёт столько, сколько поместится под пределом высоты.",
        "gdzie": "Ваше решение; должно быть целым числом.",
        "zakres": "Целое число, не менее 1."
      },
      "maxWysokosc": {
        "nazwa": "Допустимая высота ограждения [мм]",
        "cel": "Верхний предел высоты (просвет + панели). Приложение не превышает его при автоматическом выборе рядов и предупреждает при ручном вводе.",
        "gdzie": "Строительные нормы и местный план застройки вашей коммуны — у приложения этого значения нет, оно зависит от места.",
        "zakres": "Пусто = без предела."
      },
      "dlugoscOgrodzenia": {
        "nazwa": "Длина ограждения [м]",
        "cel": "Только для подсчёта числа стоек и панелей. На подбор сечений не влияет.",
        "gdzie": "Замер на участке.",
        "zakres": "Пусто = без подсчёта количества."
      },
      "grupaGruntu": {
        "nazwa": "Группа несвязного грунта",
        "cel": "Выбирает кривую графика PN-B-03020 (угол трения Φu) и строку таблицы 1 (объёмная плотность).",
        "gdzie": "Из геотехнической документации или испытания грунта: гравий и гравелистый песок, песок крупный и средний, песок мелкий и пылеватый. Связные грунты не поддерживаются.",
        "zakres": "Одна из трёх групп."
      },
      "stopienZageszczeniaId": {
        "nazwa": "Степень плотности I_D",
        "cel": "Чем плотнее грунт, тем больше угол трения и плотность, а значит, мельче фундамент.",
        "gdzie": "Из геотехнической документации (зондирование). Если её нет, осторожно возьмите меньшее значение — рыхлый грунт требует более глубокого фундамента.",
        "zakres": "0,20–1,00 (диапазон графика PN-B-03020; за его пределами приложение не экстраполирует)."
      },
      "wilgotnosc": {
        "nazwa": "Влажность грунта",
        "cel": "Выбирает столбец объёмной плотности из таблицы 1 PN-B-03020. Мокрый грунт тяжелее.",
        "gdzie": "Оценка на месте или геотехническая документация.",
        "zakres": "Слабовлажный, влажный или мокрый."
      },
      "gruntPodWoda": {
        "nazwa": "Грунт ниже уровня воды",
        "cel": "Под водой грунт «легче» на величину взвешивания (вычитается плотность воды), поэтому сопротивление грунта падает и фундамент должен быть глубже.",
        "gdzie": "Геотехническая документация или наблюдение за уровнем воды в наиболее дождливый сезон.",
        "zakres": "Да или нет."
      },
      "przemarzanie": {
        "nazwa": "Глубина промерзания [м]",
        "cel": "Нижняя граница глубины фундамента — основание должно быть ниже зоны промерзания, чтобы мороз не выпучивал его.",
        "gdzie": "Зона промерзания для вашего населённого пункта по местной карте либо от ведомства/геотехника. В источниках приложения этой таблицы нет, поэтому значение вводите сами.",
        "zakres": "Больше 0 [м]."
      },
      "metodaOporu": {
        "nazwa": "Метод сопротивления грунта",
        "cel": "Выбирает, какой из двух методов горизонтального сопротивления грунта определяет глубину фундамента. Консервативный даёт глубже, Бромс — мельче; вы видите оба результата.",
        "gdzie": "Консервативный: пассивное давление по Ренкину. Бромс: формула из литературы, не подтверждённая в источниках приложения.",
        "zakres": "Консервативный или Бромс."
      },
      "stal": {
        "nazwa": "Марка стали труб",
        "cel": "От предела текучести зависит несущая способность трубы, а значит, размер профиля. S355 допускает более тонкие профили, чем S235.",
        "gdzie": "Заказ труб (сертификат). Пределы текучести 235 и 355 МПа — значения по памяти, требуют подтверждения по PN-EN 1993-1-1.",
        "zakres": "S235 или S355."
      },
      "ugiecie": {
        "nazwa": "Допустимый прогиб ригеля [мм]",
        "cel": "Если введён, приложение отбрасывает ригели с большим прогибом. Пусто = прогиб только показывается.",
        "gdzie": "Требование производителя панелей (инструкция по монтажу) или ваше решение. Норма не даёт здесь единого значения.",
        "zakres": "Больше 0 [мм]."
      }
    }
  },
}
