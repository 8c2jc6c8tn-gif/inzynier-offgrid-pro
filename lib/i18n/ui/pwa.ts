/**
 * Offline app shell text (D59, SW variant C stage 1): the update toasts of the service worker
 * (components/pwa/sw-rejestracja.tsx), the IndexedDB version toasts (standard 5.11,
 * components/pwa/baza-wersja-listener.tsx) and the "not found" page served offline for a URL that is
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
  "UI-PWA-BAZA-ODSWIEZ-TYTUL": "Odśwież tę kartę",
  "UI-PWA-BAZA-ODSWIEZ-OPIS":
    "W innej karcie działa nowsza wersja aplikacji. Ta karta nie może zapisywać danych, dopóki jej nie odświeżysz.",
  "UI-PWA-BAZA-ZABLOKOWANY-TYTUL": "Czekam na inne karty",
  "UI-PWA-BAZA-ZABLOKOWANY-OPIS":
    "Aktualizacja pamięci aplikacji czeka, aż inne otwarte karty tej aplikacji zostaną odświeżone lub zamknięte.",
  "UI-PWA-3D-BRAK-TYTUL": "Widok 3D wymaga internetu",
  "UI-PWA-3D-BRAK-OPIS":
    "Widok 3D pobiera się z sieci przy pierwszym otwarciu. Połącz się z internetem i odśwież stronę. Reszta ekranu nie zależy od widoku 3D.",
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
  "UI-PWA-BAZA-ODSWIEZ-TYTUL": "Refresh this tab",
  "UI-PWA-BAZA-ODSWIEZ-OPIS":
    "A newer version of the app is running in another tab. This tab cannot save data until you refresh it.",
  "UI-PWA-BAZA-ZABLOKOWANY-TYTUL": "Waiting for other tabs",
  "UI-PWA-BAZA-ZABLOKOWANY-OPIS":
    "The app storage update is waiting until other open tabs of this app are refreshed or closed.",
  "UI-PWA-3D-BRAK-TYTUL": "The 3D view needs the internet",
  "UI-PWA-3D-BRAK-OPIS":
    "The 3D view is downloaded the first time it is opened. Connect to the internet and refresh the page. The rest of the screen does not depend on the 3D view.",
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
  "UI-PWA-BAZA-ODSWIEZ-TYTUL": "Обновите эту вкладку",
  "UI-PWA-BAZA-ODSWIEZ-OPIS":
    "В другой вкладке работает более новая версия приложения. Эта вкладка не может сохранять данные, пока вы её не обновите.",
  "UI-PWA-BAZA-ZABLOKOWANY-TYTUL": "Ожидание других вкладок",
  "UI-PWA-BAZA-ZABLOKOWANY-OPIS":
    "Обновление хранилища приложения ждёт, пока другие открытые вкладки этого приложения будут обновлены или закрыты.",
  "UI-PWA-3D-BRAK-TYTUL": "Для 3D-вида нужен интернет",
  "UI-PWA-3D-BRAK-OPIS":
    "3D-вид загружается из сети при первом открытии. Подключитесь к интернету и обновите страницу. Остальная часть экрана не зависит от 3D-вида.",
}
