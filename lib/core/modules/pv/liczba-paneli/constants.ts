/** Liczba dni w miesiącach roku nieprzestępnego — kalendarz (rok typowy PVGIS TMY ma 8760 h = 365 dni). */
export const DNI_W_MIESIACU = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

export type IdOkresu = "lato" | "marPaz" | "lutLis" | "rok"

/**
 * Drabinka okresów pokrycia — D25 (decyzja właściciela projektu 25.09.2026): lato (cze–sie),
 * marzec–październik, luty–listopad, cały rok. Indeksy miesięcy: 0 = styczeń.
 */
export const OKRESY: readonly { id: IdOkresu; miesiace: readonly number[] }[] = [
  { id: "lato", miesiace: [5, 6, 7] },
  { id: "marPaz", miesiace: [2, 3, 4, 5, 6, 7, 8, 9] },
  { id: "lutLis", miesiace: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "rok", miesiace: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
]

/** Podpowiedź limitu montażowego [szt.] — praktyczny pułap wskazany przez właściciela projektu (D25), nie norma. */
export const LIMIT_MONTAZOWY_PODPOWIEDZ_SZT = 30

export const WH_NA_KWH = 1000
