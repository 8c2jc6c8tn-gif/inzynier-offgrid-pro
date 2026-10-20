/**
 * Module 4 "Magazyn energii / baterie" — "Zestawy ustawień JK BMS od autorów". The user picks one
 * author set; the engine derives pack values and checks consistency. No other input: the data
 * belong to the author, the app does not change them.
 */
export type ZestawyUstawienJkBmsInput = {
  /** Id of a set from `ZESTAWY` (`constants.ts`). "" = not chosen yet. */
  zestawId: string
}
