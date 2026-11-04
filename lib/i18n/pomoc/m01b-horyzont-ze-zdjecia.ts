/**
 * Help content — Module 1, "Horizon from a photo" (Stage 2 of `docs/tor-slonca-ar-ocena.md`). The field of view of the
 * camera comes from the file or from the user (Directive #1: no hidden defaults); the geometry is computed by the app.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "horyzont-ze-zdjecia": {
    migawka: {
      oCoChodzi:
        "Zamienia zdjęcie z telefonu, zrobione w miejscu montażu paneli, na profil horyzontu: ile stopni nad poziomem sięgają drzewa, budynki i wzgórza w każdym kierunku. Profil trafia do Analizy zacienienia i pokazuje, ile energii kosztuje cię ten horyzont w ciągu roku.",
      jakDziala:
        "1) Odczytuję ze zdjęcia czas, GPS i ogniskową (EXIF) — zdjęcie nie opuszcza telefonu. 2) Z czasu i położenia liczę, gdzie było słońce. Klikasz je na zdjęciu, więc znam kierunek i nachylenie aparatu. 3) Linię horyzontu wykrywam automatycznie (granica nieba) albo rysujesz ją ręcznie. 4) Każdy punkt linii zamieniam na azymut i wysokość nad horyzontem. 5) Profil dla wielu zdjęć łączę — nowe zdjęcie zastępuje tylko kierunki, które obejmuje. 6) Silnik zacienienia liczy, ile promieniowania zasłania ten profil w ciągu roku dla Twoich paneli.",
      poCo:
        "Zimą słońce wędruje nisko, więc to drzewa i budynki po południowej stronie decydują, czy panele w ogóle zobaczą światło. Na mapie widać budynek sąsiada, ale nie widać gałęzi, komina ani wzgórza za płotem. Zdjęcie z miejsca montażu pokazuje to, co naprawdę zasłania słońce — przed zakupem paneli, nie po.",
      fizyka:
        "Aparat modelujemy jako kamerę otworkową bez przechyłu bocznego. Ogniskowa w pikselach to f = (w/2)/tan(HFOV/2), albo z ogniskowej równoważnej 35 mm: f = f35 · przekątna_px / 43,27 mm. Promień przez piksel (x, y): d = u·prawo + v·góra + f·przód, gdzie u = x − w/2, v = h/2 − y. Wysokość promienia zależy tylko od nachylenia aparatu θ: sin h = (v cos θ + f sin θ)/|d|, więc z jednego kliknięcia w słońce (znane h i azymut) nachylenie wynika wprost, a azymut środka to azymut słońca minus atan2(u, f cos θ − v sin θ). Położenie słońca: algorytm NOAA/Meeusa z poprawką na załamanie. Dla każdego azymutu (co 1°) zapisuję najwyższą linię horyzontu — to ostrożne dla uzysku PV.",
    },
    pola: {
      zdjecie: {
        nazwa: "Zdjęcie z miejsca montażu",
        cel: "Źródło linii horyzontu. Przetwarzam je tylko w Twoim telefonie; zapisuję wyliczony profil, nie zdjęcie.",
        gdzie: "Zrób je w miejscu, gdzie staną panele, najlepiej z słońcem w kadrze, aparatem trzymanym poziomo i prosto.",
        zakres: "Zdjęcie JPEG lub PNG z aparatu (nie panorama, nie ultraszeroki kąt).",
      },
      hfov: {
        nazwa: "Poziomy kąt widzenia aparatu [°]",
        cel: "Określa, ile stopni horyzontu mieści się na szerokości zdjęcia. Bez niego nie da się zamienić pikseli na kąty. Gdy plik ma ogniskową równoważną 35 mm, policzę go sam.",
        gdzie: "Dane techniczne telefonu (aparat główny) albo test: stań w znanej odległości od ściany o znanej szerokości.",
        zakres: "10–150°. Aplikacja nie podaje wartości domyślnej — to cecha Twojego aparatu.",
      },
      kalibracja: {
        nazwa: "Jak ustalić kierunek zdjęcia",
        cel: "Aby wiedzieć, jaki azymut ma środek zdjęcia, potrzebny jest punkt odniesienia. Słońce o znanym położeniu daje kierunek i nachylenie jednocześnie; kompas daje tylko azymut.",
        gdzie: "Wybór z listy. Zalecane: słońce — jest dokładniejsze niż kompas telefonu, który bywa mylony przez metal i elektronikę.",
        zakres: "Słońce na zdjęciu albo azymut z kompasu.",
      },
      szerokosc: {
        nazwa: "Szerokość geograficzna zdjęcia [°]",
        cel: "Razem z długością i czasem wyznacza położenie słońca w chwili zdjęcia.",
        gdzie: "Odczytana z pliku (GPS), a jeśli jej tam nie ma — z projektu. Możesz ją poprawić.",
        zakres: "−90° do 90°.",
      },
      dlugosc: {
        nazwa: "Długość geograficzna zdjęcia [°]",
        cel: "Razem z szerokością i czasem wyznacza położenie słońca w chwili zdjęcia.",
        gdzie: "Odczytana z pliku (GPS), a jeśli jej tam nie ma — z projektu. Możesz ją poprawić.",
        zakres: "−180° do 180°.",
      },
      czas: {
        nazwa: "Data i godzina zdjęcia (czas lokalny)",
        cel: "Od niej zależy, gdzie na niebie było słońce. Błąd rzędu minuty to ok. 0,25° azymutu, więc zegar telefonu wystarcza.",
        gdzie: "Odczytana z pliku (EXIF). Bez strefy czasowej w pliku przyjmuję czas urzędowy Polski.",
        zakres: "Dowolna data i godzina, gdy słońce było nad horyzontem.",
      },
      azymutSrodka: {
        nazwa: "Azymut środka zdjęcia [°]",
        cel: "Kierunek, w którym patrzył aparat — gdy nie kalibrujesz po słońcu. Wszystkie azymuty horyzontu wyliczam względem niego.",
        gdzie: "Kompas (północ = 0°, wschód = 90°, południe = 180°, zachód = 270°) w chwili zdjęcia albo mapa.",
        zakres: "0–360°. Błąd kompasu telefonu to zwykle kilka do kilkunastu stopni.",
      },
      nachylenieKamery: {
        nazwa: "Nachylenie aparatu [°]",
        cel: "O ile aparat był zadarty do góry (+) albo opuszczony (−) względem poziomu. Bez niego wysokość horyzontu byłaby zafałszowana.",
        gdzie: "Aplikacja poziomicy w telefonie albo oszacowanie: 0° przy prostym ustawieniu.",
        zakres: "−90° do 90°.",
      },
      nachyleniePaneli: {
        nazwa: "Nachylenie paneli [°]",
        cel: "Potrzebne do policzenia, ile energii kosztuje horyzont — panele stojące stromo i płasko tracą w różnych porach roku.",
        gdzie: "Zaplanowany kąt stelaża.",
        zakres: "0° (płasko) do 90° (pionowo).",
      },
      azymutPaneli: {
        nazwa: "Azymut paneli [°]",
        cel: "Kierunek, w który patrzą panele; wskazuje, które fragmenty horyzontu naprawdę mają znaczenie.",
        gdzie: "Kompas lub mapa: północ = 0°, wschód = 90°, południe = 180°, zachód = 270°.",
        zakres: "0–360°.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "horyzont-ze-zdjecia": {
    migawka: {
      oCoChodzi:
        "Turns a phone photo taken where the panels will stand into a horizon profile: how many degrees above the level trees, buildings and hills reach in every direction. The profile goes to the Shading analysis and shows how much energy this horizon costs you during the year.",
      jakDziala:
        "1) I read the time, GPS and focal length (EXIF) from the photo — the photo never leaves your phone. 2) From the time and place I compute where the sun was. You click it on the photo, so I know the direction and tilt of the camera. 3) The horizon line is detected automatically (the edge of the sky) or you draw it by hand. 4) Every point of the line becomes an azimuth and an elevation above the horizon. 5) I merge the profile for many photos — a new photo replaces only the directions it covers. 6) The shading engine computes how much radiation this profile blocks during the year for your panels.",
      poCo:
        "In winter the sun travels low, so the trees and buildings on the south side decide whether the panels see any light at all. A map shows the neighbour's building but not the branches, the chimney or the hill behind the fence. A photo from the panel site shows what really blocks the sun — before you buy the panels, not after.",
      fizyka:
        "The camera is modelled as a pinhole camera without sideways roll. The focal length in pixels is f = (w/2)/tan(HFOV/2), or from the 35 mm-equivalent focal length: f = f35 · diagonal_px / 43.27 mm. The ray through pixel (x, y): d = u·right + v·up + f·forward, where u = x − w/2, v = h/2 − y. The elevation of the ray depends only on the camera tilt θ: sin h = (v cos θ + f sin θ)/|d|, so one click on the sun (known h and azimuth) gives the tilt directly, and the azimuth of the centre is the sun's azimuth minus atan2(u, f cos θ − v sin θ). Sun position: the NOAA/Meeus algorithm with refraction. For every azimuth (1° steps) I keep the highest skyline — conservative for PV yield.",
    },
    pola: {
      zdjecie: {
        nazwa: "Photo from the panel site",
        cel: "The source of the horizon line. I process it only on your phone; I save the computed profile, not the photo.",
        gdzie: "Take it where the panels will stand, ideally with the sun in the frame, the camera held level and upright.",
        zakres: "A JPEG or PNG photo from the camera (not a panorama, not the ultra-wide lens).",
      },
      hfov: {
        nazwa: "Horizontal field of view of the camera [°]",
        cel: "Sets how many degrees of the horizon fit across the width of the photo. Without it pixels cannot be turned into angles. If the file has a 35 mm-equivalent focal length I compute it myself.",
        gdzie: "The phone's specification (main camera), or a test: stand at a known distance from a wall of known width.",
        zakres: "10–150°. The app gives no default value — it is a property of your camera.",
      },
      kalibracja: {
        nazwa: "How to find the direction of the photo",
        cel: "To know the azimuth of the photo centre we need a reference. The sun at a known position gives the direction and tilt at once; a compass gives only the azimuth.",
        gdzie: "Pick from the list. Recommended: the sun — it is more accurate than a phone compass, which metal and electronics can mislead.",
        zakres: "The sun on the photo, or an azimuth from a compass.",
      },
      szerokosc: {
        nazwa: "Latitude of the photo [°]",
        cel: "Together with the longitude and time it gives the sun's position at the moment of the photo.",
        gdzie: "Read from the file (GPS), otherwise from the project. You can correct it.",
        zakres: "−90° to 90°.",
      },
      dlugosc: {
        nazwa: "Longitude of the photo [°]",
        cel: "Together with the latitude and time it gives the sun's position at the moment of the photo.",
        gdzie: "Read from the file (GPS), otherwise from the project. You can correct it.",
        zakres: "−180° to 180°.",
      },
      czas: {
        nazwa: "Date and time of the photo (local time)",
        cel: "It decides where the sun was in the sky. An error of a minute is about 0.25° of azimuth, so the phone clock is good enough.",
        gdzie: "Read from the file (EXIF). Without a time zone in the file I assume official Polish time.",
        zakres: "Any date and time when the sun was above the horizon.",
      },
      azymutSrodka: {
        nazwa: "Azimuth of the photo centre [°]",
        cel: "The direction the camera looked — when you do not calibrate by the sun. All horizon azimuths are computed relative to it.",
        gdzie: "A compass (north = 0°, east = 90°, south = 180°, west = 270°) at the time of the photo, or a map.",
        zakres: "0–360°. A phone compass error is usually a few to a dozen or so degrees.",
      },
      nachylenieKamery: {
        nazwa: "Camera tilt [°]",
        cel: "How far the camera was tilted up (+) or down (−) from the level. Without it the horizon elevation would be distorted.",
        gdzie: "The phone's level app, or an estimate: 0° when held upright.",
        zakres: "−90° to 90°.",
      },
      nachyleniePaneli: {
        nazwa: "Panel tilt [°]",
        cel: "Needed to compute how much energy the horizon costs — steep and flat panels lose at different times of the year.",
        gdzie: "The planned frame angle.",
        zakres: "0° (flat) to 90° (vertical).",
      },
      azymutPaneli: {
        nazwa: "Panel azimuth [°]",
        cel: "The direction the panels face; it shows which parts of the horizon really matter.",
        gdzie: "Compass or map: north = 0°, east = 90°, south = 180°, west = 270°.",
        zakres: "0–360°.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "horyzont-ze-zdjecia": {
    migawka: {
      oCoChodzi:
        "Превращает фото с телефона, сделанное там, где будут стоять панели, в профиль горизонта: на сколько градусов над уровнем поднимаются деревья, здания и холмы в каждом направлении. Профиль попадает в анализ затенения и показывает, сколько энергии этот горизонт отнимает за год.",
      jakDziala:
        "1) Я считываю из фото время, GPS и фокусное расстояние (EXIF) — фото не покидает ваш телефон. 2) По времени и месту вычисляю, где было солнце. Вы щёлкаете по нему на фото, и я знаю направление и наклон камеры. 3) Линия горизонта определяется автоматически (граница неба) или рисуется вами вручную. 4) Каждая точка линии превращается в азимут и высоту над горизонтом. 5) Профиль для нескольких фото объединяется — новое фото заменяет только охваченные им направления. 6) Движок затенения считает, сколько излучения этот профиль закрывает за год для ваших панелей.",
      poCo:
        "Зимой солнце идёт низко, поэтому деревья и здания с южной стороны решают, увидят ли панели свет вообще. На карте видно здание соседа, но не видно ветвей, трубы или холма за забором. Фото с места монтажа показывает то, что действительно закрывает солнце — до покупки панелей, а не после.",
      fizyka:
        "Камера моделируется как камера-обскура без бокового крена. Фокусное расстояние в пикселях f = (w/2)/tan(HFOV/2), либо из эквивалентного 35 мм: f = f35 · диагональ_px / 43,27 мм. Луч через пиксель (x, y): d = u·вправо + v·вверх + f·вперёд, где u = x − w/2, v = h/2 − y. Высота луча зависит только от наклона камеры θ: sin h = (v cos θ + f sin θ)/|d|, поэтому по одному щелчку по солнцу (известны h и азимут) наклон получается напрямую, а азимут центра равен азимуту солнца минус atan2(u, f cos θ − v sin θ). Положение солнца: алгоритм NOAA/Мея с поправкой на рефракцию. Для каждого азимута (шаг 1°) сохраняется самая высокая линия горизонта — осторожно для выработки PV.",
    },
    pola: {
      zdjecie: {
        nazwa: "Фото с места монтажа",
        cel: "Источник линии горизонта. Я обрабатываю его только в вашем телефоне; сохраняю рассчитанный профиль, а не фото.",
        gdzie: "Сделайте его там, где встанут панели, лучше с солнцем в кадре, держа камеру горизонтально и ровно.",
        zakres: "Фото JPEG или PNG с камеры (не панорама и не сверхширокий угол).",
      },
      hfov: {
        nazwa: "Горизонтальный угол обзора камеры [°]",
        cel: "Определяет, сколько градусов горизонта умещается по ширине фото. Без него пиксели нельзя перевести в углы. Если в файле есть эквивалентное фокусное расстояние 35 мм, я считаю его сам.",
        gdzie: "Характеристики телефона (основная камера) или проверка: встаньте на известном расстоянии от стены известной ширины.",
        zakres: "10–150°. Приложение не даёт значения по умолчанию — это свойство вашей камеры.",
      },
      kalibracja: {
        nazwa: "Как определить направление фото",
        cel: "Чтобы знать азимут центра фото, нужна опорная точка. Солнце с известным положением даёт сразу направление и наклон; компас — только азимут.",
        gdzie: "Выбор из списка. Рекомендуется солнце — оно точнее компаса телефона, который могут сбивать металл и электроника.",
        zakres: "Солнце на фото или азимут по компасу.",
      },
      szerokosc: {
        nazwa: "Широта места съёмки [°]",
        cel: "Вместе с долготой и временем определяет положение солнца в момент съёмки.",
        gdzie: "Считывается из файла (GPS), а если её там нет — из проекта. Можно исправить.",
        zakres: "От −90° до 90°.",
      },
      dlugosc: {
        nazwa: "Долгота места съёмки [°]",
        cel: "Вместе с широтой и временем определяет положение солнца в момент съёмки.",
        gdzie: "Считывается из файла (GPS), а если её там нет — из проекта. Можно исправить.",
        zakres: "От −180° до 180°.",
      },
      czas: {
        nazwa: "Дата и время съёмки (местное время)",
        cel: "От него зависит, где на небе было солнце. Ошибка в минуту — около 0,25° азимута, поэтому часов телефона достаточно.",
        gdzie: "Считывается из файла (EXIF). Если в файле нет часового пояса, принимаю официальное время Польши.",
        zakres: "Любая дата и время, когда солнце было над горизонтом.",
      },
      azymutSrodka: {
        nazwa: "Азимут центра фото [°]",
        cel: "Направление, в котором смотрела камера, — когда вы не калибруете по солнцу. Все азимуты горизонта считаются относительно него.",
        gdzie: "Компас (север = 0°, восток = 90°, юг = 180°, запад = 270°) в момент съёмки или карта.",
        zakres: "0–360°. Ошибка компаса телефона обычно от нескольких до десятка с лишним градусов.",
      },
      nachylenieKamery: {
        nazwa: "Наклон камеры [°]",
        cel: "Насколько камера была задрана вверх (+) или опущена (−) относительно горизонтали. Без него высота горизонта была бы искажена.",
        gdzie: "Приложение-уровень в телефоне или оценка: 0° при ровном положении.",
        zakres: "От −90° до 90°.",
      },
      nachyleniePaneli: {
        nazwa: "Наклон панелей [°]",
        cel: "Нужен, чтобы посчитать, сколько энергии отнимает горизонт, — крутые и плоские панели теряют в разное время года.",
        gdzie: "Запланированный угол каркаса.",
        zakres: "От 0° (плоско) до 90° (вертикально).",
      },
      azymutPaneli: {
        nazwa: "Азимут панелей [°]",
        cel: "Направление, куда смотрят панели; показывает, какие участки горизонта действительно важны.",
        gdzie: "Компас или карта: север = 0°, восток = 90°, юг = 180°, запад = 270°.",
        zakres: "0–360°.",
      },
    },
  },
}
