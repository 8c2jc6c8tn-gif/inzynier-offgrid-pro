/**
 * Ekran A6, Moduł 11 "Montaż baterii" — "Demontaż — procedura, SoC, odłączanie BMS"
 * (dawne 9.7, 9.14, 9.15, docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4).
 * Wzorzec E z wymuszoną kolejnością (jak A3/A4) + warunek wstępny liczony z napięcia pakietu:
 * pakiet musi być rozładowany do 3,0–3,2 V/ogniwo przed demontażem.
 */

import type { NapiecieSystemu } from "../weryfikacja-ogniw/input"

export type DemontazPakietuInput = {
  napiecieSystemu: NapiecieSystemu
  /** Zmierzone napięcie całego pakietu [V]. */
  napieciePakietuV: number
  potwierdzoneIds: string[]
}
