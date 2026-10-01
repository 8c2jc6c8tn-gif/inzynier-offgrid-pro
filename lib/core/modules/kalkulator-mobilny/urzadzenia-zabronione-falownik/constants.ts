/**
 * Device names the Bible lists as high-inrush loads for small inverters (Biblia §12.52: "suszarka, czajnik,
 * mikrofalówka, lodówka, elektronarzędzia"; Tresc E37: "kompresory, niektóre narzędzia z silnikiem
 * indukcyjnym"). Names only — power and start multiple come from the user's device (Directive #1).
 */
export const TYPOWE_RYZYKOWNE = [
  "UI-M12-UZF-T-SUSZARKA",
  "UI-M12-UZF-T-CZAJNIK",
  "UI-M12-UZF-T-MIKROFALOWKA",
  "UI-M12-UZF-T-LODOWKA",
  "UI-M12-UZF-T-ELEKTRONARZEDZIE",
  "UI-M12-UZF-T-KOMPRESOR",
] as const

export type OcenaUrzadzenia = "ok" | "ryzykowne" | "zabronione"
