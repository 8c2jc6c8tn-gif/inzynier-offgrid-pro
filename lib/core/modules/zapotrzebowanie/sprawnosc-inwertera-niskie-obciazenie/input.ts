/**
 * Moduł 2 "Zapotrzebowanie" — Ekran 10 "Sprawność inwertera przy niskim obciążeniu"
 * (dawne 1.13, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, linie 114-121). Wzorzec D.
 */

export type SprawnoscInwerteraInput = {
  /** Bieżące zapotrzebowanie [W]. 0 = jeszcze nie wpisano. */
  zapotrzebowanieW: number
  /** Znamionowa moc falownika [W]. 0 = jeszcze nie wpisano. */
  mocFalownikaW: number
  /** Sprawność falownika przy tym obciążeniu [%], z karty katalogowej lub krzywej producenta. 0 = jeszcze nie wpisano. */
  sprawnoscPct: number
}
