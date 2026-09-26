/**
 * Hot water per person per day as stated by the M6 source ("norma: ok. 50 l/osobę/dobę") — shown as a
 * visible, editable starting value, never applied silently. M2/E4 gives the range 50–70 l for the
 * same quantity (`liczba-domownikow/constants.ts`); 50 is its lower bound, so the two sources agree.
 */
export const CWU_L_NA_OSOBE_ZRODLO_M6 = 50

/** Sanity bound for household size — not a norm value (M2/E4 slider stops at 6, larger homes exist). */
export const OSOB_SANITY_MAX = 50
/** Sanity bound for litres per person per day — not a norm value. */
export const LITROW_NA_OSOBE_SANITY_MAX = 500

export { DNI_MIESIECY } from "../obciazenie-cieplne/constants"
export { WSPOLCZYNNIK_KWH_NA_L_K } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
