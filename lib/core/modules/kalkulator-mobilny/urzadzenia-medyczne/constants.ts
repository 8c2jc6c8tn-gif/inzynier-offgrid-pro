/**
 * Minimum autonomy for a life-supporting medical device — Biblia §12.39 "Dobiera akumulator z dużym zapasem
 * (minimum 2 doby)"; owner decision 30.09.2026: "2 doby, ale jako 🟡" (the Tresc 🔴 for sizing "na styk"
 * is applied as 🟡 below 2 days) and a backup source is always recommended.
 */
export const MINIMUM_DOB_MEDYCZNE = 2

export type UrzadzenieMedyczne = "cpap" | "koncentrator-tlenu" | "inhalator" | "inne"

export const URZADZENIA_MEDYCZNE: UrzadzenieMedyczne[] = ["cpap", "koncentrator-tlenu", "inhalator", "inne"]
