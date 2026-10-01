/**
 * Ekran 16, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Czas pracy na akumulatorze samochodowym"
 * (dawne 8.14, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.14). Wzorzec D.
 */

/** Source list: starter (rozruchowy), AGM, flooded deep-cycle (kwasowy). */
export type TypAkumulatoraSamochodowego = "rozruchowy" | "agm" | "kwasowy"

export type AkumulatorSamochodowyInput = {
  /** null = not chosen yet. */
  typ: TypAkumulatoraSamochodowego | null
  /** Pojemność znamionowa [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscAh: number
  /** Napięcie akumulatora [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /**
   * Część pojemności, którą wolno zużyć [%] — od usera (Dyrektywa #1). Biblia §12.14 podaje dla
   * rozruchowego zakres „zwykle 30–50%”, bez jednej wartości. 0 = jeszcze nie wpisano.
   */
  uzytecznaPct: number
  /** Łączna moc podłączonych urządzeń pobierana z akumulatora [W]. 0 = jeszcze nie wpisano. */
  mocW: number
  /** Planowany czas pracy [h] — opcjonalny; 0 = nie podano (bez oceny planu). */
  planowanyCzasH: number
}
