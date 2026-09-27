/**
 * Moduł 7 "Stress-test zimowy" — Ekran 13 "Test sztywnienia izolacji w niskich temperaturach"
 * (dawne 6.17→7.17, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Strona zimna
 * doboru izolacji — strona gorąca (PVC ≤ 70°C, XLPE ≤ 90°C) to M5/E28 `dobor-izolacji-kabla`.
 */

export type MaterialMrozu = "PVC" | "XLPE" | "guma" | "aluminium"

export type SztywnienieIzolacjiInput = {
  /** Materiały izolacji/osłon/złączek użyte w instalacji (bez powtórzeń). */
  materialy: MaterialMrozu[]
  /** Minimalna spodziewana temperatura w miejscu montażu [°C]. null = jeszcze nie wpisano (0°C legalne). */
  temperaturaMinimalnaC: number | null
}
