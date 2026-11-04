// Russian texts of ./app-strony.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./app-strony"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-LOG-KONTO-WYMAGANE-PIERWSZEGO":
    "Аккаунт требуется с первого запуска (docs/standards/18-logowanie.md, 18.1) — после однократного входа приложение полностью работает офлайн.",
  "UI-LOG-ZALOGUJ-GOOGLE": "Войти через Google",
  "UI-LOG-ZALOGUJ-APPLE": "Войти через Apple",
  "UI-LOG-ALBO-MAILEM-BEZ": "или по e-mail, без пароля",
  "UI-LOG-SPRAWDZ-SKRZYNKE": "Проверьте почту",
  "UI-LOG-WYSLALISMY-LINK-ZALOGOWANIA": "— мы отправили ссылку для входа.",
  "UI-LOG-ZALOGUJ": "Войти",
  "UI-LOG-ADRES-MAIL": "Адрес e-mail",
  "UI-LOG-WYSYLANIE": "Отправка…",
  "UI-LOG-WYSLIJ-LINK-ZALOGOWANIA": "Отправить ссылку для входа",
  "UI-PUL-INZYNIER-OFFGRID-PRO": "☰ Inżynier Offgrid Pro",
  "UI-PUL-LOKALIZACJA-TEREN": "Местоположение и рельеф",
  "UI-PUL-TRYB-LIVE": "Режим Live",
  "UI-PUL-USTAWIENIA": "Настройки",
  "UI-PUL-USTAWIENIA-KAFEL": "Настройки",
  "UI-PUL-PLAKIETKA-PRO": "PRO",
  "UI-PUL-PLAKIETKA-PRO-OPIS": "Функция PRO — пока доступна без ограничений",
  "UI-PUL-PULPIT": "Панель",
  "UI-PUL-MODULOW-WIDOCZNYCH": "Видимых модулей: {length} из {length2}.",
  "UI-PUL-SKONFIGURUJ-PULPIT": "Настроить панель",
  "UI-PUL-PRZYWROC-DOMYSLNE-USTAWIENIA": "Восстановить настройки по умолчанию",
  "UI-PUL-BRAK-POWIADOMIEN": "Нет уведомлений",
  "UI-PUL-PRZEGLADY-PO-TERMINIE": "Просроченных осмотров: {n}. Открыть график.",
  "UI-PUL-WSZYSTKIE-KAFLE-UKRYTE": "Все плитки скрыты.",
  "UI-UST-PULPIT": "← Панель",
  "UI-UST-USTAWIENIA-SKONFIGURUJ-PULPI": "Настройки — Настроить панель",
  "UI-UST-POKAZ-UKRYJ-MODUL":
    "Показать/скрыть модуль, изменить порядок (↑/↓). Скрытие не удаляет модуль — его всегда можно вернуть. Изменения сохраняются автоматически в этом браузере.",
  "UI-UST-PRZYWROC-DOMYSLNE": "Восстановить по умолчанию",
  "UI-UST-PERSONALIZACJA-WYGLADU": "Персонализация внешнего вида",
  "UI-UST-MOTYW-KOLORY-CZCIONKA": "Тема, цвета и шрифт. Предпросмотр всех элементов сразу:",
  "UI-UST-WZORNIK": "/wzornik",
  "UI-UST-KOLORY": "Цвета",
  "UI-UST-CZCIONKA": "Шрифт",
  "UI-UST-JEZYK": "Язык",
  "UI-UST-DOTYCZY-KOMUNIKATOW-KTORE":
    "Касается сообщений, у которых уже есть перевод (гл. 17 стандарта — миграция идёт модуль за модулем). Остальные тексты пока отображаются на польском.",
  "UI-UST-PRZENIES-WYZEJ": "Переместить выше",
  "UI-UST-PRZENIES-NIZEJ": "Переместить ниже",
  "UI-UST-POKAZ": "Показать",
  "UI-UST-UKRYJ": "Скрыть",
  "UI-MOD-PULPIT": "← Панель",
  "UI-MOD-TYTUL": "Модуль {id} — {nazwa}",
  "UI-LOG-ZALOGUJ-KLUCZEM": "Войти с ключом доступа (лицо или отпечаток пальца)",
  "UI-LOG-KLUCZ-OCZEKIWANIE": "Ожидание подтверждения на устройстве…",
}
