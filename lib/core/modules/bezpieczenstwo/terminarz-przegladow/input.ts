/**
 * Moduł 13, widżet „Przypomnienia o przeglądach i serwisie" (dawne 7.32) bez telemetrii: terminarz z własnymi interwałami użytkownika.
 * Źródło wskazuje „harmonogram serwisowy wg zaleceń producentów", ale aplikacja nie ma tych zaleceń (Dyrektywa #1) — nazwy pozycji,
 * daty ostatniego przeglądu i interwały wpisuje użytkownik z instrukcji swoich urządzeń.
 */
export type PozycjaPrzegladu = {
  id: string
  nazwa: string
  /** Data ostatniego przeglądu, `RRRR-MM-DD`; `null` = nie wpisano. */
  ostatniPrzegladData: string | null
  /** Odstęp między przeglądami [miesiące], liczba całkowita ≥ 1; `null` = nie wpisano. */
  interwalMiesiecy: number | null
}

export type TerminarzPrzegladowInput = {
  pozycje: PozycjaPrzegladu[]
  /** Dzień odniesienia, `RRRR-MM-DD` (podawany z zewnątrz — silnik nie czyta zegara). */
  dzisiaj: string
}
