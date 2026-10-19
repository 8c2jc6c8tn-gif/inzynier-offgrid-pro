/**
 * Help content — Module 3, wind on panels tilted above 30° (estimate outside the standard). The wind zone, height above sea
 * level and terrain category reuse the help of `typ-montazu-pola`; this file covers the tilt and the structure height.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "Norma opisuje wiatr na panele na konstrukcji tylko do {maxKat}° nachylenia. Gdy ustawiasz panele stromiej, na przykład pod niskie zimowe słońce albo pionowo, żadna norma nie podaje współczynników — ten ekran daje szacunek, nie wynik normowy.",
      "jakDziala": "Podajesz nachylenie (powyżej {maxKat}° do 90°) i dane miejsca: strefę wiatrową, wysokość n.p.m., kategorię terenu i wysokość konstrukcji. Aplikacja liczy ciśnienie wiatru z Eurokodu (q_b i c_e), a współczynniki ciśnienia netto bierze z Tablicy 7.6 dla {maxKat}° i zachowuje je dla większych kątów. Wynik jest zawsze oznaczony jako szacunek. Jeśli wpiszesz też powierzchnię paneli i współczynnik φ (oraz masę własną), policzę siłę wiatru na stelaż i balast przeciw oderwaniu — tym samym wzorem co do {maxKat}°.",
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
      }
    }
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "The standard describes wind on panels on a support structure only up to a {maxKat}° tilt. When you set panels steeper, for example for the low winter sun or vertical, no standard gives coefficients — this screen gives an estimate, not a result of the standard.",
      "jakDziala": "You enter the tilt (above {maxKat}° up to 90°) and the site data: wind zone, height above sea level, terrain category and structure height. The app calculates the wind pressure from the Eurocode (q_b and c_e) and takes the net pressure coefficients from Table 7.6 at {maxKat}°, keeping them for larger angles. The result is always marked as an estimate. If you also enter the panel area and the factor φ (and the own mass), I calculate the wind force on the frame and the ballast against uplift — with the same formula as up to {maxKat}°.",
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
      }
    }
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "wiatr-powyzej-30": {
    "migawka": {
      "oCoChodzi": "Норма описывает ветер на панели на опорной конструкции только до наклона {maxKat}°. Когда вы ставите панели круче, например под низкое зимнее солнце или вертикально, ни одна норма не даёт коэффициентов — этот экран показывает оценку, а не результат нормы.",
      "jakDziala": "Вы вводите наклон (свыше {maxKat}° до 90°) и данные места: ветровой район, высоту над уровнем моря, категорию местности и высоту конструкции. Приложение считает давление ветра по Еврокоду (q_b и c_e), а коэффициенты чистого давления берёт из таблицы 7.6 при {maxKat}° и сохраняет их для больших углов. Результат всегда помечен как оценка. Если вы введёте ещё площадь панелей и коэффициент φ (и собственную массу), я посчитаю силу ветра на каркас и балласт против отрыва — по той же формуле, что и до {maxKat}°.",
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
      }
    }
  },
}
