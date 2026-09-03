/**
 * Ekran B9, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Test pojemności i
 * gęstości elektrolitu" (dawne 10.13 — docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec D — próg decyzyjny na podstawie zmierzonej gęstości elektrolitu (areometr, tylko
 * akumulatory z korkami).
 */

export type GestoscElektrolituInput = {
  /** Zmierzona gęstość elektrolitu [g/cm³]. `null` = jeszcze nie zmierzono. */
  gestoscGCm3: number | null
}
