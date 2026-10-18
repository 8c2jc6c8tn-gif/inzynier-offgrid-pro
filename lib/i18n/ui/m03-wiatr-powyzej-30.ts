/**
 * m03-wiatr-powyzej-30 — screen text of the "wind on panels tilted above 30°" estimate (Module 3). Engine messages:
 * `dictionary-*.ts` (`WP30-*`); help: `../pomoc/m03d-wiatr-powyzej-30.ts`.
 */
export const pl = {
  "UI-WIAPOW30-TYTUL": "Wiatr dla paneli pod kątem powyżej 30°",
  "UI-WIAPOW30-OPIS": "Norma (Eurokod, Tablica 7.6) opisuje wiatr na panele na konstrukcji tylko do 30° nachylenia. Dla stromszych paneli, na przykład ustawionych pod niskie zimowe słońce albo pionowo, nie podaje współczynników. Ten ekran daje SZACUNEK aplikacji, nie wynik normowy.",
  "UI-WIAPOW30-NACHYLENIE": "Nachylenie paneli",
  "UI-WIAPOW30-WYSOKOSC-KONSTRUKCJI": "Wysokość konstrukcji nad terenem",
  "UI-WIAPOW30-WYPELNIJ": "Wpisz nachylenie powyżej 30° oraz dane miejsca: strefę wiatrową, wysokość n.p.m., kategorię terenu i wysokość konstrukcji.",
  "UI-WIAPOW30-SPRAWDZ": "Nie da się policzyć — sprawdź wpisane wartości.",
  "UI-WIAPOW30-POZA-ZAKRESEM": "Ten kąt obejmuje norma — zobacz wynik normowy",
  "UI-WIAPOW30-SZACUNEK": "🔎 Szacunek aplikacji, nie wynik normy",
  "UI-WIAPOW30-QP": "Szczytowe ciśnienie prędkości wiatru q_p: {qp} Pa (q_b = {qb} Pa, c_e = {ce}).",
  "UI-WIAPOW30-DOCISK": "Docisk (w dół): środek {srodek} Pa, krawędź {krawedz} Pa.",
  "UI-WIAPOW30-ODRYWANIE": "Odrywanie (ssanie): środek {srodek} Pa, krawędź {krawedz} Pa.",
}

export const en: Record<keyof typeof pl, string> = {
  "UI-WIAPOW30-TYTUL": "Wind on panels tilted above 30°",
  "UI-WIAPOW30-OPIS": "The standard (Eurocode, Table 7.6) describes wind on panels on a support structure only up to a 30° tilt. For steeper panels, for example set for the low winter sun or vertical, it gives no coefficients. This screen gives an ESTIMATE by the app, not a result of the standard.",
  "UI-WIAPOW30-NACHYLENIE": "Panel tilt",
  "UI-WIAPOW30-WYSOKOSC-KONSTRUKCJI": "Structure height above ground",
  "UI-WIAPOW30-WYPELNIJ": "Enter a tilt above 30° and the site data: wind zone, height above sea level, terrain category and structure height.",
  "UI-WIAPOW30-SPRAWDZ": "Cannot be calculated — check the entered values.",
  "UI-WIAPOW30-POZA-ZAKRESEM": "The standard covers this angle — see the standard-based result",
  "UI-WIAPOW30-SZACUNEK": "🔎 An estimate by the app, not a result of the standard",
  "UI-WIAPOW30-QP": "Peak wind velocity pressure q_p: {qp} Pa (q_b = {qb} Pa, c_e = {ce}).",
  "UI-WIAPOW30-DOCISK": "Pressure (downwards): centre {srodek} Pa, edge {krawedz} Pa.",
  "UI-WIAPOW30-ODRYWANIE": "Uplift (suction): centre {srodek} Pa, edge {krawedz} Pa.",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-WIAPOW30-TYTUL": "Ветер на панели с наклоном более 30°",
  "UI-WIAPOW30-OPIS": "Норма (Еврокод, таблица 7.6) описывает ветер на панели на опорной конструкции только до наклона 30°. Для более крутых панелей, например под низкое зимнее солнце или вертикальных, коэффициентов она не даёт. Этот экран показывает ОЦЕНКУ приложения, а не результат нормы.",
  "UI-WIAPOW30-NACHYLENIE": "Наклон панелей",
  "UI-WIAPOW30-WYSOKOSC-KONSTRUKCJI": "Высота конструкции над землёй",
  "UI-WIAPOW30-WYPELNIJ": "Введите наклон более 30° и данные места: ветровой район, высоту над уровнем моря, категорию местности и высоту конструкции.",
  "UI-WIAPOW30-SPRAWDZ": "Рассчитать нельзя — проверьте введённые значения.",
  "UI-WIAPOW30-POZA-ZAKRESEM": "Этот угол охвачен нормой — смотрите нормативный результат",
  "UI-WIAPOW30-SZACUNEK": "🔎 Оценка приложения, а не результат нормы",
  "UI-WIAPOW30-QP": "Пиковое скоростное давление ветра q_p: {qp} Па (q_b = {qb} Па, c_e = {ce}).",
  "UI-WIAPOW30-DOCISK": "Прижим (вниз): центр {srodek} Па, край {krawedz} Па.",
  "UI-WIAPOW30-ODRYWANIE": "Отрыв (всасывание): центр {srodek} Па, край {krawedz} Па.",
}
