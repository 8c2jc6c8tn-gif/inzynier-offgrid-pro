/**
 * Offline app shell text (D59, SW variant C stage 1): the update toasts of the service worker
 * (components/pwa/sw-rejestracja.tsx), the IndexedDB version toasts (standard 5.11,
 * components/pwa/baza-wersja-listener.tsx) and the "not found" page served offline for a URL that is
 * not in the precache (app/not-found.tsx).
 */
// English: ./pwa.en.ts, Russian: ./pwa.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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
