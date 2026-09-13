import type { CelUziemienia } from "./input"

/** Progi 1:1 ze źródła (Ekran 29, tabela testów). */
export const MIN_REZYSTANCJA_IZOLACJI_MOHM = 1
export const MAX_CZAS_ZADZIALANIA_RCD_S = 0.4

export const MAX_REZYSTANCJA_UZIEMIENIA_OHM: Record<CelUziemienia, number> = {
  odgromowa: 10,
  ochronna: 30,
}
