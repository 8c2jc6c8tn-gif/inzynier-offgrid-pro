/**
 * Ekran 6, Moduł 2 "Zapotrzebowanie energetyczne" — "Sezonowość i tryb wakacyjny" (dawne 1.8,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D.
 *
 * Źródło podaje tylko jeden przykład granic sezonu (klimatyzacja: czerwiec-wrzesień) — to
 * charakterystyka TEGO urządzenia, nie uniwersalna definicja "lata"/"zimy" dla wszystkich
 * urządzeń. Zamiast zakładać własne granice miesięcy (co byłoby wymyślaniem danych), miesiące
 * aktywności wpisuje użytkownik dla każdego urządzenia osobno.
 */

export type TypSezonowosci = "caloroczny" | "sezonowy" | "weekendowy"

export type SezonowoscInput = {
  /** Zapotrzebowanie urządzenia w okresie aktywności [kWh/dobę]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieKwhDoba: number
  typ: TypSezonowosci
  /** Miesiąc początku sezonu (1-12), tylko dla typ="sezonowy". 0 = nie dotyczy/nie wpisano. */
  miesiacOd: number
  /** Miesiąc końca sezonu (1-12), tylko dla typ="sezonowy". 0 = nie dotyczy/nie wpisano. */
  miesiacDo: number
  /** Miesiąc, dla którego sprawdzamy aktywność (1-12), tylko dla typ="sezonowy". 0 = nie wpisano. */
  aktualnyMiesiac: number
  /** Czy dzisiaj jest weekend — tylko dla typ="weekendowy". */
  czyWeekend: boolean
}
