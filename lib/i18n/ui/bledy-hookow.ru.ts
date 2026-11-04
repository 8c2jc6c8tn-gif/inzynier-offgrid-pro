// Russian texts of ./bledy-hookow.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./bledy-hookow"

type Klucz = keyof typeof pl

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
  "UI-ASYAI-BLAD-PUSTE-PYTANIE": "Напишите вопрос.",
  "UI-ASYAI-BLAD-NIESKONFIGUROWANY": "ИИ-ассистент ещё не настроен — добавьте ключ ANTHROPIC_API_KEY в переменные окружения сервера.",
  "UI-ASYAI-BLAD-ODMOWA": "Ассистент отказался отвечать на этот вопрос.",
  "UI-ASYAI-BLAD-ZA-DLUGO": "Ассистент не завершил ответ за разумное число шагов — задайте вопрос проще.",
  "UI-ASYAI-BLAD-OGOLNY": "ИИ-ассистент столкнулся с ошибкой — повторите попытку.",
  "UI-BLAD-PASSKEY-NIESKONFIGUROWANE": "Вход по ключу доступа ещё не настроен.",
  "UI-BLAD-PASSKEY-WYLACZONE": "Ключи доступа ещё не включены в настройках сервиса входа.",
  "UI-BLAD-PASSKEY-NIEOBSLUGIWANE": "Этот браузер не поддерживает ключи доступа.",
  "UI-BLAD-PASSKEY-ANULOWANO": "Подтверждение на устройстве отменено или не завершено. Попробуйте ещё раз.",
  "UI-BLAD-PASSKEY-CEREMONIA": "Устройство не завершило подтверждение. Попробуйте ещё раз или воспользуйтесь ссылкой из письма.",
  "UI-BLAD-PASSKEY-LOGOWANIE": "Не удалось войти с ключом доступа. Попробуйте ещё раз или воспользуйтесь ссылкой из письма.",
  "UI-BLAD-PASSKEY-REJESTRACJA": "Не удалось добавить ключ доступа. Попробуйте ещё раз.",
  "UI-BLAD-PASSKEY-LIMIT": "Достигнуто максимальное число ключей доступа для аккаунта. Удалите ненужный ключ и попробуйте ещё раз.",
  "UI-BLAD-PASSKEY-LISTA": "Не удалось загрузить ключи доступа.",
  "UI-BLAD-PASSKEY-USUWANIE": "Не удалось удалить ключ доступа.",
}
