/**
 * Ekran 22, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Bezpieczeństwo w kamperze" (dawne 8.45,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md + Biblia §12.33). Wzorzec E — checklista zależna od
 * chemii akumulatora.
 */

export type ChemiaChecklisty = "AGM" | "kwasowy" | "LiFePO4"

export type ChecklistaChemiiInput = {
  /** Chemia akumulatora. null = jeszcze nie wybrano. */
  chemia: ChemiaChecklisty | null
  /** ID pozycji checklisty potwierdzonych przez użytkownika. */
  potwierdzoneIds: string[]
}
