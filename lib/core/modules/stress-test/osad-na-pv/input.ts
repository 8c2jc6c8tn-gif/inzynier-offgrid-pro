/**
 * Ekran 7, Moduł 7 "Stress-test zimowy" — "Śnieg i oblodzenie na PV" (scala dawne 6.7 + 6.20) and Ekran 14 "Wieczna
 * mgła i szadź" (dawne 6.18) — docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md; Biblia §7.7, §7.18, §7.19. One engine
 * for a deposit on the panels; Screen 14 is its rime case.
 *
 * 2.0.0 (owner's decision 02.10.2026): the user does NOT have to know the days of cover or the % under the deposit —
 * the engine returns a „what if” table (1, 3, 5, 7 days, plus the source examples) and compares ways to deal with
 * the deposit. Own days / own % are an optional override. The heating options need the datasheet power.
 */
export type RodzajOsadu = "sypki" | "mokry" | "lod" | "szadz"

/** An option that heats the panel surface or the back of the panel: power per m² from the datasheet × area. */
export type OpcjaGrzewcza = {
  /** Datasheet power [W/m²]. 0 = not entered. */
  mocWNaM2: number
  /** Hours the heating runs to clear the panels [h]. 0 = not entered. */
  godziny: number
}

/** An automatic cleaning system: total electric power from the datasheet and the run time. */
export type OpcjaAutomatu = {
  /** Total power [W]. 0 = not entered. */
  mocW: number
  /** Hours the system runs to clear the panels [h]. 0 = not entered. */
  godziny: number
}

export type OsadNaPvInput = {
  /** Deposit type; null = not chosen. */
  rodzaj: RodzajOsadu | null
  /** Panel tilt [°]; null = not entered. */
  katDeg: number | null
  /** Normal winter PV production per day without the deposit [kWh/day]. 0 = not entered. */
  produkcjaDobaKwh: number
  /** Optional override: days the deposit stays [days]. null = not entered (the table is shown). */
  dniWlasne: number | null
  /** Optional override: production left under the deposit [% of normal]. null = the source example is used. */
  pozostalaWlasnaPct: number | null
  /** Strings are covered unevenly (wind, different roof planes) — source 🟡 on string mismatch. */
  nierownoStringi: boolean
  /** Total panel area [m²] for the W/m² options. 0 = not entered. */
  powierzchniaM2: number
  /** Heating cable on the panel surface. */
  kabel: OpcjaGrzewcza
  /** Carbon/heating film glued on the back of the panel. */
  folia: OpcjaGrzewcza
  /** Automatic cleaning system. */
  automat: OpcjaAutomatu
}
