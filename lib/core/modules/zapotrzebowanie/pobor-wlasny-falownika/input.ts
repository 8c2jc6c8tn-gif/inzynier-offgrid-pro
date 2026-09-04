/**
 * Ekran 9, Moduł 2 "Zapotrzebowanie energetyczne" — "Pobór własny falownika" (dawne 1.12,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja B). Wzorzec D.
 */

export type PoborWlasnyFalownikaInput = {
  /** Pobór falownika w stanie jałowym (bez obciążenia) [W]. 0 = jeszcze nie wpisano. */
  poborJalowyW: number
}
