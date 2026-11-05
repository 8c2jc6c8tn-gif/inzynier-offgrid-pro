/**
 * bledy-hookow — user-facing error texts returned by client hooks and adapters (GPS, PVGIS, background
 * calculations, account deletion, AI assistant). The hooks keep a key and translate it on return, so screens render
 * `blad` unchanged. EN/RU are drafts for native-speaker review.
 */
// English: ./bledy-hookow.en.ts, Russian: ./bledy-hookow.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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
  "UI-ASYAI-BLAD-PUSTE-PYTANIE": "Napisz pytanie.",
  "UI-ASYAI-BLAD-NIESKONFIGUROWANY": "Asystent AI nie jest jeszcze skonfigurowany — dodaj klucz ANTHROPIC_API_KEY do zmiennych środowiska serwera.",
  "UI-ASYAI-BLAD-ODMOWA": "Asystent odmówił odpowiedzi na to pytanie.",
  "UI-ASYAI-BLAD-ZA-DLUGO": "Asystent nie zakończył odpowiedzi w rozsądnej liczbie kroków — spróbuj zadać pytanie prościej.",
  "UI-ASYAI-BLAD-OGOLNY": "Asystent AI napotkał błąd — spróbuj ponownie.",
  "UI-BLAD-PASSKEY-NIESKONFIGUROWANE": "Logowanie kluczem dostępu nie jest jeszcze skonfigurowane.",
  "UI-BLAD-PASSKEY-WYLACZONE": "Klucze dostępu nie są jeszcze włączone w ustawieniach usługi logowania.",
  "UI-BLAD-PASSKEY-NIEOBSLUGIWANE": "Ta przeglądarka nie obsługuje kluczy dostępu.",
  "UI-BLAD-PASSKEY-ANULOWANO": "Potwierdzenie na urządzeniu zostało anulowane albo nie doszło do skutku. Spróbuj ponownie.",
  "UI-BLAD-PASSKEY-CEREMONIA": "Urządzenie nie dokończyło potwierdzenia. Spróbuj ponownie albo użyj linku z e-maila.",
  "UI-BLAD-PASSKEY-LOGOWANIE": "Nie udało się zalogować kluczem dostępu. Spróbuj ponownie albo użyj linku z e-maila.",
  "UI-BLAD-PASSKEY-REJESTRACJA": "Nie udało się dodać klucza dostępu. Spróbuj ponownie.",
  "UI-BLAD-PASSKEY-LIMIT": "Osiągnięto największą liczbę kluczy dostępu na koncie. Usuń niepotrzebny klucz i spróbuj ponownie.",
  "UI-BLAD-PASSKEY-LISTA": "Nie udało się wczytać kluczy dostępu.",
  "UI-BLAD-PASSKEY-USUWANIE": "Nie udało się usunąć klucza dostępu.",
  "UI-BLAD-LOGOWANIE-BRAK-EMAIL": "Podaj adres e-mail.",
  "UI-BLAD-LOGOWANIE-LINK": "Nie udało się wysłać linku logowania. Sprawdź adres i spróbuj ponownie za chwilę.",
  "UI-BLAD-LOGOWANIE-DOSTAWCA": "Logowanie tym kontem nie jest jeszcze dostępne albo się nie powiodło. Użyj linku z e-maila.",
  "UI-BLAD-LOGOWANIE-NIEPOWODZENIE": "Logowanie nie powiodło się albo link wygasł. Spróbuj ponownie.",
} as const
