/**
 * Ekran 1, Moduł 4 "Magazyn energii / baterie" — "Dobór pojemności baterii" (dawne 3.1,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D. Zapotrzebowanie dobowe i dni
 * autonomii docelowo "auto z Modułu 2" (Ekran 1 i Ekran 7/1.9), ale te ekrany jeszcze nie
 * istnieją w kodzie — tu jako pola ręcznego wpisu, z podpowiedzią o docelowym auto-uzupełnieniu.
 */

export type DoborPojemnosciInput = {
  /** Zapotrzebowanie dobowe [kWh]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieDoboweKwh: number
  /** Dni autonomii — ile dni bez słońca system ma wytrzymać wyłącznie na baterii. 0 = jeszcze nie wpisano. */
  dniAutonomii: number
  /** Sprawność falownika [%], 0–100. 0 = jeszcze nie wpisano. */
  sprawnoscFalownikaPct: number
  /** DoD — głębokość rozładowania [%], 0–100. 0 = jeszcze nie wpisano. */
  dodPct: number
}
