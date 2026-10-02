/**
 * Moduł 10, Ekran 7 — „Wykrywanie anomalii” (dawne 12.13–12.18). Built: PV production (12.13), energy consumption
 * (12.14) and the cause cascade for a PV drop (12.17). Not built: inverter (12.15) and pumps/ventilation (12.18) need
 * trends from live sensors (Moduł 13); battery (12.16) is the live form of Moduł 4 Ekran 14 (SoH) — linked.
 */
export const PODSYSTEMY = ["pv", "zuzycie"] as const
export type Podsystem = (typeof PODSYSTEMY)[number]

/**
 * 12.17, order 1:1 from the source: „analiza kaskadowa: pogoda→brud→śnieg→cień→uszkodzenie, w tej kolejności”. The
 * first four are questions; „uszkodzenie” is what remains when none of them explains the drop.
 */
export const KASKADA_PV = ["pogoda", "brud", "snieg", "cien"] as const
export type KrokKaskady = (typeof KASKADA_PV)[number]
export type PrzyczynaSpadku = KrokKaskady | "uszkodzenie"

export const KOD_PRZYCZYNY: Record<PrzyczynaSpadku, string> = {
  pogoda: "ANOM-PRZYCZYNA-POGODA",
  brud: "ANOM-PRZYCZYNA-BRUD",
  snieg: "ANOM-PRZYCZYNA-SNIEG",
  cien: "ANOM-PRZYCZYNA-CIEN",
  uszkodzenie: "ANOM-PRZYCZYNA-USZKODZENIE",
}
