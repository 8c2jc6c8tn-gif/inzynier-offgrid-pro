/**
 * Ekran A3b/A4b, Moduł 11 "Montaż baterii" — generator szczegółowej sekwencji montażu
 * (połączenia busbarów + okablowanie BMS), parametryzowany liczbą ogniw w szeregu.
 * Źródło: `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (TOM 2 §3, TOM 3 §2) —
 * opisane tam wprost dla 16S (2 rzędy po 8), tu uogólnione na dowolną parzystą liczbę ogniw
 * (2 rzędy po N/2), zgodnie z presetami 4S/8S/16S. Nieparzysta liczba ogniw NIE jest obsługiwana —
 * źródło opisuje wyłącznie układ dwurzędowy, nie zgadujemy układu dla liczby nieparzystej.
 */

export type SekwencjaMontazuInput = {
  /** Liczba ogniw w szeregu (Ns). 0 = jeszcze nie wybrano. */
  liczbaOgniw: number
}
