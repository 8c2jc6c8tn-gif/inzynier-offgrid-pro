/**
 * bledy-hookow — user-facing error texts returned by client hooks and adapters (GPS, PVGIS, background
 * calculations, account deletion). The hooks keep a key and translate it on return, so screens render
 * `blad` unchanged. EN/RU are drafts for native-speaker review.
 */
export const pl = {
  "UI-BLAD-GPS-BRAK-ZGODY": "Brak zgody na lokalizację — zezwól tej stronie na dostęp do położenia w ustawieniach przeglądarki.",
  "UI-BLAD-GPS-BRAK-POLOZENIA": "Urządzenie nie ustaliło położenia — wyjdź na otwartą przestrzeń i spróbuj ponownie.",
  "UI-BLAD-GPS-TIMEOUT": "Upłynął czas oczekiwania na sygnał GPS — spróbuj ponownie.",
  "UI-BLAD-GPS-NIEDOSTEPNY": "Ta przeglądarka nie udostępnia GPS.",
  "UI-BLAD-GPS-INNY": "Nie udało się odczytać położenia GPS.",
  "UI-BLAD-PVGIS-PARAMETRY-NIEPOPRAWNE": "Niepoprawne współrzędne lokalizacji.",
  "UI-BLAD-PVGIS-ODRZUCIL-ZAPYTANIE": "PVGIS nie ma danych dla tego miejsca (np. punkt na morzu albo poza zasięgiem bazy).",
  "UI-BLAD-PVGIS-TIMEOUT": "PVGIS nie odpowiedział na czas — spróbuj ponownie za chwilę.",
  "UI-BLAD-PVGIS-NIEDOSTEPNY": "Serwis PVGIS jest chwilowo niedostępny — spróbuj ponownie później.",
  "UI-BLAD-PVGIS-NIEOCZEKIWANY-FORMAT": "PVGIS zwrócił dane w nieoczekiwanym formacie.",
  "UI-BLAD-PVGIS-SIEC": "Brak połączenia — dane nasłonecznienia trzeba pobrać raz online, potem działają offline.",
  "UI-BLAD-OBLICZENIA-NIEPOWODZENIE": "Obliczenia nie powiodły się — spróbuj ponownie.",
  "UI-BLAD-KONTO-NIEZALOGOWANY": "Nie jesteś zalogowany.",
  "UI-BLAD-KONTO-USUWANIE-NIESKONFIGUROWANE": "Usuwanie konta nie jest jeszcze skonfigurowane (brak klucza service role w .env.local).",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-BLAD-GPS-BRAK-ZGODY": "Location permission denied — allow this site to access your location in the browser settings.",
  "UI-BLAD-GPS-BRAK-POLOZENIA": "The device could not determine its position — move to an open area and try again.",
  "UI-BLAD-GPS-TIMEOUT": "Timed out waiting for a GPS signal — try again.",
  "UI-BLAD-GPS-NIEDOSTEPNY": "This browser does not provide GPS.",
  "UI-BLAD-GPS-INNY": "Could not read the GPS position.",
  "UI-BLAD-PVGIS-PARAMETRY-NIEPOPRAWNE": "Invalid location coordinates.",
  "UI-BLAD-PVGIS-ODRZUCIL-ZAPYTANIE": "PVGIS has no data for this place (e.g. a point at sea or outside the database coverage).",
  "UI-BLAD-PVGIS-TIMEOUT": "PVGIS did not respond in time — try again in a moment.",
  "UI-BLAD-PVGIS-NIEDOSTEPNY": "The PVGIS service is temporarily unavailable — try again later.",
  "UI-BLAD-PVGIS-NIEOCZEKIWANY-FORMAT": "PVGIS returned data in an unexpected format.",
  "UI-BLAD-PVGIS-SIEC": "No connection — irradiation data must be downloaded once online, then it works offline.",
  "UI-BLAD-OBLICZENIA-NIEPOWODZENIE": "The calculation failed — try again.",
  "UI-BLAD-KONTO-NIEZALOGOWANY": "You are not signed in.",
  "UI-BLAD-KONTO-USUWANIE-NIESKONFIGUROWANE": "Account deletion is not configured yet (missing service role key in .env.local).",
}

export const ru: Record<Klucz, string> = {
  "UI-BLAD-GPS-BRAK-ZGODY": "Нет разрешения на геолокацию — разрешите сайту доступ к местоположению в настройках браузера.",
  "UI-BLAD-GPS-BRAK-POLOZENIA": "Устройство не определило положение — выйдите на открытое место и повторите попытку.",
  "UI-BLAD-GPS-TIMEOUT": "Время ожидания сигнала GPS истекло — повторите попытку.",
  "UI-BLAD-GPS-NIEDOSTEPNY": "Этот браузер не поддерживает GPS.",
  "UI-BLAD-GPS-INNY": "Не удалось считать положение GPS.",
  "UI-BLAD-PVGIS-PARAMETRY-NIEPOPRAWNE": "Неверные координаты местоположения.",
  "UI-BLAD-PVGIS-ODRZUCIL-ZAPYTANIE": "У PVGIS нет данных для этого места (например, точка в море или вне зоны покрытия базы).",
  "UI-BLAD-PVGIS-TIMEOUT": "PVGIS не ответил вовремя — повторите попытку через минуту.",
  "UI-BLAD-PVGIS-NIEDOSTEPNY": "Сервис PVGIS временно недоступен — повторите попытку позже.",
  "UI-BLAD-PVGIS-NIEOCZEKIWANY-FORMAT": "PVGIS вернул данные в неожиданном формате.",
  "UI-BLAD-PVGIS-SIEC": "Нет соединения — данные об инсоляции нужно один раз загрузить онлайн, затем они работают офлайн.",
  "UI-BLAD-OBLICZENIA-NIEPOWODZENIE": "Расчёт не удался — повторите попытку.",
  "UI-BLAD-KONTO-NIEZALOGOWANY": "Вы не вошли в систему.",
  "UI-BLAD-KONTO-USUWANIE-NIESKONFIGUROWANE": "Удаление аккаунта ещё не настроено (нет ключа service role в .env.local).",
}
