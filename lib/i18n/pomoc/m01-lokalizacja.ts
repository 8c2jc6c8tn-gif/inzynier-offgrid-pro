/**
 * Help content — Module 1 (location). Limits kept by the engines as constants enter through
 * `{params}`; the app never assumes a user value (Directive #1). Geometric limits (±90° latitude,
 * ±180° longitude, 0–360° azimuth, 0–90° tilt) are definitions, not engineering assumptions.
 */
import type { Tlumaczenie } from "./typy"

const TWOJ = "Twoja lokalizacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
const NACHYLENIE = {
  nazwa: "Nachylenie powierzchni [°]",
  cel: "Kąt między powierzchnią a poziomem — od niego zależy, pod jakim kątem padają promienie słońca.",
  gdzie: "Projekt dachu, pomiar kątomierzem/aplikacją z poziomicą albo planowana konstrukcja paneli.",
  zakres: "0° (poziomo) – 90° (pionowa ściana).",
}
const AZYMUT = {
  nazwa: "Azymut powierzchni [°]",
  cel: "Kierunek, w który „patrzy” powierzchnia — od niego zależy, o której porze dnia dostaje słońce.",
  gdzie: "Kompas albo mapa: kierunek prostopadły do powierzchni, liczony od północy zgodnie z ruchem wskazówek zegara.",
  zakres: "0–360°: N = 0, E = 90, S = 180, W = 270.",
}

