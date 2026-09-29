import type { MiejsceUziemienia } from "./input"

/**
 * Miejsca wilgotne, dla których źródło zaleca uziemienie (Biblia §12.53, "Jak działa logika": "Zaleca uziemienie dla
 * instalacji w wilgotnych miejscach (jacht, na zewnątrz)"). Lista ze źródła plus namiot (D55, niżej).
 */
export const MIEJSCA_WILGOTNE_UZIEMIENIE: readonly MiejsceUziemienia[] = ["jacht", "zewnatrz", "namiot"]
// "namiot" (D55): a tent is "outdoors" in the source's sense; E23 (D44) also treats a tent as always damp.

/** Miejsca, gdzie instalacja bywa zasilana z zewnątrz (słupek na kempingu, keja) — pytanie o to zadajemy tylko tu (D55). */
export const MIEJSCA_Z_ZASILANIEM_ZEWNETRZNYM: readonly MiejsceUziemienia[] = ["kamper", "jacht"]
