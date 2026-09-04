/**
 * Ekran 16, Moduł 4 "Magazyn energii / baterie" — "Tryb Long Term Storage (odstawienie na
 * zimę)" (dawne 3.18, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D z elementem E —
 * dwie realne kontrole liczbowe (SoC docelowy, minimalna temperatura) plus krótki checklist
 * procedury (odłączenie, uśpienie BMS).
 */

export type LongTermStorageInput = {
  /** Docelowy SoC przed odstawieniem [%]. 0 = jeszcze nie wpisano. */
  socDocelowyPct: number
  /** Najniższa spodziewana temperatura w miejscu przechowywania [°C]. `null` = jeszcze nie wpisano. */
  temperaturaMinC: number | null
  potwierdzoneIds: string[]
}
