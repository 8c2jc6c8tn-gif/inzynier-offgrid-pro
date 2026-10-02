/**
 * komponenty-lokalizacja — screen text migrated from JSX (D58, ratchet list). Screens: components/lokalizacja/lista-punktow.tsx, components/lokalizacja/mapa-dzialki.tsx, components/lokalizacja/sekcja-dane-nasloniecznienia.tsx, components/lokalizacja/temperatury-z-pvgis.tsx, components/lokalizacja/widok-3d.tsx, components/lokalizacja/wykresy-zacienienia.tsx.
 */
export const pl = {
  "UI-LISPUN-BRAK-PUNKTOW": "Brak punktów.",
  "UI-LISPUN-WYSOKOSC-PUNKTU": "Wysokość punktu {p}",
  "UI-LISPUN-PUNKTOW-POKAZ-LISTE": "{length} punktów — pokaż listę",
  "UI-LISPUN-WYS": "wys.",
  "UI-LISPUN-USUN-PUNKT": "Usuń punkt {p}",
  "UI-MAPDZI-MAPA-DZIALKI": "Mapa działki",
  "UI-SEKDANNAS-DANE-NASLONECZNIENIA": "Dane nasłonecznienia",
  "UI-SEKDANNAS-EKRAN": "→ Ekran 2",
  "UI-SEKDANNAS-EKRAN-2": "→ Ekran 1",
  "UI-SEKDANNAS-LOKALIZACJA": "Lokalizacja: {szerokosc}°, {dlugosc}° — z: {zrodlo}",
  "UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY":
    "Typowy rok meteorologiczny PVGIS ({bazaPromieniowania}, lata {rokOd}–{rokDo}), zapisany na urządzeniu {p} — działa offline.",
  "UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE":
    "Potrzebne godzinowe dane nasłonecznienia z PVGIS (Komisja Europejska) — pobierane raz, potem zapisane na urządzeniu.",
  "UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ": "Brak połączenia — pobierz dane, gdy będziesz online.",
  "UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ":
    "Brak lokalizacji — zbierz model działki (Ekran 2) albo wpisz współrzędne na Ekranie 1.",
  "UI-SEKDANNAS-POBIERAM-PVGIS": "Pobieram z PVGIS…",
  "UI-SEKDANNAS-POBIERZ-PONOWNIE": "Pobierz ponownie",
  "UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA": "Pobierz dane nasłonecznienia (PVGIS)",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC":
    "Temperatury może wstawić aplikacja z danych PVGIS dla Twojej lokalizacji — najpierw wpisz współrzędne na",
  "UI-TEMZPVG-ALBO-ZBIERZ": "albo zbierz",
  "UI-TEMZPVG-EKRANIE-LOKALIZACJI": "Ekranie 1 Lokalizacji",
  "UI-TEMZPVG-MODEL-DZIALKI": "model działki",
  "UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU":
    "Średnie miesięczne temperatury powietrza z typowego roku meteorologicznego PVGIS (baza {bazaMeteo}, lata {rokOd}–{rokDo}) dla lokalizacji projektu: od {p} do {p2} °C.",
  "UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS": "Wstaw temperatury z PVGIS",
  "UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ": "Brak połączenia — pobierz dane, gdy będziesz online.",
  "UI-TEMZPVG-DANE-PVGIS-ZAPISANE":
    "Dane PVGIS zapisane {p} nie zawierają temperatur (starsza wersja zapisu) — pobierz je ponownie.",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2":
    "Temperatury może wstawić aplikacja z danych PVGIS (Komisja Europejska) dla lokalizacji projektu — pobierane raz, potem zapisane na urządzeniu.",
  "UI-TEMZPVG-POBIERAM-PVGIS": "Pobieram z PVGIS…",
  "UI-TEMZPVG-POBIERZ-DANE-PVGIS": "Pobierz dane PVGIS",
  "UI-WID3D-WIDOK-DZIALKI-MAPA": "Widok 3D działki z mapą cieplną zacienienia",
  "UI-WYKZAC-STRATA-MIESIACACH": "Strata w miesiącach [%]",
  "UI-WYKZAC-MAKS": "maks. {max}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD": "Profil horyzontu przeszkód (wzniesienie nad horyzontem)",
  "UI-WYKZAC-OBECNIE-PELNE-PROGNOZA": "— obecnie (pełne) i prognoza (obrys)",
  "UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN": "Strata promieniowania w kolejnych miesiącach",
  "UI-WYKZAC-PROGNOZA": "{p} (prognoza): {p2}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2": "Profil horyzontu przeszkód w funkcji azymutu",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-LISPUN-BRAK-PUNKTOW": "No points.",
  "UI-LISPUN-WYSOKOSC-PUNKTU": "Height of point {p}",
  "UI-LISPUN-PUNKTOW-POKAZ-LISTE": "{length} points — show the list",
  "UI-LISPUN-WYS": "h.",
  "UI-LISPUN-USUN-PUNKT": "Remove point {p}",
  "UI-MAPDZI-MAPA-DZIALKI": "Plot map",
  "UI-SEKDANNAS-DANE-NASLONECZNIENIA": "Irradiation data",
  "UI-SEKDANNAS-EKRAN": "→ Screen 2",
  "UI-SEKDANNAS-EKRAN-2": "→ Screen 1",
  "UI-SEKDANNAS-LOKALIZACJA": "Location: {szerokosc}°, {dlugosc}° — from: {zrodlo}",
  "UI-SEKDANNAS-TYPOWY-ROK-METEOROLOGICZNY":
    "PVGIS typical meteorological year ({bazaPromieniowania}, years {rokOd}–{rokDo}), stored on the device {p} — works offline.",
  "UI-SEKDANNAS-POTRZEBNE-GODZINOWE-DANE":
    "Hourly irradiation data from PVGIS (European Commission) is needed — downloaded once, then stored on the device.",
  "UI-SEKDANNAS-BRAK-POLACZENIA-POBIERZ": "No connection — download the data when you are online.",
  "UI-SEKDANNAS-BRAK-LOKALIZACJI-ZBIERZ":
    "No location — capture the plot model (Screen 2) or enter the coordinates on Screen 1.",
  "UI-SEKDANNAS-POBIERAM-PVGIS": "Downloading from PVGIS…",
  "UI-SEKDANNAS-POBIERZ-PONOWNIE": "Download again",
  "UI-SEKDANNAS-POBIERZ-DANE-NASLONECZNIENIA": "Download irradiation data (PVGIS)",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC":
    "The app can insert the temperatures from PVGIS data for your location — first enter the coordinates on",
  "UI-TEMZPVG-ALBO-ZBIERZ": "or capture the",
  "UI-TEMZPVG-EKRANIE-LOKALIZACJI": "Location Screen 1",
  "UI-TEMZPVG-MODEL-DZIALKI": "plot model",
  "UI-TEMZPVG-SREDNIE-MIESIECZNE-TEMPERATU":
    "Monthly mean air temperatures from the PVGIS typical meteorological year (database {bazaMeteo}, years {rokOd}–{rokDo}) for the project location: from {p} to {p2} °C.",
  "UI-TEMZPVG-WSTAW-TEMPERATURY-PVGIS": "Insert temperatures from PVGIS",
  "UI-TEMZPVG-BRAK-POLACZENIA-POBIERZ": "No connection — download the data when you are online.",
  "UI-TEMZPVG-DANE-PVGIS-ZAPISANE":
    "The PVGIS data saved {p} contains no temperatures (older save format) — download it again.",
  "UI-TEMZPVG-TEMPERATURY-MOZE-WSTAWIC-2":
    "The app can insert the temperatures from PVGIS data (European Commission) for the project location — downloaded once, then stored on the device.",
  "UI-TEMZPVG-POBIERAM-PVGIS": "Downloading from PVGIS…",
  "UI-TEMZPVG-POBIERZ-DANE-PVGIS": "Download PVGIS data",
  "UI-WID3D-WIDOK-DZIALKI-MAPA": "3D view of the plot with the shading heat map",
  "UI-WYKZAC-STRATA-MIESIACACH": "Loss by month [%]",
  "UI-WYKZAC-MAKS": "max. {max}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD": "Obstacle horizon profile (elevation above the horizon)",
  "UI-WYKZAC-OBECNIE-PELNE-PROGNOZA": "— now (filled) and forecast (outline)",
  "UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN": "Radiation loss in successive months",
  "UI-WYKZAC-PROGNOZA": "{p} (forecast): {p2}%",
  "UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2": "Obstacle horizon profile as a function of azimuth",
}

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
}
