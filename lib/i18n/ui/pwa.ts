/**
 * Offline app shell text (D59, SW variant C stage 1): the update toasts of the service worker
 * (components/pwa/sw-rejestracja.tsx) and the "not found" page served offline for a URL that is
 * not in the precache (app/not-found.tsx).
 */
export const pl = {
  "UI-PWA-NOWA-TYTUL": "Jest nowa wersja aplikacji",
  // True because every calculator screen with a field autosaves its draft (check:pomoc-guard, rule 4).
  "UI-PWA-NOWA-OPIS": "Odśwież, żeby z niej korzystać. Wpisane dane formularzy zostają zapisane w szkicu.",
  "UI-PWA-ODSWIEZ": "Odśwież",
  "UI-PWA-INNA-KARTA-TYTUL": "Aplikacja zaktualizowała się w innej karcie",
  "UI-PWA-INNA-KARTA-OPIS": "Odśwież tę kartę, żeby uniknąć błędów.",
  "UI-PWA-404-TYTUL": "Nie ma takiego ekranu",
  "UI-PWA-404-OPIS":
    "Tego adresu nie ma w aplikacji albo w pamięci offline. Jeśli jesteś bez sieci, połącz się i spróbuj ponownie.",
  "UI-PWA-404-PULPIT": "Wróć na pulpit",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PWA-NOWA-TYTUL": "A new version of the app is available",
  "UI-PWA-NOWA-OPIS": "Refresh to start using it. Data entered in forms stays saved as a draft.",
  "UI-PWA-ODSWIEZ": "Refresh",
  "UI-PWA-INNA-KARTA-TYTUL": "The app was updated in another tab",
  "UI-PWA-INNA-KARTA-OPIS": "Refresh this tab to avoid errors.",
  "UI-PWA-404-TYTUL": "This screen does not exist",
  "UI-PWA-404-OPIS":
    "This address is not in the app or in the offline storage. If you are offline, connect and try again.",
  "UI-PWA-404-PULPIT": "Back to the dashboard",
}

export const ru: Record<Klucz, string> = {
  "UI-PWA-NOWA-TYTUL": "Доступна новая версия приложения",
  "UI-PWA-NOWA-OPIS": "Обновите страницу, чтобы начать ею пользоваться. Данные, введённые в формы, сохранены в черновике.",
  "UI-PWA-ODSWIEZ": "Обновить",
  "UI-PWA-INNA-KARTA-TYTUL": "Приложение обновилось в другой вкладке",
  "UI-PWA-INNA-KARTA-OPIS": "Обновите эту вкладку, чтобы избежать ошибок.",
  "UI-PWA-404-TYTUL": "Такого экрана нет",
  "UI-PWA-404-OPIS":
    "Этого адреса нет в приложении или в офлайн-памяти. Если вы без сети, подключитесь и попробуйте снова.",
  "UI-PWA-404-PULPIT": "Вернуться на главную",
}
