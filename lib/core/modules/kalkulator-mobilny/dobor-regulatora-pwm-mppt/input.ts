/**
 * Moduł 12 "Szybki kalkulator / tryb mobilny" — "Dobór regulatora ładowania PWM vs MPPT do
 * małej instalacji" (dawne 8.8/12.8, docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md,
 * linie 12578-12590). Wzorzec D. Luka 8.8 znaleziona i domknięta natychmiast przy audycie
 * GOD BOOK Część N (05.09.2026, `docs/rejestr-pokrycia.md`) — dopiero teraz zbudowana.
 */

export type ReguRatorPwmMpptInput = {
  /** Moc paneli [W]. 0 = jeszcze nie wpisano. */
  mocPaneliW: number
  /** Klasa napięciowa paneli (12/24/36/48V, nie Voc) [V]. 0 = jeszcze nie wpisano. */
  napiecieNominalnePaneluV: number
  /** Napięcie systemowe akumulatora (12/24/48V) [V]. 0 = jeszcze nie wpisano. */
  napiecieAkumulatoraV: number
}
