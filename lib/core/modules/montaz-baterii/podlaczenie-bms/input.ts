/**
 * Ekran A4, Moduł 11 "Montaż baterii" — "Podłączenie BMS" (dawne 9.4, 9.5, 9.12,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4). Wzorzec E (checklist
 * z wymuszoną kolejnością, jak A3) z wbudowanym elementem D — procedura pre-charge ma realny
 * wzór (T = 5 × R_pre × C), nie jest tylko krokiem do odhaczenia.
 */

export type PodlaczenieBmsInput = {
  /** Pojemność wejściowa DC falownika [µF]. */
  pojemnoscFalownikaUf: number
  /** Rezystor wstępny użyty do pre-charge [Ω] — przykład ze źródła: 50Ω/50W. */
  rezystancjaPreChargeOhm: number
  potwierdzoneIds: string[]
}
