// Russian texts of ./komponenty-lokalizacja.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./komponenty-lokalizacja"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-LISPUN-BRAK-PUNKTOW": "Нет точек.",
  "UI-LISPUN-WYSOKOSC-PUNKTU": "Высота точки {p}",
  "UI-LISPUN-PUNKTOW-POKAZ-LISTE": "{length} точек — показать список",
  "UI-LISPUN-WYS": "выс.",
  "UI-LISPUN-USUN-PUNKT": "Удалить точку {p}",
  "UI-MAPDZI-MAPA-DZIALKI": "Карта участка",
  "UI-SEKDANNAS-DANE-NASLONECZNIENIA": "Данные инсоляции",
  "UI-SEKDANNAS-EKRAN": "→ Экран 2",
  "UI-SEKDANNAS-EKRAN-2": "→ Экран 1",
  "UI-SEKDANNAS-LOKALIZACJA": "Местоположение: {szerokosc}°, {dlugosc}° — из: {zrodlo}",
  "UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY":
    "Типичный метеорологический год PVGIS ({bazaPromieniowania}, {rokOd}–{rokDo} гг.), сохранён на устройстве {p} — работает офлайн.",
  "UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE":
    "Нужны почасовые данные инсоляции из PVGIS (Европейская комиссия) — загружаются один раз, затем сохраняются на устройстве.",
  "UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ": "Нет соединения — загрузите данные, когда будете онлайн.",
  "UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ":
    "Нет местоположения — соберите модель участка (Экран 2) или введите координаты на Экране 1.",
  "UI-SEKDANNAS-POBIERAM-PVGIS": "Загружаю из PVGIS…",
  "UI-SEKDANNAS-POBIERZ-PONOWNIE": "Загрузить снова",
  "UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA": "Загрузить данные инсоляции (PVGIS)",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC":
    "Приложение может вставить температуры из данных PVGIS для вашего местоположения — сначала введите координаты на",
  "UI-TEMZPVG-ALBO-ZBIERZ": "или соберите",
  "UI-TEMZPVG-EKRANIE-LOKALIZACJI": "Экране 1 «Местоположение»",
  "UI-TEMZPVG-MODEL-DZIALKI": "модель участка",
  "UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU":
    "Среднемесячные температуры воздуха из типичного метеорологического года PVGIS (база {bazaMeteo}, {rokOd}–{rokDo} гг.) для местоположения проекта: от {p} до {p2} °C.",
  "UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS": "Вставить температуры из PVGIS",
  "UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ": "Нет соединения — загрузите данные, когда будете онлайн.",
  "UI-TEMZPVG-DANE-PVGIS-ZAPISANE":
    "Данные PVGIS, сохранённые {p}, не содержат температур (старый формат сохранения) — загрузите их снова.",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2":
    "Приложение может вставить температуры из данных PVGIS (Европейская комиссия) для местоположения проекта — загружаются один раз, затем сохраняются на устройстве.",
  "UI-TEMZPVG-POBIERAM-PVGIS": "Загружаю из PVGIS…",
  "UI-TEMZPVG-POBIERZ-DANE-PVGIS": "Загрузить данные PVGIS",
  "UI-WID3D-WIDOK-DZIALKI-MAPA": "3D-вид участка с тепловой картой затенения",
  "UI-WYKZAC-STRATA-MIESIACACH": "Потеря по месяцам [%]",
  "UI-WYKZAC-MAKS": "макс. {max}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD": "Профиль горизонта препятствий (возвышение над горизонтом)",
  "UI-WYKZAC-OBECNIE-PELNE-PROGNOZA": "— сейчас (заливка) и прогноз (контур)",
  "UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN": "Потеря излучения по месяцам",
  "UI-WYKZAC-PROGNOZA": "{p} (прогноз): {p2}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2": "Профиль горизонта препятствий в зависимости от азимута",
  "UI-SEKDANNAS-NADPISANIE-TYTUL": "Собственные месячные суммы радиации (необязательно)",
  "UI-SEKDANNAS-NADPISANIE-OPIS": "Если у вас есть собственные измерения или другой источник данных, введите сумму радиации на горизонтальную плоскость для выбранных месяцев. Почасовые данные PVGIS этого месяца масштабируются так, чтобы сумма совпала; пустое поле = данные PVGIS без изменений. Относится к калькуляторам в приложении, а не к ИИ-инструменту.",
  "UI-SEKDANNAS-NADPISANIE-PVGIS": "PVGIS: {suma} кВт·ч/м²",
  "UI-SEKDANNAS-NADPISANIE-WSPOLCZYNNIK": "Масштаб относительно PVGIS: ×{k}",
  "UI-SEKDANNAS-NADPISANIE-NIEPOPRAWNE": "Значение должно быть положительным — поле игнорируется.",
  "UI-SEKDANNAS-NADPISANIE-WYCZYSC": "Вернуться к данным PVGIS",
  "UI-SEKDANNAS-TEMP-TYTUL": "Собственные средние месячные температуры",
  "UI-SEKDANNAS-TEMP-OPIS": "Введите среднюю температуру воздуха выбранных месяцев (°C), если ваше место теплее или холоднее точки PVGIS. Часовые температуры этого месяца сдвигаю на одну и ту же разность — суточный ход сохраняется, среднее равно введённому. Пустое поле = данные PVGIS.",
  "UI-SEKDANNAS-TEMP-PVGIS": "PVGIS: {temp} °C",
  "UI-SEKDANNAS-TEMP-PRZESUNIECIE": "Сдвиг: {dt} К",
  "UI-SEKDANNAS-TEMP-NIEPOPRAWNE": "Введите температуру от −60 до 60 °C или оставьте пустым.",
  "UI-SEKDANNAS-TEMP-AKTYWNE": "Свои температуры: {n} мес.",
  "UI-SEKDANNAS-NADPISANIE-AKTYWNE": "Расчёт по вашим месячным суммам ({n} из 12 месяцев).",
}
