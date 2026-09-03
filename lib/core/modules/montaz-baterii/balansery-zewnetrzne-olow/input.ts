/**
 * Ekran B4, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Balansery zewnętrzne"
 * (scala dawne 10.4, 10.12 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Wzorzec D —
 * akumulatory kwasowe w szeregu, w przeciwieństwie do LiFePO4 z aktywnym BMS, rozjeżdżają się
 * napięciowo z czasem i wymagają balansera zewnętrznego podłączonego równolegle do każdego
 * akumulatora, gdy jest ich więcej niż jeden w szeregu.
 */

export type BalanseryZewnetrzneOlowInput = {
  /** Liczba akumulatorów w szeregu. 0 = jeszcze nie wpisano. */
  iloscAkumulatorowWSzeregu: number
  posiadaBalanserZewnetrzny: boolean
}