export const pl = {
  "lokalizacja-i-klimat": {
    migawka: {
      oCoChodzi: "Gdzie stoi instalacja — współrzędne i najniższa temperatura w okolicy. To pierwszy krok, od którego zależą niemal wszystkie pozostałe moduły.",
      jakDziala: "Sprawdzam, czy współrzędne i temperatura mieszczą się w dopuszczalnych granicach, i zapisuję je jako lokalizację projektu. Z niej inne ekrany biorą kąt padania słońca, dane nasłonecznienia i minima temperaturowe do stress-testów zimowych.",
      poCo: "Wpisujesz lokalizację raz — nie musisz jej powtarzać w każdym kalkulatorze, a zimowe obliczenia opierają się na Twoim klimacie, nie na średniej.",
    },
    pola: {
      adres: { nazwa: "Adres albo oznaczenie działki", cel: "Tylko opis dla Ciebie — nie wpływa na obliczenia.", gdzie: "Dowolny opis, np. adres albo numer działki.", zakres: "Tekst, opcjonalny." },
      szerokosc: { nazwa: "Szerokość geograficzna [°]", cel: "Określa, jak wysoko słońce wznosi się nad horyzontem w ciągu roku.", gdzie: "Mapa online (kliknij prawym przyciskiem w miejsce działki), GPS telefonu albo Geoportal. Północ dodatnia.", zakres: "−90° – 90°. " + TWOJ },
      dlugosc: { nazwa: "Długość geograficzna [°]", cel: "Określa czas słoneczny w miejscu instalacji — kiedy słońce jest najwyżej.", gdzie: "To samo źródło co szerokość. Wschód dodatni.", zakres: "−180° – 180°. " + TWOJ },
      temperaturaMin: { nazwa: "Najniższa temperatura w lokalizacji [°C]", cel: "Zasila zimowe stress-testy: pojemność baterii w mrozie, napięcie paneli na zimno, ogrzewanie.", gdzie: "Najniższa temperatura z najbliższej stacji meteorologicznej (IMGW) albo projektowa temperatura zewnętrzna dla Twojej strefy klimatycznej.", zakres: "{tMin} – {tMax} °C. " + TWOJ },
    },
  },
  "skaner-dzialki": {
    migawka: {
      oCoChodzi: "Cyfrowy model Twojej działki: granice, obrys i dach budynku, drzewa i sąsiednie budynki. Na nim opiera się analiza zacienienia i ocena powierzchni pod panele.",
      jakDziala: "Zbierasz punkty — z Geoportalu (online) albo chodząc z telefonem po działce (GPS, offline). Przeliczam współrzędne geograficzne na płaski układ w metrach, liczę powierzchnie i obwody, a z narożników połaci z wysokościami — nachylenie i kierunek dachu. Opcjonalnie koryguję skalę znanym, zmierzonym taśmą wymiarem.",
      poCo: "Wiesz, jak naprawdę wygląda działka i dach — nie mapa sprzed kilku lat — i każdy kolejny ekran liczy na tym samym modelu.",
      fizyka: "x = Δλ·N·cos φ₀, y = Δφ·M (rzut lokalny na elipsoidzie WGS84); skala s = L_znana / L_GPS; nachylenie β = arccos n_z, azymut γ = atan2(n_x, n_y) z normalnej połaci n.",
    },
    pola: {
      zbior: { nazwa: "Do czego dodać następny punkt", cel: "Wybiera, czy kolejny punkt (z GPS albo z mapy) trafi do granicy działki, obrysu budynku, połaci dachu czy przeszkody.", gdzie: "Wybierz przed zapisaniem punktu.", zakres: "Lista zbiorów w modelu." },
      teryt: { nazwa: "Identyfikator działki (TERYT)", cel: "Pozwala pobrać granicę działki z usługi ULDK (GUGiK) bez klikania w mapę.", gdzie: "Wypis z rejestru gruntów, akt notarialny albo Geoportal — pełny identyfikator z obrębem i numerem.", zakres: "Format np. 146510_8.0309.23/3." },
      nazwaPolaci: { nazwa: "Nazwa połaci dachu", cel: "Tylko opis połaci — nie wpływa na wynik.", gdzie: "Dowolna, np. „Południowa”.", zakres: "Tekst." },
      nazwaPrzeszkody: { nazwa: "Nazwa przeszkody", cel: "Tylko opis przeszkody — nie wpływa na wynik. Na Ekranie 3 po tej nazwie podajesz prognozę wzrostu drzewa.", gdzie: "Dowolna, np. „Dąb przy płocie”.", zakres: "Tekst." },
      wysokoscPrzeszkody: { nazwa: "Wysokość przeszkody [m]", cel: "Od niej zależy, jak długi cień rzuca przeszkoda.", gdzie: "Pomiar dalmierzem, aplikacją do pomiaru wysokości albo metodą cienia (porównanie z przedmiotem o znanej wysokości).", zakres: "> 0. " + TWOJ },
      promien: { nazwa: "Promień korony drzewa [m]", cel: "Drzewo liczone jest jako walec — promień określa, jak szeroki cień rzuca.", gdzie: "Połowa szerokości korony zmierzonej krokami albo taśmą.", zakres: "> 0. " + TWOJ },
      zbiorKalibracji: { nazwa: "Zbiór punktów do kalibracji", cel: "Wskazuje, w którym zbiorze leżą punkty A i B znanego odcinka.", gdzie: "Budynek albo działka — tam, gdzie zmierzyłeś odcinek taśmą.", zakres: "Budynek / Działka." },
      punktA: { nazwa: "Numer punktu A", cel: "Początek odcinka o znanej długości.", gdzie: "Numer punktu z listy punktów wybranego zbioru.", zakres: "Numer istniejącego punktu." },
      punktB: { nazwa: "Numer punktu B", cel: "Koniec odcinka o znanej długości.", gdzie: "Numer punktu z listy punktów wybranego zbioru.", zakres: "Numer istniejącego punktu, inny niż A." },
      dlugoscAB: { nazwa: "Zmierzona długość odcinka A–B [m]", cel: "Skaluje cały model tak, żeby odcinek A–B miał dokładnie tę długość — koryguje błąd GPS urządzenia.", gdzie: "Pomiar taśmą albo dalmierzem, np. długość ściany budynku.", zakres: "> 0. Puste = bez kalibracji." },
    },
  },
  "analiza-zacienienia": {
    migawka: {
      oCoChodzi: "Cień to niewidoczny złodziej energii — jedno drzewo, które dziś ledwo sięga dachu, za kilka lat może zasłaniać sporą część instalacji.",
      jakDziala: "Dla każdego kroku czasowego roku liczę położenie słońca i sprawdzam, czy któraś przeszkoda z modelu działki je zasłania. Sumuję utraconą energię i dzielę przez energię bez cienia. Drzewo liściaste w miesiącach bez liści przepuszcza {tau}% promieniowania bezpośredniego. Z danymi PVGIS liczę stratę całkowitej energii, bez nich — tylko promieniowania bezpośredniego przy bezchmurnym niebie.",
      poCo: "Wiesz, ile procent energii rocznie i w którym miesiącu zabiera cień — i czy za kilka lat, gdy drzewa urosną, instalacja nadal się opłaci.",
      fizyka: "S = Σ(1 − Π τ_p)(G_T − G_T^cień) / Σ G_T; wysokość kątowa przeszkody h_p = arctan((H − z)/d), gdzie H — wysokość przeszkody, z — wysokość punktu na dachu, d — odległość.",
    },
    pola: {
      wysokoscDachu: { nazwa: "Wysokość dachu nad gruntem [m]", cel: "Dach płaski z obrysu budynku liczony jest na tej wysokości — im wyżej, tym mniej przeszkód go zasłania.", gdzie: "Projekt budynku albo pomiar dalmierzem.", zakres: "> 0. " + TWOJ },
      nachylenie: { ...NACHYLENIE, nazwa: "Nachylenie paneli [°]", gdzie: "Planowana konstrukcja montażowa paneli." },
      azymut: { ...AZYMUT, nazwa: "Azymut paneli [°]", gdzie: "Planowany kierunek paneli — liczony od północy zgodnie z ruchem wskazówek zegara." },
      horyzont: { nazwa: "Horyzont prognozy [lata]", cel: "Za ile lat chcesz sprawdzić zacienienie od drzew, które jeszcze urosną.", gdzie: "Zwykle okres, przez który planujesz używać instalacji.", zakres: "Liczba lat ≥ 0." },
      wysokoscPrognoza: { nazwa: "Prognozowana wysokość drzewa [m]", cel: "Wysokość, jaką drzewo osiągnie po podanej liczbie lat — analiza liczy cień od drzewa w tej wysokości.", gdzie: "Tempo wzrostu gatunku (szkółka, leśnik, literatura dendrologiczna) albo porównanie z dojrzałymi drzewami tego gatunku w okolicy.", zakres: "Nie mniej niż dzisiejsza wysokość. " + TWOJ },
      lisciaste: { nazwa: "Drzewo liściaste", cel: "Zimą, bez liści, korona przepuszcza {tau}% promieniowania bezpośredniego — zaznacz, jeśli drzewo gubi liście.", gdzie: "Gatunek drzewa.", zakres: "Tak / nie." },
      miesiaceBezlisci: { nazwa: "Miesiące bez liści", cel: "W zaznaczonych miesiącach korona drzew liściastych przepuszcza {tau}% promieniowania bezpośredniego.", gdzie: "Obserwacja drzew w Twojej okolicy — okres zależy od gatunku i klimatu.", zakres: "Dowolne miesiące. " + TWOJ },
    },
  },
  "orientacja-powierzchni": {
    migawka: {
      oCoChodzi: "Nie każda ściana i połać dachu są tak samo warte montażu paneli — ten ekran pokazuje od razu, gdzie inwestycja opłaci się najbardziej.",
      jakDziala: "Dla każdej powierzchni sumuję roczne promieniowanie padające na nią godzina po godzinie z typowego roku meteorologicznego: bezpośrednie, rozproszone (model Muneera) i odbite od gruntu. Wynik porównuję z optymalnym ustawieniem w Twojej lokalizacji — ranking w procentach optimum.",
      poCo: "Wiesz, które powierzchnie dają najwięcej energii i ile tracisz na każdej gorzej ustawionej — zanim przejdziesz do projektowania w Module 3.",
      fizyka: "H = Σ[G_b,n·max(cos θ, 0) + G_dT (Muneer) + G_h·ρ·(1 − cos β)/2]·Δt; W = H / H_opt.",
    },
    pola: {
      nachylenie: { ...NACHYLENIE, gdzie: "Wartość ze Skanera działki (podpowiedź w polu) — wpisz korektę tylko, gdy znasz dokładniejszą. Puste = wartość ze Skanera." },
      azymut: { ...AZYMUT, gdzie: "Wartość ze Skanera działki (podpowiedź w polu) — wpisz korektę tylko, gdy znasz dokładniejszą. Puste = wartość ze Skanera." },
      nazwa: { nazwa: "Nazwa powierzchni", cel: "Tylko opis w rankingu — nie wpływa na wynik.", gdzie: "Dowolna, np. „Ściana zachodnia garażu”.", zakres: "Tekst." },
      nachylenieReczne: NACHYLENIE,
      azymutReczny: AZYMUT,
      albedo: { nazwa: "Albedo gruntu [–]", cel: "Jaka część światła odbija się od gruntu przed powierzchnią — ma znaczenie głównie dla ścian i stromych połaci.", gdzie: "Rodzaj podłoża przed powierzchnią (trawa, beton, śnieg) — wartość z literatury dla tego podłoża.", zakres: "{aMin}–{aMax}. Puste = {albedo}, jak w założeniach." },
    },
  },
  "nasloneczenie-miesieczne": {
    migawka: {
      oCoChodzi: "Dane nasłonecznienia z PVGIS to typowy rok dla Twojej okolicy. Jeśli masz własne pomiary albo wiesz, że u Ciebie miesiąc zwykle wychodzi inaczej, możesz wpisać własną sumę.",
      jakDziala: "Wpisujesz sumę promieniowania całkowitego na płaszczyznę poziomą (kWh/m²) dla wybranych miesięcy. Aplikacja mnoży godzinowe dane PVGIS tego miesiąca przez jeden współczynnik (wpisana ÷ PVGIS), więc kształt doby i udział promieniowania rozproszonego zostają, a suma się zgadza. Pusty miesiąc zostaje bez zmian.",
      poCo: "Żeby kalkulatory liczyły na Twoich danych, gdy je masz — bez udawania, że to dane PVGIS.",
    },
    pola: {
      suma: {
        nazwa: "Suma promieniowania w miesiącu [kWh/m²]",
        cel: "Zastępuje sumę PVGIS dla tego miesiąca we wszystkich kalkulatorach nasłonecznienia w aplikacji.",
        gdzie: "Własne pomiary pyranometrem, miesięczne tabele z innego źródła (np. stacji pogodowej) albo wynik wcześniejszej analizy. Musi to być promieniowanie całkowite na płaszczyznę POZIOMĄ, nie na płaszczyznę paneli.",
        zakres: "Dodatnia liczba; puste = dane PVGIS. Aplikacja nie ocenia, czy wpisana wartość jest realistyczna — porównaj ją z wartością PVGIS pokazaną pod polem.",
      },
    },
  },
}

