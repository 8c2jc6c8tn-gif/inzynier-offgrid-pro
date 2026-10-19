/**
 * Help content — Module 3, wind on panels tilted above 30° (estimate outside the standard). The wind zone, height above sea
 * level and terrain category reuse the help of `typ-montazu-pola`; this file covers the tilt and the structure height.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "Norma opisuje wiatr na panele na konstrukcji tylko do {maxKat}° nachylenia. Gdy ustawiasz panele stromiej, na przykład pod niskie zimowe słońce albo pionowo, żadna norma nie podaje współczynników — ten ekran daje szacunek, nie wynik normowy.",
      "jakDziala": "Podajesz nachylenie (powyżej {maxKat}° do 90°) i dane miejsca: strefę wiatrową, wysokość n.p.m., kategorię terenu i wysokość konstrukcji. Aplikacja liczy ciśnienie wiatru z Eurokodu (q_b i c_e), a współczynniki ciśnienia netto bierze z Tablicy 7.6 dla {maxKat}° i zachowuje je dla większych kątów. Wynik jest zawsze oznaczony jako szacunek. Jeśli wpiszesz też powierzchnię paneli i współczynnik φ (oraz masę własną), policzę siłę wiatru na stelaż i balast przeciw oderwaniu — tym samym wzorem co do {maxKat}°. Współczynnik siły dla każdego kąta powyżej {maxKat}° wyliczam interpolacją liniową między wartością z Tablicy 7.6 dla {maxKat}° a współczynnikiem 1,80 dla pionu (p. 7.4.3), więc balast rośnie z kątem.",
      "poCo": "Strome panele zimą łapią więcej słońca, ale bardziej „żaglują”. Bez liczby orientacyjnej łatwo zaniżyć kotwienie albo balast; oznaczenie szacunku przypomina, że ostateczną wartość trzeba potwierdzić z konstruktorem.",
      "fizyka": "p = q_p · c_p,net, gdzie q_p = c_e(z) · q_b. Współczynniki c_p,net z Tablicy 7.6 dla {maxKat}° — poza zakresem normy dla większych kątów (decyzja właściciela aplikacji)."
    },
    "pola": {
      "nachylenie": {
        "nazwa": "Nachylenie paneli [°]",
        "cel": "Od kąta zależy, czy liczy norma (do {maxKat}°), czy to szacunek aplikacji.",
        "gdzie": "Kąt paneli względem poziomu na konstrukcji; pion to 90°.",
        "zakres": "Powyżej {maxKat}° do 90°."
      },
      "wysokoscKonstrukcji": {
        "nazwa": "Wysokość konstrukcji nad terenem [m]",
        "cel": "Wyżej wiatr jest silniejszy (współczynnik ekspozycji c_e).",
        "gdzie": "Wysokość środka paneli nad gruntem lub dachem.",
        "zakres": "{min}–{max} m."
      },
      "metodaCf": {
        "nazwa": "Metoda szacunku współczynnika siły powyżej {maxKat}°",
        "cel": "Norma podaje współczynnik siły tylko do {maxKat}°, a dla pionu 1,80. Dla kątów pośrednich wybierasz sposób oszacowania — od niego zależy balast.",
        "gdzie": "Liniowa (domyślna): prosta od wartości z Tablicy 7.6 przy {maxKat}° do 1,80 przy 90°. Trend (ostrożniejsza): przyrost na stopień z ostatniego kroku Tablicy 7.6 kontynuowany do limitu 1,80, nie mniej niż liniowa. Tabela pod polem pokazuje współczynnik dla każdego kąta obu metod. Limit 1,80 to założenie aplikacji, nie wynik normy.",
        "zakres": "Liniowa albo trend. Puste = liniowa."
      },
      "tarcie": {
        "nazwa": "Współczynnik tarcia o podłoże μ",
        "cel": "Od niego zależy, ile balastu potrzeba, by stelaż nie przesunął się pod parciem wiatru. Norma go nie podaje — to Twoja wartość dla konkretnego podłoża.",
        "gdzie": "Dla pary: spód stelaża/bloczka i podłoże (beton, kostka, grunt, membrana dachowa). Skąd wziąć: (1) z kąta tarcia gruntu — μ = tan δ, gdzie δ = 2/3·φ′cv dla gładkich prefabrykatów albo φ′cv dla betonu formowanego na gruncie (PN-EN 1997-1, p. 6.5.3 (10); kalkulator poniżej); (2) z karty producenta bloczków, podkładek lub mat antypoślizgowych; (3) z próby na miejscu — przeciągnij dynamometrem bloczek o znanym ciężarze, μ = siła w chwili ruszenia ÷ ciężar bloczka; (4) od konstruktora. Aplikacja nie podaje wartości domyślnej, bo zależy od materiałów, wilgoci i zabrudzenia — wpisz wartość dla najgorszych warunków. Wpisana wartość to μ charakterystyczne (tan δk); współczynniki częściowe z Załącznika A stosujemy sami.",
        "zakres": "Większe od 0. Puste = przesuw i przewracanie nie są liczone."
      },
      "wysokoscParcia": {
        "nazwa": "Wysokość punktu przyłożenia siły wiatru [m]",
        "cel": "Im wyżej działa siła, tym większy moment wywracający i więcej balastu przeciw przewróceniu.",
        "gdzie": "Wysokość środka paneli nad terenem lub dachem (dla paneli pochylonych: środek ich powierzchni).",
        "zakres": "Większe od 0. Puste = przesuw i przewracanie nie są liczone."
      },
      "szerokoscPodstawy": {
        "nazwa": "Szerokość podstawy stelaża [m]",
        "cel": "Stelaż przewraca się wokół krawędzi zawietrznej; im szersza podstawa, tym mniej balastu trzeba.",
        "gdzie": "Odległość między skrajnymi punktami oparcia stelaża na podłożu, w kierunku wiatru.",
        "zakres": "Większe od 0. Puste = przesuw i przewracanie nie są liczone."
      },
      "glebokoscPodstawy": {
        "nazwa": "Głębokość podstawy stelaża [m]",
        "cel": "Stelaż przewraca się wokół krawędzi zawietrznej; im głębsza podstawa, tym mniej balastu trzeba.",
        "gdzie": "Odległość między skrajnymi punktami oparcia stelaża na podłożu, w kierunku wiatru. Puste = L·cos α (rzut pochylonych paneli na poziom).",
        "zakres": "Większe od 0. Przy 90° konieczna — rzut pionowych paneli to 0."
      },
      "katTarciaGruntu": {
        "nazwa": "Kąt tarcia gruntu φ′cv [°]",
        "cel": "Z niego wynika współczynnik tarcia podstawy o grunt, a z niego balast przeciw przesuwowi.",
        "gdzie": "Z dokumentacji geotechnicznej (efektywny kąt tarcia wewnętrznego w stanie krytycznym). Norma nie podaje go dla konkretnego gruntu, a aplikacja niczego nie podpowiada.",
        "zakres": "Powyżej 0° i poniżej 90°."
      },
      "rodzajPodstawy": {
        "nazwa": "Rodzaj podstawy",
        "cel": "Decyduje, jaką część kąta tarcia gruntu przyjmujemy jako tarcie podstawy o grunt.",
        "gdzie": "Gładki prefabrykat (bloczki): 2/3 kąta; beton formowany na gruncie: cały kąt (PN-EN 1997-1, p. 6.5.3 (10)).",
        "zakres": "Dwie wartości do wyboru."
      },
      "probaMasa": {
        "nazwa": "Masa bloczka użytego do próby [kg]",
        "cel": "Z masy i siły ruszenia aplikacja liczy współczynnik tarcia.",
        "gdzie": "Zważ bloczek (waga łazienkowa, karta producenta). Użyj bloczka podobnego do tych, które będą balastem.",
        "zakres": "Większa od 0."
      },
      "probaJednostka": {
        "nazwa": "Jednostka dynamometru",
        "cel": "Dynamometry pokazują niutony albo „kilogramy” (kilogramy siły); to inna liczba dla tej samej siły.",
        "gdzie": "Sprawdź skalę na dynamometrze lub w jego instrukcji.",
        "zakres": "Do wyboru: N albo kgf."
      },
      "probaSily": {
        "nazwa": "Siła w chwili ruszenia [N lub kgf]",
        "cel": "Najniższy wynik z prób wyznacza współczynnik tarcia po stronie bezpiecznej.",
        "gdzie": "Ciągnij bloczek poziomo, równo narastającą siłą, i odczytaj wskazanie w chwili, gdy ruszy. Powtórz co najmniej trzy razy, także na mokrym podłożu.",
        "zakres": "Liczby dodatnie rozdzielone spacjami (przecinek to przecinek dziesiętny)."
      }
    }
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "The standard describes wind on panels on a support structure only up to a {maxKat}° tilt. When you set panels steeper, for example for the low winter sun or vertical, no standard gives coefficients — this screen gives an estimate, not a result of the standard.",
      "jakDziala": "You enter the tilt (above {maxKat}° up to 90°) and the site data: wind zone, height above sea level, terrain category and structure height. The app calculates the wind pressure from the Eurocode (q_b and c_e) and takes the net pressure coefficients from Table 7.6 at {maxKat}°, keeping them for larger angles. The result is always marked as an estimate. If you also enter the panel area and the factor φ (and the own mass), I calculate the wind force on the frame and the ballast against uplift — with the same formula as up to {maxKat}°. The force coefficient for each angle above {maxKat}° is computed by linear interpolation between the Table 7.6 value at {maxKat}° and the coefficient 1.80 for a vertical panel (clause 7.4.3), so the ballast grows with the angle.",
      "poCo": "Steep panels catch more sun in winter but act more like a sail. Without an indicative figure it is easy to under-size the anchoring or ballast; the estimate mark reminds you that the final value must be confirmed with a structural engineer.",
      "fizyka": "p = q_p · c_p,net, where q_p = c_e(z) · q_b. The c_p,net coefficients are from Table 7.6 at {maxKat}° — outside the range of the standard for larger angles (a decision of the app owner)."
    },
    "pola": {
      "nachylenie": {
        "nazwa": "Panel tilt [°]",
        "cel": "The angle decides whether the standard applies (up to {maxKat}°) or this is an estimate by the app.",
        "gdzie": "The angle of the panels to the horizontal on the structure; vertical is 90°.",
        "zakres": "Above {maxKat}° up to 90°."
      },
      "wysokoscKonstrukcji": {
        "nazwa": "Structure height above ground [m]",
        "cel": "Wind is stronger higher up (exposure factor c_e).",
        "gdzie": "Height of the panel centre above the ground or roof.",
        "zakres": "{min}–{max} m."
      },
      "metodaCf": {
        "nazwa": "Method for estimating the force coefficient above {maxKat}°",
        "cel": "The standard gives the force coefficient only up to {maxKat}°, and 1.80 for vertical. For intermediate angles you choose how to estimate it — the ballast depends on it.",
        "gdzie": "Linear (default): a straight line from the Table 7.6 value at {maxKat}° to 1.80 at 90°. Trend (more conservative): the per-degree increase of the last step of Table 7.6 continued up to the 1.80 limit, and not lower than linear. The table under the field shows the coefficient for every angle for both methods. The 1.80 limit is an app assumption, not a result of the standard.",
        "zakres": "Linear or trend. Empty = linear."
      },
      "tarcie": {
        "nazwa": "Friction coefficient with the ground μ",
        "cel": "It decides how much ballast is needed so the frame does not slide under the wind load. The standard does not give it — it is your value for the specific ground.",
        "gdzie": "For the pair: underside of the frame/block and the ground (concrete, paving, soil, roof membrane). Where to get it: (1) from the ground friction angle — μ = tan δ, where δ = 2/3·φ′cv for smooth precast elements or φ′cv for concrete cast on the ground (PN-EN 1997-1, clause 6.5.3 (10); the calculator below); (2) the datasheet of the blocks, pads or anti-slip mats; (3) an on-site test — drag a block of known weight with a force gauge, μ = force at the moment it starts to move ÷ weight of the block; (4) a structural engineer. The app gives no default because it depends on materials, moisture and dirt — enter the value for the worst conditions. The entered value is the characteristic μ (tan δk); the partial factors of Annex A are applied by the app.",
        "zakres": "Greater than 0. Empty = sliding and overturning are not calculated."
      },
      "wysokoscParcia": {
        "nazwa": "Height of the wind force application point [m]",
        "cel": "The higher the force acts, the larger the overturning moment and the more ballast against overturning.",
        "gdzie": "Height of the panel centre above the ground or roof (for tilted panels: the centre of their surface).",
        "zakres": "Greater than 0. Empty = sliding and overturning are not calculated."
      },
      "szerokoscPodstawy": {
        "nazwa": "Footprint width of the frame [m]",
        "cel": "The frame overturns about its leeward edge; the wider the footprint, the less ballast is needed.",
        "gdzie": "Distance between the outermost points where the frame rests on the ground, in the wind direction.",
        "zakres": "Greater than 0. Empty = sliding and overturning are not calculated."
      },
      "glebokoscPodstawy": {
        "nazwa": "Footprint depth of the frame [m]",
        "cel": "The frame overturns about its leeward edge; the deeper the footprint, the less ballast is needed.",
        "gdzie": "Distance between the outermost points where the frame rests on the ground, in the wind direction. Empty = L·cos α (horizontal projection of tilted panels).",
        "zakres": "Greater than 0. Required at 90° — the projection of vertical panels is 0."
      },
      "katTarciaGruntu": {
        "nazwa": "Ground friction angle φ′cv [°]",
        "cel": "It gives the friction coefficient of the base on the ground, and from it the ballast against sliding.",
        "gdzie": "From the geotechnical documentation (effective critical-state angle of internal friction). The standard does not give it for a specific ground and the app suggests nothing.",
        "zakres": "Above 0° and below 90°."
      },
      "rodzajPodstawy": {
        "nazwa": "Type of base",
        "cel": "It decides which part of the ground friction angle is taken as the friction of the base on the ground.",
        "gdzie": "Smooth precast (blocks): 2/3 of the angle; concrete cast on the ground: the whole angle (PN-EN 1997-1, clause 6.5.3 (10)).",
        "zakres": "Two values to choose from."
      },
      "probaMasa": {
        "nazwa": "Mass of the block used in the test [kg]",
        "cel": "The app computes the friction coefficient from the mass and the force at the start of movement.",
        "gdzie": "Weigh the block (bathroom scale, manufacturer's datasheet). Use a block similar to those that will serve as ballast.",
        "zakres": "Greater than 0."
      },
      "probaJednostka": {
        "nazwa": "Force gauge unit",
        "cel": "Force gauges show newtons or “kilograms” (kilograms-force); it is a different number for the same force.",
        "gdzie": "Check the scale on the gauge or in its manual.",
        "zakres": "Choose N or kgf."
      },
      "probaSily": {
        "nazwa": "Force at the moment of starting to move [N or kgf]",
        "cel": "The lowest test result sets the friction coefficient on the safe side.",
        "gdzie": "Pull the block horizontally with a steadily increasing force and read the gauge the moment it starts to move. Repeat at least three times, also on wet ground.",
        "zakres": "Positive numbers separated by spaces (a comma is a decimal comma)."
      }
    }
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "Норма описывает ветер на панели на опорной конструкции только до наклона {maxKat}°. Когда вы ставите панели круче, например под низкое зимнее солнце или вертикально, ни одна норма не даёт коэффициентов — этот экран показывает оценку, а не результат нормы.",
      "jakDziala": "Вы вводите наклон (свыше {maxKat}° до 90°) и данные места: ветровой район, высоту над уровнем моря, категорию местности и высоту конструкции. Приложение считает давление ветра по Еврокоду (q_b и c_e), а коэффициенты чистого давления берёт из таблицы 7.6 при {maxKat}° и сохраняет их для больших углов. Результат всегда помечен как оценка. Если вы введёте ещё площадь панелей и коэффициент φ (и собственную массу), я посчитаю силу ветра на каркас и балласт против отрыва — по той же формуле, что и до {maxKat}°. Коэффициент силы для каждого угла свыше {maxKat}° вычисляется линейной интерполяцией между значением из таблицы 7.6 при {maxKat}° и коэффициентом 1,80 для вертикали (п. 7.4.3), поэтому балласт растёт с углом.",
      "poCo": "Крутые панели зимой ловят больше солнца, но сильнее «парусят». Без ориентировочной цифры легко занизить крепление или балласт; пометка оценки напоминает, что окончательное значение нужно согласовать с конструктором.",
      "fizyka": "p = q_p · c_p,net, где q_p = c_e(z) · q_b. Коэффициенты c_p,net из таблицы 7.6 при {maxKat}° — за пределами нормы для больших углов (решение владельца приложения)."
    },
    "pola": {
      "nachylenie": {
        "nazwa": "Наклон панелей [°]",
        "cel": "От угла зависит, действует ли норма (до {maxKat}°) или это оценка приложения.",
        "gdzie": "Угол панелей к горизонту на конструкции; вертикаль — 90°.",
        "zakres": "Свыше {maxKat}° до 90°."
      },
      "wysokoscKonstrukcji": {
        "nazwa": "Высота конструкции над землёй [м]",
        "cel": "Выше ветер сильнее (коэффициент экспозиции c_e).",
        "gdzie": "Высота центра панелей над землёй или крышей.",
        "zakres": "{min}–{max} м."
      },
      "metodaCf": {
        "nazwa": "Метод оценки коэффициента силы выше {maxKat}°",
        "cel": "Норма даёт коэффициент силы только до {maxKat}°, а для вертикали — 1,80. Для промежуточных углов вы выбираете способ оценки — от него зависит балласт.",
        "gdzie": "Линейный (по умолчанию): прямая от значения таблицы 7.6 при {maxKat}° до 1,80 при 90°. Тренд (более консервативный): прирост на градус из последнего шага таблицы 7.6 продолжается до предела 1,80, но не ниже линейного. Таблица под полем показывает коэффициент для каждого угла обоими методами. Предел 1,80 — допущение приложения, а не результат нормы.",
        "zakres": "Линейный или тренд. Пусто = линейный."
      },
      "tarcie": {
        "nazwa": "Коэффициент трения о основание μ",
        "cel": "От него зависит, сколько балласта нужно, чтобы каркас не сдвинулся под давлением ветра. Норма его не даёт — это ваше значение для конкретного основания.",
        "gdzie": "Для пары: низ каркаса/блока и основание (бетон, плитка, грунт, кровельная мембрана). Где взять: (1) из угла трения грунта — μ = tan δ, где δ = 2/3·φ′cv для гладких сборных элементов или φ′cv для бетона, формуемого на грунте (PN-EN 1997-1, п. 6.5.3 (10); калькулятор ниже); (2) из паспорта блоков, подкладок или противоскользящих матов; (3) из пробы на месте — протащите динамометром блок известного веса, μ = сила в момент начала движения ÷ вес блока; (4) у конструктора. Приложение не даёт значения по умолчанию, так как оно зависит от материалов, влажности и загрязнения — введите значение для худших условий. Введённое значение — характеристическое μ (tan δk); частные коэффициенты Приложения A применяет приложение.",
        "zakres": "Больше 0. Пусто = сдвиг и опрокидывание не считаются."
      },
      "wysokoscParcia": {
        "nazwa": "Высота точки приложения силы ветра [м]",
        "cel": "Чем выше действует сила, тем больше опрокидывающий момент и тем больше нужен балласт.",
        "gdzie": "Высота центра панелей над землёй или кровлей (для наклонных панелей — центр их поверхности).",
        "zakres": "Больше 0. Пусто = сдвиг и опрокидывание не считаются."
      },
      "szerokoscPodstawy": {
        "nazwa": "Ширина основания каркаса [м]",
        "cel": "Каркас опрокидывается вокруг заветренной кромки; чем шире основание, тем меньше нужно балласта.",
        "gdzie": "Расстояние между крайними точками опоры каркаса на основание в направлении ветра.",
        "zakres": "Больше 0. Пусто = сдвиг и опрокидывание не считаются."
      },
      "glebokoscPodstawy": {
        "nazwa": "Глубина основания каркаса [м]",
        "cel": "Каркас опрокидывается вокруг заветренной кромки; чем глубже основание, тем меньше нужно балласта.",
        "gdzie": "Расстояние между крайними точками опоры каркаса на основание в направлении ветра. Пусто = L·cos α (горизонтальная проекция наклонных панелей).",
        "zakres": "Больше 0. При 90° обязательна — проекция вертикальных панелей равна 0."
      },
      "katTarciaGruntu": {
        "nazwa": "Угол трения грунта φ′cv [°]",
        "cel": "Из него получается коэффициент трения основания о грунт, а из него — балласт против сдвига.",
        "gdzie": "Из геотехнической документации (эффективный угол внутреннего трения в критическом состоянии). Норма не приводит его для конкретного грунта, а приложение ничего не подсказывает.",
        "zakres": "Больше 0° и меньше 90°."
      },
      "rodzajPodstawy": {
        "nazwa": "Тип основания",
        "cel": "Определяет, какую часть угла трения грунта принимать за трение основания о грунт.",
        "gdzie": "Гладкий сборный элемент (блоки): 2/3 угла; бетон, формуемый на грунте: весь угол (PN-EN 1997-1, п. 6.5.3 (10)).",
        "zakres": "Два значения на выбор."
      },
      "probaMasa": {
        "nazwa": "Масса блока, использованного в пробе [кг]",
        "cel": "По массе и силе начала движения приложение рассчитывает коэффициент трения.",
        "gdzie": "Взвесьте блок (напольные весы, паспорт производителя). Используйте блок, подобный тем, что будут балластом.",
        "zakres": "Больше 0."
      },
      "probaJednostka": {
        "nazwa": "Единица динамометра",
        "cel": "Динамометры показывают ньютоны или «килограммы» (килограммы-силы); для одной и той же силы это разные числа.",
        "gdzie": "Проверьте шкалу на динамометре или в его инструкции.",
        "zakres": "Выбор: Н или кгс."
      },
      "probaSily": {
        "nazwa": "Сила в момент начала движения [Н или кгс]",
        "cel": "Наименьший результат проб задаёт коэффициент трения в запас.",
        "gdzie": "Тяните блок горизонтально равномерно нарастающей силой и считайте показание в момент начала движения. Повторите не менее трёх раз, в том числе на мокром основании.",
        "zakres": "Положительные числа через пробел (запятая — десятичная)."
      }
    }
  },
}
