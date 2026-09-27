/**
 * Ekran 42, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Ratowanie rozładowanego akumulatora — mała
 * instalacja" (dawne 8.70, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md + Biblia §12.58). Źródło każe
 * **odsyłać** do pełnych procedur Modułu 11 (A9 — LiFePO4, B10/B11 — ołowiowy), nie duplikować logiki.
 */

export type ChemiaRatowania = "AGM" | "kwasowy" | "LiFePO4"

export type RatowanieAkumulatoraMalyInput = {
  /** Chemia akumulatora. null = jeszcze nie wybrano. */
  chemia: ChemiaRatowania | null
  /** Opcjonalnie: zmierzone napięcie spoczynkowe akumulatora 12 V [V]. null = nie zmierzono. */
  napiecieSpoczynkoweV: number | null
}