const EN_YOURS = "Your location — the app never assumes a typical value for you."
const EN_NACHYLENIE = {
  nazwa: "Surface tilt [°]",
  cel: "The angle between the surface and horizontal — it sets the angle at which sunlight strikes.",
  gdzie: "Roof design, protractor/level app measurement or the planned panel mounting.",
  zakres: "0° (horizontal) – 90° (vertical wall).",
}
const EN_AZYMUT = {
  nazwa: "Surface azimuth [°]",
  cel: "The direction the surface “faces” — it sets the time of day it gets sun.",
  gdzie: "Compass or map: the direction perpendicular to the surface, measured clockwise from north.",
  zakres: "0–360°: N = 0, E = 90, S = 180, W = 270.",
}

export const en: Tlumaczenie<typeof pl> = {
  "lokalizacja-i-klimat": {
    migawka: {
      oCoChodzi: "Where the installation stands — coordinates and the lowest temperature in the area. This is the first step; almost every other module depends on it.",
      jakDziala: "I check that the coordinates and temperature are within the allowed limits and save them as the project location. Other screens take the sun angle, solar data and temperature minima for winter stress tests from it.",
      poCo: "You enter the location once — no need to repeat it in every calculator, and winter calculations rest on your climate, not an average.",
    },
    pola: {
      adres: { nazwa: "Address or plot designation", cel: "Just a note for you — does not affect the calculation.", gdzie: "Any description, e.g. an address or plot number.", zakres: "Text, optional." },
      szerokosc: { nazwa: "Latitude [°]", cel: "Sets how high the sun rises above the horizon through the year.", gdzie: "Online map (right-click the plot), phone GPS or a cadastral map service. North is positive.", zakres: "−90° – 90°. " + EN_YOURS },
      dlugosc: { nazwa: "Longitude [°]", cel: "Sets solar time at the site — when the sun is highest.", gdzie: "Same source as latitude. East is positive.", zakres: "−180° – 180°. " + EN_YOURS },
      temperaturaMin: { nazwa: "Lowest temperature at the site [°C]", cel: "Feeds the winter stress tests: battery capacity in frost, cold panel voltage, heating.", gdzie: "The lowest temperature from the nearest weather station or the design outdoor temperature for your climate zone.", zakres: "{tMin} – {tMax} °C. " + EN_YOURS },
    },
  },
  "skaner-dzialki": {
    migawka: {
      oCoChodzi: "A digital model of your plot: boundaries, building outline and roof, trees and neighbouring buildings. Shading analysis and panel surface assessment rest on it.",
      jakDziala: "You collect points — from the Geoportal (online) or by walking the plot with your phone (GPS, offline). I convert geographic coordinates to a flat metric grid, compute areas and perimeters, and from roof-plane corners with heights — the roof tilt and direction. Optionally I correct the scale with a known length measured with a tape.",
      poCo: "You know what the plot and roof really look like — not a map from years ago — and every following screen works on the same model.",
      fizyka: "x = Δλ·N·cos φ₀, y = Δφ·M (local projection on the WGS84 ellipsoid); scale s = L_known / L_GPS; tilt β = arccos n_z, azimuth γ = atan2(n_x, n_y) from the roof-plane normal n.",
    },
    pola: {
      zbior: { nazwa: "Add the next point to", cel: "Chooses whether the next point (GPS or map) goes to the plot boundary, building outline, roof plane or an obstacle.", gdzie: "Choose before saving the point.", zakres: "List of sets in the model." },
      teryt: { nazwa: "Plot identifier (TERYT)", cel: "Fetches the plot boundary from the ULDK service (GUGiK) without clicking the map.", gdzie: "Land register extract, notarial deed or the Geoportal — the full identifier with precinct and number.", zakres: "Format e.g. 146510_8.0309.23/3." },
      nazwaPolaci: { nazwa: "Roof plane name", cel: "Just a label for the roof plane — does not affect the result.", gdzie: "Any, e.g. “South”.", zakres: "Text." },
      nazwaPrzeszkody: { nazwa: "Obstacle name", cel: "Just a label — does not affect the result. On Screen 3 you give the tree growth forecast under this name.", gdzie: "Any, e.g. “Oak by the fence”.", zakres: "Text." },
      wysokoscPrzeszkody: { nazwa: "Obstacle height [m]", cel: "Sets how long a shadow the obstacle casts.", gdzie: "Rangefinder, a height-measuring app or the shadow method (compare with an object of known height).", zakres: "> 0. " + EN_YOURS },
      promien: { nazwa: "Tree crown radius [m]", cel: "A tree is modelled as a cylinder — the radius sets how wide its shadow is.", gdzie: "Half the crown width, paced out or measured with a tape.", zakres: "> 0. " + EN_YOURS },
      zbiorKalibracji: { nazwa: "Point set for calibration", cel: "Tells which set points A and B of the known segment belong to.", gdzie: "Building or plot — wherever you measured the segment with a tape.", zakres: "Building / Plot." },
      punktA: { nazwa: "Point A number", cel: "Start of the segment of known length.", gdzie: "Point number from the chosen set's point list.", zakres: "Number of an existing point." },
      punktB: { nazwa: "Point B number", cel: "End of the segment of known length.", gdzie: "Point number from the chosen set's point list.", zakres: "Number of an existing point, other than A." },
      dlugoscAB: { nazwa: "Measured length of segment A–B [m]", cel: "Scales the whole model so that A–B has exactly this length — corrects the device's GPS error.", gdzie: "Tape or rangefinder measurement, e.g. the length of a building wall.", zakres: "> 0. Empty = no calibration." },
    },
  },
  "analiza-zacienienia": {
    migawka: {
      oCoChodzi: "Shade is an invisible energy thief — a tree that barely reaches the roof today may cover a large part of the installation in a few years.",
      jakDziala: "For each time step of the year I compute the sun's position and check whether any obstacle from the plot model blocks it. I sum the lost energy and divide by the unshaded energy. A deciduous tree in leafless months passes {tau}% of direct radiation. With PVGIS data I compute the loss of total energy; without it — direct radiation under a clear sky only.",
      poCo: "You know what percentage of annual and monthly energy shade takes — and whether the installation still pays off in a few years when the trees grow.",
      fizyka: "S = Σ(1 − Π τ_p)(G_T − G_T^shade) / Σ G_T; obstacle elevation angle h_p = arctan((H − z)/d), where H — obstacle height, z — height of the roof point, d — distance.",
    },
    pola: {
      wysokoscDachu: { nazwa: "Roof height above ground [m]", cel: "A flat roof from the building outline is analysed at this height — the higher, the fewer obstacles shade it.", gdzie: "Building design or rangefinder measurement.", zakres: "> 0. " + EN_YOURS },
      nachylenie: { ...EN_NACHYLENIE, nazwa: "Panel tilt [°]", gdzie: "The planned panel mounting structure." },
      azymut: { ...EN_AZYMUT, nazwa: "Panel azimuth [°]", gdzie: "Planned panel direction — measured clockwise from north." },
      horyzont: { nazwa: "Forecast horizon [years]", cel: "How many years ahead to check shading from trees that will still grow.", gdzie: "Usually the period you plan to use the installation.", zakres: "Number of years ≥ 0." },
      wysokoscPrognoza: { nazwa: "Forecast tree height [m]", cel: "The height the tree will reach after the given number of years — the analysis casts shade from a tree of this height.", gdzie: "Growth rate of the species (nursery, forester, dendrology literature) or comparison with mature trees of the species nearby.", zakres: "Not less than today's height. " + EN_YOURS },
      lisciaste: { nazwa: "Deciduous tree", cel: "In winter, leafless, the crown passes {tau}% of direct radiation — tick if the tree sheds its leaves.", gdzie: "Tree species.", zakres: "Yes / no." },
      miesiaceBezlisci: { nazwa: "Leafless months", cel: "In the ticked months the crowns of deciduous trees pass {tau}% of direct radiation.", gdzie: "Observation of trees in your area — the period depends on species and climate.", zakres: "Any months. " + EN_YOURS },
    },
  },
  "orientacja-powierzchni": {
    migawka: {
      oCoChodzi: "Not every wall and roof plane is equally worth fitting with panels — this screen shows straight away where the investment pays off most.",
      jakDziala: "For each surface I sum the yearly radiation striking it hour by hour from a typical meteorological year: direct, diffuse (Muneer model) and ground-reflected. I compare the result with the optimal orientation at your location — a ranking in percent of the optimum.",
      poCo: "You know which surfaces give the most energy and how much you lose on each poorer one — before moving to design in Module 3.",
      fizyka: "H = Σ[G_b,n·max(cos θ, 0) + G_dT (Muneer) + G_h·ρ·(1 − cos β)/2]·Δt; W = H / H_opt.",
    },
    pola: {
      nachylenie: { ...EN_NACHYLENIE, gdzie: "Value from the Plot scanner (hint in the field) — enter a correction only if you know a more accurate one. Empty = Scanner value." },
      azymut: { ...EN_AZYMUT, gdzie: "Value from the Plot scanner (hint in the field) — enter a correction only if you know a more accurate one. Empty = Scanner value." },
      nazwa: { nazwa: "Surface name", cel: "Just a label in the ranking — does not affect the result.", gdzie: "Any, e.g. “Garage west wall”.", zakres: "Text." },
      nachylenieReczne: EN_NACHYLENIE,
      azymutReczny: EN_AZYMUT,
      albedo: { nazwa: "Ground albedo [–]", cel: "The share of light reflected from the ground in front of the surface — matters mainly for walls and steep roof planes.", gdzie: "Ground type in front of the surface (grass, concrete, snow) — a literature value for that ground.", zakres: "{aMin}–{aMax}. Empty = {albedo}, as in the assumptions." },
    },
  },
  "nasloneczenie-miesieczne": {
    migawka: {
      oCoChodzi: "The PVGIS radiation data is a typical year for your area. If you have your own measurements or know that a month usually turns out differently at your site, you can enter your own total.",
      jakDziala: "You enter the total global radiation on the horizontal plane (kWh/m²) for the chosen months. The app multiplies the hourly PVGIS data of that month by one factor (entered ÷ PVGIS), so the daily shape and the share of diffuse radiation stay and the total matches. An empty month stays unchanged.",
      poCo: "So the calculators use your data when you have it — without pretending it is PVGIS data.",
    },
    pola: {
      suma: {
        nazwa: "Radiation total in the month [kWh/m²]",
        cel: "Replaces the PVGIS total for this month in all radiation calculators in the app.",
        gdzie: "Your own pyranometer measurements, monthly tables from another source (e.g. a weather station) or the result of an earlier analysis. It must be the global radiation on the HORIZONTAL plane, not on the panel plane.",
        zakres: "A positive number; empty = PVGIS data. The app does not judge whether the entered value is realistic — compare it with the PVGIS value shown under the field.",
      },
    },
  },
}

