/**
 * Moduł 2 "Zapotrzebowanie" — Ekran 14 "Architektura 1-fazowa / 3-fazowa" (dawne 1.26,
 * docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, linie 153-162). Wzorzec D.
 */

export type ArchitekturaFazowaInput = {
  /** Obciążenie przypisane do fazy L1 [W]. 0 = jeszcze nie wpisano. */
  mocL1W: number
  /** Obciążenie przypisane do fazy L2 [W]. 0 = brak obciążenia na tej fazie (instalacja 1-fazowa albo faza pusta). */
  mocL2W: number
  /** Obciążenie przypisane do fazy L3 [W]. 0 = brak obciążenia na tej fazie. */
  mocL3W: number
}
