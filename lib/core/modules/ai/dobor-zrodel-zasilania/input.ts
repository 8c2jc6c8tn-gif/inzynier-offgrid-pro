/**
 * Moduł 10 "AI i prognozy", Ekran 4 — "Automatyczny dobór i optymalizacja źródeł zasilania" (dawne 12.7, 12.8,
 * 12.9; Wzorzec D; docs/zrodla/Tresc_Modul_10_AI_Ekrany.md). Sekcja A: PV production (live), battery SoC, forecast,
 * battery capacity and C-rate limits (cross-ref Moduł 4). Live data is entered by hand until telemetry (M13) exists.
 */
import type { HierarchiaLadowaniaInput } from "../../baterie/hierarchia-ladowania/input"

export type DoborZrodelZasilaniaInput = HierarchiaLadowaniaInput & {
  /** Cell temperature [°C] from the BMS. null = not measured yet (0 °C is a valid reading). */
  temperaturaOgniwaC: number | null
  /** Pack capacity [Ah]. 0 = not entered yet. */
  pojemnoscAh: number
  /**
   * Charging current the active source could give now [A] (e.g. PV surplus ÷ battery voltage, or the charger's
   * maximum). 0 = not entered — then only the temperature limit is shown.
   */
  pradMozliwyA: number
}