const RU_YOURS = "Ваше местоположение — приложение не принимает типовое значение за вас."
const RU_NACHYLENIE = {
  nazwa: "Наклон поверхности [°]",
  cel: "Угол между поверхностью и горизонталью — от него зависит угол падения солнечных лучей.",
  gdzie: "Проект крыши, измерение угломером/приложением-уровнем или планируемая конструкция панелей.",
  zakres: "0° (горизонтально) – 90° (вертикальная стена).",
}
const RU_AZYMUT = {
  nazwa: "Азимут поверхности [°]",
  cel: "Направление, куда «смотрит» поверхность — от него зависит, в какое время дня на неё падает солнце.",
  gdzie: "Компас или карта: направление, перпендикулярное поверхности, отсчитанное от севера по часовой стрелке.",
  zakres: "0–360°: N = 0, E = 90, S = 180, W = 270.",
}

export const ru: Tlumaczenie<typeof pl> = {
  "lokalizacja-i-klimat": {
    migawka: {
      oCoChodzi: "Где стоит установка — координаты и самая низкая температура в округе. Это первый шаг, от которого зависят почти все остальные модули.",
      jakDziala: "Проверяю, что координаты и температура в допустимых пределах, и сохраняю их как местоположение проекта. Из него другие экраны берут угол падения солнца, данные инсоляции и температурные минимумы для зимних стресс-тестов.",
      poCo: "Вы вводите местоположение один раз — не нужно повторять его в каждом калькуляторе, а зимние расчёты опираются на ваш климат, а не на среднее.",
    },
    pola: {
      adres: { nazwa: "Адрес или обозначение участка", cel: "Только описание для вас — не влияет на расчёт.", gdzie: "Любое описание, напр. адрес или номер участка.", zakres: "Текст, необязательно." },
      szerokosc: { nazwa: "Географическая широта [°]", cel: "Определяет, как высоко солнце поднимается над горизонтом в течение года.", gdzie: "Онлайн-карта (правый клик по участку), GPS телефона или кадастровый геопортал. Север положителен.", zakres: "−90° – 90°. " + RU_YOURS },
      dlugosc: { nazwa: "Географическая долгота [°]", cel: "Определяет солнечное время на месте установки — когда солнце выше всего.", gdzie: "Тот же источник, что и широта. Восток положителен.", zakres: "−180° – 180°. " + RU_YOURS },
      temperaturaMin: { nazwa: "Самая низкая температура на месте [°C]", cel: "Питает зимние стресс-тесты: ёмкость батареи в мороз, напряжение панелей на холоде, отопление.", gdzie: "Самая низкая температура ближайшей метеостанции или расчётная наружная температура для вашей климатической зоны.", zakres: "{tMin} – {tMax} °C. " + RU_YOURS },
    },
  },
  "skaner-dzialki": {
    migawka: {
      oCoChodzi: "Цифровая модель вашего участка: границы, контур и крыша здания, деревья и соседние здания. На ней основаны анализ затенения и оценка поверхностей под панели.",
      jakDziala: "Вы собираете точки — из геопортала (онлайн) или обходя участок с телефоном (GPS, офлайн). Пересчитываю географические координаты в плоскую метрическую систему, считаю площади и периметры, а по углам скатов с высотами — наклон и направление крыши. По желанию корректирую масштаб известным размером, измеренным рулеткой.",
      poCo: "Вы знаете, как на самом деле выглядят участок и крыша — а не карта многолетней давности, — и каждый следующий экран считает на одной модели.",
      fizyka: "x = Δλ·N·cos φ₀, y = Δφ·M (локальная проекция на эллипсоиде WGS84); масштаб s = L_известн / L_GPS; наклон β = arccos n_z, азимут γ = atan2(n_x, n_y) по нормали ската n.",
    },
    pola: {
      zbior: { nazwa: "Куда добавить следующую точку", cel: "Выбирает, пойдёт ли следующая точка (GPS или с карты) в границу участка, контур здания, скат крыши или препятствие.", gdzie: "Выберите перед сохранением точки.", zakres: "Список наборов в модели." },
      teryt: { nazwa: "Идентификатор участка (TERYT)", cel: "Позволяет загрузить границу участка из сервиса ULDK (GUGiK) без щелчка по карте.", gdzie: "Выписка из земельного реестра, нотариальный акт или геопортал — полный идентификатор с обрэмбом и номером.", zakres: "Формат напр. 146510_8.0309.23/3." },
      nazwaPolaci: { nazwa: "Название ската крыши", cel: "Только метка ската — не влияет на результат.", gdzie: "Любое, напр. «Южный».", zakres: "Текст." },
      nazwaPrzeszkody: { nazwa: "Название препятствия", cel: "Только метка — не влияет на результат. На экране 3 под этим названием вы задаёте прогноз роста дерева.", gdzie: "Любое, напр. «Дуб у забора».", zakres: "Текст." },
      wysokoscPrzeszkody: { nazwa: "Высота препятствия [м]", cel: "От неё зависит длина тени от препятствия.", gdzie: "Дальномер, приложение для измерения высоты или метод тени (сравнение с предметом известной высоты).", zakres: "> 0. " + RU_YOURS },
      promien: { nazwa: "Радиус кроны дерева [м]", cel: "Дерево моделируется цилиндром — радиус определяет ширину тени.", gdzie: "Половина ширины кроны, измеренной шагами или рулеткой.", zakres: "> 0. " + RU_YOURS },
      zbiorKalibracji: { nazwa: "Набор точек для калибровки", cel: "Указывает, в каком наборе лежат точки A и B известного отрезка.", gdzie: "Здание или участок — там, где вы измерили отрезок рулеткой.", zakres: "Здание / Участок." },
      punktA: { nazwa: "Номер точки A", cel: "Начало отрезка известной длины.", gdzie: "Номер точки из списка точек выбранного набора.", zakres: "Номер существующей точки." },
      punktB: { nazwa: "Номер точки B", cel: "Конец отрезка известной длины.", gdzie: "Номер точки из списка точек выбранного набора.", zakres: "Номер существующей точки, отличной от A." },
      dlugoscAB: { nazwa: "Измеренная длина отрезка A–B [м]", cel: "Масштабирует всю модель так, чтобы A–B имел ровно эту длину — корректирует ошибку GPS устройства.", gdzie: "Измерение рулеткой или дальномером, напр. длина стены здания.", zakres: "> 0. Пусто = без калибровки." },
    },
  },
  "analiza-zacienienia": {
    migawka: {
      oCoChodzi: "Тень — невидимый вор энергии: дерево, которое сегодня едва достаёт до крыши, через несколько лет может закрывать значительную часть установки.",
      jakDziala: "Для каждого шага времени в году считаю положение солнца и проверяю, не закрывает ли его какое-либо препятствие из модели участка. Суммирую потерянную энергию и делю на энергию без тени. Лиственное дерево в безлистные месяцы пропускает {tau}% прямого излучения. С данными PVGIS считаю потерю полной энергии, без них — только прямого излучения при безоблачном небе.",
      poCo: "Вы знаете, какой процент энергии за год и в каждом месяце забирает тень — и окупится ли установка через несколько лет, когда деревья вырастут.",
      fizyka: "S = Σ(1 − Π τ_p)(G_T − G_T^тень) / Σ G_T; угловая высота препятствия h_p = arctan((H − z)/d), где H — высота препятствия, z — высота точки на крыше, d — расстояние.",
    },
    pola: {
      wysokoscDachu: { nazwa: "Высота крыши над землёй [м]", cel: "Плоская крыша по контуру здания рассчитывается на этой высоте — чем выше, тем меньше препятствий её затеняет.", gdzie: "Проект здания или измерение дальномером.", zakres: "> 0. " + RU_YOURS },
      nachylenie: { ...RU_NACHYLENIE, nazwa: "Наклон панелей [°]", gdzie: "Планируемая монтажная конструкция панелей." },
      azymut: { ...RU_AZYMUT, nazwa: "Азимут панелей [°]", gdzie: "Планируемое направление панелей — отсчёт от севера по часовой стрелке." },
      horyzont: { nazwa: "Горизонт прогноза [лет]", cel: "Через сколько лет проверить затенение от деревьев, которые ещё вырастут.", gdzie: "Обычно срок, в течение которого вы планируете пользоваться установкой.", zakres: "Число лет ≥ 0." },
      wysokoscPrognoza: { nazwa: "Прогнозная высота дерева [м]", cel: "Высота, которой дерево достигнет через заданное число лет — анализ строит тень от дерева этой высоты.", gdzie: "Темп роста вида (питомник, лесник, дендрологическая литература) или сравнение со взрослыми деревьями этого вида поблизости.", zakres: "Не меньше сегодняшней высоты. " + RU_YOURS },
      lisciaste: { nazwa: "Лиственное дерево", cel: "Зимой, без листьев, крона пропускает {tau}% прямого излучения — отметьте, если дерево сбрасывает листья.", gdzie: "Вид дерева.", zakres: "Да / нет." },
      miesiaceBezlisci: { nazwa: "Безлистные месяцы", cel: "В отмеченные месяцы кроны лиственных деревьев пропускают {tau}% прямого излучения.", gdzie: "Наблюдение за деревьями в вашей местности — период зависит от вида и климата.", zakres: "Любые месяцы. " + RU_YOURS },
    },
  },
  "orientacja-powierzchni": {
    migawka: {
      oCoChodzi: "Не каждая стена и скат крыши одинаково подходят для панелей — этот экран сразу показывает, где вложение окупится лучше всего.",
      jakDziala: "Для каждой поверхности суммирую годовое излучение, падающее на неё час за часом из типичного метеорологического года: прямое, рассеянное (модель Муниера) и отражённое от земли. Сравниваю результат с оптимальной ориентацией в вашем месте — рейтинг в процентах от оптимума.",
      poCo: "Вы знаете, какие поверхности дают больше всего энергии и сколько теряете на каждой хуже ориентированной — до перехода к проектированию в модуле 3.",
      fizyka: "H = Σ[G_b,n·max(cos θ, 0) + G_dT (Муниер) + G_h·ρ·(1 − cos β)/2]·Δt; W = H / H_opt.",
    },
    pola: {
      nachylenie: { ...RU_NACHYLENIE, gdzie: "Значение из Сканера участка (подсказка в поле) — вводите поправку, только если знаете более точное. Пусто = значение Сканера." },
      azymut: { ...RU_AZYMUT, gdzie: "Значение из Сканера участка (подсказка в поле) — вводите поправку, только если знаете более точное. Пусто = значение Сканера." },
      nazwa: { nazwa: "Название поверхности", cel: "Только метка в рейтинге — не влияет на результат.", gdzie: "Любое, напр. «Западная стена гаража».", zakres: "Текст." },
      nachylenieReczne: RU_NACHYLENIE,
      azymutReczny: RU_AZYMUT,
      albedo: { nazwa: "Альбедо грунта [–]", cel: "Доля света, отражённого от грунта перед поверхностью — важна в основном для стен и крутых скатов.", gdzie: "Тип покрытия перед поверхностью (трава, бетон, снег) — литературное значение для этого покрытия.", zakres: "{aMin}–{aMax}. Пусто = {albedo}, как в допущениях." },
    },
  },
  "nasloneczenie-miesieczne": {
    migawka: {
      oCoChodzi: "Данные PVGIS о радиации — это типичный год для вашего района. Если у вас есть собственные измерения или вы знаете, что у вас месяц обычно выходит иначе, можно ввести собственную сумму.",
      jakDziala: "Вы вводите сумму суммарной радиации на горизонтальную плоскость (кВт·ч/м²) для выбранных месяцев. Приложение умножает почасовые данные PVGIS этого месяца на один коэффициент (введённое ÷ PVGIS), поэтому форма суток и доля рассеянной радиации сохраняются, а сумма совпадает. Пустой месяц остаётся без изменений.",
      poCo: "Чтобы калькуляторы считали по вашим данным, когда они есть, — не выдавая их за данные PVGIS.",
    },
    pola: {
      suma: {
        nazwa: "Сумма радиации за месяц [кВт·ч/м²]",
        cel: "Заменяет сумму PVGIS за этот месяц во всех калькуляторах радиации в приложении.",
        gdzie: "Собственные измерения пиранометром, месячные таблицы из другого источника (например, метеостанции) или результат более раннего анализа. Это должна быть суммарная радиация на ГОРИЗОНТАЛЬНУЮ плоскость, а не на плоскость панелей.",
        zakres: "Положительное число; пусто = данные PVGIS. Приложение не оценивает, реалистично ли введённое значение, — сравните его со значением PVGIS под полем.",
      },
    },
  },
}
