/**
 * Moduł 7 "Stress-test zimowy" — Ekran 6 "Priorytetowa strategia Zamarzanie (Freeze Protection Load Shedding)"
 * (dawne 6.6; docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Trzy poziomy odbiorników ze źródła:
 * 1 krytyczne (pompa ciepła, pompa głębinowa, przepompownia, grzałki BMS) — nigdy nie odłączane; 2 ważne
 * (oświetlenie, router, monitoring) — ostateczność; 3 komfort (zmywarka, pralka, klimatyzacja) — pierwsze.
 * Progi odłączania — echo M2/E12 (dawne 1.20), do którego źródło odsyła w sekcji A.
 */

import type { PriorytetOdbiornika } from "@/lib/core/modules/zapotrzebowanie/load-shedding/input"

export type OdbiornikZimowy = {
  nazwa: string
  mocW: number | null
  priorytet: PriorytetOdbiornika
}

export type StrategiaZamarzanieInput = {
  pojemnoscKwh: number | null
  socPct: number | null
  /** Minimum SoC, przy którym system się wyłącza (odcięcie BMS/falownika) [%]. */
  socMinPct: number | null
  sprawnoscFalownikaPct: number | null
  odbiorniki: OdbiornikZimowy[]
}
