/**
 * Ekran 4, Moduł 4 "Magazyn energii / baterie" — "Moduł EV — ładowanie samochodu elektrycznego"
 * (dawne 3.4, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D.
 *
 * Dobowe zapotrzebowanie EV wpisywane wprost (nie wyprowadzane z przebiegu × zużycie/km —
 * zużycie energii na km różni się mocno między modelami EV i nie jest podane w źródle jako
 * uniwersalna liczba, więc nie jest zgadywane).
 */

export type ModulEvInput = {
  /** Dobowe zapotrzebowanie na ładowanie EV [kWh]. 0 = jeszcze nie wpisano. */
  energiaDobowaEvKwh: number
  /** Dostępna nadwyżka produkcji PV latem (ponad bieżące zużycie domu) [kWh/dobę]. null = jeszcze nie wpisano (0 to legalna wartość — brak nadwyżki). */
  nadwyzkaPvLatemKwh: number | null
  /** Dostępna nadwyżka produkcji PV zimą [kWh/dobę]. null = jeszcze nie wpisano. */
  nadwyzkaPvZimaKwh: number | null
}
