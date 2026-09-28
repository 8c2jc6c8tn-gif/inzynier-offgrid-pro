import type { MiejsceUziemienia } from "./input"

/**
 * Miejsca wilgotne, dla których źródło zaleca uziemienie (Biblia §12.53, "Jak działa logika": "Zaleca uziemienie dla
 * instalacji w wilgotnych miejscach (jacht, na zewnątrz)"). Lista 1:1 ze źródła — bez własnych dodatków.
 */
export const MIEJSCA_WILGOTNE_UZIEMIENIE: readonly MiejsceUziemienia[] = ["jacht", "zewnatrz"]
