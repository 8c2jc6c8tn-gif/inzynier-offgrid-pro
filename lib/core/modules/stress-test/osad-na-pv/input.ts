/**
 * Ekran 7, Moduł 7 "Stress-test zimowy" — "Śnieg i oblodzenie na PV" (scala dawne 6.7 + 6.20) and Ekran 14 "Wieczna
 * mgła i szadź" (dawne 6.18) — docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md; Biblia §7.7, §7.18, §7.19. One engine
 * for a deposit on the panels; Screen 14 is its rime case.
 *
 * The source gives no model of how long a deposit stays or how much light it lets through (only examples), so the
 * days covered and the production left under the deposit are entered by the user.
 */
export type RodzajOsadu = "sypki" | "mokry" | "lod" | "szadz"

export type OsadNaPvInput = {
  /** Deposit type; null = not chosen. */
  rodzaj: RodzajOsadu | null
  /** Panel tilt [°]; null = not entered. */
  katDeg: number | null
  /** Normal winter PV production per day without the deposit [kWh/day]. 0 = not entered. */
  produkcjaDobaKwh: number
  /** Days the deposit stays on the panels [days]. 0 = not entered. */
  dniZalegania: number
  /** Production left under the deposit [% of normal] (source: snow 0%, rime after 48 h 5%). */
  pozostalaProdukcjaPct: number
  /** Strings are covered unevenly (wind, different roof planes) — source 🟡 on string mismatch. */
  nierownoStringi: boolean
}
