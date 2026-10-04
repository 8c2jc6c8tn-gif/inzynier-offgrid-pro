/**
 * Moduł 7, Ekran 12 "Ocena ryzyka i Współczynnik Bezpieczeństwa Zimowego" (dawne 6.14;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Constants of the aggregation.
 */

/** The five components named in the source (Ekran 12, „Składowe wskaźnika”), in the source order. */
export const SKLADOWE = ["pokrycie", "autonomia", "odpornosc", "reakcja", "agregat"] as const
export type SkladowaId = (typeof SKLADOWE)[number]

export type WagiPct = Record<SkladowaId, number>

/**
 * ✅🤖 PROVISIONAL weights [%] — the source says only that every component gets a weight and gives no numbers.
 * These are the assistant's proposal, accepted by the owner „for now” (02.10.2026) and still to be reworked by
 * the owner („do dopracowania”). The user may replace them on the screen; they must sum to 100.
 */
export const DOMYSLNE_WAGI_PCT: WagiPct = {
  pokrycie: 30,
  autonomia: 25,
  odpornosc: 20,
  agregat: 15,
  reakcja: 10,
}

/** Tolerance when checking that the weights sum to 100 [percentage points] (typing 33.3 + 33.3 + 33.4). */
export const TOLERANCJA_SUMY_WAG_PKT = 0.01

/**
 * The weak-point threshold is entered by the user (owner decision D75, 04.10.2026): the source gives none — its
 * example is only „74% (dobrze, ale są słabe punkty)” — so the former self-chosen 70% was removed.
 */
