/**
 * Moduł 10 "AI i prognozy", Ekran 7 — „Wykrywanie anomalii” (dawne 12.13–12.18, Wzorzec D z selektorem podsystemu,
 * docs/zrodla/Tresc_Modul_10_AI_Ekrany.md): „porównaj rzeczywistość z oczekiwaniem, wykryj odchylenie”.
 */
import type { KrokKaskady, Podsystem } from "./constants"

export type WykrywanieAnomaliiInput = {
  podsystem: Podsystem
  /** Expected energy for the period [kWh] — PV: for the actual sunshine (forecast/simulation); consumption: your usual. */
  oczekiwanaKwh: number
  /** Measured energy for the same period [kWh] (inverter / meter). */
  zmierzonaKwh: number
  /** Alarm threshold [%] — the user's; null = show the deviation only (the source gives examples, not a threshold). */
  progAlarmuPct: number | null
  /** 12.17 answers for a PV drop: true = this explains the drop; missing / null = not checked yet. */
  kaskada: Partial<Record<KrokKaskady, boolean | null>>
}
