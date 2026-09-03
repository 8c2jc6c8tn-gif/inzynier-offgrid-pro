/**
 * Ekran A8, Moduł 11 "Montaż baterii" — "Ocena zużycia ogniwa po demontażu" (dawne 9.16,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4). Wzorzec E — trzy pomiary
 * do wykonania (checklist procesu, źródło nie podaje progów liczbowych dla nich) + jedna ocena
 * wizualna z realnym twardym stopem (ten sam wzorzec co "ocena wizualna" w Ekranie A1).
 */

export type OcenaZuzyciaInput = {
  /** `null` = jeszcze nie oceniono. */
  widocznePuchniecie: boolean | null
  potwierdzoneIds: string[]
}
