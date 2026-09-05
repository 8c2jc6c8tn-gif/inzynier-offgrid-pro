/**
 * Ekran A2, Moduł 11 "Montaż baterii" — "Montaż mechaniczny + separacja ogniw"
 * (dawne 9.2, 9.10, docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4).
 * Docisk sprawdzany wzorcem "echo" — reużywa progu i logiki z Modułu 4/Ekran 21
 * (pozycjonowanie-ogniw), zgodnie z cross-ref źródła ("cross-ref Moduł 4, Ekran 21").
 */

export type MontazMechanicznyInput = {
  /** Docisk ogniw pryzmatycznych [kgf] — zalecany zakres 300-400 kgf (Moduł 4/Ekran 21). */
  dociskKgf: number
  /** Potwierdzone pozycje checklistu (separatory, krawędzie, obudowa). */
  potwierdzoneIds: string[]
}
