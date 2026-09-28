import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { FunkcjaNiezawodnosci, NiezawodnoscEsp32Input } from "./input"
import { otaBezPodpisu, otaBezRollbacku, otaBezSumyKontrolnej } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "OTA \\Rightarrow podpis \\wedge suma \\wedge rollback"

export const FUNKCJE_NIEZAWODNOSCI: readonly FunkcjaNiezawodnosci[] = [
  "kartaSd",
  "rtc",
  "podtrzymanieZasilania",
  "watchdog",
  "izolacjaGalwaniczna",
  "ochronaPrzepieciowa",
  "ota",
  "redundancjaMasterSlave",
]

export type NiezawodnoscEsp32Result = {
  liczbaWlaczonych: number
}

/**
 * Ekran 6, Moduł 9 — "Konfiguracja niezawodności" (dawne 11.29–11.50). Przełączniki bez wzorów; jedyny 🔴 źródła: OTA
 * bez weryfikacji podpisu cyfrowego. Biblia §9.49 wymaga też sumy kontrolnej i powrotu do poprzedniej wersji — ich brak
 * 🟡. Ekran liczy włączone funkcje; nie ocenia, które są obowiązkowe (źródło tego nie mówi).
 */
export function calculateNiezawodnoscEsp32(input: NiezawodnoscEsp32Input): CalcResult<NiezawodnoscEsp32Result> {
  const liczbaWlaczonych = FUNKCJE_NIEZAWODNOSCI.filter((f) => input[f]).length
  const warnings: Warning[] = []
  if (input.ota) {
    if (!input.otaPodpis) warnings.push(otaBezPodpisu())
    if (!input.otaSumaKontrolna) warnings.push(otaBezSumyKontrolnej())
    if (!input.otaRollback) warnings.push(otaBezRollbacku())
  }
  return {
    value: { liczbaWlaczonych },
    unit: "",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs: { liczbaWlaczonych },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
