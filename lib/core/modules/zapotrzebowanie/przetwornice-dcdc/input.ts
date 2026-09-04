/**
 * Ekran 11, Moduł 2 "Zapotrzebowanie energetyczne" — "Przetwornice DC/DC" (dawne 1.17,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Wzorzec D.
 */

export type PrzetworniceDcdcInput = {
  /** Zapotrzebowanie mocy urządzenia niskonapięciowego [W]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieUrzadzeniaW: number
  /** Czy urządzenie zasilane jest bezpośrednio z magistrali (bez przetwornicy). */
  zasilanieBezposrednie: boolean
  /** Sprawność przetwornicy DC/DC [%] — domyślnie ~90-95% wg źródła. 0 = jeszcze nie wpisano. */
  sprawnoscPrzetwornicyPct: number
}
