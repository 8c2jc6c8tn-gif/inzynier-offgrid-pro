/**
 * Ekran 4, Moduł 2 "Zapotrzebowanie energetyczne" — "Liczba domowników" (dawne 1.6,
 * docs/domena/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D-lite — prosty suwak 1-6 osób,
 * zasilający zapotrzebowanie na C.W.U. (Ekran 2, jeszcze niezbudowany), częstotliwość prania/
 * gotowania/zmywania (Ekran 3, jeszcze niezbudowany) i profil zużycia wody (cross-ref Moduł 10).
 * Tu liczony jest tylko jedyny fragment, który ma gotowy wzór 1:1 ze źródła bez zależności od
 * ekranów, które jeszcze nie istnieją: dobowe zapotrzebowanie na C.W.U. (zakres 50-70 l/osobę/dobę).
 */

export type LiczbaDomownikowInput = {
  /** 1-6, wg suwaka źródła. 0 = jeszcze nie wybrano. */
  liczbaDomownikow: number
}
