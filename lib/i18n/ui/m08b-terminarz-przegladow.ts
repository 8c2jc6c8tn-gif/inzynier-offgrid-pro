/**
 * m08b-terminarz-przegladow — screen text of "Terminarz przeglądów i serwisu" (M13 7.32 without telemetry).
 */
// English: ./m08b-terminarz-przegladow.en.ts, Russian: ./m08b-terminarz-przegladow.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-TPRZ-TYTUL": "Terminarz przeglądów i serwisu",
  "UI-TPRZ-OPIS": "Wpisz, co wymaga okresowego przeglądu (np. dokręcenie złączy, kontrola akumulatorów, przegląd gaśnic, czyszczenie paneli), kiedy to ostatnio zrobiłeś i co ile miesięcy. Policzę następny termin i ile dni zostało. Interwały bierz z instrukcji swoich urządzeń — aplikacja nie zna zaleceń producentów.",
  "UI-TPRZ-NAZWA": "Co przeglądasz",
  "UI-TPRZ-OSTATNI": "Ostatni przegląd",
  "UI-TPRZ-INTERWAL": "Co ile miesięcy",
  "UI-TPRZ-DODAJ": "Dodaj pozycję",
  "UI-TPRZ-USUN": "Usuń pozycję",
  "UI-TPRZ-POZYCJA-NR": "Pozycja {n}",
  "UI-TPRZ-UZUPELNIJ": "Dodaj pierwszą pozycję, żeby zobaczyć terminy.",
  "UI-TPRZ-SPRAWDZ": "Sprawdź dane",
  "UI-TPRZ-MIES": "mies.",
  "UI-TPRZ-WERDYKT-PO": "Po terminie: {n}",
  "UI-TPRZ-WERDYKT-OK": "Wszystko w terminie",
  "UI-TPRZ-PRZYPOMNIENIA": "Przypominaj o przeglądach po terminie",
  "UI-TPRZ-PRZYPOMNIENIA-OPIS": "Powiadomienie przeglądarki pokaże się raz dziennie przy otwarciu aplikacji, gdy coś jest po terminie. Nie przyjdzie, gdy aplikacja jest zamknięta: działa offline i nie ma harmonogramu w tle.",
  "UI-TPRZ-PRZYPOMNIENIA-ZABLOKOWANE": "Przeglądarka zablokowała powiadomienia dla tej strony. Zezwól na nie w ustawieniach przeglądarki i zaznacz pole ponownie.",
  "UI-TPRZ-PRZYPOMNIENIA-BRAK-OBSLUGI": "Ta przeglądarka nie obsługuje powiadomień. Liczbę przeglądów po terminie pokazuje dzwonek na pulpicie.",
  "UI-TPRZ-TERMIN": "Następny termin: {data}",
  "UI-TPRZ-DNI-PRZED": "za {dni} dni",
  "UI-TPRZ-DNI-DZIS": "dziś",
  "UI-TPRZ-DNI-PO": "{dni} dni po terminie",
  "UI-TPRZ-BEZ-TERMINU": "Uzupełnij datę i interwał, żeby policzyć termin.",
} as const
