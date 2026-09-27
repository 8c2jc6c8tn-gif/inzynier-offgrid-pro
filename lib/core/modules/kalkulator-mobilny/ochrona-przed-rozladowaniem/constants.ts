import type { ChemiaMalegoAkumulatora } from "./input"

/**
 * Progi odcięcia dla akumulatora 12 V wprost ze źródła (Sekcja C): „Dla AGM 12V ustaw odcięcie na
 * 11,5V. Dla LiFePO4 — 11,0V”. Dla akumulatora kwasowego (zalewowego) źródło progu nie podaje — null.
 */
export const PROG_ODCIECIA_12V: Record<ChemiaMalegoAkumulatora, number | null> = {
  AGM: 11.5,
  kwasowy: null,
  LiFePO4: 11.0,
}

/** Liczba ogniw w szeregu na 12 V: ołowiowe 2 V/ogniwo → 6, LiFePO4 3,2 V/ogniwo → 4 (4S). */
export const OGNIWA_NA_12V: Record<ChemiaMalegoAkumulatora, number> = {
  AGM: 6,
  kwasowy: 6,
  LiFePO4: 4,
}
