import type { IdScenariusza } from "./input"

export const SCENARIUSZE: readonly IdScenariusza[] = ["A", "B", "C", "D"]

/** Where the shortfall goes and whether the grid contract stays (`03_M14` §4 table). */
export const OPIS_SCENARIUSZA: Record<IdScenariusza, { siec: boolean; wyspa: boolean; agregat: boolean }> = {
  A: { siec: true, wyspa: false, agregat: false },
  B: { siec: true, wyspa: false, agregat: false },
  C: { siec: true, wyspa: true, agregat: false },
  D: { siec: false, wyspa: true, agregat: true },
}

/** Hours in a year — only for the RF1 average-load lower bound. */
export const GODZIN_W_ROKU = 8760
