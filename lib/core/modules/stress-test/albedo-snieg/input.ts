/**
 * Module 7 "Stress-test zimowy" — Screen 9 "Analiza albedo i wydajność bifacjalna w śniegu"
 * (dawne 6.10, 6.21 → 7.10, 7.20, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Pattern D.
 *
 * The source gives no model of the gain (only example percentages), so the gain is typed in by the user (D16), with the
 * source examples shown as hints. Owner decision 04.10.2026: a separate M7 screen, not a preset of M3/E16.
 */

/** Mounting type: decides the rooftop warning and which source examples are shown as hints. */
export type TypMontazuAlbedo = "dach" | "stromy" | "pionowy-jednostronny" | "bifacjalny"

export type AlbedoSniegInput = {
  /** PV production in the period with snow on the ground, without the gain from reflected light [kWh]. 0 = not entered. */
  produkcjaOkresKwh: number
  /** Mounting type. null = not chosen. */
  typMontazu: TypMontazuAlbedo | null
  /** Extra production from the light reflected by the snow [% of the production above], typed in by the user. null = not entered. */
  zyskPct: number | null
}
