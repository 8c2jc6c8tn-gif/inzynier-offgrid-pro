/**
 * Ekran 12, Moduł 2 "Zapotrzebowanie energetyczne" — "Macierz priorytetów odłączania (Smart
 * Load Shedding)" (dawne 1.20, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md). Wzorzec D.
 * Progi SoC (20%, 90%) podane wprost w źródle (Sekcja A) — nie wymyślone.
 */

export type PriorytetOdbiornika = 1 | 2 | 3

export type LoadSheddingInput = {
  priorytet: PriorytetOdbiornika | 0
  /** Aktualny SoC baterii [%], 0-100. null = jeszcze nie wpisano (0% to legalna, krytyczna wartość). */
  socPct: number | null
  /** Czy jest obecnie nadwyżka produkcji PV ponad bieżące zużycie. Dotyczy tylko priorytetu 3. */
  maNadwyzkePv: boolean
}
