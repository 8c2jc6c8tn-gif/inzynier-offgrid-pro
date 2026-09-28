import type { Warning } from "@/lib/core/calc-result"
import type { ChemiaChecklisty } from "./input"

/**
 * Hydrogen without ventilation. Level by chemistry (owner decision 28.09.2026): flooded ("kwasowy") → 🔴 hard
 * stop — it gasses far more than VRLA; AGM (VRLA) → 🟡. Ventilation sizing (EN IEC 62485-2) not in the repo.
 */
export function brakWentylacjiOlowiowy(kod: string, chemia: Exclude<ChemiaChecklisty, "LiFePO4">): Warning {
  return {
    code: kod,
    level: chemia === "kwasowy" ? "critical" : "warning",
    i18nKey: kod,
    technicalMessage: `akumulator ołowiowy (${chemia}), pozycja wentylacji niepotwierdzona`,
  }
}

export function lifepo4Info(kod: string): Warning {
  return {
    code: kod,
    level: "info",
    i18nKey: kod,
    technicalMessage: "LiFePO4 — nie wydziela gazów przy normalnej pracy",
  }
}
